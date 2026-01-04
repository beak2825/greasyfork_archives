// ==UserScript==
// @name         检测B站直播弹幕拦截
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  检测你的弹幕是否真的发出去了
// @author       熊孩子
// @match        https://live.bilibili.com/*
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/axios@0.21.0/dist/axios.min.js
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/460198/%E6%A3%80%E6%B5%8BB%E7%AB%99%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/460198/%E6%A3%80%E6%B5%8BB%E7%AB%99%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==
(function () {

  function main() {
    const originFetch = fetch;
    unsafeWindow.fetch = (...arg) => {
      if (arg[0].indexOf('api.live.bilibili.com/msg/send') > -1) {
        let ReturnPackage = PostRequest(arg);
        ReturnPackage.then(res => {
          if (res.msg == "f") {
            prompt("你的弹幕被吞了,该弹幕是全站屏蔽(msg:f)（Ctrl+c 复制该弹幕）", arg[1].data.msg);
          }
          if (res.msg == "k") {
            prompt("你的弹幕被吞了,该弹幕是主播屏蔽(msg:k)（Ctrl+c 复制该弹幕）", arg[1].data.msg);
          }
        })
        return new Promise(() => {
          throw new Error();
        });
      } else {
        return originFetch(...arg);
      }
    }
  }

  let apiClient = axios.create({
    baseURL: 'https://api.live.bilibili.com',
    withCredentials: true
  })

  async function PostRequest(arg) {//获取弹幕池中当前登录用户在这个直播间发的最后一条弹幕
    let cookie = document.cookie;
    let ObjectCookie = objectCookies(cookie)

    let data = new FormData()
    if (arg[1].data.dm_type == 1) {
      data.append('dm_type', arg[1].data.dm_type)
    }
    data.append('bubble', arg[1].data.bubble)
    data.append('color', arg[1].data.color)
    data.append('fontsize', arg[1].data.fontsize)
    data.append('mode', arg[1].data.mode)
    data.append('msg', arg[1].data.msg)
    data.append('rnd', 1639028927)
    data.append('roomid', arg[1].data.roomid)
    data.append('csrf', ObjectCookie.bili_jct)
    data.append('csrf_token', ObjectCookie.bili_jct)
    let ajaxObj = (await apiClient.post('/msg/send', data, {
      cookie: cookie
    })).data
    return ajaxObj;
  }

  function objectCookies(cookie) {
    //"key=value;key=value"
    //["key=value","key=value"]
    var cookies = cookie.split(';');
    var result = {};

    for (var i = 0; i < cookies.length; i++) {
      //"key=value"
      //["key", "value"]
      var keyvaluepair = cookies[i].split('=');
      result[keyvaluepair[0].trim()] = keyvaluepair[1];
    }
    return result;
  }

  main()
})();