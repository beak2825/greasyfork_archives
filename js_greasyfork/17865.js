// ==UserScript==
// @name        Chaturbate Pink
// @namespace   http://userscripts.org/users/scriptfriend
// @homepage    https://sleazyfork.org/en/scripts/17865-chaturbate-pink
// @description Remove Ads From Chaturbate And Choose Your Own Color Theme
// @icon        http://s2.postimg.org/3x3eg0jet/pink.jpg
// @include     http://chaturbate.com/*
// @include     http://*chaturbate.com/*
// @include     https://chaturbate.com/*
// @include     https://*.chaturbate.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.js
// @version     4.9.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17865/Chaturbate%20Pink.user.js
// @updateURL https://update.greasyfork.org/scripts/17865/Chaturbate%20Pink.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

if (window.location.protocol != 'https:') {
    window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }

document.cookie = 'agreeterms=1; expires=Thu, 31 Dec 2099 12:00:00 GMT; path=/';
document.cookie = 'np3=1; expires=Thu, 31 Dec 2099 12:00:00 GMT; path=/';

var vnumber = '4.9.0';
var version = 'Chaturbate Pink - Version ' + vnumber;

var vernum = document.createElement('INS');
var txt = document.createTextNode(version);
    vernum.setAttribute('id', 'verText');
    vernum.setAttribute('style', 'position:absolute; top:36px; left:300px; color:#181818; font-family:arial; font-size:0.875em; font-weight:normal; text-decoration:none; z-index:1000;');
    vernum.appendChild(txt);
    document.body.appendChild(vernum);

var verCheck = document.createElement('INS');
var verTxt = document.createTextNode('');
    verCheck.setAttribute('id', 'checkVer');
    verCheck.setAttribute('style', 'display:none;');
    verCheck.appendChild(verTxt);
    document.body.appendChild(verCheck);

setTimeout(function() {
    var getVer = document.getElementById('checkVer').innerHTML;
    var j = JSON.parse(getVer);
    var jVer = j.version;
    if (jVer != vnumber && jVer != '') {
    var inform = document.getElementById('verText');
    inform.innerHTML = 'You are using Chaturbate Pink ' + vnumber + '<br /><a style="color:#ff0000!important;" href="https://greasyfork.org/scripts/3663-chaturbate-pink" target="_blank">Click Here</a> to update to version ' + jVer;
    }
    }, 5000);

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) != -1) {
    return c.substring(name.length, c.length);
    }}
    return "";
    }

var d = new Date();
var checkd = d.toDateString();

var checkVerDate = getCookie('verdate');
    if ((checkVerDate != checkd)) {
    $('#checkVer').load('https://greasyfork.org/en/scripts/3663-chaturbate-pink.json');
    document.cookie = 'verdate=' + checkd + '; expires=Thu, 31 Dec 2099 12:00:00 GMT; path=/';
    }

var color1 = getCookie('cb-color1');
var color2 = getCookie('cb-color2');
    if ((color1 == "") || (color2 == "")) {
    var color = ["ffe3cb", "520000"];
    }
    else {
    var color = [color1, color2];
    }

var chkbx = getCookie('cb-chkbx');
    if (chkbx == 'locked') {
    var varCheck = 'true';
    var posi = 'fixed';
    }
    else {
    var varCheck = 'false';
    var posi = 'absolute';
    }

var chkbx2 = getCookie('cb-chkbx-2');
    if (chkbx2 == 'locked') {
    var varCheck2 = 'true';
    jQuery('document').ready(function($) {
    var nav = $('.nav-bar');
    $(window).scroll(function() {
    if ($(this).scrollTop() > 85) {
    nav.addClass('fixnav');
    }
    else {
    nav.removeClass('fixnav');
    }
    });
    });
    }
    else {
    jQuery('document').ready(function($) {
    var nav = $('.nav-bar');
    $(window).scroll(function() {
    if ($(this).scrollTop() < 0) {
    nav.addClass('fixnav');
    }
    else {
    nav.removeClass('fixnav');
    }
    });
    });
    }

