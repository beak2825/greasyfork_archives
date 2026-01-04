// ==UserScript==
// @name         成为绅士会所的绒布球
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  懂的都懂
// @author       LARA_SSR
// @match        www.hentaiclub.net/*
// @include      /^((https|http|ftp|rtsp|mms)?:\/\/)www.sshs.[a-zA-Z]+.*$/
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/441440/%E6%88%90%E4%B8%BA%E7%BB%85%E5%A3%AB%E4%BC%9A%E6%89%80%E7%9A%84%E7%BB%92%E5%B8%83%E7%90%83.user.js
// @updateURL https://update.greasyfork.org/scripts/441440/%E6%88%90%E4%B8%BA%E7%BB%85%E5%A3%AB%E4%BC%9A%E6%89%80%E7%9A%84%E7%BB%92%E5%B8%83%E7%90%83.meta.js
// ==/UserScript==

console.clear();

(async function () {
    'use strict';

    let addStyle = function (aCss) {
        let head = document.getElementsByTagName('head')[0];
        if (head) {
            let style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    }
    let addScript = function (aScript) {
        let head = document.getElementsByTagName('head')[0];
        if (head) {
            let script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.textContent = aScript;
            head.appendChild(script);
            return script;
        }
        return null;
    }
    addScript(`	
        function copyFn() {
            var val = document.getElementById('spanE');
            window.getSelection().selectAllChildren(val);
            document.execCommand("Copy");//执行浏览器复制命令
            alert("已复制好，可贴粘。");
        }
    `);
    addStyle(`
        #buttonE {
            height: 32px;
            width: 74px;
            position: absolute;
            bottom: 0;
            margin-left: 5px;
            padding: unset;
            border: groove;
        }
        #spanE > input {
            width: 100%;
        }
        #parDiv{
            display: flex;
        }
        #childDiv{
            position: relative;
            width: 20%;
            margin-left: 4px;
        }
        #spanE{
            width: 90%;
        }
    `);

    // $(".article-content").hide();
    // $(".article-tags").hide();
    // $(".article-title").hide();
    // $("header").hide();
    // $(".dl-box").prevAll().hide();
    // $(".dl-box").nextAll().hide();
    let buttonsLink = "https://cdn.staticfile.org/Buttons/2.0.0/css/buttons.css";
    let buttonsData = await Get(buttonsLink);
    addStyle(buttonsData);
    $(".fastlink").attr('id', 'spanE');
    $(".fastlink").parent().attr('id', 'parDiv');
    $(".fastlink>input").removeAttr("style");
    $(".fastlink").after($(`<div id="childDiv"><button id="buttonE"  class="button button-pill button-tiny" onClick="copyFn()">点击复制</button></div>`));
    $(".button").removeAttr()
    let dlbox = document.getElementById("dl-box");
    dlbox.style.display = "";
    function Get(link) {
        return new Promise(function (resolve) {
            $.get(link, function (data) {
                resolve(data);
            });
        });
    }
})();