// ==UserScript==
// @name GameFAQs Colored Text Renderer
// @description This script translates <red>, <blue>, <gold>, <green>, <mauve>, <salmonpink>, and <orange> tags into GameFAQs friendly HTML tags, and accordingly renders messages into the aforementioned colors. 
// @namespace http://thelolilulelo.wordpress.com/
// @grant GM_addStyle
// @include https://www.gamefaqs.com/boards/*
// @exclude https://www.gamefaqs.com/boards/user.php*
// @exclude https://www.gamefaqs.com/boards/sigquote.php*
// @version 1.2
// @downloadURL https://update.greasyfork.org/scripts/5157/GameFAQs%20Colored%20Text%20Renderer.user.js
// @updateURL https://update.greasyfork.org/scripts/5157/GameFAQs%20Colored%20Text%20Renderer.meta.js
// ==/UserScript==

GM_addStyle ( "                                           \
@font-face {font-family: MadokaRunes; src: url('https://dl.dropboxusercontent.com/u/42167128/MadokaRunes.ttf');}                                             \
" );

GM_addStyle ( "                                           \
@font-face {font-family: ComicSans; src: url('https://dl.dropboxusercontent.com/u/42167128/comic.ttf');}                                             \
" );

GM_addStyle ( "                                           \
@font-face {font-family: Papyrus; src: url('https://dl.dropboxusercontent.com/u/42167128/papyrus.ttf');}                                             \
" );


var CONST = {NEW:'Post Message', PREV:'Preview Message', PREVS:'Preview and Spellcheck Message', EDIT:'Save Changes'};
var BTN_ID = {RED:'btnRed', BLUE:'btnBlue', GOLD:'btnGold', GREEN:'btnGreen', MAUVE:'btnMauve', PINK:'btnPink', ORANGE:'btnOrange', UNDERLINE:'btnUnderline', STRIKEOUT:'btnStrikeout', SMALL:'btnSmall', BIG:'btnBig'};

if (document.getElementsByTagName('textarea').length != 0) {
	document.addEventListener('click', eventListener, true);
	
	btnRed = document.createElement("input"); 
    btnRed.setAttribute("tabindex", "-1")
	btnRed.setAttribute("id", BTN_ID.RED); 
	btnRed.setAttribute("value", "Red"); 
	btnRed.setAttribute("type", "button"); 
	
	btnBlue = document.createElement("input"); 
    btnBlue.setAttribute("tabindex", "-1")
	btnBlue.setAttribute("id", BTN_ID.BLUE); 
	btnBlue.setAttribute("value", "Blue"); 
	btnBlue.setAttribute("type", "button"); 
	
    btnGreen = document.createElement("input");
    btnGreen.setAttribute("tabindex", "-1")
	btnGreen.setAttribute("id", BTN_ID.GREEN); 
	btnGreen.setAttribute("value", "Green"); 
	btnGreen.setAttribute("type", "button"); 
    
    btnGold = document.createElement("input"); 
    btnGold.setAttribute("tabindex", "-1")
	btnGold.setAttribute("id", BTN_ID.GOLD); 
	btnGold.setAttribute("value", "Gold"); 
	btnGold.setAttribute("type", "button"); 
    
    btnMauve = document.createElement("input"); 
    btnMauve.setAttribute("tabindex", "-1")
	btnMauve.setAttribute("id", BTN_ID.MAUVE); 
	btnMauve.setAttribute("value", "Mauve"); 
	btnMauve.setAttribute("type", "button"); 
    
    btnPink = document.createElement("input"); 
    btnPink.setAttribute("tabindex", "-1")
	btnPink.setAttribute("id", BTN_ID.PINK); 
	btnPink.setAttribute("value", "Pink"); 
	btnPink.setAttribute("type", "button"); 
    
    btnOrange = document.createElement("input"); 
    btnOrange.setAttribute("tabindex", "-1")
	btnOrange.setAttribute("id", BTN_ID.ORANGE); 
	btnOrange.setAttribute("value", "Orange"); 
	btnOrange.setAttribute("type", "button"); 
    
    btnUnderline = document.createElement("input"); 
    btnUnderline.setAttribute("tabindex", "-1")
	btnUnderline.setAttribute("id", BTN_ID.UNDERLINE); 
	btnUnderline.setAttribute("value", "Underline"); 
	btnUnderline.setAttribute("type", "button"); 
    
    btnStrikeout = document.createElement("input"); 
    btnStrikeout.setAttribute("tabindex", "-1")
	btnStrikeout.setAttribute("id", BTN_ID.STRIKEOUT); 
	btnStrikeout.setAttribute("value", "Strike"); 
	btnStrikeout.setAttribute("type", "button"); 
    
    btnSmall = document.createElement("input"); 
    btnSmall.setAttribute("tabindex", "-1")
	btnSmall.setAttribute("id", BTN_ID.SMALL); 
	btnSmall.setAttribute("value", "Small"); 
	btnSmall.setAttribute("type", "button"); 
    
    btnBig = document.createElement("input"); 
    btnBig.setAttribute("tabindex", "-1")
	btnBig.setAttribute("id", BTN_ID.BIG); 
	btnBig.setAttribute("value", "Big"); 
	btnBig.setAttribute("type", "button"); 
    
	if (document.getElementsByName('gamefox-quickpost-normal').length != 0) {
		var elemParent = document.getElementsByName('gamefox-quickpost-normal')[0];
		elemParent.insertBefore(btnRed, elemParent.childNodes[0]);
		//elemParent.childNodes[0].appendChild(btnRed);
	} else {
		var elemParent = document.getElementsByTagName('textarea')[0];
		elemParent.parentNode.parentNode.insertBefore(btnRed, elemParent.parentNode);
	}
	
	btnRed.parentNode.insertBefore(btnBlue, btnRed.nextSibling);
    btnBlue.parentNode.insertBefore(btnGreen, btnBlue.nextSibling);
    btnGreen.parentNode.insertBefore(btnMauve, btnGreen.nextSibling);
    btnMauve.parentNode.insertBefore(btnPink, btnMauve.nextSibling);
    btnPink.parentNode.insertBefore(btnGold, btnPink.nextSibling);
    btnGold.parentNode.insertBefore(btnOrange, btnGold.nextSibling);
    btnOrange.parentNode.insertBefore(btnUnderline, btnOrange.nextSibling);
    btnUnderline.parentNode.insertBefore(btnStrikeout, btnUnderline.nextSibling);
    btnStrikeout.parentNode.insertBefore(btnSmall, btnStrikeout.nextSibling);
    btnSmall.parentNode.insertBefore(btnBig, btnSmall.nextSibling);
    btnGold.parentNode.insertBefore(btnOrange, btnGold.nextSibling);
    btnBig.appendChild(document.createElement("br"));
}

