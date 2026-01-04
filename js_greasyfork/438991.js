// ==UserScript==
// @name        Download Extension from Chrome Web Store
// @namespace   laniusone
// @match       https://chrome.google.com/webstore/detail/*/*
// @grant       none
// @icon        https://www.chromium.org/_/rsrc/1354323194313/favicon.ico
// @version     1.0
// @author      laniusone
// @license     BSD-3-Clause
// @description Script meant for Ungoogled Chromium, but may be used with any browser to directly download Chrome Extensions from Chrome Web Store.
// @downloadURL https://update.greasyfork.org/scripts/438991/Download%20Extension%20from%20Chrome%20Web%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/438991/Download%20Extension%20from%20Chrome%20Web%20Store.meta.js
// ==/UserScript==
let bookmarklet = function () {location.href='https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&prodversion='+(navigator.appVersion.match(/Chrome\/(\S+)/)[1])+'&x=id%'+'3D'+(document.querySelector('a[href^="https://chrome.google.com/webstore/report/"]').pathname.match(/[^\/]+\/*$/)[0])+'%'+'26installsource%'+'3Dondemand%'+'26uc';};
button = document.createElement('button');
button.type = 'button;'
button.style.cssText = 'position: fixed; z-index: 9999; bottom: 2%; right: 2%; padding: 10px; color: white; background-color: blue; text-decoration: none;';
button.onclick = bookmarklet;
button.innerText = '+';
button.id = 'custom-extension-download';
document.body.appendChild(button);