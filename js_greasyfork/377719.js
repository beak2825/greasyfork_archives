// ==UserScript==
// @name            直播吧助手
// @icon            https://tu.duoduocdn.com/img/logo8.png
// @namespace       https://linecho.com/
// @version         3.3
// @description     直播吧使用助手，包括标题栏比分、新闻模块排序调整等
// @author          purezhi
// @match           https://*.zhibo8.cc/*
// @match           https://*.zhibo8.com/*
// @require         https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require         https://cdn.jsdelivr.net/npm/notyf@3.9.0/notyf.min.js
// @resource        CSS_notyf https://cdn.jsdelivr.net/npm/notyf@3.9.0/notyf.min.css
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/377719/%E7%9B%B4%E6%92%AD%E5%90%A7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/377719/%E7%9B%B4%E6%92%AD%E5%90%A7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/*
直播吧使用助手，目前包含特性：
1）在标题栏显示比赛实时比分。
2）新闻模块顺序调整，可以将喜欢球队板块置顶。
3）首页推荐模块顺序调整，可以将喜欢运动板块置顶。
*/
var notyf = null;

(function () {
  'use strict';

  const notyfCss = GM_getResourceText("CSS_notyf");
  GM_addStyle(notyfCss);

  GM_addStyle(`
    .notyf__message { font-size: 14px; }
    .zb8-hlp-bar { position: absolute; right: 5px; top: 5px; padding: 5px 15px 0 0; }
    .zb8-hlp-bar .bbtn { height: 26px; line-height: 22px; padding: 0 10px; border-radius: 13px; user-select: none; display: inline-flex; align-items: center; justify-content: center; outline: none; cursor: pointer; background-image: linear-gradient(to top, #D8D9DB 0%, #fff 80%, #FDFDFD 100%); border: 1px solid #8F9092; box-shadow: 0 4px 3px 1px #FCFCFC, 0 6px 8px #D6D7D9, 0 -4px 4px #CECFD1, 0 -6px 4px #FEFEFE, inset 0 0 3px 0 #CECFD1; transition: all 0.2s ease; font-size: 13px; color: #606060; text-shadow: 0 1px #fff; }
    .zb8-hlp-bar .bbtn::-moz-focus-inner { border: 0; }
    .zb8-hlp-bar .bbtn:hover:not([disabled]) { box-shadow: 0 3px 2px 1px #FCFCFC, 0 5px 7px #D6D7D9, 0 -3px 3px #CECFD1, 0 -5px 3px #FEFEFE, inset 0 0 2px 2px #CECFD1; }
    .zb8-hlp-bar .bbtn:focus:not(:active) { animation: active 0.9s alternate infinite; outline: none; }
    .zb8-hlp-bar .bbtn:active:not([disabled]) { box-shadow: 0 3px 2px 1px #FCFCFC, 0 5px 7px #D6D7D9, 0 -3px 3px #CECFD1, 0 -5px 3px #FEFEFE, inset 0 0 4px 2px #999, inset 0 0 15px #aaa; }
    .zb8-hlp-bar .bbtn > * { transition: transform 0.2s ease; }
    .zb8-hlp-bar .bbtn:hover:not([disabled]) > * { transform: scale(0.975); }
    .zb8-hlp-bar .bbtn:active:not([disabled]) > * { transform: scale(0.95); }
    .zb8-hlp-tool { position: absolute; top: -26px; left: 0; right: 0; text-align: right; padding: 0; background: transparent; opacity: 0.15; }
    .zb8-hlp-tool a.opt { color: #0082ff; cursor: pointer; font-size: 14px !important; margin-left: 5px; }
    #middle .video { margin-bottom: 25px; }
    #middle .www_page .video:nth-child(1), #middle .www_page .video:nth-child(2) { margin-top: 30px; }
    #middle .zb8-hlp-tool { background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); }
    #middle .zb8-hlp-tool a.opt { font-size: 14px !important; }
    .vct-main .vct-left .recommend .zb8-hlp-tool { top: 0; right: 10px; }
  `);

  notyf = new Notyf({ position: { x: 'center', y: 'top' }, dismissible: true, duration: 2500 });

  // 初始化比赛页面标题
  initScoreTitle();

  // 模块排序
  const panelSort = new PanelSort();
  panelSort.init();
})();

