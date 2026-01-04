// ==UserScript==
// @name DH3 Compact
// @namespace https://github.com/lbrustad
// @version 1.1.3
// @description The compact look for DH3
// @author Lasse Brustad
// @grant GM_addStyle
// @run-at document-start
// @match https://dh3.diamondhunt.co/*
// @downloadURL https://update.greasyfork.org/scripts/415306/DH3%20Compact.user.js
// @updateURL https://update.greasyfork.org/scripts/415306/DH3%20Compact.meta.js
// ==/UserScript==

(function() {
let css = `

  body {
    font-size: 16px;
  }

  /* fixes annoying top bar putting text on a new line because of too much text */
  .top-top-bar {
    font-size: 13px;
    width: 100vw;
    position: fixed;
    z-index: 999;
  }

  .center {
    font-size: 0;
  }

  td.center {
    font-size: inherit;
  }

  /* makes levels a bit nicer! */
  td>div#top-bar-skills.not-table-top-main-skills {
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    justify-items: stretch;
  }

  td>div#top-bar-skills.not-table-top-main-skills:hover {
    padding: 0;
    margin: 0;
  }

  /* this one is for side chat users */
  div#top-bar-skills.not-table-top-main-skills > div {
    min-width: 0;
  }

  div#top-bar-skills.not-table-top-main-skills > div > table {
    transform: scale(0.9);
    width: 100%
  }

  div#top-bar-skills.not-table-top-main-skills > div > table > tbody > tr {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
  }

  div#top-bar-skills.not-table-top-main-skills > div > table > tbody > tr img {
    margin: 0 2rem;
  }

  div.not-table-top-main-skills-item {
    padding: 0;
  }

  .not-table-top-main-skills-item table:last-child tr>td:last-child {
    display: grid;
		grid-template-columns: 6fr 5fr;
  }

  .not-table-top-main-skills-item table:last-child tr>td:last-child :nth-child(1) {
    grid-area: 1 / 1;
		justify-self: right;
		line-height: 1.4rem;
		text-shadow: black 2px 1px;
  }

  .not-table-top-main-skills-item table:last-child tr>td:last-child :nth-child(2) {
    grid-area: 1 / 2;
		justify-self: left;
		line-height: 1.4rem;
		text-shadow: black 1px 1px;
  }

  .not-table-top-main-skills-item table:last-child tr>td:last-child :nth-child(4) {
    grid-area: 1 / 1 / 2 / 3;
		justify-self: center;
  }

  .not-table-top-main-skills-item table:last-child tr>td:last-child :nth-child(6),
	.not-table-top-main-skills-item table:last-child tr>td:last-child :nth-child(7) {
    grid-area: 3 / 1 / 4 / 3;
		justify-self: center;
  }

  .not-table-top-main-skills-item table:last-child tr>td:last-child br {
    display: none;
  }

  .not-table-top-main-skills-item table:last-child tr>td:last-child span {
    transform: scale(0.9);
    zoom: 0.9;
  }

  div.xp-bar,
  div.xp-bar-inner {
    height: 1.2rem;
  }

  /* tiny modification to the navbar */
  .navigate-button {
    display: grid !important;
    grid-template-rows: auto auto;
    grid-template-columns: auto;
    justify-items: center;
  }

  .navigate-button br {
    display: none;
  }

  /* less empty space caused by br tags... stop using it Smitty... */
  #game > br,
  div.right-panel > div > br {
    display: none;
  }

  table.table-top-main-items {
    margin-top: 36px;
    padding: 0 8px;
  }

  /* images should be tinyyy */
  img.img-50 {
    width: 35px;
    height: 35px;
  }

  img.img-100 {
    width: 70px;
    height: 70px;
  }

  /* tiny lvls too ofc... */
  div#top-bar-skills.not-table-top-main-skills {
    margin-top: 4px;
    padding: 0 8px;
  }

  /* notifications and that shit can be a little tinyyyer */
  div#notification-area {
    margin-bottom: 4px;
  }

  /* game area */

  /* annoying height with lots of empty space .... gone! */
  div.right-panel {
    min-height: 0;
  }

  /* just for the item boxes because they lost that much space */
  div.right-panel > div > div {
    padding: 4px;
  }

  /* less empty space between item boxes, it's not nessessary with that space duh */
  div.item-box {
    margin: 4px;
		width: 120px;
		height: 120px;
  }
	div.item-box >:first-child,
	div.item-box >:last-child {
		font-size: 8pt !important;
		height: 15px;
		margin-top: 5px;
	}
	#item-box-honeyStew-image {
		margin-bottom: -8px;
	}

  /* dialogues */

  /* tradables - sell item */
  #dialogue-tradables.dialogue {
		left: 23% !important;
    max-width: 54% !important;
    margin-top: 150px;
    margin-left: 0 !important;
  }

	/* hdie useless stuff */
	#item-box-snow {
		display: none;
	}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
