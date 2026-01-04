// ==UserScript==
// @name         打トレ開始ボタン
// @namespace    http://tampermonkey.net/
// @version      2025-02-01
// @description  ウェブアーカイブの打トレ開始ボタン
// @author       You
// @include      https://web.archive.org/*/type.cgi
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archive.org
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/525546/%E6%89%93%E3%83%88%E3%83%AC%E9%96%8B%E5%A7%8B%E3%83%9C%E3%82%BF%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/525546/%E6%89%93%E3%83%88%E3%83%AC%E9%96%8B%E5%A7%8B%E3%83%9C%E3%82%BF%E3%83%B3.meta.js
// ==/UserScript==

document.body.insertAdjacentHTML("beforeend",
                                 `<button id="start_func_button">startFunc(Enter)</button>
                                 <style>
#start_func_button  {
    position: fixed;
    bottom: 50px;
    right: 40px;
    padding: 1rem;
    font-size: larger;
    border: solid 2px;
    border-radius: 0.5rem;
    background: chartreuse;
}
</style> `)

const element = document.getElementById("start_func_button")

element.addEventListener("click", (event) => {
startFunc()
})

window.addEventListener("keydown", (event) => {
if(event.key === "Enter")
    startFunc()
})

Math.random = function(){return new Date().getMilliseconds()/1000}