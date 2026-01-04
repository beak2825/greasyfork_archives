// ==UserScript==
// @name         put your mask on
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  you lost your mask
// @author       wuw2135
// @match        https://www.plurk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plurk.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447294/put%20your%20mask%20on.user.js
// @updateURL https://update.greasyfork.org/scripts/447294/put%20your%20mask%20on.meta.js
// ==/UserScript==

setInterval(()=>{document.querySelectorAll("a[href='/anonymous'][target='_blank']").forEach(element => {console.log(element.getElementsByTagName('img')[0].src = "https://images.plurk.com/7GEzPiSeWX8uKaZ3hSmQWS.jpg")})},500)