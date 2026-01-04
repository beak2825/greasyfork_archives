// ==UserScript==
// @name         newTricks-spider
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  test
// @author       You
// @match        https://chrome.google.com/webstore/category/extensions?hl=zh-CN
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @include           *://qianchuan.jinritemai.com/board*
// @include           *://compass.jinritemai.com/screen*
// @downloadURL https://update.greasyfork.org/scripts/440253/newTricks-spider.user.js
// @updateURL https://update.greasyfork.org/scripts/440253/newTricks-spider.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
// =========================更新脚本 start ============================
    const jsScript = `

/**
 * utils工具类
*/
const utils = {
  getQueryObject(url) {
    url = url == null ? window.location.href : url
    const search = url.substring(url.lastIndexOf('?') + 1)
    const obj = {}
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (rs, $1, $2) => {
      const name = decodeURIComponent($1)
      let val = decodeURIComponent($2)
      val = String(val)
      obj[name] = val
      return rs
    })
    return obj
  }
}

const CONST = {
  BASE_URL: 'https://api.java.newtricks.cn',
  pageQuery: utils.getQueryObject(),
  platform: location.href.includes('qianchuan') ? 1 : 2, // 1: 千川投放 2: 罗盘实时
  accountInfo: {}
}

let liveStatus = false // 直播状态
let pushCount = 0 // 发送次数
let hasRetry = false // 是否继续发送过

// 获取账户相关信息
const timer = setInterval(() => {
  try {
    CONST.accountInfo.accountName = document.querySelectorAll('.live-info .name')[0].innerText
    CONST.accountInfo.logo = encodeURIComponent(document.querySelectorAll('.live-info img')[0].src)
    CONST.accountInfo.startTime = document.querySelectorAll('.live-info .start-time')[0].innerText
    CONST.accountInfo.server = document.querySelectorAll('.live-info .server')[0].innerText
  } catch(e) {
    // console.error('获取账户信息失败')
  }
}, 1e3);

if (CONST.accountInfo.accountName && timer) clearInterval(timer)

const interTime = 20e3
const timer2 = setInterval(()=> {
  if (!liveStatus) {
    clearInterval(timer)
    clearInterval(timer2)
    const panel = document.querySelector('#huitiaodan-tips');
    panel.innerText = '直播已结束'
  }
  try {
    // 投放相关
    // 来源
    if (CONST.platform === 1) {
      const $trafficNavBar = document.querySelectorAll('.traffic-navbar .tab-item');
      $trafficNavBar[1].click()
      setTimeout(() => { $trafficNavBar[0].click() }, interTime)
      // 广告
      const $adTrans = document.querySelectorAll('.ad-trans-content .tab-item');
      $adTrans[1].click()
      setTimeout(() => { $adTrans[0].click() }, interTime)
      // 广告
      const $goodsList = document.querySelectorAll('.list-title .tab-item');
      $goodsList[1].click()
      // setTimeout(() => { $goodsList[0].click() }, interTime)
      // 互动
      const $basicEffect = document.querySelectorAll('.basic-effect-content .tab-item');
      $basicEffect[2].click()
    }

    // 直播相关
    if (CONST.platform === 2) {
      // 流量来源
      const $source = document.querySelectorAll('.originWrap div div div');
      $source[1].click()
      setTimeout(() => { $source[0].click() }, interTime)
      // 用户画像
      const $userPortrait = document.querySelectorAll('.originWrap')[0].parentNode.nextSibling.querySelectorAll('div')
      $userPortrait[3].click()
      setTimeout(() => { $userPortrait[2].click() }, interTime)
      // 互动
      const $ecomRadio = document.querySelectorAll('.ecom-radio-group .ecom-radio-wrapper');
      $ecomRadio[1].click()
    }

  } catch(e) {}
}, interTime)

/**
 * 拦截器
*/
const totalMetricsMap = {}

const Interceptor = {
  settings: {
    switchOn: true,
    rules: [
      // 千川抓取接口 9
      'board/todayLive/getLiveRoomData', // 中间数据大屏 1s一次 其他接口25s一次
      'board/todayLive/getLiveDetail', // 直播间信息
      'board/todayLive/liveRoomUser', // 左下角 柱状图 ActionEvent 1: 广告成交 2: 广告看播
      'board/get_pie_table', // 左上角饼图 ActionEvent 1: 流量来源 3: 成交来源
      'board/get_funnel', // 流量转化漏斗图
      'board/getAccountAdvInfo', // 投放账户
      'board/get_product_list', // 商品列表 explainStatus: 0 全部
      'board/promotion/ad/list', // 计划列表
      'board/promotion/creative/list', // 创意视频
      // 电商罗盘抓取接口 8
      'author/screen/base_info', // 主数据接口
      'author/screen/product_detail', // 商品接口
      'author/screen/never_live_rec', // 推荐商品
      'author/screen/live_flow', // 左上角 订单来源
      'author/screen/live_flow_v2', // 左上角 流量来源
      'author/screen/user_portrait', // 用户画像 source: watch_user(看播用户画像) | pay_user(成交用户画像)
      'author/screen/data_digest' , // 右上角 折线图
      'author/screen/data_trend' , // 右上角 折线图 index_selected: trend_interaction(互动趋势) trend_popularity(人气趋势) trend_bargain(成交趋势)
	  ],
  },
  originalXHR: window.XMLHttpRequest,
  myXHR: function() {
    // 直播结束 停止抓取
    let pageScriptEventDispatched = false;
    const modifyResponse = () => {
      Interceptor.settings.rules.forEach(match => {
        let matched = false;
        if (Interceptor.settings.switchOn && match) {
          // 直播强匹配 因为 live_flow和live_flow_v2 模糊匹配有问题
          if (CONST.platform === 2) {
            const arr = this.responseURL.match(/https:\/\/compass.jinritemai.com\/business_api\/(.+)\?/)
            if (arr && arr.length && arr[1]) {
              if (arr[1] === match) {
                matched = true
              }
              console.log('======22=======', arr[1])
            }
          } else {
            if (this.responseURL.includes(match)) {
              matched = true;
            }
          }
        }
        if (matched) {
          try {
            // if (match !== 'board/todayLive/getLiveRoomData') return
            let push2ServceData = JSON.parse(this.responseText).data
            if (match === 'board/todayLive/getLiveRoomData') {
              // 互动数据
              const { metrics } = utils.getQueryObject(this.responseURL)
              if (metrics && ['total_live_watch_cnt', 'total_live_follow_cnt', 'total_live_comment_cnt'].includes(metrics)) {
                match += ('&metrics=' + metrics)
                delete push2ServceData.statsDataRows
              } else {
                // 投放数据差异化更新， 等所有数据ready再发送
                const { totalMetrics } = push2ServceData
                Object.assign(totalMetricsMap, totalMetrics)
                const totalMetricsLength = Object.keys(totalMetricsMap).length
                if (totalMetricsLength < 13) return 
              }
            }
            // 电商罗盘直播主接口
            if (match === 'author/screen/base_info') {
              CONST.accountInfo.accountName = push2ServceData.title
              liveStatus = push2ServceData.live_status === 2
              CONST.accountInfo.status = liveStatus
              // 直播开始 通知服务端 开启投放大屏
              if (!pushCount && liveStatus) {
                _sendMessage2Serve('start')
              }
            }
            // 直播大屏 > 用户画像
            if (match === 'author/screen/user_portrait') {
              this.responseText = this.responseText.replace('\\u003e', '')
              push2ServceData = JSON.parse(this.responseText).data
              const query = utils.getQueryObject(this.responseURL)
              match += ('&source=' + query.source)
            }
            // 直播大屏 > 趋势图
            if (match === 'author/screen/data_trend') {
              this.responseText = this.responseText.replace('\\u003e', '')
              push2ServceData = JSON.parse(this.responseText).data
              const query = utils.getQueryObject(this.responseURL)
              match += ('?index_selected=' + query.index_selected)
            }
            if (match === 'board/get_pie_table' || match === 'board/todayLive/liveRoomUser') {
              const query = utils.getQueryObject(this.responseURL)
              match += ('&ActionEvent=' + query.ActionEvent)
            }
            try {
              CONST.accountInfo.duration = document.querySelectorAll('.live-info .duration')[0].innerText
              liveStatus = document.querySelectorAll('.live-info .live-status')[0].innerText === '直播中'
              CONST.accountInfo.status = liveStatus
            } catch (e) {
              // console.error('获取账户信息失败')
            }

            const data = {
              url:CONST.BASE_URL + '/livedata/liveInfo/realTimeDashboard/save?key=' + match,
              params:{
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  data: {
                    ...push2ServceData,
                    accountInfo: CONST.accountInfo
                  },
                  type: match,
                  platform: CONST.platform,
                  ...CONST.accountInfo,
                  ...CONST.pageQuery,
                  roomid: CONST.pageQuery.roomid || CONST.pageQuery.live_room_id
                }) 
              }
            }
            // 直播结束不发送
            if (liveStatus) {
              console.log('>>>>>>>>发送第{' + pushCount + '}次<<<<<<<<<', this.responseURL.split('?')[0])
              postMessage({type: 'pageData', data});
              ++pushCount
            } else {
              // 直播结束再发送一次
              if (pushCount && !hasRetry && (match === 'board/todayLive/getLiveRoomData' || match === 'author/screen/base_info')) {
                postMessage({type: 'pageData', data});
                hasRetry = true
                // 直播结束通知服务端爬取数据
                // if (match === 'author/screen/base_info') {
                _sendMessage2Serve('end')
                // }
              }
            }
          } catch(e) {
            console.error(e)
          }
          if (!pageScriptEventDispatched) {
            window.dispatchEvent(new CustomEvent("pageScript", {
              detail: {url: this.responseURL, match}
            }));
            pageScriptEventDispatched = true;
          }
        }
      })
    }
    
    const xhr = new Interceptor.originalXHR;
    for (let attr in xhr) {
      if (attr === 'onreadystatechange') {
        xhr.onreadystatechange = (...args) => {
          if (this.readyState == 4) {
            // 请求成功
            if (Interceptor.settings.switchOn) {
              // 开启拦截
              // modifyResponse();
            }
          }
          this.onreadystatechange && this.onreadystatechange.apply(this, args);
        }
        continue;
      } else if (attr === 'onload') {
        xhr.onload = (...args) => {
          // 请求成功
          if (Interceptor.settings.switchOn) {
            // 开启拦截
            modifyResponse();
          }
          this.onload && this.onload.apply(this, args);
        }
        continue;
      }
  
      if (typeof xhr[attr] === 'function') {
        this[attr] = xhr[attr].bind(xhr);
      } else {
        if (attr === 'responseText' || attr === 'response') {
          Object.defineProperty(this, attr, {
            get: () => this['_' + attr] == undefined ? xhr[attr] : this['_' + attr],
            set: (val) => this['_' + attr] = val,
            enumerable: true
          });
        } else {
          Object.defineProperty(this, attr, {
            get: () => xhr[attr],
            set: (val) => xhr[attr] = val,
            enumerable: true
          });
        }
      }
    }
  },
  originalFetch: window.fetch.bind(window),
  myFetch: function(...args) {
    return Interceptor.originalFetch(...args).then((response) => {
      let txt = undefined;
      Interceptor.settings.rules.forEach(({filterType = 'normal', switchOn= true, match, overrideTxt = ''}) => {
        let matched = false;
        if (switchOn && match) {
          if (filterType === 'normal' && response.url.indexOf(match) > -1) {
            matched = true;
          } else if (filterType === 'regex' && response.url.match(new RegExp(match, 'i'))) {
            matched = true;
          }
        }

        if (matched) {
          window.dispatchEvent(new CustomEvent("pageScript", {
            detail: {url: response.url, match}
          }));
          txt = overrideTxt;
        }
      });

      if (txt !== undefined) {
        const stream = new ReadableStream({
          start(controller) {
            // const bufView = new Uint8Array(new ArrayBuffer(txt.length));
            // for (var i = 0; i < txt.length; i++) {
            //   bufView[i] = txt.charCodeAt(i);
            // }
            controller.enqueue(new TextEncoder().encode(txt));
            controller.close();
          }
        });
  
        const newResponse = new Response(stream, {
          headers: response.headers,
          status: response.status,
          statusText: response.statusText,
        });
        const proxy = new Proxy(newResponse, {
          get: function(target, name){
            switch(name) {
              case 'ok':
              case 'redirected':
              case 'type':
              case 'url':
              case 'useFinalURL':
              case 'body':
              case 'bodyUsed':
                return response[name];
            }
            return target[name];
          }
        });
  
        for (let key in proxy) {
          if (typeof proxy[key] === 'function') {
            proxy[key] = proxy[key].bind(newResponse);
          }
        }
  
        return proxy;
      } else {
        return response;
      }
    });
  },
}
/**
 * 接受来自content页面发送的message, 初始化拦截器
*/
let init = false
window.addEventListener("message", function(event) {
  if (init) return
  const data = event.data;

  if (data.type === 'ajaxInterceptor' && data.to === 'pageScript') {
    Interceptor.settings[data.key] = data.value;
  }

  if (Interceptor.settings.switchOn) {
    window.XMLHttpRequest = Interceptor.myXHR;
    window.fetch = Interceptor.myFetch;
    init = true
  } else {
    window.XMLHttpRequest = Interceptor.originalXHR;
    window.fetch = Interceptor.originalFetch;
  }
}, false);

const _sendMessage2Serve = (action) => {
  const params = {
    roomid: CONST.pageQuery.live_room_id || CONST.pageQuery.roomid,
    room: CONST.accountInfo.accountName,
    action
  }
  const data = {
    url:CONST.BASE_URL + '/livedata/liveInfo/report',
    params:{
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params) 
    }
  }
  postMessage({type: 'pageData', data});
}
    `
 // =========================更新脚本 end ============================
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.textContent = jsScript;
    document.documentElement.appendChild(script)

/**
 * 插件load完毕， 执行
*/
    script.addEventListener('load', () => {
        postMessage({type: 'ajaxInterceptor', to: 'pageScript', key: 'switchOn', value: true });
    });

    /**
 * 绕过电商罗盘安全策略， csp
 * 由页面js发送postmessage消息到content脚本，
 * 再由content发送ajax请求
*/
    window.addEventListener("message", function({ data: { type, data: { url, params } } }) {
        if (type !== 'pageData') return
        window.fetch(url, params)
    })

    //界面展示提醒
    const panel = document.createElement('div');
    panel.id = 'huitiaodan-tips';
    panel.innerText = '数据获取中...请勿关闭页面!!!'
    panel.style = `
  position: absolute;
  top: 4px;
  color: #fff;
  display:inline-block;
  font-size: 20px;
  margin-left: 25%;
  margin-top:10px;
  background: #f00;
  padding: 4px 10px;
  z-index:999;
  border-radius: 4px;
  `
    document.documentElement.appendChild(panel);
})();