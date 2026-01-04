// ==UserScript==
// @name        Revert dark to light
// @namespace   gqqnbig
// @match       https://forums.totalwar.com/*
// @include     /theverge\.com\D*\/?$/
// @grant       GM_addStyle
// @version     1.2
// @author      gqqnbig
// @description Apply a smart color revert on selected websites. If the site was dark, it's now light. If it was light, it's now dark.
// @license     GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/464389/Revert%20dark%20to%20light.user.js
// @updateURL https://update.greasyfork.org/scripts/464389/Revert%20dark%20to%20light.meta.js
// ==/UserScript==


(function(){

  // The following rules are from the smart invert option of the chrome extension SUPER DARK MODE
  // (https://chrome.google.com/webstore/detail/super-dark-mode/nlgphodeccebbcnkgmokeegopgpnjfkc).
  // Scroll bar rules are removed.
  GM_addStyle(`
:root{
    --bg-color: rgb(15, 15, 15);
    --input-border-color: rgba(211,211,211,0.2);
}

html{
  background: #000 !important;
}

body {
  background-color: #FFF !important;
  filter: invert(.95) sepia(.1) brightness(.99) !important;
  -moz-filter: invert(.95) sepia(.1) brightness(.99) !important;
  -webkit-filter: invert(.95) sepia(.1) brightness(.99) !important;
}

em, img, svg, image, video, audio, embed, iframe, object, button, canvas, figure:empty, *[style*="background-image"], *[class*=icon], *[class*=Icon], *[class=button], *[style*="background-position"], *[style*=background-repeat], *[style*="url("]{
  filter: invert(1) brightness(.99) saturate(1.2) !important;
  -moz-filter: invert(1) brightness(.99) saturate(1.2) !important;
  -webkit-filter: invert(1) brightness(.99) saturate(1.2) !important;
}

/*google*/
#lst-ib.gsfi, #gs_taif0.gsfi, #gs_htif0.gsfi{
	color:gray !important;
}

/*vnexpress*/
#wrap-main-nav .main-nav{background-color: white;}

/* Apple.com */
main.main div[data-analytics-section-engagement] .module-content{filter:invert(1);}
#ac-globalnav{filter:invert(1);}

/*salesforce*/
#oneHeader .oneTrialHeader.trial-header, #oneHeader .oneTrialHeader .trial-menu-list .slds-dropdown{
  background: #ffc3bf;
}
#main .columns-wrapper.column-container-image.lazy.bg-center-bottom.bg-cover{
  background-image: none !important;
}
#sf-chat .embeddedServiceHelpButton .helpButton .uiButton .agent-img img{filter:invert(0) !important;}
footer.bottom .page-footer{background-color: #ffc799 !important;}
/*trello*/
#board .list.js-list-content, #chrome-container .card-detail-window, #content-wrapper .board-menu{
  filter:invert(1);
}
#chrome-container .card-detail-window{
  background:#e9e9e9 !important
}
/*cnn*/
#nav__plain-header.nav--plain-header{
  filter: invert(.8) sepia(.5);
}
#intl_homepage3-zone-4{
  background-color:#ff9696 !important;
}
div#footer-wrap footer#footer-nav-container{
  background-color:rgb(250, 250, 250) !important;
}
div#footer-wrap footer#footer-nav-container *{
  color:rgb(31, 31, 31) !important;
}
/*vnexpress*/
.swiper-slide .box-info-news{filter:invert(1);}
.vjs-control-bar{filter:invert(0);}
#player_playing.detail_left{filter:invert(1) !important;}
video#vne_vod_html5_api{filter:invert(0) !important;}
/*wiki*/
.vector-toc-pinned #vector-toc-pinned-container .vector-toc:after{background:none !important;}
a.mw-logo span.mw-logo-container{filter:invert(1);}
/*paypal*/
#federated-mep-footer-container.css-zdxt0i{filter:invert(1);}
#merchant-header-main-wrapper-internal{filter:invert(0) !important;}
/*cnn*/
.header__wrapper-outer{filter:invert(1);}
.layout__bottom.layout-with-rail__bottom{filter:invert(1);}
/*discord*/
.grid-3d2PVT.footer-gguAio.brand-1AbNp3, footer.footerContainer-1IvXQc{filter:invert(1) saturate(1.5);}
/*firefox*/
#react-view .Page-amo .Header, #react-view .Page-amo footer.Footer{filter:invert(1);}
/*docs*/
.docs-material-colorpalette-body{filter:invert(1);}
.goog-menu.goog-menu-vertical.docs-material{filter:invert(0) !important;}
canvas.kix-canvas-tile-content, #docs-editor-container #waffle-grid-container{opacity:.8;}
#workspace #pages svg image{filter:invert(0) !important;}
/*amazon.com*/
header#navbar-main.nav-opt-sprite.nav-flex, #navFooter.navLeftFooter.nav-sprite-v1, #nav-progressive-subnav, #nav-flyout-iss-anchor #nav-flyout-searchAjax{filter:invert(1);}
header#navbar-main.nav-opt-sprite.nav-flex{position:relative; z-index:9999;}
#hmenu-container #hmenu-canvas-background.hmenu-dark-bkg-color {
    background-color: rgb(200 200 200 / 80%);
}
header#navbar-main.nav-opt-sprite.nav-flex .nav-coreFlyout.nav-flyout{filter:invert(1);}
header#navbar-main.nav-opt-sprite.nav-flex .nav-search-field{opacity:.8;}
.DesktopImmersiveExpanded-module__elementContainer_QbhBlMOnTIIsJ59Hkl7ti{filter:invert(1);}
  `);


})();