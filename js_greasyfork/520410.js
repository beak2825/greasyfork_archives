// ==UserScript==
// @name         Even better Archive of Our Own Darkmode
// @namespace    https://greasyfork.org/en/users/1409385
// @version      2025-07-30
// @description  A better version of "Archive of Our Own: Dark Mode" by Automalix
// @author       laskdfhlsajdfl
// @match        https://archiveofourown.org/*
// @match        http://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520410/Even%20better%20Archive%20of%20Our%20Own%20Darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/520410/Even%20better%20Archive%20of%20Our%20Own%20Darkmode.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
    	return
    }

    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style)
}

addGlobalStyle(`
body, .listbox > .heading, .listbox .heading a:visited, .filters .expander, .dropdown, input, input:focus, textarea, textarea:focus, .notice{
	color:#EEE;
    background-color: #000;
}
div.userstuff.module {
    color: #ccc;
    background:#111;
}
#workskin {
    padding: 0;
}
a, a:link, a:visited:hover {
	color:#EEEEEE
}
a:visited {
	color:#DDDDDD
}
a.tag {
	color:#EFEFEF
}
#modal {
	border:10px solid #000;
	background:#222
}
#login.dropdown{
    background:#222;
    float: inherit
}
#header a{
    background-color:#101010;
    color: #eee
}
#dashboard a {
    background-color: #222;
    color: #999;
}
#dashboard a:hover {
    background-color: #333;
    color: #a88;
}
#header .primary{
    background: none;
    background-color: #333
}
#header .primary a{
    background: none;
}
#header a:hover {
    background: none !important;
}
#header .dropdown:hover a{
    background: #222;
    color: #bbb !important;
}
.meta dt, .meta dd, .title, .preface, .module, p.kudos, form dd, label, .comment, p.note, .userstuff {
    color: #eee
}
.secondary {
    background-color: #000
}
.comment h4.byline {
    background: none
}
.thread .even {
    background: #080808
}
#footer {
    background: #202020
}
.icon[src="/images/skins/iconsets/default/icon_user.png"] {
    filter: invert()
}
.comment div.icon {
    border-bottom: none
}
li.relationships a {
	background:#000
}
#symbols-key, .account.module, .work {
	background-color:#222 !important;
}
#header {
	background:#101010
}
#footer{
	border:none
}
#new_work_search, #outer, #main {
	background:#050505
}
.wrapper {
	box-shadow: 1px 1px 5px #202020;
}
.work.meta.group {
	background: #121212;
	border:1px solid #111
}
fieldset, .listbox, fieldset fieldset.listbox {
	background-color:#222;
	box-shadow: inset 1px 0 5px #202020;
	border: 2px solid #000000
}
.listbox .index {
	background:#333;
	box-shadow:inset 1px 1px 3px #222
}
.actions a, .actions a:link, .action, .action:link, .actions input, input[type="submit"], button, .current, .actions label{
	background-image:none;
	background:#666;
	color:#FFF;
	border:none
}
#site_search {
	background:#000
}
form.verbose legend, .verbose form legend {
	background:#121212;
	border:2px solid #000;
	box-shadow:none
}
#admin-banner {
	display:none
}
`);
