// ==UserScript==
// @name         BTSOW磁力快捷复制
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  快捷复制磁力
// @include       https://btsow.*/search/*
// @author       Czl
// @downloadURL https://update.greasyfork.org/scripts/396602/BTSOW%E7%A3%81%E5%8A%9B%E5%BF%AB%E6%8D%B7%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/396602/BTSOW%E7%A3%81%E5%8A%9B%E5%BF%AB%E6%8D%B7%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let datalist = document.querySelectorAll(".data-list > .row:not(:first-child)");
    let copyInput = document.createElement("input");
    copyInput.id = "copy-input";
    copyInput.hidden = true;
    document.body.appendChild(copyInput);
    copyInput = document.querySelector("#copy-input");
    for(let i = 0; i < datalist.length; i++){
        let url = datalist[i].firstElementChild.href;
        let magnet = `magnet:?xt=urn:btih:${url.split("/").pop()}`;
        let newDiv = document.createElement("div");
        newDiv.classList.add("col-sm-2");
        newDiv.classList.add("col-lg-2");
        newDiv.classList.add("hidden-xs");
        let copyBtn = document.createElement("button");
        copyBtn.innerText = "复制磁力";
        copyBtn.onclick = e =>{
            copyInput.value = magnet;
            copyInput.hidden = false;
            copyInput.select();
            document.execCommand("Copy");
            copyInput.hidden = true;
        }
        newDiv.appendChild(copyBtn);
        datalist[i].appendChild(newDiv);
    }
})();