// 排序类型: home 首页，news 新闻视频
function PanelSort(sortTye) {
  this.page = '';
  this.container = null;
  this.formContainer = null;
  this.localStorageSaveKey = '';

  // 配置项
  const defaultOptions = {
    formSelector: '',
    containerSelector: '',
    moduleSelector: '',
    headSelector: '',
    titleSelector: ''
  };
  // 首页排序配置
  const homeOptions = {
    formSelector: '.menu .container',
    containerSelector: '.vct-main .vct-left .recommend',
    moduleSelector: '.vct-main .vct-left .recommend .vct-box',
    headSelector: '._header',
    titleSelector: '._title'
  };
  // 新闻排序配置
  const newsOptions = {
    formSelector: '.menu',
    containerSelector: '#middle .m_left',
    moduleSelector: '.video.v_change',
    headSelector: '.v_top',
    titleSelector: '.v_top>a:first-child'
  };

  let _this = this;

  this.init = function () {
    // 首页
    if (/^https?:\/\/www\.zhibo8\.(cc|com)\/?$/.test(location.href)) {
      this.page = 'www_www';
      this.options = $.extend({}, defaultOptions, homeOptions);
    }
    else if (/^https?:\/\/www\.zhibo8\.(cc|com)\/nba\/?$/.test(location.href)) {
      // 篮球视频
      this.page = 'www_nba';
      this.options = $.extend({}, defaultOptions, newsOptions);
    }
    else if (/^https?:\/\/www\.zhibo8\.(cc|com)\/zuqiu\/?$/.test(location.href)) {
      // 足球视频
      this.page = 'www_zuqiu';
      this.options = $.extend({}, defaultOptions, newsOptions);
    }
    else if (/^https?:\/\/news\.zhibo8\.(cc|com)\/nba\/?$/.test(location.href)) {
      // 篮球资讯
      this.page = 'news_nba';
      this.options = $.extend({}, defaultOptions, newsOptions);
    }
    else if (/^https?:\/\/news\.zhibo8\.(cc|com)\/zuqiu\/?$/.test(location.href)) {
      // 足球资讯
      this.page = 'news_zuqiu';
      this.options = $.extend({}, defaultOptions, newsOptions);
    }

    if (!this.page) {
      // showError('本页面不适用');
      return;
    }

    this.container = $(this.options.containerSelector);
    if (this.page === 'www_nba' || this.page === 'www_zuqiu') {
      this.container.addClass('www_page');
    }

    this.localStorageSaveKey = 'sorting_' + this.page;

    this.formContainer = $(this.options.formSelector);
    console.error(this.formContainer.find('.zb8-hlp-bar').length);
    if (this.formContainer.find('.zb8-hlp-bar').length < 1) {
      this.formContainer.append(`
        <div class="zb8-hlp-bar">
          <button mod-order-save class="bbtn">保存排序</button>
          <button mod-order-reset class="bbtn">重置排序</button>
        </div>
      `);

      $(document).on('click', '[mod-order-save]', function (event) {
        _this.saveSort();
      });

      $(document).on('click', '[mod-order-reset]', function (event) {
        if (localStorage.getItem(_this.localStorageSaveKey) != null) {
          localStorage.removeItem(_this.localStorageSaveKey);
        }
        location.reload();
      });
    }

    this.container.on('click', '[mod-top]', function (event) {
      let $el = $(this);
      let $mod = $el.closest(_this.options.moduleSelector);
      if ($mod.length <= 0 || $mod.prevAll(_this.options.moduleSelector).length <= 0) return;
      $mod.insertBefore($mod.prevAll(_this.options.moduleSelector).last());
    });

    this.container.on('click', '[mod-prev]', function (event) {
      let $el = $(this);
      let $mod = $el.closest(_this.options.moduleSelector);
      if ($mod.length <= 0 || $mod.prev(_this.options.moduleSelector).length <= 0) return;
      $mod.insertBefore($mod.prev(_this.options.moduleSelector));
    });

    this.container.on('click', '[mod-next]', function (event) {
      let $el = $(this);
      let $mod = $el.closest(_this.options.moduleSelector);
      if ($mod.length <= 0 || $mod.next(_this.options.moduleSelector).length <= 0) return;
      $mod.insertAfter($mod.next(_this.options.moduleSelector));
    });

    // 排序配置
    let sortings = this.loadSort();

    const modCount = $(this.options.moduleSelector).length;
    $(this.options.moduleSelector).each(function (idx, el) {
      let $head = $(el).find(_this.options.headSelector);
      if (!$head) {
        console.error(`module head not found: ${_this.options.headSelector}`);
        return;
      }

      let $titleEl = $(el).find(_this.options.titleSelector);
      if (!$titleEl) {
        console.error(`module title not found: ${_this.options.titleSelector}`);
        return;
      }
      // console.error($head);
      // console.error($titleEl);
      const title = $titleEl.html() || $titleEl.text();
      if (!title) {
        console.error(`module title is empty: ${_this.options.titleSelector}`);
        return;
      }

      let sort = modCount - idx;
      if (sortings && sortings[title] != null) {
        sort = sortings[title];
      }

      $(el).attr('mod-order', sort);

      $head.css('position', 'relative');
      $head.append(`
        <div mod-sort class="zb8-hlp-tool">
          <a class="opt" mod-top href="javascript:;">⬆️ 置顶</a>
          <a class="opt" mod-prev href="javascript:;">⬅️ 前移</a>
          <a class="opt" mod-next href="javascript:;">➡️️ 后移</a>
        </div>
      `);
    });

    this.doSort();

    $('[mod-sort]').on('mouseover', function (event) {
      $(this).css('opacity', '1');
    })
    $('[mod-sort]').on('mouseout', function (event) {
      $(this).css('opacity', '0.15');
    });
  }

  // 执行排序
  this.doSort = function () {
    const modArr = []
    let max = 0;
    $(this.options.moduleSelector).each(function (idx, el) {
      let sort = $(el).attr('mod-order');
      if (!sort) {
        return;
      }

      sort = parseInt(sort)
      modArr[sort] = $(el);
      if (max < sort) max = parseInt(sort);
    });

    for (let i = 0; i <= max; i++) {
      if (!modArr[i]) continue;
      modArr[i].insertBefore(this.options.moduleSelector + ':first-child');
    }
  }

  // 加载排序配置
  this.loadSort = function () {
    if (localStorage.getItem(this.localStorageSaveKey)) {
      return JSON.parse(localStorage.getItem(this.localStorageSaveKey));
    }
    return null;
  }

  // 保存排序
  this.saveSort = function () {
    const sortings = {};
    const modCount = $(this.options.moduleSelector).length;
    $(this.options.moduleSelector).each(function (idx, el) {
      let $head = $(el).find(_this.options.headSelector);
      if (!$head) {
        console.error(`module head not found: ${_this.options.headSelector}`);
        return;
      }

      let $titleEl = $(el).find(_this.options.titleSelector);
      if (!$titleEl) {
        console.error(`module title not found: ${_this.options.headSelector}`);
        return;
      }
      // console.error($head);
      // console.error($titleEl);
      const title = $titleEl.html();
      if (!title) {
        console.error(`module title is empty: ${_this.options.headSelector}`);
        return;
      }

      sortings[title] = modCount - idx;
    });

    localStorage.setItem(this.localStorageSaveKey, JSON.stringify(sortings));
    console.error(`save ${this.localStorageSaveKey} key with value: ${JSON.stringify(sortings)}`);

    showSuccess('保存成功');
  }
}

