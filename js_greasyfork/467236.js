// ==UserScript==
// @name         Github hide banner
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  You can toggle the github banner.
// @description:zh-CN   去除github代码页顶部的标题栏
// @author       Movelocity
// @license      MIT License
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467236/Github%20hide%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/467236/Github%20hide%20banner.meta.js
// ==/UserScript==

(function() {
  'use strict';
  function modify_page(){
    // get target elements
    let banner = document.querySelector('.Box-sc-g0xbh4-0.ePiodO');
    let code_container = document.querySelector('.Box-sc-g0xbh4-0.jCjMRf');

    // Create a new button element
    let toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle';

    // Add a click event listener to the button
    toggleButton.addEventListener('click', function() {
    if (banner.style.display === 'none') {
      banner.style.display = '';
      code_container.style.marginTop = '46px';
      console.log("show");
    } else {
      banner.style.display = 'none';
      code_container.style.marginTop = '0';
      console.log("hide");
    }
    });
    // Insert toggle button
    document.querySelector('.Header-item.d-md-none').after(toggleButton);
  }
	window.setTimeout(modify_page, 3000);
})(); // execute the function we just defined (func)()