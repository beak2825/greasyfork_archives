// ==UserScript==
// @name         BT之家附件直下
// @namespace    https://114514.plus/
// @version      0.2.4
// @description  BT之家附件直接下载。
// @author       夜黑 / jkfujr
// @match        *://*.btbtt10.com/*.htm
// @match        *://*.btbtt11.com/*.htm
// @match        *://*.btbtt12.com/*.htm
// @match        *://*.btbtt13.com/*.htm
// @match        *://*.btbtt14.com/*.htm
// @match        *://*.btbtt15.com/*.htm
// @match        *://*.btbtt16.com/*.htm
// @match        *://*.btbtt17.com/*.htm
// @match        *://*.btbtt18.com/*.htm
// @match        *://*.btbtt19.com/*.htm
// @match        *://*.btbtt20.com/*.htm
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/432939/BT%E4%B9%8B%E5%AE%B6%E9%99%84%E4%BB%B6%E7%9B%B4%E4%B8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/432939/BT%E4%B9%8B%E5%AE%B6%E9%99%84%E4%BB%B6%E7%9B%B4%E4%B8%8B.meta.js
// ==/UserScript==

function adddownload(btl) {
    for(var i=0;i< btl.length;i++){
        var newbtl = document.createElement("td");
        newbtl.width = "70";
        newbtl.className = "grey";
        newbtl.innerHTML = "直接下载";
        var btl2 = btl[i].getElementsByTagName('td')[1];
        btl[i].insertBefore(newbtl, btl2);
    }
}

function replacedownload(zjxz) {
    for(var j=0;j< zjxz.length;j++){
        var replaceword = zjxz[j].href.replace(/dialog/g, 'download');
        var newdownload1 = document.createElement("td");
        //newdownload1.className = "grey";
        var newdownload2 = document.createElement("a");
        newdownload2.href = replaceword;
        newdownload2.target = "_blank";
        newdownload2.rel = "nofollow";
        newdownload2.innerHTML = "下载";
        newdownload1.appendChild(newdownload2);
        var download2 = zjxz[j].parentElement.parentElement.getElementsByTagName('td')[1];
        zjxz[j].parentElement.parentElement.insertBefore(newdownload1, download2);
    }
}

function realnum(xzcs) {
    for(var k=0;k< xzcs.length;k++){
        if(xzcs[k].innerHTML.match(/[0-9]*次/g)) {
            var realnumber = parseInt(xzcs[k].innerHTML.replace(/次/g, '')/7);
            xzcs[k].innerHTML = realnumber+" 次";
        }
    }
}

var xzbt=document.querySelectorAll(".attachlist>.noborder>tbody>tr:nth-of-type(1)");
adddownload(xzbt);
var xzlj=document.querySelectorAll(".attachlist>.noborder>tbody>tr>td>a");
replacedownload(xzlj);
var xzycswz=document.querySelectorAll(".attachlist>.noborder>tbody>tr>td:nth-of-type(5)");
realnum(xzycswz);
var xqycswz=document.querySelectorAll("#body>.border>dl>dd:nth-of-type(3)");
realnum(xqycswz);
