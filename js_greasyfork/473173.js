// ==UserScript==
// @name         6.抖音下载助手脚本
// @namespace   Violentmonkey Scripts
// @match      *://www.douyin.com/*
// @version     1.4.4
// @license MIT
// @grant       GM_info
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_openInTab
// @grant       unsafeWindow
// @connect eeapi.cn
// @connect api.cooluc.com
// @connect apis.jxcxin.cn

// @run-at      document-body
// @author      zhizhu


// @description 抖音控制
// @downloadURL https://update.greasyfork.org/scripts/473173/6%E6%8A%96%E9%9F%B3%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/473173/6%E6%8A%96%E9%9F%B3%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef
(function () {
  "use strict";

  const faceArray = [
    "微笑",
    "色",
    "发呆",
    "酷拽",
    "抠鼻",
    "流泪",
    "捂脸",
    "捂脸",
    "发怒",
    "呲牙",
    "尬笑",
    "害羞",
    "调皮",
    "舔屏",
    "看",
    "爱心",
    "比心",
    "赞",
    "鼓掌",
    "感谢",
    "抱抱你",
    "玫瑰",
    "灵机一动",
    "耶",
    "打脸",
    "大笑",
    "机智",
    "送心",
    "闭嘴",
  ];
  let canClick = false;
  function findDomInterval(dom, method) {
    var clickInterval = setInterval(() => {
      if (document.querySelector(dom) !== null) {
        switch (method) {
          case "click":
            document.querySelector(dom).click();
            break;
          case "remove":
            document.querySelector(dom).remove();
            break;
          case "input": {
            document
              .querySelector(dom)
              .dispatchEvent(
                new Event("input", { bubbles: !0, cancelable: !0 })
              );
            break;
          }

          default:
            break;
        }

        clearInterval(clickInterval);
        clickInterval = null;
      } else {
        console.log(1111);
      }
    }, 800);
  }

  function noticeRemove() {
    var btn = document.getElementById("root");
    //创建event
    var event = document.createEvent("MouseEvents");
    //初始化event
    event.initMouseEvent(
      "mouseout",
      true,
      true,
      document.defaultView,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
       document.querySelectorAll(".YbCii175")[ document.querySelectorAll(".YbCii175").length-1]
    );

    btn.dispatchEvent(event); //hello

    setTimeout(() => {
      if (document.querySelector(".HYXSv4bB .QKexxlzK")) {
        document.querySelector(".HYXSv4bB .QKexxlzK").click();
      }

      setTimeout(() => {
        userList.shift();
      }, 2000);
    }, 1400);
  }

  setTimeout(() => {
    findDomInterval("#slidelist", "remove");
  }, 1000);

  let openListdom;

  GM_addStyle(".ekDWuDtJ{display:block !important;}");
  GM_addStyle("video{display:none !important;}");

  async function changeTextAsyncFunction(e) {
    //主页点击私信
    if (
      document.querySelector(
        ".ZBejQ5yK.WXPQLGYI.WmztNNX5.cBWwZIxP.RH8TCnaE.z0c5Gipx.I4tJiW0Q"
      )
    ) {
      findDomInterval(
        ".ZBejQ5yK.WXPQLGYI.WmztNNX5.cBWwZIxP.RH8TCnaE.z0c5Gipx.I4tJiW0Q",
        "click"
      );
    } else {
      findDomInterval(
        "#douyin-right-container > div._bEYe5zo > div > div > div.x2yFtBWw.Ll07vpAQ > div._7gdyuNUv.aYWQQ_nh > button.B10aL8VQ.s6mStVxD.vMQD6aai.vk7WaOg_.a2I1sBCL.tAofAbwG",
        "click"
      );
    }
    findDomInterval("div.f7S8m7N0 > div > span:nth-child(1)", "click");
    findDomInterval(".aJJWV5Ft", "click");

    setTimeout(() => {
      var changeTextVal = setInterval(() => {
        let input = document.querySelector(
          "#douyin-header > div.Rr56zkD1 > header > div > div > div.mXmCULv9 > div > div > ul:nth-child(5) > div > li > div > div > div._KdFHyuW > div > div > div.D1sCEUWq.ojRAo7V9 > div > div.c8uBfaOs > div > div.j6SRMBFG > div.IaCaREVo > div.MgaCB9du > div > div > div > div > div > div > div > span > span"
        );
        if (input && input.innerHTML.length < 6) {
          let title = "";
          if (e.data.title) {
            title = `${e.data.title}\n`;
          }
          let face = faceArray[Math.floor(Math.random() * (29 - 0 + 1))];

          if (Array.isArray(e.data.text)) {
            let text = ``;

            for (const item of e.data.text) {
              text += `${item}\n`;
            }
            input.innerHTML = `[${face}]你要下载的视频\n${title}${text}复制到浏览器打开，60分钟有效，过时作废[${face}]`;
          } else {
            input.innerHTML = `[${face}]你要下载的视频\n${title}${e.data.text}复制到浏览器打开，60分钟有效，过时作废[${face}]`;
          }

          input.dispatchEvent(
            new Event("input", { bubbles: !0, cancelable: !0 })
          );
          clearInterval(changeTextVal);
          changeTextVal = null;
        }
      }, 800);
    }, 2000);
  }

  async function userSendAsyncFunction(e) {
    //发送

    setTimeout(() => {
      let input = document.querySelector(
        "#douyin-header > div.Rr56zkD1 > header > div > div > div.mXmCULv9 > div > div > ul:nth-child(5) > div > li > div > div > div._KdFHyuW > div > div > div.D1sCEUWq.ojRAo7V9 > div > div.c8uBfaOs > div > div.j6SRMBFG > div.IaCaREVo > div.MgaCB9du > div > div > div > div > div > div > div > span > span"
      );
      if (input && input.innerHTML.length > 6) {
        setTimeout(() => {
          findDomInterval(
            "#douyin-header > div.Rr56zkD1 > header > div > div > div.mXmCULv9 > div > div > ul:nth-child(5) > div > li > div > div > div._KdFHyuW > div > div > div.D1sCEUWq.ojRAo7V9 > div > div.c8uBfaOs > div > div.j6SRMBFG > div.IaCaREVo.YjxZw9mR > div.f7S8m7N0 > div > span.sCp7KhBv.EWT1TDgs.e2e-send-msg-btn",
            "click"
          );

          e.source.postMessage({ type: "sendSuccess", text: 1234 }, "*");
          setTimeout(() => {
            window.close();
          }, 3000);
        }, 2200);
      }
    }, 5000);
  }

  async function userAsyncFunctions(e) {
    await changeTextAsyncFunction(e);
    await userSendAsyncFunction(e);
  }

  // 调用 executeAsyncFunctions 来执行异步函数

  if (new RegExp("/user/").test(window.location.href)) {
    // 接收消息
    setTimeout(() => {
      window.opener.postMessage({ type: "close", text: 1234 }, "*");
      setTimeout(() => {
        window.close();
      }, 5000);
    }, 70 * 1000);

    window.addEventListener("message", receiveMessage);

    function receiveMessage(event) {
      if (event.data.type == "sendUrl") {
        console.log(event.data.text);

        setTimeout(() => {
          userAsyncFunctions(event);
        }, 3000);
      }
    }
  }

  // Your code here...
  function openList() {
    for (const item of document.querySelectorAll(".Etgl6zoO.FvEk43aG")) {
      if (item.innerText == "通知") {
        openListdom = item;
        console.log(openListdom);
      }
    }
    var btn = document.getElementById("root");
    //创建event
    if (openListdom) {
      var event = document.createEvent("MouseEvents");
      //初始化event
      event.initMouseEvent(
        "mouseout",
        true,
        true,
        document.defaultView,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        openListdom.querySelector(".AdVRSdga")
      );

      btn.dispatchEvent(event); //hello
    }
    setTimeout(() => {
      findDomInterval("#noticeTypeList > div > div", "click");
      let AtClickVal = setInterval(() => {
        if (
          document.querySelector(
            "#noticeTypeList > div.wqGEVTKN.rRgQZrpf > div > div:nth-child(3)"
          )
        ) {
          setTimeout(() => {
            try {
              document
                .querySelector(
                  "#noticeTypeList > div.wqGEVTKN.rRgQZrpf > div > div:nth-child(3)"
                )
                .click();
            } catch (error) {
              findDomInterval("#noticeTypeList > div > div", "click");
              setTimeout(() => {
                if (
                  document.querySelector(
                    "#noticeTypeList > div.wqGEVTKN.rRgQZrpf > div > div:nth-child(3)"
                  )
                )
                  document
                    .querySelector(
                      "#noticeTypeList > div.wqGEVTKN.rRgQZrpf > div > div:nth-child(3)"
                    )
                    .click();
              }, 5000);
            }

            setTimeout(() => {
              setInterval(() => {
                if (document.querySelector("div.GykJNvQ5")) {
                  document.querySelector("div.GykJNvQ5").scrollTop -= 200;

                  document.querySelector("div.GykJNvQ5").scrollTop =
                    document.querySelector("div.GykJNvQ5").scrollHeight + 500;
                }

                if (
                  document.querySelector(".YfbTVxtn") &&
                  document.querySelector(".YfbTVxtn").innerHTML ==
                    "暂时没有更多了"
                ) {
                  canClick = true;
                } else {
                  canClick = false;
                }
              }, 1000);
            }, 2000);

            clearInterval(AtClickVal);
            AtClickVal = null;
          }, 2800);
        }
      }, 1000);
    }, 1100);
  }

  // 调用 executeAsyncFunctions 来执行异步函数

  //触发事件
  let userList = [];
  let videoUrl;

  if (!new RegExp("/user/").test(window.location.href)) {
    window.addEventListener("message", receiveMessage);
    function receiveMessage(event) {
      if (event.data.type == "sendSuccess") {
        if (userList.length > 0) {
          noticeRemove()
        }
      }
      if (event.data.type == "close") {
        window.location.href = "https://www.douyin.com/";
      }
    }

    async function firstAsyncFunction() {
      findDomInterval(
        "#merge-all-comment-container > div > div.gL8GFAmM.comment-input-container > div:nth-child(2) > div > div.oC5O5eMH.commentInput-right-ct > div > span:nth-child(2)",
        "click"
      );

      setTimeout(() => {
        findDomInterval(
          "#merge-all-comment-container > div > div.gL8GFAmM.comment-input-container > div:nth-child(2) > div > div.p2asbEYI.scKiAyMU.MEy5VwQ2.emoji-card-outer-container > div > div > span:nth-child(1)",
          "click"
        );
      }, 1000);
    }

    async function secondAsyncFunction() {
      setTimeout(() => {
        document.querySelector(
          "#merge-all-comment-container > div > div.gL8GFAmM.comment-input-container > div:nth-child(2) > div > div.d66pgCnu > div > div > div > div > div > div > div > span > span"
        ).innerHTML = "你需要的无水印视频下载地址已发私信";

        document
          .querySelector(
            "#merge-all-comment-container > div > div.gL8GFAmM.comment-input-container > div:nth-child(2) > div > div.d66pgCnu > div > div > div > div > div > div > div > span > span"
          )
          .dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 }));
        setTimeout(() => {
          document
            .querySelector(".F7ubq_7y.HfWacTUC .uh012Eth._lHIRfnd")
            .click();
          setTimeout(() => {
            findDomInterval(
              "#merge-all-comment-container > div > div.gL8GFAmM.comment-input-container > div:nth-child(2) > div.MUlPwgGV.comment-input-inner-container.OUcmwC2w > div.oC5O5eMH.commentInput-right-ct > div > span.oXIqR6qH.OcDpqUTc",
              "click"
            );

            setTimeout(() => {
              if (
                document.querySelector(".VBIRbGZt.V5YUzTGV") &&
                document.querySelector(".VBIRbGZt.V5YUzTGV").innerHTML !==
                  "已发布"
              ) {
                setTimeout(() => {
                  window.location.href = "https://www.douyin.com/";
                }, 60 * 1000);
              }
            }, 1500);
          }, 3000);
        }, 2000);
      }, 4000);
    }

    async function thirdAsyncFuction() {
      setTimeout(() => {
        var childSite = window.open(
          document.querySelector(".ax6MlHvK .hY8lWHgA").href
        );

        if (document.querySelector(".PdiOodzz.hGj6kBXN.E55rWk40")) {
          let imageArray = [];

          GM_xmlhttpRequest({
            method: "GET",
            url: `https://eeapi.cn/api/video/32BA6AAD06C4E5FF5A2F1BEF0285F02F8F53FEF1514E6BADB2/4775/?url=https://www.douyin.com/note/${
              window.location.href.split("=")[1]
            }`,
            onload: function (response) {
              let images = [...JSON.parse(response.responseText).data.images];
              console.log(images);

              for (const item of images) {
                fetch("https://c1n.cn/link/short", {
                  method: "POST",
                  headers: {
                    token: "wLscioXTI09OY3u6ZFKE",
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: "url=" + encodeURIComponent(item),
                })
                  .then((response) => response.json())
                  .then((res) => {
                    imageArray.push(res.data);
                  })
                  .catch((error) => {});
              }

              setTimeout(function () {
                console.log(imageArray);
                childSite.postMessage(
                  {
                    type: "sendUrl",
                    text: imageArray,
                    title: JSON.parse(response.responseText).desc,
                  },
                  "*"
                );
                setTimeout(() => {
                  findDomInterval(".pGZF8lyn.isDark", "click");
                }, 2000);
              }, 5000);
            },
          });
        } else {
          GM_xmlhttpRequest({
            method: "GET",
            url: `https://apis.jxcxin.cn/api/video?url=https://www.douyin.com/video/${
              window.location.href.split("=")[1]
            }`,
            onload: function (response) {
              console.log(JSON.parse(response.responseText).data.url);
              
              fetch("https://c1n.cn/link/short", {
                method: "POST",
                headers: {
                  token: "wLscioXTI09OY3u6ZFKE",
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body:
                  "url=" +
                  encodeURIComponent(
                    JSON.parse(response.responseText).data.url
                  ),
              })
                .then((response) => response.json())
                .then((res) => {
                  videoUrl = res.data;
                  console.log(res.data);
                  setTimeout(function () {
                    childSite.postMessage(
                      {
                        type: "sendUrl",
                        text: videoUrl,
                        title: JSON.parse(response.responseText).desc,
                      },
                      "*"
                    );
                    setTimeout(() => {
                      findDomInterval(".pGZF8lyn.isDark", "click");
                    }, 2000);
                  }, 5000);
                })
                .catch((error) => {});
            },
          });
          // fetch(
          //   `https://eeapi.cn/api/video/32BA6AAD06C4E5FF5A2F1BEF0285F02F8F53FEF1514E6BADB2/4775/?url=https://www.douyin.com/video/${
          //     window.location.href.split("=")[1]
          //   }?modal_id=${window.location.href.split("=")[1]}`,
          //   { method: "get" }
          // )
          //   .then((data) => {
          //     return data.text();
          //   })
          //   .then((data) => {

          //   });
        }
      }, 13000);
    }

    async function executeAsyncFunctions() {
      await firstAsyncFunction();
      await secondAsyncFunction();
      await thirdAsyncFuction();
    }

    function fn() {
      if (document.querySelector("#noticeTypeList")) {
        if (
          document.querySelector("#noticeTypeList").innerText == "@我的" &&
          canClick == true
        ) {
          let item = userList.find((iten) => {
            return iten.isSend == false;
          });
          if (item) {
            if (!item.isSend) {
              clearInterval(interval);
              interval = null;
              setTimeout(() => {
                if (interval == null) {
                  interval = setInterval(fn, 1800);
                }
              }, 5000);

              if (
                document
                  .getElementsByClassName("oLMeIWQe AEr9uGtw")
                  [
                    document.getElementsByClassName("oLMeIWQe AEr9uGtw")
                      .length - 1
                  ].querySelector(".pBjzqjE7.qRVk3N15").innerText ==
                "此评论已删除"
              ) {
                noticeRemove();
              } else {
                item.goClick.click();
                setTimeout(() => {
                  if (
                    document.querySelector(".Y58u3RjO.xE0nWxTo") ||
                    document.querySelector(".N4KSpGs0")
                  ) {
                    noticeRemove();
                  }
                }, 1200);
              }
            }
          }

          if (!new RegExp("modal_id").test(window.location.href)) {
            if (
              document.querySelector("#noticeTypeList").innerText == "@我的"
            ) {
              if (
                document.getElementsByClassName("oLMeIWQe AEr9uGtw")[
                  document.getElementsByClassName("oLMeIWQe AEr9uGtw").length -
                    1
                ]
              ) {
                if (userList.length < 1) {
                  if (
                    document
                      .getElementsByClassName("oLMeIWQe AEr9uGtw")
                      [
                        document.getElementsByClassName("oLMeIWQe AEr9uGtw")
                          .length - 1
                      ].querySelector(".kSJCbaBh")
                  ) {
                    userList.push({
                      author: document
                        .getElementsByClassName("oLMeIWQe AEr9uGtw")
                        [
                          document.getElementsByClassName("oLMeIWQe AEr9uGtw")
                            .length - 1
                        ].querySelector(".hY8lWHgA.oDDVOauL").innerText,
                      imgUrl: document
                        .getElementsByClassName("oLMeIWQe AEr9uGtw")
                        [
                          document.getElementsByClassName("oLMeIWQe AEr9uGtw")
                            .length - 1
                        ].querySelector(".kcsILzHu.zHn46t6j.MDGGdOou").src,
                      goClick: document
                        .getElementsByClassName("oLMeIWQe AEr9uGtw")
                        [
                          document.getElementsByClassName("oLMeIWQe AEr9uGtw")
                            .length - 1
                        ].querySelector(".kSJCbaBh"),
                      isSend: false,
                    });
                  }
                }
              }
            }
          }

          if (new RegExp("modal_id").test(window.location.href)) {
            if (userList[0]) {
              if (userList[0].isSend == false) {
                userList[0].isSend = true;
                videoUrl = `https://www.douyin.com/video/${
                  window.location.href.split("=")[1]
                }?modal_id=${window.location.href.split("=")[1]}`;

                console.log(videoUrl);

                if (
                  document.querySelector(
                    "#merge-all-comment-container > div > div.gL8GFAmM.comment-input-container > div:nth-child(2) > div > div.oC5O5eMH.commentInput-right-ct > div > span:nth-child(2)"
                  )
                )
                  executeAsyncFunctions();
              }
            }
          }
        }
      } else {
        openList();
      }
    }
    var interval = setInterval(fn, 2000);

    setInterval(() => {
      console.log(userList);
      if (
        document.getElementsByClassName(
          "captcha_verify_container style__CaptchaWrapper-sc-1gpeoge-0 zGYIR"
        )[0]
      ) {
        document.cookie =
          "s_v_web_id=verify_ll36fn33_KVjtatWz_MPWv_4F4n_9SCj_izJxdclv16mf;path=/;";

        setTimeout(() => {
          location.reload();
        }, 60 * 1000);
      }
    }, 1000);
    setInterval(() => {
      if (
        document.getElementsByClassName("oLMeIWQe AEr9uGtw")[
          document.getElementsByClassName("oLMeIWQe AEr9uGtw").length - 1
        ] == undefined
      ) {
        window.location.href = "https://www.douyin.com/";
      }
    }, 5 * 60 * 1000);
  }
})();
