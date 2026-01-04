// ==UserScript==
// @name        Copy Question of Programming hero
// @namespace   Violentmonkey Scripts
// @match       https://web.programming-hero.com/web-8/quiz-question/*
// @grant       none
// @version     1.1
// @author      myth434
// @description 8/12/2023, 11:36:11 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472953/Copy%20Question%20of%20Programming%20hero.user.js
// @updateURL https://update.greasyfork.org/scripts/472953/Copy%20Question%20of%20Programming%20hero.meta.js
// ==/UserScript==

const copyquestion = () => {
    c = ""
    b = document.getElementsByClassName("px-md-5 mx-md-3 mt-md-2")[0].innerText;
    c += '[Question] ' + b + '\n';
    a = document.getElementsByClassName("mr-auto p-2");
    q = 1;
    for (i = 0; i < a.length; i++) {
        t = a[i].innerHTML;
        if (t != '') {
            c += "[" + q + "] " + t + '\n';
            q++;
        }
    }
    const input = document.createElement("textarea");
    input.value = c
    document.body.appendChild(input);
    input.select();
    let result = document.execCommand("copy");
    document.body.removeChild(input);
    if (result) alert("copied to clipboard");
    else
        prompt("Failed to copy links. Manually copy from below\n\n", input.value);
};

setTimeout(function() {
    let container = document.querySelector(".text-center.mt-3")
    const cpyBtn = document.createElement("button");
    cpyBtn.textContent = "Copy";
    cpyBtn.classList.add("btn");
    cpyBtn.classList.add("previous-button");
  cpyBtn.style =
  "border:1px solid red;margin-left:2px;margin-right:2px;";
    cpyBtn.addEventListener("click", copyquestion);
    container.append(cpyBtn);
}, 500);