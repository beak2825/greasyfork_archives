// ==UserScript==
// @name         Streamza Copy Links
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to copy links on Streamza
// @author       hazzy
// @match        https://streamza.com/dashboard.php
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/38285/Streamza%20Copy%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/38285/Streamza%20Copy%20Links.meta.js
// ==/UserScript==

var currentPage = Date.now();

function setUpCopy() {
    var dlBtns;
    var pnCont;
    var clipboardSet = '';
    var clipBtn = $('<a></a>');
    clipBtn.attr('id', 'copy_links').addClass('btn btn-success').text('Copy links');
    var checkExist = window.setInterval(function() {
        pnCont = $('div.additional_details');
        if (pnCont.length && pnCont.data('created') != currentPage) {
            currentPage = Date.now();
            pnCont.data('created', currentPage);
            $(pnCont).children('a').slice(0, 2).each(function() {
                $(this).on('click', function() {
                    setUpCopy();
                });
            });
            pnCont.append(clipBtn);
            $('.detail_info').children('div')[2].remove();
            dlBtns = $('.search_result div.btn_cont a.btn');
            clearInterval(checkExist);
        }
    }, 60);
    clipBtn.on('click', function() {
        dlBtns.each(function() {
            clipboardSet += ($(this).attr('onclick').split("'")[1]) + ' ';
        });
        GM_setClipboard(clipboardSet, 'text');
        $(this).addClass('disabled');
        //console.log('Copied!');
    });
}

(function() {
    'use strict';

    $(document).on('click','.torrent-item,.loadcontent',function() {
        setUpCopy();
    });
})();