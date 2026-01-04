// ==UserScript==
// @name         yande.re link extractor
// @version      0.0.1
// @description  提前y站的特定 tag 的图片链接
// @author       ayase
// @match        https://yande.re/post?*
// @run-at document-end
// @namespace https://greasyfork.org/users/298898
// @downloadURL https://update.greasyfork.org/scripts/434553/yandere%20link%20extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/434553/yandere%20link%20extractor.meta.js
// ==/UserScript==

(() => {
  const main = async () => {
    const crawlOnce = once(crawl);
    document.body.addEventListener("keydown", async (evt) => {
      if (evt.key === " ") {
        const file_urls = await crawlOnce();
        if (!file_urls.length) {
          window.alert("no url found");
          return;
        }
        try {
          await navigator.clipboard.writeText(file_urls.join("\n"));
        } catch (err) {
          throw err;
        }
        window.alert("copy urls to clipboard success!");
      }
    });
  };

  /**
   *
   * @returns {object}
   */
  const parseParams = () => {
    const params = {};
    for (const frag of location.search.slice(1).split("&")) {
      if (frag) {
        const [key, value] = frag.split("=");
        params[key] = value;
      }
    }
    return params;
  };

  const crawl = async () => {
    const params = parseParams();
    const tags = params["tags"];
    if (!tags) {
      console.error("tags not found");
      return [];
    }

    const file_urls = [];
    let page = 1;
    while (true) {
      document.body.title = `fetch page: ${page}`;
      const url = `https://yande.re/post.json?tags=${tags}&page=${page}`;
      console.debug(url);
      const resp = await fetch(url);
      const data = await resp.json();
      if (!data.length) {
        break;
      }

      for (const post of data) {
        file_urls.push(post["file_url"]);
      }
      page += 1;
    }
    return file_urls;
  };

  const once = (fn) => {
    let called = false;
    let r;
    return async (...args) => {
      if (called) {
        return r;
      }

      called = true;
      r = await fn(...args);
      return r;
    };
  };

  main();
})();
