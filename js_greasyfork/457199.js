/* eslint-disable no-multi-spaces */
/* eslint-disable no-sequences */
/* eslint-disable no-return-assign */

// ==UserScript==
// @name               download corner pop
// @namespace          MFM3Code
// @version            0.3
// @description        a corner pop script
// @author             PY-DNG
// @license            GPL-3.0-or-later
// @grant              none
// ==/UserScript==

let pop;
! function(a) {
	const loader = () => pop = a();
	document.readyState !== 'loading' ? loader() : document.addEventListener('DOMContentLoaded', loader);
}(function() {
	document.head.appendChild(makeElm('<style>@font-face {font-family: Barlow;font-style: italic;font-weight: 500;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHsv4kjgoGqM7E_CfPI42ohvTobdw.woff2) format("woff2");unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+1EA0-1EF9,U+20AB }@font-face {font-family: Barlow;font-style: italic;font-weight: 500;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHsv4kjgoGqM7E_CfPI42ogvTobdw.woff2) format("woff2");unicode-range: U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF }@font-face {font-family: Barlow;font-style: italic;font-weight: 500;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHsv4kjgoGqM7E_CfPI42ouvTo.woff2) format("woff2");unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD }@font-face {font-family: Barlow;font-style: italic;font-weight: 600;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHsv4kjgoGqM7E_CfPk5GohvTobdw.woff2) format("woff2");unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+1EA0-1EF9,U+20AB }@font-face {font-family: Barlow;font-style: italic;font-weight: 600;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHsv4kjgoGqM7E_CfPk5GogvTobdw.woff2) format("woff2");unicode-range: U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF }@font-face {font-family: Barlow;font-style: italic;font-weight: 600;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHsv4kjgoGqM7E_CfPk5GouvTo.woff2) format("woff2");unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD }@font-face {font-family: Barlow;font-style: italic;font-weight: 700;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHsv4kjgoGqM7E_CfOA5WohvTobdw.woff2) format("woff2");unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+1EA0-1EF9,U+20AB }@font-face {font-family: Barlow;font-style: italic;font-weight: 700;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHsv4kjgoGqM7E_CfOA5WogvTobdw.woff2) format("woff2");unicode-range: U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF }@font-face {font-family: Barlow;font-style: italic;font-weight: 700;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHsv4kjgoGqM7E_CfOA5WouvTo.woff2) format("woff2");unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD }@font-face {font-family: Barlow;font-style: italic;font-weight: 800;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHsv4kjgoGqM7E_CfOc5mohvTobdw.woff2) format("woff2");unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+1EA0-1EF9,U+20AB }@font-face {font-family: Barlow;font-style: italic;font-weight: 800;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHsv4kjgoGqM7E_CfOc5mogvTobdw.woff2) format("woff2");unicode-range: U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF }@font-face {font-family: Barlow;font-style: italic;font-weight: 800;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHsv4kjgoGqM7E_CfOc5mouvTo.woff2) format("woff2");unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD }@font-face {font-family: Barlow;font-style: italic;font-weight: 900;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHsv4kjgoGqM7E_CfO452ohvTobdw.woff2) format("woff2");unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+1EA0-1EF9,U+20AB }@font-face {font-family: Barlow;font-style: italic;font-weight: 900;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHsv4kjgoGqM7E_CfO452ogvTobdw.woff2) format("woff2");unicode-range: U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF }@font-face {font-family: Barlow;font-style: italic;font-weight: 900;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHsv4kjgoGqM7E_CfO452ouvTo.woff2) format("woff2");unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD }@font-face {font-family: Barlow;font-style: normal;font-weight: 500;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHqv4kjgoGqM7E3_-gs6FospT4.woff2) format("woff2");unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+1EA0-1EF9,U+20AB }@font-face {font-family: Barlow;font-style: normal;font-weight: 500;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHqv4kjgoGqM7E3_-gs6VospT4.woff2) format("woff2");unicode-range: U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF }@font-face {font-family: Barlow;font-style: normal;font-weight: 500;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHqv4kjgoGqM7E3_-gs51os.woff2) format("woff2");unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD }@font-face {font-family: Barlow;font-style: normal;font-weight: 600;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHqv4kjgoGqM7E30-8s6FospT4.woff2) format("woff2");unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+1EA0-1EF9,U+20AB }@font-face {font-family: Barlow;font-style: normal;font-weight: 600;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHqv4kjgoGqM7E30-8s6VospT4.woff2) format("woff2");unicode-range: U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF }@font-face {font-family: Barlow;font-style: normal;font-weight: 600;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHqv4kjgoGqM7E30-8s51os.woff2) format("woff2");unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD }@font-face {font-family: Barlow;font-style: normal;font-weight: 700;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHqv4kjgoGqM7E3t-4s6FospT4.woff2) format("woff2");unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+1EA0-1EF9,U+20AB }@font-face {font-family: Barlow;font-style: normal;font-weight: 700;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHqv4kjgoGqM7E3t-4s6VospT4.woff2) format("woff2");unicode-range: U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF }@font-face {font-family: Barlow;font-style: normal;font-weight: 700;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHqv4kjgoGqM7E3t-4s51os.woff2) format("woff2");unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD }@font-face {font-family: Barlow;font-style: normal;font-weight: 800;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHqv4kjgoGqM7E3q-0s6FospT4.woff2) format("woff2");unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+1EA0-1EF9,U+20AB }@font-face {font-family: Barlow;font-style: normal;font-weight: 800;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHqv4kjgoGqM7E3q-0s6VospT4.woff2) format("woff2");unicode-range: U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF }@font-face {font-family: Barlow;font-style: normal;font-weight: 800;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHqv4kjgoGqM7E3q-0s51os.woff2) format("woff2");unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD }@font-face {font-family: Barlow;font-style: normal;font-weight: 900;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHqv4kjgoGqM7E3j-ws6FospT4.woff2) format("woff2");unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+1EA0-1EF9,U+20AB }@font-face {font-family: Barlow;font-style: normal;font-weight: 900;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHqv4kjgoGqM7E3j-ws6VospT4.woff2) format("woff2");unicode-range: U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF }@font-face {font-family: Barlow;font-style: normal;font-weight: 900;font-display: swap;src: url(https://gstatic.loli.net/s/barlow/v5/7cHqv4kjgoGqM7E3j-ws51os.woff2) format("woff2");unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD }body {font-family:Barlow,-apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;}#pop-container, #pop-container *, #pop-container :before, #pop-container :after {box-sizing:border-box;}#pop-container {position: fixed;right: 20px;bottom: 20px;z-index: 9999 }.with-play-bar #pop-container {bottom: 100px }[class*=pop-] {position: relative;display: flex;overflow: hidden;margin-top: 10px;width: 300px;max-width: calc(100vw - 40px);border-radius: 8px;box-shadow: 0 4px 16px -1px rgba(18,22,33,.3);align-items: center;word-break: break-all;user-select: none }[class*=pop-] .progress {position: absolute;bottom: 0;left: 0;height: 4px;background: #99a3ba;opacity: 0;transition: opacity 1s }.pop-info {padding: 20px 20px;background: #2e77d0 }.pop-info .text span {color: #fff;font-size: 16px }.pop-info .icon svg {fill: #fff }.pop-download {padding: 32px 20px;background: #fff }.pop-download .percent {position: absolute;top: 0;right: 0;bottom: 0;left: 0;overflow: hidden;background: #f5f9ff;transition: background .6s ease,transform .16s ease;transform: scaleX(0);transform-origin: 0 50% }.pop-download .percent span {position: absolute;right: 0;bottom: 19px;display: block;width: 100%;height: 2px;opacity: 0;transition: transform .8s ease;transform: translateY(.5px) }.pop-download .percent span::after,.pop-download .percent span::before {position: absolute;top: 0;height: 2px;border-radius: 1px;background: #5628ee;content: "";transition: background .8s ease,transform .8s ease,height .3s ease;transform: rotate(var(--r)) scaleY(var(--s));--r: 0;--s: 0.5 }.pop-download .percent span::before {right: 0;width: 64%;transform-origin: 0 50% }.pop-download .percent span::after {left: 0;width: 38%;transform-origin: 100% 50% }.pop-download .percent div {position: absolute;bottom: 8px;left: 0;width: 300%;transition: transform 1s ease;transform: translateX(var(--x));--x: 0 }.pop-download .percent svg {display: block;width: 100%;height: 12px;color: #5628ee;transition: color .5s ease;stroke-width: 1.2px }.pop-download.finished .percent {background: #fff }.pop-download.finished .percent span {width: 20px;opacity: 1;transform: translate(-20px,-19px) }.pop-download.finished .percent span::after,.pop-download.finished .percent span::before {background: #99a3ba;transition: background .6s ease,transform .6s ease .45s;--s: 1;animation: check .4s linear forwards .6s }.pop-download.finished .percent span::before {--r: -50deg }.pop-download.finished .percent span::after {--r: 38deg }.pop-download.finished .percent svg {opacity: 0 }.pop-download.finished .text {--y: 0 }.pop-download.finished .text>div {opacity: 0 }.pop-download .text {position: relative;z-index: 1;width: calc(100% - 40px);transition: transform .6s ease;transform: translateY(var(--y));--y: -18px }.pop-download .text strong {display: block;overflow: hidden;color: #3f4656;text-overflow: ellipsis;white-space: nowrap;font-weight: 400;font-size: 14px }.pop-download .text>div {position: absolute;top: 100%;left: 0;display: flex;line-height: 20px;transition: opacity .4s ease;transform: translateY(6px);align-items: center }.pop-download>.text>div>div {height: 20px;}.pop-download .text>div small {display: inline-block;color: #99a3ba;vertical-align: top;white-space: nowrap;font-size: 12px }.pop-download .text>div>small {width: 30px;text-align: center }.pop-download .text>div div {position: relative;display: inline-block;margin-left: 8px;vertical-align: top }.pop-download .text>div div::before {display: inline-block;margin-top: 9px;width: 2px;height: 2px;border-radius: 50%;background: #99a3ba;content: "";vertical-align: top }.pop-download .text>div div small {position: absolute;top: 0;left: 8px }[class*=pop-] .icon {position: relative;z-index: 1;display: flex;margin-left: auto;padding-left: 10px;transition: opacity .4s ease;align-items: center }[class*=pop-] .icon>div {display: flex;margin: 0;padding: 0;list-style: none }.pop-download.finished .icon {opacity: 0 }[class*=pop-] .icon svg {width: 20px;height: 20px }@media (max-width: 767px) {#pop-container {bottom: 50px }.with-play-bar #pop-container {bottom: 140px }}</style>'));
	return function() {
		function b(a, b) {
			var c = makeElm('<div class="pop-info" style="display:none"><div class="text"><span data-text></span></div><div class="icon"><div><svg viewBox="0 0 1024 1024"><path d="M512 14.208c274.56 0 497.792 223.168 497.792 497.792 0 274.56-223.168 497.792-497.792 497.792C237.44 1009.792 14.208 786.56 14.208 512 14.208 237.44 237.44 14.208 512 14.208z m0 71.104A427.072 427.072 0 0 0 85.312 512 427.072 427.072 0 0 0 512 938.688 427.072 427.072 0 0 0 938.688 512 427.072 427.072 0 0 0 512 85.312z m35.584 628.16v71.104H476.416v-71.04h71.168z m0-474.048v402.944H476.416V239.424h71.168z"></path></svg></div></div><div class="progress"></div>');
			return 0 === $All("#pop-container").length && $("body").appendChild(makeElm('<div id="pop-container"></div>')),
				$("#pop-container").insertAdjacentElement('afterbegin', c),
				[...$All(c, "span[data-text]")].forEach(elm => elm.innerHTML = a),
				0 !== b && (c.addEventListener('click', function() {
					h(c);
				}),
				h(c, b || 3e3)),
				fadeIn(c, 500),
				c
		}

		function c(a) {
			var b = makeElm('<div class="pop-download" style="display:none;"><div class="text"><strong><span data-text></span></strong><div><small>%</small><div><small>0 B / 0 B</small></div></div></div><div class="icon"><div><svg viewBox="0 0 1024 1024"><path d="M867.3 342.8L539.5 670.7V79.4c0-15.2-12.3-27.5-27.5-27.5s-27.5 12.3-27.5 27.5v591.3L156.7 342.8c-5.4-5.4-12.4-8-19.4-8-7 0-14.1 2.7-19.4 8-10.7 10.7-10.7 28.1 0 38.8l374.7 374.7c10.7 10.7 28.1 10.7 38.8 0l374.7-374.7c10.7-10.7 10.7-28.1 0-38.8-10.7-10.7-28.1-10.7-38.8 0z m129.2 574.4h-969C12.3 917.2 0 929.5 0 944.6c0 15.2 12.3 27.5 27.5 27.5h969.1c15.2 0 27.5-12.3 27.5-27.5-0.1-15.1-12.4-27.4-27.6-27.4z"></path></svg></div></div><div class="percent"><span></span><div><svg preserveaspectratio="none" viewbox="0 0 600 12"><path d="M0,1 L200,1 C300,1 300,11 400,11 L600,11" fill="none" stroke="currentColor"></path></svg></div></div><div class="progress"></div></div>');
			return 0 === $All("#pop-container").length && $("body").appendChild(makeElm('<div id="pop-container"></div>')),
				$("#pop-container").insertAdjacentElement('afterbegin', b),
				[...$All(b, "span[data-text]")].forEach(elm => elm.innerHTML = a),
				fadeIn(b, 500),
				b
		}

		function d(a) {
			a.classList.add("finished");
		}

		function e(a, b) {
			$All(a, "small")[1].innerHTML = b;
		}

		function f(a, b) {
			[...$All(a, "span[data-text]")].forEach(elm => elm.innerHTML = b);
		}

		function g(a, b) {
			$All(a, "small")[0].innerHTML = b + "%";
			[...$All(a, ".percent")].forEach(elm => elm.style.transform = "scaleX(" + b / 100 + ")");
		}

		function h(a, b) {
			var c, d, e;
			b ? (c = new Date,
				d = [...$All(a, ".progress")],
				d.forEach(elm => {elm.style.width = "100%"; elm.style.opacity = "1"}),
				e = setInterval(function() {
					var f = 100 * ((new Date - c) / b) >> 0;
					d.forEach(elm => elm.style.width = 100 - f + "%");
					new Date - c >= b && (clearTimeout(e),
						fadeOut(a, 500, function() {
							a.remove();
						}))
				}, 10)) : fadeOut(a, 500, function() {
				a.remove();
			})
		}
		var a = {
			info: b,
			download: c,
			finished: d,
			size: e,
			text: f,
			percent: g,
			close: h
		};
		return a;
	}();

	// Basic functions
	// querySelector
	function $() {
		switch(arguments.length) {
			case 2:
				return arguments[0].querySelector(arguments[1]);
				break;
			default:
				return document.querySelector(arguments[0]);
		}
	}
	// querySelectorAll
	function $All() {
		switch(arguments.length) {
			case 2:
				return arguments[0].querySelectorAll(arguments[1]);
				break;
			default:
				return document.querySelectorAll(arguments[0]);
		}
	}
	// createElement
	function $CrE() {
		switch(arguments.length) {
			case 2:
				return arguments[0].createElement(arguments[1]);
				break;
			default:
				return document.createElement(arguments[0]);
		}
	}

	function makeElm(html) {
		const container = $CrE('div');
		container.innerHTML = html;
		return container.children[0];
	}

	function fadeIn(elm, time, callback) {
		elm.style.display = '';
		elm.style.opacity = '0';
		elm.style.transitionDuration = time.toString() + 'ms';
		elm.style.opacity = '1';
		setTimeout(e => {
			elm.style.opacity = '';
			typeof callback === 'function' && callback();
		}, time);
	}

	function fadeOut(elm, time, callback) {
		elm.style.display = '';
		elm.style.opacity = '1';
		elm.style.transitionDuration = time.toString() + 'ms';
		elm.style.opacity = '0';
		setTimeout(e => {
			elm.style.display = 'none';
			typeof callback === 'function' && callback();
		}, time);
	}
});