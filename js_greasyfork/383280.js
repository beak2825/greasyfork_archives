// ==UserScript==
// @name         GBF UNF45 Leech
// @namespace    http://tampermonkey.net/
// @version      5.3.2
// @description  Grind Smart
// @author       eterNEETy
// @match        http://game.granbluefantasy.jp/
// @grant        none
// @namespace    https://greasyfork.org/users/292830
// @require      https://greasyfork.org/scripts/383201-gbf-lib/code/GBF%20Lib.js?version=699813
// @downloadURL https://update.greasyfork.org/scripts/383280/GBF%20UNF45%20Leech.user.js
// @updateURL https://update.greasyfork.org/scripts/383280/GBF%20UNF45%20Leech.meta.js
// ==/UserScript==
// jshint esversion: 6
// jshint -W138



// custom variable;
let main_path = "#quest/assist";
monsters = ["Audumbla","Aberration","Varuna"];
monsters_name = ["Lvl 60 "+monsters[0], "Lvl 75 "+monsters[1], "Lvl 80 "+monsters[1]];
// let monsters_name = ["Lvl 150 Lucilius","Lvl 200 Akasha","The Four Primarchs","Huanglong & Qilin (Impossible)"];
// monsters_name = ["Lvl 100 Grand Order","Lvl 100 Dark Angel Olivia","Lvl 100 Apollo","Lvl 100 Twin Elements","Lvl 100 Macula Marius"];

let minimum_bp = 1;
let ideal_bp = 8;
let room_id = "placeholder room_id";
let consumable_status = "placeholder consumable_status";
let tab_key = "tab_event";

// let el_tab_multi = "#tab-multi";

function checkAssistList() {
	let reinit_checkAssistList = function() {
		clickAndCheck(query.assist_ui[tab_key],0,query.assist_ui[tab_key]+".active",0,my_profile+"Clicking "+tab_key);
	};
	let init_checkAssistList = function() {
		clickEl(query.assist_ui[tab_key],0,my_profile+"Clicking "+tab_key,reinit_checkAssistList);
	};
	checkEl(query.assist_ui[tab_key],0,init_checkAssistList);
}

function checkUnclaimedExist() {
	let el_unclaimed = ".btn-unclaimed";
	if (document.querySelector(el_unclaimed) !== null) {
		gotoHash("unclaimed");
	}else{
		checkAssistList();
	}
}

function checkAssist(rep) {
	if (rep.option.user_status.bp >= minimum_bp) {
		let el_baloon = ".txt-baloon";
		checkEl(el_baloon,0,checkUnclaimedExist);
	}else{
		gotoHash("item");
	}
}

function countAssist(rep) {
    console.log(countAssist.name);
    reload(7);
    let picked_raid = false;
    let boss_hp = 0;
    let member = 30;
    for (const key in rep.assist_raids_data) {
        if (rep.assist_raids_data.hasOwnProperty(key)) {
            const element = rep.assist_raids_data[key];
            if (monsters_name.indexOf(element.chapter_name)>=0) {
                if (element.boss_hp_width > boss_hp) {
                    picked_raid = key;
                }else if(element.boss_hp_width == boss_hp) {
                    if (element.member_count < member) {
                        picked_raid = key;
                    }
                }
            }
        }
    }
	if (picked_raid !== false) {
        let el_raid = ".prt-assist-contents.active>.prt-module>.prt-raid-list>.btn-multi-raid.lis-raid>.prt-raid-info";
        clickEl(".prt-assist-contents.active>.prt-module>.prt-raid-list>.btn-multi-raid.lis-raid>.prt-raid-info",picked_raid,my_profile+"Joining raid");

		// let el_input_id = ".frm-battle-key";
		// let updateState = function() {
		// 	let sendCmd = function() {
		// 		let cmd = [];
		// 		cmd.push({"cmd":"set_gbf_state","stateId":1});
		// 		xhr.open('POST', server);
		// 		xhr.send(JSON.stringify(cmd));
		// 	};
		// 	checkEl(el_input_id,0,sendCmd);
		// 	clearInterval(reload_counter);
		// };
		// let clickTabId = function() {
		// 	clickAndCheck(query.assist_ui.tab_id,0,query.assist_ui.tab_id+".active",0,my_profile+"Clicking tab_id",updateState);
		// };
		// checkEl(query.assist_ui.tab_id,0,clickTabId);
	}else{
		let cmd = [];
		cmd.push({"cmd":"sleep","payload":2});
		cmd.push({"cmd":"clickIt","param":getCoord(document.querySelector(query.assist_ui[tab_key]))});
		xhr.open('POST', server);
        xhr.send(JSON.stringify(cmd));
	}
}

