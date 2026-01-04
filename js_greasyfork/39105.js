// ==UserScript==
// @name         Goskatalog Image Downloader
// @namespace    http://ext.redleaves.ru
// @version      0.1
// @description  Добавляет ссылки на скачивание изображений с сайта Государственного каталога музейного фонда Российской Федерации (http://goskatalog.ru)
// @author       MewForest
// @license      MIT
// @include      *://goskatalog.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39105/Goskatalog%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/39105/Goskatalog%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addDownloadLink()
    {
        if ($('.loader__large').length == 0 && $('.zoomWindow').css('background-image') && $('.downloadImage').length == 0 )
        {
            var url='';
            url = $('.zoomWindow').css('background-image').substr(5);
            url = url.substr(0,url.length - 2);
            $('.title-group').append('<a href="'+url+'" target=_blank style="color: #4f88a4;" class="downloadImage"><strong>cкачать</strong><a>');
            setTimeout(addDownloadLink, 1000);
        } else {
            setTimeout(addDownloadLink, 1000);
        }
    }
    function isLoader()
    {
        if ($('.loader__large').length)
        {
            return true;
        } else {
            return false;
        }
    }
    /* window.setInterval(isLoader, 1000);
    $('.loader__large').on("DOMNodeInserted", function (event) { alert('!'); }); */
    addDownloadLink();
})();
