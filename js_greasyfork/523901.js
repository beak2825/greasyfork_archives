// ==UserScript==
// @name         1688详情获取
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  从1688详情页获取销量等数据并上报
// @author       You
// @match        https://detail.1688.com/offer/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1688.com
// @grant        none
// @require      https://update.greasyfork.org/scripts/454265/1113258/Axios.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523901/1688%E8%AF%A6%E6%83%85%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/523901/1688%E8%AF%A6%E6%83%85%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

const request = axios.create({
  baseURL: "https://huo.duobaogongxiao.com",
});

const ssidKey = "duobaogongxiao-ssid";
let ssid = localStorage.getItem(ssidKey);

const post = async (url, params) => {
  const { data } = await request.post(url, {
    ...params,
    ssid,
  });
  if (!data.success) {
    if (data.data.code === 400) {
      const r = window.prompt("请输入登录多宝供销后的ssid");
      if (r) {
        localStorage.setItem(ssidKey, r);
        location.reload();
      }
    }
    return;
  }
  return data.data || true;
};

async function getOfferStatisfactionService() {
  return new Promise((resolve) => {
    const api = "mtop.mbox.fc.common.gateway";
    const v = "1.0";

    // data
    const fcGroup = "offer-cbu";
    const fcName = "offerdetail-service";
    // 拼fcArgs
    const serviceName = "offerSatisfactionService";
    const memberId = window.__INIT_DATA.globalData.offerBaseInfo.sellerMemberId;
    const sellerId = window.__INIT_DATA.globalData.offerBaseInfo.sellerUserId;
    const offerId = window.__INIT_DATA.globalData.offerBaseInfo.offerId;
    const isSignedForTm = false;

    const fcArgs = {
      serviceName,
      params: {
        memberId,
        sellerId,
        offerId,
        isSignedForTm,
      },
    };

    const ecode = 0;
    const type = "GET";
    const isSec = "0";
    const timeout = 20000;

    const params = {
      api,
      v,
      data: {
        fcGroup,
        fcName,
        fcArgs: JSON.stringify(fcArgs),
      },
      ecode,
      type,
      isSec,
      timeout,
    };

    window.lib.mtop.request(params, resolve);
  });
}

async function getDsrRateData() {
  return new Promise((resolve) => {
    const api = "mtop.1688.trade.service.MtopRateService.queryDsrRateDataV2";
    const offerId = window.__INIT_DATA.globalData.offerBaseInfo.offerId;
    const loginId = window.__INIT_DATA.globalData.offerBaseInfo.sellerLoginId;
    const scene = "item";
    const v = "1.0";
    const ecode = 0;
    const type = "GET";
    const isSec = "0";
    const timeout = 20000;
    const params = {
      api,
      v,
      data: {
        offerId,
        loginId,
        scene,
      },
      ecode,
      type,
      isSec,
      timeout,
    };

    window.lib.mtop.request(params, resolve);
  });
}

async function getAdviseList() {
  return new Promise((resolve) => {
    const api = "mtop.alibaba.cbu.distribute.proxyAdvice.query";
    const v = "1.0";
    const offerId = window.__INIT_DATA.globalData.offerBaseInfo.offerId;
    const data = JSON.stringify({ offerId });
    const ecode = 0;
    const type = "GET";
    const isSec = "0";
    const timeout = 20000;
    const dataType = "jsonp";

    const params = {
      api,
      v,
      data,
      ecode,
      type,
      isSec,
      timeout,
      dataType,
    };

    window.lib.mtop.request(params, resolve);
  });
}

