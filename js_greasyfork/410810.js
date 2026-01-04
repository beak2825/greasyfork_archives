// ==UserScript==
// @name         Steam Account Switcher
// @version      0.3
// @description  Switch multiple account on Steam and community
// @author       lzt
// @match        *://store.steampowered.com/*
// @match        *://*.steamcommunity.com/*
// @grant 		 GM_setValue
// @grant 		 GM_getValue
// @grant 		 GM_listValues
// @grant 		 GM_deleteValue
// @grant 		 GM_cookie
// @grant		 unsafeWindow
// @grant		 window
// @namespace steam_account_switcher
// @downloadURL https://update.greasyfork.org/scripts/410810/Steam%20Account%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/410810/Steam%20Account%20Switcher.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Your code here...
    let account = document.evaluate("//a[contains(@href, 'javascript:Logout()')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if(account.snapshotLength != 1) {
    	console.log("account error");
    	unsafeWindow.account = null;
    }else{
    	unsafeWindow.account = account.snapshotItem(0).children[0].innerText;
	};
	init();

    let top = document.getElementById("global_action_menu");
    let total = document.createElement("div");
    let enter = document.createElement("span");
    let menu = document.createElement("div");;

    total.id = "switcher_total";
    total.style.display = "inline-block";
    enter.id = "switcher_pulldown";
    enter.className = "pulldown global_action_link";
    enter.innerText = "切换账号";
    enter.addEventListener("click", function(e){e.stopPropagation();reloadmenu()});
    total.appendChild(enter);
    top.insertBefore(total, top.firstElementChild);

	document.addEventListener("click", function(e){
		if (!menu.contains(e.target)) menu.style.display = "none";
	});

	function init() {
		//add label
		if (!GM_getValue("community")) {
			GM_setValue("community", "{}");
		}
		if (!GM_getValue("store")) {
			GM_setValue("store", "{}");
		}
		//upgrade old data from v0.2 to v0.3
		let list = GM_listValues();
		let data = JSON.parse(GM_getValue("store"));
		for (let i = 0; i < list.length; i++) {
			if (list[i] != "community" && list[i] != "store") {
				data[list[i]] = JSON.parse(GM_getValue(list[i]));
				console.log("add ", list[i], " from old data of v0.2");
				GM_deleteValue(list[i]);
            }
		}
		GM_setValue("store", JSON.stringify(data));
    }

    function fillmenu() {
    	
    	menu = menu ? document.createElement("div") : menu;
    	menu.className = "popup_block_new account_switcher";
		menu.id = "sw_popup";
		menu.style.visibility = "visible";
		menu.style.display = "block";
		menu.style.top = enter.getBoundingClientRect().bottom;
		menu.style.left = enter.getBoundingClientRect().left;

		let list, loginURL;
		if (window.location.href.search("steamcommunity.com") > -1) {
			list = JSON.parse(GM_getValue("community"));
			loginURL = "https://steamcommunity.com/login/";
		} else if (window.location.href.search("steampowered.com") > -1) {
			list = JSON.parse(GM_getValue("store"));
			loginURL = "https://store.steampowered.com/login/";
		}

    	var context = document.createElement("div");
    	context.className = "popup_body popup_menu account_switcher";
		if (unsafeWindow.account != null & list[unsafeWindow.account] === undefined) {
			let add = document.createElement("a");
			add.className = "popup_menu_item account_switcher";
			add.innerText = "添加 " + unsafeWindow.account;
			add.setAttribute("href", "#");
			add.addEventListener("click", function(e){e.stopPropagation();addaccount()});
			context.appendChild(add);
		};

		for (let id in list) {
			let entity = document.createElement("div");
			entity.className = "popup_menu_item account_switcher";

			let sw = document.createElement("a");
			sw.setAttribute("href", "#");
			sw.style.margin = "0px 10px 0px 0px"
			if (unsafeWindow.account == id) {
				sw.innerText = "更新 " + id;
				sw.addEventListener("click", function (e) { e.stopPropagation(); addaccount(); });
			} else {
				sw.innerText = "转到 " + id;
				sw.addEventListener("click", function (e) { e.stopPropagation(); swaccount(id) });
			};

			let del = document.createElement("a");
			del.innerText = "删除";
			del.setAttribute("href", "#");
			del.addEventListener("click", function (e) { e.stopPropagation(); delaccount(id) });

			entity.appendChild(sw);
			entity.appendChild(del);
			context.appendChild(entity);
        }

		let login = document.createElement("a");
		login.className = "popup_menu_item account_switcher";
		login.innerText = "添加新账号";
		login.setAttribute("href", "#");
		login.addEventListener("click", function(e){
			e.stopPropagation();
			let lock = 0;
			GM_cookie("list", { path: "/" }, function(cookies) {
				if (cookies) {
					for(let i = 0; i < cookies.length; i++){
		    			GM_cookie("delete", {name: cookies[i]["name"]}, function(error) {
		    				console.log(error || "del " + cookies[i]["name"]);
		    				lock++;
							if (lock >= cookies.length) window.location.href = loginURL;
		    			});
		    		}
				} else {
					window.location.href = loginURL;
				}
			});
		});
		context.appendChild(login);
		menu.appendChild(context);
		total.appendChild(menu);
    };

    function reloadmenu() {
    	let l = document.getElementsByClassName("account_switcher")
    	for(let i = l.length - 1; i >= 0; i--){
    		l[i].remove()
    	}
    	fillmenu()
    };

    function addaccount() {
    	console.log("add " + unsafeWindow.account);
    	GM_cookie("list", { path: "/" }, function(cookies) {
    		let c = []
    		for(let i = 0; i < cookies.length; i++){
    			if (cookies[i]["name"] == "browserid") c.push(cookies[i]);
    			if (cookies[i]["name"] == "sessionid") c.push(cookies[i]);
    			if (cookies[i]["name"] == "steamLoginSecure") c.push(cookies[i]);
    			if (cookies[i]["name"] == "steamRememberLogin") c.push(cookies[i]);
    			if (cookies[i]["name"] == "bGameHighlightAutoplayDisabled") c.push(cookies[i]);
    			if (cookies[i]["name"] == "lastagecheckage") c.push(cookies[i]);
    			if (cookies[i]["name"] == "mature_content") c.push(cookies[i]);
    			if (cookies[i]["name"] == "wants_mature_content") c.push(cookies[i]);
    			if (cookies[i]["name"] == "birthtime") c.push(cookies[i]);
    			if (cookies[i]["name"].search("steamMachineAuth") != -1) c.push(cookies[i]);
			}
			let list;
			if (window.location.href.search("steamcommunity.com") > -1) {
				list = JSON.parse(GM_getValue("community"));
				list[unsafeWindow.account] = c;
				GM_setValue("community", JSON.stringify(list));
			} else if (window.location.href.search("steampowered.com") > -1) {
				list = JSON.parse(GM_getValue("store"));
				list[unsafeWindow.account] = c;
				GM_setValue("store", JSON.stringify(list));
			}
    		reloadmenu();
		});
    };

    function delaccount(id) {
		console.log("delete " + id);
		let list;
		if (window.location.href.search("steamcommunity.com") > -1) {
			list = JSON.parse(GM_getValue("community"));
			delete list[id];
			GM_setValue("community", JSON.stringify(list));
		} else if (window.location.href.search("steampowered.com") > -1) {
			list = JSON.parse(GM_getValue("store"));
			delete list[id];
			GM_setValue("store", JSON.stringify(list));
		}
    	reloadmenu()
    };

    function swaccount(id) {
    	console.log("switch to " + id);
		let cookies, list;
		if (window.location.href.search("steamcommunity.com") > -1) {
			list = JSON.parse(GM_getValue("community"));
			cookies = list[id];
		} else if (window.location.href.search("steampowered.com") > -1) {
			list = JSON.parse(GM_getValue("store"));
			cookies = list[id];
		}
    	let delock = 0;
		GM_cookie("list", { path: "/" }, function(c) {
			for(let i = 0; i < c.length; i++){
    			GM_cookie("delete", {name: c[i]["name"]}, function(error) {
    				console.log(error || "del " + c[i]["name"]);
    				delock++;
    				if (delock >= c.length) {
    					console.log("del complete")
    					let addlock = 0;
						for(let i = 0; i < cookies.length; i++){
							GM_cookie("set", {
								name: cookies[i]['name'], 
				    			value: cookies[i]['value'], 
				    			domain: cookies[i]['domain'], 
				    			path: cookies[i]['path'], 
				    			secure: cookies[i]['secure'], 
				    			httpOnly: cookies[i]['httpOnly'], 
				    			sameSite: cookies[i]['sameSite'], 
				    			expirationDate: cookies[i]['expirationDate'], 
				    			hostOnly: cookies[i]['hostOnly']
							}, function(error) {
								console.log(error || "add " + cookies[i]["name"]);
								addlock++;
								if (addlock >= cookies.length) {
									let url = window.location.href;
									if (url.search("store.steampowered.com/wishlist") != -1) {
										window.location.href = "https://store.steampowered.com/wishlist"
									}else{
										window.location.reload()
									}
								};
							});
						}
    				};
    			});
    		}
		});
    };
})();