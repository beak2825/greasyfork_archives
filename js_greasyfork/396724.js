// ==UserScript==
// @name         NEET Lib Prod
// @namespace    http://tampermonkey.net/
// @version      1.6.3
// @description  NEET Bot Library
// @author       eterNEETy
// @match        http://game.granbluefantasy.jp/
// @grant        none
// @namespace    https://greasyfork.org/users/292830
// ==/UserScript==
// jshint esversion: 6
// jshint -W138

let xhr=new XMLHttpRequest(),server='http://localhost:2487',margin={'top':91,'left':0},game_url='http://game.granbluefantasy.jp/';let debug=!0,reload_counter;let zoom=1;let is_host=!1;let battle;let is_wiped=!0;let discord_mention='';let abi_special_case=!1;let buff_single_skill_case={};let quests_id=[],monsters=[],monsters_name=[];let reloadable_skill=['Four-Sky\'s Sorrow','Thunder Raid'];let reloadable_summon=['デス・サーティーン'];let skill_disable_debuffs=['1102','1111','1241','1263',];const recovery_items=['Elixir','Half Elixir','Soul Balm','Soul Berry'];let tracker_reward_weapons=[];let tracker_reward_summons=[];let tracker_reward_items=[recovery_items[0],recovery_items[1],recovery_items[2],recovery_items[3],'Gold Brick','Damascus Grain','Silver Centrum'];const huanglong={'name':'Huanglong','star':3},lucifer={'name':'Lucifer','star':5},bahamut={'name':'Bahamut','star':5},shiva={'name':'Shiva','star':3},shiva0={'name':'Shiva','star':0},europa={'name':'Europa','star':3},europa0={'name':'Europa','star':0},alex={'name':'Godsworn Alexiel','star':3},alex0={'name':'Godsworn Alexiel','star':0},grimnir={'name':'Grimnir','star':3},grimnir0={'name':'Grimnir','star':0},agni={'name':'Agni','star':4},agni3={'name':'Agni','star':3},agni0={'name':'Agni','star':0},varuna={'name':'Varuna','star':4},varuna3={'name':'Varuna','star':3},varuna0={'name':'Varuna','star':0},titan={'name':'Titan','star':4},titan3={'name':'Titan','star':3},titan0={'name':'Titan','star':0},zephyrus={'name':'Zephyrus','star':4},zephyrus3={'name':'Zephyrus','star':3},zephyrus0={'name':'Zephyrus','star':0},zeus={'name':'Zeus','star':4},zeus3={'name':'Zeus','star':3},zeus0={'name':'Zeus','star':0},hades={'name':'Hades','star':4},hades3={'name':'Hades','star':3},hades0={'name':'Hades','star':0},colossus={'name':'Colossus Omega','star':4},leviathan={'name':'Leviathan Omega','star':4},yggdrasil={'name':'Yggdrasil Omega','star':4},tiamat={'name':'Tiamat Omega','star':4},luminiera={'name':'Luminiera Omega','star':4},celeste={'name':'Celeste Omega','star':4},raphael={'name':'Raphael','star':3},raphael0={'name':'Raphael','star':0},gabriel={'name':'Gabriel','star':3},gabriel0={'name':'Gabriel','star':0},uriel={'name':'Uriel','star':3},poseidon={'name':'Poseidon','star':3},poseidon0={'name':'Poseidon','star':0},bonito={'name':'Bonito','star':4},kaguya={'name':'Kaguya','star':3},kaguya0={'name':'Kaguya','star':0},nobiyo={'name':'Nobiyo','star':4},nobiyo3={'name':'Nobiyo','star':3},white_rabbit={'name':'White Rabbit','star':3},black_rabbit={'name':'Black Rabbit','star':3};const leech_summons=[kaguya,kaguya0,nobiyo,white_rabbit,black_rabbit,nobiyo3],ele_water_summons=[poseidon,europa,poseidon0,europa0,bonito,gabriel,gabriel0];const raids={'regalia':{'shiva':{'name':'Shiva (Impossible)','tweet':'Lvl 120 Shiva'},'europa':{'name':'Europa (Impossible)','tweet':'Lvl 120 Europa'},'alex':{'name':'Godsworn Alexiel (Impossible)','tweet':'Lvl 120 Godsworn Alexiel'},'grimnir':{'name':'Grimnir (Impossible)','tweet':'Lvl 120 Grimnir'},'metatron':{'name':'Metatron (Impossible)','tweet':'Lvl 120 Metatron'},'avatar':{'name':'Avatar (Impossible)','tweet':'Lvl 120 Avatar'},},'nightmare':{'grande':{'name':'The Peacemaker\'s Wings','tweet':'Lvl 100 Grand Order'},'proto_baha':{'name':'Wings of Terror','tweet':'Lvl 100 Proto Bahamut'},'huang':{'name':'The Dark Sunrise','tweet':'Lvl 100 Huanglong'},'qilin':{'name':'Dusk of Nightfall','tweet':'Lvl 100 Qilin'},'hl':{'grande':{'name':'The Peacemaker\'s Wings (Impossible)','tweet':'Lvl 200 Grand Order'},'proto_baha':{'name':'Wings of Terror (Impossible)','tweet':'Lvl 150 Proto Bahamut'},'akasha':{'name':'Omen of the Broken Skies','tweet':'Lvl 200 Akasha'},'luci':{'name':'Dark Rapture','tweet':'Lvl 150 Lucilius'},'qilin_huang':{'name':'Huanglong & Qilin (Impossible)','tweet':'Huanglong & Qilin (Impossible)'},'hard':{'luci':{'name':'Dark Rapture (Hard)','tweet':'Lvl 250 Lucilius'},},}},'primach':{'fire':{'name':'Michael\'s Test','tweet':'Lvl 100 Michael'},'water':{'name':'Gabriel\'s Test','tweet':'Lvl 100 Gabriel'},'earth':{'name':'Uriel\'s Test','tweet':'Lvl 100 Uriel'},'wind':{'name':'Raphael\'s Test','tweet':'Lvl 100 Raphael'},'hl':{'name':'The Four Primarchs (Impossible)','tweet':'The Four Primarchs'},},'t1':{'fire':{'name':'Twin Elements Showdown','tweet':'Lvl 100 Twin Elements'},'water':{'name':'Macula Marius Showdown','tweet':'Lvl 100 Macula Marius'},'earth':{'name':'Medusa Showdown','tweet':'Lvl 100 Medusa'},'wind':{'name':'Nezha Showdown','tweet':'Lvl 100 Nezha'},'light':{'name':'Apollo Showdown','tweet':'Lvl 100 Apollo'},'dark':{'name':'Dark Angel Olivia Showdown','tweet':'Lvl 100 Dark Angel Olivia'},'hl':{'fire':{'name':'Twin Elements (Impossible)','tweet':'Lvl 120 Twin Elements'},'water':{'name':'Macula Marius (Impossible)','tweet':'Lvl 120 Macula Marius'},'earth':{'name':'Medusa (Impossible)','tweet':'Lvl 120 Medusa'},'wind':{'name':'Nezha (Impossible)','tweet':'Lvl 120 Nezha'},'light':{'name':'Apollo (Impossible)','tweet':'Lvl 120 Apollo'},'dark':{'name':'Dark Angel Olivia (Impossible)','tweet':'Lvl 120 Dark Angel Olivia'},}},'t2':{'fire':{'name':'Athena Showdown','tweet':'Lvl 100 Athena'},'water':{'name':'Grani Showdown','tweet':'Lvl 100 Grani'},'earth':{'name':'Baal Showdown','tweet':'Lvl 100 Baal'},'wind':{'name':'Garuda Showdown','tweet':'Lvl 100 Garuda'},'light':{'name':'Odin Showdown','tweet':'Lvl 100 Odin'},'dark':{'name':'Lich Showdown','tweet':'Lvl 100 Lich'},},'t3':{'fire':{'name':'Prometheus (Impossible)','tweet':'Lvl 120 Prometheus'},'water':{'name':'Ca Ong (Impossible)','tweet':'Lvl 120 Ca Ong'},'earth':{'name':'Gilgamesh (Impossible)','tweet':'Lvl 120 Gilgamesh'},'wind':{'name':'Morrigna (Impossible)','tweet':'Lvl 120 Morrigna'},'light':{'name':'Hector (Raid)','tweet':'Lvl 120 Hector'},'dark':{'name':'Anubis (Impossible)','tweet':'Lvl 120 Anubis'},},'ultimate':{'baha':{'name':'Empyreal Ascension','tweet':'Lvl 150 Ultimate Bahamut'},'hl':{'baha':{'name':'Empyreal Ascension Impossible','tweet':'Lvl 200 Ultimate Bahamut'},}},'malice':{'water':{'name':'Leviathan Malice (Impossible)','tweet':'Lvl 150 Leviathan Malice'},'earth':{'name':'Yggdrasil Malice (Impossible)','tweet':'Lvl 150 Yggdrasil Malice'},'wind':{'name':'Tiamat Malice (Impossible)','tweet':'Lvl 150 Tiamat Malice'},}};const trial_id='990011',select_summon_path='supporter/';let path={'main':'','item':'#item','quest':'#quest','support':'#quest/supporter/','assist':'#quest/assist','unclaimed':'#quest/assist/unclaimed','trial':'#quest/supporter/'+trial_id+'/17',};let skill_char='#prt-command-top > div > div > div.lis-character';let skill_abi='.btn-command-character > div.prt-ability-state > div.lis-ability-state.ability';let query={'battle_ui':{'skill':{'char1':{'skill1':skill_char+'0'+skill_abi+'1','skill2':skill_char+'0'+skill_abi+'2','skill3':skill_char+'0'+skill_abi+'3','skill4':skill_char+'0'+skill_abi+'4',},'char2':{'skill1':skill_char+'1'+skill_abi+'1','skill2':skill_char+'1'+skill_abi+'2','skill3':skill_char+'1'+skill_abi+'3','skill4':skill_char+'1'+skill_abi+'4',},'char3':{'skill1':skill_char+'2'+skill_abi+'1','skill2':skill_char+'2'+skill_abi+'2','skill3':skill_char+'2'+skill_abi+'3','skill4':skill_char+'2'+skill_abi+'4',},'char4':{'skill1':skill_char+'3'+skill_abi+'1','skill2':skill_char+'3'+skill_abi+'2','skill3':skill_char+'3'+skill_abi+'3','skill4':skill_char+'3'+skill_abi+'4',},},'skill_pop_up':{'char1':'div.pop-usual.pop-select-member > div.prt-popup-body > div.prt-wrapper > div.prt-character > div.lis-character0.btn-command-character > img','char2':'div.pop-usual.pop-select-member > div.prt-popup-body > div.prt-wrapper > div.prt-character > div.lis-character1.btn-command-character > img','char3':'div.pop-usual.pop-select-member > div.prt-popup-body > div.prt-wrapper > div.prt-character > div.lis-character2.btn-command-character > img','char4':'div.pop-usual.pop-select-member > div.prt-popup-body > div.prt-wrapper > div.prt-character > div.lis-character3.btn-command-character > img','char5':'div.pop-usual.pop-select-member > div.prt-popup-body > div.prt-wrapper > div.prt-character > div.lis-character4.btn-command-character > img','char6':'div.pop-usual.pop-select-member > div.prt-popup-body > div.prt-wrapper > div.prt-character > div.lis-character5.btn-command-character > img',},'ougi':'.btn-lock','toggle_ougi':{true:'.lock0',false:'.lock1',},'char_ico':'.prt-party>.prt-member>.btn-command-character>img.img-chara-command','summon_panel':'.prt-summon-list>.prt-list-top.btn-command-summon','chat':'.btn-chat.comment.display-on','chat_pop_up':{'dialog':'.txt-chat-pop',},'heal':'#prt-sub-command-group>.btn-temporary','heal_pop_up':{'green':'.lis-item.item-small','blue':'.lis-item.item-large','Green Potion':'.lis-item.item-small','Blue Potion':'.lis-item.item-large','Support Potion':'.lis-item.btn-event-item[item-id="1"]','Clarity Herb':'.lis-item.btn-event-item[item-id="2"]','Revival Potion':'.lis-item.btn-event-item[item-id="3"]','use':'.pop-usual.pop-raid-item.pop-show>.prt-popup-footer>.btn-usual-use','cancel':'.pop-usual.pop-raid-item.pop-show>.prt-popup-footer>.btn-usual-cancel',},'trial_pop_up':{'close':'.pop-usual.pop-trialbattle-notice.pop-show>.prt-popup-footer>.btn-usual-close',},'backup_pop_up':{'request':'.pop-usual.pop-start-assist.pop-show>.prt-popup-footer>.btn-usual-text','cancel':'.pop-usual.pop-start-assist.pop-show>.prt-popup-footer>.btn-usual-cancel',},'button':{'assist':'.prt-multi-buttons>.btn-assist',},},'assist_ui':{'tab_id':'#tab-id','tab_multi':'#tab-multi','tab_event':'#tab-event','unclaimed':'.btn-unclaimed',},'poker':{'canvas':'#canv','deal':'.prt-start','ok':'.prt-ok','yes':'.prt-yes','no':'.prt-no','low':'.prt-double-select>.prt-low-shine','high':'.prt-double-select>.prt-high-shine',},'ok':'.btn-usual-ok',};let my_profile='';

