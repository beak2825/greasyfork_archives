// ==UserScript==
// @name                Search Switcher PC
// @name:zh-CN          切换搜索PC
// @name:zh-TW          切換搜索PC
// @description         Add links to each other in PC search engines. Including multiple search modes.
// @description:zh-CN   在常用的PC搜索引擎页面中添加互相切换的按钮。
// @description:zh-TW   在常用的PC搜索引擎頁面中添加互相切換的按鈕。

// @author              xiaohan231
// @icon                https://i.loli.net/2020/05/29/DxSmHAy2o53FdUY.png
// @license             GPL-3.0
// @match               *://**/*
// @grant               none
// @run-at              document_end

// @date                09/24/2022
// @modified            09/24/2022
// @version             1.0.5
// @namespace http://xander/wang
// @downloadURL https://update.greasyfork.org/scripts/458466/Search%20Switcher%20PC.user.js
// @updateURL https://update.greasyfork.org/scripts/458466/Search%20Switcher%20PC.meta.js
// ==/UserScript==

{
  const sites = [
    {
      name: '谷歌',
      host: 'google.com',
      link: 'https://www.google.com/search',
      key: 'q',
      hide: false
    },
    {
      name: '百度',
      host: 'baidu.com',
      link: 'https://www.baidu.com/s',
      key: 'wd',
      hide: false
    },
    {
      name: '必应',
      host: 'bing.com',
      link: 'https://bing.com/search',
      key: 'q',
      hide: false
    },
        {
      name: '搜搜',
      host: 'so.com',
      link: 'https://so.com/s',
      key: 'q',
      hide: false
    },
    {
      name: 'DDG',
      host: 'duckduckgo.com',
      link: 'https://duckduckgo.com/',
      key: 'q',
      hide: false
    },
    {
      name: 'YAN',
      host: 'yandex.com',
      link: 'https://yandex.com/search/touch/',
      key: 'text',
      hide: false
    },
    {
      name: '油管',
      host: 'youtube.com',
      link: 'https://www.youtube.com/results',
      key: 'search_query',
      hide: false
    },
    {
      name: '维基',
      host: 'wikipedia.org',
      link: 'https://zh.wikipedia.org/wiki/',
      key: 'search',
      hide: false
    }
  ];

  const css = `
    .search-switcher {
      position: fixed;
      opacity: 0.5;
      top: calc(50% - 120px);
      width: auto;
      right: -55px;
      background-color: #fff;
      border-radius: 10px 0px 0px 10px;
      z-index: 9999999;
      transition: all 400ms;
    }

    .search-switcher:hover {
      top: calc(50% - 120px);
      right: 0px;
      left:auto;
      background-color: #fff;
      opacity: 0.8;
      right: 0px;
      background-color: #fff;
      border-radius: 10px 0px 0px 10px;
      z-index: 9999999;
    }
    
    .search-switcher .search-list {
      display: flex;
      flex-direction: column;
      align-items: left;
      justify-content: center;
      box-sizing:border-box;
      background-color: #fff;
      border-radius: 10px 0px 0px 10px;
      color: #fff;
      padding: 5px 16px;
      box-shadow: 0px 0px 0px 3px #ccc;
    }

    .search-switcher .search-list a {
      font-size: 16px;
      color: #222;
      height: 35px;
      line-height: 35px;
    }

    .search-switcher .search-list a.mirror {
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
    const aTag = ({ link, name, host, mirror, key }) => {
      let className = '';
      let text = name;
      let href = `${link}?${key}=${query}`;
      console.log('href:', href);
      return `<a href='${href}' target='_blank' >${text}</a>`;
    };
    const tags = siteList
      .filter(({ hidden }) => !hidden)
      .map(aTag)
      .join('');

    content.innerHTML = `
    <div id='search-switcher' class='search-switcher'>
      <div id='search-list' class="search-list">${tags}</div>
    </div>`;
    body.appendChild(content);
    
    const searchDiv = document.getElementById('search-switcher')[0];
    console.log('searchDiv:', searchDiv.clientHeight);
    console.log('body:', body.clientHeight);
  }

  let href0 = '';

  !(function init() {
    var href = location.href;
    if (href0 != href) {
      var oldDOM = document.getElementById('search-switcher');
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