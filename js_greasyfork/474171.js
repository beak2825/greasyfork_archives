// ==UserScript==
// @name         11.自动回复（只回复一个人）
// @namespace   Violentmonkey Scripts
// @match       *://www.douyin.com/*
// @version     1.0.8
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
// @downloadURL https://update.greasyfork.org/scripts/474171/11%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%EF%BC%88%E5%8F%AA%E5%9B%9E%E5%A4%8D%E4%B8%80%E4%B8%AA%E4%BA%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/474171/11%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%EF%BC%88%E5%8F%AA%E5%9B%9E%E5%A4%8D%E4%B8%80%E4%B8%AA%E4%BA%BA%EF%BC%89.meta.js
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

    findDomInterval(".cv1wbFR5 > span:nth-child(1)", "click");
    findDomInterval(".en2NwboT", "click");

    document.querySelector(
      "div.TNoRtROB > div > div > div.xGjPYgWx.zh3cuxJt > div > div.o5pFLFrr > div > div > div._3ID83VEz > div.Io_DC76_ > div > div > div > div > div > div > div > span > span"
    );

    setTimeout(() => {
      var changeTextVal = setInterval(() => {
        let input = document.querySelector(
          "div.TNoRtROB > div > div > div.xGjPYgWx.zh3cuxJt > div > div.o5pFLFrr > div > div > div._3ID83VEz > div.Io_DC76_ > div > div > div > div > div > div > div > span > span"
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

    setInterval(() => {
      let input = document.querySelector(
        "div.TNoRtROB > div > div > div.xGjPYgWx.zh3cuxJt > div > div.o5pFLFrr > div > div > div._3ID83VEz > div.Io_DC76_ > div > div > div > div > div > div > div > span > span"
      );
      if (input && input.innerHTML.length > 6) {
        setTimeout(() => {
          findDomInterval(
            "div.TNoRtROB > div > div > div.xGjPYgWx.zh3cuxJt > div > div.o5pFLFrr > div > div > div._3ID83VEz > div.SEAeJy0K > div > span.cW9Hyt2D.j5Gubm7H.e2e-send-msg-btn",
            "click"
          );

          e.source.postMessage({ type: "sendSuccess", text: 1234 }, "*");
          setTimeout(() => {
            window.close();
          }, 3000);
        }, 2200);
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
          if (
            document.querySelector(
              "div.p6_XFKN2 > div.HqxPzh_q > h1 > span > span > span > span > span > span"
            ).innerHTML == "CBA总a"
          ) {
            userAsyncFunctions(event);
          } else {
            window.opener.postMessage({ type: "sendSuccess", text: 1234 }, "*");
            setTimeout(() => {
              window.close();
            }, 3000);
          }
        }, 3000);
      }
    }
  }

  // Your code here...
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
      var AtClickVal = setInterval(() => {
        
          if(document.querySelector("#noticeTypeList > div > div")){
            if(!document
              .querySelector(
                "#noticeTypeList > div.KxlyAMJ2._eGSKk4N > div > div:nth-child(3)"
              )){
                document.querySelector("#noticeTypeList > div > div").click()
                setTimeout(() => {
            document
              .querySelector(
                "#noticeTypeList > div.KxlyAMJ2._eGSKk4N > div > div:nth-child(3)"
              )
              .click();

          }, 5000);
                clearInterval(AtClickVal);
            AtClickVal = null;

              }
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
              if (document.getElementsByClassName("ddvgjF_p Ov19m7T6")[0]) {
                if (userList.length < 1) {
                  if (
                    document.getElementsByClassName("ddvgjF_p Ov19m7T6")[0]
                      .parentElement.parentElement.nextElementSibling
                  ) {
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
          if(document.querySelectorAll(".JTui1eE0").length>5)
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
        document.getElementsByClassName("ddvgjF_p Ov19m7T6")[0] == undefined
      ) {
        window.location.href = "https://www.douyin.com/";
      }
    }, 5 * 60 * 1000);
  }
})();