var edit = document.createElement('A');
var editTxt = document.createTextNode('Settings');
    edit.setAttribute('id', 'editBut');
    edit.setAttribute('style', 'position:absolute; top:18px; left:298px; font-family:arial; font-size:1.125em; font-weight:bold; text-decoration:none; z-index:1000;');
    edit.setAttribute('href', '#');
    edit.onclick = function() {
    var makeForm = document.createElement('FORM');
    makeForm.setAttribute('id', 'colorForm');
    makeForm.setAttribute('style', 'position:absolute; top:0; left:150px; width:278px; height:250px; background-color:#eeeeee; border:1px solid #cbcbcb; border-radius:6px; z-index:1001;');
    document.body.appendChild(makeForm);
    var pick1 = document.createElement('INS');
    var pickLight = document.createTextNode('Choose a light hexadecimal color.');
    pick1.setAttribute('style', 'position:absolute; top:10px; left:170px; text-decoration:none; z-index:1002;');
    pick1.appendChild(pickLight);
    document.body.appendChild(pick1);
    var light = document.createElement('INPUT');
    light.setAttribute('id', 'lightColor');
    light.setAttribute('type', 'text');
    light.setAttribute('value', color[0]);
    light.setAttribute('style', 'position:absolute; top:30px; left:20px; text-decoration:none; z-index:1002;');
    document.getElementById('colorForm').appendChild(light);
    var pick2 = document.createElement('INS');
    var pickDark = document.createTextNode('Choose a dark hexadecimal color.');
    pick2.setAttribute('style', 'position:absolute; top:70px; left:170px; text-decoration:none; z-index:1002;');
    pick2.appendChild(pickDark);
    document.body.appendChild(pick2);
    var dark = document.createElement('INPUT');
    dark.setAttribute('id', 'darkColor');
    dark.setAttribute('type', 'text');
    dark.setAttribute('value', color[1]);
    dark.setAttribute('style', 'position:absolute; top:90px; left:20px; text-decoration:none; z-index:1002;');
    document.getElementById('colorForm').appendChild(dark);
    var scroll = document.createElement('INS');
    var scrollCheck = document.createTextNode('Lock room image in place.');
    scroll.setAttribute('style', 'position:absolute; top:130px; left:170px; text-decoration:none; z-index:1002;');
    scroll.appendChild(scrollCheck);
    document.body.appendChild(scroll);
    var chbox = document.createElement('INPUT');
    if (varCheck == 'true') {
    chbox.setAttribute('id', 'checkBox');
    chbox.setAttribute('type', 'checkbox');
    chbox.setAttribute('checked', 'true');
    chbox.setAttribute('style', 'position:absolute; top:150px; left:20px; text-decoration:none; z-index:1002;');
    }
    else {
    chbox.setAttribute('id', 'checkBox');
    chbox.setAttribute('type', 'checkbox');
    chbox.setAttribute('style', 'position:absolute; top:150px; left:20px; text-decoration:none; z-index:1002;');
    }
    document.getElementById('colorForm').appendChild(chbox);
    var scroll2 = document.createElement('INS');
    var scrollCheck2 = document.createTextNode('Lock navigation bar in place.');
    scroll2.setAttribute('style', 'position:absolute; top:180px; left:170px; text-decoration:none; z-index:1002;');
    scroll2.appendChild(scrollCheck2);
    document.body.appendChild(scroll2);
    var chbox2 = document.createElement('INPUT');
    if (varCheck2 == 'true') {
    chbox2.setAttribute('id', 'checkBox2');
    chbox2.setAttribute('type', 'checkbox');
    chbox2.setAttribute('checked', 'true');
    chbox2.setAttribute('style', 'position:absolute; top:200px; left:20px; text-decoration:none; z-index:1002;');
    }
    else {
    chbox2.setAttribute('id', 'checkBox2');
    chbox2.setAttribute('type', 'checkbox');
    chbox2.setAttribute('style', 'position:absolute; top:200px; left:20px; text-decoration:none; z-index:1002;');
    }
    document.getElementById('colorForm').appendChild(chbox2);
    var save = document.createElement('A');
    var saveTxt = document.createTextNode('Save');
    save.setAttribute('id', 'saveBut');
    save.setAttribute('style', 'position:absolute; top:210px; left:364px; background-color:#ffffff; border:1px solid #181818; border-radius:4px; padding:2px 6px; z-index:1002;');
    save.setAttribute('href', '#');
    save.onclick = function() {
    var color1 = document.getElementById('lightColor').value;
    var color2 = document.getElementById('darkColor').value;
    var varCheck = document.getElementById('checkBox').checked;
    if (varCheck == true) {
    document.cookie = 'cb-chkbx=locked; expires=Thu, 31 Dec 2099 12:00:00 GMT; path=/';
    }
    else {
    document.cookie = 'cb-chkbx=unlocked; expires=Thu, 31 Dec 2099 12:00:00 GMT; path=/';
    }
    var varCheck2 = document.getElementById('checkBox2').checked;
    if (varCheck2 == true) {
    document.cookie = 'cb-chkbx-2=locked; expires=Thu, 31 Dec 2099 12:00:00 GMT; path=/';
    }
    else {
    document.cookie = 'cb-chkbx-2=unlocked; expires=Thu, 31 Dec 2099 12:00:00 GMT; path=/';
    }
    document.cookie = 'cb-color1=' + color1 + '; expires=Thu, 31 Dec 2099 12:00:00 GMT; path=/';
    document.cookie = 'cb-color2=' + color2 + '; expires=Thu, 31 Dec 2099 12:00:00 GMT; path=/';
    location.reload();
    }
    save.appendChild(saveTxt);
    document.body.appendChild(save);
    }
    edit.appendChild(editTxt);
    document.body.appendChild(edit);

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
    }

