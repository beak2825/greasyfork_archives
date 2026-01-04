// ==UserScript==
// @name         Beautiful Zhihu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  美化你的知乎
// @author       You
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381007/Beautiful%20Zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/381007/Beautiful%20Zhihu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('hhhhh')
    // Your code here...

    function SetTheme(color) {
        let themecolor = color || '#fff'
        try {
            document.querySelector(".AppHeader").style.backgroundColor = themecolor
            document.querySelector(".Card").style.backgroundColor = themecolor
            clearAll(".TopstoryItem",themecolor)
            clearAll(".ContentItem-actions",themecolor)
            clearAll(".Card", themecolor)
        } catch (error) {
            console.log(error)
        }
       

    }
    function clearAll (querySelector, color) {
        let list = document.querySelectorAll(querySelector)
        for(let item of list) {
            item.style.backgroundColor = color || "#fff"
        }
    }
    function Init() {
       
        setInterval(function() {
            SetTheme("#eee")
        },2000)
    }
    Init()
})();