// ==UserScript==
// @name               Bilibili 首页推送过滤
// @name:en            Bilibili Homepage Feed Filter
// @namespace          http://tampermonkey.net/
// @version            2025-05-09
// @description        自用脚本，过滤 B 站首页的广告、直播、影视、付费课程等杂项。为避免显示问题，建议配合 bilibili 页面净化大师食用（启用：隐藏全部加载骨架）。
// @description:en     Personal userscript: cleans up Bilibili feeds in homepage – strips logs, ads, paid courses, films/OGV, live streams, etc.
// @author             vvbbnn00
// @license            MIT
// @match              https://www.bilibili.com/*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/535466/Bilibili%20%E9%A6%96%E9%A1%B5%E6%8E%A8%E9%80%81%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/535466/Bilibili%20%E9%A6%96%E9%A1%B5%E6%8E%A8%E9%80%81%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /**********************************************************************
   * 0. 开关（想关掉某项拦截就把 true 改成 false）
   * 0. Switches (set to false to disable a specific interceptor)
   *********************************************************************/
  const CFG = {
    BLOCK_LOG_REPORT: true, // 0-1 关闭埋点/日志上报 | Disable log reporting
    FILTER_FEED_AV_ONLY: true, // 0-2 移除广告和推广视频 | Remove ads and promotional videos
    REMOVE_PUGV_COURSE: true, // 0-3 拦截课程推荐 | Intercept course recommendations
    FILTER_DYNAMIC_FILM_ALL: true, // 0-4 拦截电视剧、电影等推荐 | Intercept TV series and movie recommendations
    CLEAR_LIVE_RECOMMEND: true, // 0-5 拦截直播推荐 | Intercept live stream recommendations
    FILTER_DYNAMIC_VARIETY: true, // 0-6 拦截综艺娱乐推荐 | Intercept variety show recommendations
    FILTER_DYNAMIC_ANIME: true, // 0-7 拦截番剧、国创等推荐 | Intercept anime and original content recommendations
    FILTER_DYNAMIC_MANGA: true, // 0-8 拦截漫画推荐 | Intercept manga recommendations
  };

  /*********************** 1. Interceptor Manager ************************/

  class RequestContext {
    constructor({ type, url, method, request, xhr }) {
      this.type = type; // 'fetch' | 'xhr'
      this.url = url;
      this.method = method || "GET";
      this.request = request; // fetch Request
      this.xhr = xhr; // XMLHttpRequest
    }
  }

  class InterceptorManager {
    #rules = [];
    use(rule) {
      this.#rules.push(rule);
    }
    find(ctx) {
      return this.#rules.find((r) => r.match(ctx));
    }
  }
  const interceptors = new InterceptorManager();

  /************************ 2. Register rules ***************************/

  /**
   * 0-1 关闭埋点 / 日志上报
   *     Disable log reporting
   */
  if (CFG.BLOCK_LOG_REPORT) {
    interceptors.use({
      match: (ctx) => ctx.url.includes("data.bilibili.com"),
      onRequest(ctx) {
        if (ctx.type === "fetch") {
          return new Response("{}", {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (ctx.type === "xhr") {
          ctx.xhr.__interceptorFinalText = "{}";
          return true; // 阻断 XHR
        }
      },
    });
  }

  /**
   * 0-2 移除广告和推广视频
   *     Remove ads and promotional videos
   */
  if (CFG.FILTER_FEED_AV_ONLY) {
    (function () {
      const FEED_API =
        "api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd";
      const filterFn = (list) => list.filter((v) => v.goto === "av");
      interceptors.use({
        match: (ctx) => ctx.url.includes(FEED_API),
        async onFetchResponse(ctx, res) {
          const data = await res.clone().json();
          if (data?.data?.item) data.data.item = filterFn(data.data.item);
          return new Response(JSON.stringify(data), {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
          });
        },
        onXHRResponse(ctx, txt) {
          try {
            const data = JSON.parse(txt);
            if (data?.data?.item) data.data.item = filterFn(data.data.item);
            return JSON.stringify(data);
          } catch {
            return txt;
          }
        },
      });
    })();
  }

  /**
   * 0-3 拦截课程推荐
   *     Intercept course recommendations
   */
  if (CFG.REMOVE_PUGV_COURSE) {
    (function () {
      const API = "api.bilibili.com/pugv/app/web/floor/switch";
      const wipe = (d) => {
        if (d?.data) {
          d.data.ranks = [];
          d.data.season = [];
        }
      };
      interceptors.use({
        match: (ctx) => ctx.url.includes(API),
        async onFetchResponse(ctx, res) {
          const data = await res.clone().json();
          wipe(data);
          return new Response(JSON.stringify(data), {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
          });
        },
        onXHRResponse(ctx, txt) {
          try {
            const data = JSON.parse(txt);
            wipe(data);
            return JSON.stringify(data);
          } catch {
            return txt;
          }
        },
      });
    })();
  }

  /**
   * 0-4 拦截电视剧、电影等推荐
   *     Intercept TV series and movie recommendations
   */
  if (CFG.FILTER_DYNAMIC_FILM_ALL) {
    (function () {
      const API = "api.bilibili.com/x/web-interface/dynamic/region";
      const wipe = (d) => {
        if (d?.data) d.data.archives = [];
      };

      interceptors.use({
        match: (ctx) => ctx.url.includes(API),

        async onFetchResponse(ctx, res) {
          const data = await res.clone().json();
          wipe(data);
          return new Response(JSON.stringify(data), {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
          });
        },

        onXHRResponse(ctx, txt) {
          try {
            const data = JSON.parse(txt);
            wipe(data);
            return JSON.stringify(data);
          } catch {
            return txt;
          }
        },
      });
    })();
  }

  /**
   * 0-5 拦截直播推荐
   *     Intercept live stream recommendations
   */
  if (CFG.CLEAR_LIVE_RECOMMEND) {
    (function () {
      const API =
        "api.live.bilibili.com/xlive/web-interface/v1/webMain/getMoreRecList";
      const wipe = (d) => {
        if (d?.data) {
          d.data.recommend_room_list = [];
          d.data.top_room_id = 0;
        }
      };
      interceptors.use({
        match: (ctx) => ctx.url.includes(API),
        async onFetchResponse(ctx, res) {
          const data = await res.clone().json();
          wipe(data);
          return new Response(JSON.stringify(data), {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
          });
        },
        onXHRResponse(ctx, txt) {
          try {
            const data = JSON.parse(txt);
            wipe(data);
            return JSON.stringify(data);
          } catch {
            return txt;
          }
        },
      });
    })();
  }

  /**
   * 0-6 拦截综艺娱乐推荐
   *     Intercept variety show recommendations
   */
  if (CFG.FILTER_DYNAMIC_VARIETY) {
    (function () {
      const API = "api.bilibili.com/pgc/web/variety/feed";
      const wipe = (d) => {
        if (d?.data) {
          d.data.cursor = "";
          d.data.list = [];
        }
      };

      interceptors.use({
        match: (ctx) => ctx.url.includes(API),

        async onFetchResponse(ctx, res) {
          const data = await res.clone().json();
          wipe(data);
          return new Response(JSON.stringify(data), {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
          });
        },

        onXHRResponse(ctx, txt) {
          try {
            const data = JSON.parse(txt);
            wipe(data);
            return JSON.stringify(data);
          } catch {
            return txt;
          }
        },
      });
    })();
  }

  /**
   * 0-7 拦截番剧、国创等推荐
   *     Intercept anime and original content recommendations
   */
  if (CFG.FILTER_DYNAMIC_ANIME) {
    (function () {
      const API = "api.bilibili.com/pgc/web/timeline/v2";
      const wipe = (d) => {
        if (d?.result) {
          d.result.latest = [];
          d.result.timeline = [];
        }
      };

      interceptors.use({
        match: (ctx) => ctx.url.includes(API),

        async onFetchResponse(ctx, res) {
          const data = await res.clone().json();
          wipe(data);
          return new Response(JSON.stringify(data), {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
          });
        },

        onXHRResponse(ctx, txt) {
          try {
            const data = JSON.parse(txt);
            wipe(data);
            return JSON.stringify(data);
          } catch {
            return txt;
          }
        },
      });
    })();
  }

  /**
   * 0-8 拦截漫画推荐
   *     Intercept manga recommendations
   */
  if (CFG.FILTER_DYNAMIC_ANIME) {
    (function () {
      const API = "manga.bilibili.com/twirp/comic.v1.MainStation/Feed";
      const wipe = (d) => {
        if (d?.data) {
          d.data.list = [];
          d.data.total = 0;
        }
      };

      interceptors.use({
        match: (ctx) => ctx.url.includes(API),

        async onFetchResponse(ctx, res) {
          const data = await res.clone().json();
          wipe(data);
          return new Response(JSON.stringify(data), {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
          });
        },

        onXHRResponse(ctx, txt) {
          try {
            const data = JSON.parse(txt);
            wipe(data);
            return JSON.stringify(data);
          } catch {
            return txt;
          }
        },
      });
    })();
  }

  /*********************** 3. Fetch hook ************************/

  const nativeFetch = window.fetch;
  window.fetch = async function (input, init) {
    const url = typeof input === "string" ? input : input.url;
    const ctx = new RequestContext({
      type: "fetch",
      url,
      method: init?.method || input?.method,
      request: input,
    });
    const rule = interceptors.find(ctx);
    if (rule?.onRequest) {
      const res = rule.onRequest(ctx);
      if (res) return res;
    }
    const response = await nativeFetch.call(this, input, init);
    if (rule?.onFetchResponse) {
      try {
        return await rule.onFetchResponse(ctx, response);
      } catch (e) {
        console.error("[Interceptor] fetch", e);
      }
    }
    return response;
  };

  /*********************** 4. XHR hook **************************/

  const nativeOpen = XMLHttpRequest.prototype.open;
  const nativeSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.__interceptorCtx = new RequestContext({
      type: "xhr",
      url,
      method,
      xhr: this,
    });
    nativeOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (body) {
    const ctx = this.__interceptorCtx;
    const rule = ctx && interceptors.find(ctx);

    if (rule?.onRequest && rule.onRequest(ctx)) {
      finishXHR(this, ctx, ctx.xhr.__interceptorFinalText ?? "");
      return;
    }

    if (rule?.onXHRResponse) {
      this.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          try {
            const newText = rule.onXHRResponse(ctx, this.responseText);
            overwriteResponse(this, newText);
          } catch (e) {
            console.error("[Interceptor] xhr", e);
          }
        }
      });
    }
    nativeSend.call(this, body);
  };

  /************************ helpers ****************************/

  function overwriteResponse(xhr, text) {
    const desc = { configurable: true, get: () => text };
    try {
      Object.defineProperty(xhr, "responseText", desc);
      Object.defineProperty(xhr, "response", desc);
    } catch {
      /* read-only browsers */
    }
  }

  function finishXHR(xhr, ctx, text) {
    overwriteResponse(xhr, text);
    xhr.readyState = 4;
    xhr.status = 200;
    xhr.statusText = "OK";
    xhr.dispatchEvent(new Event("readystatechange"));
    xhr.dispatchEvent(new Event("load"));
    xhr.dispatchEvent(new Event("loadend"));
  }
})();
