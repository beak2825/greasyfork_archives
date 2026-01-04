// ==UserScript==
// @name Stylus Fluent (Updated)
// @namespace typpi.online
// @version 2.2
// @description Stylus in Fluent style (like Windows 11)
// @author thejenja (Updated by Nick2bad4u)
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @include chrome-extension://clngdbkpkpeebahjckkjfobafhncgmne*/*
// @downloadURL https://update.greasyfork.org/scripts/520521/Stylus%20Fluent%20%28Updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/520521/Stylus%20Fluent%20%28Updated%29.meta.js
// ==/UserScript==

(function() {
let css = `
	body {
		font-family:
			Segoe UI Variable Text,
			Segoe UI,
			Helvetica Neue,
			Helvetica,
			Arial,
			sans-serif;
	}
	:root {
		/*Miscellaneous*/
		--c97: hsl(0deg 0% 8%);
		--c98: hsl(0deg 0% 10%);
		--c99: hsl(0deg 0% 15%);
		--c100: hsl(0deg 0% 10%);
		--name-padding-left: 0;
	}
	#header h1,
	#header #filters summary h2 {
		font-weight: 600;
		font-family:
			Segoe UI Variable Display,
			Segoe UI,
			Helvetica Neue,
			Helvetica,
			Verdana,
			sans-serif !important;
	}
	button {
		/*Manipulations stuff*/
		transition:
			background-color 0.25s,
			border-color 0.25s;
		border: 1px solid var(--c70);
		border-color: rgb(255 255 255 / 9%)
			rgb(255 255 255 / 7%) rgb(255 255 255 / 7%);
		border-radius: 4px;
		background-color: rgb(255 255 255 / 6.05%);
		/*Box model stuff*/
		padding: 6px 25px !important;
		color: var(--fg);
		font-style: normal;
		font-weight: 400;
		/*Typography stuff*/
		font-size: 14px;
	}
	.dirty #save-button,
	.dirty #save-button + button,
	#usw-publish-style {
		border-color: transparent;
		background: #3da8ff;
		color: #000;
	}
	input:not([type]),
	input[type='text'],
	input[type='number'],
	input[type='search'],
	textarea,
	input[type='url'],
	input[type='time'],
	#search,
	#manage\\.newUI\\.sort {
		/*Miscellaneous*/
		box-sizing: border-box;
		outline: 0;
		border: 1px solid;
		border-bottom-width: 2px;
		border-color: rgb(255 255 255 / 6.98%) !important;
		border-radius: 4px;
		background-color: rgb(255 255 255 / 6.05%) !important;
		padding-left: 10px;
		/*Box model stuff*/
		width: 100%;
		height: 32px;
		color: rgb(255 255 255 / 78.6%);
		font-style: normal;
		font-weight: 400;
		font-size: 12px;
		line-height: 32px;
		/*Typography stuff*/
		font-family:
			Segoe UI Variable Text,
			Segoe UI,
			Helvetica Neue,
			Helvetica,
			Verdana,
			Tahoma,
			Geneva,
			Arial,
			sans-serif;
	}
	input:not([type]):focus,
	input[type='text']:focus,
	input[type='number']:focus,
	input[type='search']:focus,
	input[type='url']:focus,
	input[type='time']:focus,
	#search:focus,
	#manage\\.newUI\\.sort:focus {
		outline: none;
		/*Miscellaneous*/
		box-shadow: none !important;
		/*Box model stuff*/
		border-color: rgb(255 255 255 / 6.98%);
		border-bottom: 2px solid #0076d6 !important;
		background-color: rgb(30 30 30 / 70%);
		/*Typography stuff*/
		color: #fff;
	}
	select {
		/*Miscellaneous*/
		box-sizing: border-box;
		outline: 0;
		border: 1px solid;
		border-bottom-width: 2px;
		border-color: rgb(255 255 255 / 6.98%) !important;
		border-radius: 4px;
		background-color: #363636 !important;
		padding-left: 10px;
		/*Box model stuff*/
		width: 100%;
		height: 32px;
		color: rgb(255 255 255 / 78.6%);
		font-style: normal;
		font-weight: 400;
		font-size: 12px;
		line-height: 32px;
		/*Typography stuff*/
		font-family:
			Segoe UI Variable Text,
			Segoe UI,
			Helvetica Neue,
			Helvetica,
			Verdana,
			Tahoma,
			Geneva,
			Arial,
			sans-serif;
	}
	input[type='checkbox']:not(.slider),
	input[type='radio'] {
		/*Display stuff*/
		flex: 0 0 20px !important;
		/*Miscellaneous*/
		vertical-align: middle;
		appearance: none;
		cursor: pointer;
		margin: 0 5px 3px;
		outline: 0;
		border: 0;
		background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='8.5' y='8.5' width='15' height='15' rx='1.5' stroke='%23ADADAD'/%3E%3C/svg%3E%0A");
		background-position: -6px -6px;
		background-color: transparent;
		/*Box model stuff*/
		width: 20px;
		height: 20px;
	}
	input[type='checkbox']:not(.slider):checked::after {
		/*Display stuff*/
		content: '';
	}
	input[type='radio'] {
		/*Box model stuff*/
		background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='7.5' stroke='%23ADADAD'/%3E%3C/svg%3E");
		background-position: -5px -6px;
	}
	input[type='checkbox']:not(.slider):checked {
		/*Box model stuff*/
		background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='8' y='8' width='16' height='16' rx='2' fill='%23479EF5'/%3E%3Cpath d='M19.765 13.2047C20.0661 13.4892 20.0797 13.9638 19.7953 14.265L15.5453 18.765C15.4061 18.9123 15.2133 18.997 15.0107 18.9999C14.8081 19.0028 14.6129 18.9236 14.4697 18.7803L12.2197 16.5303C11.9268 16.2374 11.9268 15.7626 12.2197 15.4697C12.5126 15.1768 12.9874 15.1768 13.2803 15.4697L14.9846 17.174L18.7047 13.235C18.9891 12.9339 19.4638 12.9203 19.765 13.2047Z' fill='%23242424'/%3E%3C/svg%3E");
		background-position: -6px -6px;
	}
	input[type='checkbox']:not(.slider):hover:checked {
		/*Box model stuff*/
		background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='8' y='8' width='16' height='16' rx='2' fill='%2362ABF5'/%3E%3Cpath d='M19.765 13.2047C20.0661 13.4892 20.0797 13.9638 19.7953 14.265L15.5453 18.765C15.4061 18.9123 15.2133 18.997 15.0107 18.9999C14.8081 19.0028 14.6129 18.9236 14.4697 18.7803L12.2197 16.5303C11.9268 16.2374 11.9268 15.7626 12.2197 15.4697C12.5126 15.1768 12.9874 15.1768 13.2803 15.4697L14.9846 17.174L18.7047 13.235C18.9891 12.9339 19.4638 12.9203 19.765 13.2047Z' fill='%23242424'/%3E%3C/svg%3E%0A");
		background-position: -6px -6px;
	}
	input[type='checkbox']:not(.slider):hover {
		/*Box model stuff*/
		background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='8.5' y='8.5' width='15' height='15' rx='1.5' stroke='%23BDBDBD'/%3E%3C/svg%3E");
		background-position: -6px -6px;
	}
	input[type='radio']:checked {
		/*Box model stuff*/
		background-image: url("data:image/svg+xml,%3Csvg width='33' height='32' viewBox='0 0 33 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 16C24 20.1421 20.6421 23.5 16.5 23.5C12.3579 23.5 9 20.1421 9 16C9 11.8579 12.3579 8.5 16.5 8.5C20.6421 8.5 24 11.8579 24 16Z' stroke='%23479EF5'/%3E%3Ccircle cx='16.5' cy='16' r='5' fill='%23479EF5'/%3E%3C/svg%3E%0A");
		background-position: -5px -6px;
	}
	input[type='radio']:checked:hover {
		/*Box model stuff*/
		background-image: url("data:image/svg+xml,%3Csvg width='33' height='32' viewBox='0 0 33 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 16C24 20.1421 20.6421 23.5 16.5 23.5C12.3579 23.5 9 20.1421 9 16C9 11.8579 12.3579 8.5 16.5 8.5C20.6421 8.5 24 11.8579 24 16Z' stroke='%2362ABF5'/%3E%3Ccircle cx='16.5' cy='16' r='5' fill='%2362ABF5'/%3E%3C/svg%3E%0A");
		background-position: -5px -6px;
	}
	input[type='radio']:hover {
		/*Box model stuff*/
		background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='7.5' stroke='%23BDBDBD'/%3E%3C/svg%3E%0A");
		background-position: -5px -6px;
	}
	input[type='radio']::after {
		/*Display stuff*/
		display: none;
	}
	#header-resizer::after,
	.resize-grip::after {
		/*Box model stuff*/
		border: 0;
	}
	#header-resizer {
		/*Box model stuff*/
		width: 0;
	}
	.resize-grip {
		/*Box model stuff*/
		height: 0;
	}
	#popup-options button,
	.edit-actions button {
		/*Box model stuff*/
		height: initial;
	}
	.filter-selection select,
	#header .filter-selection label {
		/*Box model stuff*/
		height: 30px;
	}
	.filter-selection .select-wrapper {
		/*Positioning stuff*/
		left: 40px;
	}
	#message-box {
		/*Miscellaneous*/
		backdrop-filter: blur(1px);
	}
	#message-box > div {
		/*Box model stuff*/
		border-radius: 8px;
	}
	#message-box-title {
		background-color: transparent;
		padding: 0.45rem 12px;
		/*Box model stuff*/
		min-height: 0;
		font-weight: 600;
		font-size: 18px;
		/*Typography stuff*/
		font-family:
			Segoe UI Variable Display,
			Segoe UI,
			Helvetica Neue,
			Helvetica,
			Verdana,
			sans-serif !important;
	}
	#message-box-title::before {
		/*Display stuff*/
		display: none;
	}
	.i-edit::after {
		/*Display stuff*/
		content: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10.5289 1.76386C11.5525 0.740171 13.2123 0.740172 14.236 1.76386C15.2596 2.78755 15.2596 4.44728 14.236 5.47097L13.4571 6.24979L9.75002 2.54269L10.5289 1.76386ZM9.04292 3.24979L2.65722 9.63549C2.28304 10.0097 2.01623 10.4775 1.88467 10.99L1.01571 14.3755C0.971767 14.5467 1.02148 14.7284 1.14646 14.8534C1.27144 14.9783 1.45312 15.028 1.62432 14.9841L5.00978 14.1151C5.52234 13.9836 5.99015 13.7168 6.36433 13.3426L12.75 6.9569L9.04292 3.24979Z' fill='%23878787'/%3E%3C/svg%3E%0A");
	}
	.i-config::after {
		/*Display stuff*/
		content: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.91099 7.38266C2.28028 6.24053 2.88863 5.19213 3.69133 4.30364C3.82707 4.15339 4.04002 4.09984 4.23069 4.16802L6.14897 4.85392C6.66905 5.03977 7.24131 4.76883 7.42716 4.24875C7.44544 4.19762 7.45952 4.14507 7.46925 4.09173L7.83471 2.08573C7.87104 1.88627 8.02422 1.7285 8.22251 1.6863C8.8027 1.5628 9.39758 1.5 10.0003 1.5C10.6026 1.5 11.1971 1.56273 11.7769 1.68607C11.9752 1.72824 12.1284 1.88591 12.1648 2.08529L12.5313 4.09165C12.6303 4.63497 13.1511 4.9951 13.6944 4.89601C13.7479 4.88627 13.8004 4.87219 13.8515 4.85395L15.7698 4.16802C15.9605 4.09984 16.1734 4.15339 16.3092 4.30364C17.1119 5.19213 17.7202 6.24053 18.0895 7.38266C18.1518 7.57534 18.0918 7.78658 17.9374 7.91764L16.3825 9.23773C15.9615 9.5952 15.9101 10.2263 16.2675 10.6473C16.3027 10.6887 16.3411 10.7271 16.3825 10.7623L17.9374 12.0824C18.0918 12.2134 18.1518 12.4247 18.0895 12.6173C17.7202 13.7595 17.1119 14.8079 16.3092 15.6964C16.1734 15.8466 15.9605 15.9002 15.7698 15.832L13.8515 15.1461C13.3315 14.9602 12.7592 15.2312 12.5733 15.7512C12.5551 15.8024 12.541 15.8549 12.5312 15.9085L12.1648 17.9147C12.1284 18.1141 11.9752 18.2718 11.7769 18.3139C11.1971 18.4373 10.6026 18.5 10.0003 18.5C9.39758 18.5 8.8027 18.4372 8.22251 18.3137C8.02422 18.2715 7.87104 18.1137 7.83471 17.9143L7.46926 15.9084C7.37018 15.365 6.8494 15.0049 6.30608 15.104C6.25265 15.1137 6.20011 15.1278 6.14906 15.1461L4.23069 15.832C4.04002 15.9002 3.82707 15.8466 3.69133 15.6964C2.88863 14.8079 2.28028 13.7595 1.91099 12.6173C1.84869 12.4247 1.90876 12.2134 2.06313 12.0824L3.61798 10.7623C4.03897 10.4048 4.09046 9.77373 3.73299 9.35274C3.69784 9.31135 3.65937 9.27288 3.618 9.23775L2.06313 7.91764C1.90876 7.78658 1.84869 7.57534 1.91099 7.38266ZM8.00026 10C8.00026 11.1046 8.89569 12 10.0003 12C11.1048 12 12.0003 11.1046 12.0003 10C12.0003 8.89543 11.1048 8 10.0003 8C8.89569 8 8.00026 8.89543 8.00026 10Z' fill='%23878787'/%3E%3C/svg%3E%0A");
	}
	.i-external::after {
		/*Display stuff*/
		content: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.25 4.5C5.2835 4.5 4.5 5.2835 4.5 6.25V13.75C4.5 14.7165 5.2835 15.5 6.25 15.5H13.75C14.7165 15.5 15.5 14.7165 15.5 13.75V11.75C15.5 11.3358 15.8358 11 16.25 11C16.6642 11 17 11.3358 17 11.75V13.75C17 15.5449 15.5449 17 13.75 17H6.25C4.45507 17 3 15.5449 3 13.75V6.25C3 4.45507 4.45507 3 6.25 3H8.25C8.66421 3 9 3.33579 9 3.75C9 4.16421 8.66421 4.5 8.25 4.5H6.25ZM10.5 3.75C10.5 3.33579 10.8358 3 11.25 3H16.25C16.6642 3 17 3.33579 17 3.75V8.75C17 9.16421 16.6642 9.5 16.25 9.5C15.8358 9.5 15.5 9.16421 15.5 8.75V5.56066L11.7803 9.28033C11.4874 9.57322 11.0126 9.57322 10.7197 9.28033C10.4268 8.98744 10.4268 8.51256 10.7197 8.21967L14.4393 4.5H11.25C10.8358 4.5 10.5 4.16421 10.5 3.75Z' fill='%23878787'/%3E%3C/svg%3E%0A");
	}
	.i-info::after {
		/*Display stuff*/
		content: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2ZM8.74905 5.50003C8.74905 5.91371 8.41369 6.24907 8.00001 6.24907C7.58633 6.24907 7.25098 5.91371 7.25098 5.50003C7.25098 5.08635 7.58633 4.751 8.00001 4.751C8.41369 4.751 8.74905 5.08635 8.74905 5.50003ZM8 7C8.27614 7 8.5 7.22386 8.5 7.5V10.5C8.5 10.7761 8.27614 11 8 11C7.72386 11 7.5 10.7761 7.5 10.5V7.5C7.5 7.22386 7.72386 7 8 7Z' fill='%23878787'/%3E%3C/svg%3E%0A");
	}
	.i-log::after {
		/*Display stuff*/
		content: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9.3712 2.02507C13.7759 1.67841 17.6276 4.96807 17.9742 9.37273C18.3209 13.7774 15.0312 17.6291 10.6265 17.9757C6.22189 18.3224 2.37019 15.0327 2.02353 10.6281C2.00122 10.3446 1.99495 10.04 2.00398 9.73892C2.01639 9.3249 2.36208 8.99932 2.77611 9.01173C3.19014 9.02414 3.51571 9.36984 3.5033 9.78387C3.49585 10.0325 3.50101 10.283 3.51891 10.5104C3.80056 14.0892 6.93007 16.762 10.5089 16.4804C14.0876 16.1987 16.7605 13.0692 16.4788 9.49042C16.1972 5.91164 13.0677 3.23879 9.48889 3.52044C7.75261 3.65709 6.18316 4.4709 5.07654 5.75512L4.873 6.003L6.75 6.00387L6.85177 6.01072C7.21785 6.06038 7.5 6.37417 7.5 6.75387C7.5 7.13356 7.21785 7.44736 6.85177 7.49702L6.75 7.50387H3.25186L3.15009 7.49702C2.81729 7.45187 2.55385 7.18844 2.50871 6.85564L2.50186 6.75387V2.75387L2.50871 2.6521C2.55385 2.3193 2.81729 2.05586 3.15009 2.01072L3.25186 2.00387L3.35363 2.01072C3.68643 2.05586 3.94987 2.3193 3.99501 2.6521L4.00186 2.75387L4.00066 4.70662C5.35856 3.16672 7.26656 2.1907 9.3712 2.02507ZM9.74887 6.00387L9.85064 6.01072C10.1834 6.05586 10.4469 6.3193 10.492 6.6521L10.4989 6.75387V9.9994L12.2489 10.0004L12.3506 10.0073C12.7167 10.0569 12.9989 10.3707 12.9989 10.7504C12.9989 11.1301 12.7167 11.4439 12.3506 11.4936L12.2489 11.5004H9.74887L9.6471 11.4936C9.3143 11.4484 9.05086 11.185 9.00572 10.8522L8.99887 10.7504V6.75387L9.00572 6.6521C9.05086 6.3193 9.3143 6.05586 9.6471 6.01072L9.74887 6.00387Z' fill='%23878787'/%3E%3C/svg%3E%0A");
	}
	.i-reorder::after {
		/*Display stuff*/
		content: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.75 17C6.98488 17 7.20201 16.8917 7.33931 16.7223L10.2807 13.7765C10.5731 13.4837 10.5731 13.0088 10.2807 12.7159C9.9882 12.423 9.51403 12.423 9.22157 12.7159L7.5 14.4336V3.75C7.5 3.33579 7.1636 3 6.75 3C6.3364 3 6 3.33579 6 3.75V14.4441L4.27843 12.7114C3.98597 12.4185 3.5118 12.4185 3.21934 12.7114C2.92689 13.0043 2.92688 13.4791 3.21934 13.772L6.2232 16.7803C6.37038 16.9277 6.55709 17.001 6.75 17ZM9.75 4C9.33579 4 9 4.33579 9 4.75C9 5.16421 9.33579 5.5 9.75 5.5H16.25C16.6642 5.5 17 5.16421 17 4.75C17 4.33579 16.6642 4 16.25 4H9.75ZM9.75 7C9.33579 7 9 7.33579 9 7.75C9 8.16421 9.33579 8.5 9.75 8.5H14.25C14.6642 8.5 15 8.16421 15 7.75C15 7.33579 14.6642 7 14.25 7H9.75ZM9.75 10C9.33579 10 9 10.3358 9 10.75C9 11.1642 9.33579 11.5 9.75 11.5H11.25C11.6642 11.5 12 11.1642 12 10.75C12 10.3358 11.6642 10 11.25 10H9.75Z' fill='%23ccc'/%3E%3C/svg%3E%0A");
	}
	button.icon::after {
		/*Display stuff*/
		content: '\\A0';
	}
	#message-box-buttons {
		background-color: transparent;
		/*Box model stuff*/
		padding: 0.45rem;
	}
	#header summary::marker {
		/*Display stuff*/
		content: '';
	}
	@media (width <= 850px) {
		#header .settings h2 {
			max-width: 10vw;
		}
		#header.sticky {
			box-shadow: none;
		}
	}
	#popup-iframe {
		margin: 10px;
		box-shadow: 0 0 30px #111;
		border-radius: 8px;
	}
	#manage\\.newUI\\.sort:focus {
		background-color: #222 !important;
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
