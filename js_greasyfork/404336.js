// ==UserScript==
// @name         豆瓣搜索助手
// @namespace    http://tampermonkey.net/
// @version      1.5.6
// @require      http://code.jquery.com/jquery-3.5.1.js
// @description  快速电子书及电影
// @author       稀饭
// @include      http://*douban*/*
// @include      https://*douban*/*
// @downloadURL https://update.greasyfork.org/scripts/404336/%E8%B1%86%E7%93%A3%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/404336/%E8%B1%86%E7%93%A3%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
"use strict";
/**
 *@description 去广告
 *
 */
function removeAd() {
  $("[id^=dale_]").remove();
}

/**
 *@description 电影搜索
 *
 */
function movie() {
  const movieRegx = /.*movie\.douban\.com\/subject\/\?*.*/;
  if (movieRegx.test(window.location.href)) {
    let movieId = window.location.href.split("/")[4];
    let movieName = $("h1 span").eq(0).text();
    let insertHtml = `
    <div class='gray_ad'>
      <h2>快速搜索</h2>
        <ul class='bs'>
          <li><a class='playBtn' href='http://www.mvcat.com/movie/douban/?${movieId}'target="_blank">🔥 聚合搜索 | MVCAT</a></li>
          <li><a class='playBtn' href='https://search.bilibili.com/all?keyword=${movieName}'target="_blank">⚡ 单站点搜索 | B站</a></li>
          <li><a class='playBtn' href='https://magi.com/search?q=${movieName}'target="_blank">🕸️ 知识网络 [非电影检索] | Magi</a></li>
        </ul>
    </div>
    `;
    $(".aside").prepend(insertHtml);
  }
}

/**
 *@description 书籍搜索
 *
 */
function book() {
  const bookRegx = /.*book\.douban\.com\/subject\/\?*.*/;
  if (bookRegx.test(window.location.href)) {
    let bookName = $("h1 span").eq(0).text();
    let insertHtml = `
    <div class='gray_ad'>
      <h2>快速搜索</h2>
        <ul class='bs'>
          <li><a class='playBtn' href='https://www.shudan.vip/?s=${bookName}'target="_blank">🔥 聚合搜索 | 书单网</a></li>
          <li><a class='playBtn' href='https://sobooks.cc/search/${bookName}'target="_blank">⚡ 单站点搜索 | SoBook</a></li>
          <li><a class='playBtn' href='https://epubw.com/?s=${bookName}'target="_blank">⚡ 单站点搜索 | ePUBw</a></li>
          <li><a class='playBtn' href='http://www.iread.cf/?query=${bookName}'target="_blank">👨‍💼 单站点搜索 [需登录] | i-Read</a></li>
          <li><a class='playBtn' href='https://www.google.com/search?q=site%3Agithub.com%20${bookName}'target="_blank">🧱 单站点搜索 [需科学上网] | Github</a></li>
          <li><a class='playBtn' href='http://fhbgca17fb512c184a6781b1d414ba14d694hfpn59ppo9nnf6kq5.fhgh.wap.gxlib.org/bookcd/index/search_list.do?w=${bookName}&fieldname=-1&dmcode=1987051001&desc=3'target="_blank">💿 随书光盘 [需登录] | 广西图书馆</a></li>
          <li><a class='playBtn' href='https://magi.com/search?q=${bookName}'target="_blank">🕸️ 知识网络 [非书籍检索] | Magi</a></li>
          <li><a class='playBtn' href='http://cn.epubee.com/'target="_blank">🔧 工具 | 格式转换 </a></li>
        </ul>
    </div>
    `;
    $(".aside").prepend(insertHtml);
  }
}
function run() {
  removeAd();
  movie();
  book();
}
run();

