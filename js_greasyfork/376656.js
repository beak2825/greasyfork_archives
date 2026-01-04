// ==UserScript==
// @name         lark-ui-route
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  一级路由巡检自动化
// @author       至星
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @match        http://0.0.0.0:3000/*
// @match        *://localhost/*
// @match        *://larkportal.taobao.net/*
// @match        *://*.yuekeyun.com/*
// @match        *://*.yuekeyun.com/*
// @include      *://*
// @downloadURL https://update.greasyfork.org/scripts/376656/lark-ui-route.user.js
// @updateURL https://update.greasyfork.org/scripts/376656/lark-ui-route.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if(document.title.indexOf('凤凰云智') > -1){
        // 全局变量声明
        var routeName = "";

        // dev
        // var reportUrl = "http://localhost:7001";
        // pre
        //var reportUrl = "https://pre-taopiaopiao.alibaba-inc.com/";
        // prod
        var reportUrl = "https://tfquality.alibaba-inc.com";

        // UI界面 开始
        var box = $('<div style="position: absolute;right: 0;top: 29px;z-index: 9999;padding: 2px;background-color: #ccc;"></div>');
        var toggleBtn=$('<div style="cursor:pointer;color:blue;">~~</div>');
        toggleBtn.bind('click', function(){
            var val = GM_getValue('helper-visible', false);
            GM_setValue('helper-visible', !val)
            $('button', box).toggle(!val);
        });

        var clearBtn = $('<div><button style="padding: 3px 5px;">清除路由报告</button></div>');
        clearBtn.bind('click', function(){
            deleteUiRouteCaseAndReport();
            alert("清除一级路由报告成功!")
        });
        var reissueReportBtn = $('<div><button style="padding: 3px 5px;">补发路由报告</button></div>');
        reissueReportBtn.bind('click', function(){
            sendDingTalk("补发凤凰云智后台一级路由报告成功：" + reportUrl + "/report/uiAutoRouteReport");
            alert("补发一级路由报告成功!")
        });
        var openTabTestBtn = $('<div><button style="padding: 3px 5px;">测试一级路由</button></div>');
        openTabTestBtn.bind('click', function(){
            deleteUiRouteCaseAndReport();
            initOpenTabTest();
            clearInterval(window.timer);
            window.timer = setInterval(testOpenTab, 3000);
        });

        box.append(clearBtn);
        box.append(reissueReportBtn);
        box.append(openTabTestBtn);
        box.append(toggleBtn);
        $('body').append(box);

        var val = GM_getValue('helper-visible', false);
        $('button', box).toggle(val);
        // UI界面 结束

        // 删除用例执行结果
        function deleteUiRouteCaseAndReport()
        {
            $.ajax({
                url: reportUrl + "/api/v1/route/robot/case/delete",
                type: "GET",
                dataType:"jsonp"
            });
            $.ajax({
                url: reportUrl + "/api/v1/route/robot/report/delete",
                type: "GET",
                dataType:"jsonp"
            });
            // 等待3s
            setTimeout(function(){},3000);
        }

        // 创建用例执行结果
        function createUiRouteCase(routeName, status, remark)
        {
            $.ajax({
                url: reportUrl + "/api/v1/route/robot/case/create",
                type: "GET",
                data:{"routeName" : routeName, "status": status, "remark": remark},
                dataType:"jsonp"
            });
        }

        // 统计报告
        function reportStatistics(reportName)
        {
            $.ajax({
                url: reportUrl + "/api/v1/route/robot/report/statistics",
                type: "GET",
                data:{"reportName" : reportName},
                dataType:"jsonp"
            });
        }

        // 发送钉钉消息
        function sendDingTalk(content) {
            $.ajax({
                url: reportUrl + "/api/v1/route/robot/send",
                type: "GET",
                data:{"content" : content},
                dataType: "jsonp"
            });
        }

        window.addEventListener('unhandledrejection', (evt) => {
            console.log('=============addEventListener')
            if (evt && evt.reason && evt.reason.toString().includes('getHostNode')) {
                report(routeName, 'getHostNode','','','',evt.reason);
            }
        });

        window.onerror = function(msg, file, line, column, error){
            console.log('=============error',msg, error)
            var filename = msg.filename;
            if(filename == "" || filename == undefined)
                return;
            console.log("routeName: " + routeName);
            report(routeName, msg, file, line, column, error);
            clearInterval(window.timer);
        }

         function report(routeName, msg, file, line, column, error) {
            var msgStr = JSON.stringify(msg);
            var fileStr = JSON.stringify(file);
            var lineStr = JSON.stringify(line);
            var columnStr = JSON.stringify(column);
            var errorStr = JSON.stringify(error);
            var remark = 'msg: ' + msgStr + '  file: ' + fileStr + '  line: ' + lineStr + '  column: ' + columnStr + '  error: ' + errorStr;
            createUiRouteCase(routeName, 2, remark);
        }

        function initOpenTabTest() {
            var items = $('.nav-list-outer span.item');
            var len = items.length;
            sessionStorage.setItem('helper-tabLen', len);
            sessionStorage.setItem('helper-tabIndex', 0);
            sessionStorage.setItem('helper-tabOpenTest', 'true');

        }

        function testOpenTab() {
            try {
                var tabLen = +sessionStorage.getItem('helper-tabLen');
                var tabIndex = +sessionStorage.getItem('helper-tabIndex');
                var items = $('.nav-list-outer span.item');

                if (tabIndex < tabLen && sessionStorage.getItem('helper-tabOpenTest')=== 'true'){
                    var tabs = sessionStorage.getItem('tabs') || '[]';
                    tabs = JSON.parse(tabs);
                    routeName = tabs[0].tipType + "-" + tabs[0].location;
                    items[tabIndex].click();
                    createUiRouteCase(routeName, 1, "");
                    sessionStorage.setItem('helper-tabIndex', tabIndex+1);
                    if(tabs.length > 0){
                        $($('.tabs img').get(0)).click();
                    }
                } else {
                    sessionStorage.setItem('helper-tabOpenTest', 'false');
                    clearInterval(window.timer);
                    reportStatistics("凤凰云智一级路由巡检自动化");
                    sendDingTalk("凤凰云智后台一级路由巡检完成：" +  reportUrl + "/report/uiAutoRouteReport");
                    alert("凤凰云智后台一级路由巡检完成!")
                }
            } catch (e){
                sessionStorage.setItem('helper-tabOpenTest', 'false');
                clearInterval(window.timer);
            }
        }
    }
})();
