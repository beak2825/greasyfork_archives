// ==UserScript==
// @name         Copy Code From CQUPT Code Question Lib
// @namespace    http://172.20.2.205/ctas/student.htm/
// @version      0.1.1
// @description  Copy code from CQUPT code question lib
// @author       Lomirus
// @match        http://172.20.2.205/ctas/student.htm
// @icon         https://www.google.com/s2/favicons?domain=2.205
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/427115/Copy%20Code%20From%20CQUPT%20Code%20Question%20Lib.user.js
// @updateURL https://update.greasyfork.org/scripts/427115/Copy%20Code%20From%20CQUPT%20Code%20Question%20Lib.meta.js
// ==/UserScript==

'use strict';

window.onload = function() {
    const body = document.querySelector("frame").contentWindow.document.body;
    const getCodeButton = document.createElement("button");
    getCodeButton.textContent = "复制";
    getCodeButton.style.position = "absolute";
    getCodeButton.style.display = "block";
    getCodeButton.style.top = "0";
    getCodeButton.style.left = "40vw";
    getCodeButton.style.height= "56px";
    getCodeButton.style.width= "120px";
    getCodeButton.style.fontSize= "20px";
    getCodeButton.onclick = async () => {
        try {
            GM_setClipboard(getCode())
            alert("复制成功🧐")
        } catch {
            alert("😅复制麻了")
        }
    }
    body.appendChild(getCodeButton)
};


function getCode() {
    const ProgramContent = document.querySelector("frame")
        .contentWindow.document.querySelector("iframe")
        .contentWindow.document.querySelector("#ProgramContent")
        .childNodes;
    const elements = [...ProgramContent]
    return (
        elements
            .filter(el => el.nodeName === '#text')
            .map(el => el.textContent)
            .map(t => t.replace(/　/g, " "))
            .map(t => t.replace(/\d*?\)(.*)/g, "$1"))
            .join("\n")
    )
}