renderColors();

function eventListener(event) {
	var elemVal = event.target.value;
	if (elemVal == CONST.NEW || elemVal == CONST.PREV || elemVal == CONST.PREVS || elemVal == CONST.EDIT) {
		var text = document.getElementsByTagName('textarea')[0].value;
		//red
        text = text.replace(/<red>/gi, '<i><b><b><code></code></b></b></i>').replace(/<\/font>/gi, '<code><i><code></code></i></code>');
		//blue
		text = text.replace(/<blue>/gi, '<b><b><b><code></code></b></b></b>');
		//gold
		text = text.replace(/<gold>/gi, '<b><b><i><code></code></i></b></b>');
		//green
		text = text.replace(/<green>/gi, '<b><i><i><code></code></i></i></b>');
		//mauve
		text = text.replace(/<mauve>/gi, '<i><i><b><code></code></b></i></i>');
        //salmonpink
        text = text.replace(/<salmonpink>/gi, '<i><i><i><code></code></i></i></i>');
        //orange
		text = text.replace(/<orange>/gi, '<b><code><i><i><code></code></i></i></code></b>');
        //contract
        text = text.replace(/<contract>/gi, '<i><code><i><i><code></code></i></i></code></i>');
        //AOEKnight
        text = text.replace(/<aoeknight>/gi, '<code><b><i></i></b></code>');
        //rennyf1
        text = text.replace(/<rennyf1>/gi, '<b><i><\/i><\/b>');
        //yaranaika
        text = text.replace(/<yaranaika>/gi, '<i><b><\/b><\/i>');
        //conwayshrug
        text = text.replace(/<conwayshrug>/gi, '<code><b><\/b><\/code>');
        //conwayfacepalm
        text = text.replace(/<conwayfacepalm>/gi, '<b><code><b><\/b><\/code><\/b>');
        //papyrus font
        text = text.replace(/<papyrusfont>/gi, '<b><code><i><\/i><\/code><\/b>');
        //papyrus emote
        text = text.replace(/<papyrus>/gi, '<i><code><b><\/b><\/code><\/i>');
        //sans emote
        text = text.replace(/<sans>/gi, '<i><code><i><\/i><\/code><\/i>');
        //tobdog
        text = text.replace(/<tobdog>/gi, '<code><b><b><\/b><\/b><\/code>');
        //happycrank
        text = text.replace(/<happycrank>/gi, '<code><i><b><\/b><\/i><\/code>');
        //Comic Sans MS
        text = text.replace(/<comicsans>/gi, '   <b><code><b><i><code></code></i></b></code></b>');
        //Marquee
        text = text.replace(/<marquee>/gi, '<code><code><b><code></code></b></code></code>').replace(/<\/marquee>/gi, '<code><code><code><b><i><code></code></i></b></code></code></code>');
        //Underline
        text = text.replace(/<u>/gi, '<code><code><i><code></code></i></code></code>').replace(/<\/u>/gi, '<code><code><code><b><code></code></b></code></code></code>');
        //Strikeout
        text = text.replace(/<strike>/gi, '<i><code><i><b><code></code></b></i></code></i>').replace(/<\/strike>/gi, '<code><code><code><i><code></code></i></code></code></code>');
        //Small Font
        text = text.replace(/<small>/gi, '<i><code><b><b><code></code></b></b></code></i>');
        //Big Font
        text = text.replace(/<big>/gi, '<b><code><b><b><code></code></b></b></code></b>');
        //DINOSAUR
        text = text.replace(/<dinosaur>/gi, '<b><code><i><b><code></code></b></i></code></b>');
        //EDIT Comic Sans MS
        text = text.replace(/<b><code><b><i><\/i><\/b><\/code><\/b>/gi, '<b><code><b><i><code></code></i></b></code></b>');
        //EDIT Red
        text = text.replace(/<i><b><b><\/b><\/b><\/i>/gi, '<i><b><b><code></code></b></b></i>');
        //EDIT Blue
        text = text.replace(/<b><b><b><\/b><\/b><\/b>/gi, '<b><b><b><code></code></b></b></b>');
        //EDIT Gold
        text = text.replace(/<b><b><i><\/i><\/b><\/b>/gi, '<b><b><i><code></code></i></b></b>');
        //EDIT Green
        text = text.replace(/<b><i><i><\/i><\/i><\/b>/gi, '<b><i><i><code></code></i></i></b>');
        //EDIT Mauve
        text = text.replace(/<i><i><b><\/b><\/i><\/i>/gi, '<i><i><b><code></code></b></i></i>');
        //EDIT Salmon Pink
        text = text.replace(/<i><i><i><\/i><\/i><\/i>/gi, '<i><i><i><code></code></i></i></i>');
        //EDIT Orange
        text = text.replace(/<b><code><i><i><\/i><\/i><\/code><\/b>/gi, '<b><code><i><i><code></code></i></i></code></b>');
        //EDIT Madoka Font
        text = text.replace(/<i><code><i><i><\/i><\/i><\/code><\/i>/gi, '<i><code><i><i><code></code></i></i></code></i>').replace(/<code><i><\/i><\/code>/gi, '<code><i><code></code></i></code>');
        //EDIT AOEKnight
        text = text.replace(/<code><b><i><\/i><\/b><\/code>/gi, '<code><b><i><code></code></i></b></code>');
        //EDIT rennyf1
        text = text.replace(/<b><i><\/i><\/b>/gi, '<b><i><code></code></i></b>');
        //EDIT yaranaika
        text = text.replace(/<i><b><\/b><\/i>/gi, '<i><b><code></code></b></i>');
        //EDIT conwayshrug
        text = text.replace(/<code><b><\/b><\/code>/gi, '<code><b><code></code></b></code>');
        //EDIT conwayfacepalm
        text = text.replace(/<b><code><b><\/b><\/code><\/b>/gi, '<b><code><b><code></code></b></code></b>');
        //EDIT mute
        text = text.replace(/<b><code><i><\/i><\/code><\/b>/gi, '<b><code><i><code></code></i></code></b>');
        //EDIT surprise
        text = text.replace(/<i><code><b><\/b><\/code><\/i>/gi, '<i><code><b><code></code></b></code></i>');
        //EDIT questionmark
        text = text.replace(/<i><code><i><\/i><\/code><\/i>/gi, '<i><code><i><code></code></i></code></i>');
        //EDIT gokigen
        text = text.replace(/<code><b><b><\/b><\/b><\/code>/gi, '<code><b><b><code></code></b></b></code>');
        //EDIT happycrank
        text = text.replace(/<code><i><b><\/b><\/i><\/code>/gi, '<code><i><b><code></code></b></i></code>');
        //EDIT Marquee
        text = text.replace(/<code><code><b><\/b><\/code><\/code>/gi, '<code><code><b><code></code></b></code></code>').replace(/<code><code><code><b><i><\/i><\/b><\/code><\/code><\/code>/gi, '<code><code><code><b><i><code></code></i></b></code></code></code>');
        //EDIT Underline
        text = text.replace(/<code><code><i><\/i><\/code><\/code>/gi, '<code><code><i><code></code></i></code></code>').replace(/<code><code><code><b><\/b><\/code><\/code><\/code>/gi, '<code><code><code><b><code></code></b></code></code></code>');
        //EDIT Strikeout
        text = text.replace(/<i><code><i><b><\/b><\/i><\/code><\/i>/gi, '<i><code><i><b><code></code></b></i></code></i>').replace(/<code><code><code><i><\/i><\/code><\/code><\/code>/gi, '<code><code><code><i><code></code></i></code></code></code>');
        //EDIT Small Font
        text = text.replace(/<i><code><b><b><\/b><\/b><\/code><\/i>/gi, '<i><code><b><b><code></code></b></b></code></i>');
        //EDIT Big Font
        text = text.replace(/<b><code><b><b><\/b><\/b><\/code><\/b>/gi, '<b><code><b><b><code></code></b></b></code></b>');
        //EDIT DINOSAUR
        text = text.replace(/<b><code><i><b><\/b><\/i><\/code><\/b>/gi, '<b><code><i><b><code></code></b></i></code></b>');

			
		document.getElementsByTagName('textarea')[0].value = text;
	} else {
		var elemId = event.target.id;
		var obj = document.getElementsByTagName('textarea')[0];
		if (elemId == BTN_ID.RED) {	
			insertAtCaret(obj, '<red>', '</font>');
		} else if (elemId == BTN_ID.BLUE) {
			insertAtCaret(obj, '<blue>', '</font>');
		} else if (elemId == BTN_ID.GOLD) {
			insertAtCaret(obj, '<gold>', '</font>');
        } else if (elemId == BTN_ID.MAUVE) {
			insertAtCaret(obj, '<mauve>', '</font>');
        } else if (elemId == BTN_ID.PINK) {
			insertAtCaret(obj, '<salmonpink>', '</font>');
        } else if (elemId == BTN_ID.ORANGE) {
			insertAtCaret(obj, '<orange>', '</font>');
		} else if (elemId == BTN_ID.GREEN) {
			insertAtCaret(obj, '<green>', '</font>');
        } else if (elemId == BTN_ID.UNDERLINE) {
			insertAtCaret(obj, '<u>', '</u>');
        } else if (elemId == BTN_ID.STRIKEOUT) {
			insertAtCaret(obj, '<strike>', '</strike>');
        } else if (elemId == BTN_ID.SMALL) {
			insertAtCaret(obj, '<small>', '</font>');
        } else if (elemId == BTN_ID.BIG) {
			insertAtCaret(obj, '<big>', '</font>');    
		}
	}
}

