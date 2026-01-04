// ==UserScript==
// @name         办公小工具
// @namespace    http://sc.p5w.net
// @version      1.0.9
// @description  提高办公效率小工具 1.繞過百度、搜狗、谷歌、好搜搜索結果中的自己的跳轉鏈接，直接訪問原始網頁
// @author       ahl
// @connect    www.baidu.com
// @include    *://ipv6.baidu.com/*
// @include    *://www.baidu.com/*
// @include    *://www1.baidu.com/*
// @include    *://m.baidu.com/*
// @include    *://encrypted.google.*/search*
// @include    *://*.google*/search*
// @include    *://*.google*/webhp*
// @include    *://www.so.com/s*
// @include    *://news.so.com/*
// @include    *://sogou.com*
// @include    *://*.sogou.com/sogou*
// @include    *://*.sogou.com/web*
// @include    *://weixin.sogou.com/*
// @include    *://s.weibo.com/*
// @include    *://so.eastmoney.com/*
// @exclude    *://*.google*/sorry*
// @require    https://cdn.jsdelivr.net/npm/mammoth@1.4.8/mammoth.browser.min.js
// @require    https://unpkg.com/string-similarity@4.0.2/umd/string-similarity.min.js
// @grant    GM_xmlhttpRequest
// @grant    GM_getValue
// @grant    GM.getValue
// @grant    GM_setValue
// @grant    GM.setValue
// @grant    GM.listValues
// @grant    GM.deleteValue
// @grant    unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/411364/%E5%8A%9E%E5%85%AC%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/411364/%E5%8A%9E%E5%85%AC%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

