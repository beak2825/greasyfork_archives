// ==UserScript==
// @name         One
// @namespace    (o˘◡˘o)
// @version      0.11.23
// @description  One for all: 豆瓣净化 + VIP 视频解析
// @author       (o˘◡˘o)
// @include      *
// @require      https://cdn.bootcss.com/zepto/1.2.0/zepto.min.js
// @downloadURL https://update.greasyfork.org/scripts/392893/One.user.js
// @updateURL https://update.greasyfork.org/scripts/392893/One.meta.js
// ==/UserScript==

// 豆瓣 - 搜索源
var DOUBAN_SOURCES = window.DOUBAN_SOURCES || [
  '哔哩哔哩 https://search.bilibili.com/all?keyword=**',
  '云播TV https://m.yunbtv.com/vodsearch/-------------.html?wd=**',
  '拾伍 https://www.shiwutv.com/vodsearch/-------------.html?wd=**',
  'vipku http://www.2n65.cn/index.php/vod/search.html?wd=**',
  '影视大全 http://01th.net/search/?wd=**',
  '影迷窝 https://www.yingmiwo.com/vodsearch.html?wd=**',
  'APP影院 https://app.movie/index.php/vod/search.html?wd=**',
  '八兔 http://www.8tutv.com/search/?q=**&category=0'
];

// VIP视频解析 - 解析网址
var VIP_URLS = window.VIP_URLS || [
  '黑云解析 https://jiexi.380k.com/?url=',
  '小千解析 http://www.nide123.cn/vip/?v=',
  '挚爱 http://www.10yy.com.cn/?url=',
  '极速 http://jx.szwlss.cn/api/?url=',
  '猪蹄 https://jx.iztyy.com/svip/?url=',
  '宿命 http://api.sumingys.com/index.php?url=',
];

if (location.href.includes('doubleclick.net')) return;

// 保证插件只加载一次
var PLUGIN_ID = '(o˘◡˘o) One';
if (window[PLUGIN_ID]) return;
window[PLUGIN_ID] = true;

var DOUBAN_VIP_SOURCES = [
  '爱奇艺 https://m.iqiyi.com/search.html?source=default&key=**',
  '腾讯 https://m.v.qq.com/search.html?act=0&keyWord=**',
  '优酷 https://www.soku.com/m/y/video?q=**',
  '搜狐 https://m.tv.sohu.com/upload/h5/m/mso.html?key=**',
  '芒果 https://m.mgtv.com/so/?k=**',
  '乐视 http://m.le.com/search?wd=**'
];

DOUBAN_SOURCES = DOUBAN_VIP_SOURCES.concat(DOUBAN_SOURCES);

