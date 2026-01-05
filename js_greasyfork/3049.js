// ==UserScript==
// @name       Amazon Requester Inc Multiple 
// @version    0.1
// @description  Keys A,S,D,Z,X,C to mark choices top to bottom and W Key to submit.
// @author     Cristo
// @include    https://www.mturkcontent.com/dynamic*
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/3049/Amazon%20Requester%20Inc%20Multiple.user.js
// @updateURL https://update.greasyfork.org/scripts/3049/Amazon%20Requester%20Inc%20Multiple.meta.js
// ==/UserScript==

var cI = 0;
var page = document.getElementById("mturk_form"); 
var table = page.getElementsByClassName("optionsTable");
var radio = table[cI].getElementsByClassName("nodeLeaf");
var sub = document.getElementById("submitBtn");

page.tabIndex = 0;
page.focus();
table[cI].scrollIntoView(false);

function moveGrove(){
	cI++;
    radio = table[cI].getElementsByTagName("input");
    table[cI].scrollIntoView(false);
   
}
document.addEventListener( "keydown", kas, false);
		function kas(i) {
			if (i.keyCode == 65) { //A   
                radio[0].click();
                moveGrove();
			}    
			if (i.keyCode == 83) { //S 
                radio[1].click();
                moveGrove();
			}    
			if (i.keyCode == 68) { //D  
                radio[2].click();
                moveGrove();
			}
            if (i.keyCode == 90) { //Z  
                radio[3].click();
                moveGrove();
			} 
            if (i.keyCode == 88) { //X  
                radio[4].click();
                moveGrove();
			} 
            if (i.keyCode == 67) { //C  
                radio[5].click();
                moveGrove();
			}  
			if (i.keyCode == 87) { //W  
                sub.click();
			} 
        }