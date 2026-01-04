// ==UserScript==
// @name         NUIST 工具集
// @namespace    howardzhangdqs/nuist_toolkit
// @version      0.0.0
// @author       HowardZhangdqs
// @description  NUIST 学生工具集，专为砌砖宝宝体质打造
// @license      MIT
// @icon         https://bulletin.nuist.edu.cn/_upload/tpl/00/7a/122/template122/favicon.ico
// @match        https://bulletin.nuist.edu.cn/*
// @require      https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/system.min.js
// @require      https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/extras/named-register.min.js
// @require      data:application/javascript,%3B(typeof%20System!%3D'undefined')%26%26(System%3Dnew%20System.constructor())%3B
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/516537/NUIST%20%E5%B7%A5%E5%85%B7%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/516537/NUIST%20%E5%B7%A5%E5%85%B7%E9%9B%86.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .news_org,.title_bm{display:none}#container>div>div.col_news>div.col_news_con>div>ul{zoom:200%}.btt a:hover{font-size:auto!important;padding:auto!important} ");


System.register("./__entry.js", [], (function (exports, module) {
  'use strict';
  return {
    execute: (function () {

      const scriptRel = function detectScriptRel() {
        const relList = typeof document !== "undefined" && document.createElement("link").relList;
        return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
      }();
      const assetsURL = function(dep) {
        return "/" + dep;
      };
      const seen = {};
      const __vitePreload = function preload(baseModule, deps, importerUrl) {
        let promise = Promise.resolve();
        if (deps && deps.length > 0) {
          document.getElementsByTagName("link");
          const cspNonceMeta = document.querySelector(
            "meta[property=csp-nonce]"
          );
          const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
          promise = Promise.allSettled(
            deps.map((dep) => {
              dep = assetsURL(dep);
              if (dep in seen) return;
              seen[dep] = true;
              const isCss = dep.endsWith(".css");
              const cssSelector = isCss ? '[rel="stylesheet"]' : "";
              if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
                return;
              }
              const link = document.createElement("link");
              link.rel = isCss ? "stylesheet" : scriptRel;
              if (!isCss) {
                link.as = "script";
              }
              link.crossOrigin = "";
              link.href = dep;
              if (cspNonce) {
                link.setAttribute("nonce", cspNonce);
              }
              document.head.appendChild(link);
              if (isCss) {
                return new Promise((res, rej) => {
                  link.addEventListener("load", res);
                  link.addEventListener(
                    "error",
                    () => rej(new Error(`Unable to preload CSS for ${dep}`))
                  );
                });
              }
            })
          );
        }
        function handlePreloadError(err) {
          const e = new Event("vite:preloadError", {
            cancelable: true
          });
          e.payload = err;
          window.dispatchEvent(e);
          if (!e.defaultPrevented) {
            throw err;
          }
        }
        return promise.then((res) => {
          for (const item of res || []) {
            if (item.status !== "rejected") continue;
            handlePreloadError(item.reason);
          }
          return baseModule().catch(handlePreloadError);
        });
      };
      const single_matcher = (url, wildcard) => {
        const m = url.length, n = wildcard.length;
        const dp = new Array(m + 1).fill(null).map(() => new Array(n + 1).fill(false));
        dp[0][0] = true;
        for (let j = 1; j <= n; j++) {
          if (wildcard[j - 1] === "*") {
            dp[0][j] = dp[0][j - 1];
          }
        }
        for (let i = 1; i <= m; i++) {
          for (let j = 1; j <= n; j++) {
            if (wildcard[j - 1] === "*") {
              dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
            } else if (wildcard[j - 1] === "?" || wildcard[j - 1] === url[i - 1]) {
              dp[i][j] = dp[i - 1][j - 1];
            } else {
              dp[i][j] = false;
            }
          }
        }
        return dp[m][n];
      };
      const matcher = (wildcard, url = window.location.href) => {
        return wildcard.some((w) => single_matcher(url, w));
      };
      const bulletin = ["https://bulletin.nuist.edu.cn/*"];
      if (matcher(bulletin)) {
        __vitePreload(() => module.import('./main-U_ACk5uV-guocpgts.js'), void 0 );
      }

    })
  };
}));

System.register("./main-U_ACk5uV-guocpgts.js", [], (function (exports, module) {
  'use strict';
  return {
    execute: (function () {

      const parse_filename = (filename) => {
        return filename.split("：").splice(1).join("：");
      };
      document.querySelectorAll("a[sudyfile-attr]").forEach((element) => {
        if (element.hasAttribute("sudyfile-attr")) {
          console.log(element.getAttribute("sudyfile-attr"));
          element.setAttribute(
            "download",
            parse_filename(
              eval(`(${element.getAttribute("sudyfile-attr") || "{'title': 'null'}"})`).title
            )
          );
        }
      });

    })
  };
}));

System.import("./__entry.js", "./");