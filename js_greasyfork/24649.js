// ==UserScript==
// @name         2048 enhancer
// @namespace    http://tampermonkey.net/
// @version      a1.1.0
// @description  enhances 2048 game (the page) [previous update: a1.0.9]
// @author       CSS8
// @match        https://gabrielecirulli.github.io/2048/
// @grant        none
// @icon         https://gabrielecirulli.github.io/2048/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/24649/2048%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/24649/2048%20enhancer.meta.js
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

// Base for .title

addGlobalStyle('.title { -webkit-box-sizing: content-box; -moz-box-sizing: content-box; cursor: default; border: none; font: normal normal bold 70px/normal "Bad Script", Helvetica, sans-serif; color: rgba(0, 0, 0, 0); text-align: center; -o-text-overflow: clip; text-overflow: clip; text-shadow: 3px 0 0 rgb(217,31,38) , 6px 0 0 rgb(226,91,14) , 9px 0 0 rgb(245,221,8) , 12px 0 0 rgb(5,148,68) , 15px 0 0 rgb(2,135,206) , 18px 0 0 rgb(4,77,145) , 21px 0 0 rgb(42,21,113) ; -webkit-transition: all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55); -moz-transition: all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55); -o-transition: all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55); transition: all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55);');
// Enable for hover effect
/* addGlobalStyle('.title:hover { text-shadow: -3px 0 0 rgb(217,31,38) , -6px 0 0 rgb(226,91,14) , -9px 0 0 rgb(245,221,8) , -12px 0 0 rgb(5,148,68) , -15px 0 0 rgb(2,135,206) , -18px 0 0 rgb(4,77,145) , -21px 0 0 rgb(42,21,113) ; -webkit-transition: all 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55); -moz-transition: all 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55); -o-transition: all 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55); transition: all 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);');*/


// begin new-game button

addGlobalStyle('.restart-button { -webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; position: relative; cursor: default; border: 4px solid rgb(255,255,255); color: rgb(255, 255, 255); text-align: center; -o-text-overflow: clip; text-overflow: clip; background: #FFAE00; !important; }');
addGlobalStyle('.restart-button:hover { color: #ffffff; background: #bbada0; !iportant}');
addGlobalStyle('a.restart-button a:after { content: '>'; position: absolute; opacity: 0; top: 0; right: -20px; transition: 0.5s; };');
addGlobalStyle('a.restart-button:hover a:after { opacity: 1; right: 0; };');

// end restart-button

// begin background animation

addGlobalStyle('body { animation-name: body; animation-duration: 4s;};');
addGlobalStyle('@keyframes body { 0%   {background-color:grey;}; 25%   {background-color:blue;}; 75%   {background-color:green;}; 100%   {background-color:red;} };');

// end body

// begin grid animation

addGlobalStyle('.grid-cell { animation: gridcell 5s infinite; };');
addGlobalStyle('@keyframes gridcell { 50% {background-color: grey;} };');

// end grid animation

// begin text styling

    // how-to-play section

addGlobalStyle('.important { -webkit-box-sizing: content-box; -moz-box-sizing: content-box; cursor: default; border: none; font: normal normal bold 18px/normal "Bad Script", Helvetica, sans-serif; color: rgba(0, 0, 0, 0); text-align: center; -o-text-overflow: clip; text-overflow: clip; text-shadow: 2px 0 0 rgba(255,0,0,1) , 5px 0 0 rgba(189,86,86,1) ; -webkit-transition: all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55); -moz-transition: all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55); -o-transition: all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55); transition: all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55) };');

    // a

/*addGlobalStyle('a { animation: a 5s infinite; };');
addGlobalStyle('@keyframes a { 50% {color: blue;}};');*/
addGlobalStyle('a { cursor: default; };');

    // donate button

addGlobalStyle('#submit { animation: submit 10s infinite; };');
    addGlobalStyle('@keyframes submit { 50% {background-color: pink;} };');

    // (wip) tile animations

addGlobalStyle(' .enjoy-css { -webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; width: 150px; height: 100px; border: none; -o-text-overflow: ellipsis; text-overflow: ellipsis; -webkit-box-shadow: 3px 3px 18px 3px rgba(0,150,255,0.91); box-shadow: 3px 3px 18px 3px rgba(0,150,255,0.91) ; }');

// end animations

// begin ect(s)

addGlobalStyle('');

// end script

// begin "full screen"



var newHTML         = document.createElement ('div');
newHTML.innerHTML   = '             \
    <div id="happyText">             \
        Script by:      \
    </div>                          \
';

document.body.appendChild (newHTML);

var newHTML         = document.createElement ('div');
newHTML.innerHTML   = '             \
    <div id="happyText2">             \
        CSS8      \
    </div>                          \
';

document.body.appendChild (newHTML);

addGlobalStyle('#happyText2 { color: red; position: fixed; top: 25px; left: 5px; font-weight: 900; };');
addGlobalStyle('#happyText { color: red; position: fixed; top: 5px; left: 5px; font-weight: 900; };');

// game outline

addGlobalStyle('.game-container {   \
  -webkit-box-sizing: content-box; \
  -moz-box-sizing: content-box; \
  box-sizing: content-box; \
  border: none; \
  text-align: center; \
  -o-text-overflow: ellipsis; \
  text-overflow: ellipsis; \
  -webkit-box-shadow: 3px 3px 18px 3px #93918e; \
  box-shadow: 3px 3px 18px 3px #93918e ; }; \
');
/* addGlobalStyle('#happyText2 {   \
  -webkit-box-sizing: content-box; \
  -moz-box-sizing: content-box; \
  box-sizing: content-box; \
  border: none; \
  text-align: center; \
  -o-text-overflow: ellipsis; \
  text-overflow: ellipsis; \
  -webkit-box-shadow: 3px 3px 18px 3px #93918e; \
  box-shadow: 3px 3px 18px 3px #93918e ; }; \
'); */

// begin tile animation

addGlobalStyle('.tile .tile-inner {   \
  -webkit-box-sizing: content-box; \
  -moz-box-sizing: content-box; \
  box-sizing: content-box; \
  border: none; \
  text-align: center; \
  -o-text-overflow: ellipsis; \
  text-overflow: ellipsis; \
  -webkit-box-shadow: 3px 3px 18px 3px rgba(0,150,255,0.91); \
  box-shadow: 3px 3px 18px 3px rgba(0,150,255,0.91) ; }; \
');

/* addGlobalStyle('.tile .tile-8 {   \
  -webkit-box-sizing: content-box; \
  -moz-box-sizing: content-box; \
  box-sizing: content-box; \
  border: none; \
  text-align: center; \
  -o-text-overflow: ellipsis; \
  text-overflow: ellipsis; \
  -webkit-box-shadow: 3px 3px 18px 3px rgba(0,150,255,0.91); \
  box-shadow: 3px 3px 18px 3px rgba(0,150,255,0.91) ; }; \
'); */

// score shadow

addGlobalStyle('.score-container { text-shadow: 4px 4px 6px #cdc0b4; };');
addGlobalStyle('.best-container { text-shadow: 4px 4px 6px #cdc0b4; };');