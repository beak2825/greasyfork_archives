// ==UserScript==
// @name         Simple EHentai Viewer
// @namespace    http://hentaimore.net/
// @version      1.0
// @description  Preload more images to help you fap online
// @author       Hentai More
// @match        https://e-hentai.org/s/*
// @match        https://exhentai.org/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373391/Simple%20EHentai%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/373391/Simple%20EHentai%20Viewer.meta.js
// ==/UserScript==

(() => {
    'use strict';

    let reload = 0, preload = 0;
    let current = 1, count = 0;
    const maxcount = 10;

    const srcarray = [];
    const nextarray = [];
    const failarray = [];

    const image = document.createElement('img');
    const site = document.createElement('span');
    const tips = document.createElement('span');
    const link = document.createElement('a');
    const empty = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';

    function style(css) {
        const style = document.createElement('style');

        style.type = 'text/css';
        style.innerHTML = css;

        return style;
    }

    function loadManga() {
        const head = document.getElementsByTagName('head')[0];

        head.appendChild(style('body {background: black; text-align: center}'));
        head.appendChild(style('@media screen and (min-width: 64em) {img {max-width: 1280px; margin: 0 auto; display: block}}'));
        head.appendChild(style('@media screen and (max-width: 64em) {img {width: 100%; margin: 0 auto; display: block}}'));
        head.appendChild(style('span {color: white; text-align: center; font-size: 15px; font-weight: bold; margin: 10px auto; display: block}'));
        head.appendChild(style('a {color: white; text-decoration: none; text-align: center; font-size:15px; font-weight: bold; margin: 10px auto; display: block} a:hover {color: white; text-decoration: underline}'));

        image.id = 'img'; image.onload = () => window.scrollTo(0, 0); image.src = srcarray[current - 1]; link.href = failarray[current - 1];
        document.body.innerHTML = ''; document.body.appendChild(image); document.body.appendChild(site); document.body.appendChild(tips); document.body.appendChild(link);
    }

    function loadStatus() {
        site.innerHTML = '<a href="http://hentaimore.net/" style="color: red">Promotion: Click Here to Download Hentai Games.</a>';
        tips.innerHTML = 'Press Ctrl or Drag Image Outside to Toggle View Mode. Preload Status: < ' + current + ' / ' + srcarray.length + ' >.';
        link.innerHTML = 'Press Enter or Click Here to Reload Current Image. Reload Status: ' + (reload ? 'True' : 'False') + '.';
    }

    function loadImage(array, index, src) {
        const img = document.createElement('img'), callback = () => { array[index] = src; if (image.src === empty && index === current - 1) image.src = src; };

        img.src = src; if (img.complete) { callback(); return; } img.onload = callback;
    }

    function preloadImage() {
        const next = nextarray[nextarray.length - 1];

        window.fetch(next, { method: 'GET', credentials: 'include' }).then(response => response.text()).then(text => {
            const doc = document.implementation.createHTMLDocument('doc'); doc.documentElement.innerHTML = text;

            srcarray.push(empty); loadStatus(); loadImage(srcarray, srcarray.length - 1, doc.getElementById('img').src);

            failarray.push(next + '?nl=' + doc.getElementById('loadfail').getAttribute('onclick').match(/[-0-9]+/)[0]);

            if (next !== doc.getElementById('next').href) {
                nextarray.push(doc.getElementById('next').href); if (count < maxcount) preloadImage(); else count = 0;
            }
        });

        ++count;
    }

    function reloadImage() {
        if (!reload) {
            window.fetch(failarray[current - 1], { method: 'GET', credentials: 'include' }).then(response => response.text()).then(text => {
                const doc = document.implementation.createHTMLDocument('doc'); doc.documentElement.innerHTML = text;

                image.src = empty; loadStatus(); loadImage(srcarray, current - 1, doc.getElementById('img').src);

                link.href = failarray[current - 1] = failarray[current - 1] + '&nl=' + doc.getElementById('loadfail').getAttribute('onclick').match(/[-0-9]+/)[0];

                reload = 0;
            });

            reload = 1;
        }
    }

    function prevImage() {
        if (current > 1) {
            --current; image.src = srcarray[current - 1]; link.href = failarray[current - 1]; loadStatus();
        }
    }

    function nextImage() {
        if (current < srcarray.length) {
            ++current; image.src = srcarray[current - 1]; link.href = failarray[current - 1]; loadStatus();
        }

        if (count === 0 && current >= srcarray.length - maxcount / 2) preloadImage();
    }

    function startLoader() {
        nextarray.push(document.getElementById('next').href);
        srcarray.push(document.getElementById('img').src);
        failarray.push(document.location.href + '?nl=' + document.getElementById('loadfail').getAttribute('onclick').match(/[-0-9]+/)[0]);

        loadManga(); loadStatus(); preloadImage();

        image.onclick = event => {
            event.stopPropagation();
            event.preventDefault();
            if (event.clientX <= document.body.clientWidth / 2) prevImage(); else nextImage();
        };

        link.onclick = event => {
            event.stopPropagation();
            event.preventDefault(); reloadImage();
        };
    }

    function mapKey(event) {
        switch (event.which) {
            case 37:
                event.stopPropagation(); event.preventDefault(); if (preload) prevImage();
                break;
            case 38:
                event.stopPropagation(); event.preventDefault(); window.scrollBy(0, -100);
                break;
            case 39:
                event.stopPropagation(); event.preventDefault(); if (preload) nextImage();
                break;
            case 40:
                event.stopPropagation(); event.preventDefault(); window.scrollBy(0, +100);
                break;
            case 13:
                event.stopPropagation(); event.preventDefault(); if (preload) reloadImage();
                break;
            case 17:
                event.stopPropagation();
                event.preventDefault();
                if (!preload) {
                    preload = 1; startLoader(); document.onkeydown = mapKey;
                    window.removeEventListener('keydown', mapKey);
                } else {
                    preload = 0; document.location.reload();
                }
                break;
            default:
                break;
        }
    }

    window.addEventListener('keydown', mapKey);

    window.addEventListener('dragstart', event => {
        if (event.target.id !== 'img') {
            event.stopPropagation();
            event.preventDefault();
        }
    });

    window.addEventListener('drag', event => {
    });

    window.addEventListener('dragover', event => {
        event.stopPropagation();
        event.preventDefault();
    });

    window.addEventListener('drop', event => {
        event.stopPropagation();
        event.preventDefault();
        if (event.target.id !== 'img') {
            if (!preload) {
                preload = 1; startLoader(); document.onkeydown = mapKey;
                window.removeEventListener('keydown', mapKey);
            } else {
                preload = 0; document.location.reload();
            }
        }
    });
})();