function updateMessage(pilot) {
	const message = {
		"raid" : {
			"panel" : {
				"open" : pilot+"Opening quest/raid panel",
				"pick" : pilot+"Picking quest/raid difficulties",
			},
			"select_party" : pilot+"Selecting party",
			"finish" : pilot+"Raid finished",
			"trial" : {
				"close_pop_up" : pilot+"In trial, closing pop up",
				"open_menu" : pilot+ "In trial, click menu",
				"retreat" : pilot+ "In trial, click retreat",
				"ok" : pilot+ "In trial, click ok",
				"end" : pilot+"Retreated from trial, back to main raid",
			}
		},
		"summon" : {
			"select" : pilot+"Selecting summon",
			"pick_tab" : pilot+"Clicking summon element tab",
			"not_found" : pilot+"Support summon not found, going to trial",
		},
		"replenish" : {
			"elixir" : {
				"half_elixir" : {
					"use" : pilot+"Not enough AP, using half elixir",
					"used" : pilot+"Half elixir used",
				}
			},
			"soul" : {
				"soul_berry" : {
					"use" : pilot+"Not enough EP, using soul berry",
					"used" : pilot+"soul berry used",
				}
			}
		},
		"ok" : pilot+"Clicking ok",
	};
	return message;
}
let message = updateMessage(my_profile);

// general item variable
let tracked_item = false;

function tryParseJSON (jsonString){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return false;
}

function reloadNow() {
	console.log(reloadNow.name);
	xhr.open('POST', server);
	xhr.send(JSON.stringify([{'cmd':'press','key':'f5'}]));
	window.location.reload();
}

function reload(mod_value=1) {
	clearInterval(reload_counter);
	let current_path = window.location.hash;
	let count = 1;
	reload_counter = setInterval(function() {
		if(window.location.hash != current_path){
			clearInterval(reload_counter);
		}
		console.log('reloading in '+(mod_value-count).toString());
		if (count%mod_value===0){
			clearInterval(reload_counter);
			reloadNow();
		}
		count += 1;
	}, 1000);
}

function setDebug() {
	if(!debug){
		console.log('DEBUG is turned OFF');
		if(!window.console) window.console = {};
		let methods = ['log', 'debug', 'warn', 'info'];
		for(let i=0;i<methods.length;i++){
			console[methods[i]] = function(){};
		}
	}
}

function readBody(xhr) {
	let data;
	if (!xhr.responseType || xhr.responseType === 'text') {
		data = xhr.responseText;
	} else if (xhr.responseType === 'document') {
		data = xhr.responseXML;
	} else {
		data = xhr.response;
	}
	return data;
}

function gotoHash(key){
	let hash_path;
	if (path[key] !== undefined) {
		hash_path = path[key];
	}else{
		if (key.indexOf('#')!==0) {
			hash_path = '#'+key;
		}
	}
	window.location.href = game_url + hash_path;
}

function scroll_To(query,qid=0) {
	document.querySelectorAll(query)[qid].scrollIntoViewIfNeeded();
}

function checkExist(query,qid=0) {
	let el_exist = false;
	if (document.querySelectorAll(query).length > qid){
		if (document.querySelectorAll(query)[qid].getBoundingClientRect().width > 0 && document.querySelectorAll(query)[qid].getBoundingClientRect().height > 0) {
			el_exist = true;
		}
	}
	return el_exist;
}

function checkEl(query,qid=0,callback=false) {
	let old_top = -1;
	let old_left = -1;
	let loop_checkEl = setInterval(function() {
		console.log(checkEl.name + " " + query + "[" + qid + "]");
		if (checkExist(query,qid)) {
			if (old_top==document.querySelectorAll(query)[qid].getBoundingClientRect().top && old_left==document.querySelectorAll(query)[qid].getBoundingClientRect().left) {
				clearInterval(loop_checkEl);
				if (typeof callback == "function") {
					callback();
				}
			}else{
				old_top = document.querySelectorAll(query)[qid].getBoundingClientRect().top;
				old_left = document.querySelectorAll(query)[qid].getBoundingClientRect().left;
			}
		}
	}, 200);
}

function checkEls(queries,callback=false) {
	let exist_result;
	let loop_checkEls = setInterval(function() {
		exist_result = [];
		for (let i in queries) {
			console.log(checkEls.name + " " + queries[i].query + "[" + queries[i].qid + "]");
			exist_result.push(checkExist(queries[i].query,queries[i].qid));
		}
		if (exist_result.indexOf(false)===-1) {
			clearInterval(loop_checkEls);
			if (typeof callback == "function") {
				callback();
			}
		}
	}, 300);
}

function checkElsOR(queries,callback=false) {
	let exist_result;
	let loop_checkEls = setInterval(function() {
		exist_result = [];
		for (let i in queries) {
			console.log(checkElsOR.name + " " + queries[i].query + "[" + queries[i].qid + "]");
			exist_result.push(checkExist(queries[i].query,queries[i].qid));
		}
		if (exist_result.indexOf(true)>=0) {
			clearInterval(loop_checkEls);
			if (typeof callback == "function") {
				callback();
			}
		}
	}, 300);
}

