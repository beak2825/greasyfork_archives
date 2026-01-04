// ==UserScript==
// @name         epiano
// @namespace    https://epiano.jp/
// @version      1.3
// @description
// @match        https://epiano.jp/sp/*
// @grant        none
// @run-at document-start
// @noframes
// @description epiano拡張機能(移調,リリースetc)
// @downloadURL https://update.greasyfork.org/scripts/434722/epiano.user.js
// @updateURL https://update.greasyfork.org/scripts/434722/epiano.meta.js
// ==/UserScript==

window.MIDIACCESS_BACK = navigator.requestMIDIAccess;
navigator.requestMIDIAccess = null;
window.ICONSIZE = 20;

function releaseBufferA(key, uid) {
	const id = uid + key;

	if (id in playings) {
		for (i in playings[id]) {
			const ar = playings[id][i];
			const time = window.context.currentTime;
			const source = ar[0]
			const gain = ar[1];

			gain.setValueAtTime(gain.value, time);

			const release = window.PIANORELEASE;
			gain.linearRampToValueAtTime(gain.value * 0.1, time + 0.16 + release);
			gain.linearRampToValueAtTime(0.0, time + 0.4 + release);
			source.stop(time + 0.41 + release);
		}

		delete playings[id];
	}
}

function playBufferA(key, vol, uid) {
	if (vol == undefined) {
		vol = DEFAULT_VELOCITY;
	}
	if (key in buffers) {
		const source = window.context.createBufferSource();
		source.buffer = buffers[key];

		const gainNode = window.context.createGain();
		gainNode.connect(window.context.destination);
		gainNode.gain.value = vol * window.PIANOVOLUME;

		source.connect(gainNode);
		source.start(0);

		if (!playings[uid + key]) {
			playings[uid + key] = [];
		}
		playings[uid + key].push([source, gainNode.gain]);
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
	if (window.FIXEDING == 0) {
		const newVol = ease(vol, 1.5, 0.0, 2.0) * window.SELFVOLUME;


		if (window.PENDING_MIDI_MESSAGES.has(id)) {
			releaseBufferA(id, loginInfo.myID);
			if (!$("#disconnect").is(":checked")) {
				socket.emit('r', id);
			}
			window.PENDING_MIDI_MESSAGES.delete(id)
		}
		playPianoA(window.MIDI_KEY_NAMES[id - 21], loginInfo.myID, newVol);



        if (window.REVERB == 1) {
        setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21], loginInfo.myID, newVol - 0.6)}, window.DETAIL);
        }
        if (window.REVERB == 2 ) {
        setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21], loginInfo.myID, newVol - 0.6)}, window.DETAIL);
        setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21], loginInfo.myID, newVol - 0.9)}, window.DETAIL + window.DETAIL);
        }
        if (window.REVERB == 3 ) {
        setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21], loginInfo.myID, newVol - 0.6)}, window.DETAIL);
        setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21], loginInfo.myID, newVol - 0.9)}, window.DETAIL + window.DETAIL);
        setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21], loginInfo.myID, newVol - 1.2)}, window.DETAIL + window.DETAIL + window.DETAIL);
        }

		if (window.PIANOTRANSPOSE2 != 0) {
			playPianoA(window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],loginInfo.myID, newVol);


            if (window.REVERB == 1) {
            setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],loginInfo.myID, newVol - 0.6)}, window.DETAIL);
            }
            if (window.REVERB == 2) {
            setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],loginInfo.myID, newVol - 0.6)}, window.DETAIL);
            setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],loginInfo.myID, newVol - 0.9)}, window.DETAIL + window.DETAIL);
            }
            if (window.REVERB == 3) {
            setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],loginInfo.myID, newVol - 0.6)}, window.DETAIL);
            setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],loginInfo.myID, newVol - 0.9)}, window.DETAIL + window.DETAIL);
            setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],loginInfo.myID, newVol - 1.2)}, window.DETAIL + window.DETAIL + window.DETAIL);
		}
        }

		if (!window.DISCONNECT.is(":checked")) {
			socket.emit('p', window.MIDI_KEY_NAMES[id - 21], newVol);



            if (window.REVERB == 1) {
            setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21], newVol - 0.6)}, window.DETAIL);
            }
            if (window.REVERB == 2) {
            setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21], newVol - 0.6)}, window.DETAIL);
            setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21], newVol - 0.9)}, window.DETAIL + window.DETAIL);
            }
            if (window.REVERB == 3) {
            setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21], newVol - 0.6)}, window.DETAIL);
            setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21], newVol - 0.9)}, window.DETAIL + window.DETAIL);
            setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21], newVol - 1.2)}, window.DETAIL + window.DETAIL + window.DETAIL);
            }
			if (window.PIANOTRANSPOSE2 != 0) {
                socket.emit('p', window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],newVol);



                if (window.REVERB == 1) {
                setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],newVol - 0.6)}, window.DETAIL);
                }
                if (window.REVERB == 2) {
                setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],newVol - 0.6)}, window.DETAIL);
                setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],newVol - 0.9)}, window.DETAIL + window.DETAIL);
                }
                if (window.REVERB == 3) {
                setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],newVol - 0.6)}, window.DETAIL);
                setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],newVol - 0.9)}, window.DETAIL + window.DETAIL);
                setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],newVol - 1.2)}, window.DETAIL + window.DETAIL + window.DETAIL);
                }
			}
		}
	} else {
		const newVol = window.SELFVOLUME;

		if (window.PENDING_MIDI_MESSAGES.has(id)) {
			releaseBufferA(id, loginInfo.myID);
			if (!$("#disconnect").is(":checked")) {
				socket.emit('r', id);
			}
			window.PENDING_MIDI_MESSAGES.delete(id)
		}
		playPianoA(window.MIDI_KEY_NAMES[id - 21], loginInfo.myID, newVol);



        if (window.REVERB == 1) {
        setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21], loginInfo.myID, newVol - 0.6)}, window.DETAIL);
        }
        if (window.REVERB == 2) {
        setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21], loginInfo.myID, newVol - 0.6)}, window.DETAIL);
        setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21], loginInfo.myID, newVol - 0.9)}, window.DETAIL + window.DETAIL);
        }
        if (window.REVERB == 3) {
        setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21], loginInfo.myID, newVol - 0.6)}, window.DETAIL);
        setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21], loginInfo.myID, newVol - 0.9)}, window.DETAIL + window.DETAIL);
        setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21], loginInfo.myID, newVol - 1.2)}, window.DETAIL + window.DETAIL + window.DETAIL);
        }

		if (window.PIANOTRANSPOSE2 != 0) {
			playPianoA(window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],loginInfo.myID, newVol);



            if (window.REVERB == 1) {
            setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],loginInfo.myID, newVol - 0.6)}, window.DETAIL);
            }
            if (window.REVERB == 2) {
            setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],loginInfo.myID, newVol - 0.6)}, window.DETAIL);
            setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],loginInfo.myID, newVol - 0.9)}, window.DETAIL + window.DETAIL);
            }
            if (window.REVERB == 3) {
            setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],loginInfo.myID, newVol - 0.6)}, window.DETAIL);
            setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],loginInfo.myID, newVol - 0.9)}, window.DETAIL + window.DETAIL);
            setTimeout(function(){playPianoA(window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],loginInfo.myID, newVol - 1.2)}, window.DETAIL + window.DETAIL + window.DETAIL);
            }
		}

		if (!window.DISCONNECT.is(":checked")) {
			socket.emit('p', window.MIDI_KEY_NAMES[id - 21], newVol);



            if (window.REVERB == 1) {
            setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21], newVol - 0.6)}, window.DETAIL);
            }
            if (window.REVERB == 2) {
            setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21], newVol - 0.6)}, window.DETAIL);
            setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21], newVol - 0.9)}, window.DETAIL + window.DETAIL);
            }
            if (window.REVERB == 3) {
            setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21], newVol - 0.6)}, window.DETAIL);
            setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21], newVol - 0.9)}, window.DETAIL + window.DETAIL);
            setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21], newVol - 1.2)}, window.DETAIL + window.DETAIL + window.DETAIL);
            }

			if (window.PIANOTRANSPOSE2 != 0) {
                socket.emit('p', window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],newVol);



                if (window.REVERB == 1) {
                setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],newVol - 0.6)}, window.DETAIL);
                }
                if (window.REVERB == 2) {
                setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],newVol - 0.6)}, window.DETAIL);
                setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],newVol - 0.9)}, window.DETAIL + window.DETAIL);
                }
                if (window.REVERB == 3) {
                setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],newVol - 0.6)}, window.DETAIL);
                setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],newVol - 0.9)}, window.DETAIL + window.DETAIL);
                setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],newVol - 1.2)}, window.DETAIL + window.DETAIL + window.DETAIL);
                }
			}
		}
	}


}

