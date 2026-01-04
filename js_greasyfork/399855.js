// ==UserScript==
// @name              Teamie Theme - Pink
// @description       Change the boring Teamie interface design!
// @match             *://*.theteamie.com/*
// @copyright         Chuxin Liang
// @version           1.0.1
// @license           http://www.gnu.org/licenses/gpl-3.0.html
// @namespace         https://blog.becomingcelia.com
// @downloadURL https://update.greasyfork.org/scripts/399855/Teamie%20Theme%20-%20Pink.user.js
// @updateURL https://update.greasyfork.org/scripts/399855/Teamie%20Theme%20-%20Pink.meta.js
// ==/UserScript==

if (window.location.href.indexOf("theteamie") > -1) {
    var style=document.createElement('style');
    style.innerText='/* Normal Navigation */ header .navbar, header .navbar.navbar-default { background-color: #dda2de; } /* Mouseover navigation */ header .navbar .navbar-nav > li > a:hover, header .navbar .navbar-nav > li > a.active, header .navbar .navbar-nav > .active > a, header .navbar .navbar-nav > .active > a:hover, header .navbar .search-help:hover { color: #ffffff; background-color: #da8cdb; } /* Next to read buttons */ .bg-primary { background-color: #da8cdb; color: #ffffff; } /* Floating Circular Buttons */ .list-group-item.active, .list-group-item.active:focus, .list-group-item.active:hover { z-index: 2; color: #fff; background-color: #dda2de ! important; border-color: #dda2de ! important; } /* Buttons */ .btn.btn-share, .btn-group.open .btn-share.dropdown-toggle, .btn.btn-primary, .btn-block.btn-primary { background-color: #da8cdb ! important; color: #ffffff; background-image: none; filter: none; border-color: #da8cdb ! important; } .btn-primary.active, .btn-primary:active, .btn-primary:hover, .open>.btn-primary.dropdown-toggle { color: #fff; background-color: #da8cdb ! important; border-color: #da8cdb ! important; }';
    var head=document.getElementsByTagName('head')[0];
    head.appendChild(style);
 }