function checkError() {
	let q_cnt_error = ".cnt-error";
    let q_pop_up = ".pop-usual.common-pop-error.pop-show";
    let q_abi_pop_up = ".pop-usual.pop-raid-ability-error.pop-show";
    let check_error = setInterval(function() {
		console.log(checkError.name);
		
		if (checkExist(q_pop_up,0) || checkExist(q_cnt_error,0) || checkExist(q_abi_pop_up,0)) {
			let cmd = [];
			console.log("error_found");
			let do_reload = false;
			let level = "notif";
			let msg = "Uncatagorized error found";
			// let msg = "Connection error, refreshing disabled"
			if (checkExist(q_cnt_error,0)) {
				if (checkExist('#wrapper > div.contents > div.cnt-error > div.prt-frame > div',0)) {
					if (checkExist('#wrapper > div.contents > div.cnt-error > div.prt-frame > div > p',0)) {
						do_reload = true;
						let msg_str = document.querySelector('#wrapper > div.contents > div.cnt-error > div.prt-frame > div > p').innerHTML;
						msg_str = msg_str.replace(/<br>/g,' ').replace(/<\/br>/g,' ').trim().replace(/\s{2,}/g, ' ').trim();
						msg = my_profile + msg_str +' Reloading.';
						level = "notif";
					}
				}
			} else if (checkExist(q_abi_pop_up,0)) {
				do_reload = true;
				msg = my_profile + document.querySelector(q_abi_pop_up+">.prt-popup-body>.txt-popup-body").innerHTML;
				level = "process";
			} else {
				if (checkExist(q_pop_up+">.prt-popup-header",0)) {
					if (document.querySelector(q_pop_up+">.prt-popup-header").innerHTML=="Access Verification") {
						clearInterval(reload_counter);
						clearInterval(check_error);
						msg = my_profile+"Captcha detected. " + discord_mention;
						console.log("Captcha detected");
					}else if (document.querySelector(q_pop_up+">.prt-popup-header").innerHTML=="エラー") {
						if (checkExist(q_pop_up+">.prt-popup-body>.txt-popup-body>div",0)) {
							if (typeof document.querySelector(q_pop_up+">.prt-popup-body>.txt-popup-body>div").innerHTML == "string") {
								if (document.querySelector(q_pop_up+">.prt-popup-body>.txt-popup-body>div").innerHTML.indexOf("Network Error")>=0) {
									clearInterval(reload_counter);
									console.log("Error connection");
									do_reload = true;
									msg = my_profile+"Error connection, reloading";
									level = "process";
								}
							}
						}
					}
				}
				if (checkExist(q_pop_up+">.prt-popup-body>.txt-popup-body",0)) {
					if (document.querySelector(q_pop_up+">.prt-popup-body>.txt-popup-body").innerHTML=="Check your pending battles.") {
						console.log("check raid");
						level = "process";
						msg = my_profile+"Check your pending battle";
						clickEl(".prt-popup-footer>.btn-usual-ok",0,my_profile+"Clicking ok pop up pending battles");
					}
				}
			}
			if (do_reload){
				cmd.push({"cmd":"press","key":"f5"});
			}
			cmd.push({"cmd":"log","level":level,"msg":msg});
			xhr.open('POST', server);
			xhr.send(JSON.stringify(cmd));
			if (do_reload){
				window.location.reload();
			}
		}
	}, 5000);
}

function getCoord(el){
	zoom = parseInt(document.getElementById("mobage-game-container").style.zoom);
	let x, y, output;
	let pos_el = el.getBoundingClientRect();
	if (pos_el.top >= 0 && pos_el.bottom <= window.innerHeight) {
		if (pos_el.width>0 && pos_el.height>0) {
			x = (pos_el.width / 2) + pos_el.left;
			y = (pos_el.height / 2) + pos_el.top;
			if(pos_el.width>40){
				x += Math.floor(Math.random() * 41)-20;
			}else if(pos_el.width>20){
				x += Math.floor(Math.random() * 21)-10;
			}else if(pos_el.width>10){
				x += Math.floor(Math.random() * 11)-5;
			}
			if(pos_el.height>10){
				y += Math.floor(Math.random() * 11)-5;
			}
			output = [(x*zoom)+margin.left,(y*zoom)+margin.top];
		}else{
			output = 0;
		}
		return output;
	} else {
		el.scrollIntoViewIfNeeded();
		return getCoord(el);
	}
}

function getMarginCoord(query,qid){
	let el = document.querySelectorAll(query)[qid].getBoundingClientRect();
	return {"top":el.top+margin.top,"left":el.left+margin.left};
}

function clickNow(query,qid=0,msg=my_profile+"clickNow called",callback=false){
	let el = document.querySelectorAll(query)[qid];
	let output = false;
	if (checkExist(query,qid)) {
		output = true;
		let cmd = [];
		cmd.push({"cmd":"clickIt","param":getCoord(el)});
		cmd.push({"cmd":"log","level":"process","msg":msg});
		xhr.open("POST", server);
		xhr.send(JSON.stringify(cmd));
		if (typeof callback == "function") {
			callback();
		}
	}
	return output;
}

function clickEl(query,qid=0,msg=my_profile+"clickEl called",callback=false){
	let init_clickEl = function() {
		clickNow(query,qid,msg,callback);
	};
	checkEl(query,qid,init_clickEl);
}

function clickObject(obj){
	if (obj == "ok"){
		clickEl(".btn-usual-ok",0,message.ok);
	}
}

function clickAndNegCheck(query,qid=0,msg="clickAndNegCheck called",callback=false,ticks=5){
	let old_href = window.location.href;
	let old_top = -1;
	let old_left = -1;
	let match = ticks-1;
	let str_clickAndNegCheck = clickAndNegCheck.name + ", el: " + query + "["+(qid.toString())+"] \n- match = ";
	let init_clickAndNegCheck = function() {
		let loop_clickAndNegCheck = setInterval(function() {
			console.log(str_clickAndNegCheck+(match.toString()));
			if (!(checkExist(query,qid))) {
				clearInterval(loop_clickAndNegCheck);
				if (typeof callback == "function") {
					callback();
				}
			}else if (old_href != window.location.href) {
				clearInterval(loop_clickAndNegCheck);
			}else{
				if (checkExist(query,qid)) {
					if (old_top==document.querySelectorAll(query)[qid].getBoundingClientRect().top && old_left==document.querySelectorAll(query)[qid].getBoundingClientRect().left) {
						if (match % ticks == 0) {
							clickNow(query,qid,msg);
						}
						match += 1;
					}else{
						old_top = document.querySelectorAll(query)[qid].getBoundingClientRect().top;
						old_left = document.querySelectorAll(query)[qid].getBoundingClientRect().left;
					}
				}
			}
		}, 100);
	};
	checkEl(query,qid,init_clickAndNegCheck);
}

function clickAndCheck(query1,qid1=0,query2,qid2=0,msg="clickAndCheck called",callback=false,ticks=5){
	let old_href = window.location.href;
	let old_top = -1;
	let old_left = -1;
	let match = ticks-1;
	let str_clickAndCheck = clickAndCheck.name + ", check: " + query2 + "["+(qid2.toString())+"], click: " + query1 + "["+(qid1.toString())+"] \n- match = ";
	let loop_clickAndCheck = setInterval(function() {
		console.log(str_clickAndCheck+(match.toString()));
		if (checkExist(query2,qid2)) {
			clearInterval(loop_clickAndCheck);
			if (typeof callback == "function") {
				callback();
			}
		}else if (old_href != window.location.href) {
			clearInterval(loop_clickAndCheck);
		}else{
			if (checkExist(query1,qid1)) {
				if (old_top==document.querySelectorAll(query1)[qid1].getBoundingClientRect().top && old_left==document.querySelectorAll(query1)[qid1].getBoundingClientRect().left) {
					if (match % ticks == 0) {
						clickNow(query1,qid1,msg);
					}
					match += 1;
				}else{
					old_top = document.querySelectorAll(query1)[qid1].getBoundingClientRect().top;
					old_left = document.querySelectorAll(query1)[qid1].getBoundingClientRect().left;
				}
			}
		}
	}, 100);
}

function popUpNotEnough(rep) {
	const query = ".btn-use-full.index-1",
		qid = 0,
		msg = message.replenish.elixir.half_elixir.use;
	let cmd = [], coordinate, consumable_data;
	consumable_data = my_profile+"Consumable Status:";
	for (let i = 0; i < rep.length; i++) {
		consumable_data += ("\n- "+rep[i].name+": "+rep[i].number);
	}
	let init_popUpNotEnough = function() {
		coordinate = getCoord(document.querySelectorAll(query)[qid]);
		if (coordinate!==0){
			cmd.push({"cmd":"clickIt","param":coordinate});
			cmd.push({"cmd":"log","level":"process","msg":msg});
			cmd.push({"cmd":"log","level":"summary","msg":consumable_data,"split":0});
			xhr.open('POST', server);
			xhr.send(JSON.stringify(cmd));
		}
	};
	checkEl(query,qid,init_popUpNotEnough);

}


// function clickAndCheckSkill(query,qid=0,msg="clickAndCheckSkill called",callback=false,special_case=false){
// 	console.log(clickAndCheckSkill.name);
// 	console.log(callback);
// 	console.log(query);
// 	console.log(qid);
// 	let old_class = document.querySelectorAll(query)[qid].parentNode.classList[0];
// 	console.log(old_class);
// 	let loop_clickAndCheckSkill = setInterval(function() {
// 		console.log(loop_clickAndCheckSkill.name + " " + query + "[" + qid + "]");
// 		if (Array.from(document.querySelectorAll(query)[qid].parentNode.parentNode.classList).indexOf("tmp-mask")>=0 || Array.from(document.querySelectorAll(query)[qid].parentNode.parentNode.classList).indexOf("btn-ability-unavailable")>=0){
// 			clearInterval(loop_clickAndCheckSkill);
// 			console.log(clickAndCheckSkill.name + " case normal");
// 			if (typeof callback == "function") {
// 				callback();
// 			}
// 		// Bea skill
// 		}else if(special_case===1 && document.querySelectorAll(query)[qid].parentNode.classList[0] != old_class){
// 			clearInterval(loop_clickAndCheckSkill);
// 			console.log(clickAndCheckSkill.name + " case " + special_case.toString());
// 			if (typeof callback == "function") {
// 				callback();
// 			}
// 		// Out of sight & sage of eternity
// 		}else if(special_case===2){
// 			let do_click = true;
// 			console.log(clickAndCheckSkill.name + " case " + special_case.toString());
// 			let popup_query = "#wrapper > div.contents > div.pop-usual.pop-select-member > div.prt-popup-header";
// 			if (checkExist(popup_query,0)) {
// 				if (document.querySelector("#wrapper > div.contents > div.pop-usual.pop-select-member > div.prt-popup-header").innerHTML == "Use Skill"){
// 					clearInterval(loop_clickAndCheckSkill);
// 					do_click = false;
// 					if (typeof callback == "function") {
// 						callback();
// 					}
// 				}
// 			}
// 			if (do_click) {
// 				if (checkExist(query,qid)) {
// 					clickNow(query,qid,msg);
// 				}
// 			}
// 		}else{
// 			if (checkExist(query,qid)) {
// 				clickNow(query,qid,msg);
// 			}
// 		}

