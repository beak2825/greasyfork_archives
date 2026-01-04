// ==UserScript==
// @name         MrDeepFakes Download Button and Colored Favourite Button
// @namespace    http://mrdeepfakes.com/
// @version      0.3
// @description  Colors the favorites heart red if added to favorites or added to custom playlist to make it easier to see at-a-glance if you've already saved the video.  Replaces Download button with 9xbuddy download button to allow downloading of videos without tokens.
// @author       nascent
// @match        https://mrdeepfakes.com/*
// @icon         https://www.google.com/s2/favicons?domain=mrdeepfakes.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430169/MrDeepFakes%20Download%20Button%20and%20Colored%20Favourite%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/430169/MrDeepFakes%20Download%20Button%20and%20Colored%20Favourite%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var downloadPlaylistItemAdd, downloadPlaylistItemDel, downloadPlaylistItemsAdd, downloadPlaylistItemsDel, downloadPlaylistAddName, downloadPlaylistDelName;
    var favoritePlaylistItemAdd, favoritePlaylistItemDel;
    var downloadButtonActive, downloadButton;
    var favoriteIco;

    //Get custom playlist elements
    downloadPlaylistItemsDel = document.querySelectorAll("[id^=delete_playlist_]"); //get all custom playlists
    downloadPlaylistItemsAdd = document.querySelectorAll("[id^=add_playlist_]"); //get all custom playlists

    for (var k = 0; k < downloadPlaylistItemsDel.length; k++) {
        if ((downloadPlaylistItemsDel[k].id).length > 16) { //avoid "delete_playlist_"
            downloadPlaylistDelName = downloadPlaylistItemsDel[k].id;
            //alert(downloadPlaylistDelName);
            //alert ((downloadPlaylistItemsDel[k].id).length); //16
            break; //just use first found custom playlist
        }
    }
    for (var l = 0; l < downloadPlaylistItemsAdd.length; l++) {
        if ((downloadPlaylistItemsAdd[l].id).length > 13) { //avoid "add_playlist_"
            downloadPlaylistAddName = downloadPlaylistItemsAdd[l].id;
            //alert(downloadPlaylistAddName);
            //alert ((downloadPlaylistItemsAdd[l].id).length); //13
            break; //just use first found custom playlist
        }
    }

    downloadPlaylistItemDel = document.getElementById(downloadPlaylistDelName);
    downloadPlaylistItemAdd = document.getElementById(downloadPlaylistAddName);
    favoritePlaylistItemDel = document.getElementById("delete_fav_0");
    favoritePlaylistItemAdd = document.getElementById("add_fav_0");

    //get favourite icon element
    favoriteIco = document.getElementsByClassName("ico-favourite")[0];


    //Set favourite icon colour to red if on playlist
    if (downloadPlaylistItemAdd.className =="hidden") {
        //alert("Video already in downloaded playlist");
        favoriteIco.style.color="red";
    }
    /*else if (downloadPlaylistItemDel.className =="hidden") {
        //alert("Video not in downloaded playlist");
        //Do nothing
    }*/

    //Set favourite icon colour to red if in favourites
    if (favoritePlaylistItemAdd.className =="hidden") {
        //alert("Video already in favourite playlist");
        favoriteIco.style.color="red";
    }
    /*else if (favoritePlaylistItemDel.className =="hidden") {
        //alert("Video not in favourite playlist");
        //Do nothing
    }*/

    //Replace download button
    downloadButtonActive = document.getElementsByClassName("toggle-button active");
    for(var i=0; i<downloadButtonActive.length; i++) {

        if (downloadButtonActive[i].getAttribute("href") == "#tab_download" || downloadButtonActive[i].getAttribute("href") == "#download-modal"){
            downloadButtonActive[i].innerHTML = "Download";

            downloadButtonActive[i].setAttribute("href", 'https://9xbud.com/'+ document.location.href);

        }
    }
    downloadButton = document.getElementsByClassName("toggle-button");
    for(i=0; i<downloadButton.length; i++) {
        if (downloadButton[i].getAttribute("href") == "#tab_download" || downloadButton[i].getAttribute("href") == "#download-modal"){
            downloadButton[i].innerHTML = "Download";
            downloadButton[i].setAttribute("href", 'https://9xbud.com/'+ document.location.href);
        }
    }

})();