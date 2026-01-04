// ==UserScript==
// @name         奥鹏大连理工通识教育 化学与社会
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://media4.open.com.cn/L602/1309/dagong/tsjy-huaxyss/kechengxuexi/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396895/%E5%A5%A5%E9%B9%8F%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%E9%80%9A%E8%AF%86%E6%95%99%E8%82%B2%20%E5%8C%96%E5%AD%A6%E4%B8%8E%E7%A4%BE%E4%BC%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/396895/%E5%A5%A5%E9%B9%8F%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%E9%80%9A%E8%AF%86%E6%95%99%E8%82%B2%20%E5%8C%96%E5%AD%A6%E4%B8%8E%E7%A4%BE%E4%BC%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var [page, index ] = document.URL.match(/(\d+).html$/i)
    var nextPage = page.replace(index, ++index);

    function playNext(){
        window.location.href = document.URL.replace(page, nextPage)
    }

    const video = document.querySelector('video');
    video.addEventListener('ended', playNext);

    setInterval(() => {
        video.play();
        video.volume = 0;
    }, 1000);
})();