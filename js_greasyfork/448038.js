// ==UserScript==
// @name         bilibili视频选集拉长-删去前缀-tampermonkey-removePrefix-bilibili
// @namespace    https://github.com/SoonIter/tampermonkey-removePrefix-bilibili
// @version      0.7
// @description  一个脚本解决bilibili视频分集的过长的问题
// @author       SoonIter
// @match        https://www.bilibili.com/video/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448038/bilibili%E8%A7%86%E9%A2%91%E9%80%89%E9%9B%86%E6%8B%89%E9%95%BF-%E5%88%A0%E5%8E%BB%E5%89%8D%E7%BC%80-tampermonkey-removePrefix-bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/448038/bilibili%E8%A7%86%E9%A2%91%E9%80%89%E9%9B%86%E6%8B%89%E9%95%BF-%E5%88%A0%E5%8E%BB%E5%89%8D%E7%BC%80-tampermonkey-removePrefix-bilibili.meta.js
// ==/UserScript==

(function () {
  //使用网站
  let wrap = true; // 如果为true，则 “视频选集” 的文字换行
  const configs = [
    {
      h1Title: '2022版Flink1.13实战教程', // 标题
      reg: /\d{2,}_(第(.*)章_)?/, // 删除的前缀
    },
    {
      h1Title: '尚硅谷Java入门视频教程',
      reg: /\d{2,}\.尚硅谷\_/,
    },
  ];
  let flag = false; //是否已经执行

  function modifyCss() {
    let styleDom = document.createElement('style');
    styleDom.innerHTML = `
    .video-episode-card__info-title{
         white-space:normal !important;
         max-height:100px !important;
    }
    .video-episode-card {
         height:auto !important;
         min-height:auto !important;
    }
    .video-section-list{
         height:auto !important;
         min-height:auto !important;
    }
    .video-episode-card__info{
         height:auto !important;
         min-height:auto !important;
    }

    .video-sections-content-list{
         height:auto !important;
         max-height:500px !important;
    }
    /* 去广告 */
    .vcd,#bannerAd,.video-page-special-card-small {
      height: 0px !important;
      width: 0px !important;
      overflow: hidden;
    }
    `;
    document.head.appendChild(styleDom);
    document.querySelectorAll('span.part').forEach(ele => {
      ele.style.whiteSpace = 'normal';
      ele.style.lineHeight = '20px';
    });
    document
      .querySelectorAll('.multi-page-v1 .cur-list .list-box li')
      .forEach(ele => {
        ele.style.height = 'auto';
      });
  }
  function doIt() {
    try {
      flag === false &&
        (function () {
          wrap && modifyCss();
          const title = document.querySelector('h1').title;
          const item = configs.find(i => title.search(i.h1Title) !== -1);
          if (item === undefined) {
            return;
          }
          const { h1Title, reg } = item;
          let arr = [];
          const parts = document.querySelectorAll('div.link-content');
          for (const parentDom of parts) {
            const Px = parentDom.querySelector('span.page-num');
            arr.push(Px.innerHTML);
            arr.push(' ');
            const dom = parentDom.querySelector('span.part');
            const content = dom.innerHTML;
            const newContent = content.replace(reg, '');
            dom.innerHTML = newContent;
            arr.push(newContent);
            arr.push('\n');
          }
          console.log(
            '%c tampermonkey-removePrefix-bilibili:执行脚本成功:',
            'color:white;background:green;',
            arr.join(''),
          );
        })();
      flag = true;
    } catch (err) {
      console.log(
        '%c tampermonkey-removePrefix-bilibili:发生未知错误:',
        'color:white;background:red;',
        err.message,
      );
    }
  }
  const callback = function (records) {
    if (flag !== false) {
      return;
    }
    records.forEach(function (record) {
      const dom = record.target;
      const { className } = dom;
      if (
        typeof className === 'string' &&
        className.includes('right-container')
      ) {
        doIt();
      }
    });
  };
  const observer = new MutationObserver(callback);
  const observeDOM = document.body;
  observer.observe(observeDOM, {
    childList: true,
    subtree: true,
  });
})();
