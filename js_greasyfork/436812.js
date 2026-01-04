   


// ==UserScript==
// @name        Search lands loop
// @namespace   Nihar
// @description  Search lands loop - banglarbhumi
// @include     *banglarbhumi.gov.in/BanglarBhumi/KnowYourProperty.action*
// @version     0.1 Beta
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436812/Search%20lands%20loop.user.js
// @updateURL https://update.greasyfork.org/scripts/436812/Search%20lands%20loop.meta.js
// ==/UserScript==

var s=1;var end=10;
function myLoop(){
setTimeout(function() {                   
var x=document.getElementById('captchaText').value;
$('#txtKhatian1').val(s);
$('#drawText1').val(x.split(' ').join(''));
console.log($('#khdetails table:eq(0) table:eq(0)').text());
s++;
if (s <=end) {  
	 $('#khbutton').click();        
      myLoop();         
    } 
	
  }, 5000)
}
myLoop();