// ==UserScript==
// @name iconfont preview for UE&UI teammates
// @namespace Violentmonkey Scripts
// @match        https://www.iconfont.cn/collections/detail*
// @match        https://iconfont.cn/collections/detail*
// @match        https://iconfont.cn/user/detail*
// @match        https://www.iconfont.cn/manage/index*
// @match        https://iconfont.cn/manage/index*
// @grant none
// @description zh-cn
// @version v0.0.7
// @downloadURL https://update.greasyfork.org/scripts/40330/iconfont%20preview%20for%20UEUI%20teammates.user.js
// @updateURL https://update.greasyfork.org/scripts/40330/iconfont%20preview%20for%20UEUI%20teammates.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
  setTimeout(
    function () {
      (
        function ($) {
          if (!$) {
            var script = document.createElement('script')
            script.src = '//cdn.bootcss.com/jquery/1.8.0/jquery-1.8.0.min.js'
            script.onload = function (ev) {
              registerSvgPreviewSwitch();

              registerSvgPreviewBox();

              bindHoverEvent();

              insertStyle();
            }
            document.head.appendChild(script)
            return
          }
          /**
           * 1. 放个开关上去吧
           */
          registerSvgPreviewSwitch();
          /**
           * 2.把 preview 的盒子扔上去吧
           */
          registerSvgPreviewBox();

          /**
           * 3.给每个 icon 添加 mouseIn 事件吧
           */
          bindHoverEvent();
          /**
           * 4.加入一些样式
           */
          insertStyle();

          function togglePreviewBox() {
            var status = window.uePreviewStatus;
            if (status) {
              closePreviewBox();
            } else {
              openPreviewBox();
            }
          }

          function openPreviewBox() {
            var $ = window.jQuery;
            window.uePreviewStatus = true;

            var previewBox = $('#ue-preview-box');
            if (previewBox.hasClass('disabled')) {
              previewBox.removeClass('disabled')
            }
          }

          function closePreviewBox() {
            var $ = window.jQuery;
            window.uePreviewStatus = false;

            var previewBox = $('#ue-preview-box');
            if (!previewBox.hasClass('disabled')) {
              previewBox.addClass('disabled')
            }
          }

          function setIntoPreview(e) {
            var $ = window.jQuery;
            var svg = $(e.target).find('svg');
            var svg12 = $('<div></div>').attr('class', 'svg-preview-ctn svg-12').append(svg.clone());
            var svg16 = $('<div></div>').attr('class', 'svg-preview-ctn svg-16').append(svg.clone());
            var svg24 = $('<div></div>').attr('class', 'svg-preview-ctn svg-24').append(svg.clone());
            var previewBox = $('#ue-preview-box');
            previewBox.find('.svg-preview-ctn').remove();
            previewBox.append(svg12).append(svg16).append(svg24);
          }

          function registerSvgPreviewBox() {
            var $ = window.jQuery;
            var dom = $('<div id="ue-preview-box" class="disabled"><div class="ue-preview-title">icon 的尺寸预览(12px 16px 24px):</div></div>')
            $(document.body).append(dom);
          }

          function registerSvgPreviewSwitch() {
            var $ = window.jQuery;
            var btnGroup = $('.block-radius-btn-group')[0];
            var dom = $('<span id="preview-switch"><span class="radius-btn-share-inner">卍</span></span>')
            dom.attr('class', 'iconfont radius-btn radius-btn-share disabled');
            dom.on('click', togglePreviewBox)
            $(btnGroup).append(dom);
          }

          function bindHoverEvent() {
            var $ = window.jQuery;
            var liListProject= $('div.project-iconlist .block-icon-list li');
            var liListBlock = $('div.collection-detail .block-icon-list li');
            var liListUpload = $('div.uploads-iconlist .block-icon-list li');
            liListBlock.mouseenter(setIntoPreview);
            liListUpload.mouseenter(setIntoPreview);
            liListProject.mouseenter(setIntoPreview);
          }

          function insertStyle() {
            var $ = window.jQuery;
            $('head').append(
              '<style type="text/css">'
              + '#ue-preview-box {'
              + 'position: fixed;'
              + 'left: 0;'
              + 'bottom: 0;'
              + 'width: 100%;'
              + 'height: 84px;'
              + 'line-height: 84px;'
              + 'background-color: #eaeef5;'
              + 'z-index: 100;'
              + 'text-align: center;'
              + '}'
              + '#ue-preview-box.disabled {'
              + 'display: none;'
              + '}'
              + '.svg-preview-ctn {'
              + 'display: inline-block;'
              + 'width: 80px;'
              + 'line-height: 40px;'
              + '}'
              + '.ue-preview-title {'
              + 'position: absolute;'
              + 'left: 12px;'
              + 'top: 12px;'
              + 'color: #999;'
              + 'font-size: 14px;'
              + 'line-height: 14px;'
              + '}'
              + '.svg-preview-ctn.svg-12 svg{'
              + 'width: 12px !important;'
              + 'height: 12px !important;'
              + 'vertical-align: middle;'
              + '}'
              + '.svg-preview-ctn.svg-16 svg{'
              + 'width: 16px !important;'
              + 'height: 16px !important;'
              + 'vertical-align: middle;'
              + '}'
              + '.svg-preview-ctn.svg-24 svg{'
              + 'width: 24px !important;'
              + 'height: 24px !important;'
              + 'vertical-align: middle;'
              + '}'
              + '</style>'
            )
          }
        }
      )(window.jQuery)
    },
    1000
  )
});
