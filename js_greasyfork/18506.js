// ==UserScript==
// @name         Stylish | zillers.co.kr
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       You
// @include      http://zillers.co.kr/*
// @include      http://www.zillers.co.kr/*
// @include      https://zillers.co.kr/*
// @include      https://www.zillers.co.kr/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/18506/Stylish%20%7C%20zillerscokr.user.js
// @updateURL https://update.greasyfork.org/scripts/18506/Stylish%20%7C%20zillerscokr.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(){

	var styleEl = document.createElement('style');
	var rule = document.createTextNode('\
	* {font-size:12px !important;line-height:12px !important;padding:0;}\
	.wrapper,\
	.thumb,\
	#mobilead,\
	.app-aside,\
	.nav,\
	.navbar-header,\
    #footer,\
	.app-content-body .bg-light {display:none !important;}\
	.app-content,\
	.bg-white-only {margin:0;}\
	.form-control,\
	.input-group {margin:0;width:100%;height:auto;}\
	.bg-white-only {margin:0;padding:0;}\
	.navbar-collapse {display:block;}\
	.input-group-btn {width:1% !important;}\
	.navbar-form {float:none !important;width:100%;margin:0;}\
	.form-group {display:block !important;}\
	.label {padding:0;font-size:10px !important;}\
	.label:first-child {margin-bottom:2px;}\
	.list-group-lg .list-group-item {padding:5px 0;}\
	.ng-scope .clear div:nth-child(1) {display:inline-block;height:24px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:calc(100% - 120px);line-height:24px !important;vertical-align:middle;}\
	.ng-scope .clear div:nth-child(2) {float:left;overflow:hidden;width:40px;white-space:nowrap;}\
	.ng-scope .clear div:nth-child(2) .label {display:block;}\
	.ng-scope .clear div:nth-child(3) {line-height:24px !important}\
	.text-muted {width:80px;white-space:nowrap;font-size:11px;letter-spacing:-1px;}\
    .app-content-full {bottom:0 !important;}\
	');

	styleEl.appendChild(rule);
	document.getElementsByTagName('head')[0].appendChild(styleEl);
});