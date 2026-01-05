// ==UserScript==
// @name           youtube HTML5 Auto Loop
// @namespace      youtube HTML5 Auto Loop
// @grant          none
// @description    youtube再生時に自動ループする
// @author         TNB
// @match          https://www.youtube.com/*
// @version        1.5.6
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/27308/youtube%20HTML5%20Auto%20Loop.user.js
// @updateURL https://update.greasyfork.org/scripts/27308/youtube%20HTML5%20Auto%20Loop.meta.js
// ==/UserScript==

/********************  SETTING **************************/
const loop_off = {
    when_enable_next_video_autoplay: false,
    when_playlist: false,
    with_embedded_video: false
};
/********************************************************/


'use strict';

const YoutubeHTML5AutoLoop = {
    loop: true,
    readyLoop: false,
    playercontainer: null,
    video: null,
    prevSrc: null,
    button: null,
    eventcache: {},
    cancelInit: false,
    ele: {
        when_enable_next_video_autoplay: '.ytp-right-controls button[style]:not([style *= "display: none"]) .ytp-autonav-toggle-button[aria-checked="true"]',
        when_playlist: '#secondary-inner #playlist:not([hidden])',
        with_embedded_video: 'html[data-cast-api-enabled="true"]'
    },
    init: function() {
        this.addListener();
    },
    isLoop: function() {
        return !Object.keys(loop_off).some(a => loop_off[a] && document.querySelector(this.ele[a]));
    },
    goLoop: function() {
        this.video.currentTime = 0;
        this.video.play;
    },
    enableLoop: function() {
        if (this.loop) this.video.setAttribute('loop', '');
        else this.video.removeAttribute('loop');
    },
    initLoop: function() {
        this.loop = this.isLoop();
        this.enableLoop();
    },
    loopToggle: function() {
        this.loop = !this.loop;
        this.enableLoop();
    },
    infiniteLoop: function() {
        if (this.video.duration - this.video.currentTime > 1 || this.readyLoop) return;
        this.readyLoop = true;
        setTimeout(() => {
            if (!this.loop || !document.querySelector('.ytp-spinner[style=""]')) return;
            this.goLoop();
        }, 2000);
    },
    displayLoopStatus: function() {
        const video = document.querySelector('video:hover');
        if (!video) return;
        const checkBox = document.querySelector('.ytp-contextmenu [aria-checked]');
        checkBox.setAttribute('aria-checked', this.loop);
        if (!this.eventcache.checkBox) {
            checkBox.addEventListener('click', this, true);
            this.eventcache.checkBox = true;
        }
    },
    toggleNextVideoAutoplay: function() {
        if ((!loop_off.when_enable_next_video_autoplay && this.loop) || loop_off.when_enable_next_video_autoplay) {
            setTimeout(() => {
                if (JSON.parse(this.button.getAttribute('aria-checked')) == this.loop) this.button.click();
            }, 1000);
        }
    },
    reloadVideo: function() {
        setTimeout(() => {
            if (this.video.currentTime < 1 && document.querySelector('.ytp-spinner[style = ""]')) location.reload();
        }, 3000);
    },
    observeVideo: function() {
        new MutationObserver(() => {
            if (this.video.src != this.prevSrc) this.cancelInit = false;
            if (!this.cancelInit) this.initLoop();
            if (!this.eventcache.toggleAutoPlay) this.addToggleEvent();
            if (document.querySelector('.ytp-spinner[style = ""]')) this.reloadVideo();
            this.toggleNextVideoAutoplay();
            this.prevSrc = this.video.src;
            this.video = this.playercontainer.querySelector('video');
            this.video.addEventListener('timeupdate', this);
        }).observe(this.playercontainer, {childList: true, subtree: true, attributes: true, attributeFilter: ['class']});
    },
    findPlayercontainer: function() {
        if (window != window.parent && document.getElementById('chat')) return;
        const mo = new MutationObserver(() => {
            this.playercontainer = document.getElementById('movie_player');
            if (!this.playercontainer) return;
            this.video = this.playercontainer.querySelector('video');
            this.observeVideo();
            this.initLoop();
            this.addToggleEvent();
            this.toggleNextVideoAutoplay();
            mo.disconnect();
        });
        mo.observe(document.body, {childList: true, subtree: true});
    },
    addToggleEvent: function() {
        this.button = document.querySelector('.ytp-right-controls button[style]:not([style *= "display: none"]) .ytp-autonav-toggle-button');
        if (!loop_off.when_enable_next_video_autoplay || !this.button) return;
        this.button.addEventListener('click', () => {
            this.loop = JSON.parse(this.button.getAttribute('aria-checked'));
            this.enableLoop();
            this.cancelInit = true;
            this.eventcache.toggleAutoPlay = true;
        });
    },
    addListener: function() {
        window.addEventListener('DOMContentLoaded', this);
        window.addEventListener('contextmenu', this);
    },
    handleEvent: function(e) {
        switch (e.type) {
            case 'DOMContentLoaded':
                this.findPlayercontainer();
                break;
            case 'contextmenu':
                this.displayLoopStatus();
                break;
            case 'timeupdate':
                this.infiniteLoop();
                break;
            case 'click':
                this.loopToggle();
                document.body.click();
                this.toggleNextVideoAutoplay();
                this.cancelInit = true;
                e.stopPropagation();
                break;
        }
    }
};

YoutubeHTML5AutoLoop.init();
