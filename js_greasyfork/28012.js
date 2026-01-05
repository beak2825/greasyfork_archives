// ==UserScript==
// @name         Tumblr Fic Adjustments
// @namespace    aclevercrow.tumblr.com
// @version      0.1
// @description  Press the ` key to remove and replace default styles for easier reading of stories or long text posts on Tumblr.
// @author       aclevercrow
// @match        *://*.tumblr.com/post/*
// @resource	 crimsonText https://fonts.googleapis.com/css?family=Crimson+Text
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28012/Tumblr%20Fic%20Adjustments.user.js
// @updateURL https://update.greasyfork.org/scripts/28012/Tumblr%20Fic%20Adjustments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var doc = document;

    // forEach for NodeList
    function forEach(arr, cb, scope) {
    	for(var i = 0, len = arr.length; i < len; i++) {
    		cb.call(scope, i, arr[i]);
    	}
    }

    // forIn with callback to iterate object key/values
	function forIn(obj, cb, scope) {
    	var key;

    	for(key in obj) {
    		if(obj.hasOwnProperty(key)) {
    			cb.call(scope, key, obj[key]);
    		}
    	}
    }

    function clearAllStyles(e) {
    	var styles = doc.body,
            bigSvgs = doc.querySelectorAll('.app-nag svg'),
            styleChange = {
	        	margin: '3rem',
	        	fontFamily: '"Crimson Text"',
	        	fontSize: '1.8rem',
	        	lineHeight: '3rem'
        	};

        if(e.key === '`') {

            forEach(doc.styleSheets, function clearStyleSheet(i, val) {
            	val.disabled = true;
            });

            forIn(styleChange, function addStyles(key, val) {
            	styles.style[key] = val;
            });

            if(bigSvgs) {
                forEach(bigSvgs, function changeStyle(index, val) {
                	val.style.width = '50px';
                });
            }

            doc.removeEventListener("keydown", clearAllStyles, false);
        }
    }

	doc.addEventListener("keydown", clearAllStyles, false);

})();