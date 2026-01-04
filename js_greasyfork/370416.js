// ==UserScript==
// @name         Google Translation Formatting
// @namespace    https://translate.google.cn/*
// @version      0.4
// @description  press F5
// @author       quz
// @match        https://*translate.google.*/*
// @include      https://translate.google.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370416/Google%20Translation%20Formatting.user.js
// @updateURL https://update.greasyfork.org/scripts/370416/Google%20Translation%20Formatting.meta.js
// ==/UserScript==

(function() {

    var txt = document.getElementById("source").value;
    //去除空格
    if(txt.indexOf("\n"))
    {
        txt = txt.replace(/\n/g," ");
    }

    //按句子分段
    if(txt.indexOf("."))
    {
        txt = txt.replace(/\. /g,".\n\n");
    }
    document.getElementById("source").value = txt;
})();