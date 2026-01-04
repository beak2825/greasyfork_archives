// ==UserScript==
// @name                自动收起知乎含有手机截图的回答
// @description:zh-CN   手机截图在桌面端很占用空间影响阅读，这个脚本会在滚动屏幕的时候自动收起这些回答
// @author linonetwo
// @namespace           https://onetwo.ren/
// @match               *://*.zhihu.com/*
// @exclude             *://*.zhihu.com/question/*/answer/*
// @grant none
// @version             0.2.0
// @homepageURL         https://github.com/linonetwo/zhihu-linonetwo-userscripts
// @supportURL          https://github.com/linonetwo/zhihu-linonetwo-userscripts/issues
// @license             MIT
// @icon                https://pic1.zhimg.com/2e33f063f1bd9221df967219167b5de0_m.jpg
// @run-at 		        document-start
// @date                04/10/2019
// @modified            04/11/2019
// @description 手机截图在桌面端很占用空间影响阅读，这个脚本会在滚动屏幕的时候自动收起这些回答
// @downloadURL https://update.greasyfork.org/scripts/381650/%E8%87%AA%E5%8A%A8%E6%94%B6%E8%B5%B7%E7%9F%A5%E4%B9%8E%E5%90%AB%E6%9C%89%E6%89%8B%E6%9C%BA%E6%88%AA%E5%9B%BE%E7%9A%84%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/381650/%E8%87%AA%E5%8A%A8%E6%94%B6%E8%B5%B7%E7%9F%A5%E4%B9%8E%E5%90%AB%E6%9C%89%E6%89%8B%E6%9C%BA%E6%88%AA%E5%9B%BE%E7%9A%84%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==
const userscriptautocollapsed = 'userscriptautocollapsed';
const 常见手机纵横比 = 16 / 9;
const 检查间隔毫秒 = 200;

function autoFoldAnswerWithMobileScreenShot() {
  const 收起按钮们 = [...document.querySelectorAll('figure > img')] // 知乎的图片放在 figure 里面
    .filter(img => {
      const height = Number(img.getAttribute('data-rawheight'));
      const width = Number(img.getAttribute('data-rawwidth'));
      return height && width && height > width * (常见手机纵横比);
    })
    .map(img => img.closest('.RichContent')) // 获取回答框
    .filter(回答框 => !回答框.dataset[userscriptautocollapsed]) // 不让它们被收起第二次
    .map(回答框 => {
      // 获取按钮并点击
      const 答案底部按钮们 = 回答框.querySelectorAll('div.ContentItem-actions > button')
      const 收起按钮 = 答案底部按钮们[答案底部按钮们.length - 1];
      return 收起按钮;
    })
    .filter(收起按钮 => 收起按钮.innerText.includes('收起'));

  if (收起按钮们.length > 0) {
    // 准备好标记这些要被收起的框框，不让它们被收起第二次，如果你手动展开了它们的话
    const 收起的回答框们 = 收起按钮们
      .map(按钮 => 按钮.closest('.RichContent'))
      .forEach(回答框 => { 回答框.dataset[userscriptautocollapsed] = true });
    // 点击收起按钮
    收起按钮们.forEach(按钮 => 按钮.click());
    console.log(`有 ${收起按钮们.length} 个带有长图的答案需要收起`);
    console.log(`在电脑端自动收起所有纵横比大于 ${常见手机纵横比} 的 图片`);
  }
};

autoFoldAnswerWithMobileScreenShot();



// 知乎会延迟加载内容，所以在鼠标主动移动（用滚轮不算）到个人简介栏的时候再检查一次
// function addEventListenerToAnswerHeader() {
//   [...document.querySelectorAll('div.AuthorInfo')]
//   .forEach(用户信息栏 => 用户信息栏.addEventListener('mouseover', autoFoldAnswerWithMobileScreenShot, { passive : true }));
// }


// 知乎会延迟加载内容，所以当滚动页面的时候再检查一次
// From: https://www.sitepoint.com/throttle-scroll-events/
function throttle(fn, wait) {
  var time = Date.now();
  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  }
}
setTimeout(() => window.addEventListener('scroll', throttle(autoFoldAnswerWithMobileScreenShot, 检查间隔毫秒), { passive : true }), 1);
