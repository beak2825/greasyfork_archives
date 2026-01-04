// ==UserScript==
// @name         Question Relevance
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       SStvAA!
// @match        https://render.figure-eight.io/assignments/*
// @match        https://tasks.figure-eight.work/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391509/Question%20Relevance.user.js
// @updateURL https://update.greasyfork.org/scripts/391509/Question%20Relevance.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = get_ts();

    function get_ts(){
    	console.log("Cargo")
    	var pp = document.getElementsByTagName("label");
	    for(var i=0; pp.length>i;i++){
	        if(pp[i].innerText.search("No")>=0){
	            pp[i].getElementsByTagName("input")[0].value="2"
	        }
	    }
    }

})();