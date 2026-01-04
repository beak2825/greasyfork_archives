// ==UserScript==
// @name         Watch2Gether remove ads & add Music
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  watch2gether ads remove & add Music
// @author       Flejta
// @include https://w2g.tv/*
// @include https://w2g.tv/it/room*
// @include https://www.watch2gether.com/room*
// @include http://w2g.tv/rooms/*
// @include https://w2g.tv/*/rooms/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/451908/Watch2Gether%20remove%20ads%20%20add%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/451908/Watch2Gether%20remove%20ads%20%20add%20Music.meta.js
// ==/UserScript==
//converti stringhe in stringhe Javascript https://accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
//import {IT} from 'https:\/\/www.youtube.com\/iframe_api';
let player;
let elemento;

setTimeout(function () {
    removeBanner();
    addMusic();
}, 10000);

function removeBanner() {
    let stringhe = new Array("w2g-at-right", "aax-w2g-doit-1", "w2g-btf-doit", "w2g-adb-hide w2g-doit", "data-w2g", "w2g-center-doit", "w2g-right-doit");
    let elemento = document.getElementById("w2g-at-right")
    let stringa = "w2g-at-right";
    for (stringa of stringhe) {
        try {
            document.getElementById(stringa).remove();
        } catch (error) {
            //
        }
    }
    stringhe = new Array("ns-kdwz6-l-banner-logo-vanilla ns-kdwz6-v-5", "Iframe", "ns-6ak2w-e-0 x-layout GoogleActiveViewElement", "p-4 w2g-bind-apps w2g-editorial w2g-search-results w2g-until-mobile")
    for (stringa of stringhe) {
        try {
            document.getElementsByClassName(stringa).item(0).remove();
        } catch (error) {
            //
        }
    }

    let elementi = document.getElementsByTagName("div");
    for (elemento of elementi) {
        try {
            if (elemento.innerHTML.includes("layout GoogleActiveViewElement") == true) {
                elemento.remove();
            }
        } catch (error) {
            //
        }
    }
};

function addMusic() {
    var youtube_embed = "";
    youtube_embed += "<label for=\"video_url\">Inserisci URL del video YouTube:<\/label>";
    youtube_embed += "	<input type=\"text\" id=\"video_url\" name=\"video_url\">";
    youtube_embed += "	<button onclick=\"embedVideo()\" id=\"myPlayMusic\">Incorpora video<\/button>";
    youtube_embed += "	<div id=\"player\"><\/div>";
    youtube_embed += "";
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
    document.body.appendChild(script);
    let playlist_embed = "<iframe  id=\"playlistEmbed\" width=\"100%\" height=\"600\" src=\"https:\/\/www.youtube.com\/embed\/videoseried?list=PLbT100LpUNeRTf5hr5fjPaJb2QSH-ldf6&shuffle=1\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen><\/iframe>";
    try {
        let elementi = document.getElementsByTagName("a");
        for (elemento of elementi) {
            if (elemento.innerHTML.includes("Non ti piace la pubblicità? Prova Watch2Gether PLUS!") == true) {
                elemento.innerHTML = playlist_embed;
            }
            if (elemento.innerHTML.includes("You don't like advertising? Try Watch2Gether PLUS!") == true) {
                elemento.innerHTML = playlist_embed;
            }
            var editorialElement = document.querySelector('.w2g-editorial');
            if (editorialElement) {
                editorialElement.innerHTML = playlist_embed;
            }
        }
        var button = document.getElementById("myPlayMusic");
        button.addEventListener("click", function (click) {
            embedVideo();

        });
    } catch (error) {
        //
    }
}
//caricamento video youtube
function embedVideo() {
    try {
        // Ottieni l'URL del video dalla textbox
        var videoUrl = document.getElementById("video_url").value;
        document.getElementById("video_url").value = "";

        // Estrapola l'ID del video dall'URL
        var videoId = ""
        if (videoUrl.includes("list=") == true) {
            caricaPlaylistDaLink (videoUrl);
            return;
        }
        if (videoUrl.includes("youtu.be\/") == true) {
            videoId = videoUrl.split('youtu.be\/')[1];
        } else {
            videoId = videoUrl.split('v=')[1].split('&')[0];
        }
        creaPlayer(videoId);
    } catch (errore) {
        alert(errore);
    }
}
function caricaPlaylistDaLink (video_url) {
    if (video_url.includes("youtube.com/playlist?list")==true) {
        try {//https:\/\/www.youtube.com\/embed\/videoseried?list=PLbT100LpUNeRTf5hr5fjPaJb2QSH
            let url1 = "https:\/\/www.youtube.com\/embed\/videoseried?list=";
            let idPlaylist = video_url.split("list=")[1].split("&")[0];
            video_url= url1+idPlaylist;
        } catch (error) {
            return;
        }
        let playlist_embed1 = "<iframe id=\"playlistEmbed\" width=\"100%\" height=\"600\" src=\"";
        let playlist_embed2 = "\" allowfullscreen><\/iframe>";
        playlist_embed1 = playlist_embed1 + video_url + playlist_embed2;
        elemento = document.getElementById("playlistEmbed");
        elemento.innerHTML = playlist_embed1;
        return;
    }
}
function creaPlayer(videoId){
    if (player!=undefined) {
        player.loadVideoById(videoId);
        return;
        //player.destroy();
    }
    player = new YT.Player('player', {
        height: '360',
        width: '100%',
        videoId: videoId,
        autoplay: true,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // Avvia il video quando il player è pronto
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    // Esegui una funzione quando lo stato del player cambia
    // Ad esempio, potresti interrompere il video quando arriva alla fine
    if (event.data == YT.PlayerState.ENDED) {
        player.stopVideo();
    }
}