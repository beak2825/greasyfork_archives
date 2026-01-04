// ==UserScript==
// @name        Lichess Umineko Sound Pack
// @namespace   jwapobie
// @description Battle like a true witch with this sound pack for lichess.
// @match       https://*.lichess.org/*
// @match       https://lichess.org/*
// @version     1.2
// @grant GM_xmlhttpRequest
// @connect media.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/426698/Lichess%20Umineko%20Sound%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/426698/Lichess%20Umineko%20Sound%20Pack.meta.js
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
    ['move','https://media.githubusercontent.com/media/jwapobie/witchess/main/move.mp3'],
    ['capture','https://media.githubusercontent.com/media/jwapobie/witchess/main/EnergySword.mp3'],
    ['check','https://media.githubusercontent.com/media/jwapobie/witchess/main/check.mp3'],
    ['victory','https://media.githubusercontent.com/media/jwapobie/witchess/main/winlose.mp3'],
    ['defeat','https://media.githubusercontent.com/media/jwapobie/witchess/main/winlose.mp3'],
    ['draw','https://media.githubusercontent.com/media/jwapobie/witchess/main/thunder.mp3'],
    ['genericNotify','https://media.githubusercontent.com/media/jwapobie/witchess/main/OpeningBell.mp3'],
    ['lowTime','https://media.githubusercontent.com/media/jwapobie/witchess/main/timelow.mp3'],
    ['berserk','https://media.githubusercontent.com/media/jwapobie/witchess/main/Sizzling.mp3'],
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

function customPlay(name, volume) {
    // console.log(name)
    if (customSnds[name]) {
        if (!volume) volume = site.sound.getVolume();
        playSound(customSnds[name], volume / 2);
    } else {
        site.sound.origPlay(name, volume);
    }
}

site.sound.play = customPlay;

console.log("Applied UminekoSoundPack");