// 	}, 500);
// }



function clickSkill(cid,abi_id,callback=false){
	console.log(clickSkill.name+', cid: '+cid.toString()+', ability: '+abi_id.toString());
	let query = ".prt-command-chara.chara"+((battle.formation.indexOf(cid.toString())+1).toString())+">div>div>div>.img-ability-icon";
	let qid = abi_id;
	let char = battle.player.param[cid].name;
	let msg = my_profile+"Clicking "+char+" skill"+((abi_id+1).toString());
	let old_class = document.querySelectorAll(query)[qid].parentNode.classList[0];
	let abi_obj = Object.values(battle.ability).find(x => x.pos === cid);
	let abi_name = abi_obj.list[abi_id+1][0]['ability-name'];
	let specialSkillBuffSingle = function(BuffSingle) {
		console.log('case '+abi_name);
		console.log('buff_single_skill_case:');
		console.log(buff_single_skill_case);
		console.log('BuffSingle:');
		console.log(BuffSingle);
		clearInterval(reload_counter);
		let do_click = true;
		let popup_query = '#wrapper > div.contents > div.pop-usual.pop-select-member > div.prt-popup-header';
		let buff_single_cid = buff_single_skill_case[BuffSingle];
		let q_img_buff_single_cid = 'placeholder';
		if (checkExist(popup_query,0)) {
			if (document.querySelector(popup_query).innerHTML == 'Use Skill'){
				clearInterval(loop_clickSkill);
				do_click = false;
				let error_special_case = true;
				let error_msg = 'Error skill: ';

				if (buff_single_skill_case === false){
					error_msg = 'buff_single_skill_case is false.';
				} else {
					console.log('typeof buff_single_skill_case');
					console.log(typeof buff_single_skill_case);
					console.log('BuffSingle');
					console.log(BuffSingle);
					error_msg = abi_name + ': buff_single_skill_case object not found.';
					if (typeof buff_single_skill_case === 'object') {
						if (buff_single_skill_case.hasOwnProperty(BuffSingle)) {
							error_msg = abi_name + ': buff_single_skill_case.'+BuffSingle+' type is invalid.';
							if (typeof buff_single_skill_case[BuffSingle] === 'string' || buff_single_skill_case[BuffSingle] === 0) {
								error_msg = abi_name + ': buff_single_cid is not a number.';
								buff_single_cid = buff_single_skill_case[BuffSingle];
								if (!(Number.isInteger(buff_single_cid))) {
									buff_single_cid = battle.player.param.findIndex(x => x.name === buff_single_skill_case[BuffSingle]);
								}
								if (Number.isInteger(buff_single_cid)) {
									error_msg = abi_name + ': q_img_buff_single_cid is not exist.';
									q_img_buff_single_cid = '#wrapper > div.contents > div.pop-usual.pop-select-member > div.prt-popup-body > div.prt-wrapper > div.prt-character > div.lis-character'+buff_single_cid+'.btn-command-character:not(.mask-black) > img';
									if (checkExist(q_img_buff_single_cid,0)) {
										error_special_case = false;
									}
								}
							}
						}
					}
				}
				console.log('error_special_case: '+error_special_case);
				console.log(error_msg);
				if (error_special_case) {
					let cmd = [];
					cmd.push({"cmd":"log","level":"notif","msg":my_profile+error_msg+' '+discord_mention});
					xhr.open('POST', server);
					xhr.send(JSON.stringify(cmd));
				} else {
					clickAndNegCheck(q_img_buff_single_cid,0,my_profile+'Clicking '+abi_name +', target: '+(buff_single_skill_case[BuffSingle]).toString(),callback);
				}



			}
		}
		if (do_click) {
			if (checkExist(query,qid)) {
				clickNow(query,qid,msg);
			}
		}
	};
	let loop_clickSkill = setInterval(function() {
		console.log("loop_clickSkill " + query + "[" + qid + "]");
		if (Array.from(document.querySelectorAll(query)[qid].parentNode.parentNode.classList).indexOf("tmp-mask")>=0 || Array.from(document.querySelectorAll(query)[qid].parentNode.parentNode.classList).indexOf("btn-ability-unavailable")>=0){
			clearInterval(loop_clickSkill);
			console.log('case normal cooldown');
			if (typeof callback == "function") {
				callback();
			}
		// } else if (buff_single_skill_list.indexOf(abi_name)>=0) {
		} else if (buff_single_skill_case.hasOwnProperty(abi_name)) {
			specialSkillBuffSingle(abi_name);


		} else if (abi_name === 'Runeweaving') {
			console.log('case Runeweaving');
			let do_click = true;
			let popup_query = '#wrapper > div.contents > div.pop-usual.pop-ability-mark > div.prt-popup-header';
			if (checkExist(popup_query,0)) {
				if (document.querySelector(popup_query).innerHTML == 'Use Skill'){
					clearInterval(loop_clickSkill);
					do_click = false;
					let error_special_case = true;
					let error_msg = 'Error skill: ';
					let q_invoke = '.lis-ability-mark';
					let q_rune = '>.lis-ability-frame';

					const invoke = {'fire':'.mark1', 'water':'.mark2', 'earth':'.mark3', 'wind':'.mark4'};

					if (abi_special_case === false){
						error_msg = 'abi_special_case is false.';
					} else {
						if (typeof abi_special_case === 'object') {
							if (abi_special_case.hasOwnProperty('invoke')) {
								if (typeof abi_special_case.invoke === 'object') {
									if (abi_special_case.invoke.length === 2) {
										if (invoke.hasOwnProperty(abi_special_case.invoke[0]) && invoke.hasOwnProperty(abi_special_case.invoke[1])) {
											error_special_case = false;
										} else {
											error_msg = 'abi_special_case.invoke value is invalid.';
										}
									} else {
										error_msg = 'abi_special_case.invoke length is invalid.';
									}
								} else {
									error_msg = 'abi_special_case.invoke type is invalid.';
								}
							}
						} else {
							error_msg = 'abi_special_case object \'invoke\' not found.';
						}
					}
					console.log('error_special_case: '+error_special_case);
					console.log(error_msg);
					if (error_special_case) {
						let cmd = [];
						cmd.push({"cmd":"log","level":"notif","msg":my_profile+error_msg+discord_mention});
						xhr.open('POST', server);
						xhr.send(JSON.stringify(cmd));
					} else {
						let q_next_rune;
						if (abi_special_case.invoke[0] === abi_special_case.invoke[1]) {
							q_next_rune = '.first.second';
						} else {
							q_next_rune = '.second:not(.first)';
						}
						let q_cast = '#wrapper > div.contents > div.pop-usual.pop-ability-mark > div.prt-popup-footer > div.btn-usual-text';
						let click_cast = function () {clickAndNegCheck(q_cast,0,my_profile+'Clicking cast',callback);};
						let next_rune = function () {clickAndCheck(q_invoke+invoke[abi_special_case.invoke[1]]+q_rune,0,q_invoke+invoke[abi_special_case.invoke[1]]+q_next_rune,0,my_profile+'Clicking second rune: '+abi_special_case.invoke[1],click_cast);};
						clickAndCheck(q_invoke+invoke[abi_special_case.invoke[0]]+q_rune,0,q_invoke+invoke[abi_special_case.invoke[0]]+'.first:not(.second)',0,my_profile+'Clicking first rune: '+abi_special_case.invoke[0],next_rune);
					}
				}
			}
			if (do_click) {
				if (checkExist(query,qid)) {
					clickNow(query,qid,msg);
				}
			}
			
		// // Bea skill
		// }else if(special_case===1 && document.querySelectorAll(query)[qid].parentNode.classList[0] != old_class){
		// 	clearInterval(loop_clickAndCheckSkill);
		// 	console.log(clickAndCheckSkill.name + " case " + special_case.toString());
		// 	if (typeof callback == "function") {
		// 		callback();
		// 	}

		// // Out of sight & sage of eternity
		// }else if(special_case===2){
		// 	let do_click = true;
		// 	console.log(clickAndCheckSkill.name + " case " + special_case.toString());
		// 	let popup_query = "#wrapper > div.contents > div.pop-usual.pop-select-member > div.prt-popup-header";
		// 	if (checkExist(popup_query,0)) {
		// 		if (document.querySelector("#wrapper > div.contents > div.pop-usual.pop-select-member > div.prt-popup-header").innerHTML == "Use Skill"){
		// 			clearInterval(loop_clickAndCheckSkill);
		// 			do_click = false;
		// 			if (typeof callback == "function") {
		// 				callback();
		// 			}
		// 		}
		// 	}
		// 	if (do_click) {
		// 		if (checkExist(query,qid)) {
		// 			clickNow(query,qid,msg);
		// 		}
		// 	}
		} else {
			console.log('case normal not cooldown yet');
			if (checkExist(query,qid)) {
				clickNow(query,qid,msg);
			}
		}

	}, 500);
}



