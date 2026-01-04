// ==UserScript==
// @name         NightShuffle
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Add shuffle function to NightBot
// @author       DoubleJarvis
// @match        https://beta.nightbot.tv/song_requests
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/36819/NightShuffle.user.js
// @updateURL https://update.greasyfork.org/scripts/36819/NightShuffle.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
/* jshint multistr: true */

(function() {
    'use strict';
    var shuffle = false;
    var voice   = true;

    // sleep time expects milliseconds
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    console.log('Waiting for DOM to load');

    sleep(5000).then(() => {
        createShuffleButtons();
        createSearchBox();
        addClickListeners();
        addSliderListeners();
        stopAutoplay();
    });
    function say (text) {
        window.speechSynthesis.cancel();
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = GM_getValue("rate") || 1;
        utterance.pitch = GM_getValue("pitch") || 1;
        utterance.volume = GM_getValue("volume") || 1;
        return window.speechSynthesis.speak(utterance);
    }

    function createShuffleButtons () {
        $('.col-lg-6.pull-right').prepend('<div class="btn-group"> \
<button id="voiceButton" type="button" class="btn btn-primary"><i class="fa fa-volume-up"></i> Voice</button> \
<div class="btn-group"> \
<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false" style="margin-right: 3px;"><i class="fa fa-cog"></i></button> \
<ul class="dropdown-menu" role="menu"> \
<li><a>Rate: <span id="rate">' + GM_getValue("pitch") + '</span></a></li> \
<li><input min="0.1" max="2" type="range" id="rateSlider" step="0.1" value="' + GM_getValue("pitch") + '"></li> \
<li><a>Pitch: <span id="pitch">' + GM_getValue("rate") + '</span></a></li> \
<li><input type="range" min="0.1" max="2" id="pitchSlider" step="0.1" value="' + GM_getValue("rate") + '"></li> \
<li><a>Volume: <span id="volume">' + GM_getValue("volume") + '</span></a></li> \
<li><input type="range" min="0.1" max="1" id="volumeSlider" step="0.1" value="' + GM_getValue("volume") + '"></li> \
</ul> \
</div> \
</div>');
        $('.col-lg-6.pull-right').prepend('<button id="shuffleButton" style="margin-right: 3px;"class="btn btn-default btn-primary ng-binding ng-click-active" type="button"><i class="fa fa-random"></i> Shuffle</button>');
        $('div.pause-play-container').append('<button id="randomNext" class="btn btn-primary btn-outline ng-click-active" type="button" style="display: none;"><i class="fa fa-random"></i></button>');
    }
    
    function createSearchBox () {
        if (window.top === window.self) {
            $($('.ibox-title')[1]).after('<div class="ibox-title"><input type="text" id="myInput" placeholder="Search for names.."></div>');
        }
        $('#myInput').keyup(filterUsers);
    }

    function filterUsers () {
        // Declare variables
        var input, filter, table, tr, td, i;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        table = document.getElementsByTagName("TABLE")[0];
        tr = table.getElementsByTagName("tr");
      
        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[3];
          if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          }
        }
      }
    function addClickListeners () {
        $('#shuffleButton').click(toggleShuffle);
        $('#voiceButton').click(toggleVoice);
        $('#randomNext').click(playRandomSong);
    }
    function addSliderListeners () {
        var rateSlider  = document.getElementById('rateSlider');
        var pitchSlider = document.getElementById('pitchSlider');
        rateSlider.oninput = function() {
            document.getElementById('rate').innerHTML = this.value;
            GM_setValue("rate", this.value);
        };
        pitchSlider.oninput = function() {
            document.getElementById('pitch').innerHTML = this.value;
            GM_setValue("pitch", this.value);
        };
        volumeSlider.oninput = function() {
            document.getElementById('volume').innerHTML = this.value;
            GM_setValue("volume", this.value);
        };
    }
    function toggleVoice () {
        voice = !voice;
        console.log('Voice notifications are now: ' + voice);
        $('#voiceButton').toggleClass('btn-primary').toggleClass('btn-default');
    }
    function toggleShuffle () {
        shuffle = !shuffle;
        console.log('Shuffle status is now: ' + shuffle);
        switchButtons();
        $('#shuffleButton').toggleClass('btn-default');
    }
    function switchButtons () {
        $("button[ng-click='skip()']").toggle();
        $('#randomNext').toggle();
    }

    function playRandomSong () {
        // can't cache buttons because they are dynamic
        var promoteButtons = $("button[ng-click='queue.promote(item)']");
        var randomElement = Math.floor(Math.random()*promoteButtons.length);
        var winnerName = $($(promoteButtons[randomElement]).parent().parent().children()[3]).text();
        var nextButton = $("button[ng-click='skip()']");
        console.log('Choosing random element from ' + (promoteButtons.length) + ' items');
        console.log('RNGesus decided to give us: ' + (randomElement + 1));
        // need to say before we promote
        if (voice) {
            say(winnerName + " has won the raffle");
        }
        $(promoteButtons[randomElement]).trigger('click');
        sleep(2000).then(() => {
            nextButton.trigger('click');
        });
    }
    function stopAutoplay () {
        if (window.top === window.self) {
            // Don't do anything unless we're inside iframe
        }
        else {
            var player = $('video')[0];
            player.ontimeupdate = function() {
                // console.log(this.currentTime);
                if (this.currentTime > (this.duration - 0.1)) { this.pause(); }
            };
        }

    }
})();
