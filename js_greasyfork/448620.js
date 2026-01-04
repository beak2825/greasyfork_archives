// ==UserScript==
// @name         無色透名マスク
// @namespace    https://site.nicovideo.jp/mushokutomeisai
// @version      2.3.1
// @description  無色透名祭のサムネイル,再生数,コメ数,マイリス数,ランキング最高順位をマスクします
// @author       -
// @match        https://www.nicovideo.jp/watch/*
// @match        https://ch.nicovideo.jp/mushokutomeisai*
// @match        https://www.nicovideo.jp/tag/*
// @match        https://www.nicovideo.jp/user/124082477/mylist/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        none
// @run-at       document-start
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/448620/%E7%84%A1%E8%89%B2%E9%80%8F%E5%90%8D%E3%83%9E%E3%82%B9%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/448620/%E7%84%A1%E8%89%B2%E9%80%8F%E5%90%8D%E3%83%9E%E3%82%B9%E3%82%AF.meta.js
// ==/UserScript==
(function() {
  'use strict';

  //const LIMIT = new Date('2022/07/31 20:00:00').getTime();
  const LIMIT = new Date('2023/11/05 20:00:00').getTime();

  const addStyle = css => {
    const style = document.createElement('STYLE');
    style.textContent = css;
    document.head.appendChild(style);
  };

  const limitClass = target => {
      return target.replace(/^(body\.mushokutoumei )?/, 'body.mushokutoumei-limit ');
  };

  const mask = (target, color) => {
    addStyle(`
      ${target} { color: ${color}; background: ${color}; transition: 0s 0s; }
      ${target}:hover { color: unset; background: unset; transition: 10s 2s; }
      ${limitClass(target)} { color: unset; background: unset; transition: 5s; }
    `);
  };

  const maskThumbnail = (target, size) => {
    addStyle(`
      ${target} {
        background: #222 url('https://secure-dcdn.cdn.nimg.jp/nicochannel/material/design/5677558/img_main_01.png') no-repeat center;
        background-size: ${size};
        content: '';
        display: block;
        position: absolute;
        inset: 0;
        opacity: 1;
      }
      ${limitClass(target)} {
        opacity: 0;
        transition: 5s;
      }
    `);
  };

  let retry = 0;
  let videoDescription = null;
  const modPlayPage = () => {
    videoDescription = document.getElementsByClassName('VideoDescription-html')[0];
    if (!videoDescription) {
      retry --;
      if (retry) {
        setTimeout(modPlayPage, 10);
      }
      return;
    }
    for (const target of [
      'body.mushokutoumei :is(.VideoViewCountMeta-counter, .CommentCountMeta-counter, .MylistCountMeta-counter) > .FormattedNumber',
      'body.mushokutoumei .GenreRankMeta-yesterdayRank'
    ]) {
      mask(target, '#657586');
      addStyle(`${target} {
        display: inline-block;
        width: 4rem;
        overflow: hidden;
      }`);
    }
    // mask('body.mushokutoumei .LikeActionButton-count', '#fff') // iine!
    mask('body.mushokutoumei .VideoMediaObject-meta', '#ccc');
    maskThumbnail('body.mushokutoumei .RouterLink > .Thumbnail::before', '145px');
    maskThumbnail('body.mushokutoumei .VideoMediaObject-thumbnail > .Thumbnail::before', '170px');
    switchMask();
    const observer = new MutationObserver(switchMask);
    observer.observe(videoDescription, { childList: true, subtree: true, characterData: true });
  };

  const switchMask = () => {
    if (videoDescription.textContent == '【無色透名祭】参加作品です。https://site.nicovideo.jp/mushokutomeisai/') {
      document.body.classList.add('mushokutoumei');
    } else {
      document.body.classList.remove('mushokutoumei');
    }
  };

  const modChannelPage = () => {
    mask('.g-video_counts', '#6296c1');
    maskThumbnail('.thumb_video::before, .thumb_anchor::before', '145px');
    addStyle('.thumb_anchor { position: relative; }');
  };

  const modTagPage = () => {
    if (decodeURI(location.href).includes('無色透名祭')) {
      mask('.itemData > .list > .count > .value', '#bebebe');
    }
  };

  const modMyListPage = () => {
    mask('.NC-VideoMediaObject-metaCount', '#bebebe');
    maskThumbnail('.NC-Thumbnail-image::after', '120%');
  };

  const isLimit = () => {
    return Date.now() >= LIMIT;
  };

  const autoOff = () => {
    if (!isLimit()) {
      setTimeout(autoOff, 1000);
      return;
    }
    document.body.classList.add('mushokutoumei-limit');
  };

  if (isLimit()) {
    return;
  }

  setTimeout(autoOff, LIMIT - Date.now() + 1);
  
  if (location.href.startsWith('https://www.nicovideo.jp/watch/')) {
    retry = 100;
    modPlayPage();
  } else if (location.href.startsWith('https://ch.nicovideo.jp/mushokutomeisai')) {
    modChannelPage();
  } else if (location.href.startsWith('https://www.nicovideo.jp/tag')) {
    modTagPage();
  } else {
    modMyListPage();
  }

})();
