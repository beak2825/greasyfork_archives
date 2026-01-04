// ==UserScript==
// @name        Gelbooru - Display all site content
// @namespace   Violentmonkey Scripts
// @match       https://gelbooru.com/*
// @grant       none
// @version     1.2
// @author      shlsdv
// @license     MIT
// @description Enables "Display All Site Content" by default. Try reloading the page if it doesn't show immediately.
// @icon        https://gelbooru.com/favicon.ico
// @homepageURL https://greasyfork.org/en/scripts/470376-gelbooru-display-all-site-content
// @downloadURL https://update.greasyfork.org/scripts/470376/Gelbooru%20-%20Display%20all%20site%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/470376/Gelbooru%20-%20Display%20all%20site%20content.meta.js
// ==/UserScript==


function getCookie(name) {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

function setCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + value + expires + '; path=/';
}

if (!getCookie('fringeBenefits')) {
  setCookie('fringeBenefits', 'yup');
}