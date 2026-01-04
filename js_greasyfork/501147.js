// ==UserScript==
// @name           测试v2弹幕
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  在线获取弹幕
// @author       37
// @match        https://buyin.jinritemai.com/*
// @match        https://zs.kwaixiaodian.com/*
// @match        https://liveplatform.taobao.com/*
// @match        https://live.baidu.com/*
// @match        https://live.pinduoduo.com/*
// @match        https://live.bilibili.com/*
// @match        https://ark.xiaohongshu.com/*
// @match        https://liveplatform.dewu.com/*
// @match        https://weibo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/501147/%E6%B5%8B%E8%AF%95v2%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/501147/%E6%B5%8B%E8%AF%95v2%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let ws;
  let observer;
  let waitMsgList = [];
  let stopWs = false;

  let goodsListTikTok = [];
  let goodsListKuShou = [];
  let getPopUpsContent = "";
  let wxUrl = "";
  let promotionsList = [];
  let nowHost = window.location.host;
  let ksBol = false;
  let tbWscomments = [];
  let tbOnceArr = [];
  let tbOnceArrLastMsg = "";
  let timeElment = "";
  let dwWscomments = [];
  let dWonceArr = [];
  let dwLastLength = 0;
  let roomId = ''
  let processedNodes = new WeakSet(); // Set to keep track of processed nodes
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
        waitMsgList.forEach((item) => {
          ws.send(item);
          console.log("成功发送缓存---", item);

          getPopUpsContent = item;
          console.log("获取关键弹幕", getPopUpsContent);

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
          if (processedNodes.has(addedNode)) return; // Skip if node already processed
          processedNodes.add(addedNode); // Mark node as processed
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
            if (!ksBol) return;

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
            }

            var element = $(".tc-comment-list-newtip");

            if (element.css("display") === "block") {
              element.trigger("click");
              element.click(function () {});
            }
          }

          if (nowHost == "live.baidu.com") {
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
            console.log("进入b站弹幕");
            if (
              addedNode.nodeType === Node.ELEMENT_NODE &&
              addedNode.classList.contains("chat-item")
            ) {
              userElement = addedNode.querySelector(".user-name");
              contentElement = addedNode.querySelector(".danmaku-item-right");
            }
          }

          if (nowHost == "ark.xiaohongshu.com") {
            console.log("进入小红书弹幕");
            if (
              addedNode.nodeType === Node.ELEMENT_NODE &&
              addedNode.classList.contains("comment-list-item")
            ) {
              const spanElements = addedNode.querySelectorAll("span"); // 获取所有的span元素
              let arr = [];
              // 现在spanElements是一个NodeList，包含所有的<span>元素
              spanElements.forEach((span) => {
                if (span.classList.length === 0) {
                  // 如果 classList 为空，则打印 span 元素的文本内容
                  arr.push(span);
                }
              });
              userElement = arr[0];
              contentElement = arr[1];
            }
          }

          //得物
          if (nowHost == "liveplatform.dewu.com") {
            console.log("进入得物弹幕");
            if (
              addedNode.nodeType === Node.ELEMENT_NODE &&
              addedNode.querySelector("div.chat-item____KiLW")
            ) {
              let userArr = addedNode.querySelectorAll(
                ".hang2 .tag-con___noi0t span"
              );
              let userLen = userArr.length;
              contentElement = addedNode.querySelector(".content___8gU6g");
              userElement = userArr[userLen - 1];
              dwWscomments.push({
                userName: userElement.textContent,
                answerText: contentElement.textContent,
              });
              dWonceArr = dwWscomments.filter((value, index, self) => {
                return (
                  index ===
                  self.findIndex(
                    (item) =>
                      item.userName === value.userName &&
                      item.answerText === value.answerText
                  )
                );
              });
            }
          }

          //微博
          if (nowHost == "weibo.com") {
            console.log("进入微博弹幕");
            if (
              addedNode.nodeType === Node.ELEMENT_NODE &&
              addedNode.classList.contains("message_body")
            ) {
              userElement = addedNode.querySelector(".nickname");
              contentElement = addedNode.querySelector(".content");
            }
          }

          //发送弹幕
          if (contentElement) {
            if (
              nowHost == "liveplatform.taobao.com" &&
              tbOnceArr.length !== 0
            ) {
              if (
                tbOnceArr[tbOnceArr.length - 1].answerText !== tbOnceArrLastMsg
              ) {

                const dataToSend = {
                  text:  tbOnceArr[tbOnceArr.length - 1].answerText,
                  type: '1',
                  on_off: true,
                  voice_type: 0,
                  liveRoomId: roomId,
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
            } else if (
              nowHost != "liveplatform.taobao.com" &&
              nowHost != "liveplatform.dewu.com"
            ) {
              console.log("进入别的平台");
              const dataToSend = {
                text: contentElement.textContent,
                type: '1',
                on_off: true,
                voice_type: 0,
                liveRoomId: roomId,
              };
  
              if (ws && ws.readyState === 1) {
                console.log(contentElement.textContent, "fasong");
                if (!contentElement.textContent.trim().length) return;

                ws.send(JSON.stringify(dataToSend));
                getPopUpsContent = contentElement.textContent;
                console.log(
                  "成功发送弹幕---",
                  userElement.textContent,
                  contentElement.textContent
                );
                console.log("获取关键弹幕1", getPopUpsContent);
                getKuShouKeyword(getPopUpsContent);
              } else {
                waitMsgList.push(JSON.stringify(dataToSend));
                console.log(
                  "储存弹幕一条---",
                  userElement.textContent,
                  contentElement.textContent
                );
              }
            } else if (nowHost == "liveplatform.dewu.com") {
              setTimeout(() => {
                if (dWonceArr.length > dwLastLength) {
                  dwLastLength = dWonceArr.length;
      
                  
              const dataToSend = {
                text:  dWonceArr[dWonceArr.length - 1].answerText,
                type: '1',
                on_off: true,
                voice_type: 0,
                liveRoomId: roomId,
              };
  


                  if (ws && ws.readyState === 1) {
                    if (!contentElement.textContent.trim().length) return;
                    ws.send(JSON.stringify(dataToSend));
                    console.log(
                      "成功发送弹幕---",
                      dWonceArr[dWonceArr.length - 1].userName,
                      dWonceArr[dWonceArr.length - 1].answerText
                    );
                  } else {
                    waitMsgList.push(JSON.stringify(dataToSend));
                    console.log(
                      "储存弹幕一条---",
                      dWonceArr[dWonceArr.length - 1].userName,
                      dWonceArr[dWonceArr.length - 1].answerText
                    );
                  }



                }
              }, 1000);
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
            text: goodsListTikTok,
            type: '4',
            on_off: true,
            voice_type: 0,
            liveRoomId: roomId,
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
            text:  goodsListKuShou,
            type: '4',
            on_off: true,
            voice_type: 0,
            liveRoomId: roomId,
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

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function getKuShouKeyword(userRemark) {
    console.log(userRemark, "用户弹幕");
    const escapedKeyword = escapeRegExp(userRemark);
    const keywordRegex = new RegExp(escapedKeyword, "i");
    goodsListKuShou.forEach((item) => {
      const findGoods = keywordRegex.test(item.goodName);
      console.log(findGoods);
      if (findGoods) {
        getKuShouShelveApi(item.itemId, item.liveStreamId);
        return;
      }
    });
  }

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
        "Content-Type": "application/json",
      },
      success: function (data) {
        console.log(data, "快手数据");
      },
      error: function (xhr, status, error) {
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
          startObserver();
          wxUrl = inputVal;
          console.log(wxUrl,'ssssdd');
          let   arrId = wxUrl.split("/")
          roomId = arrId[arrId.length -1];
          console.log(roomId,'roomid对对对');
          connectWebSocket(inputVal);
        }
      }
    });

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
