// ==UserScript==
// @name IMDb - Dark and Gray Simple (USw) v.54
// @namespace https://greasyfork.org/fr/users/8-decembre?sort=updated
// @version 54.0.0
// @description Dark and Gray Simply...
// @author decembre
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.imdb.com/*
// @match *://*.www.imdb.com/*
// @downloadURL https://update.greasyfork.org/scripts/454585/IMDb%20-%20Dark%20and%20Gray%20Simple%20%28USw%29%20v54.user.js
// @updateURL https://update.greasyfork.org/scripts/454585/IMDb%20-%20Dark%20and%20Gray%20Simple%20%28USw%29%20v54.meta.js
// ==/UserScript==

(function() {
let css = `
/* ==== 0- IMDb - Dark and Gray Simple (new54) - DEV QUANTUM */

/* BACKGOUND IMDb:
BACKGOUND IMDb  - Near #222:
    background: #1f1f1f !important;
    
BACKGROUND - DARK LINEAR-GRADIENT IMDB - Near #222:
    background: rgba(0, 0, 0, 0) linear-gradient(90deg, rgb(31, 31, 31), 20%, rgba(31, 31, 31, 0.6), 80%, rgb(31, 31, 31)) repeat scroll 0 0 !important;
==== */

/* VISITED LINK COLOR:
Note:
1-- Firefox's privacy settings must be set a minimum of 'Remember my browsing and download history'
2 -- about:config option layout.css.visited_links_enabled must be set to true.
=== */

/* ==== COLOR - ALL */

/* ===== COLOR ===== */

:root  {
    --ipt-base-rgb: 0,0,0 !important;
    --ipt-on-base-rgb: 255,255,255 !important;
    --ipt-base-shade3-rgb: 0,0,0 !important;
    --ipt-on-base-accent2-rgb: 0,190,250 !important;
}
/* #root  {
    background: red !important;
} */

/* (new19) BACKGROUND - DARK IMDB - RED + opacity */
[data-testid="language-coachmark-heading"] {
    opacity: 0.3 !important;
    background: red !important;
}

/* BACKGROUND - DARK IMDB - Near #222: */

.hWwhTB .ezIlqu.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type .lhQGHg   ,
.ipc-page-content-container.ipc-page-content-container--full > section:first-of-type > section.ipc-page-background > .ipc-page-content-container.ipc-page-content-container--center:not(:empty) .ipc-page-background .ipc-page-section.ipc-page-section--tp-none > div:nth-child(3) ,
.ipc-page-content-container.ipc-page-content-container--full > section:first-of-type > section.ipc-page-background > .ipc-page-content-container.ipc-page-content-container--center:not(:empty) .ipc-page-background .ipc-page-section.ipc-page-section--tp-none ,
.ipc-page-content-container.ipc-page-content-container--full > section:first-of-type > section.ipc-page-background > .ipc-page-content-container.ipc-page-content-container--center:not(:empty) .ipc-page-background ,
.ipc-page-content-container.ipc-page-content-container--full > section:first-of-type > section.ipc-page-background > .ipc-page-content-container.ipc-page-content-container--center:not(:empty) ,
.ipc-page-content-container.ipc-page-content-container--full > section:first-of-type > section.ipc-page-background ,
.ipc-page-content-container.ipc-page-content-container--full > section:first-of-type ,
.ipc-page-content-container.ipc-page-content-container--full ,

.celwidget[data-testid="Filmography"] ,
#ipc-wrap-background-id ,
.celwidget[data-testid="Filmography"],
.celwidget[data-testid="Filmography"][data-cel-widget="StaticFeature_Filmography"] {
    background: #1f1f1f !important;
}


/* BACKGROUND - DARK LINEAR-GRADIENT IMDB - Near #222: */

.ipc-page-background--baseAlt ,
#ipc-wrap-background-id, .celwidget[data-testid="Filmography"], 
.celwidget[data-testid="Filmography"][data-cel-widget="StaticFeature_Filmography"] ,

