// ==UserScript==
// @name         挖站否自动签到
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自己写的挖站否自动签到
// @author       LLII
// @match        https://wzfou.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419795/%E6%8C%96%E7%AB%99%E5%90%A6%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/419795/%E6%8C%96%E7%AB%99%E5%90%A6%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('已经打开挖站否');

    var str_xpath_sign = '//*[@class="uc-widget-user"]/a[1]';

    var signbuttonlist = getTargetByXpath(str_xpath_sign);
    //document.getElementsByClassName("uc-sign-btn uc-btn active");
    if(signbuttonlist){
        var sgbt = signbuttonlist[0];
        if(sgbt){
            if(sgbt.innerHTML=="今日已签到"){
                console.log('今日已签到');
            }else{
                sgbt.click();
                console.log('已发送签到事件');
            }
        }else{
            console.log('未找到签到按钮');
        }
    }else{
        console.log('未找到签到按钮');
    }

    var fabuttonlist = document.getElementsByClassName("uc-action uc-action-favorite ");
    if(fabuttonlist){
        var fabt = fabuttonlist[0];
        if(fabt){
            if(fabt.getAttribute("title")=="收藏"){
                console.log('已发送收藏事件');
                fabt.click();
            }else{
                console.log('已收藏');
            }
        }else{
            console.log('未找到收藏按钮');
        }
    }else{
        console.log('未找到收藏按钮组');
    }
    // Your code here...

    function getTargetByXpath(str_xpath) {
        var xresult = document.evaluate(str_xpath, document, null, XPathResult.ANY_TYPE, null);
        var xnodes = [];
        var xres;
        while (xres = xresult.iterateNext()) {
            xnodes.push(xres);
        }
        return xnodes;
    }

})();