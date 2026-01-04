// ==UserScript==
// @name         去哪儿度假新单提醒
// @namespace    https://greasyfork.org/zh-CN/users/104201
// 变动          新增订单状态变化时候的通知提醒
// @version      0.3
// @description  去哪儿度假新订单提醒，提醒声音可定制
// @author       黄盐
// @match        https://tb2cadmin.qunar.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/391775/%E5%8E%BB%E5%93%AA%E5%84%BF%E5%BA%A6%E5%81%87%E6%96%B0%E5%8D%95%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/391775/%E5%8E%BB%E5%93%AA%E5%84%BF%E5%BA%A6%E5%81%87%E6%96%B0%E5%8D%95%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==
// jshint esversion:6
$ = unsafeWindow.jQuery;
(function() {
  'use strict';
  const LOOPTIME = 40;
  const NEWORDERSOUNDURL = "https://www.runoob.com/try/demo_source/horse.ogg";
  const MUTEDICON = `<svg class="icon" style="width: 3em; height: 3em;vertical-align middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8895"><path d="M974.266 589.105l-84.723 84.784-84.784-84.784-84.784 84.784-84.726-84.784 84.726-84.784-84.726-84.755 84.726-84.784 84.784 84.784 84.784-84.784 84.723 84.784-84.726 84.757 84.726 84.782zM520.658 958.87l-227.275-227.275h-170.455c-31.404 0-56.818-25.413-56.818-56.818v-340.914c0-31.374 25.413-56.818 56.818-56.818h170.455l227.275-227.275c0 0 56.818-7.102 56.818 56.818 0 308.311 0 756.287 0 795.462 0 63.918-56.818 56.818-56.818 56.818zM463.838 277.049l-113.632 113.635h-170.457v227.275h170.457l113.632 113.635v-454.543z" p-id="8896"></path></svg>`;

  // 格式化日期
  function formatDate(date, offset = 0, spliter = '-') {
    let t = new Date(new Date(date).getTime() + 86400000 * offset);
    // yyyy-mm-dd
    return `${t.getFullYear()}${spliter}${t.getMonth()+1 >9 ? t.getMonth()+1 : '0'+(t.getMonth()+1)}${spliter}${t.getDate() >9 ? t.getDate() : '0'+t.getDate()}`;
  }

  // 获取最新的订单
  function getLatestOrder() {
    let dateStart = $('input[avalonctrl=dateStart]').length ? $('input[avalonctrl=dateStart]').val() : formatDate(new Date, -15);
    let dateEnd = $('input[avalonctrl=dateEnd]').length ? $('input[avalonctrl=dateEnd]').val() : formatDate(new Date);
    let csrfToken = document.cookie.match(/csrfToken=\w+/)[0].split('=')[1];

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://tb2cadmin.qunar.com/supplier/order.do?opType=getOrder&displayId=&selecttime=create&starttime=${dateStart}&stoptime=${dateEnd}&coupon=&product_name=&order_status=-1&refund_status=-1&purchase_order_status=-1&purchase_order_refund_status=-1&visa_status=-1&productId=&topicTour=&subTopic=&order_source=all&securityDepositStatus=-1&groupOrderStatus=-1&contact_user=&visit=-1&departure=&arrive=&contact_mobile=&csrfToken=${csrfToken}&od=&pageNo=1&perPageNo=10&groupNo=&reserve_order_status=-1`,
        responseType: "json",
        headers: {
          "content-type": "application/json;charset=UTF-8"
        },
        onload: function(response) {
          if (!response.response.data.errorInfo) {
            let latestOrder = response.response.data.content[0];
            resolve({
              id: latestOrder.display_id,
              status: latestOrder.orderStatus[0],
              title: latestOrder.title
            });
          }
        },
        onerror: function(response) {
          resolve(response);
        }
      });
    });
  }

  // 发通知
  function notify(orderJson, ntype){
    let noticeType = {
      1: "【新订单】",
      2: "【状态改变】"
    }
    GM_notification({
      title: `${noticeType[ntype]}去哪儿订单：${orderJson.status}`,
      text: orderJson.title,
      // image : "https://s.qunarzz.com/package_b2c_admin/tts/tips/action2.jpg",
      timeout: 1000 * 8,
      onclick: function() {
        window.focus();
        closeBell();
      }
    });
  }

  // 添加元素，需要手动关闭音效，点击即可关闭
  function createBell() {
    $("body").append(`
        <div id="newOrderBell" style="display:block;width:3.2em;height:3.2em;position:fixed;right:3em;top:5em;border: 0.3em solid #3775c0;border-radius:2em;padding:0.2em;cursor:pointer;">
        ${MUTEDICON}
        <audio id="newOrderAudio" style="display:none;">
        <source src="${NEWORDERSOUNDURL}" type="audio/ogg">
        </audio>
        </div>
    `);
    $("#newOrderBell").on("click", closeBell);
  }
  // 手动点击一下就关闭
  async function closeBell(isInit = false) {
    // 第一步，先更新订单ID
    let latestOrder = await getLatestOrder();
    if ((typeof latestOrder == 'object' && latestOrder.id.length == 25) || isInit) {
      GM_setValue("LATESTORDER", latestOrder);
      console.log("updated:", latestOrder);
    } else {
      return;
    }
    // 第二步，移除提醒
    $("#newOrderBell").remove();
  }

  // 检查新订单
  async function checkNewOrder() {
    let latestOrder = await getLatestOrder();
    let lastOrder = await GM_getValue("LATESTORDER", '');
    // console.log(latestOrder, lastOrder);
    if (latestOrder.id != lastOrder.id) {
      // 如果是订单有更新的，就发出叫声
      if ($("#newOrderBell").length) {
        try {
          // 因为Chrome 优化，不允许自动播放声音，所以只能改成通知形式了
          document.getElementById("newOrderAudio").play();
        } catch (error) {console.log(error);}
        notify(latestOrder, 1);
      } else {
        createBell();
      }
    } else if (latestOrder.status != lastOrder.status) {
      // 如果订单号不变，只是状态更新的，就只发通知
      notify(latestOrder, 2);
    } else if (!lastOrder) {
      closeBell(true);
    }
    console.log(new Date().toLocaleTimeString());
  }


  checkNewOrder();
  // 运行周期为10秒
  setInterval(checkNewOrder, 1000 * LOOPTIME);

})();