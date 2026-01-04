// ==UserScript==
// @name [theme] kalcho
// @namespace github.com/openstyles/stylus
// @version 0.2.0
// @description A new userstyle
// @author Me
// @grant GM_addStyle
// @run-at document-start
// @match *://*.kalcho.com.mx/*
// @downloadURL https://update.greasyfork.org/scripts/470483/%5Btheme%5D%20kalcho.user.js
// @updateURL https://update.greasyfork.org/scripts/470483/%5Btheme%5D%20kalcho.meta.js
// ==/UserScript==

(function() {
let css = `
	body.full {
		background: #345;
		padding-top: 0em;
		color:  #ccc;
	}
	.navbar-fixed-top {
		position: static;
	}
	body.full .list-group a.list-group-item,
	body.full .nav-tabs > li > a,
	body.full .nav-tabs {
		border-color: #fff3;
	}
	body.full .list-group a.list-group-item,
	body.full .nav-tabs > li > a {
		background: #0003;
		cursor: pointer;
	}
	body.full .nav-tabs > li > a:focus,
	body.full .nav-tabs > li > a:hover,
	body.full .nav-tabs > li.active > a {
		background: transparent;
		color:  #ccc;
		border-color: #fff6;
		border-bottom-color: #0006;
	}

	/** Tables */
	body.full table.xnj-table,
	body.full table.table {
		background: #fff2;
		margin: 0 0 2em;
		width:  auto;
		border: solid 2px #fff1;
	}
	body.full table.xnj-table caption,
	body.full table.table     caption {
		color: inherit;
	}
	body.full .xnj-table >tbody> tr:nth-child(odd),
	body.full .table     >tbody> tr:nth-child(odd) {
		background: #0001;
	}
	tr[style="background-color:#ffe7e1;"] {
		background: #fff2  !important;
		font-style: italic;
	}
	x	tr[style="background-color:#ffe7e1;"]:nth-child(odd) {
		background: #0001  !important;
	}
	body.full .xnj-table tr>*,
	body.full .table     tr>* {
		padding:  .25em .75em;
		border: solid #fff2;
		border-width: 1px 0;
	}
	body.full .table     td[colspan]:first-child:last-child,
	body.full .xnj-table th,
	body.full .table     th {
		text-align: center;
		background: #0003;
		padding:  .5em 1em;

		background: #424e59;
		position: sticky;
		top:  -1px;
	}
	body.full .table tbody td {
		padding:  .5em 2em;
	}
	body.full .xnj-table tbody th,
	body.full .table     tbody th {
		top:  calc(2.5em - 3px);
	}

	.xnj-positions td:not(:nth-child(2)) {
		text-align: right;
	}

	.xnj-summary td:nth-child(-n+3) {
		text-align: center;
	}
	.xnj-summary td:nth-child(7),
	.xnj-summary td:nth-child(4) {
		text-align: right;
	}

	/** "Favorite" teams */
	table.table td[data-fav] {
		text-align: left;
	}
	x	body.full table.xnj-table tr.xnj-has-fav,
	body.full table.table     tr.xnj-has-fav {
		background: #abc2;
	}
	table.table td[data-fav] a::before {
		content:  '\\2610';
		margin-left: -2.5ex;
		float: left;
		line-height:  .75;
		font-weight:  800;
		font-size:  150%;
	}
	table.table td[data-fav="1"] a::before {
		content: '\\2611';
	}

	.xnj-fav.xnj-home::before,
	.xnj-fav.xnj-away::after {
		content:  attr(title);
		font-weight:  400;
		font-size:  smaller;
		margin: 0 1ex 0 -1ex;
		float:  left;
		color:  #ddd;
	}
	.xnj-fav.xnj-away::after {
		margin: 0 -1ex 0 1ex;
		float:  right;
	}

	body.full a,
	td.xnj-fav {
		font-weight:  600;
		color:  #bde;
	}
	.body-full table.table >tbody> tr.xnj-has-fav {
		background-color: #9cf3;
		color:  #bde;
	}

	/** Scores & results */
	.xnj-score {
		text-align: center;
	}
	.xnj-score.gols {
		background: #0002;
	}
	.xnj-score.putz {
		background: #0006;
	}

	.xnj-won {
		font-weight:  800;
		color:  #eee;
	}
	.xnj-lost {
		font-weight:  200;
	}
	.xnj-draw {
		font-style: italic;
	}

	img[style="width:30px;height:30px;"] {
		max-height: 1.5em;
		width:  auto  !important;
		opacity:  .25;
	}

	/** Annoying elements */
	body.full .list-group-header { background:#0006!important; color:inherit!important; }
	body.full .list-group.panel {
		background: transparent;
		opacity:  .5;
	}
	.whiteTextOverride,
	.fondo,
	.img-responsive-footer,
	.navbar-header,
	img.banner {
		display:  none;
	}



	.collapse:first-of-type {
		display: unset;
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
