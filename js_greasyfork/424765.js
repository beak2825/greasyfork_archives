// ==UserScript==
// @name        i Original Pictures
// @namespace   https://greasyfork.org/users/756764
// @version     2025.3.13
// @author      ivysrono
// @license     MIT
// @description 显示原图

// @match       https://www.firefox.net.cn/read.php?tid=*
// @match       https://www.firefox.net.cn/index.php?m=3g&c=read&tid=*

// @match       https://bbs.kafan.cn/thread*
// @match       https://bbs.kafan.cn/forum.php*?mod=viewthread&tid=*

// @match       https://mp.weixin.qq.com/s*

// @grant       GM.addStyle
// @inject-into auto
// @downloadURL https://update.greasyfork.org/scripts/424765/i%20Original%20Pictures.user.js
// @updateURL https://update.greasyfork.org/scripts/424765/i%20Original%20Pictures.meta.js
// ==/UserScript==

/**
 * Mozilla Firefox 中文社区
 * https://www.firefox.net.cn/read.php?tid=54440
 * https://www.firefox.net.cn/index.php?m=3g&c=read&tid=54440
 * https://www.firefox.net.cn/read.php?tid=54488
 * https://www.firefox.net.cn/index.php?m=3g&c=read&tid=54488
 */
if (location.host === 'www.firefox.net.cn') {
  /**
   * 如果没有限定 width='\d+' 则正常代码即可
   * 对限定了 width 的图片必须强行将 width 和 height 限定为 auto，简单修改属性会导致实际结果为 0
   */
  const css = `
  img.J_post_img.J_lazy {
    width: auto !important;
    max-width: 100% !important;
    height: auto !important;
    max-height: 100% !important;
    display: inline !important;
  }
  `;
  GM.addStyle(css);

  const realImgs = () => {
    const lazyimgs = document.getElementsByClassName('J_post_img J_lazy');
    for (const lazyimg of lazyimgs) {
      const realSrc = lazyimg.dataset.original;
      if (realSrc && lazyimg.src === 'https://www.firefox.net.cn/res/images/blank.gif') {
        lazyimg.src = realSrc;
      }
      lazyimg.onload = '';
      lazyimg.style = '';
    }
  };

  const observer = new MutationObserver(() => {
    realImgs();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * 取消图片长宽的限制；取消桌面版图片延迟加载；
 * Tests:
 * 子节点:
 * https://bbs.kafan.cn/thread-2206186-1-1.html
 * 孙节点:
 * https://bbs.kafan.cn/thread-2120131-1-1.html
 * 非首页:
 * https://bbs.kafan.cn/forum.php?mod=viewthread&tid=2102542&page=3#pid40661351
 * 绕开签名:
 * https://bbs.kafan.cn/forum.php?mod=viewthread&tid=2102854&page=1#pid40642866
 * 移动版设置了全部参数：
 * https://bbs.kafan.cn/thread-2076136-1-1.html
 */
if (location.host === 'bbs.kafan.cn') {
  if (navigator.userAgent.includes('Mobile')) {
    const css_Mobile = `
      .message img {
        max-width: 100% !important;
        max-height: none !important;
        width: auto !important;
        height: auto !important;
      }`;
    GM.addStyle(css_Mobile);
  } else {
    const css_PC = `
      .t_f img[id^="aimg_"] {
        max-width: 100% !important;
        max-height: none !important;
        width: auto !important;
        height: auto !important;
      }`;
    GM.addStyle(css_PC);
    // 去除仅存在于桌面版的延迟加载
    const realImgs = () => {
      const aimgs = document.querySelectorAll('.t_f img[id^="aimg_"]');
      if (aimgs.length === 0) return;
      for (const aimg of aimgs) {
        if (!aimg.getAttribute('file') || aimg.src === aimg.getAttribute('file')) continue;
        aimg.src = aimg.getAttribute('file');
      }
    };
    // 支持翻页脚本
    const observer = new MutationObserver(() => {
      realImgs();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

/**
 * 微信公众号
 * https://mp.weixin.qq.com/s/1KhZ6Oxn1wlK-uKVgXuU7A
 * https://mp.weixin.qq.com/s/b4V3eaFYYI0h90vIVEqKzw
 * https://mp.weixin.qq.com/s/CffucC8Y5ZxiLrbL8l0p9Q
 */
if (location.host === 'mp.weixin.qq.com') {
  /**
   * 将网页标题修改回文章标题
   * https://mp.weixin.qq.com/s/cyFN8mEq00dgpklQn6woeg
   * https://mp.weixin.qq.com/s/62q5za5QwxGi6EMl3JXAYQ
   */
  const realTitle = document.getElementById('activity-name').textContent;
  const title_observer = new MutationObserver(() => {
    document.title = realTitle;
  });
  // “微信扫一扫关注该公众号”延迟出现，即其 style 属性发生改变，会将标题修改为公众号名。
  title_observer.observe(document.getElementById('js_pc_qr_code'), {
    attributes: true,
  });

  /**
   * 去除图片的延迟加载
   * https://mp.weixin.qq.com/s/b4V3eaFYYI0h90vIVEqKzw
   */
  GM.addStyle(' {display: none important;}');
  const realImgs = () => {
    const imgs = document.getElementsByTagName('img');
    // 可能存在无图页面
    if (imgs.length === 0 && placeholders.length === 0) return;
    // 去除图片延迟加载
    for (const img of imgs) {
      const realSrc = img.dataset.src;
      // 可能没有延迟加载图或原图已经载入
      if (realSrc && img.src !== realSrc.split('640')[0]) {
        img.src = realSrc.split('640')[0];
      }
      // 防止图片再次暴力拉宽
      img.removeAttribute('style');
      img.removeAttribute('_width');
    }

    // 2022年8月起替换图片后出现大块黑色占位符
    const placeholders = document.querySelectorAll('span.js_img_placeholder.wx_widget_placeholder');
    for (const p of placeholders) {
      p.remove();
    }
  };
  const content_observer = new MutationObserver(() => {
    realImgs();
  });
  content_observer.observe(document.getElementById('js_content'), {
    attributes: true,
    subtree: true,
  });
}
