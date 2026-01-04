// ==UserScript==
// @name         NGA签到装置
// @namespace    No namespace.
// @version      1.1
// @license      WTFPL
// @description  No description.
// @author       You
// @match       *://bbs.nga.cn/*
// @match       *://ngabbs.com/*
// @match       *://nga.178.com/*

// @downloadURL https://update.greasyfork.org/scripts/453626/NGA%E7%AD%BE%E5%88%B0%E8%A3%85%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/453626/NGA%E7%AD%BE%E5%88%B0%E8%A3%85%E7%BD%AE.meta.js
// ==/UserScript==



(function() {
    'use strict';

    function checkin() {
    let postData;
    let logging;
    let domain = document.domain;
    fetch(`https://${domain}/nuke.php?__lib=check_in&__act=check_in&__output=8`, {
        method: 'POST',
        headers: new Headers({
            "X-User-Agent": "Nga_Official"
        })
    })
        .then(res => res.arrayBuffer())
        .catch(error => { postData = { 'error': [error] } })
        .then(buffer => new TextDecoder("gbk").decode(buffer))
        .then((res) => {
            postData = JSON.parse(res);
            if (!postData) {
                logging = "奇怪的错误..."
            } else {
                if ('data' in postData) {
                    logging = postData.data[0]
                }
                 else if ('error' in postData) {
                    logging = postData.error[0]
                }
            }
            alert(logging);
        });
    }

    let myDiv = document.createElement("div");
    myDiv.className = "td";

    let myDivLink = document.createElement("a");
    myDivLink.className = "mmdefault";
    myDivLink.innerHTML = "签到";
    myDivLink.setAttribute("href", "javascript:void(0)");
    myDivLink.setAttribute("title", "114514");
    myDivLink.style = "white-space: nowrap;";
    myDivLink.addEventListener("click", checkin);

    myDiv.appendChild(myDivLink);

    let toolBar = document.getElementsByClassName("right")[0];
    toolBar.insertBefore(myDiv, toolBar.getElementsByClassName("td")[1]);
})();