// @tabversion 20171101
var GuardWidget = {
	guardPosition : null,
	CurrentActive : '',
	serverwait: false,
	init : function () {
		var t = uW.btGuardWidget;
		var styles = 'li.guardbutton { border: 4px inset Peru; display: inline; float: left; width: 31px; height: 33px; text-align: center; color: white; }';
		styles += 'li.guardbutton.active { border: 4px solid blue;}';
		styles += 'li.guardbutton:hover div.tt { visibility: visible;}';
        styles += 'li.guardbutton div.tt { visibility: hidden; border-radius: 5px 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px;';
        styles += 'box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1); -webkit-box-shadow: 5px 5px rgba(0, 0, 0, 0.1); -moz-box-shadow: 5px 5px rgba(0, 0, 0, 0.1);';
        styles += 'font-family: Calibri, Tahoma, Geneva, sans-serif; font-weight: normal;';
        styles += 'position: relative; left: -30px; top: 50px;';
        styles += 'margin-left: 0; width: 200px; background-color: white; color: black;';
        styles += 'background: #FFFFAA; border: 1px solid #FFAD33; padding: 0.8em 1em;}';
		GM_addStyle (styles);
		
		var C2 = jQuery("<ul/>", {
			id: "t_throneGuardList",
			addClass: "presetList",
			style: "padding: 0px; margin: 0px; list-style: none; overflow: visible; float: left; border: 4px outset Peru;"
		});
	
		var guardTypes = ["wood", "ore", "food", "stone"];
		var offsets = [" 77% 47% ", " 77% 73% ", " 77% 60% "," 77% 85% "]; // default to highest level.  

		for (g =0; g < 4; g++)
		{
			var type = guardTypes[g];

			var bb = jQuery("<li/>").html('<div/>').css(
				{
					'padding': '0px',
					'background': 'url("https://rycamelot1-a.akamaihd.net/fb/e2/src/img/guardian_change_spritemap102.png") no-repeat scroll ' + offsets[g] + ' white',
					'background-size': '350px'
				});
			bb.addClass("guardbutton").addClass(type);
			bb.append("<div class='tt'>" + unsafeWindow.g_js_strings.guardian["tooltipSummon_" + type] + "</div>");

			bb.bind("click", {
				gt: type
			}, function (K) {
				t.processGuardianClick(K.data.gt);
			});

			C2.append(bb);
		}

		aa = jQuery("<div id='bt_guardBox'/>");
		aa.append(C2);
		aa.css({"height": "48px",
			"width": "164px",
			"position": "absolute",
			"overflow": "visible",
			"z-index": "100000"}
		);

		jQuery("#mod_maparea").append(aa);
		
		jQuery("#bt_guardBox").draggable({stop: function( event, ui ) {
			t.guardPosition = jQuery("#bt_guardBox").position();
			t.saveGuardPosition();
		} });

		t.readGuardPosition();
		if (!t.guardPosition)
			t.resetGuardWidget();
		else
		{
			jQuery('#bt_guardBox').css({
				"left": t.guardPosition.left + "px",
				"top": t.guardPosition.top + "px"});
		}
		
		t.drawGuardWidget();

		// hook into citysel_click();
		var cityselMod = new CalterUwFunc("citysel_click",[['cm.PrestigeCityView.render()','cm.PrestigeCityView.render();bt_cityChanged();']]);
		uWExportFunction('bt_cityChanged', t.drawGuardWidget);
		cityselMod.setEnable(true);

		jQuery('#bt_guardBox').bind('mousedown', function(e) {
			if (e.which == 3) {
				t.resetGuardWidget();
				return false;
			}
		});
		setInterval(t.checkWidget, 3000);
	},

	processGuardianClick : function (type) {  //handler when a guardian button is presed
		var t = uW.btGuardWidget;
		if (t.serverwait) return;
		// callback.  only called when successful
		var cb = function(cityId,type,success,finishTime) {
			if (success) {
				uW.btGuardWidget.serverwait = true;
				// set the outline and turn the background gray
				var btn = "li.guardbutton." + type;
				jQuery("li.guardbutton").removeClass('active');
				jQuery(btn).css('background-color', 'darkgray');
				jQuery(btn).addClass('active');

				// after lockout time is complete, redraw the control
				var timeLeft = finishTime - unixTime();
				setTimeout(uW.bt_guardCallbackFinish, (timeLeft + 1.0)* 1000,type);
			}
		};
		uWExportFunction('bt_guardCallback', cb);
		
		var cbf = function (type) {
			var btn = "li.guardbutton." + type;
			jQuery(btn).css('background-color', 'white');
			uW.btGuardWidget.serverwait = false;
			uW.btGuardWidget.drawGuardWidget(); 
		};
		uWExportFunction('bt_guardCallbackFinish', cbf);
		
		// change guardian
		t.SwitchGuardian(unsafeWindow.currentcityid,type, uW.bt_guardCallback)
	},

	drawGuardWidget : function () {
		var t = uW.btGuardWidget;
		// color the outline based on the current city
		if (t.serverwait) return;

		jQuery("li.guardbutton").removeClass("active");
		var cityId =  unsafeWindow.currentcityid;
		t.CurrentActive = '';

		var y_offset = {
			wood: " 47% ",
			ore: " 72.5% ",
			food: " 59.5% ",
			stone: " 85% "
		};

		var x_offset = {
			plate:    20,
			junior:   134,
			teenager: 248,
			adult:    362,
			adult2:   476,
			adult3:   590
		};

		var x_by_level = {
            0: x_offset.plate,
            1: x_offset.junior,
            2: x_offset.junior,
            3: x_offset.junior,
            4: x_offset.teenager,
            5: x_offset.teenager,
            6: x_offset.adult,
            7: x_offset.adult,
            8: x_offset.adult,
            9: x_offset.adult,
            10: x_offset.adult2,
            11: x_offset.adult3,
            12: x_offset.adult3,
            13: x_offset.adult3,
            14: x_offset.adult3,
            15: x_offset.adult3
		};

		for (var c=0;c<unsafeWindow.seed.guardian.length;c++)
		{
			if (unsafeWindow.seed.guardian[c].cityId == cityId)
			{
				var type = unsafeWindow.seed.guardian[c].type;
				t.CurrentActive = type;
				jQuery("li.guardbutton." + type).addClass("active");

				for (tt in y_offset)
				{
					var level = unsafeWindow.seed.guardian[c].cityGuardianLevels[tt];
					level = level ? level : 0;
					var bg_offset =  x_by_level[level]/776*100 + "% " + y_offset[tt];
					jQuery("li.guardbutton." + tt).css('background-position', bg_offset);
					if (level)
						jQuery("li.guardbutton." + tt).css('background-color', 'white');
					else
						jQuery("li.guardbutton." + tt).css('background-color', 'darkgray');
				}
			}
		}
	},

	checkWidget : function () {
		var t = uW.btGuardWidget;
		var cityId =  unsafeWindow.currentcityid;
		for (var c=0;c<unsafeWindow.seed.guardian.length;c++)
		{
			if (unsafeWindow.seed.guardian[c].cityId == cityId)
			{
				var type = unsafeWindow.seed.guardian[c].type;
				if (t.CurrentActive != type) {
					t.drawGuardWidget();
				}
				break;
			}
		}
	},
	
	resetGuardWidget : function () {
		var t = uW.btGuardWidget;
		var e = ById('bt_guardBox');
		e.style.position = "absolute";
		e.style.top = ById('mod_maparea').offsetHeight+6+"px";
		e.style.left = "200px";
		e.style.zIndex = 100000;
		delete t.guardPosition;
		t.guardPosition = null;
		t.saveGuardPosition();
	},
		
	saveGuardPosition : function () {
		var t = uW.btGuardWidget;
		var serverID = getServerId();
		setTimeout (function (){ GM_setValue ('GuardPosition_'+serverID, JSON2.stringify(t.guardPosition));}, 0);
	},
	
	readGuardPosition : function () {
		var t = uW.btGuardWidget;
		var serverID = getServerId();
		s = GM_getValue ('GuardPosition_'+serverID);
		if (s != null){
			t.guardPosition = JSON2.parse (s);
		}
	},
	
	SwitchGuardian : function (cityId,type,notify) {
		var t = uW.btGuardWidget;
		var cIndex = Cities.byID[cityId].idx;
		if (type == Seed.guardian[cIndex].type) { return; }

		var level = Seed.guardian[cIndex].cityGuardianLevels[type];
		level = level ? level : 0;
		if (level == 0) { return; }

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.ctrl = "Guardian";
		params.action = "summon";
		params.cityId = cityId;
		params.type = type;

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var g = CM.guardianModalModel.gObj();
					g.summonGuardian = uWCloneInto({
						summonFinishTime: parseInt(rslt.summonFinishTime),
						level: rslt.summonGuardian.cl0,
						type: rslt.summonGuardian.type,
						upgrading: false
					});
					uW.seed.guardian[cIndex].type = type;
					uW.seed.guardian[cIndex].level = rslt.summonGuardian.cl0;
					var GType = 0;
					switch(type) {
						case "wood":	GType=50;break;
						case "ore":		GType=51;break;
						case "food":	GType=52;break;
						case "stone":	GType=53;break;
					}
					uW.seed.buildings["city"+ cityId].pos500[0] = GType;
					var time = parseInt(rslt.summonFinishTime) - unixTime();
					setTimeout(function(){
						uW.seed.buildings["city"+ cityId].pos500[0] = GType;
						uW.seed.guardian[cIndex].type = type;
						uW.seed.guardian[cIndex].level = rslt.summonGuardian.cl0;
					},(time*1000));
					guardianFailures = 0;
					if (notify) notify(cityId,type,true,rslt.summonFinishTime);
				}
				else { // retry?
					guardianFailures++;
					actionLog(Cities.byID[cityId].name+": Guardian change failed. Error code: " + rslt.error_code,'GENERAL');
					// try again in 2 seconds
					if (guardianFailures <=3) {
						setTimeout(t.SwitchGuardian, 2000, cityId, type, notify);
					}
					else {
						guardianFailures = 0;
						if (notify) notify(cityId,type,false);
					}
				}
			},
			onFailure: function () {
				actionLog(Cities.byID[cityId].name+": Guardian change server error",'GENERAL');
				guardianFailures = 0;
				if (notify) notify(cityId,type,false);
			}
		},true) // noretry
	},
	
}

uW.btGuardWidget = GuardWidget;
uW.btGuardWidget.init();