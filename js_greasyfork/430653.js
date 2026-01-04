  // ==UserScript==
  // @name         度盘视频网页全屏
  // @namespace    http://tampermonkey.net/
  // @version      0.3
  // @description  按 ？ 键可实现网页全屏切换
  // @author       huqz
  // @match        https://pan.baidu.com/mbox/*
  // @match        https://pan.baidu.com/play/video*
  // @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
  // @icon         https://www.google.com/s2/favicons?domain=baidu.com
  // @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/430653/%E5%BA%A6%E7%9B%98%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/430653/%E5%BA%A6%E7%9B%98%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
  // ==/UserScript==

 (function() {
    'use strict';

    GM_addStyle(`
    .remove-header{};
    .black-bg{position:fixed;top:0;left:0;z-index:995;width:100%;height:100%;background-color:#000000;};
    .video-position{position:fixed;top:0;left:0;width:100%;height:100%;z-index:999;};
    .vjs-mid-fullscreen{cursor:pointer;}
    `)
    $(`<style>

  </style>`)

    const sleep = ms => new Promise(resolve => { setTimeout(resolve, ms) });
    let v;
    let layoutHeader = document.querySelector('#layoutHeader') || document.querySelector('.header-box');  // 去頂
    let black_bg = document.body.appendChild(document.createElement('div'));  // 加背景

    const hookAttachShadow = (cb) => {
      try {
        const _attachShadow = Element.prototype.attachShadow;
        Element.prototype.attachShadow = function(opt) {
          opt.mode = 'open';
          const shadowRoot = _attachShadow.call(this, opt);
          cb(shadowRoot);
          console.log("hock", shadowRoot);
          window.temp1 = shadowRoot;
          return shadowRoot;
        };
      } catch (e) {
        console.error('Hack attachShadow error', e);
      }
    };

    hookAttachShadow(async shadowRoot => {
      await sleep(600);
      if (v) return;
      if (v = shadowRoot.querySelector("video")) {
        console.log('Found MV in ShadowRoot\n', v, shadowRoot);
        window.temp1 = shadowRoot;
      }
    });


    setTimeout(() => {
      var itv = setInterval(() => {
        if (window.temp1 !== undefined) {
          console.log("!!!")
          document.onkeydown = e => {
            if (e && e.keyCode === 191) {
              $(layoutHeader).toggleClass("remove-header");
              if (layoutHeader.className.includes('remove-header')) {
                $(temp1).find(".video-player").attr('style', "width:100%;height:800px;");
                $(layoutHeader).attr("style", "top:-100px;display:none;");
                $(temp1).find('video').attr('style', 'position:fixed;top:0;left:0;width:100%;height:100%;');
                $(temp1).find('.vjs-control-bar').attr('style', 'position:fixed;bottom:0;left:0;');
                $(black_bg).attr('style', 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000000;')
                $(".video-functions-tips").attr("style", "visibility:hidden");
              }
              else {
                $(temp1).find(".video-player").attr('style', 'width: 980px; height: 480px');
                $(layoutHeader).removeAttr("style");
                $(temp1).find('video').removeAttr('style');
                $(temp1).find('.vjs-control-bar').removeAttr('style');
                $(black_bg).removeAttr('style');
                $(".video-functions-tips").removeAttr("style");
              }
            }
          }
          clearInterval(itv);
        }
      }, 2000)
    }, 3000)
  })();
