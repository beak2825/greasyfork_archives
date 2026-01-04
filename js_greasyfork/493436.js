// ==UserScript==
// @license MIT
// @name         MantisBT自动更新
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ...!
// @author       You
// @match        http://192.168.1.27:8080/*
// @match        http://182.148.48.147:2233/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/493436/MantisBT%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/493436/MantisBT%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

const addAutoRefresh = (time) => {
    var parentElement = document.querySelector('#assigned .widget-header')
    var referenceNode = document.querySelector('#assigned .hidden-xs')
    let newNode = document.querySelector('#assigned .hidden-xs').cloneNode(true)
    let isStart = JSON.parse(window.localStorage.isStart || false)
    let btn = newNode.querySelector('.btn')
    btn.href = 'javascript;'
    parentElement.insertBefore(newNode, referenceNode);
    let ineterValName = ''

    btn.addEventListener("click", function (event) {
        event.preventDefault();
        window.localStorage.isStart = !isStart
        isStart = !isStart
        btn.innerHTML = isStart ? '关闭自动刷新' : '开启自动刷新'
        if (isStart) {
            ineterValName = setInterval(_ => { document.querySelector('#sidebar .active a').click() }, time)
        } else {
            clearInterval(ineterValName)
        }
    });

    btn.innerHTML = isStart ? '关闭自动刷新' : '开启自动刷新'
    if (isStart) {
        ineterValName = setInterval(_ => { document.querySelector('#sidebar .active a').click() }, time)
    }

}
const addPrompt = () => {
    // 判断浏览器是否支持通知
    if ("Notification" in window) {
        // 请求用户授权显示通知
        Notification.requestPermission().then(function (permission) {
            const bugNum = document.querySelectorAll('#assigned  .widget-body tbody .my-buglist-bug').length
            if (bugNum) {
                document.title=`还剩${bugNum}个BUG`
               /* if (permission === "granted") {
                    // 发送通知
                    var notification = new Notification("有情况！", {
                        body: "有BUG啦",
                        icon: "path_to_notification_icon.png" // 替换为通知图标的路径
                    });
                    // 点击通知时的操作，可以打开聊天界面或相关页面
                    notification.onclick = function () { };
                }else{
                    if(window.location.search!="?iMessage=1"){
                        window.location.replace("https://192.168.1.222:5500/iMessage.html")
                    }
                }
                */
            }else{
                document.title='暂无BUG'
            }
        });
    }
}
const addSelectSearch = ()=>{
    // 获取所有select元素的集合
    var selectEls = document.getElementsByTagName("select");

    // 监听输入框的输入事件
    var selectInputEl = document.getElementById("select-input");
    selectInputEl.addEventListener("input", function() {
        // 获取输入框的值
        var inputText = selectInputEl.value;
        var pattern = new RegExp(inputText, "i");

        // 遍历所有select元素
        Array.from(selectEls).forEach(function(selectEl) {
            var options = Array.from(selectEl.options);
            var result = options.filter(function(option) {
                return pattern.test(option.text);
            });

            // 更新select元素的option
            selectEl.options.length = 0;
            result.forEach(function(option) {
                selectEl.appendChild(option.cloneNode(true));
            });
        });
    });
}

const hiddenOptions = () => {
    // 删除ID为'unassigned'的div
    var unassignedDiv = document.getElementById('unassigned');
    if (unassignedDiv !== null) {
        unassignedDiv.parentNode.removeChild(unassignedDiv);
    }

    // 删除ID为'reported'的div
    var reportedDiv = document.getElementById('reported');
    if (reportedDiv !== null) {
        reportedDiv.parentNode.removeChild(reportedDiv);
    }

    // 删除ID为'recent_mod'的div
    var recentModDiv = document.getElementById('recent_mod');
    if (recentModDiv !== null) {
        recentModDiv.parentNode.removeChild(recentModDiv);
    }

    // 删除ID为'monitored'的div
    var monitoredDiv = document.getElementById('monitored');
    if (monitoredDiv !== null) {
        monitoredDiv.parentNode.removeChild(monitoredDiv);
    }
}

