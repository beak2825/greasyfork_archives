// ==UserScript==
// @name         GBF Leech
// @namespace    http://tampermonkey.net/
// @version      1.1.4.1
// @description  Grind Smart
// @author       eterNEETy
// @match        http://game.granbluefantasy.jp/
// @grant        none
// @namespace    https://greasyfork.org/users/292830
// @require https://greasyfork.org/scripts/383201-neet-lib/code/NEET%20Lib.js?version=724954
// @downloadURL https://update.greasyfork.org/scripts/383202/GBF%20Leech.user.js
// @updateURL https://update.greasyfork.org/scripts/383202/GBF%20Leech.meta.js
// ==/UserScript==
// jshint esversion: 6
// jshint -W138


// custom variable;
my_profile = 'Pilot-00: ';
path.main = '#quest/assist';
const message = getMessage(my_profile);
monsters_name = ["Lvl 120 Europa","Lvl 120 Godsworn Alexiel","Lvl 120 Grimnir"];
reloadable_skill.push('Intense Bullet +');

const regalia_raids = ['Shiva (Impossible)', 'Europa (Impossible)', 'Godsworn Alexiel (Impossible)', 'Grimnir (Impossible)', 'Metatron (Impossible)', 'Avatar (Impossible)'],
	leech_raids = ['Prometheus (Impossible)'],
	// leech_raids = ['Prometheus (Impossible)', 'Morrigna (Impossible)', 'Hector (Impossible)'],
	honor_raids = [regalia_raids[0]];
// monsters_name = ["Lvl 100 Grand Order","Lvl 100 Dark Angel Olivia","Lvl 100 Apollo","Lvl 100 Twin Elements","Lvl 100 Macula Marius"];
monsters_name = ['Lvl 120 Shiva'];

let min_bp = 2;
let ideal_bp = 8;
let room_id = "placeholder room_id";
let consumable_status = "placeholder consumable_status";

let el_tab_multi = "#tab-multi";
let el_tab_id = "#tab-id";





function checkAssistPreReq(rep) {
	let gotoTabMulti = function () {
		let check_gotoTabMulti = function() {
			clickAndCheck(el_tab_multi,0,el_tab_multi+".active",0,my_profile+"Clicking tab_multi");
		};
		let init_gotoTabMulti = function() {
			if (checkExist(el_tab_multi,0)) {
				let cmd = [];
				cmd.push({"cmd":"clickIt","param":getCoord(document.querySelectorAll(el_tab_multi)[0])});
				cmd.push({"cmd":"log","level":"process","msg":my_profile+"Clicking tab_multi"});
				cmd.push({"cmd":"set_gbf_state","stateId":0});
				xhr.open("POST", server);
				xhr.send(JSON.stringify(cmd));
				check_gotoTabMulti();
			}
		};
		checkEl(el_tab_multi,0,init_gotoTabMulti);
	};

	let checkUnclaimedExist = function() {
		let el_unclaimed = ".btn-unclaimed";
		if (document.querySelector(el_unclaimed) !== null) {
			gotoHash("unclaimed");
		}else{
			gotoTabMulti();
		}
	};
	if (rep.option.user_status.bp >= min_bp) {
		let el_baloon = ".txt-baloon";
		checkEl(el_baloon,0,checkUnclaimedExist);
	}else{
		gotoHash("item");
	}
}

