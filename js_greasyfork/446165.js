// ==UserScript==
// @name         云听CEM
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license MIT
// @description  用于评论自动回复
// @author       jimi
// @require      https://unpkg.com/jquery@3.3.1/dist/jquery.min.js
// @match https://*.yuntingai.com/*
// @match https://*.taobao.com/*
// @match https://voc.taobao.com/*
// @exclude https://www.yuntingai.com/*
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/446165/%E4%BA%91%E5%90%ACCEM.user.js
// @updateURL https://update.greasyfork.org/scripts/446165/%E4%BA%91%E5%90%ACCEM.meta.js
// ==/UserScript==

(function() {
  // 'use strict';
  var $ = $ || window.$;
  unsafeWindow = unsafeWindow || window;
  const noop = () => {};
  console.log("tamper-start");
  unsafeWindow.YT_PLUGIN_IS_INSTALL = true;

 class Storage {
   constructor(key) {
     this.storage = window.localStorage;
     this.prevatekey = key;
   }
   get(key) {
     const value = GM_getValue(this.prevatekey + key);
     if(!value) return value;
     if(value[this.prevatekey + key]) {
       return value[this.prevatekey + key]
     }
     return value[key];
   }
   set(key, value) {
      // GM_setValue只能存储对象或者数组
      if(typeof value === 'string' || typeof value === 'number') {
         value = {
           [this.prevatekey + key]: value,
         }
      }
      GM_setValue(this.prevatekey + key, value);
   }
   remove(key) {
     GM_deleteValue(this.prevatekey + key);
   }
 }

var storage = new Storage("yt_cem_plugin_");

/**
 * 生成前端签名的函数
 * @example CreateSign(token + "&" + timestamp + "&" + appkey + "&" + data);
 * @param {String} e
 * @returns {String}
 */
function CreateSign(e) {
  function t(e, t) {
    return (e << t) | (e >>> (32 - t));
  }
  function n(e, t) {
    var n, r, o, i, a;
    return (
      (o = 2147483648 & e),
      (i = 2147483648 & t),
      (a = (1073741823 & e) + (1073741823 & t)),
      (n = 1073741824 & e) & (r = 1073741824 & t)
        ? 2147483648 ^ a ^ o ^ i
        : n | r
        ? 1073741824 & a
          ? 3221225472 ^ a ^ o ^ i
          : 1073741824 ^ a ^ o ^ i
        : a ^ o ^ i
    );
  }
  function r(e, r, o, i, a, u, s) {
    return (
      (e = n(
        e,
        n(
          n(
            (function(e, t, n) {
              return (e & t) | (~e & n);
            })(r, o, i),
            a
          ),
          s
        )
      )),
      n(t(e, u), r)
    );
  }
  function o(e, r, o, i, a, u, s) {
    return (
      (e = n(
        e,
        n(
          n(
            (function(e, t, n) {
              return (e & n) | (t & ~n);
            })(r, o, i),
            a
          ),
          s
        )
      )),
      n(t(e, u), r)
    );
  }
  function i(e, r, o, i, a, u, s) {
    return (
      (e = n(
        e,
        n(
          n(
            (function(e, t, n) {
              return e ^ t ^ n;
            })(r, o, i),
            a
          ),
          s
        )
      )),
      n(t(e, u), r)
    );
  }
  function a(e, r, o, i, a, u, s) {
    return (
      (e = n(
        e,
        n(
          n(
            (function(e, t, n) {
              return t ^ (e | ~n);
            })(r, o, i),
            a
          ),
          s
        )
      )),
      n(t(e, u), r)
    );
  }
  function u(e) {
    var t,
      n = '',
      r = '';
    for (t = 0; 3 >= t; t++)
      n += (r = '0' + ((e >>> (8 * t)) & 255).toString(16)).substr(r.length - 2, 2);
    return n;
  }
  var s, c, l, d, f, p, h, m, y, g;
  for (
    g = (function(e) {
      for (
        var t,
          n = e.length,
          r = n + 8,
          o = 16 * ((r - (r % 64)) / 64 + 1),
          i = new Array(o - 1),
          a = 0,
          u = 0;
        n > u;

      )
        (a = (u % 4) * 8), (i[(t = (u - (u % 4)) / 4)] = i[t] | (e.charCodeAt(u) << a)), u++;
      return (
        (a = (u % 4) * 8),
        (i[(t = (u - (u % 4)) / 4)] = i[t] | (128 << a)),
        (i[o - 2] = n << 3),
        (i[o - 1] = n >>> 29),
        i
      );
    })(
      (e = (function(e) {
        e = e.replace(/\r\n/g, '\n');
        for (var t = '', n = 0; n < e.length; n++) {
          var r = e.charCodeAt(n);
          128 > r
            ? (t += String.fromCharCode(r))
            : r > 127 && 2048 > r
            ? ((t += String.fromCharCode((r >> 6) | 192)),
              (t += String.fromCharCode((63 & r) | 128)))
            : ((t += String.fromCharCode((r >> 12) | 224)),
              (t += String.fromCharCode(((r >> 6) & 63) | 128)),
              (t += String.fromCharCode((63 & r) | 128)));
        }
        return t;
      })(e))
    ),
      p = 1732584193,
      h = 4023233417,
      m = 2562383102,
      y = 271733878,
      s = 0;
    s < g.length;
    s += 16
  )
    (c = p),
      (l = h),
      (d = m),
      (f = y),
      (p = r(p, h, m, y, g[s + 0], 7, 3614090360)),
      (y = r(y, p, h, m, g[s + 1], 12, 3905402710)),
      (m = r(m, y, p, h, g[s + 2], 17, 606105819)),
      (h = r(h, m, y, p, g[s + 3], 22, 3250441966)),
      (p = r(p, h, m, y, g[s + 4], 7, 4118548399)),
      (y = r(y, p, h, m, g[s + 5], 12, 1200080426)),
      (m = r(m, y, p, h, g[s + 6], 17, 2821735955)),
      (h = r(h, m, y, p, g[s + 7], 22, 4249261313)),
      (p = r(p, h, m, y, g[s + 8], 7, 1770035416)),
      (y = r(y, p, h, m, g[s + 9], 12, 2336552879)),
      (m = r(m, y, p, h, g[s + 10], 17, 4294925233)),
      (h = r(h, m, y, p, g[s + 11], 22, 2304563134)),
      (p = r(p, h, m, y, g[s + 12], 7, 1804603682)),
      (y = r(y, p, h, m, g[s + 13], 12, 4254626195)),
      (m = r(m, y, p, h, g[s + 14], 17, 2792965006)),
      (p = o(p, (h = r(h, m, y, p, g[s + 15], 22, 1236535329)), m, y, g[s + 1], 5, 4129170786)),
      (y = o(y, p, h, m, g[s + 6], 9, 3225465664)),
      (m = o(m, y, p, h, g[s + 11], 14, 643717713)),
      (h = o(h, m, y, p, g[s + 0], 20, 3921069994)),
      (p = o(p, h, m, y, g[s + 5], 5, 3593408605)),
      (y = o(y, p, h, m, g[s + 10], 9, 38016083)),
      (m = o(m, y, p, h, g[s + 15], 14, 3634488961)),
      (h = o(h, m, y, p, g[s + 4], 20, 3889429448)),
      (p = o(p, h, m, y, g[s + 9], 5, 568446438)),
      (y = o(y, p, h, m, g[s + 14], 9, 3275163606)),
      (m = o(m, y, p, h, g[s + 3], 14, 4107603335)),
      (h = o(h, m, y, p, g[s + 8], 20, 1163531501)),
      (p = o(p, h, m, y, g[s + 13], 5, 2850285829)),
      (y = o(y, p, h, m, g[s + 2], 9, 4243563512)),
      (m = o(m, y, p, h, g[s + 7], 14, 1735328473)),
      (p = i(p, (h = o(h, m, y, p, g[s + 12], 20, 2368359562)), m, y, g[s + 5], 4, 4294588738)),
      (y = i(y, p, h, m, g[s + 8], 11, 2272392833)),
      (m = i(m, y, p, h, g[s + 11], 16, 1839030562)),
      (h = i(h, m, y, p, g[s + 14], 23, 4259657740)),
      (p = i(p, h, m, y, g[s + 1], 4, 2763975236)),
      (y = i(y, p, h, m, g[s + 4], 11, 1272893353)),
      (m = i(m, y, p, h, g[s + 7], 16, 4139469664)),
      (h = i(h, m, y, p, g[s + 10], 23, 3200236656)),
      (p = i(p, h, m, y, g[s + 13], 4, 681279174)),
      (y = i(y, p, h, m, g[s + 0], 11, 3936430074)),
      (m = i(m, y, p, h, g[s + 3], 16, 3572445317)),
      (h = i(h, m, y, p, g[s + 6], 23, 76029189)),
      (p = i(p, h, m, y, g[s + 9], 4, 3654602809)),
      (y = i(y, p, h, m, g[s + 12], 11, 3873151461)),
      (m = i(m, y, p, h, g[s + 15], 16, 530742520)),
      (p = a(p, (h = i(h, m, y, p, g[s + 2], 23, 3299628645)), m, y, g[s + 0], 6, 4096336452)),
      (y = a(y, p, h, m, g[s + 7], 10, 1126891415)),
      (m = a(m, y, p, h, g[s + 14], 15, 2878612391)),
      (h = a(h, m, y, p, g[s + 5], 21, 4237533241)),
      (p = a(p, h, m, y, g[s + 12], 6, 1700485571)),
      (y = a(y, p, h, m, g[s + 3], 10, 2399980690)),
      (m = a(m, y, p, h, g[s + 10], 15, 4293915773)),
      (h = a(h, m, y, p, g[s + 1], 21, 2240044497)),
      (p = a(p, h, m, y, g[s + 8], 6, 1873313359)),
      (y = a(y, p, h, m, g[s + 15], 10, 4264355552)),
      (m = a(m, y, p, h, g[s + 6], 15, 2734768916)),
      (h = a(h, m, y, p, g[s + 13], 21, 1309151649)),
      (p = a(p, h, m, y, g[s + 4], 6, 4149444226)),
      (y = a(y, p, h, m, g[s + 11], 10, 3174756917)),
      (m = a(m, y, p, h, g[s + 2], 15, 718787259)),
      (h = a(h, m, y, p, g[s + 9], 21, 3951481745)),
      (p = n(p, c)),
      (h = n(h, l)),
      (m = n(m, d)),
      (y = n(y, f));
  return (u(p) + u(h) + u(m) + u(y)).toLowerCase();
}


const Utils = {
  parseCookies(cookies) {
    if(!cookies) {
      return {};
    }
    var obj = {};
    return cookies.split(";").reduce((sum, item) => {
        var [key, value] = item.split("=")
        sum[key.trim()] = value;
        return sum;
    }, {});
 },
  parseResult(key, str) {
    if(!str) return null;
    str = str.replace(/\s/g, '');
    const reg = new RegExp(`${key}\\((.*)\\)`, 'g');
    const result = reg.exec(str);
    if (!result) {
      return null;
    }
    try {
      return JSON.parse(result[1]);
    } catch (error) {
      return null;
    }
  },
  parseCode(arr) {
    if (!Array.isArray(arr) || !arr.length) {
      return {
        code: '',
        msg: '',
      };
    }
    const str = arr[0];
    const [code = '400', msg = '未知错误'] = str.split('::');
    return {
      code,
      msg,
    };
  },
  getRequestInfo(data) {
    var cookie = Utils.parseCookies(storage.get('token'));
    var token = cookie["_m_h5_tk"]?.split("_")[0];
    var appKey = 12574478;
    var timestamp = (new Date).getTime();
    var sign = CreateSign(token + '&' + timestamp + '&' + appKey + '&' + data);
    return {
      "jsv": "2.6.1",
      "api": "mtop.alibaba.cco.voc.taobao.promotion.render",
      "componentId": "VocGlobalNotice",
      "v": "1.0",
      "dataType": "originaljsonp",
      "type": "originaljsonp",
      appKey,
      "t": timestamp,
      sign,
      data
    }
  }
}


/** 页面发送给插件 */
const PAGE_EVENT_FROM = 'yt_page_message';
/** 插件发送给页面 */
const PLUGIN_EVENT_FROM = 'yt_plugin_message';

const ACTION_TYPE = {
  /** 获取登录态 */
  SEND_IS_LOGIN: 'SEND_IS_LOGIN',
  /** 插件是否已经安装好了 */
  SEND_IS_INSTALL: 'SEND_IS_INSTALL',
  /** 评论回复 */
  SEND_COMMENT_REPLY: 'SEND_COMMENT_REPLY',
  /** 获取商家店铺信息 */
  SEND_SHOP_INFO : 'SEND_SHOP_INFO',
}

 function senMessage(action, value = {}) {
   unsafeWindow.postMessage(
      {
        from: PLUGIN_EVENT_FROM,
        action,
        value
      },
      '*'
    );
 }

function onMessage() {
  unsafeWindow.addEventListener('message', function(event) {
    // 只接收从云听页面过来的消息
    if(event?.data?.from !== PAGE_EVENT_FROM){
      return
    }
    const action = event?.data?.action;
    switch (action) {
      // 判断是否登录了
      case ACTION_TYPE.SEND_IS_LOGIN:
        fetchIsLogin(() => {
          event.source.postMessage({
            from: PLUGIN_EVENT_FROM,
            action: ACTION_TYPE.SEND_IS_LOGIN,
            value: !!storage.get('token'),
          },event.origin);
        })
        break;
      // 评论回复
      case ACTION_TYPE.SEND_COMMENT_REPLY:
        fetchCommentReply(event.data.value ,(value) => {
          event.source.postMessage({
            from: PLUGIN_EVENT_FROM,
            action: ACTION_TYPE.SEND_COMMENT_REPLY,
            value,
            originValue:event.data.value
          },event.origin);
        })
        break;
      // 插件安装检测
      case ACTION_TYPE.SEND_IS_INSTALL:
          event.source.postMessage({
            from: PLUGIN_EVENT_FROM,
            action: ACTION_TYPE.SEND_IS_INSTALL,
            value: true,
          },event.origin);
        break;
      // 获取商家店铺信息
      case ACTION_TYPE.SEND_SHOP_INFO:
          fetchShopInfo((value) => {
            event.source.postMessage({
              from: PLUGIN_EVENT_FROM,
              action: ACTION_TYPE.SEND_SHOP_INFO,
              value,
            },event.origin);
          })
        break;
      default:
        console.error("请输入正确的action")
        break;
    }
  }, false);
}

onMessage();

// 登录检测
function fetchIsLogin(callback = noop) {
  if(location.hostname !== "localhost" && location.hostname.indexOf("voc.taobao.com") === -1 && location.hostname.indexOf("yuntingai.com") === -1) {
    return;
  }
  var storageCookie = storage.get('token');
  if(!storageCookie){
    if(location.hostname.indexOf("voc.taobao.com") > -1) {
      storage.set("token", document.cookie);
    } else {
     console.error("请先登录淘宝！");
     callback();
     return;
    }
  }
  var callbackKey = "mtopjsonp3";
  var data = JSON.stringify({
    "componentId": "VocGlobalNotice",
    "params":JSON.stringify({
      version: '天猫版',
    })
  });
  const params = Utils.getRequestInfo(data);
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://h5api.m.taobao.com/h5/mtop.alibaba.cco.voc.taobao.promotion.render/1.0/?"+decodeURIComponent($.param({
      "callback": callbackKey,
      ...params
    })),
    headers: {},
    cookie:storageCookie,
    onload: function(xhr) {
       const result = Utils.parseResult(callbackKey, xhr.response);
       const msgInfo = Utils.parseCode(result?.ret);
      // 非法请求 || session过期
      if(msgInfo.code === "FAIL_SYS_ILLEGAL_ACCESS" || msgInfo.code === "FAIL_SYS_SESSION_EXPIRED") {
        storage.remove("token");
      } else{
        if(location.hostname.indexOf("voc.taobao.com") > -1) {
           storage.set("token", document.cookie);
        }
      }
      callback();
    },
    onerror: function(err) {
      storage.remove("token");
      callback();
    },
  });
}

