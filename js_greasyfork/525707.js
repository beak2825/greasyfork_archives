// ==UserScript==
// @license      MIT
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-02-03
// @description  descriptttt
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/525707/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/525707/New%20Userscript.meta.js
// ==/UserScript==

(async ()=>{
    setInterval(()=>{
        $(".chat").css({
            "background-image":`url("https://img3.gelbooru.com//images/4e/9f/4e9f328507ef2393c02e7ab73afd9974.gif")`,
            "background-size": "contain",
            "background-position": "center",
            "background-repeat": "no-repeat"})
        $(".messagebox").css({
            "opacity": "0.7"
        })
    },10)
})()