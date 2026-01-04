// ==UserScript==
// @name         Phixiv Share
// @namespace    https://github.com/gjing/phixiv-share
// @version      1.1.1
// @description  Add Phixiv Share button to pixiv
// @author       gjing
// @match        https://www.pixiv.net/*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490801/Phixiv%20Share.user.js
// @updateURL https://update.greasyfork.org/scripts/490801/Phixiv%20Share.meta.js
// ==/UserScript==
(function() {
  'use strict';

  let url = location.href;
  document.body.addEventListener('click', ()=>{
    requestAnimationFrame(()=>{
      if (url!==location.href) {
        url = location.href;
        const element = document.getElementsByClassName("sc-181ts2x-0")[0].remove();
      	wait_icon();
      }
    });
  }, true);
	
  function wait_icon() {
    const intv = setInterval(function() {
      const nav_bar = document.getElementsByClassName("sc-181ts2x-0");
      if (nav_bar.length == 0) {
        return false;
      }
      clearInterval(intv);
      load_icon();
    }, 100);
  }

  function load_icon() {
    const link = window.location.href.replace("pixiv", "phixiv");
    const element = document.getElementsByClassName("sc-181ts2x-0")[0];
    const div_string = '<div class="sc-181ts2x-7"><button type="button" class="y35SzDmKENoCKvur"><span class="Gi9zOhEDaI9fmUNA">PHIX</span></button></div>';
    const div = document.createElement('div');
    div.innerHTML = div_string;
    div.style.paddingRight = '10px';
    div.onclick = function() {
      navigator.clipboard.writeText(link);
    }
    element.appendChild(div);
  }
  
  wait_icon();
})();
