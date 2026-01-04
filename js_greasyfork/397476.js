// ==UserScript==
// @name        自动展开全文（停更，详细请看说明）
// @namespace   Show me all post.
// @icon        https://i.v2ex.co/81ToM02ss.png
// @grant       GM_addStyle
// @grant       GM_info
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_openInTab
// @inject-into content
// @version     0.59.105x
// @author      稻米鼠
// @description 自动展开网站内容而无需点击。【本脚本停更（详情请看： https://greasyfork.org/zh-CN/scripts/397476 ），转入 Beta 版】， Beta 版地址： https://meta.appinn.net/t/17991
// @supportURL  https://meta.appinn.net/t/14383
// @homepageURL https://meta.appinn.net/t/14383
// @resource
// @match       *://www.zhihu.com/question/*
// @match       *://www.zhihu.com/tardis/*
// @match       *://blog.csdn.net/*/article/details/*
// @match       *://bbs.csdn.net/topics/*
// @match       *://www.bilibili.com/video/av*
// @match       *://www.bilibili.com/video/BV*
// @match       *://m.bilibili.com/video/av*
// @match       *://www.youtube.com/watch?v=*
// @match       *://m.youtube.com/watch?v=*
// @match       *://www.acfun.cn/v/ac*
// @match       *://m.acfun.cn/v/?ac=*
// @match       *://www.ipaperclip.net/doku.php?id=*
// @match       *://ipaperclip.net/doku.php?id=*
// @match       *://zhidao.baidu.com/question/*
// @match       *://wap.peopleapp.com/article/*
// @match       *://*.ifeng.com/*
// @match       *://www.javascriptcn.com/*
// @match       *://www.360doc.com/content/*
// @match       *://www.360doc.cn/article/*
// @match       *://www.iteye.com/blog/*
// @match       *://sports.sina.cn/*
// @match       *://3g.163.com/*
// @match       *://c.m.163.com/news/a/*
// @match       *://xw.qq.com/*
// @match       *://kandianshare.html5.qq.com/v*
// @match       *://m.toutiao.com/*
// @match       *://chejiahao.m.autohome.com.cn/i*
// @match       *://post.m.smzdm.com/p/*
// @match       *://m.smzdm.com/p/*
// @match       *://m.iask.sina.com.cn/b/*
// @match       *://m.tiexue.net/touch/thread_*
// @match       *://baijiahao.baidu.com/s?id=*
// @match       *://www.bandbbs.cn/threads/*
// @match       *://cloud.tencent.com/developer/article/*
// @match       *://book.douban.com/subject/*
// @match       *://m.douban.com/note/*
// @match       *://m.douban.com/group/topic/*
// @match       *://www.jianshu.com/p/*
// @match       *://www.chinaz.com/*
// @match       *://www.pinlue.com/article/*
// @match       *://m.jiemian.com/article/*
// @match       *://www.bilibili.com/read/mobile/*
// @match       *://kuaibao.qq.com/s/*
// @match       *://yq.aliyun.com/articles/*
// @match       *://jingyan.baidu.com/article/*
// @match       *://m.huxiu.com/article/*
// @match       *://*.sina.cn/*
// @match       *://www.xiaohongshu.com/*
// @match       *://m.sohu.com/a/*
// @match       *://www.hao123.com/*
// @match       *://www.baiven.com/*
// @match       *://www.yuque.com/*
// @match       *://m.thepaper.cn/newsDetail_forward_*
// @match       *://m.guancha.cn/*
// @match       *://upage.html5.qq.com/*
// @match       *://m.guokr.com/article/*
// @match       *://www.xjishu.com/*
// @match       *://mbd.baidu.com/*
// @match       *://xiaozhuanlan.com/topic/*
// @match       *://ddrv.cn/a/*
// @match       *://www.reddit.com/*
// @match       *://www.meipian.cn/*
// @downloadURL https://update.greasyfork.org/scripts/397476/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%EF%BC%88%E5%81%9C%E6%9B%B4%EF%BC%8C%E8%AF%A6%E7%BB%86%E8%AF%B7%E7%9C%8B%E8%AF%B4%E6%98%8E%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/397476/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%EF%BC%88%E5%81%9C%E6%9B%B4%EF%BC%8C%E8%AF%A6%E7%BB%86%E8%AF%B7%E7%9C%8B%E8%AF%B4%E6%98%8E%EF%BC%89.meta.js
// ==/UserScript==