async function getOfferDetailAndSubmit() {
  const button = document.getElementById("getOfferDetailBtn");
  button.onclick = null;
  button.innerText = "正在获取商品数据...";
  try {
    console.log("获取数据中...");
    const [r1, r2, r3] = await Promise.all([
      getOfferStatisfactionService(),
      getDsrRateData(),
      getAdviseList(),
    ]);
    const offerSatisfactionService = r1.data.result;

    const dsrRateData = {
      goodRates: r2.data.model?.goodRates,
      goodsGrade: r2.data.model?.goodsGrade,
    };

    const adviseList = r3.data.data.adviseList;
    const adviseData = {
      orderCnt30d: adviseList.find((i) => i.key === "orderCnt30d")?.value,
      outDistributeCnt: adviseList.find((i) => i.key === "outDistributeCnt")
        ?.value,
      offerDelivery48hRate: adviseList.find(
        (i) => i.key === "offerDelivery48hRate"
      )?.value,
      offerReturnBackRate: adviseList.find(
        (i) => i.key === "offerReturnBackRate"
      )?.value,
      distributorCnt: adviseList.find((i) => i.key === "distributorCnt").value,
    };

    const res = {};

    const initData = window.__INIT_DATA;

    // 评价数，平均星级
    if (offerSatisfactionService) {
      res.averageStarLevel = offerSatisfactionService.averageStarLevel;
      res.totalStr = offerSatisfactionService.totalsStr;
    }

    // 成交数，标签
    const components = initData.data;
    const titleComponent = Object.values(components).find(
      (i) => i.componentType === "@ali/tdmod-od-pc-offer-title"
    );
    if (titleComponent) {
      res.saleCountDate = titleComponent.data.saleCountDate;
      res.saleNum = titleComponent.data.saleNum;
      res.tagList = titleComponent.data.tagList;
    }

    // 好评率，商品评分
    if (dsrRateData) {
      res.goodRates = dsrRateData.goodRates;
      res.goodsGrade = dsrRateData.goodsGrade;
    }

    // 一件代发数据
    res.adviseList = adviseList;

    // memberId
    res.sellerMemberId = initData.globalData.offerBaseInfo.sellerMemberId;
    res.sellerLoginId = initData.globalData.offerBaseInfo.sellerLoginId;
    res.sellerUserId = initData.globalData.offerBaseInfo.sellerUserId;

    // 店铺名
    const storeData = window.__STORE_DATA;
    res.companyId = storeData.components[38229149].moduleData.companyId;
    res.companyLogo = storeData.components[38229149].moduleData.companyLogo;
    res.companyName = storeData.components[38229149].moduleData.companyName;

    // 商品id
    res.offerId = initData.globalData.offerBaseInfo.offerId.toString();
    res.url = `https://detail.1688.com/offer/${res.offerId}.html`;

    const r = await post("/api/staff/alibaba/scrapy/item", {
      item_id: res.offerId,
      origin_data: res,
    });
    if (r) {
      button.innerText = "上报商品数据成功，点击重新获取";
    } else {
      button.innerText = "上报商品数据失败，点击重新获取";
    }
  } finally {
    button.onclick = getOfferDetailAndSubmit;
  }
}

async function syncShopInfo() {
  return new Promise((resolve) => {
    const api = "mtop.alibaba.alisite.cbu.server.ModuleAsyncService";
    const componentKey = "wp_pc_common_header";
    const memberId = window.__INIT_DATA.globalData.offerBaseInfo.sellerMemberId;
    const v = "1.0";
    const ecode = 0;
    const type = "GET";
    const valueType = "string";
    const dataType = "jsonp";
    const timeout = 10000;
    const params = {
      api,
      data: {
        componentKey,
        params: JSON.stringify({ memberId }),
      },
      v,
      ecode,
      type,
      valueType,
      dataType,
      timeout,
    };
    window.lib.mtop.request(params, resolve);
  });
}

function getRate(item) {
  const url = item.shopInfo.components[38229149]?.moduleData?.rateLogoUrl;
  const map = {
    "https://img.alicdn.com/imgextra/i3/O1CN01T5zgtS1V1dhYutHVi_!!6000000002593-2-tps-258-48.png": 5,
    "https://img.alicdn.com/imgextra/i4/O1CN01PTeVOc1oYatudXmMd_!!6000000005237-2-tps-102-48.png": 2,
    "https://img.alicdn.com/imgextra/i3/O1CN013rsGQ71F7YyIpYNV9_!!6000000000440-2-tps-206-48.png": 4,
    "https://img.alicdn.com/imgextra/i2/O1CN01Cajyip21870KaCypF_!!6000000006939-2-tps-231-72.png": 3,
    "https://img.alicdn.com/imgextra/i2/O1CN01AUrNmz1Mb3n1wG6Z1_!!6000000001452-2-tps-48-48.png": 1,
  };
  return map[url] || "未知";
}

function getCustomerStar(item) {
  return item.shopInfo.components[38229149]?.moduleData?.appData?.customerStar;
}

function getServiceScore(item, key) {
  const service = item.serviceStarList.find((i) => i.serviceKey === key);
  if (service) {
    return service.score;
  }
  return "未知";
}
// 售后体验/退换体验
function getRDFValue(item) {
  return getServiceScore(item, "rdf_group_value_new");
}

