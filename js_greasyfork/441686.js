// ==UserScript==
// @name         New5 Userscript
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.1
// @description  try to do the world!
// @author       You
// @match        https://huodong.xueanquan.com/2022safeedu/guanwei.html?tabNum=2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xueanquan.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441686/New5%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/441686/New5%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
  var elment1=document.querySelector("body > div.container-fluid > div:nth-child(1)");
                                                                                                                                        var para = document.createElement("a");
                                                                                                                                        para.href="javascript:window.opener=null;window.open('','_self');window.close();";
                                                                                                                                        para.innerText="s关闭s";
                                                                                                                                        para.setAttribute("Id","closeself");
                                                                                                                                        elment1.parentElement.insertBefore(para,elment1);
                                                                                                                                        document.getElementById("closeself").click();
    // Your code here...
})();