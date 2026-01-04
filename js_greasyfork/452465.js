// ==UserScript==
// @name        NGA Agent
// @namespace   https://greasyfork.org/users/263018
// @version     1.5.3
// @author      snyssss
// @description 非常时期的非常手段
// @license     MIT

// @match       *://bbs.nga.cn/*
// @match       *://ngabbs.com/*
// @match       *://nga.178.com/*

// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/452465/NGA%20Agent.user.js
// @updateURL https://update.greasyfork.org/scripts/452465/NGA%20Agent.meta.js
// ==/UserScript==

(({ commonui: ui, __CURRENT_UID: uid, _LOADERREAD: loader }) => {
  !function(t,r){for(var n in r)t[n]=r[n]}(window,function(t){function r(e){if(n[e])return n[e].exports;var o=n[e]={i:e,l:!1,exports:{}};return t[e].call(o.exports,o,o.exports,r),o.l=!0,o.exports}var n={};return r.m=t,r.c=n,r.i=function(t){return t},r.d=function(t,n,e){r.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:e})},r.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(n,"a",n),n},r.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)},r.p="",r(r.s=2)}([function(t,r,n){"use strict";function e(t,r){var n={};for(var e in t)n[e]=t[e];return n.target=n.currentTarget=r,n}function o(t,r){function n(r){return function(){var n=this.hasOwnProperty(r+"_")?this[r+"_"]:this.xhr[r],e=(t[r]||{}).getter;return e&&e(n,this)||n}}function o(r){return function(n){var o=this.xhr,i=this,u=t[r];if("on"===r.substring(0,2))i[r+"_"]=n,o[r]=function(u){u=e(u,i),t[r]&&t[r].call(i,o,u)||n.call(i,u)};else{var c=(u||{}).setter;n=c&&c(n,i)||n,this[r+"_"]=n;try{o[r]=n}catch(t){}}}}function i(r){return function(){var n=[].slice.call(arguments);if(t[r]){var e=t[r].call(this,n,this.xhr);if(e)return e}return this.xhr[r].apply(this.xhr,n)}}return r=r||window,r[c]=r[c]||r.XMLHttpRequest,r.XMLHttpRequest=function(){for(var t=new r[c],e=0;e<a.length;++e){var f="on"+a[e];void 0===t[f]&&(t[f]=null)}for(var s in t){var l="";try{l=u(t[s])}catch(t){}"function"===l?this[s]=i(s):Object.defineProperty(this,s,{get:n(s),set:o(s),enumerable:!0})}var h=this;t.getProxy=function(){return h},this.xhr=t},Object.assign(r.XMLHttpRequest,{UNSENT:0,OPENED:1,HEADERS_RECEIVED:2,LOADING:3,DONE:4}),r[c]}function i(t){t=t||window,t[c]&&(t.XMLHttpRequest=t[c]),t[c]=void 0}Object.defineProperty(r,"__esModule",{value:!0});var u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r.configEvent=e,r.hook=o,r.unHook=i;var c="__xhr",a=r.events=["load","loadend","timeout","error","readystatechange","abort"]},,function(t,r,n){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.ah=void 0;var e=n(0);r.ah={hook:e.hook,unHook:e.unHook}}]));
  //# sourceMappingURL=ajaxhook.core.min.js.map

  // KEY
  const USER_AGENT_KEY = "USER_AGENT_KEY";
  const AUTO_CHECK_IN_ENABLE_KEY = "AUTO_CHECK_IN_ENABLE_KEY";
  const AUTO_CHECK_IN_LAST_TIME_KEY = "AUTO_CHECK_IN_LAST_TIME_KEY";

  // User Agent
  const USER_AGENT = (() => {
    const data = GM_getValue(USER_AGENT_KEY) || "Nga_Official";

    GM_registerMenuCommand(`修改UA：${data}`, () => {
      const value = prompt("修改UA", data);

      if (value) {
        GM_setValue(USER_AGENT_KEY, value);

        location.reload();
      }
    });

    return data;
  })();

  // RedirectUri
  const redirectUri = (() => {
    const params = new URLSearchParams(location.search);

    return params.get("redirectUri");
  })();

  // Skip
  if (!document.title || location.href.indexOf('/misc/') > 0 || location.search.match(/(lib=login)|(favor=)/)) {
    return;
  }

  // Hook
  const hooked = (() => {
    const isSameOrigin = (url) => {
      return url.indexOf("/") === 0 || url.indexOf(location.host) >= 0;
    }

    if (ui && ui.hooked) {
      return true;
    }

    if (location.hash.match(/^#pid(\d+)Anchor$/)) {
      const pid = parseInt(location.hash.match(/^#pid(\d+)Anchor$/)[1], 10);

      if (ui &&
          ui.postArg &&
          Object.values(ui.postArg.data).findIndex(item => item.pid === pid) < 0) {
        return false;
      }
    }

    if (ui && loader) {
      ah.hook(
        {
          open: (args, xhr) => {
            xhr._url = args[1];

            return false;
          },
          send: (_, xhr) => {
            const url = xhr._url || "";

            if (isSameOrigin(url)) {
              xhr.setRequestHeader("X-User-Agent", USER_AGENT);
              xhr.overrideMimeType("text/plain; charset=gb2312");
            }

            return false;
          },
        },
        ui._w
      );

      const f = __NUKE.doRequest;

      __NUKE.doRequest = (args) => {
        const u = args.u.u || args.u;
        const a = args.u.a || {};

        if (isSameOrigin(u)) {
          return f({
            ...args,
            xr: 1,
            u: {
              u,
              a: {
                ...a,
                __output: 1,
                __inchst: 'UTF8'
              },
            },
          });
        }

        return f(args);
      };


      ui.hooked = true;

      return true;
    }

    return false;
  })();

  // Redirect
  if (!hooked && redirectUri === null) {
    location.href = `/?redirectUri=${encodeURIComponent(location.href)}`;
    return;
  }

  // Clear body event
  (() => {
    const temp = document.createElement("DIV");

    temp.append(...document.body.childNodes);

    document.body.outerHTML = document.body.outerHTML;
    document.body.innerHTML = "";
    document.body.append(...temp.childNodes);
  })();

  // Reload lib
  (() => {
    const { topicArg, postArg } = ui;

    __SCRIPTS.syncLoad("forum", "loaderRead", () => {
      loader = unsafeWindow._LOADERREAD;

      if (loader) {
        loader.init();

        // Reload page
        if (redirectUri) {
          loader.go(33, {
            url: encodeURI(decodeURIComponent(redirectUri)),
          });
        } else {
          (() => {
            if (topicArg && topicArg.data.find(item => item[14] > 0)) {
              return;
            }

            if (postArg && Object.values(postArg.data).length > 1) {
              return;
            }

            loader.go(5, {
              url: location.href,
            });
          })();
        }

        ui.topicArg = topicArg;
      }
    });
  })();

  // Auto check in
  (() => {
    const autoCheckInEnable = GM_getValue(AUTO_CHECK_IN_ENABLE_KEY) || false;
    const autoCheckInLastTime = GM_getValue(AUTO_CHECK_IN_LAST_TIME_KEY) || 0;

    if (autoCheckInEnable) {
      GM_registerMenuCommand("自动签到：启用", () => {
        GM_setValue(AUTO_CHECK_IN_ENABLE_KEY, false);
        GM_setValue(AUTO_CHECK_IN_LAST_TIME_KEY, 0);
        location.reload();
      });
    } else {
      GM_registerMenuCommand("自动签到：禁用", () => {
        GM_setValue(AUTO_CHECK_IN_ENABLE_KEY, true);
        location.reload();
      });
    }

    if (autoCheckInEnable && uid) {
      const today = new Date();

      const lastTime = new Date(autoCheckInLastTime);

      const isToday =
        lastTime.getDate() === today.getDate() &&
        lastTime.getMonth() === today.getMonth() &&
        lastTime.getFullYear() === today.getFullYear();

      if (isToday === false) {
        fetch(`/nuke.php?__lib=check_in&__act=check_in&lite=js`, {
          method: "POST",
          headers: {
            "X-User-Agent": USER_AGENT,
          },
        })
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();

            reader.onload = () => {
              const text = reader.result;
              const result = JSON.parse(
                text.replace("window.script_muti_get_var_store=", "")
              );

              const { data, error } = result;

              if (data || error) {
                alert((data || error)[0]);
              }

              GM_setValue(AUTO_CHECK_IN_LAST_TIME_KEY, today.getTime());
            };

            reader.readAsText(blob, "GBK");
          });
      }
    }
  })();
})(unsafeWindow);
