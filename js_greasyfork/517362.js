// ==UserScript==
// @name         New FMP Style
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.3beta
// @description  A script to inject re-style CSS classes for FMP
// @author       Haydar
// @match        https://footballmanagerproject.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=footballmanagerproject.com
// @grant        GM_addStyle
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/517362/New%20FMP%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/517362/New%20FMP%20Style.meta.js
// ==/UserScript==

GM_addStyle(`
    .sidenav-inner.py-1.ps > .sidebar-logo #img_sidelogo > .sidebar-logo.logo
    {
        filter: drop-shadow(0 0 1px #FFF);
    }

    .sidenav-inner.py-1.ps > .sidebar-logo .sidebar-logo
    {
        text-shadow: unset;
        color: #d4d4d4;
    }

    .sidenav-inner.py-1.ps > .sidebar-logo .sidebar-logo.cash
    {
        color: #ffcc33
    }

    .d-flex > .panel.header
    {
        background-color: #3338;
        color: #d4d4d4;
    }

    .d-flex > .panel.header > .lheader
    {
        color: #98c385;
    }

    .layout-container
    {
		position: relative;
		background-color: #216300; /* Fallback background color */
		overflow: hidden; /* Hide the edges of the pseudo-element */
	}

	.layout-container > *
	{
		z-index: 1;
	}

	.layout-container::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url('../images/grassbkg.png');
		opacity: 0.7; /* Optional: makes it look more clouded */
		z-index: 0; /* Keeps it behind the content */
	}

    .fmp-navbar-theme, .fmp-content
    {
        background-color: unset !important;
    }

    .fmpx.board.box
    {
        background-image: none;
        background-color: #FFF8;
        border-radius: 0;
        flex-basis: 33% !important;
        flex-grow: 1 !important;
    }

    td > div:not(.caption, .date, .sub, .sidebar-logo)
    {
        color: #333 !important;
    }

    .fmpx.board table
    {
        width: 100% !important;
    }

    .fmpx.board .structure-block
    {
        background-color: #FFF8;
        border-radius: 0;
        box-shadow: 0 0 4px #000;
        color: #333;
    }

    .fmpx.board table .fmp-icons:not(.sidenav-icon, .mail-icon)
    {
        color: #666666;
    }

    .fmpx.board>.title
    {
        border-bottom: 1px solid #333;
        font-weight: bold;
    }

    .fmpx.board>.title:not(:first-child)
    {
        margin-top: 12px;
    }

    .fmpx.board>.title>.section
    {
        color: #143f00;
    }

    .fmpx.board>.title>.main, .fmpx.board table .caption
    {
        color: #ffcc33;
    }

    .fmpx.board table .subtext
    {
        color: #686c6a;
    }

    .fmpx.board #matches-footer
    {
        display: flex;
        flex-wrap: nowrap;
    }

    #supportersItem, #last-matches, #homeLastNews, #team2Summary, #rankingItem
    {
        display: flex;
        flex-wrap: wrap;
    }

    #matches-footer button, #supportersItem > button, #last-matches button, .fmpx.board #homeLastNews button, .fmpx.board #rankingItem button
    {
        margin-top: 40px;
        flex-grow: 1;
        border-radius: 0;
        border: 0;
        background-color: #3A6D3E;
        color: #D4D4D4;
        box-shadow: 0 0 4px #000;
    }

    #team2Summary button
    {
        margin-top: 40px;
        flex-grow: 0.5;
        border-radius: 0;
        border: 0;
        background-color: #3A6D3E;
        color: #D4D4D4;
        box-shadow: 0 0 4px #000;
    }

    #homeLastNews > div, #homeLastNews > table, #homeLastNews > div > div
    {
        width: 100%;
        max-width: unset !important;
    }

    .fmpx.board .fixmatch
    {
        background-image: unset;
        flex: unset;
        flex-grow: 1;
        width: 100%;
    }

    .fmpx.board .fixmatch.won
    {
        background-color: #2caf30;
        background-image: linear-gradient(90deg, #333 33%, #2caf30, #333 66%);
    }

    .fmpx.board .fixmatch.lost
    {
        background-color: #e55353;
        background-image: linear-gradient(90deg, #333 33%, #e55353, #333 66%);
    }

    .fmpx.board .fixmatch.unpl
    {
        background-color: #4495f6;
        background-image: linear-gradient(90deg, #333 33%, #4495f6, #333 66%);
    }

    .fmpx.board .fixmatch.draw
    {
        background-color: #909ea5;
        background-image: linear-gradient(90deg, #333 33%, #909e50, #333 66%);
    }

	/* Table styling */
	.fmpx.board .list-table {
		width: 100%;
		border-collapse: collapse;
		font-family: Arial, sans-serif;
		color: #333;
		border: 1px solid #d4d4d4;
		box-shadow: 0 0 8px #333;
	}

	/* Header styling */
	#agenda thead th {
		background-color: #3A6D3E;
		color: #ffffff;
		padding: 12px 15px;
		font-weight: bold;
		border-bottom: 1px solid #d4d4d4;
	}

	#agenda thead th:first-child {
		border-bottom-color: #3A6D3E;
	}

	#agenda thead th:nth-child(2n)
	{
		background-color: #5A8D5E;
	}

	/* Row hover effect */
	#agenda tr:hover {
		background-color: rgba(200, 200, 200, 0.2);
	}

	/* Center-align certain columns */
	#agenda .center {
		text-align: center;
	}

	/* Styling for the date column */
	#agenda .hyellow > .center:first-child
	{
		background-color: #3A6D3E;
	}

	#agenda .date
	{
		width: 100%;
		border: 0;
		background-color: inherit;
		color: #D4D4D4 !important;
	}

	#agenda .date .weekday,
	#agenda .date .day,
	#agenda .date .hour {
		display: block;
		font-weight: bold;
	}

	#agenda .date .day {
		font-size: 24px;
	}

	#agenda .date .hour {
		font-size: 12px;
	}

	/* Icon styling in the event column */
	#agenda .event i {
		color: #216300;
	}

	/* Link styling in the details column */
	#agenda td a {
		display: block;
		width: 100%;
		height: 100%;
		color: #333;
		font-weight: bold;
		text-decoration: none;
	}

	#agenda td a:hover {
		color: #3A6D3E;
	}

	/* Background color for specific row types */
	.fmpx .list-table .hyellow {
		background-color: unset !important;
	}

	/* General cell styling */
	.fmpx .list-table .hyellow > td {
		padding: 4px 7px;
		vertical-align: middle;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		background-color: #dfdbda70;
	}

	.fmpx .list-table .hyellow > td:nth-child(2n) {
		background-color: #efebea70;
	}

	#agenda .table-row-won {
		background-color: #4CAF50;
		color: #ffffff;
	}

	#agenda .table-row-lost {
		background-color: #e57373;
		color: #ffffff;
	}

	#agenda .table-row-draw {
		background-color: #b0bec5;
		color: #333;
	}

	#agenda .table-row-nextmatch {
		background-color: #64b5f6;
		color: #ffffff;
	}

	/* Header styling for forum table */
	#lastIntPostsTable> thead, #lastNatPostsTable> thead
	{
		display: none;
	}

	/* Alternating header styling for better contrast */
	#lastIntPostsTable thead th:nth-child(2n), #lastNatPostsTable thead th:nth-child(2n) {
		background-color: #5A8D5E;
	}

	/* Row hover effect */
	#lastIntPostsTable tr:hover,#lastNatPostsTable tr:hover {
		background-color: rgba(200, 200, 200, 0.2);
		transition: background-color 0.3s ease;
	}

	/* Center-align specific columns */
	#lastIntPostsTable .center, #lastNatPostsTable .center {
		text-align: center;
	}

	/* Styling for date column */
	#lastIntPostsTable .date .weekday, #lastNatPostsTable .date .weekday {
		color: #d4d4d4;
		font-weight: bold;
	}

	#lastIntPostsTable .date, #lastNatPostsTable .date {
		background-color: #3E3E6D;
		border-radius: 7px 7px 0 0;
		border: 0;
		height: 14px;
		padding: 2px;
	}

	/* Logo styling */
	#lastIntPostsTable .logo, #lastNatPostsTable .logo {
		max-width: 30px;
		max-height: 30px;
		border-radius: 50%;
		display: inline-block;
		vertical-align: middle;
	}

	/* Team logo and name, Also date text */
	#lastIntPostsTable .shieldname > tr, #lastNatPostsTable .shieldname > tr{
		padding: 0;
		display: flex;
		flex-wrap: nowrap;
		flex-direction: column;
	}

	#lastIntPostsTable .shieldname td.logo.userTeams, #lastIntPostsTable .shieldname td.logo.small-shirt, #lastNatPostsTable .shieldname td.logo.userTeams, #lastNatPostsTable .shieldname td.logo.small-shirt {
		width: 100%;
		filter: drop-shadow(1px 1px 3px #000);
		border-radius: 0;
		max-width: unset;
		padding: 5px 0 0 !important;
		max-height: 35px;
	}

	#lastIntPostsTable .shieldname td.logo>img, #lastIntPostsTable .shieldname td.logo>.fmp-shields, #lastNatPostsTable .shieldname td.logo>img, #lastNatPostsTable .shieldname td.logo>.fmp-shields {

		border-radius: 0;
		margin: auto;
		max-height: 30px;
	}

	#lastIntPostsTable .shieldname td.logo>.fmp-shields.shield-back, #lastNatPostsTable .shieldname td.logo>.fmp-shields.shield-back
	{
		margin-right: -30px !important;
	}

	#lastIntPostsTable .shieldname td.logo>.fmp-shields.shield-stripes, #lastNatPostsTable .shieldname td.logo>.fmp-shields.shield-stripes
	{
		filter: unset;
	}

	#lastIntPostsTable .shieldname td.center.text, #lastNatPostsTable .shieldname td.center.text {
		width: 100%;
		padding: 0;
		padding-top: 3px !important;
		color: #555 !important;
		font-weight: bold;
	}

	#lastIntPostsTable tr.hbrown, #lastNatPostsTable tr.hbrown
	{
	   display: flex;
	   width: 100%;
	   flex-wrap: nowrap;
	   justify-content: space-between;
	}

	#lastIntPostsTable .hbrown>td.nopad, #lastNatPostsTable .hbrown>td.nopad
	{
		color: #333;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: space-between;
		width: 20%;
	}

	#lastIntPostsTable .hbrown>td.nopad>div, #lastNatPostsTable .hbrown>td.nopad>div
	{
		display: block;
	}


	#lastIntPostsTable td.left.text, #lastNatPostsTable td.left.text
	{
		border-width: 0 0 1px 1px;
		padding: 4px 10px;
		border-color: #0001;
		width: 80%;
	}

	/* Subject styling */
	#lastIntPostsTable td.left.text>span:first-child, #lastNatPostsTable td.left.text>span:first-child {
		color: #666 !important;
		font-weight: bold !important;
	}

	#lastIntPostsTable td.left.text>span, #lastNatPostsTable td.left.text>span {
		color: #3A6D3E;
	}

	/* Link styling in subject */
	#lastIntPostsTable td.left.text a, #lastNatPostsTable td.left.text a {
		color: #333;
		text-decoration: none;
	}

	#lastIntPostsTable td.left.text a:hover, #lastNatPostsTable td.left.text a:hover {
		color: #4C8F50;
	}

	/* Background color for specific row types */
	#lastIntPostsTable .hbrown, #lastNatPostsTable .hbrown {
		background-color: unset;
	}

	#lastIntPostsTable .hbrown > td, #lastNatPostsTable .hbrown > td {
		padding: 8px 12px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		background-color: #dfdbda70; /* Soft yellow for highlighted rows */
	}

	.d-flex> .footer
	{
	   background-color: #333;
	}

	.d-flex> .footer >.stdtxt
	{
	   color: #d4d4d4 !important;
	   font-weight: bold;
	   text-align: center;
	}

`);



(function() {
    'use strict';

    // Your code here...
})();