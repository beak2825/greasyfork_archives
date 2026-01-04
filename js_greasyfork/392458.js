// ==UserScript==
// @name         YouTube Rotate 90°
// @namespace    http://tampermonkey.net/
// @version      1.7.3
// @description  把Youtube影片旋轉0°、90°、180°、270°，讓你輕鬆觀看影片!
// @author       zaqwsx2205
// @match        https://*.youtube.com/*
// @match        https://*.youtube.com/watch?v=*
// @match        https://www.youtube.com/embed/*
// @match        https://www.youtube-nocookie.com/embed/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392458/YouTube%20Rotate%2090%C2%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/392458/YouTube%20Rotate%2090%C2%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const policy = window.trustedTypes?.createPolicy('transform90-policy', {
        createHTML: input => input
    });

    var click = 0;
    var safeURL = location.href;
    var svgicon =
        `<svg x="0px" y="0px" viewBox="0 0 248.78 250" width="24" height="24" >
            <g id="eca2fcdd-2bc2-42f1-9d5f-b6fc079f9fe7">
                <g id="ac89a795-d0d7-41f7-8442-954a17c4d3bc">
                    <path d="M76.31,66.6,0,142.92l76.31,76.31,76.31-76.31ZM33.24,142.92l43-43,43.07,43-43,43Z" style="fill: #fff"/>
                    <path d="M217.76,69.19a105.73,105.73,0,0,0-74.9-31V0l-50,50,50,49.9V61.72A82.37,82.37,0,1,1,109.5,219.34L92,236.88A105.87,105.87,0,0,0,217.76,69.19Z" style="fill: #fff"/>
                </g>
            </g>
        </svg>`;



    buildHTML();
    observeURL();

    function buildHTML() {
        document.querySelectorAll('.video-div, .video-div1, .video-div2, .transform90').forEach(function (element) {
            element.remove();
        });

        let container = document.body;
        let div = document.createElement('div');
        div.classList.add('video-div2');
        container.appendChild(div);
        div.innerHTML = policy.createHTML(`<style>
        .ytp-autohide .transform90-top {
            opacity: 0 !important;
            -moz-transition: opacity .1s cubic-bezier(0.4,0.0,1,1) !important;
            -webkit-transition: opacity .1s cubic-bezier(0.4,0.0,1,1) !important;
            transition: opacity .1s cubic-bezier(0.4,0.0,1,1) !important;
        }
        .ytp-transform90-icon {
            margin: auto !important;
            width: 36px !important;
            height: 36px !important;
            position: relative !important;
        }
        .ytp-big-mode .ytp-transform90-icon {
            width: 54px !important;
            height: 54px !important;
        }
        .ytp-transform90-title {
            font-weight: 500 !important;
            text-align: center !important;
            font-size: 14px !important;
        }
        .ytp-big-mode .ytp-transform90-title {
            font-size: 20px !important;
        }
        .ytp-miniplayer-scrim .transform90-miniplayer{
            position: absolute;
            width: 60px;
            height: 40px;
            padding: 8px;
            z-index: 67;
            top: 0;
            left: 40px;
        }
    </style>`);

        if (document.querySelectorAll('.ytp-embed').length > 0) {
            let chromeTopButtons = document.querySelector('.ytp-chrome-top-buttons');
            let button = document.createElement('button');
            button.classList.add('ytp-button', 'transform90', 'transform90-top');
            button.setAttribute('data-tooltip-opaque', 'true');
            button.setAttribute('aria-label', '');
            button.style.width = 'auto';
            button.style.height = 'auto';

            let iconDiv = document.createElement('div');
            iconDiv.classList.add('ytp-transform90-icon');
            iconDiv.style.transform = 'scaleX(-1)';
            iconDiv.innerHTML = policy.createHTML(`${svgicon}`);

            let titleDiv = document.createElement('div');
            titleDiv.classList.add('ytp-transform90-title');
            titleDiv.textContent = 'Video Rotate 90°';

            button.appendChild(iconDiv);
            button.appendChild(titleDiv);

            chromeTopButtons.prepend(button);
        } else if (document.querySelector('.ytd-miniplayer #player-container #ytd-player')) {
            let scrim = document.querySelector('.ytp-miniplayer-scrim');
            let button = document.createElement('button');
            button.classList.add('transform90', 'ytp-play-button', 'ytp-button', 'transform90-miniplayer');
            button.title = 'Video Rotate 90°';
            button.setAttribute('aria-label', 'Video Rotate 90°');
            button.style.display = 'inline-flex';
            button.style.justifyContent = 'center';
            button.style.transform = 'scaleX(-1)';
            button.innerHTML = policy.createHTML(`${svgicon}`);

            scrim.prepend(button);
        } else {
            let chromeControls = document.querySelector('.ytp-chrome-controls .ytp-right-controls');
            if (chromeControls != null) {
                let button = document.createElement('button');
                button.classList.add('transform90', 'ytp-button');
                button.title = 'Video Rotate 90°';
                button.setAttribute('aria-label', 'Video Rotate 90°');
                button.style.display = 'inline-flex';
                button.style.justifyContent = 'center';
                button.style.transform = 'scaleX(-1)';
                button.innerHTML = policy.createHTML(`${svgicon}`);

                chromeControls.prepend(button);
            }
        }

        document.querySelectorAll('.transform90').forEach(function (button) {
            button.addEventListener('click', function () {
                click++;
                transform(click);
            });
        });
    }


    function transform(x) {
        document.querySelectorAll('.video-div, .video-div1').forEach(function (el) {
            el.remove();
        });

        switch (x) {
            case 1:
                addVideoRotateStyles(90);
                transform90();
                break;
            case 2:
                addVideoRotateStyles(180);
                break;
            case 3:
                addVideoRotateStyles(270);
                transform90();
                break;
            case 4:
                click = 0;
                break;
        }
    }

    function addVideoRotateStyles(degrees) {
        var container = document.querySelector('.html5-video-container');
        var videoDiv = document.createElement('div');
        var videoDiv1 = document.createElement('div');

        videoDiv.className = 'video-div';
        videoDiv1.className = 'video-div1';

        container.appendChild(videoDiv);
        container.appendChild(videoDiv1);

        var styleContent = `
            .html5-video-container {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                height: 100% !important;
            }
            .video-stream {
                position: relative !important;
                transform: rotate(${degrees}deg) !important;
                height: auto !important;
                left: 0 !important;
                top: 0 !important;
            }
        `;

        videoDiv.innerHTML = policy.createHTML(`<style>${styleContent}</style>`);
    }

    function transform90() {
        setTimeout(function () {
            var container = document.querySelector('.html5-video-container');
            var width = container.offsetWidth;
            var height = container.offsetHeight;
            var wh = width - height;
            var videoDiv1 = document.querySelector('.video-div1');

            if (videoDiv1) {
                videoDiv1.innerHTML = policy.createHTML('<style>.video-stream{width:calc(100% - ' + wh + 'px)!important;}</style>');
            }
        }, 20);
    }

    function observeURL() {
        var composeBox = document.querySelector('#player-container video');
        var composeObserver = new MutationObserver(function (mutationsList) {
            if (safeURL !== location.href) {
                safeURL = location.href;
                click = 0;
                buildHTML();
            }
        });

        if (!composeBox) {
            window.setTimeout(observeURL, 500);
            return;
        }

        var config = { characterData: true, childList: true, attributes: true };
        composeObserver.observe(composeBox, config);
    }

    window.addEventListener('resize', function () {
        transform(click);
    });

    document.addEventListener("fullscreenchange", function (event) {
        transform(click);
    });

    /*document.querySelectorAll(".ytp-size-button").forEach(function (element) {
        element.addEventListener('click', function () {
            transform(click);
        });
    });*/

})();