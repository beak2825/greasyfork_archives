// ==UserScript==
// @name         Github commits最后一页
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  This will help users get a button to click to end of the github commits page.
// @author       Mutu
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470176/Github%20commits%E6%9C%80%E5%90%8E%E4%B8%80%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/470176/Github%20commits%E6%9C%80%E5%90%8E%E4%B8%80%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let reg = new RegExp("\/commits\/")
    var isInsert = false
    var timer = setInterval(() => {
        if (isInsert) {
            if (reg.test(window.location.pathname)) {
            } else {
                getCommits()
                isInsert = false
            }
        } else {
            if (reg.test(window.location.pathname)) {
                insertBtn()
                isInsert = true
            } else {
                getCommits()
            }
        }
    }, 1000);

    function getCommits() {
        if (document.querySelector("span .fgColor-default")) {
            let commits = document.querySelector("span .fgColor-default").innerText
            sessionStorage.setItem("commits", commits)
            console.log(commits)
        }else{
            console.log('Fail to find out commit number')
        }
    }

    function insertBtn() {
        let commitsStr = sessionStorage.getItem("commits")
        let btnToNext = document.querySelector('a[data-testid=pagination-next-button]')
        let btnGroup = btnToNext.parentNode.parentNode
        let btnToEnd = document.createElement('a')
        btnToEnd.className = btnToNext.classList
        let commitsNum = parseInt(commitsStr.replace(/,/, ""), 10)
        btnToEnd.href = btnToNext.href.replace(/\+\d+/g, `+${commitsNum - 34}`)
        btnToEnd.innerText = "Click To End"
        btnGroup.appendChild(btnToEnd)
    }
})();