// ==UserScript==
// @name        SET Master Keys
// @description Hot keys for Set Master web page and video HITs.
// @namespace   DCI
// @include     https://www.mturkcontent.com/dynamic/hit*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2568/SET%20Master%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/2568/SET%20Master%20Keys.meta.js
// ==/UserScript==

var $j = jQuery.noConflict(true);

document.addEventListener( "keydown", kas, false);

var needles = new Array("does this webpage contain","Does this web page contain","Does this video collage", "Is this video collage","are these images");
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
{{alert("Warning: SET Master userscript should be de activated when using this page.")}
}

function kas(i) {
     if ( i.keyCode == 65 ) { //A Key - Yes
     $j('input[name="answer"]').eq(0).click();
     $j('input[id="submitButton"]').eq(0).click(); 
     }    
     if ( i.keyCode == 70 ) { //F Key - No
   $j('input[name="answer"]').eq(1).click();
   $j('input[id="submitButton"]').eq(0).click();       
     }
}