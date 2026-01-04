// ==UserScript==
// @name         B站直播隐身入场
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  只是伪隐身，主播在直播姬可以看到你，其他用户不行。代码是直接在https://greasyfork.org/zh-CN/scripts/406048抽出来的，因为自己只想要个隐身纯享（）
// @author       You
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @require        https://cdn.jsdelivr.net/gh/andywang425/BLTH@dac0d115a45450e6d3f3e17acd4328ab581d0514/assets/js/library/Ajax-hook.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438171/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%9A%90%E8%BA%AB%E5%85%A5%E5%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/438171/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%9A%90%E8%BA%AB%E5%85%A5%E5%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const room_id = 22481803; //设置固定的入场直播间号，你将会在那里出现（伪）
    try {
        ah.proxy({
          onRequest: (XHRconfig, handler) => {
            if (XHRconfig.url.includes('//api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser')) {
              XHRconfig.url = '//api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser?room_id='+room_id;
              handler.next(XHRconfig);
            }else {
              handler.next(XHRconfig);
            }
          },
          onResponse: async (response, handler) => {
            if (response.config.url.includes('//api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser')) {
              if (!response.response.includes('"code":0')) {
                console.log("隐身进场失败 返回信息："+response.response);
              }
            }
            handler.next(response);
          }
        })
      } catch (e) { console.error('ah.proxy Ajax-hook代理运行出错', e) }
})();