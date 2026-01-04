// ==UserScript==
// @name                JavBus Flags(Japanese Adult) - Localisation collection system imitation JAVLibrary
// @name:zh-CN          JavBus Flags(日本影片) - 仿 JAVLibrary 的本地化收藏系统
// @name:zh-TW          JavBus Flags(日本影片) - 仿 JAVLibrary 的本地化收藏系統
// @name:ja             JavBus Flags(日本アダル) - 局所収集システム模倣 JAVLibrary
// @name:ko             JavBus Flags(일본 성인) - JAVLibrary를 모방한 현지화 수집 시스템
// @namespace           https://sleazyfork.org/zh-CN/users/193133-pana
// @version             1.0.0
// @description         Record and identify movies and actors
// @description:zh-CN   记录并标识出影片和演员
// @description:zh-TW   記錄並標識出影片和演員
// @description:ja      映画と俳優を記録して、特定してください
// @description:ko      영화 및 배우 기록 및 식별
// @author              pana
// @license             GNU General Public License v3.0 or later


// @include      *javbus.com/*
// @include      *avmoo.cyou/*
// @include      /^.*(javbus|busfan|fanbus|buscdn|cdnbus|dmmsee|seedmm|seejav|busdmm|busjav)\..*$/


// @include             *://*javbus.com/*
// @exclude             *://*javbus.com/forum/
// @icon                https://icons.duckduckgo.com/ip2/javbus.com.ico
// @require             https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js
// @require             https://cdn.jsdelivr.net/npm/vue-router@3.5.2/dist/vue-router.min.js
// @require             https://greasyfork.org/scripts/429896-jav-flags/code/Jav-Flags.js?version=955109
// @compatible          chrome
// @compatible          firefox
// @grant               GM_info
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_addValueChangeListener
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/442292/JavBus%20Flags%28Japanese%20Adult%29%20-%20Localisation%20collection%20system%20imitation%20JAVLibrary.user.js
// @updateURL https://update.greasyfork.org/scripts/442292/JavBus%20Flags%28Japanese%20Adult%29%20-%20Localisation%20collection%20system%20imitation%20JAVLibrary.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const updated = '2021-07-28';
  const converterList = [
    {
      key: '/pics/',
      source: /\/cover\/(\w+)_b.jpg/,
      result: '/thumb/$1.jpg',
    },
    {
      key: '/imgs/',
      source: /\/cover\/(\w+)_b.jpg/,
      result: '/thumbs/$1.jpg',
    },
  ];
  const ignoreList = [];
  const lang = getLanguage();
  const javLi = document.createElement('li');
  const navbar = document.querySelector('.navbar-right');
  navbar && navbar.insertAdjacentElement('afterbegin', javLi);
  const mobilePlaceholder = document.querySelector('.col-xs-3.text-center');
  const javFlags = new Jav_Flags('javbus', lang);
  javFlags.init({
    myaccount: `${lang !== 'tw' ? '/' + lang : ''}/myaccount`,
    index: `${lang !== 'tw' ? '/' + lang : ''}/myaccount`,
    placeholder: javLi,
    placeholderClassName: '',
    mobilePlaceholder,
    mobilePlaceholderClassName: 'btn btn-default trigger-overlay',
    host: (location.href + '/').match(/^https?:\/\/[^/]+(\/(en|ja|ko))?\//)[0],
    printing: `${location.origin}/imgs/actress/nowprinting.gif`,
    script: {
      updated,
    },
    imageConverter: imageConverter,
    directorHandler: directorInfoHandler,
    studioHandler: studioInfoHandler,
    labelHandler: labelInfoHandler,
    seriesHandler: seriesInfoHandler,
    starHandler: starInfoHandler,
    movieStatusHandler: movieStatusHandler,
    blockMovieString: true,
    showStarInfo: true,
  });
  function getLanguage() {
    let l = 'tw';
    const pathname = location.pathname + '/';
    if (pathname.includes('/en/')) {
      l = 'en';
    } else if (pathname.includes('/ja/')) {
      l = 'ja';
    } else if (pathname.includes('/ko/')) {
      l = 'ko';
    }
    return l;
  }
  function imageConverter(src) {
    for (const ignore of ignoreList) {
      if (src.includes(ignore)) {
        console.log('Ignore: ' + src);
        return src;
      }
    }
    for (const item of converterList) {
      const { key, source, result } = item;
      if (typeof key === 'string' && src.includes(key)) {
        return src.replace(source, result);
      } else if (typeof key === 'object' && src.match(key)) {
        return src.replace(source, result);
      }
    }
    console.log('Untreated: ', src);
    return src;
  }
  function createSeparator() {
    const separator = document.createElement('span');
    separator.textContent = ' / ';
    return separator;
  }
  function createStatus(type) {
    const status = document.createElement('span');
    status.className = 'jav-flags-movie-status-' + type;
    status.textContent = type;
    return status;
  }
  function movieStatusHandler() {
    try {
      const movieboxs = document.querySelectorAll('.movie-box');
      movieboxs.forEach(box => {
        const movieKey = box.pathname.match(/\/(?:en\/|ja\/|ko\/)?([\w.-]+)/)[1];
        const type = javFlags.getMovieType(movieKey);
        if (type) {
          const photoInfo = box.querySelector('.photo-info > span');
          if (photoInfo) {
            photoInfo.appendChild(createSeparator());
            photoInfo.appendChild(createStatus(type));
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
  function movieIofnHandler() {
    const movie = document.querySelector('.movie');
    if (movie) {
      try {
        const movieKey = location.pathname.match(/\/(?:en\/|ja\/|ko\/)?([\w.-]+)/)[1];
        const h3 = document.querySelector('.container h3');
        const info = document.querySelector('.info');
        const img = document.querySelector('.screencap img');
        if (movieKey && h3 && info && img) {
          const id = info.querySelector('p span:nth-child(2)').textContent.trim();
          const date = info.querySelector('p:nth-child(2)').childNodes[1].textContent.trim();
          const movieName = h3.textContent.trim().replace(id, '').trim();
          const movieSrc = img.src.replace(location.origin, '');
          const javMovie = new Jav_Movie(javFlags, lang, movieKey, {
            name: movieName,
            id,
            date,
            src: movieSrc,
          });
          javMovie.insert(movie);
          javFlags.visited({
            key: movieKey,
            name: movieName,
            id,
            date,
            src: movieSrc,
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
  function directorInfoHandler() {
    const infoLinks = document.querySelectorAll('.info a[href*="/director/"]');
    const javDirector = new Jav_Director(javFlags, lang);
    const directors = [];
    try {
      infoLinks.forEach(item => {
        const key = item.pathname.match(/\/director\/(\w+)/)[1];
        const name = item.textContent.trim();
        if (key && name) {
          directors.push({
            ele: item.parentElement,
            key,
            info: {
              name,
            },
          });
        }
      });
    } catch (e) {
      console.error(e);
    }
    javDirector.insert(directors);
  }
  function studioInfoHandler() {
    const infoLinks = document.querySelectorAll('.info a[href*="/studio/"]');
    const javStudio = new Jav_Studio(javFlags, lang);
    const studios = [];
    try {
      infoLinks.forEach(item => {
        const key = item.pathname.match(/\/studio\/(\w+)/)[1];
        const name = item.textContent.trim();
        if (key && name) {
          studios.push({
            ele: item.parentElement,
            key,
            info: {
              name,
            },
          });
        }
      });
    } catch (e) {
      console.error(e);
    }
    javStudio.insert(studios);
  }
  function labelInfoHandler() {
    const infoLinks = document.querySelectorAll('.info a[href*="/label/"]');
    const javLabel = new Jav_Label(javFlags, lang);
    const labels = [];
    try {
      infoLinks.forEach(item => {
        const key = item.pathname.match(/\/label\/(\w+)/)[1];
        const name = item.textContent.trim();
        if (key && name) {
          labels.push({
            ele: item.parentElement,
            key,
            info: {
              name,
            },
          });
        }
      });
    } catch (e) {
      console.error(e);
    }
    javLabel.insert(labels);
  }
  function seriesInfoHandler() {
    const infoLinks = document.querySelectorAll('.info a[href*="/series/"]');
    const javSeries = new Jav_Series(javFlags, lang);
    const series = [];
    try {
      infoLinks.forEach(item => {
        const key = item.pathname.match(/\/series\/(\w+)/)[1];
        const name = item.textContent.trim();
        if (key && name) {
          series.push({
            ele: item.parentElement,
            key,
            info: {
              name,
            },
          });
        }
      });
    } catch (e) {
      console.error(e);
    }
    javSeries.insert(series);
  }
  function starInfoHandler() {
    const avatarBoxs = document.querySelectorAll('.avatar-box');
    const javStar = new Jav_Star(javFlags, lang);
    const stars = [];
    try {
      avatarBoxs.forEach(box => {
        const starKey = box.pathname.match(/\/star\/(\w+)/)[1];
        const uncensored = box.pathname.includes('uncensored');
        const starNameDom = box.querySelector(':scope > span') || box.querySelector('.photo-info > span');
        const starName = starNameDom.textContent.trim();
        const starSrc = box.querySelector('img').src.replace(location.origin, '');
        if (starKey && starName) {
          stars.push({
            ele: box,
            key: starKey,
            info: {
              name: starName,
              src: starSrc,
              uncensored,
            },
          });
        }
      });
    } catch (e) {
      console.error(e);
    }
    javStar.insert(stars);
  }
  function moviePageHandler() {
    movieIofnHandler();
    directorInfoHandler();
    studioInfoHandler();
    labelInfoHandler();
    seriesInfoHandler();
    starInfoHandler();
  }
  function init() {
    const pathname = location.pathname + '/';
    if (pathname.includes('/actresses/')) {
      starInfoHandler();
    } else if (pathname.includes('/search/')) {
      movieStatusHandler();
    } else if (pathname.includes('search')) {
      starInfoHandler();
    } else if (pathname.includes('/myaccount')) {
      if (pathname.match(/\/myaccount\/.+/)) {
        location.pathname = `${lang !== 'tw' ? '/' + lang : ''}/myaccount`;
      } else {
        const active = document.querySelector('.navbar-nav .active');
        active && active.classList.remove('active');
        javLi.className = 'active';
        const pagination = document.querySelector('.pagination');
        pagination && pagination.parentElement.remove();
        const mobileBtn = document.querySelectorAll('.col-xs-3.text-center');
        if (mobileBtn.length > 2) {
          for (let i = 0; i < mobileBtn.length; i++) {
            if (i !== 0 && i !== mobileBtn.length - 1) {
              mobileBtn[i].style.visibility = 'hidden';
            }
          }
        }
        const webStyle = document.createElement('link');
        webStyle.rel = 'stylesheet';
        webStyle.type = 'text/css';
        webStyle.href = `${location.origin}/css/main.css`;
        document.body.appendChild(webStyle);
        javFlags.insert('body > .container-fluid');
      }
    } else {
      if (document.querySelector('.movie')) {
        moviePageHandler();
      } else {
        movieStatusHandler();
      }
    }
  }
  init();
})();
