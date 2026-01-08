// ==UserScript==
// @name GPokr - dark green
// @namespace https://greasyfork.org/en/users/430935
// @version 1.1.0
// @description A dark green theme for GPokr
// @author TOM SLICK
// @homepageURL https://greasyfork.org/en/scripts/394802
// @supportURL https://greasyfork.org/en/scripts/394802/feedback
// @license CC-BY-SA-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.gpokr.com/*
// @match *://*.kdice.com/*
// @match *://*.xsketch.com/*
// @downloadURL https://update.greasyfork.org/scripts/394802/GPokr%20-%20dark%20green.user.js
// @updateURL https://update.greasyfork.org/scripts/394802/GPokr%20-%20dark%20green.meta.js
// ==/UserScript==

(function() {
let css = `

  HTML {background-color: #1E4D2B!important;}
  BODY, .iogc-GameWindow, .iogc-BonusProgress, .iogc-SidePanel-inner, #outside, .summary, .hmenu, #profile h3 span, P {background-color: transparent!important;}
  #hd > DIV > TABLE > TBODY > TR > TD:first-child, TD[align="right"][width="728"], #cf_alert_div > DIV, #cf-error-details,  
  TD[style="font-size: 16px; color: #333333; font-weight: normal; text-align: left; font-family: Georgia, Times, serif; line-height: 24px; vertical-align: top; padding:10px 8px 10px 8px"],
  #yui-main, #bd, H2, #mainpage > DIV, TD[bgcolor="#ffffff"][width="100%"], TD[style="padding:10px 0"], .iogc-favoritePanel-list {background-color: #1E4D2B!important;}
  .cf-section.cf-highlight.cf-status-display, .my-8.bg-gradient-gray {background: #1E4D2B!important;}
  DIV[style="padding:30px 30px 50px;width:1000px;background-color:#DDD;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;"],
  #outside > DIV:last-child, .hmenu .current, .list-item.list-odd,
  #forum .header, .iogc-SidePanel-inner, TD[bgcolor="#ddeeff"] {background-color: #1C4628!important;}
  .iogc-BonusProgress, .summary, .menu2, .iogc-tourny-odd {background-color: #194024!important;} 
  INPUT, SELECT, TEXTAREA {background-color: #333!important;border: 1px solid black!important;}
  .gwt-TabBarItem, .iogc-MessagePanel-messages, .iogc-ChatPanel-messages {background-color: #333!important;}
  .gwt-TabBarItem.gwt-TabBarItem-selected {background-color: #2C7BAA!important;}
  .iogc-MessagesPanel {background-color: #0B1C10!important;border-bottom-color: #0B1C10!important;margin-bottom: -1px!important;}
  .rdews-RoundedComposite {background-color: #0B1C10!important;border-radius: 0!important;}
  .menu2 li a:hover {background-color: #325D3E!important;}
  .iogc-ChangeTableDialog-tile {background-color: #222!important;} 
  .iogc-DialogOuter, .iogc-ScrollTable-scroll, .iogc-ChangeTableDialog-scrollContainer, .iogc-GameWindow-container, .gwt-DialogBox {background-color: #111!important;}
  .iogc-ChangeTableDialog-tile.iogc-ChangeTableDialog-tile-selected {background-color: #222!important;border-color: dodgerblue!important;}
  .iogc-BonusProgress-bar {background-color: royalblue!important;} 
  .iogc-ScrollTable-table TR:hover {background-color: dodgerblue!important;} 
  .iogc-notice, .iogc-hint, .iogc-tourny-flash {background-color: maroon!important;}
  .ui-button_content, .gwt-HTML.iogc-ChangeTableDialog-viewToggle:hover {background: linear-gradient(#5A5F6D, #000, #333) repeat scroll 0 0 transparent!important;color: gainsboro!important;}
/*   .ui-button_content {background: linear-gradient(#7db9e8, #1e5799) repeat scroll 0 0 transparent!important;color: white!important;} */
/*   .iogc-NewButton-green {background: linear-gradient(#00FF7F, #228B22) repeat scroll 0 0 transparent!important;} */
/*   .iogc-NewButton-white {background: linear-gradient(#F0FFF0, #DCDCDC) repeat scroll 0 0 transparent!important;} */
  .gwt-Button {border: 1px solid #215A9B!important;border-radius: 3px!important;} 
  .field-submit {background: linear-gradient(#5A5F6D, #000) repeat scroll 0% 0% transparent!important;border-radius: 3px!important;}
  .iogc-SidePanel-inner {border: 2px solid #194024!important;} 
  .iogc-GameWindow-layout {border-color: #0B1C10!important;}
  .iogc-ScrollTable-headings TD, .seperator, .iogc-OptionsTabSection-title, .footerHeading, .iogc-ChangeTableDialog-sectionHeader, 
  #cf_alert_div > DIV, .cf-error-footer.cf-wrapper, .iogc-SignIn-signUpPage {border-color: transparent!important;}
  .iogc-PlayerFavoritePanel {border-color: #194024!important;}
  TD[style="border-right:1px solid #DDD;border-left:1px solid #DDD"][width="180"],
  P, .hmenu .notcurrent, .iogc-LoginPanel-playerRow, .hmenu .current, .iogc-ChangeTableDialog-tile, 
  .statLine TD, #profile h3 .line {border-color: #194024!important;}
  DIV[style="margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid #DDD;"],
  DIV[style="border-bottom:1px solid #DDD; padding-bottom:10px; margin-bottom:10px;width:500px;"],
  DIV[style="border-bottom:2px dotted #ddd;margin:20px 0 10px;"],
  DIV[style="border-bottom:2px dotted #ddd;margin:10px 0;"] {border-bottom-color: #194024!important;}
  DIV[style="border-top:1px solid gray;padding-right:10px;padding-top:5px;"], DIV[style="border-top:1px solid gray;padding-top:5px"] ,
  DIV[style="border-top:3px solid #CCC"], #forum .header, .iogc-SidePanel-inner, .list-item {border-top-color: #194024!important;}
  .iogc-TouryCountdownPanel-title, .gpokr-GameWindow-potLabel, .iogc-Controls,
  .iogc-PlayerPanel-name a, .iogc-tourny-table, .iogc-tourny-table:hover {color: black!important;}
  .iogc-TouryCountdownPanel-title:hover, .iogc-PlayerPanel-name a:hover, .iogc-GameWindow-status B {color: blue!important;}
  .field-submit:hover {color: darkseagreen!important;}
  .iogc-chatLevelUp {color: deepskyblue!important;}
  BODY, INPUT, SELECT, TEXTAREA, .summary, .quote, .menu2 li a, .gwt-TabBarItem, .center, .title, .iogc-GameWindow-status, .Caption,
  DIV[href="#"][style="text-decoration: none; font-size: 20px; color: #333333; font-weight: bold; font-family:Arial, sans-serif "],
  TD[style="font-size: 16px; color: #333333; font-weight: normal; text-align: left; font-family: Georgia, Times, serif; line-height: 24px; vertical-align: top; padding:10px 8px 10px 8px"],
  .footerHeading, .footerSection, h2 span, h3 span, h4 span, .stats TH, .iogc-SignIn-label, #cf-error-details H1, #cf-error-details H2, .gwt-HTML,
  DIV[style="color:#888"], .footer, .pages, B, TH, P, .label, .col1MonthLabel, .iogc-tourny-itemout, .iogc-BonusProgress-label, .iogc-TouryCountdownPanel-desc,
  .col2Label, .field-label, .iogc-ChangeTableDialog-hint, .xsketch-controlLabel {color: gainsboro!important;}
  .iogc-tourny-flash {color: gold!important;}
  .iogc-SidePanel-title, .iogc-LoginPanel-nameHeading,
  .hmenu a.current, .profilemenu a.current {color: lime!important;}
  SPAN[style="color:#050;"] {color: mediumspringgreen!important;}
  .iogc-chatNew, DIV[class="largeRank"][style="color:#080"], SPAN[style="color:#080"] {color: springgreen!important;}
  DIV[class="largeRank"][style="color:#800"], SPAN[style="color:#800"] {color: orangered!important;}
  #profile .tagline, .iogc-LoginPanl-item {color: skyblue!important;}
  .iogc-ScrollTable-headings TD {color: tomato!important;}
  A {color: tan!important;} 
  A:hover {color: navajowhite!important;}
  .iogc-GameWindow-status, .iogc-LoginPanel-nameHeading {font-weight: bold!important;}
  IMG[src^="https://chart.googleapis.com/"], IMG[src^="https://chart.apis.google.com/"] {filter: invert(75%) hue-rotate(180deg) saturate(250%);}
  
 .error {color: orange!important;}
 .iogc-chatLevelUp {color: skyblue!important;}
/*  .iogc-GameWindow-status {margin-bottom: -10px!important;} */
  
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
