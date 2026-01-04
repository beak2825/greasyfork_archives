// ==UserScript==
// @name Deviantart V7 (pre eclipse) theme beta
// @namespace https://greasyfork.org/en/users/759797-lego-savant
// @version 0.1.15
// @description Makes deviantart.com look less terrible
// @author legosavant
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.deviantart.com/*
// @downloadURL https://update.greasyfork.org/scripts/457101/Deviantart%20V7%20%28pre%20eclipse%29%20theme%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/457101/Deviantart%20V7%20%28pre%20eclipse%29%20theme%20beta.meta.js
// ==/UserScript==

(function() {
let css = `
body[class] {
    font-size: 9pt;
    font-family: Verdana,sans-serif;
    color: #000;
    background:#d4dfd0
}
#sub-frame-error {
    background:transparent
}
:root {
    --devious-sans-font-fallback: Verdana,sans-serif;
    --devious-sans-extra-bold: "Verdana",sans-serif;
    --devious-sans-bold: "Verdana",sans-serif;
    --devious-sans-light: "Verdana",sans-serif;
    --devious-sans-medium: "Verdana",sans-serif;
    --devious-sans-regular: "Verdana",sans-serif;
    --f-14-reg:400 9pt verdana;
    --g-thumb-image-overlay:transparent
}
.light-green {
    --L13:transparent;
    --L13_1:transparent;
    --L14:transparent;
    --L15:transparent;
    --L16:transparent;
    --L17:transparent;
}
*::selection {
    background:#3297FD!important;
    color:#fff
}
/*S1 MAIN NAV**************************************************************************/
header[role="banner"] {
    background:linear-gradient(#405147,#617566);
    height:42px;
    border-top:1px solid #999999;
    padding-left:2px
}
header[role="banner"] [href="https://www.deviantart.com"] { /*LOGO*/
    background:url("http://st.deviantart.net/minish/main/logo.png") no-repeat;
    padding:0;
    width:124px;
    order:-1;
    background-position-y:-1px;
}
header[role="banner"] [href="https://www.deviantart.com"]:hover {
    background-color:#3c4441
}
header[role="banner"] [href="https://www.deviantart.com"]:hover:after {
    content:"";
    height:41px;
    width:27px;
    display:inline-block;
    background:#46524a;
    position:absolute;
    left:127px;
    z-index:-1
}
header[role="banner"] [href="https://www.deviantart.com"] div {
    opacity:0
}
._3AEsy, .rn9IN, ._3e2hi, ._1UMnY { /*separators next to buttons*/
    display:none
}
header[role="banner"] a[href]._3NKNR,
header[role="banner"] a[href]._1aj3v._hZXS,
header[role="banner"] a[href].vvI-A._22Nnb { /*watch link*/
    font:400 11px verdana;
    color:#c0d0ca!important;
    height:40px;
    margin:0;
    padding:2px 8px 0 8px
}
header[role="banner"] a[href]._3NKNR:hover,
header[role="banner"] a[href]._1aj3v._hZXS:hover,
header[role="banner"] a[href].vvI-A._22Nnb:hover {
    background:#3c4441
}
header[role="banner"] a[href] {
    font:400 11px verdana
}
header[role="banner"] div ~ a[href="https://www.deviantart.com/notifications/watch"]._3NKNR,
header[role="banner"] div ~ a[href="https://www.deviantart.com/notifications/watch"]._1aj3v._hZXS {
    color:#B3C432!important
}
._3PE10, ._2aBmC, ._2LI95 { /*watch dot*/
    display:none
}
header[role="banner"] > button { /*GUIDE*/
    background:url("http://st.deviantart.net/minish/main/darr.png") 8px 17px no-repeat;
    padding:0;
    width:27px;
    height:41px;
    margin-left:1px
}
header[role="banner"] > button:hover, header[role="banner"] > button:focus {
    background-color:#3c4441;
    overflow:visible
}
header[role="banner"] > button:hover ~ [href="https://www.deviantart.com"], header[role="banner"] > button:focus ~ [href="https://www.deviantart.com"] {
    z-index:1
}
header[role="banner"] > button:hover:before, header[role="banner"] > button:focus:before {
    content:"";
    height:41px;
    width:125px;
    display:inline-block;
    background:#46524a;
    position:absolute;
    left:-126px;
    z-index:-11
}
header[role="banner"] > button span {
    display:none
}
header[role="banner"] div, header[role="banner"] a {
    order:2
}
header[role="banner"] form {
    margin-top:2px;
    margin-left:1px
}
header[role="banner"] form > div {
    background:none!important;
    border:0;
    padding:0;
    height: 22px;
    line-height: 22px;
    flex-direction:row-reverse
}
header[role="banner"] form input {
    background-image: url(http://st.deviantart.net/minish/messages/gmbutton2h.png?2);
    background-position: 0 -108px;
    padding-left: 3px;
    color: #2b3432!important;
    height:22px;
    line-height:22px;
    font-size:11px;
}
header[role="banner"] form input::placeholder {
    text-indent:-22222px
}
header[role="banner"] form > div > span > span {
    background-image: url(http://st.deviantart.net/minish/messages/gmbutton2h.png?2);
    font:400 11px verdana,sans-serif;
    height:22px;
    line-height:22px;
    border-radius:0;
    background-position:right top;
    cursor:pointer
}
header[role="banner"] form > div svg, ._2Sbpm > span svg {
    display:none
}
header[role="banner"] form > div > span > span:before {
    content:"Search";
    color:#bdd023;
    padding:0 6px 0 4px;
}
header[role="banner"] > a ~ a ~ div ~ div:nth-of-type(4) a { /*bell / mail*/
    background:url("https://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif") no-repeat;
    background-position:-1320px 12px;
    padding:0;
    box-sizing:content-box;
    width:40px;
}
header[role="banner"] > a ~ a ~ div ~ div:nth-of-type(4) a:after {
    content:"";
    display:inline-block;
    height:100%;
    position:absolute;
    right:0;
    width:12px;
    background: url(http://st.deviantart.net/minish/main/darr.png) 0px 17px no-repeat;
}
header[role="banner"] > a ~ a ~ div ~ div:nth-of-type(4) a span {
    opacity:0
}
.os-Mn,
._2ajpJ,
._1tP9Z,
header[role="banner"] div > div:last-child{ /*home, profile, post*/
    margin-right:0
}
header[role="banner"] > div:nth-last-of-type(2) {
    padding:0 8px;
    margin:0;
    margin-left:auto
}
header[role="banner"] > div:nth-last-of-type(2):hover {
    background:#3c4441
}
header[role="banner"] a[href="https://www.deviantart.com/core-membership"] { /*core L*/
    display:none
}
header[role="banner"] > div:last-child { /*right justification*/
    margin:0
}
header[role="banner"] > div:last-child > iframe, header[role="banner"] > div > div[style="width: 100px; height: 55px;"], [href="https://www.deviantart.com/dreamup"] { /*annoying promo banner, AI link*/
    display:none
}
/*more button, chat button... || home, profile*/
a[href="https://www.deviantart.com/shop"] ~ div > iframe ~ button, [href="https://www.deviantart.com/chat"] {
    padding:0 30px 0 8px;
    margin:0;
    background:url(http://st.deviantart.net/minish/main/darr.png) 44px 17px no-repeat;
}
a[href="https://www.deviantart.com/shop"] ~ div > iframe ~ button:hover, a[href="https://www.deviantart.com/shop"] ~ div > iframe ~ button:focus, [href="https://www.deviantart.com/chat"]:hover, [href="https://www.deviantart.com/chat"]:focus {
    background-color:#3c4441
}
a[href="https://www.deviantart.com/shop"] ~ div > iframe ~ button > span:before, [href="https://www.deviantart.com/chat"] > span:before,
._2eDAd > span:before,
._2Sbpm > span:before {
    content:"More";
    color:#c0d0ca;
    font:400 11px verdana;
    margin-top:2px;
}
._2eDAd > span svg {
    display:none
}
a[href="https://www.deviantart.com/shop"] ~ div > iframe ~ button svg, [href="https://www.deviantart.com/chat"] svg {
    display:none
}
[href="https://www.deviantart.com/chat"] > span:before {
    content:"Chat"
}
/*more menu.. home, profile*/
._3Bnr1 .no-theme-skin,
._3bPFa .no-theme-skin {
    background: #3c4441;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 20%), 0px 0px 2px rgba(0, 0, 0, 20%), 0px 1px 1px rgba(0, 0, 0, 20%);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding:6px 0
}
._3Bnr1 .no-theme-skin [id*="app-root"],
._3bPFa .no-theme-skin [id*="app-root"] {
    background:none;
}
._3Bnr1 .no-theme-skin [id*="app-root"] a,
._3bPFa .no-theme-skin [id*="app-root"] a {
    padding:0;
    margin-right:36px;
    height:27px;
    color:#c0d0ca;
    font:400 9pt verdana;
    line-height:27px
}
._3Bnr1 .no-theme-skin [id*="app-root"] a:hover,
._3bPFa .no-theme-skin [id*="app-root"] a:hover {
    color:#fff;
    background: -webkit-linear-gradient(top, #518fa1, #39798d);
}
._3Bnr1 a[href] span:before,
._3bPFa a[href] span:before {
    content:"";
    width:18px;
    height:18px;
    display:inline-block;
    margin-left:10px;
    margin-right:8px;
    background-image: url(http://st.deviantart.net/minish/main/more.gif?1);
    vertical-align:middle;
    margin-bottom:6px
    
}
._3Bnr1 a[href="https://www.deviantart.com/groups"] span:before,
._3bPFa a[href="https://www.deviantart.com/groups"] span:before {
    background-position-x:-1640px
}
._3Bnr1 a[href="https://www.deviantart.com/forum"] span:before,
._3bPFa a[href="https://www.deviantart.com/forum"] span:before {
    background-position-x:-480px
}
._3Bnr1 a[href="https://www.deviantart.com/team"] span:before,
._3bPFa a[href="https://www.deviantart.com/team"] span:before {
    background-position-x:-320px
}
._3Bnr1 a[href="https://www.deviantart.com/dreamup"] span:before,
._3bPFa a[href="https://www.deviantart.com/dreamup"] span:before {
    background-position-x:-120px
}
._3Bnr1 a[href^="https://www.deviantartsell.com"] span:before,
._3bPFa a[href^="https://www.deviantartsell.com"] span:before {
    background-position-x:-720px
}
/*pfp link || home, profile*/
header[role="banner"] div._2lVyC,
header[role="banner"] div._3ccbd,
header[role="banner"] div._3nQq8 {
    margin:0;
    order:-1;
    display:flex
}
header[role="banner"] a[data-username] {
    padding:0 30px 0 8px;
    margin:0;
    background:url(http://st.deviantart.net/minish/main/darr.png) right 17px no-repeat;
    width:auto;
    color:#c0d0ca;
    padding-bottom:11.5px
}
header[role="banner"] a[data-username]:hover {
    background-color:#3c4441
}
header[role="banner"] a[data-username] img {
    display:none
}
header[role="banner"] a[data-username]:before {
    content:"Deviant";
    display:inline-block;
    margin-right:6px;
    line-height:43px
}
header[role="banner"] a[data-username]:after {
    content:attr(data-username);
    display:inline-block;
    line-height:43px;
    color:#dfe6e3;
    font-weight:700
}
/*pfp menu*/
#site-header-user-menu > div:first-child {
    display:none
}
#site-header-user-menu > div:before {
    background:#46524a
}
#site-header-user-menu {
    background: #3c4441;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 20%), 0px 0px 2px rgba(0, 0, 0, 20%), 0px 1px 1px rgba(0, 0, 0, 20%);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding:6px 0;
    border:0
}
#site-header-user-menu a, #site-header-user-menu a ~ div {
    padding:0 16px;
    height:27px;
    color:#c0d0ca;
    font:400 9pt verdana;
    line-height:27px;
    background:none
}
#site-header-user-menu a div, #site-header-user-menu a ~ div div {
    font:inherit;
    color:inherit
}
#site-header-user-menu a:hover, #site-header-user-menu a ~ div:hover {
    color:#fff;
    background: -webkit-linear-gradient(top, #518fa1, #39798d);
}
._BF38 ._3fZW5 { /*theme button*/
    padding:0 16px;
    color:#fff
}
._BF38 ._3fZW5 div {
    color:inherit;
    font:inherit
}
/*submit*/
#site-header-submit-button { 
    height:41px;
    background:none;
    padding:0 8px;
    flex-direction:row-reverse
}
#site-header-submit-button:hover {
    background:#3c4441
}
#site-header-submit-button:before {
    content:none
}
#site-header-submit-button > span:first-of-type {
    background: url(http://st.deviantart.net/minish/main/darr.png) 7px 7px no-repeat;
}
#site-header-submit-button > span:first-of-type svg {
    opacity:0
}
#site-header-submit-button > span {
    color:#c0d0ca
}
/*submit menu*/
[aria-labelledby="site-header-submit-button"] {
    background: #3c4441;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 20%), 0px 0px 2px rgba(0, 0, 0, 20%), 0px 1px 1px rgba(0, 0, 0, 20%);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding:6px 0;
    right:0
}
[aria-labelledby="site-header-submit-button"] a, [aria-labelledby="site-header-submit-button"] button {
    padding:0;
    margin-right:0;
    height:27px;
    color:#c0d0ca;
    font:400 9pt verdana!important;
    line-height:27px!important;
    background:none;
}
[aria-labelledby="site-header-submit-button"] a:hover, [aria-labelledby="site-header-submit-button"] button:hover {
    color:#fff;
    background: -webkit-linear-gradient(top, #518fa1, #39798d);
}
[aria-labelledby="site-header-submit-button"] a:active, [aria-labelledby="site-header-submit-button"] button:active {
    opacity:.5
}
[aria-labelledby="site-header-submit-button"] a > div, [aria-labelledby="site-header-submit-button"] button > div {
    top:0;
    background:#46524a;
    color:#fff;
    border:0
}
/*footer*/
footer[role] {
    padding: 15px 0;
    background: #506256;
    color: #d8e4d8;
    font-size: 8.25pt;
    border-top: 1px solid #e1e9e0;
    display:flex;
    flex-direction:column-reverse
}
footer[role] > div {
    padding:0;
    margin:0;
    line-height:1
}
footer[role] > div:first-child > div:first-child, footer[role] > div:first-child > div:last-child { /*logo, socials*/
    display:none
}
footer[role] > div:first-child > div {
    line-height:1;
    margin-top:10px;
    display:flex;
    flex-direction:row;
    gap:8px
}
footer[role] > div:first-child > div > a {
    margin:0
}
footer[role] > div:first-child > div > div {
    display:inline;
    margin:0;
}
footer[role] > div:first-child > div > div > div {
    display:inline;
    color: #a9b1a6;
}
footer[role] > div:first-child > div > div > div:after {
    content:" | "
}
footer[role] > div:first-child > div > div > div:hover > a {
    text-decoration:underline;
    color:#c0d0ca;
}
/*your notifications / mail*/
#site-header-notifications > div {
    padding-top:6px;
    left:auto;
    right:0
}
/*chat header*/
#site-header-chat {
    margin-top:41px
}
/*S2 HAMBURGER**************************************************************************/

