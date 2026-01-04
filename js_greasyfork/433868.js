// ==UserScript==
// @name         epiano
// @namespace    https://epiano.jp/
// @version      0.5
// @description
// @match        https://epiano.jp/sp/*
// @grant        none
// @run-at document-start
// @noframes
// @description chin-chin
// @downloadURL https://update.greasyfork.org/scripts/433868/epiano.user.js
// @updateURL https://update.greasyfork.org/scripts/433868/epiano.meta.js
// ==/UserScript==

window.MIDIACCESS_BACK = navigator.requestMIDIAccess;
navigator.requestMIDIAccess = null;

function releaseBufferA(key, uid) {
    const id = uid + key;

    if (id in playings) {
        for (i in playings[id]) {
            const ar = playings[id][i];
            const time = window.context.currentTime;
            const source = ar[0]
            const gain = ar[1];

            gain.setValueAtTime(gain.value, time);

            gain.linearRampToValueAtTime(gain.value * 0.1, time + 0.16);
            gain.linearRampToValueAtTime(0.0, time + 0.4);
            source.stop(time + 0.41);
        }

        delete playings[id];
    }
}
function playBufferA(key,vol,uid){
	if(vol == undefined){
		vol = DEFAULT_VELOCITY;
	}
    if(key in buffers){
		const source = window.context.createBufferSource();
		source.buffer = buffers[key];

		const gainNode = window.context.createGain();
		gainNode.connect(window.context.destination);
		gainNode.gain.value = vol * ($(".volume").get(0).value);

		source.connect(gainNode);
		source.start(0);

		if(!playings[uid+key]){
			playings[uid+key] = [];
		}
		playings[uid+key].push([source,gainNode.gain]);
	}
}

function ease(t, totalTime, min, max) {
    max -= min;
    t = t / totalTime;
    if (t < 0.43) {
        return max * (t / 2.3) + min;
    }

    return max * t * t + min;
}

function releaseSustainA() {
    window.gSustain = false;
    for (const msg of window.PENDING_MIDI_MESSAGES) {
        releaseA(msg);
    }
    window.PENDING_MIDI_MESSAGES.clear();
}

function pressA(id, vol) {
    const newVol = ease(vol, 1.5, 0.0, 2.0) * 3.0;
    if (window.PENDING_MIDI_MESSAGES.has(id)) {
        releaseBufferA(id, loginInfo.myID);
        if (!$("#disconnect").is(":checked")) {
            socket.emit('r', id);
        }
        window.PENDING_MIDI_MESSAGES.delete(id)
    }
    playPianoA(window.MIDI_KEY_NAMES[id - 21], loginInfo.myID, newVol);
    if (!window.DISCONNECT.is(":checked")) {
        socket.emit('p', window.MIDI_KEY_NAMES[id - 21], newVol);
    }
}
function releaseA(id) {
    if (window.gSustain) {
        window.PENDING_MIDI_MESSAGES.add(id);
    }
    else {
        releaseBufferA(window.MIDI_KEY_NAMES[id - 21], loginInfo.myID);
        if (!window.DISCONNECT.is(":checked")) {
            socket.emit('r', window.MIDI_KEY_NAMES[id - 21]);
        }
    }
}

function playPianoA(id, uid, vol) {
    if (ignoreList[uid]) {
        return;
    }

    var newVol = vol;
    if (newVol > 2.0 || newVol < -1) {
        newVol = 2.0;
        ignoreList[uid] = 1
    }

    playBufferA(id, newVol, uid);

    const pikaColor = uid == loginInfo.myID ? "#00FF00" : "#FF0000";
    if(!window.DISCONNECT.is(":checked")){
		$("[uid="+uid+"]").css("backgroundColor", pikaColor)
			.stop(true)
			.show()
			.animate({ top: "5px" }, 100).animate({ top: "0px" }, 100)
	}
    setTimeout(function(){
		$("[uid="+uid+"]").css("backgroundColor","")
	},200);

    //鍵盤の動作発動
    if (id in pianoKeyObj) {
        pianoKeyObj[id].dispatchEvent(uid == loginInfo.myID ? "mousedownSelf" : "mousedownOther");
    }
}

function updateList(list) {
    var htmls = new Array();
    $(list).each(function (i) {
        var uid = list[i];
        var isIgnore = ignoreList[uid] ? "class='ignore' style='text-decoration:line-through;background:#999'" : "";
        htmls.push("<span class=user " + isIgnore + " uid=" + uid + ">" + uid + "</span>");
    });
    $("#users").html(htmls.join(""));
    $("#onlineNumber").html(htmls.length);
}



