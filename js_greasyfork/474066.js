// ==UserScript==
// @name         8.自动评论@（电脑端）
// @namespace   Violentmonkey Scripts
// @match       *://www.douyin.com/*
// @version     1.0.9
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
// @downloadURL https://update.greasyfork.org/scripts/474066/8%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA%40%EF%BC%88%E7%94%B5%E8%84%91%E7%AB%AF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/474066/8%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA%40%EF%BC%88%E7%94%B5%E8%84%91%E7%AB%AF%EF%BC%89.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef

(function () {
  "use strict";

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
    setTimeout(() => {
      if( document.querySelectorAll("div[data-e2e='feed-active-video']")[0]==undefined){
        window.location.reload()
      }
      
    }, 1000);

    if (
      document
        .querySelectorAll("div[data-e2e='feed-active-video']")[0]
        ?.querySelector(".BRVFKf2N") ||
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
        interval = setInterval(fn, 2000);
      }
    } else {
      setTimeout(() => {
        let currentDom = document.querySelectorAll(
          "div[data-e2e='feed-active-video']"
        )[0];

        if (
          Number(currentDom.querySelector(".hfgGrUTS.Y006Bsbt")?.innerText) <
            2000 ||
          Number(currentDom.querySelector(".SfwAcdr1.JrV13Yco")?.innerText) <
            2000 ||
          currentDom.querySelector(".SfwAcdr1.JrV13Yco")?.innerText == "抢首评"
        ) {
          //评论
          clearInterval(interval);
          interval = null;

          // @
          if (
            document.querySelector(
              "div[data-e2e='feed-active-video'] #\\@嘉年华👑"
            ) &&
            document.querySelector("div.wx4oFjSc")?.innerHTML ==
              document
                .querySelector("div[data-e2e='feed-active-video'] #\\@嘉年华👑")
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
              if (
                document.getElementsByClassName(
                  "JOT0FK4T I1t22JqH isDark yoHWkLaG dOluRUuw"
                )[0]
              ) {
                currentDom.querySelector(".SfwAcdr1.JrV13Yco").click();
              }

              if (new RegExp("search").test(window.location.href)) {
                document
                  .querySelectorAll(
                    "div[data-e2e='feed-active-video'] .XAze1wis span"
                  )[0]
                  .click();

                setTimeout(() => {
                  try {
                    document.querySelectorAll(
                      "div[data-e2e='feed-active-video'] span[data-text='true']"
                    )[0].innerHTML = "@Ynsp";
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
                }, 1000);

                setTimeout(() => {
                  try {
                    for (const item of document.querySelectorAll(
                      ".nA8iIE7L.atBox-inner-container"
                    )[0].children) {
                      if (item.innerText == "嘉年华👑") {
                        item.querySelector(".nJneFzVg").click();

                        setTimeout(() => {
                          document
                            .querySelectorAll(
                              "div[data-e2e='feed-active-video'] .XAze1wis span"
                            )[1]
                            .click();

                          setTimeout(() => {
                            currentDom
                              .querySelector(".gETXElOH .dXGx1zv9")
                              .click();

                            setTimeout(() => {
                              if (
                                document.querySelector(
                                  "#merge-all-comment-container > div > div.qdcce5kG.comment-input-container > div:nth-child(2) > div > div.pOcGUDMb > div > div > div > div > div > div > div > span:nth-child(2) > span"
                                )
                              ) {
                                let input = document.querySelector(
                                  "#merge-all-comment-container > div > div.qdcce5kG.comment-input-container > div:nth-child(2) > div > div.pOcGUDMb > div > div > div > div > div > div > div > span:nth-child(2) > span"
                                );

                                var xhr = new XMLHttpRequest();
                                xhr.open("get", "https://v1.hitokoto.cn");
                                xhr.onreadystatechange = function () {
                                  if (xhr.readyState === 4) {
                                    var data = JSON.parse(xhr.responseText);
                                    console.log(data);
                                    input.innerHTML = data.hitokoto;
                                    // "\n阁下实力虽强，但比起我的操作，还是略逊一筹\n就算隐藏了视频，依然存在我的手机里，生生世世\n可能这就是长大的代价吧";

                                    input.dispatchEvent(
                                      new Event("input", {
                                        bubbles: !0,
                                        cancelable: !0,
                                      })
                                    );

                                    // 模拟键盘输入@
                                    var event = new Event("keydown", {
                                      key: "@",
                                    });
                                    input.dispatchEvent(event);

                                    // 模拟键盘输入@
                                    var event = new Event("keyup", {
                                      key: "@",
                                    });
                                    input.dispatchEvent(event);

                                    setTimeout(() => {
                                      currentDom
                                        .querySelector(".OGIa7O6a.ZUkCSg5u")
                                        .click();

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
                                            3000
                                          );
                                        }

                                        setTimeout(() => {
                                          if (interval == null) {
                                            interval = setInterval(fn, 3800);
                                          }
                                        }, 2800);
                                      }, 3200);
                                    }, 2500);
                                  }
                                };
                                xhr.send();
                              }
                            }, 2000);
                          }, 1000);
                        }, 2000);
                      }
                    }
                  } catch (error) {
                    // window.location.reload();
                    console.log(error);
                  }
                }, 4000);
              } else {
                setTimeout(() => {
                  document
                    .querySelectorAll(
                      "div[data-e2e='feed-active-video'] .Oq4XuF1P span"
                    )[0]
                    .click();

                  setTimeout(() => {
                    try {
                      document.querySelectorAll(
                        "div[data-e2e='feed-active-video'] span[data-text='true']"
                      )[0].innerHTML = "@Ynsp";
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
                  }, 1000);

                  setTimeout(() => {
                    try {
                      for (const item of document.querySelectorAll(
                        ".F_tK4JkL.atBox-inner-container"
                      )[0].children) {
                        if (item.innerText == "嘉年华👑") {
                          item.querySelector(".kkIgSOBm").click();

                          setTimeout(() => {
                            document
                              .querySelectorAll(
                                "div[data-e2e='feed-active-video'] .Oq4XuF1P span"
                              )[1]
                              .click();

                            setTimeout(() => {
                              try {
                                currentDom
                                .querySelector(".xCXG6Tpy .qX9k19GZ")
                                .click();
                              } catch (error) {
                                window.location.reload()
                              }
                              

                              setTimeout(() => {
                                if (
                                  document.querySelector(
                                    "#merge-all-comment-container > div > div.gL8GFAmM.comment-input-container > div:nth-child(2) > div > div.d66pgCnu > div > div > div > div > div > div > div > span:nth-child(2) > span"
                                  )
                                ) {
                                  let input = document.querySelector(
                                    "#merge-all-comment-container > div > div.gL8GFAmM.comment-input-container > div:nth-child(2) > div > div.d66pgCnu > div > div > div > div > div > div > div > span:nth-child(2) > span"
                                  );

                                  var xhr = new XMLHttpRequest();
                                  xhr.open("get", "https://v1.hitokoto.cn");
                                  xhr.onreadystatechange = function () {
                                    if (xhr.readyState === 4) {
                                      var data = JSON.parse(xhr.responseText);
                                      console.log(data);
                                      input.innerHTML = data.hitokoto;
                                      // "\n阁下实力虽强，但比起我的操作，还是略逊一筹\n就算隐藏了视频，依然存在我的手机里，生生世世\n可能这就是长大的代价吧";

                                      input.dispatchEvent(
                                        new Event("input", {
                                          bubbles: !0,
                                          cancelable: !0,
                                        })
                                      );

                                      // 模拟键盘输入@
                                      var event = new Event("keydown", {
                                        key: "@",
                                      });
                                      input.dispatchEvent(event);

                                      // 模拟键盘输入@
                                      var event = new Event("keyup", {
                                        key: "@",
                                      });
                                      input.dispatchEvent(event);

                                      setTimeout(() => {
                                        currentDom
                                          .querySelector(".oXIqR6qH.OcDpqUTc")
                                          .click();

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
                                              3000
                                            );
                                          }

                                          setTimeout(() => {
                                            if (interval == null) {
                                              interval = setInterval(fn, 3800);
                                            }
                                          }, 2800);
                                        }, 3200);
                                      }, 2500);
                                    }
                                  };
                                  xhr.send();
                                }
                              }, 2000);
                            }, 1000);
                          }, 2000);
                        }
                      }
                    } catch (error) {
                      // window.location.reload();
                      console.log(error);
                    }
                  }, 4000);
                }, 2000);
              }
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
    document.querySelector(".ZCHTRJzJ.isDark").click();
    setTimeout(() => {
      document.documentElement.scrollTop =
        document.documentElement.scrollHeight + 1500;
      setTimeout(() => {
        document
          .querySelectorAll(".MgWTwktU.search-result-card.B9KMVC9A a")
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
      findDomTimeOut(".MgWTwktU.B9KMVC9A a", "click", 1000);
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
