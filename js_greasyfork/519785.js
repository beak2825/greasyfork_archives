// ==UserScript==
// @name         IAFD - Better Alias List (IA)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Reformat the Alias list with an space after each comma + Sites within parentheses (In serach results too)(IA)
// @icon         https://external-content.duckduckgo.com/ip3/www.iafd.com.ico
// @author       Janvier57
// @match        https://www.iafd.com/person.rme/*
// @match        https://www.iafd.com/results.asp?searchtype=comprehensive&searchstring=*
// @match        https://www.iafd.com/person.rme/id=*
// @match        https://www.iafd.com/matchups.rme/perfid=*
// @match        https://www.iafd.com/matchups.rme/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519785/IAFD%20-%20Better%20Alias%20List%20%28IA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519785/IAFD%20-%20Better%20Alias%20List%20%28IA%29.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var biodata = document.querySelector('p.headshotcaption + p.bioheading + .biodata');
  if (biodata) {
    var html = biodata.innerHTML;
    var newHtml = html.replace(/<br>/g, ', ');
    biodata.innerHTML = newHtml;
  }

  var aliasLists = document.querySelectorAll('p.headshotcaption + p.bioheading + .biodata, .text-left:not(#corrections):not(#persontitlead)');
  console.log('Found alias lists:', aliasLists);
  aliasLists.forEach(function(aliasList) {
    var text = aliasList.textContent;
    console.log('Original text:', text);
    var items = text.split(',');
    var newItems = items.map(function(item) {
      var index = item.indexOf('(');
      if (index !== -1) {
        item = item.substring(0, index).trim();
      }
      return item;
    });
    var newText = newItems.join(', ');
    console.log('New text:', newText);
    aliasList.textContent = newText;
  });

  var iframeAliasLists = document.querySelectorAll('.row .matchuph3 + .matchupaka');
  console.log('Found iframe alias lists:', iframeAliasLists);
  iframeAliasLists.forEach(function(iframeAliasList) {
    var text = iframeAliasList.textContent;
    console.log('Original iframe text:', text);
    var items = text.split(',');
    var newItems = items.map(function(item) {
      var index = item.indexOf('(');
      if (index !== -1) {
        item = item.substring(0, index).trim();
      }
      return item;
    });
    var newText = newItems.join(', ');
    console.log('New iframe text:', newText);
    iframeAliasList.textContent = newText;
  });
})();