/*home page*/
.hs1JI { /*main page fix*/
    padding-top:42px
}
[style="--scrollbar-width: 17px"] {
    grid-template-columns:0 auto
}
main[class] {
    width:auto;
    max-width: 100vw;
}
._3TcmG { /*holder*/
    display:none;
    width:0
}
._34YpQ {
    display:block
}
.I_eT4,
.k_xkO,
._3BfxY,
._1Uyip {
    top:42px;
    left:127px;
    height:auto;
    background: #3c4441;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 20%), 0px 0px 2px rgba(0, 0, 0, 20%), 0px 1px 1px rgba(0, 0, 0, 20%);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding: 6px 0 6px 0;
    width:auto!important;
    border:0 
}
.fLUtF,
._3yp3N {
    height:auto
}
.I_eT4 > nav,
#burger-menu-networkbar {
    background:none;
    padding:0
}
.I_eT4 > nav a[class],
#burger-menu-networkbar a[class] { /*main text buttons*/
    position: relative;
    line-height: 27px;
    vertical-align: middle;
    display: inline-block;
    padding:0;
    color: #c0d0ca!important;
    text-decoration: none !important;
    font-size: 9pt;
    height:auto!important
}
.I_eT4 > nav a[class]:hover,
#burger-menu-networkbar a[class]:hover {
    background: -webkit-linear-gradient(top, #518fa1, #39798d);
    color:#fff!important
}
.I_eT4 > nav a[class]:active,
#burger-menu-networkbar a[class]:active {
    opacity: .5;
}
._2uzRN, .S3A2z, ._1ssL3, ._3WKSS { /*start watching groups*/
    color:#c0d0ca!important;
    font-size:8pt;
    margin:0
}
.I_eT4 > nav li > div > div,
#burger-menu-networkbar li > div > div { /*icon*/
    height:auto;
    background:none!important
}
.I_eT4 > nav a[class] > div,
#burger-menu-networkbar a[class] > div {
    display:block;
    float:left;
    min-width:19px;
    margin-left:10px;
    background-image: url(http://st.deviantart.net/minish/main/more.gif?1);
    background-position-y:3px;
    min-height:27px;
    margin-right:7px
}
.I_eT4 > nav a[href="https://www.deviantart.com/watch/deviations"] > div,
#burger-menu-networkbar a[href="https://www.deviantart.com/watch/deviations"] > div {
    background-position-x:-320px
}
.I_eT4 > nav a[href="https://www.deviantart.com/daily-deviations"] > div,
#burger-menu-networkbar a[href="https://www.deviantart.com/daily-deviations"] > div {
    background-position-x:-880px
}
.I_eT4 > nav a[href="https://www.deviantart.com/topic"] > div,
#burger-menu-networkbar a[href="https://www.deviantart.com/topic"] > div {
    background-position-x:-1720px
}
.I_eT4 > nav a[href="https://www.deviantart.com/popular/deviations"] > div,
#burger-menu-networkbar a[href="https://www.deviantart.com/popular/deviations"] > div {
    background-position-x:-841px
}
.I_eT4 > nav a[href^="https://docs.google.com/forms/"] > div,
#burger-menu-networkbar a[href^="https://docs.google.com/forms/"] > div {
    background-position-x:-480px
}
#burger-menu-networkbar a[class] > div svg {
    display:none
}
.I_eT4 > nav a[class] ~ div,
#burger-menu-networkbar a[class] ~ div { /*groups button*/
    padding:0
}
.I_eT4 > nav a[class] ~ div button,
#burger-menu-networkbar a[class] ~ div button {
    margin:0 6px
}
.I_eT4 > nav > div,
#burger-menu-networkbar > div {
    border:0
}
.I_eT4 > nav button,
#burger-menu-networkbar button {
    display: block;
    position: relative;
    margin: 12px 10px;
    font-size: 8.25pt;
    color: #758c7d;
    padding:0;
    line-height:13px;
    font-weight:700
}
.I_eT4 > nav button > div,
#burger-menu-networkbar button > div {
    font:inherit;
    color:inherit!important
}
.I_eT4 > nav button > div:first-of-type,
#burger-menu-networkbar button > div:first-of-type {
    display:none
}
._2sZ-u { /*annoying blur*/
    background:none;
    opacity:0
}
.SKsb9, .BhZ3W, ._2jd3M {
    background:none
}
._36ikk, ._27SDf, .UnliB {
    top:0;
    background:none;
}
/*S3 HOME**************************************************************************/
.Xbwbs { /*close button*/
    background:none
}
.Xbwbs button {
    background: url(http://st.deviantart.net/morelikethis/blt_icons.png) no-repeat 0 -108px;
    height: 20px;
    width: 21px;
    top: 0;
    right: 3px;
}
.Xbwbs button svg {
    display:none
}
._1Kez0 {
    top:8px;
    right:8px
}
._2e6-R { /*sticky*/
    top:42px
}
/*people*/
section.PL2hp {
    padding:5px 40px;
    gap: 12px
}
._3QiOn, ._3zVbk {
    margin:0;
    padding:0;
}
._2OXCK+._2OXCK {
    margin-left:12px
}
/*deviants you watch*/
.vrqJS > header, .vrqJS > header > div > div, .ioCwG > header {
    height:35px;
    background:#3d4f42!important
}
._2LCYt h1 {
    color:#fff
}
._2LCYt h1 ~ div, ._1fMM8+._3Of0V {
    margin: 0;
    font-size:11px;
    line-height: 1;
    color: #fff;
}
._28H0F { /*height of tabs*/
    height: 35px
}
._1x8Gw .Lp1vP {
    padding:0;
    color:#98aa96;
    border-bottom: 4px solid transparent;
    font:bold 17px "Helvetica Neue",Arial,sans-serif;
    text-transform:uppercase;
}
._1x8Gw .Lp1vP:hover {
    color:#cbddc9
}
._1x8Gw .Lp1vP.PugwF {
    color: #fff;
    border-bottom: 4px solid #849285;
    font:bold 17px "Helvetica Neue",Arial,sans-serif;
    text-transform:uppercase
}
._158hZ._1iiLS { /*core*/
    display:none
}
._3w_tD { /*grid view*/
    margin: 0
}
/*S4 PROFILE**************************************************************************/
/*bg*/
/*.MIyfT._3HUCX, .MIyfT[style^="background-image:url("] { 
    height:33px;
    width:240px;
    top:109px!important;
    z-index:1;
    left:13px
}*/
._1LzHV { /*support me banner*/
    display: none
}
headerheader[role="banner"] ~ div[style] {
    top:42px
}
header[role="banner"] + div[style^="background-image:"] { /*PROFILE BANNER*/
    height:100vh;
    position:fixed;
    opacity: .7;
}
._1LzHV.mVjfb { /*banner badge for core thing*/
    right:460px;
    top:42px
}
#background-container {
    top:406px
}
#background-container:after {
    content:none
}
#background-container ~ div {
    padding-left:0;
    padding-right:0;
    display:flex;
    flex-wrap:wrap;
    padding-top:42px
}
#background-container ~ div > div:nth-child(2) {
    width:auto;
    flex:1;
    height:33px;
    padding-top:28px;
    background: #c1d1bc url(http://st.deviantart.net/minish/gruzecontrol/bubbletop-gruze.gif) repeat-x bottom left;
    border-top:1px solid #d8e2d6;
}
#background-container ~ div > div:nth-child(2) > div {
    min-height:0!important
}
#background-container ~ div > div:nth-child(1) {
    padding-left:13px;
    padding-top:6px;
    background: #c1d1bc url(http://st.deviantart.net/minish/gruzecontrol/bubbletop-gruze.gif) repeat-x bottom left;
    border-top:1px solid #d8e2d6;
    max-height:62px
}
#background-container ~ div > div:last-child {
    display:block;
}
/*name*/
h1 .user-link {
    font:bold 18pt Trebuchet MS,sans-serif;
    color:#121516;
    letter-spacing:-1px
}
h1 .user-link:hover {
    color:#196ba7
}
a.user-link img, body:not(.mobile) ._13f_2 ~ span img {
    width:50px;
    height:50px;
    margin-right:8px;
    margin-bottom:2px;
    border-radius:0
}
._3oLE7 {
    margin:0;
    display:inline
}
._3oLE7 > h1 {
    display:block;
    margin:0;
    margin-top:5px;
    margin-right:12px
}
._3oLE7 > h1 ~ div:not(:last-of-type) {
    color:#405147;
    font:400 9pt verdana
}
/*nav*/
._2Ofv6 ~ div nav[class]._1ofin,
.ReactModalPortal ~ div nav[class]._1EdvB._1cJpr { /*sticky nav bg*/
    height:42px;
    background: #c1d1bc url(http://st.deviantart.net/minish/gruzecontrol/bubbletop-gruze.gif) repeat-x bottom left;
}
._2Ofv6 ~ div nav[class]._1ofin > div:nth-child(2) > div,
.ReactModalPortal ~ div nav[class]._1EdvB._1cJpr > div:nth-child(2) > div { /*sticky nav pfp*/
    height:42px;
    background:none;
}
._2Ofv6 ~ div nav[class]._1ofin > div:nth-child(3) a,
.ReactModalPortal ~ div nav[class]._1EdvB._1cJpr > div:nth-child(3) a { /*sticky nav buttons*/
    height:33px;
    border-radius:6px;
    overflow:hidden;
    box-shadow:none!important;
}
._2Ofv6 ~ div nav[class]._1ofin > div:nth-child(3) a[aria-current="page"],
.ReactModalPortal ~ div nav[class]._1EdvB._1cJpr > div:nth-child(3) a[aria-current="page"] { /*sticky nav button fix*/
    border-bottom-color:#9cb0a2
}
._2Ofv6 ~ div nav[class],
.ReactModalPortal ~ div nav[class] {
    height:33px;
    background:none;
    box-shadow:none;
    bottom:0;
    top:auto
}
._2Ofv6 ~ div nav[class] a,
.ReactModalPortal ~ div nav[class] a { /*button sizing sticky*/
    display: inline-block;
    margin: 0 3px 0 0;
    border: 1px solid transparent;
    border-radius: 6px 6px 0 0;
    padding: 8px 10px 8px 37px;
    margin-left:0!important;
    font:inherit!important;
    color:#2c3635!important;
}
._2Ofv6 ~ div nav[class] a > div,
.ReactModalPortal ~ div nav[class] a > div {
    display:none
}
._2Ofv6 ~ div nav[class] a:hover,
.ReactModalPortal ~ div nav[class] a:hover {
    background-color: rgba(232,236,230,0.3);
}
._2Ofv6 ~ div nav[class] a[aria-current="page"],
.ReactModalPortal ~ div nav[class] a[aria-current="page"] {
    box-shadow: 0 2px 0px #e2e8e1, inset 0px 1px 0px rgba(255, 255, 255, 50%);
    background: -webkit-linear-gradient(top, #e1e7e1, #e2e8e1);
    border-color:#9cb0a2;
    border-bottom-color: #e2e8e1;
    color:#2c3635!important
}
._2Ofv6 ~ div nav[class] a:before,
.ReactModalPortal ~ div nav[class] a:before {
    content:"";
    width:28px;
    height:24px;
    background: transparent url(http://st.deviantart.net/minish/gruzecontrol/profile-tab-icons.png?3) 10px 0px no-repeat;
    display:inline-block;
    vertical-align:middle;
    position:absolute;
    left:0;
    top:0
}
._2Ofv6 ~ div nav[class] a:after,
.ReactModalPortal ~ div nav[class] a:after {
    content:none!important
}
._2Ofv6 ~ div nav[class] a[href*="/gallery"]:before,
.ReactModalPortal ~ div nav[class] a[href*="/gallery"]:before {
    background-position-y:-50px
}
._2Ofv6 ~ div nav[class] a[href*="/gallery"]:after,
.ReactModalPortal ~ div nav[class] a[href*="/gallery"]:after {
    content:none
}
._2Ofv6 ~ div nav[class] a[href*="/favourites"]:before,
.ReactModalPortal ~ div nav[class] a[href*="/favourites"]:before {
    background-position-y:-150px
}
._2Ofv6 ~ div nav[class] a[href*="/posts"]:before,
.ReactModalPortal ~ div nav[class] a[href*="/posts"]:before {
    background-position-y:-200px
}
._2Ofv6 ~ div nav[class] a[href*="/shop"]:before,
.ReactModalPortal ~ div nav[class] a[href*="/shop"]:before {
    background-position-y:-100px
}
._2Ofv6 ~ div nav[class] a[href*="/private"]:before,
.ReactModalPortal ~ div nav[class] a[href*="/private"]:before {
    background-position-y:-250px
}
/*right area*/
._1nmvE { /*more*/
    width:auto
}
._3VZ1t { /*give, note*/
    padding:0
}
._2Ofv6 ~ div nav[class] button[class],
.ReactModalPortal ~ div nav[class] button[class] {
    min-width:0;
    max-height: 27px;
    text-align: center;
    padding: 0 7px 0 12px;
    display: block;
    text-decoration: none !important;
    font-size: 9pt;
    font-family: Verdana,sans-serif;
    line-height: 27px;
    position: relative;
    background-image: url(http://st.deviantart.net/minish/gruzecontrol/gmbutton2qn2.png)!important;
    color: #337287 !important;
    background-repeat:no-repeat;
    margin-right:10px;
    overflow:visible;
    background-color:transparent!important;
    min-height:25px;
    border:0
}
._2Ofv6 ~ div nav[class] button[class]:hover,
.ReactModalPortal ~ div nav[class] button[class]:hover {
    background-position: 0 -27px!important;
}
._2Ofv6 ~ div nav[class] button[class]:active,
.ReactModalPortal ~ div nav[class] button[class]:active {
    background-position: 0 -54px!important;
}
._2Ofv6 ~ div nav[class] button[class]:after,
.ReactModalPortal ~ div nav[class] button[class]:after {
    content:"";
    background: url(http://st.deviantart.net/minish/gruzecontrol/gmbutton2qn2.png) right no-repeat;
    line-height: 26px;
    height: 27px;
    width:6px;
    display:inline-block;
    position:absolute;
    right:-6px;
    background-position-y:inherit;
    top:0;
    opacity:1
}
._2aK3Y._2OngH:after {
    left:auto
}
._2Ofv6 ~ div nav[class] button[class] span, ._2Ofv6 ~ div nav[class] button[class] > div,
.ReactModalPortal ~ div nav[class] button[class] span, .ReactModalPortal ~ div nav[class] button[class] > div {
    padding:0;
    display:inline-block;
    color:#337287!important;
    line-height:27px;
    vertical-align:top;
    
}
body [title="Send Note"] /*note*/ {
    padding:0 7px 0 12px;
}
body [title="Send Note"]:before,
body button[title]:has([d="M9.912 14.826a1 1 0 00.444.167l.12.007h3.048a1 1 0 00.461-.113l.103-.061L21 10.102V18a1 1 0 01-1 1H4a1 1 0 01-1-1v-7.897l6.912 4.723zM3 6a1 1 0 011-1h16a1 1 0 011 1v1.68L13.215 13h-2.431L3 7.68V6z"]):before {
    content:"";
    background: url(http://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif?37) -600px 1px no-repeat!important;
    transform:none;
    z-index:2;
    margin:0;
    position:static;
    width:23px;
    margin-left:-6px;
    opacity:1!important;
    display:inline-block;
    height:100%;
}
body [title="Send Note"] > div:before,
body button[title]:has([d="M9.912 14.826a1 1 0 00.444.167l.12.007h3.048a1 1 0 00.461-.113l.103-.061L21 10.102V18a1 1 0 01-1 1H4a1 1 0 01-1-1v-7.897l6.912 4.723zM3 6a1 1 0 011-1h16a1 1 0 011 1v1.68L13.215 13h-2.431L3 7.68V6z"]) > div:before {
    content:"Send Note";
    display:inline-block;
    line-height:1
}
body [title="Send Note"] > div svg,
body button[title]:has([d="M9.912 14.826a1 1 0 00.444.167l.12.007h3.048a1 1 0 00.461-.113l.103-.061L21 10.102V18a1 1 0 01-1 1H4a1 1 0 01-1-1v-7.897l6.912 4.723zM3 6a1 1 0 011-1h16a1 1 0 011 1v1.68L13.215 13h-2.431L3 7.68V6z"]) div svg {
    display:none
}




body [aria-label="Give"]:before, /*****gift*****/
body button[title]:has([d="M5 16h6v5H6a1 1 0 01-1-1v-4zm14 0v4a1 1 0 01-1 1h-5v-5h6zM14.44 3.25c.07.032.165.087.276.16l.243.168c.044.03.089.064.135.098l.346.265.36.293.355.3.325.291.122.114.21.207c.092.096.164.178.208.241a1 1 0 01-.245 1.393L15.032 8H20a1 1 0 011 1v1.5a1 1 0 01-1 1h-1V14h-6V8h-2v6H5v-2.5H4a1 1 0 01-1-1V9a1 1 0 011-1h5.274L7.532 6.78a1 1 0 01-.246-1.393c.044-.062.115-.147.204-.247l.203-.219.305-.31.338-.326.344-.32.247-.219.224-.19a3.1 3.1 0 01.339-.252l.104-.053a1 1 0 011.266.403l.054.104 1.103 2.477 1.103-2.477a1 1 0 011.32-.507z"]):before {
    content:"";
    background: url(https://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif?38) -1840px 2px no-repeat;
    transform:none;
    z-index:2;
    margin:0;
    position:static;
    width:23px;
    margin-left:-6px;
    opacity:1!important;
    display:inline-block;
    height:100%;
}
body [aria-label="Give"] > div:before,
body button[title]:has([d="M5 16h6v5H6a1 1 0 01-1-1v-4zm14 0v4a1 1 0 01-1 1h-5v-5h6zM14.44 3.25c.07.032.165.087.276.16l.243.168c.044.03.089.064.135.098l.346.265.36.293.355.3.325.291.122.114.21.207c.092.096.164.178.208.241a1 1 0 01-.245 1.393L15.032 8H20a1 1 0 011 1v1.5a1 1 0 01-1 1h-1V14h-6V8h-2v6H5v-2.5H4a1 1 0 01-1-1V9a1 1 0 011-1h5.274L7.532 6.78a1 1 0 01-.246-1.393c.044-.062.115-.147.204-.247l.203-.219.305-.31.338-.326.344-.32.247-.219.224-.19a3.1 3.1 0 01.339-.252l.104-.053a1 1 0 011.266.403l.054.104 1.103 2.477 1.103-2.477a1 1 0 011.32-.507z"]) > div:before {
    content:"Give";
    display:inline-block;
    line-height:1
}
body [aria-label="Give"] > div svg,
body button[title]:has([d="M5 16h6v5H6a1 1 0 01-1-1v-4zm14 0v4a1 1 0 01-1 1h-5v-5h6zM14.44 3.25c.07.032.165.087.276.16l.243.168c.044.03.089.064.135.098l.346.265.36.293.355.3.325.291.122.114.21.207c.092.096.164.178.208.241a1 1 0 01-.245 1.393L15.032 8H20a1 1 0 011 1v1.5a1 1 0 01-1 1h-1V14h-6V8h-2v6H5v-2.5H4a1 1 0 01-1-1V9a1 1 0 011-1h5.274L7.532 6.78a1 1 0 01-.246-1.393c.044-.062.115-.147.204-.247l.203-.219.305-.31.338-.326.344-.32.247-.219.224-.19a3.1 3.1 0 01.339-.252l.104-.053a1 1 0 011.266.403l.054.104 1.103 2.477 1.103-2.477a1 1 0 011.32-.507z"]) div svg {
    display:none
}
/*******NEXT 2 MAY BE DESTRUCTIVE*****/
div nav[class] [aria-haspopup="listbox"] button[class] span svg { /*more*/
    display:none
}
div nav[class] [aria-haspopup="listbox"] button[class] span:after {
    content:"More";
    vertical-align:top;
}

.-B55x button {
    position:static;
    white-space:nowrap;
    height:20px;
    vertical-align:middle
}
._2Ofv6 ~ div nav[class] > button[class] svg { /*share*/
    color:transparent!important;
    background: url(https://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif?38) -1080px 3px;
    display:inline-block;
}
._2Ofv6 ~ div nav[class] > button[class] span:after {
    content:"Share";
    vertical-align:top;
    color: #337287
}
._2Ofv6 ~ div nav[class] > button[class] span {
    white-space:nowrap;
    width:auto;
    min-width:0;
    margin-right:18px;
    margin-left:-8px
}
.-B55x button:before { /*chat*/
    content:"";
    transform:none;
    display:inline-block;
    white-space:nowrap;
    background-image: url(http://st.deviantart.net/minish/main/more.gif?1)!important;
    background-position-x: -480px;
    width:20px;
    height:20px;
    position:static;
    margin:0;
    vertical-align:middle;
    margin-top:-3px;
    margin-right:5px;
    margin-left:-5px;
    opacity:1!important
}
/*TODO 1*/
._2b649._11ojf._2stzx, body button[data-hook="user_watch_button"], ._2aK3Y._2OngH {
    display:flex;
    align-items:center;
    align-content:center;
    padding:0 6px 0 12px!important;
    min-width:0!important;
}
[data-hook="user_watch_button"]:before, ._2b649._11ojf._2stzx:before, ._2aK3Y._2OngH:before {
    content:none
}
[data-hook="user_watch_button"] > span:nth-last-of-type(2), [data-hook="user_watch_button"] > span > span:first-child,
._2b649._11ojf._2stzx > span:nth-last-of-type(2), ._2b649._11ojf._2stzx > span > span:first-child, ._2aK3Y._2OngH > span:first-child
{ /*profile watch*/
    background:url(http://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif?37) -680px 0;
    width:26px;
    color:transparent;
    max-height:23px;
    margin-left:-4px;
    display:inline-block;
    margin-right:0
}
.Pn0g6 {
    margin:0
}
._2b649._11ojf._2stzx > span:nth-last-of-type(2) svg, ._2aK3Y._2OngH > span svg {
    opacity:0
}
button[class][style] > span:first-child:has([d="M12 10.586L6.707 5.293a1 1 0 00-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 101.414 1.414L12 13.414l5.293 5.293a1 1 0 001.414-1.414L13.414 12l5.293-5.293a1 1 0 10-1.414-1.414L12 10.586z"]) {
    background-position:-720px 0;
    display:inline-block!important
}
.hZ-Ky._3vvyQ span:first-child {
    background-position-y:2px
}
[data-hook="user_watch_button"] svg { /*profile watch hide symbols*/
    opacity:0
}
[data-hook="user_watch_button"] > span:nth-child(2):last-child:before { /*profile watch add +*/
    content:"+"
}
[data-hook="user_watch_button"] > span:nth-last-of-type(3) { /*profile watching remove +*/
    display:none
}
[data-hook="user_watch_button"] > span > span:nth-child(2), [data-hook="user_watch_button"] > span > span:nth-child(3) {
    display:none!important
}

._2aK3Y span { /*watching fix*/
    vertical-align:middle!important
}
/*
[data-hook="user_watch_button"]:before { 
    content:""!important;
    background-image: url(http://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif?37)!important;
    transform:none;
    background-position: -680px 0;
    height:19px;
    width:26px;
    top:2px;
    left:auto!important;
    margin-left:-4px;
    opacity:1!important
}
.aCsM5:before {
    content:"";
}
[data-hook="user_watch_button"] span:nth-child(2):before {
    content:"+";
    padding-left:22px
}
[data-hook="user_watch_button"] span:nth-child(3):before {
    padding-left:22px;
    content:""
}
[data-hook="profile_nav"] [data-hook="user_watch_button"] span:first-child {
    display:none
}
[data-hook="profile_nav"] [data-hook="user_watch_button"] span:nth-child(2):nth-last-child(2) {
    position:absolute;
    color:transparent!important;
    left:8px;
    background-image: url(http://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif?37)!important;
    background-position: -720px 2px;
    background-repeat:no-repeat;
    width:20px;
    display:inline-block!important
}
[data-hook="profile_nav"] [data-hook="user_watch_button"] span:nth-child(2):nth-last-child(2):before {
    content:none
}*/
.-B55x:before {
    content:none
}
/*more menu*/
.qtF97 .no-theme-skin {
    font-size: 8.25pt;
    color: #3d4745;
    background: #fff;
    border: 1px solid #52695c;
    padding: 2px;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 20%), 0px 0px 2px rgba(0, 0, 0, 20%), 0px 1px 1px rgba(0, 0, 0, 20%); 
}
.qtF97 .no-theme-skin > div {
    background: -webkit-linear-gradient(top, #e8ece6, #dce5db);
}
.qtF97 .no-theme-skin > div [role="menu"] {
    background:none!important
}
/*PROFILE PAGE 1*/
/*profile info P1*/
._3Gcpe {
    position:absolute;
    width:100%;
    left:0;
    margin-top:-4px;
    border-bottom: 1px solid #9eb1a2;
    border-top: 1px solid #9EB1A2;
    background: -webkit-linear-gradient(top, #e2e8e1, #d0ddcf);
    height:46px;
    padding-left:262px;
    box-sizing:border-box
}
.jiC7q ._3Gcpe {
    margin-top:20px
}
._3Gcpe > span {
    font: 11pt "Trebuchet MS",sans-serif;
    font-weight: bold;
    color:#3d4745;
    line-height:41px;
    padding:0 10px
}
._3Gcpe > span:before {
    background: url(http://st.deviantart.net/minish/gruzecontrol/dipdipdip.gif) no-repeat left;
    line-height:41px;
    min-height:41px;
    position:absolute;
    margin-left:-10px;
    color:transparent!important
}
._3Gcpe > span:last-child {
    background:url(http://st.deviantart.net/minish/gruzecontrol/down.gif) no-repeat center;
}
._3Gcpe > span:last-child svg {
    fill:none
}
._3WnyP, ._2Ofv6 { /*info fix*/
    position:static;
    margin:0
}
body:not(.mobile) ._2wh6V, body:not(.mobile) ._2wh6V ~ span img {
    width:50px;
    height:50px;
    margin-right:8px
}
/*main profile boxes P2*/
#background-container ~ div > div:last-child {
    max-width:100%
}
#background-container ~ div > div:last-child > div > div > div:first-child {
    margin:0 8px 0 16px;
}
#background-container ~ div > div:last-child > div > div > div:last-child {
    margin:0 16px 0 8px;
    box-sizing:border-box
}
[data-role="widget"] > div:first-child h2[class] {
    font: 400 13.5pt Trebuchet MS,sans-serif;
    color:#2c3635!important;
}
#background-container ~ div > div:last-child > div > div > div section[data-role="widget"] > div:first-child {

    background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB9AAAAAjCAYAAADMmZFAAAAABHNCSVQICAgIfAhkiAAAAeBJREFUeJzt2z0uhGEAhdFnPqMXhVI0OpVl+FumBQhWoKMhg5AoLEFQiMSobMErcc4Kbv/kzqqWy6vV2+dpe2dr9/P45PgxAAAAAAAAAPhnZounxeZXH2uL24frqoO9/dGbAAAAAAAAAODXzb+WHxuLu4fLn3D+9vI6eBIAAAAAAAAA/L5pttL76BEAAAAAAAAAMNr8+ub+4mj/0PMcAAAAAAAAgH9tmmbT+ugRAAAAAAAAADDaNHoAAAAAAAAAAPwFAjoAAAAAAAAAJKADAAAAAAAAQCWgAwAAAAAAAEAloAMAAAAAAABAJaADAAAAAAAAQCWgAwAAAAAAAEAloAMAAAAAAABAJaADAAAAAAAAQCWgAwAAAAAAAEAloAMAAAAAAABAJaADAAAAAAAAQCWgAwAAAAAAAEAloAMAAAAAAABAJaADAAAAAAAAQCWgAwAAAAAAAEAloAMAAAAAAABAJaADAAAAAAAAQCWgAwAAAAAAAEAloAMAAAAAAABAJaADAAAAAAAAQCWgAwAAAAAAAEAloAMAAAAAAABAJaADAAAAAAAAQCWgAwAAAAAAAEAloAMAAAAAAABAJaADAAAAAAAAQCWgAwAAAAAAAEBV86rT87PROwAAAAAAAABgqG89TCZkkI7viQAAAABJRU5ErkJggg==');
    position:relative;
    width:calc(100% - 5px);
    height:35px;
    margin-bottom:0
}
#background-container ~ div > div:last-child > div > div > div section[data-role="widget"] > div:first-child:after {
    content:"";
    width:5px;
    background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAjCAYAAABcmsDOAAAABHNCSVQICAgIfAhkiAAAAGlJREFUKJFjWLZp2f8zZ86wMiABxk9/Pv7fsm0rAwMDA4OOvo6Qnrzee4Znb5/8//Tn4/9Pfz7+X7Zp2X8GBgYGJgY0cO3BeW/GZ2+f/IcJ8PDzMmzZthVTJVbto4KjgmQKshw4eghDEADc0Ccs7n4SowAAAABJRU5ErkJggg==');
    display:inline-block;
    height:100%;
    margin-right:-5px
}
#background-container ~ div > div:last-child > div > div > div section[data-role="widget"] > div:first-child:before {
    content:"";
    position: absolute;
    background: url(http://st.deviantart.net/minish/gruzecontrol/quadraforce.gif?6) 0 0;
    width: 15px;
    height: 10px;
    bottom: -9px;
    left: 12px;
    z-index:2
}
#background-container ~ div > div:last-child > div > div > div section[data-role="widget"] > div:first-child h2 {
    padding-left:8px;
    padding-right:64px
}
#background-container ~ div > div:last-child > div > div > div section > div[data-role="widget"]:first-child h2 a:after {
    content:"";
    float: left;
    position: static;
    width: 29px;
    background-image: url(http://st.deviantart.net/minish/gruzecontrol/icons-small-modules.gif?14);
    height:24px;
}
#background-container ~ div > div:last-child > div > div > div section[data-role="widget"] > div:last-child > div {
    border:1px solid #a6b2a6;
    border-top:0;
    background:#dae4d9;
    border-radius:0 0 4px 4px;
    height:auto; /*included for scroller*/
}

#background-container ~ div > div:last-child > div > div:nth-child(2) > div section[data-role="widget"]:nth-child(2) > div:last-child > div:not([class]) { /*posts*/
    background:none!important;
    border:0;
    border-radius:0
}
._3mGK_ {
    justify-content:center;
    padding-top:16px;
}
._2Q3jU >div:first-child h2 a:after { /*ID*/
    background-position:-1440px 0
}
h2 a[href*="#group_list_admins"]:after, h2 a[href*="#group_list_member"]:after { /*admin*/
    background-position: -2240px 0;
}
h2 a[href*="#watchers"]:after { /*watchers*/
    background-position: -280px 0;
}
h2 a[href*="watching"]:after {
    background-position: -1080px 0;
}
._2Q3jU > div:last-child h2:after { /*comment*/
    content:"";
    float: left;
    position: static;
    width: 29px;
    background-image: url(http://st.deviantart.net/minish/gruzecontrol/icons-small-modules.gif?14);
    height:24px;
    background-position: -240px 0;
}
/*watchers P3*/
section ._22eEA {
    background:none!important;
    box-shadow:none!important;
    height:auto;
    width:auto
}
.zr0qH, ._1pn40 {
    width:auto!important;
    margin-right:4px!important
}
._1pn40 {
    margin-top:10px;
    margin-left:4px
}
section ._22eEA > div {
    padding:0
}
section ._22eEA > div > div { /*name*/
    display:none
}
section ._22eEA > div span {
    margin:0
}
section ._22eEA > div img, section ._22eEA ._3e1wT {
    border-radius:0;
    width:50px!important;
    height:50px!important;
}
._3e1wT, ._2noXo /*unknown user*/ {
    background:url("http://a.deviantart.net/avatars/default.gif")!important;
    border-radius:0;
    min-width:50px;
    min-height:50px
}
._3e1wT svg, ._2noXo svg {
    display:none
}
/*groups P4*/
._3tn4a {
    justify-content:center;
    padding-top:16px
}
._3tn4a a[class] {
    margin-right:4px!important;
    margin-bottom:4px;
    padding:0;
    background:none;
    max-width:100px;
}
._3tn4a a[class] > div:first-child {
    margin-bottom:3px
}
._3tn4a a[class] > div:last-child { /*remove this if you want text*/
    display:none
}
/*about P5*/
html body[class] ._3rCfZ {
    padding:0 30px
}
._2vziw > div > div {
    font: 13pt/normal 'Trebuchet MS', sans-serif;;
    color:#6D7866!important;
    margin-bottom:3px;
    padding:0
}
._2ITft { /*my bio text*/
    display:none
}
._2BQQN {
    display:block
}
._2BQQN > div {
    gap:0;
    align-items:start;
    justify-content:start;
    grid-auto-columns: 32px;
    grid-auto-rows: 24px;
}
._2BQQN a[class] {
    background:none;
    border-radius:0;
    padding:0;
    width:24px;
    height:24px
}
._1-OP8, ._1-OP8 p { /*main description*/
    font:400 9pt verdana;
    line-height:18px;
    letter-spacing:0;
    color:#2c3635!important
}
._1-OP8 hr {
    display:none
}
._1-OP8 hr ~ div {
    border-radius: 3px;
    margin: 0 0px 30px;
    background-color: #e8ece3;
    padding:10px
}
._1-OP8 [style="max-height: 360px;"] {
    max-height:300px!important
}
._1-OP8 [style="max-height: 360px;"] ~ div {
    display:none
}
.VkafX._3FHsc, .VkafX { /*button*/
    font:bold 13px/normal 'Trebuchet MS', sans-serif;
    color:#498091;
    background:#e8ece3;
    margin:0;
}
._1-OP8 hr ~ div div {
    font:400 9pt verdana;
    letter-spacing:0;
    color:#2c3635
}
._1-OP8 hr ~ div > div {
    margin-bottom:17px
}
._1-OP8 hr ~ div > div > div:first-child {
    color:#2c3635;
    font-weight:bold;
    margin:0
}
.dw_VT { /*hacky movement to top*/
    position:absolute;
    left:0px;
    top:109px;
    width:262px;
    height:39px;
    border-bottom:1px solid #9eb1a2;
    background: -webkit-linear-gradient(top, #e2e8e1, #d0ddcf);
    z-index:2
}
.dw_VT li {
    margin:0 0 0 13px;
    max-width:122px;
    text-overflow:ellipsis;
    height:auto
}
.dw_VT ul {
    display:grid;
}
.dw_VT li:nth-child(2) {
    grid-row:1;
    grid-column:2;
    overflow:hidden
}
.dw_VT span {
    font-family: Verdana,sans-serif;
    line-height: 1.4em;
    text-align: left;
    color: #3d4745!important;
    font-size: 8.25pt;
    margin:0px;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis
}
.dw_VT span span {
    display:none
}
.bdzzI:first-child:before {
    content:"|"
}
/*comments P6*/
[data-hook="profile-comments-widget"] > div > div {
    border:0!important;
    background:none!important;
    padding:0
}
[data-hook="comments_thread"] > div {
    box-shadow:none!important;
    background:none!important
}
[data-hook="comments_thread"] > div > div > div {
    padding:0
}
.da-editor-comment { /*poster pfp*/
    margin-left:70px
}
._1I4Xx { /*thread continuer placement*/
    margin-left:30px
}
._7Ji3K {
    margin-left:60px
}
._1HjTd:after, ._12UUt { /*arrow line thing*/
    left:-26px
}
._1HjTd:after {
    width:22px
}
.da-editor-comment {
    border:0
}
.da-editor-comment > div, .da-editor-comment > div > div {
    background:none!important;
    border:0!important;
    padding:0!important
}
.da-editor-comment > button[class], .da-editor-comment > div > button[class], .da-editor-comment [contenteditable="true"] {
    border: 1px solid #a5afa5;
    margin: 0 0 10px 0;
    display: block;
    background: #fff;
    background: url(http://st.deviantart.net/minish/deviation/textarea-shadow-left.png) no-repeat,url(http://st.deviantart.net/minish/deviation/textarea-shadow-right.png) top right no-repeat,#fff url(http://st.deviantart.net/minish/deviation/textarea-shadow.png) repeat-x;
    padding: 3px;
    border-radius:6px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 20%) inset, 0 1px 0 rgba(255, 255, 255, 50%);
    height:52px;
    color:#2c3635;
}
.da-editor-comment > button[class]:before, .da-editor-comment [contenteditable="true"]:before {
    position: absolute;
    top: 15px;
    left: -12px;
    background: url(http://st.deviantart.net/minish/deviation/comment-arrow-form-uplift.png?3) no-repeat 0 0;
    display: block;
    width: 17px;
    height: 17px;
    content: "";
}
.da-editor-comment footer[class] {
    background:none;
    padding:0;
}
.da-editor-theme-dark div[dir] ._3L_2x p, .theme-dark ._13KHC, .theme-light .forced-theme-dark ._13KHC, .da-editor-theme-dark ._3md8v { /*??? why is this profile dark.. comment profile, about, about*/
    color:#2c3635
}
div [data-commentid] > div:last-child > div:first-child {
    border-radius: 6px;
    border: 1px solid #b5bfb5;
    background: #dde5d8;
    min-height:76px;
    padding:8px
}
div [data-commentid] .user-link {
    font: 13.5pt Trebuchet MS,sans-serif;
    font-weight: bold;
    letter-spacing: -1px;
    color: #337287;
}
div [data-commentid] [datetime] {
    color: #2c3635;
    font-size: 8.25pt;
    line-height: 1em;
    font-family:verdana;
    letter-spacing:0;
}
div [data-commentid] [datetime]:hover {
    text-decoration:underline
}
div [data-commentid] p a {
    font-weight:normal
}
._29wNB._1ICJh, ._3dYp3.-ZDuE, ._3PP-i._1WAT1 { /*author*/
    background:#e8ece3;
    border-radius:0
}
._39LKs {
    gap:0;
    display:inline-block;
    position:absolute;
    left:-4px;
    top:54px
}
._39LKs > button > span > span {
    display:none
}
._39LKs > div {
    font:400 9pt verdana;
    letter-spacing:0;
    display:inline-block
}
/*scroller gallery fix P7*/
.f_4No, ._3IwK5 {
    margin:0;
    height:auto
}
/*static gallery fix*/
.l_7z8 section > div > div > div > div {
    width:auto!important;
}
.l_7z8 section > div > div > div > div > div {
    margin-bottom:0!important
}
.l_7z8 section > div > div > div > div > div > div > div {
    transform:scale(.98)
}
/*donation pool P8*/
._1xz8s {
    padding:12px
}
._1xz8s > div {
    padding:0
}
._1xz8s > div > div:first-child {
    color: #2c3635;
    font-size: 9pt;
    font-family: Verdana,sans-serif;
}
._1xz8s > div > div[role="progressbar"] {
    background: url(https://st.deviantart.net/minish/gruzecontrol/bun.gif) no-repeat top left;
    height:24px;
    width:96%
}
._1xz8s > div > div[role="progressbar"] > div {
    background: url(https://st.deviantart.net/minish/gruzecontrol/hotdog-tile.gif);
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    background-position: right top;
}
.xO16X._3y9NN {
    font: 8.25pt Verdana,sans-serif;
    line-height: 24px;
    vertical-align: middle;
    height: 24px;
    color: #000;
    position:relative;
    margin-bottom:-24px;
    z-index:2;
    margin-left:6px
}
/*posts on main profile P9*/
._3k4ob {
    margin-top:12px!important
}
._3k4ob > div {
    background: #eef5eb;
    border: 1px solid #cad4c5;
    border-radius: 3px;
    box-shadow: inset 0 1px 0 #f2fcf1, inset 1px 0 0 #f2fcf1, inset -1px 0 0 #f2fcf1, 0 1px 3px rgba(0, 0, 0, 10%), 0 1px 1px rgba(0, 0, 0, 5%);
    margin-top:0!important
}
._3k4ob > div > div:first-child {
    padding:8px 7px 8px 10px
}
.Whohk { /*pfp*/
    width:20px;
    height:20px;
    margin-right:4px;
}
.Whohk a.user-link img {
    width:20px;
    height:20px;
    margin:0;
}
._3k4ob > div > div:first-child > div:nth-child(2) > div {
    font-family: Trebuchet MS,sans-serif;
    font-size: 15px;
    font-weight: bold;
    letter-spacing: -1px;
    color:#337287;
    flex:1;
    line-height:normal;
    height:17px
}
._3k4ob > div > div:first-child > div:nth-child(2) {
    flex-direction:row;
    flex:1;
    align-items:center;
    height:20px;
    margin:0
}
._21HZA._3mbZn {
    font:25px/1.4 Helvetica Neue,sans-serif;
    font-size:small
}
._3k4ob > div > section > div > div > div {
    padding:0 8px 8px 8px
}
._3k4ob > div > div:last-child {
    padding:0 8px 8px 8px
}
._3k4ob > div > div:last-child > div:first-child {
    border:0;
    margin-bottom:6px
}
._3k4ob > div > div:last-child > div:first-child > div {
    min-height:0
}
._3k4ob > div > div:last-child > div:first-child > div:first-child > * { /*bottom button*/
    padding: 0 3px;
    border: 1px solid #d4decf;
    border-radius: 3px;
    width: 32px;
    height: 32px;
    background: #eef5eb;
    color: #6a7b5d;
    cursor: pointer;
    position: relative;
    box-sizing:border-box
}
._3k4ob > div > div:last-child > div:first-child > div:first-child > button > span:nth-child(2) {
    display:none
}
._3k4ob > div > div:last-child > div:first-child > div:first-child > div > button > span > span:nth-child(2) {
    display:none
}
._3k4ob > div > div:last-child > div:first-child > div:first-child > div > button > span > span {
    margin:0
}
._2tcyb+._2lV1W { /*img in post*/
    height:250px
}
._3k4ob > div > div:first-child > div:nth-child(3) button {
    background:none!important;
    width:26px;
    height:26px;
    border-radius:0
}
._3k4ob > div > div:first-child > div:nth-child(3) > button { /*watch button on posts*/
    display:none
}
._3k4ob time {
    font-size: 8.25pt;
    color:#778584
}
/*profile customization P10*/
/*profile skin*/
._2Ofv6 ~ div nav[class] ._2ajoU button[class] span:first-child,
._2Ofv6 ~ div nav[class] .bozEq > button[class]._hZXS span:first-child {
    display:none
}
._2Ofv6 ~ div nav[class] ._2ajoU button[class] span:last-child:before,
._2Ofv6 ~ div nav[class] .bozEq > button[class]._hZXS span:last-child:before {
    content:"";
    display:inline-block;
    width:20px;
    height:18px;
    background:url("http://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif") -2040px -1px;
    margin-bottom:-3px;
    margin-right:6px;
    margin-left:-3px
}
._2GZvO { /*add cover img button*/
    width:240px;
    right:0;
    left:auto;
    height:33px;
    padding:0!important;
    top:112px
}
._2GZvO > div[class] {
    top:0;
    bottom:0;
    background:none!important;
    border:0!important;
    padding:0!important
}
._2GZvO > div > div:nth-child(2) { /*icon*/
    display:none
}
._2GZvO > div > div button[class] span:nth-last-child(2) { /*fx*/
    display:none
}
._2GZvO > div > div button[class], ._2XS_w .Ul6Bx button[class] { /*green button setter*/
    background: -webkit-linear-gradient(top, #DBF088, #B1E03E);
    border: 1px solid #93A98F;
    border-radius: 5px;
    height:auto;
    padding:7px 8px 6px 8px;
    min-height:0;
    min-width:66px
    
}
._2GZvO > div > div button[class]:hover, ._2XS_w .Ul6Bx button[class]:hover {
    background: -webkit-linear-gradient(top, #E7F78A, #BFEB2E);
}
._2GZvO > div > div button[class]:active, ._2XS_w .Ul6Bx button[class]:active {
    background: -webkit-linear-gradient(top, #91C01E, #BCD168);
}
._2GZvO > div > div button[class] span, ._2XS_w .Ul6Bx button[class] span {
    font:normal 12px 'Trebuchet MS',sans-serif;
    text-transform:none;
    letter-spacing:0;
    padding:0;
    line-height:1;
    color:#000!important
}
._2XS_w .YPnoM { /*blue button*/
    border-radius:5px;
    background: -webkit-linear-gradient(top, #0088B5, #005D7C);
    border:1px solid #1D4253;
    font:normal 14px 'Trebuchet MS',sans-serif;
    text-transform:none;
    letter-spacing:0;
    line-height:1;
    color:#fff;
    padding:7px 8px 6px 8px;
    min-height:32px;
    min-width:97px;
    height:auto;
    width:auto;
}
._2XS_w .YPnoM:hover {
    background: -webkit-linear-gradient(top, #00A4C6, #00739A);
}
._2XS_w .YPnoM:active {
    background: -webkit-linear-gradient(top, #00537A, #0084A6);
}
/*GALLERY TAB*/
.o0ay7 h2, ._3j0ge div, ._3j0ge div span[class] { /*gallery title*/
    font-size: 10px;
    text-transform: uppercase;
    font-family: Verdana,sans-serif;
    font-weight: bold;
    flex-grow:initial;
    letter-spacing:0;
    margin-right:0;
    margin-left:23px
}
._3j0ge div span[class] {
    margin-left:6px
}
._3j0ge div {
    margin-left:13px
}
._3Jbpo[style="margin-top: 54px; margin-left: 0px; top: 0px;"], [style="margin-top: 64px; margin-left: 0px; top: 0px;"] { /*featured dropdown*/
    margin-top:42px!important
}
._3Jbpo[style="margin-top: 54px; margin-left: 0px; top: 0px;"] > div, [style="margin-top: 64px; margin-left: 0px; top: 0px;"] > div {
    padding:0;
    padding-bottom:2px;
    height:26px;
    padding-left:6px
}
.o0ay7 {
    width:auto;
    margin-right:0
}
.o0ay7 > div {
    flex-grow:initial;
    display:inline-block
}
._2Hjax { /*gallery search bar*/
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    text-shadow: 1px 1px 1px #fff;
    float: left;
    margin-top: 1px;
    background: #fff;
    -webkit-box-shadow: inset -2px 2px 3px rgba(0, 0, 0, 30%);
    box-shadow: inset -2px 2px 3px rgba(0, 0, 0, 30%);
    border: 1px solid #808080;
    height: 24px;
    min-height:0;
    width: 300px;
    position: relative;
    padding:0!important;
    color:#000;
}
._2Hjax button > div svg {
  opacity:0
}
._2Hjax:after {
    content:"Search Art";
    display:inline-block;
    border: 1px solid #93a98f;
    background: -webkit-linear-gradient(top, #dbf088, #b1e03e);
    border-top-right-radius: 3px;
    border-top-left-radius: 0;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 0;
    padding: 0 15px;
    text-shadow: 1px 1px 1px #fff;
    font-size: 11px;
    line-height: 22px;
    margin-left: -2px;
    margin-top: 1px;
    height: 26px;
    position:absolute;
    right:-91px;
    box-sizing:border-box
}
._2Hjax:hover:after {
    background: -webkit-linear-gradient(top, #e7f78a, #bfeb2e);
}
._1hkGk {
    background:none;
    border:none
}
[data-hook="gallection_folder"] { /*folders*/
    padding:0
}
[data-hook="gallection_folder"] > div {
    padding:0
}
[data-hook="gallection_folder"] section {
    width:auto!important;
    height:auto!important
}
[data-hook="gallection_folder"] section:nth-child(1), [data-hook="gallection_folder"] section:nth-child(2) {
    max-height:33px;
}
[data-hook="gallection_folder"] section:nth-child(1) {
    position:absolute
}
[data-hook="gallection_folder"] section:nth-child(2) {
    margin-top:30px
}
[data-hook="gallection_folder"] > div [href] > div[class] {
    background:rgba(64,81,53,0.7);
    padding:0;
    border:0
}
[data-hook="gallection_folder"] > div [href] > div[class] > div:nth-child(2) {
    margin-top:0;
    height:auto
}
[data-hook="gallection_folder"] > div [href] > div[class] > div:last-child > div {
    margin-top:-20px;
    padding: 1px 3px;
    font: 8.25pt Verdana,sans-serif;
    color: #fff;
    background-color: rgba(8,8,8,0.7);
}
[data-hook="gallection_folder"] > div [href] > div[class] > div:last-child > div > div > div {
    font: 8.25pt Verdana,sans-serif;
    max-width:130px;
    display:inline-block;
    margin-top:0;
    letter-spacing:0;
    color:#fff
}
[data-hook="gallection_folder"] > div [href] > div[class] > div:last-child > div > div > div:last-child {
    margin-left:6px
}
[data-hook="gallection_folder"] > div [href*="/all"] > div[class],
[data-hook="gallection_folder"] > div [href*="/featured"] > div[class] { /*all and featured*/
    padding:0;
    background:none!important;
    margin-right:4px
}
[data-hook="gallection_folder"] [href*="/all"] > div > div[class]:first-child,
[data-hook="gallection_folder"] [href*="/featured"] > div > div[class]:first-child {
    display:none
}
[data-hook="gallection_folder"] [href*="/all"] > div > div[class]:last-child div,
[data-hook="gallection_folder"] [href*="/featured"] > div > div[class]:last-child div {
    margin-top:0!important;
    display:inline-block;
    font: bold 17px "Trebuchet MS",Arial,sans-serif!important;
    letter-spacing: -1px!important;
    color:#337287!important;
    line-height:25px!important;
    background:none!important;
    vertical-align:middle
}
[data-hook="gallection_folder"] [href*="/all"] > div > div[class]:last-child div:last-child span,
[data-hook="gallection_folder"] [href*="/featured"] > div > div[class]:last-child div:last-child span {
    font:inherit
}
[data-hook="gallection_folder"] [href*="/all"] > div > div[class]:last-child div svg,
[data-hook="gallection_folder"] [href*="/featured"] > div > div[class]:last-child div svg {
    display:none
}
[data-hook="gallection_folder"] [href*="/all"]:hover > div > div[class]:last-child div,
[data-hook="gallection_folder"] [href*="/featured"]:hover > div > div[class]:last-child div {
    color:#2c3635!important
}
[data-hook="gallection_folder"] [href*="/all"] > div._1w9jk > div[class]:last-child div,
[data-hook="gallection_folder"] [href*="/featured"] > div._1w9jk > div[class]:last-child div {
    color:#d45207!important
}
[data-hook="gallection_folder"] [href*="/all"] > div > div[class]:last-child > div > div > div:first-child:before,
[data-hook="gallection_folder"] [href*="/featured"] > div > div[class]:last-child > div > div > div:first-child:before {
    content:"";
    float:left;
    background: transparent url(http://st.deviantart.net/minish/gruzecontrol/gallery-icons.png) 0 -38px no-repeat;
    width:30px;
    height:31px;
}
[data-hook="gallection_folder"] [href*="/featured"] > div > div[class]:last-child > div > div > div:first-child:before {
    background-position:0 -2px
}
[data-hook="gallection_folder"] [href*="/all"] > div > div[class]:last-child > div > div > div:last-child,
[data-hook="gallection_folder"] [href*="/featured"] > div > div[class]:last-child > div > div > div:last-child {
    margin-left:6px
}
[data-hook="gallection_folder"] [href*="/all"] > div > div[class]:last-child > div > div > div:last-child:before,
[data-hook="gallection_folder"] [href*="/featured"] > div > div[class]:last-child > div > div > div:last-child:before {
    content:"("
}
[data-hook="gallection_folder"] [href*="/all"] > div > div[class]:last-child > div > div > div:last-child:after,
[data-hook="gallection_folder"] [href*="/featured"] > div > div[class]:last-child > div > div > div:last-child:after {
    content:")"
}
/*main gallery P11*/
#sub-folder-gallery > div > div > div > div {
    margin:0;
    height:auto
}
._1QdgI a > div,
._3oBlM a > div { /*3oblm is for home page, NOT gallery / profiles*/
    background:none;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 10%), 0 1px 1px rgba(0, 0, 0, 20%), 0 2px 2px rgba(0, 0, 0, 20%);
}
._1QdgI,
._3oBlM {
    height:auto!important;
    padding-bottom:50px
}
._1QdgI div .forced-theme-dark, 
._3oBlM div .forced-theme-dark {
    height:calc(100% + 38px)!important
}
._1QdgI a[href][class] h2, 
._3oBlM a[href][class] h2 {
    color: #121516;
    font-family: "Trebuchet MS";
    font-weight: bold;
    font-size: 14px;
    line-height: 125%;
}
._1QdgI [data-username], ._1QdgI div .forced-theme-dark > div:last-child > div:last-child > *, 
._3oBlM [data-username], ._3oBlM div .forced-theme-dark > div:last-child > div:last-child > * {
    font-family: Verdana;
    font-size: 10px;
    line-height: 125%;
    color:#8c9a88;
    flex-direction:row;
    max-height: 12.5px;
    display:flex;
    gap: 4px;
}
._1QdgI [data-username]:hover, ._1QdgI div .forced-theme-dark > div:last-child > div:last-child > *:hover, ._1QdgI a[href][class]:hover h2, 
._3oBlM [data-username]:hover, ._3oBlM div .forced-theme-dark > div:last-child > div:last-child > *:hover, ._3oBlM a[href][class]:hover h2 {
    color:#337287;
}
._1QdgI a.user-link img, 
._3oBlM a.user-link img {
    height:12px;
    width:12px;
    margin:0
}
._1QdgI div .forced-theme-dark > div:last-child > div, ._1QdgI a[href][class] ~ div, 
._3oBlM div .forced-theme-dark > div:last-child > div, ._3oBlM a[href][class] ~ div {
    gap:0;
    height:auto;
    opacity:1;
    content-visibility:visible
}
._1QdgI div .forced-theme-dark > div:last-child, 
._3oBlM div .forced-theme-dark > div:last-child {
    left:0;
    right:0;
    bottom:0;
    background:#dae4d955
}
._1QdgI div .forced-theme-dark > div:last-child > div:last-child > a > span:first-child, 
._3oBlM div .forced-theme-dark > div:last-child > div:last-child > a > span:first-child {
    display: inline-block;
    width: 11px;
    height: 11px;
    background: transparent url(http://st.deviantart.net/minish/deviation/icon_comments_stats_mini.png?2) left top no-repeat;
    margin-bottom: -3px;
}
._1QdgI div .forced-theme-dark > div:last-child > div:last-child > button > span:first-child, 
._3oBlM div .forced-theme-dark > div:last-child > div:last-child > button > span:first-child {
    display: inline-block;
    width: 11px;
    height: 11px;
    background: transparent url(http://st.deviantart.net/minish/deviation/icon_comments_stats_mini.png?2) left -15px no-repeat;
    margin-bottom: -3px;
}
._1QdgI a[href][class], 
._3oBlM a[href][class] {
    pointer-events:all
}
._1QdgI div .forced-theme-dark > div:last-child > div:last-child > a:after, 
._3oBlM div .forced-theme-dark > div:last-child > div:last-child > a:after {
    content:"Comments"
}
._1QdgI div .forced-theme-dark > div:last-child > div:last-child > button:after, 
._3oBlM div .forced-theme-dark > div:last-child > div:last-child > button:after  {
    content:"Favorites";
}
._1QdgI div .forced-theme-dark > div:last-child > div:last-child > button[aria-label="Award Badge"], 
._3oBlM div .forced-theme-dark > div:last-child > div:last-child > button[aria-label="Award Badge"] {
    display: none
}
._1QdgI div .forced-theme-dark > div:last-child > div:last-child svg, 
._3oBlM div .forced-theme-dark > div:last-child > div:last-child svg {
    color:transparent
}
._1QdgI a[href][class] ~ div > button, 
._3oBlM a[href][class] ~ div > button { /*watching*/
    display:none
}
._1QdgI div .forced-theme-dark > div:last-child > div:first-child:hover, 
._3oBlM div .forced-theme-dark > div:last-child > div:first-child:hover { /*expando!*/
    width:100%;
    overflow:visible;
    transition:all 2s
}
/*about page P9*/
a._3AoBG { /*sidebar*/
    border-radius: 4px;
    color: #38463e;
    height: 18px;
    background-position: 50% 0;
    display: block;
    padding: 3px 0 4px 10px;
    margin: 0;
    line-height: 18.5px;
    font-size: 12.3px;
    box-sizing:content-box;
    text-transform:none;
    letter-spacing:0;
    font-family:verdana;
    min-width:150px
}
._3XQhW {
    left:20px;
    margin-top:78px!important
}
a._2cjnC {
    background:#dfe8dd
}
h2.FSR6A, h2.FSR6A._2soi1 {
   font: bold 14pt Trebuchet MS,sans-serif;
    color:#2c3635;
    width:100%;
}
._3y1pI {
    padding:0;
    min-height:0
}
._2nbyL {
    position:static
}
._16pXW {
    margin:0 auto;
    width:100%
}
section#userstats, section#about ._3y1pI, section#about ._3y1pI ~ div > div:nth-child(2), section#about ._3y1pI ~ div > div:nth-child(3) {
    display:none
}
section#about {
    border:0;
    padding:0;
}
[data-max-width][data-min-width="640 800"] > button {
    background: #DAE4D9;
    border: 1px solid #A6B2A6;
    border-radius: 5px;
    text-align: center;
    color:#2c3635
}
[data-max-width][data-min-width="640 800"] > button:hover {
    color: #fff;
    text-decoration: none;
    background: #4D8B9F;
    border-color: #337287;
}
[data-max-width][data-min-width="640 800"] > button span {
    color:inherit
}
._3ukFW { /*llama table*/
    font-family: Verdana,sans-serif;
    padding: 4px 12px;
    font-size: 8.25pt;
    position: relative;
    height: 18px;
    box-sizing:content-box;
    line-height:1;
    flex-direction:row-reverse;
    justify-content:start;
    text-align:left;
    margin:0;
    width:auto
}
.CSs3p._3qeLR {
    background:#CCD9CD;
    margin:0;
    border:1px solid #a6b2a6;
    border-top:0;
    border-radius:0 0 5px 5px
}
._6Syj_ .hplto {
    font-size:8.25pt;
    line-height:1
}
._3ukFW span, ._3ukFW div, ._3ukFW button {
    font-family: Verdana,sans-serif;
    font-size: 8.25pt;
    letter-spacing:0;
    text-align:left;
    line-height:1;
}
._3ukFW button {
    font-weight:bold
}
._3ukFW a {
    color:#3C788B
}
._3ukFW > div {
    display:flex;
    line-height:1;
    align-items:center;
    flex:1
}
._1OMcP {
    margin-left:auto
}
._3nOW8 {
    background:none!important;
    margin:0;
    width:auto;
    height:auto;
    float:left;
    display:block;
    margin-top:-2px
}
._3ukFW:first-child {
    text-align:center;
    padding: 1ex;
    background: #C5D3C2;
    font-weight: bold;
}
._3ukFW:first-child > div > div {
    margin:0 auto
}
._3ukFW:first-child > div > div strong {
    font-family:verdana;
    font-weight:700;
    font-size:8.25pt
}
._30jPC, ._3mGK_ {
    border:1px solid #a6b2a6;
    background: #dae4d9;
    border-radius:5px 5px 0 0
}
#watchers ._3mGK_ {
    border-top:0;
    border-radius:0
}
._3ukFW:nth-child(2n) {
    background:#ccd9cd
}
/*S5 ART PAGE**************************************************************************/
#root > main[class] { /*main*/
    margin-top:42px
}
[data-hook="art_stage"] > div:first-child > div > div {
    background:none
}
._2z2V2 {
    background:#dae5d6
}
._2Esll { /*commission banner*/
    display:none
}
/*P1 moving stuff to the side*/
header[role="banner"] + div > div > div + div + section {
    position:absolute;
    top:10px;
    right:-340px;
    max-width:300px
}

header[role="banner"] + div > div > div + div + section > span {
    display:none
}
header[role="banner"] + div > div > div + div + section > div > div:first-child, header[role="banner"] + div > div > div + div + section > div > div:last-child { /*empty gap / fullscreen*/
    display:none
}
header[role="banner"] + div > div > div + div + section > div > div { /*straighten items*/
    display:inline;
    width:auto!important
}
header[role="banner"] + div > div > div + div + section > div > div > div:nth-child(1) > span:nth-child(2) { /*remove comment*/
    display:none
}
header[role="banner"] + div > div > div + div + section > div > div > div:nth-child(2) { /*remove gap*/
    display:none
}
header[role="banner"] + div > div > div + div + section > div > div > div:nth-child(3) { /*move group and award*/
    display:inline
}
header[role="banner"] + div > div > div + div + section > div > div > div > span > div > div > div, header[role="banner"] + div > div > div + div + section > div > div > div > span > div > div > button, header[role="banner"] + div > div > div + div + section > div > div > div > span > div > div > a { /*should cover all buttons*/
    cursor: pointer;
    position: relative;
    padding: 8px 6px;
    font: normal 15px 'Trebuchet MS',Trebuchet,sans-serif;
    color: #0077c7;
    text-decoration: none;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 5%);
    border-top: 1px solid #aebda8;
    border-left: 1px solid #a4b5a1;
    border-right: 1px solid #a4b5a1;
    border-bottom: 1px solid #99aa95;
    background: linear-gradient(#e2ece1, #d6e1d1);
    border-radius: 6px;
    box-shadow: inset 0 1px 0 #fff, inset 0 0 0 1px rgba(244, 247, 197, 45%);
    width:100%;
    justify-content:left;

}
header[role="banner"] + div > div > div + div + section > div > div > div:first-child > span > div > div > div {
    padding-right:22px;
    width:270px
}
header[role="banner"] + div > div > div + div + section > div > div > div:nth-child(3) > span > div > div > a {
    margin-bottom:15px
}
header[role="banner"] + div > div > div + div + section > div > div > div > span > div > div > div > button {
    height:auto;
    min-height:0;
    min-width:0;
    padding:0
}
header[role="banner"] + div > div > div + div + section > div > div > div > span > div > div > div > button:nth-child(2) { /*favorites arrow*/
    background:url("http://st.deviantart.net/minish/gallery/down.gif") no-repeat center;
    fill:none;
    border:0;
    padding:10px
}
header[role="banner"] + div > div > div + div + section > div > div > div > span > div > div > div > button:nth-child(2) span {
    opacity:0
}
header[role="banner"] + div > div > div + div + section > div > div > div > span > div > div > div > button span {
    text-shadow: 0 1px 0 rgba(0, 0, 0, 5%);
    font: normal 15px 'Trebuchet MS',Trebuchet,sans-serif;
    color: #0077c7;
}
header[role="banner"] + div > div > div + div + section > div > div > div:first-child > span > div > div > div > button:first-child span svg {
    background: url(http://st.deviantart.net/morelikethis/favestar.png) no-repeat 0 0;
    background-size: 23px 22px;
    height:21px;
    width:24px;
    color:transparent
}
header[role="banner"] + div > div > div + div + section > div > div > div:nth-child(3) > span {
    height:auto;
    margin-top:15px;
    margin-left:0!important;
    width:100%
}
[data-hook="deviation_award_badge_button"] svg {
    opacity:0
}
header[role="banner"] + div > div > div + div + section > div > div > div:nth-child(3) > span > div, header[role="banner"] + div > div > div + div + section > div > div > div:nth-child(3) > span > div > div {
    width:100%;
}
header[role="banner"] + div > div > div + div + section > div > div > div:nth-child(3) > span > div > div > div > button:after { /*group*/
    content:"Add to Group";
    text-shadow: 0 1px 0 rgba(0, 0, 0, 5%);
    font: normal 15px 'Trebuchet MS',Trebuchet,sans-serif;
    color: #0077c7;
}
header[role="banner"] + div > div > div + div + section > div > div > div:nth-child(3) > span > div > div > div > button svg {
    background: url(http://st.deviantart.net/morelikethis/blt_icons2.png) no-repeat 0 -81px;
    fill:none;
    padding-right:4px;
    height:21px
}
header[role="banner"] + div > div > div + div + section > div > div > div:nth-child(3) > span > div > div > button:after { /*llama*/
    content:"Award Llama";
    text-shadow: 0 1px 0 rgba(0, 0, 0, 5%);
    font: normal 15px 'Trebuchet MS',Trebuchet,sans-serif;
    color: #0077c7;
}
header[role="banner"] + div > div > div + div + section > div > div > div:nth-child(3) > span > div > div > button div {
    background:url("http://st.deviantart.net/badges/llama.gif");
    margin-right:4px;
    margin-top:-3px
}
header[role="banner"] + div > div > div + div + section > div > div > div:nth-child(3) > span > div > div > button div :is(img, svg) {
    opacity:0
}
header[role="banner"] + div > div > div + div + section > div > div > div:nth-child(3) > span > div > div > a:after { /*save*/
    content:"Download";
    text-shadow: 0 1px 0 rgba(0, 0, 0, 5%);
    font: normal 15px 'Trebuchet MS',Trebuchet,sans-serif;
    color: #0077c7;
}
header[role="banner"] + div > div > div + div + section > div > div > div:nth-child(3) > span > div > div > a svg {
    background: url(http://st.deviantart.net/minish/deviation/action-sprites.png);
    background-position: 1px -76px;
    color:transparent;
    height:21px;
    margin-right:4px
}
._2_Sxq { /*post bg removal*/
    background:none
}
/*P2 side panel*/
main > div > [role="complementary"][class] {
    background:#ccd9cb;
    width:304px;
    padding-top:300px;
    padding-left:12px;
    padding-right:12px;
}

main > div > [role="complementary"][class]:before {
    content:none
}
.jdrIC, ._2CwtT { /*ad*/
    display:none
}
main > div > [role="complementary"] a[href][title] > div > div {
    background:none;
    max-height:90px;
    max-width:90px
}
main > div > [role="complementary"] a[href][title] > div > div > img {
    max-width:90px;
    max-height:90px;
}
main > div > [role="complementary"] a[href][title] {
    opacity:1;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 40%), 0 0 0 1px rgba(0, 0, 0, 15%);
    max-width:90px;
}
.IQY8I, ._11Tv2, ._12G69 {
    gap:15px;
    overflow:visible
}
main > div > [role="complementary"][class] > div {
    margin:0;
    padding:0 0 10px 0;
}
main > div > [role="complementary"] > div:not(:first-child):not(:last-child) > div:first-child { /*titles*/
    display:none
}
main > div > [role="complementary"] > div > div:first-child > span > a, ._1C1wV, ._3b6yN, main > div > [role="complementary"] > div:last-child > div:first-child > span, ._1WGgC, ._2KTh- {
    color: #010201;
    letter-spacing: 0;
    margin-left: 7px;
    font: 12pt Trebuchet MS,sans-serif;
    letter-spacing: -1px;
    margin: 0 0;
    display: block;
    padding-top: 5px;
}
._1pZZp {
    margin-bottom:15px
}
._3ZrB6, ._8ESHH {
    margin:15px 0
}
/*P3 main info*/
main > div > [role="complementary"][class] ~ div:nth-of-type(3) {
    background:none!important
}
main > div > [role="complementary"][class] ~ div:nth-of-type(3) > div {
    width:100%;
    padding:0 0 0 10px;
    box-sizing:border-box
}
main ._1IYTz,
main[role="main"] > header+div > div+div+div > div:first-child > div[class]:first-child:has(h1) { /*title*/
    margin:0;
    border-bottom:1px solid #b2c3af;
    padding-bottom:13px;
    height:56px
}
main ._1IYTz h1,
main[role="main"] > header+div > div+div+div > div:first-child > div[class]:first-child:has(h1) h1 {
    font: bold 18pt Trebuchet MS,sans-serif;
    letter-spacing: -1px;
    color:#121516;
    line-height:1
}
main ._1IYTz > div:first-child > div:first-child,
main[role="main"] > header+div > div+div+div > div:first-child > div[class]:first-child:has(h1) > div:first-child > div:first-child { /*pfp*/
    margin-right:0px;
    margin-top:3px
}
main ._1IYTz > div:first-child > div:nth-child(2) > div:nth-child(2),
main[role="main"] > header+div > div+div+div > div:first-child > div[class]:first-child:has(h1) > div:first-child > div:nth-child(2) > div:nth-child(2) {
    max-height:24px
}
main ._1IYTz > div:first-child > div:last-child > div > div > div,
main[role="main"] > header+div > div+div+div > div:first-child > div[class]:first-child:has(h1) > div:first-child > div:last-child > div > div > div {
    font: bold 15px Trebuchet MS,sans-serif;
    letter-spacing: .298px;
    color:#414d4c;
    line-height:17.54px
}
main ._1IYTz > div:first-child > div:last-child > div > div > div:last-of-type,
main[role="main"] > header+div > div+div+div > div:first-child > div[class]:first-child:has(h1) > div:first-child > div:last-child > div > div > div:last-of-type {
    color:#337287
}
main ._1IYTz ~ div:nth-of-type(2),
main[role="main"] > header+div > div+div+div > div:first-child > div[class]:first-child:has(h1) ~ div:nth-of-type(2) {
    margin:0;
    display:inline-block;
    position:absolute;
    right:0;
    z-index:4;
    margin-top:10px;
}
main ._1IYTz ~ div:nth-of-type(2) > div, main ._1IYTz ~ div:nth-of-type(2) > div > span,
main[role="main"] > header+div > div+div+div > div:first-child > div[class]:first-child:has(h1) ~ div:nth-of-type(2) > div, main[role="main"] > header+div > div+div+div > div:first-child > div[class]:first-child:has(h1) ~ div:nth-of-type(2) > div > span {
    display:block;
    margin:0
}
main ._1IYTz ~ div:nth-of-type(2) > section,
main[role="main"] > header+div > div+div+div > div:first-child > div[class]:first-child:has(h1) ~ div:nth-of-type(2) > section {
    margin:0;
    border:0;
    padding:0
}
main ._1IYTz ~ div:nth-of-type(3):not([id]),
main[role="main"] > header+div > div+div+div > div:first-child > div[class]:first-child:has(h1) ~ div:nth-of-type(3):not([id]) { /*tags*/
    margin:0;
    position:absolute;
    top:50px;
    left:68px
}
main ._1IYTz ~ div:nth-of-type(3):not([id]) > div,
main[role="main"] > header+div > div+div+div > div:first-child > div[class]:first-child:has(h1) ~ div:nth-of-type(3):not([id]) > div {
    gap:0
}
main ._1IYTz ~ div:nth-of-type(3):not([id]) > div > a,
main[role="main"] > header+div > div+div+div > div:first-child > div[class]:first-child:has(h1) ~ div:nth-of-type(3):not([id]) > div > a {
    border:0;
    background:none;
    height:auto;
    padding:0;
    font-size: 8.25pt;
    font-family: Verdana,sans-serif;
    color: #000;
}
main ._1IYTz ~ div:nth-of-type(3):not([id]) > div > a:not(:last-child):after,
main[role="main"] > header+div > div+div+div > div:first-child > div[class]:first-child:has(h1) ~ div:nth-of-type(3):not([id]) > div > a:not(:last-child):after {
    content:" /";
    display:inline;
    margin-left:4px
}
main ._1IYTz ~ div:nth-of-type(3):not([id]) > div > a span,
main[role="main"] > header+div > div+div+div > div:first-child > div[class]:first-child:has(h1) ~ div:nth-of-type(3):not([id]) > div > a span {
    color:#337287
}
#description > div > div {
    font:400 9pt verdana,sans-serif;
    padding-top:3px;
    color: #000;
    border-top:1px solid #e9efe8;
    margin-right:100px
}
#description > div > div a {
    color:#3b5a4a;
    font-weight:normal
}
#description ~ div { /*image details*/
    margin-top:0
}
#description ~ div > div > div > div > div > div:first-child, ._1giX5 {
    font: 12pt Trebuchet MS,sans-serif;
    letter-spacing: -1px;
    color:#010201
}
#description ~ div > div > div > div > div > div:last-child > div, ._1giX5 > div {
    line-height: 1.65em;
    font-size: 8.25pt;
}
#description ~ div > div > div > div > div > div:last-child > div:first-child, ._1giX5 > div:first-child {
    color: #597465;
}
div[data-daeditor-fixed-paragraph] div[dir] p[class], .da-editor-deviation > div > div > div { /*description*/
    font:inherit!important;
    margin:0!important
}
    /*available now for customized works*/
._1u7hE {
    top:-40px;
    background:none!important
}
/*P4 comment*/
#root > main #comments ~ div {
    width:100%;
    padding-left:10px;
    margin:0
}
#root > main #comments ~ div [data-hook="comments_thread_stats"] {
    margin:0;
}
#root > main #comments ~ div [data-hook="comments_thread_stats"] div, #root > main #comments ~ div [data-hook="comments_thread_stats"] span {
    font-family: Verdana,sans-serif;
    font-size: 9pt;
    color:#768e81
}
#root > main #comments ~ div [data-hook="comments_thread_stats"] {
    margin-left:70px
}
#root > main #comments ~ div [data-hook="comments_thread"] .no-theme-skin > div:first-child > div:first-child {
    display:none
}
#root > main #comments ~ div [data-hook="comments_thread_stats"] ~ div > div > div {
    margin:4px 0
}
/*S6 NOTIFICATIONS**************************************************************************/
._3QEEr {
    margin-top:42px
}
.zD1sL {
    background: #3d4f42!important;
}
.zD1sL > div {
    min-height:0!important
}
._3xN82 {
    margin:0;
    padding:0 10px;
    border:0!important
}
._3Dyxw {
    margin:0 auto;
    justify-content:center;
}
._3Dyxw section {
    margin-top:-37px;
    background: #3d4f42
}
.zD1sL > div:first-child, .zD1sL > div:nth-child(3) {
    display:none
}
._2ub6p._1LL_7[style="margin-top: 54px; margin-left: 0px; top: 0px;"] {
    margin-top:42px!important;
    background:#3d4f42;
    height:35px;
}
._2ub6p._1LL_7[style="margin-top: 54px; margin-left: 0px; top: 0px;"] section {
    margin:0
}
.zD1sL > div[style="min-height: 14px;"] {
    min-height:0!important;
    height:0!important
}
body[class] button._1L12L {
    background: linear-gradient( #e3ebe2, #c7d5c0);
    border: 1px solid #94a98f;
    border-radius:0;
    box-shadow: 0 1px 0 rgba(255, 255, 255, 50%), 0 1px 0 rgba(0, 0, 0, 30%), 0 1px 0 #fff inset, 1px 0 0 rgba(255, 255, 255, 20%) inset, -1px 0 0 rgba(255, 255, 255, 20%) inset, 0 -1px 0 rgba(255, 255, 255, 20%) inset;
    color: #165071!important;
    min-width: 0;
    padding: 6px 8px 5px;
    margin-top: 0;
    display: inline-block;
    margin-left:-1px;
    font:400 9pt verdana;
    text-transform:none
}
body[class] button._1L12L:first-child {
    border-radius:6px 0 0 6px;
    margin-left:0
}
body[class] button._1L12L:last-child {
    border-radius:0 6px 6px 0
}
body[class] button._1L12L:hover {
    background: #e3ebe2;
    background: linear-gradient(#e3ebe2, #c7d5c0);
    box-shadow: 0 0 200px rgba(255, 255, 255, 40%) inset, 0 1px 0 rgba(255, 255, 255, 50%), 0 1px 0 rgba(0, 0, 0, 30%), 0 1px 0 #fff inset, 1px 0 0 rgba(255, 255, 255, 20%) inset, -1px 0 0 rgba(255, 255, 255, 20%) inset, 0 -1px 0 rgba(255, 255, 255, 20%) inset;
}
body[class] button._1L12L.hMsAU {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 20%) inset, 0 2px 72px rgba(0, 0, 0, 10%) inset, 0 -1px 1px rgba(0, 0, 0, 5%) inset, 0 1px 0 rgba(255, 255, 255, 30%);
    background: linear-gradient(#e3ebe2, #c7d5c0);
}
#root > div a[href="https://www.deviantart.com/watching/"] {
    height: 27px;
    text-align: center;
    padding: 0 7px 0 12px;
    display: block;
    text-decoration: none !important;
    font-size: 9pt;
    font-family: Verdana,sans-serif;
    letter-spacing: 0;
    line-height: 27px;
    white-space: nowrap;
    position: relative;
    background-image: url(http://st.deviantart.net/minish/gruzecontrol/gmbutton2qn2.png);
    color: #337287 !important;
    text-transform:none
}
#root > div a[href="https://www.deviantart.com/watching/"]:hover {
    background-position-y:-27px;
}
#root > div a[href="https://www.deviantart.com/watching/"]:active {
    background-position-y:-54px;
}
#root > div a[href="https://www.deviantart.com/watching/"]:after {
    content:"";
    background-image: url(http://st.deviantart.net/minish/gruzecontrol/gmbutton2qn2.png);
    background-position-x:right;
    background-position-y:inherit;
    width:6px;
    height:27px;
    position:absolute;
    right:-6px
}
._2zkIN {
    padding:0!important;
    height:34px
}
._2zkIN > div button {
    font: bold 17px "Helvetica Neue",Arial,sans-serif;
    color: #98aa96;
    height:34px;
    line-height:34px;
    letter-spacing:0;
    border-bottom:4px solid transparent
}
._2zkIN > div button:hover {
    color:#cbddc9
}
._2zkIN > .Vzimr.MMJvt button {
    color:#fff;
    border-bottom:4px solid #849285
}
.Vzimr.MMJvt:after {
    content:none
}
._1xxAS {
    min-height:35px;
}
._1xxAS span {
    color:#98aa96;
    font-family:"Helvetica Neue",Arial,sans-serif;
}
._2Jm2O { /*selection tools*/
    justify-content:center;
    margin-top:-30px;
    max-width:340px;
    margin-left:auto;
    margin-right:auto
}
._2Jm2O > div > *[class] {
    color:#98aa96;
    font:bold 17px "Helvetica Neue",Arial,sans-serif;
}
._2Jm2O > div > button[class]:hover {
    color:#cbddc9
}
button._1r2Sm span svg {
    color:red;
    margin-left:30px
}
._2r2GP { /*view all button*/
    visibility:visible
}
/*actual content lol*/
._2UJ9I {
    padding:0
}
._3sT1X.Hdjdq {
    margin:10px;
    padding-top:0
}
._1Kx7i {
    padding:20px;
    margin-top:2px
}
/*header*/
._3s875 {
    background: #e6ede4;
    border:1px solid #a6b2a6;
    border-left:0;
    border-right:0;
    padding:0;
    height:32px;
    padding-left:8px;
    padding-right:8px;
    padding-top:3px
}
._3s875 h2 {
    font: bold 18pt Trebuchet MS,sans-serif;
    cursor: default;
    font-weight: normal;
    font-size: 13.5pt;
    letter-spacing: 0;
    color: #2c3635!important;
    position: relative;
    top: -2px;
}
/*innie*/
._3fxzN._3q1dq {
    padding:5px;
    background: #DAE4D9;
    border: 1px solid #A6B2A6;
    border-radius: 5px;
    text-align: center;
    color: #2c3635;
    max-width:260px;
    height:auto!important
}
._1S1FT:after {
    content:none
}
._1S1FT._3fxzN._3q1dq {
    color: #fff;
    text-decoration: none;
    background: #4D8B9F;
    border-color: #337287;
}
._3afky, ._3afky a ~ div, ._3afky > div > div, ._3afky > div > section {
    max-width:260px;
    height:auto!important;
    width:auto!important;
    background:none!important
}
._3afky img {
    max-height:220px;
    padding:20px
}
._3fxzN._3q1dq[style*="margin-left: 1"] {
    margin-left:5px!important
}
body[class] ._3zfZG {
    background:none;
    box-shadow:none!important
}
body[class] ._3wkti {
    background:none;
    padding:0;
    height:auto;
    border-color:transparent
}
.L7gon {
    position:static;
    align-items:start;
    justify-content:left
}
.L7gon > div {
    color: #121516!important;
    font-family: "Trebuchet MS";
    font-weight: bold;
    font-size: 14px;
    line-height: 125%;
    letter-spacing:0;
    margin-left:10px;
    text-align:left
}
._1S1FT ._2vxdP ._3riIJ {
    color:white;
    font-family: "Trebuchet MS";
    font-weight: bold;
    font-size: 14px;
    line-height: 125%;
    letter-spacing: 0;
    margin-left: 10px;
    text-align: left;
}
._1S1FT ._1VRQE[datetime] {
    color:white
}
.L7gon > div > a div, .L7gon > div > button div, ._1VRQE[datetime] {
    font-family: Verdana;
    font-size: 10px;
    line-height: 125%;
    color: #8c9a88;
    height:auto;
    margin:0;
    letter-spacing:0
}
.L7gon > div > button {
    margin-top:0!important
}
.L7gon > div div ~ span {
    display:none
}
.L7gon ._2oqdw:not(:focus):not(:active):not(:focus-within) {
    position:static;
    margin-left:4px
}
._3wkti > div:first-child {
    display:none
}
._3q1dq ._1dZ7P {
    visibility:visible
}
._3DZT4 {
    margin:-5px!important;
    padding:5px!important
}
._1_e9A {
    top:4px;
    right:0;
    left:auto
}
._3FWf6~._1jKmH {
    top:4px;
    right:30px
}
._3afky > div span > label {
    top:4px;
    left:0
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
