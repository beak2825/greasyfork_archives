// ==UserScript==
// @name               general tracker
// @namespace          https://github.com/symant233/tracker
// @description        General Tracker with WebSocket
// @match              *://*/*
// @grant              unsafeWindow
// @grant              GM.registerMenuCommand
// @grant              GM.unregisterMenuCommand
// @grant              GM.deleteValue
// @grant              GM.getValue
// @grant              GM.setValue
// @run-at             document-end
// @version            1.9
// @author             symant233
// @license            GPLv3
// @icon               https://mirrors.tuna.tsinghua.edu.cn/static/img/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/491705/general%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/491705/general%20tracker.meta.js
// ==/UserScript==
(async function () {
  "use strict";
  // 当 WebSocket 被更改实现时停止监听
  if (
    WebSocket.prototype.send.toString() !== "function send() { [native code] }"
  ) {
    return;
  }

  async function setupMenu() {
    return await GM.registerMenuCommand(
      `${enabled ? "Disable" : "Enable"} for \`${location.host}\``,
      async () => {
        enabled = !enabled;
        GM[enabled ? "setValue" : "deleteValue"](location.host, enabled);
        GM.unregisterMenuCommand(mid);
        mid = await setupMenu();
      }
    );
  }

  let enabled = await GM.getValue(location.host),
    mid = await setupMenu();

  if (!enabled) return;

  // const SERVER = "wss://mofu.ltd/tracker";
  const SERVER = "wss://tracker-symant.deno.dev";
  let ws = new WebSocket(SERVER);
  let reconnectable = true;

  // 保活函数，当连接关闭时重连
  function onClose() {
    if (!reconnectable) return;
    setTimeout(() => {
      ws = new WebSocket(SERVER);
      ws.addEventListener("close", onClose);
    }, 1000); // 1 second delay before attempting to reconnect
  }

  ws.addEventListener("close", onClose);

  // document dblclick event listener
  document.body.addEventListener("dblclick", (e) => {
    if (!reconnectable) return;
    const text = e.target.innerText;
    ws.send(text);
  });

  // Ctrl + 0 停止监听
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "0") {
      reconnectable = false;
      ws.close();
    }
  });

  // Ctrl + C 发送选中项
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "c") {
      ws.send(unsafeWindow.getSelection().toString());
    }
  });

  // Ctrl + ` 发送全文
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "`") {
      ws.send(document.body.innerText);
    }
  });

  // 关闭标签页时触发清除监听器
  window.addEventListener("beforeunload", () => {
    reconnectable = false;
    ws.close();
  });
})();
