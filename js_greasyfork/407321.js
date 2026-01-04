// ==UserScript==
// @name        Fix header of mo.fish
// @namespace   daimon2k
// @match       *://mo.fish/*
// @grant       none
// @version     0.6
// @author      daimon2k
// @description 7/18/2020, 10:13:17 PM
// @downloadURL https://update.greasyfork.org/scripts/407321/Fix%20header%20of%20mofish.user.js
// @updateURL https://update.greasyfork.org/scripts/407321/Fix%20header%20of%20mofish.meta.js
// ==/UserScript==

(function() {
  var css = '.list-class {position: relative !important}';
  css += '.hot-box {position: relative !important;}'; 

  loadStyle(css)
  function loadStyle(css) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.appendChild(document.createTextNode(css));
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
  }
  
  const timer = window.setInterval(()=>{for (let item of document.querySelectorAll('#moveBoxItem')) {
    if (/淘宝|京东|聚划算/.test(item.innerText)) {
      item.remove()
    }
  }}, 500)
})();