window.addEventListener('load', function () {
    // ペダル用 解放待機中のMIDIメッセージ
    if (window.PENDING_MIDI_MESSAGES == undefined) {
        window.PENDING_MIDI_MESSAGES = new Set();
    }
    window.gSustain = false;
    window.DISCONNECT = $("#disconnect");

    $(document).off("pressSustain");
    $(document).off("releaseSustain");

    socket.off('p');
    socket.off('r');

    	//弾く
	socket.on('p',function(id,uid,vol){
		if(!window.DISCONNECT.is(":checked")){
			playPianoA(id,uid,vol);
		}
	});

	//離す
	socket.on('r',function(id,uid){
		if(!window.DISCONNECT.is(":checked")){
			releaseBufferA(id,uid);
		}
	});

    navigator.requestMIDIAccess = window.MIDIACCESS_BACK;
    (function () {
        window.MIDI_KEY_NAMES = ["a-1", "as-1", "b-1"];
        var bare_notes = "c cs d ds e f fs g gs a as b".split(" ");
        for (var oct = 0; oct < 7; oct++) {
            for (var i in bare_notes) {
                window.MIDI_KEY_NAMES.push(bare_notes[i] + oct);
            }
        }
        window.MIDI_KEY_NAMES.push("c7");
        if (navigator.requestMIDIAccess) {
            $("#connectJava").hide();

            navigator.requestMIDIAccess({sysex:false}).then(
                function (midi) {
                    function midimessagehandler(evt) {
                        switch(evt.data[0] & 0xf0)
                        {
                            // NOTE_ON
                            case 0x90:
                                pressA(evt.data[1], evt.data[2] / 127.0);
                                return;
                            // NOTE_OFF
                            case 0x80:
                                releaseA(evt.data[1]);
                                 return;

                            case 0xB0:
                                if (evt.data[1] == 64)
                                {
                                    if (evt.data[2] > 0) {
                                        window.gSustain = true;
                                    } else {
                                        releaseSustainA();
                                    }
                                }
                                return;
                        }
                    }
                    function plug() {
                        if (midi.inputs.size > 0) {
                            var ul = document.createElement("ul");
                            var inputs = midi.inputs.values();
                            for (var input_it = inputs.next(); input_it && !input_it.done; input_it = inputs.next()) {
                                var input = input_it.value;
                                input.onmidimessage = midimessagehandler;

                                console.log("input", input);

                                var li = document.createElement("li");
                                li.textContent = input.name;
                                ul.appendChild(li);
                            }

                            $("body").prop("midi", input.name)

                            $("#alert").hide().html("MIDIデバイス：" + input.name).slideDown("fast", function () {
                                if (timerId) {
                                    clearTimeout(timerId);
                                }

                                timerId = setTimeout(function () { $("#alert").slideUp("slow") }, 5000);
                            });

                            new Notification({ title: "MIDI Inputs In Use", html: ul.innerHTML, duration: 4000 });
                        }

                        if (gMidiOutTest && midi.outputs.size > 0) {
                            var outputs = midi.outputs.values();
                            for (var output_it = outputs.next(); output_it && !output_it.done; output_it = outputs.next()) {
                                var output = output_it.value;
                                console.log("output", output);


                            }
                            gMidiOutTest = function (note_name, vel, delay_ms) {
                                var note_number = MIDI_KEY_NAMES.indexOf(note_name);
                                if (note_number == -1) return;
                                note_number = note_number + 9 - MIDI_TRANSPOSE;

                                var outputs = midi.outputs.values();
                                for (var output_it = outputs.next(); output_it && !output_it.done; output_it = outputs.next()) {
                                    var output = output_it.value;
                                    output.send([0x90, note_number, vel], window.performance.now() + delay_ms);
                                }
                            }
                        }
                    }
                    midi.addEventListener("statechange", function (evt) {
                        if (evt instanceof MIDIConnectionEvent) {
                            plug();
                        }
                    });
                    plug();
                },
                function (err) {
                    console.log(err);
                });
        }
    })();

    addJS_Node(updateList);
})

addJS_Node(releaseSustainA);
addJS_Node(pressA);
addJS_Node(releaseA);
addJS_Node(playPianoA);
addJS_Node(playBufferA);
addJS_Node(releaseBufferA);
addJS_Node(ease);

function addJS_Node(text, s_URL, funcToRun, runOnLoad) {
    var D = document;
    var scriptNode = D.createElement('script');
    if (runOnLoad) {
        scriptNode.addEventListener("load", runOnLoad, false);
    }
    scriptNode.type = "text/javascript";
    if (text) scriptNode.textContent = text;
    if (s_URL) scriptNode.src = s_URL;
    if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
    targ.appendChild(scriptNode);
}