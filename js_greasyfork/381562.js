// ==UserScript==
// @name         LearnCPP dark mode
// @namespace    http://gabrielecoen.blogspot.com/
// @version      0.2
// @description  Dark mode for LearnCPP.com lessons
// @author       You
// @match        https://www.learncpp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381562/LearnCPP%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/381562/LearnCPP%20dark%20mode.meta.js
// ==/UserScript==

var loadScript = function (src, callback) {
  var elem = document.createElement('script');
  elem.type = 'text/javascript';
  elem.onload = callback;
  elem.src = src;
  document.body.appendChild(elem);
};

function start() {

  var config = {
    fontColor: '#CCCCCC',
    bodyBg: '#353535',
    yellowBg: '#262626',
    pinkBg: '#262626',
    codeBg: '#dddddd',
    commentBg: '#262626',
    authorCommentBg: '#1c1c1c'
  };

  // Common

  //// Background colors
  jQuery('body, middle, .post, .widget_text, .textwidget, .comment-respond').css('background-color', config.bodyBg);
  jQuery('td#middle, ul').css('background', config.bodyBg);
  jQuery('.cpp-lightyellowbackground').css('background-color', config.yellowBg);
  jQuery('.cpp-lightredbackground').css('background-color', config.pinkBg);
  jQuery('.crayon-row').css('background-color', config.codeBg);
  jQuery('.comment-container').css('background-color', config.commentBg);
  jQuery('.comment-container').css('border', config.commentBg);
  jQuery('.bypostauthor').css('background-color', config.authorCommentBg);
  jQuery('.bypostauthor').css('border', config.authorCommentBg);


  //// Text colors
  jQuery('body').css('color', config.fontColor);
  jQuery('table, tr, td').children().css('color', config.fontColor);
  jQuery('font').css('color', config.fontColor);
  jQuery('a:link').css('color', config.fontColor);

}

// Load jQuery, if the current web page does not have it
if (typeof jQuery === 'undefined') {
  loadScript('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', start);
} else { start(); }