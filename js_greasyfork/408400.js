// ==UserScript==
// @name        Style for mobile
// @namespace   daimon2k
// @match       *://*.huxiu.com/*
// @match       *://*.zhihu.com/*
// @match       *://*.csdn.net/*
// @match       *://*.bilibili.com/*
// @match       *://*.youtube.com/*
// @match       *://*.acfun.cn/*
// @match       *://*.ipaperclip.net/*
// @match       *://*.peopleapp.com/*
// @match       *://*.thepaper.cn/*
// @match       *://*.ifeng.com/*
// @match       *://*.javascriptcn.com/*
// @match       *://*.360doc.com/*
// @match       *://*.360doc.cn/*
// @match       *://*.iteye.com/*
// @match       *://*.sina.cn/*
// @match       *://*.163.com/*
// @match       *://*.qq.com/*
// @match       *://*.toutiao.com/*
// @match       *://*.autohome.com.cn/*
// @match       *://*.smzdm.com/*
// @match       *://*.iask.sina.com.cn/*
// @match       *://*.tiexue.net/*
// @match       *://*.baidu.com/*
// @match       *://*.bandbbs.cn/*
// @match       *://*.cloud.tencent.com/*
// @match       *://*.jianshu.com/*
// @match       *://*.chinaz.com/*
// @match       *://*.pinlue.com/*
// @match       *://*.jiemian.com/*
// @match       *://*.m.douban.com/*
// @match       *://*.book.douban.com/*
// @match       *://*.kuaibao.qq.com/*
// @match       *://*.yq.aliyun.com/*
// @match       *://*.jingyan.baidu.com/*
// @match       *://*.sina.cn/*
// @match       *://*.xiaohongshu.com/*
// @match       *://*.sohu.com/*
// @match       *://*.hao123.com/*
// @match       *://*.baiven.com/*
// @match       *://*.yuque.com/*
// @match       *://*.kandianshare.html5.qq.com/*
// @match       *://*.guancha.cn/*
// @match       *://*.upage.html5.qq.com/*
// @match       *://*.guokr.com/*
// @match       *://*.xjishu.com/*
// @match       *://*.xiaozhuanlan.com/*
// @match       *://*.ddrv.cn/*
// @match       *://*.meipian.cn/*
// @match       *://*.reddit.com/*
// @grant       none
// @version     1.2
// @author      daimon2k
// @description forked from
// @downloadURL https://update.greasyfork.org/scripts/408400/Style%20for%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/408400/Style%20for%20mobile.meta.js
// ==/UserScript==

