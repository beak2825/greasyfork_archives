// ==UserScript==
// @name Pornbox WideScreen v.1
// @namespace pornbox.com
// @version 1.00.00
// @description Large and Compact Pornbox for large screen (1920x1080) without junky results
// @author janvier56
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.pornbox.com/*
// @downloadURL https://update.greasyfork.org/scripts/530547/Pornbox%20WideScreen%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/530547/Pornbox%20WideScreen%20v1.meta.js
// ==/UserScript==

(function() {
let css = `

/* === X Pornbox WideScreen v.1  === */

/* SUPP */
footer ,
.model-trophies {
    display: none !important;
}

/* LIST RELATED PORNSTARS STUDIOS - ALWAYS VISIBLE */
.model-info__group:has(.model-info__value.model-info__studios) .model-info__type ,
.model-info__group:has(.model-info__value.model-info__joint-models.more-less--hidden ~ button) .model-info__type {
    display: inline-block !important;
    width: 100px;
    margin: 0 0px 0 5px !important;
}
.model-info__group:has(.model-info__value.model-info__studios) .model-info__value.model-info__studios ,
.model-info__value.model-info__joint-models.more-less--hidden {
	display: inline-block !important;
	width: 95% !important;
	margin: 0 0px 0 5px !important;
	padding: 0 10px  !important;
border-top: 1px solid red !important;
}
.model-info__group:has(.model-info__value.model-info__studios) a.model-info__tag ,
.model-info__group:has(.model-info__value.model-info__studios) a.model-info__tag.more-less__item--hidden ,

.model-info__value.model-info__joint-models.more-less--hidden a.model-info__tag ,
.model-info__value.model-info__joint-models.more-less--hidden a.model-info__tag.more-less__item--hidden{
    display: inline-block !important;
color: peru !important;
}


/* TEST GM "PORNBOX Better Liste Models Names (with IA Help)*/
.model-info__value.model-info__joint-models.more-less--hidden ~ button {
	float: left !important;
	margin: 0 0px 0 20px !important;
}


/* WIDE */
.main-menu {
	position: relative !important;
	display: inline-block !important;
    width: 15% !important;
	height: 4vh !important;
	line-height: 0vh !important;
    text-align: left;
	overflow: hidden;
border: 1px solid red !important;
}
.main-menu .main-menu__inner-left ul li {
	height: 4vh !important;
	line-height: 4vh !important;
    width: 130px !important;
	padding: 0 5px  !important;

}
.main-menu .main-menu__inner-left ul li a {
	height: 4vh !important;
	line-height: 4vh !important;
    text-align: center !important;
	font-size: 15px;
}

.submenu-wrapper  {
	position: relative !important;
	display: inline-block !important;
	height: 4vh !important;
	line-height: 4vh !important;
    width: 30% !important;
    text-align: left;
	overflow: hidden;
border: 1px solid red !important;
}


.model-info {
	display: block !important;
	float: left  !important;
	width: 42% !important;
    margin: 0px;
    overflow: hidden;
border: 1px solid red !important;
}
.model-info + .model__filter-wrapper, 
.model-info #pane-niche .model__filter-wrapper {
	width: 40% !important;
	margin: 0 0 0 0 !important;
border-top-color: #303030;
border-bottom-color: aqua !important;
}
.model__items-info {
	display: block !important;
	float: left  !important;
	width: 40% !important;
border-top-color: #303030;
border-bottom-color: red !important;
}
.model-info__data {
    display: block !important;
	float: left  !important;
	clear: none  !important;
	max-width: 64% !important;
	height: 82vh  !important;
    margin: 0 0 0 5px !important;
	padding: 5px !important;
	overflow: hidden !important;
	overflow-y: auto !important;
border-left: 3px solid  green !important;
}

.model__items-info + div +  .itemsWrapper{
	display: block !important;
	float: right  !important;
	width: 57% !important;
    height: 78vh  !important;
    margin:-2vh 0 0 0 !important;
    overflow: hidden !important;
	overflow-y: auto !important;
	overscroll-behavior-y: contain !important;

}
.model-info__value.model-info__joint-models.more-less--hidden .more-less__btn {
    display: none !important;
}



