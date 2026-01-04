// ==UserScript==
// @name         Instagram Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A dark mode for Instagram
// @author       Amenly
// @match        homepage
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389845/Instagram%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/389845/Instagram%20Dark%20Mode.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}

addGlobalStyle('._3Laht, .o64aR { background-color: #26282b !important; }'); //main background
addGlobalStyle('._lz6s { background-color: #353941 !important; }'); //gray header
addGlobalStyle('.Di7vw { background: #50728c !important; }'); //search bar background
addGlobalStyle('.Di7vw { border: solid 1px #50728c !important; }'); //search bar border
addGlobalStyle('.pbgfb { color: #999999 !important; }'); //'Search' text
addGlobalStyle('.x3qfX { background-color: #50728c !important; }'); //search bar background after clicking
addGlobalStyle('.XTCLo { border: solid 1px #50728c !important; }'); //search bar border after clicking
addGlobalStyle('.fuqBx { background-color: #353941 !important; }'); //search results background after clicking
addGlobalStyle('.JvDyy { background: #50728c !important; }'); //search result during mouse hover
addGlobalStyle('.Ap253 { color: #5f85db !important; }'); //handle text color in search result
addGlobalStyle('.Fy4o8 { color: #90b8f8 !important; }'); //username text color in search result
addGlobalStyle('.L3NKy, a.L3NKy, a.L3NKy:visited { background-color: #50728c !important; }'); //'Log In' background
addGlobalStyle('a.tdiEy, a.tdiEy:visited { color: #50728c !important; }'); //'Sign Up'
addGlobalStyle('.-fzfL { border-color: #50728c !important; }'); //'Following' border color
addGlobalStyle('.-fzfL { color: #50728c !important; }'); //'Following' text color
addGlobalStyle('.KV-D4 { color: #5F85DB !important; }'); //handle color
addGlobalStyle('.g47SY { color: #90b8f8 !important; }'); //#posts, #followers, #following
addGlobalStyle('.-nal3, .-nal3:active, .-nal3:hover, .-nal3:visited { color: #5F85DB !important; }'); //posts, followers, following
addGlobalStyle('._32eiM, ._32eiM:visited { color: #5f85db !important; }'); //'Followed by ____ + x more'
addGlobalStyle('.zwlfE { color: #5f85db !important; }'); //username color
addGlobalStyle('a.T-jvg, a.T-jvg:visited { color #50728c !important; }'); //'POSTS'
addGlobalStyle('a, a:visited { color: #50728c !important; }'); //'TAGGED'
addGlobalStyle('.T-jvg { border-top: 1px solid #999999 !important; }'); // line above 'POSTS'
addGlobalStyle('._3G4x7 { color: #50728c !important; }'); //'LANGUAGES'
addGlobalStyle('.DINPA { color: #90b8f8 !important; }'); //'INSTAGRAM FROM FACEBOOK'
addGlobalStyle('.eXle2 { color: #90b8f8 !important; }'); //text color of highlight names

//for pages with 'Requested'

addGlobalStyle ('._8A5w5, a._8A5w5, a._8A5w5:visited { border: 1px solid #50728c !important; color: #50728c !important; }'); //'Requested' border and 'Requested' text color
addGlobalStyle('._4Kbb_ { border: 1px solid #50728c !important; }'); //blank space border
addGlobalStyle('._4Kbb_ { background-color: #353941 !important; }'); //blank space
addGlobalStyle('.tHaIX { background-color: #26282b !important; }'); //lower blank space
addGlobalStyle('._41KYi { background: #353941 !important; }'); //profile blank space
addGlobalStyle('._41KYi { border: 1px solid #50728c !important; }'); //profile space border
addGlobalStyle('.Qj3-a, .Qj3-a:visited { color: #50728c !important; }'); //profile space--handle color
addGlobalStyle('._7cyhW { color: #90b8f8 !important; }'); //profile space--username color
addGlobalStyle('.L3NKy, a.L3NKy, a.L3NKy:visited { background-color: #90b8f8 !important; }'); //profile space--follow button background
addGlobalStyle('.L3NKy, a.L3NKy, a.L3NKy:visited { border: #50728c !important; }'); //profile space--follow button border
addGlobalStyle('.L3NKy, a.L3NKy, a.L3NKy:visited { color: #50728c !important; }'); //profile space--follow text color
addGlobalStyle('.Rebts { color: #5F85DB !important; }'); //'Suggestions For You'
addGlobalStyle('.VIsJD, .rkEop { color: #5F85DB !important; }'); //'This Account is Private'

