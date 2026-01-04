// ==UserScript==
// @name         Web_Tool基础框架
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  基础框架。
// @author       城市美
// @match        https://*.baidu.com/*
// @match        *.gzjxjy.gzsrs.cn/*
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @grant        GM_addElement
// @grant        GM_log
// @grant        GM_notification
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/470756/Web_Tool%E5%9F%BA%E7%A1%80%E6%A1%86%E6%9E%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/470756/Web_Tool%E5%9F%BA%E7%A1%80%E6%A1%86%E6%9E%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //alert("test");
    // Your code here...
    /* globals jQuery, $, waitForKeyElements */
    //定义站点模块匹配

    //程序入口

    console.log("前："+typeof jQuery)
})();

// 油猴实用示例
// 油猴api文档 https://www.tampermonkey.net/documentation.php
function Tampermonkey(){
    // 1、油猴消息窗
    GM_notification({
        text: "This is the notification message.",
        title: "Notification Title"
    });

    // 2、油猴控制台消息
    GM_log("GM_log:油猴控制台消息")
}



//基本界面
function addToolBox(){
    var ToolBox = "<div id='My_ToolBox' ></div>";

    var timerInterval_Body
    timerInterval_Body = self.setInterval(function(){
        if ($("body").length>0){
            clearInterval(timerInterval_Body);
            // alert("body已加载")

            $("body").before(ToolBox);
            /*
        方法：
        1、元素之前.before()；
        2、元素之后.after()；
        3、元素内部的结尾插入append()；
        4、元素内部的开头插入.prepend()。
        */
            $("#My_ToolBox").css({
                // 'width':120,
                // 'width':5,
                // 'height':50,
                'display': 'block',
                'vertical-align': 'top',
                // 'background-color': '#25ae84',
                'background-color': '#1155ff',
                'color': '#ffffff',
                'margin-bottom': '2px',
                'z-index':99999,
                'position': 'fixed',
                'top':'100px',
                'left':'11px',
                '-moz-user-select':'none',
                '-webkit-user-select':'none'
                // 'text-align': 'center',
                // 'line-height': '42px',
                // 'cursor': 'pointer'
            });

            var ToolBoxTille = "<div id='My_ToolBoxTille'>工具面板</div>";
            $("#My_ToolBox").append(ToolBoxTille);
            $("#My_ToolBoxTille").css({
                'font-size': '16px',
                'text-align': 'center',
                'line-height': '42px',
                'display':'none'
                // 'cursor': 'pointer'
            });

            var ToolBoxBody = "<div id='My_ToolBoxBody'></div>";
            $("#My_ToolBox").append(ToolBoxBody);
            $("#My_ToolBoxBody").css({
                // 'width':80,
                'font-size': '16px',
                'text-align': 'center',
                'height':'100%',
                'line-height': '42px',
                'display':'none'
                // 'background-color': '#2ffe84',
                // 'cursor': 'pointer'
            });

            var ToolBoxDisplay = "<div id='My_ToolBoxDisplay'>＋</div>";
            $("#My_ToolBox").append(ToolBoxDisplay);
            $("#My_ToolBoxDisplay").css({
                'font-size': '16px',
                'text-align': 'center',
                // 'height':'auto',
                // 'line-height': '42px',
                'background-color': '#ff0000',
                'cursor': 'pointer',
                'position': 'absolute',
                'top': '-11px',
                'right': '-11px',
                'border-radius': '50%',
                'height': '23px',
                'width': '23px',
            });

            //绑定事件
            $("#My_ToolBoxDisplay").on("click",function(){

                if ($("#My_ToolBoxDisplay").text()=='×') {
                    $("#My_ToolBoxTille,#My_ToolBoxBody").css({
                        'display':'none'
                    });
                    $("#My_ToolBoxDisplay").css({
                        'display':'block'
                    });
                    $("#My_ToolBoxDisplay").text('＋');
                } else {
                    $("#My_ToolBoxTille,#My_ToolBoxBody").css({
                        'display':'block'
                    });
                    $("#My_ToolBoxDisplay").css({
                    });
                    $("#My_ToolBoxDisplay").text('×');
                }
            });

        };
    }, 1000);

}



//公共函数部分
//1、通配符字符串比较
function My_matchStr(str1,str2){
    // 用法：
    // My_matchStr(原始字符串,带通配符字符串)
    // 返回true/false
    // 仅支持*，不支持?
    return matchRuleShort(str1,str2);
    // matchRuleShort(原始字符串,带通配符字符串)
    // alert(
    //     "1. " + matchRuleShort("bird123", "bird*") + "\n" +
    //     "2. " + matchRuleShort("123bird", "*bird") + "\n" +
    //     "3. " + matchRuleShort("123bird123", "*bird*") + "\n" +
    //     "4. " + matchRuleShort("bird123bird", "bird*bird") + "\n" +
    //     "5. " + matchRuleShort("123bird123bird123", "*bird*bird*") + "\n" +
    //     "6. " + matchRuleShort("s[pe]c 3 re$ex 6 cha^rs", "s[pe]c*re$ex*cha^rs") + "\n" +
    //     "7. " + matchRuleShort("should not match", "should noo*oot match") + "\n"
    // );
    function matchRuleShort(str, rule) {
        var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
    };
    function matchRuleExpl(str, rule) {
        var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        rule = rule.split("*").map(escapeRegex).join(".*");
        rule = "^" + rule + "$"
        var regex = new RegExp(rule);
        return regex.test(str);
    };
};
