// ==UserScript==
// @icon          https://www.google.com/s2/favicons?domain=metabirds.net
// @name          Metabirds 删推小助手
// @author        neo881115
// @description   为 Metabirds 添加批量删推功能。
// @match         *://metabirds.net/admin/bot_mention.php*
// @match         *://metabirds.net/admin/bot_timeline.php*
// @version       0.2.0
// @grant         unsafeWindow
// @grant         GM_xmlhttpRequest
// @grant         GM_log
// @grant         GM_notification
// @grant         GM_setValue
// @grant         GM_getValue
// @namespace https://greasyfork.org/users/790356
// @downloadURL https://update.greasyfork.org/scripts/428908/Metabirds%20%E5%88%A0%E6%8E%A8%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/428908/Metabirds%20%E5%88%A0%E6%8E%A8%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
{
  if (window.top !== window.self) throw new Error("非顶层框架");
  var update_button = null;
  var search_button = null;
  var isEnglish = false;
  var num = 0;
  const findElements = async() => {
    try {
      const element = document.getElementById("goPagetop").innerText
      if (element !== null) {
        const numstr = document.getElementsByClassName("list_path")[0].innerText;
        if (element.startsWith("P")) { // English version.
          isEnglish = true;
          search_button = document.querySelector('[value="Search"]');
          update_button = document.querySelector('[value="Change"]');
          num = Number(numstr.split(": ")[1]);
        } else {
          isEnglish = false;
          search_button = document.querySelector('[value="絞り込み表示"]');
          update_button = document.querySelector('[value="更　新"]');
          num = Number(numstr.split("件")[0]);
        }
        return true;
      } else {
        return false
      };
    } catch (_) {
      return false;
    }
  }
  const init = async() => {
    let result;
    try {
      result = await findElements();
    } catch (_) {
      // noop
    }
    if (result !== true) {
      setTimeout(() => init(), 1000);
    }
  };
  init();

  var enabled = false;
  try {
    const savedEnabled = localStorage.getItem("EnableBotbirdCleaner");
    if (savedEnabled) {
      enabled = (savedEnabled == "true" ? true : false);
    } else if (savedEnabled == null) {
      localStorage.setItem("EnableBotbirdCleaner", false);
    }
  } catch (_) {
    // noop
    localStorage.setItem("EnableBotbirdCleaner", false);
  }
  const dodel = () => {
    if (enabled) {
      localStorage.setItem("EnableBotbirdCleaner", true);
      console.log("DO DEL EXEC");
      for (var i = 0; i < 20; i++) {
        var j = document.getElementById("delete_message_" + String(i + 1));
        if (j) {
          j.click();
        }
      }
      update_button.click();
    }
  }

  const onoff = () => {
    console.log("DO ONOFF EXEC");
    dodel();
    enabled = !enabled;
  }
  var par = search_button.parentElement.parentElement.parentElement;
  if (par) {
    var ele = document.createDocumentFragment();
    const lbl = document.createElement("label");
    lbl.append(document.createTextNode(enabled == true ? "批量删除模式已开启" : "批量删除模式已关闭"));
    const btn = document.createElement("input");
    btn.setAttribute("class", "clearfix button");
    btn.setAttribute("type", "submit");
    if (num != 0) {
      btn.setAttribute("value", enabled == true ? "关闭删除模式" : "开启删除模式");
      btn.addEventListener("click", onoff);
    } else {
      btn.setAttribute("value", "推文已全部删除");
      localStorage.setItem("EnableBotbirdCleaner", false);
    }
    ele.appendChild(lbl);
    ele.appendChild(btn);
    var br = document.createElement("br");
    br.setAttribute("clear", "all")
    ele.appendChild(br);
    ele.appendChild(document.createElement("hr"));
    par.insertBefore(ele, par.firstChild);
    console.log(enabled);
    if (enabled == true) {
      console.log("OFF");
      if (num != 0) {
        console.log("ON");
        dodel();
      }
    }
    //perform update
  }
}