// ==UserScript==
// @name         同步代发订单
// @namespace    www.baojia.gonghuo168.com
// @version      0.3
// @description  内部使用的脚本
// @author       Rick
// @match        https://szqbh.3cerp.com/index.htm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gonghuo168.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      baojia-test.gonghuo168.com
// @connect      www.baojia.gonghuo168.com
// @connect      https://szqbh.3cerp.com/pages/
// @grant        GM_addStyle
// @grant        GM_setValue
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/480669/%E5%90%8C%E6%AD%A5%E4%BB%A3%E5%8F%91%E8%AE%A2%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/480669/%E5%90%8C%E6%AD%A5%E4%BB%A3%E5%8F%91%E8%AE%A2%E5%8D%95.meta.js
// ==/UserScript==
(function () {
  "use strict";
  // 创建按钮元素

  var button = document.createElement("button");
  button.innerHTML = "同步代发订单";
  button.style.position = "relative";
  button.style.top = "5px";
  button.style.left = "40px";
  button.style.cursor = "pointer";
  button.addEventListener("mouseover", function () {
    // 显示提示信息
    var tooltip = document.createElement("div");
    tooltip.innerHTML = `
            ① 没有选择"找人代发"时请勿操作!!!<br>
            ② 等待数据加载完毕后再进行操作!!!<br>
            ③ 请求成功会有提示.<br>
            ④ 如果操作无反应,请刷新页面重试!<br>`;
    tooltip.style.cssText = `
              position: absolute;
              top: 30px;
              left: 0;
              background: #f0dbdb;
              color: red;
              padding: 5px;
              z-index: 9999;
              width: 240px;
              text-align: left;
              line-height: 1.5;`;
    button.appendChild(tooltip);
  });
  // 移除悬停提示
  button.addEventListener("mouseout", function () {
    // 移除提示信息
    var tooltip = button.querySelector("div");
    if (tooltip) {
      button.removeChild(tooltip);
    }
  });

  button.addEventListener("click", function () {
    var tabsBodys = document.getElementsByClassName("mini-tabs-bodys");
    var menuName;

    for (var i = 0; i < tabsBodys.length; i++) {
      var tabBody = tabsBodys[i];
      var divs = tabBody.getElementsByTagName("div");
      for (var j = 0; j < divs.length; j++) {
        var div = divs[j];
        var divId = div.id;
        if (
          divId &&
          divId.startsWith("mini-1$body$") &&
          divId !== "mini-1$body$1"
        ) {
          var iframe = div.getElementsByTagName("iframe")[0];
          var iframeDoc =
            iframe.contentDocument || iframe.contentWindow.document;
          var nestedIframes = iframeDoc.getElementsByTagName("iframe");
          console.log(nestedIframes);
          if (nestedIframes.length == 0) {
            console.log(new URLSearchParams(iframe.src).get("menu_name"));
            if (
              new URLSearchParams(iframe.src).get("menu_name") === "找人代发"
            ) {
              button.disabled = true;
              button.innerHTML = "数据导入中...";

              // 创建一个固定定位的 div 元素，设置其样式使其居中显示在页面中
              var progressDiv = document.createElement("div");
              progressDiv.style.position = "fixed";
              progressDiv.style.top = "50%";
              progressDiv.style.left = "50%";
              progressDiv.style.width = "300px"; // 设置宽度
              progressDiv.style.transform = "translate(-50%, -50%)";

              // 创建一个表示进度条的 div 元素，设置其样式，大小和动画效果
              var progressBar = document.createElement("div");
              progressBar.style.width = "50%";
              progressBar.style.height = "15px";
              progressBar.style.backgroundColor = "#ccc";
              progressBar.style.borderRadius = "5px";
              progressBar.style.overflow = "hidden";
              progressBar.style.position = "relative";
              progressBar.style.transition = "width 0.5s ease-in-out";

              // 创建一个表示进度的子 div 元素，初始化宽度为 0%，高度为 100%，并设置背景颜色为绿色，然后将其添加到进度条元素中
              var progress = document.createElement("div");
              progress.style.width = "10%";
              progress.style.height = "100%";
              progress.style.backgroundColor = "#27ae60";
              progress.style.position = "absolute";
              progress.style.top = "0";
              progress.style.left = "0";
              progress.style.transition = "width 0.5s ease-in-out";

              // 将进度条进度元素添加到进度条元素中
              progressBar.appendChild(progress);

              // 将进度条元素添加到 div 中
              progressDiv.appendChild(progressBar);

              // 将 div 插入到页面中
              document.body.appendChild(progressDiv);

              let iframeDeliver =
                iframe.contentDocument || iframe.contentWindow.document;
              let centerDivDeliver = iframeDeliver.getElementById("center");
              let shopValue =
                iframeDeliver.getElementById("shop_id$text").value;
              let beginDateValue =
                iframeDeliver.getElementById("beginDate$value").value;
              let endDateValue =
                iframeDeliver.getElementById("endDate$value").value;
              let c_product_goods_sku = iframeDeliver.getElementById(
                "c_product_goods_sku$text"
              ).value;
              let postData = {
                c_delivery_info: "",
                b_finish: 0,
                shop_id: "",
                beginDate: beginDateValue,
                endDate: endDateValue,
                search_billcode_key: "c_platform_billcode",
                search_billcode_filter: "",
                search_vip_key: "c_vip_code",
                search_vip_filter: "",
                c_product_goods_sku: c_product_goods_sku,
                b_check: 0,
                search_b_hold: 0,
                pageIndex: 0,
                pageSize: 5000,
                sortField: "",
                sortOrder: "",
              };
              var formData = new URLSearchParams(postData).toString();
              //if (centerDivDeliver &&(shopValue==58||shopValue==63)){}
              function fetchDataAndProcess(callback) {
                try {
                  GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://szqbh.3cerp.com/pages/net/delegate/searchNetDelegateList.htm",
                    data: formData,
                    headers: {
                      "Content-Type":
                        "application/x-www-form-urlencoded; charset=UTF-8",
                      Accept: "text/plain, */*; q=0.01",
                    },
                    onload: function (response) {
                      if (response.status == 200) {
                        const responseData = response.responseText;
                        const jsonData = JSON.parse(responseData).data;

                        const arr = [];
                        let completedRequests = 0;

                        for (const item of jsonData) {
                          const id = item.id;
                          GM_xmlhttpRequest({
                            method: "POST",
                            url: "https://szqbh.3cerp.com/pages/net/delegate/searchNetDelegateQm.htm",
                            data: "delegate_id=" + id,
                            headers: {
                              "Content-Type":
                                "application/x-www-form-urlencoded",
                            },
                            onload: function (response) {
                              if (response.status == 200) {
                                const productData = response.responseText;
                                try {
                                  const productInfo =
                                    JSON.parse(productData).goodsList[0];
                                  item.goodRowNo = productInfo.id;
                                  item.goodSku = productInfo.c_goods_sku;
                                  item.goodNum = productInfo.n;
                                  item.goods_name =
                                    productInfo.c_product_goods_name;
                                  item.tax = productInfo.b_tax;
                                  if (item.c_saller_remark != null) {
                                    if (
                                      item.c_saller_remark
                                        .toLowerCase()
                                        .includes("020") ||
                                      item.c_saller_remark
                                        .toLowerCase()
                                        .includes("o2o")
                                    ) {
                                      item.channelFlag = 1;
                                    } else if (
                                      item.c_saller_remark.includes("伙伴通")
                                    ) {
                                      item.channelFlag = 2;
                                    }
                                  }
                                } catch (error) {
                                  console.error(
                                    "无法解析为 JSON 数据: " + error
                                  );
                                }
                              }

                              completedRequests++;

                              if (completedRequests === jsonData.length) {
                                jsonData.forEach(function (item) {
                                  arr.push({
                                    daifaNo: item.c_billcode,
                                    goodRowNo: item.goodRowNo,
                                    goodNo: item.goodSku,
                                    goodName: item.goods_name,
                                    goodNum: item.goodNum,
                                    tax: item.tax,
                                    receiverInfo:
                                      item.c_receiver_name +
                                      item.c_receiver_mobile +
                                      item.c_province +
                                      item.c_city +
                                      item.c_district +
                                      item.c_receiver_address,
                                    shopOrderNo: item.c_platform_billcode,
                                    shopName: item.customer_name,
                                    createTime: item.create_time,
                                    channelFlag: item.channelFlag,
                                  });
                                });
                                console.log(arr);
                                callback(arr);
                              }
                            },
                          });
                        }
                      }
                    },
                    onerror: function (response) {
                      console.error("请求发生错误: " + response);
                      button.disabled = false;
                      button.innerHTML = "同步代发订单";
                      progressDiv.remove();
                      callback([]);
                    },
                  });
                } catch (error) {
                  console.error("请求发生错误: " + error);
                  button.disabled = false;
                  button.innerHTML = "同步代发订单";
                  progressDiv.remove();
                  callback([]);
                }
              }
              fetchDataAndProcess(function (result) {
                GM_xmlhttpRequest({
                  method: "POST",
                  url: "http://baojia-test.gonghuo168.com/api/daifa/syncData",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: JSON.stringify(result), // 将数据转换为JSON字符串
                  onload: function (response) {
                    let res = JSON.parse(response.responseText);
                    console.log(res); // 处理接口返回的数据
                    if (res.success) {
                      var pj = 10;
                      var intervalId = setInterval(function () {
                        pj++;
                        progress.style.width = pj + "%";
                        if (pj >= 100) {
                          clearInterval(intervalId);
                          // 延迟一段时间后隐藏进度条
                          setTimeout(function () {
                            button.disabled = false;
                            button.innerHTML = "同步代发订单";
                            progressDiv.remove();
                            var promptBox = document.createElement("div");
                            promptBox.textContent = res.data;
                            promptBox.style.position = "fixed";
                            promptBox.style.top = "50%";
                            promptBox.style.left = "50%";
                            promptBox.style.transform = "translate(-50%, -50%)";
                            promptBox.style.padding = "20px";
                            promptBox.style.backgroundColor = "#F5F5F5";
                            promptBox.style.border = "1px solid black";
                            // 创建关闭按钮
                            var closeButton = document.createElement("button");
                            closeButton.textContent = "关闭";
                            closeButton.style.marginTop = "10px";
                            closeButton.style.display = "block";
                            closeButton.style.marginLeft = "auto";
                            // 添加关闭按钮点击事件监听器
                            closeButton.addEventListener("click", function () {
                              // 移除提示框
                              promptBox.remove();
                            });

                            // 将关闭按钮添加到提示框
                            promptBox.appendChild(closeButton);
                            // 将提示框插入页面
                            document.body.appendChild(promptBox);
                          }, 1000);
                        }
                      }, 10);
                    } else {
                      button.disabled = false;
                      button.innerHTML = "同步代发订单";
                      progressDiv.remove();
                    }
                  },
                  onerror: function (error) {
                    console.error("接口调用失败:", error);
                    button.disabled = false;
                    button.innerHTML = "同步代发订单";
                    progressDiv.remove();
                  },
                });
              });
            }
          } else {
            for (var k = 0; k < nestedIframes.length; k++) {
              var nestedIframe = nestedIframes[k];
              console.log(nestedIframe);
              var params = new URLSearchParams(nestedIframe.src);
              menuName = params.get("menu_name");
              console.log("menuName", menuName);
              if (menuName === "找人代发") {
                button.disabled = true;
                button.innerHTML = "数据导入中...";
                // 创建一个固定定位的 div 元素，设置其样式使其居中显示在页面中
                let progressDiv = document.createElement("div");
                progressDiv.style.position = "fixed";
                progressDiv.style.top = "50%";
                progressDiv.style.left = "50%";
                progressDiv.style.width = "300px"; // 设置宽度
                progressDiv.style.transform = "translate(-50%, -50%)";

                // 创建一个表示进度条的 div 元素，设置其样式，大小和动画效果
                let progressBar = document.createElement("div");
                progressBar.style.width = "50%";
                progressBar.style.height = "15px";
                progressBar.style.backgroundColor = "#ccc";
                progressBar.style.borderRadius = "5px";
                progressBar.style.overflow = "hidden";
                progressBar.style.position = "relative";
                progressBar.style.transition = "width 0.5s ease-in-out";

                // 创建一个表示进度的子 div 元素，初始化宽度为 0%，高度为 100%，并设置背景颜色为绿色，然后将其添加到进度条元素中
                let progress = document.createElement("div");
                progress.style.width = "10%";
                progress.style.height = "100%";
                progress.style.backgroundColor = "#27ae60";
                progress.style.position = "absolute";
                progress.style.top = "0";
                progress.style.left = "0";
                progress.style.transition = "width 0.5s ease-in-out";

                // 将进度条进度元素添加到进度条元素中
                progressBar.appendChild(progress);

                // 将进度条元素添加到 div 中
                progressDiv.appendChild(progressBar);

                // 将 div 插入到页面中
                document.body.appendChild(progressDiv);
                var nestedIframeDoc =
                  nestedIframe.contentDocument ||
                  nestedIframe.contentWindow.document;
                var centerDiv = nestedIframeDoc.getElementById("center");
                let shopValue =
                  nestedIframeDoc.getElementById("shop_id$text").value;
                let beginDateValue =
                  nestedIframeDoc.getElementById("beginDate$value").value;
                let endDateValue =
                  nestedIframeDoc.getElementById("endDate$value").value;
                let c_product_goods_sku = nestedIframeDoc.getElementById(
                  "c_product_goods_sku$text"
                ).value;
                let postData = {
                  c_delivery_info: "",
                  b_finish: 0,
                  shop_id: "",
                  beginDate: beginDateValue,
                  endDate: endDateValue,
                  search_billcode_key: "c_platform_billcode",
                  search_billcode_filter: "",
                  search_vip_key: "c_vip_code",
                  search_vip_filter: "",
                  c_product_goods_sku: c_product_goods_sku,
                  b_check: 0,
                  search_b_hold: 0,
                  pageIndex: 0,
                  pageSize: 5000,
                  sortField: "",
                  sortOrder: "",
                };
                let formData = new URLSearchParams(postData).toString();
                //if (centerDiv &&(shopValue==58||shopValue==63)){ }
                function fetchDataAndProcess(callback) {
                  try {
                    GM_xmlhttpRequest({
                      method: "POST",
                      url: "https://szqbh.3cerp.com/pages/net/delegate/searchNetDelegateList.htm",
                      data: formData,
                      headers: {
                        "Content-Type":
                          "application/x-www-form-urlencoded; charset=UTF-8",
                        Accept: "text/plain, */*; q=0.01",
                      },
                      onload: function (response) {
                        if (response.status == 200) {
                          const responseData = response.responseText;
                          const jsonData = JSON.parse(responseData).data;

                          const arr = [];
                          let completedRequests = 0;

                          for (const item of jsonData) {
                            const id = item.id;
                            GM_xmlhttpRequest({
                              method: "POST",
                              url: "https://szqbh.3cerp.com/pages/net/delegate/searchNetDelegateQm.htm",
                              data: "delegate_id=" + id,
                              headers: {
                                "Content-Type":
                                  "application/x-www-form-urlencoded",
                              },
                              onload: function (response) {
                                if (response.status == 200) {
                                  const productData = response.responseText;
                                  try {
                                    const productInfo =
                                      JSON.parse(productData).goodsList[0];
                                    item.goodRowNo = productInfo.id;
                                    item.goodSku = productInfo.c_goods_sku;
                                    item.goodNum = productInfo.n;
                                    item.goods_name =
                                      productInfo.c_product_goods_name;
                                    item.tax = productInfo.b_tax;
                                    if (item.c_saller_remark != null) {
                                      if (
                                        item.c_saller_remark
                                          .toLowerCase()
                                          .includes("020") ||
                                        item.c_saller_remark
                                          .toLowerCase()
                                          .includes("o2o")
                                      ) {
                                        item.channelFlag = 1;
                                      } else if (
                                        item.c_saller_remark.includes("伙伴通")
                                      ) {
                                        item.channelFlag = 2;
                                      }
                                    }
                                  } catch (error) {
                                    console.error(
                                      "无法解析为 JSON 数据: " + error
                                    );
                                  }
                                }

                                completedRequests++;

                                if (completedRequests === jsonData.length) {
                                  jsonData.forEach(function (item) {
                                    arr.push({
                                      daifaNo: item.c_billcode,
                                      goodRowNo: item.goodRowNo,
                                      goodNo: item.goodSku,
                                      goodName: item.goods_name,
                                      goodNum: item.goodNum,
                                      tax: item.tax,
                                      receiverInfo:
                                        item.c_receiver_name +
                                        item.c_receiver_mobile +
                                        item.c_province +
                                        item.c_city +
                                        item.c_district +
                                        item.c_receiver_address,
                                      shopOrderNo: item.c_platform_billcode,
                                      shopName: item.customer_name,
                                      createTime: item.create_time,
                                      channelFlag: item.channelFlag,
                                    });
                                  });
                                  console.log(arr);
                                  callback(arr);
                                }
                              },
                            });
                          }
                        }
                      },
                      onerror: function (response) {
                        console.error("请求发生错误: " + response);
                        button.disabled = false;
                        button.innerHTML = "同步代发订单";
                        progressDiv.remove();
                        callback([]);
                      },
                    });
                  } catch (error) {
                    console.error("请求发生错误: " + error);
                    button.disabled = false;
                    button.innerHTML = "同步代发订单";
                    progressDiv.remove();
                    callback([]);
                  }
                }
                fetchDataAndProcess(function (result) {
                  GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://baojia-test.gonghuo168.com/api/daifa/syncData",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    data: JSON.stringify(result), // 将数据转换为JSON字符串
                    onload: function (response) {
                      let res = JSON.parse(response.responseText);
                      console.log(res); // 处理接口返回的数据
                      if (res.success) {
                        var pj = 10;
                        var intervalId = setInterval(function () {
                          pj++;
                          progress.style.width = pj + "%";
                          if (pj >= 100) {
                            clearInterval(intervalId);
                            // 延迟一段时间后隐藏进度条
                            setTimeout(function () {
                              button.disabled = false;
                              button.innerHTML = "同步代发订单";
                              progressDiv.remove();
                              var promptBox = document.createElement("div");
                              promptBox.textContent = res.data;
                              promptBox.style.position = "fixed";
                              promptBox.style.top = "50%";
                              promptBox.style.left = "50%";
                              promptBox.style.transform =
                                "translate(-50%, -50%)";
                              promptBox.style.padding = "20px";
                              promptBox.style.backgroundColor = "#F5F5F5";
                              promptBox.style.border = "1px solid black";
                              // 创建关闭按钮
                              var closeButton =
                                document.createElement("button");
                              closeButton.textContent = "关闭";
                              closeButton.style.marginTop = "10px";
                              closeButton.style.display = "block";
                              closeButton.style.marginLeft = "auto";
                              // 添加关闭按钮点击事件监听器
                              closeButton.addEventListener(
                                "click",
                                function () {
                                  // 移除提示框
                                  promptBox.remove();
                                }
                              );

                              // 将关闭按钮添加到提示框
                              promptBox.appendChild(closeButton);
                              // 将提示框插入页面
                              document.body.appendChild(promptBox);
                            }, 1000);
                          }
                        }, 10);
                      } else {
                        button.disabled = false;
                        button.innerHTML = "同步代发订单";
                        progressDiv.remove();
                      }
                    },
                    onerror: function (error) {
                      console.error("接口调用失败:", error);
                      button.disabled = false;
                      button.innerHTML = "同步代发订单";
                      progressDiv.remove();
                    },
                  });
                });
              }
            }
            if (!menuName) {
              button.disabled = true;
              button.innerHTML = "数据导入中...";
              // 创建一个固定定位的 div 元素，设置其样式使其居中显示在页面中
              let progressDiv = document.createElement("div");
              progressDiv.style.position = "fixed";
              progressDiv.style.top = "50%";
              progressDiv.style.left = "50%";
              progressDiv.style.width = "300px"; // 设置宽度
              progressDiv.style.transform = "translate(-50%, -50%)";

              // 创建一个表示进度条的 div 元素，设置其样式，大小和动画效果
              let progressBar = document.createElement("div");
              progressBar.style.width = "50%";
              progressBar.style.height = "15px";
              progressBar.style.backgroundColor = "#ccc";
              progressBar.style.borderRadius = "5px";
              progressBar.style.overflow = "hidden";
              progressBar.style.position = "relative";
              progressBar.style.transition = "width 0.5s ease-in-out";

              // 创建一个表示进度的子 div 元素，初始化宽度为 0%，高度为 100%，并设置背景颜色为绿色，然后将其添加到进度条元素中
              let progress = document.createElement("div");
              progress.style.width = "10%";
              progress.style.height = "100%";
              progress.style.backgroundColor = "#27ae60";
              progress.style.position = "absolute";
              progress.style.top = "0";
              progress.style.left = "0";
              progress.style.transition = "width 0.5s ease-in-out";

              // 将进度条进度元素添加到进度条元素中
              progressBar.appendChild(progress);

              // 将进度条元素添加到 div 中
              progressDiv.appendChild(progressBar);

              // 将 div 插入到页面中
              document.body.appendChild(progressDiv);
              let iframeDeliver =
                iframe.contentDocument || iframe.contentWindow.document;
              let centerDivDeliver = iframeDeliver.getElementById("center");
              let shopValue =
                iframeDeliver.getElementById("shop_id$text").value;
              let beginDateValue =
                iframeDeliver.getElementById("beginDate$value").value;
              let endDateValue =
                iframeDeliver.getElementById("endDate$value").value;
              let c_product_goods_sku = iframeDeliver.getElementById(
                "c_product_goods_sku$text"
              ).value;
              let postData = {
                c_delivery_info: "",
                b_finish: 0,
                shop_id: "",
                beginDate: beginDateValue,
                endDate: endDateValue,
                search_billcode_key: "c_platform_billcode",
                search_billcode_filter: "",
                search_vip_key: "c_vip_code",
                search_vip_filter: "",
                c_product_goods_sku: c_product_goods_sku,
                b_check: 0,
                search_b_hold: 0,
                pageIndex: 0,
                pageSize: 5000,
                sortField: "",
                sortOrder: "",
              };
              let formData = new URLSearchParams(postData).toString();
              //if (centerDivDeliver &&(shopValue==58||shopValue==63)){}
              function fetchDataAndProcess(callback) {
                try {
                  GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://szqbh.3cerp.com/pages/net/delegate/searchNetDelegateList.htm",
                    data: formData,
                    headers: {
                      "Content-Type":
                        "application/x-www-form-urlencoded; charset=UTF-8",
                      Accept: "text/plain, */*; q=0.01",
                    },
                    onload: function (response) {
                      if (response.status == 200) {
                        const responseData = response.responseText;
                        const jsonData = JSON.parse(responseData).data;

                        const arr = [];
                        let completedRequests = 0;

                        for (const item of jsonData) {
                          const id = item.id;
                          GM_xmlhttpRequest({
                            method: "POST",
                            url: "https://szqbh.3cerp.com/pages/net/delegate/searchNetDelegateQm.htm",
                            data: "delegate_id=" + id,
                            headers: {
                              "Content-Type":
                                "application/x-www-form-urlencoded",
                            },
                            onload: function (response) {
                              if (response.status == 200) {
                                const productData = response.responseText;
                                try {
                                  const productInfo =
                                    JSON.parse(productData).goodsList[0];
                                  item.goodRowNo = productInfo.id;
                                  item.goodSku = productInfo.c_goods_sku;
                                  item.goodNum = productInfo.n;
                                  item.goods_name =
                                    productInfo.c_product_goods_name;
                                  item.tax = productInfo.b_tax;
                                  if (item.c_saller_remark != null) {
                                    if (
                                      item.c_saller_remark
                                        .toLowerCase()
                                        .includes("020") ||
                                      item.c_saller_remark
                                        .toLowerCase()
                                        .includes("o2o")
                                    ) {
                                      item.channelFlag = 1;
                                    } else if (
                                      item.c_saller_remark.includes("伙伴通")
                                    ) {
                                      item.channelFlag = 2;
                                    }
                                  }
                                } catch (error) {
                                  console.error(
                                    "无法解析为 JSON 数据: " + error
                                  );
                                }
                              }

                              completedRequests++;

                              if (completedRequests === jsonData.length) {
                                jsonData.forEach(function (item) {
                                  arr.push({
                                    daifaNo: item.c_billcode,
                                    goodRowNo: item.goodRowNo,
                                    goodNo: item.goodSku,
                                    goodName: item.goods_name,
                                    goodNum: item.goodNum,
                                    tax: item.tax,
                                    receiverInfo:
                                      item.c_receiver_name +
                                      item.c_receiver_mobile +
                                      item.c_province +
                                      item.c_city +
                                      item.c_district +
                                      item.c_receiver_address,
                                    shopOrderNo: item.c_platform_billcode,
                                    shopName: item.customer_name,
                                    createTime: item.create_time,
                                  });
                                });
                                console.log(arr);
                                callback(arr);
                              }
                            },
                          });
                        }
                      }
                    },
                    onerror: function (response) {
                      console.error("请求发生错误: " + response);
                      button.disabled = false;
                      button.innerHTML = "同步代发订单";
                      progressDiv.remove();
                      callback([]);
                    },
                  });
                } catch (error) {
                  console.error("请求发生错误: " + error);
                  button.disabled = false;
                  button.innerHTML = "同步代发订单";
                  progressDiv.remove();
                  callback([]);
                }
              }
              fetchDataAndProcess(function (result) {
                GM_xmlhttpRequest({
                  method: "POST",
                  url: "http://baojia-test.gonghuo168.com/api/daifa/syncData",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: JSON.stringify(result), // 将数据转换为JSON字符串
                  onload: function (response) {
                    let res = JSON.parse(response.responseText);
                    console.log(res); // 处理接口返回的数据
                    if (res.success) {
                      var pj = 10;
                      var intervalId = setInterval(function () {
                        pj++;
                        progress.style.width = pj + "%";
                        if (pj >= 100) {
                          clearInterval(intervalId);
                          // 延迟一段时间后隐藏进度条
                          setTimeout(function () {
                            button.disabled = false;
                            button.innerHTML = "同步代发订单";
                            progressDiv.remove();
                            var promptBox = document.createElement("div");
                            promptBox.textContent = res.data;
                            promptBox.style.position = "fixed";
                            promptBox.style.top = "50%";
                            promptBox.style.left = "50%";
                            promptBox.style.transform = "translate(-50%, -50%)";
                            promptBox.style.padding = "20px";
                            promptBox.style.backgroundColor = "#F5F5F5";
                            promptBox.style.border = "1px solid black";
                            // 创建关闭按钮
                            var closeButton = document.createElement("button");
                            closeButton.textContent = "关闭";
                            closeButton.style.marginTop = "10px";
                            closeButton.style.display = "block";
                            closeButton.style.marginLeft = "auto";
                            // 添加关闭按钮点击事件监听器
                            closeButton.addEventListener("click", function () {
                              // 移除提示框
                              promptBox.remove();
                            });

                            // 将关闭按钮添加到提示框
                            promptBox.appendChild(closeButton);
                            // 将提示框插入页面
                            document.body.appendChild(promptBox);
                          }, 1000);
                        }
                      }, 10);
                    } else {
                      button.disabled = false;
                      button.innerHTML = "同步代发订单";
                      progressDiv.remove();
                    }
                  },
                  onerror: function (error) {
                    console.error("接口调用失败:", error);
                    button.disabled = false;
                    button.innerHTML = "同步代发订单";
                    progressDiv.remove();
                  },
                });
              });
            }
          }
        }
      }
    }
  });
  var filterContainer = document.querySelector(".menu");
  const ndialog = function (
    title = "KeepChatGPT",
    content = "",
    buttonvalue = "OK",
    buttonfun = function (t) {
      return t;
    },
    inputtype = "br",
    inputvalue = ""
  ) {
    const ndivalert = document.createElement("div");
    ndivalert.innerHTML = `
<div class="fixed inset-0 bg-black dark:bg-gray-600/70">
  <div class=" grid h-full w-full  overflow-y-auto">
    <div class="transition-all max-w-xl bg-white">
      <div class="flex items-center justify-between border-b border-black">
        <h2 class="text-lg leading-6 text-gray-900 dark:text-gray-200">${title}</h2>
      </div>
      <div>
        <p>${content}</p>
        <br>
        <div class="mt-5 flex flex-col gap-3 sm:mt-4 flex-row-reverse">
          <button class="kdialogbtn btn relative btn-primary">
            <div class="flex w-full gap-2 items-center justify-center">${buttonvalue}</div>
          </button>
          <button class="kdialogclose btn relative btn-neutral">
            <div class="flex w-full gap-2 items-center justify-center">取消</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
        `;

    $(".kdialogclose", ndivalert)[0].onclick = function () {
      ndivalert.remove();
    };
    $(".kdialogbtn", ndivalert)[0].onclick = function () {
      buttonfun(ndivalert);
      $(".kdialogclose", ndivalert)[0].onclick();
    };
    document.body.appendChild(ndivalert);
  };
  function checkForUpdates() {
    let updateURL = 'https://greasyfork.org/zh-CN/scripts/480669-%E5%90%8C%E6%AD%A5%E4%BB%A3%E5%8F%91%E8%AE%A2%E5%8D%95';
    updateURL = `${updateURL}?t=${Date.now()}`;
    GM_xmlhttpRequest({
      method: "GET",
      url: 'https://www.baojia.gonghuo168.com/daifa.user.js',
      onload: function (response) {
        var crv = GM_info.script.version;
        console.log(crv);
        const m = response.responseText.match(/@version\s+(\S+)/);
        console.log(m);
        const ltv = m && m[1];
        console.log(response);
        if (ltv && verInt(ltv) > verInt(crv)) {
          ndialog(
            `${tl("同步代发订单")}`,
            `${tl("当前版本")}: ${crv}, ${tl("发现最新版")}: ${ltv}`,
            `更新`,
            function (t) {
              window.open(updateURL, "_blank");
            }
          );
        }
      },
    });
  }
  const verInt = function (vs) {
    const vl = vs.split(".");
    let vi = 0;
    for (let i = 0; i < vl.length && i < 3; i++) {
      vi += parseInt(vl[i]) * 1000 ** (2 - i);
    }
    return vi;
  };
  const tl = function (s) {
    let r;
    try {
      const i = langIndex[s];
      r = langLocal[i];
    } catch (e) {
      r = s;
    }
    if (r === undefined) {
      r = s;
    }
    return r;
  };
  checkForUpdates();
  function addCSSFile(url) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    document.head.appendChild(link);
  }

  // Specify the CSS file URL you want to inject

  GM_addStyle(`
 .bg-black {
    background-color: rgba(0,0,0,.5);
}
.inset-0 {
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
}
.fixed {
    position: fixed;
}

.h-full {
    height: 100%;
}
.w-full {
    width: 100%;
}
.grid {
    display: grid;
}
.transition-all {
    transition-duration: .15s;
    transition-property: all;
    transition-timing-function: cubic-bezier(.4,0,.2,1);
}
.overflow-y-auto {
    overflow-y: auto;
}
.max-w-xl {
    max-width: 300px;
    max-height: 200px;
    border-radius: 5px;
    grid-row-start: 2;
    grid-row: auto;
    grid-column-start: 2;
    grid-column: auto;
    position: relative;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%); /* 将文本水平垂直居中 */
    padding:0 20px;
    }

    .border-black {
    border-bottom: 1px solid  #E5E5E5;
}

.bg-white {
    --tw-bg-opacity: 1;

    background-color: rgba(255,255,255,var(--tw-bg-opacity));
}
.justify-between {
    justify-content: space-between;
}
.items-center {
    align-items: center;
}
.flex {
    display: flex;
}
.text-gray-900 {
    --tw-text-opacity: 1;
    color: rgba(32,33,35,var(--tw-text-opacity));
}
.leading-6 {
    line-height: 1.5rem;
}

.text-lg {
    font-size: 1.125rem;
    line-height: 1.75rem;
}
.flex-row-reverse {
    flex-direction: row-reverse;
    margin-top:10px;
}
.btn-primary {
    --tw-bg-opacity: 1;
    --tw-text-opacity: 1;
    background-color: rgba(16,163,127,var(--tw-bg-opacity));
    color: rgba(255,255,255,var(--tw-text-opacity));
}
.btn {
    align-items: center;
    border-color: transparent;
    border-radius: 0.5rem;
    border-width: 1px;
    display: inline-flex;
    font-size: .875rem;
    font-weight: 500;
    line-height: 1.25rem;
    padding: 10px;
      margin:10px;
    pointer-events: auto;
    cursor: pointer;
}
`);
  if (filterContainer) {
    filterContainer.appendChild(button);
  }
})();
