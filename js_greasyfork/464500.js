// ==UserScript==
// @name         FHD Bilibili Video Downloader
// @name:en      FHD Bilibili Video Downloader
// @name:zh      FHD 哔哩哔哩视频下载器
// @name:ja      FHD Bilibili 動画ダウンローダー
// @name:ko      FHD Bilibili 비디오 다운로더
// @name:ru      Загрузчик видео FHD Bilibili
// @name:de      FHD-Bilibili-Video-Downloader
// @namespace    https://youtube4kdownloader.com/
// @homepage     https://youtube4kdownloader.com/download-bilibili-videos.html
// @version      2.8.0
// @description  Download any Bilibili Video at max resolutions like (720p, 1080p, 4K) and download audio extracted from video at the best quality in MP3 and M4A formats.
// @description:en  Download any Bilibili Video at max resolutions like (720p, 1080p, 4K) and download audio extracted from video at the best quality in MP3 and M4A formats.
// @description:zh  以最大分辨率（720p、1080p、4K）下载任何 Bilibili 视频，并以 MP3 和 M4A 格式以最佳质量下载从视频中提取的音频。
// @description:ja  Bilibili ビデオを最大解像度 (720p、1080p、4K) でダウンロードし、ビデオから抽出したオーディオを MP3 および M4A 形式で最高の品質でダウンロードします。
// @description:ko  Bilibili 비디오를 (720p, 1080p, 4K)와 같은 최대 해상도로 다운로드하고 비디오에서 추출한 오디오를 MP3 및 M4A 형식의 최고 품질로 다운로드하세요.
// @description:ru  Загрузите любое видео Bilibili с максимальным разрешением, например (720p, 1080p, 4K), и загрузите аудио, извлеченное из видео, в лучшем качестве в форматах MP3 и M4A.
// @description:de  Laden Sie jedes Bilibili-Video mit maximalen Auflösungen wie (720p, 1080p, 4K) herunter und laden Sie aus Video extrahiertes Audio in bester Qualität in den Formaten MP3 und M4A herunter.
// @author       JackDylan
// @icon         https://gcdnb.pbrd.co/images/mQLi55aRWkSR.png?o=1
// @match        https://*.bilibili.com/*
// @run-at       document-start
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/464500/FHD%20Bilibili%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/464500/FHD%20Bilibili%20Video%20Downloader.meta.js
// ==/UserScript==


