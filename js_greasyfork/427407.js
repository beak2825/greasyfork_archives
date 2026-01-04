// ==UserScript==
// @name         🎬 FilmHD1080 - Enhance
// @namespace    Wizzergod
// @version      3.2.2
// @description  🎬 FilmHD1080 best view and Dark Theme+widescreen wider
// @homepageURL   https://greasyfork.org/ru/scripts/427407-filmhd1080-enhance
// @supportURL    https://greasyfork.org/ru/scripts/427407-filmhd1080-enhance
// @author       Wizzergod
// @match        *://*.*.filmhd1080.*/*
// @match        *://*.filmhd1080.*/*
// @match        *://filmhd1080.*/*
// @match        *://*.filmhd-1080.*/*
// @match        *://*.film-hd1080.*/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @icon https://www.emoji.co.uk/files/phantom-open-emojis/activity-phantom/12655-clapper-board.png
// @downloadURL https://update.greasyfork.org/scripts/427407/%F0%9F%8E%AC%20FilmHD1080%20-%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/427407/%F0%9F%8E%AC%20FilmHD1080%20-%20Enhance.meta.js
// ==/UserScript==


function addGlobalStyle(css) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    document.head.appendChild(style);


    var elements = document.getElementsByClassName('604c7625');
    for (var i = 0; i < elements.length; i++) {
        elements[i].parentNode.removeChild(elements[i]);
    }


    var elements = document.getElementsByClassName('obertka-in');
    for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
        element.style.marginTop = '100px';
  }


    var element = document.getElementById('movie_video');
  if (element) {
    element.remove();
  }

}

