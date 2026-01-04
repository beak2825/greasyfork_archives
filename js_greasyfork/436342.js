// ==UserScript==
// @name         Subscene Language Filter
// @namespace    https://greasyfork.org/en/users/175554-reissfeld
// @version      1.1
// @description  Filter Your Language in Subscene
// @author       Reissfeld
// @match        https://subscene.com/*
// @match        https://u.subscene.com/*
// @icon         https://www.google.com/s2/favicons?domain=subscene.com
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
/* globals $, GM_config */
// @downloadURL https://update.greasyfork.org/scripts/436342/Subscene%20Language%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/436342/Subscene%20Language%20Filter.meta.js
// ==/UserScript==
'use strict';
var darkm = `body {
	background-image: none;
	background-color: #111;
	color: #aaa;
	border-bottom: 130px solid #111
}

#logo em {
	background: url("/content/images/logo-dark.gif") no-repeat scroll 0 0 transparent
}

#search .text {
	border-color: #222628 #333 #222628 #333;
	background-color: #000;
	color: #eee
}

#user-navigation,
#forum-navigation,
#admin-navigation {
	background: #000
}

hr {
	border-top: 1px solid #444
}

.poster {
	min-width: 106px;
	min-height: 132px;
	background: #000;
	border: solid 1px #222
}

.content {
	border-top: 0
}

.subtitles table {
	background-color: #000;
	width: 100%
}

.subtitles thead {
	background: #000;
	color: #eee
}

.subtitles td.a1 a:visited,
.subtitles td.a1 .visited {
	background-color: #333;
	color: #999
}

.subtitles td.a1 a:link {
	display: block;
	background-color: #000;
	color: #999
}

.subtitles td.a1 a:hover {
	background-color: #333;
	cursor: pointer
}

.byFilm .rating-guide span.visited {
	background: #333;
	border: 2px solid #000
}

.byFilm .sort-by {
	background-color: #333;
	border: 1px solid #000;
	color: #999
}

.subtitle .comment {
	-moz-box-shadow: inset -1px -2px 5px #333;
	-webkit-box-shadow: inset 1px 2px 5px #333;
	box-shadow: inset -1px -2px 5px #333;
	background: #000;
	color: #ccc
}

.subtitle .comment:before {
	background: none
}

.subtitles td a {
	color: #00599e
}

.subtitles td a:hover {
	color: #0090ff
}

.subtitles td.a41 {
	background: url('/content/images/icon-hearing-impaired-dark.png') no-repeat 0 5px
}

.window {
	background: #062433;
	border-top: 1px solid #333
}

.bread a,
.bread a:visited {
	color: #00599e
}

a,
a:link {
	color: #00599e;
	text-decoration: none;
	cursor: pointer
}

a:visited {
	color: #00599e
}

a:hover {
	color: #0090ff
}

.pagination>li>a,
.pagination>li>span {
	background-color: #000;
	border: 1px solid #444
}

.pagination>.disabled>a,
.pagination>.disabled>a:focus,
.pagination>.disabled>a:hover,
.pagination>.disabled>span,
.pagination>.disabled>span:focus,
.pagination>.disabled>span:hover {
	background-color: #000;
	border-color: #444;
	color: #777
}

.pagination>li>a:hover,
.pagination>li>span:hover,
.pagination>li>a:focus,
.pagination>li>span:focus {
	background-color: #444
}

.pagination>.active>a,
.pagination>.active>span,
.pagination>.active>a:hover,
.pagination>.active>span:hover,
.pagination>.active>a:focus,
.pagination>.active>span:focus {
	color: #dedede;
	background-color: #000
}

.btn-default {
	color: #333;
	background-color: #aaa;
	border-color: #555
}

.btn-default:hover {
	background-color: #e6e6e6;
	border-color: #000
}

.dropdown-menu {
	background-color: #aaa;
	border: 1px solid #555;
	border: 1px solid rgba(0, 0, 0, .15)
}

.nav>li>a:hover,
.nav>li>a:focus {
	background-color: #333
}

.panel-default {
	border-color: #ddd
}

.panel {
	background-color: #000;
	border: 1px solid #333;
	-webkit-box-shadow: none;
	box-shadow: none
}

.form-control {
	color: #dedede;
	background-color: #000;
	border: 1px solid #444
}

.sand-box {
	background-color: #000
}

.sand-box>ul>li,
.sand-box .area {
	background-color: #222;
	border-bottom: 1px solid #000
}

#messageCount.badge {
	background-color: #000
}

.my-recent-messages {
	background-color: #000
}

.message-view {
	background-color: #000
}

.message-view .list-group-item-sender {
	background-color: #222
}

.list-group-item {
	background-color: #000;
	border: 1px solid #444
}

.ratings ul {
	background-color: #000
}

.ratings ul>li {
	background-color: #222;
	border-bottom: 1px solid #000
}

.user-home .subtitles .list {
	background-color: #000
}

.user-home .subtitles ul>li,
.user-home .footer {
	background-color: #222;
	border-bottom: 1px solid #000
}

.posts .post {
	-moz-box-shadow: none;
	-webkit-box-shadow: none;
	box-shadow: none;
	border: 1px solid #333;
	color: #dedede;
	background: #000
}

.posts .post:before {
	background: none
}

footer {
	background: #000
}

.sustain {
	border-bottom: solid 1px #444
}
.byTitle .search-result{
    background-color: #3e351f !important;
}`
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    style.setAttribute('class','gelap')
    head.appendChild(style);
}
GM_config.init(
    {
        'id': 'Aturan',
        'title': 'Settings',
        'frameStyle': {
                width: '480px'
        },
        'fields': {
            'Filter': {
                'label': 'Language to Filter (Case Sensitive)',
                'type': 'text'
            },
            'DarkRadio': {
                'label': ' Dark Mode',
                'type': 'radio',
                'options': ['Yes','No'],
                'default': 'No'
            },
            'DarkEdit': {
                'type': 'textarea',
                'default': darkm
            }
        },
        'events': {
            'save': simpan,
            'close': tutup,
            'reset': function() { alert('Save & Close after Resetting'); }
        },
        'css': '#Aturan_field_DarkEdit{margin: 0px 0px 0px 0px;width: 100%;height: 50%;}'
    }
)
function simpan() {
    jalan()
    modegelap()
}
function pengaturan(){
    GM_config.open()
}
function tutup(){
    jalan()
    modegelap()
}
GM_registerMenuCommand('Add Filter', pengaturan);

function modegelap(){
    if(GM_config.get('DarkRadio') == 'Yes'){
        addGlobalStyle(GM_config.get('DarkEdit'))
    }else{
        document.querySelector('.gelap').remove()
    }
}
modegelap()
function jalan(){
    var lang = document.querySelectorAll('.l.r')
    var langstart = document.querySelectorAll('.language-start')
    for(let i = 0; i < lang.length; i++){
        if(langstart.length > i){
             langstart[i].parentElement.style = 'display:none;'
        }
        if(!lang[i].innerText.includes(GM_config.get('Filter'))){
            lang[i].parentElement.parentElement.parentElement.style = 'display:none;'

        }
        if(lang[i].innerText.includes(GM_config.get('Filter'))){
            lang[i].parentElement.parentElement.parentElement.style = 'display:table-row;'
        }
    }
}
window.addEventListener('load', function() {
    jalan()
}, false);