// ==UserScript==
// @name         AdminerFormater
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  adminer sql format!
// @author       You
// @match        http://localhost:8080/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://unpkg.com/sql-formatter@latest/dist/sql-formatter.min.js
// @downloadURL https://update.greasyfork.org/scripts/452221/AdminerFormater.user.js
// @updateURL https://update.greasyfork.org/scripts/452221/AdminerFormater.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (/sql=/.test(window.location.href)) {
        const txt = document.querySelector("#form > p:nth-child(1) > pre > span > span");

        const btn = document.createElement("input")
        txt.innerText = sqlFormatter.format(txt.innerText);
        btn.type = 'button';
        btn.value = '格式化';
        btn.onclick = () => {
            console.log(txt.innerText);
            txt.innerText = sqlFormatter.format(txt.innerText);
        }
        document.querySelector('#form').appendChild(btn)
    }
})();