function raidFull(rep) {
	if (rep.result===false) {
		gotoHash("assist");
	}
}

function gotoConsumables() {
	let el = ".btn-item-tabs.items";
	let init_gotoConsumables = function() {
		clickAndCheck(el+":not(.active)",0,el+".active",0,my_profile+"Clicking consumables tab");
	};
	checkEl(el,0,init_gotoConsumables);
}

function useBerry(rep) {
	let el_berry = '.lis-item.se[data-index="3"]>img';
	let el_berry_count = ".num-set.use-item-num";
	let el_use = ".btn-usual-use";
	let el_close = ".btn-usual-close";
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
		cmd.push({"cmd":"clickIt","param":getCoord(document.querySelectorAll(el_berry_count)[0])});
		cmd.push({"cmd":"press","key":(ideal_bp-rep.status.bp).toString()});
		cmd.push({"cmd":"press","key":"enter"});
		xhr.open('POST', server);
		xhr.send(JSON.stringify(cmd));
		clickUse();
	};
	let init_useBerry = function() {
		clickAndCheck(el_berry,0,el_berry_count,0,my_profile+"Clicking berry icon",setBp);
	};
	if (rep.status.bp < ideal_bp) {
		checkEl(el_berry,0,init_useBerry);
	}else{
		gotoHash("assist");
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
		gotoHash("assist");
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

function startRaid(rep){
	reload(15);
	let toggleOugi = function(ougi,callback=false){
		let init_toggleOugi = function() {
			let ougi_class;
			let current_ougi = document.querySelector(".btn-lock").classList[1];
			if (ougi){
				ougi_class = "lock0";
			}else{
				ougi_class = "lock1";
			}
			if (ougi_class != current_ougi){
				clickAndCheck(".btn-lock."+current_ougi,0,".btn-lock."+ougi_class,0,"Set toggle ougi to "+(ougi.toString()),callback);
			}else{
				if (typeof callback == "function") {
					callback();
				}
			}
		};
		checkEl(".btn-lock",0,init_toggleOugi);
	};
	let checkExist = setInterval(function() {
		console.log("querying enemy name to appear");
		if (document.querySelector("a.btn-targeting.enemy-1:not(.invisible)") !== null || document.querySelector("a.btn-targeting.enemy-2:not(.invisible)") !== null || document.querySelector("a.btn-targeting.enemy-3:not(.invisible)") !== null){
			console.log("check width enemy name");
			if (document.querySelector("a.btn-targeting.enemy-1:not(.invisible)").getBoundingClientRect().width>0 || document.querySelector("a.btn-targeting.enemy-2:not(.invisible)").getBoundingClientRect().width>0 || document.querySelector("a.btn-targeting.enemy-3:not(.invisible)").getBoundingClientRect().width>0){
				console.log("found enemy name");
				clearInterval(checkExist);
				let is_quest_id_valid = false;
				let is_twitter_valid = false;
				try{
					console.log(rep.quest_id);
					if (rep.quest_id!==undefined) {
						is_quest_id_valid = true;
					}
				}
				catch(err){
					console.log(err.message);
				}
				console.log("is_quest_id_valid:" +(is_quest_id_valid).toString());
				try{
					console.log(rep.twitter.monster);
					if (rep.twitter.monster!==undefined) {
						is_twitter_valid = true;
					}
				}
				catch(err){
					console.log(err.message);
				}
				console.log("is_twitter_valid:" +(is_twitter_valid).toString());
				let case_battle = false;
				if (is_quest_id_valid){
					if(rep.quest_id == trial_id){
						case_battle = 99;
					}else{
						for (let i in quests_id) {
							if (rep.quest_id == quests_id[i] && case_battle === false) {
								case_battle = parseInt(i)+1;
							}
						}
					}
				}
				if (case_battle === false && is_twitter_valid){
					for (let i in monsters_name) {
						if (rep.twitter.monster==monsters_name[i] && case_battle === false) {
							case_battle = parseInt(i)+1;
						}
					}
				}
				console.log("case_battle:" + case_battle.toString());
				let chara_id;
				let clickChar = function(param,callback=false){
					chara_id = param;
					// click_n_check("div.prt-member>div.lis-character"+(param-1)+".btn-command-character:not(.invisible)>img.img-chara-command",0,"div.prt-member>div.lis-character"+(param-1)+".btn-command-character.invisible>img.img-chara-command",0,"clicking "+get_chara_str(param),callback)
					clickAndCheck("div.prt-member>div.btn-command-character>img.img-chara-command",param-1,".prt-command-chara.chara"+(param.toString()),0,my_profile+"Clicking "+getCharStr(param),callback);
				};
				let hp = ((parseInt(rep.boss.param[0].hp) / parseInt(rep.boss.param[0].hpmax)) * 100).toString();
				if (hp.indexOf(".")>=0){
					hp = hp.substring(0,hp.indexOf("."));
				}
				console.log(hp);
				let attack_msg = my_profile+"Foe hp is "+hp+"% left, commencing attack";
				let clickAttack = function(callback=false){
					clickAndCheck(".btn-attack-start.display-on",0,".btn-attack-cancel.btn-cancel.display-on",0,attack_msg);
				};

				if (case_battle === 99){
					// reload(30);
					clearInterval(reload_counter);
					let doit3 = function(){clickEl(".btn-usual-ok",0,message.raid.trial.ok);};
					let doit2 = function(){clickEl(".btn-withdrow.btn-red-m",0,message.raid.trial.retreat,doit3);};
					let doit1 = function(){clickEl(".btn-raid-menu.menu",0,message.raid.trial.open_menu,doit2);};
					clickEl(".btn-usual-close",0,message.raid.trial.close_pop_up, doit1);
					// let char1_1 = function(){useSkill(chara_id,1)}
					// let char1 = function(){clickChar(1,char1_1)}
					// clickEl(".btn-usual-close",0,message.raid.trial.close_pop_up, char1);
				}else{
					reload(30);

                    if (case_battle >= 1 && case_battle <= 3){
                        // GW EX+ leech
                        if (rep.turn===1){
                            reload(15);
                            // let char1_2;
                            let ougi_bars = document.querySelectorAll("div.prt-member>div.btn-command-character>div.prt-percent>.txt-gauge-value");
                            // let auto_ougi = function(){toggleOugi(true,clickAttack);};
                            // let char4_b = function(){clickBack(auto_ougi);};
                            // let char4_1 = function(){useSkill(chara_id,1,char4_b);};
                            // let char4 = function(){clickChar(4,char4_1);};
                            // let char1_b = function(){clickBack(auto_ougi);};
                            // let char1_1 = function(){useSkill(chara_id,1,char1_b);};
                            // if (ougi_bars[0].innerHTML=="100"){
                                // char1_2 = function(){useSkill(chara_id,2,char1_b);};
                            // }else{
                                // char1_2 = function(){useSkill(chara_id,2,char1_1);};
                            // }
                            let char1_2 = function(){useSkill(chara_id,2,clickAttack);};
                            let char1_3 = function(){useSkill(chara_id,3,char1_2);};
                            let char1 = function(){clickChar(1,char1_3);};
                            char1();
                            // let summon5_ok = function(){clickOkSummon(char1);};
                            // let summon5 = function(){clickSummon(5,summon5_ok,char1);};
                            // let summon5_p = function(){clickSummonPanel(summon5);};
                            // summon5_p();
                        }else{
                            reload(15);
                            clickAttack();
                        }
                    }else{
                        // leech lunalu + sarasa
						if (rep.turn == 1){
							reload(70);
							let char22_b = function(){clickBack(clickAttack);};
							let char22_1 = function(){useSkill(chara_id,1,char22_b);};
							let char22 = function(){clickChar(2,char22_1);};
							let char4_b = function(){clickBack(char22);};
							let char4_3 = function(){useSkill(chara_id,3,char4_b);};
							let char4 = function(){clickChar(4,char4_3);};
							let char2_b = function(){clickBack(char4);};
							let char2_2 = function(){useSkill(chara_id,2,char2_b);};
							let char2 = function(){clickChar(2,char2_2);};
							char2();
						}else{
							gotoHash("assist");
						}
					}
				}
			}
		}
	}, 300);
}


function pickUnclaimedRaid(rep) {
	if (rep.count > 0) {
		let el_raid = ".prt-raid-info";
		let init_pickUnlaimedRaid = function() {
			gotoHash(rep.list[0].href);
		};
		checkEl(el_raid,0,init_pickUnlaimedRaid);
	}else{
		gotoHash("assist");
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
					checkAssist(JSON.parse(this.responseText));
				}else if(this.responseURL.indexOf('rest/quest/assist_list/')>=0){
					countAssist(JSON.parse(this.responseText));
				}else if(this.responseURL.indexOf('quest/unclaimed_reward/')>=0){
					pickUnclaimedRaid(JSON.parse(this.responseText));
				}else if(this.responseURL.indexOf('item/article_list_by_filter_mode?')>=0){
					gotoConsumables();
				}else if(this.responseURL.indexOf('item/recovery_and_evolution_list_by_filter_mode?')>=0){
					rep = JSON.parse(this.responseText);
					consumable_status = rep[0];
				}else if(this.responseURL.indexOf('user/status?')>=0){
					if (window.location.hash == "#item") {
						useBerry(JSON.parse(this.responseText));
					}
				}else if(this.responseURL.indexOf('item/use_normal_item?')>=0){
					itemUsed();
				}else if(this.responseURL.indexOf('quest/battle_key_check?')>=0){
					reload(20);
					checkRaidId(JSON.parse(this.responseText));
				}else if(this.responseURL.indexOf(select_summon_path+trial_id)>=0){
					selectSummon(false,true);
				}else if(this.responseURL.indexOf('quest/content/supporter_raid/')>=0){
					selectSummon([["Yggdrasil Omega",4]]);
				}else if(this.responseURL.indexOf('deckcombination/deck_combination_group_list')>=0){
					clickEl(".btn-usual-ok",0,message.raid.select_party);
				}else if(this.responseURL.indexOf('quest/raid_deck_data_create?')>=0){
					raidFull(JSON.parse(this.responseText));
				}else if(this.responseURL.indexOf('rest/multiraid/start.json')>=0 || this.responseURL.indexOf('rest/raid/start.json')>=0){
					startRaid(JSON.parse(this.responseText));
				}else if(this.responseURL.indexOf('rest/multiraid/normal_attack_result.json')>=0 || this.responseURL.indexOf('rest/raid/normal_attack_result.json')>=0){
					attack(JSON.parse(this.responseText));
				}else if(this.responseURL.indexOf('raid/ability_result.json')>=0 || this.responseURL.indexOf('multiraid/ability_result.json')>=0){
					skillUsed(JSON.parse(this.responseText));
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

function init() {
	"use strict";
	let func_name = init.name;
	reload(5);
	path.main = main_path;
	setDebug();
	listenNetwork();
	let checkBody = setInterval(function() {
		console.log(func_name);
		if(document.body !== null){
			clearInterval(checkBody);
			if(document.body.children[0].tagName == "DIV"){
				// reload(30);
				checkError();
			}else{
				console.log("DOM Error");
				reloadNow();
			}
		}
	}, 300);
	// xhr.onreadystatechange=(e)=>{
	// 	console.log(xhr.responseText);
	// }
}

init();