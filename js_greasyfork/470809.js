// ==UserScript==
// @name         智能话席助手
// @description   一个在电信领域的智能助手
// @namespace    http://tampermonkey.net/
// @license      GPL-3.0-only
// @version      20240109
// @description  智能话席助手
// @author       xiaoliang
// @match        https://123.147.219.22:9114/*
// @match        http://10.238.1.245/*
// @match        http://127.0.0.1:5500/512lmock_liangtong_page.html
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require      https://unpkg.com/interactjs@1.10.26/dist/interact.min.js
// @downloadURL https://update.greasyfork.org/scripts/470809/%E6%99%BA%E8%83%BD%E8%AF%9D%E5%B8%AD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/470809/%E6%99%BA%E8%83%BD%E8%AF%9D%E5%B8%AD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Your code here...
  if (!$) {
    var s = document.createElement("script");
    s.src = "http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js";
    s.async = false;
    document.documentElement.appendChild(s);
  }

  const LOGO_CLOSE_SRC = 'https://cq.infowell.cn/image/close-logo.png'
  const LOGO_INACTIVE_SRC = 'https://cq.infowell.cn/image/in-intelligent-assistant.png'
  const LOGO_ACTIVE_SRC = 'https://cq.infowell.cn/image/intelligent-assistant.png'

  //开发环境
  const DEV_SERVER_URL = 'http://192.168.10.47:81'
  //生产环境
  const PROD_SERVER_URL = 'https://cq.infowell.cn'
  //语音助手ws
  const WS_SERVER_URL = 'ws://127.0.0.1:7789/ws'

  //登录窗口
  let loginMainDom = ''

  //业务窗口
  let serviceMainDom = ''

  //外呼窗口
  let callMainDom = ''

  //话务员
  let userNameDom = ''

  //通话状态：无效 通话 整理
  let callStatusDom = ''

  //客户号码
  let consumerPhoneDom = ''

  //产品名
  let produceNameDom = ''

  //iframe原始高度
  let iframeOriginHeight = 220

  //iframe完整高度
  let iframeFullHeight = 825

  //iframe原始宽度
  let iframeOriginWidth = 215

  //iframe完整宽度
  let iframeFullWidth = 1080

  //面板初始化位置，用于面板拖动
  let position = { x: 0, y: 0 }

  let openFlag = 1
  let socket = null
  let pre_status = ''
  let cur_status = ''
  let pre_phone = ''
  let cur_phone = ''
  let Phone = ''
  let ProductName = ''
  let StatusChangeMsg = {}
  let InitParameterMsg = {
    EventId: "InitParameter",
    Data: {
      ProjectId: 16,
      ProjectName: '5G升级包外呼营销',
      AgentName: ''
    }
  }

  //加载在线样式
  //const css1 = GM_getResourceText("customCSS1");
  //GM_addStyle(css1)

  //构造文档
  function createHTML() {
    //.center 生产环境
    //.appContent 开发环境
    let logo = document.querySelector('.center')
    let example = document.createElement("div")
    example.classList.add("div-box")
    example.innerHTML = `
     <div class="table-member-container draggable"></div>`
    logo ? logo.appendChild(example) : ''
  }

  //渲染样式
  function addStyle() {
    let css = `
           .table-member-container {
            position: fixed;
            z-index: 99999999;
            bottom: 0;
            right: 0;
	        display: inline-block;
            width:auto;
            height:auto;
            padding:25px 10px 10px 10px;
        }

           .iframe{
            border:none;
            padding:5px;
            box-sizing: border-box;
        }`

    GM_addStyle(css)
  }

  //发送消息
  function sendMessage(msg) {
    console.log('正在向websocket发送消息,消息如下：')
    console.log(msg)
    socket.send(msg);
  }

  //连接webocket
  function openSocket() {
    const socketUrl = WS_SERVER_URL;
    console.log(socketUrl);
    if (socket != null) {
      socket.close();
      socket = null;
    }
    socket = new WebSocket(socketUrl);
    console.log('socket对象：');
    console.log(socket);

    //打开事件
    socket.onopen = function () {
      console.log("websocket已打开");
    };
    //获得消息事件
    socket.onmessage = function (msg) {
      // alert("收到消息：" + msg.data);
      console.log(msg.data);
      //发现消息进入,开始处理前端触发逻辑
    };
    //关闭事件
    socket.onclose = function () {
      console.log("websocket已关闭");
    };
    //发生了错误事件
    socket.onerror = function () {
      console.log("websocket发生了错误");
    }
  }

  //文档加载完毕后执行
  $(document).ready(function () {
    console.log('文档已加载完毕，坐席脚本正在启动...')
    createHTML()
    addStyle()
    openSocket()

    //面板拖动
    interact('.draggable').draggable({
      listeners: {
        start(event) {
          console.log(event.type, event.target)
        },
        move(event) {
          position.x += event.dx
          position.y += event.dy

          event.target.style.transform =
            `translate(${position.x}px, ${position.y}px)`
        },
      }
    })

    setInterval(() => {
      //登录窗口
      loginMainDom = document.querySelector('.loginbox')

      //业务窗口
      serviceMainDom = document.querySelector('#containerCenter')

      //话务员
      userNameDom = document.querySelector('#empName')

      //通话状态：无效 通话 整理
      callStatusDom = document.querySelector('#status') //#status

      //客户号码
      consumerPhoneDom = document.querySelector('#callee')

      //产品名
      produceNameDom = document.querySelector('#taskTitile')

      if (loginMainDom) {
        $('.iframe') ? $('.iframe').hide() : ''
      }

      if (serviceMainDom) {
        $('.iframe') ? $('.iframe').show() : ''
      }

      // 通话状态：无效 通话 整理
      if (callStatusDom) {
        cur_status = callStatusDom.innerHTML == '通话' ? '通话中' : callStatusDom.innerHTML
      }

      // 号码
      if (consumerPhoneDom && consumerPhoneDom.innerHTML) {
        Phone = consumerPhoneDom.innerHTML
        cur_phone = consumerPhoneDom.innerHTML
      }

      if (userNameDom && userNameDom.innerHTML) {
        InitParameterMsg.Data.AgentName = userNameDom.innerHTML
      }

      if (produceNameDom && produceNameDom.innerHTML) {
        ProductName = produceNameDom.innerHTML
      }
      // 初始化信息
      //sendMessage(JSON.stringify(InitParameterMsg))

      if (cur_phone != pre_phone && cur_status == '通话中') {
        pre_phone = cur_phone
        pre_status = cur_status


        //如果ws断开，则重连并发送消息
        if (socket.readyState == 3) {
          console.log('socket已断开...')
          openSocket()
          console.log('socket已断开重连...')
          //数据初始化
          sendMessage(JSON.stringify(InitParameterMsg))
          StatusChangeMsg = {
            EventId: "StateChange",
            Data: {
              PreState: pre_status,
              NowState: cur_status,
              Phone: Phone,
              ProductName: ProductName
            }
          }
          sendMessage(JSON.stringify(StatusChangeMsg))
        }

        //否则发送消息
        else {
          console.log('socket已连接...')
          sendMessage(JSON.stringify(InitParameterMsg))
          StatusChangeMsg = {
            EventId: "StateChange",
            Data: {
              PreState: pre_status,
              NowState: cur_status,
              Phone: Phone,
              ProductName: ProductName
            }
          }
          sendMessage(JSON.stringify(StatusChangeMsg))
        }

      }

      // 只允许在状态改变的时候发消息
      if (cur_status != pre_status && cur_status != '通话中') {

        //把当前号码赋值给上一通号码，当当前号码与上一通号码不一样时再发送消息
        pre_phone = cur_phone
        pre_status = cur_status

        //如果ws断开，则重连并发送消息
        if (socket.readyState == 3) {
          console.log('socket已断开...')
          openSocket()
          console.log('socket已断开重连...')
          //数据初始化
          sendMessage(JSON.stringify(InitParameterMsg))
          StatusChangeMsg = {
            EventId: "StateChange",
            Data: {
              PreState: pre_status,
              NowState: cur_status,
              Phone: Phone,
              ProductName: ProductName
            }
          }
          sendMessage(JSON.stringify(StatusChangeMsg))
        }

        //否则发送消息
        else {
          console.log('socket已连接...')
          sendMessage(JSON.stringify(InitParameterMsg))
          StatusChangeMsg = {
            EventId: "StateChange",
            Data: {
              PreState: pre_status,
              NowState: cur_status,
              Phone: Phone,
              ProductName: ProductName
            }
          }

          sendMessage(JSON.stringify(StatusChangeMsg))

        }

      }
    }, 200)

    // 异步加载iframe，连接上websocket并接受消息
    setTimeout(() => {
      let scriptContent = document.querySelector(".table-member-container")
      let iframeElement = document.createElement("iframe")
      iframeElement.src = PROD_SERVER_URL
      iframeElement.classList.add('iframe')
      iframeElement.width = `${iframeOriginWidth}px`//1100px
      iframeElement.height = '615px'
      iframeElement.frameborder = '0'
      iframeElement.scrolling = 'no'

      scriptContent ? scriptContent.appendChild(iframeElement) : ''
    }, 500)

    //监听iframe页面的消息
    window.addEventListener('message', function (event) {
      console.log('监听event:', event);
      // 确保消息来自指定的iframe
      if (event.origin == PROD_SERVER_URL) {
        //1放大 2缩小
        event.data == '1' ? $('.iframe').attr('width', iframeFullWidth) : $('.iframe').attr('width', iframeOriginWidth)
      }
    });

  });

})();