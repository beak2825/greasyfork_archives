// ==UserScript==
// @name         Blacklist v2
// @namespace    https://tabun.everypony.ru/
// @version      0.1
// @description  Hide them all!
// @author       Lunavod
// @match        https://tabun.everypony.ru/blog/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420409/Blacklist%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/420409/Blacklist%20v2.meta.js
// ==/UserScript==



(function() {
    'use strict'
    const blackList = ["Sasha-Flyer"]

    const wrap = text => `<span class="spoiler spoiler-blacklist"><span class="spoiler-title">Комментарий в ЧС</span><span class="spoiler-body">${text}</span></span>`
    const styles = `
    .spoiler-blacklist .spoiler-title {
        background: #ffeeee;
        border: 1px solid #978686;
    }
    `

    function processComments() {
        document.querySelectorAll(".comment:not(.blacklist-parsed)").forEach(comment => {
            const author = comment.querySelector("li.comment-author a:last-child").innerText
            comment.classList.add("blacklist-parsed")
            comment.dataset.userLogin = author
            if (!blackList.includes(author)) return

            const content = comment.querySelector(".text").innerHTML
            comment.querySelector(".text").innerHTML = wrap(content)
        })
    }

    function addStyles() {
        const el = document.createElement("style")
        el.innerHTML = styles
        document.body.appendChild(el)
    }

    addStyles()
    processComments()
    setInterval(() => processComments(), 1000)
})()