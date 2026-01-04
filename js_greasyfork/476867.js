// ==UserScript==
// @name        Dark Mode - OSRS Portal Shooting Stars Tracker
// @match       https://osrsportal.com/shooting-stars-tracker
// @grant       GM_addStyle
// @version     0.3
// @author      VS-W
// @license     MIT
// @description Dark mode for the shooting stars tracker page on OSRS Portal.
// @namespace   https://greasyfork.org/users/1190083
// @downloadURL https://update.greasyfork.org/scripts/476867/Dark%20Mode%20-%20OSRS%20Portal%20Shooting%20Stars%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/476867/Dark%20Mode%20-%20OSRS%20Portal%20Shooting%20Stars%20Tracker.meta.js
// ==/UserScript==

GM_addStyle(`
	body {
		background-color: #111;
		color: #ddd;
		font-family: 'RScape';
		padding: 0;
		margin: 0;
	}
	h3 {
		font-family: 'RScape';
		font-size: 1.8em;
	}
	#stars-track {
		margin-bottom: -50px;
	}
	#nnn, .toollink, .toollink:hover {
		color: #ddd;
		font-size: 1.5em;
	}
	.bmac-btn {
		margin-top: 0px;
		margin-bottom: 0px;
	}
	.MuiCheckbox-root {
		color: rgba(255, 255, 255, 0.54);
	}
	.styled-table th, .styledd-table th {
		border: 1px #ddd solid;
	}
	.styled-table th, .styled-table td, .styledd-table th, .styledd-table td {
		padding: .2em .8em;
		font-size: 1.5em;
	}
	.styled-table tbody tr:nth-of-type(2n), .styledd-table tbody tr:nth-of-type(2n){
		background-color: #222;
	}
	.styled-table thead tr , .styledd-table thead tr {
		background-color: #000;
		font-weight: bold;
	}
	.styled-table tbody tr, .styledd-table tbody tr {
		border-bottom: 1px solid #ccc;
	}
	.styled-table tbody tr td:nth-of-type(1), .styledd-table tbody tr td:nth-of-type(1) {
		border-left: 1px solid #ccc;
	}
	.styled-table tbody tr td:nth-of-type(6), .styledd-table tbody tr td:nth-of-type(6) {
		border-right: 1px solid #ccc;
	}
	.styled-table tbody tr:last-of-type, .styledd-table tbody tr:last-of-type {
		border-bottom: 1px solid #ccc;
	}
	.styled-table tbody tr td:nth-of-type(5), .styledd-table tbody tr td:nth-of-type(5) {
		text-align: center;
	}
` );
