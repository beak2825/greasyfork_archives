// ==UserScript==
// @name 天猫88会员领券脚本
// @version  1.4
// @namespace Violentmonkey Scripts
// @match  *://market.m.taobao.com/*
// @include *://market.m.taobao.com/*
// @grant none
// @description 天猫88会员领券辅助脚本
// @downloadURL https://update.greasyfork.org/scripts/423951/%E5%A4%A9%E7%8C%AB88%E4%BC%9A%E5%91%98%E9%A2%86%E5%88%B8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/423951/%E5%A4%A9%E7%8C%AB88%E4%BC%9A%E5%91%98%E9%A2%86%E5%88%B8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(x => {


  // window.alert = function () { return 1 }
  window.confirm = function () { return 1 }
  window.prompt = function () { return 1 }

  var init = () => {

    if (isURL("market.m.taobao.com")) {
      loadScript("https://cdn.bootcdn.net/ajax/libs/jquery/2.2.4/jquery.min.js", function () {
        loadScript("https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js", function () {
          setTimeout(function () {
            var btntxt = $(".btn").find(".btnText").text();
            $(".rax-scrollview").append("<div class='countDown' style='top: 0px;position: fixed;right: 0px;background-color: #8bb6ff;z-index: 999;color: #333;padding: 10px;width: 100%;text-align: center;'>正在初始化抢购</div>");
            if (btntxt == "已抢光") {
              var value = $.cookie("countdown");
              if (value == "1") {
                var text = `疯狂抢购中`;
                $(".countDown").text(text);
                location.reload();
                return;
              }
              countDown();
            } else {
              rob();
            }
          }, 400);
        })
      });
    }
  };


  // function synctbDate(){
  //   $.ajax({
  //     url: "http://api.m.taobao.com/res/api3.do?api=mtop.common.getTimestamp",
  //     type: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-type": "application/json"
  //     },
  //     dataType: 'json',
  //     success: function (res) {
  //       //res.data.t为String类型的时间戳，所以需要先转换成Integer类型，再转换为Date类型
  //       var t = new Date(parseInt(res.data.t));
  //       //获取Hours，也可以获取年、月、日、秒等等

  //       var a = "-";
  //       var e = t.getFullYear();
  //       var i = t.getMonth() + 1;
  //       var d = t.getDate();
  //       var h = t.getHours();
  //       var m = t.getMinutes();
  //       var s = t.getSeconds();
  //       if (i >= 1 && i <= 9) {
  //         i = "0" + i;
  //       }
  //       if (d >= 0 && d <= 9) {
  //         d = "0" + d;
  //       }
  //       if (h >= 0 && h <= 9) {
  //         h = "0" + h;
  //       }
  //       if (m >= 0 && m <= 9) {
  //         m = "0" + m;
  //       }
  //       if (s >= 0 && s <= 9) {
  //         s = "0" + s;
  //       }
  //       var n = e + a + i + a + d + " " + h + ":" + m + ":" + s;
  //       alert(n);
  //     }
  //   });
  // }

  init();


  function rob () {
    var m = 0;
    $.removeCookie("countdown");
    var cb = setInterval(() => {
      if (m >= 90) {
        clearInterval(cb);
        alert("抢购结束");
        return;
      }
      $(".btn").click();
      m += 1;
    }, 1000);
    // setTimeout(() => {
    //     var evt = $.Event('keydown', { keyCode: 13 });
    //     $(document).trigger(evt);
    // }, 500);
    // if (window.confirm('确定？')) {
    //     return true;
    // } else {
    //     return false;
    // }
  }

  function countDown () {
    setInterval(x => {
      var nowTime = getNowFormatDate();
      var am = parseInt(nowTime.substr(11, 2)) < 12;
      var pm = parseInt(nowTime.substr(11, 2)) > 12;

      if (pm) {
        //超过了20点的抢购时间，给系统明天的抢购日期
        endTime = getEndTime(2);
        console.log("pm", endTime)
      } else if (am) {
        endTime = getEndTime(1);
        console.log("am", endTime)
      }

      var result = time_different(nowTime, endTime);
      if (result.day == "0" && result.h == "0" && result.m == "0" && parseInt(result.s) <= 5) {
        $.cookie('countdown', '1');
        location.reload();
        return;
      }
      var text = `距离抢购时间:${result.day}天${result.h}小时${result.m}分${result.s}秒`;
      $(".countDown").text(text);
      // console.log(result);
    }, 1000);
  }

  function getEndTime (type) {
    var t = new Date();
    var a = "-";
    var e = t.getFullYear();
    var i = t.getMonth() + 1;
    var d = t.getDate();
    var h = t.getHours();
    var m = t.getMinutes();
    var s = t.getSeconds();

    if (i >= 1 && i <= 9) {
      i = "0" + i;
    }
    if (d >= 0 && d <= 9) {
      d = "0" + d;
    }
    if (h >= 0 && h <= 9) {
      h = "0" + h;
    }
    if (m >= 0 && m <= 9) {
      m = "0" + m;
    }
    if (s >= 0 && s <= 9) {
      s = "0" + s;
    }

    var n = "";
    if (type == 2) {
      n = e + a + i + a + d + " 19:59:58.999";
    } else if (type == 1) {
      n = e + a + i + a + d + " 09:59:58.999";
    }

    var taskTime = new Date(n);
    if (t > taskTime && type == 1) {
      n = e + a + i + a + d + " 19:59:58.999";
    }
    if (t > taskTime && type == 2) {
      n = e + a + i + a + (d + 1) + " 09:59:58.999";
    }
    // var n = e + a + i + a + d;
    return n;
  }



  function getNowFormatDate () {
    var t = new Date();
    var a = "-";
    var e = t.getFullYear();
    var i = t.getMonth() + 1;
    var d = t.getDate();
    var h = t.getHours();
    var m = t.getMinutes();
    var s = t.getSeconds();
    if (i >= 1 && i <= 9) {
      i = "0" + i;
    }
    if (d >= 0 && d <= 9) {
      d = "0" + d;
    }
    if (h >= 0 && h <= 9) {
      h = "0" + h;
    }
    if (m >= 0 && m <= 9) {
      m = "0" + m;
    }
    if (s >= 0 && s <= 9) {
      s = "0" + s;
    }
    var n = e + a + i + a + d + " " + h + ":" + m + ":" + s;
    // var n = e + a + i + a + d;
    return n;
  }


  function isURL (x) {
    return window.location.href.indexOf(x) != -1;
  }


  function loadScript (url, callback) {
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState) { //IE
      script.onreadystatechange = function () {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else { //Others
      script.onload = function () {
        callback();
      };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  }


  function time_different (date1, date2) {
    var date3 = new Date(date2).getTime() - new Date(date1).getTime();   //时间差的毫秒数      
    //------------------------------
    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000))

    //计算出小时数
    var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    var result = {};
    result.day = days;
    result.h = hours;
    result.m = minutes;
    result.s = seconds;

    // return days+" 天 "+hours+" 小时 "+minutes+" 分钟 "+seconds+" 秒";
    return result;
  }

})()