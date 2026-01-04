// ==UserScript==
// @name	TFGS-Toolkit 3.0 (Audio-Enabler)
// @namespace	http://fusioneko.tumblr.com/ https://twitch.tv/AonaNae
// @version	3.0
// @description	A Re-enhanced, and improved version of the TFGS Toolkit!
// @author	Fusioneko / Aona Nae
// @match	https://tfgames.site/phpbb3/chat/*
// @match	https://wwww.tfgames.site/phpbb3/chat/*
// @grant	GM_setValue
// @grant	GM_getValue
// @grant	GM_listValues
// @grant	unsafeWindow
// @require	http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @copyright	2015+, Fusioneko/Aona Nae
// @downloadURL https://update.greasyfork.org/scripts/384332/TFGS-Toolkit%2030%20%28Audio-Enabler%29.user.js
// @updateURL https://update.greasyfork.org/scripts/384332/TFGS-Toolkit%2030%20%28Audio-Enabler%29.meta.js
// ==/UserScript==


// This is to be replaced below, it exists as a sort of test- if it works.
// Below should be noted that it is a color injection portion still working
function inject(source) {
  // Check for function input.
  if ('function' == typeof source) {
    // Execute this function with no arguments, by adding parentheses.
    // One set around the function, required for valid syntax, and a
    // second empty set calls the surrounded function.
    source = '(' + source + ')();'
  }

  // Create a script node holding this  source code.
  var script = document.createElement('script');
  script.setAttribute("type", "application/javascript");
  script.textContent = source;

  // Insert the script node into the page, so it will run, and immediately
  // remove it to clean up.
  document.body.appendChild(script);
  document.body.removeChild(script);
}

//We can attempt to inject the ol' Json/Array/Table
inject(function(){
	if(localStorage.ExtDB){
		console.log("I found variables pertaining to localstorage!");
	} else {
		console.log("Time to create a database!");

	}
	ajaxChat.tmpobj = {
	"xusers":[
		{"id" : "228", "username" : "fusioneko", "nick" : "(Neko)", "userRole" : "-155", "color" : "#ff69b4"},
		{"id" : "301", "username" : "dm2bf", "nick" : "dm2bf", "userRole" : "-155", "color" : "green"},
		{"id" : "1443", "username" : "D4113R", "nick" : "(Daizy)", "userRole" : "-155", "color" : "#B038FB"},
		{"id" : "4564", "username" : "mcsami", "nick" : "(Sammi)", "userRole" : "-155", "color" : "#9751D7"},
		{"id" : "7943", "username" : "ferinzz", "nick" : "Ferinzz", "userRole" : "-155", "color" : "#008080"},
		{"id" : "7945", "username" : "aorineko", "nick" : "(Bun-Bun)", "userRole" : "-155", "color" : "green"},
		{"id" : "8839", "username" : "aixial", "nick" : "(Avalia)", "userRole" : "-155", "color" : "#5481C1"},
		{"id" : "13035", "username" : "Neko", "nick" : "(okeN)", "userRole" : "-155", "color" : "#ff69b4"},
		{"id" : "27018", "username" : "xaosin", "nick" : "(Chris)", "userRole" : "-155", "color" : "#9751d7"},
		{"id" : "46663", "username" : "vertforet", "nick" : "(Emery)", "userRole" : "-155", "color" : "#0876c9"},
		{"id" : "47178", "username" : "seyal", "nick" : "(Syndra)", "userRole" : "-155", "color" : "#FF0066"}
	]};
	var TKSheet = (function() {
		// Create the <style> tag
		var tkstyle = document.createElement("style");

		// Add a media (and/or media query) here if you'd like!
		// style.setAttribute("media", "screen")
		// style.setAttribute("media", "only screen and (max-width : 1024px)")

		// WebKit hack :(
		tkstyle.appendChild(document.createTextNode(""));

		// Add the <style> element to the page
		document.head.appendChild(tkstyle);

		return tkstyle.sheet;
	})();
	rxstr = "custom_";
	// Establish Reference to table:
	var xusers = ajaxChat.tmpobj["xusers"];
	for(var k in xusers){
		cususrclr = xusers[k].color;
		console.log("::Dealing with Data! ["+xusers[k].id+"]");
		TKSheet.insertRule("@media screen,projection,handheld {	#content ."+rxstr+""+xusers[k].id+" { color:"+cususrclr+"; font-weight: bold; } }",0);
	}

});

