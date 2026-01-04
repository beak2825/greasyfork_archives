// ==UserScript==
// @name         搜索引擎跳转
// @namespace    https://greasyfork.org/zh-CN/scripts/32437-%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%B7%B3%E8%BD%AC
// @version      0.9.1
// @description  简单的搜索引擎跳转
// @author       tgxh
// @include	http://*
// @include	https://*
// @match       *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/32437/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/32437/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function (window, document) {
  const href = window.location.href,
    styles = `
      .t_search_list {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
      }

      .t_search_list a {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        margin-right: 10px;
        font-size: 16px;
        color: #666 !important;
        text-decoration: none;
      }

      .t_search_list a:hover {
        //background-color: #fff !important;
      }

      .t_search_list a > img {
        margin-right: 2px;
        width: 16px;
        height: 16px;
      }
.t_search_list a > img._Baidu {
        width: 18px;
        height: 18px;
      }
      body #hdtbMenus {
        top: 100px !important;
      }
    `;

  /*
   * name：显示名字
   * url：页面url匹配正则
   * id：输入框id
   * type 插入页面的方式
   * selector：插入位置选择器，jquery写法
   * link：跳转的搜索链接，用%s代替搜索关键词
   * icon：图标链接 */
  const siteInfos = [
    {
      name: 'Google',
      url: /^https?:\/\/(www|encrypted)\.google(?:\.\D{1,3}){1,2}\/(webhp|search|#|$|\?)/i,
      id: '[name="q"]',
      type: 'appendChild',
      selector: '#before-appbar',
      link: 'https://www.google.com/search?hl=zh-CN&safe=off&q=%s',
      icon: 'https://www.google.com/favicon.ico',
      css: 'padding-left: 180px; padding-top: 10px;',
    },
    {
      name: 'Baidu',
      url: /^https?:\/\/www\.baidu\.com\/(?:s|baidu)/i,
      id: '#kw',
      type: 'insertFirst',
      selector: '#wrapper_wrapper',
      link: 'https://www.baidu.com/s?wd=%s',
      icon: 'https://www.baidu.com/favicon.ico',
      css: 'padding-left: 148px; padding-top: 10px;',
    },
    {
      name: 'Bing',
      url: /^https?:\/\/.*\.bing\.com\/search\?/i,
      id: '#sb_form_q',
      type: 'insertFirst',
      selector: '#b_tween',
      link: 'http://cn.bing.com/search?q=%s',
      icon: 'https://www.bing.com/sa/simg/favicon-2x.ico',
      css: 'position: relative;left: -23px;margin-top: -18px;margin-bottom: 5px;padding-top: 5px;',
    },
    {
      name: 'Zhihu',
      url: /^https?:\/\/www\.zhihu\.com\/search\?/i,
      id: '.Input',
      type: 'insertFirst',
      selector: '.SearchTabs',
      link: 'https://www.zhihu.com/search?type=content&q=%s',
      icon: 'https://static.zhihu.com/heifetz/favicon.ico',
      css: 'width: 1000px;margin: 6px auto -6px;padding-left: 35px;',
    },
    {
      name: 'Douban',
      url: /^https?:\/\/www\.douban\.com\/search*/i,
      id: 'input[name="q"]:not(#inp-query)',
      type: 'insertBefore',
      before: '.search-cate',
      selector: '.article',
      link: 'https://www.douban.com/search?q=%s',
      icon: 'https://img3.doubanio.com/favicon.ico',
      css: 'margin-top: -20px;margin-bottom: 8px;',
    },
    {
      name: 'Bilibili',
      url: /https?:\/\/search.bilibili.com\/all*/i,
      id: '#search-keyword',
      type: 'insertFirst',
      selector: '#navigator',
      link: 'https://search.bilibili.com/all?keyword=%s',
      icon: 'https://static.hdslb.com/images/favicon.ico',
      css: 'padding-left: 258px;margin-top: 5px;',
    },
  ];

  /*
   * id：输入框的id
   * selector：插入位置的选择器，jquery写法
   * type：插入方式appendChild、insertFirst，分别是selector的子元素第一个和最后的位置
   * css：搜索条自定义样式*/
  function createList(id, selector, css, type, before) {
    const word = document.querySelector(id).getAttribute('value');
    const styleEle = document.createElement('style');
    styleEle.innerHTML = styles;
    document.querySelector('head').appendChild(styleEle);

    const wrap = document.createElement('div');
    wrap.className = 't_search_wrap';
    wrap.style.cssText += css;
    wrap.innerHTML = '<div class="t_search_list"></div>';

    let p;
    // 插入方式，可以自定义
    switch (type) {
      case 'appendChild':
        document.querySelector(selector).appendChild(wrap);
        break;
      case 'insertFirst':
        p = document.querySelector(selector);
        p.insertBefore(wrap, p.firstChild);
        break;
      case 'insertBefore':
        p = document.querySelector(selector);
        p.insertBefore(wrap, p.querySelector(before));
        break;
      default:
    }

    const listElement = document.querySelector('.t_search_list');
    listElement.innerHTML = '<a href=""></a>'.repeat(siteInfos.length);
    const linkList = listElement.querySelectorAll('.t_search_list a');
    linkList.forEach((item, i) => {
      item.innerHTML = `<img src="${siteInfos[i].icon}" class="_${siteInfos[i].name}">${siteInfos[i].name}`;
      item.href = siteInfos[i].link.replace(/%s/, word);
    });
  }

  function init() {
    siteInfos.some(item => {
      if (item.url.test(href)) {
        const { id, selector, css, type, before } = item;
        createList(id, selector, css, type, before);
        return true;
      }
    });
  }

  window.addEventListener('load', init, false);
})(window, document);
