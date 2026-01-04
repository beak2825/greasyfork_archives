// ==UserScript==
// @name         AJL Join Count
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  AJLの学年別ページに参加回数を記載します
// @author       ZOI_dayo
// @match        https://img.atcoder.jp/ajl*/output_personal_grade*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472659/AJL%20Join%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/472659/AJL%20Join%20Count.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("aa")
    const tr = Array.from(document.querySelectorAll("tr"))
    const title = document.createElement("th")
    title.setAttribute("nowrap", null)
    title.innerText = "参加回数"
    tr[0].insertBefore(title, tr[0].children[5])
    const title_ave = document.createElement("th")
    title_ave.setAttribute("nowrap", null)
    title_ave.innerText = "平均スコア"
    tr[0].insertBefore(title_ave, tr[0].children[7])
    tr.slice(1).forEach(elem => {
        const content = document.createElement("td")
        const count = Array.from(elem.children).slice(6).filter(elem => elem.innerText != "").length
        if(count < 10) content.innerText = count
        else {
            const text = document.createElement("b")
            text.style.color = "#FF0000"
            text.innerText = count
            content.appendChild(text)
        }
        elem.insertBefore(content, elem.children[5])
        const content_ave = document.createElement("td")
        content_ave.innerText = (elem.children[6].innerText / Math.min(10, count) ) .toFixed(1)
        elem.insertBefore(content_ave, elem.children[7])
    })
    const default_tr = Array.from(document.querySelectorAll("tr"))
    const button = document.createElement("input")
    button.setAttribute("type", "button")
    button.style.backgroundColor = "#add8e6"
    button.style.border = "none"
    button.style.padding = ".5em"
    button.style.margin = ".5em"
    const sort = () => {
        const sorted = default_tr.slice(1).sort((a, b) => {return -1 * Number(a.children[7].innerText) + Number(b.children[7].innerText) })
        for(let i=0; i<sorted.length; i++) sorted[i].children[0].innerHTML = (i+1) + '<span style="color: #AAA; font-size: .75em">(' + sorted[i].children[0].innerText + ")</span>"
        document.querySelectorAll("tbody")[0].replaceChildren(Array.from(document.querySelectorAll("tr"))[0], ...sorted)

        button.setAttribute("value", "通常表示に戻す")
        button.onclick = () => {normal()}
    }
    const normal = () => {
        default_tr.forEach(elem => {
            if(elem.children[0].innerText.includes('(')) {
                elem.children[0].innerText = elem.children[0].innerText.split('(')[1].split(')')[0]
            }
        })
        document.querySelectorAll("tbody")[0].replaceChildren(...default_tr)
        button.setAttribute("value", "平均スコアで並べ替え")
        button.onclick = () => {sort()}
    }
    document.querySelector("div.btn.btn02").after(button)
    normal()
})();