/*
inject(function(){
	ajaxChat.TKSheet = function() {
		// Create the <style> tag
		var tkstyle = document.createElement("style");

		// Add a media (and/or media query) here if you'd like!
		// style.setAttribute("media", "screen")
		// style.setAttribute("media", "only screen and (max-width : 1024px)")

		// WebKit hack :(
		tkstyle.appendChild(document.createTextNode(""));

		// Add the <style> element to the page
		document.head.appendChild(tkstyle);

		return tkstyle.sheet;
	}
});
	*/

// Redefine the getRoleClass, and inject it.
inject(function(){
	ajaxChat.getRoleClass = function(roleID,uxid) {

		switch(parseInt(roleID)) {
			case 0:
				return 'guest';
			case 1:
				return 'user';
			case 2:
				return 'moderator';
			case 3:
				return 'admin';
			case 4:
				return 'chatBot';
			case 5:
				return 'customUser';
			case -156:
				return 'custom_228';
			case -155:
				//console.log("CONSOLE: Received user id "+String(uxid));
				rxstr = "custom_"+uxid;

				//Check other users: [SLOPPY!]
				/*
				for(var key in this.tmpobj) {
					for(var k in this.tmpobj[key]){
						if(this.tmpobj[key][k].id == uxid){
							cususrclr = this.tmpobj[key][k].color;
							console.log(+uxid+"::Dealing with Data! ["+this.tmpobj[key][k].id+"]");
							//TKSheet.insertRule("@media screen,projection,handheld {	#content ."+rxstr+" { color:"+cususrclr+"; font-weight: bold; } }",0);
						}
					}
				}
				*/
				//TKSheet.insertRule("@media screen,projection,handheld {	#content ."+rxstr+" { color:"+cususrclr+"; font-weight: bold; } }",0);
				return rxstr;

			default:
				return 'default';
		}
	}
});


//Inject: getUserNodeString
inject(function(){
	ajaxChat.getUserNodeString = function(userID, userName, userRole) {
		var encodedUserName, str;
		if(this.userNodeString && userID === this.userID) {
			return this.userNodeString;
		} else {
			encodedUserName = this.scriptLinkEncode(userName);
			str	= '<div id="'
					+ this.getUserDocumentID(userID)
					+ '"><a href="javascript:ajaxChat.toggleUserMenu(\''
					+ this.getUserMenuDocumentID(userID)
					+ '\', \''
					+ encodedUserName
					+ '\', '
					+ userID
					+ ');" class="'
					+ this.getRoleClass(userRole,userID)
					+ '" title="'
					+ this.lang['toggleUserMenu'].replace(/%s/, userName)
					+ '">'
					+ userName
					+ '</a>'
					+ '<ul class="userMenu" id="'
					+ this.getUserMenuDocumentID(userID)
					+ '"'
					+ ((userID === this.userID) ?
						'>'+this.getUserNodeStringItems(encodedUserName, userID, false) :
						' style="display:none;">')
					+ '</ul>'
					+'</div>';
			if(userID == this.userID) {
				this.userNodeString = str;
			}
			return str;
		}
	}
});

//Inject: getChatListMessageString
inject(function(){
	ajaxChat.getChatListMessageString = function(dateObject, userID, userName,
		userRole, messageID, messageText, channelID, ip) {
		var rowClass = this.DOMbufferRowClass;
		var userClass = this.getRoleClass(userRole,userID);
		//console.log(userRole);
		//console.log(userID);
		var colon;

		if (channelID == this.myPrivateMessage()
			&& userRole < 4 && userID != this.userID) {
			this.lastPrivMsgSenderID = userID;
			// check online list, user may have changed name since:
			index = this.arraySearch(userID, this.usersList);
			this.lastPrivMsgSender = ( index === -1 ? userName :
										this.userNamesList[index] );
		}

		var realUserName = null;
		var origText = messageText;
		var textParts = messageText.split(' ');

		switch(textParts[0]) {
			case '/customStatus':
			case '/customError':
				origText = textParts.slice(1).join(' ');
				break;

			case '/anon':
				realUserName = userName;
				userName = textParts[1];
				messageText = textParts.slice(2).join(' ');
				userClass = this.getRoleClass(1,0);

				if(userName.substr(0,6) == '&quot;') {
					for(var nidx = 2; nidx < textParts.length; nidx++) {
						if (textParts[nidx].substr(textParts[nidx].length-6) == '&quot;') {
							userName = textParts.slice(1, nidx+1).join(' ');
							userName = userName.substring(6,userName.length-6);
							messageText = textParts.slice(nidx+1).join(' ');
							break;
					}
				}
			}
			origText = messageText;
			break;
		}

		if(messageText.indexOf('/action') == 0 || messageText.indexOf('/me') == 0 || messageText.indexOf('/privaction') == 0) {
			userClass += ' action';
			colon = ' ';
		} else {
			colon = ': ';
		}
		if (messageText.indexOf('/privmsg') === 0 || messageText.indexOf('/privmsgto') === 0 || messageText.indexOf('/privaction') === 0) {
			rowClass += ' private';
		}

		var dateTime = this.settings['dateFormat'] ? '<span class="dateTime">'
						+ this.formatDate(this.settings['dateFormat'], dateObject) + '</span> ' : '';

		var docID = this.getMessageDocumentID(messageID);

		return	'<div id="'
				+ docID
				+ '" '
				+ (realUserName ? ' title="' + realUserName + '"' : '')
				+ ' class="'
				+ rowClass
				+ '">'
				+ this.getDeletionLink(messageID, userID, userRole, channelID, docID)
				+ dateTime
				+ '<span class="'
				+ userClass
				+ '"'
				+ this.getChatListUserNameTitle(userID, userName, userRole, ip)
				+ ' dir="'
				+ this.baseDirection
				+ '" onclick="ajaxChat.insertText(this.firstChild.nodeValue);">'
				+ userName
				+ '</span>'
				+ colon
				+ '<span ondblclick="ajaxChat.copyBBCode(\''
				+ escape(origText)
				+ '\');"'
				+ (realUserName ? ' title="' + realUserName + '"' : '')
				+ ' >'
				+ this.replaceText(messageText)
				+ '</span>'
				+ '</div>';
	}
});

