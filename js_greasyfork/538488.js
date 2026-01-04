// ==UserScript==
// @name        sasdesk.com 详情item 一览
// @namespace   Violentmonkey Scripts
// @match       https://flexclient.sasdesk.com/Calls/Dashboard*
// @grant       none
// @version     1.2
// @author      lazeyliu
// @description 方便列表页查看所有内容的详情信息  2025/6/3 16:26:04
// @downloadURL https://update.greasyfork.org/scripts/538488/sasdeskcom%20%E8%AF%A6%E6%83%85item%20%E4%B8%80%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/538488/sasdeskcom%20%E8%AF%A6%E6%83%85item%20%E4%B8%80%E8%A7%88.meta.js
// ==/UserScript==
$(document).ready(function(){
    // 创建UI容器
    $("body").append(
        `<div id='infoDialog' style='width: 800px; height: 100%; top: 0; right: 0; position: fixed; overflow: auto; background-color: white; z-index: 99999;'>
            <button id='resortBtn' style='background-color: #4CAF50; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; transition: all 0.3s; margin: 8px;'>刷新排序</button>
            <div id='cont'></div>
            <div id="copyTooltip" style="position: fixed; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; display: none; z-index: 100000;"></div>
        </div>
        <style>
            #resortBtn:hover { background-color: #45a049; }
            #resortBtn:active { background-color: #3e8e41; transform: scale(0.98); }
            #cont { font-size: 12px; font-family: Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-weight: 500; -webkit-font-smoothing: antialiased; }
            #cont .item { padding: 2px 4px; margin: 1px 0; font-family: 'Segoe UI', sans-serif; position: relative; line-height: 1.3; }
            #cont .item:nth-child(even) { background-color: #f5f5f5; }
            #cont .item:nth-child(odd) { background-color: #ffffff; }
            .label { display: inline-block; padding: 1px 4px; border-radius: 2px; margin-right: 3px; font-weight: 500; cursor: pointer; }
            .label:hover { opacity: 0.9; }
            .index-label { background-color: #607D8B; color: white; }
            .name-label { color: white; transition: none; }
            .item[data-name='Unknown Caller'] .label { background-color: #9E9E9E !important; color: #E0E0E0;   }
            .item[data-name='Unknown Caller'] .label:hover { background-color: #757575 !important;  }
            .time-label { background-color: #2196F3; color: white; }
            .address-label { background-color: #9C27B0; color: white; }
            .issue { display: inline; margin-left: 4px; line-height: 1.3; cursor: pointer; }
            .issue:hover { text-decoration: underline; }
        </style>`
    );
    // 缓存DOM选择器，提高性能
    const $cont = $("#cont");
    const parents = $(".row_parent_li");
    // 处理每个项目
    parents.each(function(idx, el){
        const $el = $(el);
        const cl=$el.find(".avatar_outer").css("background-color");
        const name = $el.find(".text_with_avatar .font_weigth500").text().trim();
        const dateStr = $el.find(".column4").text().trim();
        const timeStr = $el.find(".column5").text().trim();
        const dataId = $el.attr("data-id");

        // 优化AJAX请求
        $.get("https://flexclient.sasdesk.com/CallDetails/Dashboard?l_guid=" + dataId, function(doc) {
            const $doc = $(doc);
            // 使用函数简化重复的DOM查询
            const getFieldText = (fieldName) => $doc.find(`small:contains('${fieldName}')`).parent().children(".Info_tabText_append,.Info_tabText").text().trim();

            const addr = getFieldText('Street Address');
            const appartment = getFieldText('Apartment Number');
            const ticketMsg = getFieldText('Ticket Message');
            const agentNodes = getFieldText('Agent Notes');
            const issue = getFieldText('Issue Type');
            const otherAddress = getFieldText('Other Not Listed Address');

            // 创建项目元素
            const dateTime = formatDate(parseDateString(dateStr + " " + timeStr));

            $cont.append(
                `<div class='item' date-sort='${dateTime}' data-name='${name}'>
                    <span class='label index-label'>#</span>
                    <span class='label name-label' data-name='${name}' style='background-color:${cl}'>${name}</span>
                    <span class='label time-label' data-name='${name}'>${dateStr} ${timeStr}</span>
                    <span class='label address-label'>${otherAddress?otherAddress:(/^\d+$/.test(appartment) ? `${appartment} ${addr}` : `${addr} ${appartment}` )}</span>
                    <span class='issue'>${issue || ticketMsg || agentNodes}</span>
                </div>`
            );

            // 为新添加的元素添加点击复制功能
            // setupCopyFunctionality($cont.children().last());
            resortFun();
        });
    });




    function resortFun(){
        const $items = $("#cont div.item");
        const sortedDivs = $items.sort(function(a, b) {
            return compareDates($(a).attr('date-sort'), $(b).attr('date-sort'));
        });

        // 更新DOM
        $cont.empty().append(sortedDivs);

        // 更新索引标签
        $items.each(function(index) {
            const $indexLabel = $(this).find(".index-label");
            const currentText = $indexLabel.text();
            if (currentText === '#' || /^#\d+$/.test(currentText)) {
                $indexLabel.text('#' + (index + 1).toString().padStart(2, '0'));
            }
        });

        // 重新设置复制功能
        $items.each(function() {
            setupCopyFunctionality($(this));
        });
    }

    // 排序功能
    $("#resortBtn").click(resortFun);

    // 复制功能和提示
    function setupCopyFunctionality($item) {
        $item.find('.label, .issue').on('click', function(e) {
            const text = $(this).text().trim();
            copyToClipboard(text, e);
        });
    }

    function copyToClipboard(text, event) {
        const $tooltip = $('#copyTooltip');

        // 复制文本到剪贴板
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        // 显示提示
        $tooltip.text(`已复制: ${text}`);
        $tooltip.css({
            top: event.pageY - 30 + 'px',
            left: event.pageX - 50 + 'px',
            display: 'block'
        });

        // 2秒后隐藏提示
        setTimeout(() => {
            $tooltip.fadeOut(200);
        }, 1000);
    }
});


// 优化的日期处理函数
function parseDateString(dateStr) {
    // 使用更高效的正则表达式
    const regex = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}) (AM|PM) (\d{2}):(\d{2}):(\d{2})/;
    const match = dateStr.match(regex);

    if (!match) {
        console.error('无法解析日期:', dateStr);
        // 返回当前日期作为后备，而不是抛出错误
        return new Date();
    }

    const [, month, day, year, hour, minute, period, second] = match;

    // 将12小时制转换为24小时制
    let hour24 = parseInt(hour, 10);
    if (period === 'PM' && hour24 !== 12) {
        hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
        hour24 = 0;
    }

    // 创建 Date 对象
    return new Date(year, month - 1, day, hour24, minute, second);
}

// 优化的日期格式化函数
function formatDate(date) {
    // 使用日期对象的内置方法，减少字符串操作
    return date.getFullYear() + '-' +
           padZero(date.getMonth() + 1) + '-' +
           padZero(date.getDate()) + ' ' +
           padZero(date.getHours()) + ':' +
           padZero(date.getMinutes()) + ':' +
           padZero(date.getSeconds());
}

// 辅助函数，为数字添加前导零
function padZero(num) {
    return num < 10 ? '0' + num : num;
}

// 优化的日期比较函数
function compareDates(dateStr1, dateStr2) {
    // 直接使用字符串比较，因为我们的日期格式是yyyy-MM-dd HH:mm:ss
    // 这种格式的字符串比较结果与日期比较一致
    return dateStr2.localeCompare(dateStr1);
}