addGlobalStyle('#header .ad {display:none!important;}' +
'#main .ad {display:none!important;}' +
'#botright {display:none!important;}' +
'#main .banner {display:none!important;}' +
'#close_entrance_terms {background-color:#' + color[0] + '!important;}' +
'#close_broadcast_terms {background-color:#' + color[0] + '!important;}' +
'a {color:#' + color[1] + '!important; outline-style:none!important; text-decoration:none!important;}' +
'a:hover {color:#777777!important;}' +
'body {background-color:#' + color[0] + '!important;}' +
'#header {background-image:none!important; background-color:#' + color[0] + '!important;}' +
'#header .section {background-color:#' + color[0] + '!important;}' +
'#main .top-section {background-color:#' + color[0] + '!important; background-image:none!important; border-bottom:1px solid #888888!important;}' +
'#main .content {background-color:#' + color[0] + '!important;}' +
'#header .nav-bar {background-color:#' + color[1] + '!important; border-color:#cbcbcb!important;}' +
'#nav {font-family:verdana!important; padding-bottom:5px!important;}' +
'#nav li a {color:#eeeeee!important;}' +
'#nav li a:hover {color:#' + color[0] + '!important;}' +
'#header .creat {font-family:\'trebuchet ms\'!important; color:#cbcbcb!important; background-color:#' + color[1] + '!important; background-image:none!important; padding-left:29px!important; padding-bottom:5px!important; border-radius:0!important;}' +
'#main .top-section .sub-nav a {font-family:\'trebuchet ms\'!important; color:#454545!important; border-color:#888888!important; background-color:#eeeeee!important;}' +
'#main .top-section .sub-nav a:hover {color:#' + color[1] + '!important; background-color:#ffffff!important;}' +
'#main .top-section .sub-nav .active a {color:#' + color[1] + '!important; background-color:#ffffff!important;}' +
'#main .top-section .actions li a {padding-left:10px!important; background-color:#' + color[0] + '!important; background-image:none!important; border-color:#888888!important;}' +
'strong {color:#131313!important;}' +
'h1, h2, h3 {color:#' + color[1] + '!important;}' +
'#main .content .endless_page_template {width:100%!important;}' +
'.thumbnail_label_c {background-color:#181818!important;}' +
'.thumbnail_label_c_hd {background-color:#' + color[1] + '!important;}' +
'.thumbnail_label_exhibitionist {background-color:#ff0000!important;}' +
'.thumbnail_label_c_new {background-color:#545454!important;}' +
'#defchat .section .chat-holder .chat-box .users-list .text .color-p {color:#be6aff!important;}' +
'#defchat .section .chat-holder .chat-box .users-list .text .color-l {color:#804baa!important;}' +
'#defchat .section .chat-holder .chat-box .users-list .text .color-o {color:#dc5500!important;}' +
'#defchat .section .chat-holder .chat-box .users-list .text .color-m {color:#dc0000!important;}' +
'#defchat .section .chat-holder .chat-box .users-list .text .color-f {color:#00cf00!important;}' +
'#defchat .section .chat-holder .chat-box .users-list .text .color-tr {color:#000099!important;}' +
'#defchat .section .chat-holder .chat-box .users-list .text .color-t {color:#6699aa!important;}' +
'#defchat .section .chat-holder .chat-box .users-list .text .color-g {color:#666666!important;}' +
'#defchat .section .chat-holder .chat-box .chat-list .roommessagelabel {color:#' + color[1] + '!important;}' +
'#main .content .c-1 {margin:0 24px 0 32px;}' +
'.paging li a {background-color:#eeeeee!important; border-color:#' + color[1] + '!important; background-image:none!important;}' +
'.paging li a:hover {background-color:#ffffff!important;}' +
'.paging .prev {border-radius:30px 0 0 30px!important;}' +
'.paging .next {border-radius:0 30px 30px 0!important;}' +
'.paging .endless_page_link {color:#181818!important;}' +
'.paging .active .endless_page_link {color:#' + color[1] + '!important; background-color:#ffffff!important;}' +
'#main .content .featured_blog_posts .blog_post .title_shell {background-image:none!important;}' +
'#main .content .featured_blog_posts .blog_post .title_shell .title {background-color:transparent!important;}' +
'.footer-holder {background-color:#eeeeee!important; background-image:none!important; border-top:2px solid #cbcbcb!important;}' +
'#jscontext .jscontextBtn {color:#' + color[1] + '!important;}' +
'#jscontext .jscontextBtn:hover {color:#eeeeee!important;}' +
'#defchat .section .chat-holder .chat-box .chat-form .row .button_send {background-color:#888888!important; background-image:none!important; border-radius:4px 4px 4px 4px!important;}' +
'#defchat .section .chat-holder .chat-box .chat-form .row .button_send a {color:#eeeeee!important; background-image:none!important; text-shadow:none!important;}' +
'#defchat .section .chat-holder .chat-box .chat-form .row .button_send a:hover {color:#ffffff!important;}' +
'#defchat .info-user .headline .socials .button_share {background-color:#eeeeee!important; background-image:none!important; border-radius:4px 4px 4px 4px!important;}' +
'#defchat .info-user .headline .socials .button_share a {background-image:none!important; text-shadow:none!important;}' +
'#defchat .info-user .headline .socials .button_follow {background-color:#eeeeee!important; background-image:none!important; border-radius:4px 4px 4px 4px!important;}' +
'#defchat .info-user .headline .socials .button_follow a {background-image:none!important; text-shadow:none!important;}' +
'#defchat .info-user .headline .socials .button_unfollow {background-color:#eeeeee!important; background-image:none!important; border-radius:4px 4px 4px 4px!important;}' +
'#defchat .info-user .headline .socials .button_unfollow a {background-image:none!important; text-shadow:none!important;}' +
'#defchat .section .video-box .tip_shell .green_button_tip {background-color:#777777!important; background-image:none!important; border-radius:4px 4px 4px 4px!important;}' +
'#defchat .section .video-box .tip_shell .green_button_tip .tip_button {color:#eeeeee!important; background-image:none!important; text-shadow:none!important;}' +
'#defchat .section .video-box .tip_shell .green_button_tip .tip_button:hover {color:#ffffff!important;}' +
'#defchat .offline_tipping .green_button_tip_offline {background-color:#777777!important; background-image:none!important; border-radius:4px 4px 4px 4px!important;}' +
'#defchat .offline_tipping .green_button_tip_offline .tip_button {color:#eeeeee!important; background-image:none!important; text-shadow:none!important;}' +
'#defchat .offline_tipping .green_button_tip_offline .tip_button:hover {color:#ffffff!important;}' +
'#defchat .section .video-box .tip_shell .goal_display .goal_display_table .dark_blue {background-color:#' + color[0] + '!important;}' +
'.follow_tooltip, .share_tooltip, #rate_tooltip, #rated_tooltip, #rate_dim_tooltip, #broadcaster_rating_tooltip {background-color:#eeeeee!important; border-color:#777777!important;}' +
'.follow_tooltip img, .share_tooltip img, #rate_tooltip img, #rated_tooltip img, #rate_dim_tooltip img, #broadcaster_rating_tooltip img {display:none!important;}' +
'#tabs_content_container dl dt {color:#' + color[1] + '!important;}' +
'#tabs_content_container .pics-description .photo_list .user_upload .thumbnail_label_tokens {background-color:#181818!important;}' +
'#body_border .user_uploads .user_upload .thumbnail_label_tokens {background-color:#181818!important;}' +
'#filter_search_form .button {background-color:#' + color[1] + '!important; background-image:none!important; padding-left:28px!important;}' +
'#filter_search_form .button:hover {text-decoration:none!important;}' +
'#defchat {width:100%!important;}' + 
'.section {width:100%!important;}' +
'#login-box {border-color:#777777!important; z-index:2001!important;}' +
'#login-box .pagename {position:relative!important; top:-4px!important; left:-2px!important; font-family:\'trebuchet ms\'!important; color:#' + color[1] + '!important;}' +
'#login-box .button {padding-left:14px!important; color:#454545!important; background-color:#cbcbcb!important; background-image:none!important;}' +
'#login-box .button:hover {color:#eeeeee!important; background-color:#888888!important; text-decoration:none!important;}' +
'#user_information .top {background-color:#' + color[1] + '!important; border-radius:2px 2px 0 0!important; padding:5px 3px 4px 5px!important;}' +
'#user_information {position:absolute!important; top:-9px!important; right:0!important;}' +
'#user_information .top a {color:#eeeeee!important;}' +
'#user_information .top a:hover {color:#cbcbcb!important;}' +
'#user_information .tokencountlink {font-size:11px!important;}' +
'#user_information .bottom {border-color:#' + color[1] + '!important;}' +
'#apps_and_bots_table tr legend {color:#' + color[1] + '!important;}' +
'#leaderboard .number {color:#181818!important;}' +
'#leaderboard .position_1 {color:#' + color[1] + '!important;}' +
'#tag_table {border-color:#' + color[1] + '!important;}' +
'#tag_table .headers {background-color:#' + color[1] + '!important;}' +
'#tag_table .tag_row:nth-child(2n+1) {background-color:#' + color[0] + '!important;}' +
'#broadcaster_settings legend {color:#' + color[1] + '!important;}' +
'.button {color:#' + color[1] + '!important; text-decoration:none!important; background-color:#eeeeee!important; background-image:none!important; border-radius:4px 4px 4px 4px!important; padding:0 15px 2px 15px!important;}' +
'.button:hover {color:#131313!important;}' +
'#filter_search_form p .button {color:#cbcbcb!important; padding:2px 6px!important;}' +
'#filter_search_form p .button:hover {color:#e6e6e6!important;}' +
'#suggest_app img {display:none!important;}' +
'a.user_upload_preview {color:#181818!important;}' +
'a.user_upload_preview:hover {color:#777777!important;}' +
'.overlay_popup .formborder {border:2px solid #' + color[1] + '!important; border-radius:4px!important;}' +
'.overlay_popup .divider {display:none!important;}' +
'.overlay_popup .title {color:#' + color[1] + '!important;}' +
'.app_launch a {background-color:#cbcbcb!important;}' +
'.proposal_votes {background-color:#cbcbcb!important;}' +
'.related {color:#' + color[1] + '!important;}' +
'.document, .related {background-color:#' + color[0] + '!important;}' +
'.sphinxsidebar ul, .sphinxsidebar h4, .sphinxsidebar p, .footer {color:#777777!important;}' +
'.datatable, .datatable th {background-color:#' + color[1] + '!important;}' +
'.code {color:#' + color[1] + '!important;}' +
'.fixnav {position:fixed!important; left:0!important; top:0!important; width:100%!important; height:auto!important; z-index:999!important;}' +
'#login-overlay {z-index:2000!important;}' +
'#overlay {z-index:1001!important;}' +
'#entrance_terms, #broadcast_terms {z-index:1002!important;}' +
'.tip_popup img {display:none!important;}' +
'.showtop {display:block!important;}' +
'.tabs {background-color:#e6e6e6!important;}' +
'#app_title {color:#' + color[1] + '!important;}' +
'legend {color:#' + color[1] + '!important;}' +
'.share {background-color:#e6e6e6!important;}' +
'.blue, .ourtitle, .choiceclear {color:#' + color[1] + '!important;}');

