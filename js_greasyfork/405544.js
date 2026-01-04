// ==UserScript==
// @name         Instagram bot (GUI integrated) v10.2
// @namespace    http://tampermonkey.net/
// @version      10.2
// @description  welcome to the olimpus
// @author       ALONZO-CORP
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405544/Instagram%20bot%20%28GUI%20integrated%29%20v102.user.js
// @updateURL https://update.greasyfork.org/scripts/405544/Instagram%20bot%20%28GUI%20integrated%29%20v102.meta.js
// ==/UserScript==

//more easy to get elements from the DOM
g = (value) => document.getElementsByClassName(value);
$ = (value) => document.querySelector(value);

class GUI {
	constructor(){
		this.status = {
			menu:false,
			runing:false
		}
	}
	//this method call the another function in the class BOT to check the data
	process(){
		bot.set_up();
	}
	//this function print the values on console
	console(status){
		if(g('label_info')[0] && g('label_delay')[0] && g('mode')[0]){
			let label_info = g('label_info')[0];
			let label_delay = g("label_delay")[0];
			let mode = g('mode')[0];

			if(status == 'delay'){
				if(bot.time_in < bot.delay && bot.time_in != 0){
					label_delay.textContent = 'delay: '+bot.time_in+' / '+bot.delay;
				}else{
					label_delay.textContent = 'setting delay';
				}
			}
			if(status == 'loading'){
				if(label_info.textContent.split('.')[0] == 'loading'){
					label_info.textContent += '.';
					if(label_info.textContent == 'loading...') label_info.textContent = 'loading';
				}else{
					label_info.textContent = 'loading';
				}
			}
			if(status == 'following'){
				label_info.textContent = 'status: FOLLOWED; counter:[ '+bot.counter+' ];  name:[  '+bot.name()+'  ]';
				mode.value = 'wave: '+bot.storage_followed.rightNow.length+' / total: '+bot.storage_followed.total.length;
			}
			if(status == 'unfollowing'){
				label_info.textContent = 'status: UNFOLLOWED; counter:[ '+bot.counter+' ];  name:[  '+bot.name()+'  ]';
				mode.value = 'wave: '+bot.storage_unfollowed.rightNow.length+' / total: '+bot.storage_unfollowed.total.length;
			}
			if(status == 'no-action'){
				label_info.textContent = 'status: NO-ACTION; counter:[ '+bot.counter+' ];  name:[  '+bot.name()+'  ]';
			}
			if(status == 'no-connection'){
				label_info.textContent = "CONNECTION ISSUES";
			}
			if(status == 'chance'){
				label_info.textContent = 'status: CHANCE; counter:[ '+bot.counter+' ];  chance index:[  '+bot.chance+'  ]';
			}
			if(status == 'chance-done'){
				label_info.textContent = 'chance done [counter] restore to [0]';
			}
		}
	}
	//this method disabled the input [traffic_profile] when the mode was selected as [unfollow profile]
	disable(){
		let mode = g("mode")[0];
		let traffic_profile = g("traffic_profile")[0];
		let safe_users = g("safe_users")[0];
		
		if(mode.value == "unfollow profile"){
			traffic_profile.setAttribute("disabled", "");
			traffic_profile.value = 'own profile'
			safe_users.removeAttribute("disabled");
		}else{
			traffic_profile.removeAttribute("disabled");
			safe_users.setAttribute("disabled", "");
			traffic_profile.value = bot.traffic_name;
		}
	}
	//this method realize a bit operation to show how many people you will get through 1 hour
	calculate_actions(){
		let hour = 60;
		let delay = parseInt(g("delay_options")[0].value);
		let loop_interval = parseInt(g("interval_options")[0].value);
		let comment = g("comment_advanced")[0];
		let result = null;

		delay = delay / 60;

		if(loop_interval == 1000){
			loop_interval = 1;
		}else{
			loop_interval = 2;
		}

		result = (hour / delay) * loop_interval

		comment.textContent = 'you will get '+result+' actions ( profiles followeds or unfolloweds ) for each 1 hour';
	}
	//disable the inputs in the menu when the advanced option is open;
	switch_advanced_option(){
		if(g('bot_advancedOption')[0].style.display == "none"){
			g("mode")[0].setAttribute("disabled", "");
			g("traffic_profile")[0].setAttribute("disabled", "");
			g("safe_users")[0].setAttribute("disabled", "");
			g("btn_accept")[0].setAttribute("disabled", "");
			return g('bot_advancedOption')[0].style.display = '';
		}else{
			g("mode")[0].removeAttribute("disabled");
			if(g('mode')[0].value == 'follow profile') g("traffic_profile")[0].removeAttribute("disabled");
			g("safe_users")[0].removeAttribute("disabled");
			g("btn_accept")[0].removeAttribute("disabled");
			return g('bot_advancedOption')[0].style.display = 'none';
		}
	}
	advanced_option(){
		if(!g('bot_advancedOption')[0]){
			let elem = document.createElement("bot");
				elem.setAttribute("class", "bot_advancedOption");
			
			let htmlTag = document.getElementsByTagName("html")[0];
				htmlTag.insertAdjacentElement('afterbegin', elem);
		}
		g("bot_advancedOption")[0].innerHTML = '"<br/><span class="comment_delay">Delay / Timeout</span><select class="delay_options" onchange="gui.calculate_actions()"><option value="60">1 minute</option><option value="300" selected="selected">5 minute</option> <option value="600">10 minute</option><option value="900">15 minute</option><option value="1200">20 minute</option><option value="1800">30 minute</option></select><br><span class="comment_interval">Loop Interval</span><select class="interval_options" onchange="gui.calculate_actions()"><option value="1000">normal (1sg)</option><option value="500">fast (0.5sg)</option></select><br><span class="comment_advanced">you will get 12 actions ( profiles followeds or unfolloweds ) for each 1 hour</span><br><input type="button" onclick="gui.switch_advanced_option()" value="save setting" class="btn_accept_advanced" onclick="void(0)"><style>.bot_advancedOption{transition:transform 2s; z-index:2000; background: -webkit-linear-gradient( #c0392b, #8e44ad);border:1px solid rgba(0,0,0,0.1);box-shadow: 1px 1px 10px #000; width:55%; text-align:center;margin:auto;position:fixed;top:10; left:0;right:0;bottom:10; }.comment_delay, .comment_interval{color:#fff;font-size: medium;font-family: sans-serif;font-weight:bold;display:inline-block;width:25%;vertical-align: middle;}.comment_advanced{color:#fff;font-size: 10px;font-family: sans-serif;font-weight:bold;display:inline-block;width:100%;}.delay_options{font-weight: 900;padding:5px;text-align-last:center;width:40%;margin-bottom:2%;}.interval_options{font-weight: 900;padding:5px;text-align-last:center;width:40%;margin-bottom:2%;}.btn_accept_advanced{font-weight:900;padding:8px;margin-top:10px;margin-bottom:10px;text-align-last:center;width:30%;}</style>"';
		g("bot_advancedOption")[0].style.marginTop = "140px";
		g("bot_advancedOption")[0].style.display = "none";
		
		if(bot.delay == 60)   g("delay_options")[0].children[0].setAttribute("selected", "selected");
		if(bot.delay == 300)  g("delay_options")[0].children[1].setAttribute("selected", "selected");
		if(bot.delay == 600)  g("delay_options")[0].children[2].setAttribute("selected", "selected");
		if(bot.delay == 900)  g("delay_options")[0].children[3].setAttribute("selected", "selected");
		if(bot.delay == 1200) g("delay_options")[0].children[4].setAttribute("selected", "selected");
		if(bot.delay == 1800) g("delay_options")[0].children[5].setAttribute("selected", "selected");

		if(bot.loop_interval == 1000) g("interval_options")[0].children[0].setAttribute("selected", "selected");
		if(bot.loop_interval == 500)  g("interval_options")[0].children[1].setAttribute("selected", "selected");
		
	}
	//this method create the graphic interface menu
	implement(){
		if(!g('main_screen')[0]){
			let elem = document.createElement("bot");
				elem.setAttribute("class", "main_screen");
			
			let htmlTag = document.getElementsByTagName("html")[0];
				htmlTag.insertAdjacentElement('afterbegin', elem);
		}
		if(bot.permission == false){
			if(g('main_screen')[0] && this.status.menu == false){
				g("main_screen")[0].innerHTML='<img class="config" src="https://img.icons8.com/cotton/2x/settings.png" onclick="gui.switch_advanced_option()"><br/><img src="https://media.giphy.com/media/SwyH7oWi2vhkOjCwiJ/giphy.gif" class="logo_img"><br> <span class="label_mode">what we are going to</span><br><select onchange="gui.disable()" class="mode"><option value="follow profile">follow profiles </option><option value="unfollow profile">unfollow profiles</option></select><br><span class="label_traffic">from which profile</span><br><input type="text" placeholder="@username"class="traffic_profile" value='+bot.traffic_name+'><br> <span class="label_safe_profiles">these profiles wont be remove from your following section. add them separate by ( , )</span><br><input type="text" placeholder="secure profiles" class="safe_users" disabled><br><input type="button" value="save" class="btn_accept" onclick="gui.process()"><style> .main_screen{ transition:transform 2s; z-index:1000; margin-top:10px; background: -webkit-linear-gradient( #c0392b, #8e44ad);border:1px solid rgba(0,0,0,0.1);box-shadow: 1px 1px 10px #000; width:50%; text-align:center;margin:auto;position:fixed;top:10; left:0;right:0;bottom:10; }.config{border-radius:4px;border:1px solid #fff;background:#fff; width:3%; float:left} .config:hover{cursor:pointer}        .logo_img{ width:30%; } .label_mode, .label_safe_profiles, .label_traffic{color:#fff; font-size: medium; font-family: sans-serif;font-weight:bold; display:inline-block; width:60%;}.mode{font-weight: 900;padding:10px; text-align-last:center; width:60%;margin-bottom:2%;} .traffic_profile{font-weight: 900; padding:8px; text-align-last:center; width:50%; margin-bottom:2%;}.safe_users{font-weight: 900; padding:15px; text-align-last:center;width:40%;} .btn_accept{font-weight: 900;padding:8px;margin-top:10px;margin-bottom:10px;text-align-last:center;width:30%; } </style>';
				g("main_screen")[0].style.marginTop = "10px";
				this.status.menu = true;
				this.status.runing = false;
				
				if(bot.mode == 'follow profile') g("mode")[0].children[0].setAttribute("selected", "selected");
				if(bot.mode == 'unfollow profile') g("mode")[0].children[1].setAttribute("selected", "selected");
				this.disable();
			}
		}
		if(bot.permission == true){
			if(g('main_screen')[0] && this.status.runing == false){
				if(bot.mode == 'follow profile'){
					g("main_screen")[0].innerHTML = '<img src="https://media.giphy.com/media/SwyH7oWi2vhkOjCwiJ/giphy.gif" class="logo_img"><br><span class="label_mode">following from @'+bot.traffic_name+'</span><br><input class="mode" disabled value="wave: '+bot.storage_followed.rightNow.length+' / total: '+bot.storage_followed.total.length+'"><br><span class="label_info">loading</span><br><span class="label_delay">setting delay</span><br><progress></progress><br/><input type="button" value="stop" class="btn_accept" onclick="gui.process()"><style>.main_screen{ transition:transform 2s; z-index:1000; margin-top:10px; background: -webkit-linear-gradient( #c0392b, #8e44ad);border:1px solid rgba(0,0,0,0.1);box-shadow: 1px 1px 10px #000; width:50%; text-align:center;margin:auto;position:fixed;top:10; left:0;right:0;bottom:10; } .logo_img{ width:30%; } .label_mode, .label_safe_profiles, .label_traffic{color:#fff; font-size: large; font-family: sans-serif;font-weight:bold; display:inline-block; width:60%;} .label_info, .label_delay{font-size:10px; color:#fff; font-family: sans-serif;font-weight:bold; display:inline-block; width:100%;} .mode{font-weight: 900;padding:10px; text-align-last:center; width:60%;margin-bottom:3%;} .traffic_profile{font-weight: 900; padding:8px; text-align-last:center; width:50%; margin-bottom:2%;}.safe_users{font-weight: 900; padding:15px; text-align-last:center;width:40%;} .btn_accept{font-weight: 900;padding:8px;margin-top:10px;margin-bottom:10px;text-align-last:center;width:30%; } </style>';
					g("main_screen")[0].style.marginTop = "10px";
					this.status.runing = true;
					this.status.menu = false;
				}
				if(bot.mode == 'unfollow profile'){
					g("main_screen")[0].innerHTML = '<img src="https://media.giphy.com/media/SwyH7oWi2vhkOjCwiJ/giphy.gif" class="logo_img"><br><span class="label_mode">unfollowing from your profile</span><br><input class="mode" disabled value="wave: '+bot.storage_unfollowed.rightNow.length+' / total: '+bot.storage_unfollowed.total.length+'"><br><span class="label_info">loading</span><br><span class="label_delay">setting delay</span><br><progress></progress><br/><input type="button" value="stop" class="btn_accept" onclick="gui.process()"><style>.main_screen{ transition:transform 2s; z-index:1000; margin-top:10px; background: -webkit-linear-gradient( #c0392b, #8e44ad);border:1px solid rgba(0,0,0,0.1);box-shadow: 1px 1px 10px #000; width:50%; text-align:center;margin:auto;position:fixed;top:10; left:0;right:0;bottom:10; } .logo_img{ width:30%; } .label_mode, .label_safe_profiles, .label_traffic{color:#fff; font-size: large; font-family: sans-serif;font-weight:bold; display:inline-block; width:60%;} .label_info, .label_delay{font-size:10px; color:#fff; font-family: sans-serif;font-weight:bold; display:inline-block; width:100%;} .mode{font-weight: 900;padding:10px; text-align-last:center; width:60%;margin-bottom:3%;} .traffic_profile{font-weight: 900; padding:8px; text-align-last:center; width:50%; margin-bottom:2%;}.safe_users{font-weight: 900; padding:15px; text-align-last:center;width:40%;} .btn_accept{font-weight: 900;padding:8px;margin-top:10px;margin-bottom:10px;text-align-last:center;width:30%; } </style>';
					g("main_screen")[0].style.marginTop = "10px";
					this.status.runing = true;
					this.status.menu = false;
				}
				
			}
		}
	}
}

