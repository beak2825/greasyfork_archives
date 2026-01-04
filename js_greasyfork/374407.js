// ==UserScript==
// @name         电影天堂,阳光电影去掉广告与高亮高分电影
// @namespace    https://github.com/yujinpan/tampermonkey-extension
// @version      1.7
// @license      MIT
// @description  主要是在电影天堂,阳光电影网站去掉页面上的广告（隐藏广告比较烦）。还有就是标记高分和获奖的电影，方便找到精华电影。
// @author       yujinpan
// @match        http*://*.dytt8.net/*
// @match        http*://dytt8.net/*
// @match        http*://*.ygdy8.com/*
// @match        http*://ygdy8.com/*
// @match        http*://*.dy2018.com/*
// @match        http*://dy2018.com/*
// @match        http*://*.dydytt.net/*
// @match        http*://dydytt.net/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/374407/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%2C%E9%98%B3%E5%85%89%E7%94%B5%E5%BD%B1%E5%8E%BB%E6%8E%89%E5%B9%BF%E5%91%8A%E4%B8%8E%E9%AB%98%E4%BA%AE%E9%AB%98%E5%88%86%E7%94%B5%E5%BD%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/374407/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%2C%E9%98%B3%E5%85%89%E7%94%B5%E5%BD%B1%E5%8E%BB%E6%8E%89%E5%B9%BF%E5%91%8A%E4%B8%8E%E9%AB%98%E4%BA%AE%E9%AB%98%E5%88%86%E7%94%B5%E5%BD%B1.meta.js
// ==/UserScript==

/**
 * 已有功能列表：
 *  - 功能1：删除第一次加载出现的广告
 *  - 功能2：标记高分电影
 *  - 功能3：去掉搜索框的广告跳转
 *  - 功能4：去掉中间页面上的flash广告
 *  - 功能5：删除右下角的flash广告
 *  - 功能6：去掉按任意键弹出广告
 *  - 功能7：去掉首次点击任何地方弹出广告
 *  - 功能8：删除所有图片广告
 *  - 功能9：删除【紧急通知】
 *  - 功能10：移除附加内容（跳转/广告）
 */

class ImgControl {
  static style;

  static hide() {
    ImgControl.style = document.createElement('style');
    ImgControl.style.innerHTML = 'img {display: none!important}';
    document.head.prepend(ImgControl.style);
  }

  static show() {
    ImgControl.style && ImgControl.style.remove();
  }
}

start();

function start() {
  removeWrite();

  ImgControl.hide();
  document.addEventListener('DOMContentLoaded', function () {
    removeFirst();
    removeKeyboardAD();
    removeFlash();
    markHighGrade();
    removeImages().then(function () {
      ImgControl.show();
    });
  });
}

// 删除第一次加载出现的广告
// 删除右下角的flash广告
// 删除所有图片广告
// 删除【紧急通知】
function removeImages() {
  return new Promise(resolve => {
    removeImages.counter = (removeImages.counter || 0) + 1;
    console.log('第' + removeImages.counter + '次查找广告。');

    var bodyChildren = document.body.children;

    // 查找全屏链接广告
    var links = document.querySelectorAll('body>a');
    if (links.length) {
      links.forEach(item => item.remove());
      console.log(`找到全屏链接广告！成功删除！`);
    }

    // 查找右下角flash窗口
    var flash = bodyChildren[bodyChildren.length - 1];
    if (flash && flash.style.position === 'fixed') {
      flash.remove();
      console.log('找到右下角flash窗口！成功删除！');
    }

    var images = document.body.querySelectorAll('img');
    if (images.length) {
      Array.from(images).forEach(item => {
        if (item.nextSibling && item.nextSibling.tagName === 'BR') return;

        var parent = item.parentNode;
        var grantParent = parent ? parent.parentNode : null;
        if (parent) {
          if (parent.tagName === 'A') parent.remove();
          if (grantParent && grantParent.parentNode === document.body) grantParent.remove();
        }
        item.remove();
        // 移除广告后是空盒子也移除掉
        if (parent && !parent.childNodes.length) parent.remove();
        if (grantParent && !grantParent.childNodes.length) grantParent.remove();
      });
      console.log('找到图片广告！成功删除！');
    }

    var noticeElm = document.body.querySelector('div[class^="notice"]');
    if (noticeElm) {
      noticeElm.remove();
      console.log('找到【紧急通知】！成功删除！');
    }

    // 超过 50 次就不再查找了
    if (removeImages.counter > 50) {
      return resolve();
    } else {
      setTimeout(() => {
        resolve(removeImages());
      });
    }
  });
}

// 标记高分电影
function markHighGrade() {
  var markWords = ['高分', '获奖'];
  var allText = document.querySelectorAll('a, p');
  var textMark = function (text, markWords) {
    markWords.forEach(function (word) {
      text = text.replace(new RegExp(word), '<strong style="color: red;font-size: 18px;">' + word + '</strong>');
    });
    return text;
  };
  allText.forEach(function (aElem) {
    aElem.innerHTML = textMark(aElem.innerHTML, markWords);
  });
}

// 去掉中间页面上的flash广告
function removeFlash() {
  var containWidth = document.querySelector('.contain').clientWidth;
  // 递归移除父级，除与广告的尺寸不一致就停止
  // 误差范围宽度30px，高度10px
  var removeParentUntilDiffSize = function (elem) {
    var elemW = elem.clientWidth;
    var elemH = elem.clientHeight;
    var parent = elem.parentNode;
    var parentW = parent.clientWidth;
    var parentH = parent.clientHeight;
    if (checkSize(parentW, elemW, 30) && checkSize(parentH, elemH, 10)) {
      removeParentUntilDiffSize(parent);
    } else {
      elem.remove();
    }
  };
  // 校验大小是否在误差之内
  var checkSize = function (current, target, range) {
    return current > target - 30 && current < target + 30;
  };
  document.querySelectorAll('iframe').forEach(function (elem) {
    if (elem.clientWidth === containWidth) {
      removeParentUntilDiffSize(elem);
    } else {
      elem.src = '';
    }
  });
}

// 去掉按任意键弹出广告
function removeKeyboardAD() {
  document.addEventListener('keydown', function (e) {
    e.stopPropagation();
  }, true);
}

// 去掉首次点击任何地方弹出广告
function removeFirst() {
  document.addEventListener('click', function (e) {
    e.stopPropagation();
  }, true);
}

// 移除附加内容（跳转/广告）
function removeWrite() {
  document.write = () => {};
  document.writeln = () => {};
}
