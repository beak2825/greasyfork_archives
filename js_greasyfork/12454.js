// ==UserScript==
// @name         Essentials 2
// @namespace    http://your.homepage/
// @version      0.1
// @description  Coding for Visual Genome
// @author       InkyEB
// @match        https://www.mturkcontent.com/dynamic/hit*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12454/Essentials%202.user.js
// @updateURL https://update.greasyfork.org/scripts/12454/Essentials%202.meta.js
// ==/UserScript==

if ($("p:contains('Please mark the images if they show')").length) {
	var instructHead = $("div.panel-heading").children("strong:contains('Instructions')");
	var instructBody = instructHead.parent().next();
	instructBody.prop('id','instruct_body');
	instructHead.html("<a href='javascript:void();' id='hide_instruct'>+</a> Instructions");
	instructHead.children("a").css('color', 'white');

	$("#hide_instruct").click(function() {
		if ($("#instruct_body").is(":visible")) {
			var replaceText = $(this).text().replace("-", "+");
			$(this).text(replaceText);
			$("#instruct_body").hide();
		} else {
			var replaceText = $(this).text().replace("-", "+");
			$(this).text(replaceText);
			$("#instruct_body").show();
		}
	});
	$("#hide_instruct").click();

	$("#checkbox10").prop('checked', true);
	$("[id^='checkbox']").change(function() {
		if ($(this).prop('checked') === true) {
			if ($(this).prop('id') === 'checkbox10') {
				$("[id^='checkbox']").filter("[id!='checkbox10']").each(function (){
					$(this).prop('checked', false);
				});
			} else if ($("#checkbox10").prop('checked') === true) {
				$("#checkbox10").prop('checked', false);
			}
		}
	});
}

window.onkeydown = function(event) 
{
    if (event.keyCode === 13) //Enter Will submit.     
    { 
        $("input[class='btn btn-primary']" ).click();
    
    }
};