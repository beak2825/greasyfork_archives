// ==UserScript==
// @name          Export Youtube Playlist in tab delimited text
// @description   Creates the current playlist as tab delimited text to be easily copied
// @author        1N07 & MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://*.youtube.com/*
// @match         *://*.youtu.be/*
// @icon          https://cdn.icon-icons.com/icons2/1488/PNG/512/5295-youtube-i_102568.png
// @version       2.1.5
// @license       MIT
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/418605/Export%20Youtube%20Playlist%20in%20tab%20delimited%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/418605/Export%20Youtube%20Playlist%20in%20tab%20delimited%20text.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //Workaround: This document requires 'TrustedHTML' assignment
  if (window.trustedTypes && trustedTypes.createPolicy) {
    if (!trustedTypes.defaultPolicy) {
      const passThroughFn = (x) => x;
      trustedTypes.createPolicy('default', {
        createHTML: passThroughFn,
        createScriptURL: passThroughFn,
        createScript: passThroughFn,
      });
    }
  }

  var listCreationAllowed = true;
  var urlAtLastCheck = "";
  setInterval(function() {
    if (urlAtLastCheck != window.location.href) {
      urlAtLastCheck = window.location.href;
      if (urlAtLastCheck.includes("/playlist?list=")) InsertButtonASAP();
    }
  }, 100);

  function InsertButtonASAP() {
    var qRes = document.querySelectorAll("#exportTabTextList"); //Remove previous button
    for (let i = 0; i < qRes.length; i++) {
      qRes[i].remove();
    }

    let buttonInsertInterval = setInterval(function() {
      var htmlButton = "";

      if (document.querySelectorAll("#exportTabTextList").length == 0) {

        if (document.querySelectorAll("yt-page-header-renderer:not([hidden]) yt-page-header-view-model yt-flexible-actions-view-model").length > 0) { //New design
          qRes = document.querySelectorAll("yt-page-header-renderer:not([hidden]) yt-page-header-view-model yt-flexible-actions-view-model > div.ytFlexibleActionsViewModelActionRow");
          if (qRes != null && qRes.length > 0) {
            htmlButton = "<button id='exportTabTextList' class='yt-spec-button-shape-next--size-m' style='font-family: Roboto, Arial, sans-serif; font-size: 13px; margin-top: 8px; margin-bottom: 16px; padding-top: 2px; border: none; height: 28px; line-height: normal; opacity: 0.8;'>Export list as tab delimited text</button>";
            qRes[0].insertAdjacentHTML("afterend", htmlButton);
          }
          qRes = document.querySelectorAll("#exportTabTextList");
          if (qRes != null && qRes.length > 0) {
            qRes[0].onclick = ScrollUntilFullListVisible;
          }

        } else if (document.querySelectorAll("ytd-playlist-header-renderer:not([hidden]) div.ytd-playlist-header-renderer > div.play-menu.ytd-playlist-header-renderer").length > 0) { //Older new design
          qRes = document.querySelectorAll("div.metadata-wrapper.ytd-playlist-header-renderer > div.play-menu.ytd-playlist-header-renderer");
          if (qRes != null && qRes.length > 0) {
            htmlButton = "<button id='exportTabTextList' class='yt-spec-button-shape-next--size-m' style='font-family: Roboto, Arial, sans-serif; font-size: 13px; margin-top: 8px; margin-bottom: 16px; padding-top: 2px; border: none; height: 28px; line-height: normal; opacity: 0.8;'>Export list as tab delimited text</button>";
            qRes[0].insertAdjacentHTML("afterend", htmlButton);
          }
          qRes = document.querySelectorAll("#exportTabTextList");
          if (qRes != null && qRes.length > 0) {
            qRes[0].onclick = ScrollUntilFullListVisible;
          }

        } else if (document.querySelectorAll("ytd-two-column-browse-results-renderer:not([hidden])[page-subtype='playlist'] div#contents div#header > ytd-sort-filter-header-renderer #filter-menu").length > 0) { //Workaround for very new design - add button above user created playlists
          qRes = document.querySelectorAll("ytd-two-column-browse-results-renderer:not([hidden])[page-subtype='playlist'] div#contents div#header > ytd-sort-filter-header-renderer #filter-menu");
          if (qRes != null && qRes.length > 0) {
            htmlButton = "<button id='exportTabTextList' class='yt-spec-button-shape-next--size-m' style='font-family: Roboto, Arial, sans-serif; font-size: 13px; margin: auto 0 auto 25px; border: none; height: 28px; line-height: normal; opacity: 0.95;'>Export list as tab delimited text</button>";
            qRes[0].insertAdjacentHTML("afterend", htmlButton);
          }
          qRes = document.querySelectorAll("#exportTabTextList");
          if (qRes != null && qRes.length > 0) {
            qRes[0].onclick = ScrollUntilFullListVisible;
          }

        } else if (document.querySelectorAll("ytd-two-column-browse-results-renderer:not([hidden])[page-subtype='playlist'] div#contents div#header").length > 0) { //Workaround for very new design - add button above non-user created playlists
          qRes = document.querySelectorAll("ytd-two-column-browse-results-renderer:not([hidden])[page-subtype='playlist'] div#contents div#header");
          if (qRes != null && qRes.length > 0) {
            htmlButton = "<div id='exportTabTextListContainer' style='margin-left: -50px;margin-bottom: 20px;'><button id='exportTabTextList' class='yt-spec-button-shape-next--size-m' style='font-family: Roboto, Arial, sans-serif; font-size: 13px; margin: auto 0 auto 25px; border: none; height: 28px; line-height: normal; opacity: 0.95;'>Export list as tab delimited text</button></div>";
            qRes[0].insertAdjacentHTML("afterend", htmlButton);
          }
          qRes = document.querySelectorAll("#exportTabTextList");
          if (qRes != null && qRes.length > 0) {
            qRes[0].onclick = ScrollUntilFullListVisible;
          }

      } else if (document.querySelectorAll("ytd-playlist-sidebar-renderer:not([hidden]) > ytd-playlist-sidebar-primary-info-renderer.style-scope.ytd-playlist-sidebar-renderer").length > 0) { //Old design
          qRes = document.querySelectorAll("ytd-playlist-sidebar-primary-info-renderer.style-scope.ytd-playlist-sidebar-renderer");
          if (qRes != null && qRes.length > 0) {
            htmlButton = "<button id='exportTabTextList' style='font-family: Roboto, Arial, sans-serif; font-size: 13px; margin: 10px 0px;'>Export list as tab delimited text</button>";
            qRes[0].insertAdjacentHTML("afterend", htmlButton);
          }
          qRes = document.querySelectorAll("#exportTabTextList");
          if (qRes != null && qRes.length > 0) {
            qRes[0].onclick = ScrollUntilFullListVisible;
          }
        }

        //Check whether unavailable videos are hidden or not
        //var i;
        //var strAux = "";
        //var flgHidden = false;
        //var myNodeList = document.querySelectorAll("#text");
        //for (i = 0; i < myNodeList.length; i++) {
        //  if (myNodeList[i].className.indexOf("style-scope ytd-alert-with-button-renderer") > -1) {
        //    strAux = myNodeList[i].innerText;
        //    strAux = strAux.trim();
        //    strAux = strAux.toLowerCase();
        //    if (strAux.indexOf("unavailable videos are hidden") > -1) {
        //      flgHidden = true;
        //      break;
        //    }
        //  }
        //}
        //if (flgHidden) {
        //  $("#exportTabTextList").click(ScrollAsPossible); //Unavailable videos are hidden
        //} else {
          //$("#exportTabTextList").click(ScrollUntilFullListVisible);
        //}
        //clearInterval(buttonInsertInterval); - Do not clear interval in order to add button back if playlist is rebuilt
      }
    }, 100);
  }

  function ScrollUntilFullListVisible() {
    if (!listCreationAllowed) return;

    //Switch focus to playlist
    var listOfVideos = document.querySelector("ytd-browse[page-subtype='playlist'] #primary");
    if (listOfVideos != null) {
      listOfVideos.click();

      var htmlAlert = "";
      listCreationAllowed = false;
      var qRes = document.querySelectorAll("#exportTabTextList:not(.yt-spec-button-shape-next--size-m)");
      if (qRes != null && qRes.length > 0) {
        htmlAlert = `<p id="listBuildMessage" style="color: red; font-size: 1.33em;">Getting full list, please wait...</p>`;
        qRes[0].insertAdjacentHTML("afterend", htmlAlert);
      }
      qRes = document.querySelectorAll("#exportTabTextList.yt-spec-button-shape-next--size-m");
      if (qRes != null && qRes.length > 0) {
        htmlAlert = `<p id="listBuildMessage" style="color: red; font-size: 1.33em; margin-bottom: 16px; mix-blend-mode: lighten;">Getting full list, please wait...</p>`;
        qRes[0].insertAdjacentHTML("afterend", htmlAlert);
      }

      let scrollInterval = setInterval(function(){
        if (document.querySelectorAll("ytd-continuation-item-renderer.ytd-playlist-video-list-renderer").length > 0) {
          //$(document).scrollTop($(document).height());
          document.documentElement.scrollTop = document.documentElement.scrollHeight;
        } else {
          BuildAndDisplayList();
          clearInterval(scrollInterval);
        }
      }, 100);
    }
  }

  /*function ScrollAsPossible() { //If unavailable videos are hidden
    if (!listCreationAllowed) return;

    listCreationAllowed = false;
    $("#exportTabTextList").after(`<p id="listBuildMessage" style="color: red; font-size: 1.33em;">Getting full list, please wait...</p>`);
    $(document).scrollTop($(document).height());
    let scrollInterval2 = setInterval(function(){
      if (CheckSpinner()) {
        $(document).scrollTop($(document).height());
      } else {
        BuildAndDisplayList();
        clearInterval(scrollInterval2);
      }
    }, 500);
  }

  function CheckSpinner() { //True if playlist is still loading
    var i;
    var myNodeList = document.querySelectorAll("#spinner");
    for (i = 0; i < myNodeList.length; i++) {
      if (myNodeList[i].className.indexOf("style-scope ytd-continuation-item-renderer") > -1) return true;
    }
    return false;
  }*/

  function BuildAndDisplayList() {

    var htmlList = "<Name>\t<Channel>\t<Duration>\t<URL>";
    var myNodeList = document.querySelectorAll("ytd-playlist-video-renderer.style-scope.ytd-playlist-video-list-renderer:not([hidden])");
    //var myNodeList = document.getElementsByTagName("ytd-playlist-video-renderer");
    var i;
    var myCount = 0;
    for (i = 0; i < myNodeList.length; i++) {
      //if (myNodeList[i].className.indexOf("style-scope ytd-playlist-video-list-renderer") > -1) {
        var mySpanList = myNodeList[i].querySelectorAll("span");
        var myAList = myNodeList[i].querySelectorAll("a");
        var j;
        var strAux = "";
        var strAux2 = "";
        myCount++;
        for (j = 0; j < myAList.length; j++) {
          if (myAList[j].id == "video-title") {
            strAux = myAList[j].innerText; //Video title
            strAux = strAux.replace(/[\x0D\x0A]/g, " ");
            htmlList += "\n" + strAux.trim();
            strAux2 = myAList[j].href; //Video URL
            strAux2 = strAux2.replace(/&list=.*&index=\d+/gi, ""); //Remove reference to list and video's index
            strAux2 = strAux2.replace(/&t=.*$/gi, ""); //Remove timestamp
            strAux2 = strAux2.replace(/&pp=.*$/gi, ""); //Remove pp parameter
          }
        }
        htmlList += "\t";
        for (j = 0; j < myAList.length; j++) {
          if (myAList[j].className == "yt-simple-endpoint style-scope yt-formatted-string") {
            strAux = myAList[j].innerText; //Channel name
            strAux = strAux.replace(/[\x0D\x0A]/g, " ");
            htmlList += strAux.trim();
          }
        }
        htmlList += "\t ";
        for (j = 0; j < mySpanList.length; j++) {
          if (mySpanList[j].className == "style-scope ytd-thumbnail-overlay-time-status-renderer") {
            strAux = mySpanList[j].innerText; //Duration
            strAux = strAux.replace(/[\x0D\x0A]/g, " ");
            htmlList += strAux.trim();
          }
        }
        htmlList += "\t" + strAux2.trim(); //Video URL is the last column
      //}
    }

    var qRes = document.querySelectorAll("body");
    if (qRes != null && qRes.length > 0) {
      htmlList = '<div id="tablistDisplayContainer" style="position: fixed; z-index: 9999; top: 5%; right: 5%; background-color: gray; padding: 10px; border-radius: 5px;"><button id="selectAllAndCopyButton" style="font-family: Roboto, Arial, sans-serif; font-size: 13px;">Select all and copy</button>&nbsp;&nbsp;&nbsp;<button id="closeListButton" style="font-family: Roboto, Arial, sans-serif; font-size: 13px;">Close</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-family: Roboto, Arial, sans-serif; font-size: 13px; font-weight: bold; color: white">Total videos in list: '+myCount+'</span><br><br><textarea id="tabPlayList" style="width: 50vw; height: 80vh; max-width: 90vw; max-height: 90vh;">'+htmlList+'</textarea></div>';
      qRes[0].insertAdjacentHTML("afterend", htmlList);
    }

    qRes = document.querySelector("#listBuildMessage");
    if (qRes != null) qRes.remove();

    qRes = document.querySelector("#closeListButton");
    if (qRes != null) {
      qRes.onclick = function() {
        qRes = document.querySelector("#tablistDisplayContainer");
        if (qRes != null) qRes.remove();
        listCreationAllowed = true;
      }
    }

    qRes = document.querySelector("#selectAllAndCopyButton");
    if (qRes != null) {
      qRes.onclick = function() {
        document.getElementById("tabPlayList").select();
        document.execCommand("copy");
      }
    }
  }

}) ();
