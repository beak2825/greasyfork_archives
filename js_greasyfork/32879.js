//
// Written by Glenn Wiking
// Script Version: 0.1.1a
// Date of issue: 03/09/17
// Date of resolution: 03/09/17
//
// ==UserScript==
// @name        ShadeRoot xHamster
// @namespace   SRXH
// @description Eye-friendly magic in your browser for xHamster
// @include     *xhamster.*

// @version     0.1.1a
// @icon        https://i.imgur.com/kS5JJgG.png
// @downloadURL https://update.greasyfork.org/scripts/32879/ShadeRoot%20xHamster.user.js
// @updateURL https://update.greasyfork.org/scripts/32879/ShadeRoot%20xHamster.meta.js
// ==/UserScript==

function ShadeRootXH(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootXH (
	'#main {background: #110f0f !important;}'
	+
	'.boxC, #idxFeach .boxC, #vPromo .loader, .videoList, #footerBox {background: #241e1e !important; border: 1px solid #302b2b !important;}'
	+
	'#supportAds {display: none !important;}'
	+
	'a, .top {color: #EAD0D0 !important;}'
	+
	'.pager {background: #232020 !important; border-top: 1px solid #242222 !important;}'
	+
	'.pager span {color: #c3b9b9 !important; background: #4e4949 !important;}'
	+
	'.pager span, .pager a {border: 1px solid #292424 !important; box-shadow: 0 1px #181515 !important;}'
	+
	'.shadowDown, #buttons {border-bottom: 1px solid #2d2a2a !important;}'
	+
	'.shadowTop {border-bottom: 1px solid #2D2929 !important;}'
	+
	'.video u {color: #cebebe !important;}'
	+
	'.video u:hover {color: #b63636 !important;}'
	+
	'#footer ul {border-left: 1px solid black !important;}'
	+
	'.col-head span {border-bottom: 1px dashed #605555;}'
	+
	'.storeBox .storeMenu {background: #3b3535 !important; color: #edd !important; border: 1px solid #322E2E !important;}'
	+
	'.storeBox a, .description-text a, #newPlayerFeedback a {color: #d7bebe !important;}'
	+
	'.box .head, .box h2, .box > h1, .hAddition {background: #181414 !important; border: 1px solid #2a2424 !important; text-shadow: #261F1F 0 1px !important; color: #d4c5c5 !important;}'
	+
	'.box .head .btnsRight a.sel, .box .head .btnsBetween a.sel, .hAddition span a.sel, .box h1 .btnsRight a.sel, .box h1 .btnsBetween a.sel, .box h2 .btnsRight a.sel, .box h2 .btnsBetween a.sel {background: #4a1c1c !important; color: #dac4c4 !important;}'
	+
	'.hAddition span a, .box h1 .btnsRight a, .box h1 .btnsLeft a, .box h1 .btnsBetween a, .box h2 .btnsRight a, .box h2 .btnsLeft a, .box h2 .btnsBetween a, .box .head .btnsRight a, .box .head .btnsLeft a, .box .head .btnsBetween a, .dropList a {border: 1px solid #542020 !important; box-shadow: 0 1px #291F1F !important;}'
	+
	'#search .text, input {background: #504e4e !important; color: #f6e8e8 !important; border: 1px solid #605b5b !important;}'
	+
	'.selectEd, .submit, .select {background-color: #383232 !important;}'
	+
	'#search .select {color: #c6b6b6 !important; border: 1px solid #504a4a !important;}'
	+
	'#menuLogin a {text-shadow: #352121 0 1px !important; color: #dab6b6;}'
	+
	'.submit {filter: brightness(.8) !important; opacity: .9 !important;}'
	+
	'.menuLang a {background: #555 !important; border-top: 1px solid #382D2D !important;}'
	+
	'.langBox {background: #332b2b !important; border: 1px solid #3F3939 !important;}'
	+
	'#buttons {border-top: 1px solid #151313 !important;}'
	+
	'.col-head {text-shadow: 0 1px #241b1b !important; border-bottom: 1px dashed #6f6363 !important;}'
	+
	'.hAddition span a, .box h1 .btnsRight a, .box h1 .btnsLeft a, .box h1 .btnsBetween a, .box h2 .btnsRight a, .box h2 .btnsLeft a, .box h2 .btnsBetween a, .box .head .btnsRight a, .box .head .btnsLeft a, .box .head .btnsBetween a, .dropList a {background-image: none !important;}'
	+
	'#cRng a , .box h1 a.tool, .box h1 span.tool, .box h2 a.tool, .box h2 span.tool, .box .head a.tool, .box .head span.tool, #videoInfo a, .head a {border: 1px solid #4A1E1E !important; box-shadow: 0 1px #322 !important; background-image: none !important;}'
	+
	'#cRng div.list a , #cRng a span {background: #242020; color: #edd !important;}'
	+
	'.pager a {background: #383232 !important; color: #d5c9c9 !important;}'
	+
	'.pager a:hover {background: #716363 !important;}'
	+
	'.category-description {border: 1px solid #533434 !important; color: #d7c2c2 !important;}'
	+
	'#swectrqw {display: none !important;}'
	+
	'.menuLang a, .item span, #newPlayerFeedback, #footer .col-head span {color: #EDD !important;}'
	+
	'.menuLang a:hover {color: #c22424 !important;}'
	+
	'#copy {text-shadow: 0 1px #211818 !important;}'
	+
	'.tools {border-top: 1px solid #332E2E !important;}'
	+
	'.box .line, .box .lineS, .rate {border-top: 1px solid #332E2E !important; border-bottom: 1px solid #332E2E !important;}'
	+
	'#videoInfoBox {background-image: none !important;}'
	+
	'.tools a, .tools .rate {box-shadow: 0 1px #201b1b !important; color: #EDD !important;}'
	+
	'.tools a, .rate, .more a, .btnList a, .related-categories a {border: 1px solid #261d1d !important; background-color: #391414 !important; color: #EDD !important; background-image: none !important;}'
	+
	'.tab {background: #1e1919 !important;}'
	+
	'.content {border: 1px solid #383030 !important; background-color: #2f2727 !important;}'
	+
	'.tabs .head a.sel, .tabs .head a.sel:hover {background-color: #241d1d !important; color: #EDD !important;}'
	+
	'.head a {background-color: #201b1b !important;}'
	+
	'.col-head span {border-bottom: 1px dashed #c8c8c800 !important;}'
	+
	'.arrowL, .arrowR {opacity: .5 !important;}'
	+
	'.related-categories a {box-shadow: 0 1px #211616 !important;}'
	+
	'.storeBox a:hover {background: #271d1d !important;}'
	+
	'.letter-block {border-top: 1px solid #1b1414 !important;}'
	+
	'.alphabetical .letter-categories a {color: #a49f9f !important;}'
	+
	'.alphabetical .letter-categories a:hover {background: #3c2727 !important;}'
	+
	'.alphabetical .alphabet-block {background: none !important; border-bottom: 1px solid #423535 !important;}'
	+
	'.error {border: 1px solid #771c1c !important; background-color: #4e1313 !important; color: #e9c1c1 !important;}'
	+
	'body {background: #110f0f !important; color: #e6c6c6 !important;}'
	+
	'.error a, .digitsAd, .check a {color: #f5381f !important;}'
	+
	'.login .item {border: 1px solid #3b1c1c !important; background: #211919 !important;}'
	+
	'.login label {color: #e3d0d0 !important; text-shadow: 0 1px #3E2A2A !important;}'
	+
	'.login .item .content, .login .item .bottom {border-top: 1px solid #381C1C !important;}'
	+
	'.login .signup {color: #EDD; border: 1px solid #f22b10 !important; box-shadow: 0 1px #2A1414 !important;}'
	+
	'.inp {background-color: #3B2A2A !important; border: 1px solid #5C2222 !important; box-shadow: 0 1px #361313 !important;}'
	+
	'.login .signup, .loginBnt {background: #72291f !important; color: #EDD; border: 1px solid #9e200f !important;}'
	+
	'.itemR {border: 1px solid #451d1d !important; background: #352c2c !important;}'
	+
	'.digits div, .digits span {filter: brightness(.8) !important;}'
	+
	'.ad span {background: #555 !important; color: #efd5d5 !important; text-shadow: 0 1px #2A1212 !important;}'
	+
	'.loginBnt, div.post div.short_body {color: #efd5d5 !important; text-shadow: 0 1px #2A1212 !important;}'
	+
	'.itemBottom {border: 1px solid #4E1B1B !important;}'
	+
	'.login .item .top, .login .item .content {border-bottom: 1px solid #3e2b2b !important;}'
	+
	'.menuUser {background: #302e2e !important;}'
	+
	'.menuUser .sub {border: 1px solid #382c2c !important;}'
	+
	'.menuUser .sub a {background: #332b2b !important;}'
	+
	'.menuUser a {border-top: 1px solid #542e2e !important; text-shadow: 0 1px #382B2B !important;}'
	+
	'.menuUser a.l1:hover {background-color: #483535 !important;}'
	+
	'.profile .info {border-bottom: 1px solid #472323 !important;}'
	+
	'.profile .info, .profile .full {background: #241e1e !important;}'
	+
	'.box .boxC, .boxB {border: 1px solid #482d2d !important;}'
	+
	'.profileR .boxB {background: none !important;}'
	+
	'.info .thumb {border: 1px solid #5a3838 !important; filter: brightness(.8);}'
	+
	'.info .title {text-shadow: 0 1px #382121 !important; color: #e4c0c0 !important;}'
	+
	'#commentInput, textarea, .btnBig {border: 1px solid #661d1d !important; background-color: #391818 !important; color: #EDD !important;}'
	+
	'#commentPost, .btnBig {background-color: #3F2A2A !important; background-image: none !important; border: 1px solid #661B1B !important;}'
	+
	'.userControlButtons {background: #2d1919 !important;}'
	+
	'.userOuter {background: #2F1C1C !important; border: 1px solid #511e1e !important;}'
	+
	'.user {background: #4b1616 !important; border: 1px solid #541010 !important; box-shadow: 0 1px #392525 !important;}'
	+
	'.btns {filter: brightness(.8) !important;}'
	+
	'.btnSmall {background-color: #451c1c !important; background-image: none !important; box-shadow: 0 1px #2F1C1C !important; border: 1px solid #562222 !important;}'
	+
	'.userOuter .actZone b {color: #e9c4c4 !important;}'
	+
	'.module label {color: #E9CECE !important; text-shadow: 0 1px #2F1717 !important;}'
	+
	'.inp {color: #e3c6c6 !important; text-shadow: 0 1px #602C2C !important;}'
	+
	'.vDate {color: #e9caca !important; text-shadow: #3E1C1C 0 1px !important;}'
	+
	'.gallery .thumb {background: #361212 !important; border: 1px solid #591717 !important;}'
	+
	'#search .list a:hover {background: #2A1D1D !important; border-top: 1px solid #5a1e1e !important;}'
	+
	'.gListing tbody tr td div {border: 1px solid #5A1A1A !important;}'
	+
	'.rulesList {background: #2a2222 !important; border: 1px solid #351919 !important;}'
	+
	'.uLine {border-top: 1px solid #481c19 !important; border-bottom: 1px solid #270d0b !important;}'
	+
	'h4, .rulesList p {color: #EDD !important;}'
	+
	'.uploadRules {background: #29120f !important; border: 1px solid #561515 !important; color: #EDD !important;}'
	+
	'#upload {color: #F0D7D7 !important; text-shadow: 0 1px #361313 !important;}'
	+
	'div[style="float: right;"] div {border: 1px solid #561515 !important;}'
	+
	'.cont {text-shadow: 0 1px #3e2525 !important; color: #dbaaaa !important;}'
	+
	'.cont .h3, .cont li {color: #edd1d1 !important; text-shadow: 0 1px #361212 !important;}'
	+
	'.cont .sub2, .latin2 {color: #b0a1a1 !important; text-shadow: 0 1px #291414 !important;}'
	+
	'.cont .sub, p, .abus {color: #a53a3a !important; text-shadow: 0 1px #2c0d0d !important;}'
	+
	'.cont .sub3, .h4, .h3 {color: #928787 !important; text-shadow: 0 1px #271515 !important;}'
	+
	'.boxC .h4 {border-top: 1px solid #4D2727 !important;}'
	+
	'.boxCon, #logos {background: #261c1c !important; border: 1px solid #3E1717 !important;}'
	+
	'.boxCon #img, #logos img {opacity: .8; filter: brightness(.8) !important;}'
	+
	'.h3 {color: #b33838 !important;}'
	+
	'.now a {background: #621e1e !important;}'
	+
	'.abus {border-bottom: 1px dashed #6B2727 !important;}'
	+
	'.cont .q {text-shadow: 0 1px #241d1d !important; color: #e9d9d9 !important;}'
	+
	'#contact label {color: #e3c2c2 !important;}'
	+
	'.uvBody {background: #1a1212 !important; border-top: 1px solid #27100D !important; color: #E3C5C1 !important;}'
	+
	'.uvCustomBackground-background, .uvMasthead {background-color: #2c2323 !important;}'
	+
	'.uvMastheadLogo {height: 56px !important; filter: brightness(.8) !important; opacity: .8 !important;}'
	+
	'.uvMasthead {height: 100px;}'
	+
	'.uvField {background-color: #321F1D !important; border: 1px solid #501C14 !important;}'
	+
	'.uvIdeaVoteCount {background-color: #712619 !important;border: 1px solid #4D130C !important; color: #CAD3E6 !important;}'
	+
	'.uvIdeaVoteCount strong {color: #F5DED9 !important;}'
	+
	'.uvModule {background-color: #2F1511 !important; border: 1px solid #4D1E16 !important;}'
	+
	'.uvModule-feedback .uvStyle-count, .uvModule-mainSidebar .uvStyle-count {color: #efd7d2 !important; background: #7a1515;}'
	+
	'.uvTab {background: #532C22 !important;}'
	+
	'#datingFilter .boxB {background: #2c1c1c !important;}'
	+
	'.xForm table td, .xForm table th {border-bottom: 1px solid #573232 !important;}'
	+
	'.xForm table th {color: #edd7d7 !important;}'
	+
	'.xForm select, input[type="text"] {background-color: #4e1c1c !important; border: 1px solid #6c1a1a !important; box-shadow: 0 1px #3B1B1B !important; color: #EDD !important;}'
	+
	'.bigThumbVerified {background-color: #452a28 !important;}'
	+
	'.bigThumb {border: 1px solid #751c1c !important;}'
	+
	'.bigThumb .avatar {border-bottom: 1px solid #662727 !important; opacity: .9 !important;}'
	+
	'.bigThumbVerified .sendMsg {background: #2d1513 !important;}'
	+
	'#upload .vIntroSample a {background-color: #531f1f !important; border: 1px solid #811a1a !important;}'
	+
	'.editHeader {background: #2a1d1d !important; color: #e9d4cb !important;}'
	+
	'.editItem, .editHeader {border-bottom: 1px solid #5c1818 !important; border-top: 1px solid #5f1616 !important; text-shadow: 0 1px #2F0D0D !important;}'
	+
	'#galleryInfoBox {background: #1a1616 !important; border-top: 1px solid #3B1414 !important;}'
	+
	'.btnList a {box-shadow: 0 1px #1D0B0B !important;}'
	+
	'#search .list a {background: #2d1f1f !important; border-top: 1px solid #661a1a !important;}'
	+
	'.list a.sel {background: #571B1B !important;}'
	+
	'#search .list {border: 1px solid #592828 !important;}'
	+
	'.spacer {border-bottom: 1px solid #442828 !important;}'
);