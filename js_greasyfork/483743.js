// ==UserScript==
// @name         获取直播弹幕
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  在线获取弹幕
// @author       37
// @match        https://buyin.jinritemai.com/*
// @match        https://zs.kwaixiaodian.com/*
// @match        https://liveplatform.taobao.com/*
// @match        https://live.baidu.com/*
// @match        https://live.pinduoduo.com/*
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require     https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/483743/%E8%8E%B7%E5%8F%96%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/483743/%E8%8E%B7%E5%8F%96%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let ws;
  let observer;
  let waitMsgList = [];
  let stopWs = false;

  let goodsListTikTok = []; //抖音商品存储
  let goodsListKuShou = []; //快手商品存储
  let getPopUpsContent = ""; //获取弹幕内容
  let wxUrl = "";
  let promotionsList = [];
  let nowHost = window.location.host;
  let ksBol = false;
  let tbWscomments = [];
  let tbOnceArr = [];
  let tbOnceArrLastMsg = "";
  let timeElment = "";
  function connectWebSocket() {
    ws = new WebSocket(wxUrl);
    ws.addEventListener("open", () => {
      if (nowHost == "zs.kwaixiaodian.com") {
        ksBol = false;
        $(".ReactVirtualized__List").scrollTop(9999);
        setTimeout(() => {
          ksBol = true;
        }, 1000);
      }

      console.log("连接成功");
      const submitButton = document.querySelector("#submitButton");
      submitButton.textContent = `断开弹幕采集${
        nowHost == "zs.kwaixiaodian.com" || "liveplatform.taobao.com"
          ? "(提示:连接弹幕后请勿手动拖动弹幕列表!)"
          : ""
      }`;

      if (waitMsgList.length) {
        //这里发送缓存也可以触发

        waitMsgList.forEach((item) => {
          ws.send(item);
          console.log("成功发送缓存---", item);
          //获取到用户发送的弹幕
          getPopUpsContent = item;
          console.log("获取关键弹幕", getPopUpsContent);
          //匹配关键词
          getKuShouKeyword(getPopUpsContent);
        });
        waitMsgList = [];
      }
    });

    ws.addEventListener("message", (event) => {
      console.log("从服务器接收到消息:", JSON.parse(event.data));
      JSON.parse(event.data).type == 3 &&
        getTikTokFindGoods(JSON.parse(event.data).answerText[0]);
    });
    ws.addEventListener("close", (event) => {
      const submitButton = document.querySelector("#submitButton");
      submitButton.textContent = "连接弹幕采集";
      if (stopWs) {
        stopWs = false;
      } else {
        setTimeout(() => {
          console.log("WebSocket 已关闭--正在重新连接");
          connectWebSocket(wxUrl);
        }, 3000);
      }
    });
  }

  function startObserver() {
    observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        mutation.addedNodes.forEach((addedNode) => {
          var userElement = "";
          var contentElement = "";
          if (nowHost == "buyin.jinritemai.com") {
            //抖音捕捉弹幕逻辑
            if (
              addedNode.nodeType === Node.ELEMENT_NODE &&
              addedNode.classList.contains("index-module__commentItem___2fLb5")
            ) {
              userElement = addedNode.querySelector(
                ".index-module__nickname___L6O_K"
              );
              contentElement = addedNode.querySelector(
                ".index-module__description___2W_id"
              );
            }
            if (
              addedNode.nodeType === Node.ELEMENT_NODE &&
              addedNode.classList.contains(
                "index-module__newCommentShadow___3rffn"
              )
            ) {
              console.log("监测到需要加载新弹幕");
              $(".index-module__newCommentShadow___3rffn")[0].click();
            }
          }

          if (nowHost == "zs.kwaixiaodian.com") {
            //快手捕捉弹幕逻辑（快手中控有后台监测，需手动活跃到可视窗口）
            if (!ksBol) return; //等待滚动条加载

            try {
              if (
                addedNode.nodeType === Node.ELEMENT_NODE &&
                addedNode.childNodes.length &&
                addedNode.childNodes[0].classList.contains("list-item--TAlkJ")
              ) {
                userElement = addedNode.querySelector(".username--BCJbc");
                contentElement = addedNode.querySelector(
                  ".replied-content--Mq1R1"
                );
              }
            } catch (error) {}

            if (
              addedNode.nodeType === Node.ELEMENT_NODE &&
              addedNode.classList.contains("bubble--OQEn3")
            ) {
              try {
                $(".bubble--OQEn3")[0].click();
              } catch (error) {
                // console.log(error)
              }
            }
          }

          if (nowHost == "liveplatform.taobao.com") {
            //淘宝捕捉弹幕逻辑

            // console.log('------进入淘宝-----');
            if (
              addedNode.nodeType === Node.ELEMENT_NODE &&
              addedNode.classList.contains("tc-comment-item")
            ) {
              userElement = addedNode.querySelector(
                ".tc-comment-item-userinfo-name "
              );
              contentElement = addedNode.querySelector(
                ".tc-comment-item-content span"
              );
              timeElment = addedNode
                .querySelector(".alpw-comment-time")
                .textContent.trim();
              tbWscomments.push({
                userName: userElement.textContent,
                answerText: contentElement.textContent,
                timestamp: timeElment,
              });
              tbOnceArr = tbWscomments.filter((value, index, self) => {
                return (
                  index ===
                  self.findIndex(
                    (item) =>
                      item.userName === value.userName &&
                      item.answerText === value.answerText
                  )
                );
              });
              //当前时间
              const currentTime = new Date();
              const fiveMinutesBefore = new Date(
                currentTime.getTime() - 5 * 60 * 1000
              );
              const fiveMinutesAfter = new Date(
                currentTime.getTime() + 5 * 60 * 1000
              );
              tbOnceArr = tbOnceArr.filter((item) => {
                const itemTimestamp = new Date().setHours(
                  item.timestamp.substring(0, 2),
                  item.timestamp.substring(3, 5),
                  0
                );
                return (
                  itemTimestamp >= fiveMinutesBefore &&
                  itemTimestamp <= fiveMinutesAfter
                );
              });

              // console.log(tbWscomments, tbOnceArr,timeElment,'淘宝消息');
            }
            //如果有需要加载的提示
            var element = $(".tc-comment-list-newtip");
            // 判断特定条件
            if (element.css("display") === "block") {
              element.trigger("click");
              element.click(function () {});
            }
          }

          if (nowHost == "live.baidu.com") {
            //百度捕捉弹幕逻辑
            console.log("进入百度弹幕");
            if (
              addedNode.nodeType === Node.ELEMENT_NODE &&
              addedNode.classList.contains("msg-box")
            ) {
              userElement = addedNode.querySelector(".msg-box-name");
              contentElement = addedNode.querySelector(".msg-box-text");
            }
          }

          if (nowHost == "live.pinduoduo.com") {
            //拼多多捕捉弹幕逻辑
            console.log("进入pdd弹幕");
            if (
              addedNode.nodeType === Node.ELEMENT_NODE &&
              addedNode.classList.contains("msg-wrap")
            ) {
              userElement = addedNode.querySelector(".author");
              contentElement = addedNode.querySelector(".content");
            }
          }

          if (nowHost == "live.bilibili.com") {
            //b站捕捉弹幕逻辑
            console.log("进入b站弹幕");
            if (
              addedNode.nodeType === Node.ELEMENT_NODE &&
              addedNode.classList.contains("chat-item")
            ) {
              userElement = addedNode.querySelector(".user-name");
              contentElement = addedNode.querySelector(".danmaku-item-right");
            }
          }

          //发送弹幕  在发送弹幕这里做弹幕关键词对比，然后触发上架购物车按钮
          if (contentElement) {
            if (
              nowHost == "liveplatform.taobao.com" &&
              tbOnceArr.length !== 0
            ) {
              if (
                tbOnceArr[tbOnceArr.length - 1].answerText !== tbOnceArrLastMsg
              ) {
                const dataToSend = {
                  answerText: tbOnceArr[tbOnceArr.length - 1].answerText,
                  type: 1,
                };
                if (ws && ws.readyState === 1) {
                  tbOnceArrLastMsg = tbOnceArr[tbOnceArr.length - 1].answerText;
                  ws.send(JSON.stringify(dataToSend));
                  console.log(
                    "成功发送弹幕---",
                    tbOnceArr[tbOnceArr.length - 1].userName,
                    tbOnceArr[tbOnceArr.length - 1].answerText
                  );
                } else {
                  tbOnceArrLastMsg = tbOnceArr[tbOnceArr.length - 1].answerText;
                  console.log(
                    "储存弹幕一条---",
                    tbOnceArr[tbOnceArr.length - 1].userName,
                    tbOnceArr[tbOnceArr.length - 1].answerText
                  );
                  waitMsgList.push(JSON.stringify(dataToSend));
                }
              }
            } else if (nowHost != "liveplatform.taobao.com") {
              console.log("进入别的平台");
              const dataToSend = {
                answerText: contentElement.textContent,
                type: 1,
              };
              if (ws && ws.readyState === 1) {
                ws.send(JSON.stringify(dataToSend));
                //获取到用户发送的弹幕
                getPopUpsContent = contentElement.textContent;
                console.log(
                  "成功发送弹幕---",
                  userElement.textContent,
                  contentElement.textContent
                );
                console.log("获取关键弹幕1", getPopUpsContent);
                //匹配关键词
                getKuShouKeyword(getPopUpsContent);
              } else {
                waitMsgList.push(JSON.stringify(dataToSend));
                console.log(
                  "储存弹幕一条---",
                  userElement.textContent,
                  contentElement.textContent
                );
              }
            }
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
  //抖音获取和查找商品
  function getTikTokGoodsList() {
    const match = wxUrl.match(/websocket\/([^\/]+)/);
    if (match ? match[1] : null) {
      $.ajax({
        type: "GET",
        url: "https://buyin.jinritemai.com/api/anchor/livepc/promotions",
        success: function (data) {
          promotionsList = data.data.promotions;
          goodsListTikTok = data.data.promotions.map((data, index) => {
            return {
              goodName: data.title,
              goodNo: index + 1,
              price: data.min_price / 100,
              liveId: match[1],
            };
          });
          const dataToSend = {
            answerText: goodsListTikTok,
            type: 4,
          };
          ws.send(JSON.stringify(dataToSend));
          alert("更新商品成功");
        },
      });
    } else {
      console.log("获取liveID失败");
    }
  }
  function getTikTokFindGoods(item) {
    $.ajax({
      type: "POST",
      url: "https://buyin.jinritemai.com/api/anchor/livepc/setcurrent",
      data: { version: promotionsList[item.goodNo - 1].promotion_id },
      success: function (data) {
        document.querySelectorAll(".index__actionItem___2Z8YV")[1].click();
      },
    });
  }

  //快手获取和查找商品
  function getKuShouGoodsList() {
    const match = wxUrl.match(/websocket\/([^\/]+)/);
    if (match ? match[1] : null) {
      $.ajax({
        type: "post",
        url: "https://zs.kwaixiaodian.com/rest/pc/live/assistant/dynamic/onsale",
        data: { version: 2 },
        success: function (data) {
          let liveStreamId = data.data.liveStreamId;
          goodsListKuShou = data.data.commodityCardList.map((data, index) => {
            return {
              goodName: data.title,
              goodNo: index + 1,
              price: data.originalPrice.price,
              itemId: data.commodityId,
              liveStreamId: liveStreamId,
            };
          });
          const dataToSend = {
            answerText: goodsListKuShou,
            type: 4,
          };
          ws.send(JSON.stringify(dataToSend));
          alert("更新商品成功");
          console.log(goodsListKuShou);
        },
      });
    } else {
      console.log("获取liveID失败");
    }
  }

  //快手弹幕关键字
  // 使用 RegExp.escape() 转义特殊字符（假设已实现）
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }

  function getKuShouKeyword(userRemark) {
    console.log(userRemark, "用户弹幕");
    // 转义后的关键词用于创建正则表达式
    const escapedKeyword = escapeRegExp(userRemark);
    const keywordRegex = new RegExp(escapedKeyword, "i"); // 使用/i标志实现不区分大小写的匹配
    goodsListKuShou.forEach((item) => {
      const findGoods = keywordRegex.test(item.goodName);
      console.log(findGoods);
      if (findGoods) {
        getKuShouShelveApi(item.itemId, item.liveStreamId);
        return;
      }
    });
  }

  //快手上架api
  function getKuShouShelveApi(
    itemId = 21803314703569,
    liveStreamId = "12239880278"
  ) {
    $.ajax({
      type: "post",
      url: "https://zs.kwaixiaodian.com/rest/pc/live/assistant/shopCar/record/start",
      data: JSON.stringify({ liveStreamId, itemId }),
      dataType: "json",
      headers: {
        "Content-Type": "application/json", // 明确设置Content-Type为JSON
      },
      success: function (data) {
        console.log(data, "快手数据");
      },
      error: function (xhr, status, error) {
        // 增加了错误处理，以便在请求失败时记录错误
        console.error(`请求失败: ${status} ${error}`);
      },
    });
  }

  function stopObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }
  function disconnectWebSocket() {
    if (ws) {
      ws.close();
      stopObserver();
      stopWs = true;
      console.log("WebSocket 已手动断开连接");
    }
  }

  function createFloatingInput() {
    const inputContainer = document.createElement("div");
    inputContainer.style.position = "fixed";
    inputContainer.style.top = "60px";
    inputContainer.style.left = "20px";
    inputContainer.style.zIndex = "999999";

    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("placeholder", "输入 WebSocket 地址");
    inputElement.classList.add("input-box");
    inputElement.style.padding = "8px";
    inputElement.style.border = "1px solid #ccc";
    inputElement.style.borderRadius = "4px";
    inputElement.style.outline = "none";

    const submitButton = document.createElement("button");
    submitButton.id = "submitButton";
    submitButton.textContent = "连接弹幕采集";
    submitButton.style.marginLeft = "8px";
    submitButton.style.padding = "8px";
    submitButton.style.border = "1px solid #ccc";
    submitButton.style.borderRadius = "4px";
    submitButton.style.backgroundColor = "#f0f0f0";
    submitButton.style.cursor = "pointer";

    const goodsButton = document.createElement("button");
    goodsButton.id = "submitButton";
    goodsButton.textContent = "更新商品";
    goodsButton.style.marginLeft = "8px";
    goodsButton.style.padding = "8px";
    goodsButton.style.border = "1px solid #ccc";
    goodsButton.style.borderRadius = "4px";
    goodsButton.style.backgroundColor = "#f0f0f0";
    goodsButton.style.cursor = "pointer";

    submitButton.addEventListener("click", () => {
      const inputVal = inputElement.value.trim();
      if (inputVal) {
        if (ws && ws.readyState == 1) {
          disconnectWebSocket();
        } else {
          startObserver(); //捕捉弹幕的逻辑
          wxUrl = inputVal; //点击连接后，将抓取弹幕的websockte赋值给它
          connectWebSocket(inputVal);
        }
      }
    });
    //点击更新商品btn执行下面的函数
    goodsButton.addEventListener("click", () => {
      if (nowHost == "buyin.jinritemai.com") {
        getTikTokGoodsList();
      } else if (nowHost == "zs.kwaixiaodian.com") {
        getKuShouGoodsList();
      } else {
        alert("还在开发中");
      }
    });
    inputContainer.appendChild(inputElement);
    inputContainer.appendChild(submitButton);
    inputContainer.appendChild(goodsButton);
    document.body.appendChild(inputContainer);
  }
  createFloatingInput();
})();
