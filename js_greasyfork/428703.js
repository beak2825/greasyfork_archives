// ==UserScript==
// @name         韩师一键评课
// @namespace AceScript Scripts
// @match *://jw.hstc.edu.cn/eams/quality/*
// @match https://cas.hstc.edu.cn/*
// @match https://webvpn.hstc.edu.cn/*
// @grant        none
// @version 2.0
// @description 每学期都要评课，没更新即可用，不能用我会及时更新
// @downloadURL https://update.greasyfork.org/scripts/428703/%E9%9F%A9%E5%B8%88%E4%B8%80%E9%94%AE%E8%AF%84%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/428703/%E9%9F%A9%E5%B8%88%E4%B8%80%E9%94%AE%E8%AF%84%E8%AF%BE.meta.js
// ==/UserScript==
(function () {
    'use strict';
    console.log('我的脚本加载了');
    var button = document.createElement("button");
    button.id = "id001";
    button.textContent = "一键好评";
    button.style.width = "80px";
    button.style.height = "20px";
    button.style.align = "center";

    //绑定按键点击功能
    button.onclick = function (){
        console.log('点击了按键');
        var STR_XPATH=".//input[@type=\"radio\" and @value=\"0\"]";
        var result = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
        var nodes;
        while (nodes = result.iterateNext())
        {
            nodes.click();
        }

        var STR_XPATH1=".//input[@type=\"radio\" and @value=\"1\"]";
        var result1 = document.evaluate(STR_XPATH1, document, null, XPathResult.ANY_TYPE, null);
        var nodes1;
        while (nodes1 = result1.iterateNext())
        {
            console.log('chufa按键');
            nodes1.click();
            break;
        }


        $("textarea[class='answer answer-textarea']").val("无");
        button2.click();

        return;

    };

    var button1 = document.createElement("button");
    button1.id = "id001";
    button1.textContent = "一键评良";
    button1.style.width = "80px";
    button1.style.height = "20px";
    button1.style.align = "center";

    //绑定按键点击功能
    button1.onclick = function (){
        var STR_XPATH=".//input[@type=\"radio\" and @value=\"1\"]";
        var result = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
        var nodes;
        alert("真的假的");
        while (nodes = result.iterateNext())
        {
            nodes.click();
        }
        $("textarea[class='answer answer-textarea']").val("无");
        return;
    };






    var button2 = document.createElement("button");
    button2.id = "id001";
    button2.textContent = "一键提交";
    button2.style.width = "80px";
    button2.style.height = "20px";
    button2.style.align = "center";

    //绑定按键点击功能
    button2.onclick = function (){
        var STR_XPATH1=".//input[@type=\"button\" and @value=\"提交\"]";
        var result1 = document.evaluate(STR_XPATH1, document, null, XPathResult.ANY_TYPE, null);
        var nodes1;
        while (nodes1 = result1.iterateNext())
        {
            nodes1.click();
        }
        return;
    };

    var button3 = document.createElement("button");
    button3.id = "id001";
    button3.textContent = "今天就是天王老子来了也得是差评";
    button3.style.width = "240px";
    button3.style.height = "20px";
    button3.style.align = "center";

    //绑定按键点击功能
    button3.onclick = function (){
        var STR_XPATH1=".//input[@type=\"radio\" and @value=\"4\"]";
        var result1 = document.evaluate(STR_XPATH1, document, null, XPathResult.ANY_TYPE, null);
        var nodes1;
        while (nodes1 = result1.iterateNext())
        {
            nodes1.click();
        }
         $("textarea[class='answer answer-textarea']").val("无");
        return;
    };

    var x = document.getElementsByClassName('toolbar notprint')[0];
    x.appendChild(button);
    var x1 = document.getElementsByClassName('toolbar notprint')[0];
    x1.appendChild(button1);
    var x2 = document.getElementsByClassName('toolbar notprint')[0];
    x2.appendChild(button2);
    var x3 = document.getElementsByClassName('toolbar notprint')[0];
    x3.appendChild(button3);


})();