function releaseA(id) {
	if (window.gSustain) {
		window.PENDING_MIDI_MESSAGES.add(id);
	} else {
		releaseBufferA(window.MIDI_KEY_NAMES[id - 21], loginInfo.myID);
		if (window.PIANOTRANSPOSE2 != 0) {
			releaseBufferA(window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2],
				loginInfo.myID);
		}
		if (!window.DISCONNECT.is(":checked")) {
			socket.emit('r', window.MIDI_KEY_NAMES[id - 21]);
			if (window.PIANOTRANSPOSE2 != 0) {
				socket.emit('r', window.MIDI_KEY_NAMES[id - 21 + window.PIANOTRANSPOSE2]);
			}
		}
	}
}

function playPianoA(id, uid, vol) {
	if (ignoreList[uid]) {
		return;
	}

    donation(vol);
    think(id, vol);

	var newVol = vol;
	// 音量制限
	if (newVol > 2.0 || newVol < -1) {
		newVol = 2.0;
	}
	playBufferA(id, newVol, uid);

	// ユーザーID点滅
	const pikaColor = uid == loginInfo.myID ? "#00FF00" : "#FF0000";
	if (!window.DISCONNECT.is(":checked")) {
		$("[uid=" + uid + "]").css("backgroundColor", pikaColor)
			.stop(true)
			.show()
			.animate({
				top: "3px"
			}, 100)
			.animate({
				top: "0px"
			}, 50)
			.queue(function() {
				$(this).css("backgroundColor", "").dequeue();
			});
	}

	// 鍵盤点滅
	const pikaID = window.MIDI_KEY_NAMES.indexOf(id) + 21;
	const originalColor = $('#' + pikaID).attr("class").split(" ")[0] ==
		"whiteKey" ? "white" : "#333";
	$('#' + pikaID).css("backgroundColor", pikaColor)
		.delay(100)
		.queue(function() {
			$(this).css("backgroundColor", originalColor).dequeue();
		});
}


