// ==UserScript==
// @name         Christmas Admin
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Christmas update for admin
// @author       Nikita Nikitin
// @match        *://tngadmin.triplenext.net/*
// @match        *://yruleradmin.triplenext.net/*
// @match        *://tngadmin-dev.triplenext.net/*
// @match        *://tngtest.westus.cloudapp.azure.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482743/Christmas%20Admin.user.js
// @updateURL https://update.greasyfork.org/scripts/482743/Christmas%20Admin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Добавляем HTML
    var newHtml = `
	<i class="b-head-decor">
		<i class="b-head-decor__inner b-head-decor__inner_n1">
		  <div class="b-ball b-ball_n1 b-ball_bounce" data-note="0"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n2 b-ball_bounce" data-note="1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n3 b-ball_bounce" data-note="2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n4 b-ball_bounce" data-note="3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n5 b-ball_bounce" data-note="4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n6 b-ball_bounce" data-note="5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n7 b-ball_bounce" data-note="6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n8 b-ball_bounce" data-note="7"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n9 b-ball_bounce" data-note="8"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		</i>
		<i class="b-head-decor__inner b-head-decor__inner_n2">
		  <div class="b-ball b-ball_n1 b-ball_bounce" data-note="9"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n2 b-ball_bounce" data-note="10"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n3 b-ball_bounce" data-note="11"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n4 b-ball_bounce" data-note="12"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n5 b-ball_bounce" data-note="13"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n6 b-ball_bounce" data-note="14"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n7 b-ball_bounce" data-note="15"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n8 b-ball_bounce" data-note="16"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n9 b-ball_bounce" data-note="17"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		</i>
		<i class="b-head-decor__inner b-head-decor__inner_n3">
		  <div class="b-ball b-ball_n1 b-ball_bounce" data-note="18"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n2 b-ball_bounce" data-note="19"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n3 b-ball_bounce" data-note="20"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n4 b-ball_bounce" data-note="21"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n5 b-ball_bounce" data-note="22"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n6 b-ball_bounce" data-note="23"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n7 b-ball_bounce" data-note="24"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n8 b-ball_bounce" data-note="25"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n9 b-ball_bounce" data-note="26"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		</i>
		<i class="b-head-decor__inner b-head-decor__inner_n4">
		  <div class="b-ball b-ball_n1 b-ball_bounce" data-note="27"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n2 b-ball_bounce" data-note="28"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n3 b-ball_bounce" data-note="29"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n4 b-ball_bounce" data-note="30"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n5 b-ball_bounce" data-note="31"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n6 b-ball_bounce" data-note="32"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n7 b-ball_bounce" data-note="33"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n8 b-ball_bounce" data-note="34"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n9 b-ball_bounce" data-note="35"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		</i>
		<i class="b-head-decor__inner b-head-decor__inner_n5">
		  <div class="b-ball b-ball_n1 b-ball_bounce" data-note="0"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n2 b-ball_bounce" data-note="1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n3 b-ball_bounce" data-note="2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n4 b-ball_bounce" data-note="3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n5 b-ball_bounce" data-note="4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n6 b-ball_bounce" data-note="5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n7 b-ball_bounce" data-note="6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n8 b-ball_bounce" data-note="7"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n9 b-ball_bounce" data-note="8"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		</i>
		<i class="b-head-decor__inner b-head-decor__inner_n6">
		  <div class="b-ball b-ball_n1 b-ball_bounce" data-note="9"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n2 b-ball_bounce" data-note="10"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n3 b-ball_bounce" data-note="11"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n4 b-ball_bounce" data-note="12"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n5 b-ball_bounce" data-note="13"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n6 b-ball_bounce" data-note="14"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n7 b-ball_bounce" data-note="15"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n8 b-ball_bounce" data-note="16"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n9 b-ball_bounce" data-note="17"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		</i>
		<i class="b-head-decor__inner b-head-decor__inner_n7">
		  <div class="b-ball b-ball_n1 b-ball_bounce" data-note="18"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n2 b-ball_bounce" data-note="19"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n3 b-ball_bounce" data-note="20"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n4 b-ball_bounce" data-note="21"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n5 b-ball_bounce" data-note="22"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n6 b-ball_bounce" data-note="23"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n7 b-ball_bounce" data-note="24"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n8 b-ball_bounce" data-note="25"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n9 b-ball_bounce" data-note="26"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		</i>
		<i class="b-head-decor__inner b-head-decor__inner_n8">
		  <div class="b-ball b-ball_n1 b-ball_bounce" data-note="18"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n2 b-ball_bounce" data-note="19"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n3 b-ball_bounce" data-note="20"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n4 b-ball_bounce" data-note="21"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n5 b-ball_bounce" data-note="22"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n6 b-ball_bounce" data-note="23"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n7 b-ball_bounce" data-note="24"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n8 b-ball_bounce" data-note="25"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n9 b-ball_bounce" data-note="26"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		</i>
		<i class="b-head-decor__inner b-head-decor__inner_n9">
		  <div class="b-ball b-ball_n1 b-ball_bounce" data-note="18"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n2 b-ball_bounce" data-note="19"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n3 b-ball_bounce" data-note="20"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n4 b-ball_bounce" data-note="21"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n5 b-ball_bounce" data-note="22"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n6 b-ball_bounce" data-note="23"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n7 b-ball_bounce" data-note="24"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n8 b-ball_bounce" data-note="25"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n9 b-ball_bounce" data-note="26"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		</i>
		<i class="b-head-decor__inner b-head-decor__inner_n10">
		  <div class="b-ball b-ball_n1 b-ball_bounce" data-note="18"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n2 b-ball_bounce" data-note="19"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n3 b-ball_bounce" data-note="20"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n4 b-ball_bounce" data-note="21"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n5 b-ball_bounce" data-note="22"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n6 b-ball_bounce" data-note="23"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n7 b-ball_bounce" data-note="24"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n8 b-ball_bounce" data-note="25"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n9 b-ball_bounce" data-note="26"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		</i>
		<i class="b-head-decor__inner b-head-decor__inner_n11">
		  <div class="b-ball b-ball_n1 b-ball_bounce" data-note="18"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n2 b-ball_bounce" data-note="19"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n3 b-ball_bounce" data-note="20"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n4 b-ball_bounce" data-note="21"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n5 b-ball_bounce" data-note="22"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n6 b-ball_bounce" data-note="23"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n7 b-ball_bounce" data-note="24"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n8 b-ball_bounce" data-note="25"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n9 b-ball_bounce" data-note="26"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		</i>
		<i class="b-head-decor__inner b-head-decor__inner_n12">
		  <div class="b-ball b-ball_n1 b-ball_bounce" data-note="18"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n2 b-ball_bounce" data-note="19"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n3 b-ball_bounce" data-note="20"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n4 b-ball_bounce" data-note="21"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n5 b-ball_bounce" data-note="22"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n6 b-ball_bounce" data-note="23"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n7 b-ball_bounce" data-note="24"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n8 b-ball_bounce" data-note="25"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_n9 b-ball_bounce" data-note="26"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		  <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
		</i>
	</i>
    `;
    // Находим элемент Navbar
    var navbarElement = document.querySelector('.navbar-inner.navbar-fixed-top');

    // Вставляем HTML перед Navbar, если элемент найден
    if (navbarElement) {
        navbarElement.insertAdjacentHTML('beforebegin', newHtml);
    }

    // Добавляем CSS
    var css = `
        /* Ваш CSS код */

.navbar .b-head-decor {
    pointer-events: none;
	position: fixed;
	top: -18px;
	left: -980px;
    z-index: 2000;
	display: block;
	height: 115px;
    scale: 0.7;
	width: 200%;
	overflow: none;
	background: url(https://raw.githubusercontent.com/bybelov/new-year-garland/master/balls/b-head-decor_newyear.png) repeat-x 0 0
}

.navbar .b-head-decor__inner {
	position: absolute;
	top: 0;
	left: 0;
	height: 100px;
	display: block;
	width: 373px
}

.navbar .b-head-decor::before {
	content: '';
	display: block;
	position: absolute;
	top: -100px;
	left: 0;
	z-index: 3;
	height: 100px;
	display: block;
	width: 100%;
	box-shadow: 0 15px 30px rgba(0, 0, 0, 0.75)
}

.navbar .b-head-decor .b-ball {
    pointer-events: auto;
}

.navbar .b-head-decor__inner_n2 {
	left: 373px
}

.navbar .b-head-decor__inner_n3 {
	left: 746px
}

.navbar .b-head-decor__inner_n4 {
	left: 1119px
}

.navbar .b-head-decor__inner_n5 {
	left: 1492px
}

.navbar .b-head-decor__inner_n6 {
	left: 1865px
}

.navbar .b-head-decor__inner_n7 {
	left: 2238px
}

.navbar .b-head-decor__inner_n8 {
    left: 2611px;
}

.navbar .b-head-decor__inner_n9 {
    left: 2984px;
}

.navbar .b-head-decor__inner_n10 {
    left: 3357px;
}

.navbar .b-head-decor__inner_n11 {
    left: 3730px;
}

.navbar .b-head-decor__inner_n12 {
    left: 4103px;
}

.b-ball {
	position: absolute
}

.b-ball_n1 {
	top: 0;
	left: 3px;
	width: 59px;
	height: 83px
}

.b-ball_n2 {
	top: -19px;
	left: 51px;
	width: 55px;
	height: 70px
}

.b-ball_n3 {
	top: 9px;
	left: 88px;
	width: 49px;
	height: 67px
}

.b-ball_n4 {
	top: 0;
	left: 133px;
	width: 57px;
	height: 102px
}

.b-ball_n5 {
	top: 0;
	left: 166px;
	width: 49px;
	height: 57px
}

.b-ball_n6 {
	top: 6px;
	left: 200px;
	width: 54px;
	height: 70px
}

.b-ball_n7 {
	top: 0;
	left: 240px;
	width: 56px;
	height: 67px
}

.b-ball_n8 {
	top: 0;
	left: 283px;
	width: 54px;
	height: 53px
}

.b-ball_n9 {
	top: 10px;
	left: 321px;
	width: 49px;
	height: 66px
}

.b-ball_n1 .b-ball__i {
	background: url(https://raw.githubusercontent.com/bybelov/new-year-garland/master/balls/b-ball_n1.png) no-repeat
}

.b-ball_n2 .b-ball__i {
	background: url(https://raw.githubusercontent.com/bybelov/new-year-garland/master/balls/b-ball_n2.png) no-repeat
}

.b-ball_n3 .b-ball__i {
	background: url(https://raw.githubusercontent.com/bybelov/new-year-garland/master/balls/b-ball_n3.png) no-repeat
}

.b-ball_n4 .b-ball__i {
	background: url(https://raw.githubusercontent.com/bybelov/new-year-garland/master/balls/b-ball_n4.png) no-repeat
}

.b-ball_n5 .b-ball__i {
	background: url(https://raw.githubusercontent.com/bybelov/new-year-garland/master/balls/b-ball_n5.png) no-repeat
}

.b-ball_n6 .b-ball__i {
	background: url(https://raw.githubusercontent.com/bybelov/new-year-garland/master/balls/b-ball_n6.png) no-repeat
}

.b-ball_n7 .b-ball__i {
	background: url(https://raw.githubusercontent.com/bybelov/new-year-garland/master/balls/b-ball_n7.png) no-repeat
}

.b-ball_n8 .b-ball__i {
	background: url(https://raw.githubusercontent.com/bybelov/new-year-garland/master/balls/b-ball_n8.png) no-repeat
}

.b-ball_n9 .b-ball__i {
	background: url(https://raw.githubusercontent.com/bybelov/new-year-garland/master/balls/b-ball_n9.png) no-repeat
}

.b-ball_i1 .b-ball__i {
	background: url(https://raw.githubusercontent.com/bybelov/new-year-garland/master/balls/b-ball_i1.png) no-repeat
}

.b-ball_i2 .b-ball__i {
	background: url(https://raw.githubusercontent.com/bybelov/new-year-garland/master/balls/b-ball_i2.png) no-repeat
}

.b-ball_i3 .b-ball__i {
	background: url(https://raw.githubusercontent.com/bybelov/new-year-garland/master/balls/b-ball_i3.png) no-repeat
}

.b-ball_i4 .b-ball__i {
	background: url(https://raw.githubusercontent.com/bybelov/new-year-garland/master/balls/b-ball_i4.png) no-repeat
}

.b-ball_i5 .b-ball__i {
	background: url(https://raw.githubusercontent.com/bybelov/new-year-garland/master/balls/b-ball_i5.png) no-repeat
}

.b-ball_i6 .b-ball__i {
	background: url(https://raw.githubusercontent.com/bybelov/new-year-garland/master/balls/b-ball_i6.png) no-repeat
}

.b-ball_i1 {
	top: 0;
	left: 0;
	width: 25px;
	height: 71px
}

.b-ball_i2 {
	top: 0;
	left: 25px;
	width: 61px;
	height: 27px
}

.b-ball_i3 {
	top: 0;
	left: 176px;
	width: 29px;
	height: 31px
}

.b-ball_i4 {
	top: 0;
	left: 205px;
	width: 50px;
	height: 51px
}

.b-ball_i5 {
	top: 0;
	left: 289px;
	width: 78px;
	height: 28px
}

.b-ball_i6 {
	top: 0;
	left: 367px;
	width: 6px;
	height: 69px
}

.b-ball__i {
	position: absolute;
	width: 100%;
	height: 100%;
	-webkit-transform-origin: 50% 0;
	-moz-transform-origin: 50% 0;
	-o-transform-origin: 50% 0;
	transform-origin: 50% 0;
	-webkit-transition: all .3s ease-in-out;
	-moz-transition: all .3s ease-in-out;
	-o-transition: all .3s ease-in-out;
	transition: all .3s ease-in-out;
	pointer-events: none
}

.b-ball_bounce .b-ball__right {
	position: absolute;
	top: 0;
	right: 0;
	left: 50%;
	bottom: 0;
	z-index: 9
}

.b-ball_bounce:hover .b-ball__right {
	display: none
}

.b-ball_bounce .b-ball__right:hover {
	left: 0;
	display: block!important
}

.b-ball_bounce.bounce>.b-ball__i {
	-webkit-transform: rotate(-9deg);
	-moz-transform: rotate(-9deg);
	-o-transform: rotate(-9deg);
	transform: rotate(-9deg)
}

.b-ball_bounce .b-ball__right.bounce+.b-ball__i {
	-webkit-transform: rotate(9deg);
	-moz-transform: rotate(9deg);
	-o-transform: rotate(9deg);
	transform: rotate(9deg)
}

.b-ball_bounce.bounce1>.b-ball__i {
	-webkit-transform: rotate(6deg);
	-moz-transform: rotate(6deg);
	-o-transform: rotate(6deg);
	transform: rotate(6deg)
}

.b-ball_bounce .b-ball__right.bounce1+.b-ball__i {
	-webkit-transform: rotate(-6deg);
	-moz-transform: rotate(-6deg);
	-o-transform: rotate(-6deg);
	transform: rotate(-6deg)
}

.b-ball_bounce.bounce2>.b-ball__i {
	-webkit-transform: rotate(-3deg);
	-moz-transform: rotate(-3deg);
	-o-transform: rotate(-3deg);
	transform: rotate(-3deg)
}

.b-ball_bounce .b-ball__right.bounce2+.b-ball__i {
	-webkit-transform: rotate(3deg);
	-moz-transform: rotate(3deg);
	-o-transform: rotate(3deg);
	transform: rotate(3deg)
}

.b-ball_bounce.bounce3>.b-ball__i {
	-webkit-transform: rotate(1.5deg);
	-moz-transform: rotate(1.5deg);
	-o-transform: rotate(1.5deg);
	transform: rotate(1.5deg)
}

.b-ball_bounce .b-ball__right.bounce3+.b-ball__i {
	-webkit-transform: rotate(-1.5deg);
	-moz-transform: rotate(-1.5deg);
	-o-transform: rotate(-1.5deg);
	transform: rotate(-1.5deg)
}
    `;
    var style = document.createElement('style');
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    // Добавляем стили в <head>
    document.head.appendChild(style);


    class Balls {
        constructor(context, buffer) {
            this.context = context;
            this.buffer = buffer;
        }
        setup() {
            this.gainNode = this.context.createGain();
            this.source = this.context.createBufferSource();
            this.source.buffer = this.buffer;
            this.source.connect(this.gainNode);
            this.gainNode.connect(this.context.destination);
            this.gainNode.gain.setValueAtTime(1, this.context.currentTime);
        }
        play() {
            this.setup();
            this.source.start(this.context.currentTime);
        }
        stop() {
            var ct = this.context.currentTime + 1;
            this.gainNode.gain.exponentialRampToValueAtTime(0.1, ct);
            this.source.stop(ct);
        }
    }

    class Buffer {
        constructor(context, urls) {
            this.context = context;
            this.urls = urls;
            this.buffer = [];
        }
        loadSound(url, index) {
            let request = new XMLHttpRequest();
            request.open("get", url, true);
            request.responseType = "arraybuffer";
            let thisBuffer = this;
            request.onload = function () {
                thisBuffer.context.decodeAudioData(request.response, function (buffer) {
                    thisBuffer.buffer[index] = buffer;
                    if (index == thisBuffer.urls.length - 1) {
                        thisBuffer.loaded();
                    }
                });
            };
            request.send();
        }
        getBuffer() {
            this.urls.forEach((url, index) => {
                this.loadSound(url, index);
            });
        }
        loaded() {
            loaded = true;
        }
        getSound(index) {
            return this.buffer[index];
        }
    }

    let balls = [],
        preset = 0,
        loaded = false;
    let path =
        "https://raw.githubusercontent.com/bybelov/new-year-garland/master/audio/";
    let sounds = [
        path + "sound1.mp3",
        path + "sound2.mp3",
        path + "sound3.mp3",
        path + "sound4.mp3",
        path + "sound5.mp3",
        path + "sound6.mp3",
        path + "sound7.mp3",
        path + "sound8.mp3",
        path + "sound9.mp3",
        path + "sound10.mp3",
        path + "sound11.mp3",
        path + "sound12.mp3",
        path + "sound13.mp3",
        path + "sound14.mp3",
        path + "sound15.mp3",
        path + "sound16.mp3",
        path + "sound17.mp3",
        path + "sound18.mp3",
        path + "sound19.mp3",
        path + "sound20.mp3",
        path + "sound21.mp3",
        path + "sound22.mp3",
        path + "sound23.mp3",
        path + "sound24.mp3",
        path + "sound25.mp3",
        path + "sound26.mp3",
        path + "sound27.mp3",
        path + "sound28.mp3",
        path + "sound29.mp3",
        path + "sound30.mp3",
        path + "sound31.mp3",
        path + "sound32.mp3",
        path + "sound33.mp3",
        path + "sound34.mp3",
        path + "sound35.mp3",
        path + "sound36.mp3"
    ];
    let context = new (window.AudioContext || window.webkitAudioContext)();

    function playBalls() {
        let index = parseInt(this.dataset.note) + preset;
        balls = new Balls(context, buffer.getSound(index));
        balls.play();
    }

    function stopBalls() {
        balls.stop();
    }

    let buffer = new Buffer(context, sounds);
    let ballsSound = buffer.getBuffer();
    let buttons = document.querySelectorAll(".b-ball_bounce");
    buttons.forEach((button) => {
        button.addEventListener("mouseenter", playBalls.bind(button));
        button.addEventListener("mouseleave", stopBalls);
    });

    function ballBounce(e) {
        var i = e;
        if (e.className.indexOf(" bounce") > -1) {
            return;
        }
        toggleBounce(i);
    }

    function toggleBounce(i) {
        i.classList.add("bounce");
        function n() {
            i.classList.remove("bounce");
            i.classList.add("bounce1");
            function o() {
                i.classList.remove("bounce1");
                i.classList.add("bounce2");
                function p() {
                    i.classList.remove("bounce2");
                    i.classList.add("bounce3");
                    function q() {
                        i.classList.remove("bounce3");
                    }
                    setTimeout(q, 300);
                }
                setTimeout(p, 300);
            }
            setTimeout(o, 300);
        }
        setTimeout(n, 300);
    }

    var array1 = document.querySelectorAll(".b-ball_bounce");
    var array2 = document.querySelectorAll(".b-ball_bounce .b-ball__right");

    for (var i = 0; i < array1.length; i++) {
        array1[i].addEventListener("mouseenter", function () {
            ballBounce(this);
        });
    }

    for (var i = 0; i < array2.length; i++) {
        array2[i].addEventListener("mouseenter", function () {
            ballBounce(this);
        });
    }

    let l = [
        "49",
        "50",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "48",
        "189",
        "187",
        "81",
        "87",
        "69",
        "82",
        "84",
        "89",
        "85",
        "73",
        "79",
        "80",
        "219",
        "221",
        "65",
        "83",
        "68",
        "70",
        "71",
        "72",
        "74",
        "75",
        "76",
        "186",
        "222",
        "220"
    ];
    let k = ["90", "88", "67", "86", "66", "78", "77", "188", "190", "191"];
    let a = {};
    for (let e = 0, c = l.length; e < c; e++) {
        a[l[e]] = e;
    }
    for (let e = 0, c = k.length; e < c; e++) {
        a[k[e]] = e;
    }


    // Иконки для звука включен/выключен
    const soundOnIcon = `https://svgshare.com/getbyhash/sha1-VPIm9LEmNoA0uRnMzW64nY/cdPg=`;
    const soundOffIcon = `https://svgshare.com/getbyhash/sha1-JbpmIYyQh7/lm5BJDzeR4Uw635Q=`;

    // Создаем элемент кнопки
    let soundButton = document.createElement('img');
    soundButton.src = localStorage.getItem('soundEnabled') !== 'false' ? soundOnIcon : soundOffIcon;
    soundButton.style.position = 'fixed';
    soundButton.style.top = '50px';
    soundButton.style.left = '10px';
    soundButton.style.zIndex = '10000';
    soundButton.style.width = '30px';
    soundButton.style.height = '30px';
    soundButton.style.cursor = 'pointer';

    let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    // Переопределение метода play в прототипе класса Balls для учета состояния звука
    Balls.prototype.play = function() {
        this.setup();
        if (soundEnabled) {
            this.gainNode.gain.setValueAtTime(1, this.context.currentTime);
        } else {
            this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
        }
        this.source.start(this.context.currentTime);
        balls.push(this); // Сохраняем экземпляр в массиве
    };
    // Функция для включения/отключения звука
    function toggleSound() {
        soundEnabled = !soundEnabled;
        localStorage.setItem('soundEnabled', soundEnabled);
        soundButton.src = soundEnabled ? soundOnIcon : soundOffIcon;

        // Устанавливаем громкость для всех Balls
        balls.forEach(ball => {
            ball.gainNode.gain.setValueAtTime(soundEnabled ? 1 : 0, ball.context.currentTime);
        });
    }
    // Добавляем событие клика для переключения звука
    soundButton.addEventListener('click', toggleSound);

    // Добавляем кнопку на страницу
    document.body.appendChild(soundButton);



    var navbarInner = document.querySelector('.navbar-inner');
    // Устанавливаем padding-top, если элемент найден
    if (navbarInner) {
        navbarInner.style.paddingTop = '38px';
    }

    var navbarContainer = document.querySelector('.navbar-static-top');
    // Устанавливаем margin-bottom, если элемент найден
    if (navbarContainer) {
        navbarContainer.style.marginBottom = '90px';
    }

    let istWidget = document.querySelector('.ist-widget');
        if (istWidget) {
        istWidget.style.top = '88px';
    }
    let segToolContainer = document.querySelector('.segmentation-tool-container');
            if (segToolContainer) {
        segToolContainer.style.height = 'calc(100vh - 140px)';
    }

    if (window.location.href === "https://tngadmin.triplenext.net/Admin/InteractiveSegmentation") {
        if (segToolContainer) segToolContainer.style.marginTop = '-20px';
    }

    // Создаем элемент для снегопада
    var particlesDiv = document.createElement('div');
    particlesDiv.id = 'particles-js';
    particlesDiv.style.position = 'fixed';
    particlesDiv.style.top = 0;
    particlesDiv.style.left = 0;
    particlesDiv.style.width = '100%';
    particlesDiv.style.height = '100%';
    particlesDiv.style.zIndex = '99999';
    particlesDiv.style.pointerEvents = 'none';
    document.body.appendChild(particlesDiv);

    // Функция для инициализации particles.js
    function initParticles() {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 20,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#fff"
                },
                shape: {
                    type: "image",
                    image: {
                        src: 'https://svgshare.com/getbyhash/sha1-zwkiPkVGm0n4Q3jrVPxuW1cFeR0=',
                        width: 100,
                        height: 100
                    }
                },
                opacity: {
                    value: 1,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 10,
                    random: true,
                    anim: {
                        enable: false
                    }
                },
                line_linked: {
                    enable: false
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: "bottom",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "repulse"
                    },
                    onclick: {
                        enable: true,
                        mode: "repulse"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 400,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    bubble: {
                        distance: 100,
                        size: 4,
                        duration: 0.3,
                        opacity: 1,
                        speed: 3
                    },
                    repulse: {
                        distance: 100,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }

    // Загружаем скрипт particles.js
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.js';
    script.onload = initParticles; // Инициализация после загрузки скрипта
    document.head.appendChild(script);
})();