// ==UserScript==
// @name       Mturk Multi Layer Master Cats
// @version    0.1
// @description  Keys A,S,D,F,G assigned to choices top to bottom, Key E to submit.
// @author     Cristo
// @include       *
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/2363/Mturk%20Multi%20Layer%20Master%20Cats.user.js
// @updateURL https://update.greasyfork.org/scripts/2363/Mturk%20Multi%20Layer%20Master%20Cats.meta.js
// ==/UserScript==

var cE = 0;
var page = document.getElementById("wrapper");
var host = page.getElementsByTagName("ul")[cE];
var pick = host.getElementsByTagName("div");


page.tabIndex = "0";
page.focus();

function next() {
	cE++;
    host = page.getElementsByTagName("ul")[cE];
    pick = host.getElementsByTagName("div");
}


document.addEventListener( "keydown", kas, false);
		function kas(i) {
			if ( i.keyCode == 65 ) { //A   
                pick[0].click();
                next();
			}    
			if ( i.keyCode == 83 ) { //S 
                pick[1].click();
                next();
			}    
			if ( i.keyCode == 68 ) { //D  
                pick[2].click();
                next();
			}    
			if ( i.keyCode == 70 ) { //F  
                pick[3].click();
                next();
			} 
			if ( i.keyCode == 71 ) { //G 
                pick[4].click();
                next();
			}
            if ( i.keyCode == 69 ) { //E Key - 
    			document.getElementById( "submit_button" ).click();
    		}   
			
        }