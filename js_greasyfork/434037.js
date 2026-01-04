// ==UserScript==
// @name         epiano
// @namespace    https://epiano.jp/
// @version      2.60
// @description
// @match        https://epiano.jp/sp/*
// @grant        none
// @run-at document-start
// @noframes
// @description chin-chin
// @downloadURL https://update.greasyfork.org/scripts/434037/epiano.user.js
// @updateURL https://update.greasyfork.org/scripts/434037/epiano.meta.js
// ==/UserScript==

window.MIDIACCESS_BACK = navigator.requestMIDIAccess;
navigator.requestMIDIAccess = null;
window.ICONSIZE = 20;

function releaseBuffer(key, uid) {
    const id = uid + key;

    if (id in playings) {
        for (i in playings[id]) {
            const ar = playings[id][i];
            const time = window.context.currentTime;
            const source = ar[0]
            const gain = ar[1];

            gain.setValueAtTime(gain.value, time);
            gain.linearRampToValueAtTime(0, time + window.PIANORELEASE);
            source.stop(time + window.PIANORELEASE);
        }

        delete playings[id];
    }
}

function playBuffer(key, vol, uid) {
    if (isNaN(vol)) {
        vol = DEFAULT_VELOCITY;
    }
    if (key in buffers) {
        const source = window.context.createBufferSource();
        source.buffer = buffers[key];

        const gainNode = window.context.createGain();
        gainNode.connect(window.context.destination);
        gainNode.gain.value = 0;
        gainNode.gain.linearRampToValueAtTime(vol * window.PIANOVOLUME, window.context.currentTime + window.PIANOATTACK);
        gainNode.gain.linearRampToValueAtTime(vol * window.PIANOVOLUME * window.PIANOSUSTAIN, window.context.currentTime + window.PIANOATTACK + window.PIANODECAY);

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


function press(id, vol) {
    //held
    const newVol = ease(vol, 1.5, 0.0, 2.0) * window.SELFVOLUME;
    gHeldNotes[id] = true;
    gSustainedNotes[id] = true;

    playPiano(id, loginInfo.myID, newVol);

    if (!$("#disconnect").is(":checked")) {
        socket.emit('p', id, newVol);
    }

    window.HOLD_KEY_ID.add(window.MIDI_KEY_NAMES.indexOf(id));
    if (window.CHORDVIEWMODE) {
        setTimeout(displayChordView, 0);
    }
}

function release(id) {
    if (gHeldNotes[id]) {
        delete gHeldNotes[id];
        if (gAutoSustain || gSustain) {
            gSustainedNotes[id] = true;
        } else {
            gSustainedNotes[id] = false;
            releasePiano(id, loginInfo.myID);

            if (!$("#disconnect").is(":checked")) {
                socket.emit('r', id);
            }
            window.HOLD_KEY_ID.delete(window.MIDI_KEY_NAMES.indexOf(id));
        }
    }
}

function playPiano(id, uid, vol) {
    if (ignoreList[uid]) {
        return;
    }

    var newVol = vol;
    // 音量制限
    if (newVol > 2.0 || newVol < -1) {
        newVol = 2.0;
    }
    playBuffer(id, newVol, uid);

    // ユーザーID点滅
    const pikaColor = uid == loginInfo.myID ? "#00FF00" : "#FF0000";
    if (!window.DISCONNECT.is(":checked")) {
        $("[uid=" + uid + "]").css("backgroundColor", pikaColor)
            .stop(true)
            .show()
            .animate({ top: "3px" }, 100)
            .animate({ top: "0px" }, 50)
            .queue(function () {
                $(this).css("backgroundColor", "").dequeue();
            });
    }

    // 鍵盤点滅
    const pikaID = window.MIDI_KEY_NAMES.indexOf(id) + 21;
    const originalColor = $('#' + pikaID).attr("class").split(" ")[0] == "whiteKey" ? "white" : "#333";
    $('#' + pikaID).css("backgroundColor", pikaColor)
        .delay(100)
        .queue(function () {
            $(this).css("backgroundColor", originalColor).dequeue();
        });
}


// ============= チャット関連 ==================
function displayChordView() {
    let notes = [];
    for (let id of window.HOLD_KEY_ID) {
        notes.push(id - 3);
    }
    notes.sort((a, b) => a - b);
    for (let i = 0; i < notes.length; ++i) {
        notes[i] = modC(notes[i], 12);
    }
    let chord = Chord.noteToChord(notes);

    if (chord) {
        $("#chordViewText").text(chord.getChordText());
    }
    else
    {
        $("#chordViewText").text("");
    }
}

function displayChord(chord) {
    let chordObj = new Chord(chord);

    let firstToneIndex = 60;
    let notes = chordObj.getNotes();
    let toneIndex = 0;

    if (chordObj.isOnChord()) {
        let bassNote = notes.pop();
        notes.unshift(bassNote);
    }

    for (let note of notes) {
        let pikaID = firstToneIndex + note.getNoteIndex();
        if (note.getNoteIndex() < toneIndex) {
            pikaID += 12;
        }
        else {
            toneIndex = note.getNoteIndex();
        }
        const pikaColor = "#C030C0";
        const originalColor = $('#' + pikaID).attr("class").split(" ")[0] == "whiteKey" ? "white" : "#333";
        $('#' + pikaID).css("backgroundColor", pikaColor)
            .delay(1000)
            .queue(function () {
                $(this).css("backgroundColor", originalColor).dequeue();
            });
    }
}

function html_parse(html) {
    var text = html;
    let excludeText = text.replace(/https:\/\/i.imgur.com\/([^\.]+)\.(png|jpg|gif)/g, 'imgur');
    excludeText = excludeText.replace(/https:\/\/(?:www|\m).youtube.com\/watch\?v=([\d\w_\-]+)(?:&[;\?a-z\.\&=]+|)/g, 'youtube');
    excludeText = excludeText.replace(/https:\/\/youtu.be\/([\d\w_\-]+)/g, 'youtube');

    text = text.replace(/https:\/\/i.imgur.com\/([^\.]+)\.(png|jpg|gif)/g, '[imgur:$1:$2]');
    text = text.replace(/https:\/\/(?:www|\m).youtube.com\/watch\?v=([\d\w_\-]+)(?:&[;\?a-z\.\&=]+|)/g, '[youtube:$1]');
    text = text.replace(/https:\/\/youtu.be\/([\d\w_\-]+)/g, '[youtube:$1]');

    let chordsDiv = [];
    if (excludeText.indexOf("imgur") == -1 && excludeText.indexOf("youtube")) {
        // 和音を検出する
        text = text.replace(/\[.+?\]/, function ($1) {
            var chord = $1.replace("[", "").replace("]", "");
            var chordDiv = '<div chord="' + chord + '" class="chord" style="padding: 5px; margin-bottom: 5px; border: 1px dotted #333333; border-radius: 5px; background-color: #009999; color: #ffffff; display: inline-block;">' + chord + '</div>';

            chordsDiv.push(chordDiv);
            return "";
        });
    }

    text = text.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g, function ($1) {
        var url = $1;
        var text = url.replace(/https:\/\/|www\./g, "");

        return '<a target=_blank href="' + url + '"><div class=url_wrap><i class="fa fa-external-link" aria-hidden="true"></i>' + text + '</div></a>'
    });

    text = text.replace(/\[youtube:[^\]]+]/g, function ($1) {
        var val = $1.match(/\[(.*)\]/)[1].split(/:/);
        var vid = val[1];
        var thumb = "http://img.youtube.com/vi/" + vid + "/default.jpg";
        var url = "https://www.youtube.com/watch?v=" + vid;
        return '<div class=youtube_wrap><i class="fa fa-play youtubePlayButton" aria-hidden="true"></i>' +
            '<a class=youtube href="' + url + '" vid="' + vid + '"><img style="height:40px" src=' + thumb + '></a></div>';
    });


    text = text.replace(/\[imgur:[^\]]+]/g, function ($1) {
        var val = $1.match(/\[(.*)\]/)[1].split(/:/);
        var imid = val[1];
        var kaku = val[2];
        var thumb = "https://i.imgur.com/" + imid + "s." + kaku;
        var url = "https://i.imgur.com/" + imid + "." + kaku;
        return '<a class=imgur data-lightbox="imgur" title="<a href=# class=share_pic>コラボする</a>" href=' + url + '><img style="height:40px" src=' + thumb + '></a>';
    });

    return [text, chordsDiv];
}

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

    var values = html_parse(_text);
    let text = values[0];
    let chords = values[1];

    var turl = "https://twitter.com/" + twid;

    var new_line;

    if (icon) {
        new_line = $("<div time=" + time + " class='ll anon_line lines hide " + uid + "'>" +
            ("<table><tr valign=top><td align=center>" +
                "<a href='" + turl + "' target=_blank><img class=icon border=0 width=" + window.ICONSIZE + " height=" + window.ICONSIZE + " src=" + icon + "></a><br>") +
            "<div style='color:#" + uid + ";font-size:7pt;' val=" + uid + " class='chart_uid'><b>" + uid + "</b></div>" +
            "</td><td>" +
            '<div class="huki_wrap"><div class="huki">' + text + "</div></div>" +
            "<font color=#999 style='font-size:5pt'>&nbsp;&nbsp;" + time2date(time) + " </font>" +
            "</td></table>" + "</div>");

    } else {
        new_line = $("<div time=" + time + " class='ll lines hide " + uid + "'>" +
            "<b style='word-wrap: normal;color:#888' val=" + uid + " class='chart_uid'>" + uid + "：</b>" + text +
            "<font color=#999 style='font-size:5pt'>&nbsp;" + time2date(time) + " </font>" +
            "</div>");
    }


    if (new String(text).match(new RegExp("&gt;" + loginInfo.myID))) {
        new_line.addClass("get_anka");
    }

    if (uid == loginInfo.myID) {
        new_line.find(".chart_uid").addClass("self");
    }

    for (let chord of chords) {
        var chordDiv = $(chord);
        chordDiv.on('mouseover', function () {
            $(this).css("backgroundColor", '#008888');
        })
        chordDiv.on('mouseleave', function () {
            $(this).css("backgroundColor", '#009999');
        })
        chordDiv.on('click', function () {
            displayChord(chordDiv.attr("chord"));
        });

        if (icon) {
            chordDiv.attr("width", "100%");
            new_line.find("div .huki").append(chordDiv);
        }
        else {
            chordDiv.attr("width", "5%");
            new_line.find("b").after(chordDiv);
        }

    }


    if (obj.is_log) {
        $("#chat").prepend(new_line);
    } else {
        $("#chat").append(new_line);
    }



    $(new_line).slideDown("fast", function () { $(this).removeClass("hide") });


    if ($("#chat").position().top < 0) {
        $("#chat div:first").remove();
    }

    if ($("#chat").hasClass("log_done")) {
        var now = $("#chat").scrollTop();
        var max = $("#chat").get(0).scrollHeight - $("#chat").outerHeight();;
        var per = parseInt(now / max * 100);
        if ($(".ll").length > 20) {
            if (per > 90) {
                setTimeout(function () {
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
    $(list).each(function (i) {
        var uid = list[i];
        var isIgnore = ignoreList[uid] ? "class='ignore' style='text-decoration:line-through;background:#999'" : "";
        htmls.push("<span class=user" + isIgnore + " uid=" + uid + ">" + uid + "</span>");
    });
    $("#users").html(htmls.join(""));
    $("#onlineNumber").html(htmls.length);
}



// ============== MIDI関連 =====================

// inputのmidiメッセージの処理関数
function inputMidiMessageHandler(evt) {
    let note_number = evt.data[1] + window.PIANOTRANSPOSE - 21;
    switch (evt.data[0] & 0xf0) {
        // NOTE_ON
        case 0x90:
            if (evt.data[2] > 0) {
                press(window.MIDI_KEY_NAMES[note_number], evt.data[2] / 127.0);
            }
            else {
                release(window.MIDI_KEY_NAMES[note_number]);
            }
            return;
        // NOTE_OFF
        case 0x80:
            release(window.MIDI_KEY_NAMES[note_number]);
            return;

        case 0xB0:
            if (evt.data[1] == 64) {
                if (evt.data[2] > 0) {
                    $(document).trigger("pressSustain");
                } else {
                    $(document).trigger("releaseSustain");
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
        }
        else {
            input.onmidimessage = null;
        }
    }

    for (let output of window.MIDI_OUTPUTS) {
        if (output.name == window.selectOutputMidiName) {
            console.log("MIDI OUTPUT " + window.selectOutputMidiName + "を使用します。");
            window.MIDI_OUTPUT = output;
        }
        else {
            output.onmidimessage = null;
        }
    }
}

// MIDI接続成功時
function successCallback(midi) {
    window.MIDIDevice = midi;

    midi.addEventListener("statechange", function (evt) {
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
String.prototype.findFirstOf = function (chars, start) {
    var idx = -1;
    [].some.call(this.slice(start || 0), function (c, i) {
        if (chars.indexOf(c) >= 0)
            return idx = i, true;
    });
    return idx >= 0 ? idx + (start || 0) : -1;
}
function array_equal(a, b) {
    if (!Array.isArray(a)) return false;
    if (!Array.isArray(b)) return false;
    if (a.length != b.length) return false;
    for (var i = 0, n = a.length; i < n; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
window.C_MAJOR_SCALE = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
window.C_SHARP_MAJOR_SCALE = ["C#", "D", "D#", "E", "E#", "F#", "F##", "G#", "A", "A#", "B", "B#"];
window.D_FLAT_MAJOR_SCALE = ["Db", "Ebb", "Eb", "Fb", "F", "Gb", "G", "Ab", "Bbb", "Bb", "Cb", "C"];
window.D_MAJOR_SCALE = ["D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B", "C", "C#"];
window.E_FLAT_MAJOR_SCALE = ["Eb", "Fb", "F", "Gb", "G", "Ab", "A", "Bb", "Cb", "C", "Db", "D"];
window.E_MAJOR_SCALE = ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#"];
window.F_MAJOR_SCALE = ["F", "Gb", "G", "Ab", "A", "Bb", "B", "C", "Db", "D", "Eb", "E"];
window.F_SHARP_MAJOR_SCALE = ["F#", "G", "G#", "A", "A#", "B", "B#", "C#", "D", "D#", "E", "E#"];
window.G_FLAT_MAJOR_SCALE = ["Gb", "Abb", "Ab", "Bbb", "Bb", "Cb", "C", "Db", "Ebb", "Eb", "Fb", "F"];
window.G_MAJOR_SCALE = ["G", "Ab", "A", "Bb", "B", "C", "C#", "D", "Eb", "E", "F", "F#"];
window.A_FLAT_MAJOR_SCALE = ["Ab", "Bbb", "Bb", "Cb", "C", "Db", "D", "Eb", "Fb", "F", "Gb", "G"];
window.A_MAJOR_SCALE = ["A", "Bb", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
window.B_FLAT_MAJOR_SCALE = ["Bb", "Cb", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A"];
window.B_MAJOR_SCALE = ["B", "C", "C#", "D", "D#", "E", "E#", "F#", "G", "G#", "A", "A#"];
window.C_FLAT_MAJOR_SCALE = ["Cb", "Dbb", "Ebb", "Eb", "Fb", "F", "Gb", "Abb", "Ab", "Bbb", "Bb"];

window.A_MINOR_SCALE = ["A", "Bb", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
window.E_MINOR_SCALE = ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#"];
window.B_MINOR_SCALE = ["B", "C", "C#", "D", "D#", "E", "E#", "F#", "G", "G#", "A", "A#"];
window.F_SHARP_MINOR_SCALE = ["F#", "G", "G#", "A", "A#", "B", "B#", "C#", "D", "D#", "E", "E#"];
window.C_SHARP_MINOR_SCALE = ["C#", "D", "D#", "E", "E#", "F#", "F##", "G#", "A", "A#", "B", "B#"];
window.G_SHARP_MINOR_SCALE = ["G#", "A", "A#", "B", "B#", "C#", "C##", "D#", "E", "E#", "F#", "F##"];
window.D_SHARP_MINOR_SCALE = ["D#", "E", "E#", "F#", "F##", "G#", "G##", "A#", "B", "B#", "C#", "C##"];
window.A_SHARP_MINOR_SCALE = ["A#", "B", "B#", "C#", "C##", "D#", "D##", "E#", "F#", "F##", "G#", "G##"];
window.D_MINOR_SCALE = ["D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B", "C", "C#"];
window.G_MINOR_SCALE = ["G", "Ab", "A", "Bb", "B", "C", "C#", "D", "Eb", "E", "F", "F#"];
window.C_MINOR_SCALE = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
window.F_MINOR_SCALE = ["F", "Gb", "G", "Ab", "A", "Bb", "B", "C", "Db", "D", "Eb", "E"];
window.B_FLAT_MINOR_SCALE = ["Bb", "Cb", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A"];
window.E_FLAT_MINOR_SCALE = ["Eb", "Fb", "F", "Gb", "G", "Ab", "A", "Bb", "Cb", "C", "Db", "D"];
window.A_FLAT_MINOR_SCALE = ["Ab", "Bbb", "Bb", "Cb", "C", "Db", "D", "Eb", "Fb", "F", "Gb", "G"];

window.TONE_MAP = { "C": 0, "Db": 1, "C#": 1, "D": 2, "Eb": 3, "D#": 3, "E": 4, "F": 5, "Gb": 6, "F#": 6, "G": 7, "Ab": 8, "G#": 8, "A": 9, "Bb": 10, "A#": 10, "B": 11 };
window.FLAT_SCALE_MAP = { 0: "C", 1: "Db", 2: "D", 3: "Eb", 4: "E", 5: "F", 6: "Gb", 7: "G", 8: "Ab", 9: "A", 10: "Bb", 11: "B" };
window.CHORD_MAP = {
    "5": [0, 7],
    "": [0, 4, 7],
    "m": [0, 3, 7],
    "-5": [0, 4, 6],
    "dim": [0, 3, 6],
    "aug": [0, 4, 8],
    "sus2": [0, 2, 7],
    "sus4": [0, 5, 7],
    "6": [0, 4, 7, 9],
    "7": [0, 4, 7, 10],
    "M7": [0, 4, 7, 11],
    "m6": [0, 3, 7, 9],
    "m7": [0, 3, 7, 10],
    "mM7": [0, 3, 7, 11],
    "7-5": [0, 4, 6, 10],
    "M7-5": [0, 4, 6, 11],
    "m7-5": [0, 3, 6, 10],
    "mM7-5": [0, 3, 6, 11],
    "aug7": [0, 4, 8, 10],
    "augM7": [0, 4, 8, 11],
    "aug(b9)": [0, 4, 8, 1],
    "7sus4": [0, 5, 7, 10],
    "dim7": [0, 3, 6, 9],
    "add9": [0, 4, 7, 2],
    "add11": [0, 4, 7, 5],
    "madd9": [0, 3, 7, 2],
    "69": [0, 4, 7, 9, 2],
    "7(9)": [0, 4, 7, 10, 2],
    "7(13)": [0, 4, 7, 10, 9],
    "7(b9)": [0, 4, 7, 10, 1],
    "7(#9)": [0, 4, 7, 10, 3],
    "7(#11)": [0, 4, 7, 10, 6],
    "7(b13)": [0, 4, 7, 10, 8],
    "7-5(9)": [0, 4, 6, 10, 2],
    "7-5(#9)": [0, 4, 6, 10, 3],
    "7-5(b13)": [0, 4, 6, 10, 8],
    "M7(9)": [0, 4, 7, 11, 2],
    "M7(13)": [0, 4, 7, 11, 9],
    "M7(#9)": [0, 4, 7, 11, 3],
    "M7(#11)": [0, 4, 7, 11, 6],
    "M7(b9)": [0, 4, 7, 11, 1],
    "m69": [0, 3, 7, 9, 2],
    "m7(9)": [0, 3, 7, 10, 2],
    "m7(11)": [0, 3, 7, 10, 5],
    "m7(13)": [0, 3, 7, 10, 9],
    "m7(b9)": [0, 3, 7, 10, 1],
    "m7-5(9)": [0, 3, 6, 10, 2],
    "m7-5(11)": [0, 3, 6, 10, 5],
    "mM7(9)": [0, 3, 7, 11, 2],
    "mM7(13)": [0, 3, 7, 11, 9],
    "aug7(9)": [0, 4, 8, 10, 2],
    "augM7(#9)": [0, 4, 8, 11, 3],
    "augM7(9)": [0, 4, 8, 11, 2],
    "7(9, 11)": [0, 4, 7, 10, 2, 5],
    "7(9, 13)": [0, 4, 7, 10, 2, 9],
    "7(9, b13)": [0, 4, 7, 10, 2, 8],
    "7(9, #11)": [0, 4, 7, 10, 2, 6],
    "7(b9, 13)": [0, 4, 7, 10, 1, 9],
    "7(b9, b13)": [0, 4, 7, 10, 1, 8],
    "7(b9, #9)": [0, 4, 7, 10, 1, 3],
    "7(b9, #11)": [0, 4, 7, 10, 1, 6],
    "7(#9, 13)": [0, 4, 7, 10, 3, 9],
    "7(#9, b13)": [0, 4, 7, 10, 3, 8],
    "7(#9, #11)": [0, 4, 7, 10, 3, 6],
    "7(#11, 13)": [0, 4, 7, 10, 6, 9],
    "m7(9, 11)": [0, 3, 7, 10, 2, 5],
    "m7(9, 13)": [0, 3, 7, 10, 2, 9],
    "M7(9, 11)": [0, 4, 7, 11, 2, 5],
    "M7(9, 13)": [0, 4, 7, 11, 2, 9],
    "M7(9, #11)": [0, 4, 7, 11, 2, 6],
    "mM7(9, 13)": [0, 3, 7, 11, 2, 9],
    "7(9, 11, 13)": [0, 4, 7, 10, 2, 5, 9],
    "7(9, #11, 13)": [0, 4, 7, 10, 2, 6, 9],
    "7(b9, #11, 13)": [0, 4, 7, 10, 1, 6, 9],
    "m7(9, 11, 13)": [0, 3, 7, 10, 2, 5, 9],
    "M7(9, 11, 13)": [0, 4, 7, 11, 2, 5, 9],
    "M7(9, #11, 13)": [0, 4, 7, 11, 2, 6, 9],
};

function modC(a, n) {
    return ((a % n) + n) % n;
}

class Note {
    constructor(noteText) {
        this.rawNoteText = noteText;
        this.disable = false;
        this.scale = window.C_MAJOR_SCALE;

        let parseValues = this.parseNote(noteText);
        this.normedText = parseValues[0];
        this.accidentals = parseValues[1];
    }

    parseNote(noteText) {
        let noteTextLength = noteText.length;
        if (noteTextLength == 1) {
            return noteText;
        }

        let normedNoteText = "";
        let accidentals = "";
        let noteIndex = window.TONE_MAP[noteText.substr(0, 1)];

        for (let i = 1; i < noteTextLength; ++i) {
            if (noteText[i] == '#') {
                noteIndex += 1;
                accidentals += '#';
            }
            else if (noteText[i] == 'b') {
                noteIndex -= 1;
                accidentals += 'b';
            }
        }

        noteIndex = modC(noteIndex, 12);
        normedNoteText = window.FLAT_SCALE_MAP[noteIndex];

        return [normedNoteText, accidentals];
    }

    // 移調する
    transposed(steps) {
        let noteIndex = this.getNoteIndex();
        let transposedNoteIndex = modC(noteIndex + steps, 12);
        return new Note(this.scale[transposedNoteIndex]);
    }

    getScaledNoteText() {
        let cShiftIndex = 0;
        for (let i = 0; i < this.scale.length; ++i) {
            if (new Note(this.scale[i]).getNormedNoteText() == "C") {
                cShiftIndex = i;
            }
        }

        let cShiftNoteIndex = modC(this.getNoteIndex() + cShiftIndex, 12);

        return this.scale[cShiftNoteIndex];
    }
    setDisable(disable) {
        this.disable = disable;
    }

    isDisable() {
        return this.disable;
    }

    getNoteIndex() {
        return window.TONE_MAP[this.getNormedNoteText()];
    }

    getAccidentals() {
        return this.accidentals;
    }

    getNormedNoteText() {
        return this.normedText;
    }

    getRawNoteText() {
        return this.rawNoteText;
    }

    static createTensionNote(tension) {
        let tensionNote;
        if (tension == "2" || tension == "9") {
            tensionNote = new Note("D");
        }
        else if (tension == "11" || tension == "4") {
            tensionNote = new Note("F");
        }
        else if (tension == "13" || tension == "6") {
            tensionNote = new Note("A");
        }
        else if (tension == "#9") {
            tensionNote = new Note("Eb");
        }
        else if (tension == "b9") {
            tensionNote = new Note("Db");
        }
        else if (tension == "#11") {
            tensionNote = new Note("F#");
        }
        else if (tension == "b13") {
            tensionNote = new Note("Ab");
        }

        return tensionNote;
    }

    static createIndexNote(index) {
        return new Note(window.FLAT_SCALE_MAP[index]);
    }
}

class QualityParser {
    constructor() { }

    static parse(qualityText) {
        let tensionInParentheses = this.findTensionInParentheses(qualityText);
        let tensions = this.findTension(qualityText);

        let tensionValues = this.calcTensions(tensions, tensionInParentheses);

        return [
            tensionValues[0],
            this.calcAlteredTention(tensions, tensionInParentheses),
            this.calcAddTensions(qualityText),
            this.calcQualities(qualityText),
            this.existsSeventh(qualityText) || tensionValues[1]
        ];
    }

    static findTensionInParentheses(qualityText) {
        let tensions = [];
        let match = qualityText.match(/\(.*?\)/);
        if (!match) {
            return tensions;
        }

        let prefixText = match[0];

        {
            let pattern = /[#b]9|#11|b13|b5/g;
            let matchTentions = prefixText.match(pattern);

            if (matchTentions) {
                prefixText = prefixText.replace(pattern, "");
                tensions = tensions.concat(matchTentions);
            }
        }
        {
            let pattern = /9|11|13/g;
            let matchTensions = prefixText.match(pattern);

            if (matchTensions) {
                prefixText = prefixText.replace(pattern, "");
                tensions = tensions.concat(matchTensions);
            }
        }

        return tensions;
    }
    static findTension(qualityText) {
        let tensions = [];
        let match = qualityText.match(/\(.*?\)/);
        let prefixText = qualityText;

        if (match) {
            prefixText = qualityText.replace(/\(.*?\)/, "");
        }

        let pattern = /9|11|13|[\-\+]5|2|4|6/g;
        let matchTensions = prefixText.match(pattern);

        if (matchTensions) {
            prefixText = prefixText.replace(pattern, "");
            tensions = tensions.concat(matchTensions);
        }

        return tensions;
    }

    static calcTensions(tentionsExcludeParent, tensionInParentheses) {
        let tensions = [];
        let seventh = false;

        for (let tension of tensionInParentheses) {
            if (tension.findFirstOf("#b") == -1) {
                tensions.push(tension);
            }
        }

        for (let tension of tentionsExcludeParent) {
            if (tension == "4" || tension == "6" || tension == "2") {
                tensions.push(tension);
            }
            else if (tension == "13") {
                tensions.push("13");
                tensions.push("11");
                tensions.push("9");
                seventh = true;
            }
            else if (tension == "11") {
                tensions.push("11");
                tensions.push("9");
                seventh = true;
            }
            else if (tension == "9") {
                tensions.push("9");

                if (!tentionsExcludeParent.includes("6")) {
                    seventh = true;
                }
            }
        }

        return [tensions, seventh];
    }
    static calcAlteredTention(tentionsExcludeParent, tensionInParentheses) {
        let alteredTensions = [];
        for (let tension of tentionsExcludeParent) {
            if (tension.findFirstOf("#b-+") != -1) {
                alteredTensions.push(tension);
            }
        }
        for (let tension of tensionInParentheses) {
            if (tension.findFirstOf("#b-+") != -1) {
                alteredTensions.push(tension);
            }
        }

        return alteredTensions;
    }
    static calcAddTensions(qualityText) {
        let tensions = [];
        let pattern = /add9|add11|add2|add4/g;
        let matchTensions = qualityText.match(pattern);

        if (matchTensions) {
            for (let i = 0; i < matchTensions.length; ++i) {
                matchTensions[i] = matchTensions[i].replace("add", "");
            }
            tensions = tensions.concat(matchTensions);
        }

        return tensions;
    }
    static calcQualities(qualityText) {
        let qualities = [];
        let prefixText = qualityText;

        {
            let pattern = /aug|dim|sus/g;
            let matchQualities = prefixText.match(pattern);

            if (matchQualities) {
                prefixText = prefixText.replace(pattern, "");
                qualities = qualities.concat(matchQualities);
            }
        }

        {
            let pattern = /m|M/g;
            let matchQualities = prefixText.match(pattern);

            if (matchQualities) {
                prefixText = prefixText.replace(pattern, "");
                qualities = qualities.concat(matchQualities);
            }
        }

        return qualities;
    }
    static existsSeventh(qualityText) {
        return qualityText.indexOf("7") != -1;
    }
}

class Quality {
    constructor(qualityText) {
        this.rawQualityText = qualityText;
        let parseValues = QualityParser.parse(qualityText);

        this.tensions = parseValues[0];
        this.alteredTensions = parseValues[1];
        this.addTentions = parseValues[2];
        this.qualities = parseValues[3];
        this.seventh = parseValues[4];
    }

    getQualityValue() {
        let qualityValue = [0, 0, 0, 0];

        for (let quality of this.qualities) {
            if (quality == "M") {
                qualityValue[3] += 1;
            }
            else if (quality == "m") {
                qualityValue[1] -= 1;
            }
            else if (quality == "dim") {
                qualityValue[1] -= 1;
                qualityValue[2] -= 1;
                qualityValue[3] -= 1;
            }
            else if (quality == "aug") {
                qualityValue[2] += 1;
            }
        }

        return qualityValue;
    }

    getRawQualityText() {
        return this.rawQualityText;
    }
    getQualityText() {
        let qualityText = "";

        for (let quality of this.qualities) {
            qualityText += quality;
        }

        if (this.existsSeventh()) {
            qualityText += "7";
        }

        return qualityText;
    }
    getTensions() {
        return this.tensions;
    }
    getAlteredTensions() {
        return this.alteredTensions;
    }
    getAddTensions() {
        return this.addTentions;
    }
    existsSeventh() {
        return this.seventh;
    }
    getQualities() {
        return this.qualities;
    }
}

class ChordParser {
    constructor() { }

    static parse(chordText) {
        let accidentals = this.getAccidentals(chordText);
        let root = this.getRoot(chordText, accidentals.length);
        let quality = this.getQuality(chordText, accidentals.length);
        let bass = this.getBass(chordText, accidentals.length);

        return [accidentals, root, bass, quality];
    }

    static getAccidentals(chordText) {
        let accidentals = "";
        let chordLength = chordText.length;
        if (chordLength == 1) {
            return accidentals;
        }

        for (let i = 1; i < chordLength; ++i) {
            if (chordText[i] != '#' && chordText[i] != 'b') {
                break;
            }

            accidentals += chordText[i];
        }

        return accidentals;
    }
    static getRoot(chordText, accidentalsLength) {
        return chordText.substr(0, accidentalsLength + 1);
    }
    static getBass(chordText, accidentalsLength) {
        let bass;
        let bassPos = chordText.indexOf("/");

        if (bassPos == -1) {
            bass = this.getRoot(chordText, accidentalsLength);
        }
        else {
            bass = chordText.substr(bassPos + 1);
        }

        return bass;
    }
    static getQuality(chordText, accidentalsLength) {
        let bassPos = chordText.indexOf("/");
        if (bassPos == -1) {
            return chordText.substr(accidentalsLength + 1);
        }
        else {
            return chordText.substr(accidentalsLength + 1, bassPos - (accidentalsLength + 1));
        }
    }

    static matchChord(notes, omitfive) {
        let relativeNotes = [];
        for (let note of notes) {
            relativeNotes.push(modC(note - notes[0], 12));
        }

        relativeNotes.sort((a, b) => a - b);

        for (let key in window.CHORD_MAP) {
            let qualityNotes = window.CHORD_MAP[key];
            qualityNotes.sort((a, b) => a - b);

            if (qualityNotes.length == relativeNotes.length) {
                if (array_equal(qualityNotes, relativeNotes)) {
                    return [true, key];
                }
            }

            if (omitfive)
            {
                let omitFiveNotes = qualityNotes.filter((note) => {
                    return (note != 7);
                });
                relativeNotes = relativeNotes.filter((note) => {
                    return (note != 7);
                });

                if (array_equal(omitFiveNotes, relativeNotes))
                {
                    return [true, key];
                }

                if (omitFiveNotes.length > 5)
                {
                    let omitFiveThreeNotes = omitFiveNotes.filter((note) => {
                        return (note != 4);
                    });
                    relativeNotes = relativeNotes.filter((note) => {
                        return (note != 4);
                    });

                    if (array_equal(omitFiveThreeNotes, relativeNotes))
                    {
                        return [true, key];
                    }
                }
            }
        }

        return [false, ""];
    }

    static noteToChord(notes) {
        notes = [...new Set(notes)];

        let omitFive = notes.length > 2;
        let matchValues = this.matchChord(notes, omitFive);
        if (matchValues[0]) {
            return new Chord(Note.createIndexNote(notes[0]).getNormedNoteText() + matchValues[1]);
        }


        let shiftedNotes = [];
        for (let i = 1; i < notes.length; ++i) {
            shiftedNotes.push(notes[i]);
        }

        // ベースを含まない転回系
        for (let i = 0; i < shiftedNotes.length; ++i) {
            let matchValues = this.matchChord(shiftedNotes, false);
            if (matchValues[0]) {
                return new Chord(
                    Note.createIndexNote(shiftedNotes[0]).getNormedNoteText() +
                    matchValues[1] + "/" +
                    Note.createIndexNote(notes[0]).getNormedNoteText());
            }

            // 移動
            let note = shiftedNotes.shift();
            shiftedNotes.push(note);
        }

        // ベースを含む転回系
        shiftedNotes.unshift(notes[0]);
        for (let i = 0; i < shiftedNotes.length; ++i) {
            let matchValues = this.matchChord(shiftedNotes, false);
            if (matchValues[0]) {
                return new Chord(
                    Note.createIndexNote(shiftedNotes[0]).getNormedNoteText() +
                    matchValues[1] + "/" +
                    Note.createIndexNote(notes[0]).getNormedNoteText());
            }

            // 移動
            let note = shiftedNotes.shift();
            shiftedNotes.push(note);
        }

        return null;
    }
}
class Chord {
    constructor(chordText) {
        let parseValues = ChordParser.parse(chordText);
        this.accidentals = parseValues[0];
        this.root = new Note(parseValues[1]);
        this.bass = new Note(parseValues[2]);
        this.quality = new Quality(parseValues[3]);
        this.rawChordText = chordText;
    }

    getQuality() {
        return this.quality;
    }
    getChordText() {
        return this.rawChordText;
    }
    getAccidentals() {
        return this.accidentals;
    }
    getRootText() {
        return this.root.getRawNoteText();
    }
    getBassText() {
        return this.bass.getRawNoteText();
    }
    getRoot() {
        return this.root;
    }
    getBass() {
        return this.bass;
    }
    getNotes() {
        let notes = [];
        let relativeNotes = [new Note("C"), new Note("E"), new Note("G"), new Note("Bb")];

        // クオリティによるノートの変化
        let qualityValue = this.quality.getQualityValue();
        for (let i = 0; i < qualityValue.length; ++i) {
            relativeNotes[i] = relativeNotes[i].transposed(qualityValue[i]);
        }

        // 直接変更されるクオリティーによる変化
        let qualities = this.quality.getQualities();
        for (let qua of qualities) {
            if (qua == "sus") {
                relativeNotes[2].setDisable(true);
            }
        }

        // テンションの追加
        let tensions = this.quality.getTensions();
        for (let tension of tensions) {
            let tensionNote = Note.createTensionNote(tension);
            if (tensionNote) {
                relativeNotes.push(tensionNote);
            }
        }

        let addTensions = this.quality.getAddTensions();
        for (let tension of addTensions) {
            let tensionNote = Note.createTensionNote(tension);
            if (tensionNote) {
                relativeNotes.push(tensionNote);
            }
        }

        // オルタードテンションの追加
        let alteredTensions = this.quality.getAlteredTensions();
        for (let tension of alteredTensions) {
            let tensionNote = Note.createTensionNote(tension);
            if (tensionNote) {
                relativeNotes.push(tensionNote);
            }
            else {
                if (tension == "-5") {
                    relativeNotes[2] = relativeNotes[2].transposed(-1);
                }
                else if (tension == "+5") {
                    relativeNotes[2] = relativeNotes[2].transposed(1);
                }
            }
        }

        // 7thの確認
        if (!this.quality.existsSeventh()) {
            relativeNotes[3].setDisable(true);
        }

        // 相対的なノートからルートノートの絶対的なノートに変換する
        for (let note of relativeNotes) {
            if (note.isDisable()) {
                continue;
            }

            let transposedNote = note.transposed(this.getRoot().getNoteIndex());
            // 重複確認
            if (!notes.includes(transposedNote)) {
                notes.push(transposedNote);
            }
        }

        // ベースノートの追加
        if (this.getRoot().getNoteIndex() != this.getBass().getNoteIndex()) {
            notes.push(this.getBass());
        }

        return notes;
    }

    getNoteIndexes() {
        let notes = this.getNotes();
        let noteindexes = [];

        for (let note of notes) {
            noteindexes.push(note.getNoteIndex());
        }

        return noteindexes;
    }
    getNotesText() {
        let notes = this.getNotes();
        let notesText = [];

        for (let note of notes) {
            notesText.push(note.getRawNoteText());
        }

        return notesText;
    }

    isOnChord() {
        return this.getRoot().getNoteIndex() != this.getBass().getNoteIndex();
    }

    transposed(steps) {
        let transposedRoot = this.root.transposed(steps);
        if (this.isOnChord()) {
            return new Chord(
                transposedRoot.getRawNoteText() +
                this.quality.getRawQualityText() + "/" +
                this.bass.transposed(steps).getRawNoteText());
        }
        else {
            return new Chord(
                transposedRoot.getRawNoteText() +
                this.quality.getRawQualityText()
            );
        }
    }
    // 再構成 (未実装)
    reconfigured() {

    }

    static noteToChord(notes) {
        return ChordParser.noteToChord(notes);
    }
}

// ============== メトロノーム ==================
// https://github.com/grantjames/metronome/blob/master/metronome.js
class Metronome
{
    constructor(tempo = 120)
    {
        this.audioContext = null;
        this.notesInQueue = [];
        this.currentQuarterNote = 0;
        this.tempo = tempo;
        this.lookahead = 25;
        this.scheduleAheadTime = 0.1;
        this.nextNoteTime = 0.0;
        this.isRunning = false;
        this.intervalID = null;
        this.metre = 4;
    }

    nextNote()
    {
        var secondsPerBeat = 60.0 / this.tempo;
        this.nextNoteTime += secondsPerBeat;

        this.currentQuarterNote++;
        if (this.currentQuarterNote == this.metre) {
            this.currentQuarterNote = 0;
        }
    }

    scheduleNote(beatNumber, time)
    {
        this.notesInQueue.push({ note: beatNumber, time: time });

        const osc = this.audioContext.createOscillator();
        const envelope = this.audioContext.createGain();

        osc.frequency.value = (beatNumber % this.metre == 0) ? 1000 : 800;
        envelope.gain.value = 1;
        envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

        osc.connect(envelope);
        envelope.connect(this.audioContext.destination);

        osc.start(time);
        osc.stop(time + 0.03);
    }

    scheduler()
    {
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime ) {
            this.scheduleNote(this.currentQuarterNote, this.nextNoteTime);
            this.nextNote();
        }
    }

    start()
    {
        if (this.isRunning) return;

        if (this.audioContext == null)
        {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        this.isRunning = true;

        this.currentQuarterNote = 0;
        this.nextNoteTime = this.audioContext.currentTime + 0.05;

        this.intervalID = setInterval(() => this.scheduler(), this.lookahead);
    }

    stop()
    {
        this.isRunning = false;

        clearInterval(this.intervalID);
    }

    startStop()
    {
        if (this.isRunning) {
            this.stop();
        }
        else {
            this.start();
        }
    }
}


// キーボード関連
function captureKeyboard() {
    if(IS_SP){
        return;
    }

    $(document).on("keydown", handleKeyDown );
    $(document).on("keyup", handleKeyUp);
    $(window).on("keypress", handleKeyPress );
};

function releaseKeyboard() {
    if(IS_SP){
        return;
    }

    $(document).off("keydown", handleKeyDown );
    $(document).off("keyup", handleKeyUp);
    $(window).off("keypress", handleKeyPress );
};


var NoteA = function(note, octave) {
    this.note = note;
    this.octave = octave || 0;
};
var n = function(a, b) { return {note: new NoteA(a, b), held: false}; };
var key_binding = {
    65: n("gs"),
    90: n("a"),
    83: n("as"),
    88: n("b"),
    67: n("c", 1),
    70: n("cs", 1),
    86: n("d", 1),
    71: n("ds", 1),
    66: n("e", 1),
    78: n("f", 1),
    74: n("fs", 1),
    77: n("g", 1),
    75: n("gs", 1),
    188: n("a", 1),
    76: n("as", 1),
    190: n("b", 1),
    191: n("c", 2),
    222: n("ds", 3),
    49: n("gs", 1),
    81: n("a", 1),
    50: n("as", 1),
    87: n("b", 1),
    69: n("c", 2),
    52: n("cs", 2),
    82: n("d", 2),
    53: n("ds", 2),
    84: n("e", 2),
    89: n("f", 2),
    55: n("fs", 2),
    85: n("g", 2),
    56: n("gs", 2),
    73: n("a", 2),
    57: n("as", 2),
    79: n("b", 2),
    80: n("c", 3),
    189: n("cs", 3),
    219: n("e", 3),
    192: n("d",3),
    226: n("d",2),

    186: n("cs",2),
    221: n("ds",2),
};
var capsLockKey = false;
function handleKeyDown(evt) {
    var code = parseInt(evt.keyCode);
    if(key_binding[code] !== undefined){
        var binding = key_binding[code];
        if(!binding.held) {

            binding.held = true;
            var note = binding.note;
            var octave = 1 + note.octave;
            if(evt.shiftKey) ++octave;
            else if(capsLockKey) --octave;

            var key = (note.note + octave);

            press(key)

        }
        evt.preventDefault();
        evt.stopPropagation();
        return false;

    } else if(code == 240) { // Caps Lock
        capsLockKey = !capsLockKey;
        evt.preventDefault();
    } else if(code== 32){
        $(document).trigger("pressSustain");
        evt.preventDefault();
    }
};

function handleKeyUp(evt) {
    var code = parseInt(evt.keyCode);

    if(key_binding[code] !== undefined) {
        var binding = key_binding[code];
        if(binding.held) {
            binding.held = false;

            var note = binding.note;
            var octave = 1 + note.octave;
            if(evt.shiftKey) ++octave;
            else if(capsLockKey || evt.ctrlKey) --octave;
            note = note.note + octave;

            if($("#pedal").is(":checked")){
                return;
            }
            release(note,loginInfo.myID);
        }
    } else if(code== 32){
        $(document).trigger("releaseSustain");
        evt.preventDefault();
    }

    evt.preventDefault();
    evt.stopPropagation();
    return false;
};

function handleKeyPress(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    return false;
};


function toBoolean (data) {
    return data.toLowerCase() === 'true';
  }

window.addEventListener('load', function () {
    // =============== 鍵盤メッセージ系 ==================
    if (window.HOLD_KEY_ID == undefined) {
        window.HOLD_KEY_ID = new Set();
    }
    window.DISCONNECT = $("#disconnect");

    window.SELFVOLUME = getCookie("selfVolume") ? parseFloat(getCookie("selfVolume")) : 2.0;
    window.PIANORELEASE = getCookie("piano_release") ? parseFloat(getCookie("piano_release")) : 0.1;
    window.PIANOATTACK = getCookie("piano_attack") ? parseFloat(getCookie("piano_attack")) : 0.0;
    window.PIANOSUSTAIN = getCookie("piano_sustain") ? parseFloat(getCookie("piano_sustain")) : 0.7;
    window.PIANODECAY = getCookie("piano_decay") ? parseFloat(getCookie("piano_decay")) : 0.0;
    window.PIANOTRANSPOSE = getCookie("pianoTranspose") ? parseInt(getCookie("pianoTranspose")) : 0;
    window.ICONSIZE = getCookie("iconsize") ? parseInt(getCookie("iconsize")) : 20;
    window.PIANOVOLUME = getCookie("ck_piano_volume") ? parseFloat(getCookie("ck_piano_volume")) : 1.0;
    if (getCookie("chordViewMode") === "") {
        window.CHORDVIEWMODE = false;
    }
    else {
        window.CHORDVIEWMODE = toBoolean(getCookie("chordViewMode"));
    }

    window.MIDIDevice = null;
    window.MIDI_INPUTS = [];
    window.MIDI_OUTPUTS = [];
    window.ONLINE_USERS = [];
    window.USER_PIANO_VOLUME = {};
    window.MIDI_OUTPUT = null;
    window.selectInputMidiName = getCookie("midiInput") ? getCookie("midiInput") : "未設定";
    window.selectOutputMidiName = getCookie("midiOutput") ? getCookie("midiOutput") : "未設定";

    window.metronome = new Metronome();
    window.metronome.tempo = 120;

    addJS_Node(updateList);
    addJS_Node(html_parse);
    addJS_Node(insertTalk);
    addJS_Node(playPiano);
    addJS_Node(playBuffer);
    addJS_Node(releaseBuffer);
    addJS_Node(press);
    addJS_Node(release);
    addJS_Node(releaseKeyboard);
    addJS_Node(captureKeyboard);
    addJS_Node(handleKeyDown);
    addJS_Node(handleKeyPress);
    addJS_Node(handleKeyUp);


    // キーボード関連
    $("#text").off("focus").off("blur");
    $(document).off("keydown");
    $(document).off("keyup");
    $(window).off("keypress");
    
    captureKeyboard();
    $("#text")
    .on("focus",function(){
        releaseKeyboard();
    })
    .on("blur",function(){
        captureKeyboard();
    });


    // いいね関連
    $("#iineButton").unbind("click");
    $("#iineButton").bind("click", function (e) {
        e.preventDefault();
        socket.emit('iine', loginInfo.myID);

        return false;
    });

    $(document).off("pressSustain");
    $(document).off("releaseSustain");
    $(document).on("pressSustain", function () {
        if (gAutoSustain) {
            return;
        }
        gSustain = true;
    });
    $(document).on("releaseSustain", function () {
        gSustain = false;
        if (gAutoSustain) {
            return;
        }
        for (var id in gSustainedNotes) {
            if (gSustainedNotes.hasOwnProperty(id) && gSustainedNotes[id] && !gHeldNotes[id]) {
                gSustainedNotes[id] = false;
                if (!$("#disconnect").is(":checked")) {
                    socket.emit('r', id);
                }
                releaseBuffer(id, loginInfo.myID);
                window.HOLD_KEY_ID.delete(window.MIDI_KEY_NAMES.indexOf(id));
            }
        }
        gSustainedNotes = {};
    });

    socket.off('p');
    socket.off('r');

    //弾く
    socket.on('p', function (id, uid, vol) {
        if (window.DISCONNECT.is(":checked")) {
            return;
        }

        if (uid in window.USER_PIANO_VOLUME) {
            playPiano(id, uid, vol * window.USER_PIANO_VOLUME[uid]);
        }
        else {
            playPiano(id, uid, vol);
        }

        if (window.MIDI_OUTPUT) {
            var note_number = window.MIDI_KEY_NAMES.indexOf(id);
            if (note_number == -1) return;
            note_number = note_number + 21;

            window.MIDI_OUTPUT.send([0x90, note_number, vol / 1.5 * 127], window.performance.now());

            setTimeout(function () {
                window.MIDI_OUTPUT.send([0x80, note_number, 0], window.performance.now());
            }, 1000);
        }
    });

    //離す
    socket.on('r', function (id, uid) {
        try{
            eval(id);
    	}catch(e)
    	{
    		if (window.DISCONNECT.is(":checked")) {
                return;
            }
    
            releaseBuffer(id, uid);
            if (window.MIDI_OUTPUT) {
                var note_number = window.MIDI_KEY_NAMES.indexOf(id);
                if (note_number == -1) return;
                note_number = note_number + 21;
    
                window.MIDI_OUTPUT.send([0x80, note_number, 0], window.performance.now());
            }
    	}
    });

    $('.setting').off('click');
    $(".setting").click(function (e) {
        e.preventDefault();

        $.ajax({
            url: "setting.html?" + new Date().getTime(),
        }).done(function (res) {
            releaseKeyboard();
            var fg = $("<div class=fg style='z-index:10000;background:rgba(0,0,0,.5);position:fixed;top:0;left:0;width:100%;height:100%;text-align:center'></div>");
            var win = $("<div style='text-align:center;width:100%'><div style='background:#111;color:white'>チャット設定</div><div class=win_inner style='display:inline-block;margin-top:30px;background:white;width:90%;padding:2px'>" +
                "<div style='margin-bottom:20px;'>" + res + "</div></div></div>");
            fg.append(win);

            $(win).on("click", ".closeSetting", function () {
                fgClose();
                captureKeyboard();
            });

            $(fg).click(function () {
                $(win).find(".closeSetting").trigger("click");
            })

            win.click(function (e) {
                e.stopPropagation()
                //return false;
            })
            $(".modal").append(fg);

            $(fg).hide().fadeIn("fast", function () {
                on_setting_open();
            });



            let settings = win.find("div .settings");
            // オプションにリリースを追加
            settings.append("<div class=\"hdr\">ピアノの設定</div>")
                .append("<div class=\"con\"><table><tbody><tr>" +
                    "<td><div style=\"display:inline-block\">リリース<br><input type=\"range\" min=\"0.0\" max=\"1.0\" step=\"0.05\" class=\"range\" id=\"piano_release\"></div></td>" +
                    "<td><div style=\"display:inline-block\">アタック<br><input type=\"range\" min=\"0.0\" max=\"0.5\" step=\"0.01\" class=\"range\" id=\"piano_attack\"></div></td>" +
                    "<td><div style=\"display:inline-block\">ディケイ<br><input type=\"range\" min=\"0.0\" max=\"1.0\" step=\"0.05\" class=\"range\" id=\"piano_decay\"></div></td>" +
                    "<td><div style=\"display:inline-block\">サステイン<br><input type=\"range\" min=\"0.0\" max=\"1.0\" step=\"0.05\" class=\"range\" id=\"piano_sustain\"></div></td>" +
                    "<td><div style=\"display:inline-block\">自分の音量<br><input type=\"range\" min=\"0.0\" max=\"3.0\" step=\"0.01\" class=\"range\" id=\"selfVolume\"></div></td><td><div style=\"display:inline-block\">移調<br><select id=\"pianoTranspose\"></select></div></td></tr></tbody></table></div>")
            // 移調機能
            for (let i = 6; i >= 0; --i) {
                $("#pianoTranspose").append($('<option>').html(i).val(i));
            }
            for (let i = 1; i <= 5; ++i) {
                $("#pianoTranspose").append($('<option>').html(-i).val(-i));
            }
            $("#pianoTranspose").val(String(window.PIANOTRANSPOSE));
            $("#pianoTranspose").on('change', function () {
                window.PIANOTRANSPOSE = parseInt($(this).val());
                setCookie("pianoTranspose", window.PIANOTRANSPOSE);
            });

            // リリース設定
            $('#piano_release').val(window.PIANORELEASE);
            $('#piano_release').on('change', function () {
                window.PIANORELEASE = parseFloat($(this).val());
                setCookie("piano_release", window.PIANORELEASE);
            });
            // アタック設定
            $('#piano_attack').val(window.PIANOATTACK);
            $('#piano_attack').on('change', function () {
                window.PIANOATTACK = parseFloat($(this).val());
                setCookie("piano_attack", window.PIANOATTACK);
            });
            // ディケイ設定
            $('#piano_decay').val(window.PIANODECAY);
            $('#piano_decay').on('change', function () {
                window.PIANODECAY = parseFloat($(this).val());
                setCookie("piano_decay", window.PIANODECAY);
            });
            // サステイン
            $('#piano_sustain').val(window.PIANOSUSTAIN);
            $('#piano_sustain').on('change', function () {
                window.PIANOSUSTAIN = parseFloat($(this).val());
                setCookie("piano_sustain", window.PIANOSUSTAIN);
            });

            // 自分の音量
            $('#selfVolume').val(window.SELFVOLUME);
            $('#selfVolume').on('change', function () {
                window.SELFVOLUME = parseFloat($(this).val());
                setCookie("selfVolume", window.SELFVOLUME);
            });

            // オプションにMIDI INOUTの選択ボックスを追加する
            settings.append("<div class=\"hdr\">MIDI INOUT</div>")
                .append("<div class=\"con\"><table><tbody><tr><td><div style=\"display:inline-block\">MIDI IN <br><select id=\"midi_input\"></select></div></td> <td><div style=\"display:inline-block\">MIDI OUT <br><select id=\"midi_output\"></select></div></td></tr></tbody></table></div></div>");

            // 入力MIDIデバイスの記録
            $("#midi_input").append($('<option>').html("未設定").val("未設定"));
            for (let input of window.MIDI_INPUTS) {
                $("#midi_input").append($('<option>').html(input.name).val(input.name));
            }
            $("#midi_input").val(window.selectInputMidiName);

            $("#midi_output").append($('<option>').html("未設定").val("未設定"));
            // 出力MIDIデバイスの記録
            for (let output of window.MIDI_OUTPUTS) {
                $("#midi_output").append($('<option>').html(output.name).val(output.name));
            }
            $("#midi_output").val(window.selectOutputMidiName);

            $('#midi_input').change(function () {
                window.selectInputMidiName = $(this).val();
                updateInputsOutputs();
                setCookie("midiInput", window.selectInputMidiName);
            })

            $('#midi_output').change(function () {
                window.selectOutputMidiName = $(this).val();
                updateInputsOutputs();
                setCookie("midiOutput", window.selectOutputMidiName);
            })


            // ユーザーごとの音量設定
            settings.append("<div class=\"hdr\">ユーザー設定</div>")
                .append("<div class=\"con\"><table><tbody><tr>" +
                    "<td><div style=\"display:inline-block\">ユーザー <br><select id=\"selectedUser\"></select></div></td>" +
                    "<td><div style=\"display:inline-block\">音量 <br><input type=\"range\" min=\"0.0\" max=\"2.0\" step=\"0.05\" class=\"range\" id=\"userVolume\"></div></td>" +
                    '<td><span class="switch chordViewMode"><input type="checkbox" id="chordViewMode"><span class="slider round"></span></span></td>' +
                    "<td>コードビューを表示する(コード検出機能は重たいので演奏時には無効にしてください)</td>" +
                    "</tr></tbody></table></div>");

            $('#chordViewMode').prop("checked", window.CHORDVIEWMODE);
            $('span .switch,.chordViewMode').on('click', function(){
                let chordViewMode = $(this).find("#chordViewMode");
                chordViewMode.prop("checked", !chordViewMode.is(":checked"));

                window.CHORDVIEWMODE = chordViewMode.is(':checked');
                setCookie("chordViewMode", window.CHORDVIEWMODE);

                if (window.CHORDVIEWMODE) {
                    $('#chordView').show();
                }
                else {
                    $('#chordView').hide();
                }
            });

            for (let user of window.ONLINE_USERS) {
                $("#selectedUser").append($('<option>').html(user).val(user));
            }
            $('#selectedUser').change(function () {
                let user = $('#selectedUser').val();
                if (user in window.USER_PIANO_VOLUME) {
                    $('#userVolume').val(String(window.USER_PIANO_VOLUME[user]));
                }
                else {
                    window.USER_PIANO_VOLUME[user] = 1.0;
                }
            });
            $('#userVolume').on('change', function () {
                let volume = parseFloat($(this).val());
                let user = $('#selectedUser').val();
                window.USER_PIANO_VOLUME[user] = volume;
            });


            // チャットの設定
            settings.append('<div class="hdr">チャット設定</div>')
                .append('<div class="con"><table><tbody><tr><td><div style="display:inline-block">アイコンサイズ<br><input type="number" id="iconsize" min="12" max="48"></div></td></tr></tbody></table></div>')
            $('#iconsize').val(window.ICONSIZE);
            $('#iconsize').on('change', function () {
                let size = parseInt($(this).val());
                window.ICONSIZE = size;
                setCookie("iconsize", window.ICONSIZE);
            });


            // ピアノ音量の設定
            $('input[setting="piano_volume"]').on('change', function () {
                let pianoVolume = $(this).val();
                window.PIANOVOLUME = parseFloat(pianoVolume);
            });


            // メトロノームの設定
            settings.append('<div class="hdr">メトロノーム設定</div>')
                .append('<div class="con"><table><tbody><tr>' +
                '<td><span class="switch playMetronome"><input id="playMetronome" type="checkbox"><span class="slider round"></span></span></td>' +
                '<td>メトロノームを再生する</td>' +
                '<td><div style="display:inline-block">テンポ<br><input type="number" id="tempo" min="0" max="300"></div></td>' +
                '<td><div style="display:inline-block">拍子<br><input type="number" id="metre" min="1" max="20"></div></td>' +
                '</tr></tbody></table></div>');

            $("#playMetronome").prop("checked", window.metronome.isRunning);
            $('span .switch,.playMetronome').on('click', function(){
                let playMetronome = $(this).find("#playMetronome");
                playMetronome.prop("checked", !playMetronome.is(":checked"));

                if (playMetronome.is(":checked"))
                {
                    window.metronome.start();
                }
                else
                {
                    window.metronome.stop();
                }
            });

            $('#tempo').val(window.metronome.tempo);
            $('#tempo').on('change', function(){
                let tempo = parseInt($(this).val());
                if (tempo < 0 ){ tempo = 0; }
                if (tempo > 300) {tempo = 300;}
                if (isNaN(tempo)) { tempo = 120; }

                window.metronome.tempo = tempo;
            });

            $('#metre').val(window.metronome.metre);
            $('#metre').on('change', function(){
                let metre = parseInt($(this).val());
                if (metre < 1) { metre = 1;}
                if (metre > 20) { metre = 20;}
                if (isNaN(metre)) { metre = 4;}

                window.metronome.metre = metre;
            });
        })
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

    let whiteKey = '<div style="width: 1.92308%; z-index: 0; background-color: white; height: 100%; border: 1px solid gray; position: absolute; left: 0.0%" class="whiteKey pianoKey">';
    let blackKey = '<div style="width: 1.28205%; z-index: 1; height: 60%; background-color: #333; position: absolute; left: 0.0%" class="blackKey pianoKey">';
    let left = 0.0;
    let keyID = 21;

    // 新しい鍵盤を追加
    $('body > div.all > div.header').after('<div id="keyboard" style="width: 95%; height: 15%; margin: auto; position: relative; min-height: 180px;"></div>')
    $('#keyboard')
        .append($(whiteKey).attr("id", String(keyID)))
        .append($(blackKey).css("left", String(left + 1.28205) + "%").attr("id", String(keyID += 1)))
        .append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id", String(keyID += 1)));

    for (let i = 0; i < 7; ++i) {
        $('#keyboard')
            .append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id", String(keyID += 1)))
            .append($(blackKey).css("left", String(left + 1.28205) + "%").attr("id", String(keyID += 1)))
            .append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id", String(keyID += 1)))
            .append($(blackKey).css("left", String(left + 1.28205) + "%").attr("id", String(keyID += 1)))
            .append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id", String(keyID += 1)))
            .append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id", String(keyID += 1)))
            .append($(blackKey).css("left", String(left + 1.28205) + "%").attr("id", String(keyID += 1)))
            .append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id", String(keyID += 1)))
            .append($(blackKey).css("left", String(left + 1.28205) + "%").attr("id", String(keyID += 1)))
            .append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id", String(keyID += 1)))
            .append($(blackKey).css("left", String(left + 1.28205) + "%").attr("id", String(keyID += 1)))
            .append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id", String(keyID += 1)));
    }
    $('#keyboard')
        .append($(whiteKey).css("left", String(left += 1.92308) + "%").attr("id", String(keyID += 1)));

    // 鍵盤クリック時
    $('div .pianoKey').on('mousedown', function () {
        let id = parseInt($(this).attr("id"));
        press(window.MIDI_KEY_NAMES[id - 21], 1.0);
        setTimeout(function() {release(window.MIDI_KEY_NAMES[id - 21])}, 100);
    });
    $('#keyboard').before('<div id="chordView" style="z-index: 100; display: block; right: 0; left: 0; margin:auto; position: absolute; width: 10%; color: #5d627b; background: white; border-top: solid 6px #BAC; border-bottom: solid 6px rgba(0, 0, 0, 0.25); box-shadow: 5px 3px 5px rgba(0, 0, 0, 0.22); border-radius: 9px;"><p id="chordViewText" style="text-align: center; font-weight:bold;"></p></div>');

    // チャットを下まで伸ばします
    $("#chat").css("max-height", "50%");

    if (window.CHORDVIEWMODE) {
        $('#chordView').show();
    }
    else {
        $('#chordView').hide();
    }
})

addJS_Node(ease);
addJS_Node(displayChord);
addJS_Node(Note);
addJS_Node(Chord);
addJS_Node(ChordParser);
addJS_Node(Quality);
addJS_Node(QualityParser);
addJS_Node(modC);
addJS_Node(array_equal);
addJS_Node(displayChordView);
addJS_Node(toBoolean);

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