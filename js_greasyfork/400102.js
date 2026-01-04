// ==UserScript==
// @name         简书搜索强化
// @name:zh      简书搜索强化
// @name:en      jianshu-search-pro
// @namespace    https://github.com/WumaCoder/mini-tools.git
// @homepageURL  https://github.com/WumaCoder/mini-tools.git
// @version      1.0.1
// @description  对简书的搜索功能进行增强，增强搜索收藏的文章，增强搜索喜欢的文章。
// @description:en Enhance the search function of the short book, enhance the search of favorite articles, enhance the search of favorite articles.
// @author       WumaCoder
// @match        *://www.jianshu.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/400102/%E7%AE%80%E4%B9%A6%E6%90%9C%E7%B4%A2%E5%BC%BA%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/400102/%E7%AE%80%E4%B9%A6%E6%90%9C%E7%B4%A2%E5%BC%BA%E5%8C%96.meta.js
// ==/UserScript==

(function () {

  /*!
 * @name      menuCommand.js
 * @version   0.0.1
 * @author    Blaze
 * @date      2019/9/21 14:22
 * 来自 HTML5视频播放器增强脚本
 */
  const monkeyMenu = {
    on (title, fn, accessKey) {
      return window.GM_registerMenuCommand && window.GM_registerMenuCommand(title, fn, accessKey)
    },
    off (id) {
      return window.GM_unregisterMenuCommand && window.GM_unregisterMenuCommand(id)
    },
    /* 切换类型的菜单功能 */
    switch (title, fn, defVal) {
      const t = this;
      t.on(title, fn);
    }
  };

  /**
   * 将字符串转化为doument
   */
  function toDocument (str = "") {
    str = str.replace(/\r\n\f/igm, '');
    const dom = document.createElement('DOM');
    dom.innerHTML = str;
    return dom;
  }
  /**
   * 初始化自定义样式
   */
  function initStyle () {
    const style = document.createElement("style");
    style.innerText = `
      .tip-li-icon{
        float: left;
        margin-right: 10px;
        font-size: 18px;
        color: #ea6f5a;
      }
      nav form .search-input:focus+.search-btn{
        background-color:#ea6f5a;
      }
    `;
    document.body.appendChild(style);
  }
  /**
   * 初始化事件
   */
  function initEvent () {
    const q = document.getElementById('q');
    const call = debounce(() => {
      const store = window._store;
      const reg = new RegExp(`[${q.value.split('').join(']+.*[')}]+`, 'igm');
      createSearchTipView(
        store.likedList.filter(item => item.title.match(reg)),
        store.bookmarksList.filter(item => item.title.match(reg))
      );
    }, 500);
    q.addEventListener('input', call);
  }

  /**
   * 初始化菜单
   */
  function initMenu () {
    monkeyMenu.on('清空缓存', function () {
      restore();
      alert("请刷新网页");
    });
    monkeyMenu.on('更新脚本', function () {
      window.GM_openInTab('https://greasyfork.org/zh-CN/scripts/400102-%E7%AE%80%E4%B9%A6%E6%90%9C%E7%B4%A2%E5%BC%BA%E5%8C%96', {
        active: true,
        insert: true,
        setParent: true
      });
    });
    monkeyMenu.on('关于', function () {
      window.GM_openInTab('https://github.com/WumaCoder/mini-tools', {
        active: true,
        insert: true,
        setParent: true
      });
    });
    monkeyMenu.on('反馈', function () {
      window.GM_openInTab('https://github.com/WumaCoder/mini-tools/issues', {
        active: true,
        insert: true,
        setParent: true
      });
    });
  }

  /**
   * 初始化数据
   */
  function initData () {
    window._store = { userInfo: null, likedList: [], likedInfo: null, bookmarksList: [], bookmarksInfo: null };
    window._store.likedList = GM_getValue('likedList', []);
    window._store.bookmarksList = GM_getValue('bookmarksList', []);
  }
  /**
   * 节流函数
   * @param {Function} func 回调
   * @param {Number} wait 时间
   */
  function throttle (func, wait) {
    let previous = 0;
    return function () {
      let now = Date.now();
      let context = this;
      let args = arguments;
      if (now - previous > wait) {
        func.apply(context, args);
        previous = now;
      }
    }
  }
  // 防抖
  function debounce (fn, wait) {
    let timeout = null;
    return function () {
      if (timeout !== null) clearTimeout(timeout);
      timeout = setTimeout(fn, wait);
    }
  }

  async function getLikedInfo () {
    const url = `https://www.jianshu.com/users/${window._store.userInfo.current_user.slug}/liked_notes`;
    const res = await $.get(url);
    const dom = toDocument(res);
    const aTag = dom.querySelector("li.active > a");
    const count = aTag.innerText.replace('喜欢的文章 ', '') * 1;
    window._store.likedInfo = {
      count,
      url
    };
  }

  async function getUserInfo () {
    const res = await $.get('https://www.jianshu.com/settings/basic');
    const dom = toDocument(res);
    const infoEl = dom.querySelector("script[data-name=page-data]");
    window._store.userInfo = JSON.parse(infoEl.text);
  }

  async function getBookmarksInfo () {
    const res = await $.get('https://www.jianshu.com/bookmarks');
    const dom = toDocument(res);
    const infoEl = dom.querySelector("script[data-name=bookmark_page_data]");
    window._store.bookmarksInfo = JSON.parse(infoEl.text);
    const pageInfo = window._store.bookmarksInfo;
    const res1 = await $.get('https://www.jianshu.com/bookmarks', { page: pageInfo.totalPages });
    const dom1 = toDocument(res1);
    const aList = dom1.querySelectorAll("ul.note-list > li > div > a");
    pageInfo.count = aList.length + (pageInfo.totalPages - 1) * 20;
  }


  /**
   * 获取收藏的文章列表
   * @param {number } page 页码
   * @returns 是否有重复项目
   */
  async function getBookmarksList (page) {
    const res = await $.get(`https://www.jianshu.com/bookmarks`, { page });
    const dom = toDocument(res);
    const aList = dom.querySelectorAll("ul.note-list > li > div > a");
    let flag = 0;
    for (let i = 0; i < aList.length; i++) {
      const element = aList[i];
      const temp = { href: element.href, title: element.innerText };
      if (window._store.bookmarksList.filter(item => temp.href == item.href).length >= 1) {
        flag = 1;
        break;
      }
      window._store.bookmarksList.push(temp);
    }
    GM_setValue('bookmarksList', window._store.bookmarksList);
    return flag;
  }

  /**
   * 获取喜欢的文章列表
   * @param {number } page 页码
   * @returns 是否有重复项目
   */
  async function getLikedList (page) {
    const res = await $.get(`https://www.jianshu.com/users/${window._store.userInfo.current_user.slug}/liked_notes?page=${page}`);
    const dom = toDocument(res);
    const aList = dom.querySelectorAll("ul.note-list > li > div > a");
    let flag = 0;
    for (let i = 0; i < aList.length; i++) {
      const element = aList[i];
      const temp = { href: element.href, title: element.innerText };
      if (window._store.likedList.filter(item => temp.href == item.href).length >= 1) {
        flag = 1;
        break;
      }
      window._store.likedList.push(temp);
    }
    GM_setValue('likedList', window._store.likedList);
    return flag;
  }

  /**
   * 恢复
   */
  function restore () {
    GM_setValue('likedList', [])
  }

  function createLine () {
    const line = document.createElement('LI');
    line.style.borderBottom = "1px solid #f0f0f0";
    return line.cloneNode(true);
  }

  function createLi (url, title, type) {
    const li = document.createElement('LI');
    li.innerHTML = `<a href="${url}" target="_blank">
                      <i class="iconfont ${type} tip-li-icon"></i> 
                      <span>${title}</span> 
                    </a>`;
    return li.cloneNode(true)
  }

  function clearChildNode (el) {
    for (let i = el.childNodes.length - 1; i >= 0; i--) {
      const element = el.childNodes[i];
      el.removeChild(element);
    }
  }

  function cloneChildNode (el, el2) {
    for (let i = 0; i < el.childNodes.length; i++) {
      const element = el.childNodes[i];
      el2.appendChild(element.cloneNode(true));
    }
  }

  function createSearchTipView (likedList, bookmarksList) {
    const tipElement = document.querySelector(".search-recent-item-wrap");
    clearChildNode(tipElement);
    if (likedList) {
      likedList.length = likedList.length > 10 ? 10 : likedList.length;
      likedList.forEach(item => {
        tipElement.appendChild(createLi(item.href, item.title, 'ic-like'));
      });
      if (likedList.length === 0) {
        tipElement.appendChild(createLi('#', '暂无匹配的喜欢文章', 'ic-like'));
      }
    }
    if (bookmarksList) {
      bookmarksList.length = bookmarksList.length > 10 ? 10 : bookmarksList.length;
      tipElement.appendChild(createLine());
      bookmarksList.forEach(item => {
        tipElement.appendChild(createLi(item.href, item.title, 'ic-mark'));
      });
      if (bookmarksList.length === 0) {
        tipElement.appendChild(createLi('#', '暂无匹配的收藏文章', 'ic-mark'));
      }
    }
  }

  /**
   * 入口
   */
  async function main () {
    // restore();
    initMenu();
    initEvent();
    initStyle();
    initData();

    await getUserInfo();
    console.log('***********初始化简书搜索强化*************');
    await getLikedInfo();
    for (let i = 1; i <= Math.ceil(window._store.likedInfo.count / 9); i++) {
      if (await getLikedList(i)) break;
      console.log(`加载喜欢的文章中...(${window._store.likedInfo.count}/${window._store.likedList.length})`);
    }

    await getBookmarksInfo();
    for (let i = 1; i <= Math.ceil(window._store.bookmarksInfo.count / 20); i++) {
      if (await getBookmarksList(i)) break;
      console.log(`加载收藏的文章中...(${window._store.bookmarksInfo.count}/${window._store.bookmarksList.length})`);
    }
    console.log('***********加载成功*************');
    console.log('***********简书搜索强化1.0.1*************');
    console.log('***********欢迎来Star~~*************');
  }
  main();
  //---------------------

  // Your code here...
})();
