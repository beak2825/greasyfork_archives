// ==UserScript==
// @name          Pixiv - Manga Viewer
// @namespace     Massive Manga Viewer For Pixiv
// @description   Preload All Manga Images On The Same Page, Replace Default Resized Image Display Resolution
// @version       1.7.25
// @author        Desolation
// @icon          https://www.pixiv.net/favicon.ico
// @include       https://www.pixiv.net/member_illust.php?mode=medium&illust_id=*
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/370944/Pixiv%20-%20Manga%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/370944/Pixiv%20-%20Manga%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace default individual image display resolution, default master540 master600 master1200 original
    var defaultSoloImage = 'default';

    // Open individual image in new tab, when click on image
    var soloImageInNewTab = false;

    // Replace default multiple images display resolution, master540 master600 master1200 original
    var defaultMangaImages = 'master1200';

    // Load multiple images one by one instead of trying to load all at the same time
    var lazyMangaLoading = false;

    // Change multiple images max-height display, default 600px 652px 700px 800px etc.
    var maxMangaHeight = 'default';

    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    var css = [],
        style = document.createElement('style'),
        head = document.head;

    var soloImage = null, multipleImages = null, ugoiraImage = null,
        displayLayout = null, masterResolution,
        still = true;

    if (head != null || head != undefined || typeof(window) != undefined) {
        head.appendChild(style);
    } else {
        return false;
    }

    document.addEventListener('DOMContentLoaded', function() {
        getImageType();
    }, this);

    // Check what image type, solo multiple ugoira
    function whatImageType() {
        var isSoloImage = soloImage != null & still == true ? (still = false) & getAttribute() : null;
        var isMultipleImages = multipleImages != null & still == true ? (still = false) & multiple() : null;
        var isUgoiraImage = ugoiraImage != null & still == true ? still = false : null;
        if (still == true) {
            setTimeout(getImageType, 500);
        }
    };

    // Get actual image type
    function getImageType() {
        let layout = document.querySelector('figure a');
        if (layout != null) {
            let solo = layout.href.indexOf('img-original') != -1 ? soloImage = 'solo' : null;
            let multiple = layout.href.indexOf('mode=manga') != -1 ? multipleImages = 'multiple' : null;
            let ugoira = document.querySelector('figure canvas') != null ? ugoiraImage = 'ugoira' : null;
        }
        whatImageType();
    }

    function getAttribute(href, src , srcset) {
        href = document.querySelector('figure a').getAttribute('href');
        src = document.querySelector('figure img').getAttribute('src');
        srcset = document.querySelector('figure img').getAttribute('srcset');
        let sub = href.substring(0, href.lastIndexOf('.'));
        let availableResolution = {
            default : src,
            master540 : sub.replace('img-original', 'c/540x540_70/img-master') + '_master1200.jpg',
            master600 : sub.replace('img-original', 'c/600x600/img-master') + '_master1200.jpg',
            master1200 : sub.replace('img-original', 'img-master') + '_master1200.jpg',
            original : href
        };
        masterResolution = availableResolution[defaultSoloImage];
        if (defaultSoloImage != 'default' || soloImageInNewTab == true) {
            if (href != null && defaultSoloImage != 'default') {
                setAttribute.html(href, masterResolution);
            } else if (srcset != null && defaultSoloImage == 'default') {
                setAttribute.html(href, masterResolution);
            } else {
                setTimeout(getAttribute, 500);
            }
        }
    }

    var setAttribute = {
        html: function(href, src) {
            setAttribute.style();
            document.querySelector('figure > div > div').innerHTML = `<a class="_1-h8Se7" href=${href} target="_blank" rel="noopener"><img class="_3rf-img" alt="Failed!" src=${src} srcset=${src}></a>`;
            return soloImageInNewTab != true ? setAttribute.expand(href) : null;
        },
        expand : function(src, href) {
            let expand = document.createElement('div');
            expand.setAttribute('role', 'presentation');
            expand.innerHTML = `<div class="_jBygzSK"><div class="_10dSodJ"><div class="_1V2htP9"><img src=${src}></div></div></div>`;
            document.querySelector('._3rf-img').style.cursor = 'zoom-in';
            document.querySelector('._3rf-img').onclick = function(e) {
                document.body.appendChild(expand);
                document.body.style.overflow = 'hidden';
                setAttribute.collapse(expand);
                e.preventDefault();
                return false;
            };
        },
        collapse : function(expand) {
            document.querySelector('._jBygzSK').onclick = function(e) {
                document.body.style.overflow = 'unset';
                expand.remove();
                e.preventDefault();
            };
        },
        style : function() {
            style.innerHTML = `
                ._1-h8Se7 { font-size: 0; line-height: 0; min-width: 200px; }
                ._3rf-img { display: block; height: auto; margin: auto; width: auto; max-width: 100%; max-height: calc(100vh - 72px); }
                ._jBygzSK { background-color: #fff; height: 100%; left: 0; overflow: auto; position: fixed; top: 0; width: 100%; z-index: 100; }
                ._10dSodJ { cursor: zoom-out; display: flex; min-height: 100%; }
                ._1V2htP9 { margin: auto; }
            `;
        }
    }

    var xhr = new XMLHttpRequest(),
        url = location.href.replace('mode=medium', 'mode=manga_big') + '&page=',
        index = 0,
        imgCount = 0,
        retryCount = 0,
        retryLimit = 10;

    function multiple() {
        displayLayout = document.querySelector('figure a').parentNode;
        imgCount = document.querySelector('figure > div > div > div').innerHTML.split('/').pop();
        var maxHeight = maxMangaHeight == 'default' ? maxHeight = 'calc(100vh - 48px)' : maxHeight = maxMangaHeight;
        style.innerHTML = `
            ._1rR5dTX { margin: 16px 0 0; background-color: #ffffff; position: relative; }
            ._1tR0cJT { position: relative; margin-top: -16px; }
            ._2rca-ib { display: flex; justify-content: center; background-color: #fafafa; min-height: 480px; }
            ._2dxMuQZ { display: flex; align-items: center; }
            ._2dnVuLX { width: auto; height: auto; max-height: ${maxHeight}; max-width: 100%; }
            ._2uvBn9Q { position: absolute; top: 8px; right: 8px; }
            .gVu_bevX { background-color: #0003; border-radius: 8px; color: #fff; font-size: 10px; font-weight: 700; line-height: 1; padding: 3px 8px}
        `;
        let isCountNull = imgCount.match(/\d/) ? document.querySelectorAll('figure a')[1].innerText += ' (' + imgCount + ')' : imgCount = 'null';
        request();
    }

    function request() {
        xhr.open('GET', url + index, true);
        xhr.responseType = 'document';
        xhr.send(null);
        xhr.onreadystatechange = function () {
            response();
            return displayLayout != null ? displayLayout.remove() : null;
        };
        xhr.onerror = function(error) {
            console.log('Pixiv Manga Viewer - Failed to load image page ERR::' + url + index);
            return retryCount < retryLimit ? retryCount++ & setTimeout(request, 3000) : null;
        };
    }

    function response() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var html = xhr.responseXML;
            var imgSrc = html.body.querySelector('img').src;
            var retry = retryCount > 0 ? retryCount = 0 : null;
            createImage(imgSrc);
        }
    }

    function createImage(src) {
        index++;
        var sub = src.substring(0, src.lastIndexOf('.'));
        var master = src.substring(src, src.lastIndexOf('.')) + '_master1200.jpg';
        var resolution = {
            master100 : master.replace('img-original', 'c/100x100/img-master'),
            master200 : master.replace('img-original', 'c/200x200/img-master'),
            master240 : master.replace('img-original', 'c/240x240_70/img-master'),
            master480 : master.replace('img-original', 'c/240x480/img-master'),
            master540 : master.replace('img-original', 'c/540x540_70/img-master'),
            master600 : master.replace('img-original', 'c/600x600/img-master'),
            master1200 : sub.replace('img-original', 'img-master') + '_master1200.jpg',
            original : src
        };
        let defaultResolution = resolution[defaultMangaImages];
        let layout = document.createElement('div');
        let container = document.querySelectorAll('figure div')[0];
        container.appendChild(layout);
        layout.className = '_1rR5dTX';
        layout.innerHTML = `<div class="_7tR0cGH"><div class="_2uvBn9Q"><div class="gVu_bevX">${index + ' / ' + imgCount}</div></div><div class="_2rca-ib"><a class="_2dxMuQZ" href=${src} target="_blank"><img class="_2dnVuLX" alt="Failed!" src=${defaultResolution}></a></div></div>`;
        if (lazyMangaLoading == true) {
            var image = new Image();
            image.src = resolution[defaultMangaImages];
            image.onload = request;
            image.onerror = request;
            //image.addEventListener('load', request);
            //image.addEventListener('error', request);
        } else {
            request();
        }
    }

    function see_click() {
        if (soloImage != null || ugoiraImage != null ) {
            return;
        } else if (multipleImages != null) {
            document.querySelectorAll('figure a')[1].onclick = function(e) {
                request();
                e.preventDefault();
            };
        } else {
            setTimeout(see_click, 2000);
        }
    } see_click();

})();

// Afraid Daylight Obscure The Darkness Of The Night.

