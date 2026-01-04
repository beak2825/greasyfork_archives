// ==UserScript==
// @name         Benben Linker
// @version      0.5
// @description  Make a link to Benben Saver and also a link backwards
// @author       AZaphodBeeblebrox
// @match        *://*/*
// @license      MIT
// @icon         https://cdn.luogu.com.cn/upload/usericon/3.png
// @grant        none
// @namespace https://greasyfork.org/users/1137586
// @downloadURL https://update.greasyfork.org/scripts/471888/Benben%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/471888/Benben%20Linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href;
    var regex = /\/user\/(\d+)/;
    var matches = url.match(regex);

    if (matches != null) {
        var userid = matches[1].toString();
        var button = document.createElement('button');
        if (url.includes('luogu')) {
            button.textContent = '查看历史犇犇';
            button.style.position = "absolute";
            button.style.top = "100px";
            button.style.left = "100px";
            window.addEventListener('scroll', function() {
                var scrollY = window.scrollY;
                button.style.top = (100 + scrollY) + 'px';
            });
            button.classList.add('button-lgcm');
            button.addEventListener('click', async function() {
                window.location.href="https://lgf.imken.moe/user/"+userid
            });
            document.body.appendChild(button);
        }
        else if (url.includes('lgf.imken.moe')) {
            button.textContent = '返回洛谷个人主页';
            button.style.position = "absolute";
            button.style.bottom = "50px";
            button.style.right = "50px";
            button.classList.add('button-lgcm');
            window.addEventListener('scroll', function() {
                var scrollY = window.scrollY;
                button.style.bottom = (50 - scrollY) + 'px';
            });
            button.addEventListener('click', async function() {
                window.location.href="https://www.luogu.com.cn/user/"+userid
            });
            document.body.appendChild(button);
        }
    }
})();
