// ==UserScript==
// @name         [snolab] batch-search
// @name:zh      [雪星实验室] 批量搜索
// @namespace    https://userscript.snomiao.com/
// @version      0.0.1
// @description  Batch search from multi sourcees.
// @author       snomiao@gmail.com
// @match        http*://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465286/%5Bsnolab%5D%20batch-search.user.js
// @updateURL https://update.greasyfork.org/scripts/465286/%5Bsnolab%5D%20batch-search.meta.js
// ==/UserScript==

const engines = {
  Page: {
    Google: "https://www.google.com/search?q=%s",
    LuckyGoogle: "https://www.google.com/search?btnI&q=%*",
    Magi: "https://magi.com/search?q=%s",
  },
  Knowledge: {
    Magi: "https://magi.com/search?q=%s",
    Google: "https://www.google.com/search?q=%s",
    Wiki: "https://www.google.com/search?q=%s",
    FreeMDict: "https://forum.freemdict.com/search?q=%s",
    FreeMDict: "https://forum.freemdict.com/search?q=%s",
  },
  Book: {
    Book4you: "https://book4you.org/s/%*",
    douban: "https://search.douban.com/book/subject_search?search_text=%*",
  },
  Torrent: { 1337: "https://www.1377x.to/search/%*/1/" },
  Movie: {},
  Video: {},
  Music: {},
  Model: { Google: "https://www.google.com/search?q=%s" },
  Image: {},
};
const enginess = JSON.parse(JSON.stringify(engines).replace(/%s|%\*/g, s));
