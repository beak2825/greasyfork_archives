// ==UserScript==
// @name         DL Button
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  add a download button
// @author       zhu
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426072/DL%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/426072/DL%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var button = document.createElement("input"); //创建一个input对象（提示框按钮）
    button.setAttribute("type", "button");
    button.setAttribute("value", "下载");
    button.style.width = "60px";
    button.style.align = "center";
    button.style.marginLeft = "250px";
    button.style.marginBottom = "10px";
    button.style.background = "#b46300";
  //  button.style.border = "1px solid " + "#b46300";//52
    button.style.color = "white";
    var x = document.getElementById("lg");
    x.appendChild(button);


    // Your code here...
})();