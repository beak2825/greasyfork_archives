// ==UserScript==
// @name          Pixiv - Manga Viewer (1)
// @namespace     Massive Manga Viewer For New Pixiv Design
// @description   Preload All Manga Images On The Same Page, Replace Default Resized illusts With Original Image (For New Pixiv Design)
// @version       1.4.26
// @author        Desolation
// @icon          https://www.pixiv.net/favicon.ico
// @include       https://www.pixiv.net/member_illust.php?mode=medium&illust_id=*
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/41057/Pixiv%20-%20Manga%20Viewer%20%281%29.user.js
// @updateURL https://update.greasyfork.org/scripts/41057/Pixiv%20-%20Manga%20Viewer%20%281%29.meta.js
// ==/UserScript==

function override() {
    'use strict';

    // Replace individual illusts with original image
    var originalSoloImage = false;

    // Open individual illusts in new tab
    var soloImagesInNewTab = true;

    // Replace default manga illusts with original image
    var originalMangaImage = false;

    // Lazy loading to load manga illusts one by one instead of trying to load all at the same time
    var lazyMangaLoading = false;

    // Very powerful external image compressor (Not recommended)
    var externalCompressor = false;

    // Quality of image compressor, low medium high lossless
    var compressorQuality = "high";

    var css = [],
        style = document.createElement('style'),
        head = document.head;

    var _1e0SuJ = document.querySelector('._2SoNhPS'),
        _AthSEE = document.querySelector('._2t-hEST'),
        _FthEST = document.querySelector('._1tR0cJT > ._2rca-ib'),
        overall = document.querySelector('.gVu_bev'),
        quality = compressorQuality;

    var xhr = new XMLHttpRequest(),
        url = location.href.replace('mode=medium', 'mode=manga_big') + '&page=',
        index = 0,
        retryCount = 0,
        retryLimit = 5;

    if (head !== null || head !== undefined) {
        head.appendChild(style);
    } else {
        return false;
    }

    if (_1e0SuJ !== null) {
        var org = document.querySelector('._2rca-ib a').getAttribute('href');
        var srcset = document.querySelector('._2rca-ib img').getAttribute('srcset');
        var master540 = document.querySelector('._2rca-ib img');
        var Master1200 = master540.src.replace('c/540x540_70/img-master', 'img-master')
        let original = originalSoloImage == true ? Master1200 = org : null;
        let compress = externalCompressor == true ? Master1200 = 'https://img.gs/znxzdclwtf/quality=' + quality + '/' + Master1200 : null;
        let newTab = soloImagesInNewTab == true
        ? document.querySelector('._2rca-ib').innerHTML ='<div class="_2rca-ibc"><a href='+org+' target="_blank"><img src='+Master1200+' alt="Failed!"></a></div?'
        : document.querySelector('._2dxWuLX._2SoNhPS').innerHTML = '<img class="_-8uKglP" alt="Faild" src='+Master1200+'>';
        css = [
            '._2rca-ibc { min-width: 200px; }',
            '._2rca-ibc img { height: auto; display: block; margin: auto; width: auto; max-width: 100%; max-height: calc(100vh - 48px); background-color: rgba(0,0,0,.04); }'
        ];
        style.innerHTML = css.join('');
    }

    if (_AthSEE !== null) {
        request();
        overall = overall.innerHTML.split('/').pop();
        style.innerHTML = '._-8uKglP { max-height: calc(100vh - 48px) }';
        document.querySelector('._2t-hEST').innerText = 'See all (' + overall + ')';
    }

    function request() {
        xhr.open('GET', url + index, true);
        xhr.responseType = 'document';
        xhr.send(null);
        xhr.onreadystatechange = function () {
            response();
            return _FthEST !== null ? _FthEST.remove() : null;
        };
        xhr.onerror = function(error) {
            return retryCount < retryLimit ? retryCount++ & setTimeout(request, 3000) : null;
            console.log('Failed to load image page ERR::' + url + index);
        };
    }

    function response() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var html = xhr.responseXML;
            var imgOrg = html.body.querySelector('img').src;
            var retry = retryCount > 0 ? retryCount = 0 : null;
            prototype(imgOrg);
        }
    }

    function prototype(src, _count) {
        index++;
        var _sub = src.substring(0, src.lastIndexOf('.'));
        var _im5 = src.replace('img-original', 'c/540x540_70/img-master');
        var _im6 = src.replace('img-original', 'c/600x600/img-master');
        var _540 = _im5.substring(0, _im5.lastIndexOf('.')) + '_master1200.jpg'; // 540 x 540
        var _600 = _im6.substring(0, _im6.lastIndexOf('.')) + '_master1200.jpg'; // 600 x 600
        var _1200 = _sub.replace('img-original', 'img-master') + '_master1200.jpg'; // 1200 x 1200
        var master_540 = _540;
        var master_600 = _600;
        var master_1200 = _1200;
        var original_img = src;
        var resolution = master_600;
        var _1tR0cJT = document.createElement('div');
        var _31qcFPD = document.querySelector('._31qcFPD');
        let original = originalMangaImage == true ? resolution = src : null;
        let compress = externalCompressor == true ? resolution = 'https://img.gs/znxzdclwtf/quality=' + quality + '/' + resolution : null;
        _31qcFPD.insertBefore(_1tR0cJT, _31qcFPD.lastChild);
        _count = index + ' / ' + overall;
        _1tR0cJT.innerHTML =
            '<div class="_1tR0cJT"><div class="_2uvBc97"><div class="gVu_bev">'+_count+'</div></div>' +
            '<div class="_2rca-ib"><a class="_2dxWuLX" href='+src+' target="_blank">' +
            '<img class="_-8uKglP" alt="Faild" src='+resolution+' width="600" height="600"></a></div></div>';
        if (lazyMangaLoading == true) {
            var image = new Image();
            image.src = resolution;
            image.addEventListener('load', request);
            image.addEventListener('error', request);
        } else {
            request();
        }
    }

    // Retry in case the request failed
    if (document.querySelector('._1tR0cJT') == null && _AthSEE !== null) {
        setTimeout(override, 5000);
        console.log('Request failed to load, Retrying...');
    }
}

window.onload = setTimeout(override, 1200);;

// Afraid Daylight Obscure The Darkness Of The Night.

