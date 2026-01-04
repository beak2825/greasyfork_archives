// ==UserScript==
// @name         斗鱼自动回复,可重复回复(刷屏)
// @namespace    http://tampermonkey.net/
// @version      1.3.7
// @description  斗鱼自动回复,自定义时间,次数,回复内容!
// @author       Pi7bo1
// @match        https://www.douyu.com/*
// @match        https://www.douyu.com/*/*
// @grant        none
// @supportURL   woxianshouboxian@163.com
// @downloadURL https://update.greasyfork.org/scripts/373412/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%2C%E5%8F%AF%E9%87%8D%E5%A4%8D%E5%9B%9E%E5%A4%8D%28%E5%88%B7%E5%B1%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/373412/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%2C%E5%8F%AF%E9%87%8D%E5%A4%8D%E5%9B%9E%E5%A4%8D%28%E5%88%B7%E5%B1%8F%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...

  // 定义初始变量
  var dySendMsg = function (text, maxCount, stime) {
    this.dySendTextArr = [
      "黄初三年",
      "余朝京师",
      "还济洛川",
      "古人有言",
      "斯水之神",
      "名曰宓妃",
      "感宋玉对楚王神女之事",
      "遂作斯赋",
      "其辞曰：余从京域",
      "言归东藩",
      "背伊阙",
      "越轘辕",
      "经通谷",
      "陵景山",
      "日既西倾",
      "车殆马烦",
      "尔乃税驾乎蘅皋",
      "秣驷乎芝田",
      "容与乎阳林",
      "流眄乎洛川",
      "于是精移神骇",
      "忽焉思散",
      "俯则未察",
      "仰以殊观",
      "睹一丽人",
      "于岩之畔",
      "乃援御者而告之曰：“尔有觌于彼者乎？彼何人斯？若此之艳也！”御者对曰：“臣闻河洛之神",
      "名曰宓妃",
      "然则君王所见",
      "无乃是乎？其状若何？臣愿闻之",
      "余告之曰：“其形也",
      "翩若惊鸿",
      "婉若游龙",
      "荣曜秋菊",
      "华茂春松",
      "髣髴兮若轻云之蔽月",
      "飘飖兮若流风之回雪",
      "远而望之",
      "皎若太阳升朝霞；迫而察之",
      "灼若芙蕖出渌波",
      "秾纤得衷",
      "修短合度",
      "肩若削成",
      "腰如约素",
      "延颈秀项",
      "皓质呈露",
      "芳泽无加",
      "铅华弗御",
      "云髻峨峨",
      "修眉联娟",
      "丹唇外朗",
      "皓齿内鲜",
      "明眸善睐",
      "靥辅承权",
      "瑰姿艳逸",
      "仪静体闲",
      "柔情绰态",
      "媚于语言",
      "奇服旷世",
      "骨像应图",
      "披罗衣之璀粲兮",
      "珥瑶碧之华琚",
      "戴金翠之首饰",
      "缀明珠以耀躯",
      "践远游之文履",
      "曳雾绡之轻裾",
      "微幽兰之芳蔼兮",
      "步踟蹰于山隅",
      "于是忽焉纵体",
      "以遨以嬉",
      "左倚采旄",
      "右荫桂旗",
      "壤皓腕于神浒兮",
      "采湍濑之玄芝",
      "余情悦其淑美兮",
      "心振荡而不怡",
      "无良媒以接欢兮",
      "托微波而通辞",
      "愿诚素之先达兮",
      "解玉佩以要之",
      "嗟佳人之信修",
      "羌习礼而明诗",
      "抗琼珶以和予兮",
      "指潜渊而为期",
      "执眷眷之款实兮",
      "惧斯灵之我欺",
      "感交甫之弃言兮",
      "怅犹豫而狐疑",
      "收和颜而静志兮",
      "申礼防以自持",
      "于是洛灵感焉",
      "徙倚彷徨",
      "神光离合",
      "乍阴乍阳",
      "竦轻躯以鹤立",
      "若将飞而未翔",
      "践椒涂之郁烈",
      "步蘅薄而流芳",
      "超长吟以永慕兮",
      "声哀厉而弥长",
      "尔乃众灵杂沓",
      "命俦啸侣",
      "或戏清流",
      "或翔神渚",
      "或采明珠",
      "或拾翠羽",
      "从南湘之二妃",
      "携汉滨之游女",
      "叹匏瓜之无匹兮",
      "咏牵牛之独处",
      "扬轻袿之猗靡兮",
      "翳修袖以延伫",
      "体迅飞凫",
      "飘忽若神",
      "凌波微步",
      "罗袜生尘",
      "动无常则",
      "若危若安",
      "进止难期",
      "若往若还",
      "转眄流精",
      "光润玉颜",
      "含辞未吐",
      "气若幽兰",
      "华容婀娜",
      "令我忘餐",
      "于是屏翳收风",
      "川后静波",
      "冯夷鸣鼓",
      "女娲清歌",
      "腾文鱼以警乘",
      "鸣玉鸾以偕逝",
      "六龙俨其齐首",
      "载云车之容裔",
      "鲸鲵踊而夹毂",
      "水禽翔而为卫",
      "于是越北沚",
      "过南冈",
      "纡素领",
      "回清阳",
      "动朱唇以徐言",
      "陈交接之大纲",
      "恨人神之道殊兮",
      "怨盛年之莫当",
      "抗罗袂以掩涕兮",
      "泪流襟之浪浪",
      "悼良会之永绝兮",
      "哀一逝而异乡",
      "无微情以效爱兮",
      "献江南之明珰",
      "虽潜处于太阴",
      "长寄心于君王",
      "忽不悟其所舍",
      "怅神宵而蔽光",
      "于是背下陵高",
      "足往神留",
      "遗情想像",
      "顾望怀愁",
      "冀灵体之复形",
      "御轻舟而上溯",
      "浮长川而忘返",
      "思绵绵而增慕",
      "夜耿耿而不寐",
      "沾繁霜而至曙",
      "命仆夫而就驾",
      "吾将归乎东路",
      "揽騑辔以抗策",
      "怅盘桓而不能去",
    ]; // 默认为空时候喊话内容
    this.lastMsg = ""; // 上次喊话内容
    this.count = 0; // 当前喊话次数
    this.stext = localStorage.getItem("dyFunctionSend_textArr");
    this.stime = localStorage.getItem("dyFunctionSend_time") || 30; // 间隔时间 单位/秒
    this.auto = ""; //自动变量,用来定义/清除定时器
    this.maxCount = localStorage.getItem("dyFunctionSend_count") || 10; //最大喊话次数
    this.status = "stop"; //当前状态
  };

  //初始化发送模板
  dySendMsg.prototype.init = function () {
    var othis = this;

    var jsSendMsg = document.getElementById("js-chat-speak");

    //添加自定义定义样式
    var _styleElement = document.createElement("style");
    var _css =
      ".dyFunctionSend{background: #fff;width:100%;box-sizing: border-box;position:absolute;padding:5px 6px;z-index: 999;border: 1px solid #d2d2d2;bottom: 90px;left: 0;}";
    _css +=
      ".dyFunctionSend .form-control{box-sizing: border-box;background-color: #FFFFFF;resize:vertical;background-image: none;border: 1px solid #e5e6e7;border-radius: 1px;color: inherit;display: block;padding: 6px 12px;transition: border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s;width: 100%;}";
    _css += ".dyFunctionSend .form_item{margin:5px 0;font-size:14px}";
    _css += ".dyFunctionSend .form-control:focus{border-color: #1ab394;}";
    _css += ".dyFunctionSend_hide {display: none;}";
    _css +=
      ".dySend_btn {margin:5px;display: inline-block;height: 33px;line-height: 33px;padding: 0 18px;background-color: #009688;color: #fff;white-space: nowrap;text-align: center;font-size: 14px;border: none;border-radius: 2px;cursor: pointer;}";
    _css += ".dySend_btn:hover {opacity: 0.8}";
    _css += ".dySend_btn:active {opacity: 1}";
    _css +=
      ".dyFunctionSend .w50 {width:50%;display: inline-block;display: inline-block;box-sizing: border-box;}";
    _css +=
      ".dySend_start_btn,.dySend_stop_btn{background-color: #1E9FFF;display:none}";
    _css +=
      ".dySend_start_btn.show_d,.dySend_stop_btn.show_d{display:inline-block}";
    _css +=
      ".ChatSendMsgBtn {display: inline-block;vertical-align: middle;width: 22px;height: 22px;margin-right: 8px;cursor: pointer;}";
    _css +=
      ".ChatSendMsgBtn .laba{background:url('https://pic.superbed.cn/item/5cc178563a213b0417e51cc7') no-repeat;background-position: 2px 2px;}";
    _css += ".ChatSendMsgBtn.active .laba{background-position-x: -18px;}";
    _css += ".dySend_count {position:absolute;bottom: 8px;left: 15px;}";

    _styleElement.innerHTML = _css;
    document.getElementsByTagName("head")[0].appendChild(_styleElement);

    var fill_text = this.switchJsonToHtml(
      JSON.parse(localStorage.getItem("dyFunctionSend_textArr"))
    );

    //添加点击的弹框模板
    var dyFunctionSend = document.createElement("div");
    var _html = "";
    _html +=
      '<div class="form_item"><div class="col-100-w"><label>文本内容:</label></div>';
    _html +=
      '<div class="col-100-w"><textarea class="form-control"  placeholder="支持多条文本导入,文本之间使用回车隔开" name="" id="dyFunctionSend_text" rows="3">' +
      fill_text +
      "</textarea></div></div>";
    _html +=
      '<div class="form_item w50"><div class="col-100-w"><label>喊话次数:</label></div>';
    _html +=
      '<div class="col-100-w"><input class="form-control" placeholder="默认喊话喊话次数为 10" value="' +
      (localStorage.getItem("dyFunctionSend_count") || this.maxCount) +
      '" oninput="javascript:$dy.InputTextFilter.bind(this)()" type="text" name="" id="dyFunctionSend_count"></div></div>';
    _html +=
      '<div class="form_item w50"><div class="col-100-w"><label>喊话时间间隔:</label></div>';
    _html +=
      '<div class="col-100-w"><input class="form-control" placeholder="默认喊话时间间隔为 30" value="' +
      (localStorage.getItem("dyFunctionSend_time") || this.stime) +
      '" oninput="javascript:$dy.InputTextFilter.bind(this)()"  type="text" name="" id="dyFunctionSend_time"></div></div>';
    _html +=
      '<div class="col-100-w"><span style="color:#FF5722;padding-left: 5px" id="dyFunctionSend_error">设置需要保存才能生效</span></div>';
    _html +=
      '<div class="col-100-w" style="text-align: center;"><span onclick="javascript:$dy.save()" class="dySend_save_btn dySend_btn">保存</span><span onclick="javascript:$dy.start()" class="dySend_start_btn show_d dySend_btn">开始</span><span onclick="javascript:$dy.stop()" class="dySend_stop_btn dySend_btn">停止</span></div>';
    _html +=
      '<div style="top:-4px" onclick="javascript:$dy.changeDySendPanel()" class="PrivateLetter-close"><i></i></div>';
    _html +=
      '<div class="dySend_count"><p style="color:#009688" id="dySend_Num">已发送：0</p><p style="color:#01AAED" id="dySend_remainder">剩余次数：0</p></div>';

    dyFunctionSend.classList.add("dyFunctionSend", "dyFunctionSend_hide");
    dyFunctionSend.innerHTML = _html;
    dyFunctionSend.id = "dyFunctionSend";

    var chatMsgBox =
      document.querySelectorAll(".layout-Player-aside")[0] ||
      document.querySelectorAll("#js-live-room-normal-right .chat")[0];

    let loading_status = 0;

    // 斗鱼按钮栏插入按钮
    var timer = setInterval(function () {
      try {
        // 斗鱼ChatToolBar加载完成会覆盖掉添加的按钮   添加检查状态loading_status 如果被覆盖则重新添加按钮
        if (loading_status == 7) {
          return clearInterval(timer);
        }

        // 判断按钮是否已添加 定时器会再次判断是否已覆盖
        if (document.querySelector(".ChatSendMsgBtn")) {
          console.log(loading_status);
          return (loading_status += 1);
        } else {
          loading_status = 0;
        }

        var sendMsgBtn = document.createElement("div");
        sendMsgBtn.onclick = othis.changeDySendPanel;
        sendMsgBtn.classList.add("ChatSendMsgBtn");

        if (document.getElementById("js-chat-speak")) {
          sendMsgBtn.style.marginLeft = "5px";
          sendMsgBtn.innerHTML = `<div title="喊话设置" style="height:100%;margin-top:5px;" class="Horn4Category-btn laba"></div>`;
        } else {
          sendMsgBtn.innerHTML = `<div title="喊话设置" style="height:100%" class="Horn4Category-btn laba"></div>`;
        }

        var btnBox =
          document.querySelectorAll(".ChatToolBar")[0] ||
          document
            .getElementById("js-chat-speak")
            .querySelectorAll(".speak-up")[0];

        btnBox.appendChild(sendMsgBtn);
        chatMsgBox.appendChild(dyFunctionSend);
      } catch (err) {}
    }, 300);

    // if (document.querySelector(".ChatSendMsgBtn")) {

    // }
  };

  //localStorage 存储的文本转换填充
  dySendMsg.prototype.switchJsonToHtml = function (arr) {
    if (arr == null) {
      return "";
    }
    if (arr.length > 0) {
      return arr.join("\n");
    } else {
      return "";
    }
  };

  //输入框非数字过滤
  dySendMsg.prototype.InputTextFilter = function (d) {
    this.value = this.value.replace(/[^0-9]/g, "");
  };

  //开关面板
  dySendMsg.prototype.changeDySendPanel = function () {
    document
      .getElementById("dyFunctionSend")
      .classList.toggle("dyFunctionSend_hide");
    document.querySelectorAll(".ChatSendMsgBtn")[0].classList.toggle("active");
  };

  // 设置发送次数统计  已发送/未完成
  dySendMsg.prototype.setSendCount = function (sendCount, unfinishedCount) {
    document.getElementById("dySend_Num").innerText = "已发送：" + sendCount;
    document.getElementById("dySend_remainder").innerText =
      "剩余次数：" + unfinishedCount;
  };

  // 设置发送次数统计  已发送/未完成
  dySendMsg.prototype.setSendCount = function (sendCount, unfinishedCount) {
    document.getElementById("dySend_Num").innerText = "已发送：" + sendCount;
    document.getElementById("dySend_remainder").innerText =
      "剩余次数：" + unfinishedCount;
  };

  // 保存当前设置
  dySendMsg.prototype.save = function () {
    if (this.status == "start") {
      document.getElementById("dyFunctionSend_error").innerText =
        "需要先停止喊话才能进行修改";
      return;
    }

    var _stext = this.clearArrayTrim(
      document.getElementById("dyFunctionSend_text").value.split("\n")
    );

    this.stext = _stext;
    this.maxCount = document.getElementById("dyFunctionSend_count").value || 10;
    this.stime = document.getElementById("dyFunctionSend_time").value || 30;

    this.setSendCount(this.count, this.maxCount);

    document.getElementById("dyFunctionSend_error").innerText = "保存成功";

    // 保存当前设置
    localStorage.setItem("dyFunctionSend_textArr", JSON.stringify(_stext));
    localStorage.setItem("dyFunctionSend_count", this.maxCount);
    localStorage.setItem("dyFunctionSend_time", this.stime);

    setTimeout(this.resetTipText, 2000);
  };

  dySendMsg.prototype.resetTipText = function () {
    document.getElementById("dyFunctionSend_error").innerText =
      "设置需要保存才能生效";
  };

  // 开始
  dySendMsg.prototype.start = function () {
    this.autoSend();
    this.status = "start";
    document
      .querySelectorAll(".dySend_start_btn")[0]
      .classList.toggle("show_d");
    document.querySelectorAll(".dySend_stop_btn")[0].classList.toggle("show_d");
  };

  // 停止 清除定时器
  dySendMsg.prototype.stop = function () {
    this.count = 0;
    this.status = "stop";

    this.setSendCount(0, this.maxCount);
    clearTimeout(this.auto);
    setTimeout(this.resetTipText, 500);

    document
      .querySelectorAll(".dySend_start_btn")[0]
      .classList.toggle("show_d");
    document.querySelectorAll(".dySend_stop_btn")[0].classList.toggle("show_d");
  };

  // 等待发言cd
  dySendMsg.prototype.wait = function (timer) {
    var othis = this;
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve("true");
      }, (Number(othis.stime) + Math.random()) * 1000);
    });
  };

  // 等待发言cd
  dySendMsg.prototype.clearArrayTrim = function (array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == "" || typeof array[i] == "undefined") {
        array.splice(i, 1);
        i = i - 1;
      }
    }
    return array;
  };

  // 自动发送
  dySendMsg.prototype.autoSend = function () {
    // this.changeDySendPanel();
    var jsSend =
      document.querySelectorAll(".ChatSend")[0] ||
      document.getElementById("js-send-msg");

    var currentMsg = "";

    // 文本数组循环
    var arr = JSON.parse(
      localStorage.getItem("dyFunctionSend_textArr") || "[]"
    );
    arr = arr.length < 1 ? this.dySendTextArr : arr;

    currentMsg = arr[this.count % arr.length];

    // 如果相同
    if (this.lastMsg === currentMsg) {
      currentMsg = "‍" + currentMsg;
    }

    //输入框赋值
    document.querySelectorAll(".ChatSend-txt ")[0].value = currentMsg;

    var e = document.createEvent("MouseEvents");
    e.initEvent("click", true, true);

    var sendBtn =
      document.querySelectorAll(".ChatSend-button")[0] ||
      jsSend.querySelectorAll(".ChatSend-button")[0] ||
      jsSend.querySelectorAll(".b-btn")[0];

    var _enentBtnText = sendBtn.innerText;

    if (_enentBtnText != "开火" && _enentBtnText != "发送") {
      document.getElementById("dyFunctionSend_error").innerText =
        "等待发言CD" + _enentBtnText + "秒";
      (async function () {
        var state = this.wait(_enentBtnText);
      }.bind(this)());
    } else {
      document.getElementById("dyFunctionSend_error").innerText =
        "弹幕发送中...";

      sendBtn.dispatchEvent(e);
      // 变量信息修改
      this.count += 1;
      this.lastMsg = currentMsg;

      this.setSendCount(this.count, this.maxCount - this.count);

      console.log("当前共发送" + this.count + "条弹幕");

      if (this.count >= this.maxCount) {
        document.getElementById("dyFunctionSend_error").innerText =
          "弹幕发送完成";
        this.stop();
        return;
      }
    }

    this.auto = setTimeout(
      this.autoSend.bind(this),
      (Number(this.stime) + Math.random()) * 1000
    );
  };

  window.$dy = new dySendMsg();
  $dy.init();
})();
