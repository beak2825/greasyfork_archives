// ==UserScript==
// @name	腾讯课堂签到
// @description	zh-cn
// @namespace TXKT_Auto
// @author	小羊睡着了
// @version	0.4.2
// @grant	GM_getValue
// @grant	GM_setValue
// @grant	GM_registerMenuCommand
// @grant	GM_addStyle
// @run-at	document-start
// @require	https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @match	*://ke.qq.com/course/*
// @match	*://ke.qq.com/webcourse*
// @icon    https://pic.thtown.cn/images/2022/03/30/202203302055395.png
// @license	GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/442350/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/442350/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let AutoSignConfig = {};
let DefaultConfig = {
  TTS_IsOpen: true,
  TTS_Volce: 5,
  TTS_Speed: 7,
  CX_IsOpen: true,
  CX_IsRandomWaiting: true,
  CX_WaitingTime: 30,
  TXKT_Repeater_IsOpen: true,
  TXKT_Repeater_WaitingTime: 1000,
  TXKT_Repeater_MaxWaitingCount: 7,
  TXKT_Signing_WaitingTime: 1000,
  SYSTEM_ALERT_ISOPEN: true
};
var sign_times = 0;
var answer_times = 0;
var repeat_times = 0;
var blacklist = "";
var TXKTloading = 0;
Promise.all([GM_getValue("CXAndTXKTConfig")])
  .then(function (data) {
    if (data[0] !== undefined) {
      try {
        AutoSignConfig = JSON.parse(data[0]);
      } catch (e) {
        AutoSignConfig = data[0];
      }
    } else {
      AutoSignConfig = DefaultConfig;
    }
    for (var key in DefaultConfig) {
      if (typeof AutoSignConfig[key] == "undefined") {
        AutoSignConfig[key] = DefaultConfig[key];
      }
    }
    MainFunction();
  })
  .catch(function (except) {
    console.log("错误！请复制后上报bug。", except);
  });
