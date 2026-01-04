// ==UserScript==
// @name        GOG Abolish Reputation System
// @author      TheDcoder@protonmail.com
// @description Abolish GOG forum's reputation system
// @version     1.1
// @homepageURL https://www.gog.com/forum/general/fight_the_bullies_lets_abolish_the_reputation_system
// @namespace   Violentmonkey Scripts
// @match       http*://www.gog.com/forum/*/*
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_notification
// @downloadURL https://update.greasyfork.org/scripts/445101/GOG%20Abolish%20Reputation%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/445101/GOG%20Abolish%20Reputation%20System.meta.js
// ==/UserScript==

const NO_REP_CSS =
`
.big_user_info .b_u_rep .xywka,
.big_user_info .b_u_rep .t_u_stars_p,
.post_rate_red, .post_rate_green,
.rate_this_post_h_EN {
	display: none;
}

.replay_h_EN {
	right: 0 !important;
}
`;
const PROTEST_SIGNATURE = '[url=https://www.gog.com/forum/general/fight_the_bullies_lets_abolish_the_reputation_system]✊[/url]';

const OPTIONS = {
	ADD_SIG: {
		name: "Protest Signature",
		key: 'add_signature',
		def: true,
	},
};

[
OPTIONS.ADD_SIG,
].forEach(opt => {
	GM_registerMenuCommand(`Toggle ${opt.name.toLowerCase()}`, () => {
		toggle_option(opt);
	});
});

if (window.location.pathname == '/forum/ajax/popUp') {
	main_post();
} else {
	main_thread();
}

async function main_post() {
	var enabled = await get_option(OPTIONS.ADD_SIG);
	if (!enabled) return;
	var textarea = document.getElementById('text');
	textarea.value += '\n\n' + PROTEST_SIGNATURE;
}

async function main_thread() {
	GM_addStyle(NO_REP_CSS);
}

async function get_option(opt) {
	return await GM_getValue(opt.key, opt.def);
}

async function toggle_option(opt) {
	var value = await GM_getValue(opt.key, opt.def);
	value = !value;
	await GM_setValue(opt.key, value);
	notify_user(`${opt.name} has been ${value ? 'enabled' : 'disabled'}!`);
}

async function notify_user(msg) {
	GM_notification({
		title: "GOG Abolish REP",
		text: msg,
	});
}
