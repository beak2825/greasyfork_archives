// ==UserScript==
// @name Mozilla Addon Widescreen NEW design (USw)v.171
// @namespace https://addons.mozilla.org
// @version 171.00.0
// @description Mozilla Addon wide, compact and reorganized
// @author decembre
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.addons.mozilla.org/*
// @match *://*.addons-dev.allizom.org/*
// @match *://*.addons.mozilla.org./*
// @match *://*.blog.mozilla.org/*
// @include /^(?:https://web.archive.org/web/.*/https://addons.mozilla.org/.*)$/
// @downloadURL https://update.greasyfork.org/scripts/432080/Mozilla%20Addon%20Widescreen%20NEW%20design%20%28USw%29v171.user.js
// @updateURL https://update.greasyfork.org/scripts/432080/Mozilla%20Addon%20Widescreen%20NEW%20design%20%28USw%29v171.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "addons.mozilla.org" || location.hostname.endsWith(".addons.mozilla.org")) || (location.hostname === "addons-dev.allizom.org" || location.hostname.endsWith(".addons-dev.allizom.org")) || location.href.startsWith("https://addons.mozilla.org./") || new RegExp("^(?:https://web.archive.org/web/.*/https://addons.mozilla.org/.*)\$").test(location.href)) {
  css += `
  /* ==== MOZ - Mozilla Addon Widescreen NEW Design 2n Desing v.171 (USw) (new171) - TEST addons-dev.allizom.org - OK DEV HERE in FIREFOX ==== */

  /* ==============
  (new169) TEST - ADD (need more tweaks... Work in Progress):
  https://addons.mozilla.org./ (with the trailing dot [.])
  =========================== */
  /* ===================================================
  Mozilla Add-ons Dark v 1.2.1 [2025: Updated 3 yearsago ]:
  https://userstyles.world/style/6461/mozilla-add-ons-dark

  ===================================================== */

  /* =================================================== 
  Allow extensions to run on AMO pages, read [SuperUser - 2024.08]:
  https://superuser.com/questions/1354603/firefox-extensions-restricted-from-running-on-some-sites
  AND [Gorhill's uMatrix wiki - 2018]:
  https://github.com/gorhill/uMatrix/wiki/Privileged-Pages

  TWEAK about:config :
  security.csp.enable
  security.csp.enableStrictDynamic
  security.csp.experimentalEnabled;
  >> set to false ?

  [Gorhill's uMatrix wiki - 2018 - OK 2025 ]
  A - EDIT ABOUT:CONFIG values For :

  extensions.webextensions.restrictedDomains

  And REMOVE all infos in it:
  accounts-static.cdn.mozilla.net,accounts.firefox.com,addons.cdn.mozilla.net,addons.mozilla.org,api.accounts.firefox.com,content.cdn.mozilla.net,discovery.addons.mozilla.org,oauth.accounts.firefox.com,profile.accounts.firefox.com,support.mozilla.org,sync.services.mozilla.com

  B -  EDIT ABOUT:CONFIG TOGGLEs For (if no present, must be manually created by right clicking and selecting New > Boolean):
  privacy.resistFingerprinting.block_mozAddonManager
  false to true




  [2025] NOT USED:
  [2024] - As the offcial documentation explains :

  [2024] - A - How can I re-enable the add-ons that are not allowed on sites restricted by Mozilla?
  If you are aware of the associated risk and still wish to allow an add-on that has been disallowed on a site by Mozilla, you can do it from the Add-ons Manager settings:

  1 - Click the menu button menuButton >, click Add-ons and themes and select Extensions.
  2 - Click the extension you want to enable on sites with restrictions.
  3 - Select the "Allow" option in the section "Run on sites with restrictions".

  Note [2025.11]:
  I don't see this option yet..

  B - Add-on Manager - Run on sites with restrictions:
  Alternatively, you can disable the entire protection from the Configuration Editor (about:config page).

  1 - Type about:config in the address bar and press Enter.
  2 - A warning page may appear. Click Accept the Risk and Continue to go to the about:config page.
  3 - Search for the:
      extensions.quarantinedDomains.enabled preference.
  If this preference does not yet exist, the options to add it will show up. 
  Select the Boolean type and click the + button to create it.
  Click the Toggle aboutconfig-ToggleButton button next to this preference 
  to change its value to:
  false.

  4 - Restart Firefox.

  Note [2025.11]:
  I see this Value in about:config yet. but i let it on:
  true
  Whithout affecting Stylus (or others addon) to modify the Mozilla pages.

  =================================== */

  /* =================================================== 
  Allow extensions to run on AMO, read:
  https://superuser.com/questions/1354603/firefox-extensions-restricted-from-running-on-some-sites
  - Added:
  domain("addons.mozilla.org.") (you need to do the same for "Dark Mozilla Add-ons (AMO) by maxigaz")
  for  https://addons.mozilla.org. (with the trailing dot)
  ====================================================== */

  /* =================================================== 
  To INSTALL from Userstles.org with Stylus addon.
  Use this Userscript:
  https://greasyfork.org/fr/scripts/443153-uso-add-usoa-button-on-userstyle-page
  ====================================================== */
  /* =================================================== 
  WORK WITH "Dark Mozilla Add-ons (AMO)":
  https://gitlab.com/maxigaz/amo-dark
  ====================================================== */

  /* =================================================== 
  ADD SUPPORT FOR Web Archives (REGEX):
  ====================================================== */



  /* =================================================== 
  SETTINGS for Superloader Plus":
  just ENABLE + FORCE JOIN
  ====================================================== */

  /* =================================================== 
  HOW MATCH WEB ARCHIVE :
  https://web.archive.org/web/20181002072750/https://addons.mozilla.org/en-US/firefox/addon/linkchecker/reviews/
  https://duckduckgo.com/?q=https%3A%2F%2Fweb.archive.org+addons.mozilla.org+namespace+userstyle&ia=web
  ====================================================== */
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

  /* (new171) TEST - NEW NOTICE "Not Recommanded Addon" - === */
  .Notice-genericWarning {
      position: absolute !important;
      width: 100%;
      max-width: 24px !important;
      max-height: 28px !important;
      left: 0 !important;
      top: 5px !important;
      margin: 0 !important;
      white-space: nowrap;
      overflow: hidden !important;
      z-index: 50000 !important;
  color: red !important;
  background-color: #E1C022 !important;
  }
  .Notice-genericWarning:hover {
      position: absolute !important;
      width: 100%;
      max-width: 360px !important;
      min-height: 9vh !important;
      max-height: 100% !important;
      background-repeat: repeat !important;
      white-space: pre-wrap !important;
  color: white !important;
  background-color: brown !important;
  }
  .Notice-genericWarning .Notice-icon {
      display: inline-block !important;
      height: 22px;
      width: 22px;
      margin: -1px 0 0 -1px !important;
  }

  .Notice-genericWarning p.Notice-text {
      float: left;
      width: 200px !important;
      white-space: normal;
  }

  /* (new201) GM Super_loader - MENU - TEST SUPER_LOADER - adapt QUANTUM */
  /* ===
  test links :
  https://addons.mozilla.org/en-US/firefox/addon/privacy-possum/reviews/
  SEARCH PAGE - 
  https://addons.mozilla.org/fr/firefox/search/?page=3&platform=windows&q=scrollbar
  === */
  #sp-fw-container:not(:hover) {
      z-index: 5999999 !important;
      text-align: left !important;
      width: 12px !important;
      height: 12px !important;
      top: 20px !important;
      right: 20px !important;
      transform: none !important;
      overflow: hidden;
  background-color: red !important;
  }
  #sp-fw-container:hover {
      height: auto !important;
      width: auto !important;
      top: 20px !important;
      right: 20px !important;
      padding: 10px !important;
      border: 1px solid gray !important;
      background: #222 !important;
  }

  #sp-fw-container:not(:hover) #sp-fw-content {
      height: auto !important;
      width: auto !important;
  }
  #sp-fw-container:hover #sp-fw-content {
      display: inline-block !important;
      height: auto !important;
      visibility: visible !important;
  }
  #sp-fw-main {
      height: 500px !important;
  }
  #sp-fw-savebutton {
      display: inline-block !important;
      height: 30px !important;
      line-height: 30px !important;
      width: 120px !important;
      text-align: center !important;
      z-index: 5999999 !important;
  background: red!important
  }
  #sp-fw-savebutton:hover {
      border: 1px solid green !important;
  }
  #sp-fw-rect {
      border: 1px solid white;
      border-radius: 3px;
      box-shadow: 0 5px 0 rgba(255, 255, 255, 0.3) inset, 0 0 3px rgba(0, 0, 0, 0.8);
      float: right;
      height: 10px;
      left: 0;
      margin: 0;
      opacity: 0.8;
      padding: 0;
      position: relative;
      top: 0;
      width: 10px;
  }
  #sp-fw-dot {
      background-color: #00ff05;
      display: block;
      right: -3px;
      top: -3px;
  }
  #sp-fw-dot,
  #sp-fw-cur-mode {
      border: 1px solid white;
      border-radius: 3px;
      box-shadow: 0 -2px 1px rgba(0, 0, 0, 0.3) inset, 0 2px 1px rgba(255, 255, 255, 0.3) inset, 0 1px 2px rgba(0, 0, 0, 0.9);
      height: 5px;
      opacity: 1;
      padding: 0;
      position: absolute;
      width: 5px;
      z-index: 9999;
  }

  /* (new147) GM Super_loader - SUPP */
  .sp-separator + #react-view .Footer {
      display: none !important;
  }



  /* (new137) GM Super_loader - SEPARATOR */
  .sp-separator {
      display: inline-block !important;
      height: 35px !important;
      line-height: 35px !important;
      width: 100% !important;
      text-align: center !important;
      border-radius: 5px !important;
  background: #575f68 !important;
  /*background: red !important; */
  }
  .sp-separator a {
      position: relative !important;
      display: inline-block !important;
      min-width: 602px !important;
      /* max-width: 40% !important; */
      height: 32px !important;
      line-height: 32px !important;
      top: -4px !important;
      margin: 0px 20px 0 6px !important;
      padding-left: 100px;
      border-radius: 5px !important;
      text-shadow: none !important;
  color: white !important;
  /* background: blue !important; */
  }
  .sp-separator a b {
      position: relative !important;
      display: inline-block !important;
      height: 35px !important;
      border-radius: 5px !important;
  /*background: red !important; */
  }
  .sp-sp-nextlink > b > span[style="color:#595959!important;"],
  .sp-separator a.sp-sp-nextlink > span {
      display: inline-block !important;
      min-width: 40px !important;
      margin: 0 0px 0 5px !important;
      border-radius: 5px !important;
      text-shadow: none;
      opacity: 1 !important;
      text-align: center !important;
      color: white !important;
  background: black !important;
  }
  .sp-separator img {
      margin: -8px 20px 0 5px !important;
      padding: 2px !important;
      opacity: 0.3 !important;
      border-radius: 3px !important;
  background: gray !important;
  }
  .sp-separator img:hover {
      margin-right: 20px;
      padding: 2px !important;
      opacity: 1 !important;
      border-radius: 3px !important;
  background: red !important;
  }
  #sp-separator-hover {
      display: inline-block;
      width: 400px !important;
  }
  /* GM Super_loader - SEPARATOR - DIVERS */
  /* div.Page-amo div.Page-content div.Page.Page-not-homepage div.Search > div.SearchResults .AddonsCard-list .sp-separator {
      margin-bottom: 20px !important;
  } */
  /* (new130) GM Super_loader - REVIEWS LIST */
  /* .AddonReviewList .AddonReviewList-reviews .Card.CardList.AddonReviewList-reviews-listing .Card-contents .sp-separator{
  height: 35px !important;
  line-height: 15px !important;
  margin-bottom: 5px !important;
  border-radius: 5px !important;
      background: #111 !important;
  } */
  /* .AddonReviewList .AddonReviewList-reviews .Card.CardList.AddonReviewList-reviews-listing .Card-contents .sp-separator a{
      display: inline-block;
  height: 35px !important;
      min-width: 802px;
      padding-left: 100px;
  } */
  /* (new77) ADD test for domain("addons-dev.allizom.org") -
  https://addons-dev.allizom.org/en-GB/firefox/
  - === */
  /* (new103) AMO CHANGE - 2019.10.12 - === */
  .Page-not-homepage {
      max-width: 100% !important;
  }
  .Page-content {
      background: #283146 !important;
  }

  /* ALL ?? - === */
  .AddonsCard--horizontal ul.AddonsCard-list {
      display: grid;
      /* grid-auto-flow: unset !important; */
      /* grid-template-columns: unset !important; */
  }

  /* HOME - === */
  .Home-content {
      max-width: 100% !important;
  }
  /* (new131) */
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal .Card-shelf-header footer {
      display: inline-block !important;
      width: 30% !important;
      height: 25px !important;
      margin-top: 0px !important;
      padding: 0px !important;
      border-radius: 5px !important;
  border: 1px solid red !important;
  }
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal footer a {
      display: inline-block !important;
      height: 25px !important;
      line-height: 25px !important;
      padding: 0 10px !important;
      text-decoration: none;
  }
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal .Card-contents {
      height: 220px !important;
      margin-bottom: 6px !important;
  }
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal .Card-contents ul.AddonsCard-list {
      height: 205px !important;
  }
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal .Card-contents ul.AddonsCard-list li.SearchResult {
      display: inline-block !important;
      height: 100%;
      height: 200px !important;
      min-width: 24.3% !important;
      max-width: 24.3% !important;
      padding: 0px !important;
      border-radius: 5px !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper {
      padding: 12px 5px !important;
  }
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-icon-wrapper {
      height: 180px !important;
  }
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-contents {
      display: inline-block !important;
      width: 100% !important;
      height: 100%;
      max-height: 180px !important;
      min-height: 180px !important;
      margin: 0px 2px 0 -2px !important;
      padding: 2px 5px !important;
  }
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-contents .SearchResult-summary {
      max-width: 465px;
      height: 100%;
      min-height: 85px !important;
      max-height: 85px !important;
      line-height: 15px;
      margin-bottom: -15px !important;
  }
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-users {
      display: inline-block !important;
      height: 18px !important;
      margin-left: 0 !important;
      margin-top: -31px !important;
      text-align: center !important;
  }

  /* HOME PAGE - THEME - === */
  .Home .SearchResult.SearchResult--theme {
      grid-column: auto / auto;
      margin: 0 6px 1px;
      min-width: 0;
      height: 202px !important;
      padding: 0;
  }
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-contents {
      display: inline-block;
      height: 100%;
      margin: -7px 0px 0 0px !important;
      max-height: 75px !important;
      min-height: 75px !important;
  }
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-users.SearchResult--meta-section {
      position: relative !important;
      display: inline-block !important;
  }
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal.Card.CardList.LandingAddonsCard-Themes .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme {
      min-width: 32.6% !important;
      max-width: 32.6% !important;
  }
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal.Card.CardList.LandingAddonsCard-Themes .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-wrapper {
      margin-top: 0px !important;
      padding: 4px 24px !important;
  }
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal.Card.CardList.LandingAddonsCard-Themes .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-wrapper:hover {
      margin-top: 0px !important;
      padding: 4px 24px !important;
  }
  .Home .AddonsCard--horizontal ul.AddonsCard-list .SearchResult--theme .SearchResult-result .SearchResult-icon-wrapper {
      position: relative !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 100% !important;
      max-height: 95px !important;
      min-height: 95px !important;
      margin-top: 0px !important;
      margin-left: 0px !important;
  }
  .Home .SearchResult--theme img.SearchResult-icon {
      object-position: unset;
      object-fit: contain !important;
      display: inline-block;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 100%;
      max-height: 85px !important;
      min-height: 85px !important;
      margin-top: 5px;
      border-radius: 9px;
  }
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal.Card.CardList.LandingAddonsCard-Themes .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-result {
      height: 181px !important;
      text-align: center !important;
  }
  .Home li.SearchResult.SearchResult--theme .SearchResult-contents {
      width: 100% !important;
      height: 100%;
      max-height: 44px !important;
      min-height: 44px !important;
      margin: 0 0 15px 0 !important;
      padding: 5px 20px 0;
      border-radius: 9px !important;
      z-index: 100;
  }
  .Home li.SearchResult.SearchResult--theme .SearchResult-contents .SearchResult-users {
      margin: 0 !important;
  }
  .Home li.SearchResult.SearchResult--theme .SearchResult-contents .SearchResult-name {
      height: 44px !important;
      line-height: 15px !important;
  }
  .Home li.SearchResult.SearchResult--theme .SearchResult-contents .SearchResult-name a.SearchResult-link {
      margin: 0 !important;
      text-align: center !important;
  }

  /* HOME - THEME */
  /* HOME ??? - === */
  .Home .Home-FeaturedCollection.AddonsCard--horizontal.Card--photon.Card--no-footer ul.AddonsCard-list,
  .Home .Home-FeaturedCollection.AddonsCard--horizontal.Card--photon.Card--no-footer ul.AddonsCard-list {
      grid-auto-flow: column dense;
      grid-template-columns: 33% 33% 33% !important;
  }
  .Home .Home-FeaturedCollection.AddonsCard--horizontal.Card--photon.Card--photon:not(.Card--no-footer) ul.AddonsCard-list {
      grid-auto-flow: column dense;
      grid-template-columns: 25% 25% 25% 25% !important;
  }
  .Home .SearchResult.SearchResult--theme.SearchResult--persona {
      display: inline-block !important;
      height: 202px;
      width: 100% !important;
      max-width: 100% !important;
      min-width: 100% !important;
      margin-right: 30px !important;
  }
  .Home .Home-FeaturedCollection.AddonsCard--horizontal ul.AddonsCard-list .SearchResult--theme .SearchResult-result .SearchResult-icon-wrapper {
      height: 100%;
      max-height: 95px;
      min-height: 95px;
      max-width: 30%;
      min-width: 30%;
      margin-left: -7px;
      margin-top: 70px;
  }
  .Home .Card.CardList.AddonsCard.LandingAddonsCard.Home-FeaturedExtensions.AddonsCard--horizontal .SearchResult-icon-wrapper,
  .Home .Home-FeaturedCollection.AddonsCard--horizontal.Card--photon.Card--photon:not(.Card--no-footer) ul.AddonsCard-list .SearchResult-icon-wrapper {
      height: 134px !important;
  }
  .Home .Home-FeaturedCollection.AddonsCard--horizontal.Card--photon.Card--photon:not(.Card--no-footer) ul.AddonsCard-list .SearchResult.SearchResult--theme.SearchResult--persona .SearchResult-icon-wrapper {
      height: 100%;
      min-height: 95px;
      max-height: 95px;
      max-width: 23% !important;
      min-width: 23% !important;
      margin-left: -9px !important;
      margin-top: 70px;
  }
  .Button--confirm {
      background: #196610 !important;
  }
  .InstallButtonWrapper.InstallButtonWrapper--notFirefox .Button--confirm {
      min-height: 30px !important;
      margin-top: 10px !important;
      padding: 0 5px !important;
      font-size: 13px !important;
  }

  /* HOME - GUIDES */
  .Guides-page {
      line-height: 1.1 !important;
      padding: 5px 20px !important;
      font-size: 15px !important;
  }
  .Guides-section {
      float: left;
      width: 32.7% !important;
      margin-bottom: 0px !important;
      margin-top: 20px !important;
      margin-right: 0.5% !important;
      padding: 5px !important;
      border-radius: 9px !important;
  background: #1f2536 !important;
  }
  .Guides-header {
      margin-bottom: 0px !important;
      padding-bottom: 25px !important;
  }
  .Guides-header-icon {
      float: left !important;
      margin-right: 30px;
  }
  .Guides-page .Card-contents {
      border-radius: 6px;
  background: #283146 !important;
  }
  .GuidesAddonCard-content {
      display: unset !important;
  }
  .GuidesAddonCard-content-text {
      display: inline-block !important;
      min-width: 80% !important;
      max-width: 80% !important;
  }
  .GuidesAddonCard-content-text + .InstallButtonWrapper {
      display: inline-block !important;
      float: none !important;
      min-width: 100% !important;
  }

  /* HOME COLOR */
  .Guides-section-explore-more,
  h2 + p,
  .Guides-page .Guides-header p,
  .HomeHeroGuides-header-subtitle {
      margin: 0px 0 24px !important;
      color: #c1d0ff;
  }
  .Guides-section .Card.Card--no-header.Card--no-footer .Card-contents .GuidesAddonCard .GuidesAddonCard-content .GuidesAddonCard-content-text p {
      color: #eee !important;
  }

  /* 404 AMO - with ADDON " CASSIC ADD-ON ARCHIVE - 
  https://addons.mozilla.org/en-US/firefox/addon/its-all-text/
  === */
  .Card.ErrorPage.NotFound {
      color: gray !important;
  }
  .Card.ErrorPage.NotFound .Card-contents > h3 {
      font-size: 30px;
      font-weight: 600;
      line-height: 19px;
      text-align: center !important;
  }


  /* WIDESCREEN - === */
  .App-content-wrapper {
      margin: 0 auto;
      max-width: 100%;
  }
  /* BR - === */
  .Addon-summary > br,
  .AddonDescription-contents br {
      content: " " !important;
      float: none !important;
      display: block !important;
      line-height: 0px !important;
      margin-top: 5px !important;
      margin-bottom: -4px !important;
  }

  /* TOP HEADER  - === */
  .Header {
      grid-template-columns: max-content 1fr 1fr;
      grid-template-rows: 46px auto;
      margin: 0 auto;
      max-width: 1366px;
      min-height: 70px !important;
      height: 70px !important;
      padding-bottom: 0px !important;
      width: 100%;
  }
  [dir="ltr"] .Header-content {
      margin-right: 24px;
      margin-top: -76px !important;
  }
  .Header-SectionLinks {
      align-self: center;
      grid-column: 2 / auto;
      margin: 22px 0 0;
      padding: 0;
      margin-top: -62px !important;
  }
  .Header-user-and-external-links {
      height: 36px !important;
      margin-top: 0 !important;
      grid-area: 1 / 2 / 2 / -1;
  }
  .Header-search-form {
      margin-top: -21px !important;
      grid-area: 2 / 3 / 2 / 3;
      align-self: center;
      max-width: 284px;
      width: 100%;
  }

  /* (new150) SEARCH / COLLECTION ?? */
  .Search .SearchResults {
      grid-area: 2 / 2 / 5 / auto;
      width: 100%;
      min-width: 0;
      margin-top: 0px !important;
  }
  .Card-header {
      border-top-left-radius: 9px;
      border-top-right-radius: 9px;
      font-family: Fira Sans, sans-serif;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      margin-bottom: 1px;
      margin-top: 0px !important;
      overflow: hidden;
      overflow-wrap: break-word;
      padding: 5px 20px !important;
      text-align: left;
  }

  /* new150) SEARCH - TOP PADDING */
  .Search .SearchResults .Card-contents ul.AddonsCard-list {
      margin: 0;
      padding: 1vh 0 0 0 !important;
  }

  /* (new150) SEARCH / COLLECTION ?? */
  .Collection-wrapper,
  .Search {
      display: grid;
      grid-auto-flow: column dense;
      grid-gap: 4px !important;
      grid-template-columns: minmax(100px, 8%) 1fr !important;
      padding: 0 4px 4px !important;
  }
  .Search .SearchContextCard {
      grid-area: 1 / 1 / auto / -1;
      min-width: 0;
      margin-top: -21px !important;
  }
  .Search .SearchContextCard-header {
      font-size: 18px !important;
      margin: 0;
      overflow-wrap: break-word;
  }
  .Search .SearchResults .SearchResult-result {
      -moz-box-direction: normal;
      -moz-box-orient: horizontal;
      display: flex;
      flex-flow: row wrap;
      margin: 0;
      padding: 0;
      width: 100%;
  }
  .Search .SearchResults li.SearchResult.SearchResult--theme,
  .Collection-items .AddonsCard-list li.SearchResult,
  .Search .SearchResults li.SearchResult {
      position: relative !important;
      display: inline-block !important;
      width: 97% !important;
      height: 100% !important;
      min-height: 145px !important;
      max-height: 145px !important;
      top: 0px !important;
      margin-top: -9px !important;
      margin-right: 2px !important;
      margin-bottom: 10px !important;
      bottom: 0px !important;
      padding: 0px 3px !important;
      border-radius: 9px !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }
  /* (new152) */
  .Search .SearchResults li.SearchResult.SearchResult--theme .SearchResult-users ,
  .Collection-items .AddonsCard-list li.SearchResult .SearchResult-users ,
  .Search .SearchResults li.SearchResult .SearchResult-users {
      -moz-box-flex: 0;
      -moz-box-ordinal-group: 2 !important;
      flex-grow: 0;
      order: 1;
      max-width: 80% !important;
      margin: 2px 0 0 30px !important;
  /*border: 1px solid red !important;*/
  }


  .Search .SearchResults .Card.CardList.AddonsCard.Card--photon .Card-contents ul.AddonsCard-list .SearchResult.SearchResult--theme,
  .Search .SearchResults .Card.CardList.AddonsCard.Card--photon .Card-contents ul.AddonsCard-list .SearchResult {
      position: relative !important;
      float: left !important;
      width: 19.5% !important;
      height: 100% !important;
      min-height: 140px !important;
      max-height: 140px !important;
      top: -10px !important;
      margin-top: 2px !important;
      margin-right: 2px !important;
      margin-bottom: 2px !important;
      bottom: 2px !important;
      padding: 0px 2px !important;
      border-radius: 5px !important;
      border-radius: 9px !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }
  .Search .SearchResults .Card.CardList.AddonsCard.Card--photon .Card-footer {
      margin-top: -10px !important;
      padding: 0px !important;
      width: 100%;
  }

  /* (new150) COLOR BADGES - ALL 
  ORANGE > YELLOW filter: invert(38%) saturate(481%) hue-rotate(40deg) brightness(202%) contrast(93%) !important;
  === */
  .Badge.Badge-border .Icon{
      filter: invert(38%) saturate(481%) hue-rotate(40deg) brightness(202%) contrast(93%) !important;
  }
  /* (new150) SEARCH - ADDON INFOS - RECOMMENDATION - MORE ADDONS - BADGES 
  ORANGE > YELLOW filter: invert(38%) saturate(481%) hue-rotate(40deg) brightness(202%) contrast(93%) !important;
  === */
  .SearchResults li.SearchResult .Badge.Badge-border {
      position: absolute !important;
      display: inline-block !important;
      margin: 6vh 0 0 -100% !important;
      transform: scale(0.7) !important;
      transform-origin: center center !important;
      opacity: 0.5 !important;
  background: black  !important;
  border: 3px solid red !important;
  }
  .Card.ExpandableCard.SearchFilters.Card--no-footer + .SearchResults li.SearchResult span.Badge-content.Badge-content--small {
      display: none  !important;
  }
  /* HOVER */
  .Card.ExpandableCard.SearchFilters.Card--no-footer + .SearchResults li.SearchResult:hover  .Badge.Badge-border {
      position: absolute !important;
      display: inline-block !important;
      margin: -3.5vh 0 0 -85% !important;
      border-radius: 9px 9px 9px 0 !important;
      transform: scale(0.7) !important;
      opacity: 1 !important;
  color: white !important;
  background: green  !important;
  border: 1px solid green!important;
  }
  .Card.ExpandableCard.SearchFilters.Card--no-footer + .SearchResults li.SearchResult:hover span.Badge-content.Badge-content--small {
      display: inline-block !important;
  color: white !important;
  background: green  !important;
  border: 1px solid green!important;
  }

  /* (new150) COLLECTION LIST - RECOMMENDATION - MORE ADDONS - BADGES  
  ORANGE > YELLOW filter: invert(38%) saturate(481%) hue-rotate(40deg) brightness(202%) contrast(93%) !important;
  === */
  .Collection .Collection-wrapper .Collection-items section.Card.CardList.AddonsCard .Card-contents ul.AddonsCard-list .Badge.Badge-border {
      position: absolute !important;
      display: inline-block !important;
      margin: 6vh 0 0 -100% !important;
      transform: scale(0.7) !important;
      transform-origin: center center !important;
      opacity: 0.5 !important;
  background: black  !important;
  border: 3px solid green !important;
  }
  .Collection .Collection-wrapper .Collection-items section.Card.CardList.AddonsCard .Card-contents ul.AddonsCard-list span.Badge-content.Badge-content--small {
      display: none  !important;
  }
  /* HOVER */
  .Collection .Collection-wrapper .Collection-items section.Card.CardList.AddonsCard .Card-contents ul.AddonsCard-list li.SearchResult:hover .Badge.Badge-border {
      position: absolute !important;
      display: inline-block !important;
      margin: -3.5vh 0 0 -81.3% !important;
      border-radius: 9px 9px 9px 0 !important;
      transform: scale(0.7) !important;
      opacity: 1 !important;
  color: white !important;
  background: green  !important;
  border: 1px solid green!important;
  }
  .Collection .Collection-wrapper .Collection-items section.Card.CardList.AddonsCard .Card-contents ul.AddonsCard-list li.SearchResult:hover span.Badge-content.Badge-content--small {
      display: inline-block !important;
  color: white !important;
  background: green  !important;
  border: 1px solid green!important;
  }



  /* (new144) COLL - PROMOTED BADGE */
  .Collection .Collection-wrapper .Collection-detail-wrapper + .Collection-items .Card.CardList.AddonsCard.Card--photon.Card--no-header .Card-contents ul.AddonsCard-list .SearchResult-wrapper .SearchResult-result .SearchResult-name .PromotedBadge {
      position: absolute;
      height: 3vh !important;
      line-height: 3vh !important;
      width: 24px !important;
      top: 4vh !important;
      left: 5px !important;
      margin: 0 !important;
      padding: 0px !important;
      border-radius: 9px !important;
      font-size: 0 !important;
      overflow: hidden !important;
      transform: scale(0.6) !important;
  background: gold !important;
  color: red !important;
  }
  .Collection .Collection-wrapper .Collection-detail-wrapper + .Collection-items .Card.CardList.AddonsCard.Card--photon.Card--no-header .Card-contents ul.AddonsCard-list .SearchResult-wrapper .SearchResult-result .SearchResult-name .PromotedBadge .IconPromotedBadge-small {
      position: absolute;
      height: 2vh !important;
      width: 25px !important;
      margin: 12px 0 0 2px !important;
      transform: scale(1) !important;
  }
  .Collection .Collection-wrapper .Collection-detail-wrapper + .Collection-items .Card.CardList.AddonsCard.Card--photon.Card--no-header .Card-contents ul.AddonsCard-list .SearchResult-wrapper .SearchResult-result .SearchResult-name .PromotedBadge .IconPromotedBadge-small .IconPromotedBadge-svg {
      height: 3vh !important;
      width: 20px !important;
      margin: 2px 0 0 2px !important;
      transform: scale(1.5) !important;
  }

  /* COLL */
  .Collection .Collection-wrapper .Collection-detail-wrapper + .Collection-items .Card.CardList.AddonsCard.Card--photon.Card--no-header .Card-contents ul.AddonsCard-list .SearchResult-wrapper {
      height: 138px !important;
      margin-top: 5px !important;
  }
  .Collection .Collection-wrapper .Collection-detail-wrapper + .Collection-items .Card.CardList.AddonsCard.Card--photon.Card--no-header .Card-contents ul.AddonsCard-list .SearchResult-wrapper .SearchResult-result {
      height: 137px !important;
  }
  .Collection .Collection-wrapper .Collection-detail-wrapper + .Collection-items .Card.CardList.AddonsCard.Card--photon.Card--no-header .Card-contents ul.AddonsCard-list .SearchResult-wrapper .SearchResult-result .SearchResult-icon-wrapper {
      margin-top: -3px !important;
  }
  .SearchResult-icon-wrapper {
      -moz-box-ordinal-group: 2;
      order: 1;
      border-radius: 9px 0 0 9px !important;
  background: black !important;
  }
  .Search .SearchResults li.SearchResult.SearchResult--theme .SearchResult-icon-wrapper,
  .Search .SearchResults li.SearchResult.SearchResult--theme .SearchResult-icon-wrapper .SearchResult-icon {
      height: 30px !important;
      border-radius: 3px !important;
      margin-bottom: 0 !important;
  }
  .SearchResult--theme .SearchResult-icon-wrapper {
      position: absolute !important;
      display: inline-block !important;
      -moz-box-flex: unset !important;
      flex-grow: unset !important;
      width: calc(100% - 30px) !important;
      height: 100% !important;
      max-height: 45px !important;
      min-height: 45px !important;
      margin-left: 15px !important;
      margin-top: 72px !important;
      margin-bottom: 10px;
      border-radius: 9px !important;
      overflow: hidden;
      opacity: 0.7 !important;
      z-index: 500 !important;
  background: #0f1126 !important;
  }
  .SearchResult--theme:hover .SearchResult-icon-wrapper {
      opacity: 1 !important;
  background: #0f1126 !important;
  }

  .SearchResult--theme .SearchResult-icon {
      border-radius: 9px;
      display: inline-block !important;
      height: 100% !important;
      max-height: 35px !important;
      min-height: 35px !important;
      object-fit: contain !important;
      object-position: unset !important;
      width: 100% !important;
      margin-top: 5px !important;
      opacity: 1 !important;
  }

  /* SEARCH ALL - in COLL / AUTHOR / INFO */
  .SearchResult-contents {
      -moz-box-flex: 1;
      -moz-box-ordinal-group: 1 !important;
      -moz-box-orient: horizontal;
      -moz-box-pack: justify;
      -moz-box-direction: normal;
      display: flex;
      flex-flow: row wrap;
      flex-grow: 1;
      order: 1;
      justify-content: space-between;
      height: 100% !important;
      min-height: 130px !important;
      max-height: 130px !important;
      width: 72% !important;
      margin: -3px 2px 0 5px !important;
      padding: 2px 5px !important;
      border-radius: 0 9px 9px 0 !important;
  background-color: #191f2d !important;
  }
  .SearchResult-summary {
      -moz-box-flex: 1;
      flex-grow: 1;
      display: block;
      height: 100% !important;
      min-height: 75px !important;
      max-height: 75px !important;
      line-height: 15px !important;
      width: 100%;
      max-width: 465px;
      margin: 0;
      font-size: 12px;
      overflow-wrap: break-word;
      overflow: hidden !important;
      overflow-y: auto !important;
  border-top: 1px solid rgba(12, 12, 13, 0.9) !important;
  border-bottom: 1px solid rgba(12, 12, 13, 0.9) !important;
  }

  /* SEARCH NORMAL */
  .Search .SearchResults .Card.CardList.AddonsCard.Card--photon .AddonsCard-list .SearchResult .SearchResult-contents {
      min-height: 120px !important;
      max-height: 120px !important;
      margin: 0px 2px 0 5px !important;
  }

  .Search .SearchResults .Card.CardList.AddonsCard.Card--photon .AddonsCard-list .SearchResult .SearchResult-contents .SearchResult-summary {
      min-height: 80px !important;
      max-height: 80px !important;
  /* border: 1px solid tan !important; */
  }
  .Search .SearchResults .Card.CardList.AddonsCard.Card--photon .AddonsCard-list .SearchResult .SearchResult-contents .SearchResult-summary {
      max-height: 62px !important;
      min-height: 62px !important;
  }

  /* SEARCH in AUTHOR */
  .UserProfile-addons-and-reviews .SearchResult-contents {
      min-height: 110px !important;
      max-height: 110px !important;
      margin: -3px 2px 0 5px !important;
  }
  .UserProfile-addons-and-reviews .SearchResult-contents .SearchResult-summary {
      max-height: 53px !important;
      min-height: 53px !important;
  }

  /* in INFO - OTHER ADDONS on HOVER */
  .AddonsByAuthorsCard .SearchResult-name {
      display: flex !important;
      flex-direction: column !important;
      justify-content: center;
      height: 100% !important;
      min-height: 35px !important;
      max-height: 35px !important;
      line-height: 1.1;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0;
  /* background: green !important; */
  }

  /* ==== */
  .Home .SearchResult-contents {
      width: 100% !important;
  }

  /* SEARCH - ALL - THEME ITEMS*/
  li.SearchResult.SearchResult--theme .SearchResult-contents {
      -moz-box-direction: normal;
      -moz-box-flex: 1;
      -moz-box-ordinal-group: 1 !important;
      -moz-box-orient: horizontal;
      -moz-box-pack: justify;
      display: flex;
      flex-flow: row wrap;
      flex-grow: 1;
      justify-content: space-between;
      order: 1;
      height: 100% !important;
      min-height: 50px !important;
      max-height: 50px !important;
      width: 73% !important;
      margin: 55px -2px 0 8px !important;
      padding: 5px 20px 0 20px !important;
      border-radius: 9px !important;
      text-align: center !important;
      z-index: 100 !important;
  background: rgba(31, 37, 54, 0.7) !important;
  }
  .SearchResult-name {
      display: flex !important;
      /* contexte sur le parent */
      flex-direction: column !important;
      /* direction d'affichage verticale */
      justify-content: center !important;
      /* alignement vertical */
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 100% !important;
      min-height: 35px !important;
      max-height: 35px !important;
      line-height: 1.1 !important;
      margin: 0;
  }
  .SearchResult-link {
      display: inline-block !important;
      vertical-align: top !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      line-height: 15px !important;
      margin: 0;
      text-align: center !important;
      text-align: left !important;
      overflow-wrap: break-word !important;
      white-space: pre-wrap !important;
      word-break: normal !important;
  }
  li.SearchResult.SearchResult--theme .SearchResult-contents .SearchResult-name {
      height: 36px !important;
      line-height: 0.9 !important;
      margin-top: 5px !important;
      border: none !important;
  }
  li.SearchResult.SearchResult--theme .SearchResult-contents .SearchResult-name a {
      text-align: center !important;
  }
  /* THEME - COLLECTION */
  .Collection li.SearchResult.SearchResult--theme .SearchResult-contents {
      width: 73%;
      height: 100%;
      max-height: 70px !important;
      min-height: 70px !important;
      margin: 45px 0px 0 0px !important;
      padding: 5px 10px 5px !important;
      border-radius: 0 !important;
  }
  .Collection li.SearchResult.SearchResult--theme .SearchResult-contents .SearchResult-name {
      height: 36px !important;
      line-height: 0.9 !important;
      margin-top: 5px !important;
      border: none !important;
      text-align: center !important;
  }
  .Collection li.SearchResult.SearchResult--theme .SearchResult-contents .SearchResult-name a {
      height: 50px !important;
      line-height: 0.9 !important;
      margin-top: -5px !important;
      font-size: 15px !important;
      text-align: center !important;
  background: black !important;
  }
  .Collection li.SearchResult.SearchResult--theme .SearchResult-contents .SearchResult-metadata {
      margin-top: -29px !important;
  }

  /* (new93) RECOMMANDED BADGE */
  .SearchResult-name .RecommendedBadge {
      position: absolute;
      width: 17px;
      margin-top: 0;
      left: 12px !important;
      top: 65px;
      overflow: hidden;
  }
  .SearchResult-name .RecommendedBadge .RecommendedBadge-link {
      border: none;
  }

  li.SearchResult.SearchResult--theme .SearchResult-metadata {
      display: inline-block !important;
      width: 100% !important;
      text-align: center !important;
  background: rgba(31, 37, 54, 0.7) !important;
  }
  .Card.ExpandableCard.SearchFilters + .SearchResults li.SearchResult.SearchResult--theme .SearchResult-rating {
      float: right !important;
      width: auto;
  }
  .Card.ExpandableCard.SearchFilters + .SearchResults li.SearchResult.SearchResult--theme .SearchResult-author.SearchResult--meta-section {
      float: left !important;
      height: 15px;
      line-height: 18px;
      max-width: 100% !important;
      overflow: hidden;
      text-overflow: ellipsis;
  }

  .SearchResult-metadata {
      -moz-box-direction: normal;
      -moz-box-flex: 1 !important;
      -moz-box-orient: horizontal;
      display: flex;
      flex-flow: row wrap;
      flex-grow: 1;
      width: 100%;
      height: 16px !important;
      line-height: 16px !important;
      margin-top: -25px !important;
  }
  .SearchResult-rating {
      height: 15px !important;
      line-height: 13px !important;
      margin-right: 5px !important;
  }
  .Rating.Rating--small {
      grid-column-gap: 6px !important;
      min-height: 13px;
      width: -moz-min-content;
      -moz-box-pack: start;
      justify-content: flex-start;
      margin: 0;
  }

  /* (new134) RATING STARS - ALL */
  .Rating-star,
  .Rating--small .Rating-star {
      min-width: 13px !important;
      max-width: 13px !important;
      margin-right: -2px !important;
  }


  /* FOR FIREFOX QUANTUM ??? (TOO NARROW) -
  https://addons.mozilla.org/fr/firefox/addon/auto-tab-discard/
  === */
  .AddonMeta .MetadataCard.AddonMeta-overallRating .MetadataCard-list:last-of-type .AddonMeta-rating-content .Rating.Rating--small,
  .AddonMeta-rating-content .Rating.Rating--small {
      grid-column-gap: 12px !important;
  }

  /* SEARCH - METAS  */
  .SearchResult--meta-section {
      height: 10px !important;
      line-height: 10px !important;
      font-size: 10px !important;
      margin: 0;
      padding: 0;
  }
  .SearchResult-author.SearchResult--meta-section {
      height: 15px !important;
      line-height: 11px !important;
      max-width: 100% !important;
      overflow: hidden;
      text-overflow: ellipsis;
  }
  .Card.CardList.AddonsCard.AddonRecommendations .SearchResult-author.SearchResult--meta-section {
      height: 15px !important;
      line-height: 11px !important;
      max-width: 48% !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: pre;
  }

  /* SEARCH - METAS - USERS - ALL  */
  .SearchResult-users {
      -moz-box-flex: 0;
      -moz-box-ordinal-group: 2 !important;
      flex-grow: 0;
      order: 1;
      width: 100% !important;
  /*border: 1px solid aqua  !important;*/
  }




  /* COLLECTION */
  .CollectionDetails {
      display: inline-block !important;
      width: 100% !important;
  }

  .CollectionDetails .MetadataCard {
      display: inline-block;
      -moz-box-direction: unset;
      -moz-box-orient: unset;
      -moz-box-pack: unset;
      border-radius: 8px;
      flex-direction: unset !important;
      justify-content: unset !important;
  }
  .CollectionDetails .MetadataCard-list {
      -moz-box-flex: unset !important;
      flex: unset !important;
      float: left !important;
      clear: none !important;
      max-width: 100% !important;
      min-width: 100% !important;
      margin: 12px;
      margin-left: 0px !important;
      margin-bottom: 0 !important;
      overflow-wrap: break-word;
      hyphens: auto;
      text-align: left;
  background: rgba(12, 12, 13, 0.9) !important;
  }

  /* (new145) COLL - EDIT */
  .Page-not-homepage .Collection a.CollectionDetails-edit-details-button.Button--puffy {
      padding: 0 2px;
  background: rgba(12, 12, 13, 0.9) !important;
  }

  .Page-not-homepage .Collection .Collection-delete-button .Button--cancel {
      background: rgba(12, 12, 13, 0.9) !important;
  }
  /* (new125)ADON - INFO PAGE - CARDS - ALL */
  .Card--no-footer .Card-contents,
  .Card--photon .Card-contents,
  .Card-contents {
      padding: 5px 15px !important;
  background: #1f2536 !important;
  }

  /* ICONS BACKGROUND - === */
  .Addon-icon-image,
  .SearchResult-icon {
      display: inline-block;
      padding: 3px !important;
      background-color: rgba(191, 191, 190, 0.33) !important;
      border-radius: 5px;
      box-shadow: 0 0 2px #cccccc inset;
  }

  /* BIG */
  .AddonSummaryCard-header-icon-image,
  .Addon-icon-image {
      border-radius: 5px;
      box-shadow: 0 0 2px #cccccc inset;
      background-color: rgba(191, 191, 190, 0.33) !important;
  }
  /* SMALL */
  .SearchResult-icon {
      height: 28px !important;
      width: 28px !important;
      margin-top: 8px !important;
      padding: 3px !important;
  }
  .Addon-header-wrapper {
      float: left !important;
      width: 20% !important;
      height: 418px !important;
      margin-top: 0px !important;
      overflow: hidden !important;
      border-radius: 9px !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }
  /* (new112) */
  .Addon.Addon-extension.Addon--has-more-than-0-addons.Addon--has-more-than-3-addons .Addon-header-wrapper {
      margin-top: 0px !important;
  }


  .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer {
      display: inline-block !important;
      width: 100% !important;
      min-height: 43vh  !important;
      max-height: 420px !important;
      margin-bottom: 0px !important;
      margin-right: 0px !important;
      padding: 3px !important;
      border-radius: 9px !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }
  .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer .Addon-icon {
      float: left !important;
      clear: both !important;
      min-height: 70px !important;
      max-height: 70px !important;
      width: 15% !important;
      min-width: 0px !important;
  }
  .Addon-icon-wrapper {
      height: 100% !important;
      width: 100% !important;
      overflow: hidden;
  }
  .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer .AddonTitle {
      grid-column: none !important;
      float: right !important;
      width: 81% !important;
      height: 70px !important;
      line-height: 1.1 !important;
      margin: 2px 0 0px 5px !important;
      font-size: 18px;
      overflow-wrap: break-word;
  }
  /* TITLE - THEME */
  .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer .Addon-header .ThemeImage.ThemeImage--rounded-corners + .AddonTitle {
      width: 100% !important;
      height: 70px !important;
      line-height: 1.1 !important;
  }

  /* MULTI AUTHORS:
  https://addons.mozilla.org/fr/firefox/addon/test-feedback/?src=recommended
  === */
  .AddonTitle .AddonTitle-author {
      font-size: 12px !important;
  }
  .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer .AddonTitle .AddonTitle-author {
      height: 33px;
      font-size: 12px !important;
      overflow: hidden;
      overflow-y: auto;
  }

  .AddonTitle .AddonTitle-author a,
  .AddonTitle .AddonTitle-author a:link {
      font-size: 14px;
      line-height: 14px;
  }

  /* ADDON - SUMMARY */
  .Addon-summary-and-install-button-wrapper {
      -moz-box-pack: unset;
      display: inline-block;
      justify-content: unset;
      width: 100%;
  }



  /* (new125) old ADDON - UNIINSTAL BUTTON  */
  .Button.Button--neutral.AMInstallButton-button.AMInstallButton-button--uninstall.Button--puffy {
      width: 136px !important;
      background: #526289 !important;
  }
  .Button.Button--neutral.AMInstallButton-button.AMInstallButton-button--uninstall.Button--puffy:hover {
      background: red !important;
  }

  /* (new134) old ADDON - RATING  */
  .Addon-header-wrapper .Addon-header-meta-and-ratings {
      position: absolute !important;
      display: inline-block !important;
      height: 70px !important;
      width: 19.3% !important;
      min-width: 0px !important;
      top: 420px !important;
      left: 0.8% !important;
      margin-bottom: 0px !important;
      z-index: 1 !important;
      overflow: hidden !important;
  border-bottom: 1px solid red !important;
  border-top: 1px solid red !important;
  }
  .Addon-header-wrapper .Addon-header-meta-and-ratings .Card-contents {
      padding-top: 12px !important;
  }
  .Addon-header-wrapper .Addon-header-meta-and-ratings:hover {
      position: absolute !important;
      display: inline-block !important;
      height: auto !important;
      width: 19.3% !important;
      min-width: 300px;
      margin-bottom: 0px !important;
      border-radius: 5px !important;
      overflow: hidden !important;
      transition: all ease 0.7s !important;
  background: #1f2536 !important;
  border: 1px solid red !important;
  }
  .MetadataCard-list {
      flex: 1 1 0;
      hyphens: auto;
      margin: 1.5vh 0 0 0px !important;
      text-align: left;
  }


  /* ADDON - TOP LEFT - === */

  /* (new154) THEME - ICON SCREEN SHOT - CENTER - === */
  .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer .ThemeImage--rounded-corners {
      position: absolute;
      display: inline-block;
      width: 100%;
      max-width: 77%;
      min-height: 535px;
      max-height: 535px;
      left: 21.3%;
      top: 86px;
      border-radius: 9px;
  background-color: #1d2232;
  border: 1px solid red;
  }
  .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer .ThemeImage--rounded-corners .ThemeImage-image {
      position: absolute;
      display: inline-block;
      width: 100%;
      min-width: 100%;
      max-width: 100%;
      min-height: 18vh !important;
      max-height: 18vh !important;
      left: 0%;
      top: 16.5vh !important;
      padding: 0 30px !important;
  }
  .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer.ThemeImage-image {
      object-fit: contain !important;
      object-position: top center !important;
      border-radius: 9px !important;
  }

  /* ADDON - NO REVIEWS */
  .Card-footer.Card-footer-link,
  .Card-footer.Card-footer-text,
  .Addon-read-reviews-footer {
      display: none !important;
      padding: 0 !important;
  }

  /* (new124) INSTALL REQUIRE - DOWNLOD XPI */
  .InstallButtonWrapper-download {
      margin-top: -21px !important;
      margin-left: -260px !important;
      text-align: center !important;
  /* border: 1px dashed violet !important; */
  }
  /* (new125) INSTALL - NO DOWNLOAD XPI */
  .InstallButtonWrapper {
      height: 30px !important;
      margin-left: 192px !important;
      margin-top: 15px !important;
  /* border: 1px dashed violet !important; */
  }
  .Addon .Addon-summary-and-install-button-wrapper .AMInstallButton--noDownloadLink {
      height: 30px !important;
      margin-top: -3px !important;
      margin-bottom: 0px !important;
  /* border: 1px solid violet !important; */
  }
  .Addon-summary-and-install-button-wrapper .Button {
      min-height: 27px !important;
      max-height: 27px !important;
      padding: 0 16px;
      border-radius: 4px;
      font-size: 16px;
  }

  /* (new129) NEED INSTALL NEW VERSION FIREFOX */
  .InstallButtonWrapper .GetFirefoxButton {
      position: absolute !important;
      display: inline-block !important;
      min-width: 368px !important;
      height: 30px !important;
      left: 15px !important;
      top: 41.5vh !important;
      border-radius: 5px !important;
  background: #1f2536 !important;
  border: 1px solid rgba(12, 12, 13, 0.9);
  border: 1px solid yellow !important;
  }
  .GetFirefoxButton-callout {
      position: absolute !important;
      display: inline-block !important;
      width: 20px !important;
      height: 28px !important;
      line-height: 28px !important;
      padding: 3px 0 0px 1px !important;
      margin: 16px auto;
      top: -1.7vh !important;
      left: 5px !important;
  border: 1px solid green !important;
  }
  .GetFirefoxButton-callout::before {
      display: none !important;
  }

  .InstallButtonWrapper .GetFirefoxButton .Button.Button--action.GetFirefoxButton-button.Button--puffy {
      width: 250px !important;
      line-height: 13px !important;
      padding: 0 30px !important;
      font-size: 14px !important;
      white-space: pre-line;
      overflow: hidden !important;
  }
  .InstallButtonWrapper .GetFirefoxButton .GetFirefoxButton-callout-text {
      position: absolute !important;
      display: inline-block !important;
      width: 126px;
      height: auto !important;
      line-height: 12px;
      left: -2px;
      top: -8.5vh;
      padding: 2px 2px 4vh 2px !important;
      font-size: 12px !important;
      border-radius: 5px !important;
      opacity: 0 !important;
      visibility: hidden !important;
  color: gold !important;
  background: red;
  }
  .InstallButtonWrapper .GetFirefoxButton:hover .GetFirefoxButton-callout-text {
      visibility: visible !important;
      opacity: 1!important;
  color: gold !important;
  background: red;
  }
  .InstallButtonWrapper .GetFirefoxButton + .InstallButtonWrapper-download {
      margin-left: -200px !important;
      margin-top: -11px !important;
      text-align: center;
  }



  /* ADDON INFO - 
  TAKE CARE:
  - NOTICE IMPCOMPATIBILITY FIR version:
  https://addons.mozilla.org/fr/firefox/addon/open-with/
  - MOZ no Survey:
  https://addons.mozilla.org/fr/firefox/addon/open-with/
  === */
  .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer .Addon-header {
      grid-template-columns: unset !important;
      display: inline-block !important;
      min-width: 100% !important;
      max-width: 100% !important;
  }


  /*(new125) ADDON - INCOMPATIBILITY - HEADER +  ICON - BADGE */
  .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer .Notice.Notice-error.AddonCompatibilityError + .Addon-header {
      margin-top: 18px !important;
  }
  .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer .Notice.Notice-error.AddonCompatibilityError + .Addon-header .Addon-icon {
      margin-top: -17px !important;
  }
  .Addon.Addon-extension.Addon--has-more-than-0-addons .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer .Notice.Notice-error.AddonCompatibilityError + .Addon-header .Addon-icon {
      margin-top: -7px !important;
  }

  .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer .Notice.Notice-error.AddonCompatibilityError + .Addon-header .AddonBadges {
      top: 58px !important;
  }

  /* (new165) OLD FIRST - A VOIR */
  /*.Addon-details {
      grid-auto-flow: unset !important;
      grid-gap: unset !important;
      grid-template-columns: unset !important;
      display: inline-block !important;
      width: 80% !important;
      margin-top: 0px !important;
  }*/

  /* (new165) OLD FIRST - A VOIR */
  /* ADDON INFOS GOOD */
  /*.Addon.Addon-extension.Addon--has-more-than-0-addons.Addon--has-more-than-3-addons .Addon-details {
      margin-top: 0px !important;
  }*/

  /* (new145) ADDON INFOS - DICO / THEME - GOOD */
  .Page-amo .Header.Header-no-hero-promo + .Page-content .Page.Page-not-homepage .Addon.Addon-theme.Addon--has-more-than-0-addons,
  .Page-amo .Header.Header-no-hero-promo + .Page-content .Page.Page-not-homepage .Addon.Addon-dictionary {
      margin-top: -21px !important;
  }

  /* (new102) OTHER ADDONS USED */
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer {
      margin-top: 0;
      width: 62.5% !important;
      float: left !important;
      height: 163px !important;
      margin-bottom: 0 !important;
      padding: 3px !important;
      border-radius: 9px !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents {
      height: 124px !important;
  }
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer .SearchResult-icon-wrapper {
      height: 95px !important;
  }
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list {
      display: unset !important;
      grid-auto-flow: unset !important;
      grid-template-columns: unset !important;
  }

  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list .SearchResult:hover,
  .AddonRecommendations.AddonsCard--horizontal ul.AddonsCard-list .SearchResult:hover,
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list .SearchResult,
  .AddonRecommendations.AddonsCard--horizontal ul.AddonsCard-list .SearchResult {
      grid-column: unset !important;
      float: left !important;
      height: 107px !important;
      width: 100% !important;
      min-width: 24% !important;
      max-width: 24% !important;
      margin: 0px 2px 2px 2px !important;
      padding: 5px 5px !important;
      border-radius: 9px !important;
  }
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer .SearchResult-result {
      display: grid;
      grid-column-gap: 8px !important;
      grid-template-columns: 27px auto !important;
  }
  .AddonRecommendations.AddonsCard--horizontal ul.AddonsCard-list .SearchResult:hover .SearchResult-users {
      display: inline-block !important;
  }
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer .SearchResult-contents {
      grid-area: unset !important;
      display: inline-block !important;
      height: 100% !important;
      max-height: 98px !important;
      min-height: 98px !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0 2px 0 0px !important;
      padding: 2px 2px !important;
      border-radius: 0 9px 9px 0 !important;
  background-color: #191f2d !important;
  }
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer .SearchResult-contents .SearchResult-name {
      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;
      height: 100%;
      min-height: 40px !important;
      max-height: 40px !important;
      width: 100%;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0;
  }
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer .SearchResult-contents .SearchResult-metadata {
      height: auto;
      min-height: 40px !important;
      line-height: 5px !important;
      margin-top: 0px !important;
  }
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer .SearchResult-contents .SearchResult-metadata .SearchResult-rating {
      width: 100% !important;
      height: 20px !important;
      line-height: 20px !important;
  }
  .Rating.Rating--small,
  .Page.Page-not-homepage .Search .SearchResult-wrapper .SearchResult-result .SearchResult-contents .SearchResult-metadata .SearchResult-rating .Rating.Rating--small,
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer .SearchResult-contents .SearchResult-metadata .SearchResult-rating .Rating.Rating--small {
      grid-column-gap: 11px !important;
  }
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer .SearchResult-users.SearchResult--meta-section {
      height: 10px !important;
      min-height: 10px !important;
      line-height: 10px !important;
      margin-top: -15px !important;
  }


  /* (new165) OLD FIRST - A VOIR */
  /* (new162) MORE ADONS by THIS AUTHOR - when NO Screnshots / NO Description */
  .Addon-main-content:not(:has(.Card.Addon-screenshots)):not(:has(.AddonDescription-contents)) ~ div .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal {
      left: -26.4% !important;

  }



  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer header.Card-header .Card-header-text {
      display: inline-block !important;
      width: 100% !important;
      margin: 0 0 0 0 !important;
      padding: 0px 5px !important;
      text-align: left;
      font-size: 15px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
  }
  /* (new161) HOVER */
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer:hover {
      height: auto !important;
      width: auto !important;
      width: 100% !important;
      z-index: 50000000 !important;
  background: black !important;
  }



  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list {
      display: inline-block !important;
      min-width: 100% !important;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list li.SearchResult {
      float: left !important;
      clear: none !important;
      min-width: 19% !important;
      max-width: 19% !important;
      height: 100%;
      max-height: 87px !important;
      min-height: 87px !important;
      margin: 5px 10px 20px 0 !important;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper {
      display: inline-block !important;
      height: 98px;
      width: 100%;
      margin-top: -3px;
      padding: 0px !important;
  }
  /* (new145) */
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result {
      display: inline-block !important;
      height: 10vh !important;
      padding: 0px!important;
      border-radius: 5px !important;
  background-color: transparent !important;
  border: 1px solid red !important;
  }
  /* (new145) */
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result .SearchResult-icon-wrapper {
      display: inline-block;
      height: 9.5vh !important;
      width: 32px;
      text-align: center;
  }
  /* (new145) */
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result .SearchResult-contents {
      float: right !important;
      max-height: 9.8vh !important;
      min-height: 9.8vh !important;
      width: 88% !important;
      margin: 0px !important;
      padding: 5px 10px !important;
  /*border: 1px solid aqua !important;*/
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result .SearchResult-metadata {
      float: left !important;
      margin-top: -1vh !important;
  /*border: 1px solid aqua !important;*/
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result .SearchResult-author.SearchResult--meta-section {
      display: block !important;
      float: right !important;
      height: 1.7vh !important;
      width: 50% !important;
      margin-top: 0vh !important;
  /*border: 1px solid yellowgreen !important;*/
  }

  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result .SearchResult-users {
      display: block !important;
      float: right !important;
      height: 1.7vh !important;
      width: 84.8% !important;
      margin-top: -2vh !important;
  /*border: 1px solid green !important;*/
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-link {
      max-height: 130px !important;
      min-height: 130px !important;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-link .SearchResult-result .SearchResult-icon-wrapper {
      height: 60px !important;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-link .SearchResult-result .SearchResult-users.SearchResult--meta-section {
      display: inline-block !important;
      height: 15px !important;
      margin-left: 0;
      margin-top: 0px !important;
      word-wrap: break-word !important;
      white-space: nowrap !important;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme {
      max-height: 130px !important;
      min-height: 130px !important;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-icon-wrapper {
      min-width: 14.3% !important;
      max-width: 14.3% !important;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-link .SearchResult-result .SearchResult-contents {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      max-height: 55px !important;
      min-height: 55px !important;
      margin-left: -3px !important;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-link .SearchResult-result .SearchResult-contents h2.SearchResult-name {
      -moz-box-flex: unset !important;
      flex-grow: unset !important;
      text-overflow: unset !important;
      white-space: unset !important;
      overflow: unset !important;
      overflow-wrap: break-word;
      width: 100%;
      min-width: 100%;
      max-width: 100%;
      line-height: 1.1;
      margin: 0;
      padding: 0;
      font-size: 13px;
      text-align: center;
      text-decoration: none;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-link .SearchResult-result .SearchResult-users {
      grid-area: unset !important;
      margin-left: 0;
      margin-top: 13px;
  }


  /* MORE THEMES by THIS AUTHOR - === */
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer.AddonsByAuthorsCard--theme {
      border: 1px solid yellow;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer.AddonsByAuthorsCard--theme header.Card-header {
      height: 28px !important;
      line-height: 10px !important;
      margin-top: -6px !important;
      padding: 0px 5px !important;
      font-size: 10px !important;
      overflow: hidden;
      overflow-wrap: break-word;
      text-align: left;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer.AddonsByAuthorsCard--theme .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper {
      display: inline-block !important;
      min-height: 130px !important;
      width: 100%;
      margin-top: -3px;
      padding: 0px !important;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer.AddonsByAuthorsCard--theme .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result {
      display: inline-block !important;
      min-height: 132px !important;
      width: 100%;
      padding: 0px !important;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer.AddonsByAuthorsCard--theme .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result .SearchResult-icon-wrapper {
      max-width: 15.55% !important;
      min-width: 15.55% !important;
      margin: 0 !important;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer.AddonsByAuthorsCard--theme .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result .SearchResult-contents {
      display: inline-block;
      float: none !important;
      width: 100% !important;
      max-height: 130px !important;
      min-height: 130px !important;
      margin-top: 0px !important;
      padding: 5px 10px;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer.AddonsByAuthorsCard--theme .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result .SearchResult-contents .SearchResult-name {
      height: 26px !important;
      line-height: 0.9;
      margin-top: 50px !important;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer.AddonsByAuthorsCard--theme .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result .SearchResult-contents .SearchResult-name .SearchResult-link {
      max-height: 30px !important;
      min-height: 30px !important;
  }
  /* (new165) OLD FIRST - A VOIR */
  /* (new145) old NO SCREENSHOTS / DESCRIPTION ONLY "Others users... " _ === */
  .Addon-main-content .Card:only-of-type {
      display: inline-block;
      float: none !important;
      height: 349px;
      width: 100% !important;
      max-width: 100% !important;
      min-width: 100% !important;
      margin-top: 0;
  /*border: 1px solid aqua !important;*/
  }
  /* (new125) MESSAGES - ERROR / ICOMPATIBILITY - 
  With experimental : https://addons.mozilla.org/en-US/firefox/addon/first-party-isolation/?src=recommended
  INCOMPATIBLITY + NO survey
  https://addons.mozilla.org/fr/firefox/addon/open-with/
  === */
  .Notice.Notice-warning.InstallWarning,
  .Addon-header-info-card .Addon-non-public-notice,
  .Addon-header-info-card .AddonCompatibilityError {
      position: absolute;
      height: 20px !important;
      line-height: 0px;
      top: 60px !important;
      left: 21px !important;
      margin-bottom: 0 !important;
      padding: 0 0 0 150px !important;
  }
  .Notice-dismisser-button,
  .Notice-icon {
      margin: 3px 7px 7px;
  }
  .Addon-header-info-card .Notice.Notice-error .Notice-column {
      height: 20px !important;
      line-height: 20px !important;
  }
  .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer .Card-contents .AddonCompatibilityError + .Addon-header .AddonTitle {
      margin-top: -10px !important;
  }
  /* (new121) Not MOZ SURVEY / Not Plateform */
  .WrongPlatformWarning.Addon-WrongPlatformWarning,
  .Addon-header-info-card .Notice.Notice-warning.InstallWarning {
      position: absolute;
      width: 30px !important;
      height: 32px !important;
      top: 60px !important;
      left: 0.65% !important;
      margin-bottom: 0 !important;
      padding-left: 0px !important;
      overflow: hidden !important;
  }
  .WrongPlatformWarning.Addon-WrongPlatformWarning {
      height: 20px !important;
      line-height: 22px !important;
  }
  .Notice-warningInfo .Notice-icon {
      margin-top: -1px;
  }
  .WrongPlatformWarning.Addon-WrongPlatformWarning:not(:hover) .Notice-warningInfo {
      height: 20px !important;
      line-height: 22px !important;
  }
  .WrongPlatformWarning.Addon-WrongPlatformWarning:hover,
  .Addon-header-info-card .Notice.Notice-warning.InstallWarning:hover {
      width: 19.5% !important;
      height: auto !important;
  }

  /* (new139) ADDON BADGE - CONTAINER */
  .Addon.Addon-extension .AddonTitle + .AddonBadges {
      position: absolute !important;
      display: inline-block;
      grid-area: unset !important;
      right: 0% !important;
      top: 6vh !important;
  /* border: 1px solid aqua  !important; */
  }


  /* (new141) old ADDON BADGE - PROMOTED - ALL */
  .PromotedBadge-large .PromotedBadge-link {
      background: gold;
  }
  .SearchResult-name .PromotedBadge:hover {
      width: auto;
  }
  /* .SearchResult-name .PromotedBadge:hover a {
      font-size: 10px ;
      background: gold;
  } */
  /* (new140) ADDON BADGE - IN INFOS ADDON TOP - PROMOTED */
  .AddonsByAuthorsCard .SearchResult-name .PromotedBadge {
      position: absolute !important;
      display: inline-block !important;
      width: 17px !important;
      margin-left: -30px !important;
      margin-top: 65px !important;
      font-size: 0;
      overflow: hidden;
      z-index: 5000 !important;
  }
  .AddonsByAuthorsCard .SearchResult-name .PromotedBadge {
      margin-left: 0px !important;
  }
  /* (new140) old ADDON BADGE - IN SEARCH RELATED - PROMOTED :
  https://addons.mozilla.org/en-US/firefox/extensions/category/search-tools/
  ====	*/
  /* old SEARCH - BADGE SMALL - ALL */
  .SearchResult-wrapper .PromotedBadge.PromotedBadge--line.PromotedBadge-small {
      position: absolute !important;
      display: inline-block !important;
      vertical-align: middle !important;
      width: 37px !important;
      height: 4vh !important;
      line-height: 2vh !important;
      margin: 4vh 0 0 -3px !important;
      padding: 0 !important;
      font-size: 0 !important;
      overflow: visible !important;
      z-index: 5000 !important;
      border-radius: 100% !important;
  background: #222 !important;
  border: 1px solid red !important;
  }
  .SearchResult-wrapper .PromotedBadge.PromotedBadge--line.PromotedBadge-small a.PromotedBadge-link {
      display: inline-block !important;
      min-height: 4vh !important;
      max-height: 4vh !important;
      width: 40px !important;
      margin: 0px 0 0 0px !important;
      padding: 2px !important;
      border-radius: 0 !important;
      font-size: 0px !important;
      opacity: 1 !important;
  border: none !important;
  }
  .SearchResult-wrapper .PromotedBadge.PromotedBadge--line.PromotedBadge-small a.PromotedBadge-link .IconPromotedBadge-small.Icon-line {
      height: 3.2vh !important;
      width: 29px !important;
      border-radius: 100% !important;
      background-size: 18px auto !important;
  border: 1px solid #d7d7db;
  }
  .SearchResult-wrapper .PromotedBadge.PromotedBadge--line.PromotedBadge-small a.PromotedBadge-link:hover span.PromotedBadge-label {
      position: absolute !important;
      display: inline-block !important;
      width: auto !important;
      height: 3vh !important;
      line-height: 22px !important;
      margin: -2.8vh 0 0 33px !important;
      padding: 0 5px !important;
      border-radius: 5px !important;
      font-size: 20px !important;
      white-space: nowrap !important;
      transform: scale(1) !important;
      z-index: 500000 !important;
      color: white !important;
  background: green !important;
  border: 1px solid red !important;
  }

  /* old RECOMMNDED */
  .Search .SearchResults .Card.CardList.AddonsCard.Card--photon .AddonsCard-list .SearchResult .SearchResult-contents .SearchResult-name .PromotedBadge.PromotedBadge--recommended.PromotedBadge-small {
      position: absolute !important;
      display: inline-block !important;
      vertical-align: middle !important;
      width: 37px !important;
      height: 4vh !important;
      line-height: 2vh !important;
      margin: 4vh 0 0 -3px !important;
      font-size: 0 !important;
      overflow: hidden !important;
      z-index: 5000 !important;
      border-radius: 100% !important;
  background: #222 !important;
  /*border: 1px solid aqua  !important;*/
  }

  .Search .SearchResults .Card.CardList.AddonsCard.Card--photon .AddonsCard-list .SearchResult .SearchResult-contents .SearchResult-name .PromotedBadge.PromotedBadge--recommended.PromotedBadge-small a.PromotedBadge-link {
      display: inline-block !important;
      min-height: 4vh !important;
      max-height: 4vh !important;
      width: 40px !important;
      margin: 3px 0 0 3px !important;
      padding: 2px !important;
      border-radius: 0 !important;
      font-size: 0px !important;
      opacity: 1 !important;
  border: none !important;
  /*border: 1px solid yellow !important;*/
  }

  .Search .SearchResults .Card.CardList.AddonsCard.Card--photon .AddonsCard-list .SearchResult .SearchResult-contents .SearchResult-name .PromotedBadge.PromotedBadge--recommended.PromotedBadge-small a.PromotedBadge-link svg.IconPromotedBadge-svg {
      transform: scale(2.1) !important;
  }

  .Search .SearchResults .Card.CardList.AddonsCard.Card--photon .AddonsCard-list .SearchResult .SearchResult-contents .SearchResult-name .PromotedBadge.PromotedBadge--recommended.PromotedBadge-small a.PromotedBadge-link svg.IconPromotedBadge-svg g {
      transform: scale(1) !important;
  }



  /* (new140) old ADDON BADGE - IN INFOS ADDON > SEARCH RELATED - PROMOTED :
  https://addons.mozilla.org/fr/firefox/addon/photoshow/
  ====	*/
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer .SearchResult-name .PromotedBadge {
      position: absolute !important;
      display: inline-block !important;
      width: 25px !important;
      margin: 5px 0 0 0px !important;
      font-size: 0;
      overflow: hidden;
      z-index: 5000 !important;
  }


  /* (new139) old ADDON BADGE: PAYEMENT - ICON:
  https://addons.mozilla.org/fr/firefox/addon/dearrow/
  ====*/
  /* .PromotedBadge , */
  .AddonBadges .Badge.Badge-requires-payment {
      position: absolute;
      top: 0 !important;
      left: 0px !important;
      margin: 0 0 0 0 !important;
      padding: 5px 46px 5px 46px !important;
      border-radius: 9px !important;
      font-size: 18px !important;
  color: red !important;
  /* background: url("https://addons.cdn.mozilla.net/media/img/impala/warning-bg.png?b726031") repeat scroll 0 0 transparent; */
  background: linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 60%) repeat scroll 0 0%, transparent -moz-repeating-linear-gradient(-45deg, #00efc4, #00efbc 7px, #ffed00 7px, #fff500 14px) repeat scroll 0 0 !important;
      transform: scale(0.7) !important;
  }

  /* .AddonBadges span.Icon{
  display: inline-block !important;
      width: 100%;
  height: 26px !important;
      width: 26px !important;
  } */
  .AddonBadges .Badge.Badge-requires-payment span.Icon-requires-payment {
      /*     background: rgba(0, 0, 0, 0) url("https://addons.mozilla.org/static-frontend/7a228775c8f260541cc1de758c74d6ba.svg") no-repeat scroll 50% center / contain !important; */
      content: "";
      position: absolute !important;
      display: inline-block !important;
      flex-shrink: unset !important;
      height: 100% !important;
      min-height: 46px !important;
      max-height: 46px !important;
      width: 100% !important;
      min-width: 46px !important;
      max-width: 46px !important;
      left: -160px !important;
      top: -1vh !important;
      /* font-size: 30px  !important; */
  background: none !important;
  }
  .AddonBadges .Badge.Badge-requires-payment span.Icon-requires-payment span {
      /*     background: rgba(0, 0, 0, 0) url("https://addons.mozilla.org/static-frontend/7a228775c8f260541cc1de758c74d6ba.svg") no-repeat scroll 50% center / contain !important; */
      position: absolute !important;
      display: inline-block !important;
      flex-shrink: unset !important;
      vertical-align: bottom !important;
      height: 100% !important;
      min-height: 46px !important;
      max-height: 46px !important;
      width: 100% !important;
      min-width: 46px !important;
      max-width: 46px !important;
      /* left: 0 !important; */
      margin: 0 0 0 25px !important;
      font-size: 0 !important;
      clip: unset !important;
      overflow-wrap: unset !important;
      overflow: visible !important;
      z-index: 500000 !important;
  background: none !important;
  }
  .AddonBadges .Badge.Badge-requires-payment span.Icon-requires-payment span:after {
      /*     background: rgba(0, 0, 0, 0) url("https://addons.mozilla.org/static-frontend/7a228775c8f260541cc1de758c74d6ba.svg") no-repeat scroll 50% center / contain !important; */
      content: "$" !important;
      position: absolute !important;
      display: inline-block !important;
      /* vertical-align: middle !important; */
      flex-shrink: unset !important;
      height: 100% !important;
      min-height: 46px !important;
      max-height: 46px !important;
      line-height: 46px !important;
      width: 100% !important;
      min-width: 46px !important;
      max-width: 46px !important;
      font-size: 30px !important;
      text-align: center !important;
      border-radius: 8px 3px 3px 8px !important;
      clip: unset !important;
      overflow-wrap: unset !important;
      overflow: visible !important;
  color: gold !important;
  background: green !important;
  }
  /* (new138) old ADDON BADGE - EXPERIMENTAL / RECOMMANDED :
  With VERSION incompatility : 
  https://addons.mozilla.org/en-US/firefox/addon/first-party-isolation/?src=recommended
  Whith QUANTUM icompatibility:

  === */
  .PromotedBadge,
  .AddonBadges .RecommendedBadge.RecommendedBadge-large,
  .AddonBadges .RecommendedBadge,
  .AddonBadges .Badge {
      position: absolute;
      top: 0 !important;
      left: 0px !important;
      margin: 0 !important;
      padding: 5px !important;
      border-radius: 9px !important;
  color: red !important;
  background: url("https://addons.cdn.mozilla.net/media/img/impala/warning-bg.png?b726031") repeat scroll 0 0 transparent;
  background: linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 60%) repeat scroll 0 0%, -moz-repeating-linear-gradient(-45deg, #F0B500, #F0B500 7px, #FFD000 7px, #FFD000 14px) repeat scroll 0 0 transparent;
      transform: scale(0.6) !important;
  }
  .Addon-header-info-card .AddonCompatibilityError + .Addon-header .AddonBadges .Badge.Badge-not-compatible {
      position: absolute;
      top: 30px !important;
      width: 138px !important;
      line-height: 15px !important;
      text-align: center !important;
  }
  .Addon-header-info-card .AddonCompatibilityError + .Addon-header .AddonBadges .Badge.Badge-not-compatible .Icon.Icon-not-compatible {
      vertical-align: top;
      float: left !important;
      display: none !important;
  }

  /* (new145) old BADGE ANDROID */
  .Addon-header-info-card .AddonBadges .Badge.Badge-android-compatible {
      position: absolute;
      top: -6.5vh !important;
      left: 0 !important;
      margin: 0 0 0 -25px !important;
      width: 230px !important;
      padding: 10px 30px 5px 10px !important;
      line-height: 20px !important;
      font-size: 20px !important;
      text-align: center !important;
  color: white !important;
  background: #2D2D35 !important;
  }
  .Addon-header-info-card .AddonBadges .Badge.Badge-android-compatible .Icon-android {
      width: 45px !important;
      height: 45px !important;
      background-size: contain;
      background-position: 0px 15px !important;
      transform: scale(1) !important;
  }


  /* (new125) old WORK AROUND FOR INSTALL INCOMPATIBLE ADDON :
   https://www.reddit.com/r/waterfox/comments/boazxg/mozilla_disabled_addon_fix_for_firefox_52_56/
  AND for DISABLED ADDO  read:
   https://www.ghacks.net/2019/05/14/mozilla-releases-add-on-to-fix-signing-issue-in-older-firefox-versions/
  ==== */
  .Button.Button--action.AMInstallButton-button.disabled.Button--disabled.Button--puffy {
      position: relative !important;
      display: inline-block !important;
      width: 138px !important;
      top: -2px !important;
      /* opacity: 0.2 !important; */
  /* border: 1px dashed violet !important; */
  }
  .Button.Button--action.AMInstallButton-button.disabled.Button--disabled.Button--puffy.AMInstallButton-transition-enter-done {
      position: relative !important;
      display: inline-block !important;
      width: 138px !important;
      top: 3px !important;
  /* border: 1px solid violet !important; */
  }
  .Button.Button--action.AMInstallButton-button.disabled.Button--disabled.Button--puffy:hover,
  .Button.Button--action.AMInstallButton-button.disabled.Button--disabled.Button--puff:hover {
      opacity: 1 !important;
  }
  /* (new126) old */
  .GetFirefoxButton + .InstallButtonWrapper-download .InstallButtonWrapper-download-link:before,
  .AMInstallButton .Button.Button--action.AMInstallButton-button.disabled.Button--disabled.Button--puffy:before {
      content: "To install it ..." !important;
      position: absolute !important;
      display: inline-block !important;
      grid-area: unset !important;
      margin-top: -25px !important;
      margin-left: -38px !important;
      width: 138px !important;
      height: 20px !important;
      line-height: 15px !important;
      padding: 3px !important;
      text-align: center !important;
      white-space: pre-wrap !important;
      word-wrap: normal !important;
      overflow-wrap: normal !important;
      overflow: hidden !important;
      cursor: move !important;
      opacity: 1 !important;
      transition: all ease 0.7s !important;
  color: red !important;
  background: gold !important;
  }
  .GetFirefoxButton + .InstallButtonWrapper-download .InstallButtonWrapper-download-link:before {
      margin-top: -20px !important;
      margin-left: 0px !important;
  }

  .Button.Button--action.AMInstallButton-button.disabled.Button--disabled.Button--puffy:not(.AMInstallButton-transition-enter-done):before {
      margin-top: -25px !important;
      margin-left: -17px !important;
  /* background: red !important; */
  }


  .GetFirefoxButton + .InstallButtonWrapper-download:hover .InstallButtonWrapper-download-link:before,
  .AMInstallButton:hover .Button.Button--action.AMInstallButton-button.disabled.Button--disabled.Button--puffy:before {
      content: "To install it: \\A Try to drag it \\A into \\A the address bar" !important;
      position: absolute !important;
      display: inline-block !important;
      grid-area: unset !important;
      margin-top: -68px !important;
      width: 138px !important;
      height: auto !important;
      line-height: 15px !important;
      padding: 3px !important;
      text-align: center !important;
      white-space: pre-wrap !important;
      word-wrap: normal !important;
      overflow-wrap: normal !important;
      cursor: move !important;
      opacity: 1 !important;
  color: white !important;
  background: tomato !important;
  }

  /* ADDON PAGE / MY COLLECTIONS LIST  */
  .App-content {
      -moz-box-flex: 1;
      flex-grow: 1;
  }
  .App-content-wrapper {
      margin: 0 auto !important;
      max-width: 100% !important;
  }
  /* with BADGE */
  .Addon {
      max-height: 838px!important;
      padding: 0 10px 10px !important;
      overflow: hidden !important;
  }
  /* no BADGE */
  .Addon.Addon-extension {
      max-height: 838px!important;
      margin-top: 0px !important;
      padding: 0px 10px 10px !important;
      overflow: hidden !important;
  }

  /* ADDON INFOS PAGES */
  .Header.Header-no-hero-promo + .Page-content .Page.Page-not-homepage .Addon.Addon-extension.Addon--has-more-than-0-addons.Addon--has-more-than-3-addons {
      margin-top: -22px !important;
  }
  .Collection .Collection-wrapper .Collection-items .Card-contents {
      background: #1f2536 !important;
  }
  .Collection .Collection-wrapper .Collection-items .Card.CardList.AddonsCard.Card--photon.Card--no-header .Card-contents {
      height: 773px !important;
      padding-top: 30px !important;
  }


  /* COLLECTIONS-EDIT */
  .Collection .Collection-wrapper .Collection-items .Card.CollectionAddAddon.Card--no-header.Card--no-footer + .Card.CardList.AddonsCard.Card--photon.Card--no-header .Card-contents {
      height: 590px !important;
  }
  .Card.CollectionList-info.Card--no-footer,
  .Collection-wrapper .Collection-detail-wrapper {
      grid-column: 1 / auto !important;
  }
  .Collection-wrapper .Collection-items {
      grid-column: unset !important;
      max-width: 100% !important;
  }
  .Collection-wrapper,
  .CollectionList-wrapper {
      display: grid !important;
      grid-auto-flow: column dense !important;
      grid-gap: 0 24px !important;
      grid-template-columns: minmax(300px, 15%) 1fr !important;
      margin: 0;
  }
  .CollectionList-wrapper .CollectionList-list.CardList {
      margin: 0;
      background: transparent !important;
  }
  .CollectionList .Card-contents {
      font-size: 14px;
  background: #1f2536 !important;
  }
  .Collection .Collection-wrapper .Collection-detail-wrapper + .Collection-items .Card.CardList.AddonsCard.Card--photon.Card--no-header .Card-contents ul.AddonsCard-list,
  .CollectionList-listing {
      display: grid;
      grid-auto-flow: row;
      grid-template-columns: 20% 20% 20% 20% 20%;
      grid-row-gap: 2px !important;
      grid-column-gap: 0px !important;
  }

  /* for GM "Superloader Plus" */
  .Search .SearchResults li.SearchResult.SearchResult--theme,
  .Collection-items .AddonsCard-list li.SearchResult + .sp-separator,
  .EditableCollectionAddon.EditableCollectionAddon--extension + .sp-separator,
  .EditableCollectionAddon,
  .UserCollection {
      grid-column: auto / auto !important;
      height: 100px !important;
      margin-left: 2px !important;
      margin-bottom: 5px !important;
      border-radius: 9px !important;
      padding: 0 5px !important;
      text-align: center !important;
  background-color: #1f2536 !important;
  border: 1px solid red !important;
  }
  .UserCollection-name {
      margin-top: -2px !important;
  }
  /* .SearchResult--theme  */
  .Collection-items .AddonsCard-list li.SearchResult + .sp-separator,
  .EditableCollectionAddon.EditableCollectionAddon--extension + .sp-separator {
      grid-column: unset !important;
      display: inline-block !important;
      height: 89px !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin-top: 1px !important;
      margin-left: 0px !important;
      margin-bottom: 2px !important;
      border-radius: 9px !important;
  box-shadow: none;
  border: 1px solid red !important;
  }
  .Search .SearchResults li.SearchResult.SearchResult--theme,
  .Collection-items .AddonsCard-list li.SearchResult + .sp-separator {
      height: 142px !important;
      margin-top: -7px !important;
  }
  .Search .SearchResults li.SearchResult.SearchResult--theme,
  .Collection-items .AddonsCard-list li.SearchResult + .sp-separator a.sp-sp-nextlink,
  .EditableCollectionAddon.EditableCollectionAddon--extension + .sp-separator a.sp-sp-nextlink {
      display: inline-block !important;
      width: 100% !important;
      height: 20px !important;
      margin: 0 !important;
      margin-bottom: -10px !important;
      margin-left: 0px !important;
      padding: 0 !important;
  text-shadow: none !important;
  background: #0f1126 !important;
  }
  /* PB FOR CHROME ?? -  background-color: red !important; */
  .CollectionList-wrapper .UserCollection-link {
      padding: 1px 5px !important;
      border-radius: 0 9px 9px 0 !important;
  }
  /* ADDON REVIEW - USER NOTE - 
  https://addons.mozilla.org/en-US/firefox/collections/2061785/XPI-57-Alternative/edit/
  https://addons.mozilla.org/en-US/firefox/collections/2061785/XPI-57-A-Tester-Divers/?page=1&collection_sort=-added
  https://addons.mozilla.org/en-US/firefox/collections/2061785/XPI-57-A-Tester-Divers/edit/?page=1&collection_sort=-added
  === */
  .EditableCollectionAddon-details {
      grid-template-columns: 20px minmax(250px, auto) !important;
      height: 36px !important;
      margin-left: -3px !important;
  }
  .EditableCollectionAddon-buttons {
      grid-template-columns: min-content min-content;
      height: 40px !important;
      margin-left: -94px !important;
      margin-top: 44px !important;
      width: 195px !important;
  }
  li.SearchResult .SearchResult-note {
      position: relative !important;
      max-width: 25px !important;
      height: 20px !important;
      top: -147px !important;
      margin-left: -15px !important;
      margin-bottom: 0 !important;
      padding: 0px !important;
      overflow: hidden !important;
      z-index: 50000 !important;
  background: black;
  }
  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes,
  li.SearchResult .SearchResult-note:hover {
      position: relative !important;
      display: inline-block !important;
      width: 103% !important;
      min-width: 103% !important;
      max-width: 103% !important;
      height: 96px !important;
      top: -107px !important;
      margin-left: -4px !important;
      margin-bottom: 0 !important;
      padding: 0 7px 0 10px !important;
      z-index: 50000 !important;
      color: gold !important;
  background: black;
  }
  li.SearchResult .SearchResult-note:hover {
      height: 126px !important;
      top: -140px !important;
  color: gold !important;
  }
  li.SearchResult .SearchResult-note .SearchResult-note-header,
  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes h4.EditableCollectionAddon-notes-header {
      width: 17px !important;
      height: 18px !important;
      margin-bottom: 0 !important;
      margin-left: 3px !important;
      margin-top: 2px !important;
      font-size: 0 !important;
  }

  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes:hover h4.EditableCollectionAddon-notes-header,
  li.SearchResult .SearchResult-note:hover .SearchResult-note-header {
      width: 17px !important;
      height: 18px !important;
      margin-left: 0px !important;
      margin-bottom: -18px !important;
      font-size: 0 !important;
  }
  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes .EditableCollectionAddon-notes-content,
  .SearchResult-note-content {
      display: inline-block;
      max-width: 100% !important;
      min-width: 100% !important;
      height: 62px !important;
      padding-left: 10px !important;
      text-align: left !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  }
  /* ADD ICON AT EDIT REVIEW IN COLL - === */
  /* .EditableCollectionAddon-notes-content:before , */
  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes:before {
      content: " " !important;
      position: absolute !important;
      width: 25px !important;
      height: 20px !important;
      left: -3px !important;
      top: -8px !important;
      color: red !important;
      font-size: 15px !important;
      border-radius: 5px !important;
      background: rgba(0, 0, 0, 0) url("data:image/svg+xml;charset=utf-8,%3Csvg width=\\'16\\' height=\\'15\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'%230A84FF\\' fill-rule=\\'nonzero\\'%3E%3Cpath d=\\'M13.577,2.22044605e-16 L2.423,2.22044605e-16 C1.08549932,0.00165293785 0.00165293785,1.08549932 0,2.423 L0,8.577 C0.00165293785,9.91450068 1.08549932,10.9983471 2.423,11 L8.26,11 L11.226,14.633 C11.4936161,14.9601314 11.9379992,15.0836914 12.3360673,14.9416524 C12.7341355,14.7996134 12.9999216,14.4226503 13,14 L13,11 L13.577,11 C14.9145007,10.9983471 15.9983471,9.91450068 16,8.577 L16,2.423 C15.9983471,1.08549932 14.9145007,0.00165293785 13.577,2.22044605e-16 Z M14,8.577 C14,8.68918658 13.9554341,8.79677828 13.8761062,8.87610617 C13.7967783,8.95543406 13.6891866,9 13.577,9 L12,9 C11.4477153,9 11,9.44771525 11,10 L11,11.194 L9.509,9.367 C9.31888626,9.13449284 9.03433773,8.99974534 8.734,9 L2.423,9 C2.31081342,9 2.20322172,8.95543406 2.12389383,8.87610617 C2.04456594,8.79677828 2,8.68918658 2,8.577 L2,2.423 C2,2.18938355 2.18938355,2 2.423,2 L13.577,2 C13.8106164,2 14,2.18938355 14,2.423 L14,8.577 Z\\'/%3E%3Cpath d=\\'M11.5,4 L4.5,4 C4.22385763,4 4,4.22385763 4,4.5 C4,4.77614237 4.22385763,5 4.5,5 L11.5,5 C11.7761424,5 12,4.77614237 12,4.5 C12,4.22385763 11.7761424,4 11.5,4 Z M11.5,6 L4.5,6 C4.22385763,6 4,6.22385763 4,6.5 C4,6.77614237 4.22385763,7 4.5,7 L11.5,7 C11.7761424,7 12,6.77614237 12,6.5 C12,6.22385763 11.7761424,6 11.5,6 Z\\'/%3E%3C/g%3E%3C/svg%3E") no-repeat scroll 50% center / contain !important;
      background-color: gold !important;
      visibility: visible !important;
  }
  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes {
      visibility: hidden !important;
  }
  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes:hover {
      visibility: visible !important;
  }
  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes:hover h4.EditableCollectionAddon-notes-header .Icon.Icon-comments-blue {
      display: none !important;
  }
  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes {
      padding: 0 7px 0 0px !important;
      z-index: 50000 !important;
  color: gold !important;
  background: black !important;
  }
  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes .EditableCollectionAddon-notes-content {
      display: inline-block;
      max-width: 100% !important;
      min-width: 100% !important;
      height: 62px !important;
      padding: 5px 3px 0 17px !important;
      text-align: left !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  }
  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes .DismissibleTextForm-form.EditableCollectionAddon-notes-form,
  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes:hover .DismissibleTextForm-form.EditableCollectionAddon-notes-form {
      height: 97px !important;
      width: 100% !important;
      margin-top: 0px !important;
      margin-left: 2px !important;
      padding: 3px 3px 0 15px !important;
  background: black !important;
  }
  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes:not(:hover) .DismissibleTextForm-form.EditableCollectionAddon-notes-form,
  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes:hover .DismissibleTextForm-form.EditableCollectionAddon-notes-form {
      position: absolute !important;
      height: 97px !important;
      width: 100% !important;
      margin-top: -5px !important;
      top: 0 !important;
      left: -3px !important;
      visibility: visible !important;
  }
  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes:hover textarea.DismissibleTextForm-textarea,
  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes textarea.DismissibleTextForm-textarea {
      display: inline-block !important;
      height: 100% !important;
      max-height: 76px !important;
      min-height: 76px !important;
      resize: none;
      width: 100%;
      margin-left: 0 !important;
      padding: 2px !important;
  }
  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes textarea.DismissibleTextForm-textarea {
      margin-left: 0 !important;
      margin-top: 0px !important;
  }
  .Collection-wrapper li.EditableCollectionAddon .EditableCollectionAddon-notes:hover textarea.DismissibleTextForm-textarea {
      margin-top: -2px !important;
  }
  .EditableCollectionAddon-notes-form .DismissibleTextForm-buttons {
      height: 17px !important;
      margin-top: 0px !important;
  }
  .EditableCollectionAddon-notes-form .DismissibleTextForm-buttons .DismissibleTextForm-delete-submit-buttons .Button,
  .EditableCollectionAddon-notes-form .DismissibleTextForm-buttons .Button.Button--neutral.DismissibleTextForm-dismiss.Button--micro {
      font-size: 11px;
      height: auto;
      min-height: 16px !important;
  }

  /* PROFILE - REVIEW - USER / PROFILE USER/MY/DEV - REVIEWS PAGE - === */
  .UserReview-body > br {
      content: " " !important;
      float: none !important;
      display: block !important;
      line-height: 0px !important;
      margin-top: 5px !important;
      margin-bottom: -3px !important;
  }
  .EditableCollectionAddon-notes-header {
      margin: 0 0 6px;
      text-align: left !important;
  }
  .UserProfile-user-info,
  .AddonReviewList.AddonReviewList--extension .AddonSummaryCard {
      min-width: 195px;
      width: 10%;
  }
  .UserProfile .UserProfile-wrapper .Card.UserProfile-user-info .Card-header,
  .AddonReviewList.AddonReviewList--extension .Card.AddonSummaryCard .Card-header {
      display: inline-block !important;
      padding: 5px !important;
      text-align: center !important;
  }
  .AddonSummaryCard-header,
  .AddonSummaryCard-header-icon {
      display: inline-block !important;
  }
  .UserProfile-header {
      display: unset !important;
      grid-template-columns: unset !important;
  }
  .UserProfile-header .UserProfile-avatar,
  .AddonSummaryCard-header-icon {
      position: relative !important;
      display: inline-block !important;
      margin-right: 0px !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 64px !important;
      text-align: center !important;
  }
  .Icon.Icon-anonymous-user,
  .UserProfile-header .UserProfile-avatar {
      height: 190px !important;
  }
  .AddonSummaryCard-header-icon a {
      width: 100% !important;
      display: inline-block !important;
  }
  .AddonSummaryCard-header-icon-image {
      display: inline-block !important;
      height: 56px !important;
  }
  /* (new129) */
  .UserProfile-tags {
      display: inline-block !important;
      width: 100% !important;
      clear: none;
      text-align: center !important;
  /* border: 1px solid red !important; */
  }
  .UserProfile-tags p.UserProfile-developer,
  .UserProfile-tags p {
      display: inline-block !important;
      width: 100% !important;
      clear: none;
      padding-left: 35px !important;
      text-align: center !important;
      border-radius: 5px;
  background-color: #191f2d !important;
  border-color: #191f2d !important;
  /* border: 1px solid red !important; */
  }
  /* (new129) */
  .UserProfile-tags .Icon,
  .UserProfile-tags .Icon.Icon-developer {
      float: left;
      height: 28px;
      width: 28px;
      margin-top: -15px;
      margin-left: -30px !important;
      border-radius: 5px;
      box-shadow: 0 0 2px #cccccc inset;
      background-size: 76% auto;
  background-color: rgba(191, 191, 190, 0.33);
  background-image: url(https://addons.cdn.mozilla.net/static/img/addon-icons/default-64.png) !important;
  }
  .AddonSummaryCard-header-text {
      display: inline-block !important;
      min-width: 100% !important;
      clear: none;
      text-align: center !important;
  }
  .UserProfile-name {
      font-size: 18px !important;
  }

  .UserProfile-avatar {
      background-color: #1f2536;
  }
  .UserAvatar.UserProfile-avatar .Icon.Icon-anonymous-user {
      opacity: 0.7;
  }
  /* (new154) */
  .AddonReviewList {
      min-width: 100vw !important;
      max-width: 100vw !important;
    padding: 0 10px 10px;
  /*background: brown !important;*/
  }
  .UserProfile-addons-and-reviews,
  .AddonReviewList-reviews {
      min-width: 88% !important;
      max-width: 88% !important;
  }
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews > .Card-contents,
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing > .Card-contents {
      min-height: 195px !important;
      padding: 3px 5px 30px 5px !important;
  }
  /* (new165) */
  /*.UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews > .Card-contents .ShowMoreCard-contents,
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing > .Card-contents .ShowMoreCard-contents {
      min-height: 72px !important;
      max-height: 72px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  background: #1f2536 !important;
  }*/





  /* (new171) NOT PAGINATION ( FOOTER OF RATING / DESRIPTION) ) -  */
  .Addon.Addon-extension .Card-contents + footer.Card-footer {
     display: none !important;
  }

  /* (new171) PAGINATION - footer.Card-footer */
  .Card-contents + footer.Card-footer.undefined:has(.Paginate) {
      width: 100% !important;
      margin-top: 0px !important;
      padding:  0 20px !important;
  /*background: brown !important;*/
  }
  .UserProfile-addons-and-reviews .Card-contents + footer.Card-footer {
      margin-top: 0px !important;
  }
  .Search .SearchResults .Card.CardList.AddonsCard.Card--photon .Card-footer {
      margin-top: -10px !important;
      padding: 0px !important;
      width: 100%;
  }
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing .Card-footer {
      margin-top: 0px !important;
      padding: 0px !important;
      width: 100%;
  }
  .Collection .Collection-wrapper .Collection-items .CardList .Card-footer {
      margin-top: 0px !important;
      padding: 0px !important;
  }
  .Paginate,
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing .Card-footer .Paginate {
      position: relative !important;
      display: inline-block !important;
      width: 90% !important;
      top: 0px !important;
      padding: 2px !important;
  background-color: #191f2d;
  }

  .UserProfile-addons-and-reviews .AddonsByAuthorsCard--theme .Paginate {
      top: 0px !important;
      padding: 2px !important;
  background-color: #191f2d;
  }
  .Paginate-page-number {
      margin: -8px 0 0 !important;
  }


  /* (new167) DEV PROFILE - PROFILE DESCRIPTION */
  .UserProfile .UserProfile-wrapper .Card.UserProfile-user-info.Card--no-footer {
      width: 100% !important;
      height: 90.5vh !important;
      margin: 0 0 0 -1% !important;
      padding: 0 5px 0 5px !important;
      border-radius: 0 0 0 0 !important;
      overflow: hidden !important;
  border-right: 1px solid red !important;
  }
  .UserProfile .UserProfile-wrapper .Card-contents:has(dl.DefinitionList.UserProfile-dl) {
      width: 100% !important;
      height: 61.5vh !important;
      margin: 0;
      padding: 0 !important;
      border-radius: 0 0 0 0 !important;
      overflow: hidden !important;
  }
  .UserProfile .UserProfile-wrapper dl.DefinitionList.UserProfile-dl{
      width: 100% !important;
      height: 61vh !important;
      margin: 0;
      padding: 0 4px !important;
      overflow: hidden auto !important;
  background-color: #191f2d;
  }


  /* (new167) DEV PROFILE / REVIEWS - ADDONS LIST - ITEMS */


  /* (new167) USER PROFILE - ITEMS */
  .UserProfile .UserProfile-wrapper .AddonsByAuthorsCard .Card-contents ul > li,
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li,
  .AddonReviewList-reviews .CardList ul > li {
      position: relative;
      display: inline-block !important;
      width: 19% !important;
      height: 130px !important;
      margin-right: 7px !important;
      padding: 5px !important;
      overflow: hidden !important;
      border-radius: 5px !important;
      z-index: 0;
  border: 1px solid red !important;
  }








  /* PROFILE - AUTHOR - THEME */
  .UserProfile .UserProfile-addons-and-reviews section.Card.CardList.AddonsCard.AddonsByAuthorsCard.AddonsByAuthorsCard--theme .Card-contents ul.AddonsCard-list {
      display: unset !important;
      grid-auto-flow: unset !important;
      grid-gap: unset !important;
      grid-template-columns: unset !important;
  }
  .UserProfile .UserProfile-addons-and-reviews .CardList.AddonsByAuthorsCard .SearchResult.SearchResult--theme {
      display: inline-block !important;
      width: 24.2% !important;
      min-height: 185px !important;
      margin-right: 5px !important;
      padding: 5px !important;
      overflow: hidden !important;
      border-radius: 5px !important;
  border: 1px solid red !important;
  }
  .UserProfile .UserProfile-addons-and-reviews .CardList.AddonsByAuthorsCard .SearchResult.SearchResult--theme .SearchResult-result {
      grid-column-gap: unset !important;
      grid-template-columns: unset !important;
      -moz-box-direction: unset !important;
      -moz-box-orient: unset !important;
      flex-flow: unset !important;
      display: inline-block !important;
      height: 149px !important;
      margin: 0;
      padding: 0;
  }
  .UserProfile .UserProfile-addons-and-reviews .CardList.AddonsByAuthorsCard .SearchResult.SearchResult--theme .SearchResult-icon-wrapper {
      position: relative !important;
      display: inline-block !important;
      width: 100% !important;
      min-height: 72px !important;
      margin-top: 0 !important;
      margin-left: 0 !important;
      text-align: center;
  background: black !important;
  }
  .UserProfile .UserProfile-addons-and-reviews .CardList.AddonsByAuthorsCard .SearchResult.SearchResult--theme .SearchResult-icon-wrapper .SearchResult-icon {
      display: inline-block !important;
      height: 100%;
      min-height: 65px !important;
      width: 100%;
      margin-top: 5px;
  }
  .UserProfile .UserProfile-addons-and-reviews .CardList.AddonsByAuthorsCard .SearchResult.SearchResult--theme .SearchResult-contents {
      display: inline-block !important;
      width: 100% !important;
      height: 100%;
      max-height: 20px;
      min-height: 20px;
      margin: -25px 2px 0 5px !important;
      padding: 5px !important;
      border-radius: 9px !important;
      text-align: center;
      z-index: 100;
  }
  .UserProfile .UserProfile-addons-and-reviews .CardList.AddonsByAuthorsCard .SearchResult.SearchResult--theme .SearchResult-metadata {
      display: inline-block;
      height: 20px !important;
      line-height: 0px !important;
      margin-top: -50px !important;
  }

  /* NOT HOVER */
  .UserProfile-wrapper .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li > .AddonReviewCard > .AddonReviewCard-container,
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li > .AddonReviewCard > .AddonReviewCard-container,
  .AddonReviewList-reviews .CardList ul > li > .AddonReviewCard > .AddonReviewCard-container {
      display: inline-block !important;
      width: 100% !important;
      height: 118px !important;
      overflow: hidden !important;
      border-radius: 5px !important;
  }
  /* HOVER */
  .UserProfile-wrapper .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:hover > .AddonReviewCard > .AddonReviewCard-container,
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:hover > .AddonReviewCard > .AddonReviewCard-container,
  .AddonReviewList-reviews .CardList ul > li:hover > .AddonReviewCard > .AddonReviewCard-container {
      display: inline-block !important;
      width: 100% !important;
      height: 108px !important;
      overflow: hidden !important;
      border-radius: 5px !important;
  }
  .UserProfile-wrapper .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:hover > .AddonReviewCard > .AddonReviewCard-container .UserReview-body {
      height: 74px !important;
  border-top: 1px solid red !important;
  border-bottom: 1px solid red !important;
  }

  .AddonReviewList.AddonReviewList--extension .Card-contents > ul > li:hover .AddonReviewCard .AddonReviewCard-container .UserReview .AddonReviewCard-allControls,

  .UserProfile-wrapper .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:hover > .AddonReviewCard > .AddonReviewCard-container + .AddonReviewCard-reply .AddonReviewCard-allControls .AddonReviewCard-control,

  .UserProfile-wrapper .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:hover > .AddonReviewCard > .AddonReviewCard-container .AddonReviewCard-allControls,
  .UserProfile-wrapper .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:hover > .AddonReviewCard > .AddonReviewCard-container .AddonReviewCard-allControls .Button--neutral {
      height: 13px !important;
      line-height: 8px !important;
      font-size: 8px !important;
  background: #111 !important;
  }
  /* new241) */
  .Card-contents ul > li .AddonReviewCard-allControls .AddonReviewCard-edit.AddonReviewCard-control,
  .Card-contents ul > li .AddonReviewCard-allControls button.AddonReviewCard-control.TooltipMenu-opener {
      height: 15px !important;
      line-height: 13px !important;
      margin-top: -1px !important;
      font-size: 10px;
      text-decoration: none !important;
  }
  .Card-contents ul > li:hover .AddonReviewCard-allControls .AddonReviewCard-edit.AddonReviewCard-control {
      height: 12px !important;
      line-height: 10px !important;
      margin: 1px 0 0 5px !important;
      font-size: 10px;
      text-decoration: none !important;
  /* border: 1px solid aqua !important; */
  }
  .Card-contents ul > li:hover .AddonReviewCard-allControls button.AddonReviewCard-control.TooltipMenu-opener {
      height: 15px !important;
      line-height: 12px !important;
      margin: -4px 0 0 0 !important;
      font-size: 10px !important;
  }
  /* old MY REVIEW INDICATOR - === */
  .AddonReviewList-reviews .CardList ul > li:not(:hover) .AddonReviewCard.AddonReviewCard-viewOnly .Button.Button--neutral.AddonReviewCard-control.AddonReviewCard-delete {
      position: absolute !important;
      display: inline-block !important;
      margin-top: -112px !important;
      width: 15.3%;
      height: 32px !important;
      line-height: 32px !important;
      margin-right: 0px !important;
      font-size: 0px !important;
      z-index: 0 !important;
  background: rgba(255, 0, 0, 0.2) !important;
  }
  /* (new141) old ADDON REVIEW - DELLETE BUTTON */
  .AddonReviewList-reviews .CardList ul > li:not(:hover) .AddonReviewCard.AddonReviewCard-viewOnly .Button.Button--neutral.AddonReviewCard-control.AddonReviewCard-delete {
      width: auto !important;
      height: 14px !important;
      line-height: 10px !important;
      margin: 1px 0 0 50% !important;
      padding: 0 5px !important;
      font-size: 10px !important;
  color: white !important;
  /* background: red !important; */
  border: 1px solid gold !important;
  }
  /* HOVER */
  .AddonReviewList-reviews .CardList ul > li:hover .AddonReviewCard.AddonReviewCard-viewOnly .Button.Button--neutral.AddonReviewCard-control.AddonReviewCard-delete {
      height: 12px !important;
      line-height: 11px !important;
      margin: -13px 0 0 50% !important;
      padding: 0 5px !important;
      font-size: 9px !important;
  border: 1px solid red !important;
  }

  /* NOT HOVER */
  .UserReview-reply-header .Icon-reply-arrow {
      height: 15px !important;
      width: 13px !important;
  /*background-image: url("/static-frontend/875222b9eff6163619e63fbe65fb3f46.svg")!important; */
  background-position: center 0px !important;
  /* background-color: black !important; */
  }

  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:hover > .AddonReviewCard > .AddonReviewCard-container + .AddonReviewCard-reply:not(:hover),
  .AddonReviewList-reviews .CardList ul > li:hover > .AddonReviewCard > .AddonReviewCard-container + .AddonReviewCard-reply:not(:hover) {
      display: inline-block !important;
      min-width: 17px !important;
      max-width: 17px !important;
      min-height: 17px !important;
      max-height: 17px !important;
      padding: 0 2px !important;
      border-radius: 9px !important;
      overflow: hidden !important;
  }
  /* (new130) old DEV REPLY - HOVER */
  .AddonReviewList-reviews .Card-contents ul > li:hover .AddonReviewCard.AddonReviewCard-viewOnly .AddonReviewCard-reply {
      min-width: 10px !important;
      max-width: 10px !important;
      top: 8px !important;
      padding: 0 !important;
  /*background-color: green !important; */
  }
  .AddonReviewList-reviews .Card-contents ul > li:hover .AddonReviewCard.AddonReviewCard-isReply .UserReview-byLine {
      background: transparent !important;
  }

  .UserProfile-wrapper .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:hover > .AddonReviewCard .AddonReviewCard-reply .Icon-reply-arrow,
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:hover > .AddonReviewCard .AddonReviewCard-reply .Icon-reply-arrow,
  .AddonReviewList-reviews .CardList ul > li:hover > .AddonReviewCard > .AddonReviewCard-container + .AddonReviewCard-reply .Icon-reply-arrow {
      background-position: center -1px !important;
      height: 13px !important;
      width: 12px !important;
      background-color: transparent !important;
  }


  .UserProfile-wrapper .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:hover > .AddonReviewCard .AddonReviewCard-reply,
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:hover > .AddonReviewCard .AddonReviewCard-reply,
  .AddonReviewList-reviews .CardList ul > li:hover > .AddonReviewCard > .AddonReviewCard-container + .AddonReviewCard-reply {
      display: inline-block !important;
      min-width: 100% !important;
      min-height: 110px !important;
      max-height: 110px !important;
      overflow: hidden !important;
      border-radius: 5px !important;
      transform: translate(-302px, -13px) scale(1)!important;
  }
  .UserProfile-wrapper .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li > .AddonReviewCard .AddonReviewCard-reply:hover,
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li > .AddonReviewCard .AddonReviewCard-reply:hover,
  .AddonReviewList-reviews .CardList ul > li > .AddonReviewCard > .AddonReviewCard-container + .AddonReviewCard-reply:hover {
      transform: translate(-302px, -18px) scale(1)!important;
  }
  /* (new148) */
  .AddonReviewCard:not(.AddonReviewCard-slim) .UserReview-body,
  .FeaturedAddonReview .AddonReviewCard.AddonReviewCard-viewOnly .UserReview-body {
      height: auto !important;
      line-height: 12px !important;
      margin: 0px 0 1px 0 !important;
      font-size: 11px !important;
      overflow: hidden !important;
  border-top: 1px solid red !important;
  border-bottom: 1px solid red !important;
  }
  .AddonReviewCard.AddonReviewCard-ratingOnly.AddonReviewCard-viewOnly .UserReview-body {
      height: auto !important;
      line-height: 12px !important;
      margin: -3px 0 1px 0 !important;
      font-size: 11px !important;
      overflow: hidden !important;
  }
  /* (new122) TOP REVIEW for LONG REVIEW (by DATE)*/
  .FeaturedAddonReview .AddonReviewCard.AddonReviewCard-viewOnly .UserReview-body {
      line-height: 18px !important;
  }

  /* (new155) REVIEW USER - TOP BIG - USER REVIEW - LEFT */
  .AddonReviewList-reviews > .FeaturedAddonReview .Card.FeaturedAddonReview-card.Card--no-footer header.Card-header + .Card-contents > .AddonReviewCard.AddonReviewCard-viewOnly > .AddonReviewCard-container {
      float: left !important;
      width: 49% !important;
      margin: 0px 2% 0px 0 !important;
      padding: 10px 20px 10px 10px  !important;
      border-radius: 5px !important;
  border: 1px solid silver !important;
  }

  /* (new155) REVIEW USER - TOP BIG - DEV REPLY - RIGHT */
  .AddonReviewList-reviews > .FeaturedAddonReview .Card.FeaturedAddonReview-card.Card--no-footer header.Card-header + .Card-contents > .AddonReviewCard.AddonReviewCard-viewOnly > .AddonReviewCard-container .UserReview-byLine > span.AddonReviewCard-authorByLine {
      position: relative !important;
      display: inline-block !important;
      max-width: 82% !important;
      min-width: 82% !important;
      height: 24px !important;
      line-height: 17px !important;
      top: 0px !important;
      left: 139px !important;
      font-size: 15px !important;
  /*border: 1px solid yellow !important;*/
  }
  .AddonReviewList-reviews > .FeaturedAddonReview .Card.FeaturedAddonReview-card.Card--no-footer header.Card-header + .Card-contents > .AddonReviewCard.AddonReviewCard-viewOnly > .AddonReviewCard-reply .AddonReviewCard.AddonReviewCard-isReply.AddonReviewCard-viewOnly .Card.ShowMoreCard.UserReview-body {
      height: 100% !important;
      max-height: 19vh !important;
      line-height: 15px !important;
      margin-bottom: -5px !important;
      padding: 5px 10px 20px 10px !important;
      font-size: 15px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  /*border: 1px dashed aqua !important;*/
  }

  /* (new140) REPLY TOP BIG - RATING */
  .AddonReviewList-reviews > .FeaturedAddonReview .Card.FeaturedAddonReview-card.Card--no-footer header.Card-header + .Card-contents > .AddonReviewCard.AddonReviewCard-viewOnly > .AddonReviewCard-container .UserReview-byLine .Rating.Rating--small {
      position: absolute !important;
      min-width: 7% !important;
      max-width: 7% !important;
      height: 23px !important;
      line-height: 23px !important;
      vertical-align: middle !important;
      padding: 2px 10px !important;
      border-radius: 5px !important;
      text-align: center !important;
      opacity: 0.8 !important;
  background-color: #191f2d !important;
  /*border: 1px solid green !important;*/
  }



  /* (new155) REVIEW REPLY TOP BIG */
  .AddonReviewList-reviews > .FeaturedAddonReview .Card.FeaturedAddonReview-card.Card--no-footer header.Card-header + .Card-contents > .AddonReviewCard.AddonReviewCard-viewOnly > .AddonReviewCard-reply:not(:hover) {
      float: right !important;
      min-width: 40% !important;
      max-width: 40% !important;
      min-height: 23vh !important;
      max-height: 23vh !important;
      margin: 0.2vh 0 0 0px !important;
      padding: 3px !important;
      border-radius: 5px !important;
      font-size: 15px !important;
      opacity: 1 !important;
      visibility: visible !important;
      transform: translate(40px, -5px) scale(1.01) !important;
  background: #671515 !important;
  border: 1px solid gray !important;
  }
  .AddonReviewList-reviews > .FeaturedAddonReview .Card.FeaturedAddonReview-card.Card--no-footer header.Card-header + .Card-contents > .AddonReviewCard.AddonReviewCard-viewOnly > .AddonReviewCard-reply:hover {
      display: block !important;
      float: right !important;
      min-width: 47.5% !important;
      max-width: 47.5% !important;
      min-height: 23vh !important;
      max-height: 23vh !important;
      margin: -0.2vh 0 0 20px !important;
      padding: 3px !important;
      font-size: 15px !important;
      opacity: 1 !important;
      visibility: visible !important;
      transform: scale(1) !important;
  background: #671515 !important;
  border: 1px solid gray !important;
  }
  .AddonReviewList-reviews > .FeaturedAddonReview .Card.FeaturedAddonReview-card.Card--no-footer header.Card-header + .Card-contents > .AddonReviewCard.AddonReviewCard-viewOnly > .AddonReviewCard-reply .UserReview-byLine h4.UserReview-reply-header {
      display: block !important;
      float: left !important;
      height: 2vh !important;
      line-height: 1.8vh !important;
      margin: -2px 0 0 150px !important;
      padding: 0 5px  !important;
      border-radius: 5px !important;
  border: 1px solid silver !important;
  }
  .AddonReviewList-reviews > .FeaturedAddonReview .Card.FeaturedAddonReview-card.Card--no-footer header.Card-header + .Card-contents > .AddonReviewCard.AddonReviewCard-viewOnly > .AddonReviewCard-reply .UserReview-byLine h4.UserReview-reply-header span.Icon.Icon-reply-arrow {
      display: block !important;
      float: left !important;
      height: 1.8vh !important;
      line-height: 2vh !important;
      width: 25px !important;
      margin: 0 10px 0 -5px !important;
      object-fit: contain !important;
  /*border: 1px solid green !important;*/
  }
  .AddonReviewList-reviews > .FeaturedAddonReview .Card.FeaturedAddonReview-card.Card--no-footer header.Card-header + .Card-contents > .AddonReviewCard.AddonReviewCard-viewOnly > .AddonReviewCard-reply .UserReview-byLine h4.UserReview-reply-header span {
      display: block !important;
      float: left !important;
      height: 2vh !important;
      line-height: 2vh !important;
      margin: 0 0 0 0 !important;
  /*border: 1px solid yellow !important;*/
  }
  /* (new122) BOTH - TEST INNER */
  .AddonReviewList-reviews > .FeaturedAddonReview .Card.FeaturedAddonReview-card.Card--no-footer header.Card-header + .Card-contents > .AddonReviewCard.AddonReviewCard-viewOnly > .AddonReviewCard-container .UserReview-body .Card-contents .ShowMoreCard-contents,
  .AddonReviewList-reviews > .FeaturedAddonReview .Card.FeaturedAddonReview-card.Card--no-footer header.Card-header + .Card-contents > .AddonReviewCard.AddonReviewCard-viewOnly > .AddonReviewCard-reply .ShowMoreCard-contents {
      height: 15vh!important;
      line-height: 15px !important;
      margin-bottom: 1px !important;
      padding: 5px 10px 0px 10px !important;
      font-size: 15px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  /*border: 1px solid pink !important;*/
  }

  /* (new1155) A VOIR  - ALL REVIEWS ITEMS - SMALL */
  .AddonReviewCard:not(.AddonReviewCard-slim) .UserReview-body .Card-contents {
      height: auto !important;
      padding: 3px 2px !important;
  }
  .AddonReviewCard:not(.AddonReviewCard-slim) .UserReview-body .Card-contents .ShowMoreCard-contents {
      padding: 3px 2px !important;
      /*border: 1px solid peru !important;*/
  }
  /* PROFILE AND REVIEWS */
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:hover > .AddonReviewCard > .AddonReviewCard-container + .AddonReviewCard-reply:hover .UserReview-body {
      height: 58px !important;
      line-height: 13px !important;
      margin-bottom: 1px !important;
      font-size: 11px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  border-top: 1px solid red !important;
  border-bottom: 1px solid red !important;
  }
  .AddonReviewList-reviews .CardList ul > li:hover > .AddonReviewCard > .AddonReviewCard-container .UserReview-body {
      height: 70px !important;
      line-height: 13px !important;
      margin-bottom: 1px !important;
      font-size: 11px !important;
      overflow: hidden !important;
  border-top: 1px solid red !important;
  border-bottom: 1px solid red !important;
  }
  .AddonReviewList-reviews .CardList ul > li:hover > .AddonReviewCard > .AddonReviewCard-container .UserReview-body .Card-contents {
      height: 68px !important;
      padding: 0px !important;
      overflow: hidden !important;
  }
  .AddonReviewList-reviews .CardList ul > li:hover > .AddonReviewCard > .AddonReviewCard-container .UserReview-body .Card-contents .ShowMoreCard-contents > div {
      padding-bottom: 20px !important;
  }
  .AddonReviewList-filterByScore .Select.AddonReviewList-filterByScoreSelector {
      -moz-appearance: none !important;
  color: #c1d0ff;
  background-color: #191f2d !important;
  border-color: #191f2d;
  }
  .Select.AddonReviewList-filterByScoreSelector > option {
      -moz-appearance: none !important;
      display: block !important;
      line-height: 1.2;
      overflow: hidden;
      padding-bottom: 2px;
      padding-top: 2px;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-radius: 5px !important;
  color: #c1d0ff !important;
  background-color: #191f2d !important;
  border-color: #191f2d !important;
  }
  /* new155) */
  .AddonReviewCard .Rating.Rating--small {
      position: absolute !important;
      min-width: 40% !important;
      max-width: 40% !important;
      height: 23px !important;
      line-height: 23px !important;
      vertical-align: middle !important;
      padding: 2px 10px !important;
      border-radius: 5px !important;
      text-align: center !important;
      opacity: 0.8 !important;
  background-color: #191f2d !important;
  /*border: 1px solid aqua  !important;*/
  }
  /* (new165) REVIEW on HOVER */
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:hover,
  .AddonReviewList-reviews .CardList ul > li:hover {
      display: inline-block !important;
      width: 19% !important;
      height: 120px !important;
      margin-right: 7px !important;
      padding: 5px !important;
      overflow: hidden !important;
      border-radius: 5px !important;
      transform: scale(1.5) !important;
      z-index: 5000000 !important;
  background-color: #191f2d !important;
  /*border: 1px solid yellow !important;*/
  }
  .AddonReviewList-reviews .CardList ul > li:hover .ShowMoreCard-contents {
      position: relative;
      height: 120px !important;
      line-height: 10px !important;
      font-size: 10px !important;
      border-radius: unset !important;
      overflow-wrap: break-word;
      overflow: hidden auto !important;
  background: #172442 !important;
  }
  .AddonReviewList-reviews .CardList ul > li:hover div {
      border-radius: unset !important;
  }
  .ShowMoreCard-contents > div > br {
      display: block !important;
      margin-bottom: 1px !important;
  }

  /* REVIEW - TOP ROW */
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(n + 1):nth-child(-n + 5):hover,
  .AddonReviewList-reviews .CardList ul > li:nth-child(n + 1):nth-child(-n + 5):hover {
      transform: translate(-26px, 20px) scale(1.5) !important;
  }
  /* REVIEW - TOP ROW - RIGHT + LEFT */
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews.Card--photon .Card-contents ul > li:nth-child(1):hover {
      transform: translate(65px, 20px) scale(1.5) !important;
  }
  /* REVIEW - BOTTOM ROW */
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(n + 21):nth-child(-n + 25):hover,
  .AddonReviewList-reviews .CardList ul > li:nth-child(n + 21):nth-child(-n + 25):hover {
      transform: translate(0px, -30px) scale(1.5) !important;
  }
  /* REVIEW - BOTTOM ROW - RIGHT + LEFT */
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews.Card--photon .Card-contents ul > li:nth-child(21):hover {
      transform: translate(65px, -30px) scale(1.5) !important;
  }
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews.Card--photon .Card-contents ul > li:nth-child(25):hover {
      transform: translate(-26px, -30px) scale(1.5) !important;
  }
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(1):only-of-type:hover,
  .AddonReviewList-reviews .CardList ul > li:nth-child(1):only-of-type:hover,
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(1):hover,
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing ul > li:nth-child(1):hover {
      transform: translate(65px, 30px) scale(1.5) !important;
  }
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(21):hover,
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(16):hover,
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing ul > li:nth-child(16):hover,
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(11):hover,
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing ul > li:nth-child(11):hover,
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(6):hover,
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing ul > li:nth-child(6):hover {
      transform: translate(65px, 0px) scale(1.5) !important;
  }
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(21):hover,
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing ul > li:nth-child(21):hover {
      transform: translate(65px, -30px) scale(1.5) !important;
  }

  /* REVIEW - LEFT (+ GM superloader)*/
  .CardList.AddonReviewList-reviews-listing .sp-separator + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li:hover,
  .CardList.AddonReviewList-reviews-listing .sp-separator + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li:hover,
  .CardList.AddonReviewList-reviews-listing .sp-separator + li + li + li + li + li + li + li + li + li + li + li + li + li + li:hover,
  .CardList.AddonReviewList-reviews-listing .sp-separator + li + li + li + li + li + li + li + li + li + li + li:hover,
  .CardList.AddonReviewList-reviews-listing .sp-separator + li + li + li + li + li + li:hover,
  .CardList.AddonReviewList-reviews-listing .sp-separator + li:hover,

  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(1):hover,
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing ul > li:nth-child(1):hover {
      transform: translate(77px, 20px) scale(1.5) !important;
  }
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(21):hover,
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(16):hover,
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing ul > li:nth-child(16):hover,
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(11):hover,
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing ul > li:nth-child(11):hover,
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(6):hover,
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing ul > li:nth-child(6):hover {
      transform: translate(77px, 0px) scale(1.5) !important;
  }
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(21):hover,
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing ul > li:nth-child(21):hover {
      transform: translate(77px, -30px) scale(1.5) !important;
  }


  /* REVIEW - RIGHT (+ GM "Superloader")   */
  .CardList.AddonReviewList-reviews-listing .sp-separator + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li:hover,
  .CardList.AddonReviewList-reviews-listing .sp-separator + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li:hover,
  .CardList.AddonReviewList-reviews-listing .sp-separator + li + li + li + li + li + li + li + li + li + li + li + li + li + li + li:hover,
  .CardList.AddonReviewList-reviews-listing .sp-separator + li + li + li + li + li + li + li + li + li + li:hover,
  .CardList.AddonReviewList-reviews-listing .sp-separator + li + li + li + li + li:hover,

  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(25):hover,
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(20):hover,
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing ul > li:nth-child(20):hover,
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(15):hover,
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing ul > li:nth-child(15):hover,
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(10):hover,
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing ul > li:nth-child(10):hover {
      transform: translate(-26px, 0px) scale(1.5) !important;
  }
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:nth-child(25):hover,
  .AddonReviewList-reviews .CardList.AddonReviewList-reviews-listing ul > li:nth-child(25):hover {
      transform: translate(-26px, -30px) scale(1.5) !important;
  }
  /* (new140) REVIEW - ALL === */
  .AddonReviewCard .UserReview-byLine {
      /*   display: inline-block !important;  */
      height: 20px !important;
      line-height: 20px !important;
      /* background: blue !important; */
  }

  /* (new155) SMALL REPLY LIST - AUTHOR / DATE REPLY TO CLICK - CONTAINER  */
  .AddonReviewList-reviews .CardList ul > li .AddonReviewCard-authorByLine {
      position: absolute !important;
      display: inline-block !important;
      min-width: 77% !important;
      max-width: 77% !important;
      height: 2.7vh !important;
      line-height: 3.4vh !important;
      vertical-align: middle !important;
      margin: 0px 0px 0px 0px !important;
      right: 5px !important;
      padding: 3px 0px !important;
      border-radius: 3px !important;
      text-align: right !important;
      font-size: 0 !important;
      opacity: 0.8 !important;
  background-color: #191f2d !important;
  /*border: 1px dashed violet  !important;*/
  }
  .AddonReviewList-reviews .CardList ul > li .AddonReviewCard-authorByLine a[href*="/user/"]:not([title]) {
      position: absolute !important;
      display: inline-block !important;
      min-width: 60% !important;
      max-width: 60% !important;
      height: 2.7vh !important;
      line-height: 3.4vh !important;
      vertical-align: middle !important;
      top: -1.2vh !important;
      margin: 0vh 0px 0px 0px !important;
      right: 20px !important;
      padding: 0px 0px !important;
      border-radius: 3px !important;
      text-align: right !important;
      font-size: 10px !important;
      opacity: 0.8 !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
  background-color: #191f2d !important;
  /*border: 1px dashed violet  !important;*/
  }
  .AddonReviewList-reviews .CardList ul > li .AddonReviewCard-authorByLine a[title]:not([href*="/user/"]) {
      position: absolute !important;
      display: inline-block !important;
      min-width: 57% !important;
      max-width: 57% !important;
      height: 1.7vh !important;
      line-height: 1.5vh !important;
      vertical-align: middle !important;
      margin: 0vh 0px 0px 0px !important;
      top: 1vh !important;
      right: 0px !important;
      padding: 0px 0px !important;
      border-radius: 3px !important;
      text-align: right !important;
      font-size: 10px !important;
      opacity: 0.8 !important;
  background-color: #191f2d !important;
  /*border: 1px dashed violet  !important;*/
  }
  .AddonReviewList-reviews .CardList ul > li:hover .AddonReviewCard-authorByLine {
      min-width: 77% !important;
      max-width: 77% !important;
      min-height: 3vh  !important;
      max-height: 3vh  !important;
      line-height: 9px !important;
      margin: 0px 0 0 0 !important;
      padding: 0 0 3px 0 !important;
      font-size: 8px !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap !important;
  /*background: brown !important;*/
  }
  /* (new155) SMALL REPLY LIST - AUTHOR / DATE REPLY TO CLICK - EACH  */
  .AddonReviewList-reviews .CardList ul > li:not(:hover) .AddonReviewCard-authorByLine a {
      position: relative !important;
      float: left !important;
      width: 100% !important;
      height: 13px!important;
      line-height: 14px !important;
      margin: 0px 0 0 0 !important;
      top: -3.8vh !important;
      padding: 0 10px 0 0 !important;
      text-align: right !important;
  /*background: green !important;*/
  }
  /* (new155) HOVER */
  .AddonReviewList-reviews .CardList ul > li:hover .AddonReviewCard-authorByLine {
      float: left !important;
      width: 100% !important;
      height: 1vh !important;
      line-height: 12px !important;
      margin: 0px !important;
      padding: 0px !important;
      text-align: right !important;
      font-size: 0px !important;
  /*background: gold !important;*/
  }

  .AddonReviewList-reviews .CardList ul > li:hover .AddonReviewCard-authorByLine a {
      float: left !important;
      width: 100% !important;
      height: 1vh !important;
      line-height: 9px !important;
      margin: 0px !important;
      padding: 0 10px 0 0 !important;
      text-align: right !important;
      font-size: 9px !important;
  /*background: blue !important;*/
  }

  /* (new155) AUTHOR REVIEW - INDICATOR */

  /* (new155) SHOW BIG TOP on click AUTHOR REVIEW - INDICATOR   ok */
  .AddonReviewList-reviews .CardList ul > li:not(:hover) .AddonReviewCard-authorByLine a[title]:before {
      content: "▲" !important;
      float: left !important;
      width: 15px !important;
      height: 15px!important;
      line-height: 15px !important;
      text-align: center !important;
  }
  .AddonReviewList-reviews .CardList ul > li:not(:hover) .AddonReviewCard-authorByLine a[title]:after {
      content: "💬" !important;
      float: right !important;
      width: 15px !important;
      height: 15px!important;
      line-height: 15px !important;
      margin: 0 0 0 10px !important;
      text-align: center !important;
  }

  /* HOVER */
  .AddonReviewList-reviews .CardList ul > li:hover .AddonReviewCard-authorByLine a[title]:before {
      content: "▼" !important;
      float: left !important;
      width: 15px !important;
      height: 1vh !important;
      line-height: 9px !important;
      text-align: center !important;
      margin: 0 0 0 0 !important;
      transition: all ease 0.9s;
  }
  .AddonReviewList-reviews .CardList ul > li:hover .AddonReviewCard-authorByLine a[title]:after {
      content: "💬" !important;
      float: right !important;
      width: 15px !important;
      height: 1vh !important;
      line-height: 9px !important;
      margin: 0 0 0 10px !important;
      font-size: 10px !important;
      transition: all ease 0.5s;
  }

  /* (new155) SMALL LIST - REVIEW - DEV REPLY */
  /* NOT HOVER */
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li .AddonReviewCard-reply:not(:hover),
  .AddonReviewCard-reply:not(:hover) {
      position: absolute !important;
      display: inline-block !important;
      max-width: 28px !important;
      min-height: 2.5vh !important;
      max-height: 2.5vh !important;
      margin: 0 0 0 -15px!important;
      padding: 0px 3px 0 0  !important;
      font-size: 0px !important;
      border-radius: 0 !important;
      overflow: hidden !important;
      transform: translate(-300px, -10px) scale(0.7) !important;
  /*background: red !important;*/
  /*border: 1px solid green !important;*/
  }
  .AddonReviewList-reviews .CardList ul > li:hover > .AddonReviewCard > .AddonReviewCard-container + .AddonReviewCard-reply .UserReview span:not(.Icon.Icon-reply-arrow):not(:hover){
      position: absolute !important;
      display: inline-block !important;
      min-width: 128px !important;
      max-width: 128px !important;
      min-height: 1.5vh !important;
      max-height: 1.5vh !important;
      line-height: 1vh !important;
      margin: 0 0 0 170px!important;
      padding: 0px 0px 0 0  !important;
      font-size: 8px !important;
      border-radius: 0 !important;
      overflow: hidden !important;
  /*background: red !important;*/
  /*border: 1px solid green !important;*/
  }
  .AddonReviewList-reviews .CardList ul > li:not(:hover) > .AddonReviewCard > .AddonReviewCard-container + .AddonReviewCard-reply .UserReview span:not(.Icon.Icon-reply-arrow){
      display: none !important;
  }
  .AddonReviewList-reviews .CardList ul > li:not(:hover) > .AddonReviewCard > .AddonReviewCard-container + .AddonReviewCard-reply .Icon.Icon-reply-arrow {
      display: inline-block !important;
      width: 24px !important;
      min-height: 2.5vh !important;
      max-height: 2.5vh !important;
      margin: 0 0 0 0px!important;
      padding: 0 !important;
      border-radius: 0 !important;
      overflow: hidden !important;
  background-color: black!important;
  /*border: 1px solid green !important;*/
  }

  .AddonReviewList-reviews .CardList ul > li:hover .AddonReviewCard-reply,
  .AddonReviewList-reviews .CardList ul > li:not(:hover).AddonReviewCard-reply {
      position: absolute !important;
      display: inline-block !important;
      width: 16% !important;
      height: auto !important;
      margin-top: 5px !important;
      margin-left: 0 !important;
      padding: 4px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      transform: translate(-299px, -12px) scale(1)!important;
  background: black !important;
  border: none !important;
  }

  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:hover .AddonReviewCard-reply:not(:hover),
  .AddonReviewList-reviews .CardList ul > li:hover .AddonReviewCard-reply:not(:hover) {
      position: absolute !important;
      display: inline-block !important;
      width: 20px !important;
      height: 20px !important;
      margin: 0.5vh 0 0 -5px !important;
      padding: 4px !important;
      overflow: hidden !important;
      overflow-y: hidden !important;
  border: 1px solid red !important;
  background: black !important;
  }

  /* HOVER */
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:hover .AddonReviewCard-reply:hover,
  .AddonReviewList-reviews .CardList ul > li:hover .AddonReviewCard-reply:hover {
      position: absolute !important;
      display: inline-block !important;
      width: 100% !important;
      height: 100% !important;
      min-height: 14vh !important;
      max-height: 14vh !important;
      margin: 1.2vh 0 0 -6px !important;
      padding: 0px 0 0 0 !important;
      border-radius: 9px 9px 0 0 !important;
      overflow: hidden !important;
  background: brown !important;
  /*border: 1px solid aqua !important;*/
  }
  .UserProfile-addons-and-reviews .Card.CardList.UserProfile-reviews .Card-contents ul > li:hover .AddonReviewCard-reply:hover .UserReview-body,
  .AddonReviewList-reviews .CardList ul > li:hover .AddonReviewCard-reply:hover .UserReview-body {
      height: 43px !important;
      line-height: 13px;
      margin-bottom: -2px;
      margin-top: -2px;
  }
  .AddonReviewList-reviews .CardList ul > li:hover .AddonReviewCard-reply:hover .UserReview-byLine {
      height: 15px !important;
      line-height: 14px !important;
      font-size: 8px !important;
  }
  .AddonReviewList-reviews .CardList ul > li:hover .AddonReviewCard-reply:hover .UserReview-body {
      height: 80px !important;
      line-height: 13px;
      margin: -2px 0 -2px 0 !important;
      overflow: hidden !important;
  border-top: 1px solid red !important;
  }
  .AddonReviewList-reviews .CardList ul > li:hover .AddonReviewCard-reply:hover .UserReview-body .Card-contents {
      height: 75px !important;
      padding: 0px !important;
      border-radius: 0 0 3px 3px !important;
  }
  .AddonReviewList-reviews .CardList ul > li:hover .AddonReviewCard-reply:hover .UserReview-body .Card-contents .ShowMoreCard-contents {
      max-height: 75px !important;
      min-height: 75px !important;
      width: 296px !important;
      border-radius: 0 !important;
      overflow: hidden auto !important;
  }
  .AddonReviewList-reviews .CardList ul > li:hover .AddonReviewCard-reply:hover .AddonReviewCard-allControls button.TooltipMenu-opener.AddonReviewCard-control {
      margin: 2px 0 0 0 !important;
      font-size: 8px !important;
      text-decoration: none !important;
  }
  .UserReview-reply-header {
      margin-bottom: -3px !important;
      margin-top: 0;
  }
  .AddonReviewCard:not(.AddonReviewCard-slim).AddonReviewCard-isReply .UserReview-body {
      height: 63px !important;
      line-height: 13px !important;
      margin: -2px 0 -2px 0 !important;
  }
  .Card.CardList.AddonReviewList-reviews-listing ul > li:not(:hover) .AddonReviewCard .AddonReviewCard-container .AddonReviewManager .DismissibleTextForm-textarea {
      display: inline-block !important;
      width: 100% !important;
      max-height: 60px !important;
      min-height: 50px !important;
      margin: -10px 0 0 0 !important;
      padding: 2px !important;
      resize: none;
  }
  .Card.CardList.AddonReviewList-reviews-listing ul > li:hover .AddonReviewCard .AddonReviewCard-container .AddonReviewManager .DismissibleTextForm-textarea {
      display: inline-block !important;
      width: 100% !important;
      max-height: 60px !important;
      min-height: 60px !important;
      margin: -10px 0 0 0 !important;
      resize: none;
      padding: 2px !important;
      font-size: 9px !important;
  }
  .AddonReviewManager .DismissibleTextForm-formFooter {
      font-size: 8px !important;
      margin-bottom: -12px !important;
  }
  .Card.CardList.AddonReviewList-reviews-listing ul > li:hover .AddonReviewCard .AddonReviewCard-container .AddonReviewManager .AddonReviewManager .DismissibleTextForm-formFooter {
      font-size: 10px !important;
  }
  .AddonReviewCard .DismissibleTextForm-buttons {
      margin-top: 3px !important;
  }
  .Card.CardList.AddonReviewList-reviews-listing ul > li:hover .AddonReviewCard .AddonReviewCard-container .AddonReviewManager .DismissibleTextForm-delete-submit-buttons,
  .Card.CardList.AddonReviewList-reviews-listing ul > li .AddonReviewCard .AddonReviewCard-container .AddonReviewManager .DismissibleTextForm-delete-submit-buttons {
      display: inline-block !important;
      max-height: 15px !important;
      min-height: 15px !important;
      margin: 0px 0 0 0  !important;
      padding: 2px !important;
  }
  .Card.CardList.AddonReviewList-reviews-listing ul > li .AddonReviewCard .AddonReviewCard-container .AddonReviewManager .DismissibleTextForm-delete-submit-buttons {
      display: inline-block !important;
      max-height: 13px !important;
      min-height: 13px !important;
      margin: 0px 0 0 0  !important;
      padding: 2px !important;
      font-size: 9px !important;
  }
  .Card.CardList.AddonReviewList-reviews-listing ul > li .AddonReviewCard .AddonReviewCard-container .AddonReviewManager .Button.Button--neutral.DismissibleTextForm-dismiss {
      height: 15px !important;
      line-height: 10px !important;
      margin-top: 5px !important;
      font-size: 9px !important;
  }
  .Card.CardList.AddonReviewList-reviews-listing ul > li .AddonReviewCard .AddonReviewCard-container .AddonReviewManager .DismissibleTextForm-delete-submit-buttons .Button--action {
      height: 15px !important;
      line-height: 10px !important;
      font-size: 9px !important;
  }
  .Card.CardList.AddonReviewList-reviews-listing ul > li:hover .AddonReviewCard .AddonReviewCard-container .AddonReviewManager .DismissibleTextForm-delete-submit-buttons .Button--action {
      display: inline-block !important;
      height: 10px !important;
      line-height: 7px !important;
      margin-top: -8px !important;
      padding: 0 8px;
      font-size: 8px !important;
  }
  /* STAR YELLOWS - ALL - === */
  .Rating-selected-star {
      fill: gold !important;
      filter: invert(1%)!important;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width=\\'64\\' height=\\'64\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M154.994575,670.99995 C153.704598,671.000763 152.477615,670.442079 151.630967,669.468394 C150.784319,668.49471 150.401158,667.201652 150.580582,665.923653 L153.046749,648.259919 L141.193762,635.514481 C140.080773,634.318044 139.711733,632.608076 140.232152,631.058811 C140.752571,629.509546 142.078939,628.369589 143.688275,628.088421 L160.214424,625.130961 L168.013827,609.468577 C168.767364,607.955994 170.3113,607 172.000594,607 C173.689888,607 175.233824,607.955994 175.98736,609.468577 L183.790813,625.130961 L200.329111,628.08437 C201.934946,628.371492 203.25546,629.513805 203.771316,631.062053 C204.287172,632.610301 203.915846,634.316807 202.803377,635.51043 L190.954439,648.26397 L193.420606,665.923653 C193.652457,667.578241 192.93975,669.223573 191.574418,670.185702 C190.209085,671.147831 188.420524,671.265104 186.941351,670.489485 L172.002619,662.698806 L157.047688,670.50569 C156.413201,670.833752 155.708782,671.003331 154.994575,670.99995 Z\\' transform=\\'translate(-140 -607)\\' fill=\\'%23FFE900\\' fill-rule=\\'nonzero\\'/%3E%3C/svg%3E");
  }

  /* ALL - STAR SELECTED GOLD - === */
  .Icon.Icon-inline-content.IconStar .IconStar-svg g path {
      fill: gold !important;
  }

  /* SPECIAL NUMBER OF STARS ( 5 or 1 - === */
  .AddonReviewCard .Rating.Rating--small[title="Rated 1 out of 5"] .Rating-selected-star,
  .AddonReviewCard .Rating.Rating--small[title="Rated 5 out of 5"] .Rating-selected-star {
      height: 15px !important;
      min-width: 11px !important;
      margin-top: 2px !important;
      margin-right: -4px !important;
      filter: invert(1%)!important;
      /* background-color: yellow !important; */
  }

  /* (new129) BEST - 5 STARS - === */
  .AddonReviewCard .Rating.Rating--small[title="Rated 5 out of 5"] {
      background-color: gold !important;
  }
  /* MY 5 YELLOW STARS */
  .AddonReviewCard .Rating.Rating--small.Rating--yellowStars[title="Rated 5 out of 5"] {
      background-color: #4ACAE7 !important;
  }
  /* (new129) others  5 GRAY STARS */
  .AddonReviewCard .Rating.Rating--small:not(.Rating--yellowStars)[title="Rated 5 out of 5"] {
      min-width: 34% !important;
      max-width: 34% !important;
      background-color: #0F7371 !important;
  }
  .AddonReviewList-reviews .CardList ul > li .Rating.Rating--small:not(.Rating--yellowStars)[title="Rated 5 out of 5"] + .AddonReviewCard-authorByLine,
  .AddonReviewList-reviews .CardList ul > li:hover .Rating.Rating--small:not(.Rating--yellowStars)[title="Rated 5 out of 5"] + .AddonReviewCard-authorByLine {
      max-width: 51% !important;
      min-width: 51% !important;
  }
  .AddonReviewCard .Rating.Rating--small .Rating-selected-star {
      filter: invert(1%)!important;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width=\\'64\\' height=\\'64\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M154.994575,670.99995 C153.704598,671.000763 152.477615,670.442079 151.630967,669.468394 C150.784319,668.49471 150.401158,667.201652 150.580582,665.923653 L153.046749,648.259919 L141.193762,635.514481 C140.080773,634.318044 139.711733,632.608076 140.232152,631.058811 C140.752571,629.509546 142.078939,628.369589 143.688275,628.088421 L160.214424,625.130961 L168.013827,609.468577 C168.767364,607.955994 170.3113,607 172.000594,607 C173.689888,607 175.233824,607.955994 175.98736,609.468577 L183.790813,625.130961 L200.329111,628.08437 C201.934946,628.371492 203.25546,629.513805 203.771316,631.062053 C204.287172,632.610301 203.915846,634.316807 202.803377,635.51043 L190.954439,648.26397 L193.420606,665.923653 C193.652457,667.578241 192.93975,669.223573 191.574418,670.185702 C190.209085,671.147831 188.420524,671.265104 186.941351,670.489485 L172.002619,662.698806 L157.047688,670.50569 C156.413201,670.833752 155.708782,671.003331 154.994575,670.99995 Z\\' transform=\\'translate(-140 -607)\\' fill=\\'%23FFE900\\' fill-rule=\\'nonzero\\'/%3E%3C/svg%3E");
  }
  .AddonReviewCard .Rating.Rating--small:not(.Rating--yellowStars)[title="Rated 5 out of 5"] .Rating-selected-star {
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width=\\'64\\' height=\\'64\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M154.994575,670.99995 C153.704598,671.000763 152.477615,670.442079 151.630967,669.468394 C150.784319,668.49471 150.401158,667.201652 150.580582,665.923653 L153.046749,648.259919 L141.193762,635.514481 C140.080773,634.318044 139.711733,632.608076 140.232152,631.058811 C140.752571,629.509546 142.078939,628.369589 143.688275,628.088421 L160.214424,625.130961 L168.013827,609.468577 C168.767364,607.955994 170.3113,607 172.000594,607 C173.689888,607 175.233824,607.955994 175.98736,609.468577 L183.790813,625.130961 L200.329111,628.08437 C201.934946,628.371492 203.25546,629.513805 203.771316,631.062053 C204.287172,632.610301 203.915846,634.316807 202.803377,635.51043 L190.954439,648.26397 L193.420606,665.923653 C193.652457,667.578241 192.93975,669.223573 191.574418,670.185702 C190.209085,671.147831 188.420524,671.265104 186.941351,670.489485 L172.002619,662.698806 L157.047688,670.50569 C156.413201,670.833752 155.708782,671.003331 154.994575,670.99995 Z\\' transform=\\'translate(-140 -607)\\' fill=\\'%23FFE900\\' fill-rule=\\'nonzero\\'/%3E%3C/svg%3E");
  }
  /* (new129) BAD - ONLY ONE STAR - === */
  .AddonReviewCard .Rating.Rating--small[title="Rated 1 out of 5"] {
      min-width: 32% !important;
      max-width: 32% !important;
      background-color: red !important;
  }
  .AddonReviewList-reviews .CardList ul > li .AddonReviewCard .Rating.Rating--small[title="Rated 1 out of 5"] + .AddonReviewCard-authorByLine,
  .AddonReviewList-reviews .CardList ul > li:hover .AddonReviewCard .Rating.Rating--small[title="Rated 1 out of 5"] + .AddonReviewCard-authorByLine {
      max-width: 53% !important;
      min-width: 53% !important;
  }

  /* (new105) - LARGE RATING STAR in REVIEW - === */
  .AddonSummaryCard-overallRatingStars {
      margin-bottom: 6px;
  }
  .AddonSummaryCard-overallRatingStars .Rating-star {
      height: 18px !important;
  }
  .AddonSummaryCard-overallRatingStars .Rating.Rating--large {
      min-height: 18px !important;
  }

  /*  HOMEPAGE - EXTENSIONS / THEMES - === */
  .LandingPage {
      padding: 0 14px 24px !important;
  }
  .LandingPage-header {
      margin-bottom: -13px !important;
      padding: 8px 14px !important;
  }
  .LandingPage-addonType-name {
      font-size: 25px;
      margin: -5px 0 0 0px !important;
  }
  /*ALL - CONTAINER */
  .LandingPage .Card {
      display: inline-block;
      width: 925px !important;
      height: 350px !important;
      margin: 0 0 0px 0px !important;
      top: -41px !important;
  }
  /* CATEGORIES - CONTAINER */
  .LandingPage .Card.Categories.Card--no-footer {
      position: relative !important;
      display: inline-block !important;
      height: 400px;
      margin: -20px 10px -20px 0 !important;
      top: -20px !important;
  }
  /* 3 OTHERS - LIST CONTAINER */
  .Card.CardList.AddonsCard.LandingAddonsCard {
      position: relative !important;
      display: inline-block !important;
      margin: 15px 10px 0px 0px !important;
      top: 0px !important;
      /*border: 1px solid aqua  !important;*/
  }
  /* 3 OTHERS - THEME */
  .Page.Page-not-homepage .LandingPage.LandingPage--persona.LandingPage--theme li.SearchResult.SearchResult--theme .SearchResult-result {
      border-radius: 5px !important;
  background: black !important;
  }
  .Page.Page-not-homepage .LandingPage.LandingPage--persona.LandingPage--theme li.SearchResult.SearchResult--theme .SearchResult-contents {
      width: 100%;
      margin: 0;
      max-height: 225px !important;
      min-height: 225px !important;
      padding: 0 5px 15px;
      border-radius: 5px !important;
  }
  .Page.Page-not-homepage .LandingPage.LandingPage--persona.LandingPage--theme .SearchResult-metadata {
      display: inline-block !important;
      width: 100% !important;
      height: 90px !important;
      margin-top: -45px !important;
  }
  .Page.Page-not-homepage .LandingPage.LandingPage--persona.LandingPage--theme .SearchResult-metadata .SearchResult-rating {
      display: inline-block !important;
      width: 100% !important;
      height: 15px;
      line-height: 13px;
      text-align: center !important;
  }
  .Page.Page-not-homepage .LandingPage.LandingPage--persona.LandingPage--theme .SearchResult-metadata .SearchResult-rating .Rating.Rating--small {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      text-align: center !important;
  }
  .Page.Page-not-homepage .LandingPage.LandingPage--persona.LandingPage--theme .SearchResult-metadata .SearchResult-rating .Rating.Rating--small .Rating-star {
      display: inline-block !important;
      margin-right: 2px !important;
  }
  .Page.Page-not-homepage .LandingPage.LandingPage--persona.LandingPage--theme .SearchResult-metadata .SearchResult-author {
      width: 100% !important;
      height: 20px !important;
      line-height: 15px !important;
      font-size: 15px !important;
  }
  /* ALL - CONTENTS */
  .LandingPage .Card .Card-contents {
      height: 305px !important;
      border-radius: 0 !important;
      /* background: red !important; */
  }
  /* (new132) LIST without CATEGORIES - CONTENTS */
  .Card.CardList.AddonsCard.LandingAddonsCard .Card-contents {
      height: 325px !important;
      padding: 5px 0 !important;
  }
  /* ALL - LIST */
  .LandingPage .Card .Card-contents ul.AddonsCard-list {
      grid-auto-flow: unset !important;
      grid-template-rows: unset !important;
      display: inline-block !important;
      min-width: 100% !important;
  }
  /* (new145) LIST without CATEGORIES - LIST  / THEME */
  .Card.CardList.AddonsCard.LandingAddonsCard .Card-contents ul.AddonsCard-list {
      grid-auto-flow: unset !important;
      grid-template-rows: unset !important;
      display: inline-block !important;
      min-width: 100% !important;
      height: 318px !important;
  }
  .LandingPage .Card .Card-contents + .Card-footer.Card-footer-link {
      position: relative !important;
      display: inline-block !important;
      width: 100% !important;
      height: 25px !important;
      margin-top: -6px !important;
      padding: 0 20px !important;
  }
  .LandingPage .Card .Card-contents + .Card-footer.Card-footer-link a {
      height: 25px !important;
      padding: 0 20px !important;
  }

  /* (new145) THEME - LIST -  ITEMS 
  https://addons.mozilla.org/fr/firefox/themes/
  .LandingPage.LandingPage--theme 
  */
  .LandingPage .Card .Card-contents ul.AddonsCard-list li.SearchResult {
      grid-template-columns: unset !important;
      float: left !important;
      height: 155px !important;
      min-width: 49.4% !important;
      max-width: 49.4% !important;
      margin: 0 0 4px 3px !important;
      padding: 0px !important;
      border-radius: 5px !important;
  /*border: 1px dashed aqua !important;*/
  }
  /*.AddonsCard--horizontal ul.AddonsCard-list .SearchResult-wrapper:hover .SearchResult-users ,*/
  .LandingPage.LandingPage--theme .AddonsCard--horizontal ul.AddonsCard-list li.SearchResult:hover .SearchResult-wrapper .SearchResult-users {
      display: inline-block !important;
  }

  .LandingPage .Card .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper {
      padding: 5px !important;
      border-radius: 5px !important;
  border: 1px solid #333 !important;
  }
  .LandingPage .Card .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper:hover {
      background: #283146 !important;
  }
  .LandingPage .Card .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-contents {
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      max-height: 125px !important;
      min-height: 125px !important;
      margin: 0px 0 0 -5px !important;
      padding: 0 5px 5px 5px !important;
      border-radius: 5px 5px 0 0 !important;
  }
  .LandingPage .Card .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-users.SearchResult--meta-section {
      height: 15px;
      margin-top: -16px;
  }
  .LandingPage .Card .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-link .SearchResult-result {
      grid-column-gap: unset !important;
      grid-template-columns: unset !important;
      -moz-box-direction: unset !important;
      -moz-box-orient: unset !important;
      flex-flow: unset !important;
      height: 123px !important;
      margin: 0;
      padding: 0;
      width: 100%;
  }
  .LandingPage .Card .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-link .SearchResult-result {
      height: 223px !important;
  }

  .LandingPage .Card .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-icon-wrapper {
      height: 143px !important;
  }
  /* (new121) THEMES PAGES */
  .LandingPage .Card .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-icon-wrapper {
      width: calc(45% - 10px) !important;
      margin-left: 5px !important;
      margin-top: 40px !important;
      padding: 0 4px !important;
      border-radius: 14px !important;
  }
  .LandingPage .Card .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-metadata {
      display: inline-block;
      margin-top: 45px !important;
  }
  /* THEMES PREVIEW */
  .LandingPage.LandingPage--persona.LandingPage--theme .Card .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme {
      grid-template-columns: unset !important;
      display: inline-block !important;
      height: 235px !important;
      min-width: 32% !important;
      max-width: 32% !important;
      margin-top: 10px !important;
      margin-left: 3px !important;
      margin-right: 5px !important;
      margin-bottom: 5px !important;
      padding-top: 0px !important;
      overflow: hidden !important;
  }
  .LandingPage.LandingPage--persona.LandingPage--theme .Card .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-wrapper:hover {
      position: relative !important;
      display: inline-block !important;
      height: 233px !important;
      top: 0px !important;
  }
  .LandingPage.LandingPage--persona.LandingPage--theme .Card .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-icon-wrapper {
      margin-top: 150px !important;
  }
  .LandingPage.LandingPage--persona.LandingPage--theme .Card .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-wrapper:hover .SearchResult-icon-wrapper {
      display: inline-block !important;
      width: 93% !important;
      margin-top: 150px !important;
      top: 0px !important;
  }
  .LandingPage .Card.AddonsCard--horizontal .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-link .SearchResult-contents {
      -moz-box-direction: unset !important;
      -moz-box-flex: unset !important;
      -moz-box-ordinal-group: unset !important;
      -moz-box-orient: unset !important;
      -moz-box-pack: unset !important;
      justify-content: unset !important;
      flex-flow: unset !important;
      flex-grow: unset !important;
      order: unset !important;
      display: inline-block !important;
      height: 100%;
      max-height: 125px !important;
      min-height: 125px !important;
      line-height: 10px !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin-left: 0% !important;
      margin-top: 0px !important;
      padding: 3px 5px 2px 5px !important;
  background: #283146 !important;
  }
  .LandingPage .Card.AddonsCard--horizontal .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-link .SearchResult-contents {
      max-height: 122px !important;
      min-height: 122px !important;
      line-height: 10px !important;
  }
  .LandingPage .Card.AddonsCard--horizontal .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-link .SearchResult-contents {
      max-height: 185px !important;
      min-height: 185px !important;
      line-height: 10px !important;
  }
  .LandingPage .Card.AddonsCard--horizontal .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-link .SearchResult-contents p.SearchResult-summary {
      -moz-box-flex: unset !important;
      flex-grow: unset !important;
      height: 100%;
      line-height: 15px !important;
      max-height: 75px !important;
      min-height: 75px !important;
      min-width: 100%;
      max-width: 100%;
      margin-bottom: 0 !important;
      margin-top: 0 !important;
      padding: 2px 3px !important;
      font-size: 12px;
      overflow: hidden !important;
      overflow-y: auto !important;
  }

  .LandingPage .Card.AddonsCard--horizontal .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-link .SearchResult-contents .SearchResult-metadata {
      float: right !important;
      line-height: 15px !important;
      width: 100% !important;
      min-width: 60% !important;
      max-width: 60% !important;
      margin-top: -2px !important;
      text-align: center !important;
  }
  .LandingPage .Card.AddonsCard--horizontal .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-link .SearchResult-contents .SearchResult-metadata {
      width: 100% !important;
      min-width: 100% !important;
      margin-top: 20px !important;
  }
  .LandingPage .Card.AddonsCard--horizontal .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-link .SearchResult-contents + .SearchResult-users.SearchResult--meta-section {
      float: left !important;
      width: 100% !important;
      min-width: 27.5% !important;
      max-width: 27.5% !important;
      line-height: 10px !important;
      height: 17px !important;
      margin-left: 5px !important;
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      text-align: center !important;
      z-index: 100 !important;
  }
  .LandingPage .Card.AddonsCard--horizontal .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-link .SearchResult-contents + .SearchResult-users.SearchResult--meta-section {
      width: 100% !important;
      min-width: 100% !important;
      margin-left: 0px !important;
      margin-top: 25px !important;
      z-index: 500 !important;
  }
  .LandingPage .Card.AddonsCard--horizontal .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-link .SearchResult-contents .SearchResult-name {
      -moz-box-flex: unset !important;
      flex-grow: unset !important;
      text-overflow: unset !important;
      white-space: unset !important;
      display: inline-block !important;
      height: 25px !important;
      line-height: 1 !important;
      max-width: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      font-size: 15px;
      text-decoration: none;
      overflow: unset;
      overflow-wrap: break-word;
  }
  .LandingPage .Categories-item {
      display: inline-block;
      padding: 0;
      min-width: 30% !important;
      max-width: 30% !important;
      width: 100% !important;
  }
  .Categories--category-color-10 {
      background: #497011 !important;
  }
  .Categories--category-color-9 {
      background: #267434 !important;
  }
  .Categories--category-color-8 {
      background: #095b42 !important;
  }
  .Categories--category-color-7 {
      background: #0b5863 !important;
  }
  .Categories--category-color-5 {
      background: #0c33cf !important;
  }
  .Categories--category-color-4 {
      background: #3f0fcd !important;
  }
  .Categories--category-color-3 {
      background: #8620a0 !important;
  }
  .Categories--category-color-2 {
      background: #b1184e !important;
  }
  .Categories--category-color-1 {
      background: #e00606 !important;
  }
  /* HOME - ADDONS CATEGORY FEATURED PAGE - === */
  .Category section.Card.CategoryHeader {
      height: 86px !important;
      margin-top: -19px !important;
      margin-bottom: 0px !important;
  }
  .Category section.Card.CardList.AddonsCard.LandingAddonsCard {
      margin-bottom: -20px !important;
  }
  .Category section.Card.CategoryHeader .CategoryHeader-wrapper {
      margin-bottom: 0 !important;
      margin-top: 0 !important;
  }
  .Category section.Card.CardList.AddonsCard.LandingAddonsCard .SearchResult.SearchResult--theme {
      height: 180px !important;
  }
  .Category section.Card.CardList.AddonsCard.LandingAddonsCard .SearchResult {
      height: 202px !important;
  }
  .Category section.Card.CardList.AddonsCard.LandingAddonsCard .SearchResult .SearchResult-icon-wrapper {
      display: inline-block;
      height: 170px !important;
      margin-left: 1% !important;
      margin-right: auto !important;
      margin-top: 7px !important;
      top: 92px !important;
  }
  .Category.Category--theme section.Card.CardList.AddonsCard.LandingAddonsCard .SearchResult-icon-wrapper {
      display: inline-block !important;
      width: 28% !important;
      min-height: 80px !important;
      margin-top: 5px !important;
  }
  .Category.Category--theme section.Card.CardList.AddonsCard.LandingAddonsCard .SearchResult-icon-wrapper .SearchResult-icon {
      max-height: 70px !important;
      min-height: 70px !important;
  }
  .Category.Category--theme section.Card.CardList.AddonsCard.LandingAddonsCard .SearchResult-contents,
  .Category section.Card.CardList.AddonsCard.LandingAddonsCard .SearchResult-contents {
      display: inline-block !important;
      width: 100% !important;
      height: 100%;
      max-height: 170px !important;
      min-height: 170px !important;
      padding: 2px 5px;
      border-radius: 0 9px 9px 0;
  }
  .Category.Category--theme section.Card.CardList.AddonsCard.LandingAddonsCard .SearchResult-contents {
      max-height: 130px !important;
      min-height: 130px !important;
  }
  .Category.Category--theme section.Card.CardList.AddonsCard.LandingAddonsCard li.SearchResult.SearchResult--theme .SearchResult-contents .SearchResult-name {
      height: 20px !important;
      margin-bottom: -10px !important;
  }

  /* ALL - === */
  .Select {
      -moz-appearance: none;
      display: block;
      line-height: 1.2;
      overflow: hidden;
      padding-bottom: 10px;
      padding-top: 10px;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-radius: 5px !important;
  color: #c1d0ff !important;
  background-color: #191f2d !important;
  border-color: #191f2d !important;
  }
  /* (new131) ADDON VERSIONS PAGES - === */
  .AddonVersions-wrapper {
      min-height: 775px !important;
  }
  .AddonVersions-wrapper .AddonSummaryCard {
      min-width: 300px;
      width: 15% !important;
  }
  .AddonVersions-wrapper .AddonVersions-versions {
      margin-top: 0;
      width: 85%;
  }
  .AddonVersions-wrapper .CardList ul li.AddonVersionCard {
      display: inline-block !important;
      width: 32.8% !important;
      height: 270px !important;
      margin-bottom: 0;
      margin-right: 4px !important;
      margin-left: 4px !important;
      padding: 0px 7px 0 7px !important;
      border-radius: 9px !important;
      overflow: hidden !important;
  border: 1px solid rgba(12, 12, 13, 0.9);
  }

  .AddonVersions .Card.CardList.AddonVersions-versions.Card--photon .Card-contents .InstallButtonWrapper {
      position: absolute !important;
      display: inline-block !important;
      width: 25% !important;
      margin-left: -480px !important;
      margin-top: 50px !important;
      border-radius: 5px !important;
      z-index: 500000 !important;
  background: #526289 !important;
  border: 1px solid rgba(12, 12, 13, 0.9);
  }
  .AddonVersions .Card.CardList.AddonVersions-versions.Card--photon .Card-contents .InstallButtonWrapper .InstallButtonWrapper-download {
      margin-left: 0px !important;
      margin-top: 0px !important;
  }
  /* (new136) */
  .AddonVersionCard-license {
      float: left !important;
      width: 478px !important;
      margin: 0 !important;
      /* border: 1px solid red !important; */
  }
  /* VERSIONS PAGES - ERROR COMPATIBILITY */
  .AddonVersions-wrapper .CardList ul li.AddonVersionCard .Notice.Notice-error.AddonCompatibilityError .Notice-icon {
      margin-left: 1px !important;
      margin-top: 5px !important;
  }
  .AddonVersions-wrapper .CardList ul li.AddonVersionCard .Notice.Notice-error.AddonCompatibilityError {
      position: absolute !important;
      width: 25px !important;
      height: 25px !important;
      margin-top: -20px !important;
      margin-left: 23.5% !important;
      padding-bottom: 0;
      padding-top: 0;
      overflow: hidden !important;
  }
  .AddonVersions-wrapper .CardList ul li.AddonVersionCard .Notice.Notice-error.AddonCompatibilityError:hover {
      position: absolute !important;
      width: 25% !important;
      height: 35px !important;
      margin-top: -10px !important;
      margin-left: 0% !important;
      overflow: hidden !important;
      transition: all ease 0.7s !important;
  }
  /* VERSIONS PAGES - ERROR COMPATIBILITY - LAST VERSION */
  .AddonVersions-wrapper .CardList ul li:not(.AddonVersionCard) + .AddonVersionCard > div:not(.InstallButtonWrapper) .Notice.Notice-error.AddonCompatibilityError {
      position: absolute !important;
      width: 25px !important;
      height: 25px !important;
      margin-top: -10px !important;
      padding-bottom: 0;
      padding-top: 0;
      margin-left: 89% !important;
      overflow: hidden !important;
      z-index: 5000 !important;
  }
  .AddonVersions-wrapper .CardList ul li:not(.AddonVersionCard) + .AddonVersionCard > div:not(.InstallButtonWrapper) .Notice.Notice-error.AddonCompatibilityError:hover {
      position: absolute !important;
      width: 97% !important;
      height: 55px !important;
      margin-top: -10px !important;
      margin-left: 0% !important;
      overflow: hidden !important;
      transition: all ease 0.7s !important;
  }
  /* for ONLY one Version:
  https://addons.mozilla.org/en-US/firefox/addon/open_iframe/versions/
  - === */
  .AddonVersions-wrapper .CardList ul > li.AddonVersionCard:nth-child(2),
  .AddonVersions-wrapper .CardList ul > li:not(.AddonVersionCard) + .AddonVersionCard:not(:last-of-type) {
      position: absolute !important;
      display: inline-block !important;
      min-width: 300px;
      width: 15% !important;
      height: 270px !important;
      left: 1.05% !important;
      top: 520px !important;
      padding: 5px !important;
  border: 1px dotted yellow !important;
  }
  .AddonVersions-wrapper .CardList ul > li:not(.AddonVersionCard) + .AddonVersionCard:not(:last-of-type) > div:not(:empty):not(.InstallButtonWrapper):not(.InstallWarning):not(.Notice-genericWarning) {
      display: inline-block !important;
      height: 185px !important;
      width: 100% !important;
      padding-top: 5px !important;
      margin-top: 25px !important;
      margin-top: 26px !important;
  }
  /* (new136) */
  .AddonVersions-wrapper .CardList ul > li.AddonVersionCard:nth-child(2) .InstallButtonWrapper,
  .AddonVersions .Card.CardList ul > li:not(.AddonVersionCard) + .AddonVersionCard:not(:last-of-type) .InstallButtonWrapper {
      width: 96% !important;
      top: 19.6vh !important;
      left: 0 !important;
      margin-left: 5px !important;
  /* border: 1px solid lime !important; */
  }
  .AMInstallButton-button.Button--action.Button--puffy,
  .AMInstallButton-button.Button--action.Button--puffy:link {
      border-radius: 4px;
      font-size: 16px;
      height: auto;
      min-height: 3vh !important;
      max-height: 3vh !important;
      padding: 0 16px !important;
  }

  /* (new136) ADDON VERSION + NOTICE WARGING */
  .Page.Page-not-homepage .AddonVersions .AddonVersions-wrapper .Notice.Notice-genericWarning {
      position: fixed !important;
      width: 100%;
      max-height: 28px;
      max-width: 28px;
      left: 0px !important;
      top: 5px;
      white-space: nowrap;
      overflow: hidden;
      z-index: 500;
  color: white !important;
  background-color: red !important;
  }
  /* .Page.Page-not-homepage .AddonVersions .AddonVersions-wrapper  */
  .Page.Page-not-homepage .AddonVersions .AddonVersions-wrapper .CardList ul > li.AddonVersionCard:nth-child(2) .Notice.Notice-genericWarning.InstallWarning + .InstallButtonWrapper,
  .Page.Page-not-homepage .AddonVersions .AddonVersions-wrapper .CardList ul > li:not(.AddonVersionCard) + .AddonVersionCard:not(:last-of-type) .Notice.Notice-genericWarning.InstallWarning + .InstallButtonWrapper {
      position: absolute !important;
      display: inline-block !important;
      width: 96% !important;
      top: 23.6vh !important;
      left: 0 !important;
      margin: 0 0 0 5px !important;
      z-index: 500000 !important;
  /*border: 1px solid red !important;*/
  }

  /* (new136) INSTALL VERSION - GET FIREFOX */
  .AddonVersions .Card.CardList.AddonVersions-versions.Card--photon .Card-contents .InstallButtonWrapper .GetFirefoxButton + .InstallButtonWrapper-download {
      min-height: 3vh !important;
      max-height: 3vh !important;
      margin: 0 !important;
  /* border: 1px solid aqua  !important; */
  }
  /* ONLY ONE CARD - INSTAL  */
  .AddonVersions .Card.CardList.AddonVersions-versions.Card--photon ul > li.AddonVersionCard:nth-child(2) .InstallButtonWrapper {
      display: inline-block !important;
      width: 97% !important;
  /* border: 1px solid violet !important; */
  }
  .AddonVersions-wrapper .CardList ul li.AddonVersionCard > div:not(.InstallButtonWrapper):not(.InstallWarning):not(.Notice-genericWarning) {
      display: inline-block !important;
      height: 240px !important;
      width: 100% !important;
      padding-top: 5px !important;
      margin-top: 25px !important;
      white-space: pre-line !important;
      word-wrap: break-word !important;
      overflow-wrap: unset !important;
      overflow: hidden !important;
  /* border-bottom: 1px solid violet !important; */
  }
  /* (new145) */
  .AddonVersions-wrapper .CardList ul > li:not(.AddonVersionCard) + .AddonVersionCard:not(:last-of-type) .AddonVersionCard-releaseNotes,
  .AddonVersionCard-releaseNotes {
      display: inline-block !important;
      min-height: 12.5vh !important;
      max-height: 12.5vh !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 3px 5px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  background: #283146 !important;
  /* border: 1px solid lime  !important; */
  }
  .AddonVersionCard-compatibility {
      min-height: 2vh !important;
      max-height: 2vh !important;
      line-height: 15px !important;
      margin: 3.2vh 0 0 0 !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      overflow-y: hidden !important;
      text-overflow: ellipsis !important;
  /* border: 1px solid aqua  !important; */
  }
  .AddonVersionCard-releaseNotes > br {
      content: " " !important;
      float: none !important;
      display: block !important;
      line-height: 0px !important;
      margin-top: 5px !important;
      margin-bottom: -3px !important;
  }
  .AddonVersionCard-version {
      position: absolute !important;
      display: inline-block !important;
      min-width: 25% !important;
      max-width: 25% !important;
      transform: translate(0px, -38px) !important;
  color: #0060df;
  }

  /*(new147) VERSION PAGES - LAST VERSION / ONLY ONE - BOTTOM / LEFT */
  .AddonVersions-wrapper .CardList ul > li:not(.AddonVersionCard) + .AddonVersionCard,
  .AddonVersions-wrapper .CardList ul > li:not(.AddonVersionCard) + .AddonVersionCard:not(:last-of-type) {
      display: inline-block !important;
      min-height: 43vh !important;
      max-height: 43vh !important;
      margin: 0 !important;
  background: rgb(31, 37, 54) !important;
  border: 1px solid red !important;
  }

  /* INFOS CONTAINER */
  .AddonVersions-wrapper .CardList ul > li:not(.AddonVersionCard) + li.AddonVersionCard:not(:last-of-type) > div.AddonVersionCard-content:first-of-type {
      display: inline-block !important;
      min-height: 34vh !important;
      max-height: 34vh !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 3px 5px !important;
  background: rgb(31, 37, 54) !important;
  border-top: 1px solid red !important;
  border-bottom: 1px solid red!important;
  }

  /* (new148) LAST VERSION */
  .AddonVersions-wrapper .CardList ul > li:not(.AddonVersionCard) + .AddonVersionCard > div:not(:empty):not(.InstallButtonWrapper):not(.InstallWarning):not(.Notice-genericWarning) h1.AddonVersionCard-header,
  .AddonVersions-wrapper .CardList ul > li:not(.AddonVersionCard) + .AddonVersionCard:not(:last-of-type) > div:not(:empty):not(.InstallButtonWrapper):not(.InstallWarning):not(.Notice-genericWarning) h1.AddonVersionCard-header {
      position: absolute !important;
      min-width: 95.5% !important;
      max-width: 95.5% !important;
      top: -0.5vh !important;
      margin-left: -0.5% !important;
      font-size: 9px !important;
      text-align: center !important;
      border-radius: 0 0 100px 100px !important;
  background: red !important;
  }
  /* COMPATIBILITY */
  .AddonVersions-wrapper .CardList ul > li:not(.AddonVersionCard) + .AddonVersionCard .AddonVersionCard-compatibility,
  .AddonVersions-wrapper .CardList ul > li:not(.AddonVersionCard) + li.AddonVersionCard:not(:last-of-type) > div.AddonVersionCard-content:first-of-type .AddonVersionCard-compatibility {
      display: inline-block !important;
      width: 100% !important;
      margin: 0 0 0 0 !important;
  color: silver !important;
  border-top: 1px solid red !important;
  border-bottom: 1px solid red !important;
  }
  /* RELEASSE NOTES */
  .AddonVersions-wrapper .CardList ul > li:not(.AddonVersionCard) + .AddonVersionCard .AddonVersionCard-releaseNotes,
  .AddonVersions-wrapper .CardList ul > li:not(.AddonVersionCard) + .AddonVersionCard:not(:last-of-type) .AddonVersionCard-releaseNotes {
      position: relative !important;
      display: inline-block !important;
      min-height: 22vh !important;
      max-height: 22vh !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 3px 5px !important;
      overflow: hidden auto !important;
  background: #283146 !important;
  border-left: 4px solid red !important;
  }
  /* LICENSE */
  .AddonVersions-wrapper .CardList ul > li:not(.AddonVersionCard) + .AddonVersionCard .AddonVersionCard-license,
  .AddonVersions-wrapper .CardList ul > li:not(.AddonVersionCard) + .AddonVersionCard:not(:last-of-type) .AddonVersionCard-license {
      position: absolute!important;
      display: inline-block !important;
      min-width: 100% !important;
      max-width: 100% !important;
      line-height: 1.5vh !important;
      top: 31vh !important;
      left: 0 !important;
      padding: 3px 15px 0 15px !important;
      transform: unset !important;
  color: #0060df;
  border-top: 1px solid red !important;
  }

  /* INSTALL */
  .AddonVersions-wrapper .CardList ul > li:not(.AddonVersionCard) + .AddonVersionCard .InstallButtonWrapper,
  .AddonVersions-wrapper .CardList ul > li:not(.AddonVersionCard) + li.AddonVersionCard:not(:last-of-type) div:has(.AMInstallButton) {
      position: absolute !important;
      display: inline-block !important;
      min-width: 97% !important;
      max-width: 97% !important;
      top: unset !important;
      bottom: 1vh !important;
      left: 0 !important;
      transform: unset !important;
  /*border: 1px solid lime  !important;*/
  }


  /* FIRST / OTHER VERSION H1  -
  PB only one version:
  https://addons.mozilla.org/fr/firefox/addon/insite-search/versions/
  === */
  .AddonVersionCard-header {
      position: absolute;
      min-width: 25% !important;
      max-width: 25% !important;
      top: 80px !important;
      margin-left: 26% !important;
      text-align: center !important;
  }

  /* (new131) VERSION - UNINSTALL BUT */
  .AddonVersions .Card.CardList.AddonVersions-versions.Card--photon ul > li.AddonVersionCard:nth-child(2) .InstallButtonWrapper .Button.Button--neutral.AMInstallButton-button.AMInstallButton-button--uninstall.Button--puffy {
      width: 100% !important;
  background: #395067 !important;
  }


  /* FIRST VERSION - PANEL LEFT -
  PB only one version:
  https://addons.mozilla.org/fr/firefox/addon/insite-search/versions/
  === */
  /* .AddonVersions-wrapper .CardList ul li:first-of-type + .AddonVersionCard h1 , */
  .AddonVersions-wrapper .CardList ul li:not(.AddonVersionCard) + .AddonVersionCard > div:not(.InstallButtonWrapper) h1.AddonVersionCard-header {
      position: absolute;
      min-width: 93% !important;
      max-width: 93% !important;
      top: -6px !important;
      margin-left: 0% !important;
      font-size: 18px !important;
      text-align: right !important;
  }
  .AddonVersions-wrapper .CardList ul li:not(.AddonVersionCard) + .AddonVersionCard > div:not(.InstallButtonWrapper):not(.InstallWarning):not(.Notice-genericWarning) {
      height: 295px !important;
  }
  .AddonVersions-wrapper .CardList ul li:not(.AddonVersionCard) + .AddonVersionCard > div:not(.InstallButtonWrapper) .AddonVersionCard-version {
      position: absolute !important;
      display: inline-block !important;
      min-width: 96% !important;
      max-width: 96% !important;
      transform: translate(0px, -42px) !important;
  color: #0060df;
  background: transparent !important;
  }
  /* "BE CAREFUL" MESSAGE */
  .AddonVersions-wrapper .CardList .Card-contents > ul > li:first-of-type:not(.AddonVersionCard) {
      position: absolute !important;
      display: inline-block !important;
      min-width: 30px !important;
      width: 2% !important;
      height: 30px !important;
      left: 1.2% !important;
      top: 50px !important;
      border-radius: 9px !important;
      padding: 0px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
  }
  .AddonVersions-wrapper .CardList .Card-contents > ul > li:first-of-type:not(.AddonVersionCard):not(:hover) .Notice-column {
      visibility: hidden !important;
  }
  .Notice-warning .Notice-icon {
      height: 25px !important;
      width: 29px !important;
      margin-left: 0 !important;
      margin-top: -5px !important;
      background-size: cover;
  }
  .AddonVersions-wrapper .CardList .Card-contents > ul > li:first-of-type:not(.AddonVersionCard):hover {
      position: absolute !important;
      display: inline-block !important;
      width: 16% !important;
      height: auto !important;
      padding: 5px !important;
  }




  /* DOUBLE FOOTER -  === */
  #react-view + .Footer {
      display: none !important;
  }

  /* (new145) ==== COLOR - ==== */
  /* TEXT */
  .blog-entry-excerpt {
      color: #111 !important;
  }

  /* (new165) OLD FIRST - A VOIR */
  /* LINKS PERU - VISITED TOMATO */
  .SearchResult-wrapper .SearchResult-title,
  .AddonReviewCard-allControls .AddonReviewCard-control:not(.AddonReviewCard-deleting),
  .AddonReviewCard-allControls .AddonReviewCard-control:active:not(.AddonReviewCard-deleting),
  .AddonReviewCard-allControls .AddonReviewCard-control:hover:not(.AddonReviewCard-deleting),
  .AddonReviewCard-allControls .AddonReviewCard-control:link:not(.AddonReviewCard-deleting),
  .AddonReviewCard-allControls .AddonReviewCard-control:visited:not(.AddonReviewCard-deleting) {
      color: peru !important;
  }
  a.UserCollection-link .UserCollection-name,
  .Card.AddonMoreInfo.Card--no-footer .Card-contents .DefinitionList.AddonMoreInfo-dl dd a,
  .AddonTitle .AddonTitle-author a,
  .AddonTitle .AddonTitle-author a:link,
  .SearchResult a.SearchResult-link .SearchResult-result h2.SearchResult-name,
  a {
      color: peru !important;
  }

  .SearchResult-wrapper:visited .SearchResult-title,
  a:visited.UserCollection-link .UserCollection-name,
  .Card.AddonMoreInfo.Card--no-footer .Card-contents .DefinitionList.AddonMoreInfo-dl dd a:visited,
  .AddonTitle .AddonTitle-author a:visited,
  .AddonTitle .AddonTitle-author a:link:visited,
  .SearchResult a.SearchResult-link:visited .SearchResult-result h2.SearchResult-name,
  a:visited {
      color: tomato !important;
  }



  /* (new145) TEXT - GRAY LIGHT - #B1ADAD -  */
  .CollectionManager-slug-url-prefix,
  .Home-heroHeader-subtitle,
  .SecondaryHero-module,
  .SecondaryHero-message {
      color: #B1ADAD;
  }

  /* (new145) TEXT - RED */
  .Page-not-homepage .Collection .Collection-delete-button .Button--cancel {
      color: red;
  }

  /* BACKGROUND - #1f2536 - === */
  .Search .SearchResults-message {
      background: #1f2536 !important;
  }

  /* BACKGROUND - BLUE DARK - #191f2d */
  .SecondaryHero-module {
      background: #191f2d;
  }


  /* (new168) COLOR - ICON - INVERT 
  https://addons-dev.allizom.org/fr/firefox/user/10641574/
  ==== */
  /*.UserProfile-tags .Icon, */
  .UserProfile-tags .UserProfile-artist .Icon.Icon-artist,
  .UserProfile-tags .Icon.Icon-developer {
      float: left;
      height: 28px;
      width: 28px;
      margin-top: 0px !important;
      margin-left: -30px !important;
      border-radius: 5px;
  box-shadow: 0 0 2px #cccccc inset;
  background-size: 76% auto;
  background-color: #111 !important;
  background-image: url(https://addons.mozilla.org/static-server/img/addon-icons/default-64.d144b50f2bb8.png) !important;
  }
  .Icon-external-dark.Icon-external-dark {
      filter: invert(15%) sepia(100%) saturate(6481%) hue-rotate(46deg) brightness(102%) contrast(43%) !important;
  }

  /* COLOR SVG */
  /* ICON DEV */

  .Card.UserProfile-user-info.Card--no-footer p.UserProfile-developer:has(span.Icon-developer) span.Icon-developer{
      height: 23px  !important;
      width: 26px !important;
      padding: 3px  !important;
      background-image: url("https://addons.mozilla.org/static-server/img/addon-icons/default-64.d144b50f2bb8.png") !important;
      background-size: 20px 20px !important;
      background-color: transparent !important;
      filter: invert(15%) sepia(100%) saturate(6481%) hue-rotate(46deg) brightness(102%) contrast(43%) !important;
  /*border: 1px dashed lime!important;*/
  }


  /* ICON ARTISTE 
  background-image: url("https://addons.mozilla.org/static-server/img/addon-icons/default-64.d144b50f2bb8.png") !important;
  background-image: url("https://leonsdepot.de/img/thumbnails/firefox_theme_store.png") !important;
  */
  .UserProfile-tags p.UserProfile-artist:has(span.Icon-artist) span.Icon-artist{
      height: 23px  !important;
      width: 26px !important;
      padding: 3px  !important;
      background-image: url("https://addons.mozilla.org/static-server/img/addon-icons/default-64.d144b50f2bb8.png") !important;
      background-size: 20px 20px !important;
      background-color: transparent !important;
      filter: invert(15%) saturate(6481%) hue-rotate(46deg) brightness(102%) contrast(43%) !important;
  /*border: 1px dashed lime!important;*/
  }

  /* WEB ARCHIVE MOZILLA */

  /* (new131) ANIMATION - TOP BAR */
  #wm-ipp-base {
      position: fixed !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 30px !important;
      max-width: 30px !important;
      height: 100% !important;
      min-height: 50px !important;
      max-height: 50px !important;
      top: 0 !important;
      left: 0 !important;
      border-radius: 0 10px 10px 0 !important;
      overflow: hidden !important;
      visibility: visible !important;
      opacity: 1 !important;
      z-index: 5000000 !important;
  background: blue !important;
  }

  #wm-ipp-base:before {
      content: " ▶▶ \\A  Web \\A Archive" !important;
      position: fixed;
      display: inline-block !important;
      width: 50px !important;
      height: 50px !important;
      line-height: 13px !important;
      top: 0;
      padding: 5px 2px 2px 2px !important;
      font-size: 12px !important;
      border-radius: 0 10px 10px 0 !important;
      text-align: center !important;
      visibility: visible !important;
      z-index: 5000 !important;
      background: url(https://external-content.duckduckgo.com/ip3/archive.org.ico) top center no-repeat !important;
      background-size: contain !important;
      background-color: green !important;
  }


  /* ANIMATION - ZOOM IN / OUT from:
  https://vf-film.me/films/page/9/
  === */
  #wm-ipp-base #wm-ipp {
      position: absolute !important;
      display: none;
      animation-name: zoomIn;
      width: 100%;
      max-width: 20px !important;
      top: 50%;
      left: 30px !important;
      margin-top: 22px;
      padding: 1rem 1.25rem 1.25rem !important;
      border-radius: 10px !important;
      pointer-events: auto;
      z-index: 5000 !important;
      transform: translateY(-20%) !important;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: #111 !important;
  border: 1px solid red !important;
  }
  #wm-ipp-base:hover #wm-ipp {
      display: block !important;
      max-width: 80% !important;
      animation-duration: 0.8s;
      animation-fill-mode: both;
  }


  @keyframes zoomIn {
      0% {
          opacity: 0;
          transform: scale3d(0.3, 0.3, 0.3);
      }
      50% {
          opacity: 1;
      }
  }
  @keyframes fadeOut {
      0% {
          opacity: 1
      }

      100% {
          opacity: 0
      }
  }

  @keyframes scale {
      0% {
          transform: scale(.9);
          opacity: 0
      }

      50% {
          transform: scale(1.01);
          opacity: .5
      }

      100% {
          transform: scale(1);
          opacity: 1
      }
  }

  /* ==== END  ==== */
  `;
}
if ((location.hostname === "addons-dev.allizom.org" || location.hostname.endsWith(".addons-dev.allizom.org")) || location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* DEVAZILLON  */

  /* COLOR SVG */
  /* ICON DEV */

  .Card.UserProfile-user-info.Card--no-footer p.UserProfile-developer:has(span.Icon-developer) span.Icon-developer{
      height: 23px  !important;
      width: 26px !important;
      padding: 3px  !important;
      background: url(https://addons-dev.allizom.org/static-server/img/addon-icons/default-64.png) 50% no-repeat !important;
      background-size: 20px 20px !important;
      background-color: transparent !important;
      filter: invert(15%) sepia(100%) saturate(6481%) hue-rotate(46deg) brightness(102%) contrast(43%) !important;
  border: 1px dashed lime!important;
  }


  /* ICON ARTISTE 
  background-image: url("https://addons.mozilla.org/static-server/img/addon-icons/default-64.d144b50f2bb8.png") !important;
  background-image: url("https://leonsdepot.de/img/thumbnails/firefox_theme_store.png") !important;
  == */
  .UserProfile-tags p.UserProfile-artist:has(span.Icon-artist) span.Icon-artist{
      height: 23px  !important;
      width: 26px !important;
      padding: 3px  !important;
      background: url(https://addons-dev.allizom.org/static-server/img/addon-icons/default-64.png) 50% no-repeat !important;
      background-size: 20px 20px !important;
      background-color: transparent !important;
      filter: invert(15%) saturate(6481%) hue-rotate(46deg) brightness(102%) contrast(43%) !important;
  /*border: 1px dashed lime!important;*/
  }

  `;
}
if ((location.hostname === "addons.mozilla.org" || location.hostname.endsWith(".addons.mozilla.org")) || (location.hostname === "addons-dev.allizom.org" || location.hostname.endsWith(".addons-dev.allizom.org")) || location.href.startsWith("https://addons.mozilla.org./") || new RegExp("^(?:https://web.archive.org/web/.*/https://addons.mozilla.org/.*)\$").test(location.href)) {
  css += `
  /* (new165) OLD FIRST - A VOIR */

  /* GM UTAGS - SUPP (new154) */
  .UserReview-reply-header + span a + ul.utags_ul.utags_ul_0[data-utags_key],
  .AddonReviewCard-authorByLine a + ul.utags_ul.utags_ul_0[data-utags_key],
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--no-footer .Badge.Badge-border[data-testid="badge-recommended"] a + ul.utags_ul.utags_ul_0[data-utags_key],
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--no-footer .Badge.Badge-border[data-testid="badge-recommended"] a + ul.utags_ul.utags_ul_0[data-utags_key],
  .DropdownMenuItem-link a + ul.utags_ul.utags_ul_0[data-utags_key],
  .AddonReportAbuseLink--preview a + ul.utags_ul.utags_ul_0[data-utags_key],
  a.AddonMoreInfo-homepage-link + ul.utags_ul.utags_ul_0[data-utags_key],
  .AddonReviewCard-control:not(.AddonReviewCard-deleting) + ul.utags_ul.utags_ul_0[data-utags_key],
  .Addon.Addon-extension .UserReview-byLine > span a + ul.utags_ul.utags_ul_0[data-utags_key],
  a.AddonMeta-reviews-content-link + ul.utags_ul.utags_ul_0[data-utags_key],
  a.AddonMoreInfo-privacy-policy-link + ul.utags_ul.utags_ul_0[data-utags_key],
  .Definition-dd.AddonMoreInfo-related-categories a + ul.utags_ul.utags_ul_0[data-utags_key],
  .DefinitionList AddonMoreInfo-dl a + ul.utags_ul.utags_ul_0[data-utags_key],
  a.AddonMoreInfo-privacy-policy-link a + ul.utags_ul.utags_ul_0[data-utags_key],
  .Addon.Addon-extension .RatingManager > form .RatingManager-ratingControl .Button.Button--action.RatingManager-log-in-to-rate-button.Button--micro + ul.utags_ul.utags_ul_0[data-utags_key] + .Rating.Rating--large.RatingManager-UserRating:has(span.visually-hidden),
  .Footer-wrapper a + ul.utags_ul.utags_ul_0[data-utags_key],
  a.ShowMoreCard-expand-link + ul.utags_ul.utags_ul_0[data-utags_key],
  a.PermissionsCard-learn-more + ul.utags_ul.utags_ul_0[data-utags_key],
  a.Addon-all-reviews-link + ul.utags_ul.utags_ul_0[data-utags_key],
  a.Button--action + ul.utags_ul.utags_ul_0[data-utags_key],
  a.Button--action.RatingManager-log-in-to-rate-button + ul.utags_ul.utags_ul_0[data-utags_key],
  a.RatingsByStar-row + ul.utags_ul.utags_ul_0[data-utags_key],
  a.AddonMeta-reviews-title-link + ul.utags_ul.utags_ul_0[data-utags_key],
  a.PromotedBadge-link + ul.utags_ul.utags_ul_0[data-utags_key],
  a.Header-authenticate-button.Header-button + ul.utags_ul.utags_ul_0[data-utags_key],
  a.Notice-button + ul.utags_ul.utags_ul_0[data-utags_key],
  a.ReportAbuseButton-show-more + ul.utags_ul.utags_ul_0[data-utags_key],
  a.AMInstallButton-button + ul.utags_ul.utags_ul_0[data-utags_key],
  a.ContributeCard-button + ul.utags_ul.utags_ul_0[data-utags_key],
  a.AddonMoreInfo-license-link + ul.utags_ul.utags_ul_0[data-utags_key],
  a.AddonMoreInfo-version-history-link + ul.utags_ul.utags_ul_0[data-utags_key],
  a.PermissionsCard-learn-more + ul.utags_ul.utags_ul_0[data-utags_key],
  a.SectionLinks-link + ul.utags_ul.utags_ul_0[data-utags_key],
  .Addon.Addon-extension .RatingManager > form .RatingManager-ratingControl .Button.Button--action.RatingManager-log-in-to-rate-button.Button--micro + ul.utags_ul.utags_ul_0[data-utags_key] {
      visibility: hidden !important;
      display: none !important;
  }


  /* (new148) TEST - GM UTAGS - ADDON AUTHOR - NOT TAGGED  */
  .UserProfile-addons-and-reviews .AddonsByAuthorsCard .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper h2.SearchResult-name a.SearchResult-link + ul.utags_ul.utags_ul_0:has(.utags_text_tag.utags_captain_tag):hover,
  .UserProfile-addons-and-reviews .AddonsByAuthorsCard .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper h2.SearchResult-name a.SearchResult-link + ul.utags_ul.utags_ul_0:has(.utags_text_tag.utags_captain_tag) {
      position: absolute !important;
      display: inline-block!important;
      vertical-align: text-bottom !important;
      min-width: 20px !important;
      max-width: 100% !important;
      height: 2vh !important;
      line-height: 2vh !important;
      margin: 0 !important;
      padding: 0 !important;
      left: 7px!important;
      right: unset !important;
      top: 6vh !important;
      white-space: normal;
      list-style-type: none !important;
      overflow: visible;
      opacity: 1 !important;
      visibility: visible !important;
      z-index: 500000 !important;
  box-shadow: none !important;
  /*background-color: green !important;/*
  /*border: 1px solid yellow !important;*/
  }
  .UserProfile-addons-and-reviews .AddonsByAuthorsCard .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper h2.SearchResult-name a.SearchResult-link + ul.utags_ul.utags_ul_0:has(.utags_text_tag.utags_captain_tag):hover li,
  .UserProfile-addons-and-reviews .AddonsByAuthorsCard .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper h2.SearchResult-name a.SearchResult-link + ul.utags_ul.utags_ul_0:has(.utags_text_tag.utags_captain_tag) li {
      position: absolute !important;
      display: inline-block!important;
      vertical-align: text-bottom !important;
      min-width: 20px !important;
      max-width: 100% !important;
      min-height: 20px !important;
      line-height: normal !important;
      margin: 0 !important;
      padding: 0 !important;
      left: 0px!important;
      top: 0vh !important;
      white-space: normal;
      list-style-type: none !important;
      overflow: visible;
      opacity: 1 !important;
      visibility: visible !important;
      z-index: 500000 !important;
  box-shadow: none !important;
  /*background-color: blue !important;*/
  /*border: 1px solid pink !important;*/
  }

  .UserProfile-addons-and-reviews .AddonsByAuthorsCard .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper h2.SearchResult-name a.SearchResult-link + ul.utags_ul.utags_ul_0:has(.utags_text_tag.utags_captain_tag):hover li button.utags_text_tag.utags_captain_tag,
  .UserProfile-addons-and-reviews .AddonsByAuthorsCard .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper h2.SearchResult-name a.SearchResult-link + ul.utags_ul.utags_ul_0:has(.utags_text_tag.utags_captain_tag) li button.utags_text_tag.utags_captain_tag {
      display: inline-block!important;
      width: 100% !important;
      min-width: 20px !important;
      max-width: 20px !important;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      line-height: normal !important;
      margin: 0 !important;
      padding: 0 !important;
      left: 0px!important;
      top: 0vh !important;
      white-space: normal;
      list-style-type: none !important;
      overflow: visible;
      opacity: 1 !important;
      visibility: visible !important;
      z-index: 500000 !important;
  box-shadow: none !important;    
  /*background-color: peru !important;*/
  /*border: 1px solid red !important;*/
  }

  .UserProfile-addons-and-reviews .AddonsByAuthorsCard .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper h2.SearchResult-name a.SearchResult-link + ul.utags_ul.utags_ul_0:has(.utags_text_tag.utags_captain_tag) li button.utags_text_tag.utags_captain_tag svg {
      display: inline-block!important;
      width: 100% !important;
      min-width: 20px !important;
      max-width: 20px !important;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      line-height: normal !important;
      margin: 0 0 0 -3px !important;
      padding: 0 !important;
      left: 0px!important;
      top: 0vh !important;
      white-space: normal;
      list-style-type: none !important;
      overflow: visible;
      opacity: 1 !important;
      visibility: visible !important;
      translate: unset !important;
      z-index: 500000 !important;
  box-shadow: none !important;
  /*background-color: red !important;*/
  /*border: 1px solid aqua !important;*/
  }
  /* HOVER */
  .UserProfile-addons-and-reviews .AddonsByAuthorsCard .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper h2.SearchResult-name a.SearchResult-link + ul.utags_ul.utags_ul_0:has(.utags_text_tag.utags_captain_tag) li button.utags_text_tag.utags_captain_tag:hover {
      display: inline-block!important;
      width: 100% !important;
      min-width: 20px !important;
      max-width: 20px !important;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      line-height: normal !important;
      margin: 0 0 0 -3px !important;
      padding: 0 !important;
      left: -2px!important;
      top: 0vh !important;
      white-space: normal;
      list-style-type: none !important;
      overflow: visible;
      opacity: 1 !important;
      visibility: visible !important;
      translate: unset !important;
      z-index: 500000 !important;
  box-shadow: none !important;
  /*background-color: pink !important;*/
  /*border: 1px solid aqua !important;*/
  }
  /* HOVER */
  .UserProfile-addons-and-reviews .AddonsByAuthorsCard .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper h2.SearchResult-name a.SearchResult-link + ul.utags_ul.utags_ul_0:has(.utags_text_tag.utags_captain_tag) li button.utags_text_tag.utags_captain_tag:hover svg {
      display: inline-block!important;
      width: 100% !important;
      min-width: 20px !important;
      max-width: 20px !important;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      line-height: normal !important;
      margin: -5px 0 0 -6px !important;
      padding: 0 !important;
      left: 0px!important;
      top: -5vh !important;
      white-space: normal;
      list-style-type: none !important;
      overflow: visible;
      opacity: 1 !important;
      visibility: visible !important;
      translate: unset !important;
      z-index: 500000 !important;
  box-shadow: none !important;
  background-color: black !important;
  /*border: 1px solid aqua !important;*/
  }

  /* (new155) TEST - GM UTAGS - ADDON AUTHOR - TAGGED  */
  .UserProfile-addons-and-reviews .AddonsByAuthorsCard .Card-contents ul.AddonsCard-list li.SearchResult .SearchResult-wrapper h2.SearchResult-name a.SearchResult-link + ul.utags_ul {
      position: absolute !important;
      display: inline-block!important;
      vertical-align: text-bottom !important;
      min-width: 20px !important;
      max-width: 100% !important;
      height: 1.5vh !important;
      line-height: normal !important;
      margin: 0 !important;
      padding: 0 !important;
      left: unset !important;
      right: 40px!important;
      top: 12vh !important;
      white-space: normal;
      list-style-type: none !important;
      overflow: visible;
      opacity: 1 !important;
      visibility: visible !important;
      z-index: 500000 !important;
  box-shadow: none !important;
  /*background-color: gold !important;*/
  /*border: 1px solid yellow !important;*/
  }
  `;
}
if ((location.hostname === "addons.mozilla.org" || location.hostname.endsWith(".addons.mozilla.org")) || (location.hostname === "addons-dev.allizom.org" || location.hostname.endsWith(".addons-dev.allizom.org")) || (location.hostname === "addons.mozilla.org." || location.hostname.endsWith(".addons.mozilla.org.")) || location.href.startsWith("https://addons.mozilla.org./") || new RegExp("^(?:https://web.archive.org/web/.*/https://addons.mozilla.org/.*)\$").test(location.href)) {
  css += `
  /* NEW DESIGN TEST - OLD (new165)  */

  /* (new158) A - NO SCREENSHOTS + NO DESCRITION
  https://addons.mozilla.org/en-US/firefox/addon/back-to-top-for-firefox-we/
  === */
  .Page.Page-not-homepage:not(:has(.ScreenShots)) {
      display: inline-block !important;
      float: none!important;
      flex-direction: unset !important;
      gap: unset !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 91.4vh !important;
  /*border: 1px solid green !important;*/
  }
  .Page.Page-not-homepage:not(:has(.ScreenShots)) .Addon.Addon-extension  {
      display: inline-block !important;
      float: none!important;
      flex-direction: unset !important;
      gap: unset !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 91.4vh !important;
  /*border: 1px solid aqua !important;*/
  }
  .Page.Page-not-homepage:not(:has(.ScreenShots)) .Addon.Addon-extension .Addon-details {
      display: block !important;
      float: right !important;
      flex-direction: unset !important;
      gap: unset !important;
      width: 100% !important;
      min-width: 79% !important;
      max-width: 79% !important;
  /*border: 1px solid violet !important;*/
  }
  .Addon-details > .Addon-main-content .Card.Addon-description-rating-card:not(:has(.AddonDescription-contents)) > .Card-contents {
      display: block !important;
      float: right !important;
      flex-direction: unset !important;
      gap: unset !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 20vh !important;
  /*border: 1px solid violet !important;*/
  }
  .Addon-details > .Addon-main-content .Card.Addon-description-rating-card:not(:has(.AddonDescription-contents)) > .Card-contents:before {
      content: "No description" !important;
      display: block !important;
      float: right !important;
      flex-direction: unset !important;
      gap: unset !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 18vh !important;
      line-height: 15vh !important;
      font-size: 30px  !important;
      text-align: center !important;
  /*border: 1px solid violet !important;*/
  }

  /* (new165) OLD FIRST - A VOIR */
  .Addon-main-content .Card.Addon-description-rating-card:not(:has(.AddonDescription-contents)) > .Card-contents .Card.Addon-overall-rating .Card-contents .AddonReviewCard.RatingManager-AddonReviewCard.AddonReviewCard-ratingOnly.AddonReviewCard-viewOnly.AddonReviewCard-slim:has(.Card.ShowMoreCard.UserReview-body.UserReview-emptyBody.ShowMoreCard--expanded):not(:hover) {
      display: inline-block !important;
      width: 100% !important;
      min-width: 20% !important;
      max-width: 20% !important;
      margin: -7.5vh 0 0 30px !important;
  border: 1px solid violet !important;
  }
  /* (new165) OLD FIRST - A VOIR */
  .Addon-main-content .Card.Addon-description-rating-card:not(:has(.AddonDescription-contents)) > .Card-contents .Card.Addon-overall-rating .Card-contents .AddonReviewCard.RatingManager-AddonReviewCard.AddonReviewCard-ratingOnly.AddonReviewCard-viewOnly.AddonReviewCard-slim:has(.Card.ShowMoreCard.UserReview-body.UserReview-emptyBody.ShowMoreCard--expanded):not(:hover) button[class*="AddonReviewCard-"]  {
      font-size:  0 !important;
  }
  /* (new165) OLD FIRST - A VOIR */
  .Addon-main-content .Card.Addon-description-rating-card:not(:has(.AddonDescription-contents)) > .Card-contents .Card.Addon-overall-rating .Card-contents .AddonReviewCard.RatingManager-AddonReviewCard.AddonReviewCard-ratingOnly.AddonReviewCard-viewOnly.AddonReviewCard-slim:has(.Card.ShowMoreCard.UserReview-body.UserReview-emptyBody.ShowMoreCard--expanded):not(:hover) button[class*="AddonReviewCard-"]:before  {
      content: "x" !important;
      font-size:  15px !important;
  }
  /* (new165) OLD FIRST - A VOIR */
  /* WRITE */
  .Addon-main-content .Card.Addon-description-rating-card:not(:has(.AddonDescription-contents)) > .Card-contents .Card.Addon-overall-rating .Card-contents .AddonReviewCard.RatingManager-AddonReviewCard.AddonReviewCard-ratingOnly.AddonReviewCard-viewOnly.AddonReviewCard-slim:has(.Card.ShowMoreCard.UserReview-body.UserReview-emptyBody.ShowMoreCard--expanded):not(:hover) button[class*="AddonReviewCard-writeReviewButton"]:before  {
      content: "✍" !important;
      font-size: 20px !important;
  }
  /* (new165) OLD FIRST - A VOIR */
  /* DELETE */
  .Addon-main-content .Card.Addon-description-rating-card:not(:has(.AddonDescription-contents)) > .Card-contents .Card.Addon-overall-rating .Card-contents .AddonReviewCard.RatingManager-AddonReviewCard.AddonReviewCard-ratingOnly.AddonReviewCard-viewOnly.AddonReviewCard-slim:has(.Card.ShowMoreCard.UserReview-body.UserReview-emptyBody.ShowMoreCard--expanded):not(:hover) button[class*="AddonReviewCard-delete"]:before  {
      content: "🗑" !important;
      color: white !important;
      font-size:  20px !important;
  }
  /* (new165) OLD FIRST - A VOIR */
  /* HOVER */
  .Addon-main-content .Card.Addon-description-rating-card:not(:has(.AddonDescription-contents)) > .Card-contents .Card.Addon-overall-rating .Card-contents .AddonReviewCard.RatingManager-AddonReviewCard.AddonReviewCard-ratingOnly.AddonReviewCard-viewOnly.AddonReviewCard-slim:has(.Card.ShowMoreCard.UserReview-body.UserReview-emptyBody.ShowMoreCard--expanded):hover {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: -7.5vh 0 0 30px !important;
  border: 1px solid violet !important;
  }

  /* (new165) OLD FIRST - A VOIR */
  .Addon-main-content .Card.Addon-description-rating-card:not(:has(.AddonDescription-contents)) > .Card-contents .Card.Addon-overall-rating .Card-contents .AddonReviewCard.RatingManager-AddonReviewCard.AddonReviewCard-ratingOnly.AddonReviewCard-viewOnly.AddonReviewCard-slim:has(.ConfirmationDialog.AddonReviewCard-confirmDeleteDialog)  {
      position: absolute !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 18vh !important;
      margin: -8vh 0 0 30px !important;
      padding: 0 0 0 0 !important;
  }

  /* (new165) OLD FIRST - A VOIR */
  /* (new157) A - NO SCREEN SHOTS 
  https://addons.mozilla.org/fr/firefox/addon/unlock-keyboard-mouse/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=collection
  === */
  .Addon-main-content:not(:has(.ScreenShots)) {
    grid-area: unset !important;
    display: inline-block !important;
    min-width: 100% !important;
    max-width: 100% !important;
    height: 565px !important;
    margin-left: 2px !important;
    padding: 3px !important;
    overflow: hidden !important;
    border-radius: 9px !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }
  /* (new165) OLD FIRST - A VOIR */
  html .Page-amo .Page-content .Addon.Addon-extension > div:not(:has(.ScreenShots)) .Addon-main-content .Card.ShowMoreCard.AddonDescription {
      display: block !important;
      float: left !important;
      flex-direction: unset !important;
      gap: unset !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      min-height: 39.5vh !important;
      max-height: 39.5vh !important;
  /*border: 1px solid blue !important;*/
  }
  /* (new165) OLD FIRST - A VOIR */
  html .Page-amo .Page-content .Addon.Addon-extension > div:not(:has(.ScreenShots)) .Addon-main-content .Card.ShowMoreCard.AddonDescription .ShowMoreCard-contents {
      display: inline-block !important;
      width: 100% !important;
      min-height: 33.5vh !important;
      max-height: 33.5vh !important;
      overflow: hidden !important;
  }

  /* (new165) OLD FIRST - A VOIR */
  /* (new161) RIGHT - OTHERS RECOMM ADDONS - HORIZONTAL */
  html .Page-amo .Page-content .Addon.Addon-extension > div:not(:has(.ScreenShots)) .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal {
      position: absolute !important;
      display: inline-block !important;
      min-width: 99% !important;
      min-height: 17.5vh !important;
      max-height: 17.5vh !important;
      top: 41.5vh !important;
      right: 10px  !important;
      overflow: hidden auto !important;
  /*border: 1px dashed green!important;*/
  }



  /* (new165) OLD FIRST - A VOIR */
  /* (new161) RIGHT PANEL - WITH HORIZONTAL OTHERS RECOMM ADDON */
  html .Page-amo .Page-content .Addon.Addon-extension > div:has(.ScreenShots) .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal {
      position: absolute !important;
      display: inline-block !important;
      min-width: 62% !important;
      max-width: 62% !important;
      min-height: 17.5vh !important;
      max-height: 17.5vh !important;
      top: 42vh !important;
      right: 10px  !important;
      overflow: hidden auto !important;
  /*border: 1px dashed green!important;*/
  }



  /* (new167) ADDON - REPORT ABUSE - .AddonReportAbuseLink--preview */
  .Page-amo .Page-content .Addon.Addon-extension .Card.AddonMoreInfo .AddonReportAbuseLink  {
      position: fixed !important;
      display: inline-block !important;
      width: 12% !important;
      height: 2.2vh !important;
      line-height: 1.5vh !important;
      left: 0.1% !important;
      top: 90vh !important;
      margin: 0 0 0 0 !important;
      padding: 0 2px 0 40px !important;
      border-radius: 9px;
      overflow: hidden;
      transform: scale(0.7) rotate(-90deg)!important;
      transform-origin: top left;
      z-index: 1000 !important;
      opacity: 1 !important;
  background: #A33434 !important;
  border: 1px solid #283046 !important;  
  }
  /* (new167) ADDON - REPORT ABUSE - HOVER */
  .Page-amo .Page-content .Addon.Addon-extension .Card.AddonMoreInfo .AddonReportAbuseLink:hover {
      line-height: 1.5vh !important;
      left: 0.2% !important;
      opacity: 1 !important;
      z-index: 1 !important;
      transform: scale(1) rotate(-90deg)!important;
      transform-origin: top left;
      visibility: visible !important;
  }

  .Page-amo .Page-content .Addon.Addon-extension .Card.AddonMoreInfo .AddonReportAbuseLink:before {
      content: "⚑"  !important;
      position: absolute !important;
      display: inline-block !important;
      width: 20px !important;
      height: 2vh !important;
      line-height: 1.5vh !important;
      left: 3px !important;
      border-radius: 5px  !important;
      text-align: center !important;
      opacity: 0.5 !important;
      z-index: 1 !important;
      transform: scale(1.7) !important;
      visibility: visible !important;
  color: white !important;
  background: red !important;
  border: 1px solid #283046 !important; 
  }
  .Page-amo .Page-content .Addon.Addon-extension .Card.AddonMoreInfo .AddonReportAbuseLink:hover:before {
      content: "⚑"  !important;
      position: absolute !important;
      display: inline-block !important;
      width: 25px !important;
      height: 3vh !important;
      line-height: 1.9vh !important;
      left: 0 !important;
      border-radius: 5px  !important;
      text-align: center !important;
      font-size: 10px !important;
      opacity: 1 !important;
      z-index: 1 !important;
      transform: scale(1.7) !important;
      visibility: visible !important;
  color: white !important;
  background: green !important;
  border: 1px solid #283046 !important; 
  }

  .Page-amo .Page-content .Addon.Addon-extension .Card.AddonMoreInfo .AddonReportAbuseLink a {
      color: white !important;
  }





  /* (new157) RIGHT - ADDON DESCRIPTION */
  .Card.Addon-description-rating-card.Card--no-header.Card--no-footer {
      display: block !important;
      float: left !important;
      flex-direction: unset !important;
      gap: unset !important;
      width: 37% !important;
      height: 100vh !important;
  /*border: 1px solid aqua !important;*/
  }



  /* (new154) ADDON - MORE ADDON BY AUTHOR - LEFT - BADGE RECOMM */
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--no-footer .Badge.Badge-border[data-testid="badge-recommended"]:not(:hover)   {
      position: absolute !important;
      display: inline-block !important;
      width: auto !important;
      margin: -3vh 0% 0px -15% !important;
      transform: scale(0.7) !important;
      color: white  !important;
  background: #111 !important;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--no-footer .Badge.Badge-border[data-testid="badge-recommended"]:not(:hover)  a.Badge-link span.Badge-content.Badge-content--small {
      display: none !important;
  }
  /* HOVER */
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--no-footer .Badge.Badge-border[data-testid="badge-recommended"]:hover {
      position: absolute !important;
      display: inline-block !important;
      width: auto !important;
      margin: -3.8vh 0 0px -12% !important;
      transform: scale(0.7) !important;
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--no-footer:hover span.Badge-content.Badge-content--small {
      color: white  !important;
  }

  /* (new154) ADDON - MORE ADDON RIGHT - BADGE RECOMM */
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--no-footer .Badge.Badge-border[data-testid="badge-recommended"] ,
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--no-footer .Badge.Badge-border[data-testid="badge-recommended"] {
      position: absolute !important;
      display: inline-block !important;
      width: auto !important;
      margin: -3vh 0% 0px 0% !important;
      transform: scale(0.7) !important;
      color: white  !important;
  background: #111 !important;
  }
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--no-footer .Badge.Badge-border[data-testid="badge-recommended"]:not(:hover) span.Badge-content.Badge-content--small {
      display: none !important;
  }
  /* HOVER */
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--no-footer .Badge.Badge-border[data-testid="badge-recommended"] {
      position: absolute !important;
      display: inline-block !important;
      width: auto !important;
      margin: -3.8vh 0 0px -18% !important;
      transform: scale(0.7) !important;
  }
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--no-footer .Badge.Badge-border[data-testid="badge-recommended"]:hover span.Badge-content.Badge-content--small {
      color: white  !important;
  }

  /* (new165) OLD FIRST - A VOIR */
  /* (new154) ADDON - MORE ADDON RIGHT - BADGE RECOMM [WITH SCREENSHOT] */
  /*.Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--no-footer .Badge.Badge-border[data-testid="badge-recommended"] ,*/
  .Page-amo .Page-content .Addon.Addon-extension > .Addon-main-content:not(:has(.Card.Addon-screenshots)) .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal .Badge.Badge-border[data-testid="badge-recommended"] {
      position: absolute !important;
      display: inline-block !important;
      width: auto !important;
      margin: -3vh 0% 0px -20% !important;
      transform: scale(0.7) !important;
      color: white  !important;
  background: #111 !important;
  }




  /* (new153) FOOTER FIXED - === */
  .Footer .Footer-wrapper {
      position: fixed !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: auto !important;
      max-height: 4vh !important;
      margin: 0 0 0 0 !important;
      bottom: -5vh !important;
      padding: 5px 20px 0 20px !important;
      border-radius: 9px 9px 0 0;
  background: rgb(2, 16, 55) !important;
  border: 1px solid silver !important;
  }
  .Footer .Footer-wrapper:hover {
      position: fixed !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: auto !important;
      max-height: 45vh !important;
      margin: 0 0 0 0 !important;
      bottom: 0 !important;
      padding: 5px 20px 0 20px !important;
      border-radius: 9px 9px 0 0;
  background: rgb(2, 16, 55) !important;
  border: 1px solid silver !important;
  }
  .Footer .Footer-wrapper:not(:hover) .Footer-mozilla-link-wrapper {
      position: fixed !important;
      display: inline-block !important;
      grid-area: unset !important;
      width: 100% !important;
      min-width: 6.5% !important;
      max-width: 6.5% !important;
      height: 4vh !important;
      right: 0 !important;
      margin: -5vh 0 0 0 !important;
      padding: 3px 5px 0 5px !important;
  /*background: lime !important;*/
  /*border: 1px solid yellow !important;*/
  }
  /* HOVER */
  .Footer .Footer-wrapper:hover .Footer-mozilla-link-wrapper {
      position: fixed !important;
      display: inline-block !important;
      grid-area: unset !important;
      width: 100% !important;
      min-width: 6.5% !important;
      max-width: 6.5% !important;
      height: 4vh !important;
      right: 0 !important;
      margin: 0vh 0 0 0 !important;
      padding: 3px 5px 0 5px !important;
  /*background: lime !important;*/
  /*border: 1px solid yellow !important;*/
  }


  section[class^="Footer-"]:not(.Footer-language-picker) {
      display: block;
      float: right !important;
      grid-area: unset !important;
      width: 100% !important;
      min-width: 80% !important;
      max-width: 80% !important;
      height: 6vh !important;
  /*background: brown !important;*/
  border-bottom: 1px solid silver !important;
  }
  /* LARGE */
  section[class^="Footer-"].Footer-amo-links:not(.Footer-language-picker) {
    display: block;
    float: right !important;
    grid-area: unset !important;
    width: 100% !important;
    min-width: 80% !important;
    max-width: 80% !important;
    height: auto !important;
    border-bottom: 1px solid silver !important;
  }
  section[class^="Footer-"]:not(.Footer-language-picker) > h4 {
      display: block;
      float: left !important;
      width: 100% !important;
      min-width: 98% !important;
      max-width: 98% !important;
      margin: 0px 10px 0 15px !important;
      padding:  0 0 0 20px !important;
  color: silver !important;
  /*background: peru !important;*/
  }
  section[class^="Footer-"]:not(.Footer-language-picker) > h4 a {
      display: block;
      float: left !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
  color: peru!important;
  /*background: green !important;*/
  }
  section[class^="Footer-"]:not(.Footer-language-picker) > ul > li {
      display: block;
      float: left !important;
      margin: 0px 10px 0 5px !important;
      padding:  0 0 0 20px !important;
  }


  .Footer .Footer-wrapper .Footer-legal-links {
      display: block;
      float: none !important;
      grid-area: unset !important;
      width: 100% !important;
      min-width: 18% !important;
      max-width: 18% !important;
      height: auto !important;
      padding:  0 0 0 10px !important;
  /*background: gold !important;*/
  /*border: 1px solid yellow !important;*/
  }
  .Footer .Footer-wrapper p.Footer-copyright {
      display: block;
      float: none !important;
      grid-area: unset !important;
      width: 100% !important;
      min-width: 18% !important;
      max-width: 18% !important;
      height: auto !important;
      padding:  5px 0 5px 10px !important;
      font-size: 10px !important;
  /*background: pink !important;*/
  /*border: 1px solid yellow !important;*/
  }

  /* (new124) FOOTER - LANGUAGE PICKER - === */
  .Footer-language-picker {
      position: fixed !important;
      display: inline-block !important;
      width: 222px !important;
      top: -8px;
      right: 0;
  }


  /* (new154) === COLOR  */
  .DropdownMenuItem.DropdownMenuItem-link.DropdownMenuItem--detached.Header-logout-button {
      text-align: center !important;
      border: 1px solid silver !important;
  }
  .DropdownMenuItem.DropdownMenuItem-link.DropdownMenuItem--detached.Header-logout-button button {
      color: peru !important;
  /*background: pink !important;*/
  }


  /* ==== END  ==== */
  `;
}
if ((location.hostname === "addons.mozilla.org" || location.hostname.endsWith(".addons.mozilla.org")) || (location.hostname === "addons-dev.allizom.org" || location.hostname.endsWith(".addons-dev.allizom.org")) || location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* 2nd NEW DESIGN */

  /* (new165) OLD FIRST - A VOIR */
  /*(new165) ==== ADDON INFOS PAGES  ==== 
   .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer .Card-contents
  === */
  .Page-amo .Page-content:not(:has(.Home)) {
      display: inline-block !important;
      height: 100% !important;
      min-height: 92.3vh !important;
      max-height: 92.3vh !important;
      overflow: hidden !important;
      padding: 0 0 0 0px !important;
  /*border: 1px solid aqua  !important;*/
  }
  .Page-amo .Page-content:not(:has(.Home)) .Page.Page-not-homepage .Addon.Addon-extension {
      height: 100% !important;
      min-height: 92.3vh !important;
      max-height: 92.3vh !important;
      margin: 0 0 0 0 !important;
      padding: 0 !important;
  /*border: 1px solid pink  !important;*/
  }
  .Page-amo .Page-content:not(:has(.Home)) .Page.Page-not-homepage .Card.Addon-content.Card--photon.Card--no-header.Card--no-footer > .Card-contents {
      height: 100% !important;
      min-height: 92.3vh !important;
      max-height: 92.3vh !important;
      margin: 0 0 0 0 !important;
  /*padding: 0 !important;*/
  /*border: 1px solid pink  !important;*/
  }



  /* (new165) OLD FIRST - A VOIR */
  /* (new159) ADDON - LEFT PANEL - .Addon--has-more-than-0-addons*/
  /*.Addon.Addon-extension > div:not(.Addon-details) {
      display: block !important;
      float: left !important;
      flex-direction: unset !important;
      gap: unset !important;
      width: 100% !important;
      min-width: 21vw !important;
      max-width: 21vw !important;
      height: 100vh !important;
  border: 1px solid aqua !important;
  }*/
  .Addon.Addon-extension > .Card-contents {
      display: inline-block !important;
      flex-direction: unset !important;
      gap: unset !important;
  }

  /* (new165) LEFT - TOP HEADER INFO - CONTAINER */
  section.Card.Addon-content.Card--photon.Card--no-header.Card--no-footer .Card-contents .Addon-header {
      position: absolute !important;
      display: inline-block !important;
      grid-template: unset !important;
      min-height: 43vh !important;
      max-height: 43vh !important;
      width: 21.1% !important;
      margin: 0vh 0 0 0px !important;
      padding: 5px 10px  !important;
      border-radius: 9px !important;
  /*background: brown !important;*/
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  /*border: 1px dashed yellow !important;*/
  }

  /* LEFT - TOP HEADER INFO - TITLE + ICON */
  .Addon.Addon-extension .Card-contents .Addon-header .Addon-icon-wrapper {
      position: absolute !important;
      display: inline-block !important;
      height: 62px !important;
      width: 58px !important;
      margin: 0 0 0 0 !important;
      padding: 3px 0 0 4px !important;
      overflow: hidden;
      z-index: 50000 !important;
  }
  .Addon.Addon-extension .Card-contents .Addon-header .Addon-icon-wrapper .Addon-icon-image {
      height: 3.5vh !important;
      width: 65% !important;
      object-fit: contain !important;
  }

  /* (new171) LEFT - TOP HEADER INFO - TOP SHORT INFO  */
  .Addon.Addon-extension .Card-contents .Addon-header .Addon-info {
      position: relative !important;
      display: inline-block !important;
      grid-area: unset !important;
      width: 100% !important;
      min-height: 28.6vh !important;
      max-height: 28.6vh !important;
      border-radius: 9px 9px 0 0  !important;
  background: rgb(30, 36, 52) !important;
  /*border: 1px dashed yellow !important;*/
  }
  .Addon.Addon-extension .Card-contents .Addon-header .Addon-info .AddonTitle {
      position: relative !important;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      grid-column: unset !important;
      width: 100% !important;
      min-height: 5vh !important;
      max-height: 5vh !important;
      line-height: 2.2vh !important;
      margin: 0;
      padding: 0 0 2px 15% !important;
      font-size: 21px;
      overflow: hidden !important;
  color: white !important;
  }

  .Addon.Addon-extension .Card-contents .Addon-header .Addon-info .AddonTitle span.AddonTitle-author{
      position: fixed !important;
      display: inline-block !important;
      width: 19.7% !important;
      height: 2vh !important;
      line-height: 2vh !important;
      left:  1.5% !important;
      top: 14.5vh !important;
      text-align: right !important;
      padding: 0 30px 0 0px !important;
  }

  /* (new171) LEFT - TOP HEADER INFO - BADGE FIREFOX =
  https://addons.mozilla.org/fr/firefox/addon/multi-account-containers/
  */
  .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge.Badge--has-link:has(.Badge-link .Icon-line){
      position: absolute !important;
      display: inline-block !important;
      height: 2.2vh !important;
      line-height: 2.2vh !important;
      left:  0% !important;
      top: -2vh !important;
      padding: 0 5px 0 5px !important;
      font-size: 15px !important;
      transform: scale(0.8) !important;
  }
  .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge.Badge--has-link:has(.Badge-link .Icon-line) a {
      height: 2vh !important;
      line-height: 2vh !important;
      padding: 0 0px 0 0px !important;
      font-size: 15px !important;
  }

  /* SUMMARY */
  .Addon.Addon-extension .Card-contents .Addon-header .Addon-info .Addon-summary {
      position: absolute !important;
      display: inline-block !important;
      width: 93.2% !important;
      min-height: 18vh !important;
      max-height: 18vh !important;
      margin: 0vh 0 -5vh 0 !important;
      top: 9.9vh !important;
      left: 1.35% !important;
      padding: 0.5vh 5px 0 10px !important;
      font-size: 16px;
      overflow: hidden auto !important;
  background: rgb(30, 36, 52) !important;
  /*border: 1px solid rgba(12, 12, 13, 0.9) !important;*/
  /*border: 1px dashed peru !important;*/
  }

  /* (new165) LEFT - ADDON / THEMES - INSTALL BUTTON */
  .Addon.Addon-extension .Card-contents .Addon-header .Addon-install {
      position: fixed !important;
      display: inline-block !important;
      float: none !important;
      min-width: 20% !important;
      max-width: 20% !important;
      height: 4vh !important;
      line-height: 4vh !important;
      left: 1.35% !important;
      top: 38vh !important;
      border-radius: 0 0 9px 9px !important;
  background: rgb(30, 36, 52) !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  /*background: gold !important;*/
  /*border: 1px solid blue !important;*/
  }
  .Addon.Addon-extension .Card-contents .Addon-header .Addon-install:has(.AMInstallButton) .InstallButtonWrapper ,
  .Addon.Addon-extension .Card-contents .Addon-header .Addon-install .InstallButtonWrapper, 
  .Addon.Addon-extension .Card-contents .Addon-header .Addon-install .InstallButtonWrapper .GetFirefoxButton {
      display: inline-block !important;
      flex-direction: unset !important;
      min-width: 38.1% !important;
      max-width: 38.1% !important;
      margin:  0 0 0 50.2% !important;
  }


  /* (new165) LEFT - ADDON /THEME - LEFT PANEL - ADDON INFO - BADGE A VOIR */
  .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-header .AddonBadges .Badge:not([data-testid="badge-recommended"], [data-testid="badge-line"], [data-testid="badge-experimental-badge"], [data-testid="badge-android"]) ,
  .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge:not([data-testid="badge-recommended"], [data-testid="badge-line"], [data-testid="badge-experimental-badge"], [data-testid="badge-android"]) {
      position: relative !important;
      display: inline-block !important;
      width: 55% !important;
      min-height: 4vh !important;
      max-height: 4vh !important;
      margin: 0vh -70px 0 -20px !important;
      top: -2.8vh !important;
      opacity: 1 !important;
  color: white !important;
  background: rgb(17, 39, 102);
  border:  none !important;
  }
  .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-header .AddonBadges .Badge:not([data-testid="badge-recommended"], [data-testid="badge-line"], [data-testid="badge-experimental-badge"], [data-testid="badge-android"]) .Badge-content ,
  .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge:not([data-testid="badge-recommended"], [data-testid="badge-line"], [data-testid="badge-experimental-badge"], [data-testid="badge-android"]) .Badge-content {
      color: white !important;
  }


  /* (new167) ADDON /THEME - LEFT PANEL - ADDON INFO - BADGE RECOMMENDED */
  .Page-amo .Page-not-homepage .Addon.Addon-statictheme.Addon-theme Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-recommended"] ,
  .Page-amo .Page-not-homepage .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-recommended"] {
      position: absolute !important;
      display: inline-block !important;
      width: 70% !important;
      min-height: 3.2vh !important;
      max-height: 3.2vh !important;
      margin: 0vh 0 0 0% !important;
      padding: 0px 0 0px 0px !important;
      top: -2.1vh !important;
      left: -13% !important;
      opacity: 1 !important;
  background: red  !important;
  border: none !important;
  /*border: 1px dashed lime !important;*/
  }
  .Page-amo .Page-not-homepage .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-recommended"] a  ,
  .Page-amo .Page-not-homepage .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-recommended"] a {
      min-height: 3.2vh !important;
      max-height: 3.2vh !important;
      padding: 1px 0px 1px 5px !important;
      border-radius: 9px !important;
  color: white !important;
  background: green  !important;
  }
  .Page-amo .Page-not-homepage .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-recommended"] a .Icon,
  .Page-amo .Page-not-homepage .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-recommended"] a .Icon {
      filter: invert(38%) saturate(481%) hue-rotate(40deg) brightness(202%) contrast(93%) !important;
  }


  /* (new167) ADDON /THEME - LEFT PANEL - ADDON INFO - BADGE RECOMMENDED */
  .Page-amo .Page-not-homepage .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-experimental-badge"] {
      position: absolute !important;
      display: inline-block !important;
      width: 100% !important;
      min-height: 3.2vh !important;
      max-height: 3.2vh !important;
      margin: 0vh 0 0 0% !important;
      padding: 0px 0 0px 0px !important;
      top: -2.1vh !important;
      left: 20% !important;
      opacity: 1 !important;
  background: gold  !important;
  border: none !important;
  border: 1px dashed lime !important;
  }
  .Page-amo .Page-not-homepage .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-experimental-badge"] span.Icon.Icon-experimental-badge.Badge-icon  {
      min-height: 3.2vh !important;
      max-height: 3.2vh !important;
      margin: 0vh 0 0 8px !important;
      padding: 1px 0px 1px 5px !important;
      border-radius:  9px 0 0 9px !important;
  filter: invert(38%) saturate(481%) hue-rotate(40deg) brightness(202%) contrast(93%) !important;
  }

  .Page-amo .Page-not-homepage .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-experimental-badge"] span.Icon.Icon-experimental-badge.Badge-icon + span.Badge-content.Badge-content--large {
      display: block !important;
      float: right !important;
      min-width: 88% !important;
      max-width: 88% !important;
      min-height: 2.8vh !important;
      max-height: 2.8vh !important;
      line-height: 3.2vh !important;
      margin: -3.2vh 5px 0 0px !important;
      padding: 0px 10px 1px 4px !important;
      font-size: 15px !important;
      text-wrap: nowrap !important;
      border-radius: 0 5px 5px 0!important;
  color: white !important;
  background: rgb(17, 39, 102) !important;
  }




  /* (new165) LEFT - ADDON /THEME - LEFT PANEL - ADDON INFO - BADGE ANDROID  - .Addon.Addon-extension > div:not(.Addon-details) .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-android"] .Badge-content */
  .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-android"], 
  .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-android"] {
      position: absolute !important;
      display: inline-block !important;
      min-width: 100% !important;
      max-width: 100% !important;
      min-height: 3.4vh !important;
      max-height: 3.4vh !important;
      margin: 0vh 0 0 0% !important;
      top: -2.5vh !important;
      left: 88% !important;
      padding: 1px 3px 1px 1px !important;
      border-radius:  5px 5px  0 0 !important;
      opacity: 1 !important;
  background: green  !important;
  border: none !important;
  }
  .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-android"] span.Badge-content.Badge-content--large ,
  .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-android"] span.Badge-content.Badge-content--large  {
      display: inline-block !important;
      width: 87% !important;
      min-height: 3.2vh !important;
      max-height: 3.2vh !important;
      line-height: 3.2vh !important;
      margin: 0vh 0 0 50px !important;
      padding: 1px 10px 1px 4px !important;
      font-size: 15px !important;
      border-radius: 0 5px 5px 0!important;
  color: white !important;
  background: rgb(17, 39, 102) !important;
  }
  .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-android"] .Icon.Icon-android ,
  .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-android"] .Icon.Icon-android {
      position: absolute !important;
      display: inline-block !important;
      min-height: 3.2vh !important;
      max-height: 3.2vh !important;
      width: 40px !important;
      left: 5px !important;
      filter: unset !important;
  }


  /* (new165) LEFT - ADDON / THEMES - NUMBER OF USERS */
  .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-user-fill"] {
      position: fixed !important;
      display: inline-block !important;
      width: 18.2% !important;
      min-height: 5vh !important;
      max-height: 5vh !important;
      line-height: 5vh !important;
      margin: 0vh 0 0 0% !important;
      top: 41.6vh !important;
      left: -2.3% !important;
      padding: 5px 0 5px 15px !important;
      opacity: 1 !important;
      z-index: 5000 !important;
  background: rgb(30, 36, 52) !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }

  .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-user-fill"] span.Icon.Icon-user-fill.Badge-icon ,
  .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-user-fill"] span.Icon.Icon-user-fill.Badge-icon {
      height: 4vh !important;
      width: 24px;
      margin: 0 0 0 5px !important;
  }
  .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-user-fill"] .Badge-content.Badge-content--large ,
  .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-user-fill"] .Badge-content.Badge-content--large {
      display: block !important;
      float: right !important;
      width: 100% !important;
      min-height: 2vh !important;
      max-height: 2vh !important;
      line-height: 1.5vh !important;
      margin: -2.8vh 5px 0vh 0px !important;
      top: 0vh !important;
      padding: 0 0 0 45px !important;
      font-size: 19px !important;
      text-align: left !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      opacity: 1 !important;
  color: white !important;
  /*background: gold !important;*/
  /*border: 1px solid red !important;*/
  }


  /* (new165) LEFT - ADDON - NUMBER OF STARS / REVIEWS */
  .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-star-full"] {
      position: fixed !important;
      display: inline-block !important;
      width: 14.9% !important;
      min-height: 5vh !important;
      max-height: 5vh !important;
      line-height: 5vh !important;
      margin: 0vh 0 0 0% !important;
      top: 41.6vh !important;
      left: 9.5% !important;
      padding: 0 0 0 15px !important;
      opacity: 1 !important;
      z-index: 5000 !important;
  background: rgb(30, 36, 52) !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }
  .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-star-full"] .Badge-content.Badge-content {
      display: block !important;
      float: right !important;
      width: 100% !important;
      min-height: 4.5vh !important;
      max-height: 4.5vh !important;
      line-height: 4.8vh !important;
      margin: 0vh 5px 0vh 0px !important;
      top: -0.2vh !important;
      font-size: 19px !important;
      text-align: left !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      opacity: 1 !important;
  color: white !important;
  /*background: gold !important;*/
  /*border: 1px solid red !important;*/
  }

  /* (new165) ADDON / THEME - REVIEWS LINKS */
  .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-header .AddonBadges .Badge:not([data-testid="badge-recommended"], [data-testid="badge-line"], [data-testid="badge-experimental-badge"], [data-testid="badge-android"]) a.Badge-link[href*="/reviews/"] .Badge-content  ,
  .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge:not([data-testid="badge-recommended"], [data-testid="badge-experimental-badge"], [data-testid="badge-android"]) a.Badge-link[href*="/reviews/"] .Badge-content {
      color: peru !important;
  }
  .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-header .AddonBadges .Badge:not([data-testid="badge-recommended"], [data-testid="badge-line"], [data-testid="badge-android"]) a.Badge-link[href*="/reviews/"]:visited .Badge-content ,
  .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge:not([data-testid="badge-recommended"], [data-testid="badge-experimental-badge"], [data-testid="badge-android"]) a.Badge-link[href*="/reviews/"]:visited .Badge-content {
      color: tomato !important;
  }

  /* SVG - FILTER BLACK to GREEN ? */
  .Badge-icon--large {
      filter: invert(15%) saturate(6481%) hue-rotate(46deg) brightness(102%) contrast(43%) !important;
  }

  .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge:not([data-testid="badge-recommended"], [data-testid="badge-experimental-badge"], [data-testid="badge-android"]) a.Badge-link[href*="/reviews/"]  span.Icon.Icon-star-full.Badge-icon.Badge-icon--large {
    height: 3vh !important;
    width: 30px !important;
  }

  /* LEFT / RIGHT - RATING / DESCRIPTION */
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension section.Card.Addon-content.Card--photon.Card--no-header.Card--no-footer .Addon-description-and-ratings {
      display: inline-block !important;
      height: 0 !important;
      padding: 0 !important;
  /*background: brown !important;*/
  }






  /* (new165) OLD FIRST - A VOIR */
  /* (new150) REWIEW -- INDICATOR 
  === */
  .Page-amo .Page-content .Addon.Addon-extension > section.Card.Addon-overall-rating .RatingManager form[action] +.AddonReviewCard.RatingManager-AddonReviewCard.AddonReviewCard-viewOnly.AddonReviewCard-slim  {
      position: absolute !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 450px !important;
      max-width: 450px !important;
      left: -9% !important;
      margin: 0px 0 0 0 !important;
      top: 1.5vh !important;
      z-index: 500000 !important;
  background: peru !important;
  }
  /* (new151) ADDON - REVIEW MANAGER - === */
  .AddonReviewCard-slim.AddonReviewCard-viewOnly:not(.AddonReviewCard-ratingOnly):not(.AddonReviewCard-isReply) .AddonReviewCard-container {
      position: absolute;
      width: 42% !important;
      height: 2vh !important;
      left: 50% !important;
      top:2.3vh !important;
      padding: 0px 2px 0 18px !important;
      border-radius: 5px !important;
      overflow: hidden;
      z-index: 1 !important;
      transition: width ease 0.7s !important;
  border: 1px solid #283046 !important;
  background: #075251 !important;
  }
  /* (new152) - REVIEW COMMENT - first HOVER */
  .Card.Addon-overall-rating:hover .RatingManager form + .AddonReviewCard-slim.AddonReviewCard-viewOnly:not(.AddonReviewCard-ratingOnly):not(.AddonReviewCard-isReply) .AddonReviewCard-container {
      top: -2vh !important;
      margin: 0vh 0 0 !important;
      transition: all ease 0.7s !important;
      
  background: black !important;
  border: 1px solid red !important;
  }
  /* (new165) - REVIEW COMMENT - 2nd HOVER */
  .AddonReviewCard-slim.AddonReviewCard-viewOnly:not(.AddonReviewCard-ratingOnly):not(.AddonReviewCard-isReply) .AddonReviewCard-container:hover {
      width: 100% !important;
      height: auto !important;
      min-height: 50px !important;
      left: 50% !important;
      padding: 5px 5px 10px 15px !important;
      z-index: 500 !important;
      transition: all ease 0.7s !important;
  background: black !important;
  border: 1px solid red !important;
  }
  .AddonReviewCard-slim.AddonReviewCard-viewOnly:not(.AddonReviewCard-ratingOnly):not(.AddonReviewCard-isReply) .AddonReviewCard-container:hover .UserReview .Card.ShowMoreCard.UserReview-body .Card-contents  {
      height: auto !important;
      padding: 5px 10px 5px 10px !important;
      border-radius: 5px !important;
  border: 1px solid red !important;
  }
  .AddonReviewCard-slim.AddonReviewCard-viewOnly:not(.AddonReviewCard-ratingOnly):not(.AddonReviewCard-isReply) .AddonReviewCard-container:hover .UserReview .Card.ShowMoreCard.UserReview-body .Card-contents .ShowMoreCard-contents {
      min-height: 35vh !important;
      max-height: 35vh !important;
      padding: 5px 10px 5px 10px !important;
      border-radius: 0 !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  /*border: 1px solid green !important;*/
  }
  .AddonReviewCard-slim.AddonReviewCard-viewOnly:not(.AddonReviewCard-ratingOnly):not(.AddonReviewCard-isReply) .AddonReviewCard-container:hover .UserReview .Card.ShowMoreCard.UserReview-body .Card-contents .ShowMoreCard-contents div {
      border-bottom: 1px dotted aqua;
  }
  /* (new165) OLD FIRST - A VOIR */
  /* (new152) - REVIEW COMMENT - TITLE */
  .UserReview-byLine > span,
  .Addon.Addon-extension .UserReview-byLine > span ,
  .RatingManager form + .AddonReviewCard-slim.AddonReviewCard-viewOnly:not(.AddonReviewCard-ratingOnly):not(.AddonReviewCard-isReply) .AddonReviewCard-container .UserReview .UserReview-byLine span {
      position: absolute !important;
      display: inline-block !important;
      top: 0 !important;
      font-size: 10px !important;
  }
  .RatingManager form + .AddonReviewCard-slim.AddonReviewCard-viewOnly:not(.AddonReviewCard-ratingOnly):not(.AddonReviewCard-isReply) .AddonReviewCard-container .UserReview .UserReview-byLine span {
      position: absolute !important;
      display: inline-block !important;
      top: 0 !important;
      font-size: 10px !important;
  }
  /* (new165) OLD FIRST - A VOIR */
  /* (new151) - REVIEW COMMENT INDICATOR */
  .Addon.Addon-extension .UserReview-byLine > span a:after {
      position: absolute !important;
      display: inline-block !important;
      content: "🗨";
      width: 10px !important;
      height: 20px !important;
      line-height: 20px !important;
      top: -2px !important;
      left: -15px !important;
      font-size: 12px !important;
      white-space: pre !important;
  color: gold;
  }

  /* (new165) REVIEW ADDON INDICATOR */
  /* CLIP (need ABSOLUTE positioning):
  clip: (top, right, bottom, left)
  image:clip:rect(0px,60px,200px,0px);

  OR  CLIP-PATH  (NOT positioning need)
  clip-path: clip-path: rectangle(x, y, width, height, rounded-x, rounded-y)
  inset(TOP RIGHT BOTTOM LEFT
  clip-path: inset(0 0% 0 22%);
  === */
  .UserProfile-addons-and-reviews .UserReview-byLine > span a:before {
      content: attr(href);
      /* clip: rect(0px,0px,0px,50px) !important; */
      /* clip-path: inset(0px 20px 0px 78px) !important; */
      clip-path: inset(0 5% 0 22%);
      position: absolute !important;
      display: inline-block !important;
      height: 10px !important;
      line-height: 10px !important;
      width: 220px !important;
      margin-top: 0px !important;
      top: 0px !important;
      right: -11px !important;
      margin-bottom: 20px !important;
      padding-right: 20px !important;
      white-space: nowrap;
      font-size: 10px !important;
      text-align: left !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      z-index: 10 !important;
  /*   background-image:  linear-gradient( to right, red, #f06d06, rgb(255, 255, 0), green); */
  background-image: linear-gradient(to right, #000000, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 1));
  }
  .UserProfile-addons-and-reviews .UserReview-byLine > span a::after {
      /* background: rgba(0, 0, 0, 0) linear-gradient(hsla(0, 0%, 100%, 0), #fff) repeat scroll 0 0; */
      /* background-image:  linear-gradient( to right, red, #f06d06, rgb(255, 255, 0), green); */
      background-image: url("https://addons.cdn.mozilla.net/static/img/addon-icons/default-64.png"), linear-gradient(to left, black, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
      background-size: 10px 10px, 120px 10px;
      background-repeat: no-repeat, repeat;
      background-position: 55px top;
      content: "";
      position: absolute;
      height: 10px;
      width: 70px;
      top: 0px !important;
      right: 0;
      z-index: 20 !important;
  }

  /* (new150) RATING SUCESS */
  .RatingManagerNotice-savedRating {
      position: absolute !important;
      justify-content: unset !important;
      width: 100% !important;
      height: 2vh !important;
      line-height: 1.5;
      left: 0 !important;
      top: 5vh !important;
      padding: 0;
      z-index: 50000 !important;
  color: white !important;
  background-color: green !important;
  }
  .RatingManagerNotice-savedRating.RatingManagerNotice-savedRating-hidden .Notice-icon {
      display: block !important;
      float: left !important;
      height: 11px !important;
      width: 11px !important;
      background-size: 11px 11px;
  filter: invert(15%) saturate(6481%) hue-rotate(46deg) brightness(102%) contrast(43%) !important;
  }


  /* (new166) AFER ADDING NOTE - SUPP NOTE  / ADD REVIEW - VIEW ON HOVER:
  .RatingManager form + .AddonReviewCard.RatingManager-AddonReviewCard.AddonReviewCard-ratingOnly.AddonReviewCard-viewOnly.AddonReviewCard-slim
  === */
  .AddonReviewCard.RatingManager-AddonReviewCard.AddonReviewCard-ratingOnly.AddonReviewCard-viewOnly.AddonReviewCard-slim {
      display: inline-block !important;
      left: 1.5% !important;
      width: 100% !important;
      height: 5vh !important;
      top: 0vh !important;
      margin:  -3vh 0 1vh 0 !important;
      padding: 5px;
      border-radius: 5px !important;
      overflow: hidden auto;
      z-index: 5000 !important;
  background: red !important;
  }

  .RatingManager > form + .AddonReviewCard.RatingManager-AddonReviewCard.AddonReviewCard-ratingOnly.AddonReviewCard-viewOnly.AddonReviewCard-slim .AddonReviewCard-allControls {
      float: left !important;
      width: 93% !important;
      height: 15px !important;
      margin-top: -19px !important;
      margin-left: 2% !important;
      margin-bottom: 0px !important;
      border-radius: 9px !important;
      padding: 0 5px;
      z-index: 50000 !important;
  color: gold !important;
  background: green !important;
  }
  .Button.Button--neutral.AddonReviewCard-control.AddonReviewCard-delete {
      line-height: 13px !important;
      margin: 0px;
      text-decoration: none !important;
  color: gold !important;
  }
  .Button.Button--action.AddonReviewCard-writeReviewButton.Button--puffy {
      float: left !important;
      width: 100% !important;
      height: auto;
      min-height: 15px !important;
      max-height: 15px !important;
      line-height: 13px !important;
      margin: 0vh 0 0 0 !important;
      padding: 0 0px;
      border-radius: 4px;
      font-size: 15px;
  }

  /* (new166) WRITE A REVIEW TEXTAREA - IN ADDON INFO PAGE - === */
  .RatingManager .AddonReviewCard-slim .AddonReviewCard-container .AddonReviewManager .AddonReviewManagerRating + form.DismissibleTextForm-form  {
      position: absolute !important;
      display: inline-block !important;
      height: auto !important;
      width: 100% !important;
      left: 0.5% !important;
      top: -1vh !important;
      padding: 0px !important;
      z-index: 5000 !important;
  background: black !important;
  border: 1px solid red !important;
  }
  .Addon.Addon-extension section.Card.Addon-overall-rating .DismissibleTextForm-form textarea.DismissibleTextForm-textarea {
      width: 96% !important;
      max-height: 430px !important;
      min-height: 150px !important;
      padding: 6px;
      resize: vertical !important;
  border: 1px solid red !important;
  }
  .RatingManager .AddonReviewCard-slim .AddonReviewCard-container .AddonReviewManager .AddonReviewManagerRating + form.DismissibleTextForm-form .DismissibleTextForm-buttons {
    display: flex;
    flex-direction: column;
    margin-top: 24px;
  }
  .RatingManager .AddonReviewCard-slim .AddonReviewCard-container .AddonReviewManager .AddonReviewManagerRating + form.DismissibleTextForm-form .DismissibleTextForm-buttons span.DismissibleTextForm-delete-submit-buttons button {
      width: 94% !important;
      margin:  0 0 0 10px !important;
      padding: 0 !important;
  }
  /* (new150) WRITE / RATE - ERROR */
  .Card.Addon-overall-rating .Card-contents:has(.ErrorList) .ErrorList {
      position: absolute !important;
      display: inline-block !important;
      width: 100% !important;
      left: 0.5% !important;
      top: -8vh !important;
      padding: 10px !important;
      z-index: 5000 !important;
  background: transparent !important;
  }



  /* (new165) LEFT - PANEL - ADDON - MORE INFOS - AddonMoreInfo BOTTOM */
  .Card.AddonMoreInfo.Card--no-footer {
      position: absolute !important;
      display: inline-block;
      float: none !important;
      height: 39vh !important;
      min-width: 20.9% !important;
      max-width: 20.5% !important;
      top: 52.5vh !important;
      left: 1% !important;
      margin: 0 !important;
      padding: 3px !important;
      border-radius: 9px !important;
  /*background: brown !important;*/
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }
  .Card.AddonMoreInfo.Card--no-footer .Card-header {
      margin: 0 0 0 0 !important;
  }
  .Card.AddonMoreInfo.Card--no-footer .Card-contents {
      display: inline-block;
      float: none !important;
      height: 34.6vh !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 2px !important;
      border-radius:  0 0 9px 9px !important;
  /*background: brown !important;*/
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }


  /* (new165) LEFT - MORE INFOS - ITEMS */
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList.AddonMoreInfo-dl {
      -moz-column-count: unset !important;
      column-count: unset!important;
  /*border: 1px solid aqua !important;*/
  }
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList.AddonMoreInfo-dl dt {
      display: block;
      float: left !important;
      width: auto !important;
      min-width: auto !important;
      max-width: 50% !important;
      margin: 0 5px 0 0 !important;
  color: silver !important;
  /*border: 1px solid aqua !important;*/
  }
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList.AddonMoreInfo-dl dd {
  color: silver !important;
  }

  /* (new165) LEFT - MORE INFOS - INFOS LINKS UL ALL */
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dl ul {
      min-width: 100% !important;
      max-width: 100% !important;
      /*-moz-column-count: 3 !important;
      column-count: 3!important;*/
  /*border: 1px solid pink !important;*/
  }


  /* (new165) LEFT - MORE INFOS - WITH LAST UPDATE DATE - ALL */
  .Card.AddonMoreInfo.Card--no-footer .Card-contents .DefinitionList.AddonMoreInfo-dl {
      display: inline-block;
      float: none !important;
      height: 32vh !important;
      margin-top: -5px !important;
      width: 100% !important;
      max-width: 100% !important;
      min-width: 100% !important;
      padding:  5px 5px 0 5px !important;
      overflow-wrap: break-word;
      overflow: hidden !important;
      overflow-y: auto !important;
  /*background: #A33434 !important;*/
  }
  .Card.AddonMoreInfo.Card--no-footer .Card-contents .DefinitionList.AddonMoreInfo-dl dd {
      margin: 0 0 6px !important;
  }

  /* (new167) LEFT - MORE INFOS - ADDON DATE UPDATE */
  .Definition-dd.AddonMoreInfo-last-updated {
      position: absolute !important;
      display: inline-block !important;
      width: 80% !important;
      top: -36vh !important;
      left: 17% !important;
      padding-left: 35px !important;
      text-align: left !important;
      border-radius: 0 5px 5px 0 !important;
  color: gold !important;
  /*background: #A33434 !important;*/
  border: 1px solid rgba(12, 12, 13, 0.9);
  }
  .Definition-dd.AddonMoreInfo-last-updated:before {
      content: "Update: ";
      position: absolute !important;
      display: inline-block !important;
      width: 25% !important;
      left: -18% !important;
      padding-left: 15px !important;
      text-align: left;
      border-radius: 5px 0 0 5px !important;
  color: silver !important;
  background: #a75f5f !important;
  }
  .Definition-dd.AddonMoreInfo-version + .Definition-dt {
      color: transparent !important;
  }
  .DefinitionList.AddonMoreInfo-dl .Definition-dd.AddonMoreInfo-filesize + .Definition-dt {
      display: none !important;
  }

  /* (new165) OLD FIRST - A VOIR */
  /* MORE INFOS LINK UL */
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dd.Definition-dd.AddonMoreInfo-links ul li {
      display: block;
      float: left !important;
      min-width: 100% !important;
      max-width: 100% !important;
      /*-moz-column-count: 3 !important;
      column-count: 3!important;*/
  /*border: 1px solid pink !important;*/
  }

  /* (new165) OLD FIRST - A VOIR */
  /* CATEGORY */
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dd.Definition-dd.AddonMoreInfo-related-categories ul {
      -moz-column-count: unset !important;
      column-count: unset!important;
      width: auto !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0 5px 0 0 !important;
  color: silver !important;
  /*background: rgb(17, 39, 102);*/
  /*border: 1px solid red !important;*/
  }

  /* (new165) OLD FIRST - A VOIR */
  /* POLICY */
   .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList.AddonMoreInfo-dl dd.Definition-dd.Definition-dd.AddonMoreInfo-privacy-policy ul {
      -moz-column-count: unset !important;
      column-count: unset!important;
      width: auto !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0 5px 0 0 !important;
  color: silver !important;
  /*background: brown !important;*/
  /*border: 1px solid red !important;*/
  }

  .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList.AddonMoreInfo-dl dd.Definition-dd.AddonMoreInfo-privacy-policy {
      /*background: rgb(17, 39, 102);*/
  /*border: 1px solid red !important;*/
  }
  /* (new165) OLD FIRST - A VOIR */
  /* LICENSE */
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dd.Definition-dd.AddonMoreInfo-license + dt {
      -moz-column-count: unset !important;
      column-count: unset!important;
      width: auto !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0 5px 0 0 !important;
  color: silver !important;
  /*background: rgb(17, 39, 102);*/
  /*border: 1px solid red !important;*/
  }
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList.AddonMoreInfo-dl dd.Definition-dd.AddonMoreInfo-license {
      -moz-column-count: unset !important;
      column-count: unset!important;
      width: auto !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0 5px 0 0 !important;
  color: silver !important;
  /*background: rgb(66, 94, 172);*/
  /*border: 1px solid red !important;*/
  }

  /* (new165) OLD FIRST - A VOIR */
  /* HISTORY */
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dd.Definition-dd.AddonMoreInfo-version-history ul {
      -moz-column-count: unset !important;
      column-count: unset!important;
      width: auto !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0 5px 0 0 !important;
  color: silver !important;
  /*background: rgb(66, 94, 172);*/
  /*border: 1px solid red !important;*/
  }
  /* (new165) LEFT - ADD TO COL MENU - BOTTOM */
  .Select.AddAddonToCollection-select > optgroup {
      height: 260px !important;
  }
  /* (new165) LEFT - ADD TO COLLECTION */
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList > div:has(.AddAddonToCollection)  {
      position: fixed !important;
      display: inline-block;
      float: none !important;
      height: 7.5vh !important;
      width: 21%;
      bottom: 0.5vh !important;
      left: 1% !important;
      margin: 0 !important;
      padding: 3px !important;
      border-radius: 9px !important;
  background: rgba(12, 12, 13, 0.9)  !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }

  /* (new170) LEFT - ADD TO COL MENU - ADD COLL - NOTICE - SUCESS */
  /*.RatingManagerNotice-savedRating.RatingManagerNotice-savedRating-hidden {
    display: none !important;
  }*/
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList > div:has(.AddAddonToCollection) .Notice:not(.Notice-error)  {
      position: fixed !important;
      display: inline-block;
      float: none !important;
      height: 2.5vh !important;
      line-height: 2vh  !important;
      width: 20.4%;
      bottom: 9.5vh !important;
      left: 1.2% !important;
      margin: 0 !important;
      padding: 3px !important;
      border-radius: 9px !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList > div:has(.AddAddonToCollection) .Notice:not(.Notice-error) .Notice-icon ,
  div:has(.AddAddonToCollection) .Notice:not(.Notice-error) .Notice-icon {
      display:block;
      float: left  !important;
      height: 2.5vh !important;
      line-height: 2vh  !important;
      width: 16px;
      margin: 0 0 0 0 0 !important;
  }
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList > div:has(.AddAddonToCollection) .Notice:not(.Notice-error) .Notice-column ,
  div:has(.AddAddonToCollection) .Notice:not(.Notice-error) .Notice-column {
      display:block;
      float: right  !important;
      height: 2vh !important;
      line-height: 2vh  !important;
      width: 90.4%;
      margin: 0px 0 0 0 0 !important;
  }
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList > div:has(.AddAddonToCollection) .Notice:not(.Notice-error) .Notice-column .Notice-content ,
  div:has(.AddAddonToCollection) .Notice:not(.Notice-error) .Notice-column .Notice-content {
      display: inline-block !important;
      height: 2vh !important;
      line-height: 2vh  !important;
      width: 100% !important;
      margin: 0 0 0 0 0 !important;
  }
  .Addon-details .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList > div:has(.AddAddonToCollection) .Notice:not(.Notice-error) .Notice-column .Notice-content p.Notice-text ,
  div:has(.AddAddonToCollection) .Notice:not(.Notice-error) .Notice-column .Notice-content p.Notice-text{
      display: inline-block !important;
      height: 2vh !important;
      line-height: 2vh  !important;
      margin: 0 0 0 0 0 !important;
      padding: 0 0 0 0 !important;
      word-break: break-word;
  }

  /* (new165) LEFT - ADD COL - ERROR */
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList > div:has(.AddAddonToCollection) .ErrorList {
      position: absolute !important;
      display: inline-block;
      float: none !important;
      height: 2.5vh !important;
      width: 20.4% !important;
      bottom: 11.5vh !important;
      left: 0.2% !important;
      margin: 0 !important;
      padding: 0px !important;
      border-radius: 9px !important;
  /*border: 1px solid aqua !important;*/
  }
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList > div:has(.AddAddonToCollection) .ErrorList .Notice.Notice-error   {
      display: inline-block;
      float: none !important;
      height: 2.3vh !important;
      line-height: 2.3vh  !important;
      width: 100% !important;
      bottom: 8.5vh !important;
      left: 0.2% !important;
      margin: 0px 0 0 0 0 !important;
      padding: 0px !important;
      border-radius: 9px !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList > div:has(.AddAddonToCollection) .ErrorList .Notice.Notice-error .Notice-icon {
      display:block;
      float: left  !important;
      height: 2vh !important;
      line-height: 2vh  !important;
      width: 16px;
      margin: 0 0 0 0 0 !important;
  }
  /* (new165) LEFT - ADD COL - A VOIR */
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList > .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList > div:has(.AddAddonToCollection) .ErrorList .Notice.Notice-error .Notice-column {
      display:block;
      float: right  !important;
      height: 2vh !important;
      line-height: 2vh  !important;
      width: 90.4%;
      margin: 0px 0 0 0 0 !important;
  }
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList > div:has(.AddAddonToCollection) .ErrorList .Notice.Notice-error .Notice-column .Notice-content {
      display: inline-block !important;
      height: 2vh !important;
      line-height: 2vh  !important;
      width: 100% !important;
      margin: 0 0 0 0 0 !important;
  }
  .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList > div:has(.AddAddonToCollection) .ErrorList .Notice.Notice-error .Notice-column .Notice-content p.Notice-text {
      display: inline-block !important;
      height: 2vh !important;
      line-height: 2vh  !important;
      margin: 0 0 0 0 0 !important;
      padding: 0 0 0 0 !important;
      word-break: break-word;
  }



  /* (new165) RIGHT - TOP DESCRIPTION - SUPPORT DEV */
  .ContributeCard {
      position: absolute !important;
      display: inline-block !important;
      float: none !important;
      min-width: 200px !important;
      max-width: 200px !important;
      height: 3vh !important;
      top: 9.2vh !important;
      left: 35.5% !important;
      margin: 0 !important;
      padding: 0 2px !important;
      border-radius: 9px !important;
      font-size: 10px !important;
      overflow: hidden !important;
      z-index: 1 !important;
      outline: none !important;
  background: #111 !important;
  border: 1px solid green !important;
  }
  .ContributeCard:hover {
      height: auto !important;
      max-width: 19.6% !important;
      padding: 2px !important;
      z-index: 5000000 !important;
  background: red !important;
  }
  .ContributeCard .ContributeCard-header {
      height: 2vh !important;
      margin-bottom: 1px;
      margin-top: 0;
      padding: 1px 3px !important;
      text-align: center !important;
      font-size: 15px !important;
      overflow: hidden;
      overflow-wrap: break-word;
      border: none !important;
  }


  /* RIGHT - DESCRIPTION + SCREENSHOTS + MORE ADDONS HORIZ - CONTAINER */
  section.Card.Addon-content.Card--photon.Card--no-header.Card--no-footer .Card-contents .Addon-header + .Addon-main-content{
      display: block !important;
      float: right !important;
      grid-template: unset !important;
      box-sizing: unset !important;
      min-width: 78.8% !important;
      max-width: 78.8%  !important;
      height: 44.6vh !important;
      margin: -2vh -1% 0 0 !important;
      overflow-wrap: anywhere;
      word-break: break-word;
  /*background: olive !important;*/
  border: none !important;
  }

  /* RIGHT - DESCRIPTION */
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension section.Card.Addon-content.Card--photon.Card--no-header.Card--no-footer .Addon-description-and-ratings .Card.ShowMoreCard.AddonDescription {
      position: absolute !important;
      display: inline-block !important;
      grid-template: unset !important;
      box-sizing: unset !important;
      width: 31.2% !important;
      height: 44.7vh !important;
      top: 9vh !important;
      margin: 0 0 0 0 !important;
      padding: 0 !important;
      border-radius: 9px !important;
  /*background: brown !important;*/
  border: 1px solid red !important;
  }
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension section.Card.Addon-content.Card--photon.Card--no-header.Card--no-footer .Addon-description-and-ratings .Card.ShowMoreCard.AddonDescription .Card-header {
      width: 92.2% !important;
      margin: 4px 0 0 4px !important;
      border-radius: 9px 9px  0 0 !important;
  }


  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension section.Card.Addon-content.Card--photon.Card--no-header.Card--no-footer .Addon-description-and-ratings .Card.ShowMoreCard.AddonDescription .Card-contents {
      display: inline-block !important;
      grid-template: unset !important;
      box-sizing: unset !important;
      width: 98.4% !important;
      height: 40.5vh !important;
      top: 0vh !important;
      margin: 1px 0 0 5px !important;
      padding: 0 !important;
      border-radius: 0 0 9px 9px !important;
  /*background: blue !important;*/
  }
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension section.Card.Addon-content.Card--photon.Card--no-header.Card--no-footer .Addon-description-and-ratings .Card.ShowMoreCard.AddonDescription .Card-contents .ShowMoreCard-contents {
    max-height: 59vh !important;
  }



  /* (new167) RIGHT - SCREENSHOTS - TOTAL TOPCONTAINER - A VOIR */
  .Addon-main-content:has(.Card.Addon-screenshots) {
      grid-area: unset !important;
      display: inline-block !important;
      min-width: 100% !important;
      max-width: 100% !important;
      padding: 3px !important;
      border-radius: 9px !important;
  /*border: 1px solid aqua !important;*/
  }
  /* RIGHT - SCREENSHOTS - .ScreenShots .ScreenShots-viewport .ScreenShots-list */
  .Addon-main-content .Card.Addon-screenshots ,
  section.Card.Addon-content.Card--photon.Card--no-header.Card--no-footer .Card-contents .Addon-header + .Addon-main-content .Card.Addon-screenshots.Card--no-footer {
      position: absolute !important;
      display: inline-block !important;
      float: none !important;
      grid-template: unset !important;
      min-height: 71.8vh !important;
      min-width: 44.6% !important;
      max-width: 44.6% !important;
      margin: 1vh 0 0 0px !important;
      right:  0.8% !important;
      padding: 3px !important;
      overflow-y: hidden !important;
      border-radius: 9px !important;
  /*background: olive !important;*/
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  /*border: 1px solid red !important;*/
  }

  /* (new167) RIGHT - SCREENSHOTS - TOP HEADER */
  section.Card.Addon-content.Card--photon.Card--no-header.Card--no-footer .Card-contents .Addon-header + .Addon-main-content .Card.Addon-screenshots.Card--no-footer .Card-header {
      margin: 0vh 0 0 0px !important;
      border-radius: 9px 9px 0 0  !important;
  }

  /* (new165)  RIGHT - SCREENSHOTS */
  section.Card.Addon-content.Card--photon.Card--no-header.Card--no-footer .Card-contents .Addon-header + .Addon-main-content .Card.Addon-screenshots.Card--no-footer .Card-contents ,
  .Addon-main-content .Card.Addon-screenshots .Card-contents {
      display: inline-block !important;
      height: 100% !important;
      min-height: 67.2vh !important;
      max-height: 67.2vh !important;
      width: 100% !important;
      min-width: 100% !important;
      margin: 1px 0 0 0 !important;
      padding: 5px 5px !important;
      overflow: hidden auto !important;
      border-radius: 0 0 9px 9px  !important;
  /*border: 1px solid red !important;*/
  }
  .ScreenShots {
      width: 100% !important;
      min-width: 100% !important;
      height: 341px !important;
  /* border: 1px solid red; */
  }

  .ScreenShots-viewport {
      height: auto;
  }
  .ScreenShots-list {
      display: inline-block;
      height: 39vh !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0;
      padding: 0;
      overflow: auto;
      background: rgba(0, 0, 0, 0) linear-gradient(rgba(255, 255, 255, 0), #1f2536) repeat scroll 0 0 !important;
  /*background: blue !important;*/
  }
  .ScreenShots-list .ScreenShots-image:first-of-type,
  .ScreenShots-list .ScreenShots-image {
      display: inline-block !important;
      height: 200px !important;
      width: 47% !important;
      margin: 3px 5px 0 10px !important;
      border-radius: 3px !important;
  background: #1f2536 !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }

  .ScreenShots-list > .pswp-thumbnails {
      display: inline-block !important;
      height: 338px !important;
      width: 100% !important;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      overflow-y: auto !important;
  }
  .ScreenShots-list > .pswp-thumbnails .pswp-thumbnail {
      float: left !important;
  border: 1px solid rgba(12, 12, 13, 0.9);
  }
  .ScreenShots-list > .pswp-thumbnails .pswp-thumbnail:not(:first-of-type) .ScreenShots-image {
      max-height: 110px !important;
      width: auto !important;
      max-width: 110px !important;
      margin: 0 !important;
  }
  .ScreenShots-list > .pswp-thumbnails .pswp-thumbnail:first-of-type .ScreenShots-image {
      max-height: 335px !important;
      width: auto !important;
      max-width: 320px !important;
      margin: 0 !important;
  }
  .ScreenShots-list > .pswp-thumbnails .pswp-thumbnail:not(:only-of-type):first-of-type .ScreenShots-image {
      height: 330px !important;
      width: auto !important;
      max-width: 574px !important;
      text-align: center !important;
  }

  /* (new165)  RIGHT - SCREENSHOTS - OPEN */
  .pswp--open {
      z-index: 5000000000 !important;
  }

  /* (new165)  RIGHT - SCREENSHOTS - ONLY ONE */
  .ScreenShots-list > .ScreenShots-image:only-of-type {
      display: inline-block !important;
      float: none !important;
      width: 97% !important;
      height: 38vh !important;
      text-align: center !important;
  }





  /* RIGHT - MIDDLE  - MORE ADDONS HORIZONTAL */
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension section.Card.Addon-content.Card--photon.Card--no-header.Card--no-footer + div .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer{
      display: block !important;
      float: right !important;
      grid-template: unset !important;
      box-sizing: unset !important;
      min-width: 76.5% !important;
      max-width: 76.5% !important;
      top: 81.3vh !important;
      margin: 0vh 0% 0 0 !important;
  /*background: olive !important;*/
  }
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension section.Card.Addon-content.Card--photon.Card--no-header.Card--no-footer + div .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer .Card-contents ul.AddonsCard-list li.SearchResult {
      grid-column: unset !important;
      min-width: 24% !important;
      max-width: 24% !important;
      margin: 0 5px 0 -3px !important;
      padding: 0;
  /*background: olive !important;*/
  }

  /* (new165) OLD FIRST - A VOIR */
  /* AUTORIZATION */
  /*.Addon.Addon-extension > .Card.ShowMoreCard.PermissionsCard {
      display: inline-block !important;
      width: 37% !important;
      min-height: 31vh !important;
      max-height: 31vh !important;
      overscroll-behavior-y: contain !important;
  }*/
  /* (new165) OLD FIRST - A VOIR */
  /*.Addon.Addon-extension > .Card.ShowMoreCard.PermissionsCard .Card-contents {
      display: inline-block !important;
      width: 100% !important;
      min-height: 26.2vh !important;
      max-height: 26.2vh !important;
      margin: 0 0 0 0 !important;
      overscroll-behavior-y: contain !important;
  }*/

  /* RIGHT - BOTTIOM RIGHT - PERMISSION */
  /* PERMISSIONS - === */
  .Card.PermissionsCard.Card--no-footer {
      position: absolute !important;
      float: none !important;
      min-width: 31.50% !important;
      max-width: 31.50% !important;
      min-height: 26.4vh !important;
      max-height: 26.4vh !important;
      left: 22.5% !important;
      bottom: 18.9vh !important;
      margin: 0 0 0 0 !important;
      padding: 3px !important;
      overflow-wrap: break-word;
      overflow: hidden auto !important;
      border-radius: 9px !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  /*background: olive !important;*/
  }
  .Card.PermissionsCard.Card--no-footer .Card-header {
      margin: 0 0 1px 0 !important;
      border-radius: 9px 9px 0 0 !important;
  }

  .Card.PermissionsCard.Card--no-footer .ShowMoreCard-contents{
      min-width: 100% !important;
      max-width: 100% !important;
      min-height: 20.9vh !important;
      max-height: 20.9vh !important;
      margin: 0 0 0 0 !important;
      padding: 3px !important;
      overflow-wrap: break-word;
      overflow: hidden auto !important;
      border-radius:  0 0 9px 9px !important;
  /*border: 1px solid rgba(12, 12, 13, 0.9) !important;*/
  /*background: olive !important;*/
  }
  .PermissionsCard-list li {
      margin-top: 6px !important;
  }
  /* (new125) PERMISSION CARD - ALL */
  .PermissionsCard-subhead--required,
  .PermissionsCard-subhead--optional {
      margin-top: -5px;
  }
  .PermissionsCard-subhead--optional {
      margin-top: -5px;
  }


  /* RIGHT - LEFT - RELEASE NOTES */
  .Card.ShowMoreCard.AddonDescription-version-notes {
      position: absolute !important;
      float: none !important;
      min-width: 45.40% !important;
      max-width: 45.40% !important;
      height: 100% !important;
      min-height: 26.5vh !important;
      max-height: 26.5vh !important;
      bottom: 18.9vh !important;
      right: 0.5% !important;
      margin: 0 0 0 0 !important;
      padding: 3px !important;
      overflow-wrap: break-word;
      overflow: hidden auto !important;
      border-radius: 9px !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  /*border: 1px solid pink !important;*/
  /*background: olive !important;*/
  }
  /* for: https://addons.mozilla.org/en-US/firefox/addon/secure-password-generator/?src=recommended */
  .Card.ShowMoreCard.AddonDescription-version-notes .Card-header {
      max-width: 100% !important;
  }
  .Card.ShowMoreCard.AddonDescription-version-notes .Card-contents {
      min-width: 100% !important;
      min-height: 22.1vh !important;
      max-height: 22.1vh !important;
      margin: 0px !important;
      padding: 2px !important;
      border-radius: 0 0 9px 9px !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }
  .Card.ShowMoreCard.AddonDescription-version-notes .ShowMoreCard-contents {
      max-height: 210px !important;
      padding: 5px 5px 25px 5px!important;
      overflow: hidden !important;
      overflow-wrap: break-word;
      overflow-y: auto !important;
  }

  .Card.ShowMoreCard.AddonDescription-version-notes.ShowMoreCard--expanded header,
  .Card.ShowMoreCard.AddonDescription-version-notes.ShowMoreCard--expanded .Card-contents {
      min-width: 100% !important;
      max-width: 100% !important;
  }
  .Card.ShowMoreCard.AddonDescription-version-notes.ShowMoreCard--expanded .Card-contents {
      min-height: 22.1vh !important;
      max-height: 22.1vh !important;
  }
  .ShowMoreCard-contents::after {
      display: none !important;
  }
  .Card.ShowMoreCard.AddonDescription-version-notes .ShowMoreCard-contents > div > br + br {
      display: block !important;
      margin-bottom: -2px !important;
  }

  /* (new161) MORE ADONS by THIS AUTHOR */
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer {
      position: absolute !important;
      display: inline-block !important;
      float: none !important;
      height: 3vh !important;
      line-height: 1.5vh !important;
      width: 26.3% !important;
      min-width: 19.4% !important;
      top: 32vh !important;
      left: -27.4% !important;
      margin-top: 0;
      margin-bottom: 0 !important;
      padding: 3px !important;
      border-radius: 9px !important;
      overflow: hidden !important;
  border: 1px solid gold !important;
  }



  /* (new167) ALL ITEMS - BADGE RECOMMAND */
  li.SearchResult .Badge.Badge--has-link,
  .UserProfile-addons-and-reviews .Card-contents ul > li.SearchResult .Badge.Badge--has-link[data-testid="badge-recommended"] {
      position: absolute !important;
      display: inline-block !important;
      width: auto !important;
      height: 1.5vh !important;
      line-height: 1.5vh !important;
      left:  0% !important;
      margin: -3vh 0 0 0px !important;
      padding:  0 0px 0 5px !important;
      overflow: hidden !important;
      border-radius: 0 0 5px !important;
      z-index: 0;
      background: green !important;
  border: none !important;
  /*border: 1px solid red !important;*/
  }
  li.SearchResult .Badge.Badge--has-link:hover ,
  .UserProfile-addons-and-reviews .Card-contents ul > li.SearchResult .Badge.Badge--has-link[data-testid="badge-recommended"]:hover {
      position: absolute !important;
      display: inline-block !important;
      width: auto !important;
      height: 1.5vh !important;
      line-height: 1.5vh !important;
      left:  0% !important;
      margin: -3vh 0 0 0px !important;
      padding:  0 2px 0 2px !important;
      overflow: hidden !important;
      border-radius: 5px !important;
      z-index: 0;
  /*border: 1px solid aqua !important;*/
  }
  li.SearchResult .Badge.Badge--has-link .Badge-link ,
  .UserProfile-addons-and-reviews .Card-contents ul > li.SearchResult .Badge.Badge--has-link[data-testid="badge-recommended"] .Badge-link {
      width: auto !important;
      height: 1.5vh !important;
      line-height: 1.5vh !important;
      text-wrap: nowrap !important;

  }
  /*.UserProfile-addons-and-reviews .Card-contents ul > li.SearchResult .Badge.Badge--has-link[data-testid="badge-recommended"] .Badge-link span.Icon.Icon-recommended.Badge-icon.Badge-icon--small*/

  li.SearchResult .Badge.Badge--has-link .Badge-link span.Icon.Icon-recommended.Badge-icon.Badge-icon--small + .Badge-content.Badge-content--small ,
  .UserProfile-addons-and-reviews .Card-contents ul > li.SearchResult .Badge.Badge--has-link[data-testid="badge-recommended"] .Badge-link span.Icon.Icon-recommended.Badge-icon.Badge-icon--small + .Badge-content.Badge-content--small{
      display: block !important;
      float: right !important;
      width: 70% !important;
      height: 1.5vh !important;
      line-height: 1.5vh !important;
   padding:  0 0px 0 0px !important;
      text-wrap: nowrap !important;
      font-size: 0 !important;
      color: white !important;
  }
  /* (new167) ALL ITEMS - BADGE RECOMMAND - HOVER */
  li.SearchResult .Badge.Badge--has-link:hover .Badge-link span.Icon.Icon-recommended.Badge-icon.Badge-icon--small + .Badge-content.Badge-content--small ,
  .UserProfile-addons-and-reviews .Card-contents ul > li.SearchResult .Badge.Badge--has-link[data-testid="badge-recommended"]:hover .Badge-link span.Icon.Icon-recommended.Badge-icon.Badge-icon--small + .Badge-content.Badge-content--small {
      display: block !important;
      float: right !important;
      width: 100% !important;
      height: 1.5vh !important;
      line-height: 1.5vh !important;;
      padding:  0 15px 0 5px !important;
      text-wrap: nowrap !important;
      font-size: 12px !important;
  }


  /* (new167) ITEMS - BADGE RECOMMAND - ADDON INFO PAGE -  */
  .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer .AddonsCard-list li.SearchResult .Badge.Badge--has-link {
      position: absolute !important;
      display: inline-block !important;
      width: auto !important;
      height: 1.5vh !important;
      line-height: 1.5vh !important;
      top:  unset !important;
      left:  unset !important;
      margin: -3.5vh 0 0 -25% !important;
      padding:  0 0px 0 5px !important;
      overflow: hidden !important;
      border-radius: 5px 0 5px 0 !important;
      z-index: 0;
      background: green !important;
  border: none !important;
  /*border: 1px solid red !important;*/
  }
  .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal.Card--photon.Card--no-footer .AddonsCard-list li.SearchResult .Badge.Badge--has-link:hover {
      position: absolute !important;
      display: inline-block !important;
      width: auto !important;
      height: 1.5vh !important;
      line-height: 1.5vh !important;
      margin: -3.5vh 0 0 -18% !important;
  /*border: 1px solid aqua !important;*/
  }

  /* (new167) ITEMS - BADGE - THEME INFO PAGE -  */
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.AddonsByAuthorsCard--theme.AddonsCard--horizontal.Card--photon li.SearchResult .Badge.Badge--has-link {
      position: absolute !important;
      display: inline-block !important;
      width: auto !important;
      height: 1.5vh !important;
      line-height: 1.5vh !important;
      left:  0% !important;
      margin: -19.9vh 0 0 0px !important;
      padding:  0 0px 0 5px !important;
      overflow: hidden !important;
      border-radius: 5px 0 5px 0 !important;
      z-index: 0;
  background: green !important;
  border: none !important;
  /*border: 1px solid red !important;*/
  }
  .Card.CardList.AddonsCard.AddonsByAuthorsCard.AddonsByAuthorsCard--theme.AddonsCard--horizontal.Card--photon li.SearchResult .Badge.Badge--has-link:hover {
      position: absolute !important;
      display: inline-block !important;
      width: auto !important;
      height: 1.5vh !important;
      line-height: 1.5vh !important;
      left:  0% !important;
      margin: -19.9vh 0 0 0px !important;
      padding:  0 2px 0 2px !important;
      overflow: hidden !important;
      border-radius: 5px !important;
      z-index: 0;
  /*border: 1px solid aqua !important;*/
  }



  /* COLOR CORRECTIONS */
  .Card--no-footer .Card-contents, .Card--photon .Card-contents, .Card-contents {
      background: rgb(22, 26, 37) !important;
      background: rgb(39, 46, 65) !important;
  }
  section {
      background: rgb(30, 36, 52) !important;
  }
  `;
}
if ((location.hostname === "addons.mozilla.org" || location.hostname.endsWith(".addons.mozilla.org")) || (location.hostname === "addons-dev.allizom.org" || location.hostname.endsWith(".addons-dev.allizom.org")) || location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* ADDON + THEME - OLD FIRST NEW DESIGN */

  /* (new165) OLD FIRST - A VOIR */

  /* (new162) THEME - LEFT PANEL - RATING CONTAINER */
  .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-statictheme.Addon-theme .Card.Addon-description-rating-card .RatingManager {
      position: absolute !important;
      display: inline-block !important;
      flex-direction: unset !important;
      gap: unset !important;
      min-width: 19.3% !important;
      max-width: 19.3% !important;
      height: 20vh !important;
      top: 24vh !important;
      left: 0.8% !important;
      padding: 0 20px 0 20px !important;
  background: rgb(29, 34, 50) !important;
  }
  /* (new162) THEME - LEFT PANEL - RATING CONTAINER - DELETE / WRITE */
  .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-statictheme.Addon-theme .Addon-details > .Addon-main-content .Card.Addon-description-rating-card:not(:has(.AddonDescription-contents)) > .Card-contents .Card.Addon-overall-rating .Card-contents .AddonReviewCard.RatingManager-AddonReviewCard.AddonReviewCard-ratingOnly.AddonReviewCard-viewOnly.AddonReviewCard-slim:has(.Card.ShowMoreCard.UserReview-body.UserReview-emptyBody.ShowMoreCard--expanded):not(:hover) {
    display: inline-block !important;
    width: 100% !important;
    min-width: 20% !important;
    max-width: 20% !important;
    margin: -2vh 0px 0px 30px !important;
  /*border: 1px solid lime !important;*/
  }

  /* (new164) ADDON /THEME - LEFT PANEL - ADDON INFO - NUMBER USERS / REVIEWS -  
  .Addon.Addon-extension > div:not(.Addon-details) .Card-contents .Addon-header .AddonBadges
  .Addon.Addon-extension > div:not(.Addon-details) .Card-contents .Addon-header .Badge[data-testid]
  .Badge-content.Badge-content--large 
  .Addon.Addon-extension > div:not(.Addon-details) .Card-contents .Addon-header .Badge[data-testid] > span.Badge-content.Badge-content--large:not(.visually-hidden)
  === */
  .Addon.Addon-statictheme.Addon-theme > div:not(.Addon-details) .Card-contents .Addon-header .AddonBadges ,
  .Addon.Addon-extension > div:not(.Addon-details) .Card-contents .Addon-header .AddonBadges {
      position: absolute !important;
      display: inline-block !important;
      width: 20% !important;
      min-height: 4.5vh !important;
      max-height: 4.5vh !important;
      margin: 0vh 0 0 0% !important;
      padding: 0 0 0 0 !important;
      top: 45vh !important;
      left: 0 !important;
      opacity: 1 !important;
  }

  /* THEME - SUMMARY */
  .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer .Addon-header .ThemeImage.ThemeImage--rounded-corners + .AddonTitle ~ .Addon-summary-and-install-button-wrapper .Addon-summary {
      height: 137px !important;
      margin-top: 0;
      max-width: 100%;
      min-width: 100%;
      overflow-x: hidden;
  }
  /* THEME - INSTALL */
  .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer .Addon-header .ThemeImage.ThemeImage--rounded-corners + .AddonTitle ~ .Addon-summary-and-install-button-wrapper {
      height: 237px !important;
  }
  .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer .Addon-header .ThemeImage.ThemeImage--rounded-corners + .AddonTitle ~ .Addon-summary-and-install-button-wrapper > .InstallButtonWrapper {
      margin-top: 189px;
  }
  .Card.Addon-header-info-card.Card--photon.Card--no-header.Card--no-footer .Addon-header .ThemeImage.ThemeImage--rounded-corners + .AddonTitle ~ .Addon-summary-and-install-button-wrapper > p + .InstallButtonWrapper {
      margin-top: 35px !important;
  }

  /* (new155) ADDON /THEME - LEFT PANEL - ADDON INFO - BADGE EXPERIMENTAL */
  .Page-amo .Page-not-homepage .Addon.Addon-statictheme.Addon-theme > div:not(.Addon-details) .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-experimental-badge"] ,
  .Page-amo .Page-not-homepage .Addon.Addon-extension > div:not(.Addon-details) .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-experimental-badge"] {
      position: absolute !important;
      display: inline-block !important;
      width: 45% !important;
      min-height: 3.2vh !important;
      max-height: 3.2vh !important;
      line-height: 3.2vh !important;
      margin: 0vh 0 0 0% !important;
      padding: 0px 0 0px 5px !important;
      top: -38.1vh !important;
      left: 63% !important;
      opacity: 1 !important;
  /*background: gold  !important;*/
  border: none !important;
  }
  .Page-amo .Page-not-homepage .Addon.Addon-statictheme.Addon-theme > div:not(.Addon-details) .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-experimental-badge"] span.Badge-content.Badge-content--large   ,
  .Page-amo .Page-not-homepage .Addon.Addon-extension > div:not(.Addon-details) .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-experimental-badge"] span.Badge-content.Badge-content--large {
      display: block !important;
      float: right !important;
      min-height: 3.2vh !important;
      max-height: 3.2vh !important;
      line-height: 3.2vh !important;
      padding: 0px 15px 0px 15px !important;
      border-radius: 0 9px 9px 0!important;
  color: white !important;
  background: green  !important;
  }
  .Page-amo .Page-not-homepage .Addon.Addon-statictheme.Addon-theme > div:not(.Addon-details) .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-experimental-badge"] span.Icon.Icon-experimental-badge,
  .Page-amo .Page-not-homepage .Addon.Addon-extension > div:not(.Addon-details) .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-experimental-badge"] span.Icon.Icon-experimental-badge {
      display: block !important;
      float: left !important;
      min-height: 2.5vh !important;
      max-height: 2.5vh !important;
      line-height: 2vh !important;
      margin: 3px 0 0 0 !important;
  filter: invert(38%) saturate(481%) hue-rotate(40deg) brightness(202%) contrast(93%) !important;
  }

  /* (new155) ADDON /THEME - LEFT PANEL - ADDON INFO - BADGE BY FITRFOX [data-testid="badge-line"] */
  .Page-amo .Page-not-homepage .Addon.Addon-statictheme.Addon-theme > div:not(.Addon-details) .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-line"] ,
  .Page-amo .Page-not-homepage .Addon.Addon-extension > div:not(.Addon-details) .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-line"] {
      position: absolute !important;
      display: inline-block !important;
      width: 45% !important;
      min-height: 3.3vh !important;
      max-height: 3.3vh !important;
      line-height: 3.2vh !important;
      margin: 0vh 0 0 0% !important;
      padding: 0px 0 0px 5px !important;
      top: -38.1vh !important;
      left: 63% !important;
      opacity: 1 !important;
  background: rgb(17, 39, 102) !important;
  border: 1px solid green !important;
  }
  .Page-amo .Page-not-homepage .Addon.Addon-statictheme.Addon-theme > div:not(.Addon-details) .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-line"] span.Badge-content.Badge-content--large   ,
  .Page-amo .Page-not-homepage .Addon.Addon-extension > div:not(.Addon-details) .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-line"] span.Badge-content.Badge-content--large {
      display: block !important;
      float: right !important;
      width: 88% !important;
      min-height: 3.2vh !important;
      max-height: 3.2vh !important;
      line-height: 3.2vh !important;
      padding: 0px 15px 0px 15px !important;
      border-radius: 0 9px 9px 0!important;
      text-align: center !important;
  color: white !important;
  background: green  !important;
  }
  .Page-amo .Page-not-homepage .Addon.Addon-statictheme.Addon-theme > div:not(.Addon-details) .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-line"] span.Icon.Icon-experimental-badge,
  .Page-amo .Page-not-homepage .Addon.Addon-extension > div:not(.Addon-details) .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-line"] span.Icon.Icon-experimental-badge {
      display: block !important;
      float: left !important;
      min-height: 2.5vh !important;
      max-height: 2.5vh !important;
      line-height: 2vh !important;
      margin: 3px 0 0 0 !important;
  filter: unset !important;
  }
  `;
}
if ((location.hostname === "addons.mozilla.org" || location.hostname.endsWith(".addons.mozilla.org")) || (location.hostname === "addons-dev.allizom.org" || location.hostname.endsWith(".addons-dev.allizom.org")) || location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* THEME ONLY - OLD FIRST NEW DESIGN */

  /* (new165) OLD FIRST - A VOIR */

  /* (new155) === THEME -INFOS PAGES ==== */
  /* THEME - LEFT - .Addon-theme.Addon--has-more-than-0-addons.Addon--has-more-than-3-addons*/
  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) {
      display: inline-block !important;
      width: 100% !important;
      height: 100vh !important;
  /*border: 1px solid yellow !important;*/
  }

  .Addon.Addon-statictheme > div:not(.Addon-details) {
      display: block !important;
      float: left !important;
      flex-direction: unset !important;
      gap: unset !important;
      width: 20% !important;
      height: 100vh !important;
  /*border: 1px solid aqua !important;*/
  }
  .Addon.Addon-statictheme.Addon-theme .Addon-info h1 {
      display: inline-block !important;
      width: 100%;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 100% !important;
      min-height: 2vh !important;
      max-height: 20vh !important;
  /*border: 1px solid aqua !important;*/
  }
  .Addon.Addon-statictheme > div:not(.Addon-details) .ThemeImage {
      position: absolute !important;
      display: inline-block !important;
      width: 100%;
      min-width: 78% !important;
      max-width: 78% !important;
      height: 100% !important;
      min-height: 20vh !important;
      max-height: 20vh !important;
      order: unset !important;
      overflow-y: hidden;
  /*border: 1px solid aqua !important;*/
  }

  .Addon.Addon-statictheme > div:not(.Addon-details) .ThemeImage .ThemeImage-image {
      display: inline-block !important;
      height: 100% !important;
      min-height: 20vh !important;
      max-height: 20vh !important;
      width: 100%;
      margin: -15.6vh 0 0 0 !important;
      padding: 0 0 0 0 !important;
      -o-object-fit: contain !important;
      object-fit: contain !important;
      -o-object-position: center center !important;
      object-position: center center !important;
  }

  /* (new162) THEME - INSTALL BUTTON */
  .Addon.Addon-statictheme.Addon-theme > div:not(.Addon-details) .Card-contents .Addon-header .Addon-install{
      position: fixed !important;
      display: inline-block !important;
      float: none !important;
      min-width: 20% !important;
      max-width: 15% !important;
      height: 4vh !important;
      line-height: 4vh !important;
      left:  0 !important;
     top: 33vh !important;
  /*background: gold !important;*/
  /*border: 1px solid blue !important;*/
  }
  .Addon.Addon-statictheme.Addon-theme > div:not(.Addon-details) .Card-contents .Addon-header .Addon-install .InstallButtonWrapper, 
  .Addon.Addon-statictheme.Addon-theme > div:not(.Addon-details) .Card-contents .Addon-header .Addon-install .InstallButtonWrapper .GetFirefoxButton {
      display: flex;
      flex-direction: column;
      margin:  0 0 0 45% !important;
  }

  /* THEME - RIGHT - .Addon--has-more-than-0-addons.Addon--has-more-than-3-addons*/
  .Addon.Addon-statictheme.Addon-theme > div.Addon-details {
      display: block !important;
      float: right !important;
      flex-direction: unset !important;
      gap: unset !important;
      width: 100% !important;
      height: 100vh !important;
  /*border: 1px solid yellow !important;*/
  }

  /* MORE THEME BY AUTHOR */
  .Addon.Addon-statictheme.Addon-theme > div.Addon-details .Card-header-text {
      height: 3vh !important;
      line-height: 3vh !important;
      font-size: 15px !important;
  }
  .Addon.Addon-statictheme.Addon-theme > div.Addon-details .Card.CardList.AddonsCard.AddonsByAuthorsCard.Addon-MoreAddonsCard.AddonsCard--horizontal.Card--photon.Card--no-footer {
      position: absolute !important;
      display: inline-block !important;
      float: none !important;
      width: 100%;
      min-width: 78% !important;
      max-width: 78.3% !important;
      height: auto !important;
      max-height: 50vh !important;
      top: 30vh !important;
      left: 21.4% !important;
      margin: 0px !important;
      padding: 3px !important;
      border-radius: 9px !important;
      overflow: hidden !important;
  /*border: 1px solid red;*/
  }
  .Addon.Addon-statictheme.Addon-theme > div.Addon-details .AddonsByAuthorsCard.AddonsCard--horizontal.AddonsByAuthorsCard--theme .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme {
      display: inline-block !important;
      width: 100%;
      min-width: 32.5% !important;
      max-width: 32.5% !important;
  /*border: 1px solid yellow !important;*/
  }
  .Addon.Addon-statictheme.Addon-theme > div.Addon-details .AddonsByAuthorsCard.AddonsCard--horizontal.AddonsByAuthorsCard--theme .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-result {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      border-radius: 9px;
      margin: 0 0 0 0 !important;
  /*border: 1px solid aqua!important;*/
  }

  .Addon.Addon-statictheme > div.Addon-details .AddonsByAuthorsCard.AddonsCard--horizontal.AddonsByAuthorsCard--theme .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-result .SearchResult-icon-wrapper {
      display: inline-block !important;
      width: 100% !important;
      min-width: 31.3% !important;
      max-width: 28.3% !important;
      border-radius: 9px;
      margin: 0 0 0 0 !important;
  /*border: 1px solid green!important;*/
  }

  /* (new165) OLD FIRST - A VOIR */
  /* (new154) THEME - MORE THEME - BADGE RECOMM */
  .Addon.Addon-statictheme.Addon-theme > .AddonsByAuthorsCard.AddonsCard--horizontal.AddonsByAuthorsCard--theme .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-result .Badge.Badge-border[data-testid="badge-recommended"] {
      position: absolute !important;
      display: inline-block !important;
      margin: 8vh 0 0px 0 !important;
  }
  `;
}
if ((location.hostname === "addons.mozilla.org" || location.hostname.endsWith(".addons.mozilla.org")) || (location.hostname === "addons-dev.allizom.org" || location.hostname.endsWith(".addons-dev.allizom.org")) || location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* 3nd NEW DESIGN - THEME ONLY (new168)  */

  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) .Addon.Addon-statictheme.Addon-theme .Card.Addon-content .Card-contents .Addon-header {
      position: absolute !important;
      display: inline-block !important;
      width: 100%;
      min-width: 70% !important;
      max-width: 70% !important;
      height: 100% !important;
      min-height: 80vh !important;
      max-height: 80vh !important;
      top: 15vh !important;
      left: 24% !important;
      order: unset !important;
      overflow: hidden;
  background: rgb(30, 36, 52) !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }


  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) .Addon.Addon-statictheme.Addon-theme .Card.Addon-content .Card-contents .Addon-header .Badge.Badge--has-link[data-testid="badge-recommended"] {
      position: fixed !important;
      display: inline-block !important;
      height: 8vh !important;
      width: 100%;
      min-width: 20% !important;
      max-width: 20% !important;
      top: -0.5vh !important;
      left: -3% !important;
      margin: 0px !important;
      padding: 5px !important;
      border-radius: 9px !important;
  background: gold !important;
  }
  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) .Addon.Addon-statictheme.Addon-theme .Card.Addon-content .Card-contents .Addon-header .Badge.Badge--has-link[data-testid="badge-recommended"] a.Badge-link {
      display: inline-block !important;
      width: 90.7% !important;
      height: 8vh !important;
      padding: 0px 0px !important;
  }
  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) .Addon.Addon-statictheme.Addon-theme .Card.Addon-content .Card-contents .Addon-header .Badge.Badge--has-link[data-testid="badge-recommended"] span.Badge-icon--large {
      display: inline-block !important;
      height: 7vh !important;
      line-height: 7vh !important;
      width: 35px !important;
      padding: 2px 0px !important;
  background-color: red !important
  }
  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) .Addon.Addon-statictheme.Addon-theme .Card.Addon-content .Card-contents .Addon-header .Badge.Badge--has-link[data-testid="badge-recommended"] span.Badge-content.Badge-content--large{
      display: inline-block !important;
      width: 100% !important;
      height: 7vh !important;
      line-height: 7vh !important;
      padding: 2px 10px !important;
      font-size: 26px;
  background: green !important;
  }


  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) .Addon.Addon-statictheme.Addon-theme .Card.Addon-content .Card-contents .Addon-header .ThemeImage.ThemeImage--rounded-corners {
      position: relative;
      width: 100%;
      height: auto;
      min-height: 25vh !important;
      max-height: 25vh !important;
      max-width: 100% !important;
      order: -1;
      overflow: hidden;
  }
  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) .Addon.Addon-statictheme.Addon-theme .Card.Addon-content .Card-contents .Addon-header .ThemeImage.ThemeImage--rounded-corners img.ThemeImage-image  {
    display: block;
    height: auto;
      height: 100% !important;
      min-height: 25vh !important;
      max-height: 25vh !important;
    -o-object-fit: cover;
    object-fit: cover;
    -o-object-position: top left;
    object-position: top left;
    width: 100%;
  }

  /* (new165) LEFT - THEMES - NUMBER OF USERS */
  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) .Addon.Addon-statictheme.Addon-theme .Card.Addon-content .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-user-fill"] {
      position: fixed !important;
      display: inline-block !important;
      width: 35.7% !important;
      min-height: 10vh !important;
      max-height: 10vh !important;
      line-height: 10vh !important;
      margin: 0vh 0 0 0% !important;
      top: 7.9vh !important;
      left: -6% !important;
      padding: 5px 0 5px 15px !important;
      opacity: 1 !important;
      z-index: 500000000 !important;
  background: rgb(30, 36, 52) !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }
  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) .Addon.Addon-statictheme.Addon-theme .Card.Addon-content .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-user-fill"] span.Icon.Icon-user-fill.Badge-icon {
      height: 10vh !important;
      width: 34px;
      margin: 0 0 0 5px !important;
  }
  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) .Addon.Addon-statictheme.Addon-theme .Card.Addon-content .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-user-fill"] .Badge-content.Badge-content--large {
      display: block !important;
      float: right !important;
      width: 90% !important;
      min-height: 8.5vh !important;
      max-height: 10vh !important;
      line-height: 8vh !important;
      margin: -9.8vh 5px 0vh 0px !important;
      top: 0vh !important;
      padding: 0 0 0 45px !important;
      font-size: 25px !important;
      text-align: left !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      opacity: 1 !important;
  color: white !important;
  /*background: gold !important;*/
  /*border: 1px solid red !important;*/
  }

  /* (new165) LEFT - THEME - NUMBER OF STARS / REVIEWS */
  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) .Addon.Addon-statictheme.Addon-theme .Card.Addon-content .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-star-full"] {
      position: fixed !important;
      display: inline-block !important;
      width: 35.7% !important;
      min-height: 10vh !important;
      max-height: 10vh !important;
      line-height: 10vh !important;
      margin: 0vh 0 0 0% !important;
      top: 17.6vh !important;
      left: -6% !important;
      padding: 0 0 0 15px !important;
      opacity: 1 !important;
      z-index: 5000 !important;
  background: rgb(30, 36, 52) !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }

  /*.Icon.Icon-star-full.Badge-icon.Badge-icon--large */
  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) .Addon.Addon-statictheme.Addon-theme .Card.Addon-content .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-star-full"] .Icon.Icon-star-full.Badge-icon.Badge-icon--large {
      height: 10vh !important;
      width: 34px;
      margin: 0 0 0 5px !important;
  }

  .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-star-full"] .Badge-content.Badge-content {
      display: block !important;
      float: right !important;
      width: 90% !important;
      min-height: 8.5vh !important;
      max-height: 8.5vh !important;
      line-height: 8vh !important;
      margin: 0vh 0px 0vh 0px !important;
      top: 0vh !important;
      padding: 0 0 0 48px !important;
      font-size: 25px !important;
      text-align: left !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      opacity: 1 !important;
  color: white !important;
  /*background: gold !important;*/
  /*border: 1px solid red !important;*/
  }



  /* (new165) THEME - REVIEWS LINKS */
  .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-header .AddonBadges .Badge:not([data-testid="badge-recommended"], [data-testid="badge-line"], [data-testid="badge-experimental-badge"], [data-testid="badge-android"]) a.Badge-link[href*="/reviews/"] .Badge-content {
      color: peru !important;
  }
  .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-header .AddonBadges .Badge:not([data-testid="badge-recommended"], [data-testid="badge-line"], [data-testid="badge-android"]) a.Badge-link[href*="/reviews/"]:visited .Badge-content  {
      color: tomato !important;
  }

  /* (new165) THEME - INSTAL */
  .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-header .Addon-install  {
      position: absolute !important;
      display: inline-block !important;
      width: 100%;
      min-width: 58% !important;
      max-width: 58% !important;
      height: 100% !important;
      min-height: 3vh !important;
      max-height: 3vh !important;
      line-height: 3vh !important;
      top: 41vh !important;
      left: 1.4% !important;
      order: unset !important;
      overflow: hidden;
  background: rgb(30, 36, 52) !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }
  .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-header .Addon-install .InstallButtonWrapper {
      margin: 0 0 0 0 !important;
  }

  /* (new165) THEME - LEFT / RIGHT - RATING / DESCRIPTION */
  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-main-content .Addon-description-and-ratings {
      display: inline-block !important;
      height: 0 !important;
      padding: 0 !important;
  /*background: brown !important;*/
  }



  /* (new165) LEFT - RATING */
  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-main-content .Addon-description-and-ratings section.Card.Addon-overall-rating {
      position: fixed!important;
      display: inline-block !important;
      grid-template: unset !important;
      box-sizing: unset !important;
      min-width: 20.6% !important;
      max-width: 20% !important;
      min-height: 24.6vh !important;
      left: 1% !important;
      top: 26.1vh  !important;
      padding: 10px !important;
      border-radius: 9px !important;
      overflow-wrap: anywhere;
      word-break: break-word;
      z-index:  500000000 !important;
  background: rgb(30, 36, 52) !important;
  }

  /* (new165) THEME - RATIGN */
  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-main-content .Addon-description-and-ratings section.Card.Addon-overall-rating {
      width: 100% !important;
      height: 20vh !important;
      margin-bottom: 0px !important;
  /*outline: 1px solid blue;*/
  }
  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-main-content .Addon-description-and-ratings section.Card.Addon-overall-rating > .Card-contents {
      width: 100% !important;
      height: 20vh !important;
      padding: 0px !important;
  }



  /* (new165) THEME - RATIGN - A VOIR */
  .Addon.Addon-extension .RatingManager form .RatingManager-ratingControl {
      position: relative;
      display: inline-block !important;
      width: 100%;
      height: 21px !important;
      top: -21px !important;
      z-index: -1 !important;
  }
  .Addon.Addon-extension .RatingManager form:hover .RatingManager-ratingControl {
      position: relative;
      display: inline-block !important;
      width: 100%;
      top: 0vh !important;
      z-index: 10 !important;
  }

  /* (new165) OLD FIRST - A VOIR */
  /* (new164) LOG to RATE EXTENSION */
  .Addon.Addon-extension .RatingManager form .RatingManager-ratingControl .Button.Button--action.RatingManager-log-in-to-rate-button.Button--micro {
      width: 170px !important;
      left: 83px !important;
      top: 1.6vh !important;
      padding: 2px !important;
      opacity: 0 !important;
      pointer-events: none !important;
  }
  .Addon.Addon-extension .RatingManager form:hover .RatingManager-ratingControl .Button.Button--action.RatingManager-log-in-to-rate-button.Button--micro {
      top: -1vh !important;
      left: 24% !important;
      transition: all ease 1s !important;
      opacity: 1 !important;
  background: gold !important;
  }
  .Addon.Addon-extension .RatingManager form .RatingManager-ratingControl .Button.Button--action.RatingManager-log-in-to-rate-button.Button--micro + .Rating.Rating--large {
      transition: all ease 1s !important;
      opacity: 1 !important;

  }
  .RatingManager .RatingManager-ratingControl .Rating.Rating--large.RatingManager-UserRating.Rating--editable {
      grid-column-gap: 3px !important;
      min-height: 17px !important;
      width: 100%;
      margin: 0 !important;
  }
  .RatingManager .RatingManager-ratingControl .Rating.Rating--large.RatingManager-UserRating.Rating--editable button {
      position: relative !important;
      display: inline-block !important;
      width: 25px !important;
      height: 20px !important;
      line-height: 30px !important;
      margin-left: 8px !important;
      margin-right: -10px !important;
  }
  .RatingManager .RatingManager-ratingControl .Rating.Rating--large.RatingManager-UserRating.Rating--editable button .Icon.Icon-inline-content.IconStar svg.IconStar-svg {
      height: 20px;
      width: 20px;
  }

  /* (new168) DESCRIPTION - RIGHT - BOTTOM */
  .Page-not-homepage:has(.Addon.Addon-statictheme.Addon-theme) .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-main-content .Addon-description-and-ratings section.Card.ShowMoreCard.AddonDescription ,
  .Addon.Addon-statictheme.Addon-theme .Card.Addon-content.Card--no-header.Card--no-footer .Card-contents .Addon-header + .Addon-main-content .Addon-description-and-ratings .Card.ShowMoreCard.AddonDescription.Card--no-style{
      position: fixed !important;
      display: inline-block !important;
      width: 100%;
      min-width: 68% !important;
      max-width: 68% !important;
      height: 100% !important;
      min-height: 34vh !important;
      max-height: 34vh !important;
      top: unset !important;
      bottom: 1vh !important;
      left: 25% !important;
      order: unset !important;
      overflow: hidden !important;
  background: #272e41 !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }
  .Addon.Addon-statictheme.Addon-theme .Card.Addon-content.Card--no-header.Card--no-footer .Card-contents .Addon-header + .Addon-main-content .Addon-description-and-ratings .Card.ShowMoreCard.AddonDescription.Card--no-style .Card-contents {
      display: inline-block !important;
      width: 100% !important;
      min-width: 97% !important;
      max-width: 97% !important;
      height: 100% !important;
      min-height: 29vh !important;
      max-height: 29vh !important;
      overflow: hidden !important;
  background: #272e41 !important;
  border: 1px solid red !important;
  }
  .Addon.Addon-statictheme.Addon-theme .Card.Addon-content.Card--no-header.Card--no-footer .Card-contents .Addon-header + .Addon-main-content .Addon-description-and-ratings .Card.ShowMoreCard.AddonDescription.Card--no-style .Card-contents .ShowMoreCard-contents .AddonDescription-contents {
      display: inline-block !important;
      width: 96.5% !important;
      height: 100% !important;
      min-height: 27vh !important;
      max-height: 27vh !important;
      border-radius: 0 0 9px 9px  !important;
      overflow: hidden auto !important;
  background: #272e41 !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;

  }
  `;
}
if ((location.hostname === "addons-dev.allizom.org" || location.hostname.endsWith(".addons-dev.allizom.org")) || location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* AMO DEV - addons-dev.allizom.org (new154)==== */

  /* (new165) WIDE */
  .Page-amo .Page-content:not(:has(.Home)) .Page.Page-not-homepage {
      min-width: 100% !important;
      max-width: 100% !important;
  /*border: 1px solid red !important;*/
  }
  .Page-amo .Page-content:not(:has(.Home)) .Page.Page-not-homepage .Addon.Addon-extension {
      min-width: 100% !important;
      max-width: 100% !important;
  /*border: 1px solid red !important;*/
  }
  /* (new154) INDICATOR */
  .Header-title:after {
      content: "addons-dev.allizom.org" !important;
      position: absolute !important;
      display: inline-block !important;
      top: 6vh !important;
      font-size: 8px  !important;
  color: white !important;
  /*background: blue !important;*/
  }

  /* MORE INFO - BOTTOM PART */
  .Page-amo .Page-content .Addon-details .Card.AddonMoreInfo.Card--no-footer .Card-contents dl.DefinitionList.AddonMoreInfo-dl {
      margin:  0 0 0 0 !important;
      -moz-column-count: unset !important;
      column-count: unset !important;
  }
  .Page-amo .Page-not-homepage .Addon.Addon-extension .Addon-details .Card.AddonMoreInfo.Card--no-footer .Card-contents dl {
      display: inline-block !important;
      float: none !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin:  0 0 0 0 !important;
      padding: 3vh 5px 0 5px !important;
  /*border: 1px solid pink !important;*/
  }
  /* MORE INFO BOTTOM - INFOS LINKS UL ALL */

  .Page-amo .Page-not-homepage .Addon.Addon-extension .Addon-details .Card.AddonMoreInfo.Card--no-footer .Card-contents dl > div:not(:has(.AddonMoreInfo-last-updated, .AddAddonToCollection )) dt {
      position: relative !important;
      display: block !important;
      float: left !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 2vh !important;
  /*border: 1px solid yellow !important;*/
  }
  .Page-amo .Page-not-homepage .Addon.Addon-extension .Addon-details .Card.AddonMoreInfo.Card--no-footer .Card-contents dl > div:not(:has(.AddonMoreInfo-last-updated, .AddAddonToCollection )) dd {
      position: relative !important;
      display: block !important;
      float: left !important;
      min-width: 100% !important;
      max-width: 100% !important;
  /*border: 1px solid aqua !important;*/
  }

  .Page-amo .Page-not-homepage .Addon.Addon-extension .Addon-details .Card.AddonMoreInfo.Card--no-footer .Card-contents dl > div:not(:has(.AddonMoreInfo-last-updated, .AddAddonToCollection )) dd ul{
      position: relative !important;
      display: block !important;
      float: left !important;
      min-width: 100% !important;
      max-width: 100% !important;
  /*border: 1px solid aqua !important;*/
  }


  /* (new154) ADDON DATE UPDATE - === */
  #react-view .Page-amo .Page-not-homepage .Addon.Addon-extension .Addon-details .Card.AddonMoreInfo.Card--no-footer .Card-contents dl > div:has(.AddonMoreInfo-last-updated) .Definition-dd.AddonMoreInfo-last-updated{
      position: fixed !important;
      display: inline-block !important;
      height: 100% !important;
      min-height: 2vh !important;
      max-height: 2vh !important;
      line-height: 1.5vh !important;
      width: 100% !important;
      min-width: 13% !important;
      max-width: 13% !important;
      top: 17% !important;
      bottom: unset !important;
      left: 5% !important;
      padding-left: 15px !important;
      text-align: left !important;
      border-radius: 0 5px 5px 0 !important;
      z-index: 500000000 !important;
  color: gold !important;
  background: #A33434 !important;
  border: 1px solid rgba(12, 12, 13, 0.9);
  }
  #react-view .Page-amo .Page-not-homepage .Addon.Addon-extension .Addon-details .Card.AddonMoreInfo.Card--no-footer .Card-contents dl > div:has(.AddonMoreInfo-last-updated) .Definition-dd.AddonMoreInfo-last-updated:before {
      content: "Update: ";
      position: absolute !important;
      display: inline-block !important;
      height: 100% !important;
      min-height: 1.8vh !important;
      max-height: 1.8vh !important;
      line-height: 1.5vh !important;
      width: 26% !important;
      left: -35px !important;
      margin: 0 0 0 -20px!important;
      padding: 0 0 0 8px !important;
      text-align: left;
      font-size: 13px !important;
      border-radius: 5px 0 0 5px !important;
  color: white !important;
  background: #ad5b5b !important;
  }

  /* THEME DATE UPDATE - === */
  #react-view .Page-amo .Page-not-homepage .Addon.Addon-statictheme.Addon-theme .Addon-details .Card.AddonMoreInfo.Card--no-footer .Card-contents dl > div:has(.AddonMoreInfo-last-updated) .AddonMoreInfo-last-updated {
      position: fixed !important;
      display: inline-block !important;
      height: 100% !important;
      min-height: 2vh !important;
      max-height: 2vh !important;
      line-height: 1.5vh !important;
      width: 100% !important;
      min-width: 13% !important;
      max-width: 13% !important;
      top: 17% !important;
      bottom: unset !important;
      left: 5% !important;
      padding-left: 15px !important;
      text-align: left !important;
      border-radius: 0 5px 5px 0 !important;
      z-index: 500000000 !important;
  color: gold !important;
  background: brown !important;
  border: 1px solid rgba(12, 12, 13, 0.9);
  }
  #react-view .Page-amo .Page-not-homepage .Addon.Addon-statictheme.Addon-theme .Addon-details .Card.AddonMoreInfo.Card--no-footer .Card-contents dl > div:has(.AddonMoreInfo-last-updated) .AddonMoreInfo-last-updated:before {
      content: "Update: ";
      position: absolute !important;
      display: inline-block !important;
      height: 100% !important;
      min-height: 1.8vh !important;
      max-height: 1.8vh !important;
      line-height: 1.5vh !important;
      width: 28% !important;
      left: -35px !important;
      margin: 0 0 0 -20px!important;
      padding: 0 0 0 8px !important;
      text-align: left;
      font-size: 13px !important;
      border-radius: 5px 0 0 5px !important;
  color: white !important;
  background: #ad5b5b !important;
  }

  /*.Definition-dd.AddonMoreInfo-version + .Definition-dt {
      color: transparent !important;
  }*/
  #react-view .Page-amo .Page-not-homepage .Addon.Addon-extension .Addon-details .Card.AddonMoreInfo.Card--no-footer .Card-contents dl > div:has(.AddonMoreInfo-last-updated)  .Definition-dt {
      display: none !important;
  }



  /* (new162) - THEME - RATING */
  .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-statictheme.Addon-theme .Addon-description-rating-card section.Card.Addon-overall-rating .Card-contents .RatingManager {
      position: fixed !important;
      display: inline-block !important;
      float: none !important;
      min-width: 19.8% !important;
      max-width: 20% !important;
      height: 30vh !important;
      line-height: 4vh !important;
      left:  10px !important;
      top: 50vh !important;
      margin:  0 0 0 0 !important;
      border-radius: 0 0 9px 9px !important;
  /*background: gold !important;*/
  /*border: 1px solid yellow !important;*/
  }




  /* END ==== (new128) ORL-PREF - addons-dev.allizom.org" ==== */
  `;
}
if ((location.hostname === "blog.mozilla.org" || location.hostname.endsWith(".blog.mozilla.org"))) {
  css += `
  /* ==== AMO BLOG - Blog.mozilla.org -  */
  @media (min-width: 1312px) {
      .ft-l-container {
          max-width: 1652px !important;
      }
  }
  @media (min-width: 480px) {
      .mzp-c-card {
          max-width: 642px !important;
          margin-bottom: -6vh;
          /*border: 1px solid red !important;*/
      }
  }


  /* TOP HEADER - SMALL IMG */
  .post-template-default.single.single-post.single-format-standard.no-sidebar .ft-c-single-post.type-post.status-publish.format-standard.has-post-thumbnail img.ft-c-single-post__featured-image {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 25vh !important;
      margin-bottom: 20px;
      object-fit: contain !important;
  }


  #page.site .ft-c-archive-header.ftc-archive-header--has-image {
      position: relative !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 25vh !important;
      padding: 0 0 !important;
      /*border: 1px solid yellow !important;*/
  }
  .ft-c-archive-header img {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 25vh !important;
      margin-bottom: 20px;
      object-fit: contain !important;
  }

  /* TOP HEADER - SMALL VIDEO */
  .post-template-default.single.single-post.single-format-standard.no-sidebar .ft-c-single-post.type-post.status-publish.format-standard.has-post-thumbnail div .ft-c-single-post__featured-video {
      position: absolute !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 20% !important;
      max-width: 20% !important;
      height: 28vh !important;
      left: 0 !important;
      padding: 0 0 !important;
      text-align: center !important;
      border: 1px solid red !important;
  }
  .post-template-default.single.single-post.single-format-standard.no-sidebar .ft-c-single-post.type-post.status-publish.format-standard.has-post-thumbnail .ft-c-single-post__featured-video.video-responsive iframe {
      display: inline-block !important;
      width: 100% !important;

      height: 28vh !important;
      margin-bottom: 20px;
      object-fit: contain !important;
  }

  /* SMALL VIDEO */
  .ft-c-single-post__featured-video,
  .wp-block-embed.is-type-video {
      position: fixed !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 20% !important;
      max-width: 20% !important;
      height: 28vh !important;
      left: 0 !important;
      top: 7vh !important;
      padding: 0 0 !important;
      text-align: center !important;
      border: 1px solid red !important;
  }
  .wp-block-embed.is-type-video .wp-block-embed__wrapper {
      display: inline-block !important;
      width: 100% !important;
      height: 28vh !important;
      margin-bottom: 20px;
      object-fit: contain !important;
  }

  /* CARD - SMALL IMG */
  .wp-block-image img {
      box-sizing: border-box;
      height: 25vh !important;
      max-width: 100%;
      vertical-align: bottom;
      object-fit: contain !important;
  }
  /* CAR - IMG */
  a.mzp-c-card-block-link > .mzp-c-card-media-wrapper {
      position: relative !important;
      display: inline-block !important;
      max-width: 34% !important;
      padding: 0 0 !important;
      /*border: 1px solid aqua !important;*/
  }
  .mzp-c-card.mzp-has-aspect-1-1 .mzp-c-card-media-wrapper {
      position: relative;
      display: inline-block !important;
      height: 25vh !important;
      width: 36% !important;
      padding-bottom: 0% !important;
      background-color: transparent !important;
      /*border: 1px solid red !important;*/
  }
  .mzp-c-card .mzp-c-card-media-wrapper {
      margin-bottom: 7px;
  }
  .mzp-c-card .mzp-c-card-image,
  .mzp-c-card .mzp-c-card-video {
      display: inline-block !important;
      max-width: none;
      width: 100%;
      max-height: 100% !important;
      /*border: 1px solid aqua !important;*/
  }

  /* (COR FLOAT) CAR - INFOS */
  a.mzp-c-card-block-link > .mzp-c-card-content {
      position: relative !important;
      display: block !important;
      float: right !important;
      clear: none !important;
      width: 63% !important;
      height: 25vh !important;
      margin: 0vh 0 0 0 !important;
      top: 0vh !important;
      padding: 0;
      /*border: 1px solid aqua !important;*/
  }


  /* BOTTOM POST NAV */
  .ft-c-post-nav .ft-c-post__wrap {
      width: 53% !important;
      background-color: #f0f0f4;
      border: 1px solid aqua !important;
  }

  /* BOTTOM RELATED */
  #related-articles .ft-l-container {
      width: 53% !important;
      background-color: #f0f0f4;
      border: 1px solid aqua !important;
  }
  #related-articles .ft-l-container .ft-c-post-list__wrap--three-column {
      grid-gap: 20px;
      grid-template-columns: 1fr 1fr 1fr;
  }
  #related-articles .ft-l-container .mzp-c-card {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      background: #fff;
      margin: 0 0 0 0 !important;
  }
  .mzp-c-card .mzp-c-card-title {
      font-size: 15px !important;
      line-height: 15px;
  }
  /* SUPERLOADER */
  .sp-separator ~ #page.site .ft-c-archive-header.ftc-archive-header--has-image,
  .sp-separator ~ #page.site > .mzp-c-footer,
  .sp-separator ~ #page.site > .ft-l-container,
  .sp-separator ~ #page.site header {
      display: none !important;
  }

  .content.posts-grid.hfeed .sp-separator {
      float: left;
      width: 100% !important;
      margin-bottom: 40px;
      padding: 0 0 0 0 !important;
  }

  /* MOZILLA BLOG */
  .header {
      background-color: #20123a;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: 100% center !important;
      height: 100%;
      min-height: 20vh;
  }
  .header h1 {
      margin: -13vh 0 0 23% !important;
      font-size: 30px !important;
  }

  .blogpost-content-wrapper h2 {
      font-size: 20px;
      line-height: 1.2;
      margin-bottom: 0;
  }

  /* COLOR */
  /* TXT - SILVER */
  .blogpost-content-wrapper h4,
  .blogpost-content-wrapper h2,
  .blogpost-content-wrapper h3,
  .blogpost-content-wrapper li,
  .blogpost .blogpost-content-wrapper p,
  .blog-entry-excerpt > :first-child,
  .blogpost-content-wrapper figcaption,
  .header h1 {
      color: silver !important;
  }


  /* TXT - BLACK LIGHT */
  h1,
  h2,
  .blogpost-content-wrapper p,
  .blogpost-content-wrapper,
  .blog-entry-title {
      color: #111 !important;
  }


  /* LINK - PERU */
  a.blog-entry-link h2.blog-entry-title,
  a {
      color: peru !important;
  }

  a.blog-entry-link:visited h2.blog-entry-title,
  a:visited {
      color: tomato !important;
  }


  /* MOZILLA BLOG - END - URL-PREF === */
  `;
}
if (location.href.startsWith("https://addons.mozilla.org/fr/firefox/search/?promoted=") || location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* SEARCH Promoted - TITL​E */
  .Search .SearchContextCard-header:before {
      content: "[PROMOTED]" !important;
      margin: 0px 20px 0 0 !important;
      font-size: 15px !important;
      overflow-wrap: break-word;
      color: gold !important;
  }
  `;
}
if (location.href.startsWith("https://addons.mozilla.org/fr/firefox/search/?promoted=recommended&") || location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* SEARCH Promoted - > Recommended - TITLE */
  .Search .SearchContextCard-header:after {
      content: "[⇒ Recommended]" !important;
      margin: 0px 0 0 20px !important;
      font-size: 15px !important;
      overflow-wrap: break-word;
      color: gold !important;
  }
  `;
}
if (location.href.startsWith("https://addons.mozilla.org/fr/firefox/search/?promoted=recommended&sort=hotness&type=extension") || location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* SEARCH Promoted - > Recommendes BY Popularity - TITLE */
  .Search .SearchContextCard-header:after {
      content: "[⇒ Recommended by Popularity]" !important;
      margin: 0px 0 0 20px !important;
      font-size: 15px !important;
      overflow-wrap: break-word;
      color: gold !important;
  }
  `;
}
if (location.href.startsWith("https://addons.mozilla.org/fr/firefox/search/?promoted=recommended&sort=rating") || location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* SEARCH Promoted - > Recommended by Rating - TITLE */
  .Search .SearchContextCard-header:after {
      content: "[⇒ Recommended by Rating]" !important;
      margin: 0px 0 0 20px !important;
      font-size: 15px !important;
      overflow-wrap: break-word;
      color: gold !important;
  }
  `;
}
if ((location.hostname === "addons-dev.allizom.org" || location.hostname.endsWith(".addons-dev.allizom.org")) || (location.hostname === "addons.mozilla.org" || location.hostname.endsWith(".addons.mozilla.org")) || location.href.startsWith("https://addons.mozilla.org./") || location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* == 3nd DESIGN + DEVAZILLON  === */

  /* (new168) RELEASE NOTES NOT PRESENT NOW :not(:has(.Card.AddonDescription-version-notes)) */

  .Page-content:not(:has(.Home)) {
      display: inline-block !important;
      height: 100% !important;
      min-height: 91.3vh !important;
      max-height: 91.3vh !important;
      overflow: hidden !important;
      padding: 0px !important;
  /*border: 1px solid aqua !important;*/
  }
  .Addon-header {
      position: absolute !important;
      display: inline-block !important;
      grid-template: unset !important;
      min-height: 43vh !important;
      max-height: 43vh !important;
      width: 21.1% !important;
      margin: 0vh 0px 0px !important;
      padding: 5px 10px !important;
      border-radius: 9px !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }

  .Card.Addon-content.Card--no-header.Card--no-footer .Addon-header + .Addon-main-content {
      display: block !important;
      float: right !important;
      grid-template: unset !important;
      box-sizing: unset !important;
      min-width: 78.8% !important;
      max-width: 78.8% !important;
      height: 45.6vh !important;
      margin: -1vh -1% 0px 0px !important;
      overflow-wrap: anywhere;
      word-break: break-word;
  /*border: 1px dashed gold !important;*/
  }

  .AddonDescription-contents {
      display: inline-block !important;
      grid-template: unset !important;
      box-sizing: unset !important;
      width: 92.8% !important;
      height: 37vh !important;
      top: 0vh !important;
      margin: 0 0 0 0 !important;
      padding: 0 20px 15px 20px!important;
      overflow: hidden auto !important;
  /*background: #111 !important;*/
  }

  /* (new171) WITH DESCR */
  .Addon-description-and-ratings:has(.Card.ShowMoreCard.AddonDescription) {
      position: absolute !important;
      display: inline-block !important;
      grid-template: unset !important;
      box-sizing: unset !important;
      width: 31.2% !important;
      height: 45vh !important;
      top: 9vh !important;
      left: 22.6% !important;
      margin: 0px !important;
      padding: 0px !important;
      border-radius: 9px !important;
      border: 1px solid #283046 !important;
  /*border: 1px solid aqua !important;*/
  }

  .Addon-description-and-ratings:has(.Card.ShowMoreCard.AddonDescription) .Card.ShowMoreCard.AddonDescription.Card--no-style {
      position: absolute !important;
      display: inline-block !important;
      grid-template: unset !important;
      box-sizing: unset !important;
      width: 100% !important;
      height: 100% !important;
      min-height: 44.5vh !important;
      max-height: 44.5vh !important;
      top: 0 !important;
      margin: 0px !important;
      padding: 0px !important;
      border-radius: 9px !important;
      z-index: 1!important;
  border: 1px solid red !important;
  }
  .Addon-description-and-ratings:has(.Card.ShowMoreCard.AddonDescription) .Card.ShowMoreCard.AddonDescription header.Card-header {
      margin: 0 0 0 0 !important;
      padding: 0;
      border-radius: 9px 9px 0 0 !important;
  }
  .Addon-description-and-ratings:has(.Card.ShowMoreCard.AddonDescription) .Card.ShowMoreCard.AddonDescription.Card--no-style .Card-contents{
      height: 100% !important;
      min-height: 39.9vh !important;
      max-height: 39.9vh !important;
      margin: 0 0 0 0 !important;
      padding: 0;
      border-radius: 0 0 9px 9px !important;
  /*border: 1px solid red !important;*/
  }

  .Addon-description-and-ratings:has(.Card.ShowMoreCard.AddonDescription) .Card.ShowMoreCard.AddonDescription .Card-contents + .Card-footer:has(.ShowMoreCard-expand-link){
    display: none !important;
  }

  /* (new168) LEFT - RATING */
  section.Card.Addon-content.Card--photon.Card--no-header.Card--no-footer .Card-contents .Addon-header + .Addon-main-content .Addon-description-and-ratings section.Card.Addon-overall-rating ,
   .Addon-description-and-ratings .Addon-overall-rating {
      position: fixed!important;
      display: inline-block !important;
      grid-template: unset !important;
      box-sizing: unset !important;
      min-width: 20% !important;
      max-width: 20% !important;
      min-height: 4.6vh !important;
      left: 1.2% !important;
      top: 46.1vh  !important;
      padding: 3px !important;
      border-radius: 0 0 9px 9px !important;
      overflow-wrap: anywhere;
      word-break: break-word;
      z-index:  500000000 !important;
  /*background: aqua !important;*/
  }

  /* (new168) RATIGN */
  .Card.Addon-overall-rating {
      width: 0% !important;
      height: 0 !important;
      margin-bottom: 0px !important;
  /*outline: 1px solid blue;*/
  }
  .Card.Addon-overall-rating .Card-contents {
      height: 0vh !important;
      padding: 0px !important;
  }
  /* (new168) */
  .Addon.Addon-extension .RatingManager form .RatingManager-ratingControl {
      position: relative;
      display: inline-block !important;
      width: 100%;
      height: 21px !important;
      top: -21px !important;
      z-index: -1 !important;
  }
  .Addon.Addon-extension .RatingManager form:hover .RatingManager-ratingControl {
      position: relative;
      display: inline-block !important;
      width: 100%;
      top: 0vh !important;
      z-index: 10 !important;
  }

  /* (new168) LOG to RATE EXTENSION */
  .Addon.Addon-extension .RatingManager form .RatingManager-ratingControl .Button.Button--action.RatingManager-log-in-to-rate-button.Button--micro {
      width: 170px !important;
      left: 83px !important;
      top: 1.6vh !important;
      padding: 2px !important;
      opacity: 0 !important;
      pointer-events: none !important;
  }
  .Addon.Addon-extension .RatingManager form:hover .RatingManager-ratingControl .Button.Button--action.RatingManager-log-in-to-rate-button.Button--micro {
      top: -1vh !important;
      left: 24% !important;
      transition: all ease 1s !important;
      opacity: 1 !important;
  background: gold !important;
  }
  .Addon.Addon-extension .RatingManager form .RatingManager-ratingControl .Button.Button--action.RatingManager-log-in-to-rate-button.Button--micro + .Rating.Rating--large {
      transition: all ease 1s !important;
      opacity: 1 !important;

  }
  .RatingManager .RatingManager-ratingControl .Rating.Rating--large.RatingManager-UserRating.Rating--editable {
      grid-column-gap: 3px !important;
      min-height: 17px !important;
      width: 100%;
      margin: 0 !important;
  }
  .RatingManager .RatingManager-ratingControl .Rating.Rating--large.RatingManager-UserRating.Rating--editable button {
      position: relative !important;
      display: inline-block !important;
      width: 25px !important;
      height: 20px !important;
      line-height: 30px !important;
      margin-left: 8px !important;
      margin-right: -10px !important;
  }
  .RatingManager .RatingManager-ratingControl .Rating.Rating--large.RatingManager-UserRating.Rating--editable button .Icon.Icon-inline-content.IconStar svg.IconStar-svg {
      height: 20px;
      width: 20px;
  }


  /* (new168) ADDON - ADD OUR FAV STAR to ADDON PAGE - === */
  .RatingManager .RatingManager-ratingControl .Rating-star.Rating-rating-5.Rating-selected-star:after {
      position: fixed !important;
      display: inline-block !important;
      content: "★";
      width: 30px !important;
      height: 30px !important;
      line-height: 25px !important;
      top: -32vh !important;
      left: 220px !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      border-radius: 9px 0px 9px 9px !important;
      font-size: 30px !important;
      text-align: center !important;
      opacity: 1 !important;
      visibility: visible !important;
  color: gold;
  background-color: blue !important;
  }
  /* (new168) HOVER */
  .Addon.Addon-extension .RatingManager > form:hover .RatingManager-ratingControl .Rating-star.Rating-rating-5.Rating-selected-star:after {
      top: -33vh !important;
  color: green;
  background: gold !important;
  }
  .RatingManager .RatingManager-ratingControl .Rating-star.Rating-rating-5.Rating-selected-star:before {
      position: fixed !important;
      display: inline-block !important;
      content: "5";
      width: 10px !important;
      height: 15px !important;
      line-height: 14px !important;
      text-align: center !important;
      top: -32.5vh !important;
      left: 245px !important;
      border-radius: 9px !important;
      font-size: 10px !important;
      opacity: 1 !important;
      visibility: visible !important;
      z-index: 5000000 !important;
  color: red;
  background: blue !important;
  }
  .Addon.Addon-extension .RatingManager > form:hover .RatingManager-ratingControl .Rating-star.Rating-rating-5.Rating-selected-star:before {
      top: -34vh !important;
  color: red;
  background: gold !important;
  }



  /* (new168) ADDON - ==== RATING ==== */

  /* (new168) when No Screenshot / NO description */
  .Addon-main-content:not(:has(.Card.Addon-screenshots)) .Card.Addon-description-rating-card.Card--no-header.Card--no-footer .Card.Addon-overall-rating ,
  .Addon-main-content:not(:has(.Card.Addon-screenshots)):not(:has(.AddonDescription-contents)) .Card.Addon-description-rating-card.Card--no-header.Card--no-footer .Card.Addon-overall-rating {
      left: -27.1% !important;
  border: 1px dashed aqua !important;
  }

  /* (new168)  */
  /* .RatingsByStar-graph  */
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager .RatingManager-ratingControl {
      position: relative !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 98% !important;
      max-width: 98% !important;
      height: 100% !important;
      min-height: 4vh !important;
      max-height: 4vh !important;
      margin: 0vh 0 0 0px  !important;
      padding:  0 0px  !important;
  /*background: brown !important;*/
  /*border: 1px dashed aqua !important;*/
  }


  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager {
      display: inline-block !important;
      width: 100% !important;
      height: 100% !important;
      min-height: 0vh !important;
      max-height: 0vh !important;
      margin: 0vh 0 0 0  !important;
      padding:  0 20px  !important;
  /*background: brown !important;*/
  /*border: 1px dashed aqua !important;*/
  }
  /* (new168) */
  /* HOVER */
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager:hover {
      position: absolute;
      display: inline-block !important;
      flex-direction: unset !important;
      gap: unset !important;
      width: 100% !important;
      height: 100% !important;
      min-height: 25vh !important;
      max-height: 25vh !important;
      margin: 0vh 0 0 0  !important;
      padding:  9vh 20px  0 20px !important;
      z-index: 500000  !important;
  background: #1f2536 !important;
  border: 1px solid red !important;
  }
  /* (new168) RATTING -  STAR FORM */
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager form[action] {
      position: absolute;
      display: inline-block !important;
      flex-direction: unset !important;
      gap: unset !important;
      min-height: 4vh !important;
      max-height: 4vh !important;
      width: 100% !important;
      min-width: 96%!important;
      max-width: 96% !important;
      left: 6px !important;
      margin: 0px 0 0 0 !important;
      top: 0.5vh !important;
      padding: 0 0px !important;
  background: #111 !important;
  }
  /* (new168) */
  /* HOVER */
  .Page-amo .Page-content .Addon.Addon-extension .Addon-details section.Card.Addon-overall-rating:hover .RatingManager form[action] {
      position: absolute;
      display: inline-block !important;
      flex-direction: unset !important;
      gap: unset !important;
      min-height: 8vh !important;
      max-height: 8vh !important;
      width: 100% !important;
      min-width: 100%!important;
      max-width: 100% !important;
      left: 0 !important;
      margin: 0px 0 0 0 !important;
      top: 0vh !important;
  background: peru !important;
  }
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager form[action] fieldset  {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100%!important;
      max-width: 100% !important;
      height: 100% !important;
      min-height: 0vh !important;
      max-height: 0vh !important;
      margin: 0px 0 0px 0 !important;
      top: 0px !important;
      padding: 0 !important;
  /*background: blue !important;*/
  }
  /* (new168) */
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager form[action] fieldset legend {
      display: none  !important;
  }


  /* (new168) RATING - CLICK TO RATE */
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager form[action] fieldset .RatingManager-ratingControl {
      position: relative;
      display: inline-block !important;
      align-items: unset !important;
      flex-wrap: unset !important;
      gap: unset !important;
      width: 98% !important;
      height: 8.8vh !important;
      margin: 18px 0 -5px -2px !important;
      padding: 1px 5px !important;
      border-radius: 0 0 9px 9px !important;
  border: 1px solid #283046 !important;
  background: #075251 !important; 
  }
  /* (new165) OLD FIRST - A VOIR */
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager form[action]:hover fieldset .RatingManager-ratingControl {
      margin: -1px 0 0vh 0 !important;
  }
  /* (new168) RATING STARS */
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager form[action] fieldset .RatingManager-ratingControl .Rating.Rating--large {
      display: inline-block !important;
      width: 100%;
      max-width: 350px;
      min-width: 350px;
      min-height: 4vh !important;
  }
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager form[action] fieldset .RatingManager-ratingControl .Rating.Rating--large .Rating-star {
      display: inline-block !important;
      min-width: 20px !important;
      height: 2.2vh !important;
      margin: 0px -8px 0 18px !important;
      top: -0.6vh !important;
      padding: 0px !important;
      border-radius: 100% !important;
  /*border: 1px solid rgba(12, 12, 13, 0.9) !important;*/
  }

  /* (new168) ADDON - RATING MANAGER - TOP LEFT - === */
  /* NOT NEED */
  .Card.Addon-overall-rating .Card-footer.Card-footer-link,
  .Card.Addon-overall-rating .Card-header {
      display: none !important;
  }
  /* (new168) RATING on HOVER - TOP LEFT - === */
  .Addon.Addon-extension .RatingManager form {
      position: absolute;
      width: 10.2% !important;
      height: 25px !important;
      left: 0.8% !important;
      top: 421px !important;
      padding: 2px 2px !important;
      border-radius: 5px !important;
      z-index: 1 !important;
  border: 1px solid #283046 !important;
  background: tan !important;
  }
  .Addon.Addon-extension .RatingManager form:hover {
      height: 57px !important;
      padding-bottom: 10px !important;
      z-index: 500 !important;
      transition: all ease 0.7s !important;
  background: black !important;
  border: 1px solid red !important;
  }
  .Addon.Addon-extension .Card-contents .RatingManager form > fieldset {
      display: inline-block !important;
      width: 100% !important;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      line-height: 15px !important;
      text-align: left;
  /*background: green !important;*/
  }
  .Addon.Addon-extension .RatingManager legend.RatingManager-legend {
      display: inline-block !important;
      width: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      line-height: 10px !important;
      overflow-wrap: break-word;
      font-size: 0;
      z-index: -1 !important;
  }


  /* (new170) RATING - DELETE RATING */
  .AddonReviewCard.RatingManager-AddonReviewCard.AddonReviewCard-ratingOnly.AddonReviewCard-viewOnly.AddonReviewCard-slim ,
  .AddonReviewCard.RatingManager-AddonReviewCard.AddonReviewCard-ratingOnly.AddonReviewCard-viewOnly.AddonReviewCard-slim .AddonReviewCard-container  {
      height: auto !important;
      min-height: 0 !important;
      max-block-size: unset  !important;
      padding: 0 !important;
  }
  /*.AddonReviewCard.RatingManager-AddonReviewCard.AddonReviewCard-ratingOnly.AddonReviewCard-viewOnly.AddonReviewCard-slim .AddonReviewCard-container .UserReview:has(div:empty) {
      display: none  !important;
      height: auto !important;
      min-height: 0 !important;
      max-block-size: unset  !important;
      padding: 0 !important;
  }*/


  /* (new170) RATING - DELETE RATING - CONFIRMATION DIALOG */
  .AddonReviewCard-slim .AddonReviewCard-confirmDeleteDialog {
      position: fixed !important;
      display: inline-block !important;
      width: 19%;
      height: auto !important;
      margin: 0 0 0 0 !important;
      bottom:  53vh !important;
      text-align: center;
      padding:  5px !important;
      border-radius: 5px !important;
      z-index: 5000 !important;
  background: black !important;
  border: 1px solid red !important;
  }
  .AddonReviewCard-slim .AddonReviewCard-confirmDeleteDialog .ConfirmationDialog-cancel-button, 
  .AddonReviewCard-slim .AddonReviewCard-confirmDeleteDialog .ConfirmationDialog-confirm-button {
      width: 50%;
      min-height: 3vh !important;
      max-height: 3vh !important;
      margin: 1vh 0 1vh 0 !important;
      padding: 0 0 !important;
    font-size: 16px;
    
  border: 1px solid red !important;
  }



  /* (new169) RECOM HORIZ */
  html .Page-amo .Page-content .Addon.Addon-extension > div:not(:has(.ScreenShots)) .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal {
      position: absolute !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 76.7% !important;
      max-width: 76.7% !important;
      max-height: 17vh !important;
      min-height: 17vh !important;
      left: unset !important;
      right: 14px !important;
      top: 82vh !important;
      margin: 0vh 0% 0px 0px !important;
      border-radius: 9px  !important;
  /*background: brown !important;*/
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  /*border: 1px dashed lime!important;*/
  }
  .Card.CardList.AddonsCard.AddonRecommendations .Card-contents .AddonsCard-list {
      grid-auto-flow: row;
      grid-template-columns: repeat(4,1fr);
      min-width: 100% !important;
      max-width: 100% !important;
      border-radius: 9px !important;
  /*border: 1px solid lime !important;*/
  }
  .Card.CardList.AddonsCard.AddonRecommendations .Card-contents .AddonsCard-list .SearchResult {

      min-width: 98% !important;
      max-width: 98% !important;
      margin: 0vh 0px 0px 4px !important;
      border-radius: 9px !important;
  /*border: 1px solid lime !important;*/
  }

  .AddonsCard--horizontal ul.AddonsCard-list .SearchResult-metadata,
  .AddonsCard--horizontal ul.AddonsCard-list .SearchResult-metadata .SearchResult-author,
  .AddonsCard--horizontal ul.AddonsCard-list .SearchResult-summary {
      display: inline-block !important;
      margin-top: 10px !important;
  }

  /* (new132) */
  /*.AddonsCard--horizontal ul.AddonsCard-list .SearchResult-summary {
      display: inline-block !important;
      min-width: 250px !important;
      max-width: 250px !important;
      max-height: 57px !important;
      min-height: 57px !important;
      margin: -7px 0 -15px 0 !important;
  border: 1px solid red !important; 
  }*/

  .AddonsCard--horizontal ul.AddonsCard-list .SearchResult-metadata .SearchResult-author {
      line-height: 12px !important;
      margin-top: -10px !important;
  }
  .AddonsCard--horizontal ul.AddonsCard-list .SearchResult-icon-wrapper {
      grid-area: unset !important;
      -moz-box-ordinal-group: unset !important;
      order: unset !important;
      display: inline-block !important;
      width: 32px !important;
      height: 10vh !important;
      text-align: center !important;
  background: black !important;
  }

  /* (new137) LOADING TEXT */
  /*.AddonsCard--horizontal ul.AddonsCard-list .SearchResult-summary .LoadingText--width-80 {
      width: 50% !important;
  }*/


  .AddonsCard--horizontal ul.AddonsCard-list .SearchResult-contents {
      grid-column: unset !important;
      grid-row: unset !important;
      min-height: 10vh !important;
      max-height: 10vh !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0 0 -8vh 0 !important;
  /*background: olive !important;*/
  }
  .AddonRecommendations.AddonsCard--horizontal ul.AddonsCard-list .SearchResult-users {
      height: auto;
      min-height: 24px;
      margin: -1.8vh 0 0 0 !important;
    }

  /* (new169) RECOM HORIZ - BADGES */

  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal ul.AddonsCard-list  li.SearchResult .Badge.Badge--has-link[data-testid="badge-recommended"] {
    position: absolute !important;
    display: inline-block !important;
    width: auto !important;
    height: 1.5vh !important;
    line-height: 1.5vh !important;
    left: unset !important;
    margin: -3vh 0px 0px -19.8% !important;
    padding: 0px 0px 0px 5px !important;
    overflow: hidden !important;
    border-radius: 0px 0px 5px !important;
    z-index: 0;
      transition: background ease 0.7s !important;
    background: green !important;
    border: medium !important;
  }
  .Card.CardList.AddonsCard.AddonRecommendations.AddonsCard--horizontal ul.AddonsCard-list  li.SearchResult .Badge.Badge--has-link[data-testid="badge-recommended"]:hover {
    position: absolute !important;
    display: inline-block !important;
    width: auto !important;
    height: 1.5vh !important;
    line-height: 1.5vh !important;
    left: unset !important;
    margin: -3vh 0px 0px -13.4% !important;
    padding: 0px 0px 0px 5px !important;
    overflow: hidden !important;
    border-radius: 0px 0px 5px !important;
    z-index: 0;
      transition: background ease 0.7s !important;
    background: #8c7915 !important;
    border: medium !important;
  }

  /* (new368) SEARCH */
  .Card.ExpandableCard.SearchFilters.Card--no-footer + .SearchResults .Card.CardList.AddonsCard .Card-contents ul.AddonsCard-list{
      grid-auto-flow: row;
      grid-template-columns: repeat(4, 1fr);
      min-width: 100% !important;
      max-width: 100% !important;
      height: 77vh !important;
      top: 0vh !important;
      margin: 0 0 0 0 !important;
      padding: 1vh 20px 15px 20px!important;
      overflow: hidden auto !important;
      border-radius: 9px !important;
  /*background: olive !important;*/
  }
  .Card.ExpandableCard.SearchFilters.Card--no-footer + .SearchResults .Card.CardList.AddonsCard .Card-contents ul.AddonsCard-list li{
      grid-column: auto;
      width: 100% !important;
      min-width: 24.4% !important;
      max-width: 24.4% !important;
      min-height: 16vh !important;
      max-height: 16vh !important;
      margin: 0px 5px 5px 0 !important;
      padding: 5px 0 0 0 !important;
  /*border: 1px solid red !important;*/
  }

  /* (new368) COLLECTIONS LIST */
  .Collection .Collection-items section.Card.CardList.AddonsCard.Card--no-header .Card-contents ul.AddonsCard-list {
      grid-auto-flow: row;
      grid-template-columns: repeat(4, 1fr);
      min-width: 100% !important;
      max-width: 100% !important;
      height: 84vh !important;
      top: 0vh !important;
      margin: 0 0 0 0 !important;
      padding: 1vh 20px 15px 20px!important;
      overflow: hidden auto !important;
      border-radius: 9px !important;
  /*background: olive !important;*/
  }
  .Collection .Collection-items section.Card.CardList.AddonsCard.Card--no-header .Card-contents ul.AddonsCard-list li {
      grid-column: auto;
      width: 100% !important;
      min-width: 24.4% !important;
      max-width: 24.4% !important;
      min-height: 16vh !important;
      max-height: 16vh !important;
      margin: 0px 5px 5px 0 !important;
      padding: 5px 0 0 0 !important;
  /*border: 1px solid red !important;*/
  }














  `;
}
if ((location.hostname === "addons.mozilla.org" || location.hostname.endsWith(".addons.mozilla.org")) || (location.hostname === "addons-dev.allizom.org" || location.hostname.endsWith(".addons-dev.allizom.org")) || location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* A1 - SCR - NO PERM  - NOT PRESENT NOW - NO RELEASE not(:has(.Card.AddonDescription-version-notes))*/
  .Addon.Addon-extension:not(:has(.Card.PermissionsCard.Card--no-footer)):has(.Addon-screenshots) .Addon-main-content {
      min-height: 90.4vh !important;
  /*background: green  !important;*/
  }



  /* DESCRIPTION */
  .Addon.Addon-extension:not(:has(.Card.PermissionsCard.Card--no-footer)):has(.Addon-screenshots) .Addon-description-and-ratings .AddonDescription {
      min-height: 71.7vh !important;
  /*background: blue !important;*/

  }
  .Addon.Addon-extension:not(:has(.Card.PermissionsCard.Card--no-footer)):has(.Addon-screenshots) .Addon-description-and-ratings .AddonDescription .Card-contents {
      min-height: 68.5vh !important;
      max-height: 68.5vh !important;
      padding: 0 0px 0px 0px!important;
      border-radius: 0 0 9px 9px !important;
  /*border: 1px solid lime  !important;*/
  }

  .Addon.Addon-extension:not(:has(.Card.PermissionsCard.Card--no-footer)):has(.Addon-screenshots) .Addon-description-and-ratings .AddonDescription .Card-contents .ShowMoreCard-contents .AddonDescription-contents {
      display: inline-block !important;
      grid-template: unset !important;
      box-sizing: unset !important;
      width: 100% !important;
      height: 100% !important;
      min-height: 65vh !important;
      max-height: 65vh !important;
      top: 0vh !important;
      margin: 0 0 0 0 !important;
      padding: 0 0px 0px 0px!important;
      overflow: hidden auto !important;
  /*background: #111 !important;*/
  }

  .Addon.Addon-extension:not(:has(.Card.PermissionsCard.Card--no-footer)):has(.Addon-screenshots) .Addon-description-and-ratings .AddonDescription .Card-contents .ShowMoreCard-contents ,
  .Addon.Addon-extension:not(:has(.Card.PermissionsCard.Card--no-footer)):has(.Addon-screenshots) .Addon-description-and-ratings .AddonDescription .Card-contents .ShowMoreCard-contents .AddonDescription-contents .ShowMoreCard-contents {
      min-height: 69vh !important;
      max-height: 69vh !important;
  }


  /* SCREENSHOT */
  /* RIGHT - SCREENSHOTS - .ScreenShots .ScreenShots-viewport .ScreenShots-list */
  .Addon.Addon-extension:not(:has(.Card.PermissionsCard.Card--no-footer)):has(.Addon-screenshots) .Card.Addon-screenshots ,

  .Addon.Addon-extension:not(:has(.Card.PermissionsCard.Card--no-footer)):has(.Addon-screenshots) .Card.Addon-screenshots.Card--no-footer {
      min-height: 71.2vh !important;
  /*background: olive !important;*/
  /*border: 1px solid red !important;*/
  /*border: 1px solid aqua !important;*/
  }

  .Addon.Addon-extension:not(:has(.Card.PermissionsCard.Card--no-footer)):has(.Addon-screenshots) .Card.Addon-screenshots .Card-contents ,

  .Page-amo .Addon.Addon-extension:not(:has(.Card.PermissionsCard.Card--no-footer)) .Card.Addon-screenshots.Card--no-footer .Card-contents {
      min-height: 66.3vh !important;
  background: #1f2536 !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  /*border: 1px solid red !important;*/
  /*border: 1px solid aqua!important;*/
  }

  .Addon.Addon-extension:not(:has(.Card.PermissionsCard.Card--no-footer)):has(.Addon-screenshots) .Card.Addon-screenshots .Card-contents .ScreenShots {
      min-height: 66.4vh !important;
      max-height: 66.4vh !important;

  /*border: 1px solid red !important;*/
  /*border: 1px solid aqua!important;*/
  }
  .Addon.Addon-extension:not(:has(.Card.PermissionsCard.Card--no-footer)):has(.Addon-screenshots) .Card.Addon-screenshots .Card-contents .ScreenShots .ScreenShots-viewport .ScreenShots-list{
      min-height: 66.8vh !important;

  /*border: 1px solid red !important;*/
  /*border: 1px solid aqua!important;*/
  }
  `;
}
if ((location.hostname === "addons.mozilla.org" || location.hostname.endsWith(".addons.mozilla.org")) || (location.hostname === "addons-dev.allizom.org" || location.hostname.endsWith(".addons-dev.allizom.org")) || location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* A2 - SCR - with DESCR / PERM - NOT PRESENT NOW - NO RELEASE not(:has(.Card.AddonDescription-version-notes))*/
  .Addon.Addon-extension:has(.Addon-screenshots, .Card.AddonDescription , .Card.PermissionsCard) .Addon-main-content {
      min-height: 90.4vh !important;
  /*background: green  !important;*/
  }


  /* SCREENSHOT */
  /* RIGHT - SCREENSHOTS - .ScreenShots .ScreenShots-viewport .ScreenShots-list */
  .Addon.Addon-extension:has(.Addon-screenshots, .Card.AddonDescription , .Card.PermissionsCard) .Addon-main-content .Card.Addon-screenshots {
      min-height: 71.6vh !important;
  /*background: olive !important;*/
  /*border: 1px solid red !important;*/
  /*border: 1px solid aqua !important;*/
  }

  .Addon.Addon-extension:has(.Addon-screenshots, .Card.AddonDescription , .Card.PermissionsCard) .Addon-main-content .Card.Addon-screenshots .Card-contents {
      min-width: 98.5% !important;
      max-width: 98.5% !important;
      min-height: 66.8vh !important;
      max-height: 66.8vh !important;
  background: #1f2536 !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  /*border: 1px solid red !important;*/
  /*border: 1px solid aqua!important;*/
  }
  .Addon.Addon-extension:has(.Addon-screenshots, .Card.AddonDescription , .Card.PermissionsCard) .Addon-main-content .Card.Addon-screenshots .Card-header {
    border-radius: 0;
    margin: 0 0 0 0 !important;
    padding: 0;
  }

  .Addon.Addon-extension:has(.Addon-screenshots, .Card.AddonDescription , .Card.PermissionsCard) .Addon-main-content .Card.Addon-screenshots .Card-contents .ScreenShots {
      min-height: 66.4vh !important;
      max-height: 66.4vh !important;

  /*border: 1px solid red !important;*/
  /*border: 1px solid aqua!important;*/
  }
  .Addon.Addon-extension:has(.Addon-screenshots, .Card.AddonDescription , .Card.PermissionsCard) .Addon-main-content .Card.Addon-screenshots .Card-contents .ScreenShots .ScreenShots-viewport .ScreenShots-list{
      min-width: 99% !important;
      max-width: 99% !important;
      min-height: 66.8vh !important;

  /*border: 1px solid red !important;*/
  /*border: 1px solid aqua!important;*/
  }

  /* DESCRIPT */
  .Addon-description-and-ratings:has(.Card.ShowMoreCard.AddonDescription, .Card.ShowMoreCard.PermissionsCard.ShowMoreCard--expanded.Card--no-style.Card--no-footer) .Card.ShowMoreCard.AddonDescription .Card-contents .ShowMoreCard-contents {
      display: inline-block !important;
      width: 100% !important;
      min-height: 39.7vh !important;
      max-height: 39.7vh !important;
      top: 0 !important;
      margin: 0px !important;
      padding: 0px !important;
      border-radius: 0px 0 9px 9px !important;
  /*border: 1px dashed lime!important;*/
  }
  `;
}
if ((location.hostname === "addons.mozilla.org" || location.hostname.endsWith(".addons.mozilla.org")) || (location.hostname === "addons-dev.allizom.org" || location.hostname.endsWith(".addons-dev.allizom.org")) || location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* A3 - SCR - with DESCR - NO PERM - (new168) RELEASE NOTES NOT PRESENT NOW :not(:has(.Card.AddonDescription-version-notes)) */
  .Addon.Addon-extension:not(:has(.Card.PermissionsCard)):has(.Addon-screenshots, .Card.AddonDescription ) .Addon-main-content {
      min-height: 90.4vh !important;
  /*background: green  !important;*/
  }

  #react-view .Page-amo .Page-content .Addon.Addon-extension:not(:has(.Card.PermissionsCard)):has(.Addon-screenshots, .Card.ShowMoreCard.AddonDescription ) .Addon-main-content .Addon-description-and-ratings .ShowMoreCard-contents ,

  .Page-amo .Page.Page-not-homepage .Addon.Addon-extension:not(:has(.Card.PermissionsCard)):has(.Addon-screenshots, .Card.ShowMoreCard.AddonDescription.Card--no-style ) .Addon-main-content .Addon-description-and-ratings .ShowMoreCard-contents {
    display: inline-block !important;
    grid-template: unset !important;
    box-sizing: unset !important;
    width: 92.9% !important;
    height: 100% !important;
    min-height: 68.3vh !important;
    max-height: 68.3vh !important;
    top: 0vh !important;
    margin: 0px !important;
    padding: 0px 20px !important;
    overflow: hidden auto !important;
  /*background: olive !important;*/
  }
  `;
}
if ((location.hostname === "addons.mozilla.org" || location.hostname.endsWith(".addons.mozilla.org")) || (location.hostname === "addons-dev.allizom.org" || location.hostname.endsWith(".addons-dev.allizom.org")) || location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* B1 - NO SCR - WITH DESC - (new168) RELEASE NOTES NOT PRESENT NOW :not(:has(.Card.AddonDescription-version-notes)) */
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension:not(:has(.Card.Addon-screenshots)) .Addon-main-content {
      min-height: 92.4vh !important;
  /*background: green  !important;*/
  }

  /* DESCRIPT */
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension:not(:has(.Card.Addon-screenshots)) .Card.ShowMoreCard.AddonDescription  {
      min-height: 71.8vh !important;
  /*background: blue !important;*/
  }
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension:not(:has(.Card.Addon-screenshots)) .Card.ShowMoreCard.AddonDescription .Card-contents {
    min-height: 67.2vh !important;
      padding: 0 0px 0px 0px!important;
  }
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension:not(:has(.Card.Addon-screenshots)) .Card.ShowMoreCard.AddonDescription .Card-contents .ShowMoreCard-contents {
      min-height: 66.8vh !important;
      width: 100% !important;
      min-width: 99.8% !important;
      max-width: 99.8% !important;
      border-radius: 0 !important;

  }
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension:not(:has(.Card.Addon-screenshots)) .Card.ShowMoreCard.AddonDescription .Card-contents .ShowMoreCard-contents .AddonDescription-contents {
      display: inline-block !important;
      grid-template: unset !important;
      box-sizing: unset !important;
      
      height: 100% !important;
      min-height: 67vh !important;
      max-height: 67vh !important;
      top: 0vh !important;
      margin: 0 0 0 0 !important;
      padding: 0 10px 0px 10px!important;
      overflow: hidden auto !important;
  /*background: #111 !important;*/
  /*background: blue !important;*/
  }




  /* PERMISSION */
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension:not(:has(.Card.Addon-screenshots)) .Card.ShowMoreCard.PermissionsCard.ShowMoreCard--expanded.Card--no-footer ,

  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension:not(:has(.Card.Addon-screenshots)) .Card.ShowMoreCard.PermissionsCard.Card--no-footer  {
      position: absolute !important;
      float: none !important;
      min-width: 45.50% !important;
      max-width: 45.50% !important;
      left: 54% !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  /*border: 1px solid red !important;*/
  /*background: olive !important;*/
  }
  `;
}
if ((location.hostname === "addons.mozilla.org" || location.hostname.endsWith(".addons.mozilla.org")) || (location.hostname === "addons-dev.allizom.org" || location.hostname.endsWith(".addons-dev.allizom.org")) || location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* B2 - NO SCR - WITH  PERM - (new168) RELEASE NOTES NOT PRESENT NOW :not(:has(.Card.AddonDescription-version-notes)) */
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension:not(:has(.Card.Addon-screenshots, .Card.ShowMoreCard.AddonDescription)):has(.Card.PermissionsCard.Card--no-footer) .Addon-main-content:after{
      content: "No Description" !important;
      position: fixed !important;
      display: inline-block !important;
      height: 100% !important ;
      min-height: 43.6vh !important;
      max-height: 43.6vh !important;
      line-height: 8.6vh !important;
      min-width: 31% !important;
      max-width: 35.50% !important;
      left: 22.5% !important;
      top: 9.2vh !important;
      text-align: center !important;
      border-radius: 9px !important;
      z-index: 5000000 !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  background: rgb(30, 36, 52) !important;
  /*border: 1px solid aqua !important;*/
  /*background: red !important;*/
  }

  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension:not(:has(.Card.Addon-screenshots, .Card.ShowMoreCard.AddonDescription)):has(.Card.PermissionsCard.Card--no-footer) .Card.ShowMoreCard.PermissionsCard.ShowMoreCard--expanded.Card--no-footer{
      content: "No Description" !important;
      position: absolute !important;
      min-width: 31% !important;
      max-width: 31% !important;
      left: 22.5% !important;
      bottom: 19.2vh !important;
      text-align: center !important;
      border-radius: 9px !important;
      z-index: 5000000 !important;
  background: rgb(30, 36, 52) !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  /*border: 1px solid aqua !important;
  background: red !important;*/
  }

  /* (new168) RATING */
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension:not(:has(.Card.Addon-screenshots, .Card.ShowMoreCard.AddonDescription)):has(.Card.PermissionsCard.Card--no-footer) .Addon-main-content .Addon-description-and-ratings{
      position: fixed !important;
      width: 0 !important;
      height: 0 !important;
      left: 0 !important;
      top: 50vh !important;
      margin: 0 0 0 0 !important;
      padding:  0 0 0 0 !important;
      z-index: 5000000000 !important;
  border: 1px solid red !important;
  }
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension:not(:has(.Card.Addon-screenshots, .Card.ShowMoreCard.AddonDescription)):has(.Card.PermissionsCard.Card--no-footer) .Addon-main-content .Addon-description-and-ratings .Card.Addon-overall-rating.Card--no-style {
      min-width: 20% !important;
      max-width: 20% !important;
  }


  `;
}
if ((location.hostname === "addons.mozilla.org" || location.hostname.endsWith(".addons.mozilla.org")) || (location.hostname === "addons-dev.allizom.org" || location.hostname.endsWith(".addons-dev.allizom.org")) || location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* C - INDICATOR - NO SCR */
  /*#react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension:not(:has(.Card.Addon-screenshots)):has(.Card.ShowMoreCard.AddonDescription, .Card.PermissionsCard.Card--no-footer, ShowMoreCard-contents) .Addon-main-content {
      min-height: 90.4vh !important;
  background: violet  !important;
  }*

  /* (new167) NO SCREENSHOTS - INDICATOR 
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension:not(:has(.Card.Addon-screenshots , .Card.ShowMoreCard.AddonDescription-version-notes)):has(.Card.ShowMoreCard.AddonDescription, .Card.PermissionsCard.Card--no-footer) .Addon-main-content:before
  ==== */
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension:not(:has(.Card.Addon-screenshots )) .Addon-main-content:before {
      content: "No Screenshot" !important;
      position: absolute !important;
      display: inline-block !important;
      height: 100% !important ;
      min-height: 8.6vh !important;
      max-height: 8.6vh !important;
      line-height: 8.6vh !important;
      min-width: 45.50% !important;
      max-width: 45.50% !important;
      top: 9.2vh !important;
      left: 54% !important;
      text-align: center !important;
      border-radius: 9px !important;
      z-index: 5000000 !important;
  background: rgb(30, 36, 52) !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  /*background: peru !important;*/
  }
  #react-view .Page-amo .Page-content .Page.Page-not-homepage .Addon.Addon-extension:not(:has(.Card.Addon-screenshots, .Card.ShowMoreCard.AddonDescription)) .Addon-main-content:after{
      content: "No Description" !important;
      position: absolute !important;
      display: inline-block !important;
      height: 100% !important ;
      min-height: 8.6vh !important;
      max-height: 8.6vh !important;
      line-height: 8.6vh !important;
      min-width: 31% !important;
      max-width: 35.50% !important;
      left: 22.5% !important;
      text-align: center !important;
      border-radius: 9px !important;
      z-index: 5000000 !important;
  background: rgb(30, 36, 52) !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  /*border: 1px solid aqua !important;
  background: red !important;*/
  }
  `;
}
if (location.href.startsWith("https://addons.mozilla.org./")) {
  css += `
  /* ==============
  TEST ADD - https://addons.mozilla.org./ (with the trailing dot [.])
  (need more tweaks... Work in Progress)) (new169) 
  =========================== */

  body {
    font-family: Inter,sans-serif !important;
  }
  h2.visually-hidden ,
  .visually-hidden{
      display: none  !important;
  }

  body {
      margin: 0 0 0 0 !important;
  }
  .Page-amo {
    display: flex;
    flex-direction: column;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
    height: 100% !important;
    min-height: 100vh !important;
    max-height: 100vh !important;
  }

  header.Header {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100%  !important;
      max-width: 100% !important;
      min-height: 70px !important;
      height: 70px !important;
      top: 0 !important;
      margin: 0vh 0 0vh 0 !important;
      padding: 0px !important;
  /*background: olive !important;*/
  }
  .Header-wrapper {
      position: static  !important;
      grid-template-columns: max-content 1fr 1fr;
      grid-template-rows: 46px auto;
      width: 100% !important;
      min-width: 1366px !important;
      max-width: 136px !important;
      height: 70px !important;
      min-height: 70px !important;
      margin: 0px auto;
      padding: 0px 0 0 0px !important;
  /*border: 1px solid aqua !important;*/
  }
  .Header-content {
      position: relative  !important;
      display: inline-block !important;
      height: 5vh !important;
      width: 100% !important;
      min-width: 20% !important;
      max-width: 20% !important;
      margin: 0vh 0 0 0 !important;
      top: 4vh !important;
  }
  .Header-content a.Header-title {
      position: relative  !important;
      display: inline-block !important;
      height: 5vh !important;
      width: 100%;
      margin: 0vh 0 0 0 !important;
      background-image: url(/static-frontend/459ebe418a9783cd0b80bdd8b98e5faa.svg) !important;
      background-position: bottom !important;
      background-repeat: no-repeat !important;
      background-size: 207px 48px !important;
  /*border: 1px solid gold !important;*/
  }
  .Header-title:after {
    content: "https://addons.mozilla.org./ (with the trailing dot [.]" !important;
    position: absolute !important;
    display: inline-block !important;
    top: 5.5vh !important;
    font-size: 8px !important;
  color: white !important;
  }

  ul.SectionLinks.Header-SectionLinks {
      display: inline-block !important;
      grid-area: unset !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 2.5vh !important;
      line-height: 2.5vh !important;
      margin: 2vh 12px 0 0px  !important;
      padding: 0px;
      text-align: right !important;
  }
  ul.SectionLinks.Header-SectionLinks li {
      display: inline-block !important;
      height: 2.5vh !important;
      line-height: 2.5vh !important;
      grid-area: unset !important;
      margin: 0vh 5px 0 0px  !important;
      padding: 0px;
      overflow: hidden !important;
  /*border: 1px solid gold !important;*/
  }
  ul.SectionLinks.Header-SectionLinks li a {
      display: inline-block !important;
      height: 2.5vh !important;
      line-height: 2.5vh !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      grid-area: unset !important;
      margin: 0vh 0 0 0px  !important;
      padding: 0px;
  /*border: 1px solid gold !important;*/
  }
  ul.SectionLinks.Header-SectionLinks .DropdownMenu.SectionLinks-link.SectionLinks-dropdown {
      display: inline-block !important;
      width: 100% !important;
      height: 2.5vh !important;
      line-height: 2.5vh !important;
      grid-area: unset !important;
      margin: 0vh 0 0 0px  !important;
      padding: 0px;
      text-align: left  !important;
      overflow: hidden !important;
  /*border: 1px solid pink!important;*/
  }
  ul.SectionLinks.Header-SectionLinks li:has(.DropdownMenu.SectionLinks-link.SectionLinks-dropdown) .DropdownMenu-button {
      display: none  !important;
  }
  ul.SectionLinks.Header-SectionLinks li:has(.DropdownMenu.SectionLinks-link.SectionLinks-dropdown) .DropdownMenu.SectionLinks-link.SectionLinks-dropdown ul li.DropdownMenuItem.DropdownMenuItem-section {
      display: inline-block !important;
      grid-area: unset !important;
      height: 2.5vh !important;
      line-height: 2.5vh !important;
      width: auto!important;
      margin: 0vh 5px 0 0px  !important;
      padding: 0px;
      font-size: 15px !important;
      overflow: hidden !important;
  /*border: 1px solid blue !important;*/
  }
  ul.SectionLinks.Header-SectionLinks li:has(.DropdownMenu.SectionLinks-link.SectionLinks-dropdown) .DropdownMenu.SectionLinks-link.SectionLinks-dropdown li.DropdownMenuItem-link a {
      display: inline-block !important;
      height: 2.5vh !important;
      line-height: 1.5vh !important;
      width: auto !important;
      grid-area: unset !important;
      margin: 0vh 0 0 0px  !important;
      padding: 0px 3px !important;
      font-size: 15px !important;
  /*border: 1px solid lime !important;*/
  }

  .Header-user-and-external-links {
      position: absolute !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 40% !important;
      max-width: 40% !important;
      grid-area: unset !important;
      height: 2.2vh !important;
      top: 0 !important;
      left: 45% !important;
      text-align: right !important;
  /*background: brown !important;*/
  /*border: 1px solid gold !important;*/
  }
  .Header-authenticate-button, 
  .Header-authenticate-button:link, 
  .Header-blog-link, 
  .Header-blog-link:link, 
  .Header-developer-hub-link, 
  .Header-developer-hub-link:link, 
  .Header-extension-workshop-link, 
  .Header-extension-workshop-link:link {
      display: inline-block !important;
      vertical-align: baseline;
      height: 2vh !important;
      padding: 0 5px !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 400;
      color: #fff;
  /*border: 1px solid gold !important;*/
  }
  .Header-authenticate-button.DropdownMenu {
      display: inline-flex !important;
  }
  .SearchForm.Header-search-form {
      display: none !important;
      grid-area: 2 / 3 / 2 / 3 !important;
      align-self: center !important;
      width: 100%;
      max-width: 284px !important;
      margin-top: -21px !important;
  }

  .Footer-language-picker {
      position: fixed !important;
      display: inline-block !important;
      width: 222px !important;
      height: 7vh !important;
      top: 1vh !important;
      right: 0px;
  /*border: 1px solid gold !important;*/
  }


  .Page-amo .Page-content:not(:has(.Home)) {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
    height: 100% !important;
    min-height: 92.3vh !important;
    max-height: 92.3vh !important;
    overflow: hidden !important;
    padding: 0px !important;
  }

  .Page-amo .Page-content:not(:has(.Home)) .Page.Page-not-homepage .Addon.Addon-extension {
    height: 100% !important;
    min-height: 92.3vh !important;
    max-height: 92.3vh !important;
    margin: 0px !important;
    padding: 0px !important;
  }

  .Addon-header {
    position: absolute !important;
    display: inline-block !important;
    grid-template: unset !important;
    min-height: 42vh !important;
    max-height: 42vh !important;
    width: 20.1% !important;
    margin: 1vh 0px 0px !important;
    padding: 5px 10px !important;
    border-radius: 9px !important;
  /*border: 1px solid green!important;*/
  }


  .Page-amo .Page-content:not(:has(.Home)) .Page.Page-not-homepage .Addon.Addon-extension .Card.Addon-content.Card--no-header.Card--no-footer {
    display: inline-block !important;
      width: 100% !important;
      min-width: 99.9% !important;
      max-width: 99.9% !important;
      height: 100% !important;
      min-height: 91.9vh !important;
      max-height: 91.9vh !important;
      padding: 0px !important;
      overflow: hidden !important;
  /*border: 1px solid lime !important;*/
  }

  .Addon.Addon-extension .Card-contents .Addon-header .Addon-install {
    position: fixed !important;
    display: inline-block !important;
    float: none !important;
    min-width: 20% !important;
    max-width: 20% !important;
    height: 4vh !important;
    line-height: 4vh !important;
    left: 1.35% !important;
    top: 38vh !important;
    border-radius: 0px 0px 9px 9px !important;
    background: rgb(30, 36, 52) !important;
    border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }
  .Addon.Addon-extension .Card-contents .Addon-header .Addon-install .InstallButtonWrapper .AMInstallButton.AMInstallButton--noDownloadLink  {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 100% !important;
      min-height: 3vh !important;
      max-height: 3vh !important;
      line-height: 3vh !important;
      margin:  0 0 0 0 !important;
      padding: 0px 16px !important;
      border-radius: 4px;
      font-size: 16px;
      background: #0060df;
  /*border: 1px solid yellow !important;*/
  }

  .AMInstallButton-button.Button--action.Button--puffy, 
  .AMInstallButton-button.Button--action.Button--puffy:link {
    border-radius: 4px;
    
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 100% !important;
      min-height: 2vh !important;
      max-height: 2vh !important;
      line-height: 2vh !important;
      margin:  0 0 0 0 !important;
      padding: 0px 0px !important;
      text-align: center  !important;
      font-size: 15px;
  /*border: 1px solid red !important;*/
  }

  .Page-amo .Page-not-homepage .Addon.Addon-statictheme.Addon-theme Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-recommended"], 
  .Page-amo .Page-not-homepage .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-recommended"] {
      position: absolute !important;
      display: inline-block !important;
      width: 70% !important;
      min-height: 3.1vh !important;
      max-height: 3.1vh !important;
      line-height: 3.1vh !important;
      margin: 0vh 0px 0px 0% !important;
      top: -2.1vh !important;
      left: -13% !important;
      padding: 0px 0px 0px 30px !important;
      opacity: 1 !important;
  background: red !important;
  border: medium !important;
  }
  .Page-amo .Page-not-homepage .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-recommended"] a, 
  .Page-amo .Page-not-homepage .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-recommended"] a.Badge-link {
      display: inline-block !important;
      width: 100% !important;
      min-height: 3.1vh !important;
      max-height: 3.1vh !important;
      line-height: 3.1vh !important;
      padding: 1px 0px 1px 20px !important;
      border-radius: 0 9px 9px 0 !important;
      text-decoration: none !important;
  color: white !important;
  /*background: green !important;*/
  }

  .Page-amo .Page-not-homepage .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-recommended"] a .Icon, 

  .Page-amo .Page-not-homepage .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-recommended"] a.Badge-link span.Icon.Icon-recommended.Badge-icon.Badge-icon--large.Icon-recommended + span {
    filter: invert(38%) saturate(481%) hue-rotate(40deg) brightness(202%) contrast(93%) !important;
  }

  .Page-amo .Page-not-homepage .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-recommended"] a.Badge-link span.Icon.Icon-recommended.Badge-icon.Badge-icon--large.Icon-recommended + span:before{
      content: " " !important;
      position: absolute !important;
      display: inline-block !important;
      min-height: 3.1vh !important;
      max-height: 3.1vh !important;
      line-height: 3.1vh !important;
      width: 20px  !important;
      left: -45px !important;
      background: url(/static-frontend/5b3ca713ddb3e55377e45066976b8b0b.svg) 50% no-repeat !important;
      background-size: auto !important;
      background-size: contain !important;
  }

  .Icon-android {
    background: url(/static-frontend/53b6327754144dbb2eb23411963b28ec.svg) 50% no-repeat !important;
      background-size: auto;
    background-size: contain;
  }

  /* REVIEWS NUMBER */
  .Page-amo .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-star-full"] {
    position: fixed !important;
    display: inline-block !important;
    width: 14.9% !important;
    min-height: 4.2vh !important;
    max-height: 4.2vh !important;
    line-height: 4vh !important;
    margin: 0vh 0px 0px 0% !important;
    top: 42vh !important;
    left: 9.2% !important;
    padding: 0px 0px 0px 15px !important;
    opacity: 1 !important;
    z-index: 500000 !important;
    background: rgb(30, 36, 52) !important;
  border: 1px solid rgba(12, 12, 13, 0.9) !important;
  /*border: 1px solid red !important;*/
  }
  .Page-amo .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge:not([data-testid="badge-recommended"], [data-testid="badge-experimental-badge"], [data-testid="badge-android"]) a.Badge-link[href*="/reviews/"] span.Icon.Icon-star-full.Badge-icon.Badge-icon--large {
    height: 3vh !important;
    width: 30px !important;
  }
  /* USERS NUMBER */
  .Page-amo .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-star-full"] .Badge-content.Badge-content {
    display: block !important;
    float: right !important;
    width: 100% !important;
    min-height: 4vh !important;
    max-height: 4vh !important;
    line-height: 4.8vh !important;
    margin: 0vh 5px 0vh 0px !important;
    top: -0.2vh !important;
    font-size: 19px !important;
    text-align: left !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    opacity: 1 !important;
    color: white !important;
  }
  .Page-amo .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge[data-testid="badge-user-fill"] {
    position: fixed !important;
    display: inline-block !important;
    width: 17.2% !important;
    min-height: 4vh !important;
    max-height: 4vh !important;
    line-height: 2vh !important;
    margin: 0vh 0px 0px 0% !important;
    top: 41.6vh !important;
    left: -2.3% !important;
    padding: 5px 0px 5px 15px !important;
    opacity: 1 !important;
    z-index: 5000 !important;
    background: rgb(30, 36, 52) !important;
    border: 1px solid rgba(12, 12, 13, 0.9) !important;
  }

  .Page-amo .Addon.Addon-statictheme.Addon-theme .Card-contents .Addon-header .AddonBadges .Badge:not([data-testid="badge-recommended"], [data-testid="badge-experimental-badge"], [data-testid="badge-android"])[data-testid="badge-star-full"] a.Badge-link[href*="/reviews/"] .Badge-content, 

  .Page-amo .Addon.Addon-extension .Card-contents .Addon-header .AddonBadges .Badge:not([data-testid="badge-recommended"], [data-testid="badge-experimental-badge"], [data-testid="badge-android"])[data-testid="badge-star-full"] a.Badge-link[href*="/reviews/"] .Badge-content.Badge-content--large {
      min-width: 80.6% !important;
      max-width: 80.6% !important;
      display: block !important;
      float: right !important;
    color: peru !important;
  }


  .Page-amo .Card.AddonMoreInfo.Card--no-footer {
    position: absolute !important;
    display: inline-block;
    float: none !important;
    height: 37vh !important;
    min-width: 20.6% !important;
    max-width: 20.6% !important;
    top: 52.5vh !important;
    left: 1% !important;
    margin: 0px !important;
    padding: 3px !important;
    border-radius: 9px !important;
      overflow: hidden  !important;
  /*border: 1px solid rgba(12, 12, 13, 0.9) !important;*/
  /*border: 1px solid lime !important;*/
  }
  .Page-amo .Card.AddonMoreInfo.Card--no-footer .Card-contents .DefinitionList.AddonMoreInfo-dl {
    display: inline-block !important;
    float: none !important;
    height: 32vh !important;
    margin-top: -5px !important;
    width: 100% !important;
    max-width: 92.5% !important;
    min-width: 92.5% !important;
    padding: 5px 15px 0px 5px !important;
    overflow-wrap: break-word;
    overflow: hidden auto !important;
  /*border: 1px solid lime !important;*/
  }
  .Page-amo .Card.AddonMoreInfo.Card--no-footer .Card-contents .DefinitionList.AddonMoreInfo-dl .Definition-dt {
      display: block !important;
      float: left !important;
      width: auto !important;
      font-size: 15px !important;
    color: silver !important;
  }
  .Page-amo .Card.AddonMoreInfo.Card--no-footer .Card-contents .DefinitionList.AddonMoreInfo-dl .Definition-dd {
      display: block !important;
      float: right !important;
      width: 100% !important;
    color: red !important;
  }
  /* ==============================*/

  /* (new168) ADDON - ==== RATING ==== */

  /* (new168) when No Screenshot / NO description */
  .Addon-main-content:not(:has(.Card.Addon-screenshots)) .Card.Addon-description-rating-card.Card--no-header.Card--no-footer .Card.Addon-overall-rating ,

  .Addon-main-content:not(:has(.Card.Addon-screenshots)):not(:has(.AddonDescription-contents)) .Card.Addon-description-rating-card.Card--no-header.Card--no-footer .Card.Addon-overall-rating {
      left: -27.1% !important;
      margin: 0vh 0 0 0px  !important;
  /*border: 1px dashed aqua !important;*/
  }

  /* (new168)  */
  /* .RatingsByStar-graph  */
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager .RatingManager-ratingControl {
      position: relative !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 98% !important;
      max-width: 98% !important;
      height: 100% !important;
      min-height: 4vh !important;
      max-height: 4vh !important;
      margin: 0vh 0 0 0px  !important;
      padding:  0 0px  !important;
  /*background: brown !important;*/
  /*border: 1px dashed aqua !important;*/
  }


  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager {
      display: inline-block !important;
      width: 100% !important;
      height: 100% !important;
      min-height: 0vh !important;
      max-height: 0vh !important;
      margin: 0vh 0 0 0  !important;
      padding:  0 20px  !important;
      overflow: hidden  !important;
  /*background: brown !important;*/
  /*border: 1px dashed aqua !important;*/
  }
  /* (new168) */
  /* HOVER */
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager:hover {
      position: absolute;
      display: inline-block !important;
      flex-direction: unset !important;
      gap: unset !important;
      width: 100% !important;
      height: 100% !important;
      min-height: 25vh !important;
      max-height: 25vh !important;
      margin: 0vh 0 0 0  !important;
      padding:  9vh 20px  0 20px !important;
      z-index: 500000  !important;
  background: #1f2536 !important;
  border: 1px solid red !important;
  }

  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager .Notice.Notice-success.RatingManagerNotice-savedRating.RatingManagerNotice-savedRating-hidden.Notice-light {
      visibility: hidden !important;
  }
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager .Notice-column .Notice-content p.Notice-text {
      margin:  0 0 0 0 !important;
  }


  /* (new168) RATTING -  STAR FORM */
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager form[action] {
      position: absolute;
      display: inline-block !important;
      flex-direction: unset !important;
      gap: unset !important;
      min-height: 4vh !important;
      max-height: 4vh !important;
      width: 100% !important;
      min-width: 96%!important;
      max-width: 96% !important;
      left: 6px !important;
      margin: 2px 0 0 0 !important;
      top: 0.5vh !important;
      padding: 0 0px !important;
  background: #111 !important;
  }
  /* (new168) */
  /* HOVER */
  .Page-amo .Page-content .Addon.Addon-extension .Addon-details section.Card.Addon-overall-rating:hover .RatingManager form[action] {
      position: absolute;
      display: inline-block !important;
      flex-direction: unset !important;
      gap: unset !important;
      min-height: 8vh !important;
      max-height: 8vh !important;
      width: 100% !important;
      min-width: 100%!important;
      max-width: 100% !important;
      left: 0 !important;
      margin: 0px 0 0 0 !important;
      top: 0vh !important;
  background: peru !important;
  }
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager form[action] fieldset  {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100%!important;
      max-width: 100% !important;
      height: 100% !important;
      min-height: 0vh !important;
      max-height: 0vh !important;
      margin: 0px 0 0px 0 !important;
      top: 0px !important;
      padding: 0 !important;
  /*background: blue !important;*/
  }
  /* (new168) */
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager form[action] fieldset legend {
      display: none  !important;
  }


  /* (new168) RATING - CLICK TO RATE */
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager form[action] fieldset .RatingManager-ratingControl {
      position: relative;
      display: inline-block !important;
      align-items: unset !important;
      flex-wrap: unset !important;
      gap: unset !important;
      width: 98% !important;
      height: 8.8vh !important;
      margin: 18px 0 -5px -2px !important;
      padding: 1px 5px !important;
      border-radius: 0 0 9px 9px !important;
  border: 1px solid #283046 !important;
  background: #075251 !important; 
  }
  /* (new165) OLD FIRST - A VOIR */
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager form[action]:hover fieldset .RatingManager-ratingControl {
      margin: -1px 0 0vh 0 !important;
  }
  /* (new168) RATING STARS */
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager form[action] fieldset .RatingManager-ratingControl .Rating.Rating--large {
      display: inline-block !important;
      width: 100%;
      max-width: 350px;
      min-width: 350px;
      min-height: 4vh !important;
  }
  .Page-amo .Page-content .Addon.Addon-extension section.Card.Addon-overall-rating .RatingManager form[action] fieldset .RatingManager-ratingControl .Rating.Rating--large .Rating-star {
      display: inline-block !important;
      min-width: 20px !important;
      height: 2.2vh !important;
      margin: 0px -8px 0 18px !important;
      top: -0.6vh !important;
      padding: 0px !important;
      border-radius: 100% !important;
  /*border: 1px solid rgba(12, 12, 13, 0.9) !important;*/
  }

  /* (new168) ADDON - RATING MANAGER - TOP LEFT - === */
  /* NOT NEED */
  .Card.Addon-overall-rating .Card-footer.Card-footer-link,
  .Card.Addon-overall-rating .Card-header {
      display: none !important;
  }
  /* (new168) RATING on HOVER - TOP LEFT - === */
  .Addon.Addon-extension .RatingManager form {
      position: absolute;
      width: 10.2% !important;
      height: 25px !important;
      left: 0.8% !important;
      top: 421px !important;
      padding: 2px 2px !important;
      border-radius: 5px !important;
      z-index: 1 !important;
  border: 1px solid #283046 !important;
  background: tan !important;
  }
  .Addon.Addon-extension .RatingManager form:hover {
      height: 57px !important;
      padding-bottom: 10px !important;
      z-index: 500 !important;
      transition: all ease 0.7s !important;
  background: black !important;
  border: 1px solid red !important;
  }
  .Addon.Addon-extension .Card-contents .RatingManager form > fieldset {
      display: inline-block !important;
      width: 100% !important;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      line-height: 15px !important;
      text-align: left;
  /*background: green !important;*/
  }
  .Addon.Addon-extension .RatingManager legend.RatingManager-legend {
      display: inline-block !important;
      width: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      line-height: 10px !important;
      overflow-wrap: break-word;
      font-size: 0;
      z-index: -1 !important;
  }

  /* RATNG - FROM ORIGINAL SITE */

  .Rating--editable .Rating-star {
    background-image: url(/static-frontend/beb292576ad81af3bd0b87eb8dff7d66.svg);
    cursor: pointer;
  }
  .Rating-star {
    align-items: center;
    background: url(/static-frontend/66bba36fc6b38216a8504c8e5707f1bd.svg) 50%/contain no-repeat;
      background-image: url("/static-frontend/66bba36fc6b38216a8504c8e5707f1bd.svg");
    display: flex;
    justify-content: center;
    padding: 0;
  }

  .RatingsByStar-graph {
    color: #737373;
    display: grid;
    font-size: 16px;
    grid-gap: 12px;
    grid-template-columns: auto 1fr auto;
    line-height: 1;
  }
  RatingsByStar-star {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .Icon-star-yellow {
    background: url(/static-frontend/98b9d6749910dcee4fb2c91220a87423.svg) 50% no-repeat;
      background-size: auto;
    background-size: contain;
  }
  .Icon {
    content: "";
    display: inline-block;
    flex-shrink: 0;
    height: 16px;
    width: 16px;
  }
  .RatingsByStar-barFrame {
    background-color: rgba(255,233,0,.25) !important;
    width: 100%;
  }
  .RatingsByStar-graph {
    color: rgb(136, 136, 136);
    display: grid;
    font-size: 16px;
    grid-gap: 12px;
    grid-template-columns: auto 1fr auto;
    line-height: 1;
  }
  RatingsByStar-star {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .RatingsByStar-barValue {
    background-color: #ffbd4f;
  }
  .RatingsByStar-bar {
    border-radius: 2px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    height: 16px;
  }

  [dir="ltr"] .RatingsByStar-barValue.RatingsByStar-partialBar {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  .RatingsByStar-barValue.RatingsByStar-barValue--100pct {
    width:100% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--99pct {
    width:99% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--98pct {
    width:98% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--97pct {
    width:97% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--96pct {
    width:96% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--95pct {
    width:95% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--94pct {
    width:94% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--93pct {
    width:93% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--92pct {
    width:92% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--91pct {
    width:91% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--90pct {
    width:90% !important;
  }

  .RatingsByStar-barValue.RatingsByStar-barValue--89pct {
    width:89% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--87pct {
    width:87% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--86pct {
    width:86% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--85pct {
    width:85% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--84pct {
    width: 84% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--83pct {
    width:84% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--82pct {
    width:82% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--81pct {
    width:81% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--80pct {
    width:80% !important;
  }

  .RatingsByStar-barValue.RatingsByStar-barValue--79pct {
    width:79% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--78pct {
    width:78% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--77pct {
    width:77% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--76pct {
    width:76% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--75pct {
    width:75% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--74pct {
    width:74% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--73pct {
    width:73% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--72pct {
    width:72% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--71pct {
    width:71% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--70pct {
    width:70% !important;
  }

  .RatingsByStar-barValue.RatingsByStar-barValue--69pct {
    width:69% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--68pct {
    width:68% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--67pct {
    width:67% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--65pct {
    width:65% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--64pct {
    width:64% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--60pct {
    width:63% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--63pct {
    width:60% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--62pct {
    width:60% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--60pct {
    width:62% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--61pct {
    width:61% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--60pct {
    width:60% !important;
  }

  .RatingsByStar-barValue.RatingsByStar-barValue--59pct {
    width:59% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--58pct {
    width:58% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--57pct {
    width:57% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--56pct {
    width:56% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--55pct {
    width:55% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--54pct {
    width:54% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--53pct {
    width:53% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--52pct {
    width:52% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--51pct {
    width:51% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--50pct {
    width:50% !important;
  }

  .RatingsByStar-barValue.RatingsByStar-barValue--49pct {
    width:49% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--48pct {
    width:48% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--47pct {
    width:47% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--46pct {
    width:46% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--45pct {
    width:45% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--44pct {
    width:44% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--43pct {
    width:43% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--42pct {
    width:42% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--41pct {
    width:41% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--40pct {
    width:40% !important;
  }

  .RatingsByStar-barValue.RatingsByStar-barValue--39pct {
    width:39% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--38pct {
    width:38% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--37pct {
    width:37% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--36pct {
    width:36% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--35pct {
    width:35% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--34pct {
    width:36% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--33pct {
    width:33% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--32pct {
    width:32% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--31pct {
    width:31% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--30pct {
    width:30% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--26pct {
    width:29% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--29pct {
    width:26% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--26pct {
    width:28% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--28pct {
    width:26% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--27pct {
    width:27% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--26pct {
    width:26% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--25pct {
    width:25% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--24pct {
    width:24% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--23pct {
    width:23% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--22pct {
    width:22% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--21pct {
    width:21% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--20pct {
    width:20% !important;
  }

  .RatingsByStar-barValue.RatingsByStar-barValue--19pct {
    width:19% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--18pct {
    width:18% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--17pct {
    width:17% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--16pct {
    width:16% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--15pct {
    width:15% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--14pct {
    width:14% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--13pct {
    width:13% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--12pct {
    width:12% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--11pct {
    width:11% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--10pct {
    width:10% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--9pct {
    width:9% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--8pct {
    width:8% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--6pct {
    width:7% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--5pct {
    width: 5% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--4pct {
    width: 4% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--3pct {
    width: 3% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--2pct {
    width: 2% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--1pct {
    width: 1% !important;
  }
  .RatingsByStar-barValue.RatingsByStar-barValue--0pct {
    width: 0% !important;
  }


  .RatingsByStar-count {
    display: flex;
    justify-content: flex-end;
    min-width: 12px;
  }


  [dir="ltr"] .RatingsByStar-star .Icon {
    margin-left: 6px;
  }
  .Icon-star-yellow {
    background: url(/static-frontend/98b9d6749910dcee4fb2c91220a87423.svg) 50% no-repeat;
      background-size: auto;
    background-size: contain;
  }

  /*========================*/
  /* RIGHT */

  .Card.Addon-content.Card--no-header.Card--no-footer .Addon-header + .Addon-main-content {
    display: block !important;
    float: right !important;
    grid-template: unset !important;
    box-sizing: unset !important;
    min-width: 77.9% !important;
    max-width: 77.9% !important;
    min-height: 90.2vh !important;
    margin: 0vh -0.5% 0px 0px !important;
    overflow-wrap: anywhere;
    word-break: break-word;
  /*border: 1px dashed aqua !important;*/
  }

  #react-view .Page-amo .Addon-description-and-ratings ,
  #react-view .Page-amo .Addon-description-and-ratings:has(.Card.ShowMoreCard.AddonDescription) {
    position: absolute !important;
    display: inline-block !important;
    grid-template: unset !important;
    box-sizing: unset !important;
      min-width: 31.1% !important;
    max-width: 31.1% !important;
    height: 61.5vh !important;
    top: 9vh !important;
    margin: 0px !important;
    padding: 0px !important;
    border-radius: 9px !important;
  /*border: 1px solid lime !important;*/
  }
  /*#react-view .Page-amo .Page-content .Addon.Addon-extension:not(:has(.Card.PermissionsCard)):has(.Addon-screenshots, .Card.ShowMoreCard.AddonDescription) .Addon-main-content .Addon-description-and-ratings .ShowMoreCard-contents, 
  .Page-amo .Page.Page-not-homepage .Addon.Addon-extension:not(:has(.Card.PermissionsCard)):has(.Addon-screenshots, .Card.ShowMoreCard.AddonDescription.Card--no-style) .Addon-main-content .Addon-description-and-ratings .ShowMoreCard-contents {
    display: inline-block !important;
    grid-template: unset !important;
    box-sizing: unset !important;
    width: 92.9% !important;
    height: 100% !important;
    min-height: 68.3vh !important;
    max-height: 68.3vh !important;
    top: 0vh !important;
    margin: 0px !important;
    padding: 0px 20px !important;
    overflow: hidden auto !important;
  }*/
  /* SCR + PERM */
  #react-view .Page-amo .Page-content .Addon.Addon-extension:has(.Addon-screenshots, .Card.ShowMoreCard.PermissionsCard) .Addon-description-and-ratings .AddonDescription .Card-contents {
    min-height: 58.5vh !important;
    max-height: 58.5vh !important;
    padding: 0px !important;
    border-radius: 0px 0px 9px 9px !important;
  border: 1px solid red !important;
  }
  #react-view .Page-amo .Page-content .Addon.Addon-extension:has(.Addon-screenshots, .Card.ShowMoreCard.PermissionsCard) .Addon-description-and-ratings .AddonDescription .Card-contents .ShowMoreCard-contents {
      width: 100% !important;
    min-height: 58.5vh !important;
    max-height: 58.5vh !important;
    padding: 0px !important;
    border-radius: 0px 0px 9px 9px !important;
  /*border: 1px solid aqua !important;*/
  }
  #react-view .Page-amo .Page-content .Addon.Addon-extension:has(.Addon-screenshots, .Card.ShowMoreCard.PermissionsCard) .Addon-description-and-ratings .AddonDescription .Card-contents .ShowMoreCard-contents .AddonDescription-contents {
      width: 95.8% !important;
    min-height: 58vh !important;
    max-height: 58vh !important;
    padding: 0px 10px !important;
    border-radius: 0px 0px 9px 9px !important;
      overflow: hidden auto !important;
  /*border: 1px solid red !important;*/
  }

  .Addon.Addon-extension:not(:has(.Card.PermissionsCard.Card--no-footer)):has(.Addon-screenshots) .Addon-description-and-ratings .AddonDescription .Card-contents {
    min-height: 68.5vh !important;
    max-height: 68.5vh !important;
    padding: 0px !important;
    border-radius: 0px 0px 9px 9px !important;
  }
  .Addon.Addon-extension:not(:has(.Card.PermissionsCard.Card--no-footer)):has(.Addon-screenshots) .Addon-description-and-ratings .AddonDescription .Card-contents .ShowMoreCard-contents .AddonDescription-contents {
    display: inline-block !important;
    grid-template: unset !important;
    box-sizing: unset !important;
    width: 100% !important;
    height: 100% !important;
    min-height: 65vh !important;
    max-height: 65vh !important;
    top: 0vh !important;
    margin: 0px !important;
    padding: 0px !important;
    overflow: hidden auto !important;
  }
  /*#react-view .Page-amo .Addon-description-and-ratings:has(.Card.ShowMoreCard.AddonDescription) .Card.ShowMoreCard.AddonDescription.ShowMoreCard--expanded.Card--no-style.Card--no-footer*/



  /* COMMENT DEV */
  .AddonDescription-contents + .Addon-developer-comments {
    position: absolute !important;
    float: none !important;
    min-width: 45% !important;
    max-width: 45% !important;
    min-height: 1.5vh !important;
    max-height: 1.5vh !important;
    left: 53% !important;
    top: -2vh !important;
    margin: 0px !important;
    padding: 3px !important;
      border-radius: 9px !important;
      text-align: center !important;
    overflow-wrap: break-word;
    overflow: hidden !important;
  background: brown !important;
  border: 1px solid gold !important;
  }

  .AddonDescription-contents + .Addon-developer-comments:hover {
    position: absolute !important;
    float: none !important;
    min-width: 98.6% !important;
    max-width: 98.6% !important;
    min-height: 26.4vh !important;
    max-height: 26.4vh !important;
    left: 0% !important;
    margin: 0px !important;
    padding: 5px !important;
    overflow-wrap: break-word;
      text-align: left !important;
    overflow: hidden auto !important;
    border-radius: 9px !important;
  border: 1px solid lime !important;
  }



  /*  PERMS */
  .Card.PermissionsCard.Card--no-footer {
    position: absolute !important;
    float: none !important;
    min-width: 30.9% !important;
    max-width: 30.9% !important;
    min-height: 26.4vh !important;
    max-height: 26.4vh !important;
    left: 22.8% !important;
    bottom: 1.5vh !important;
    margin: 0px !important;
    padding: 3px !important;
    overflow-wrap: break-word;
    overflow: hidden auto !important;
    border-radius: 9px !important;
  /*border: 1px solid lime !important;*/
  }


  /* LIST CATEG */
  .Page-amo .SearchResults .SearchResult-name {
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    height: 100% !important;
    min-height: 35px !important;
    max-height: 35px !important;
    line-height: 1.1 !important;
    margin: 0px;
  }
  .Page-amo .SearchResults .SearchResult-name a.SearchResult-link {
    display: inline-block !important;
    vertical-align: top !important;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    line-height: 15px !important;
    margin: 0px;
      margin-right: 0px;
    text-align: left !important;
    overflow-wrap: break-word !important;
    white-space: pre-wrap !important;
    word-break: normal !important;
      font-size: 15px  !important;
      text-decoration: none  !important;
  }
  li.SearchResult .Badge.Badge--has-link .Badge-link, 
  .UserProfile-addons-and-reviews .Card-contents ul > li.SearchResult .Badge.Badge--has-link[data-testid="badge-recommended"] .Badge-link {
    width: auto !important;
    height: 1.5vh !important;
    line-height: 1.4vh !important;
    text-wrap: nowrap !important;
  }
  li.SearchResult .Badge.Badge--has-link:hover .Badge-link span.Icon.Icon-recommended.Badge-icon.Badge-icon--small + .Badge-content.Badge-content--small, 

  .UserProfile-addons-and-reviews .Card-contents ul > li.SearchResult .Badge.Badge--has-link[data-testid="badge-recommended"]:hover .Badge-link span.Icon.Icon-recommended.Badge-icon.Badge-icon--small + .Badge-content.Badge-content--small {
    display: block !important;
    float: right !important;
      width: 100% !important;
      min-width: 60% !important;
    max-width: 60% !important;
    height: 1.5vh !important;
    line-height: 1.4vh !important;
    padding: 0px 15px 0px 5px !important;
    text-wrap: nowrap !important;
    font-size: 12px !important;
      color: gold !important;
  }
  .Icon-recommended {
      height: 1.3vh !important;
      margin: 0px 0 5px 0 !important;
    background: url(/static-frontend/5b3ca713ddb3e55377e45066976b8b0b.svg) 50% no-repeat;
      background-size: auto;
    background-size: contain;
      background-position: top  center  !important;
  }

  /* HOME - .HomepageShelves .Card.CardList.AddonsCard.LandingAddonsCard.Home-Extensions-recommandées */
  .Page-amo .Home .AddonsCard--horizontal:not(.LandingAddonsCard-Themes) ul.AddonsCard-list li.SearchResult .SearchResult-wrapper {
    display: inline-block !important;
    width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
    height: 100%;
    max-height: 180px !important;
    min-height: 180px !important;
    margin: 0px 2px 0px -2px !important;
    padding: 2px 5px !important;
  /*border: 1px solid aqua  !important;*/
  }
  .Page-amo .Home .AddonsCard--horizontal:not(.LandingAddonsCard-Themes) ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result {
    display: inline-block !important;
    width: 100% !important;
      min-width: 97% !important;
      max-width: 97% !important;
    height: 100%;
    max-height: 185px !important;
    min-height: 185px !important;
    margin: 0px 0px 0px -3px !important;
    padding: 2px 5px !important;
  /*border: 1px solid yellow !important;*/
  }
  .Page-amo .Home .AddonsCard--horizontal:not(.LandingAddonsCard-Themes) ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result .SearchResult-icon-wrapper{
      position: relative  !important;
    display: block !important;
      float: left !important;
    width: 100% !important;
      min-width: 11% !important;
      max-width: 8% !important;
    height: 100%;
    max-height: 180px !important;
    min-height: 180px !important;
      left: 3px  !important;
      top: -8px !important;
    margin: 0px 0px 0px 0px !important;
    padding: 2px 5px !important;
  border: 1px solid #283046 !important;
  }
  .Page-amo .Home .AddonsCard--horizontal:not(.LandingAddonsCard-Themes) ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result .SearchResult-icon-wrapper + .SearchResult-contents {
      position: relative  !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 82.5% !important;
      max-width: 82.5% !important;
    height: 100% !important;
    margin: 0px 0px 0px 0px !important;
      left: 5px  !important;
      top: -8px !important;
    padding: 0px !important;
  border: 1px solid #283046 !important;
  }
  .Page-amo .Home .AddonsCard--horizontal:not(.LandingAddonsCard-Themes) ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result .SearchResult-icon-wrapper + .SearchResult-contents p.SearchResult-summary {
      font-size: 15px  !important;
  }
  .Page-amo .Home .AddonsCard--horizontal:not(.LandingAddonsCard-Themes) ul.AddonsCard-list li.SearchResult .SearchResult-contents a.SearchResult-link {
    display: inline-block !important;
    vertical-align: top !important;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    line-height: 15px !important;
    margin: 0px 0 0 0 !important;
    overflow-wrap: break-word !important;
    white-space: pre-wrap !important;
    word-break: normal !important;
      font-size: 15px  !important;
      text-decoration: none  !important;
  }
  .Page-amo .Home .AddonsCard--horizontal:not(.LandingAddonsCard-Themes) ul.AddonsCard-list li.SearchResult .SearchResult-contents + h3.SearchResult-users.SearchResult--meta-section {
      position: relative !important;
      display: block !important;
      float: right !important;
      line-height: 1.5vh !important;
      width: 100% !important;
      min-width: 83% !important;
      max-width: 83% !important;
      top: 0px !important;
      left: -3px !important;
      margin: 0vh 0 0 0px!important;
      font-size: 15px !important;
      border-top: 1px solid silver !important;
  }

  /* HOME - THEME*/
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal.LandingAddonsCard-Themes .Card-contents ul.AddonsCard-list {
      display: grid;
      grid-auto-flow: column dense;
      grid-gap: 4px !important;
      padding: 0 4px 4px !important;
  /*border: 1px solid lime !important;*/
  }
  .Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal.LandingAddonsCard-Themes .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme {
      -moz-box-direction: normal;
      -moz-box-orient: horizontal;
      display: flex;
      flex-flow: row wrap;
      width: 90%;
      margin: 0 5px 0 6px !important;
      padding: 0 !important;
  border: 1px solid #283046 !important;
  }
  /*.Home section.Card.CardList.AddonsCard.LandingAddonsCard.AddonsCard--horizontal.LandingAddonsCard-Themes .Card-contents ul.AddonsCard-list li.SearchResult.SearchResult--theme .SearchResult-wrapper*/

  .Page-amo .Home .AddonsCard--horizontal.LandingAddonsCard-Themes ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result .SearchResult-icon-wrapper + .SearchResult-contents .SearchResult-name a.SearchResult-link {
      text-decoration: none  !important;
  }
  .Page-amo .Home .AddonsCard--horizontal.LandingAddonsCard-Themes ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result .SearchResult-icon-wrapper + .SearchResult-contents .SearchResult-name + .SearchResult-metadata{
      position: relative !important;
      display: inline-block !important;
      float: none !important;
      line-height: 1.5vh !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      top: 0px !important;
      left: -5px !important;
      margin: 0vh 0 0 0px!important;
      font-size: 15px !important;
  border-top: 1px solid silver !important;
  }
  .Page-amo .Home .AddonsCard--horizontal.LandingAddonsCard-Themes ul.AddonsCard-list li.SearchResult .SearchResult-wrapper .SearchResult-result .SearchResult-icon-wrapper + .SearchResult-contents .SearchResult-name + .SearchResult-metadata .SearchResult-author.SearchResult--meta-section {
      text-decoration: none  !important;
      font-size: 15px !important;
  }


  .Page-amo .Home .AddonsCard--horizontal.LandingAddonsCard-Themes ul.AddonsCard-list li.SearchResult .SearchResult-contents + h3.SearchResult-users.SearchResult--meta-section {
      position: relative !important;
      display: block !important;
      float: right !important;
      line-height: 1.5vh !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      top: 2.5vh !important;
      left: 0px !important;
      margin: 0vh 0 0 0px!important;
      font-size: 15px !important;
      border-top: 1px solid silver !important;
  }

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
