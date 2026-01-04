// ==UserScript==
// @name         autoHideMenu
// @namespace    http://shikimori.one
// @version      1.1
// @description  Hide menu on scroll.
// @author       grin3671
// @match        https://shikimori.one/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32169/autoHideMenu.user.js
// @updateURL https://update.greasyfork.org/scripts/32169/autoHideMenu.meta.js
// ==/UserScript==

'use strict';

function insertStyle(menuHeight) {
  var style, css;

  css = '.l-top_menu-v2 { transition: transform .24s ease; }';
  css += ' .l-top_menu-v2.is-hidden { transform: translateY(-' + menuHeight + 'px); }';
  css += ' .l-top_menu-v2.is-hover, .l-top_menu-v2:hover { transform: translateY(0); }';

  style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));

  document.head.appendChild(style);
}

function autoHideMenu () {
  var menu = document.querySelector('.l-top_menu-v2'),
      initial = 0,
      menuHeight = menu.offsetHeight;

  insertStyle(menuHeight);

  window.addEventListener('scroll', function () {
    var value = this.scrollY;
    if ( value > initial && value > menuHeight ) {
      menu.classList.add('is-hidden');
    } else {
      menu.classList.remove('is-hidden');
    }
    if (value + this.innerHeight == document.body.scrollHeight) {
      menu.classList.remove('is-hidden');
    }
		initial = value;
  });

  window.addEventListener('mousemove', function (e) {
    if (menuHeight > e.clientY) {
      menu.classList.add('is-hover');
    } else {
      menu.classList.remove('is-hover');
    }
  });
}

function ready (f) {
  document.addEventListener('page:load', f);
  document.addEventListener('turbolinks:load', f);

  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    f();
  } else {
    document.addEventListener('DOMContentLoaded', f);
  }
}

ready(autoHideMenu);