// ==UserScript==
// @name         Emojigu
// @namespace    https://d0j1a1701.cc/
// @version      0.1.0
// @description  为提交记录增添 Emoji 表情
// @author       d0j1a_1701
// @match        https://*.luogu.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476882/Emojigu.user.js
// @updateURL https://update.greasyfork.org/scripts/476882/Emojigu.meta.js
// ==/UserScript==

function addEmoji(){
    let flag = false;
    // 遍历每个元素并修改其 innerText
    document.querySelectorAll(".test-case-wrap > .wrapper > .test-case > .content > .status").forEach(element => {
        const status = element.innerText;
        if (status === "AC") {
            element.innerText += " 😘";
        } else if (status === "WA") {
            element.innerText += " 🤔";
        } else if (status === "TLE") {
            element.innerText += " 🐌";
        } else if (status === "MLE") {
            element.innerText += " 😨";
        } else if (status === "RE") {
            element.innerText += " 🤯";
        } else if (status === "OLE") {
            element.innerText += " 🤬";
        } else if (status === "UKE") {
            element.innerText += " 😅";
        };
        flag = true;
    });

    // 遍历每个元素并修改其 innerText
    document.querySelectorAll("span[data-v-541237e4][data-v-8b7f80ba]").forEach(element => {
        if (element.children.length > 0) return;
        const status = element.innerText;
        if (status.includes("Accepted")) {
            element.innerText += " 😘";
        } else if (status.includes("Unaccepted")) {
            element.innerText += " 🤔";
        } else if (status.includes("Compile Error")) {
            element.innerText += " 🤡";
        } else if (status.includes("Unknown Error")) {
            element.innerText += " 😅";
        } else if (status.includes("Waiting")) {
            element.innerText += " 🙄";
        } else if (status.includes("Judging")) {
            element.innerText += " ⚡";
        } else if (!isNaN(status)) { // 判断是否为数字
            const number = parseFloat(status);
            if (number === 0) {
                element.innerText += " 🤡";
            } else if (number > 0 && number <= 30) {
                element.innerText += " 🤣";
            } else if (number > 30 && number <= 50) {
                element.innerText += " 🧐";
            } else if (number > 50 && number <= 80) {
                element.innerText += " 😯";
            } else if (number > 80 && number < 100) {
                element.innerText += " 😡";
            } else if (number === 100) {
                element.innerText += " 😉";
            } else if (number > 100) {
                element.innerText += " 🤩";
            }
        }
        flag = true;
    });
    /*
    document.querySelectorAll(".tag.status-name").forEach(element => {
        const status = element.innerText;
        if (status.includes("Accepted")) {
            element.innerText += " 😘";
        } else if (status.includes("Unaccepted")) {
            element.innerText += " 🤔";
        } else if (status.includes("Compile Error")) {
            element.innerText += " 🤡";
        } else if (status.includes("Unknown Error")) {
            element.innerText += " 😅";
        } else if (status.includes("Waiting")) {
            element.innerText += " 🙄";
        } else if (status.includes("Judging")) {
            element.innerText += " ⚡";
        }
        flag = true;
    });
    */
    return flag;
};

function gmMain () {
    let i = setInterval(function(){
          if(addEmoji()) clearInterval(i);
      },100);
}

var fireOnHashChangesToo    = false;
var pageURLCheckTimer       = setInterval (
    function () {
        if (this.lastPathStr  !== location.pathname
            || (fireOnHashChangesToo && this.lastQueryStr !== location.search)
            || (fireOnHashChangesToo && this.lastHashStr !== location.hash)) {
            this.lastPathStr  = location.pathname;
            this.lastQueryStr = location.search;
            this.lastHashStr  = location.hash;
            gmMain ();
        }
    }
    , 100
);