function useSkills(cid, skill_list, callback=false) {
	let char_id = battle.formation.indexOf(cid.toString())+1;
	console.log(useSkills.name);
	if (skill_list.length>0) {
		console.log(useSkills.name + ", cid: "+cid+", ability: " + (skill_list[0].toString()));
		let new_skill_list = Object.values(skill_list);
		new_skill_list.splice(0,1);
		let abi_id = parseInt(skill_list[0])-1;
		let next_skill = function(){useSkills(cid, new_skill_list, callback);};
		if (Array.from(document.querySelectorAll(".prt-command-chara.chara"+(char_id.toString())+">div>div.lis-ability")[abi_id].classList).indexOf("btn-ability-available")>=0 && document.querySelectorAll(".prt-command-chara.chara"+(char_id.toString())+">div>div.lis-ability")[abi_id].getBoundingClientRect().width>0){
			// clickAndCheckSkill(".prt-command-chara.chara"+(char_id.toString())+">div>div>div>.img-ability-icon",abi_id,my_profile+"Clicking "+char+" skill"+((abi_id+1).toString()),next_skill);
			clickSkill(cid,abi_id,next_skill);
		}else{
			if (typeof callback == "function") {
				next_skill();
			}
		}
	} else {
		if (typeof callback == "function") {
			callback();
		}
	}
}

function usePot(pot_type, cid=false, callback=false) {
	console.log(usePot.name);
	console.log(cid);
	let do_click_heal = false;
	let front_cid = false;
	let player_stats = {
		'need_heal': [],
		'front_need_heal': [],
		'need_clear': [],
		'need_revive': [],
	};
	for (const i in battle.player.param) {
		if (battle.player.param.hasOwnProperty(i)) {
			const player_obj = battle.player.param[i];
			player_stats.need_revive.push(player_obj.alive === 1);
			let player_need_clear = false;
			if (player_obj.alive === 1) {
				player_stats.need_heal.push(player_obj.hpmax - player_obj.hp !== 0);
				if (player_obj.hasOwnProperty('condition')) {
					if (player_obj.condition.hasOwnProperty('debuff')) {
						if (player_obj.condition.debuff.length > 0) {
							player_need_clear = true;
						}
					}
				}
			} else {
				player_stats.need_heal.push(false);
			}
			player_stats.need_clear.push(player_need_clear);
		}
	}

	for (const i in battle.formation) {
		if (battle.formation.hasOwnProperty(i)) {
			const front_id = parseInt(battle.formation[i]);
			if (cid===front_id) {
				front_cid = i;
			}
			player_stats.front_need_heal.push(battle.player.param[front_id].hpmax - battle.player.param[front_id].hp !== 0);
		}
	}
	console.log('front_cid: '+front_cid);
	console.log('player_stats: ');
	console.log(player_stats);
	if (pot_type==='Clarity Herb') {
		if (battle.hasOwnProperty('event')) {
			let item_obj = Object.values(battle.event.item).find(x => x.name === pot_type);
			if (item_obj !== undefined) {
				if (item_obj.number > 0 && front_cid !== false && player_stats.front_need_heal[front_cid]) {
					do_click_heal = true;
				}
			}
		}
	} else if (pot_type==='Green Potion') {
		if (battle.hasOwnProperty('temporary')) {
			if (battle.temporary.hasOwnProperty('small')) {
				let item_obj = parseInt(battle.temporary.small);
				console.log('item_obj');
				console.log(item_obj);
				if (item_obj !== undefined) {
					if (item_obj > 0 && front_cid !== false && player_stats.front_need_heal[front_cid]) {
						do_click_heal = true;
					}
				}
			}
		}
	} else if (pot_type==='Blue Potion') {
		if (battle.hasOwnProperty('temporary')) {
			if (battle.temporary.hasOwnProperty('large')) {
				let item_obj = parseInt(battle.temporary.large);
				console.log('item_obj');
				console.log(item_obj);
				if (item_obj !== undefined) {
					if (item_obj > 0 && player_stats.front_need_heal.indexOf(true)>=0) {
						do_click_heal = true;
					}
				}
			}
		}
	}
	console.log('do_click_heal:');
	console.log(do_click_heal);

	let clickCancel = function() {
		clickAndNegCheck(query.battle_ui.heal_pop_up.cancel,0,my_profile+"Clicking cancel from pot pop up",callback);
	};

	let clickUse = function() {
		clickAndNegCheck(query.battle_ui.heal_pop_up.use,0,my_profile+"Clicking use from pot pop up",callback);
	};
	let clickFront = function() {
		clickAndCheck(query.battle_ui.char_ico,front_cid,query.battle_ui.summon_panel+":not(.mask-black)",0,my_profile+"Clicking char_ico from pot pop up",callback);
	};

	let clickPot = function() {
		console.log(clickPot.name);
		let query_qty = ">.txt-having>.having-num";
		let pot_available = false;
		let init_clickPot = function () {
			if (checkExist(query.battle_ui.heal_pop_up[pot_type]+query_qty)) {
				if ( parseInt(document.querySelector(query.battle_ui.heal_pop_up[pot_type]+query_qty).innerHTML) > 0 ) {
					pot_available = true;
					if (pot_type == 'Blue Potion') {
						clickAndNegCheck(query.battle_ui.heal_pop_up[pot_type]+">img",0,my_profile+"Clicking "+ pot_type +" pot",clickUse);
					}else if (pot_type == 'Green Potion') {
						clickAndNegCheck(query.battle_ui.heal_pop_up[pot_type]+">img",0,my_profile+"Clicking "+ pot_type +" pot",clickFront);
					}else if (pot_type == 'Clarity Herb') {
						clickAndNegCheck(query.battle_ui.heal_pop_up[pot_type]+">img",0,my_profile+"Clicking "+ pot_type +" pot",clickFront);
					}else{
						console.log("pot_type unknown");
						clickCancel();
					}
				}
			// 		console.log("pot qty not > 0");
			// 		clickCancel();
			// 	}
			// }else{
			// 	console.log("element not exist");
			// 	clickCancel();
			} 
			if (!pot_available) {
				clickCancel();
			}
		};
		checkEl(query.battle_ui.heal_pop_up[pot_type]+">img",0,init_clickPot);
	};
	if (do_click_heal) {
		clickAndCheck(query.battle_ui.heal,0,query.battle_ui.heal_pop_up[pot_type]+">img",0,my_profile+"Clicking heal pop up",clickPot);
	} else {
		if (typeof callback == "function") {
			callback();
		}
	}

}

function usePots(pot_type,list_cid=[],callback=false) {
	console.log('usePots');
	console.log('pot_type');
	console.log(pot_type);
	console.log('list_cid');
	console.log(list_cid);
	if (list_cid > 0) {
		let new_list_cid = Object.values(list_cid);
		new_list_cid.splice(0,1);
		let next_clear = function(){usePots(pot_type,new_list_cid, callback);};
		usePot(pot_type,parseInt(list_cid[0]),next_clear);
	} else {
		if (typeof callback == "function") {
			callback();
		}
	}
}

// function usePot (pot_type,char_id=false,callback=false) {
// 	// console.log(usePot.name);
// 	let is_front_healable = [];
// 	let is_player_reviveable = [];
// 	let is_player_healable = [];
// 	for (const i in battle.player.param) {
// 		if (battle.player.param.hasOwnProperty(i)) {
// 			if (battle.player.param[i].alive === 1) {
// 				is_player_reviveable.push(false);
// 				is_player_healable.push(battle.player.param[i].hpmax - battle.player.param[i].hp !== 0);
// 			}else{
// 				is_player_reviveable.push(true);
// 				is_player_healable.push(false);
// 			}
// 		}
// 	}
// 	for (const i in rep.formation) {
// 		if (rep.formation.hasOwnProperty(i)) {
// 			const alive_id = parseInt(rep.formation[i]);
// 			is_front_healable.push(battle.player.param[alive_id].hpmax - battle.player.param[alive_id].hp !== 0);
// 		}
// 	}
// 	let query_qty = ">.txt-having>.having-num";
// 	let clickUse = function() {
// 		clickAndNegCheck(query.battle_ui.heal_pop_up.use,0,my_profile+"Clicking use from pot pop up",callback);
// 	};
// 	let clickFront = function() {
// 		clickAndCheck(query.battle_ui.char_ico,char_id,query.battle_ui.summon_panel+":not(.mask-black)",0,my_profile+"Clicking char_ico from pot pop up",callback);
// 	};
// 	let clickCancel = function() {
// 		clickAndNegCheck(query.battle_ui.heal_pop_up.cancel,0,my_profile+"Clicking cancel from pot pop up",callback);
// 	};
// 	let clickPot = function() {
// 		console.log(clickPot.name);
// 		if (checkExist(query.battle_ui.heal_pop_up[pot_type]+query_qty)) {
// 			if ( parseInt(document.querySelector(query.battle_ui.heal_pop_up[pot_type]+query_qty).innerHTML) > 0 ) {
// 				if (pot_type == "blue") {
// 					clickAndNegCheck(query.battle_ui.heal_pop_up[pot_type]+">img",0,my_profile+"Clicking "+ pot_type +" pot",clickUse);
// 				}else if (pot_type == "green") {
// 					clickAndNegCheck(query.battle_ui.heal_pop_up[pot_type]+">img",0,my_profile+"Clicking "+ pot_type +" pot",clickFront);
// 				}else{
// 					console.log("pot_type unknown");
// 					clickCancel();
// 				}
// 			}else{
// 				console.log("pot qty not > 0");
// 				clickCancel();
// 			}
// 		}else{
// 			console.log("element not exist");
// 			clickCancel();
// 		}
// 	};
// 	let clickHeal = function() {
// 		console.log(clickHeal.name);
// 		clickAndCheck(query.battle_ui.heal,0,query.battle_ui.heal_pop_up[pot_type]+">img",0,my_profile+"Clicking heal pop up",clickPot,20);
// 	};
// 	let do_heal = false;
// 	if (pot_type=="blue" && is_front_healable.indexOf(true)>=0) {
// 		do_heal = true;
// 	}else if (pot_type=="green" && is_player_healable[char_id]) {
// 		do_heal = true;
// 	}else{
// 		if (typeof callback == "function") {
// 			callback();
// 		}
// 	}
// 	if (do_heal) {
// 		checkEl(query.battle_ui.heal,0,clickHeal);
// 	}
// }

