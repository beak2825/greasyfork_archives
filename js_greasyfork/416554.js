// ==UserScript==
// @name            View All Editorials
// @name:ja         解説ぜんぶ見る
// @description     View all editorials of the AtCoder contest in one page.
// @description:ja  AtCoderコンテストの解説ページに、すべての問題の解説をまとめて表示します。
// @version         1.5.0
// @icon            https://www.google.com/s2/favicons?domain=atcoder.jp
// @match           https://atcoder.jp/contests/*/editorial
// @match           https://atcoder.jp/contests/*/editorial?*
// @grant           GM_addStyle
// @require         https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.js
// @require         https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/contrib/auto-render.min.js
// @require         https://cdn.jsdelivr.net/npm/timeago@1.6.7/jquery.timeago.min.js
// @namespace       https://gitlab.com/w0mbat/user-scripts
// @author          w0mbat
// @downloadURL https://update.greasyfork.org/scripts/416554/View%20All%20Editorials.user.js
// @updateURL https://update.greasyfork.org/scripts/416554/View%20All%20Editorials.meta.js
// ==/UserScript==

(async function () {
  'use strict';
  console.log(`🐻 "View All Editorials" initializing... 🐻`)

  // Utils
  const appendHeadChild = (tagName, options) =>
    Object.assign(document.head.appendChild(document.createElement(tagName)), options);
  const addScript = (src) => new Promise((resolve) => {
    appendHeadChild('script', { src, type: 'text/javascript', onload: resolve });
  });
  const addStyleSheet = (src) => new Promise((resolve) => {
    appendHeadChild('link', { rel: 'stylesheet', href: src, onload: resolve });
  });
  const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // KaTeX
  const loadKaTeX = async () =>
    await addStyleSheet("https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.css");
  const kaTexOptions = {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ],
    ignoredTags: ["script", "noscript", "style", "textarea", "code", "option"],
    ignoredClasses: ["prettyprint", "source-code-for-copy"],
    throwOnError: false
  };
  const renderKaTeX = (rootDom) => {
    /* global renderMathInElement */
    renderMathInElement && renderMathInElement(rootDom, kaTexOptions);
  };

  // code-prettify
  const loadPrettifier = async () => {
    await addScript("https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js?autorun=false");
  };
  /* global PR */
  const runPrettifier = () => PR.prettyPrint();

  // jQuery TimeAgo
  const loadTimeAgo = async () => {
    /* global LANG */
    if (LANG == 'ja') await addScript("https://cdn.jsdelivr.net/npm/timeago@1.6.7/locales/jquery.timeago.ja.min.js");
  };
  const renderTimeAgo = () => {
    /* global $ */
    $("time.timeago").timeago();
    $('.tooltip-unix').each(function () {
      var unix = parseInt($(this).attr('title'), 10);
      if (1400000000 <= unix && unix <= 5000000000) {
        var date = new Date(unix * 1000);
        $(this).attr('title', date.toLocaleString());
      }
    });
    $('[data-toggle="tooltip"]').tooltip();
  };

  // Editorials Loader
  const editorialBodyQuery = "#main-container > div.row > div:nth-child(2)";
  const scrape = (doc) => [
    doc.querySelector(`${editorialBodyQuery} > div:nth-of-type(1)`),
    doc.querySelector(`${editorialBodyQuery} > div:nth-of-type(2)`),
  ];
  const fetchEditorial = async (link) => {
    const response = await fetch(link.href);
    if (!response.ok) throw "Fetch failed";
    const [content, history] = scrape(new DOMParser().parseFromString(await response.text(), 'text/html'));
    if (!content) throw "Scraping failed";
    return [content, history];
  };
  const renderEditorial = (link, content, history) => {
    const div = link.parentNode.appendChild(document.createElement('div'));
    div.classList.add('🐻-editorial-content');
    div.appendChild(content);
    if (history) div.appendChild(history);
    renderKaTeX(div);
    renderTimeAgo();
    runPrettifier();
  };
  const loadEditorial = async (link) => {
    const [content, history] = await fetchEditorial(link);
    renderEditorial(link, content, history);
  };

  // Lazy Loading
  const Timer = (callback, interval) => {
    let id = undefined;
    return {
      start: () => {
        if (id) return;
        callback();
        id = setInterval(callback, interval);
      },
      stop: () => {
        if (!id) return;
        clearInterval(id);
        id = undefined;
      },
    };
  };
  const Queue = (task, interval) => {
    const set = new Set();
    let timer = Timer(() => {
      for (const element of set) {
        task(element);
        set.delete(element);
        break;
      }
      if (set.size == 0) timer.stop();
    }, interval);
    return {
      add: (element) => {
        set.add(element);
        timer.start();
      },
      remove: (element) => set.delete(element),
    };
  };
  let unobserveEditorialLink = undefined;
  const queue = Queue(async (link) => {
    await loadEditorial(link)
      .catch(ex => console.warn(`🐻 Something wrong: "${link.href}", ${ex}`));
    unobserveEditorialLink(link);
  }, 200);
  const intersectionCallback = async (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) queue.add(entry.target);
      else queue.remove(entry.target);
    }
  };
  const observeEditorialLinks = (links) => {
    const observer = new IntersectionObserver(intersectionCallback);
    unobserveEditorialLink = (link) => observer.unobserve(link);
    links.forEach(e => observer.observe(e));
  };

  // initialize
  const init = async () => {
    GM_addStyle(`
      pre code { tab-size: 4; }
      ${editorialBodyQuery} > ul > li { font-size: larger; }
      .🐻-editorial-content { margin-top: 0.3em; font-size: smaller; }
    `);
    await loadKaTeX();
    await loadPrettifier();
    await loadTimeAgo();
  };

  // main
  await init();
  const internalEditorialLink = (link) => link.href.match(/\/contests\/.+\/editorial\//);
  const notSpoiler = (link) => !link.classList.contains('spoiler');
  const links = [...document.getElementsByTagName('a')].filter(internalEditorialLink).filter(notSpoiler);
  if (links.length > 0) observeEditorialLinks(links);

  console.log(`🐻 "View All Editorials" initialized. 🐻`)
})();
