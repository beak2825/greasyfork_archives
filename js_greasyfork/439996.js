// ==UserScript==
// @name         AtCoderHideScore
// @namespace    https://github.com/kagemeka
// @version      0.1.0
// @description  Hide the score section of a task statement on AtCoder.
// @author       Hiroshi Tsuyuki
// @match        https://atcoder.jp/contests/*/tasks/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439996/AtCoderHideScore.user.js
// @updateURL https://update.greasyfork.org/scripts/439996/AtCoderHideScore.meta.js
// ==/UserScript==

window.onload = function() {
    console.log("test hidden");
    const taskSection = document.getElementById("task-statement");
    let section = taskSection.getElementsByTagName("p")[0];
    section.style.display = "none";
    console.log(section);
}
