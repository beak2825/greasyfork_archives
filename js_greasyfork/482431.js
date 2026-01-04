// ==UserScript==
// @name         Gushiwen Auto Unfolding
// @name:zh-cn   古诗文网自动展开
// @namespace    http://tampermonkey.net/
// @version      2023-12-16
// @description  Auto unfolding the fanyi and shangxi blocks for so.gushiwen.cn & remove Weixin QR-Code
// @description:zh-cn  自动展开古诗文网注释/赏析，移除微信二维码
// @author       WntFlm
// @match        *://so.gushiwen.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gushiwen.cn
// @grant        none
// @license      GPLv3
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/482431/Gushiwen%20Auto%20Unfolding.user.js
// @updateURL https://update.greasyfork.org/scripts/482431/Gushiwen%20Auto%20Unfolding.meta.js
// ==/UserScript==

function fanyiShow(id, idjm) {
    document.getElementById('fanyi' + id).style.display = 'none';
    document.getElementById('fanyiquan' + id).style.display = 'block';

    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("fanyiquan" + id).innerHTML = xmlhttp.responseText;
            //如果正在播放
            if (document.getElementById('fanyiPlay' + id).style.display == "block") {
                document.getElementById('speakerimgFanyiquan' + id).src = "https://ziyuan.guwendao.net/siteimg/speak-erOk.png";
            }
        }
    }
    xmlhttp.open("GET", "/nocdn/ajaxfanyi.aspx?id=" + idjm, false);
    xmlhttp.send();
}

function shangxiShow(id, idjm) {
    document.getElementById('shangxi' + id).style.display = 'none';
    document.getElementById('shangxiquan' + id).style.display = 'block';

    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("shangxiquan" + id).innerHTML = xmlhttp.responseText;
            //如果正在播放
            if (document.getElementById('shangxiPlay' + id).style.display == "block") {
                document.getElementById('speakerimgShangxiquan' + id).src = "https://ziyuan.guwendao.net/siteimg/speak-erOk.png";
            }
        }
    }
    xmlhttp.open("GET", "/nocdn/ajaxshangxi.aspx?id=" + idjm, false);
    xmlhttp.send();
}

window.fanyiShow = fanyiShow;
window.shangxiShow = shangxiShow;

(function() {
    'use strict';
    // Remove Weixin QR-Code
    document.querySelector("#hide-center2").remove()
    // Auto Unfolding
    let fanyiOnClick = document.querySelector("[id^='fanyi'] > div > div:nth-child(1)").click();
    if (/fanyiShow\(\d+,'[A-Z0-9]+'\)/.exec(fanyiOnClick)) {
        eval(fanyiOnClick);
    } else {
        console.log("[ERROR] (Gushiwen Auto Unfolding) Can't find the unfolding function, try updating this script.");
    }
    let shangxiOnClick = document.querySelector("[id^='shangxi'] > div > div:nth-child(1)").click();
    if (/shangxiShow\(\d+,'[A-Z0-9]+'\)/.exec(shangxiOnClick)) {
        eval(shangxiOnClick);
    } else {
        console.log("[ERROR] (Gushiwen Auto Unfolding) Can't find the unfolding function, try updating this script.");
    }
})();
