// ==UserScript==
// @name            inoagent
// @version         1.0
// @description     Hide foreign agent banners on popular media websites
// @description:ru  Скрыть баннер об иностранном агенте на сайтах популярных СМИ
// @author          Oleg Kalachev
// @license         MIT
// @match           https://www.rosbalt.ru/*
// @match           https://meduza.io/*
// @match           https://tvrain.ru/*
// @match           https://istories.media/*
// @match           https://pasmi.ru/*
// @match           https://zona.media/*
// @grant           GM_addStyle
// @run-at          document-start
// @namespace https://greasyfork.org/users/827970
// @downloadURL https://update.greasyfork.org/scripts/434366/inoagent.user.js
// @updateURL https://update.greasyfork.org/scripts/434366/inoagent.meta.js
// ==/UserScript==

// Registry: https://minjust.gov.ru/ru/documents/7755/

if (location.host == 'meduza.io') {
	GM_addStyle('#div-gpt-ad { display: none !important }');

} else if (location.host == 'tvrain.ru') {
	GM_addStyle('.menu3__foreign-agent-wrapper { display: none !important }');
	GM_addStyle('.document-head__title_foreign_agent { display: none !important }');

} else if (location.host == 'zona.media') {
	GM_addStyle('.mz-agent-banner { display: none !important }');

} else if (location.host == 'www.rosbalt.ru') {
	GM_addStyle('.rkngov { display: none !important }');

} else if (location.host == 'istories.media') {
	GM_addStyle('.ForeignAgentBanner { display: none !important }');

} else if (location.host == 'pasmi.ru') {
	GM_addStyle('.content .excerpt:first-of-type { display: none !important }');
}
