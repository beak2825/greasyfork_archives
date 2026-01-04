// ==UserScript==
// @name                自动屏蔽知乎三无用户的评论
// @description:zh-CN   自动屏蔽无头像、无贡献、不友善用户的评论（目前仅实现头像检测，贡献检测太耗流量、基于 SoLiD 的云黑名单还在实验中）
// @author linonetwo
// @namespace           https://onetwo.ren/
// @match               *://*.zhihu.com/*
// @grant none
// @version             0.2.2
// @homepageURL         https://github.com/linonetwo/zhihu-linonetwo-userscripts
// @supportURL          https://github.com/linonetwo/zhihu-linonetwo-userscripts/issues
// @license             MIT
// @icon                https://pic1.zhimg.com/2e33f063f1bd9221df967219167b5de0_m.jpg
// @run-at 		        document-start
// @date                04/10/2019
// @modified            04/11/2019
// @description 自动屏蔽无头像、无贡献、不友善用户的评论（目前仅实现头像检测，贡献检测太耗流量、基于 SoLiD 的云黑名单还在实验中）
// @downloadURL https://update.greasyfork.org/scripts/381649/%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E4%B8%89%E6%97%A0%E7%94%A8%E6%88%B7%E7%9A%84%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/381649/%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E4%B8%89%E6%97%A0%E7%94%A8%E6%88%B7%E7%9A%84%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

const userscriptautocollapsed = 'userscriptautocollapsed';
const 默认头像的URL片段 = 'https://pic4.zhimg.com/da8e974dc';
const 检查间隔毫秒 = 250;

const 给评论列表加上事件监听器 = () => {
    // 轮询直到评论列表加载完毕
    const intervalHandler = setInterval(() => {
        const 评论列表们 = document.querySelectorAll('div.CommentListV2');
        if (评论列表们.length > 0) {
            // clearInterval(intervalHandler); // useless for such a web app
            自动隐藏没有头像的用户的评论();
            评论列表们.forEach(评论列表 => 评论列表.addEventListener('mousemove', throttle(自动隐藏没有头像的用户的评论, 检查间隔毫秒)));
            评论列表们.forEach(评论列表 => 评论列表.addEventListener('scroll', throttle(自动隐藏没有头像的用户的评论, 检查间隔毫秒)));
        }
    }, 检查间隔毫秒);
}

const 给翻页按钮加上事件监听器 = () => {
    const 翻页按钮 = document.querySelectorAll('button.Button.PaginationButton.Button--plain');
    翻页按钮.forEach(按钮 => 按钮.addEventListener('click', 给评论列表加上事件监听器, { passive : true }));
}

function 给评论按钮加上事件监听器以便给评论列表加上事件监听器() {
  [...document.querySelectorAll('button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel')] // 知乎的图片放在 figure 里面
    .filter(按钮 => 按钮.innerText.includes('评论'))
    .forEach(评论按钮 => 评论按钮.addEventListener('click', 给评论列表加上事件监听器, { passive : true }));
};

function 自动隐藏没有头像的用户的评论() {
  [...document.querySelectorAll('ul.NestComment'), ...document.querySelectorAll('li.NestComment--child')] // 选择每条评论
    .filter(评论 => {
      if (评论.dataset[userscriptautocollapsed]) return false;

      const 头像 = 评论.querySelector('img.Avatar');
      if (头像 && 头像.src.includes(默认头像的URL片段)) return true;
    })
    .forEach(评论 => {
      评论.dataset[userscriptautocollapsed] = true;
      评论.style = "display: none;";
    });
};


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

自动隐藏没有头像的用户的评论();
给评论列表加上事件监听器();
给评论按钮加上事件监听器以便给评论列表加上事件监听器();
setTimeout(() => window.addEventListener('scroll', throttle(给评论按钮加上事件监听器以便给评论列表加上事件监听器, 检查间隔毫秒), { passive : true }), 1);
