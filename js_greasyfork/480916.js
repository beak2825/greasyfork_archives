// ==UserScript==
// @name         Snowbreak.gg codes checkbox
// @namespace    https://greasyfork.org/en/scripts/480916-snowbreak-gg-codes-checkbox
// @homepage     https://greasyfork.org/en/scripts/480916-snowbreak-gg-codes-checkbox
// @version      1.0
// @description  Add checkbox to codes at snowbreak.gg
// @author       Tanuki
// @match        https://snowbreak.gg/codes/
// @icon         https://www.google.com/s2/favicons?sz=512&domain=snowbreak.amazingseasun.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480916/Snowbreakgg%20codes%20checkbox.user.js
// @updateURL https://update.greasyfork.org/scripts/480916/Snowbreakgg%20codes%20checkbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('.entry-content td:first-child').forEach(i => {
        var code = i.textContent.replace(/\u00a0/g, " ").replace(/[•]/g,"").split(" ")
        var plainCode = code.filter(n => n)
        var formatedCode = []
        plainCode.forEach(i => {
            var realCode = i.replace(/[*]/g,"")
            if (localStorage.getItem(realCode) == "true") {
                formatedCode.push('<input type="checkbox" onclick="window.localStorage.setItem(\''+realCode+'\',this.checked)" checked> ' +i.replace(/[*]/g,'<b style="color:red;">*</b>')+ '</input><br>')
            } else {
                formatedCode.push('<input type="checkbox" onclick="window.localStorage.setItem(\''+realCode+'\',this.checked)"> ' +i.replace(/[*]/g,'<b style="color:red;">*</b>')+ '</input><br>')
            }
        })
        i.innerHTML = formatedCode.join('')
    });
})();