function insertAtCaret(obj, tagOpen, tagClose) {
	if (obj.selectionStart) {
		obj.focus();
		var start = obj.selectionStart;
		var end   = obj.selectionEnd;
		obj.value = obj.value.substr(0, start).concat(tagOpen).concat(obj.value.substr(start, end - start)).concat(tagClose).concat(obj.value.substr(end));
	}

	if (start != null) {
		setCaretTo(obj, start + tagOpen.length);
	} else {
		//obj.value += text;
	}
}

function setCaretTo(obj, pos) {
	if(obj.createTextRange) {
		var range = obj.createTextRange();
		range.move('character', pos);
		range.select();
	} else if(obj.selectionStart) {
		obj.focus();
		obj.setSelectionRange(pos, pos);
	}
}

function renderColors() {
	var msg = document.getElementsByClassName('msg_body');
	if (msg.length != 0) {
		var i = 0;
		for (i = 0; i < msg.length; i++) {
         
            //Comic Sans
            msg[i].innerHTML = msg[i].innerHTML.replace(/<b><code><b><i><\/i><\/b><\/code><\/b>/gi, "<font face=ComicSans>");
            
            //Dinosaur
            msg[i].innerHTML = msg[i].innerHTML.replace(/<b><code><i><b><\/b><\/i><\/code><\/b>/gi, "<img src=http://i.imgur.com/56TCBmn.gif>");
            
            //Big Font
            msg[i].innerHTML = msg[i].innerHTML.replace(/<b><code><b><b><\/b><\/b><\/code><\/b>/gi, "<font size=5>");
            
            //Small Font
            msg[i].innerHTML = msg[i].innerHTML.replace(/<i><code><b><b><\/b><\/b><\/code><\/i>/gi, "<font size=1>");
            
            //Strikeout
            msg[i].innerHTML = msg[i].innerHTML.replace(/<i><code><i><b><\/b><\/i><\/code><\/i>/gi, "<strike>").replace(/<code><code><code><i><\/i><\/code><\/code><\/code>/gi, '</strike>');
            
            //Underline
            msg[i].innerHTML = msg[i].innerHTML.replace(/<code><code><i><\/i><\/code><\/code>/gi, "<u>").replace(/<code><code><code><b><\/b><\/code><\/code><\/code>/gi, '</u>');
            
            //Marquee
            msg[i].innerHTML = msg[i].innerHTML.replace(/<code><code><b><\/b><\/code><\/code>/gi, "<marquee>").replace(/<code><code><code><b><i><\/i><\/b><\/code><\/code><\/code>/gi, '</marquee>');

            //Madoka Font
            msg[i].innerHTML = msg[i].innerHTML.replace(/<i><code><i><i><\/i><\/i><\/code><\/i>/gi, "<font face=MadokaRunes>");
            
            //Orange
            msg[i].innerHTML = msg[i].innerHTML.replace(/<b><code><i><i><\/i><\/i><\/code><\/b>/gi, "<font color=#FFA500><b>");
            
            //Salmon Pink 
            msg[i].innerHTML = msg[i].innerHTML.replace(/<i><i><i><\/i><\/i><\/i>/gi, "<font color=#FF9999><b>");
            
            //Mauve 
            msg[i].innerHTML = msg[i].innerHTML.replace(/<i><i><b><\/b><\/i><\/i>/gi, "<font color=#925f6e><b>");
            
            //Red
            msg[i].innerHTML = msg[i].innerHTML.replace(/<i><b><b><\/b><\/b><\/i>/gi, "<font color=#F00><b>");
            
            //Blue
            msg[i].innerHTML = msg[i].innerHTML.replace(/<b><b><b><\/b><\/b><\/b>/gi, "<font color=#00F><b>");
            
            //Gold
            msg[i].innerHTML = msg[i].innerHTML.replace(/<b><b><i><\/i><\/b><\/b>/gi, "<font color=#FC0><b>");
            
            //happycrank
            msg[i].innerHTML = msg[i].innerHTML.replace(/<code><i><b><\/b><\/i><\/code>/gi, "<img src=http://cdn.steamcommunity.com//economy/emoticon/:happycrank:>");
            
            //AOEKnight
            msg[i].innerHTML = msg[i].innerHTML.replace(/<code><b><i><\/i><\/b><\/code>/gi, "<img src=http://cdn.steamcommunity.com//economy/emoticon/:AOEKnight:>");

            //tobdog
            msg[i].innerHTML = msg[i].innerHTML.replace(/<code><b><b><\/b><\/b><\/code>/gi, "<img src=http://i.imgur.com/ZahAUP4.png>");
            
            //sans emote
            msg[i].innerHTML = msg[i].innerHTML.replace(/<i><code><i><\/i><\/code><\/i>/gi, "<img src=http://i.imgur.com/Tswhynu.png>");
            
            //papyrus emote
            msg[i].innerHTML = msg[i].innerHTML.replace(/<i><code><b><\/b><\/code><\/i>/gi, "<img src=http://i.imgur.com/jKh8pPC.png>");
            
            //papyrus font
            msg[i].innerHTML = msg[i].innerHTML.replace(/<b><code><i><\/i><\/code><\/b>/gi, "<font face=Papyrus>");
            
            //conwayfacepalm
            msg[i].innerHTML = msg[i].innerHTML.replace(/<b><code><b><\/b><\/code><\/b>/gi, "<img src=http://cdn.steamcommunity.com//economy/emoticon/:conwayfacepalm:>");
            
            //conwayshrug
            msg[i].innerHTML = msg[i].innerHTML.replace(/<code><b><\/b><\/code>/gi, "<img src=http://cdn.steamcommunity.com//economy/emoticon/:conwayshrug:>");
            
            //yaranaika
            msg[i].innerHTML = msg[i].innerHTML.replace(/<i><b><\/b><\/i>/gi, "<img src=http://cdn.steamcommunity.com//economy/emoticon/:yaranaika:>");
            
            //rennyf1
            msg[i].innerHTML = msg[i].innerHTML.replace(/<b><i><\/i><\/b>/gi, "<img src=http://cdn.steamcommunity.com//economy/emoticon/:rennyf1:>");
                        
            //Green
            msg[i].innerHTML = msg[i].innerHTML.replace(/<b><i><i><\/i><\/i><\/b>/gi, "<font color=#6C0><b>").replace(/<code><i><\/i><\/code>/gi, '</b></font>');
            
		}
	}
}