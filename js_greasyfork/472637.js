// ==UserScript==
// @name         dingGLBRU
// @namespace    https://gelbooru.com/
// @version      0.1
// @description  ding voor GLBRU
// @author       You
// @match        https://gelbooru.com/index.php?page=post*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gelbooru.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant       GM_download
// @downloadURL https://update.greasyfork.org/scripts/472637/dingGLBRU.user.js
// @updateURL https://update.greasyfork.org/scripts/472637/dingGLBRU.meta.js
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
$('.thumbnail-preview').hover(function() {
  $( this ).find('img').css('max-width', '100%');
  $( this ).find('img').css('max-height', '100%');
}, function() {
    $( this ).find('img').css('max-width', '175px');
  $( this ).find('img').css('max-height', '175px');
  })

    $('.thumbnail-preview a').click(function(event) {
        event.preventDefault();
        openWindow($(this).attr('href'));
    })
    if ($( ".image-container" ).length) {
        $(document).on('keypress',function(e) {
            switch (e.which) {
                case zKey:
                        //name: $('#tag-list').find('li:contains(Id: )').text().split(" ")[1] + '.jpg',
                    let imgUrl = $('#tag-list').find('a:contains(Original image)').attr('href');
                    let imgName = imgUrl.split('/');
                    imgName = imgName[imgName.length-1];
                    let imgData = {
                        url: imgUrl,
                        name: imgName,

                    };

                    if (imgUrl == '' || imgName == '') {
                        alert('Something went wrong');
                        console.log(imgData)
                        return;
                    }

                    GM_download(imgData);
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