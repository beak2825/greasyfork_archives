// ==UserScript==
// @name         黄推杀手
// @namespace    npm/vite-plugin-monkey/pornkiller
// @version      1.7
// @author       TechLeadMall
// @description  帮助大家更好地使用twitter。 黄推数量过多，并且使用机器人到处引流发表与主题无关的回复，难以手工屏蔽。黄推杀手帮你一键屏蔽黄推，清洁推特环境。截止2023年12月6日，系统已收录超3500账户，90%以上为推友人工投票表决产生。
// @license      AGPL
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAC4jAAAuIwF4pT92AAAHamlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDEgNzkuYThkNDc1MywgMjAyMy8wMy8yMy0wODo1NjozNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKDIwMjMwNzI1Lm0uMjI1NCA5ZDJlZTk4KSAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0wOS0wOFQyMTo1NzoxMiswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDktMDhUMjI6MjU6MTMrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDktMDhUMjI6MjU6MTMrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmFhOWIwODY0LTU5YmMtZjY0My04ZjYwLTk5ZjEwNDI0NjZjNyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjRmODM2NWU3LTcyMGUtY2I0ZS05MWI1LTgzZjk4YmY2M2FhMyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjFlYmZlY2JjLWM3NjItOTA0NC04NGRiLTFjYjUyYWQwY2FjYiI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MWViZmVjYmMtYzc2Mi05MDQ0LTg0ZGItMWNiNTJhZDBjYWNiIiBzdEV2dDp3aGVuPSIyMDIzLTA5LTA4VDIxOjU3OjEyKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjUuMCAoMjAyMzA3MjUubS4yMjU0IDlkMmVlOTgpICAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MTAzMDE0OGEtYTgxYS00ZTRlLWI1ZWItOWQyZDk1ZjAxMTAxIiBzdEV2dDp3aGVuPSIyMDIzLTA5LTA4VDIyOjIyOjIyKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjUuMCAoMjAyMzA3MjUubS4yMjU0IDlkMmVlOTgpICAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmFhOWIwODY0LTU5YmMtZjY0My04ZjYwLTk5ZjEwNDI0NjZjNyIgc3RFdnQ6d2hlbj0iMjAyMy0wOS0wOFQyMjoyNToxMyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKDIwMjMwNzI1Lm0uMjI1NCA5ZDJlZTk4KSAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuS3NMgAAAYYSURBVGiB7ZptbFRVGsd/5557Z1q2tAWJ2UiAgqXb0ijBuFk/mDUad/lg3F3Jmqy8yIpGEGM0EMWQZkGBlShK1rhbXGlocFkiGtBd4gaNH9ZEE7WKirZQWiwddiW+0BdKX+bee85+OHfamTtTW+aSdkj2n5xk7sxzTv7PeZ77PP977gitNZczrMkmEBUidD0buBeoDX7zJpxRbtiABr4EGoDO0Qw3AmcD40IcZwOOWbgCOFIABMc7jgScAZDA+wVA6mLH+4CUwArgoRxRKbTyFL5fZwHtNsaBdOjf3zvHr66Ki+5zLiI8bYKhNZRPdzjeOqQbG05LMh1ZYQNz0if89q6r/D27FwkYkLgFEgRHAMV+X7/rv7b/v3baL3NsMnuBrq0qFjBg0dQD8QJpE0MKrseqrSpWr5nUTkXBsgnV+vNdLngaYhZYk5w/KcQs8LThlgkva4tFinSBZA8wzEXk2NACyZH8Ec0BEYykMnmauh7LfkiZOWPZjwP22CY/AC+I7dxiw6RzIFhVZKegSLO/eoqpj52D5lrm70X+EfA1FFtQ9SP95ke93uEPuz1qShQlMohGGikL812JhJoS/c8Pur03m3o9qqZoiqwRxybMgSD0/swi/difTnu3/bJJ3L74Y7l261cu80p944Q/kiKDCqbaMK/MX7253f3V4o/Fbb9oEnX1CU/PLFJRUik/B4YUzC7myHtd+pnHWyVGT4n6J0/Glqz63Gd+uU+5A64yY1oMKsv9X9/9mffXP7Y7gb3ctu6E/fZHvTCryKw5YQ4AaBDmcS5978ShPQln5cPNHnPLfGIWxAW6Yqq/7MFj3j9eTsRC9ggVXuLikJ8DcQsSAyy+eYZ4sK7SJfOWFXufPxVbcs9Rn5oZPtVX+nesOOr//S8dYfJ63Zb57q03ToPEQN5dP78qFAhaKzFovbClWn5zNpl8dXdnOkFxqPGM84fKElcpeONv/3HC5Jc+UJF8tq7Kpq3XGl5zwhwAUyp7XDjZLQ+8tJB7pjrJxp3tDiNRFVvqjsdyzFT3b7jafXH7ApsTXZJ+BfEcZXeciHQPELfggg+neuSe5xbYd66aFU6nrFlLV8825Nu6JQO+WSOCbInWiTVGaJ33oPl7eaDhOmfT07WjOaG37qx19+1a5PDl95ILvpkb8VjnEmkhPaxcPW/0gww3qYxthM4bRjQHUh22zIHq6f5vljd52zaeCN+wKYgnNrQ4S1Z+4lE9TVFqGz0UcQvzn57qsKUSKsr8pWuP+W/sy642hErsob1nnOUPfWH6RIk0a0QISP5VyNNQ7sDcUv+OlZ96r+/NalJ6y47apPK12LShOd0xse+FDqe/z08e3HMtdPRKev280yo/BwLt4s0sUmsebfZzkV+6Zo5bt77SBviitc99taEzw4lDjYnYmh/H3T8/MU/I830WgryqUf5aqKKYf73znW7YcSqcNmr1hsrkvvqFkuZvJS3fyQO7F8pV6+clgXTBI17c3ua89e9zmlnFJpXyQCQ5HYtLyNw39bs1Fe6u7TU2bV3mVCOp4FS3bNixwL7zvtluyAntOEKj9ASr0bgFnYMsvqHM2vx8jYclFJZQ65/6ibu/vtbmxDlJnweOZUaPB61d8sBL19iPbJ3vYqGQQm2rX+Dd+tMyyZnBSdBCAIkBsem+mc7PF5UqDdzys7IYbb3CyIO0DhuXpmO398qdj1VYt980TUlLcNN1pQ6n+0XGmhPiAJiqkdRwsl/cXD1FAtDSFxAOyQOtR2RHywVxS02JRGlovWBSJ0Jji/ZMbAlDIBE826bSIKeQwAhAGHl2jqiDIKoDMKKHUp/HsuUi7MeBy/5cKCsCWqWOwYh8ZnPJkDosVNkhswk5MXW6Y3J1SIElJ4Le2BhSYAvDLRO2Tag7Hmvp11CkuB4LN5rQuiTQmF5CkTLcMru+DXQA81PfHHzla2t5/KhfXR2n51ySQnjDUTY9xvHjQ/rgK1+HU6IDYBm530GpAhu5OC4DE5J3RzEo5PEuaelUDhwuAFLjHYcDzllYh3kLPtkERxudAcdhhPvAfmAKcG1wXUh/NQD4HMNxGOL//1aZZPwP5Jlg/vKbmTIAAAAASUVORK5CYII=
// @match        https://twitter.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.3.11/dist/vue.global.prod.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.4.3/dist/index.full.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js
// @require      https://cdn.jsdelivr.net/npm/axios@1.6.2/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/jsencrypt@3.3.2/bin/jsencrypt.min.js
// @resource     element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.4.3/dist/index.css
// @connect      cyberworld.win
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/482972/%E9%BB%84%E6%8E%A8%E6%9D%80%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/482972/%E9%BB%84%E6%8E%A8%E6%9D%80%E6%89%8B.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const i=document.createElement("style");i.textContent=e,document.head.append(i)})(" .read-the-docs[data-v-8765c6f2]{color:#888}.smallnotice{font-size:10px}.login{height:400px;width:360px;text-align:center}.title{margin:20px auto 30px;text-align:center;color:#707070}.login-form .el-input{height:38px}.login-form .input-icon{height:39px;width:14px;margin-left:2px}.login-form{border-radius:6px;background:#ffffff;width:300px;padding:0}.login-tip{font-size:13px;text-align:center;color:#bfbfbf}.login-code{width:50%;height:38px;float:right}.login-code img{cursor:pointer;vertical-align:middle}.login-code-img{height:38px}.el-input__wrapper{height:25px;line-height:25px}.el-input-number.is-without-controls .el-input__inner{width:100px;line-height:20px;height:16px}.h5bbx7_1 /deep/ .el-input-number--mini{width:80px;line-height:26px}.h5bbx7_1 /deep/ .el-input-number .el-input__inner{width:80px;height:24px;padding:0 28px}.h5bbx7_1 /deep/ .el-input-number__decrease:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled),.h5bbx7_1 /deep/ .el-input-number__increase:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled){border-color:#eee}.h5bbx7_1 /deep/ .el-input-number__increase{height:24px;width:24px}.h5bbx7_1 /deep/ .el-input-number__decrease{width:24px;height:24px} ");