// 评论回复接口
function fetchCommentReply(req, callback = noop) {
  if(location.hostname !== "localhost" && location.hostname.indexOf("voc.taobao.com") === -1 && location.hostname.indexOf("yuntingai.com") === -1) {
    return;
  }
  var storageCookie = storage.get('token');
  if(!storageCookie){
    if(location.hostname.indexOf("voc.taobao.com") > -1) {
      storage.set("token", document.cookie);
    } else {
     console.error("请先登录淘宝！");
     callback({
       code: "UN_LOGIN",
       msg: "登录失效"
     });
     return;
    }
  }
  var callbackKey = "mtopjsonp3";
  var data = JSON.stringify({
    "componentId": "explain",
    "params":JSON.stringify(req)
  });
  const params = Utils.getRequestInfo(data);
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://h5api.m.taobao.com/h5/mtop.com.taobao.voc.api.service.data.query/1.0/?"+decodeURIComponent($.param({
      "callback": callbackKey,
      ...params
    })),
    headers: {},
    cookie:storageCookie,
    onload: function(xhr) {
       const result = Utils.parseResult(callbackKey, xhr.response);
       const msgInfo = Utils.parseCode(result?.ret);
      // 非法请求 || session过期
      if(msgInfo.code === "FAIL_SYS_ILLEGAL_ACCESS" || msgInfo.code === "FAIL_SYS_SESSION_EXPIRED") {
        storage.remove("token");
      } else {
        if(location.hostname.indexOf("voc.taobao.com") > -1) {
           storage.set("token", document.cookie);
        }
      }
      console.log('2--ddd', result, msgInfo )
      callback({
        ...msgInfo,
        ...result,
      });
    },
    onerror: function(err) {
      storage.remove("token");
      callback({
        code: "ERROT",
        msg: "调用失败"
      });
    },
  });
}