function checkAssist(rep) {
	console.log(checkAssist.name);
	reload(10);
	let picked_raid = false;
	let boss_hp = 0;
	let boss_id = 99;
	let member = 30;
	if (Object.keys(rep.check_list.assist).length<3) {
		let el_input_id = ".frm-battle-key";
		let updateState = function() {
			let sendCmd = function() {
				let cmd = [];
				cmd.push({"cmd":"set_gbf_state","stateId":1});
				xhr.open('POST', server);
				xhr.send(JSON.stringify(cmd));
			};
			checkEl(el_input_id,0,sendCmd);
			clearInterval(reload_counter);
		};
		let clickTabId = function() {
			clickAndCheck(el_tab_id,0,el_tab_id+".active",0,my_profile+"Clicking tab_id",updateState);
		};
		for (const i in rep.assist_raids_data) {
			if (rep.assist_raids_data.hasOwnProperty(i)) {
				const raid = rep.assist_raids_data[i];
				if (rep.check_list.assist[raid.raid.multi_raid_id]===undefined) {
					if (honor_raids.indexOf(raid.chapter_name)>=0 && raid.boss_hp_width > 50 && raid.member_count <= 6) {
						if (picked_raid !== false && leech_raids.indexOf(rep.assist_raids_data[picked_raid].chapter_name)>=0) {
							picked_raid = i;
							boss_hp = raid.boss_hp_width;
							boss_id = leech_raids.indexOf(raid.chapter_name);
							member = raid.member_count;
						} else {
							if (raid.member_count < member) {
								picked_raid = i;
								boss_hp = raid.boss_hp_width;
								boss_id = leech_raids.indexOf(raid.chapter_name);
								member = raid.member_count;
							} else if (raid.member_count == member) {
								if (leech_raids.indexOf(raid.chapter_name) < boss_id) {
									picked_raid = i;
									boss_hp = raid.boss_hp_width;
									boss_id = leech_raids.indexOf(raid.chapter_name);
									member = raid.member_count;
								} else if (leech_raids.indexOf(raid.chapter_name) == boss_id) {
									if (raid.boss_hp_width > boss_hp) {
										picked_raid = i;
										boss_hp = raid.boss_hp_width;
										boss_id = leech_raids.indexOf(raid.chapter_name);
										member = raid.member_count;
									}
								}
							}
						}
					} else if (leech_raids.indexOf(raid.chapter_name)>=0 && (picked_raid === false || honor_raids.indexOf(rep.assist_raids_data[picked_raid].chapter_name)===-1)) {
						if (raid.member_count < member) {
							picked_raid = i;
							boss_hp = raid.boss_hp_width;
							boss_id = leech_raids.indexOf(raid.chapter_name);
							member = raid.member_count;
						} else if (raid.member_count == member) {
							if (leech_raids.indexOf(raid.chapter_name) < boss_id) {
								picked_raid = i;
								boss_hp = raid.boss_hp_width;
								boss_id = leech_raids.indexOf(raid.chapter_name);
								member = raid.member_count;
							} else if (leech_raids.indexOf(raid.chapter_name) == boss_id) {
								if (raid.boss_hp_width > boss_hp) {
									picked_raid = i;
									boss_hp = raid.boss_hp_width;
									boss_id = leech_raids.indexOf(raid.chapter_name);
									member = raid.member_count;
								}
							}
						}
					}
				}
			}
		}
		
        if (picked_raid !== false) {
			let el_raid = ".prt-assist-contents.active>.prt-module>.prt-raid-list>.btn-multi-raid.lis-raid>.prt-raid-info";
			let init_pickRaid = function() {
				scrollTo(el_raid, picked_raid);
				clickEl(el_raid, picked_raid, my_profile+"Joining raid");
			};
			checkEl(el_raid,picked_raid,init_pickRaid);
		} else {
			checkEl(el_tab_id,0,clickTabId);
		}
	}else{
		let cmd = [];
		cmd.push({"cmd":"sleep","payload":2});
		cmd.push({"cmd":"clickIt","param":getCoord(document.querySelector(el_tab_multi))});
		xhr.open('POST', server);
		xhr.send(JSON.stringify(cmd));
	}
}

function raidFull(rep) {
	if (rep.result===false) {
		gotoHash("main");
	}
}

function gotoConsumables() {
	let el = ".btn-item-tabs.items";
	let init_gotoConsumables = function() {
		clickAndCheck(el+":not(.active)",0,el+".active",0,my_profile+"Clicking consumables tab");
	};
	checkEl(el,0,init_gotoConsumables);
}

