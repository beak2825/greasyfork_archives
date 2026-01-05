// ==UserScript==
// @name       Snagajob Highlighter
// @version    0.4
// @author     Cristo
// @description  Mturk Highlights key words and adds hotkey, click ? for key list
// @include      *
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/1491/Snagajob%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/1491/Snagajob%20Highlighter.meta.js
// ==/UserScript==

var page = document.getElementById("mturk_form");
var pageText = page.getElementsByTagName("p")[3];
var raw = page.getElementsByTagName("p")[5];
var inText = raw.innerHTML;
var done = inText.split("\"")[1];
var done2 = done.replace(/[^\w\s]/gi, ' ');
var keyArr = done2.split(" ");
var inerText = pageText.innerHTML;
var yRadio = page.getElementsByTagName("input")[1];
var nRadio = page.getElementsByTagName("input")[2];
var sub = page.getElementsByTagName("input")[3];
var cI = 0;


page.tabIndex = "0";
page.focus();


while (cI < keyArr.length) {
	var base = new RegExp(keyArr[cI],"g" + "i");
	var chk = (inerText.match(base) || []).length;
		if (chk >= 0 && chk < 10) {
			var reText = '<mark style="background-color:red;">' + keyArr[cI] + '</mark>';
			pageText.innerHTML = pageText.innerHTML.replace(base, reText);
			cI++;
		}else {
			cI++;
		}
}

document.addEventListener( "keydown", kas, false);
function kas(i) {
if (i.keyCode == 65) { //A Key - Fills Yes
       yRadio.checked = true;
	}
if (i.keyCode == 68) { //D Key - Fills No
       nRadio.checked = true;
	}
if (i.keyCode == 87) { //W Key - Submit
		sub.click();
	}
    if (i.keyCode== 191) { //? Key - Shows Keys
    	alert("A Key - Yes\nD Key - No\nW Key - Submit"); 
    }
}