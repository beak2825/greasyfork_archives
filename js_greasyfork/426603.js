// ==UserScript==
// @name         codemarshal hide solved / tried problem
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hide all tried/solved problems in codemarshal problem section.
// @author       steinum
// @match        https://algo.codemarshal.org/problems
// @icon         https://www.google.com/s2/favicons?domain=codemarshal.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426603/codemarshal%20hide%20solved%20%20tried%20problem.user.js
// @updateURL https://update.greasyfork.org/scripts/426603/codemarshal%20hide%20solved%20%20tried%20problem.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    for(var i=document.getElementsByClassName("list-group-item").length-1;i>=0;i=i-1){
        var x = document.getElementsByClassName("list-group-item")[i];
        var p = x.getElementsByClassName("mark mark-success").length;
        var q = x.getElementsByClassName("mark mark-warning").length;
        if(p+q){
            x.remove();
        }
    }
})();