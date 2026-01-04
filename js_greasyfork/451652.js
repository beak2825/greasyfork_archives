// ==UserScript==
// @name         CSDN复制
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  CSDN免登陆复制并去除版权声明
// @author       You
// @match        https://blog.csdn.net/*/article/details/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451652/CSDN%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/451652/CSDN%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var pre = document.querySelectorAll("pre")
    var code = document.querySelectorAll("code")
    for(let i=0;i<pre.length;i++){
        pre[i].setAttribute("style","user-select:auto")
    }
    for(let i=0;i<code.length;i++){
        code[i].setAttribute("style","user-select:auto")
    }
    const content_views = document.querySelector("#content_views")
    let dialog = null
    content_views.oncopy = function(e){
      const str = window.getSelection().toString()
      e.clipboardData.setData('text',str || "")
      if(!dialog){
        getEle()
      }
    }
    const getEle = function(){
      dialog = document.querySelector(".passport-login-container")
      if(dialog){
        dialog.setAttribute("style","display:none;")
      } else {
        setTimeout(()=>{
            getEle()
        },300)
      }
    }
})();