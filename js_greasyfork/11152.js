// ==UserScript==
// @name            [.01 Nova] Flag images - Undesirable content
// @author          robert
// @namespace       https://greasyfork.org/en/users/13168-robert
// @include         https://www.mturkcontent.com/dynamic/hit*
// @description:en  1-9 to select images, 0 to select none of the above. Hide instructions and autosubmit optional. Works best with 10-key.
// @version         1.2
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant           none
// @description 1-9 to select images, 0 to select none of the above. Hide instructions and autosubmit optional.
// @downloadURL https://update.greasyfork.org/scripts/11152/%5B01%20Nova%5D%20Flag%20images%20-%20Undesirable%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/11152/%5B01%20Nova%5D%20Flag%20images%20-%20Undesirable%20content.meta.js
// ==/UserScript==

// Based heavily on Kadauchi's Nova Compare two products
// https://greasyfork.org/en/scripts/10843-nova-compare-two-products/code
// THANK YOU to kadauchi and ikarma for getting this to work 

var hideInstructions=true;
var autoSubmit=false;

//if ($("p:contains('Please mark the images')").length)
  if ($("p:contains('Please mark the images')").length)
  runScript();

function runScript()
{
  if (hideInstructions)
  { 
      $(".panel-body").hide();
      $(".panel-heading").click
      (
          function() 
          {    
              $(".panel-body").toggle();
          }
      );
  }
  var cb1 = document.getElementById('checkbox1');
	var cb2 = document.getElementById('checkbox2');
	var cb3 = document.getElementById('checkbox3');
	var cb4 = document.getElementById('checkbox4');
	var cb5 = document.getElementById('checkbox5');		
	var cb6 = document.getElementById('checkbox6');
	var cb7 = document.getElementById('checkbox7');
	var cb8 = document.getElementById('checkbox8');
	var cb9 = document.getElementById('checkbox9');
	var cb10 = document.getElementById('checkbox10'); //none of the above
  cb4.focus();

  window.onkeydown = function(e)
  {
    if (e.keyCode === 97 || e.keyCode === 49) //1 key 
      cb7.click();
    if (e.keyCode === 98 || e.keyCode === 50) //2 key
      cb8.click();
    if (e.keyCode === 99 || e.keyCode === 51) //3 key
      cb9.click();
    if (e.keyCode === 100 || e.keyCode === 52) //4 key
      cb4.click();
    if (e.keyCode === 101 || e.keyCode === 53) //5 key
      cb5.click();
    if (e.keyCode === 102 || e.keyCode === 54) //6 key
      cb6.click();		
		if (e.keyCode === 103 || e.keyCode === 55) //7 key
      cb1.click();
    if (e.keyCode === 104 || e.keyCode === 56) //8 key
      cb2.click();
    if (e.keyCode === 105 || e.keyCode === 57) //9 key
      cb3.click();	
    if (e.keyCode === 96 || e.keyCode === 58) //0
    {
      cb10.click();
			if(autoSubmit)
				$("input[id='submitButton']" ).click();
    }     
    if (e.keyCode === 13 ) //enter
      $("input[id='submitButton']" ).click();
  };
} //end runscript ()
