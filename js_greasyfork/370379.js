// ==UserScript==
// @name         AntiAdcheck
// @namespace    https://github.com/Fenion/AntiOgonek
// @version      3.6
// @description  Имитация показа рекламы(и небольшой бонус)
// @author       Fenion
// @match        https://anime.anidub.life/*
// @match        https://online.anidub.com/*
// @match        https://*.loveanime.live/*
// @grant        unsafeWindow
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/370379/AntiAdcheck.user.js
// @updateURL https://update.greasyfork.org/scripts/370379/AntiAdcheck.meta.js
// ==/UserScript==


$(function () {
    const w = unsafeWindow || window;
    w.adcheck = () => {
        console.log('AntiAdcheck triggered.');
        return true;
    };
    w.adblock = false;
    if(typeof w.video !== "undefined" && typeof w.hls !== "undefined") {
        let isPrem = false;
        const usePremServer = () => {
            w.video.pause();
            w.currentTime = w.video.currentTime;
            if(isPrem) {
                w.videoUrl = $("video").children().attr("src").replace("prem.php", "video.php");
                w.video.children[0].setAttribute("src", w.videoUrl);
                console.log("AntiAdcheck: Переходим на обычный сервер.");
                $(".fa-crown").css({color: "white"});
                $(".anti_adcheck_tooltip").text("Перейти на премиум сервер");
                isPrem = false;
            } else {
                w.videoUrl = $("video").children().attr("src").replace("video.php", "prem.php");
                w.video.children[0].setAttribute("src", w.videoUrl);
                console.log("AntiAdcheck: Переходим на премиум сервер.");
                $(".fa-crown").css({color: "gold"});
                $(".anti_adcheck_tooltip").text("Перейти на обычный сервер");
                isPrem = true;
            }
            w.hls.detachMedia();
            w.hls.loadSource(w.videoUrl);
            w.hls.attachMedia(w.video);
            w.hls.startLoad(w.currentTime);
            console.log("Текущая позиция: " + w.currentTime)
            w.video.load();
            w.video.addEventListener('canplay', () => {
                w.video.play();
                console.log("AntiAdcheck: Успешная смена сервера.")
                w.video.removeEventListener('canplay', () => {});
            });
            if(w.p2p){
                w.p2p.destroy()
                w.p2pml.hlsjs.initHlsJsPlayer(hls);
                w.p2p.loader.settings.simultaneousHttpDownloads=2;
            }
        };
        let fa = document.createElement("script");
        fa.src = "https://use.fontawesome.com/releases/v5.14.0/js/all.js";
        $("body").append(fa);
        let premBtn = document.createElement("button");
        premBtn.className = "toggle-prem-server plyr__controls__item plyr__control";
        premBtn.onclick = usePremServer;
        premBtn.innerHTML = '<i class="fas fa-crown"></i><span class="label--not-pressed plyr__tooltip anti_adcheck_tooltip">Перейти на премиум сервер</span>';
        $(".plyr__controls").append(premBtn);
    }
});
