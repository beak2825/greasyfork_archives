// ==UserScript==
// @name        Track Jammer for Firefox
// @namespace   N\A
// @description Trusted by who tryed. Tryed by you. Made on Firefox this time!
// @include     https://*/*
// @include     http://*/*
// @include     hxxp://*/*
// @include     about:blank
// @include     about:home
// @include     about:preferences
// @include     about:addons
// @version     0.3.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13890/Track%20Jammer%20for%20Firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/13890/Track%20Jammer%20for%20Firefox.meta.js
// ==/UserScript==

var right = document.getElementById('sky-right', 'sky-banner', 'sky-center', 'sky top');
var packa = document.getElementById('adunit', 'ads', 'abgc', 'google-companion-ad-div', 'watch7-sidebar-ads');
var packb = document.getElementById('watch-channel-brand-div', 'watch-channel-brand-div-text');
var packc = document.getElementById('google-osd-static-frame-4428394110873', 'flyoutPromo', '_ci4034458_b3879028');
var packd = document.getElementById('facebook', 'u_0_4', 'fb-root', '522603', 'widget_bounds');
var packe = document.getElementByClassName('img_ad', 'ad', 'abgc', 'cbc', 'ad-leader-plus-top');
var packf = document.getElemrntById('google_image_div', 'aw0', 'abgc', 'cbc', 'google_ads_iframr_/8264/aw-cnet/home_0__container__');
var packg = document.getElementById('google_ads_iframe_/8264/aw-cnet/home_0', 'script-show-info-ad');
var packh = document.getElementByClassName('ad-note', 'ad-content');
var packi = document.getElementById('pw_adbox_74788_5_0', '74788');

var parent = right.parentNode;
parent.removeChild(right);
parent.removeChild(packa);
parent.removechild(packb);
parent.removeChild(packc);
parent.removeChild(packd);
parent.removeChild(packe);
parent.removeChild(packf);
parent.removeChild(packg);
parent.removeChild(packh);
parent.removeChild(packi);