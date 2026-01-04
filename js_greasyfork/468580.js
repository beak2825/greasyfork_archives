// ==UserScript==
// @name         某麦抢票
// @namespace    ticket
// @version      0.0.3
// @description  某麦抢票手机版
// @author       Mr.陈
// @match        https://m.damai.cn/*
// @match        https://mclient.alipay.com/*
// @match        <https://mtop.damai.cn/h5/mtop.alibaba.detail.subpage.getdetail/*>
// @grant        GM_xmlhttpRequest
// @connect      api.m.taobao.com
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @license      4836
// @downloadURL https://update.greasyfork.org/scripts/468580/%E6%9F%90%E9%BA%A6%E6%8A%A2%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/468580/%E6%9F%90%E9%BA%A6%E6%8A%A2%E7%A5%A8.meta.js
// ==/UserScript==

var version = "0.0.3";

var $style = $(
  "<style>" +
  "#control_container{margin: 20px 0;background:#e9e9e9;padding:20px;overflow: hidden;}" +
  "p{margin:10px 0;}" +
  "#control_container button{width:80%;height: 60px;line-height:60px;margin:10px 10%;font-size:30px;border-radius:30px}" +
  "#start_btn{color:#fff;background:#ff457a;}" +
  "#end_btn{color:#666;background: #cfcfcf;}" +
  ".control_container_box{display: flex;align-items: center;flex-wrap: wrap;padding-right: 20px;border: 1px solid #ccc;}" +
  ".input_wrapper{display: flex;justify-content:center;font-size: 16px; margin-bottom:10px;}" +
  ".input_wrapper_box{flex: 4;}" +
  ".input_wrapper_phone{display: flex;justify-content: flex-end;font-size: 25px;padding:20px 0; text-align:center;}" +
  ".input_wrapper_phone input{width: 50%;}" +
  ".notice{margin:10px 10px;padding:10px 10px;color:darkslategrey;}" +
  "#wx{text-align: center; flex:1;color: #333;}" +
  "#countdown_wrapper {display:none; font-size: 30px; text-align:center; background:#ffeaf1;}" +
  "#countdown_wrapper p{width:100%;}" +
  "#countdown {font-size: 50px; color:#ff1268;}" +
  ".warning {color:red; font-weight:400;}" +
  "h3 {font-weight:800;}" +
  "</style>"
);

$(document).ready(function () {
  var curr_url = window.location.href;

  if (curr_url.includes("https://m.damai.cn/damai/")) {
    let clickStart = sessionStorage.getItem("clickStart");
    var phone_order_url = sessionStorage.getItem("phone_order_url");
    if (phone_order_url && clickStart) {
      let endTime = sessionStorage.getItem("endTime");
      let currentTime = new Date().getTime()

      if (endTime && currentTime > Number(endTime)){
          alert("抢购已自动结束，请返回查看有无订单");
          sessionStorage.clear();
      }

      if (currentTime >= window.sellStartTime_timestamp) {
        window.location.href = phone_order_url;
        return
      }
    }
    fetchGet();
    phone_detail_ui();
  }

  if (curr_url.includes("https://m.damai.cn/app/dmfe/")) {
    let clickStart = sessionStorage.getItem("clickStart");
    if (clickStart == null || clickStart == "false"){
        return
    }


    let currentTime = new Date().getTime()
    if (currentTime -1500 < window.sellStartTime_timestamp){
        return
    }


    let endTime = sessionStorage.getItem("endTime");
    if (currentTime > Number(endTime)){
      alert("抢购已自动结束，请返回查看有无订单");
      sessionStorage.clear();
      return;
    }

    setTimeout(fill_phone_form, 100);
    var viewer = $(".viewer >div >div");
    if (viewer != null && viewer.length != 0) {
      if ($("#app >div >div").innerHTML.indexOf("系统繁忙") != -1) {
        var phone_or_url;
        var num = Math.random()
        if (num == 1){
          phone_or_url = sessionStorage.getItem("phone_order_url");
        }else{
          phone_or_url = sessionStorage.getItem("phone_order_url_2");
        }
        if (phone_or_url){
          window.location.href = phone_or_url;
        }
      }
    }
  }
  //支付页面
  if (
    curr_url.includes("https://excashier.alipay.com/") ||
    curr_url.includes("https://mclient.alipay.com")
  ) {
    alert("恭喜下单成功，可前往APP查看，有5分钟付款时间");
    sessionStorage.clear();
  }
});