(function() {
  function log() {
    args = [];
    args.push(PLUGIN_ID + '    ');
    // Note: arguments is part of the prototype
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    console.log.apply(console, args);
  }

  var isGM = !!window.GM;

  log('✔ Loaded', isGM ? 'isGM' : '');

  var href = location.href;

  function Is(regex) {
    return regex.test(href);
  }

  if (
    !Is(/url=http/) &&
    Is(/\.le\.com/) &&
    !Is(/\.le\.com\/(ptv\/vplay\/|vplay_)/)
  )
    return;

  if (!isGM) {
    // load dependencies
    eval(request('https://cdn.bootcss.com/zepto/1.2.0/zepto.min.js'));
  }

  var $ = Zepto;

  /**
   * Utils
   */
  function addStyle(styles) {
    var css = document.createElement('style');
    css.type = 'text/css';
    if (css.styleSheet) css.styleSheet.cssText = styles;
    // Support for IE
    else css.appendChild(document.createTextNode(styles)); // Support for the rest
    document.getElementsByTagName('head')[0].appendChild(css);
  }

  function parseOneUrl(link, title) {
    var oLink = link.trim().split(/[\s@]+/);

    var url = oLink.pop();

    if (title) {
      url = url.replace('**', title);
    }

    var urlName =
      oLink.length > 0
        ? oLink.join(' ')
        : url
            .match(/\/\/(.+\.)?([^\/]+)\.\w+\//)[2]
            .replace(/^(\w)/, function(v) {
              return v.toUpperCase();
            });
    return [url, urlName];
  }

  function insertVipSource(selector, position = 'after') {
    addStyle(`
.One-vip-panel {
  display: flex;
  justify-content: space-between;
  padding: 10px 10px 0;
}

.One-vip-title {
  padding: .5em;
  font-weight: bold;
  color: #257942;
}

.One-vip-sign {
  padding: .5em;
  opacity: .25;
}

.One-vip-list {
  padding: .5em;
  letter-spacing: 1px;
}

.One-vip-list .One-vip-item {
  align-items: center;
  border-radius: 4px;
  display: inline-flex;
  padding: .5em .75em .5em .75em;
  justify-content: center;
  white-space: nowrap;
  background-color: #eef6fc;
  color: #1d72aa;
  margin: 4px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.25;
  font-weight: 600;
  text-decoration: none;
}
`);

    $(selector).eq(0)[position](`
<div class="One-vip-panel">
<div class="One-vip-title">VIP 解析</div>
<div class="One-vip-sign">(o˘◡˘o)</div>
</div>
<div class="One-vip-list">
${VIP_URLS.map(function(link) {
  var [url, urlName] = parseOneUrl(link);
  return (
    '<a class="One-vip-item" href="' +
    (url + location.href) +
    '">' +
    urlName +
    '</a>'
  );
}).join('\n')}
</div>
</div>
`);
  }

  if (Is(/url=http/)) {
    // VIP 视频解析
    if (Is(/\.nxflv\.com/)) {
      log('VIP解析 nxflv.com');

      addStyle(`
      body > div:last-child {
        display: none !important;
        visibility: hidden !important;
        position: absolute !important;
        left: -9999px !important;
      }
      `);

      $(function() {
        var adTask;
        var count = 0;

        adTask = setInterval(function() {
          $('body > div:last-child').each(function(i, el) {
            if (
              $(el).attr('class') &&
              $(el).attr('class') == $(el).attr('id')
            ) {
              $(el).remove();
              log('Remove ad success!');
            }
          });

          if (count++ > 20) {
            clearInterval(adTask);
          }
        }, 200);
      });
    }
  } else if (
    Is(/m\.douban\.com\/search\/\?.*type=movie|search\.douban\.com\/movie\//)
  ) {
    log('豆瓣·电影·搜索');

    // TODO 搜索结果唯一时，自动跳转

    if (!Is(/m\.douban\.com\//)) {
      /**
       * PC端
       */
      addStyle(`
#dale_movie_subject_search_bottom,
#dale_movie_subject_search_top_right,
#dale_movie_subject_top_right,
#dale_movie_subject_bottom_super_banner,
#dale_movie_subject_middle_right {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}

.One-sources {
  padding-left: 1em;
}

.One-sources a {
  display: inline-flex !important;
  align-items: center;
  border-radius: 4px;
  font-size: .75rem;
  height: 2em;
  justify-content: center;
  line-height: 1.5;
  padding-left: .75em;
  padding-right: .75em;
  white-space: nowrap;
  background-color: #effaf3;
  color: #257942;
  margin-top: .5em;
  margin-right: .5em;
}
`);

      $('#icp').html('(o˘◡˘o)');
      $('.gemzcp').each(function(i, el) {
        var title = $('.title', el).text();

        $(el).append(`<p class="One-sources">
${DOUBAN_SOURCES.map(function(S) {
  var [url, urlName] = parseOneUrl(S);
  return '<a href="' + url.replace('**', title) + '">' + urlName + '</a>';
}).join('\n')}
</p>`);
      });

      return;
    }

    addStyle(`
#TalionNav,
.search-results-modules-name {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}

.search-module {
  margin-top: 0;
}

.search-results img {
  width: 80px;
}

.search-results {
  padding-bottom: 10px;
}

.search-results li a {
  display: flex;
  align-items: center;
}

.search-results img {
  height: 100%;
  padding: 0;
  border: 2px solid;
  border-image: linear-gradient(to bottom, #2b68c4 0%,#cf2d6e 100%)1;
}

.One-sources {
  padding-left: 1em;
}

.One-sources a {
  display: inline-flex !important;
  align-items: center;
  border-radius: 4px;
  font-size: .75rem;
  height: 2em;
  justify-content: center;
  line-height: 1.5;
  padding-left: .75em;
  padding-right: .75em;
  white-space: nowrap;
  background-color: #effaf3;
  color: #257942;
  margin-top: .5em;
  margin-right: .5em;
}
`);

    $('#more-search').append('    (o˘◡˘o)');

    $('.subject-info').each(function(i, el) {
      var title = $('.subject-title', el).text();

      $(el).append(`<p class="One-sources">
${DOUBAN_SOURCES.map(function(S) {
  var [url, urlName] = parseOneUrl(S);
  return '<a href="' + url.replace('**', title) + '">' + urlName + '</a>';
}).join('\n')}
</p>`);
    });
  } else if (
    Is(/m\.douban\.com\/movie\/subject\/|movie\.douban\.com\/subject\//)
  ) {
    log('豆瓣·电影·详情');

    if (!Is(/m\.douban\.com\//)) {
      /**
       * PC端
       */

      addStyle(`
#dale_movie_subject_search_bottom,
#dale_movie_subject_search_top_right,
#dale_movie_subject_top_right,
#dale_movie_subject_bottom_super_banner,
#dale_movie_subject_middle_right {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}
`);

      $('#icp').html('(o˘◡˘o)');

      var title = $('title')
        .text()
        .replace('(豆瓣)', '')
        .trim();

      $('#info').append(
        `
<span class="pl">在线观看：</span>
<span>
${DOUBAN_SOURCES.map(function(link) {
  var [url, urlName] = parseOneUrl(link, title);
  return '<span><a href="' + url + '">' + urlName + '</a>';
}).join(' / </span>')}
</span></span><br>
`
      );

      return;
    }

    addStyle(`
.score-write,
a[href*='to_app'],
a[href*='doubanapp'],
section + .center,
.bottom_ad_download,
.sub-vendor,
.to_pc,
.TalionNav-static,
.sub-detail .mark-movie,
.sub-detail .mark-tv,
.subject-banner,
.bottom_ad_download,
.cover-count {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}

.sub-info .sub-cover {
  display: block !important;
}

.TalionNav-primary {
  position: relative !important;
}

.subject-comments,
.subject-reviews {
  margin-bottom: 0 !important;
}

.TalionNav .TalionNav-primary .search-box {
  width: 230px;
  flex: 230px 0 0;
  animation: none;
}

.sub-original-title {
  padding: 0.25em 0;
}

._V_sign {
  font-size: 0.85em;
  opacity: 0.25;
  text-align: center;
  padding-bottom: 1em;
}

._V_source, .sub-score + .sub-score {
  margin-top: 1.5em;
  color: #fff;
}

._V_source .sub-score .sub-content {
  display: block;
}

._V_source .sub-score a {
  padding: .25em .5em;
  line-height: 1.5;
  margin: 0 .15em;
  border: 1px solid rgba(255,255,255,0.2);
  font-size: 1.05em;
  font-weight: bold;
  letter-spacing: 1px;
  margin-top: .5em;
  display: inline-block;
  color: #fbb632;
  background: rgba(239, 238, 238, 0.05);
  border-radius: 4px;
}

#TalionNav {
  display: none;
}

#TalionNav .logo {
  background: none;
  font-size: 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #dee2e6;
}

.search-box:not(.on-search) {
  opacity: 0.5;
}

#channel_tags {
  margin-bottom: 10px;
}

.subject-header-wrap .sub-detail {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
`);

    $(function() {
      var title = $('.sub-title')
        .text()
        .trim();

      $('.sub-cover').attr('href', '#');
      $('#subject-honor-root a').attr('href', '#');

      $('.movie-reviews .show-all').after(
        '<div class="_V_sign">豆瓣·改 (o˘◡˘o)</div>'
      );

      $('section + .center').each(function(i, el) {
        $(el).remove();
      });

      $('.subject-header-wrap').after($('#TalionNav'));

      $('#TalionNav').css('display', 'block');

      $('#TalionNav .logo').html(
        decodeURIComponent('(o%CB%98%E2%97%A1%CB%98o)')
      );

      $('.search-box').remove();
      $('.TalionNav-primary .logo').after(
        '<div class="search-box"><input class="search-input" type="search" placeholder="搜索"></div>'
      );

      $('.search-input')
        .on('focus', function() {
          $(this)
            .parent()
            .addClass('on-search');
        })
        .on('blur', function() {
          $(this)
            .parent()
            .removeClass('on-search');
        });

      $('.search-input').on('keyup', function(e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          location.href = '/search/?query=' + e.target.value + '&type=movie';
        }
      });

      $('.subject-header-wrap').append(
        `<div class="_V_source subject-mark">

<div class="sub-score">
  <div class="sub-trademark">
  在线观看
  </div>
  <div class="sub-content">
${DOUBAN_SOURCES.map(function(link) {
  var [url, urlName] = parseOneUrl(link, title);
  return '<a href="' + url + '">' + urlName + '</a>';
}).join('\n')}
  </div>
</div>

</div>`
      );

      function rgbToHex(rgb) {
        if (rgb.startsWith('#')) return rgb;

        // rgb(x, y, z)
        var color = rgb.toString().match(/\d+/g); // x,y,z
        var hex = '#';

        for (var i = 0; i < 3; i++) {
          // 'Number.toString(16)' 转成16进制
          // 如果结果是一位数，就在前面补零。例如： A变成0A
          hex += ('0' + Number(color[i]).toString(16)).slice(-2);
        }
        return hex;
      }

      // TODO window.fy_bridge_app.setAppBarColor 应用至更多网页

      function syncAppColor() {
        var style = $('#subject-header-container').attr('style');

        if (!style) {
          setTimeout(function() {
            syncAppColor();
          }, 100);
        } else {
          var mainColor = style.match(/:\s*([^;]+);?/)[1];
          try {
            window.fy_bridge_app.setAppBarColor(rgbToHex(mainColor));
          } catch (error) {
            console.error('setAppBarColor:', error);
          }
        }
      }

      if (window.fy_bridge_app) {
        syncAppColor();
      }

      setTimeout(function() {
        $('.subject-intro .bd p').click();
      }, 1000);
    });
  } else if (Is(/m\.v\.qq\.com\/search\.html/)) {
    log('腾讯·搜索');

    addStyle(`
.tvp_app_bar {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}
`);
    $('.copyright').html('(o˘◡˘o)');
  } else if (Is(/v\.qq\.com\/(cover|play|x\/cover|x\/page)/)) {
    log('腾讯·详情');

    addStyle(`
.mod_source,
.video_function,
.mod_promotion,
#vip_privilege,
#vip_activity,
.U_bg_b,
.btn_open_v,
.btn_openapp,
#vip_header,
.btn_user_hd {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}

#vip_title {
  padding-bottom: 0;
}

.mod_episodes_numbers.is-vip .item {
  width: auto;
  padding: 0 1em;
}

.U_html_bg .container {
  padding-bottom: 30px;
}
`);
    $(function() {
      insertVipSource('#vip_title, .U_box_bg_a, .player_headline');
    });
  } else if (Is(/m\.iqiyi\.com\/search\.html/)) {
    log('爱奇艺·搜索');

    addStyle(`
.btn-ticket,
.btn-yuyue,
.btn-download,
.m-iqyDown {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}
`);
    $('.m-footer').html('(o˘◡˘o)');
  } else if (Is(/\.iqiyi\.com\/(a_|v_|w_|adv)/)) {
    log('爱奇艺·详情');

    addStyle(`
.m-iqyDown,
.header-login + div,
.m-video-action,
div[name="m-vipRights"],
div[name="m-extendBar"],
.m-iqylink-diversion,
.m-iqylink-guide,
.c-openVip,
.c-score-btn,
.m-videoUser-spacing,
.m-pp-entrance {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}

.page_play {
  padding-bottom: 0;
}

div[name="m-videoInfo"] {
  padding-top: 1em;
}

.m-box-items .one-album-item {
  border-radius: .05rem;
  background-color: #e9ecef;
  color: #495057;
  padding: .5em 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: .25em;
  font-weight: bold;
}
`);
    $(function() {
      $('.m-footer').html('(o˘◡˘o)');

      insertVipSource('div[name="m-videoInfo"], #block-C');
    });
  } else if (Is(/m\.youku\.com\/a|m\.youku\.com\/v|v\.youku\.com\/v_/)) {
    log('优酷·详情');

    addStyle(`
.h5-detail-guide,
.h5-detail-ad,
.brief-btm,
.smartBannerBtn,
.cmt-user-action {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}
`);
    $(function() {
      $('.copyright').html('(o˘◡˘o)');

      insertVipSource('.h5-detail-info, #bpmodule-playpage-lefttitle');
    });
  } else if (Is(/\.mgtv\.com\/b\//)) {
    log('芒果TV·详情');

    addStyle(`
.ad-banner,
.video-area-bar,
.video-error .btn,
.m-vip-list,
.m-vip-list + div:not([class]),
.toapp,
.video-comment .ft,
.mg-app-swip {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}
`);
    $(function() {
      $('.mg-footer-copyright').html('(o˘◡˘o)');

      insertVipSource('.xuanji', 'before');
      insertVipSource('.v-panel-v5');
    });
  } else if (Is(/m\.tv\.sohu\.com\/phone_play_film/)) {
    return (location.href = href.replace(
      'phone_play_film',
      `v${href.match(/vid=(\d+)/)[1]}.shtml`
    ));
  } else if (Is(/film\.sohu\.com\/album\/|tv\.sohu\.com\/v/)) {
    log('搜狐视频·详情');

    addStyle(`
.actv-banner,
.btn-xz-app,
.twinfo_iconwrap,
.btn-comment-app,
#ad_banner,
.advertise,
.main-ad-view-box,
.foot.sohu-swiper,
.app-star-vbox,
.app-guess-vbox,
.main-rec-view-box,
.app-qianfan-box,
.comment-empty-bg,
.copyinfo,
.ph-vbox {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}

.comment-empty-txt {
  margin-bottom: 0;
}

.app-view-box + footer {
  padding: 0;
  opacity: 0.5;
}
`);
    $(function() {
      $('.links').html('(o˘◡˘o)');

      insertVipSource('.title-wrap, .videoInfo');
    });
  } else if (Is(/\.le\.com\/(ptv\/vplay\/|vplay_)/)) {
    log('乐视·详情');

    addStyle(`
.full_gdt_bits,
.gamePromotion,
.gamePromotionTxt,
#j-leappMore,
.lbzDaoliu,
.up-letv,
.le_briefIntro .Banner_01,
.video_block > .col_6 > [id],
.arkBox {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}
`);
    $(function() {
      insertVipSource('.introduction_box, .le_briefIntro');
    });
  }
})();
