// ==UserScript==
// @name         Buff显示支付宝汇总余额
// @namespace    http://tampermonkey.net/
// @version      2024-08-08
// @description  可以自定义开始结束时间查询 银行卡收益，支付宝收益
// @author       hanshuqiang92@gmail.com
// @match        https://buff.163.com/user-center/asset/
// @match        https://buff.163.com/user-center/asset/recharge/
// @match        https://buff.163.com/user-center/asset/withdraw/
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjqFRDuBB24QeFyeIV8LAuabCvoz2d1vIFZD4h15NgIEKPFodEdoxmfxu_cQ&s
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505764/Buff%E6%98%BE%E7%A4%BA%E6%94%AF%E4%BB%98%E5%AE%9D%E6%B1%87%E6%80%BB%E4%BD%99%E9%A2%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/505764/Buff%E6%98%BE%E7%A4%BA%E6%94%AF%E4%BB%98%E5%AE%9D%E6%B1%87%E6%80%BB%E4%BD%99%E9%A2%9D.meta.js
// ==/UserScript==

GM_addStyle(
  `.my-popup{width:200px;display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background-color:white;padding:20px;border-radius:5px;box-shadow:0 0 10px rgba(0,0,0,0.5);z-index:1000;}.my-popup input{display:block;width:100%;margin-bottom:10px;padding:8px 0;border:1px solid #ccc;border-radius:3px;}.my-popup button{padding:8px 16px;background-color:#4CAF50;color:white;border:none;border-radius:3px;cursor:pointer;}`
);