function clickBackup(callback=false) {
	let check_backup = function() {
		let el_btn, backup_msg;
		if (Array.from(document.querySelector(query.battle_ui.backup_pop_up.request).classList).indexOf("disable") >= 0) {
			el_btn = query.battle_ui.backup_pop_up.cancel;
			backup_msg = "cancel";
		} else {
			el_btn = query.battle_ui.backup_pop_up.request;
			backup_msg = "request";
		}
		clickAndNegCheck(el_btn,0,my_profile+"Clicking "+backup_msg,callback,10);
	};
	clickAndCheck(query.battle_ui.button.assist,0,query.battle_ui.backup_pop_up.request,0,my_profile+"Clicking backup",check_backup,10);
}

function clickBack(callback=false){
	clickAndCheck(".btn-command-back.display-on",0,"div.prt-member",0,my_profile+"Clicking back",callback,10);
}

function clickSummonPanel(callback=false){
	console.log(clickSummonPanel.name);
	let query1 = ".prt-list-top.btn-command-summon.summon-on";
	let query2 = ".prt-summon-list.opened";
	let query3 = ".prt-list-top.btn-command-summon.summon-off";
	let qid1 = 0, qid2 = 0, qid3 = 0;
	let msg = my_profile+"Clicking summon panel";
	let old_top = -1;
	let old_left = -1;
	let loop_clickAndCheck = setInterval(function() {
		console.log(clickAndCheck.name + ", check: " + query2 + "["+(qid2.toString())+"], click: " + query1 + "["+(qid1.toString())+"]");
		if (checkExist(query2,qid2) || checkExist(query3,qid3)) {
			clearInterval(loop_clickAndCheck);
			if (typeof callback == "function") {
				callback();
			}
		}else{
			if (checkExist(query1,qid1)) {
				if (old_top==document.querySelectorAll(query1)[qid1].getBoundingClientRect().top && old_left==document.querySelectorAll(query1)[qid1].getBoundingClientRect().left) {
					clickNow(query1,qid1,msg);
				}else{
					old_top = document.querySelectorAll(query1)[qid1].getBoundingClientRect().top;
					old_left = document.querySelectorAll(query1)[qid1].getBoundingClientRect().left;
				}
			}
		}
	}, 200);
}

function clickSummon(summon_id,callback1=false,callback2=false){
	console.log(clickSummon.name);
	summon_id = summon_id-1;
	if (Array.from(document.querySelectorAll(".lis-summon")[summon_id].classList).indexOf("btn-summon-available")>=0){
		let loop_clickSummon = setInterval(function() {
			if (document.querySelectorAll(".lis-summon>img")[summon_id].getBoundingClientRect().x === document.querySelectorAll(".lis-summon>img")[0].getBoundingClientRect().x + (summon_id * (document.querySelectorAll(".lis-summon>img")[0].getBoundingClientRect().width+2))){
				clearInterval(loop_clickSummon);
				let q_img = '.lis-summon>img';
				let q_skin = '#wrapper > div.contents > div.cnt-raid > div.prt-command > div.prt-command-summon.summon-show > div > div.lis-summon.is-skin.on.btn-summon-available > div.prt-summon-skin > img';
				if (summon_id == 0) {
					if (checkExist(q_skin,0)) {
						q_img = q_skin;
					}
				}
				clickAndCheck(q_img,summon_id,".pop-usual.pop-summon-detail>div>.btn-usual-ok.btn-summon-use",0,my_profile+"Clicking summon "+((summon_id+1).toString()),callback1);
			}
		}, 300);
	}else{
		if (typeof callback2 == "function") {
			callback2();
		}
	}
}

function clickOkSummon(callback=false){
	console.log(clickOkSummon.name);
	let el_ok = ".pop-usual.pop-summon-detail>div>.btn-usual-ok.btn-summon-use";
	if (document.querySelector(el_ok) !== null){
		clickAndCheck(el_ok,0,"div.prt-member",0,my_profile+"Clicking summon ok",callback);
	}else{
		if (typeof callback == "function") {
			callback();
		}
	}
}
function clickOkSummon2(summon_id,callback=false){
	let el_ok = ".pop-usual.pop-summon-detail>div>.btn-usual-ok.btn-summon-use";
	let summon_el = '.lis-summon[pos="'+(summon_id.toString())+'"]';
	if (document.querySelector(el_ok) !== null){
		let loop_clickOkSummon2 = setInterval(function() {
			console.log(clickOkSummon2.name + ", click: " + el_ok + "[0]");
			if (Array.from(document.querySelector(summon_el).classList).indexOf("tmp-mask")>=0 || Array.from(document.querySelector(summon_el).classList).indexOf("btn-summon-unavailable")>=0) {
				clearInterval(loop_clickOkSummon2);
				if (typeof callback == "function") {
					callback();
				}
			}else{
				if (checkExist(el_ok,0)) {
					clickNow(el_ok,0,my_profile+"Clicking summon ok2");
				}
			}
		}, 1000);
	}else{
		if (typeof callback == "function") {
			callback();
		}
	}
}

function selectSummon(preferred_summon,is_trial=false){
	reload(20);

	let init_selectSummon = function() {
		console.log(init_selectSummon.name);
		reload(10);
		const attrib_list = [6,0,1,2,3,4,5];
		let query_summon_list = ".btn-supporter.lis-supporter";
		let el_summon_list = document.querySelectorAll(query_summon_list);
		let preferred_summon_id = false;
		let picked_attrib_id = false;
		let picked_summon_id = false;
		let picked_is_friend = false;
		let is_friend;
		let picked_summon_stars = false;
		let picked_summon_level = false;
		let picked_summon_plus = false;
		let msg;
		let cmd = [], summon_list = {};
		if (el_summon_list.length>50 && document.querySelector(".prt-supporter-battle-announce")===null && document.querySelector(".txt-confirm-comment")===null && document.querySelector(".prt-check-auth")===null && document.querySelector(".btn-check-auth")===null){
			msg = my_profile+"Verify not appear, summon list length is "+(el_summon_list.length.toString());
			console.log(msg);

			// check if raid is trial
			if (!is_trial){
				console.log("not trial");
				for (let i = 0; i < el_summon_list.length; i++) {
					let match_preferred = false, replace = false;
					let temp_var, summon_detail, summon_name, summon_level, summon_stars, summon_plus;
					temp_var = el_summon_list[i].querySelector(".prt-supporter-summon");
					summon_detail = temp_var.innerHTML.trim();
					temp_var = el_summon_list[i].querySelector(".prt-supporter-summon");
					summon_detail = temp_var.innerHTML.trim();
					summon_name = summon_detail.substring(summon_detail.indexOf("</span>")+8,summon_detail.length);
					summon_level = parseInt(temp_var.children[0].innerHTML.replace("Lvl ",""));
					temp_var = Array.from(el_summon_list[i].querySelector(".prt-summon-skill").classList);
					if (temp_var.indexOf("bless-rank3-style")>=0){
						summon_stars = 5;
					}else if (temp_var.indexOf("bless-rank2-style")>=0){
						summon_stars = 4;
					}else if (temp_var.indexOf("bless-rank1-style")>=0){
						summon_stars = 3;
					}else{
						summon_stars = 0;
					}
					temp_var = el_summon_list[i].querySelector(".prt-summon-quality");
					if (temp_var !== null){
						summon_plus = parseInt(temp_var.innerHTML.replace("+",""));
					}else{
						summon_plus = 0;
					}
					temp_var = false;
					is_friend = Array.from(el_summon_list[i].querySelector(".prt-supporter-name").classList).indexOf("ico-friend")>=0;

					// loop preferred summon list (specified in parameter)
					for (let j = 0; j < preferred_summon.length; j++) {
						if (preferred_summon[j].name==summon_name && preferred_summon[j].star<=summon_stars){
							match_preferred = true;
							temp_var = j;
						}
					}


					if (match_preferred){
						if (picked_attrib_id===false && picked_summon_id===false){
							replace = true;
						}else{
							if (preferred_summon_id>temp_var){
								replace = true;
							}else if(preferred_summon_id==temp_var){
								if (summon_stars>picked_summon_stars){
									replace = true;
								}else if(summon_stars==picked_summon_stars){
									if (!picked_is_friend && is_friend){
										replace = true;
									}else if(picked_is_friend && is_friend){
										if (summon_level>picked_summon_level){
											replace = true;
										}else if(summon_level==picked_summon_level){
											if (summon_plus>picked_summon_plus){
												replace = true;
											}
										}
									}
								}
							}
						}
					}
					if (replace){
						picked_attrib_id = Array.from(document.querySelectorAll(".prt-supporter-attribute")).indexOf(el_summon_list[i].parentElement);
						picked_summon_id = i;
						preferred_summon_id = temp_var;
						picked_summon_stars = summon_stars;
						picked_is_friend = is_friend;
						picked_summon_level = summon_level;
						picked_summon_plus = summon_plus;
					}
				}
				console.log([picked_attrib_id,picked_summon_id,preferred_summon_id]);
				if (picked_summon_id===false){
					console.log("go to trial");
					cmd.push({"cmd":"log","level":"process","msg":message.summon.not_found});
					xhr.open("POST", server);
					xhr.send(JSON.stringify(cmd));
					gotoHash("trial");
				}else{
					console.log("summon_found");
					let pickSummon = function() {
						scroll_To(query_summon_list,picked_summon_id);
						clickEl(query_summon_list,picked_summon_id,message.summon.select);
					};
					let clickAndCheckSummon = function(callback=false){
						let el_tab_ele_ico = ".prt-type-text";
						let el_summon_container = ".prt-supporter-attribute";
						let loop_clickAndCheckSummon = setInterval(function() {
							console.log(clickAndCheckSummon.name + ", check: " + el_summon_container + "[" + picked_attrib_id + "], click: " + el_tab_ele_ico + "["+(attrib_list[picked_attrib_id].toString())+"]");
							if (Array.from(document.querySelectorAll(el_summon_container)[picked_attrib_id].classList).indexOf("disableView") == -1) {
								clearInterval(loop_clickAndCheckSummon);
								if (typeof callback == "function") {
									callback();
								}
							}else{
								if (checkExist(el_tab_ele_ico, attrib_list[picked_attrib_id])) {
									clickNow(el_tab_ele_ico, attrib_list[picked_attrib_id], message.summon.pick_tab);
								}
							}
						}, 300);
					};
					clickAndCheckSummon(pickSummon);
				}
			}else{
				console.log("is trial");
				query_summon_list = ".prt-supporter-attribute:not(.disableView)>.btn-supporter.lis-supporter";
				el_summon_list = document.querySelectorAll(query_summon_list);
				for (let i = 0; i < el_summon_list.length; i++) {
					is_friend = Array.from(el_summon_list[i].querySelector(".prt-supporter-name").classList).indexOf("ico-friend")>=0;
					if (!is_friend){
						if (picked_summon_id===false){
							picked_summon_id = i;
						}
					}
				}
				if (picked_summon_id!==false){
					scroll_To(".prt-supporter-attribute:not(.disableView)>.btn-supporter.lis-supporter",picked_summon_id);
					clickEl(".prt-supporter-attribute:not(.disableView)>.btn-supporter.lis-supporter",picked_summon_id,message.summon.select);
				}
			}
		}else{
			msg = my_profile+"Verify might appear, summon list length is "+(el_summon_list.length.toString());
			clearInterval(reload_counter);
			console.log(msg);
			cmd.push({"cmd":"log","level":"process","msg":msg});
			cmd.push({"cmd":"log","level":"notif","msg":msg});
			xhr.open("POST", server);
			xhr.send(JSON.stringify(cmd));
		}
	};
	checkEl(".prt-supporter-title",0,init_selectSummon);
}