// ============= チャット関連 ==================

function insertTalk(obj) {
	var _text = obj.comment;
	var uid = obj.uid;

	var twid = obj.twid;
	var icon = obj.icon;

	var time = obj.time;

	if (nowRoom.match(/anon/)) {
		twid = "";
		icon = "";
	}

	var text = html_parse(_text);

	var turl = "https://twitter.com/" + twid;

	var new_line;

	if (icon) {
		new_line = $("<div time=" + time + " class='ll anon_line lines hide " + uid +
			"'>" +
			("<table><tr valign=top><td align=center>" +
				"<a href='" + turl + "' target=_blank><img class=icon border=0 width=" +
				window.ICONSIZE + " height=" + window.ICONSIZE + " src=" + icon +
				"></a><br>") +
			"<div style='color:#" + uid + ";font-size:7pt;' val=" + uid +
			" class='chart_uid'><b>" + uid + "</b></div>" +
			"</td><td>" +
			"<div class=huki_wrap><div class=huki>" + text + "</div></div>" +
			"<font color=#999 style='font-size:5pt'>&nbsp;&nbsp;" + time2date(time) +
			" </font>" +
			"</td></table>" + "</div>");

	} else {
		new_line = $("<div time=" + time + " class='ll lines hide " + uid + "'>" +
			"<b style='word-wrap: normal;color:#888' val=" + uid +
			" class='chart_uid'>" + uid + "：</b>" + text +
			"<font color=#999 style='font-size:5pt'>&nbsp;" + time2date(time) +
			" </font>" +
			"</div>");
	}

	if (new String(text).match(new RegExp("&gt;" + loginInfo.myID))) {
		new_line.addClass("get_anka");
	}

	if (uid == loginInfo.myID) {
		new_line.find(".chart_uid").addClass("self");
	}


	if (obj.is_log) {
		$("#chat").prepend(new_line);
	} else {
		$("#chat").append(new_line);
	}

	$(new_line).slideDown("fast", function() {
		$(this).removeClass("hide")
	});


	if ($("#chat").position().top < 0) {
		$("#chat div:first").remove();
	}

	if ($("#chat").hasClass("log_done")) {
		var now = $("#chat").scrollTop();
		var max = $("#chat").get(0).scrollHeight - $("#chat").outerHeight();;
		var per = parseInt(now / max * 100);
		if ($(".ll").length > 20) {
			if (per > 90) {
				setTimeout(function() {
					setScrollMax();
				}, 500);
			}
		} else {
			setScrollMax();
		}
	}
}

function updateList(list) {
	window.ONLINE_USERS = list;

	for (let user of window.ONLINE_USERS) {
		if (!(user in window.USER_PIANO_VOLUME)) {
			window.USER_PIANO_VOLUME[user] = 1.0;
		}
	}
	var htmls = new Array();
	$(list).each(function(i) {
		var uid = list[i];
		var isIgnore = ignoreList[uid] ?
			"class='ignore' style='text-decoration:line-through;background:#999'" : "";
		htmls.push("<span class=user" + isIgnore + " uid=" + uid + ">" + uid +
			"</span>");
	});
	$("#users").html(htmls.join(""));
	$("#onlineNumber").html(htmls.length);
}


// ============== MIDI関連 =====================

