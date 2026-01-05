//
// Written by Glenn Wiking
// Script Version: 1.0.2e
// Date of issue: 08/11/14
// Date of resolution: 06/12/14
//
// ==UserScript==
// @name        NG Fix
// @namespace   NG
// @description Fix Newgrounds
// @include        http://*.newgrounds.com/portal/view/*
// @include        https://*.newgrounds.com/portal/view/*

// @version        0.0.1
// @downloadURL https://update.greasyfork.org/scripts/17095/NG%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/17095/NG%20Fix.meta.js
// ==/UserScript==

function ShadeRootNG(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootNG(
  '.thincol div:nth-of-type(1) {display: none;}'
  +
  '.thincol div:nth-of-type(2) {display: inline-block;}'
  +
  'div#votebar_pod {display: block;}'
  +
  '#megabanner {display: none !important;}'
  +
  '.cuck {opacity: 0;}'
  +
  '.podcontent {width: inherit;}'
  +
  '.authorlinks li ul li [title] {right: 52px;}'
  +
  '.authorlinks li ul li + li [title] {right: 27px;}'
  +
  'div a img[src="data:image/;base64,*"], .a[href="/supporter"] {display: none !important;}'
  +
  'div a img[style="height:768px"] {display: none !important;}'
  +
  'div a img[height="768px;"], div a img[height="90px;"] {display: none !important;}'
  +
  'div a img[max-width="none!important;"] {display: none !important;}'
  +
  '.gray > div > div > a > img {display: none !important;}'
);
