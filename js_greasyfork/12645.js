// ==UserScript==
// @name         FFL Chat Modifier
// @namespace    http://fusionfalllegacy.com/
// @version      1.8.2
// @description  This userscript allows you to run the FFL LIVE chat within a tab in your browser and allows for some new BBCode. PLEASE PLEASE PLEASE PLEASE PLEEEASE click the ? button for information on how to install this script.
// @author       L0L_Limewire
// @match        http://interact.modulatornetwork.com/forums/chat/index.php*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/12645/FFL%20Chat%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/12645/FFL%20Chat%20Modifier.meta.js
// ==/UserScript==

// ADDED FEATURES LIST

// [textcolor=#COLOR IN HEX]message[/textcolor]
// [code]message[/code]
// <REMOVED> [img]image url[/img]
// enabled opening the LIVE chat in a tab

// don't look at me, i don't do regular javascript. dont cry to me when this script isnt pretty or up to ethical standards

// stop tab redirection

ReloadFMHQLive = function(){}; // i still wonder why exactly tabs arent allowed to this day

window.onbeforeunload = function(){
    return 'Page attempted to log you out. Do you want to leave? (hint: for your health it is recommended to do so)';
};

// now for the real features

naughtySound = new Audio("http://s1.vocaroo.com/media/download_temp/Vocaroo_s1i83BLxw0A0.mp3"); // you're welcome Professor

Sounds = {}

for (i=0;i<10;i++){ // loop through and add sounds
    Sounds["sound_"+i.toString()] = new Audio("http://interact.modulatornetwork.com/forums/chat/sounds/sound_"+i.toString())
}

ajaxChat.sounds = true // enables audio

NaughtyWords = [ // avert your eyes, children!
    'bastard',
    'basstard',
    'basterd',
    'bassterd',
    'bas tard',
    'bass tard',
    'bas terd',
    'bass terd',
    'asshole',
    'asshoie',
    'assho1e',
    'assho!e',
    'ass',
    'azzhole',
    'azzhoie',
    'azzho1e',
    'azzho!e',
    'beer',
    'boob',
    'badb',
    'bitch',
    'cunt',
    'dammit',
    'damm!t',
    'damm1t',
    'dammlt',
    'damn',
    'dick',
    'd!ck',
    'd1ck',
    'dlck',
    'fuc',
    'fuk',
    'fuck',
    'fux',
    'nipple',
    'nude',
    'nudity',
    'p!ss',
    'p1ss',
    'penis',
    'pen!s',
    'pen1s',
    'piss',
    'puss',
    'sex',
    'shit',
    'sh!t',
    'sh1t',
    'shlt',
    'tits',
    'vagisil',
    'vagina',
    'arse',
    'hel',
    'hell',
    'bullass',
    'fvck',
    'twat',
    'jerkwad',
    'jack coco',
    'jackazz',
    'jack azz',
    'porn',
    'customass',
    'sasser',
    'sasst',
    'helpuffs',
    'cock',
    'faggot',
    'fagot',
    'fagot',
    'fagot',
    'fag',
    'nigger',
    'n!gger',
    'panty',
    'porm',
    'pr0n',
    'anal',
    'ccoco',
    'semen',
    'whore',
    'biggot',
    'chink',
    'clit',
    'vag',
    'slut',
    'skank',
    'hooker',
    'prostitute',
    'nigga',
    'thot',
    'hentai'
];

newButtons = [
    ["Color","Insert color : [textcolor=#HEXCOLOR]message[/textcolor]","textcolor"],
    ["Code","[code]script contents[/code]","code"],
    ["Image","[img]image url[/img]","img"]
];

replaceText = [ // for those who accidently say shit they dont mean to
    ["lmao","lmbo"],
    ["hella","hecka"],
    ["gdi","gosh darn it"],
    ["omfg","omg"],
    ["hell","heck"],
    ["damn","darn"]
];

ajaxChat.bbCodeTags = ['b','i','u','strike','quote','color','url','code','img','textcolor']; //add new bbcode and revive old bbcode
ajaxChat.settings.bbCodeImages = true; // enable images

onlineText = document.getElementById("onlineListContainer").firstElementChild;
buttonHolder = document.getElementById("bbCodeContainer");

var newButton;

for(newButton in newButtons){ // add new bbcode buttons
    newButton = newButtons[newButton];
    Button = document.createElement("input");
    Button.type = "button";
    Button.value = newButton[0];
    Button.title = newButton[1];
    Button.setAttribute("onclick","ajaxChat.insertBBCode('"+newButton[2]+"')");
    buttonHolder.appendChild(Button);
}

ajaxChat.replaceBBCodeCallback = function(str, p1, p2, p3) { // replace functions to allow for new features
	// Only replace predefined BBCode tags:
	if(!ajaxChat.inArray(ajaxChat.bbCodeTags, p1)) {
		return str;
	}
	// Avoid invalid XHTML (unclosed tags):
	if(ajaxChat.containsUnclosedTags(p3)) {
		return str;
	}	
	switch(p1) {
		case 'color':
			return ajaxChat.replaceBBCodeColor(p3, p2);
        case 'textcolor': // [color] tag but allows for use within nested colors such as 
            return ajaxChat.replaceBBCodeColor(p3,p2);
		case 'url':
			return ajaxChat.replaceBBCodeUrl(p3, p2);
		case 'quote':
			return ajaxChat.replaceBBCodeQuote(p3, p2);
		case 'u':
			return ajaxChat.replaceBBCodeUnderline(p3);
		case 'strike':
			return ajaxChat.replaceBBCodeStrike(p3);
		case 'img': // [img] tag
			return ajaxChat.replaceBBCodeImage(p3);
		default:
			return ajaxChat.replaceCustomBBCode(p1, p2, p3);
	}
};

