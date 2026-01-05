// ==UserScript==
// @name         Dark Imgur Scheme for IC (Complete Darkness mod)
// @namespace    IC Change
// @version      7.0 (mod 2.0)
// @description  Changes theme on Discourse IC to dark
// @author       MartynMage (Modifications by yoshiyoushaa with the assistance of IC )
// @include      http://community.imgur.com/*
// @include      https://community.imgur.com/*
// @run-at       document-end
// @grant        Nothing!
// @downloadURL https://update.greasyfork.org/scripts/20788/Dark%20Imgur%20Scheme%20for%20IC%20%28Complete%20Darkness%20mod%29.user.js
// @updateURL https://update.greasyfork.org/scripts/20788/Dark%20Imgur%20Scheme%20for%20IC%20%28Complete%20Darkness%20mod%29.meta.js
// ==/UserScript==


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


addGlobalStyle(`
/* All numbers */
.num span {
    color: 	#00b30c !important;
}
/* This overwrites our default number rule for medium hotness */
.num.heatmap-med span {color: #00e60f important;}
body .heatmap-med {color: #00e60f important;}

/* ... and for high hotness */
.num.heatmap-high span {color: #1aff29 !important;}
body .heatmap-high {color: #1aff29 !important;}
img.avatar.latest{
    border: 0 !important;
    box-shadow: none !important;}

/* Youshaa's Testings */
/* Box inside a box thing */
pre code {
	word-wrap: normal;
	display: block;
	padding: 5px 10px;
	color:#39C442;
	background: #f8f8f8;
	max-height: 500px;
}

/*user main dashboard*/
.user-main {
	background: #232323 !important;
}

/*new or updated topic*/
.alert.alert-info {
	background-color: #39C442;
}

/* HyperLink header */ 
aside.onebox header a[href] {
	color: #FFF;
	text-decoration: none;
}

body input[type="text"], body input[type="password"], body input[type="datetime"], body input[type="datetime-local"], body input[type="date"], body input[type="month"], body input[type="time"], body input[type="week"], body input[type="number"], body input[type="email"], body input[type="url"], body input[type="search"], body input[type="tel"], body input[type="color"] {
	background-color: #232323;
}

/* Boxes around Hyperlinks */
aside.onebox {
	border: 5px solid #000;
	padding: 12px 25px 12px 12px;
	font-size: 1em;
}
/*notification box*/
.user-menu .notifications li p {
	color: #f8f8f8;
}
.user-menu .notifications {
	background-color: #333333;
	color: #FFF;
}
aside.quote .title, aside.quote blockquote {
	background-color: #444;
}

aside.quote .title {
	border-left: 5px solid #e8e8e7;
	background-color: #f8f8f8;
	color: #f8f8f8;
	padding: 12px 12px 1px 12px;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
}


/*User Menu (notifications etc)*/
.user-menu .notifications li {background-color: #464646;}
.user-menu .notifications li:hover {background-color: #464646;}
.menu-panel ul.menu-links li a:hover, .menu-panel ul li.heading a:hover {background-color: #464646;}
.user-detail{-webkit-box-shadow: 0 2px 5px 0 #000,0 2px 10px 0 #000; -moz-box-shadow: 0 2px 5px 0 #000,0 2px 10px 0 #000; box-shadow: 0 1px 1px 0 #000,0 2px 10px 0 #000; background-color: #f8f8f8; color: #000; margin-top: 5px; padding-bottom: 15px; border-radius: 6px; padding: 5px;}
.user-menu .notifications li a {color: #f0f0f0}
.user-menu .notifications li a:hover {background-color: #222}
.user-menu .notifications li span {color: #39C442;}
.user-menu .notifications .read {background-color: #222;}
.menu-panel {
	background-color: #232323 !important;
	color: #222;
}
div.menu-links-header .fa, div.menu-links-header a {
	color: #39C442;
}
.menu-panel {
	border: 1px solid #434343;
	box-shadow: 0 2px 2px rgba(0,0,0,0.25);
	background-color: #fff;
	z-index: 1100;
	padding: 0.5em;
	width: 300px;
}

/*Badge colours*/
.menu-panel.drop-down .badge-wrapper.bullet span.badge-category {color: #39C442 !important;}
.list-controls .category-dropdown-menu .badge-wrapper.bullet span.badge-category {color: #39C442 !important;}
.title-wrapper .badge-wrapper.bullet span.badge-category {color: #f8f8f8 !important;}


.menu-panel ul.menu-links li a, .menu-panel ul li.heading a:visited {color: #39C442;}
.menu-panel ul.menu-links li a:hover {background-color: #666;} 

/* Hyperlink title*/
aside.onebox .onebox-body a[href] {
	color: #39C442;
	text-decoration: none;
}

/* Number inside reply count*/
.badge-notification.new-posts, .badge-notification.unread-posts {
	background-color: #39C442;
	color: #000;
}
/* categories */
/*days and weeks*/
.topic-list td {
	color: #39C442;
	font-size: 1em;
}

/*badge categories*/
.topic-list td > .badge-wrapper.bullet span.badge-category.clear-badge {
	color: #39C442 !important;
}
/*block quotes*/
blockquote {
	border-left: 5px solid #e8e8e7;
	background-color: #444;
	clear: both;
}

/*All on activity tab*/ 
.user-main .nav-stacked li > a.active {
	color: #F8F8F8;
	font-weight: bold;
	background-color: transparent;
}
.user-main .nav-stacked > li > a {
	padding: 8px 13px;
	color: #f8f8f8;
}
.badge-notification.new-posts, .badge-notification.unread-posts {
	background-color: #39C442;
	color: #f2f2f2;
}


/*greyed out box thingies*/
p > code, li > code, pre > code {
	color: #39C442;
	background: #f8f8f8;
}

/* Reply box in private messaging*/
/*background colour*/
#reply-control .wmd-controls .d-editor-input, #reply-control .wmd-controls .d-editor-preview {
	background-color: #333333;
}

#reply-control .contents .d-editor-input, #reply-control .contents .d-editor-preview {
	color: #f8f8f8 !important ;
}

.d-editor {
	border: 1px solid #444;
}

.d-editor-spacer {
	width: 1px;
	height: 20px;
	margin-right: 8px;
	margin-left: 5px;
	background-color: #444;
	display: inline-block;
	float: left;
}

#reply-control .contents .d-editor-preview {
	border: 1px dashed #345345;
	overflow: auto;
	visibility: visible;
	cursor: default;
}

#reply-control .d-editor-button-bar button {
	color: #39C442 !important;
}

body input, body textarea, body select {
	color: #f8f8f8 !important;
}

body select, body textarea {
	color: #222;
}


/*Text bar*/
#reply-control .d-editor-button-bar {
	background-color: #333333;
}
/*icons*/
.topic-map .avatars, .topic-map .links, .topic-map .information {
	color: #f8f8f8 !important;
}

.btn {
	border: none;
	color: #f8f8f8 !important;
	font-weight: normal;
	background: #434343 !important;
}

.d-editor-button-bar .btn {
	color: #222;
	background-color: #444 !important;
}

/*border*/
#reply-control .d-editor-button-bar {
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	margin: 0px;
	padding: 5px;
	border-bottom: 2px solid #39C442;
	height: 33px;
}
.d-editor-spacer {
	width: 1px;
	height: 20px;
	margin-right: 8px;
	margin-left: 5px;
	background-color: #39C442;
	display: inline-block;
	float: left;
}


/*abandon post*/
.bootbox.modal {
	position: fixed;
	top: 50%;
	left: 50%;
	z-index: 1050;
	overflow: auto;
	width: 610px;
	height: auto;
	margin: -250px 0 0 -305px;
	background-color: #222;
	border: 1px solid #111;
	box-shadow: 0 3px 7px rgba(0,0,0,0.8);
	background-clip: padding-box;
}

/*side scrolly number thingy*/

html {
	color: #f8f8f8 !important;
	font-family: Helvetica,Arial,sans-serif;
	font-size: 14px;
	line-height: 19px;
	direction: ltr;
}

/*activity tab text*/
.user-main .user-stream .excerpt {
	margin: 5px 0;
	font-size: 0.929em;
	word-wrap: break-word;
	color: #f8f8f8;
}

/*activity tab border*/
.user-main .user-stream .item {
	padding: 20px 8px 15px 8px;
	background-color: #333;
	border-bottom: 1px solid #000;
}

/*names in notification tab*/ 
.user-main .user-stream .notification p span {
	color: #39C442;
}

/*badge tab*/
.user-main .user-content {
	padding: 10px 8px;
	background-color: #343434;
	border: 1px solid #444444;
	margin-bottom: 10px;
	box-sizing: border-box;
}
/*badge font*/
.badge-card .badge-contents .badge-info {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 15px;
	color: #39C442;
}
/*badge icon*/
.badge-card .badge-contents .badge-icon {
	min-width: 90px;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #222222;
	font-size: 3em;
}
/*badge background colour*/
.badge-card.medium {
	-webkit-box-shadow: 0 2px 5px 0 #000,0 2px 10px 0 #000;
	-moz-box-shadow: 0 2px 5px 0 #000,0 2px 10px 0 #000;
	box-shadow: 0 1px 1px 0 #000,0 2px 10px 0 #000;
	background-color: #222222;
	color: #F90505;
	margin-top: 5px;
	border-radius: 6px;
}

/*stats title*/
.stats-title {
	color: #39C442;
}

/*stats boxes*/
.stats-section li {
	display: inline-block;
	padding: 10px 14px;
	margin: 0 5px 10px 0;
	background: #343434;
}
/*stats numbers*/
.stats-section .value {
	color: #39C442;
}
/*stats labels*/
.stats-section .label {
	color: #f8f8f8;
}
/*stats liney things*/
.top-sub-section li {
	border-left: #39C442 solid 2px;
	padding: 5px 8px;
	margin: 10px 0;
}

/*spambox*/
.modal-inner-container {
	max-width: 710px;
	margin: 0 auto;
	background-color: #222222;
	border: 1px solid #333333;
	box-shadow: 0 3px 7px rgba(0,0,0,0.8);
	background-clip: padding-box;
}

.modal .modal-body label {
	color: #f8f8f8 !important;
}
.modal-body {
	color: #f8f8f8;
}


/*Code of the Martynmage*/

/*Core Colours*/

html {background-color: #2b2b2b; color: #f8f8f8;}




/*Colours on Topic List*/
.topic-list > tbody > tr {color: #f8f8f8}
.topic-list > tbody > tr:nth-child(even) {background: #333;}
.topic-list > tbody > tr:nth-child(odd) {background: #222;}
.topic-list a{color: #f8f8f8;}
.topic-list a.title {color: #f8f8f8;}

/*Categories colour*/
.topic-list td {
	color: #39C442;
	font-size: 1em;
}
.topic-list.categories .category h3 a[href] {
	color: #FFF;
}

.topic-list.categories a.title {
	color: #39C442;
	font-size: 0.929em;
}

.topic-list.categories .category .category-description {
	color: #f8f8f8;
}
.badge-wrapper.bullet span.badge-category {
	color: #39C442 !important;
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
}

/*Rounded Corners*/
.topic-list:not(.categories){background-color: black; border-radius: 6px;}

.search-title .sort-by .select2-container {border: 1px solid #f8f8f8;}
.search-title .sort-by .select2-drop-active {border: 1px solid #f8f8f8;}


.d-editor-input {background-color: black; color: #222222;}



/*"view deleted replies"*/
.gap.jagged-border {min-width: 75%;	margin-left: 55px; border-radius: 6px;}



.user-detail{-webkit-box-shadow: 0 2px 5px 0 #000,0 2px 10px 0 #000; -moz-box-shadow: 0 2px 5px 0 #000,0 2px 10px 0 #000; box-shadow: 0 1px 1px 0 #000,0 2px 10px 0 #000; background-color: #f8f8f8; color: #000; margin-top: 5px; padding-bottom: 15px; border-radius: 6px; padding: 5px;}

/*Padding Colours*/
.topic-list>tbody>tr {border-bottom: 1px solid #39C442;}
.topic-list>tbody>tr:first-of-type {border-top: 3px solid #39C442;}
.topic-list>tbody>tr {border-bottom: 1px solid #39c442}




.topic-body{-webkit-box-shadow: 0 2px 5px 0 #000,0 2px 10px 0 #000; -moz-box-shadow: 0 2px 5px 0 #000,0 2px 10px 0 #222; box-shadow: 0 1px 1px 0 #000,0 2px 10px 0 #000; background-color: #000; color: #f8f8f8; margin-top: px; margin-bottom: 10px; padding-left: 20px; border-radius: 6px; padding-right: 25px;}

.topic-body {background-color: #222 !important; color: #f8f8f8;}

.topic-body {border-top: 1px solid #000;}
.topic-list>tbody>tr {border-bottom: 1px solid #333;}
.topic-list>tbody>tr:first-of-type {border-top: 3px solid #333;}
aside.quote .title , aside.quote blockquote{background-color: #333;}
blockquote {border-left: 5px solid #333;}
aside.quote .title {border-left: 5px solid #333; color: f8f8f8;}
.topic-list .sortable:hover {background-color: #333;}





/*Moderator Colour on Replies*/
.moderator .topic-body {background-color: #c3eec6;}


/*Button Colours*/
.btn {background: #333; color: #39C442;}
.btn-primary {background: #39C442; color: #2b2b2b;}
.btn:hover {color: #222; background: #39C442;}
.topic-map>.buttons>.btn:hover {color: #222; background: #ccc;}

.topic-map {
	margin: 20px 0 0 0;
	background: #222;
	border: 1px solid #444;
}
.topic-map section {
	border-top: 1px solid #444;
}
.topic-map h3 {
	margin-bottom: 4px;
	color: #f8f8f8;
	line-height: 23px;
	font-weight: normal;
	font-size: 1em;
}
.topic-map .map .number, .topic-map .map i {
	color: #39C442;
	font-size: 130%;
}
.topic-map h4 {
	margin: 1px 0 2px 0;
	font-weight: normal;
	font-size: 0.857em;
	line-height: 15px;
	color: #f8f8f8;
}
.badge-notification.clicks {
	background: #39C442;
	color: #f8f8f8;
}
.topic-map .buttons .btn {
	border: 0;
	padding: 0 23px;
	color: #39C442 !important;
	background: #f8f8f8;
	border-left: 1px solid #333;
	border-top: 1px solid #333;
}
.topic-map>.buttons>.btn {color: #222; background: #f8f8f8;}
button#create-topic.btn.btn-default {color: #39C442; background: #222;}
button#create-topic.btn.btn-default:hover {background: #39C442; color: #f8f8f8;}








.btn[href] {color: #f8f8f8;}
.admin-contents > .btn {background: #f8f8f8;}
.btn-small {background: #f8f8f8 !Important; color: #222 !important;}
#reply-control {color: #f8f8f8;}
#topic-footer-buttons p {color: #f8f8f8;}
nav.post-controls button.create:hover {color: #f8f8f8; background: #222;}



.btn[disabled], .btn.disabled {color: #000;}
div.poll .poll-buttons button {background-color: #f0f0f0; color: #222;}

/*User "title"*/
.names .new_user a, .names .user-title, .names .user-title a {color: #f8f8f8;}














/*.queued-posts .queued-post .names span a {color: #f8f8f8;}
.queued-posts .queued-post .post-title {color: #f8f8f8;}*/







/*Button cleanup*/
.user-main .user-stream .btn {background: #EBEBEB; color: #222}
.user-archive .btn {background: #EBEBEB; color: #222}
.user-main .nav-pills a {color: #f8f8f8; background-color: #333;}
.d-editor-button-bar .btn {
	color: #222;
	background-color: #444 !important;
}
.form-horizontal .controls .btn {background: #EBEBEB; color: #222}

.names span a {color: #f8f8f8;}
nav.post-controls button.create {color: #f8f8f8; background: #39C442;}
nav.post-controls > button.like.d-hover {color: #222; background: #39C442;}
.badge-notification.new-topic {color: #39C442;}
aside.quote .title , aside.quote blockquote{background-color: #333333;}
code{background-color: #333333 !important;}
.select2-drop {
	background: #323232;
} 
.category-combobox .category-desc, .select2-drop .category-desc {
	color: #f8f8f8;
	font-size: 0.857em;
	line-height: 16px;
}
.category-combobox .topic-count, .select2-drop .topic-count {
	font-size: 11px;
	color: #f8f8f8;
	display: inline-block;
}
.select2-results .select2-highlighted {
	background: #174f1b;
	color: #f8f8f8;
}
.category-combobox .highlighted .topic-count, .category-combobox .select2-highlighted .category-desc, .select2-drop .highlighted .topic-count, .select2-drop .select2-highlighted .category-desc {
	color: #f8f8f8;
}
.select2-results .select2-no-results, .select2-results .select2-searching, .select2-results .select2-selection-limit {
	color: #f8f8f8;
}
.select2-results .select2-no-results, .select2-results .select2-searching, .select2-results .select2-selection-limit {
	background: #333;
	display: list-item;
	padding-left: 5px;
}

.topic-list.categories > tbody > tr:nth-child(2n) {
	background-color: #333;
}
.alert.alert-info.clickable {
	color: #f8f8f8;
}
}
/* This overwrites our default number rule for medium hotness */
.num.heatmap-med span {color: #00e60f important;}

body .heatmap-med {
	color: #00e60f  !important;
}

/* ... and for high hotness */
.num.heatmap-high span {color: #1aff29 !important;}

/*boo*/
body .heatmap-med {
	color: #1aff29  !important;
}


img.avatar.latest{
    border: 0 !important;
    box-shadow: none !important;}


`
              
              
              
              
              
              
              
              );