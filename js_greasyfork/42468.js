// ==UserScript==
// @name          Pixiv - Manga Viewer (Obsolete)
// @namespace     Massive Manga Viewer
// @description   Preload All Manga Images On The Same Page, Replace Default Resized illusts With Original Image
// @version       1.2.19
// @author        Desolation
// @icon          https://www.pixiv.net/favicon.ico
// @include       https://www.pixiv.net/member_illust.php?mode=medium&illust_id=*
// @run-at        document-Start
// @downloadURL https://update.greasyfork.org/scripts/42468/Pixiv%20-%20Manga%20Viewer%20%28Obsolete%29.user.js
// @updateURL https://update.greasyfork.org/scripts/42468/Pixiv%20-%20Manga%20Viewer%20%28Obsolete%29.meta.js
// ==/UserScript==

(function() {

    var settings,
        soloOriginalImages  = true,   // Replace individual illusts with original image
        soloImagesInNewTab  = false,  // Open individual illusts in new tab
        mangaOriginalImages = false,  // Replace default manga illusts with original image
        mangaImagesOneByOne = false,  // Load manga illusts one by one instead of trying to load all at the same time
        mangaImagesCounting = true,   // Display manga image counting number
        externalCompressor  = false,  // Very powerful external image compressor, Not recommended
        compressorQuality   = 'high'; // Quality of Image compressor, low medium high lossless

    var css = [],
        style = document.createElement('style'),
        head = document.head;

    if (head !== null || head !== undefined) {
        head.appendChild(style);
    } else {
        return false;
    }

    var solo_image = document.querySelector('img.original-image'),
        multiple_image = document.querySelector('._work.multiple'),
        works_display = document.querySelector('.works_display'),
        quality = compressorQuality;

    if (solo_image !== null) {
        var image_original = document.querySelector('img.original-image').getAttribute('data-src');
        var image_master = document.querySelector('._layout-thumbnail.ui-modal-trigger img');
        let original = soloOriginalImages == true ? image_master.src = image_original : null;
        let compress = externalCompressor == true ? image_master.src = 'https://img.gs/znxzdclwtf/quality=' + quality + '/' + image_master.src : null;
        let newTab = soloImagesInNewTab == true ?
            works_display.innerHTML ='<div class="_layout-thumbnail"><a href='+image_original+' target="_blank"><img src='+image_master.src+' alt="Failed!"></a></div?' : null;
        css = [
            ".works_display div { margin: 2px; }",
            ".works_display img { max-width: 600px; max-height: 600px; background-color: #f1ebeb; }"
        ];
        style.innerHTML = css.join('');
    }

    var xhr = new XMLHttpRequest(),
        url = location.href.replace('mode=medium', 'mode=manga_big') + '&page=',
        index = 0,
        retryCount = 0,
        retryLimit = 10;

    if (multiple_image !== null) {
        request();
        var images_count = document.querySelector('.read-more.js-click-trackable').textContent.match(/\d+/);
        document.querySelector('.read-more.js-click-trackable').innerText = 'All Images (' + images_count + ')';
        css = [
            ".illustration { min-height: 480px; display: flex; align-items: center; justify-content: center; margin-bottom: 30px; }",
            ".illustration a { width: auto; }",
            ".illustration img { max-width: 600px; max-height: 600px; background-color: #f1ebeb; }",
            ".illustration ._count { position: absolute; right: 0; font-size: 15px; font-style: normal; color: #fff; padding: 6px; min-width: 40px; }",
        ];
        if (mangaImagesCounting == true) {
            css[css.length] = ".illustration ._count._s { border-radius: 5px 0px 0px 5px; box-shadow: 0px 0px 2px 0px #a98a8a; background-color: rgba(0, 0, 0, 0.4); }" ;
        }
        style.innerHTML = css.join('');
    }

    function request() {
        xhr.open("GET", url + index, true);
        xhr.responseType = 'document';
        xhr.send(null);
        xhr.onreadystatechange = function () {
            response();
            return multiple_image !== null ? multiple_image.remove() : null;
        };
        xhr.onerror = function(error) {
            return retryCount < retryLimit ? retryCount++ & setTimeout(request, 3000) : null;
        };
    }

    function response() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var html = xhr.responseXML;
            var original_img = html.body.querySelector('img').src;
            var retry = retryCount > 0 ? retryCount = 0 : null;
            createImage(original_img);
        }
    }

    function createImage(src, _count) {
        var _sub = src.substring(0, src.lastIndexOf('.'));
        var _img = src.replace('img-original', 'c/600x600/img-master');
        var master_600 = _img.substring(0, _img.lastIndexOf('.')) + '_master1200.jpg';    // 600  x 600
        var master_1200 = _sub.replace('img-original', 'img-master') + '_master1200.jpg'; // 1200 x 1200
        var original_img = src;
        index++;
        let original = mangaOriginalImages == true ? master_600 = src : null;
        let counting = mangaImagesCounting == true ? _count = index + ' / ' + images_count : _count = '';
        let compress = externalCompressor == true ? master_600 = 'https://img.gs/znxzdclwtf/quality=' + quality + '/' + master_600 : null;
        works_display.innerHTML += '<div class="illustration"><a href='+src+' target="_blank"><img src='+master_600+' alt="Failed!"></a><i class="_count _s">'+_count+'</i></div>';
        if (mangaImagesOneByOne == true) {
            var image = new Image();
            image.src = master_600;
            image.addEventListener('load', request);
            image.addEventListener('error', request);
        } else {
            request();
        }
        works_display.insertBefore(document.querySelector('.read-more.js-click-trackable'), works_display.childNodes[-1]);
    }

})();

// Afraid Daylight Obscure The Darkness Of The Night.


