// ==UserScript==
// @name        Hide Email Address From Title Bar
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @version     0.5
// @copyright   Copyright 2018 Jefferson Scher
// @license     BSD-3-Clause
// @description Remove email address from title bar on Gmail, Outlook.com, Office365, and Yahoo Mail
// @include     https://mail.google.com/*
// @include     https://outlook.live.com/*
// @include     https://outlook.office.com/*
// @include     https://outlook.office365.com/* 
// @include     https://mail.yahoo.com/* 
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/38152/Hide%20Email%20Address%20From%20Title%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/38152/Hide%20Email%20Address%20From%20Title%20Bar.meta.js
// ==/UserScript==

function cleanTitle(){
  //console.log('Called cleanTitle');
  if (document.title.indexOf('@') > -1) {
    var titleparts = document.title.split(' '), titlenew = '';
    for (var i=0; i<titleparts.length; i++){
      if (titleparts[i].indexOf('@') < 0){
        titlenew += titleparts[i] + ' ';
      } else {
        if (location.hostname.indexOf('outlook.live') > -1) titlenew += 'Outlook ';
        if (location.hostname.indexOf('outlook.office') > -1) titlenew += 'Office365 ';
      }
    }
    titlenew = titlenew.replace('- - ', '- ').trim();
    document.title = titlenew;
  }
}
function setMutationWatch(){
  MutOb = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
  if (MutOb){
    chgMon = new MutOb(function(mutationSet){
      mutationSet.forEach(function(mutation){
        for (var i=0; i<mutation.addedNodes.length; i++){
          if (mutation.addedNodes[i].nodeType == 1){ // Ignore some common nodes
            if ('LINK|META|SCRIPT|STYLE'.indexOf(mutation.addedNodes[i].nodeName) < -1) cleanTitle();
          } else { // There are rare but critical
            cleanTitle();
          }
        }
      });
    });
    // attach chgMon to <head>
    opts = {childList: true, subtree: true, attributes: false, characterData: false};
    chgMon.observe(document.getElementsByTagName('head')[0], opts);
  }
}
cleanTitle();
setMutationWatch();
