// ==UserScript==
// @name        Trakt Local Storage Refresh
// @description To clickly clear the local storage and refresh the page. Useful when the page data is wrong or outdated.
// @namespace   https://ksir.pw
// @match       https://trakt.tv/*
// @grant       none
// @version     1.0.3
// @icon        data:image/gif;base64,R0lGODlhEAAQAMIDAAAAAIAAAP8AAP///////////////////yH5BAEKAAQALAAAAAAQABAAAAMuSLrc/jA+QBUFM2iqA2ZAMAiCNpafFZAs64Fr66aqjGbtC4WkHoU+SUVCLBohCQA7
// @homepageURL https://greasyfork.org/en/scripts/459167-trakt-local-storage-refresh
// @author      Kain (ksir.pw)
// @description 11/15/2022, 6:29:52 PM
// @downloadURL https://update.greasyfork.org/scripts/459167/Trakt%20Local%20Storage%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/459167/Trakt%20Local%20Storage%20Refresh.meta.js
// ==/UserScript==

// Adds a button to the bottom left of the page, click it to clear the local storage and reload the page.

var btn = document.createElement('button');
btn.id = 'ls-r';
btn.setAttribute('title', 'Reset LocalStorage');
btn.innerHTML = '↻';
btn.onclick = () => { localStorage.clear(); window.location.reload() };
document.body.innerHTML += "<style>#ls-r{position:fixed;bottom:10px;left:10px;border:solid 1px #ddd;font-size:14px;padding:3px 5px;background:#fbfbfb;color:#666;border-radius:3px;}#ls-r:hover {background:#333;color:#fff;}</style>";
document.body.appendChild(btn);
