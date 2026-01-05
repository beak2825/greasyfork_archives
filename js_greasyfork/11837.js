//
// Written by Glenn Wiking
// Script Version: 1.0.2
// Date of issue: 06/12/14
// Date of resolution: 06/12/14
//
// ==UserScript==
// @name        ShadeRoot 4Chan
// @namespace   YT
// @description Eye-friendly magic in your browser for 4Chan
// @version     1.0.2
// @icon        https://i.imgur.com/8vq9zZn.png

// @include        http://*.4chan.*
// @include        https://*.4chan.*
// @include        http://*.4cdn.org*
// @include        https://*.4cdn.org*

// @downloadURL https://update.greasyfork.org/scripts/11837/ShadeRoot%204Chan.user.js
// @updateURL https://update.greasyfork.org/scripts/11837/ShadeRoot%204Chan.meta.js
// ==/UserScript==

function ShadeRoot4Chan(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRoot4Chan(
  'html, iframe html, body {background: #112 !important; border-top: none;}'
  +
  '.top-box {background: none repeat scroll 0% 0% rgba(17, 29, 81, 1) !important;}'
  +
  '.box-outer {border: 1px solid #113 !important;}'
  +
  '#logo {opacity: .42 !important;}'
  +
  '.boxbar, .boxcontent {background-color: rgba(29, 31, 47, 1) !important;}'
  +
  '.boxbar h2, .shown a, #copyright {color: rgba(24, 93, 213, 1) !important;}'
  +
  'video, .fileThumb img, .boxcontent img {opacity: .88;}'
  +
  '.reply {background-color: rgba(29, 31, 47, 1) !important; border-color: -moz-use-text-color rgba(15, 27, 45, 1) rgba(22, 40, 66, 1) -moz-use-text-color !important;}'
  +
  '.dateTime {color: rgba(60, 93, 122, 1) !important;}'
  +
  'div.postInfo span.postNum a, div.postInfo span.subject {color: rgba(38, 78, 123, 1) !important;}'
  +
  'a, a:visited, .boardTitle, .boardSubtitle {color: rgba(81, 105, 161, 1) !important;}'
  +
  '.quotelink {color: rgba(24, 102, 191, 1) !important;}'
  +
  '.yotsuba_b_new .backlink a {color: #117743 !important;}'
  +
  '#boardNavDesktop a {color: rgba(62, 101, 195, 1) !important;}'
  +
  'hr {border-color: rgba(33, 41, 68, 1) -moz-use-text-color -moz-use-text-color !important;}'
  +
  'blockquote, label, .fileText, .navLinks, .desktop, .center div, .boxcontent p, .boxcontent ul li {color: rgba(137, 140, 143, 1) !important;}'
  +
  '#announce, .top-box, .right-box, .left-box, #ft li.current, #ft li.fill {background: none repeat scroll 0% 0% #1D1F2F !important;}'
  +
  '#ft li {background: none repeat scroll 0% 0% rgba(28, 32, 36, 1);}'
  +
  '#ft li a, a.replylink:not(:hover) {color: rgba(135, 144, 153, 1) !important;}'
  +
  '.summary span a, .replylink, .replylink {color: 1C509E !important;}'
  +
  '#options-container a#option-button {color: #185DD5;}'
  +
  '.replyContainer .post {color: rgba(42, 48, 51, 1) !important;}'
  +
  '.redtxt {color: rgba(55, 80, 141, 1) !important;}'
  +
  '.quotelink {color: #117743 !important;}'
  +
  '.reply:target, .reply.highlight {background: none repeat scroll 0% 0% rgba(23, 42, 60, 1) !important; border-color: -moz-use-text-color rgba(33, 48, 92, 1) rgba(13, 32, 86, 1) -moz-use-text-color !important;}'
  +
  '.pagelist {background: none repeat scroll 0% 0% #112 !important; border-color: -moz-use-text-color #111122 #111122 -moz-use-text-color !important;}'
  +
  '.quoteLink, .quotelink, .deadlink {color: rgba(28, 80, 158, 1) !important;}'
  +
  '.closed, .tu-error, .meta {color: rgba(17, 83, 170, 1) !important;}'
  +
  '.teaser {color: rgba(45, 104, 147, 1) !important;}'
  +
  '.pages {font-size: 15px;}'
  +
  '.pages strong {font-weight: bold; font-size: 20px !important; font-family: Georgia;}'
  +
  '.pagelist > .prev {padding: 4px; font-weight: bold;}'
  +
  '.pages, .prev {color: rgba(137, 140, 143, 0.42) !important;}'
  +
  '.boardList a {font-size: 1.3em;}'
  +
  '.boardList a:last-child {font-weight: bold;}'
  +
  '.boardList a:nth-child(2) {font-weight: bold;}'
  +
  '.boardList a:nth-child(15) {font-weight: bold;}'
  +
  '.center, #bannerCnt {border: 1px solid #212944 !important;}'
  +
  '.yui-panel {background-color: rgba(24, 40, 57, 1);}'
  +
  '.yui-panel .bd p, .yui-panel .dp ol, .bd li {color: rgba(61, 130, 189, 1);}'
  +
  '#disclaimer-dialog .hd {background: none repeat scroll 0% 0% rgba(11, 102, 170, 1);}'
  +
  '#disclaimer-dialog {border: 1px solid rgba(30, 86, 170, 1) !important;}'
  +
  '.mask {background-color: rgba(13, 21, 33, 1);}'
  +
  '.ft .button-group button {background-color: rgba(37, 91, 161, 1); color: rgba(111, 188, 218, 1);}'
  +
  '.ft .button-group button {border-color: rgba(9, 66, 165, 1) rgba(14, 63, 128, 1); border-radius: 5px;}'
  +
  '.newPostsMarker:not(#quote-preview) {box-shadow: 0px 3px rgba(19, 84, 198, 1);}'
  +
  '.ctrl-wrap, .btn-wrap {color: rgba(26, 70, 146, 1) !important;}'
  +
  'a, #absbot a, .button, #filters-ctrl {color: rgba(19, 81, 217, 1) !important;}'
  +
  '#togglePostFormLink a, .boardList a, #footer-links a, a.replylink:not(:hover), div#absbot a:not(:hover) {color: rgba(33, 80, 176, 1) !important;}'
  +
  '#absbot, .absBotDisclaimer {color: rgba(0, 136, 83, 1) !important;}'
  +
  '#entries th {border-left: 1px solid rgba(15, 50, 113, 1) !important; background-color: rgba(12, 69, 134, 1) !important; color: rgba(35, 129, 222, 1) !important;}'
  +
  '#entries tr {border-bottom: 1px solid rgba(18, 59, 120, 1) !important;}'
  +
  '#entries td {border-left: 1px solid rgba(18, 59, 120, 1) !important; background: rgba(9, 31, 56, 1) !important; color: rgba(32, 96, 168, 1) !important;}'
  +
  'footer {color: rgba(13, 72, 149, 1) !important;}'
  +
  'footer li {background-color: rgba(6, 26, 68, 1) !important;}'
  +
  '.boxcontent hr, .left-box hr, hr {color: rgba(0, 59, 136, 1) !important; background-color: rgba(11, 63, 155, 1) !important;}'
  +
  '#doc .boxcontent hr, .search-label-bottom hr {display: none;}'
  +
  '.boxcontent {color: rgba(29, 101, 228, 1) !important;}'
  +
  '.boxcontent dt {color: rgba(92, 146, 255, 1) !important;}'
  +
  '.stripe-button-el:disabled span, .stripe-button-el.disabled span {color: rgba(127, 172, 231, 1) !important; background: none repeat scroll 0% 0% rgba(20, 65, 144, 1) !important; text-shadow: 0px 1px 0px rgba(25, 77, 137, 0.5) !important;}'
  +
  '#ft, #ft li.current, #ft li.fill {color: rgba(24, 63, 159, 1) !important;}'
  +
  'input[type="text"]:focus, input[type="password"]:focus, input:focus:not([type]), textarea:focus {border: 1px solid rgba(43, 108, 192, 1) !important;}'
  +
  '.form-row input[type="text"] {background-color: rgba(21, 52, 86, 1) !important; border: 1px solid rgba(48, 98, 219, 1) !important;}'
  +
  '.content h3 {background: none repeat scroll 0% 0% rgba(16, 63, 146, 1) !important; border: 1px solid rgba(22, 73, 195, 1) !important; color: rgba(92, 143, 246, 1) !important;}'
  +
  '.content, tbody {color: rgba(59, 115, 200, 1) !important;}'
  +
  'p strong {color: #185DBA !important;}'
  // // // // // BLOG
  +
  '#masthead {background-color: rgba(6, 45, 104, 1) !important; color: rgba(77, 111, 209, 1) !important; border-top: .5rem solid rgba(24, 71, 167, 1) !important;}'
  +
  '#masthead #logo a {background: none repeat scroll 0% 0% rgba(66, 155, 211, 1) !important;}'
  +
  '#content article.post .post-inner {background: #062D68 !important;}'
  +
  '.post-inner p a {border-bottom: 1px solid #5169A1 !important;}'
  +
  '#content article.post .post-meta {border-top: 1px solid rgba(8, 64, 162, 1) !important; background: #062D68 !important;}'
  +
  '.post-inner blockquote {border-left: 1px solid #185DBA !important;}'
  +
  'footer .tags li {background-color: #062D68 !important;}'
  +
  '#sidebar .widget {border-bottom: 1px solid #0840A2 !important;}'
  +
  '#sidebar {background-color: #062D68 !important;}'
  +
  '#sidebar h1, #sidebar h2, #sidebar h3, #sidebar h4, #sidebar h5, #sidebar h6, .date a, .share a, .note-count a {color: rgba(17, 96, 215, 1) !important;}'
  +
  '#sidebar #search-input {background-color: rgba(10, 62, 141, 1) !important; color: rgba(128, 191, 252, 1) !important;}'
  +
  '#sidebar #twitter .button.follow {background: none repeat scroll 0% 0% rgba(27, 104, 219, 1) !important;}'
  +
  '#sidebar #twitter .button.follow:hover {background: none repeat scroll 0% 0% rgba(52, 165, 237, 1) !important; color: rgba(198, 220, 242, 1) !important;}'
  +
  '.post-inner p img {opacity: .8 !important;}'
  +
  '#content article.text h1 a {color: rgba(46, 130, 225, 1) !important;}'
  +
  '.boxcontent hr, .left-box hr, hr {color: rgba(0, 59, 136, 0) !important; background-color: rgba(11, 63, 155, 0) !important;}'
  +
  '.yotsuba_new .panelHeader {border-bottom: 1px solid rgba(42, 91, 177, 1) !important;}'
  +
  '.settings-expand, .pointer {color: rgba(46, 139, 230, 1) !important;}'
  +
  'table.postForm > tbody > tr > td:first-child {background-color: rgba(25, 52, 108, 1) !important; color: rgba(56, 128, 189, 1) !important; border: 1px solid rgba(12, 41, 93, 1) !important;}'
  +
  '.rc-anchor-light {background: none repeat scroll 0% 0% rgba(17, 103, 186, 1) !important; border: 1px solid rgba(26, 112, 186, 1) !important;}'
  +
  'table.postForm > tbody > tr > td > input[type="text"], textarea[name="com"] {background-color: rgba(36, 47, 60, 1) !important; color: #BBC !important; border: 1px solid rgba(19, 31, 54, 1) !important;}'
  +
  'div.post div.postInfoM {border-bottom: 1px solid rgba(25, 79, 132, 1) !important; background-color: rgba(31, 64, 129, 1) !important;}'
  +
  '.mobile div.reply {border: 1px solid rgba(11, 72, 140, 1) !important;}'
  +
  '.dateTime {color: rgba(60, 133, 197, 1) !important;}'
  +
  '.postLink .button, .mobile .button {background-color: rgba(24, 99, 183, 1) !important; border: 1px solid rgba(7, 62, 98, 1) !important; background-image: none !important; color: rgba(215, 222, 230, 1) !important;}'
  +
  '.backlink.mobile {background-color: rgba(14, 39, 72, 1) !important; border-top: 1px solid rgba(11, 57, 96, 1) !important;}'
  +
  'div.opContainer {background-color: rgba(9, 20, 36, 1) !important; border: 1px solid rgba(13, 37, 68, 1) !important;}'
  +
  'div.postLink {background-color: rgba(38, 86, 170, 1) !important; border-top: 1px solid rgba(14, 83, 161, 1) !important;}'
  +
  'div#boardNavMobile {background-color: rgba(81, 146, 219, 1) !important; border-bottom: 2px solid rgba(44, 102, 146, 1) !important;}'
  +
  'div.pagelist div.cataloglink {border-left: 1px solid rgba(0, 56, 140, 1) !important;}'
  // // // // // OVERRIDE
  +
  'div.reply {border: 1px solid rgba(14, 34, 56, 1) !important;}'
);