// ==UserScript==
// @name         ClearNotes (ships only)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove all notes and custom colours from ships.
// @author       Daniel Vale
// @match        http://*/*
// @grant        none
// @include       https://planets.nu/#/*
// @include       https://planets.nu/*
// @include       http://play.planets.nu/*
// @include       http://test.planets.nu/*
// @downloadURL https://update.greasyfork.org/scripts/420660/ClearNotes%20%28ships%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/420660/ClearNotes%20%28ships%20only%29.meta.js
// ==/UserScript==
function wrapper () {// wrapper for injection
    'use strict';

    // instantiate a new object, and register it as a plugin
    var version = "0.1";
    var name = "Celar Notes";

    // Declare an object type (constructor)
    function ClearNotes() {

        this.showmap = function() {
            console.log("Clear Notes - running");

            for (var i = 0; i < vgap.notes.length; i++){
                var note = vgap.notes[i];
                if (note !== null) {
                    if (note.targettype == 2) {
                        // planet or ship note
                        note.body = "";
                        note.color = "";
                        note.changed = 1;
                    }
                }
            }
            vgap.map.clearcace
            vgap.map.draw();
        }
    }
    // create an instance of the plugin and register it
    var plugin = new ClearNotes();
    vgap.registerPlugin(plugin, "TestPlugin");
    console.log(name + " " + version + " planets.nu plugin registered");
}


var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);


