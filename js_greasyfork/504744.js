// ==UserScript==
// @name         Litmatch-Unblur
// @namespace    https://hackingcenter.eu
// @version      1.2
// @description        Removes blurry background from litmatch images, as well as removes buttons to download the app
// @description:es        Elimina el fondo borroso de las imágenes de Litmatch y también elimina los botones para descargar la aplicación.
// @author       Unknown-60
// @match        https://litmatchapp.com/*
// @grant        none
// @license        BSD 3-Clause License
// @downloadURL https://update.greasyfork.org/scripts/504744/Litmatch-Unblur.user.js
// @updateURL https://update.greasyfork.org/scripts/504744/Litmatch-Unblur.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
	const storageKey = 'alertShown';

	// Check if the dialog has already been displayed
	if (!localStorage.getItem(storageKey)) {
	
	//create a dialog
	const dialog = document.createElement('div');
	dialog.id = 'custom-dialog';
	dialog.style.position = 'fixed';
	dialog.style.top = '50%';
	dialog.style.left = '50%';
	dialog.style.transform = 'translate(-50%, -50%)';
	dialog.style.width = '300px';
	dialog.style.backgroundColor = '#424242';
	dialog.style.borderRadius = '10px';
	dialog.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
	dialog.style.zIndex = '10000';
	dialog.style.fontFamily = 'Arial, sans-serif';

	dialog.innerHTML = `
 	   <div style="background-color:#607D8B; padding: 10px 15px; border-top-left-radius: 10px; border-top-right-radius: 10px; color: white; font-size: 18px;">
 	       New Android App
 	   </div>
 	   <div style="padding: 15px; color: white;">
 	       <p style="margin: 0; font-size: 16px;">Hi, if you want more comfort, you can now download our application (Litmatch Stalker) to be able to see profiles without being seen and download the images.<br>DEV: Unknown-60</p>
 	       <a href="https://litmatch.rf.gd" target="_blank" style="display: block; margin-top: 15px; color: #C2A5A5; text-decoration: none; font-size: 14px;">Download Litmatch Stalker</a>
 	   </div>
 	   <div style="padding: 10px 15px; text-align: right;">
 	       <button id="close-dialog" style="background-color: #607D8B; border: none; color: white; padding: 5px 10px; border-radius: 5px; font-size: 14px;">Close</button>
 	   </div>
`;
document.body.appendChild(dialog);

	// close button
	document.getElementById('close-dialog').onclick = function() {
	//close dialog
    dialog.remove();
    //don't show again the dialog
    localStorage.setItem(storageKey, 'true');
	};
}

	var noblur2 = document.querySelector(".homepage-feed-list-blur");
	noblur2.style.setProperty("filter", "none", "important");

	var div_btn_download = document.querySelector(".homepage-btn.homepage-download-btn");
	if (div_btn_download) {
 	   div_btn_download.parentNode.removeChild(div_btn_download);
	}

	var div_download = document.querySelector(".homepage-download"); 
	if (div_download) {
	    div_download.parentNode.removeChild(div_download);
	}

	var div_btn_install = document.querySelector(".homepage-btn.homepage-fallow-btn");
	if (div_btn_install) {
    div_btn_install.parentNode.removeChild(div_btn_install);
	}
})();
