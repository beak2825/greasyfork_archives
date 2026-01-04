// ==UserScript==
// @name         github跳转vsc界面
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  try to take over the world!
// @author       You
// @include      *://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422047/github%E8%B7%B3%E8%BD%ACvsc%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/422047/github%E8%B7%B3%E8%BD%ACvsc%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var divs = window.document.createElement('div')
    divs.style.width = '50px'
    divs.style.height = '50px'
    divs.style.position = 'fixed'
    divs.style.top = '50%'
    divs.left = 0
    var imgs = new Image()
    imgs.src = 'data:image/png;base64,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'
    imgs.style.width = '50px'
    imgs.style.height = '50px'
    divs.appendChild(imgs)
    divs.addEventListener("click", function( event ) {
       window.open(window.location.href.replace('github','github1s'))
      }, false);
    var body = window.document.body
    body.appendChild(divs)
    // Your code here...
})();