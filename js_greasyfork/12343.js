// ==UserScript==
// @name           Easy Motivation
// @version        1.01
// @namespace      localhost
// @author         EnterBrain
// @description    Plugin for best experience Shadow Government.
// @icon           http://firepic.org/images/2015-08/31/ktizhlzyzxz4.png
// @icon64         http://firepic.org/images/2015-08/31/8gwmu0w58oy5.png
// @match          http://*.e-sim.org/newCitizenStatistics.html*
// @grant          all
// @require        http://code.jquery.com/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/12343/Easy%20Motivation.user.js
// @updateURL https://update.greasyfork.org/scripts/12343/Easy%20Motivation.meta.js
// ==/UserScript==

function EasyMotivation(){
	var CurrentDay = /\d+/gim.exec($("#userMenu div div.panel.callout b:eq(2)").html());
	var CurrentDay = parseInt(CurrentDay[0]);
	var tmpMotivateCountToday = {day: CurrentDay,count: 0};
	var MotivateCountToday = JSON.parse($.jStorage.get('MotivateCountToday', JSON.stringify(tmpMotivateCountToday)));
	//console.log(MotivateCountToday);
	if (MotivateCountToday.day != tmpMotivateCountToday.day){
		MotivateCountToday = tmpMotivateCountToday;
		$.jStorage.set('MotivateCountToday', JSON.stringify(MotivateCountToday));
	}

	$(".dataTable ul.button.foundation-center.foundation-style-group li a.foundation-style.button.small.help i.icon-cupcake").parent().parent().toggle();
	$("<span>Today motivate count: <b id=\"countMotivationToday\">0</b><span>").insertAfter("#newCitizenStatsForm");
	$("#countMotivationToday").html(MotivateCountToday.count);

	$( "table.dataTable tr" ).each(function( index, element ) {
		if ($(this).children("td").children("i.icon-uniF478").length>0){
			var MotivateUserID = $(this).children("td:first").children(".profileLink").attr("href").replace("profile.html?id=","");
			if ($(this).children("td:eq(4)").children("i.icon-uniF478").length==1){
				$(this).children("td:eq(4)").empty();
				$(this).children("td:eq(4)").append('<i id="motivate-weapons-'+MotivateUserID+'" style="cursor: pointer; color: #000; font-size: 1.25em; text-shadow: 0 0 0" class="motivate-element motivate-weapons icon-tank" value="'+MotivateUserID+'"></i>');
			}
			if ($(this).children("td:eq(5)").children("i.icon-uniF478").length==1){
				$(this).children("td:eq(5)").empty();
				$(this).children("td:eq(5)").append('<i id="motivate-breads-'+MotivateUserID+'" style="cursor: pointer; color: #000; font-size: 1.25em; text-shadow: 0 0 0" class="motivate-element motivate-breads icon-bread" value="'+MotivateUserID+'"></i>');
			}
			if ($(this).children("td:eq(6)").children("i.icon-uniF478").length==1){
				$(this).children("td:eq(6)").empty();
				$(this).children("td:eq(6)").append('<i id="motivate-gifts-'+MotivateUserID+'" style="cursor: pointer; color: #000; font-size: 1.25em; text-shadow: 0 0 0" class="motivate-element motivate-gifts icon-gift" value="'+MotivateUserID+'"></i>');
			}
		}
		return true;
	});

	function motivateResponse (jqXHR, timeout, message) {
		var dataString = /type=(\d)&id=(\d+)/gim.exec($(this)[0].data);
		var idType = parseInt(dataString[1]);
		var idUser = parseInt(dataString[2]);
		var arrType = ["none","weapons","breads","gifts"]
		var messageResponse = "";
		if (messageResponse = /&citizenMessage=(\S+)/gim.exec(jqXHR.getResponseHeader("TM-finalURLdhdg"))){
			if (messageResponse[1]=="SUCCESFULLY_MOTIVATED"){
				var parentTDw = $("#motivate-"+arrType[idType]+"-"+idUser).parent();
				parentTDw.empty();
				parentTDw.append('<i title="Мотивация прошла успешно" style="color: #0c0; font-size: 1.25em; text-shadow: 0 0 0" class="icon-uniF479"></i>');
				MotivateCountToday.count = MotivateCountToday.count+1;
				$.jStorage.set('MotivateCountToday', JSON.stringify(MotivateCountToday));
				$("#countMotivationToday").html(MotivateCountToday.count);
			} else {
				$("#motivate-"+arrType[idType]+"-"+idUser).attr("title","Ошибка: "+messageResponse[1]);
			}
		} else if(/Вы отправили слишком много мотиваций сегодня/gim.exec(jqXHR.responseText)){
			var parentTDw = $("#motivate-"+arrType[idType]+"-"+idUser).parent();
			parentTDw.empty();
			parentTDw.append('<i title="Вы отправили слишком много мотиваций сегодня" style="color: #c00; font-size: 1.25em; text-shadow: 0 0 0" class="icon-uniF478"></i>');
			MotivateCountToday.count = 5;
			$.jStorage.set('MotivateCountToday', JSON.stringify(MotivateCountToday));
			$("#countMotivationToday").html(MotivateCountToday.count);
		} else if(/Вы уже отправляли комплект этому гражданину сегодня/gim.exec(jqXHR.responseText)){
			var parentTDw = $("#motivate-"+arrType[idType]+"-"+idUser).parent();
			parentTDw.empty();
			parentTDw.append('<i title="Вы уже отправляли комплект этому гражданину сегодня" style="color: #c00; font-size: 1.25em; text-shadow: 0 0 0" class="icon-uniF478"></i>');
		} else if(/Этот гражданин получил слишком много мотиваций сегодня/gim.exec(jqXHR.responseText)){
			var parentTDw = $("#motivate-"+arrType[idType]+"-"+idUser).parent();
			parentTDw.empty();
			parentTDw.append('<i title="Этот гражданин получил слишком много мотиваций сегодня" style="color: #c00; font-size: 1.25em; text-shadow: 0 0 0" class="icon-uniF478"></i>');
		} else if(/Этот гражданин получил все виды мотивационных комплектов сегодня/gim.exec(jqXHR.responseText)){
			var parentTDw = $("#motivate-"+arrType[idType]+"-"+idUser).parent();
			parentTDw.empty();
			parentTDw.append('<i title="Этот гражданин получил все виды мотивационных комплектов сегодня" style="color: #c00; font-size: 1.25em; text-shadow: 0 0 0" class="icon-uniF478"></i>');
		}
	}

	$(".motivate-element").click(function(){
		var typeMotivate = 0;
		if ($(this).hasClass("motivate-weapons")){
			typeMotivate = 1;
		} else if ($(this).hasClass("motivate-breads")){
			typeMotivate = 2;
		} else if ($(this).hasClass("motivate-gifts")){
			typeMotivate = 3;
		}
		var parentTD = $(this).parent();
		var userID = $(this).attr("value");
		var dataString = "type="+typeMotivate+"&id="+userID;
		$.ajax({  
			type: "POST",
			url: "motivateCitizen.html?id="+userID,
			data: dataString,
			dataType: "json",
			error:  motivateResponse
		});
	});

	$(".motivate-element").hover(function() {
		$(this).css("color", "#999");
	}, function() {
		$(this).css("color", "#000");
	});
}
var script = document.createElement( "script" );
script.type = "text/javascript";
script.textContent = '(' + EasyMotivation.toString() + ')();';
document.body.appendChild( script );