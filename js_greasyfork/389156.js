// ==UserScript==
// @name         wx_e2e
// @namespace    https://github.com/ygcaicn/wx_e2e
// @version      0.1.2
// @description  wechat end to end encrypt by rsa!
// @author       Jachin
// @match        *://wx.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389156/wx_e2e.user.js
// @updateURL https://update.greasyfork.org/scripts/389156/wx_e2e.meta.js
// ==/UserScript==


(function() {"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js";

script.onload = function () {
  console.log("jQuery is ready!");
};

document.body.appendChild(script);
script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://cdn.bootcss.com/jsencrypt/3.0.0-rc.1/jsencrypt.min.js";

script.onload = function () {
  console.log("jsencrypt is ready!");
};

document.body.appendChild(script);

var log = function log(msg) {
  return console.log("[wx_e2e]:", msg);
}; // 监听收到新消息


var origOpen = XMLHttpRequest.prototype.open;
var origsendTextMessage = angular.element('#editArea').scope().sendTextMessage;
var open_prototype = XMLHttpRequest.prototype.open;

var intercept_response = function intercept_response(callback) {
  XMLHttpRequest.prototype.open = function () {
    // console.log(arguments);
    /\/mmwebwx-bin\/webwxsync/.test(arguments['1']) && this.addEventListener('readystatechange', function (event) {
      // console.log('readystate: ' + this.readyState);
      // console.log(this);
      if (this.responseText !== '' && this.readyState === 4) {
        // console.log(this.responseText);
        var original_response = this.responseText;
        var modified_response = JSON.parse(original_response); // 每次轮询可能收到多条消息

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = modified_response.AddMsgList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var msg = _step.value;
            log(msg);
            if (msg.MsgType == 1) msg = callback(msg);
          } // modify the response

        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        Object.defineProperty(this, 'response', {
          writable: true
        });
        Object.defineProperty(this, 'responseText', {
          writable: true
        });
        this.response = this.responseText = JSON.stringify(modified_response); // console.log(this.responseText);
      }
    });
    return open_prototype.apply(this, arguments);
  };
}; //保存所有的e2e会话


var e2e_list = [];

var WX_E2E =
/*#__PURE__*/
function () {
  function WX_E2E(username) {
    var _this = this;

    var key_size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1024;

    _classCallCheck(this, WX_E2E);

    this.getThis = function () {
      return _this;
    };

    this.username = username;
    this.state = 1;
    this.key_size = key_size;
    this.crypt = new JSEncrypt({
      default_key_size: key_size
    });
    this.pri_key = this.crypt.getPrivateKey();
    this.pub_key = this.crypt.getPublicKey();
    this.other_key = undefined;
  }

  _createClass(WX_E2E, [{
    key: "sendTextMessage",
    value: function sendTextMessage() {
      var msg = angular.element('#editArea').scope().editAreaCtn;
      log(msg); //发送加密消息

      if (this.state === 3) {
        this.crypt.setPublicKey(this.other_key);

        var msg_l = _toConsumableArray(msg);

        var e_msg_l = [];

        while (true) {
          var group = msg_l.splice(0, 117).join('');
          if (group.length == 0) break;
          e_msg_l.push(this.crypt.encrypt(group));
        }

        var e_msg = e_msg_l.flat().join('');
        log(e_msg);
        angular.element('#editArea').scope().editAreaCtn = 'wx_e2e://' + e_msg;
        var orig_ret = origsendTextMessage();
        angular.element('#editArea').scope().editAreaCtn = '';
        this.modifyLastTextMessage(msg);
        return orig_ret;
      } //未连接，提示明文发送
      else {
          var ret = confirm('对方尚未连接，此消息未加密，将明文发送！\r\n' + '对方尚未连接，此消息未加密，将明文发送！\r\n' + '点击确认，承担风险。\r\n' + '点击取消，返回编辑。');

          if (ret) {
            if (msg.search("\r\n\u6211\u6B63\u5728\u4F7F\u7528wx_e2e\u53D1\u9001\u6D88\u606F\u3002\r\n github.com/ygcaicn/wx_e2e") < 0) msg = msg + "\r\n\u6211\u6B63\u5728\u4F7F\u7528wx_e2e\u53D1\u9001\u6D88\u606F\u3002\r\n github.com/ygcaicn/wx_e2e";
            angular.element('#editArea').scope().editAreaCtn = msg;

            var _orig_ret = origsendTextMessage();

            angular.element('#editArea').scope().editAreaCtn = '';
            this.modifyLastTextMessage("尚未连接，此消息未加密，为明文发送！");
            return _orig_ret;
          } else return;
        }
    } // 参数为发送的明文消息

  }, {
    key: "modifyLastTextMessage",
    value: function modifyLastTextMessage(msg) {
      var username = this.username;
      var ret = angular.element("#chatArea").scope().chatContent.filter(function (item) {
        if (item.MsgType == 1 && item.MMIsSend && item.ToUserName === username) {
          return true;
        }
      });
      var last = ret.pop();
      last.MMActualContent = "<span class=\"emoji emoji1f510\"></span>: ".concat(last.MMActualContent, " \n        <br><hr><span class=\"e_msg\">").concat(msg, "</span>");
      $('body').click();
    }
  }, {
    key: "sendRequest",
    value: function sendRequest() {
      var content = "wx_e2e://hi/".concat(this.pub_key);
      angular.element('#editArea').scope().editAreaCtn = content;
      return origsendTextMessage();
      this.state = 4;
    }
  }, {
    key: "sendClose",
    value: function sendClose() {
      var content = "wx_e2e://close";
      angular.element('#editArea').scope().editAreaCtn = content;
      return origsendTextMessage();
      this.state = 0;
    }
  }, {
    key: "decrypt",
    value: function decrypt(e_message) {
      this.crypt.setPrivateKey(this.pri_key);

      var e_message_l = _toConsumableArray(e_message);

      var message_l = [];

      while (true) {
        var group = e_message_l.splice(0, 172).join('');
        if (group.length == 0) break;
        message_l.push(this.crypt.decrypt(group));
      }

      var message = message_l.flat().join('');
      return message || "密钥出错，请重新连接！";
    }
  }, {
    key: "enter_state_2",
    value: function enter_state_2(other_key) {
      log(this.username + ": enter_state_2"); // log(other_key);

      this.state = 2;
      this.other_key = other_key;
      log(this.other_key);
      log(this); // this.enter_state_3();
      // ui_setState(3);
      //弹框提示确认
      //弹框
      //TODO

      log('弹框确认');
      var con = confirm("\u6536\u5230\u8BF7\u6C42\u8FDE\u63A5\uFF0C\u5BF9\u65B9\u7684Key\u4E3A\uFF1A\r\n".concat(this.other_key));

      if (con) {
        this.enter_state_3();
        ui_setState(3); // 调整消息顺序
        // TODO 放在当前位置无效

        var username = this.username; //得到我方发送的消息列表

        var ret = angular.element("#chatArea").scope().chatContent.filter(function (item) {
          if (item.MsgType == 1 && item.MMIsSend && item.ToUserName === username) {
            return true;
          }
        }); // 找到最后一个

        var last = ret.pop();
        angular.element("#chatArea").scope().chatContent.splice(angular.element("#chatArea").scope().chatContent.findIndex(function (item) {
          return item.MsgId === last.MsgId;
        }), 1);
        angular.element("#chatArea").scope().chatContent.push(last);
        $("body").click();
      }
    } // 我方发出的请求被对方确认（对方回复key）
    // 对方发出的请求连接

  }, {
    key: "enter_state_3",
    value: function enter_state_3(other_key) {
      log(this.username + ": enter_state_3");
      this.state = 3; // 我方发出的请求被对方确认（对方回复key）

      if (other_key) {
        this.other_key = other_key;
        log('我方发出的请求被对方确认');
      } // 对方发出的请求连接,弹窗确认后
      else {
          var content = "wx_e2e://ok/".concat(this.pub_key);
          angular.element('#editArea').scope().editAreaCtn = content;
          var o_ret = origsendTextMessage();
          return o_ret;
        }
    }
  }, {
    key: "enter_state_4",
    value: function enter_state_4() {
      log(this.username + ": enter_state_4");
      this.sendRequest();
      this.state = 4;
    }
  }]);

  return WX_E2E;
}(); //消息处理函数，msg的格式为chatContent.json的第二个消息格式


var messageHandler = function messageHandler(msg) {
  log('------------------------');
  log(msg); //只处理文本消息

  if (msg.MsgType != 1) return msg;
  var username = msg.FromUserName; // 判断是否需要处理

  var ret = e2e_list.filter(function (item) {
    return item.username === username;
  }); // 不需要处理

  if (ret.length == 0) return msg;

  if (ret.length > 1) {
    log("e2e_list 出现重复用户。");
    return;
  }

  var e2e = ret[0];
  var content = msg.Content; // 请求连接
  // wx_e2e://hi/
  // -----BEGIN PUBLIC KEY-----
  // MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHMiD3c1O+ZvC1HKwc1H+RC9B9wL
  // /en0EMTtKw4PcGPXRV0MNBHYuOXYiF/34iTLnHa2JMDiTbeAazvUdq9tbE1hqU81
  // Mu53dp8uC5s66x9d5VmAxFztoSYUXFLY1/tY8lpnnMYQbyP3bSM0BlIOxZZDRMHE
  // k+qUpBL7tCcQU+WjAgMBAAE=
  // -----END PUBLIC KEY-----

  ret = /wx_e2e:\/\/hi\/(-----BEGIN PUBLIC KEY-----[\S\s]+)/m.exec(content);

  if (ret && ret.length == 2) {
    var other_key = ret[1];
    other_key = other_key.replace(/<br\/>/gm, "\n");
    log("收到请求连接，对方的Key为：\r\n" + other_key);

    if (e2e.state == 1 || e2e.state == 4) {
      //调整当前聊天
      // angular.element('.chat_item').scope().itemClick(username);
      $("div[data-username=\"".concat(username, "\"]")).click();
      e2e.enter_state_2(other_key);
      ui_setState(2);
      msg.Content = "<span class=\"emoji emoji1f510\"></span>: ".concat(content, " \n            <br><hr><span class=\"e_msg\">\u5BF9\u65B9\u8BF7\u6C42e2e\u8FDE\u63A5\u3002</span>");
      return msg;
    }

    msg.Content = "<span class=\"emoji emoji1f510\"></span>: ".concat(content, " \n        <br><hr><span class=\"e_msg\">\u9519\u8BEF\u6D88\u606F-\u72B6\u6001\u4E0D\u5339\u914D</span>");
    return msg;
  } // 对方退出(请求终止)
  // wx_e2e://close


  if (/wx_e2e:\/\/close/.test(content)) {
    log("对方退出！");

    if (e2e.state == 3) {
      e2e_list.splice(e2e_list.findIndex(function (item) {
        return item.username === e2e.username;
      }), 1);
      ui_setState(0);
      msg.Content = "<span class=\"emoji emoji1f510\"></span>: ".concat(content, " \n            <br><hr><span class=\"e_msg\">\u5BF9\u65B9\u65AD\u5F00e2e\u8FDE\u63A5\u3002</span>");
      e2e_exit();
      return msg;
    }

    msg.Content = "<span class=\"emoji emoji1f510\"></span>: ".concat(content, " \n        <br><hr><span class=\"e_msg\">\u9519\u8BEF\u6D88\u606F-\u72B6\u6001\u4E0D\u5339\u914D</span>");
    return msg;
  } //对方确认（收到的消息为公钥，当前状态为4）
  // wx_e2e://ok/
  // -----BEGIN PUBLIC KEY-----
  // MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHMiD3c1O+ZvC1HKwc1H+RC9B9wL
  // /en0EMTtKw4PcGPXRV0MNBHYuOXYiF/34iTLnHa2JMDiTbeAazvUdq9tbE1hqU81
  // Mu53dp8uC5s66x9d5VmAxFztoSYUXFLY1/tY8lpnnMYQbyP3bSM0BlIOxZZDRMHE
  // k+qUpBL7tCcQU+WjAgMBAAE=
  // -----END PUBLIC KEY-----


  ret = /wx_e2e:\/\/ok\/(-----BEGIN PUBLIC KEY-----[\S\s]+)/m.exec(content);

  if (ret && ret.length == 2) {
    var _other_key = ret[1];
    _other_key = _other_key.replace(/<br\/>/gm, "\n");
    log("收到对方确认，对方的Key为：\r\n" + _other_key);

    if (e2e.state == 4) {
      e2e.enter_state_3(_other_key);
      ui_setState(3);
      msg.Content = "<span class=\"emoji emoji1f510\"></span>: ".concat(content, " \n            <br><hr><span class=\"e_msg\">\u5BF9\u65B9\u5DF2\u786E\u8BA4\uFF0C\u8FDE\u63A5\u6210\u529F\uFF01</span>");
      return msg;
    }

    msg.Content = "<span class=\"emoji emoji1f510\"></span>: ".concat(content, " \n        <br><hr><span class=\"e_msg\">\u9519\u8BEF\u6D88\u606F-\u72B6\u6001\u4E0D\u5339\u914D</span>");
    return msg;
  } //加密消息，当前状态为3
  // wx_e2e://xxxxx


  ret = /wx_e2e:\/\/([\S\s]+)/m.exec(content);

  if (ret && e2e.state == 3) {
    var s = e2e.decrypt(ret[1]);
    msg.Content = "<span class=\"emoji emoji1f510\"></span>: ".concat(s, " \n                        <br><hr><span class=\"e_msg\">").concat(content, "</span>");
    return msg;
  } //非加密消息


  msg.Content = "<span class=\"emoji emoji1f510\"></span>: ".concat(content, " \n    <br><hr><span class=\"e_msg\">\u975E\u52A0\u5BC6\u6D88\u606F\u3002</span>"); // 必须要返回msg

  return msg;
}; // 进入e2e会话状态
// state 0->1
// username  联系人的username  angular.element("#chatArea").scope().currentContact.UserName


var e2e_enter = function e2e_enter(username) {
  var e2e = new WX_E2E(username);
  e2e_list.push(e2e);
  ui_setState(1);
  log(username + ": enter_state_1"); // 正在等待对方的邀请，
  // confirm(`进入等待邀请状态\r\n点击确认`)
  // $("#e2e_state").click
}; // 退出会话状态
// username 联系人的username  angular.element("#chatArea").scope().currentContact.UserName


var e2e_exit = function e2e_exit(username) {
  var e2e = undefined; // 告诉对方退出
  // 判断是否需要处理

  var ret = e2e_list.filter(function (item) {
    return item.username === username;
  }); // 不需要处理

  if (ret.length == 1) {
    e2e = ret[0];
    if (e2e.state > 1) e2e.sendClose();
  }

  if (ret.length > 1) {
    log("e2e_list 出现重复用户。请检查");
    return;
  } // 将会话从e2e_list删除


  e2e_list.splice(e2e_list.findIndex(function (item) {
    return item.username === e2e.username;
  }), 1); // TODO
  // 提示保存rsa公钥与密钥，以及e2e会话聊天记录
  // 恢复原始聊天功能

  ui_setState(0);
}; // 11 收到对方e2e请求
// 


var ui_init = function ui_init() {
  log('ui_init.');
  var css = "<style type=\"text/css\">\n    .e2e_toolbar{\n        width: 30px;\n        height: 30px;\n        text-decoration: none;\n        font-size: 30px;\n        line-height: 30px;\n        margin-left: 5px;\n        color: #4d4d4d9e;\n        // background: gold;\n        //background: url(//res.wx.qq.com/a/wx_fed/webwx/res/static/css/5af37c4\u2026@1x.png) no-repeat;\n        background-position: -404px -398px;\n        -webkit-background-size: 487px 462px;\n        background-size: 487px 462px;\n        vertical-align: middle;\n        display: none;\n    }\n    .e2e_display{\n        display: inline-block;\n    }\n    .e2e_hide{\n        display: none;\n    }\n    .e2e_disable{\n        color: #4d4d4d9e;\n    }\n    .e2e_enable{\n        color: #7fac4d;\n    }\n    .e_msg{\n        display: inline;\n    }\n    .e2e_box:before{/*\u4F7F\u7528\u4F2A\u7C7B\u5143\u7D20,after \u548Cbefore\u90FD\u884C*/\n        content:\"\";\n        height:100%;\n        display:inline-block;\n        vertical-align:middle;\n      }\n      .e2e_box{\n        position: fixed;\n        left: 0px;\n        right: 0px;\n        top:0px;\n        bottom:0px;\n        background-color: rgba(0,0,0,0.4);z-index:9999;\n        opacity: 1;\n        text-align: center;/**\u4F7F\u5185\u8054\u5143\u7D20\u5C45\u4E2D**/\n      }\n      .e2e_donate_box{\n        background: #fff;\n        display:inline-block;/*\u8BBE\u7F6E\u4E3A\u5185\u8054\u5143\u7D20*/\n      }\n      .e2e_donate_box img{\n          display: block;\n          width: 400px;\n          height: 622px;\n      }\n    .\n    </style>\n    ";
  $("body").append(css);
  var tools = "\n    <a class=\"e2e_toolbar e2e_display e2e_enable\" id=\"e2e_enter\" href=\"javascript:;\" title=\"WX_E2E\">\uD83D\uDD10</a>\n    <a class=\"e2e_toolbar\" id=\"e2e_state\" href=\"javascript:;\" title=\"\">\uD83D\uDD10</a>\n    <a class=\"e2e_toolbar\" id=\"e2e_update_key\" href=\"javascript:;\" title=\"WX_E2E update key\">\u2699</a>\n    <a class=\"e2e_toolbar\" id=\"e2e_donate\" href=\"javascript:;\" title=\"WX_E2E\u7ED9\u4F5C\u8005\u4E70\u4E00\u676F\u5496\u5561!\">\uD83D\uDCB0</a>\n    <a class=\"e2e_toolbar\" id=\"e2e_exit\" href=\"javascript:;\" title=\"WX_E2E Exit\">\u274C</a>\n    ";
  $("#tool_bar").append(tools);
  var e2e_box = "\n    <div id=\"e2e_box\" class=\"e2e_box e2e_hide\">\n        <div class=\"e2e_donate_box\"><img src=\"https://github.com/ygcaicn/wx_e2e/raw/master/alipay.jpg\"/></div>\n    <p>\u4E07\u5206\u611F\u8C22</p>\n    </div>\n    ";
  $("body").append(e2e_box);
  $("#J_NavChatScrollBody").click(function () {
    log('click left');
    var username = angular.element("#chatArea").scope().currentContact.UserName;

    if (angular.element("#chatArea").scope().currentContact.MMInChatroom) {
      ui_setState(0);
      $("#e2e_enter").attr("class", "e2e_toolbar e2e_hide e2e_disable");
      return;
    }

    var ret = e2e_list.filter(function (item) {
      return item.username === username;
    });

    if (ret.length == 1) {
      var e2e = ret[0];
      ui_setState(e2e.state);
    } else {
      ui_setState(0);
    }
  });
  $(".e2e_donate_box").css('margin-top', ((window.innerHeight - 630) / 2).toString() + 'px');
  $("#e2e_donate").click(function () {
    $("#e2e_box").show();
  });
  $("#e2e_box").click(function (e) {
    e.preventDefault();
    $("#e2e_box").hide();
  });
  $("#e2e_enter").click(function () {
    log('click e2e_enter');

    if ($("#e2e_enter").attr("class").search('e2e_enable') >= 0) {
      var username = angular.element("#chatArea").scope().currentContact.UserName;
      e2e_enter(username);
    }
  });
  $("#e2e_state").click(function () {
    log('click e2e_state');

    if ($("#e2e_state").attr("class").search('e2e_enable') >= 0) {
      var username = angular.element("#chatArea").scope().currentContact.UserName; // 判断是否需要处理

      var ret = e2e_list.filter(function (item) {
        return item.username === username;
      });

      if (ret.length == 1) {
        var e2e = ret[0];
        log('e2e state:' + e2e.state);

        if (e2e.state == 1 || e2e.state == 4) {
          e2e.enter_state_4();
          ui_setState(4);
          return;
        }

        if (e2e.state == 2) {
          return;
        }

        if (e2e.state == 3) {
          alert("wx_e2e 已连接！");
          return;
        }
      }
    }
  });
  $("#e2e_update_key").click(function () {
    log('click e2e_update_key');

    if ($("#e2e_update_key").attr("class").search('e2e_enable') >= 0) {
      alert("设置功能正在开发中！...");
    }
  });
  $("#e2e_exit").click(function () {
    if ($("#e2e_exit").attr("class").search('e2e_enable') >= 0) {
      var username = angular.element("#chatArea").scope().currentContact.UserName;
      e2e_exit(username);
    }
  });
  ui_setState(0);
}; // 设置ui状态
// state 状态号         e2e_enter           e2e_state       e2e_update_key          e2e_exit
// 0 原生状态           display,enable      hide            hide                    hide
// 1 e2e未连接状态      diaplay,disable      ❓  ⛔            display,enable 🔑        display,enable ❌
// 2 收到请求，待确认    display,disable      ❇️              display,enable 🔑        display,enable ❌
// 3 连接成功           display,disable     🍻 ✅ 🔗            display,enable 🔑        display,enable ❌
// 4 发出请求，待对方确认 display,disable      ⁉️              display,disable 🔑⚙       display,enable ❌   


var ui_setState = function ui_setState(state) {
  var e2e = undefined; //判断是否已经进行初始化

  if ($('#e2e_box').length === 0) {
    ui_init();
  }

  if (state != 0) {
    var username = angular.element("#chatArea").scope().currentContact.UserName;
    var ret = e2e_list.filter(function (item) {
      return item.username === username;
    });

    if (ret.length < 1) {
      log("严重错误，找不到e2e");
      return;
    }

    e2e = ret[0];
  }

  if (state == 0) {
    $("#e2e_enter").attr("class", "e2e_toolbar e2e_display e2e_enable");
    $("#e2e_state").attr("class", "e2e_toolbar e2e_hide");
    $("#e2e_update_key").attr("class", "e2e_toolbar e2e_hide");
    $("#e2e_donate").attr("class", "e2e_toolbar e2e_hide");
    $("#e2e_exit").attr("class", "e2e_toolbar e2e_hide");
    angular.element('#editArea').scope().sendTextMessage = origsendTextMessage;
    return;
  }

  if (state == 1) {
    $("#e2e_enter").attr("class", "e2e_toolbar e2e_display e2e_disable");
    $("#e2e_state").attr("class", "e2e_toolbar e2e_display e2e_enable");
    $("#e2e_state").attr("title", "WX_E2E未连接，点击发送请求！");
    $("#e2e_state").text('⛔');
    $("#e2e_update_key").attr("class", "e2e_toolbar e2e_display e2e_enable");
    $("#e2e_donate").attr("class", "e2e_toolbar e2e_display e2e_enable");
    $("#e2e_exit").attr("class", "e2e_toolbar e2e_display e2e_enable");

    angular.element('#editArea').scope().sendTextMessage = function () {
      return e2e.sendTextMessage();
    };

    return;
  }

  if (state == 2) {
    $("#e2e_enter").attr("class", "e2e_toolbar e2e_display e2e_disable");
    $("#e2e_state").attr("class", "e2e_toolbar e2e_display e2e_enable");
    $("#e2e_state").attr("title", "WX_E2E收到请求，点击查看！");
    $("#e2e_state").text('❇️');
    $("#e2e_update_key").attr("class", "e2e_toolbar e2e_display e2e_enable");
    $("#e2e_donate").attr("class", "e2e_toolbar e2e_display e2e_enable");
    $("#e2e_exit").attr("class", "e2e_toolbar e2e_display e2e_enable");

    angular.element('#editArea').scope().sendTextMessage = function () {
      return e2e.sendTextMessage();
    };

    return;
  }

  if (state == 3) {
    $("#e2e_enter").attr("class", "e2e_toolbar e2e_display e2e_disable");
    $("#e2e_state").attr("class", "e2e_toolbar e2e_display e2e_enable");
    $("#e2e_state").attr("title", "WX_E2E连接成功！");
    $("#e2e_state").text('🔗');
    $("#e2e_donate").attr("class", "e2e_toolbar e2e_display e2e_enable");
    $("#e2e_exit").attr("class", "e2e_toolbar e2e_display e2e_enable");

    angular.element('#editArea').scope().sendTextMessage = function () {
      return e2e.sendTextMessage();
    };

    return;
  }

  if (state == 4) {
    $("#e2e_enter").attr("class", "e2e_toolbar e2e_display e2e_disable");
    $("#e2e_state").attr("class", "e2e_toolbar e2e_display e2e_enable");
    $("#e2e_state").attr("title", "WX_E2E已发出请求，待对方确认，点击再次发送请求！");
    $("#e2e_state").text('⁉️ ');
    $("#e2e_donate").attr("class", "e2e_toolbar e2e_display e2e_enable");
    $("#e2e_exit").attr("class", "e2e_toolbar e2e_display e2e_enable");

    angular.element('#editArea').scope().sendTextMessage = function () {
      return e2e.sendTextMessage();
    };

    return;
  }
};

(function () {
  log("wechat end to end encrypt by rsa."); // 拦截消息

  intercept_response(function (msg) {
    return messageHandler(msg) || msg;
  }); // ui初始化

  ui_init();
})();


})();