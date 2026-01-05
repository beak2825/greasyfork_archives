// ==UserScript==
// @name        ~ Hunter's userscripts ~
// @namespace   SecurityHub Project.
// @description Enhances your experience on HackForums.
// @include     *http://www.hackforums.net/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10464/~%20Hunter%27s%20userscripts%20~.user.js
// @updateURL https://update.greasyfork.org/scripts/10464/~%20Hunter%27s%20userscripts%20~.meta.js
// ==/UserScript==



// Hack Forums Matte Black Theme will allow you to convert your theme into a dark, sleek browsing experience!


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

var styles = [];

styles.push('body {background: #072948 url(http://imgur.com/dY3iaZ2.png) fixed !important; }');
//If you want to change the background image to your own, simply change the image link in the above line.

styles.push('.logo, div.largetext {display: none!important;}');
//If you want the logo to be added back, simply remove the above line.

styles.push('.thead {background: url(http://i.imgur.com/SRMEIpU.png) repeat scroll right top #111111 !important; height: 20px;}');
styles.push('.tcat {background: url(http://i.imgur.com/SRMEIpU.png) repeat scroll 0 0 !important; }');
styles.push('.tborder {background: #111111 !important; border: 1px solid #1D1D1D !important;}');
styles.push('input.bitButton {background-color: #1E1E1E !important; box-shadow: 0 1px 0 0 #505050 inset !important; }');
styles.push('a.bitButton {background-color: #1E1E1E !important; box-shadow: 0 1px 0 0 #505050 inset !important; }');
styles.push('#panel {border: 1px solid #111111 !important; }');
styles.push('.menu ul, .tfoot  {background: #111111 !important; }');
styles.push('.pm_alert {border: 1px solid #0AFF00 !important; }');
styles.push('.bottommenu {background: #111111; border: 1px solid #000000 !important;}');
styles.push('input.button {background-color: #1E1E1E !important; box-shadow: 0 1px 0 0 #505050 inset !important; }');
styles.push('a:hover, a:active, .menu ul a:hover, .menu ul a:active {color: #cccccc !important; }');
styles.push('.pagination_current {background: #383737 !important; }');
styles.push('.pagination a, .pagination a:hover {background-color: #181818 !important;}');
styles.push('.navButton:hover {border-top: 1px solid #919191 !important; background: #333333 !important;}');
styles.push('.tcat a:hover, .tcat a:active, .tfoot a:hover, .tfoot a:active, .navigation a:hover, .navigation a:active {color: #949494 !important; }');
styles.push('.pagination a:hover {color: #949494 !important; }');
styles.push('textarea:focus, input.textbox:focus, textarea, #message {border: 1px solid #000000 !important}');
styles.push('#menutabs.shadetabs li a {box-shadow: 0 1px 0 0 #505050 inset!important; }');
styles.push('.shadetabs li a {background-color: #181818 !important; }');
styles.push('.shadetabs li a.selected {background-color: #111111  !important; color: #7C7C7C !important;}');
styles.push('.shadetabs li a:hover {background-color: #111111  !important; color: #7C7C7C !important; }');
styles.push('.popup_menu, .popup_item {background-color: #1E1E1E !important;}');
styles.push('.prefix {color: #838383!important;}');
styles.push('span.button {background-color: #1E1E1E !important; box-shadow: 0 1px 0 0 #505050 inset !important; }');
styles.push('.button:hover {color: #7C7C7C !important; }');
styles.push('input.bitButton:hover {color: #7C7C7C!important; }');
styles.push('.thread_options a:link {color: #fff!important; }');
styles.push('.thread_options a:link:hover {color: #ccc!important; }');
styles.push('a.quick_jump {color: #838383!important; }');
styles.push('img.subforumicon.ajax_mark_read {display: none!important; }');
styles.push('div.smalltext ul li {list-style-image: url(http://i.imgur.com/6XZ4FxQ.gif)!important; margin-left: -4px!important; }');
styles.push('div.smalltext ul {margin-left: 23px!important; margin-top: 5px!important; }');
styles.push('.trow_reputation_positive {/* background: #333;!important; }');

styles.push('.subject_new, a.subject_new {font-weight: bold !important;');

addGlobalStyle(styles.join(''));



// Hack Forums Thread Deleter! Delete those cancerous threads you have no interest in reading!

var titles = document.querySelectorAll(".subject_new, .subject_old")
var keywords = []; //keywords should be in lowercase

for (var i = 0; i < titles.length; ++i) {
    for (var k = 0; k < keywords.length; ++k) {
        if (titles[i].innerHTML.toLowerCase().indexOf(keywords[k]) > -1){
            titles[i].parentNode.parentNode.parentNode.parentNode.style.display = 'none';
            break;
        }
    }
}



// Hack Forums Username Changer! Edit the name on some Users (Nice or Evil) haha!

var users = document.querySelectorAll("[class^='group']")
var usernames = []; 

for (var i = 0; i < users.length; ++i) {
    for (var u = 0; u < usernames.length; ++u) {
        if (users[i].innerHTML.toLowerCase().indexOf(usernames[u]) > -1){
            users[i].innerHTML = 'nignog';
            break;
        }
    }
}