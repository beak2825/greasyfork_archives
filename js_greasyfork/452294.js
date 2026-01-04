// ==UserScript==
// @name 搜索引擎切换
// @description 切換手機引擎快捷

// @icon https://i.loli.net/2020/05/29/DxSmHAy2o53FdUY.png
// @license GPL-3.0
// @include *.baidu.com/*
// @include *.google.com*
// @include *.google.icloudnative.io/*
// @include *.search.ononoki.org/*
// @include *.bing.com/*
// @include *.zhihu.com/search?*
// @include *.soku.com/*
// @include *.whoogle.sdf.org/*
// @include *.sm.cn/*
// @include *.fsoufsou.com/*
// @include *.you.com/*
// @include *.duckduckgo.com/*
// @match   *.startpage.com/*
// @match   *.whoogle.sdf.org/*
// @match   *.you.com/*
// @match   *.google.icloudnative.io/*
// @match   *.xn--flw351e.ml/*
// @match   *.fsoufsou.com/*
// @include /^https?://[a-z]+\.google\.[a-z,\.]+/.+$/
// @grant none
// @run-at document_end

// @date 09/29/2022
// @modified 09/29/2022
// @version 1.0.3
// @namespace https://viayoo.com/
// @downloadURL https://update.greasyfork.org/scripts/452294/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/452294/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

{
  const sites = [
    {
      name: '百度',
      host: 'baidu.com',
      link: 'https://m.baidu.com/s',
      key: 'word',
      extra: '',
      hide: false
    },
    {
      name: '必应',
      host: 'bing.com',
      link: 'https://bing.com/search',
      key: 'q',
      extra: '',
      hide: false
    },{
    name: '神马',host:'sm.cn',
    link: "https://yz.m.sm.cn/s",
    key: 'q',
      extra: '',
    hide: false
  },
    {
      name: '谷歌',
      host: 'google.com',
      link: 'https://www.google.com/search',
      key: 'q',
      extra: '',
      hide: false
    },
    {
      name: 'F搜',
      host: 'fsoufsou.com',
      link: 'https://fsoufsou.com/search',
      key: 'q',
      extra: '',hide: false
    },
    {
    name: '全搜',
    host: 'search.ononoki.org',
    link: "https://search.ononoki.org/search",
    key: 'q',
      extra: '',
   hide: false
  },
  {
      name: 'wg',
      host: 'whoogle.sdf.org',
      link: 'https://whoogle.sdf.org/search',
      key: 'q',
      extra: '&source=lnt',
      hide: false
    },
{
      name: 'you',
      host: 'you.com',
      link: 'https://you.com/search',
      key: 'q',
      extra: '&fromSearchBar=true',
      hide: false},
{
    name: "鸭鸭",host:'duckduckgo.com',
    link: "https://duckduckgo.com/",
    key: "q",
      extra: '',hide: false
  },
    {
      name: '镜像',
      host: 'google.icloudnative.io',
      link:'https://google.icloudnative.io/sp/search',
      key: 'query',
      extra: '&qadf=none',
      hide: false
    },
  ];

  const css = `
    .search-warpper {
      position: fixed;
      left: 0;
      bottom: 0;
    }

    .search-switcher {
      position: fixed;
      top:80vh;
      background-color:hsla(200, 40%, 96%, .8);
      transition: all 400ms;
      border-radius: 50px;
      height:50px;
      width:50px;
      opacity: 0.2;
    color: deepskyblue;
    font-size: 25px;
    line-height: 50px;
    text-align: center;
    }

    .search-switcher.hover {
      left: -30px;
      right:auto;
      opacity: 1;
    }

    .search-switcher.hover + .search-list {
      visibility: visible;
      background-color: hsla(200, 40%, 96%, .8);
      left: 25px;
      opacity: 1;
      top:80vh;
     }

    .search-list {
      position: fixed;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      box-sizing:border-box;
      left: -100vw;
      margin: 10px 5px;
      visibility: hidden;
    width: 90vw;
    height: 30px;
      opacity: 0.2;
      z-index: 9999999;
      transition: all 400ms;
    }
    .search-list p {
      margin: 0;
    }
    .search-list a {
      color: #222;text-align: center;
      height: 30px;
      width:2.25rem;
      line-height:30px;
      font-size:16px;
    }

    .search-list a.mirror {
      font-weight: bold;
    }
    `;

  function setup() {
    console.log('location:', location);
    let site;
    let isMirror;
    for (let s of sites) {
      if (location.host.includes(s.host)) {
        site = s;
      }
    }
    let siteList = sites.filter(({ host , hide}) => !location.hostname.includes(host) && !hide );
    console.log('siteList:', siteList);

    let query = new URLSearchParams(location.search).get(site.key || 'q');
    console.log('site:', site, ',query:', query);
    if( query == null ) {
      return
    }

    const body = document.getElementsByTagName('body')[0];

    // 样式
    const style = document.createElement('style');
    style.innerHTML = css;
    body.appendChild(style);

    // 生成切换框
    const content = document.createElement('div');
    const aTag = ({ link, name, host, mirror, key, extra }) => {
      let className = '';
      let text = name;
      let href = `${link}?${key}=${query}${extra}`;
      console.log('href:', href);
      return `<a href='${href}' target='_blank' >${text}</a>`;
    };
    const tags = siteList
      .filter(({ hidden }) => !hidden)
      .map(aTag)
      .join('');

    content.innerHTML = `
    <div id='search-switcher' class='search-switcher'>搜</div>
    <div id='search-list' class="search-list">${tags}</div>
    `;
    body.appendChild(content);
    const btn = document.getElementById('search-switcher');
    btn.onclick = e => e.target.classList.add('hover');
    document.body.addEventListener("touchstart", e => {
      if (e.target.id!=="search-switcher" && e.target.id!=="search-list" &&
          !document.getElementById('search-list').contains(e.target)) btn.classList.remove('hover');
    });
  }

  let href0 = '';

  !(function init() {
    var href = location.href;
    if (href0 != href) {
      var oldDOM = document.getElementById('search-list');
      if (oldDOM) {
        oldDOM.parentNode.removeChild(oldDOM);
      }
      setup();
      href0 = href;
    }
    setTimeout(init, 2222);
  })();
}
//end userScript