function fetchGet() {
  var open = XMLHttpRequest.prototype.open;
  var send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function () {
    var url = arguments[1];
    var method = arguments[0];
    if (
      method.toUpperCase() === "GET" &&
      url.indexOf("mtop.damai.cn/h5/mtop.alibaba.detail.subpage.getdetail") !=
      -1
    ) {
      this._url = url; //保存请求的 URL
      // console.log("获取到了GET request");
    }
    open.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    this.addEventListener("readystatechange", function () {
      if (
        this.readyState === 4 &&
        this.status === 200 &&
        this._url &&
        this._url.indexOf(
          "mtop.damai.cn/h5/mtop.alibaba.detail.subpage.getdetail"
        ) != -1
      ) {
        var responseText = JSON.parse(this.responseText);
        var result = JSON.parse(responseText.data.result);
        var skuList = result.perform.skuList;
        // 解析响应内容，获取相关信息
        // console.log("获取到可选择的场次详情:", skuList);
        const skuIds = [];
        const itemIds = [];
        const priceNames = [];
        for (var k = 0; k < skuList.length; k++) {
          skuIds.push(skuList[k].skuId);
          itemIds.push(skuList[k].itemId);
          priceNames.push(skuList[k].priceName);
        }
        sessionStorage.setItem("skuIds", skuIds);
        sessionStorage.setItem("itemIds", itemIds);

        let priceNameStr = "";
        for (let i = 0; i < priceNames.length; i++) {
          priceNameStr += i + " : " + priceNames[i] + "\n";
        }
        alert(
          "请按票价前对应的序号输入: \n" +
          "当前选择场次：" +
          result.perform.performName +
          "\n" +
          priceNameStr
        );
      }
    });
    send.apply(this, arguments);
  };
}


//https://stackoverflow.com/a/31112615
Number.prototype.toHHMMSS = function () {
  var hours =
    Math.floor(this / 3600) < 10
      ? ("00" + Math.floor(this / 3600)).slice(-2)
      : Math.floor(this / 3600);
  var minutes = ("00" + Math.floor((this % 3600) / 60)).slice(-2);
  var seconds = ("00" + ((this % 3600) % 60)).slice(-2);
  return hours + ":" + minutes + ":" + seconds;
};