//ajaxChat.replaceBBCodeImage = function(url) { // function enabled
//	var regExpUrl;
//	regExpUrl = new RegExp(this.regExpMediaUrl,'');
//	if(!url || !url.match(regExpUrl))
//		return url;
//	url = url.replace(/\s/gm, this.encodeText(' '));
//	return	'<a href="'+url+'" onclick="window.open(this.href); return false;">'+'<img class="bbCodeImage" style="max-width:250px;" src="'+url+'" alt="Click to view full-size image." onload="ajaxChat.updateChatlistView();"/></a>';
//};

ajaxChat.replaceBBCodeColor = function(content, attribute) { // color limitations removed
    if(this.settings.bbCodeColors) {
		return 	'<span style="color:'+ attribute + ';">'+ this.replaceBBCode(content)+ '</span>';
	}
	return content;
};

ajaxChat.replaceCustomText = function(text){
    var doAlert,index;
    doAlert = false; // do sound upon naughty word
    for(index in NaughtyWords){
        naughty = NaughtyWords[index];
        if(text.search(new RegExp('\\b'+naughty+'\\b','gi'))!=-1){
            doAlert = true; // enable sound playback
        }
        text = text.replace(new RegExp('\\b'+naughty+'\\b','gi'), 'coco'); // and then censor the word
    }
    if(doAlert === true){
        naughtySound.play();
    }
    return text;
};

ajaxChat.insertBBCode = function(bbCode) { // custom bbcode button support
	switch(bbCode) {			
		case 'url':
			var url = prompt(this.lang.urlDialog, 'http://');
			if(url)
				this.insert('[url=' + url + ']', '[/url]');
			else
				this.dom.inputField.focus();
			break;
        case 'textcolor':
            var textcolor = prompt('What color? (in hex format)','#');
            if(textcolor)
                this.insert('[textcolor=' + textcolor + ']','[/textcolor]');
            else
                this.dom.inputField.focus();
            break;
		default:
			this.insert('[' + bbCode + ']', '[/' + bbCode + ']');		
	}
};

ajaxChat.handleOnlineUsers = function(userNodes) { // replace to update the user counter
	if(userNodes.length) {
        onlineText.textContent = "Online users : "+userNodes.length.toString(); // show member count
		var index,userID,userName,userRole,i,
			onlineUsers = [];
		for(i=0; i<userNodes.length; i++) {
			userID = userNodes[i].getAttribute('userID');
			userName = userNodes[i].firstChild ? userNodes[i].firstChild.nodeValue : '';
			userRole = userNodes[i].getAttribute('userRole');
			onlineUsers.push(userID);
			index = this.arraySearch(userID, this.usersList);
			if(index === false) {
				this.addUserToOnlineList(
					userID,
					userName,
					userRole
				);
			} else if(this.userNamesList[index] !== userName) {
				this.removeUserFromOnlineList(userID, index);
				this.addUserToOnlineList(
					userID,
					userName,
					userRole
				);
			}
		}
		// Clear the offline users from the online users list:
		for(i=0; i<this.usersList.length; i++) {
			if(!this.inArray(onlineUsers, this.usersList[i])) {
				this.removeUserFromOnlineList(this.usersList[i], i);
			}
		}	
		this.setOnlineListRowClasses();		
	}
    limewireNode = document.getElementById("ajaxChat_u_2140");
    if(limewireNode !== null){
        limewireNode.firstElementChild.style.color = "#eccc00";
    }   
};

ajaxChat.sendMessage = function(text) {
	text = text ? text : this.dom.inputField.value;
	if(!text) {
		return;
	}
    var wordIndex;
	text = this.parseInputMessage(text);
       for(wordIndex in replaceText){
           replaceArray = replaceText[wordIndex];
           text = text.replace(new RegExp('\\b'+replaceArray[0]+'\\b',"gi"),replaceArray[1]);
       }
	if(text) {
		clearTimeout(this.timer);
		var message = 'lastID=' + this.lastID + '&text=' + this.encodeText(text);				
		this.makeRequest(this.ajaxURL,'POST',message);
	}
	this.dom.inputField.value = '';
	this.dom.inputField.focus();
	this.updateMessageLengthCounter();
};

ajaxChat.playSound = function(sound){ // lame way to implement sounds - i don't use javascript often
    Sounds[sound].play()
};

ajaxChat.playSoundOnNewMessage = function(dateObject, userID, userName, userRole, messageID, messageText, channelID, ip) {
	if(this.settings.audio && this.sounds && this.lastID && !this.channelSwitch) {
		switch(userID) {
			case this.chatBotID:
				var messageParts = messageText.split(' ', 1);
				switch(messageParts[0]) {
					case '/login':
						this.playSound('sound_3');
						break;
					case '/channelEnter':
						//this.playSound('sound_7');
						break;
					case '/logout':
						this.playSound('sound_4');
						break;
					case '/channelLeave':
						//this.playSound('sound_8');
						break;
					case '/kick':
						//this.playSound('sound_9');
						break;
					case '/error':
						this.playSound('sound_6');
						break;
					default:
						this.playSound('sound_5');
				}
				break;
			case this.userID:
				this.playSound('sound_2');
				break;
			default:
				this.playSound('sound_1');
				break;
		}
	}
};

// patch the scroll issue

ajaxChat.updateChatlistView = function(){		
	if(this.dom['chatList'].childNodes && this.settings['maxMessages']) {
		while(this.dom['chatList'].childNodes.length > this.settings['maxMessages']) {
			this.dom['chatList'].removeChild(this.dom['chatList'].firstChild);
		}
	}
	
	if(this.settings['autoScroll']) {
		this.dom['chatList'].scrollTop = 1e+40 // WE'RE NOT AIMING FOR THE TRUCK
	}
}