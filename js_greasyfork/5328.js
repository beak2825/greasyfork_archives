// ==UserScript==
// @name           eSim Damage Calculator Mini
// @version        0.61
// @namespace      localhost
// @author         Heff (modified by cryst216 and calin)
// @description    A small tool to calculate potential damage of a player when viewing their profile.
// @match          http://*.e-sim.org/profile.html?id=*
// @icon           http://e-sim.home.pl/eworld/img/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/5328/eSim%20Damage%20Calculator%20Mini.user.js
// @updateURL https://update.greasyfork.org/scripts/5328/eSim%20Damage%20Calculator%20Mini.meta.js
// ==/UserScript==

function addJQuery(callback) {
	var script = document.createElement("script");
	script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "(" + callback.toString() + ")();";
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
}

function main() {
	{ //design
	var des = ' \
<div id="dmgCalc" class="testDivwhite" style="height: 160px; width: 480px;">\
	<table style="font-size:12px"><tr><td>\
	<table style="width:100%"> <tr>\
		<td><b>Weapon:</b> </td>\
		<td><b>Region Building:</b> </td>\
		<td><b>Food:</b> </td>\
		<td><b>Gift:</b> </td>\
		<td><b>Health:</b> </td>\
		</tr>\
		<tr>\
		<td>\
			<select id="weaponQ" style="height:18px; padding:2px; font-size:12px">\
				<option value="0.5">None</option>\
				<option value="1.2" selected="selected">Q1</option>\
				<option value="1.4">Q2</option>\
				<option value="1.6">Q3</option>\
				<option value="1.8">Q4</option>\
				<option value="2.0">Q5</option>\
			</select>\
		</td>\
		<td>\
			<select id="buildingType" style="height:18px; padding:2px; font-size:12px">\
				<option value="1">None</option>\
				<option value="2">DS</option>\
				<option value="3">Hosp.</option>\
			</select>\
			<select id="buildingQ" style="height:18px; padding:2px; font-size:12px">\
				<option value="0"></option>\
				<option value="1">Q1</option>\
				<option value="2">Q2</option>\
				<option value="3">Q3</option>\
				<option value="4">Q4</option>\
				<option value="5">Q5</option>\
			</select>\
		</td>\
		<td>\
			<input type="number" min="0" id="foodNum" value="15" style="position:relative; height:18px; top:-5px; max-width:36px; padding:2px; font-size:12px">\
		</td>\
		<td>\
			<input type="number" min="0" id="giftNum" value="15" style="position:relative; height:18px; top:-5px; max-width:36px; padding:2px; font-size:12px">\
		</td>\
		<td>\
			<input type="number" min="0" max="100" step="10" id="healthNum" value="100" style="position:relative; height:18px; top:-5px; max-width:40px; padding:2px; font-size:12px">\
		</td>\
	</tr> </table>\
	<table style="white-space:nowrap; width:100%"> <tr>\
		<td><div class="statsLabel smallStatsLabel greenLabel" style="width:100%" title="Bunker / Sewer guide Buff">\
			<b>Core:</b><input type="checkbox" id="swrbunkBonus" value="1.25">\
		</div> </td>\
		<td><div class="statsLabel smallStatsLabel greenLabel" style="width:100%" title="Tank Buff">\
			<b>Tank:</b><input type="checkbox" id="tankBonus" value="1.2">\
		</div> </td>\
		<td><div class="statsLabel smallStatsLabel greenLabel" style="width:100%" title="Steroid Buff">\
			<b>Steroid:</b><input type="checkbox" id="steroidBonus" value="1.2">\
		</div> </td>\
		<td><div class="statsLabel smallStatsLabel greenLabel" style="width:100%" title="Location region Buff">\
			<b>Region:</b><input type="checkbox" id="regionBonus" value="1.2" checked="checked">\
		</div> </td>\
		<td><div class="statsLabel smallStatsLabel greenLabel" style="width:100%" title="Military unit order Buff">\
			<b>MU:</b><input type="checkbox" id="muBonus" value="1" checked="checked">\
		</div> </td>\
	</tr>\
	<tr>\
		<td><div class="statsLabel smallStatsLabel redLabel" style="width:100%" title="Bunker / Sewer guide Debuff">\
			<b>Core:</b><input type="checkbox" id="swrbunkDebuff" value="0.8">\
		</div> </td>\
		<td><div class="statsLabel smallStatsLabel redLabel" style="width:100%" title="Tank Debuff">\
			<b>Tank:</b><input type="checkbox" id="tankDebuff" value="1">\
		</div> </td>\
		<td><div class="statsLabel smallStatsLabel redLabel" style="width:100%" title="Steroid Debuff">\
			<b>Steroid:</b><input type="checkbox" id="steroidDebuff" value="0.8">\
		</div> </td>\
		<td colspan="2"><div class="statsLabel smallStatsLabel redLabel" style="width:100%" title="Surrounded Debuff - If no route to core regions.">\
			<b>Surrounded:</b><input type="checkbox" id="surroundDebuff" value="0.8">\
		</div> </td>\
	</tr> \
	<tr>\
		<td><div class="statsLabel smallStatsLabel greenLabel" style="width:100%" title="Pain Dealer Buff - Doubles the Critical hit chance.">\
			<b>Pain:</b><input type="checkbox" id="painDealerBonus" value="2">\
		</div> </td>\
		<td colspan="4"><div id="muOrder" class="statsLabel smallStatsLabel blueLabel" style="width:100%; position:relative; margin:0px auto">Loading...</div> </td>\
	</tr> </table>\
	</td><td>\
	<div>\
		<b>Est. Berserk</b>\
		<br>\
		<div class="help equipmentBlueBox" style="position:relative; width:106px">\
			<b id="estBerserkMin">0</b> / <b id="estBerserkMax">0</b>\
		</div>\
	</div>\
	<div>\
		<b>Est. DMG.</b> (<b id="estTimes">0</b><img style="width:13px; height:13px;" src="http://e-sim.home.pl/testura/img/productIcons/Weapon.png">) \
		<br>\
		<div class="help equipmentBlueBox" style="position:relative; width:106px">\
			<b id="estTotal">0</b>\
		</div>\
	</div>\
	<div>\
		<b>Today DMG.</b> (<b id="percentage">0</b>%) \
		<br>\
		<div class="help equipmentBlueBox" style="position:relative; width:106px">\
			<b id="dmgToday">0</b>\
		</div>\
	</div>\
	</td> </tr> </table>\
</div>\
'; 
	}

	$.fn.exists = function () {return (this.length !== 0);}
	$("#profileEquipmentNew").parent().css({"height":"410px"}).append(des);
	
	var dmgToday = 0;
	var totalDamage = 1;
	
	var minDmg = parseInt($('#hitHelp b:first').text().replace(',',''));
	var maxDmg = parseInt($('#hitHelp b:last').text().replace(',',''));
	
	var crit = $('#criticalHelp').text();
	crit = parseFloat(crit.replace('%','')) / 100.0;
	
	var miss = $('#missHelp').text();
	miss = parseFloat(miss.replace('%','')) / 100.0;
	
	var avoid = $('#avoidHelp').text();
	avoid = parseFloat(avoid.replace('%','')) / 100.0;
	
	var jsonDmg=  $.getJSON("apiCitizenById.html?id="+findUrlObj().id).done(function (data){
		dmgToday = data.damageToday;
		$("#dmgToday").html(formatNumber(dmgToday));
		$("#percentage").html(Math.round(dmgToday*100/totalDamage));
		calc();
	});
	
	var muValue = 1.2;
	if($('.testDivblue > a[href^="militaryUnit.html?id="]').exists()) {
		var muID = $('.testDivblue > a[href^="militaryUnit.html?id="]:first').attr('href').split('?id=').pop();
		var json = $.getJSON("apiMilitaryUnitById.html?id="+muID).done(function (data) {
			switch(data.militaryUnitType) {
				case "Novice": muValue = 1.05; break;
				case "Regular": muValue = 1.1; break;
				case "Veteran": muValue = 1.15; break;
				case "Elite": muValue = 1.2; break;
			}
			calc();
		});
		setTimeout(function(){order(muID)},200);
	} else {
		$("#muOrder").html("No military unit.");
		$("#muBonus").attr("checked", false);
	    muValue = 1.0;
	}
	function order(muID) {
		$.ajax({
			url: "militaryUnit.html?id="+ muID,
			success: function(data) {
				var flag, order = $(data).find(".battleDiv:first > div:eq(3) a[href^='battle.html?id=']:first");
				

				if(0<order.length) {
					if(0===$(data).find(".battleDiv:first > div:eq(3) > b:contains('World War')").length) {
						flag = $(data).find(".battleDiv:first").parent().parent().find(".flags-medium:last");
						if(0<flag.length) $("#muOrder").html("<a target='_blank' href='"+ order.attr('href') +"'>"+ order.text() +"</a> , <div class='"+flag.attr("class").replace(/medium/g,"small")+"'></div> side.");
					} else {
						flag = $(data).find(".battleDiv:first").parent().parent().find("> img:last");
						if(0<flag.length) $("#muOrder").html("<a target='_blank' href='"+ order.attr('href') +"'>"+ order.text() +"</a> , <img class='flags-small' src='"+flag.attr("src")+"' style='width:21px;height:16px;'> side.");
					}					
				} else {
					$("#muOrder").html("None.");
					$("#muBonus").attr("checked", false);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
                $("#muOrder").html("Failed, try again...");
                console.log('!Error - errorThrown:'+errorThrown+'; jqXHR:'+jqXHR);
                setTimeout(function(){ $("#muOrder").html("Loading..."); order(muID); },2000);
            }
		});
	}
	function init() {
		cssSetDisabled("#tankBonus");
		$("#tankBonus").prop("disabled", true);
		$("#buildingQ").prop("disabled", true);
		
		var element = $(".testDivblue:has('.bigAvatar') img.smallhelp");
		for( var j=0; j<element.length; j++ ) {
			var buff = element.eq(j).attr('src').match(/(steroids|tank|spa|vacations|bunker|resistance|painDealer1h|painDealer10h|painDealer25h)\_(positive|negative)/ig);
			switch(buff[0]) {
				case "painDealer10h_positive": case 'painDealer1h_positive': case 'painDealer25h_positive':
					$("#painDealerBonus").attr("checked", true);
					break;
				case "vacations_positive":
					$("#foodNum").val("25");
					break;
				case "vacations_negative":
					$("#foodNum").val("0");
					break;
				case "spa_positive":
					$("#giftNum").val("25");
					break;
				case "spa_negative":
					$("#giftNum").val("0");
					break;
				case "steroids_positive":
					cssSetEnabled("#steroidBonus");
					$("#steroidBonus").prop("disabled", false);
					$("#steroidBonus").attr("checked", true);
					cssSetDisabled("#steroidDebuff");
					$("#steroidDebuff").prop("disabled", true);
					$("#steroidDebuff").attr("checked", false);
					break;
				case 'steroids_negative':
					cssSetEnabled("#steroidDebuff");
					$("#steroidDebuff").prop("disabled", false);
					$("#steroidDebuff").attr("checked", true);
					cssSetDisabled("#steroidBonus");
					$("#steroidBonus").prop("disabled", true);
					$("#steroidBonus").attr("checked", false);
					break;
				case 'tank_positive':
					cssSetDisabled("#tankDebuff");
					$("#tankDebuff").prop("disabled", true);
					$("#tankDebuff").attr("checked", false);
					cssSetEnabled("#tankBonus");
					$("#tankBonus").prop("disabled", false);
					$("#tankBonus").attr("checked", true);
					$("#weaponQ").val("2.0")
					break;
				case 'tank_negative':
					cssSetEnabled("#tankDebuff");
					$("#tankDebuff").prop("disabled", false);
					$("#tankDebuff").attr("checked", true);
					cssSetDisabled("#tankBonus");
					$("#tankBonus").prop("disabled", true);
					$("#weaponQ").prop("disabled", true);
					$("#weaponQ").val("0.5");
					break;
				case 'bunker_positive':	case 'resistance_positive':
					if($("#swrbunkDebuff").is(":checked")) {
						$("#swrbunkDebuff").attr("checked", false);
						cssSetEnabled("#swrbunkBonus");
						$("#swrbunkBonus").prop("disabled", false);
					} else {
						$("#swrbunkBonus").attr("checked", true);
						cssSetDisabled("#swrbunkDebuff");
						$("#swrbunkDebuff").prop("disabled", true);
						cssSetDisabled("#surroundDebuff");
						$("#surroundDebuff").prop("disabled", true);
					}
					break;
				case 'bunker_negative': case 'resistance_negative':
					if($("#swrbunkBonus").is(":checked")) {
						$("#swrbunkBonus").attr("checked", false);
						cssSetEnabled("#swrbunkDebuff");
						$("#swrbunkDebuff").prop("disabled", false);
						cssSetEnabled("#surroundDebuff");
						$("#surroundDebuff").prop("disabled", false);
					} else {
						$("#swrbunkDebuff").attr("checked", true);
						cssSetDisabled("#swrbunkBonus");
						$("#swrbunkBonus").prop("disabled", true);
					}
					break;
				default:
					break;
			}
		}
		calc();
	}
	function calc() {
		var modified_crit;
		var factor = parseFloat($("#weaponQ").val());
		if($("#buildingType").val() == 2) { 
			factor = factor * (1 + parseInt($("#buildingQ").val()) * 0.05);
		}
		
		if($("#painDealerBonus").is(":checked")) {
			modified_crit = crit*2;
			if(modified_crit>0.8) { modified_crit = 0.8; }
		} else {
			modified_crit = crit;
		}

		if($("#steroidBonus").is(":checked")) { factor = factor * 1.2; }
		else if($("#steroidDebuff").is(":checked")) { factor = factor * 0.8; }
		
		if($("#tankBonus").is(":checked")) { factor = factor * 1.2; }

		if($("#swrbunkBonus").is(":checked")) { factor = factor * 1.25; }
		else if($("#swrbunkDebuff").is(":checked")) { factor = factor * 0.8; }
		
		if($("#muBonus").is(":checked")) { factor = factor * muValue; } //FIX!
		
		if($("#regionBonus").is(":checked")) { factor = factor * 1.2; }
		
		if($("#surroundDebuff").is(":checked")) { factor = factor * 0.8; }
		
		factor = factor * (1 + modified_crit);
		var minHit = Math.round(minDmg * factor * 5)
		var maxHit = Math.round(maxDmg * factor * 5)
		$("#estBerserkMin").html(formatNumber(minHit));
		$("#estBerserkMax").html(formatNumber(maxHit));

		var hit = (minHit + maxHit)/10
		
		var totalHealth = parseFloat($("#healthNum").val());
		totalHealth += parseInt($("#foodNum").val()) * 50;
		totalHealth += parseInt($("#giftNum").val()) * 50;
		
		var healthPerHit = 10;
		var healthRegenHit = 0;
		if($("#buildingType").val() == 3) { 
			healthRegenHit = (parseInt($("#buildingQ").val()) * 0.05);
		}
		
		var totalHits = Math.floor(totalHealth / healthPerHit);
		totalHits = totalHits * (1-miss) / (1-avoid-healthRegenHit+avoid*healthRegenHit)
		
		totalDamage = totalHits * hit;
		$("#estTimes").html(Math.round(totalHits));
		$("#estTotal").html(formatNumber(Math.round(totalDamage)));
		$("#percentage").html(Math.round(dmgToday*100/totalDamage));
	}
	function cssSetDisabled(item) {
		$(item).parent().css("background-color","rgb(219, 219, 219)");
		$(item).parent().css("border","1px solid rgba(0, 0, 0, 0.7)");
		$(item).parent().css("box-shadow","0 0 5px rgba(0, 0, 0, 0.5), 0 -12px 12px rgba(144, 169, 1156, 0.2) inset");
		$(item).parent().css("webkit-box-shadow","0 0 5px rgba(0, 0, 0, 0.5), 0 -12px 12px rgba(144, 169, 1156, 0.2) inset");
	}
	function cssSetEnabled(item) {
		$(item).parent().removeAttr("style");
		$(item).parent().attr("style","width:100%;");
	}
	function formatNumber(Num) {
		Num += "";
		var arr = Num.split(".");
		var re = /(\d{1,3})(?=(\d{3})+$)/g;
		return arr[0].replace(re,"$1,") + (arr.length == 2 ? "."+arr[1] : "");
	}
	function findUrlObj() {var a={};window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(d,b,c){a[b]=c});return a};
	init()
	
	$("#weaponQ").change( function(){ 
		if($("#weaponQ").val() != 2.0) {
			cssSetDisabled("#tankBonus");
			$("#tankBonus").prop("disabled", true);
			if($("#tankBonus").is(":checked"))
			{
				$("#tankBonus").attr('checked', false);
				cssSetEnabled("#tankDebuff");
				$("#tankDebuff").prop("disabled", false);
			}
		} else {
			cssSetEnabled("#tankBonus");
			$("#tankBonus").prop("disabled", false);
		}
		calc(); 
	});
	$("#buildingType").change( function(){ 
		if($("#buildingType").val() == 1) {
			$("#buildingQ").prop("disabled", true);
			$("#buildingQ").val("0");
		} else {
			$("#buildingQ").prop("disabled", false);
		}
		calc(); 
	});
	$("#buildingQ").change( function(){ calc(); });
	$("#foodNum").change( function(){ 
		if(parseInt($("#foodNum").val()) < 0) {
			$("#foodNum").val("0");
		}
		calc(); 
	});
	$("#giftNum").change( function(){ 
		if(parseInt($("#giftNum").val()) < 0) {
			$("#giftNum").val("0");
		}
		calc(); 
	});
	$("#healthNum").change( function(){ 
		if(parseFloat($("#healthNum").val()) < 0) {
			$("#healthNum").val("0.0");
		} else if (parseFloat($("#healthNum").val()) > 100.0) {
			$("#healthNum").val("100.0");
		}
		calc(); 
	});
	$("#regionBonus").change( function(){ calc(); });
	$("#muBonus").change( function(){ calc(); });
	$("#swrbunkBonus").change( function(){ 
		if($("#swrbunkBonus").is(":checked")) {
			cssSetDisabled("#swrbunkDebuff");
			$("#swrbunkDebuff").prop("disabled", true);
			cssSetDisabled("#surroundDebuff");
			$("#surroundDebuff").prop("disabled", true);
		} else {
			cssSetEnabled("#swrbunkDebuff");
			$("#swrbunkDebuff").prop("disabled", false);
			cssSetEnabled("#surroundDebuff");
			$("#surroundDebuff").prop("disabled", false);
		}
		calc(); 
	});
	$("#tankBonus").change( function(){ 
		if($("#tankBonus").is(":checked")) {
			cssSetDisabled("#tankDebuff");
			$("#tankDebuff").prop("disabled", true);
		} else {
			cssSetEnabled("#tankDebuff");
			$("#tankDebuff").prop("disabled", false);
		}
		calc(); 
	});
	$("#steroidBonus").change( function(){ 
		if($("#steroidBonus").is(":checked")) {
			cssSetDisabled("#steroidDebuff");
			$("#steroidDebuff").prop("disabled", true);
		} else {
			cssSetEnabled("#steroidDebuff");
			$("#steroidDebuff").prop("disabled", false);
		}
		calc(); 
	});
	$("#surroundDebuff").change( function(){ 
		if($("#surroundDebuff").is(":checked")) {
			cssSetDisabled("#swrbunkBonus");
			$("#swrbunkBonus").prop("disabled", true);
		} else {
			if(!$("#swrbunkDebuff").is(":checked")) {
				cssSetEnabled("#swrbunkBonus");
				$("#swrbunkBonus").prop("disabled", false);
			}
		}
		calc(); 
	});
	$("#swrbunkDebuff").change( function(){ 
		if($("#swrbunkDebuff").is(":checked")) {
			cssSetDisabled("#swrbunkBonus");
			$("#swrbunkBonus").prop("disabled", true);
		} else {
			if(!$("#surroundDebuff").is(":checked")) {
				cssSetEnabled("#swrbunkBonus");
				$("#swrbunkBonus").prop("disabled", false);
			}
		}
		calc(); 
	});
	$("#tankDebuff").change( function(){ 
		if($("#tankDebuff").is(":checked")) {
			cssSetDisabled("#tankBonus");
			$("#weaponQ").prop("disabled", true);
			$("#tankBonus").prop("disabled", true);
			$("#weaponQ").val("0.5");
		} else {
			$("#weaponQ").prop("disabled", false);
		}
		calc(); 
	});
	$("#steroidDebuff").change( function(){ 
		if($("#steroidDebuff").is(":checked")) {
			cssSetDisabled("#steroidBonus");
			$("#steroidBonus").prop("disabled", true);
		} else {
			cssSetEnabled("#steroidBonus");
			$("#steroidBonus").prop("disabled", false);
		}
		calc(); 
	});
	$("#painDealerBonus").change( function(){ 
		calc(); 
	});
}
addJQuery(main);