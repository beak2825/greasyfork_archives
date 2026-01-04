// ==UserScript==
// @name         LoversLab Download All
// @namespace    N/A
// @version      0.2
// @description  Adds a download all button to loverslab
// @author       ImNotJackie
// @match        https://www.loverslab.com/*?do=download
// @icon         https://www.google.com/s2/favicons?sz=64&domain=loverslab.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445155/LoversLab%20Download%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/445155/LoversLab%20Download%20All.meta.js
// ==/UserScript==

(function() {
    'use strict';

var newRow = document.getElementsByClassName("ipsDataItem")[0].cloneNode(true);
var amount = document.querySelector("#ipsLayout_mainArea > div:nth-child(2) > div > p").innerHTML.toString();
var size = document.getElementsByClassName("ipsType_reset ipsDataItem_meta");
var num = 0;
for(i = 1; i < size.length; i++){
    var test = size[i].textContent.toString().replace("\n                       ","");
	test.substring(0, test.indexOf("\n") - 3);
	var temp = parseFloat(test.substring(0, 5));
	if(test.includes("kB") == true){
	temp = temp / 10000;
	}
	if(test.includes("MB") == true){
		temp = temp / 1000;
	}
	num = num + temp;
}
num = Math.round(num * 100) / 100
newRow.firstElementChild.children[1].textContent = "\n                       " + num + " GB Estimated";
newRow.firstElementChild.firstElementChild.firstElementChild.textContent = "Download all " + amount;
newRow.lastElementChild.className = "downloadAll";
newRow.lastElementChild.lastElementChild.removeAttribute("href");
    function downloadAll (zEvent) {
    var buttons = document.getElementsByClassName("ipsButton ipsButton_primary ipsButton_small");
for(i = 1; i < buttons.length; i++){
    (function(i){
        setTimeout(function(){
            buttons[i].click();
        }, 1000 * i);
    }(i));
}
}

var myDiv = newRow.lastElementChild.lastElementChild;
if (myDiv) {
    myDiv.addEventListener ("click", downloadAll , false);
}
document.querySelector("#ipsLayout_mainArea > div:nth-child(2) > div > ul").insertBefore(newRow, document.querySelector("#ipsLayout_mainArea > div:nth-child(2) > div > ul").firstChild);
})();