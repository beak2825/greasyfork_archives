// ==UserScript==
// @name         小王影视
// @version      1.1.6
// @author       (o˘◡˘o)
// @description  原网页解析 VIP 
// @note         最近更新：更
// @namespace    (o˘◡˘o)
// @supportURL   https://gitee.com/ecruos/oo
// @icon         https://p.pstatp.com/origin/fe690000c9141955bbac
// @license      GPL License
// @include      *
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/401580/%E5%B0%8F%E7%8E%8B%E5%BD%B1%E8%A7%86.user.js
// @updateURL https://update.greasyfork.org/scripts/401580/%E5%B0%8F%E7%8E%8B%E5%BD%B1%E8%A7%86.meta.js
// ==/UserScript==

/**
 * 用户自定义 VIP视频解析接口 → 后面自动补全要解析的网址
 * 在`符号之间添加，一行一个，类似搜索源
 * 支持格式如下：

http://xxx.com/?url=
解析名字  http://xxx.com/?url=

 */
var VIP解析 = `
播放源一 https://www.myxin.top/jx/api/?url=
播放源二 https://jiexi.071811.cc/jx.php?url=
播放源三 https://jiexi.380k.com/?url=

`;

// ** 表示搜索时的关键词
var 搜索源 = `

 腾讯  https://m.v.qq.com/search.html?act=0&keyWord=**   https://v.qq.com/x/search/?q=**

  爱奇艺  https://m.iqiyi.com/search.html?source=default&key=**  https://so.iqiyi.com/so/q_**

  优酷  https://www.soku.com/m/y/video?q=**  https://so.youku.com/search_video/q_**

  芒果  https://m.mgtv.com/so/?k=**  https://so.mgtv.com/so/k-**

  PPTV http://sou.pptv.com/s_video?kw=**  https://msou.pptv.com/s_video/pg_result?keyword=**

  哔哩  https://m.bilibili.com/search.html?keyword=**  https://search.bilibili.com/all?keyword=**

  搜狐  https://m.tv.sohu.com/upload/h5/m/mso.html?key=**  https://so.tv.sohu.com/mts?wd=**

  咪咕  http://www.miguvideo.com/mgs/website/prd/search.html?keywords=**  http://m.miguvideo.com/mgs/msite/prd/search.html?#**

  1905 https://vip.1905.com/Search?q=**

  乐视  http://m.le.com/search?wd=**  http://so.le.com/s?wd=**

`;

/**
 * VIP解析 + 换站搜索 + 网站净化
 *
 * name: 标识说明
 * match: 匹配网址，正则或字符串
 * hide: 要净化隐藏的css选择器
 * css: 自定义css
 * jump: 在搜索页要添加 换站搜索 的css选择器
 * keyword: 在搜索页获取标题 → 换站搜索 的搜索词
 * vip: 在播放页要添加 Vip解析列表 的css选择器
 * title: 在播放页获取标题 → 换站搜索 的搜索词
 * fixUrl: 解析时对播放网址进行变换，比如将手机端播放网址变成电脑端播放网址
 */
var BETTER_ADDONS = [
  // 正版源
  {
    name: '哔哩哔哩·搜索',
    match: /bilibili.com\/search|search.bilibili.com/,
    jump: '#all-list | append, .index__board__src-search-board-'
  },
  {
    name: '哔哩哔哩 - m',
    match: /m\.bilibili\.com/,
    sign: '.mg-footer-copyright',
    hide:
      '.index__openAppBtn__src-commonComponent-topArea-, .index__container__src-commonComponent-bottomOpenApp-, .bili-app, .recom-wrapper, .b-footer, .open-app-bar, .open-app-float, .more-review-wrapper'
  },
  {
    name: '腾讯·搜索',
    match: /v.qq.com\/(\w+\/)?search/,
    jump: '#result, .wrapper_main > .mod_pages',
    sign: '.copyright',
    hide: '.tvp_app_bar'
  },
  {
    name: '腾讯·播放页',
    match: /v\.qq\.com\/(cover|play|x\/cover|x\/page|x\/play|x\/m\/cover|x\/m\/page|x\/m\/play)/,
    vip: '#vip_title, .U_box_bg_a, .player_headline, .mod_video_info',
    title: '.mod_video_info .video_title, ._main_title, .player_title',
    fixUrl(url) {
      // 腾讯视频移动端播放网址有变化，多数解析未适配，故暂时将移动端播放网址转换为电脑端播放网址
      if (url.includes('cid=')) {
        var cid = url.match(/cid=(\w+)/)[1];
        var vid = url.match(/vid=(\w+)/);
        vid = vid ? '/' + vid[1] : '';
        return `https://v.qq.com/x/cover/${cid}${vid}.html`;
      }
      return url;
    },
    hide:
      '.mod_source, .video_function, .mod_promotion, #vip_privilege, #vip_activity, .U_bg_b, .btn_open_v, .btn_openapp, #vip_header, .btn_user_hd, .mod_sideslip_privileges, .mod_game_rec, .mod_source, .mod_promotion, .mod_sideslip_h, .btn_open, .btn_pay, .mod_box_lastview, .mod_vip_popup, .mod_vip_popup + .mask_layer',
    css: `
body, #vip_title {
  padding-bottom: 0 !important;
}

.mod_episodes_numbers.is-vip .item {
  width: auto;
  padding: 0 1em;
}

.U_html_bg .container {
  padding-bottom: 30px;
}

.mod_play .mod_player_viptips .btn_try {
  left: 30%;
}`
  },
  {
    name: '爱奇艺·搜索',
    match: /m.iqiyi.com\/search|so.iqiyi.com/,
    jump: '-.m-box, .search-con-page',
    sign: '.m-footer',
    hide: '.btn-ticket, .btn-yuyue, .btn-download, .m-iqyDown'
  },
  {
    name: '爱奇艺·播放页',
    match: /\.iqiyi\.com\/(a_|v_|w_|adv)/,
    vip: 'div[name="m-videoInfo"], #block-C',
    title: '#widget-videotitle, .video-title, .c-title-link, .player-title a',
    sign: '.m-footer',
    hide:
      '.m-iqyDown, .header-login + div, .m-video-action, div[name="m-vipRights"], div[name="m-extendBar"], .m-iqylink-diversion, .m-iqylink-guide, .c-openVip, .c-score-btn, .m-videoUser-spacing, .m-pp-entrance, .m-hotWords-bottom, div[template-type="ALBUM"] .m-player-tip',
    css: `
.page_play {
  padding-bottom: 0;
}

div[name="m-videoInfo"] {
  padding-top: 1em;
}

.m-box-items .oo-album-item {
  border-radius: 0.05rem;
  background-color: #e9ecef;
  color: #495057;
  padding: 0.5em 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0.25em;
  font-weight: bold;
}

.m-video-player #oo-player {
  padding-top: 56.25%;
  top: 50%;
  transform: translateY(-50%);
}
`
  },
  {
    name: '优酷·搜索',
    match: /soku.com\/m.+q=|so.youku.com\/search_video/,
    jump: '#bpmodule-main, .yk_result'
  },
  {
    name: '优酷·播放页',
    match: /m\.youku\.com\/a|m\.youku\.com\/v|v\.youku\.com\/v_/,
    vip: '.h5-detail-info, .player-title',
    title:
      '.player-title .subtitle a, .module-name, .anthology-title-wrap .title, .title-link',
    // fixUrl(url) {
    //   return url.replace('v.youku.com/v_show', 'm.youku.com/video');
    // },
    sign: '.copyright',
    hide:
      '.h5-detail-guide, .h5-detail-ad, .brief-btm, .smartBannerBtn, .cmt-user-action, #right-title-ad-banner, .Corner-container',
    css: `
#bpmodule-playpage-lefttitle {
  height: auto !important;
}`
  },
  {
    name: '土豆·播放页',
    match: /\.tudou.com\/v\//,
    vip: '.play-video-desc, .td-play__baseinfo',
    title: '.td-listbox__title, .video-desc-title',
    hide:
      '.video-player-topbar, .td-h5__player__appguide, #tudou-footer, .dropdown__panel__con'
  },
  {
    name: '芒果·搜索',
    match: /m.mgtv.com\/so\/|so.mgtv.com\/so/,
    jump: '#paginator, .result-box .media',
    keyword: /k[-=]([^&\?\/\.]+)/
  },
  {
    name: '芒果·播放页',
    match: /\.mgtv\.com\/(b|l)\//,
    vip: ['.xuanji | before', '.v-panel-box'],
    title: '.v-panel-title, .vt-txt',
    sign: '.mg-footer-copyright',
    hide:
      '.ad-banner, .video-area-bar, .video-error .btn, .m-vip-list, .m-vip-list + div:not([class]), .toapp, .video-comment .ft, .mg-app-swip'
  },
  {
    name: '搜狐·搜索',
    match: /m.tv.sohu.com.+key=|so.tv.sohu.com.+wd=/,
    jump: '.ssMore | before, .select-container | before'
  },
  {
    name: '搜狐·播放页',
    match: /film\.sohu\.com\/album\/|tv\.sohu\.com\/(v|phone_play_film)/,
    vip:
      '.title-wrap, .videoInfo, .tw-info, .player-detail, .movie-info-content',
    title: '#vinfobox h2, .t-info, .movie-t h3',
    fixUrl(url) {
      if (/phone_play_film.+channeled=/.test(url)) {
        var cid = url.match(/channeled=(\w+)/)[1];
        var aid = url.match(/aid=(\w+)/)[1];
        return `https://film.sohu.com/album/${aid}.html?channeled=${cid}`;
      }
      return url;
    },
    sign: '.links',
    hide:
      '.actv-banner, .btn-xz-app, .twinfo_iconwrap, .btn-comment-app, #ad_banner, .advertise, .main-ad-view-box, .foot.sohu-swiper, .app-star-vbox, .app-guess-vbox, .main-rec-view-box, .app-qianfan-box, .comment-empty-bg, .copyinfo, .ph-vbox, .btn_m_action, .btn-xz-app, #film_top_banner, .btn-comment-app',
    css: `
.comment-empty-txt {
  margin-bottom: 0;
}

.app-view-box + footer {
  padding: 0;
  opacity: 0.5;
}

#sohuplayer #menu {
  z-index: 2147483647;
}`
  },
  {
    name: '乐视·搜索',
    match: /m.le.com\/search|so.le.com\/s/,
    jump: '.column_tit | before, .Relate | before'
  },
  {
    name: '乐视·播放页',
    match: /\.le\.com\/(ptv\/vplay\/|vplay_)/,
    vip: '.introduction_box, .briefIntro_left .info_list',
    title: '.briefIntro_info .info_tit, #j-introduction h2',
    hide: '.gamePromotion, .gamePromotionTxt, #j-leappMore, .lbzDaoliu, .arkBox'
  },
  {
    name: '咪咕.cn·搜索',
    match: /\.migu\.cn\/search\.html/,
    jump: '.pagination, .copyright | before',
    keyword: /content=([^&\?\/\.]+)/,
    hide: '.down-btn'
  },
  {
    name: '咪咕·搜索',
    match: /\.miguvideo\.com\/.*search.html/,
    jump: '.search-pagination, .search-main',
    keyword: /keywords=([^&\?\/\.]+)|\?.*#([^&\?\/\.]+)/
  },
  {
    name: '咪咕·播放页',
    match: /miguvideo\.com\/.+\/detail\.html/,
    vip: '.playerFooter, .programgroup',
    title: '.left-box .title, .episodeTitle, .video_title',
    hide: '.group-item[name*="广告"], .openClient'
  },
  {
    name: 'PPTV·搜索',
    match: /sou.pptv.com\/s_video.+kw=|msou.pptv.com\/s_video\/.+keyword=/,
    jump: '.pagination, .zhengpian-box | append'
  },
  {
    name: 'PPTV·播放页',
    match: /(v|m)\.pptv\.com\/show\//,
    vip: '.m .cf, .vod-tit, .vod-intor',
    title: '#video-info h1, .vod-tit-in span, .tit',
    hide:
      '.w-video-vastad, #video-download-game, div[class*="openapp"], div[class*="side-adv"], div[id*="afp_"], div[id*="-afp"], iframe[src*="/game/"], .afpPosition, .download-iconbar'
  },
  {
    name: '华数·搜索',
    match: /wasu\.cn\/.+Search\/.+k=/,
    jump: '#topVod'
  },
  {
    name: '华数·播放页',
    match: /wasu\.cn\/.*play\/show\//,
    vip: '.movie_title',
    title: '.movie_title h2',
    hide: 'div[id*="BAIDU"], .player_menu_con, body > div[style*="fixed"]'
  },
  {
    name: '1905·搜索',
    match: /\.1905\.com\/(Search|search)/,
    jump: '.pagination, #new_page'
  },
  {
    name: '1905·播放页',
    match: /1905.com\/play/,
    vip: '.playerBox-info, #movie_info, .player-nav',
    title: '#movie_info .infoInner .title, .movie-title, .tv_title',
    hide:
      '#app_store, .openMembershipBtn, body > div[id] > iframe, .pv2-advertisement, .open-app',
    css: `
#movie_info {
  margin-top: 1em;
}`
  },

  // 优质源
  {
    name: '奈菲·搜索',
    match: 'nfmovies.com/search',
    jump: '.hy-page',
    keyword($) {
      return $('.hy-video-head .text-color')
        .eq(1)
        .text()
        .replace(/^“|”$/g, '');
    }
  },
  {
    name: '奈菲',
    match: /nfmovies\.com/,
    hide: 'img[src*="tu/ad"], .clearfix a[onclick] img',
    css: `
#adleft, #adright {
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}`
  },
  {
    name: '飞极速·搜索',
    match: 'feijisu8.com/search',
    jump: '#result'
  },
  {
    name: '飞极速',
    match: /feijisu8\.com/,
    hide: '.index-top ~ div, .v-top ~ div[id], .footer ~ div, .footer ~ brde'
  },
  {
    name: '樱花动漫·搜索',
    match: 'yhdm.tv/search',
    jump: '.footer | before, .foot | before'
  },
  {
    name: '樱花动漫',
    match: /yhdm\.tv/,
    hide:
      '.footer ~ div, a[href*="elfdoll.cn"], .head + .area ~ div:not([class])'
  },
  {
    name: '1090影视·搜索',
    match: /1090ys.com\/.+c=search/,
    jump: '.stui-page, .stui-pannel'
  },
  {
    name: '1090影视',
    match: /1090ys\.com/,
    hide: '.container ~ *[id]'
  },
  {
    name: '云播·搜索',
    match: 'yunbtv.com/vodsearch',
    jump: '.pager',
    keyword: '.breadcrumb font'
  },
  {
    name: '残月·搜索',
    match: 'ys.23yue.cn/seacher',
    jump: '.stui-pannel_bd > .stui-vodlist__media'
  },
  {
    name: '独播库·搜索',
    match: 'duboku.net/vodsearch',
    jump: '.myui-panel_bd > .myui-vodlist__media'
  },
  {
    name: '拾伍·搜索',
    match: 'shiwutv.com/vodsearch',
    jump: '.stui-page, .stui-pannel'
  },
  {
    name: '零一·搜索',
    match: '01th.net/search',
    jump: '.stui-page, .stui-pannel'
  },
  {
    name: 'APP·搜索',
    match: 'app.movie/index.php/vod/search.html',
    jump: '.stui-page, .stui-pannel'
  },
  {
    name: '八兔·搜索',
    match: '8tutv.com/search',
    jump: '.ys'
  },
  {
    name: 'Vipku·搜索',
    match: /2n65.cn\/.+\/search/,
    jump: '.left_row | append'
  },
  {
    name: '影迷窝·搜索',
    match: 'yingmiwo.com/vodsearch',
    jump: '.left_row | append'
  },
  {
    name: '影迷窝',
    match: /yingmiwo\.com/,
    hide: '#bottom_ads, .ads_box'
  }
];

