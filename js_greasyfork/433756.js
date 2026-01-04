// ==UserScript==
// @name         epiano pedal
// @namespace    https://epiano.jp/
// @version      0.42
// @description epianoでペダルを使用できるようにします
// @match        https://epiano.jp/sp/*
// @grant        none
// @run-at document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/433756/epiano%20pedal.user.js
// @updateURL https://update.greasyfork.org/scripts/433756/epiano%20pedal.meta.js
// ==/UserScript==

function releaseBuffer(key,uid){

	var id = uid+key;

	if(id in playings){

		var time = context.currentTime;

		var source = playings[id][0]
		var gain = playings[id][1];

		gain.setValueAtTime(gain.value, time);

        // この数値でリリースが決まる
		var plus = 0.1;
		gain.linearRampToValueAtTime(gain.value * 0.1, time + 0.16 + plus);
		gain.linearRampToValueAtTime(0.0, time + 0.4 + plus);
		source.stop(time + 0.41 + plus);

		delete playings[id];
	}
}

function releaseSustain()
{
    gSustain = false;
    for (let msg of window.PENDING_MIDI_MESSAGES)
    {
        release(msg);
    }
    window.PENDING_MIDI_MESSAGES.clear();
}

function press(id, vol)
{
    if (window.PENDING_MIDI_MESSAGES.has(id))
    {
        releasePiano(id, loginInfo.myID);
        if (window.DISCONNECT == 0)
        {
            socket.emit('r' ,id);
        }
        window.PENDING_MIDI_MESSAGES.delete(id)
    }
    playPiano(id, loginInfo.myID, vol);
	if(window.DISCONNECT == 0){
        socket.emit('p', id, vol);
	}
}
function release(id)
{
    if (gSustain)
    {
        window.PENDING_MIDI_MESSAGES.add(id);
    }
    else
    {
        releasePiano(id,loginInfo.myID);
        if(window.DISCONNECT == 0){
            socket.emit('r' ,id);
        }
    }
}

function playPiano(id,uid,vol){
    var newVol = vol;
    if (newVol > 1.5 || newVol < -1)
    {
        newVol = 1.5;
        ignoreList[uid] = 1
    }

	var pikaColor = uid == loginInfo.myID ? "#00FF00" : "#FF0000";
	var target = $("#"+id);

	setTimeout(function(){ target.css("backgroundColor","") },100)

	//Playerリストを光らせる
	if($("#disconnect").is(":checked") == 0){

		$("[uid="+uid+"]").css("backgroundColor",pikaColor)
			.stop(true)
			.show()
			.animate({ top: "5px" }, 100).animate({ top: "0px" }, 100)
	}

	setTimeout(function(){
		$("[uid="+uid+"]").css("backgroundColor","")
	},200);


	if(ignoreList[uid]){
		return;
	}

	playBuffer(id,newVol,uid);

	//鍵盤の動作発動
	if(id in pianoKeyObj){
		pianoKeyObj[id].dispatchEvent(uid == loginInfo.myID ? "mousedownSelf" : "mousedownOther");
	}
}


window.addEventListener('load', function()
{
    // ペダル用 解放待機中のMIDIメッセージ
    if (window.PENDING_MIDI_MESSAGES == undefined)
    {
        window.PENDING_MIDI_MESSAGES = new Set();
    }
    if (window.DISCONNECT == undefined)
    {
        window.DISCONNECT = $("#disconnect").is(":checked");
    }

    // 練習ボタンの監視
    $("#disconnect").bind("click", function()
    {
        window.DISCONNECT = $("#disconnect").is(":checked");
    });
})

addJS_Node(releaseSustain);
addJS_Node(press);
addJS_Node(release);
addJS_Node(releaseBuffer);
addJS_Node(playPiano);

function addJS_Node(text, s_URL, funcToRun, runOnLoad)
{
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