.ipc-page-content-container--center .ipc-page-background.ipc-page-background--base.jtTbgg ,
.ipc-page-content-container--center {
    background: #1f1f1f !important;
/* background: rgba(0, 0, 0, 0) linear-gradient(90deg, rgb(31, 31, 31), 20%, rgba(31, 31, 31, 0.6), 80%, rgb(31, 31, 31)) repeat scroll 0 0 !important; */
}



/* BACKGROUND - BLACK */

.ipc-tabs ,
.efZxiR .ipc-tabs ,
.ekJqcM ,
.ezIlqu.ipc-page-background--baseAlt {
background: black !important;
}


/* (new14) BACKGROUND - #111 */

.hWwhTB .ezIlqu.ipc-page-background--baseAlt  ,
.ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin:not(.kkcfLp) .jPRxOq  .bGxjcH.episode-item-wrapper + .episode-item-wrapper .ipc-list-card  ,
.ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin:not(.kkcfLp) .jPRxOq  .bGxjcH.episode-item-wrapper  .ipc-list-card  ,
.ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section  article  .fWClyX:hover ,
.ipc-page-background.ipc-page-background--baseAlt[data-testid="atf-wrapper-bg"] + script + .ipc-page-content-container.ipc-page-content-container--center > section ,
main.ipc-page-wrapper--base  .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type  section.ipc-page-background.ipc-page-background--base .ipc-page-grid__item.ipc-page-grid__item--span-2 >div  + .ipc-page-section.ipc-page-section--base  ,
main.ipc-page-wrapper--base  .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type>  section > section > div:last-of-type  > div:last-of-type.doBMpp  ,
main.ipc-page-wrapper--base  .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type>  section > section > div:last-of-type  > div:last-of-type  ,
.ipc-page-section.ipc-page-section--baseAlt.ipc-page-section--tp-none.ipc-page-section--bp-xs  > div:last-of-type ,
.ipc-page-section.ipc-page-section--baseAlt.ipc-page-section--tp-none.ipc-page-section--bp-xs  ,
.lceYKq ,
.hWwhTB .ezIlqu ,
.ipc-page-background--baseAlt .recently-viewed ,
main.ipc-page-wrapper--base  .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type  section.ipc-page-background.ipc-page-background--base:hover:before  ,
main.ipc-page-wrapper--base  .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type  section.ipc-page-background.ipc-page-background--base:before  ,
main.ipc-page-wrapper--base  .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type  section.ipc-page-background.ipc-page-background--base:hover  ,
.hWwhTB .ezIlqu.ipc-page-background--baseAlt ,
.ipc-page-background.ipc-page-background--base.hWwhTB ,
main.ipc-page-wrapper--base ,
iframe[id="vidsrc"] ,
iframe[id=""] ,
#imdbHeader  ~  iframe[id="2embed"],
iframe[id="2embed"] ,
[data-testid="hero-subnav-bar-left-block"]:not(:empty) ,
.ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section  article ,
main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-2 >div + .ipc-page-section.ipc-page-section--base > div:first-of-type + .ipc-signpost--center-aligned:hover + div ,
main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-2 >div + .ipc-page-section.ipc-page-section--base > div:first-of-type + .ipc-signpost--center-aligned + div:hover ,
main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .ipc-page-grid.ipc-page-grid--bias-left  .ipc-page-grid__item.ipc-page-grid__item--span-2 >div  + .ipc-page-section.ipc-page-section--base ,
.ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section section + section ,
.ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section  {
    background: #111 !important;
}



/* (new14) BACKGROUND - COLOR - #111 */

.navbar-expand-md ,
body[data-recaptcha-key] #media-embed  ,
body[data-recaptcha-key] ,
#imdbscoutthirdbar_header:after ,
#imdbscoutthirdbar_header ,
#imdbscoutsecondbar_header:after ,
#imdbscout_header:after ,
#imdbscout_header ,
#imdbscout_iconsheader:after ,
#imdbscout_iconsheader ,
#scout_rating_table:hover ,
#scout_rating_table:after ,
#scout_rating_table ,
#__LTA__  [class^="App_configWrapper__"] [class^="Config_popover__"][style="display: block;"] ,
#__LTA__.ipc-page-content-container:hover ,
 main.ipc-page-wrapper--base  .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type>  section > section > div:last-of-type ,
 