(function () {
  "use strict";

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  ////增加了支付宝余额和银行卡余额，原来的位置不够了,所以宽度改成自动
  let cols = document.querySelectorAll(".user-header .col");
  cols.forEach((col) => {
    col.style.width = "auto";
  });

  /**创建余额dom */
  function createBalanceDom({ title, description, dom_id }) {
    let div = `<div class=col style=border:0><div class=info><div class=f_12px style=margin-bottom:6px>${title} <a class=j_tips_handler data-content=${description} data-direction=right data-title=设置 href=javascript:; id=${dom_id}_config><i class="icon icon_menu icon_menu_setting"></i></a></div><div style=margin-top:4px><strong class="f_18px f_Strong"id=${dom_id}_amount style=color:#4886ff>加载中...</strong></div></div></div> `;
    let dom = document.createElement("div");
    dom.innerHTML = div;
    return dom;
  }
  function createConfigDialogDom({ tag }) {
    let popup = document.createElement("div");
    popup.classList.add("my-popup");
    popup.innerHTML = `开始日期： <input type="date" id="btn_${tag}_config_start" placeholder="开始日期">结束日期：  <input type="date" id="btn_${tag}_config_end" placeholder="结束日期"><button id="btn-${tag}-save">保存</button> `;

    // 点击div显示弹框
    document
      .getElementById(`btn_${tag}_config`)
      .addEventListener("click", function () {
        popup.style.display = "block";
      });

    // 保存按钮点击事件
    popup.addEventListener("click", function (event) {
      if (event.target.id === `btn-${tag}-save`) {
        // 获取输入框的值
        let value1 = document.getElementById(`btn_${tag}_config_start`).value;
        let value2 = document.getElementById(`btn_${tag}_config_end`).value;

        // 保存到本地存储
        GM_setValue(`btn_${tag}_config_start`, value1 + " 00:00:00");
        GM_setValue(`btn_${tag}_config_end`, value2 + " 23:59:59");

        // 关闭弹框
        popup.style.display = "none";
      }
    });
    return popup;
  }
  /** 初始化支付宝余额模块 */
  function initZFB() {
    let zfb_dom = createBalanceDom({
      title: "余额-支付宝",
      description: "设置指定时间段的支付宝余额汇总，提示作用",
      dom_id: "btn_zfb",
    });
    document.querySelector(".user-header > div").appendChild(zfb_dom);

    function initDialogZfb() {
      let popup = createConfigDialogDom({ tag: "zfb" });
      popup.addEventListener("click", () => {
        fetchAllPageData();
      });
      // 将弹框添加到页面
      document.body.appendChild(popup);

      let value1 = GM_getValue("btn_zfb_config_start");
      let value2 = GM_getValue("btn_zfb_config_end");
      if (value1) {
        document.getElementById("btn_zfb_config_start").value = value1.replace(
          " 00:00:00",
          ""
        );
      }
      if (value2) {
        document.getElementById("btn_zfb_config_end").value = value2.replace(
          " 23:59:59",
          ""
        );
      }
    }
    function fetchAllPageData() {
      let currentPage = 1;
      let totalPages = 1;
      let allData = [];
      document.getElementById("btn_zfb_amount").innerText = "加载中...";

      async function fetchPageData() {
        let btn_zfb_config_start = GM_getValue("btn_zfb_config_start");
        let btn_zfb_config_end = GM_getValue("btn_zfb_config_end");

        let params = {
          page_num: currentPage,
          pay_category: "alipay_zft",
          log_category: "sell",
          start_time: new Date(btn_zfb_config_start).getTime() / 1000,
          end_time: new Date(btn_zfb_config_end).getTime() / 1000,
          _: Date.now(),
        };

        try {
          const response = await new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
              method: "GET",
              url: `https://buff.163.com/api/asset/settle/log/?page_num=${params.page_num}&pay_category=${params.pay_category}&log_category=${params.log_category}&start_time=${params.start_time}&end_time=${params.end_time}&_=${params._}`,
              onload: (response) => resolve(response),
              onerror: (error) => reject(error),
            });
          });

          const data = JSON.parse(response.responseText);
          if (Array.isArray(data?.data?.items)) {
            data.data.items.forEach((item) => {
              allData.push(item);
            });
          }

          totalPages = data?.data?.total_page || 0;

          if (currentPage < totalPages) {
            currentPage++;
            await delay(4000);
            await fetchPageData(); // 递归调用
          } else {
            // 所有数据获取完成
            console.log("所有收入：", allData);
            const totalAmount = allData.reduce((acc, item) => {
              return acc + parseFloat(item.amount);
            }, 0);
            document.getElementById("btn_zfb_amount").innerText =
              "￥" + totalAmount.toFixed(2);
          }
        } catch (error) {
          console.error("请求失败：", error);
        }
      }
        
        fetchPageData();
    }
    initDialogZfb();
    fetchAllPageData();
  }
  /** 初始化银行卡余额模块 */
  function initBank() {
    let bank_dom = createBalanceDom({
      title: "余额-银行卡",
      description: "设置指定时间段的银行卡余额汇总，提示作用",
      dom_id: "btn_bank",
    });
    document.querySelector(".user-header > div").appendChild(bank_dom);

    function fetchAllPageData() {
      let currentPage = 1;
      let totalPages = 1;
      let allData = [];
      document.getElementById("btn_bank_amount").innerText = "加载中...";
      async function fetchPageData() {
        let btn_bank_config_start = GM_getValue("btn_bank_config_start");
        let btn_bank_config_end = GM_getValue("btn_bank_config_end");

        let param = {
          page_num: currentPage,
          pay_category: "epay",
          log_category: "sell",
          start_time: new Date(btn_bank_config_start).getTime() / 1000,
          end_time: new Date(btn_bank_config_end).getTime() / 1000,
          _: Date.now(),
        };
        console.log("buff-银行卡列表接口参数：", param);
        try {
          const response = await new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
              method: "GET",
              url: `https://buff.163.com/api/asset/flow/log/?page_num=${param.page_num}&pay_category=epay&log_category=sell&start_time=${param.start_time}&end_time=${param.end_time}&_=${param._}`,
              onload: (response) => resolve(response),
              onerror: (error) => reject(error),
            });
          });

          const data = JSON.parse(response.responseText);
          if (Array.isArray(data?.data?.items)) {
            data.data.items.forEach((item) => {
              allData.push(item);
            });
          }

          totalPages = data?.data?.total_page || 0;

          if (currentPage < totalPages) {
            currentPage++;
            await delay(4000);
            await fetchPageData(); // 递归调用
          } else {
            // 所有数据获取完成
            console.log("所有收入：", allData);
            const totalAmount = allData.reduce((acc, item) => {
              return acc + parseFloat(item.cash_amount_diff);
            }, 0);
            document.getElementById("btn_bank_amount").innerText =
              "￥" + totalAmount.toFixed(2);
          }
        } catch (error) {
          console.error("请求失败：", error);
        }
      }

      fetchPageData();
    }

    let popup = createConfigDialogDom({ tag: "bank" });
    popup.addEventListener("click", () => {
      fetchAllPageData();
    });
    // 将弹框添加到页面
    document.body.appendChild(popup);

    // 将弹框添加到页面
    document.body.appendChild(popup);

    let value1 = GM_getValue("btn_bank_config_start");
    let value2 = GM_getValue("btn_bank_config_end");
    if (value1) {
      document.getElementById("btn_bank_config_start").value = value1.replace(
        " 00:00:00",
        ""
      );
    }
    if (value2) {
      document.getElementById("btn_bank_config_end").value = value2.replace(
        " 23:59:59",
        ""
      );
    }

    fetchAllPageData();
  }

  initZFB();
  initBank();
})();
