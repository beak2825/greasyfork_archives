// ==UserScript==
// @name          Pixiv - Manga Viewer 1
// @namespace     Massive Manga Viewer
// @description   Preload All Manga Images On The Same Page, Replace Default Resized illusts With Original Image
// @version       1.3.4
// @author        Desolation
// @icon          https://www.pixiv.net/favicon.ico
// @include       https://www.pixiv.net/member_illust.php?mode=medium&illust_id=*
// @run-at        document-Start
// @downloadURL https://update.greasyfork.org/scripts/38542/Pixiv%20-%20Manga%20Viewer%201.user.js
// @updateURL https://update.greasyfork.org/scripts/38542/Pixiv%20-%20Manga%20Viewer%201.meta.js
// ==/UserScript==

(function() {

    var original_solo_images = false;   // Replace individual illusts with original image
    var solo_images_in_new_tab = false; // Open individual illusts in new tab
    var original_manga_images = false;  // Replace default manga illusts with original images
    var load_images_one_by_one = true;  // Load manga illusts one by one instead of load all at the same time
    var manga_images_counting = true;   // Display manga image counting number

    var external_compressor = false;    // Not recommended, very powerful external image compressor (250KB = 60KB)
    var compressor_quality = 'high';    // Compressor quality of images, low medium high lossless

    var css = [];
    var style = document.createElement('style');
    var head = document.head;

    if (head !== null || head !== undefined) {
        head.appendChild(style);
    } else {
        return style;
    }

    var solo_image = document.querySelector('img.original-image');
    var multiple_image = document.querySelector('._work.multiple');
    var works_display = document.querySelector('.works_display');

    if (solo_image !== null) {
        var image_original = document.querySelector('img.original-image').getAttribute('data-src');
        var image_master = document.querySelector('._layout-thumbnail.ui-modal-trigger img');
        if (original_solo_images == true)
            image_master.src = image_original;
        if (external_compressor == true)
            image_master.src = 'https://img.gs/znxzdclwtf/quality=' + compressor_quality + '/' + image_master.src;
		if (solo_images_in_new_tab == true)
            works_display.innerHTML ='<div class="_layout-thumbnail"><a href='+image_original+' target="_blank"><img src='+image_master.src+' alt="Failed!"></a></div?';
        css = [
            ".works_display div { margin: 2px; }",
            ".works_display img { background-color: #f1ebeb; box-shadow: 0px 0px 5px 0px #a98a8a; }"
        ];
        style.innerHTML = css.join('');
    }

    var xhr = new XMLHttpRequest();
    var url = location.href.replace('mode=medium', 'mode=manga_big') + '&page=';
    var count = 0;

    if (multiple_image !== null) {
        request();
        const images_count = document.querySelector('.read-more.js-click-trackable').textContent.match(/\d+/);
        document.querySelector('.read-more.js-click-trackable').innerText = 'All Images (' + images_count + ')';
        css = [
            ".illustration { min-height: 480px; display: flex; align-items: center; justify-content: center; margin-bottom: 30px; }",
            ".illustration a { width: auto; }",
            ".illustration img { max-width: 600px; max-height: 600px; background-color: #f1ebeb; box-shadow: 0px 0px 5px 0px #a98a8a; }",
            ".illustration ._count { position: absolute; right: 50px; font-size: 15px; font-style: normal; color: #806c6c; }"
        ];
        style.innerHTML = css.join('');
    }

    function request() {
        xhr.open("GET", url + count, true);
        xhr.responseType = 'document';
        xhr.send(null);
        xhr.onreadystatechange = function () {
            response();
            return multiple_image !== null ? multiple_image.remove() : null;
        };
        xhr.onerror = function(error) {
            if (xhr.readyState == 0) {
                return request();
            }
            console.log('Pixiv - Manga Viewer error : '  + error);
        };
    }

    function response() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var html = xhr.responseXML;
            var original_img = html.body.querySelector('img').src;
            create_image(original_img);
        }
    }

    function create_image(src, _count) {
        var _sub = src.substring(0, src.lastIndexOf('.'));
        var _img = src.replace('img-original', 'c/600x600/img-master');
        var master_600 = _img.substring(0, _img.lastIndexOf('.')) + '_master1200.jpg';    // 600  x 600
        var master_1200 = _sub.replace('img-original', 'img-master') + '_master1200.jpg'; // 1200 x 1200
        var original_img = src;
        count++;
        let original = original_manga_images == true ? master_600 = src : null;
        let counting = manga_images_counting == true ? _count = count : _count = '';
        let compress = external_compressor == true ? master_600 = 'https://img.gs/znxzdclwtf/quality=' + compressor_quality + '/' + master_600 : null;
        works_display.innerHTML += '<div class="illustration"><a href='+src+' target="_blank"><img src='+master_600+' alt="Failed!"></a><i class="_count sQnmXM9">'+_count+'</i></div>';
        if (load_images_one_by_one == true) {
            var image = new Image();
            image.src = master_600;
            image.addEventListener('load', request);
            image.addEventListener('error', request);
        } else {
            return request();
        }
        works_display.insertBefore(document.querySelector('.read-more.js-click-trackable'), works_display.childNodes[-1]);
    }

})();

// Afraid Daylight Obscure The Darkness Of The Night.

