// ==UserScript==
// @name        Fake Premium
// @author      commander
// @description Makes the game think you have premium (only visual)
// @namespace   https://github.com/asger-finding/tanktrouble-userscripts
// @version     0.0.1
// @license     GPL-3.0
// @match       https://tanktrouble.com/*
// @match       https://beta.tanktrouble.com/*
// @exclude     *://classic.tanktrouble.com/
// @run-at      document-end
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/484074/Fake%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/484074/Fake%20Premium.meta.js
// ==/UserScript==

const { _updatePremium } = PremiumManager;
PremiumManager.classFields({
	get _updatePremium() {
		_updatePremium(true);
		return () => {};
	},
	set _updatePremium(value) {
		return value;
	}
});
