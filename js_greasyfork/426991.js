// ==UserScript==
// @name         煎蛋无聊图跳转按钮
// @description  为煎蛋jandan.net/pic提供跳转按钮,输入数字跳转到指定页码
// @namespace    http://jandan.net/pic
// @version      0.9
// @description  try to take over the world!
// @author       whr
// @match        http://jandan.net/pic*
// @match        http://i.jandan.net/pic*
// @icon         http://cdn.jandan.net/static/img/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426991/%E7%85%8E%E8%9B%8B%E6%97%A0%E8%81%8A%E5%9B%BE%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/426991/%E7%85%8E%E8%9B%8B%E6%97%A0%E8%81%8A%E5%9B%BE%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //debugger
    if(!window.btoa){
        alert('该浏览器不支持btoa方法,该脚本[煎蛋无聊图跳转按钮]无法使用')
    }
    var html_input = '<input class="index" maxlength="4" >'
    var html_go = '<a class="go_index" href="#">跳转</a>'
    var base_url = 'http://jandan.net/pic/'
    var css_obj = {}
    if ((/i\.jandan\.net/).test(window.location.href)) {
        //移动版
        $(".wp-pagenavi").append(html_input);
        $(".wp-pagenavi").append(html_go);
        //输入框和按钮样式
        css_obj = {
            "width": "56px",
            "height": "36px",
            "outline": "none",
            "color": "#AAA",
            "border": "1px solid #e5e5e5",
            "text-align": "center"
        };
        $(".index").css(css_obj);
        $(".go_index").css("margin-left","10px")
        //设置跳转链接前半部分
        base_url = 'http://i.jandan.net/pic/'
    } else {
        //桌面版

        //添加输入框和按钮
        $(".cp-pagenavi").append(html_input);
        $(".cp-pagenavi").append(html_go);
        //输入框和按钮样式
        css_obj = {
            "width": "56px",
            "height": "25px",
            "outline": "none",
            "color": "#AAA",
            "border": "1px solid #e5e5e5",
            "text-align": "center"
        };
        $(".index").css(css_obj);
        //设置跳转链接前半部分
        base_url = 'http://jandan.net/pic/'
    }

    //跳转方法
    function goIndex() {
        var index_num = $(".index:eq(0)").val()||$(".index:eq(1)").val()
        if (isNaN(Number(index_num))) {
            alert("isNaN")
            return;
        }
        var date = new Date().toJSON().substring(0, 10).replace(/-/g, '');
        var index_str = date + '-' + index_num;
        index_str = btoa(index_str);
        var index_href = base_url + index_str
        location.href = index_href
    }

    //绑定点击时间和回车监听
    $(".go_index").click(goIndex);
    $(".index").keydown(function (e) {
        if (e.key == "Enter") {
            goIndex()
        }
    })
    //点击时清空输入框文本,防止有两个页码
    $(".index").focus(function () {
        $(".index").val('');
    });


})();