// ==UserScript==
// @name         cms数据查询增强
// @version      1.0.0
// @namespace    *://cms.wangdian.cn/cms/index.php/admin/erp_data/tradetrace.html
// @description  快速添加sql（本地），快速使用sql
// @author       yd w
// @match        *://cms.wangdian.cn/cms/index.php/admin/erp_data/tradetrace.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wangdian.cn
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484300/cms%E6%95%B0%E6%8D%AE%E6%9F%A5%E8%AF%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/484300/cms%E6%95%B0%E6%8D%AE%E6%9F%A5%E8%AF%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        input {
            border: none;
            outline: none;
            background: none;
            padding: 0;
            margin: 0;
            
            border: 1px solid gray;
            border-radius: 2px;
            height: 32px;
        }
        input:focus {
           
            border: 1px solid #007bff; 
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
        }
        .sql_div_wrapper {
            width: 100%;
            margin-top: 8px;
            word-wrap: break-word;

        }
        .sql_div {
            max-height: 96px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: break-word;
            margin-top: 4px;
        }

    `);

    // localStorage存储key
    let key = 'mySql';
    // 抽屉是否打开
    let isOpen = false;

    // 页面添加「添加到本地」按钮
    let addToLocalBtnEle = `<button id="addToLocalBtn" class="btn btn-sm btn-info">添加到本地</button>`;
    $("#resetSearchInfo").parent().parent().append(addToLocalBtnEle);
    $("#addToLocalBtn").on('click', () => {
        let reason = $("#reason").val()
        if (!reason) {
            b_alert("请输入查询原因!");
            return;
        }

        let sql = $("#sql").val()
        if (!sql) {
            b_alert("请输入查询sql!");
            return;
        }

        addSql(reason, sql);
    })

    // 抽屉
    var drawerWidth = 300;
    var drawerWrapper = $(`
         <div id="drawerWrapper" style="position: fixed; top: 0; right: -${drawerWidth}px; width: ${drawerWidth}px; height: 100%; z-index: 99999; transition: right 0.3s;">
            <div id="toggleDrawerButton" style="position: absolute; top: 50%; left: -50px; transform: translateY(-50%); z-index: 999999;">
                <svg t="1704724169045" class="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2820" width="48" height="48"><path d="M135.38375 242.55265625L135.38375 661.14125c0 92.26406249 75.05578125 167.32828126 167.31984375 167.32828125L721.29640625 828.46953125c92.25140625 0 167.315625-75.06 167.315625-167.32828125l0-418.58859375c0-92.25984375-75.06421875-167.31984375-167.315625-167.31984375L302.70359375 75.2328125c-92.26406249 0-167.31984375 75.06-167.31984375 167.31984375z m585.91265625-46.84078125c25.86515625 0 46.8365625 20.975625 46.8365625 46.84078125L768.13296875 661.14125c0 25.87359374-20.97140626 46.845-46.8365625 46.845L302.70359375 707.98625c-25.87359374 0-46.84078125-20.97140625-46.84078125-46.84500001l0-418.58859374c0-25.86515625 20.9671875-46.84078125 46.84078125-46.84078125l418.5928125 0z" fill="#A7A7A7" p-id="2821"></path><path d="M389.98109375 451.85328125c0-19.861875 7.55578125-39.71953125 22.6715625-54.83953125 1.434375-1.43015625 2.9446875-2.7759375 4.539375-4.0246875l134.91984375-105.958125c21.99234375-17.26734375 53.81859375-13.4409375 71.0859375 8.5471875s13.44515625 53.814375-8.5471875 71.08593749l-108.47671875 85.18921876 108.47671875 85.185c21.9965625 17.2715625 25.81875 49.089375 8.55140625 71.08171875-17.27156251 21.99234375-49.09359375 25.81875-71.0859375 8.54718749l-134.9240625-105.95390624c-1.59046875-1.24875-3.10078125-2.58609375-4.5309375-4.01625a77.338125 77.338125 0 0 1-22.68-54.84375z" fill="#64A3ED" p-id="2822"></path></svg>
            </div>
            <div id="myDrawer" style="background-color: #f1f1f1;height: 100%; overflow-y: auto;padding: 12px 8px 4px 8px;">
                <input id="keyword" style="width: 100%" placeholder="输入关键字搜索..." />
                <div id="sql_div_wrapper" class="sql_div_wrapper"></div>
            </div>
         </div>`);
    $('body').append(drawerWrapper);

    // 打开/收起抽屉
    $('#toggleDrawerButton').on('click', () => {
        // 关键字置空
        $("#keyword").val('')

        // 处理right和icon
        let drawerRight = parseInt($('#drawerWrapper').css('right'));
        let $svgIcon = $('#toggleDrawerButton');
        if (drawerRight === 0) {
            $('#sql_div_wrapper').empty()
            isOpen = false;
            $('#drawerWrapper').css('right', -drawerWidth + 'px');
            $svgIcon.css('transform', 'rotate(0deg)');
        } else {
            renderDrawData();
            isOpen = true;
            $('#drawerWrapper').css('right', '0');
            $svgIcon.css('transform', 'rotate(180deg)');
        }
    });

    // 获取我的sql
    const getMySqlArr = () => {
        let mySql = localStorage.getItem(key)
        mySql = !mySql ? "[]" : mySql;
        return JSON.parse(mySql)
    }

    // 关键字渲染list
    const renderDrawData = (keyword) => {
        // 先置空
        $('#sql_div_wrapper').empty();

        // 再根据关键词过滤渲染
        let mySqlArr = getMySqlArr();
        mySqlArr = mySqlArr.filter(e => {
            return !keyword || (e.reason.indexOf(keyword) >= 0 || e.sql.indexOf(keyword) >= 0);
        }).map(e => {
            let $sqlDiv = $(`
            <div style="padding: 12px;background-color: white; margin-top:4px;border-radius: 4px">
                <div style="display:flex; justify-content: space-between;">
                    <div style="font-weight:bold;">${e.reason}</div>
                    <div>
                        <span class="use_sql_btn" style="cursor:pointer;color: #409eff" data-reason="${e.reason}" data-sql="${e.sql}">使用</span>
                        <span class="copy_sql" style="cursor:pointer;color: #e6a23c" data-sql="${e.sql}">复制</span>
                        <span class="del_sql_btn" style="cursor:pointer;margin-left: 4px;color: #f56c6c" data-reason="${e.reason}"">删除</span>
                    </div>
                </div>
                <div class="sql_div" title="${e.sql}">${e.sql}</div>
            </div>`);

            // 使用sql
            $sqlDiv.find('.use_sql_btn').on('click', function () {
                $("#reason").val($(this).data('reason'));
                $("#sql").val($(this).data('sql'));
            });

            // 复制sql
            $sqlDiv.find('.copy_sql').on('click', function () {
                let sql = $(this).data('sql');
                // 创建临时文本输入框并将文本放入其中
                let tempInput = $('<textarea>');
                tempInput.val(sql);
                $('body').append(tempInput);
                tempInput[0].select();
                document.execCommand('copy');
                tempInput.remove();
                b_alert('复制成功!<br/>' + sql);
            });

            // 删除sql
            $sqlDiv.find('.del_sql_btn').on('click', function () {
                let reason = $(this).data('reason');
                let mySqlArr = getMySqlArr().filter(e => String(e.reason) != reason)
                localStorage.setItem(key, JSON.stringify(mySqlArr))
                if (isOpen) {
                    renderDrawData();
                }
            });

            return $sqlDiv;
        })

        if (mySqlArr.length > 0) {
            // 渲染数据
            mySqlArr.forEach($e => {
                $('#sql_div_wrapper').append($e)
            });
        } else {
            // 无数据
            $('#sql_div_wrapper').append(`<div style="text-align: center; margin-top: 12px">什么都没有哦o(>﹏<)o</div>`)
        }

    }

    // 添加一个sql
    function addSql(reason, sql) {
        for (let item of getMySqlArr()) {
            console.log(item.reason, reason)
            console.log(reason == item.reason)
            if (reason == item.reason) {
                b_alert('添加失败，本地存在相同的查询原因!');
                return
            }
        }

        let obj = {reason, sql}

        let mySqlArr = getMySqlArr()
        mySqlArr.push(obj)

        localStorage.setItem(key, JSON.stringify(mySqlArr))

        if (isOpen) {
            renderDrawData();
        }

        b_alert('添加成功!');
    }


    // 监听搜索
    $("#keyword").on('input', function (event) {
        renderDrawData(event.target.value)
    });

})();