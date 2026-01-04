// ==UserScript==
// @name         魔力兑换上传
// @namespace    http://tampermonkey.net/
// @version      2024-08-16
// @description  魔力自动兑换上传，点一次之后自动运行，不用手动一直点
// @author       Aisnc
// @license      N/A
// @match        https://hdatmos.club/mybonus.php?do=upload
// @match        https://pterclub.com/mybonus.php?do=upload
// @match        https://audiences.me/mybonus.php?do=upload
// @match        https://hdhome.org/mybonus.php?do=upload
// @match        https://www.hdkyl.in/mybonus.php?do=upload
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hdatmos.club
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503898/%E9%AD%94%E5%8A%9B%E5%85%91%E6%8D%A2%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/503898/%E9%AD%94%E5%8A%9B%E5%85%91%E6%8D%A2%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==
//10000表示10（10000毫秒）秒点一下
//tr:nth-child(8) > td:nth-child(5)hdatmos
//tr:nth-child(13) > td:nth-child(5)hdhomg
//tr:nth-child(14) > td:nth-child(5)audiences
//tr:nth-child(7) > td:nth-child(5)pter,hdkylin
(function() {
    'use strict';

    let moliBtn = document.querySelector('#outer > table > tbody > tr:nth-child(7) > td:nth-child(5) > input[type=submit]')
    setInterval(()=>{ moliBtn.click() },3000)

})();