function phone_detail_ui() {
  var $service = $("#detail");
  if ($service == null || $service.length == 0) {
    $service = $(".auto-banner");
  }
  if ($service == null || $service.length == 0) {
    setTimeout(phone_detail_ui, 200);
    return;
  }

  var $control_container = $("<div id='control_container'></div>");
  var $wx = $(
    `<div id="wx" class="notice"><p>某麦抢票</p><p>版本号：${version}</p><p>author：Mr.陈</p></div>`
  );
  var $eventId = $(
    '<div class="input_wrapper_phone" id="event_input_wrapper">请输入票价前的序号：<input id="event_input" type="text" value="0" ></div>'
  );
  var $number_input = $(
    '<div class="input_wrapper_phone" id="number_input_wrapper">请输入人数：<input id="number_input" type="number" value="2" min="1" max="4"></div>'
  );
  var $delayTime = $(
    '<div class="input_wrapper_phone" id="delayTime_input_wrapper">无优先购需延后(分)：<input id="delayTime_input" type="text" value="0"></div>'
  );
  var $semiAutomatic = $(
    `
    <div class="input_wrapper_phone">半自动模式（手动提交订单)：
           <input style="width:22%;appearance: auto;" type="radio" name="semiAutomatic" value="0" checked>开
           <input style="width:22%;appearance: auto;" type="radio" name="semiAutomatic" value="1">关
    </div>'
    `
  )
  var $snapUpDuration = $(
    `
    <div class="input_wrapper_phone">持续抢购时间(分)：
        <input id="snapUpDuration" type="number" value="15" min="1" max="4">
    </div>'
    `
  )

  var $start_btn = $('<button id="start_btn">开始抢票</button>');
  var $end_btn = $('<button id="end_btn">停止抢票</button>');
  var $notice = $(
    `<div id="notice" class="notice"><h3>使用步骤</h3><p>1.提前登录-填写好观影人跟收货地址，建议抢几张填几个</p>
    <p>2.请先点击右下角[即将开抢 预选场次]或[立即预定] 按钮，多个日期和场次可点击自己想看的日期和场次，记住弹窗中自己想看的票价前的序号，之后关闭弹窗输入票价前的序号</p>
    <p>3.如果演出支持优先购，但你没有优先购特权，第三个输入框延后倒计时须填写优先购开抢到正点开抢的时间间隔，单位为分</p>
    <p>>>>> 比如：优先购开始时间为14:30<br />>>>> 正点开抢时间为15:00<br />>>>> 第三项就填“30”</p>
    <p>4.推荐开启半自动模式，自动到达提交订单页面后改为手动提交，可以躲避官方人机检测</p>
    <p>5.如果使用全自动模式，则需要设定持续抢购时间，每 0.1 秒点击一次</p>
    <p>6.点击“开始抢票”倒计时后会自动抢票</p></div>`
  );

  var $notice2 = $('<div id="notice2" class="notice"><p>注：倒计时开抢前差几秒无影响，开抢前10秒才会快速同步；默认自动勾选2个观演人（页面可修改）；自动提交</p></div>');

  var $countdown = $(
    '<div id="countdown_wrapper"><p id="selected_event">场次</p><p id="selected_price">自动勾选人数</p><p id="selected_number">2人</p><br><p>倒计时:</p><p id="countdown">00:00:00</p></div>'
  );
  var $input_wrapper_box = $('<div class="input_wrapper_box"></div>');
  var $control_container_box = $('<div class="control_container_box"></div>');
  $control_container.append($style);
  $control_container_box.append($wx);
  $input_wrapper_box.append($eventId);
  $input_wrapper_box.append($number_input);
  $input_wrapper_box.append($delayTime);
  $input_wrapper_box.append($semiAutomatic);
  $input_wrapper_box.append($snapUpDuration);
  $control_container_box.append($input_wrapper_box);
  $control_container_box.append($start_btn);
  $control_container_box.append($end_btn);
  $control_container.append($control_container_box);
  $control_container.append($notice);
  $control_container.append($notice2);

  $control_container.insertBefore($service);
  $countdown.insertBefore($control_container);

  let start;
  $("#start_btn").click(function () {
    var eventJson = $("#event_input").val();
    if (eventJson == "" || eventJson == null) {
      alert("请先输入票价对应的序号");
      return;
    }

    // 半自动
    var semiAutomatic = $("input[name='semiAutomatic']:checked").val();

    // 持续抢购时间
    var snapUpDuration = $("#snapUpDuration").val();

    var skuIds = sessionStorage.getItem("skuIds");
    var itemIds = sessionStorage.getItem("itemIds");
    if (
      skuIds == null ||
      itemIds == null ||
      skuIds.length == 0 ||
      itemIds.length == 0
    ) {
      alert(
        "请先点击右下角[即将开抢 预选场次]或[立即购买] 按钮获取票档，再按提示输入票价前的序号"
      );
      return;
    }
    skuIds = skuIds.split(",");
    itemIds = itemIds.split(",");
    if (skuIds.length <= Number(eventJson)) {
      alert("序号错误，无该序号对应场次");
      return;
    }
    var price = skuIds[eventJson];
    var eventid = itemIds[eventJson];
    //获取场次id+价格id
    // console.log("item_id:" + eventid);
    // console.log("price_id:" + price);

    var people_num = $("#number_input").val();
    var result = phone_confirm_url(eventid, price, people_num);
    var result_2 = phone_confirm_url2(eventid, price, people_num);
    window.phone_order_url = result;
    window.phone_people_num = people_num;
    sessionStorage.setItem("phone_order_url", result);
    sessionStorage.setItem("phone_order_url_2", result_2);
    sessionStorage.setItem("phone_people_num", people_num);
    sessionStorage.setItem("semi_automatic", semiAutomatic);
    sessionStorage.setItem("snap_up_duration", snapUpDuration);

    //已经开抢了，立即购买
    var cdate = $(".count-down-date");
    var sellStartTime = "";
    if (cdate == null || cdate.length == 0) {
      sellStartTime = new Date().getTime(); //开始时间时间戳
    } else {
      cdate = cdate.innerText == null ? cdate[0].innerText : cdate.innerText;
      var startTime =
        cdate.replace("月", "-").replace("日", "").replace("开抢", "") + ":00";
      startTime = new Date().getFullYear() + "-" + startTime;
      if (navigator.userAgent.indexOf("Safari") != -1) {
        startTime = startTime.replace(/-/g, "/");
      }
      sellStartTime =
        new Date(startTime).getTime() +
        Number($("#delayTime_input").val()) * 60000; //开始时间时间戳
    }
    window.sellStartTime_timestamp = sellStartTime;

    sessionStorage.setItem("endTime", sellStartTime + snapUpDuration * 60 * 1000);

    let current_time = { t: new Date().getTime() };
    window.current_time_proxy = new Proxy(current_time, {
      set: function (target, key, value) {//设置对象属性会被调用
        console.log(`${key} set to ${value}`);
        target[key] = value;
        var time_difference = Math.ceil(
          (window.sellStartTime_timestamp - value) / 1000
        );
        console.log("相差秒数：" + time_difference);
        // 提前1秒开始
        if (window.sellStartTime_timestamp - value < 2000) {
          window.location.href = window.phone_order_url;
          clearInterval(start)
        } else {
          var time_difference_str = time_difference.toHHMMSS();
          $("#countdown").text(time_difference_str);
        }
        return true;
      }
    });



    $("#selected_event").text(timestampToTime(sellStartTime));
    // $("#selected_price").text(price);
    $("#selected_number").text(people_num + "人");

    $("#countdown_wrapper").show();

    sessionStorage.setItem("clickStart","true");

    start = setInterval(function () {
      //let t = window.current_time_proxy.t + 1000
      //window.current_time_proxy.t = t
      timedUpdate_phone()
    }, 1000)
  });

  $("#end_btn").click(function () {
    $("#countdown_wrapper").hide();
    sessionStorage.clear();
    clearInterval(start)
  });
}

