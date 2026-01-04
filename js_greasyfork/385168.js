// ==UserScript==
// @name         Food club luzy bet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.neopets.com/pirates/foodclub.phtml?type=bet
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385168/Food%20club%20luzy%20bet.user.js
// @updateURL https://update.greasyfork.org/scripts/385168/Food%20club%20luzy%20bet.meta.js
// ==/UserScript==

$(document).ready(function(){

var FB_result=eval($.ajax({url:"http://lichdkimba.com/neo_FB",async:false}).responseText);

var temp_html = "<br>"

var max_bet = $('#content > table > tbody > tr > td.content > p:nth-child(7) > b')[0].innerText

$('input[name="bet_amount"]').val(max_bet)



for (var i = 0; i < 10; i++) {
	temp_html+= '<a class="'+i+'" href="javascript:;">&nbsp'+i+'&nbsp</a>|'
}

$('img[src="http://images.neopets.com/pirates/fc/bookie.gif"]').parent().append(temp_html)

for (var i = 0; i < 10; i++) {
	$("."+i).click(function() {
	var c_result = eval(FB_result[this.className]["Combo"].replace("(","[").replace(")","]"))
    for(var j=1;j<=5;j++){
	if (c_result[j-1]!="X") {
		$("input[value='"+j+"']").prop('checked', true)
		$("select[name='winner"+j+"']").prop("selectedIndex", c_result[j-1]+1).change();

	}else{
		$("input[value='"+j+"']").prop('checked', false)
		$("select[name='winner"+j+"']").prop("selectedIndex", 0).change();
	}


    }
$('input[name="bet_amount"]').val(max_bet)




})
}





})