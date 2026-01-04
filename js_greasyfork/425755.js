// ==UserScript==
// @name        Earlymanga Scripts
// @namespace   ew0345
// @match       *://earlymanga.org/manga/*/*
// @grant       none
// @version     1.0
// @author      ew0345
// @description Allows L/R arrow key navigation between chapters & reize chapter images using / key.
// @downloadURL https://update.greasyfork.org/scripts/425755/Earlymanga%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/425755/Earlymanga%20Scripts.meta.js
// ==/UserScript==
var chapterImages = ['.chapter-images-container-up img'];
var chapterButtons = ['.prev-chapter', '.next-chapter'];
var widthPercent = 100;

function resize() {
    var inp = prompt('Image Width / %\n\'autoh\' to fit images to page height,\n\'autow\' to fit images to page width.');
    widthPercent = inp.valueOf().toLowerCase();

    if (widthPercent === "autow" || widthPercent === "w" || widthPercent === "fitw") {
        var pageWidth = document.body.clientWidth;

        for (var i = 0; i < document.querySelectorAll(chapterImages).length; i++) {
            document.querySelectorAll(chapterImages)[i].style.width = pageWidth / document.querySelectorAll(chapterImages)[i].width * 100 + '%';
        }
    } else if (widthPercent === "autoh" || widthPercent === "h" || widthPercent === "fith" || widthPercent === "4koma") {
        var pageWidth = document.body.clientWidth;
        var pageHeight = window.height;

        for (var i = 0; i < document.querySelectorAll(chapterImages).length; i++) {
            document.querySelectorAll(chapterImages)[i].style.width = pageWidth / document.querySelectorAll(chapterImages)[i].width * 100 + '%';
            document.querySelectorAll(chapterImages)[i].style.width = pageHeight / document.querySelectorAll(chapterImages)[i].height * 100 + '%';
        }
    } else if (widthPercent === 0) {
    	return;
    } else {
        for (var i = 0; i < document.querySelectorAll(chapterImages).length; i++) {
            document.querySelectorAll(chapterImages)[i].style.width = widthPercent + '%';
        }
    }
}

window.onkeydown = function(e) {
    switch (e.key) {
		case "ArrowLeft":
			document.querySelectorAll(chapterButtons[0]).length > 0 ? document.location = document.querySelectorAll(chapterButtons[0])[0].href : console.error('Already on first chapter.');
			break;
		case "ArrowRight":
			document.querySelectorAll(chapterButtons[1]).length > 0 ? document.location = document.querySelectorAll(chapterButtons[1])[0].href : console.error('Already on last chapter');
			break;
        case "/":
        	resize();
            break;
        default:
            break;
    }
}