//annoying white line
addGlobalStyle('.Nd_Rl, .fx7hk { border-top: 1px solid #50728c !important; }'); // annoying white line

//for pages you have neither followed nor requested to follow

addGlobalStyle('.jIbKX, .m4t9r.jIbKX { background: #90b8f8 !important; color: #353941 !important; }'); //'Follow' + Drop down
addGlobalStyle('.jIbKX, .m4t9r.jIbKX { border-color: #90b8f8 !important; }'); //border color of Follow and drop down

// // // // // // // // //

//for pages that result in 'Sorry, this page isn't available


addGlobalStyle('.-cx-PRIVATE-NavBar__root__ { background-color: #353941 !important; border-bottom: 1px solid #353941 !important; }'); //gray header
addGlobalStyle('.-cx-PRIVATE-NavBar__username__ { color: #90b8f8 !important; }'); //username color

//fixes to 'Sorry, this...'
addGlobalStyle('h2 { color: #90b8f8 !important; }'); //'Sorry, this page isn't available' text color

addGlobalStyle('.-cx-PRIVATE-ErrorPage__errorContainer__ { background-color: #26282b !important; padding: 100px 40px 0; }'); //upper background
addGlobalStyle('.-cx-PRIVATE-Page__main__ { background-color: #26282b !important; }'); //background color

addGlobalStyle('body { background-color: #26282b !important; }'); //full background
addGlobalStyle('.-cx-PRIVATE-Footer__copyright__ { color: #90b8f8 !important; }'); //2019 Instagram



//for individual posts
addGlobalStyle('.ltEKP .QBXjJ { border: 1px solid #26282b !important; }'); //border color
addGlobalStyle('.ltEKP .QBXjJ { background-color: #353941 !important; }'); //main background color
addGlobalStyle('.JyscU.ePUX4 .UE9AK { border-left: 1px solid #353941 !important }'); //upper box--left border
addGlobalStyle('.JyscU.ePUX4 .eo2As { border-left: 1px solid #353941 !important }'); //mid box-left border
addGlobalStyle('.JyscU .UE9AK { border-bottom: 1px solid #999999 !important }'); //upper box-bottom border
addGlobalStyle('.JyscU .Slqrh { border-top: 1px solid #999999 !important }'); //mid bottom box-top border
addGlobalStyle('.sH9wk { border-top: 1px solid #999999 !important }'); //bottom box-top border
addGlobalStyle ('span { color: #90b8f8 !important }'); //text color in comment sections
//for opening posts on an IG page
addGlobalStyle('.JyscU.ePUX4 .UE9AK { background-color: #353941 !important; }'); //upper box color

addGlobalStyle('.JyscU.ePUX4 .eo2As { background-color: #353941 !important; }'); //general background color

//Main page
addGlobalStyle('.M9sTE { background-color: #353941 !important; }'); //
addGlobalStyle('article._8Rm4L.M9sTE.L_LMM.SgTZ1.ePUX4 { border: 1px solid #999999 !important; }');

addGlobalStyle('.DPiy6 { background-color: #353941 !important; }'); //
addGlobalStyle('.b2rUF { border: 1px solid #999999 !important; }');

//suggestions
addGlobalStyle('.NP414.ccgHY.GZkEI { background-color: #26282b !important; border: #26282b !important; }'); //background of suggestions pop up

//profile page
addGlobalStyle('.JLbVX { background-color: #26282b !important; }'); //background to 'start capturing moments'
addGlobalStyle('.BvMHM.EzUlV { background-color: #26282b !important; }'); //profile settings background
addGlobalStyle('.BvMHM { border: 1px solid #999999 !important; }'); //border color of settings
addGlobalStyle('label { color: #84B3CD !important; }'); //text color
addGlobalStyle('h1.nsKSz { color: #637CDF !important; }'); //text color of header
addGlobalStyle('a.h-aRd.fuQUr { background-color: #353942 !important; }'); //background color when highlighted
addGlobalStyle('.JLJ-B, .p7vTm { color: #72ABFC !important; }'); //text in boxes
addGlobalStyle('.RO68f { background-color: #4B718E !important; }'); //boxes background
addGlobalStyle('.j_2Hd { border: #4B718E !important; color: #999999 !important; }'); //password color
addGlobalStyle('._lz6s { border-bottom: 1px solid #353942 !important; }'); //bottom border of header


