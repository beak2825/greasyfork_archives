// ==UserScript==
// @name        Lichess Chesscom sound pack
// @namespace   mickael_r
// @description chesscom sound pack for lichess.
// @include     https://*.lichess.org/*
// @include     https://lichess.org/*
// @version     1.1
// @grant GM_xmlhttpRequest
// @connect cdn.discordapp.com
// @downloadURL https://update.greasyfork.org/scripts/431114/Lichess%20Chesscom%20sound%20pack.user.js
// @updateURL https://update.greasyfork.org/scripts/431114/Lichess%20Chesscom%20sound%20pack.meta.js
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
    ['move','https://cdn.discordapp.com/attachments/877926182715289634/878309282653810718/move-self_3.mp3'],
    ['capture','https://cdn.discordapp.com/attachments/877926182715289634/878309669259608064/capture.mp3'],
    ['check','https://cdn.discordapp.com/attachments/877926182715289634/878310089109438536/move-check.mp3'],
    ['victory','https://cdn.discordapp.com/attachments/877926182715289634/878317417560952862/game-win.mp3'],
    ['defeat','https://cdn.discordapp.com/attachments/877926182715289634/878317292138688522/game-end.mp3'],
    ['draw','https://cdn.discordapp.com/attachments/877926182715289634/878317326661992538/game-draw.mp3'],
    ['genericNotify','https://cdn.discordapp.com/attachments/877926182715289634/878311365884907520/dong.mp3'],
    ['lowTime','https://cdn.discordapp.com/attachments/877926182715289634/878311630465806366/lowtime.mp3'],
    ['castle','https://cdn.discordapp.com/attachments/877926182715289634/878312026559098960/castle.mp3'],
])
var customSnds = {};
customSndList.forEach(function(element, index) {
    loadSound(element).then(function(buffer) {customSnds[index] = buffer;}, function(e) {console.log(e);})
});

// use this later in the script
function playSound(buffer, volume) {
    console.log('PS1');
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
    console.log(name);
    if (customSnds[name]) {
        if (!volume) volume = lichess.sound.getVolume();
        if (name != 'check'){playSound(customSnds[name], volume);}
        if (name == 'check'){setTimeout(function(){playSound(customSnds[name], volume)}, 80); console.log('called');}
        //playSound(customSnds[name], volume);
    } else {
        lichess.sound.origPlay(name, volume);
    }
}

lichess.sound.play = customPlay;