// ==UserScript==
// @name       Collins Non Quals
// @version    0.3
// @description  Mturk collins multiple copy/paste
// @description  Collins latest single
// @author     Cristo
// @include       *
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/1589/Collins%20Non%20Quals.user.js
// @updateURL https://update.greasyfork.org/scripts/1589/Collins%20Non%20Quals.meta.js
// ==/UserScript==


//Highlight what you want to copy and press the key.
//Q copies title
//W copies artist
//E copies date
//R copies site you're on, no need to highlight

//A fills all saved data 
//F submits

if ( document.getElementById("mturk_form") ) {
	var page = document.getElementById("mturk_form");
	var textBase = page.getElementsByTagName("li")[0];
	var termLoc = textBase.getElementsByTagName("strong")[0];
	var term = termLoc.innerHTML;
	var searchLink = '<a href="http://www.google.com/search?q=' + term + '"' + 'target="_blank">' + term + '</a>'; //format for link that opens in new tab
	termLoc.innerHTML = termLoc.innerHTML.replace(term, searchLink);

	var fBox = document.getElementById("title");
	var aBox = document.getElementById("creator");
	var yBox = document.getElementById("date");
	var lBox = document.getElementById("url");
    var sub = document.getElementById("submitButton");

}
	document.addEventListener( "keydown", kas, false);
		function kas(i) {
			if ( i.keyCode == 65 ) { //A fills title  
     			fBox.setAttribute( "value", GM_getValue("fb") );
                aBox.setAttribute( "value", GM_getValue("ab") );
                yBox.setAttribute( "value", GM_getValue("yb") );
                lBox.setAttribute( "value", GM_getValue("lb") );
				}
            if ( i.keyCode == 70 ) { //F Submit
            	sub.click();
            }
			if ( i.keyCode == 81 ) { //Q copies title
 				ffb();
			}    
			if ( i.keyCode == 87 ) { //W copies artist
            	fab();
			} 
			if ( i.keyCode == 69 ) { //E copies date
            	fyb() ;
			}   
        	 if ( i.keyCode == 82 ) { //R copies site
            	flb() ;
			}
	}

function ffb() {
	var box1 = window.getSelection().toString();
	GM_setValue( "fb", box1 );  
	} 
function fab() {
	var box2 = window.getSelection().toString();
	GM_setValue( "ab", box2 );  
	}
function fyb() {
	var box3 = window.getSelection().toString();
	GM_setValue( "yb", box3 );  
	}
function flb() {
	var box4 = document.URL.toString();
	GM_setValue( "lb", box4 );  
	}