function healBP(rep) {
	const balm_count = parseInt(consumable_status.find(x => x.name === recovery_items[2]).number);
	const berry_count = parseInt(consumable_status.find(x => x.name === recovery_items[3]).number);
	let el_bp_pot, bp_pot_count, bp_pot_name;
	if (balm_count > berry_count) {
		el_bp_pot = '.lis-item.se[data-index="2"]>img';
		bp_pot_count = balm_count;
		bp_pot_name = recovery_items[2];		
	} else {
		el_bp_pot = '.lis-item.se[data-index="3"]>img';
		bp_pot_count = berry_count;
		bp_pot_name = recovery_items[3];
	}
	const el_bp_pot_count = ".num-set.use-item-num";
	let el_use = ".btn-usual-use";
	// let bp = rep.status.bp;
	let clickUse = function() {
		let check_berry_count = setInterval(function() {
			if (parseInt(document.querySelector('.num-set.use-item-num').value)==(ideal_bp-rep.status.bp).toString()) {
				clearInterval(check_berry_count);
				let check_el_used = setInterval(function() {
					clickNow(el_use,0,my_profile+"Clicking use");
					if (window.location.hash != path.item) {
						clearInterval(check_el_used);
					}
				}, 300);
				// clickEl(el_use,0,my_profile+"Clicking use");
			}
		}, 300);
	};
	let setBp = function() {
		let cmd = [];
		if (bp_pot_name === recovery_items[3]) {
			cmd.push({"cmd":"clickIt","param":getCoord(document.querySelectorAll(el_bp_pot_count)[0])});
			let key = (ideal_bp-rep.status.bp).toString();
			if (key!=="1") {
				cmd.push({"cmd":"press","key":key});
			}
			cmd.push({"cmd":"press","key":"enter"});
			xhr.open('POST', server);
			xhr.send(JSON.stringify(cmd));
			clickUse();
		} else {
			clickEl(el_use,0,my_profile+"Clicking use");
		}
	};
	let init_healBP = function() {
		clickAndCheck(el_bp_pot,0,el_bp_pot_count,0,my_profile+"Clicking berry icon",setBp);
	};
	if (rep.status.bp < ideal_bp) {
		checkEl(el_bp_pot,0,init_healBP);
	}else{
		gotoHash("main");
	}
}
function itemUsed() {
	let rep = consumable_status;
	if (window.location.hash == "#item") {
		let consumable_data = my_profile+"Consumable Status:";
		for (var i = 0; i < rep.length; i++) {
			consumable_data += ("\n- "+rep[i].name+": "+rep[i].number);
		}
		let cmd = [];
		cmd.push({"cmd":"log","level":"summary","msg":consumable_data,"split":0});
		xhr.open('POST', server);
		xhr.send(JSON.stringify(cmd));
		gotoHash("main");
	}
}
function checkRaidId(rep) {
	if (rep.redirect === undefined) {
		window.location.reload();
	}else{
		room_id = rep.redirect.replace("#quest/supporter_raid/","");
		room_id = room_id.substring(0,room_id.indexOf("/"));
	}
}

function checkRaidStatus(rep) {
	console.log(checkRaidStatus.name);
	const data = decodeURIComponent(rep.data),
	start_name_keyword = '<div class="txt-raid-name">',
	start_name_id = data.indexOf(start_name_keyword)+start_name_keyword.length,
	end_name_keyword = '.</div>',
	end_name_id = data.indexOf(end_name_keyword,start_name_id),
	data_name = data.substring(start_name_id,end_name_id),
	start_players_keyword = '<div class="prt-flees-in">',
	start_players_id = data.indexOf(start_players_keyword)+start_players_keyword.length,
	end_players_keyword = '</div>',
	end_players_id = data.indexOf(end_players_keyword,start_players_id),
	data_players = data.substring(start_players_id,end_players_id),
	joined_players = parseInt(data_players.substring(0,data_players.indexOf("/"))),
	start_hp_keyword = '<div class="prt-raid-gauge-inner" style="width: ',
	start_hp_id = data.indexOf(start_hp_keyword)+start_hp_keyword.length,
	end_hp_keyword = '%;"></div>',
	end_hp_id = data.indexOf(end_hp_keyword,start_hp_id),
	data_hp = parseInt(data.substring(start_hp_id,end_hp_id));

	let summon_list;
	let blue_box_raid = false;
	if (data_name == regalia_raids[1] || data_name == regalia_raids[2] || data_name == regalia_raids[0]) {
		summon_list = [huanglong];
		blue_box_raid = true;
	}else if (data_name == regalia_raids[3]) {
		summon_list = [shiva];
		blue_box_raid = true;
	} else {
		summon_list = leech_summons;
	}

	let join_raid = true;
	if (blue_box_raid) {
		if (joined_players > 6 || data_hp < 50) {
			join_raid = false;
		}
	}

	if (join_raid) {
		selectSummon(summon_list);
	}else{
		gotoHash("main");
	}
}

