// ==UserScript==
// @name         Add Youtube Player to Udemy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a youtube player that play the video you like to Udemy
// @author       Flejta
// @include https://www.udemy.com/course/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465092/Add%20Youtube%20Player%20to%20Udemy.user.js
// @updateURL https://update.greasyfork.org/scripts/465092/Add%20Youtube%20Player%20to%20Udemy.meta.js
// ==/UserScript==
//converti stringhe in stringhe Javascript
// https://accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/

//let idElementoDaSostituire = "footer-block";
let player;
let elemento;
setTimeout(function () {
    addMusic();
}, 10000);

function addMusic() {
    //carico libreria
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
    document.body.appendChild(script);
    //codice da embeddare per form
    var youtube_embed = "";
    youtube_embed += "<label for=\"video_url\">Inserisci URL del video YouTube:<\/label>";
    youtube_embed += "	<input type=\"text\" id=\"video_url\" name=\"video_url\">";
    youtube_embed += "	<button onclick=\"embedVideo()\" id=\"myPlayMusic\">Incorpora video<\/button>";
    youtube_embed += "	<div id=\"player\"><\/div>";
    youtube_embed += "";
    //embeddo playlist
    let playlist_embed = "<iframe  id=\"playlistEmbed\" width=\"100%\" height=\"600\" src=\"https:\/\/www.youtube.com\/embed\/videoseried?list=PLbT100LpUNeRTf5hr5fjPaJb2QSH-ldf6&shuffle=1\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen><\/iframe><div id=\"embedYoutube\"></div>";
    elemento = document.getElementsByClassName("ud-footer")[0];;
    elemento.innerHTML = playlist_embed;
    //embeddo form per youtube
    let elementoPlaylist = document.getElementById("embedYoutube");
    elementoPlaylist.innerHTML = youtube_embed;
    var button = document.getElementById("myPlayMusic");
    button.addEventListener("click", function (click) {
        embedVideo();
    });
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