function makeDraggable(element) {
    let dragStartX, dragStartY;
    let itemData;

    element.addEventListener('mousedown', function (e) {
        // 记录鼠标按下时相对于元素的位置
        dragStartX = e.clientX - element.offsetLeft;
        dragStartY = e.clientY - element.offsetTop;

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
    });

    function drag(e) {
        const leftPos = e.clientX - dragStartX
        const topPos = e.clientY - dragStartY
        // 更新元素位置
        element.style.left = leftPos + 'px';
        element.style.top = topPos + 'px';
        itemData = JSON.stringify({left: leftPos, top: topPos})
    }

    function stopDragging() {
        sessionStorage.setItem('positionInfo',itemData)
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDragging);
    }
}

// 增加搜索框
const addSearchInput = () => {
    $('head').append(`
      <style>
      .draggable-input {
          position: absolute;
          left: 460px;
          top: 140px;
          border: 1px solid #ccc;
          padding: 5px;
          background-color: white;
          cursor: move; /* 设置鼠标样式，提示用户该元素可拖动 */
          z-index: 99999; /* 确保输入框位于其他元素之上 */
       }
      </style>
      `)
    // 创建输入框元素
    var input = document.createElement('input');
    input.placeholder = '请输入...'
    input.style.visibility = 'hidden'
    input.type = 'text';
    input.className = 'draggable-input';
    const ele = document.querySelector('.row').children[0]
    if(ele.innerText.includes('过滤器')){
        input.style.visibility = 'visible'
    }else{
        input.style.visibility = 'hidden'
    }

    const posInfo = sessionStorage.getItem('positionInfo')
    if(posInfo && posInfo !== 'undefined'){
        const pos = JSON.parse(posInfo)
        input.style.left = pos.left + 'px';
        input.style.top = pos.top + 'px';
    }

    // 添加到文档中
    document.body.appendChild(input);
    // 使输入框可拖动
    makeDraggable(input);

    // 定义搜索相关变量
    let searchTimer = null;

    // 监听输入框的input事件，延迟触发搜索
    input.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(searchAndHighlight, 300); // 延迟300毫秒执行，提高性能
    });

    // 监听输入框的blur事件，触发最后一次搜索
    input.addEventListener('blur', () => {
        clearTimeout(searchTimer);
        searchAndHighlight();
    });

    function searchAndHighlight() {
        const searchValue = input.value.trim().toLowerCase();

        // 获取所有具有类名`input-xs`的下拉框
        const dropdowns = document.querySelectorAll('#filters_form_open .input-xs');

        dropdowns.forEach((dropdown) => {
            let firstOption = false
            const options = dropdown.children
            for(let key in options){
                if(key === 'length')return
                const optionText = options[key].innerText.toLowerCase();
                const isMatch = optionText.includes(searchValue);

                // 根据是否匹配设置选项的样式（高亮或取消高亮）
                options[key].style.backgroundColor = isMatch ? '#f0f0ff' : ''; // 调整背景色以示高亮，您可以自定义高亮样式
                options[key].style.color = isMatch ? '#000' : ''; // 调整字体颜色以示高亮，您可以自定义高亮样式

                // 可选：如果需要只显示匹配项，可以隐藏非匹配项
                options[key].style.display = isMatch ? 'block' : 'none';

                // 可选：如果需要选中第一个匹配项，可以在此处设置
                // if (!firstOption && isMatch && !options[key].querySelector(':checked')) {
                //     options[key].selected = true;
                //     firstOption = true
                // }else {
                //     options[key].selected = false;
                // }
            };
        });
    }
}

function matchSubstring(input, textWithPinyin) {
    // 分离汉字和拼音部分，确保至少有两个元素
    const chineseAndPinyin = textWithPinyin.split(/\s*\(\s*(.*)\s*\)\s*/);
    let chineseText = '';
    let pinyinArray = [];

    if (chineseAndPinyin.length >= 2) {
        chineseText = chineseAndPinyin[0].trim();
        pinyinArray = chineseAndPinyin[1].toLowerCase().split('');
    } else {
        // 如果没有找到拼音，整个字符串视为汉字部分
        chineseText = chineseAndPinyin[0].trim();
    }

    let preIndex = -1
    // 检查输入是否匹配汉字或拼音
    return (
        chineseText.includes(input) ||
        input.split('').every((currentValue) => {
            const findI = pinyinArray.findIndex((item)=>item ==currentValue)
            if ( findI != -1 && findI>preIndex) {
                preIndex = findI
                pinyinArray[findI] = 0
                return true
            }
            return false;
        })
    );
}

