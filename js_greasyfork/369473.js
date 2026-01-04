// ==UserScript==
// @name          Pixiv - Manga Viewer 1.6.13
// @namespace     Massive Manga Viewer For Pixiv
// @description   Preload All Manga Images On The Same Page, Replace Default Resized Image Display Resolution
// @version       1.6.13
// @author        Desolation
// @icon          https://www.pixiv.net/favicon.ico
// @include       https://www.pixiv.net/member_illust.php?mode=medium&illust_id=*
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/369473/Pixiv%20-%20Manga%20Viewer%201613.user.js
// @updateURL https://update.greasyfork.org/scripts/369473/Pixiv%20-%20Manga%20Viewer%201613.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace default individual image display resolution, default master540 master600 master1200 original
    var defaultSoloImage = 'default';

    // Open individual image in new tab, when click on image
    var soloImagesInNewTab = false;

    // Replace default multiple image display resolution, master540 master600 master1200 original
    var defaultMangaImage = 'master1200';

    // Load multiple images one by one instead of trying to load all at the same time
    var lazyMangaLoading = false;

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
        soloImage = document.querySelector('.r_Q2Jin');
        multipleImages = document.querySelector('._2t-hEST');
        ugoiraImage = document.querySelector('.Jj6cgRQ');
        whatImageType();
    }

    function getAttribute(href, src , srcset) {
        href = document.querySelector('.fH6n8FE a').getAttribute('href');
        src = document.querySelector('.fH6n8FE img').getAttribute('src');
        srcset = document.querySelector('.fH6n8FE img').getAttribute('srcset');
        let sub = href.substring(0, href.lastIndexOf('.'));
        let availableResolution = {
            default : src,
            master540 : sub.replace('img-original', 'c/540x540_70/img-master') + '_master1200.jpg',
            master600 : sub.replace('img-original', 'c/600x600/img-master') + '_master1200.jpg',
            master1200 : sub.replace('img-original', 'img-master') + '_master1200.jpg',
            original : href
        };
        masterResolution = availableResolution[defaultSoloImage];
        if (defaultSoloImage != 'default' || soloImagesInNewTab == true) {
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
            document.querySelector('.fH6n8FE').innerHTML = `<a class="_1-h8Se6" href=${href} target="_blank" rel="noopener"><img class="_2r_DywD _3r-img" alt="Failed!" src=${src} srcset=${src}></a>`;
            return soloImagesInNewTab != true ? setAttribute.expand(href) : null;
        },
        expand : function(src, href) {
            let expand = document.createElement('div');
            expand.setAttribute('role', 'presentation');
            expand.innerHTML = `<div class="jByfzSC _149JETn"><div class="_1adSodJ"><div class="_1V2heP9"><img src=${src}></div></div></div>`;
            document.querySelector('._3r-img').style.cursor = 'zoom-in';
            document.querySelector('._3r-img').onclick = function(e) {
                document.body.appendChild(expand);
                document.body.style.overflow = 'hidden';
                setAttribute.collapse(expand);
                e.preventDefault();
                return false;
            };
        },
        collapse : function(expand) {
            document.querySelector('.jByfzSC._149JETn').onclick = function(e) {
                document.body.style.overflow = 'unset';
                expand.remove();
                e.preventDefault();
            };
        },
    }

    var xhr = new XMLHttpRequest(),
        url = location.href.replace('mode=medium', 'mode=manga_big') + '&page=',
        index = 0,
        imgCount = 0,
        retryCount = 0,
        retryLimit = 10;

    function multiple() {
        displayLayout = document.querySelector('.fH6n8FE')
        imgCount = document.querySelector('.gVu_bev').innerHTML.split('/').pop();
        style.innerHTML = `
            ._1tR0cJT { margin: 16px 0 0; background-color: #ffffff; }
            ._1tH0cKT { background-color: #fafafa; }
            ._2rca-ib { display: flex; justify-content: center; background-color: #fafafa; min-height: 480px; }
            ._2dxMuQZ { display: flex; align-items: center; }
            ._2dnVuLX { width: auto; height: auto; max-height: calc(100vh - 48px); max-width: 100%; }
            `;
        document.querySelector('._2t-hEST').innerText += ' (' + imgCount + ')';
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
        let defaultResolution = resolution[defaultMangaImage];
        let layout = document.createElement('div');
        let container = document.querySelector('._1tR0cJT');
        container.appendChild(layout);
        layout.className = '_1tH0cKT';
        layout.innerHTML = `<div class="_1tR0cJT"><div class="_2uvBc97"><div class="gVu_bev">${index + ' / ' + imgCount}</div></div><div class="_2rca-ib"><a class="_2dxMuQZ" href=${src} target="_blank" download><img class="_2dnVuLX" alt="Failed!" src=${defaultResolution}></a></div></div>`;
        if (lazyMangaLoading == true) {
            var image = new Image();
            image.src = resolution[defaultMangaImage];
            image.onload = request;
            image.onerror = request;
            //image.addEventListener('load', request);
            //image.addEventListener('error', request);
        } else {
            request();
        }
    }

})();

// Afraid Daylight Obscure The Darkness Of The Night.

