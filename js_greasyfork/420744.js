// ==UserScript==
// @name         展开永硕文件夹
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  展开永硕文件夹。根据文件列表的多少， 等待几十秒到几分钟不等。
// @author       You
// @match        *://*.ys168.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/420744/%E5%B1%95%E5%BC%80%E6%B0%B8%E7%A1%95%E6%96%87%E4%BB%B6%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/420744/%E5%B1%95%E5%BC%80%E6%B0%B8%E7%A1%95%E6%96%87%E4%BB%B6%E5%A4%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
    .menu,.gml,.menuList {display: block !important;};

`);
function sleep(ms){
    return new Promise(function (resolve, reject) {
        setTimeout(()=>{
            resolve();
        },ms);
    })
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + text);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

(async ()=>{
    await sleep(1000)
    var jobs = document.querySelectorAll('.ml')
    for (let i of jobs) {
        i.click()
        await sleep(1000)
    }
})();
})();