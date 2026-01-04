// ==UserScript==
// @name        i Read Mode
// @namespace   https://greasyfork.org/users/756764
// @version     2025.3.13
// @author      ivysrono
// @license     MIT
// @description 选择最佳模式；自动加载全文；选择最大字号等。
// @match       *://*/*
// @run-at      document-start
// @grant       GM.addStyle
// @inject-into auto
// @downloadURL https://update.greasyfork.org/scripts/424763/i%20Read%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/424763/i%20Read%20Mode.meta.js
// ==/UserScript==

/**
 * 百度百家号
 * https://baijiahao.baidu.com/u?app_id=1568519435931675
 * https://baijiahao.baidu.com/s?id=1706035051279566881
 */
if (location.host === 'baijiahao.baidu.com') {
  GM.addStyle(`
  /* 自动展开全文 */
  .mainContent {height: auto !important;}
  /* 移动版屏蔽顶部 APP 推广 */
  .headDeflectorContainer {display: none !important;}
  `);

  // 滚动中弹出浏览方式选择器
  const normal = () => {
    if (navigator.userAgent.includes('Mobile')) {
      if (document.getElementsByClassName('normal').length === 1) {
        document.getElementsByClassName('normal')[0].click();
        console.log('继续使用浏览器阅读');
      }
    }
  };
  const observer = new MutationObserver(() => {
    normal();
  });
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

// 贴吧
if (location.host === 'tieba.baidu.com') {
  // 正文和评论字号放大
  GM.addStyle(`
  .d_post_content {font-size: x-large !important;}
  .lzl_content_main {font-size: large !important;}
  .tbui_aside_float_bar {display: none !important;}
  `);
  // 自动关闭登录提示
  const pure_tieba = () => {
    if (document.getElementsByClassName('close-btn').length === 1) {
      document.getElementsByClassName('close-btn')[0].click();
    }
  };
  const observer = new MutationObserver(() => {
    pure_tieba();
  });
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

/**
 * 财新
 * https://www.caixin.com/2020-02-15/101515879.html
 * https://m.china.caixin.com/m/2020-02-10/101513044.html
 * https://m.opinion.caixin.com/m/2020-02-13/101514855.html
 */
if (location.host.endsWith('.caixin.com')) {
  /**
   * 桌面版正文放大字号
   * 付费墙下移不遮挡最后几行字
   * 移动版移除底部“App 内打开”提醒
   */
  GM.addStyle(`
  #Main_Content_Val {font-size: x-large !important;}
  #chargeWallContent {margin-top: auto !important;}
  .openInApp {display: none !important;}
  `);
  // 移动版放大字号
  const observer = new MutationObserver(() => {
    if (
      document.getElementById('fontSize') &&
      document.getElementById('fontSize').textContent !== 'T大'
    ) {
      document.getElementById('fontSize').click();
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

/**
 * 中时电子报
 * 自动显示大字号
 * https://www.chinatimes.com/newspapers/20190325000561-260109?chdtv
 * https://www.chinatimes.com/newspapers/20190325000561-260109?chdtv
 */
//
if (location.host === 'www.chinatimes.com') {
  GM.addStyle(`article.article-box {font-size: x-large !important;}`);
}

// 中时电子报网络投票 https://ivoting.chinatimes.com/result/20190430003680-261001
if (location.host === 'ivoting.chinatimes.com') {
  GM.addStyle(`.clear-fix {font-size: x-large !important;}`);
}

// 豆瓣
if (location.host === 'm.douban.com') {
  GM.addStyle(`
  /* 自动展开全文 */
  section.note-content {max-height: inherit !important;}
  /* 隐藏APP推广等 */
  .download-app,
  .oia-readall,
  .oia-wrap,
  .TalionNav-static,
  div[style="position: relative;margin: 0 -18px"] {
    display: none !important;
  }
  `);
  // 解除站内链接APP依赖
  window.addEventListener('load', () => {
    for (let i of document.querySelectorAll('a[href*="url=/"]')) {
      i.href = i.href.split('url=')[1].split('&')[0];
    }
  });
}

// 多邻国
if (location.host === 'www.duolingo.cn' && navigator.userAgent.includes('Mobile')) {
  // 屏蔽Plus试用
  GM.addStyle(`button[data-test="try-plus-badge"] {display: none !important;}`);
  if (!location.pathname.startsWith('/learn')) return;
  const continueInWeb = ['CONTINUE IN BROWSER', '继续使用网页版', 'ブラウザで続ける'];
  const better_webui = () => {
    // 首页自动点击按钮：继续使用网页版
    if (
      document.querySelectorAll('div[data-focus-lock-disabled="false"]').length === 1 &&
      document.querySelectorAll('div[data-focus-lock-disabled="false"] button').length === 1 &&
      // 避免误伤传奇等级挑战等
      continueInWeb.includes(
        document.querySelector('div[data-focus-lock-disabled="false"] button').textContent
      )
    ) {
      document.querySelector('div[data-focus-lock-disabled="false"] button').click();
    }
  };
  const observer = new MutationObserver(better_webui);
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

/** ETtoday 新闻云
 * 移动版正文字号放大
 * https://www.ettoday.net/news/20190313/1397863.htm
 * https://www.ettoday.net/news/20191024/1564140.htm
 */
if (location.host === 'www.ettoday.net' || location.host === 'm.ettoday.net') {
  GM.addStyle(`
  .story p,
  .story p span {
    font-size: x-large !important;
  }
  `);
}

/**
 * 中国政府网放大字号
 * http://www.gov.cn/premier/2019-07/01/content_5405033.htm
 * http://www.gov.cn/zwgk/2013-02/22/content_2337704.htm
 * http://www.gov.cn/zhengce/zhengceku/2020-02/28/content_5484623.htm
 * http://www.moj.gov.cn/Department/content/2018-12/26/582_46442.html
 * http://www.chinalaw.gov.cn/Department/content/2017-09/18/587_3106425.html
 * http://www.jiangsu.gov.cn/art/2009/4/12/art_46143_2543923.html
 * http://mzt.jiangsu.gov.cn/art/2020/12/21/art_78615_9619774.html
 */
if (location.host.endsWith('.gov.cn')) {
  GM.addStyle(`
  #content,
  #UCAP-CONTENT p,
  #UCAP-CONTENT p span,
  #zoom p,
  /**
   * http://mzj.wuxi.gov.cn/doc/2020/02/24/3051149.shtml
   * http://www.wuxi.gov.cn/gjj/doc/2020/07/18/2977008.shtml
   */
  #Zoom p,

  /* http://wxkjj.wuxi.gov.cn/doc/2020/07/30/2989372.shtml */
  #Zoom p span,


  /* http://www.yixing.gov.cn/doc/2021/05/17/945218.shtml */
  .article_cont > p,

  .article_content p,

  /**
   * http://www.jiangyin.gov.cn/doc/2021/04/19/938625.shtml
   * http://www.jiangyin.gov.cn/doc/2021/04/19/938625.shtml
   */
  .lw_content p,

  .pages_content > p,

  /* http://www.jsxishan.gov.cn/doc/2021/04/21/3265022.shtml */
  .TRS_Editor > p,

  /* http://www.jsxishan.gov.cn/doc/2021/05/08/3284888.shtml */
  .TRS_Editor > p span {
    font-size: x-large !important;
  }
  `);
}

// 观察者网桌面版必须有 `.shtml` https://www.guancha.cn/society/2018_07_18_464635_2.shtml?s=z
if (location.host === 'www.guancha.cn') {
  GM.addStyle(`
  /* 大字号 */
  .content.all-txt {font-size: x-large !important;}
  /* 文前文后分享按钮 */
  .share {display: none !important;}
  `);
  // 自动全文
  if ((m = location.pathname.match(/(\/\w+\/\d{4}\_\d{2}_\d{2}_\d+)(_[1-9])?(\.shtml)/i))) {
    if (m[2] !== '_s') {
      location.pathname = m[1] + '_s' + m[3];
    }
  }
}

// 观察者网移动版可以没有 `.shtml` https://m.guancha.cn/politics/2019_03_09_492959
if (location.host === 'm.guancha.cn') {
  if (navigator.userAgent.includes('Mobile')) {
    GM.addStyle(`
    /* 展开全文 */
    .textPageCont {height: auto !important;}
    /* 屏蔽文末点击展开全文按钮 */
    .textPageCont-footer,
    /* 顶部APP推广条 */
    .downloadBtn-box,
    /* 顶部APP推广条留白 */
    #downloadBtn-position,
    /* 隐藏文末分享按钮 */
    .bdsharebuttonbox {
      display: none !important;
    }
    `);
  } else {
    if ((m = location.pathname.match(/(\/\w+\/\d{4}\_\d{2}_\d{2}_\d+)(\.shtml)?/i))) {
      if (m[2] !== '_s') {
        // 自动跳转到桌面版全文模式
        location.href = 'https://www.guancha.cn' + m[1] + '_s.shtml';
      }
    }
  }
}

/**
 * 观察者社区
 * https://user.guancha.cn/main/content?id=241992
 * https://user.guancha.cn/wap/content?id=601738&s=fwzxhfbt
 */
if (location.host === 'user.guancha.cn') {
  GM.addStyle(`
  /* 放大正文字号 */
  .article-txt-content,
  .article-txt-content > p {
    font-size: x-large !important;
  }
  /* 底部轮动栏 */
  .g_swiper_container {
    display: none !important;
  }
  `);
  if (location.search.includes('&')) {
    location.search = location.search.split('&')[0];
  }
  window.addEventListener('load', () => {
    // 自动选择 余下全文
    if (
      // 评论多时也会有下一页
      document.getElementsByClassName('next').length &&
      document.getElementsByClassName('next')[0].style.display !== 'none' &&
      document.getElementsByClassName('expand-all').length === 1
    ) {
      document.querySelector('.expand-all > a').click();
    }
    // 自动展开全文
    if (
      document.getElementsByClassName('article-expand-more').length === 1 &&
      document.getElementsByClassName('article-expand-more')[0].getAttribute('style') === ''
    ) {
      document.getElementsByClassName('article-expand-more')[0].click();
    }
  });
}

// 环球网自动展开全文 https://3w.huanqiu.com/a/81a04f/9CaKrnKpvyu
if (location.host === '3w.huanqiu.com') {
  GM.addStyle(`
  #showmore {height: auto !important;}
  .mip-showmore-btn {display: none !important;}
  `);
}

// 环球网自动展开全文 https://opinion.huanqiu.com/article/9CaKrnKpvCw
if (location.host === 'opinion.huanqiu.com') {
  GM.addStyle(`
  .content {height: auto !important;}
  #unfold-field {display: none !important;}
  `);
}

// 虎扑移动版 https://m.hupu.com/bbs/28553293.html
if (location.host === 'm.hupu.com') {
  GM.addStyle(`
  /* 自动展开全文 */
  #bbs-detail-wrap {
    max-height: none !important;
  }
  /* APP推广 */
  .open-btn-under-thread,
  .open-app-suspension {
    display: none !important;
  }
  `);
}

// 虎嗅移动版自动展开全文 https://m.huxiu.com/article/295379.html
if (location.host === 'm.huxiu.com') {
  GM.addStyle(`
  /* 自动展开全文 */
  .js-mask-box {
    height: auto !important;
  }
  /* 放大字号 */
  #article-detail-content p {
    font-size: x-large !important;
  }
  /* 右侧二维码 */
  #qr_code_pc,
  /* 打开APP查看全文按钮 */
  .js-fresh-article-wrap,
  /* 顶部滚动栏 */
  .js-top-fixed,
  /* 文后大家都在看 */
  #related-article-wrap,
  /* 文后大家都在搜 */
  .article-recommend-wrap,
  .hot-so-wrap {
    display: none !important;
  }
  `);
}

if (location.host === 'bbs.kafan.cn') {
  // 移动版底部有切换栏 .footer ，桌面版无，亦可用来判断页面类型。
  if (!navigator.userAgent.includes('Mobile')) {
    // 隐藏置顶帖
    GM.addStyle('tbody[id^="stickthread_"] {display: none !important;}');
    window.addEventListener('load', () => {
      // 切换到宽版
      const switchwidth = document.getElementById('switchwidth');
      if (switchwidth && switchwidth.title === '切换到宽版') {
        switchwidth.click();
      }
      // 收起本版规则
      const forumrule = document.querySelector('img[id^="forum_rules_"]');
      if (forumrule && forumrule.src.endsWith('/collapsed_no.gif')) {
        forumrule.click();
      }
    });
  }
}

// 法律图书馆 http://www.law-lib.com/law/law_view.asp?id=725510
if (location.host === 'www.law-lib.com') {
  // 自动不分页显示
  if (location.pathname === '/law/law_view.asp') {
    location.pathname = '/law/law_view1.asp';
  }
  // 全文页面还是旧样式
  GM.addStyle(`
  /* 解除顶层字体限制，默认 14px 也太小了，行高都 20px 的 */
  * {font-size: revert !important;}

  /* 放大正文字号 */
  .sub_left {
    font-size: x-large !important;
  }

  /* 展开法规来源 */
  .left_conul, .fglys {
    width: auto !important;
  }
  `);
  const observer = new MutationObserver(() => {
    if (
      document.querySelector('body').textContent.includes('对不起,数据库服务器正忙，请稍候刷新重试')
    ) {
      location.reload();
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

/**
 * https://www.liaoxuefeng.com/wiki/1022910821149312
 * 廖雪峰编程教程字号太小，将标题、正文、文中代码块分别放大。
 * 左侧目录固定显示，由于移动版目录选择器不同且该选择器为隐藏状态，故暂时不用区分插入环境。
 */
if (location.host === 'www.liaoxuefeng.com') {
  GM.addStyle(`
  #x-content h3 {font-size: xx-large !important;}
  #x-content h4 {font-size: x-large !important;}
  #x-content p {font-size: large !important;}
  #x-content pre {font-size: medium !important;}
  #x-sidebar-left {position: fixed !important;}
  `);
}

// 美篇 https://www.meipian.cn/1yr57an8?share_depth=3&from=timeline
if (location.host === 'www.meipian.cn') {
  if (navigator.userAgent.includes('Mobile')) {
    GM.addStyle(`
      /* 自动展开全文 */
      .mp-article-content-area {
        max-height: none !important;
        mask: none !important;
      }
      /* 图片下 APP 推广条 */
      .pull-app-banner,
      /* 底部 APP 推广条 */
      .mp-fixed-download,
      /* 打开 APP 查看全文 */
      .mp-article-content-more {
        display: none !important;
      }
      `);
  }
  // 背景音乐静音
  const observer = new MutationObserver(() => {
    if (document.querySelectorAll('audio').length === 1) {
      document.querySelector('audio').muted = 'muted';
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

/**
 * MSN 移动版字特别小
 * https://www.msn.cn/zh-cn/news/other/%E8%8B%B1%E7%89%B9%E5%B0%94%E5%B0%86%E4%BA%8E%E4%BB%8A%E5%B9%B4%E7%8E%87%E5%85%88%E5%BC%95%E5%85%A5%E4%B8%8B%E4%B8%80%E4%BB%A3-high-na-euv-%E5%85%89%E5%88%BB%E6%9C%BA/ar-AA1hzQ0Z
 */
if (location.host.startsWith('www.msn.c')) {
  if (location.search !== '') {
    location.search = '';
  }
  GM.addStyle(`
  section,
  section p,
  .gallery-title-text,
  .gallery-caption-text {
    font-size: x-large !important;
  }
  `);
  const observer = new MutationObserver(() => {
    // 页面部分载入失败
    if (
      document.getElementById('message') &&
      document.getElementById('message').textContent.startsWith('此頁面目前無法使用')
    ) {
      location.href = location.href;
    }
    // 桌面版顶部和移动办底部推广条，直接隐藏可能会破坏整体样式
    if (document.getElementsByClassName('dismiss').length === 1) {
      document.getElementsByClassName('dismiss')[0].click();
    }
    // 长文移动版的阅读更多按钮
    if (document.querySelectorAll('.readmoremobile').length === 1) {
      document.querySelector('.readmoremobile').click();
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

// 北大法宝大字号 https://www.pkulaw.com/chl/fb0f20d4001e4c26bdfb.html
if (location.host.endsWith('pkulaw.com')) {
  GM.addStyle(`
  #divFullText,
  #divFullText *,
  .fulltext {
    font-size: x-large !important;
  }
  `);
  // 自动跳转到移动版
  let hrefReg = location.href.match(/^https:\/\/(www\.)?pkulaw\.com\/chl\/(\w+)\.html/);
  if (navigator.userAgent.includes('Mobile') && hrefReg) {
    location.href = `https://m.pkulaw.com/chl/${hrefReg[2]}`;
  }
}

// PTT 自动点击确认年满18
if (location.host === 'www.ptt.cc') {
  const observer = new MutationObserver(() => {
    if (document.getElementsByClassName('btn-big').length !== 2) return;
    document.getElementsByClassName('btn-big')[0].click();
  });
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

/**
 * 微信公众号
 * https://mp.weixin.qq.com/s/1KhZ6Oxn1wlK-uKVgXuU7A
 * https://mp.weixin.qq.com/s/b4V3eaFYYI0h90vIVEqKzw
 * https://mp.weixin.qq.com/s/CffucC8Y5ZxiLrbL8l0p9Q
 * https://mp.weixin.qq.com/s/Dpx-TtAB0R_wXLSpCgZUiw
 */
if (location.host === 'mp.weixin.qq.com') {
  GM.addStyle(`
  /* 大字号 */
  #js_content,
  #js_content p,
  #js_content span,
  #js_content section {
    font-size: x-large !important;
  }
  `);
}

// 阮一峰的博客默认字号 62.5% 太小了，辅助 https://github.com/BennyThink/KeepABPOn
if (location.host === 'www.ruanyifeng.com') {
  GM.addStyle(`#scrapbook {font-size: 100% !important;}`);
}

// 阮一峰的 ES6 教程默认字号 0.8rem 太小了 https://es6.ruanyifeng.com/
if (location.host === 'es6.ruanyifeng.com') {
  GM.addStyle(`#content {font-size: 1rem !important;}`);
}

/**
 * 新浪移动版
 * http://sports.sina.cn/wb/mid_news.d.html?docurl=https%3A%2F%2Fsports.sina.cn%2Flaliga%2Fbarcelona%2F2021-07-11%2Fdetail-ikqcfnca6196102.d.html&number=wm23900_0012
 * https://news.sina.cn/2021-07-11/detail-ikqcfnca6236553.d.html?cre=*&mod=wnews&loc=*&r=*&rfunc=*&tj=cxvertical_wap_wnews&tr=*&vt=*&pos=*
 * https://sports.sina.cn/others/qipai/2018-08-04/detail-ihhhczfa3589925.d.html?from=wap
 */
if (location.host.endsWith('.sina.cn')) {
  if (location.search !== '' && !location.search.includes('docurl=http')) {
    location.search = '';
  }
  GM.addStyle(`
  /* 自动展开全文 */
  section.s_card.z_c1 {height: auto !important;}
  /* 隐藏顶部滚动条，正文底部APP推广区域，浮动APP推广按钮 */
  #module_info, #artFoldBox, .callApp_fl_btn {display: none !important;}
  /* 隐藏顶部滚动条隐藏后的留白 */
  .fl_padding {padding-top: unset !important;}
  `);
}

/**
 * Solidot 放大正文字号
 * https://www.solidot.org/story?sid=68694
 * https://www.solidot.org/story?sid=68699
 * https://www.solidot.org/story?sid=68700
 */
if (location.host === 'www.solidot.org') {
  GM.addStyle(`.block_m, .p_mainnew {font-size: x-large !important;}`);
}

/** 微博文章 会自动重定向到新的域名 card.weibo.com
 * https://media.weibo.cn/article?id=2309351000894146517391881394
 * https://media.weibo.cn/article?object_id=1022%3A2309404214399068965543&luicode=10000011&lfid=1076036458177315&id=2309404214399068965543&ep=G62AiuClc%252C6458177315%252CG62AiuClc%252C6458177315
 * https://media.weibo.cn/article?object_id=1022%3A2309404409652505870353&extparam=lmid--4409652504992832&luicode=10000011&lfid=1076031459358890&id=2309404409652505870353
 * 以下页面无效：
 * https://card.weibo.com/article/m/show/id/2309404268600402779506
 */
if (location.host === 'card.weibo.com') {
  // 默认显示全部内容：还有50%的精彩内容，作者设置为仅对粉丝可见
  GM.addStyle(`
  .f-art {height: auto !important;}
  .f-art-opt {display: none !important;}
  /* 隐藏推荐阅读 */
  .m-pictext-box1 {display: none !important;}
  `);
  // 标签页标题修改为文章标题
  const editTitle = () => {
    if (document.querySelectorAll('h2.f-art-tit').length !== 1) return;
    const realTitle = document.querySelector('h2.f-art-tit').textContent;
    if (document.title === realTitle) return;
    document.title = realTitle;
  };
  const observer = new MutationObserver(() => {
    editTitle();
  });
  observer.observe(document, {
    attributes: true,
    subtree: true,
  });
}

if (location.host === 'tw.news.yahoo.com') {
  // https://tw.news.yahoo.com/加泰隆尼亞挺獨活動染暴力-恐再傷經濟-122828054.html
  GM.addStyle(`.caas p {font-size: x-large !important;}`);
}

/**
 * 知乎
 * 部分解决 CSP 限制：https://violentmonkey.github.io/api/metadata-block/#inject-into
 * 无法伪装 UA：https://github.com/violentmonkey/violentmonkey/issues/562
 * 测试
 * https://zhuanlan.zhihu.com/p/23454166
 * https://www.zhihu.com/question/22790039/answer/377385800
 */
if (location.host.endsWith('.zhihu.com')) {
  // 为展开的完整链接加上下划线，否则混在大量文字中难以分辨。
  GM.addStyle(`
  .betterlink {text-decoration: underline}
  .OpenInAppButton {display: none !important;}
  `);
  const pure_zhihu = () => {
    // 完整显示外链文本
    if (document.getElementsByClassName(' external').length > 0) {
      for (let external of document.getElementsByClassName(' external')) {
        external.setAttribute('class', 'betterlink');
      }
    }
    // 知乎站内链接 https://www.zhihu.com/question/22790039/answer/194071653
    if (document.getElementsByClassName('internal').length > 0) {
      for (let internal of document.getElementsByClassName('internal')) {
        internal.setAttribute('class', 'betterlink');
      }
    }
    // 以下适配移动版
    if (!navigator.userAgent.includes('Mobile')) return;
    // 自动选择在浏览器继续阅读内容
    if (document.getElementsByClassName('ModalWrap-itemBtn').length > 1) {
      document.getElementsByClassName('ModalWrap-itemBtn')[1].click();
    }
    if (location.href.startsWith('https://www.zhihu.com/question/')) {
      // 问答自动展开全文
      const collapseds = document.getElementsByClassName(
        'RichContent is-collapsed RichContent--unescapable'
      );
      if (collapseds.length === 0) return;
      for (let collapsed of collapseds) {
        collapsed.setAttribute('class', 'RichContent RichContent--unescapable');
      }
      GM.addStyle(`
      div.RichContent-inner.RichContent-inner--collapsed[style] {
        max-height: none !important;
      }
      `);
      // 避免查看全部回答跳转 APP
      const ViewAllInappCard = document.getElementsByClassName('ViewAllInappCard');
      if (ViewAllInappCard.length === 1) {
        ViewAllInappCard[0].innerHTML = `<a href="https://www.zhihu.com${
          location.pathname.split('/answer')[0]
        }">${ViewAllInappCard[0].innerText}</a>`;
        ViewAllInappCard[0].setAttribute('class', 'betterlink');
      }
    }
    // 专栏移动端减少 APP 依赖，似乎依然无法打开评论
    // 文章和评论间的推荐阅读获取真实地址打开，去除该中间层即可
    if (location.href.startsWith('https://zhuanlan.zhihu.com/p/')) {
      const empty = document.querySelector('div[class=""]');
      if (empty.innerHTML.includes('<ul class="">')) {
        empty.innerHTML = empty.innerHTML.replace('<ul class="">', '');
      }
    }
  };
  const observer = new MutationObserver(() => {
    pure_zhihu();
  });
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}