function timedUpdate_phone() {
  var time_difference = Math.ceil(
    (window.sellStartTime_timestamp - window.current_time_proxy.t) / 1000
  );

  if (time_difference < 0) {
    return
  }

  var interval = 2000
  if (time_difference < 10) {
    interval = 100
  }

  setTimeout(() => {
    syncTime_phone()
  }, interval)
}

function syncTime_phone() {
  GM_xmlhttpRequest({
    url: "https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp",
    method: "GET",
    timeout: 10000,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    onload: function (responseDetails) {
      if (responseDetails.status == 200) {
        var result = JSON.parse(
          responseDetails.responseText.replace("fff(", "").replace(")", "")
        );

        window.current_time_proxy.t = result.data.t;
      }
    },
  });
}

function timestampToTime(timestamp) {
  // 时间戳为10位需*1000，时间戳为13位不需乘1000
  var date = new Date(timestamp);
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h = date.getHours() + ":";
  var m = date.getMinutes() + ":";
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}

function phone_confirm_url(event, price_id, people_num) {
  return `https://m.damai.cn/app/dmfe/h5-ultron-buy/index.html?buyParam=${event}_${people_num}_${price_id}&buyNow=true&exParams=%257B%2522channel%2522%253A%2522damai_app%2522%252C%2522damai%2522%253A%25221%2522%252C%2522umpChannel%2522%253A%2522100031004%2522%252C%2522subChannel%2522%253A%2522damai%2540damaih5_h5%2522%252C%2522atomSplit%2522%253A1%257D&spm=a2o71.project.0.bottom&sqm=dianying.h5.unknown.value`;
}

function phone_confirm_url2(event, price_id, people_num) {
  return `https://m.damai.cn/app/dmfe/h5-ultron-buy/index.html?exParams=%7B%22damai%22%3A%221%22%2C%22channel%22%3A%22damai_app%22%2C%22umpChannel%22%3A%2210002%22%2C%22atomSplit%22%3A%221%22%2C%22serviceVersion%22%3A%221.8.5%22%7D&buyParam=${event}_${people_num}_${price_id}&buyNow=true&privilegeActId=`;
}


function fill_phone_form() {
  var buyer_number = sessionStorage.getItem("phone_people_num");
  if (buyer_number == null) {
    buyer_number = 2;
  }
  console.log("勾选下单人数：" + buyer_number);
  var viewer = $(".viewer >div >div");
  if (viewer == null || viewer.length == 0) {
    check_phone_alert();
    setTimeout(fill_phone_form, 100);
    return;
  }
  for (var i = 0; i < buyer_number; i++) {
    viewer[i].click();
  }

  // 半自动
  var semiAutomatic = sessionStorage.getItem("semi_automatic");
  if (semiAutomatic == 0){
    return
  }

  setTimeout(submit_phone_order, 100);
}

function submit_phone_order() {
  console.log("提交订单中...");
  $("div[view-name='MColorFrameLayout']").attr("id", "myOrderSubmit");
  if ($("#myOrderSubmit")[0] == null) {
    setTimeout(submit_phone_order, 200);
    return;
  }
  var submitBtn = $("#myOrderSubmit")[0].nextSibling;
  var myEvent = new Event("dx_tap");
  submitBtn.dispatchEvent(myEvent);
  setTimeout(check_phone_alert, 200);
}

function check_phone_alert() {
  var checkblack = $(".baxia-dialog-content");
  if (checkblack != null && checkblack.length > 0) {
    var phone_or_url;
    var num = Math.random()
    if (num == 1){
      phone_or_url = sessionStorage.getItem("phone_order_url");
    }else{
      phone_or_url = sessionStorage.getItem("phone_order_url_2");
    }
    if (phone_or_url){
      window.location.href = phone_or_url;
    }
    return
  }

  var mian = $("#app >div >div");
  if (mian != null) {
    if ((mian.innerHTML != null)) {
      if (mian.innerHTML.indexOf("系统繁忙") != -1) {
        window.location.reload();
      } else {
        window.current_time = window.current_time + 300;
        setTimeout(submit_phone_order, 300);
      }
    } else if (mian.length != 0) {
      setTimeout(submit_phone_order, 300);
    }
  }
}