var getName = location.pathname;
    latest = getName.slice(1,-1);

if (latest == 'tags') {
    latest = '';
    }

var prof = latest.search('p/');
if (prof == 0) {
    latest = latest.replace('p/', '');
    }

var broad = latest.search('b/');
if (broad == 0) {
    latest = latest.replace('b/', '');
    }

var app = latest.search('app');
if (app == 0) {
    document.getElementById('verText').innerHTML = '';
    document.getElementById('editBut').innerHTML = '';
    }

var apps = latest.search('apps');
if (apps == 0) {
    latest = latest.replace('apps', '');
    document.getElementById('verText').innerHTML = '';
    document.getElementById('editBut').innerHTML = '';
    }

var apps = latest.search('affiliates/api/onlinerooms');
if (apps == 0) {
    latest = latest.replace('affiliates/api/onlinerooms', '');
    document.getElementById('verText').innerHTML = '';
    document.getElementById('editBut').innerHTML = '';
    }

var apps = latest.search('feed/latest');
if (apps == 0) {
    latest = latest.replace('feed/latest', '');
    document.getElementById('verText').innerHTML = '';
    document.getElementById('editBut').innerHTML = '';
    }

var photovid = latest.search('photo_videos/');
var tipping = latest.search('tipping/');
var emoticons = latest.search('emoticons');
if ((photovid == 0) || (tipping == 0) || (emoticons == 0)) {
    document.getElementById('verText').innerHTML = '';
    document.getElementById('editBut').innerHTML = '';
    }

