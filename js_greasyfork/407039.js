// ==UserScript==
// @name            小米路由器web端灯光控制
// @name:en         MIRouter Indicator Light Control
// @namespace       https://github.com/zixuan945/MIRouter-Indicator-Light-Control
// @version         0.2.3
// @description     为小米路由器web端添加开关指示灯功能
// @description:en  Add web control for mi router indicator light
// @author          zixuan
// @icon            data:image/png;base64,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
// @match           http://192.168.31.1/cgi-bin/luci/;stok=*
// @match           http://miwifi.com/cgi-bin/luci/;stok=*
// @require         https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js

// @downloadURL https://update.greasyfork.org/scripts/407039/%E5%B0%8F%E7%B1%B3%E8%B7%AF%E7%94%B1%E5%99%A8web%E7%AB%AF%E7%81%AF%E5%85%89%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/407039/%E5%B0%8F%E7%B1%B3%E8%B7%AF%E7%94%B1%E5%99%A8web%E7%AB%AF%E7%81%AF%E5%85%89%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  // 添加灯泡CSS样式
  let style = document.createElement("style");
  style.type = "text/css";
  let text = document.createTextNode(`#lampadario{position:fixed;left:90%;top:0;z-index:999}#filo{position:relative;background-color:#000;width:2px;height:150px;left:50%;margin-left:-1px;z-index:1;-webkit-transform-origin:0 0;-moz-transform-origin:0 0;-ms-transform-origin:0 0;-o-transform-origin:0 0;transform-origin:0 0;-webkit-animation:oscillaFilo .9s ease-in-out 0s infinite alternate;-moz-animation:oscillaFilo .9s ease-in-out 0s infinite alternate;-ms-animation:oscillaFilo .9s ease-in-out 0s infinite alternate;-o-animation:oscillaFilo .9s ease-in-out 0s infinite alternate;animation:oscillaFilo .9s ease-in-out 0s infinite alternate}
#filo:after{content:" ";left:-5px;top:100%;position:absolute;border-bottom:15px solid #000;border-left:4px solid transparent;border-right:4px solid transparent;height:0;width:4px}
#lampadina{position:relative}input[value="off"]:checked~#filo{-webkit-box-shadow:-80px -10px 7px 0 rgba(0,0,0,0.1);-moz-box-shadow:-80px -10px 7px 0 rgba(0,0,0,0.1);-ms-box-shadow:-80px -10px 7px 0 rgba(0,0,0,0.1);-o-box-shadow:-80px -10px 7px 0 rgba(0,0,0,0.1);box-shadow:-80px -10px 7px 0 rgba(0,0,0,0.1)}
input[value="off"]:checked~#filo:after{-webkit-box-shadow:-80px -10px 10px -2px rgba(0,0,0,0.1);-moz-box-shadow:-80px -10px 10px -2px rgba(0,0,0,0.1);-ms-box-shadow:-80px -10px 10px -2px rgba(0,0,0,0.1);-o-box-shadow:-80px -10px 10px -2px rgba(0,0,0,0.1);box-shadow:-80px -10px 10px -2px rgba(0,0,0,0.1)}
input{position:absolute;width:90px;height:70px;top:150px;margin-left:-45px;opacity:0;z-index:1;cursor:pointer}input[value="on"]{top:150px}input[value="off"]{top:-100px}
input[value="on"]:checked{top:-100px}input[value="on"]:checked+input[value="off"]{top:150px}label{width:51px;height:51px;top:164px;position:absolute;left:0;margin-left:-24px;-webkit-border-radius:100%;-moz-border-radius:100%;-ms-border-radius:100%;-o-border-radius:100%;border-radius:100%;-webkit-animation:oscillaLampadina .9s ease-in-out 0s infinite alternate;-moz-animation:oscillaLampadina .9s ease-in-out 0s infinite alternate;-ms-animation:oscillaLampadina .9s ease-in-out 0s infinite alternate;-o-animation:oscillaLampadina .9s ease-in-out 0s infinite alternate;animation:oscillaLampadina .9s ease-in-out 0s infinite alternate}
input[value="off"]:checked~label{background:rgba(255,255,255,0.03);-webkit-box-shadow:inset 0 1px 5px rgba(255,255,255,0.1),inset 0 2px 20px rgba(255,255,255,0.07),-80px -15px 15px -5px rgba(0,0,0,0.1);-moz-box-shadow:inset 0 1px 5px rgba(255,255,255,0.1),inset 0 2px 20px rgba(255,255,255,0.07),-80px -15px 15px -5px rgba(0,0,0,0.1);-ms-box-shadow:inset 0 1px 5px rgba(255,255,255,0.1),inset 0 2px 20px rgba(255,255,255,0.07),-80px -15px 15px -5px rgba(0,0,0,0.1);-o-box-shadow:inset 0 1px 5px rgba(255,255,255,0.1),inset 0 2px 20px rgba(255,255,255,0.07),-80px -15px 15px -5px rgba(0,0,0,0.1);box-shadow:inset 0 1px 5px rgba(255,255,255,0.1),inset 0 2px 20px rgba(255,255,255,0.07),-80px -15px 15px -5px rgba(0,0,0,0.1)}
input[value="on"]:checked~label{background:rgba(255,255,255,1);-webkit-box-shadow:0 0 10px rgba(255,255,255,0.8),0px 0 30px rgba(255,255,255,0.8),0px 0 50px rgba(255,255,255,0.6),0px 0 70px rgba(255,255,255,0.6),-80px -15px 120px 0 rgba(255,255,255,0.4);-moz-box-shadow:0 0 10px rgba(255,255,255,0.8),0px 0 30px rgba(255,255,255,0.8),0px 0 50px rgba(255,255,255,0.6),0px 0 70px rgba(255,255,255,0.6),-80px -15px 120px 0 rgba(255,255,255,0.4);-ms-box-shadow:0 0 10px rgba(255,255,255,0.8),0px 0 30px rgba(255,255,255,0.8),0px 0 50px rgba(255,255,255,0.6),0px 0 70px rgba(255,255,255,0.6),-80px -15px 120px 0 rgba(255,255,255,0.4);-o-box-shadow:0 0 10px rgba(255,255,255,0.8),0px 0 30px rgba(255,255,255,0.8),0px 0 50px rgba(255,255,255,0.6),0px 0 70px rgba(255,255,255,0.6),-80px -15px 120px 0 rgba(255,255,255,0.4);box-shadow:0 0 10px rgba(255,255,255,0.8),0px 0 30px rgba(255,255,255,0.8),0px 0 50px rgba(255,255,255,0.6),0px 0 70px rgba(255,255,255,0.6),-80px -15px 120px 0 rgba(255,255,255,0.4)}
input[value="off"]:checked~label:after{content:" ";width:15px;height:15px;top:0;position:absolute;left:0;margin-left:15px;-webkit-border-radius:100%;-moz-border-radius:100%;-ms-border-radius:100%;-o-border-radius:100%;border-radius:100%;border:2px solid rgba(255,255,255,0.03)}
#sorpresa{position:fixed;top:0;left:0;width:100%}input[value="off"]:checked~#lampadina #sorpresa{opacity:0}input[value="on"]:checked~#lampadina #sorpresa{opacity:1}
#footer{position:fixed;width:94%;text-align:center;bottom:30%;padding:0 3%;z-index:1}#shadow{position:fixed;width:94%;text-align:center;bottom:29%;padding:0 3%;color:rgba(0,0,0,0);-webkit-text-shadow:0 0 4px rgba(0,0,0,0.3);-moz-text-shadow:0 0 4px rgba(0,0,0,0.3);-ms-text-shadow:0 0 4px rgba(0,0,0,0.3);-o-text-shadow:0 0 4px rgba(0,0,0,0.3);text-shadow:0 0 4px rgba(0,0,0,0.3);-webkit-transform-origin:50% 0;-moz-transform-origin:50% 0;-ms-transform-origin:50% 0;-o-transform-origin:50% 0;transform-origin:50% 0;-webkit-animation:ombraTesto .9s ease-in-out 0s infinite alternate;-moz-animation:ombraTesto .9s ease-in-out 0s infinite alternate;-ms-animation:ombraTesto .9s ease-in-out 0s infinite alternate;-o-animation:ombraTesto .9s ease-in-out 0s infinite alternate;animation:ombraTesto .9s ease-in-out 0s infinite alternate}
@-webkit-keyframes oscillaFilo{from{-webkit-transform:rotate(5deg)}to{-webkit-transform:rotate(-5deg)}}@-moz-keyframes oscillaFilo{from{-moz-transform:rotate(5deg)}to{-moz-transform:rotate(-5deg)}}@-ms-keyframes oscillaFilo{from{-ms-transform:rotate(5deg)}
to{-ms-transform:rotate(-5deg)}}@-o-keyframes oscillaFilo{from{-o-transform:rotate(5deg)}to{-o-transform:rotate(-5deg)}}@keyframes oscillaFilo{from{transform:rotate(5deg)}to{transform:rotate(-5deg)}}@-webkit-keyframes oscillaLampadina{from{-webkit-transform:rotate(3deg) translate(-16.4px,-1px)}
to{-webkit-transform:rotate(-3deg) translate(16.4px,-1px)}}@-moz-keyframes oscillaLampadina{from{-moz-transform:rotate(3deg) translate(-16.4px,-1px)}to{-moz-transform:rotate(-3deg) translate(16.4px,-1px)}
}@-ms-keyframes oscillaLampadina{from{-ms-transform:rotate(3deg) translate(-16.4px,-1px)}to{-ms-transform:rotate(-3deg) translate(16.4px,-1px)}}@-o-keyframes oscillaLampadina{from{-o-transform:rotate(3deg) translate(-16.4px,-1px)}
to{-o-transform:rotate(-3deg) translate(16.4px,-1px)}}@keyframes oscillaLampadina{from{transform:rotate(3deg) translate(-16.4px,-1px)}to{transform:rotate(-3deg) translate(16.4px,-1px)}}@-webkit-keyframes ombraTesto{from{-webkit-transform:translate(1px,0px) scale(1.01,1.06) skew(0.9deg,0deg)}
to{-webkit-transform:translate(-1px,0px) scale(1.01,1.06) skew(-0.9deg,0deg)}}@-moz-keyframes ombraTesto{from{-moz-transform:translate(1px,0px) scale(1.01,1.06) skew(0.9deg,0deg)}to{-moz-transform:translate(-1px,0px) scale(1.01,1.06) skew(-0.9deg,0deg)}
}@-ms-keyframes ombraTesto{from{-ms-transform:translate(1px,0px) scale(1.01,1.06) skew(0.9deg,0deg)}to{-ms-transform:translate(-1px,0px) scale(1.01,1.06) skew(-0.9deg,0deg)}}@-o-keyframes ombraTesto{from{-o-transform:translate(1px,0px) scale(1.01,1.06) skew(0.9deg,0deg)}
to{-o-transform:translate(-1px,0px) scale(1.01,1.06) skew(-0.9deg,0deg)}}@keyframes ombraTesto{from{transform:translate(1px,0px) scale(1.01,1.06) skew(0.9deg,0deg)}to{transform:translate(-1px,0px) scale(1.01,1.06) skew(-0.9deg,0deg)}
}`);
  style.append(text);
  text = "input:disabled{ cursor:not-allowed; }";
  style.append(text);
  document.head.append(style);

  // 添加灯泡div
  let div = document.createElement("div");
  div.id = "lampadario";
  div.innerHTML = `<input type="radio" name="switch" value="on"/> <input type="radio" name="switch" value="off" checked="checked"/> <label for="switch"></label> <div id="filo"></div> <div id="lampadina"> <div id="sorpresa"> </div> </div>`;
  document.body.prepend(div);

  let inputElement = document.querySelectorAll("input[name=switch]");
  let href = window.location.href;
  let origin = window.location.origin;
  let token = href.match("stok=(.*?)(?=/)")[1];
  let url_led = `${origin}/cgi-bin/luci/;stok=${token}/api/misystem/led`;
  let count = 0;
  const maxCount = 5; //最大点击次数
  //添加通知
  let link = document.createElement("link");
  link.href = "https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css";
  link.rel = "stylesheet";
  document.head.append(link);
  // eslint-disable-next-line no-undef
  var notyf = new Notyf({
    duration: 3000,
    position: {
      x: "right",
      y: "top",
    },
    types: [
      {
        type: "error",
        background: "indianred",
        // duration: 5000,
        dismissible: true,
        icon: false,
      },
    ],
  });

  inputElement.forEach((input) => input.addEventListener("change", onChange));
  statusInitialize();

  async function getStatus(url) {
    let response = await fetch(url);
    let statusCode = await response.json();
    return statusCode;
  }

  function statusInitialize() {
    let statusCode = getStatus(url_led);
    statusCode.then((value) => {
      if (value.code === 0) {
        // {status: 0, code: 0} status:0 灯关 1 灯开
        // inputElement[0].checked = true 对应灯开
        inputElement[0].checked = value.status;
        notyf.success("灯泡状态已初始化完成");
      }
      if (value.code === 401) {
        // {code: 401, msg: "Invalid token"}
        notyf.error(`token不正确，请重新登录`);
        setTimeout(() => {
          window.location.href = origin;
        }, 3000);
      }
    });

    //TODO:将开关灯代码抽象出来
    //学习节流和防抖的区别，限制click点击频率
  }

  function onChange() {
    let checked = document.querySelector("[name=switch]:checked");
    let url = url_led + (checked.value === "on" ? "?on=1" : "?on=0");
    count++;

    if (count <= maxCount) {
      getStatus(url);
      //TODO:增加getStatus的状态检测以及切换成功的对话框提示
    } else {
      //获取input的checked状态，并赋给常亮防止被修改
      const inputChecked = inputElement[0].checked;
      //设置元素不可点击
      inputElement.forEach((input) => (input.disabled = true));
      //保证两个input的checked属性相反，如果均为false则灯泡不显示
      inputElement[0].checked = !inputChecked;
      inputElement[1].checked = inputChecked;
      notyf.error("您点击得太频繁了，功能已被禁用！");
      // alert('您点击得太频繁了，功能已被禁用！')
    }
  }
})();
