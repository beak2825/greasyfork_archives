// ==UserScript==
// @match        https://444.hu/*
// @name         444 sallangmentesítés
// @description  minden baszt levágunk
// @namespace    http://tampermonkey.net/
// @version      0.5
// @author       You
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/388219/444%20sallangmentes%C3%ADt%C3%A9s.user.js
// @updateURL https://update.greasyfork.org/scripts/388219/444%20sallangmentes%C3%ADt%C3%A9s.meta.js
// ==/UserScript==

var $ = window.jQuery;

const delayedActions = function() {
  // csak a cikkekből szedjünk le a sallangot, a főoldalt békén hagyjuk
  if (/\/[\w\d]+.*/.test(location.pathname)) {
    removeCrap();
  }
}

const removeCrap = function() {
  'use strict';

  const selectors = [
	// facebook gombok mennek a levesbe
	'nav > .fb-like',
	'section:not([id=main-section]):has(.fb-share-button)',
	// pénzkérős giga-blokk -> kuka
	'footer > .support-box',
	// nem kellenek a "népszerű" blokkba berakott hülyeségek sem
	'section:not([id=main-section]):has(div.subhead:contains(Népszerű))',
	'#taboola-sponsored, #taboola-organic',
	// rizsa -> kuka
	'section[id=comments] div.subhead + div:contains(szabályok)',
	'section[id=comments] > div.subhead',
	// műsorvezetős blokk és egyéb cikkek oldalsó ajánlója
	'.widget-stream__streampunks > a > img',
	'.widget-stream',
	'#kummanto',
	// cikk elején lévő 12 millát tarháló box
	'#content-main > article > div:contains(Még 12 millió forintot)',
	// cikk alján lévő 12 millát tarháló nagy kövér box
	'footer > div:contains(Még 12 millió forintot)',
//	'#',
  ];
  const combinedSelector = selectors.join(',');

  $(combinedSelector).each(function() {
	$(this).remove();
  })
};

$(document).ready(delayedActions);