var pic = document.createElement('IMG');
    pic.setAttribute('id', 'newImage');
    pic.setAttribute('src', 'https://ssl-cdn.highwebmedia.com/roomimage/' + latest + '.jpg');
    pic.setAttribute('style', 'position:' + posi + '; top:0; right:268px; border:1px solid #' + color[1] + '; width:95px; height:78px; z-index:1000;');
    pic.onload = function() {
    if ((latest != '/propose_app') && (latest != '/proposals') && (latest != '/upload_app') && (latest != '/search') && (latest != 'affiliates') && (latest != 'my_collection') && (latest != 'emoticons')) {
    document.body.appendChild(pic);
    }
    }
    pic.onerror = function() {
    pic.setAttribute('style', 'display:none;');
    }

setInterval(function() {
    var getPic = document.getElementById('newImage');
    getPic.src = 'https://ssl-cdn.highwebmedia.com/roomimage/' + latest + '.jpg?rand=' + Math.random();
    }, 5000);

var link = document.getElementsByTagName('a');
    for (i = 0; i < link.length; i++) {
    if (link[i].href.indexOf('?url=') != -1) {
    linkhref = unescape(link[i].href);
    newlinkhref = linkhref.substring(linkhref.indexOf("?url=") + 5, linkhref.indexOf("&domain"));
    link[i].href = newlinkhref;
    }
    }

