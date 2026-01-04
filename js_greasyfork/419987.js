// ==UserScript==
// @name         Brick hill posts per day
// @author       Noah
// @match        https://www.brick-hill.com/forum/thread/*
// @match        https://www.brick-hill.com/user/*
// @description  Tells you (on average) how much a user posts per day
// @version      1.0
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/419987/Brick%20hill%20posts%20per%20day.user.js
// @updateURL https://update.greasyfork.org/scripts/419987/Brick%20hill%20posts%20per%20day.meta.js
// ==/UserScript==

let el = document.querySelectorAll("span.light-gray-text")
for(let x = 0; x < el.length; x+=2) {
    let date = el[x].innerText.match(/(\d+)\/(\d+)\/(\d+)/)
    date = new Date(`${date[3]} ${date[2]} ${date[1]}`)
    let days = Math.floor((new Date() - date)/1000/60/60/24)
    let posts = parseInt(el[x+1].innerText.match(/[\d,]+/)[0].replace(/,/g,""))
    let text = document.createElement("span")
    text.className = "light-gray-text"
    text.innerText = (posts/days).toFixed(1) + " posts per day"
    document.querySelectorAll(".col-3-12")[x/2].appendChild(document.createElement("br"))
    document.querySelectorAll(".col-3-12")[x/2].appendChild(text)
}
if(document.querySelectorAll(".stats-table")) {
let date = document.getElementById("join-date").innerText.match(/(\d+)\/(\d+)\/(\d+)/)
date = new Date(`${date[3]} ${date[2]} ${date[1]}`)
let days = Math.floor((new Date() - date)/1000/60/60/24)
let posts = parseInt(document.getElementById("forum-posts").innerText.match(/[\d,]+/)[0].replace(/,/g,""))
let text = document.createElement("td")
    text.innerText = (posts/days).toFixed(1) + " posts per day"
    let tr = document.createElement("tr")
    tr.innerHTML = "<td><b>Posts per day:</b></td>"
    tr.appendChild(text)
    document.querySelectorAll(".stats-table")[0].appendChild(tr)
}