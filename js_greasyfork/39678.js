// ==UserScript==
// @name         ZSKShadow
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  "云影cloundssss导出"
// @author       You
// @match        https://*.cloudss.me/clientarea.php?action=productdetails&id*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/FileSaver.js/2014-11-29/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39678/ZSKShadow.user.js
// @updateURL https://update.greasyfork.org/scripts/39678/ZSKShadow.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let list = Array.from($($("table").children("tbody")[1]).children("tr"));
  let mrObj = {
    strategy: null,
    index: 6,
    global: false,
    enabled: true,
    shareOverLan: false,
    isDefault: false,
    localPort: 1080,
    pacUrl: null,
    useOnlinePac: false,
    secureLocalPac: true,
    availabilityStatistics: false,
    autoCheckUpdate: true,
    checkPreRelease: false,
    isVerboseLogging: true,
    logViewer: {
      topMost: false,
      wrapText: false,
      toolbarShown: false,
      Font: "Consolas, 8pt",
      BackgroundColor: "Black",
      TextColor: "White"
    },
    proxy: {
      useProxy: false,
      proxyType: 0,
      proxyServer: "",
      proxyPort: 0,
      proxyTimeout: 3
    },
    hotkey: {
      SwitchSystemProxy: "",
      SwitchSystemProxyMode: "",
      SwitchAllowLan: "",
      ShowLogs: "",
      ServerMoveUp: "",
      ServerMoveDown: ""
    }
  };
  let port = parseInt($($($("table tbody tr")[0]).children("td")[1]).text());
  let pwd = $($($("table tbody tr")[0]).children("td")[3]).text();
  let getList = [];
  for (let item of list) {
    let obj = {
      server: $.trim($($(item).children("td")[3]).text()),
      server_port: port,
      password: $.trim(pwd),
      method: $.trim($($(item).children("td")[2]).text()),
      plugin: "",
      plugin_opts: "",
      remarks: $.trim($($(item).children("td")[1]).text()),
      timeout: 5,
      obfs: "tls1.2_ticket_auth",
      protocol: "auth_sha1_v4",
    };
    getList.push(obj);
  }
  mrObj.configs = getList;
  var mystyle = `
  .mybtn {
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #d8dce5;
      text-align: center;
      box-sizing: border-box;
      outline: none;
      margin: 0;
      transition: .1s;
      font-weight: 500;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      padding: 12px 100px;
      font-size: 18px;
      border-radius: 4px;
      color: #fff;
      background-color: #409eff;
      border-color: #409eff;
      margin-top: 30px;
    }
  `;
  $("head").append("<style>" + mystyle + "</style>");
  $($(".text-center")[0]).append(
    `<button class="mybtn" data-clipboard-target="#bar">获取</button>`
  );
  $('body').on('click', '.mybtn', function () {
    var blob = new Blob([JSON.stringify(mrObj)], {
      type: ""
    });
    saveAs(blob, "CloundSS.json");
  })
})();