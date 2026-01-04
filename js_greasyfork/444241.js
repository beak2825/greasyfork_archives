// ==UserScript==
// @name         loopButtonYT
// @namespace    https://github.com/Makhloufbel
// @homepage     https://github.com/Makhloufbel
// @version      0.2
// @description  add loop button for youtube
// @author       Makhloufbel
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/444241/loopButtonYT.user.js
// @updateURL https://update.greasyfork.org/scripts/444241/loopButtonYT.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const css = `
    button.mack::before,
    button.mack::after {
        --scale: 0;
        position: absolute;
        top: -.5rem;
        /*left: 73.5%;*/
        transform: translateX(-15%) translateY(-100%) scale(var(--scale));
        transition: 50ms transform;
        transform-origin: bottom center;
    }
    button.mack::after {
        z-index: 4999;
        top: -20%;
        content: '';
        width: 46px;
        height: 25px;
        background-color:rgba(0, 0, 0, 0.9);;
        border-radius: .2rem;
        padding: 0 .5rem;
    }
    button.mack::before {
        z-index: 5000;
        top: 3%;
        content: attr(data-title);
        font-size: inherit;
        font-weight: bold;
        width: max-content;
        border-radius: .2rem;
        padding: 0 .5rem;
        background: none !important;
        text-align: center;
    }
    button.mack:hover::before,
    button.mack:hover::after {
        --scale: 1
    }
    `
    document.head.insertAdjacentHTML('beforeend', '<style>'+css+'</style>');
 
    const STATE = {
        IDLE: 0,
        ACTIVE: 1
    }
 
    const SELECTOR = {
        UNIQUENESS_CUE: 'title',
        BUTTON_RACK: 'div.ytp-chrome-controls > div.ytp-left-controls',
        VIDEO: 'video.html5-main-video',
        PLAY_BUTTON: 'div.ytp-autonav-toggle-button-container'
        //PLAY_BUTTON: 'button.ytp-play-button'
    }
 
    const LOOP_BUTTON_CLASSNAMES = ['ytp-loop-button', 'ytp-button', 'mack']
 
    const iconPrototype =
          '<?xml version="1.0" encoding="UTF-8"?><svg class="style-scope yt-icon" display="block" '
          +'pointer-events="none" style="height:28px;width:28px;padding-bottom:10px;padding-left:5px;"'
          +'focusable="false" viewBox="0 0 24 24" mlns="http://www.w3.org/2000/svg"><g class="style-scope'
          +' yt-icon"><path class="style-scope yt-icon" stroke = "rgb(208, 208, 208)"  stroke-opacity="0.4"'
          +' fill = "rgb(208, 208, 208)"  fill-opacity="0.4" id = "svg_makhlouf"  d="M21,13h1v5L3.93,18.03l2.'
          +'62,2.62l-0.71,0.71L1.99,17.5l3.85-3.85l0.71,0.71l-2.67,2.67L21,17V13z M3,7l17.12-0.03 l-2.67,2.67l0'
          +'.71,0.71l3.85-3.85l-3.85-3.85l-0.71,0.71l2.62,2.62L2,6v5h1V7z"/></g></svg>';
 
    const stylePrototype ='';
   /*  ' button.mack[data-title]:hover:after{opacity:1;transition:all .1s ease .5s;visibility:visible}'
    +'button.mack[data-title]:after{content:attr(data-title);position:absolute;bottom:10px;'
    +'left:0;z-index:99999;visibility:hidden;white-space:nowrap;'
    +'background-color:#000;color:#fff;font-size:80%;padding:5px 5px;opacity:0;border:1px solid #fff;'
    +'border-radius:5px}button.mack[data-title]{position:relative} ';*/
 
    class LoopButton {
        constructor() {
            // set initial state
            this.state = STATE.IDLE
            this.URI = ''
 
            // query all needed DOM
            this.DOMObj = {
                'head': document.querySelector(SELECTOR.UNIQUENESS_CUE),
                'buttonRack': null,
                'playButton': null,
                'video': null
            }
 
            // add observer to uniqueness cue
            let observer = new MutationObserver((mutations) => {
                this.pageChangeHandler()
            })
 
            observer.observe(this.DOMObj.head, {
                attributes: true,
                childList: true,
                characterData: true
            })
        }
        pageChangeHandler() {
            // get current uri
            let currentURI = window.location.href
            //console.log('page changed!', currentURI);
 
            // check changes of URI
            if (this.URI == currentURI) return;
            this.URI = currentURI
 
            // check if on watch page
            if (!/(^https?:\/\/)?(www\.)?youtube.com\/watch.+/.test(currentURI)) return // do nothing if not on watch page
 
            // set to idle at first
            if (this.DOMObj.loopButton) {
                this.setState(STATE.IDLE)
            } else {
 
                // query all needed DOM
                this.DOMObj.buttonRack = document.querySelector(SELECTOR.BUTTON_RACK)
                this.DOMObj.playButton = document.querySelector(SELECTOR.PLAY_BUTTON)
                this.DOMObj.video = document.querySelector(SELECTOR.VIDEO)
 
                if (this.DOMObj.buttonRack && this.DOMObj.playButton && this.DOMObj.video) {
                    this.placeButton()
                } else {
                    console.error('loop-button-for-youtube : query resulted in nothing. aborting placement.');
                }
            }
        }
 
        placeButton() {
            let loopStyle = document.createElement('style')
            loopStyle.innerHTML = stylePrototype
            document.head.appendChild(loopStyle)
 
            let loopButton = document.createElement('button')
            loopButton.innerHTML = iconPrototype
            loopButton.classList.add(...LOOP_BUTTON_CLASSNAMES)
            loopButton.setAttribute("data-title", "Loop (p)");
            const list = document.querySelector("div.ytp-chrome-controls > div.ytp-right-controls")
            list.insertBefore(loopButton, list.children[3])
            loopButton.addEventListener('click', this.buttonClickHandler.bind(this))
 
            var keyLoop = 80;
            window.onkeydown= function(e){if(e.keyCode === keyLoop){loopButton.click()};
            };
 
            this.DOMObj.loopButton = loopButton
        }
 
        buttonClickHandler(event) {
            // toggles
            switch (this.state) {
                case STATE.ACTIVE:
                    this.setState(STATE.IDLE)
                    break
                case STATE.IDLE:
                    this.setState(STATE.ACTIVE)
                    break
            }
        }
        // helpers
        setState(state) {
            switch (state) {
                case STATE.ACTIVE:
                    this.state = STATE.ACTIVE
                    document.getElementById("svg_makhlouf").setAttribute("stroke-opacity", "1")
                    document.getElementById("svg_makhlouf").setAttribute("fill-opacity", "1")
                    this.DOMObj.video.loop = true
                    break
                case STATE.IDLE:
                    this.state = STATE.IDLE
                    document.getElementById("svg_makhlouf").setAttribute("stroke-opacity", "0.4")
                    document.getElementById("svg_makhlouf").setAttribute("fill-opacity", "0.4")
                    this.DOMObj.video.loop = false
                    break
            }
        }
    }
 
    let loopButton = new LoopButton()
 
})();
