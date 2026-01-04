// ==UserScript==
// @name                Plurk 底部固定留言
// @version             1.0.0
// @description         底部固定留言
// @author              Hayao-Gai
// @namespace           https://github.com/HayaoGai
// @icon                https://i.imgur.com/NobhW0E.png
// @match               https://www.plurk.com/p/*
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/461896/Plurk%20%E5%BA%95%E9%83%A8%E5%9B%BA%E5%AE%9A%E7%95%99%E8%A8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/461896/Plurk%20%E5%BA%95%E9%83%A8%E5%9B%BA%E5%AE%9A%E7%95%99%E8%A8%80.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    "use strict"

    const STYLE = `
.fixed {
    position: fixed;
    left: 300px;
    bottom: 0px;
    width: 1000px;
    background-color: #202020;
}
.switch {
    position: fixed;
    left: 20px;
    bottom: 20px;
}`
    let poster = null

    function css() {
        const style = document.createElement("style")
        style.type = "text/css"
        style.innerHTML = STYLE
        document.head.appendChild(style)
    }

    function fixedButton() {
        const button = document.createElement("button")
        button.innerText = "Fixed"
        button.classList.add("switch")
        button.addEventListener("click", onClick)
        document.body.append(button)
    }

    function onClick() {
        !poster && (poster = document.querySelector(".poster_holder"))
        if (!poster) return
        poster.className.includes("fixed") ? (poster.classList.remove("fixed")) : (poster.classList.add("fixed"))
    }

    function main() {
        css()
        fixedButton()
    }

    main()

})();
