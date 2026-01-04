// ==UserScript==
// @name         Adjust Layout of Translate Website
// @name:en      Adjust Layout of Translate Website
// @name:zh-cn   调整翻译页面布局
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description        This script is for adjusting the layout of the Baidu, Youdao, and/or Sogou Translate websites. Only it would be effective when the height of browser is greater than the width of browser.
// @description:en     This script is for adjusting the layout of the Baidu, Youdao, and/or Sogou Translate websites. Only it would be effective when the height of browser is greater than the width of browser.
// @description:zh-cn  根据浏览器的窗体情况调整百度|有道|搜狗翻译“待翻译文字”和“翻译后文字”的布局。只有浏览器高度大于宽度时生效。
// @author       basilguo@163.com
// @match        http*://fanyi.baidu.com/*
// @match        http*://fanyi.youdao.com/*
// @match        http*://fanyi.sogou.com/*
// @icon         https://images2.imgbox.com/41/a0/oUqOCDlB_o.png
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/468969/Adjust%20Layout%20of%20Translate%20Website.user.js
// @updateURL https://update.greasyfork.org/scripts/468969/Adjust%20Layout%20of%20Translate%20Website.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Just a delicate difference.
    // You should guarantee the browser's height is greater than its width.
    // Otherwise, it would not be effective.
    // By the way, Google Translate is more humane. It would adjust the layout automatically.

    function adjustBaiduTranslateLayout()
    {
        // console.log('function adjustBaiduTranslateLayout()');
        let divContainer = document.getElementsByClassName("EUENIlUT")[0];
        let divLeft = document.getElementsByClassName("AZLVLJHb")[0];
        let divRight = document.getElementsByClassName("wB5ViVGi")[0];
        // console.log(divContainer, divLeft, divRight);

        if (window.outerWidth < window.outerHeight)
        {
            divContainer.style["flex-direction"] = "column";
            divRight.style.flex = "1 1";
            divRight.style.width = "80%";
            divLeft.style.width = "80%";
        } else {
            divContainer.style["flex-direction"] = "row";
            divRight.style.flex = "1 1";
            divRight.style.width = "50%";
            divLeft.style.width = "50%";
        }
    }

    function adjustYoudaoTranslateLayout()
    {
        let div = document.getElementById("TextTranslate");
        // console.log(div);

        if (window.outerWidth < window.outerHeight)
        {
            div.style['flex-direction'] = "column";
        } else {
            div.style['flex-direction'] = "row";
        }
    }

    function adjustSogouTranslateLayout()
    {
        let div = document.getElementsByClassName("trans-box")[0];
        // console.log(div);

        if (window.outerWidth < window.outerHeight)
        {
            div.style['flex-direction'] = "column";
        } else {
            div.style['flex-direction'] = "row";
        }
    }

    function adjustLayout()
    {
        let url = window.location.href;
        // console.log(url);

        if (url.indexOf('baidu.com') !== -1) {
            adjustBaiduTranslateLayout();
        } else if (url.indexOf('youdao.com') !== -1) {
            adjustYoudaoTranslateLayout();
        } else if (url.indexOf('sogou.com') !== -1) {
            adjustSogouTranslateLayout();
        }
    }

    window.onload=function()
    {
        // console.log("window onload");
        adjustLayout();
    }

    window.addEventListener("resize",function(){
        // console.log("event listerner");
        adjustLayout();
    },false);
})();