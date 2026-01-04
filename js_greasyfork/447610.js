// ==UserScript==
// @name BetterFXP
// @namespace http://tampermonkey.net/
// @version 1.2.1
// @description תוסף המתקן את הדארק מוד של FXP
// @author Mutedly
// @match https://www.fxp.co.il/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/447610/BetterFXP.user.js
// @updateURL https://update.greasyfork.org/scripts/447610/BetterFXP.meta.js
// ==/UserScript==


function styleChanger(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
}


styleChanger(`

//Open sans Import
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap');




/* שינויים בעיצוב */
  body, div, span, a, div.newcom, h, h1, h2, h3, h4, h5, h6 {
  font-family: 'Open Sans', sans-serif !important;
}

#message_list, blockquote, #above_postlist, .floatleft, .postbit-right {
  font-family: 'Open Sans', sans-serif !important;
}

body, html {
  background: #111111 !important;
}

.fxp2020_sticky_header, .darkmode .toplogin.toplogedin {
 background: #202020 !important;
}

.breadcrumb {
 background: #2b2b2b !important;
}

.navbithome {
 display: none;
}



a.newcontent_textcontrol {
 font-size: 15px !important;
}


#forumStatsContainer {
 background: #19191b;
 border-style: none solid solid;
 border-color: #333;
}


.smallPlusButton {
 background: #29292d;
}


.modore {
 display: none;
 }


.teammen {
 background: #19191b !important;
 border-style: none solid solid;
 border-radius: 0px !important;
 background-image: url(https://images4.fxp.co.il/mobile/svg2/team.svg) !important;
 background-repeat: no-repeat !important;
 background-size: 40px !important;
 background-position: right !important;
 width: 243px !important;
 margin-right: 0px !important;
}


#usermenu {
 font-size: 13px !important;
}

#adfxp,
div.ob-smartfeed-wrapper,
div.ob-widget-section,
div.ob-first,
div.ob-widget-items-container,
div.ob_what,
div.ob_what_resp,
div.top-ba {
 display: none;
}



.user-picture-holder img {
 margin-top: 10px !important;
 margin-right: 6px !important;
 width: 50px !important;
 height: 50px !important;
 border: none;
}




.footer, .postbit, .postbitim, .postcontainer {
 box-shadow: 0px 6px 43px rgba(0, 0, 0, 0.37) !important;
 border-radius: 20px !important;
}

.rating0, .sticky, .threadbit {
 border-radius: 8px !important;
}

#footer_copyright {
 display: none;
}







.threadimod input {
 margin-left: 10px!important;
}


.chat-textarea, .chat-textarea, .fast-mode-desktop, .chat-el {
 display: none;
}

.count-info-holder {
 margin-left: 5px !important;
 margin-bottom: 10px !important;
}

.postbitdeleted, .nodecontrols, .postbitignored .nodecontrols {
 background: #19191b !important;
 border-radius: 8px !important;
 padding-bottom: 5px !important;
}

.user_panel_m {
 border-radius: 2px !important;
}

css-1dbjc4n r-14lw9ot r-1ny4l3l r-iphfwy r-1qhn6m8 r-i023vh r-ttdzmv r-o7ynqc r-6416eg {
 background-color: red !important;
}

`);