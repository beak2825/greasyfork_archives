// ==UserScript==
// @name              momoshop.com.tw 切換手機／電腦版
// @description       Add link button to specific pages, to switch between mobile/desktop site
// @description:zh-TW 在特定網頁增加連結按鈕，以切換至手機／電腦版網站
// @version           1.1.0
// @license           MIT
// @author            bootleq
// @namespace         bootleq.com
// @homepageURL       https://github.com/bootleq/user-scripts
//
// @match             https://*.momoshop.com.tw/*
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/495170/momoshopcomtw%20%E5%88%87%E6%8F%9B%E6%89%8B%E6%A9%9F%EF%BC%8F%E9%9B%BB%E8%85%A6%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/495170/momoshopcomtw%20%E5%88%87%E6%8F%9B%E6%89%8B%E6%A9%9F%EF%BC%8F%E9%9B%BB%E8%85%A6%E7%89%88.meta.js
// ==/UserScript==

const detectMobile = true; // 啟用轉換 手機 → 桌面版
const detectDesktop = false; // 啟用轉換 桌面 → 手機版
const detectTP = true; // 啟用偵測 店+

const TPToggleWidth = 'clamp(375px, 100vw, 960px)'; // 店+ 按下按鈕時，調整網頁內容（body 等）到指定寬度

const adapterHTML = function (url, text) {
  return `
      <span>👀</span>
      <a ${url ? `href="${url}"` : `onclick="document.documentElement.classList.toggle('${adapterClass}-tp-fix')"`}>${text}</a>
      <button onclick="console.log(this.parentNode.style.display = 'none')">✖</button>`;
};

const adapterClass = 'momo-bad-view-adapter';

const globalStyle = `
  .${adapterClass} {
    position: fixed;
    top: 12%;
    right: 10px;
    display: flex;
    align-items: center;
    z-index: 999;
    font-size: larger;
    color: white;
    background-color: rgba(214, 0, 109, 0.8);
    margin: 6px;
    padding-left: 10px;
    border-radius: 30px 0 0 24px;
    box-shadow: 4px 4px 6px rgba(0,0,0,.6);
    animation: ${adapterClass}-breathing 2100ms infinite normal, ${adapterClass}-slowmo 4500ms infinite reverse;
  }

  .${adapterClass} > span {
    animation: ${adapterClass}-blink 2800ms infinite normal;
    margin-top: -4px;
  }

  .${adapterClass}-view-tp > span::before {
    content: '﹀';
    color: black;
    display: block;
    position: absolute;
    top: 4px;
    left: 3px;
    transform: scaleX(1.4);
  }

  .${adapterClass} > a {
    color: white;
    padding: 1em 0 1em 22px;
    margin-inline: 0;
    text-shadow: 1px 1px 1px #333;
    transition: margin 10s ease-in-out;
  }

  .${adapterClass} > a:active {
    margin-inline: clamp(10em, 42vw, 64em);
  }

  .${adapterClass} > button {
    cursor: pointer;
    color: black;
    background: none;
    border: none;
    margin: 0 20px 0 25px;
    font-size: x-large;
  }

  html.${adapterClass}-tp-fix,
  html.${adapterClass}-tp-fix body,
  html.${adapterClass}-tp-fix body > div > .fixed.w-full {
    max-width: ${TPToggleWidth};
    margin-inline: auto;
  }

  @keyframes ${adapterClass}-breathing {
    0%   { background-color: rgba(214, 0, 109, 0.8); }
    70%  { background-color: rgba(214, 0, 109, 0.8); }
    90%  { background-color: rgba(214, 0, 109, 0.7); }
    100% { background-color: rgba(214, 0, 109, 0.75); }
  }
  @keyframes ${adapterClass}-slowmo {
    0%   { padding-right: 0; }
    50%  { padding-right: 2px; }
    100% { padding-right: -2px; }
  }
  @keyframes ${adapterClass}-blink {
    0%  { transform: scaleY(1); }
    90% { transform: scaleY(1); }
    92% { transform: scaleY(0); }
    94% { transform: scaleY(1); }
    97% { transform: scaleY(0); }
    99% { transform: scaleY(1); }
  }
`;

const hosts = {
  mobile: 'm.momoshop.com.tw',
  desktop: 'www.momoshop.com.tw',
};

const adapterText = {
  mobile: '切換至桌面版',
  desktop: '切換至手機版',
  tp: '店+ 沒有桌面版',
};

const routes = {
  mobile: [
    {
      name: 'search',
      path: '/search.momo',
      key:  'searchKeyword'
    },
    {
      name: 'goods',
      path: '/goods.momo',
      key:  'i_code'
    },
    {
      name: 'category',
      path: '/category.momo',
      key:  'cn',
      to: 'categoryD',
    },
    {
      name: 'cateGoods',
      path: '/cateGoods.momo',
      key:  'cn',
      to: 'categoryD',
    },
  ],
  desktop: [
    {
      name: 'search',
      path: '/search/searchShop.jsp',
      key:  'keyword'
    },
    {
      name: 'goods',
      path: '/goods/GoodsDetail.jsp',
      key:  'i_code'
    },
    {
      name: 'categoryL',
      path: '/category/LgrpCategory.jsp',
      key:  'l_code',
      to: 'category',
    },
    {
      name: 'categoryD',
      path: '/category/DgrpCategory.jsp',
      key:  'd_code',
      to: 'category',
    },
    {
      name: 'categoryM',
      path: '/category/MgrpCategory.jsp',
      key:  'm_code',
      to: 'category',
    },
  ]
};

const findRouteByPath = function (view, urlPath) {
  return routes[view].find(({path}) => urlPath.startsWith(path));
};

const findRouteByName = function (view, routeName) {
  return routes[view].find(({name}) => name === routeName);
};

const adapterURL = function (url, route, view) {
  const toView = view === 'mobile' ? 'desktop' : 'mobile';
  const params = url.searchParams;

  const id = params.get(route.key);
  if (!id) {
    console.error(`解析網址失敗，缺少 ${route.key} 參數`);
  }

  const toRoute = findRouteByName(toView, route.to || route.name);

  // NOTE: don't try to keep params like below, the result URL usually not work
  // params.delete(route.key);
  // params.set(toRoute.key, id);
  // return `https://${hosts[toView]}${toRoute.path}?${params.toString()}`;

  return `https://${hosts[toView]}${toRoute.path}?${toRoute.key}=${id}`;
};

const insertAdapter = function (url, view) {
  const target = document.querySelector('body');
  const $div = document.createElement('div');
  const text = adapterText[view];

  $div.innerHTML = adapterHTML(url, text);
  $div.classList.add(adapterClass);
  $div.classList.add(`${adapterClass}-view-${view}`);
  return target.appendChild($div);
}

const insertStyle = function (css) {
  const head = document.querySelector('head');
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
};

const onInit = function () {
  const url = new URL(window.location);
  const view = url.host.startsWith('m.') ?
    'mobile' :
    (url.pathname.startsWith('/TP/') ? 'tp' : 'desktop');

  if (
    view === 'mobile' && !detectMobile ||
    view === 'desktop' && !detectDesktop ||
    view === 'tp' && !detectTP
  ) {
    return;
  }

  if (view === 'tp') {
    insertStyle(globalStyle);
    insertAdapter('', view);
    return;
  }

  const route = findRouteByPath(view, url.pathname);

  if (route) {
    insertStyle(globalStyle);
    const newURL = adapterURL(url, route, view);
    insertAdapter(newURL, view);
  } else {
    console.log('未支援的網址');
  }
};

onInit();
