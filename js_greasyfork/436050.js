/*
 * @Description:
 * @Author: 余锦斌
 * @Date: 2021-11-25 17:28:06
 * @FilePath: \vue-manage-system - 页签试验f:\常用软件数据\自写脚本\migu.js
 * @LastEditTime: 2021-12-07 15:01:38
 * @LastEditors: 余锦斌
 */
// ==UserScript==
// @name        咪咕音乐全部歌曲含付费专辑、网易云低音质歌曲下载
// @namespace   Yujinbin
// @match       https://music.migu.cn/v3/music/song/*
// @match       https://music.migu.cn/v3/music/order/download/*
// @grant       可下载咪咕音乐网所有音乐，包含付费专辑
// @version     1.1.3
// @description       zh-cn
// @license       End-User License Agreement
// @downloadURL https://update.greasyfork.org/scripts/436050/%E5%92%AA%E5%92%95%E9%9F%B3%E4%B9%90%E5%85%A8%E9%83%A8%E6%AD%8C%E6%9B%B2%E5%90%AB%E4%BB%98%E8%B4%B9%E4%B8%93%E8%BE%91%E3%80%81%E7%BD%91%E6%98%93%E4%BA%91%E4%BD%8E%E9%9F%B3%E8%B4%A8%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/436050/%E5%92%AA%E5%92%95%E9%9F%B3%E4%B9%90%E5%85%A8%E9%83%A8%E6%AD%8C%E6%9B%B2%E5%90%AB%E4%BB%98%E8%B4%B9%E4%B8%93%E8%BE%91%E3%80%81%E7%BD%91%E6%98%93%E4%BA%91%E4%BD%8E%E9%9F%B3%E8%B4%A8%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
  //js代码
  // function () {
  // var href = window.location.href;
  var title = new Array();
  title[0] = 'https://music.migu.cn/v3/music/song/';
  title[1] = 'https://music.migu.cn/v3/music/order/download/';
  let href = location.href;
  if (href.indexOf(title[0] != -1)) {
    let btn = document.createElement('div');
    let id = href.split('https://music.migu.cn/v3/music/song/')[1];
    btn.innerHTML = "<a href='https://music.migu.cn/v3/music/order/download/" + id + "'>去下载</a>";
    btn.classList.add('operate_btn');
    let comp = document.querySelector('.info_operate');
    comp.appendChild(btn);
  }

  // if (href.startsWith('https://music.migu.cn/v3/music/song/')) {
  //   let btn = document.createElement('div');
  //   let id = href.split('https://music.migu.cn/v3/music/song/')[1];
  //   btn.innerHTML = "<a href='https://music.migu.cn/v3/music/order/download/" + id + "'>去下载</a>";
  //   btn.classList.add('operate_btn');
  //   let comp = document.querySelector('.info_operate');
  //   comp.appendChild(btn);
  // }

  if (href.indexOf(title[1] != -1)) {
    let button = document.createElement('div');
    // let currentOption = document.getElementsByClassName('current')[0].dataset.info;
    // console.log(currentOption);
    // let tempp = currentOption.attributes['data-info'].nodeValue;
    // console.log(tempp);
    // let list = tempp.split(',');
    // console.log(list);
    // let path = list[15].replace('"url":"ftp://218.200.160.122:21', 'https://freetyst.nf.migu.cn');
    // path = path.replace('"', '');
    // console.log(path);
    let path = 'http://www.baidu.com/';
    button.innerHTML = "<a href='" + path + "'>下载</a>";
    button.classList.add('btn-order', 'btn-query');
    let c = document.getElementById('J_is_free_container');
    c.appendChild(button);
  }

  // if (href.startsWith('https://music.migu.cn/v3/music/order/download/')) {
  //   let button = document.createElement('div');
  //   // document.querySelector('.current').setAttribute('id', '111');
  //   let currentOption = document.getElementsByClassName('current')[0].dataset.info;
  //   // let currentOption = document.getElementById('#111');
  //   // let currentOption = document.querySelector('.current').dataset;
  //   console.log(currentOption);
  //   let tempp = currentOption.attributes['data-info'].nodeValue;
  //   console.log(tempp);
  //   let list = tempp.split(',');
  //   console.log(list);
  //   let path = list[15].replace('"url":"ftp://218.200.160.122:21', 'https://freetyst.nf.migu.cn');
  //   path = path.replace('"', '');
  //   console.log(path);
  //   button.innerHTML = "<a href='" + path + "'>下载</a>";
  //   button.classList.add('btn-order', 'btn-query');
  //   let c = document.getElementById('J_is_free_container');
  //   c.appendChild(button);
  // }
})();
