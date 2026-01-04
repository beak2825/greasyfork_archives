// ==UserScript==
// @name         米游社快捷关闭评论和切换图片
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  按esc或者鼠标点击空白处，快捷关闭米游社点开的评论；滚动鼠标滚轮时切换图片而不关闭它们；修复切换图片时点击箭头图标没反应的bug。
// @author       coccvo
// @match        https://www.miyoushe.com/*
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAYGBgYGBgYHBwYJCgkKCQ0MCwsMDRQODw4PDhQfExYTExYTHxshGxkbIRsxJiIiJjE4Ly0vOEQ9PURWUVZwcJYBBgYGBgYGBgcHBgkKCQoJDQwLCwwNFA4PDg8OFB8TFhMTFhMfGyEbGRshGzEmIiImMTgvLS84RD09RFZRVnBwlv/CABEIABgAGAMBEQACEQEDEQH/xAAZAAADAAMAAAAAAAAAAAAAAAABAgMEBgf/2gAIAQEAAAAA6+Klnw93n//EABkBAAMAAwAAAAAAAAAAAAAAAAECAwAFBv/aAAgBAhAAAADpsRZGmiP/xAAZAQACAwEAAAAAAAAAAAAAAAADBAECBgf/2gAIAQMQAAAA58UpHqJ6+P/EACIQAAICAgICAgMAAAAAAAAAAAECAxEABBITITEFQWGBwf/aAAgBAQABPwCR5dmVncszM3oAsSfdKBkSCR0UOKcxhWqxUhAuj+Dhd9XYJilYmOV1VzVlRRF1Wak415VkIY+HWlUuSXAoAD7NGs0tHb2I4jrxk0kY7LCoHSvRN8qI+gRmzobOssTS8HDuR2I/K39AN4FXVCscDXlki2DwohZFJq05Dl+iuQ7CJNOrbWr0AJ0hXClaFMD/ADGg+MbVm1IzGyzM7daPyJZzyJFE1585/8QAIxEAAgIBAwMFAAAAAAAAAAAAAQIAAyEEERITMVFBYXGBkf/aAAgBAgEBPwAdPToAMCW2EVlgPOPiIouqIde4BIl6cgfo/kt1FSrwY+cep3lGpRmYAEexjWrbWChjlSF78s8otzq6vvkT/8QAIhEAAgIBBAEFAAAAAAAAAAAAAQIABAMFETFBExIUIVFh/9oACAEDAQE/AAme/lZuT2ZUqq1nxv1Lbe1sI2E7fs0t/T5NuZhoZTYbMODNQoOyKw5EqVsle2EyCICCfrqNiQoU2+J//9k=
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465640/%E7%B1%B3%E6%B8%B8%E7%A4%BE%E5%BF%AB%E6%8D%B7%E5%85%B3%E9%97%AD%E8%AF%84%E8%AE%BA%E5%92%8C%E5%88%87%E6%8D%A2%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/465640/%E7%B1%B3%E6%B8%B8%E7%A4%BE%E5%BF%AB%E6%8D%B7%E5%85%B3%E9%97%AD%E8%AF%84%E8%AE%BA%E5%92%8C%E5%88%87%E6%8D%A2%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

     // 修复切换图片时点击箭头图标没反应的bug
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('icon-fanhui') || e.target.classList.contains('icon-xiaojiantou')) {
            var button = e.target.closest('button');
            if (button) {
                button.click();
            }
        }
    }, false);

    // Esc关闭展开的评论
    document.body.addEventListener('keydown', e => {      
    if (event.key === 'Escape') {
        const closeBon = document.querySelector('pswp__button pswp__button--close');
        closeBon.click();
    }
  });
      document.body.addEventListener('keydown', e => {
    if (event.key === 'Escape') {
        const closeButton = document.querySelector('.mhy-button.mhy-action-sheet__close.mhy-button-default');
        closeButton.click();
    }
  });

    // 点击空白处关闭评论
  document.addEventListener('click', e => {
      // 防止点开评论的同时被关闭
    if (e.target.closest('.reply-card__replies') ||
    e.target.closest('.notifications-common-card')) {
    return;
    }
    // 检查评论是否展开、点击是否发生在主体之外
    if (document.querySelector('.mhy-action-sheet.reply-detail-action-sheet').getAttribute('style') !== 'display: none;' && !e.target.closest('.mhy-action-sheet__body')) {
        const closeButton2 = document.querySelector('.mhy-button.mhy-action-sheet__close.mhy-button-default');
        closeButton2.click();
    }
  });

    // 防止滚动时关闭图片
    document.addEventListener('wheel', function(e) {
        if (e.target.classList.contains('pswp__img') || e.target.closest('.pswp__scroll-wrap')) {
            e.stopPropagation();
            // 检测滚轮方向
            var delta = e.wheelDelta || -e.deltaY;
            // 向后滚动，显示下一张图片
            if (delta < 0) {
                var nextButton = document.querySelector('.pswp__button--arrow--right');
                if (nextButton) {
                    nextButton.click();
                }
            }
            // 向前滚动，显示上一张图片
            else {
                var prevButton = document.querySelector('.pswp__button--arrow--left');
                if (prevButton) {
                    prevButton.click();
                }
            }
        }
    }, true);

})();