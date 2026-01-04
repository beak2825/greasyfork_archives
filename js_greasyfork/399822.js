// ==UserScript==
// @name              Teamie Theme - Rainbow
// @description       Change the boring Teamie interface design!
// @match             *://*.theteamie.com/*
// @copyright         Chuxin Liang
// @version           1.0.7
// @license           http://www.gnu.org/licenses/gpl-3.0.html
// @namespace         https://blog.becomingcelia.com
// @downloadURL https://update.greasyfork.org/scripts/399822/Teamie%20Theme%20-%20Rainbow.user.js
// @updateURL https://update.greasyfork.org/scripts/399822/Teamie%20Theme%20-%20Rainbow.meta.js
// ==/UserScript==

if (window.location.href.indexOf("theteamie") > -1) {
    var style = document.createElement('style');
	style.innerText = '/* Normal Navigation */ header .navbar, header .navbar.navbar-default { background: -webkit-linear-gradient(45deg,#8e24aa,#ff6e40)!important; box-shadow: 0 6px 20px 0 rgba(255,110,64,.5)!important; } /* Mouseover navigation */ header .navbar .navbar-nav > li > a:hover, header .navbar .navbar-nav > li > a.active, header .navbar .navbar-nav > .active > a, header .navbar .navbar-nav > .active > a:hover, header .navbar .search-help:hover { color: #ffffff; background-color: rgba(0,0,0,0.1); transition: .3s ease-out; transition-property: all; transition-duration: 0.3s; transition-timing-function: ease-out; transition-delay: 0s; } /* Pinned Label */ .label.label-info, .node-lesson .subtitle .field-item a, .node-lesson-page .subtitle .field-item a { background-color: #f77076; } /* Text on sidebar */ .text-primary { color: #e85f59; } /* Radius (testing) */ .nav-drawer .list-group .list-group-item:first-child, .nav-drawer .list-group .list-group-item:last-child { border-radius: 0 25px 25px 0; margin-right: 1.15rem; margin-top: 1.15rem; } /* Next to read buttons */ .bg-primary { background-color: #9c27b0; border-top-right-radius: 2rem; border-bottom-right-radius: 2rem; box-shadow: 0 0 8px 0 #9c27b0; } /* Profile sidebar */ a.list-group-item.user-profile.bg-primary{ background: linear-gradient(45deg,#8e24aa,#ff6e40) ! important; box-shadow: 3px 3px 20px 0 rgba(255,110,64,.5) ! important; z-index: 99 ! important; } /* Floating Circular Buttons */ .list-group-item.active, .list-group-item.active:focus, .list-group-item.active:hover { z-index: 2; color: #fff; background: linear-gradient(45deg,#303f9f,#7b1fa2)!important; border-color: rgba(256, 256, 256, 0); box-shadow: 0 6px 20px 0 rgba(75,0,130,.5)!important; } /* Post highlight */ .bg-subtle-highlight { background-color: #fbe4e4; } /* Buttons */ .btn.btn-share, .btn-group.open .btn-share.dropdown-toggle, .btn.btn-primary, .btn-block.btn-primary { background: linear-gradient(45deg,#ff5252,#f48fb1)!important; border-color: rgba(256, 256, 256, 0); box-shadow: 0 6px 20px 0 rgba(255,110,64,.5)!important; color: #ffffff; background-image: none; filter: none; } .btn-primary.active, .btn-primary:active, .btn-primary:hover, .open>.btn-primary.dropdown-toggle { color: #fff; background: linear-gradient(45deg,#ff5252,#f48fb1)!important; border-color: rgba(256, 256, 256, 0); }';
	var head=document.getElementsByTagName('head')[0]; head.appendChild(style); 
	head.appendChild(style);
 }