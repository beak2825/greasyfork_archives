// ==UserScript==
// @name         修改页面视频播放速率
// @name:en      HookPlaybackRate
// @version      1.0
// @description  统一管理视频播放速率，基本适用于大部分页面，包括部分不允许修改播放速率的页面。
// @description:en Hook video playbackRate.
// @author       BackRunner
// @include      *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/70902
// @downloadURL https://update.greasyfork.org/scripts/428310/%E4%BF%AE%E6%94%B9%E9%A1%B5%E9%9D%A2%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%80%9F%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/428310/%E4%BF%AE%E6%94%B9%E9%A1%B5%E9%9D%A2%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%80%9F%E7%8E%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let playbackRate = 1;

    // hook shadow dom
    Element.prototype.attachShadow = function () {
        const div = document.createElement('div');
        this.appendChild(div);
        return div;
    };

    // hook define
    const originDefine = Object.defineProperty;
    Object.defineProperty = function(obj, property, describer) {
        if (property === 'playbackRate' && !describer.__backrunner) {
            return;
        }
        originDefine.call(this, obj, property, describer);
    }

    const hookVideos = () => {
        const videos = document.getElementsByTagName('video');
        for (let i = 0; i < videos.length; i++){
            const video = videos[i];
            if (video.__hooked) {
                continue;
            }
            delete video.playbackRate;
            video.playbackRate = playbackRate;
            Object.defineProperty(video, 'playbackRate', {
                configurable: true,
                get() { return playbackRate; },
                set() { return null },
                __backrunner: true,
            });
            Object.defineProperty(video, '__hooked', {
                configurable: true,
                writable: true,
                value: true,
            });
        };
    };

    const cleanHookedFlag = () => {
        const videos = document.getElementsByTagName('video');
        for (let i = 0; i < videos.length; i++){
            const video = videos[i];
            Object.defineProperty(video, '__hooked', {
                configurable: true,
                writable: true,
                value: false,
            });
        }
    };

    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === '.') {
            playbackRate += 0.5;
            console.log('PlaybackRate changed.', playbackRate);
        } else if (e.ctrlKey && e.key === ',') {
            playbackRate -= 0.5;
            if (playbackRate <= 0) {
                playbackRate = 0;
            }
            console.log('PlaybackRate changed.', playbackRate);
        }
        cleanHookedFlag();
    });

    setInterval(() => {
        hookVideos();
    }, 100);
})();