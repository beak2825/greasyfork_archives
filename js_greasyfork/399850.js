// ==UserScript==
// @name              Teamie Theme - Green
// @description       Change the boring Teamie interface design!
// @match             *://*.theteamie.com/*
// @copyright         Chuxin Liang
// @version           1.0.3
// @license           http://www.gnu.org/licenses/gpl-3.0.html
// @namespace         https://blog.becomingcelia.com
// @downloadURL https://update.greasyfork.org/scripts/399850/Teamie%20Theme%20-%20Green.user.js
// @updateURL https://update.greasyfork.org/scripts/399850/Teamie%20Theme%20-%20Green.meta.js
// ==/UserScript==

if (window.location.href.indexOf("theteamie") > -1) {
    var style=document.createElement('style');
    style.innerText='/* Normal Navigation */ header .navbar, header .navbar.navbar-default { background-color: #85cac3; } /* Mouseover navigation */ header .navbar .navbar-nav > li > a:hover, header .navbar .navbar-nav > li > a.active, header .navbar .navbar-nav > .active > a, header .navbar .navbar-nav > .active > a:hover, header .navbar .search-help:hover { color: #ffffff; background-color: #79b5af; } /* Next to read buttons */ .bg-primary { background-color: #79b5af; color: #ffffff; } /* Floating Circular Buttons */ .list-group-item.active, .list-group-item.active:focus, .list-group-item.active:hover { z-index: 2; color: #fff; background-color: #79b5af ! important; border-color: #79b5af ! important; } /* Buttons */ .btn.btn-share, .btn-group.open .btn-share.dropdown-toggle, .btn.btn-primary, .btn-block.btn-primary { background-color: #79b5af ! important; color: #ffffff; background-image: none; filter: none; border-color: #79b5af ! important; } .btn-primary.active, .btn-primary:active, .btn-primary:hover, .open>.btn-primary.dropdown-toggle { color: #fff; background-color: #74ada8 ! important; border-color: #6a9c97 ! important; }';
    var head=document.getElementsByTagName('head')[0];
    head.appendChild(style);
 }