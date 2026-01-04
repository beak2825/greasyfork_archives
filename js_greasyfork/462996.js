// ==UserScript==
// @name          论坛悬浮回复框
// @namespace     https://github.com/qinxs
// @author        qinxs
// @version       1.0.0
// @description   论坛悬浮回复框，建议配合自动翻页脚本使用
// @match         *://*/*forum*
// @match         *://*/*thread*
// @match         *://*/*bbs*
// @match         *://*/*tid=*
// @match         *://*/*read*tid-*
// @run-at        document-start
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/462996/%E8%AE%BA%E5%9D%9B%E6%82%AC%E6%B5%AE%E5%9B%9E%E5%A4%8D%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/462996/%E8%AE%BA%E5%9D%9B%E6%82%AC%E6%B5%AE%E5%9B%9E%E5%A4%8D%E6%A1%86.meta.js
// ==/UserScript==

'use strict';

// 如果有兼容需求，仅在此处增加选择器即可
var selectors = `
  #anchor,
  #quickpost,
  #f_post,
  #f_pst,
  form[action*="post.php?action=reply"],
  form[action*="post.php?action=newthread"]
`.trim();

// 关键CSS
GM_addStyle(`
  ${selectors} {
    position: fixed;
    left: 0 !important;
    bottom: 10px !important;
    width: 3px !important;
    height: 100px !important;
    border: solid rgba(0, 100, 255, .75) !important;
    border-width: 2px 2px 2px 0 !important;
    border-radius: 0px 6px 6px 0;
    background: #fcfcfc;
    z-index: 99 !important;
    overflow: hidden;
  }

  ${selectors.replaceAll(',', '.show,')}.show {
    width: auto !important;
    height: auto !important;
    background: #fcfcfc;
  }

  /* 解决部分论坛的验证码问题 */
  #f_pst .p_pop,
  #f_pst .p_opt {
    position: absolute !important;
    bottom: 34% !important;
    top: auto !important;
  }
`);

window.addEventListener('DOMContentLoaded', () => {
  var $post = document.querySelectorAll(selectors.replace(/[\n\s]/g, ''));
  // console.log($post);

  if(!$post.length) return;

  $post.forEach(node => {
    node.addEventListener('mouseenter', () => {
      node.classList.add('show');
    });
    node.addEventListener('mouseleave', () => {
      if (node.contains(document.activeElement)) return;
      node.classList.remove('show');
    });
  });

  var $form = $post[0].querySelector('form') || $post[0].closest('form');

  if(!$form) return;

  document.addEventListener('keydown', () => {
    if (event.isComposing) return;

    var keyCode = event.code;

    // ESC缩回
    if (keyCode === 'Escape' && (event.originalTarget.contains($form) || $form.contains(event.originalTarget))) {
      // console.log(event);
      event.preventDefault();
      $post.forEach( node => node.classList.remove('show') );
    }
  });

  var $textarea = $form.querySelector('textarea');

  if (!$textarea) return;

  $textarea.addEventListener('keydown', function() {
    if (event.isComposing) return;

    var keyCode = event.code;

    // Ctrl+Enter，不会触发submit事件
    if (event.ctrlKey && keyCode === 'Enter' && this.value) {
      event.preventDefault();
      // 保证fastpostvalidate优先执行
      setTimeout(() => {
        // 根据fastpostvalidate函数源码，#fastpostsubmit的disabled属性为true时，验证通过
        if(document.querySelector('#fastpostsubmit')?.disabled) {
          setTimeout(() => {
            this.blur();
            $post.forEach( node => node.classList.remove('show') );
          }, 1600);
        }
      }, 0);
    }
  });

  $form.addEventListener("submit", event => {
    setTimeout(() => {
      if (!$textarea.value) return;
      $post.forEach( node => node.classList.remove('show') );
    }, 1600);
  });

});