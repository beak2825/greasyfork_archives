/*********************************** Tournament Tab ***********************************/
// @tabversion 20171116

Tabs.Tournament = {
	tabOrder: 1100,
	tabLabel: 'Tournament',
	myDiv: null,
	displayTimer: null,
	Options : {
		TourneyTroopType: 2,
		TourneyBoardType: 1,
		TournamentLines: 5,
	},

	init: function (div) {
		var t = Tabs.Tournament;
		t.myDiv = div;

		if (!Options.TournamentOptions) {
			Options.TournamentOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.TournamentOptions.hasOwnProperty(y)) {
					Options.TournamentOptions[y] = t.Options[y];
				}
			}
		}

		t.tourneyPos = 0;
		uWExportFunction('ptSetTourneyPos', Tabs.Tournament.SetTourneyPos);

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.format = 2;
		params.tournyPos = 0;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getTOMLeaderboard.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if(rslt.endDate>uW.unixtime()) {
					var elem = ById("bttcTournament");
					elem.setAttribute("style","color:#f00");
				}
			},
		},true);
	},

	SetTourneyPos : function (tab) {
		var t = Tabs.Tournament;
		t.tourneyPos = tab;
		t.paintTournament();
	},

	hide: function () {
		var t = Tabs.Tournament;
		clearTimeout(t.displayTimer);
	},

	show: function () {
		var t = Tabs.Tournament;
		clearTimeout(t.displayTimer);
		var m = '<div class=divHeader align=center>'+tx('TOURNAMENT')+'</div><div id=BTHeaderDiv>&nbsp;</div>';
		m += '<DIV class=divHeader align=center>'+tx('POPULATION AND PRODUCTION INFORMATION')+'</div><div id=BTPopDiv>&nbsp;</div>';
		m += '<div id=BTDetailDiv style="max-height:535px; overflow-y:scroll" align="center">&nbsp;</div><br>';
		t.myDiv.innerHTML = m;
		t.paintPopulation();
		t.paintTournament();
		t.displayTimer = setTimeout(t.paintTournament, 240000);
	},
	expand: function (lg) {
		var t = Tabs.Tournament;
		if (ById('BOTourneyPM').value == "Maximize") {
			ById('BOTourneyPM').value = "Minimize";
			Options.TournamentOptions.TournamentLines = lg;
		} else {
			ById('BOTourneyPM').value = "Maximize";
			Options.TournamentOptions.TournamentLines = 5;
		}
		saveOptions();
		t.paintTournament();
	},
	leadertoggle: function () {
		var t = Tabs.Tournament;
		if (Options.TournamentOptions.TourneyBoardType == 1) {
			Options.TournamentOptions.TourneyBoardType = 2;
		} else {
			Options.TournamentOptions.TourneyBoardType = 1;
		}
		saveOptions();
		t.paintTournament();
	},

	paintPopulation: function () {
		var t = Tabs.Tournament;
		var mhtl = "<table width=100% class=xtab><tr><td>&nbsp;</td>";
		for (var i = 0; i < Cities.numCities; i++) {
			mhtl += "<TD align=center valign=bottom width=60px><B>" + Cities.cities[i].name + "</B></TD>";
		}
		mhtl += "</tr><tr class=oddRow><td>";
		mhtl += '<SELECT id="TTroopsPerHr">';
		for (var y in uW.unitnamedesctranslated) {
			if (!uW.cm.BarracksUnitsTypeMap.isUnitType(y.substr(3), "rare")) {
				if (y.substr(3) == Options.TournamentOptions.TourneyTroopType) { mhtl += '<option selected value="' + y.substr(3) + '">' + uW.unitnamedesctranslated[y][0] + '</option>'; }
				else {	mhtl += '<option value="' + y.substr(3) + '">' + uW.unitnamedesctranslated[y][0] + '</option>'; }
//				if (y.substr(3) > 4) break; // only 1 pop per troop makes sense	here
			}
		}
		mhtl += '</select>';
		mhtl += "&nbsp;"+tx('/h')+"</td>";
		var temps = [];
		for (var i = 0; i < Cities.numCities; i++) {
			temps[i] = (3600 / (getTrainTime(Options.TournamentOptions.TourneyTroopType,100000,Cities.cities[i].id)/100000));
			if (temps[i]!= 'Infinity' && !isNaN(temps[i])) { mhtl += "<td align=right><div class=xtabBorder>" + addCommas(parseInt(temps[i])) + "</div></td>"; }
			else {	mhtl += "<td align=right><div class=xtabBorder>n/a</div></td>";	}
		}
		mhtl += '</tr><tr class=evenRow><td>'+TroopImage(Options.TournamentOptions.TourneyTroopType,'width:20px;height:20px;vertical-align:middle;')+' '+tx('Might Gain/h')+'</td>';
		var mght = [];
		for (var i = 0; i < Cities.numCities; i++) {
			cityID = 'city' + Cities.cities[i].id;
			mght[i] = temps[i]*uW.unitstats["unt"+Options.TournamentOptions.TourneyTroopType][6];
			mhtl += "<td align=right><div class=xtabBorder>" + addCommas(parseInt(mght[i])) + "</div></td>";
		}
		mhtl += '</tr><tr class=oddRow><td><img height=18 src="'+IMGURL+'population_40.png" title="Population Usage"> '+tx('Population Usage/h')+'</td>';
		var temps2 = [];
		for (var i = 0; i < Cities.numCities; i++) {
			cityID = 'city' + Cities.cities[i].id;
			temps2[i] = temps[i]*uW.unitcost["unt"+Options.TournamentOptions.TourneyTroopType][6];
			mhtl += "<td align=right><div class=xtabBorder>" + addCommas(parseInt(temps2[i])) + "</div></td>";
		}
		mhtl += '</tr><tr class=evenRow><td><img height=18 src="'+IMGURL+'population_40.png" title="Population Growth"> '+tx('Population Growth/h')+'</td>';
		var pop = [];
		for (var i = 0; i < Cities.numCities; i++) {
			cityID = 'city' + Cities.cities[i].id;
			pop[i] = parseIntNan(Seed.citystats[cityID]["pop"][1]) / 2;
			mhtl += "<td align=right><div class=xtabBorder>" + addCommas(parseInt(pop[i])) + "</div></td>";
		}
		mhtl += "</tr><tr><td><b>"+tx('Difference')+"</b></td>";
		var diff = 0;
		for (var i = 0; i < Cities.numCities; i++) {
			diff = parseIntNan(pop[i]) - parseIntNan(temps2[i]);
			var bonc = "";
			if (diff < 0) bonc = "whiteOnRed";
			mhtl += "<td align=right><div class='xtabBorder "+bonc+"'><b>"+addCommas(parseInt(diff))+"</b></div></td>";
		}
		mhtl += '</tr><tr><td><img height=18 src="'+IMGURL+'happiness.png title=Happiness> '+tx('happiness')+'</td>';
		for (var i = 0; i < Cities.numCities; i++) {
			cityID = 'city' + Cities.cities[i].id;
			var bon = parseInt(Seed.citystats[cityID]["pop"][2]);
			var bonc = "whiteOnRed";
			if (bon > 99) bonc = "whiteOnGreen";
			mhtl += "<td align=center><div class='xtabBorder "+bonc+"'><b>"+bon+"%</div></td>";
		}
		var now = unixTime();
		mhtl += "</tr><tr><td><b>"+tx('Queue')+"</b></td>";
		for (var i = 0; i < Cities.numCities; i++) {
			cityID = 'city' + Cities.cities[i].id;
			var totTime = 0;
			var q = Seed.queue_unt[cityID];
			if (q != null && q.length > 0)
				totTime = q[q.length - 1][3] - now;
			if (totTime < 0) totTime = 0;
			var bonc = "";
			if (totTime < 3600) bonc = "whiteOnRed";
			mhtl += "<td align=center><div class='xtabBorder "+bonc+"'><b>"+timestr(totTime)+"</div></td>";
		}
		mhtl += "</tr></table><br>";

		ById('BTPopDiv').innerHTML = mhtl;
		ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);

		ChangeOption('TournamentOptions','TTroopsPerHr','TourneyTroopType',t.paintPopulation);
	},

	paintTournament : function () {
		var t = Tabs.Tournament;

		ById('BTDetailDiv').innerHTML = "<div align=center>"+tx('Loading')+"...</div>";

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.format = 2;
		params.tournyPos = t.tourneyPos;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getTOMLeaderboard.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var prevs = [];
					for (var s = 0; s < 4; s++) {
						w = rslt["previous" + s];
						if (w && w > -1) {
							prevs.push(uW.formatDateByUnixTime(w));
						}
					}
					if (!rslt.data) {
						var m = "<div><br><center><b>"+tx('No Active Tournaments')+"!</b></center></div>";
						for (var s = 0; s < prevs.length; s++) {
							m += "<div><br><center><b><a class=xlink onclick='ptSetTourneyPos(" + s + 1 + ")'>"+tx('Show Tournament that ended on')+" " + prevs[s] + "</a></b></center></div>";
						}
						m += '<br>';
						ById('BTHeaderDiv').innerHTML = m;
						ById('BTDetailDiv').innerHTML = tx("No Results");
						ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
					} else { // rslt.data
						var m = "";
						if (t.tourneyPos != 0) {
							m += "<div><br><center><b><a class=xlink onclick='ptSetTourneyPos(0)'>"+tx('Show Current Tournament (if any)')+"</a></b></center></div>";
						}
						for (var s = 0; s < prevs.length; s++) {
							if (t.tourneyPos != (s + 1)) {
								m += "<div><br><center><b><a class=xlink onclick='ptSetTourneyPos(" + s + 1 + ")'>"+tx('Show Tournament that ended on')+" " + prevs[s] + "</a></b></center></div>";
							}
						}
						m += '<br>';
						ById('BTHeaderDiv').innerHTML = m;
						ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);

						var n = '';
						if (rslt.name) {
							n += "<div class=divHeader align=center>" + rslt.name.toUpperCase() + "</div>";
						} else {
							n += "<div class=divHeader align=center>" + uW.g_js_strings.commonstr.tournament.toUpperCase() + "</div>";
						}
						if (rslt.description) {
							n += "<div align=center>" + rslt.description + "<br>&nbsp;</div>";
						}
						n += "<div>";
						if (rslt.startDate && rslt.endDate) {
							var startTime = rslt.startDate;
							var endTime = rslt.endDate;
							var now = parseInt(new Date().getTime() / 1000);
							n += "<table width=98% align=center class=xtab><tr><td width=40%><b>"+tx('Starts')+"</td><td width=40%><b>"+tx('Ends')+"</td><td align=right width=20%><b>"+tx('Time Left')+"</td></tr>";
							dt = new Date();
							dt.setTime(startTime * 1000);
							dtf = new Date();
							dtf.setTime(endTime * 1000);
							var remain = endTime - now;
							n += "<tr><td>"+formatUnixTime(rslt.startDate)+"</td><td>"+formatUnixTime(rslt.endDate);
							if (remain > 0) {
								n += "</td><td align=right>" + timestr(remain, 1) + "</td></tr></table>";
							} else {
								n += "</td><td align=right>"+tx('ENDED')+"!</td></tr></table>";
							}
							n +="<br>";
						}
						if ((Options.TournamentOptions.TourneyBoardType == 2) && rslt.worldPlayer) {
							n += '<center>';
							n += '<table class=xtab width="98%" cellpadding="0" cellspacing="0" border="0"><tr><td width="25%"><b>'+rslt.worldPlayer.name||tx('Your Stats');
							n += '</b></td><td align=center>';
							if (rslt.type == 25) { n += uW.g_js_strings.modal_tourny_changetab.glorygained+':&nbsp;'; }
							else { n += uW.g_js_strings.modal_tourny_changetab.mightgained+':&nbsp;'; }
							n += addCommas(rslt.worldPlayer.contestValue||0);
							n += '</td><td width="25%" align=right>';
							n += uW.g_js_strings.commonstr.ranking+':&nbsp;'+(rslt.worldPlayer.ranking||'N/A')+'&nbsp;('+rslt.bracketName+')';
							n += '</td></tr></table></center><br>';
						}
						else {
							if (rslt.player) {
								n += '<center>';
								n += '<table class=xtab width="98%" cellpadding="0" cellspacing="0" border="0"><tr><td width="25%"><b>'+rslt.player.name||tx('Your Stats');
								n += '</b></td><td align=center>';
								if (rslt.type == 25) { n += uW.g_js_strings.modal_tourny_changetab.glorygained+':&nbsp;'; }
								else { n += uW.g_js_strings.modal_tourny_changetab.mightgained+':&nbsp;'; }
								n += addCommas(rslt.player.contestValue||0);
								n += '</td><td width="25%" align=right>';
								n += uW.g_js_strings.commonstr.ranking+':&nbsp;'+(rslt.player.ranking||'N/A')+'&nbsp;('+uW.g_js_strings.modal_tourny_changetab.domainLeaders.replace("%1$s", uW.domainName)+')';
								n += '</td></tr></table></center><br>';
							}
						}

						if ((Options.TournamentOptions.TourneyBoardType != 2) || !rslt.worldData) {
							tourneystats = rslt.data;
							allititle = uW.g_js_strings.commonstr.alliance;
							brackettitle = uW.g_js_strings.modal_tourny_changetab.domainLeaders.replace("%1$s", uW.domainName);
							Options.TournamentOptions.TourneyBoardType = 1;
							saveOptions();
						} else {
							tourneystats = rslt.worldData;
							allititle = tx('Server');
							brackettitle = rslt.bracketName;
						}
						n += '<center>';
						n += '<table class=xtab width="98%" cellpadding="0" cellspacing="0" border="0"><tr><td width="25%"><input type=button id=BTLeaders value="-"></td><td align=center>';
						if (rslt.lastUpdated && (t.tourneyPos == 0)) {
							var now = parseInt(new Date().getTime() / 1000);
							var lastUpdated = convertTime(new Date(rslt.lastUpdated.replace(" ","T")+"Z"));
							var updated = now - lastUpdated;
							n += "<div>"+tx('Last updated')+" " + timestr(updated, 1) + " "+tx('ago')+".</div>";
						}
						n += '</td><td width="25%" align=right><input type=button id=BOTourneyPM value="-">';
						var TitleColour = 'rgba('+HEXtoRGB(Options.Colors.PanelText).r+','+HEXtoRGB(Options.Colors.PanelText).g+','+HEXtoRGB(Options.Colors.PanelText).b+',0.5)';
						n += '</td></tr></table><div style="color:'+TitleColour+';font-size:14px;"><b>';
						if (Options.TournamentOptions.TourneyBoardType != 2) {
							n += uW.g_js_strings.modal_tourny_changetab.domainLeaders.replace("%1$s", uW.domainName);
						} else {
							n += rslt.bracketName;
						}
						n += '</b></div>';
						n += "<table cellSpacing=0 width=90% height=0%><tr>";
						if (rslt.type == 24 && rslt.subType=="A") { // alliance?
							n += "<td class=xtabHD>"+uW.g_js_strings.commonstr.ranking+"</td><td class=xtabHD>"+uW.g_js_strings.commonstr.chancellor+"</td><td class=xtabHD>"+allititle+"</td><td class=xtabHD>"+uW.g_js_strings.modal_tourny_changetab.mightgained+"</td><td class=xtabHD>"+uW.g_js_strings.modal_tourny_changetab.rewardperplayer+"</td>";
						} else {
							n += "<td class=xtabHD>"+uW.g_js_strings.commonstr.ranking+"</td><td class=xtabHD>"+uW.g_js_strings.commonstr.player+"</td><td class=xtabHD>"+allititle+"</td><td class=xtabHD>";
							if (rslt.type == 24) { n += uW.g_js_strings.modal_tourny_changetab.mightgained; }
							else {
								if (rslt.type == 25) { n += uW.g_js_strings.modal_tourny_changetab.glorygained; }
								else { n += rslt.contestcategory; }
							}
							n += "</td><td class=xtabHD>"+uW.g_js_strings.commonstr.reward+"</td>";
						}
						n += "</tr>";
						var nb = tourneystats.length;
						var YourScore = rslt.player.contestValue||0;
						for (var i = 0; i < Options.TournamentOptions.TournamentLines; i++) {
							if (tourneystats[i] == null) break;
							var row = tourneystats[i];
							var rewardString = " ";
							if (row.itemType) {
								rewardString = row.itemCount + " ";
								if (row.itemType == 0) {
									rewardString += uW.g_js_strings.commonstr.gems;
								} else {
									rewardString += uW.itemlist["i" + row.itemType].name;
								}
							}
							var rowcol = "";
							if (rslt.type == 24 && rslt.subType=="A") { //Alliance Tournament
								if (getMyAlliance()[1] == row.alliance) { rowcol = "whiteOnGreen"; }
							} else {
								if (uW.tvuid == row.userId) { rowcol = "whiteOnGreen"; }
							}
							if (i % 2 == 1) { n += "<tr class=oddRow>"; }
							else { n += "<tr class=evenRow>"; }
							n += "<td class='xtab "+rowcol+"'><b>"+row.ranking+"</b></td><td class='xtab "+rowcol+"'>"+row.name+"</td><td class='xtab "+rowcol+"'>"+(row.alliance || "---")+"</td><td class='xtab "+rowcol+"'>"+addCommas(row.contestValue);
							if (YourScore > 0) {
								var ScoreDiff = parseInt(row.contestValue - YourScore);
								if (ScoreDiff > 0) { n += " (+" + addCommas(ScoreDiff) + ")"; }
								if (ScoreDiff < 0) { n += " (" + addCommas(ScoreDiff) + ")"; }
							}
							n += "</td><td class='xtab "+rowcol + "'>"+rewardString+"</td></tr>";
						}
						if (rslt.type != 24 || rslt.subType!="A") {
							for (var i = Options.TournamentOptions.TournamentLines; i < tourneystats.length; i++) {
								if (tourneystats[i] == null) break;
								var row = tourneystats[i];
								var rowcol = "whiteOnGreen";
								if (uW.tvuid == row.userId) {
									var rewardString = " ";
									if (row.itemType) {
										rewardString = row.itemCount + " ";
										if (row.itemType == 0) {
											rewardString += uW.g_js_strings.commonstr.gems;
										} else {
											rewardString += uW.itemlist["i" + row.itemType].name;
										}
									}
									n += "<tr><td class='xtab "+rowcol+"'><b>"+row.ranking+"</b></td><td class='xtab "+rowcol+"'>"+row.name+"</td><td class='xtab "+rowcol+"'>"+(row.alliance || "---")+"</td><td class='xtab "+rowcol+"'>"+addCommas(row.contestValue)+"</td><td class='xtab "+rowcol+"'>"+rewardString+"</td></tr>";
								}
							}
						}
						n += "</table></div>";
						ById('BTDetailDiv').innerHTML = n;
						ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);

						ById('BOTourneyPM').addEventListener('click', function () {
							var lg = tourneystats.length;
							t.expand(lg);
						}, false);
						if (Options.TournamentOptions.TournamentLines == 5) {
							ById('BOTourneyPM').value = tx("Maximize");
						} else {
							ById('BOTourneyPM').value = tx("Minimize");
							Options.TournamentOptions.TournamentLines = tourneystats.length;
						}
						if (Options.TournamentOptions.TourneyBoardType != 2) {
							ById('BTLeaders').value = rslt.bracketName;
						} else {
							ById('BTLeaders').value = tx("Show Your Bracket")+" (" + uW.g_js_strings.modal_tourny_changetab.domainLeaders.replace("%1$s", uW.domainName) + ")";
						}
						if (!rslt.worldData) {
							ById('BTLeaders').style.display = 'none';
						}
						ById('BTLeaders').addEventListener('click', function () {
							t.leadertoggle();
						}, false);
					}
				} else {
					ById('BTDetailDiv').innerHTML = "<div align=center>"+tx('No Information')+"</div>";
					ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
				}
			},
			onFailure: function () {
				ById('BTDetailDiv').innerHTML = "<div align=center>"+tx('Error Reading Tournament Information')+"</div>";
				ResetFrameSize('btMain',100,GlobalOptions.btWinSize.x);
			}
		},true);
	},
}

