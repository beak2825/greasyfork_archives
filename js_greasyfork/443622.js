// ==UserScript==
// @name         reRedirector
// @namespace    https://tribbe.de
// @version      1.0.0
// @description  Redirect streaming links directly to source
// @author       Tribbe (rePublic Studios)
// @license      MIT
//
// @include      *://*voe*
//
// @include      *streamtape.*/get_video?*
// @include      *streamtape.*/e/*
// @include      *strcloud.*
// @include      *tapecontent.*
// @include      *strtape.*
// @include      *strtpe.*
// @include      *stape.*
// @include      *adblockstrtech.*
//
// @include      *vidoza.net*
//
// @include      *://streamz.ws*
// @include      *://streamzz.to*
//
// @include      *://evoload*
// @downloadURL https://update.greasyfork.org/scripts/443622/reRedirector.user.js
// @updateURL https://update.greasyfork.org/scripts/443622/reRedirector.meta.js
// ==/UserScript==

window.addEventListener("load", doSearch);

async function doSearch() {
  var checkIsVideoNode = await document.querySelectorAll(
    "body>video[data-better-html5-video-type]>source[type*='video/mp4'][src]"
  );
  if (checkIsVideoNode == null || checkIsVideoNode.length == 0) {
    var content = document.body.textContent;
    var video = null;
    var videoNode = null;

    //VOE
    if (document.location.hostname.includes("voe")) {
      var mp4finder = null;
      mp4finder = content.match(/(https?.*?\.mp4)/);
      if (mp4finder != null) video = mp4finder[0];

      if (video == null) {
        mp4finder = content.match(/sources\[\"mp4\"\] = .*?\(\[(.*?)]\);/);
        if (mp4finder != null && mp4finder.length == 2) {
          var mp4array = mp4finder[1].replaceAll("'", "").split(",");
          var p01 = mp4array.join("").split("").reverse().join("");
          video = atob(p01);
        }
      }
    }

    //Streamtape
    if (
      document.location.hostname.includes("streamtape") ||
      document.location.hostname.includes("str") ||
      document.location.hostname.includes("tapecontent") ||
      document.location.hostname.includes("stape") ||
      document.location.hostname.includes("adblockstrtech")
    ) {
      videoNode = await document.querySelectorAll("div[id*='link']");
      var bFound = false;
      for (const link of Object.values(videoNode)) {
        var url = "https:" + link.textContent;
        if (
          !bFound &&
          url.includes(document.location.hostname + "/get_video?id=")
        ) {
          bFound = true;
          video = url;
        }
      }
    }

    //Vidoza
    if (document.location.hostname.includes("vidoza.net")) {
      videoNode = await document.querySelectorAll(
        "video[id*='player_html5_api'][class*='vjs-tech']>source[type*='video/mp4'][src]"
      );
      if (videoNode.length > 0) {
        video = videoNode[0].getAttribute("src");
      }
    }

    //StreamZ
    if (
      document.location.hostname.includes("streamz.ws") ||
      document.location.hostname.includes("streamzz.to")
    ) {
      videoNode = await document.querySelectorAll(
        "video[id*='video_1_html5_api']"
      );
      if (videoNode.length > 0) {
        video = videoNode[0].getAttribute("src");
      }
    }

    //Evoload
    if (document.location.hostname.includes("evoload")) {
      videoNode = await document.querySelectorAll(
        "video[id*='EvoVid_html5_api']"
      );
      if (videoNode.length > 0) {
        video = videoNode[0].getAttribute("src");
      }
    }

    if (video != null) window.location.href = video;
    else {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await doSearch();
    }
    return;
  }

  //disable autoplay
  checkIsVideoNode[0].parentNode.autoplay = false;
}