gui = new GUI();

class Bot{
	constructor(){
		this.date = new Date();
		this.loop_interval = null;
		this.mode = null; // 'follow people' || 'unfollow people'
		this.permission = false; //the value will be true when the user click 'save' and the formulary is complete;
		this.safe_users = ['victorj_alonzo']; //these usernames will be always in your ig account
		this.traffic_name =  ""; //the bot will get followers from this account
		this.storage_followed   = {rightNow:[], total:[] }   //local database from the all bots followeds   by this bot  
		this.storage_unfollowed = {rightNow:[], total:[] }   //local database from the all bots unfolloweds by this bot  
		this.scroll = 0;			  // value from the scroll (using to scroll down a pop-up dialog)
		this.counter = 0;			  // value from the counter (using to iterate a list)
		this.time_in = 0;			  // current value to reactivate the [available] propertie
		//***************************************************************************************/
		//60 = 1min | 120 = 2min | 180 = 3min | 240 = 4min | 300 = 5min | 600 = 10min
		//if use 2.5min(150sg) as delay you will get 18 actions (followed or unfolloweds) for each 1 hour (162actions 9hour working)
		//if use 5min(300sg)  as delay you  will get 12 actions (followed or unfolloweds) for each 1 hour (108actions 9hour working)
		//if use 10min(600sg) as delay you will get 06 actions (followed or unfolloweds) for each 1 hour (54actions 9hour working)
	    this.delay = null // time limit to reactivate the [available] propertie
		//***************************************************************************************/
		this.available = true     // propertie to decide if the bot can continue [following] or [unfollowing] bots
		this.chance = 0			 // value to wait the load from the [list] correctly
		this.list = null		// array with the bots
		this.tryRedirect = 0; //if the redirection wasn't executed this value will crease until call the function redirected again
	}
	//this method return [true] if the array exist
	ready(){
		if(g("wo9IH").length > 0){
			this.list = g("wo9IH");
			return true;
		}
		this.print("no-list");
		gui.console('loading');
		this.scroll_down(10)
		return false;
	}
	//return the own profile in a 'string'
	profile(){
		try{
			if(g("ctQZg")[0]) return g("ctQZg")[0].children[0].children[4].children[1].href.split('/')[3];
		}catch(e){
			let popup_profile = g('_01UL2')[0];
			let username;
	
			if(!popup_profile){
				let elem = g("qNELH");
	
				for(let i in elem){
					if(elem[i].getAttribute('role') == 'link'){
						elem = elem[i];
						break;
					}
				}
				elem.click();
			}else{
				username = popup_profile.children[0].href.split('/')[3];
			}
			return username;
		}
	}
	//this method will return a specific botname: 'string'
	name(){
		if(this.ready()){
			return this.list[this.counter].children[0].children[0].children[1].children[0].children[0].innerText;
		}
	}
	//this method will return the specific button element
	button(){
		if(this.ready()) return this.list[this.counter].children[0].children[1].children[0];
	}
	count(section){
		if(section == 'followers'){
			if(g('g47SY')[1]){
				return parseInt(g('g47SY')[1].innerText);
			}
		}
		if(section == 'following'){
			if(g('g47SY')[2]){
				return parseInt(g('g47SY')[2].innerText);
			}
		}
		return null; 
	}
	//this method will return the [follower] section on the page
	section(){
		let current_section;

		if(this.mode == 'follow profile'){
			if(g(" _3dEHb")[0]) current_section = g(" _3dEHb")[0].children[1].children[0];
			if(g("k9GMp")[0])   current_section = g("k9GMp")[0].children[1].children[0]; //work in full responsive
		}
		if(this.mode == 'unfollow profile'){
			if(g(" _3dEHb")[0]) current_section = g(" _3dEHb")[0].children[2].children[0];
			if(g("k9GMp")[0])   current_section = g("k9GMp")[0].children[2].children[0]; //work in full responsive
		}

		return current_section
	}
	//this method return the [pop up dialog] on the page
	pop_up_dialog(){

		//popup-dialog follower and following
		if(g('isgrP')[0]) return g('isgrP')[0];

		let pop_up;

		if( $('[role=dialog]') ){
			let p = $('[role = dialog]');

			//popup-dialog followers
			if(p.children[0].children[1] && p.children[0].children[1].textContent.length > 20 ){
				p = p.children[0].children[1];
				pop_up = p;
			}
			//popup-dialog following
			if(p.children[0].children[2]){
				p = p.children[0].children[2];
				pop_up = p;
			}
		}
		return pop_up
	}
	//verify if it's expired
	is_expired(array, name){
		let present_day   = this.date.getDate();
		let present_month = this.date.getMonth()+1;
		let present_year  = this.date.getFullYear();

		let expire_day =   null;
		let expire_month = null;
		let expire_year =  null;

		for(let i=0; i <= array.length-1; i++){
			if(name == array[i].name){
				let user_date = array[i].date.split('.');

				expire_day    = parseInt(user_date[0]);
				expire_month  = parseInt(user_date[1]); 
				expire_year  = parseInt(user_date[2]);

				if(expire_year  <  present_year)    return true;
				if(expire_month <  present_month)   return true;
				if(expire_day   <= present_day-2)   return true;
			}
		}
		return false;
	}
	//save whole variables from the system on a object in the LocalStorage
	saveLocalData(){
		localStorage.setItem('IG bot data', JSON.stringify({
			'mode': this.mode,
			'permission': this.permission,
			'safe_users':this.safe_users,
			'traffic_name':this.traffic_name,
			'storage_followed':this.storage_followed.total,
			'storage_unfollowed':this.storage_unfollowed.total,
			'delay':this.delay,
			'loop_interval':this.loop_interval
		}))
	}
	//return the value saved on localStorage and assign them
	getLocalData(){
		if(localStorage.getItem('IG bot data') != null){
			let localData = JSON.parse(localStorage.getItem('IG bot data'));

			this.mode = localData.mode;
			this.permission = localData.permission;
			this.safe_users = localData.safe_users;
			this.traffic_name = localData.traffic_name;
			this.storage_followed.total = localData.storage_followed;
			this.storage_unfollowed.total = localData.storage_unfollowed;
			this.delay = localData.delay;
			this.loop_interval = localData.loop_interval;
		}
	}
	//this method verify if a object data-name is into a specific local storage already;
	matched(localDB, name){
		if(typeof name == 'string'){
			for(let i=0; i<=localDB.length-1; i++){
				if(name == localDB[i].name) return true;
			}
		}else{
			for(let i=0; i<=name.length-1; i++){
				for(let j=0; j<=localDB.length-1; j++){
					if(name[i] == localDB[j]) name[i] = null;
				}
				if(name[i] != null) localDB.push(name[i]);
			}
		}
		return null;
	}
	//for default the method verify if a data-name is into a [safe_users];
	matched_friend(localDB, name){
		if(typeof name == 'string'){
			for(let i=0; i<=localDB.length-1; i++){
				if(name == localDB[i]) return true;
			}
		}
		return null; 
	}

