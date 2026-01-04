// ==UserScript==
// @name         天翼云盘一键下载当前所有
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://cloud.189.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420952/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E5%BD%93%E5%89%8D%E6%89%80%E6%9C%89.user.js
// @updateURL https://update.greasyfork.org/scripts/420952/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E5%BD%93%E5%89%8D%E6%89%80%E6%9C%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log(document.getElementsByClassName("list-icons-download"))
    let downloadButtonElement = document.createElement("a")
    downloadButtonElement.id = "downloadBtnxxx"
    downloadButtonElement.style.marginLeft = "20px"
    downloadButtonElement.style.background = "#ff5252"
    document.getElementsByClassName("file-operate")[0].appendChild(downloadButtonElement)
    downloadButtonElement.className="btn btn-save-as"
    downloadButtonElement.style.cursor="pointer"


     $("#downloadBtnxxx").text("一键下载所有")
     $("#downloadBtnxxx").click(function(event) {
       let operate = document.getElementsByClassName("operate-menu")
        for(let i=0;i<operate.length;i++){
            console.log(operate[i])
            operate[i].style.display = "block"
        }
        let downloadBtn = document.getElementsByClassName("list-icons-download")
          for(let i=0;i<downloadBtn.length;i++){
            downloadBtn[i].click()
               operate[i].style.display = "none"
        }
     });

})();