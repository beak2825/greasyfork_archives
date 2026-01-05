// ==UserScript==
// @name        [.01 Vale]Click on the described object
// @author robert
// @namespace   https://greasyfork.org/en/users/13168-robert
// @description 1-3 to select radio buttons,` to submit, hide instructions
// @include     https://www.mturkcontent.com/dynamic/hit*
// @version     1.1
// @grant       none
// @require  http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/11054/%5B01%20Vale%5DClick%20on%20the%20described%20object.user.js
// @updateURL https://update.greasyfork.org/scripts/11054/%5B01%20Vale%5DClick%20on%20the%20described%20object.meta.js
// ==/UserScript==
var autosubmit = false;
var hideInstructions = true;

if(hideInstructions)
{
	$("h2:contains('Instructions')").hide();
	$("h2:contains('Task')").hide();
	$("h3:contains('Examples:')").hide();
	$("img[class='imagecontainer']").hide();
	$("ul:contains('Please click anywhere inside')").hide();
	/* I don't know if this works
	var prompt = $("p:contains('Please click on the following object:')");
	var whatToFind = prompt.text().replace("Please click on the following object:", "");
	alert(whatToFind);
	prompt.html('<b>' + whatToFind + '</b>');
	*/
}
if ( $("p:contains('Please click on the following object:')").length )  
{
	$("input:radio[id='Confident']").focus();
  if(autosubmit)
  	$("input[id='submitButton']").autocomplete = 'on';
	window.onkeydown = function(e)
	{
		if (e.keyCode === 97 || e.keyCode === 49) //1 
		{
			$("input:radio[id='Confident']").click();
				if (autosubmit)
					  $("input[id='submitButton']").click();
		}
		if (e.keyCode === 98 || e.keyCode === 50) //2
		{  
			$("input:radio[id='MultiObj']").click();
				if (autosubmit) 
					  $("input[id='submitButton']" ).click();
		}
		if (e.keyCode === 99 || e.keyCode === 51) //3 
		{   
			$("input:radio[id='NoObj']").click(); 
				if (autosubmit) 
					  $("input[id='submitButton']" ).click();
		}
		if (e.keyCode ===  192 ) //`
				$("input[id='submitButton']").click();

	};
}
// i suspect you need to get rid of the disabled attribute(?) from "submitButton" to get autosubmit to work
//<input id="submitButton" type="submit" value="complete the task before you can submit" disabled="" autocomplete="off">
//<input id="submitButton" type="submit" value="submit" autocomplete="off">