function doChat(callback=false) {
	console.log(doChat.name);
	let clickDialog = function() {
		console.log(clickDialog.name);
		clickAndNegCheck(query.battle_ui.chat_pop_up.dialog,0,my_profile+"Clicking chat dialog",callback);
	};
	let clickChat = function() {
		console.log(clickChat.name);
		if (checkExist(query.battle_ui.chat+">.ico-attention",0)) {
			clickAndCheck(query.battle_ui.chat,0,query.battle_ui.chat_pop_up.dialog,0,my_profile+"Clicking chat pop up",clickDialog,20);
		}else{
			if (typeof callback == "function") {
				callback();
			}
		}
	};
	checkEl(query.battle_ui.chat,0,clickChat);
}

function backFromTrial(){
	let cmd = [];
	cmd.push({"cmd":"log","level":"process","msg":message.raid.trial.end});
	xhr.open("POST", server);
	xhr.send(JSON.stringify(cmd));
	gotoHash("main");
}

function gotoResult() {
	console.log(gotoResult.name);
	console.log(is_host);
	if (is_host || window.location.hash.indexOf("#raid/")>=0) {
		gotoHash("quest");
	}else if (window.location.hash.indexOf("#raid_multi")>=0) {
		reloadNow();
	}
}

function attack(rep){
	console.log(attack.name);
	let cmd = [];
	let reps = rep.scenario;
	let win = false;
	let is_last_raid = false;
	let ougi = 0;
	let msg = "";
	for (let i = 0; i < reps.length; i++) {
		if (reps[i].cmd =="win"){
			if (reps[i].is_last_raid){is_last_raid=true;}
			win=true;
		}else if (reps[i].cmd=="special" || reps[i].cmd=="special_npc"){
			const char_name = battle.player.param[parseInt(battle.formation[reps[i].pos])].name;
			msg += my_profile+char_name+" used ougi \""+reps[i].name+"\".\n";
			if (reps[i].total){msg += my_profile+char_name+" dealt "+reps[i].total[0].split.join("")+" damage.\n";}
			ougi++;
		}else if (reps[i].cmd=="attack" && reps[i].from=="player"){
			const char_name = battle.player.param[parseInt(battle.formation[reps[i].pos])].name;
			if (reps[i].damage.length==3){
				msg += my_profile+char_name+" made a triple attack.\n";
			}else if (reps[i].damage.length==2){
				msg += my_profile+char_name+" made a double attack.\n";
			}
			msg += my_profile+char_name+ " dealt ";
			for (let ii=0; ii<reps[i].damage.length; ii++){
				msg += reps[i].damage[ii][0].value.toString();
				if (ii<reps[i].damage.length-1){
					msg += ", ";
				}else{
					msg += " damage.\n";
				}
			}
		}
	}

	if(win){
		cmd.push({"cmd":"log","level":"process","msg":msg+my_profile+"Foe defeated."});
	}else{
		cmd.push({"cmd":"log","level":"process","msg":msg+my_profile+"Foe is still alive."});
		cmd.push({"cmd":"press","key":"f5"});
	}
	xhr.open('POST', server);
	xhr.send(JSON.stringify(cmd));
	if(win && is_last_raid){
		gotoResult();
	}else if(win){
		clickEl(".btn-result",0,my_profile+"Go to next round");
	}
}

function skillUsed(rep){
	console.log(skillUsed.name);
	let do_reload = false;
	let reps = rep.scenario;
	let win = false, is_last_raid = false;
	console.log(reps);
	for (let i = 0; i < reps.length; i++) {
		const scenario = reps[i];
		if (scenario.cmd =="ability"){
			if (scenario.hasOwnProperty('name')) {
				if (reloadable_skill.indexOf(scenario.name)>= 0) {
					do_reload = true;
				}
			}
		} else if (scenario.cmd =="damage") {
			if (scenario.to == "player") {
				for (let j = 0; j < scenario.list.length; j++) {
					const s = scenario.list[j];
					if (s.hp !== undefined && s.pos !== undefined) {
						battle.player.param[s.pos].hp = s.hp;
					}
				}
			}
		}else if (scenario.cmd =="finished"){
			win=true;
			is_last_raid=true;
		}else if (scenario.cmd == "win"){
			if (scenario.is_last_raid) {
				is_last_raid=true;
			}
			win=true;
		}
		
	}
	if(win && is_last_raid){
		gotoResult();
	}else if (win && !is_last_raid) {
		clickEl(".btn-result",0,my_profile+"Go to next round");
	}else if(do_reload){
		reloadNow();
	}
}

function summonUsed(rep){
	console.log(summonUsed.name);
	let do_reload = false;
	let reps = rep.scenario;
	let win = false,
		is_last_raid = false;
	for (let i = 0; i < reps.length; i++) {
		const scenario = reps[i];
		if (scenario.cmd == 'ability'){
			if (scenario.hasOwnProperty('name')) {
				if (reloadable_summon.indexOf(scenario.name)>= 0) {
					do_reload = true;
				}
			}
		} else if (scenario.cmd == "finished"){
			win=true;
			is_last_raid=true;
		} else if (scenario.cmd == "win"){
			if (scenario.is_last_raid){
				is_last_raid=true;
			}
			win=true;
		}	
	}
	if (battle.lyria_pos >= 0) {
		do_reload = true;
	}
	if(win && is_last_raid){
		gotoResult();
	}else if(do_reload){
		reloadNow();
	}
}

function potUsed(rep) {
	console.log(potUsed.name);
	let reps = rep.scenario;
	for (let i = 0; i < reps.length; i++) {
		const scenario = reps[i];
		if (scenario.cmd == "heal") {
			for (let j = 0; j < scenario.list.length; j++) {
				const s = scenario.list[j];
				if (s.hp !== undefined && s.pos !== undefined) {
					battle.player.param[s.pos].hp = s.hp;
				}
			}
		}
	}
}


function clickAttack(callback=false) {
	let hp = ((parseInt(battle.boss.param[0].hp) / parseInt(battle.boss.param[0].hpmax)) * 100).toString();
	if (hp.indexOf(".")>=0){
		hp = hp.substring(0,hp.indexOf("."));
	}
	console.log(hp);
	let attack_msg = my_profile+"Foe hp is "+hp+"% left, commencing attack";
	clickAndCheck(".btn-attack-start.display-on",0,".btn-attack-cancel.btn-cancel.display-on",0,attack_msg,callback,20);
}

