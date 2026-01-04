// ==UserScript==
// @name         B站视频播放器右上角显示系统时间丨调整视频比例
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  播放器右上角显示系统时间,调整视频比例
// @author       echo
// @match           *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant       GM_setValue
// @grant       GM_getValue
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/474255/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E5%8F%B3%E4%B8%8A%E8%A7%92%E6%98%BE%E7%A4%BA%E7%B3%BB%E7%BB%9F%E6%97%B6%E9%97%B4%E4%B8%A8%E8%B0%83%E6%95%B4%E8%A7%86%E9%A2%91%E6%AF%94%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/474255/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E5%8F%B3%E4%B8%8A%E8%A7%92%E6%98%BE%E7%A4%BA%E7%B3%BB%E7%BB%9F%E6%97%B6%E9%97%B4%E4%B8%A8%E8%B0%83%E6%95%B4%E8%A7%86%E9%A2%91%E6%AF%94%E4%BE%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (window.top != window.self) return;
  window.onload = function () {
    $(function () {
      log("欢迎使用本插件: B站视频播放器右上角显示系统时间丨调整视频比例");
      //显示系统时间
      const fontSize = 21;//*支持修改,时间字体大小,默认21
      const maxCheckNum = 30;//重试次数
      let retryTime = 200;//重试间隔
      const exponential = 1.1;//间隔延长指数
      const colorIn = "var(--bpx-primary-color,#00a1d6) ";
      const colorOut = "var(--bpx-dmsend-switch-icon,#757575) ";
      const antimetooltip = `@keyframes timetooltip{
        from{
          opacity:0;
          transform:translate(0,6px);
        }to{
          opacity:1;
          transform:translate(0,0);
        }
      }
      .antimetooltip{
        animation:timetooltip 0.3s forwards;
        animation-delay: 0.3s;
      }`;
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
      let left = '0px';
      let top = '0px';
      let time = $(`<div class="sys-time toolbar-left-item-wrap" style="z-index:1;position: absolute;color: #ffffffee;right: 5px;top: 0.6px;font-size: ${fontSize}px;text-shadow: 0.3px 0.3px 3px #00000088;font-family:Calibri;">00:00</div>`);
      let timetooltip = $(`<div class="bpx-player-tooltip-item" data-name="time_switch" style="left: 0px; top: 0px; visibility: hidden; opacity: 0; transform: translate(0px, 0px);"><div class="bpx-player-tooltip-title">隐藏时间</div></div>`);
      let switcher = $(`<div class="time-switcher bpx-player-dm-setting" style="display:flex;align-items:center;justify-content: center;user-select: none;cursor: pointer;">
      <span class="bpx-common-svg-icon" style="width:85%;height:85%;">
  <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" style="transition: none;">
  <path style="transition: fill .15s ease-in-out;" d="m770.048,1003.52l-512,0c-128,0 -231.424,-103.424 -231.424,-230.4l0,-512c0,-126.976 103.424,-230.4 230.4,-230.4l512,0c126.976,0 230.4,103.424 230.4,230.4l0,512c1.024,126.976 -102.4,230.4 -229.376,230.4zm-513.024,-880.64c-75.776,0 -138.24,62.464 -138.24,138.24l0,512c0,76.8 62.464,138.24 138.24,138.24l512,0c75.776,0 138.24,-62.464 138.24,-138.24l0,-512c1.024,-76.8 -61.44,-138.24 -137.216,-138.24l-513.024,0z"/>
  <path class="time-sign" style="transition: fill .15s ease-in-out;" fill="${colorIn}" d="m513.024,517.12m-66.56,0a66.56,66.56 0 1 0 133.12,0a66.56,66.56 0 1 0 -133.12,0z"/>
  <path class="time-sign" style="transition: fill .15s ease-in-out;" fill="${colorIn}" d="m707.584,647.168l-119.808,-119.808c-5.12,33.792 -31.744,60.416 -66.56,64.512l120.832,120.832c18.432,18.432 47.104,18.432 65.536,0c17.408,-18.432 17.408,-47.104 0,-65.536zm-194.56,-205.824c17.408,0 32.768,7.168 46.08,17.408l0,-241.664c0,-25.6 -20.48,-46.08 -46.08,-46.08s-46.08,20.48 -46.08,46.08l0,240.64c13.312,-9.216 28.672,-16.384 46.08,-16.384z"/>
  </svg></span></div>`).hover(function () {
        delayHide.once();
        $(this).find(".time-sign").css({ "fill": colorIn });
        left = $(this).offset().left + $(this).outerWidth() / 2 - timetooltip.outerWidth() / 2 + 'px';
        top = $(this)[0].getBoundingClientRect().top - timetooltip.outerHeight() - parseInt(timetooltip.css('padding-bottom')) + 'px';
        timetooltip.css({ "left": left, "top": top, "visibility": "visible" });
        timetooltip.addClass('antimetooltip');
      }, timetooltipHide);
      function timetooltipHide() {
        timetooltip.css({ "visibility": "hidden", "opacity": 0 });
        timetooltip.removeClass('antimetooltip');
        if (time.is(':hidden')) $(this).find(".time-sign").css({ "fill": colorOut });
        else $(this).find(".time-sign").css({ "fill": colorIn })
      }
      //调整视频比例
      let range, regulator;
      //菜单延迟消失计时器
      let delayHide = {};
      delayHide.ms = 200;//延迟时间
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
  "><input style="box-sizing: border-box;opacity: 1;width: 80%;flex-shrink: 0;" type="range" min="0.5" max="1.5" value="1.0" step="0.1" id="sizein" oninput="sizeout.value=parseInt(sizein.value*100)+'%'"><span style="
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
        left = $(this).offset().left + $(this).outerWidth() / 2 - range.outerWidth() / 2 + 'px';
        top = $(this)[0].getBoundingClientRect().top - range.outerWidth() + range.outerHeight() - parseInt(range.css('padding-left')) + 'px';
        range.css({ "left": left, "top": top, "visibility": "visible" });
        range.addClass('ansizetooltip');
      }, function () {
        delayHide.run();
      });
      //注入网页
      let player = $('.bpx-player-video-wrap');//播放器
      let video = $('.bpx-player-video-wrap video');//视频
      let bar = $('.bpx-player-dm-setting');//弹幕设置图标
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
              log("获取到播放器 " + player.length);
              log("获取到视频 " + video.length);
              log("获取到弹幕栏 " + bar.length);
              resolve();
            }
          }
        };
        checkPlayer();
      });
      promise.then(result => {
        //初始化
        $('head').append(`<style>${antimetooltip}${ansizetooltip}</style>`);
        time.text(getTime());
        player.prepend(time);
        //设置时间开关
        bar.after(switcher);
        switcher.click(() => {
          time.toggle(0, 'swing', function () {
            if (time.is(':hidden')) { timetooltip.children().text("显示时间"); GM_setValue('sys-time', 0); }
            else { timetooltip.children().text("隐藏时间"); GM_setValue('sys-time', 1); }
          });
        });
        //设置时钟
        setTimeout(() => {
          time.text(getTime());
          setInterval(() => {
            time.text(getTime());
          }, 1000 * 60);
        }, (60 - new Date().getSeconds()) * 1000);
        //时间开关提醒
        $('.bpx-player-tooltip-area').append(timetooltip);
        //设置视频尺寸调节按钮
        switcher.after(regulator);
        //调节滑块
        $('.bpx-player-tooltip-area').append(range);
        //调节尺寸
        video.parent().css({ "display": "flex", "justify-content": "center", "align-items": "center" });
        $("#sizein").on("input", function () {
          let size = $("#sizeout").text();
          video.css({ "width": size, "height": size });
          GM_setValue('video-size', size);
        });
        //载入配置
        GM_getValue('sys-time', 1) == 1 ? (log("载入配置 sys-time: 1"), time.show(), timetooltip.children().text("隐藏时间"), switcher.find(".time-sign").css({ "fill": colorIn })) : (log("载入配置 sys-time: " + GM_getValue('sys-time')), time.hide(), timetooltip.children().text("显示时间"), switcher.find(".time-sign").css({ "fill": colorOut }));
        let tmpSize = GM_getValue('video-size', '100%');
        log("载入配置 video-size: " + tmpSize);
        $("#sizein").val((parseFloat(tmpSize) / 100.0).toFixed(1));
        $("#sizeout").val(tmpSize);
        video.css({ "width": tmpSize, "height": tmpSize });
      }).catch(error => {
        log(error, 'error');
      });
      //滚动立即消失
      $(document).on('scroll', function () {
        console.log("scroll");
        timetooltipHide();
        delayHide.once();
      });
    });
  };
  //获取时间
  function getTime() {
    let date = new Date();
    let h = ('0' + date.getHours()).slice(-2);
    let m = ('0' + date.getMinutes()).slice(-2);
    let time = h + ':' + m;
    return time;
  }
  function log(message, type) {
    const tag = "%cB站播放器右上角时间%c ";
    const style = "background: #6FB01D; color: white; padding: 3px 3px 2px 3px; border-radius: 3px;font-size:11px;font-weight:bold;"
    if (type == 'error') console.error(tag + message, style, 'font-size:11px;');
    else console.log('' + tag + message, style, 'font-size:11px;');
  }
})();