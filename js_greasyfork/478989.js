// ==UserScript==
// @name         NHKオンデマンド 動画コントロール
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  NHK ON DEMAND(NHKオンデマンド)の動画プレイヤーにコントローラーを付けます。
// @author       Machaking
// @match        https://www.nhk-ondemand.jp/goods/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.nhk-ondemand.jp
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/478989/NHK%E3%82%AA%E3%83%B3%E3%83%87%E3%83%9E%E3%83%B3%E3%83%89%20%E5%8B%95%E7%94%BB%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/478989/NHK%E3%82%AA%E3%83%B3%E3%83%87%E3%83%9E%E3%83%B3%E3%83%89%20%E5%8B%95%E7%94%BB%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;

    $('#moviePlayer .movieContent').after('<div class="movieControl pause"><div>');
    $(".movieControl").append('<button id="btn_back_2"><img src="https://fukutti-webcraft.designers.jp/other/gobackward-60.svg">戻る</button>',
                                   '<button id="btn_back"><img src="https://fukutti-webcraft.designers.jp/other/gobackward-10.svg">戻る</button>',
                                   '<button id="btn_play"><img class="img_play" src="https://fukutti-webcraft.designers.jp/other/play-circle.svg"><img class="img_pause" src="https://fukutti-webcraft.designers.jp/other/pause-circle.svg">再生</button>',
                                   '<button id="btn_forward"><img src="https://fukutti-webcraft.designers.jp/other/goforward-10.svg">進む</button>',
                                   '<button id="btn_forward_2"><img src="https://fukutti-webcraft.designers.jp/other/goforward-60.svg">進む</button>',
                                   '<style>.HLS-Player.player--start .player__progress { bottom: 0; width: 56.2%; right: 0; left: 0; margin: auto;}.HLS-Player.player--start img {margin:auto; display:block;}.play .img_play, .pause .img_pause{display:none;}#btn_play {margin: auto 15px;}div#moviePlayer .inner-wide .movieContent {  float: none;}.HLS-Player {  width: 100%;  height: auto;}.HLS-Player .player__video {  position: static;}div#moviePlayer .inner-wide .side {  margin-left: 0;}div#moviePlayer {    position: relative;    background: #191919;}div#moviePlayer .nextmovie {    width: fit-content;}.movieControl {    display: flex;    justify-content: center;    padding: 0.5rem;    gap: 0.5rem;}.movieControl button {    padding: 0.4rem 0.8rem;    cursor: pointer;    border-radius: 5px;    border: none;    display: flex;    align-items: center;    font-size: 0.7rem;}.movieControl button img {    max-width: 30px;    margin-right: 3px;}#btn_pause {    margin-right: 15px;}</style>');

    function noscroll(e){
        e.preventDefault();
    }

    function toggleClass(){
        $(".movieControl").toggleClass("pause play");
    }

    $(".movieContent").on({
        "mouseenter": function() {
            $(this).addClass("hover");
            $(".player__controls").addClass("hover");
            document.addEventListener('touchmove', noscroll, {passive: false});
            document.addEventListener('wheel', noscroll, {passive: false});
        },
        "mouseleave": function() {
            $(this).removeClass("hover");
            $(".player__controls").removeClass("hover");
            document.removeEventListener('touchmove', noscroll);
            document.removeEventListener('wheel', noscroll);
        }
    });

    var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    $(document).on(mousewheelevent,function(e){
        e.preventDefault();
        var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
        var volumeProg = $(".player__volume--display").val();
        var videoElementHover = $(".hover .player__video")[0];
        var volumeHover = $(".hover .player__volume--display, .hover .player__volume--input");

        if (delta < 0){
            // マウスホイールを下にスクロールしたときの処理を記載
            videoElementHover.volume -= 0.03;
            volumeHover.val(volumeProg -= 3);
        } else {
            // マウスホイールを上にスクロールしたときの処理を記載
            videoElementHover.volume += 0.03;
            volumeHover.val(volumeProg += 3);
        }
    });

    document.addEventListener('keydown', function (e) {
        const videoElement = $(".player__video")[0];

        if (e.code == 'KeyW' || e.code == 'ArrowUp') {
            videoElement.volume += 0.05;
        } else if (e.code == 'KeyS' || e.code == 'ArrowDown') {
            videoElement.volume -= 0.05;
        } else if (e.code == 'KeyA' || e.code == 'ArrowLeft') {
            videoElement.currentTime -= 10;
        } else if (e.code == 'KeyD' || e.code == 'ArrowRight') {
            videoElement.currentTime += 10;
        } else if (e.code == 'Space') {
            toggleClass();
        }
    });

    $(document).on('click', function (e) {
        const videoElement = $(".player__video")[0];
        const btn_play = $("#btn_play");
        const btn_back = $("#btn_back");
        const btn_forward = $("#btn_forward");
        const btn_back_2 = $("#btn_back_2");
        const btn_forward_2 = $("#btn_forward_2");
        const start_img = $(".HLS-Player.player--start > img:nth-child(2)");

        if (btn_play[0].contains(e.target)) {
            if ($(".HLS-Player.player--start")){
                $(".HLS-Player.player--start img").trigger("click");
            }

            toggleClass();

            if (videoElement.paused) {
                videoElement.play();
            } else {
                videoElement.pause();
            }
        } else if (btn_back[0].contains(e.target)) {
            videoElement.currentTime -= 10;
        } else if (btn_forward[0].contains(e.target)) {
            videoElement.currentTime += 10;
        } else if (btn_back_2[0].contains(e.target)) {
            videoElement.currentTime -= 60;
        } else if (btn_forward_2[0].contains(e.target)) {
            videoElement.currentTime += 60;
        } else if (e.target === videoElement) {
            toggleClass();
        }
    });

    $(function() {
        let mutationObserver = new MutationObserver(function() {
            if ($('.HLS-Player .player__video').length) {
                $(".player__video")[0].volume = 0.05;
                $(".player__volume--display").val(5);
                mutationObserver.disconnect();
            }
        });

        mutationObserver.observe(
            document.getElementById('moviePlayer'),
            {
                childList: true,
                subtree: true
            }
        );
    });
})();