function shivaLogic() {
	let char2_name = 'Anre';
	let cid2 = battle.player.param.findIndex(x => x.name === char2_name);
	let char3_name = 'Altair';
	let cid3 = battle.player.param.findIndex(x => x.name === char3_name);
	let char4_name = 'Yodarha';
	let cid4 = battle.player.param.findIndex(x => x.name === char4_name);
	if (battle.turn === 1) {
		reload(30);
		let auto_ougi = function(){toggleOugi(true,clickAttack);reload(20);};
		let char2 = function(){charMoveSet(cid2,[2,1,3],auto_ougi);};
		let char1 = function(){charMoveSet(0,[2,3],char2);};
		let char3_skills = [1];
		if (battle.player.param[2].recast<=90) {
			char3_skills.push(3);
		}
		let char3 = function(){charMoveSet(cid3,char3_skills,char1);};
		char3();
	} else if (battle.turn === 2) {
		reload(30);
		let auto_ougi = function(){toggleOugi(true,clickAttack);reload(40);};
		let char4 = function(){charMoveSet(cid4,[3],auto_ougi);};
		summoning(5,char4);
	} else if (is_wiped) {
		gotoHash("main");
		reload(3);
	} else {
		gotoHash("main");
		reload(3);
	}
}

function logicGrimnir() {
	if (battle.turn === 1) {
		reload(30);
		let auto_ougi = function(){toggleOugi(true,clickAttack);reload(30);};
		let char2_skills = [2];
		let char2 = function(){charMoveSet(1,char2_skills,auto_ougi);};
		let char3_skills = [1,3];
		let char3 = function(){charMoveSet(2,char3_skills,char2);};
		let char1_skills = [];
		if (battle.player.param[0].recast >= 30) {
			char1_skills.push(2);
		}
		char1_skills.push(1);
		let char1 = function(){charMoveSet(0,char1_skills,char3);};
		let char4_skills = [2];
		let char4 = function(){charMoveSet(3,char4_skills,char1);};
		let summon5 = function(){summoning(4,char4);};
		summon5();
	} else if (battle.turn === 2) {
		reload(30);
		let auto_ougi = function(){toggleOugi(true,clickAttack);reload(30);};
		let summon6 = function(){summoning(5,auto_ougi);};
		let char2_skills = [1,3];
		let char2 = function(){charMoveSet(1,char2_skills,summon6);};
		char2();
	} else if (is_wiped) {
		gotoHash("main");
		reload(3);
	} else {
		reload(30);
		let summonMove = function (callback=false) {
			let picked_bs_id = false;
			for (let i = 0; i < battle.summon.length; i++) {
				const bs = battle.summon[i];
				if (bs.recast=="0") {
					if (picked_bs_id===false) {
						picked_bs_id = i;
					}
				}
			}
			if (picked_bs_id !== false) {
				summoning(picked_bs_id,callback);
			} else {
				if (typeof callback == "function") {
					callback();
				}
			}
		};
		let MCMove = function (callback=false) {
			console.log(MCMove.name);
			let cid = 0;
			let char = battle.player.param[cid];
			let skill_list = [];
			if (battle.player.param[cid].recast >= 30) {
				skill_list.push(2);
			}
			if (battle.player.param[cid].recast <= 60) {
				skill_list.push(1);
			}
			charMoveSet(cid,skill_list,callback);
		};
		let ThereseMove = function (callback=false) {
			console.log(ThereseMove.name);
			let char_name = "Therese";
			let cid = battle.player.param.findIndex(x => x.name === char_name);
			let char = battle.player.param[cid];
			let skill_list = [1,2,3];
			charMoveSet(cid,skill_list,callback);
		};
		let GreaMove = function (callback=false) {
			console.log(GreaMove.name);
			let char_name = "Grea";
			let cid = battle.player.param.findIndex(x => x.name === char_name);
			let char = battle.player.param[cid];
			let skill_list = [1,2,3];
			charMoveSet(cid,skill_list,callback);
		};
		let ZoeyMove = function (callback=false) {
			console.log(ZoeyMove.name);
			let char_name = "Zooey";
			let cid = battle.player.param.findIndex(x => x.name === char_name);
			let char = battle.player.param[cid];
			let skill_list = [2];
			charMoveSet(cid,skill_list,callback);
		};
		let auto_ougi = function(){toggleOugi(true,clickAttack);reload(30);};
		let char2 = function(){ThereseMove(auto_ougi);};
		let char3 = function(){GreaMove(char2);};
		let char1 = function(){MCMove(char3);};
		let char4 = function(){ZoeyMove(char1);};
		summonMove(char4);
	}
}

