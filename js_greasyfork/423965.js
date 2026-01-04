// ==UserScript==
// @name        Good o'l Reddit
// @description	Makes sure you're using Good o'l Reddit. (C) TheNH813 2018. Edited by SkauOfArcadia.
// @author      TheNH813 & SkauOfArcadia
// @version		1.5.1
// @homepage https://skau.neocities.org/
// @contactURL https://t.me/SkauOfArcadia
// @match       *://*.reddit.com/*
// @match       *://preview.redd.it/*
// @run-at      document-start
// @grant       none
// @namespace https://greasyfork.org/users/751327
// @downloadURL https://update.greasyfork.org/scripts/423965/Good%20o%27l%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/423965/Good%20o%27l%20Reddit.meta.js
// ==/UserScript==
/**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
if (location.hostname === "preview.redd.it") {
    location.replace(location.protocol + "//i.redd.it" + location.pathname);
} else if (location.hostname !== "old.reddit.com" && location.pathname.indexOf('/poll/') !== 0 && location.pathname.indexOf('/gallery/') !== 0) {
    var oldReddit  = location.protocol + "//old.reddit.com" + location.pathname + location.search + location.hash;
    location.replace(oldReddit);
} else {
    window.addEventListener("DOMContentLoaded", function() {
        var observer = new MutationObserver(mutate);
        observer.observe(document,{childList:true,attributes:true,subtree:true});

        function mutate(){
            if (location.pathname.indexOf('/comments/') !== -1){
                improveEmbeds();
            }
            if (location.pathname.indexOf('/r/') === 0 && document.getElementsByClassName('archived-infobar').length === 0 && (!document.getElementById('res-style-checkbox') || document.getElementById('res-style-checkbox').checked)){
                unhideVotes();
            }
            improveLinks();
        }

        function unhideVotes(){
            let vote = document.getElementsByClassName('arrow');
            for (var x = 0; x < vote.length; x++){ 
                let pp = vote[x].parentElement.parentElement;
                if(vote[x].getAttribute('style') !== 'visibility: visible !important; display: block !important; pointer-events: auto !important;' && !pp.classList.contains('collapsed')){
                    vote[x].setAttribute('style', 'visibility: visible !important; display: block !important; pointer-events: auto !important;');
                } else if (pp.classList.contains('collapsed')){
                    vote[x].removeAttribute('style');
                }
            }
        }
        function improveLinks(){
            let links = document.getElementsByTagName('a');
            for (var x = 0; x < links.length; x++) {
                if (links[x].hasAttribute('data-outbound-url')){
                    links[x].removeAttribute('data-outbound-url');
                    links[x].removeAttribute('data-href-url');
                    links[x].removeAttribute('data-outbound-expiration');
                    links[x].setAttribute('rel','noopener noreferrer');
                    console.log('Removed Outbound URL for: ' + links[x].href);
                } 
                if (links[x].href.indexOf('//preview.redd.it') !== -1) {
                    links[x].href = links[x].href.split('?')[0].replace('preview.redd.it','i.redd.it');
                }
            }
        }
        function improveEmbeds(){
            let embeds = document.getElementsByClassName('media-embed');
            for (var x = 0; x < embeds.length; x++) {
                let pp = embeds[x].parentElement.parentElement;
                let title = pp.getElementsByClassName('title')[pp.getElementsByClassName('title').length -1]
                if (embeds[x].src.indexOf('//www.redditmedia.com/') !== -1
                && !!title && (title.href.indexOf('youtube') !== -1 || title.href.indexOf('youtu.be') !== -1)
                && title.href.indexOf('/clip/') === -1) {
                    let yt = title.href;
                    if(yt.indexOf('/shorts/') !== -1){
                      yt = yt.replace('?', '&').replace('/shorts/','/watch?v=');
                    }
                    let params = new URLSearchParams();
                    if(yt.indexOf('?') !== -1){
                        params = new URLSearchParams(yt.split('?').pop());
                        yt = yt.split('?')[0];
                    } else if (yt.indexOf('&') !== -1) {
                        params = new URLSearchParams(yt.split(yt.split('&')[0]).pop());
                        yt = yt.split('&')[0];
                    }
                    if(yt.indexOf('youtu.be') !== -1){
                        yt = yt.replace('www.', '').replace('youtu.be/', 'www.youtube-nocookie.com/embed/');
                    } else if(!!params.get('v')) {
                        yt = 'https://www.youtube-nocookie.com/embed/' + params.get('v');
                        params.delete('v');
                    }
                    params.set('autoplay', 0);
                    yt += '?' + params;
                    embeds[x].src = yt;
                    ResizeEmbed(embeds[x], pp.clientWidth);
                } else if (embeds[x].src.indexOf('//www.redditmedia.com/') !== -1
                && !!title && title.href.indexOf('twitch.tv') !== -1) {
                    let tw = title.href;
                    let value = tw.split('/v/').pop().split('/clip/').pop().replace('videos/','').split('twitch.tv/').pop();
                    let params = new URLSearchParams();
                    if (value.indexOf('?') !== -1){
                        params = new URLSearchParams(value.split('?').pop());
                        params.delete('channel');
                        params.delete('clip');
                        params.delete('video');
                        value = value.split('?')[0];
                    }
                    if (value.indexOf('/') !== -1){
                        value = value.split('/')[0];
                    }
                    params.set('autoplay', 'false');
                    params.set('parent', location.hostname);
                    if (tw.indexOf('clips.twitch.tv/') !== -1 || tw.indexOf('/clip/') !== -1){
                        params.set('clip', value);
                        tw = 'https://clips.twitch.tv/embed?' + params;
                    } else if (tw.indexOf('videos/') !== -1 || tw.indexOf('/v/') !== -1){
                        params.set('video', 'v' + value);
                        tw = 'https://player.twitch.tv/?' + params;
                    } else {
                        params.set('channel', value);
                        tw = 'https://player.twitch.tv/?' + params;
                    }
                    if (location.hostname !== window.location.hostname) {
                        tw += '&parent=' + window.location.hostname;
                    }
                    embeds[x].src = tw;
                    ResizeEmbed(embeds[x], pp.clientWidth);
                } else if (embeds[x].src.indexOf('//www.redditmedia.com/') !== -1
                && !!title && title.href.indexOf('streamable.com/') !== -1) {
                    let st = title.href.replace('streamable.com/', 'streamable.com/o/');
                    let params = new URLSearchParams();
                    if(st.indexOf('?') !== -1){
                        params = new URLSearchParams(st.split('?').pop());
                        st = st.split('?')[0];
                    }
                    params.set('autoplay', 0);
                    embeds[x].src = st + '?' + params;
                    ResizeEmbed(embeds[x], pp.clientWidth);
                } else if (embeds[x].src.indexOf('//www.redditmedia.com/') !== -1
                && !!title && (title.href.indexOf('//vimeo.com/') !== -1 || title.href.indexOf('//www.vimeo.com/') !== -1)) {
                    embeds[x].src = title.href.replace('//www.', '//').replace('vimeo.com/', 'player.vimeo.com/video/');
                    ResizeEmbed(embeds[x], pp.clientWidth);
                }
            }
        }
        function ResizeEmbed(element, wwidth){
            const elRatio = element.clientWidth / element.clientHeight;
            element.width = Math.round(((wwidth * 0.9) * 0.5625) * elRatio);
            element.height = Math.round((wwidth * 0.9) * 0.5625);
        }
        if (location.pathname.indexOf('/comments/') !== -1){
            improveEmbeds();
        }
        if (location.pathname.indexOf('/r/') === 0 && document.getElementsByClassName('archived-infobar').length === 0 && (!document.getElementById('res-style-checkbox') || document.getElementById('res-style-checkbox').checked)){
            unhideVotes();
        }
        improveLinks();
    });
}