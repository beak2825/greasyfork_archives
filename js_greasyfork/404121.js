// ==UserScript==
// @name         dalipan
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  显示大力盘的网盘链接，不需扫码
// @author       You
// @match        *dalipan.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/404121/dalipan.user.js
// @updateURL https://update.greasyfork.org/scripts/404121/dalipan.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    function dclose() {
        let w = document.querySelector('.el-dialog__close');
        w.click();
        //b.style.display = "none";
    }

    function geta() {
        console.log('geta');
        var b = document.querySelector('.button');
        if (!b) return
        b.click();

        setTimeout(() => {
            let d = document.querySelector('.button-wrap');
            let a = document.querySelector('.go-baidu > a:nth-child(1)');
            let a2 = document.querySelector('.go-baidu > a:nth-child(2)');

            if (a) {
                dclose();
                a.style.display = "";
                d.append(a);
                return;
            }


            if (a2) {
                dclose();
                a2.style.display = "";
                d.append(a2);
                return;
            }
        }, 300);


    }

    function ad() {
        function subad(path) {
            let r = document.querySelector(path);
            if (r) { r.style.display = "none"; }
        }

        subad('.right-side');
        subad('.feedback-wrap');
        subad('.ad-pc-footer');
        subad('.ads');
        subad('.goods-wrap');


    }

    //setTimeout(geta, 500);
    ad();

    async function gethtml(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest(
                {
                    url: url,
                    method: "GET",
                    onload: function (response) {
                        resolve(response.responseText);
                    }
                });
        });
    }

    const str = await gethtml(location.href);
    console.log(str);
    const reg = /https:\\u002F\\u002Fpan.baidu.com\\u002Fs\\u002F1([a-zA-Z0-9_\-]{5,22})/;
    const re = reg.exec(str);
    console.log(re);
    if (re && re.length > 0) {
        const bdurl = "https://pan.baidu.com/s/1" + re[1];
        console.log(bdurl);

        var content = document.createElement("a");
        content.href = bdurl;
        content.innerText = bdurl;
        content.target = '_blank';
        var p = document.createElement("p");
        p.appendChild(content);

        let d = document.querySelector('.button-wrap');
        d.append(p);

    }

})();