// 初始化比赛页面标题
function initScoreTitle() {
  if (!/https?:\/\/(www\.)?zhibo8\.(cc|com)\/zhibo\/nba\/([^\.]+?)\.htm/.test(location.href)) return;

  var ttlIntrvl = setInterval(function () {
    showScoreTitle();
  }, 3000);
  showScoreTitle();
}

// 解析比赛比分
function showScoreTitle() {
  const vtm = document.querySelectorAll('.bf_table .visit_team_name a');
  if (vtm.length < 1) {
    console.warn("no visit team");
    return;
  }
  const vsc = document.querySelectorAll('.bf_top .bf_box.tmtop .time_score .visit_score');
  if (vtm.length < 1) {
    console.warn("no visit score");
    return;
  }
  const htm = document.querySelectorAll('.bf_table .home_team_name a');
  if (vtm.length < 1) {
    console.warn("no host team");
    return;
  }
  const hsc = document.querySelectorAll('.bf_top .bf_box.tmtop .time_score .host_score');
  if (vtm.length < 1) {
    console.warn("no host score");
    return;
  }

  document.title = `${vtm[0].innerText} ${vsc[0].innerText} ➲ ${htm[0].innerText} ${hsc[0].innerText}`;
}

/* 辅助函数 */

function showError(msg) {
  showMsg(msg, 'error')
}
function showSuccess(msg) {
  showMsg(msg, 'success')
}
function showMsg(msg, typ) {
  if (notyf) notyf.open({
    type: typ ? typ : 'info',
    message: msg
  });
  else alert(msg);
}