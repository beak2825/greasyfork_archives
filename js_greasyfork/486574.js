// ==UserScript==
// @name              无剑Mud辅修(OL)(alpha)
// @description       无剑Mud辅修，由在线版移植而来，順便《略改》
// @namespace         http://tampermonkey.net/
// @version           1.1.52-alpha
// @license           MIT
// @author            燕飞，东方鸣，懒人
// @match             http://*.xxmud.cn/*
// @match             http://lib10.cn/*
// @match             http://orchin.cn/*
// @match             http://*.yytou.cn/*
// @match             http://*.yytou.com/*
// @match             http://118.178.84.7/*
// @grant             unsafeWindow
// @grant             GM_info
// @grant             GM_setClipboard
// @connect           update.greasyfork.org
// @run-at            document-end
// @compatible        Chrome >= 80
// @compatible        Edge >= 80
// @compatible        Firefox PC >= 74
// @compatible        Opera >= 67
// @compatible        Safari MacOS >= 13.1
// @compatible        Firefox Android >= 79
// @compatible        Opera Android >= 57
// @compatible        Safari iOS >= 13.4
// @compatible        WebView Android >= 80
// @downloadURL https://update.greasyfork.org/scripts/486574/%E6%97%A0%E5%89%91Mud%E8%BE%85%E4%BF%AE%28OL%29%28alpha%29.user.js
// @updateURL https://update.greasyfork.org/scripts/486574/%E6%97%A0%E5%89%91Mud%E8%BE%85%E4%BF%AE%28OL%29%28alpha%29.meta.js
// ==/UserScript==
(function () {
  "use strict";
  if (location.host == "orchin.cn") {
    var params = new URLSearchParams(location.href.split("?")[1]);
    var host = params.get("ws_host");
    if (!host) return;
    params["delete"]("ws_host");
    location.replace("http://" + host + "?" + params.toString());
  }

  // 自定义模式开关
  unsafeWindow.customMode = false;
  function customCode() {
    // 自定义代码区
  }
  var script_url = unsafeWindow.g_version_tw
    ? "https://update.greasyfork.org/scripts/471563/%E6%97%A0%E5%89%91Mud%E8%BE%85%E5%8A%A9.js?_="
    : "https://update.greasyfork.org/scripts/486573/%E6%97%A0%E5%89%91Mud%E8%BE%85%E4%BF%AE.js?_=";
  var api_url = unsafeWindow.g_version_tw
    ? "https://update.greasyfork.org/scripts/471563.json?_="
    : "https://update.greasyfork.org/scripts/486573.json?_=";
  var i18n = unsafeWindow.g_version_tw ? "tw" : "cn";
  $.ajax({
    url: api_url.concat(Date.now()),
    dataType: "jsonp",
    crossDomain: "true",
  }).done(function () {
    $.ajax({
      url: script_url.concat(Date.now()),
      dataType: "text",
      crossDomain: "true",
    }).done(function (res) {
      eval("(function (){" + res + "})()");
      if (unsafeWindow.customMode) {
        customCode();
        unsafeWindow.init();
      }
    });
  });
})();