//Inject a custom text input command
inject(function(){
	ajaxChat.parseCustomInputCommand = function(text, textParts) {
		// get the user color.
		for(var key in this.tmpobj) {
			for(var k in this.tmpobj[key]){
				if(this.tmpobj[key][k].id == this.userID){
					this.usr_color = this.tmpobj[key][k].color;
				}
			}
		}
		switch(textParts[0]) {
			case '/cls':
				this.clearChatList();
				return null;

			case '/save':
				this.copyChatList();
				return null;

			case '/do':
				if(textParts[1].search(/("[^"]*?")/)){
					console.log("Katya!?");
					text = textParts.slice(2).join(' ');
					text = text.replace(/("[^"]*?")/g, '[color='+this.usr_color+']$1[/color]');
					text = textParts[0]+' '+textParts[1]+' '+text;
					return text;
				}

			case '/me':
				text = text.replace(/("[^"]*?")/g, '[color='+this.usr_color+']$1[/color]');
				return text;

			case '/action':
				text = text.replace(/("[^"]*?")/g, '[color='+this.usr_color+']$1[/color]');
				return text;

		}
		//text = text.replace(/("[^"]*?")/g, '[color='+usr_color+']$1[/color]');
		return text;
	}
});



// Inject handleOnlineUsers
inject(function(){
	ajaxChat.handleOnlineUsers = function(userNodes) {
		if(userNodes.length) {
			var index,userID,userName,userRole,i,
				onlineUsers = [];
			for(i=0; i<userNodes.length; i++) {
				userID = userNodes[i].getAttribute('userID');
				userName = userNodes[i].firstChild ? userNodes[i].firstChild.nodeValue : '';
				userRole = userNodes[i].getAttribute('userRole');

				// Insert Modified code
				for(var key in this.tmpobj) {
					for(var k in this.tmpobj[key]){
						if(this.tmpobj[key][k].id == userID){
							userRole = this.tmpobj[key][k].userRole;
						}
					}
				}
				if (userID == this.userID){ userRole = -155; }


				onlineUsers.push(userID);
				index = this.arraySearch(userID, this.usersList);
				if(index === -1) {
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
	}
});


// Inject custom handlechatmessages function
inject(function(){
	ajaxChat.handleChatMessages = function(messageNodes) {
		var userNode,userName,textNode,messageText,i,userRole;
		if(messageNodes.length) {
			for(i=0; i<messageNodes.length; i++) {
				this.DOMbuffering = true;
				userNode = messageNodes[i].getElementsByTagName('username')[0];
				userName = userNode.firstChild ? userNode.firstChild.nodeValue : '';
				textNode = messageNodes[i].getElementsByTagName('text')[0];
				messageText = textNode.firstChild ? textNode.firstChild.nodeValue : '';
				if (i === (messageNodes.length - 1)) {this.DOMbuffering = false;}

				//Custom Code and Implementation
				userID = messageNodes[i].getAttribute('userID');
				userRole = messageNodes[i].getAttribute('userRole');


				//Intended to define the user level
				if (userID == this.userID){
					userRole = -155;
				}

				//Do a check for users. [SLOPPY]
				for(var key in this.tmpobj) {
					for(var k in this.tmpobj[key]){
						if(this.tmpobj[key][k].id == userID){
							userRole = this.tmpobj[key][k].userRole;
						}
					}
				}


				// Spill out console message of server exchange [ Debug ]
				console.log("{"+this.userID+"}-["+messageNodes[i].getAttribute('userID')+"] ["+userRole+"] {" + userName + "} Writes: '" + messageText + "'" + " [ " + messageNodes[i].getAttribute('channelID') + ", " + messageNodes[i].getAttribute('ip') + " ]");
				/*
				var options = {
					body: userName+':' + messageText

				}
				var note = new Notification('Stuff!', options);
				*/
				//chrome.runtime.sendMessage("Hi");
				// Output the altered messages
				this.addMessageToChatList(
						new Date(messageNodes[i].getAttribute('dateTime')),
						userID,
						userName,
						userRole,
						messageNodes[i].getAttribute('id'),
						messageText,
						messageNodes[i].getAttribute('channelID'),
						messageNodes[i].getAttribute('ip')
				);
			}
			this.DOMbuffering = false;
			this.updateChatlistView();
			this.lastID = messageNodes[messageNodes.length-1].getAttribute('id');
		}
	}
});

// Overiding the old FABridge system, with new amazing stuff.  Aka lazy code I copied off another website(W3Schools), hacked in, and made it work. ggbrD
/*
inject(function(){
	function sound(src) {
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		document.body.appendChild(this.sound);
		this.play = function(){
			this.sound.play();
		}
		this.stop = function(){
			this.sound.pause();
		}
	}
}); */
inject(function(){
	ajaxChat.AonaBridgeFX = function Asound(src) {
		this.Asound = document.createElement("audio");
		this.Asound.src = src;
		var avolume;
		//console.log()
		avolume = "this.volume="+ajaxChat.settings['audioVolume'];
		//console.log(ajaxChat.settings['audioVolume']);
		//console.log(avolume);
		this.Asound.setAttribute("onloadstart", avolume);
		this.Asound.setAttribute("preload", "auto");
		this.Asound.setAttribute("controls", "none");
		this.Asound.style.display = "none";
		document.body.appendChild(this.Asound);
		this.play = function(){
			this.Asound.play();
		}
		this.stop = function(){
			this.Asound.pause();
		}
	}
});
inject(function(){
	ajaxChat.playSound = function(soundID) {
		var AonaSoundFX;
		//console.log(soundID);
		if(soundID){
			AonaSoundFX = new this.AonaBridgeFX("./sounds/"+soundID+".mp3");
			//console.log(AonaSoundFX);
			return AonaSoundFX.play();
		} else {
			return null;
		}
	}
});
inject(function(){
	ajaxChat.playSoundOnNewMessage = function(dateObject, userID, userName, userRole, messageID, messageText, channelID, ip) {
		var messageParts;
		//console.log("New Message - Audio Settings: "+this.settings['audio']);
		this.sounds = true;
		//console.log(this.sounds)
		if(this.settings['audio'] && this.sounds && this.lastID && !this.channelSwitch) {
			if(this.customSoundOnNewMessage(dateObject, userID, userName, userRole, messageID, messageText, channelID, ip) === false) {
				return;
			}
			messageParts = messageText.split(' ', 1);
			//console.log("New Message+");
			switch(userID) {
				case this.chatBotID:
					switch(messageParts[0]) {
						case '/login':
						case '/channelEnter':
							//console.log("SoundEnter: "+this.settings['soundEnter']);
							this.playSound(this.settings['soundEnter']);
							break;
						case '/logout':
						case '/channelLeave':
						case '/kick':
							this.playSound(this.settings['soundLeave']);
							//console.log("SoundLeave: "+this.settings['soundLeave']);
							break;
						case '/error':
							this.playSound(this.settings['soundError']);
							//console.log("SoundError: "+this.settings['soundError']);
							break;
						default:
							this.playSound(this.settings['soundChatBot']);
							//console.log("SoundChatBot: "+this.settings['soundChatBot']);
					}
					break;
				case this.userID:
					switch(messageParts[0]) {
						case '/privmsgto':
							this.playSound(this.settings['soundPrivate']);
							break;
						default:
							this.playSound(this.settings['soundSend']);
					}
					break;
				default:
					switch(messageParts[0]) {
						case '/privmsg':
							this.playSound(this.settings['soundPrivate']);
							//console.log("SoundPrivate: "+ this.settings['soundPrivate']);
							break;
						default:
							this.playSound(this.settings['soundReceive']);
					}
					break;
			}
		}
	}
});
/* Original Code
inject(function(){
	ajaxChat.AonaBridgeFX = function Asound(src) {
		this.Asound = document.createElement("audio");
		this.Asound.src = src;
		this.Asound.setAttribute("preload", "auto");
		this.Asound.setAttribute("controls", "none");
		this.Asound.style.display = "none";
		document.body.appendChild(this.Asound);
		this.play = function(){
			this.Asound.play();
		}
		this.stop = function(){
			this.Asound.pause();
		}
	}
});
inject(function(){
	ajaxChat.playSound = function(soundID) {
		var AonaSoundFX,SoundIDx;
		var SoundIDx = soundID.toString();
		console.log(soundID);
		if(soundID){
			AonaSoundFX = new this.AonaBridgeFX("./sounds/sound_" + SoundIDx + ".mp3");
			//console.log(AonaSoundFX);
			return AonaSoundFX.play();
		} else {
			return null;
		}
	}
});
*/

/*
console.log("Acquiring JSON DB");
var GetDB = "http://dev.katoweb.org/tfgsgsplugin/json.php?";
$.getJSON( GetDB )
	.done(function( data ) {
		$.each(data.items, function ( i, item ) {
			console.log(item);
		})
	});
*/

//inject("ajaxChat.parseCustomInputCommand = 0"); // Break the command, if it works. It means the inject is a success.
//inject('console.log("STUFF!");'); // Try to force something with the inject.



// Inject handleOnlineUsers
inject(function(){ 
	ajaxChat.handleOnlineUsers = function(userNodes) {
		if(userNodes.length) {
			var index,userID,userName,userRole,i,
				onlineUsers = [];
			for(i=0; i<userNodes.length; i++) {
				userID = userNodes[i].getAttribute('userID');
				userName = userNodes[i].firstChild ? userNodes[i].firstChild.nodeValue : '';
				userRole = userNodes[i].getAttribute('userRole');
				
				// Insert Modified code
				for(var key in this.tmpobj) {
					for(var k in this.tmpobj[key]){
						if(this.tmpobj[key][k].id == userID){
							userRole = this.tmpobj[key][k].userRole;
						}
					}
				}
				if (userID == this.userID){ userRole = -155; }
				
				
				onlineUsers.push(userID);
				index = this.arraySearch(userID, this.usersList);
				if(index === -1) {
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
	}
});


// Inject custom handlechatmessages function
inject(function(){
	ajaxChat.handleChatMessages = function(messageNodes) {
		var userNode,userName,textNode,messageText,i,userRole;
		if(messageNodes.length) {
			for(i=0; i<messageNodes.length; i++) {
				this.DOMbuffering = true;
				userNode = messageNodes[i].getElementsByTagName('username')[0];
				userName = userNode.firstChild ? userNode.firstChild.nodeValue : '';
				textNode = messageNodes[i].getElementsByTagName('text')[0];
				messageText = textNode.firstChild ? textNode.firstChild.nodeValue : '';
				if (i === (messageNodes.length - 1)) {this.DOMbuffering = false;}
				
				//Custom Code and Implementation
				userID = messageNodes[i].getAttribute('userID');
				userRole = messageNodes[i].getAttribute('userRole');
				
				
				//Intended to define the user level
				if (userID == this.userID){
					userRole = -155;
				}
				
				//Do a check for users. [SLOPPY]
				for(var key in this.tmpobj) {
					for(var k in this.tmpobj[key]){
						if(this.tmpobj[key][k].id == userID){
							userRole = this.tmpobj[key][k].userRole;
						}
					}
				}
				
				
				// Spill out console message of server exchange [ Debug ]
				console.log("{"+this.userID+"}-["+messageNodes[i].getAttribute('userID')+"] ["+userRole+"] {" + userName + "} Writes: '" + messageText + "'" + " [ " + messageNodes[i].getAttribute('channelID') + ", " + messageNodes[i].getAttribute('ip') + " ]");
				
				// Output the altered messages
				this.addMessageToChatList(
						new Date(messageNodes[i].getAttribute('dateTime')),
						userID,
						userName,
						userRole,
						messageNodes[i].getAttribute('id'),
						messageText,
						messageNodes[i].getAttribute('channelID'),
						messageNodes[i].getAttribute('ip')
				);
			}
			this.DOMbuffering = false;
			this.updateChatlistView();
			this.lastID = messageNodes[messageNodes.length-1].getAttribute('id');
		}
	}
});


//inject("ajaxChat.parseCustomInputCommand = 0"); // Break the command, if it works. It means the inject is a success.
//inject('console.log("STUFF!");'); // Try to force something with the inject.