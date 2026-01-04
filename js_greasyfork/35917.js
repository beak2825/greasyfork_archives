// ==UserScript==
// @name         Facebook User List Maker
// @namespace    facebookuserlistmaker
// @version      1.5.0
// @author       Tophness
// @match        http://www.facebook.com/*
// @match        https://www.facebook.com/*
// @description  Save and Load Friend Lists for Facebook Lists
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant   GM_getValue
// @grant   GM_setValue
// @grant   GM_deleteValue
// @grant   GM_listValues
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/35917/Facebook%20User%20List%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/35917/Facebook%20User%20List%20Maker.meta.js
// ==/UserScript==

var friendsSelector = 'div[id$="_friends"]';
var friendsSelector2 = 'div[role="dialog"]';
var friendsSelector3 = 'div[id="pagelet_group_members"]';
var storySelector = 'a[data-hovercard]';
var scrollResultSelector = 'div[class^="fbProfileBrowserResult"]';
var scrollMoreSelector = 'a[class$="uiMorePagerPrimary"]';
var scrollNoMoreSelector = 'div[class$="NoMoreItems"]';
var scrollul = 'ul[class^="uiList"]';
var users = [];
var friendsel;
var saveDiv = '<form name="save"><input name="savebut" type=button onclick="document.forms.save.dosave.value=true;" value="Save List"><input type=text name=listname><input type=hidden name=dosave value="false"></form>';
var loadDiv = '<form name="load"><input name="loadbut" type=button onclick="document.forms.load.doload.value=true;" value="Load List"><input type=hidden name=doload value="false"><input type=hidden name=dodelete value="false"><input type=button onclick="document.forms.load.dodelete.value=true;" value="Delete List"></form>';

function includes(k) {
	for(var i=0; i < this.length; i++){
		if( this[i].name === k ){
			return true;
		}
	}
	return false;
}

function block(link){
	if(link.outerHTML.indexOf('data-hovercard') != -1){
		var uname = link.innerText;
		var uid = link.getAttribute('uid');
		if(uname != "" && !users.includes(uname)){
			var newuser = {};
			newuser.name = uname;
			if(uid){
				newuser.id = uid;
			}
			else{
				uid = link.getAttribute('data-hovercard');
				uid = uid.substring(uid.indexOf('id=') + 3);
				if(uid.indexOf('&') == -1){
					uid = uid.substring(0, uid.indexOf('"'));
				}
				else{
					uid = uid.substring(0, uid.indexOf('&'));
				}
				newuser.id = uid;
			}
			users.push(newuser);
		}
	}
}

function processFilter(stories){
	if (!stories) {
		return;
	}
	var story = stories.querySelectorAll(storySelector);
	if (!story.length) {
		return;
	}
	for (var i = 0; i < story.length; i++) {
		block(story[i]);
	}
}

function process() {
	if(document.forms.save){
		if(document.forms.save.listname.value != ""){
			if(location.href.indexOf('/members') != -1){
				processFilter(document.querySelector(friendsSelector3));
			}
			else if(location.href.indexOf('/friends') != -1){
				processFilter(document.querySelector(friendsSelector));
			}
			else{
				processFilter(friendssel);
			}
			GM_setValue(document.forms.save.listname.value, JSON.stringify(users));
		}
	}
	else{
		start();
	}
}

function waitForEl(selector, callback, timer=100){
	var poller1 = setInterval(function(){
		$jObject = jQuery(selector);
		if($jObject.length < 1){
			return;
		}
		clearInterval(poller1);
		callback($jObject);
	},timer);
}

function uToken(username, id){
	var newdiv = document.createElement('span');
	newdiv.className = "removable uiToken";
	var newdiv2 = document.createElement('span');
	newdiv2.className = "uiTokenText";
	newdiv2.innerHTML = username;
	var newdiv3 = document.createElement('input');
	newdiv3.name="members[]";
	newdiv3.autocomplete="off";
	newdiv3.type="hidden";
	newdiv3.value = id;
	var newdiv4 = document.createElement('input');
	newdiv4.value=username;
	newdiv4.name="text_members[]";
	newdiv4.autocomplete="off";
	newdiv4.type="hidden";
	var newdiv5 = document.createElement('a');
	newdiv5.href="#";
	newdiv5.aria_label="Remove " + username;
	newdiv5.className="remove uiCloseButton uiCloseButtonSmall";
	newdiv.appendChild(newdiv2);
	newdiv.appendChild(newdiv3);
	newdiv.appendChild(newdiv4);
	newdiv.appendChild(newdiv5);
	document.getElementById('fbFriendListTokenizer').getElementsByClassName('tokenarea')[0].appendChild(newdiv);
}