addGlobalStyle(`
.obertka {
	padding: 12px 16px !important;
	border-radius: 12px !important;
	box-shadow: 0 4px 12px 0#0d234308 !important;
}

.search-box input {
	padding: 12px 16px !important;
	border-radius: 12px !important;
	box-shadow: 0 4px 12px 0#0d234308 !important;
}

.polna-poster img {
	border-radius: 12px !important;
	box-shadow: 0 4px 12px 0#0d234308 !important;
}

.button {
	border-radius: 12px !important;
	box-shadow: 0 4px 12px 0#0d234308 !important;
}

.obertka-in {
	padding: 12px 16px !important;
	border-radius: 12px !important;
	box-shadow: 0 4px 12px 0#0d234308 !important;
}

.slides-tabs {
	border-radius: 12px !important;
	box-shadow: 0 4px 12px 0#0d234308 !important;
}

.slt-capt {
	border-radius: 12px !important;
	box-shadow: 0 4px 12px 0#0d234308 !important;
}

.rzd-left {
	border-radius: 12px !important;
}

.rzd-capt {
	border-radius: 12px !important;
	box-shadow: 0 4px 12px 0#0d234308 !important;
}

.current {
	border-radius: 12px !important;
	box-shadow: 0 4px 12px 0#0d234308 !important;
}

.filter-wrap {
	border-radius: 12px !important;
	box-shadow: 0 4px 12px 0#0d234308 !important;
}

.kratka-text {
	border-radius: 12px !important;
	box-shadow: 0 4px 12px 0#0d234308 !important;
}

.owl-stage-outer {
	border-radius: 12px !important;
	box-shadow: 0 4px 12px 0#0d234308 !important;
}

.glav-skryt {
	border-radius: 12px !important;
}

.polna-mid .polna-main {
	display: none !important;
}

.polna-right {
	display: none !important;
}

.podval {
	display: none !important;
}

.epom-ec3caff6 {
	display: none !important;
}

.604c7625 {
	display: none !important;
}

.clearfix.site-desc {
	display: none !important;
}

.polna-mid noindex {
	display: none !important;
}

.polna-rkl {
	display: none !important;
}

.clearfix.site-desc {
	display: none !important;
}

.icon-l.polna-meta {
	display: none !important;
}

.db-rates {
	display: none !important;
}

.movie_video {
	display: none !important;
}

.polna-mid .polna-main, .polna-right, .podval, .epom-ec3caff6, .604c7625, .clearfix.site-desc, .polna-mid noindex, .polna-rkl, .clearfix.site-desc, .icon-l.polna-meta, .db-rates, .movie_video {
	display: none !important;
}

.kratka-in {
	border: 3px solid black;
	margin-bottom: 10px;
	background: #f0f0f0;
	border-color: #fff;
	padding-top: 0;
	padding-bottom: 0;
	padding-right: 0;
}

.kratka-in:before {
	background-image: none;
	content: none;
}

.kratka-title {
	color: #fff;
	padding: 5px;
	text-shadow: #000000 1px 1px 1px;
}

.polna-poster {
	margin-top: 0px;
}

.polna-poster:before {
	background-image: none;
	content: none;
}

.tc-img {
	padding: 0;
	border: 3px solid black;
	margin-bottom: 10px;
	background: #f0f0f0;
	border-color: #fff;
	padding-top: 0;
	padding-bottom: 0;
	padding-right: 0;
}

.tc-img:before {
	content: none;
	background-image: none;
}

.have-brand .obertka-in {
	margin-top: 70px;
}

.have-brand {
	background-color: #1d1c1c;
}

.shapka {
	background-color: #2a2a2a;
}

body {
	color: #ffffff;
	background-color: #222;
}

a {
	color: #ffffff;
}

.polna-main {
	background-color: #fff0;
}

.full-taglist {
	background-color: #ffffff00;
}

.search-box input,
  .search-box input:focus {
	background-color: #222;
}

.slice-masked:before {
	background: #fff0;
}

.glav-skryt {
	background-color: #2a2a2a;
}

.kratka-text {
	background-color: #2a2a2a;
}

.slides-tabs {
	background-color: #1d1c1c;
}

.have-brand .obertka-in {
	background-color: #2a2a2a;
}

.rzd-tabs span {
	color: #ffffff;
	background-color: parent;
}

.rzd-tabs span.current {
	background-color: #1e1e1e;
}

.rzd-capt,
  .rzd-right,
  .rzd-tabs span {
	background-color: #1e1e1e;
}

.button,
  .pagi-load a,
  .up-second li a,
  .up-edit a,
  .qq-upload-button,
  button:not(.color-btn):not([class*=fr]),
  html input[type="button"],
  input[type="reset"],
  input[type="submit"],
  .meta-fav a {
	background-color: rgba(0, 0, 0, 0.18);
}

.comms-bg {
	background-color: #fff0;
}

.share-box {
	background-color: #fff0;
}

.slt-capt {
	background-color: rgba(0, 0, 0, 0.2);
}

.navigation a,
  .pnext > span {
	background-color: rgba(0, 0, 0, 0.18);
}

.filter-wrap {
	background-color: #444;
}

.filter-box {
	color: #444;
}

.slides-tabs .owl-prev,
  .slides-tabs .owl-next {
	color: #ffffff;
	background-color: rgba(0, 0, 0, 0.8);
}

.slides-tabs .owl-prev {
	left: -50px;
	border-radius: 20px 0px 0px 20px;
}

.slides-tabs .owl-next {
	right: -50px;
	border-radius: 0 20px 20px 0;
}

.polna-mid {
	width: calc(100% - 200px);
	width: -webkit-calc(100% - 200px);
}

.fr-view {
	background-color: #222;
}

.gray-theme {
	background: #222;
	color: #9b59b6;
}

.ac-inputs input {
	background-color: #222;
}

.login-box {
	background-color: #292929;
}

input[type="text"], input[type="password"] {
	background-color: #222;
	color: #ffffff;
}

.lb-check input + label:before {
	background-color: #222;
}

.lb-check input:checked + label:before {
	background-color: #9b59b6;
}

#searchsuggestions {
	background: #222;
}

.have-brand .obertka-in {
	margin: 100px auto 0 auto;
	margin-top: 100px;
}

.comm-right {
	background-color: #222;
}

.pages {
	background-color: #2a2a2a;
	box-shadow: none;
}

body.js {
	max-width: 90% !important;
}

body {
	max-width: 90% !important;
}

@media screen and (min-width: 760px) {
	.have-brand .obertka-in {
		max-width: 100% !important;
	}
}

.have-brand .obertka-in {
	max-width: 100% !important;
}

@media screen and (min-width: 760px) {
	.have-brand .center {
		max-width: 100% !important;
	}
}

.have-brand .center {
	max-width: 100% !important;
}

.center {
	max-width: 100% !important;
}

.short {
	width: 11.66% !important;
}
  `);

//  .full-taglist{display: none !important;}

(function() {
    'use strict';

    // Функция, которая скрывает или показывает элемент
    function toggleElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Добавляем команды в меню пользовательского скрипта
    GM_registerMenuCommand('Комментарии', function() {
        toggleElement('full-comms');
    });

    GM_registerMenuCommand('Описание', function() {
        toggleElement('s-desc');
    });

    // По умолчанию скрываем комментарии и описание (можно удалить эту часть, если нужно оставить видимыми по умолчанию)
    const commentsDiv = document.getElementById('full-comms');
    const descriptionDiv = document.getElementById('s-desc');

    if (commentsDiv) {
        commentsDiv.style.display = 'none';
    }

    if (descriptionDiv) {
        descriptionDiv.style.display = 'none';
    }
})();