// “分派给”增加搜索功能
const smAddSearch = () => {
    $('head').append(`
      <style>
       .my-div {
           position: relative;
           display: inline-block;
           margin-left: 2px;
       }
      .my-search {
           height: 30px;
           width: 100px;
           line-height: 30px;
           vertical-align: middle !important;
           padding: 4px 6px !important;
       }
       .my-select-div {
           position: absolute;
           min-height: 30px;
           max-height: 300px;
           width: 100px;
           left: 0;
           top: -31px;
           border: 1px solid #D5D5D5;
           background-color: #fff;
           overflow: auto;
           display: none;
           z-index: 999;
       }
       .show-class {
           display: block;
       }
       .my-div-item {
           white-space: nowrap;
           overflow: hidden;
           text-overflow: ellipsis;
           padding: 1px 2px;
           cursor: pointer;
       }
       .my-div-item:hover {
           background-color: #D5D5D5;
       }
      </style>
      `)
    // 获取name为'handler_id'的select元素
    // const selectElement = document.getElementsByName('handler_id')[0]
    var $select = $('select[name="handler_id"]:first');
    if(typeof $select == 'undefined')return

    // 创建新的input元素
    var $div = $('<div class="my-div"></div>');
    var $input = $('<input type="text" placeholder="输入搜索名字" class="my-search">');
    var $selectDiv = $('<div class="my-select-div"></div>');
    $selectDiv.on('mousedown',function(e){
        var matchedOption = $select.find('option').filter( function() {
            if($(this).text() == e.target.innerText)return true
            return false
        });
        if (matchedOption.length > 0) {
            $select.val(matchedOption.val());
        }
    })

    // 将新的input元素插入到select元素之后
    $select.after($div);
    $div.append($input);
    $input.after($selectDiv);

    // 给input元素绑定focus事件
    $input.on('focus', function(event) {
        $selectDiv.addClass('show-class')
    })
    // 给input元素绑定input和blur事件
    $input.on('input blur', function(event) {
        var inputValue = $(this).val().trim().toLowerCase();
        $selectDiv.empty()

        if (event.type === 'input') {
            var matchedOption = $select.find('option').filter( function() {
                if(matchSubstring(inputValue,$(this).text())){
                    var $divItem = $(`<div class="my-div-item">${$(this).text()}</div>`);
                    $selectDiv.append($divItem)
                    $selectDiv.css("top",`-${$selectDiv.height()+5}px`)
                    return true
                }
                return false
            });
            if (matchedOption.length == 1) {
                $select.val(matchedOption.val());
            }
        } else if (event.type === 'blur') {
            $(this).val('');
            // 可以在这里做额外的失焦处理
            $selectDiv.removeClass('show-class')
            $selectDiv.empty()
            $selectDiv.css("top",`-31px`)
        }
    });

    // 初始化时将input的值清空
    $input.val('');
}

const fn = () => {
    try {
        var dom = document.getElementById("bugnote_text")
        dom ? dom.value = '产生原因：\n解决方案：\n影响范围：\n自测结果：通过' : ''
        var checkbox = document.getElementById("custom_field_5_value_9")
        checkbox ? checkbox.checked = true : ''

        // 图片BUG新窗口打开
        document.querySelectorAll('.bug-attachment-preview-image').forEach(i => {
            i.querySelector('a').target = '_bank'
        })
        // 增加输入框搜索过滤
        addSearchInput()
        smAddSearch()
        // 隐藏不需要的项目
        hiddenOptions()
        //增加自动刷新
        addAutoRefresh(60 * 1000)
        //增加弹窗提示
        addPrompt()
        //给下拉框增加搜索功能
        addSelectSearch()
    } catch (error) { console.log(error) }
}

setTimeout(fn)