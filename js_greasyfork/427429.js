// ==UserScript==
// @name         Hacker News Contextual Comments (sticky tree)
// @version      0.4.1
// @description  Sticks the first line of all comments in the visible comment tree to the top of the screen so you always know where exactly you are. See the screenshots for a better understanding. Also adds the ability to expand/collapse a comment by clicking anywhere on it.
// @author       phil294
// @match        https://news.ycombinator.com/item?id=*
// @icon         https://www.google.com/s2/favicons?domain=ycombinator.com
// @grant        none
// @namespace https://greasyfork.org/users/779094
// @downloadURL https://update.greasyfork.org/scripts/427429/Hacker%20News%20Contextual%20Comments%20%28sticky%20tree%29.user.js
// @updateURL https://update.greasyfork.org/scripts/427429/Hacker%20News%20Contextual%20Comments%20%28sticky%20tree%29.meta.js
// ==/UserScript==

const style = document.createElement('style')
style.type = 'text/css'
style.textContent = `
tr.comtr {
	position: sticky;
	display: block;
	background: #f6f6ef;
	min-height: 40px;
	cursor: pointer;
}
tr.comtr.noshow {
	display: none;
}
td.default > div:first-child {
	margin: 0 !important;
}
td.default > br {
	display: none;
}`
document.head.appendChild(style)

let i_zindex = 0

for(const com of document.querySelectorAll('tr.comtr')) {
	const nesting_level = com.querySelector('.ind > img').width / 40
	com.style.top = `calc(${nesting_level} * 2.3em)`
	com.style.zindex = ++i_zindex
	com.onclick = async () => {
		com.querySelector('a.togg').click()
		com.style.position = 'static'
		com.scrollIntoView({block: "start", inline: "nearest", behavior: "smooth"})
		com.style.position = 'sticky'
	}
}
