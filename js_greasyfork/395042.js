// ==UserScript==
// @name sekurak.pl - ciemny wygląd
// @namespace https://greasyfork.org/pl/users/124677-pabli
// @version 1.2.1
// @description Zmienia kolor portalu na ciemny
// @author Pabli (https://github.com/pabli24)
// @homepageURL https://github.com/pabli24/Sekurak-Dark
// @supportURL https://github.com/pabli24/Sekurak-Dark/issues
// @license CC-BY-NC-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.sekurak.pl/*
// @match *://*.sklep.sekurak.pl/*
// @downloadURL https://update.greasyfork.org/scripts/395042/sekurakpl%20-%20ciemny%20wygl%C4%85d.user.js
// @updateURL https://update.greasyfork.org/scripts/395042/sekurakpl%20-%20ciemny%20wygl%C4%85d.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "sekurak.pl" || location.hostname.endsWith(".sekurak.pl"))) {
		css += `
		:root {
			color-scheme: dark;
		}
		html, body, input, textarea, select, button {
			background-color: #0e0e0e !important;
			color: #eaeaea !important;
		}
		header#header {
			background-color: #0e0e0e !important;
		}
		header#header nav {
			background: #232323 !important;
		}
		a.text2link, header#header nav ul li a, .postTitle a, .meta a, .commentlist .comment-author a, #sidebar a {
			color: #b9b9b9 !important;
		}
		header#header nav ul li a {
			border-right: 2px solid #b9b9b9 !important;
		}
		header#header .nav-wrapper {
			background: none !important;
		}
		.text-adv {
			background: rgba(255, 0, 0, 0.05) !important;
			color: #fff !important;
		}
		.boxGreen {
			background-color: #080b02 !important;
			border: 1px solid #26360c !important;
		}
		.boxBlue {
			background-color: #0e161c !important;
			border: 1px solid #1b2e41 !important;
		}
		.boxRed {
			background-color: #240f06 !important;
			border: 1px solid #3d1401 !important;
		}
		.boxGrey {
			background: #222222 !important;
			border: 1px solid #454545 !important;
		}
		.widgetTitle {
			color: #d14448 !important;
			background: #232323 !important;
			padding: 10px !important;
		}
		.widget .textwidget {
			background-color: #131313 !important;
			padding: 10px !important;
		}
		.widget ul {
			background-color: #131313 !important;
		}
		.widget ul li {
			border-bottom: 1px solid #222 !important;
			padding: 10px !important;
		}
		hr {
			border-top: 1px solid #222 !important;
		}
		input, textarea, select {
			border: 1px solid #222 !important;
			padding: 4px !important;
		}
		input[type="submit"] {
			color: #fff !important;
			background: #444 !important;
			border: 1px solid #444 !important;
			padding: 4px 10px !important;
		}
		.entry h2 {
			border-bottom: 1px solid #242424 !important;
		}
		footer#footer {
			background: #000 !important;
		}
		#content #ppc-box .ppc-box .ppc h3 {
			background: #232323 !important;
		}
		#content #ppc-box .ppc-box .ppc {
			border: 1px solid #222 !important;
			background: #131313 !important;
		}
		#content #ppc-box .ppc-box .ppc ul li a {
			color: #ccc !important;
		}
		body .wp-pagenavi a {
			background: #151515 !important;
		}
		body .wp-pagenavi .current {
			background: #333 !important;
		}
		blockquote {
			background-color: #151515 !important;
			border: 1px solid #242424 !important;
		}
		.commentlist li {
			background: #111111 !important;
		}
		.commentlist .comment-body {
			background: #111 !important;
			border: 1px solid #111 !important;
		}
		.commentlist .byuser .comment-body {
			background: #0e0e0e !important;
			border: 1px solid #222 !important;
		}
		.commentlist .comment-author, a.text2link, header#header nav ul li a, .postTitle a, .meta a, .commentlist .comment-author a, #sidebar a {
			color: #fff !important;
		}
		.comment-reply-link {
			background: #202020 !important;
			color: #eaeaea !important;
			border: 1px solid #222 !important;
		}
		.comment-reply-link:hover {
			background: #353535 !important;
		}
		.meta {
			border-top: 1px solid #d14448 !important;
		}
		a, #sidebar h1, #sidebar h2, #sidebar h3, #sidebar h4 {
			color: #d14448 !important;
		}
		a:hover {
			color: #fff !important;
		}
		.wp-caption {
			border: 1px solid #222 !important;
			background-color: #131313 !important;
		}
		.sekuraktable tbody tr:nth-child(odd) {
			background-color: #151515 !important;
		}

		#s {
			color: #fff !important;
			border: none !important;
		}
		.searchBox {
			border: 1px solid #222 !important;
			background: #0e0e0e !important;
		}
		#searchsubmit {
			background: #444 url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSIyNSIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBzdHlsZT0iZmlsbDojZmZmOyIgZD0iTTIzLjExMSAyMC4wNThsLTQuOTc3LTQuOTc3Yy45NjUtMS41MiAxLjUyMy0zLjMyMiAxLjUyMy01LjI1MSAwLTUuNDItNC40MDktOS44My05LjgyOS05LjgzLTUuNDIgMC05LjgyOCA0LjQxLTkuODI4IDkuODNzNC40MDggOS44MyA5LjgyOSA5LjgzYzEuODM0IDAgMy41NTItLjUwNSA1LjAyMi0xLjM4M2w1LjAyMSA1LjAyMWMyLjE0NCAyLjE0MSA1LjM4NC0xLjA5NiAzLjIzOS0zLjI0em0tMjAuMDY0LTEwLjIyOGMwLTMuNzM5IDMuMDQzLTYuNzgyIDYuNzgyLTYuNzgyczYuNzgyIDMuMDQyIDYuNzgyIDYuNzgyLTMuMDQzIDYuNzgyLTYuNzgyIDYuNzgyLTYuNzgyLTMuMDQzLTYuNzgyLTYuNzgyem0yLjAxLTEuNzY0YzEuOTg0LTQuNTk5IDguNjY0LTQuMDY2IDkuOTIyLjc0OS0yLjUzNC0yLjk3NC02Ljk5My0zLjI5NC05LjkyMi0uNzQ5eiIvPjwvc3ZnPg==") 7px 7px no-repeat !important;
			width: 40px !important;
		}
		#header .searchBox::after {
			content: '';
			background: none;
			position: absolute;
			bottom: -11px;
			width: 0;
			height: 0;
			border-style: solid;
			border-width: 0 30px 10px 0;
			border-color: transparent #444 transparent transparent;
		}

		[src*="https://www.facebook.com/plugins/like.php?action=like"] {
			filter: invert(1) hue-rotate(170deg);
		}

		.spinner {
			background-color: #fff !important;
		}
		.switch-theme .label .ball {
			background-color: #555 !important;
		}
		.switch-theme .label {
			background-color: #000 !important;
		}
		.switch-theme svg {
			fill: #000;
		}
		.callout-box {
			background-color: #1a0d0d !important;
			border: 1px solid #d4474c !important;
			box-shadow: 0 4px 30px rgba(0, 0, 0, .6) !important;
		}

		/* quiz.sekurak.pl */
		:root {
			--bs-body-bg: #0e0e0e;
		}
		.boxes-container, .box-pytania-i-odpowiedzi {
			border: 1px solid #0e0e0e;
			background: rgba(255, 255, 255, .01);
		}

		`;
}
if ((location.hostname === "sklep.sekurak.pl" || location.hostname.endsWith(".sklep.sekurak.pl"))) {
		css += `

		a, h1, h2, h3, h4, .b-box .price {
			color: #d14448;
		}
		.breadcrumb {
			background-color: #232323;
		}
		.breadcrumb-item.active, .form-header, .b-box .title {
			color: #fff;
		}
		.b-box {
			background-color: #131313;
		}
		.form-control, .form-control:focus {
			background-color: #0e0e0e;
			border: 1px solid #222;
			color: #fff;
		}
		.card, .list-group-item {
			background-color: #0e0e0e;
			border: none;
		}

		`;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
