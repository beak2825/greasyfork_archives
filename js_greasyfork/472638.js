// ==UserScript==
// @name         dingKMN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ding voor KMN
// @author       You
// @match        https://kemono.party/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kemono.party
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant       GM_download
// @downloadURL https://update.greasyfork.org/scripts/472638/dingKMN.user.js
// @updateURL https://update.greasyfork.org/scripts/472638/dingKMN.meta.js
// ==/UserScript==

//about:config
//dom.disable_window_flip

//var arg = { url: "https://example.com/123456.jpg",
//            name: "CustomFileName.jpg"
//          };

//GM_download(arg);

const zKey = 122;
const xKey = 120;

(function() {
    'use strict';
    /*
$('.card-list__items').hover(function() {
  $( this ).find('img').css('max-width', '100%');
  $( this ).find('img').css('max-height', '100%');
}, function() {
    $( this ).find('img').css('max-width', '175px');
  $( this ).find('img').css('max-height', '175px');
  })*/

    $('.card-list__items a').click(function(event) {
        event.preventDefault();
        openWindow($(this).attr('href'));
    })

    let downloadButton = $(`<button>Download</button>`)
    .css('position', 'absolute').click(function() {
        let imgData = {
                        url: $(this).parent().attr('href'),
                        name: $(this).parent().attr('download'),

                    };
        console.log(imgData)
        GM_download(imgData);
    });

    $('.post__files a').append(downloadButton);
    if ($( ".post__files" ).length) {
        $(document).on('keypress',function(e) {
            switch (e.which) {
                /*case zKey:
                    console.log($('#tag-list').find('a:contains(Original image)').attr('href'))
                    let imgData = {
                        url: $('#tag-list').find('a:contains(Original image)').attr('href'),
                        name: $('#tag-list').find('li:contains(Id: )').text().split(" ")[1] + '.jpg',

                    };
                    GM_download(imgData);*/
                case xKey:
                    window. close();
                    break;
            }
        });
    }
})();

function openWindow( url )
{
  window.open(url, '_blank');
  window.focus();
}