// ==UserScript==
// @name         武汉大学图书馆座位选择器
// @namespace    https://greasyfork.org/zh-CN/scripts/26015
// @version      1.03
// @description  挑选自己喜欢的座位或寻找合适时间的座位
// @author       IwYvI
// @match        *://seat.lib.whu.edu.cn/
// @match        *://seat.lib.whu.edu.cn/map
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/26015/%E6%AD%A6%E6%B1%89%E5%A4%A7%E5%AD%A6%E5%9B%BE%E4%B9%A6%E9%A6%86%E5%BA%A7%E4%BD%8D%E9%80%89%E6%8B%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/26015/%E6%AD%A6%E6%B1%89%E5%A4%A7%E5%AD%A6%E5%9B%BE%E4%B9%A6%E9%A6%86%E5%BA%A7%E4%BD%8D%E9%80%89%E6%8B%A9%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const baseUrl = "http://seat.lib.whu.edu.cn";

  var timer = null; // 计时器
  var isStart = false; // 抢座状态
  var waitCount = 0; // 等待次数（第二天选座开始前的等待）
  var requestCount = 0; // 请求次数
  var option = {
    seat: Number,
    startTime: Number,
    endTime: Number,
    token: String
  };

  /**
   * 获取抢课日期
   */
  function getDate() {
    var now = new Date();
    var h = now.getHours();
    if (h >= 22) {
      now.setDate(now.getDate() + 1);
    }
    return now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
  }

  /**
   * 判断是否还在今天的抢课时间
   */
  function isInDayTime() {
    var now = new Date();
    var h = now.getHours();
    if (h < 22) {
      return true;
    }
    return false;
  }

  /**
   * 判断是否进入了第二天预约的时间段
   */
  function isInOrderTime() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    if ((h == 22 && m >= 10) || (h == 23 && m <= 50)) {
      return true;
    }
    return false;
  }

  function saveOption(opt) {
    if (localStorage) {
      localStorage[opt] = option[opt];
    }
  }

  function loadOption(opt) {
    if (localStorage) {
      return localStorage[opt];
    }
  }

  function setOption(key, value, save = false) {
    option[key] = value;
    if(save) {
      saveOption(key);
    }
  }

  function startTask() {
    isStart = true;
    debugOutput("开始抢座");
    executeTask();
  }

  function executeTask() {
    if (isInOrderTime() || isInDayTime()) {
      timer = setTimeout(function () {
        submitAppointment(getDate(), option.seat, option.startTime, option.endTime, option.token);
      }, 3000);
      debugOutput("抢座尝试第" + requestCount++ + "次");
      if (requestCount >= 500) {
        stopTask();
      }
    } else {
      timer = setTimeout(executeTask, 10000);
      debugOutput("抢座等待第" + waitCount++ + "次");
    }
  }

  function stopTask() {
    isStart = false;
    clearTimeout(timer);
    waitCount = 0;
    requestCount = 0;
    debugOutput("停止抢座");
  }

  function submitAppointment(date, seat, startTime, endTime, token) {
    jQuery.ajax({
      type: 'POST',
      data: 'date=' + date + '&seat=' + seat + '&startTime=' + startTime + '&endTime=' + endTime + '&token=' + token, // 验证码暂时没有用，不知道什么时候会出现
      url: baseUrl + '/rest/v2/freeBook',
      success: function (data) {
        var status = data.status == 'success' ? true : false;
        var errorCode = parseInt(data.code);
        var errorMsg = data.message;
        finishAppointment(status, errorCode, errorMsg);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus);
        executeTask();
      }
    });
  }

  function finishAppointment(status, errorCode = -1, errorMsg) {
    if (status) {
      alert("抢座成功");
      window.location.href = "http://seat.lib.whu.edu.cn/history?type=SEAT";
    } else {
      if (errorCode == 12) {
        debugOutput("登录token错误，请重新点击登录按钮获取token");
        alert("登录token错误，请重新点击登录按钮获取token");
      } else if (errorCode == -1) {
        debugOutput("未获取到errorCode");
        alert("未知错误");
      } else {
        debugOutput(errorMsg);
        executeTask();
      }
    }
  }

  function submitLogin(username, password) {
    return new Promise((resolve, reject) => {
      jQuery.ajax({
        type: 'POST',
        data: 'username=' + username + '&password=' + password,
        url: baseUrl + '/rest/auth',
        success: function (data) {
          if(data.status == 'success') {
            resolve(data.data.token);
          }else{
            reject(data.message);
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          alert("服务器连接失败");
        }
      });
    });
  }

  function startButtonClick() {
    if (!isStart) {
      var date = $("#aaadate").val();
      var start = $("#aaastarttime").val();
      var end = $("#aaaendtime").val();
      var seat = $("#aaaseatnum").val();
      var token = $("#aaatoken").val();
      if(!token){
        alert("请先登录");
        return;
      }
      if (!date || !start || !end || !seat) {
        alert("请输入上面四个值");
        return;
      }
      setOption("seat", seat, true);
      setOption("startTime", start);
      setOption("endTime", end);
      setOption("token", token);
      startTask();
      $("#aaasubmit").addClass("starting");
      $("#aaasubmit").text("停止抢座");
    } else {
      stopTask();
      $("#aaasubmit").removeClass("starting");
      $("#aaasubmit").text("开始抢座");
    }
  }

  function loginButtonClick() {
    if (!isStart) {
      var username = $("#aaausername").val();
      var password = $("#aaapassword").val();
      if (!username || !password) {
        alert("请输入用户名和密码");
        return;
      }
      submitLogin(username, password)
        .then((token)=>{
          debugOutput("登录成功");
          debugOutput("token:" + token);
          $("#aaatoken").val(token);
        })
        .catch((errorMsg)=>{
          alert(errorMsg);
        });
    }
  }

  function debugOutput(str) {
    console.log(str);
  }

  function appendPopup() {
    $("body").append(`<style>
  .warp:after{
    clear: both;
    display: block;
    content: "";
  }
  #appointment{
    position: static;
    clear: both;
    background-color: white;
    width: 800px;
    height: auto;
    margin: 20px auto;
    border: 1px solid #aaa;
    padding: 20px;
    box-sizing: border-box;
    text-align: center;
  }
  #appointment .hint{
    color: #999;
    font-size: 12px;
    line-height: 25px;
  }
  .input-area{
    width: 100%;
    height: 40px;
    font-size: 16px;
    line-height: 40px;
  }
  .input-area .input-label{
    display: inline-block;
    width: 80px;
    text-align: right;
  }
  .input-area input{
    outline: none;
    padding: 2px 4px;
  }
  .input-area input:focus{
    border-color: dodgerblue;
  }
  .aaabutton{
    width: 150px;
    height: 50px;
    line-height: 50px;
    margin: 15px auto 5px;
    cursor: pointer;
    font-size: 20px;
    color: white;
    background-color: lightskyblue;
    transition: all 0.3s ease;
  }
  .aaabutton:hover{
    background-color: lightblue;
  }
  .aaabutton:active{
    background-color: cornflowerblue;
  }
  .aaabutton.starting{
    background-color: orange;
  }
  </style>`);
    $("body").append(`<div id="appointment">
    <div class="hint">抢座机制：每天10点以前，抢今天的座位（每3秒请求一次，开启后尝试次数上限100次）。10点以后抢第二天的座位，10点25以前不发送抢座请求，只进行计时（每10秒检测一次），25以后每3秒请求一次，直到抢到座位或时间超过11点半或尝试次数超过500次</div>
    <div class="input-area">
      <span class="input-label">用户名</span>
      <input type="text" name="aaausername" id="aaausername" value="">
    </div>
    <div class="input-area">
      <span class="input-label">密码</span>
      <input type="password" name="aaapassword" id="aaapassword" value="">
    </div>
    <div id="aaalogin" class="aaabutton">登录</div>
    <div class="hint">由于网页端选座需要填写验证码，所以目前使用了app的接口，需要每次抢座前登录获取token，并且在抢座期间不能登录app，以防token失效</div>
    <div class="input-area">
      <span class="input-label">Token</span>
      <input type="text" name="aaatoken" id="aaatoken" value="" disabled="disabled">
    </div>
    <div class="input-area">
      <span class="input-label">日期</span>
      <input type="text" name="aaadate" id="aaadate" value="" disabled="disabled">
    </div>
    <div class="hint">时间为从0点开始的分钟数，常用时间：8点480,12点720,17点1020,22点1320</div>
    <div class="input-area">
      <span class="input-label">开始时间</span>
      <input type="number" name="aaastarttime" id="aaastarttime" value="480">
    </div>
    <div class="input-area">
      <span class="input-label">结束时间</span>
      <input type="number" name="aaaendtime" id="aaaendtime" value="1320">
    </div>
    <div class="hint">座位号为具体的座位编号，需要检查元素里看（四位数）</div>
    <div class="input-area">
      <span class="input-label">座位号</span>
      <input type="number" name="aaaseatnum" id="aaaseatnum" value="">
    </div>
    <div id="aaasubmit" class="aaabutton">开始抢座</div>
  </div>`);
    $("#aaadate").val(getDate());
    $("#aaaseatnum").val(loadOption("seat"));
    $("#aaalogin").click(loginButtonClick);
    $("#aaasubmit").click(startButtonClick);
  }
  appendPopup();
})();