(function (vue, ElementPlus, Cookies, JSEncrypt, $, axios) {
  'use strict';

  const TokenKey = "Admin-Token";
  function getToken() {
    return localStorage.getItem(TokenKey);
  }
  function setToken(token) {
    return localStorage.setItem(TokenKey, token);
  }
  const errorCode = {
    "401": "认证失败，无法访问系统资源",
    "403": "当前操作没有权限",
    "404": "访问资源不存在",
    "default": "系统未知错误，请反馈给管理员"
  };
  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  const baseURL = "https://twitter.cyberworld.win/server";
  function request(params) {
    var json = JSON.stringify(params.data);
    return new Promise(function(resolve, reject) {
      _GM.xmlHttpRequest({
        method: params.method,
        url: baseURL + params.url,
        data: json,
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + getToken()
        },
        onload: function(res) {
          try {
            var resJsonObject = JSON.parse(res.responseText);
            const code = resJsonObject.code || 200;
            const msg = errorCode[code] || resJsonObject.msg || errorCode["default"];
            if (code === 401) {
              setToken("");
              ElementPlus.ElMessage({
                message: "需重新登录",
                duration: 3e3,
                type: "error"
              });
              return reject("无效的会话，或者会话已过期，请重新登录。");
            } else if (code === 403) {
              ElementPlus.ElMessageBox.confirm(
                "体验额度已用完，尚未开通会员功能，是否开通？若确认已开通，可点右下角退出再重新登录。",
                "提示",
                {
                  confirmButtonText: "确认",
                  cancelButtonText: "取消",
                  type: "success"
                }
              ).then(() => {
                window.open("https://twitter.cyberworld.win/web/index?adminToken=" + getToken());
              }).catch(() => {
              });
              return Promise.reject("error");
            } else if (code === 500) {
              ElementPlus.ElMessage({
                message: msg,
                duration: 5 * 1e3,
                type: "error"
              });
              return reject(new Error(msg));
            } else if (code === 601) {
              ElementPlus.ElMessage({
                message: msg,
                duration: 5 * 1e3,
                type: "warning"
              });
              return reject("error");
            } else if (code !== 200) {
              ElementPlus.ElMessage({
                message: msg,
                duration: 5 * 1e3,
                type: "error"
              });
              return reject("error");
            } else {
              resolve(resJsonObject);
              return res.data;
            }
          } catch (err) {
            reject(err);
          }
        },
        onerror: function(err) {
          reject(err);
        }
      });
    });
  }
  function login(username, password, code, uuid) {
    const data = {
      username,
      password,
      code,
      uuid
    };
    return request({
      url: "/login",
      headers: {
        isToken: false
      },
      method: "post",
      data
    });
  }
  function getCount() {
    return request({
      url: "/twitter/porn/getCount",
      method: "get"
    });
  }
  function register(data) {
    return request({
      url: "/register",
      headers: {
        isToken: false
      },
      method: "post",
      data
    });
  }
  function getInfo() {
    return request({
      url: "/getInfo",
      method: "get"
    });
  }
  function getCodeImg() {
    return request({
      url: "/captchaImage",
      headers: {
        isToken: false
      },
      method: "get",
      timeout: 2e4
    });
  }
  const publicKey = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKoR8mX0rGKLqzcWmOzbfj64K8ZIgOdH\nnzkXSOVOZbFu/TJhZ7rFAN+eaGkl3C4buccQd/EjEsj9ir7ijT7h96MCAwEAAQ==";
  function encrypt(txt) {
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey);
    return encryptor.encrypt(txt);
  }
  function getPornList(kind) {
    return request({
      url: "/twitter/porn/getPornList/" + kind,
      method: "get"
    });
  }
  function updateUserBlock(data) {
    return request({
      url: "/twitter/porn/updateUserBlockList",
      method: "post",
      data
    });
  }
  function updateUserResume(data) {
    return request({
      url: "/twitter/porn/updateUserResumeList",
      method: "post",
      data
    });
  }
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("element-plus/dist/index.css");
  JSON.parse(Cookies.get("num") ?? "{}");
  async function delay(time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
  async function requestList(kind) {
    return new Promise((resolve, reject) => {
      getPornList(kind).then((res) => {
        if (res.data != null) {
          if (kind == "resume") {
            localStorage.setItem("resumeList", JSON.stringify(res.data));
          } else {
            localStorage.setItem("list", JSON.stringify(res.data));
          }
        }
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  }
  async function updateUserBlockSync(data) {
    return new Promise((resolve, reject) => {
      updateUserBlock(data).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  }
  async function updateUserResumeSync(data) {
    return new Promise((resolve, reject) => {
      updateUserResume(data).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  }
  async function simulateHumanDelay() {
    var requestCount = localStorage.getItem("requestCount");
    requestCount++;
    localStorage.setItem("requestCount", requestCount);
    await delay(100 + Math.ceil(Math.floor(Math.random() * 100)));
  }
  function get_cookie(cname) {
    const name = cname + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; ++i) {
      const c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  const ajax = axios.create({
    baseURL: "https://api.twitter.com",
    withCredentials: true,
    headers: {
      Authorization: "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
      "X-Twitter-Auth-Type": "OAuth2Session",
      "X-Twitter-Active-User": "yes",
      "X-Csrf-Token": get_cookie("ct0")
    }
  });
  async function block_user(id) {
    try {
      var data = { user_id: id };
      var result = await ajax.post("/1.1/blocks/create.json", {
        user_id: id
      }, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
    } catch (err) {
      throw err;
    }
  }
  async function resume_user(id) {
    try {
      var data = { user_id: id };
      var result = await ajax.post("https://twitter.com/i/api/1.1/blocks/destroy.json", {
        user_id: id
      }, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
    } catch (err) {
      throw err;
    }
  }
  async function fireEvent(config) {
    if (config.run) {
      var requestCount = 0;
      var alreadyBlockNum = 0;
      var exceptionNum = 0;
      var isOver = false;
      if (config.blockRobotTweeter == true || config.blockScamTweeter == true || config.blockPornTweeter == true) {
        while (!isOver) {
          await simulateHumanDelay();
          for (let j = 0; j < 1; j++) {
            await delay(800);
            const authenticateHtml = $('iframe[id="arkose_iframe"]');
            if (authenticateHtml != null && authenticateHtml.length > 0) {
              ElementPlus.ElNotification({
                title: "提示",
                message: "需先进行机器人校验",
                duration: 0,
                type: "warning"
              });
              return;
            }
          }
          var blockListJson = localStorage.getItem("list");
          var isValidBlockList = false;
          try {
            if (blockListJson != void 0) {
              var blockListValid = JSON.parse(blockListJson);
              if (blockListValid.length > 0 && blockListValid[0].userId != void 0) {
                isValidBlockList = true;
              }
            }
          } catch (e) {
          }
          var ret = { msg: "no more data" };
          if (!isValidBlockList) {
            if (ret != void 0 && ret.msg == "no more data" && config.blockRobotTweeter == true)
              ret = await requestList("robot");
            if (ret != void 0 && ret.msg == "no more data" && config.blockScamTweeter == true)
              ret = await requestList("scam");
            if (ret != void 0 && ret.msg == "no more data" && config.blockPornTweeter == true)
              ret = await requestList("common");
            if (ret != void 0 && ret.msg == "no more data") {
              if (config.backgroundRun) {
                await delay(6e3);
              } else {
                if (config.resumeTweeter != true)
                  config.run = false;
                ElementPlus.ElNotification({
                  title: "提示",
                  message: "完成任务，已禁" + alreadyBlockNum + "个黄推。",
                  duration: 0,
                  type: "success"
                });
              }
              break;
            }
          }
          blockListJson = localStorage.getItem("list");
          var blockList = JSON.parse(blockListJson);
          var newBlockList = JSON.parse(blockListJson);
          var blockOperData = [];
          if (blockList != void 0) {
            for (let i = 0; i < blockList.length; i++) {
              if (requestCount >= config.limitNum) {
                config.run = false;
                ElementPlus.ElNotification({
                  title: "提示",
                  message: "完成任务，已完成处理" + requestCount + "次。请稍后再启动程序。",
                  duration: 0,
                  type: "success"
                });
                await updateUserBlockSync(blockOperData);
                blockOperData = [];
                return;
              }
              let porn = blockList[i];
              var userId = porn.userId;
              if (userId == void 0) {
                continue;
              }
              var userName = porn.userName;
              if (userName == void 0) {
                continue;
              }
              try {
                if (!config.run) {
                  await updateUserBlockSync(blockOperData);
                  blockOperData = [];
                  isOver = true;
                  return;
                }
                requestCount++;
                await block_user(userId);
                blockOperData.push({ pornUserId: porn.userId, result: "1" });
                alreadyBlockNum++;
                if (config.backgroundRun) {
                } else {
                  if (!config.quietMode) {
                    ElementPlus.ElNotification({
                      title: "提示",
                      message: '已禁黄推"' + porn.displayName + '"。',
                      duration: 2e3,
                      type: "success"
                    });
                  }
                }
              } catch (e) {
                if (exceptionNum > 30) {
                  ElementPlus.ElNotification({
                    title: "提示",
                    message: "异常过多，请检查网络或是否有其他异常。重新启动。",
                    duration: 0,
                    type: "success"
                  });
                  config.run = false;
                  exceptionNum = 0;
                  isOver = true;
                }
                if (e.response != void 0 && e.response.data != void 0 && e.response.data.errors != void 0 && e.response.data.errors[0] != void 0) {
                  if (e.response.data.errors[0].message == "User not found.") {
                    blockOperData.push({ pornUserId: porn.userId, result: "6" });
                  } else {
                    exceptionNum++;
                    if (e.response.data.errors[0].message == "Could not authenticate you.") {
                      ElementPlus.ElNotification({
                        title: "提示",
                        message: "请求次数过多，建议等待一会再运行系统，刷新页面。重新启动",
                        duration: 0,
                        type: "success"
                      });
                      config.run = false;
                      isOver = true;
                      blockOperData.push({ pornUserId: porn.userId, result: "8" });
                    } else {
                      blockOperData.push({ pornUserId: porn.userId, result: "9" });
                    }
                  }
                } else {
                  exceptionNum++;
                  blockOperData.push({ pornUserId: porn.userId, result: "7" });
                }
              }
              newBlockList.shift();
              localStorage.setItem("list", JSON.stringify(newBlockList));
              await delay(200);
            }
            await updateUserBlockSync(blockOperData);
            blockOperData = [];
          }
        }
      }
    }
    var alreadyBlockNum = 0;
    isOver = false;
    blockOperData = [];
    if (config.resumeTweeter == true) {
      while (!isOver) {
        await simulateHumanDelay();
        for (let j = 0; j < 1; j++) {
          await delay(800);
          const authenticateHtml = $('iframe[id="arkose_iframe"]');
          if (authenticateHtml != null && authenticateHtml.length > 0) {
            ElementPlus.ElNotification({
              title: "提示",
              message: "需先进行机器人校验",
              duration: 0,
              type: "warning"
            });
            return;
          }
        }
        var blockListJson = localStorage.getItem("resumeList");
        var isValidBlockList = false;
        try {
          if (blockListJson != void 0) {
            var blockListValid = JSON.parse(blockListJson);
            if (blockListValid.length > 0 && blockListValid[0].userId != void 0) {
              isValidBlockList = true;
            }
          }
        } catch (e) {
        }
        var ret = { msg: "no more data" };
        if (!isValidBlockList) {
          if (ret != void 0 && ret.msg == "no more data" && config.resumeTweeter == true)
            ret = await requestList("resume");
          if (ret != void 0 && ret.msg == "no more data") {
            if (config.backgroundRun) {
              await delay(6e3);
            } else {
              config.run = false;
              ElementPlus.ElNotification({
                title: "提示",
                message: "完成任务，已禁" + alreadyBlockNum + "个黄推。",
                duration: 0,
                type: "success"
              });
            }
            return;
          }
        }
        blockListJson = localStorage.getItem("resumeList");
        var blockList = JSON.parse(blockListJson);
        var newBlockList = JSON.parse(blockListJson);
        if (blockList != void 0) {
          for (let i = 0; i < blockList.length; i++) {
            if (requestCount >= config.limitNum) {
              config.run = false;
              ElementPlus.ElNotification({
                title: "提示",
                message: "完成任务，已完成处理" + requestCount + "次。请稍后再启动程序。",
                duration: 0,
                type: "success"
              });
              await updateUserResumeSync(blockOperData);
              blockOperData = [];
              return;
            }
            let porn = blockList[i];
            var userId = porn.userId;
            if (userId == void 0) {
              continue;
            }
            var userName = porn.userName;
            if (userName == void 0) {
              continue;
            }
            try {
              if (!config.run) {
                isOver = true;
                await updateUserResumeSync(blockOperData);
                blockOperData = [];
                return;
              }
              requestCount++;
              await resume_user(userId);
              blockOperData.push({ pornUserId: porn.userId, result: "1" });
              alreadyBlockNum++;
              if (config.backgroundRun) {
              } else {
                if (!config.quietMode) {
                  ElementPlus.ElNotification({
                    title: "提示",
                    message: '已恢复误删名单"' + porn.displayName + '"。',
                    duration: 2e3,
                    type: "success"
                  });
                }
              }
            } catch (e) {
              if (exceptionNum > 50) {
                ElementPlus.ElNotification({
                  title: "提示",
                  message: "异常过多，请检查网络或是否有其他异常。重新启动。",
                  duration: 0,
                  type: "success"
                });
                config.run = false;
                exceptionNum = 0;
                isOver = true;
              }
              exceptionNum++;
              if (e.response != void 0 && e.response.data != void 0 && e.response.data.errors != void 0 && e.response.data.errors[0] != void 0) {
                if (e.response.data.errors[0].message == "User not found.") {
                  blockOperData.push({ pornUserId: porn.userId, result: "6" });
                } else {
                  if (e.response.data.errors[0].message == "Could not authenticate you.") {
                    ElementPlus.ElNotification({
                      title: "提示",
                      message: "请求次数过多，建议等待一会再运行系统，刷新页面。重新启动",
                      duration: 0,
                      type: "success"
                    });
                    config.run = false;
                    isOver = true;
                    blockOperData.push({ pornUserId: porn.userId, result: "8" });
                  } else {
                    blockOperData.push({ pornUserId: porn.userId, result: "9" });
                  }
                }
              } else {
                blockOperData.push({ pornUserId: porn.userId, result: "7" });
              }
            }
            newBlockList.shift();
            localStorage.setItem("resumeList", JSON.stringify(newBlockList));
            await delay(200);
          }
          await updateUserResumeSync(blockOperData);
          blockOperData = [];
        }
      }
    }
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const cookie = JSON.parse(localStorage.getItem("num") ?? "{}");
  const cookieConfig = JSON.parse(localStorage.getItem("config") ?? "{}");
  function generateUUID() {
    var timestamp = Date.now();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (timestamp + Math.random() * 16) % 16 | 0;
      timestamp = Math.floor(timestamp / 16);
      var v = c == "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
    return uuid;
  }
  const _sfc_main$1 = vue.defineComponent({
    name: "PopupView",
    data() {
      return {
        activeTabName: localStorage.getItem("activeTabName") ?? "common",
        robotNum: cookie.robotNum ?? 0,
        scamNum: cookie.scamNum ?? 0,
        commonNum: cookie.commonNum ?? 0,
        resumeNum: cookie.resumeNum ?? 0,
        config: JSON.stringify(cookieConfig) != "{}" ? cookieConfig : {
          dialogVisible: true,
          backgroundRun: false,
          token: "",
          blockRobotTweeter: true,
          blockScamTweeter: false,
          blockPornTweeter: false,
          run: false,
          overTime: "",
          running: false,
          limitNum: 300,
          quietMode: false,
          resumeTweeter: false,
          tweetNum: 10,
          loopMinute: 10,
          onlyGetTweet: false,
          runHideFunc: false
        },
        codeUrl: "",
        loginForm: {
          username: "",
          password: "",
          rememberMe: true,
          code: "",
          uuid: "",
          isAgreedPrivacy: true
        },
        loginRules: {
          username: [
            { required: true, trigger: "blur", message: "请输入您的邮箱账号" }
          ],
          password: [
            { required: true, trigger: "blur", message: "请输入您的密码" }
          ],
          code: [{ required: true, trigger: "change", message: "请输入验证码" }]
        },
        loading: false,
        // 验证码开关
        captchaEnabled: false,
        // 注册开关
        register: false,
        redirect: void 0,
        loadingRegister: false
      };
    },
    watch: {
      config: {
        handler: function(val, oldVal) {
          localStorage.setItem("config", JSON.stringify(val));
        },
        deep: true
      },
      activeTabName: {
        handler: function(val, oldVal) {
          localStorage.setItem("activeTabName", val);
        }
      },
      "config.run": function(newQuestion, oldQuestion) {
        getCount().then((res) => {
          this.robotNum = res.data.robotNum;
          this.scamNum = res.data.scamNum;
          this.commonNum = res.data.commonNum;
          this.resumeNum = res.data.resumeNum;
          localStorage.setItem("num", JSON.stringify({
            robotNum: res.data.robotNum,
            scamNum: res.data.scamNum,
            commonNum: res.data.commonNum,
            resumeNum: res.data.resumeNum
          }));
        }).catch((error) => {
          console.log(error);
        });
      }
    },
    async created() {
      _GM_registerMenuCommand("打开黄推杀手", this.showDialog, "o");
      var token = getToken();
      if (token == void 0 || token == "")
        ;
      else {
        getCount().then((res) => {
          this.robotNum = res.data.robotNum;
          this.scamNum = res.data.scamNum;
          this.commonNum = res.data.commonNum;
          this.resumeNum = res.data.resumeNum;
          localStorage.setItem("num", JSON.stringify({
            robotNum: res.data.robotNum,
            scamNum: res.data.scamNum,
            commonNum: res.data.commonNum,
            resumeNum: res.data.resumeNum
          }));
        }).catch((error) => {
          console.log(error);
        });
      }
      this.getCookie();
    },
    methods: {
      showDialog() {
        this.config.dialogVisible = true;
      },
      anonymousLogin() {
        var that = this;
        ElementPlus.ElMessageBox.confirm(
          "匿名登录账户无法进行多设备状态同步，且若登录状态失效（一般情况下不会失效），需重头开始屏蔽。",
          "提示",
          {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "success"
          }
        ).then(() => {
          that.registerForm = {};
          that.registerForm.username = generateUUID() + "@random.com";
          that.registerForm.password = generateUUID().substring(0, 20);
          register(that.registerForm).then((res) => {
            login(that.registerForm.username, that.registerForm.password, "", "").then((res2) => {
              setToken(res2.token);
              that.config.token = getToken();
              console.log(that.config.token);
              that.loading = false;
              getCount().then((res3) => {
                that.robotNum = res3.data.robotNum;
                that.scamNum = res3.data.scamNum;
                that.commonNum = res3.data.commonNum;
                that.resumeNum = res3.data.resumeNum;
                localStorage.setItem("num", JSON.stringify({
                  robotNum: res3.data.robotNum,
                  scamNum: res3.data.scamNum,
                  commonNum: res3.data.commonNum,
                  resumeNum: res3.data.resumeNum
                }));
              }).catch((error) => {
                console.log(error);
              });
            }).catch((error) => {
              this.loading = false;
              if (this.captchaEnabled) {
                this.getCode();
              }
            });
          }).catch(() => {
            this.loading = false;
          });
        }).catch(() => {
        });
      },
      handleRegister() {
        window.open("https://twitter.cyberworld.win/web/register");
      },
      getCode() {
        getCodeImg().then((res) => {
          this.captchaEnabled = res.captchaEnabled === void 0 ? true : res.captchaEnabled;
          if (this.captchaEnabled) {
            this.codeUrl = "data:image/gif;base64," + res.img;
            this.loginForm.uuid = res.uuid;
          }
        });
      },
      getCookie() {
      },
      handleLogin() {
        var that = this;
        if (this.loginForm.isAgreedPrivacy) {
          this.$refs.loginForm.validate((valid) => {
            if (valid) {
              this.loading = true;
              if (this.loginForm.rememberMe) {
                localStorage.setItem("username", this.loginForm.username);
                localStorage.setItem("password", encrypt(this.loginForm.password));
                localStorage.setItem("rememberMe", this.loginForm.rememberMe);
              } else {
                localStorage.removeItem("username");
                localStorage.removeItem("password");
                localStorage.removeItem("rememberMe");
              }
              var userInfo = this.loginForm;
              const username = userInfo.username.trim();
              const password = userInfo.password;
              const code = userInfo.code;
              const uuid = userInfo.uuid;
              login(username, password, code, uuid).then((res) => {
                setToken(res.token);
                that.config.token = getToken();
                console.log(that.config.token);
                that.loading = false;
                getCount().then((res2) => {
                  that.robotNum = res2.data.robotNum;
                  that.scamNum = res2.data.scamNum;
                  that.commonNum = res2.data.commonNum;
                  that.resumeNum = res2.data.resumeNum;
                  localStorage.setItem("num", JSON.stringify({
                    robotNum: res2.data.robotNum,
                    scamNum: res2.data.scamNum,
                    commonNum: res2.data.commonNum,
                    resumeNum: res2.data.resumeNum
                  }));
                }).catch((error) => {
                  console.log(error);
                });
              }).catch((error) => {
                this.loading = false;
                if (this.captchaEnabled) {
                  this.getCode();
                }
              });
            }
          });
        }
      },
      runKiller(run) {
        this.config.run = !run;
        if (this.config.run) {
          fireEvent(this.config);
        }
      },
      runHideFuncMonitor(runHideFunc) {
        var that = this;
        getInfo().then((res) => {
          let isFound = res.roles.indexOf("advance");
          if (isFound > 0) {
            that.config.runHideFunc = !runHideFunc;
            if (that.config.runHideFunc) {
              var query = { active: true, currentWindow: true };
              chrome.tabs.query(query, function callback(tabs) {
                var currentTab = tabs[0];
                if (currentTab.url.indexOf("twitter.com") < 0) {
                  window.open("https://twitter.cyberworld.win/web/index");
                  chrome.tabs.create({
                    url: "https://twitter.com/home"
                  });
                }
              });
            }
          } else {
            ElementPlus.ElMessageBox.confirm(
              "体验额度已用完，尚未开通会员功能，是否开通？若确认已开通，可点右下角退出再重新登录。",
              "提示",
              {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "success"
              }
            ).then(() => {
              window.open("https://twitter.cyberworld.win/web/index");
            }).catch(() => {
            });
          }
        }).catch((error) => {
        });
      },
      openPrivacyUrl() {
        window.open("https://twitter.cyberworld.win/web/privacy");
      },
      openTelegramUrl() {
        window.open("https://t.me/PornTwitterKiller");
      },
      openTwitterUrl() {
        window.open("https://twitter.com/PornKiller2023");
      },
      openTwitterPoster() {
      },
      openTweetPoster() {
        window.open("https://twitter.com/PornKiller2023/status/1717184498373370239");
      },
      openGithubPage() {
        window.open("https://github.com/TechLeadMall/PornKiller");
      },
      openWaitPage(kind) {
        window.open("https://twitter.cyberworld.win/web/twitter/pornWait?kind=" + kind + "&adminToken=" + this.config.token);
      },
      openHiddenPage() {
        window.open("https://twitter.cyberworld.win/web/twitter/hiddenReply");
      },
      logoutSystem() {
        setToken("");
        this.config.token = "";
        this.config.run = false;
      }
    }
  });
  const _withScopeId = (n) => (vue.pushScopeId("data-v-8765c6f2"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = {
    key: 0,
    class: "login"
  };
  const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("h3", { class: "title" }, "黄推杀手工具", -1));
  const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "1em",
    viewBox: "0 0 448 512"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", { d: "M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" })
  ], -1));
  const _hoisted_4 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "1em",
    viewBox: "0 0 448 512"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", { d: "M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" })
  ], -1));
  const _hoisted_5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "1em",
    viewBox: "0 0 512 512"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", { d: "M269.4 2.9C265.2 1 260.7 0 256 0s-9.2 1-13.4 2.9L54.3 82.8c-22 9.3-38.4 31-38.3 57.2c.5 99.2 41.3 280.7 213.6 363.2c16.7 8 36.1 8 52.8 0C454.7 420.7 495.5 239.2 496 140c.1-26.2-16.3-47.9-38.3-57.2L269.4 2.9zM144 221.3c0-33.8 27.4-61.3 61.3-61.3c16.2 0 31.8 6.5 43.3 17.9l7.4 7.4 7.4-7.4c11.5-11.5 27.1-17.9 43.3-17.9c33.8 0 61.3 27.4 61.3 61.3c0 16.2-6.5 31.8-17.9 43.3l-82.7 82.7c-6.2 6.2-16.4 6.2-22.6 0l-82.7-82.7c-11.5-11.5-17.9-27.1-17.9-43.3z" })
  ], -1));
  const _hoisted_6 = { class: "login-code" };
  const _hoisted_7 = ["src"];
  const _hoisted_8 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("a", { style: { "text-decoration": "underline" } }, "使用政策", -1));
  const _hoisted_9 = { key: 0 };
  const _hoisted_10 = { key: 1 };
  const _hoisted_11 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", null, "立即注册", -1));
  const _hoisted_12 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", null, "匿名登录", -1));
  const _hoisted_13 = { style: { "background-color": "#f0f0f0", "width": "100%" } };
  const _hoisted_14 = { key: 1 };
  const _hoisted_15 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { style: { "width": "40px" } }, null, -1));
  const _hoisted_16 = { key: 0 };
  const _hoisted_17 = { key: 1 };
  const _hoisted_18 = { style: { "margin-bottom": "10px", "text-align": "center" } };
  const _hoisted_19 = { style: { "margin-bottom": "20px", "text-align": "center", "margin-left": "-10px" } };
  const _hoisted_20 = { key: 0 };
  const _hoisted_21 = { key: 1 };
  const _hoisted_22 = { style: { "background-color": "#f0f0f0", "margin-top": "-30px" } };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_input = vue.resolveComponent("el-input");
    const _component_el_form_item = vue.resolveComponent("el-form-item");
    const _component_el_checkbox = vue.resolveComponent("el-checkbox");
    const _component_el_button = vue.resolveComponent("el-button");
    const _component_el_form = vue.resolveComponent("el-form");
    const _component_el_link = vue.resolveComponent("el-link");
    const _component_el_tooltip = vue.resolveComponent("el-tooltip");
    const _component_el_col = vue.resolveComponent("el-col");
    const _component_el_row = vue.resolveComponent("el-row");
    const _component_el_input_number = vue.resolveComponent("el-input-number");
    const _component_el_switch = vue.resolveComponent("el-switch");
    const _component_el_text = vue.resolveComponent("el-text");
    const _component_el_tab_pane = vue.resolveComponent("el-tab-pane");
    const _component_el_tabs = vue.resolveComponent("el-tabs");
    const _component_el_dialog = vue.resolveComponent("el-dialog");
    return vue.openBlock(), vue.createElementBlock("div", null, [
      vue.createVNode(_component_el_dialog, {
        modelValue: _ctx.config.dialogVisible,
        "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => _ctx.config.dialogVisible = $event),
        title: "操作面板(关闭后可从插件菜单再次打开)",
        width: "380",
        draggable: ""
      }, {
        default: vue.withCtx(() => [
          _ctx.config.token == null || _ctx.config.token == "" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
            vue.createVNode(_component_el_form, {
              ref: "loginForm",
              model: _ctx.loginForm,
              rules: _ctx.loginRules,
              class: "login-form",
              style: { "width": "90%", "text-align": "center", "margin-left": "10px" }
            }, {
              default: vue.withCtx(() => [
                _hoisted_2,
                vue.createVNode(_component_el_form_item, { prop: "username" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: _ctx.loginForm.username,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.loginForm.username = $event),
                      type: "text",
                      "auto-complete": "off",
                      placeholder: "账号"
                    }, {
                      prefix: vue.withCtx(() => [
                        _hoisted_3
                      ]),
                      _: 1
                    }, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { prop: "password" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: _ctx.loginForm.password,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.loginForm.password = $event),
                      type: "password",
                      "auto-complete": "off",
                      placeholder: "密码",
                      onKeyup: vue.withKeys(_ctx.handleLogin, ["enter", "native"])
                    }, {
                      prefix: vue.withCtx(() => [
                        _hoisted_4
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onKeyup"])
                  ]),
                  _: 1
                }),
                _ctx.captchaEnabled ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                  key: 0,
                  prop: "code"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: _ctx.loginForm.code,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.loginForm.code = $event),
                      "auto-complete": "off",
                      placeholder: "验证码",
                      style: { "width": "50%" },
                      onKeyup: vue.withKeys(_ctx.handleLogin, ["enter", "native"])
                    }, {
                      prefix: vue.withCtx(() => [
                        _hoisted_5
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onKeyup"]),
                    vue.createElementVNode("div", _hoisted_6, [
                      vue.createElementVNode("img", {
                        src: _ctx.codeUrl,
                        onClick: _cache[3] || (_cache[3] = (...args) => _ctx.getCode && _ctx.getCode(...args)),
                        class: "login-code-img"
                      }, null, 8, _hoisted_7)
                    ])
                  ]),
                  _: 1
                })) : vue.createCommentVNode("", true),
                vue.createVNode(_component_el_form_item, { style: { "width": "100%" } }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_checkbox, {
                      modelValue: _ctx.loginForm.isAgreedPrivacy,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => _ctx.loginForm.isAgreedPrivacy = $event),
                      style: { "margin": "0px 0px 0px 0px", "color": "black" },
                      onClick: _ctx.openPrivacyUrl
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("请先同意"),
                        _hoisted_8
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onClick"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { style: { "width": "100%" } }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_button, {
                      loading: _ctx.loading,
                      size: "medium",
                      type: "primary",
                      style: { "width": "100%" },
                      onClick: vue.withModifiers(_ctx.handleLogin, ["prevent"])
                    }, {
                      default: vue.withCtx(() => [
                        !_ctx.loading ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_9, "登 录")) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_10, "登 录 中..."))
                      ]),
                      _: 1
                    }, 8, ["loading", "onClick"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { style: { "width": "100%" } }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_button, {
                      size: "medium",
                      type: "success",
                      style: { "width": "100%" },
                      onClick: _ctx.handleRegister
                    }, {
                      default: vue.withCtx(() => [
                        _hoisted_11
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { style: { "width": "100%" } }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_button, {
                      size: "medium",
                      type: "info",
                      style: { "width": "100%" },
                      onClick: _ctx.anonymousLogin
                    }, {
                      default: vue.withCtx(() => [
                        _hoisted_12
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["model", "rules"]),
            vue.createElementVNode("div", _hoisted_13, [
              vue.createVNode(_component_el_row, {
                style: { "padding-top": "10px", "padding-bottom": "10px" },
                justify: "center"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_col, {
                    span: 6,
                    style: { "text-align": "center" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_tooltip, {
                        class: "box-item",
                        effect: "light",
                        content: "发现新黄推进入电报群发起投票，登记进系统名单。",
                        placement: "top"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_link, {
                            type: "primary",
                            style: { "font-size": "12px" },
                            onClick: _ctx.openTelegramUrl
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("电报")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_col, {
                    span: 6,
                    style: { "text-align": "center" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_tooltip, {
                        class: "box-item",
                        effect: "light",
                        content: "开发不易，点个关注吧。",
                        placement: "top"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_link, {
                            type: "primary",
                            style: { "font-size": "12px" },
                            onClick: _ctx.openTwitterUrl
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("推特")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_col, {
                    span: 6,
                    style: { "text-align": "center" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_tooltip, {
                        class: "box-item",
                        effect: "light",
                        content: "越多人转发推文，系统名单越齐全。",
                        placement: "top"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_link, {
                            type: "primary",
                            style: { "font-size": "12px" },
                            onClick: _ctx.openTweetPoster
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("转推")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_col, {
                    span: 6,
                    style: { "text-align": "center" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_tooltip, {
                        class: "box-item",
                        effect: "light",
                        content: "项目的贡献者以及源代码。",
                        placement: "top"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_link, {
                            type: "primary",
                            style: { "font-size": "12px" },
                            onClick: _ctx.openGithubPage
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("Github")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ])
          ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_14, [
            vue.createVNode(_component_el_tabs, {
              modelValue: _ctx.activeTabName,
              "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => _ctx.activeTabName = $event),
              class: "demo-tabs",
              onTabClick: _ctx.handleClick,
              type: "border-card"
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_tab_pane, {
                  label: "常用功能",
                  name: "common"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_form, {
                      ref: "loginForm",
                      model: _ctx.loginForm,
                      rules: _ctx.loginRules,
                      class: "login-form",
                      style: { "margin-top": "0px" }
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_form, {
                          model: _ctx.loginForm,
                          "label-width": "150px"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_el_tooltip, {
                              class: "box-item",
                              effect: "light",
                              content: "建议设置数量为300个，运行结束后可再次点击启动。",
                              placement: "bottom-end"
                            }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_form_item, { label: "屏蔽数量限制" }, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_input_number, {
                                      modelValue: _ctx.config.limitNum,
                                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => _ctx.config.limitNum = $event),
                                      min: 1,
                                      max: 500,
                                      step: 50,
                                      size: "small",
                                      style: { "height": "27px", "max-height": "27px", "line-height": "27px" }
                                    }, null, 8, ["modelValue"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            vue.createVNode(_component_el_tooltip, {
                              class: "box-item",
                              effect: "light",
                              content: "开启后，仅完成任务后提示被禁黄推数量。",
                              placement: "bottom-end"
                            }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_form_item, { label: "是否静默运行" }, {
                                  default: vue.withCtx(() => [
                                    _hoisted_15,
                                    vue.createVNode(_component_el_switch, {
                                      modelValue: _ctx.config.quietMode,
                                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => _ctx.config.quietMode = $event)
                                    }, null, 8, ["modelValue"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            vue.createVNode(_component_el_form_item, { label: "禁垃圾引流账户" }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_link, {
                                  type: "warning",
                                  style: { "font-size": "14px", "font-weight": "normal", "margin-left": "-20px", "width": "60px" },
                                  onClick: _cache[7] || (_cache[7] = ($event) => _ctx.openWaitPage("robot")),
                                  underline: false
                                }, {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode("（" + vue.toDisplayString(_ctx.robotNum) + "）", 1)
                                  ]),
                                  _: 1
                                }),
                                vue.createVNode(_component_el_switch, {
                                  modelValue: _ctx.config.blockRobotTweeter,
                                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => _ctx.config.blockRobotTweeter = $event)
                                }, null, 8, ["modelValue"])
                              ]),
                              _: 1
                            }),
                            vue.createVNode(_component_el_form_item, { label: "禁疑似诈骗黄推" }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_link, {
                                  type: "warning",
                                  style: { "font-size": "14px", "font-weight": "normal", "margin-left": "-20px", "width": "60px" },
                                  onClick: _cache[9] || (_cache[9] = ($event) => _ctx.openWaitPage("scam")),
                                  underline: false
                                }, {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode("（" + vue.toDisplayString(_ctx.scamNum) + "）", 1)
                                  ]),
                                  _: 1
                                }),
                                vue.createVNode(_component_el_switch, {
                                  modelValue: _ctx.config.blockScamTweeter,
                                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => _ctx.config.blockScamTweeter = $event)
                                }, null, 8, ["modelValue"])
                              ]),
                              _: 1
                            }),
                            vue.createVNode(_component_el_form_item, { label: "禁普通黄推" }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_link, {
                                  type: "success",
                                  style: { "font-size": "14px", "font-weight": "normal", "margin-left": "-20px", "width": "60px" },
                                  onClick: _cache[11] || (_cache[11] = ($event) => _ctx.openWaitPage("common")),
                                  underline: false
                                }, {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode("（" + vue.toDisplayString(_ctx.commonNum) + "）", 1)
                                  ]),
                                  _: 1
                                }),
                                vue.createVNode(_component_el_switch, {
                                  modelValue: _ctx.config.blockPornTweeter,
                                  "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => _ctx.config.blockPornTweeter = $event)
                                }, null, 8, ["modelValue"])
                              ]),
                              _: 1
                            }),
                            vue.createVNode(_component_el_form_item, { label: "恢复误删人员" }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_link, {
                                  type: "success",
                                  style: { "font-size": "14px", "font-weight": "normal", "margin-left": "-20px", "width": "60px" },
                                  onClick: _cache[13] || (_cache[13] = ($event) => _ctx.openWaitPage("resume")),
                                  underline: false
                                }, {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode("（" + vue.toDisplayString(_ctx.resumeNum) + "）", 1)
                                  ]),
                                  _: 1
                                }),
                                vue.createVNode(_component_el_switch, {
                                  modelValue: _ctx.config.resumeTweeter,
                                  "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => _ctx.config.resumeTweeter = $event)
                                }, null, 8, ["modelValue"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["model"])
                      ]),
                      _: 1
                    }, 8, ["model", "rules"]),
                    vue.createVNode(_component_el_form_item, { style: { "width": "100%" } }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_button, {
                          size: "medium",
                          type: "primary",
                          style: { "width": "100%", "margin-left": "20px", "margin-right": "20px", "text-align": "center" },
                          onClick: _cache[15] || (_cache[15] = ($event) => _ctx.runKiller(_ctx.config.run))
                        }, {
                          default: vue.withCtx(() => [
                            _ctx.config.run != true ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_16, "启动")) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_17, "暂停"))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_form_item, { style: { "margin-top": "-20px" } }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_text, {
                          type: "info",
                          size: "small"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("tips:发现新黄推可在下方电报群内发起投票。")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_tab_pane, {
                  label: "高级功能",
                  name: "advance"
                }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("div", _hoisted_18, [
                      vue.createVNode(_component_el_text, {
                        class: "mx-1",
                        size: "large"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("自动隐藏评论区机器人")
                        ]),
                        _: 1
                      })
                    ]),
                    vue.createVNode(_component_el_form, {
                      class: "login-form",
                      style: { "margin-top": "0px" }
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_form, {
                          model: _ctx.loginForm,
                          "label-width": "150px"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_el_tooltip, {
                              class: "box-item",
                              effect: "light",
                              content: "建议设置时间为10分钟，间隔过短可能导致异常。",
                              placement: "top",
                              style: {}
                            }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_form_item, { label: "循环时间间隔(分钟)" }, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_input_number, {
                                      modelValue: _ctx.config.loopMinute,
                                      "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => _ctx.config.loopMinute = $event),
                                      min: 1,
                                      max: 180,
                                      step: 5,
                                      size: "small",
                                      style: { "height": "27px", "max-height": "27px", "line-height": "27px" }
                                    }, null, 8, ["modelValue"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            vue.createVNode(_component_el_tooltip, {
                              class: "box-item",
                              effect: "light",
                              content: "当前最大推文数量10个。",
                              placement: "top"
                            }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_form_item, { label: "监控推文数量" }, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_input_number, {
                                      modelValue: _ctx.config.tweetNum,
                                      "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => _ctx.config.tweetNum = $event),
                                      min: 1,
                                      max: 10,
                                      step: 1,
                                      size: "small",
                                      style: { "height": "27px", "max-height": "27px", "line-height": "27px" }
                                    }, null, 8, ["modelValue"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["model"])
                      ]),
                      _: 1
                    }),
                    vue.createElementVNode("div", _hoisted_19, [
                      vue.createVNode(_component_el_link, {
                        type: "primary",
                        style: {},
                        underline: true,
                        onClick: _cache[18] || (_cache[18] = ($event) => _ctx.openHiddenPage())
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("查看已隐藏推文")
                        ]),
                        _: 1
                      })
                    ]),
                    vue.createVNode(_component_el_form_item, { style: { "width": "100%" } }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_button, {
                          size: "medium",
                          type: "primary",
                          style: { "width": "100%", "margin-left": "20px", "margin-right": "20px", "text-align": "center" },
                          onClick: _cache[19] || (_cache[19] = ($event) => _ctx.runHideFuncMonitor(_ctx.config.runHideFunc))
                        }, {
                          default: vue.withCtx(() => [
                            _ctx.config.runHideFunc != true ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_20, "启动监控")) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_21, "暂停监控"))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["modelValue", "onTabClick"]),
            vue.createElementVNode("div", _hoisted_22, [
              vue.createVNode(_component_el_row, {
                style: { "padding-top": "10px", "padding-bottom": "10px" },
                justify: "center"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_col, {
                    span: 6,
                    style: { "text-align": "center" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_tooltip, {
                        class: "box-item",
                        effect: "light",
                        content: "发现新黄推进入电报群发起投票，登记进系统名单。",
                        placement: "top"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_link, {
                            type: "primary",
                            style: { "font-size": "12px" },
                            onClick: _ctx.openTelegramUrl
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("电报")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_col, {
                    span: 6,
                    style: { "text-align": "center" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_tooltip, {
                        class: "box-item",
                        effect: "light",
                        content: "开发不易，点个关注吧。",
                        placement: "top"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_link, {
                            type: "primary",
                            style: { "font-size": "12px" },
                            onClick: _ctx.openTwitterUrl
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("推特")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_col, {
                    span: 6,
                    style: { "text-align": "center" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_tooltip, {
                        class: "box-item",
                        effect: "light",
                        content: "越多人转发推文，系统名单越齐全。",
                        placement: "top"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_link, {
                            type: "primary",
                            style: { "font-size": "12px" },
                            onClick: _ctx.openTweetPoster
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("转推")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_col, {
                    span: 6,
                    style: { "text-align": "center" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_link, {
                        type: "primary",
                        style: { "font-size": "12px" },
                        onClick: _ctx.logoutSystem
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("退出")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ])
          ]))
        ]),
        _: 1
      }, 8, ["modelValue"])
    ]);
  }
  const popup = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-8765c6f2"]]);
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(popup);
      };
    }
  };
  const app2 = vue.createApp(_sfc_main);
  app2.use(ElementPlus);
  app2.mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue, ElementPlus, Cookies, JSEncrypt, jQuery, axios);