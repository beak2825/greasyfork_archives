// ==UserScript==
// @name         Haxball Avatar Change
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sexy script for haxball
// @author       Of course from alpha the grey goat
// @match        https://www.haxball.com/play
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/412683/Haxball%20Avatar%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/412683/Haxball%20Avatar%20Change.meta.js
// ==/UserScript==

(function() {
    'use strict';

/// Haxball quick script for avatars, texts, spams. by alpha ///
/// For using this script, append the script into console log while haxball is on browser. ///
/// I recommend that backup this script for using again, if you lose it! ///

/////////////////****  CONFUGIRATIONS ****/////////////////
/////////////////****  CONFUGIRATIONS ****/////////////////
/////////////////****  CONFUGIRATIONS ****/////////////////

// You can configure avatars, keys to change modes

/// Default Avatar ///
// This is your default avatar. Your avatar returns default avatar 0.5(500ms) seconds after you use avatar keys. You can
// deactivate this by changing 'defAvatarActive' variable to false and you can set the delay of default avatar by miliseconds
// 1000ms = 1 second. 500ms = 0.5 second
// defAvatarMaxDelay is maximum delay time, when you increase delay if it passes maximum value it returns 250 miliseconds as delay;
// defAvatarDelayIncreasement is when you press the increasement key, it adds miliseconds increasement of your entered value

let defAvatar = "😄";
let defAvatarActive = true;
let defAvatarDelay = 500;
let defAvatarMaxDelay = 3000;
let defAvatarDelayIncreasement = 250;

/// You can store your emojis below here and copy paste it.
//😄🐐

/// Mode changing keys ///
// I added second key to change because when Caps Lock is active. If you have case-sentetive keys, you should use second config
// e.g. first key is 'g' second key is 'G'
// <<<EMPTY>>> means not used.

// When you want to return your default avatar above after pressing avatar keys
let defAvatarActiveKey1 = 'ş';
let defAvatarActiveKey2 = 'Ş';

// Key for changing main mode [Avatar, Text, Chat Spam, Avatar Spam]
let changeMainMode1 = 'Shift';
let changeMainMode2 = '<<<EMPTY>>>';

// Key for changing Avatar Slot [a1, a2, a3, a4]
let changeAvatarMode1 = ',';
let changeAvatarMode2 = '<<<EMPTY>>>';

// Key for changing Text Slot [t1, t2, t3, t4]
let changeTextMode1 = 'ü';
let changeTextMode2 = 'Ü';

// Key for changing Chat Spam Slot // IN CONSTRUCTION
let changeChatSpamMode1 = 'i';
let changeChatSpamMode2 = 'İ';

// Key for changing Avatar Spam Slot // IN CONSTRUCTION
let changeAvatarSpamMode1 = 'ç';
let changeAvatarSpamMode2 = 'Ç';

// Key for increasing default avatar delay;

let avatarReturnDelayIncreasement1 = '.';
let avatarReturnDelayIncreasement2 = '<<<EMPTY>>>';

// Key for changing default avatar in-game;

let defaultAvatarChangeKey1 = 'ç';
let defaultAvatarChangeKey2 = 'Ç';


/// Keys
// You can set the keys up from here to change avatar, type text and so on.
// These keys are important for using features of the script.
// For example key4 belongs to both configAvatar4 and configText4 below in confugiring avatars and texts.
// If you press key4 whereas a2(avatar slot #2) is activated, you select avatar of configAvatar4 and its second column.

let key1_1 = 'x'
let key1_2 = 'X'

let key2_1 = 'z'
let key2_2 = 'Z'

let key3_1 = 'c'
let key3_2 = 'C'

let key4_1 = 'w'
let key4_2 = 'W'

let key5_1 = 'a'
let key5_2 = 'A'

let key6_1 = 's'
let key6_2 = 'S'

let key7_1 = 'd'
let key7_2 = 'D'

let key8_1 = 'v'
let key8_2 = 'V'

let key9_1 = 'f'
let key9_2 = 'F'

/// Avatar Configuration ///
// You can change the avatar configurations from here. '[key]Button' variables represents the key
// and columns represents the inline mode(a1,a2,a3,a4). If you choose a1 mode, it will be avatar
// of first column of the depending key. a2 is second column from configurations below blah blah.
// e.g configAvatar4 variables fourth column is set to 👈 avatar. You can get this avatar when your a4 mode is active and press key4.
// You can keep them empty, if you wanna deactivate keys.
// e.g. First key of your config is set to 'x' 'X' key which is used for shooting. You don't want to change your avatar when shooting.

                     //a1  //a2  //a3 //a4
let configAvatar1 = ['👊🏿', '😝', 'a', '🐐'];

let configAvatar2 = ['🖕🏿', '😢', 'xD', '👑'];

let configAvatar3 = ['🍆', '😍', 'EZ', '🔥'];

let configAvatar4 = ['💩', '😎', ':D', '👆🏿'];

let configAvatar5 = ['🤡', '🥳', ':)','👈🏿'];

let configAvatar6 = ['👋🏿', '🤬', ':x','👇🏿'];

let configAvatar7 = ['❄️', '🤣', ':B','👉🏿'];

let configAvatar8 = ['👶🏻', '🤫', ':c','🤛🏿'];

let configAvatar9 = ['👄', '😴', ':@','🤜🏿'];

/// Text Configuration ///
// Same with avatar config by text mode.
// If you don't want to type anything, you must keep them empty.
// e.g. First key of your config is set to 'x' 'X' key which is used for shooting. You don't want to type anything when you press.

let configText1 = [
	"", // First column
	"", // Second column
	"", // Third column
	""  // Fourth column
];

let configText2 = [
	"Goooooooooooooooaaaalllll!!!",
	"",
	"",
	""
];

let configText3 = [
	"Pass!!!",
	"",
	"",
	""
];

let configText4 = [
	"Cmoonnn!!!",
	"",
	"",
	""
];

let configText5 = [
	"Nice Goal!!!",
	"",
	"",
	""
];

let configText6 = [
	"",
	"",
	"",
	""
];

let configText7 = [
	"",
	"",
	"",
	""
];

let configText8 = [
	"",
	"",
	"",
	""
];

let configText9 = [
	"",
	"",
	"",
	""
];

//////////////////
/// DEBUG MODE ///
//////////////////
// If you wanna see which key do you press via console, you should make this true
// This is useful when you wanna see which key do you wanna change modes with.
let debugModeActive = false;

//////////////**** CONFUGIRATION ENDS ****/////////////
//////////////**** CONFUGIRATION ENDS ****/////////////
//////////////**** CONFUGIRATION ENDS ****/////////////

let inputHax = null; //document.querySelector('.input input');
let buttonHax = null; //document.querySelector('.input button');

const modes = ['a', 't', "c", "s"];
let mode = modes[0];

const avatarModes = ["a1", "a2", "a3", "a4"];
const textModes = ["t1", "t2", "t3", "t4"];
const chatSpamModes = ["c1", "c2", "c3", "c4"];
const avatarSpamModes = ["s1", "s2", "s3", "s4"];

let avatarMode = avatarModes[0];
let textMode = textModes[0];
let chatSpamMode = chatSpamModes[0];
let avatarSpamMode = avatarSpamModes[0];
let lastAvatar = defAvatar;

let avatarPressed = 0;

let modeScreen = document.createElement('p');
let text = document.createTextNode('mode: ' + mode);
modeScreen.appendChild(text);
let body = document.querySelector('body');
body.prepend(modeScreen);
modeScreen.setAttribute('style', `position: fixed; right: 10%; bottom: 0%; color: white; background-color: rgba(0,0,255,0.44); font-size: 1.3rem; z-index: 9999999`);

let frameObj = document.querySelector('iframe.gameframe');
let frameWin = null;
let frameDoc = null;
if(frameObj != null)
{
	frameWin = frameObj.contentWindow;
}

if(frameWin == null)
{
	setInterval(function(){
		inputHax = document.querySelector('.input input');
		buttonHax = document.querySelector('.input button');
		console.log('Input Element Has Been Changed!')
	}, 2000)

	document.addEventListener('keydown', function(){
		press(event.key);
		debugMode(event.key);
	});
}
else
{
	frameDoc = frameWin.document;

	setInterval(function(){
		inputHax = frameDoc.querySelector('.input input');
		buttonHax = frameDoc.querySelector('.input button');
		frameDoc = frameWin.document;
		console.log('Input Element Has Been Changed!')
	}, 2000)

	frameWin.addEventListener('keydown', function(){
		press(event.key);
		debugMode(event.key);
	});
}

let displayMode = function(){

	let modeDisplay = null;

	switch(mode)
	{
		case modes[0]:
			modeDisplay = avatarMode;
		break;
		case modes[1]:
			modeDisplay = textMode;
		break;
		case modes[2]:
			modeDisplay = chatSpamMode;
		break;
		case modes[3]:
			modeDisplay = avatarSpamMode;
		break;
	}

	modeScreen.innerHTML = 'M: ' + modeDisplay + ' | Def Avt: ' + defAvatarActive + ' | Def Dly: ' + defAvatarDelay + ' | Def: ' + defAvatar;
}

let chatize = function(key)
{
	return '/avatar ' + key;
}

let changeAvatar = function(key)
{
	inputHax.value = chatize(key);
	buttonHax.click();
	lastAvatar = key;
	removeAvatarSet();
	if(defAvatarActive){
		returnDefAvatar();
	}
}

let press = function(key)
{
	if(key == defaultAvatarChangeKey1 || key == defaultAvatarChangeKey2)
	{
		defAvatar = lastAvatar;
		displayMode();
	}

	if(key == avatarReturnDelayIncreasement1 || key == avatarReturnDelayIncreasement2)
	{
		defAvatarDelay += defAvatarDelayIncreasement;
		if(defAvatarDelay > defAvatarMaxDelay)
		{
			defAvatarDelay = 250;
		}
		displayMode();
	}

	if(key == defAvatarActiveKey1 || key == defAvatarActiveKey2)
	{
		if(defAvatarActive)
		{
			defAvatarActive = false;
		}
		else
		{
			defAvatarActive = true;
		}
		displayMode();
	}

	if(key == changeMainMode1 || key == changeMainMode2)
	{
		let modesLen = modes.length;
		let modeIndex = modes.indexOf(mode);

		if(modeIndex < modesLen - 1)
		{
			mode = modes[modeIndex + 1];
			displayMode();
		}
		else
		{
			mode = modes[0];
			displayMode();
		}
	}

	if(key == changeAvatarMode1 || key == changeAvatarMode2)
	{
		let modesLen = avatarModes.length;
		let modeIndex = avatarModes.indexOf(avatarMode);

		if(modeIndex < modesLen - 1)
		{
			avatarMode = avatarModes[modeIndex + 1];
			displayMode();
		}
		else
		{
			avatarMode = avatarModes[0];
			displayMode();
		}
	}

	if(key == changeTextMode1 || key == changeTextMode2)
	{
		let modesLen = textModes.length;
		let modeIndex = textModes.indexOf(textMode);

		if(modeIndex < modesLen - 1)
		{
			textMode = textModes[modeIndex + 1];
			displayMode();
		}
		else
		{
			textMode = textModes[0];
			displayMode();
		}
	}

	if(key == changeChatSpamMode1 || key == changeChatSpamMode2)
	{
		let modesLen = chatSpamModes.length;
		let modeIndex = chatSpamModes.indexOf(chatSpamMode);

		if(modeIndex < modesLen - 1)
		{
			chatSpamMode = chatSpamModes[modeIndex + 1];
			displayMode();
		}
		else
		{
			chatSpamMode = chatSpamModes[0];
			displayMode();
		}
	}

	if(key == changeAvatarSpamMode1 || key == changeAvatarSpamMode2)
	{
		let modesLen = avatarSpamModes.length;
		let modeIndex = avatarSpamModes.indexOf(avatarSpamMode);

		if(modeIndex < modesLen - 1)
		{
			avatarSpamMode = avatarSpamModes[modeIndex + 1];
			displayMode();
		}
		else
		{
			avatarSpamMode = avatarSpamModes[0];
			displayMode();
		}
	}

	if(mode == 'a')
	{
		switch(key)
		{
			case key1_1:
			case key1_2:
				changeAvatar(configAvatar1[avatarModes.indexOf(avatarMode)]);
			break;
			case key2_1:
			case key2_2:
				changeAvatar(configAvatar2[avatarModes.indexOf(avatarMode)]);
			break;
			case key3_1:
			case key3_2:
				changeAvatar(configAvatar3[avatarModes.indexOf(avatarMode)]);
			break;
			case key4_1:
			case key4_2:
				changeAvatar(configAvatar4[avatarModes.indexOf(avatarMode)]);
			break;
			case key5_1:
			case key5_2:
				changeAvatar(configAvatar5[avatarModes.indexOf(avatarMode)]);
			break;
			case key6_1:
			case key6_2:
				changeAvatar(configAvatar6[avatarModes.indexOf(avatarMode)]);
			break;
			case key7_1:
			case key7_2:
				changeAvatar(configAvatar7[avatarModes.indexOf(avatarMode)]);
			break;
			case key8_1:
			case key8_2:
				changeAvatar(configAvatar8[avatarModes.indexOf(avatarMode)]);
			break;
			case key9_1:
			case key9_2:
				changeAvatar(configAvatar9[avatarModes.indexOf(avatarMode)]);
			break;
		}
	}

	if(mode == 't'){
		switch(key)
		{
			case key1_1:
			case key1_2:
				inputHax.value = configText1[textModes.indexOf(textMode)];
				buttonHax.click();
			break;
			case key2_1:
			case key2_2:
				inputHax.value = configText2[textModes.indexOf(textMode)];
				buttonHax.click();
			break;
			case key3_1:
			case key3_2:
				inputHax.value = configText3[textModes.indexOf(textMode)];
				buttonHax.click();
			break;
			case key4_1:
			case key4_2:
				inputHax.value = configText4[textModes.indexOf(textMode)];
				buttonHax.click();
			break;
			case key5_1:
			case key5_2:
				inputHax.value = configText5[textModes.indexOf(textMode)];
				buttonHax.click();
			break;
			case key6_1:
			case key6_2:
				inputHax.value = configText6[textModes.indexOf(textMode)];
				buttonHax.click();
			break;
			case key7_1:
			case key7_2:
				inputHax.value = configText7[textModes.indexOf(textMode)];
				buttonHax.click();
			break;
			case key8_1:
			case key8_2:
				inputHax.value = configText8[textModes.indexOf(textMode)];
				buttonHax.click();
			break;
			case key9_1:
			case key9_2:
				inputHax.value = configText9[textModes.indexOf(textMode)];
				buttonHax.click();
			break;
		}
	}

	removeAvatarSet();
}

let sleep = function(delay)
{
	return new Promise(resolve => setTimeout(resolve, delay));
}

let returnDefAvatar = async function()
{
	avatarPressed++;
	await sleep(defAvatarDelay);
	avatarPressed--;
	if(avatarPressed == 0)
	{
		inputHax.value = '/avatar ' + defAvatar;
		buttonHax.click();
		removeAvatarSet();
	}
}

let removeAvatarSet = function()
{
	unsafeWindow.noticeList = frameDoc.querySelectorAll('div.log p.notice');
	for(let i = 0; i < unsafeWindow.noticeList.length; i++)
	{
		if(unsafeWindow.noticeList[i].innerText == 'Avatar set')
		{
			unsafeWindow.noticeList[i].parentNode.removeChild(unsafeWindow.noticeList[i]);
		}
	}
}

let debugMode = function(key)
{
	if(debugModeActive)
	{
		console.log(key);
	}
}

displayMode();
})();