function charMoveSet(cid,skill_list,callback) {
	if (!(Number.isInteger(cid))) {
		cid = battle.player.param.findIndex(x => x.name === cid);
	}
	console.log(charMoveSet.name + ': ' + cid);
	let char = battle.player.param[cid];
	console.log(char.name);
	console.log('skill_list:');
	console.log(skill_list);
	if (char !== undefined) {
		console.log(charMoveSet.name + ': ' + char.name + ', debug: 1');
		let char_in_front = false;
		let can_use_skill = true;
		if (battle.formation.indexOf(cid.toString()) >= 0) {
			console.log(charMoveSet.name + ': ' + char.name + ', debug: 2');
			char_in_front = true;
		}
		console.log(charMoveSet.name + ': ' + char.name + ', debug: 3');
		console.log(battle.formation);
		if (char_in_front && char.alive === 1) {
			console.log(charMoveSet.name + ': ' + char.name + ', debug: 4');
			if (skill_list.length>0) {
				console.log(charMoveSet.name + ': ' + char.name + ', debug: 5');
				let new_skill_list = Object.values(skill_list);
				for (let i = 0; i < skill_list.length; i++) {
					const skill = skill_list[i];
					if (document.querySelector(query.battle_ui.skill['char'+(battle.formation.indexOf(cid.toString())+1).toString()]['skill'+(skill.toString())]).attributes.state.value != "2") {
						new_skill_list.splice(new_skill_list.indexOf(skill),1);
					}
				}
				console.log(charMoveSet.name + ': ' + char.name + ', debug: 6');
				skill_list = new_skill_list;
				if ("debuff" in char.condition) {
					console.log(charMoveSet.name + ': ' + char.name + ', debug: 7');
					for (let i = 0; i < char.condition.debuff.length; i++) {
						const debuff = char.condition.debuff[i];
						if (skill_disable_debuffs.indexOf(debuff.status) >= 0) {
							can_use_skill = false;
						}
					}
				}
			}
		}
		console.log(charMoveSet.name + ': ' + char.name + ', debug: 8');
		if (char_in_front && char.alive===1 && skill_list.length>0 && can_use_skill) {
			console.log(charMoveSet.name + ': ' + char.name + ', debug: 9');
			let click_back = function(){clickBack(callback);};
			let use_skills = function(){useSkills(cid,skill_list,click_back);};
			let click_char = function(){clickChar(cid,use_skills);};
			click_char();
		} else {
			console.log(charMoveSet.name + ': ' + char.name + ', debug: 10');
			if (typeof callback == "function") {
				console.log(charMoveSet.name + ': ' + char.name + ', debug: 11');
				callback();
			}
		}
	} else {
		console.log(charMoveSet.name + ': ' + char.name + ', debug: 12');
		if (typeof callback == "function") {
			console.log(charMoveSet.name + ': ' + char.name + ', debug: 13');
			callback();
		}
	}
}


function toggleOugi(ougi, callback=false) {
	let init_toggleOugi = function() {
		let current_ougi = "."+document.querySelector(query.battle_ui.ougi).classList[1];
		if (query.battle_ui.toggle_ougi[ougi] != current_ougi){
			clickAndCheck(query.battle_ui.ougi + current_ougi, 0, query.battle_ui.ougi + query.battle_ui.toggle_ougi[ougi], 0, my_profile+"Set toggle ougi to "+(ougi.toString()), callback);
		}else{
			if (typeof callback == "function") {
				callback();
			}
		}
	};
	checkEl(query.battle_ui.ougi,0,init_toggleOugi);
}

function summoning(summon_id,callback=false) {
	console.log(summoning.name);
	let summon_cd;
	if (summon_id === 5) {
		summon_cd = battle.supporter.recast;
	} else if (battle.summon[summon_id] !== undefined) {
		summon_cd = battle.summon[summon_id].recast;
	}
	if (summon_cd === "0") {
		let summon_ok = function(){clickOkSummon(callback);};
		let summon = function(){clickSummon(summon_id+1,summon_ok,callback);};
		let summon_p = function(){clickSummonPanel(summon);};
		summon_p();
	} else {
		if (typeof callback == "function") {
			callback();
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
		gotoHash('main');
	}
}

let battleLogic = function(case_battle) {
	console.log(battleLogic.name);
	console.log('case_battle:');
	console.log(case_battle);
	clearInterval(reload_counter);
};

function startRaid(rep){
	reload(15);
	battle = rep;
	is_host = rep.is_host;
	for (let i = 0; i < battle.player.param.length; i++) {
		const c = battle.player.param[i];
		if (c.alive === 1) {
			is_wiped = false;
		}
	}

	let check_exist = setInterval(function() {
		console.log("querying enemy name to appear");
		if (document.querySelector("a.btn-targeting.enemy-1:not(.invisible)") !== null || document.querySelector("a.btn-targeting.enemy-2:not(.invisible)") !== null || document.querySelector("a.btn-targeting.enemy-3:not(.invisible)") !== null){
			console.log("check width enemy name");
			if (document.querySelector("a.btn-targeting.enemy-1:not(.invisible)").getBoundingClientRect().width>0 || document.querySelector("a.btn-targeting.enemy-2:not(.invisible)").getBoundingClientRect().width>0 || document.querySelector("a.btn-targeting.enemy-3:not(.invisible)").getBoundingClientRect().width>0){
				console.log("found enemy name");
				clearInterval(check_exist);
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
					if (battle.is_trialbattle) {
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
				let hp = ((parseInt(rep.boss.param[0].hp) / parseInt(rep.boss.param[0].hpmax)) * 100).toString();
				if (hp.indexOf(".")>=0){
					hp = hp.substring(0,hp.indexOf("."));
				}
				battleLogic(case_battle);
			}
		}
	}, 300);
}

function clickChar(cid,callback=false) {
	let front_id = battle.formation.indexOf(cid.toString())+1;
	clickAndCheck("div.prt-member>div.btn-command-character>img.img-chara-command",front_id-1,".prt-command-chara.chara"+(front_id.toString()),0,my_profile+"Clicking "+battle.player.param[cid].name,callback);
}

function clickBoss(boss_id,callback=false) {
	const boss_id_str = (boss_id+1).toString();
	if (battle.boss.param[boss_id] !== undefined || battle.boss.param[boss_id].alive === 1) {
		clickAndCheck('.enemy-info>.name',boss_id,'.btn-targeting.enemy-'+boss_id_str+'.lock-on',0,my_profile+'Clicking Boss '+boss_id_str,callback);
	} else {
		if (typeof callback == "function") {
			callback();
		}
	}
}

function raidFinish(rep,send_all_loot=false){
	console.log(raidFinish.name);
	reload(10);
	let cmd = [];
	let tracked_loot = [];
	let check_timer = true;
	cmd.push({"cmd":"log","level":"process","msg":message.raid.finish});

	let all_loot = {};
	let important_loot = {};
	for (const i in rep.rewards.reward_list) {
		if (rep.rewards.reward_list.hasOwnProperty(i)) {
			const loots = rep.rewards.reward_list[i];
			for (const j in loots) {
				if (loots.hasOwnProperty(j)) {
					const loot = loots[j];
					if ( ( ['weapon','summon'].indexOf(loot.type) >= 0 ) && loot.rarity=='4') {
						if (tracked_loot.indexOf(loot.name)===-1) {
							tracked_loot.push(loot.name);
						}
					} else if (tracker_reward_weapons.indexOf(loot.name) >= 0 || tracker_reward_summons.indexOf(loot.name) >= 0 || tracker_reward_items.indexOf(loot.name) >= 0) {
						if (tracked_loot.indexOf(loot.name)===-1) {
							tracked_loot.push(loot.name);
						}
					}
					if (all_loot[loot.name]===undefined) {
						all_loot[loot.name] = parseInt(loot.count);
					} else {
						all_loot[loot.name] += parseInt(loot.count);
					}
				}
			}
		}
	}
	if (send_all_loot) {
		important_loot = all_loot;
	} else {
		for (const loot in all_loot) {
			if (all_loot.hasOwnProperty(loot)) {
				const qty = all_loot[loot];
				if (tracked_loot.indexOf(loot)>=0) {
					important_loot[loot] = qty;
				}
			}
		}
	}
	console.log(important_loot);
	if (Object.keys(important_loot).length > 0) {
		cmd.push({"cmd":"reward","payload":important_loot});
		cmd.push({"cmd":"log","level":"summary","msg":Object.keys(important_loot).length});
	}

	if (tracked_item !== false){
		let data_track = my_profile+"Current Status:";
		let temp_str;
		for (let item in tracked_item){
			if (tracked_item.hasOwnProperty(item)) {
				let item_qty = parseInt(tracked_item[item].number);
				let drop_qty = 0;
				if (all_loot[tracked_item[item].name] !== undefined) {
					drop_qty = all_loot[tracked_item[item].name];
				}
				temp_str = "\n- "+tracked_item[item].name+": "+(item_qty + drop_qty).toString();
				if (all_loot[tracked_item[item].name] !== undefined) {
					temp_str += '  ( +'+(drop_qty).toString()+' )';
				}
		        data_track += temp_str;
		    }
		}
		cmd.push({"cmd":"log","level":"summary","msg":data_track,"split":0});
	}
	if (check_timer){
		cmd.push({"cmd":"check_timer"});
	}
	xhr.open('POST', server);
	xhr.send(JSON.stringify(cmd)); 
	let gotoMain = function() {gotoHash("main");};
	checkEl(".mask",0,gotoMain);
}

function quitTrial(){
	let doit3 = function(){clickEl(".btn-usual-ok",0,message.raid.trial.ok);};
	let doit2 = function(){clickEl(".btn-withdrow.btn-red-m",0,message.raid.trial.retreat,doit3);};
	let doit1 = function(){clickEl(".btn-raid-menu.menu",0,message.raid.trial.open_menu,doit2);};
	clickAndNegCheck(query.battle_ui.trial_pop_up.close,0,message.raid.trial.close_pop_up,doit1);
}

function missionComplete(cmd=[]) {
	clearInterval(reload_counter);
	// let cmd = [];
	cmd.push({"cmd":"log","level":"notif","msg":my_profile+"Objective cleared. Mission complete. "+discord_mention});
	cmd.push({"cmd":"log","level":"summary","msg":my_profile+"Objective cleared. Mission complete."});
	cmd.push({"cmd":"hotkey","keys":["ctrl","w"]});
	xhr.open('POST', server);
	xhr.send(JSON.stringify(cmd));
}

let listenNetwork = function() {
	console.log('listenNetwork');
	clearInterval(reload_counter);
};

function init() {
	"use strict";
	console.log(init.name);
	reload(5);
	setDebug();
	listenNetwork();
	let checkBody = setInterval(function() {
		console.log(checkBody.name);
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
}