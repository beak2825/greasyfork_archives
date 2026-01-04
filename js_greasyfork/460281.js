// ==UserScript==
// @name         Preview Skin Image in spelunky.fyi
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bab
// @author       bugfork
// @match        https://spelunky.fyi/mods/2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spelunky.fyi
// @require        https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460281/Preview%20Skin%20Image%20in%20spelunkyfyi.user.js
// @updateURL https://update.greasyfork.org/scripts/460281/Preview%20Skin%20Image%20in%20spelunkyfyi.meta.js
// ==/UserScript==

const cachedImages = {};
const getSkinImage = (src) => new Promise(resolve => {
    if(cachedImages[src]){
        resolve(cachedImages[src]);
        return;
    }
    const spriteWidth = 128;
    const spriteHeight = 128;

    const portraitWidth = 512;
    const portraitHeight = 768;

    const baseWidth = 2048;

    const tickMs = 100;

    let started = false;

    let spriteImage = new Image();

    document.scaleDimension = function (int) {
        if (spriteImage.width == baseWidth) {
            return int
        }

        multiplier = spriteImage.width / baseWidth;
        return int * multiplier;
    }

    spriteImage.onload = () => {
        if (!started) {
            for (let animation of animations) {
                animation.start();
            }
            started = true;
        }
    };

    class Animation {
        constructor(name, frameDetails) {
            let canvas = document.createElement('canvas');
            canvas.width = spriteWidth;
            canvas.height = spriteHeight;

            resolve(cachedImages[src] = canvas);
            this.ctx = canvas.getContext('2d');
            this.frame = 0;
            this.interval = null;
            this.frames = getFramePositions(...frameDetails);
        }

        start() {
            this.interval = setInterval(() => {
                let frame_idx = this.frame % this.frames.length;
                let [x, y] = this.frames[frame_idx];


                this.ctx.clearRect(0, 0, spriteWidth, spriteHeight);
                this.ctx.drawImage(
                    spriteImage,
                    document.scaleDimension(x * spriteWidth),
                    document.scaleDimension(y * spriteHeight),
                    document.scaleDimension(spriteWidth),
                    document.scaleDimension(spriteHeight),
                    0, 0, spriteWidth, spriteHeight
                );

                this.frame += 1;
            }, tickMs);
        }
    }

    function getFramePositions(row, startColumn, count) {
        let arr = [];
        for (let idx = 0; idx < count; idx++) {
            arr.push([idx + startColumn, row]);
        }
        return arr;
    }

    const animations = [
        new Animation('Walk', [0, 1, 8])
    ];

    function isSpriteSheet(name) {
        const filename = name.split("/").pop();
        if (filename === "") {
            return false;
        }

        const parts = filename.split(".")
        if (parts.length <= 1) {
            return false
        }
        const extension = parts.pop();
        if (extension != 'png') {
            return false;
        }

        if (!filename.startsWith("char")) {
            return false;
        }

        return true;
    }

    {
        fetch(src)
            .then(res => res.text())
            .then(text => text.match(/const modUrl = "(https:\/\/media\.spelunky\.fyi\/mods\/file\/(.+))";/)?.[1])
            .then(modUrl => {
                if(!modUrl) return;
                if (!started) {
                    const isZip = modUrl.endsWith('.zip');
                    if (!isZip) {
                        if(modUrl.endsWith('.png'))
                           spriteImage.src = modUrl;
                    } else {
                        fetch(modUrl)
                            .then((response) => {
                                if (response.status === 200 || response.status === 0) {
                                    return Promise.resolve(response.blob());
                                } else {
                                    return Promise.reject(new Error(response.statusText));
                                }
                            })
                            .then(JSZip.loadAsync)
                            .then((zip) => {
                                let possibleSheets = [];

                                Object.keys(zip.files).map(function (name) {
                                    const entry = zip.files[name];
                                    if (entry.dir) {
                                        return;
                                    }
                                    if (!isSpriteSheet(name)) {
                                        return;
                                    }
                                    possibleSheets.push(entry);
                                });

                                if (!possibleSheets.length) {
                                    return
                                }

                                possibleSheets[0].async("uint8array").then(function (u8) {
                                    spriteImage.src = URL.createObjectURL(
                                        new Blob([u8.buffer], {
                                            type: 'image/png'
                                        })
                                    );
                                })
                            })
                    }
                }
            })
    }
});

(function() {
    'use strict';
    let previewExists = false;

    function setPreview(from, element){
        const preview = document.createElement('div');
        preview.id = 'preview';
        preview.appendChild(element);
        preview.style.position = 'absolute';
        preview.style.zIndex = '255';

        const {x, y} = from.getBoundingClientRect();

        preview.style.left = `${x+200}px`
        preview.style.top = `${y-100}px`
        document.body.prepend(preview);
    }

    function removePreview(){
        document.getElementById('preview')?.remove?.()
    }

    Array.from(document.getElementById('content').children)
        .filter(div => !div.classList.contains('row'))
        .map(div => div.getElementsByTagName('a')[1])
        .forEach(a => {
        a.addEventListener('mouseover', async () => {
            previewExists = true;
            const skinImage = await getSkinImage(a.href);
            if(skinImage && previewExists)
                setPreview(a, skinImage);
        });
        a.addEventListener('mouseout', () => {
            removePreview();
            previewExists = false;
        });
    })
})();