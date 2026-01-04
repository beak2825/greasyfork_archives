// ==UserScript==
// @name         UltividsWorld
// @namespace    https://ultivids.com
// @version      0.1.3
// @description  Add Ultivids note taking to Ultiworld videos
// @author       Rui Da Costa
// @match        https://ultiworld.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ultivids.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529622/UltividsWorld.user.js
// @updateURL https://update.greasyfork.org/scripts/529622/UltividsWorld.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ultividsFrame;

    window.ultividsQuickNote = (data) => {
        muxReady().then(muxVideo => {
            if(ultividsFrame){
                const args = {
                    name: 'newNote',
                    value: muxVideo.currentTime
                }
                ultividsFrame.contentWindow.postMessage(args, 'https://ultivids.com');
            }
        });
    }

    window.ultividsStartNote = (data) => {
        muxReady().then(muxVideo => {
            if(ultividsFrame){
                const args = {
                    name: 'startNote',
                    value: muxVideo.currentTime
                }
                ultividsFrame.contentWindow.postMessage(args, 'https://ultivids.com');
            }
        });
    }
    window.ultividsEndNote = (data) => {
        muxReady().then(muxVideo => {
            if(ultividsFrame){
                const args = {
                    name: 'endNote',
                    value: muxVideo.currentTime
                }
                ultividsFrame.contentWindow.postMessage(args, 'https://ultivids.com');
            }
        });
    }

    window.ultividsGoTo = (data) => {
        muxReady().then(muxVideo => {
            if(data.time) muxVideo.currentTime = data.time;
            if(muxVideo.paused) muxVideo.play();
        })
    }

    window.ultividsForward = (data) => {
        muxReady().then(muxVideo => {
            muxVideo.currentTime = muxVideo.currentTime + (data.time ? data.time : 10);
        })
    }
    window.ultividsReverse = (data) => {
        muxReady().then(muxVideo => {
            muxVideo.currentTime = muxVideo.currentTime - (data.time ? data.time : 10);
        })
    }

    window.ultividsClose = (data) => {
        muxReady().then(muxVideo => {
            if (document.fullscreenElement) {
                document.exitFullscreen().then(() => {
                    closeUltivids();
                });
            }
        });
    }

    const onTimeUpdate = (event) => {
        const muxVideo = document.getElementsByTagName('mux-player')[0];

        const args = {
            name: 'timeupdate',
            value: muxVideo.currentTime
        }
        ultividsFrame.contentWindow.postMessage(args, 'https://ultivids.com');
    }

    const muxReady = () => {
        return new Promise(res => {
            if(document.getElementsByTagName('mux-player').length > 0){
                res(document.getElementsByTagName('mux-player')[0]);
            }
            else {
                setTimeout(() => {
                    muxReady().then((player) => { res(player); })
                }, 500)
            }
        })

    }

    const setStyles = (elem, styles) => {
        Object.keys(styles).forEach(key => {
            elem.style[key] = styles[key];
        });
    }

    const exitFullscreen = (event) => {
        if (!document.fullscreenElement) {
            closeUltivids();
        }
    }

    const closeUltivids = () => {
        const muxVideo = document.getElementsByTagName('mux-player')[0];
        ultividsFrame.remove();
        const shareDiv = document.getElementsByClassName('video-share')[0];
        const section = document.getElementsByClassName('reference-section')[0];
        setStyles(shareDiv, { display: 'block' });
        setStyles(muxVideo, { width: 'auto'});
        setStyles(section, { display: 'block' });
        muxVideo.removeEventListener('timeupdate', onTimeUpdate, false);
    }

    muxReady().then((muxVideo) => {
        const onMessage = (event) => {
            // Check sender origin to be trusted
            if (event.origin !== "https://ultivids.com") return;

            var data = event.data;

            if (typeof(window[data.func]) == "function") {
                window[data.func].call(null, data);
            }
        }

        if (window.addEventListener) {
            window.addEventListener("message", onMessage, false);
        }
        else if (window.attachEvent) {
            window.attachEvent("onmessage", onMessage, false);
        }
        muxVideo.addEventListener('timeupdate', onTimeUpdate, false);

        const shareDiv = document.getElementsByClassName('video-share')[0];
        const ultividsButton = document.createElement('button');
        ultividsButton.innerText = 'Open Ultivids';
        setStyles(ultividsButton, {
            margin: '5px 10px',
            border: '0',
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: '5px',
            height: '36px',
            padding: '0 15px',
            fontSize: '14px',
            top: '.5px',
            position: 'relative'
        });
        document.addEventListener("fullscreenchange", exitFullscreen, false);
        shareDiv.prepend(ultividsButton);
        ultividsButton.addEventListener("click", (event) => {
            let uwUser = -1;
            const section = document.getElementsByClassName('reference-section')[0];
            ultividsFrame = document.createElement('iframe');
            const splits = window.location.href.split('/');
            const videoId = splits[splits.findIndex(item => item == 'video') + 1];
            ultividsFrame.src = `https://ultivids.com/ultiworld/${uwUser}/uw${videoId}`;
            setStyles(section, {
                display: 'flex',
                'flex-direction': 'row'
            });
            section.append(ultividsFrame);
            const width = '18rem';
            setStyles(ultividsFrame, {
                width: width,
                border: 0
            })
            setStyles(shareDiv, { display: 'none' });
            setStyles(muxVideo, { width: `calc(100% - ${width})`});
            section.requestFullscreen();
        });
    });
})();