var broadcasting = '/b/' + latest + '/';

var onCheck = document.createElement('INS');
var onTxt = document.createTextNode('');
    onCheck.setAttribute('id', 'checkOn');
    onCheck.setAttribute('style', 'display:none;');
    onCheck.appendChild(onTxt);
    document.body.appendChild(onCheck);

$('#checkOn').load('https://chaturbate.com/' + latest + '#defchat p strong');

setTimeout(function() {
var getOn = document.getElementById('checkOn').textContent;
var stripTags = getOn.search('Room is currently offline');
if (stripTags != 0) {
    return;
    }
else {
    setInterval(function() {
    $('#checkOn').load('https://chaturbate.com/' + latest + '#defchat p strong');
    setTimeout(function() {
    var reCheck = document.getElementById('checkOn').textContent;
    var reStrip = reCheck.search('Room is currently offline');
    if (reStrip == 0) {
    return;
    }
    else if (getName == broadcasting) {
    return;
    }
    else {
    location.reload();
    }
    }, 5000);
    }, 5000);
    }
    }, 5000);

var atTop = document.createElement('A');
var upTop = document.createTextNode('');
    atTop.setAttribute('id', 'hiddenTop');
    atTop.setAttribute('name', 'top');
    atTop.setAttribute('style', 'position:absolute; top:0; left:0;');
    atTop.appendChild(upTop);
    document.body.appendChild(atTop);

