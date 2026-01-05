// ==UserScript==
// @name       Mturk Single Layer Master Cats
// @version    0.1
// @description  Keys A,S,D,F,G assigned to choices top to bottom. 
// @author     Cristo
// @include       *
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/4371/Mturk%20Single%20Layer%20Master%20Cats.user.js
// @updateURL https://update.greasyfork.org/scripts/4371/Mturk%20Single%20Layer%20Master%20Cats.meta.js
// ==/UserScript==

var pick = document.getElementsByClassName("choice-button btn ng-binding choice");

var page = document.getElementById("wrapper");
page.tabIndex = "0";
page.focus();

document.addEventListener( "keydown", kas, false);
		function kas(i) {
			if ( i.keyCode == 65 ) { //A   
                pick[0].click();
                document.getElementById( "submit_button" ).click();
			}    
			if ( i.keyCode == 83 ) { //S 
                pick[1].click();
                document.getElementById( "submit_button" ).click();
			}    
			if ( i.keyCode == 68 ) { //D  
                pick[2].click();
                document.getElementById( "submit_button" ).click();
			}    
			if ( i.keyCode == 70 ) { //F  
                pick[3].click();
                document.getElementById( "submit_button" ).click();
			} 
			if ( i.keyCode == 71 ) { //G 
                pick[4].click();
                document.getElementById( "submit_button" ).click();
			}
            
			
        }