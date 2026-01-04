// ==UserScript==
// @name         buff filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  buff filter!
// @author       You
// @match        https://buff.163.com/*
// @icon         https://g.fp.ps.netease.com/market/file/59b156975e6027bce06e8f6ceTyFGdsj
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license
// @downloadURL https://update.greasyfork.org/scripts/454009/buff%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/454009/buff%20filter.meta.js
// ==/UserScript==
(function () {
  "use strict";
  /**
   * 模板字符串
   */
  // 将内容插入到body
  let fixedBtnHtml = `
    <div
      id="zy_fixed_btn"
      class="fixed-btn"
      style="
        position: fixed;
        right: 6px;
        top: 80px;
        height: 60px;
        width: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background: #343e4b;
        color: #959595;
        transition: right .3s ease-in-out;
      "
    >
      <span>搜索</span>
    </div>
    <div
      id="zy_search_content"
      class="zy-search-content"
      style="
        position: fixed;
        right: -400px;
        top: 80px;
        height: 400px;
        width: 400px;
        background: #fff;
        transition: right .3s ease-in-out;
        z-index: 99;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      "
    >
      <div id="zy_item_id" class="zy-form-item" style="margin: 10px 0;">
        <label>饰品序号：</label><input type="text" placeholder="url里面的id" />
      </div>
      <div id="zy_template_id" class="zy-form-item" style="margin: 10px 0;">
        <label>图案模板：</label
        ><textarea type="text" placeholder="搜索模板序号"></textarea>
      </div>
      <div id="zy_form_btn" class="zy-form-btn" style="margin: 10px 0;padding: 10px;border: 1px solid #000;cursor: pointer;">开始检索</div>
    </div>
  `;

  let tableHeaderHtml = `
    <tr>
      <th width="20"></th>
      <th width="100">饰品</th>

      <th style="min-width: 100px" class="t_Left">
        <span>磨损度<i class="icon icon_order"></i></span>
      </th>

      <th style="min-width: 120px" class="t_Left">
        <span>卖家<i class="icon icon_order"></i></span>
      </th>

      <th style="min-width: 100px" class="t_Left">
        <span>价格<i class="icon icon_order"></i></span>
      </th>

      <th width="220" class="t_Left">操作</th>
    </tr>
  `;

  let bodyEl = document.querySelector("body");
  bodyEl.insertAdjacentHTML("afterbegin", fixedBtnHtml);

  // 表格元素
  let listTbCsgoEl = document.querySelector(".detail-tab-cont .list_tb_csgo");

  // 为搜索内容添加动画和点击事件
  let fixedBtnEl = document.querySelector("#zy_fixed_btn");
  let searchContentEl = document.querySelector("#zy_search_content");

  fixedBtnEl.addEventListener("click", toggleVisible);

  //如果已经在单个饰品页面下直接给input赋值
  let { itemId } = getItemInfoFromUrl();
  if (itemId) {
    let formItemIdEl = document.querySelector("#zy_item_id input");
    formItemIdEl.value = itemId;
  }

  // 搜索按钮绑定事件
  let searchBtn = document.querySelector("#zy_form_btn");
  searchBtn.addEventListener("click", search);

  // 检索按钮事件
  function search() {
    // 清空原先表单
    clearTabel();
    // 把表头插入到表格里
    insertTrHeader();
    // 获取表单值
    let formItemIdEl = document.querySelector("#zy_item_id input");
    let formItemId = formItemIdEl.value;

    let formTemplateIdEl = document.querySelector("#zy_template_id textarea");
    let formTemplateIds = formTemplateIdEl.value;
    let templateIdArr = formTemplateIds?.split(",");
    if (templateIdArr) {
      for (let item of templateIdArr) {
        let url = `https://buff.163.com/api/market/goods/sell_order?game=csgo&goods_id=${formItemId}&paintseed=${item}&_=1662535704455`;
        console.log("listen url", url);
        // 发起请求
        request({ url }).then((res) => {
          let result = JSON.parse(res)
          if (result && result.code === "OK" && result.data && result.data.items.length > 0) {
            addToTabel(result.data, formItemId);
          }
        });
      }
    }
  }

  // 搜索页面是否显示
  function toggleVisible() {
    if (fixedBtnEl.style.right === "6px") {
      fixedBtnEl.style.right = "406px";
      searchContentEl.style.right = "0";
    } else {
      fixedBtnEl.style.right = "6px";
      searchContentEl.style.right = "-400px";
    }
  }

  // 根据url获取当前饰品信息
  function getItemInfoFromUrl() {
    let curUrl = window.location.href;
    let urlArr = curUrl.split("/");
    let urlLastStr = urlArr[urlArr.length - 1];
    let itemId = "";
    if (urlLastStr) {
      itemId = urlLastStr.split("?")[0] || "";
    }
    return { itemId };
  }

  // 请求封装为promise
  function request({ url, type = "GET", params, myHeader }) {
    var p = new Promise((resolve, reject) => {
      let headers = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      };
      if (myHeader) {
        headers = myHeader;
      }
      GM_xmlhttpRequest({
        method: type,
        url: url,
        headers,
        data: params,
        onload: function (response) {
          resolve(response.responseText);
        },
        onerror: function (response) {
          reject("请求失败");
        },
      });
    });
    return p;
  }

  // 情况原先的表格内容
  function clearTabel() {
    let listTbCsgoEl = document.querySelector(".detail-tab-cont .list_tb_csgo");
    listTbCsgoEl.innerHTML = "";
  }

  // 将表头插入到表格中
  function insertTrHeader() {
    let listTbCsgoEl = document.querySelector(".detail-tab-cont .list_tb_csgo");
    listTbCsgoEl.insertAdjacentHTML("afterbegin", tableHeaderHtml);
  }

  // 将查询到的数据插入tabel
  function addToTabel(res ,formItemId) {
    let items = res.items;
    for (let item of items) {
      let tableTrHtml = `
<tr id="sell_order_${item.id}" class="selling" data-coupon-infos="">
  <td></td>
  <td class="img_td">
    <div
      class="pic-cont item-detail-img"
      data-classid="${item.asset_info.classid}"
      data-instanceid="${item.asset_info.instanceid}"
      data-assetid="${item.asset_info.assetid}"
      data-contextid="${item.asset_info.contextid}"
      data-appid="${item.asset_info.appid}"
      data-timeout="1"
      data-orderid="${item.id}"
      data-origin="selling-list"
      style="
        display: flex;
        background-image: url('https://spect.fp.ps.netease.com/file/613abf6309463c49b9c8aa93Mt9e2tVQ03');
        background-position: center;
      "
      data-src_url_background="https://buff.163.com/static/images/item_bg.png"
      data-inspect_trn_url_background="https://spect.fp.ps.netease.com/file/613abf6309463c49b9c8aa93Mt9e2tVQ03"
    >
      <img
        class=""
        src="${item.img_src + res.fop_str}"
        data-original=""
        data-src_url="${res.goods_infos[formItemId].icon_url}"
        data-inspect_trn_url="${item.img_src + res.fop_str}"
        width="72"
        height="48"
        style="
          object-fit: contain;
          max-width: 80%;
          margin: auto;
          max-height: 80%;
        "
      />

      <a
        href="javascript:;"
        class="csgo_inspect_img_btn csgo-inspect-view"
        data-assetid="${item.asset_info.assetid}"
        data-inspecturl="${item.asset_info.info.inspect_url}"
        data-inspectversion="${item.asset_info.info.inspect_version}"
        data-inspectsize="${item.asset_info.info.inspect_size}"
        data-contextid="${item.asset_info.contextid}"
        ><i class="icon icon_zoom"></i
      ></a>
    </div>
  </td>
  <td class="t_Left">
    <div class="name-cont wear">
      <div class="csgo_value">
        <div class="wear-value">磨损: ${item.asset_info.paintwear}</div>
        <a class="ctag btn_3d" data-assetid="${item.asset_info.assetid}"><b><i class="icon icon_3d"></i></b>3D检视</a>
        <a class="ctag btn_game_cms" data-assetid="${item.asset_info.assetid}" target="_blank"><b><i class="icon icon_game"></i></b>社区服检视</a>
      </div>

      <div class="csgo_sticker has_wear t_Left"></div>
    </div>
  </td>
  <td class="t_Left">
    <a
      href="/shop/${item.user_id}?store_game=csgo"
      class="j_shoptip_handler"
      data-shop="|"
    >
      <img
        src="${res.user_infos[item.user_id].avatar}"
        width="30"
        height="30"
        class="user-thum"
        onerror="this.src='${
          res.user_infos[item.user_id].avatar_safe
        }';this.onerror=null"
      />
${res.user_infos[item.user_id].nickname}
    </a>
  </td>

  <td class="t_Left">
    <div style="display: table-cell">
      <strong class="f_Strong">¥ ${item.price}</strong>
      <p class="hide-cny"><span class="c_Gray f_12px">(¥ ${
        item.price
      })</span></p>
    </div>

    <div style="display: table-cell; vertical-align: middle; padding-left: 3px">
      <i class="icon icon_payment_alipay" title="支持BUFF余额-支付宝"></i>

      <i class="icon icon_payment_others" title="支持BUFF余额-银行卡"></i>
    </div>
  </td>
  <td class="t_Left">
    <a
      href="#"
      class="i_Btn i_Btn_mid2 btn-buy-order"
      data-goodsid="${item.goods_id}"
      data-price="${item.price}"
      data-orderid="${item.id}"
      data-sellerid="${item.user_id}"
      data-goods-name="${res.goods_infos[formItemId].name}"
      data-goods-sell-min-price="--"
      data-goods-icon-url="${res.goods_infos[formItemId].icon_url}"
      data-cooldown="${item.asset_info.has_tradable_cooldown}"
      data-mode="${item.mode}"
      data-asset-info='${JSON.stringify(item.asset_info)}'
      >购买</a
    >

    &nbsp;
    <span
      style="cursor: pointer"
      class="add-bookmark"
      data-target-type="3"
      data-target-id="${item.id}"
      title="关注饰品"
      ><i class="icon icon_focus"></i
    ></span>
    <span
      style="cursor: pointer; display: none"
      class="delete-bookmark"
      data-target-type="3"
      data-target-id="${item.id}"
      title="取消关注"
      ><i class="icon icon_focus on"></i
    ></span>

    <a
      href="javascript:"
      class="c_Blue2 bargain gM6"
      data-goodsid="${item.goods_id}"
      data-price="${item.price}"
      data-orderid="${item.id}"
      data-sellerid="${item.user_id}"
      data-goods-name="${res.goods_infos[formItemId].name}"
      data-lowest-bargain-price="--"
      data-goods-icon-url="${res.goods_infos[formItemId].icon_url}"
      data-mode="${item.mode}"
      data-asset-info='${JSON.stringify(item.asset_info)}'
      >还价</a
    >
  </td>
</tr>
      `;
      let listTbCsgoEl = document.querySelector(
        ".detail-tab-cont .list_tb_csgo"
      );
      listTbCsgoEl.insertAdjacentHTML("beforeend", tableTrHtml);
    }
  }
})();

