// ==UserScript==
// @name        gHacks Dark Mode + Decline cookies
// @namespace   https://greasyfork.org
// @description Dark Mode for gHacks.net, also automatically declines all cookies when dialog pops up
// @author      Guillaume
// @version     1.1.1
// @icon        https://ghacks.net/favicon.ico
// @match       *://*.ghacks.net/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/375128/gHacks%20Dark%20Mode%20%2B%20Decline%20cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/375128/gHacks%20Dark%20Mode%20%2B%20Decline%20cookies.meta.js
// ==/UserScript==

function declineCookies() {
  var dialog = document.getElementsByClassName('sncmp-intro_rejectAll');
  if (dialog.length) {
    clearInterval(i);
    dialog[0].click();
    setTimeout(function() {
      document.querySelectorAll('.sncmp-switch_isSelected').forEach(e => e.click());
      setTimeout(function() { document.getElementsByClassName('sncmp-details_save')[0].click() }, 100);
    }, 100);
  } else {
    c++;
    if (c > 10) clearInterval(i);
  }
}

var c = 0, i;
window.onload = function() { i = setInterval(declineCookies, 250) };

GM_addStyle(`
body {
  background: #3B3B3B;
  color: #EEE !important;
}
h2>a, .heading, .heading--huge, .heading--large, .user-content h2, .widget_text .textwidget h2, .heading--big, .heading--medium, .user-content h3, .widget_text .textwidget h3, .heading--normal, .heading--small, .user-content h5, .widget_text .textwidget h5, .heading--tiny {
  color: #F3B434 !important;
}
a { color: #FFF !important; }
.comment-item__header, input:not([type="submit"]):not([type="checkbox"]), textarea, select, #snippet-box {
  background: #272727 !important;
  color: #EEE !important;
}
.button--orange, input[type="submit"], .nav-links span.current { background-color: transparent !important }
.button--orange:hover, input[type="submit"]:hover, .nav-links span.current:hover, .button--orange:focus, input[type="submit"]:focus, .nav-links span.current:focus { background-color: #F3B434 !important }
.user-content a:not(:hover), .widget_text .textwidget a:not(:hover) { border-bottom: 2px solid #727272 !important }
`);