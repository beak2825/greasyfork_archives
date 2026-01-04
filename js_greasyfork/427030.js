// ==UserScript==
// @name         NTULearn Player with Key Controls
// @namespace    https://puayhiang.com
// @version      0.1
// @description  A better LAMs player
// @author       @puayhiang
// @match        *://presentur.ntu.edu.sg/aculearn-idm/*
// @match        *://lams.ntu.edu.sg/lams/tool/lanb11/starter/learner.do?
// @match        *://*.ntu.edu.sg/aculearn-me/v9/studio/play.asp?*
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/427030/NTULearn%20Player%20with%20Key%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/427030/NTULearn%20Player%20with%20Key%20Controls.meta.js
// ==/UserScript==

// Key Control
// =============================
// Play/Pause - Space Key
// Fullscreen - Key F
// Seek - Arrow Key Left, Right
// Volume - Arrow Key Up, Down
// Playback Rate - Key A, S

let saveAs = (downloadUrl, downloadTitle) => {
    var link = document.createElement("a");
    link.download = downloadTitle;
    link.href = downloadUrl;
    link.click();
}
let downloadVTTFile = (name, contents, mime_type = "text/plain") => {

        var blob = new Blob([contents], {type: mime_type});
        var blobURL = window.URL.createObjectURL(blob);

        var dlink = document.createElement('a');
        dlink.download = name;
        dlink.href = blobURL;
        dlink.onclick = function(e) {
            // revokeObjectURL needs a delay to work properly
            var that = this;
            setTimeout(function() {
                window.URL.revokeObjectURL(that.href);
            }, 1500);
        };

        dlink.click();
        dlink.remove();
}

(function() {
    'use strict';

    var audioCtx;
    var source;
    var gainNode;
    var volume;

    document.addEventListener('keydown',function(e){

        //Play/Pause
        // Space Key
        if(e.keyCode == 32){
            document.getElementsByClassName("vjs-play-control")[0].click();
        }

        //Fullscreen
        // Key F
        if(e.keyCode == 70){
            document.getElementsByClassName("arv_fullscreenButton")[0].click();
        }


        //Time
        // Arrow Key Left, Right
        // Key 0 to 9 (Seek)
        if(e.keyCode == 39 || e.keyCode == 37 || (e.keyCode >= 48 && e.keyCode <= 57)){

            var currentTime = document.getElementsByClassName("vjs-current-time-display")[0].innerText.slice(13)

            var timeInSec = parseInt(currentTime.slice(-2));


            if(currentTime.length > 2){
                timeInSec += parseInt(currentTime.slice(-5,-3))*60
            }

            if(currentTime.length > 5){
                timeInSec += parseInt(currentTime.slice(0,-6))*3600;

            }


            if(e.keyCode >= 48 && e.keyCode <= 57){
                var durationTime = document.getElementsByClassName("vjs-duration")[0].innerText.slice(14,-1)

                var durationInSec = parseInt(currentTime.slice(-2));

                if(durationTime.length > 2){
                    durationInSec += parseInt(durationTime.slice(-5,-3))*60
                }

                if(durationTime.length > 5){
                    durationInSec += parseInt(durationTime.slice(0,-6))*3600;
                }

                var segment = (e.keyCode - 48) * (0.1*durationInSec);
                arvcurrentTime(segment);
            }

            if(e.keyCode == 39){
                arvcurrentTime(timeInSec + 11)
            }

            if(e.keyCode == 37){
                arvcurrentTime(timeInSec - 10)
            }
        }

        //Volume
        // Arrow Key Up, Down
        if(e.keyCode == 40 || e.keyCode == 38){
            if(volume==undefined){
                volume = document.getElementById("Video1_html5_api").volume;
            }
            if(e.keyCode == 40){
                volume -= 0.05;
                if(volume < 0){
                    volume = 0;
                }
            }

            if(e.keyCode == 38){
                volume += 0.05;
            }
            if(volume > 1){
                document.getElementById("Video1_html5_api").volume = 1;
                if(audioCtx==undefined){
                    audioCtx = new AudioContext();
                }

                if (source==undefined){
                    var video = document.getElementById("Video1_html5_api")
                    source = audioCtx.createMediaElementSource(video);
                }

                if (gainNode==undefined){
                    gainNode = audioCtx.createGain();
                    source.connect(gainNode);
                    gainNode.connect(audioCtx.destination);

                }

                gainNode.gain.value = volume;
            }else{
                if (gainNode!=undefined){
                    gainNode.gain.value = 1;
                }
                document.getElementById("Video1_html5_api").volume = volume;
            }
            return;
        }

        //Playback Rate
        // Key A, S
        if(e.keyCode == 65 || e.keyCode == 83){
            if(e.keyCode == 65){
                document.getElementById("Video1_html5_api").playbackRate -= 0.1
            }

            if(e.keyCode == 83){
                document.getElementById("Video1_html5_api").playbackRate += 0.1
            }
        }
        // Key D
        if(e.keyCode == 68){
            var videoTitle = document.getElementById("tab_content_3_1").querySelectorAll('tr')[0].querySelectorAll('td')[1].innerText;
            var videoCreationDate = document.getElementById("tab_content_3_1").querySelectorAll('tr')[4].querySelectorAll('td')[1].innerText;
            var downloadTitle = videoTitle.trim() + "-" + videoCreationDate.trim()
            var downloadUrl = document.getElementById("Video1_html5_api").src;


            var videoChapterTable = document.getElementById("scroller_padd_2").querySelectorAll('tbody tr')
            var VTTFile = "";
            var videoChapterTimings = [];
            videoChapterTable.forEach(function(row){
                var rowContent = row.querySelectorAll('td')
                var chapterTiming = rowContent[2].textContent.trim()
                chapterTiming = chapterTiming.substring(1, chapterTiming.length - 1) + ",000";
                videoChapterTimings.push(chapterTiming)
            })
            var noOfSlides = videoChapterTimings.length
            for(var i = 1;i<noOfSlides;i++){
                var videoTimingText = i + "\n"
                videoTimingText = videoChapterTimings[i-1] + " --> " + videoChapterTimings[i]
                videoTimingText = videoTimingText + "\n" + "Slide " + i + " of " + (noOfSlides) + "\n\n" ;
                VTTFile = VTTFile + videoTimingText;
            }
            //downloadVTTFile(downloadTitle + ".srt", VTTFile)
            unsafeWindow.saveAs = saveAs(downloadUrl,downloadTitle + ".mp4")
        }

    })

})();