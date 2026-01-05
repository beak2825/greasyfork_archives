// ==UserScript==
// @name           Memrise - Demo
// @description    Demo of adding a button to nav bar
// @author         James Skinner <spiralx@gmail.com> (http://github.com/spiralx)
// @namespace      http://spiralx.org/
// @version        0.0.1
// @match          *://www.memrise.com/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/11296/Memrise%20-%20Demo.user.js
// @updateURL https://update.greasyfork.org/scripts/11296/Memrise%20-%20Demo.meta.js
// ==/UserScript==

jQuery('#header ul.header-nav')
  .prepend('<li class="header-nav-item plain"><a href="/forums/" class="nav-item-btn"><span class="nav-item-btn-text">Forums</span></a></li>');