function listpaste(){
	if(document.getElementById('createListMembers')){
		if(document.getElementById('createListname') && document.forms.load.listnames.value){
			document.getElementById('createListname').value = document.forms.load.listnames.value;
		}
		if(document.getElementById('fbFriendListTokenizer').getElementsByClassName('tokenarea')[0]){
			document.getElementById('fbFriendListTokenizer').getElementsByClassName('tokenarea')[0].className = "tokenarea";
		}
		for (var i = 0; i < users.length; i++) {
			uToken(users[i].name, users[i].id);
		}
	}
	else{
		setTimeout(listpaste, 1000);
	}
}

function startObserver(){
	if(document.forms.save){
		if(document.forms.save.dosave.value == "true"){
			var listname = document.forms.save.listname.value.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "");
			users = JSON.parse(GM_getValue(listname, "[]"));
			if(!users){
				console.warn("error");
			}
			users.includes = includes;
			process();
		}
	}
}

function doscroll(el){
	var scrollbut = el.querySelector(scrollMoreSelector);
	waitForEl(scrollbut, function() {
		scrollbut.click();
		if(!el.querySelector(scrollNoMoreSelector)){
			doscroll(el);
		}
		else{
			startObserver();
		}
	},1000);
}

function loadbegin(contentarea){
	if(document.forms.load.doload.value == "true"){
		users = JSON.parse(GM_getValue(document.forms.load.listnames.value, "[]"));
		if(!users){
			console.warn("error");
		}
		contentarea = document.getElementById('contentArea');
		if(contentarea.getElementsByClassName('uiHeaderActions')[0].childNodes[0]){
			contentarea.getElementsByClassName('uiHeaderActions')[0].childNodes[0].addEventListener('click', listpaste, false);
			contentarea.getElementsByClassName('uiHeaderActions')[0].childNodes[0].click();
		}
	}
	else if(document.forms.load.dodelete.value == "true"){
		var select = document.forms.load.listnames;
		GM_deleteValue(select.value);
		dvalue = select.selectedIndex;
		select.removeChild(select[dvalue]);
	}
	else{
		setTimeout(loadbegin, 1000);
	}
}

function loadfindpage(el){
	if(el.firstChild.id != 'saveDiv'){
		var savebutton = document.createElement('div');
		savebutton.id = 'saveDiv';
		savebutton.innerHTML = saveDiv;
		el.insertAdjacentElement('afterbegin', savebutton);
		document.forms.save.savebut.addEventListener('click', function(){startObserver();}, true);
	}
}

function findpage(){
	var divs = document.querySelectorAll(friendsSelector2);
	var found = false;
	for (var i = 0; i < divs.length; ++i) {
		if(divs[i].querySelectorAll(storySelector).length){
			friendssel = divs[i];
			found = true;
		}
	}
	if(found){
		loadfindpage(friendssel);
		startObserver();
	}
	else{
		setTimeout(findpage, 1000);
	}
}

function scrollmembers(el){
		var scrollresult = el.querySelectorAll(scrollResultSelector);
		if(scrollresult){
			for (var i = 0; i < scrollresult.length; ++i) {
				doscroll(scrollresult[i]);
			}
		}
}

function scrollfriends(el, oldlength=0, timeout=10){
	var uilist = el.querySelectorAll(scrollul);
	if(uilist.length > 0){
		uilist[uilist.length-1].scrollIntoView();
		if(uilist.length > oldlength){
			scrollfriends(el, uilist.length);
		}
		else{
			if(uilist.length <= oldlength){
				timeout --;
				if(timeout > 0){
					console.log('timeout: ' + timeout);
					setTimeout(function() {
						scrollfriends(el, oldlength, timeout);
					}, 1000);
				}
				else{
					startObserver();
				}
			}
		}
	}
}

function start(){
if(location.href.indexOf('bookmarks/lists') != -1){
	var contentarea = document.getElementById('contentArea');
	waitForEl(contentarea, function() {
		var loadbut = document.createElement('div');
		loadbut.innerHTML = loadDiv;
		var x = document.createElement("select");
		x.name="listnames";
		var alllists = GM_listValues();
		for (var i = 0; i < alllists.length; i++) {
			var option = document.createElement("option");
			option.text = alllists[i];
			x.add(option);
		}
		contentarea.insertAdjacentElement('afterbegin', loadbut);
		document.forms.load.appendChild(x);
		loadbegin();
	});
}
else if(location.href.indexOf('/friends') != -1){
	var fs = document.querySelector(friendsSelector);
	scrollfriends(fs);
	waitForEl(fs, function() {
		loadfindpage(fs);
	},500);
}
else if(location.href.indexOf('/members') != -1){
	var fs3 = document.querySelector(friendsSelector3);
	scrollmembers(fs3);
	waitForEl(fs3, function() {
		loadfindpage(fs3);
	},500);
}
else{
	findpage();
}
}
start();