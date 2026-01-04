// ==UserScript==
// @name DuckDuckGo | Untitled Goose Game
// @namespace https://greasyfork.org/users/541594
// @version 1.0.0
// @description *Hjonk*
// @author Freeplay(https://il.ink/freeplay)
// @grant GM_addStyle
// @run-at document-start
// @match *://*.duckduckgo.com/*
// @downloadURL https://update.greasyfork.org/scripts/405280/DuckDuckGo%20%7C%20Untitled%20Goose%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/405280/DuckDuckGo%20%7C%20Untitled%20Goose%20Game.meta.js
// ==/UserScript==

(function() {
let css = `
	.header__logo {
		background-image: url('https://i.imgur.com/bRj8IWM.png') !important;
	}
	#logo_homepage_link {
		background-image: url('https://i.imgur.com/bRj8IWM.png');
		object-fit: contain;
		height: 115px;
		width: 115px;
		margin: auto;
		margin-top: 28px;
	}
	.logo-wrap--home {
		display: grid;
		justify-content: center;
	}
	.logo-wrap--home::After {
		display: flex;
		content: "Hjönk Hjönk";
		font-size: 36px;
		color: #de5833;
		margin: auto;
	}
	
	.tag-home__item {
		font-size: 0;
	}
	.tag-home__item::before {
		content: "Hjönk, simplified";
		font-size: 18px;
	}
	.hide--screen-xs {
		font-size: 18px;
	}
	
	/* HEADER BUTTON */
	#wedonttrack {
		font-size: 0;
	}
	#wedonttrack::before {
		content: "Hjonk, simplified";
		font-size: 15px;
	}
	
	/* SIDEBAR NAV */
	.nav-menu__list > ul:last-child:after {
		content: '*Hjonk*';
		color: #de5833;
	}
	
	/*** FOOTER CARDS ***/
	.footer__card__icon[src="/assets/icons/hatched.svg"] ~ .footer__card__title {
		font-size: 0;
	}
	.footer__card__icon[src="/assets/icons/hatched.svg"] ~ .footer__card__title::before {
		content: "Learn About Hjonk";
		font-size: 15px;
	}
	
	.footer__card__icon[src="/assets/icons/private-searches.svg"] ~ .footer__card__title {
		font-size: 0;
	}
	.footer__card__icon[src="/assets/icons/private-searches.svg"] ~ .footer__card__title::before {
		content: "Fine-tune Your Hjonk";
		font-size: 15px;
	}
	
	.footer__card__icon[src="/assets/icons/spread.svg"] ~ .footer__card__title {
		font-size: 0;
	}
	.footer__card__icon[src="/assets/icons/spread.svg"] ~ .footer__card__title::before {
		content: "Help Spread Hjonk";
		font-size: 15px;
	}
	
	.footer__card__icon[src="/assets/icons/mailbox.svg"] ~ .footer__card__title {
		font-size: 0;
	}
	.footer__card__icon[src="/assets/icons/mailbox.svg"] ~ .footer__card__title::before {
		content: "Hjonk in Your Inbox";
		font-size: 15px;
	}
	
	.footer__card__icon[src="/assets/icons/milestone.svg"] ~ .footer__card__title {
		font-size: 0;
	}
	.footer__card__icon[src="/assets/icons/milestone.svg"] ~ .footer__card__title::before {
		content: "Say Goodbye To Humans";
		font-size: 15px;
	}
	.footer__card__icon[src="/assets/icons/milestone.svg"] ~ .footer__text {
		font-size: 0;
	}
	.footer__card__icon[src="/assets/icons/milestone.svg"] ~ .footer__text::before {
		font-size: 13px;
		content: "Learn how you can free yourself from Humans for good.";
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