.ipc-scroll-to-top-button ,
#content-2-wide::before  ,
main.ipc-page-wrapper--base  .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type>  section > section > div:last-of-type ,

.ipc-page-section.ipc-page-section--baseAlt.ipc-page-section--tp-none.ipc-page-section--bp-xs  > div:last-of-type ,
.ipc-page-wrapper.ipc-page-wrapper--baseAlt .ipc-page-content-container.ipc-page-content-container--center .ipc-page-grid ,
.ipc-page-wrapper.ipc-page-wrapper--baseAlt .ipc-page-content-container.ipc-page-content-container--center .ipc-page-grid.ipc-page-grid--bias-left [data-testid="video-info-container"],
.ipc-page-wrapper.ipc-page-wrapper--baseAlt .ipc-page-content-container.ipc-page-content-container--center .ipc-page-grid.ipc-page-grid--bias-left ,
.celwidget[data-testid="VideoInfo"] ,
.iDwMSU ,
.ipc-page-grid.ipc-page-grid--bias-left .ipc-page-section.ipc-page-section--base.celwidget:not([data-cel-widget="StaticFeature_Awards"]):not([data-cel-widget="StaticFeature_Videos"]):not([data-cel-widget="StaticFeature_Photos"]) .ipc-title--section-title ,
#imdbHeader ,
.ipc-page-grid__item.ipc-page-grid__item--span-1:hover ,
.ipc-page-grid__item.ipc-page-grid__item--span-1:hover .nas-slot +  .ipc-page-section:first-of-type >  .ipc-title> hgroup ,
.celwidget[data-testid="Filmography"] .ipc-page-section.ipc-page-section--base:last-of-type .ipc-title.ipc-title--section-title.ipc-title--base.ipc-title--on-textPrimary ,
.drawer.hamburger__drawer.imdb-header__nav-drawer ,
.eSmZzJ ,
table.findList td.primary_photo {
    background-color: #111 !important;
}

/* (new14) BACKGROUND - #222 */
.ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin:not(.kkcfLp) .jPRxOq  .bGxjcH.episode-item-wrapper ,
.ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin:not(.kkcfLp) .jPRxOq  .bGxjcH.episode-item-wrapper + .episode-item-wrapper  ,
main.ipc-page-wrapper--base section.ipc-page-background.ipc-page-background--base:not(:hover) .ipc-page-section.ipc-page-section--base[data-testid="DynamicFeature_Episodes"] .ipc-title.ipc-title--section-title.ipc-title--base.ipc-title--on-textPrimary .ipc-title-link-wrapper[href$="/episodes"]  .ipc-title__subtext  ,
.ipc-page-section.ipc-page-section--baseAlt.ipc-page-section--tp-xs.ipc-page-section--bp-xs >div > hgroup ,
main.ipc-page-wrapper--base section.ipc-page-background.ipc-page-background--base:not(:hover) .ipc-page-section.ipc-page-section--base[data-testid="DynamicFeature_Episodes"] .ipc-title.ipc-title--section-title.ipc-title--base.ipc-title--on-textPrimary .ipc-title-link-wrapper[href$="/episodes"] ,
main.ipc-page-wrapper--base  .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type  section.ipc-page-background.ipc-page-background--base:not(:hover) .episodes-card-container + .episodes-browse-episodes > div div:last-of-type label   ,
main.ipc-page-wrapper--base  .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type  section.ipc-page-background.ipc-page-background--base:not(:hover) .episodes-card-container + .episodes-browse-episodes > div div:first-of-type label  {
background: #222 !important;
}


/* (new17) BACKGROUND - #222 - ALL:INITIAL - all: initial !important; - FOR SCROLLBAR */

