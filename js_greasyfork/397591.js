// ==UserScript==
// @name           豆瓣FM播放列表导出
// @description    豆瓣FM播放列表导出脚本，在豆瓣FM页面等待“我的红心”加载完毕后自动返回顶部，点击“导出歌单”就可以下载。
// @author         liuzelei
// @@supportURL    https://github.com/liuzelei/tampermonkey
// @grant          none
// @require        https://code.jquery.com/jquery-latest.js
// @require        https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js
// @include        https://fm.douban.com/*
// @version        1.0.0
// @icon           https://douban.fm/favicon.ico
// @run-at         document-end
// @namespace      liuzelei.name
// @downloadURL https://update.greasyfork.org/scripts/397591/%E8%B1%86%E7%93%A3FM%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/397591/%E8%B1%86%E7%93%A3FM%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var total_songs = 0;
  var current_songs = 0;

  function loadPlaylistToEnd() {
    setTimeout(function () {
      total_songs = $("div.header-cover").text().split(" ")[0].replace("Icon", "");
      console.log("total songs: " + total_songs);
      window.scrollTo(0, document.body.scrollHeight);
      current_songs = $("ul.songlist > li.songlist-song").length;
      console.log("current load songs: " + current_songs);
      if (current_songs < total_songs) {
        loadPlaylistToEnd();
      } else {
        window.scrollTo(0, 0);
      }
    }, 2000);
  }

  function insertButton() {
    console.log("insert button");
    console.log();
    $("div.section-switcher.section-switcher-mine").find('ul').append("<li class='current tab-export'><a href='#'>导出歌单</a></li>");
    $("li.current.tab-export").on("click", savePlaylist);
  }

  function savePlaylist() {
    let string_playlist = "";
    var playlist_name = "douban_fm";

    $("li.songlist-song").each(function () {
      string_playlist = string_playlist + $(this).find('div > div.titles > h3 > span.link').text() + ' - ' + $(this).find('div > div.titles > p > span > a').text() + "\r\n";
    });

    var blob = new Blob([string_playlist], { type: "text/plain;charset=utf-8" });

    saveAs(blob, playlist_name + ".txt");
  }

  if (window.top != window.self) {
    return;
  }

  $(document).ready(function () {
    insertButton();
    loadPlaylistToEnd();
  });
})();
