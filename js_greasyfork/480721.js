// ==UserScript==
// @name         Shopee 商品数据抓取
// @namespace    http://tampermonkey.net/
// @version      0.7
// @license      MIT
// @description  收集 shopee 商品数据
// @author       MaiZhongwen
// @xxxxx       https://shopee.co.id/product/*
// @match        https://id.xiapibuy.com/product/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopee.co.id
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// @run-at       document-start
// @resource    jqueryBaseCSS https://cdn.bootcdn.net/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css
// @resource    jqueryToastCSS https://cdn.bootcdn.net/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.css
// @require https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js
// @require https://cdn.bootcdn.net/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @require https://cdn.bootcdn.net/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.js
// @require https://cdn.bootcdn.net/ajax/libs/echarts/5.4.2/echarts.common.min.js
// @downloadURL https://update.greasyfork.org/scripts/480721/Shopee%20%E5%95%86%E5%93%81%E6%95%B0%E6%8D%AE%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/480721/Shopee%20%E5%95%86%E5%93%81%E6%95%B0%E6%8D%AE%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

//console.log(unsafeWindow)


let curr = null
let count = 0


let originalFetch = unsafeWindow.fetch 
unsafeWindow.fetch = function(input, init) {
  // 在发送请求之前进行拦截和修改
  // 可以在这里添加你的自定义逻辑

  // 调用原始的 fetch 函数
  
  let url = arguments[0]
  
  if (url.indexOf('get_pc') > 0) {
    //console.log("拉取商品数据")
    // console.log(arguments)
  }

  return originalFetch.apply(unsafeWindow, arguments).then(res => {
    

    if (url.indexOf('get_pc') > 0) {
      //console.log("返回商品数据")
      // console.log(res.json())

      // 复制响应流
      const responseCopy = res.clone();
      responseCopy.json().then(data => {
        console.log(data)
        curr = {
          url: unsafeWindow.location.href, 
          response: data,
        }
      })
      

    }



    return res
  })
};

var jqueryBaseCSS = GM_getResourceText("jqueryBaseCSS");
GM_addStyle(jqueryBaseCSS);
var jqueryToastCSS = GM_getResourceText("jqueryToastCSS");
GM_addStyle(jqueryToastCSS);


GM_addStyle(`

#collecttip { 
  color: white;
  text-align: center;
}

`);



function parseNumberString(numberString) {
  const multipliers = {
    k: 1000,
    m: 1000000,
    b: 1000000000,
  };

  const numericPart = parseFloat(numberString);
  const suffix = numberString.slice(-1).toLowerCase();

  if (suffix in multipliers) {
    return Math.trunc(numericPart * multipliers[suffix]);
  }

  return numericPart;
}


function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}


function getQueryParams() {
  // 获取当前页面的查询字符串
  var queryString = window.location.search;

  // 创建 URLSearchParams 对象
  var searchParams = new URLSearchParams(queryString);

  // 创建空对象用于存储解析后的参数
  var params = {};

  // 遍历查询参数并存储到对象中
  searchParams.forEach(function(value, key) {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    } else {
      params[key] = value;
    }
  });
  return params
}


function hasToken() {
  return unsafeWindow.__WEBCHAT_SESSION__
}



function onElementInserted(target, elementSelector, callback) {

  var onMutationsObserved = function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        // console.log(mutation.addedNodes)
        var elements = null
        if (typeof elementSelector == 'function') {
          elements = elementSelector(mutation.addedNodes);
        } else if (typeof elementSelector == 'string') {
          elements = $(mutation.addedNodes).find(elementSelector);
        } else {
          elements = mutation.addedNodes
        }

        for (var i = 0, len = elements.length; i < len; i++) {
          callback(elements[i]);
        }
      }
    });
  };

  var config = { childList: true, subtree: true };
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var observer = new MutationObserver(onMutationsObserved);
  observer.observe(target, config);
}


(() => {
  "use strict";

  //console.log('插件代码开始');

  onElementInserted(document, '.shopee-top.container-wrapper', (i) => {
    console.log("成功xxxxxx", i)
    $(i).append('<div id="collecttip">未开始收集</div>')
    updateProgress()
})

function updateProgress(text) {

  $('#collecttip').empty()
  if(curr) {
    let curr_id = curr.response?.data?.item?.item_id
    $('#collecttip').append(`<div>已收集(${count})：${curr_id}</div>`)
  } 
  if(text) {
    $('#collecttip').append(text)
  }
}


  //var url = "ws://localhost:8000/ws/crackdown/shopeeproduct"
  var url = "wss://web.feimeidms.com/support/ws/crackdown/shopeeproduct"
  var socket;

  function initWebSocket(onopenCb, onmessageCb) {
    socket = new WebSocket(url);

    socket.onopen = function() {
      console.log("WebSocket连接已打开");
      onopenCb(socket)
    };

    socket.onmessage = function(event) {
      console.log("收到消息:", event.data);
      onmessageCb(JSON.parse(event.data))
    };

    socket.onerror = function(error) {
      // 发生错误
      console.error('WebSocket error:', error);
    };

    socket.onclose = function(e) {
      console.log("WebSocket连接已关闭", e);
      setTimeout(() => {
        initWebSocket(startTask, handleMessage)
      }, 3000)
      
    };
  }


  function startTask() {

    // 还没获取到数据，稍后再试
    if(!curr) {
      setTimeout(startTask, 1000)
      return
    }

    sendTaskResult(curr)
  }

  function queryTask() {
    let task = {
      action: "query_task",
    }
    socket.send(JSON.stringify(task))
  }

  function sendTaskResult(data) {
    count += 1
    updateProgress()
    let resultTask = {
      action: "collect_shopee_product",
      data: data,
    }
    socket.send(JSON.stringify(resultTask))
  }

  function handleMessage(message) {
    let action = message.action
    if (action == 'check_exists') {
      let shop_id = message.data.shop_id
      let product_id = message.data.product_id
      var protocol = window.location.protocol;
      var host = window.location.host;
      let api_link = `/api/v4/pdp/get_pc?shop_id=${shop_id}&item_id=${product_id}`
      let next_link = `${protocol}//${host}/product/${shop_id}/${product_id}`
      //console.log(api_link)

      updateProgress(`正在收集: ${product_id}`)

      // 有
      // let api_link = 'https://shopee.co.id/api/v4/pdp/get_pc?shop_id=255365082&item_id=23813688674'
      // 无
      // let api_link = 'https://shopee.co.id/api/v4/pdp/get_pc?shop_id=748979514&item_id=22785289853'
      unsafeWindow.fetch(api_link)
        .then(response => {
          if (response.status != 200) {
            // 改用连接跳转方式获取数据

            let params = getQueryParams()

            if (params?._use_redirect) {
              next_link = next_link + "?_use_redirect=1"
              window.location.href = next_link
            }
            
            return Promise.reject(new Error("无法获取商品数据")); 
          }
          return response.json()
        })
        .then(data => {
          curr = {
            url: next_link,
            response: data,
          }
          sendTaskResult(curr)
        })
        .catch(error => {
          console.error(error)
          updateProgress(`<a href="${next_link}?_use_redirect=1">${error} : ${product_id}  点击重试（后面会自动刷新页面）</a>`)
        })
    } else if (action == 'no_task') {
      updateProgress("没有新任务")
      setTimeout(() => {
        queryTask()
      }, 5000)
    }

  }



  initWebSocket(startTask, handleMessage)

})();