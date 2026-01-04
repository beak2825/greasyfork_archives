// ==UserScript==
// @name         Tuna browser script
// @namespace    univrsal
// @version      1.0.6
// @description  Get song information from web players, based on NowSniper by Kıraç Armağan Önal
// @author       univrsal
// @match        *://open.spotify.com/*
// @match        *://soundcloud.com/*
// @match        *://music.yandex.com/*
// @match        *://music.yandex.ru/*
// @match        *://www.deezer.com/*
// @match        *://www.pandora.com/*
// @grant        unsafeWindow
// @license      GPLv2
// @downloadURL https://update.greasyfork.org/scripts/423140/Tuna%20browser%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/423140/Tuna%20browser%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Configuration
    var port = 1608;
    var refresh_rate_ms = 500;
    var cooldown_ms = 5000;

    // Tuna isn't running we sleep, because every failed request will log into the console
    // so we don't want to spam it
    var failure_count = 0;
    var cooldown = 0;

    function post(data){
        var url = 'http://localhost:' + port + '/';
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);

        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    failure_count++;
                }
            }
        };
        xhr.send(JSON.stringify({data,hostname:window.location.hostname,date:Date.now()}));
    }

    // Safely query something, and perform operations on it
    function query(target, fun, alt = null) {
        var element = document.querySelector(target);
        if (element !== null) {
            return fun(element);
        }
        return alt;
    }

    function timestamp_to_ms(ts) {
        var splits = ts.split(':');
        if (splits.length == 2) {
            return splits[0] * 60 * 1000 + splits[1] * 1000;
        } else if (splits.length == 3) {
            return splits[0] * 60 * 60 * 1000 + splits[1] * 60 * 1000 + splits[0] * 1000;
        }
        return 0;
    }

    function StartFunction() {
        setInterval(()=>{
            if (failure_count > 3) {
                console.log('Failed to connect multiple times, waiting a few seconds');
                cooldown = cooldown_ms;
                failure_count = 0;
            }

            if (cooldown > 0) {
                cooldown -= refresh_rate_ms;
                return;
            }

            let hostname = window.location.hostname;

            // TODO: maybe add more?
            if (hostname == 'soundcloud.com') {
                let status = query('.playControl', e => e.classList.contains('playing') ? "playing" : "stopped", 'unknown');
                let cover_url = query('.playbackSoundBadge span.sc-artwork', e => e.style.backgroundImage.slice(5, -2).replace('t50x50','t500x500'));
                let title = query('.playbackSoundBadge__titleLink', e => e.title);
                let artists = [ query('.playbackSoundBadge__lightLink', e => e.title) ];
                let progress = query('.playbackTimeline__timePassed span:nth-child(2)', e => timestamp_to_ms(e.textContent));
                let duration = query('.playbackTimeline__duration span:nth-child(2)', e => timestamp_to_ms(e.textContent));
                let album_url = query('.playbackSoundBadge__titleLink', e => e.href);

                if (title !== null) {
                    post({ cover_url, title, artists, status, progress, duration, album_url });
                }
            } else if (hostname == 'open.spotify.com') {
                let status = query('.player-controls [data-testid="control-button-pause"]', e => !!e ? 'playing' : 'stopped', 'unknown');
                let cover_url = query('[data-testid="CoverSlotExpanded__container"] .cover-art-image', e => e.style.backgroundImage.slice(5, -2));
                let title = query('[data-testid="nowplaying-track-link"]', e => e.textContent);
                let artists = query('span[draggable] a[href*="artist"]', e => Array.from(e));
                let progress = query('.playback-bar .playback-bar__progress-time', e => timestamp_to_ms(e[0].textContent));
                let duration = query('.playback-bar .playback-bar__progress-time', e => timestamp_to_ms(e[1].textContent));
                let album_url = query('[data-testid="nowplaying-track-link"]', e => e.href);

                if (title !== null) {
                    post({ cover_url, title, artists, status, progress, duration, album_url });
                }
            } else if (hostname == 'music.yandex.ru') {
                // Yandex music support by MjKey
                let status = query('.player-controls__btn_play', e => e.classList.contains('player-controls__btn_pause') ? "playing" : "stopped", 'unknown');
                let cover_url = query('.entity-cover__image', e => e.style.backgroundImage.slice(5, -2).replace('50x50','200x200'));
                let title = query('.track__title', e => e.title);
                let artists = [ query('.track__artists', e => e.textContent) ];
                let progress = query('.progress__left', e => timestamp_to_ms(e.textContent));
                let duration = query('.progress__right', e => timestamp_to_ms(e.textContent));
                let album_url = query('.track-cover a', e => e.title);

                if (title !== null) {
                    post({ cover_url, title, artists, status, progress, duration, album_url });
                }
            } else if (hostname == 'www.deezer.com') {
                let status = query('.player-controls', e => {
                    let pause = e.getElementsByClassName('svg-icon-pause');
                    let play = e.getElementsByClassName('svg-icon-play');
                    if (pause.length > 0) {
                        return "playing";
                    }
                    if (play.length > 0) {
                        return "stopped";
                    }
                    return "unknown";
                });

                let cover_url = query('button.queuelist.is-available', e => {
                    let img = e.getElementsByTagName('img');
                    if (img.length > 0) {
                        let src = img[0].src; // https://e-cdns-images.dzcdn.net/images/cover/c4217689cc86e3e6a289162239424dc3/28x28-000000-80-0-0.jpg
                        return src.replace('28x28', '512x512');
                    }
                    return null;
                });

                let title = query('.marquee-content', e => {
                    let links = e.getElementsByClassName('track-link');
                    if (links.length > 0) {
                        return links[0].textContent;
                    }
                    return null;
                });
                let artists = query('.marquee-content', e => {
                    let links = e.getElementsByClassName('track-link');
                    let artists = [];
                    if (links.length > 1) {
                        for (var i = 1; i < links.length; i++) {
                            artists.push(links[i].textContent);
                        }
                        return artists;
                    }
                    return null;
                });

                let duration = query('.slider-counter-max', e => timestamp_to_ms(e.textContent));
                let progress = query('.slider-counter-current', e => timestamp_to_ms(e.textContent));
                if (title !== null) {
                    post({ cover_url, title, artists, status, progress, duration });
                }
            } else if (hostname == 'www.pandora.com') {
                let button_node = document.querySelector('button[data-qa].PlayButton');
                let button_shown = button_node ? button_node.getAttribute('data-qa') : '';
                let status = 'unknown';
                if(!!button_node && !!button_shown) {
                    status = button_shown == 'pause_button' ? 'playing' : 'stopped';
                }
                let cover_url = query('.nowPlayingTopInfo__artContainer__art .ImageLoader img', e => e.src);
                let title1 = query('.NowPlaying__content .Marquee', e => e.textContent);
                let title_scrolling = query('.NowPlaying__content .Marquee__wrapper__content__child:nth-child(1)', e => e.textContent);
                let title = null;
                if (!!title_scrolling){
                    title = title_scrolling;
                }
                else if (!!title1){
                    title = title1;
                }
                let artists = [ query('.NowPlaying__content .NowPlayingTopInfo__current__artistName', e => e.textContent) ];
                let progress = query('.Duration span[data-qa="elapsed_time"]', e => timestamp_to_ms(e.textContent));
                let duration = query('.Duration span[data-qa="remaining_time"]', e => timestamp_to_ms(e.textContent));
                let album_name = query('.NowPlaying__content .nowPlayingTopInfo__current__albumName', e => e.textContent);
                let album_url = '';
                if (title === 'Your station will be right back.') {
                    cover_url = 'https://res-2.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco/nenzclww7vhpwgzb7ozj';
                    title = ' ';
                    artists = [' '];
                    album_url = ' ';
                }
                if (title !== null) {
                    post({ cover_url, title, artists, status, progress, duration, album_url });
                }
            }
        }, 500);

    }

    StartFunction();
})();