// ==UserScript==
// @name         淘宝聊天
// @namespace    http://mdmf.hkust-gz.edu.cn/
// @version      2024-01-22
// @description  UST-淘宝聊天辅助
// @author       Colin
// @match        https://market.m.taobao.com/app/im/chat/index.html?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @grant       GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496214/%E6%B7%98%E5%AE%9D%E8%81%8A%E5%A4%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/496214/%E6%B7%98%E5%AE%9D%E8%81%8A%E5%A4%A9.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const Info1 =
    "开电子普通发票，\n邮箱：31360013@qq.com \n单位名称：香港科技大学（广州） \n纳税人识别号：12440100MB2E09933F";
  const Info2 = "Hi，电子普通发票开好了吗？";
  const Info3 =
    "麻烦开一下电子普通发票，谢谢！\n普通发票开票信息，\n邮箱：31360013@qq.com \n单位名称：香港科技大学（广州） \n纳税人识别号：12440100MB2E09933F";
  const Info4 = "hi, 能开电子普通发票吗？";
  setTimeout(() => {
    const body = $("body");
    //Button1
    const btnInfo1 = $(
      `<br/><button style="background-color: rgb(80, 200, 255);width:150px;height:33px;margin:0px 10px;position: fixed;bottom: 500px; right:100px">发票信息</button>`
    );
    btnInfo1.on("click", () => {
      GM_setClipboard(Info1, "text");
    });
    btnInfo1.appendTo(body);
    //Button 2
    const btnInfo2 = $(
      `<br/><button style="background-color: rgb(80, 200, 255);width:150px;height:33px;margin:0px 10px;position: fixed;bottom: 460px; right:100px">开好没了</button>`
    );
    btnInfo2.on("click", () => {
      GM_setClipboard(Info2, "text");
    });
    btnInfo2.appendTo(body);
    //Button 3
    const btnInfo3 = $(
      `<br/><button style="background-color: rgb(80, 200, 255);width:150px;height:33px;margin:0px 10px;position: fixed;bottom: 420px; right:100px">麻烦开票</button>`
    );
    btnInfo3.on("click", () => {
      GM_setClipboard(Info3, "text");
    });
    btnInfo3.appendTo(body);
    //Button 4
    const btnInfo4 = $(
      `<br/><button style="background-color: rgb(80, 200, 255);width:150px;height:33px;margin:0px 10px;position: fixed;bottom: 380px; right:100px">能不能开票</button>`
    );
    btnInfo4.on("click", () => {
      GM_setClipboard(Info4, "text");
    });
    btnInfo4.appendTo(body);
  }, 500);
})();