!(function () {
  let isdebug = true;
  let debug = isdebug ? console.log.bind(console) : function () {};
  debug('程序开始');

  var APConfig = {
    isRedirectEnable: false, // 是否开启重定向功能(会导致加载慢)
    isAdsEnable: true, // 是否开启去广告模式
    isAutopage: true, // 是否开启自动翻页功能

    doDisableSug: true, // 是否禁止百度搜索预测
    isALineEnable: true, // 是否禁止下划线
    showSerachBox: true, //是否展示聚合搜索
    // 解析word标题，去重使用
    word: {
      enable: true, // 解析word
      record: true, //是否记录相关信息，设为false则刷新后清空
      similarRate: 0.6, // 标题相似度阈值，大于则展示相似度
      similarStyle: 'background: #bfbfbf;', //相似文章的样式
      similarTitleColor: '#fadb14',
    },
    //样式优化
    baiduStyle: {
      enable: true, // 是否开启
      baiduZoom: 1, //百度放大倍数，默认1.15，
      width: '900px', //宽度
    },
    googleStyle: {
      enable: true,
      width: '900px', //宽度
    },
    haosouStyle: {
      enable: true,
      width: '900px', //宽度
    },
    sogouStyle: {
      enable: true,
      width: '900px', //宽度
      showImg: false, //是否展示图片（微信搜索）,
      // timeLimitStyle: 'display:none;',
      timeLimitStyle: 'opacity: 0.4;', // 时间范围外的样式
    },
    weiboStyle: {
      enable: true,
      width: '900px', //宽度
    },
    eastmoneyStyle: {
      enable: true,
      width: '900px', //宽度
    },
  };

  // 聚合搜索
  var urlMapping = [
    {
      name: '百度搜索',
      searchUrl: 'https://www.baidu.com/s?wd=',
    },
    {
      name: '百度资讯',
      searchUrl: 'https://www.baidu.com/s?tn=news&rtt=4&bsst=1&cl=2&word=',
    },
    {
      name: '好搜索',
      searchUrl: 'https://www.so.com/s?q=',
    },
    {
      name: '360资讯',
      searchUrl: 'https://news.so.com/ns?rank=pdate&src=sort_time&q=',
    },
    {
      name: '搜狗搜索',
      searchUrl: 'https://www.sogou.com/web?query=',
    },
    {
      name: '搜狗新闻',
      searchUrl: 'https://www.sogou.com/sogou?interation=1728053249&query='
    },
    {
      name: '搜狗微信',
      searchUrl: 'https://weixin.sogou.com/weixin?type=2&query=',
    },
    {
      name: '微博搜索',
      searchUrl: 'https://s.weibo.com/weibo?q=',
    },
    {
      name: '东方财富',
      searchUrl: 'http://so.eastmoney.com/news/s?sortfiled=4&keyword=',
    },
    {
      name: 'Google',
      searchUhttps: 'https://www.google.com/search?q=',
    },
  ];

  var curSite = {
    SiteTypeID: 1, // 当前站点的ID
    Stype_Normal: '', // 重定向选择器，只有百度-搜狗-好搜
    titleElement: '', // 标题选择器
  };

  let DBSite = {
    baidu: {
      SiteTypeID: 1,
      Stype_Normal: 'h3.t>a, .c-container article a',
      pager: {
        nextLink: '//div[@id="page"]//a[contains(text(),"下一页")][@href]',
        pageElement: 'css;div#content_left > *',
        HT_insert: ['css;div#content_left', 2],
        replaceE: 'css;#page',
        stylish: '.autopagerize_page_info, div.sp-separator {margin-bottom: 10px !important;}',
      },
      titleElement: '//div[@id="content_left"]//h3/a',
    },
    sogou: {
      SiteTypeID: 2,
      Stype_Normal: 'h3.pt>a, h3.vrTitle>a',
      pager: {
        nextLink: '//div[@id="pagebar_container"]//a[@id="sogou_next"]',
        pageElement: '//div[@class="results"]/div | //div[@class="news-box"]/ul',
        HT_insert: ['//div[@class="results"] | //div[@class="news-box"]/ul', 2],
        replaceE: 'id("pagebar_container")',
      },
      titleElement: '//div[@class="news-box"]/ul/li//div[@class="txt-box"]//h3/a',
      weixinTitleElement: '//div[@class="results"]//h3[@class="vr-title"]/a',
    },
    haosou: {
      SiteTypeID: 3,
      Stype_Normal: '.res-list h3>a',
      pager: {
        nextLink: "//div[@id='page']//a[text()='下一页'] | id('snext')",
        pageElement: "//div[@id='container']/div",
        HT_insert: ["//div[@id='container']", 2],
        replaceE: "id('page')",
      },
      titleElement: '//ul[@id="news"]//h3/a',
    },
    weibo: {
      SiteTypeID: 4,
      pager: {
        nextLink: '//div[@class="m-page"]//a[@class="next"]',
        pageElement: '//div[@id="pl_feedlist_index"]/div[1]',
        HT_insert: ['//div[@id="pl_feedlist_index"]', 2],
        replaceE: '//div[@class="m-page"]',
      },
      titleElement: '//div[@class="card-wrap"]//div[@class="content"]/p[@class="txt"][1]',
    },
    google: {
      SiteTypeID: 5,
      pager: {
        nextLink: 'id("pnnext") | id("navbar navcnt nav")//td[span]/following-sibling::td[1]/a | id("nn")/parent::a',
        pageElement: '//div[@id="res"]',
        HT_insert: ['css;#res', 2],
        replaceE: '//div[@id="navcnt"] | //div[@id="foot"][@role="navigation"]',
      },
      titleElement: '//div[@class="JheGif nDgy9d"]',
    },
    eastmoney: {
      SiteTypeID: 6,
      pager: {
        nextPage: 'pageindex',
        pageElement:
          '//div[@class="modules"]//div[contains(@class,"module-news-list")]/div | //div[@class="modules"]//div[contains(@class,"module-linkpage")]/div',
        HT_insert: [
          '//div[@class="modules"]//div[contains(@class,"module-news-list")] | //div[@class="modules"]//div[contains(@class,"module-linkpage")]',
          2,
        ],
        replaceE: '//div[@class="page-group"]',
      },
      titleElement: '//div[@class="news-item"]//h3/a | //div[@class="list-item"]//h3/a',
    },

    other: {
      SiteTypeID: 9,
    },
  };

  let SiteType = {
    BAIDU: DBSite.baidu.SiteTypeID,
    SOGOU: DBSite.sogou.SiteTypeID,
    SO: DBSite.haosou.SiteTypeID,
    GOOGLE: DBSite.google.SiteTypeID,
    WEIBO: DBSite.weibo.SiteTypeID,
    EASTMONEY: DBSite.eastmoney.SiteTypeID,
    OTHERS: DBSite.other.SiteTypeID,
  };

  if (typeof GM === 'undefined') {
    // 这个是ViolentMonkey的支持选项
    GM = {};
    GM.setValue = GM_setValue;
    GM.getValue = GM_getValue;
  }

  let wordTitle = {
    weixin: [],
    weibo: [],
    news: [],
  };

  let insertLocked = false;
  let timeLimit = localStorage.getItem('weixin-time-limit');
  let activeTitleId = ''; //高亮的标题id
  const wordListElId = 'ahl-show-word-title-list';
  (function () {
    debug('程序执行');

    // iframe 中不运行
    if (window.top != window.self) {
      return;
    }

    // 设置基本信息
    setInitInfo();

    // 优化样式
    optimizationStyle();

    // 自动翻页
    autoChagePage();

    // 隐藏广告
    removeAD();

    // 聚合搜索
    addSerachBox();

    getWordLinkHight();

    handleSogouWeixin();

    if (APConfig.doDisableSug) {
      // 不启用移动预测[默认]
      setCookie('ORIGIN', 2, 'www.baidu.com');
      setCookie('ISSW', 1);
      setCookie('ISSW', 1, 'www.baidu.com');
    }

    try {
      if (curSite.SiteTypeID !== SiteType.OTHERS) {
        document.addEventListener('DOMNodeInserted', MainCallback, false);
        document.addEventListener('keyup', MainCallback, false);
        // RAFInterval(function () {
        //   rapidDeal(); // 定期调用，避免有时候DOM插入没有执行导致的问题
        // }, 800);
      }
    } catch (e) {
      console.log(e);
    }

    function MainCallback(e) {
      if (e.target != null && typeof e.target.className == 'string' && e.target.className.toUpperCase().indexOf('AC-') == 0) {
        return;
      } //屏蔽掉因为增加css导致的触发insert动作
      rapidDeal();
    }

    function rapidDeal() {
      try {
        if (insertLocked === false && curSite.SiteTypeID !== SiteType.OTHERS) {
          insertLocked = true;
          ACHandle(); // 处理主重定向

          // 删除广告放进来，减少卡顿
          removeAD();

          setTimeout(function () {
            insertLocked = false;
          }, 200);
        }
      } catch (e) {
        console.log(e);
      }
    }

    /**************************** 设置基本信息 ******************/
    function setInitInfo(params) {
      if (location.host.includes('.baidu.com')) {
        curSite = DBSite.baidu;
      } else if (location.host.includes('sogou')) {
        curSite = DBSite.sogou;
        curSite.weixin = location.host.includes('weixin');
      } else if (location.host.includes('so.com')) {
        // 360搜索
        curSite = DBSite.haosou;
      } else if (location.host.includes('weibo')) {
        curSite = DBSite.weibo;
      } else if (location.host.includes('google')) {
        curSite = DBSite.google;
      } else if (location.host.includes('eastmoney')) {
        curSite = DBSite.eastmoney;
      } else {
        curSite = DBSite.other;
      }
      curSite.pageNum = 1; // 当前页数
      curSite.pageLoading = false;
      curSite.pageUrl = '';

      debug('基本信息处理完成' + curSite.toString());
    }
    /**************************** 设置基本信息结束 ******************/

    /***************************** 自动翻页 ************************/
    function autoChagePage() {
      if (APConfig.isAutopage === false) {
        //搜狗无法实现
        return;
      }
      debug('自动翻页');
      windowscroll(function (direction, e) {
        if (direction === 'down') {
          // 下滑才准备翻页
          let spl = document.querySelector('#sp-fw-a_enable');
          // 开启后，且在非（suprepreloader启用）时均可
          if (APConfig.isAutopage === true && !(spl && spl.checked === true)) {
            var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            let scrollDelta = 666;
            if (curSite.SiteTypeID === SiteType.GOOGLE) {
              scrollDelta = 1024; // 毕竟谷歌加载缓慢的问题
            }
            if (
              document.documentElement.scrollHeight <= document.documentElement.clientHeight + scrollTop + scrollDelta &&
              curSite.pageLoading === false
            ) {
              curSite.pageLoading = true;
              ShowPager.loadMorePage();
            }
          }
        }
      });
    }

    function windowscroll(fn) {
      var beforeScrollTop = document.documentElement.scrollTop;
      fn = fn || function () {};
      setTimeout(function () {
        // 延时执行，避免刚载入到页面就触发翻页事件
        window.addEventListener(
          'scroll',
          function (e) {
            var afterScrollTop = document.documentElement.scrollTop,
              delta = afterScrollTop - beforeScrollTop;
            if (delta == 0) {
              return false;
            }
            fn(delta > 0 ? 'down' : 'up', e);
            beforeScrollTop = afterScrollTop;
          },
          false
        );
      }, 1000);
    }

    var ShowPager = {
      getFullHref: function (e) {
        if (e == null) return '';
        'string' != typeof e && (e = e.getAttribute('href'));
        var t = this.getFullHref.a;
        return t || (this.getFullHref.a = t = document.createElement('a')), (t.href = e), t.href;
      },
      getNextHref: function (e) {
        var nextPage = 2;
        var pageReg = new RegExp('(^|&)' + e + '=([^&]*)(&|$)');
        var nowUrl = curSite.pageUrl && curSite.pageUrl != '' ? curSite.pageUrl : window.location.href;
        var r = nowUrl.match(pageReg);
        if (r != null) {
          var pageIndex = parseInt(unescape(r[2]));
          nextPage = pageIndex + 1;
          return nowUrl.replace(`${e}=${pageIndex}`, `${e}=${nextPage}`);
        } else {
          return `${nowUrl}&${e}=${nextPage}`;
        }
      },
      getNextPageByRequest: function (url, callback, onerror) {
        GM_xmlhttpRequest({
          url: url,
          method: 'GET',
          timeout: 5000,
          onload: function (response) {
            var newBody = ShowPager.createDocumentByString(response.responseText);
            callback(newBody);
          },
          onerror: function () {
            onerror();
          },
        });
      },
      getNextPageByIframe: function (url, callback, onerror) {
        var frame = document.getElementById('ahl-next-page-iframe');
        if (!frame) {
          var frame = document.createElement('iframe');
          frame.id = 'ahl-next-page-iframe';
          frame.style.display = 'none';
          frame.src = url;
          document.body.insertAdjacentElement('beforeend', frame);
        } else {
          frame.contentWindow.location.href = url;
        }

        frame.onload = function () {
          var maxTime = 0;
          var timer = window.setInterval(function () {
            var document = frame.contentWindow.document;
            var list = getAllElements(curSite.pager.pageElement, document, document);
            maxTime++;
            if (list && list.length > 0) {
              callback(document);
              window.clearInterval(timer);
            }
            if (maxTime > 30) {
              onerror(document);
              window.clearInterval(timer);
            }
          }, 100);
        };
      },
      getNextPageByUrl: function (url, isframe, callback, onerror) {
        if (isframe) {
          this.getNextPageByIframe(url, callback, onerror);
        } else {
          this.getNextPageByRequest(url, callback, onerror);
        }
      },
      createDocumentByString: function (e) {
        if (e) {
          if ('HTML' !== document.documentElement.nodeName) return new DOMParser().parseFromString(e, 'application/xhtml+xml');
          var t;
          try {
            t = new DOMParser().parseFromString(e, 'text/html');
          } catch (e) {}
          if (t) return t;
          if (document.implementation.createHTMLDocument) t = document.implementation.createHTMLDocument('ADocument');
          else {
            try {
              (t = document.cloneNode(!1)).appendChild(t.importNode(document.documentElement, !1)),
                t.documentElement.appendChild(t.createElement('head')),
                t.documentElement.appendChild(t.createElement('body'));
            } catch (e) {}
          }
          if (t) {
            var r = document.createRange();
            r.selectNodeContents(document.body);
            var n = r.createContextualFragment(e);
            t.body.appendChild(n);
            for (
              var a,
                o = {
                  TITLE: !0,
                  META: !0,
                  LINK: !0,
                  STYLE: !0,
                  BASE: !0,
                },
                i = t.body,
                s = i.childNodes,
                c = s.length - 1;
              c >= 0;
              c--
            )
              o[(a = s[c]).nodeName] && i.removeChild(a);
            return t;
          }
        } else console.error('[AC-Script]', '没有找到要转成DOM的字符串');
      },
      loadMorePage: function () {
        if (curSite.pager) {
          var isIframe = false;
          if (curSite.pager.nextLink) {
            let curPageEle = getElementByXpath(curSite.pager.nextLink);
            var url = this.getFullHref(curPageEle);
          } else if (curSite.pager.nextPage) {
            var url = this.getNextHref(curSite.pager.nextPage);
            isIframe = true;
          }
          if (
            curSite.SiteTypeID !== SiteType.BAIDU &&
            navigator.userAgent.toLowerCase().includes('safari') &&
            !navigator.userAgent.toLowerCase().includes('chrome')
          ) {
            // MARK 为了兼容百度在safari下的
            url = url.replace('https://', 'http://');
          }
          if (url === '') {
            curSite.pageLoading = false;
            return;
          }
          var sepImgs = {
            top:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWtJREFUeNrclE0rRGEUx8c1GUpRJIVIZGdhZCVr38GGhaI0ZXwCkliglChZEcvJxhdgYWOjLEUpm/EyiLzze+o8dTzdO3PljoVTv7rPc8/5d+6555xYrEhWop6boda5+6l9wjWcWpF+WIbqCJJ9hFRcDr3QAIkIhKugz5PDfkSixkphz5aiAnqgE8rgWRxGoSOPyBkswQuUwyscw4HrmFCZL8Kt/JAg7mEFPEmo4FdPwk0BUcsdzIap0TQ8qMAPuICcEjLnd+VjSjcfJNgIc/DkZGSymYGsnK9EZMrxe4MFaNGiZjC2fT5zQ3p7QDK1dR2GSljziclAvRUe8nHYVA4jjvC43NfAuk/smB2QNqcsWxKcLbAKTFnS0hWD6n27Fd6FLqiDI5iQmQ9jpiVT0sNJ6aYd7dAE3QHBbinSAX5JWWaxuLo8F35jh/bBK9Y+/r/Cl6pLcnna8NvuDGMnslpbZRpXZYT/3r4EGACZL3ZL2afNFAAAAABJRU5ErkJggg==',
            bottom:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXFJREFUeNrM1c8rBGEcx/FdtCEkLqYtpdwkKSUHUhxwITdK+Z3yM2cOLnJ39Cc44SgHScmJwlFxsIdlCScO6/2t76Onp52dXTtbnno1M8+Pz84+zzMzkcg/KA3oRTzM0A4cI4VTdIUVPIM3pPGO5aABJTkGx1BqjYmFFZxW7nnBwXmXogWX6bEGc2jEIU7+kNWDUSSwZyqndSvJ3N1g2Bm0oLtB2j+w7rQP4MpqXzRT0YRaPW/BthMedYLs60HsoE2vq9BsPwAJa8XFLUa0fUrvROo/saT1Q9adGimdlt8yj6TT6Q6d2vaida9YRbtP6EqmBZC5fHA6X+AAz1bwEc6cfk9+oaZM4NoZJL70+J2hTaZtNpet041zK8yP/Mgl+rOF1emr0UM1xnAfEPyISd0Jno6vtx+QuM6PZ22lpO7dbEV2Siv6rPeIjNs1HdYC7ixfG+YBqdTVDqPIv6iIWvO7iXGUFxAqi72PraJ9IH8EGACQcYjYRd5GHwAAAABJRU5ErkJggg==',
            pre:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAASlJREFUeNpiYBjOoBiIrwJxFRAzUsvQViD+CMT/gfgTEPdRy9BPUENh+AsQ91JiaAuSS9HxZ3INb8Hi0v+UurwF6qL/ROBvQNxDrKFfkTT+A+JnQPwBKfJA/L9Ian7ic7kMEHcC8Q80F3UAcRsQv4by30INaUJT9weaWhSQDRUB4uVYvLkYiAWAOBopvEFBlArEPEA8G4ue9UAsATM4EYuCJUgKMtAMLoSKCwPxXCx6c1igClTQgmUZVPNrHMEGy3mgYCkCYiYgTkCSV4UZvA2IjYBYDIgvQbPvOyJTECid5wHxbyA2BuL3QLwRWYEsEJvg0IweFEU41IEMlgcxWJAEH0MxJeAsjMFEq6Jw+Br8BimVfMCTDEkG7EBcA8T3oWUJx4DVYwABBgCannnSzbgwIQAAAABJRU5ErkJggg==',
            next:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT1JREFUeNrc1b1KA0EYheEl/iARFFEkKl6D0UK8CrEVrCwEexFCtBIlRWIjsfEiLL0FKzs7QUWxM2piFMUkvhPOwLAs2TGuCn7wkNll5jC7+w0Jgv9avdjAObbQn1TwCu7QwhWW4xakPIOHMKzxGCaSCm6ioXHLZ0Hqpz7KrwRPIvvNvBlM2zYyNY8cMjhDHo9fCBzErnIqKNjgRSxpvIABbOLes2MKWHfuXdhXcR2avKrJ4zGhI9gLhQbq9XaZgGO1kutIOzIHpKp7NawhjYOINSeY6lFwHacw17P6NTWHd4xqnNbcS83LObtsaCPbEW+gXUW8ODswC27xoOsn3ODDmfOGss9XLuE54jGjvPqGuuG1mFDzZIfdNHynnde7DbW1r5DwTstJHP2iE55YqD36ebXZDvr+7L/sU4ABAIpVZWnoA5GkAAAAAElFTkSuQmCC',
            next_gray:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtxJREFUeNrclc9L2mEcx7/6NbVZqRVj7pIOlIUuZ1HMgv0BDcqT7JrskH13ELPBF7eTvz10HznWQBlBRIfBXIfBLmqXscvYZWPKrMNIU9Apmrr34/w6i0ovMZjw+H0+z/N8Xt+Pn/fn80hR/+WHYRhBIpFwRKPRz/F4/KnD4RB28xH0Ah4cHHyoUCjsIpFIIZPJHkml0m9Yfn2ZD78XcL1eH6rValIMCmMUtqKbD7/HbNQxaq15oxcH/lXpcmXgtnh2u/2mXC6/DqE+sSxLlUqlniE0TVPBYJAqFot6+GV9Pt+PJthms80sLS2xEonkhlgs/jgwMOBcXV3N5fP5rlCcp9bX1yWLi4uecrk8U6lUshDY3wRbLJYFGKZsNksq4N78/LwY9hOn05k5Ojqi+PzTGePxeFwZUl6vd8hkMvkPDg6sZJ2M5eXlr1wqUu2kA5JOpy2IAO+oO9fW1n5mMpk2nDjmcjkKNU25XC652Wx2pVIp65mXJ2nyjUPpqakpNZxuA8Y5T87OzsobjcYHpVKpGhsbe1CtVkXYqxQKhTdqtfqL1Wr1JpPJxxyU5Lq/vz8aCoX8TTDatYiFhF6vxx5tAJwm8OPj48m5ubmKSqUaAWwSa9eQw6JGo/luNBoNh4eHbAe0JhAINsLh8LNAIJCiudhxB+Qh2ludTifDAQLvI3AIch+Rkl8jJlrhCbOqgfoLmDepOF/BfGNra2sFFZFtvqgzMbFYjAiyp9Vqh4VC4cTJyYmQ90epIQJtHRO1bA5aRhAvdnZ2GI/H87cEz5YPgeOS2RsfHx9B7u+gOi68yQAtYX9zd3eXgZCna/s8By5ypGUUzhOISHgO9BfWXwG6chZ6IbiVc6LwnsFgGIVAepLzjk4rYW1ze3ubcbvd53fjZV2FaqGQ63fT09PDMO9i9BEoon0J9Rm/339xm3dr2f39fVLX7wFvoMVvoYWfRyIRFndD/Z/8nf0WYAA8EC1Z/ZNm4gAAAABJRU5ErkJggg==',
            pre_gray:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAslJREFUeNrclTtMWmEUxz/uvTzlIUhpNMR0aGNjrNHSmHTqRJyadujQDbSGRwJUaYCmDizqUEw6ODVNGgbpYCfSpFINCQzFR9oyMXRsXFCsAXkIKNL/R7gGWxOsSdPEk5zc3O+e87vn+59zv0vIpbSJiQmyubn5LBKJpNbX11+4XC5Buxy2XYDNZiMOh2OW4ziPTCbTi8XikeHh4SsSieQTXnIxsN1uJ1ardVYgEDgPDw+V9Xqd1Go1Mcuyg7AuuVy+sra29ndgVEnGx8dnhEKhs1qtKgE/eXZ8fCzC+q3+/n6tSqVaSSQS5wM7nU5iMplmsF1XpVI5BeXt6OhIBFkGAe9SKpV/wNmzKjWbzRT6tFwuK86CUqPrkIVWPjQwMKBWKBSn4Ozv0LGxsRmRSDSFSjua0Do8TRWAS+B5+B68g/IhixCNvQPN1WjuieZsS/f1aNQ0wzBuaCqlUCQRtVr9Es1K4kVDWJNhrQjAIiqMlkqle804FnkjBoOhEzv4vrGxkW2ALRaLFrq+QoAV2nE8tLe3dzEYDE5vb2939vX1PcBkiKVSaQ1jForFYq+NRqMum83ebsYzmJq7sGu4xhkKxsDfB/AxnO860ev1oeXlZU8gEMgmk0kFqmw8o9dUKiWfn58vhMPh54h7S+OpQXNSLBYfejyeR1yzw9dbRon09PS8W11dnfL5fJl8Pk+0Wi3hk5vyCNBY4vV6f0Im9+joKJNOp818o8G70ah4aWnpIzSKYCa/dXd3B+PxuHNycjKzs7NzAms1+qFQy+VydDRz0WjUpdPp3tB8TFM0FAqFGxXPzc19plJrNJqraMoXt9tNt3Suc+Tg4ICeJfmFhQVLoVAwoKG7fr//B8cHAL6Fy9ZFDinaG/r5w77ya8y/OhEvKRhjtIup2YMTeBb3mXY53HnAmNkP+/v7NzHTTwAO4f79f/ud/RJgAOLcRNZqLojMAAAAAElFTkSuQmCC',
          };
          addStyle(
            '.sp-separator{line-height:1.8 !important;opacity:1 !important;position:relative !important;float:none !important;top:0 !important;left:0 !important;min-width:366px;width:auto;text-align:center !important;font-size:14px !important;display:block !important;padding:3px 0 !important;margin:5px 10px 8px;clear:both !important;border-style:solid !important;border-color:#cccccc !important;border-width:1px !important;-moz-border-radius:30px !important;border-radius:30px !important;background-color:#ffffff !important;}.sp-separator:hover{box-shadow:0 0 11px rgba(33,33,33,0.2);}#sp-separator-hover{display:none;}.sp-separator:hover #sp-separator-hover{display:block;}.sp-separator .sp-someinfo{position:absolute !important;right:10px !important;font-size:12px !important;font-style:italic !important;background:none !important;}.sp-separator span{vertical-align: middle;cursor: pointer;padding: 0;margin: 0 5px;display: inline-block; width:22px;height:22px;}.sp-separator a{margin:0 20px 0 -6px !important;display:inline !important;text-shadow:#fff 0 1px 0 !important;background:none !important;color:#595959 !important;}.sp-separator input{padding:0 !important;line-height:23px !important;}.sp-separator .sp-md-span{font-weight:bold !important;margin:0 20px !important;}#sp-sp-md-number{width:6ch !important;vertical-align:middle !important;display:inline-block !important;text-align:left !important;}' +
              `.ac_sp_top{background-image:url('${sepImgs.top}')}` +
              `.ac_sp_pre{background-image:url('${sepImgs.pre}')}` +
              `.ac_sp_next{background-image:url('${sepImgs.next}')}` +
              `.ac_sp_bottom{background-image:url('${sepImgs.bottom}')}` +
              `.ac_sp_next_gray{background-image:url('${sepImgs.next_gray}')}` +
              `.ac_sp_pre_gray{background-image:url('${sepImgs.pre_gray}')}`,
            'AC-Preload'
          );
          if (curSite.pageUrl === url) {
            console.error('[AC-Script]', '翻页到达底部了 - 或者异常 - 出现异常请直接反馈作者修改');
            return;
          } // 不会重复加载相同的页面
          curSite.pageUrl = url;

          this.getNextPageByUrl(
            url,
            isIframe,
            function (newBody) {
              try {
                let pageElems = getAllElements(curSite.pager.pageElement, newBody, newBody);
                let toElement = getAllElements(curSite.pager.HT_insert[0])[0];
                if (pageElems.length >= 0) {
                  // 处理最后一个翻页按钮
                  let nextEs = document.querySelectorAll('#sp-sp-gonext');
                  if (nextEs.length > 0) {
                    let lastE = nextEs[nextEs.length - 1];
                    lastE.classList.replace('ac_sp_next_gray', 'ac_sp_next');
                  }
                  // 插入翻页按钮元素
                  curSite.pageNum++;
                  let addTo = 'beforeend';
                  if (curSite.pager.HT_insert[1] == 1) addTo = 'beforebegin';
                  toElement.insertAdjacentHTML(
                    addTo,
                    `<div class='sp-separator AC' id='sp-separator-ACX'>
                      <a class='sp-sp-nextlink' target='_blank'><b>第 <span style='color:#595959!important;'>ACX</span> 页</b></a>
                      <span id="sp-sp-gotop" class='ac_sp_top' title='去到顶部'></span>
                      <span id="sp-sp-gopre" class='${curSite.pageNum <= 2 ? 'ac_sp_pre_gray' : 'ac_sp_pre'}' title='上滚一页' ></span>
                      <span id="sp-sp-gonext" class='ac_sp_next_gray' title='下滚一页'></span>
                      <span id="sp-sp-gobottom" class='ac_sp_bottom' title='去到底部' ></span></div>`.replace(/ACX/gm, curSite.pageNum)
                  );
                  // 搜狗微信时间处理
                  if (curSite.SiteTypeID === SiteType.SOGOU && curSite.weixin) {
                    getWeixinTime(newBody);
                    filterWeixinList(newBody);
                  }
                  handSimilar(newBody);
                  // 插入新页面元素
                  pageElems.forEach(function (one) {
                    toElement.insertAdjacentElement(addTo, one);
                  });
                  document.querySelectorAll('.sp-separator.AC:not([bind])').forEach(function (per) {
                    per.setAttribute('bind', 1);
                    per.addEventListener('click', ac_spfunc);
                  });
                  // 替换待替换元素
                  try {
                    let oriE = getAllElements(curSite.pager.replaceE);
                    let repE = getAllElements(curSite.pager.replaceE, newBody, newBody);
                    if (oriE.length === repE.length) {
                      for (let i = 0; i < oriE.length; i++) {
                        oriE[i].outerHTML = repE[i].outerHTML;
                      }
                    } else {
                      if (curSite.SiteTypeID === SiteType.SO) {
                        // 好搜bug
                        for (let i = 0; i < oriE.length; i++) {
                          oriE[0].remove();
                        }
                      }
                    }
                  } catch (e) {
                    console.log(e);
                  }
                }
              } catch (e) {
                console.log(e);
              }
              curSite.pageLoading = false;
            },
            function () {
              curSite.pageLoading = false;
            }
          );
          // GM_xmlhttpRequest({
          //   url: url,
          //   method: 'GET',
          //   timeout: 5000,
          //   onload: function (response) {
          //     try {
          //       var newBody = ShowPager.createDocumentByString(response.responseText);
          //       // xx.evaluate(xpath, xx)
          //       let pageElems = getAllElements(curSite.pager.pageElement, newBody, newBody);
          //       let toElement = getAllElements(curSite.pager.HT_insert[0])[0];
          //       if (pageElems.length >= 0) {
          //         // 处理最后一个翻页按钮
          //         let nextEs = document.querySelectorAll('#sp-sp-gonext');
          //         if (nextEs.length > 0) {
          //           let lastE = nextEs[nextEs.length - 1];
          //           lastE.classList.replace('ac_sp_next_gray', 'ac_sp_next');
          //         }
          //         // 插入翻页按钮元素
          //         curSite.pageNum++;
          //         let addTo = 'beforeend';
          //         if (curSite.pager.HT_insert[1] == 1) addTo = 'beforebegin';
          //         toElement.insertAdjacentHTML(
          //           addTo,
          //           `<div class='sp-separator AC' id='sp-separator-ACX'>
          //               <a class='sp-sp-nextlink' target='_blank'><b>第 <span style='color:#595959!important;'>ACX</span> 页</b></a>
          //               <span id="sp-sp-gotop" class='ac_sp_top' title='去到顶部'></span>
          //               <span id="sp-sp-gopre" class='${curSite.pageNum <= 2 ? 'ac_sp_pre_gray' : 'ac_sp_pre'}' title='上滚一页' ></span>
          //               <span id="sp-sp-gonext" class='ac_sp_next_gray' title='下滚一页'></span>
          //               <span id="sp-sp-gobottom" class='ac_sp_bottom' title='去到底部' ></span></div>`.replace(/ACX/gm, curSite.pageNum)
          //         );
          //         // 搜狗微信时间处理
          //         if (curSite.SiteTypeID === SiteType.SOGOU && curSite.weixin) {
          //           getWeixinTime(newBody);
          //           filterWeixinList(newBody);
          //         }
          //         handSimilar(newBody);
          //         // 插入新页面元素
          //         pageElems.forEach(function (one) {
          //           toElement.insertAdjacentElement(addTo, one);
          //         });
          //         document.querySelectorAll('.sp-separator.AC:not([bind])').forEach(function (per) {
          //           per.setAttribute('bind', 1);
          //           per.addEventListener('click', ac_spfunc);
          //         });
          //         // 替换待替换元素
          //         try {
          //           let oriE = getAllElements(curSite.pager.replaceE);
          //           let repE = getAllElements(curSite.pager.replaceE, newBody, newBody);
          //           if (oriE.length === repE.length) {
          //             for (let i = 0; i < oriE.length; i++) {
          //               oriE[i].outerHTML = repE[i].outerHTML;
          //             }
          //           } else {
          //             if (curSite.SiteTypeID === SiteType.SO) {
          //               // 好搜bug
          //               for (let i = 0; i < oriE.length; i++) {
          //                 oriE[0].remove();
          //               }
          //             }
          //           }
          //         } catch (e) {
          //           console.log(e);
          //         }
          //       }
          //     } catch (e) {
          //       console.log(e);
          //     }
          //     curSite.pageLoading = false;
          //   },
          //   onerror: function () {
          //     curSite.pageLoading = false;
          //   },
          // });
        }
      },
    };

    /*以下代码大部分来源于SuprePreloader 感谢 swdyh && ywzhaiqi && NLF 以及 mach6 大佬*/
    function ac_spfunc(e) {
      e.stopPropagation();
      var t,
        r = e.currentTarget;
      var Tween = {
          Linear: function Linear(e, t, r, n) {
            return (r * e) / n + t;
          },
          Quad: {
            easeIn: function easeIn(e, t, r, n) {
              return r * (e /= n) * e + t;
            },
            easeOut: function easeOut(e, t, r, n) {
              return -r * (e /= n) * (e - 2) + t;
            },
            easeInOut: function easeInOut(e, t, r, n) {
              return (e /= n / 2) < 1 ? (r / 2) * e * e + t : (-r / 2) * (--e * (e - 2) - 1) + t;
            },
          },
          Cubic: {
            easeIn: function easeIn(e, t, r, n) {
              return r * (e /= n) * e * e + t;
            },
            easeOut: function easeOut(e, t, r, n) {
              return r * ((e = e / n - 1) * e * e + 1) + t;
            },
            easeInOut: function easeInOut(e, t, r, n) {
              return (e /= n / 2) < 1 ? (r / 2) * e * e * e + t : (r / 2) * ((e -= 2) * e * e + 2) + t;
            },
          },
          Quart: {
            easeIn: function easeIn(e, t, r, n) {
              return r * (e /= n) * e * e * e + t;
            },
            easeOut: function easeOut(e, t, r, n) {
              return -r * ((e = e / n - 1) * e * e * e - 1) + t;
            },
            easeInOut: function easeInOut(e, t, r, n) {
              return (e /= n / 2) < 1 ? (r / 2) * e * e * e * e + t : (-r / 2) * ((e -= 2) * e * e * e - 2) + t;
            },
          },
          Quint: {
            easeIn: function easeIn(e, t, r, n) {
              return r * (e /= n) * e * e * e * e + t;
            },
            easeOut: function easeOut(e, t, r, n) {
              return r * ((e = e / n - 1) * e * e * e * e + 1) + t;
            },
            easeInOut: function easeInOut(e, t, r, n) {
              return (e /= n / 2) < 1 ? (r / 2) * e * e * e * e * e + t : (r / 2) * ((e -= 2) * e * e * e * e + 2) + t;
            },
          },
          Sine: {
            easeIn: function easeIn(e, t, r, n) {
              return -r * Math.cos((e / n) * (Math.PI / 2)) + r + t;
            },
            easeOut: function easeOut(e, t, r, n) {
              return r * Math.sin((e / n) * (Math.PI / 2)) + t;
            },
            easeInOut: function easeInOut(e, t, r, n) {
              return (-r / 2) * (Math.cos((Math.PI * e) / n) - 1) + t;
            },
          },
          Expo: {
            easeIn: function easeIn(e, t, r, n) {
              return 0 == e ? t : r * Math.pow(2, 10 * (e / n - 1)) + t;
            },
            easeOut: function easeOut(e, t, r, n) {
              return e == n ? t + r : r * (1 - Math.pow(2, (-10 * e) / n)) + t;
            },
            easeInOut: function easeInOut(e, t, r, n) {
              return 0 == e
                ? t
                : e == n
                ? t + r
                : (e /= n / 2) < 1
                ? (r / 2) * Math.pow(2, 10 * (e - 1)) + t
                : (r / 2) * (2 - Math.pow(2, -10 * --e)) + t;
            },
          },
          Circ: {
            easeIn: function easeIn(e, t, r, n) {
              return -r * (Math.sqrt(1 - (e /= n) * e) - 1) + t;
            },
            easeOut: function easeOut(e, t, r, n) {
              return r * Math.sqrt(1 - (e = e / n - 1) * e) + t;
            },
            easeInOut: function easeInOut(e, t, r, n) {
              return (e /= n / 2) < 1 ? (-r / 2) * (Math.sqrt(1 - e * e) - 1) + t : (r / 2) * (Math.sqrt(1 - (e -= 2) * e) + 1) + t;
            },
          },
          Elastic: {
            easeIn: function easeIn(e, t, r, n, a, o) {
              return 0 == e
                ? t
                : 1 == (e /= n)
                ? t + r
                : (o || (o = 0.3 * n),
                  !a || a < Math.abs(r) ? ((a = r), (i = o / 4)) : (i = (o / (2 * Math.PI)) * Math.asin(r / a)),
                  -a * Math.pow(2, 10 * (e -= 1)) * Math.sin(((e * n - i) * (2 * Math.PI)) / o) + t);
              var i;
            },
            easeOut: function easeOut(e, t, r, n, a, o) {
              return 0 == e
                ? t
                : 1 == (e /= n)
                ? t + r
                : (o || (o = 0.3 * n),
                  !a || a < Math.abs(r) ? ((a = r), (i = o / 4)) : (i = (o / (2 * Math.PI)) * Math.asin(r / a)),
                  a * Math.pow(2, -10 * e) * Math.sin(((e * n - i) * (2 * Math.PI)) / o) + r + t);
              var i;
            },
            easeInOut: function easeInOut(e, t, r, n, a, o) {
              return 0 == e
                ? t
                : 2 == (e /= n / 2)
                ? t + r
                : (o || (o = n * (0.3 * 1.5)),
                  !a || a < Math.abs(r) ? ((a = r), (i = o / 4)) : (i = (o / (2 * Math.PI)) * Math.asin(r / a)),
                  e < 1
                    ? a * Math.pow(2, 10 * (e -= 1)) * Math.sin(((e * n - i) * (2 * Math.PI)) / o) * -0.5 + t
                    : a * Math.pow(2, -10 * (e -= 1)) * Math.sin(((e * n - i) * (2 * Math.PI)) / o) * 0.5 + r + t);
              var i;
            },
          },
          Back: {
            easeIn: function easeIn(e, t, r, n, a) {
              return null == a && (a = 1.70158), r * (e /= n) * e * ((a + 1) * e - a) + t;
            },
            easeOut: function easeOut(e, t, r, n, a) {
              return null == a && (a = 1.70158), r * ((e = e / n - 1) * e * ((a + 1) * e + a) + 1) + t;
            },
            easeInOut: function easeInOut(e, t, r, n, a) {
              return (
                null == a && (a = 1.70158),
                (e /= n / 2) < 1
                  ? (r / 2) * (e * e * ((1 + (a *= 1.525)) * e - a)) + t
                  : (r / 2) * ((e -= 2) * e * ((1 + (a *= 1.525)) * e + a) + 2) + t
              );
            },
          },
          Bounce: {
            easeIn: function easeIn(e, t, r, n) {
              return r - Tween.Bounce.easeOut(n - e, 0, r, n) + t;
            },
            easeOut: function easeOut(e, t, r, n) {
              return (e /= n) < 1 / 2.75
                ? r * (7.5625 * e * e) + t
                : e < 2 / 2.75
                ? r * (7.5625 * (e -= 1.5 / 2.75) * e + 0.75) + t
                : e < 2.5 / 2.75
                ? r * (7.5625 * (e -= 2.25 / 2.75) * e + 0.9375) + t
                : r * (7.5625 * (e -= 2.625 / 2.75) * e + 0.984375) + t;
            },
            easeInOut: function easeInOut(e, t, r, n) {
              return e < n / 2
                ? 0.5 * Tween.Bounce.easeIn(2 * e, 0, r, n) + t
                : 0.5 * Tween.Bounce.easeOut(2 * e - n, 0, r, n) + 0.5 * r + t;
            },
          },
        },
        TweenM = ['Linear', 'Quad', 'Cubic', 'Quart', 'Quint', 'Sine', 'Expo', 'Circ', 'Elastic', 'Back', 'Bounce'],
        TweenEase = ['easeIn', 'easeOut', 'easeInOut'];
      var prefs = {
        s_method: 3,
        s_ease: 2,
        s_FPS: 60,
        s_duration: 333,
      };

      function getRelativeDiv(e) {
        var t = r.id;
        return (t = t.replace(/(sp-separator-)(.+)/, function (t, r, n) {
          return r + String(Number(n) + ('pre' == e ? -1 : 1));
        }))
          ? document.getElementById(t)
          : null;
      }

      function sp_transition(e, t) {
        var r = sp_transition.TweenF;
        r || ((r = (r = Tween[TweenM[prefs.s_method]])[TweenEase[prefs.s_ease]] || r), (sp_transition.TweenF = r));
        var n = 1e3 / prefs.s_FPS,
          a = 0,
          o = e,
          i = t - e,
          s = Math.ceil(prefs.s_duration / n),
          c = window.scrollX;
        !(function transition() {
          var e = Math.ceil(r(a, o, i, s));
          window.scroll(c, e), a < s && (a++, setTimeout(transition, n));
        })();
      }

      function scrollIt(e, t) {
        sp_transition(e, t);
      }

      switch (e.target.id) {
        case 'sp-sp-gotop':
          scrollIt(window.scrollY, 0);
          break;

        case 'sp-sp-gopre':
          var n = getRelativeDiv('pre');
          if (!n) return;
          t = window.scrollY;
          var a = n.getBoundingClientRect().top;
          a = t - (r.getBoundingClientRect().top - a);
          scrollIt(t, a);
          break;

        case 'sp-sp-gonext':
          var o = getRelativeDiv('next');
          if (!o) return;
          t = window.scrollY;
          var i = o.getBoundingClientRect().top;
          i = t + (-r.getBoundingClientRect().top + i);
          scrollIt(t, i);
          break;

        case 'sp-sp-gobottom':
          scrollIt(window.scrollY, Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
      }
    }

    /************************** 自动翻页结束 ********************/

    /*************************** 删除广告 ***********************/
    function removeAD() {
      if (!APConfig.isAdsEnable) {
        return;
      }
      debug('删除广告');
      // 移除网站自有广告
      if (curSite.SiteTypeID === SiteType.BAIDU) {
        // 移除shadowDOM广告；搜索关键字：淘宝；然后点击搜索框，广告会多次重现shadowdom
        safeRemove(function () {
          $('.c-container /deep/ .c-container').has('.f13>span:contains("广告")').remove();
        });
        safeRemove(function () {
          $('#content_right>div').has('a:contains("广告")').remove();
        });
        // 移除标准广告（文章中有广告会有问题）
        // safeRemove(function () {
        //   $('#content_left>div').has('span:contains("广告")').remove();
        // });
        var delete_ad = function () {
          var ad = document.getElementsByTagName('span'); //标签
          var len = ad.length; //检查长度
          while (len !== 0) {
            //从后往前推
            len--; //下标从0不从1开始
            if (ad[len].innerText === '广告') {
              //标签是否满足广告条件
              var use = ad[len]; //以下判定广告范围
              while (use.parentElement.id === '') {
                //没有id
                use = use.parentElement; //父节点
              }
              use.parentElement.innerHTML = ''; //删除节点
            }
          }
        };
        window.setInterval(delete_ad, 1000); //反动态

        // 移除右侧栏顶部-底部无用广告
        safeRemove(function () {
          $('#content_right td>div:not([id]),#content_right>br').remove();
        });
        // 移除顶部可能出现的 "为您推荐"
        safeRemove(function () {
          getAllElements("//div[@id='content_left']//div[contains(@class,'_rs')]").forEach((one) => one.remove());
        });
      } else if (curSite.SiteTypeID === SiteType.SOGOU) {
        safeRemove('#promotion_adv_container');
        safeRemove('#kmap_business_title');
        safeRemove('#kmap_business_ul');
        safeRemove('.sponsored');
        try {
          document.querySelector(".rvr-model[style='width:250px;']").style = 'display:none';
        } catch (e) {}
      } else if (curSite.SiteTypeID === SiteType.SO) {
        safeRemove('#so_kw-ad');
        safeRemove('#m-spread-left');
        safeRemove('#m-spread-bottom');
        safeRemove('.js-multi-i-item');
        safeRemove('.res-mediav');
      } else if (curSite.SiteTypeID === SiteType.GOOGLE) {
        // display已经无法隐藏他们了，需要用绝对的隐藏
        safeRemove('#bottomads');
        // addStyle(
        //   "#bottomads{display:none;} #content_left>div:not([id])>div[cmatchid], #content_left>div[id*='300']:not([class*='result']),#content_right td>div:not([id]),#content_right>br{position:absolute;top:-6666px;}",
        //   'AC-remove-bottomads'
        // );
      } else if (curSite.SiteTypeID === SiteType.WEIBO) {
        safeRemove('.card-film');
      }
    }
    /*************************** 删除广告结束 *******************/

    /************************* 样式优化 ************************/

    function optimizationStyle() {
      debug('开始优化样式');

      if (APConfig.isALineEnable) {
        addStyle('a,a em{text-decoration:none}', 'AC-NoLine'); // 移除这些个下划线
      }

      if (curSite.SiteTypeID === SiteType.BAIDU && !!APConfig.baiduStyle.enable) {
        // 移除百度浏览器推广 // 移除可能的百度HTTPS劫持显示问题
        addStyle('.opr-recommends-merge-imgtext{display:none!important;} .res_top_banner{display:none!important;}', 'AC-special-BAIDU');

        let baidu_style = `body{zoom: ${APConfig.baiduStyle.baiduZoom} !important;} #s_main, .s-top-nav, .s-hotsearch-wrapper, #content_right{display:none;} #content_left{padding-left:0 !important; width:1000px !important; margin:0 auto; float:none;} #rs{padding:0 !important; margin:10px auto !important; width:${APConfig.baiduStyle.width} !important;} #rs table{width:640px !important;} #page .page-inner{padding-left:0 !important; display:block; width:${APConfig.baiduStyle.width} !important; margin:0 auto !important;} #page a{margin-right:20px !important;} .wrapper_new #foot #help{display:block; width:${APConfig.baiduStyle.width}; margin:0 auto !important; float:none !important; padding-left:unset !important;} #content_left a, #rs a, .c-title-text, .c-showurl{color: #3C50B4; text-decoration: none !important; } .b2b-universal-card .official-site{color: #3C50B4 !important;} .se_st_footer a{color:#008000;} .m{color:#666666 !important;} em{color: #FA3232 !important; text-decoration: none !important;} .t a, .c-title-text{font-size: 18px !important;} .jy-course-pc-title .c-title-text{color: #3C50B4 !important;} h3.c-title.c-font-medium.c-color-link.c-line-clamp2 span.c-title-text{font-size:14px !important;} .slowmsg{left:300px !important; top:90px !important; box-shadow:none !important; border:none !important; background:none !important;} a.c-text{color:#ffffff !important; font-size:0.8em !important;} #kw{font-size: 1.5em !important;} .search_tool_conter, .nums{width:${APConfig.baiduStyle.width} !important; margin:0 auto !important;} #rs_top_new, .hit_top_new{width:${APConfig.baiduStyle.width} !important; margin:0 auto !important;} .c-result-content article{width: 100% !important; padding: 0 !important; box-shadow: none;} .c-result-content article:hover{box-shadow:none;} .c-border{box-shadow:none !important; width:880px;} .op-img-portrait-menu .op-img-portrait-text-public{color:#ffffff !important;} #container{box-sizing: border-box; width: 1000px; margin: 0 auto;} .c-border.ec-pl-container {width: ${APConfig.baiduStyle.width}; margin-bottom: 14px !important; padding: 15px; border-radius: 15px; box-shadow: 0 0 4px #eeeeff !important; border: none; display:none;} .op-img-address-link-type{margin-right:10px;} .op-img-address-pbline{margin-top:10px !important;} .c-span18{width:760px !important;} .c-span24{width:890px !important;} #s_tab{padding-left:0 !important;} #s_tab.s_tab .s_tab_inner{display: block; box-sizing: border-box; padding: 0; width: ${APConfig.baiduStyle.width}; margin: 0 auto;} .op-img-address-link-type a{margin-right:10px !important;} .op-img-portrait-item-con{padding:5px;} .c-border .c-span6{margin-bottom:10px;} .c-border .c-span-last{margin-right:10px;} .op-img-portrait-pic-more{text-align:left !important;} .op_exactqa_tag_item{color:#3C50B4 !important;} span.op_exactqa_tag_item.op_exactqa_tag_selected.OP_LOG_BTN{color:#ffffff !important;} .wenda-abstract-wrap{margin-bottom:0 !important; border:none !important;} .hint_common_restop{width:${APConfig.baiduStyle.width} !important; margin:0 auto !important;} .wenda-abstract-img-wrap{display:none;} #content_left .c-group{width:${APConfig.baiduStyle.width} !important; margin-bottom: 15px !important; padding: 10px 15px 15px 15px !important; border: none !important;} .op-short-video-pc-img-group{max-height:none !important;} .result, #content_left .result-op{ width: ${APConfig.baiduStyle.width} !important; word-break: break-all; word-wrap: break-word; box-shadow: 0 0 6px #eeeeff; padding: 10px 15px 15px 15px; margin:0 auto; margin-bottom:15px; border-radius: 10px; transition:box-shadow 0.5s, border-radius 0.5s, margin-bottom 0.6s, padding-bottom 0.6s;} .result:hover, #content_left .result-op:hover{box-shadow:1px 1px 10px #cccccc; border-radius:0;} .sftip_com.sftip_blue{width:${APConfig.baiduStyle.width}; margin:0 auto; margin-bottom:15px; border-radius:10px; border:none; background-color:#ffeeee;} .sftip_com span{text-indent:0 !important;} #header_top_bar, .tab-wrapper, #gotoPage, p#page{width:${APConfig.baiduStyle.width}; margin:0 auto;} #header_top_bar .nums{width:700px !important;} #gotoPage{padding-bottom:0;} p#page{padding:0;} form.fm{font-size:11px;} .op-gk-topic-header-imgc, .op-gk-topic-banners{display:none !important;} div[class$="op_rs"]{width:${APConfig.baiduStyle.width} !important; margin:0 auto; margin-bottom:15px;} div[class$="op_rs_left"]{width:auto;} table.result-op{display: block; padding: 15px !important; margin-bottom: 15px !important;} #op_wiseapp{box-shadow:none !important;} a.c-tip-icon{display:none;} .c-border .c-span18{width:735px !important;} #container.sam_newgrid{margin:0 auto !important;} .new-pmd .c-span9{width:756px;} .new-pmd .c-span12{width:unset;}`;
        addStyle(baidu_style, 'baidu-optimization-style');
      }

      if (curSite.SiteTypeID === SiteType.GOOGLE && !!APConfig.googleStyle.enable) {
        let googleStyle = `div.res_top_banner,#page .fk,#head .headBlock,#rs_top_new,#content_right,#rso>table,#rso>div[id*="30"],#rso .c-recommend,#rso .leftBlock,#rso .hit_top_new,#rso #fld,#rso div.rrecom-btn-parent,#content_right,#center_col>#taw,#fld,#demo{display:none!important}body[google]{background-color:#fdfdfd}#cnt #hdtbSum,#cnt>#appbar{background:transparent}#form .bdsug{width:76%}#ala_img_results{overflow:hidden}a,a em,#u a{text-decoration:none}a:hover,a:hover h3{text-decoration:none!important}#head,#s_tab{background-color:#f8f8f8}#head{border-bottom:none}#form{background-color:unset}#form .bdsug li{width:auto;color:#000;font:15px arial;line-height:26px}#form .s_ipt_wr.bg{background:#fff;width:76%}#form .s_btn{background:#3476d2;border-bottom:1px solid #3476d2}#form .s_btn:hover{background:#3476d2;border-bottom:1px solid #3476d2}#s_tab b{color:#3476d2;border-bottom:3px #3476d2 solid}#s_tab{border-bottom:#e0e0e0 1px solid}#container .head_nums_cont_outer .search_tool_conter,#container .head_nums_cont_outer .nums{width:630px}#search #rso{animation-name:ani_bottomTotop;animation-duration:.3s;animation-timing-function:ease}.srp form{animation-name:ani_leftToright;animation-duration:.3s;animation-timing-function:ease-out}#rso .jUmkFb:hover{margin:0 auto;border-left:unset;padding:0 20px 15px;margin-bottom:40px}#rs,#rso>.g{width:${APConfig.googleStyle.width};padding:0 20px 15px;margin-top:0;margin-bottom:40px;border-radius:5px;background-color:#fff;box-sizing:border-box;box-shadow: 0 0 6px #eeeeff; transition: box-shadow 0.5s, border-radius 0.5s, margin-bottom 0.6s, padding-bottom 0.6s;}#rso>.g:hover{box-shadow: 1px 1px 10px #cccccc;border-radius: 0;}#rs,#rso .g div.rc{padding-top:5px;}#rs,#rso .g div.rc .s{max-width:unset}#rso .f13 a,#rso .f13 em,#rso .c-span18 a,#rso .subLink_factory a,#rso .c-tabs-content a,#rso .op_offical_weibo_content a,#rso .op_offical_weibo_pz a,#rso .op_tieba2_tablinks_container a,#rso .op-tieba-general-right,#rso .op_dq01_title,#rso .op_dq01_table a,#rso .op_dq01_morelink a,#rso .op-tieba-general-mainpl a,#rso .op-se-listen-recommend,#rso .c-offset>div a{text-decoration:none;color:#3476d2}#rso .f13 a:hover,#rso .f13 em:hover,#rso .subLink_factory a:hover,#rso .c-tabs-content a:hover,#rso .op_tieba2_tablinks_container a:hover,#rso .op-tieba-general-right:hover,#rso .op_dq01_title:hover,#rso .op_dq01_table a:hover,#rso .op_dq01_morelink a:hover,#rso .op-tieba-general-mainpl a:hover,#rso .op-se-listen-recommend:hover,#rso .c-offset>div a:hover{text-decoration:underline!important}#rso .f13 a{color:green}#rso .c-span18,#rso .c-span24{width:100%;min-width:unset}#rso .c-border{width:auto;border:none;border-bottom-color:transparent;border-right-color:transparent;box-shadow:0 0 0 transparent;-webkit-box-shadow:0 0 0 transparent;-moz-box-shadow:0 0 0 transparent;-o-box-shadow:0 0 0 transparent}#rso .se_com_irregular_gallery ul li,#rso .op_jingyan_list,#rso .g .op-img-address-link-type{display:inline-block;margin-left:10px}#rso .g[tpl=soft] .op-soft-title a,#rso .g[tpl=soft] .op-soft-title a em,#rso .g div.r>a,#rso .g a h3,#rso .g div.r>a em,.mw #res h3,.mw #extrares h3{color:#3476d2;font-weight:700}#rso .op-soft-title a:visited,#rso .op-soft-title a:visited em,#rso .g div.r>a:visited,#rso .g div.r>a:visited em,#rso .g a:visited h3{color:#609}#rso .op-soft-title a,#rso .g div.r>a{position:relative}#rso .op-soft-title a em,#rso .g div.r>a em{text-decoration:none}#rso .op-soft-title a:hover:after,#rso .g div.r>a:hover:after{left:0;width:100%;-webkit-transition:width 350ms;-moz-transition:width 350ms;transition:width 350ms}#rso .op-soft-title a,#rso .g div.r>a{position:relative}#rs{margin-top:0;padding:0 20px 15px;border-radius:5px}#rs .tt{margin:0 -20px 5px;padding:5px 20px;background-color:#f8f8f8;border-radius:5px 5px 0 0}#rs table{width:630px;padding:5px 15px}#rs table tr a{margin-top:5px;margin-bottom:5px;color:#3476d2}#rs table tr a:hover{text-decoration:underline}#page{min-width:710px;height:40px;line-height:40px;padding-top:5px;margin:0 0 50px 80px}.op-img-address-desktop-cont{overflow:hidden}#page a,#page strong{color:#3476d2;height:auto;box-shadow:0 0 20px 2px rgba(0,0,0,.1);-webkit-box-shadow:0 0 20px 2px rgba(0,0,0,.1);-moz-box-shadow:0 0 20px 2px rgba(0,0,0,.1)}#page .n:hover,#page a:hover .pc{border:1px solid transparent;background:#d8d8d8;color:#0057da}#page strong .pc{background:#3476d2;color:#fff}@keyframes ani_bottomTotop{0%{transform:translateY(32px);opacity:0}20%{opacity:0}30%{opacity:.8}100%{opacity:1}}@keyframes ani_leftToright{0%{transform:translateX(-32px);opacity:0}20%{opacity:0}30%{opacity:.8}100%{opacity:1}}#rso>div:not([class]){margin-left:18px;margin-right:18px}#rso .g .exp-outline{display:none}#main .mw #rhs{margin-left:1020px}#res .g .ts{max-width:unset}@media screen and (max-width:1400px){.mw #rhs{display:none}}cite{font-weight:400;white-space:nowrap}div.res_top_banner #foot,#pag #res .r{line-height:1.3}#res{padding:0}#rs,#rso .g{margin-bottom:20px;border-radius:10px}#rso .g div.r{border-radius:10px 10px 0 0}#rso .g .card-section,#center_col .kp-blk{width:100%!important}.c2xzTb .g,.ruTcId .g,.fm06If .g,.cUnQKe .g,.HanQmf .g{width:758px;padding-left:20px!important;padding-right:20px!important;box-shadow:0 0 0 0 #000}div .xfxx5d{margin-bottom:-18px!important;margin-top:-25px!important}div .xaqJzf.xfxx5d .kno-ftr{margin-top:10px!important}div .kno-ftr a{position:sticky}.mw #res h3,.mw #extrares h3{font-size:18px}#rso>.g .r>a>div{width:35rem}div.rc[ac-needhide]{margin-top:5px;margin-bottom:-15px}.logo{top:unset}body[google] .big .baidu{transform:unset!important;margin-top:-10px;margin-left:-2rem}body[google] .big .baidu #logo img{margin-top:-15px}body[google] .big.minidiv .baidu #logo img{height:59px;width:unset;margin-top:-18px}.AC.sp-separator{margin-top:-20px}.eFM0qc{margin-top:11px}`;
        addStyle(googleStyle, 'google-optimization-style');
      }

      if (curSite.SiteTypeID === SiteType.SO && !!APConfig.haosouStyle.enable) {
        let haosouStyle = `#main,#news {  float: none !important;  width: ${APConfig.haosouStyle.width} !important;  margin: 0 auto !important;  padding: 20px 0 0 0 !important;}#container {  padding-left: 0 !important;}.result {  margin: 0 auto !important;}#side,.feedback,.searchGuide,#m-spread-left,#mohe-qihuwenda,#search,#g-hd-quser,#tipbar,.info-stream {  display: none !important;}.g-mohe,.warning_custom {  width: 100% !important;}#page,.warning_main {  margin: 0 auto !important;  width: 90% !important;}.warning_custom {  background: #fff;  margin: 0 0 20px 0 !important;}.warning_custom > .warning_main {  border: none !important;  width: auto !important;}#rs {  background: #fff !important;  padding: 8px 0 !important;  margin: 20px auto 20px auto !important;  width: 90%;}#rs a,.res-title a,.title a {  text-shadow: 0 0 20px #ccc;}.res-title a,.title a,.warning_custom > .warning_main > dt {  font-size: 18px !important;}.res-desc,.res-rich > div,.res-rich > em,.warning_custom > .warning_main > dd {  font-size: 16px !important;}.res-linkinfo {  padding: 10px 0 0 0 !important;}.res-title {  padding: 0 0 10px 0 !important;}.so-pdr {  margin: 0 0 20px 0 !important;}.res-list {  padding: 8px !important;  margin-bottom: 14px !important;  -webkit-border-radius: 8px;  -moz-border-radius: 8px;  border-radius: 8px;  background-color: #fff;  box-sizing: border-box;  box-shadow: 0 0 6px #eeeeff;  transition: box-shadow 0.5s, border-radius 0.5s, margin-bottom 0.6s, padding-bottom 0.6s;}.res-list:hover {  box-shadow: 1px 1px 10px #cccccc;  border-radius: 0;} .res-list .clearfix {display: flex; flex-direction: row-reverse;} .res-list .clearfix .res-comm-con{width: auto; margin: 0 10px;} .res-desc,.mh-first-cont,.warning_custom > .warning_main > dd {  line-height: 1.6em !important;}#rs a:hover,.res-title a:hover,.title a:hover {  color: #333 !important;}`;
        addStyle(haosouStyle, 'so-optimization-style');
      }

      if (curSite.SiteTypeID === SiteType.SOGOU && !!APConfig.sogouStyle.enable) {
        let sogouStyle =
          (!APConfig.sogouStyle.showImg ? '.img-box{display: none;}' : '') +
          `#right { display: none;}#main { width: ${APConfig.sogouStyle.width}; max-width: ${APConfig.sogouStyle.width};}.results {  width: 100%;}.vrwrap,.rb {  padding: 10px;  margin-bottom: 18px;  min-height: 20px;  width: 100% !important;  background-color: #fff;  box-sizing: border-box;  box-shadow: 0 0 6px #eeeeff;  transition: box-shadow 0.5s, border-radius 0.5s, margin-bottom 0.6s, padding-bottom 0.6s;}.vrwrap:hover,.rb:hover {  box-shadow: 1px 1px 10px #cccccc;  border-radius: 0;} .txt-info{height: auto !important;}`;
        addStyle(sogouStyle, 'sougou-optimization-style');
      }

      if (curSite.SiteTypeID === SiteType.WEIBO && !!APConfig.weiboStyle.enable) {
        let weiboStyle = `.m-con-l{width: ${APConfig.weiboStyle.width} !important;} .m-con-r{display: none;}`;
        addStyle(weiboStyle, 'weibo-optimization-style');
      }
      if (curSite.SiteTypeID === SiteType.EASTMONEY && !!APConfig.eastmoneyStyle.enable) {
        let eastmoneyStyle = `.corr-right{ display:none;}.modules { width: ${APConfig.eastmoneyStyle.width};}.news-item, .list-item { padding:10px;margin-bottom:15px;border-radius:5px;background-color:#fff;box-sizing:border-box;box-shadow: 0 0 6px #eeeeff; transition: box-shadow 0.5s, border-radius 0.5s, margin-bottom 0.6s, padding-bottom 0.6s;}.footer2016 { display:none;}.page-group{margin: 0;}.newsts{bottom: 25px !important;}`;
        addStyle(eastmoneyStyle, 'eastmoney-optimization-style');
      }
    }

    /************************** 样式优化结束 ************************/

    /************************* 重定向处理，非不要不开启，会造成卡顿************************/
    function ACHandle() {
      // 处理主重定向
      if (!APConfig.isRedirectEnable || curSite.SiteTypeID === SiteType.OTHERS) {
        return;
      }

      if (curSite.Stype_Normal !== null && curSite.Stype_Normal !== '') {
        // 百度搜狗去重定向-普通模式【注意不能为document.query..】
        resetURLNormal(document.querySelectorAll(curSite.Stype_Normal));
        if (checkISBaiduMain()) {
          document.querySelectorAll(".s_form .index-logo-src[src*='gif'], .s_form .index-logo-srcnew[src*='gif']").forEach(function (per) {
            per.src = 'https://pic.rmb.bdstatic.com/c86255e8028696139d3e3e4bb44c047b.png';
          });
        }
      }
      if (curSite.SiteTypeID === SiteType.GOOGLE) {
        removeOnMouseDownFunc(); // 移除onMouseDown事件，谷歌去重定向
      }
      safeRemove('.res_top_banner'); // 移除百度可能显示的劫持
    }

    function checkISBaiduMain() {
      // 首页=true;非首页=false
      // 如果是百度 &&  没有(百度搜索结果的标志-[存在]百度的内容) return;
      return !(
        curSite.SiteTypeID === SiteType.BAIDU &&
        !(
          location.href.replace(/(&|\?)(wd|word)=/, '') !== location.href ||
          document.querySelector('#content_left') ||
          ((document.querySelector('#kw') && document.querySelector('#kw').getAttribute('value')) || '') !== ''
        )
      );
    }

    function resetURLNormal(list) {
      // 注意有重复的地址，尽量对重复地址进行去重
      var hasDealHrefSet = new Set();
      for (var i = 0; i < list.length; i++) {
        // 此方法是异步，故在结束的时候使用i会出问题-严重!
        // 采用闭包的方法来进行数据的传递
        let curNode = list[i];
        let curhref = curNode.href;
        if (list[i] !== null && list[i].getAttribute('ac_redirectStatus') == null) {
          list[i].setAttribute('ac_redirectStatus', '0');
          let len1 = hasDealHrefSet.size;
          hasDealHrefSet.add(curhref);
          let len2 = hasDealHrefSet.size;
          if (len1 === len2) continue; // 说明数据已经处理过，存在相同的记录
          if (
            curhref.includes('www.baidu.com/link') ||
            curhref.includes('m.baidu.com/from') ||
            curhref.includes('www.sogou.com/link') ||
            curhref.includes('so.com/link')
          ) {
            (function (c_curnode, c_curhref) {
              let url = c_curhref.replace(/^http:/, 'https:');
              if (curSite.SiteTypeID === SiteType.BAIDU && !url.includes('eqid')) {
                // 如果是百度，并且没有带有解析参数，那么手动带上
                url = url + '&wd=&eqid=';
              }
              let gmRequestNode = GM_xmlhttpRequest({
                // from: "acxhr",
                extData: c_curhref, // 用于扩展
                url: url,
                headers: { Accept: '*/*', Referer: c_curhref.replace(/^http:/, 'https:') },
                method: 'GET',
                timeout: 8000,
                onreadystatechange: function (response) {
                  // MARK 有时候这个函数根本不进来 - 调试的问题 - timeout
                  // 由于是特殊返回-并且好搜-搜狗-百度都是这个格式，故提出
                  DealRedirect(gmRequestNode, c_curhref, response.responseText, "URL='([^']+)'");
                  // 这个是在上面无法处理的情况下，备用的 tm-finalurldhdg  tm-finalurlmfdh
                  if (response.responseHeaders.includes('tm-finalurl')) {
                    let relURL = Reg_Get(response.responseHeaders, 'tm-finalurl\\w+: ([^\\s]+)');
                    if (relURL == null || relURL === '' || relURL.includes('www.baidu.com/search/error')) return;
                    DealRedirect(gmRequestNode, c_curhref, relURL);
                  }
                },
              });
            })(curNode, curhref); //传递旧的网址过去，读作c_curhref
          }
        }
      }
      if (hasDealHrefSet.size > 0 && list.length - hasDealHrefSet.size > 0) {
        console.log('丢弃掉', list.length - hasDealHrefSet.size, '个重复链接');
      }
    }

    var DealRedirect = function (request, curNodeHref, respText, RegText) {
      if (respText == null || typeof respText == 'undefined') return;
      let resultResponseUrl = '';
      if (RegText != null) {
        resultResponseUrl = Reg_Get(respText, RegText);
      } else {
        resultResponseUrl = respText;
      }
      if (resultResponseUrl !== null && resultResponseUrl !== '' && !resultResponseUrl.includes('www.baidu.com/link')) {
        try {
          if (curSite.SiteTypeID === SiteType.SOGOU) curNodeHref = curNodeHref.replace(/^https:\/\/www.sogou.com/, '');
          let host = getTextHost(resultResponseUrl);
          // RedirectMap.set(curNodeHref, resultResponseUrl); // 进行一个数据关联
          // RedirectMap.set(resultResponseUrl, curNodeHref); // 进行一个数据关联

          document.querySelectorAll("*[href*='" + curNodeHref + "']").forEach(function (per) {
            if (per.querySelector('span') != null) {
              per.lastChild.insertAdjacentHTML('beforeEnd', '&nbsp;-&nbsp;' + host);
            }
            per.setAttribute('ac_redirectStatus', '2');
            per.setAttribute('href', resultResponseUrl);
            // per.setAttribute("data-orihref", per.href);
            if (per.hasAttribute('meta')) {
              per.setAttribute('meta', host);
              per.dataset.host = host;
            }
          });
          request.abort();
        } catch (e) {
          // console.log(e);
        }
      }
    };

    function getTextHost(sbefore) {
      let HostReg = new RegExp(/(https?:\/\/)?([^/\s]+)/i);

      sbefore = (sbefore && sbefore.trim()).replace(/\s-\s\d{4}-\d{1,2}-\d{1,2}/, '') || '';
      let send;
      let result = sbefore.split('-');
      // --搜狗百度专用；如果第一个是中文的话，地址就是第二个
      if (
        result.length > 1 &&
        new RegExp('[\\u4E00-\\u9FFF]+', 'g').test(sbefore) &&
        (curSite.SiteTypeID === SiteType.BAIDU || curSite.SiteTypeID === SiteType.SOGOU)
      ) {
        sbefore = result[1];
      }
      // 此时sbefore几乎是等于网址了，但是有时候会有多的空格，多的内容，多的前缀http，多余的路径
      let res = HostReg.exec(sbefore);
      send = (res && res[2].trim()) || '';
      // send = sbefore.replace(/(\/[^/]*|\s*)/, "").replace(/<[^>]*>/g, "").replace(/https?:\/\//g, "").replace(/<\/?strong>/g, "").replace(/<\/?b>/g, "").replace(/<?>?/g, "").replace(/( |\/).*/g, "").replace(/\.\..*/, "");
      if (send === '') return null;
      if (send.indexOf('.') < 0) return null;
      if (send.indexOf('↵') >= 0) return null;
      return send.trim();
    }

    function removeOnMouseDownFunc() {
      try {
        let resultNodes = document.querySelectorAll('.g .rc .r a');
        for (let i = 0; i < resultNodes.length; i++) {
          let one = resultNodes[i];
          one.setAttribute('onmousedown', ''); // 谷歌去重定向干扰
          one.setAttribute('target', '_blank'); // 谷歌链接新标签打开
        }
      } catch (e) {
        console.log(e);
      }
    }

    /************************* 重定向处理结束 ************************/

    /*************************** 聚合搜索 *****************************/

    // 添加 聚合 节点
    function addSerachBox() {
      if (!APConfig.showSerachBox) {
        return;
      }
      // 主元素
      var div = document.createElement('div');
      div.id = 'ahl-search-app-box';
      div.style =
        'position: fixed; z-index: 999999; top: 60px; width: 80px; font-size: 13px; list-style-type: none; background-color: #fff;background-clip: padding-box;border-radius: 2px;outline: none; box-shadow: 0 3px 6px -4px rgba(0,0,0,.12),0 6px 16px 0 rgba(0,0,0,.08),0 9px 28px 8px rgba(0,0,0,.05); -webkit-transform: translateZ(0);';
      bindDrag(div);
      document.body.insertAdjacentElement('afterBegin', div);

      // 标题
      // let title = document.createElement('span');
      // title.innerText = '常用搜索';
      // title.style = 'display: block; text-align: center; margin-top: 10px; font-size: 14px;';
      // div.appendChild(title);

      // 搜索列表
      for (let index in urlMapping) {
        let item = urlMapping[index];

        // 样式
        let defaultStyle = 'display: block; padding: 10px 0 10px 10px; text-decoration: none; cursor: pointer; color: #333;';
        let hoverStyle = defaultStyle + 'background-color: #f5f5f5;';

        let a = document.createElement('a');
        a.href = 'javascript:;';
        a.innerText = item.name;
        a.style = defaultStyle;
        a.id = index;

        // 鼠标移入移除效果，相当于hover
        a.onmouseenter = function () {
          this.style = hoverStyle;
        };
        a.onmouseleave = function () {
          this.style = defaultStyle;
        };
        a.onclick = function () {
          window.location.href = item.searchUrl + getSearchValue();
        };

        div.appendChild(a);
      }
    }

    /*******************************聚合搜索结束*******************************/

    /***************************** 搜狗微信特殊处理 ************************/

    function handleSogouWeixin() {
      if (curSite.SiteTypeID === SiteType.SOGOU && curSite.weixin) {
        // 主元素
        var div = document.createElement('div');
        div.id = 'ahl-weixin-time-box';
        div.style =
          'position: fixed; z-index: 999999; top: 0; right: 15%; padding: 5px; font-size: 13px; text-align: center; list-style-type: none; background-color: #fff;background-clip: padding-box;border-radius: 2px;outline: none; box-shadow: 0 3px 6px -4px rgba(0,0,0,.12),0 6px 16px 0 rgba(0,0,0,.08),0 9px 28px 8px rgba(0,0,0,.05); -webkit-transform: translateZ(0);';
        bindDrag(div);
        document.body.insertAdjacentElement('afterBegin', div);

        // let span = document.createElement('span');
        // span.innerText = '时间限制(天): ';
        // div.appendChild(span);

        let input = document.createElement('input');
        input.id = '';
        input.type = 'number';
        input.className = 'input';
        input.value = timeLimit;
        input.placeholder = '时间限制(天)';
        input.style =
          'height: 26px; width: 100px; font-size: 13px; list-style-type: none; background-color: #fff;background-clip: padding-box;border-radius: 2px;outline: none; border: 1px solid #eee;';
        input.addEventListener('keydown', function (event) {
          if (event.key === 'Enter') {
            event.preventDefault();
            timeLimit = this.value;
            localStorage.setItem('weixin-time-limit', timeLimit);
            window.location.reload();
          }
        });
        div.appendChild(input);

        let a = document.createElement('a');
        a.href = 'javascript:;';
        a.innerText = '时间排序';
        a.style = 'padding: 4px 8px;text-decoration: none; cursor: pointer; color: #333;';
        a.onclick = function () {
          sortWeinxinList();
        };

        div.appendChild(a);

        filterWeixinList();
      }
    }

    function sortWeinxinList() {
      let ux = [];

      let timeEls = getAllElements('//div[@class="news-box"]//div[@class="txt-box"]//div[@class="s-p"]');
      for (const el of timeEls) {
        let tmp = {};
        let time = parseInt(el.getAttribute('t'), 10);
        tmp.time = time;
        tmp.el = el.parentElement.parentElement;
        ux.push(tmp);
      }

      ux.sort(function (a, b) {
        return b.time - a.time;
      });
      let ulEl = getAllElements('//div[@class="news-box"]/ul')[0];
      ulEl.innerHTML = '';
      //重新填写排序好的内容
      for (var i = 0; i < ux.length; i++) {
        ulEl.appendChild(ux[i].el);
      }
    }

    function filterWeixinList(newBody) {
      if (curSite.SiteTypeID === SiteType.SOGOU && curSite.weixin && timeLimit !== '' && timeLimit > 0) {
        let timeEls = getAllElements('//div[@class="news-box"]//div[@class="txt-box"]//div[@class="s-p"]', newBody, newBody);
        for (const el of timeEls) {
          let time = parseInt(el.getAttribute('t'), 10);

          let today = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
          let limit = (today - 1000 * 60 * 60 * 24 * timeLimit) / 1000;

          if (time < limit) {
            // el.parentElement.parentElement.style = 'display: none';
            el.parentElement.parentElement.style = APConfig.sogouStyle.timeLimitStyle;
          }
        }
      }
    }

    function getWeixinTime(newBody) {
      let timeEls = getAllElements('//div[@class="news-box"]//div[@class="txt-box"]//div[@class="s-p"]', newBody, newBody);
      for (const el of timeEls) {
        let time = el.getAttribute('t');
        let timeStr = timeConvert(time);
        el.getElementsByTagName('span')[0].innerHTML = timeStr;
      }
    }

    /*********************************** 搜狗微信特殊处理 *********************************/

    /******************************** word 文件处理 **************************/
    function getWordLinkHight() {
      if (!APConfig.word.enable) {
        return;
      }

      // 主元素
      let div = document.createElement('div');
      div.id = 'ahl-word-title-input';
      div.style =
        'position: fixed; z-index: 999999; top: 60px; right: 0px;padding: 5px; font-size: 13px; text-align: center; list-style-type: none; background-color: #fff;background-clip: padding-box;border-radius: 2px;outline: none; box-shadow: 0 3px 6px -4px rgba(0,0,0,.12),0 6px 16px 0 rgba(0,0,0,.08),0 9px 28px 8px rgba(0,0,0,.05); -webkit-transform: translateZ(0);';
      bindDrag(div);
      document.body.insertAdjacentElement('afterBegin', div);

      let a = document.createElement('a');
      a.href = 'javascript:;';
      a.style =
        ' position: relative; max-width: 120px; display: inline-block;background: #D0EEFF;border: 1px solid #99D3F5;border-radius: 4px; padding: 4px 12px;overflow: hidden;color: #1E88C7;text-decoration: none;text-indent: 0;line-height: 20px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;';

      div.appendChild(a);

      let span = document.createElement('span');
      span.id = 'word-title-input-lable';
      span.innerText = '选取文件';
      GM.getValue('word-input-text').then(function (data) {
        if (data) {
          span.innerText = data;
        }
      });
      a.appendChild(span);

      let input = document.createElement('input');
      input.id = 'ahl-word-input';
      input.type = 'file';
      input.style = ' position: absolute; font-size: 100px; right: 0; top: 0; opacity: 0;';
      input.onchange = function (event) {
        let files = this.files || [];
        if (!files.length) return;
        let file = files[0];
        let reader = new FileReader();
        reader.onloadend = function (event) {
          var arrayBuffer = reader.result;
          mammoth.convertToHtml({ arrayBuffer: arrayBuffer }).then(function (resultObject) {
            getArticleTitle(resultObject.value);
          });
        };
        reader.readAsArrayBuffer(file);

        let pathArr = input.value.split('\\'); //以反斜杠'\'截取文件名为数组
        if (pathArr.length > 0) {
          span.innerText = pathArr[pathArr.length - 1];
          gmRecord('word-input-text', span.innerText);
        }
      };
      a.appendChild(input);

      let a1 = document.createElement('a');
      a1.href = 'javascript:;';
      a1.title = '删除';
      a1.innerText = '×';
      a1.style =
        ' position: relative; display: inline-block; font-size: 22px; padding: 4px 12px;overflow: hidden;color: #1E88C7;text-decoration: none;text-indent: 0;line-height: 20px;';
      a1.onclick = function () {
        span.innerText = '选取文件';
        restWordTitle();
        gmRecord('word-input-text', span.innerText);
        gmRecord('word-title-list', JSON.stringify(wordTitle));
      };
      div.appendChild(a1);

      GM.getValue('word-title-list').then(function (data) {
        try {
          wordTitle = JSON.parse(data);
          showWordTitles();
        } catch (e) {
          wordTitle = {
            weixin: [],
            weibo: [],
            news: [],
          };
        }
      });
    }

    function restWordTitle() {
      for (const key in wordTitle) {
        if (wordTitle.hasOwnProperty(key)) {
          wordTitle[key] = [];
        }
      }
      let listEl = document.getElementById(wordListElId);
      if (listEl) {
        listEl.remove();
      }
    }
    // 获取文章标题
    function getArticleTitle(html) {
      // 清空之前的
      restWordTitle();

      let articles = html.split(/<strong>[一|二|三|四|五|六|七|八|九]/);
      for (const article of articles) {
        if (article.indexOf('微信监测</strong>') != -1) {
          pushTitle(article, wordTitle.weixin);
        } else if (article.indexOf('微博监测</strong>') != -1) {
          pushTitle(article, wordTitle.weibo, true);
        } else {
          pushTitle(article, wordTitle.news);
        }
      }
      gmRecord('word-title-list', JSON.stringify(wordTitle));
      showWordTitles();
      handSimilar();
    }

    function pushTitle(str, arr, weibo = false) {
      const titles = [];
      if (weibo) {
        const weiReg = /<p>@.*?：(.*?)<\/p>/g;
        while (weiReg.exec(str) != null) {
          const result = RegExp.$1;
          // 删除URL和空字符
          if (result == '') {
            continue;
          }
          titles.push(result);
        }
      } else {
        // 超链
        const linkReg = /<a[^>]*href=['"]([^"]*)['"][^>]*>(.*?)<\/a>/g;

        while (linkReg.exec(str) != null) {
          const result = RegExp.$2;
          // 删除URL和空字符
          if (/^https?:\/\/.+/.test(result) || result == '') {
            continue;
          }
          titles.push(result);
        }
        if (titles.length == 0) {
          // 标题
          const titleReg = /<p>标题：(.*?)<\/p>/g;
          while (titleReg.exec(str) != null) {
            if (RegExp.$1 == '') {
              continue;
            }
            titles.push(RegExp.$1);
          }
        }
      }

      arr.push(...titles);
    }

    function handSimilar(newBody) {
      let titles = getWordTitles();
      if (titles.length == 0) {
        return;
      }
      let titleElems = getAllElements(curSite.titleElement, newBody, newBody);

      for (const el of titleElems) {
        let title = el.innerText;
        let matches = stringSimilarity.findBestMatch(title, titles);
        if (matches.bestMatch.rating > APConfig.word.similarRate) {
          el.style = APConfig.word.similarStyle;

          let a = document.createElement('a');
          let id = 'similar-title-index-' + matches.bestMatchIndex;
          a.href = '#' + id;
          a.title = '相似文章:' + matches.bestMatch.target;
          a.innerText = '相似度：' + Math.round(matches.bestMatch.rating * 100) / 100;
          a.style = 'color:' + APConfig.word.similarTitleColor + ';padding: 0px 12px;overflow: hidden;text-decoration: none;';
          a.onclick = function () {
            let preEl = document.getElementById(activeTitleId);
            if (preEl) {
              preEl.style.color = '#333';
            }
            activeTitleId = id;
            let currentEl = document.getElementById(activeTitleId);
            if (currentEl) {
              currentEl.style.color = APConfig.word.similarTitleColor;
            }
          };
          el.appendChild(a);
        }
      }
    }

    function getWordTitles() {
      let titles = [];
      if (curSite.SiteTypeID === SiteType.BAIDU || curSite.SiteTypeID === SiteType.SO || curSite.SiteTypeID === SiteType.GOOGLE) {
        if (wordTitle.news.length == 0) {
          return titles;
        }
        titles = wordTitle.news;
      }

      if (curSite.SiteTypeID === SiteType.SOGOU) {
        if (curSite.weixin) {
          if (wordTitle.weixin.length == 0) {
            return titles;
          }
          titles = wordTitle.weixin;
        } else {
          if (wordTitle.news.length == 0) {
            return titles;
          }
          titles = wordTitle.news;
        }
      }
      if (curSite.SiteTypeID === SiteType.WEIBO) {
        if (wordTitle.weibo.length == 0) {
          return titles;
        }
        titles = wordTitle.weibo;
      }
      if (curSite.SiteTypeID === SiteType.EASTMONEY) {
        if (wordTitle.news.length == 0) {
          return titles;
        }
        titles = wordTitle.news;
      }

      return titles;
    }

    function showWordTitles() {
      let titles = getWordTitles();
      if (titles.length == 0) {
        return;
      }

      // 主元素
      let div = document.createElement('div');
      div.id = wordListElId;
      div.style =
        'position: fixed; z-index: 999999; top: 104px; right: 0px; bottom: 0px; overflow:hidden; padding: 5px; font-size: 13px; text-align: center; list-style-type: none; background-color: #fff;background-clip: padding-box;border-radius: 2px;outline: none; box-shadow: 0 3px 6px -4px rgba(0,0,0,.12),0 6px 16px 0 rgba(0,0,0,.08),0 9px 28px 8px rgba(0,0,0,.05); -webkit-transform: translateZ(0);';
      bindDrag(div);
      document.body.insertAdjacentElement('afterBegin', div);

      // 主元素
      let lineDiv = document.createElement('div');
      lineDiv.id = 'show-word-title-line';

      lineDiv.style = 'width: 2px;height: 100%; background-color: transparent;position: absolute; left: 0px;cursor: col-resize';
      div.appendChild(lineDiv);

      let ul = document.createElement('ul');
      ul.style = 'width: 180px; text-align: left;height: 100%; overflow: auto;';

      GM.getValue('word-title-list-width').then(function (data) {
        if (data) {
          ul.style.width = data;
        }
      });

      div.appendChild(ul);
      for (let i = 0; i < titles.length; i++) {
        //添加 li
        let li = document.createElement('li');
        li.id = 'similar-title-index-' + i;
        li.innerText = titles[i];
        li.style = 'border-bottom: solid 1px #efefef; padding: 4px; color: #333;';
        ul.appendChild(li);
      }

      lineDiv.onmousedown = function (ev) {
        var iEvent = ev || event;
        var dx = iEvent.clientX; //当你第一次单击的时候，存储x轴的坐标。
        var dw = ul.offsetWidth; //存储默认的div的宽度。

        document.onmousemove = function (ev) {
          var iEvent = ev || event;
          ul.style.width = dw - (iEvent.clientX - dx) + 'px'; //iEvent.clientX-dx表示第二次鼠标的X坐标减去第一次鼠标的X坐标，得到绿色移动的距离（为负数），再加上原本的div宽度，就得到新的宽度。

          if (ul.offsetWidth <= 10) {
            ul.style.width = '10px';
          }
          gmRecord('word-title-list-width', ul.style.width);
        };
        document.onmouseup = function (ev) {
          ev.stopPropagation();
          document.onmousemove = null;
          document.onmouseup = null;
        };
        return false;
      };
    }

    function gmRecord(key, value) {
      if (APConfig.word.record) {
        GM.setValue(key, value);
      }
    }

    /**************************** 工具 ******************/

    /**
     * @param callback 回调函数，需要返回是否结束True、False、否则相当于定时器
     * callback return:
     *  true = 倒计时
     *  false = 计时器
     *  none = 计时器
     * @param period 周期，如:200ms
     * @param runNow 立即执行
     */
    function RAFInterval(callback, period, runNow) {
      // 一秒60次，对应1秒1000ms
      const needCount = (period / 1000) * 60;
      let times = 0; // 已经计数的数量

      if (runNow === true) {
        // 对于立即执行函数的立即判定，否则进行
        const shouldFinish = callback();
        if (shouldFinish) return;
      }

      function step() {
        if (times < needCount) {
          // 计数未结束-继续计数
          times++;
          requestAnimationFrame(step);
        } else {
          // 计数结束-停止计数，判定结果
          const shouldFinish = callback() || false;
          if (!shouldFinish) {
            // 返回值为false，重启计数器
            times = 0;
            requestAnimationFrame(step);
          } else {
            // 返回值为true，结束计数器
            return;
          }
        }
      }
      requestAnimationFrame(step);
    }

    // 删除元素
    function safeRemove(cssSelector_OR_NEWfunction) {
      if (typeof cssSelector_OR_NEWfunction == 'string') {
        try {
          let removeNodes = document.querySelectorAll(cssSelector_OR_NEWfunction);
          for (let i = 0; i < removeNodes.length; i++) removeNodes[i].remove();
        } catch (e) {}
      } else if (typeof cssSelector_OR_NEWfunction == 'function') {
        try {
          cssSelector_OR_NEWfunction();
        } catch (e) {}
      } else {
        console.log('未知命令：' + cssSelector_OR_NEWfunction);
      }
    }

    /**获取搜索的值**/
    function getSearchValue() {
      let kvl = location.search.substr(1).split('&');
      let searchV = '';
      for (let i = 0; i < kvl.length; i++) {
        let value = kvl[i].replace(/^(wd|word|query|q|keyword)=/, '');
        if (value !== kvl[i]) {
          searchV = value;
        }
      }
      //  '+' 百度、搜狗、必应、谷歌、好搜
      searchV = searchV.replace('+', ' ');
      return searchV;
    }

    // 提取url元素的参数值
    function getUrlAttribute(url, attribute, needDecode) {
      let searchValueS = (url.substr(1) + '').split('&');
      for (let i = 0; i < searchValueS.length; i++) {
        let key_value = searchValueS[i].split('=');
        let reg = new RegExp('^' + attribute + '$');
        if (reg.test(key_value[0])) {
          let searchWords = key_value[1];
          return needDecode ? decodeURIComponent(searchWords) : searchWords;
        }
      }
    }

    //设置 cookie
    function setCookie(cname, cvalue, domain, exdays) {
      exdays = exdays || 30;
      let d = new Date();
      domain = (domain ? 'domain=' + domain : '') + ';';
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      let expires = 'expires=' + d.toUTCString();
      document.cookie = cname + '=' + cvalue + '; ' + domain + expires + ';path=/';
    }

    // 添加样式
    function addStyle(css, className, addToTarget, isReload, initType) {
      // 添加CSS代码，不考虑文本载入时间，只执行一次-无论成功与否，带有className
      RAFInterval(
        function () {
          /**
           * addToTarget这里不要使用head标签,head标签的css会在html载入时加载，
           * html加载后似乎不会再次加载，body会自动加载
           * **/
          let addTo = document.querySelector(addToTarget);
          if (typeof addToTarget == 'undefined') addTo = document.head || document.body || document.documentElement || document;
          isReload = isReload || false; // 默认是非加载型
          initType = initType || 'text/css';
          // 如果没有目标节点(则直接加) || 有目标节点且找到了节点(进行新增)
          if (typeof addToTarget == 'undefined' || (typeof addToTarget != 'undefined' && document.querySelector(addToTarget) != null)) {
            // clearInterval(tout);
            // 如果true 强行覆盖，不管有没有--先删除
            // 如果false，不覆盖，但是如果有的话，要退出，不存在则新增--无需删除
            if (isReload === true) {
              safeRemove('.' + className);
            } else if (isReload === false && document.querySelector('.' + className) != null) {
              // 节点存在 && 不准备覆盖
              return true;
            }
            let cssNode = document.createElement('style');
            if (className != null) cssNode.className = className;
            cssNode.setAttribute('type', initType);
            cssNode.innerHTML = css;
            try {
              addTo.appendChild(cssNode);
            } catch (e) {
              console.log(e.message);
            }
            return true;
          }
        },
        20,
        true
      );
    }

    function getElementByXpath(e, t, r) {
      (r = r || document), (t = t || r);
      try {
        return r.evaluate(e, t, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      } catch (t) {
        return void console.error('无效的xpath');
      }
    }

    // 获取元素
    function getAllElementsByXpath(e, t, r) {
      return (r = r || document), (t = t || r), r.evaluate(e, t, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    }

    function getAllElements(e, t, r, n, o) {
      var i,
        s = [];
      if (!e) return s;
      if (((r = r || document), (n = n || window), (o = o || void 0), (t = t || r), 'string' == typeof e))
        i =
          0 === e.search(/^css;/i)
            ? (function getAllElementsByCSS(e, t) {
                return (t || document).querySelectorAll(e);
              })(e.slice(4), t)
            : getAllElementsByXpath(e, t, r);
      else {
        if (!(i = e(r, n, o))) return s;
        if (i.nodeType) return (s[0] = i), s;
      }
      return (function makeArray(e) {
        var t,
          r,
          n,
          o = [];
        if (e.pop) {
          for (t = 0, r = e.length; t < r; t++) (n = e[t]) && (n.nodeType ? o.push(n) : (o = o.concat(makeArray(n))));
          return a()(o);
        }
        if (e.item) {
          for (t = e.length; t; ) o[--t] = e[t];
          return o;
        }
        if (e.iterateNext) {
          for (t = e.snapshotLength; t; ) o[--t] = e.snapshotItem(t);
          return o;
        }
      })(i);
    }

    // 正则获取
    function Reg_Get(HTML, reg) {
      let RegE = new RegExp(reg);
      try {
        return RegE.exec(HTML)[1];
      } catch (e) {
        return '';
      }
    }

    function GMRemove(keys) {
      const keyList = [];
      if (typeof keys === 'string') {
        keyList.push(keys);
      } else if (Array.isArray(keys)) {
        keyList.push(...keys);
      }
      GM.deleteValue(prefix + key);
    }

    async function GMClear() {
      const keys = await GM.listValues();
      remove(keys.filter((key) => key.startsWith(prefix)));
    }

    function bindDrag(div) {
      GM.getValue(`${div.id}-position`).then(function (data) {
        if (data) {
          let position = JSON.parse(data);
          div.style.top = position.top;
          div.style.left = position.left;
          div.style.right = position.right;
        }
      });

      let hangDiv = document.createElement('div');
      hangDiv.style = 'position: absolute; cursor: move; top: 0; left: 0;width: 100%;height: 4px;';
      div.appendChild(hangDiv);

      let winWidth = getWindowWidth();

      let mousemove = function (e) {
        if (e.clientX < winWidth / 2) {
          //左半屏
          div.style.left = e.clientX - hangDiv.dragStartX + 'px';
          div.style.right = '';
        } else {
          div.style.right = winWidth - e.clientX + (hangDiv.dragStartX - hangDiv.clientWidth) + 'px';
          div.style.left = '';
        }

        div.style.top = e.clientY - hangDiv.dragStartY + 'px';
      };

      let mouseup = function (e) {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
        GM.setValue(`${div.id}-position`, JSON.stringify({ top: div.style.top, left: div.style.left, right: div.style.right }));
      };

      hangDiv.addEventListener('mousedown', function (e) {
        // element mousedown
        let rect = e.currentTarget.getBoundingClientRect();
        hangDiv.dragStartX = e.clientX - rect.left;
        hangDiv.dragStartY = e.clientY - rect.top;

        // hangDiv.dragStartX = e.offsetX;
        // hangDiv.dragStartY = e.offsetY;
        winWidth = getWindowWidth();

        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
      });

      // div.style.position = 'absolute'; // fixed might work as well
    }

    function getWindowWidth() {
      let winWidth = 0;
      if (window.innerWidth) {
        winWidth = window.innerWidth;
      } else if (document.body && document.body.clientWidth) {
        winWidth = document.body.clientWidth;
      }
      return winWidth;
    }
  })();
})();