#content-2-wide .article.listo div.header ,
.DocumentationLayout_pageWrapper__MFm0_ , 
.listo .header .nav ,
.fixed ,
body#styleguide-v2 #wrapper[style="background: 000000 !important"] ,
html ,
html.scriptsOn ,
html body#styleguide-v2.fixed #wrapper[style="background: 000000 !important"] ,
html body#styleguide-v2 #wrapper[style="background: 000000 !important"] ,
html #wrapper[style="background: 000000 !important"] ,
html #wrapper ,
html body#styleguide-v2 ,
html body#styleguide-v2.fixed  ,
html body#styleguide-v2 #wrapper ,
html body#styleguide-v2.fixed #wrapper {
 /*   all: initial !important;*/
    background-color: #222 !important;
    background-image: unset !important;
    background-attachment: unset !important;
    background-clip: unset !important;
    background-origin: unset !important;
    background-position: unset !important;
    background-repeat: unset !important;
    background-size: unset !important;
}


/* (new11) BACKGROUND - #222 + TEXT- GRAY + BORDER #333 */

:not(pre) > code ,
.recently-viewed ,
div.findMoreMatches ,
.article ,
.article.on-tv  {
    color: gray !important;
    background: #222 !important;
    border: 1px solid #333 !important;
}


/* (new17) BACKGROUND - #333 */

.ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin:not(.kkcfLp) .jPRxOq ,
#scout_rating_table>tbody>tr>td[style="width:30px; vertical-align:middle;"]  ,
main.ipc-page-wrapper--base  .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type  section.ipc-page-background.ipc-page-background--base:not(:hover) .episodes-card-container + .episodes-browse-episodes ,

.ipc-tabs.ipc-tabs--base.ipc-tabs--align-left.ipc-tabs--display-tab  .ipc-tabs.ipc-tabs--base.ipc-tabs--align-left.jzcZNG ,
.article.name-overview.with-hero .name-overview-widget #prometer_container ,
#prometer #meterRank ,
#pagecontent ,
.ipc-poster-card.ipc-poster-card--base.ipc-poster-card--dynamic-width.ipc-sub-grid-item.ipc-sub-grid-item--span-2  {
    Background: #333 !important;
}

/* (new13) BACKGROUND #333 + BACKGOUD IMAGE */
#prometer {
    background-color: #333 !important;
    box-shadow: -1px 2px 5px #222 !important;
}



/* (new15) BUTTON - #333 + OPACITY - :not([href^="https://help.imdb.com/article/imdb/discover-watch/"]) */


.ipc-split-button__iconBtn ,
.ipc-split-button__btn ,
.ipc-btn.ipc-btn--full-width.ipc-btn--left-align-content.ipc-btn--large-height.ipc-btn--core-accent1.ipc-btn--theme-baseAlt ,
.ipc-title__actions ,
.ipc-btn[href^="https://contribute.imdb.com/"] {
    opacity: 0.6 !important;
pointer-events: auto !important;
color: silver !important;
/* background: rgb(221, 178, 22) !important; */
background: #333 !important;
}

.ipc-split-button__iconBtn:hover ,
.ipc-split-button__btn:hover ,
.ipc-btn.ipc-btn--full-width.ipc-btn--left-align-content.ipc-btn--large-height.ipc-btn--core-accent1.ipc-btn--theme-baseAlt:hover ,
.ipc-title__actions:hover ,
.ipc-btn[href^="https://contribute.imdb.com/"]:hover {
    opacity: 1 !important;
/* border: 1px solid gray !important; */
/* background: #222 !important; */
}

.ipc-btn.ipc-btn--full-width.ipc-btn--left-align-content.ipc-btn--large-height.ipc-btn--core-accent1.ipc-btn--theme-baseAlt {
    color: grey !important;
}


/* (new15) HOVER  */
/* .ipc-split-button__iconBtn ,
.ipc-split-button__btn , */


/* (new9 - BACKGROUD with IMG  */
.list_item div.image a.add-image {
    background-color: #111 !important;
}
.hover-over-image.zero-z-index.no-ep-poster .add-image +div ,
.add-image-container.episode-list {
    background-color: #111 !important;
}


/* (new11) BACKGROUND - BLACK LIGHT (#1d2124) - NO  TEXT / BORDER / BOX SHADOW */

#wrapper #pagecontent div[class^="aux-content-widget-"] {
    background: #1d2124 !important;
}
div[class^="aux-content-widget-"] {
    background-color: #1d2124 !important;
}


