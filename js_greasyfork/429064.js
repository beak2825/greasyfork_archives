// ==UserScript==
// @name Youtube MiniView
// @namespace http://userstyles.org
// @version 0.2
// @description Resize the window to a minimum view to listen the music
// @author CY Fung
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/429064/Youtube%20MiniView.user.js
// @updateURL https://update.greasyfork.org/scripts/429064/Youtube%20MiniView.meta.js
// ==/UserScript==

(function() {
let css = `
@media only screen and (max-height: 296px) {
    /* 250px + 46px */
     html, html body, *:only-child{
         min-width:0 !important;
    }
     ytd-page-manager ytd-watch-flexy{
         width:100vw;
         margin:0;
         padding:0;
         top:0;
         position:fixed;
    }
     ytd-masthead#masthead{
         margin-top:calc(-1 * var(--ytd-watch-flexy-masthead-height));
    }
     ytd-masthead#masthead, #masthead-container{
         visibility: collapse;
         z-index:-1;
         pointer-events:none;
    }
     #primary-inner>#player{
         position:relative !important;
    }
     ytd-player#ytd-player #container{
         padding:0;
         margin:0;
         display: flex;
         flex-direction: column;
         align-items: center;
    }
     ytd-player#ytd-player #container>*, ytd-player#ytd-player #container [class*="ytp-chrome-"]{
         left:auto !important;
    }
     ytd-player#ytd-player #container [class*="ytp-chrome-"]{
         z-index:25 !important;
    }
     ytd-player#ytd-player #container #movie_player{
         position:relative;
         width:100% !important;
    }
     ytd-player#ytd-player video{
         position:relative;
         max-height:100vh !important;
         max-width:100vw !important;
         top:auto !important;
         left:auto !important;
         height:auto !important;
         width:auto !important;
         display:inline-block;
    }
     #primary-inner>#player, #primary-inner>#player [id*="player-container"]{
         height:100vh;
         min-height:0;
         max-height: none;
         padding:0;
    }
     #primary-inner, #primary-inner>#player, #primary-inner>#player div[id*="container"]:only-child, #movie_player {
         max-width:100vw !important;
         width:auto !important;
    }
     #primary-inner>#player #movie_player {
         display: flex;
         align-items: center;
         flex-direction: column;
    }
     #primary-inner>#player .ytp-size-button.ytp-button{
         display:none !important;
    }
     #primary-inner>#player .annotation{
         visibility: collapse;
         z-index:-1;
    }
     #primary-inner>#player .ytp-caption-window-container{
         z-index:10 !important;
    }
     #primary-inner>#player #ytp-caption-window-container .caption-window.ytp-caption-window-bottom[style*="text-align:"][style*="center"][style*="bottom:"][style*="margin-left:"][style*="left:"]{
         bottom:3vh !important;
    }
     .ytp-popup.ytp-contextmenu .ytp-menuitem{
         zoom:0.6;
         width:auto !important;
         display:flex;
         flex-direction:row;
         align-items: center;
    }
     .ytp-popup.ytp-contextmenu{
         width:auto !important;
    }
     .ytp-popup.ytp-contextmenu .ytp-panel{
         position:relative;
    }
     .ytp-popup.ytp-contextmenu .ytp-panel, .ytp-popup.ytp-contextmenu .ytp-panel-menu{
         width:auto !important;
         max-width:none !important;
         min-width:0 !important;
    }
}


 @media only screen and (max-height: 90px) {
     .ytp-storyboard-framepreview, .ytp-storyboard-framepreview-img, .ytp-tooltip.ytp-bottom.ytp-preview{
         visibility: collapse;
         z-index:-1;
    }
     #primary-inner>#player video{
         visibility: collapse;
    }
     #primary-inner>#player .ytp-chrome-bottom{
         display:block !important;
         opacity:1 !important;
    }
     .ytp-subtitles-button.ytp-button{
         display:none !important;
    }
     .ytp-fullscreen-button.ytp-button{
         display:none !important;
    }
     #primary-inner>#player #ytp-caption-window-container .caption-window.ytp-caption-window-bottom[style*="text-align:"][style*="center"][style*="bottom:"][style*="margin-left:"][style*="left:"]{
         bottom:calc(100vh - 30px) !important;
         z-index:10 !important;
    }
     #ytp-caption-window-container .caption-window:not(.ytp-caption-window-bottom){
         display:none !important;
    }
}


 @media only screen and (max-height: 68px) {
     #ytp-caption-window-container .caption-window.ytp-caption-window-bottom{
         visibility: collapse;
         z-index:-1;
    }
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
