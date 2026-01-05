if($("section.top-bar-section > ul.foundation-right").length==1){
	/*---Initialization parameters---*/
	var localUrl = new String( window.location );
	var URLBattle = "battle.html?id=";
	var URLSettings = "editCitizen.html?Settings";
	var URLShadowGovernment = "editCitizen.html?ShadowGovernment";
	var URLMotivation = "newCitizenStatistics.html";
	var style;
	/*---Initialization parameters---*/

	
	/*---Initialization menu---*/
	$('<a class="button foundation-style" title="Shadow Government Settings" href="editCitizen.html?Settings"><i class="icon-star"></i>SG Settings</a><br>').insertBefore($(".foundation-right.hidden-overflow > div:first > a:last"));
	$('<a class="button foundation-style" title="Shadow Government Main" href="editCitizen.html?ShadowGovernment"><i class="icon-star"></i>SG Main</a><br>').insertBefore($(".foundation-right.hidden-overflow > div:first > a:last"));
	/*---Initialization menu---*/

	function SGChecked(flag){
		if(flag){
			return "checked";
		} else {
			return  "";
		}
	}

	/*---On Settings Page---*/
	if (localUrl.indexOf( URLSettings, 0 ) >= 0){
		var wrapperSettings = $("#userMenu + script + div");
		wrapperSettings.attr("id","WrapperMainConfig");
		wrapperSettings.empty();
		$('<center><h1>Shadow Government Settings</h1></center><p style="clear: both"></p><br>').appendTo(wrapperSettings);
		$('<div id="SettingsSpectator" class="testDivblue" style="width:100%;"><h3 id="SettingsSpectatorTittle">Settings Spectator</h3></div>').appendTo(wrapperSettings);
		$('<div id="SettingsMotivator" class="testDivblue" style="width:100%;"><h3 id="SettingsMotivatorTittle">Settings Motivator</h3></div>').appendTo(wrapperSettings);
		$('<div id="SettingsDemoralizator" class="testDivblue" style="width:100%;"><h3 id="SettingsDemoralizatorTittle">Settings Demoralizator</h3></div>').appendTo(wrapperSettings);
		
		$('<b title="default value: 7000, ultra speed value: 1750">SGTimerSpectator: </b><input id="SGTimerSpectatorText" name="SGTimerSpectatorText" type="text" value="'+$.jStorage.get('SGTimerSpectator', 7000)+'" autocomplete="off"><input id="SGTimerSpectatorSubmit" value="Change" type="button"><br>').appendTo("#SettingsSpectator");
		$('<b title="default value: 1">SGFakeUserID: </b><input id="SGFakeUserIDText" name="SGFakeUserIDText" type="text" value="'+$.jStorage.get('SGFakeUserID', 1)+'" autocomplete="off"><input id="SGFakeUserIDSubmit" value="Change" type="button"><br>').appendTo("#SettingsSpectator");
		$('<b title="default value: 1">SGFakeCitizenshipID: </b><input id="SGFakeCitizenshipIDText" name="SGFakeCitizenshipIDText" type="text" value="'+$.jStorage.get('SGFakeCitizenshipID', 1)+'" autocomplete="off"><input id="SGFakeCitizenshipIDSubmit" value="Change" type="button"><br>').appendTo("#SettingsSpectator");
		$('<b title="default value: true">SGSpectatorMode: </b><input class="SGSpectatorModeRadio" type="radio" name="SGSpectatorMode" value="true" '+SGChecked($.jStorage.get('SGSpectatorMode', true))+'> True <input class="SGSpectatorModeRadio" type="radio" name="SGSpectatorMode" value="false" '+SGChecked(!$.jStorage.get('SGSpectatorMode', true))+'>False<br>').appendTo("#SettingsSpectator");
		
		$('<b title="default value: true">SGMotivationMode: </b><input class="SGMotivationModeRadio" type="radio" name="SGMotivationMode" value="true" '+SGChecked($.jStorage.get('SGMotivationMode', true))+'> True <input class="SGMotivationModeRadio" type="radio" name="SGMotivationMode" value="false" '+SGChecked(!$.jStorage.get('SGMotivationMode', true))+'>False<br>').appendTo("#SettingsMotivator");
		
		$('<b title="default value: 10000">SGDemoralizatorTimerSpectator: </b><input id="SGDemoralizatorTimerSpectatorText" name="SGDemoralizatorTimerSpectatorText" type="text" value="'+$.jStorage.get('SGDemoralizatorTimerSpectator', 10000)+'" autocomplete="off"><input id="SGDemoralizatorTimerSpectatorSubmit" value="Change" type="button"><br>').appendTo("#SettingsDemoralizator");
		$('<b title="default value: 10">SGDemoralizatorFakeUserIDCount: </b><input id="SGDemoralizatorFakeUserIDCountText" name="SGDemoralizatorFakeUserIDCountText" type="text" value="'+$.jStorage.get('SGDemoralizatorFakeUserIDCount', 10)+'" autocomplete="off"><input id="SGDemoralizatorFakeUserIDCountSubmit" value="Change" type="button"><br>').appendTo("#SettingsDemoralizator");
		$('<b title="default value: 2">SGDemoralizatorFakeCitizenshipID: </b><input id="SGDemoralizatorFakeCitizenshipIDText" name="SGDemoralizatorFakeCitizenshipIDText" type="text" value="'+$.jStorage.get('SGDemoralizatorFakeCitizenshipID', 2)+'" autocomplete="off"><input id="SGDemoralizatorFakeCitizenshipIDSubmit" value="Change" type="button"><br>').appendTo("#SettingsDemoralizator");
		$('<b title="default value: false">SGDemoralizatorMode: </b><input class="SGDemoralizatorModeRadio" type="radio" name="SGDemoralizatorMode" value="true" '+SGChecked($.jStorage.get('SGDemoralizatorMode', false))+'> True <input class="SGDemoralizatorModeRadio" type="radio" name="SGDemoralizatorMode" value="false" '+SGChecked(!$.jStorage.get('SGDemoralizatorMode', false))+'>False<br>').appendTo("#SettingsDemoralizator");
		
		$('#SGTimerSpectatorSubmit').click(function(){
			$.jStorage.set('SGTimerSpectator', $('#SGTimerSpectatorText').val());
		});
		$('#SGFakeUserIDSubmit').click(function(){
			$.jStorage.set('SGFakeUserID', $('#SGFakeUserIDText').val());
		});
		$('#SGFakeCitizenshipIDSubmit').click(function(){
			$.jStorage.set('SGFakeCitizenshipID', $('#SGFakeCitizenshipIDText').val());
		});
		$('.SGSpectatorModeRadio').click(function(){
			if ($(this).val()==="true"){
				$.jStorage.set('SGSpectatorMode', true);
			} else {
				$.jStorage.set('SGSpectatorMode', false);
			}
		});
		
		$('.SGMotivationModeRadio').click(function(){
			if ($(this).val()==="true"){
				$.jStorage.set('SGMotivationMode', true);
			} else {
				$.jStorage.set('SGMotivationMode', false);
			}
		});
		
		$('#SGDemoralizatorTimerSpectatorSubmit').click(function(){
			$.jStorage.set('SGDemoralizatorTimerSpectator', $('#SGDemoralizatorTimerSpectatorText').val());
		});
		$('#SGDemoralizatorFakeUserIDCountSubmit').click(function(){
			$.jStorage.set('SGDemoralizatorFakeUserIDCount', $('#SGDemoralizatorFakeUserIDCountText').val());
		});
		$('#SGDemoralizatorFakeCitizenshipIDSubmit').click(function(){
			$.jStorage.set('SGDemoralizatorFakeCitizenshipID', $('#SGDemoralizatorFakeCitizenshipIDText').val());
		});
		$('.SGDemoralizatorModeRadio').click(function(){
			if ($(this).val()==="true"){
				$.jStorage.set('SGDemoralizatorMode', true);
			} else {
				$.jStorage.set('SGDemoralizatorMode', false);
			}
		});
		
		$('<p style="clear: both"></p><br>').appendTo(wrapperSettings);
	}
	/*---On Settings Page---*/
	
	/*---On Shadow Government Page---*/
	if (localUrl.indexOf( URLShadowGovernment, 0 ) >= 0){
		var wrapperSG = $("#userMenu + script + div");
		wrapperSG.attr("id","WrapperMainConfig");
		wrapperSG.empty();
		$('<center><h1>Shadow Government Blank</h1></center><p style="clear: both"></p><br>').appendTo(wrapperSG);
	}
	/*---On Shadow Government Page---*/
	
	/*---On Battle Page---*/
	if (localUrl.indexOf( URLBattle, 0 ) >= 0){
		/*---Отключаем стилями картинки в окне сообщения боя---*/
		var stringCSS = '.fightsprite.critical1,.fightsprite.critical0,.fightsprite.critical2,.fightsprite.critical3,.fightsprite.normal1,.fightsprite.normal0,.fightsprite.normal2,.fightsprite.normal3,.fightsprite.miss,.fightsprite.toofast {\n display:none;\n}\n\n';
		stringCSS += '.fightsprite.critical1 + br,.fightsprite.critical0 + br,.fightsprite.critical2 + br,.fightsprite.critical3 + br,.fightsprite.normal1 + br,.fightsprite.normal0 + br,.fightsprite.normal2 + br,.fightsprite.normal3 + br,.fightsprite.miss + br,.fightsprite.toofast + br {\n display:none;\n}\n\n';
		stringCSS += '#fightResponse{\n margin:0 auto .6em!important;\n padding:9px 0px 2px;\n font-size:14px;\n font-family:\'Open Sans\',Arial,sans-serif!important;\n background:#eee;\n border-radius:3px;\n -moz-border-radius:3px;\n -o-border-radius:3px;\n -webkit-border-radius:3px;\n border:1px solid #777;\n background-position:25px 0!important;\n box-shadow:0 0 3px rgba(0,187,255,0.5),0 0 12px rgba(142,153,168,0.2) inset;\n -o-box-shadow:0 0 3px rgba(0,187,255,0.5),0 0 12px rgba(142,153,168,0.2) inset;\n -webkit-box-shadow:0 0 3px rgba(0,187,255,0.5),0 0 12px rgba(142,153,168,0.2) inset;\n -moz-box-shadow:0 0 3px rgba(0,187,255,0.5),0 0 12px rgba(142,153,168,0.2) inset;\n word-wrap:break-word;\n}\n\n';
		stringCSS += '#fightStatus{\n border-radius:3px;\n -moz-border-radius:3px;\n -o-border-radius:3px;\n -webkit-border-radius:3px;\n border:1px solid #777;\n background-position:25px 0!important;\n box-shadow:0 0 3px rgba(0,187,255,0.5),0 0 12px rgba(142,153,168,0.2) inset;\n -o-box-shadow:0 0 3px rgba(0,187,255,0.5),0 0 12px rgba(142,153,168,0.2) inset;\n -webkit-box-shadow:0 0 3px rgba(0,187,255,0.5),0 0 12px rgba(142,153,168,0.2) inset;\n -moz-box-shadow:0 0 3px rgba(0,187,255,0.5),0 0 12px rgba(142,153,168,0.2) inset;\n word-wrap:break-word;\n}\n\n';
		style = document.createElement( "style" );
		style.type = "text/css";
		style.textContent = stringCSS;
		document.body.appendChild( style );
		style = undefined;
		/*---Отключаем стилями картинки в окне сообщения боя---*/

		/*---Отключаем модальные окна на странице боя---*/
		window.picoModal=function() {
			return true;
		}
		/*---Отключаем модальные окна на странице боя---*/
			
		/*---Минимизируем заголовок боя---*/
		$("#battleHeaderImage").remove();
		$("#mainFight").css({"margin-top": "0px", "margin-bottom": ".4em","background-color": "white","border-radius": "3px",});
		$("#mainFight .fightFont").removeClass("fightFont").addClass("fightFontSG");
		$("#mainFight .fightFontSG").css({"text-shadow": "0 0 2px black",});
		/*---Минимизируем заголовок боя---*/

		/*---Минимизируем списки топ3/топ10 по урону на странице боя---*/
		$("#battleStats").show();
		if($("#totalattackers").length==0 ) {
			$("#battleStats").append('<div class="foundation-style small-10 columns SpectatorsBattleStatsElements"><div class="foundation-style small-5 columns"><b>Total defenders online:</b><i id="totaldefenders" style="display: inline;">0</i> <a style="font-size: 11px;" href="" id="defendersLink">Show details</a> <a style="font-size: 11px; display: none;" href="" id="defendersLinkHide">Hide details</a> <br><div align="center" id="defendersMenu" style="font-size: 11px; text-align: center; padding: 1em; margin: auto; display: block;">No one <br> </div></div><div class="foundation-style small-5 columns"><b>Total attackers online:</b><i id="totalattackers" style="display: inline;">0</i> <a style="font-size: 11px;" href="" id="attackersLink">Show details</a> <a style="font-size: 11px;  display: none;" href="" id="attackersLinkHide">Hide details</a> <br><div align="center" id="attackersMenu" style="font-size: 11px; text-align: center; padding: 1em; margin: auto; display: block;">No one <br> </div></div>');
			$("#battleStats").append('<div class="foundation-style small-10 columns SpectatorsBattleStatsElements"><b>Total spectators online:</b><i id="totalspectators" style="display: inline;">0</i> <a style="font-size: 11px;" href="" id="spectatorsLink">Show details</a> <a style="font-size: 11px; display: none;" href="" id="spectatorsLinkHide">Hide details</a> <br><div align="center" id="spectatorsMenu" style="font-size: 11px; text-align: center; padding: 1em; margin: auto; display: block;">No one <br> </div>  </div>');
		}
		
		$('#spectatorsLink').click(function () { $('#spectatorsLink').fadeOut('fast', function () { $('#spectatorsLinkHide').fadeIn('fast'); $('#spectatorsMenu').fadeIn('fast'); }); return false; });
		$('#spectatorsLinkHide').click(function () { $('#spectatorsLinkHide').fadeOut('fast', function () { $('#spectatorsLink').fadeIn('fast'); $('#spectatorsMenu').fadeOut('fast'); }); return false; });

		$('#attackersLink').click(function () { $('#attackersLink').fadeOut('fast', function () { $('#attackersLinkHide').fadeIn('fast'); $('#attackersMenu').fadeIn('fast'); }); return false; });
		$('#attackersLinkHide').click(function () { $('#attackersLinkHide').fadeOut('fast', function () { $('#attackersLink').fadeIn('fast'); $('#attackersMenu').fadeOut('fast'); }); return false; });

		$('#defendersLink').click(function () { $('#defendersLink').fadeOut('fast', function () { $('#defendersLinkHide').fadeIn('fast'); $('#defendersMenu').fadeIn('fast'); }); return false; });
		$('#defendersLinkHide').click(function () { $('#defendersLinkHide').fadeOut('fast', function () { $('#defendersLink').fadeIn('fast'); $('#defendersMenu').fadeOut('fast'); }); return false; });
		
		$("#battleSelectable:first + #battleSelectable div.small-10:first").remove();
		$('<div id="wrapperBattleStatsButtons" class="foundation-style small-10 columns" style="margin-bottom:.4em;"></div>').insertBefore($("#battleSelectable:first + #battleSelectable div.small-4:first"));
		$('<div id="showTop3BattleStats" style="padding-bottom:.4em;padding-top:.4em;margin:.4em .4em 0 .4em;" class="foundation-style button"> Show Top 3 </div>').appendTo($("#wrapperBattleStatsButtons"));
		$('<div id="showTop10BattleStats" style="padding-bottom:.4em;padding-top:.4em;margin:.4em .4em 0 .4em;" class="foundation-style button"> Show Top 10 </div>').appendTo($("#wrapperBattleStatsButtons"));
		$('<div id="showRecentActionsBattleStats" style="padding-bottom:.4em;padding-top:.4em;margin:.4em .4em 0 .4em;" class="foundation-style button"> Recent Actions </div>').appendTo($("#wrapperBattleStatsButtons"));
		$('<div id="showSpectatorsBattleStats" style="padding-bottom:.4em;padding-top:.4em;margin:.4em .4em 0 .4em;" class="foundation-style button"> Spectators </div>').appendTo($("#wrapperBattleStatsButtons"));

		$("#wrapperBattleStatsButtons + div.small-4, #wrapperBattleStatsButtons + div.small-4 + div.small-2, #wrapperBattleStatsButtons + div.small-4 + div.small-2 + div.small-4").addClass("Top3BattleStatsElements");
		$("#battleStats > div.small-10:first").addClass("Top10BattleStatsElements");
		$(".Top10BattleStatsElements + div.small-10").addClass("RecentActionsBattleStatsElements");
		//$(".RecentActionsBattleStatsElements + div.small-10, .RecentActionsBattleStatsElements + div.small-10 + div.small-10").addClass("SpectatorsBattleStatsElements");

		$(".Top3BattleStatsElements").css('display', $.jStorage.get('SGTop3BattleStatsElements', "none"));
		$("#showTop3BattleStats").click(function () {
			$(".Top3BattleStatsElements").toggle("fast", function () {
				$.jStorage.set('SGTop3BattleStatsElements', $(".Top3BattleStatsElements").css('display'));
			});
		});
		$(".Top10BattleStatsElements").css('display', $.jStorage.get('SGTop10BattleStatsElements', "none"));
		$("#showTop10BattleStats").click(function () {
			$(".Top10BattleStatsElements").toggle("fast", function () {
				$.jStorage.set('SGTop10BattleStatsElements', $(".Top10BattleStatsElements").css('display'));
			});
		});
		$(".RecentActionsBattleStatsElements").css('display', $.jStorage.get('SGRecentActionsBattleStatsElements', "none"));
		$("#showRecentActionsBattleStats").click(function () {
			$(".RecentActionsBattleStatsElements").toggle("fast", function () {
				$.jStorage.set('SGRecentActionsBattleStatsElements', $(".RecentActionsBattleStatsElements").css('display'));
			});
		});
		$(".SpectatorsBattleStatsElements").css('display', $.jStorage.get('SGSpectatorsBattleStatsElements', "none"));
		$("#showSpectatorsBattleStats").click(function () {
			$(".SpectatorsBattleStatsElements").toggle("fast", function () {
				$.jStorage.set('SGSpectatorsBattleStatsElements', $(".SpectatorsBattleStatsElements").css('display'));
			});
		});
		/*---Минимизируем списки топ3/топ10 по урону на странице боя---*/

		/*---Формируем блок сообщений боя---*/
		$('#fightStatus').show().css({'width':'initial',}).removeClass("testDivblue").addClass("fightContainer");
		$('#fightResponse').hide().addClass("foundation-style small-10 columns");
		//$('#fightResponse > div').addClass("testDivblue");
		
		$('<div id="wrapperStatusActionButtons" class="foundation-style small-10 columns" style="margin-bottom:.4em;"></div>').insertBefore($("#fightResponse"));
		$('<div id="SGShowStatusAction" style="padding-bottom:.4em;padding-top:.4em;margin:.4em .4em 0 .4em;" class="foundation-style button"> Show Status Action </div>').appendTo($("#wrapperStatusActionButtons"));
		$("#fightResponse").css('display', $.jStorage.get('SGShowStatusActionButton', "none"));
		$("#SGShowStatusAction").click(function () {
			$("#fightResponse").toggle("fast", function () {
				$.jStorage.set('SGShowStatusActionButton', $("#fightResponse").css('display'));
			});
		});
		/*---Формируем блок сообщений боя---*/
		
		/*---Спектатор---*/
		//var SGSpectatorMode = $.jStorage.get('SGSpectatorMode', 1);
		if($.jStorage.get('SGSpectatorMode', true)){
			var SGTimerSpectator = $.jStorage.get('SGTimerSpectator', 7000);		// Кд отправки запросов данных 1 секунда = 1000 миллисекунд.

			function sendUpdateRequestSpectator() {
				if (!hasFocus)
					return;
				
				var FakeUserID = $.jStorage.get('SGFakeUserID', 1);			// Айди фейкового пользователя.
				var FakeCitizenshipID = $.jStorage.get('SGFakeCitizenshipID', 1);	// Айди гражданства фейкового пользователя.
				
				var dataString = 'id=' + $("#battleRoundId").val() + "&at="+FakeUserID+"&ci="+FakeCitizenshipID+"&premium=1";
				
				$.ajax({  
					type: "GET",
					url: "battleScore.html",
					data: dataString,
					dataType: "json",
					success: function(msg) {
						updateStatus(msg.attackerScore, msg.defenderScore, msg.remainingTimeInSeconds, msg.percentAttackers);
						updateBattleHeros(msg.topAttackers, msg.topDefenders);
						updateTop10(msg.top10Attackers, msg.top10Defenders);
						updateBattleMonitor(msg);
						//updatePlace(msg.yourPlace);
						//updateTotalDamage(msg.totalPlayerDamage);
						for (var i = 0; i < msg.recentAttackers.length; i++) {
							if (msg.recentAttackers[i].id == latestAttackerId) {
								msg.recentAttackers = msg.recentAttackers.slice(0, i);
								break;
							}
						}
						for (var i = 0; i < msg.recentDefenders.length; i++) {
							if (msg.recentDefenders[i].id == latestDefenderId) {
								msg.recentDefenders = msg.recentDefenders.slice(0, i);
								break;
							}
						}
						if (msg.recentAttackers.length != 0) {
							latestAttackerId = msg.recentAttackers[0].id;
							attackerHits = msg.recentAttackers;
						}
						if (msg.recentDefenders.length != 0) {
							latestDefenderId = msg.recentDefenders[0].id;
							defenderHits = msg.recentDefenders;
						}
					}
				});
			}
			var intervalID = window.setInterval(sendUpdateRequestSpectator, SGTimerSpectator);
			continueThread = false;
		}
		/*---Спектатор---*/
		
		/*---Фейк Спектатор Деморализатор---*/
		if($.jStorage.get('SGDemoralizatorMode', false)){
			var SGDemoralizatorFakeUserIDCount = $.jStorage.get('SGDemoralizatorFakeUserIDCount', 10);
			var SGDemoralizatorFakeCitizenshipID = $.jStorage.get('SGDemoralizatorFakeCitizenshipID', 2);
			var SGDemoralizatorTimerSpectator = $.jStorage.get('SGDemoralizatorTimerSpectator', 10000);

			function sendUpdateRequestSpectatorFake(UserID,CitizenshipID) {
				var dataString = 'id=' + $("#battleRoundId").val() + "&at="+UserID+"&ci="+CitizenshipID+"&premium=1";
				
				$.ajax({  
					type: "GET",
					url: "battleScore.html",
					data: dataString,
					dataType: "json"
				});
			}

			function FakeSpectators(){
				n = 0;
				while (n < SGDemoralizatorFakeUserIDCount) {
					setTimeout(sendUpdateRequestSpectatorFake, (n+1)*(SGDemoralizatorTimerSpectator/SGDemoralizatorFakeUserIDCount), (n+1), SGDemoralizatorFakeCitizenshipID);
					n++;
				}
			}

			window.setInterval(FakeSpectators, SGDemoralizatorTimerSpectator);
		}
		/*---Фейк Спектатор Деморализатор---*/
	}
	/*---On Battle Page---*/

	/*---On Motivation Page---*/
	if (localUrl.indexOf( URLMotivation, 0 ) >= 0){
		//var SGMotivationMode = $.jStorage.get('SGMotivationMode', 1);
		if($.jStorage.get('SGMotivationMode', true)){
			var CurrentDay = /\d+/gim.exec($("#userMenu div div.panel.callout b:eq(2)").html());
			var CurrentDay = parseInt(CurrentDay[0]);
			var tmpMotivateCountToday = {day: CurrentDay,count: 0};
			var MotivateCountToday = JSON.parse($.jStorage.get('SGMotivateCountToday', JSON.stringify(tmpMotivateCountToday)));
			//console.log(MotivateCountToday);
			if (MotivateCountToday.day != tmpMotivateCountToday.day){
				MotivateCountToday = tmpMotivateCountToday;
				$.jStorage.set('SGMotivateCountToday', JSON.stringify(MotivateCountToday));
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
						$.jStorage.set('SGMotivateCountToday', JSON.stringify(MotivateCountToday));
						$("#countMotivationToday").html(MotivateCountToday.count);
					} else {
						$("#motivate-"+arrType[idType]+"-"+idUser).attr("title","Ошибка: "+messageResponse[1]);
					}
				} else if(/Вы отправили слишком много мотиваций сегодня/gim.exec(jqXHR.responseText)){
					var parentTDw = $("#motivate-"+arrType[idType]+"-"+idUser).parent();
					parentTDw.empty();
					parentTDw.append('<i title="Вы отправили слишком много мотиваций сегодня" style="color: #c00; font-size: 1.25em; text-shadow: 0 0 0" class="icon-uniF478"></i>');
					MotivateCountToday.count = 5;
					$.jStorage.set('SGMotivateCountToday', JSON.stringify(MotivateCountToday));
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
				} else if(/У вас не достаточно предметов/gim.exec(jqXHR.responseText)){
					var parentTDw = $("#motivate-"+arrType[idType]+"-"+idUser).parent();
					parentTDw.empty();
					parentTDw.append('<i title="У вас не достаточно предметов" style="color: #c00; font-size: 1.25em; text-shadow: 0 0 0" class="icon-uniF478"></i>');
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
	}
	/*---On Motivation Page---*/
}