// ==UserScript==
// @name         ASU Canvas/PlayPosit QOL Mod
// @namespace    http://tampermonkey.net/
// @version      v0.2
// @description  Quality of life improvements for ASU online course videos.
// @author       Jacob Biddle
// @match        https://canvas.asu.edu/courses/*
// @match        https://api.playposit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asu.edu
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530140/ASU%20CanvasPlayPosit%20QOL%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/530140/ASU%20CanvasPlayPosit%20QOL%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var wrapper, lti_embed, playerIframe, transcript, transcript_wrapper, vt, alt_transcript;

    // All updates run through a DOM mutation observer for simplicity.
    var observer = new MutationObserver(onMutated);
    observer.observe(document, {childList: true, subtree: true});

    function onMutated(changes, observer) {
        // Canvas video wrapper. Default limits to 800x600. Just overwride css to 100% width to match page layout.
        // Also have to update the content wrapper to remove max-width limits
        if (!lti_embed) {
            lti_embed = document.getElementsByClassName("lti-embed")[0]
            if (lti_embed) {
                wrapper = document.getElementById("wrapper")
            }
        } else {
            lti_embed.style.width = "100%";
            lti_embed.style.height = "auto";
            lti_embed.style['min-height'] = "600px";
            lti_embed.style['aspect-ratio'] = "1.667";

            wrapper.style['max-width'] = "100%";
        }

        // This is an intermediate iframe
        //if (!playerIframe)
        //        playerIframe = document.getElementById('playerIframe')

        // PlayPosit video player speed option hook - inserts some additional speeds after the vue component renders
        let speed_settings = document.getElementById("playback-speed-select-all")
        if (speed_settings && speed_settings.innerHTML.indexOf("playback-four") === -1) {
            speed_settings.innerHTML += '<option id="playback-three" class="playboack-option" value="3"> 3x Speed </option>'
            speed_settings.innerHTML += '<option id="playback-four" class="playboack-option" value="4"> 4x Speed </option>'
        }

        // PlayPosit sidebar updates for the transcript tab
        if (!transcript || !transcript_wrapper) {
            transcript = document.getElementById("transcript")
            transcript_wrapper = document.getElementsByClassName("transcript-wrapper")[0]

            // Initial set-up once the vue component is rendered
            if (transcript && transcript_wrapper) {
                vt = transcript.__vue__
                vt.hasLoadedAltTranscript = false
                vt.loadingAltTranscript = false

                // Hook into the transcript loading function to update between videos
                vt.__loadTranscriptFile = vt.loadTranscriptFile
                vt.loadTranscriptFile = () => {
                    if (vt.hasLoadedAltTranscript) {
                        if (alt_transcript) {
                            alt_transcript.parentNode.removeChild(alt_transcript);
                        }
                    }
                    vt.hasLoadedAltTranscript = false
                    vt.__loadTranscriptFile()
                }

                // Add watch to vue transcript's activeIndex to highlight active and viewed text
                vt.$watch('activeIndex', (newIdx, oldIdx) => {
                    if (alt_transcript && alt_transcript.children.length > Math.max(oldIdx, newIdx)) {
                        if (oldIdx > -1) {
                            alt_transcript.children[oldIdx].style.color = "gray";
                            alt_transcript.children[oldIdx].style["font-weight"] = "";
                        }
                        if (newIdx > -1) {
                            alt_transcript.children[newIdx].style.color = "blue";
                            alt_transcript.children[newIdx].style["font-weight"] = "700";
                        }
                    }
                })


                // Add scrolling to the transcript-wrapper
                transcript_wrapper.setAttribute("style", "overflow-y:scroll")
            }
        } else {
            // Populate a readable transcript if a new transcript is loaded
            if (!vt.hasLoadedAltTranscript && !vt.loadingTranscript) {
                vt.hasLoadedAltTranscript = true
                alt_transcript = document.createElement('div')
                alt_transcript.setAttribute("style", "margin: 0 2.5%; padding: 0 10px;");

                transcript_wrapper.prepend(alt_transcript);
                let captions = Object.values(vt.parsedTranscripts)[0]
                for (let c in captions) {
                    let span = document.createElement('span')
                    span.innerHTML = captions[c].text + ' '
                    span.style.cursor = "pointer"
                    span.addEventListener("click", () => { vt.jump(captions[c]) });
                    span.onmouseover = () => {span.style["text-decoration-line"] = "underline"};
                    span.onmouseout = () => {span.style["text-decoration-line"] = ""};

                    alt_transcript.append(span)
                }
            }
        }

    }
})();