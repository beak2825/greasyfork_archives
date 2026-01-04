// ==UserScript==
// @name            CDA.pl Enhancer
// @name:pl         Rozszerzenia dla strony CDA.pl
// @require         https://greasyfork.org/scripts/395037-monkeyconfig-modern/code/MonkeyConfig%20Modern.js?version=764968
// @namespace       http://tampermonkey.net/
// @version         0.4
// @description     Script contains features like video download, auto best quality choose and some hotkeys for CDA.pl website.
// @description:pl  Skrypt zawiera rozszerzenia takie, jak pobieranie wideo, wybór najlepszej jakości oraz kilka skrótów klawiszowych dla strony CDA.pl
// @author          DaveIT
// @icon            http://free-images.ct8.pl/greasyfork/cda-enhancer.ico
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_addStyle
// @grant           GM_registerMenuCommand
// @match           https://www.cda.pl/video/*
// @downloadURL https://update.greasyfork.org/scripts/421226/CDApl%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/421226/CDApl%20Enhancer.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function() {
    'use strict';

    let cfg = new MonkeyConfig({
        title: 'CDA.pl Enhancer Configuration',
        menuCommand: true,
        params: {
            best_quality_auto_set: {
                type: 'checkbox',
                default: true
            },
            best_quality_suggestions: {
                type: 'checkbox',
                default: true
            },
            enable_hotkeys: {
                type: 'checkbox',
                default: true
            },
            mute_hotkey: {
                type: 'text',
                default: 'm'
            },
            fullscreen_hotkey: {
                type: 'text',
                default: 'f'
            },
            next_video_hotkey: {
                type: 'text',
                default: 'n'
            }
        }
    })

    let config = {
        bestQualityAutoSet: cfg.get('best_quality_auto_set'),
        bestQualitySuggestions: cfg.get('best_quality_suggestions'),
        hotkeysEnabled: cfg.get('enable_hotkeys'),
        hotkeys: {
            fullscreen: cfg.get('fullscreen_hotkey'),
            mute: cfg.get('mute_hotkey'),
            nextVideo: cfg.get('next_video_hotkey')
        }
    }

    if(config.bestQualityAutoSet) {
        let settings = document.querySelector('.pb-settings-click');
        let buttons = document.querySelectorAll('.settings-quality');

        if(buttons.length > 0) {
            let lastButton = buttons[buttons.length - 1].querySelector('a');

            if(lastButton.text == 'Premium') {
                lastButton = buttons[buttons.length - 2].querySelector('a');
            }

            if(!lastButton.className.includes('pb-active')) {
                lastButton.click();
                settings.click();
            }
        }
    }

    if(config.bestQualitySuggestions) {
        let hdIconElement = document.querySelector('#rightCol > label > div > a > span.hd-ico-elem.hd-elem-pos');
        let hdIconElements = document.querySelectorAll('#podobne_kafle > div > label > div > a > span.hd-ico-elem.hd-elem-pos');

        setHdLinks(hdIconElement);

        for(let element of hdIconElements) {
            setHdLinks(element);
        }
    }

    if(config.hotkeysEnabled) {
        document.onkeypress = (e) => {
            switch(e.key.toLowerCase()) {
                case config.hotkeys.fullscreen:
                    document.querySelector('.pb-fullscreen').click();
                    break;

                case config.hotkeys.mute:
                    document.querySelector('.pb-volume-mute').click();
                    break;

                case config.hotkeys.nextVideo:
                    if(!['text', 'textarea'].includes(document.activeElement.type)) {
                        document.querySelector('#rightCol > label > div > div > a').click();
                    }
            }
        }
    }

    function setHdLinks(element) {
        if(element) {
            let hdVersion = element.innerText;
            let nextVideoPictureElement = element.parentElement;
            let nextVideoTitleElement = element.parentElement.parentElement.children[1].children[1];
            let link = nextVideoPictureElement.href + '?wersja=' + hdVersion;

            nextVideoPictureElement.href = link;
            nextVideoTitleElement.href = link;
        }
    }

    window.onload = function() {
        const videoSource = document.querySelector('video').src;
        const downloadLink = document.createElement('a');
        downloadLink.text = 'Pobierz';
        downloadLink.href = videoSource;
        downloadLink.target = '_blank';
        downloadLink.style = 'color: #E28525';

        document.querySelector('#naglowek').parentElement.append(downloadLink);
    }
})();