// 获取商家信息
function fetchShopInfo(callback = noop) {
  if(location.hostname !== "localhost" && location.hostname.indexOf("voc.taobao.com") === -1 && location.hostname.indexOf("yuntingai.com") === -1) {
    return;
  }
  var storageCookie = storage.get('token');
  if(!storageCookie){
    if(location.hostname.indexOf("voc.taobao.com") > -1) {
      storage.set("token", document.cookie);
    } else {
     console.error("请先登录淘宝！");
     callback({
       code: "UN_LOGIN",
       msg: "登录失效"
     });
     return;
    }
  }
  var callbackKey = "mtopjsonp3";
  var data = JSON.stringify({
    "componentId": "LIVE_SHOP_BASIC_INFO",
  });
  const params = Utils.getRequestInfo(data);
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://h5api.m.taobao.com/h5/mtop.com.taobao.voc.tmall.report.render/1.0/?"+decodeURIComponent($.param({
      ...params,
     "api": "mtop.com.taobao.voc.tmall.report.render",
     "componentId": "LIVE_SHOP_BASIC_INFO",
      "jsonpIncPrefix": "tmallreport",
      "callback":callbackKey,
    })),
    headers: {},
    cookie:storageCookie,
    onload: function(xhr) {
       const result = Utils.parseResult(callbackKey, xhr.response);
       const msgInfo = Utils.parseCode(result?.ret);
      // 非法请求 || session过期
      if(msgInfo.code === "FAIL_SYS_ILLEGAL_ACCESS" || msgInfo.code === "FAIL_SYS_SESSION_EXPIRED") {
        storage.remove("token");
      } else {
        if(location.hostname.indexOf("voc.taobao.com") > -1) {
           storage.set("token", document.cookie);
        }
      }
      callback({
        ...msgInfo,
        ...result,
      });
    },
    onerror: function(err) {
      storage.remove("token");
      callback({
        code: "ERROT",
        msg: "调用失败"
      });
    },
  });
}

$(() => {
  // 商家页初始化token
   fetchIsLogin(() => {
     senMessage(ACTION_TYPE.SEND_IS_INSTALL)
   });
});

})();

