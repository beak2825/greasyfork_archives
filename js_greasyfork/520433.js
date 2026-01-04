// ==UserScript==
// @name copilot.microsoft.com - Black Mode
// @namespace typpi.online
// @version 1.3.1
// @description Black mode theme for Microsoft Copilot
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.copilot.microsoft.com/*
// @downloadURL https://update.greasyfork.org/scripts/520433/copilotmicrosoftcom%20-%20Black%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/520433/copilotmicrosoftcom%20-%20Black%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	:is([data-theme='dark'] *) {
		/*Box model stuff*/
		background-color: var(--color-black) !important;
		color: var(--color-white);
	}
	.backdrop-saturate-200 {
		/*Box model stuff*/
		border: outset;
		border-radius: 5px !important;
	}
	.inset-0 {
		top: 0;
		right: 0;
		/*Positioning stuff*/
		left: 0;
		/*Miscellaneous*/
		/* bottom: 0; */
	}
	.rounded-full {
		/*Box model stuff*/
		border-radius: 0;
	}

	.relative.max-w-full > * {
		background: var(--color-transparent) !important;
	}

	:root {
		--color-inherit: inherit;
		--color-transparent: transparent;
		--color-black: #000;
		--color-white: #fff;
		--color-background-100: var(--color-background-100);
		--color-background-150: var(--color-background-150);
		--color-background-200: var(--color-background-200);
		--color-background-250: var(--color-background-250);
		--color-background-300: var(--color-background-300);
		--color-background-350: var(--color-background-350);
		--color-background-400: var(--color-background-400);
		--color-background-450: var(--color-background-450);
		--color-background-550: var(--color-background-550);
		--color-background-600: var(--color-background-600);
		--color-background-650: var(--color-background-650);
		--color-background-700: var(--color-background-700);
		--color-background-750: var(--color-background-750);
		--color-background-800: var(--color-background-800);
		--color-background-850: var(--color-background-850);
		--color-background-900: var(--color-background-900);
		--color-background-static-100: var(
			--color-background-static-100
		);
		--color-background-static-150: var(
			--color-background-static-150
		);
		--color-background-static-200: var(
			--color-background-static-200
		);
		--color-background-static-250: var(
			--color-background-static-250
		);
		--color-background-static-300: var(
			--color-background-static-300
		);
		--color-background-static-350: var(
			--color-background-static-350
		);
		--color-background-static-400: var(
			--color-background-static-400
		);
		--color-background-static-450: var(
			--color-background-static-450
		);
		--color-background-static-550: var(
			--color-background-static-550
		);
		--color-background-static-600: var(
			--color-background-static-600
		);
		--color-background-static-650: var(
			--color-background-static-650
		);
		--color-background-static-700: var(
			--color-background-static-700
		);
		--color-background-static-750: var(
			--color-background-static-750
		);
		--color-background-static-800: var(
			--color-background-static-800
		);
		--color-background-static-850: var(
			--color-background-static-850
		);
		--color-background-static-900: var(
			--color-background-static-900
		);
		--color-foreground-100: var(--color-foreground-100);
		--color-foreground-150: var(--color-foreground-150);
		--color-foreground-200: var(--color-foreground-200);
		--color-foreground-250: var(--color-foreground-250);
		--color-foreground-300: var(--color-foreground-300);
		--color-foreground-350: var(--color-foreground-350);
		--color-foreground-400: var(--color-foreground-400);
		--color-foreground-450: var(--color-foreground-450);
		--color-foreground-550: var(--color-foreground-550);
		--color-foreground-600: var(--color-foreground-600);
		--color-foreground-650: var(--color-foreground-650);
		--color-foreground-700: var(--color-foreground-700);
		--color-foreground-750: var(--color-foreground-750);
		--color-foreground-800: var(--color-foreground-800);
		--color-foreground-850: var(--color-foreground-850);
		--color-foreground-900: var(--color-foreground-900);
		--color-foreground-static-100: var(
			--color-foreground-static-100
		);
		--color-foreground-static-150: var(
			--color-foreground-static-150
		);
		--color-foreground-static-200: var(
			--color-foreground-static-200
		);
		--color-foreground-static-250: var(
			--color-foreground-static-250
		);
		--color-foreground-static-300: var(
			--color-foreground-static-300
		);
		--color-foreground-static-350: var(
			--color-foreground-static-350
		);
		--color-foreground-static-400: var(
			--color-foreground-static-400
		);
		--color-foreground-static-450: var(
			--color-foreground-static-450
		);
		--color-foreground-static-550: var(
			--color-foreground-static-550
		);
		--color-foreground-static-600: var(
			--color-foreground-static-600
		);
		--color-foreground-static-650: var(
			--color-foreground-static-650
		);
		--color-foreground-static-700: var(
			--color-foreground-static-700
		);
		--color-foreground-static-750: var(
			--color-foreground-static-750
		);
		--color-foreground-static-800: var(
			--color-foreground-static-800
		);
		--color-foreground-static-850: var(
			--color-foreground-static-850
		);
		--color-foreground-static-900: var(
			--color-foreground-static-900
		);
		--color-stroke-100: var(--color-stroke-100);
		--color-stroke-150: var(--color-stroke-150);
		--color-stroke-200: var(--color-stroke-200);
		--color-stroke-250: var(--color-stroke-250);
		--color-stroke-300: var(--color-stroke-300);
		--color-stroke-350: var(--color-stroke-350);
		--color-stroke-400: var(--color-stroke-400);
		--color-stroke-450: var(--color-stroke-450);
		--color-stroke-550: var(--color-stroke-550);
		--color-stroke-600: var(--color-stroke-600);
		--color-stroke-650: var(--color-stroke-650);
		--color-stroke-700: var(--color-stroke-700);
		--color-stroke-750: var(--color-stroke-750);
		--color-stroke-800: var(--color-stroke-800);
		--color-stroke-850: var(--color-stroke-850);
		--color-stroke-900: var(--color-stroke-900);
		--color-stroke-static-100: var(
			--color-stroke-static-100
		);
		--color-stroke-static-150: var(
			--color-stroke-static-150
		);
		--color-stroke-static-200: var(
			--color-stroke-static-200
		);
		--color-stroke-static-250: var(
			--color-stroke-static-250
		);
		--color-stroke-static-300: var(
			--color-stroke-static-300
		);
		--color-stroke-static-350: var(
			--color-stroke-static-350
		);
		--color-stroke-static-400: var(
			--color-stroke-static-400
		);
		--color-stroke-static-450: var(
			--color-stroke-static-450
		);
		--color-stroke-static-550: var(
			--color-stroke-static-550
		);
		--color-stroke-static-600: var(
			--color-stroke-static-600
		);
		--color-stroke-static-650: var(
			--color-stroke-static-650
		);
		--color-stroke-static-700: var(
			--color-stroke-static-700
		);
		--color-stroke-static-750: var(
			--color-stroke-static-750
		);
		--color-stroke-static-800: var(
			--color-stroke-static-800
		);
		--color-stroke-static-850: var(
			--color-stroke-static-850
		);
		--color-stroke-static-900: var(
			--color-stroke-static-900
		);
		--color-neutral-50: #ffffff;
		--color-neutral-100: #fcfcfc;
		--color-neutral-150: #fcfcfc;
		--color-neutral-200: #f1f1f1;
		--color-neutral-250: #e2e2e2;
		--color-neutral-300: #c6c6c6;
		--color-neutral-350: #ababab;
		--color-neutral-400: #909090;
		--color-neutral-450: #767676;
		--color-neutral-550: #5f5f5f;
		--color-neutral-600: #535353;
		--color-neutral-650: #474747;
		--color-neutral-700: #3b3b3b;
		--color-neutral-750: #303030;
		--color-neutral-800: #262626;
		--color-neutral-850: #1b1b1b;
		--color-neutral-900: #111111;
		--color-neutral-950: #000000;
		--color-midnight-100: #f8fcff;
		--color-midnight-150: #f5f7ff;
		--color-midnight-200: #e8ecff;
		--color-midnight-250: #cfdeff;
		--color-midnight-300: #b8c3f5;
		--color-midnight-350: #9da8d9;
		--color-midnight-400: #7f8dc4;
		--color-midnight-450: #6777af;
		--color-midnight-550: #4b5c92;
		--color-midnight-600: #3e5189;
		--color-midnight-650: #2c3a63;
		--color-midnight-700: #242f50;
		--color-midnight-750: #1d2439;
		--color-midnight-800: #171e32;
		--color-midnight-850: #101524;
		--color-midnight-900: #0c101c;
		--color-saddle-100: #fffdfb;
		--color-saddle-150: #fff9f4;
		--color-saddle-200: #ffedde;
		--color-saddle-250: #f2ddcc;
		--color-saddle-300: #e3cbbc;
		--color-saddle-350: #bba5a0;
		--color-saddle-400: #a2898c;
		--color-saddle-450: #867073;
		--color-saddle-550: #6d585b;
		--color-saddle-600: #604d4f;
		--color-saddle-650: #524144;
		--color-saddle-700: #463739;
		--color-saddle-750: #392d2e;
		--color-saddle-800: #2d2224;
		--color-saddle-850: #21191a;
		--color-saddle-900: #150f10;
		--color-salmon-100: #fefcfb;
		--color-salmon-150: #fdf8f6;
		--color-salmon-200: #fbede8;
		--color-salmon-250: #f7dbd1;
		--color-salmon-300: #efb7a1;
		--color-salmon-350: #e59472;
		--color-salmon-400: #c67a5b;
		--color-salmon-450: #ad6446;
		--color-salmon-550: #8a4b30;
		--color-salmon-600: #7c4026;
		--color-salmon-650: #6a3620;
		--color-salmon-700: #5a2d1a;
		--color-salmon-750: #4b2414;
		--color-salmon-800: #3b1c0e;
		--color-salmon-850: #2d1308;
		--color-salmon-900: #1e0b04;
		--color-slate-100: #f3f5f7;
		--color-slate-150: #f0f1f5;
		--color-slate-200: #e4e6f1;
		--color-slate-250: #cfd8ec;
		--color-slate-300: #b8bfdd;
		--color-slate-350: #9ea5c2;
		--color-slate-400: #828bac;
		--color-slate-450: #6b7597;
		--color-slate-550: #505b7b;
		--color-slate-600: #455172;
		--color-slate-650: #313a52;
		--color-slate-700: #282f42;
		--color-slate-750: #1f2330;
		--color-slate-800: #191d29;
		--color-slate-850: #11151d;
		--color-slate-900: #0d1017;
		--color-stone-100: #fefcfb;
		--color-stone-150: #f8f4f2;
		--color-stone-200: #f4efed;
		--color-stone-250: #e8e0dc;
		--color-stone-300: #ccc4c0;
		--color-stone-350: #b1aaa6;
		--color-stone-400: #968f8c;
		--color-stone-450: #7b7572;
		--color-stone-550: #635d5a;
		--color-stone-600: #57514f;
		--color-stone-650: #4a4543;
		--color-stone-700: #3e3a38;
		--color-stone-750: #33302e;
		--color-stone-800: #282523;
		--color-stone-850: #1d1b1a;
		--color-stone-900: #131110;
		--color-green-400: #4ba849;
		--color-blue-250: #cfeaf5;
		--color-blue-300: #b9e3f3;
		--color-blue-450: #0f92c6;
		--color-green-150: #f7fde5;
		--color-green-300: #94dc7f;
		--color-orange-300: #ffb352;
		--color-peach-100: #fcf7f2;
		--color-peach-150: #fdedde;
		--color-peach-200: #fee5ce;
		--color-peach-250: #fee0c3;
		--color-peach-300: #ffd2a7;
		--color-peach-350: #e3b388;
		--color-acrylic-default-fallback-light: #fefbf8;
		--color-acrylic-default-fallback-dark: #1c2437;
		--color-acrylic-thin-fallback-light: #fffdfb;
		--color-acrylic-thin-fallback-dark: #1a1e2d;
		--color-code-text: #fcfaf7;
		--color-code-comment: #aa9c87;
		--color-code-yellow: #ffc42f;
		--color-code-blue: #67abf1;
		--color-code-green: #00b360;
		--color-code-orange: #f96c00;
		--color-code-purple: #e3b5fa;
		--color-audio-blue: #b4d7ff;
		--color-audio-cyan: #b9fced;
		--color-link-350: #4d8dfa;
		--color-link-550: #235ccf;
		--color-weather-blue: #1695df;
		--color-green-350: #6fc366;
		--color-green-550: #127323;
		--color-red-350: #fa818b;
		--color-red-550: #993a45;
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
