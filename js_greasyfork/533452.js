// ==UserScript==
// @name         HDRezka Highlight Dark Theme
// @namespace    http://tampermonkey.net/
// @version      2.7.5.4
// @description  Подсвечивает и раскрашивает текст, ссылки и кнопки в Тёмной теме HDRezka
// @author       T.Er
// @icon         https://img.icons8.com/fluency/48/visible.png
// @include      /^https?:\/\/.*rezk.*\/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533452/HDRezka%20Highlight%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/533452/HDRezka%20Highlight%20Dark%20Theme.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const styleId = 'rezka-dark-style';

    const css = `
body, body * {
    /*color: #C6C6C6 !important;*/
}
.b-post__description_text {
color: #C6C6C6 !important;
}
.b-comment .text {
color: #C6C6C6 !important;
}
a {
    color: #00AFE4 !important;  /* синий */
    text-decoration: none !important;
}
a:hover {
    color: #33ff33 !important; /* ярко-зелёный */
    text-decoration: underline !important;
}
a:visited {
    color: #9999ff !important; /* светло-фиолетовый */
}
/* movie info */
.b-post__title h1 {        color: #e1e289 !important;}
td.l, td.l h2 {            color: #1dd877!important;}
span.b-post__info_rates,
span.b-post__info_rates a {color: #96cd0a !important;}
span.bold {                color: #f45555 !important;}
i {                        color: #6ab5ec!important;}
td.rd a {                  color: #e1e289 !important;}
td.rd {                    color: #79ff97 !important;}

/* NEW 2*/
div.th {                color: #ff7d7d!important;}
div.td.date {           color: #8fff96 !important;}
div.td.title small {    color: #5edbdb !important;}
div.td.info {           color: #d3d55a !important;}
.b-videosaves__list_item .new-episode {	background: #8af06b;color:  #fff !important;border-radius: 3px; }
.b-videosaves__list_item .new-episode:hover {	background: #8af06b;color:  #fff !important;border-radius: 3px; }
a.new-episode.own { background: #ff5454!important; color: #fff !important;}
.b-videosaves__list_item { background: #123 !important;}
/* NEW */
div.b-search__live {
	background: #28394e !important;
    box-shadow: 0 0 25px black;
}
div.misc, div.b-content__inline_item-link div {	color: #dcff1f !important;}
span.enty {	color: #62ff97 !important;		}
ul.b-search__section_list li a {	color:	#dcff1f !important;}
ul.b-search__section_list li:hover {
	background: #84AC3E !important;
	color: #FF00FF !important;
}
ul.b-search__section_list li.hovered {
	background: #84AC3E !important;
	color: #FF00FF !important;
}
i.hd-tooltip.rating-grey-string.tooltipstered {
	color:	#20f0ff !important;
	background: #555 !important;
    box-shadow: 0 0 55px black;
	/*border: 0px dashed #312ccf;*/
}
i.hd-tooltip.rating-green-string.tooltipstered {
	color:	#28394e !important;
	background: #14ca24 !important;
    box-shadow: 0 0 55px black;
	/*border: 1px dashed #07105b; */
}
div.b-seriesupdate__block {
    box-shadow: 0 0 25px #00000050;
}
div.b-navigation  a {	color: #FFFF00 !important;}
span.cntrl.prev,  span.cntrl.next{
    box-shadow: 0 0 15px #00000070;
}
div.b-content__bubble_content {
    box-shadow: 0 0 15px #000000;
	background: #28394e !important;
}

/* ==================== bubble ==================== */

div.b-content__bubble.left {
    margin-left: 20px;
}

div.b-content__bubble_content {
    box-shadow: 0 0 100px 25px #03A9F4;
	background: #28394e;
    padding-top: 20px;
}

div.b-content__bubble_text {
    margin-top: 15px;
    color: #fff;
}

i {
    color: #fff !important;
}

span.b-rating span.current {
    background-color: transparent;
}


.b-content__bubble .arrow i {
  width: 0px;
  height: 0px;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-right:20px solid #28394e;
  margin: 25px 0px 0px 0px;
}

.b-content__bubble_rates {
  color:#96cd0a !important;
}
.b-content__bubble_rates b {
  color:#F45555 !important;
}

/* -------------------------------bubble----------------------------------- */

/* PopUp site login */
div.b-popup.b-popup__fixed.b-popup__opened {
    background-color: #132a4d !important;
}

div.b-popup__title {
    color: #3bafcc !important;
}

a.reminder.pull-left {
    color: #ff5e5e !important;
    text-decoration: underline;
}

div.b-login__popup_join {
    color: #ff5e5e !important;
}

a.register-link-popup {
    color: #ff5e5e !important;
    text-decoration: underline;
}

div.b-login__popup_social_title {
    color: #ff5e5e !important;
}

button.login_button.btn.btn-action {
    background-color: #3bafcc !important;
    border-style: solid;
    border-width: 0;
}

input.b-field {
    color: #67ddfa !important;
    background-color: #2d4f5c !important;
    border-width: 1px;
    border-color: #6eff4a !important;
    border-style: solid;
}

/*pop-up reg*/

tr td label {
    color: #ff5e5e !important;
}

tr td label:hover {
    background: #31414A !important;
    border-radius: 3px;
}

td label a {
    color: #c5d123 !important;
}

a.login-link-popup {
    color: #ff5e5e !important;
    text-decoration: underline;
}

button.btn.btn-action.register_button {
    color: #f1ff30 !important;
}

span.string-error {
    color: #d788f2 !important;
    font-style: italic;
}

/* */
div.b-topnav__sub_inner {
	background-color: #28394e !important;
}
div.b-topnav__sub_inner a {
	color: #79ff97 !important
}
div.b-topnav__sub_inner a.active {
	color: yellow !important
}
div.b-topnav__sub_inner a:hover {
	color: #88344c !important;
	background-color: #ad7 !important;
}
div.b-topnav__findbest_block {
	color: #ff7070 !important;
}
/* */
div.b-newest_slider__title {
	color: #6ab5ec !important;
}
div.b-newest_slider__title span {
	color: #6ab5ec !important;
}
/* */
a.b-content__main_filters_link {
	color: #6ab5ec !important;
}
a.b-content__main_filters_link.active {
	color: #fff !important;
	background-color: #88344c !important;
}
a.b-content__main_filters_link:hover {
	color: #88344c !important;
	background-color: #84AC3E !important;
}
/* */
span.filter-text {
	color: #ad7 !important;
	font-weight:bold;
}
a.filter-link{
	color: #6ab5ec !important;
}
li.b-content__filters_types a.filter-link:hover {
	color: #88344c !important;
	background-color: #84AC3E !important;
}
a.filter-link.active{
	color: #ad7 !important;
	background-color: #88344c !important;
}
a.filter-link.active:hover {
	color: #88344c !important;
	background-color: #84AC3E !important;
}
/* */

div.b-seriesupdate__block_date  {
	background-color: #88344c !important;
	font-variant: small-caps !important;
	color: #ad7 !important;
	font-size: 14px;
	font-weight: bold;
	padding: 7px 20px;
	position: relative;
	text-shadow: 4px 4px 6px black;
}
div.b-seriesupdate__block_date.collapsible.expandable {
	background-color: #88344c !important;
}


div.b-seriesupdate__block_list_item_inner {
	background: #28394e !important;
	color: #adfaaf !important;
}

a.b-seriesupdate__block_list_link {
	color: #79ff97 !important;
	padding-bottom: 8px;
	text-shadow: 2px 2px 6px #1a2663b5;
}
a.b-seriesupdate__block_list_link:hover {
	color: yellow !important;
}
 span.season {
	color: #1cf0ff !important;
}
span.cell.cell-2 {
	color: #ffff1f !important;
	text-shadow: 2px 2px 8px #1a2663b5 !important;
}
span.cell.cell-2 i {
	color: #2efc1c !important;
}
li.b-seriesupdate__block_list_item.tracked  {
    background-color: #334 !important;
    border: 3px dashed #ffff1f;
}

.b-seriesupdate__block_list_item.tracked .b-seriesupdate__block_list_link,
.b-seriesupdate__block_list_item.tracked .cell-1,
.b-seriesupdate__block_list_item.tracked .cell-1 .season,
.b-seriesupdate__block_list_item.tracked .cell-2,
.b-seriesupdate__block_list_item.tracked .cell-2 i {
    background-color: #006ea2 !important;
}

div#imagelightbox-overlay {
    background-color: #000000e0 !important;
}
input.b-search__field {
    color: #6ab5ec !important;
	font-variant: small-caps !important;
	background-color: transparent; !important;
	border-style: none;
	border-width: 2px;
	border-color: #2196F3;
	padding-top:11px !important;
}
.b-content__inline_item .info {
    color: #FFFFFF !important;
    background-color: #333344 !important;
}
.b-content__inline_item .cat .entity {
    color: #FFFFFF !important;
}
.add-favorite.btn-primary {
    background: hsla(0, 0%, 100%, .1);
    border-color: hsla(0, 0%, 100%, .05);
    color: #fff !important;
}
.b-favorites_content__cats_list a:hover {
	color: #88344c !important;
	background-color: #2196F3 !important;
}
body.b-theme__template__night .persons-list-holder .person-name-item a {
    color: #85CD77 !important;
}
div.b-content__inline_item-cover {
    background: #88344c !important;
}
span.cntrl.prev  {	background-color: #88344c !important;	   }
span.cntrl.prev:hover {	background-color: #aadd77 !important;	   }
span.cntrl.next  {	background-color: #88344c !important;	   }
span.cntrl.next:hover {	background-color: #aadd77 !important;	   }

.b-person__popup_content {
    color: #C6C6C6 !important;
}
.b-comment__likes_count i.positive {
    color: #18a205 !important;
}
.b-comment__like_it:hover i, .b-comment__like_it.disabled i {
    color: #18a205 !important;
}

/*.tooltipster-default, .tooltipster-content {
    box-shadow: 0 0 20px 6px #03A9F4;
    background: linear-gradient(to bottom, #222D33, #03A9F4);
    border-radius: 5px;
}*/
.b-post__rating .num {
    color: #74d1eb !important;
    text-shadow: 2px 2px 6px #1a2663b5 !important;
}
strong {
    font-weight: bold;
    color: #1DD877;
}
.td-2 {
    color: #1DD877;
}

`;


    const addStyle = () => {
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = css;
            document.head.appendChild(style);
        }
    };

    const removeStyle = () => {
        const style = document.getElementById(styleId);
        if (style) style.remove();
    };

    const checkThemeAndToggle = () => {
        const isDark = document.body && document.body.classList.contains('b-theme__template__night');
        const styleExists = document.getElementById(styleId);
        if (isDark && !styleExists) {
            addStyle();
        } else if (!isDark && styleExists) {
            removeStyle();
        }
    };

    const tryInit = () => {
        if (document.body) {
            checkThemeAndToggle();
            const observer = new MutationObserver(checkThemeAndToggle);
            observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        } else {
            requestAnimationFrame(tryInit); 
        }
    };

    tryInit();
})();
