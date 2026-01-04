// ==UserScript==
// @name         Add Time
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Add TCT to all pages
// @author       Mist3rM [2154120] & hannes3510 [2150804] 
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// Special thanks to Hannes3510 for helping me with the auto refresh; CroWtheGreat for assisting with the CSS; Mauk with the new code removing JQuery
// @downloadURL https://update.greasyfork.org/scripts/372500/Add%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/372500/Add%20Time.meta.js
// ==/UserScript==

GM_addStyle(`
	.add-time-display {
		padding: 0 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%
        font-size: 12pt;
        font-weight: bold;
        font-color: white;
	}
`)

const format = (date) => date.toISOString().slice(11, 19)
const display = (date = new Date()) => `Current Torn Time: ${format(date)}`

const target = document.createElement('time')
target.classList.add('header-bottom-text', 'add-time-display')

document.querySelector('.header-wrapper-bottom').appendChild(target)

const update = () => target.textContent = display()

setInterval(update, 1000)
update()