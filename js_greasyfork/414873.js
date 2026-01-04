// ==UserScript==
// @name         Geek Hack Nord Theme
// @namespace    https://github.com/crispgm
// @version      1.0.0
// @description  A simple Nord theme for GeekHack
// @author       David Zhang
// @match        https://geekhack.org/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/414873/Geek%20Hack%20Nord%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/414873/Geek%20Hack%20Nord%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle ( `
body{
  font-family: -apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", sans-serif;
  background-color: #3B4252;
  width: 60%;
  margin: 0 auto;
}
a:link, a:visited {color: #A3BE8C;}
#header {display: none;}
#content_section {background: none;}
#content_section div.frame {background: none;}
#footer_section {background: none;}
#footer_section div.frame {background: none;}
#topic_icons {display: none;}
.plainbox {background: none;}
.whos_viewing {display: none;}
#whoisviewing {display: none;}
.moderatorbar {display: none;}
.navigate_section {padding: .5em .2em;}
.navigate_section ul {border-top: 0;}
.table_grid thead {display: none;}
blockquote.bbc_standard_quote {background-color: #3B4252;}
.windowbg {color: #4C566A; background-color: #ECEFF4;}
.windowbg2 {color: #4C566A; background-color: #ECEFF4;}
.windowbg3 {color: #B48EAD; background-color: #ECEFF4;}
.subject a:link {color: #4C566A; font-weight: bold;}
.subject a:visited {color: #4C566A; font-weight: bold;}
.subject p a:link {color: #A3BE8C;}
.subject p a:visited {color: #A3BE8C;}
.stickybg a:link {color: #D8DEE9; font-weight: bold;}
.stickybg a:visited {color: #D8DEE9; font-weight: bold;}
td.icon1 {display: none;}
td.icon2 {display: none;}
td.subject {width: 75%;}
td.stats {width: 8%;}
td.lastpost {width: 17%;}
.lastpost img {display: none;}
.windowbg span.topslice {background: none;}
.windowbg span.topslice span {background: none;}
.windowbg span.botslice {background: none;}
.windowbg span.botslice span {background: none;}
.windowbg2 span.topslice {background: none;}
.windowbg2 span.topslice span {background: none;}
.windowbg2 span.botslice {background: none;}
.windowbg2 span.botslice span {background: none;}
h3.catbg {color: #D8DEE9;}
.catbg img {display: none;}
` );
})();