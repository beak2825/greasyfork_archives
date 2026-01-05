// ==UserScript==
// @name        Lang-8 - "All Corrections" View Enhancer
// @description	Easier to read and view corrections in the "All Corrections" viewer, especially for Japanese.
// @author      Kai Krause (kaikrause95@gmail.com)
// @match       http://lang-8.com/*/journals/*
// @match       https://lang-8.com/*/journals/*
// @version     1.4
// @grant       none
// @namespace Lang8LTR
// @downloadURL https://update.greasyfork.org/scripts/11160/Lang-8%20-%20%22All%20Corrections%22%20View%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/11160/Lang-8%20-%20%22All%20Corrections%22%20View%20Enhancer.meta.js
// ==/UserScript==

/*
Remove strike-through text on corrections, "All Corrections" view and default.
All Corrections View:
	Expands the view more dynamically for larger displays.
	Removes "No correction needed" green text messages.
	Re-injects the comment icon for comments, as they didn't always appear.
	Absurd hacked in feature: Removes corrections that are the same as your entry's sentence, but not duplicates of the same correction from others)
	Removes empty 'correct' fields that overlap their icons and spacing.
	Removes unnecessary and large spacing between corrections.
	Inserts a grey background for corrections to differentiate them from your written entry.
*/

var pong = false;

function resizeAllCorrectionsWindow(){
	var allCorrectionsParent = document.getElementById("allCorrectionsPanel_c");
	var allCorrections = document.getElementById("allCorrectionsPanel");
	var heightBox = allCorrections.getElementsByClassName("bd")[0];
	if (allCorrectionsParent){
		//Resize the window
		var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],screenWidth=w.innerWidth||e.clientWidth||g.clientWidth,screenHeight=w.innerHeight||e.clientHeight||g.clientHeight;
		
		var DPR = window.devicePixelRatio; //Credit to https://stackoverflow.com/a/21737839
		if (DPR <= 0.6){
			zoomLevel = 2.4;
		} else if (DPR <= 0.8){
			zoomLevel = 2.2;
		} else if (DPR <= 1.0){
			zoomLevel = 2.0;
		} else if (DPR <= 1.21){
			zoomLevel = 1.8;
		} else if (DPR <= 1.34){
			zoomLevel = 1.6;
		} else if (DPR <= 2.0){
			zoomLevel = 1.5;
		} else {
			zoomLevel = 2.0;
		}

		//Apply our size
		allCorrections.style.width = screenWidth/zoomLevel + "px";
		heightBox.style.height = screenHeight/zoomLevel + "px";
		//ReCenter it
		var vertScroll = window.pageYOffset || document.documentElement.scrollTop;
		if (!pong){
			window.scrollBy(0, 2);
			pong = true;
		}
		else if (pong) {
			window.scrollBy(0, -2);
			pong = false;
		}
	}
}

window.onresize = resizeAllCorrectionsWindow;