/* (new11) BACKGROUND - BLACK LIGHT (#1d2124) + TEXT + BORDER - + BOX SHADOW AROUND rgba(0, 0, 0, 0.3)*/


.ipc-list-card--base ,
.ipc-page-grid__item.ipc-page-grid__item--span-1 .ipc-page-section--base ,
.ipc-page-grid.ipc-page-grid--bias-left .ipc-page-section.ipc-page-section--base.celwidget {
    background-color: #1d2124 !important;
/*     border-color: #171a1d !important; */
    border-color: #222 !important;
    color: #fff !important;
/* BOX SHADOW AROUND - TEST */
    box-shadow: -3px -3px 3px rgba(230, 224, 224, 0.08) !important;
box-shadow: inset 2px 2px 2px 2px red !important;
    box-shadow: 0px -1px 2px 1px rgba(0, 0, 0, 0.3), 1px 1px 3px 1px rgba(0, 0, 0, 0.3) !important;
    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.3),  0px 0px 4px 1px rgba(0, 0, 0, 0.3) inset !important;
/* JUST INSET */
    box-shadow:  0px 0px 4px 1px rgba(0, 0, 0, 0.3) inset !important;
}



/* BACKGROUND - rgb(30, 32, 34) */

.ipc-page-section.ipc-page-section--base {
    Background: rgb(30, 32, 34) !important;
}



/* COLOR - BACKGROUND IMAGE - GRADIENT - DIVERS */

#filmography .head {
    background-image: -webkit-linear-gradient(bottom, #333 0%, #222 50%);
    text-shadow: unset !important;
}



/* A VOIR - BACKGROUND IMAGE - GRADIENT - ELLIPSIS  VERTICAL - BLACK LIGHT to BLACK */

.ipc-overflowText.ipc-overflowText--base.ipc-overflowText--listCard .ipc-overflowText-overlay {
    background: transparent -moz-linear-gradient(center top , rgba(45, 45, 45, 0.61), rgba(10, 10, 10, 0.68), rgba(17, 17, 17, 0.85)) repeat scroll 0 0;
}


/* BACKGROUND IMAGE - GRADIENT - ELLIPSIS  VERTICAL - TRANSPARENT to BLACK */

.lister-list .lister-item .gradient-container {
    background: transparent linear-gradient(transparent, #111) repeat scroll 0 0 !important;
}



/* BACKGROUND - ZEBRA */


/* ZEBRA ODD */

table.chart tbody tr:nth-child(odd) ,
.ipc-metadata-list-summary-item:nth-child(odd) ,
.filmo-category-section .filmo-row.odd ,
.ipl-zebra-list__item:nth-child(odd) ,
/* .lister-item.mode-advanced:nth-child(odd) , */
.lister-item:nth-child(odd) ,
.list-preview.odd ,
.devitem.odd  ,
.soda.odd ,
.odd {
    color: gray !important;
    background: #222 !important;
/*     border: 1px solid green !important; */
border: 1px solid transparent !important;
border-bottom: 1px solid black !important;
border-top: 1px solid #3c3c3c !important;
}


/* ZEBRA EVEN */

table.chart tbody tr:nth-child(even) ,
.ipc-metadata-list-summary-itemn:nth-child(even) ,
.filmo-category-section .filmo-row.even ,
.ipl-zebra-list__item:nth-child(even) ,
/* .lister-item.mode-advanced:nth-child(even) , */
.lister-item:nth-child(even) ,
.list-preview.even ,
.devitem.even  ,
.soda.even ,
.even  {
    color: gray !important;
    background: #333 !important;
/*     border: 1px solid red !important; */
border: 1px solid transparent !important;
border-bottom: 1px solid black !important;
border-top: 1px solid #3c3c3c !important;
}




/* SVG - CHANGE COLOR BY FILTER - BLACK TO PERU*/

.ipc-media--fallback svg.ipc-media__icon {
    fill: blue !important;
    color: red !important;
    filter: invert(15%) sepia(100%) saturate(6481%) hue-rotate(46deg) brightness(102%) contrast(43%) !important;
}
.ipc-media--base::before {
    background: rgba(17, 17, 17, 0.81);
}


/* SVG - FILL - THUMB */


svg#iconContext-thumb-up {
    fill: green !important;
}
svg#iconContext-thumb-down  {
    fill: red !important;
}



