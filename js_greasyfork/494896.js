// ==UserScript==
// @name        百度网盘Svip会员破解青春版
// @namespace   http://tampermonkey.net/
// @match       https://pan.baidu.com/
// @match       https://pan.baidu.com/*
// @grant       unsafeWindow
// @run-at      document-start
// @version     1.2
// @license     MIT
// @author      Gwen
// @downloadUrl https://greasyfork.org/scripts/469774-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98svip%E4%BC%9A%E5%91%98%E7%A0%B4%E8%A7%A3%E9%9D%92%E6%98%A5%E7%89%88/code/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98Svip%E4%BC%9A%E5%91%98%E7%A0%B4%E8%A7%A3%E9%9D%92%E6%98%A5%E7%89%88.user.js
// @homepageUrl https://greasyfork.org/zh-CN/scripts/469774-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98svip%E4%BC%9A%E5%91%98%E7%A0%B4%E8%A7%A3%E9%9D%92%E6%98%A5%E7%89%88
// @description 修改所有可改的身份信息，修改成超级会员身份，可以使用网站自带的倍速、字幕等功能。
// @downloadURL https://update.greasyfork.org/scripts/494896/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98Svip%E4%BC%9A%E5%91%98%E7%A0%B4%E8%A7%A3%E9%9D%92%E6%98%A5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/494896/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98Svip%E4%BC%9A%E5%91%98%E7%A0%B4%E8%A7%A3%E9%9D%92%E6%98%A5%E7%89%88.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var store = {
    path: null,
    adToken: null,
    bdstoken: null,
    resolutionPattern: /M3U8_AUTO_([0-9]+?)&/,
  }
  store.path = new URLSearchParams(new URL(location.href).search).get('path');

  function hookRequest() {
      var originOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function (method, url) {
        if (url.indexOf('/api/loginStatus') != -1) {
          this.addEventListener('readystatechange', function() {
            if (this.readyState == 4) {
              let res = JSON.parse(this.responseText)
              res.login_info.vip_type = '21'
              res.login_info.vip_identity = '21'
              res.login_info.vip_level =  8
              res.login_info.vip_point = 99999
              res.login_info.username = 'GwenCrackヾ(-_-;)'
              store.bdstoken = res.login_info.bdstoken
              Object.defineProperty(this, "responseText", {
                  writable: true,
              });
              this.responseText = JSON.stringify(res)
            }
          })
          originOpen.apply(this, arguments);
        } else if (url.indexOf('/user/info') != -1) {
          this.addEventListener('readystatechange', function() {
            if (this.readyState == 4) {
              let res = JSON.parse(this.responseText)
              res.user_info.is_vip = 1
              res.user_info.is_svip = 1
              res.user_info.is_plus_buy =  1
              Object.defineProperty(this, "responseText", {
                  writable: true,
              });
              this.responseText = JSON.stringify(res)
            }
          })
          originOpen.apply(this, arguments);
        } else if (url.indexOf('/membership/user') != -1) {
          this.addEventListener('readystatechange', function() {
            if (this.readyState == 4) {
              let res = JSON.parse(this.responseText)
              res.reminder = {
                "svip": {
                  "leftseconds": 9999999999,
                  "nextState": "normal"
                }
              }
              res.level_info = {
                "current_value": 12090,
                "current_level": 10,
                "history_value": 11830,
                "history_level": 10,
                "v10_id": "666666",
                "last_manual_collection_time": 0
              }
              res.product_infos = [{
                "product_id": "",
                "start_time": 1685635199,
                "end_time": 1888227199,
                "buy_time": 0,
                "cluster": "vip",
                "detail_cluster": "svip",
                "auto_upgrade_to_svip": 0,
                "product_name": "svip2_nd",
                "status": 0,
                "function_num": 0,
                "buy_description": "",
                "product_description": "",
                "cur_svip_type": "month"
              }]
              res.current_product = {
                "cluster": "vip",
                "detail_cluster": "svip",
                "product_type": "vip2_1m_auto",
                "product_id": "12187135090581539740"
              }
              res.current_product_v2 = {
                "cluster": "vip",
                "detail_cluster": "svip",
                "product_type": "vip2_1m_auto",
                "product_id": "12187135090581539740"
              }
              Object.defineProperty(this, "responseText", {
                  writable: true,
              });
              this.responseText = JSON.stringify(res)
            }
          })
          originOpen.apply(this, arguments);
        } else if (url.indexOf('/api/streaming') != -1 && url.indexOf('M3U8_SUBTITLE_SRT') == -1) { //获取视频m3u8接口
          let modifiedUrl = url.replace(/vip=2/, 'vip=0')
                  .replace(/_1080&/, '_720&')
          if (store.adToken) {
            modifiedUrl += ('&adToken=' + encodeURIComponent(store.adToken))
            this.adToken = store.adToken
            store.adToken = null
            originOpen.call(this, method, modifiedUrl, false);
            return
          }
          originOpen.call(this, method, modifiedUrl);
          this.addEventListener('readystatechange', function() {
            if (this.readyState == 4) {
              if (this.responseText[0] == '{') {
                let res = JSON.parse(this.responseText)
                store.adToken = res.adToken
                let manualRequest = new XMLHttpRequest();
                // let manualUrl = `https://pan.baidu.com/api/streaming?app_id=250528&clienttype=0&channel=chunlei&web=1&isplayer=1&check_blue=1&type=M3U8_AUTO_${store.resolutionPattern.exec(url)[1]}&trans=&vip=0` +
                //           `&bdstoken=${store.bdstoken||unsafeWindow.locals.bdstoken}&path=${store.path}&jsToken=${unsafeWindow.jsToken}`
                let manualUrl = modifiedUrl
                console.log(manualUrl)
                manualRequest.open(method, manualUrl, false);
                manualRequest.send();
                Object.defineProperty(this, "status", {
                  writable: true,
                });
                this.status = manualRequest.status;
                Object.defineProperty(this, "responseText", {
                  writable: true,
                });
                this.responseText = manualRequest.responseText;
              }
            }
          })
        } else if (url.indexOf('/msg/streaming') != -1) {
          this.addEventListener('readystatechange', function() {
            if (this.readyState == 4) {
              if (this.responseText[0] != '{')
                return
              let res = JSON.parse(this.responseText)
              res.ltime = 0.000001
              res.adTime = 0.000001
              console.log(res)
              Object.defineProperty(this, 'responseText', {
                writable: true,
              })
              this.responseText = JSON.stringify(res)
            }
          })
          originOpen.apply(this, arguments);
        }
        else {
          originOpen.apply(this, arguments);
        }
      }
    }

  hookRequest()
  let localsTimer = setInterval(() => {
    if (!unsafeWindow.locals) return
    clearInterval(localsTimer)
    console.log('设置window.locas', unsafeWindow.locals)
    let originalSet = unsafeWindow.locals.set
    unsafeWindow.locals.set = function(n, t) {
      console.log('%c[hook]' + n + ': ' + t, 'color:blue;')
      if (['is_vip', 'is_svip'].indexOf(n) != -1) {
        t = 1
      } else if (n == 'vip_level') {
        t = 10
      } else if (n == 'v10_id') {
        t = '666666'
      }
      console.log(arguments)
      originalSet.apply(this, [n, t])
    }
    if (unsafeWindow.locals.userInfo) {
      unsafeWindow.locals.userInfo.vip_level = 8
      unsafeWindow.locals.userInfo.vip_identity = 21
      unsafeWindow.locals.userInfo.username = "GwenCrackヾ(-_-;)"
    } else if(unsafeWindow.locals.mset) {
      unsafeWindow.locals.mset({
        'is_vip': 1,
        'is_svip': 1,
        'vip_level': 8,
        'show_vip_ad': 0
      })
    } else {
      unsafeWindow.locals.vip_level = 8
      unsafeWindow.locals.is_vip = 1
      unsafeWindow.locals.is_svip = 1
      unsafeWindow.locals.is_evip = 0
      unsafeWindow.locals.show_vip_ad = 0
    }
  }, 10)

})()