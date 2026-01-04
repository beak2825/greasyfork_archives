// ==UserScript==
// @name         一键切换搜索
// @namespace    https://greasyfork.org/zh-CN/scripts/476606      
// @version      1.2
// @description  在常用的搜索引擎页面中添加互相切换的按钮。适用于手机端浏览器
// @author       aococ
// @icon         https://s2.loli.net/2023/09/08/lBAZvsjfuKXoNRV.png
// @license      GPL-3.0
// @run-at       document-end
// @match        *?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476606/%E4%B8%80%E9%94%AE%E5%88%87%E6%8D%A2%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/476606/%E4%B8%80%E9%94%AE%E5%88%87%E6%8D%A2%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

   /*除去搜索其他部分*/
// @exclude      *image*
// @exclude      *video*
// @exclude      *scripts?page*

{
  const sites = [
    {
    name: '谷歌',
    host: 'google',
    link: 'https://www.google.com/search?',
    key: 'q',
    },
    {
    name: '必应',
    host: 'bing.com',
    link: 'https://cn.bing.com/search?',
    key: 'q',
    },
    {
    name: '百度',
    host: 'baidu.com',
    link: 'https://www.baidu.com/s?',
    key: 'word',
    },
    {
    name: '搜狗',
    host: 'sogou.com',
    link: 'https://m.sogou.com/web/searchList.jsp?',
    key: 'keyword',
    },
    {
    name: '燕基',
    host: 'yandex',
    link: 'https://www.yandex.eu/search/touch/?',
    key: 'text',
    },
    {
    name: '知乎',
    host: 'zhihu.com/',
    link: 'https://www.zhihu.com/search?',
    key: 'q',
    },
    {
    name: '微博',
    host: 'weibo.cn/',
    link: 'https://m.weibo.cn/search?containerid=100103type=1&',
    key: 'q',
    },
    {
    name: 'B站',
    host: 'bilibili.com/',
    link: 'https://m.bilibili.com/search?',
    key: 'keyword',
    },
];

  const css = `
    .search-warpper {
      position: fixed;
      left: 0;
      bottom: 0;
    }

    /*↓隐藏列表时的按钮*/
    .search-switcher {
      position: fixed;
      opacity:.8;
      top:300px;
      border-radius: 10px;
      background-color:#C1FFFB;
      right: calc(100% - 22px);
      z-index: 9999999;
      transition:width 300ms ease-in;
      height:135px;
      width:100px;
      overflow:hidden;
    }

    /*↓点击后显示的列表*/
    .search-switcher:hover {
      top: 255px;
      left: 0px;
      right:auto;
      opacity: 1;
      background-color: hsla(200, 40%, 96%, .6);
      border-radius: 10px;
      height:220px;
      width:80px;
      overflow:hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing:border-box;
      margin-top: 5px !important;
    }
    
    .search-switcher p {
      margin: 0;
    }

    /*↓ 调整“搜索:” */
    .search-switcher-title {
      font-size:16px !important;
      font-weight:bold;
      color: hsla(211, 60%, 35%, 1);
      margin-top: 4px !important;
    }

    /*↓隐藏列表时文字隐藏*/
    .search-switcher a{
      width: 0;
      height: 0;
      display: none;
      font-size:0px;
      overflow: hidden;
    }

    /*点击后显示列表文字*/
    .search-switcher:hover  a{
      display: inline-flex;
      color: #222 !important;
      height:30px;
      line-height:30px;
      width:30px;
      font-size:15px;
      text-decoration: none !important;
    }

    .search-switcher  a.mirror {
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

    let siteList = sites.filter(
      ({host}) => !location.hostname.includes(host));

    console.log('siteList:', siteList);

    let query = new URLSearchParams(location.search).get(site.key || 'q');
    console.log('site:', site, ',query:', query);
    
    /*适配微博*/
    if (site.host==='weibo') {
  query = new URLSearchParams(encodeURI(decodeURIComponent(location.search).replace('type', '&type'))).get(site.key || 'q');
}

    const body = document.getElementsByTagName('body')[0];

    // 样式
    const style = document.createElement('style');
    style.innerHTML = css;
    body.appendChild(style);

    // 生成切换框
    const content = document.createElement('div');
    const aTag = ({ link,host, name, mirror, key ,lit}) => {
      let className = '';
      let text = name;
      let href = `${link}${key}=${query}`;
      console.log('href:', href);
      return `<a href='${href}' target='_blank' >${text}</a>`;
    };
    const tags = siteList
      .filter(({ hidden }) => !hidden)
      .map(aTag)
      .join('');

    content.innerHTML = `
    <div id='search-switcher' class='search-switcher'>
      <div id='search-switcher' class="search-switcher"><p class='search-switcher-title'></p>${tags}
</div>    </div>`;
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
