// ==UserScript==
// @name         好大学在线一键/自动满分
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Yuan
// @match        *://www.cnmooc.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381399/%E5%A5%BD%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%E4%B8%80%E9%94%AE%E8%87%AA%E5%8A%A8%E6%BB%A1%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/381399/%E5%A5%BD%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%E4%B8%80%E9%94%AE%E8%87%AA%E5%8A%A8%E6%BB%A1%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function autoSelect() {
        this.select()
    }
    function setScore() {
        var scoreLabels = Array.from(document.getElementsByClassName("mt-para"))
        if (scoreLabels.length > 0) {
            scoreLabels.forEach(item => {
                var text = item.textContent;
                var score = /满分(\d{1,2})分/g.exec(text)[1]
                if (item.nextElementSibling.lastElementChild.value == "") {
                    console.log("Set score " + score)
                    item.nextElementSibling.lastElementChild.value = score
                    item.nextElementSibling.lastElementChild.onclick = autoSelect
                }
            })
        }
    }
    setInterval(setScore, 1000)
})();