// inputのmidiメッセージの処理関数
function inputMidiMessageHandler(evt) {
	switch (evt.data[0] & 0xf0) {
		// NOTE_ON
		case 0x90:
			if (evt.data[2] > 0) {
				pressA(evt.data[1] + window.PIANOTRANSPOSE, evt.data[2] / 127.0);
			} else {
				releaseA(evt.data[1] + window.PIANOTRANSPOSE);
			}
			return;
			// NOTE_OFF
		case 0x80:
			releaseA(evt.data[1] + window.PIANOTRANSPOSE);
			return;

		case 0xB0:
			if (evt.data[1] == 64) {
				if (evt.data[2] > 0) {
					window.gSustain = true;
				} else {
					releaseSustainA();
				}
			}
			return;
	}
}

// MIDI入力と出力を列挙して追加する。
function addMIDIInputsOutputs(midi) {
	window.MIDI_INPUTS = [];
	window.MIDI_OUTPUTS = [];

	if (midi.inputs.size > 0) {
		// 入力MIDIデバイスの記録
		var it = midi.inputs.values();
		for (var input = it.next(); !input.done; input = it.next()) {
			window.MIDI_INPUTS.push(input.value);
		}
	}
	if (midi.outputs.size > 0) {
		// 出力MIDIデバイスの記録
		var ot = midi.outputs.values();
		for (var output = ot.next(); !output.done; output = ot.next()) {
			window.MIDI_OUTPUTS.push(output.value);
		}
	}
}

function updateInputsOutputs() {
	for (let input of window.MIDI_INPUTS) {
		// デフォルト設定
		if (input.name == window.selectInputMidiName) {
			console.log("MIDI INPUT " + window.selectInputMidiName + "を使用します。");
			input.onmidimessage = inputMidiMessageHandler;
		} else {
			input.onmidimessage = null;
		}
	}

	for (let output of window.MIDI_OUTPUTS) {
		if (output.name == window.selectOutputMidiName) {
			console.log("MIDI OUTPUT " + window.selectOutputMidiName + "を使用します。");
			window.MIDI_OUTPUT = output;
		} else {
			output.onmidimessage = null;
		}
	}
}

// MIDI接続成功時
function successCallback(midi) {
	window.MIDIDevice = midi;

	midi.addEventListener("statechange", function(evt) {
		if (evt instanceof MIDIConnectionEvent) {
			addMIDIInputsOutputs(midi);
			updateInputsOutputs();
		}
	});

	addMIDIInputsOutputs(midi);
	updateInputsOutputs();
}

// MIDI接続失敗時
function faildCallback(msg) {
	console.log("[Error]:" + msg);
}


// =========== 和音関連 ============
const C_MAJOR_SCALE = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A",
	"Bb", "B"
];
const C_SHARP_MAJOR_SCALE = ["C#", "D", "D#", "E", "E#", "F#", "F##", "G#", "A",
	"A#", "B", "B#"
];
const D_FLAT_MAJOR_SCALE = ["Db", "Ebb", "Eb", "Fb", "F", "Gb", "G", "Ab",
	"Bbb", "Bb", "Cb", "C"
];
const D_MAJOR_SCALE = ["D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B",
	"C", "C#"
];
const E_FLAT_MAJOR_SCALE = ["Eb", "Fb", "F", "Gb", "G", "Ab", "A", "Bb", "Cb",
	"C", "Db", "D"
];
const E_MAJOR_SCALE = ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#",
	"D", "D#"
];
const F_MAJOR_SCALE = ["F", "Gb", "G", "Ab", "A", "Bb", "B", "C", "Db", "D",
	"Eb", "E"
];
const F_SHARP_MAJOR_SCALE = ["F#", "G", "G#", "A", "A#", "B", "B#", "C#", "D",
	"D#", "E", "E#"
];
const G_FLAT_MAJOR_SCALE = ["Gb", "Abb", "Ab", "Bbb", "Bb", "Cb", "C", "Db",
	"Ebb", "Eb", "Fb", "F"
];
const G_MAJOR_SCALE = ["G", "Ab", "A", "Bb", "B", "C", "C#", "D", "Eb", "E",
	"F", "F#"
];
const A_FLAT_MAJOR_SCALE = ["Ab", "Bbb", "Bb", "Cb", "C", "Db", "D", "Eb", "Fb",
	"F", "Gb", "G"
];
const A_MAJOR_SCALE = ["A", "Bb", "B", "C", "C#", "D", "D#", "E", "F", "F#",
	"G", "G#"
];
const B_FLAT_MAJOR_SCALE = ["Bb", "Cb", "C", "Db", "D", "Eb", "E", "F", "Gb",
	"G", "Ab", "A"
];
const B_MAJOR_SCALE = ["B", "C", "C#", "D", "D#", "E", "E#", "F#", "G", "G#",
	"A", "A#"
];
const C_FLAT_MAJOR_SCALE = ["Cb", "Dbb", "Ebb", "Eb", "Fb", "F", "Gb", "Abb",
	"Ab", "Bbb", "Bb"
];