var toplink = document.createElement('A');
var top = document.createTextNode('');
    toplink.setAttribute('id', 'topLink');
    toplink.setAttribute('href', '#top');
    toplink.setAttribute('style', 'position:fixed; bottom:20px; right:20px; background:#dddddd; font-size:2em; text-decoration:none; border-width:4px; border-style:double; border-radius:8px; padding:4px 8px 10px; z-index:1000; display:none;');
    toplink.appendChild(top);
    document.body.appendChild(toplink);

document.getElementById('topLink').innerHTML = '&uarr;';

jQuery('document').ready(function($) {
var toTop = $('#topLink');
$(window).scroll(function() {
    if ($(this).scrollTop() > 10) {
    toTop.addClass('showtop');
    }
    else {
    toTop.removeClass('showtop');
    }
    });
    });

pictures = document.getElementsByClassName('preview');
    if (pictures) {
    for (i = 0; i < pictures.length; i++) {
    if (pictures[i].getAttribute("alt") == "Locked") {
    pictures[i].parentNode.removeChild(pictures[i])
    }
    }
    }

if (latest == 'exhibitionist-cams') {
    var chgAct = document.getElementsByClassName('sub-nav')[0].innerHTML;
    var exCheck = chgAct.search('<li class="active">');
    if (exCheck) {
    chgAct = chgAct.replace('<li class="active">', '<li>');
    }
    var newEx = chgAct + '<li class="active"><a href="/exhibitionist-cams/">EXHIBITIONIST</a></li>';
    document.getElementsByClassName('sub-nav')[0].innerHTML = newEx;
    }
else {
    if (getName == broadcasting) {
    return;
    }
    else {
    var getSub = document.getElementsByClassName('sub-nav')[0].innerHTML;
    var addEx = getSub + '<li><a href="/exhibitionist-cams/">EXHIBITIONIST</a></li>';
    document.getElementsByClassName('sub-nav')[0].innerHTML = addEx;
    }
    }

var passCheck = document.createElement('INS');
var passTxt = document.createTextNode('');
    passCheck.setAttribute('id', 'checkPass');
    passCheck.setAttribute('style', 'display:none;');
    passCheck.appendChild(passTxt);
    document.body.appendChild(passCheck);

$('#checkPass').load('https://chaturbate.com/' + latest + '#main .content .c-1 .block h1');

setTimeout(function() {
var getPass = document.getElementById('checkPass').textContent;
var stripPtags = getPass.search('This room requires a password.');
if (stripPtags != 0) {
    return;
    }
else {
    setInterval(function() {
    var newLatest = latest.replace('roomlogin/', '');
    $('#checkPass').load('https://chaturbate.com/' + newLatest + '#main .content .c-1 .block h1');
    setTimeout(function() {
    var rePcheck = document.getElementById('checkPass').textContent;
    var rePstrip = rePcheck.search('This room requires a password.');
    if (rePstrip == 0) {
    return;
    }
    else {
    window.location = 'https://chaturbate.com/' + newLatest;
    }
    }, 5000);
    }, 5000);
    }
    }, 5000);