// dunno 1
// reload(70);
// let start_move;
// let auto_ougi = function(){toggleOugi(true,clickAttack);reload(60);};
// let char3_skills = [];
// if (battle.player.param[2].recast < 70) {
// 	char3_skills.push(3);
// }
// let char3 = function(){charMoveSet(2,char3_skills,auto_ougi);};
// let char1_skills = [1,2,4,3];
// let char1 = function(){charMoveSet(0,char1_skills,char3);};
// let char2_skills = [2];
// let char2 = function(){charMoveSet(1,char2_skills,char1);};
// let summon6 = function(){summoning(5,char2);};
// if (battle.player.param[5].recast >= 60) {
// 	start_move = char2;
// } else {
// 	start_move = summon6;
// }
// start_move();

// dunno 2

// reload(70);
// let start_move;
// let auto_ougi = function(){toggleOugi(true,clickAttack);reload(60);};
// let char3_skills = [2,1];
// if (battle.player.param[2].recast < 70) {
// 	char3_skills.push(3);
// }
// let char3 = function(){charMoveSet(2,char3_skills,auto_ougi);};
// let char1_skills = [1,2,4,3];
// let char1 = function(){charMoveSet(0,char1_skills,char3);};
// let char2_skills = [2];
// let char2 = function(){charMoveSet(1,char2_skills,char1);};
// let summon6 = function(){summoning(5,char2);};
// if (battle.player.param[5].recast >= 60) {
// 	start_move = char2;
// } else {
// 	start_move = summon6;
// }
// start_move();

function battleLogic(case_battle) {
	console.log(battleLogic.name);
	console.log(case_battle);
	let picked_bs_id = false;
	if (case_battle === 99){
		if (battle.turn===1) {
			reload(70);
			let doit3 = function(){clickEl(".btn-usual-ok",0,message.raid.trial.ok);};
			let doit2 = function(){clickEl(".btn-withdrow.btn-red-m",0,message.raid.trial.retreat,doit3);};
			let doit1 = function(){clickEl(".btn-raid-menu.menu",0,message.raid.trial.open_menu,doit2);};
			// let doit1 = function(){summonMove(clickAttack);};
			clickAndNegCheck(query.battle_ui.trial_pop_up.close,0,message.raid.trial.close_pop_up,doit1);
			// console.log(battle);
		}
	}else{
		if (case_battle === 1){
			shivaLogic();
		} else if (case_battle === 2) {
            
		} else if (case_battle === 3) {

		} else {
			if (document.querySelector(query.battle_ui.skill.char3.skill1).attributes.state.value == "2") {
				reload(40);
				let char2_name = 'Lunalu';
				let cid2 = battle.player.param.findIndex(x => x.name === char2_name);
				let char3_name = 'Tien';
				let cid3 = battle.player.param.findIndex(x => x.name === char3_name);
				let char4_name = 'Threo';
				let cid4 = battle.player.param.findIndex(x => x.name === char4_name);
				let char3 = function(){charMoveSet(cid3,[1]);};
				let char1 = function(){charMoveSet(0,[4,3,2],char3);};
				let char2b = function(){charMoveSet(cid2,[1],char1);};
				let char4 = function(){charMoveSet(cid4,[3],char2b);};
				let char2 = function(){charMoveSet(cid2,[2],char4);};
				char2();
			} else {
				gotoHash('main');
				reload(3);
			}
		}
	}
}

