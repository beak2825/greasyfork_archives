// ==UserScript==
// @name         export private key
// @namespace    http://github.com/harryhare
// @version      0.1
// @description  export private key for dark forest player
// @author       You
// @match        https://zkga.me/play/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL3.0
// @downloadURL https://update.greasyfork.org/scripts/442525/export%20private%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/442525/export%20private%20key.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.height = "200px";
    container.style.width = "200px";


    let input = document.createElement("input");
    input.style.width = "100%";
    input.placeholder = "address";
    let output = document.createElement("div");
    output.style.width = "100%";
    output.innerText = "0x" + "0000000000000000000000000000000000000000";
    output.style.backgroundColor = "white";
    let button = document.createElement("button");
    button.style.width = "100%";
    button.style.backgroundColor = "grey";
    button.innerText = "导出私钥";
    button.onclick = async () => {
        let userId = input.value;
        if (userId.length !== 42) {
            return;
        }
        let key = `skey-${userId}`
        output.innerText = localStorage.getItem(key);
    };


    container.appendChild(input);
    container.appendChild(output);
    container.appendChild(button);
    document.body.appendChild(container);
})();