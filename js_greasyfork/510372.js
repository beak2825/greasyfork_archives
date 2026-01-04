// ==UserScript==
// @name         Parse IO
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to free your hands and brains!
// @author       GZY
// @match        https://pan.leuven-instruments.com:8884/js/module/editOL/edit.html?*
// @match        https://pan.leuven-instruments.com:8884/v/preview/ent/*
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510372/Parse%20IO.user.js
// @updateURL https://update.greasyfork.org/scripts/510372/Parse%20IO.meta.js
// ==/UserScript==

let file_name_dom;
let file_name;
let find_name_interval = setInterval(() => {
    if (file_name) {
        clearInterval(find_name_interval)
        if (file_name.endsWith(".xlsx") && file_name.indexOf("IO")!== -1) {
            const scriptLink = document.createElement("script");
            scriptLink.src = "https://gxx.cool/tampermonkey/IO.js?" + new Date().getTime();
            document.head.append(scriptLink);
            return
        }
    }
    if(location.href.indexOf("editOL") !== -1){
        file_name = document.title.trim();
    }else{
        file_name_dom = document.getElementsByClassName("el-tooltip title cp")
        if(file_name_dom){
            file_name = file_name_dom[0].textContent.trim()
        }
    }

}, 500)

