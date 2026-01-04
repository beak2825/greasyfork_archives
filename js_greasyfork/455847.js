// ==UserScript==
// @name find panda
// @namespace http://tampermonkey.net/
// @version 0.3
// @description check panda.chaika.moe for related galleries when searching
// @description:zh-CN 在搜索时检查panda.chaika.moe里是否有相关的画廊
// @author ayasechan
// @license LGPL
// @icon https://www.google.com/s2/favicons?sz=64&domain=e-hentai.org
// @run-at document-start
// @match https://exhentai.org/*
// @match https://e-hentai.org/*
// @grant GM_xmlhttpRequest
// @grant GM_addStyle
// @grant GM_getResourceText
// @connect panda.chaika.moe
// @resource iziToast.min.css https://cdn.jsdelivr.net/npm/izitoast@1.4.0/dist/css/iziToast.min.css
// @require https://cdn.jsdelivr.net/npm/izitoast@1.4.0/dist/js/iziToast.min.js
// @downloadURL https://update.greasyfork.org/scripts/455847/find%20panda.user.js
// @updateURL https://update.greasyfork.org/scripts/455847/find%20panda.meta.js
// ==/UserScript==

GM_addStyle(GM_getResourceText("iziToast.min.css"))


"use strict";
(() => {
  // src/lib/panda.ts
  var get = (url) => {
    return new Promise((res, rej) => {
      GM_xmlhttpRequest({
        url,
        onload: (resp) => res(resp.responseText),
        onerror: (resp) => rej(resp.error)
      });
    });
  };
  var archiveAutocompleteSearch = async (kw) => {
    const url = new URL("https://panda.chaika.moe/archive-autocomplete/");
    url.searchParams.set("q", kw);
    return await get(url.toString());
  };
  var tagSearch = async (tag) => {
    return await get(`https://panda.chaika.moe/tag/${tag}`);
  };
  var isArchiveAutocompleteFound = (content) => {
    return !content.includes(
      '<span class="block"><em>No matches found</em></span>'
    );
  };
  var isTagFound = (content) => {
    return !content.includes("<strong>No results</strong>");
  };

  // src/lib/parse.ts
  var parseFsearch = (url) => {
    let fsearch = new URL(url).searchParams.get("f_search");
    if (!fsearch) {
      return [];
    }
    fsearch = fsearch.replace(/\$/g, "");
    fsearch = fsearch.replace(/\s+(?=(?:(?:[^"]*"){2})*[^"]*"[^"]*$)/g, "_");
    fsearch = fsearch.replace(/"/g, "");
    const matches = fsearch.match(/(\S+)/g);
    const r = matches ? [...new Set(matches)] : [];
    return r.map((v) => {
      if (isTagWithNamespace(v)) {
        return v;
      }
      return v.replace(/_/g, " ");
    });
  };
  var parseTag = (url) => {
    const pathname = new URL(url).pathname;
    const matches = pathname.match(/\/tag\/(.+?)\/?$/i);
    return matches ? matches[1].replace(/\+/g, "_") : "";
  };
  var parseKeyword = (url) => {
    const pathname = new URL(url).pathname;
    if (pathname.startsWith("/tag")) {
      return [parseTag(url)];
    }
    return parseFsearch(url);
  };
  var isTagWithNamespace = (s) => s.includes(":");

  // src/index.ts
  var main = async () => {
    let kws = parseKeyword(location.href);
    kws = filteKws(kws);
    if (!kws.length) {
      return;
    }
    let kw = "";
    for (const v of kws) {
      let ok = false;
      if (isTagWithNamespace(v)) {
        const content = await tagSearch(v);
        ok = isTagFound(content);
      } else {
        const content = await archiveAutocompleteSearch(v);
        ok = isArchiveAutocompleteFound(content);
      }
      if (ok) {
        kw = v;
        break;
      }
    }
    if (!kw.length) {
      return;
    }
    const openPanda = () => {
      const url = new URL("https://panda.chaika.moe/search");
      const key = isTagWithNamespace(kw) ? "tags" : "title";
      url.searchParams.set(key, kw);
      window.open(url.toString());
    };
    iziToast.show({
      message: "Find a panda",
      messageColor: "#ffffff",
      color: "#363940",
      timeout: 1e4,
      position: "topRight",
      onOpened: (_, el) => {
        el.addEventListener("click", openPanda);
      },
      onClosed: (_, el) => {
        el.removeEventListener("click", openPanda);
      }
    });
  };
  var filteKws = (kws) => {
    const validNS = ["a", "artist", "g", "group", "circle"];
    return kws.reduce((pre, cur) => {
      if (isTagWithNamespace(cur)) {
        const [ns, _] = cur.split(":");
        if (validNS.includes(ns)) {
          return [cur, ...pre];
        }
        return pre;
      }
      return [...pre, cur];
    }, []);
  };
  main();
})();
