// ==UserScript==
// @name         Bỏ chặn 5 phút, chế độ full màn studyphim.vn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bỏ chặn 5 phút, chế độ full màn studyphim.vn - eng
// @description:vi Bỏ chặn 5 phút, chế độ full màn studyphim.vn
// @author       Tài Sáng
// @match        http://www.studyphim.vn/movies/*
// @grant        none
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/368319/B%E1%BB%8F%20ch%E1%BA%B7n%205%20ph%C3%BAt%2C%20ch%E1%BA%BF%20%C4%91%E1%BB%99%20full%20m%C3%A0n%20studyphimvn.user.js
// @updateURL https://update.greasyfork.org/scripts/368319/B%E1%BB%8F%20ch%E1%BA%B7n%205%20ph%C3%BAt%2C%20ch%E1%BA%BF%20%C4%91%E1%BB%99%20full%20m%C3%A0n%20studyphimvn.meta.js
// ==/UserScript==


$(document).ready(function() {
    $('head').append(`<style>
body.fullscreen [class*="col-"] { padding: 0; width: auto }
body.fullscreen > * { display: none; }
body.fullscreen .page-header { display: block; margin: 0; padding: 0; }

body.fullscreen #subtitles-container .savep { display: none }
body.fullscreen #subtitles-container span { padding: 10px; border-color: #151515; }
body.fullscreen #subtitles-container { width: 20vw; height: 100vh!important; background: #000; color: #3e3e3e; margin: 0!important;}

body.fullscreen { padding: 0!important; margin: 0!important }
body.fullscreen .mediaplayer { height: 100vh; width: 80vw; margin: 0; padding: 0}
</style>`);
    $('.media-controls').append(`<div class="expand-container"><button>E</button></div>`)
    function removeWarning() {
        var $overlay = $('.mediaplayer .overlay');
        if ($overlay.length) {
            $overlay.remove();
            $('.play-pause').click();
            console.log('removed .mediaplayer .overlay');
        }
    }

    function toggleExpand() {
        $('body').toggleClass('fullscreen');
    }


    setInterval(removeWarning, 1000);

    $('body').keyup(function(e) {
        if (e.keyCode == 70) {
            toggleExpand();
        }

        removeWarning();
    });

    $('.media-controls .expand-container').on('click', toggleExpand);

});
