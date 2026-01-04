// ==UserScript==
// @name         动漫弹幕播放
// @namespace    https://github.com/LesslsMore/anime-danmu-play-script
// @version      0.5.8
// @author       lesslsmore
// @description  自动匹配加载动漫剧集对应弹幕并播放，目前支持樱花动漫、风车动漫、AGE 动漫
// @license      MIT
// @icon         https://cdn.yinghuazy.xyz/webjs/stui_tpl/statics/img/favicon.ico
// @include      /^https:\/\/www\.dmla.*\.com\/play\/.*$/
// @include      https://danmu.yhdmjx.com/*
// @include      /^https:\/\/www.age.*\/play\/.*$/
// @include      https://43.240.156.118:8443/*
// @include      https://www.tt776b.com/play/*
// @include      https://www.dm539.com/play/*
// @match        /^https:\/\/www\.dmla.*\.com\/play\/.*$/
// @match        https://www.tt776b.com/play/*
// @match        https://www.dm539.com/play/*
// @require      https://cdn.jsdelivr.net/npm/dexie@4.0.8/dist/dexie.min.js
// @connect      https://api.dandanplay.net/*
// @connect      https://danmu.yhdmjx.com/*
// @connect      http://v16m-default.akamaized.net/*
// @connect      self
// @connect      *
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/485364/%E5%8A%A8%E6%BC%AB%E5%BC%B9%E5%B9%95%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/485364/%E5%8A%A8%E6%BC%AB%E5%BC%B9%E5%B9%95%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function (Dexie) {
  'use strict';

  async function get_agedm_info(web_video_info) {
    let url = window.location.href;
    let urls = url.split("/");
    let len = urls.length;
    let episode = urls[len - 1];
    let anime_id = urls[len - 3];
    let title = document.querySelector(".card-title").textContent;
    web_video_info["anime_id"] = anime_id;
    web_video_info["episode"] = episode;
    web_video_info["title"] = title;
    web_video_info["url"] = url;
    return web_video_info;
  }
  const db_name = "anime";
  const db_schema = {
    info: "&anime_id",
    // 主键 索引
    url: "&anime_id",
    // 主键 索引
    danmu: "&episode_id"
    // 组合键 索引
  };
  const db_obj = {
    [db_name]: get_db(db_name, db_schema)
  };
  const db_url = db_obj[db_name].url;
  const db_info = db_obj[db_name].info;
  const db_danmu = db_obj[db_name].danmu;
  function get_db(db_name2, db_schema2, db_ver = 1) {
    let db = new Dexie(db_name2);
    db.version(db_ver).stores(db_schema2);
    return db;
  }
  function createDbMethods(dbInstance, pk, expiryInMinutes = 60) {
    const old_put = dbInstance.put.bind(dbInstance);
    const old_get = dbInstance.get.bind(dbInstance);
    const put = async function(key, value) {
      const now = /* @__PURE__ */ new Date();
      const item = {
        [pk]: key,
        value,
        expiry: now.getTime() + expiryInMinutes * 6e4
      };
      const result = await old_put(item);
      const event = new Event(old_put.name);
      event.key = key;
      event.value = value;
      document.dispatchEvent(event);
      return result;
    };
    const get = async function(key) {
      const item = await old_get(key);
      const event = new Event(old_get.name);
      event.key = key;
      event.value = item ? item.value : null;
      document.dispatchEvent(event);
      if (!item) {
        return null;
      }
      const now = /* @__PURE__ */ new Date();
      if (now.getTime() > item.expiry) {
        await db_url.delete(key);
        return null;
      }
      return item.value;
    };
    dbInstance.put = put;
    dbInstance.get = get;
    return {
      put,
      get
    };
  }
  createDbMethods(db_url, "anime_id", 60);
  createDbMethods(db_info, "anime_id", 60 * 24 * 7);
  createDbMethods(db_danmu, "episode_id", 60 * 24 * 7);
  async function set_db_url_info(web_video_info) {
    let { anime_id, title, url, src_url } = web_video_info;
    let var_anime_url = {
      "episodes": {}
    };
    let db_anime_url = await db_url.get(anime_id);
    if (db_anime_url != null) {
      var_anime_url = db_anime_url;
    }
    if (!var_anime_url["episodes"].hasOwnProperty(url)) {
      if (src_url) {
        var_anime_url["episodes"][url] = src_url;
        await db_url.put(anime_id, var_anime_url);
      }
    }
    console.log("src_url", src_url);
    web_video_info["src_url"] = src_url;
    return {
      var_anime_url
    };
  }
  const titleStrategies = [
    {
      match(url) {
        return url.startsWith("https://www.dmla");
      },
      getTitle() {
        var _a;
        return ((_a = document.querySelector(".stui-player__detail.detail > h1 > a")) == null ? void 0 : _a.text) || "";
      }
    },
    {
      match(url) {
        return url.startsWith("https://www.tt776b.com/play");
      },
      getTitle() {
        var _a;
        return ((_a = document.querySelector("body > div.myui-player.clearfix > div > div > div.myui-player__data.hidden-xs.clearfix > h3 > a")) == null ? void 0 : _a.text) || "";
      }
    },
    {
      match(url) {
        return url.startsWith("https://www.dm539.com/play");
      },
      getTitle() {
        var _a;
        return ((_a = document.querySelector(".myui-panel__head.active.clearfix > h3 > a")) == null ? void 0 : _a.text) || "";
      }
    }
  ];
  function get_title(url) {
    for (const strategy of titleStrategies) {
      if (strategy.match(url)) {
        return strategy.getTitle();
      }
    }
    console.warn("没有自动匹配到动漫名称");
    return "";
  }
  function get_yhdm_info(web_video_info) {
    let url = window.location.href;
    let title = get_title(url);
    let episode = parseInt(url.split("-").pop().split(".")[0]);
    let anime_url = url.split("-")[0];
    let anime_id = parseInt(anime_url.split("/")[4]);
    web_video_info["anime_id"] = anime_id;
    web_video_info["episode"] = episode;
    web_video_info["title"] = title;
    web_video_info["url"] = url;
    return web_video_info;
  }
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const iframeStrategies = [
    {
      match(url) {
        return url.startsWith("https://www.dmla") || url.startsWith("https://www.dm539.com/play") || url.startsWith("https://www.tt776b.com/play");
      },
      getIframe() {
        return document.querySelector("#playleft > iframe");
      },
      get_info(web_video_info) {
        return get_yhdm_info(web_video_info);
      }
    },
    {
      match(url) {
        return url.startsWith("https://www.age");
      },
      getIframe() {
        return document.querySelector("#iframeForVideo");
      },
      get_info(web_video_info) {
        return get_agedm_info(web_video_info);
      }
    }
  ];
  function get_web_iframe() {
    let url = window.location.href;
    for (const strategy of iframeStrategies) {
      if (strategy.match(url)) {
        return strategy.getIframe();
      }
    }
    console.warn("未匹配到 iframe 获取策略");
    return null;
  }
  function get_info_ByUrl(web_video_info) {
    let url = window.location.href;
    for (const strategy of iframeStrategies) {
      if (strategy.match(url)) {
        return strategy.get_info(web_video_info);
      }
    }
    console.warn("未匹配到 iframe 获取策略");
    return null;
  }
  async function get_web_info(src_url) {
    let web_video_info = {
      src_url
    };
    get_info_ByUrl(web_video_info);
    console.log("get_web_info", web_video_info);
    await set_db_url_info(web_video_info);
    return web_video_info;
  }
  function get_src_url() {
    let url = window.location.href;
    let src_url = "";
    let video;
    if (url.startsWith("https://danmu.yhdmjx.com/")) {
      src_url = _unsafeWindow.v_decrypt(_unsafeWindow.config.url, _unsafeWindow._token_key, _unsafeWindow.key_token);
      video = document.querySelector("#lelevideo");
    } else if (url.startsWith("https://43.240.156.118:8443/")) {
      video = document.querySelector("video");
      src_url = _unsafeWindow.info.url;
    }
    src_url = video ? video.src : src_url;
    return src_url;
  }
  function create_button() {
    const button = document.createElement("button");
    button.textContent = "切换线路";
    button.style.position = "fixed";
    button.style.left = "10px";
    button.style.top = "50%";
    button.style.transform = "translateY(-50%)";
    button.style.zIndex = "9999";
    button.style.padding = "10px 10px";
    button.style.backgroundColor = "#00a1d6";
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    button.addEventListener("click", async () => {
      let iframe = get_web_iframe();
      console.log("iframe", iframe.src);
      const playUrls2 = JSON.parse("['https://anime-danmu.onrender.com/danmu', 'https://anime-danmu-play.vercel.app', 'https://anime-danmu.vercel.app/danmu']".replace(/'/g, '"'));
      const currentPlayUrl = localStorage.getItem("play_url");
      let currentIndex = playUrls2.findIndex((url) => iframe.src.includes(url));
      let nextIndex = (currentIndex + 1) % playUrls2.length;
      let nextPlayUrl = playUrls2[nextIndex];
      let src_url = iframe.src.replace(currentPlayUrl, nextPlayUrl);
      console.log("src_url", src_url);
      iframe.src = src_url;
      localStorage.setItem("play_url", nextPlayUrl);
      console.log("play_url", nextPlayUrl);
    });
    document.body.appendChild(button);
  }
  async function interceptor(play) {
    if (window.self != window.top) {
      console.log("当前页面位于iframe子页面");
      console.log(window.location.href);
      const observer = new MutationObserver(function(mutationsList, observer2) {
        console.log("mutationsList", mutationsList);
        console.log("observer", observer2);
        let video = document.querySelector("video");
        if (video) {
          console.log("目标元素已加载");
          let src_url = video.src;
          console.log("src_url", src_url);
          let message = { msg: "send_url", url: src_url, href: location.href };
          console.log("向父页面发送消息：", message);
          _unsafeWindow.parent.postMessage(message, "*");
          observer2.disconnect();
        }
      });
      observer.observe(document.body, {
        childList: true
        // 观察目标子节点的变化，添加或删除
        // attributes: true, // 观察属性变动
        // subtree: true, //默认是false，设置为true后可观察后代节点
      });
      _unsafeWindow.addEventListener("message", async function(event) {
        let data = event.data;
        if (data.msg === "get_url") {
          console.log("message", data);
          let url_decode = get_src_url();
          let message = { msg: "send_url", url: url_decode, href: location.href };
          console.log("向父页面发送消息：", message);
          _unsafeWindow.parent.postMessage(message, "*");
        }
      });
    } else if (window === window.top) {
      create_button();
      console.log("当前页面位于主页面");
      console.log(window.location.href);
      window.addEventListener("message", async function(event) {
        let data = event.data;
        if (data.msg === "send_url") {
          console.log("message", data);
          let src_url = data.url;
          let iframe2 = get_web_iframe();
          if (!iframe2.src.startsWith(play)) {
            let get_param_url = function(animeId, episode2, title2, videoUrl) {
              const queryParams = new URLSearchParams();
              if (animeId)
                queryParams.append("anime_id", animeId);
              if (episode2)
                queryParams.append("episode", episode2);
              if (title2)
                queryParams.append("title", title2);
              if (videoUrl)
                queryParams.append("url", videoUrl);
              return queryParams.toString();
            };
            let { anime_id, episode, title, url } = await get_web_info(src_url);
            if (src_url === "") {
              console.log("地址解析失败，尝试获取缓存地址");
            }
            let play_url = `${play}/play?${get_param_url(anime_id, episode, title, src_url)}`;
            iframe2.src = play_url;
          }
        }
      }, true);
      let iframe = get_web_iframe();
      if (iframe.src) {
        console.log("初始检测到播放器 iframe 地址:", iframe.src);
        iframe.addEventListener("load", async () => {
          console.log("跨域 iframe 加载完成");
          let message = { msg: "get_url" };
          let len = window.length;
          let win = window[len - 1];
          win.postMessage(message, "*");
        });
      }
    }
  }
  const playUrls = JSON.parse("['https://anime-danmu.onrender.com/danmu', 'https://anime-danmu-play.vercel.app', 'https://anime-danmu.vercel.app/danmu']".replace(/'/g, '"'));
  console.log("play_urls", playUrls);
  if (!localStorage.getItem("play_url")) {
    localStorage.setItem("play_url", playUrls[0]);
  }
  interceptor(localStorage.getItem("play_url"));

})(Dexie);