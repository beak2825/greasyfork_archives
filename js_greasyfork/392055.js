// ==UserScript==
// @name         fn/webnovel.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include        https://www.webnovel.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392055/fnwebnovelcom.user.js
// @updateURL https://update.greasyfork.org/scripts/392055/fnwebnovelcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //document.body.innerHTML = document.body.innerHTML + '<div class="rightlick" style="width:100px; height: 500px; position: fixed; right:0px; top:0px;" contextmenu="window.scrollTo(0,document.body.scrollHeight);return false;"></div';
    window.scrollTo(0,document.body.scrollHeight);
    //$('.j_bottom_comment_area').remove();
    var i;
    try {
        var li = document.querySelectorAll('li');
        for (i=0; i<li.length; i++) {
            li[i].style.borderBottom='1px solid';
        }
    } catch {}
    try {
        var sub = document.querySelectorAll('sup');
        for (i=0; i<sub.length; i++) {
            sub[i].style.background='#f00';
            sub[i].style.fontSize='18px';
        }
    } catch {}

    try {
        document.querySelector('annotations').style.background='#eab9b9';
        document.querySelector('annotations').style.display='block';
    } catch {}
   	try {
		let cha_header = document.querySelector('.cha-header');
		cha_header.remove();
		document.body.style.paddingTop = 0;
	} catch {}

	try {
		let cha_fly = document.querySelector('.cha-fly');
		cha_fly.remove();
		document.body.style.paddingRight = 0;
	} catch {}

	try {
		let j_bottom_comment_area = document.querySelector('.j_bottom_comment_area');
		j_bottom_comment_area.remove();
	} catch {}

	try {
		let j_bottom = document.querySelector('.j_bottom');
		j_bottom.remove();
	} catch {}

	try {
		let cha_page_ft = document.querySelector('.cha-page-ft');
		cha_page_ft.remove();
	} catch {}

	try {
		let user_links_wrap = document.querySelector('.user-links-wrap');
		user_links_wrap.remove();
	} catch {}

	try {
		let g_ad_ph = document.querySelector('.user-links-wrap');
		g_ad_ph.remove();
	} catch {}

	try {
		let j_chapterLoading = document.querySelector('.j_chapterLoading');
		j_chapterLoading.remove();
	} catch {}

        try {
		let m_thou = document.querySelector('.m-thou');
		m_thou.remove();
	} catch {}

	try {
		document.querySelector('.cha-page-in').style.padding='10px';
        document.querySelector('.cha-words').style.fontFamily='Arial';
        document.querySelector('.cha-words').style.lineHeight='1.5';
        document.querySelector('.cha-words').style.fontSize='14px';
	} catch {}
})();

