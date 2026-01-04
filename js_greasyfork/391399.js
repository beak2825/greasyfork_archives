// ==UserScript==
// @name         Curse-Direct
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes the 5 second wait time for downloading on curseforge.com and instead links directly to the file.
// @author       Hydrolox
// @match        https://www.curseforge.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391399/Curse-Direct.user.js
// @updateURL https://update.greasyfork.org/scripts/391399/Curse-Direct.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var arr = document.getElementsByClassName("button--hollow");
    var isCorrect = [];
    var x = [];
    var links = [];
    var linkLocations = [];
    for (var i=0;i<=arr.length;i++){

      //console.log(arr[i]);
      // if not undefined
      if(arr[i] != undefined){
      // x[i] equals current tagname
        x[i] = arr[i].tagName;}
      else {x[i] = 0}
      //console.log(x);
      if (x[i] === "A") {
        linkLocations[i] = arr[i].href;
        //console.log(arr[i].href);
        if(linkLocations[i] != 0 && linkLocations[i] != undefined){if (linkLocations[i].includes("/download/")){arr[i].href += "/file";}}
      }
      else {linkLocations[i] = 0}
      //console.log(arr[i].href);
      //isCorrect[i] = arr[i].href.includes("/download/");

    }
    //console.log(isCorrect);
    //console.log(arr);
    //console.log(linkLocations);
    // Your code here...
})();