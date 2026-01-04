// ==UserScript==
// @name         Youtube: Colored thumbnails borders based on video duration
// @description  Colors border of thumbnails on Youtube based on the duration of the video
// @author       jeposte
// @version      1.1.0
// @license      MIT
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.min.js
// @match        https://www.youtube.com/
// @match        https://www.youtube.com/feed/subscriptions
// @match        https://www.youtube.com/feed/history
// @match        https://www.youtube.com/playlist
// @match        https://www.youtube.com/@*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/476091/Youtube%3A%20Colored%20thumbnails%20borders%20based%20on%20video%20duration.user.js
// @updateURL https://update.greasyfork.org/scripts/476091/Youtube%3A%20Colored%20thumbnails%20borders%20based%20on%20video%20duration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Settings window stuff
    initStyle();
    function updatePreview(gmc) {
        var iframe = document.getElementById('youtubeColoredThumbnails');
        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        const oldPreview = innerDoc.getElementById("youtubeColoredThumbnails_preview");
        if (oldPreview !== null) {
            oldPreview.remove();
        }
        const htmlStr = `
        <div id="youtubeColoredThumbnails_preview" style="display: flex;">
          <div style="background-color: ` + gmc.get('lvl1Color') + `; flex-grow: 1; text-align: center;">0 to ` + gmc.get('lvl1Value') + ` min</div>
          <div style="background-color: ` + gmc.get('lvl2Color') + `; flex-grow: 1; text-align: center;">` + (gmc.get('lvl1Value') + 1) + ` to ` + gmc.get('lvl2Value') + ` min</div>
          <div style="background-color: ` + gmc.get('lvl3Color') + `; flex-grow: 1; text-align: center;">` + (gmc.get('lvl2Value') + 1) + ` to ` + gmc.get('lvl3Value') + ` min</div>
          <div style="background-color: ` + gmc.get('lvl4Color') + `; flex-grow: 1; text-align: center;">` + (gmc.get('lvl3Value') + 1) + ` to ` + gmc.get('lvl4Value') + ` min</div>
          <div style="background-color: ` + gmc.get('lvl4Color') + `; flex-grow: 1; text-align: center;">` + (gmc.get('lvl4Value') + 1) + ` min to ∞</div>
        </div>
        `;
        var parser = new DOMParser();
        var preview = parser.parseFromString(htmlStr, 'text/html');
        innerDoc.getElementById("youtubeColoredThumbnails_buttons_holder").before(preview.body);
    }

    let gmc = new GM_config(
        {
            'id': 'youtubeColoredThumbnails',
            'title': 'Youtube colored thumbnails settings',
            'fields':
            {
                'lvl1Color': {
                    'label': 'Level 1 color hex (default: green)',
                    'section': ['Color configuration'],
                    'type': 'text',
                    'default': '#6DFF57'
                },
                'lvl2Color': {
                    'label': 'Level 2 color hex (default: yellow)',
                    'type': 'text',
                    'default': '#FFFF54'
                },
                'lvl3Color': {
                    'label': 'Level 3 color hex (default: orange)',
                    'type': 'text',
                    'default': '#FF7429'
                },
                'lvl4Color': {
                    'label': 'Level 4 color hex (default: red)',
                    'type': 'text',
                    'default': '#CC001A'
                },
                'lvl1Value': {
                    'label': 'Level 1 max duration in minutes (duration from 0 minutes to this value)',
                    'section': ['Range configuration'],
                    'type': 'unsigned int',
                    'max': 59,
                    'default': 2
                },
                'lvl2Value': {
                    'label': 'Level 2 max duration in minutes (duration from Level 1 max to this value)',
                    'type': 'unsigned int',
                    'max': 59,
                    'default': 6
                },
                'lvl3Value': {
                    'label': 'Level 3 max duration in minutes (duration from Level 2 max to this value)',
                    'type': 'unsigned int',
                    'max': 59,
                    'default': 12
                },
                'lvl4Value': {
                    'label': 'Level 4 max duration in minutes (duration from Level 3 max to this value)',
                    'type': 'unsigned int',
                    'max': 59,
                    'default': 20
                },
                'borderWidth': {
                    'label': 'Border width in px (default: 3, min 1, max 100)',
                    'section': ['Border configuration'],
                    'type': 'unsigned int',
                    'min': 1,
                    'max': 100,
                    'default': 3
                },
                'borderRadius': {
                    'label': 'Border radius in px (default: 15, min 0, max 100)',
                    'type': 'unsigned int',
                    'min': 0,
                    'max': 100,
                    'default': 15
                },
            },
            'events': // Callback functions object
            {
                // 'init': function() { updatePreview(this) },
                'open': function() { updatePreview(this) },
                'save': function() { updatePreview(this) },
                'reset': function() { updatePreview(this) }
            },
            css: [
                "#youtubeColoredThumbnails input[type='text'] { width: 100px; } ",
                "#youtubeColoredThumbnails input[type='number'] { width: 50px; } ",
                "#youtubeColoredThumbnails .reset, #youtubeColoredThumbnails .reset a, #youtubeColoredThumbnails_buttons_holder { text-align: center; }",
            ].join('\n'),
        }
    );
    if (!GM_registerMenuCommand) {
        console.error('Youtube colored thumbnails', 'Please upgrade to the latest version of Greasemonkey to use GM_registerMenuCommand.');
        return;
    }
    GM_registerMenuCommand("Settings", () => gmc.open());
    // End of settings window related stuff


    setInterval(getVideoDuration, 1000);
    function getVideoDuration() {
        // get all video duration HTML elements on the page
        const durationsElem = document.querySelectorAll('div#time-status > span.ytd-thumbnail-overlay-time-status-renderer');

        // loop through every video duration element
        for(let i = 0; i < durationsElem.length; i++) {
            const durationElem = durationsElem[i]; // video duration HTML element
            const durationStr = durationElem.innerHTML; // video duration string
            if (typeof durationStr === 'string' && !!durationStr) {
                // get the parent we want to customize (the thumbnail)
                let thumbnailElem = durationElem.closest("div#thumbnail");;
                const splittedDuration = durationStr.split(':');
                // handle video longer than 1 hour
                let minutes = 59;
                if (splittedDuration.length == 2) {
                    try {
                        minutes = parseInt(splittedDuration[0])
                    } catch (e) {
                        console.error('Youtube colored thumbnails', 'Error while parsing minute number from video durations');
                    }
                }

                // apply style based on duration
                thumbnailElem.style.borderRadius = gmc.get('borderRadius') + 'px';
                const borderStyleStr = 'solid ' + gmc.get('borderWidth') + 'px ';
                if (minutes <= gmc.get('lvl1Value')) {
                    thumbnailElem.style.border = borderStyleStr + gmc.get('lvl1Color'); // solid green
                } else if (minutes <= gmc.get('lvl2Value')) {
                    thumbnailElem.style.border = borderStyleStr + gmc.get('lvl2Color'); // solid yellow
                } else if (minutes <= gmc.get('lvl3Value')) {
                    thumbnailElem.style.border = borderStyleStr + gmc.get('lvl3Color'); // solid orange
                } else if (minutes <= gmc.get('lvl4Value')) {
                    thumbnailElem.style.border = borderStyleStr + gmc.get('lvl4Color'); // solid red
                } else {
                    thumbnailElem.style.border = 'dashed ' + gmc.get('borderWidth') + 'px ' + gmc.get('lvl4Color'); // dotted red
                }
            }
        }
    }

    function initStyle() {
        const configStyle = document.createElement('style');
        configStyle.textContent = `
          iframe#youtubeColoredThumbnails {
            min-width: 800px;
            width: 800px;
            min-height: 600px;
            height: 600px;
            z-index: 99999;
          }
        `.replace(/;/g, '!important;');
        document.head.appendChild(configStyle);
    }
})();