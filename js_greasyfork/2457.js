// ==UserScript==
// @name        Totw20 Hotkeys and Link Open (Firefox)
// @description hotkeys and auto opens tripadvisor link
// @namespace   DCI
// @include     https://www.mturkcontent.com/dynamic/hit*
// @version     1.1
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2457/Totw20%20Hotkeys%20and%20Link%20Open%20%28Firefox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/2457/Totw20%20Hotkeys%20and%20Link%20Open%20%28Firefox%29.meta.js
// ==/UserScript==

var TargetLink = $("a:contains('Click here')")
    if (TargetLink.length){
window.open(TargetLink[0].href,'_blank');}
       

document.addEventListener( "keydown", kas, false);

var needles = new Array("view the Hotel Page");
var haystack = document.body.innerHTML;
var my_pattern, my_matches, found = "";
for (var i=0; i<needles.length; i++){
  my_pattern = eval("/" + needles[i] + "/gi");
  my_matches = haystack.match(my_pattern);
  if (my_matches){
    found += "\n" + my_matches.length + " found for " + needles[i]; 
  }
}
if (found != ""){}
else 
{{alert("Warning: totw20 userscript should be de activated when using this page.")}
}

var ev = $.Event('keypress');

function kas(i) {   
if ( i.keyCode == 65 ) { //A Key - Yes
    $('input[name="Q1"]').eq(0).click();
    $('input[id="submitButton"]').eq(0).click();
       }
 if ( i.keyCode == 70 ) { //F Key - No
   $('input[name="Q1"]').eq(1).click();
   $('input[id="submitButton"]').eq(0).click();
    }
  if ( i.keyCode == 71 ) { //G Key - Don't know
   $('input[name="Q1"]').eq(2).click();
   $('input[id="submitButton"]').eq(0).click();
    }   
   }