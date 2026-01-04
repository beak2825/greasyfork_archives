// ==UserScript==
// @name				FreesoundSingle
// @namespace				hackerb9
// @description				Play only one sound at a time on freesound.org
// @match				*://freesound.org/*
// @author				hackerb9
// @version  				0.2
// @run-at				document-end
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license magnet:?xt=urn:btih:90dc5c0be029de84e523b9b3922520e79e0e6f08&dn=cc0.txt No rights reserved
// @downloadURL https://update.greasyfork.org/scripts/40937/FreesoundSingle.user.js
// @updateURL https://update.greasyfork.org/scripts/40937/FreesoundSingle.meta.js
// ==/UserScript==
// date					2018-04-22

// This script will hopefully be obsolete soon. 
// It fixes a bug in https://freesound.org/media/html_player/player.js


console.debug('Running FreesoundSingle');


function runme() {
  $("body").append ( newscript );  
}



newscript=`<script>
function makePlayer(selector) {
    $(selector).each( function () {

        if ($(this).data("hasPlayer")) return true;
        else $(this).data("hasPlayer", true);

        var showMs = $(this).hasClass("large");

        if ($(this).hasClass("large"))
        {
            $(this).append('<div class="controls"> \
                   <a href="javascript:void(0)" title="play / pause" class="toggle play">play / pause</a> \
                   <a href="javascript:void(0)" title="stop" class="button stop">stop</a> \
                   <a href="javascript:void(0)" title="change display" class="toggle display">change display</a> \
                   <a href="javascript:void(0)" title="loop" class="toggle loop">loop</a> \
                   <a href="javascript:void(0)" title="toggle measure" class="toggle measure">toggle measure</a> \
                </div> \
                <div class="background"></div> \
                <div class="measure-readout-container"><div class="measure-readout"></div></div> \
                <div class="loading-progress"></div> \
                <div class="position-indicator"></div> \
                <div class="time-indicator-container"><div class="time-indicator"></div></div>');
        }
        else if ($(this).hasClass("small"))
        {
            $(this).append('<div class="controls"> \
                    <a href="javascript:void(0)" title="play / pause" class="toggle play">play / pause</a> \
                    <a href="javascript:void(0)" title="loop" class="toggle loop">loop</a> \
                </div> \
                <div class="background"></div> \
                <div class="loading-progress"></div> \
                <div class="position-indicator"></div> \
                <div class="time-indicator-container"><div class="time-indicator"></div></div>');

            // Check if toggle display button should be added and add it if requested
            if (typeof showToggleDisplayButton !== "undefined"){
                if (showToggleDisplayButton){
                    var toggle_display_button = '<a href="javascript:void(0)" title="change display" class="toggle display">change display</a>';
                    var cotrols_element = $('.controls');
                    cotrols_element.css('width', '60px');
                    cotrols_element.append(toggle_display_button);
                }
            }
        }
        else if ($(this).hasClass("mini")) {
            $(this).append('<div class="controls"> \
                   <a href="javascript:void(0)" title="play / pause" class="toggle play">play / pause</a> \
                   <a href="javascript:void(0)" title="loop" class="toggle loop"></a> \
                </div> \
                <div class="background"></div> \
                <div class="loading-progress"></div> \
                <div class="position-indicator"></div>');
        }
        
        $("*", this).disableTextSelect();

        var mp3Preview = $(".metadata .mp3_file", this).attr('href');
        var oggPreview = $(".metadata .ogg_file", this).attr('href');
        var waveform = $(".metadata .waveform", this).attr('href');
        var spectrum = $(".metadata .spectrum", this).attr('href');
        var duration = $(".metadata .duration", this).text();

        var playerElement = $(this);

        if (!$(this).hasClass("mini"))
            $(".background", this).css("backgroundImage", 'url("' + waveform + '")');
            $(".background", this).css("backgroundSize", 'contain');
            $(".background", this).css("backgroundRepeat", 'no-repeat');

        $(".loading-progress", playerElement).hide();

        $(".time-indicator", playerElement).html(msToTime(0, duration, !$(".time-indicator-container", playerElement).hasClass("on"), showMs));

        if ($(this).hasClass("large"))
        {
            $(".controls", this).stop().fadeTo(10000, 0.2);
            $(".measure-readout-container", this).stop().fadeTo(0, 0);
        }

        // Ready to use; soundManager.createSound() etc. can now be called.
        var sound = soundManager.createSound(
        {
            id: "sound-id-" + uniqueId++,
            url: mp3Preview,
            autoLoad: false,
            autoPlay: false,
            onload: function()
            {
                $(".loading-progress", playerElement).remove();
            },
            whileloading: function()
            {
                var loaded = this.bytesLoaded / this.bytesTotal * 100;
                if(loaded > 0) $(".loading-progress", playerElement).show();
                $(".loading-progress", playerElement).css("width", (100 - loaded) + "%");
                $(".loading-progress", playerElement).css("left", loaded + "%");
            },
            whileplaying: function()
            {
                var positionPercent = this.position / duration * 100;
                $(".position-indicator", playerElement).css("left", positionPercent + "%");
                $(".time-indicator", playerElement).html(msToTime(sound.position, duration, !$(".time-indicator-container", playerElement).hasClass("on"), showMs));
            },
            onfinish: function ()
            {
                if ($(".loop", playerElement).hasClass("on"))
                {
                    sound.play()
                }
                else
                {
                    if ($(".play", playerElement).hasClass("on"))
                        switchToggle($(".play", playerElement));
                }
            }
        });

        $(".play", this).bind("toggle", function (event, on)
        {
            if (on)
            {

// THIS IS THE ONLY DIFFERENCE FROM THE STANDARD PLAYER.JS
		console.debug("Running stopAll before playing a new sound");
		stopAll();
// THAT'S ALL, FORKS

                switchOn($(".play", playerElement));
                sound.play();
            }
            else
            {
                switchOff($(".play", playerElement));
                sound.pause();
            }
        });

        $(".stop", this).click(function (event)
        {
            event.stopPropagation();
            if (sound.playState == 1 || !sound.paused)
            {
                sound.stop();
                sound.setPosition(0);
                $(".time-indicator", playerElement).html(
                        msToTime(sound.position,
                                sound.duration,
                                !$(".time-indicator-container", playerElement).hasClass("on"),
                                showMs));
                $(".position-indicator", playerElement).css("left", "0%");
                switchOff($(".play", playerElement));
            }
        });

        $(".display", this).bind("toggle", function (event, on)
        {
            if (on)
                $(".background", playerElement).css("background", "url(" + spectrum + ")");
            else
                $(".background", playerElement).css("background", "url(" + waveform + ")");
            $(".background", playerElement).css("backgroundSize", 'contain');
            $(".background", playerElement).css("backgroundRepeat", 'no-repeat');
        });

        $(".measure", this).bind("toggle", function (event, on)
        {
            if (on)
                $(".measure-readout-container", playerElement).stop().fadeTo(100, 1.0);
            else
                $(".measure-readout-container", playerElement).stop().fadeTo(100, 0);
        });

        $(".background", this).click(function(event)
        {
            var pos = getMousePosition(event, $(this));
            sound.setPosition(duration * pos[0] / $(this).width());
            if (sound.playState == 0 || sound.paused)
            {
                sound.play();
                switchOn($(".play", playerElement));
            }
        });

        $(".time-indicator-container", this).click(function(event)
        {
            event.stopPropagation();
            $(this).toggleClass("on");
        });

        $(this).hover(function()
        {
            if ($(this).hasClass("large"))
            {
                $(".controls", playerElement).stop().fadeTo(50, 1.0);
                if ($(".measure", playerElement).hasClass("on"))
                    $(".measure-readout-container", playerElement).stop().fadeTo(50, 1.0);
            }
        },function()
        {
            if ($(this).hasClass("large"))
            {
                $(".controls", playerElement).stop().fadeTo(2000, 0.2);
                if ($(".measure", playerElement).hasClass("on"))
                    $(".measure-readout-container", playerElement).stop().fadeTo(2000, 0.2);
            }
        });

        $(this).mousemove(function (event)
        {
            var readout = "";
            pos = getMousePosition(event, $(this));

            if ($(".display", playerElement).hasClass("on"))
            {
                readout = _mapping[Math.floor(pos[1])].toFixed(2) + "hz";
            }
            else
            {
                var height2 = $(this).height()/2;

                if (pos[1] == height2)
                    readout = "-inf";
                else
                    readout = (20 * Math.log( Math.abs(pos[1]/height2 - 1) ) / Math.LN10).toFixed(2);

                readout = readout + " dB";
            }

            $('.measure-readout', playerElement).html(readout);
        });

        // Check if spectrogram image should be used by default
        if (!$(this).hasClass("mini")) {
            if (typeof spectrogramByDefault !== "undefined") {
                if (spectrogramByDefault) {
                    var display_element = $('.display');
                    if (display_element.length !== 0) {
                        // Switch to to background spectrogram by simulating click on toggle button
                        display_element.trigger('click');
                    } else {
                        // Switch to to background spectrogram by replacing the image (toggle display button does not exist)
                        $(".background", playerElement).css("background", "url(" + spectrum + ")");
                        $(".background", playerElement).css("backgroundSize", 'contain');
                        $(".background", playerElement).css("backgroundRepeat", 'no-repeat');
                    }
                }
            }
        }

        return true;
    });
}
</script>
`


runme();