(function () {
  function onAnalyticsComplete() {
    if (url.indexOf("festival/") > -1) {
      isVideoURL = 1;
      var data = url.match(
        /\/festival\/(?:.*)?\?(?:[a-zA-Z]*)=(BV|bv|av|ep|ss|au)([a-zA-Z0-9_-]*)/
      );
      if (1 in data && 2 in data) {
        user = data[1];
        room = data[1] + data[2];
        x = data[2];
      }
    } else {
      pipelets.forEach((data) => {
        if (!isVideoURL) {
          var CACHESUFFIX = data[0] + data[1];
          if (url.indexOf(CACHESUFFIX) > -1) {
            isVideoURL = 1;
            user = data[1];
            var json = url.split(CACHESUFFIX);
            room = user + json[1];
            ["?", "/"].forEach(function (url) {
              if (room.indexOf(url) > -1) {
                var parameters = room.split(url);
                room = parameters[0];
              }
            });
            x = room.replace(user, "");
          }
        }
      });
    }
  }
  function init() {
    const url = this.responseURL;
    const responseHeaders = this.getAllResponseHeaders();
    const pipelets = [
      "api.bilibili.com",
      "interface.bilibili.com",
      "bangumi.bilibili.com",
    ];
    try {
      if (this.responseType != "blob") {
        var valid_request = 0;
        pipelets.forEach((sceneUid) => {
          if (
            !valid_request &&
            url.indexOf(sceneUid) > -1 &&
            url.indexOf("/playurl") > -1
          ) {
            valid_request = 1;
          }
        });
        let interestingPoint = "";
        if (valid_request) {
          let reverseIsSingle = format("cid", url);
          let reverseValue = format("qn", url);
          interestingPoint = reverseIsSingle;
          if (reverseIsSingle && reverseValue) {
            valid_request = 2;
          }
        } else {
          if (url.indexOf("bilibili.com/audio/music-service-c/web/url") > -1) {
            let viewportCenter = format("sid", url);
            interestingPoint = viewportCenter;
            if (viewportCenter) {
              valid_request = 2;
            }
          }
        }
        if (valid_request === 2) {
          let stapling =
            this.responseType === "" || this.responseType === "text"
              ? JSON.parse(this.responseText)
              : this.response;
          var context = {
            url: url,
            target_param: interestingPoint,
            response: stapling,
          };
          found.push(context);
          seed_albums = 1;
        }
      }
    } catch (err) {}
  }
  function format(type, url) {
    type = type.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + type + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return "";
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  async function create() {
    if (!isVideoURL) {
      return;
    }
    var d = {
      srvName: "bilibili.com",
      srcURL: url,
    };
    var options = [[], "", []];
    d["formats"] = options[0];
    d["duration"] = options[1];
    found_heights = options[2];
    var wndMain;
    var style = "";
    var f = [];
    var id = "data";
    if (
      "__INITIAL_STATE__" in window &&
      typeof window.__INITIAL_STATE__ !== "undefined"
    ) {
      wndMain = window.__INITIAL_STATE__;
    }
    if (["BV", "bv", "av", "au", "am"].indexOf(user) > -1) {
      id = "data";
    } else {
      if (["ep", "ss"].indexOf(user) > -1) {
        id = "result";
      }
    }
    if ($(result) && id in result) {
      if (["am", "au"].indexOf(user) > -1) {
        if ("cdns" in result[id]) {
          let children = result[id]["cdns"];
          if (isArray(children) && children.length) {
            children.forEach((url) => {
              if (isUrl(url)) {
                var params = {
                  url: url,
                  ext: "mp4",
                  vcodec: "none",
                  format_id: randomString(10),
                };
                f.push(params);
              }
            });
          }
        }
      } else {
        var data = {};
        if ("dash" in result[id]) {
          data = result[id];
        } else {
          if ("video_info" in result[id]) {
            data = result[id]["video_info"];
          }
        }
        if ($(data) && !each(data)) {
          if ("duration" in data["dash"]) {
            style = data["dash"]["duration"];
          } else {
            if ("timelength" in data) {
              style = data["timelength"];
              if (style && !isNaN(style)) {
                style = parseInt(style) / 1000;
              }
            }
          }
          var types = ["video", "audio"];
          types.forEach((name) => {
            if (name in data["dash"] && isArray(data["dash"][name])) {
              data["dash"][name].forEach((data) => {
                if ($(data)) {
                  var params = {};
                  if ("height" in data && parseInt(data["height"])) {
                    params["height"] = parseInt(data["height"]);
                  }
                  var url = "";
                  var requiredKeys = [
                    "baseUrl",
                    "base_url",
                    "backupUrl",
                    "backup_url",
                  ];
                  requiredKeys.forEach((fieldId) => {
                    if (!url && fieldId in data) {
                      var val = data[fieldId];
                      if (!isArray(val)) {
                        val = [val];
                      }
                      val.forEach((bestMatchUrl) => {
                        if (!url && isUrl(bestMatchUrl)) {
                          url = bestMatchUrl;
                        }
                      });
                    }
                  });
                  if (url) {
                    params["url"] = url;
                    if ("width" in data && parseInt(data["width"])) {
                      params["width"] = parseInt(data["width"]);
                    }
                    if ("frameRate" in data) {
                      params["fps"] = Math.round(data["frameRate"]);
                    } else {
                      if ("frame_rate" in data) {
                        params["fps"] = Math.round(data["frame_rate"]);
                      }
                    }
                    if ("codecs" in data) {
                      if (name == "video") {
                        params["vcodec"] = data["codecs"];
                        params["acodec"] = "none";
                      } else {
                        if (name == "audio") {
                          params["acodec"] = data["codecs"];
                          params["vcodec"] = "none";
                        }
                      }
                    }
                    params["format_id"] =
                      randomString(10) + ("id" in data ? data["id"] : "");
                    var type = "mp4";
                    var continent =
                      "mime_type" in data && data["mime_type"]
                        ? "mime_type"
                        : "mimeType" in data && data["mimeType"]
                        ? "mimeType"
                        : "";
                    if (continent) {
                      if (data[continent].indexOf("mp4") >= 0) {
                        type = "mp4";
                      } else {
                        if (data[continent].indexOf("webm") >= 0) {
                          type = "webm";
                        }
                      }
                    }
                    params["ext"] = type;
                    f.push(params);
                  }
                }
              });
            }
          });
        }
      }
    }
    if (f.length) {
      d["formats"] = d["formats"].concat(f);
    }
    var containerLIElement;
    var tmp;
    var currMetaTag;
    var duration = "";
    var value = "";
    var data = "";
    if (["am", "au"].indexOf(user) > -1) {
      tmp = document.querySelector("#song_detail_click_video_entrance");
      if (tmp) {
        value = tmp.getAttribute("title").trim();
      }
      containerLIElement = document.querySelector(
        ".ap-controller-center-line > .ap-time > .ap-duration-time"
      );
      if (containerLIElement) {
        var value = containerLIElement.textContent.trim();
        if (value && value.indexOf(":") > -1) {
          duration = filter(value);
        } else {
          if (!isNaN(value)) {
            duration = parseInt(value);
          }
        }
      }
      currMetaTag = document.querySelector("img.song-img");
      if (currMetaTag) {
        data = currMetaTag.getAttribute("src");
      }
      if (data) {
        if (data.indexOf(".jpg@") > 0) {
          var parts = data.split(".jpg@");
          data = parts[0] + ".jpg";
        }
      }
    } else {
      containerLIElement = document.querySelector(
        ".bpx-player-ctrl-time-duration"
      );
      if (containerLIElement) {
        value = containerLIElement.textContent.trim();
        if (value && value.indexOf(":") > -1) {
          duration = filter(value);
        } else {
          if (!isNaN(value)) {
            duration = parseInt(value);
          }
        }
      }
      if (!duration && style) {
        duration = style;
      }
      tmp = document.querySelector('meta[property="og:title"]');
      if (tmp) {
        value = tmp.getAttribute("content");
      }
      if (!value) {
        tmp = document.querySelector('meta[name="title"]');
        if (tmp) {
          value = tmp.getAttribute("content");
        }
      }
      currMetaTag = document.querySelector('meta[itemprop="image"]');
      if (currMetaTag) {
        data = currMetaTag.getAttribute("content");
      }
      if (!data) {
        currMetaTag = document.querySelector('meta[itemprop="thumbnailUrl"]');
        if (currMetaTag) {
          data = currMetaTag.getAttribute("content");
        }
        if (!data) {
          currMetaTag = document.querySelector('meta[property="og:image"]');
          if (currMetaTag) {
            data = currMetaTag.getAttribute("content");
          }
        }
      }
      if (data) {
        if (data.indexOf(".jpg@") > 0) {
          parts = data.split(".jpg@");
          data = parts[0] + ".jpg";
        }
      }
    }
    if (!value) {
      tmp = document.querySelector("title");
      if (tmp) {
        value = tmp.textContent.trim();
      }
      if (!value) {
        value = document.title.trim();
      }
    }
    if (value) {
      value = map(value, "_bilibili");
      value = map(value, "-bilibili");
    }
    d["duration"] = duration;
    d["title"] = value;
    d["thumbnail"] = data;
    return d;
  }
  function isUrl(s) {
    return s && s.indexOf("http") === 0;
  }
  function callback() {
    if (typeof found === "undefined") {
      return [];
    }
    let addons = [];
    let foundValidRequest = 0;
    found.forEach((e, v5) => {
      var pair = transform(e);
      if (pair) {
        if (!foundValidRequest) {
          msg = e.target_param;
          result = e.response;
          foundValidRequest = 1;
        }
      } else {
        if (url === document.location.href) {
          addons.push(v5);
        }
      }
    });
    if (addons.length) {
      addons.forEach((objA) => {
        next(found, objA);
      });
    }
    if (!foundValidRequest) {
      msg = handler();
      result = execute();
    }
  }
  function transform(b) {
    let and = 0;
    let url = b.url;
    if (["am"].indexOf(user) > -1) {
      let e = b.response;
      if ($(e) && "data" in e && "cdns" in e["data"]) {
        and = 1;
      }
    } else {
      if (["au"].indexOf(user) > -1) {
        let axis = format("sid", url);
        if (axis && axis === x) {
          and = 1;
        }
      } else {
        if (["av"].indexOf(user) > -1) {
          let axis = format("avid", url);
          if (axis && axis === x) {
            and = 1;
          }
        } else {
          if (["BV", "bv"].indexOf(user) > -1) {
            let name = format("bvid", url);
            if (name && name === room) {
              and = 1;
            }
          } else {
            if (["ep", "ss"].indexOf(user) > -1) {
              let axis = format("ep_id", url);
              let data = 1;
              if (user === "ss") {
                let a = document.querySelector('link[rel="canonical"]');
                let instance = document.querySelector('link[rel="alternate"]');
                data = get(a);
                if (!data) {
                  data = get(instance);
                }
              }
              if (!data || (axis && axis === x)) {
                and = 1;
              }
            }
          }
        }
      }
    }
    return and;
  }
  function execute() {
    var ret = "";
    if (
      "__playinfo__" in window &&
      typeof window.__playinfo__ !== "undefined" &&
      $(window.__playinfo__) &&
      !each(window.__playinfo__)
    ) {
      ret = window.__playinfo__;
      seed_albums = 1;
    } else {
      var PRD = applyStyle();
      if (PRD) {
        ret = PRD;
        seed_albums = 1;
      }
    }
    return ret;
  }
  function applyStyle() {
    var data = "";
    Object.keys(window).forEach((key) => {
      if (
        !data &&
        $(window[key]) &&
        !each(window[key]) &&
        "data" in window[key] &&
        "dash" in window[key]["data"]
      ) {
        data = window[key];
      }
    });
    return data;
  }
  function handler() {
    var target = document.querySelector(
      ".bpx-player-ctrl-eplist-menu-item.bpx-state-active"
    );
    var d = "";
    if (target) {
      d = target.getAttribute("data-cid");
      if (!d || isNaN(d)) {
        d = "";
      }
    }
    return d;
  }
  function get(tag) {
    let first = 0;
    if (tag) {
      let embedURL = tag.getAttribute("href");
      if (embedURL.indexOf("/play/ep") > -1) {
        var centroid = embedURL.match(/\/play\/ep(\d+)/i);
        if (1 in centroid && !isNaN(centroid[1])) {
          room = "ep" + centroid[1];
          x = centroid[1];
          first = 1;
        }
      }
    }
    return first;
  }
  function randomString(length) {
    let randomstring = "";
    const raw_composed_type =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const caveWidth = raw_composed_type.length;
    let written = 0;
    for (; written < length; ) {
      randomstring =
        randomstring +
        raw_composed_type.charAt(Math.floor(Math.random() * caveWidth));
      written = written + 1;
    }
    return randomstring;
  }
  function next(results, n) {
    if (n !== -1) {
      results.splice(n, 1);
    }
    return results;
  }
  function filter(text) {
    var deadPool = text.split(":");
    var val = 0;
    var sign = 1;
    for (; deadPool.length > 0; ) {
      val = val + sign * parseInt(deadPool.pop(), 10);
      sign = sign * 60;
    }
    return val;
  }
  function map(s, p) {
    for (;;) {
      var i = s.lastIndexOf(p);
      if (i === s.length - p.length) {
        var t = s.slice(0, i);
        s = t;
      } else {
        break;
      }
    }
    return s;
  }
  function removeOldDeleteBtn() {
    var pipelets = document.querySelectorAll(`.${itemno}`);
    pipelets.forEach((__el) => {
      if (__el) {
        __el.parentNode.removeChild(__el);
      }
    });
  }
  function render(index) {
    var pipelets = [];
    if (url.indexOf("festival/") > -1) {
      pipelets = [
        ".video-toolbar-content_right",
        ".video-toolbar-content_left",
        ".video-desc-wrapper",
        ".festival-main-panel",
        "#videoToolbar",
        ".video-toolbar",
      ];
    } else {
      if (["am", "au"].indexOf(user) > -1) {
        pipelets = [
          "#music-container",
          ".audioplayer",
          ".share-board",
          ".song-intro",
          ".song-padding .song-intro",
          ".lrc-fold",
        ];
      } else {
        if (["ep", "ss"].indexOf(user) > -1) {
          pipelets = [
            ".player-left-components .toolbar",
            ".player-left-components .mediainfo_mediaInfo__Cpow4",
            ".bpx-player-sending-area",
            "#comment-module",
            ".main-container",
            "#bilibili-player-wrap",
          ];
        } else {
          pipelets = [
            "#arc_toolbar_report .toolbar-right",
            "#arc_toolbar_report .toolbar-left",
            ".left-container-under-player",
            "#playerWrap",
            ".player-wrap",
          ];
        }
      }
    }
    var _anchor = "";
    pipelets.forEach((seletor) => {
      if (!_anchor) {
        var parent = document.querySelector(seletor);
        if (parent) {
          var entry = getValue(index);
          if (entry) {
            append();
            parent.insertBefore(entry, parent.firstChild);
          }
          _anchor = parent;
        }
      }
    });
    if (!_anchor) {
      var parent = document.querySelector('video[src*="bilibili.com"]');
      if (parent) {
        var div = getValue(index);
        if (div) {
          append();
          var pEl = parent.parentElement || parent.parentNode;
          pEl.insertBefore(div, pEl.firstChild);
          div.style.position = "absolute";
          div.style.top = "4px";
          div.style.right = "4px";
          div.style.zIndex = "999";
        }
        _anchor = parent;
      }
    }
  }
  function getValue(input) {
    var t = ["am", "au"].indexOf(user) > -1 ? "Audio" : "Video";
    var responseText =
      '<div class="' +
      itemno +
      '"><form action="' +
      __dl_url +
      '" method="POST" target="_blank"><input type="hidden" name="data" value="" /><button type="submit"><span>Download ' +
      t +
      '</span><svg width="22px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M17 12L12 17M12 17L7 12M12 17V4M17 20H7" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g></svg></button></form></div>';
    const domParser = new DOMParser();
    const frameDoc = domParser.parseFromString(responseText, "text/html");
    const inCssClasses = frameDoc.documentElement.querySelector("." + itemno);
    const _this = frameDoc.documentElement.querySelector(
      "." + itemno + ' form input[type="hidden"]'
    );
    if (_this) {
      _this.value = JSON.stringify(input);
    }
    return inCssClasses ? inCssClasses : "";
  }
  function append() {
    const lineNumberElement = document.createElement("style");
    lineNumberElement.textContent = `.${itemno}{line-height: 20px;margin: 10px auto;display: flex;\n      justify-content: center;\n      align-items: center;}#music-container .${itemno},.audioplayer .${itemno}{position: absolute;top: -10px;left: 50%;transform: translate(-50%, -100%);}.${itemno} form [type=submit]{background-color:#20ad43;border-radius:5px;padding:6px 8px;border:0;font-size:14px;color:#fff;display:flex;justify-content:center;align-items:center;margin: 0 10px 0 0;}.${itemno} form [type=submit] span{margin-right:2px}.${itemno} form [type=submit]:hover{background-color:#23b547;cursor:pointer}.${itemno} svg{width:22px !important;height:20px !important;}`;
    document.head.appendChild(lineNumberElement);
  }
  function isArray(what) {
    return Object.prototype.toString.apply(what) === "[object Array]";
  }
  function $(d) {
    return Object.prototype.toString.apply(d) === "[object Object]";
  }
  function each(items) {
    return Object.keys(items).length === 0;
  }
  var url = document.location.href;
  var urlHosts = [];
  var itemno = "--bili-dl-btn";
  var isVideoURL = 0;
  var pipelets = [
    ["video/", "BV"],
    ["video/", "bv"],
    ["video/", "av"],
    ["bangumi/play/", "ep"],
    ["bangumi/play/", "ss"],
    ["audio/", "au"],
    ["audio/", "am"],
  ];
  var __dl_url =
    "https://youtube4kdownloader.com/download-bilibili-videos.html";
  var user = "";
  var room = "";
  var x = "";
  var seed_albums = 0;
  var msg = "";
  var result = "";
  var found = [];
  var proto = XMLHttpRequest.prototype;
  var old = proto.send;
  proto.send = function () {
    this.addEventListener("load", init);
    return old.apply(this, arguments);
  };
  window.addEventListener(
    "load",
    async function () {
      var interval1C = 0;
      var finishedProcessing = 1;
      var chat_retry = setInterval(async () => {
        if (finishedProcessing) {
          finishedProcessing = 0;
          if (url !== document.location.href) {
            url = document.location.href;
            urlHosts = [];
            isVideoURL = 0;
            interval1C = 0;
          }
          if (urlHosts.indexOf(url) === -1) {
            onAnalyticsComplete();
            if (isVideoURL) {
              removeOldDeleteBtn();
              callback();
              var do_report =
                interval1C > 5
                  ? 1
                  : typeof seed_albums !== "undefined" && seed_albums;
              if (do_report && room && x && result) {
                setTimeout(async () => {
                  var level = await create();
                  finishedProcessing = 1;
                  if (
                    "formats" in level &&
                    isArray(level["formats"]) &&
                    level["formats"].length
                  ) {
                    urlHosts.push(url);
                    render(level);
                    user = "";
                    msg = "";
                    result = "";
                    room = "";
                    x = "";
                  }
                }, 3000);
              } else {
                finishedProcessing = 1;
              }
            } else {
              finishedProcessing = 1;
            }
          } else {
            finishedProcessing = 1;
          }
        } else {
          interval1C++;
        }
      }, 1000);
    },
    false
  );
})();
