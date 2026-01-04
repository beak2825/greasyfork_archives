// ==UserScript==
// @name         HaveIt Style
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  style
// @author       Dimava
// @match        https://test.seihoukei.games/have-it/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seihoukei.games
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/466902/HaveIt%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/466902/HaveIt%20Style.meta.js
// ==/UserScript==

var styleLIYG = document.createElement('style');
document.head.append(styleLIYG);
styleLIYG.innerHTML = `
#app .content {
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
}

#app .list.svelte-62uor0 {
	display: grid;
	grid-auto-flow: column;
	grid-template-rows: repeat(10, 1fr);
	gap: 1em;
	font-size: 1.6vh;
}


#app .resource.svelte-g7x8d0 {
	aspect-ratio: 1 / 1;
}

#app .list.svelte-1h8t3jd {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
	padding: 1em;
	grid-auto-flow: dense;
}

#app .upgrade.svelte-3sbd7n {
	width: 100%;
	min-width: 12em;
}

#app .upgrade.svelte-3sbd7n {
	outline: 3px solid;
}

#app .upgrade:not(:first-child):has( .description .icon:first-child[style*="#CC0000"] ) {
	outline: 3px solid #CC0000;
	grid-column: 2;
}
#app .upgrade:has( .description .icon:first-child[style*="#00CC00"] ) {
	outline: 3px solid #00CC00;
	grid-column: 3;
}
#app .upgrade:has( .description .icon:first-child[style*="#CC7700"] ) {
	outline: 3px solid #CC7700;
	grid-column: 4;
}
#app .upgrade:has( .description .icon:first-child[style*="#7700CC"] ) {
	outline: 3px solid #7700CC;
	grid-column: 5;
}
#app .upgrade:has( .description .icon:first-child[style*="#0077CC"] ) {
	outline: 3px solid #0077CC;
	grid-column: 6;
}
#app .upgrade:has( .cost .icon:nth-child(3) ) {
	grid-column: 1 !important;
}
`