// ==UserScript==
// @name         Netflix Romanian Subtitle Resizer
// @icon         https://image.flaticon.com/icons/png/128/1450/1450370.png
// @namespace    https://bitbucket.org/adrianaxente/netflix/downloads/netflix_romanian_subtitle_resizer.js
// @version      0.3
// @description  A simple script that will resize Netflix image based subtitles!
// @author       Adrian Axente adrianaxente@yahoo.com
// @match        https://www.netflix.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/412646/Netflix%20Romanian%20Subtitle%20Resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/412646/Netflix%20Romanian%20Subtitle%20Resizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getDeepValue(obj, path) {
        const parts = path.split('.');
        let rv, index;
        for (rv = obj, index = 0; rv && index < parts.length; ++index) {
            rv = rv[parts[index]];
        }
        return rv;
    }

    function createClass(name, rules){
        var style = document.createElement('style');
        style.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(style);
        if(!(style.sheet||{}).insertRule) {
            (style.styleSheet || style.sheet).addRule(name, rules);
        } else {
            style.sheet.insertRule(name+"{"+rules+"}",0);
        }
    }

    const characterSize = getDeepValue(window, "netflix.appContext.state.model.models.userInfo.data.timedTextStyleOverrides.characterSize");

    let imageBasedTimedTextPercent;

    switch(characterSize) {
        case "SMALL":
            imageBasedTimedTextPercent = 40;
            break;
        case "MEDIUM":
            imageBasedTimedTextPercent = 70;
            break;
        default:
            imageBasedTimedTextPercent = 100;
            break;
    }

    if (imageBasedTimedTextPercent !== 100) {
        createClass('.image-based-timed-text',"top:" + (100 - imageBasedTimedTextPercent) + "% !important;");
        console.log("Netflix Romanian subtitle resized to: " + imageBasedTimedTextPercent + "%");
    }
})();