// 搜索时标题净化，比如去掉 第N季 第N集
var PurifyKeywordRegex = /.*《|》.*|\s*第.{1,3}[季集][\s\d]*$|\s+\d{2,3}\s*$/g;

// 从搜索网址匹配搜索词
var CommonSearchKeywordRegex = /(wd|key|keyword|keyWord|kw|q)=([^&\?\/\.-]+)|(search\/|seacher-|q_)([^&\?\/\.-]+)/;

// 通用净化样式
var PurifyStyle = `
display: none !important;
visibility: hidden !important;
position: absolute !important;
left: -9999px !important;
opacity: 0 !important;
pointer-events: none !important;
z-index: -9999 !important;`;

// 支持原网页解析的正版网站
var InnerUrlRegex = /v\.qq\.com|\.(iqiyi|youku|mgtv|miguvideo|sohu|le|pptv|wasu|1905|tudou)\.(com|cn)/;

// 正版网站原网页解析时替换的播放器选择器
var PlayerSelector =
  '#iframaWrapper, #mgtv-player-wrap, #sohuplayer .x-player, #wPlayer, #video-box, #playerbox, .td-h5__player, .td-playbox, .iqp-player, .g-play .video-area, #mod_player, #playBox, #j-player, #video, .m-video-player, .site_player';

