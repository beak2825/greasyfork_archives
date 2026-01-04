// ==UserScript==
// @name         B站视频播放器调整视频比例
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  播放器调整视频比例
// @author       echo
// @match           *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant       GM_setValue
// @grant       GM_getValue
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/529696/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E8%B0%83%E6%95%B4%E8%A7%86%E9%A2%91%E6%AF%94%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/529696/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E8%B0%83%E6%95%B4%E8%A7%86%E9%A2%91%E6%AF%94%E4%BE%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (window.top != window.self) return;
  window.onload = function () {
    $(function () {
      const maxCheckNum = 30;
      let retryTime = 200;
      const exponential = 1.1;
      const colorIn = "var(--bpx-primary-color,#00a1d6) ";
      const ansizetooltip = `@keyframes sizetooltip{
        from{
          opacity:0;
          transform:rotate(-90deg) translate(-6px,0);
        }to{
          opacity:1;
          transform:rotate(-90deg) translate(0,0);
        }
      }
      .ansizetooltip{
        animation:sizetooltip 0.3s forwards;
        animation-delay: 0.3s;
      }`;

      //调整视频比例
      let range, regulator;
      let delayHide = {};
      delayHide.ms = 200;

      delayHide.run = function () {
        this.tag = setTimeout(function () {
          if (!regulator.is(':hover') && !range.is(':hover')) {
            range.css({ "visibility": "hidden", "opacity": 0 });
            range.removeClass('ansizetooltip');
            regulator.css("fill", '');
          }
        }, this.ms);
      };

      delayHide.clear = function () {
        clearTimeout(this.tag);
      };

      delayHide.once = function () {
        delayHide.clear();
        range.css({ "visibility": "hidden", "opacity": 0 });
        range.removeClass('ansizetooltip');
        regulator.css("fill", '');
      }

      range = $(`<div class="bpx-player-tooltip-item" data-name="size_regulate" style="
      left: 0px; top: 0px; visibility: hidden; opacity: 0; transform: translate(0px, 0px);
      box-sizing: border-box;
      display: flex;
      align-items: center;
      height: 42px;
      width: 120px;
      padding: 0 6px;
      transform: rotate(-90deg);
      background: hsla(0,0%,8%,.9);
      pointer-events: auto;
      justify-content: flex-start;
      "><input style="box-sizing: border-box;opacity: 1;width: 80%;flex-shrink: 0;" type="range" min="0.5" max="3" value="1.0" step="0.1" id="sizein" oninput="sizeout.value=parseInt(sizein.value*100)+'%'"><span style="
      position: absolute;
      box-sizing: border-box;
      word-break: keep-all;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 20px;
      width: 42px;
      transform: translate(0,-50%) rotate(90deg);
      top: 50%;
      right: -5%;
      "><output id="sizeout" style="user-select:none;">100%</output></span></div>`).hover(function () {
        delayHide.clear();
        regulator.css({ "fill": colorIn });
      }, function () {
        delayHide.run();
      });

      regulator = $(`<div class="size-regulator bpx-player-dm-setting" style="display:flex;align-items:center;justify-content: center;user-select: none;cursor: pointer;">
      <span class="bpx-common-svg-icon" style="width:90%;height:90%;">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M933.79188053 859.89239467l-124.452864-124.39825067c54.2277632-69.58066347 86.87670613-156.76320427 86.87670614-251.59161173 0-226.3482368-184.19111253-410.47381333-410.56119467-410.47381334-226.3973888 0-410.56119467 184.12557653-410.56119467 410.47381334 0 226.32093013 184.16380587 410.46289067 410.56119467 410.46289066 94.72464213 0 181.82089387-32.53971627 251.3403904-86.64733013l124.48017067 124.452864c20.0933376 20.0769536 52.56751787 20.1752576 72.52978346 0.23483733 19.96117333-19.9786496 19.84648533-52.40367787-0.212992-72.51339946zM153.2919808 483.89707093c0-183.22445653 149.09549227-332.28608853 332.3625472-332.28608853s332.35708587 149.06272427 332.35708587 332.28608853S668.9226752 816.18425173 485.654528 816.18425173 153.2919808 667.12152747 153.2919808 483.89707093z m470.70358187-39.08785493h-99.24225707v-99.24225707c0-20.75415893-17.5210496-37.58598827-39.0987776-37.58598826-21.6006656 0-39.0987776 16.81107627-39.0987776 37.58598826v99.24225707H347.29710933c-20.7650816 0-37.59691093 17.51012693-37.59691093 39.10970027 0 21.59520427 16.81107627 39.08785493 37.59691093 39.08785493h99.25864107v99.22041173c0 20.75962027 17.49920427 37.60237227 39.0987776 37.60237227 21.57882027 0 39.0987776-16.82199893 39.0987776-37.60237227v-99.22041173h99.24225707c20.75962027 0 37.61329493-17.49920427 37.61329493-39.08785493 0.00109227-21.6006656-16.85367467-39.10970027-37.61329493-39.10970027z m0 0"></path></svg></span></div>`).hover(function () {
        delayHide.clear();
        let left = $(this).offset().left + $(this).outerWidth() / 2 - range.outerWidth() / 2 + 'px';
        let top = $(this)[0].getBoundingClientRect().top - range.outerWidth() + range.outerHeight() - parseInt(range.css('padding-left')) + 'px';
        range.css({ "left": left, "top": top, "visibility": "visible" });
        range.addClass('ansizetooltip');
      }, function () {
        delayHide.run();
      });

      let player = $('.bpx-player-video-wrap');
      let video = $('.bpx-player-video-wrap video');
      let bar = $('.bpx-player-dm-setting');

      let promise = new Promise((resolve, reject) => {
        let checkNum = 0;
        let checkPlayer = () => {
          if (player.length * bar.length * video.length == 0 && checkNum <= maxCheckNum) {
            if (player.length == 0)
              player = $('.bpx-player-video-wrap');
            else if (video.length == 0) video = $('bpx-player-video-wrap video');
            if (bar.length == 0) bar = $('.bpx-player-dm-setting');
            checkNum++;
            setTimeout(checkPlayer, retryTime *= exponential);
          } else {
            if (player.length == 0) {
              reject("未找到播放器");
            } else if (video.length == 0) {
              reject("未找到视频")
            } else if (bar.length == 0) {
              reject("未找到弹幕栏")
            } else {
              resolve();
            }
          }
        };
        checkPlayer();
      });

      promise.then(result => {
        $('head').append(`<style>${ansizetooltip}</style>`);

        // 设置视频尺寸调节按钮
        bar.after(regulator);
        $('.bpx-player-tooltip-area').append(range);

        video.parent().css({
              "display": "flex",
            "justify-content": "center", // 水平居中
            "align-items": "center",     // 垂直居中
            "overflow": "hidden",        // 防止视频溢出
            "height": "100%",            // 确保容器高度占满
            "width": "100%"              // 确保容器宽度占满
        });

          $("#sizein").on("input", function () {
              let size = $("#sizeout").text();
              video.css({
                  "width": size,
                  "height": size,
                  "transform": "translate(-50%, -50%)", // 确保视频居中
                  "position": "absolute",               // 绝对定位
                  "top": "50%",                         // 垂直居中
                  "left": "50%"                         // 水平居中
              });
              GM_setValue('video-size', size);
          });

        // 载入配置
        let tmpSize = GM_getValue('video-size', '100%');
        $("#sizein").val((parseFloat(tmpSize) / 100.0).toFixed(1));
        $("#sizeout").text(tmpSize);
        video.css({ "width": tmpSize, "height": tmpSize });

      }).catch(error => {
        console.error(error);
      });

      $(document).on('scroll', function () {
        delayHide.once();
      });
    });
  };
})();