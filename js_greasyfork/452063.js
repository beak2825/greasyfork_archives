// ==UserScript==
// @name        Vimeo Download
// @namespace   http://tampermonkey.net/
// @version     3.2
// @description Adds a download button to the Vimeo video player. This is a rewrite of "Vimeo Embed Download" originally created by aleixdev (https://greasyfork.org/en/scripts/376551).
// @author      You
// @match       https://vimeo.com/*
// @match       https://player.vimeo.com/video/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=vimeo.com
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/452063/Vimeo%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/452063/Vimeo%20Download.meta.js
// ==/UserScript==
(function() {
    if (document.title === 'VimeUhOh') {
        return;
    }

    // function getPlayer() {
    //     if (window.playerConfig) {
    //         return window.playerConfig;
    //     }
    //     const clips = window.vimeo.clips;
    //     const videoId = Object.keys(clips).at();
    //     if (!videoId) {
    //         throw new Error('[Vimeo Download] Error retrieving video meta data:', clips);
    //     }
    //     return clips[videoId]
    // }
    // const { request, video } = getPlayer();
    // console.log(request.files);
    // const streams = request.files.progressive.sort((a, b) => b.width - a.width);
    // console.log(streams);
    // const { url, quality } = streams[0];
    const div = document.createElement('div');
    document.querySelectorAll('track[srclang]').forEach(subtitle => {
        const element = Object.assign(document.createElement('button'), {
            innerHTML: subtitle.srclang,
            title: subtitle.srclang,
            style: 'display: inline-block; font-size: 1.75em; margin: -0.25em 0 0 0.3em; color: rgb(68,187,255)',
            onclick: function() {
                this.disabled = true;
                this.innerText = 'Wait';
                fetch(subtitle.src)
                    .then(response => response.blob())
                    .then(file => {
                    const tempUrl = URL.createObjectURL(file);
                    const aTag = document.createElement("a");
                    aTag.href = tempUrl;
                    aTag.download = 'Subtitle ' + subtitle.srclang + '.vtt'
                    document.body.appendChild(aTag);
                    aTag.click();
                    URL.revokeObjectURL(tempUrl);
                    aTag.remove();
                }).finally(() => {
                    this.disabled = false;
                    this.innerText = subtitle.srclang
                });
            }
        })
        div.append(element);
    })

    // const button = Object.assign(document.createElement('button'), {
    //     innerHTML: 'Download',
    //     title: 'Download ' + quality,
    //     style: 'display: inline-block; font-size: 1.75em; margin: -0.25em 0 0 0.3em; color: rgb(68,187,255)',
    //     onclick: function() {
    //         console.log(url, quality);
    //         this.disabled = true;
    //         this.innerText = 'Wait';
    //         fetch(url)
    //             .then(response => response.blob())
    //             .then(file => {
    //             const tempUrl = URL.createObjectURL(file);
    //             const aTag = document.createElement("a");
    //             aTag.href = tempUrl;
    //             aTag.download = name
    //             document.body.appendChild(aTag);
    //             aTag.click();
    //             URL.revokeObjectURL(tempUrl);
    //             aTag.remove();
    //         }).finally(() => {
    //             this.disabled = false;
    //             this.innerText = 'Download'
    //         });
    //     }
    // })
    const interval = setInterval(function() {
        if (!document.querySelector('.vp-controls')) return;
        clearInterval(interval)
        document.querySelector('.vp-controls').append(/*button,*/ div);
    }, 100);
})();