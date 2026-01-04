// ==UserScript==
// @name       		Remove blur from textsheet
// @namespace  		Miyako.namespace.goes.here
// @version   		1.2
// @description  	Removes blur, removes ad and comment thread
// @include             https://www.textsheet.com/*
// @include             http://www.textsheet.com/*
// @include             https://textsheet.com/*
// @include             http://textsheet.com/*
// @require 		https://code.jquery.com/jquery-latest.min.js
// @copyright  		2019+, Miyako
// @downloadURL https://update.greasyfork.org/scripts/377349/Remove%20blur%20from%20textsheet.user.js
// @updateURL https://update.greasyfork.org/scripts/377349/Remove%20blur%20from%20textsheet.meta.js
// ==/UserScript==
var $ = window.jQuery;
$("#blur").removeClass( "ui very padded blurring segment dimmable dimmed" );
$("#blur").next().removeClass( "ui dimmable dimmed top aligned inverted dimmer transition visible active" );
$("#disqus_thread").parent().remove();
