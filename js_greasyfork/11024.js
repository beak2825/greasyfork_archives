// ==UserScript==
// @name        [.01 EyeEm Inc]Flag images - Select the tags that are not relevant to this image.
// @author robert
// @namespace   https://greasyfork.org/en/users/13168-robert
// @description 0-6 to click checkboxes, hide instructions. 0 key functionality working not working for everyone.
// @include     https://www.mturkcontent.com/dynamic/hit*
// @version     1.1
// @grant       none
// @require  http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/11024/%5B01%20EyeEm%20Inc%5DFlag%20images%20-%20Select%20the%20tags%20that%20are%20not%20relevant%20to%20this%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/11024/%5B01%20EyeEm%20Inc%5DFlag%20images%20-%20Select%20the%20tags%20that%20are%20not%20relevant%20to%20this%20image.meta.js
// ==/UserScript==

// Based heavily on Kadauchi's Nova Compare two products
// https://greasyfork.org/en/scripts/10843-nova-compare-two-products/code

// true if you want to hide the instructions
var hideInstructions=true;

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
if ( $("p:contains('Unselect all the tags that are not appropriate for the given image')").length )
{
	  var cb1 = document.getElementById('checkbox1');
		//var cb1 = $("input[id='checkbox1']");
		var cb2 = $("input[id='checkbox2']");
		var cb3 = $("input[id='checkbox3']");
		var cb4 = $("input[id='checkbox4']");
		var cb5 = $("input[id='checkbox5']");
		var cb6 = $("input[id='checkbox6']");
    cb4.focus();
	
    window.onkeydown = function(e)
    {
			if (e.keyCode === 97 || e.keyCode === 49) //1 
				cb4.click();
			if (e.keyCode === 98 || e.keyCode === 50) //2
				cb5.click();
			if (e.keyCode === 99 || e.keyCode === 51) //3 
				cb6.click();
			if (e.keyCode === 100 || e.keyCode === 52) //4
				cb1.click();
			if (e.keyCode === 101 || e.keyCode === 53) //5 
				cb2.click();
			if (e.keyCode === 102 || e.keyCode === 54) //6
				cb3.click();			
			if (e.keyCode === 96 || e.keyCode === 48) //0
			{
				if ($(cb1).is(":checked")||$(cb2).is(":checked")||$(cb3).is(":checked")
						||$(cb4).is(":checked")||$(cb5).is(":checked")||$(cb6).is(":checked"))
				{
					cb1.prop("checked", false);
					cb2.prop("checked", false);
					cb3.prop("checked", false);
					cb4.prop("checked", false);
					cb5.prop("checked", false);
					cb6.prop("checked", false);            
				}
				else
				{
					cb1.prop("checked", true);
					cb2.prop("checked", true);
					cb3.prop("checked", true);
					cb4.prop("checked", true);
					cb5.prop("checked", true);
					cb6.prop("checked", true);
				}
			}     
			if (e.keyCode === 13 ) //enter
				$("input[id='submitButton']" ).click();
    };
}