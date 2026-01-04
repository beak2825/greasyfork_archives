// ==UserScript==
// @name        ComicWalker Downloader
// @match       https://comic-walker.com/viewer/*
// @require     https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js
// @version     1.0
// @author      ICYLUNA
// @description ComicWalker Manga Downloader
// @namespace https://greasyfork.org/users/747358
// @downloadURL https://update.greasyfork.org/scripts/423229/ComicWalker%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/423229/ComicWalker%20Downloader.meta.js
// ==/UserScript==

let body = $('body');

body.on('mouseover', 'canvas', function () {
    $(this).before('<div id="download" ' +
        'style="cursor: pointer;position: absolute;left: 50%;transform: translate(-50%, -50%);bottom:20px;' +
        'border-radius: 20px;padding: 12px 23px;'+
        'color: #fff;font-weight: 500;font-size:16px;background-color: #409eff;border-color: #409eff;">' +
        'Download</div>')
})

body.on('mouseout', '#download', function () {
    $(this).remove();
})

body.on('click', '#download', function () {
    let image = $(this).next()[0].toDataURL('image/jpeg');
    let filename = $('.sc-ksluoS.dnwAAu').text().split(' / ')[0] + '.jpg';
    let link = document.createElement('a');
    link.download = filename;
    link.href = image;
    link.click();
})