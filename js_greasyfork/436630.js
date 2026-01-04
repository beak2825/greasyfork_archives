// ==UserScript==
// @name         All Porn
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  娱乐向全局P**nHub
// @author       ChenYFan
// @match        *://*/*
// @icon         https://api.cyfan.top/icon?domain=pornhub.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436630/All%20Porn.user.js
// @updateURL https://update.greasyfork.org/scripts/436630/All%20Porn.meta.js
// ==/UserScript==

(function() {
document.head = document.head || document.getElementsByTagName('head')[0];

function changeFavicon(src) {
 var link = document.createElement('link'),
     oldLink = document.getElementById('dynamic-favicon');
 link.id = 'dynamic-favicon';
 link.rel = 'shortcut icon';
 link.href = src;
 if (oldLink) {
  document.head.removeChild(oldLink);
 }
 document.head.appendChild(link);
}
    changeFavicon('https://api.cyfan.top/icon?domain=pornhub.com');

    document.title = 'Porn Hub - Free Porn and Porn Cams - Free Porn Chat and Webcam Porn Videos - Free Porn, Porn Cams, Free Porn Chat, Webcam Porn'
    const o_t = document.title
    let flag = false
    setInterval(()=>{if(flag){document.title = "【新消息】"+o_t}else{document.title = '【_______】'+o_t};flag=!flag},500)

})();