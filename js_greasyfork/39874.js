// ==UserScript==
// @name           WME Force House Numbers
// @description    Forces the ability to click the Edit House Numbers to make them show on the UI even if OOEA or locked
// @namespace      bauzer714
// @grant          none
// @version        0.0.3
// @match          https://beta.waze.com/*editor*
// @match          https://www.waze.com/*editor*
// @exclude        https://www.waze.com/*user/*editor/*
// @author         bauzer714
// @downloadURL https://update.greasyfork.org/scripts/39874/WME%20Force%20House%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/39874/WME%20Force%20House%20Numbers.meta.js
// ==/UserScript==

function ForceHouseNumbers_bootstrap() {
   if(!W || !W.map || $("#edit-panel").length === 0) {
      setTimeout(ForceHouseNumbers_bootstrap, 1000);
      return;
   }
    console.log("bauzer714 - Start");
    ForceHouseNumbers_init();
}

function ForceHouseNumbers_init() {
    var ForceHouseNumbers = {};

    ForceHouseNumbers.addListener = function() {
	    window.onkeyup = function(e){
	        if(e.key === 'h' && e.altKey && !e.ctrlKey && !e.shiftKey){
	            var bauzerButton = document.getElementById('bauzer-houseNumber');
	            if (bauzerButton) {
	                bauzerButton.click();
	            }
	        }
	    };
	};

    ForceHouseNumbers.allowButton = function() {
        var target = '.edit-house-numbers';
        if ($(target).is(':disabled')) {
            $(target).prop('disabled',false).attr('id','bauzer-houseNumber');
        }
    }

    /*  No longer needed as of 7/20/2018 since waze has added the button as disabled
    ForceHouseNumbers.addButton = function() {
    	var target = '.form-group.more-actions';
    	if($(target + ' > .edit-house-numbers-btn-wrapper').length === 0) {
       		$(target).append(
	      		'<div class="edit-house-numbers-btn-wrapper waze-tooltip" title="" data-toggle="tooltip" data-original-title=""><button id="bauzer-houseNumber" class="action-button edit-house-numbers waze-btn waze-btn-white">Edit house numbers</button></div>'
      		);
       	}
    };
    */

    // check for changes in the edit-panel
    var theObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Mutation is a NodeList and doesn't support forEach like an array
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var addedNode = mutation.addedNodes[i];

                // Only fire up if it's a node
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    var moreActionsContainer = addedNode.querySelector('div.more-actions');

                    if (moreActionsContainer) {
                        ForceHouseNumbers.allowButton();
                    }
                }
            }
        });
    });
    theObserver.observe(document.getElementById('edit-panel'), { childList: true, subtree: true });

    // Catch permalinks
    ForceHouseNumbers.allowButton();

    //Add the listener to the key
    ForceHouseNumbers.addListener();
}
ForceHouseNumbers_bootstrap();