// ==UserScript==
// @name           Moodle Quiz Anonymiser For Manual Grading
// @namespace      Academia Squared
// @description    Remove (hide) student names in Moodle Quizes
// @grant          none
// @include				 https://moodle.*/mod/quiz/report*
// @version       1.1
// @downloadURL https://update.greasyfork.org/scripts/378569/Moodle%20Quiz%20Anonymiser%20For%20Manual%20Grading.user.js
// @updateURL https://update.greasyfork.org/scripts/378569/Moodle%20Quiz%20Anonymiser%20For%20Manual%20Grading.meta.js
// ==/UserScript==

function remove_names(){
  // Name at the top
  var elementsWithIt = document.evaluate("/html/body/div[1]/div[2]/div/div/section/div/div/form[2]/div/h4", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  	for (var j = 0; j < elementsWithIt.snapshotLength; j++) {
			elementsWithIt.snapshotItem(j).parentNode.removeChild(elementsWithIt.snapshotItem(j));

	}
  
  // All other h4 elements where the name should be
  var elementsWithIt = document.evaluate("/html/body/div[1]/div[2]/div/div/section/div/div/form[2]/div/h4[2]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var j = 0; j < elementsWithIt.snapshotLength; j++) {
			elementsWithIt.snapshotItem(j).parentNode.removeChild(elementsWithIt.snapshotItem(j));

	}
  
    // All other h4 elements where the name should be
  var elementsWithIt = document.evaluate("//h4[contains(text(),'Attempt number')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var j = 0; j < elementsWithIt.snapshotLength; j++) {
			elementsWithIt.snapshotItem(j).parentNode.removeChild(elementsWithIt.snapshotItem(j));

	}
}

remove_names();

document.addEventListener('DOMNodeInserted',function(e){
	window.setTimeout(function(){
		remove_names();
				}, 250);
})


