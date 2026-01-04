// ==UserScript==
// @name         9.自动评论@（压力测试）
// @namespace   Violentmonkey Scripts
// @match       *://www.douyin.com/*
// @version     1.0.4
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
// @downloadURL https://update.greasyfork.org/scripts/474067/9%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA%40%EF%BC%88%E5%8E%8B%E5%8A%9B%E6%B5%8B%E8%AF%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/474067/9%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA%40%EF%BC%88%E5%8E%8B%E5%8A%9B%E6%B5%8B%E8%AF%95%EF%BC%89.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef

(function () {
    "use strict";
    let setIndex = 1
  if(JSON.parse(localStorage.getItem("setIndex"))){
    setIndex = JSON.parse(localStorage.getItem("setIndex"))
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
  
    function fn() {
      console.log(66666);
  
      if (
        document.querySelector(
          "div[data-e2e='feed-active-video'] .xgplayer-playswitch-next.disabled"
        )
      ) {
        clearInterval(interval);
        interval = null;
        nextDisabled();
      }
  
      if (
        document.querySelectorAll("div[data-e2e='feed-active-video']")[0] ==
          undefined ||
        document.querySelectorAll(
          "div[data-e2e='feed-active-video'] .RA5iG98_"
        )[0] ||
        document.querySelectorAll(
          "div[data-e2e='feed-active-video'] .Lnsyat3L"
        )[0]
      ) {
        if (new RegExp("search").test(window.location.href)) {
          index++;
          document
            .querySelector(
              "div[data-e2e='feed-active-video'] .xgplayer-playswitch-next"
            )
            .click();
        } else {
          document.querySelectorAll(".xgplayer-playswitch-next")[0].click();
        }
  
        clearInterval(interval);
        interval = null;
        if (interval == null) {
          interval = setInterval(fn, 1800);
        }
      } else {
        setTimeout(() => {
          let currentDom = document.querySelectorAll(
            "div[data-e2e='feed-active-video']"
          )[0];
  
          if (
            Number(currentDom.querySelector(".hfgGrUTS.Y006Bsbt").innerText) <
              20 ||
            currentDom.querySelector(".hfgGrUTS.Y006Bsbt").innerText == "抢首评"
          ) {
            //评论
            clearInterval(interval);
            interval = null;
  
            // @
            if (
              document.querySelector(
                "div[data-e2e='feed-active-video'] #\\@关关👑视频下载"
              ) &&
              document.querySelector("div.wx4oFjSc").innerHTML ==
                document
                  .querySelector(
                    "div[data-e2e='feed-active-video'] #\\@关关👑视频下载"
                  )
                  .closest(".YzbzCgxU.Q7m2YYn9")
                  .querySelector(".Uvaas5kD").innerText
            ) {
              if (new RegExp("search").test(window.location.href)) {
                index++;
                document
                  .querySelector(
                    "div[data-e2e='feed-active-video'] .xgplayer-playswitch-next"
                  )
                  .click();
              } else {
                document.querySelectorAll(".xgplayer-playswitch-next")[0].click();
              }
              setTimeout(() => {
                if (interval == null) {
                  interval = setInterval(fn, 2000);
                }
              }, 2000);
            } else {
              setTimeout(() => {
                currentDom
                  .querySelector(
                    "#merge-all-comment-container > div > div.qdcce5kG.comment-input-container > div:nth-child(2) > div > div.ZYKj4kJN.commentInput-right-ct > div > span:nth-child(1)"
                  )
                  .click();
  
                setTimeout(() => {
                  try {
                    document.querySelectorAll(
                      "div[data-e2e='feed-active-video'] span[data-text='true']"
                    )[0].innerHTML = "@关关";
                    document
                      .querySelectorAll(
                        "div[data-e2e='feed-active-video'] span[data-text='true']"
                      )[0]
                      .dispatchEvent(
                        new Event("input", { bubbles: !0, cancelable: !0 })
                      );
                  } catch (error) {
                    window.location.reload();
                  }
  
                  setTimeout(() => {
                    try {
                      for (const item of document.querySelectorAll(
                        ".nA8iIE7L.atBox-inner-container"
                      )[0].children) {
                        if (item.innerText == "关关👑视频下载") {
                          item.querySelector(".dyt4sciY").click();
  
                          setTimeout(() => {
                            if (
                              document.querySelector(
                                "#merge-all-comment-container > div > div.qdcce5kG.comment-input-container > div:nth-child(2) > div > div.pOcGUDMb > div > div.DraftEditor-root > div > div > div > div > div > span:nth-child(2) > span"
                              )
                            ) {
                              let input = document.querySelector(
                                "#merge-all-comment-container > div > div.qdcce5kG.comment-input-container > div:nth-child(2) > div > div.pOcGUDMb > div > div.DraftEditor-root > div > div > div > div > div > span:nth-child(2) > span"
                              );
                              input.innerHTML = `${setIndex}`;
                                setIndex++
                                localStorage.setItem("setIndex", JSON.stringify(setIndex));
  
                              input.dispatchEvent(
                                new Event("input", {
                                  bubbles: !0,
                                  cancelable: !0,
                                })
                              );
  
                              setTimeout(() => {
                                findDomTimeOut(".OGIa7O6a.ZUkCSg5u", "click");
  
                                setTimeout(() => {
                                  if (
                                    new RegExp("search").test(
                                      window.location.href
                                    )
                                  ) {
                                    index++;
  
                                    document
                                      .querySelector(
                                        "div[data-e2e='feed-active-video'] .xgplayer-playswitch-next"
                                      )
                                      .click();
                                  } else {
                                    findDomTimeOut(
                                      ".xgplayer-playswitch-next",
                                      "click",
                                      2000
                                    );
                                  }
  
                                  setTimeout(() => {
                                    if (interval == null) {
                                      interval = setInterval(fn, 1800);
                                    }
                                  }, 2800);
                                }, 3200);
                              }, 2500);
                            }
                          }, 2000);
                        }
                      }
                    } catch (error) {
                      window.location.reload();
                    }
                  }, 2000);
                }, 2000);
              }, 3000);
            }
          } else {
            if (new RegExp("search").test(window.location.href)) {
              index++;
  
              document
                .querySelector(
                  "div[data-e2e='feed-active-video'] .xgplayer-playswitch-next"
                )
                .click();
            } else {
              document.querySelectorAll(".xgplayer-playswitch-next")[0].click();
            }
          }
        }, 1000);
      }
    }
  
    function nextDisabled() {
      document
        .querySelector(
          "#douyin-right-container > div:nth-child(5) > div.ZCHTRJzJ.isDark > div"
        )
        .click();
      setTimeout(() => {
        document.documentElement.scrollTop =
          document.documentElement.scrollHeight + 1500;
        setTimeout(() => {
          document
            .querySelectorAll(".TgJeUdJ2.B9KMVC9A .MgWTwktU a")
            [index - 1].click();
          findDomTimeOut(
            "div[data-e2e='feed-active-video'] .hfgGrUTS.Y006Bsbt",
            "click",
            4000
          );
          setTimeout(() => {
            interval = setInterval(fn, 2000);
          }, 5000);
        }, 5000);
      }, 1200);
    }
  
    if (new RegExp("search").test(window.location.href)) {
      setTimeout(() => {
        if (
          document.querySelector(".dC4GYZQ1").children[1].className !== "qwx22yjn"
        ) {
          document.querySelector(".dC4GYZQ1").children[1].click();
        }
      }, 1000);
      var index = 0;
    }
  
    var interval;
    setTimeout(() => {
      findDomTimeOut(
        "div[data-e2e='feed-active-video'] .hfgGrUTS.Y006Bsbt",
        "click",
        3000
      );
      if (new RegExp("search").test(window.location.href)) {
        findDomTimeOut(".TgJeUdJ2.B9KMVC9A .MgWTwktU a", "click", 1000);
      }
  
      interval = setInterval(fn, 2000);
  
      setInterval(() => {
        if (interval == null) {
          clearInterval(interval);
          interval = null;
          if (new RegExp("search").test(window.location.href)) {
            index++;
            document
              .querySelector(
                "div[data-e2e='feed-active-video'] .xgplayer-playswitch-next"
              )
              .click();
          } else {
            document.querySelectorAll(".xgplayer-playswitch-next")[0].click();
          }
  
          setTimeout(() => {
            interval = setInterval(fn, 2000);
          }, 3000);
        }
      }, 5 * 60 * 1000);
    }, 4000);
  
    if (!new RegExp("search").test(window.location.href)) {
      setTimeout(() => {
        window.location.href = "https://www.douyin.com/";
      }, 10 * 60 * 1000);
    }
  
    // Your code here...
  })();
  