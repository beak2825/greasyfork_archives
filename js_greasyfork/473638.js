// ==UserScript==
// @name        无图模式
// @name:zh-CN  无图模式
// @name:en     No picture
// @description 隐藏网站内的图片
// @description:en Hide picture
// @version     0.0.6
// @author      l.lyndon
// @match       *://*.zhihu.com/*
// @match       *://*.douban.com/*
// @match       *://*.sina.com.cn/*
// @match       *://*.163.com/*
// @match       *://*.sohu.com/*
// @match       *://*.qq.com/*
// @match       *://*.msn.cn/*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAFEUExURU7Bj03Bj07BjU7Bjk3BkAAAAEzAkU/BjU3AkEzAklW/gUfBmU7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk3BkE7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bj07Bjk7Bjk7Bjk7Bjk7Bjk3AkU3BkE7Bjk7Bjk7BjkzAkk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Cjk7Bjk7Bjk3Bj07Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Bjk7Cjk7Cj0uziEWYfk2+jU27jEy4ik7Dj0SVfDtra0KKeDlkaEehgU/Ej0GFdkGEdkqxhz97cjdYZD9/c0aegDpoakmphE7AjTljaDVOYEKJeEilgzVQYUadfzROYEiohEuzif///yNHXZ4AAABJdFJOUwAAAAAAAAAAAAAAAC2IpoxZIwJF1vfZmUMIKtfyrT0BBZrpYgE46OeHssfY7Kz63Tr13ErR/LUzff3+0GsQFqjIbBkRYJicehIMk0NaAAAAAWJLR0RrUmWlmAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+cIFgcFEOcYMLwAAADVSURBVAjXHY2HVsJgDIVvG35wr7rABS4QJwqKW5FhqKIFGSoWEHC9/wOYvzk5uflychPAMEdGx8YnJqcI5FPwkzXNzDOzc/NBAkChBdZRtBeXllcI4Yj0kg+PJV5dW8fGJj892+yUKyXmqIUY80u1xvXGq2zxFuLMb+/ND7fVtoW3sSPejvvZ7XlXd7Gnpd7/+nZE9w+Q0OzUflzhw6MAkt7z38ZfMXV8YhpIn3pG++z84pJ8Bq6u9SBxc5sxQQMKdJfN5QvWPdGgoZQw0dCwFL8mpf4Bqastmak5j04AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDgtMjJUMDc6MDQ6NTArMDA6MDBTocvVAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA4LTIyVDA3OjAyOjA3KzAwOjAwoqUzxAAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wOC0yMlQwNzowNToxNiswMDowMH2xAkgAAAAgdEVYdHNvZnR3YXJlAGh0dHBzOi8vaW1hZ2VtYWdpY2sub3JnvM8dnQAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABh0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQAMTkyQF1xVQAAABd0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAAxOTLTrCEIAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE1OTQwODUwMDmu8H/JAAAAE3RFWHRUaHVtYjo6U2l6ZQAxMTMzOUJChIFZ/wAAAEJ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL3RtcC9pbWFnZWxjL2ltZ3ZpZXcyXzZfMTU5MjQ3OTgyMTE3NzIwNzRfNDhfWzBd1kwOkgAAAABJRU5ErkJggg==
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_openInTab
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_info
// @grant       window.onurlchange
// @grant       unsafeWindow
// @sandbox     JavaScript
// @license     MIT License
// @run-at      document-end
// @namespace   https://github.com/lyndonliu89757/noPic
// @supportURL  https://github.com/lyndonliu89757/noPic
// @homepageURL https://github.com/lyndonliu89757/noPic
// @downloadURL https://update.greasyfork.org/scripts/473638/%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/473638/%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

'use strict';

var menu_ALL = [
  ['menu_hidePicture', '隐藏图片', '隐藏图片', true],
  ['menu_hideVideo', '隐藏视频', '隐藏视频', true],
], menu_ID = [];
for (let i = 0; i < menu_ALL.length; i++) { // 如果读取到的值为 null 就写入默认值
  if (GM_getValue(menu_ALL[i][0]) == null) { GM_setValue(menu_ALL[i][0], menu_ALL[i][3]) };
}
registerMenuCommand();

// 注册脚本菜单
function registerMenuCommand() {
  if (menu_ID.length > menu_ALL.length) { // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
    for (let i = 0; i < menu_ID.length; i++) {
      GM_unregisterMenuCommand(menu_ID[i]);
    }
  }
  for (let i = 0; i < menu_ALL.length; i++) { // 循环注册脚本菜单
    menu_ALL[i][3] = GM_getValue(menu_ALL[i][0]);
    menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][3] ? '✅' : '❌'} ${menu_ALL[i][1]}`, function () { menu_switch(`${menu_ALL[i][3]}`, `${menu_ALL[i][0]}`, `${menu_ALL[i][2]}`) });
  }
  menu_ID[menu_ID.length] = GM_registerMenuCommand('💬 反馈 & 建议', function () {
    window.GM_openInTab('https://github.com/lyndonliu89757/noPic', { active: true, insert: true, setParent: true });
    window.GM_openInTab('https://greasyfork.org/zh-CN/scripts/473638/feedback', { active: true, insert: true, setParent: true });
  });
}

// 菜单开关
function menu_switch(menu_status, Name, Tips) {
  const status = menu_status != 'true';
  GM_setValue(`${Name}`, status);
  registerMenuCommand(); // 重新注册脚本菜单
  changeElementDisplay();
};


// 返回菜单值
function menu_value(menuName) {
  for (let menu of menu_ALL) {
    if (menu[0] == menuName) {
      return menu[3]
    }
  }
}

function changeElementDisplay() {
  Array.from(document.getElementsByTagName('img')).forEach(i => i.style.display = menu_value('menu_hidePicture') ? 'none' : 'inline');
  Array.from(document.getElementsByTagName('video')).forEach(i => i.style.display = menu_value('menu_hideVideo') ? 'none' : 'inline');
}

(function () {
  // Violentmonkey 比 Tampermonkey 加载更早，会导致一些元素还没加载，因此需要延迟一会儿
  // Tampermonkey 4.18.0 版本可能需要延迟一会执行
  if (GM_info.scriptHandler === 'Violentmonkey' || (GM_info.scriptHandler === 'Tampermonkey' && parseFloat(GM_info.version.slice(0, 4)) >= 4.18)) {
    setTimeout(start, 300);
  } else {
    start();
  }

  function start() {
    setTimeout(changeElementDisplay, 300);
  }
})();