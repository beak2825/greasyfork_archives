// ==UserScript==
// @name clash group proxy
// @namespace http://tampermonkey.net/
// @version 0.1
// @description hello world
// @author ayasetan
// @license MIT
// @icon https://raw.githubusercontent.com/Dreamacro/clash/master/docs/logo.png
// @match http://clash.nas.lan/ui/*
// @downloadURL https://update.greasyfork.org/scripts/455539/clash%20group%20proxy.user.js
// @updateURL https://update.greasyfork.org/scripts/455539/clash%20group%20proxy.meta.js
// ==/UserScript==

  /*
    hello world
  */


(function() {
  "use strict";
  const main = () => {
    if (location.hash !== "#/proxies") {
      return;
    }
    const proxyItems = Array.from(document.querySelectorAll(".proxy-item"));
    const goodKey = "good";
    const allProxy = proxyItems.reduce((pre, curr) => {
      if (curr.matches(".proxy-error")) {
        return pre;
      }
      const deley = Number(curr.querySelector(".proxy-delay").textContent.slice(0, -2));
      if (deley > 600 || deley === 0) {
        return pre;
      }
      const name = curr.querySelector(".proxy-name").textContent;
      pre[goodKey] ? pre[goodKey].push(name) : pre[goodKey] = [name];
      return pre;
    }, {});
    const buf = [];
    const goodProxies = groupByName(...allProxy[goodKey]);
    for (const k of Object.keys(goodProxies).sort()) {
      const v = goodProxies[k];
      const s = `${k}: ${v.length}`;
      buf.push(s);
    }
    buf.push(`total: ${allProxy[goodKey].length}`);
    window.alert(buf.join("\n"));
  };
  const groupByName = (...names) => {
    var _a, _b;
    const grp = {};
    const keyReg = /^(\w+\d*).*/i;
    for (const name of names) {
      const k = (_b = (_a = name.match(keyReg)) == null ? void 0 : _a[1]) != null ? _b : "other";
      grp[k] ? grp[k].push(name) : grp[k] = [name];
    }
    return grp;
  };
  setTimeout(main, 1e3);
})();
