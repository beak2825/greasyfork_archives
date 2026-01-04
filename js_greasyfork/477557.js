// ==UserScript==
// @name          评论私信作者
// @namespace   Violentmonkey Scripts
// @match       *://www.douyin.com/*
// @version     1.1.5
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
// @grant       GM_registerMenuCommand
// @run-at      document-body
// @author      zhizhu

// @description 抖音控制
// @downloadURL https://update.greasyfork.org/scripts/477557/%E8%AF%84%E8%AE%BA%E7%A7%81%E4%BF%A1%E4%BD%9C%E8%80%85.user.js
// @updateURL https://update.greasyfork.org/scripts/477557/%E8%AF%84%E8%AE%BA%E7%A7%81%E4%BF%A1%E4%BD%9C%E8%80%85.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef

(function () {
  GM_registerMenuCommand("清空索引", clearIndex);

  function clearIndex() {
    localStorage.removeItem("index");
  }

  function findDomTimeOut(dom, method, time) {
    if (!time) {
      time = 1800;
    }
    setTimeout(() => {
      if (document.querySelector(dom) !== null) {
        switch (method) {
          case "click":
            document.querySelector(dom).click();
            break;

          default:
            break;
        }
      } else {
        console.log(1111);
      }
    }, time);
  }

  let text = `

5.33 I@V.yg 09/23 BTY:/ 复制打开抖音，看看【旅行 可能有关】# 治愈系风景 自由与我 千金不换。# 治愈系风景  https://v.douyin.com/idYTX7AB/
5.33 I@V.yg 09/23 BTY:/ 复制打开抖音，看看【旅行 可能有关】# 治愈系风景 自由与我 千金不换。# 治愈系风景  https://v.douyin.com/id2EtbDp/
5.33 I@V.yg 09/23 BTY:/ 复制打开抖音，看看【旅行 可能有关】# 治愈系风景 自由与我 千金不换。# 治愈系风景  https://v.douyin.com/id6onV9J/
https://v.douyin.com/id2eJGbC/
5.33 I@V.yg 09/23 BTY:/ 复制打开抖音，看看【旅行 可能有关】# 治愈系风景 自由与我 千金不换。# 治愈系风景  https://www.douyin.com/note/7272716551365610787
https://v.douyin.com/id6MLLFk/
5.33 I@V.yg 09/23 BTY:/ 复制打开抖音，看看【旅行 可能有关】# 治愈系风景 自由与我 千金不换。# 治愈系风景  https://v.douyin.com/idMBfDU9/
5.33 I@V.yg 09/23 BTY:/ 复制打开抖音，看看【旅行 可能有关】# 治愈系风景 自由与我 千金不换。# 治愈系风景  https://www.douyin.com/note/7286872954003016999
https://v.douyin.com/idYTv7V1/
5.33 I@V.yg 09/23 BTY:/ 复制打开抖音，看看【旅行 可能有关】# 治愈系风景 自由与我 千金不换。# 治愈系风景  https://v.douyin.com/id6FLr7E/
https://v.douyin.com/idjmmMuP
5.33 I@V.yg 09/23 BTY:/ 复制打开抖音，看看【旅行 可能有关】# 治愈系风景 自由与我 千金不换。# 治愈系风景  https://www.douyin.com/note/7240330073717492995
https://v.douyin.com/idYTxDdB/
5.33 I@V.yg 09/23 BTY:/ 复制打开抖音，看看【旅行 可能有关】# 治愈系风景 自由与我 千金不换。# 治愈系风景  https://www.douyin.com/note/7182900021237402892
https://v.douyin.com/id2J8nsN/
    `;

  let talk = [
    "打扰一下，我们是不用下载的发布任务平台，增加粉丝和点赞，长期有效，欢迎来了解",
    "你好，我们的平台关注点赞赚零花，发布任务接任务都很方便，期待您加入",
    "如果您有提升作品人气，提高关注和点赞量的需求，可以来我们平台，用户多，完成快",
    "欢迎您来美赞发布悬赏任务，涵盖种类齐全：关注，点赞，评论都可以；如果有需要就来看看吧",
    "你好，我们是非常方便的点赞关注等任务发放平台，可以涨粉涨赞，有需要一定要来试试",
    "如果您需要账号涨粉，作品涨赞，那一定要来美赞平台，操作简单，完成很快",
    "你好，如果您想要增加视频点赞和粉丝，只需准备视频作品和你的需求，剩下的交给我们",
    "想要作品提升曝光，获得更多点赞和关注，可以来美赞发布需求，许多博主都在用",
    "打扰您一下，快捷提升人气，发布悬赏任务，快速达成目标，感兴趣可以来了解",
    "可以增加作品曝光的任务平台，简单省心，如果您有提升人气的需要，可以点我头像来了解下",
  ];
  const faceArray = [
    "微笑",
    "不失礼貌的微笑",
    "酷拽",
    "666",
    "呲牙",
    "大金牙",
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
    "大笑",
    "机智",
    "送心",
  ];

  let siteArray = text.match(/https:\/\/v\.douyin\.com\/\S+\b/g);

  console.log(siteArray);

  let index;

  if (localStorage.getItem("index") == null) {
    localStorage.setItem("index", 1);
    window.location.href = siteArray[0];
  }
  if (new RegExp("douyin.com/video").test(window.location.href)) {
    if (localStorage.getItem("index")) {
      index = Number(localStorage.getItem("index"));
      if (index > siteArray.length) {
        console.log("结束");
        throw new Error("结束");
      }
    } else {
      index = 1;
    }

    setTimeout(() => {
      if (document.querySelector("p[data-e2e='error-page']")) {
        localStorage.setItem("index", index + 1);

        window.location.href = siteArray[index];
      }
    }, 2000);

    window.addEventListener("message", function (event) {
      if (event.origin !== location.origin) {
        return;
      }
      if (event.data.type == "sendEnd") {
        console.log("dosomething");

        localStorage.setItem("index", index + 1);

        window.location.href = siteArray[index];
      }
    });
    setTimeout(() => {
      window.open(document.querySelector(".WdX5lXbX a").href);
    }, 4000);
  }

  if (new RegExp("douyin.com/note").test(window.location.href)) {
    if (localStorage.getItem("index")) {
      index = Number(localStorage.getItem("index"));
      if (index > siteArray.length) {
        console.log("结束");
        throw new Error("结束");
      }
    } else {
      index = 1;
    }
    setTimeout(() => {
      if (document.querySelector("p[data-e2e='error-page']")) {
        localStorage.setItem("index", index + 1);

        window.location.href = siteArray[index];
      }
    }, 2000);

    window.addEventListener("message", function (event) {
      if (event.origin !== location.origin) {
        return;
      }
      if (event.data.type == "sendEnd") {
        console.log(index);

        localStorage.setItem("index", index + 1);

        window.location.href = siteArray[index];
      }
    });

    setTimeout(() => {
      window.open(document.querySelector(".WdX5lXbX a").href);
    }, 4000);
  }

  if (new RegExp("douyin.com/user").test(window.location.href)) {
    //判断opener是否是一开始的页面
    if (
      new RegExp("douyin.com/note").test(window.opener.location.href) ||
      new RegExp("douyin.com/video").test(window.opener.location.href) 
    ) {
      let num = 0;

      setTimeout(() => {
        if (
          Number(
            document
              .querySelector("div[data-e2e='user-info-fans']")
              .querySelector(".sCnO6dhe").innerHTML
          ) < 2000 &&
          document.querySelector("#woman_svg__a")
        ) {
          findDomTimeOut(".niBfRBgX.Q_uOVQ1u.SBWUpJd_ a", "click", 3000);
          findDomTimeOut(".qSsCHWSU.GdNlylMd.u4mlHKc5", "click", 5000);

          setTimeout(() => {
            document.querySelector(".Oq4XuF1P span").click()
            setTimeout(() => {
              document
                .getElementsByClassName(
                  "notranslate public-DraftEditor-content"
                )[0]
                .querySelectorAll("span[data-text='true']")[0].innerHTML =
                "@63771125146";
              document
                .getElementsByClassName(
                  "notranslate public-DraftEditor-content"
                )[0]
                .querySelector("span[data-text='true']")
                .dispatchEvent(
                  new Event("input", { bubbles: !0, cancelable: !0 })
                );
              setTimeout(() => {
                document
                  .getElementsByClassName(
                    "notranslate public-DraftEditor-content"
                  )[0]
                  .querySelector("span[data-text='true']")
                  .dispatchEvent(
                    new Event("input", { bubbles: !0, cancelable: !0 })
                  );
              }, 3000);

              setTimeout(() => {
                for (const item of document.querySelectorAll(
                  ".F_tK4JkL.atBox-inner-container"
                )[0].children) {
                  if (item.innerText == "时宜🌈") {
                    item.querySelector(".ywfPed9u").click();
                  }
                }

                //
                setTimeout(() => {
                  document.querySelectorAll(".Oq4XuF1P span")[1].click();
                  findDomTimeOut(".xCXG6Tpy .qX9k19GZ", "click", 1000);
                  setTimeout(() => {
                    document.getElementsByClassName(
                        "notranslate public-DraftEditor-content"
                      )[0]
                      .querySelectorAll("span[data-text='true']")[1].innerHTML =
                      "发任务提人气，做任务赚零花";
                    setTimeout(() => {
                      document.getElementsByClassName(
                          "notranslate public-DraftEditor-content"
                        )[0]
                        .querySelectorAll("span[data-text='true']")[1]
                        .dispatchEvent(
                          new Event("input", { bubbles: !0, cancelable: !0 })
                        );
                    }, 700);

                    //准备发送
                    setTimeout(() => {
                      findDomTimeOut(".oXIqR6qH.OcDpqUTc", "click", 3000);

                      
                      //评论完毕，开始发私信
                      setTimeout(() => {
                        document.querySelectorAll(".Vjmi41VB")[0].click();
                        findDomTimeOut(".hLIm2dFu .RH8TCnaE.z0c5Gipx.I4tJiW0Q","click",3000);

                        findDomTimeOut(".D_AdmjnR span", "click", 4000);
                        findDomTimeOut(".CCUOKWjf .aJJWV5Ft", "click", 5000);
                        setTimeout(() => {
                          let talkIndex =
                            Math.floor(
                              Math.random() * (faceArray.length - 1 - 0 + 1)
                            ) + 0;
                          document
                            .getElementsByClassName(
                              "notranslate public-DraftEditor-content"
                            )[0]
                            .querySelector("span[data-text='true']").innerHTML =
                            "你需要的提升人气好助手[" +
                            faceArray[talkIndex] +
                            "]";

                          document
                            .getElementsByClassName(
                              "notranslate public-DraftEditor-content"
                            )[0]
                            .querySelector("span[data-text='true']")
                            .dispatchEvent(
                              new Event("input", {
                                bubbles: !0,
                                cancelable: !0,
                              })
                            );
                          findDomTimeOut(
                            ".sCp7KhBv.EWT1TDgs.e2e-send-msg-btn",
                            "click",
                            4000
                          );
                          setTimeout(() => {
                            let time = 4000;
                            if (document.querySelector(".TmED0GTO")) {
                              time = 60000 * 30;
                            }

                            setTimeout(() => {
                              window.opener.postMessage({ type: "sendEnd" });
                              window.close();
                            }, time);
                          }, 2000);
                        }, 9000);
                      }, 6000);
                    }, 4000);
                  }, 2000);
                }, 2000);
              }, 7000);
            }, 3000);
          }, 8000);
        } else {
          setTimeout(() => {
            window.opener.postMessage({ type: "sendEnd" });
            window.close();
          }, 2000);
        }
      }, 3000);
    }
  }
})();
