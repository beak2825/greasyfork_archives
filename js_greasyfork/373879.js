// ==UserScript==
// @name         Wide easily readable StackOverflow
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       Tut 'UniBreakfast' Ninin
// @match        https://stackoverflow.com/questions/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373879/Wide%20easily%20readable%20StackOverflow.user.js
// @updateURL https://update.greasyfork.org/scripts/373879/Wide%20easily%20readable%20StackOverflow.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.getElementById('left-sidebar').remove();
document.getElementById('sidebar').remove();
document.getElementById('footer').remove();
document.getElementById('post-form').remove();
var element = document.getElementById('content').style;
element.width = '2000px';
element.maxWidth = '2000px';
element.border = '0';
element.margin = '0 40px';
document.getElementById('mainbar').style.width = '100%';
document.getElementsByClassName('top-bar')[0].style.height = '27px';
document.getElementsByClassName('js-search-field')[0].style.height = '22px';
document.getElementsByClassName('question-page')[0].style.paddingTop = '14px';
element = document.createElement('style');
element.textContent =
    '.lit{color:#4ecc30}.kwd{color:#5a89f7}.str{color:#e8730a}.com{color:#a9adb1}.pun{color:#7443a9}'+
    'body{font-family:"Trebuchet MS",Arial,"Helvetica Neue",Helvetica,sans-serif}'+
    //'code{font-weight:bold}'+
    'code{color:black;font-size:18px!important;font-style:normal;line-height:18px;font-family:Ubuntu Mono,Consolas,Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace,sans-serif}'+
    '.comment-text,.comment-copy,.post-text{color:darkgreen;font-style:italic;font-family:"Trebuchet MS",Arial,"Helvetica Neue",Helvetica,sans-serif}'+
    '.comment-text{font-size:14px}.post-text{font-size:16px!important}'+
    '.grid{margin-right:100px!important}.user-info{background:cornsilk}'+
    '.relativetime{font-size:15px;font-weight:bold}'+
    '.answers-subheader{padding-left:100px}'+
    '.post-menu{display:none}'+
    '.comments-link{display:none}';
document.head.appendChild(element);
})();