// ==UserScript==
// @name         10.抖音下载助手脚本（手机版）
// @namespace   Violentmonkey Scripts
// @match       *://www.douyin.com/*
// @version     1.0.3
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
// @run-at      document-body
// @author      zhizhu

// @description 抖音控制
// @downloadURL https://update.greasyfork.org/scripts/474080/10%E6%8A%96%E9%9F%B3%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%E8%84%9A%E6%9C%AC%EF%BC%88%E6%89%8B%E6%9C%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/474080/10%E6%8A%96%E9%9F%B3%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%E8%84%9A%E6%9C%AC%EF%BC%88%E6%89%8B%E6%9C%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef
(function () {
    "use strict";
  
    function findDomInterval(dom, method) {
      var interval = setInterval(() => {
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
  
          clearInterval(interval);
          interval = null;
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
        document
          .getElementsByClassName("ddvgjF_p Ov19m7T6")[0]
          .parentElement.parentElement.parentElement.parentElement.querySelectorAll(
            ".OlqG24AG"
          )[0]
      );
  
      btn.dispatchEvent(event); //hello
  
      setTimeout(() => {
        if (document.querySelector(".r1RO4RJ1 .d9BF60X6")) {
          document.querySelector(".r1RO4RJ1 .d9BF60X6").click();
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
      findDomInterval(
        "#douyin-right-container > div._bEYe5zo > div > div > div.x2yFtBWw.Ll07vpAQ > div._7gdyuNUv.aYWQQ_nh > button.B10aL8VQ.s6mStVxD.vMQD6aai.vk7WaOg_.a2I1sBCL.tAofAbwG",
        "click"
      );
  
      findDomInterval(
        "#douyin-header > div.oJArD0aS > header > div > div > div.iqHX00br > div > div > ul:nth-child(6) > div > li > div > div > div.TNoRtROB > div > div > div.xGjPYgWx.zh3cuxJt > div > div.o5pFLFrr > div > div > div.KmfRPwDg.d91KM0GU > div.YoC0ARwV > div > span:nth-child(1)",
        "click"
      );
  
      setTimeout(() => {
        var changeTextVal = setInterval(() => {
          if (
            document.querySelector(
              "#douyin-header > div.oJArD0aS > header > div > div > div.iqHX00br > div > div > ul:nth-child(6) > div > li > div > div > div.TNoRtROB > div > div > div.xGjPYgWx.zh3cuxJt > div > div.o5pFLFrr > div > div > div._3ID83VEz > div.Io_DC76_ > div > div > div > div > div > div > div > span > span"
            ).innerHTML.length < 6
          ) {
            let title = "";
  
            if (Array.isArray(e.data.text)) {
              let text = ``;
              if (e.data.title) {
                title = `${e.data.title}\n`;
              }
  
              for (const item of e.data.text) {
                text += `${item}\n`;
              }
  
              document.querySelector(
                "#douyin-header > div.oJArD0aS > header > div > div > div.iqHX00br > div > div > ul:nth-child(6) > div > li > div > div > div.TNoRtROB > div > div > div.xGjPYgWx.zh3cuxJt > div > div.o5pFLFrr > div > div > div._3ID83VEz > div.Io_DC76_ > div > div > div > div > div > div > div > span > span"
              ).innerHTML = `你要下载的视频\n${title}${text}复制到浏览器打开，60分钟有效，过时作废`;
            } else {
              document.querySelector(
                "#douyin-header > div.oJArD0aS > header > div > div > div.iqHX00br > div > div > ul:nth-child(6) > div > li > div > div > div.TNoRtROB > div > div > div.xGjPYgWx.zh3cuxJt > div > div.o5pFLFrr > div > div > div._3ID83VEz > div.Io_DC76_ > div > div > div > div > div > div > div > span > span"
              ).innerHTML = `你要下载的视频\n${title}${e.data.text}复制到浏览器打开，60分钟有效，过时作废`;
            }
  
            document
              .querySelector(
                "#douyin-header > div.oJArD0aS > header > div > div > div.iqHX00br > div > div > ul:nth-child(6) > div > li > div > div > div.TNoRtROB > div > div > div.xGjPYgWx.zh3cuxJt > div > div.o5pFLFrr > div > div > div._3ID83VEz > div.Io_DC76_ > div > div > div > div > div > div > div > span > span"
              )
              .dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 }));
            changeTextVal = null;
            clearInterval(changeTextVal);
          }
        }, 800);
      }, 2000);
    }
  
    async function userSendAsyncFunction(e) {
      //发送
  
      setInterval(() => {
        if (
          document.querySelector(
            "#douyin-header > div.oJArD0aS > header > div > div > div.iqHX00br > div > div > ul:nth-child(6) > div > li > div > div > div.TNoRtROB > div > div > div.xGjPYgWx.zh3cuxJt > div > div.o5pFLFrr > div > div > div._3ID83VEz > div.Io_DC76_ > div > div > div > div > div > div > div > span > span"
          ).innerHTML.length > 6
        ) {
          setTimeout(() => {
            findDomInterval(
              "#douyin-header > div.oJArD0aS > header > div > div > div.iqHX00br > div > div > ul:nth-child(6) > div > li > div > div > div.TNoRtROB > div > div > div.xGjPYgWx.zh3cuxJt > div > div.o5pFLFrr > div > div > div._3ID83VEz > div.SEAeJy0K > div > span.cW9Hyt2D.j5Gubm7H.e2e-send-msg-btn",
              "click"
            );
  
            e.source.postMessage({ type: "sendSuccess", text: 1234 }, "*");
            setTimeout(() => {
              window.close();
            }, 2000);
          }, 1200);
        }
      }, 1000);
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
    
  
    // 调用 executeAsyncFunctions 来执行异步函数
  
    //触发事件
    let userList = [];
    let videoUrl;
  
    if (!new RegExp("/user/").test(window.location.href)) {
      window.addEventListener("message", receiveMessage);
      function receiveMessage(event) {
        if (event.data.type == "sendSuccess") {
          if (userList.length > 0) {
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
              document
                .getElementsByClassName("ddvgjF_p Ov19m7T6")[0]
                .parentElement.parentElement.parentElement.parentElement.querySelectorAll(
                  ".OlqG24AG"
                )[0]
            );
  
            btn.dispatchEvent(event); //hello
  
            setTimeout(() => {
              if (document.querySelector(".r1RO4RJ1 .d9BF60X6")) {
                document.querySelector(".r1RO4RJ1 .d9BF60X6").click();
              }
  
              setTimeout(() => {
                userList.shift();
              }, 2000);
            }, 1400);
          }
        }
        if (event.data.type == "close") {
          window.location.href = "https://www.douyin.com/";
        }
      }
  
      async function firstAsyncFunction() {
        findDomInterval(
          "#merge-all-comment-container > div > div.qdcce5kG.comment-input-container > div:nth-child(2) > div > div.ZYKj4kJN.commentInput-right-ct > div > span:nth-child(2)",
          "click"
        );
  
        setTimeout(() => {
          findDomInterval(
            "#merge-all-comment-container > div > div.qdcce5kG.comment-input-container > div:nth-child(2) > div > div.Czj8kLDK.a9x8J4le.qVgLwbVH.emoji-card-outer-container > div > div > span:nth-child(1)",
            "click"
          );
        }, 1000);
      }
  
      async function secondAsyncFunction() {
        setTimeout(() => {
          document.querySelector(
            "#merge-all-comment-container > div > div.qdcce5kG.comment-input-container > div:nth-child(2) > div > div.pOcGUDMb > div > div > div > div > div > div > div > span > span"
          ).innerHTML = "你需要的无水印视频下载地址已发私信";
  
          document
            .querySelector(
              "#merge-all-comment-container > div > div.qdcce5kG.comment-input-container > div:nth-child(2) > div > div.pOcGUDMb > div > div > div > div > div"
            )
            .dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 }));
          setTimeout(() => {
            document
              .querySelector(
                "#merge-all-comment-container > div > div.sX7gMtFl.comment-mainContent.MR0IFMr1 > div:nth-child(1) > div > div.RHiEl2d8 > div > div.a9uirtCT"
              )
              .parentElement.querySelector(".NvTzAVts.BcxjcqYg")
              .click();
            setTimeout(() => {
              findDomInterval(
                "#merge-all-comment-container > div > div.qdcce5kG.comment-input-container > div:nth-child(2) > div.Npz7CPXj.comment-input-inner-container.UBgfYMF_ > div.ZYKj4kJN.commentInput-right-ct > div > span.OGIa7O6a.ZUkCSg5u",
                "click"
              );
  
              setTimeout(() => {
                if (
                  document.querySelector(".Y58u3RjO.SQZJT7Ba").innerHTML !==
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
            document
              .querySelector(
                "#merge-all-comment-container > div > div.sX7gMtFl.comment-mainContent.MR0IFMr1 > div:nth-child(1) > div > div.RHiEl2d8 > div > div.a9uirtCT"
              )
              .parentElement.querySelector(".nEg6zlpW").firstChild.href
          );
  
          if (document.querySelector(".PdiOodzz.hGj6kBXN.E55rWk40")) {
            let imageArray = [];
            fetch(
              `https://eeapi.cn/api/video/32F2E78631CFE958A60BCD7BD9ECD91A537F12012A9F62E5E2/462/?url=https://www.douyin.com/note/${
                window.location.href.split("=")[1]
              }`,
              { method: "get" }
            )
              .then((data) => {
                return data.text();
              })
              .then((data) => {
                let images = [...JSON.parse(data).data.images];
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
                      title: JSON.parse(data).data.title,
                    },
                    "*"
                  );
                  setTimeout(() => {
                    findDomInterval(".ZCHTRJzJ.isDark .bFdMjgdW", "click");
                  }, 2000);
                }, 5000);
              });
          } else {
            fetch(
              `https://eeapi.cn/api/video/32F2E78631CFE958A60BCD7BD9ECD91A537F12012A9F62E5E2/462/?url=https://www.douyin.com/video/${
                window.location.href.split("=")[1]
              }?modal_id=${window.location.href.split("=")[1]}`,
              { method: "get" }
            )
              .then((data) => {
                return data.text();
              })
              .then((data) => {
                fetch("https://c1n.cn/link/short", {
                  method: "POST",
                  headers: {
                    token: "wLscioXTI09OY3u6ZFKE",
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: "url=" + encodeURIComponent(JSON.parse(data).data.video),
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
                          title: JSON.parse(data).data.title,
                        },
                        "*"
                      );
                      setTimeout(() => {
                        findDomInterval(".ZCHTRJzJ.isDark .bFdMjgdW", "click");
                      }, 2000);
                    }, 5000);
                  })
                  .catch((error) => {});
              });
          }
        }, 6500);
      }
  
      async function executeAsyncFunctions() {
        await firstAsyncFunction();
        await secondAsyncFunction();
        await thirdAsyncFuction();
      }
  
      function fn() {
        function openList() {
            for (const item of document.querySelectorAll(".JTui1eE0")) {
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
                openListdom.querySelector(".gVAgxPt4")
              );
        
              btn.dispatchEvent(event); //hello
            }
            setTimeout(() => {
              findDomInterval("#noticeTypeList > div > div", "click");
              findDomInterval(
                "#noticeTypeList > div.KxlyAMJ2._eGSKk4N > div > div:nth-child(3)",
                "click"
              );
            }, 1100);
          }
        console.log(66666);
        if (document.querySelector("#noticeTypeList")) {
          if (document.querySelector("#noticeTypeList").innerText == "@我的") {
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
                    .getElementsByClassName("ddvgjF_p Ov19m7T6")[0]
                    .parentElement.querySelector(".sKootKqo.BxFczFyO")
                    .innerText == "此评论已删除"
                ) {
                  noticeRemove();
                } else {
                  item.goClick.click();
                  setTimeout(() => {
                    if (document.querySelector(".Y58u3RjO.xE0nWxTo")||document.querySelector(".N4KSpGs0")) {
                      noticeRemove();
                    }
                  }, 1200);
                }
              }
            }
           
  
            if (!new RegExp("modal_id").test(window.location.href)) {
              if (document.getElementsByClassName("ddvgjF_p Ov19m7T6")[0]) {
                if (userList.length < 1) {
                  userList.push({
                    author:
                      document.getElementsByClassName("ddvgjF_p Ov19m7T6")[0]
                        .parentElement.firstElementChild.firstElementChild
                        .innerText,
                    imgUrl:
                      document.getElementsByClassName("ddvgjF_p Ov19m7T6")[0]
                        .parentElement.parentElement.nextElementSibling.src,
                    goClick:
                      document.getElementsByClassName("ddvgjF_p Ov19m7T6")[0]
                        .parentElement.parentElement.nextElementSibling,
                    isSend: false,
                  });
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
                        "#merge-all-comment-container > div > div.qdcce5kG.comment-input-container > div:nth-child(2) > div > div.ZYKj4kJN.commentInput-right-ct > div > span:nth-child(2)"
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
      setTimeout(() => {
        interval = setInterval(fn, 2000);
      }, 15000);
      var interval 
  
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
            }, 60*1000);
        }
      }, 1000);
      setTimeout(() => {
        if (
          document.getElementsByClassName("ddvgjF_p Ov19m7T6")[0] == undefined
        ) {
          window.location.href = "https://www.douyin.com/";
        }
      }, 5 * 60 * 1000);
    }
  })();
  