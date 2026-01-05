// ==UserScript==
// @name        Neil Fraser Diff Demo - Enhanced Output View
// @namespace   NFDiff_KK
// @author      Kai Krause <kaikrause95@gmail.com>
// @description	Easier to compare between corrections, especially for Japanese.
// @include     http://neil.fraser.name/software/diff_match_patch/svn/trunk/demos/demo_diff.html
// @include     https://neil.fraser.name/software/diff_match_patch/svn/trunk/demos/demo_diff.html
// @include     https://neil.fraser.name/software/diff_match_patch/demos/diff.html
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19875/Neil%20Fraser%20Diff%20Demo%20-%20Enhanced%20Output%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/19875/Neil%20Fraser%20Diff%20Demo%20-%20Enhanced%20Output%20View.meta.js
// ==/UserScript==

//Allow selecting text for copying. Source: http://www.javascriptkit.com/javatutors/copytoclipboard.shtml
var script = document.createElement("script");
script.type = "text/javascript";
script.innerHTML = 'function clearComparison(){text1.value = ""; text2.value = "";}; function startSelect(el){var originalText = document.getElementById("original"); var correctedText = document.getElementById("correction"); if (el == 1){selectElementText(originalText);} else {selectElementText(correctedText)}}; function selectElementText(el){var range = document.createRange(); range.selectNodeContents(el); var selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);}';
document.head.appendChild(script);

//Reset text comparison
text1.value = "";
text2.value = "";
var inputArea = document.getElementsByTagName('tbody');
inputArea[0].innerHTML += '<button type="button" onclick="clearComparison()">Clear Comparison</button>';

document.getElementsByTagName('input')[5].addEventListener('click', function() {
	//Get output
	var outputdiv = document.getElementById('outputdiv');
	var output = outputdiv.getElementsByTagName('*');
	//Sort output
	var original = '';
	var correction = '';
	for (var i = 0; i < output.length; i++){
		if (output[i].tagName == "SPAN"){
			original += output[i].outerHTML;
			correction += output[i].outerHTML;
		}
		else if (output[i].tagName == "DEL"){
			original += output[i].outerHTML;
		}
		else if (output[i].tagName == "INS"){
			correction += output[i].outerHTML;
		}
	}
	//Replace highlight with text color (for better copying into word docs, etc)
	original = original.replace(/style="background:#ffe6e6;"/igm, 'style="color:red;"');
	original = original.replace(/¶/igm, '');
	original = original.replace(/<del/igm, '<span');
	original = original.replace(/del>/igm, 'span>');
	original = original.replace(/<br>/igm, '<div><p></p></div>');
	correction = correction.replace(/style="background:#e6ffe6;"/igm, 'style="color:green;"');
	correction = correction.replace(/¶/igm, '');
	correction = correction.replace(/<ins/igm, '<span');
	correction = correction.replace(/ins>/igm, 'span>');
	correction = correction.replace(/<br>/igm, '<div><p></p></div>');
	//Rewrite output
	outputdiv.innerHTML = '<table border="1" cellspacing="5" cellpadding="5" style="width:100%; border-collapse: collapse;"><tr><td style="width:49.9%; display:inline-table" id="original">' + original + '</td><td style="width:49.9%; display:inline-table" id="correction">' + correction + '</td></tr></table>';
	outputdiv.innerHTML += '<table border="0" style="width:100%"><tr><td style="width:49.9%"><button type="button" onclick="startSelect(1)">Select All</button></td><td style="width:49.9%"><button type="button" onclick="startSelect(2)">Select All</button></td></tr></table>';
}, false);