// ==UserScript==
// @name         粉丝自动私信
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
// @downloadURL https://update.greasyfork.org/scripts/476930/%E7%B2%89%E4%B8%9D%E8%87%AA%E5%8A%A8%E7%A7%81%E4%BF%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/476930/%E7%B2%89%E4%B8%9D%E8%87%AA%E5%8A%A8%E7%A7%81%E4%BF%A1.meta.js
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

  let text = `https://v.douyin.com/idukUgAx/
  https://v.douyin.com/iduByutm/
  5.33 I@V.yg 09/23 BTY:/ 复制打开抖音，看看【旅行 可能有关】# 治愈系风景 自由与我 千金不换。# 治愈系风景  https://v.douyin.com/iduB14q5/
  5.33 I@V.yg 09/23 BTY:/ 复制打开抖音，看看【旅行 可能有关】# 治愈系风景 自由与我 千金不换。# 治愈系风景  https://www.douyin.com/note/7286658414602620219
  5.33 I@V.yg 09/23 BTY:/ 复制打开抖音，看看【旅行 可能有关】# 治愈系风景 自由与我 千金不换。# 治愈系风景  https://v.douyin.com/idmvDBSm/
  5.33 I@V.yg 09/23 BTY:/ 复制打开抖音，看看【旅行 可能有关】# 治愈系风景 自由与我 千金不换。# 治愈系风景  https://v.douyin.com/idukEQDT/
  
`;

  let talk = [
    "您好，如果您有闲暇时间，可以来刷视频，赚零花，这里做任务太简单了",
    "你好，闲暇时间，可以来做本平台点赞的任务，赚零花钱，提现秒到账，点我了解",
    "您好，美赞是简单好上手的接任务平台，0.5元即可提现，新人还有更过福利，欢迎您了解",
    "不好意思打扰一下：我们要让行动更有价值，许多人都在用的接任务平台，点赞关注，动动手赚零花，简单好操作",
    "一边看视频，一边做任务，几秒钟就可以完成，审核快，秒提现，闲暇时间可以来试试",
    "你好，我们是可以长期做的小任务平台，闲暇时可以赚杯奶茶钱，感兴趣来看看吧 ",
    "你好，看视频过程就可以完成小额关注或者点赞任务，提现会立即到账，满5毛就可提现，有兴趣可以来看看",
    "接点赞关注小任务，提高闲暇时间的利用率，不用下载，无门槛，每单小额，满5毛就可以提现，需要的话可以看一看",
    "我们是0门槛的做任务挣零花平台，0.5元即可提现，秒到账，欢迎来一起挣零花",
    "做博主发布的关注点赞的小任务，满5毛提现，奖励多多，欢迎来加入",
  ];

  const faceArray = [
    "微笑",
    "色",
    "酷拽",
    "抠鼻",
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
    "大笑",
    "机智",
    "送心",
  ];

  let siteArray = text.match(/https:\/\/v\.douyin\.com\/\S+\b/g);

  console.log(siteArray);

  let index;
  let stop = false;

  if (localStorage.getItem("index") == null) {
    localStorage.setItem("index", 1);
    window.location.href = siteArray[0];
  }
  if (new RegExp("douyin.com/video").test(window.location.href)) { 
    
    setTimeout(() => {
      if (document.querySelector("p[data-e2e='error-page']")) {
        localStorage.setItem("index", index + 1);
        window.location.href = siteArray[index];
      }
    }, 1000);

    if (localStorage.getItem("index")) {
      index = Number(localStorage.getItem("index"));
    } else {
      index = 1;
    }
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
    setTimeout(() => {
      if (document.querySelector("p[data-e2e='error-page']")) {
        localStorage.setItem("index", index + 1);
        window.location.href = siteArray[index];
      }
    }, 1000);
    if (localStorage.getItem("index")) {
      index = Number(localStorage.getItem("index"));
    } else {
      index = 1;
    }
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
      window.open(document.querySelector(".CjPRy13J a").href);
    }, 4000);
  }

  if (new RegExp("douyin.com/user").test(window.location.href)) {
    //判断opener是否是一开始的页面
    if (
      new RegExp("douyin.com/video").test(window.opener.location.href) ||
      new RegExp("douyin.com/note").test(window.opener.location.href)
    ) {
      let num = 0;

      findDomTimeOut("div[data-e2e='user-info-fans']", "click", 3000);

      setTimeout(() => {
        if (document.getElementById("toastContainer")) {
          window.opener.postMessage({ type: "sendEnd" });
          window.close();
        }
      }, 3500);

      window.addEventListener("message", function (event) {
        if (event.origin !== location.origin) {
          return;
        }
        console.log("Message from child:", event.data);
        if (event.data.type == "childClose") {
          console.log("next");

          if (
            document.querySelector(".eq0kzn5a .y8QC44Y8 div") &&
            document.querySelector(".eq0kzn5a .y8QC44Y8 div").innerHTML ==
              "暂时没有更多了"
          ) {
            window.opener.postMessage({ type: "sendEnd" });
            window.close();
          }

          setTimeout(() => {
            console.log(
              num,
               document.querySelectorAll(".QxZvDLx8 .iAqs9BfT a").length
            );
            if (
              num <
               document.querySelectorAll(".QxZvDLx8 .iAqs9BfT a").length - 10
            ) {
              try {
                var childWindow = window.open(
                   document.querySelectorAll(".QxZvDLx8 .iAqs9BfT a")[num].href
                );
              } catch (error) {
                window.location.reload();
                // window.opener.postMessage({ type: "sendEnd" });
                // setTimeout(() => {
                //   window.close();
                // }, 2000);
              }

              num++;
            } else {
              console.log("finish");

              try {
                document.querySelector(
                  "div[data-e2e='user-fans-container']"
                ).scrollTop =
                  document.querySelector("div[data-e2e='user-fans-container']")
                    .scrollHeight + 2000;
              } catch (error) {
                window.location.reload();

                // window.opener.postMessage({ type: "sendEnd" });
                // setTimeout(() => {
                //   window.close();
                // }, 2000);
              }

              setTimeout(() => {
                try {
                  var childWindow = window.open(
                     document.querySelectorAll(".QxZvDLx8 .iAqs9BfT a")[num].href
                  );
                } catch (error) {
                  window.location.reload();

                  // window.opener.postMessage({ type: "sendEnd" });
                  // setTimeout(() => {
                  //   window.close();
                  // }, 2000);
                }
                num++;
              }, 12000);
            }
          }, 5000);
        }
      });
      setTimeout(() => {
        var childWindow = window.open(
          document.querySelectorAll(".QxZvDLx8 .iAqs9BfT a")[num].href
        );
        num++;
      }, 5000);
    } else {
      setTimeout(() => {
        document
          .getElementsByClassName(
            "ZBejQ5yK WXPQLGYI WmztNNX5 cBWwZIxP RH8TCnaE z0c5Gipx I4tJiW0Q"
          )[0]
          .click();
        setTimeout(() => {
          if (document.querySelector(".wCjGDDIR.bX8akOuE")) {
            window.opener.postMessage({ type: "childClose" });
            setTimeout(() => {
              window.close();
            }, 3000);
          } else {
            findDomTimeOut(".D_AdmjnR span", "click", 800);
            findDomTimeOut(".aJJWV5Ft", "click", 3000);
            setTimeout(() => {
              let talkIndex =
                Math.floor(Math.random() * (faceArray.length - 1 - 0 + 1)) + 0;

              document.getElementsByClassName("notranslate public-DraftEditor-content")[0]
                .querySelector("span[data-text='true']").innerHTML =
                "有时间来做任务吗[" + faceArray[talkIndex] + "]";
              document.getElementsByClassName("notranslate public-DraftEditor-content")[0]
                .querySelector("span[data-text='true']")
                .dispatchEvent(
                  new Event("input", { bubbles: !0, cancelable: !0 })
                );

              findDomTimeOut(".sCp7KhBv.EWT1TDgs.e2e-send-msg-btn","click",3000);
              let time = 3000;
              setTimeout(() => {
                if (
                  document.querySelector(".hI145Goj") &&
                  new RegExp("口气发太多啦，").test(
                    document.querySelector(".hI145Goj").innerHTML
                  )
                ) {
                  time = 60000 * 30;
                  stop = true;
                }

                setTimeout(() => {
                  window.opener.postMessage({ type: "childClose" });
                  setTimeout(() => {
                    window.close();
                  }, 3000);
                }, time);
              }, 4000);
            }, 7000);
          }
        }, 3000);

        // document.querySelector(".cv1wbFR5 span").click()
        // document.querySelector(".Dbjgulv8 .en2NwboT").click()
        // document.getElementsByClassName("notranslate public-DraftEditor-content")[0].querySelector("span[data-text='true']").innerHTML = 434354
        // document.getElementsByClassName("notranslate public-DraftEditor-content")[0].querySelector("span[data-text='true']").dispatchEvent(
        //   new Event("input", { bubbles: !0, cancelable: !0 })
        // );
      }, 10000);
      setTimeout(() => {
        if (stop == false) {
          window.location.reload();
        }
      }, 70000);
    }
  }
})();
