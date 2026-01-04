// ==UserScript==
// @name        Lichess Death Grips Guillotine Sound Pack
// @namespace   Cole Milne (The Milne Empire)
// @description YUH!
// @include     https://*.lichess.org/*
// @include     https://lichess.org/*
// @version     1.0
// @grant GM_xmlhttpRequest
// @connect mboxdrive.com
// @downloadURL https://update.greasyfork.org/scripts/430433/Lichess%20Death%20Grips%20Guillotine%20Sound%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/430433/Lichess%20Death%20Grips%20Guillotine%20Sound%20Pack.meta.js
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
    ['move','https://www.mboxdrive.com/move.mp3'],
    ['capture','https://www.mboxdrive.com/capture.mp3'],
    // ['check','https://cdn.discordapp.com/attachments/604088023478567053/843980494252408852/check.mp3'],
    ['victory','https://www.mboxdrive.com/victory.mp3'],
    // ['defeat','https://cdn.discordapp.com/attachments/604088023478567053/843952026530086922/take.mp3'],
    // ['draw','https://cdn.discordapp.com/attachments/604088023478567053/843979736300126258/lose.mp3'],
    ['genericNotify','https://www.mboxdrive.com/dong.mp3'],
    // ['lowTime','https://cdn.discordapp.com/attachments/604088023478567053/843952185342951445/timelow.mp3'],
    // ['berserk','https://cdn.discordapp.com/attachments/604088023478567053/844651856411099197/Sizzling.mp3'],
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

lichess.sound.origPlay = lichess.sound.play;

function customPlay(name, volume) {
    if (customSnds[name]) {
        if (!volume) volume = lichess.sound.getVolume();
        playSound(customSnds[name], volume);
    } else {
        lichess.sound.origPlay(name, volume);
    }
}

lichess.sound.play = customPlay;

console.log("Applied Guillotine Sound Pack");