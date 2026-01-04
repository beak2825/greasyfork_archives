// ==UserScript==
// @name         MPP Soundfont Loader
// @namespace    https://github.com/Kirogii
// @version      0.1
// @description  Loads sound packs into multiplayer piano & clones (edit script to add sites template: "// @match        *://*.site.com/*"
// @author       Kirogii
// @match        *://*.multiplayerpiano.net/*
// @match        *://*.multiplayerpiano.org/*
// @match        *://*.multiplayerpiano.dev/*
// @match        *://*.singleplayerpiano.com/*

// @license MIT

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533752/MPP%20Soundfont%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/533752/MPP%20Soundfont%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const soundfontUrls = {
        "SM64MusicBox": "https://hri7566.github.io/SM64MusicBox/",
		"MarioPaintDog": "https://hri7566.github.io/Dog/",
		"RobloxDeathSound": "https://hri7566.github.io/RobloxDeathSound/",
		"MarioPaintGuitar": "https://hri7566.github.io/MarioPaintGuitar/",
		"SM64Dire": "https://raw.githubusercontent.com/Hri7566/sm64dire/master/",
    };

    const soundfontExt = ".mp3";
    const soundfontKeys =  ["a-1", "as-1", "b-1"];
    const bare_notes = "c cs d ds e f fs g gs a as b".split(" ");
    for(var oct = 0; oct < 7; oct++) {
        for(var i in bare_notes) {
            soundfontKeys.push(bare_notes[i] + oct);
        }
    }
    soundfontKeys.push("c7");
    // --- End Configuration ---

    // Function to load and add a soundfont
    function addSoundfontToSelector(soundfontName, baseUrl, keys, ext) {
        if (!MPP || !MPP.piano || !MPP.piano.audio || !MPP.soundSelector) {
            console.warn("MPP, audio engine, or sound selector not found. Soundfont loading failed.");
            return;
        }

        console.log(`Adding soundfont to selector: ${soundfontName}`);

        const pack = {
            name: soundfontName,
            keys: keys,
            ext: ext,
            url: baseUrl
        };

        // Add the pack using SoundSelector's addPack method
        MPP.soundSelector.addPack(pack, false); // false to *not* immediately load the sounds

        // Trigger a UI update (this might need adjustment based on the actual MPP site)
        if (MPP.soundSelector.notification && MPP.soundSelector.notification.domElement) {
          MPP.soundSelector.notification.close(); // close the sound selector menu if it is open
          $("#sound-btn").click(); // and open it back up
        } else {
          // Fallback: Force a refresh of the sound selector (this might not work perfectly)
          // MPP.soundSelector.init(); // Re-initialize sound selector, this is probably bad
        }


    }

    function loadSoundfont(soundfontName, baseUrl, keys, ext) {
        if (!MPP || !MPP.piano || !MPP.piano.audio) {
            console.warn("MPP or its audio engine not found.  Soundfont loading failed.");
            return;
        }

        console.log(`Loading soundfont: ${soundfontName} from ${baseUrl}`);

        // Create a promise to load each sound
        const loadPromises = keys.map(key => {
            return new Promise((resolve, reject) => {
                const url = baseUrl + key + ext;
                MPP.piano.audio.load(key, url, () => {
                    console.log(`Loaded ${key} from ${url}`);
                    resolve();
                });
            });
        });

        // Wait for all sounds to load
        Promise.all(loadPromises)
            .then(() => {
                console.log(`Soundfont ${soundfontName} loaded successfully!`);
                // You can add a notification here to confirm loading
                new Notification({
                    title: "Soundfont Loaded",
                    text: `The ${soundfontName} soundfont has been loaded.`,
                    duration: 3000, // Display for 3 seconds
                    target: "#piano" // Or wherever you want the notification to appear
                });
            })
            .catch(error => {
                console.error(`Error loading soundfont ${soundfontName}:`, error);
                // Add a notification for the error
                new Notification({
                    title: "Soundfont Load Error",
                    text: `Failed to load the ${soundfontName} soundfont.  Check the console for details.`,
                    duration: 5000,
                    target: "#piano",
                    "class": "error" // Or whatever error class you want
                });
            });
    }

    // --- Main Script ---

    // Wait for MPP and soundSelector to be available
    function waitForMPPAndSoundSelector() {
        if (typeof MPP !== 'undefined' && MPP.piano && MPP.piano.audio && typeof MPP.piano.audio.load === 'function' && typeof MPP.soundSelector !== 'undefined' && typeof MPP.soundSelector.addPack === 'function') {
            console.log("MPP and SoundSelector detected.  Adding Soundfonts.");

            for (const [soundfontName, baseUrl] of Object.entries(soundfontUrls)) {
              addSoundfontToSelector(soundfontName, baseUrl, soundfontKeys, soundfontExt);
              loadSoundfont(soundfontName, baseUrl, soundfontKeys, soundfontExt); // also load the sounds
            }
        } else {
            setTimeout(waitForMPPAndSoundSelector, 200); // Check again in 200ms
        }
    }

    waitForMPPAndSoundSelector();

})();