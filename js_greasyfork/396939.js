// ==UserScript==
// @name                Site Switcher
// @name:zh-CN          一键切换搜索/镜像站
// @name:zh-TW          壹鍵切換搜索/镜像站
// @description         Add links to each other in search engines. Including multiple search modes.
// @description:zh-CN   在常用的搜索引擎/镜像站页面中添加互相切换的按钮。
// @description:zh-TW   在常用的搜索引擎/镜像站頁面中添加互相切換的按鈕。

// @author              l1xnan
// @namespace           http://hzy.pw
// @homepageURL         http://hzy.pw/p/1849
// @supportURL          https://github.com/h2y/link-fix
// @icon                http://q.qlogo.cn/qqapp/100229475/F1260A6CECA521F6BE517A08C4294D8A/100
// @license             GPL-3.0
// @include             https://github.com/*
// @include             https://github.com.cnpmjs.org/*
// @include             *.baidu.com/*
// @exclude             *.baidu.com/link?*
// @include             *.so.com/*
// @include             *.bing.com/*
// @include             *.zhihu.com/search?*
// @include             *.soku.com/*
// @include             *.sogou.com/*
// @include             /^https?://[a-z]+\.google\.[a-z,\.]+/.+$/
// @grant               none
// @run-at              document_end

// @date                02/16/2020
// @modified            02/16/2020
// @version             1.0.0
// @downloadURL https://update.greasyfork.org/scripts/396939/Site%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/396939/Site%20Switcher.meta.js
// ==/UserScript==

{
  const sites = [
    {
      name: '百度',
      host: 'baidu.com',
      link: 'https://www.baidu.com/s',
      key: 'wd',
    },
    {
      name: '必应',
      host: 'bing.com',
      link: 'https://bing.com/search',
      key: 'q',
    },
    {
      name: '谷歌',
      host: 'www.google.com',
      link: 'https://www.google.com/search',
      key: 'q',
      mirror: 'google.fuckcloudnative.io',
    },
    {
      name: 'Github',
      host: 'github.com',
      link: 'https://github.com/search',
      key: 'q',
      mirror: 'github.com.cnpmjs.org',
    },
    // {
    //   name: '搜搜',
    //   host: 'so.com',
    //   link: 'https://www.so.com/s?q=',
    //   key: 'q',
    //   hidden: true,
    // },
    // {
    //   name: '搜狗',
    //   host: 'sogou.com',
    //   link: 'https://www.sogou.com/web?query=',
    //   key: 'query',
    //   hidden: true,
    // },
  ];

  // 镜像站
  const mirrors = {
    'github.com': 'https://github.com.cnpmjs.org/search?q=',
    'google.com': 'https://google.fuckcloudnative.io/search?q=',
  };
  const css = `
  .search-switcher {
      position: fixed;
      box-sizing:border-box;
      background-color: #000;
      opacity: 0.3;
      border-radius: 40px;
      color: #fff;
      padding: 15px 20px;
      bottom: 100px;
      left: -280px;
      width: 300px;
      z-index: 9999999;
      transition: all 400ms;
    }
    .search-switcher:hover {
      left: 5px;
      opacity: 1;
      border-radius: 10px;
      box-shadow: 5px -5px 10px #777;
    }
    .search-switcher p {
      margin: 0;
    }
    p.search-switcher-title {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .search-switcher a {
      color: #0cf;
      margin-right: 20px;
    }
    .search-switcher a.mirror {
      font-weight: bold;
    }
    `;

  function setup() {
    let site;
    let isMirror;
    for (let s of sites) {
      if (location.host.includes(s.host)) {
        site = s;
      }
      if (location.href.includes(s.mirror)) {
        site = s;
        isMirror = true;
      }
    }
    sites.filter(({ host }) => location.hostname.includes(host))[0];
    let mirror = sites.filter(({ mirror }) =>
      location.hostname.includes(mirror),
    )[0];

    let query = new URLSearchParams(location.search).get(site.key || 'q');
    console.log(site, query, isMirror);
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
      if (mirror && name === site.name) {
        href = location.href.replace(host, mirror);
        text = '镜像';
        className = 'mirror';
        if (isMirror) {
          text = '原站';
          href = location.href.replace(mirror, host);
        }
      }
      return `<a href='${href}' target='_blank' class=${className}>${text}</a>`;
    };
    const tags = sites
      .filter(({ hidden }) => !hidden)
      .map(aTag)
      .join('');

    content.innerHTML = `
      <div id='search-switcher' class='search-switcher'>
        <p class='search-switcher-title'>一键切换引擎：</p>
        <p>${tags}</p>
      </div>`;
    body.appendChild(content);
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