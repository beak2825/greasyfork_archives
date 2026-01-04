// ==UserScript==
// @name        【待授权】陕西省专业技术人员继续教育学习平台破解账号登录|使用说明：http://doc.zhanyc.cn/pages/xddl/
// @namespace    https://doc.zhanyc.cn/
// @icon        https://js.zhanyc.cn/img/js-logo.svg
// @version      1.0
// @description  脚本付费才能使用！可直接用学生账号密码登录，免微信扫码。接各类平台代挂、脚本开发工作，VX：zhanyc_cn，备用:zhanfengkuo
// @author       zfk
// @include    *://*xidian.edu.cn/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_getResourceURL
// @grant       GM_addValueChangeListener
// @grant       GM_removeValueChangeListener
// @grant       GM_getResourceText
// @grant       window.close
// @run-at      document-body
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require https://greasyfork.org/scripts/434540-layerjs-gm-with-css/code/layerjs-gm-with-css.js?version=1065982
// @include    *://m.zhanyc.cn/*
// @connect     m.zhanyc.cn
// @connect     localhost
// @connect     js.zhanyc.cn
// @antifeature  payment
// @license Creative Commons
// @downloadURL https://update.greasyfork.org/scripts/510560/%E3%80%90%E5%BE%85%E6%8E%88%E6%9D%83%E3%80%91%E9%99%95%E8%A5%BF%E7%9C%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E7%A0%B4%E8%A7%A3%E8%B4%A6%E5%8F%B7%E7%99%BB%E5%BD%95%7C%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%EF%BC%9Ahttp%3Adoczhanyccnpagesxddl.user.js
// @updateURL https://update.greasyfork.org/scripts/510560/%E3%80%90%E5%BE%85%E6%8E%88%E6%9D%83%E3%80%91%E9%99%95%E8%A5%BF%E7%9C%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E7%A0%B4%E8%A7%A3%E8%B4%A6%E5%8F%B7%E7%99%BB%E5%BD%95%7C%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%EF%BC%9Ahttp%3Adoczhanyccnpagesxddl.meta.js
// ==/UserScript==
(function () {
  let plugMain = {
    async init() {
      console.log("%c init", "background:rgb(0,0,0);color:#fff");
      plugMain.addStyle()
      plugMain.runByUrl(location.href)
    },
    async runByUrl(url) {

      if (url.includes("xidian.edu.cn")) {
        plugMain.page_login();
      }
    },
    async page_login() {
      await plugMain.waitOf(a => $("#bandLogin").length > 0 && $("#pop:visible").length > 0)
      await plugMain.waitTimeout(1000)
      $("#pop").prepend(`<div style="
    position: absolute;
    text-align: center;
    width: 100%;
"><button class="zfk-btn danger" type="button" onclick="plugMain.openAccLogin()">【未授权】脚本：开启账号密码登录</button></div>`)
    },
    async openAccLogin() {
      if ($("#bandLogin").length == 0) {
        plugMain.tipsMsg("非登录页面");
        return
      }
      plugMain.alertMsg("脚本需要付费授权才可使用，请联系客服授权。微信：zhanyc_cn。付费后不可用可退款！")
    },

    alertMsg(msg, timeout = 0) {
      layer.open(
        {
          type: "1",
          content: `<div style="padding:14px;">${msg}</div>`,
          title: "脚本提示" + (timeout == 0 ? '' : `（${(timeout / 1000).toFixed(2)}秒后自动关闭}）`),
          offset: "100px",
          time: timeout,
          btn: "关闭"
        })
    },
    tipsMsg(msg, timeout = 3000) {
      layer.msg(msg, { offset: "100px", time: timeout });
    },
    confirmMsg(msg = "请确认", option = {}) {
      let defConfig = {
        title: "脚本提示", btn: ["确定", "关闭"],
        fun1(index) { layer.close(index) },
        fun2() { },
        fun3() { }
      }
      Object.assign(defConfig, option)
      layer.open(
        {
          type: "1",
          content: `<div style="padding:14px;">${msg}</div>`,
          title: option.title,
          offset: "100px",
          btn: defConfig.btn,
          yes: defConfig.fun1,
          btn2: defConfig.fun2,
          btn3: defConfig.fun3
        })
    },

    waitTimeout(timeout) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, timeout);
      });
    },
    waitOf(fun, interval = 1000, timeout = 30) {
      console.log("%c waitOf", "background:rgb(0,0,0);color:#fff", fun);
      return new Promise((resolve, reject) => {
        let _timeOut = timeout * 1000;
        try {
          if (fun()) {
            return resolve();
          }
        } catch (e) {
          console.error(e);
        }
        let index = setInterval(() => {
          try {
            if (timeout != -1) {
              _timeOut -= interval;
              if (_timeOut < 0) {
                clearInterval(index);
                return reject();
              }
            }
            if (fun()) {
              clearInterval(index);
              return resolve();
            }
          } catch (e) {
            console.error(e);
          }
        }, interval);
      });
    },
    addStyle() {
      GM_addStyle(`
      .zfk-btn{background-color:#0fbcf9;color:white;padding:4px 12px;border:none;box-sizing:content-box;font-size:14px;height:20px;border-radius:4px;cursor:pointer;display:inline-block;border:1px solid transparent;white-space:nowrap;user-select:none;text-align:center;vertical-align:middle}.zfk-btn:hover{opacity:.8}.zfk-btn.success{background-color:#38b03f}.zfk-btn.warning{background-color:#f1a325}.zfk-btn.info{background-color:#03b8cf}.zfk-btn.danger{background-color:#ea644a}.zfk-form-tips{font-size:1.2em;color:red}.tips{color:red}.zfk-form textarea,.zfk-form input[type=text],.zfk-form input[type=number],.zfk-form input[type=password]{border:1px solid #888;border-radius:4px;padding:5px;box-sizing:border-box}.zfk-form textarea{width:100%}.zfk-form-item{margin-bottom:10px}.zfk-form-item>label:first-child{width:7em;text-align:right;display:inline-block;padding-right:5px;margin-right:0}.zfk-form-item label{margin-right:4px}.zfk-form-item.block>label:first-child{text-align:left;display:block;width:100%;font-weight:bold}.text-l{text-align:left !important}.text-c{text-align:center !important}.text-r{text-align:right !important}.p-0{padding:0px !important}.p-5{padding:5px !important}.p-10{padding:10px !important}.p-15{padding:15px !important}.p-20{padding:20px !important}.p-t-0{padding-top:0px !important}.p-t-5{padding-top:5px !important}.p-t-10{padding-top:10px !important}.p-t-15{padding-top:15px !important}.p-t-20{padding-top:20px !important}.p-b-0{padding-bottom:0px !important}.p-b-5{padding-bottom:5px !important}.p-b-10{padding-bottom:10px !important}.p-b-15{padding-bottom:15px !important}.p-b-20{padding-bottom:20px !important}.p-l-0{padding-left:0px !important}.p-l-5{padding-left:5px !important}.p-l-10{padding-left:10px !important}.p-l-15{padding-left:15px !important}.p-l-20{padding-left:20px !important}.p-r-0{padding-right:0px !important}.p-r-5{padding-right:5px !important}.p-r-10{padding-right:10px !important}.p-r-15{padding-right:15px !important}.p-r-20{padding-right:20px !important}.p-0{padding:0px !important}.p-5{padding:5px !important}.p-10{padding:10px !important}.p-15{padding:15px !important}.p-20{padding:20px !important}.m-t-0{margin-top:0px !important}.m-t-5{margin-top:5px !important}.m-t-10{margin-top:10px !important}.m-t-15{margin-top:15px !important}.m-t-20{margin-top:20px !important}.m-b-0{margin-bottom:0px !important}.m-b-5{margin-bottom:5px !important}.m-b-10{margin-bottom:10px !important}.m-b-15{margin-bottom:15px !important}.m-b-20{margin-bottom:20px !important}.m-l-0{margin-left:0px !important}.m-l-5{margin-left:5px !important}.m-l-10{margin-left:10px !important}.m-l-15{margin-left:15px !important}.m-l-20{margin-left:20px !important}.m-r-0{margin-right:0px !important}.m-r-5{margin-right:5px !important}.m-r-10{margin-right:10px !important}.m-r-15{margin-right:15px !important}.m-r-20{margin-right:20px !important}.bold{font-weight:bold !important}.tips-box{padding:10px;border:1px solid red;background-color:#fff0f0;color:red}.bold{font-weight:bold}.font-l{font-size:1.2em}.font-xl{font-size:40px}.font-l{font-size:25px}.color-default{color:#ea644a !important}.color-success{color:#38b03f !important}.color-warning{color:#f1a325 !important}.color-danger{color:#ea644a !important}.bg-default{background-color:#ea644a !important}.bg-success{background-color:#38b03f !important}.bg-warning{background-color:#f1a325 !important}.bg-danger{background-color:#ea644a !important}.zfk-table{border-collapse:collapse}.zfk-table thead{background-color:#1abc9c}.zfk-table td,.zfk-table th{text-align:center;padding:6px;border:1px solid #888}.zfk-table tr:nth-child(2n){background-color:#f2f2f2}.zfk-table tr:hover{background-color:#fff799}.zfk-container *{font-size:17px}
      `);
    },
  }
  plugMain.init()
  if (!unsafeWindow.plugMain) unsafeWindow.plugMain = plugMain;
})();
