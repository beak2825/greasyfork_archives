// ==UserScript==
// @name            CSDN使用助手
// @icon            https://g.csdnimg.cn/static/logo/favicon32.ico
// @namespace       https://linecho.com/
// @version         0.1
// @description     CSDN使用助手，使用增强
// @author          purezhi
// @match           https://blog.csdn.net/*/article/details/*
// @require         https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require         https://cdn.jsdelivr.net/npm/notyf@3.9.0/notyf.min.js
// @resource        CSS_notyf https://cdn.jsdelivr.net/npm/notyf@3.9.0/notyf.min.css
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/495009/CSDN%E4%BD%BF%E7%94%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/495009/CSDN%E4%BD%BF%E7%94%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/*
CSDN使用助手，目前包含特性：
1）只保留文章内容，方便打印。
*/
var notyf = null;

(function () {
  'use strict';

  const notyfCss = GM_getResourceText("CSS_notyf");
  GM_addStyle(notyfCss);

  GM_addStyle(`
    @media print { .pz-hidden-print { display: none !important; } }
    .pz-hidden { display: none !important; }
    .notyf__message { font-size: 14px; }
    .pz-hlp-bar { position: absolute; right: 5px; top: 75px; padding: 5px 15px 0 0; z-index: 65533; }
    .pz-hlp-bar .bbtn { height: 26px; line-height: 22px; padding: 0 10px; border-radius: 13px; user-select: none; display: inline-flex; align-items: center; justify-content: center; outline: none; cursor: pointer; background-image: linear-gradient(to top, #D8D9DB 0%, #fff 80%, #FDFDFD 100%); border: 1px solid #8F9092; box-shadow: 0 4px 3px 1px #FCFCFC, 0 6px 8px #D6D7D9, 0 -4px 4px #CECFD1, 0 -6px 4px #FEFEFE, inset 0 0 3px 0 #CECFD1; transition: all 0.2s ease; font-size: 13px; color: #606060; text-shadow: 0 1px #fff; }
    .pz-hlp-bar .bbtn::-moz-focus-inner { border: 0; }
    .pz-hlp-bar .bbtn:hover:not([disabled]) { box-shadow: 0 3px 2px 1px #FCFCFC, 0 5px 7px #D6D7D9, 0 -3px 3px #CECFD1, 0 -5px 3px #FEFEFE, inset 0 0 2px 2px #CECFD1; }
    .pz-hlp-bar .bbtn:focus:not(:active) { animation: active 0.9s alternate infinite; outline: none; }
    .pz-hlp-bar .bbtn:active:not([disabled]) { box-shadow: 0 3px 2px 1px #FCFCFC, 0 5px 7px #D6D7D9, 0 -3px 3px #CECFD1, 0 -5px 3px #FEFEFE, inset 0 0 4px 2px #999, inset 0 0 15px #aaa; }
    .pz-hlp-bar .bbtn > * { transition: transform 0.2s ease; }
    .pz-hlp-bar .bbtn:hover:not([disabled]) > * { transform: scale(0.975); }
    .pz-hlp-bar .bbtn:active:not([disabled]) > * { transform: scale(0.95); }
    .pz-hlp-tool { position: absolute; top: -26px; left: 0; right: 0; text-align: right; padding: 0; background: transparent; opacity: 0.15; }
    .pz-hlp-tool a.opt { color: #0082ff; cursor: pointer; font-size: 14px !important; margin-left: 5px; }
    #middle .video { margin-bottom: 25px; }
    #middle .www_page .video:nth-child(1), #middle .www_page .video:nth-child(2) { margin-top: 30px; }
    #middle .pz-hlp-tool { background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); }
    #middle .pz-hlp-tool a.opt { font-size: 14px !important; }
    .vct-main .vct-left .recommend .pz-hlp-tool { top: 0; right: 10px; }
  `);

  notyf = new Notyf({ position: { x: 'center', y: 'top' }, dismissible: true, duration: 2500 });

  setTimeout(() => {
    // 打印预览
    addPrintPreview();
  }, 5000)
})();

// 打印预览
function addPrintPreview() {
  $(document.body).append($(`
    <div class="pz-hlp-bar">
      <button pz-print-preview-open class="bbtn pz-hidden-print">阅读预览</button>
      <button pz-print-preview-close class="bbtn pz-hidden-print" style="display: none;">关闭预览</button>
    </div>
  `));

  const $el1 = $('#toolbarBox');
  const $el2 = $('.blog-content-box .article-header-box .article-header .article-info-box');
  const $el3 = $('.blog-content-box .article-header-box .article-header .blog-tags-box');
  const $el4 = $('.blog-content-box .article-header-box .article-header .blog-tags-box');
  const $el5 = $('#blogHuaweiyunAdvert');
  const $el6 = $('#blogColumnPayAdvert');
  const $el7 = $('.blog_container_aside');
  const $el8 = $('.recommend-right');
  const $el9 = $('#toolBarBox');
  const $el10 = $('#treeSkill');
  const $el11 = $('.directory-boxshadow-dialog');
  const $el12 = $('.recommend-box');
  const $el13 = $('#commentBox');
  const $el14 = $('#pcCommentBox');
  const $el15 = $('#recommendNps');
  const $el16 = $('.blog-footer-bottom');
  const $el17 = $('.csdn-side-toolbar');

  if ($el1) $el1.attr('pz-print-preview-hide-el', true);
  if ($el2) $el2.attr('pz-print-preview-hide-el', true);
  if ($el3) $el3.attr('pz-print-preview-hide-el', true);
  if ($el4) $el4.attr('pz-print-preview-hide-el', true);
  if ($el5) $el5.attr('pz-print-preview-hide-el', true);
  if ($el6) $el6.attr('pz-print-preview-hide-el', true);
  if ($el7) $el7.attr('pz-print-preview-hide-el', true);
  if ($el8) $el8.attr('pz-print-preview-hide-el', true);
  if ($el9) $el9.attr('pz-print-preview-hide-el', true);
  if ($el10) $el10.attr('pz-print-preview-hide-el', true);
  if ($el11) $el11.attr('pz-print-preview-hide-el', true);
  if ($el12) $el12.attr('pz-print-preview-hide-el', true);
  if ($el13) $el13.attr('pz-print-preview-hide-el', true);
  if ($el14) $el14.attr('pz-print-preview-hide-el', true);
  if ($el15) $el15.attr('pz-print-preview-hide-el', true);
  if ($el16) $el16.attr('pz-print-preview-hide-el', true);
  if ($el17) $el17.attr('pz-print-preview-hide-el', true);

  $(document.body).on('click', '[pz-print-preview-open]', function (event) {
    $('[pz-print-preview-hide-el]').addClass('pz-hidden');
    $('.pz-hlp-bar [pz-print-preview-open]').hide();
    $('.pz-hlp-bar [pz-print-preview-close]').show();
  });

  $(document.body).on('click', '[pz-print-preview-close]', function (event) {
    $('[pz-print-preview-hide-el]').removeClass('pz-hidden');
    $('.pz-hlp-bar [pz-print-preview-close]').hide();
    $('.pz-hlp-bar [pz-print-preview-open]').show();
  });
}

/* 辅助函数 */

function showError(msg) {
  showMsg(msg, 'error')
}
function showSuccess(msg) {
  showMsg(msg, 'success')
}
function showMsg(msg, typ) {
  if (notyf) notyf.open({
    type: typ ? typ : 'info',
    message: msg
  });
  else alert(msg);
}