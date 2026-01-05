// ==UserScript==
// @name       Wordpress Admin Pannel changes
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      http://josephsalmi.com/*
// @match      http://josephsalmi.com/wp-admin/*
// @copyright  2015+, You
// @downloadURL https://update.greasyfork.org/scripts/10260/Wordpress%20Admin%20Pannel%20changes.user.js
// @updateURL https://update.greasyfork.org/scripts/10260/Wordpress%20Admin%20Pannel%20changes.meta.js
// ==/UserScript==


// Function to add style
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


addGlobalStyle(' .additional_panel {  background-color: #404240;} ');
addGlobalStyle(' #adminmenu .wp-submenu, #adminmenu .wp-has-current-submenu .wp-submenu {background-color: #23282D;}');

addGlobalStyle(' .wp-has-current-submenu ul>li>a, .folded #adminmenu li.menu-top .wp-submenu>li>a { background-color: #23282D !important;}');

addGlobalStyle(' .wp-filter .search-form input[type=search] {  background-color: #ccc;} ');

addGlobalStyle(' #adminmenu .wp-submenu, #adminmenu .wp-has-current-submenu .wp-submenu, #adminmenu .wp-has-current-submenu.opensub .wp-submenu, \
               .folded #adminmenu .wp-has-current-submenu .wp-submenu, #adminmenu a.wp-has-current-submenu:focus + .wp-submenu { background: #23282D;} ');