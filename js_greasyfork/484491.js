// ==UserScript==
// @name         Bandcamp Downloader
// @namespace    https://greasyfork.org/users/1142347
// @author       Caassiiee
// @license      GPL-3.0-only
// @version      1.0
// @description  Adds a sidebar to download songs from Bandcamp.
// @include      *://*.bandcamp.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/484491/Bandcamp%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/484491/Bandcamp%20Downloader.meta.js
// ==/UserScript==

// Register Globals
var sidebar_visible = false;
var tracklist = TralbumData.trackinfo;

(function () {
  "use strict";

  // Sidebar construction
  $("body")
    .append(
      $("<div/>")
        .addClass("dl-sidebar-container dl-sidebar dl-color-1 hidden")
        .append(
          $("<p/>").text(
            "Click the files to download, or use the download album button."
          )
        )
        .append($("<ol/>").addClass("dl-tracklist"))
        .append(
          $("<div/>")
            .addClass("dl-all-button dl-progress dl-color-2")
            .append($("<div/>").addClass("dl-progress-bar"))
            .append(
              $("<div/>").addClass("dl-progress-text").text("Download Album")
            )
        )
    )
    .append(
      $("<div/>")
        .addClass("dl-sidebar-toggle dl-sidebar dl-color-1 hidden")
        .text("Bandcamp Downloader")
    );

  tracklist.forEach((track) => {
    $(".dl-tracklist").append(
      $("<li/>")
        .attr("id", "track-" + track.track_num)
        .append(
          $("<a/>")
            .addClass("dl-link custom-color")
            .attr("data-url", track.file["mp3-128"])
            .attr("data-trackid", tracklist.indexOf(track))
            .text(track.title)
        )
    );
  });

  // Style sidebar to match page
  GM_addStyle(
    ".dl-sidebar-toggle{font-family:biolinum;left:0;top:50px;position:fixed;transform:rotate(90deg);transform-origin:left bottom 0;border-top-right-radius:5px;border-top-left-radius:5px;margin:0;padding:5px;z-index:5001;background:inherit;border:1px solid #000000;border-bottom:none;cursor:pointer}.dl-sidebar-toggle.active{left:400px}.dl-sidebar-container{width:390px;min-height:300px;left:-400px;top:50px;max-height:500px;overflow-y:scroll;padding:5px;position:fixed;z-index:5000;border:1px solid #000000;border-left:none;user-select:none;cursor:default}.dl-sidebar-container.active{left:0}.dl-all-button{margin-left:0;margin-right:0;cursor:pointer;background-color:rgb(255, 255, 255);color:rgb(0, 0, 0);border-color:rgb(0, 0, 0)}.dl-progress{position:relative;z-index:5001}.dl-progress,.dl-progress-bar,.dl-progress-text{height:25px;left:0;right:0;top:0;bottom:0}.dl-progress-bar{width:0;overflow:hidden;z-index:5002;-moz-transition:width 0.2s linear;-webkit-transition:width 0.2s linear;-o-transition:width 0.2s linear;transition:width 0.2s linear;background-color:rgb(0, 0, 0)}.dl-progress-text{text-align:center;z-index:5003;position:absolute;line-height:25px;color:inherit}.dl-sidebar{opacity:1;transition:opacity 1s, left 0.5s}.dl-sidebar.hidden{opacity:0}.dl-sidebar::-webkit-scrollbar{width:10px}.dl-sidebar::-webkit-scrollbar-track{background:rgb(0, 0, 0)}.dl-sidebar::-webkit-scrollbar-thumb{background:rgb(255, 255, 255)}"
  );

  $(".dl-color-1").css({
    "background-color": $("#pgBd").css("background-color"),
    color: $("#pgBd").css("color"),
    "border-color": $("#pgBd").css("color"),
  });
  $(".dl-color-2").css({
    "background-color": $("#follow-unfollow").css("background-color"),
    color: $("#follow-unfollow").css("color"),
    "border-color": $("#follow-unfollow").css("border-color"),
  });
  $(".dl-progress-bar").css({
    "background-color": $("#pgFt").css("background-color"),
  });

  $(".dl-sidebar").removeClass("hidden");

  // Handle events
  $(".dl-sidebar-toggle").click((e) => {
    $(".dl-sidebar").toggleClass("active");
  });

  $(".dl-link").click((e) => {
    GM_download(
      $(e.target).attr("data-url"),
      `[${pad(tracklist[$(e.target).attr("data-trackid")].track_num, 2)}] ${
        TralbumData.artist
      } - ${tracklist[$(e.target).attr("data-trackid")].title}.mp3`
    );
  });

  $(".dl-all-button").click((e) => {
    downloadAlbum();
  });

  // Main functions
  function downloadAlbum() {
    // Emergency polyfill
    var Promise = window.Promise;
    if (!Promise) {
      Promise = JSZip.external.Promise;
    }

    // Fetch binary data using GM_xmlhttprequest
    function urlToPromise(url) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          responseType: "arraybuffer",
          onload: (response) => {
            resolve(response.response);
          },
          onerror: (response) => {
            reject(response.response);
          },
        });
      });
    }

    var zip = new JSZip();

    tracklist.forEach((track) => {
      zip.file(
        `[${track.track_num}] ${TralbumData.artist} - ${track.title}.mp3`,
        urlToPromise(track.file["mp3-128"]),
        { binary: true }
      );
    });

    zip
      .generateAsync({ type: "blob" }, (metadata) => {
        $(".dl-progress-bar").css("width", `${metadata.percent}%`);
      })
      .then(
        (blob) => {
          GM_download(
            URL.createObjectURL(blob),
            `${BandData.name} - ${TralbumData.current.title}.zip`
          );
        },
        (e) => {
          console.error(e);
        }
      );
  }

  // Supporting functions
  function pad(n, width = 3, z = 0) {
    return (String(z).repeat(width) + String(n)).slice(String(n).length);
  }
})();
