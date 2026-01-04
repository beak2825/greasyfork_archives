// ==UserScript==
// @name         YouTube.com audio only mode buttons (Mobile / Desktop)
// @namespace    youtube-download-buttons-video-audio
// @version      1.6
// @description  Adds buttons below video to play media in audio only mode. Works on mobile (m.youtube.com) and on desktop.
// @author       hlorand.hu
// @match        https://m.youtube.com/*
// @match        https://youtube.com/*
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      https://creativecommons.org/licenses/by-nc-sa/4.0/
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/494186/YouTubecom%20audio%20only%20mode%20buttons%20%28Mobile%20%20Desktop%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494186/YouTubecom%20audio%20only%20mode%20buttons%20%28Mobile%20%20Desktop%29.meta.js
// ==/UserScript==

// Screenshot: https://ibb.co/F7NJZHT

(function() {
    //'use strict';

    // itag quality descriptors
    // https://gist.github.com/sidneys/7095afe4da4ae58694d128b1034e01e2
    function getQualityFromItag(itag) {
        const q = {
            '5':'FLV 240p',
            '6':'FLV 270p',
            '17':'3GP 144p',
            '18':'MP4 360p',
            '22':'MP4 720p',
            '34':'FLV 360p',
            '35':'FLV 480p',
            '36':'3GP 180p',
            '37':'MP4 1080p',
            '38':'MP4 3072p',
            '43':'WebM 360p',
            '44':'WebM 480p',
            '45':'WebM 720p',
            '46':'WebM 1080p',
            '82':'MP4 360p (3D)',
            '83':'MP4 480p (3D)',
            '84':'MP4 720p (3D)',
            '85':'MP4 1080p (3D)',
            '92':'HLS 240p (3D)',
            '93':'HLS 360p (3D)',
            '94':'HLS 480p (3D)',
            '95':'HLS 720p (3D)',
            '96':'HLS 1080p (3D)',
            '100':'WebM 360p (3D)',
            '101':'WebM 480p (3D)',
            '102':'WebM 720p (3D)',
            '132':'HLS 240p',
            '133':'MP4 240p Video Only',
            '134':'MP4 360p Video Only',
            '135':'MP4 480p Video Only',
            '136':'MP4 720p Video Only',
            '137':'MP4 1080p Video Only',
            '138':'MP4 2160p60 Video Only',
            '139':'M4A Audio Only 48k',
            '140':'M4A Audio Only 128k',
            '141':'M4A Audio Only 256k',
            '151':'HLS 72p',
            '160':'MP4 144p Video Only',
            '167':'WebM 360p Video Only',
            '168':'WebM 480p Video Only',
            '169':'WebM 1080p Video Only',
            '171':'WebM Audio Only 128k',
            '218':'WebM 480p Video Only',
            '218':'WebM 144p Video Only',
            '242':'WebM 240p Video Only',
            '243':'WebM 360p Video Only',
            '244':'WebM 480p Video Only',
            '245':'WebM 480p Video Only',
            '246':'WebM 480p Video Only',
            '247':'WebM 720p Video Only',
            '248':'WebM 1080p Video Only',
            '249':'WebM Audio Only 50k',
            '250':'WebM Audio Only 70k',
            '251':'WebM Audio Only 160k',
            '264':'MP4 1440p Video Only',
            '266':'MP4 2160p60 Video Only',
            '271':'WebM 1440p Video Only',
            '272':'WebM 4320p Video Only',
            '278':'WebM 144p Video Only',
            '298':'MP4 720p60 Video Only',
            '299':'MP4 1080p60 Video Only',
            '302':'WebM 720p60 Video Only ',
            '303':'WebM 1080p60 Video Only',
            '308':'WebM 1440p60 Video Only',
            '313':'WebM 2160p Video Only',
            '315':'WebM 2160p60 Video Only',
            '330':'WebM 144p60 Video Only (hdr)',
            '331':'WebM 240p60 Video Only (hdr)',
            '332':'WebM 360p60 Video Only (hdr)',
            '333':'WebM 480p60 Video Only (hdr)',
            '334':'WebM 720p60 Video Only (hdr)',
            '335':'WebM 1080p60 Video Only (hdr)',
            '336':'WebM 1440p60 Video Only (hdr)',
            '337':'WebM 2160p60 Video Only (hdr)'
        };
        return q[itag] || "Unknown";
    }

    function addbuttons(){
        document.getElementById("downloadbuttons").innerText = "";

        // do not add buttons on homepage
        if( !window.location.href.includes("watch") ) return;

        // if config not available, reload page
        if( window.location.href.includes("watch") && ( !ytplayer.config || !ytplayer.config.args ) ){
            window.location.reload();
            return;
        }

        // get video urls from youtube config
        let medias = ytplayer.config.args.raw_player_response.streamingData.adaptiveFormats;
        medias.push(...ytplayer.config.args.raw_player_response.streamingData.formats);

        let urls = [];
        for (let media of medias) {

            // calculate filesizes
            if( media.contentLength )
                // audio
                var _filesize = Math.round(media.contentLength / 1024 / 1024); // byte->MB
            else
                // video
                var _filesize = Math.round(media.approxDurationMs/1000 * media.bitrate/1024/1024/8) // bits/s->MB

            // collet the most important data to an object
            let data = {
                url : media.url.replace(/\\u0026/g, '&'),
                qualityDescription : getQualityFromItag(media.itag),
                qualityLabel : media.qualityLabel,
                filesize : _filesize
            };

            // filter videos that has audio+video stream both included or audio only
            if( data.qualityDescription.includes("Audio Only") || data.qualityDescription.includes("MP4") && !data.qualityDescription.includes("Only") )
                urls.push( data );
        }

        // filter out duplicates
        urls = Array.from(new Set(urls.map(a => a.url))).map(url => {
            return urls.find(a => a.url === url);
        });

        // create and add buttons
        urls.forEach((url)=>{

            let button = document.createElement('button');
            button.setAttribute("url", url.url);
            button.textContent = url.qualityDescription.replace(" Only","").replace("WebM","").replace("M4A","") + (isNaN(url.filesize) ? "" : " "+url.filesize+"M");
            button.className = "downloadbutton";

            button.style.margin = "4px";
            button.style.padding = "4px";
            button.style.position = "relative";
            button.style.backgroundColor = "chocolate";

            button.onclick = function() {
                document.write(`<html>
                <body>
                  <video controls><source src=`+this.getAttribute("url")+`></video><br><br>
                  <style>button{margin-bottom:5px;font-size:large;}video{width:100%;max-height:100vh;}</style>
                  <button onclick="document.querySelector('video').playbackRate = 3">3</button><br>
                  <button onclick="document.querySelector('video').playbackRate = 2.75">2.75</button><br>
                  <button onclick="document.querySelector('video').playbackRate = 2.5">2.5</button><br>
                  <button onclick="document.querySelector('video').playbackRate = 2.25">2.25</button><br>
                  <button onclick="document.querySelector('video').playbackRate = 2">2</button><br>
                  <button onclick="document.querySelector('video').playbackRate = 1.75">1.75</button><br>
                  <button onclick="document.querySelector('video').playbackRate = 1.5">1.5</button><br>
                  <button onclick="document.querySelector('video').playbackRate = 1">1</button><br>
                </body>
              </html>`);
            };

            let target = document.getElementById('downloadbuttons');
            target.insertBefore(button, target.firstChild);

        }); // end foreach

    } // end addbuttons


        // Periodically check if the buttons are visible (sometimes YouTube redraws its interface).
        setInterval(()=>{

            // Creating a div that will contain buttons.
            if( document.getElementById("downloadbuttons") == undefined ){

                // placement of buttons on desktop
                let parent = document.getElementById('above-the-fold');

                // placement of buttons on tablet
                if( !parent ){
                    parent = document.querySelector('.watch-below-the-player');
                }

                // placement of buttons on mobile
                if( !parent ){
                    parent = document.querySelector('.related-chips-slot-wrapper');
                }

                if( parent ){
                    let wrapper = document.createElement('div');
                    wrapper.setAttribute("id","downloadbuttons");
                    parent.insertBefore(wrapper, parent.firstChild);
                    addbuttons();
                }

            }

            // Sometimes the buttons are not added, so I check and add them if necessary.
            if( document.getElementById("downloadbuttons") && document.getElementById("downloadbuttons").textContent.trim() === '' ){
                addbuttons();
            }
        }, 1000);

})();