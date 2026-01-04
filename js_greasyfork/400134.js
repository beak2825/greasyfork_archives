// ==UserScript==
// @name         卖家之家
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://mjzj.com/ce-ping-bao-guang-tai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400134/%E5%8D%96%E5%AE%B6%E4%B9%8B%E5%AE%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/400134/%E5%8D%96%E5%AE%B6%E4%B9%8B%E5%AE%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let d = document.querySelector('.reviewer-exposure-content')
    let s = document.querySelectorAll('.reviewer-exposure-content span')
    let di = document.createElement('div')
    di.style.position = "fixed"
    di.className = "diclass"
    di.style.top = "200px"
    di.style.left = "500px"
    di.style.width = "350px"
    di.style.textAlign = "center"
    di.style.color = "white"
    di.style.zIndex = "100"
    di.style.background = "black"
    di.style.opacity = "0.1"
    let body = document.getElementsByTagName('body')[0]
    body.appendChild(di)
    for (let i of s) {
        d.removeChild(i)
    }
    di.innerText = d.innerText
    di.onmouseenter = (e)=>{
      e.target.style.opacity = "1"
    }
    di.onmouseout = (e)=>{
      e.target.style.opacity = "0.1"
    }
})();