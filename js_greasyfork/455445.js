// ==UserScript==
// @name         ASOBISTAGE ミュート
// @namespace    http://twitter.com/udop_
// @version      0.1
// @description  ASOBISTAGEのコメントにミュート機能を提供します
// @author       @udop_
// @match        https://asobistage.asobistore.jp/event/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/455445/ASOBISTAGE%20%E3%83%9F%E3%83%A5%E3%83%BC%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/455445/ASOBISTAGE%20%E3%83%9F%E3%83%A5%E3%83%BC%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {

        let muteList = []

        const target = document.querySelector("div[class^='commentViewer_commentList__'] > div:nth-child(2) > div > div")
        const observer = new MutationObserver(function (mutations) {
            for (var comment of target.children) {

                var name = comment.children[0].children[0].children[0]
                var text = comment.children[0].children[0].children[1]

                if (muteList.includes(name.innerText)) {
                    name.innerText = "<muted>"
                    text.innerText = ""
                }
            }
        });

        const textarea = document.createElement("textarea")
        textarea.setAttribute("placeholder", "1行に1つミュートしたい名前を登録(完全一致)")
        textarea.setAttribute("style", "position: fixed; right: 0; bottom: 0; display: none; width: 300px; height: 100px; resize: none;")
        textarea.addEventListener("change", () => {
            muteList = textarea.value.split("\n")
        })
        document.body.insertBefore(textarea, null)

        const nav = document.querySelector("nav[class^='style_nav__']")
        const button = document.createElement("button")
        button.innerText = "ミュート"
        button.addEventListener("click", () => {
            var display = textarea.style.display
            textarea.style.display = display == "block" ? "none" : "block";
        })
        nav.insertBefore(button, nav.children[0])

        observer.observe(target, { attributes: true })

    }, 3000);

})();