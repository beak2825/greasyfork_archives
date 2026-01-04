// ==UserScript==
// @name         FFRC
// @namespace    https://unknown.gg
// @version     0.2
// @description  Response CollectorのビデオをYoutubeで見る
// @author       Unknown
// @match        http*://kosen.lecture.ss.cs.tut.ac.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413187/FFRC.user.js
// @updateURL https://update.greasyfork.org/scripts/413187/FFRC.meta.js
// ==/UserScript==

var last_opened_url = null;
var is_opened = false;

function searchYoutubePlayer(){
    let youtube_player = document.getElementsByTagName("youtube-player");
    if(youtube_player.length <= 0) return null;
    return youtube_player[0];
}


function getYoutubeLinkFromPlayer(player){
    let iframe = player.getElementsByTagName("iframe");
    if(iframe.length <= 0) return null;

    let link = iframe[0].src;
    return link;
}


function convertEmbedLinkToViewLink(link){
    try{
        link = link.replace("https://", "");
        link = link.replace("http://", "");
        let youtube_id = link.split("?")[0].split("/")[2];

        return "https://youtube.com/watch?v=" + youtube_id;
    }
    catch(e){
        return null;
    }
}


function openYoutube(){

    let youtube_player = searchYoutubePlayer();
    if(youtube_player == null) return;

    let youtube_embed_link = getYoutubeLinkFromPlayer(youtube_player);
    if(youtube_embed_link == null) return;

    let youtube_view_link = convertEmbedLinkToViewLink(youtube_embed_link);
    if(youtube_view_link == null) return;

    if(!is_opened){
        if(location.href != last_opened_url){
            window.open(youtube_view_link);
            last_opened_url = location.href;
            is_opened = true;
        }
    }else{
        if(location.href != last_opened_url){
            is_opened = false;
        }
    }
}


(function() {
    setInterval(openYoutube, 1000);
    //if(window.opener != null){
        //setInterval(openYoutube, 1000);
    //}else{
        //window.open(location.href);
        //document.body.innerHTML = "<p style='text-align: center; font-size: 500%; color: red;'>このページは閉じてください。</p>";
    //}
})();