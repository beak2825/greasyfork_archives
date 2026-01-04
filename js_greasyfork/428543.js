// ==UserScript==
// @name         AO3 Google Docs Italics Bug Fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds button to AOOO's editor. Click on it in order to auto-fix the Google Docs import space bug.
// @author       exuvia
// @match        https://archiveofourown.org/works/*
// @icon         http://archiveofourown.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428543/AO3%20Google%20Docs%20Italics%20Bug%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/428543/AO3%20Google%20Docs%20Italics%20Bug%20Fixer.meta.js
// ==/UserScript==
//An explanation of the bug: https://archiveofourown.org/works/6981169/chapters/15908851
//No more needing to italicize the punctuation to get rid of the bug!
//Paste your work from Google Docs into the Rich Text editor, then click the Fix Italics (Gdocs) button to remove the improper formatting that adds the unwanted space.
//Will not remove spaces if you paste in, click Preview, go back to the edit page, click Rich Text, then click HTML. In this convoluted case just click Preview and go back to the edit page again and the Fix Italics button will work. Or refresh.

(function() {

	if (document.querySelectorAll(".rtf-html-switch.actions").length > 0){ //if is on an Edit Work page with the relevant buttons
		let fixbtn = document.createElement("a");
		fixbtn.innerHTML = "Fix Italics (Gdocs)";
		fixbtn.onclick = ()=>{
			let fixItalics = () => {
				//removes span elements that are around <em> or </em> tags
				document.getElementById("content").value = document.getElementById("content").value.replaceAll(/<\/*span[^>]*>\s*(?=<\/*em>)|(?<=<\/*em>)\s*<\/*span[^>]*>/g,"");
			}
			if (document.getElementById("content").style.display === "none") {
				document.querySelectorAll(".html-link")[0].click();
				window.setTimeout(()=>fixItalics(),200);
			}
			else fixItalics();
		}
		document.querySelectorAll(".rtf-html-switch.actions")[0].appendChild(fixbtn);
	}

})();