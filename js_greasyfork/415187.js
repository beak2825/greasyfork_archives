// ==UserScript==
// @name         Amazon Wish List Name in Page Title
// @namespace    https://github.com/exterrestris
// @version      0.3.0
// @description  Show the name of your Amazon Wish List in the page title to identify it
// @author       You
// @match        https://www.amazon.co.uk/hz/wishlist/*
// @match        https://www.amazon.com/hz/wishlist/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415187/Amazon%20Wish%20List%20Name%20in%20Page%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/415187/Amazon%20Wish%20List%20Name%20in%20Page%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    document.title += ': ' + document.querySelector('#profile-list-name').innerText + ' Wish List';
  })();