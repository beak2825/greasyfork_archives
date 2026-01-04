// ==UserScript==
// @name        Flow Icon --> SG Icon
// @namespace   halil3d
// @include      *.shotgunstudio.com/*
// @include      *.shotgrid.autodesk.com/*
// @grant       none
// @version     1.1
// @author      halil3d
// @description Change the favicon, logo and titles of Autodesk's Flow Production Tracking back to ShotGrid (for as long as they maintain the old images on the server)
// @icon        https://tank.shotgunstudio.com/images/favicon/shotgun-icon-310x310.png
// @downloadURL https://update.greasyfork.org/scripts/491472/Flow%20Icon%20--%3E%20SG%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/491472/Flow%20Icon%20--%3E%20SG%20Icon.meta.js
// ==/UserScript==


(function() {
	'use strict';
	function log(...toLog) {
		console.log("[Flow --> SG]", ...toLog);
	}
  window.addEventListener('load', function() {
	  log("Starting Flow Production Tracking --> SG...");

    // new icons
    const shortcutIconUrl = "/images/favicon/shotgun-icon-64x64.png";
    const iconUrl = "/images/favicon/shotgun-icon-310x310.png";

    let shortcutIcon = document.querySelector('link[rel="shortcut icon"]');
    let icon = document.querySelector('link[rel="icon"]');
    let sgLogo = document.querySelector('img[alt="SG"]');

    // Replace the text in the page
    let title = document.title.replace("Flow Production Tracking", "ShotGrid");
    document.title = title;
    function walkText(node) {
      if (node.nodeType == 3) {
        node.data = node.data.replace(/Flow Production Tracking/g, "ShotGrid");
      }
      if (node.nodeType == 1 && node.nodeName != "SCRIPT") {
        for (var i = 0; i < node.childNodes.length; i++) {
          walkText(node.childNodes[i]);
        }
      }
    }
    walkText(document.body);

    // Change the icons
		if (shortcutIcon) {
			shortcutIcon.href = shortcutIconUrl;
      log("shortcutIcon: ", shortcutIcon);
		} else {
			log("shortcutIcon: Something went wrong.");
		}
		if (icon) {
			icon.href = iconUrl;
      log("icon: ", icon);
		} else {
			log("icon: Something went wrong.");
		}
		if (sgLogo) {
			sgLogo.src = iconUrl;
      log("sgLogo: ", sgLogo);
		} else {
			log("sgLogo: Something went wrong.");
		}
    log("Changing Flow favicon complete.");
	}, false);
  
  // Something resets this back so we set it correctly again after 6 seconds - I can't find the event doing this and this works well enough but means the logo flickers as the showdown happens...
  setTimeout(function(){
    const iconUrl = "/images/favicon/shotgun-icon-310x310.png";
    let sgLogo = document.querySelector('img[alt="SG"]');
    if (sgLogo) {
      sgLogo.src = iconUrl;
      log("sgLogo: ", sgLogo);
    } else {
      log("sgLogo: Something went wrong.");
    }
  }, 7000);
})();