/* TEXT - WHITE */
.ipc-page-grid.ipc-page-grid--bias-left .ipc-page-section.ipc-page-section--base.celwidget:not([data-cel-widget="StaticFeature_Awards"]):not([data-cel-widget="StaticFeature_Videos"]):not([data-cel-widget="StaticFeature_Photos"]) .ipc-title--section-title  h3 ,
.article h1.header span.itemprop ,
.article h1.findHeader span.findSearchTerm ,
.ipc-rating-star--maxRating ,
.ipc-list-card__content a > div > div > div,
.ipc-signpost.ipc-signpost--accent1.ipc-signpost--left-aligned + div ,
.ipc-metadata-list-item__list-content-item--subText ,
.ipc-title__description ,
.ipc-chip.ipc-chip--on-base ,
.ewdPHp ,
.ipc-metadata-list-item__label ,
.ipc-title__text ,
.ipc-html-content.ipc-html-content--base>div ,
.ipc-page-section.ipc-page-section--base.celwidget > div{
    color: #fff !important;
}


/* TEXT - GRAY SILVER */

.cast_list .castlist_label ,
.credit ,
.lister .lister-controls > .lister-control-group ,
div[class^="aux-content-widget-"]>table>tbody>tr>td ,
.hide-seen>label ,
#sidebar h2, 
#sidebar h3 ,
h1, 
h2, 
h3 {
    color: silver !important;
}



/* TEXT - GRAY */
.cast_list .character ,
.bigcell ,
.allText ,
.ReleaseNotesSummary_pageSection__9xB_g>div ,
.documentation_pageContainer__jSal_ h3 ,
.documentation_pageContainer__jSal_ h2 ,
.documentation_pageContainer__jSal_ h1 ,
.DocumentationPage_content__wXkMT h3 ,
.DocumentationPage_content__wXkMT h2 ,
.DocumentationPage_content__wXkMT h1 ,
.ipc-page-grid__item.ipc-page-grid__item--span-2>h1 ,
.sample-queries_heading__lOa1J ,
p ,
.documentation_topParagraph__huUSI ,
.Products_column__KrTze.ColumnLayout_column__wUt7d>p ,
.ipc-page-wrapper ,
.Products_paragraphTexts__KIm98 p ,
.Products_productText__7TVow ,
.UseCases_title__4jv8P ,
.ipc-html-content-inner-div>p ,
.text-primary ,
.lister-item-content span.text-primary ,
.text-muted ,
.subnav h4 ,
.article h1.header ,
.listo .header .nav .desc{
    color: gray !important;
}

/* TEXT - GOLD */
.ipc-rating-star--base ,
.ipc-title__subtext ,
.gwBsXc ,
.dbUarY ,
.ktSkVi ul,
.ipc-metadata-list.ipc-metadata-list--dividers-all.ipc-metadata-list--base{
    color: gold !important;
}

/* TXT / LINKS  - PERU */
#personal-details>p>span>time ,
#personal-details>h3 ,
.rightcornerlink form select.fixed ,
.rightcornerlink span.filmo-show-hide-all ,
a.jFeBIw ,
a .esZWnh , 
a {
    color: peru !important;
}


/* BORDER - RED  */
.hWwhTB > .ipc-page-content-container.ipc-page-content-container--center {
    border-top: 1px solid red !important;
}

/* BOX SHADOW */
.Cmihf {
    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.3),  0px 0px 4px 1px rgba(0, 0, 0, 0.3) inset !important;
}

/* IMDB - ROOT - ALL:INITIAL === */
#styleguide-v2, #styleguide-v2 #wrapper {
    margin: auto;
    min-width: 1008px;
    position: static;
    width: auto;
all: initial !important;
}


/* END === COLOR - ALL === */
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
