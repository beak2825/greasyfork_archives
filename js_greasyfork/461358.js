// ==UserScript==
// @name         云图自定义人群导出
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2.1.2
// @description  云图扩展工具
// @author       siji
// @match        https://yuntu.oceanengine.com/yuntu_brand/ecom/analysis/audience/list?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest

// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/461358/%E4%BA%91%E5%9B%BE%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BA%BA%E7%BE%A4%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/461358/%E4%BA%91%E5%9B%BE%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BA%BA%E7%BE%A4%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  const button = document.createElement("div");
  button.textContent = "导出列表";
  Object.assign(button.style, {
    height: "34px",
    lineHeight: "var(--line-height, 34px)",
    alignItems: "center",
    color: "white",
    background: "rgb(47, 132, 254)",
    borderRadius: "5px",
    marginLeft: "10px",
    fontSize: "13px",
    padding: "0 10px",
    cursor: "pointer",
    fontWeight: "500",
  });
  button.addEventListener("click", () => {
    urlClick(0);
  }); //监听按钮点击事件

  const button2 = document.createElement("div");
  button2.textContent = "导出画像";
  Object.assign(button2.style, {
    height: "34px",
    lineHeight: "var(--line-height, 34px)",
    alignItems: "center",
    color: "white",
    background: "linear-gradient(60deg, rgb(95, 240, 225), rgb(47, 132, 254))",
    borderRadius: "5px",
    marginLeft: "10px",
    fontSize: "13px",
    padding: "0 10px",
    cursor: "pointer",
    fontWeight: "500",
  });
  button2.addEventListener("click", () => {
    urlClick(1);
  }); //监听按钮点击事件

  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "me";
  checkbox.checked = true;
  checkbox.style.marginLeft = "10px";

  var texts = document.createElement("span");
  texts.textContent = "仅导出当前帐号创建的";
  texts.style.height = "34px";
  texts.style.lineHeight = "34px";

  //获取industry_id
  let industry_id = null;

  (function listen() {
    var origin = {
      open: XMLHttpRequest.prototype.open,
      send: XMLHttpRequest.prototype.send,
    };
    XMLHttpRequest.prototype.open = function (a, b) {
      this.addEventListener("load", replaceFn);
      origin.open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (a, b) {
      origin.send.apply(this, arguments);
    };
    function replaceFn(obj) {
      if (
        this?._url?.slice(0, 42) == "/yuntu_ng/api/v1/get_brand_competitor_list"
      ) {
        industry_id = JSON.parse(obj?.target?.response).data[0].industry_id;
      }
    }
  })();

  //message.js
  let loadingMsg = null;

  //导出文件名
  let fileName = "";

  //默认GET请求
  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

  function appendDoc() {
    setTimeout(() => {
      var like_comment =
        document.getElementsByClassName("rowFlexBox-GWvhwN")[0];
      if (like_comment) {
        like_comment.append(button2); //把按钮加入到 x 的子节点中
        like_comment.append(button); //把按钮加入到 x 的子节点中
        like_comment.append(checkbox);
        like_comment.append(texts);
        return;
      }
      appendDoc();
    }, 1000);
  }
  appendDoc();

  //query参数获取
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }

  //封装网络请求
  async function fetchFun(url, data, requestOptions = getRequestOptions) {
    const params = new URLSearchParams(data).toString();
    try {
      const response = await fetch(`${url}?${params}`, requestOptions);
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error(`Fetch failed: ${response.status}`);
      }
    } catch (error) {
      loadingMsg.close();
      Qmsg.error({
        content: `网络请求错误: ${error.message}`,
        timeout: 5000,
      });
      throw error;
    }
  }

  function extractData(input) {
    let datas = input?.data?.data;
    const result = [];

    if (!datas) return result;

    datas.forEach((item) => {
      // 跳过无效数据
      if (!item.effectivePercentage || !item.tagDetailList?.length) return;

      item.tagDetailList.forEach((label) => {
        const newItem = {
          name: item.nameZh,
          label_id: label.tagID,
          name_zh: label.nameZh,
          value: (label.value * 100).toFixed(2) + "%", // 转换为百分比
          tgi: label.tgi?.toFixed(2),
          label_all_cnt: label.cnt,
        };

        result.push(newItem);

        // 处理城市数据的子标签
        if (label.TagExtra?.provinceCityList) {
          label.TagExtra.provinceCityList.forEach((cityLabel) => {
            const cityItem = {
              name: item.nameZh,
              label_id: cityLabel.tagID,
              name_zh: cityLabel.nameZh,
              value: (cityLabel.value * 100).toFixed(2) + "%",
              tgi: cityLabel.tgi?.toFixed(2),
              label_all_cnt: cityLabel.cnt,
            };

            result.push(cityItem);
          });
        }
      });
    });

    return result;
  }

  //活动数据获取
  async function getTabsData(e, pageInfo = { startPage: 1, endPage: 100 }) {
    let { startPage, endPage } = pageInfo;

    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    let search = document.querySelector(
      ".yuntu_analysis-input.yuntu_analysis-input-size-md"
    ).value;
    let data = {
      aadvid: getQueryVariable("aadvid"),
      page: startPage,
      limit: (+endPage - +startPage + 1) * 10,
      sort_param: "create_time",
      sort_type: 1,
      tag_list: "[]",
      source_list: '["0","1","2","3","4"]',
      operation_platform: "audience_insights",
    };

    if (checkbox.checked) {
      let operator_name = JSON.parse(
        localStorage.getItem("__Garfish__platform__kol_app_user") || "{name:''}"
      ).name;
      data.operator_name = operator_name;
    }

    if (search) {
      data.id_name = search;
    }

    let requestData = await fetchFun(
      "https://yuntu.oceanengine.com/yuntu_ng/api/old/audience_info/search",
      data
    );
    let res = requestData?.data?.audiences;
    let sheetData = res.map((v) => {
      if (v?.status == 2) {
        return {
          name: v.name,
          id: v.id,
          cover_num: v.cover_num,
          generate_brand_cdp_portrait_status:
            v.operator_status_dict.generate_brand_cdp_portrait_status,
        };
      } else {
        return {
          name: v.name,
          id: v.id,
          cover_num:
            v.status == 4
              ? v.cover_num
              : v.status == 13
                ? "等待计算"
                : "计算中",
          generate_brand_cdp_portrait_status:
            v.operator_status_dict.generate_brand_cdp_portrait_status,
        };
      }
    });
    if (e) {
      expPortrait(
        sheetData?.filter((v) => {
          return v.generate_brand_cdp_portrait_status === 0;
        })
      );
      return;
    }
    expList(sheetData);
  }

  const myHeaders = new Headers({
    authority: "yuntu.oceanengine.com",
    accept: "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9",
    "content-type": "application/json",
  });

  const appList = [0, 1128];

  async function expPortrait(sheetData) {
    let contrast = {
      标签类型: "name",
      标签: "name_zh",
      tgi: "tgi",
      占比: "value",
      // 抖音tgi: "tgi_dy",
      // 抖音占比: "value_dy",
    };

    async function getBrandId() {
      try {
        const response = await fetchFun(
          "https://yuntu.oceanengine.com/yuntu_ng/api/v1/mission/get_novice_task_record_info",
          {
            aadvid: getQueryVariable("aadvid"),
          }
        );
        return response?.data?.novice_task_record?.brand_id;
      } catch (error) {
        console.error("获取 brand_id 失败:", error);
        return null;
      }
    }

    async function getBCid(custom_audience_id, brand_id) {
      try {
        const response = await fetchFun(
          "https://yuntu.oceanengine.com/yuntu_ng/api/v1/GetAudienceBcId",
          {
            aadvid: getQueryVariable("aadvid"),
            custom_audience_id: custom_audience_id,
            brand_id: brand_id,
            level_1_industy_id: industry_id || "13",
          }
        );
        return response?.data?.bcId;
      } catch (error) {
        console.error("获取 BCid 失败:", error);
        return null;
      }
    }

    async function fetchAppData(app, v) {
      const brand_id = await getBrandId();
      if (!brand_id) {
        throw new Error("获取 brand_id 失败");
      }

      const bcID = await getBCid(v.id, brand_id);
      if (!bcID) {
        throw new Error(`获取人群 ${v.name} 的 BCid 失败`);
      }

      const raws = JSON.stringify({
        appType: app,
        coverNumber: v.cover_num,
        bcID: bcID,
        featureEnNames: [
          "gender",
          "age",
          "new_age_v2",
          "city",
          "yuntu_city_level",
          "cityLevel",
          "province",
          "ecom_big8_audience",
          "consuming_capacity",
          "phone_brand",
          "life_stage",
          "job",
          "phone_price_preference",
          "douyin_active_user",
          "toutiao_active_user",
          "xigua_active_user",
          "huoshan_active_user",
        ],
      });

      const postRequestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raws,
        redirect: "follow",
      };

      return await fetchFun(
        "https://yuntu.oceanengine.com/yuntu_ng/api/v1/crowd_portrait/GetPortraitByBCID",
        { aadvid: getQueryVariable("aadvid") },
        postRequestOptions
      );
    }

    try {
      const result = await Promise.all(
        sheetData?.map(async (v) => {
          const res = await Promise.all(
            appList?.map(async (app) => fetchAppData(app, v))
          );
          return res;
        })
      );

      let a = result.map((v) => {
        return extractData(v[0]);
      });

      let b = result.map((v) => {
        return extractData(v[1]);
      });

      function sortArray(array) {
        return array.sort((a, b) => {
          if (
            a.name === "抖音视频观看兴趣分类" &&
            b.name !== "抖音视频观看兴趣分类"
          ) {
            return 1;
          }
          if (
            a.name !== "抖音视频观看兴趣分类" &&
            b.name === "抖音视频观看兴趣分类"
          ) {
            return -1;
          }
          return 0;
        });
      }

      function mergeNestedInterestData(a, b) {
        const validNames = [
          "预测性别",
          "预测年龄段",
          "预测消费能力",
          "8大消费群体",
          "城市级别",
          "抖音视频观看兴趣分类",
          "电商品牌成交偏好",
          "电商品类成交偏好",
          "一级触点",
          "省份分布",
          "地域-城市",
        ];
        return a.map((arrA, index) => {
          const arrB = b[index];
          const bMap = new Map(arrB.map((item) => [item.label_id, item]));
          return sortArray(
            arrA
              .filter((item) => validNames.includes(item.name))
              .map((item) => {
                const matchedItem = bMap.get(item.label_id);
                if (matchedItem) {
                  return {
                    ...item,
                    value_dy: matchedItem.value,
                    tgi_dy: matchedItem.tgi,
                  };
                }
                return item;
              })
          );
        });
      }

      const reses = mergeNestedInterestData(a, b);

      let expData = reses.map((v, i) => {
        return {
          sheetName: sheetData[i].name,
          sheetData: Array.from(v),
          sheetHeader: Object.keys(contrast),
          sheetFilter: Object.values(contrast),
          columnWidths: [],
        };
      });

      expExcel(expData);
    } catch (error) {
      loadingMsg.close();
      Qmsg.error({
        content: `获取画像数据失败: ${error.message}`,
        timeout: 5000,
      });
      throw error;
    }
  }

  function expList(sheetData) {
    let contrast = {
      人群名称: "name",
      人群ID: "id",
      覆盖人数: "cover_num",
    };

    let datas = {
      sheetName: fileName,
      sheetData: Array.from(sheetData),
      sheetHeader: Object.keys(contrast),
      sheetFilter: Object.values(contrast),
      columnWidths: [],
    };

    if (sheetData.length) {
      expExcel([datas]);
    } else {
      loadingMsg.close();
      Qmsg.error({
        content: "导出数据为空！",
        timeout: 3000,
      });
    }
  }

  //提交数据到服务器
  function submitData(option) {
    //从localStorage获取statBaseUrl
    let statBaseUrl = localStorage.getItem("statBaseUrl");
    if (!statBaseUrl) {
      Qmsg.error("statBaseUrl获取失败，请联系管理员！");
      loadingMsg.close();
      return;
    }
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    setTimeout(() => {
      loadingMsg.close();
    }, 1000);
    //获取当前脚本名称
    const scriptName = GM_info.script.name;
    //使用GM.xmlHttpRequest将数据提交到后端服务器
    GM.xmlHttpRequest({
      method: "POST",
      url: statBaseUrl,
      data: JSON.stringify({
        ...option,
        plugins_name: scriptName,
        advertiser_id: getQueryVariable("aadvid"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
      onload: function (response) {
        let res = JSON.parse(response.responseText);
        if (res.code == "990") {
          Qmsg.success("数据已上传");
        } else {
          loadingMsg.close();
          Qmsg.error("数据上传失败，请联系管理员！");
        }
      },
      onerror: function (response) {
        Qmsg.error("数据上传失败，请联系管理员！");
        loadingMsg.close();
      },
    });
  }

  function expExcel(sheetData) {
    let option = {};
    option.fileName = fileName;
    option.datas = sheetData;

    submitData(option);
  }

  function urlClick(e) {
    fileName = `人群${e ? "画像" : "列表"}`;
    if (e) {
      try {
        let res = prompt("页码，例: 1,2 （起始页和结束页中间用英文逗号分隔）");
        if (res) {
          let [startPage, endPage] = res.split(",");
          startPage = parseInt(startPage);
          endPage = parseInt(endPage);
          if (isNaN(startPage) || isNaN(endPage) || endPage < startPage) {
            throw new Error("页码格式错误！");
          }
          getTabsData(e, { startPage, endPage });
        }
      } catch (err) {
        Qmsg.error(err.message);
      }
    } else {
      getTabsData(e);
    }
  }
})();