! function() {
  if (window.top === window.self) {
    var n = location.href;
    if (!Is(/m\.le\.com/) || Is(/m.le.com\/search|so.le.com\/s|\.le\.com\/(ptv\/vplay\/|vplay_)/)) {
      var t = decodeURIComponent,
        e = n => n.charCodeAt(0) - 97,
        i = n => String.fromCharCode(97 + n),
        o = (new Date).getMonth() + 3,
        r = x(t(w(atob("QzIlc0M5JUJDJTVBJTc5JTJFJUM5JUJDJXMtNDIlc3MycXN6bWk"))), 4),
        a = document.getElementsByTagName("html")[0];
      if (a.getAttribute("oo-movie") !== r) {
        var Zepto = function() {
          var n, $, t, e, i, o = [],
            r = o.concat,
            a = o.filter,
            l = o.slice,
            s = window.document,
            c = {},
            u = {},
            p = {
              "column-count": 1,
              columns: 1,
              "font-weight": 1,
              "line-height": 1,
              opacity: 1,
              "z-index": 1,
              zoom: 1
            },
            d = /^\s*<(\w+|!)[^>]*>/,
            f = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
            h = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
            y = /^(?:body|html)$/i,
            m = /([A-Z])/g,
            g = ["val", "css", "html", "text", "data", "width", "height", "offset"],
            v = s.createElement("table"),
            M = s.createElement("tr"),
            J = {
              tr: s.createElement("tbody"),
              tbody: v,
              thead: v,
              tfoot: v,
              td: M,
              th: M,
              "*": s.createElement("div")
            },
            T = /complete|loaded|interactive/,
            U = /^[\w-]*$/,
            b = {},
            w = b.toString,
            D = {},
            x = s.createElement("div"),
            N = {
              tabindex: "tabIndex",
              readonly: "readOnly",
              for: "htmlFor",
              class: "className",
              maxlength: "maxLength",
              cellspacing: "cellSpacing",
              cellpadding: "cellPadding",
              rowspan: "rowSpan",
              colspan: "colSpan",
              usemap: "useMap",
              frameborder: "frameBorder",
              contenteditable: "contentEditable"
            },
            Q = Array.isArray || function(n) {
              return n instanceof Array
            };

          function k(n) {
            return null == n ? String(n) : b[w.call(n)] || "object"
          }

          function V(n) {
            return "function" == k(n)
          }

          function E(n) {
            return null != n && n == n.window
          }

          function C(n) {
            return null != n && n.nodeType == n.DOCUMENT_NODE
          }

          function I(n) {
            return "object" == k(n)
          }

          function j(n) {
            return I(n) && !E(n) && Object.getPrototypeOf(n) == Object.prototype
          }

          function S(n) {
            var t = !!n && "length" in n && n.length,
              e = $.type(n);
            return "function" != e && !E(n) && ("array" == e || 0 === t || "number" == typeof t && t > 0 && t - 1 in n)
          }

          function R(n) {
            return n.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
          }

          function z(n) {
            return n in u ? u[n] : u[n] = new RegExp("(^|\\s)" + n + "(\\s|$)")
          }

          function O(n, t) {
            return "number" != typeof t || p[R(n)] ? t : t + "px"
          }

          function A(n) {
            return "children" in n ? l.call(n.children) : $.map(n.childNodes, (function(n) {
              if (1 == n.nodeType) return n
            }))
          }

          function H(n, t) {
            var e, i = n ? n.length : 0;
            for (e = 0; e < i; e++) this[e] = n[e];
            this.length = i, this.selector = t || ""
          }

          function _(t, e, i) {
            for (n in e) i && (j(e[n]) || Q(e[n])) ? (j(e[n]) && !j(t[n]) && (t[n] = {}), Q(e[n]) && !Q(t[n]) && (t[n] = []), _(t[n], e[n], i)) : void 0 !== e[n] && (t[n] = e[n])
          }

          function F(n, t) {
            return null == t ? $(n) : $(n).filter(t)
          }

          function X(n, t, e, i) {
            return V(t) ? t.call(n, e, i) : t
          }

          function B(n, t, e) {
            null == e ? n.removeAttribute(t) : n.setAttribute(t, e)
          }

          function Z(n, t) {
            var e = n.className || "",
              i = e && void 0 !== e.baseVal;
            if (void 0 === t) return i ? e.baseVal : e;
            i ? e.baseVal = t : n.className = t
          }

          function P(n) {
            try {
              return n ? "true" == n || "false" != n && ("null" == n ? null : +n + "" == n ? +n : /^[\[\{]/.test(n) ? $.parseJSON(n) : n) : n
            } catch (t) {
              return n
            }
          }

          function W(n, t) {
            t(n);
            for (var e = 0, i = n.childNodes.length; e < i; e++) W(n.childNodes[e], t)
          }
          return D.matches = function(n, t) {
            if (!t || !n || 1 !== n.nodeType) return !1;
            var e = n.matches || n.webkitMatchesSelector || n.mozMatchesSelector || n.oMatchesSelector || n.matchesSelector;
            if (e) return e.call(n, t);
            var i, o = n.parentNode,
              r = !o;
            return r && (o = x).appendChild(n), i = ~D.qsa(o, t).indexOf(n), r && x.removeChild(n), i
          }, e = function(n) {
            return n.replace(/-+(.)?/g, (function(n, t) {
              return t ? t.toUpperCase() : ""
            }))
          }, i = function(n) {
            return a.call(n, (function(t, e) {
              return n.indexOf(t) == e
            }))
          }, D.fragment = function(n, t, e) {
            var i, o, r;
            return f.test(n) && (i = $(s.createElement(RegExp.$1))), i || (n.replace && (n = n.replace(h, "<$1></$2>")), void 0 === t && (t = d.test(n) && RegExp.$1), t in J || (t = "*"), (r = J[t]).innerHTML = "" + n, i = $.each(l.call(r.childNodes), (function() {
              r.removeChild(this)
            }))), j(e) && (o = $(i), $.each(e, (function(n, t) {
              g.indexOf(n) > -1 ? o[n](t) : o.attr(n, t)
            }))), i
          }, D.Z = function(n, t) {
            return new H(n, t)
          }, D.isZ = function(n) {
            return n instanceof D.Z
          }, D.init = function(n, t) {
            var e, i;
            if (!n) return D.Z();
            if ("string" == typeof n)
              if ("<" == (n = n.trim())[0] && d.test(n)) e = D.fragment(n, RegExp.$1, t), n = null;
              else {
                if (void 0 !== t) return $(t).find(n);
                e = D.qsa(s, n)
              }
            else {
              if (V(n)) return $(s).ready(n);
              if (D.isZ(n)) return n;
              if (Q(n)) i = n, e = a.call(i, (function(n) {
                return null != n
              }));
              else if (I(n)) e = [n], n = null;
              else if (d.test(n)) e = D.fragment(n.trim(), RegExp.$1, t), n = null;
              else {
                if (void 0 !== t) return $(t).find(n);
                e = D.qsa(s, n)
              }
            }
            return D.Z(e, n)
          }, ($ = function(n, t) {
            return D.init(n, t)
          }).extend = function(n) {
            var t, e = l.call(arguments, 1);
            return "boolean" == typeof n && (t = n, n = e.shift()), e.forEach((function(e) {
              _(n, e, t)
            })), n
          }, D.qsa = function(n, t) {
            var e, i = "#" == t[0],
              o = !i && "." == t[0],
              r = i || o ? t.slice(1) : t,
              a = U.test(r);
            return n.getElementById && a && i ? (e = n.getElementById(r)) ? [e] : [] : 1 !== n.nodeType && 9 !== n.nodeType && 11 !== n.nodeType ? [] : l.call(a && !i && n.getElementsByClassName ? o ? n.getElementsByClassName(r) : n.getElementsByTagName(t) : n.querySelectorAll(t))
          }, $.contains = s.documentElement.contains ? function(n, t) {
            return n !== t && n.contains(t)
          } : function(n, t) {
            for (; t && (t = t.parentNode);)
              if (t === n) return !0;
            return !1
          }, $.type = k, $.isFunction = V, $.isWindow = E, $.isArray = Q, $.isPlainObject = j, $.isEmptyObject = function(n) {
            var t;
            for (t in n) return !1;
            return !0
          }, $.isNumeric = function(n) {
            var t = Number(n),
              e = typeof n;
            return null != n && "boolean" != e && ("string" != e || n.length) && !isNaN(t) && isFinite(t) || !1
          }, $.inArray = function(n, t, e) {
            return o.indexOf.call(t, n, e)
          }, $.camelCase = e, $.trim = function(n) {
            return null == n ? "" : String.prototype.trim.call(n)
          }, $.uuid = 0, $.support = {}, $.expr = {}, $.noop = function() {}, $.map = function(n, t) {
            var e, i, o, r, a = [];
            if (S(n))
              for (i = 0; i < n.length; i++) null != (e = t(n[i], i)) && a.push(e);
            else
              for (o in n) null != (e = t(n[o], o)) && a.push(e);
            return (r = a).length > 0 ? $.fn.concat.apply([], r) : r
          }, $.each = function(n, t) {
            var e, i;
            if (S(n)) {
              for (e = 0; e < n.length; e++)
                if (!1 === t.call(n[e], e, n[e])) return n
            } else
              for (i in n)
                if (!1 === t.call(n[i], i, n[i])) return n;
            return n
          }, $.grep = function(n, t) {
            return a.call(n, t)
          }, window.JSON && ($.parseJSON = JSON.parse), $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), (function(n, t) {
            b["[object " + t + "]"] = t.toLowerCase()
          })), $.fn = {
            constructor: D.Z,
            length: 0,
            forEach: o.forEach,
            reduce: o.reduce,
            push: o.push,
            sort: o.sort,
            splice: o.splice,
            indexOf: o.indexOf,
            concat: function() {
              var n, t, e = [];
              for (n = 0; n < arguments.length; n++) t = arguments[n], e[n] = D.isZ(t) ? t.toArray() : t;
              return r.apply(D.isZ(this) ? this.toArray() : this, e)
            },
            map: function(n) {
              return $($.map(this, (function(t, e) {
                return n.call(t, e, t)
              })))
            },
            slice: function() {
              return $(l.apply(this, arguments))
            },
            ready: function(n) {
              return T.test(s.readyState) && s.body ? n($) : s.addEventListener("DOMContentLoaded", (function() {
                n($)
              }), !1), this
            },
            get: function(n) {
              return void 0 === n ? l.call(this) : this[n >= 0 ? n : n + this.length]
            },
            toArray: function() {
              return this.get()
            },
            size: function() {
              return this.length
            },
            remove: function() {
              return this.each((function() {
                null != this.parentNode && this.parentNode.removeChild(this)
              }))
            },
            each: function(n) {
              return o.every.call(this, (function(t, e) {
                return !1 !== n.call(t, e, t)
              })), this
            },
            filter: function(n) {
              return V(n) ? this.not(this.not(n)) : $(a.call(this, (function(t) {
                return D.matches(t, n)
              })))
            },
            add: function(n, t) {
              return $(i(this.concat($(n, t))))
            },
            is: function(n) {
              return this.length > 0 && D.matches(this[0], n)
            },
            not: function(n) {
              var t = [];
              if (V(n) && void 0 !== n.call) this.each((function(e) {
                n.call(this, e) || t.push(this)
              }));
              else {
                var e = "string" == typeof n ? this.filter(n) : S(n) && V(n.item) ? l.call(n) : $(n);
                this.forEach((function(n) {
                  e.indexOf(n) < 0 && t.push(n)
                }))
              }
              return $(t)
            },
            has: function(n) {
              return this.filter((function() {
                return I(n) ? $.contains(this, n) : $(this).find(n).size()
              }))
            },
            eq: function(n) {
              return -1 === n ? this.slice(n) : this.slice(n, +n + 1)
            },
            first: function() {
              var n = this[0];
              return n && !I(n) ? n : $(n)
            },
            last: function() {
              var n = this[this.length - 1];
              return n && !I(n) ? n : $(n)
            },
            find: function(n) {
              var t = this;
              return n ? "object" == typeof n ? $(n).filter((function() {
                var n = this;
                return o.some.call(t, (function(t) {
                  return $.contains(t, n)
                }))
              })) : 1 == this.length ? $(D.qsa(this[0], n)) : this.map((function() {
                return D.qsa(this, n)
              })) : $()
            },
            closest: function(n, t) {
              var e = [],
                i = "object" == typeof n && $(n);
              return this.each((function(o, r) {
                for (; r && !(i ? i.indexOf(r) >= 0 : D.matches(r, n));) r = r !== t && !C(r) && r.parentNode;
                r && e.indexOf(r) < 0 && e.push(r)
              })), $(e)
            },
            parents: function(n) {
              for (var t = [], e = this; e.length > 0;) e = $.map(e, (function(n) {
                if ((n = n.parentNode) && !C(n) && t.indexOf(n) < 0) return t.push(n), n
              }));
              return F(t, n)
            },
            parent: function(n) {
              return F(i(this.pluck("parentNode")), n)
            },
            children: function(n) {
              return F(this.map((function() {
                return A(this)
              })), n)
            },
            contents: function() {
              return this.map((function() {
                return this.contentDocument || l.call(this.childNodes)
              }))
            },
            siblings: function(n) {
              return F(this.map((function(n, t) {
                return a.call(A(t.parentNode), (function(n) {
                  return n !== t
                }))
              })), n)
            },
            empty: function() {
              return this.each((function() {
                this.innerHTML = ""
              }))
            },
            pluck: function(n) {
              return $.map(this, (function(t) {
                return t[n]
              }))
            },
            show: function() {
              return this.each((function() {
                var n, t, e;
                "none" == this.style.display && (this.style.display = ""), "none" == getComputedStyle(this, "").getPropertyValue("display") && (this.style.display = (n = this.nodeName, c[n] || (t = s.createElement(n), s.body.appendChild(t), e = getComputedStyle(t, "").getPropertyValue("display"), t.parentNode.removeChild(t), "none" == e && (e = "block"), c[n] = e), c[n]))
              }))
            },
            replaceWith: function(n) {
              return this.before(n).remove()
            },
            wrap: function(n) {
              var t = V(n);
              if (this[0] && !t) var e = $(n).get(0),
                i = e.parentNode || this.length > 1;
              return this.each((function(o) {
                $(this).wrapAll(t ? n.call(this, o) : i ? e.cloneNode(!0) : e)
              }))
            },
            wrapAll: function(n) {
              if (this[0]) {
                var t;
                for ($(this[0]).before(n = $(n));
                  (t = n.children()).length;) n = t.first();
                $(n).append(this)
              }
              return this
            },
            wrapInner: function(n) {
              var t = V(n);
              return this.each((function(e) {
                var i = $(this),
                  o = i.contents(),
                  r = t ? n.call(this, e) : n;
                o.length ? o.wrapAll(r) : i.append(r)
              }))
            },
            unwrap: function() {
              return this.parent().each((function() {
                $(this).replaceWith($(this).children())
              })), this
            },
            clone: function() {
              return this.map((function() {
                return this.cloneNode(!0)
              }))
            },
            hide: function() {
              return this.css("display", "none")
            },
            toggle: function(n) {
              return this.each((function() {
                var t = $(this);
                (void 0 === n ? "none" == t.css("display") : n) ? t.show(): t.hide()
              }))
            },
            prev: function(n) {
              return $(this.pluck("previousElementSibling")).filter(n || "*")
            },
            next: function(n) {
              return $(this.pluck("nextElementSibling")).filter(n || "*")
            },
            html: function(n) {
              return 0 in arguments ? this.each((function(t) {
                var e = this.innerHTML;
                $(this).empty().append(X(this, n, t, e))
              })) : 0 in this ? this[0].innerHTML : null
            },
            text: function(n) {
              return 0 in arguments ? this.each((function(t) {
                var e = X(this, n, t, this.textContent);
                this.textContent = null == e ? "" : "" + e
              })) : 0 in this ? this.pluck("textContent").join("") : null
            },
            attr: function(t, e) {
              var i;
              return "string" != typeof t || 1 in arguments ? this.each((function(i) {
                if (1 === this.nodeType)
                  if (I(t))
                    for (n in t) B(this, n, t[n]);
                  else B(this, t, X(this, e, i, this.getAttribute(t)))
              })) : 0 in this && 1 == this[0].nodeType && null != (i = this[0].getAttribute(t)) ? i : void 0
            },
            removeAttr: function(n) {
              return this.each((function() {
                1 === this.nodeType && n.split(" ").forEach((function(n) {
                  B(this, n)
                }), this)
              }))
            },
            prop: function(n, t) {
              return n = N[n] || n, 1 in arguments ? this.each((function(e) {
                this[n] = X(this, t, e, this[n])
              })) : this[0] && this[0][n]
            },
            removeProp: function(n) {
              return n = N[n] || n, this.each((function() {
                delete this[n]
              }))
            },
            data: function(n, t) {
              var e = "data-" + n.replace(m, "-$1").toLowerCase(),
                i = 1 in arguments ? this.attr(e, t) : this.attr(e);
              return null !== i ? P(i) : void 0
            },
            val: function(n) {
              return 0 in arguments ? (null == n && (n = ""), this.each((function(t) {
                this.value = X(this, n, t, this.value)
              }))) : this[0] && (this[0].multiple ? $(this[0]).find("option").filter((function() {
                return this.selected
              })).pluck("value") : this[0].value)
            },
            offset: function(n) {
              if (n) return this.each((function(t) {
                var e = $(this),
                  i = X(this, n, t, e.offset()),
                  o = e.offsetParent().offset(),
                  r = {
                    top: i.top - o.top,
                    left: i.left - o.left
                  };
                "static" == e.css("position") && (r.position = "relative"), e.css(r)
              }));
              if (!this.length) return null;
              if (s.documentElement !== this[0] && !$.contains(s.documentElement, this[0])) return {
                top: 0,
                left: 0
              };
              var t = this[0].getBoundingClientRect();
              return {
                left: t.left + window.pageXOffset,
                top: t.top + window.pageYOffset,
                width: Math.round(t.width),
                height: Math.round(t.height)
              }
            },
            css: function(t, i) {
              if (arguments.length < 2) {
                var o = this[0];
                if ("string" == typeof t) {
                  if (!o) return;
                  return o.style[e(t)] || getComputedStyle(o, "").getPropertyValue(t)
                }
                if (Q(t)) {
                  if (!o) return;
                  var r = {},
                    a = getComputedStyle(o, "");
                  return $.each(t, (function(n, t) {
                    r[t] = o.style[e(t)] || a.getPropertyValue(t)
                  })), r
                }
              }
              var l = "";
              if ("string" == k(t)) i || 0 === i ? l = R(t) + ":" + O(t, i) : this.each((function() {
                this.style.removeProperty(R(t))
              }));
              else
                for (n in t) t[n] || 0 === t[n] ? l += R(n) + ":" + O(n, t[n]) + ";" : this.each((function() {
                  this.style.removeProperty(R(n))
                }));
              return this.each((function() {
                this.style.cssText += ";" + l
              }))
            },
            index: function(n) {
              return n ? this.indexOf($(n)[0]) : this.parent().children().indexOf(this[0])
            },
            hasClass: function(n) {
              return !!n && o.some.call(this, (function(n) {
                return this.test(Z(n))
              }), z(n))
            },
            addClass: function(n) {
              return n ? this.each((function(e) {
                if ("className" in this) {
                  t = [];
                  var i = Z(this);
                  X(this, n, e, i).split(/\s+/g).forEach((function(n) {
                    $(this).hasClass(n) || t.push(n)
                  }), this), t.length && Z(this, i + (i ? " " : "") + t.join(" "))
                }
              })) : this
            },
            removeClass: function(n) {
              return this.each((function(e) {
                if ("className" in this) {
                  if (void 0 === n) return Z(this, "");
                  t = Z(this), X(this, n, e, t).split(/\s+/g).forEach((function(n) {
                    t = t.replace(z(n), " ")
                  })), Z(this, t.trim())
                }
              }))
            },
            toggleClass: function(n, t) {
              return n ? this.each((function(e) {
                var i = $(this);
                X(this, n, e, Z(this)).split(/\s+/g).forEach((function(n) {
                  (void 0 === t ? !i.hasClass(n) : t) ? i.addClass(n): i.removeClass(n)
                }))
              })) : this
            },
            scrollTop: function(n) {
              if (this.length) {
                var t = "scrollTop" in this[0];
                return void 0 === n ? t ? this[0].scrollTop : this[0].pageYOffset : this.each(t ? function() {
                  this.scrollTop = n
                } : function() {
                  this.scrollTo(this.scrollX, n)
                })
              }
            },
            scrollLeft: function(n) {
              if (this.length) {
                var t = "scrollLeft" in this[0];
                return void 0 === n ? t ? this[0].scrollLeft : this[0].pageXOffset : this.each(t ? function() {
                  this.scrollLeft = n
                } : function() {
                  this.scrollTo(n, this.scrollY)
                })
              }
            },
            position: function() {
              if (this.length) {
                var n = this[0],
                  t = this.offsetParent(),
                  e = this.offset(),
                  i = y.test(t[0].nodeName) ? {
                    top: 0,
                    left: 0
                  } : t.offset();
                return e.top -= parseFloat($(n).css("margin-top")) || 0, e.left -= parseFloat($(n).css("margin-left")) || 0, i.top += parseFloat($(t[0]).css("border-top-width")) || 0, i.left += parseFloat($(t[0]).css("border-left-width")) || 0, {
                  top: e.top - i.top,
                  left: e.left - i.left
                }
              }
            },
            offsetParent: function() {
              return this.map((function() {
                for (var n = this.offsetParent || s.body; n && !y.test(n.nodeName) && "static" == $(n).css("position");) n = n.offsetParent;
                return n
              }))
            }
          }, $.fn.detach = $.fn.remove, ["width", "height"].forEach((function(n) {
            var t = n.replace(/./, (function(n) {
              return n[0].toUpperCase()
            }));
            $.fn[n] = function(e) {
              var i, o = this[0];
              return void 0 === e ? E(o) ? o["inner" + t] : C(o) ? o.documentElement["scroll" + t] : (i = this.offset()) && i[n] : this.each((function(t) {
                (o = $(this)).css(n, X(this, e, t, o[n]()))
              }))
            }
          })), ["after", "prepend", "before", "append"].forEach((function(n, t) {
            var e = t % 2;
            $.fn[n] = function() {
              var n, i, o = $.map(arguments, (function(t) {
                  var e = [];
                  return "array" == (n = k(t)) ? (t.forEach((function(n) {
                    return void 0 !== n.nodeType ? e.push(n) : $.zepto.isZ(n) ? e = e.concat(n.get()) : void(e = e.concat(D.fragment(n)))
                  })), e) : "object" == n || null == t ? t : D.fragment(t)
                })),
                r = this.length > 1;
              return o.length < 1 ? this : this.each((function(n, a) {
                i = e ? a : a.parentNode, a = 0 == t ? a.nextSibling : 1 == t ? a.firstChild : 2 == t ? a : null;
                var l = $.contains(s.documentElement, i);
                o.forEach((function(n) {
                  if (r) n = n.cloneNode(!0);
                  else if (!i) return $(n).remove();
                  i.insertBefore(n, a), l && W(n, (function(n) {
                    if (!(null == n.nodeName || "SCRIPT" !== n.nodeName.toUpperCase() || n.type && "text/javascript" !== n.type || n.src)) {
                      var t = n.ownerDocument ? n.ownerDocument.defaultView : window;
                      t.eval.call(t, n.innerHTML)
                    }
                  }))
                }))
              }))
            }, $.fn[e ? n + "To" : "insert" + (t ? "Before" : "After")] = function(t) {
              return $(t)[n](this), this
            }
          })), D.Z.prototype = H.prototype = $.fn, D.uniq = i, D.deserializeValue = P, $.zepto = D, $
        }();
        window.Zepto = Zepto, void 0 === window.$ && (window.$ = Zepto),
          function($) {
            var n = 1,
              t = Array.prototype.slice,
              e = $.isFunction,
              i = function(n) {
                return "string" == typeof n
              },
              o = {},
              r = {},
              a = "onfocusin" in window,
              l = {
                focus: "focusin",
                blur: "focusout"
              },
              s = {
                mouseenter: "mouseover",
                mouseleave: "mouseout"
              };

            function c(t) {
              return t._zid || (t._zid = n++)
            }

            function u(n, t, e, i) {
              if ((t = p(t)).ns) var r = (a = t.ns, new RegExp("(?:^| )" + a.replace(" ", " .* ?") + "(?: |$)"));
              var a;
              return (o[c(n)] || []).filter((function(n) {
                return n && (!t.e || n.e == t.e) && (!t.ns || r.test(n.ns)) && (!e || c(n.fn) === c(e)) && (!i || n.sel == i)
              }))
            }

            function p(n) {
              var t = ("" + n).split(".");
              return {
                e: t[0],
                ns: t.slice(1).sort().join(" ")
              }
            }

            function d(n, t) {
              return n.del && !a && n.e in l || !!t
            }

            function f(n) {
              return s[n] || a && l[n] || n
            }

            function h(n, t, e, i, r, a, l) {
              var u = c(n),
                h = o[u] || (o[u] = []);
              t.split(/\s/).forEach((function(t) {
                if ("ready" == t) return $(document).ready(e);
                var o = p(t);
                o.fn = e, o.sel = r, o.e in s && (e = function(n) {
                  var t = n.relatedTarget;
                  if (!t || t !== this && !$.contains(this, t)) return o.fn.apply(this, arguments)
                }), o.del = a;
                var c = a || e;
                o.proxy = function(t) {
                  if (!(t = J(t)).isImmediatePropagationStopped()) {
                    t.data = i;
                    var e = c.apply(n, null == t._args ? [t] : [t].concat(t._args));
                    return !1 === e && (t.preventDefault(), t.stopPropagation()), e
                  }
                }, o.i = h.length, h.push(o), "addEventListener" in n && n.addEventListener(f(o.e), o.proxy, d(o, l))
              }))
            }

            function y(n, t, e, i, r) {
              var a = c(n);
              (t || "").split(/\s/).forEach((function(t) {
                u(n, t, e, i).forEach((function(t) {
                  delete o[a][t.i], "removeEventListener" in n && n.removeEventListener(f(t.e), t.proxy, d(t, r))
                }))
              }))
            }
            r.click = r.mousedown = r.mouseup = r.mousemove = "MouseEvents", $.event = {
              add: h,
              remove: y
            }, $.proxy = function(n, o) {
              var r = 2 in arguments && t.call(arguments, 2);
              if (e(n)) {
                var a = function() {
                  return n.apply(o, r ? r.concat(t.call(arguments)) : arguments)
                };
                return a._zid = c(n), a
              }
              if (i(o)) return r ? (r.unshift(n[o], n), $.proxy.apply(null, r)) : $.proxy(n[o], n);
              throw new TypeError("expected function")
            }, $.fn.bind = function(n, t, e) {
              return this.on(n, t, e)
            }, $.fn.unbind = function(n, t) {
              return this.off(n, t)
            }, $.fn.one = function(n, t, e, i) {
              return this.on(n, t, e, i, 1)
            };
            var m = function() {
                return !0
              },
              g = function() {
                return !1
              },
              v = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
              M = {
                preventDefault: "isDefaultPrevented",
                stopImmediatePropagation: "isImmediatePropagationStopped",
                stopPropagation: "isPropagationStopped"
              };

            function J(n, t) {
              return !t && n.isDefaultPrevented || (t || (t = n), $.each(M, (function(e, i) {
                var o = t[e];
                n[e] = function() {
                  return this[i] = m, o && o.apply(t, arguments)
                }, n[i] = g
              })), n.timeStamp || (n.timeStamp = Date.now()), (void 0 !== t.defaultPrevented ? t.defaultPrevented : "returnValue" in t ? !1 === t.returnValue : t.getPreventDefault && t.getPreventDefault()) && (n.isDefaultPrevented = m)), n
            }

            function T(n) {
              var t, e = {
                originalEvent: n
              };
              for (t in n) v.test(t) || void 0 === n[t] || (e[t] = n[t]);
              return J(e, n)
            }
            $.fn.delegate = function(n, t, e) {
              return this.on(t, n, e)
            }, $.fn.undelegate = function(n, t, e) {
              return this.off(t, n, e)
            }, $.fn.live = function(n, t) {
              return $(document.body).delegate(this.selector, n, t), this
            }, $.fn.die = function(n, t) {
              return $(document.body).undelegate(this.selector, n, t), this
            }, $.fn.on = function(n, o, r, a, l) {
              var s, c, u = this;
              return n && !i(n) ? ($.each(n, (function(n, t) {
                u.on(n, o, r, t, l)
              })), u) : (i(o) || e(a) || !1 === a || (a = r, r = o, o = void 0), void 0 !== a && !1 !== r || (a = r, r = void 0), !1 === a && (a = g), u.each((function(e, i) {
                l && (s = function(n) {
                  return y(i, n.type, a), a.apply(this, arguments)
                }), o && (c = function(n) {
                  var e, r = $(n.target).closest(o, i).get(0);
                  if (r && r !== i) return e = $.extend(T(n), {
                    currentTarget: r,
                    liveFired: i
                  }), (s || a).apply(r, [e].concat(t.call(arguments, 1)))
                }), h(i, n, a, r, o, c || s)
              })))
            }, $.fn.off = function(n, t, o) {
              var r = this;
              return n && !i(n) ? ($.each(n, (function(n, e) {
                r.off(n, t, e)
              })), r) : (i(t) || e(o) || !1 === o || (o = t, t = void 0), !1 === o && (o = g), r.each((function() {
                y(this, n, o, t)
              })))
            }, $.fn.trigger = function(n, t) {
              return (n = i(n) || $.isPlainObject(n) ? $.Event(n) : J(n))._args = t, this.each((function() {
                n.type in l && "function" == typeof this[n.type] ? this[n.type]() : "dispatchEvent" in this ? this.dispatchEvent(n) : $(this).triggerHandler(n, t)
              }))
            }, $.fn.triggerHandler = function(n, t) {
              var e, o;
              return this.each((function(r, a) {
                (e = T(i(n) ? $.Event(n) : n))._args = t, e.target = a, $.each(u(a, n.type || n), (function(n, t) {
                  if (o = t.proxy(e), e.isImmediatePropagationStopped()) return !1
                }))
              })), o
            }, "focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach((function(n) {
              $.fn[n] = function(t) {
                return 0 in arguments ? this.bind(n, t) : this.trigger(n)
              }
            })), $.Event = function(n, t) {
              i(n) || (n = (t = n).type);
              var e = document.createEvent(r[n] || "Events"),
                o = !0;
              if (t)
                for (var a in t) "bubbles" == a ? o = !!t[a] : e[a] = t[a];
              return e.initEvent(n, o, !0), J(e)
            }
          }(Zepto),
          function($) {
            var n, t, e = +new Date,
              i = window.document,
              o = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
              r = /^(?:text|application)\/javascript/i,
              a = /^(?:text|application)\/xml/i,
              l = /^\s*$/,
              s = i.createElement("a");

            function c(n, t, e, o) {
              if (n.global) return function(n, t, e) {
                var i = $.Event(t);
                return $(n).trigger(i, e), !i.isDefaultPrevented()
              }(t || i, e, o)
            }

            function u(n, t) {
              var e = t.context;
              if (!1 === t.beforeSend.call(e, n, t) || !1 === c(t, e, "ajaxBeforeSend", [n, t])) return !1;
              c(t, e, "ajaxSend", [n, t])
            }

            function p(n, t, e, i) {
              var o = e.context;
              e.success.call(o, n, "success", t), i && i.resolveWith(o, [n, "success", t]), c(e, o, "ajaxSuccess", [t, e, n]), f("success", t, e)
            }

            function d(n, t, e, i, o) {
              var r = i.context;
              i.error.call(r, e, t, n), o && o.rejectWith(r, [e, t, n]), c(i, r, "ajaxError", [e, i, n || t]), f(t, e, i)
            }

            function f(n, t, e) {
              var i = e.context;
              e.complete.call(i, t, n), c(e, i, "ajaxComplete", [t, e]),
                function(n) {
                  n.global && !--$.active && c(n, null, "ajaxStop")
                }(e)
            }

            function h() {}

            function y(n, t) {
              return "" == t ? n : (n + "&" + t).replace(/[&?]{1,2}/, "?")
            }

            function m(n, t, e, i) {
              return $.isFunction(t) && (i = e, e = t, t = void 0), $.isFunction(e) || (i = e, e = void 0), {
                url: n,
                data: t,
                success: e,
                dataType: i
              }
            }
            s.href = window.location.href, $.active = 0, $.ajaxJSONP = function(n, t) {
              if (!("type" in n)) return $.ajax(n);
              var o, r, a = n.jsonpCallback,
                l = ($.isFunction(a) ? a() : a) || "Zepto" + e++,
                s = i.createElement("script"),
                c = window[l],
                f = function(n) {
                  $(s).triggerHandler("error", n || "abort")
                },
                h = {
                  abort: f
                };
              return t && t.promise(h), $(s).on("load error", (function(e, i) {
                clearTimeout(r), $(s).off().remove(), "error" != e.type && o ? p(o[0], h, n, t) : d(null, i || "error", h, n, t), window[l] = c, o && $.isFunction(c) && c(o[0]), c = o = void 0
              })), !1 === u(h, n) ? (f("abort"), h) : (window[l] = function() {
                o = arguments
              }, s.src = n.url.replace(/\?(.+)=\?/, "?$1=" + l), i.head.appendChild(s), n.timeout > 0 && (r = setTimeout((function() {
                f("timeout")
              }), n.timeout)), h)
            }, $.ajaxSettings = {
              type: "GET",
              beforeSend: h,
              success: h,
              error: h,
              complete: h,
              context: null,
              global: !0,
              xhr: function() {
                return new window.XMLHttpRequest
              },
              accepts: {
                script: "text/javascript, application/javascript, application/x-javascript",
                json: "application/json",
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain"
              },
              crossDomain: !1,
              timeout: 0,
              processData: !0,
              cache: !0,
              dataFilter: h
            }, $.ajax = function(e) {
              var o, f, m = $.extend({}, e || {}),
                g = $.Deferred && $.Deferred();
              for (n in $.ajaxSettings) void 0 === m[n] && (m[n] = $.ajaxSettings[n]);
              ! function(n) {
                n.global && 0 == $.active++ && c(n, null, "ajaxStart")
              }(m), m.crossDomain || ((o = i.createElement("a")).href = m.url, o.href = o.href, m.crossDomain = s.protocol + "//" + s.host != o.protocol + "//" + o.host), m.url || (m.url = window.location.toString()), (f = m.url.indexOf("#")) > -1 && (m.url = m.url.slice(0, f)),
                function(n) {
                  n.processData && n.data && "string" != $.type(n.data) && (n.data = $.param(n.data, n.traditional)), !n.data || n.type && "GET" != n.type.toUpperCase() && "jsonp" != n.dataType || (n.url = y(n.url, n.data), n.data = void 0)
                }(m);
              var v = m.dataType,
                M = /\?.+=\?/.test(m.url);
              if (M && (v = "jsonp"), !1 !== m.cache && (e && !0 === e.cache || "script" != v && "jsonp" != v) || (m.url = y(m.url, "_=" + Date.now())), "jsonp" == v) return M || (m.url = y(m.url, m.jsonp ? m.jsonp + "=?" : !1 === m.jsonp ? "" : "callback=?")), $.ajaxJSONP(m, g);
              var J, T = m.accepts[v],
                U = {},
                b = function(n, t) {
                  U[n.toLowerCase()] = [n, t]
                },
                w = /^([\w-]+:)\/\//.test(m.url) ? RegExp.$1 : window.location.protocol,
                D = m.xhr(),
                x = D.setRequestHeader;
              if (g && g.promise(D), m.crossDomain || b("X-Requested-With", "XMLHttpRequest"), b("Accept", T || "*/*"), (T = m.mimeType || T) && (T.indexOf(",") > -1 && (T = T.split(",", 2)[0]), D.overrideMimeType && D.overrideMimeType(T)), (m.contentType || !1 !== m.contentType && m.data && "GET" != m.type.toUpperCase()) && b("Content-Type", m.contentType || "application/x-www-form-urlencoded"), m.headers)
                for (t in m.headers) b(t, m.headers[t]);
              if (D.setRequestHeader = b, D.onreadystatechange = function() {
                  if (4 == D.readyState) {
                    D.onreadystatechange = h, clearTimeout(J);
                    var n, t = !1;
                    if (D.status >= 200 && D.status < 300 || 304 == D.status || 0 == D.status && "file:" == w) {
                      if (v = v || function(n) {
                          return n && (n = n.split(";", 2)[0]), n && ("text/html" == n ? "html" : "application/json" == n ? "json" : r.test(n) ? "script" : a.test(n) && "xml") || "text"
                        }(m.mimeType || D.getResponseHeader("content-type")), "arraybuffer" == D.responseType || "blob" == D.responseType) n = D.response;
                      else {
                        n = D.responseText;
                        try {
                          n = function(n, t, e) {
                            if (e.dataFilter == h) return n;
                            var i = e.context;
                            return e.dataFilter.call(i, n, t)
                          }(n, v, m), "script" == v ? (0, eval)(n) : "xml" == v ? n = D.responseXML : "json" == v && (n = l.test(n) ? null : $.parseJSON(n))
                        } catch (n) {
                          t = n
                        }
                        if (t) return d(t, "parsererror", D, m, g)
                      }
                      p(n, D, m, g)
                    } else d(D.statusText || null, D.status ? "error" : "abort", D, m, g)
                  }
                }, !1 === u(D, m)) return D.abort(), d(null, "abort", D, m, g), D;
              var N = !("async" in m) || m.async;
              if (D.open(m.type, m.url, N, m.username, m.password), m.xhrFields)
                for (t in m.xhrFields) D[t] = m.xhrFields[t];
              for (t in U) x.apply(D, U[t]);
              return m.timeout > 0 && (J = setTimeout((function() {
                D.onreadystatechange = h, D.abort(), d(null, "timeout", D, m, g)
              }), m.timeout)), D.send(m.data ? m.data : null), D
            }, $.get = function() {
              return $.ajax(m.apply(null, arguments))
            }, $.post = function() {
              var n = m.apply(null, arguments);
              return n.type = "POST", $.ajax(n)
            }, $.getJSON = function() {
              var n = m.apply(null, arguments);
              return n.dataType = "json", $.ajax(n)
            }, $.fn.load = function(n, t, e) {
              if (!this.length) return this;
              var i, r = this,
                a = n.split(/\s/),
                l = m(n, t, e),
                s = l.success;
              return a.length > 1 && (l.url = a[0], i = a[1]), l.success = function(n) {
                r.html(i ? $("<div>").html(n.replace(o, "")).find(i) : n), s && s.apply(r, arguments)
              }, $.ajax(l), this
            };
            var g = encodeURIComponent;
            $.param = function(n, t) {
              var e = [];
              return e.add = function(n, t) {
                  $.isFunction(t) && (t = t()), null == t && (t = ""), this.push(g(n) + "=" + g(t))
                },
                function n(t, e, i, o) {
                  var r, a = $.isArray(e),
                    l = $.isPlainObject(e);
                  $.each(e, (function(e, s) {
                    r = $.type(s), o && (e = i ? o : o + "[" + (l || "object" == r || "array" == r ? e : "") + "]"), !o && a ? t.add(s.name, s.value) : "array" == r || !i && "object" == r ? n(t, s, i, e) : t.add(e, s)
                  }))
                }(e, n, t), e.join("&").replace(/%20/g, "+")
            }
          }(Zepto),
          function($) {
            $.fn.serializeArray = function() {
              var n, t, e = [],
                i = function(t) {
                  if (t.forEach) return t.forEach(i);
                  e.push({
                    name: n,
                    value: t
                  })
                };
              return this[0] && $.each(this[0].elements, (function(e, o) {
                t = o.type, (n = o.name) && "fieldset" != o.nodeName.toLowerCase() && !o.disabled && "submit" != t && "reset" != t && "button" != t && "file" != t && ("radio" != t && "checkbox" != t || o.checked) && i($(o).val())
              })), e
            }, $.fn.serialize = function() {
              var n = [];
              return this.serializeArray().forEach((function(t) {
                n.push(encodeURIComponent(t.name) + "=" + encodeURIComponent(t.value))
              })), n.join("&")
            }, $.fn.submit = function(n) {
              if (0 in arguments) this.bind("submit", n);
              else if (this.length) {
                var t = $.Event("submit");
                this.eq(0).trigger(t), t.isDefaultPrevented() || this.get(0).submit()
              }
              return this
            }
          }(Zepto),
          function() {
            try {
              getComputedStyle(void 0)
            } catch (t) {
              var n = getComputedStyle;
              window.getComputedStyle = function(t, e) {
                try {
                  return n(t, e)
                } catch (n) {
                  return null
                }
              }
            }
          }();
        var $ = window.Zepto || window.jQuery || window.$,
          l = window.screen.width,
          s = l <= 600,
          c = s ? 10 : 12,
          u = s ? 9 : 12,
          p = "";
        try {
          p = (window.VIP_URLS || VIP解析 || "").trim()
        } catch (n) {}
        搜索源 = window.搜索源 || 搜索源 || "";
        var d = x(t(w(atob("QzIlc0M5JUJDJTVBJTc5JTJFJUM5JUJDJXMt"))), 4),
          f = !s || "true" === localStorage.getItem("oo.playInPage");
        搜索源 = I(搜索源).map(n => {
          var t = V(n);
          return {
            url: t.url,
            name: t.name
          }
        });
        var h = x(t(w(atob("RTAlRTAlNDIlNDIlNjU0MiVGOCU3QSU3RSU1OSUxQSU2RSU0MiU5QSVGQiVGRSU0MiU1RDMlNDkwNTBxNDIlMDglMkMlNDIlbXVtRDclbTA3NDIlMDglMkMlNDIlcGkwNjQyJTA4JTJDJTQyJXFreHowODQyJTA4JTJDJTQyJXR0eHowNzQyJTA4JTJDJTQyJXdzbHkwNTJCMyU0MiUwOCUyQyU0MiV6MnV1MDUyQzMlNDIlMDglMkMlNDIlRDclc3lveTA3Mjk0MiUwOCUyQyU0MiV4eWhzeTA1NDIlNDIlbHh4dHdFMyUzM25DNyUyQjcld3BxajJnc3EzQ3l2cEE4OSVDOSUyRSVFMCVFMCU0MiU0MiU1RDMlMkEzJTQyJThCJTBCJTZFJTM5JUI4JThFJTQyJTlBJUZCJUZFJTQyJTVEMyU0OTA3MHE0MiUwOCUyQyU0MiVtdW1ENyVtMDUwcTQyJTA4JTJDJTQyJXFreHowOTBxNDIlMDglMkMlNDIldHR4ejA5MHE0MiUwOCUyQyU0MiV3c2x5MDUyNzBxNDIlMDglMkMlNDIlejJ1dTA2MjUwcTQyJTA4JTJDJTQyJUQ3JXN5b3kwNjI2MHE0MiU0MiVseHh0d0UzJTMzdHQyZW13cTJnZzN0ZXZ3aTNDeXZwQTg5JUM5JTJFJUUwJUUwJTQyJTQyJTVBMyUyNTQyJTE4JTRCJTZFJTRCJTU4JTVFJTQyJTlBJUZCJUZFJTQyJTVEMyU0OTA3MHE0MiUwOCUyQyU0MiVtdW1ENyVtMDU0MiUwOCUyQyU0MiVxa3h6MDg0MiUwOCUyQyU0MiV0dHh6MDcwcTQyJTA4JTJDJTQyJXoydXUwNzQyJTA4JTJDJTQyJUQ3JXN5b3kwNjI1MHE0MiU0MiVseHh0d0UzJTMzZkQ3JTJoRDclZmxyMmdzcTNDeXZwQTg5JUM5JTJFJUUwJUUwJTQyJTQyJTU5Mjk0MiU1QiUxQiU1RSU0OCUwQSU2RSU0MiU5QSVGQiVGRSU0MiU1RDMlNDkwNDJBMyU0MiUwOCUyQyU0MiVtdW1ENyVtMDUyQzMlMHE0MiUwOCUyQyU0MiVxa3h6MDcyQzMlMHE0MiUwOCUyQyU0MiV0dHh6MDgyQzMlMHE0MiUwOCUyQyU0MiV3c2x5MDUwcTQyJTA4JTJDJTQyJXoydXUwNTI5MHE0MiUwOCUyQyU0MiVENyVzeW95MDYwcTQyJTQyJWx4eHR3RTMlMzNzb25DNyUyZ2czQ3l2cEE4OSVDOSUyRSVFMCVFMCU0MiU0MiU1OTI1NDIlNTglQjglOEUlRDglMzklOEUlNDIlOUElRkIlRkUlNDIlNUQzJTQ5MDUwcTQyJTA4JTJDJTQyJW11bUQ3JW0wNTQyJTA4JTJDJTQyJXFreHowODQyJTA4JTJDJTQyJXR0eHowNzBxNDIlMDglMkMlNDIlejJ1dTA4NDIlMDglMkMlNDIlRDclc3lveTA2MjUwcTQyJTQyJWx4eHR3RTMlMzN3dDJBMyU0QzMlNG5DNyUyZ3NxM0N5dnBBODklQzklMkUlRTAlRTAlNDIlNDIlNTkyNTQyJUQ4JUQ5JThFJTdBJTFBJThFJTQyJTlBJUZCJUZFJTQyJTVEMyU0OTA1MHE0MiUwOCUyQyU0MiVtdW1ENyVtMDU0MiUwOCUyQyU0MiVxa3h6MDgwcTQyJTA4JTJDJTQyJXR0eHowNzBxNDIlMDglMkMlNDIlejJ1dTA4NDIlMDglMkMlNDIlRDclc3lveTA2MjUwcTQyJTQyJWx4eHR3RTMlMzN6Mmdlcn5sbXdzcmsyZ3IzejJ0bHRDeXZwQTg5JUM5JTJFJUUwJUUwJTQyJTQyJTU4MjY0MiUyOCVBOCU4RSVBQiVGOCU1RSU0MiU5QSVGQiVGRSU0MiU1RDMlNDkwNTBxNDIlMDglMkMlNDIlbXVtRDclbTA1NDIlMDglMkMlNDIlcWt4ejA4MHE0MiUwOCUyQyU0MiV0dHh6MDYwcTQyJTA4JTJDJTQyJXoydXUwODQyJTA4JTJDJTQyJUQ3JXN5b3kwNjI2MHE0MiU0MiVseHh0d0UzJTMzbkM3JTJCMyVnRDclaDJnc3EzQ3l2cEE4OSVDOSUyRSVFMCVFMCU0MiU0MiU1NzJBMyU0MiU2QiVCOSU2RSU2QiVFOCU4RSU0MiU5QSVGQiVGRSU0MiU1RDMlNDkwNDI1MHE0MiUwOCUyQyU0MiVtdW1ENyVtMDU0MiUwOCUyQyU0MiVxa3h6MDkwcTQyJTA4JTJDJTQyJXdzbHkwNTQyJTA4JTJDJTQyJXoydXUwNTI5MHE0MiUwOCUyQyU0MiVENyVzeW95MDkwcTQyJTQyJWx4eHR3RTMlMzNCNyVCNyVCNyUyZ29xc3oyem10M2V0bTJ0bHRDeXZwQTg5JUM5JTJFJUUwJUUwJTQyJTQyJTU3Mjk0MiUyOCVFOSU2RSU2OCVBOCU4RSU0MiU5QSVGQiVGRSU0MiU1RDMlNDkwNTBxNDIlMDglMkMlNDIlbXVtRDclbTA1NDIlMDglMkMlNDIlcWt4ejA4MHE0MiUwOCUyQyU0MiV0dHh6MDcwcTQyJTA4JTJDJTQyJXoydXUwODQyJTA4JTJDJTQyJUQ3JXN5b3kwNDI5MHE0MiU0MiVseHh0d0UzJTMzbkM3JTJENyVtcmtDNyVtZXJrZmVzMmdyM3ptdDJ0bHRDeXZwQTg5JUM5JTJFJUUwJUUwJTQyJTQyJTU3MjY0MiVDQSVDOSU2RSUxQSUzOSU4RSU0MiU5QSVGQiVGRSU0MiU1RDMlNDkwNTBxNDIlMDglMkMlNDIlbXVtRDclbTA2NDIlMDglMkMlNDIlcGkwNTBxNDIlMDglMkMlNDIleHloc3kwNzQyJTA4JTJDJTQyJXoydXUwNjI2NDIlMDglMkMlNDIlRDclc3lveTA4NDIlNDIlbHh4dHdFMyUzM2V0bTJCMyVDMyV3RDclMmdyM0N5dnBBODklQzklMkUlRTAlRTAlNDIlNDIlNTYyNzQyJUI4JTY5JTZFJURCJUJBJTdFJTQyJTlBJUZCJUZFJTQyJTVEMyU0OTA1MHE0MiUwOCUyQyU0MiVxa3h6MDg0MiUwOCUyQyU0MiV0dHh6MDc0MiUwOCUyQyU0MiV6MnV1MDYyNjBxNDIlMDglMkMlNDIlRDclc3lveTA2MjU0MiU0MiVseHh0d0UzJTMzQjclQjclQjclMmxpbXFtbkM3JTJnc3EzbkM3JTNldG0zbkM3JTJ0bHRDeXZwQTg5JUM5JTJFJUUwJUUwJTQyJTQyJTU1MkQzJTQyJTg4JUU4JTdFJTY4JUY4JTVFJTQyJTlBJUZCJUZFJTQyJTVEMyU0OTA0MkEzJTQyJTA4JTJDJTQyJW11bUQ3JW0wNTBxNDIlMDglMkMlNDIlcWt4ejA3NDIlMDglMkMlNDIldHR4ejA3NDIlMDglMkMlNDIlejJ1dTA2MjY0MiUwOCUyQyU0MiVENyVzeW95MDYyNTQyJTQyJWx4eHR3RTMlMzNCNyVCNyVCNyUycUQ3JUM3JW1yMnhzdDNuQzclM2V0bTNDeXZwQTg5JUM5JTJFJUUwJUUwJTQyJTQyJTU1Mjc0MiU1QSVGQiU0RSU3QiVGOSU3RSU0MiU5QSVGQiVGRSU0MiVxa3h6MDgwcTQyJTA4JTJDJTQyJW11bUQ3JW0wNjBxNDIlMDglMkMlNDIlejJ1dTA2Mjc0MiUwOCUyQyU0MiVENyVzeW95MDc0MiU0MiVseHh0d0UzJTMzbm1pQzclbTI0QjMlNUMzJTU1MmdnM25DNyUydGx0Q3l2cEE4OSVDOSUyRSVFMCVFMCU0MiU0MiU1NTI3NDIlNjklRDklOUUlNDklQjklN0UlNDIlOUElRkIlRkUlNDIlNUQzJTQ5MDUwcTQyJTA4JTJDJTQyJW11bUQ3JW0wNTBxNDIlMDglMkMlNDIlcWt4ejA3MHE0MiUwOCUyQyU0MiV0dHh6MDYwcTQyJTA4JTJDJTQyJXoydXUwNjI2MHE0MiUwOCUyQyU0MiVENyVzeW95MDYyNTQyJTQyJWx4eHR3RTMlMzNCNyVCNyVCNyUyckM3JWpwejJnc3EzQ3l2cEE4OSVDOSUyRSVFMCVFMCU0MiU0MiU1NDJCMyU0MiUwOSU3OCU1RSVEOCUzQiU2RSU0MiU5QSVGQiVGRSU0MiU1RDMlNDkwNTBxNDIlMDglMkMlNDIlbXVtRDclbTA2MjkwcTQyJTQyJTA4JTJDJTQyJXFreHowNDI5MHE0MiUwOCUyQyU0MiV0dHh6MDUwcTQyJTA4JTJDJTQyJXdzbHkwNTI2MHE0MiUwOCUyQyU0MiV6MnV1MDg0MiUwOCUyQyU0MiVENyVzeW95MDQyOTBxNDIlNDIlbHh4dHdFMyUzM25taUM3JW0yN0MzJTRvMmdzcTNDeXZwQTg5JUM5JTJFJUUwJUUwJTQyJTQyJTU0NDIlNTglQkIlNEUlMkElRDklNkUlNDIlOUElRkIlRkUlNDIlNUQzJTQ5MDUwcTQyJTA4JTJDJTQyJXFreHowNjBxNDIlMDglMkMlNDIldHR4ejA3MHE0MiUwOCUyQyU0MiV6MnV1MDg0MiU0MiVseHh0d0UzJTMzZ3VENyVtd2xpcnhlcmsyZ3Izem1oaXMydGx0Q3l2cEE4OSVDOSUyRSVFMCVFMCU0MiU0MiVEMyUyQjMlNDIlMUElN0IlNUUlMzklRjklNkUlNDIlOUElRkIlRkUlNDIlNUQzJTQ5MDUyNTBxNDIlMDglMkMlNDIlbXVtRDclbTA0MjYwcTQyJTA4JTJDJTQyJXFreHowNzQyJTA4JTJDJTQyJXdzbHkwNTI2NDIlMDglMkMlNDIlejJ1dTA2MjY0MiUwOCUyQyU0MiVENyVzeW95MDYwcTQyJTQyJWx4eHR3RTMlMzNCNyVCNyVCNyUydHBlRDclcTd5QzMlMmdyM25taUM3JW0ydGx0Q3l2cEE4OSVDOSUyRSVFMCVFMCU0MiU0MiVCMyUyNTQyJURBJTRBJTVFJTBCJTY4JTVFJTQyJTlBJUZCJUZFJTQyJXR0eHowNzBxNDIlMDglMkMlNDIlejJ1dTA4MjUwcTQyJTQyJWx4eHR3RTMlMzNldG0yeHpEMyU2NDJnc3EzbkM3JTNDeXZwQTg5JUM5JTJFJUUwJUUwJTQyJTQyJUIzJTQyJUQ4JUQ4JThFJTA5JTlCJTRFJTQyJTlBJUZCJUZFJTQyJTVEMyU0OTA0MkEzJTBxNDIlMDglMkMlNDIlbXVtRDclbTA0MjkwcTQyJTA4JTJDJTQyJXFreHowNjI5MHE0MiUwOCUyQyU0MiV3c2x5MDUyNjQyJTA4JTJDJTQyJXoydXUwNTJCMyUwcTBCNyU0MiUwOCUyQyU0MiVENyVzeW95MDQyOTBxNDIlNDIlbHh4dHdFMyUzM0I3JUI3JUI3JTI1QjMlNUIzJUQ3JXlyMmdzcTNuQzclM3hENyUydGx0Q3l2cEE4OSVDOSUyRSVFMCVFMCU0MiU0MiVBMyUyOTQyJUZBJTRCJTdFJUQ5JUE4JThFJTQyJTlBJUZCJUZFJTQyJTVEMyU0OTA1NDIlMDglMkMlNDIlbXVtRDclbTA2NDIlMDglMkMlNDIlcWt4ejA0MjkwcTQyJTA4JTJDJTQyJXoydXUwNzQyJTQyJWx4eHR3RTMlMzNubWlDNyVtMmZxQTMlbWsyZ3IzQ3l2cEE4OSVDOSUyRSVFMCVFMCU0MiU0MiU3Mjk0MiUxOCUxOSU4RSU5QiUxOSU4RSU0MiU5QSVGQiVGRSU0MiVtdW1ENyVtMDUwcTQyJTA4JTJDJTQyJXdzbHkwNTBxNDIlMDglMkMlNDIlejJ1dTA1Mjk0MiU0MiVseHh0d0UzJTMzbkM3JTJoeTYyZ2czQ3l2cEE4OSVDOSUyRSVFMCVFMCU0MiU0MiU1OTQyJTRCJUVCJThFJTY4JTBBJTdFJTQyJTlBJUZCJUZFJTQyJTVEMyU0OTA1NDIlMDglMkMlNDIlbXVtRDclbTA4NDIlMDglMkMlNDIlcGkwNzQyJTA4JTJDJTQyJXFreHowNTQyJTA4JTJDJTQyJXR0eHowNjQyJTA4JTJDJTQyJXdzbHkwNTQyJTA4JTJDJTQyJXoydXUwNjBxNDIlMDglMkMlNDIlRDclc3lveTA3MHE0MiU0MiVseHh0d0UzJTMzfjUycTVEMyU0QjMlMmdyM0NuQzclQUUwJUUwJQ"))), 4),
          y = 1,
          m = new RegExp(h.match(/[\/\.]\w+\.\w{2,3}\//g).join("|").replace(/(\.|\/)/g, "\\$1"));
        0 === (p = I(p).filter(n => n.includes("http"))).length && (p = I(h));
        var g = (p = p.filter(n => !s || !/jx\.wslmf\.com/.test(n))).filter(n => n.includes("✔")),
          v = toUrlRegex(p),
          M = g.length > 0 ? toUrlRegex(g) : /$^/,
          J = n.match(/[\.\/](\w+)\.(\w+)\//);
        J = J ? J[1] : "oo.movie", p = p.map((n, t) => {
          var e = V(n.replace(/=http.+/g, "=").replace(/\s*✔.*/g, ""));
          if (e.weight = 0, e.name.includes("￥")) {
            var i = e.name.split(/\s*￥\s*/);
            if (1 === i.length ? i = i[0] : (e.name = i[0].replace(/^\s*[\d\.]+\s*/, ""), i = i[1]), i.includes(J)) {
              var o = i.split(/\s*\|\s*/);
              e.weight += .05 * (o.length + 1), o.forEach(n => {
                if (n.includes(J)) {
                  s && n.includes(",m") && (e.isM = !0);
                  var t = n.match(/,([\d\.]+)/);
                  t && (e.weight += Number(t[1]))
                }
              }), e.url.includes("m1907") && (e.weight = .75 * e.weight)
            }
          } else e.weight = -1;
          return y = Math.max(y, e.weight), e
        });
        var T, U = n => n.isM ? n.weight + 100 : n.weight;
        if (p.sort((n, t) => U(t) - U(n)), s && (y *= 1.2), Is(v) || Is(/oo\.movie&/)) Is(/=http/) && ($("title").html(r), N((function() {
          $("title").html(r)
        }))), (Is(/=http/) && Is(M) || Is(/oo\.movie&/)) && function(n = "body") {
          addStyle(`\n${n} > video {\n  position: fixed !important;\n  top: 0px !important;\n  left: 0px !important;\n  min-width: 0px !important;\n  min-height: 0px !important;\n  max-width: 99.99% !important;\n  max-height: 99.99% !important;\n  margin: 0px !important;\n  visibility: visible !important;\n  border-width: 0px !important;\n  background: black !important;\n  z-index: 2147483647 !important;\n  width: 100% !important;\n  height: 100% !important;\n}\n\n.oo.is-fail {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  background-color: #000;\n}\n\n.oo.is-fail .tip {\n  text-align: center;\n  padding: 1em;\n  color: white;\n}\n    `), N((function() {
            var t, e = !0,
              i = !1,
              o = !1,
              a = setInterval((function() {
                if (!o) {
                  o = !0;
                  var l = $("iframe");
                  if (0 !== l.length) {
                    for (var s; 0 === (t = l.contents().find("video")).length && (s = l.contents().find("iframe")).length > 0;) l = s;
                    (t.length || $("video").length) > 0 ? (clearInterval(a), e && (e = !0, $(n).addClass("oo").append(t.attr("src") ? t : $("video")))) : i && clearInterval(a), o = !1, $("title").html() !== r && $("title").html(r)
                  } else $("video").length > 0 && (clearInterval(a), $(n).addClass("oo").append($("video")))
                }
              }), 250);
            setTimeout((function() {
              i = !0
            }), 13e3)
          }))
        }();
        else if (Is(/search\.douban\.com\/movie\//)) addStyle(`\n#dale_movie_subject_search_bottom,\n#dale_movie_subject_search_top_right,\n#dale_movie_subject_top_right,\n#dale_movie_subject_bottom_super_banner,\n#dale_movie_subject_middle_right {${PurifyStyle}}\n\n.oo-sources {\n  padding-left: 1em;\n}\n\n.oo-sources a {\n  display: inline-flex !important;\n  align-items: center;\n  border-radius: 4px;\n  font-size: 0.75rem;\n  height: 2em;\n  justify-content: center;\n  line-height: 1.5;\n  padding-left: 0.75em;\n  padding-right: 0.75em;\n  white-space: nowrap;\n  background-color: #effaf3;\n  color: #257942;\n  margin-top: 0.5em;\n  margin-right: 0.5em;\n}\n`), $("#icp").html(d), $(".gemzcp").each((function(n, t) {
          var e = $(".title", t).text();
          $(t).append(`<p class="oo-sources">\n${E(e)}\n</p>`)
        }));
        else if (Is(/m\.douban\.com\/search\/\?.*type=movie/)) addStyle(`\n#TalionNav,\n.search-results-modules-name {${PurifyStyle}}\n\n.search-module {\n  margin-top: 0;\n}\n\n.search-results img {\n  width: 80px;\n}\n\n.search-results {\n  padding-bottom: 10px;\n}\n\n.search-results li a {\n  display: flex;\n  align-items: center;\n}\n\n.search-results img {\n  height: 100%;\n  padding: 0;\n  border: 2px solid;\n  border-image: linear-gradient(to bottom, #2b68c4 0%,#cf2d6e 100%)1;\n}\n`), $("#more-search").append("    " + d), $(".subject-info").each((function(n, t) {
          insertSearchAddon($(".subject-title", t).text(), t, "append")
        })), $(".search-hd input").on("keyup", (function(n) {
          13 === n.keyCode && (n.preventDefault(), location.href = "/search/?query=" + n.target.value + "&type=movie")
        })), $(".search-hd .button-search").attr("id", d), $(".search-hd .button-search").on("click", (function(n) {
          n.preventDefault();
          var t = $(".search-hd input").val();
          location.href = "/search/?query=" + t + "&type=movie"
        }));
        else if (Is(/movie\.douban\.com\/subject\//)) {
          addStyle(`\n#dale_movie_subject_search_bottom,\n#dale_movie_subject_search_top_right,\n#dale_movie_subject_top_right,\n#dale_movie_subject_bottom_super_banner,\n#dale_movie_subject_middle_right {${PurifyStyle}}\n`), $("#icp").html(d);
          var b = Q($("title").text().replace("(豆瓣)", "").trim());
          $("#info").append(`<div>\n<span class="pl">在线观看：</span>\n<span>\n${搜索源.map((function(n){return"<span><a "+(s?"":'target="_blank" ')+'href="'+C(n.url,b)+'">'+n.name+"</a>"})).join(" / </span>")}\n</span></span></div>\n`)
        } else if (Is(/m\.douban\.com\/movie\/subject\//)) addStyle(`\n.score-write,\na[href*='to_app']:not(.sub-honor):not(.sub-cover),\na[href*='doubanapp'],\ndiv[id*='BAIDU'],\ndiv[id*='google'],\nsection + .center,\n.bottom_ad_download,\n.sub-vendor,\n.to_pc,\n.TalionNav-static,\n.sub-detail .mark-movie,\n.sub-detail .mark-tv,\n.subject-banner,\n.bottom_ad_download,\n.cover-count,\n#google_esf,\n.adsbygoogle,\n.Advertisement {${PurifyStyle}}\n\n.sub-info .sub-cover {\n  display: block !important;\n}\n\n.TalionNav-primary {\n  position: relative !important;\n}\n\n.subject-comments,\n.subject-reviews {\n  margin-bottom: 0 !important;\n}\n\n.TalionNav .TalionNav-primary .search-box {\n  width: 230px;\n  flex: 230px 0 0;\n  animation: none;\n}\n\n.sub-original-title {\n  padding: 0.25em 0;\n}\n\n._V_sign {\n  font-size: 0.85em;\n  opacity: 0.15;\n  text-align: center;\n  padding-bottom: 1em;\n}\n\n._V_source, .sub-score + .sub-score {\n  margin-top: 1.5em !important;\n  color: #fff;\n}\n\n._V_source .sub-score .sub-content {\n  display: block;\n}\n\n._V_source .sub-score a {\n  padding: 0.25em 0.5em;\n  line-height: 1.5;\n  margin: 0 0.15em;\n  border: 1px solid rgba(255,255,255,0.2);\n  font-size: 1.05em;\n  font-weight: bold;\n  letter-spacing: 1px;\n  margin-top: 0.5em;\n  display: inline-block;\n  color: #ffe8cc;\n  background: rgba(239, 238, 238, 0.05);\n  border-radius: 4px;\n}\n\n#TalionNav {\n  display: none;\n}\n\n#TalionNav .logo {\n  background: none;\n  font-size: 1em;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n  color: #dee2e6;\n}\n\n.search-box:not(.on-search) {\n  opacity: 0.7;\n}\n\n#channel_tags {\n  margin-bottom: 10px;\n}\n\n.subject-header-wrap .sub-detail {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n}\n\n#channel_tags {\n  margin-top: 10px;\n}\n\ninput[type="search"]::-webkit-search-decoration,\ninput[type="search"]::-webkit-search-cancel-button,\ninput[type="search"]::-webkit-search-results-button,\ninput[type="search"]::-webkit-search-results-decoration {\n  -webkit-appearance:none;\n}\n`), N((function() {
          $(".movie-reviews .show-all").after(`<div class="_V_sign"><a href="https://gitee.com/ecruos/oo">豆瓣·净化 ${d}</a></div>`), $("section + .center").each((function(n, t) {
            $(t).remove()
          })), $(".subject-header-wrap").after($("#TalionNav")), $("#TalionNav").css("display", "block"), $("#TalionNav .logo").html(d).attr("href", "https://movie.douban.com/tag/#/"), $(".search-box").remove(), $(".TalionNav-primary .logo").after('<div class="search-box"><input class="search-input" type="search" placeholder="搜索"></div>'), $(".search-input").on("focus", (function() {
            $(this).parent().addClass("on-search")
          })).on("blur", (function() {
            $(this).parent().removeClass("on-search")
          })), $(".search-input").on("keyup", (function(n) {
            13 === n.keyCode && (n.preventDefault(), location.href = "/search/?query=" + n.target.value + "&type=movie")
          }));
          var n = Q($(".sub-title").text().trim());
          0 === $("._V_source").length && $(".subject-header-wrap").append(`<div class="_V_source subject-mark">\n\n<div class="sub-score">\n  <div class="sub-trademark">\n  在线观看\n  </div>\n  <div class="sub-content">\n${E(n,!1)}\n  </div>\n</div>\n\n</div>`), setTimeout((function() {
            $(".subject-intro .bd p").click(), $(".sub-cover").attr("href", "#"), $("#subject-honor-root a").attr("href", "#")
          }), 1e3);
          var t = 0,
            e = setInterval((function() {
              $("body > ins, body > iframe, .adsbygoogle").remove(), t++ > 5 && clearInterval(e)
            }), 500);
          ! function n() {
            var t = $("#subject-header-container").attr("style");
            if (t) {
              var e = t.match(/:\s*([^;]+);?/)[1],
                i = e.replace(")", ", 0)");
              try {
                addStyle(`\n.sub-cover::before {\n  background: -webkit-linear-gradient(bottom, ${e} 0%, ${i} 15%), -webkit-linear-gradient(right, ${e} 0%, ${i} 15%),-webkit-linear-gradient(top, ${e} 0%, ${i} 15%), -webkit-linear-gradient(left, ${e} 0%, ${i} 15%);\n  content: "";\n  bottom: 0;\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  width: 102px;\n  height: 142px;\n  border-radius: 4px;\n}\n`)
              } catch (n) {
                console.error("syncCoverColor:", n)
              }
            } else setTimeout((function() {
              n()
            }), 100)
          }()
        }));
        else {
          if (Is(/m\.tv\.sohu\.com\/phone_play_film.+vid=/)) return location.href = n.replace("phone_play_film", `v${n.match(/vid=(\d+)/)[1]}.shtml`);
          if (s && Is(/movie\.douban\.com\/tag\/#/)) {
            addStyle(k(`\n.category {\n  width: 100%;\n  white-space: nowrap;\n  overflow-x: auto;\n}\n\n.tags {\n  margin-bottom: 1em;\n}\n\n.checkbox__input {\n  vertical-align: text-top;\n}\n\n.tag-nav {\n  margin: 0 auto;\n  font-size: 12px;\n}\n\n.tag-nav .tabs, .tag-nav .check {\n  display: flex;\n  justify-content: space-around;\n}\n\n.tag-nav .tabs a {\n  padding: 7.5px 5px 5px;\n}\n\n.tabs a:not(.tab-checked) {\n  border: 1px solid #dfdfdf;\n}\n\n.tabs .tab-checked {\n  border: 1px solid #258dcd!important;\n}\n\n.tab-checked:after {\n  display: none;\n}\n\n.checkbox, .range {\n  margin-right: 5px;\n}\n\n.check {\n  float: none;\n  margin-top: 5px;\n}\n\n.list-wp, .item .cover-wp {\n  overflow: unset;\n}\n\na img {\n  padding: 2px;\n  border-radius: 5px;\n  background: linear-gradient(to bottom, #2b68c4 0%,#cf2d6e 100%);\n}\n\na.item {\n  width: ${parseInt(100/3)}%;\n  text-align: center;\n}\n\na.item p {\n  padding-right: 0;\n}\n\na.item .cover-wp {\n  height: auto;\n  padding: 0 0.5em;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\na.item .cover-wp:after, .poster:after {\n  display: none;\n}\n\na.item .pic img {\n  width: 100%;\n  height: ${parseInt(4*l/3/3)}px;\n  max-width: 150px;\n  object-fit: cover;\n}\n\n.tag-nav .range-dropdown {\n  left: 0 !important;\n  width: auto !important;\n  right: 0 !important;\n  top: -4em !important;\n}\n\n.more {\n  margin: 0 1em 0.5em;\n}\n\n`, ".oo") + `\nbody > *:not(.oo) {${PurifyStyle}}\n\n#app .article, .article.oo {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  padding: 10px 6px;\n  transition: all 0.8s;\n}\n\n.category::-webkit-scrollbar {\n  width: 1px;\n  height: 1px;\n  background-color: rgba(223, 223, 223, 0.25);\n}\n\n.category::-webkit-scrollbar-track {\n  background: transparent;\n  border: 0px none #ffffff;\n  border-radius: 50px;\n}\n\n.category::-webkit-scrollbar-thumb {\n  -webkit-box-shadow: inset 0 0 2.5px rgba(0, 0, 0, 0.1);\n  box-shadow: inset 0 0 2.5px rgba(0, 0, 0, 0.1);\n  border-radius: 2.5px;\n  background-color: rgba(223, 223, 223, 0.25);\n  opacity: 0.7;\n  transition: opacity ease-in-out 200ms;\n}\n\n.category::-webkit-scrollbar-thumb:hover {\n  opacity: 1;\n  background-color: rgba(223, 223, 223, 0.25);\n}\n\n.oo-search {\n  position: relative;\n  display: flex;\n  margin-bottom: 5px;\n}\n\n.oo-search .inp {\n  height: 34px;\n  text-align: center;\n  cursor: text;\n  width: 90%;\n}\n\n.oo-search .inp input {\n  background: #fff;\n  width: 96%;\n  margin: 0;\n  text-align: left;\n  height: 30px;\n  padding-left: 10px;\n  outline: none;\n}\n\n.oo-search input {\n  -webkit-appearance: none;\n  border: none;\n  background: transparent;\n}\n\n.oo-search .inp-btn {\n  position: relative;\n  width: 37px;\n  height: 34px;\n}\n\n.oo-search .inp-btn input {\n  width: 100%;\n  height: 100%;\n  font-size: 0;\n  padding: 35px 0 0 0;\n  overflow: hidden;\n  color: transparent;\n  cursor: pointer;\n}\n\n.oo-search .inp-btn input:focus {\n  outline: none;\n}\n\n.oo-search .inp {\n  background-image: url(//img3.doubanio.com/dae/accounts/resources/a4a38a5/movie/assets/nav_mv_bg.png?s=1);\n}\n\n.oo-search .inp-btn input {\n  background: url(//img3.doubanio.com/dae/accounts/resources/a4a38a5/movie/assets/nav_mv_bg.png?s=1) no-repeat 0 -40px;\n}\n`), N((function() {
              $("title").html("选影视 - oo.movie"), $("#app .article .tags").before(`<div class="oo-search">\n  <div class="inp"><input name="${d}" size="22" maxlength="60" placeholder="搜索电影、电视剧、综艺、影人" value="" autocomplete="off"></div>\n  <div class="inp-btn"><input type="submit" value="搜索"></div>\n</div>`), $("body").append($("#app .article").addClass("oo")), $(".oo-search input").on("keyup", (function(n) {
                13 === n.keyCode && (n.preventDefault(), location.href = "https://m.douban.com/search/?query=" + n.target.value + "&type=movie")
              })), $(".oo-search .inp-btn input").on("click", (function(n) {
                n.preventDefault();
                var t = $(".oo-search input").val();
                location.href = "https://m.douban.com/search/?query=" + t + "&type=movie"
              })), $("a.item").each((function(n, t) {
                $(t).attr("href", $(t).attr("href").replace("movie.douban.com", "m.douban.com/movie")).removeAttr("target")
              }));
              var n = !1;

              function t() {
                !n && $(window).scrollTop() + $(window).height() > $(document).height() - 40 && (n = !0, setTimeout((function() {
                  $(window).scrollTop() + $(window).height() > $(document).height() - 40 && ($(window).unbind("scroll"), $(".more").click()), n = !1
                }), 1200))
              }
              var e = document.querySelector(".list-wp");
              new MutationObserver((function(n) {
                var e = !1;
                for (var i of n) "childList" == i.type && (e = !0, i.addedNodes.forEach((function(n) {
                  n.classList.contains("item") && (n.setAttribute("href", n.getAttribute("href").replace("movie.douban.com", "m.douban.com/movie")), n.removeAttribute("target"))
                }))), e && setTimeout((function() {
                  $(window).scroll(t)
                }), 1500)
              })).observe(e, {
                attributes: !0,
                childList: !0
              })
            }))
          } else Is(/\w+:1234|ecruos\.gitee\.io\/one/) ? N((function() {
            localStorage.setItem("One.plugin.version", "20.2.9")
          })) : Is(/\.bilibili\.com\/bangumi\/play\//) && N((function() {
            var n = 0,
              t = setInterval((function() {
                if ($(".ep-info-image img, .media-cover img").length > 0) {
                  var e = $(".media-title, .ep-info-title").eq(0).text();
                  e && (clearInterval(t), insertSearchAddon(e, ".media-wrapper, .ep-list-pre-wrapper"))
                }
                n++ > 50 && clearInterval(t)
              }), 200)
          }))
        }
        S(), N((function() {
          a.setAttribute("oo-movie", r), setTimeout((function() {
            a.removeAttribute("oo-movie")
          }), 3e3)
        })), Is(/m\.v\.qq\.com/) && (T = function() {
          if (Is(/v\.qq\.com\/(cover|play|x\/cover|x\/page|x\/play|x\/m\/cover|x\/m\/page|x\/m\/play)/)) var n = 0,
            t = !1,
            e = setInterval((function() {
              t || (t = !0, S(), n++ > 40 || $(".oo-vip").length > 0 ? clearInterval(e) : t = !1)
            }), 250)
        }, setInterval((function() {
          n !== window.location.href && (n = window.location.href, T && T())
        }), 250))
      }
    }
  }

  function Is(t) {
    return t.test(n)
  }

  function w(n, t = "") {
    return n.split("").reverse().join(t)
  }

  function D(n, t = o) {
    return n.split("").reverse().map(n => ((n, t) => i(e(n) + t % 26))(n, t)).join("")
  }

  function x(n, t = o) {
    return n.split("").reverse().map(n => ((n, t) => i(e(n) - t % 26))(n, t)).join("")
  }

  function N(n) {
    $((function() {
      try {
        n()
      } catch (n) {
        console.error("oo.movie: " + n)
      }
    }))
  }

  function Q(n) {
    return (PurifyKeywordRegex ? n.replace(PurifyKeywordRegex, "") : n).replace(/\s*:\s*$/, "").trim()
  }

  function k(n, t) {
    var e, i, o, r, a = t.length;
    t += " ", n = (n = (n = n.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "")).replace(/}(\s*)@/g, "}@")).replace(/}(\s*)}/g, "}}");
    for (var l = 0; l < n.length - 2; l++) e = n[l], i = n[l + 1], "@" === e && (o = !0), o || "{" !== e || (r = !0), r && "}" === e && (r = !1), r || "@" === i || "}" === i || "}" !== e && "," !== e && ("{" !== e && ";" !== e || !o) || (n = n.slice(0, l + 1) + t + n.slice(l + 1), l += a, o = !1);
    return 0 !== n.indexOf(t) && 0 !== n.indexOf("@") && (n = t + n), n
  }

  function addStyle(n, t) {
    t && (n = k(n, t)), n = n.replace(/\n+\s*/g, " ");
    var e = document.createElement("style");
    e.type = "text/css", e.styleSheet ? e.styleSheet.cssText = n : e.appendChild(document.createTextNode(n)), document.getElementsByTagName("head")[0].appendChild(e)
  }

  function V(n, t) {
    var e, i, o = n.trim().split(/[\s@]+/),
      r = o.filter(n => /https?:\/\//.test(n));
    o = o.filter(n => !/https?:\/\//.test(n)), r.forEach(n => {
      /\/\/m\.|\/m\/|\/\/msou/.test(n) ? e = n : i = n
    });
    var a = (s ? e : i) || r[0];
    t && (a = C(a, t));
    var l = o.length > 0 ? o.join(" ") : a.match(/\/\/(.+\.)?([^\/]+)\.\w+\//)[2].replace(/^(\w)/, (function(n) {
      return n.toUpperCase()
    }));
    return {
      url: a,
      name: l
    }
  }

  function insertVipSource(n, t = "after", e = 0) {
    if (!($(".oo-vip").length > 0 || e > 20)) {
      var i = $(n);
      if (0 !== i.length) {
        addStyle(`\n.oo-vip {\n  padding-bottom: 0.5em;\n  background-color: rgba(255, 255, 255, 0.05);\n  border-radius: 5px;\n  width: 100%;\n  overflow: hidden;\n}\n\n.oo-vip + .oo-vip {${PurifyStyle}}\n\n.oo-vip-panel {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 10px 10px 0;\n  font-size: 15px;\n  width: 100%;\n}\n\n.oo-vip-panel.is-setting {\n  padding-bottom: 0.5em;\n  border-bottom: 1px solid rgba(73, 80, 87, 0.15);\n  border-top: 1px solid rgba(73, 80, 87, 0.15);\n  font-size: 0.95em;\n  opacity: 0.8;\n}\n\n.oo-vip-panel.is-setting a {\n  color: #1c7ed6;\n  text-decoration: underline;\n  font-weight: bold;\n}\n\n.oo-vip-panel.is-setting:not(.is-open) {\n  display: none;\n}\n\n.oo-is-pip {\n  border: 2px solid #d9480f;\n  border-radius: 20px;\n  padding: 5px;\n  font-size: 0.9em;\n}\n\n.oo-is-pip.is-on {\n  border: 2px solid #66a80f;\n}\n\n.oo-is-pip:not(.is-on) .is-off-text {\n  color: #e8590c;\n  font-size: 1.2em;\n  margin: 0 0.1em;\n}\n\n.oo-is-pip.is-on .is-on-text {\n  color: #5c940d;\n  font-size: 1.2em;\n  margin: 0 0.1em;\n}\n\n.oo-vip-title {\n  padding: 0.5em;\n  font-weight: bold;\n  color: #257942;\n}\n\n.oo-vip-title span {\n  font-size: 0.75em;\n  margin: 0 10px;\n  color: #ced4da;\n}\n\n.oo-vip-panel, .oo-vip-list {\n  height: auto !important;\n}\n\n.oo-vip-sign {\n  padding: 0.5em;\n  opacity: 0.25;\n  margin-right: 1em;\n}\n\n.oo-vip-list {\n  padding: 0.5em;\n  letter-spacing: 1px;\n}\n\n.oo-vip-list .oo-vip-item {\n  border-radius: 4px;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n  white-space: nowrap;\n  background-color: #eef6fc;\n  color: #1d72aa;\n  margin: 4px;\n  padding: 0.5em 0.5em 0.35em;\n  cursor: pointer;\n  font-size: 14px;\n  line-height: 1.2;\n  font-weight: 600;\n  text-decoration: none;\n  position: relative;\n  overflow: hidden;\n  transition: all 0.25s;\n}\n\n.oo-vip-list:not(.is-open) .oo-vip-item:not(.oo-collapse):nth-child(n+${c}) {\n  display: none;\n}\n\n.oo-collapse {\n  min-width: 2em;\n}\n\n.oo-vip-weight-bg, .oo-vip-weight {\n  position: absolute;\n  bottom: 0;\n  height: 2px;\n  left: -1px;\n  right: -1px;\n  transition: all 0.5s;\n}\n\n.oo-vip-weight-bg {\n  position: absolute;\n  right: -1px;\n  background-color: #ced4da;\n}\n\n.oo-vip-weight-bg.is-full {\n  background-color: #0ca678;\n}\n\n.oo-vip-weight {\n  background-color: #2b8a3e;\n  border-radius: 1px;\n}\n\n.oo-vip-list .oo-vip-item:hover .oo-vip-weight-bg, .oo-vip-list .oo-vip-item:hover .oo-vip-weight, .oo-vip-list .oo-vip-item.is-active .oo-vip-weight-bg, .oo-vip-list .oo-vip-item.is-active .oo-vip-weight {\n  opacity: 0;\n}\n\n.oo-vip-list .oo-vip-item:hover, .oo-vip-list .oo-vip-item:active {\n  background-color: #1d72aa;\n  color: #eef6fc !important;\n}\n\n.oo-vip-list .oo-vip-item.is-good {\n  color: rgb(14, 95, 149);\n}\n\n.oo-vip-list .oo-vip-item.is-active {\n  background-color: #2b8a3e;\n  color: #eef6fc;\n}\n\n.oo-player-bg {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: cover;\n  background-image: url(https://p.pstatp.com/origin/feca000093de4aae4c51);\n  z-index: 2147483646;\n  pointer-events: none;\n}\n`);
        var o = s ? `<div class="oo-vip-panel is-setting">\n<div>\n  <a href="http://xw.78hr.cn" target="_blank" >小王带刷</a>\n</div>\n<div class='oo-is-pip${f?" is-on":""}'><span class="is-on-text">是</span><span class="is-off-text">否</span>使用原网页解析\n</div>\n</div>` : "";
        i.eq(0)[t](`\n<div class="oo-vip">\n  <div class="oo-vip-panel">\n    <div class="oo-vip-title">先选剧集在点播放源<span>点击设置播放模式</span></div>\n    <div class="oo-vip-sign">${d}</div>\n  </div>${o}\n  <div class="oo-vip-list">\n${p.map((function(n,t){return'<span class="'+("oo-vip-item"+(n.weight>0?" is-good":""))+'" _ooKey="'+D(String(t))+'" _ooWeight="'+n.weight.toFixed(2)+'">'+n.name+'<span class="oo-vip-weight-bg'+(n.isM?" is-full":"")+'"></span><span class="oo-vip-weight" style="width:'+n.weight/y*100+'%;"></span></span>'})).join("\n")}${p.length>c?'<span class="oo-vip-item oo-collapse">开</span>':""}\n  </div>\n</div>\n</div>\n`);
        var r = !1;
        h();
        var a = 0,
          l = setInterval((function() {
            h(), a++ > 25 && clearInterval(l)
          }), 500)
      } else setTimeout((function() {
        insertVipSource(n, t, e + 1)
      }), 250)
    }

    function clickVipSource(n, t) {
      var e, i, o = location.href.replace(/&?\w+=http[^&]+/, "").replace(/.+http/, "http");
      e = o;
      var r = n + (o = ((i = BETTER_ADDONS.find(n => n.fixUrl && n.match.test(e))) ? i.fixUrl(e) : e) || o);
      $(".oo-vip-item").removeClass("is-active"), $(t).addClass("is-active"), f && m.test(n) && InnerUrlRegex.test(o) ? function(n) {
        var t = $(PlayerSelector).eq(0);
        if (0 === t.length && (t = $("#player, .player").eq(0)), 0 !== t.length) {
          $('iframe[id="oo-player"]').eq(0).html("");
          $("video").remove(), t.html(`<div class="oo-player-box"><div class="oo-player-bg"></div><iframe id="oo-player" style="width: 100%; height: 100%; border: none; outline: none; margin: 0; padding: 0; position: absolute; z-index: 2147483647; left: 0;"  width="100%" height="100%" allowfullscreen="true" allowtransparency="true" frameborder="0" scrolling="no" src="${n}"></iframe></div>`)
        } else location.href = n
      }(r) : location.href = r
    }

    function u(n, t) {
      $(n).click((function(n) {
        r || (r = !0, n.preventDefault(), t(this), setTimeout((function() {
          r = !1
        }), 500))
      }))
    }

    function h() {
      u(".oo-vip-item:not(.oo-collapse)", (function(n) {
        clickVipSource(p[x($(n).attr("_ooKey"))].url, n)
      })), u(".oo-vip-list .oo-collapse", (function(n) {
        var t = $(n).parent(".oo-vip-list");
        t.toggleClass("is-open"), $(n).html(t.hasClass("is-open") ? "关" : "开")
      })), u(".oo-vip-sign", (function(n) {
        s ? $(n).parent(".oo-vip-panel").siblings(".is-setting").toggleClass("is-open") : location.href = "https://gitee.com/ecruos/oo"
      })), u(".oo-vip-title", (function(n) {
        s ? $(n).parent(".oo-vip-panel").siblings(".is-setting").toggleClass("is-open") : location.href = "https://greasyfork.org/zh-CN/scripts/393284"
      })), u(".oo-is-pip", (function(n) {
        f = "true" !== localStorage.getItem("oo.playInPage"), localStorage.setItem("oo.playInPage", f), $(n).toggleClass("is-on")
      }))
    }
  }

  function E(t, e = !0) {
    var i = n.match(/\/\/([^\/]+)/)[1];
    return 搜索源.map((function(n) {
      return n.url.includes(i) ? "" : "<a " + (s ? "" : 'target="_blank" ') + 'href="' + C(n.url, t) + '">' + n.name + "</a>"
    })).join("\n") + (e && 搜索源.length > u ? '<a class="oo-collapse">开</a>' : "")
  }

  function insertSearchAddon(n, t, e = "after", i = 0) {
    if (!($(".oo-sources").length > 0 || i > 20)) {
      var o = t.startsWith("-");
      o && (t = t.slice(1));
      var r = $(t);
      0 !== r.length ? (addStyle(`\n.oo-sources {\n  max-width: 1000px;\n  margin: 0 auto;\n  padding: 10px;\n}\n\n.oo-vip .oo-sources {\n  max-width: unset;\n  border-top: 1px solid rgba(73, 80, 87, 0.15);\n  margin-top: 5px;\n}\n\n.oo-sources + .oo-sources {${PurifyStyle}}\n\n.oo-sources a {\n  display: inline-flex !important;\n  align-items: center;\n  justify-content: center;\n  border-radius: 4px;\n  font-size: 12px !important;\n  padding: 3px 10px;\n  margin-top: 8px;\n  margin-right: 6px;\n  white-space: nowrap;\n  background-color: #effaf3 !important;\n  color: #257942 !important;\n  cursor: pointer;\n  border: 1px solid #f1f3f5;\n  text-decoration: none;\n  transition: all 0.25s;\n}\n\n.oo-vip-list + .oo-sources:not(.is-open) a:not(.oo-collapse):nth-child(n+${u}), .oo-sources .oo-collapse {\n  display: none !important;\n}\n\n.oo-vip-list + .oo-sources .oo-collapse {\n  display: inline-flex !important;\n}\n\n.oo-collapse {\n  min-width: 2em;\n}\n\n.oo-sources a:hover {\n  border: 1px solid #099268;\n  background-color: #257942 !important;\n  color: #effaf3 !important;\n}\n`), r[o ? "last" : "first"]()[e](`<div class="oo-sources">\n${E(Q(n))}\n</div>`), $(".oo-sources .oo-collapse").click((function() {
        var n = $(this).parent(".oo-sources");
        n.toggleClass("is-open"), $(this).html(n.hasClass("is-open") ? "关" : "开")
      }))) : setTimeout((function() {
        insertSearchAddon(n, t, e, i + 1)
      }), 500)
    }
  }

  function C(n, t) {
    return n.includes("**") ? n.replace("**", t) : n + t
  }

  function I(n) {
    return Array.isArray(n) ? n : n.trim().split(/[\n\s]*\n+[\n\s]*/)
  }

  function toUrlRegex(n) {
    return new RegExp(n.map(n => n.replace(/.+\/\/|\/.+/g, "").replace(/\./g, "\\.")).join("|"))
  }

  function j(n) {
    n.name || n.match;
    var e = "";
    n.hide && (e += `\n${n.hide} {${PurifyStyle}}\n`), n.css && (e += n.css), e && addStyle(e), N((function() {
      if ((n.sign && $(n.sign).html(d), n.vip) && ((Array.isArray(n.vip) ? n.vip : [n.vip]).forEach(n => {
          insertVipSource((n = n.split(/\s*\|\s*/))[0], n[1])
        }), n.title)) var e = 0,
        i = setInterval((function() {
          var t = $(n.title).eq(0).text();
          t && (clearInterval(i), insertSearchAddon(t, ".oo-vip", "append")), e++ > 50 && clearInterval(i)
        }), 200);
      n.jump && N((function() {
        var e = "string" == typeof n.keyword ? $(n.keyword).eq(0).text() : "function" == typeof n.keyword ? n.keyword($) : function(n, e) {
          var i = (e || location.href).match(n || CommonSearchKeywordRegex);
          return i ? t((n ? i[1] || i[2] : i[2] || i[4]) || "") : ""
        }(n.keyword);
        (Array.isArray(n.jump) ? n.jump : n.jump.split(/\s*,\s*/)).forEach((function(n) {
          n = n.split(/\s*\|\s*/), insertSearchAddon(e, n[0], n[1] || "after")
        }))
      }))
    }))
  }

  function S() {
    BETTER_ADDONS.forEach(t => {
      ("string" == typeof t.match ? n.includes(t.match) : Is(t.match)) && j(t)
    })
  }
}();