// 商品体验/品质体验
function getGoodsValue(item) {
  return getServiceScore(item, "goods_group_value");
}

// 物流体验/物流时效
function getLGTValue(item) {
  return getServiceScore(item, "lgt_group_value_new");
}

// 纠纷解决
function getDSPTValue(item) {
  return getServiceScore(item, "dspt_group_value");
}

// 采购咨询/咨询体验
function getCSTValue(item) {
  return getServiceScore(item, "cst_group_value_new");
}

function getIsShili(item) {
  if (
    item.shopInfo.components?.[38229149]?.moduleData?.isShili === "true" ||
    item.shopInfo.components?.[38229149]?.moduleData?.isShili === true
  ) {
    return true;
  }
  return false;
}

function getIsSuperFactory(item) {
  if (
    item.shopInfo.components?.[38229149]?.moduleData?.superFactory === "true" ||
    item.shopInfo.components?.[38229149]?.moduleData?.superFactory === true
  ) {
    return true;
  }
  return false;
}

const specialTags = ["入围2024必找工厂榜", "入围2024金牌制造榜"];

function getTags(item) {
  return (
    item.shopInfo.components[38229149]?.moduleData?.factoryInfo?.shopTag
      .map((i) => i.text)
      .join(",") || ""
  );
}

async function getShopInfoAndSubmit() {
  const button = document.getElementById("getShopInfoBtn");
  button.onclick = null;
  button.innerText = "正在获取店铺数据...";
  try {
    console.log("获取店铺数据中...");
    const { data } = await syncShopInfo();
    const originData = {
      sellerLoginId: window.__INIT_DATA.globalData.offerBaseInfo.sellerLoginId,
      sellerMemberId:
        window.__INIT_DATA.globalData.offerBaseInfo.sellerMemberId,
      sellerUserId: window.__INIT_DATA.globalData.offerBaseInfo.sellerUserId,
      shopInfo: window.__STORE_DATA,
      serviceStarList: data.lindormDataModel.serviceStarList,
    };

    const res = {
      sellerLoginId: originData.sellerLoginId,
      sellerUserId: originData.sellerUserId,
      sellerMemberId: data.memberId,
      shopName: data.companyName, // 店铺名
      tags: getTags(originData),
      tpYear: data.tpYear,
      shopTypeName: data.bizTypeName, // 经营类型
      shopAddress: data.address, // 地址
      rate: getRate(originData), // 交易勋章
      customerStar: getCustomerStar(originData), // 综合服务分
      retentionRate: `${data.retentionRate * 100}%`, // 回头率

      RDFValue: getRDFValue(originData), // 售后体验/退换体验
      goodsValue: getGoodsValue(originData), // 商品体验/品质体验
      LGTValue: getLGTValue(originData), // 物流体验/物流时效
      DSPTValue: getDSPTValue(originData), // 纠纷解决
      CSTValue: getCSTValue(originData), // 采购咨询/咨询体验

      isShili: getIsShili(originData), // 是否是实力商家
      isSuperFactory: getIsSuperFactory(originData), // 是否是超级工厂
    };

    const r = await post("/api/staff/alibaba/scrapy/seller", {
      member_id: res.sellerMemberId,
      origin_data: res,
    });
    if (r) {
      button.innerText = "上报店铺数据成功，点击重新获取";
    } else {
      button.innerText = "上报店铺数据失败，点击重新获取";
    }
  } finally {
    button.onclick = getShopInfoAndSubmit;
  }
}

(function () {
  "use strict";

  const button = document.createElement("button");
  button.id = "getOfferDetailBtn";
  button.innerText = "获取并上报商品数据";
  button.style = "position: fixed; bottom: 20px; right: 20px; z-index: 9999;";
  button.onclick = getOfferDetailAndSubmit;
  document.body.appendChild(button);

  const button2 = document.createElement("button");
  button2.id = "getShopInfoBtn";
  button2.innerText = "获取并上报店铺数据";
  button2.style = "position: fixed; bottom: 60px; right: 20px; z-index: 9999;";
  button2.onclick = getShopInfoAndSubmit;
  document.body.appendChild(button2);

  window.setTimeout(() => {
    getOfferDetailAndSubmit();
    getShopInfoAndSubmit();
  }, 3000);
})();
