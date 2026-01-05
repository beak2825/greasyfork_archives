/**
  The MIT License (MIT)

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

// ==UserScript==
// @name         Fixed Width Spectrum Tweaks
// @icon         http://i.imgur.com/9Gjdt3x.jpg
// @version      0.2
// @description  Readability Teaks for Spectrum
// @author       Royalkin
// @match        https://robertsspaceindustries.com/spectrum/*
// @match        https://www.robertspaceindustries.com/spectrum/*
// @licent       MIT
// @namespace https://robertsspaceindustries.com/spectrum/*
// @downloadURL https://update.greasyfork.org/scripts/27546/Fixed%20Width%20Spectrum%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/27546/Fixed%20Width%20Spectrum%20Tweaks.meta.js
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

//------------------------------------------------------
//------------------------------------------------------
// DO NOT EDIT THIS IF YOU DON'T KNOW WHAT YOU'RE DOING!
//------------------------------------------------------
//------------------------------------------------------

//--------------------------------------
// Modifications for Variable Width / Less than Full Width
//--------------------------------------

/*//Changes the body background color
addGlobalStyle('body {background: url("http://i.imgur.com/lMWOozd.jpg") top center; !important; }');

//Changes the layout to centered and less than full browser width
addGlobalStyle('#react { margin: auto; width: 75%; !important; }');

//Ensures the RSI button (Top Left Corner) remains in place
addGlobalStyle('#app #app-header a.logo { position: relative; top: 0; left: 0; }');**/

//--------------------------------------
// Modifications for Fixed Width
//--------------------------------------

//Changes the body background color
addGlobalStyle('body {background: url("http://i.imgur.com/lMWOozd.jpg") top center; !important; }');

//Changes the layout to centered and less than full browser width
addGlobalStyle('#react { margin: auto; width: 1280px; !important; }');

//Ensures the RSI button (Top Left Corner) remains in place
addGlobalStyle('#app #app-header a.logo { position: relative; top: 0; left: 0; }');

//--------------------------------------
// Thread List Modifications
//--------------------------------------

//Increase the height of thread list rows
addGlobalStyle('#page.forum-channel .threads-list .row { padding: 10px 25px 10px 25px; !important; }');

//Adds distance between thread title, thread author, and started by and last post time
addGlobalStyle('#page.forum-channel .threads-list .row .column.subject .subject-content .subject-content-footer { margin-top: 5px; !important; }');
addGlobalStyle('#page.forum-channel .threads-list .row .column.last-activity > .time-created { margin-top: 5px; !important; }');

//Decreases font size and changes the thread list column headers to uppercase
addGlobalStyle('#page.forum-channel .threads-list .row.columns-header { font-size: 0.9rem; text-transform: uppercase; !important;}');

//Changes the dark theme color for thread list column headers
addGlobalStyle('.theme-dark #page.forum-channel .threads-list .row.columns-header .column {color: #76bae5; !important;}');

//Increase the size and weight of thread titles
addGlobalStyle('#page.forum-channel .threads-list .row .column.subject .subject-content a.thread-subject { font-size: 0.9rem; font-weight: bold; !important; }');

//Changes the dark theme color for thread titles
addGlobalStyle('.theme-dark #page.forum-channel .threads-list .row .column.subject .subject-content a.thread-subject { color: #d6e3Eb; !important; }');

//Changes the font size of the channel header
addGlobalStyle('#page.forum-channel .channel-header .info .info-header h1.channel-name { font-size: 1.1rem; !important; }');

//Adds indiciation of a visited thread (dark theme)
addGlobalStyle('.theme-dark #page.forum-channel .threads-list .row .column.subject .subject-content a.thread-subject:visited { color: #646a6d; !important; }');

//Adds indiciation of a visited thread (light theme)
addGlobalStyle('#page.forum-channel .threads-list .row .column.subject .subject-content a.thread-subject:visited { color: #a8b1b6; !important; }');

//--------------------------------------
// Post Modifications
//--------------------------------------

//Increase the distance between the post body and the action buttons
addGlobalStyle('.forum-thread-item.type-forum_thread_reply > .content .content-footer { padding: 100px 0 0 0; !important;}');
addGlobalStyle('.forum-thread-item > .content .content-footer { padding: 100px 0 0 0; !important; }');

//Increses the distance from the top of the post window to the username
addGlobalStyle('.forum-thread-item > .content .content-header .left { margin: 22px 0 0 0; !important; }');

//Increase the distance from the username to the post body
addGlobalStyle('.forum-thread-item > .content .content-blocks { margin: 35px 0 0 0; !important; }');

//Increase the distance from the username to the post subject line
addGlobalStyle('.forum-thread-item .forum-thread-subject { margin: 55px 0 0 0; !important; }');

/*//Changes background color of original post
addGlobalStyle('.theme-dark .forum-thread-item { border-radius: 0; background-color: #282828; !important; }');

//Changes background color of reply posts
addGlobalStyle('.theme-dark #page.forum-thread .page-content .forum-thread .forum-thread-replies > .forum-thread-item { border-radious: 0; background: none; border: 1px solid #282828; !important; }');
//background-color: #282828;

//Adds background to thread
addGlobalStyle('.theme-dark .page-content { background-color: #111111; !important; }');

//Changes the color of the username
addGlobalStyle('.theme-dark .forum-thread-item > .content .content-header .left .member-name span.displayname { color: #dbdbdb; !important; }');

//Changes the color of the nickname
addGlobalStyle('.theme-dark .forum-thread-item > .content .content-header .left .member-name span.nickname { color: #aaaaaa !important; }');

//Increases padding for the original post
addGlobalStyle('#page.forum-thread .page-content .forum-thread > .forum-thread-item.type-forum_thread { padding: 30px; !important }');

//Changes color of forum lables
addGlobalStyle('.theme-dark .forum-label { border-radius: 0; border-color: #6a6a6a; !important; }');
addGlobalStyle('.theme-dark .forum-label .forum-label-gutter { border-radius: 0; background-color: #6a6a6a; !important; }');
addGlobalStyle('.theme-dark .forum-label { color: #acacac; }');
addGlobalStyle('.theme-dark .forum-label .icon use { fill: #acacac; }');**/