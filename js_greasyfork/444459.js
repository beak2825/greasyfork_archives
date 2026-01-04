// ==UserScript==
// @name        过滤 3600P 以下画质
// @namespace   Violentmonkey Scripts
// @match       https://proxyrarbg.org/torrents.php
// @match       https://rarbgunblocked.org/torrents.php
// @grant       none
// @version     1.0
// @author      -
// @description 2022/1/16 下午8:34:23
// @downloadURL https://update.greasyfork.org/scripts/444459/%E8%BF%87%E6%BB%A4%203600P%20%E4%BB%A5%E4%B8%8B%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/444459/%E8%BF%87%E6%BB%A4%203600P%20%E4%BB%A5%E4%B8%8B%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

document.querySelectorAll('.lista2').forEach(tr => {
const a = tr.querySelector('a[title]').innerText.match(/(\d+)p/);
if (Number(a[1]) <= 3600) tr.style.display = 'none';
})