/* THUMBNAIL */
#items-mosaic .block-item.scene-block {
        width: 32.66666667% !important;
}
#items-mosaic .block-item.scene-block .item-inner__data {
	height: 3vh !important;
    margin: 3px 4px !important;
	padding: 0 0 3vh 0 !important;
/*border: 1px solid aqua  !important;*/
}
.item-inner__title {
	display: inline-block;
	line-height: 12px  !important;
	padding: 2px  !important;
    font-size: 13px !important;
color: silver !important;
}
.item-inner__title a {
	display: inline-block !important;
color: silver !important;
}

/* TAGS  */

#items-mosaic .block-item.scene-block .item-inner__data .item-inner__tags {
	position: relative !important;
    display: inline-block;
	width: 100%;
	min-width: 313px !important;
    max-width: 313px !important;
	height: 2vh !important;
	line-height: 12px  !important;
	margin: -1vh 0 0 0 !important;
	padding: 2px  !important;
    white-space: normal!important;
    overflow: hidden;
	text-align: left !important;
    text-overflow: ellipsis;
	pointer-events: none !important;
color: silver !important;
background: brown  !important;
}
/* TAGS  */
#items-mosaic .block-item.scene-block .item-inner__data .item-inner__tags:hover {
	position: relative!important;
    display: inline-block;
	width: 100%;
	min-width: 313px !important;
    max-width: 313px !important;
	height: auto !important;
	max-height: 24vh !important;
	line-height: 12px  !important;
	margin: -23.5vh 0 0 -3px !important;
	padding: 5px  !important;
    white-space: normal!important;
    overflow: hidden auto !important;
    text-overflow: ellipsis;
	pointer-events: auto !important;
color: silver !important;
background: #111  !important;
border: 1px solid red  !important;
}
.item-inner__tags {
	display: inline-block !important;
	height: 1.8vh !important;
	line-height: 1.8vh  !important;
	width: 20px  !important;
	padding: 0 0px !important;
	text-align: center !important;
}
.item-inner__tags:before {
	float: left !important;
	height: 1.8vh !important;
	line-height: 1.8vh  !important;
	width: 18px  !important;
	padding: 0 0px !important;
	text-align: center !important;
	border-radius: 100% !important;
	pointer-events: auto !important;
background: #111  !important;
border: 1px solid aqua !important;
}
#items-mosaic .block-item.scene-block .item-inner__data .item-inner__tags a {
	display: inline-block !important;
	float: none !important;
	height: 1.8vh !important;
	line-height: 1.6vh !important;
	margin:  0 5px 3px 0 !important;
	padding: 0 4px !important;
	border-radius: 3px  !important;
	font-size: 15px !important;
color: peru  !important;
/*background: red !important;*/
}
.item-inner__tags .tag-link:after {
    display: none  !important;
}

.item-inner__tags .tag-link[href^="/application/niche/"] {
    display: none  !important;
}

/* TAG ZEBBRA */
#items-mosaic .block-item.scene-block .item-inner__data .item-inner__tags a:nth-child(odd) {
	/*background: brown  !important;*/
	border: 1px solid brown !important
}
#items-mosaic .block-item.scene-block .item-inner__data .item-inner__tags a:nth-child(even) {
	/*background: olive  !important;*/
	border: 1px solid olive !important
}


/* LINK */
/* A */
.model-info__value.model-info__joint-models.more-less--hidden a.model-info__tag ,
.model-info__value.model-info__joint-models.more-less--hidden a.model-info__tag.more-less__item--hidden ,
a {
    display: inline-block !important;
	color: peru !important;
}

/* A VISITED */
.model-info__value.model-info__joint-models.more-less--hidden a.model-info__tag:visited ,
.model-info__value.model-info__joint-models.more-less--hidden a.model-info__tag.more-less__item--hidden:visited ,
a:visited  {
    display: inline-block !important;
	color: tomato !important;
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
