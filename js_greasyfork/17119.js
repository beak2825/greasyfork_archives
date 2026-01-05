// ==UserScript==
// @name         Bring Trending Back
// @namespace    justineo.github.io
// @version      0.1
// @description  Bring back trending link to GitHub homepage
// @author       Justineo
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17119/Bring%20Trending%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/17119/Bring%20Trending%20Back.meta.js
// ==/UserScript==

'use strict';

var nav = document.querySelector('.header-nav[role="navigation"]');
nav.insertAdjacentHTML('beforeend', '<li class="header-nav-item"><a class="header-nav-link" href="/trending">Trending</a></li>');
