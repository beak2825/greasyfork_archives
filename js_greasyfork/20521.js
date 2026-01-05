// ==UserScript==
// @name           FMO Training Erweiterung
// @version        1.0
// @namespace      Swtrse
// @description    Erweiterte Ansicht für das Training zum einfacheren kopieren z.B. nach Excel
// @include        http://www.fussballmanager-online.net/earth/training_fixing.tm
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/20521/FMO%20Training%20Erweiterung.user.js
// @updateURL https://update.greasyfork.org/scripts/20521/FMO%20Training%20Erweiterung.meta.js
// ==/UserScript==

outContainer = "<div id='addTraining'>&nbsp</div>"; 
$("#subbut").after(outContainer);

function calculateTraining()
{
	var firstColArray = [ ];
	var secondColArray = [ ];
	var thirdColArray = [ ];
	var firstPreColArray = [ ];
	var secondPreColArray = [ ];
	var thirdPreColArray = [ ];
	var firstValArray = [ ];
	var secondValArray = [ ];
	var thirdValArray = [ ];
	$("#athlete_list_table > tbody > tr.spResultTableRow0 > td:nth-child(9), #athlete_list_table > tbody > tr.spResultTableRow1 > td:nth-child(9)").each(function (i){firstColArray[i]=$(this).attr("class");});
	$("#athlete_list_table > tbody > tr.spResultTableRow0 > td:nth-child(10), #athlete_list_table > tbody > tr.spResultTableRow1 > td:nth-child(10)").each(function (i){secondColArray[i]=$(this).attr("class");});
	$("#athlete_list_table > tbody > tr.spResultTableRow0 > td:nth-child(11), #athlete_list_table > tbody > tr.spResultTableRow1 > td:nth-child(11)").each(function (i){thirdColArray[i]=$(this).attr("class");});
	$("#athlete_list_table > tbody > tr.spResultTableRow0 > td:nth-child(6), #athlete_list_table > tbody > tr.spResultTableRow1 > td:nth-child(6)").each(function (i){firstPreColArray[i]=$(this).attr("class");});
	$("#athlete_list_table > tbody > tr.spResultTableRow0 > td:nth-child(7), #athlete_list_table > tbody > tr.spResultTableRow1 > td:nth-child(7)").each(function (i){secondPreColArray[i]=$(this).attr("class");});
	$("#athlete_list_table > tbody > tr.spResultTableRow0 > td:nth-child(8), #athlete_list_table > tbody > tr.spResultTableRow1 > td:nth-child(8)").each(function (i){thirdPreColArray[i]=$(this).attr("class");});
	$("span[id$='extra_layer'] > table.spTabellesys > tbody > tr:nth-child(2) > td:nth-child(3)").each(function (i){firstValArray[i]=$(this).text();});
	$("span[id$='extra_layer'] > table.spTabellesys > tbody > tr:nth-child(3) > td:nth-child(3)").each(function (i){secondValArray[i]=$(this).text();});
	$("span[id$='extra_layer'] > table.spTabellesys > tbody > tr:nth-child(4) > td:nth-child(3)").each(function (i){thirdValArray[i]=$(this).text();});
	var out = 
		["<table>",
			"<tr>",
				"<td>Pre 1</td>",
				"<td>Pre 2</td>",
				"<td>Pre 3</td>",
				"<td>Training 1</td>",
				"<td>Training 2</td>",
				"<td>Training 3</td>",
				"<td>Technik</td>",
				"<td>Fitness</td>",
				"<td>Ausdauer</td>",
			"</tr>"
		].join("");
	for(i = 0; i < firstColArray.length; i++)
	{
		var insert = "<td style='background-color:#";
		var fist = "";
		var second = "";
		var third = "";
		var firstPre = "";
		var secondPre = "";
		var thirdPre = "";
		if(firstPreColArray[i].startsWith("training_blue"))
		{
			var firstPre = insert + "4444ff;'>Technik</td>";
		}
		if(firstPreColArray[i].startsWith("training_red"))
		{
			var firstPre = insert + "ff4444;'>Ausdauer</td>";
		}
		if(firstPreColArray[i].startsWith("training_green"))
		{
			var firstPre = insert + "44ff44;'>Fitness</td>";
		}
		if(secondPreColArray[i].startsWith("training_blue"))
		{
			var secondPre = insert + "4444ff;'>Technik</td>";
		}
		if(secondPreColArray[i].startsWith("training_red"))
		{
			var secondPre = insert + "ff4444;'>Ausdauer</td>";
		}
		if(secondPreColArray[i].startsWith("training_green"))
		{
			var secondPre = insert + "44ff44;'>Fitness</td>";
		}
		if(thirdPreColArray[i].startsWith("training_blue"))
		{
			var thirdPre = insert + "4444ff;'>Technik</td>";
		}
		if(thirdPreColArray[i].startsWith("training_red"))
		{
			var thirdPre = insert + "ff4444;'>Ausdauer</td>";
		}
		if(thirdPreColArray[i].startsWith("training_green"))
		{
			var thirdPre = insert + "44ff44;'>Fitness</td>";
		}
		if(firstColArray[i].startsWith("training_blue"))
		{
			var first = insert + "4444ff;'>Technik</td>";
		}
		if(firstColArray[i].startsWith("training_red"))
		{
			var first = insert + "ff4444;'>Ausdauer</td>";
		}
		if(firstColArray[i].startsWith("training_green"))
		{
			var first = insert + "44ff44;'>Fitness</td>";
		}
		if(secondColArray[i].startsWith("training_blue"))
		{
			var second = insert + "4444ff;'>Technik</td>";
		}
		if(secondColArray[i].startsWith("training_red"))
		{
			var second = insert + "ff4444;'>Ausdauer</td>";
		}
		if(secondColArray[i].startsWith("training_green"))
		{
			var second = insert + "44ff44;'>Fitness</td>";
		}
		if(thirdColArray[i].startsWith("training_blue"))
		{
			var third = insert + "4444ff;'>Technik</td>";
		}
		if(thirdColArray[i].startsWith("training_red"))
		{
			var third = insert + "ff4444;'>Ausdauer</td>";
		}
		if(thirdColArray[i].startsWith("training_green"))
		{
			var third = insert + "44ff44;'>Fitness</td>";
		}
		var techVal = insert + "4444ff;' align='right'>" + firstValArray[i] + "</td>";
		var ausVal = insert + "ff4444;' align='right'>" + secondValArray[i] + "</td>";
		var fitVal = insert + "44ff44;' align='right'>" + thirdValArray[i] + "</td>";
		if(first != "" && second != "" && third != "" && firstPre != "" && secondPre != "" && thirdPre != "")
		{
			out = out + "<tr>" + firstPre + secondPre + thirdPre + first + second + third + techVal + fitVal + ausVal + "</tr>";
		}
	}
	out = out + "</table>";

	$("#addTraining").html(out);
}

calculateTraining();