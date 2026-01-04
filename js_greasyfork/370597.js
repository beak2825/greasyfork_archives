// ==UserScript==
// @name         虾米高清音频下载助手
// @namespace    xiami music downloader_by_axel10
// @version      0.1
// @description  基于虾米高清歌曲下载兼容版 https://greasyfork.org/zh-CN/scripts/28463-虾米高清歌曲下载兼容版/feedback# 适配https
// @author       axel10
// @match        https://www.xiami.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370597/%E8%99%BE%E7%B1%B3%E9%AB%98%E6%B8%85%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/370597/%E8%99%BE%E7%B1%B3%E9%AB%98%E6%B8%85%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var init = function () {
    var GM_xmlhttpRequest = function (options) {
      var xhr = new XMLHttpRequest();
      xhr.open(options.method, options.url);
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.setRequestHeader('Referer', 'https://www.xiami.com');
      xhr.setRequestHeader('Origin', 'https://www.xiami.com');
      xhr.onload = function () {
        options.onload(xhr);
      };
      xhr.send();
    };
    function GetLocation(str) {
      var loc2 = Number(str[0]);
      var loc4 = Math.floor((str.length - 1) / loc2);
      var loc5 = (str.length - 1) % loc2;
      var index = - 1;
      var result = '';
      for (var i = 0; i < loc4 + 1; i++) {
        for (var j = 0; j < loc2; j++) {
          index = j < loc5 ? (loc4 + 1) * j + i + 1 : loc4 * (j - loc5) + (loc4 + 1) * loc5 + i + 1;
          if (j >= loc5 && i == loc4) break;
          result += str[index];
        }
      }
      result = unescape(result).replace(/\^/gi, '0').replace(/\+/gi, ' ');
      return result;
    }
    var Fmdownload = function (obj) {
      var req = GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://www.xiami.com/song/gethqsong/sid/' + obj.songId,
        headers: {
          'Referer': 'https://www.xiami.com'
        },
        onload: function (res) {
          var n = JSON.parse(res.responseText);
          if (n.status == 1) {
            var url = GetLocation(n.location);
            var a = document.createElement('a');
            a.href = url;
            a.download = obj.songName.replace(/[\<\>\\\/\|\:\"\*\?\r\n]/gi, '') + '.mp3';
            var ev = document.createEvent('MouseEvents');
            ev.initEvent('click', true, true);
            a.dispatchEvent(ev);
          } else {
            alert('无法下载！');
          }
        }
      });
    };
    if (typeof window.Fm_download == 'function') window.Fm_download = Fmdownload;
    if (typeof window.prepareZipx == 'function') {
      var oldpz = window.prepareZipx;
      window.prepareZipx = function (type, id) {
        if (type == 'song') {
          var title = document.querySelector('div[data-id=\'' + id + '\'] a');
          title = title ? title.innerHTML : id;
          Fmdownload({
            songId: id,
            songName: title
          });
        } else {
          if (oldpz) oldpz.call(this, arguments);
        }
      };
    }
    if (typeof window.buyMusic == 'function') {
      var oldbm = window.buyMusic;
      window.buyMusic = function (type, id) {
        if (type == 'song') {
          var title = document.querySelector('div[data-id=\'' + id + '\'] a');
          title = title ? title.innerHTML : id;
          Fmdownload({
            songId: id,
            songName: title
          });
        } else {
          if (oldbm) oldbm.call(this, arguments);
        }
      };
    }
    if (typeof window.xm_download == 'function') {
      var oldxmd = window.xm_download;
      window.xm_download = function (id, type, _this) {
        if (type == 'song') {
          var title = $(_this).closest('tr').find('.song_name a:eq(0)');
          title = title.length ? title.text()  : ($('#title h1').text() || _this.title || id);
          Fmdownload({
            songId: id,
            songName: title
          });
        } else {
          if (oldxmd) oldxmd.call(this, arguments);
        }
      };
    }
    if (typeof window.promotion_download == 'function') {
      window.promotion_download = function (id, x, ar, _this) {
        var title = $(_this).closest('li').find('.song_name a:eq(0)');
        title = title.length ? title.text().replace(/(^\s|\s$)/gi, '')  : id;
        Fmdownload({
          songId: id,
          songName: title
        });
      };
    }
     if (typeof window.downloadToPC == 'function') {
      window.downloadToPC = function (id) {
        var title = $('[data-id="' + id + '"]>a').html();
        Fmdownload({
          songId: id,
          songName: title
        });
      };
    }
  };
  window.addEventListener('load', init);
}) ();