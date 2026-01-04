// ==UserScript==
// @name         Youtube DJ
// @namespace    http://qaq.link/
// @version      0.2
// @description  Control youtube video with DJ device.
// @author       DKing
// @match        http://www.youtube.com/*
// @match        https://www.youtube.com/*
// @grant        none
// @require      https://gitcdn.xyz/cdn/djipco/webmidi/b86fac967652b5753575eb42ea70b602553caf59/webmidi.min.js
// @downloadURL https://update.greasyfork.org/scripts/379375/Youtube%20DJ.user.js
// @updateURL https://update.greasyfork.org/scripts/379375/Youtube%20DJ.meta.js
// ==/UserScript==

(function() {
    'use strict';

 var mapping = {
    "DJ-202": {
        "shift": [159, 0],   // raw midi message ([159, 0, 127] for ON and [159, 0, 127] for OFF)
        "video": {
            "channel": 2,
            "wheel": 6,      // note
            "forward": 65,   // value
            "backward": 63,  // value
            "play": 0        // note
        },
        "audio": {
            "channel": 1,
            "wheel": 6,      // note
            "forward": 65,   // value
            "backward": 63,  // value
            "mute": 0        // note
        }
    }
};

var video_player = null;
var auto_pause = false;

var shift_factor = 1;
var video_direction = 0;
var audio_direction = 0;


function check_videoplayer(){
    if(video_player == null){
        console.log("video not found");
        video_player = document.getElementsByTagName('video')[0];
        return false;
    }
    return true;
}

function change_video(v){
    if(!check_videoplayer())return;
    if(!video_direction)return;
    video_player.currentTime += (v+1)*video_direction*shift_factor/30;
}

function change_audio(v){
    if(!check_videoplayer())return;
    if(!audio_direction)return;
    var newvol = video_player.volume + 0.05*(v+1)*audio_direction*shift_factor;
    if(newvol>1)newvol=1;
    if(newvol<=0)newvol=0;
    video_player.volume = newvol;
}

WebMidi.enable(function (err) {
    if(WebMidi.inputs.length >= 1){
        for(var devicename in mapping){
            var rule = mapping[devicename];
            var inputdev = WebMidi.getInputByName(devicename);
            var outputdev = WebMidi.getOutputByName(devicename);
            inputdev.addListener('noteon', rule["video"]["channel"],
                    function (e) {
                        //console.log(e);
                        if(!check_videoplayer())return;
                        if(e.note.number == rule["video"]["wheel"]){
                            var playing = !video_player.paused;
                            if(playing){
                                video_player.pause();
                                auto_pause = true;
                            }
                        }
                        if(e.note.number == rule["video"]["play"]){
                            if(video_player.paused)
                                video_player.play();
                            else
                                video_player.pause();
                        }
                    }
                );
                inputdev.addListener('noteoff', rule["video"]["channel"],
                    function (e) {
                        //console.log(e);
                        if(!check_videoplayer())return;
                        if(e.note.number == rule["video"]["wheel"]){
                            if(auto_pause){
                                video_player.play();
                                auto_pause = false;
                            }
                        }
                    }
                );

                inputdev.addListener('midimessage', 'all', function (e) {
                    // UNCOMMENT THIS TO CONFIGURE YOUR DEVICE
                    //console.log(e);
                    if(e.data[0] == rule["shift"][0] && e.data[1] == rule["shift"][1])
                        if(e.data[2] == 0)shift_factor = 8;
                        else shift_factor = 1;
                });
                inputdev.addListener('controlchange', 'all', function(e){console.log(e);});

                inputdev.addListener('controlchange', [rule["video"]["channel"], rule["audio"]["channel"]],
                    function (e) {
                        //console.log(e);
                        if(e.channel == rule["video"]["channel"] && e.data[1] == rule["video"]["wheel"]){
                            if(e.data[2] == rule["video"]["forward"]){
                                video_direction = 1;
                            }
                            if(e.data[2] == rule["video"]["backward"]){
                                video_direction = -1;
                            }
                        }
                        if(e.channel == rule["audio"]["channel"] && e.data[1] == rule["audio"]["wheel"]){
                            if(e.data[2] == rule["audio"]["forward"]){
                                audio_direction = 1;
                            }
                            if(e.data[2] == rule["audio"]["backward"]){
                                audio_direction = -1;
                            }
                        }
                    }
                );
                inputdev.addListener('pitchbend', [rule["video"]["channel"], rule["audio"]["channel"]],
                    function (e) {
                        //console.log(e);
                        if(e.channel == rule["video"]["channel"]){
                            change_video(e.value);
                        }
                        if(e.channel == rule["audio"]["channel"]){
                            change_audio(e.value);
                        }
                    }
                );
        }
    }
});


})();