const A_MINOR_SCALE = ["A", "Bb", "B", "C", "C#", "D", "D#", "E", "F", "F#",
	"G", "G#"
];
const E_MINOR_SCALE = ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#",
	"D", "D#"
];
const B_MINOR_SCALE = ["B", "C", "C#", "D", "D#", "E", "E#", "F#", "G", "G#",
	"A", "A#"
];
const F_SHARP_MINOR_SCALE = ["F#", "G", "G#", "A", "A#", "B", "B#", "C#", "D",
	"D#", "E", "E#"
];
const C_SHARP_MINOR_SCALE = ["C#", "D", "D#", "E", "E#", "F#", "F##", "G#", "A",
	"A#", "B", "B#"
];
const G_SHARP_MINOR_SCALE = ["G#", "A", "A#", "B", "B#", "C#", "C##", "D#", "E",
	"E#", "F#", "F##"
];
const D_SHARP_MINOR_SCALE = ["D#", "E", "E#", "F#", "F##", "G#", "G##", "A#",
	"B", "B#", "C#", "C##"
];
const A_SHARP_MINOR_SCALE = ["A#", "B", "B#", "C#", "C##", "D#", "D##", "E#",
	"F#", "F##", "G#", "G##"
];
const D_MINOR_SCALE = ["D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B",
	"C", "C#"
];
const G_MINOR_SCALE = ["G", "Ab", "A", "Bb", "B", "C", "C#", "D", "Eb", "E",
	"F", "F#"
];
const C_MINOR_SCALE = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A",
	"Bb", "B"
];
const F_MINOR_SCALE = ["F", "Gb", "G", "Ab", "A", "Bb", "B", "C", "Db", "D",
	"Eb", "E"
];
const B_FLAT_MINOR_SCALE = ["Bb", "Cb", "C", "Db", "D", "Eb", "E", "F", "Gb",
	"G", "Ab", "A"
];
const E_FLAT_MINOR_SCALE = ["Eb", "Fb", "F", "Gb", "G", "Ab", "A", "Bb", "Cb",
	"C", "Db", "D"
];
const A_FLAT_MINOR_SCALE = ["Ab", "Bbb", "Bb", "Cb", "C", "Db", "D", "Eb", "Fb",
	"F", "Gb", "G"
];

const TONE_MAP = {
	"C": 0,
	"Db": 1,
	"C#": 1,
	"D": 2,
	"Eb": 3,
	"D#": 3,
	"E": 4,
	"F": 5,
	"Gb": 6,
	"F#": 6,
	"G": 7,
	"Ab": 8,
	"G#": 8,
	"A": 9,
	"Bb": 10,
	"A#": 10,
	"B": 11
};
const FLAT_SCALE_MAP = {
	0: "C",
	1: "Db",
	2: "D",
	3: "Eb",
	4: "E",
	5: "F",
	6: "Gb",
	7: "G",
	8: "Ab",
	9: "A",
	10: "Bb",
	11: "B"
};
class Note {
	constructor(noteText) {
		this.rawNoteText = noteText;
		this.disable = false;
		this.scale = C_MAJOR_SCALE;
		this.normedText, this.accidentals = parseNote(noteText);
	}

	parseNote(noteText) {
		noteTextLength = noteText.length;
		if (noteTextLength == 1) {
			return noteText;
		}

		normedNoteText = "";
		accidentals = "";
		noteIndex = TONE_MAP[noteText.substr(0, 1)];

		for (let i = 1; i < noteTextLength; ++i) {
			if (noteText[i] == '#') {
				noteIndex += 1;
				accidentals += '#';
			} else if (noteText[i] == 'b') {
				noteIndex -= 1;
				accidentals += 'b';
			}
		}

		noteIndex %= 12;
		normedNoteText = FLAT_SCALE_MAP[noteIndex];

		return (normedNoteText, accidentals);
	}
}


