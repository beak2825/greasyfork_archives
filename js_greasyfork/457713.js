
// ==UserScript==
// @name         mpweixin-token
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  获取微信公众的token并提交至指定服务器
// @author       You
// @match        https://mp.weixin.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457713/mpweixin-token.user.js
// @updateURL https://update.greasyfork.org/scripts/457713/mpweixin-token.meta.js
// ==/UserScript==
// @license      MIT
(function() {
  const f = "mpweixin";
  console.log("%c [ VERSION ]", "0.0.1");
  const h = {
    setting: [
      "M512 697.6c102.4 0 182.4-83.2 182.4-185.6 0-102.4-83.2-185.6-182.4-185.6-102.4 0-182.4 83.2-182.4 185.6C329.6 614.4 412.8 697.6 512 697.6L512 697.6zM512 646.4c-73.6 0-134.4-60.8-134.4-134.4 0-73.6 60.8-134.4 134.4-134.4 73.6 0 134.4 60.8 134.4 134.4C646.4 585.6 585.6 646.4 512 646.4L512 646.4z",
      "M249.015232 843.178592c35.2 28.8 73.6 51.2 112 67.2 41.6-38.4 96-60.8 150.4-60.8 57.6 0 108.8 22.4 150.4 60.8 41.6-16 80-38.4 112-67.2-12.8-54.4-3.2-112 22.4-163.2 28.8-48 73.6-86.4 128-102.4 3.2-22.4 6.4-44.8 6.4-67.2 0-22.4-3.2-44.8-6.4-67.2-54.4-16-99.2-54.4-128-102.4-28.8-48-35.2-108.8-22.4-163.2-35.2-28.8-73.6-51.2-112-67.2-41.6 38.4-92.8 60.8-150.4 60.8-54.4 0-108.8-22.4-150.4-60.8-41.6 16-80 38.4-112 67.2 12.8 54.4 3.2 112-22.4 163.2-28.8 48-73.6 86.4-128 102.4-3.2 22.4-6.4 44.8-6.4 67.2 0 22.4 3.2 44.8 6.4 67.2 54.4 16 99.2 54.4 128 102.4C252.215232 731.178592 261.815232 788.778592 249.015232 843.178592M361.015232 958.378592c-54.4-19.2-105.6-48-150.4-89.6-6.4-6.4-9.6-16-6.4-22.4 16-48 9.6-99.2-16-140.8-25.6-44.8-64-73.6-112-83.2-9.6-3.2-16-9.6-16-19.2-6.4-28.8-9.6-60.8-9.6-89.6 0-28.8 3.2-57.6 9.6-89.6 3.2-9.6 9.6-16 16-19.2 48-12.8 89.6-41.6 112-83.2 25.6-44.8 28.8-92.8 16-140.8-3.2-9.6 0-19.2 6.4-22.4 44.8-38.4 96-67.2 150.4-89.6 9.6-3.2 16 0 22.4 6.4 35.2 35.2 80 57.6 128 57.6 48 0 96-19.2 128-57.6 6.4-6.4 16-9.6 22.4-6.4 54.4 19.2 105.6 48 150.4 89.6 6.4 6.4 9.6 16 6.4 22.4-16 48-9.6 99.2 16 140.8 25.6 44.8 64 73.6 112 83.2 9.6 3.2 16 9.6 16 19.2 6.4 28.8 9.6 60.8 9.6 89.6 0 28.8-3.2 57.6-9.6 89.6-3.2 9.6-9.6 16-16 19.2-48 12.8-89.6 41.6-112 83.2-25.6 44.8-28.8 92.8-16 140.8 3.2 9.6 0 19.2-6.4 22.4-44.8 38.4-96 67.2-150.4 89.6-9.6 3.2-16 0-22.4-6.4-35.2-35.2-80-57.6-128-57.6-48 0-96 19.2-128 57.6-3.2 3.2-9.6 6.4-16 6.4C364.215232 958.378592 361.015232 958.378592 361.015232 958.378592z"
    ]
  };
  function p(t) {
    alert("SPIDER提醒您：" + t);
  }
  function x() {
    const t = `.mpweixin-check-node { position: relative; }
    #mpweixin-main-panel{
      position: fixed;
      right: 10px;
      top: 60px;
      z-index: 99999;
      opacity: 0.75;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.5s;
      font-family: monospace;
    }
    #mpweixin-main-panel:hover{
      opacity: 1;
    }
    .mpweixin-main-panel-active{
      width: 300px !important;
      height: 260px !important;
      border-radius: 10px !important;
      background: #fff;
      box-shadow: 0px 0px 2.2px rgb(0 0 0 / 2%), 0px 0px 5.3px rgb(0 0 0 / 3%), 0px 0px 10px rgb(0 0 0 / 4%), 0px 0px 17.9px rgb(0 0 0 / 4%), 0px 0px 33.4px rgb(0 0 0 / 5%), 0px 0px 80px rgb(0 0 0 / 7%);
      opacity:1;
      cursor: auto !important;
    }

    .mpweixin-main-panel-active #mpweixin-main-panel-logo{
      display:none;
    }

    #mpweixin-main-panel-logo{
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background: #1890ff;
      text-align: center;
      line-height: 50px;
      color: #fff;
      z-index: 2;
    }
    #mpweixin-main-user-name, #mpweixin-main-user-paw, #mpweixin-setting input{
      width: calc(100% - 20px);
      display: block;
      margin: auto;
      margin-top: 10px;
      height: 34px;
      border: #ccc 1px solid;
      border-radius: 4px;
      padding: 2px;
    }
    #mpweixin-main-submit,#mpweixin-logout-submit,#mpweixin-setting-submit,#mpweixin-setting-cancel{
      margin: 12px auto 0 auto;
      display: block;
      background-color: #40a9ff;
      border-color: #40a9ff;
      height: 40px;
      padding: 0 15px;
      font-size: 16px;
      border-radius: 4px;
      color: #fff;
      width: calc(100% - 20px);
    }
    .mpweixin-user-name{
      margin-top: 8px;
      margin-left: 10px;
    }
    .mpweixin-title {
      text-align: center;
      margin-top: 6px;
      font-weight: bold;
      font-family: monospace;
      font-size: 21px;
    }
    #mpweixin-logout-submit{
      margin-top: 10px;
    }
    #mpweixin-login,#mpweixin-user-info{
      transition: all 0.5s;
    }
    .mpweixin-setting-btn{
      position: absolute;
      top: 4px;
      right: 5px;
      width: 20px;
      height: 20px;
      background: #ffff;
      cursor: pointer;
    }
    #mpweixin-setting{
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      background: #fff;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      padding-top: 5px;
      overflow:hidden;
      z-index: 3;
      transition: all 0.5s;
    }
    #mpweixin-setting input {
      height: 24px;
      font-size: 14px;
    }
    #mpweixin-setting-submit{
      position: absolute;
      bottom: 10px;
      right: 10px;
      height: 28px;
      width: calc( 50% - 12px);
    }
    #mpweixin-setting-cancel{
      position: absolute;
      bottom: 10px;
      left: 10px;
      height: 28px;
      width: calc(50% - 12px);
      background: #a9a9a9;
    }
      `;
    GM_addStyle(t);
  }
  class c {
    static async SignIn_PostAsync(n) {
      return u({
        method: "POST",
        url: "/api/Account/SignIn",
        data: n,
        responseType: "json"
      });
    }
    static async WeChatCookieManage_Save_PostAsync(n) {
      return u({
        method: "POST",
        url: "/api/WeChatCookieManage/Save",
        data: n,
        responseType: "json"
      });
    }
    static async WeChatInfo_Save_PostAsync(n) {
      return u({
        method: "POST",
        url: "/api/WeChats/Save",
        data: n,
        responseType: "json"
      });
    }
    static async SearchOrganizationList_GetAsync(n) {
      return u({
        method: "GET",
        url: "/api/Organizations/SearchOrganizationList",
        params: n,
        responseType: "json"
      });
    }
  }
  c.baseUrl = "https://131.n.ch2lab.cn:1443", c.getToken = () => {
    const t = localStorage.getItem(r("token"));
    return t === "null" ? null : t;
  }, c.setToken = (t) => {
    localStorage.setItem(r("token"), t);
  };
  async function b() {
    const t = await a.created();
    document.body.append(t), x();
  }
  const e = class {
    static logout() {
      c.setToken(null), e.setUserInfo(null), this.userDom.textContent = "已注销登录", this.userLoginDom.style.display = "block", this.userInfoDom.style.display = "none", this.setUserInfo({
        username: "",
        password: "",
        count: 0,
        selectDept: 0,
        orgName: "",
        weChatId: ""
      });
    }
    static async login() {
      this.userDom.textContent = "当前用户：" + this.formData.username, this.userLoginDom.style.display = "none", this.userInfoDom.style.display = "block", this.setUserInfo(this.formData);
    }
    static async created() {
      var t;
      return this.settingForm = this.getSettingForm(), this.formData.weChatId = (t = g()) == null ? void 0 : t.__biz, this.formData.orgName = document.querySelector("#js_name").textContent.trim(), d(), document.body.addEventListener("click", (n) => {
        e.root.contains(n.target) === !1 && (e.root.className = "", this.settingDom.style.width = "0%", this.settingDom.style.height = "0%");
      }), e.root;
    }
  };
  let a = e;
  a.formData = {
    username: "",
    password: "",
    count: 0,
    selectDept: 0,
    orgName: "",
    weChatId: ""
  }, a.setUserInfo = (t) => {
    localStorage.setItem(
      r("user-info"),
      JSON.stringify(t)
    ), e.formData = t;
  }, a.getUserInfo = () => {
    const t = localStorage.getItem(r("user-info"));
    try {
      return t ? JSON.parse(t) : { username: "用户名获取失败", count: 0 };
    } catch {
      return { username: "用户名获取失败", count: 0, password: "", selectDept: 0, weChatId: "", orgName: "" };
    }
  }, a.orgSelectDom = l(
    "select",
    {},
    { placeholder: "选择单位：", onchange: (t) => {
      e.formData.selectDept = Number(e.orgSelectDom.value);
    } },
    []
  ), a.weChatSubmitCountDom = l(
    "div",
    { style: " margin-left: 10px;margin-top: 10px;" },
    {},
    [
      e.orgSelectDom,
      l(
        "a",
        { style: "color: #6ebdfd; margin-left:20px;cursor: pointer;" },
        {
          textContent: "保存",
          onclick: () => {
            w(e.formData.selectDept);
          }
        }
      )
    ]
  ), a.userDom = l(
    "div",
    {
      class: r("user-name")
    },
    { textContent: "当前用户：" + e.getUserInfo().username }
  ), a.grabInfo = [l(
    "div",
    {
      class: r("user-name")
    },
    { textContent: "微信Id：" + e.getUserInfo().weChatId }
  ), l(
    "div",
    {
      class: r("user-name")
    },
    { textContent: "微信名称：" + e.getUserInfo().orgName }
  )], a.userLoginDom = l(
    "div",
    {
      id: r("login"),
      style: `display:${c.getToken() ? "none" : "block"}`
    },
    null,
    [
      l(
        "input",
        {
          id: r("main-user-name"),
          style: "",
          placeholder: "请输入账号"
        },
        {
          textContent: "测试获取节点",
          oninput: (t) => {
            e.formData.username = t.target.value;
          }
        }
      ),
      l(
        "input",
        {
          id: r("main-user-paw"),
          style: "",
          placeholder: "请输入密码",
          type: "password"
        },
        {
          textContent: "测试获取节点",
          oninput: (t) => {
            e.formData.password = t.target.value;
          }
        }
      ),
      l(
        "button",
        {
          id: r("main-submit")
        },
        {
          textContent: "登录",
          onclick: () => {
            e.formData.username = document.querySelector("#" + r("main-user-name")).value, e.formData.password = document.querySelector("#" + r("main-user-paw")).value, !(!e.formData.username || !e.formData.password) && c.SignIn_PostAsync(e.formData).then((t) => {
              let n;
              ((o) => {
                o[o.成功 = 0] = "成功", o[o.失败 = 1] = "失败", o[o.账号锁定 = 2] = "账号锁定", o[o.不允许登录 = 4] = "不允许登录", o[o.需要两步认证 = 8] = "需要两步认证", o[o.验证码错误 = 16] = "验证码错误", o[o.需要修改密码 = 32] = "需要修改密码", o[o.账号过期 = 64] = "账号过期";
              })(n || (n = {})), t === 0 ? (e.login(), d()) : n[t] ? p(n[t]) : p(JSON.stringify(t));
            });
          }
        }
      )
    ]
  ), a.userInfoDom = l(
    "div",
    {
      id: r("user-info"),
      style: `display:${c.getToken() ? "block" : "none"}`
    },
    null,
    [
      l(
        "div",
        { class: r("title") },
        { textContent: "SPIDER工具" }
      ),
      e.userDom,
      ...e.grabInfo,
      e.weChatSubmitCountDom,
      l(
        "button",
        {
          id: r("logout-submit")
        },
        {
          textContent: "退出登录",
          onclick: () => {
            e.logout();
          }
        }
      )
    ]
  ), a.settingForm = {
    baseUrl: ""
  }, a.setSettingForm = (t) => {
    localStorage.setItem(
      r("setting"),
      JSON.stringify(t)
    ), c.baseUrl = t.baseUrl;
  }, a.getSettingForm = () => {
    const t = localStorage.getItem(r("setting"));
    let n = {
      baseUrl: "https://131.n.ch2lab.cn:1443"
    };
    try {
      n = t ? JSON.parse(t) : { baseUrl: "https://131.n.ch2lab.cn:1443" };
    } catch {
    }
    return c.baseUrl = n.baseUrl, n;
  }, a.settingDom = l(
    "div",
    { id: r("setting") },
    { textContent: "设置" },
    [
      l(
        "input",
        {
          id: r("setting-baseUrl"),
          placeholder: "请输入服务器地址"
        },
        {
          oninput: (t) => {
            e.settingForm.baseUrl = t.target.value;
          }
        }
      ),
      l(
        "button",
        { id: r("setting-cancel") },
        {
          textContent: "关闭",
          onclick: (t) => {
            e.settingDom.style.width = "0", e.settingDom.style.height = "0";
          }
        }
      ),
      l(
        "button",
        { id: r("setting-submit") },
        {
          textContent: "保存",
          onclick: (t) => {
            e.setSettingForm(e.settingForm), e.settingDom.style.width = "0", e.settingDom.style.height = "0";
          }
        }
      )
    ]
  ), a.root = l(
    "div",
    {
      id: r("main-panel")
    },
    null,
    [
      l(
        "div",
        {
          id: r("main-panel-logo")
        },
        {
          textContent: "SPIDER",
          onclick: () => {
            e.root.className = r("main-panel-active");
          }
        }
      ),
      e.userLoginDom,
      e.userInfoDom,
      e.settingDom,
      l(
        "div",
        { class: r("setting-btn") },
        {
          onclick: () => {
            e.settingDom.style.width = "100%", e.settingDom.style.height = "100%", e.settingDom.querySelector(
              "#" + r("setting-baseUrl")
            ).value = e.settingForm.baseUrl;
          }
        },
        y("setting", { style: "fill:#6ebdfd" })
      )
    ]
  );
  async function d() {
    var i;
    a.grabInfo[0].textContent = (i = g()) == null ? void 0 : i.__biz, a.grabInfo[1].textContent = document.querySelector("#js_name").textContent.trim();
    const t = await c.SearchOrganizationList_GetAsync({});
    a.orgSelectDom.innerHTML = "";
    var n = document.createDocumentFragment();
    let o = "";
    t.forEach((s) => {
      a.formData.orgName.includes(s.name) && (o = s.id.toString()), n.appendChild(l(
        "option",
        {
          value: s.id
        },
        { textContent: s.name }
      ));
    }), a.orgSelectDom.appendChild(n), a.orgSelectDom.value = o;
  }
  function w(t) {
    var o;
    const n = (o = g()) == null ? void 0 : o.__biz;
    c.WeChatInfo_Save_PostAsync({
      id: n,
      organizationId: t,
      name: document.querySelector("#js_name").textContent
    }).then((i) => {
      const s = a.getUserInfo();
      a.formData = s, a.formData.count = Number(s.count), a.formData.count++, a.setUserInfo(a.formData), a.weChatSubmitCountDom.firstChild.nodeValue = "提交次数：" + a.formData.count;
    }).catch((i) => {
      throw i;
    });
  }
  function g() {
    let t = location.href, n = {};
    if (t.indexOf("?") != -1) {
      let i = t.substring(t.indexOf("?") + 1).split("&");
      for (let s = 0; s < i.length; s++)
        n[i[s].split("=")[0]] = decodeURI(i[s].split("=")[1]);
    }
    return n;
  }
  async function u(t) {
    const n = t.data ? JSON.stringify(t.data) : null, o = t.params ? t.url + "?" + Object.keys(t.params).map((m) => `${m}=${t.params[m]}`).join("&") : t.url, i = await fetch(c.baseUrl + o, {
      method: t.method,
      body: n,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + c.getToken()
      }
    });
    if (i.status === 401)
      throw a.logout(), new Error(
        "错误代码：" + i.status + `
错误信息：登录已失效`
      );
    if (i.status === 404 && p("接口地址错误，请检查服务器地址!"), i.status != 200)
      throw new Error("错误代码：" + i.status);
    const s = await i.json();
    if (s.code != 200)
      throw p("错误代码：" + s.code + `
错误信息：` + s.message), new Error(
        "错误代码：" + s.code + `
错误信息：` + s.message
      );
    return i.headers.has("x-access-token") && c.setToken(i.headers.get("x-access-token")), s.data;
  }
  function r(t, n = "-") {
    return f + n + t;
  }
  function l(t, n, o, i) {
    const s = document.createElement(t);
    for (let m in n)
      s.setAttribute(m, n[m]);
    for (let m in o)
      s[m] = o[m];
    return Array.isArray(i) ? i.forEach((m) => s.append(m)) : i && s.append(i), s;
  }
  function y(t, n) {
    const o = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    o.setAttribute("viewBox", "0 0 1024 1024");
    for (let i in n)
      o.setAttribute(i, n[i]);
    return h[t].forEach((i) => {
      const s = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      s.setAttribute("d", i), o.appendChild(s);
    }), o;
  }
  b();
})();
//# sourceMappingURL=spider.mjs.map
