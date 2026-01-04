// ==UserScript==
// @name         公式翻译保留
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  网页翻译时，保留公式
// @author       Jialin
// @require      http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js

// @grant        GM_getResourceURL
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @match        https://www.sciencedirect.com/*
// @match        https://ieeexplore.ieee.org/*
// @match        https://link.springer.com/*
// @match        https://pubs.geoscienceworld.org/*
// @match        https://pubs.rsc.org/en/content/articlehtml/2019/en/c9en00017h

// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_openInTab
// @noframes     Edge
// @compatible   Chrome
// @compatible   Firefox
// @compatible   Edge
// @compatible   Safari
// @compatible   Opera
// @compatible   UC
// @license      GPL3 license
// @downloadURL https://update.greasyfork.org/scripts/442250/%E5%85%AC%E5%BC%8F%E7%BF%BB%E8%AF%91%E4%BF%9D%E7%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/442250/%E5%85%AC%E5%BC%8F%E7%BF%BB%E8%AF%91%E4%BF%9D%E7%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 带有公式的元素
    const mathElement ='math, .math, .MathJax';

    // 添加按钮
    var mathBtn = '<button id="math-btn">公式翻译/Translate</button>';
    $('body').append(mathBtn);

    // 添加样式
    GM_addStyle('#math-btn {background:#ff3500;padding:3px 5px;color:#fff;border-radius:10px 0 0 10px;position:fixed;right:0px;top:50vh;z-index:99999999999999;border:none;height:fit-content;outline:none;cursor:grab}');

    // 点击按钮，添加翻译保留属性
    $('#math-btn').click(function(){
        if($(mathElement).length > 0){
            // console.log('该页面存在公式!');
            // alert('该页面存在公式!');
            $(mathElement).attr('translate','no');
            $("#math-btn").css("background","green");
        }else{
            //console.log('未发现公式!');
            $("#math-btn").css("background","red");
        }
    })

    // Your code here...
})();