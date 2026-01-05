// ==UserScript==
// @name        Steam Screenshot Arrow and Wheel Controls
// @namespace   Steam Screenshot Arrow and Wheel Controls
// @description Allows you to use the arrow keys to switch screenshots.
// @author      kriscross07
// @include     *.steampowered.com/app/*
// @include     *steamcommunity.com/sharedfiles/filedetails/*
// @version     1
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12126/Steam%20Screenshot%20Arrow%20and%20Wheel%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/12126/Steam%20Screenshot%20Arrow%20and%20Wheel%20Controls.meta.js
// ==/UserScript==

addEventListener('DOMContentLoaded',function(){
  $('#highlight_strip').addEventListener('wheel',function(e){
    e.preventDefault();
    e.deltaY<0&&prev();
    e.deltaY>0&&next();
  });
  addEventListener('keydown',function(e){
    e.which==37&&prev(),e.preventDefault();
    e.which==39&&next(),e.preventDefault();
  });
  
  function $(selector){
    if(!selector)return null;
    if(selector.charAt(0)=='#')return document.querySelector(selector);
    else return document.querySelectorAll(selector);
  }
  function next(){
    $('.focus')[0].nextSibling.nextSibling&&$('.focus')[0].nextSibling.nextSibling.click();
  }
  function prev(){
    $('.focus')[0].previousSibling.previousSibling&&$('.focus')[0].previousSibling.previousSibling.click();
  }
});