document.getElementById("showAll").onclick = function showallexecuteLineThroughRemoval() {
	resizeAllCorrectionsWindow();
	var allCorrectionsParent = document.getElementById("allCorrectionsPanel_c");
	var allCorrections = document.getElementById("allCorrectionsPanel");
	var heightBox = allCorrections.getElementsByClassName("bd")[0];
	//Remove "All Corrections" line-through
	var b = allCorrections.getElementsByTagName("span");
	for (i = 0; i < b.length; ++i) {
		if (b[i].style.textDecorationLine){
			b[i].innerHTML = "";
		}
	}
	//Remove duplicate non-corrected lines from our entry, for further readability and less confusion
	//Hacked-in absurdly as Lang-8's developers didn't correctly use tags around our written text, and corrections.
	var bc = allCorrections.textContent;
	var bd = allCorrections.getElementsByClassName("correct");
	//Convert our HTMLCollection content to an array
	var arr = [];
	for (i = 0; i < bd.length; ++i){
		//Make sure to get the first element, which is our correction and not the comment with it
		arr.push(bd[i].getElementsByTagName('p')[0].textContent);
	}
	//Sort it
	var sortedArr = arr.sort();
	var tempMatchObj = {};
	var tempMatches = 0;
	//Find duplicates and add it to a key:value object, along with an int of how many of that duplicate we had
	for (i = 0; i < sortedArr.length; ++i){
		if (sortedArr[i] === sortedArr[i+1]){
			tempMatches+=1;
			tempMatchObj[sortedArr[i]] = tempMatches;
		}
		else if (sortedArr[i] != sortedArr[i-1]){
			tempMatches = 1;
			tempMatchObj[sortedArr[i]] = tempMatches;
		}
	}
	//Check this int of duplicate matches against the entirety of the html content
	//If we have more matches of the same than our corrections did, then remove the correction as that's the same sentence written by the author
	//Else, keep the correction since more than one corrector has corrected the same mistakes in the same way, creating a duplicate - which we keep for sanity.
	for(key in tempMatchObj) {
		if(tempMatchObj.hasOwnProperty(key)) {
			var innerValue = tempMatchObj[key];
			var escapedKey = key.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); // Credit to https://stackoverflow.com/a/6318729
			var toMatch = new RegExp(escapedKey, 'g');
			var outerValue  = (bc.match(toMatch)||[]).length;
			//console.log(key + "	" + "InnerValue is: " + innerValue + "	" + "OuterValue is: " + outerValue);
			if (outerValue > innerValue){
				for (i = 0; i < bd.length; ++i) {
					if (bd[i].textContent == key){
						bd[i].textContent = "-";
					}
				}
			}
		}
	}
	//Remove default NoCorrectionNecessary message
	var c = allCorrections.getElementsByClassName("corrected perfect");
	for (i = 0; i < c.length; ++i) {
		c[i].innerHTML = "";
	}
	//Remove empty 'correct' fields
	var e = allCorrections.getElementsByClassName("correct");
	for (i = 0; i < e.length; ++i) {
		if (e[i].textContent == ''){
			e[i].className = '';
		}
	}
	//Reinsert comment image next to comments since they don't always have one
	var d = allCorrections.getElementsByClassName("correction_comment");
	for (var i = d.length; i--;) {
		d[i].innerHTML = '&emsp;&emsp;<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAANlBMVEV9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX3AS/7wAAAAEXRSTlMACTReYWJmdpaf7e7v8PHy93y2WnUAAAA2SURBVHjancc3DgAgEMTAJeew//8sFKcTNVPZ8IOiO1SqBj6+ZlBNhEWxPK5MFgORd4RKVuIAotwHM1W7LmAAAAAASUVORK5CYII" />' + '&nbsp;'  + d[i].innerHTML + '<br />';
		d[i].style.backgroundColor = "#E5E5E5";
		d[i].className = " ";
		d = allCorrections.getElementsByClassName("correction_comment");
	}
	//Remove some unnecessary spacing
	var toRep = heightBox.innerHTML;
	var toRepB = toRep.replace(/<br>/g, "");
	var toRepC = toRepB.replace(/<p><\/p>/g, "");
	var toRepD = toRepC.replace(/<li class="corrected perfect"><\/li>/g, "");
	var toRepE = toRepD.replace("Title", "Title<br>");
	var toRepF = toRepE.replace("Main Body", "Main Body<br>");
	heightBox.innerHTML = toRepF;
	//Break up our corrections with a background
	var bb = allCorrections.getElementsByClassName("correction_field");
	for (i = 0; i < bb.length; ++i) {
		bb[i].style.backgroundColor = "#E5E5E5"
	}
};

window.onload = function onloadexecuteLineThroughRemoval(){
	//Remove correction posts' themselves' line-through
	var a = document.getElementsByClassName("sline");
	for (i = 0; i < a.length; ++i) {
		a[i].innerHTML='';
	}
}