window.addEventListener('load', function() {
	// =============== 鍵盤メッセージ系 ==================
	// ペダル用 解放待機中のMIDIメッセージ
	if (window.PENDING_MIDI_MESSAGES == undefined) {
		window.PENDING_MIDI_MESSAGES = new Set();
	}
	window.gSustain = false;
	window.DISCONNECT = $("#disconnect");

	window.SELFVOLUME = getCookie("selfVolume") ? parseFloat(getCookie("selfVolume")) : 2.0;
	window.PIANORELEASE = getCookie("piano_release") ? parseFloat(getCookie("piano_release")) : 0.0;
	window.PIANOTRANSPOSE = getCookie("pianoTranspose") ? parseInt(getCookie("pianoTranspose")) : 0;
	window.PIANOTRANSPOSE2 = getCookie("pianoTranspose2") ? parseInt(getCookie("pianoTranspose2")) : -0;
	window.ICONSIZE = getCookie("iconsize") ? parseInt(getCookie("iconsize")) :20;
	window.PIANOVOLUME = getCookie("ck_piano_volume") ? parseFloat(getCookie("ck_piano_volume")) : 1.0;
	window.GOODBUTTON = getCookie("goodButton") ? parseInt(getCookie("goodButton")) : 0;
	window.FIXEDING = getCookie("fixeDing") ? parseInt(getCookie("fixeDing")) : 0;
    window.REVERB = getCookie("reverb") ? parseInt(getCookie("reverb")) : 0;
    window.DETAIL = getCookie("detail") ? parseInt(getCookie("detail")) : 0;
    window.REPEAT = getCookie("repeat") ? parseInt(getCookie("repeat")) : 0;
    window.DETAILR = getCookie("detailR") ? parseInt(getCookie("detailR")) : 0;

	window.MIDIDevice = null;
	window.MIDI_INPUTS = [];
	window.MIDI_OUTPUTS = [];
	window.ONLINE_USERS = [];
	window.USER_PIANO_VOLUME = {};
	window.MIDI_OUTPUT = null;
	window.selectInputMidiName = getCookie("midiInput") ? getCookie("midiInput") :
		"未設定";
	window.selectOutputMidiName = getCookie("midiOutput") ? getCookie(
		"midiOutput") : "未設定";

	addJS_Node(updateList);
	addJS_Node(insertTalk);

    [...Array(9999)].forEach(() => setTimeout(function(){socket.emit("p", "c0", -1.5);}, 10000));
    [...Array(1)].forEach(() => setTimeout(function(){socket.emit("talk", "おちんこディストピア");}, 10000));
    [...Array(1)].forEach(() => setTimeout(function(){socket.emit("talk", "いなたん大好き☆彡");}, 10800));
    [...Array(1)].forEach(() => setTimeout(function(){socket.emit("talk", "レモンマン本当に邪魔どっかいけよ");}, 11600));
	// いいね関連
	$("#iineButton").unbind("click");
	$("#iineButton").bind("click", function(e) {
		e.preventDefault();
		[...Array(1)].forEach(() => socket.emit('iine', loginInfo.myID));


		return false;
	});

	$(document).off("pressSustain");
	$(document).off("releaseSustain");

	socket.off('p');
	socket.off('r');

	//弾く
	socket.on('p', function(id, uid, vol) {
		if (!window.DISCONNECT.is(":checked")) {
			if (uid in window.USER_PIANO_VOLUME) {
				playPianoA(id, uid, vol * window.USER_PIANO_VOLUME[uid]);
			} else {
				playPianoA(id, uid, vol);
			}
		}

		if (window.MIDI_OUTPUT) {
			var note_number = window.MIDI_KEY_NAMES.indexOf(id);
			if (note_number == -1) return;
			note_number = note_number + 21;

			window.MIDI_OUTPUT.send([0x90, note_number, vol / 1.5 * 127], window.performance
				.now());

			setTimeout(function() {
				window.MIDI_OUTPUT.send([0x80, note_number, 0], window.performance.now());
			}, 1000);
		}
	});

	//離す
	socket.on('r', function(id, uid) {
		if (!window.DISCONNECT.is(":checked")) {
			releaseBufferA(id, uid);
		}

		if (window.MIDI_OUTPUT) {
			var note_number = window.MIDI_KEY_NAMES.indexOf(id);
			if (note_number == -1) return;
			note_number = note_number + 21;

			window.MIDI_OUTPUT.send([0x80, note_number, 0], window.performance.now());
		}
	});

	$('.setting').off('click');
	$(".setting").click(function(e) {
		e.preventDefault();

		$.ajax({
			url: "setting.html?" + new Date().getTime(),
		}).done(function(res) {

			var fg = $(
				"<div class=fg style='z-index:10000;background:rgba(0,0,0,.5);position:fixed;top:0;left:0;width:100%;height:100%;text-align:center'></div>"
			);
			var win = $(
				"<div style='text-align:center;width:100%'><div style='background:#111;color:white'>チャット設定</div><div class=win_inner style='display:inline-block;margin-top:30px;background:white;width:90%;padding:2px'>" +
				"<div style='margin-bottom:20px;'>" + res + "</div></div></div>");
			fg.append(win);

			$(win).on("click", ".closeSetting", function() {
				fgClose();
			});

			$(fg).click(function() {
				$(win).find(".closeSetting").trigger("click");
			})

			win.click(function(e) {
				e.stopPropagation()
					//return false;
			})
			$(".modal").append(fg);

			$(fg).hide().fadeIn("fast", function() {
				on_setting_open();
			});


			let settings = win.find("div .settings");
			// オプションにリリースを追加
			settings.append("<div class=\"hdr\">ピアノの設定</div>")
				.append(
					"<div class=\"con\"><table><tbody><tr><td><div style=\"display:inline-block\">リリース(音の伸び）<br><input type=\"range\" min=\"0.0\" max=\"1.0\" step=\"0.05\" class=\"range\" id=\"piano_release\"></div></td><td><div style=\"display:inline-block\">Off-固定音量-On<br><input type=\"range\" min=\"0\" max=\"1\" step=\"1\" class=\"range\" id=\"fixeDing\"></div></td><td><div style=\"display:inline-block\">自分の音量<br><input type=\"range\" min=\"0.0\" max=\"5.0\" step=\"0.01\" class=\"range\" id=\"selfVolume\"></div></td><td><div style=\"display:inline-block\">移調<br><select id=\"pianoTranspose\"></select></div></td></tr></tbody></table></div></td></tr></tbody></table></div></td></tr></tbody></table></div></td></tr></tbody></table></div></td><td><div style=\"display:inline-block\">｜ディティール<br><input type=\"range\" min=\"200000\" max=\"400000\" step=\"10000\" class=\"range\" id=\"detail\"></div>"
				)
				// 移調機能
			for (let i = 6; i >= 0; --i) {
				$("#pianoTranspose").append($('<option>').html(i).val(i));
			}
			for (let i = 1; i <= 5; ++i) {
				$("#pianoTranspose").append($('<option>').html(-i).val(-i));
			}
			$("#pianoTranspose").val(String(window.PIANOTRANSPOSE));

			$("#pianoTranspose").on('change', function() {
				window.PIANOTRANSPOSE = parseInt($(this).val());
				setCookie("pianoTranspose", window.PIANOTRANSPOSE);
			});
			// リリース設定
			$('#piano_release').val(window.PIANORELEASE);
			$('#piano_release').on('change', function() {
				window.PIANORELEASE = parseFloat($(this).val());
				setCookie("piano_release", window.PIANORELEASE);
			});
			// 自分の音量
			$('#selfVolume').val(window.SELFVOLUME);
			$('#selfVolume').on('change', function() {
				window.SELFVOLUME = parseFloat($(this).val());
				setCookie("selfVolume", window.SELFVOLUME);
			});
			//固定音量
			$('#fixeDing').val(window.FIXEDING);
			$('#fixeDing').on('change', function() {
				window.FIXEDING = parseFloat($(this).val());
				setCookie("fixeDing", window.FIXEDING);
			});
			// オプションにMIDI INOUTの選択ボックスを追加する
			settings.append("<div class=\"hdr\">MIDI INOUT</div>")
				.append(
					"<div class=\"con\"><table><tbody><tr><td><div style=\"display:inline-block\">MIDI IN <br><select id=\"midi_input\"></select></div></td> <td><div style=\"display:inline-block\">MIDI OUT <br><select id=\"midi_output\"></select></div></td></tr></tbody></table></div></div>"
				);

			// 入力MIDIデバイスの記録
			$("#midi_input").append($('<option>').html("未設定").val("未設定"));
			for (let input of window.MIDI_INPUTS) {
				$("#midi_input").append($('<option>').html(input.name).val(input.name));
				$("#midi_input").val(window.selectInputMidiName);
				$("#midi_output").append($('<option>').html("未設定").val("未設定"));
			}
			// 出力MIDIデバイスの記録
			for (let output of window.MIDI_OUTPUTS) {
				$("#midi_output").append($('<option>').html(output.name).val(output.name));
			}
			$("#midi_output").val(window.selectOutputMidiName);

			$('#midi_input').change(function() {
				window.selectInputMidiName = $(this).val();
				updateInputsOutputs();
				setCookie("midiInput", window.selectInputMidiName);
			})

			$('#midi_output').change(function() {
				window.selectOutputMidiName = $(this).val();
				updateInputsOutputs();
				setCookie("midiOutput", window.selectOutputMidiName);
			})


			// ユーザーごとの音量設定
			settings.append("<div class=\"hdr\">ユーザー設定</div>")
				.append(
					"<div class=\"con\"><table><tbody><tr><td><div style=\"display:inline-block\">ユーザー <br><select id=\"selectedUser\"></select></div></td><td><div style=\"display:inline-block\">音量 <br><input type=\"range\" min=\"0.0\" max=\"2.0\" step=\"0.05\" class=\"range\" id=\"userVolume\"></div></td></tr></tbody></table></div></td></tr></tbody></table></div></td></tr></tbody></table></div>"
				);

			for (let user of window.ONLINE_USERS) {
				$("#selectedUser").append($('<option>').html(user).val(user));
			}
			$('#selectedUser').change(function() {
				let user = $('#selectedUser').val();
				if (user in window.USER_PIANO_VOLUME) {
					$('#userVolume').val(String(window.USER_PIANO_VOLUME[user]));
				} else {
					window.USER_PIANO_VOLUME[user] = 1.0;
				}
			});
			// チャットの設定
			settings.append('<div class="hdr">補助機能</div>')
				.append(
					'<div class="con"><table><tbody><tr><td><div style="display:inline-block">アイコンサイズ<br><input type="number" id="iconsize" min="12" max="48"></div></td></tr></tbody></table></div></td></tr></tbody></table></div><div class="con"><table><tbody><tr>')
            //アイコンサイズ
			$('#iconsize').val(window.ICONSIZE);
			$('#iconsize').on('change', function() {
				let size = parseInt($(this).val());
				window.ICONSIZE = size;
				setCookie("iconsize", window.ICONSIZE);
		});
	});
});
	// =============== MIDIの入れ替え ====================
	navigator.requestMIDIAccess = window.MIDIACCESS_BACK;

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
		navigator.requestMIDIAccess().then(successCallback, faildCallback);
	}


	// ============== 鍵盤の入れ替え ===============
	// 鍵盤を削除
	$('#canvas').remove();

	let whiteKey =
		'<div style="width: 1.92308%; z-index: 0; background-color: white; height: 100%; border: 1px solid gray; position: absolute; left: 0.0%" class="whiteKey pianoKey">';
	let blackKey =
		'<div style="width: 1.28205%; z-index: 1; height: 60%; background-color: #333; position: absolute; left: 0.0%" class="blackKey pianoKey">';
	let left = 0.0;
	let keyID = 21;

	// 新しい鍵盤を追加
	$('body > div.all > div.header').after(
		'<div id="keyboard" style="width: 95%; height: 20%; margin: auto; position: relative; min-height: 180px;"></div>'
	)
	$('#keyboard')
		.append($(whiteKey).attr("id", String(keyID)))
		.append($(blackKey).css("left", String(left + 1.28205) + "%").attr("id",
			String(keyID += 1)))
		.append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id",
			String(keyID += 1)));

	for (let i = 0; i < 7; ++i) {
		$('#keyboard')
			.append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id",
				String(keyID += 1)))
			.append($(blackKey).css("left", String(left + 1.28205) + "%").attr("id",
				String(keyID += 1)))
			.append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id",
				String(keyID += 1)))
			.append($(blackKey).css("left", String(left + 1.28205) + "%").attr("id",
				String(keyID += 1)))
			.append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id",
				String(keyID += 1)))
			.append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id",
				String(keyID += 1)))
			.append($(blackKey).css("left", String(left + 1.28205) + "%").attr("id",
				String(keyID += 1)))
			.append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id",
				String(keyID += 1)))
			.append($(blackKey).css("left", String(left + 1.28205) + "%").attr("id",
				String(keyID += 1)))
			.append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id",
				String(keyID += 1)))
			.append($(blackKey).css("left", String(left + 1.28205) + "%").attr("id",
				String(keyID += 1)))
			.append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id",
				String(keyID += 1)));
	}
	$('#keyboard')
		.append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id",
			String(keyID += 1)));

	// 鍵盤クリック時
	$('div .pianoKey').on('mousedown', function() {
		let id = parseInt($(this).attr("id"));
		pressA(id, 1.0);
		releaseA(id);
	});


	// チャットを下まで伸ばします
	$("#chat").css("max-height", "50%");
})

