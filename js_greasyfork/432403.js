// ==UserScript==
// @name        导出网易云、QQ 音乐、酷狗链接
// @description 导出网易云、QQ 音乐链接，请提前登陆
// @namespace   https://github.com/mayandev/export-neteast-music-link
// @version     0.0.3
// @author      mayandev
// @match       http*://music.163.com/*
// @match       http*://y.qq.com/*
// @match       http*://www.kugou.com/*
// @supportURL  https://github.com/mayandev/export-neteast-music-link/issues
// @license     GPL License
// @run-at      document-end
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/432403/%E5%AF%BC%E5%87%BA%E7%BD%91%E6%98%93%E4%BA%91%E3%80%81QQ%20%E9%9F%B3%E4%B9%90%E3%80%81%E9%85%B7%E7%8B%97%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/432403/%E5%AF%BC%E5%87%BA%E7%BD%91%E6%98%93%E4%BA%91%E3%80%81QQ%20%E9%9F%B3%E4%B9%90%E3%80%81%E9%85%B7%E7%8B%97%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function addStyle(code) {
    let y = document.createElement('style');
    y.innerHTML = code;
    document.getElementsByTagName('head')[0].appendChild(y);
  }

  function addButton(insertDom) {
    const btnCode = '<button id="export-button">导出内容</button>';
    return $(insertDom).before(btnCode);
  }

  function convertToCSV(objArray) {
    let array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        if (line != '') {
          line += ',';
        }
        line += array[i][index];
      }
      str += `${line }\r\n`;
    }
    return str;
  }

  function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
      items.unshift(headers);
    }

    // Convert Object to JSON
    let jsonObject = JSON.stringify(items);

    let csv = convertToCSV(jsonObject);

    let exportedFilenmae = `${fileTitle }.csv` || 'export.csv';
    let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
      let link = document.createElement('a');
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        let url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', exportedFilenmae);
        link.setAttribute('target', '_blank');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  function getNetEaseMusicList() {
    let list = [];
    $('.item.f-cb').each(function (index, item) {
      const link = `https://music.163.com/${ $(item).find('.w0').find('a').attr('href')}`;
      const songName = $(item).find('.w0').find('b').attr('title');
      const artist = $(item).find('.w1').find('a').text();
      list.push({ link, songName, artist });
    });
    return list;
  }

  function getQQMusicList() {
    let list = [];
    $('.songlist__list li').each(function (index, item) {
      const link = `https://y.qq.com/${ $(item).find('.songlist__songname_txt').find('a').attr('href')}`;
      const songName = $(item).find('.songlist__songname_txt').find('a').attr('title');
      const artist = $(item).find('.songlist__artist').find('a').attr('title');
      list.push({ songName, artist, link });
    });
    return list;
  }

  function getKugouList() {
    let list = [];
    $('.list_content li').each(function (index, item) {
      const songNameAndArtist = $(item).find('.width_f_li').find('a').attr('title');
      const [artist, songName] = songNameAndArtist.split(' - ');
      list.push({ songName, artist, link: '-' });
    });
    return list;
  }

  function init() {
    const musicSites = [
      {
        name: '网易云',
        reg: new RegExp(/.*music\.163\.com\/.+/),
        insertDom: '.m-tabs.m-tabs-srch.f-cb.ztag',
        exportStyle:
          '#export-button { background-color: red; color: white; padding: 5px; border-radius: 2px; margin-bottom: 5px; }',
        listFunc: getNetEaseMusicList,
      },
      {
        name: 'QQ',
        reg: new RegExp(/.*y\.qq\.com\/.+/),
        insertDom: '.mod_songlist',
        exportStyle:
          '#export-button { background-color: #31c27c; color: white; padding: 5px; border-radius: 2px; border: 1px solid #31c27c; margin-bottom: 5px;}',
        listFunc: getQQMusicList,
      },
      {
        name: '酷狗',
        reg: new RegExp(/.*kugou\.com\/.+/),
        insertDom: '.song_list',
        exportStyle:
          '#export-button { background-color: #169af3; color: white; padding: 5px; border-radius: 2px; border: 1px solid #169af3; margin-bottom: 5px;}',
        listFunc: getKugouList,
      },
    ];
    const url = window.location.href;
    const [site] = musicSites.filter(item => item.reg.test(url));
    console.log(site);
    addButton(site.insertDom);
    addStyle(site.exportStyle);
    $('#export-button').click(function () {
      const list = site.listFunc();
      const headers = {
        link: '歌曲链接',
        songName: '歌曲名称',
        artist: '歌手',
      };
      exportCSVFile(headers, list, site.name);
    });
  }

  setTimeout(init, 3000);
})();
