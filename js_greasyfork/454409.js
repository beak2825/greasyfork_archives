// ==UserScript==
// @name              Video Downloader for Tampermonkey
// @version           0.5
// @description       Will add a download button to various websites such as Reddit, Facebook, Youtube and Twitter
// @author            Mordo95
// @namespace         com.mordo95.Downloader
// @license           MIT
// @match             *://*/*
// @supportURL        https://github.com
// @run-at            document-start
// @grant             GM_addStyle
// @grant             GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/454409/Video%20Downloader%20for%20Tampermonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/454409/Video%20Downloader%20for%20Tampermonkey.meta.js
// ==/UserScript==

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function() {
  var _a, _b, _c, _d;
  "use strict";
  GM_addStyle(`
div.dlBtn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 99999999;
  padding: 10px 15px;
  margin: 5px;
  cursor: pointer;
  outline: 0;
  background: #5383FB;
  color: white;
  border: 1px solid 1px solid #5383FB;
  font-family: Segoe UI Historic, Segoe UI, Helvetica, Arial, sans-serif !important;
  font-size: 12px;
}
div.dlBtn:hover {
  background-color: #86A4FC;
}div.dlBtn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 99999;
  padding: 10px 15px;
  margin: 5px;
  cursor: pointer;
  outline: 0;
  background: var(--primary-button-background);
  color: var(--primary-button-text);
  border: 1px solid 1px solid var(--accent);
  font-family: var(--font-family-segoe) !important;
}
div.dlBtn:hover {
  background-color: var(--primary-button-pressed);
}
div.dlBtn.shorts {
  right: 110px;
  top: 5px;
}div.dlBtn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 99999999;
  padding: 10px 15px;
  margin: 5px;
  cursor: pointer;
  outline: 0;
  background: #5383FB;
  color: white;
  border: 1px solid 1px solid #5383FB;
  font-family: Segoe UI Historic, Segoe UI, Helvetica, Arial, sans-serif !important;
  font-size: 12px;
}
div.dlBtn:hover {
  background-color: #86A4FC;
}  `);
  class Injector {
    constructor() {
      __publicField(this, "downloaders", []);
    }
    register(downloader) {
      if (Array.isArray(downloader)) {
        this.downloaders = this.downloaders.concat(downloader);
      } else
        this.downloaders.push(downloader);
    }
    inject(location) {
      for (const downloader of this.downloaders) {
        if (location.match(downloader.siteRegex))
          new downloader().inject();
      }
    }
  }
  const Injector$1 = new Injector();
  function staticImplements() {
    return (constructor) => {
    };
  }
  var __defProp$3 = Object.defineProperty;
  var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
  var __decorateClass$3 = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp$3(target, key, result);
    return result;
  };
  let YoutubeDownloader = (_a = class {
    constructor() {
      __publicField(this, "btnText", "Download (HD)");
    }
    addVideoButton(on) {
      let btn = document.createElement("div");
      btn.innerHTML = this.btnText;
      btn.classList.add("dlBtn");
      btn.onclick = () => this.getLinks(btn);
      on.prepend(btn);
    }
    getLinks(btn) {
      let fd = new FormData();
      fd.set("q", window.location.href);
      fd.set("vt", "mp4");
      let url = "https://yt1s.com/api/ajaxSearch/index";
      GM_xmlhttpRequest({
        method: "POST",
        url,
        data: fd,
        onload: (resp) => {
          let js = JSON.parse(resp.responseText);
          this.convert(btn, js.vid, js.links.mp4.auto.k);
        }
      });
    }
    convert(btn, vid, k) {
      let fd = new FormData();
      fd.set("vid", vid);
      fd.set("k", k);
      btn.innerHTML = "Converting ...";
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://yt1s.com/api/ajaxConvert/convert",
        data: fd,
        timeout: 6e4,
        onload: (resp) => {
          let js = JSON.parse(resp.responseText);
          let status = js.c_status;
          if (status === "CONVERTED") {
            window.open(js.dlink);
          } else {
            alert("Error converting video. Please try again later!");
          }
          btn.innerHTML = this.btnText;
        },
        onTimeout: () => {
          btn.innerHTML = this.btnText;
        }
      });
    }
    inject() {
      Promise.resolve().then(() => style$1);
      setInterval(() => {
        let videos = document.querySelectorAll("#ytd-player:not([data-tagged])");
        for (let video of videos) {
          video.setAttribute("data-tagged", "true");
          console.log(document.querySelector("#container"));
          this.addVideoButton(document.querySelector("#ytd-player"));
        }
      }, 200);
    }
  }, __publicField(_a, "siteRegex", /youtu(\.)?be.*/), _a);
  YoutubeDownloader = __decorateClass$3([
    staticImplements()
  ], YoutubeDownloader);
  var __defProp$2 = Object.defineProperty;
  var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
  var __decorateClass$2 = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp$2(target, key, result);
    return result;
  };
  let FacebookDownloader = (_b = class {
    getReactFiber(el) {
      for (let prop of Object.keys(el)) {
        if (prop.startsWith("__reactFiber")) {
          return el[prop];
        }
      }
      return null;
    }
    fiberReturnUntil(fiber, displayName) {
      let fiberInst = fiber;
      while (fiberInst != null) {
        let fiberInstName = "";
        if (typeof fiberInst.elementType === "string")
          fiberInstName = fiberInst.elementType;
        else if (typeof fiberInst.elementType === "function")
          fiberInstName = fiberInst.elementType.displayName;
        if (fiberInstName === displayName)
          return fiberInst;
        fiberInst = fiberInst.return;
      }
      return null;
    }
    fiberReturnUntilFn(fiber, predicate) {
      let fiberInst = fiber;
      while (fiberInst != null) {
        if (predicate(fiberInst))
          return fiberInst;
        fiberInst = fiberInst.return;
      }
      return null;
    }
    parentsUntil(el, query) {
      let elInst = el;
      while (elInst != null) {
        if (elInst.matches(query))
          return elInst;
        elInst = elInst.parentElement;
      }
      return null;
    }
    getVideoImplementation(fiber, impl = "VideoPlayerProgressiveImplementation") {
      if (!fiber || !fiber.memoizedProps || !fiber.memoizedProps.implementations)
        return null;
      return fiber.memoizedProps.implementations.find((x) => x.typename === impl);
    }
    addVideoButton(on, videoEl, isShorts = false) {
      let btn = document.createElement("div");
      btn.innerHTML = "Download (HD)";
      btn.classList.add("dlBtn");
      if (isShorts)
        btn.classList.add("shorts");
      btn.onclick = () => this.btnAct(videoEl);
      on.prepend(btn);
    }
    btnAct(videoEl) {
      let fiber = this.getReactFiber(videoEl);
      let props = this.fiberReturnUntil(fiber, "a [from CoreVideoPlayer.react]");
      let impl = this.getVideoImplementation(props);
      if (impl.data.hdSrc) {
        window.open(impl.data.hdSrc);
      } else {
        window.open(impl.data.sdSrc);
      }
    }
    inject() {
      Promise.resolve().then(() => facebook$1);
      setInterval(() => {
        let videos = document.querySelectorAll("video:not([data-tagged])");
        for (let video of videos) {
          video.setAttribute("data-tagged", "true");
          let fiber = this.getReactFiber(video.parentElement);
          let props = this.fiberReturnUntil(fiber, "a [from CoreVideoPlayer.react]");
          let appendTo = document.querySelector(`[data-instancekey='${props.memoizedState.memoizedState}']`);
          let isShorts = false;
          if (props.memoizedProps.subOrigin && props.memoizedProps.subOrigin === "fb_shorts_viewer") {
            let fiber2 = this.fiberReturnUntilFn(fiber, (fiber22) => {
              return fiber22.memoizedProps["data-video-id"];
            });
            let el = fiber2.stateNode.parentElement.nextSibling;
            if (el.classList.contains("__fb-dark-mode"))
              el = el.nextSibling;
            appendTo = el;
            isShorts = true;
          }
          this.addVideoButton(appendTo, video.parentElement, isShorts);
        }
      }, 200);
    }
  }, __publicField(_b, "siteRegex", /facebook\..*/), _b);
  FacebookDownloader = __decorateClass$2([
    staticImplements()
  ], FacebookDownloader);
  const Params = {
    paramsToObject(entries) {
      const result = {};
      for (const [key, value] of entries) {
        result[key] = value;
      }
      return result;
    },
    buildParams(p) {
      return new URLSearchParams(p).toString();
    }
  };
  var __defProp$1 = Object.defineProperty;
  var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
  var __decorateClass$1 = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp$1(target, key, result);
    return result;
  };
  let RedditDownloader = (_c = class {
    constructor() {
      __publicField(this, "btnText", "Download (HD)");
    }
    addVideoButton(on) {
      on.querySelectorAll(".dlBtn").forEach((el) => el.remove());
      let btn = document.createElement("div");
      btn.innerHTML = this.btnText;
      btn.classList.add("dlBtn");
      btn.onclick = () => this.btnAct(btn);
      on.prepend(btn);
    }
    returnUntil(inst, prop) {
      let fInst = inst;
      while (fInst != null) {
        if (fInst.pendingProps[prop])
          return fInst;
        fInst = fInst.return;
      }
      return null;
    }
    getReactInternalState(el) {
      for (let prop of Object.keys(el)) {
        if (prop.startsWith("__reactInternalInstance")) {
          return el[prop];
        }
      }
      return null;
    }
    btnAct(btn) {
      let src = this.returnUntil(this.getReactInternalState(btn.parentElement), "mpegDashSource");
      if (!src) {
        alert("Unable to load video data");
        return;
      }
      let mpegDashUrl = src.pendingProps.mpegDashSource;
      let match = mpegDashUrl.match(/https:\/\/v.redd.it\/(?<videoId>.+)\/DASHPlaylist\.mpd/);
      if (!match) {
        alert("Unable to load video data");
        return;
      }
      let videoId = match.groups.videoId;
      let p = Params.buildParams({
        video_url: "https://v.redd.it/" + videoId + "/DASH_720.mp4?source=fallback",
        audio_url: "https://v.redd.it/" + videoId + "/DASH_audio.mp4?source=fallback",
        permalink: window.location.origin + src.pendingProps.postUrl.pathname
      });
      window.open("https://ds.redditsave.com/download.php?" + p);
    }
    inject() {
      Promise.resolve().then(() => reddit$1);
      setInterval(() => {
        let videos = document.querySelectorAll("video:not([data-tagged])");
        for (let video of videos) {
          if (video.parentElement.querySelector(".dlBtn") == null && video.parentElement.parentElement.firstChild.getAttribute("role") !== "slider")
            this.addVideoButton(video.parentElement);
        }
      }, 200);
    }
  }, __publicField(_c, "siteRegex", /reddit\..*/), _c);
  RedditDownloader = __decorateClass$1([
    staticImplements()
  ], RedditDownloader);
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp2(target, key, result);
    return result;
  };
  let TwitterDownloader = (_d = class {
    constructor() {
      __publicField(this, "TWITTER_BEARER", "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA");
    }
    getReactFiber(el) {
      for (let prop of Object.keys(el)) {
        if (prop.startsWith("__reactFiber")) {
          return el[prop];
        }
      }
      return null;
    }
    parentsUntil(el, query) {
      let elInst = el;
      while (elInst != null) {
        if (elInst.matches(query))
          return elInst;
        elInst = elInst.parentElement;
      }
      return null;
    }
    fiberReturnUntil(fiber, predicate) {
      let fiberInst = fiber;
      while (fiberInst != null) {
        if (predicate(fiberInst))
          return fiberInst;
        fiberInst = fiberInst.return;
      }
      return null;
    }
    async fetchGuestToken() {
      const resp = await fetch("https://api.twitter.com/1.1/guest/activate.json", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.TWITTER_BEARER}`
        }
      });
      const respJson = await resp.json();
      return respJson.guest_token;
    }
    async queryApi(twId) {
      const resp = await fetch(`https://api.twitter.com/2/timeline/conversation/${twId}.json`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.TWITTER_BEARER}`,
          "X-Guest-Token": await this.fetchGuestToken()
        }
      });
      return await resp.json();
    }
    addVideoButton(on, videoEl) {
      let btn = document.createElement("div");
      btn.innerHTML = "Download (HD)";
      btn.classList.add("dlBtn");
      btn.onclick = () => this.btnAct(videoEl);
      on.prepend(btn);
    }
    async btnAct(videoEl) {
      const fiber = this.getReactFiber(videoEl.parentElement.parentElement);
      const fiber2 = this.fiberReturnUntil(fiber, (x) => {
        var _a2;
        return (_a2 = x.memoizedProps) == null ? void 0 : _a2.contentId;
      });
      const twId = fiber2.memoizedProps.videoId.id;
      const data = await this.queryApi(twId);
      const media = data.globalObjects.tweets[twId].extended_entities.media;
      console.log(data.globalObjects.tweets[twId], media);
      if (media.length === 0) {
        alert("Cannot fetch media data");
      }
      let variants = media[0].video_info.variants;
      variants = variants.filter((x) => x.content_type !== "application/x-mpegURL").sort((a, b) => {
        return a.bitrate > b.bitrate ? -1 : 1;
      });
      window.open(variants[0].url);
    }
    inject() {
      Promise.resolve().then(() => style$1);
      setInterval(() => {
        let videos = document.querySelectorAll("video:not([data-tagged])");
        for (let video of videos) {
          video.setAttribute("data-tagged", "true");
          this.addVideoButton(video.parentElement, video);
        }
      }, 200);
    }
  }, __publicField(_d, "siteRegex", /twitter\..*/), _d);
  TwitterDownloader = __decorateClass([
    staticImplements()
  ], TwitterDownloader);
  Injector$1.register(YoutubeDownloader);
  Injector$1.register(FacebookDownloader);
  Injector$1.register(RedditDownloader);
  Injector$1.register(TwitterDownloader);
  document.addEventListener("DOMContentLoaded", () => {
    Injector$1.inject(window.location.href);
  }, false);
  const style = "div.dlBtn {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 99999999;\n  padding: 10px 15px;\n  margin: 5px;\n  cursor: pointer;\n  outline: 0;\n  background: #5383FB;\n  color: white;\n  border: 1px solid 1px solid #5383FB;\n  font-family: Segoe UI Historic, Segoe UI, Helvetica, Arial, sans-serif !important;\n  font-size: 12px;\n}\ndiv.dlBtn:hover {\n  background-color: #86A4FC;\n}";
  const style$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: style
  }, Symbol.toStringTag, { value: "Module" }));
  const facebook = "div.dlBtn {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 99999;\n  padding: 10px 15px;\n  margin: 5px;\n  cursor: pointer;\n  outline: 0;\n  background: var(--primary-button-background);\n  color: var(--primary-button-text);\n  border: 1px solid 1px solid var(--accent);\n  font-family: var(--font-family-segoe) !important;\n}\ndiv.dlBtn:hover {\n  background-color: var(--primary-button-pressed);\n}\ndiv.dlBtn.shorts {\n  right: 110px;\n  top: 5px;\n}";
  const facebook$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: facebook
  }, Symbol.toStringTag, { value: "Module" }));
  const reddit = "div.dlBtn {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 99999999;\n  padding: 10px 15px;\n  margin: 5px;\n  cursor: pointer;\n  outline: 0;\n  background: #5383FB;\n  color: white;\n  border: 1px solid 1px solid #5383FB;\n  font-family: Segoe UI Historic, Segoe UI, Helvetica, Arial, sans-serif !important;\n  font-size: 12px;\n}\ndiv.dlBtn:hover {\n  background-color: #86A4FC;\n}";
  const reddit$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: reddit
  }, Symbol.toStringTag, { value: "Module" }));
})();
