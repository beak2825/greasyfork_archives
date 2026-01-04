// ==UserScript==
// @name         bitchute
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Unlisted for now... No Description needed!
// @author       You
// @match        https://www.bitchute.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitchute.com
// @grant        none
// @license      No License
// @downloadURL https://update.greasyfork.org/scripts/441848/bitchute.user.js
// @updateURL https://update.greasyfork.org/scripts/441848/bitchute.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Causes video player to stay at the top in fullscreen mode on mobile.
    // Disabling doesn't seem to cause any issues.
    window.htmlRatioComponentHelper.initialize = function(){};
    window.htmlRatioComponentHelper.documentResize = function(){};
    window.htmlRatioComponentHelper.initializeAll = function(){};
    window.htmlRatioComponentHelper.nodeInserted = function(){};


    function loadMedia() {
        let media_src = document.querySelector('#player source').src;
        let castSession = cast.framework.CastContext.getInstance().getCurrentSession();
        var mediaInfo = new chrome.cast.media.MediaInfo(media_src, 'video/mp4');
        var request = new chrome.cast.media.LoadRequest(mediaInfo);
        castSession.loadMedia(request).then(
            function() { console.log('Load succeed'); },
            function(errorCode) { console.log('Error code: ' + errorCode); });
    }

    function initCast() {

        let menu = document.querySelector('.plyr__controls__item.plyr__menu');
        if (menu) {

            let initializeCastApi = function() {
                console.log(cast.framework.CastContext);
                let castInstance = cast.framework.CastContext.getInstance();
                castInstance.addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED, function(session){
                    if (session.sessionState === 'SESSION_STARTED') {
                        loadMedia();
                    }
                })
                castInstance.setOptions({
                    receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
                });

                let cast_button = document.createElement("google-cast-launcher");
                cast_button.style.width = '25px';
                cast_button.style.cursor = 'pointer';
                menu.append(cast_button);
            };

            window['__onGCastApiAvailable'] = function(isAvailable) {
                if (isAvailable) {
                    initializeCastApi();
                }
            };

            let script = document.createElement('script');
            script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
            document.head.append(script);

        }


    }

    initCast();



    function initPlayer(playerInstance) {
        // https://github.com/sampotts/plyr

        playerInstance.media.style.height = '100%';

        let styleRewind = `
          width: 35%;
          height: 90%;
          z-index: 9999;
          position: absolute;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: rgb(181, 181, 181);
          background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%);
          opacity: 0.0;
          border-radius: 0px 160px 160px 0px;
          user-select: none;
        `;

        let styleForward = `
          width: 35%;
          height: 90%;
          z-index: 9999;
          position: absolute;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: rgb(181, 181, 181);
          background: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 85%);
          opacity: 0.0;
          border-radius: 160px 0px 0px 160px;
          user-select: none;
        `;

        let bttnRewind = document.createElement('div');
        let bttnForward = document.createElement('div');

        bttnRewind.textContent = '-10s';
        bttnForward.textContent = '+10s';

        bttnRewind.setAttribute('id', 'bttn-rewind');
        bttnForward.setAttribute('id', 'bttn-forward');

        bttnRewind.setAttribute('style', styleRewind);
        bttnForward.setAttribute('style', styleForward);

        let elVControls = playerInstance.elements.controls;
        elVControls.before(bttnRewind);
        elVControls.before(bttnForward);


        bttnRewind.addEventListener("click", seekHandler);
        bttnForward.addEventListener("click", seekHandler);

        let tapedTwice = false;
        let seeked = 0;
        let seekedTimer;

        function seekHandler(event) {
            let targetEl = event.target;
            let targetId = targetEl.getAttribute('id');
            if(!tapedTwice) {
                tapedTwice = true;
                playerInstance.config.fullscreen.enabled = false;
                setTimeout( function() {
                    if (tapedTwice) {
                        playerInstance.togglePlay();
                    }
                    tapedTwice = false;
                    playerInstance.config.fullscreen.enabled = true;

                }, 300 );
                return false;
            }
            event.preventDefault();
            clearInterval(seekedTimer);
            seeked += 10;
            if (targetId === 'bttn-rewind') {
                targetEl.textContent = `-${seeked}s`;
                playerInstance.rewind(10);
            } else if (targetId === 'bttn-forward') {
                targetEl.textContent = `+${seeked}s`;
                playerInstance.forward(10);
            }
            targetEl.style.transitionDuration = '0s';
            targetEl.style.opacity = '0.80';
            setTimeout(()=>{
                targetEl.style.transitionDuration = '0.75s';
                targetEl.style.opacity = '0.0';
                seekedTimer = setTimeout(()=>{if (!tapedTwice){seeked = 0}}, 750);
            }, 300)
            tapedTwice = false;
        }

        let has_played = false;

        playerInstance.on('playing', (event) => {
            const instance = event.detail.plyr;
            let video_id = instance.source.match(/.*\/(.*)\.mp4/)[1];
            if (!has_played && !!window.localStorage.getItem(video_id)) {
                instance.currentTime = parseFloat(window.localStorage.getItem(video_id));
            }
            has_played = true;
        });

        playerInstance.on('timeupdate', (event) => {
            const instance = event.detail.plyr;
            let video_id = instance.source.match(/.*\/(.*)\.mp4/)[1];
            if ((instance.duration - instance.currentTime) <= 10) {
                window.localStorage.removeItem(video_id);
            } else {
                window.localStorage.setItem(video_id, event.detail.plyr.currentTime)
            }

        });
    }

    initPlayer(plyr);

    let observer = new MutationObserver((mutationsList, observer) => {
        for (let record of mutationsList) {
            if (record.addedNodes.length > 0) {
                for (let addedNode of record.addedNodes) {
                    if (!!addedNode.classList && addedNode.classList.contains('container')) {
                        initPlayer(plyr);
                    }
                }
            }
        }
    });

    observer.observe(document.querySelector('#main-content'), {
        attributes: true,
        childList: true,
        subtree: false
    });

})();