// ==UserScript==
// @name         淘宝订单辅助
// @namespace    http://mdmf.hkust-gz.edu.cn/
// @version      2024-01-22
// @description  淘宝订单辅组
// @author       Colin
// @match        https://buy.taobao.com/auction/order/confirm_order.htm*
// @match        https://buy.taobao.com/auction/buy_now.jhtml*
// @match        https://buy.tmall.com/order/confirm_order.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @license      MIT
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/499252/%E6%B7%98%E5%AE%9D%E8%AE%A2%E5%8D%95%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/499252/%E6%B7%98%E5%AE%9D%E8%AE%A2%E5%8D%95%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const CmpTitle = "香港科技大学（广州）";
  const CmpFaxNum = "12440100MB2E09933F";
  const CmpComm =
    "开电子普通发票，\n邮箱：31360013@qq.com \n单位名称：香港科技大学（广州） \n纳税人识别号：12440100MB2E09933F";

  function simulateTextInput(element, text) {
    var event = new TextEvent("input", {
      data: text,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  }

  setTimeout(() => {
    const memos = $("div.textarea");
    console.log("memos count: ", memos.length);
    for (let i = 0; i < memos.length; i++) {
      const btnTitle = $(
        `<br/><button style="background-color: rgb(80, 200, 255);width:50px;height:33px;margin:0px 10px">抬头</button>`
      );
      btnTitle.on("click", () => {
        GM_setClipboard(CmpTitle, "text");
      });
      const btnFaxNum = $(
        `<button style="background-color: rgb(80, 200, 255);width:50px;height:33px;margin:0px 10px">税号</button>`
      );
      btnFaxNum.on("click", () => {
        GM_setClipboard(CmpFaxNum, "text");
      });
      const btnComm = $(
        `<button style="background-color: rgb(80, 200, 255);width:50px;height:33px;margin:0px 10px">备注</button>`
      );
      btnComm.on("click", () => {
        GM_setClipboard(CmpComm, "text");
      });
      btnTitle.appendTo(memos[i]);
      btnFaxNum.appendTo(memos[i]);
      btnComm.appendTo(memos[i]);
    }

    /*
    const OrderHead = $("div.item-headers>div.header-wrapper")[0];
    const btnFillAllMemo = $(
      `<button style="background-color: rgb(80, 200, 255);width:100px;height:33px;margin:0px 10px">填写备注</button>`
    );

    btnFillAllMemo.on("click", () => {
      const memoInput = $("span.next-input-textarea>textarea");
      console.log("memoInput", memoInput.length);

      for (let i = 0; i < memoInput.length; i++) {
        // simulateTextInput(memoInput[i], CmpComm);
        // console.log("memoInpt", memoInput[i]);
        memoInput[i].focus();
        // $(memoInput[i]).trigger({
        //   type: "keypress",
        //   which: 65 // ASCII value for 'A'
        // });
        // $(memoInput[i]).trigger($.Event("keypress", {keyCode: 17 + 16 + 67}));
        // let event = jQuery.Event("keydown");
        // event.ctrlKey = true;
        // event.shiftKey = true;
        // event.which = 86; // Key code for 'C'
        // $(memoInput[i]).trigger(event);
      }
    });

    btnFillAllMemo.appendTo(OrderHead);
    */
  }, 500);
})();