window.T2S = function (TXT) {
  if (!AutoSignConfig.TTS_IsOpen) {
    return;
  }
  if (TXT === undefined) {
    TXT = "我有参数呢,播报的内容您还没填呢。填写后才能读出你想要的文字呢，亲！";
  }
  var tmp = document.createElement("div");
  tmp.innerHTML =
    '<iframe src="data:audio/mpeg;base64,x==" allow="autoplay" style="position:fixed;z-index:-999999999;top:-120px;left:-100px;width:10px;height:10px" autoplay></iframe>';
  tmp.id = "taoSignAudioTEST";
  document.getElementsByTagName("body")[0].append(tmp);
  setTimeout(function () {
    document.getElementById("taoSignAudioTEST").remove();
    tmp = document.getElementById("taoSignAudio");
    if (tmp) {
      tmp.src =
        "http://tts.baidu.com/text2audio?cuid=baiduid&per=4&vol=" +
        AutoSignConfig.TTS_Volce +
        "&pit=6&lan=zh&spd=" +
        AutoSignConfig.TTS_Speed +
        "&ctp=1&pdt=311&ie=UTF-8&tex=" +
        TXT;
    } else {
      tmp = document.createElement("audio");
      tmp.id = "taoSignAudio";
      tmp.src =
        "http://tts.baidu.com/text2audio?cuid=baiduid&per=4&vol=" +
        AutoSignConfig.TTS_Volce +
        "&pit=6&lan=zh&spd=" +
        AutoSignConfig.TTS_Speed +
        "&ctp=1&pdt=311&ie=UTF-8&tex=" +
        TXT;
      document.getElementsByTagName("body")[0].append(tmp);
    }
    document.getElementById("taoSignAudio").play();
  }, 500);
};
GM_registerMenuCommand("我找不到插件设置窗口！告诉我在哪里", function () {
  $("#AutoSignSettingIcon").css("top", 0);
  if (location.href.match(/chaoxing\.com/) !== null) {
    $(".wrap1200.clearfix,.headbanner_new,#to_top,.foot").css(
      "filter",
      "blur(10px)"
    );
  } else {
    $("#preloading,#react-body").css("filter", "blur(10px)");
  }
  setTimeout(function () {
    function tmp() {
      $("#AutoSignSettingIcon").css("top", "-48px");
      if (location.href.match(/chaoxing\.com/) !== null) {
        $(".wrap1200.clearfix,.headbanner_new,#to_top,.foot").css(
          "filter",
          "none"
        );
      } else {
        $("#preloading,#react-body").css("filter", "none");
      }
      $("body").off("mousemove", tmp());
    }
    $("body").on("mousemove", tmp());
  }, 5000);
});
function MainFunction() {
  var box = function (t, b, out = 6.5) {
    if (!AutoSignConfig.SYSTEM_ALERT_ISOPEN) {
      console.log("浏览器弹窗已关闭");
      return false;
    }

    if (window.Notification) {
      Notification.requestPermission(function (status) {
        if (status === "granted") {
          var n = new Notification(t, { body: b });
          n.onshow = function () {
            setTimeout(n.close.bind(n), out * 1000);
          };
        } else if (Notification.permission === "denied") {
          alert(
            "通知被禁止，请允许通知！\n\n如果不需要toast弹窗，请在设置中关闭弹窗提醒！"
          );
        } else {
          alert(
            "请允许通知！\n\n如果不需要toast弹窗，请在设置中关闭弹窗提醒！"
          );
        }
      });
    } else {
      alert("你的浏览器不支持！，请在设置中关闭弹窗提醒！");
    }
    return true;
  };

  if (location.href.match(/ke.qq.com\/course/)) {
    var url = "";
    $(document).ready(function () {
      var isok = false;
      var Container = document.createElement("a");
      Container.id = "modle302";
      Container.title = "点击重定向";
      Container.innerHTML = "点击重定向";
      Container.style =
        "background: red;color: white;border: blue double;cursor: pointer;display:none";
      $(".course-title > h3")[0].appendChild(Container);
      $(".js-task-item.task-item").each(function (e) {
        $(this).on("click", function () {
          geturl();
          $("#modle302").off("click", clickeve);
          $("#modle302").css("display", "none");
          isok = false;
        });
      });

      function clickeve() {
        location.href = url;
      }
      function geturl() {
        var i = setInterval(function () {
          var ifr = document.querySelector("#js-study-video");
          if (ifr) {
            try {
              var cid = ifr.src.toString().match(/cid=\d+/);
              var tid = ifr.src.toString().match(/term_id=\d+/);
              var taid = ifr.src.toString().match(/taid=\d+/);
              if (cid !== null && tid !== null && taid !== null) {
                url =
                  "https://ke.qq.com/webcourse/index.html#cid=" +
                  cid[0].match(/\d+/)[0] +
                  "&term_id=" +
                  tid[0].match(/\d+/)[0] +
                  "&taid=" +
                  taid[0].match(/\d+/)[0];
                $("#modle302").css("display", "");
                $("#modle302").on("click", clickeve);
                if (!isok) {
                  box(
                    "加载完成",
                    "页面信息加载完成，\n可以点击【重定向】按钮跳转"
                  );
                  isok = true;
                }
                clearInterval(i);
              }
            } catch (e) {
              console.error("未知错误！\n请复制错误信息提交反馈====>>\n\n", e);
            }
          }
        }, 500);
      }
      geturl();
    });
    return;
  }

  var UPDETE_timeout = 0;

  function URLChoicer(isResting = false) {
    if (!isResting && top.location == self.location) {
      console.log(
        "%c【语音播报】%c功能已%c%s",
        "color:red",
        "color:black",
        AutoSignConfig.TTS_IsOpen
          ? "background-color:green;color:white;"
          : "background-color:red;color:white;",
        AutoSignConfig.TTS_IsOpen ? "开启" : "关闭"
      );
    }
    if (isResting && location.href.match(/chaoxing\.com\/space/) !== null) {
      $("#frame_content")[0].contentWindow.location.reload();
      return;
    }
    if (location.href.match(/visit\/interaction/) !== null) {
      if (isResting) {
        window.location.reload();
      } else {
        window.onload = function () {
          cx_sign(true);
        };
      }
    }
    if (location.href.match(/mobilelearn/) !== null) {
      cx_main();
    }
    if (
      location.href.match(/ke.qq.com/) !== null &&
      top.location == self.location
    ) {
      if (isResting) {
        ke();
      } else {
        window.onload = function () {
          ke();
        };
      }
    }
    return;
  }

  function UpdateSettings() {
    if (UPDETE_timeout) {
      clearTimeout(UPDETE_timeout);
      UPDETE_timeout = 0;
    }
    GM_setValue("CXAndTXKTConfig", JSON.stringify(AutoSignConfig));
    UPDETE_timeout = setTimeout(function () {
      box("设置更新通知", "设置更新成功，已重新加载");
      URLChoicer(true);
    }, 3000);
  }

  function updateUI() {
    return (
      "<div id='AutoSignSettingIcon' title='双击清除'></div>\n" +
      "<div class='TaoMain'>\n" +
      "<div class='TaoTotal'>\n" +
      "<fieldset id='fieldsetAll'>\n" +
      "<legend style='text-align: center;'><a style='color:#000000;' href='https://thtown.cn/119.html' target='_blank'>小羊睡着了</a>\n" +
      "</legend>\n" +
      (location.href.match(/chaoxing\.com/) !== null
        ? "<fieldset>\n" +
          "<legend title='超星学习通的相关功能,如自动签到,延时,检测等'><font class='SettingTitle'>超星 设置</font>\n" +
          "</legend>\n" +
          "<ul class='Setting_ul'>\n" +
          "<li class='Setting_Choice'>\n" +
          "<label title='是否开启自动签到功能(推荐开启)'>自动签到\n" +
          "<input id='CX_IsOpen' type='button' class='Setting_input Setting_btn " +
          (AutoSignConfig.CX_IsOpen ? "Setting_On" : "Setting_Off") +
          "'>\n" +
          "</label>\n" +
          "<label title='签到刷新随机延时±5秒(推荐开启，以防同时加载过多的页面导致卡顿)（测试功能）'>随机延时\n" +
          "<input id='CX_IsRandomWaiting' type='button' class='Setting_input Setting_btn " +
          (AutoSignConfig.CX_IsRandomWaiting ? "Setting_On" : "Setting_Off") +
          "'>\n" +
          "</label>\n" +
          "</li>\n" +
          "</ul>\n" +
          "<div>\n" +
          "<ul class='Setting_ul'>\n" +
          "<li>\n" +
          "<label title='每隔多长时间监视一次'>监视时间\n" +
          "<input class='Setting_input' id='CX_WaitingTime' type='number' min='1' value='" +
          AutoSignConfig.CX_WaitingTime +
          "'>秒</label>\n" +
          "</li>\n" +
          "</ul>\n" +
          "<ul class='Setting_ul'>\n" +
          "<li>\n" +
          "<label title='最大检测次数,超过限制停止。值为0则无限制'>最多检测\n" +
          "<input class='Setting_input' id='CX_MaxWaitingCount' type='number' min='0' value='" +
          AutoSignConfig.CX_MaxWaitingCount +
          "'>次</label>\n" +
          "</li>\n" +
          "</ul>\n" +
          "</div>\n" +
          "</fieldset>\n" +
          "</fieldset>\n" +
          "</div>\n" +
          "</div>"
        : "<fieldset>\n" +
          "<legend title='回复复读机设置'>" +
          "<font class='SettingTitle'>腾讯课堂复读机 设置</font>\n" +
          "</legend>\n" +
          "<ul class='Setting_ul'>\n" +
          "<li class='Setting_Choice'>\n" +
          "<label style='height: 20px;' title='是否开启回复复读机，开启后如果复读完自动加入黑名单，防止重复发送，并且等待10秒后重新开始检测'>回复复读\n" +
          "<input id='TXKT_Repeater_IsOpen' type='button' class='Setting_input Setting_btn " +
          (AutoSignConfig.TXKT_Repeater_IsOpen ? "Setting_On" : "Setting_Off") +
          "'>\n" +
          "</label>\n" +
          "</li>\n" +
          "</ul>\n" +
          "<div>\n" +
          "<ul class='Setting_ul'>\n" +
          "<li>\n" +
          "<label title='检测相同数据的时间'>检测时间\n" +
          "<input class='Setting_input' id='TXKT_Repeater_WaitingTime' type='number' value='" +
          AutoSignConfig.TXKT_Repeater_WaitingTime +
          "'>毫秒</label>\n" +
          "</li>\n" +
          "</ul>\n" +
          "<ul class='Setting_ul'>\n" +
          "<li>\n" +
          "<label title='连续多少句的时候触发复读'>检测数量\n" +
          "<input class='Setting_input' id='TXKT_Repeater_MaxWaitingCount' type='number' value='" +
          AutoSignConfig.TXKT_Repeater_MaxWaitingCount +
          "'>句</label>\n" +
          "</li>\n" +
          "</ul>\n" +
          "</div>\n" +
          "</fieldset>\n" +
          "<fieldset>\n" +
          "<legend class='SettingTitle' title='腾讯课堂自动签到'> <font>腾讯课堂签到 设置</font>\n" +
          "</legend>\n" +
          "<ul class='Setting_ul'>\n" +
          "<li>\n" +
          "<label title='签到的监视时间,可以填理论任意数值。'>签到监视\n" +
          "<input id='TXKT_Signing_WaitingTime' class='Setting_input' type='number' min='0' value='" +
          AutoSignConfig.TXKT_Signing_WaitingTime +
          "'>毫秒</label>\n" +
          "</li>\n" +
          "</ul>\n" +
          "</fieldset>\n" +
          "</div>\n" +
          "</div>")
    );
  }
  var auto_sign_interval = 0,
    auto_answer_interval = 0;
  var auto_Repeater_timeout = 0,
    T2S_timeout = 0,
    icon_timeout = 0;
  var canhiden = 0,
    canhiden2 = 0;

  function hidensetting() {
    if (icon_timeout) {
      clearTimeout(icon_timeout);
      icon_timeout = 0;
    }
    icon_timeout = setTimeout(function () {
      $(".TaoTotal").css("opacity", 1);
      var fadeout = setInterval(function () {
        if (!canhiden || !canhiden2) {
          clearTimeout(icon_timeout);
          clearInterval(fadeout);
          icon_timeout = 0;
          $(".TaoTotal").css("opacity", 1);
          setTimeout(function () {
            hidensetting();
          }, 1000);
          return;
        }
        $(".TaoTotal").css(
          "opacity",
          Number($(".TaoTotal").css("opacity")) - 0.01
        );
        if (Number($(".TaoTotal").css("opacity")) <= 0.1) {
          clearInterval(fadeout);
          $(".TaoTotal").css("opacity", 0);
          $("#AutoSignSettingIcon")
            .css("-webkit-transform", " rotate(0deg)")
            .css("-ms-transform", " rotate(0deg)")
            .css("transform", " rotate(0deg);")
            .css("top", "");
          $(".TaoTotal").css("display", "none");
        }
      }, 10);
    }, 800);
  }

  function createSettingsWindow() {
    if (
      document.body !== null &&
      document.querySelector("#AutoSignSettingFrame") === null
    ) {
      let Container = document.createElement("div");
      Container.id = "AutoSignSettingFrame";
      Container.innerHTML = updateUI();
      document.body.appendChild(Container);
      $("#AutoSignSettingIcon").on("mouseover", function (e) {
        canhiden = 0;
        $("#AutoSignSettingIcon")
          .css("-webkit-transform", " rotate(180deg)")
          .css("-ms-transform", " rotate(180deg)")
          .css("transform", " rotate(180deg);")
          .css("top", 0);
        setTimeout(function () {
          $(".TaoTotal").css("display", "block");
          var fadein = setInterval(function () {
            $(".TaoTotal").css(
              "opacity",
              Number($(".TaoTotal").css("opacity")) + 0.01
            );
            if (Number($(".TaoTotal").css("opacity")) >= 1) {
              clearInterval(fadein);
              $(".TaoTotal").css("opacity", 1);
            }
          }, 10);
        }, 700);
      });
      $("#AutoSignSettingIcon").on("mouseout", function (e) {
        canhiden = 1;
        hidensetting();
      });

      $(".TaoTotal").on("mouseover", function (e) {
        canhiden2 = 0;
        if (location.href.match(/chaoxing\.com/) !== null) {
          $(".wrap1200.clearfix,.headbanner_new,#to_top,.foot").css(
            "filter",
            "blur(10px)"
          );
        } else {
          $("#preloading,#react-body").css("filter", "blur(10px)");
        }
      });
      $(".TaoTotal").on("mouseout", function (e) {
        canhiden2 = 1;
        hidensetting();
        if (location.href.match(/chaoxing\.com/) !== null) {
          $(".wrap1200.clearfix,.headbanner_new,#to_top,.foot").css(
            "filter",
            "none"
          );
        } else {
          $("#preloading,#react-body").css("filter", "none");
        }
      });
      $("#SYSTEM_ALERT_ISOPEN").on("click", function (e) {
        var IsOpen = !!!$(e.target)
          .attr("class")
          .match(/Setting_On/g);
        $(e.target).addClass(!IsOpen ? "Setting_Off" : "Setting_On");
        $(e.target).removeClass(!IsOpen ? "Setting_On" : "Setting_Off");
        AutoSignConfig.SYSTEM_ALERT_ISOPEN = IsOpen;
        UpdateSettings();
      });
      $("#TTS_IsOpen").on("click", function (e) {
        var IsOpen = !!!$(e.target)
          .attr("class")
          .match(/Setting_On/g);
        $(e.target).addClass(!IsOpen ? "Setting_Off" : "Setting_On");
        $(e.target).removeClass(!IsOpen ? "Setting_On" : "Setting_Off");
        AutoSignConfig.TTS_IsOpen = IsOpen;
        UpdateSettings();
        if (T2S_timeout) {
          clearTimeout(T2S_timeout);
        }
        T2S_timeout = setTimeout(function () {
          window.T2STEST();
        }, 1000);
      });
      $("#TTS_Volce").on("input", function (e) {
        var Tmp = Number(e.target.value);
        Tmp = Tmp > 15 ? 15 : Tmp < 0 ? 0 : Tmp;
        AutoSignConfig.TTS_Volce = Tmp;
        $("#TTS_Volce").val(Tmp);
        UpdateSettings();
        if (T2S_timeout) {
          clearTimeout(T2S_timeout);
        }
        T2S_timeout = setTimeout(function () {
          window.T2STEST();
        }, 1000);
      });
      $("#TTS_Speed").on("input", function (e) {
        var Tmp = Number(e.target.value);
        Tmp = Tmp > 9 ? 9 : Tmp < 0 ? 0 : Tmp;
        AutoSignConfig.TTS_Speed = Tmp;
        $("#TTS_Speed").val(Tmp);
        UpdateSettings();
        if (T2S_timeout) {
          clearTimeout(T2S_timeout);
        }
        T2S_timeout = setTimeout(function () {
          window.T2STEST();
        }, 1000);
      });
      if (location.href.match(/chaoxing\.com/) !== null) {
        $("#CX_IsOpen").on("click", function (e) {
          var IsOpen = !!!$(e.target)
            .attr("class")
            .match(/Setting_On/g);
          $(e.target).addClass(!IsOpen ? "Setting_Off" : "Setting_On");
          $(e.target).removeClass(!IsOpen ? "Setting_On" : "Setting_Off");
          AutoSignConfig.CX_IsOpen = IsOpen;
          UpdateSettings();
        });
        $("#CX_IsRandomWaiting").on("click", function (e) {
          var IsOpen = !!!$(e.target)
            .attr("class")
            .match(/Setting_On/g);
          if (IsOpen) {
            var boo = confirm(
              "这是一个测试的选项，请谨慎打开开关，\n如果异常请打开console控制台，并把报错的内容反馈到插件的主页（右上角有链接）\n你确定要打开么？"
            );
            //confirm 会返回你选择的选项,然后可以依据选择执行逻辑
            if (!boo) {
              return;
            }
          }
          $(e.target).addClass(!IsOpen ? "Setting_Off" : "Setting_On");
          $(e.target).removeClass(!IsOpen ? "Setting_On" : "Setting_Off");
          AutoSignConfig.CX_IsRandomWaiting = IsOpen;
          UpdateSettings();
        });
        $("#CX_WaitingTime").on("input", function (e) {
          AutoSignConfig.CX_WaitingTime = Number(e.target.value);
          UpdateSettings();
        });
        $("#CX_MaxWaitingCount").on("input", function (e) {
          AutoSignConfig.CX_MaxWaitingCount = Number(e.target.value);
          UpdateSettings();
        });
      } else {
        $("#TXKT_Signing_WaitingTime").on("input", function (e) {
          AutoSignConfig.TXKT_Signing_WaitingTime = Number(e.target.value);
          UpdateSettings();
        });
        $("#TXKT_Ansering_IsRandom").on("click", function (e) {
          var IsOpen = !!!$(e.target)
            .attr("class")
            .match(/Setting_On/g);
          $(e.target).addClass(!IsOpen ? "Setting_Off" : "Setting_On");
          $(e.target).removeClass(!IsOpen ? "Setting_On" : "Setting_Off");
          AutoSignConfig.TXKT_Ansering_IsRandom = IsOpen;
          UpdateSettings();
        });
        $("#TXKT_Ansering_IsOpen").on("click", function (e) {
          var IsOpen = !!!$(e.target)
            .attr("class")
            .match(/Setting_On/g);
          $(e.target).addClass(!IsOpen ? "Setting_Off" : "Setting_On");
          $(e.target).removeClass(!IsOpen ? "Setting_On" : "Setting_Off");
          AutoSignConfig.TXKT_Ansering_IsOpen = IsOpen;
          UpdateSettings();
        });
        $("#TXKT_Ansering_WaitingTime").on("input", function (e) {
          AutoSignConfig.TXKT_Ansering_WaitingTime = Number(e.target.value);
          UpdateSettings();
        });
        $("#TXKT_Repeater_IsOpen").on("click", function (e) {
          var IsOpen = !!!$(e.target)
            .attr("class")
            .match(/Setting_On/g);
          $(e.target).addClass(!IsOpen ? "Setting_Off" : "Setting_On");
          $(e.target).removeClass(!IsOpen ? "Setting_On" : "Setting_Off");
          AutoSignConfig.TXKT_Repeater_IsOpen = IsOpen;
          UpdateSettings();
        });
        $("#TXKT_Repeater_WaitingTime").on("input", function (e) {
          AutoSignConfig.TXKT_Repeater_WaitingTime = Number(e.target.value);
          UpdateSettings();
        });
        $("#TXKT_Repeater_MaxWaitingCount").on("input", function (e) {
          AutoSignConfig.TXKT_Repeater_MaxWaitingCount = Number(e.target.value);
          UpdateSettings();
        });
      }
      $("#AutoSignSettingIcon").on("dblclick", function (e) {
        if (window.confirm("你确定要删除已有设置吗？")) {
          AutoSignConfig = DefaultConfig;
          UpdateSettings();
          box("设置清理", "清除成功！即刻生效");
          createSettingsWindow();
          return true;
        } else {
          return false;
        }
      });
    } else {
      document.getElementById("AutoSignSettingFrame").innerHTML = updateUI();
    }
  }
  if (top.location == self.location) {
    $(document).ready(function () {
      GM_addStyle(`
#preloading, #react-body,.headbanner_new,.wrap1200.clearfix,#to_top,.foot{
-webkit-transition:.7s filter;
-o-transition:.7s filter;
-moz-transition:.7s filter;
transition:.7s filter;
}
.TaoMain{
color:aliceblue;
}
#AutoSignSettingIcon {
position: fixed;
left: 50%;
top: -48px;
margin-left: -132px;
z-index: 99999999999;
background-size: 100% 100%;
-webkit-box-sizing: border-box;
box-sizing: border-box;
-webkit-transition: 0.7s;
-webkit-transition-delay: 0.2s;
-o-transition: 0.7s;
-o-transition-delay: 0.2s;
transition: 0.7s;
transition-delay: 0.2s;
padding: 0;
cursor: pointer;
width: 60px;
height: 60px;
border: 4px solid #00000096;
border-radius: 50%;
background: url('https://pic.thtown.cn/images/2022/03/30/202203302056151.png') no-repeat center center;
-webkit-transform: rotate(0deg);
-ms-transform: rotate(0deg);
transform: rotate(0deg);
}
.Setting_ul {
margin: 5px;
}
.Setting_btn {
border-radius: 50%;
width: 20px;
height: 20px;
border: none;
}
.Setting_On {
background-color: green;
}
.Setting_Off {
background-color: red;
}
.TaoMain{
z-index: 9999999999;
position: fixed;
top: 65px;
left: 50%;
}
.TaoTotal {
-webkit-box-sizing: border-box;
box-sizing: border-box;
min-width:264px;
opacity:0;
margin-left: -132px;
display:none;
border-radius: 3px;
border: 1px solid #000000;
-webkit-box-shadow: -2px 2px 5px rgba(0,0,0,0.3);
box-shadow: -2px 2px 5px rgba(0,0,0,0.3);
background:rgb(226 131 121 / 80%);
width: -webkit-fit-content;
width: -moz-fit-content;
width: fit-content;
padding: 15px;
overflow-y:hidden ;
}
.TaoTotal>fieldset {
margin: auto;
display: -webkit-box;
display: -ms-flexbox;
display: flex;
-webkit-box-orient: vertical;
-webkit-box-direction: normal;
justify-content: space-around;
-ms-flex-direction: column;
flex-direction: column;
-ms-flex-pack: distribute;
items-align: center;
margin: auto;
}
.SettingTitle {
font-size: 15px;
-webkit-transition: 0.5s;
-o-transition: 0.5s;
transition: 0.5s;
}
#fieldsetAll>fieldset:hover>div {
-o-transition: height 0.5s;
transition: height 0.5s;
-webkit-transition: height 0.5s;
height: 55px;
}
#fieldsetAll{
max-height: 403px;
overflow-y:hidden ;
}
fieldset{
padding: .35em .625em .75em;
border: 1px solid silver;
}
#fieldsetAll>fieldset>div {
-o-transition: height 0.5s;
-o-transition-delay: 0.5s;
transition: height 0.5s;
transition-delay: 0.5s;
-webkit-transition: height 0.5s;
-webkit-transition-delay: 0.5s;
height: 0;
overflow: hidden;
}
.SettingTitle:hover {
color: red;
font-size: 18px;
cursor: help;
-webkit-transition: 0.7s;
-webkit-transition-duration: 0.7s;
-o-transition: 0.7s;
-o-transition-duration: 0.7s;
transition: 0.7s;
transition-duration: 0.7s;
}
.Setting_Choice>label {
margin: auto;
}
input.Setting_input {
text-align: center;
-moz-text-align-last: center;
text-align-last: center;
margin: 0 2px;
vertical-align: middle;
}
input.Setting_input[type="number"] {
width: 70px;
color:blue;
}
#fieldsetAll>fieldset {
margin: 5px;
}
hr.MyScript {
margin: 0 auto;
border: groove;
}
#react-body{
transition: .2s filter;
filter:none;
}
#AutoSignSettingFrame{
font-size: 14px;
line-height: 1.5;
font-family: system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Droid Sans,Helvetica Neue,Microsoft YaHei UI,Microsoft YaHei,Hiragino Sans GB,Source Han Sans CN,Fira Sans,arial,sans-serif;
}
`);
      createSettingsWindow();
    });
  }

  function b64en(str) {
    return btoa(encodeURIComponent(str));
  }

  function b64de(str) {
    return decodeURIComponent(atob(str));
  }
  window.T2STEST = function () {
    window.T2S("这里是语音测试，如果声音大小，或是语速不合适请修改参数。");
  };

  $(document).ready(function () {
    URLChoicer(false);
  });

  function ke() {
    if ($(".ke_loading").length !== 0) {
      console.log("等待加载完成");
      setTimeout(function () {
        ke();
      }, 2000);
      return;
    }

    if ($(".im-dialog-bd-msg").length !== 0) {
      console.log("错误！\n" + $(".im-dialog-bd-msg").text());
      TXKTloading = 0;
      window.location.reload();
      return;
    }
    if (location.href.match(/vid=\d+/) !== null) {
      console.log("录播");
      return;
    }

    function auto_sign(timeout = 5000) {
      if (auto_sign_interval) {
        clearInterval(auto_sign_interval);
      }
      auto_sign_interval = setInterval(function () {
        try {
          if ($(".tip").length !== 0) {
            if ($(".tip")[0].innerText.match(/签到/)) {
              if ($(".btn-group")[0] !== undefined) {
                if (auto_sign_interval) {
                  clearInterval(auto_sign_interval);
                }
                $(".btn-group")[0].children[0].click();
                setTimeout(function () {
                  $(".btn-group")[0].children[0].click();
                  sign_times++;
                  window.T2S(
                    "自动签到插件，签到成功！本节课累积已为您签到，" +
                      String(sign_times) +
                      "次。"
                  );
                  box(
                    "签到成功！",
                    "自动签到插件，签到成功！\n本节课累积已为您签到，" +
                      String(sign_times) +
                      "次。",
                    60
                  );
                  console.log(
                    "%c【腾讯课堂自动签到插件】%c\n于 %s %c签到成功！\n本节课累积已为您签到%c" +
                      String(sign_times) +
                      "次%c！",
                    "color:white;background-color:blue;font-size:20px",
                    "color:red;font-size:20px",
                    new Date().toLocaleTimeString(),
                    "color:black",
                    "color:red;font-size:20px",
                    "color:black"
                  );
                  auto_sign(Number(AutoSignConfig.TXKT_Signing_WaitingTime));
                }, 500);
              }
            }
          }
        } catch (e) {}
      }, timeout);
    }

    function auto_Repeater(waitetime = 1000, maxtimes = 7) {
      if (auto_Repeater_timeout) {
        clearTimeout(auto_Repeater_timeout);
        auto_Repeater_timeout = 0;
      }
      function AIreplace(str = "") {
        return str.replace(/（|）| |、|。|，"/g, function (matchStr) {
          var tokenMap = {
            "（": "(",
            "）": ")",
            " ": "",
            "、": "",
            "。": ".",
            "，": ","
          };
          return tokenMap[matchStr];
        });
      }
      var arr = document.querySelectorAll(".js-chat-item-msg-content span");
      var i = 0;
      var arrlength = arr.length - 1;
      var wordnow = "";
      if (arrlength + 1 >= maxtimes) {
        try {
          while (
            i < arrlength &&
            AIreplace(arr[arrlength - i].innerHTML.trim()) ===
              AIreplace(arr[arrlength - 1 - i].innerHTML.toString().trim())
          ) {
            if (
              AIreplace(arr[arrlength - i].innerHTML.toString().trim()) ==
              AIreplace(blacklist)
            ) {
              i = -2;
              break;
            }
            i++;
          }
          wordnow = arr[arrlength].innerHTML.toString().trim();
          if (i + 1 >= maxtimes) {
            console.log(
              "有效重复：" + (i + 1) + "次\n有效词：“" + wordnow + "”"
            );
            if (!document.querySelector("div.ql-blank")) {
              document.querySelector(".ql-editor").innerHTML = "";
            }
            var a = setInterval(function () {
              try {
                document.querySelector(
                  "div.ql-blank"
                ).firstElementChild.innerHTML = wordnow;
                clearInterval(a);
                setTimeout(function () {
                  document.querySelector("button.text-editor-btn").click();
                  repeat_times++;
                  console.log(
                    "%c【腾讯课堂·复读机】%c\n于 %s %c复读成功！\n本节课累积已为您复读%c" +
                      String(repeat_times) +
                      "次%c！\n本次复读内容：%c" +
                      wordnow,
                    "color:white;background-color:blue;font-size:20px",
                    "color:red;font-size:20px",
                    new Date().toLocaleTimeString(),
                    "color:black",
                    "color:red;font-size:20px",
                    "color:black",
                    "color:red;font-size:20px"
                  );
                }, 1000);
              } catch (e) {}
            }, 1);
            blacklist = wordnow;
            i = -3;
          }
        } catch (e) {
          console.error("未知错误！\n请复制错误信息提交反馈====>>\n\n", e);
        }
      } else {
        i = -1;
      }
      console.log(
        "复读机检测，检测状态：正常，\n" +
          (i === -1
            ? "评论不足" +
              String(maxtimes) +
              "条，当前条数：" +
              String(arrlength + 1) +
              "\n等待10秒"
            : i === -2
            ? "黑名单词组“" + blacklist + "”\n等待10秒"
            : i === -3
            ? "复读成功！，当前词组：“" + wordnow + "”\n等待10秒"
            : i === 0
            ? "无重复，当前词组：“" + wordnow + "”"
            : "重复条数：" + String(i + 1) + "，当前词组：“" + wordnow + "”")
      );
      if (i === -3) {
        box("回复复读机", "复读成功！，当前词组：“" + wordnow + "”");
      }
      if (i === -1 || i === -2 || i === -3) {
        auto_Repeater_timeout = setTimeout(function () {
          auto_Repeater(
            Number(AutoSignConfig.TXKT_Repeater_WaitingTime),
            Number(AutoSignConfig.TXKT_Repeater_MaxWaitingCount)
          );
        }, 10000);
      } else {
        auto_Repeater_timeout = setTimeout(function () {
          auto_Repeater(
            Number(AutoSignConfig.TXKT_Repeater_WaitingTime),
            Number(AutoSignConfig.TXKT_Repeater_MaxWaitingCount)
          );
        }, waitetime);
      }
    }
    function reloading() {
      if (self.fetch) {
        try {
          var cid = location.href.match(/cid=\d+/)[0].match(/\d+/)[0];
          var tid = location.href.match(/term_id=\d+/)[0].match(/\d+/)[0];
          fetch(
            "https://ke.qq.com/cgi-bin/pubAccount/getLiveInfo?course_id=" +
              cid +
              "&term_id=" +
              tid,
            { method: "GET" }
          )
            .then(function (response) {
              return response.json();
            })
            .then(function (j) {
              switch (j.result.offline_status) {
                case 1:
                  console.log("直播中！立即刷新");
                  box("直播状态更新！", "直播中！即将刷新！");
                  window.location.reload();
                  break;
                case 2:
                  console.log("直播结束（有可能是未开课），继续监视");
                  setTimeout(reloading, 10000);
                  break;
                case 3:
                  console.log("直播状态错误，刷新试试？（其实没啥用）");
                  window.location.reload();
                  break;
                case 4:
                  console.log("老师网挂了继续监视");
                  setTimeout(reloading, 10000);
                  break;
              }
            })
            .catch(function (err) {
              console.log("网络请求错误！", err);
              console.log("5秒后刷新");
              setTimeout(function () {
                window.location.reload();
              }, 5000);
            });
        } catch (e) {
          console.error("错误！（有可能是链接不对叭）错误信息==>" + e);
          setTimeout(function () {
            window.location.reload();
          }, 10000);
        }
      } else {
        setTimeout(function () {
          window.location.reload();
        }, 10000);
      }
      return;
    }
    if ($(".ke_overlay") === null || $(".ke_overlay").length === 0) {
      if ($(".video-mask.video-play-btn") !== null) {
        $(".video-mask.video-play-btn").click();
      }
      console.group("[%c腾讯课堂插件%c开启情况]", "color:red;", "color:black;");
      if (AutoSignConfig.TXKT_Signing_WaitingTime) {
        console.log(
          "%c【腾讯课堂·自动签到】%c功能已%c开启",
          "color:red",
          "color:black",
          "background-color:green;color:white;"
        );
        setTimeout(function () {
          auto_sign(Number(AutoSignConfig.TXKT_Signing_WaitingTime));
        }, 1);
      } else {
        console.log(
          "%c【腾讯课堂·自动签到】%c功能已%c关闭",
          "color:red",
          "color:black",
          "background-color:red;color:white;"
        );
      }

      if (AutoSignConfig.TXKT_Repeater_IsOpen) {
        console.log(
          "%c【腾讯课堂·自动复读】%c功能已%c开启",
          "color:red",
          "color:black",
          "background-color:green;color:white;"
        );
        setTimeout(function () {
          auto_Repeater(
            Number(AutoSignConfig.TXKT_Repeater_WaitingTime),
            Number(AutoSignConfig.TXKT_Repeater_MaxWaitingCount)
          );
        }, 1);
      } else {
        console.log(
          "%c【腾讯课堂·自动复读】%c功能已%c关闭",
          "color:red",
          "color:black",
          "background-color:red;color:white;"
        );
      }
      console.groupEnd("[腾讯课堂插件开启情况]");
      box(
        "腾讯课堂插件加载成功！",
        "【自动签到】·" +
          (AutoSignConfig.TXKT_Signing_WaitingTime ? "开启" : "关闭") +
          "\n【自动复读】·" +
          (AutoSignConfig.TXKT_Repeater_IsOpen ? "开启" : "关闭")
      );
    } else {
      if (TXKTloading >= 10) {
        box("直播检测开启", "未检测到直播消息，\n开始检测直播服务器状态！");
        setTimeout(reloading, 10000);
        return;
      } else {
        TXKTloading++;
        setTimeout(function () {
          URLChoicer(true);
        }, 100);
        return;
      }
    }
  }
}
})();