(function(){  // 即时执行函数 Start
GM_addStyle = GM_addStyle ? GM_addStyle : (css)=>{
  const style = document.createElement('style')
  style.id = 'show-me-all-post'
  style.innerHTML = css
  document.head.appendChild(style)
}
const rules = [
  {
    // 知乎 - 移动端页面
    reg: /^http(s)?:\/\/(www\.)?zhihu\.com\/(question\/\d+|tardis\/\w+)/i,
    remove: ['.RichContent--unescapable.is-collapsed .ContentItem-rightButton', '.sgui-slide-down'],
    content: [
      '.Body--Mobile .RichContent.is-collapsed .RichContent-inner',
      '.RichContent--unescapable.is-collapsed .RichContent-inner',
      '.App',
    ],
    style: `
    .RichContent.is-collapsed {
      cursor: auto !important;
    }
    .RichContent--unescapable.is-collapsed .RichContent-inner {
      -webkit-mask-image: none !important;
      mask-image: none !important;
    }
    `,
  },
  {
    // CSDN 博客 - PC & 移动端页面
    reg: /^http(s)?:\/\/blog\.csdn\.net\/[^/]+\/article\/details\/\d+/i,
    remove: ['div.hide-article-box', '.readall_box', '#writeGuide'],
    content: ['#article_content', '#article .article_content'],
  },
  {
    // CSDN 论坛 - PC & 移动端页面
    reg: /^http(s)?:\/\/bbs\.csdn\.net\/topics\/\d+/i,
    remove: ['.hide_topic_box', '.readall_wrap', '#writeGuide'],
    content: ['.container-box .bbs_detail_wrap', '.first_show'],
  },
  {
    // B 站视频简介
    reg: /^http(s)?:\/\/(www\.)?bilibili\.com\/video\/(av\d+|bv\w+)/i,
    remove: ['.video-desc .btn'],
    content: ['.video-desc .info'],
  },
  {
    // B 站移动端视频标题
    reg: /^http(s)?:\/\/m\.bilibili\.com\/video\/av\d+/i,
    remove: [
      '.index__videoInfo__src-videoPage-videoInfo- .index__foldSwitch__src-videoPage-videoInfo-',
    ],
    content: [
      '.index__videoInfo__src-videoPage-videoInfo- .index__title__src-videoPage-videoInfo-',
      '.index__descWrap__src-videoPage-infoBlock-',
    ],
    style: `
    .index__videoInfo__src-videoPage-videoInfo- .index__title__src-videoPage-videoInfo- .index__titleContent__src-videoPage-videoInfo- {
        white-space: normal !important;
      }
    `,
  },
  {
    // Youtube 视频简介
    reg: /^http(s)?:\/\/(www\.)?youtube\.com\/watch\?v=\w+/i,
    remove: ['#container paper-button#more'],
    content: ['#container #content.ytd-expander'],
  },
  {
    // Youtube 移动端视频标题
    reg: /^http(s)?:\/\/m\.youtube\.com\/watch\?v=\w+/i,
    remove: [],
    content: [],
    script: () => {
      document.querySelector('button.slim-video-metadata-header').click();
    },
  },
  {
    // AcFun 视频简介
    reg: /^http(s)?:\/\/(www\.)?acfun\.cn\/v\/ac\d+/i,
    remove: ['#main .introduction .desc-operate'],
    content: ['#main .introduction .content-description.gheight'],
    style: `
      #main .introduction .content-description.gheight .tag {
        display: block !important;
      }
    `,
  },
  {
    // AcFun 移动端视频标题
    reg: /^http(s)?:\/\/m\.acfun\.cn\/v\/\?ac=\d+/i,
    remove: ['.video-title .down'],
    content: [],
    script: () => {
      document
        .querySelector('.video-title .info-title')
        .classList.remove('hide-more');
    },
  },
  {
    // 回形针手册
    reg: /^http(s)?:\/\/(www\.)?ipaperclip\.net\/doku\.php\?id=.*/i,
    remove: ['.paperclip__showcurtain'],
    content: ['.paperclip__h1content__wrapped'],
  },
  {
    // 百度知道
    reg: /^http(s)?:\/\/zhidao\.baidu\.com\/question\/\d+\.html/i,
    remove: [
      '.wgt-ask .q-content .conSamp',
      '.wgt-ask .expend',
      '.wgt-answers .answer-text .wgt-answers-mask',
      'div.wgt-best .best-text .wgt-best-mask',
      '.iknow-root-dom-element .wgt-question-desc-explode .wgt-question-desc .wgt-question-desc-action',
      '.iknow-root-dom-element .w-detail-full-new .newyl-fold',
      '.iknow-root-dom-element .w-detail-full .w-detail-display-btn',
      '.iknow-root-dom-element .w-detail-dis-na-btn',
      '.wgt-answers #show-hide-container',
    ],
    content: [
      '.wgt-answers .answer-text',
      'div.wgt-best .best-text',
      '.iknow-root-dom-element .wgt-question-desc-explode .wgt-question-desc .wgt-question-desc-inner',
      '.iknow-root-dom-element .w-detail-full-new .w-detail-newyl.fold',
      '.iknow-root-dom-element .w-detail-full .w-detail-container',
      '.wgt-answers .answer-hide',
      '.wgt-answers .wgt-pager',
    ],
    style: `
      .wgt-ask .q-content .conTemp, .wgt-ask .q-content .con-all {
        display: block !important;
      }
      .iknow-root-dom-element .wgt-question-desc-explode .wgt-question-desc .wgt-question-desc-inner {
        width: auto !important;
        white-space: normal !important;
      }
      .wgt-answers .answer-hide {
        visibility: visible;
      }
      .wgt-answers .wgt-pager {
        display: block !important;
      }
    `,
  },
  {
    // 人民日报
    reg: /^http(s)?:\/\/wap\.peopleapp\.com\/article\/\d+/i,
    remove: ['.read-more'],
    content: ['.article-wrapper.has-more-high'],
  },
  {
    // 澎湃新闻（移动版）
    reg: /^http(s)?:\/\/m\.thepaper\.cn\/newsDetail_forward_\d+/i,
    remove: ['a.news_open_app', '.news_part_all', '#carousel_banner.bot_banner'],
    content: ['.news_part_limit'],
  },
  {
    // 凤凰网
    reg: /^http(s)?:\/\/\w+\.ifeng\.com\/.*/i,
    remove: [],
    content: [],
    script: () => {
      document.querySelectorAll('*').forEach((el) => {
        for (let i = 0; i < el.classList.length; i++) {
          const elClass = el.classList[i];
          if (/^(main_content|containerBox)-[a-zA-Z0-9]+/.test(elClass)) {
            el.style.height = 'auto';
            el.style.maxHeight = 'none';
          } else if (
            /^(more-1|tip|bottom_box|ad_box|shadow|callupBtn|bottomSlide|headerInfo|fixedIcon)-[a-zA-Z0-9]+/.test(
              elClass
            )
          ) {
            el.style.display = 'none';
          }
        }
      });
    },
  },
  {
    // JavaScript中文网
    reg: /^http(s)?:\/\/(www\.)?javascriptcn\.com\/.*/i,
    remove: ['.readall_box'],
    content: ['.markdown-body'],
  },
  {
    // 360doc 个人图书馆
    reg: /^http(s)?:\/\/(www\.)?360doc\.com\/content\/.*/i,
    remove: ['.article_showall'],
    content: ['.articleMaxH .article_container'],
  },
  {
    // 360doc 个人图书馆（移动端）
    reg: /^http(s)?:\/\/(www\.)?360doc\.cn\/article\/.*/i,
    remove: ['.article_showall'],
    content: ['.article_maxh'],
  },
  {
    // ITeye
    reg: /^http(s)?:\/\/(www\.)?iteye\.com\/blog\//i,
    remove: ['.hide-article-box'],
    content: ['.hide-main-content'],
  },
  {
    // 新浪体育（移动端）
    reg: /^http(s)?:\/\/sports\.sina\.cn\/.*/i,
    remove: ['.look_more'],
    content: ['.art_box'],
  },
  {
    // 手机网易
    reg: /^http(s)?:\/\/3g\.163\.com\/.*/i,
    remove: ['.footer'],
    content: ['article'],
    style: `article .content .page {
      display: block !important;
    }`
  },
  {
    // 腾讯新闻
    reg: /^http(s)?:\/\/xw\.qq\.com\/.*/i,
    remove: ['.collapseWrapper', '#article_body > .mask'],
    content: ['#article_body'],
  },
  {
    // 头条移动版
    reg: /^http(s)?:\/\/m\.toutiao\.com\/\w+\//i,
    remove: ['.unfold-field'],
    content: ['.article', '.article>div', '.article .article__content'],
  },
  {
    // 汽车之家（手机版）
    reg: /^http(s)?:\/\/(\w+\.)?m\.autohome\.com\.cn\/\w+\//i,
    remove: ['.pgc-details .continue_reading'],
    content: [],
    script: () => {
      document.querySelectorAll('#content .fn-hide').forEach((el) => {
        el.classList.remove('fn-hide');
      });
    },
  },
  {
    // 张大妈移动端
    reg: /^http(s)?:\/\/(post\.)?m\.smzdm\.com\/p\/\w+/i,
    remove: ['.article-wrapper .expand-btn', '.foot-banner'],
    content: ['.article-wrapper'],
  },
  {
    // 爱问移动版
    reg: /^http(s)?:\/\/m\.iask\.sina\.com\.cn\/b\/\w+\.html/i,
    remove: ['.answer_lit'],
    content: [],
    style: `
      .answer_all{
        display: block !important;
      }
    `,
  },
  {
    // 铁血移动版
    reg: /^http(s)?:\/\/m\.tiexue\.net\/touch\/thread_\d+/i,
    remove: ['.yxqw'],
    content: ['.articleCont'],
  },
  {
    // 百度百家号
    reg: /^http(s)?:\/\/(baijiahao|mbd)\.baidu\.com\//i,
    remove: ['.packupButton', '.contentMedia .openImg'],
    content: ['.mainContent'],
  },
  {
    // 米坛
    reg: /^http(s)?:\/\/(www\.)?bandbbs\.cn\/threads\/\d+/i,
    remove: [
      '.u-bottomFixer',
      '.bbCodeBlock--expandable.is-expandable .bbCodeBlock-expandLink',
    ],
    content: ['.bbCodeBlock--expandable .bbCodeBlock-expandContent'],
  },
  {
    // 腾讯云社区
    reg: /^http(s)?:\/\/cloud\.tencent\.com\/developer\/article\/\d+/i,
    remove: ['.com-markdown-collpase-hide .com-markdown-collpase-toggle'],
    content: ['.com-markdown-collpase-hide .com-markdown-collpase-main'],
  },
  {
    // 豆瓣图书
    reg: /^http(s)?:\/\/book\.douban\.com\/subject\/\d+/i,
    remove: [],
    content: [],
    script: () => {
      document.querySelectorAll('.indent > .short').forEach((el) => {
        el.classList.add('hidden');
      });
      document.querySelectorAll('.indent > .all').forEach((el) => {
        el.classList.remove('hidden');
      });
    },
  },
  {
    // 简书移动版
    reg: /^http(s)?:\/\/(w+\.)?jianshu\.com\/p\/\w+/i,
    remove: ['#note-show .content .show-content-free .collapse-tips'],
    content: ['#note-show .content .show-content-free .collapse-free-content'],
  },
  {
    // 站长之家
    reg: /^http(s)?:\/\/(w+\.)?chinaz\.com\/\w+/i,
    remove: ['.contentPadding'],
    content: ['#article-content'],
  },
  {
    // 品略
    reg: /^http(s)?:\/\/(w+\.)?pinlue\.com\/article\//i,
    remove: ['.readall_box'],
    content: ['.textcontent'],
  },
  {
    // 品略
    reg: /^http(s)?:\/\/m\.jiemian\.com\/article\/\d+/i,
    remove: ['.content-fold .show-change'],
    content: ['.article-main'],
  },
  {
    // 豆瓣日记
    reg: /^http(s)?:\/\/m\.douban\.com\/note\/\d+/i,
    remove: ['.oia-readall .read-all'],
    content: ['.note-content'],
  },
  {
    // Bilibili 专栏
    reg: /^http(s)?:\/\/(w+\.)?bilibili\.com\/read\/mobile\/\d+/i,
    remove: ['.max-content .load-more', '.h5-download-bar'],
    content: ['.max-content.limit'],
  },
  {
    // 看点快报
    reg: /^http(s)?:\/\/kuaibao\.qq\.com\/s\/\d+/i,
    remove: [
      '.share-page-additional',
      '.container .show-more',
      '.kb-bottom-fixed-wrapper',
    ],
    content: ['.container .content'],
  },
  {
    // 云栖社区
    reg: /^http(s)?:\/\/yq\.aliyun\.com\/articles\/\d+/i,
    remove: ['.article-hide-content .article-hide-box'],
    content: ['.article-hide-content'],
  },
  {
    // 百度经验
    reg: /^http(s)?:\/\/jingyan\.baidu\.com\/article\/\w+/i,
    remove: ['.read-whole-mask'],
    content: ['.exp-content-container.fold'],
  },
  {
    // 豆瓣小组
    reg: /^http(s)?:\/\/m\.douban\.com\/group\/topic\/\d+/i,
    remove: ['.oia-readall'],
    content: ['.note-content'],
  },
  {
    // 虎嗅移动版
    reg: /^http(s)?:\/\/m\.huxiu\.com\/article\/\d+/i,
    remove: ['.fresh-article-wrap'],
    content: ['#m-article-detail-page > .js-mask-box'],
  },
  {
    // 新浪新闻
    reg: /^http(s)?:\/\/\w+\.sina\.cn\/.*/i,
    remove: ['.look_more'],
    content: ['article.art_box'],
  },
  {
    // 小红书
    reg: /^http(s)?:\/\/(w+\.)?xiaohongshu\.com\/discovery\/item\/\w+/i,
    remove: ['.check-more'],
    content: ['.content'],
  },
  {
    // 搜狐
    reg: /^http(s)?:\/\/m\.sohu\.com\/a\/\w+/i,
    remove: ['.lookall-box'],
    content: [],
    style: `.hidden-content.hide {
      display: block;
    }`,
  },
  {
    // 网易新闻移动端
    reg: /^http(s)?:\/\/c\.m\.163\.com\/news\/a\/\w+/i,
    remove: ['.g-article .show-more-wrap', '.g-btn-open-newsapp', '.widget-slider', '.g-top-slider'],
    content: ['.g-article'],
  },
  {
    // 好123
    reg: /^http(s)?:\/\/(w+\.)?hao123\.com/i,
    remove: ['.content-cover'],
    content: [],
    style: `.coolsites-wrapper {
      display: block !important;
    }`,
  },
  {
    // 百问中文
    reg: /^http(s)?:\/\/(w+\.)?baiven\.com\/\w\/\d+/i,
    remove: ['.readall_box'],
    content: ['.article .article-content'],
  },
  {
    // 语雀
    reg: /^http(s)?:\/\/(w+\.)?yuque\.com\/\w+/i,
    remove: ['div[data-testid="doc-reader-login-card"]'],
    content: ['.yuque-doc-content'],
  },
  {
    // 腾讯看点
    reg: /^http(s)?:\/\/kandianshare\.html5\.qq\.com\/v\d\//i,
    remove: ['.article-mask', '.share-bottom-tips-wrap'],
    content: ['.at-content'],
  },
  {
    // 观察者网
    reg: /^http(s)?:\/\/m\.guancha\.cn\/\w+\/[\d_]+/i,
    remove: ['.textPageCont-footer', '.downloadBtn-box', '#downloadBtn-position'],
    content: ['.textPageCont'],
  },
  {
    // 腾讯看点快报
    reg: /^http(s)?:\/\/upage\.html5\.qq\.com\/kuaibao-detail\?/i,
    remove: ['.container .at-content>div:last-child'],
    content: ['.container .at-content'],
  },
  {
    // 果壳网
    reg: /^http(s)?:\/\/m\.guokr\.com\/article\/\d+/i,
    remove: ['div[class*=ShowAllArticle]'],
    content: ['div[class*=ArticleContent]'],
  },
  {
    // x 技术
    reg: /^http(s)?:\/\/(www\.)?xjishu\.com\//i,
    remove: ['.gradBox', '.readBox'],
    content: ['.con-box'],
  },
  {
    // 小专栏
    reg: /^http(s)?:\/\/xiaozhuanlan\.com\/topic\/\d+/i,
    remove: [],
    content: [
      '.xzl-topic-summary-content.hidden_topic_body.hidden',
    ],
    style: `
    .xzl-topic-summary-content.hidden_topic_body.hidden {
      display: block !important;
    }
    `
  },
  {
    // 算法网
    reg: /^http(s)?:\/\/ddrv\.cn\/a\/\d+/i,
    remove: ['#read-more-wrap'],
    content: ['#container']
  },
  {
    // 美篇
    reg: /^http(s)?:\/\/(www\.)meipian\.cn\//i,
    remove: ['.readmore'],
    content: ['.mp-content .section'],
  },
  {
    // reddit
    reg: /^http(s)?:\/\/(www\.)reddit\.com\//i,
    remove: ['.read-more'],
    content: [],
    script: ()=>{
      document.body.querySelectorAll('div').forEach(e=>{
        if(/^\d+px$/i.test(e.style.maxHeight) && e.nextElementSibling && /button/i.test(e.nextElementSibling.tagName) ){
          e.style = ''
          e.nextElementSibling.classList.add('read-more')
        }
      })
    }
  },
];
for (const rule of rules) {
  if (rule.reg.test(window.location.href)) {
    const removeEls = rule.remove.join(',\n');
    const contentEls = rule.content.join(',\n');
    GM_addStyle(
      (rule.remove
        ? removeEls +
          ` {
            display: none !important;
          }\n`
        : ``) +
        (rule.content
          ? contentEls +
            ` {
            height: auto !important;
            max-height: none !important;
          }\n`
          : ``) +
        (rule.style ? rule.style : ``)
    );
    if (typeof rule.script === 'function') {
      window.addEventListener('load', rule.script);
    }
    break;
  }
}
const todayMark = Math.floor(+new Date() / 864e5); // 获取今日时间标记
const recordMark = GM_getValue('Alerted', 0); // 获取记录中时间标记
if(recordMark !== todayMark){
  GM_deleteValue('timeMark')
  alert('【自动展开全文】脚本停更，会自动跳转到详细说明页。大家可自行卸载脚本，或更换到 Beta 版')
  GM_openInTab('https://greasyfork.org/zh-CN/scripts/397476')
  GM_setValue('Alerted', todayMark)
}
// 即时执行函数 End
})()