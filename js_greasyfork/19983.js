// ==UserScript==
// @name         Avvy Pirate
// @namespace    pxgamer
// @version      0.2
// @description  Steals people's avatars anywhere on KAT.
// @author       pxgamer
// @include      *kat.cr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19983/Avvy%20Pirate.user.js
// @updateURL https://update.greasyfork.org/scripts/19983/Avvy%20Pirate.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    $('.userPic div.badgeSiteStatus').prepend(
        '<a title="steal user\'s avatar" class="stealAvvy"><i class="icon16 ka ka16 ka-user""></i></a> '
    );


    var csrf = $('form input[name="csrf_token"]').val();

    $('.stealAvvy').on(
        'click',
        function() {
            var imgId = '';
            var imgData = "image_id="+imgId;

            //$(this).prev('a[href^="/user/"]').find('img').attr('src');
            console.info(imgData);
            $.ajax(
                {
                    type: 'POST',
                    url: '/account/setuserpic/',
                    data: imgData,
                    error: function() {
                        console.info('AP: An error occurred');
                    },
                    dataType: 'json',
                    success: function(data) {
                        location.reload();
                    }
                }
            );
        }
    );

})();
