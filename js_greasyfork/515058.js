// ==UserScript==
// @name         Facebook Videos Detector (Generates ffmpeg download command)
// @name:ar      كاشف فيديوهات فيسبوك (يولد أمر تنزيل ffmpeg)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  This script will help you to list all facebook videos that were loaded during your session
// @description:ar سيساعدك هذا السكربت في عرض جميع فيديوهات فيسبوك التي تم تحميلها خلال جلستك
// @author       Mahmoud Khudairi
// @author:ar    محمود خضيرى
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515058/Facebook%20Videos%20Detector%20%28Generates%20ffmpeg%20download%20command%29.user.js
// @updateURL https://update.greasyfork.org/scripts/515058/Facebook%20Videos%20Detector%20%28Generates%20ffmpeg%20download%20command%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const loaderFunction = function () {
    const videos = document.getElementById("videos");
    const domParser = new DOMParser();
    const contents = JSON.parse(
      document.getElementById("contents").textContent
    );
    const dashURL = new URL(
      "https://www.facebook.com/video/playback/dash_mpd_debug.mpd"
    );
    function getContent(videoId, userInserted = false) {
      const videoEl = document.createElement("div");
      videoEl.className = "video";
      videos.append(videoEl);
      (async function () {
        dashURL.searchParams.set("v", videoId);
        const mpdData = await fetch(dashURL.toString()).then((res) =>
          res.text()
        );
        const mpdDom = domParser.parseFromString(mpdData, "text/xml");
        const sources = Array.from(
          mpdDom.documentElement
            .querySelector('AdaptationSet[contentType="video"], AdaptationSet:has(Representation[mimeType^="video"])')
            ?.querySelectorAll("Representation") || []
        ).map((r) => ({
          id: r.getAttribute("id"),
          width: +r.getAttribute("width"),
          height: +r.getAttribute("height"),
          bitrate: +r.getAttribute("bandwidth"),
          frameRate: r.parentElement
            .getAttribute("frameRate")
            .split("/")
            .reduce((a, c) => a / c),
          url: r.textContent,
          initRange: r.querySelector("Initialization").getAttribute("range"),
          indexRange: r.querySelector("SegmentBase").getAttribute("indexRange"),
          firstSegmentRange: r
            .querySelector("SegmentBase")
            .getAttribute("FBFirstSegmentRange"),
          mimeType: r.getAttribute("mimeType"),
        }));
        const minSource = sources[0];
        if (!minSource) {
          videoEl.remove();

          if (userInserted) alert(`Your requested video: ${videoId} was not found`);

          return;
        }
        const maxSource = sources.at(-1);
        const segmentUrl = new URL(minSource.url);
        segmentUrl.searchParams.set("bytestart", "0");
        segmentUrl.searchParams.set(
          "byteend",
          minSource.firstSegmentRange.split("-")[1]
        );
        const video = document.createElement("video");
        video.src = segmentUrl.toString();
        await new Promise((rs) =>
          video.addEventListener("canplay", rs, { once: 1 })
        );
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = minSource.width;
        canvas.height = minSource.height;
        canvas.style.aspectRatio = `${minSource.width}/${minSource.height}`;
        const bufStart = video.buffered.start(0);
        const bufEnd = video.buffered.end(0);
        const bufDuration = bufEnd - bufStart;
        const randomPosition = bufStart + Math.random() * bufDuration;
        video.currentTime = randomPosition;
        await new Promise((rs) =>
          video.addEventListener("seeked", rs, { once: 1 })
        );
        ctx.drawImage(
          video,
          0,
          0,
          canvas.width,
          canvas.height,
          0,
          0,
          canvas.width,
          canvas.height
        );
        videoEl.append(canvas);
        const maxAudio = Array.from(
          mpdDom.documentElement
            .querySelector('AdaptationSet[contentType="audio"], AdaptationSet:has(Representation[mimeType^="audio"])')
            ?.querySelectorAll("Representation") || []
        )
          .map((r) => ({
            url: r.textContent,
            bitrate: +r.getAttribute("bandwidth"),
          }))
          .at(-1);
        const downloadCommand = ["ffmpeg"];
        downloadCommand.push("-i", `"${maxSource.url}"`);
        if (maxAudio) downloadCommand.push("-i", `"${maxAudio.url}"`);
        downloadCommand.push("-c:v", "h264", "-b:v", maxSource.bitrate);
        if (maxAudio)
          downloadCommand.push("-c:a", "aac", "-b:a", maxAudio.bitrate);
        downloadCommand.push(`${videoId}.mp4`);
        const downloadCommandText = downloadCommand.join(" ");
        videoEl.addEventListener("click", function () {
          navigator.clipboard
            .writeText(downloadCommandText)
            .then(() => alert("Commad copied!"))
            .catch(() => {
              console.log(downloadCommandText);
              alert(
                "Could not copy command, but it was printed in browser's console"
              );
            });
        });
      })();
    }
    for (const content of contents) getContent(content)
    const addbtn = document.getElementById('addbtn');
    addbtn.addEventListener("click", () => {
      const id = prompt('FB Video ID:');
      if (id) getContent(id, true);
    });
  };

  const xml = new window.XMLSerializer();
  const dom = window.document.implementation.createDocument(
    "http://www.w3.org/1999/xhtml",
    "html",
    null
  );

  const head = dom.createElement("head");
  const body = dom.createElement("body");

  const style = dom.createElement("style");
  style.innerHTML = `* {box-sizing: border-box;}
  body {
    font-family: Segoe UI;
    margin: 0 20px;
  }
  #videos {
    display: grid;
    grid-template-columns: repeat(auto-fit, 320px);
    gap: 10px;
    margin-bottom: 20px;
  }
  #videos .video {
    background-color: black;
    height: 180px;
    cursor: pointer
  }
  #videos .video canvas {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }`;
  head.append(style);

  const contents = document.createElement("script");
  contents.id = "contents";
  contents.type = "application/json";
  contents.textContent = "[]";
  head.append(contents);

  const script = document.createElement("script");
  script.src = URL.createObjectURL(
    new Blob(
      [`window.addEventListener("load", ${loaderFunction.toString()});`],
      { type: "application/javascript" }
    )
  );
  head.append(script);

  body.innerHTML =
    '<h1>Facebook Videos Detector</h1><p>Videos found on your facebook session:</p><div id="videos"></div><button id="addbtn">Add new video</button>';
  dom.firstChild.append(head, body);
  const cache = new Set();
  window.addEventListener("keyup", function (e) {
    viewing: if ((e.altKey || (e.ctrlKey && e.shiftKey)) && e.code === "KeyV") {
      e.preventDefault();
      // if (!cache.size) {
      //   this.alert("There is no videos found");
      //   break viewing;
      // }
      contents.textContent = JSON.stringify(Array.from(cache));
      dom.title = `Facebook Videos Detector - (${cache.size} video${cache.size > 1 ? "s" : ""
        } ${cache.size > 1 ? "were" : "was"} found)`;
      this.open(
        URL.createObjectURL(
          new Blob([xml.serializeToString(dom)], { type: dom.contentType })
        ),
        "_blank"
      );
    }
  });

  /* New Approach (React debugging) Version (2.0 - latest) */
  let reactKey = null;
  function fetchVideos() {
    const allVideos = Array.from(document.querySelectorAll("video"));

    for (const video of allVideos) {
      const parent = video.parentNode;

      if (!reactKey) {
        reactKey = Object.keys(parent).find((k) => k.startsWith("__reactProps$"));

        if (!reactKey) continue;
      }

      let props = parent[reactKey];

      if (!props) {
        const newReactKey = Object.keys(parent).find((k) => k.startsWith("__reactProps$"));

        if (!reactKey) continue;

        reactKey = newReactKey;
      }

      props = parent[reactKey];

      const id = props?.children?.props?.videoFBID?.toString() ?? props?.children?.props?.coreVideoPlayerMetaData?.videoFBID?.toString();

      if (id && !cache.has(id)) cache.add(id);
    }
  }

  fetchVideos();
  document.addEventListener('DOMContentLoaded', fetchVideos);
  document.addEventListener("visibilitychange", fetchVideos);
  window.addEventListener('focus', fetchVideos);
  window.addEventListener('blur', fetchVideos);
  window.addEventListener('click', fetchVideos);
  window.addEventListener("scroll", fetchVideos);
  setInterval(fetchVideos, 5000);

  /* Old Approach (Proxifing window.fetch) Version (1.0 - 1.1) */
  window.fetch = new Proxy(window.fetch, {
    async apply(target, arg, args) {
      const url = new URL(args[0]);
      caching: if (
        /\.mp4$/.test(url.pathname.split("/").at(-1)) &&
        url.searchParams.has("efg")
      ) {
        try {
          const efg = JSON.parse(window.atob(url.searchParams.get("efg")));
          const id = efg.video_id.toString();
          if (cache.has(id)) break caching;
          cache.add(id);
        } catch (e) {
          // ignore
        }
      }
      return target.apply(arg, args);
    },
  });
})();