	//this method make a scroll into a pop-up dialog
	scroll_down(a){
		this.scroll += a;
		if(this.pop_up_dialog()){
			this.pop_up_dialog().scroll(10, this.scroll, 10);
		}
	}
	//this method increase the value [counter] from the [bot]
	increase(){
		this.counter++;
	}
	//this method show on console the status and another custom messages 
	print(status, custom){
		if(status == 'no-list'){
			console.log("list no found it, Specific the list");
		}
		if(status == 'status following'){
			console.log("%c status: "+'following'+" counter:["+this.counter+"] botname: ["+this.name()+"]","color:#fff; font-weight: bold; background: linear-gradient(to right, #11998e, #38ef7d); padding:10px")
		}
		if(status == 'status unfollowing'){
			console.log("%c status: "+'unfollowing'+" counter:["+this.counter+"] botname: ["+this.name()+"]","color:#fff; font-weight: bold; background: linear-gradient(to right, #11998e, #38ef7d); padding:10px")
		}
		if(status == 'no-action'){
			console.log("%c status: NO-ACTION  counter:["+this.counter+"] botname: ["+bot.name()+"]","color:fff; font-weight: bold; background: linear-gradient(to right, #3c3b3f, #605c3c); padding:10px")
		}
		if(status == 'chance'){
			console.log("%c status: CHANCE counter:["+this.counter+"] chance: ["+this.chance+"]","color:fff; font-weight: bold; background: linear-gradient(to right, #159957, #155799); padding:10px")
		}
		if(status == '0'){
			console.log("return index 0")
		}
		if(status == 1) console.log(custom)
	}
	//this method open the pop up if this's not opened previously
	manage_pop_up(action){
		if(bot.permission){
			if(!action){
				//-------------------------------------------> open section pop-up [ follow or unfollow section ]
				if(this.pop_up_dialog() == null){
					if(this.section()) this.section().click();
				}
			}else{
				//-------------------------------------------> confirm pop-up after click on unfollow button
				if(g("piCib")[0]){
					if(g("piCib")[0].innerText.substr(0,12) == "Action Block"){
						g("piCib")[0].children[1].children[1].click();
						alert('INSTAGRAM HAS BLOCKED YOUR ACTIONS \n you cant follow or unfollow more profiles for a while');
						this.permission = false;
						this.set_up();
						
					}else{
						g("piCib")[0].children[2].children[0].click();
					}
				}
			}
		}
	}
	//this method redirect to the correct profile to realize the specific operation
	//if the bot is going to [follow] this method will redirect to the traffic profiles
	//if the bot is going to [unfollow] this method will redirect to own profile
	//REQUIRE A PERSISTENT DATA
	redirect(){
		let url;

		if(this.mode == 'follow profile'){
			url = 'https://www.instagram.com/'+this.traffic_name+'/'

			if(window.location.href.split("/")[3] != this.traffic_name && this.tryRedirect == 0){
				this.tryRedirect += 1;
				console.log('trying to redirect again: '+this.tryRedirect)
				window.location = url;
			}
			if(window.location.href.split("/")[3] == this.traffic_name){
				this.tryRedirect = 0;
				return true;
				
			}
		}
		if(this.mode == 'unfollow profile'){
			if(this.profile()){
				url = 'https://www.instagram.com/'+this.profile()+'/';
			
				if(window.location.href.split('/')[3] != this.profile() && this.tryRedirect == 0){
					this.tryRedirect += 1;
					console.log('trying to redirect again: '+this.tryRedirect)
					window.location = url;
				}
				if(window.location.href.split('/')[3] == this.profile()){
					this.tryRedirect = 0;
					return true;
				}
			}
		}
		if(this.tryRedirect > 10) this.tryRedirect == 0;
	}
	//this method is called when the a element in the [list] is not found it
	give_chance(){
		if(this.chance <= 20){
			this.counter++;
			this.chance++;
			this.scroll_down(15);
			this.print('chance')
			gui.console('chance');
		}else{
			this.counter = 0;
			this.chance = 0;
			this.print("0")
			gui.console('chance-done')
		}
	}
	//this method reactive the 'available' propertie after a delay to continue with the operation
	reactive_delay(){
		if(bot.permission){
			if(this.available == false){
				this.time_in += 1
				this.print(1, this.time_in +'/'+ this.delay)
			}
			if(this.time_in >= this.delay){
				this.available = true
				this.time_in = 0
				this.print(1, 'REACTIVE!')
			}
			gui.console('delay');
		}
	}
	//this method verify if the fields was filled correctly
	//mode - obligatory
	//traffic_profile - obligatory
	//safe_users - optional
	check_form(event){
		let btn  = g("btn_accept")[0];
		let mode = null; 
		let traffic_profile = null;
		let safe_users = null;
		let delay = null;
		let loop_interval = null; 

		if(btn.value == 'save'){
			if(g("mode")[0].value != "" &&  g("mode")[0].value != null){
				mode = g("mode")[0].value;
			}
			if(g("traffic_profile")[0].value != "" && g("traffic_profile")[0].value != null ){
				traffic_profile = g("traffic_profile")[0].value;
	
				if(traffic_profile.split(" ").length == 1 || traffic_profile == 'own profile'){
					traffic_profile = g("traffic_profile")[0].value.toLowerCase();
				}else{
					alert("the profile name can't content spaces, try it again");
					traffic_profile = null;
				}
			}
			if(g("safe_users")[0].value){
				let string = g("safe_users")[0].value;
				let result = "";
	
				for(let i in string){
					if(string[i] != " ") result += string[i];
				}
				safe_users = result.split(',');
			}else{
				safe_users = [];
			}
			if(g("delay_options")[0].value != "" &&  g("delay_options")[0].value != null){
				delay = parseInt(g("delay_options")[0].value);
			}
			if(g("interval_options")[0].value != "" &&  g("interval_options")[0].value != null){
				loop_interval = parseInt(g("interval_options")[0].value);
			}
			if(traffic_profile) return {
				"mode":mode,
				"traffic_profile": traffic_profile,
				"safe_users": safe_users,
				"delay":delay,
				"loop_interval":loop_interval
			}
		}else{
			return null;
		}
	}
	//this method choose the mode as the bot is going to run
	set_up(){
		let data = this.check_form();

		if(data){
			if(data.traffic_profile != 'own profile') this.traffic_name = data.traffic_profile;
			this.mode = data.mode;
			this.matched(this.safe_users, data.safe_users);
			this.delay = data.delay;
			this.loop_interval = data.loop_interval;
			this.permission = true;
			
			this.saveLocalData();
		}
		if(data === null){
			this.permission = false;
			this.saveLocalData();
		}
		main();
	}
	//the method specific the task for the bot (follow or unfollow people)
	going_to(){
		if(this.ready()){
			let btn = this.button();

			if(window.navigator.onLine){
				//FOLLOW PEOPLE
				//-------------------------------------------------------------------------
				if(this.mode == 'follow profile'){
					if(btn.innerText == 'Follow' || btn.innerText == 'Seguir'){
						if(this.matched(this.storage_followed.total, this.name()) == null){
							btn.click()
							this.available = false;
							this.chance = 0;
							//-----------------------------------------------------------------------------------------------
							this.storage_followed.rightNow.push({
								'name': this.name(),
								'date': this.date.getDate()+"."+parseInt(this.date.getMonth()+1)+"."+this.date.getFullYear()
							});
							this.storage_followed.total.push({
								'name': this.name(),
								'date': this.date.getDate()+"."+parseInt(this.date.getMonth()+1)+"."+this.date.getFullYear()				
							});
							//-----------------------------------------------------------------------------------------------
							this.saveLocalData();
							this.print('status following');
							gui.console('following')
						}else{
							gui.console('no-action');
							this.print('no-action');
						}
					}
				}
				//UNFOLLOW PEOPLE
				//-------------------------------------------------------------------
				if(this.mode == 'unfollow profile'){
					if(btn.innerText == 'Following' || btn.innerText == 'Siguiendo'){
						if(this.matched_friend(this.safe_users,this.name()) == null){
							btn.click();
							this.available = false;
							this.chance = 0;
							this.storage_unfollowed.rightNow.push(this.name());
							this.storage_unfollowed.total.push(this.name());
							this.saveLocalData();
							this.print('status unfollowing');
							gui.console('unfollowing');
						}else{
							gui.console('no-action');
							this.print('no-action');
						}
					}
				}
				//-----------------------------------------------------------------
				this.scroll_down(30);
				this.increase();
			}else{
				gui.console('no-connection');
			}
		}
	}
}

bot = new Bot();

//MAIN FUNCTION// 
var main = () =>{
	//importing the local Storage
	bot.getLocalData();
	gui.implement();
	gui.advanced_option();

	if(bot.permission){
		loop = setInterval(()=>{
			try{
				if(bot.available && bot.permission){
					if(bot.redirect()){
						bot.manage_pop_up();
						bot.going_to();
					}
				}
			}catch(e){
				bot.give_chance();
				console.log(e);
			}
			bot.manage_pop_up('confirm_unfollow_request');
			bot.reactive_delay();
			if(bot.permission == false){
				bot.available = true;
				bot.time_in = 0;
				clearInterval(loop);
			} 
		}, bot.loop_interval)
	}
}
main();