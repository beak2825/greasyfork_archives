// ==UserScript==
// @name         三分屏课件自动播放
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @include      http://*/*
// @require      http://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399008/%E4%B8%89%E5%88%86%E5%B1%8F%E8%AF%BE%E4%BB%B6%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/399008/%E4%B8%89%E5%88%86%E5%B1%8F%E8%AF%BE%E4%BB%B6%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function startPlay(chapter_n) {
    var $chapter = $(".chapter").eq(chapter_n);
    var id = $chapter.attr('data-id');
    var href = $chapter.attr('data-href');
    var assertType = $chapter.attr('data-assert-type');

    $('#course .chapter').removeClass('active');
    $chapter.addClass('active');

    window.global.player.pause();
    if ('link' === assertType) {
        $("#course").css("top", "2px");
        $('#chapter-iframe').attr('src', href);
    } else if ('video-sync' === assertType) {
        Chapter.load(id, href, function (chapter) {
            $("#course").css("top", "198px");
            var timerId = setInterval(function () {
                if (window.global.player) {
                    clearInterval(timerId);
                    if (chapter.mp4) {
                        window.global.study.startStudy(chapter);
                        window.global.player.loadByUrl(chapter.mp4, chapter.startTime / 1000);
                        window.global.player.play();
                    }
                }
            }, 100);
        });
    }
};
    window.addEventListener('load', (event) => {
        console.log('page is fully loaded');
        setInterval(function () {
            if (window.global.player) {
                var stat = window.global.player.getStatus();
                console.log(stat);
                if (stat == "ended") {
                    var active_chapter = 0;
                    var chapters = $(".chapter");
                    for (var i = 0; i < chapters.length; i++) {
                        if (chapters.eq(i).get(0).attributes["class"].value == "chapter active") {
                            active_chapter = i + 1;
                            break;
                        }
                    }
                    console.log(active_chapter);
                    startPlay(active_chapter);
                }}
        },5000)});

})();