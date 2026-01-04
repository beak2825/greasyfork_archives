// ==UserScript==
// @name         Autoclick Download Button decotoday.net
// @namespace    https://greasyfork.org/en/users/721184-slidersbe
// @version      0.1
// @description  Copy hidden link automatically from decotoday.net !
// @author       SlidersBe
// @match        https://www.decotoday.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431650/Autoclick%20Download%20Button%20decotodaynet.user.js
// @updateURL https://update.greasyfork.org/scripts/431650/Autoclick%20Download%20Button%20decotodaynet.meta.js
// ==/UserScript==
         
    (function() {
        'use strict';
    	if(document.querySelector('input[value="Continuer pour voir le lien"]')) {
    	    document.querySelector('input[value="Continuer pour voir le lien"]').click()
    	}
     
    	if (document.querySelector('div.alert a')) {
    		var link = document.querySelector('div.alert a')
    		link.href = link.href.replace(/(\?|&)af=\d+/,'').replace(/(\?|&)aff_id=\d+/,'')
        textToClipboard(link.href)
        window.close();    
    	}
    })();
     
    function textToClipboard (text) {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }

