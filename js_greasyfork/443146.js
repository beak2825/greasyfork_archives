// ==UserScript==
// @name        tsinghua - f-droid.org
// @namespace   Violentmonkey Scripts
// @match       https://f-droid.org/zh_Hans/packages/
// @grant       none
// @version     1.0
// @author      liangsai
// @description 2022/4/11 08:25:00
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443146/tsinghua%20-%20f-droidorg.user.js
// @updateURL https://update.greasyfork.org/scripts/443146/tsinghua%20-%20f-droidorg.meta.js
// ==/UserScript==
(function () {
  var h= document.getElementsByTagName('a');
    for(var i=0;i<h.length;i++){
       h[i].href=h[i].href.replace('f-droid.org/repo', 'mirrors.tuna.tsinghua.edu.cn/fdroid/repo');
      
    }
}());