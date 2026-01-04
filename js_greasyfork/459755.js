// ==UserScript==
// @name         Bilibili Subtitle Tweaks
// @namespace    Kr328/bilibili-subtitle-tweaks
// @version      1.5
// @author       Kr328
// @description  增强 Bilibili 番剧的 CC 字幕，包含自动翻译及自动断行功能。
// @license      GPLv3
// @icon         https://www.bilibili.com/favicon.ico
// @match        *://www.bilibili.com/bangumi/play/*
// @require      https://cdn.jsdelivr.net/npm/ajax-hook@3.0.3/dist/ajaxhook.min.js
// @require      https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/t2cn.js
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/459755/Bilibili%20Subtitle%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/459755/Bilibili%20Subtitle%20Tweaks.meta.js
// ==/UserScript==

(function (ajaxHook, OpenCC) {
  'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const OpenCC__namespace = /*#__PURE__*/_interopNamespaceDefault(OpenCC);

  // src/native/alias.ts
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();

  (() => {
    const translator = OpenCC__namespace.Converter({ from: "twp", to: "cn" });
    function absoluteUrl(relativeUrl2, protocol) {
      if (!protocol) {
        protocol = "https:";
      }
      return relativeUrl2.startsWith("//") ? protocol + relativeUrl2 : relativeUrl2;
    }
    function relativeUrl(absoluteUrl2) {
      const u = new URL(absoluteUrl2);
      return u.href.substring(u.protocol.length);
    }
    function formatable(text) {
      return text.replace("\n", "\\n");
    }
    function log(msg) {
      console.log(`%c[SubtitleTweaks] ${msg}`, `color: #5bc6f4;`);
    }
    ajaxHook.proxy({
      onRequest: (config, handler) => {
        const url = new URL(absoluteUrl(config.url));
        switch (true) {
          case (url.hostname.endsWith("hdslb.com") && /bfs\/subtitle\/[a-z0-9]+\.json/.test(url.pathname)): {
            config.originUrl = url.toString();
            config.transform = true;
            if (url.searchParams.has("translate")) {
              url.searchParams.delete("translate");
              config.translate = true;
            }
            config.url = relativeUrl(url.toString());
            break;
          }
          case (url.hostname === "api.bilibili.com" && ("/x/player/wbi/v2" == url.pathname || "/x/player/v2" == url.pathname)): {
            config.inject = true;
            break;
          }
        }
        handler.next(config);
      },
      onResponse: (response, handler) => {
        if (response.config.transform === true) {
          const subtitleList = JSON.parse(response.response);
          log(`Transforming ${response.config.originUrl}`);
          subtitleList.body.forEach((value) => {
            const original = value.content;
            let result = original.replace(/\s[-—－]/, (s) => `
${s.substring(1)}`);
            if (response.config.translate === true) {
              result = translator(result);
            }
            const formatTimestamp = (timestamp2, base) => {
              return (Math.trunc(timestamp2 / base) % (base * 60)).toString().padStart(2, "0");
            };
            const timestamp = `${formatTimestamp(value.from, 3600)}:${formatTimestamp(value.from, 60)}:${formatTimestamp(value.from, 1)}`;
            log(`${timestamp}: ${formatable(original)} => ${formatable(result)}`);
            value.content = result;
          });
          response.response = JSON.stringify(subtitleList);
        } else if (response.config.inject === true) {
          log("Injecting");
          const r = JSON.parse(response.response);
          const newSubtitles = r.data.subtitle?.subtitles?.flatMap((value, index) => {
            if (value.lan === "zh-Hant") {
              const translatedValue = JSON.parse(JSON.stringify(value));
              translatedValue.lan = "zh-Hans";
              translatedValue.lan_doc = "中文（简体） - 自动翻译";
              translatedValue.id = index;
              translatedValue.id_str = translatedValue.id.toString();
              const newUrl = new URL(absoluteUrl(translatedValue.subtitle_url));
              newUrl.searchParams.append("translate", "1");
              translatedValue.subtitle_url = relativeUrl(newUrl.toString());
              return [translatedValue, value];
            }
            return [value];
          });
          if (newSubtitles) {
            r.data.subtitle.subtitles = newSubtitles;
            response.response = JSON.stringify(r);
          }
        }
        handler.next(response);
      }
    }, _unsafeWindow);
  })();

})(ah, OpenCC);