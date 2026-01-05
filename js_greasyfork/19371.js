// ==UserScript==
// @name        Facebook grey minimalist - Compact
// @namespace   english
// @description Grey subdued fb
// @include     http*://*facebook.com*
// @version     1.28
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/19371/Facebook%20grey%20minimalist%20-%20Compact.user.js
// @updateURL https://update.greasyfork.org/scripts/19371/Facebook%20grey%20minimalist%20-%20Compact.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header


var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML =  '               /*\n*//*\n*/ .fbChatSidebar ,.fbChatSidebar  {display: none !important ;}/*\n*//*\n*//* body *//*\n*/._5vb_, ._5vb_ #contentCol {/*\n*/    background-color: #F5F5F5 !important ; /*\n*/}/*\n*//*\n*//*\n*//* top bar *//*\n*/ ._2s1x ._2s1y {    background-image: none !important ;     background-color: #E8E8E8 !important ; border-bottom: 1px solid #D2D2D2 !important ;}   /*\n*/ /*\n*/._2s1x ._2s25 {/*\n*/    text-shadow: none !important ;/*\n*/}/*\n*/._2s1x ._2s1y { /*\n*/    color: #6D6D6D !important ;/*\n*/}/*\n*//*\n*/._4u91 {/*homepage feed item counter home*//*\n*/    background: #FBFBFB !important ;/*\n*/    box-shadow: inset 0 1px rgba(204, 204, 204, 0.77), 0 1px rgba(255, 255, 255, .15) !important ;/*\n*/    margin-left: 4px !important ;/*\n*/}/*\n*//*\n*/._585- { /*search bar*//*\n*/    border: 1px solid #969696 !important ;/*\n*/}/*\n*//*\n*//*\n*//*\n*//*\n*//*\n*//*\n*/ /*   page struct   *//*\n*//*\n*/.sidebarMode #globalContainer {/*\n*/    padding-right: 0 !important ;/*\n*/}/*\n*/html body._5vb_ #globalContainer {/*\n*/    width: 95% !important ;/*\n*/}/*\n*/html ._5vb_._5vb_.hasLeftCol .hasRightCol div#contentArea {/*\n*/    width: 68% !important ;/*\n*/}/*\n*/._5vb_.hasLeftCol ._5r-_ div#rightCol {/*\n*/    padding: 0 !important ;/*\n*/    width: 28% !important ;/*\n*/}/*\n*/#mainContainer .groupLitestandClassicJumpLayout div#headerArea {/*\n*/    padding-bottom: 12px !important ;/*\n*/    width: 100% !important ;/*\n*/}/*\n*/.coverWrap ,.coverImage{/*\n*/    height: 80px !important ;/*\n*/}/*\n*/.groups_rhc div{max-width: 100% !important ;}/*\n*//*\n*//*\n*//*\n*//*\n*/ /*   home   *//*\n*//*\n*/._5vx4._5vx6 ._5vwy ._13xf {/*\n*/    background: #777777 !important ;/*\n*/}/*\n*/._5vwz ._13xf {/*\n*/    background-color: #D0D0D0 !important ; /*\n*/}/*\n*//*\n*//*\n*/ ._2a2q {  margin: 5px auto;} /*      */       /*\n*//* profile pages *//*\n*//*\n*/.fbx #globalContainer {/*\n*/    width: 95% !important; /*\n*/}/*\n*//*\n*/.hasRightCol #contentArea {/*\n*/    width: 100% !important; /*\n*/}/*\n*/.timelineLayout #contentArea {/*\n*/    position: relative !important; /*\n*/    width: 100% !important; /*\n*/}/*\n*//*\n*/._5nb8 {/*\n*/    float: right !important; /*\n*/    margin-left: 15px !important; /*\n*/    width: 70% !important; /*\n*/}/*\n*/ /*\n*/._1vc- {/*\n*/    float: left !important; /*\n*/    margin-left: 0 !important; /*\n*/    width: 28% !important; /*\n*/}/*\n*/ol._2t4v clearfix{/*\n*/	    width: 100% !important; /*\n*/}/*\n*/ /*\n*/ /*\n*/._4lh .fbTimelineTwoColumn[data-type="s"] {/*\n*/    width: 512px;/*\n*/    margin: 15px auto;/*\n*/}/*\n*/._2uo1 {/*\n*/    width: 510px;/*\n*/    margin: 15px auto;/*\n*/} ._4gt0, ._4lh .fbTimelineUnit[data-type="r"] {    width: 50% !important;    overflow: hidden;} ._5fo2 { background-color: #d2d2d2 !important; border-bottom: 1px solid #3a3a3a !important; }  ._2t4v li,._4gt0{position: relative;float: left !important;clear:both !important;}  /* width *//*\n*/::-webkit-scrollbar {/*\n*/    min-width: 5px;/*\n*/}/*\n*//*\n*//* Track *//*\n*/::-webkit-scrollbar-track {/*\n*/    box-shadow: inset 0 0 5px grey; /*\n*/    border-radius: 3px;/*\n*/    background:#999/*\n*/}/*\n*/ /*\n*//* Handle *//*\n*/::-webkit-scrollbar-thumb {/*\n*/    background: #666;  /*\n*/}/*\n*//*\n*//* Handle on hover *//*\n*/::-webkit-scrollbar-thumb:hover {/*\n*/    background: #444; /*\n*/}            ';





document.getElementsByTagName('head')[0].appendChild(style);

var link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://i.sli.mg/7MgSc6.png';
    document.getElementsByTagName('head')[0].appendChild(link);