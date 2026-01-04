// ==UserScript==
// @name IMDb Compact (Only New Names Pages) v.11
// @namespace https://greasyfork.org/fr/users/8-decembre?sort=updated
// @version 11.0.0
// @description Reorganize the new Name page of IMdb:Take advantage for a Wide Screen (More infos in a glance...)
// @author decembre
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match https://www.imdb.com/name/*
// @match https://m.imdb.com/name/*
// @downloadURL https://update.greasyfork.org/scripts/454993/IMDb%20Compact%20%28Only%20New%20Names%20Pages%29%20v11.user.js
// @updateURL https://update.greasyfork.org/scripts/454993/IMDb%20Compact%20%28Only%20New%20Names%20Pages%29%20v11.meta.js
// ==/UserScript==

(function() {
let css = `

/* ==== 0- IMDb Compact (Only New Names Pages) v.11 (new11) ==== */

/* INFO ABOUT IT:
https://help.imdb.com/article/imdb/new-features-updates/imdb-name-page-redesign/GMWASETVPLJYXEZE?ref_=helpsect_cons_8_2#
=== */

/* BACKGOUND IMDb:
BACKGOUND IMDb  - Near #222:
    background: #1f1f1f !important;
BACKGROUND - DARK LINEAR-GRADIENT IMDB - Near #222:
    background: rgba(0, 0, 0, 0) linear-gradient(90deg, rgb(31, 31, 31), 20%, rgba(31, 31, 31, 0.6), 80%, rgb(31, 31, 31)) repeat scroll 0 0 !important;
==== */

/* (new8) - CHROME - BLUR THINGS */
section.ipc-page-background.ipc-page-background--base > .ipc-page-background .ipc-page-content-container .ipc-page-background  > div,

.fTsZdF {
    backdrop-filter: none !important;
}

/* TOTAL CONTAINER COLOR */
html {
    background: white ;
}
html {
    background: white ;
}

/* (new6) TOP STICKY */

/* (new6) TOP NAV - TEST STICKY */
nav#imdbHeader {
    position: fixed !important;
    top: 0vh !important;
/* background: red !important; */
}


/* (new6) ACTOR NAME - TEST STICKY */

/* (new11) TITLE NAME - CONTAINER - PADDING TOP */
section.ipc-page-background.ipc-page-background--base > .ipc-page-background .ipc-page-content-container .ipc-page-background:has([data-testid="hero-parent"]) {
    padding: 16vh 0 0 10px !important;
/* border-bottom: 1px solid aqua !important; */
}

/* (new6) TITLE NAME */
section.ipc-page-background.ipc-page-background--base > .ipc-page-background .ipc-page-content-container  .ipc-page-background .ipc-page-section > div:nth-child(2){
    position: fixed !important;
    width: 40.8vw !important;
    top: 6vh !important;
    z-index: 50000 !important;
background:#111 !important;
border-bottom: 1px solid red !important;
}

/* (new6) STICKY - SUB HEADER - SMALL CENTER  */
/* AWARDS */
.ipc-page-grid.ipc-page-grid--bias-left .ipc-page-section.ipc-page-section--base.celwidget[data-cel-widget="StaticFeature_Awards"] {
    position: sticky !important;
    display: inline-block !important;
    width: 39.2vw !important;
    top: 0vh !important;
    margin: 0vh 0 0vh 0 !important;
    padding: 1vh 0 0 0 !important;
    z-index: 1 !important;
background: white;
border-bottom: 1px dashed red !important;
/* border: 1px solid yellow !important; */
}
/* OTHERS */
.ipc-page-grid.ipc-page-grid--bias-left .ipc-page-section.ipc-page-section--base.celwidget:not([data-cel-widget="StaticFeature_Videos"]):not([data-cel-widget="StaticFeature_Photos"])  {
    padding: 0 0 10px 0.5rem !important;
margin: 0 0 0 10px !important;
border-bottom: 1px solid red !important;
}

.czBPkk {
    -moz-box-align: center;
    align-items: center;
    flex-flow: row wrap;
border-top: 1px solid red !important;
border-left: 1px solid red !important;
border-right: 1px solid red !important;
}

/* SMALL CENTER */

/* TOP NAV  */
#imdbHeader {
    background: white ;
}
.ezIlqu {
    background: transparent ;
}
/* TOP HAMBURGER MENU - OPEN */
.drawer.hamburger__drawer.imdb-header__nav-drawer {
    max-width: 40% !important;
    left: 30vw !important;
    padding: 0.5rem !important;
border: 1px solid red !important;
}
.liGxUA .navlinkcat__listContainer {
    overflow: hidden;
    transition: border-color 0.1s ease-in 0s, height 0.2s ease 0s;
}
ul.ipc-list.navlinkcat__list {
    display: inline-block !important;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    list-style-type: disc  !important;
    list-style-position: inside !important;
    line-height: 15px !important;
    vertical-align: top !important;
}
.liGxUA .ipc-list__item { 
    height: auto !important;
    padding-bottom: 0.6rem;
    padding-top: 0.1rem;
    padding-left: 0.5rem !important;
border-left: solid 2px red !important;
}
.ipc-list__item .ipc-list-item__text {
    display: list-item !important;
    overflow: hidden;
    text-overflow: ellipsis;
}
/* (new4) SMALL CENTER BOTTOM - RECENT  - KEEP BACKGROUND BLACK */
main + section.ipc-page-background.ipc-page-background--baseAlt{
    position: absolute !important;
    display: inline-block !important;
    min-width: 41% !important;
    max-width: 41% !important;
    left: 29.3vw !important;
    padding: 0rem !important;
background: #111 !important;
border: 1px solid red !important;
}
main + section.ipc-page-background.ipc-page-background--baseAlt .ipc-page-content-container--center {
    max-width: 100% !important;
}



/* (new4) SMALL - CENTER - FOOTER  - KEEP BACKGROUND BLACK */
footer.imdb-footer.footer.jbJDWL {
    position: fixed !important;
    display: inline-block !important;
    max-width: 40% !important;
    left: 30vw !important;
    bottom: -69.8vh !important;
    padding: 0.5rem !important;
    z-index: 5000 !important;
    transition: all ease 0.7s !important;
background: #222 !important;
border: 1px solid red !important;
}
footer.imdb-footer.footer.jbJDWL:hover {
    bottom: 0vh !important;
    transition: all ease 0.7s !important;
background:#111 !important;
border: 1px solid red !important;
}
footer.imdb-footer.footer.jbJDWL:before {
    content: "Infos ⏏" !important;
    position: absolute !important;
    display: inline-block !important;
    width: auto !important;
    height: 15px !important;
    line-height: 15px !important;
    right: 0vw !important;
    top: -1.6vh !important;
    padding: 0 0.1rem !important;
    font-size: 10px !important;
background: #111 !important;
border: 1px solid red !important;
}
/* (new5) SMALL CENTER - CONTAINER */
#ipc-wrap-background-id, .celwidget[data-testid="Filmography"], 
.celwidget[data-testid="Filmography"][data-cel-widget="StaticFeature_Filmography"] {
    background: white ;
}


/* (new11) FOR STICKY SUB HEADER - PB CITATIONS - :has([data-testid="hero-parent"]) */
.ipc-page-content-container--center:has(.ipc-page-grid) ,
.ipc-page-content-container--center:has([data-testid="hero-parent"]) {
    max-width: 41% !important;
    overflow: unset !important;
    overflow-x: unset !important;
    overflow-y: unset !important;
/*     background: rgba(0, 0, 0, 0) linear-gradient(90deg, rgb(31, 31, 31), 20%, rgba(31, 31, 31, 0.6), 80%, rgb(31, 31, 31)) repeat scroll 0 0 !important; */
/*background: brown !important;*/
/*border-right: 1px solid aqua !important; */
}


/* (neww11) ANECDOCTES / CITATIONS / OEUVRES / DIVERS*/
main.ipc-page-wrapper.ipc-page-wrapper--base:has([data-testid="sub-section-misc"]) ,
main.ipc-page-wrapper.ipc-page-wrapper--base:has([id^="quotes_"]) ,
main.ipc-page-wrapper.ipc-page-wrapper--base:has([id^="wrk"]) ,
main.ipc-page-wrapper.ipc-page-wrapper--base:has([id^="trivia_"]) {
    position: relative;
    min-height: 65vh !important;
    min-width: 300px;
background: transparent !important;
}

.ipc-page-wrapper section.ipc-page-background.ipc-page-background--baseAlt:has([data-testid="poster"])  hgroup:has([data-testid="title"]) {
    position: fixed;
    display: inline-block !important;
    width: 28% !important;
    height: 100% !important;
    min-height: 9vh !important;
    max-height: 9vh !important;
    left: 0% !important;
    top: 6vh !important;
    margin: 0 0 0 0 !important;
    padding: 0 0 0 0 !important;
    border-radius: 0 0 5px 5px !important;
    z-index: 500000000 !important;
    pointer-events: auto !important;
    overflow: hidden !important;
    overflow-y: auto !important;
    
background: #111 !important;
border-left: 4px solid green !important;
}
.ipc-page-section.ipc-page-section--base:has([data-testid="sub-section-misc"]),
main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .ipc-page-grid.ipc-page-grid--bias-left  .ipc-page-grid__item.ipc-page-grid__item--span-2 >div  + .ipc-page-section.ipc-page-section--base {
    position: fixed;
    display: inline-block !important;
    width: 28% !important;
    height: 80vh !important;
    left: 0% !important;
    top: 15.1vh !important;
    margin: 0 0 0 0 !important;
    padding: 0 0 0 0 !important;
    border-radius: 0 0 5px 5px !important;
    z-index: 5 !important;
    pointer-events: auto !important;
    overflow: hidden !important;
    overflow-y: auto !important;
/*background: #111 !important;*/
border-left: 4px solid green !important;
}

/* SOUND - :has([data-testid="sub-section-misc"]) [data-testid="sub-section-sound"]  */
main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-2 > div + .ipc-page-section.ipc-page-section--base > div:first-of-type + div[data-testid="sub-section-sound"],
.ipc-page-content-container--center:has([data-testid="sub-section-sound"]) [data-testid="sub-section-sound"] {
    position: fixed !important;
    display: inline-block !important;
    height: auto !important;
    min-width: 28% !important;
    max-width: 29% !important;
    margin: 0vh 0 0 0 !important;
    top: unset  !important;
    bottom: 5vh !important;
    left: unset !important;
    right: 0 !important;
    padding: 0 0px 0 0px !important;
    overflow: hidden !important;
    overflow-y: auto !important;
    z-index: 50000000 !important;
    /*background: #111 !important;*/
    /*background: #111 !important;*/
/*border: 1px dashed green !important; */
}



.ipc-page-section:first-of-type > div:has(.ipc-poster):not(.rvi-populated-section):not([data-testid="nm_flmg_kwn_for"]){
    position: fixed;
    display: inline-block !important;
    max-width: 29% !important;
    min-height: 94vh !important;
    max-height: 94vh !important;
    margin: 0vh 0 0 0 !important;
    top: 8.5vh !important;
    right: 0% !important;
    padding: 0 0px 0 0px !important;
    overflow: hidden !important;
    overflow-y: auto !important;
    z-index: 5000000 !important;
    /*background: #111 !important;*/
    /*background: #111 !important;*/
/*border: 1px dashed green !important; */
}
main.ipc-page-wrapper--base  .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type>  section > section > div:last-of-type  > div:last-of-type:has([data-testid="poster"]) {
    position: relative !important;
    display: inline-block !important;
    max-width: 100% !important;
    height: 100% !important;
    margin: 0vh 0 0 0 !important;
    top: 0vh !important;
    left: 0% !important;
    padding: 0 0px 0 0px !important;
    z-index: 5000000 !important;
background: #111 !important;
/*border: 1px dashed green !important;*/
}

main.ipc-page-wrapper--base  .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type>  section > section > div:last-of-type  > div:last-of-type:has([data-testid="poster"]) .ipc-poster  {
    position: relative !important;
    display: inline-block !important;
    max-width: 100% !important;
    height: 100% !important;
    min-height: 42vh !important;
    max-height: 42vh !important;
    margin: 0vh 0 0 0 !important;
    padding: 5px 0px 5px 0px !important;
    text-align: center  !important;
    overflow: hidden !important;
    z-index: 5000000 !important;
/*border: 1px dashed green !important;*/
}
main.ipc-page-wrapper--base  .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type>  section > section > div:last-of-type  > div:last-of-type:has([data-testid="poster"]) .ipc-poster img {
    position: relative !important;
    display: inline-block !important;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    height: 100% !important;
    min-height: 41vh !important;
    max-height: 41vh !important;
    margin: 0vh 0 0 0 !important;
    padding: 0 0px 0 0px !important;
    overflow: hidden !important;
    z-index: 5000000 !important;
    object-fit: contain !important;
/*border: 1px dashed green !important;*/
}

/* (new7) FOR STICKY SUB HEADER */
.eYYUWh {
    overflow: unset !important;
    overflow-x: unset !important;
    overflow-y: unset !important;
}

/* (new11) CENTER */
.ipc-page-content-container--center .ipc-page-background.ipc-page-background--base.jtTbgg {
/*     background: rgba(0, 0, 0, 0) linear-gradient(90deg, rgb(31, 31, 31), 20%, rgba(31, 31, 31, 0.6), 80%, rgb(31, 31, 31)) repeat scroll 0 0 !important; */
border-top: 1px solid red !important;
border-left: 1px solid red !important;
border-right: 1px solid red !important;
}
.ipc-page-grid__item.ipc-page-grid__item--span-2 {
    display: inline-block !important;
    grid-column: unset !important;
    width: 100% !important;
    min-width: 39.9vw !important;
    max-width: 39.9vw !important;
}
/* TOP INFOS */
.Cmihf {
    display: flex;
    flex-flow: row wrap;
    margin-bottom: 0.75rem;
    position: relative;
/* box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.3),  0px 0px 4px 1px rgba(0, 0, 0, 0.3) inset !important; */
}
.caCZxA {
    margin-right: 0.25rem;
    width: calc(55% - 0.15rem / 2) !important;
}
.Cmihf .ipc-photo, 
.Cmihf .ipc-poster, 
.Cmihf .ipc-slate {
    display: inline-flex;
    height: 100% !important;
    position: relative;
    text-decoration: none;
}

/* OPACITY */
.cYzQDy ,
.gwaHmt {
    opacity: 0.2 !important;
}
.cYzQDy:hover ,
.gwaHmt:hover {
    opacity: 1 !important;
}

/* (new11) CENTER - ACTOR DETAILS*/
/*.ipc-page-grid.ipc-page-grid--bias-left .ipc-page-section.ipc-page-section--base.celwidget[data-testid="PersonalDetails"]*/



/* (new4) LEFT - FILMOGRAPHY SHORT */
.celwidget[data-testid="Filmography"] {
    position: fixed !important;
    width: 29.5% !important;
    height: 100vh !important;
    top: 0vh !important;
    left: 0 !important;

    overflow: hidden !important;
    overflow-y: auto !important;
    z-index: 5000 !important;
background: white ;
/* border-right: 1px solid red !important; */
}
.celwidget[data-testid="Filmography"]  .ipc-page-section {
    padding: 0 0 1.5rem 0 !important;
}
.celwidget[data-testid="Filmography"]  section:first-of-type .ipc-title {
    display: inline-block !important;
    width: 100% !important;
    height: 6vh !important;
    line-height: 5.9vh !important;
    vertical-align: middle !important;
    margin-bottom: 0rem !important;
    border-radius: 0 0 5px 0 !important;
border-right: 1px solid red !important;
border-bottom: 1px solid red !important;
}
.celwidget[data-testid="Filmography"] section:first-of-type .ipc-title + .jVJjba {
    width: 99% !important;
    margin: 0.5vh 0 0 0 !important;
    padding: 0.5rem 0.5rem 1rem 0 !important;
border-top: 1px solid red !important;
/* border-right: 1px solid red !important; */
border-bottom: 1px solid red !important;
}


.celwidget[data-testid="Filmography"]  section:first-of-type .ipc-title  hgroup {
    display: inline-block !important;
    margin: 1vh 0 0 0 !important;
}
.celwidget[data-testid="Filmography"]  section:first-of-type .ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--wraps-at-above-l.ipc-shoveler__grid {
    padding: 0.7rem 0.5rem 1rem 0.5rem !important;
}

/* LEFT - VIDEOS  */
.ipc-page-section.ipc-page-section--base.celwidget[cel_widget_id="StaticFeature_Videos"]{
    position: fixed !important;
    width: 29.2% !important;
    bottom: 26.8vh !important;
    left: 0 !important;
    padding: 1.5rem 0.5rem 0 0 !important;
    overflow: hidden !important;
    overflow-y: auto !important;
    z-index: 500000 !important;
border: 1px solid red !important;
}
.ipc-page-grid__item.ipc-page-grid__item--span-2 .ipc-page-section.ipc-page-section--base.celwidget[cel_widget_id="StaticFeature_Videos"] {
/*     border-top-color: red !important; */
    border-bottom-color: red !important;
}
/* LEFT - PHOTO */
.ipc-page-grid.ipc-page-grid--bias-left .celwidget[cel_widget_id="StaticFeature_Photos"] ,
.ipc-page-section.ipc-page-section--base.celwidget[cel_widget_id="StaticFeature_Photos"]{
    position: fixed !important;
    width: 29.2% !important;
height: 24vh !important;
    bottom: 0.5vh !important;
    left: 0 !important;
    padding: 1.5rem 0.5rem 2rem 0 !important;
    overflow: hidden !important;
    overflow-y: auto !important;
    z-index: 500000 !important;
border: 1px solid red !important;
}
.ipc-page-grid__item.ipc-page-grid__item--span-2 .ipc-page-section.ipc-page-section--base.celwidget[cel_widget_id="StaticFeature_Photos"]{
/*     border-top-color: red !important; */
/*     border-bottom-color: red !important; */
}
/* RIGHT - DECOUV */
.ipc-page-grid__item.ipc-page-grid__item--span-1 {
    position: fixed !important;
    width: 28.5% !important;
    height: 100vh !important;
    top: 0vh !important;
    right: -28.8vw !important;
    overflow: hidden !important;
    overflow-y: auto !important;
    z-index: 5000 !important;
    transition: right ease 0.7s !important;
border: 1px solid red !important;
}
.ipc-page-grid__item.ipc-page-grid__item--span-1:hover {
    position: fixed !important;
    width: 28.5% !important;
    height: 100vh !important;
    top: 0vh !important;
    right: 0vw !important;
    overflow: hidden !important;
    overflow-y: auto !important;
    z-index: 5000 !important;
    transition: right ease 0.7s !important;
/* background: #111 !important; */
border: 1px solid red !important;
}
.ipc-page-grid__item.ipc-page-grid__item--span-1:not(:hover) .nas-slot +  .ipc-page-section:first-of-type >  .ipc-title> hgroup {
    position: fixed !important;
    top: 0vh !important;
    right: 0vw !important;
 padding: 3px 3px 3px 27px !important;
    z-index: 5000 !important;
    transform-origin: top right !important;
    transform:  scale(0.5) !important;
background: green !important;
/* border: 1px solid red !important; */
}
.ipc-page-grid__item.ipc-page-grid__item--span-1:not(:hover) .nas-slot +  .ipc-page-section:first-of-type >  .ipc-title> hgroup:before {
    content: "◀" !important;
    position: absolute !important;
height: 40px !important;
line-height: 40px !important;
    top: 0.3vh !important;
    left: 0.2vw !important;
/* padding: 3px 3px 3px 20px !important; */
font-size: 25px !important;
    z-index: 5000 !important;
    transform-origin: top left !important;
    transform:  scale(1) !important;
color: gold !important;
/* background: red !important; */
/* border: 1px solid red !important; */
}
.ipc-page-grid__item.ipc-page-grid__item--span-1:hover .nas-slot +  .ipc-page-section:first-of-type >  .ipc-title> hgroup {
    position: fixed !important;
    width: 29.5% !important;
    height: 6vh !important;
    line-height: 5.9vh !important;
    margin: 1vh 0 0 !important;
    top: -1vh !important;
    right: 0vw !important;
 border-radius: 0 0 0 5px !important;
    z-index: 5000 !important;
background: white ;
border: 1px solid red !important;
}

/* (new8) RIGHT - FILM - LISTS */
.celwidget[data-testid="Filmography"] .ipc-page-section.ipc-page-section--base:last-of-type{
    position: fixed !important;
    width: 30.2% !important;
    height: 99vh !important;
    top: 0vh !important;
    right: -1rem !important;
    padding : 0 0 0 0 !important;
    overflow: hidden !important;
    overflow-y: auto !important;
    z-index: 5000000 !important;
border-bottom: 1px solid red !important;
}
.celwidget[data-testid="Filmography"] .ipc-page-section.ipc-page-section--base:last-of-type .ipc-title.ipc-title--section-title.ipc-title--base.ipc-title--on-textPrimary {
    position: sticky;
    height: 5.9vh !important;
    line-height: 5.9vh !important;
    top: 0vh !important;
    margin: 0 0 0.2rem 0 !important;
    z-index: 5000000 !important;
background: white ;
border-radius: 0 0 0 5px !important;
border-left: 1px solid red !important;
border-bottom: 1px solid red !important;
}
.ipc-chip-list--nowrap {
    max-width: 100%;
    overflow: hidden;
    padding: 0.5rem 0 0 0 !important;
border-top: 1px solid red !important;
}
.celwidget[data-testid="Filmography"] .ipc-page-section.ipc-page-section--base:last-of-type .ipc-title.ipc-title--section-title.ipc-title--base.ipc-title--on-textPrimary .ipc-title__wrapper {
    height: 5.9vh !important;
    line-height: 5.9vh !important;
}

.ipc-accordion__item__header--sticky {
    position: sticky;
    top: 5.9vh !important;
    z-index: 1 !important;
}
.ipc-accordion__item__chevron {
    margin-right: 35px !important;
}

/* (new25) GET MORE RATING */
.ipc-btn.ipc-btn--theme-base.ipc-btn--core-accent1[style^="display: inline; top: 0px; left: 50%; position: fixed;"] {
    position: fixed;
    left: 20% !important;
    top: 1vh !important;
    bottom: unset !important;
    z-index: 5000 !important;
}
/* (new8) RIGHT - SEARCH/FILM INFO - ADD RATING INFOS - With GM "Add movie ratings to IMDB links [adopted]"  */
.celwidget[data-testid="Filmography"] .ipc-page-section.ipc-page-section--base:last-of-type .ipc-metadata-list-summary-item__tc{
    display: inline-block !important;
    min-width: 100% !important;
/* border: 1px solid yellow !important; */
}

/* .ipc-metadata-list-summary-item__tc a.ipc-metadata-list-summary-item__t{
border: 1px solid aqua!important;
} */
/* (new8) RIGHT - YEAR */
.celwidget[data-testid="Filmography"] .ipc-page-section.ipc-page-section--base:last-of-type  .ipc-metadata-list-summary-item__cc{
    position: absolute !important;
    display: inline-block !important;
    min-width: 10% !important;
    max-width: 10% !important;
    right:  0 !important;
    height: 15px  !important;
    line-height: 15px  !important;
    font-size: 0.9em !important;
    text-align: center !important;
/* background: green !important; */
/* border: 1px solid brown !important; */
}
/* EPI */
.ipc-inline-list.ipc-inline-list--show-dividers.ipc-inline-list--no-wrap.ipc-inline-list--inline.ipc-metadata-list-summary-item__cbl.base {
position: relative !important;
    display: inline-block !important;
    width: 60% !important;
    min-width: 80px !important;
    max-width: 80px !important;
    height: 14px  !important;
    line-height: 11px  !important;
    margin: 2.5vh 0 0 -6vw!important;
    text-align: center !important;
/* background: green !important; */
/* border: 1px solid brown !important; */
}
.ipc-inline-list.ipc-inline-list--show-dividers.ipc-inline-list--no-wrap.ipc-inline-list--inline.ipc-metadata-list-summary-item__cbl.base .ipc-metadata-list-summary-item__li--btn {
    background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
    border: medium none;
    cursor: pointer;
    font-family: var(--ipt-font-family);
    font-size: 0.775rem !important;
    font-weight: 700;
    letter-spacing: 0.01786em;
    line-height: 0.7rem !important;
    padding: 0;
    text-decoration: inherit;
    text-transform: inherit;
}

/* (new8) RIGHT - BUTTOM MORE INFOS */
.celwidget[data-testid="Filmography"] .ipc-page-section.ipc-page-section--base:last-of-type  .ipc-icon-button.credit-card-details-button.credit-prompt-trigger {
    position: relative;
    display: inline-block;
    line-height: 0;
    padding: 1rem 0 0 1rem !important;
    border-radius: 50%;
}


/* RIGHT PANEL - RATING */
/* a.ipc-metadata-list-summary-item__t:after {
    content: "(" attr(title) ")" !important;
    float: right !important;
    margin: 0 0 0 0.5em !important;
    font-size: 0.7em !important;
color: white !important;
} */

/* (new11) LEFT PANEL - GOLD IMDb rgb(245,197,24) */
.celwidget[data-testid="Filmography"]  {
    margin: 0 0 0 0  !important;
border-right: 4px solid rgb(245,197,24)  !important;
}

/* (new11) LEFT / RIGHT INFOS - MODAL - MOVIE INFOS */
.ipc-promptable-base.ipc-promptable-dialog.enter-done {
    display: inline-block !important;
    z-index: 500000000 !important;
}
.ipc-promptable-base.ipc-promptable-dialog.enter-done  .ipc-promptable-base__panel {
    position: fixed !important;
    display: inline-block !important;
    right: 33% !important;
    top: 13vh;
border: 1px solid red;
}

/* (new11) LEFT PANEL - FILMOGRAPHY - RATING */
.celwidget[data-testid="Filmography"] .ipc-primary-image-list-card__content-mid-top {
    margin: 0vh 0 0.8vh 0 !important;
border-bottom: 1px solid red !important;
}

/* (new11) LEFT PANEL - FILMOGRAPHY - CARDS ITEMS */
.celwidget[data-testid="Filmography"] .ipc-primary-image-list-card {
    display: inline-block !important;
    flex-direction: row;
    height: 5.575rem !important;
    margin: 0vh 0 -1vh 0 !important;
    padding: 0;
    overflow: hidden;
border: 1px solid rgb(245,197,24) !important;
}
.celwidget[data-testid="Filmography"] .ipc-primary-image-list-card .ipc-primary-image-list-card__poster {
    display: block !important;
    float: left  !important;
    width: 4.27125rem;
    overflow: hidden;
/*border: 1px solid yellow !important;*/
}

.celwidget[data-testid="Filmography"] .ipc-primary-image-list-card--base .ipc-primary-image-list-card__content {
    padding: 0 0 0 0 !important;
}
/* (new11) LEFT PANEL - FILMOGRAPHY - CARDS ITEMS - TITLE */
.celwidget[data-testid="Filmography"] .ipc-primary-image-list-card__content {
    display: block !important;
    float: right !important;
    width: 73% !important;
    line-height: 1.25rem;
    padding: .5rem 0 .5rem .75rem;
    font-size: .875rem;
    letter-spacing: .01786em;
    align-content: space-between;
    overflow: hidden;
/*border: 1px solid aqua !important;*/
}
.celwidget[data-testid="Filmography"] .ipc-primary-image-list-card__content-top {
    display: inline-block !important;
    width: 100% !important;
    min-height: 4vh !important;
    max-height: 4vh !important;
    padding: 0 0 0 5px  !important;
/*border: 1px solid aqua !important;*/
}

/* (new8) TITLLE - GM - .ipc-primary-image-list-card__title[data-gm-fetched="true"] */
.ipc-primary-image-list-card__content-top a.ipc-primary-image-list-card__title {
    display: inline-block !important;
    width: 100% !important;
    height: auto !important;
    line-height: 0.9rem !important;
    padding: 0;
    text-align: left;
    letter-spacing: 0.00937em;
    font-size: 0.9rem !important;
    overflow: hidden !important;
    white-space: pre-wrap !important;
/* border: 1px solid pink !important; */
}


/* (new8) LEFT PANEL - RATING NOT FOUND */
.ipc-shoveler .ipc-primary-image-list-card__title[title="Rated RATING_NOT_FOUND by undefined users."]:after {
    content: "(No rating)" !important;
    float: right !important;
    font-size: 0.7em !important;
    opacity: 0.5 !important;
color: red !important;
}



/* (new8) NO RATING */
a.ipc-metadata-list-summary-item__t:not([title]):after {
    content: "(No rating)" !important;
/*     display: none  !important; */
    float: right !important;
    font-size: 0.7em !important;
    opacity: 0.5 !important;
color: red !important;
}

/* (new8) RATING NOT FOUND */
a.ipc-metadata-list-summary-item__t[title="Rated RATING_NOT_FOUND by undefined users."]:after {
    content: "(No rating)" !important;
    float: right !important;
    font-size: 0.7em !important;
    opacity: 0.5 !important;
color: red !important;
}

/* (new8) GM RATING - SUPP DOUBLE - RIGHT PANEL */
.ipc-accordion__item__content_inner button + a + div {
    display: none !important;
}


/* RATING - OPACITY */
/* (new8) GM RATING - OPACITY - LEFT PANEL */
.celwidget[data-testid="Filmography"] section:first-of-type .ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--wraps-at-above-l.ipc-shoveler__grid  .ipc-primary-image-list-card__title[title] + div {
    opacity: 0.5 !important;
}
/* (new8) GM RATING - OPACITY - RIGHT PANEL */
.ipc-metadata-list-summary-item__tc a.ipc-metadata-list-summary-item__t[title] + div {
/*     float: right !important; */
    opacity: 0.3 !important;
}
/* (new8) GM RATING - OPACITY - CENTER PANEL */
.ipc-md-link.ipc-md-link--entity + div[style="display: inline-block;"] {
/*     float: right !important; */
    opacity: 0.3 !important;
}

/* HOVER - LEFT / CENTER / RIGHT */
.ipc-md-link.ipc-md-link--entity:hover + div[style="display: inline-block;"]  ,
.celwidget[data-testid="Filmography"] section:first-of-type .ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--wraps-at-above-l.ipc-shoveler__grid  .ipc-list-card--span:hover  .ipc-primary-image-list-card__title[title] + div ,
.ipc-metadata-list-summary-item__tc:hover a.ipc-metadata-list-summary-item__t[title] + div {
    opacity: 1 !important;
}
.celwidget[data-testid="Filmography"] section:first-of-type .ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--wraps-at-above-l.ipc-shoveler__grid  .ipc-list-card--span:hover  .ipc-primary-image-list-card__title[title] + div > span > font ,
.ipc-primary-image-list-card__content-top > div > span > font ,
.ipc-metadata-list-summary-item__tc>div>span>font {
    opacity: 1 !important;
}
/* KNOW FOR/ CONNUE POUR - LEFT PANEL - .ipc-primary-image-list-card__title[data-gm-fetched="true"] */

.celwidget[data-testid="Filmography"] section:first-of-type .ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--wraps-at-above-l.ipc-shoveler__grid  .ipc-primary-image-list-card__title[title] + div {
    position: absolute !important;
    display: inline-block !important;
    width: 100% !important;
    min-width: 57% !important;
    max-width: 57% !important;
    bottom: 0.7vh !important;
    padding-left: 2.5em !important;
/*     opacity: 0.5 !important; */
/* border: 1px dashed aqua !important; */
}

/* (new8) TV EPIS */
.celwidget[data-testid="Filmography"] section:first-of-type .ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--wraps-at-above-l.ipc-shoveler__grid .ipc-primary-image-list-card__title-type {
    position: absolute !important;
    display: inline-block !important;
    min-height: 0.8rem !important;
    max-height: 0.8rem !important;
    line-height: 0.6rem !important;
    margin: -3vh 0 0 0 !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.7rem !important;
/* border: 1px solid green !important; */
}
/* (new8) EPISODES COUNTER */
.celwidget[data-testid="Filmography"] section:first-of-type .ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--wraps-at-above-l.ipc-shoveler__grid .ipc-primary-image-list-card__secondary-text.ipc-primary-image-list-card__secondary-text--clickable{
    position: absolute !important;
    display: inline-block !important;
    min-height: 0.9rem !important;
    max-height: 0.9rem !important;
    line-height: 0.6rem !important;
    width: 100% !important;
    min-width: 65% !important;
    max-width: 65% !important;
    bottom: 9.4vh !important;
    padding: 1px 3px !important;
    font-size: 0.7rem !important;
    text-align: right !important;
    opacity: 0.5 !important;
/* background: #333 !important; */
/* border: 1px dashed yellow !important; */
}
.celwidget[data-testid="Filmography"] section:first-of-type .ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--wraps-at-above-l.ipc-shoveler__grid .ipc-primary-image-list-card__content + a + div[style="display: inline-block;"]  {
    display: none !important;
border: 1px solid yellow !important;
}

/* (new8) FUNCTION */
.celwidget[data-testid="Filmography"] section:first-of-type .ipc-sub-grid.ipc-sub-grid--page-span-2.ipc-sub-grid--wraps-at-above-l.ipc-shoveler__grid .ipc-primary-image-list-card__content-mid-bottom {
    line-height: 10px !important;
    margin: 0 0 10px 0 !important;
/* border: 1px solid yellow !important; */
}

/* END - RATING ==== */

/* (new8) PHOTOS PAGES */
#pagecontent {
    margin: 7vh 0 0 0 !important;
    padding-bottom: 1px;
    padding-top: 1px;
}
/* (new8) PHOTO VIEWER - INFOS */
.media-viewer__media-sheet {
    position: absolute !important;
    bottom: 0vh !important;
    display: flex;
    max-height: calc(53% - 1.5rem);
    width: 100%;
    z-index: 2;
/* border: 1px solid red !important; */
}


.media-viewer__media-sheet .ipc-page-content-container > div:not([style="opacity: 1; visibility: visible;"]) {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
}
.media-viewer__media-sheet .ipc-page-content-container > div[style="opacity: 1; visibility: visible;"] {
    display: inline-block !important;
    opacity: 1 !important;
    visibility: visible !important;
/*     z-index: 50000 !important; */
/* border: 1px solid red !important; */
}
.media-viewer__media-sheet .ipc-page-content-container > .ipc-icon-border-button.media-sheet__open  {
    position: absolute;
    display: inline-block !important;
    bottom: 0.2rem;
    right: -70.2%!important;
    opacity: 0.7 !important;
    transition: opacity 0.5s ease-in 0s;
    visibility: visible;
}
.media-viewer__media-sheet .ipc-page-content-container > .ipc-icon-border-button.media-sheet__close {
    left: 99% !important;
}

/* PHOTO PLAYER */
.media-viewer {
    height: calc(100vh - 7vh) !important;
}
.media-viewer img {
    display: inline-block !important;
    min-height: 74vh !important;
    max-height: 74vh !important;
    width: 100% !important;
    min-width: 100vw !important;
    max-width: 100vw !important;
    position: absolute;
    padding: 4px !important;
    background-size: contain !important;
    background-color: #111 !important;
object-fit: contain !important;
/* border: 1px solid yellow  !important; */
}


/* END - URL-PREF - 0- IMDb Compact - New Names Pages v.3 - URL-PREF ==== */

/* ==== END  ==== */
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
