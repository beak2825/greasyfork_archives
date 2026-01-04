// ==UserScript==
// @name         K4hhny Theme V3
// @namespace    Custom Redesigned Theme For K4hhny YT/TTV
// @version      3.0
// @description  Fixed and Redesigned K4 Theme
// @author       K4hhny, Omega, & web
// @match        https://*.shellshock.io/*
// @match        https://algebra.best/*
// @match        https://algebra.vip/*
// @match        https://biologyclass.club/*
// @match        https://deadlyegg.com/*
// @match        https://deathegg.world/*
// @match        https://egg.dance/*
// @match        https://eggboy.club/*
// @match        https://eggboy.xyz/*
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://egghead.institute/*
// @match        https://eggisthenewblack.com/*
// @match        https://eggsarecool.com/*
// @match        https://eggshooter.best/*
// @match        https://geometry.best/*
// @match        https://geometry.monster/*
// @match        https://geometry.pw/*
// @match        https://geometry.report/*
// @match        https://hardboiled.life/*
// @match        https://hardshell.life/*
// @match        https://humanorganising.org/*
// @match        https://mathactivity.xyz/*
// @match        https://mathdrills.info/*
// @match        https://mathdrills.life/*
// @match        https://mathfun.rocks/*
// @match        https://mathgames.world/*
// @match        https://math.international/*
// @match        https://mathlete.fun/*
// @match        https://mathlete.pro/*
// @match        https://new.shellshock.io/*
// @match        https://overeasy.club/*
// @match        https://scrambled.best/*
// @match        https://scrambled.tech/*
// @match        https://scrambled.today/*
// @match        https://scrambled.us/*
// @match        https://scrambled.world/*
// @match        https://shellsocks.com/*
// @match        https://shellshockers.club/*
// @match        https://shellshockers.site/*
// @match        https://shellshockers.us/*
// @match        https://shellshockers.world/*
// @match        https://shellshockers.xyz/*
// @match        https://softboiled.club/*
// @match        https://urbanegger.com/*
// @match        https://violentegg.club/*
// @match        https://violentegg.fun/*
// @match        https://yolk.best/*
// @match        https://yolk.life/*
// @match        https://yolk.quest/*
// @match        https://yolk.rocks/*
// @match        https://yolk.tech/*
// @match        https://yolk.today/*
// @match        https://zygote.cafe/*
// @grant        none
// @icon         https://yt3.ggpht.com/-BNZ5qAdcZ1TeQaRAy33WmMT3ajmuOnnaeG2gX3vZ8KlcflMYUlKLWSewWLNV4hLtFwS_DPZUA=s176-c-k-c0x00ffffff-no-rj-mo
// @downloadURL https://update.greasyfork.org/scripts/495674/K4hhny%20Theme%20V3.user.js
// @updateURL https://update.greasyfork.org/scripts/495674/K4hhny%20Theme%20V3.meta.js
// ==/UserScript==

(function () {
	const addScript = () => {
		document.title = "Subscribe to K4hhny"
		document.head.innerHTML += `<style>
			/* root */
			:root {
				--ss-lightoverlay: url('https://i.ibb.co/F7GDfh6/bg.png');
				--ss-popupbackground: url('https://i.ibb.co/F7GDfh6/bg.png');
				--ss-me-player-bg: url('https://i.ibb.co/F7GDfh6/bg.png');
			}

			/* loading screen msg */
			.load_message {
				visibility: hidden;
			}

			/* tips */
			.tips {
				display: none;
			}

			.spinner-tips:after {
				content: 'Theme by K4hhny & Omega. Fixed by web.';
				background: var(--ss-white);
				border-radius: 10em;
				color: var(--ss-blue4);
				font-size: 1.95vh;
				font-weight: 600;
				font-family: 'Nunito', sans-serif;
				height: 1.25em;
				margin: 1.5em auto;
				padding: 2em 2em;
				position: relative;
			}

			.is-paused .gameCanvas {
				border-color: #0e1287;
			}

			/* icons | vips */
			.vip-egg {
				color: #0e1287;
			}

			/* killstreak */
			#best_streak_container h1 {
				background-image: url('https://i.ibb.co/rGgs6f9/k4.png');
				padding-left: 1.9em;
			}

			/* kill feed */
			#killTicker {
				display: block !important;
			}

			/* map info */
			#inGameUI {
				background: none;
				border: none;
			}

			/* reticle/crosshair */
			#reticleDot {
				background: #00138c;
				border: solid 0.01em #ffffff;
				display: flex !important;
				width: 0.4em;
				height: 0.4em;
			}

			.crosshair.normal {
				border: #0e1287;
				background: #0e1287;
			}

			/* shotty crosshair */
			.shotReticle.border.normal {
				border-color: #0e1287;
				border-left: solid transparent !important;
				border-right: solid transparent !important;
			}

			.shotReticle.border.powerful {
				border-color: #ea00ff;
				border-left: solid transparent;
				border-right: solid transparent;
			}

			.shotReticle.fill.normal {
				border-color: #0e1287;
				border-left: solid transparent !important;
				border-right: solid transparent !important;
			}

			/* scope */
			#maskmiddle {
				background: url('https://i.ibb.co/2MH5LTn/scope.png') center center no-repeat;
				background-size: contain;
			}

			/* hp */
			#healthContainer {
				display: inline-block !important;
			}

			.healthYolk {
				fill: #0e1287;
			}

			#hardBoiledShieldFill {
				content: url('https://i.ibb.co/1QX8P4J/shield.png');
			}

			/* nade range indictor */
			#grenadeThrowContainer {
				background: #9da7bd;
			}

			#grenadeThrow {
				background: linear-gradient(0deg, rgba(253, 252, 255, 1), rgba(255, 254, 250, 1), rgba(206, 207, 245, 1), rgba(154, 156, 217, 1), rgba(99, 102, 214, 1), rgba(69, 73, 209, 1), rgba(42, 38, 163, 1), rgba(33, 37, 163, 1), rgba(14, 18, 135, 1));
			}

			/* kill/death msgs */
			#killBox h3, #deathBox h3 {
				display: none;
			}

			#killBox::before {
				font-size: 1em;
				font-weight: 900;
				content: 'YOU OBLITERATED'!important;
				color: #0e1287;
			}

			#deathBox::before {
				font-size: 1em;
				font-weight: 900;
				content: 'YOU WERE OBLITERATED BY'!important;
				color: #0e1287;
			}

			/* CleanUI */
			/* twitch no stream msg */
			.no-stream {
				background: none;
			}

			/* inv stuff */
			#item_mask {
				display: none;
			}

			/* chat */
			.is-paused .chat-wrapper {
				background: none;
				border: none;
			}

			/* hides "hidden chat" msg */
			.chat-hidden {
				display: none;
			}
		</style>`
	}
	document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();