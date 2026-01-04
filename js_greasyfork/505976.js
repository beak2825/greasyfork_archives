// ==UserScript==
// @name         阻止十字街聊天室客户端名称过长刷屏
// @version      2024-01-02
// @namespace    anti_clientname_spam
// @description  阻止恶意用户通过将client参数设置得很长来刷屏，这个脚本可以限制显示的客户端名称长度，阻止刷屏
// @author       qiling_wd
// @match        https://crosst.chat/?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crosst.chat
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505976/%E9%98%BB%E6%AD%A2%E5%8D%81%E5%AD%97%E8%A1%97%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%90%8D%E7%A7%B0%E8%BF%87%E9%95%BF%E5%88%B7%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/505976/%E9%98%BB%E6%AD%A2%E5%8D%81%E5%AD%97%E8%A1%97%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%90%8D%E7%A7%B0%E8%BF%87%E9%95%BF%E5%88%B7%E5%B1%8F.meta.js
// ==/UserScript==

const clienthook = window.ws.onmessage;
window.ws.onmessage = (e) => {
  var csc = JSON.parse(e.data);
  if (csc.cmd == "onlineAdd") {
    csc.client = csc.client.length>30?csc.client.substring(0,30)+"...":csc.client;
    csc.client = csc.client.replace(/[\u0300-\u036f]/g, '');
  }
  clienthook({data:JSON.stringify(csc)});
}