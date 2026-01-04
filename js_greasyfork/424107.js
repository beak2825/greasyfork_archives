// ==UserScript==
// @name        Disable YouTube Number Keyboard Seek Shortcuts
// @namespace   https://github.com/timmontague/youtube-disable-number-seek
// @description disables the 0-9 keyboard shortcuts
// @author      timm
// @version     1.0.1

// @match       *://www.youtube.com/*

// @match       *://vid.puffyan.us/*
// @match       *://invidious.fdn.fr/*
// @match       *://invidious.048596.xyz/*
// @match       *://invidious.site/*
// @match       *://yewtu.be/*
// @match       *://invidiou.site/*
// @match       *://invidious.himiko.cloud/*
// @match       *://invidious.snopyta.org/*
// @match       *://invidious.namazso.eu/*
// @match       *://invidious.xyz/*
// @match       *://ytprivate.com/*
// @match       *://invidious.kavin.rocks/*
// @match       *://invidious.tinfoil-hat.net/*
// @match       *://tube.connect.cafe/*
// @match       *://invidious.tube/*
// @downloadURL https://update.greasyfork.org/scripts/424107/Disable%20YouTube%20Number%20Keyboard%20Seek%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/424107/Disable%20YouTube%20Number%20Keyboard%20Seek%20Shortcuts.meta.js
// ==/UserScript==

function keyboard_event_handler(e) {
    // Don't prevent entering numbers in input areas
    if (e.target.tagName == 'INPUT' ||
	e.target.tagName == 'SELECT' ||
	e.target.tagName == 'TEXTAREA' ||
	e.target.isContentEditable) {
	return;
    }
    // Trap number keys
    if (e.key >= '0' && e.key <= '9') {
	e.stopImmediatePropagation();
    }
}
window.addEventListener('keydown', keyboard_event_handler, true);