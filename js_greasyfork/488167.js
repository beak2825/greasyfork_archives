// ==UserScript==
// @name         WME Clean permalink
// @description  Script removes S-parameters from a URL. Layer settings from PL do not change your own
// @version      2024.02.24.03
// @author       Sapozhnik
// @namespace    https://greasyfork.org/ru/users/160654-waze-ukraine
// @icon         data:image/png;base64,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
// @match        https://www.waze.com/editor*
// @match        https://waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://waze.com/*/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488167/WME%20Clean%20permalink.user.js
// @updateURL https://update.greasyfork.org/scripts/488167/WME%20Clean%20permalink.meta.js
// ==/UserScript==

(function () {
    'use strict'
    const regex = /&s=\d*/;             // прибираємо шари налаштувань
    const regex2 = /#[^&?]*/;           // прибираємо хеш і далі
   
    let url = window.location.href;

    if (regex.test(url) || regex2.test(url)) {
        url = url.replace(regex,'');
        url = url.replace(regex2,'');
        window.location.replace(url);
    }
})()