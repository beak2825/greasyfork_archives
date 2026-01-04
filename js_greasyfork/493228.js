// ==UserScript==
// @name         Recurbate
// @version      1.0.0
// @description  Wide screen, Added button for hide model, transparent play button on recu.me
// @match        https://recu.me/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1291978
// @downloadURL https://update.greasyfork.org/scripts/493228/Recurbate.user.js
// @updateURL https://update.greasyfork.org/scripts/493228/Recurbate.meta.js
// ==/UserScript==

var $ = unsafeWindow.jQuery;

$(function () {
    $('[title="Give yourself a New Year Gift"]').remove();
    var thumbs = $(".video-thumb");
    thumbs.each(function(i, obj) {
        var username = $(obj).data('performer');
        var hideBtn = $("<button class=\"btn btn-warning btn-sm\"><i class=\"fas fa-eye-slash\"></i></button>").appendTo(obj);
        hideBtn.on("click", function () {
            console.log('Hide ' + username);
            var url = 'https://recu.me/api/performer/'+username+'/hide';
            var json = '{"performer":"'+username+'"}';
            $.ajax({
                type: "POST",
                url: url,
                data: json,
                contentType : 'application/json',
                success: function (data) {
                    $('[data-performer="'+username+'"]').each(function(i, obj1) {
                        //$(obj1).addClass('hidden-for-user');
                        $(obj1).remove();
                    });
                    obj.remove();
                },
                error: function (jqXHR, exception) {
                    alert('Error: ' + jqXHR.responseText);
                }
            });
        });
    });
});

GM_addStyle(`
    .video-thumb.hidden-for-user {
        opacity: 0.1;
    }
    .video-play-button {
        opacity: 0.1;
    }
    .video-play-button:hover {
        opacity: 1;
    }
    .video-splash-big img {
        opacity: 1;
    }
    @media (min-width: 1200px) {
     .container {
       max-width: 100%;
     }
   }
`);
