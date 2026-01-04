// ==UserScript==
// @name        auto language change
// @name:ru     автоматическая смена языка
// @namespace   https://www.root-me.org/
// @match       https://www.root-me.org/*lang=*
// @version     1.0
// @license     MIT
// @author      ssrankedghoul
// @description Changes language to preffered. By default, English.
// @description:ru Меняет язык на выбранный. По умолчанию, английский.
// @icon        https://www.root-me.org/IMG/logo/siteon0.svg?1637496509
// @downloadURL https://update.greasyfork.org/scripts/484169/auto%20language%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/484169/auto%20language%20change.meta.js
// ==/UserScript==

;(() => {
	const availableLanguages = {
			English: 'en',
			German: 'de',
			Spanish: 'es',
			Russian: 'ru',
			Chinese: 'zh',
			French: 'fr',
		},
		prefferedLanguage = availableLanguages.English, // ← CHANGE THIS
		langRegexp = new RegExp(`lang=(${Object.values(availableLanguages).join('|')})`)
	if (location.href.match(langRegexp)[1] !== prefferedLanguage)
		location.href = location.href.replace(langRegexp, `lang=${prefferedLanguage}`)
})()
