// ==UserScript==
// @name        HighlightSelected
// @namespace	novhna
// @description	Highlight selected text on doubleclick
// @include     *
// @version     0.0.2
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/369677/HighlightSelected.user.js
// @updateURL https://update.greasyfork.org/scripts/369677/HighlightSelected.meta.js
// ==/UserScript==

const highlighter = text => `<span 
    class="tmp-highlighted"
    style="background-color: yellow;"
>${text}</span>`
    
const replacer = selected => text => text === selected 
                                      ? highlighter(text) 
                                      : text 
  
const cleaner = () => document
    .querySelectorAll('span.tmp-highlighted')
    .forEach(tag => tag.outerText = tag.innerText)

document.body.addEventListener('dblclick', () => {
    cleaner()
    
	const selected = document.getSelection().toString().trim()
    if (!selected) return false
    
	const page = document.body.innerHTML
	const re = RegExp(`<.+?>|\\b(${selected})\\b`, 'g')
	console.log(`[${selected}]`, re)

    
	const newPage = page.replace(re, replacer(selected))
	document.body.innerHTML = newPage
})