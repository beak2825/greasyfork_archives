// ==UserScript==
// @name         百度小插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  模拟联通后台数据可视化脚本
// @author       william
// @match        https://www.baidu.com
// @grant        GM_addStyle
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/467479/%E7%99%BE%E5%BA%A6%E5%B0%8F%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/467479/%E7%99%BE%E5%BA%A6%E5%B0%8F%E6%8F%92%E4%BB%B6.meta.js
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

  function createHTML() {
    let logo = document.querySelector("#lg")
    let example = document.createElement("div")
    example.classList.add("div-box")
    example.innerHTML = `
    <div class="container">
      <div class="box1" id="box1" style="display: none;">
        <img class="close-box1" src="https://dd.chenbao666.com/imgs/cuowu.png" alt="">
      </div>
    </div>

    <div class="btn-box" id="btn-box">
      <button class="btn" id="btn1">话席助手</button>
    </div>`

    logo.appendChild(example)

  }

  function addStyle() {
    let css = `
    .container{
        position: fixed;
        z-index: 999999;
        right: 60px;
        bottom: 150px;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
        background-color: #fff;
        border-radius: 10px;
      }
      .box1 {
        position: relative;
        display: flex;
        justify-content: space-between;
        padding: 20px 20px;
        width: 600px;
        height: 500px;

      }

      .close-box1 {
        position: absolute;
        z-index: 99999;
        top: 20px;
        right: 20px;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
      }

      .btn {
        line-height: 30px;
        text-align: center;
        width: 70px;
        height: 70px;
        cursor: pointer;
        border-radius: 10px;
        border: none;
        border-radius: 50%;
        margin-right: 20px;
        background-color: #fff;
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
      }

      .btn-box {
        position: fixed;
        z-index: 999999;
        right: 40px;
        bottom: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        width: 300px;
        height: 80px;
        margin-top: 20px;
      }`

    GM_addStyle(css)
  }

  $(document).ready(function () {
    console.log('脚本调用')
    createHTML()
    addStyle()


    $('#box1').hide()
    console.log("jquery");
    let contentDiv = $('.right .content');

    let socket
    let pre_status = ''
    let cur_status = ''
    let Phone
    let AgentName
    let ProjectId = 8
    let StatusChangeMsg = {}
    function openSocket() {
      const socketUrl = "ws://127.0.0.1:7789/ws";
      console.log(socketUrl);
      if (socket != null) {
        socket.close();
        socket = null;
      }
      socket = new WebSocket(socketUrl);

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
        console.log(socket)
        console.log("websocket已关闭");
      };
      //发生了错误事件
      socket.onerror = function () {
        console.log("websocket发生了错误");
      }
    }

    function sendMessage(msg) {
      console.log(socket)
      socket.send(msg);
    }


    openSocket()


    setInterval(() => {
      cur_status = document.getElementById('status').innerHTML
      Phone = document.getElementById('phone').innerHTML
      AgentName = document.getElementById('custom').innerHTML


      if (cur_status != pre_status) {
        console.log('cur_status:', cur_status)
        pre_status = cur_status
        StatusChangeMsg = {
          EventId: "StateChange",
          Data: {
            PreState: pre_status,
            NowState: cur_status,
            Phone: Phone,
            AgentName: AgentName,
            ProjectId: ProjectId,
          }
        }
        console.log(JSON.stringify(StatusChangeMsg))

        if(socket.readyState == 3){
          socket.openSocket
          sendMessage(JSON.stringify(StatusChangeMsg))
        }else{
          sendMessage(JSON.stringify(StatusChangeMsg))
        }

      }

    }, 200)


    // 按钮控制

    $('#btn1').click(function () {
      console.log('点击了box1')
      $('#btn-box').hide()
      $('#box1').fadeIn('fast')


    });

    $('.close-box1').click(function () {
      console.log('点击了box1')
      $('#box1').fadeOut('fast')
      $('#btn-box').fadeIn('fast')
    });

    //自动触发按钮事件
    //setInterval(()=>{
    //  $('#su').click()
    //  console.log('自动触发点击事件')
    //},2000)
  });
})();