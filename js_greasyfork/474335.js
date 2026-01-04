// ==UserScript==
// @name        TJ_crack
// @namespace   Violentmonkey Scripts
// @match       *://ids.tongji.edu.cn:8443/nidp/app/login*
// @connect     api.shinoai.com
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @version     0.1.1
// @author      Shinoai Kyoka
// @license     MIT
// @description 2023/8/31 16:16:43
// @downloadURL https://update.greasyfork.org/scripts/474335/TJ_crack.user.js
// @updateURL https://update.greasyfork.org/scripts/474335/TJ_crack.meta.js
// ==/UserScript==

var a = document.getElementById("reg");
var hook = a.onclick;
function globalErrorHandle(msg, url, l, c, error) {
  console.error("global js error: ", msg);
  if (msg.message === "Uncaught timeout") {
    hook();
    a.disabled = false;
    a.style.cursor = null;
  }
}
window.onerror = globalErrorHandle;

(async function () {
  "use strict";
  console.log("use strict");
  a.onclick = () => {
    a.disabled = true;
    a.style.cursor = "not-allowed";
    // 首先请求验证码图片，然后向后端发送请求并接收从后端返回的验证码，将前端验证码元素修改后调用元素的提交函数即可
    CrackCode();
  };
})();

async function CrackCode() {
  let times = 1;
  do {
    console.log(`第${times}次尝试：`);
    times += 1;
    var raw_json = await getCode();
    // console.log(raw_json);
    var point = await sendCode(raw_json);
    if (!point) continue;
    var res = await checkCode(point.enc, raw_json.token);
    // console.log(res);
  } while (!point || res.repCode != "0000");
  let validatecode = await genCode(raw_json, point.point);
  //   console.log(validatecode);
  subbmit(validatecode);
}

const getCode = () =>
  //访问地址获得验证码图片
  new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://ids.tongji.edu.cn:8443/nidp/app/login?sid=0&sid=0/getCaptcha=1",
      onload: function (res) {
        var responseText = res.responseText; //返回结果
        var obj = JSON.parse(responseText);
        resolve(obj.repData);
        // sendCode(obj.repData);
      },
    });
  });

const sendCode = (d) =>
  //将图片发送至后台获取坐标
  new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://api.shinoai.com/something/tj_crack",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(d),
      timeout: 2000,
      onload: function (res) {
        if (res.responseText != "null") {
          var obj = JSON.parse(res.responseText);
          resolve(obj);
        }
        resolve();
      },
      ontimeout: function (res) {
        console.log("timeout, use default method");
        throw "timeout";
      },
    });
  });

const checkCode = (code, token) =>
  new Promise((resolve, reject) => {
    var d = {
      token: token,
      pointJson: code,
    };
    // console.log(d);
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://ids.tongji.edu.cn:8443/nidp/app/login?sid=0&sid=0/checkCaptcha=1",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(d),
      onload: function (res) {
        var obj = JSON.parse(res.responseText);
        resolve(obj);
      },
    });
  });

const genCode = (raw, point) =>
  new Promise((resolve, reject) => {
    var d = {
      secretKey: raw.secretKey,
      token: raw.token,
      point: point,
    };
    // console.log(d);
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://api.shinoai.com/something/tj_check",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(d),
      onload: function (res) {
        var responseText = res.responseText; //返回结果
        resolve(responseText.substring(1, responseText.length - 1));
      },
      onerror: function (res) {},
    });
  });

const subbmit = (code) => {
  var c = document.getElementById("validatecode");
  c.value = code;
  loginSubmit();
};
