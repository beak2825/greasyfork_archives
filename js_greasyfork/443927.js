// ==UserScript==
// @name IMDb WideScreen Compact + GM Tweaks v.61
// @namespace https://greasyfork.org/fr/users/8-decembre?sort=updated
// @version 61.0.0
// @description For a large screen: Reorganize the Movie page to watch all  the principals Infos without scrolling.
// @author decembre
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.imdb.com/*
// @match *://*.streamlare.com/*
// @match *://*.m.imdb.com/*
// @match *://*.2embed.ru/*
// @match *://*.www.imdb.com/*
// @downloadURL https://update.greasyfork.org/scripts/443927/IMDb%20WideScreen%20Compact%20%2B%20GM%20Tweaks%20v61.user.js
// @updateURL https://update.greasyfork.org/scripts/443927/IMDb%20WideScreen%20Compact%20%2B%20GM%20Tweaks%20v61.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "imdb.com" || location.hostname.endsWith(".imdb.com")) || (location.hostname === "streamlare.com" || location.hostname.endsWith(".streamlare.com")) || (location.hostname === "m.imdb.com" || location.hostname.endsWith(".m.imdb.com")) || (location.hostname === "2embed.ru" || location.hostname.endsWith(".2embed.ru")) || location.href.startsWith("https://www.imdb.com/title/")) {
  css += `

  /* ==== 0- IMDb Compact - Movie Page + GM Tweaks v.61 (new61) - DEV in QUANTUM - MERGED Dark and Gray / NO (Only New Names Pages) - ALL:INITIAL - SIMPLIFIED - GLOBAL ==== */


  /* domain("imdb.com"), domain("m.imdb.com") */


  /* TEST   PB SPECIAL PAGES 
  https://www.imdb.com/title/tt31416018/
  https://www.imdb.com/title/tt23398964/
  https://www.imdb.com/title/tt12746218/?ref_=fn_tt_tt_3


  ==== */

  /* BACKGOUND IMDb - Near #222:
      background: #1f1f1f !important;
  ==== */

  /* ADD SUPPORT FOR GM:
  GM "IMDb: Link 'em all!":
  https://greasyfork.org/en/scripts/17154-imdb-link-em-all

  GM "IMDb Scout Mod" :
  https://github.com/Purfview/IMDb-Scout-Mod

  GM "IMDB bigger thumbnails/images/poster on chart pages" by Alistair1231(2022):
  https://greasyfork.org/en/scripts/428201-imdb-bigger-thumbnails-images-poster-on-chart-pages
  REquest:
  // @include       https://www.imdb.com/*

  GM "Lecture en Streaming de films et séries IMDb" (WITH 2embed- NOT WORKING):
  https://greasyfork.org/fr/scripts/437200-imdb-video-player-2embed-play-streaming-videos-from-imdb
  2024.01: FORK by Tommy0412 WITH vidsrc OK:
  https://greasyfork.org/fr/scripts/485149-imdb-video-player-vidsrc-to-play-streaming-videos-from-imdb

  GM "IMDB PLAY" ONLY work in US:
  https://greasyfork.org/en/scripts/523781-imdbplay
  IMDbPlay v.1.0.1- tweak FR (not work)
  // @match        https://www.imdb.com/fr/title/tt*
  REQUESTED:
  https://greasyfork.org/en/scripts/523781-imdbplay/discussions/304457

  TEST:

  GM "IMDb to VidFast (Unified Integration)" by mrrobot [2025.09]
  https://greasyfork.org/fr/scripts/548512-imdb-to-vidfast-unified-integration

  GM GM "IMDb to OpenSubtitles" by mrrobot [2025.09]
  https://greasyfork.org/en/scripts/550028-imdb-to-opensubtitles

  GM "IMDB YouTube Trailers Button" by 1N07 (2022) ;
  https://greasyfork.org/fr/scripts/381254-imdb-youtube-trailer-button

  GM "IMDB YouTube Trailers" by guyjz [GitHub]:
  https://gist.github.com/guyjz/5542011
  ==== */


  /* (new58) 
  TEST GM "IMDb to VidFast (Unified Integration)" by mrrobot [2025.09]
  https://greasyfork.org/fr/scripts/548512-imdb-to-vidfast-unified-integration
  === */

  #vf-main-btn {
      z-index: 500000 !important;
      filter: drop-shadow(rgba(0, 0, 0, 0.2) 0px 10px 8px);
  }
  /* VF BUTTON - VIDEO OPEN */
  body:has(iframe#vidfast-player)  #vf-main-btn {
      z-index: 500000 !important;
      filter: drop-shadow(rgba(225, 15, 15, .74) 0px -10px 8px) !important;
  }
  body:has(iframe#vidfast-player)  #vf-main-btn:before {
      content: "❌ Close" !important;
      position: absolute !important    ;
      margin:  0 0 0 10% !important;
      padding: 0 4px  !important;
      z-index: 500000 !important;
  background:rgb(18, 87, 132) !important;
  }
  /* EPISODES PLAYER */
  section:has(iframe#vidfast-player, .episode-item-wrapper ) .episode-item-wrapper:has(+iframe) button.vf-ep-btn:before {
      content: "❌ Close" !important;
      position: absolute !important    ;
      margin:  0 0 0 -3% !important;
      padding: 0 0px  !important;
      z-index: 500000 !important;
  background:rgb(18, 87, 132) !important;
  }

  /* (new58) VidFast PLAYER MOVIE PAGE (not serie pages) */
  body:not(:has([data-testid="tab-seasons"])) #vidfast-player{
      position: fixed !important;
      display: inline-block !important;
      height: 50vh !important;
      width: 66.9% !important;
      margin: 15vh 0 0 16.6% !important;
  z-index: 500000000 !important;
  }

  /* (new59) TEST GM "IMDb to OpenSubtitles" by mrrobot [2025.09]
  https://greasyfork.org/en/scripts/550028-imdb-to-opensubtitles
  === */

  /* OpenSubtitles BUTTON - MOVIES PAGES */
  button#opensub-btn {
      position: fixed;
      bottom: 1vh !important;
      right: 12% !important;
      padding: 10px 14px;
      z-index: 500000 !important;
      filter: drop-shadow(rgba(0, 0, 0, 0.2) 0px 10px 8px);
  }

  /* OpenSubtitles BUTTON - SERIES PAGES */
  body:has( .episode-item-wrapper ) button#opensub-btn {
      position: fixed;
      top: 1vh !important;
      bottom: unset !important;
      left: 130px !important;
      right: unset !important;
      padding: 10px 14px;
      z-index: 500000 !important;
      visibility: visible !important;
      filter: drop-shadow(rgba(0, 0, 0, 0.2) 0px 10px 8px);
  }



  /* (new55) TEST GM "IMDB PLAY" work in US
  https://greasyfork.org/en/scripts/523781-imdbplay
  IMDbPlay v.1.0.1- tweak FR (not work)
  // @match        https://www.imdb.com/fr/title/tt*
  ==== */
  div:has(iframe[src^="https://proxy.garageband.rocks/embed"]) {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50000000 !important;
  }


  /* (new52) TEST - SMALL AND DARK AND GRAY SCROLLBAR IMDB */
  /*:root {
    --custom-thumb-color: red !important;
    --custom-track-color:blue  !important;
    --custom-width: thin !important;
    --custom-thumb-color-hover: rgba(140, 141, 142, .8);
    --custom-track-color-hover: rgba(0, 0, 0, 0);
    --webkit-scrollbar-width-height: 2px !important;
    --webkit-scrollbar-border-radius: 0px;
    --workaround-gh-scrollbars: 1;
  }*/
  /* (new52) TEST - SMALL AND DARK AND GRAY SCROLLBAR - WEB KIT SCROLL BAR */
  *:not(select) {
    scrollbar-color: rgba(41, 42, 43, .6) rgba(168, 169, 170, .6)!important;
    scrollbar-width: thin !important;
  }
  /* Chrome and derivatives*/
  ::-webkit-scrollbar {
      max-width: 2px !important;
      max-height: 2px !important;
      background: rgba(183, 183, 183, .6) !important;
  }
  ::-webkit-scrollbar-corner,
  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-track-piece {
      background: #4a4a4a !important;
  }
  ::-webkit-scrollbar-thumb {
    background: #a4a4a4 !important;
    border-radius: 0px !important;
  }
  ::-webkit-scrollbar-corner:hover,
  ::-webkit-scrollbar-track:hover,
  ::-webkit-scrollbar-track-piece:hover {
    background: #dadae3 !important;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #737373!important;
  }

  /* (new31) For GM: "IMDB bigger thumbnails/images/poster on chart pages"
  REQUEST:
  https://greasyfork.org/fr/scripts/428201-imdb-bigger-thumbnails-images-poster-on-chart-pages/discussions/179078#comment-390028

  SEARCH PAGES - RESULTS - MOVIES /PERSONS:
  MOVIES: [data-testid="find-results-section-title"] .ipc-image  
  AND
  PERSON: [data-testid="find-results-section-name"]

  === */

  .ipc-page-section[data-testid="find-results-section-name"] .ipc-media.ipc-media__img img ,
  .ipc-page-section[data-testid="find-results-section-title"] .ipc-media.ipc-media__img img {
      display: inline-block !important;
      width: 100% !important;
      min-width: 50px !important;
      max-width: 50px !important;
      height: 100% !important;
      min-height: 74px  !important;
      max-height: 74px  !important;
      object-fit: contain !important;
  border: 1px solid yellow  !important;
  }

  /* (new17) GM "IMDb Youtube Trailer Button" */
  .hoyJOH.hide-videoPreview {
      opacity: 1 !important;
      transition: visibility 0s ease 0.5s, opacity 0.5s linear 0s;
      visibility: visible !important;
  }
  /* (new14) MORE OPTION VIEW */
  .ipc-promptable-base.ipc-promptable-dialog.enter-done {
      display: inline-block !important;
      z-index: 500000000 !important;
  }
  .ipc-promptable-base.ipc-promptable-dialog.enter-done .ipc-promptable-base__panel {
      position: fixed !important;
      display: inline-block !important;
      right: 0;
      top: 13vh;
  border: 1px solid red;
  }


  /* (new13) MENU TOTAL */
  .drawer__state:checked ~ .drawer {
      z-index: 5000000 !important;
  }

  /* (new26) INFOS UNDER TITLE - BACKGROUND CONTAINER */
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div:last-of-type {
      /*background-color: #111 !important;*/
  }

  /* (new23) BOTTOM INFOS METADATAS - REAL / SCEN /CAST PRINCIP  */
  section.ipc-page-section.cxinTq > div:last-of-type.dxVPLZ .bHJsUC .fjLeDR[data-testid="title-pc-wide-screen"] ul.ipc-metadata-list.ipc-metadata-list--dividers-all.title-pc-list > li {
      position: relative;
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      width: 100% !important;
      min-width: 64vw !important;
      line-height: 0.2rem;
      min-height: 1.5rem;
      padding-bottom: 0.1rem;
      z-index: 0;
  border-bottom: 1px solid #333 !important;
  }
  /* (new23) BOTTOM INFOS METADATAS - RIGHT PANEL - OPTIONS / ADD LIST / AVIS  */
  .lceYKq {
      position: fixed !important;
      display: flex;
      flex-direction: column;
      width: 16% !important;
      max-width: 16% !important;
      right: 0 !important;
      top: 6.2vh !important;
      padding: 2rem 0.5rem !important;
  border: 1px solid #333 !important;
  }
  .lceYKq .ipc-inline-list.ljTGVt.baseAlt li {
      display: inline-block;
      vertical-align: middle;
      width: 100% !important;
      text-align: right !important;
  }

  .ipc-metadata-list__item.bTCsQp {
      display: none !important;
  }
  /* (new25) DETAILS CENTER - TOTAL CONTAINER */
  .ipc-page-section.ipc-page-section--baseAlt.ipc-page-section--tp-none.ipc-page-section--bp-xs {
      top: 0vh !important;
  }

  /* (new47) DETAILS under TITLE */
  .ipc-page-section.ipc-page-section--baseAlt.ipc-page-section--tp-none.ipc-page-section--bp-xs > div:last-of-type {
      /*background: #111 !important;*/
  }
  /* (new49) PB SPECIAL PAGE - DETAILS under POSTER - :not(.doBMpp)
  https://www.imdb.com/title/tt23398964/
  https://www.imdb.com/title/tt25650046/
  === */
  /* (new50) NORMAL - POSTER + TRAILLER + FOLDER  */


  .ipc-page-section.ipc-page-section--baseAlt.ipc-page-section--tp-none.ipc-page-section--bp-xs > div:last-of-type > div:first-of-type  {
      float: left  !important;
      max-height: 47vh !important;
      width: 100% !important;
      min-width: 20% !important;
      margin: 0vh 0 26vh 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  }
  .ipc-page-section.ipc-page-section--baseAlt.ipc-page-section--tp-none.ipc-page-section--bp-xs > div:last-of-type > div:first-of-type .ipc-poster .ipc-media img {

      max-height: 47vh !important;
      width: 100% !important;
      margin: 0vh 0 0vh 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      object-fit: contain !important;
  background: #111 !important;
  }

  /* (new59) :not(:has(.episode-item-wrapper)) */
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full:not(:has(.episode-item-wrapper)) > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div:last-of-type > div:last-of-type {
      display: inline-block !important;
      clear: both !important;
      min-height: 32.2vh !important;
      max-height: 32.2vh !important;
      width: auto !important;
      margin: 0vh 0 0 0 !important;
      padding-bottom: 0 !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  }
  /* (new45) OLD DESIGN - POSTER + DESC = .gFpQdY = :not(:has(.episode-item-wrapper)) */
  #__next main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full:not(:has(.episode-item-wrapper)) > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div + div + div > .gFpQdY{
      min-height: 32.2vh !important;
      max-height: 32.2vh !important;
      margin: -45vh 0 0 0 !important;
      padding-bottom: 0 !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  }

  /* (new59) :not(:has(.episode-item-wrapper)) */
  main.ipc-page-wrapper--base:not(:has(.episode-item-wrapper)) .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div:last-of-type > div:last-of-type .ipc-chip-list + p + div ul.ipc-metadata-list li .ipc-html-content .ipc-html-content-inner-div {
      position: relative !important;
      display: inline-block !important;
      height: 100% !important;
      min-height: 2vh !important;
      max-height: 2vh !important;
      line-height: 2vh !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      font-size: 13px !important;
  color: gold !important;
  }

  /* (new59) PB SPECIAL PAGE - MOVIES DETAILS CONTAINER = :not(:has(.episode-item-wrapper)) =
  https://www.imdb.com/title/tt12746218/?ref_=fn_tt_tt_3
  https://www.imdb.com/title/tt23398964/
  === */
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full:not(:has(.episode-item-wrapper)) > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div:last-of-type > div:last-of-type > div {
      float: left !important; 
      width: 100% !important;
      margin: 3px 5px 0 10px !important;
      padding: 0 5px  !important;
  }
  /* (new59) MOVIES DETAILS CONTAINER - ADD TO LIST FAVS - BOTTOM / LEFT = :not(:has(.episode-item-wrapper)) */
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full:not(:has(.episode-item-wrapper)) > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div:last-of-type > div:last-of-type > div + div {
      position: fixed !important;
      float: none !important; 
      width: 15% !important;
      height: 10vh !important;
      left: 0 !important;
      bottom: 0;
      margin: 3px 5px 0 10px !important;
      padding: 0 5px  !important;
  /*border: 1px solid aqua  !important;*/
  }


  /* (new54) MOVIES REVIEW PAGES  */
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section:has([data-testid="more-from-header"]) {
      
      width: 32% !important;
      height: 20vh !important;
      margin: 3px 0px 0 2% !important;
      padding: 5px 5px  !important;
  /*border: 1px solid aqua  !important;*/
  }


  main.ipc-page-wrapper--base:has(a.ipc-link[data-testid="back-button"][href^="/title/"]) .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type .ipc-title.ipc-title--baseAlt.ipc-title--subpage-title.ipc-title--on-textPrimary h1:after {
      content: "⫸" !important;
      margin: 0px 5px 0 15px !important;
  color: gold  !important;
  }


  /* REVIEW - BACK BUTTON */
  /* .ipc-page-content-container.ipc-page-content-container--center + div.ipc-page-content-container.ipc-page-content-container--center  a.ipc-link[data-testid="back-button"][href^="/title/"]*/


  main.ipc-page-wrapper--base:has(a.ipc-link[data-testid="back-button"][href^="/title/"]) .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base:has(.ipc-page-grid__item.ipc-page-grid__item--span-2):not(:hover)   {
      position: fixed !important;
      display: inline-block !important;
      float: none !important; 
      width: 45% !important;
      min-height: 93vh !important;
      right: 0 !important;
      top: 6.5vh !important;
      border-radius: 5px 0 0 5px !important;
  border: 1px solid gold  !important;
  }
  main.ipc-page-wrapper--base:has(a.ipc-link[data-testid="back-button"][href^="/title/"]) .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base:has(.ipc-page-grid__item.ipc-page-grid__item--span-2):hover   {
      position: fixed !important;
      display: inline-block !important;
      float: none !important; 
      width: 45% !important;
      min-height: 93vh !important;
      right: 0 !important;
      top: 6.5vh !important;
      border-radius: 5px 0 0 5px !important;
  border: 1px solid gold !important;
  }

     
  /* (new47)PB SPECIAL PAGE
  https://www.imdb.com/title/tt23398964/
  https://www.imdb.com/title/tt12746218/
  https://www.imdb.com/title/tt13482796/
  === */

  /* (new59) SPECIAL CASES == see title MANY NOT = - NOT SERIES :not(:has(.episode-item-wrapper))
  https://www.imdb.com/title/tt32278766/
  :not(.gEmxJt) 
  ==== */
  main.ipc-page-wrapper--base:not(:has(.episode-item-wrapper)) .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div:last-of-type > div:last-of-type:not(.lnlBxO):not(.bvzCJs):not(.Qmxbt):not(.zHrZh):not(.hRFwwJ){
      position: relative  !important;
      display: block !important;
      float: left !important;
      clear: none !important;
      width: 100% !important;
      height: 100% !important;
      min-height:24vh !important;
      max-height: 24vh !important;
      margin: 0vh 0 0 0 !important;
      top: 0vh !important;
      padding: 0 10px 0 10px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  /*border: 1px solid aqua  !important;*/
  }

  /* (new50) CORRECTION FOR NORMAL */
  .ipc-page-section.ipc-page-section--baseAlt.ipc-page-section--tp-none.ipc-page-section--bp-xs > div:last-of-type > div:first-of-type{
      position: relative  !important;
      float: left !important;
      clear: none !important;
      width: 100% !important;
      max-height: 54vh !important;
      margin: 0vh 0 0 0 !important;
      top: 0vh !important;
      padding: 0 10px 0 0 !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  }

  /* (new59) :not(:has(.episode-item-wrapper)) */
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full:not(:has(.episode-item-wrapper)) > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div:last-of-type > div:last-of-type.bvzCJs:not(.lnlBxO){
      position: relative  !important;
      display: inline-block !important; 
      width: 100% !important;
      min-height: 3vh !important;
      max-height: 33vh !important;
      margin: -47vh 0 0 0 !important;
      top: 0vh !important;
      padding: 0 !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  }

  /* (new32) TEST - INFO RIGH - SPEC TECHNICAL PAGE - OUTSIDE RIGHT PANEL -  for SPECIFIC PAGE:
  https://www.imdb.com/title/tt0237572/technical
  === */
  .ipc-page-section.ipc-page-section--baseAlt.ipc-page-section--tp-xs.ipc-page-section--bp-xs > div > hgroup {
      display: inline-block !important;
  border: 1px solid #333 !important;
  }

  /* (new34) SERIES  A VOIR */
  /*
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type  section.ipc-page-background.ipc-page-background--base .ipc-page-grid__item.ipc-page-grid__item--span-2 > div + .ipc-page-section.ipc-page-section--base {
      position: fixed;
      left: 20% !important;
      top: 26vh !important;
      border-radius: 0 0 5px 5px !important;
      z-index: -1 !important;
      pointer-events: none  !important;
  border: 1px solid red !important;
  }

  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base:hover .ipc-page-grid__item.ipc-page-grid__item--span-2 > div + .ipc-page-section.ipc-page-section--base{
  }
  */

  /* (new33) TEST - INFO RIGH - SPEC TECHNICAL PAGE - TEST SERIES - OUTSIDE RIGHT PANEL 
  https://www.imdb.com/title/tt18413548/episodes/?year=2023
  https://www.imdb.com/title/tt7707100/episodes/
  ==== */

  /* (new61) - SERIES - SEARCH PAGE 
  https://www.imdb.com/fr/search/title/?count=250&series=tt0773262&sort=user_rating,desc
  == */
  .ipc-page-background.ipc-page-background--base:has([data-testid^="selected-input-chip-list-series-"]) {
      color: silver !important;
      background: red !important;
  }
  .ipc-page-background.ipc-page-background--base:has([data-testid^="selected-input-chip-list-series-"]) > div {
      color: silver !important;
      background: #333 !important;
  }

  /* (new61) SERIES - INFO RIGH - SERIES - LIST */
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section:has([data-testid="tab-seasons"])  {
      position: fixed !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      height: 79vh !important;
      left: 22% !important;
      top: 20vh !important;
      padding: 0vh 5px 5px 5px !important;
      overflow: hidden !important;
      pointer-events: auto !important;
      z-index: 50000000 !important;
  border: 1px solid #333 !important;
  }
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section section + section:not(:has(#next-year-btn)) {
      display: inline-block !important;
      width: 100% !important;
      height: 71.7vh !important;
      padding: 0vh 5px 5px 5px !important;
      overflow: hidden auto !important;
      z-index: -1 !important;
      pointer-events: auto !important;
  border: 1px solid red !important;
  }

  /* SERIES CARDS */
  /*.ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section article {
  border: 1px solid silver !important;
  }*/
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section:has([data-testid="tab-seasons"], .episode-item-wrapper) article.episode-item-wrapper {
      display: inline-block !important;
      width: 100% !important;
      min-width: 32.5% !important;
      max-width: 32.5% !important;
      min-height: 28vh !important;
      max-height: 28vh !important;
      margin: 5px 4px 5px 10px !important;
      padding: 5px 5px  !important;
      border-radius: 5px !important;
  box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.3) inset !important;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  border: 1px solid red !important;
  }



  /* (new59) SERIES - INFO RIGH - TAB - TAB  */
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin section:has(.ipc-tabs--display-tab) .ipc-tabs--display-tab ul > a {
      height: 20px  !important;
  }
  /*.ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section .ipc-tabs--display-chip ul li.ipc-tab {
      height: 20px  !important;
  }*/

  /* (new59) SERIES - INFO RIGH - TAB - CHIP YEAR / NUMBERS  */
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin section:has(.ipc-tabs--display-tab) .ipc-tabs--display-chip ul a {
      height: 20px  !important;
  }



  /* (new59) SERIES - INFO RIGHT - TAB - CHIP YEAR / NUMBERS - BUTTON NEXT YEAR */
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin button#next-year-btn  {
      position: fixed !important;
      display: inline-block !important;
      width: 5% !important;
      height: 3vh !important;
      left: 47.5% !important;
      top:  22.5vh !important;
      padding: 0 !important;
      z-index: 1000 !important;
      pointer-events: auto !important;
  background: olive !important;
  border: 1px solid #333 !important;
  }

  /* (new61) SPOILER - BUT CLOSED */
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-2 > div + .ipc-page-section.ipc-page-section--base > div:first-of-type + div:not([data-testid="sub-section-summaries"]):not(:has([data-testid="rating-item"])) {
      position: fixed !important;
      display: inline-block !important;
      max-width: 9% !important;
      height: 3vh !important;
      top: 16vh !important;
      left: 43% !important;
      margin: 0px 0 0 0px !important;
      padding: 0 6px !important;
      border-radius: 5px  !important;
      pointer-events: auto !important;
  background: red  !important;
  }
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-2 > div + .ipc-page-section.ipc-page-section--base > div:first-of-type + div:not([data-testid="sub-section-summaries"]):not(:has([data-testid="rating-item"])) span.gtjlxC button ,

  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-2 > div + .ipc-page-section.ipc-page-section--base > div:first-of-type + div:not([data-testid="sub-section-summaries"]):not(:has([data-testid="rating-item"])) .gtjlxC {
      display: inline-block;
      max-height: 3vh !important;
      min-height: 3vh !important;
      margin: 0 0 0 0 !important;
      padding: 0 !important;
  }

  /* SPOILER - BUT OPEN */
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-2 > div + .ipc-page-section.ipc-page-section--base > div:first-of-type + .ipc-signpost--center-aligned {
      position: fixed !important;
      display: inline-block !important;
      max-width: 3% !important;
      height: 2vh !important;
      top: 16vh !important;
      left: 43% !important;
      margin: 0px 0 0 0px !important;
      text-align: center !important;
      pointer-events: auto !important;
  }
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-2 > div + .ipc-page-section.ipc-page-section--base > div:first-of-type + .ipc-signpost--center-aligned .ipc-signpost__text{
      transition: all ease 0.7s !important;
  }
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-2 > div + .ipc-page-section.ipc-page-section--base > div:first-of-type + .ipc-signpost--center-aligned .ipc-signpost__text:after{
      content: "︾" !important;
      display: inline-block !important;
      height: 2vh !important;
      vertical-align: top  !important;
      line-height: 16px  !important;
      margin: 3px 0 0 10px !important;
  }

  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-2 > div + .ipc-page-section.ipc-page-section--base > div:first-of-type + .ipc-signpost--center-aligned .ipc-signpost__text:hover {
      transition: all ease 0.7s !important;
      display: inline-block !important;
      font-size: 17px  !important;
  color: gold  !important;
  }
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-2 > div + .ipc-page-section.ipc-page-section--base > div:first-of-type + .ipc-signpost--center-aligned + div {
      position: fixed !important;
      display: inline-block !important;
      width: 31% !important;
      height: 0vh !important;
      top: 18vh !important;
      left: 23% !important;
      margin: 0 0 0 0 !important;
      padding: 0!important;
      overflow: hidden !important;
      overflow-y: auto !important;
      pointer-events: auto !important;
      transition: height ease 0.7s !important;
  }
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-2 > div + .ipc-page-section.ipc-page-section--base > div:first-of-type + .ipc-signpost--center-aligned:hover + div ,

  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-2 > div + .ipc-page-section.ipc-page-section--base > div:first-of-type + .ipc-signpost--center-aligned + div:hover {
      position: fixed !important;
      display: inline-block !important;
      width: 31% !important;
      height: 81vh !important;
      top: 18vh !important;
      left: 23% !important;
      margin: 0 0 0 0 !important;
      padding: 2px 5px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      pointer-events: auto !important;
      transition: height ease 0.7s !important;
  border-left: 4px solid red !important;
  }

  /* (new34) CITATIONS */
  .ipc-page-background.ipc-page-background--baseAlt[data-testid="atf-wrapper-bg"] + script + .ipc-page-content-container.ipc-page-content-container--center > section {
      display: inline-block !important;
      max-height: 75vh !important;
      margin: 0vh 0 0 0 !important;
      padding: 3px 0 0 0 !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  border: 1px solid #333 !important;
  }

  /* SIDEBAR */
   main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .gYStnb.ipc-page-grid__item.ipc-page-grid__item--span-2.gYStnb {
      height: auto !important;
      max-height: unset !important;
      padding: 3px 0 0 0 !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  border-left: 3px solid brown !important;
  }
  .ipc-page-background.ipc-page-background--baseAlt[data-testid="atf-wrapper-bg"] + script + .ipc-page-content-container.ipc-page-content-container--center > section .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-2 .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin.kQFtxi {
      padding: 0px 0 0 0 !important;
  }

  /* (new43) NO SIDEBAR */
  .ipc-page-background.ipc-page-background--baseAlt[data-testid="atf-wrapper-bg"] + script + .ipc-page-content-container.ipc-page-content-container--center > section .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-2 {
      display: inline-block !important;
      width: 100% !important;
      max-height: 88.9vh !important;
      padding: 3px 0 0 0 !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  border-left: 3px solid olive !important;
  }
  .ipc-page-background.ipc-page-background--baseAlt[data-testid="atf-wrapper-bg"] + script + .ipc-page-content-container.ipc-page-content-container--center > section .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-2 .hzfff  {
      margin: 0 0 0 0 !important;
  }


  /* (new34) CITATIONS - ADD CONTRIB */
  .ipc-page-background.ipc-page-background--base .ipc-page-content-container.ipc-page-content-container--center .ipc-page-grid.ipc-page-grid--bias-left .gYStnb.ipc-page-grid__item.ipc-page-grid__item--span-2 .ipc-page-section.ipc-page-section--base:first-of-type ~ .ipc-page-section.ipc-page-section--base.celwidget {
      display: none !important;
  }
  /* SIDEBAR */
   main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .gYStnb.ipc-page-grid__item.ipc-page-grid__item--span-2.gYStnb + .ipc-page-grid__item.ipc-page-grid__item--span-1 {
      height: auto !important;
      max-height: unset !important;
      padding: 3px 0 0 0 !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  border-left: 3px solid brown !important;
  }
  /* NO SIDEBAR */
  .ipc-page-background.ipc-page-background--baseAlt[data-testid="atf-wrapper-bg"] + script + .ipc-page-content-container.ipc-page-content-container--center > section .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-1 {
      display: inline-block !important;
      max-height: 88.7vh !important;
      padding: 3px 0 0 0 !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      border-left: 3px solid olive !important;
  }
  .ipc-page-background.ipc-page-background--baseAlt[data-testid="atf-wrapper-bg"] + script + .ipc-page-content-container.ipc-page-content-container--center > section .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-1 .ipc-page-section.ipc-page-section--base.right-rail-more-to-explore  {
      padding: 5px 0 !important;
  }
  .ipc-page-background.ipc-page-background--baseAlt[data-testid="atf-wrapper-bg"] + script + .ipc-page-content-container.ipc-page-content-container--center > section .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-1 .ipc-page-section.ipc-page-section--base.right-rail-more-to-explore .ipc-title {
      margin: 0px 0 !important;
  }
  .ipc-page-background.ipc-page-background--baseAlt[data-testid="atf-wrapper-bg"] + script + .ipc-page-content-container.ipc-page-content-container--center > section .ipc-page-grid.ipc-page-grid--bias-left .ipc-page-grid__item.ipc-page-grid__item--span-1 .ipc-page-section.ipc-page-section--base.right-rail-more-to-explore .ipc-page-section--bp-none {
      margin: 0px 0 !important;
  }


  /* (new59) SERIES - INFO RIGH - LIST ITEMS = .ipc-page-content-container--full:has(.episode-item-wrapper) */
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section .jNjsLo {
      display: inline-block !important;
  }
  .ipc-page-content-container--full:has(.episode-item-wrapper) .ipc-page-content-container--center[role="presentation"]:has(hgroup):not(:first-of-type) {
      width: 55% !important;
      margin: 0px 0 !important;
  border: 1px solid aqua !important;
  }

  /* SERIE - TOP LEFT */
  .ipc-page-content-container--full:has(.episode-item-wrapper) .ipc-page-content-container--center[role="presentation"]:has(hgroup):not(:first-of-type) .ipc-page-section--tp-xs {
      width: 100% !important;
      height: 14vh !important;
      margin: 0px 0 0 0 !important;
      padding: 2.5vh 0 0 0 !important;
      z-index: 50000000000 !important;
  /*border: 1px solid pink !important;*/
  }
  .ipc-page-content-container--full:has(.episode-item-wrapper) .ipc-page-content-container--center[role="presentation"]:has(hgroup):not(:first-of-type) >  section > section {
      width: 100% !important;
      height: 15vh !important;
      margin: 0px 0 !important;
      padding: 0 0 0 0 !important;
      overflow: hidden !important;
  /*border: 1px solid blue !important;*/
  }

  /* SERIE - BACK */
  .ipc-page-content-container--full:has(.episode-item-wrapper) .ipc-page-content-container--center[role="presentation"]:has(hgroup):not(:first-of-type) .ipc-page-section--tp-xs > div:has(svg.ipc-icon.ipc-icon--arrow-left)  {
      position: fixed !important;
      display: inline-block !important;
      margin: 0 0 0 0 !important;
      top: 2vh !important;
      z-index: 50000000000 !important;
  }
  /* SERIE - TOP - TITLE */
  .ipc-page-content-container--full:has(.episode-item-wrapper) .ipc-page-content-container--center[role="presentation"]:has(hgroup):not(:first-of-type) .ipc-page-section--tp-xs > div:not(:has(svg.ipc-icon.ipc-icon--arrow-left)) {
      width: 100% !important;
      max-height: 14vh !important;
      margin: 0px 0 0 0 !important;
      padding: 0vh 0 0 0 !important;
      overflow: visible  !important;
  /*z-index: 50000000000 !important;*/
  /*border: 1px solid lime !important;*/
  }
  .ipc-page-content-container--full:has(.episode-item-wrapper) .ipc-page-content-container--center[role="presentation"]:has(hgroup):not(:first-of-type) .ipc-page-section--tp-xs > div:not(:has(svg.ipc-icon.ipc-icon--arrow-left)) > div:has(.ipc-poster) + hgroup{
      display: block !important;
      float: left !important;
      width: 100% !important;
      min-height: 11vh !important;
      max-height: 11vh !important;
      margin: 0px 0 0 -10px !important;
      padding: 0vh 5px 5px 19px !important;
  /*border: 1px solid aqua!important;*/
  }

  /* SERIE - TOP - COUV */
  .ipc-page-content-container--full:has(.episode-item-wrapper) .ipc-page-content-container--center[role="presentation"]:has(hgroup):not(:first-of-type) .ipc-page-section--tp-xs > div:not(:has(svg.ipc-icon.ipc-icon--arrow-left)) > div:has(.ipc-poster)  {
      display: inline-block !important;
      width: 100% !important;
      min-width: 15% !important;
      max-width: 15% !important;
      height: auto !important;
      min-height: 11vh !important;
      max-height: 11vh !important;
      margin: 0px 0 0 0 !important;
      left: 0px!important;
      top: 0px !important;
      padding: 0vh 0 0vh 0 !important;
      overflow: hidden  !important;
  /*z-index: 50000000000 !important;*/
  /*border: 1px solid aqua !important;*/
  }
  .ipc-page-content-container--full:has(.episode-item-wrapper) .ipc-page-content-container--center[role="presentation"]:has(hgroup):not(:first-of-type) .ipc-page-section--tp-xs > div:not(:has(svg.ipc-icon.ipc-icon--arrow-left)) > div:has(.ipc-poster) .ipc-poster.ipc-poster--dynamic-width  {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: auto !important;
      min-height: 11vh !important;
      max-height: 11vh !important;
      margin: 0px 0 0 0 !important;
      left: 5px!important;
      top: 0px !important;
      padding: 0vh 0 0vh 0 !important;
      border-radius: 5px 0 0 5px  !important;
      overflow: hidden  !important;
  /*z-index: 50000000000 !important;*/
  /*border: 1px solid aqua !important;*/
  }


  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section:has(.episode-item-wrapper) {
  display: inline-block !important;
      width: 55% !important;
      margin: 0 4px 6px -22% !important;
  }

  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section article .ipc-overflowText--children  {
      width: 95% !important;
      height: 100% !important;
      min-height: 15.5vh !important;
      max-height: 15.5vh !important;
      line-height: 1.7vh !important;
      overflow: hidden auto !important;
  /*border: 1px solid red !important;*/
  }

  /* (new59) SERIES - +NOTE / RIBBON / COUV */
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section article .ipc-watchlist-ribbon--m {
      height: 15px  !important;
      width: 15px  !important;
      font-size: 10px  !important;
  }
  /* (new59) SERIES - ITEMS - COUV 
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section article .ipc-slate
  === */
  .episode-item-wrapper .ipc-slate.ipc-sub-grid-item {
      display: block !important;
      float: left !important;
      width: 55% !important;
      margin:  0 10px 0 0 !important;
      visibility: visible !important;
      opacity: 1 !important;
  /*border: 1px solid red !important;*/
  }

  /* SERIE - ITEMS - TOP RATED INDICATOR */
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section article .ipc-signpost--left-aligned {
      position: absolute !important;
      justify-content: left;
      margin: 0 0 0 0 !important;
      right: -32% !important;
      top: 5vh !important;
      padding-right: 0.6rem;
  transform: rotate(-90deg) scale(0.5) !important;
  }

  /* SERIE - ITEMS - TITTLE  */
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section .ipc-list-card:last-of-type > div .iydVqr ,
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section .ipc-list-card:last-of-type > div ,
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section .ipc-list-card:last-of-type {
      display: inline-block !important;
      box-shadow: none !important;
      background: transparent !important;
  /*border: 1px solid green !important;*/
  }

  /*.ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section article .ipc-title{
      display: block !important;
      float: left !important;
      width: 100% !important;
      height: 2vh !important;
      padding: 5px 5px 5px 19px !important;
  border: 1px solid aqua!important;
  }*/

  /* SERIE - ITEMS - TITLE */
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section article h4 {
      position: absolute !important;
      display: block !important;
      float: left !important;
      clear: none !important;
      width: 100% !important;
      min-width: 225% !important;
      max-width: 225% !important;
      margin:  -2vh 0 0 -130% !important;
      padding: 0 0 0 0px !important;
  /*border: 1px dotted aqua !important;*/
  }

  /* (new61) SERIE - ITEMS - DATE - with OPTION VISIO */
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section:has(button .ipc-btn__text) article h4 + span {
      position: absolute !important;
      display: inline-block !important;
      float: none !important;
      width: 100% !important;
      min-width: 95% !important;
      max-width: 95% !important;
      bottom: -4.5vh !important;
      left:  -132% !important;
      padding: 0 0 0 0px !important;
  /*border: 1px solid pink !important;*/
  }
  /* (new61) SERIE - ITEMS - DATE - without OPTION VISIO */
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section:not(:has(button .ipc-btn__text)) article h4 + span {
      position: absolute !important;
      display: inline-block !important;
      float: none !important;
      width: 100% !important;
      min-width: 95% !important;
      max-width: 95% !important;
      bottom: -8.5vh !important;
      left:  -132% !important;
      padding: 0 0 0 0px !important;
  /*border: 1px solid aqua !important;*/
  }

  /* (new61) SERIE - ITEMS - RATING - with OPTION VISIO */
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section article:has(button .ipc-btn__text) [data-testid="ratingGroup--container"] {
      position: absolute !important;
      display: inline-block !important;
      float: none !important;
      width: 100% !important;
      min-width: 95% !important;
      max-width: 95% !important;
      bottom: -4.7vh !important;
      left:  0% !important;
      padding: 0 0 0 0px !important;
  /*border: 1px solid pink !important;*/
  }
  /* (new61) SERIE - ITEMS - RATING - without OPTION VISIO */
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section article:not(:has(button .ipc-btn__text)) [data-testid="ratingGroup--container"] {
      position: absolute !important;
      display: inline-block !important;
      float: none !important;
      width: 100% !important;
      min-width: 95% !important;
      max-width: 95% !important;
      bottom: -8.5vh !important;
      left:  0% !important;
      padding: 0 0 0 0px !important;
  /*border: 1px solid aqua !important;*/
  }
  /* SERIE - ITEMS - SYNOPSIS */
  .episode-item-wrapper .ipc-slate.ipc-sub-grid-item + div .ipc-overflowText.ipc-overflowText--base .ipc-html-content-inner-div {
      display: block !important;
      float: right !important;

      min-height: 15vh !important;
      max-height: 15vh !important;

      line-height: 15px  !important;
      bottom: 0vh !important;
      right: 0 !important;
      padding: 2vh 5px 0 5px !important;
      font-size: 15px  !important;
      overflow: hidden auto !important;
      z-index: 500 !important;
      visibility: visible !important;
  /*color: red !important;*/
  /*border: 1px solid pink !important;*/
  }
  /*.ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section article .fWClyX:hover {
      visibility: visible !important;
      max-width: 100% !important;
      color: red !important;
  }
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section article .fWClyX:not(:hover):before {
      content: "📄 ▲"  !important;
      position: absolute !important;
      display: inline-block !important;
      bottom: 0vh !important;
      right: 0 !important;
      font-size: 15px !important;
      visibility: visible !important;
      opacity: 0.5 !important;
  color: red !important;
  }
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section article .fWClyX .ipc-html-content-inner-div {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      line-height: 15px  !important;
      padding: 5px  5px  5px  5px  !important;
      border-radius: 5px 5px  0 0 !important;
      font-size: 15px  !important;
      letter-spacing: .02125em !important;
  color: silver !important;
  border: 1px solid red  !important;
  }
  */
  /* BUT SYNOPSIS */
  /*.ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section article .fWClyX .bEqLbZ {
      position: absolute !important;
      min-height: 15px !important;
      max-height: 15px !important;
      width: 10px  !important;
      margin:  0 0 0 0 !important;
      bottom: 0 !important;
      right: 0 !important;
      border-radius: 5px 0 0 5px !important;
      visibility: visible !important;
      padding: 1px 0.2rem !important;
  border: 1px solid red !important;
  }
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section article .fWClyX .bEqLbZ span {
      font-size: 0 !important;
  }
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin + section article .fWClyX .bEqLbZ span:before {
      content: "+"  !important;
      font-size: 15px !important;
      visibility: visible !important;
  }
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin:not(.kkcfLp) .jPRxOq {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap !important;
      max-height: 55vh !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      pointer-events: auto !important;
  }
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin:not(.kkcfLp) .jPRxOq .bGxjcH.episode-item-wrapper ,
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin:not(.kkcfLp) .jPRxOq .bGxjcH.episode-item-wrapper + .episode-item-wrapper {
      display: inline-block !important;
      height: 6vh !important;
      width: 48% !important;
      margin: 3px 4px 4px 3px !important;
      padding: 5px 2px !important;
      border-radius: 5px  !important;
  }
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin:not(.kkcfLp) .jPRxOq .bGxjcH.episode-item-wrapper .ipc-list-card {
      display: inline-block !important;
      height: 100% !important;
      width: 100% !important;
      margin: 0px 0px 0px 0px !important;
  }
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin:not(.kkcfLp) .jPRxOq .bGxjcH.episode-item-wrapper + .episode-item-wrapper .ipc-list-card {
      display: inline-block !important;
      height: 100% !important;
      width: 100% !important;
      margin: 0px 0px 0px 0px !important;
  }
  */
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin:not(.kkcfLp) .jPRxOq .bGxjcH.episode-item-wrapper .jHvXSo ,
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin:not(.kkcfLp) .jPRxOq .bGxjcH.episode-item-wrapper .ipc-signpost ,
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin:not(.kkcfLp) .jPRxOq .bGxjcH.episode-item-wrapper .ipc-watchlist-ribbon ,
  .ipc-page-section.ipc-page-section--base.ipc-page-section--sp-pageMargin:not(.kkcfLp) .jPRxOq .bGxjcH.episode-item-wrapper .ipc-text-button {
      display: none  !important;
  }

  /* (new41) NUMBER of SEASONS :not(:hover) */
  [data-testid="hero-subnav-bar-left-block"]:not(:empty){
      position: fixed !important;
      height: 2.5vh !important;
      bottom: 1vh !important;
      left: 62.7vw !important;
      padding: 0 14px !important;
      border-radius: 5px !important;
      font-size: 15px !important;
      z-index: 500 !important;
  color: red !important;
  }
  [data-testid="hero-subnav-bar-left-block"]:empty{
       display: none !important;
  }


  /* (new43) PB SPECIAL PAGES 
  https://www.imdb.com/title/tt23398964/
  == */
  .ipc-page-section.ipc-page-section--baseAlt.ipc-page-section--tp-none.ipc-page-section--bp-xs .bTLVGY + .kbbKze{
      position: relative !important;
  	    display : flex;
      align-items: center;
      justify-content: space-between;
      height:3vh !important;
      width: 50% !important;
      top: 0vh !important;
      margin: 0px 0 0vh 0px !important;
      border-radius: 5px !important;
      font-size: 15px !important;
      z-index: 500 !important;
  }

  /* (new18) */
  main.ipc-page-wrapper--base  .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base:not(:hover) .episodes-card-container + .episodes-browse-episodes {
      position: fixed !important;
      height: 3.1vh !important;
      top: 8.5vh !important;
      right: -1vw !important;
      padding: 0 6px !important;
      border-radius: 3px !important;
      font-size: 20px !important;
  color: red !important;
  }
  main.ipc-page-wrapper--base  .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base:not(:hover) .episodes-card-container + .episodes-browse-episodes label:first-of-type {
      font-size: 15px !important;
  color: gold !important;
  }

  /* (new27) [A VOIR] for MOBILE */

  /* (new31) - SERIE - INDICATOR for RIGHT PANEL HOVER */
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base:not(:hover) .ipc-tab.ipc-tab--on-base[data-testid="tab-season-entry"]:first-of-type:before {
      content: "<< SERIE info" !important;
      position: fixed !important;
      height: 5vh !important;
      line-height: 5vh !important;
      top: 15vh !important;
      right: 10px !important;
      padding: 0 6px !important;
      border-radius: 3px !important;
      font-size: 20px !important;
  color: gold !important;
  background: red !important;
  }


  /* (new13) SERIE - NUMB SEASONS */
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base:not(:hover) .episodes-card-container + .episodes-browse-episodes > div div:first-of-type label {
      padding: 0 3px !important;
      border-radius: 5px !important;
      font-size: 15px !important;
  color: gold !important;
  } 
  /* (new13) SEASONS YEAR */
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base:not(:hover) .episodes-card-container + .episodes-browse-episodes > div div:last-of-type label  {
      padding: 0 3px !important;
      border-radius: 5px !important;
      font-size: 15px !important;
  color: gold !important;
  /*background: #222 !important;*/
  } 

  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type  section.ipc-page-background.ipc-page-background--base:not(:hover) .episodes-card-container + .episodes-browse-episodes label + svg ,

  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type  section.ipc-page-background.ipc-page-background--base:not(:hover) .episodes-card-container + .episodes-browse-episodes > div .ipc-button.ipc-button--single-padding ,

  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type  section.ipc-page-background.ipc-page-background--base:not(:hover) .episodes-card-container + .episodes-browse-episodes > div:first-of-type {
      display: none !important;
  }

  /* (new39) SERIE - Number of Episodes - Not HOVER */
  main.ipc-page-wrapper--base section.ipc-page-background.ipc-page-background--base:not(:hover) .ipc-page-section.ipc-page-section--base[data-testid="DynamicFeature_Episodes"] .ipc-title.ipc-title--section-title.ipc-title--base.ipc-title--on-textPrimary .ipc-title-link-wrapper[href$="/episodes"]{
      position: fixed;
      height: 3vh !important;
      width: 10.4vw !important;
      right: 0vw !important;
      top: 13.5vh !important;    
      margin: 0 !important;
      padding: 0 !important;
  color: gold !important;
  }
  main.ipc-page-wrapper--base section.ipc-page-background.ipc-page-background--base:not(:hover) .ipc-page-section.ipc-page-section--base[data-testid="DynamicFeature_Episodes"] .ipc-title.ipc-title--section-title.ipc-title--base.ipc-title--on-textPrimary .ipc-title-link-wrapper[href$="/episodes"] .ipc-title__subtext {
      color: gold !important;
  }
  main.ipc-page-wrapper--base section.ipc-page-background.ipc-page-background--base:not(:hover) .ipc-page-section.ipc-page-section--base[data-testid="DynamicFeature_Episodes"] .ipc-title.ipc-title--section-title.ipc-title--base.ipc-title--on-textPrimary .ipc-title-link-wrapper[href$="/episodes"] .ipc-title__text{
      font-size: 1.2rem !important;
      letter-spacing: 0.00735em;
      line-height: 1.7rem;
  }
  main.ipc-page-wrapper--base section.ipc-page-background.ipc-page-background--base:not(:hover) .ipc-page-section.ipc-page-section--base[data-testid="DynamicFeature_Episodes"] .ipc-title.ipc-title--section-title.ipc-title--base.ipc-title--on-textPrimary .ipc-title-link-wrapper[href$="/episodes"] .ipc-title__text::before {
      content: "";
      position: absolute;
      height: 80%;
      margin-left: -0.75rem;
      top: 2px !important;
      width: 4px;
  }

  /* (new26) EPISODE LIST - PAGES */
  .add-image-icon.episode-list {
      height: 44% !important;
  }

  /* (new23) CAST PAGES */

  /* CAST THUMBNAIL */
  #fullcredits_content .cast_list tbody > tr:not(:first-of-type) {
  display: inline-block !important;
      width: 100% !important;
      margin: 0 0 1px 0 !important;
  }
  .cast_list img:not(.loadlate) {
      height: 20px !important;
      width: 81px !important;
      object-fit: contain !important;
  }


  /* (new41) IMDB GM "IMDb: Link 'em all!":
  https://greasyfork.org/fr/scripts/17154-imdb-link-em-all
  === */
  #__LTA__.ipc-page-content-container {
      display: inline-block !important;
      position: fixed !important;
      width: 64px !important;
      min-height: 20px !important;
      max-height: 20px !important;
      right: 2px !important;
      top: 6.7vh !important;
      padding: 0px 0px 0px 0px !important;
     overflow: hidden !important;
      overflow-y: hidden !important;
      z-index: 500000000 !important;
      transition: height ease 2s !important;
  color: gold !important;
  background-color: white;
  }
  #__LTA__.ipc-page-content-container:hover {
      display: inline-block !important;
      position: fixed !important;
      width: 324px !important;
      min-height: 93vh !important;
      max-height: 93vh !important;
      right: 0px!important;
      top: 6.4vh !important;
      padding: 20px 5px 5px 15px !important;
     overflow: hidden !important;
      overflow-y: auto !important;
      transition: height ease 0.7s !important;
  border: 1px solid red !important;
  }
  /* (new41) */
  #__LTA__:before {
      content: " ▼ IMDb: Link 'em all!" !important;
      position: fixed !important;
      width: 140px !important;
      top: 6.2vh !important;
      right: 0 !important;
      padding: 1px 5px !important;
      text-align: right !important;
      border-radius: 0 0 0 5px !important;
      font-size: 10px !important;
  background-color: green !important;
  border: 1px solid red !important;
  }

  /* (new41) IMDb: Link 'em all! - CONFIG PANEL */
  #__LTA__  [class^="App_configWrapper__"] {
      position: fixed;
      right: 120px;
      top: 6.7vh !important;
  }
  #__LTA__  [class^="App_configWrapper__"] [class^="Config_popover__"][style="display: block;"] {
      position: fixed !important;
      width: 800px;
      top: 6.4vh !important;
      left: 41.5vw !important;
      line-height: 1.5rem;
      padding: 10px;
      border-radius: 4px 0 0 4px !important;
      font-size: 11px;
      white-space: nowrap;
      opacity: 1;
      visibility: visible;
      z-index: 500000000 !important;
  box-shadow: 0 0 2em rgba(0, 0, 0, 0.1);
  color: gold !important;
  /*background-color: #111 !important;*/
  border: 1px solid red !important;
  }
  [class^="Config_popover__"]::before {
      right: calc(-1px - 2 * 8px) !important;
      top: calc(0 * 8px) !important;
      transform: rotate(90deg) !important;
  }
  [class^="Config_popover__"] [class^="Config_inner__"] [class^="Config_body__"] {
      max-height: 82.7vh !important;
      min-height: 82.7vh !important;
  background-color: #111 !important;
  border: 1px solid red !important;
  }
  [class^="Config_body__"] > div {
      overflow: hidden !important;
  }
  [class^="Config_body__"] > div > div:not([class^="Sites_searchBar__"]) {
      max-height: 77vh !important;
      min-height: 77vh !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  color: gold !important;
  }
  [class^="Config_body__"] > div > div:not([class^="Sites_searchBar__"]) label span {
      color: gold !important;
  }
  [class^="Config_body__"] > div > div:not([class^="Sites_searchBar__"]) label[class^="Sites_checked__"] span {
      color: green !important;
      background-color: gold !important;
      border: 1px dashed aqua!important;
  }
  [class^="Sites_resultCount__"]  {
      color: red !important;
  }
  [class^="Sites_resultCount__"] span  {
      color: green !important;
  }

  /* ==== GM IMDB SCOUT MOD ==== */

  /* (new39) SCOUT SETTINGS */
  iframe#imdb_scout {
      position: fixed;
      display: block;
      width: 450px;
      height: 90%;
      max-height: 95%;
      max-width: 95%;
      right: 150px;
      top: 50px;
      bottom: auto;
      left: auto;
      margin: 0;
      padding: 0;
      overflow: auto;
      opacity: 1;
      z-index: 500000000 !important;
  border: 1px solid #000;
  }

  #scout_rating_table ~ hr {
      display: none !important;
  }
  html body#imdb_scout div#imdb_scout_wrapper {
       padding: 5px  !important;
  }
  #scout_rating_table {
      position: fixed;
      display: inline-block !important;
      width: 305px !important;
      min-height: 43px !important;
      max-height: 43px !important;
      left: -305px !important;
      top: 60px !important;
      padding: 2px 5px 2px 5px !important;
      border-radius: 5px 5px 0 0 !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      z-index: 500 !important;
      transition: all ease 0.7s !important;
  border: 1px solid red !important;
  }

  #scout_rating_table:after {
      content: "IMDb Scout ◀▶" !important;
      position: fixed !important;
      display: inline-block !important;
      width: 50px !important;
      height: auto !important;
  line-height: 15px !important;
      left: 5px !important;
      margin-top: -44px !important;
      padding: 0px 2px !important;
      font-size: 12px !important;
      transition: all ease 0.7s !important;
  border: 1px solid #333 !important;
  border-left: 3px solid red !important;
  }
  /* HOVER - ALL From Here */
  #scout_rating_table:hover:after {
      left: 308px !important;
      transition: all ease 0.7s !important;
  }
  #scout_rating_table:hover {
      left: 5px !important;
      top: 60px !important;
      transition: all ease 0.7s !important;
  }

  /* ICONS */
  #scout_rating_table > tbody > tr > td > center ,
  #scout_rating_table > tbody > tr > td:not([style="width:30px; vertical-align:middle;"]) img {
      height: 32px !important;
      width: 28px !important;
      object-fit: contain !important;
  }

  #scout_rating_table > tbody > tr > td:first-of-type ,
  #scout_rating_table > tbody > tr > td[style="width:30px; vertical-align:middle;"] + td{
      display: inline-block !important;
      min-height: 34px !important;
      max-height: 34px !important;
      line-height: 15px !important;
      padding: 0px 2px 0px 2px !important;
      border-radius: 5px  0 0 5px !important;
  border: 1px solid gray  !important;
  border-right: none !important;
  }
  #scout_rating_table > tbody > tr > td[style="width:30px; vertical-align:middle;"] {
      display: inline-block !important;
      vertical-align: top !important;
      min-height: 34px !important;
      max-height: 34px !important;
      line-height: 0px !important;
      width: 30px !important;
      margin: 0 3px 0 0  !important;
      padding: 2px 2px 2px 2px !important;
      font-size: 12px !important;
  border-radius: 0 5px 5px 0 !important;
  border: 1px solid gray  !important;
  border-left: none !important;
  }
  #scout_rating_table > tbody > tr > td[style="width:30px; vertical-align:middle;"] span {
      display: inline-block !important;
      height: 10px !important;
      line-height: 8px !important;
      width: 20px !important;
      margin: auto !important;
      font-size: 9px !important;
  }
  /* ONLY ONE */
  #scout_rating_table > tbody > tr > td[style="width:30px; vertical-align:middle;"] span:only-of-type{
      line-height: 10px !important;
      margin-top: 10px !important;
  }
  /* TWO RATING ? */
  #scout_rating_table > tbody > tr > td[style="width:30px; vertical-align:middle;"] span:nth-of-type(n+1):nth-of-type(even):nth-last-of-type(-n+1){
      line-height: 10px !important;
      margin-top: 8px !important;
  }

  #scout_rating_table > tbody > tr > td[style="width:30px; vertical-align:middle;"] br {
      display: none  !important;
  }

  /* SCOUT ICONS HEADER - ICONS SMALL */
  #imdbscout_iconsheader  {
      position: fixed;
      display: inline-block !important;
      width: 305px !important;
      min-height: 70px !important;
      max-height: 70px !important;
      left: -305px !important;
      top: 105px !important;
      padding: 5px 5px 5px 5px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      z-index: 500 !important;
      transition: all ease 0.7s !important;
  border: 1px solid #333 !important;
  border-left: 3px solid yellow !important;
  }

  #imdbscout_iconsheader:after {
      content: "IMDb Scout Icons" !important;
      position: fixed !important;
      display: inline-block !important;
      width: 50px !important;
      min-height: 68px !important;
      max-height: 68px !important;
      left: 6px !important;
      margin-top: -5px !important;
      padding: 0px 2px !important;
      font-size: 12px !important;
      transition: all ease 0.7s !important;
  border: 1px solid #333 !important;
  border-left: 3px solid yellow !important;
  }

  /* HOVER */
  #scout_rating_table:hover ~ #imdbscout_iconsheader ,
  #imdbscout_iconsheader:hover  {
      left: 5px !important;
      transition: all ease 0.7s !important;
  }
  #scout_rating_table:hover ~ #imdbscout_iconsheader:after ,
  #imdbscout_iconsheader:hover:after {
      left: 308px !important;
  }
  /* ICONS */
  #imdbscout_iconsheader > a[href="javascript:;"] {
      float: right !important;
      height: 20px !important;
      line-height: 12px !important;
      width: auto !important;
      padding: 2px 3px !important;
      font-size: 11px;
      text-decoration: none !important;
  color: gold !important;
  border: 1px solid yellow !important
  }

  /* SCOUT ICONS HEADR - ICONS SMALL */
  #imdbscout_iconsheader img ,
  [id*="_header"] img {
      height: 20px !important;
      width: 20px !important;
      margin: 1px 0 2px;
      border-radius: 2px;
  border-width: 2px !important;
  }

  /* FIRST - AQUA */
  #imdbscout_header  {
      position: fixed;
      display: inline-block !important;
      width: 305px !important;
      min-height: 12vh !important;
      max-height: 12vh !important;
      left: -305px !important;
      top: 185px !important;
      padding: 5px 5px 5px 5px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      z-index: 500 !important;
      transition: all ease 0.7s !important;
  border: 1px solid #333 !important;
  border-left: 3px  solid aqua !important;
  }

  /* (new38) */
  #imdbscout_header:after {
      content: "❶ Bar" !important;
      position: fixed !important;
      display: inline-block !important;
      width: 30px !important;
      height: auto !important;
      top: 20.5vh !important;
      left: 5px !important;
      margin-top: -6px !important;
      padding: 0px 2px !important;
      font-size: 12px !important;
      transition: all ease 0.7s !important;
  border: 1px solid #333 !important;
  border-left: 3px solid aqua !important;
  }
  /* HOVER */
  #scout_rating_table ~ #imdbscout_iconsheader:hover ~ #imdbscout_header ,
  #scout_rating_table:hover ~ #imdbscout_header ,
  #imdbscout_header:hover  {
      transition: all ease 0.7s !important;
      left: 5px !important;
  }
  #scout_rating_table ~ #imdbscout_iconsheader:hover ~ #imdbscout_header:after  ,
  #scout_rating_table:hover ~ #imdbscout_header:after ,
  #imdbscout_header:hover:after {
      transition: all ease 0.7s !important;
      left: 308px !important;
  }

  /* 2nd - GREEN */
  #imdbscoutsecondbar_header  {
      position: fixed;
      display: inline-block !important;
      width: 305px !important;
      min-height: 50px !important;
      max-height: 50px !important;
      left: -305px !important;
      top: 245px !important;
      padding: 5px 5px 5px 5px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      z-index: 500 !important;
      transition: all ease 0.7s !important;
  background-color: #111 !important;
  border: 1px solid #333 !important;
  border-left: 3px solid green !important;
  }
  #imdbscoutsecondbar_header:after {
      content: "❷ Bar" !important;
      position: fixed !important;
      display: inline-block !important;
      width: 30px !important;
      height: auto !important;
      left: 5px !important;
      margin-top: -6px !important;
      padding: 0px 2px !important;
      font-size: 12px !important;
      transition: all ease 0.7s !important;
  border: 1px solid #333 !important;
  border-left: 3px solid green !important;
  }
  /* HOVER */
  #scout_rating_table:hover ~ #imdbscout_iconsheader ~ #imdbscout_header ~ #imdbscoutsecondbar_header,
  #scout_rating_table ~ #imdbscout_iconsheader:hover  ~ #imdbscout_header ~ #imdbscoutsecondbar_header ,
  #scout_rating_table ~ #imdbscout_iconsheader  ~ #imdbscout_header:hover ~ #imdbscoutsecondbar_header ,
  #imdbscoutsecondbar_header:hover  {
      transition: all ease 0.7s !important;
      left: 5px !important;
  }
  #scout_rating_table:hover ~ #imdbscout_iconsheader ~ #imdbscout_header ~ #imdbscoutsecondbar_header:after ,
  #scout_rating_table ~ #imdbscout_iconsheader:hover ~ #imdbscout_header ~ #imdbscoutsecondbar_header:after  ,
  #scout_rating_table ~ #imdbscout_iconsheader ~ #imdbscout_header:hover ~ #imdbscoutsecondbar_header:after ,
  #imdbscoutsecondbar_header:hover:after {
      transition: all ease 0.7s !important;
      left: 308px !important;
  }

  /* 3nd - TOMATO */
  #imdbscoutthirdbar_header {
      position: fixed;
      display: inline-block !important;
      width: 305px !important;
      min-height: 50px !important;
      max-height: 50px !important;
      left: -305px !important;
      top: 300px !important;
      padding: 5px 5px 5px 5px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      z-index: 500 !important;
      transition: all ease 0.7s !important;
  border: 1px solid #333 !important;
  border-left: 3px solid tomato !important;
  }
  #imdbscoutthirdbar_header:after {
      content: "❸ Bar" !important;
      position: fixed !important;
      display: inline-block !important;
      width: 30px !important;
      height: auto !important;
      left: 5px !important;
      margin-top: -6px !important;
      padding: 0px 2px !important;
      font-size: 12px !important;
      transition: all ease 0.7s !important;
  border: 1px solid #333 !important;
  border-left: 3px solid tomato !important;
  }
  /* HOVER */
  #scout_rating_table:hover ~ #imdbscout_iconsheader ~ #imdbscout_header ~ #imdbscoutsecondbar_header ~ #imdbscoutthirdbar_header ,
  #scout_rating_table ~ #imdbscout_iconsheader:hover ~ #imdbscout_header ~ #imdbscoutsecondbar_header ~ #imdbscoutthirdbar_header ,
  #scout_rating_table ~ #imdbscout_iconsheader ~ #imdbscout_header:hover ~ #imdbscoutsecondbar_header ~ #imdbscoutthirdbar_header ,
  #scout_rating_table ~ #imdbscout_iconsheader ~ #imdbscout_header ~ #imdbscoutsecondbar_header:hover ~ #imdbscoutthirdbar_header ,
  #imdbscoutthirdbar_header:hover  {
      transition: all ease 0.7s !important;
      left: 5px !important;
  }
  #scout_rating_table:hover ~ #imdbscout_iconsheader ~ #imdbscout_header ~ #imdbscoutsecondbar_header ~ #imdbscoutthirdbar_header:after ,
  #scout_rating_table ~ #imdbscout_iconsheader:hover  ~ #imdbscout_header ~ #imdbscoutsecondbar_header ~ #imdbscoutthirdbar_header:after  ,
  #scout_rating_table ~ #imdbscout_iconsheader  ~ #imdbscout_header:hover ~ #imdbscoutsecondbar_header ~ #imdbscoutthirdbar_header:after ,
  #scout_rating_table ~ #imdbscout_iconsheader ~ #imdbscout_header ~ #imdbscoutsecondbar_header:hover ~ #imdbscoutthirdbar_header:after ,
  #imdbscoutthirdbar_header:hover:after {
      transition: all ease 0.7s !important;
      left: 308px !important;
  }


  /* =========== */

  @keyframes zoomIn {
  0% {
      opacity: 0;
      transform: scale3d(0.3, 0.3, 0.3);
  }
  50% {
      opacity: 1;
  }
  }
  /*  (new37) GM "2EMBED" / vidsrc - TEMPLATE */
  /* iframe[id="2embed"]:before {
  content: "📽 2embed ▲▼" !important;
      position: fixed !important;
      display: inline-block !important;
      width: 200px;    
      height: 25px !important;
      line-height: 25px !important;
      top: 2%;
      left: 0%;
      margin-top: 0px;
      padding: 0;
      border-radius: 10px;
      pointer-events: auto;
      text-align: center !important;
      z-index: 50000000000 !important;
  visibility: visible !important;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: #111 !important;
  border: 1px solid red !important;
  } */

  iframe[id="vidsrc"] ,
  iframe[id=""] ,
  #imdbHeader ~ iframe[id="2embed"],
  iframe[id="2embed"] {
      display: inline-block !important;
      animation-name: zoomIn;
      position: fixed !important;
      width: 100%;
      max-width: 16vw !important;
      height: 50px !important;
      top: 1.7vh !important;
      left: 0.2vw ;
      margin-top: 0px;
      padding: 0rem;
      border-radius: 10px;
      pointer-events: auto;
      z-index: 5000000 !important;
      overflow: hidden !important;
      transform: translateY(-20%);
      visibility: visible !important;
      transition: all ease 0.7s !important;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid red !important;
  }

  iframe[id="vidsrc"]:hover  ,
  iframe[id="2embed"]:hover ,
  #imdbHeader  ~  iframe[id="2embed"]:hover {
  display: inline-block !important;
      top: 26vh !important;
      animation-duration: 0.2s;
      animation-fill-mode: both;
      transform: translateY(-50%) !important;
      visibility: visible !important;
  }
  iframe[id="vidsrc"]:hover  ,
  iframe[id="2embed"]:hover {
      min-width: 1400px !important;
      max-width: 1400px !important;
      min-height: 900px !important;
      margin-top: 215px !important;
      transition: all ease 0.7s !important;
      visibility: visible !important;
  }

  /* IFRAME STREAMLARE */
  body[data-recaptcha-key] {
      font-family: Nunito,sans-serif;
      font-size: 0.9rem;
      font-weight: 400;
      line-height: 1.6;
      margin: 0;
      text-align: left;
  color: #212529;
  }
  body[data-recaptcha-key] #media-embed {
      position: fixed;
      max-height: 895px !important;
      right: 0;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 99;
      overflow: hidden !important;
  border: 1px solid red !important;
  }
  .navbar-expand-md {
      padding-left: 482px !important;
  border: 1px solid red !important;
  }


  /* ==== END  ==== */
  `;
}
if ((location.hostname === "imdb.com" || location.hostname.endsWith(".imdb.com"))) {
  css += `
  /* SUPP - All Pages === */


  /* SUPP MOBILE VERSION */
  .ipc-page-background.ipc-page-background--baseAlt.inline20-page-background ,
  /* (new26) POPUP OPTION LECT */
  .ipc-promptable-base.ipc-promptable-dialog .ipc-promptable-base__auto-focus .ipc-promptable-base__content > div > div[data-testid="p_ct"]  + div +div,
  /* PRO */
  #name-filmography-pro-chip ,
  .ipc-metadata-list-item__label.ipc-metadata-list-item__label--link[href^="https://pro.imdb.com/"] , 
  .ipc-btn[href^="https://pro.imdb.com/"] ,
  #full_cast_title_pro_link ,
  .navbar__imdbpro ,

  /* (new44) SUPP - GENERIC */

  /*data-testid="plot"] ,*/
  .eTjayy ,
  [data-testid="tm-box-wb-overflow"] ,
  .slot_wrapper.nas-spacing.nas-dark ,
  [data-testid="consent-banner"] ,
  .ipc-page-background.ipc-page-background--baseAlt [class*="inline20-"] ,
  footer,
  .nas-slot ,
  .media-viewer__action-bar.mediaviewer__head-banner.extended .nas-slot ,
  .navbar__coachmark ,
  .ipc-btn[href^="https://www.amazon"] ,
  footer.imdb-footer .footer__sign-in  ,
  .ipc-promptable-base.ipc-promptable-dialog.ipc-rating-prompt.enter-done ,
  .ipc-btn[href^="/showtimes/"] ,
  a.ipc-btn[href^="https://www.primevideo.com/"] ,
  .navbar__coachmark ,
  .scriptsOn body > div:first-of-type ,

  .ipc-button[href^="https://www.primevideo.com/"] ,
  .ipc-link[href^="https://pro.imdb.com/"] ,
  .ipc-button[href^="https://www.amazon"] ,
  #ProUpsellLink ,

  .jbJDWL ,
  .ipc-button.ipc-button--full-width.ipc-button--center-align-content.ipc-button--large-height.ipc-button--core-accent1.ipc-button--theme-baseAlt.deUguT ,
  .Banner__BannerContainer-sc-1hps8ja-0.thTWG.banner.banner--accent1 {
      display: none !important;
  }



  /* END ====== SUPP ===== - ALL PAGES ===  */
  `;
}
if ((location.hostname === "imdb.com" || location.hostname.endsWith(".imdb.com")) || location.href.startsWith("https://www.imdb.com/find?q=invin") || location.href.startsWith("https://www.imdb.com/chart/moviemeter/") || location.href.startsWith("https://www.imdb.com/chart/") || location.href.startsWith("https://www.imdb.com/find?q=") || location.href.startsWith("https://www.imdb.com/find/?q=") || location.href.startsWith("https://www.imdb.com/search/")) {
  css += `
  /* SEARCH / CHART /FIND / MOVIE METER PAGES */

  /*  (new23) For GM "IMDB bigger thumbnails/images/poster on chart pages" by Alistair1231 (2022) */
  .article h1.findHeader {
      color: gold !important;
      font-size: 18px !important;
  }
  .article h1.findHeader span.findSearchTerm {
      font-size: 20px !important;
  }
  /* (new16) SEARCH RESULTS - AFFICHE + TITRE */
  table.findList td.primary_photo {
      display: inline-table !important;
      width: 100% !important;
      min-width: 150px !important;
      max-width: 150px !important;
      text-align: center !important;
  border-right: 1px solid red !important;
  }

  table.chart td.posterColumn img[width="140"] ,
  .primary_photo > a > img[width="140"] {
      object-fit: contain !important;
      object-position: center center !important;
      height: 102px !important;
      width: auto!important;
      max-width: 150px !important;
  }
  .findResult.odd {
      background-color: #222 !important;
      border: 1px solid #fff;
  }
  .findResult.even {
      background-color: #333 !important;
      border: 1px solid #fff;
  }
  .result_text {
      font-size: 17px !important;
      color: gray !important;
  }
  .result_text>a {
      font-size: 17px !important;
      color: #136cb2;
  }
  a.ipc-metadata-list-summary-item__t:not([title]):visited {
      color: tomato !important
  }
  /* (new24) SEARCH/FILM INFO - ADD RATING INFOS - With GM "Add movie ratings to IMDB links [adopted]" which not work When LANGUAGE set other that ENG */
  .ipc-metadata-list-summary-item__tc a.ipc-metadata-list-summary-item__t{
  /* border: 1px solid aqua!important; */
  }

  /* (new25) GET MORE RATING */
  .ipc-btn.ipc-btn--theme-base.ipc-btn--core-accent1[style^="display: inline; top: 0px; left: 50%; position: fixed;"] {
      position: fixed;
      left: 70% !important;
      top: unset !important;
      bottom: 1vh !important;
      z-index: 1000;
  }

  /* (new24) NO RATING */
  a.ipc-metadata-list-summary-item__t:not([title]):after {
      content: "(No rating)" !important;
      float: right !important;
      font-size: 0.7em !important;
      opacity: 0.5 !important;
  color: red !important;
  }

  /* (new24) RATING NOT FOUND */
  a.ipc-metadata-list-summary-item__t[title="Rated RATING_NOT_FOUND by undefined users."]:after {
      content: "(No rating)" !important;
      float: right !important;
      font-size: 0.7em !important;
      opacity: 0.5 !important;
  color: red !important;
  }

  /* (new24) GM RATING for LANGUAGE ENG */

  /* (new30) CREDITS - RIGHT PANEL - OPACITY */
  .titleColumn>div[style="display: inline-block;"] ,
  a.ipc-metadata-list-summary-item__t[title] + div {
      float: right !important;
      opacity: 0.5 !important;
  }
  .ipc-accordion__item__content_inner button + a + div {
      display: none !important;
  }

  /* (new24) KNOW FOR/ CONNUE POUR - LEFT PANEL */
  .ipc-shoveler .ipc-primary-image-list-card__title[title] + div {
      position: absolute !important;
      display: inline-block !important;
      clear: none !important;
      width: 100% !important;
      min-width: 64% !important;
      max-width: 64% !important;
      bottom: 0.7vh !important;
      padding-left: 2.5em !important;
      opacity: 0.5 !important;
  }

  .ipc-primary-image-list-card__content + a + div[style="display: inline-block;"] {
      display: none !important;
  }

  /* (new25) RATING - OPACITY */

  /* (new25) GM RATING - OPACITY - SEARCH */
  .ipc-inline-list--inline.ipc-inline-list--no-wrap .ipc-inline-list__item a + div[style="display: inline-block;"] ,
  h3.lister-item-header a + div[style="display: inline-block;"] {
      opacity: 0.5 !important;
  }
  /* HOVER - SEARCH  */
  .ipc-inline-list--inline.ipc-inline-list--no-wrap .ipc-inline-list__item:hover a + div[style="display: inline-block;"] , 
  h3.lister-item-header:hover a +div[style="display: inline-block;"] {
      opacity: 1 !important;
  }


  /* END === SEARCH  === */
  `;
}
if (location.href.startsWith("https://www.imdb.com/video/")) {
  css += `
  /* TRAILER VIDEO MOVIE Pages ====  */

  /* TRAILER - RATING - TOP */
  .celwidget[data-testid="VideoActionBar"] .kFlXkA > div {
      float: right  !important;
      margin-top: 4px !important;
  }
  /* TRAILER - RATING - RIGHT */
  [data-testid="video-info-container"] > div > div > div[style="display: inline-block;"] {
      position: absolute !important;
      display: inline-block !important;
      height: 28px !important;
      margin: 11vh 0 0 10px  !important;
  }

  /* TRAILER - BUT OPTION VISIO */
  .celwidget[data-testid="VideoInfo"] > div[data-testid="video-info-container"] > div[data-testid="title-container"] .ipc-btn.ipc-btn--single-padding.ipc-btn--default-height {
      display: inline-block !important;
      min-height: 1.25rem !important;
      max-height: 1.25rem !important;
      line-height: 0.8rem !important;
      margin: 0px 0 0 10px !important;
      padding: 3px 5px !important;
      overflow: hidden;
      font-size: 0.875rem;
  }

  /* END === VIDEO TRAILER PAGE */
  `;
}
if (location.href.startsWith("https://www.imdb.com/title/") || location.href.startsWith("https://m.imdb.com/title/") || location.href.startsWith("https://www.imdb.com/fr/title/") || location.href.startsWith("https://www.imdb.com/fr-ca/title/") || location.href.startsWith("https://www.imdb.com/de/title/") || location.href.startsWith("https://www.imdb.com/hi/title/") || location.href.startsWith("https://www.imdb.com/it/title/") || location.href.startsWith("https://www.imdb.com/pt/title/") || location.href.startsWith("https://www.imdb.com/es-es/title/") || location.href.startsWith("https://www.imdb.com/es/title/")) {
  css += `
  /* MOVIE PAGE - INFOS DETAILS - VISIBLE ON HOVER */

  /* (new46) POSTER - ALL - TEST */
  .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type > section.ipc-page-background > .ipc-page-content-container.ipc-page-content-container--center:not(:empty) .ipc-page-background .ipc-page-section.ipc-page-section--tp-none > div > div:first-of-type.fAZfWX{
      width: 45% !important;
      max-width: 210px !important;
  }

  /* (new43) A VOIR - CONTAINERS - NOT MOVIE NAME */
  .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type > section.ipc-page-background > .ipc-page-content-container.ipc-page-content-container--center:not(:empty) .ipc-page-background .ipc-page-section.ipc-page-section--tp-none > div:nth-child(3) ,
  .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type > section.ipc-page-background > .ipc-page-content-container.ipc-page-content-container--center:not(:empty) .ipc-page-background .ipc-page-section.ipc-page-section--tp-none ,

  .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type > section.ipc-page-background > .ipc-page-content-container.ipc-page-content-container--center:not(:empty) .ipc-page-background ,

  .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type > section.ipc-page-background > .ipc-page-content-container.ipc-page-content-container--center:not(:empty) ,

  .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type > section.ipc-page-background ,
  .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type ,
  .ipc-page-content-container.ipc-page-content-container--full {
      height: 100vh !important;
      min-height: 100vh !important;
      max-height: 100vh !important;
      padding-left: 0vw !important;
  }

  /* (new54) CONTAINERS - MOVIE NAME */
  .bwWOiy {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 0 3vh 0 !important;
  /*background-color: blue !important;*/
  }
  .bwWOiy .fUCCIx {
      margin: 0 0 -0.3vh 0 !important;
  }

  /* (new41) TEST OLD STYLE - (PB SERIES) - BLOC INFOS -  under TITLE - OLD STYLE */
  html[style="--ipt-focus-outline-on-base:none; --ipt-focus-outline-on-baseAlt:none;"] #__next main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div + div + div ,

  #__next main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div + div + div {
      position:  absolute !important;
      display: inline-block !important;
      top: 14vh!important;
      max-height: 78vh !important;
      min-height: 78vh !important;
      min-width: 100% !important;
      margin: 1vh 0 0 0 !important;
  }

  /* (new50) SERIE - TITLE - for 
  https://www.imdb.com/title/tt31416018/
  === */
  #__next main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div + div + div:not(:last-of-type) > div:not(:last-of-type)  {
      position: relative !important;
      display: inline-block !important;
      width: 100% !important;
      top: -43vh !important;
  }
  /* ✅ This will evaluate to true in browsers that support :has() */
  @supports selector(:has(*)) {
  #__next main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type >  section > section > div + div + div:not(:last-of-type) > div:not(:last-of-type)  {
      position: absolute !important;
      display: inline-block !important;
      width: 100% !important;
      top: -8.5vh !important;
  }
  }

  #__next main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div + div + div h1 {
  /* background-color: blue !important; */
  }
  /* (new41) PB SERIE - NOTE */
  #__next main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div + div + div:not(:last-of-type) > div:last-of-type  {
      position: relative !important;
      display: inline-block !important;
      top: -33.2vh !important;
      top: -43.2vh !important;
      max-height: 6vh !important;
      min-height: 6vh !important;
      margin: 0 -20px 0 0 !important;
  }

  /* BLOCK INFOS UNDER IMAGES / RIGHT IMAGE for OLD / PB for ERIES */
  /* PB SPECIAL PAGE:
  https://www.imdb.com/title/tt31416018/
  ==== */
  #__next main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div + div + div > div:first-of-type + div.fFWQTt {
      display: inline-block !important;
      max-height: 30.2vh !important;
      min-height: 30.2vh !important;
  }

  /* (new29) PB SERIE - SERIE */
  #__next main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center  section.ipc-page-section--tp-none > section > div + div + div > div:first-of-type  {
      float: left !important;
      clear: both !important;
      max-height: 46.5vh !important;
      min-height: 46.2vh !important;
      margin: 0 !important;
  }

  /* (new50) PB SERIE - INFOS - POSTERS - FOR:
  https://www.imdb.com/title/tt31416018/
  === */
  #__next main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div + div + div + div > div:not(.lnlBxO):not(.fFWQTt):not(.cFEdVS):not(.ffJAec):not(.doBMpp):not(.gFpQdY):not(.eQRCDK):not(.eQRCDK) {
      float:left !important;
      min-width: 100% !important;
      max-width: 100% !important;
  }


  /* (new43) PB SERIE - INFOS - 2 BLOCKS */
  #__next main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div + div + div + div > div + div:not(.fFWQTt):not(.doBMpp)  {
      float: right !important;
      min-width: 75% !important;
      max-width: 75% !important;
      max-height: 29.2vh !important;
      min-height: 29.2vh !important;
  }

  /* (new29) PB SERIE - SERIE - PRO THING */
  #__next main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div + div + div + div > div + div + li.ipc-metadata-list__item{
      display: none  !important;
  }

  /* (new54) PB SPECIAL OLD PAGE
  https://www.imdb.com/title/tt23398964/
  https://www.imdb.com/title/tt23398964/
  === */
  #__next main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > .ipc-page-background.ipc-page-background--base > .ipc-page-background.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type > section > section > div + div + div + div > div + div > div:not(.jGqEsT):not(.doBMpp):not(.gLqlom):not(.cDzRCX) {
      float: left !important;
      clear: none!important;
      max-height: 25vh !important;
      min-height: 29vh !important;
      min-width: 48.5% !important;
      max-width: 48.5% !important;
      margin: 0 5px 0 10px  !important;
      top: 20vh !important;
  }

  /* (new48) DISTRIB TOP NAV */
  .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type > section.ipc-page-background > .ipc-page-content-container.ipc-page-content-container--center:not(:empty) .ipc-page-background [data-testid="hero-subnav-bar-right-block"]{
      position: fixed !important;
      height: 2vh  !important;
      top: 6vh !important;
      left: 17vw !important;
  }
  /* (new53) TAGS */
  .ipc-chip-list--baseAlt.ipc-chip-list {
      position: fixed !important;
      width: auto !important;
      top: 8vh !important;
      right: 17vw !important;
      padding: 2px 0 2px 0 !important;
      overflow: hidden !important;
  border: 1px solid #333 !important;
  }
  .ipc-chip-list--nowrap .ipc-chip-list__scroller {
    flex-wrap: nowrap;
      width: 100% !important;
      min-height: 2vh !important;
      max-height: 2vh !important;
      padding: 0;
      overflow: hidden !important;
  }
  .ipc-chip-list--nowrap .ipc-chip-list__scroller > a {
      flex-wrap: nowrap;
      min-height: 2vh !important;
      max-height: 2vh !important;
      margin:  0 5px 0 5px !important;
      padding: 0 5px  !important;
  border: 1px solid silver !important;
  }

  /* (new27) INFOS DETAILS - VISIBLE ON HOVER - NOT MOBILE */
  main.ipc-page-wrapper--base {
      height: 94vh !important;
      min-height: 0vh !important;
      overflow: hidden !important;
  }
  .hWwhTB .ezIlqu.ipc-page-background--baseAlt ,
  .ipc-page-background.ipc-page-background--base.hWwhTB {
      height: 94vh !important;
      min-height: 0vh !important;
      overflow: hidden !important;
  border-bottom: 1px solid aqua !important;
  }
  .hWwhTB .ezIlqu.ipc-page-background--baseAlt > .ipc-page-content-container.ipc-page-content-container--center:last-of-type .lhQGHg {
      height: 93.8vh !important;
      min-height: 0vh !important;
      overflow: hidden !important;
  border: 1px solid red !important;
  }

  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base:not(:hover){
      display: inline-block !important;
      position: fixed !important;
      width: 100px !important;
      min-height: 20px !important;
      max-height: 20px !important;
      top: 6.2vh !important;
      right: 0vw !important;
      overflow: hidden !important;
      z-index: 500 !important;
  color: gray !important;
  }
  /* (new43) HOVER */
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base:hover {
  display: inline-block !important;
      position: fixed !important;
      width: 45vw !important;
      min-height: 92.5vh !important;
      max-height: 92.5vh !important;
      top: 6.2vh !important;
      right: 2px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      z-index: 5000000 !important;
  color: gray !important;
  border-top: 1px solid red !important;
  border-bottom: 1px solid red !important;
  border-left: 3px solid red !important;
  }
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base:hover{
      padding-top: 1.75rem !important;
  }

  /* (new61) SUMMARY / RESUME PAGE */
  main.ipc-page-wrapper--base:has(.ipc-icon--arrow-left) .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base section:has(.ipc-title.ipc-title--base.ipc-title--section-title.ipc-title--on-textPrimary > a.ipc-title-link-wrapper[href="#summaries"]) {
      position: relative !important;
      display: inline-block !important;
      width: 38vw !important;
      top: 0.5vh !important;
      right: unset !important;
      left: 0 !important;
      margin: 0vh 0 1vh 5px !important;
      z-index: 5000000 !important;
  border-top: 1px solid red !important;
  border-bottom: 1px solid red !important;
  border-left: 3px solid aqua !important;
  }
  .ipc-page-grid__item.ipc-page-grid__item--span-2:has(.ipc-icon.ipc-icon--edit.ipc-responsive-button__icon) > div {
      display: none !important;
  }
  /* HOVER */
  main.ipc-page-wrapper--base:has(.ipc-icon--arrow-left) .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base:has(.ipc-title.ipc-title--base.ipc-title--section-title.ipc-title--on-textPrimary > a.ipc-title-link-wrapper[href="#summaries"]):hover {
      padding: 0 0 0 0 !important;
      margin: 0vh 0 0vh 0px !important;
  border-top: 1px solid red !important;
  border-bottom: 1px solid red !important;
  border-left: 3px solid gold !important;
  }


  /* (new61) TAGLINES/ ACCROCHES */
  .ipc-page-grid.ipc-page-grid--bias-left:has(.ipc-metadata-list, ipc-html-content-inner-div, [data-testid="sub-section"]):first-of-type .ipc-page-grid__item.ipc-page-grid__item--span-2 > .ipc-page-section.ipc-page-section--base:has([data-testid="sub-section"]) {
      display: block !important;
      float: left !important;
      width: 38vw !important;
      top: 0.5vh !important;
      right: unset !important;
      left: 2% !important;
      margin: 0vh 0 1vh 5px !important;
      z-index: 5000000 !important;
  border-top: 1px solid red !important;
  border-bottom: 1px solid red !important;
  border-left: 3px solid aqua !important;
  }
  .ipc-page-grid__item.ipc-page-grid__item--span-2:has(.ipc-icon.ipc-icon--edit.ipc-responsive-button__icon) > div {
      display: none !important;
  }
  /* HOVER */
  main.ipc-page-wrapper--base:has(.ipc-icon--arrow-left) .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base:has(.ipc-title.ipc-title--base.ipc-title--section-title.ipc-title--on-textPrimary > a.ipc-title-link-wrapper[href="#summaries"]):hover {
      padding: 0 0 0 0 !important;
      margin: 0vh 0 0vh 0px !important;
  border-top: 1px solid red !important;
  border-bottom: 1px solid red !important;
  border-left: 3px solid gold !important;
  }

  /* (new60) DISTRIB + INFOS TECH */
  main.ipc-page-wrapper--base:has(.ipc-icon--arrow-left) .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base {
      position: fixed !important;
      display: inline-block !important;
      width: 58vw !important;
      min-height: 74.5vh !important;
      max-height: 74.5vh !important;
      top: 24.2vh !important;
      right: 18% !important;
      overflow: hidden auto !important;
      z-index: 5000000 !important;
  color: gray !important;
  border-top: 1px solid red !important;
  border-bottom: 1px solid red !important;
  border-left: 3px solid aqua !important;
  }
  main.ipc-page-wrapper--base:has(.ipc-icon--arrow-left) .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base:hover::before ,
  main.ipc-page-wrapper--base:has(.ipc-icon--arrow-left) .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base::before {
      display: none !important;
  }


  /* (new41) INFOS RIGHT - INDICATOR */
  /* .ipc-page-background.ipc-page-background--base.kUbSjY  .fmxrQX:before ; */
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base:before  {
      content: "◣ ➕" !important;
      display: inline-block !important;
      position: fixed !important;
      width: 200px !important;
      min-height: 30px !important;
      max-height: 30px !important;
      margin-top: -0.5vh !important;
      right: 0 !important;
      padding-left: 5px !important;
      border-radius: 0 0 0 5px !important;
      z-index: 500000 !important;
  color: gold !important;
  border: 1px solid red !important;
  }
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base:hover:before {
      content: "➕ ◥ " !important;
      display: inline-block !important;
      position: fixed !important;
      width: 45vw !important;
      min-height: 30px !important;
      max-height: 30px !important;
      margin-top: -3.1vh !important;
      right: 0 !important;
      z-index: 500000 !important;
  border: 1px solid red !important;
  border-left: 3px solid red !important;
  }

  /* (new33) RIGHT PANEL - ACTORS ICONS */
  main.ipc-page-wrapper--base .ipc-page-content-container.ipc-page-content-container--full > section:first-of-type section.ipc-page-background.ipc-page-background--base .eTKJpq {
      min-width: 4rem !important;
      max-width: 4rem !important;
      margin: 0 10px 0 -20px !important;
  }

  /* (new13) RECENTLY VIEWED */
  .ipc-page-background--baseAlt .recently-viewed {
      position: fixed !important;
      display: inline-block !important;
      width: 15.5vw !important;
      bottom: 0vh !important;
      right: 2px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      z-index: 500000 !important;
  color: gold !important;
  }
  .ipc-page-background--baseAlt .recently-viewed:not(:hover) h3.ipc-title__text{
      border: medium none;
      display: flex;
      max-height: 1.9em;
      overflow: hidden;
      position: relative;
      font-size: 0.6em !important;
  }

  .ipc-page-background--baseAlt .recently-viewed .ipc-sub-grid.ipc-sub-grid--nowrap.ipc-sub-grid--page-span-3 {
      grid-auto-columns: calc(22.33333% - 0.91667 * 1.5rem - 0rem) !important;
  }
  /* NOT HOVER */
  .ipc-page-background--baseAlt .recently-viewed:not(:hover) hgroup.ipc-title {
     font-size: 1rem !important;
  }
  .ipc-page-background--baseAlt .recently-viewed:not(:hover) span a.ipc-link  {
  line-height: 1.2rem !important;
     font-size: 1rem !important;
  }
  /* HOVER */
  .ipc-page-background--baseAlt .recently-viewed:hover {
      width: 99.5vw !important;
  }
  .ipc-page-background--baseAlt .recently-viewed:hover .ipc-sub-grid.ipc-sub-grid--nowrap.ipc-sub-grid--page-span-3 {
      grid-auto-columns: calc(5.33333% - 0.91667 * 1.5rem - 0rem) !important;
  }

  /* END == MOVIE PAGE - INFOS DETAILS - VISIBLE ON HOVER - NOT MOBILE */
  `;
}
if (location.href.startsWith("https://www.imdb.com/find/?q=")) {
  css += `
  /* SEARCH PAGES */

  /* (new30) TEST for GM BIG THUMBNAILS" */


  /* (new30) URL-PREF - SEARCH PAGES - POSTER - RECENTLY VIEWVED */
  .ipc-media.ipc-media--poster-m.ipc-poster__poster-image.ipc-media__img img {
      height: 100% !important;
      object-fit: contain !important;
  }


  /* END === SEARCH PAGES */
  `;
}
if (location.href.startsWith("https://www.imdb.com/chart/") || location.href.startsWith("https://www.imdb.com/feature/genre/")) {
  css += `
  /* CHART / FEATURE Pages -  */

  /* CHART - SIDEBAR */
  #sidebar .aux-content-widget-2 {
      padding: 5px 5px 5px 15px  !important;
  }
  #sidebar div[class^="aux-content-widget-"].seen-sidebar>h3 {
      font-size: 18px;
      margin: 5px 0 0px 0 !important;
  }
  .seen-sidebar .seen-score {
      color: gold !important;
  }


  /* FEATURE CARDS / FEATURE */
  .widget_content.no_inline_blurb .widget_nested .ninja_image_pack .widget_image .image img {
      border-radius: 5px  !important;
  border: 1px solid red !important;
  }


  /* END ==CHART PAGES */
  `;
}
if ((location.hostname === "imdb.com" || location.hostname.endsWith(".imdb.com")) || (location.hostname === "www.imdb.com" || location.hostname.endsWith(".www.imdb.com"))) {
  css += `
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
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
