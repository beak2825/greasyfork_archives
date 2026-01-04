// ==UserScript==
// @name         Elimina Required
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       SStvAA!
// @match        https://view.appen.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422555/Elimina%20Required.user.js
// @updateURL https://update.greasyfork.org/scripts/422555/Elimina%20Required.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var button = document.createElement('button');
    button.addEventListener('click', function(){elim345();},false);
    button.innerText = 'RemoveRequired';
    var parentDiv = document.getElementsByClassName("job-title")[0].parentNode;
    var sp2 = document.getElementsByClassName("job-title")[0];
	parentDiv.insertBefore(button,sp2);

	var script = document.createElement('script');
	script.innerText = `function elim345(){
    	for(var y=0;3>y;y++){
		    	var btn = document.querySelectorAll('.validates-clicked');
			    for(var i=0;btn.length>i;i++){
			    	btn[i].remove();
			    }
		    }
	    }`;
	document.body.appendChild(script);

})();