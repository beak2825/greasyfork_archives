// ==UserScript==
// @name       Master's Master Keys
// @version    0.1
// @description  cat master keys
// @author     Cristo
// @match      https://www.mturkcontent.com/dynamic/hit*
// @match      https://s3.amazonaws.com/mturk_bulk/hits/*
// @copyright  2012+, You
// @namespace O_o
// @downloadURL https://update.greasyfork.org/scripts/2539/Master%27s%20Master%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/2539/Master%27s%20Master%20Keys.meta.js
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
			if ( i.keyCode == 81 ) { //Q  
                pick[5].click();
                document.getElementById( "submit_button" ).click();
			} 
			if ( i.keyCode == 87 ) { //W 
                pick[6].click();
                document.getElementById( "submit_button" ).click();
			}    
        }