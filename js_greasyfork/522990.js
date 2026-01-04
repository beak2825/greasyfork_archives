// ==UserScript==
// @name        Lichess Sound Pack chesscom
// @namespace   jwapobie
// @description chesscom sound
// @match       https://*.lichess.org/*
// @match       https://lichess.org/*
// @version     1.5
// @grant GM_xmlhttpRequest
// @connect images.chesscomfiles.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522990/Lichess%20Sound%20Pack%20chesscom.user.js
// @updateURL https://update.greasyfork.org/scripts/522990/Lichess%20Sound%20Pack%20chesscom.meta.js
// ==/UserScript==



// this function makes the request and puts it in an decoded audio buffer
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
function loadSound(url) {
    return new Promise(function(resolve, reject) {
        // This will get around the CORS issue
        //      http://wiki.greasespot.net/GM_xmlhttpRequest
        var req = GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: 'arraybuffer',
            onload: function(response) {
                try {
                    context.decodeAudioData(response.response, function(buffer) {
                        resolve(buffer)
                    }, function(e) {
                        reject(e);
                    });
                }
                catch(e) {
                    reject(e);
                }
            }
        });
    })
}

// adjust volume
var volNode;
if( context.createGain instanceof Function ) {
    volNode = context.createGain();
} else if( context.createGainNode instanceof Function ) {
    volNode = context.createGainNode();
}

// Connect the volume control the the speaker
volNode.connect( context.destination );


// allocate buffers for sounds
var customSndList = new Map([
    ['move','https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default//move-self.mp3'],
    ['capture','https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3'],
    ['check','https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-check.mp3'],
    ['victory','https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-win.mp3'],
    ['defeat','https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-end.mp3'],
    ['draw','https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-draw.mp3'],
    ['genericNotify','https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/dong.mp3'],
    ['lowTime','https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/lowtime.mp3'],
    ['castle','https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/castle.mp3'],
])
var customSnds = {};
customSndList.forEach(function(element, index) {
    loadSound(element).then(function(buffer) {customSnds[index] = buffer;}, function(e) {console.log(e);})
});

// use this later in the script
function playSound(buffer, volume) {
    // creates a sound source
    var source = context.createBufferSource();
    // tell the source which sound to play
    source.buffer = buffer;
    // connect the source to the context's destination (the speakers)
    volNode.gain.value = volume;
    source.connect(volNode);
    // play the source now
    // note: on older systems, may have to use deprecated noteOn(time);
    source.start(0);
}

site.sound.origPlay = site.sound.play;

function Suite(name,volume)
{
    var move =""
    if (document.getElementsByClassName('a1t')[0] != undefined){ move = document.getElementsByClassName('a1t')[0].innerText }
    if (move == "O-O"){ name = "castle"}
    if (move == "O-O-O"){ name = "castle"}

    if (customSnds[name]) {
        if (!volume) volume = site.sound.getVolume();
        playSound(customSnds[name], volume / 2);
    } else {
        site.sound.origPlay(name, volume);
    }
}

function customPlay(name, volume) {
   setTimeout(Suite,100,name,volume);
}

site.sound.play = customPlay;

console.log("Applied UminekoSoundPack");