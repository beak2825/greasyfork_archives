// ==UserScript==
// @name         MIDI output for Online Sequencer
// @namespace    http://tampermonkey.net/
// @version      2025-01-10
// @description  Output sequences to a MIDI device. (This is WIP so it's not pretty)
// @author       Ethan McCoy
// @match        https://onlinesequencer.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onlinesequencer.net
// @grant        none
// @license	 MIT
// @downloadURL https://update.greasyfork.org/scripts/520894/MIDI%20output%20for%20Online%20Sequencer.user.js
// @updateURL https://update.greasyfork.org/scripts/520894/MIDI%20output%20for%20Online%20Sequencer.meta.js
// ==/UserScript==

//Load window, and various functions and classes that we are going to modify
(function(window, playNote, midiNoteNamesToIndex, settings, song, AudioSystemInstrument) {
    'use strict';


    function setInstrumentChannel (ch){
        //Assuming 'this' will be the instance
        this.midiChannel = ch;

        // Hijacking the alpha channel of the instument color as a lazy way to save the midi channel into Sequence Files
        // This means the color in the dropdown menu could be as low as 0.9372549019607843 alpha (for channel 16), which hopefully isn't noticable

        //Explicitly set color so it is saved
        this.color[0]
    }

    function removeInstrumentChannel (){
        this.midiChannel = undefined;
    }




    //I guess js lets us just mess with the class prototype even after an instance has been created and it will get those methods
    AudioSystemInstrument.prototype.setMidiChannel = setInstrumentChannel;
    AudioSystemInstrument.prototype.unsetMidiChannel = removeInstrumentChannel;

    function sendNote(midiAccess, portID, note, delay=0, length, velocityOn, velocityOff=1, channel=1) {
        channel--
        if (isFinite(midiNoteNamesToIndex[note])) { //online sequencer is using for i in array so this function is getting array methods that we want to ignore
            var now = window.performance.now();
            var noteOnDelay = now + delay * 1000;
            if (typeof length === 'undefined'){ // if it's zero we want to keep it zero eg. https://onlinesequencer.net/1859745 Angry Young Man has a lot of zero length C7 notes that shouldn't be there
                length = 1000; //making it one second if no length just because I feel like it. I'll fix it later maybe TODO length appears to be in quarter notes
            }
            var noteOffDelay = now + delay * 1000 + length;
            const noteOnMessage = [0x90 + channel, midiNoteNamesToIndex[note], Math.ceil(0x7f*velocityOn)]; // note on, note passed in, 'volume' is 0 to 1
            const noteOffMessage = [0x80 + channel, midiNoteNamesToIndex[note], Math.ceil(0x7f*velocityOff)]; // note off, note passed in, full velocity by default
            const output = midiAccess.outputs.get(portID);
            if (output && length !== 0){
                output.send(noteOnMessage, noteOnDelay); // sends the message.
                if (!isNaN(noteOffDelay)) output.send(noteOffMessage, noteOffDelay-50); // sends the message. -1 to avoid sending noteOn at the exact same time
            }
        }
    }

    var instIdToMidiOut = {43:[1, 'output-1'],
                           41:[1, 'output-1']};//Rather than a 1:1 table, should have instruments pass a test to see which devices and channels they go to
    function getMidiOutput (instId, testFn, ch){
        if (testFn(instId)){
            return ch;
        }else{
            return null;
        }
    }

    var useSequenceChannels = false;
    var useDefaultChannels = false; // If true, will be used instead of userPrefs, if false, will only be used when userPrefs not present

    //take an instId and midiaccess outputs map, and return output and channel for that instId
    function assignInstrumentToMidiOutput(instId, outputs){
        //{instId: [ch, outputId]}
        var userPrefs = localStorage.getItem('midiOutputTable');

        if (!useSequenceChannels && userPrefs != null){// use userPrefs exist and we want to use them
            instIdToMidiOut = userPrefs;
        }

    }


    //TODO add Instrument categories, MIDI channels, MIDI Devices
    function addInstrumentMIDIChannelUI (song, parentDiv){
        //If we are in play_mode
        //for each instrument in the song, populate a drop down menu.
        //these settings won't be saved, because it's someone else's sequence, but we can still attach the channels to the notes for this session, and save them if we enter edit mode

        var midiMenuInner = '';
        //construct the html
        song.forEachInstrument(function(instId){
            //If instument in a group. add that group if not already added, and put instrument in it
/*            midiMenu +=
            `<li class="ui-selectmenu-optgroup ui-menu-divider">
              <i class="fas fa-piano-keyboard"></i>Piano
            </li>
            `
  */
            const instrumentName = getInstrumentName(song, instId);//settings.instruments[instId];
            //var li = document.createElement("li").appendChild(document.createElement("div"))
            midiMenuInner +=`<option value="${instId}">${instrumentName}</option>`

        });

        var midiMenu = document.createElement('select');
        midiMenu.innerHTML = midiMenuInner;
        console.log('midiMenu', midiMenu);
        midiMenu.id = "midiMenu";
        midiMenu.style.display = "none";


        //If we are in edit_mode
        //There's already a drop down menu for ALL instruments, check if there's any instruments with channels and append their entries,
        //TODO create editable 'default' channels for instruments. ie, so you can just load a song and all 'electric piano' or whatever goes to channel 1. multiple instruments per channel is possible

        var enableOutput = document.createElement('input');
        enableOutput.type = "checkbox";
        enableOutput.id = "enableMidiOutput";
        var enableOutputLabel = document.createElement('label');
        enableOutputLabel.for = "enableMidiOutput";
        enableOutputLabel.innerText = "🎹";
       //muteIfMidiCheckbox.onClick=
        parentDiv.appendChild(enableOutputLabel);
        parentDiv.appendChild(enableOutput);

        //TODO, put all this into a control panel like the advanced instruments, right now it's checkboxes with labels

        var muteIfMidiCheckbox = document.createElement('input');
        muteIfMidiCheckbox.type = "checkbox";
        muteIfMidiCheckbox.id = "muteMidi";
        var muteMidiLabel = document.createElement('label');
        muteMidiLabel.for = "muteMidi";
        muteMidiLabel.innerText = "🔇"; //Mute in browser if instrument is being sent to midi device
       //muteIfMidiCheckbox.onClick=
        parentDiv.appendChild(muteMidiLabel);
        parentDiv.appendChild(muteIfMidiCheckbox);

        parentDiv.appendChild(midiMenu);
        $("#midiMenu").selectmenu({
          change: function( event, ui ) {
              selectInstrument(ui.item.element.context.value);
              //console.log(event, ui);
          }
        });

        //$("#muteMidi").button();

    }

    window.addInstrumentMIDIChannelUI = addInstrumentMIDIChannelUI;

    window.addEventListener('load', function() {
        var oldPlayNote = oldPlayNote||playNote; // if we've already assigned playNote to oldPlayNote, don't do it again or it will be playNotes all the way down

        //song.usesInstrument(43)); throws error because 'this' is undefined

        //console.log("Number of 'Electric Piano' notes:", song.numNotesPerInstrument.get(43));


        navigator.requestMIDIAccess().then(function(access){
            console.log("Access established");
            // Just going to get the first id now and later we will populate a UI and let user select
            const firstMidiOutputId = access.outputs.keys().next().value;
            //const firstMidiOutputId = 'output-2';

            var enabled = false;
            window.playNote = function(instId, name, length, delay, keyHighlight=!0, volume=1, track=!1){
                //oldPlayNote(instId, name, length, delay, keyHighlight, volume, track);
                // 41 is the piano, so here we are assuming 'output-1' is a piano TODO: when we add controls, we should allow user to pair up midi outputs to instruments
                // 43 electric piano
                enabled = document.getElementById("enableMidiOutput")?.checked;
                if (enabled){
                    var muteWhenMidi = document.getElementById("muteMidi")?.checked;

                    //var ch = instIdToMidiOut[instId][0];
                    var ch = getMidiOutput(instId, (instId) => settings.instrumentCategories.Piano.includes(instId), 1);
                    var outputId = (instIdToMidiOut[instId] && instIdToMidiOut[instId][1])||firstMidiOutputId;

                    //getMidiOutput(instId,
                    //if (instId == 41||instId == 43) {
                  //  if (settings.instrumentCategories.Piano.includes(instId)){ // is it a piano note?
                    if (ch>0){
                        sendNote(access, outputId, name, delay, length * song.sleepTime, Math.min(volume/2,1), 1, ch);//Volume goes from 0 to 2, with 1 being the default. Lets just say volume 1 is 0.5 velocity TODO: Stretch goal, editable interpolation curve instead of linear
                    }else{
                        oldPlayNote(instId, name, length, delay, keyHighlight, volume, track);
                    }

                    //Play the note as usual
                    if (!muteWhenMidi && ch>0){
                        oldPlayNote(instId, name, length, delay, keyHighlight, volume, track);
                    }
                }else{
                    oldPlayNote(instId, name, length, delay, keyHighlight, volume, track);
                }
            };
        })

        addInstrumentMIDIChannelUI(song, document.getElementById("top-bar-right")); //("titlebar"));

    }, false);


})(window, playNote, midiNoteNamesToIndex, settings, song, AudioSystemInstrument);