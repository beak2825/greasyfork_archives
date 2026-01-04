// ==UserScript==
// @name         iconfont 免登录下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  免登录下载 iconfont 的icon
// @author       You
// @match        https://www.iconfont.cn/collections/*
// @match        https://www.iconfont.cn/search/*
// @icon         https://www.google.com/s2/favicons?domain=iconfont.cn
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jszip@3.1.5/dist/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/430506/iconfont%20%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/430506/iconfont%20%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    async function sleep(time) {
        return new Promise(function (resolve) {
            setTimeout(resolve, time);
        })
    }

    async function run() {
        let $div = document.querySelector(".block-bar-right .block-radius-btn-group.clearfix");
        if (!$div || $div.querySelector('.icon-xiazai')) {
            return;
        }
        let $icon = document.createElement("span");
        $icon.setAttribute('class', 'radius-btn radius-btn-like');
        $icon.innerHTML = ('<span class="icon-xiazai  iconfont"></span>')
        $div.prepend($icon);
        $icon.addEventListener('click', function () {
            var zip = new JSZip();
            Array.from(document.body.querySelectorAll('.icon-twrap')).map(function (icon) {
                let svg = icon.innerHTML;
                let name = icon.nextElementSibling.innerText
                zip.file("icons/" + name + ".svg", svg);
            })
            zip.generateAsync({type: "blob"}).then(content => {
                let $a = document.createElement("a");
                let $title = document.body.querySelector(".right-content span.title");
                $a.href = URL.createObjectURL(content);
                $a.download = ($title ? $title.innerText : 'icon') + ".zip";
                $a.click();
            })
        });
    }

    new Promise(async function () {
        while (true) {
            await sleep(1000);
            console.log("run")
            await run();
            Array.from(document.querySelectorAll('span.icon-xiazai[data-login]')).forEach(e => {
                e.removeAttribute("data-login");
            });
        }
    }).finally()
    // Your code here...
})();
