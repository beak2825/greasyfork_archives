// ==UserScript==
// @name         Comfy Friendly
// @namespace    comfy_script
// @icon         https://i.imgur.com/wFXYDEt.png
// @version      1.02
// @description  Lets you use any character or items for free as long as the other person also uses the mod.
// @author       Anon
// @include      https://mahjongsoul.game.yo-star.com/
// @include      https://game.mahjongsoul.com/
// @connect      majsoul.riichinyaa.com
// @include      https://majsoul.union-game.com/0/
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/440091/Comfy%20Friendly.user.js
// @updateURL https://update.greasyfork.org/scripts/440091/Comfy%20Friendly.meta.js
// ==/UserScript==

(function()
{
	// Unlock Everybody: https://pastebin.com/FdGsJRwV
	// Use along with the Unlock Everybody mod to select a desired character to play.
	// Press Ctrl to switch names between Normal, Anonymous and Character Name.
    'use strict'
	var anonymous_name = "Anonymous"; // Name used for Anonymous setting 
	var change_names_inlobby = true; // Set to false to show real names in lobby 
	var KEY = 17; // Key used to toggle names (87 = W, 17 = ctrl)
	
	var settings = {character_display_name:1};
	var mod_players = []; 
	var get_players_ready = false, the_game_uuid = 0, stored_spec_uuid = 0;
	var ready = true, down = false;
	var logging_error = true, logging_json = true, logging_events = true;
	load_name_settings();
	setTimeout(add_event_triggers, 2000);

	// This mod reuses lots of helpful code and functions from loads of other mods like
	// anonymizer, unlock everybody, usausa and many more.

	// event functions
	function add_event_triggers()
	{
		// added anti region mod (USA mod to unlock Saki characters)
		var LobbyCheck = setInterval(function(){
        if (GameMgr.prototype.EnterLobby){
            GameMgr.prototype.EnterLobby = (function() {
                var cacheF = GameMgr.prototype.EnterLobby;
                return function(){
                    GameMgr.country = "US";
                    var result = cacheF.apply(this, arguments);
                    return result;
                };
            })();
            clearInterval(LobbyCheck);
        }},2000);
		
		c_event("Trying to add event triggers");
		document.addEventListener('keydown', function(e)
		{
			e = e || window.event;
			if ((e.keyCode == KEY || e.key == KEY) && ready && !down)
			{
				handle_display_char_change();
				down = true;
			}
		}, true);
		document.addEventListener('keyup', function(e)
		{
			e = e || window.event;
			if ((e.keyCode == KEY || e.key == KEY) && ready)down = false;
		}, true);
		
		var FetchInfoCheck = setInterval(function(){
        if (uiscript?.UI_Live_Broadcast?.fetchInfo){
            uiscript.UI_Live_Broadcast.fetchInfo = (function(){
                var cacheF = uiscript.UI_Live_Broadcast.fetchInfo;
                return function(){
				c_event("Note: Fetch Info Event Triggered.");c_event(arguments);
				try{ handle_fetch_info(this, cacheF, arguments);}
				catch(err){c_error(err);}
            };})();
            clearInterval(FetchInfoCheck);
        }},2000);
		var OpenRoomCheck = setInterval(function(){
        if (game?.Scene_MJ?.Inst?.openMJRoom){
            game.Scene_MJ.Inst.openMJRoom = (function(){
                var cacheF = game.Scene_MJ.Inst.openMJRoom;
                return function(){
				c_event("Note: Open MJ Room Event Triggered.");c_event(arguments);
				try{ handle_open_mj_room(this, cacheF, arguments);}
				catch(err){c_error(err);}
            };})();
            clearInterval(OpenRoomCheck);
        }},2000);
		var StartupCheck = setInterval(function(){
        if (uiscript?.UI_OtherPlayerInfo?.Inst?.refreshBaseInfo){
			c_event("Note: Startup Check Replacing Existing Functions.");
			try{ replace_existing_functions();}
			catch(err){c_error(err);}
            clearInterval(StartupCheck);
        }},2000);
		var LobbyListenCheck = setInterval(function(){
        if (uiscript?.UI_OtherPlayerInfo?.Inst?.refreshBaseInfo){
			c_event("Note: Adding Lobby Listeners.");
			try{				
			app.NetAgent.AddListener2Lobby("NotifyRoomPlayerReady", Laya.Handler.create(this, function (t) {
			c_event("Note: NotifyRoomPlayerREADY Event Triggered.");c_event(t);
			try{handle_player_ready_change(t);}
			catch(err){c_error(err);}
		}));
		app.NetAgent.AddListener2Lobby("NotifyRoomPlayerUpdate", Laya.Handler.create(this, function (t) {
			c_event("Note: NotifyRoomPlayerUPDATE Event Triggered.");c_event(t);
			try{handle_player_update_change(t);}
			catch(err){c_error(err);}
		}));							
		app.NetAgent.AddListener2Lobby("NotifyRoomGameStart", Laya.Handler.create(this, function (t) {
			c_event("Note: Game is starting event triggered.");c_event(t);
			try{handle_start_button_pressed(t);}
			catch(err){c_error(err);}
		}));						
			}catch(err){c_error(err);}
            clearInterval(LobbyListenCheck);
        }},2000);	
	}

	function handle_fetch_info(returnC, returnF, args)
	{
		stored_spec_uuid = args[0];
		return returnF.apply(returnC, args);
	}
	
	async function handle_open_mj_room(returnC, returnF, args)
	{
		c_event("Got to Handle Open MJRoom");
		GameMgr.country = "US";  // fix by forcing US in case of reconnect and not set yet
		var mj_config = args[0], mj_players = args[1], mj_details = args[3];
		var is_spec=false; the_game_uuid=0;
		
		if(stored_spec_uuid!=0){the_game_uuid = stored_spec_uuid;stored_spec_uuid=0;is_spec=true;} // a spec
		else if(mj_details?.caller?.game_uuid)the_game_uuid=mj_details.caller.game_uuid // a game
		else if(mj_details?.caller?.record_uuid)the_game_uuid=mj_details.caller.record_uuid // a log
		
		var room_allowed = check_room_type_allowed(mj_config);
		// TODO: Correctly detect room type when spectating. For now set to always look for relevant players.
		if(!is_spec && !room_allowed)
		{
			c_event("Not Allowed Room Type");
			return returnF.apply(returnC, args);
		}		
		if(the_game_uuid==0)
		{
			c_all("No UUID Found");
			return returnF.apply(returnC, args);
		}
		preform_game_getplayers(mj_players);
		
		var times_to_check = 5, time_between_checks = 1000, result = false;
		for(var i=0; i<times_to_check;i++)
		{
			await quick_sleep(time_between_checks);
			c_event("Waiting...");
			if(get_players_ready){result=true;break}
		}
		if(!result)c_error("Get Players Failed");
		return returnF.apply(returnC, args);		
	}
	
	// functions to do JSON calls
	function do_gm_json_request(the_data)
	{
		GM.xmlHttpRequest({
		method: the_data.type,
		url: the_data.url,
		data: the_data.data,
		onreadystatechange: the_data.onreadystatechange,
		headers: {"Content-Type": "application/json"}
		});
	}
	
	function do_game_get_players(a_player_data)
	{
		c_json("Trying Game GETPLAYERS");
		if(the_game_uuid==0){c_all("Error: No UUID Set");return;}
		var xmlhttp = {};
		xmlhttp.url = mod_url+"/getplayers/";
		xmlhttp.type = "POST";
		xmlhttp.onreadystatechange = function(res)
		{
			if(res.readyState != 4 || res.status != 200)return;
			var myArr = JSON.parse(res.responseText);
			if(myArr?.error){c_error("Lobby Game GETPLAYERS Error");c_error(myArr);return;}
			c_json("Game GETPLAYERS Finished");c_json(myArr);
			var result = validate_rawplayers(myArr);
			if(result===true)update_game_player_look(myArr, a_player_data);
			else{c_error("GETPLAYERS JSON Validation Error!");c_error(result);}
		};
		xmlhttp.data = " { \"room_id\" : \"" + the_game_uuid + "\" }";
		c_json(xmlhttp.data);
		do_gm_json_request(xmlhttp);
	}
			
	function do_lobby_get_players()
	{
		c_json("Trying Lobby GETPLAYERS");
		var xmlhttp = {};
		xmlhttp.url = mod_url+"/getplayers/";
		xmlhttp.type = "POST";
		xmlhttp.data = " { \"room_id\" : \"0\" }";
		xmlhttp.onreadystatechange = function(res)
		{
			if(res.readyState != 4 || res.status != 200)return;
			var myArr = JSON.parse(res.responseText);
			if(myArr?.error){c_error("Lobby GETPLAYERS Error");c_error(myArr);return;}
			c_json("Lobby GETPLAYERS Finished");c_json(myArr);
			update_lobby_player_look(myArr);
		};
		c_json(xmlhttp.data);	
		do_gm_json_request(xmlhttp);
	}
	
	function do_game_set_player(p)
	{
		c_json("Trying Game SETPLAYERS");
		var xmlhttp = {};
		xmlhttp.url = mod_url+"/setplayer/";
		xmlhttp.type = "POST";
		xmlhttp.onreadystatechange = function(res)
		{
			if(res.readyState != 4 || res.status != 200)return;
			var myArr = JSON.parse(res.responseText);
			if(myArr?.error){c_error("Game SETPLAYER Error");c_error(myArr);return;}
			c_json("Game SETPLAYER Finished");c_json(myArr);
			// TODO: Check for success or fail
		};
		xmlhttp.data = JSON.stringify(p);
		c_json(xmlhttp.data);	
		do_gm_json_request(xmlhttp);
	}
	
	function do_lobby_set_player(p)
	{
		c_json("Trying Lobby SETPLAYER");
		var xmlhttp = {};
		xmlhttp.url = mod_url+"/setplayer/";
		xmlhttp.type = "POST";
		xmlhttp.onreadystatechange = function(res)
		{	
			if(res.readyState != 4 || res.status != 200)return;
			var myArr = JSON.parse(res.responseText);
			if(myArr?.error){c_error("Lobby SETPLAYER Error");c_error(myArr);return;}
			c_json("Lobby SETPLAYER Finished");c_json(myArr);
		};
		xmlhttp.data = JSON.stringify(p);
		c_json(xmlhttp.data);		
		do_gm_json_request(xmlhttp);
	}
	
	// updates for game and lobby including changing graphics and building/decorating mod_players
	function update_lobby_player_look(rawplayers)
	{
		var local_player_id = GameMgr.Inst.account_id;
		var local_player_hash = toaccid(GameMgr.Inst.account_id);
		mod_players = [];
		uiscript.UI_WaitingRoom.Inst.mod_players = mod_players;
		
		var p = uiscript.UI_WaitingRoom.Inst.players;
		for(var i=0;i<p.length; i++) 
		{
			if( p[i].account_id!=0)
			{
				var curr_hash = toaccid(p[i].account_id);
				var new_player = {};
				mod_players.push(new_player);
				
				if(!p[i]?.real_name)p[i].real_name = p[i].nickname;
				new_player.real_name = p[i].real_name;
				new_player.anon_name = anonymous_name;
				new_player.skin_id = p[i].avatar_id;
				new_player.char_name = get_local_first_name_from_skin_id(new_player.skin_id);
				new_player.account_id = p[i].account_id;
				new_player.is_owner = (uiscript.UI_WaitingRoom.Inst.owner_id==p[i].account_id);
				new_player.is_me =(p[i].account_id==local_player_id);
				new_player.is_mod = false;
				
				for(var j=0;j<rawplayers.length; j++) 
				{
					if(rawplayers[j].account_hash == curr_hash)
					{
						new_player.is_mod = true;
						new_player.account_hash = rawplayers[j].account_hash
						new_player.skin_id = rawplayers[j].skin_id;
						new_player.char_name = get_local_first_name_from_skin_id(new_player.skin_id);
						new_player.title_id = rawplayers[j].title_id;
					}
				}
				if(new_player.is_mod)p[i].avatar_id = new_player.skin_id;
				if(new_player.is_mod)p[i].title = new_player.title_id;
				p[i].nickname = new_player.real_name;
				if(change_names_inlobby)p[i].nickname = get_the_current_char_name(new_player);
				uiscript.UI_WaitingRoom.Inst._refreshPlayerInfo(p[i]);
			}
		}
	}
	
	function update_game_player_look(rawplayers, the_player_data)
	{	
		try{
		var local_player_id = GameMgr.Inst.account_id;
		var local_player_hash = toaccid(GameMgr.Inst.account_id);
		mod_players = [];
		
		var p = the_player_data
		for(var i=0;i<p.length; i++) 
		{
			if (typeof p[i].account_id !== 'undefined')
			{
				var curr_hash =toaccid(p[i].account_id);
				var new_player = {};
				mod_players.push(new_player);
				new_player.player_data = p[i];
				new_player.tmpindex = i;
				new_player.account_id = p[i].account_id; 
				new_player.skin_id = p[i].avatar_id;
				new_player.is_me = false;
				if(p[i].account_id==local_player_id)new_player.is_me = true;
				new_player.mod_update_me = false;
				new_player.real_name = p[i].nickname;
				new_player.anon_name = anonymous_name;
				new_player.char_name = get_local_first_name_from_skin_id(new_player.skin_id);
				new_player.is_mod = false;
								
				for(var j=0;j<rawplayers.length; j++)
				{
					if(rawplayers[j].account_hash == curr_hash)
					{
						c_event("Found a Matching Player");
						new_player.is_mod = true;
						new_player.mod_update_me = true;
						new_player.account_hash = rawplayers[j].account_hash
						new_player.skin_id = parseInt(rawplayers[j].skin_id);
						new_player.char_name = get_local_first_name_from_skin_id(new_player.skin_id);
						new_player.title_id = parseInt(rawplayers[j].title_id);
						new_player.items =  rawplayers[j].items;
						new_player.items = fix_item_slot_id(new_player.items);
					}
				}
			}
		}
		
		for(var i=0;i<mod_players.length; i++)
		{
			var curr = mod_players[i].player_data;
			if(mod_players[i].mod_update_me)
			{  
				var curr = mod_players[i].player_data;
				curr.avatar_id = mod_players[i].skin_id;
				curr.character.charid = skin_id_to_char_id(mod_players[i].skin_id);
				curr.character.is_upgraded = 1;
				curr.character.level = 5;
				curr.title = mod_players[i].title_id;
				curr.views = mod_players[i].items;
				var a_frame = find_an_item_type(mod_players[i].items, "Frame");
				if(a_frame!==0)curr.avatar_frame = parseInt(a_frame.item_id);
			}
			curr.nickname = get_the_current_char_name(mod_players[i]);	
		}
		get_players_ready = true;
		}catch(err){c_error(err);}
	}
			
	// perform functions with setup for json calls
	function preform_game_getplayers(mj_players)
	{
		get_players_ready = false;
		do_game_get_players(mj_players);
	}	
	
	function preform_lobby_getplayers()
	{
		do_lobby_get_players();
	}
	
	function preform_game_setplayer_current(game_id)
	{
		var a_player = {};
		get_player_from_current(a_player);
		a_player.room_id = game_id; 
		do_game_set_player(a_player);
	}	
	
	function preform_lobby_setplayer_current()
	{
		var a_player = {};
		get_player_from_current(a_player);
		a_player.room_id = 0;
		do_lobby_set_player(a_player);
	}
	
	// event handling functions
	function handle_start_button_pressed(e)
	{
		var game_id = e.game_uuid;
		the_game_uuid = game_id;
		preform_game_setplayer_current(game_id);
	}
	
	function handle_player_update_change(e)
	{
		var do_setplayer = false, do_getplayers = true;
		if(e?.update_list && Array.isArray(e.update_list) && e.update_list.length!=0)
		{
			if(e.update_list[0].account_id == GameMgr.Inst.account_id)do_setplayer = true;
		}				
		if(do_setplayer && check_unlock_all())preform_lobby_setplayer_current();
		if(do_getplayers)preform_lobby_getplayers();				
	}
	
	function handle_player_ready_change(e)
	{
		var do_getplayers = false, do_setplayer = false, owner_closet_change = false;
		if(e?.ready && e.ready==true)do_getplayers = true;
		if(e?.account_list && e?.account_id)
		{
			var mp = get_mod_player_by_realid(e.account_id);
			if(mp!==false && mp.is_owner==true)
			{
				do_getplayers = true;
				owner_closet_change = true;
			}
			if(mp!==false && mp.is_me)
			{
				if(mp.skin_id != uiscript.UI_Sushe.main_chara_info.skin)do_setplayer = true;
			}
		}	
		if(do_setplayer && check_unlock_all())preform_lobby_setplayer_current();
		if(do_getplayers)
		{
			if(!owner_closet_change)preform_lobby_getplayers();
			else setTimeout(preform_lobby_getplayers, 500); 
		}
	}
	
	function handle_display_char_change()
	{
		toggle_display_char_name();
		var uiscene = 0;
		if (check_scene(uiscene=uiscript.UI_WaitingRoom))
		{
			preform_lobby_getplayers();
		}
		if (check_scene(uiscene=uiscript.UI_DesktopInfo))
		{
			var lp = view.DesktopMgr.Inst.players;
			for(var i=0;i<lp.length;i++)
			{
				var player_data = view.DesktopMgr.Inst.player_datas[lp[i].seat];
				if(!player_data?.account_id)continue;
				var mp = get_mod_player_from_real_accid(player_data.account_id);
				if(mp!==false)
				{
					mp.player_data.nickname = get_the_current_char_name(mp);
					uiscript.UI_DesktopInfo.Inst.refreshSeat();
				}
			}
		}
		if(check_scene(uiscene=uiscript.UI_OtherPlayerInfo))
		{	
			var mp = get_mod_player_by_realid(uiscene.Inst.account_id);
			if(mp !== false)uiscene.Inst.name._childs[0]._tf.changeText(get_the_current_char_name(mp));
		}
	}

	// general/misc tool functions to check thing and convert types
	function check_unlock_all()
	{
		if(uiscript.UI_Sushe.characters.length >40)return true;
		else return false;
	}
		
	function skin_id_to_char_id(an_id)
	{
		var work = an_id -400000;
		work = work - (work % 100);
		work = work / 100;
		work = work + 200000;
		return work;
	}
	
	function get_local_first_name_from_skin_id(a_skin_id)
	{
		var a_char_id = skin_id_to_char_id(a_skin_id);
		var a_char_def = cfg.item_definition.character.find(a_char_id);
		var a_char_name = a_char_def.name_en;
		if(a_char_name.includes(" "))a_char_name = a_char_name.split(" ")[0];
		if(a_char_name == "" || a_char_name == null)a_char_name = "Freed Jyanshi";
		return a_char_name;
	}
	
	function get_mod_player_by_realid(target_id)
	{
		for(var i = 0;i<mod_players.length;i++)
		{
			if(mod_players[i].account_id == target_id)return mod_players[i];
		}
		return false;
	}
	
	function toaccid(owner_id)
	{
		var ident = mod_identifier + owner_id;
		ident = Math.abs(ident.hashCode());
		return ident;
	}
		
	function get_player_from_current(p)
	{
		p.skin_id = uiscript.UI_Sushe.main_chara_info.skin;
		var ident = toaccid(GameMgr.Inst.account_id);
		p.account_id = ident;
		p.title_id = GameMgr.Inst.account_data.title;
		if(p.title_id == 0)p.title_id = "600001";
		p.items = uiscript.UI_Sushe.commonViewList[0]
	}
	
	function check_room_type_allowed(mj_config)
	{
		// Note: Room ID functions do not work well especially in spec
		var room_type = get_room_type(mj_config);
		switch(room_type)
		{
			case "Friendly":
			//case "Tournament":
			return true;			
			default:
			return false;
		}	
	}
	
	function get_room_type(mj_config)
	{
		// Note: Room ID functions do not work well especially in spec
		var mode_string = game.Tools.get_room_desc(mj_config).text;
		c_event(mode_string);
		var final_type = false;
		var mode_string_array = mode_string.split(" ");
		var room_type = mode_string_array[0];
		if(room_type==="Friendly")final_type = "Friendly";
		else if(room_type==="Tournament")final_type = "Tournament";
		else if(room_type==="Bronze")final_type = "Ranked";
		else if(room_type==="Silver")final_type = "Ranked";
		else if(room_type==="Gold")final_type = "Ranked";
		else if(room_type==="Jade")final_type = "Ranked";
		else if(room_type==="Throne")final_type = "Ranked";
		else final_type = false;
		return final_type;
	}
	
	function get_mod_player_from_real_accid(acc_id)
	{	
		for(var i=0;i<mod_players.length;i++)
		{
			if(mod_players[i].account_id == acc_id)return mod_players[i];
		}
		return false;
	}
	
	function toggle_display_char_name()
	{
		settings.character_display_name++;
		if(settings.character_display_name>3)settings.character_display_name=1;
		save_name_settings();
	}
	
	function get_the_current_char_name(mp)
	{
		if(settings.character_display_name==1)return mp.real_name; 
		if(settings.character_display_name==2)return mp.anon_name; 
		if(settings.character_display_name==3)return mp.char_name;
		return "Freed Jyanshi";
	}
	
	function get_an_item_type(the_id)
	{
		var item_id = the_id;
		if(typeof item_id === 'string')item_id = parseInt(item_id);
		if(!Number.isInteger(item_id))return "Unknown"; 
		if(item_id>=305500 && item_id<= 305550)return "Frame";
		return "Unknown";
	}
	
	function find_an_item_type(items, desire)
	{
		if(!Array.isArray(items))return 0;
		if(!typeof desire === 'string')return 0;
		for(var i=0;i<items.length;i++)
		{
			var curr_type = get_an_item_type(items[i].item_id);
			if(curr_type == desire)return items[i];
		}
		return 0;		
	}
	
	function fix_item_slot_id(items)
	{
		for(var i=0; i<items.length; i++)
		{
			var temp_slot = parseInt(items[i].slot_id);
			items[i] = {slot: temp_slot, item_id: items[i].item_id};
		}
		return items;
	}
	
	function check_scene(scene){return scene && ((scene.Inst && scene.Inst._enable) || (scene._Inst && scene._Inst._enable));}
	function quick_sleep(ms){return new Promise(resolve => setTimeout(resolve, ms));}
	var mod_url = "https://majsoul.riichinyaa.com/comfy";
	var mod_identifier = "cutefunnyfriends";
	
	// logging functions
	function c_error(msg){if(logging_error==true)console.log(msg);}
	function c_json(msg){if(logging_json==true)console.log(msg);}
	function c_event(msg){if(logging_events==true)console.log(msg);}
	function c_all(msg){console.log(msg);}

	// validation functions
	function validate_rawplayers(raw)
	{
		return true;
		if(!Array.isArray(raw))return "Bad Data";
		for(var i=0;i<raw.length;i++)
		{
			if(!raw[i]?.account_hash)return "No Account Hash";
			if(!raw[i]?.skin_id)return "No Skin Id";
			if(!raw[i]?.title_id)return "No Title Id";		
			raw[i].account_hash = parseInt(raw[i].account_hash);
			raw[i].skin_id = parseInt(raw[i].skin_id);
			raw[i].title_id = parseInt(raw[i].title_id);
			if(isNaN(raw[i].account_hash))return "Bad Account Hash";
			if(isNaN(raw[i].skin_id))return "Bad Skin Id";
			if(isNaN(raw[i].title_id))return "Bad Title Id";
			
			if(cfg.item_definition.skin.get(raw[i].skin_id)=== undefined)return "Not Real Skin Id";
			if(cfg.item_definition.title.get(raw[i].title_id)=== undefined)return "Not a Real Title";
			
			if(!raw[i]?.items)return "No Items";
			if(!Array.isArray(raw[i].items))return "Bad Items";
			var items = raw[i].items;
			for(var j=0;j<items.length;j++)
			{
				if(!items[j]?.slot_id)return "No Slot Id";
				if(!items[j]?.item_id)return "No Item Id";
				items[j].slot_id = parseInt(items[j].slot_id);
				items[j].item_id = parseInt(items[j].item_id);
				if(isNaN(items[j].slot_id))return "Bad Slot Id";
				if(isNaN(items[j].item_id))return "Bad Item Id";
			}
		}	
		return true;
	}
	
	// cookie functions
	function save_name_settings()
	{
        var d = new Date();
        d.setTime(d.getTime() + (360 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = "comfy_friendly_mod=" + encodeURIComponent(JSON.stringify(settings)) + "; " + expires;
    }

	function load_name_settings()
	{
		var temp = {};
		let ca = document.cookie.split(";");
		for (let items of ca)
		{
			items = items.trim();
			if (items.indexOf('comfy_friendly_mod=') == 0)
			{
				temp = JSON.parse(decodeURIComponent(items.substring("comfy_friendly_mod=".length, items.length)));
				break;
			}
		}
		for (var key in temp) {settings[key] = temp[key];}
		save_name_settings();
	}

		
	// overriding function
	// NOTE: Since this uses and overrides chunks of actual majsoul code could be more likely to cause errors on new client versions
	//       check here first if things start to break.
	var override_complete = false;
	function replace_existing_functions()
	{
		uiscript.UI_OtherPlayerInfo.Inst.refreshBaseInfo =  function () {
                        var e = this;
                        this.title.id = 0,
                            this.illust.me.visible = !1,
                            game.Tools.SetNickname(this.name, {
                                account_id: 0,
                                nickname: "",
                                verified: 0
                            }),
                            this.btn_addfriend.visible = !1,
                            this.btn_report.x = 343,
                            app.NetAgent.sendReq2Lobby("Lobby", "fetchAccountInfo", {
                                account_id: this.account_id
                            }, function (i, n) {
                                if (i || n.error)
                                    t.UIMgr.Inst.showNetReqError("fetchAccountInfo", i, n);
                                else {
                                    var a = n.account;
                                    //unlock everybody edit
                                    if (a.account_id == GameMgr.Inst.account_id) {
                                        a.avatar_id = uiscript.UI_Sushe.main_chara_info.skin,
                                            a.title = GameMgr.Inst.account_data.title;
                                    }
                                    //end
									// comfy mod edit (smoothly shows correct character on profile view)
									var mp = get_mod_player_by_realid(a.account_id);
									if(mp !== false)
									{
										a.avatar_id = mp.skin_id;
										a.title = mp.title_id;
										a.nickname = get_the_current_char_name(mp);
									}
									// end
									
                                    e.player_data = a,
                                        game.Tools.SetNickname(e.name, a),
                                        e.title.id = game.Tools.titleLocalization(a.account_id, a.title),
                                        e.level.id = a.level.id,
                                        e.level.id = e.player_data[1 == e.tab_index ? "level" : "level3"].id,
                                        e.level.exp = e.player_data[1 == e.tab_index ? "level" : "level3"].score,
                                        e.illust.me.visible = !0,
                                        e.illust.setSkin(a.avatar_id, "waitingroom"),
                                        game.Tools.is_same_zone(GameMgr.Inst.account_id, e.account_id) && e.account_id != GameMgr.Inst.account_id && null == game.FriendMgr.find(e.account_id) ? (e.btn_addfriend.visible = !0, e.btn_report.x = 520) : (e.btn_addfriend.visible = !1, e.btn_report.x = 343),
                                        e.note.sign.setSign(a.signature)
                                }
                            })
                    }
	
	String.prototype.hashCode = function()
	{var hash = 0, i, chr;if (this.length === 0) return hash;for (i = 0; i < this.length; i++){chr=this.charCodeAt(i);hash=((hash<<5)-hash)+chr;hash|=0;}return hash;};
	
	uiscript.UI_WaitingRoom.Inst.onPlayerChange = function(t) {
            if (app.Log.log(t),
            !((t = t.toJSON()).seq && t.seq <= this.update_seq)) {
                this.update_seq = t.seq;
                (u = {}).type = "onPlayerChange0",
                u.players = this.players,
                u.msg = t,
                this.push_msg(JSON.stringify(u));
                h = this.robot_count;
                if ((c = t.robot_count) < this.robot_count) {
                    this.pre_choose && 2 == this.pre_choose.category && (this.pre_choose.category = 0,
                    this.pre_choose = null,
                    h--);
                    for (n = 0; n < this.players.length; n++)
                        2 == this.players[n].category && h > c && (this.players[n].category = 0,
                        h--)
                }
                for (var e = [], i = t.player_list, n = 0; n < this.players.length; n++)
                    if (1 == this.players[n].category) {
                        for (var a = -1, r = 0; r < i.length; r++)
                            if (i[r].account_id == this.players[n].account_id) {
                                a = r;
                                break
                            }
                        if (-1 != a) {
                            o = i[a];
							// comfy mod edit (prevents character flicker on update in lobby)
							var mp = get_mod_player_by_realid(o.account_id);
							if(mp !== false)
							{
								o.avatar_id = mp.skin_id;
								o.title = mp.title_id;
							}
							// end
                            e.push(this.players[n]),
                            this.players[n].avatar_id = o.avatar_id,
                            this.players[n].title = o.title,
                            this.players[n].verified = o.verified
                        }
                    } else
                        2 == this.players[n].category && e.push(this.players[n]);
                this.players = e;
                for (n = 0; n < i.length; n++) {
                    for (var s = !1, o = i[n], r = 0; r < this.players.length; r++)
                        if (1 == this.players[r].category && this.players[r].account_id == o.account_id) {
                            s = !0;
                            break
                        }
                    s || this.players.push({
                        account_id: o.account_id,
                        avatar_id: o.avatar_id,
                        nickname: o.nickname,
                        verified: o.verified,
                        title: o.title,
                        level: o.level,
                        level3: o.level3,
                        ready: !1,
                        dressing: !1,
                        cell_index: -1,
                        category: 1
                    })
                }
                for (var l = [!1, !1, !1, !1], n = 0; n < this.players.length; n++)
                    -1 != this.players[n].cell_index && (l[this.players[n].cell_index] = !0,
                    this._refreshPlayerInfo(this.players[n]));
                for (n = 0; n < this.players.length; n++)
                    if (1 == this.players[n].category && -1 == this.players[n].cell_index)
                        for (r = 0; r < this.max_player_count; r++)
                            if (!l[r]) {
                                this.players[n].cell_index = r,
                                l[r] = !0,
                                this._refreshPlayerInfo(this.players[n]);
                                break
                            }
                for (var h = this.robot_count, c = t.robot_count; h < c; ) {
                    for (var _ = -1, r = 0; r < this.max_player_count; r++)
                        if (!l[r]) {
                            _ = r;
                            break
                        }
                    if (-1 == _)
                        break;
                    l[_] = !0,
                    this.players.push({
                        category: 2,
                        cell_index: _,
                        account_id: 0,
                        level: {
                            id: 10101,
                            score: 0
                        },
                        level3: {
                            id: 20101,
                            score: 0
                        },
                        nickname: this.ai_name,
                        verified: 0,
                        ready: !0,
                        title: 0,
                        avatar_id: game.GameUtility.get_default_ai_skin(),
                        dressing: !1
                    }),
                    this._refreshPlayerInfo(this.players[this.players.length - 1]),
                    h++
                }
                for (n = 0; n < this.max_player_count; n++)
                    l[n] || this._clearCell(n);
                var u = {};
                if (u.type = "onPlayerChange1",
                u.players = this.players,
                this.push_msg(JSON.stringify(u)),
                t.owner_id) {
                    if (this.owner_id = t.owner_id,
                    this.enable)
                        if (this.owner_id == GameMgr.Inst.account_id)
                            this.refreshAsOwner();
                        else
                            for (r = 0; r < this.players.length; r++)
                                if (this.players[r] && this.players[r].account_id == this.owner_id) {
                                    this._refreshPlayerInfo(this.players[r]);
                                    break
                                }
                } else if (this.enable)
                    if (this.owner_id == GameMgr.Inst.account_id)
                        this.refreshAsOwner();
                    else
                        for (r = 0; r < this.players.length; r++)
                            if (this.players[r] && this.players[r].account_id == this.owner_id) {
                                this._refreshPlayerInfo(this.players[r]);
                                break
                            }
            }
        }
	
	}
	
})();