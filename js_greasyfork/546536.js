// ==UserScript==
// @name         Auto Skip YouTube Ads (Trigger Ended Event)
// @namespace    https://github.com/tientq64/userscripts
// @version      7.3.2
// @description  自动跳过 YouTube 广告，模拟广告结束事件以减少黑屏等待
// @author       tientq64 + enhanced by yy
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @exclude      https://studio.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546536/Auto%20Skip%20YouTube%20Ads%20%28Trigger%20Ended%20Event%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546536/Auto%20Skip%20YouTube%20Ads%20%28Trigger%20Ended%20Event%29.meta.js
// ==/UserScript==

(function () {
    'use strict'

    const isMobile = location.hostname === 'm.youtube.com'
    const isMusic = location.hostname === 'music.youtube.com'
    const isShorts = location.pathname.startsWith('/shorts/')
    const isVideoPage = !isMusic

    function skipAdWithEndedEvent() {
        if (isShorts) return

        const adShowing = document.querySelector('.ad-showing')
        const pieCountdown = document.querySelector('.ytp-ad-timed-pie-countdown-container')
        const surveyQuestions = document.querySelector('.ytp-ad-survey-questions')

        if (!adShowing && !pieCountdown && !surveyQuestions) return

        const moviePlayerEl = document.querySelector('#movie_player')
        const player = moviePlayerEl?.getPlayer?.() || moviePlayerEl
        if (!player) return

        const adVideo = document.querySelector('video.html5-main-video')

        if (adVideo && !adVideo.paused && !isNaN(adVideo.duration)) {
            adVideo.muted = true
            adVideo.currentTime = adVideo.duration

            // 模拟广告播放结束事件
            adVideo.dispatchEvent(new Event('ended'))
            console.log(`[Ad Skipped] via fast-forward + ended event at ${new Date().toLocaleTimeString()}`)
        } else {
            const currentTime = Math.floor(player.getCurrentTime?.() || 0)
            player.seekTo?.(currentTime, true)
            console.log(`[Ad Skipped] via seekTo at ${new Date().toLocaleTimeString()}`)
        }

        // 保持字幕开启状态
        if (moviePlayerEl?.isSubtitlesOn?.()) {
            setTimeout(() => moviePlayerEl.toggleSubtitlesOn?.(), 1000)
        }
    }

    function addCss() {
        const selectors = [
            '#player-ads',
            '#masthead-ad',
            '.ytp-featured-product',
            '.yt-mealbar-promo-renderer',
            'ytd-merch-shelf-renderer',
            'ytmusic-mealbar-promo-renderer',
            'ytmusic-statement-banner-renderer',
            '#panels > ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]'
        ]
        const style = document.createElement('style')
        style.textContent = selectors.join(',') + '{ display: none !important; }'
        document.head.appendChild(style)
    }

    function removeAdElements() {
        const adSelectors = [
            ['ytd-reel-video-renderer', '.ytd-ad-slot-renderer']
        ]
        for (const [container, child] of adSelectors) {
            const el = document.querySelector(container)
            if (el?.querySelector(child)) el.remove()
        }
    }

    addCss()
    if (isVideoPage) {
        setInterval(removeAdElements, 1000)
        removeAdElements()
    }

    const observer = new MutationObserver(skipAdWithEndedEvent)
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    })
})()
