/***knights tab****/

Tabs.Knights = {
	tabOrder: 1050,
	tabLabel: 'Knights',
	myDiv: null,
	displayTimer: null,
	action: 0,
	MaxSkill:300,
	knightRoles : [
		['Foreman', 'politics', 'Pol'],
		['Marshall', 'combat', 'Com'],
		['Alchemyst', 'intelligence', 'Int'],
		['Steward', 'resourcefulness', 'Res'],
	],
	RaidingKnights : [],

	init: function (div) {
		var t = Tabs.Knights;
		t.myDiv = div;
		uWExportFunction('ptAssignSkill', Tabs.Knights.clickedAssignPoints);
		uWExportFunction('ptButDismiss', Tabs.Knights.postDismissKnight);
		uWExportFunction('ptButAppoint', Tabs.Knights.postAppointKnight);
		uWExportFunction('ptBoostKnight', Tabs.Knights.BoostKnight);

		var m = '<DIV class=divHeader align=center>'+tx('KNIGHT ADMINISTRATION')+'</DIV>';
		m += '<div align=center><br>'+tx('Quick Assign Knight Skill')+':&nbsp;<input style="height:20px;font-size:9px;" type=button value="'+tx('Add Default Skills')+'" id="ptknight_def">&nbsp;<input style="height:20px;font-size:9px;" type=button value="'+tx('Add Combat Skills')+'" id="ptknight_com"></div><br>';
		m += '<DIV id=ptknightdiv style="max-height:700px; height:700px; width:'+GlobalOptions.btWinSize.x+'px;overflow-x:scroll;overflow-y:scroll"></div>';

		t.myDiv.innerHTML = m;

		ById('ptknight_com').addEventListener('click', function () {
			t.action = 1;
			t.show();
		}, false);
		ById('ptknight_def').addEventListener('click', function () {
			t.action = 2;
			t.show();
		}, false);
	},

	hide: function () {
		var t = Tabs.Knights;
		clearTimeout(t.displayTimer);
	},

	show: function () {
		var t = Tabs.Knights;
		clearTimeout(t.displayTimer);

		function _dispKnight(roleId, knight, numcid) {
			var rid = roleId;
			if (roleId == null)
				rid = 1;
			var sty = 'class=evenRow ';
			if (row++ % 2) { sty = 'class=oddRow '; }
			m = '<TR ' + sty + 'valign=top align=left><TD class=xtab><B>' + (roleId == null ? '' : tx(t.knightRoles[rid][0])) + '</b></td><TD class=xtab align=left>';
			if (knight == null) {
				m += '--------</td><TD class=xtab colspan=14>&nbsp;</td></tr>';
			}
			else {
				var kimg = CM.KnightsModel.getSrc(knight.knightName);
				var level = parseInt(Math.sqrt(parseInt(knight.experience) / 75)) + 1;
				var unpoints = level - parseInt(knight.skillPointsApplied);
				var salary = (parseInt(knight.skillPointsApplied) + 1) * 20;
				totSalary += salary;
				var ass = '';
				if (knight.knightStatus == 10) {
					ass = '<TD class=xtab align=left colspan=4>'+t.getMarchText(knight.knightId,Cities.cities[numcid].id)+'</td>';
				}
				else {
					if (unpoints > 0) {
						if (t.action == 2) {
							t.clickedAssignPoints(null, cid, knight.knightId, rid);
						}
						if (t.action == 1) {
							t.clickedAssignPoints(null, cid, knight.knightId, 1);
						}
						var assignable = false;
						for (var i = 0; i < 4; i++) {
							var sty = 'padding-left:1px;';
							if (i == rid) // bold it
								sty += 'font-weight:bold;color:#116654';
							ass += '<td width=26 class=xtab align="left" style="'+sty+'">';
							if (knight[t.knightRoles[i][1]] < t.MaxSkill) {
								assignable = true;
								ass += '<a class=xlink title="' + uW.g_js_strings.modaltitles.assignskills + '" style="' + sty + '" onclick="ptAssignSkill(this,' + cid + ',' + knight.knightId + ',' + i + ')">[' + tx(t.knightRoles[i][2]) + ']</a>';
							} else {
								ass += '<span style="color: #006600; font-size: 10px; font-weight: normal;">(max)</span>';
							}
							ass += '</td>';
						}
						if (assignable) {
							unpoints = '<SPAN class="boldRed">' + unpoints + '</span>';
						}
					}
					else { ass = '<TD class=xtab colspan=4>&nbsp;</td>'; }
				}
				var skills = [];
				for (var i = 0; i < 4; i++) {
					var skillamount = knight[t.knightRoles[i][1]];
					var boosted = false;
					switch (i) {
						case 0:
							if (knight.politicsBoostExpireUnixtime > unixTime()) { skillamount *= 1.25; boosted=true;}
							break;
						case 1:
							if (knight.combatBoostExpireUnixtime > unixTime()) { skillamount *= 1.25; boosted=true;}
							break;
						case 2:
							if (knight.intelligenceBoostExpireUnixtime > unixTime()) { skillamount *= 1.25; boosted=true;}
							break;
						case 3:
							if (knight.resourcefulnessBoostExpireUnixtime > unixTime()) { skillamount *= 1.25; boosted=true;}
							break;
					}
					if (boosted) {skillamount='<span style="color:#080;">'+Math.floor(skillamount)+'</span>';}
					if (i == rid)
						skills[i] = '<B>' + skillamount + '</b>';
					else
						skills[i] = skillamount;
				}
				var item211 = "";
				var item221 = "";
				var item231 = "";
				var item241 = "";
				if (Seed.items.i211 && Seed.items.i211>0) item211 = '<a onclick="ptBoostKnight(this,'+Cities.cities[numcid].id+','+knight.knightId+',\'i211\')"><img height=20 class=btTop src="'+RoseImage+'" title="'+itemTitle(211)+'"></a>';
				if (Seed.items.i221 && Seed.items.i221>0) item221 = '<a onclick="ptBoostKnight(this,'+Cities.cities[numcid].id+','+knight.knightId+',\'i221\')"><img height=20 class=btTop src="'+GauntletImage+'" title="'+itemTitle(221)+'"></a>';
				if (Seed.items.i231 && Seed.items.i231>0) item231 = '<a onclick="ptBoostKnight(this,'+Cities.cities[numcid].id+','+knight.knightId+',\'i231\')"><img height=20 class=btTop src="'+MirrorImage+'" title="'+itemTitle(231)+'"></a>';
				if (Seed.items.i241 && Seed.items.i241>0) item241 = '<a onclick="ptBoostKnight(this,'+Cities.cities[numcid].id+','+knight.knightId+',\'i241\')"><img height=20 class=btTop src="'+GlovesImage+'" title="'+itemTitle(241)+'"></a>';
				m += '<img class=btTop width=20 src="'+kimg+'"><a class=xlink title="'+tx('Assign Role')+'" onclick="pthideMe();citysel_click(document.getElementById(\'citysel_' + (numcid + 1) + '\'));setTimeout (function (){ assign_role_modal(' + knight.knightId + ');return false;}, 500);">' + knight.knightName + '</td>';
				m += '<TD class=xtab style="vertical-align:middle;">'+skills[0]+'</td><TD class=xtab style="vertical-align:middle;">'+skills[1]+'</td><TD class=xtab style="vertical-align:middle;">'+skills[2]+'</td><TD class=xtab style="vertical-align:middle;">'+skills[3]+'</td>';
				m += '<TD class=xtab align=left>'+item211+'&nbsp;'+item221+'&nbsp;'+item231+'&nbsp;'+item241+'</td><TD width=26 class=xtab align=left>' + unpoints + '</td>' + ass + '<TD class=xtab align=right><a class=xlink title="'+tx('Experience Boost')+'" onclick="pthideMe();citysel_click(document.getElementById(\'citysel_' + (numcid + 1) + '\'));setTimeout (function (){ xpBoost_modal(' + knight.knightId + ');return false; }, 500);">' + level + '</a></td>';
				m += '<td class=xtab align=right><a class=xlink title="'+tx('Loyalty Boost')+'" onclick="pthideMe();citysel_click(document.getElementById(\'citysel_' + (numcid + 1) + '\'));setTimeout (function (){ loyalBoost_modal(' + knight.knightId + ');return false;}, 500);">' + knight.loyalty + '</a></td>';
				m += '<TD class=xtab align=right>' + addCommas(salary) + '</td><TD align=center class=xtab>'+strButton8(tx('Dismiss'), 'onclick="ptButDismiss(' + knight.knightId + ',' + cid + ')"')+'</td></tr>';
			}
			return m;
		}

		var totSalary = 0;
		var m = '<TABLE width=98% cellspacing=0 align=center>';
		for (var c = 0; c < Cities.numCities; c++) {
			var cid = Cities.cities[c].id;
			var cKnights = Seed.knights['city' + cid];
			var totk = 0;
			if (matTypeof(cKnights) == 'object') {
				for (var k in cKnights)
					++totk;
			}
			m += '<TR><TD class=xtab colspan=16><DIV class=divHeader align=center><TABLE width=100% cellspacing=0><TR><TD class=xtab width=100>&nbsp;</TD><td class=xtab align=center>' + Cities.cities[c].name + '</td><TD class=xtab width=100 align=right>'+tx('Knights')+': '+totk+'&nbsp;</TD></tr></table></div></td></tr>\
				<TR><TD class=xtabHD width=70>'+tx('Role')+'</td><TD class=xtabHD width=140 align=left>'+uW.g_js_strings.commonstr.nametx+'</td><TD class=xtabHD width=26>'+tx('Pol')+'</td><TD class=xtabHD width=26>'+tx('Com')+'</td>\
				<TD class=xtabHD width=26>'+tx('Int')+'</td><TD class=xtabHD width=26>'+tx('Res')+'</td><TD class=xtabHD align=center width=40>'+tx('Boosts')+'</td><TD class=xtabHD width=90 align=center colspan=5>'+htmlTitleLine(tx('Unassigned'))+'</td><TD class=xtabHD align=right width=35>'+uW.g_js_strings.commonstr.level+'</td><td class=xtabHD align=right width=40>'+tx('Loyalty')+'</td><TD class=xtabHD width=40 align=right>'+tx('Salary')+'</td><TD class=xtabHD width=70 align=center>'+tx('Dismiss')+'</td></tr>';
			totSalary = 0;
			var did = {};
			var row = 0;
			for (var i = 0; i < t.knightRoles.length; i++) {
				var leader = Seed.leaders['city' + cid][t.knightRoles[i][1] + 'KnightId'];
				if (leader == 0)
					m += _dispKnight(i, null, c);
				else {
					m += _dispKnight(i, Seed.knights['city' + cid]['knt' + leader], c);
					did['knt' + leader] = true;
				}
			}
			var list = [];
			for (var k in Seed.knights['city' + cid]) {
				if (!did[k])
					list.push(Seed.knights['city' + cid][k]);
			}
			list.sort(function (a, b) {
				return parseInt(b.combat) - parseInt(a.combat)
			});
			for (var i = 0; i < list.length; i++)
				m += _dispKnight(null, list[i], c, cid);
			m += '<TR align=right><TD class=xtab>&nbsp;</td><td class=xtab align=left>'+strButton14(tx('Appoint a Knight'), 'onclick="pthideMe();ptButAppoint('+c+')"')+'</td><TD class=xtab align=right colspan=12><B>'+tx('Total Salary')+':</b></td><TD class=xtab align=right><b>'+addCommas(totSalary)+'</b></td></tr>';
			m += '<TR align=right><TD class=xtab colspan=16>&nbsp;</td></tr>';
		}
		m += '</table><br>';
		ById('ptknightdiv').innerHTML = m;
		t.action = 0;
		t.displayTimer = setTimeout(t.show, 10000);
	},

	getMarchText : function (kid, cid) {
		var t = Tabs.Knights;
		var retval = tx("marching");
		t.RaidingKnights = [];
		var citymarches = Seed.queue_atkp["city"+cid];
		if (citymarches) {
			for (var n in citymarches) {
				if (citymarches[n].knightId && citymarches[n].knightId==kid) {
					var MarchType = parseIntNan(citymarches[n].marchType);
					switch (MarchType) {
						case 1: retval = tx("transporting"); break;
						case 2: retval = tx("reinforcing"); break;
						case 3: retval = tx("scouting"); break;
						case 4: retval = tx("attacking"); break;
						case 5: retval = tx("reassigning"); break;
						case 9: retval = tx("raiding"); break;
						case 10: retval = tx("attacking dark forest"); break;
						default: retval = tx("marching");
					}
				}
			}
		}
		return retval;
	},

	postDismissKnight: function (kid, cid) {
		var t = Tabs.Knights;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cid;
		params.kid = kid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/fireKnight.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					delete Seed.knights["city" + cid]["knt" + kid];
					t.show();
				}
			},
		});
	},
	postAppointKnight: function (city) {
		var t = Tabs.Knights;
		SelectCity(city+1);
		CM.KnightsAppointView.render();
	},
	clickedAssignPoints: function (e, cid, kid, rid) {
		var t = Tabs.Knights;
		clearTimeout(t.displayTimer);
		var knight = Seed.knights['city' + cid]['knt' + kid];
		if (knight.knightStatus == 10 && e != null) {
			var row = e.parentNode.parentNode;
			row.childNodes[7].innerHTML = tx('Marching');
			return;
		}
		sk = [];
		var unassigned = parseInt(Math.sqrt(parseInt(knight.experience) / 75)) + 1 - parseInt(knight.skillPointsApplied);
		for (var i = 0; i < 4; i++) {
			sk[i] = parseInt(knight[t.knightRoles[i][1]]);
			if (i == rid)
				sk[i] += unassigned;
			if (sk[i] > t.MaxSkill) {
				sk[i] = t.MaxSkill;
				unassigned = parseInt(t.MaxSkill - parseInt(knight[t.knightRoles[i][1]]));
			}
		}
		if (unassigned == 0) return;
		if (e != null) {
			var row = e.parentNode.parentNode;
			for (var i = row.cells.length - 1; i >= 1; i--)
				row.deleteCell(i);
			var newCell = row.insertCell(-1);
			newCell.colSpan = 15;
			newCell.align = 'left';
			newCell.style.padding = '1px 1px 1px 1px';
			var div = document.createElement('div');
			div.style.backgroundColor = '#ffffff';
			div.style.textAlign = 'center';
			div.style.border = '1px solid';
			div.style.width = '100%';
			div.style.whiteSpace = 'normal';
			newCell.appendChild(div);
			div.innerHTML = tx('Assigning')+' ' + unassigned + ' '+tx('skill points to')+' ' + t.knightRoles[rid][1] + ' ... ';
		}
		t.postSkillPoints(cid, kid, sk[0], sk[1], sk[2], sk[3], function (r) {
			t.postDone(r, div)
		});
	},
	postDone: function (rslt, div) {
		var t = Tabs.Knights;
		clearTimeout(t.displayTimer);
		if (rslt.ok) {
			if (div) div.innerHTML += '<B>Done.</b>';
			t.displayTimer = setTimeout(t.show, 5000);
		} else {
			if (div) div.innerHTML += '<BR><SPAN class=boldRed>ERROR: ' + rslt.errorMsg + '</span>';
			t.displayTimer = setTimeout(t.show, 5000);
		}
	},
	postSkillPoints: function (cid, kid, pol, com, int, res, notify) {
		var t = Tabs.Knights;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cid;
		params.kid = kid;
		params.p = pol;
		params.c = com;
		params.i = int;
		params.r = res;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/skillupKnight.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var knight = Seed.knights["city" + cid]["knt" + kid];
					var up = pol + com + int + res - knight.politics - knight.combat - knight.intelligence - knight.resourcefulness;
					knight.politics = pol;
					knight.combat = com;
					knight.intelligence = int;
					knight.resourcefulness = res;
					knight.skillPointsApplied = (parseInt(knight.skillPointsApplied) + up).toString();
				}
				if (notify)
					notify(rslt);
			},
			onFailure: function () {
				if (notify)
					notify(rslt);
			},
		});
	},
	BoostKnight : function (e,cid,kid,item) {
		var t = Tabs.Knights;
		if (e != null) {
			var row = e.parentNode.parentNode;
			for (var i = row.cells.length - 1; i >= 1; i--)
				row.deleteCell(i);
			var newCell = row.insertCell(-1);
			newCell.colSpan = 15;
			newCell.align = 'left';
			newCell.style.padding = '1px 1px 1px 1px';
			var div = document.createElement('div');
			div.style.backgroundColor = '#ffffff';
			div.style.textAlign = 'center';
			div.style.border = '1px solid';
			div.style.width = '100%';
			div.style.whiteSpace = 'normal';
			newCell.appendChild(div);
			div.innerHTML = tx('Applying')+' ' + uW.itemlist[item].name + ' ... ';
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.iid = item.substring(1);
		params.cid = cid;
		params.kid = kid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/boostKnight.php" + uW.g_ajaxsuffix, {
			method : "post",
			parameters : params,
			onSuccess : function (rslt) {
				if (rslt.ok) {
					switch (item) {
						case "i211":
							uW.seed.knights["city" + cid]["knt" + kid].politicsBoostExpireUnixtime = rslt.expiration.toString();
							break;
						case "i221":
							uW.seed.knights["city" + cid]["knt" + kid].combatBoostExpireUnixtime = rslt.expiration.toString();
							break;
						case "i231":
							uW.seed.knights["city" + cid]["knt" + kid].intelligenceBoostExpireUnixtime = rslt.expiration.toString();
							break;
						case "i241":
							uW.seed.knights["city" + cid]["knt" + kid].resourcefulnessBoostExpireUnixtime = rslt.expiration.toString();
							break;
						default:
							return false
					}
					uW.seed.items[item] = parseInt(uW.seed.items[item]) - 1;
					uW.ksoItems[item.substring(1)].subtract();
					CM.MixPanelTracker.track("item_use", uWCloneInto({
						item : uW.itemlist[item].name,
						usr_gen : Seed.player.g,
						usr_byr : Seed.player.y,
						usr_ttl : uW.titlenames[Seed.player.title],
						distinct_id : uW.tvuid
					}))
					t.show();
				}
			},
		},true); // noretry
	},

}
