// ==UserScript==
// @name                WME Wide-Angle Lens Conversion
// @namespace           https://greasyfork.org/en/users/19861-vtpearce
// @description         Convert data to allow switching between Firefox beta and release
// @author              crazycaveman
// @include             https://www.waze.com/WALConvert
// @version             2018-07-23
// @grant               none
// @copyright           2018 crazycaveman
// @license             CC BY-SA 4.0
// @require             https://gitcdn.xyz/repo/pieroxy/lz-string/91158b86fedb2934ba94bb2c9f238f6b2f62530b/libs/lz-string.min.js
// @downloadURL https://update.greasyfork.org/scripts/40221/WME%20Wide-Angle%20Lens%20Conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/40221/WME%20Wide-Angle%20Lens%20Conversion.meta.js
// ==/UserScript==

(function() {
    "use strict";
    var keysToLoad = ["WMEWAL_Settings",
        "WMEWALCitiesSavedSettings",
        "WMEWALLocksSavedSettings",
        "WMEWALMapCommentsSavedSettings",
        "WMEWALPlacesSavedSettings",
        "WMEWALStreetsSavedSettings"];

    function convertWALSettings() {
        var testString = "This is for testing.",
            compString,
            settings,
            settingsString,
            ix,
            settingsPrefix = "";
        if (typeof LZString === "undefined") {
            console.log("WALConvert: Unable to access LZString, waiting");
            setTimeout(convert,1000);
            return;
        }
        console.log("WALConvert: LZString loaded");
        console.log("WALConvert: Converting string: "+ testString);
        compString = LZString.compress(testString);
        console.log("WALConvert: Length: "+ compString.length);
        console.log("WALConvert: Decompressed: "+ LZString.decompress(compString));

        if (typeof (Storage) !== "undefined") {
            keysToLoad.forEach(function(settingsKey,index){
                console.log("WALConvert: Working on "+ settingsKey);

                if (localStorage[settingsKey]) {
                    settingsString = localStorage[settingsKey];
                    if (settingsString.substring(0, 1) === "~") {
                        // Compressed value - decompress
                        console.log(`WALConvert: Decompress ${settingsKey} settings using UTF16`);
                        settingsString = settingsString.substring(1);
                        settingsPrefix = "~";
                    }
                    try {
                        settings = JSON.parse(LZString.decompressFromUTF16(settingsString));
                        console.log(`WALConvert: Successful decompressFromUTF16: ${settingsKey}`);
                        if (confirm(`Successfully loaded settings. Do you want to convert ${settingsKey}?`)) {
                            localStorage[settingsKey] = LZString.compress(settingsPrefix + JSON.stringify(settings));
                        }
                    } catch (e) {
                        settings = "";
                    }

                    if (settings === "") {
                        console.log(`WALConvert: Unable to decompress UTF16 and parse ${settingsKey}. Attempting decompress`);
                        try {
                            settings = JSON.parse(LZString.decompress(settingsString));
                            console.log(`WALConvert: ${settingsKey} already good`);
                        } catch (e) {
                            settings = "";
                            console.log(`WALConvert: Unable to decompress and parse ${settingsKey}. ${settingsKey} NOT OK`);
                            if (confirm(`WAL data conversion unsuccessful (${settingsKey}); unable to parse your settings. Would you like to delete these settings?`)) {
                                localStorage.removeItem(settingsKey);
                            }
                        }
                    }
                    settingsPrefix = "";
                } else {
                    console.log("WALConvert: Skipping non-existant key: "+ settingsKey);
                }
            });
        }
    } // End convertWALSettings()

    convertWALSettings();
}
)();
