// ==UserScript==
// @name         Leetcode problem pass rate
// @namespace    https://github.com/rustberry
// @version      0.1
// @description  为 Leetcode（英文版）增加题目通过率，使用网站**原本样式**。
// @description:en  Add the pass rate of Leetcode problems.
// @author       Rust
// @match        https://leetcode.com/problems/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403721/Leetcode%20problem%20pass%20rate.user.js
// @updateURL https://update.greasyfork.org/scripts/403721/Leetcode%20problem%20pass%20rate.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addRate() {
        let arr = document.querySelectorAll(".css-oqu510")
        console.log(arr)
        var ac = arr[0].lastElementChild.textContent
        var sub = arr[1].lastElementChild.textContent
        console.log(ac, sub)

        ac = parseInt(ac.replace(/,/g, ''))
        sub = parseInt(sub.replace(/,/g, ''))
        console.log(ac, sub)
        var res = ac/sub * 100
        res = res.toPrecision(4) + "%"

        var parent = document.querySelector("#app > div > div.main__2_tD > div.content__3fR6 > div > div.side-tools-wrapper__1TS9 > div > div.css-9z7f7i-Container.e5i1odf0 > div.css-jtoecv > div > div.tab-pane__ncJk.css-xailxq-TabContent.e5i1odf5 > div > div:nth-child(3) > div.css-12aggky")
        var html = 
            '<div class="css-oqu510"><div class="css-y3si18">Rate</div><div class="css-jkjiwi">'
            + res + '</div></div>'

        parent.insertAdjacentHTML('beforeend', html)
    }
    
    function waitForElement(selector) {
        var timeout = 60000  // wait for at most 1 minute
        var start = performance.now();
        var now = 0;

        return new Promise(function (resolve, reject) {
            var interval = setInterval(function () {
                var element = document.querySelectorAll(selector);

                if (element !== null && element.length >= 2) {
                    clearInterval(interval);
                    console.log("Exists!");
                    addRate()
                    resolve();
                }

                now = performance.now();

                if (now - start >= timeout) {
                    reject("Could not find the element " + selector + " within " + timeout + " ms");
                }
            }, 100);  // check every 100ms
        });
    }
    
    waitForElement(".css-oqu510")
})();
