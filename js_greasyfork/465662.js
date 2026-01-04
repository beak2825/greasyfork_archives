// ==UserScript==
// @name         社会主义牛逼
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Nonthing
// @author       You
// @match        https://cnvalues.github.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465662/%E7%A4%BE%E4%BC%9A%E4%B8%BB%E4%B9%89%E7%89%9B%E9%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/465662/%E7%A4%BE%E4%BC%9A%E4%B8%BB%E4%B9%89%E7%89%9B%E9%80%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementById("ideology-label2").innerText = "法西斯主义"
    document.getElementById("ideology-desc").innerText = '法西斯主义（Fascism）是一种极端的民族主义，强调为了在国际竞争中保障本民族利益，国家必须实行铁腕的独裁统治，以掌控社会的各个方面。\n代表人物：贝尼托·墨索里尼，北一辉，何塞·安东尼奥，戴季陶，蒋介石'
    document.getElementById("ideology-link").innerText = 'https://en.wikipedia.org/wiki/Fascism'
    document.getElementById("ideology-label").innerText = "法西斯主义"
    if(document.getElementById("ideology-label").innerText === "法西斯主义"){
        alert("泰裤辣！居然是法西斯主义。IP地址已收录")
    }
})();