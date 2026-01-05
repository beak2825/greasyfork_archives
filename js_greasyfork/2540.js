// ==UserScript==
// @name       Master's Master Keys Multi/Single Layered
// @version    0.1
// @description  multilayer cat master keys
// @namespace O_o
// @author     Cristo
// @include       *
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/2540/Master%27s%20Master%20Keys%20MultiSingle%20Layered.user.js
// @updateURL https://update.greasyfork.org/scripts/2540/Master%27s%20Master%20Keys%20MultiSingle%20Layered.meta.js
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