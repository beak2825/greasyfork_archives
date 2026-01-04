// ==UserScript==
// @name         Messenger Dark theme  
// @namespace    Wizzergod
// @version      1.0.8
// @description  Dark theme for web versioin messenger.
// @homepageURL   https://www.twitch.tv/wizzergod
// @supportURL    https://www.twitch.tv/wizzergod
// @author       Wizzergod
// @match        *://*.www.messenger.com/*
// @match        *://*.messenger.com/*
// @match        *://messenger.com/*
// @grant        unsafeWindow
// @icon https://static.xx.fbcdn.net/rsrc.php/yd/r/hlvibnBVrEb.svg
// @downloadURL https://update.greasyfork.org/scripts/417780/Messenger%20Dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/417780/Messenger%20Dark%20theme.meta.js
// ==/UserScript==


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('._4sp8 {background-color: #444950 !important;}');
addGlobalStyle('._5irm._7mkm {background-color: #606770 !important;}');
addGlobalStyle('._558b ._54ng {background-color: #606770fa !important;}');
addGlobalStyle('._3egs {background: #444950 !important;}');
addGlobalStyle('._3egs {background-color: rgb(68, 73, 80) !important;}');
addGlobalStyle('._hh7 {background-color: rgb(255 255 255 / 7%) !important;}');
addGlobalStyle('._hh7 {color: #f5f6f7 !important;}');
addGlobalStyle('._6-xo {color: #f5f6f7 !important;}');
addGlobalStyle('._17w2 {color: #f5f6f7 !important;}');
addGlobalStyle('._3eur._6ybk a {color: #f5f6f7 !important;}');
addGlobalStyle('._1lj0._6ybm {color: #f5f6f7ad !important;}');
addGlobalStyle('._7st9 {color: #ccc !important;}');
addGlobalStyle('._1ht7 {color: #606770 !important;}');
addGlobalStyle('._5iwm._6-_b ._58al {background-color: #606770 !important;}');
addGlobalStyle('._4-hy ._3ixn {background-color: rgba(0, 0, 0, .5) !important;}');
addGlobalStyle('._4eby {background: #8d949ed4 !important;}');
addGlobalStyle('._4eby {border-radius: 0px !important;}');
addGlobalStyle('._2i-c ._54nf ._54nh {color: #dadde1 !important;}');
addGlobalStyle('._3eus, ._5uh {color: #8d949e !important;}');
addGlobalStyle('._3szq {color: #8d949e !important;}');
addGlobalStyle('._7ht_ {color: #606770 !important;}');
addGlobalStyle('._4k7a {color: #606770 !important;}');
addGlobalStyle('._1r_9 ._53ij {box-shadow: 0 0 0 1px rgb(0, 0, 0, .35), 0 1px 10px rgba(0, 0, 0, .35) !important;}');
addGlobalStyle('body {background: #606770 !important;');
addGlobalStyle('body {color: #bec3c9 !important;');
addGlobalStyle('._4gd0 {background: #606770 !important;}');