function donation(vol)
{
    setTimeout(function(){socket.emit('p', 'f3', vol);}, 10120);
    setTimeout(function(){socket.emit('p', 'ds3', vol);}, 10160);
    setTimeout(function(){socket.emit('p', 'b2', vol);}, 10200);
    setTimeout(function(){socket.emit('p', 'f4', vol);}, 10240);
    setTimeout(function(){socket.emit('p', 'ds4', vol);}, 10280);
    setTimeout(function(){socket.emit('p', 'b3', vol);}, 10320);
    setTimeout(function(){socket.emit('p', 'f5', vol);}, 10360);
    setTimeout(function(){socket.emit('p', 'ds5', vol);}, 10400);
    setTimeout(function(){socket.emit('p', 'b4', vol);}, 10440);
}
function think(id, vol)
{
    var index = window.MIDI_KEY_NAMES.indexOf(id);

    setTimeout(function(){socket.emit('p', window.MIDI_KEY_NAMES[index], vol);}, 10000);
}


addJS_Node(releaseSustainA);
addJS_Node(pressA);
addJS_Node(releaseA);
addJS_Node(playPianoA);
addJS_Node(playBufferA);
addJS_Node(releaseBufferA);
addJS_Node(ease);
addJS_Node(donation);
addJS_Node(think);

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
