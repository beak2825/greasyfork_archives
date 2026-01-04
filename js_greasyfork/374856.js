// ==UserScript==
// @name         台灣轉換中華台北!!!
// @version      0.7
// @description  把所有網站(極少數網站無效)上的台灣全部轉換成中華台北，以便符合民意。
// @author       zaqwsx2205
// @match       *://*/*
// @exclude    *://greasyfork.org/*
// @exclude    *://*.wikipedia.org/*
// @exclude    *://*.youtube.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Emblem_of_Chinese_Taipei_for_Olympic_games.svg/473px-Emblem_of_Chinese_Taipei_for_Olympic_games.svg.png
// @grant        none
// @namespace https://greasyfork.org/users/194171
// @downloadURL https://update.greasyfork.org/scripts/374856/%E5%8F%B0%E7%81%A3%E8%BD%89%E6%8F%9B%E4%B8%AD%E8%8F%AF%E5%8F%B0%E5%8C%97%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/374856/%E5%8F%B0%E7%81%A3%E8%BD%89%E6%8F%9B%E4%B8%AD%E8%8F%AF%E5%8F%B0%E5%8C%97%21%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


function replaceTextOnPage(from, to){
  getAllTextNodes().forEach(function(node){
    node.nodeValue = node.nodeValue.replace(new RegExp(quote(from), 'g'), to);
  });

  function getAllTextNodes(){
    var result = [];

    (function scanSubTree(node){
      if(node.childNodes.length)
        for(var i = 0; i < node.childNodes.length; i++)
          scanSubTree(node.childNodes[i]);
      else if(node.nodeType == Node.TEXT_NODE)
        result.push(node);
    })(document);

    return result;
  }

  function quote(str){
    return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  }
}

replaceTextOnPage('台湾','中华台北');
replaceTextOnPage('台灣','中華台北');
replaceTextOnPage('臺灣','中華臺北');
replaceTextOnPage('Taiwan','Chinese Taipei');
replaceTextOnPage('taiwan','Chinese Taipei');
})();