function pickUnclaimedRaid(rep) {
	if (rep.count > 0) {
		let el_raid = ".prt-raid-info";
		let init_pickUnlaimedRaid = function() {
			gotoHash(rep.list[0].href);
		};
		checkEl(el_raid,0,init_pickUnlaimedRaid);
	}else{
		gotoHash("main");
	}
}

function listenNetwork() {
	reload(20);
	// clearInterval(reload_counter);
	let origOpen = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function() {
		this.addEventListener('load', function() {
			if(this.responseURL.indexOf("game.granbluefantasy.jp")>=0){
				let rep;
				// console.log(this);
				if(this.responseURL.indexOf("quest/content/newassist/")>=0){
					checkAssistPreReq(JSON.parse(this.responseText));
				}else if(this.responseURL.indexOf('rest/quest/assist_list/0')>=0){
					checkAssist(JSON.parse(this.responseText));
				}else if(this.responseURL.indexOf('quest/unclaimed_reward/')>=0){
					pickUnclaimedRaid(JSON.parse(this.responseText));
				}else if(this.responseURL.indexOf('item/article_list_by_filter_mode?')>=0){
					gotoConsumables();
				}else if(this.responseURL.indexOf('item/recovery_and_evolution_list_by_filter_mode?')>=0){
					rep = JSON.parse(this.responseText);
					consumable_status = rep[0];
				}else if(this.responseURL.indexOf('user/status?')>=0){
					if (window.location.hash == "#item") {
						healBP(JSON.parse(this.responseText));
					}
				}else if(this.responseURL.indexOf('item/use_normal_item?')>=0){
					itemUsed();
				}else if(this.responseURL.indexOf('quest/battle_key_check?')>=0){
					reload(20);
					checkRaidId(JSON.parse(this.responseText));
				}else if(this.responseURL.indexOf(select_summon_path+trial_id)>=0){
					selectSummon(false,true);
				}else if(this.responseURL.indexOf('quest/content/supporter_raid/')>=0){
					// selectSummon([["Huanglong",3]]);
					checkRaidStatus(JSON.parse(this.responseText));
					// selectSummon([["Kaguya",0]]);
				}else if(this.responseURL.indexOf('deckcombination/deck_combination_group_list')>=0){
					clickEl('.prt-btn-deck>.btn-usual-ok',0,message.raid.select_party);
				}else if(this.responseURL.indexOf('quest/raid_deck_data_create?')>=0){
					raidFull(JSON.parse(this.responseText));
				}else if(this.responseURL.indexOf('rest/multiraid/start.json')>=0 || this.responseURL.indexOf('rest/raid/start.json')>=0){
					startRaid(JSON.parse(this.responseText));
				}else if(this.responseURL.indexOf('normal_attack_result.json?')>=0){
					attack(JSON.parse(this.responseText));
				}else if(this.responseURL.indexOf('ability_result.json?')>=0){
					skillUsed(JSON.parse(this.responseText));
				}else if(this.responseURL.indexOf('summon_result.json?')>=0){
					summonUsed(JSON.parse(this.responseText));
				}else if(this.responseURL.indexOf('resultmulti/content/index')>=0){
					rep = JSON.parse(this.responseText);
					tracked_item = rep.display_list;
				}else if(this.responseURL.indexOf('resultmulti/data')>=0 || this.responseURL.indexOf('result/data')>=0){
					raidFinish(JSON.parse(this.responseText));
				}else if(this.responseURL.indexOf('resultmulti/content/empty/')>=0 || this.responseURL.indexOf('quest/content/newindex')>=0 || this.responseURL.indexOf('user/content/index?')>=0){
					gotoHash("main");
				}else if(this.responseURL.indexOf('rest/raid/retire.json')>=0){
					if (JSON.parse(this.responseText).scenario[0].cmd == "retire" && JSON.parse(this.responseText).scenario[0].next_url == "#trial_battle"){
						backFromTrial();
					}
				}
			}
		});
		origOpen.apply(this, arguments);
	};
}


init();