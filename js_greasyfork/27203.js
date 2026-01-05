// ==UserScript==
// @name         Insert Skins!
// @namespace    http://tampermonkey.net/
// @version      1
// @description  A Toradorable skin changer supporting multiple animations and variable image display times. Includes a UI. To use, press "C" in game to cycle between different animations.

// @author       Toradorable/Double
// @match        http://agar-network.com/*
// @match        http://alis.io
// @match        http://dual-agar.online
// @grant        none
// @require      https://greasyfork.org/scripts/24894-toradorable-animator/code/Toradorable%20Animator.js?version=158248
// @require      https://greasyfork.org/scripts/24901-iwubbz-s-candy-animation-for-toradorable-skin-changer/code/iWubbz's%20Candy%20Animation%20for%20Toradorable%20Skin%20Changer.js
// @require 		https://greasyfork.org/scripts/27202-agar-network/code/Agar-Network.user.js
// @downloadURL https://update.greasyfork.org/scripts/27203/Insert%20Skins%21.user.js
// @updateURL https://update.greasyfork.org/scripts/27203/Insert%20Skins%21.meta.js
// ==/UserScript==
setTimeout(function(){

animator.site.updateFrame= function(nick=animator.currentFrameNick(), skin=animator.currentFrameSkin(), time=animator.currentFrameDisplayTime(), displaylocal=true) {
			    //this.elements.skinurl.value = skin;
			    setNick(nick,document.getElementById('team_name').value,skin,$('.partyToken').val());
};
animator.init();
animator.site.elements.skinurl=document.getElementById('skin_url');
animator.site.elements.cssElement=document.getElementById('lb_detail');
animator.site.initilaizeUI();
animator.site.elements.animationSelector.style.height="30px";
animator.site.elements.animationSelector.style.opacity=0.5;
animator.site.elements.speedMultiplierBox.style.height="30px";
animator.site.elements.speedMultiplierBox.style.opacity=0.5;
animator.site.elements.incrementSpeedMuliplier.style.height="30px";
animator.site.elements.decrementSpeedMuliplier.style.height="30px";
animator.site.elements.animationStatus.style.height="30px";
window.animator=animator;
/*
 * Setup Custome Web Elements
 */



/*
var overlays2=document.getElementById("overlays2");
var mipmapNode = document.getElementById("mipmapNode");
var chatboxInput=document.getElementById("input_box2");
var StealSkinBox = chatboxInput.cloneNode(true);
StealSkinBox.name="Steal Skin From:";
StealSkinBox.id="StealSkinElm";
StealSkinBox.value="";
StealSkinBox.placeholder="Steal Skin From:";
StealSkinBox.style.cssText = document.defaultView.getComputedStyle(chatboxInput, "").cssText;
StealSkinBox.style.width="200px";
StealSkinBox.style.right="9px";
StealSkinBox.style.bottom="218px";
StealSkinBox.style.position="absolute";
var SkinTargetType = StealSkinBox.cloneNode(true);
SkinTargetType.name="Skin Target Type:";
SkinTargetType.id="SkinTargetType";
SkinTargetType.value="Theft"; // Theft, Swap, Push
SkinTargetType.placeholder="Skin Target Type:";
SkinTargetType.style.cssText = document.defaultView.getComputedStyle(chatboxInput, "").cssText;
SkinTargetType.style.width="200px";
SkinTargetType.style.right="9px";
SkinTargetType.style.bottom="258px";
SkinTargetType.style.position="absolute";
overlays2.insertBefore(SkinTargetType, overlays2.lastChild);
overlays2.insertBefore(StealSkinBox, overlays2.lastChild);
var LieAs = chatboxInput.cloneNode(true);
LieAs.name="LieAs";
LieAs.id="LieAsElm";
LieAs.value="";
LieAs.placeholder="Not Lying";
LieAs.style.cssText = document.defaultView.getComputedStyle(chatboxInput, "").cssText;
//LieAs.
var chatAreaElem=document.getElementById("chatboxArea2");
chatAreaElem.insertBefore(LieAs, chatAreaElem.firstChild);

*/






/*
 * Setup Hotkeys
 */
/*
var hotKeyTable = document.getElementById("hotkey_table");
var hotkeyMappingREV={};
var tmphotkeyMapping=JSON.parse(getLocalStorage("hotkeyMapping"));
for (var prop in tmphotkeyMapping) {
	hotkeyMappingREV[tmphotkeyMapping[prop]]=prop;
}




function AddHotKey(hk) {
	var hkdefault = {
	    id: "hk_change_my_hotkey_id",
	    defaultHotkey: "",
	    key: null,
	    description: "Change My Description",
	    keyDown: null,
	    keyUp: null,
	    type: "NORMAL"
	};
	hk = Object.assign(hkdefault,hk);
	if (! hk.key || hk.key === null) hk.key = hotkeyMappingREV[hk.id];
	if (! hk.key || hk.key === null) hk.key = hk.defaultHotkey;
	var hk_element = hotKeyTable.lastChild.cloneNode(true);
	hk_element.children[0].dataset.hotkeyid = hk.id;
	hk_element.children[0].innerHTML=hk.key;
	hk_element.children[1].innerHTML=hk.description;
	hk_element.children[2].innerHTML="/";
	console.log("Adding Hotkey: " + hk);
	hotKeyTable.appendChild(hk_element);
	
	hotkeyConfig[hk.id]= {
	    defaultHotkey: hk.defaultHotkey,
	    name: hk.description,
	    keyDown: hk.keyDown,
	    type: hk.type
	};
	hotkeyMapping[hk.key] = hk.id;
	return hk_element;
}
chatRoom.doTellLie=false;
var hk_TellLie = AddHotKey({
id: "hk_TellLie",
defaultHotkey: "CTRL_ENTER",
description: "Open Chatbox and send message as another player",
keyDown: function() {
    if (chatRoom["isFocus"]()) {
        TellLie($("#input_box2")["val"]());
        $("#input_box2")["val"]("");
        $("#input_box2")["blur"]();
        $("#chatboxArea2")["hide"]();
    } else {
        chatRoom["focus"]();
    }
}
});




var hk_StealNearbySkin = AddHotKey({
id: "hk_StealNearbySkin",
defaultHotkey: "N",
description: "Grab Skin of Nearby Player",
keyDown: function() {
    var playerId = GetNearestSkinnedCellId();
    if (playerId) StealSkinBox.value="#" + GetNearestSkinnedCellId();
    else StealSkinBox.value="";
}
});




var hk_StealNearbyName = AddHotKey({
id: "hk_StealNearbyName",
defaultHotkey: "",
description: "Grab Name of Nearby Player",
keyDown: function() {
    LieAs.value=GetNearestCell()[1];
}
});




var hk_ToggleStolenSkin = AddHotKey({
id: "hk_ToggleStolenSkin",
defaultHotkey: "M",
description: "Use/Stop Using Stolen Skin",
keyDown: function() {
    //skinChanger=false;
    Print("Will Steal Skin");
    if (FakeSkinWanted && !DoStealSkin) {
    	Print("FakeSkinWanted && !DoStealSkin");
        RefreshSkin(0,true);
        //LagOnce();
    } else if(FakeSkinWanted) {
    	Print("FakeSkinWanted");
        FakeSkinWanted=false;
        DoStealSkin=false;
    } else {
    	Print("STARTING FAKE SKIN CALL");
        FakeSkinWanted=true;
        DoStealSkin=true;
        FakeSkin();
    }
}
});
var hk_ToggleShareSkin = AddHotKey({
	id: "hk_ToggleShareSkin",
	defaultHotkey: "S",
	description: "Share/Stop Sharing Skin",
	keyDown: function() {
	    	DoShareSkin = !DoShareSkin;
	        //ShareSkin();
	}
	});


var hk_ReconnectToServer = AddHotKey({
id: "hk_ReconnectToServer",
defaultHotkey: "L",
description: "Reconnect to Server",
keyDown: function() {
    connect(myApp.getCurrentPartyCode());
}
});




var hk_CycleSkinRotator = AddHotKey({
id: "hk_CycleSkinRotator",
defaultHotkey: "C",
description: "Cycle Skin Rotator",
keyDown: function() { 
    if (skinChangerWanted && !skinChanger) {
        RefreshSkin(0,true);
        //LagOnce();
    } else if(skinChangerWanted) {
        skinChangerWanted=false;
        skinChanger=false;
    } else {
        skinChangerWanted=true;
        skinChanger=true;
        skinidx++;
        if(skinidx >= skinList.length) {skinidx = 0;}
        AutoChangeSkin();
    }
}
});
//myApp.refreshHotkeySettingPage();




//myApp.restoreSetting();




myApp.setUpHotKeyConfigPage();


*/
/*********************
 * Generic Functions *
 *********************/








function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}




function Print(msg) {
	console.log(msg);
}



/*****************
** Custom Hot Keys
******************/




const keycodes={
    backspace:8,    tab:9,         enter:13,
    shift:16,       ctrl:17,       alt:18,
    pause_break:19, capslock:20,   escape:27,
    space:32,       pageup:33,     pagedown:34,
    end:35,         home:36,       leftarrow:37,
    uparrow:38,     rightarrow:39, downarrow:40,
    insert:45,      delete:46,
    0:48,   1:49,   2:50,   3:51,
    4:52,   5:53,   6:54,   7:55,
    8:56,   9:57,   a:65,   b:66,
    c:67,   d:68,   e:69,   f:70,
    g:71,   h:72,   i:73,   j:74,
    k:75,   l:76,   m:77,   n:78,
    o:79,   p:80,   q:81,   r:82,
    s:83,   t:84,   u:85,   v:86,
    w:87,   x:88,   y:89,   z:90,
    multiply: 106, add: 107, subtract: 109,
    decimalpoint: 110, divide: 111,
    f1: 112, f2: 113, f3: 114,
    f4: 115, f5: 116, f6: 117,
    f7: 118, f8: 119, f9: 120,
    f10: 121, f11: 122, f12: 123,
    numlock: 144, scrolllock: 145,
    semicolon: 186, equalsign: 187,
    comma: 188, dash: 189, period: 190,
    forwardslash: 191, graveaccent: 192,
    openbracket: 219, backslash: 220,
    closebraket: 221, singlequote: 222
};




window.addEventListener('keydown', keydown);
function keydown(e) {
    var chatArea=$("#chatboxArea2");
    var chatIsFocused=$("#input_box2").is(':focus') || $("#LieAsElm").is(':focus') || $("#StealSkinElm").is(':focus');
    if(e.keyCode === keycodes.c && !(chatIsFocused)) {
        if (animator.isPlaying) {
            animator.pauseAnimation();
            animator.nextAnimation();
        } else {
            animator.playAnimation();
        }
    }
    else if(e.keyCode === 27) {
        animator.pauseAnimation();
        //temporary workaround
        $("#overlays")["show"]();
    }
    else if(e.keyCode === keycodes.add && !(chatIsFocused)) {
        //naservers();
        animator.incrementSpeedMultiplier();
    } else if(e.keyCode === keycodes.subtract && !(chatIsFocused)) {
        //naservers();
        animator.decrementSpeedMultiplier();
    } else if(e.keyCode === keycodes[0] && !(chatIsFocused)) {
        //naservers();
        animator.setSpeedMultiplier(1);
    }
    /*else if(e.keyCode === keycodes.l && !(chatIsFocused)) {
        //naservers();
        connect(myApp.getCurrentPartyCode());
    }*/
    /*else if((e.keyCode === keycodes.space || e.keyCode === keycodes.t) && !IsDoingFireork && !($("#chatboxArea2").is(":focus"))) {
        fireworkidx=0;
        Firework();
    }*/
}




//$('.content').append('<input style="border:1px solid grey;" placeholder="Time between skin change (milliseconds)" id="skin_change_inputSpeed" value="500" type="number" min="300"/>');











function HasRestarted() {
    if (testHasRestarted >=5) {
        testHasRestarted=0;
    } else {
        testHasRestarted++;
        return false;
    }
    var myCell;
    try {
        if(typeof getCell != 'function') throw "GetCell is NotAFunc";
        myCell=getCell();
        if(myCell === undefined) throw "GetCell Returned null";
        if(myCell[0] === undefined) throw "CellDataEmpty";
        if(myCell[0].x === undefined) throw "Cell has no X";
        FailCount=0;
    }
    catch(err) {
        console.log(err," ",FailCount);
        myCell=null;
        FailCount++;
    }
    finally {
        if (FailCount >= 5) return true;
        else if (FailCount !== 0) return false;
        myCell=myCell[0];
    }
    if (LastXY[0] != myCell.x || LastXY[1] != myCell.y) {
        LastXY=[myCell.x,myCell.y];
        return false;
    }
    var LB = getLB();
    if (LB.length != 9) return false;
    for (var i=0; i < 8; i++) { // Leaderboard 1-8 should be named RESTART
        if (LB[i].name != "RESTART") return false;
    }
    // Leaderboard 9 should be named ALIS.IO
    if (LB[8].name != "ALIS.IO") return false;
    return true;
}








/*************************
 * Skin Changing Functions
 *************************/




/*
 * Change Your Skin
 */







// Method for overloading global functions directly (functions in objects dont need this)
function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';
    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}








//$('#overlays2').append('<h6 style="margin-left:500px">Agarlist Skin Changer by Torodorable</h6>')












//To turn it on press c, add skins by "skin url", enjoy








}, 10000);