(function() {
  console.log('daimon2k script started.')
  
  // Style definitions
  const styles = {
    'huxiu.com': {
      remove: ['.placeholder-box', '.fresh-article-wrap'],
      content: ['#m-article-detail-page > .js-mask-box'],
      relative: ['.article-detail-swiper-container', '.js-top-fixed']
    },
    'zhihu.com': {
      remove: [
        '.Button--blue', '.RichContent--unescapable.is-collapsed .ContentItem-rightButton',
        '.OpenInAppButton', '.OpenInApp', '.MobileAppHeader', '.ModalWrap'],
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
      script: ()=>{
        for (const button of document.querySelectorAll('.ModalWrap-itemBtn')) {
          if (button.innerText == '继续') button.click()
        }
      }
    },
    'csdn.net': {
      remove: ['div.hide-article-box', '.readall_box', '#writeGuide', '.readall_wrap', '.hide_topic_box'],
      content: ['#article_content', '#article .article_content', '.container-box .bbs_detail_wrap', '.first_show']
    },
    'bilibili.com': {
      remove: [],
      content: ['.fold-container'],
      style: `.ex-title, .title {overflow: visible !important;}`
    },
    'youtube.com': {
      reg: /^http(s)?:\/\/(www\.)?youtube\.com\/watch\?v=\w+/i,
      remove: ['#container paper-button#more'],
      content: ['#container #content.ytd-expander'],
      script: () => {
        document.querySelector('button.slim-video-metadata-header').click();
      }
    },
    'acfun.cn': {
      remove: ['#main .introduction .desc-operate', '.video-title .down', '.open-app-btn', '#common_profit_fixed', '#header', '.back-top', '.more-main-comment'],
      content: ['#main .introduction .content-description.gheight'],
      style: `
        #main .introduction .content-description.gheight .tag {
          display: block !important;
        }
      `,
      script: () => {
        document.querySelector('.video-title .info-title').classList.remove('hide-more');
        document.querySelector('.open-app-confirm-box-btn .left-btn').click();
      }
    },
    'ipaperclip.net': {
      remove: ['.paperclip__showcurtain'],
      content: ['.paperclip__h1content__wrapped'],
    },
    'peopleapp.com': {
      remove: ['.read-more'],
      content: ['.article-wrapper.has-more-high'],
    },
    'thepaper.cn': {
      remove: ['a.news_open_app', '.news_part_all', '#carousel_banner.bot_banner'],
      content: ['.news_part_limit'],
    },
    'ifeng.com': {
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
      }
    },
    'javascriptcn.com': {
      remove: ['.readall_box'],
      content: ['.markdown-body'],
    },
    '360doc.com': {
      remove: ['.article_showall'],
      content: ['.articleMaxH .article_container'],
    },
    '360doc.cn': {
      remove: ['.article_showall'],
      content: ['.article_maxh'],
    },
    'iteye.com': {
      remove: ['.hide-article-box'],
      content: ['.hide-main-content'],
    },
    'sina.cn': {
      remove: ['.look_more'],
      content: ['.art_box'],
    },
    '163.com': {
      remove: ['.footer', '.g-article .show-more-wrap', '.g-btn-open-newsapp', '.widget-slider', '.g-top-slider'],
      content: ['article', '.g-article'],
      style: `article .content .page {display: block !important;}`
    },
    'qq.com': {
      remove: ['.collapseWrapper', '#article_body > .mask'],
      content: ['#article_body'],
    },
    'toutiao.com': {
      remove: ['.unfold-field'],
      content: ['.article', '.article>div', '.article .article__content'],
    },
    'autohome.com.cn': {
      remove: ['.pgc-details .continue_reading'],
      content: [],
      script: () => {
        document.querySelectorAll('#content .fn-hide').forEach((el) => {
          el.classList.remove('fn-hide');
        });
      },
    },
    'smzdm.com': {
      remove: ['.article-wrapper .expand-btn', '.foot-banner'],
      content: ['.article-wrapper'],
    },
    'iask.sina.com.cn': {
      reg: /^http(s)?:\/\/m.iask.sina.com.cn\/b\/\w+.html/i,
      remove: ['.answer_lit'],
      content: [],
      style: `
        .answer_all{
          display: block !important;
        }
      `,
    },
    'tiexue.net': {
      remove: ['.yxqw'],
      content: ['.articleCont'],
    },
    'baidu.com': { // baijiahao|mbd).baidu.com
      remove: ['.packupButton', '.contentMedia .openImg'],
      content: ['.mainContent'],
    },
    'bandbbs.cn': {
      remove: [
        '.u-bottomFixer',
        '.bbCodeBlock--expandable.is-expandable .bbCodeBlock-expandLink',
      ],
      content: ['.bbCodeBlock--expandable .bbCodeBlock-expandContent'],
    },
    'cloud.tencent.com': {
      remove: ['.com-markdown-collpase-hide .com-markdown-collpase-toggle'],
      content: ['.com-markdown-collpase-hide .com-markdown-collpase-main'],
    },
    'jianshu.com': {
      remove: ['#note-show .content .show-content-free .collapse-tips'],
      content: ['#note-show .content .show-content-free .collapse-free-content'],
    },
    'chinaz.com': {
      remove: ['.contentPadding'],
      content: ['#article-content'],
    },
    'pinlue.com': {
      remove: ['.readall_box'],
      content: ['.textcontent'],
    },
    'jiemian.com': {
      reg: /^http(s)?:\/\/m.jiemian.com\/article\/\d+/i,
      remove: ['.content-fold .show-change'],
      content: ['.article-main'],
    },
    'm.douban.com': {
      remove: ['.oia-readall'],
      content: ['.note-content'],
    },
    'book.douban.com': {
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
    'kuaibao.qq.com': {
      remove: [
        '.share-page-additional',
        '.container .show-more',
        '.kb-bottom-fixed-wrapper',
      ],
      content: ['.container .content'],
    },
    'yq.aliyun.com': {
      remove: ['.article-hide-content .article-hide-box'],
      content: ['.article-hide-content'],
    },
    'jingyan.baidu.com': {
      remove: ['.read-whole-mask'],
      content: ['.exp-content-container.fold'],
    },
    'sina.cn': {
      remove: ['.look_more'],
      content: ['article.art_box'],
    },
    'xiaohongshu.com': {
      remove: ['.check-more'],
      content: ['.content'],
    },
    'sohu.com': {
      remove: ['.lookall-box'],
      content: [],
      style: `.hidden-content.hide {display: block;}`,
    },
    'hao123.com': {
      remove: ['.content-cover'],
      content: [],
      style: `.coolsites-wrapper {display: block !important;}`,
    },
    'baiven.com': {
      remove: ['.readall_box'],
      content: ['.article .article-content'],
    },
    'yuque.com': {
      remove: ['div[data-testid="doc-reader-login-card"]'],
      content: ['.yuque-doc-content'],
    },
    'kandianshare.html5.qq.com': {
      remove: ['.article-mask', '.share-bottom-tips-wrap'],
      content: ['.at-content'],
    },
    'guancha.cn': {
      remove: ['.textPageCont-footer', '.downloadBtn-box', '#downloadBtn-position'],
      content: ['.textPageCont'],
    },
    'upage.html5.qq.com': {
      remove: ['.container .at-content>div:last-child'],
      content: ['.container .at-content'],
    },
    'guokr.com': {
      remove: ['div[class*=ShowAllArticle]'],
      content: ['div[class*=ArticleContent]'],
    },
    'xjishu.com': {
      remove: ['.gradBox', '.readBox'],
      content: ['.con-box'],
    },
    'xiaozhuanlan.com': {
      remove: [],
      content: [
        '.xzl-topic-summary-content.hidden_topic_body.hidden',
      ],
      style: `.xzl-topic-summary-content.hidden_topic_body.hidden {display: block !important;}`
    },
    'ddrv.cn': {
      remove: ['#read-more-wrap'],
      content: ['#container']
    },
    'meipian.cn': {
      remove: ['.readmore'],
      content: ['.mp-content .section'],
    },
    'reddit.com': {
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
    }
  }

  const splitedHost = window.location.host.split(".")
  let foundHost = ''
  for (let i = 0; i < splitedHost.length - 1; ++i)
  {
    const host = splitedHost.slice(i).join('.')
    if (host in styles) {
      foundHost = host
      break
    }
  }
  if (foundHost.length == 0)
  {
    console.log('daimon2k script domain styles not found.')
    return
  }

  console.log('daimon2k script found domain styles.')

  const rule = styles[foundHost]
  const removeEls = rule.remove.join(',')
  const contentEls = rule.content.join(',')
  let css =
    (rule.remove ? rule.remove.join(',') + `{display: none !important;}\n` : ``) +
    (rule.content ? rule.content.join(',') + `{height: auto !important; max-height: none !important;}\n` : ``) +
    (rule.relative ? rule.relative.join(',') + `{position: relative !important;}\n` : ``) +
    (rule.style ? rule.style : ``)

  // Add style
  console.log('Adding style:')
  console.log(css)
  let style = document.createElement('style')
  style.type = 'text/css'
  style.rel = 'stylesheet'
  style.appendChild(document.createTextNode(css))
  let head = document.getElementsByTagName('head')[0]
  head.appendChild(style)

  if (typeof rule.script === 'function') {
    window.addEventListener('load', rule.script)
  }

  console.log('daimon2k script finished.')
})();
