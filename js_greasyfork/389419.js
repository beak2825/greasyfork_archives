// ==UserScript==
// @name         Torn Time
// @namespace    selits
// @version      1.0.0.2
// @description  Show TCT time in Torn, it is a slightly modified version of a script I found by Mist3rM [2154120]
// @author       selits
// @match        *.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/389419/Torn%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/389419/Torn%20Time.meta.js
// ==/UserScript==

GM_addStyle(`
	.add-time-display {
        padding-left: 42%;
        display: flex;
        justify-content: center;
        align-items: center;

	}
`)

const format = (date) => date.toUTCString().slice(0, 25)
const display = (date = new Date()) => `${format(date)} TCT`

const target = document.createElement('time')
target.classList.add('header-bottom-text', 'add-time-display')

document.querySelector('.header-wrapper-bottom').appendChild(target)

const update = () => target.textContent = display()

setInterval(update, 1000)
update()