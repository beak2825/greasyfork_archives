// ==UserScript==
// @name         Sound effects go brr (Oib.io)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BRRRRRRRRRRRR
// @author       kmccord1
// @match        http://oib.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425526/Sound%20effects%20go%20brr%20%28Oibio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/425526/Sound%20effects%20go%20brr%20%28Oibio%29.meta.js
// ==/UserScript==

(function() {




    var sounds = {
        "oof" : {
            url : "https://raw.githubusercontent.com/ShantnuS/oof-on-close/master/oof.mp3"
        }
    };


    var soundContext = new AudioContext();

    for(var key in sounds) {
        loadSound(key);
    }

    function loadSound(name){
        var sound = sounds[name];

        var url = sound.url;
        var buffer = sound.buffer;

        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            soundContext.decodeAudioData(request.response, function(newBuffer) {
                sound.buffer = newBuffer;
            });
        }

        request.send();
    }

    function playSound(name, options){
        var sound = sounds[name];
        var soundVolume = sounds[name].volume || 1;

        var buffer = sound.buffer;
        if(buffer){
            var source = soundContext.createBufferSource();
            source.buffer = buffer;

            var volume = soundContext.createGain();

            if(options) {
                if(options.volume) {
                    volume.gain.value = soundVolume * options.volume;
                }
            } else {
                volume.gain.value = soundVolume;
            }

            volume.connect(soundContext.destination);
            source.connect(volume);
            source.start(0);
        }
    }







    function checkoibs() {
        if (window.lapa10315mauve) {
            for (let i = 0; i < window.lapa10315mauve.units.length; i++) {
                if (window.lapa10315mauve.units[i].state == 3 && !window.lapa10315mauve.units[i].dead) {
                    window.lapa10315mauve.units[i].dead = true;
                    playSound("oof");
                }
            }
        }
        requestAnimationFrame(checkoibs);
    }
    checkoibs();
})();