// ==UserScript==
// @name         Essen auction one-page-list collection filter
// @namespace	 de.tobiaslunte.boardgames
// @description  Only useful to members of boardgamegeek.com that partake in the annual Essen Spiel auction. Adds functionality to peyo's one-page list to filter based on your collection. also replaces the default filter algorithms
// @version      1
// @author       Tobias Lunte
// @include      https://peyo61.neocities.org/BGG/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389772/Essen%20auction%20one-page-list%20collection%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/389772/Essen%20auction%20one-page-list%20collection%20filter.meta.js
// ==/UserScript==

(function() {
	window.addEventListener('load', onloaded, false);

	function onloaded() {
		//Re-assign buttons
		var header = document.getElementsByClassName("list_header")[1];
		var tagged_button = header.getElementsByClassName("taggedonly_button")[0];
			tagged_button.removeAttribute("onclick");
			tagged_button.onclick = function(){ setRule(rules["tag"], "tagged", true, tagged_button); };

		var types = ["boardgame", "expansion", "ended", "deleted"];
		for (let i = types.length - 1; i >= 0; i--) {
			let type_button = header.getElementsByClassName(types[i]+"_label")[0];
			type_button.removeAttribute("onclick");
			type_button.onclick = function(){ setRule(rules["type"], types[i], true, type_button); };
		}

		var lang_elems = header.getElementsByClassName("menu_content")[0].children;
		for (let i = lang_elems.length - 1; i >= 0; i--){
			let cur_lang = lang_elems[i].getAttribute("onclick");
			cur_lang = cur_lang.substring(16, cur_lang.length-2);
			lang_elems[i].removeAttribute("onclick");
			lang_elems[i].onclick = function(){ setRule(rules["lang"], cur_lang, true, lang_elems[i]); };
		}

		header.getElementsByClassName("menu")[0].insertAdjacentHTML("afterend", '&nbsp; <input type="text" name="username" value="Username" id="sync_username" class="sync_username"> <button class="control h_label sync_button">&nbsp;Sync&nbsp;</button>&nbsp; <div id="sync_status" class="control sync_status">Not yet synced</div>&nbsp; <div id="collection_menu" class="menu collection_menu" style="display:none"> <button class="control large_button menu_button">Collection&nbsp; &or;</button> <div class="menu_content" style="display: none;"> <div class="menu_item" onclick="own">Owned</div> <div class="menu_item" onclick="prev_owned">Previously owned</div> <div class="menu_item" onclick="preordered">Preordered</div> <div class="menu_item" onclick="for_trade">For trade</div> <div class="menu_item" onclick="want_trade">Want in trade</div> <div class="menu_item" onclick="want_buy">Want to buy</div> <div class="menu_item" onclick="want_play">Want to play</div> <div class="menu_item" onclick="wishlist_1">Wishlist 1</div> <div class="menu_item" onclick="wishlist_2">Wishlist 2</div> <div class="menu_item" onclick="wishlist_3">Wishlist 3</div> <div class="menu_item" onclick="wishlist_4">Wishlist 4</div> <div class="menu_item" onclick="wishlist_5">Wishlist 5</div> </div> </div>');

		header.getElementsByClassName("sync_button")[0].onclick = function(){sync()};

		var menu_buttons = header.getElementsByClassName("menu_button");
		for (let i = menu_buttons.length - 1; i >= 0; i--) {
			menu_buttons[i].removeAttribute("onclick");
			menu_buttons[i].onclick = function(){toggleMenu2(menu_buttons[i])};
		}

		var collection_elems = header.getElementsByClassName("menu_content")[1].children;
		for (let i = collection_elems.length - 1; i >= 0; i--){
			let status = collection_elems[i].getAttribute("onclick");
			collection_elems[i].removeAttribute("onclick");
			collection_elems[i].onclick = function(){ setCollRule(status, true, collection_elems[i]); };
		}

		//Set up css-highlighting for new language menu
		var sheet = window.document.styleSheets[0];
		sheet.insertRule('.menu_item.label_hide { color: black; font-weight: bold; background:#99DD88 }', sheet.cssRules.length);

		//Initialize array of elements in auction and collection
		init();

		if (synced) {
			header.getElementsByClassName("sync_status")[0].style.display = "none";
			header.getElementsByClassName("sync_username")[0].value = collection.name;
			header.getElementsByClassName("collection_menu")[0].style.display = "inline-block";
		}

		window.alert("Greasemonkey script loaded successfully");
	}

	var activeElements = [];

	var rules = {
		tag : {
			name : "tag",
			type : "OR",
			members : [],
			restrictedElements : []
		},
		type : {
			name : "type",
			type : "NOR",
			members : [],
			restrictedElements : []
		},
		lang : {
			name : "lang",
			type : "OR",
			members : [],
			restrictedElements : []
		},
		collection : {
			name : "collection",
			type : "OR",
			members : [],
			restrictedElements : []
		}
	}

	var synced = false;
	var collection = {
		name: "Tobl",
		own: ["bggid_153999", "bggid_194789", "bggid_68606"],
		prev_owned: ["bggid_153999"],
		preordered: ["bggid_194789", "bggid_68606"],
		for_trade: [],
		want_trade: [],
		want_buy: [],
		want_play: [],
		wishlist_1: [],
		wishlist_2: [],
		wishlist_3: [],
		wishlist_4: [],
		wishlist_5: []
	};
	var activeCollection = [];

	function init(){
		var nl = document.getElementsByClassName('auction_item');
		activeElements = [];
		for(var i = nl.length-1; i>=0; i--){
			activeElements.unshift(nl[i])
		};

		//Collection
		var tmp = localStorage.getItem("collection");
		if (tmp != null){
			synced = true;
			collection = JSON.parse(tmp);
		}
	}

	function toggleMenu2(button)
	{
		var menu = button.nextElementSibling;
		var text = button.innerHTML;
		text = text.substring(0, text.length-1);
		if (menu.style.display == 'block') { menu.style.display = 'none';  button.innerHTML = text+'&or;'; }
		else                               { menu.style.display = 'block'; button.innerHTML = text+'&and;'; }
	}

	function setRule(rule, member, active, button) {
		// console.log("set rule "+rule.name+"."+member+" to "+active);
		if (active) {
			if (!rule.members.includes(member)) {
				rule.members.push(member);
				if (rule.type == "OR" && rule.members.length > 1) {
					loosen(rule);
				} else {
					restrict(rule);
				}
			}
			if (!button.classList.contains("label_hide")){
				button.classList.add("label_hide");
			}
		} else {
			var index = rule.members.indexOf(member);
			if (index > -1) {
				rule.members.splice(index, 1);
				if (rule.type == "OR" && rule.members.length > 0) {
					restrict(rule);
				} else {
					loosen(rule);
				}
			}
			if (button.classList.contains("label_hide")){
				button.classList.remove("label_hide");
			}
		}
		button.onclick = function(){ setRule(rule, member, !active, button); };
	}

	function setCollRule(member, active, button) {
		// console.log("set rule collection."+member+" to "+active);
		var rule = rules.collection;
		if (active) {
			if (!activeCollection.includes(member)) {
				activeCollection.push(member);
				var oldRuleLength = rule.members.length;
				rule.members = union(rule.members, collection[member]);
				if (oldRuleLength > 0) {
					loosen(rule);
				} else {
					restrict(rule);
				}
			}
			if (!button.classList.contains("label_hide")){
				button.classList.add("label_hide");
			}
		} else {
			var index = activeCollection.indexOf(member);
			if (index > -1) {
				activeCollection.splice(index, 1);
				rule.members = [];
				for (var i = activeCollection.length - 1; i >= 0; i--) {
					rule.members = union(rule.members, collection[activeCollection[i]]);
				}
				if (rule.members.length > 0) {
					restrict(rule);
				} else {
					loosen(rule);
				}
			}
			if (button.classList.contains("label_hide")){
				button.classList.remove("label_hide");
			}
		}
		button.onclick = function(){ setCollRule(member, !active, button); };
	}

	function union(arr1, arr2) {
		for (var i = arr2.length - 1; i >= 0; i--) {
			if (!arr1.includes(arr2[i])) {
				arr1.push(arr2[i]);
			}
		}
		return arr1;
	}

	function restrict(rule) {
		for (var i = activeElements.length - 1; i >= 0; i--) {
			if(!checkRule(activeElements[i], rule)){
				activeElements[i].style.display = "none";
				rule.restrictedElements.push(activeElements.splice(i,1)[0]);
			}
		}
	}

	function loosen(rule) {
		var activeRules = [];
		for (var key in rules){
			if(rules[key].members.length>0 && rules[key] != rule){
				activeRules.push(rules[key]);
			}
		}
		var activeRulesLength = activeRules.length;
		if(rule.members.length == 0){
			for (var i = rule.restrictedElements.length - 1; i >= 0;i--) {
				var elem = rule.restrictedElements[i];
				rule.restrictedElements.splice(i, 1);
				var makeActive = true;
				for (var j = activeRulesLength - 1; j >= 0; j--) {
					if (!checkRule(elem, activeRules[j])) {
						activeRules[j].restrictedElements.push(elem);
						makeActive = false;
						break;
					}
				}
				if (makeActive) {
					elem.style.display = "";
					activeElements.push(elem);
				}
			}
		} else {
			for (var i = rule.restrictedElements.length - 1; i >= 0;i--) {
				var elem = rule.restrictedElements[i];
				if (checkRule(elem, rule)) {
					rule.restrictedElements.splice(i, 1);
					var makeActive = true;
					for (var j = activeRulesLength - 1; j >= 0; j--) {
						if (!checkRule(elem, activeRules[j])) {
							activeRules[j].restrictedElements.push(elem);
							makeActive = false;
							break;
						}
					}
					if (makeActive) {
						elem.style.display = "";
						activeElements.push(elem);
					}
				}
			}
		}
	}

	function checkRule (elem, rule) {
		if (rule.members.length == 0) {
			return true
		}
		switch(rule.type){
			case "AND":
				var ruleMemberLength = rule.members.length;
				for (var i = 0; i < ruleMemberLength; i++) {
					if (!elem.classList.contains(rule.members[i])) {
						return false;
					}
				}
				return true;
				break;
			case "NOR":
				var ruleMemberLength = rule.members.length;
				for (var i = 0; i < ruleMemberLength; i++) {
					if (elem.classList.contains(rule.members[i])) {
						return false;
					}
				}
				return true;
				break;
			case "OR":
			default:
				var classListLength = elem.classList.length;
				for (var i = 0; i < classListLength; i++) {
					if (rule.members.includes(elem.classList[i])) {
						return true;
					}
				}
				return false;
				break;
		}
	}

	function sync() {
		var inputfield = document.getElementById("sync_username");
		var status = document.getElementById("sync_status");
		var collection_menu = document.getElementById("collection_menu");

		status.style.display = "inline-block";
		status.innerHTML = "Started syncing";
		collection_menu.style.display = "none";

		var xhr = new XMLHttpRequest();
		xhr.open('GET', "https://www.boardgamegeek.com/xmlapi2/collection?username="+inputfield.value, false);
		xhr.addEventListener("readystatechange", processResponse);
		xhr.send();
	}

	function processResponse(e) {
		var xhr = e.target;
		if (xhr.status == 202) {
			document.getElementById("sync_status").innerHTML = "BGG is processing your collection. Please try again in a minute.";
		} else if(xhr.readyState == 4 && xhr.status == 200) {
			collection = {
				name: document.getElementById("sync_username").value,
				own: [],
				prev_owned: [],
				preordered: [],
				for_trade: [],
				want_trade: [],
				want_buy: [],
				want_play: [],
				wishlist_1: [],
				wishlist_2: [],
				wishlist_3: [],
				wishlist_4: [],
				wishlist_5: []
			};

			var xml = (new DOMParser()).parseFromString(xhr.responseText, "text/xml");
			var items = xml.getElementsByTagName("item");
			for (var i = items.length - 1; i >= 0; i--) {
				var id = "bggid_"+items[i].getAttribute("objectid");
				var coll_status = items[i].getElementsByTagName("status")[0];
				if (coll_status.getAttribute("own") == "1") {
					collection.own.push(id);
				}
				if (coll_status.getAttribute("prevowned") == "1") {
					collection.prev_owned.push(id);
				}
				if (coll_status.getAttribute("preordered") == "1") {
					collection.preordered.push(id);
				}
				if (coll_status.getAttribute("fortrade") == "1") {
					collection.for_trade.push(id);
				}
				if (coll_status.getAttribute("want") == "1") {
					collection.want_trade.push(id);
				}
				if (coll_status.getAttribute("wanttobuy") == "1") {
					collection.want_buy.push(id);
				}
				if (coll_status.getAttribute("wanttoplay") == "1") {
					collection.want_play.push(id);
				}
				if (coll_status.getAttribute("wishlist") == "1") {
					collection["wishlist_"+coll_status.getAttribute("wishlistpriority")].push(id);
				}
			}

			localStorage.setItem("collection", JSON.stringify(collection));

			document.getElementById("sync_status").style.display = "none";
			document.getElementById("collection_menu").style.display = "inline-block";
		}
	}
	
})();