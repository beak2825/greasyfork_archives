// ==UserScript==
// @name         5. 抖音脚本
// @namespace   Violentmonkey Scripts
// @match       *://www.douyin.com/*
// @version     3.4.0
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
// @downloadURL https://update.greasyfork.org/scripts/462697/5%20%E6%8A%96%E9%9F%B3%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/462697/5%20%E6%8A%96%E9%9F%B3%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef
(function () {
  //取消键盘监听事件
  var mask = document.createElement("div");
        mask.classList.add("masking");
        mask.innerHTML = `<div class="page flex-col">
        <div class="block_1 flex-col"  referrerpolicy="no-referrer">
        <img class="bg-two" referrerpolicy="no-referrer" src="https://lanhu.oss-cn-beijing.aliyuncs.com/psuvfr8h4rgdckdzcny49469pqjfqw21b4b8f9ea88d-5ca7-4984-acfb-cfae5b54cfe9" alt="">
          <div class="group_1 flex-col">
            <div class="box_1 flex-row justify-between">
              <img
                class="image_1"
                referrerpolicy="no-referrer"
                src="https://lanhu.oss-cn-beijing.aliyuncs.com/ps7opjeckll0lkjtxcjbwrtov6ciqmtukl5e3eac6b-d8b9-4490-873c-0ff322daba46"
              />
              <span class="text_1">小太阳</span>
            </div>
            <div class="box_2 flex-row"><div class="block_2 flex-col"></div></div>
            <div class="text-wrapper_1 flex-row">
              <span class="text_2">短视频正在加载中，请耐心等待几秒钟…</span>
            </div>
            
            
          </div>
        </div>
      </div>`;
        document.body.appendChild(mask);

        GM_addStyle(
          `
          .page {
            position: relative;
            width: 100vw;
            height: 56.25vw;
            overflow: hidden;
          }
          
          .block_1 {
            height: 56.25vw;
            
            background-size: 100% 100%;
            width: 100vw;
          }
          
          .group_1 {
            height: 56.25vw;
            position: absolute;
            z-index: 999;
            background-size: 100vw 64.79vw;
            width: 100vw;
          }
          
          .box_1 {
            width: 17.14vw;
            height: 6.25vw;
            margin: 17.08vw 0 0 41.51vw;
          }
          
          .image_1 {
            width: 6.25vw;
            height: 6.25vw;
          }
          .bg-two {    width: 101vw; position:fixed;top:-3vh;left:0;   } 

          
          .text_1 {
            width: 9.38vw;
            height: 2.87vw;
            overflow-wrap: break-word;
            color: rgba(255, 255, 255, 1);
            font-size: 3.02vw;
            font-family: YouYuan;
            font-weight: NaN;
            text-align: left;
            white-space: nowrap;
            line-height: 3.03vw;
            margin-top: 1.67vw;
          }
          
          .box_2 {
            width: 11.98vw;
            height: 0.11vw;
            margin: 1.56vw 0 0 44.21vw;
          }
          
          .block_2 {
            background-image: linear-gradient(
              90deg,
              rgba(253, 227, 53, 1) 0,
              rgba(253, 227, 53, 1) 0.585938%,
              rgba(253, 227, 53, 1) 48.217773%,
              rgba(254, 223, 54, 1) 49.414062%,
              rgba(255, 227, 53, 1) 100%,
              rgba(255, 227, 53, 1) 100%
            );
            width: 11.98vw;
            height: 0.11vw;
          }
          
          .text-wrapper_1 {
            width: 24.38vw;
            height: 1.31vw;
            margin: 2.5vw 0 0 37.81vw;
          }
          
          .text_2 {
            width: 24.38vw;
            height: 1.31vw;
            overflow-wrap: break-word;
            color: rgba(255, 255, 255, 1);
            font-size: 1.35vw;
            font-family: SourceHanSansCN-Regular;
            font-weight: NaN;
            text-align: left;
            white-space: nowrap;
            line-height: 1.36vw;
          }
          `
        );

        GM_addStyle(
          ".masking{position: fixed;z-index: 9999999;top:0; left:0;width:100vw;height:100vh;}"
        );

        function fn() {
          if (
            document.querySelectorAll("div[data-e2e='feed-active-video']")[0] ==
            undefined
          ) {
            document
              .getElementsByClassName("xgplayer-playswitch-next")[0]
              .click();
          }
          if (document.querySelector(".masking")) {
            if(document.querySelectorAll(
              "div[data-e2e='feed-active-video']"
            )[0].getElementsByTagName("video")[0].currentTime>0)
              document.querySelector(".masking").remove();
              
          }
          
        }

        var clearLiveInt = null;

        clearLiveInt = setInterval(fn, 1000);    

  class Dep {
    // 订阅池
    constructor(name) {
      this.id = new Date(); //这里简单的运用时间戳做订阅池的ID
      this.subs = []; //该事件下被订阅对象的集合
    }
    defined() {
      // 添加订阅者
      Dep.watch.add(this);
    }
    notify() {
      //通知订阅者有变化
      this.subs.forEach((e, i) => {
        if (typeof e.update === "function") {
          try {
            e.update.apply(e); //触发订阅者更新函数
          } catch (err) {
            console.warr(err);
          }
        }
      });
    }
  }
  Dep.watch = null;

  class Watch {
    constructor(name, fn) {
      this.name = name; //订阅消息的名称
      this.id = new Date(); //这里简单的运用时间戳做订阅者的ID
      this.callBack = fn; //订阅消息发送改变时->订阅者执行的回调函数
    }
    add(dep) {
      //将订阅者放入dep订阅池
      dep.subs.push(this);
    }
    update() {
      //将订阅者更新方法
      var cb = this.callBack; //赋值为了不改变函数内调用的this
      cb(this.name);
    }
  }

  var addHistoryMethod = (function () {
    var historyDep = new Dep();
    return function (name) {
      if (name === "historychange") {
        return function (name, fn) {
          // 订阅一下
          var event = new Watch(name, fn);
          Dep.watch = event;
          historyDep.defined();
          Dep.watch = null; //置空供下一个订阅者使用
        };
      } else if (name === "pushState" || name === "replaceState") {
        var method = history[name];
        return function () {
          /**
           * 1，arguments 是每一个函数都自带的属性
           * 2，arguments 会自动的将所有的实参存储其中
           * **/
          method.apply(history, arguments);
          historyDep.notify();
        };
      }
    };
  })();

  window.addHistoryListener = addHistoryMethod("historychange");
  history.pushState = addHistoryMethod("pushState");
  history.replaceState = addHistoryMethod("replaceState");

  window.addHistoryListener("history", function () {
    console.log("窗口的history改变了");
    if (new RegExp("modal_id").test(window.location.href) !== isModal)
    return
      Initial();
  });

  let isModal;

  function Initial() {
    console.log("地址没变");

    setTimeout(() => {
      if (
        document.getElementsByClassName(
          "captcha_verify_container style__CaptchaWrapper-sc-1gpeoge-0 zGYIR"
        )[0]
      ) {
        document.cookie =
          "s_v_web_id=verify_ll36fn33_KVjtatWz_MPWv_4F4n_9SCj_izJxdclv16mf;path=/;";
        location.reload();
      }
      if (document.querySelector(".dy-account-close")) {
        document.querySelector(".dy-account-close").click();
      }
    }, 2000);

    isModal = new RegExp("modal_id").test(window.location.href) ? true : false;

    if (
      window.location.pathname == "/" ||
      new RegExp("modal_id").test(window.location.href)
    ) {
      if (window.location.pathname == "/") {
        
        setTimeout(() => {
          if (document.querySelector(".masking")) {
            document.querySelector(".masking").remove();
           
          }
          if(firstLoad){
            clearInterval(firstLoad)
            firstLoad = null

          }
        }, 10000);

        

        window.setTimeout(slowAlert, 3000);
        function slowAlert() {
          //allShow();
          let isClick = false
            var firstLoad = setInterval(() => {
              
              if (document.getElementsByClassName("mmyd1ay5")[0]) {
                if (!document.getElementsByClassName("mmyd1ay5")[0].classList.contains("McIlMS7W") && !isClick ) {
                  document
                    .getElementsByClassName("mmyd1ay5")[0]
                    .children[0].click();
                    isClick = true
                }
              }
              if (
                document.querySelectorAll("div[data-e2e='feed-active-video']")[0]
              ) {
                if (
                  document
                    .querySelectorAll("div[data-e2e='feed-active-video']")[0]
                    .querySelectorAll(
                      ".xgplayer-page-full-screen .xgplayer-icon"
                    )[0]
                ) {
                  if(document
                    .querySelectorAll("div[data-e2e='feed-active-video']")[0]
                    .querySelectorAll(
                      ".xgplayer-page-full-screen .xgplayer-icon"
                    )[0].parentElement.children[1].firstElementChild.innerHTML=="网页全屏"){


                      document
                        .querySelectorAll("div[data-e2e='feed-active-video']")[0]
                        .querySelectorAll(
                          ".xgplayer-page-full-screen .xgplayer-icon"
                        )[0]
                        .click(); 
      
                      
                      clearInterval(firstLoad)
                    firstLoad = null
                    }

                }
              }
              
            }, 1000);

            
        }
      }

      setTimeout(() => {
        setTimeout(() => {
          document.body.addEventListener(
            "keydown",
            (event) => event.stopImmediatePropagation(),
            true
          );
        }, 1500);

        GM_addStyle(
          ".menu{position: fixed;top: 72%;left: 50%;z-index: 9999; white-space: nowrap; transform: translateX(-50%);}"
        );
        GM_addStyle(
          ".btn{width: 10.5vw;height:3.13vw;font-size:1.5vw;padding:3px 0;line-height:2vh;border-radius: 5px;border: none;margin-left: 1vw;background: #26262C;border-radius: 6px;font-family: Source Han Sans CN;font-weight: 400;color: #FFFFFF; }"
        );

        GM_addStyle(".btn_active{background-color: rgba(244, 206, 102, 1);border-radius: 6px; font-family: Source Han Sans CN;font-weight: bold;color: #784100;}");
        GM_addStyle(".line_two{margin-top:0.8vw; }");

        let arr = [];

        function menuCreate() {
          const menu = document.createElement("div");
          menu.classList.add("menu");
          
            arr = [
              "回到小太阳",
              "进入作者首页",
              "评论",
              "收藏",
              "精选",
              "登陆",

              "上一个",

              "不感兴趣",

              // "全屏",
              // "关注主播/取消关注",
            ];

          const line_two = document.createElement("div");
          line_two.classList.add("line_two");
          for (let i = 0; i < arr.length; i++) {
            if (i > 5) {
              const btn = document.createElement("button");
              btn.classList.add("btn");
              btn.innerHTML = arr[i];
              line_two.appendChild(btn);
            } else {
              const btn = document.createElement("button");
              btn.classList.add("btn");
              btn.innerHTML = arr[i];
              menu.appendChild(btn);
            }
          }
          menu.appendChild(line_two);

          document.body.appendChild(menu);
          if(new RegExp("modal_id").test(window.location.href)){
            if(document.querySelectorAll(".menu .btn").length==8){
              document.querySelectorAll(".menu .btn")[1].style.display = "none"
              document.querySelectorAll(".menu .btn")[3].style.display = "none"

            }

          }
        }
        setTimeout(() => {
          menuCreate();
        }, 2000);
        let isShow = false;
        let isAuthor = false;
        let isFulled = false;
        let isFirst = true;
        let isAll = true;
        let isGuanzhu = false;
        let isAuthorTalk = false;
        let isArrowUp = false;

        let domVideo;

        GM_addStyle(".menu{display:none }");
        let clickTimes = 1;
        let menuIndex = 0;
        document.addEventListener(
          "keydown",
          (event) => {
            const keyName = event.key;

            if (keyName === "ArrowUp") {
              // do not alert when only Control key is pressed.
              return;
            }
          },
          false
        );

        let videoFindInt = setInterval(() => {
          if (
            (domVideo = document.querySelectorAll(
              "div[data-e2e='feed-active-video']"
            )[0])
          ) {
            document.documentElement.onkeyup = function (e) {
              // 回车提交表单

              var theEvent = window.event || e;
              var code =
                theEvent.keyCode || theEvent.which || theEvent.charCode;
              var doc = document.querySelector(".menu");

              if (
                document.querySelectorAll(
                  "div[data-e2e='feed-active-video']"
                )[0]
              ) {
                domVideo = document.querySelectorAll(
                  "div[data-e2e='feed-active-video']"
                )[0];
              }

              if (doc.style.display == "block") {
                clickTimes = 2;
              } else {
                clickTimes = 1;
              }

              if (code == 13 && clickTimes == 1) {
                if (domVideo.getElementsByTagName("video")[0].paused) {
                  domVideo.getElementsByTagName("video")[0].play();
                } else {
                  domVideo.getElementsByTagName("video")[0].pause();
                }
              }
              if (code == 37 && clickTimes == 1) {
                domVideo
                  .getElementsByClassName("pBxTZJeH Qz1xVpFH aLzJ7lUV")[0]
                  .click();
                // if (
                //   document.querySelectorAll(".menu .btn")[5].innerHTML == "打开评论"
                // ) {
                //   document.querySelectorAll(".menu .btn")[5].innerHTML = "关闭评论";
                // } else {
                //   document.querySelectorAll(".menu .btn")[5].innerHTML = "打开评论";
                // }
              }

              if (code == 39) {
                if (document.getElementsByClassName("dy-account-close")[0]) {
                  document
                    .getElementsByClassName("dy-account-close")[0]
                    .click();
                  return;
                }
              }
              if (code == 39 && clickTimes == 1) {
                domVideo
                  .getElementsByClassName("kEqb4PZ6 up9tZldE MHeBD3KS")[0]
                  .click();
              }

              if (code == 38 && isArrowUp && doc.style.display !== "block") {
                window.location.href = "http://sun.20001027.com/";
                clearInterval(interval);
              }

              if (code == 38 && doc.style.display == "block") {
                if (menuIndex < 6) {
                  doc.style.display = "none";
                } else {
                  menuIndex = 0;
                  showMenuIndex(menuIndex);
                  return;
                }
              }

              if (code == 38 && !isArrowUp) {
                let i = 0;

                var interval = setInterval(() => {
                  if (i < 2) {
                    if (doc.style.display !== "block") isArrowUp = true;
                  } else {
                    isArrowUp = false;

                    if (isFulled) {
                      domVideo
                        .querySelectorAll(
                          ".xgplayer-page-full-screen .xgplayer-icon"
                        )[0]
                        .click();
                      isFulled = false;

                      GM_addStyle(".menu{display:block }");
                      isShow = true;
                      clickTimes = 2;
                      return;
                    } else {
                      if (!isShow) {
                        // GM_addStyle(".menu{display:block }");
                        doc.style.display = "block";
                        isShow = true;
                        clickTimes = 2;
                        showMenuIndex(menuIndex);
                      } else {
                        // GM_addStyle(".menu{display:none }");

                        isShow = false;
                        clickTimes = 1;
                      }
                    }

                    document.onkeydown = null;

                    clearInterval(interval);
                    interval = null;
                  }
                  i++;
                }, 350);

                e.stopPropagation();
              }

              if (code == 40 && doc.style.display == "block") {
                if (menuIndex < 6) menuIndex = 6;
              }
              if (code == 40 && doc.style.display !== "block") {
                if(new RegExp("modal_id").test(window.location.href)){
                  document
                      .getElementsByClassName("xgplayer-playswitch-next")[1]
                      .click();
                }else{

                isGuanzhu = false;
                isAuthor
                  ? document.getElementsByClassName(
                      "xgplayer-playswitch-next"
                    )[3]
                    ? document
                        .getElementsByClassName("xgplayer-playswitch-next")[3]
                        .click()
                    : document
                        .getElementsByClassName("xgplayer-playswitch-next")[2]
                        .click()
                  : domVideo
                      .getElementsByClassName("xgplayer-playswitch-next")[0]
                      .click();
                isFirst = false;

              }

                console.log(40);

                if (!clearLiveInt) {
                  clearLiveInt = setInterval(fn, 1000);
                }
              }
              if (code == 37 && clickTimes == 2) {
                if (menuIndex > 0 && menuIndex <= 9) {
                 
                  menuIndex -= 1;
                  if( new RegExp("modal_id").test(window.location.href) ){
                    if(menuIndex==1){
                      menuIndex=0
                    }
                    if(menuIndex==3){
                      menuIndex=2
                    }
                  }
                  showMenuIndex(menuIndex);
                }
              }
              if (code == 39 && clickTimes == 2) {
                if (menuIndex >= 0 && menuIndex < 9) {
                  menuIndex += 1;
                  if( new RegExp("modal_id").test(window.location.href) ){
                    if(menuIndex==1){
                      menuIndex=2
                    }
                    if(menuIndex==3){
                      menuIndex=4
                    }
                   
                  }
                  showMenuIndex(menuIndex);
                }
              }

              if (code == 13 && clickTimes == 2) {
                switch (menuIndex) {
                  case 0:
                    window.location.href = "https://sun.20001027.com/";

                    break;
                  case 1:
                    if (isAuthor) {
                      isAuthor = false;

                      document
                        .querySelectorAll(".N_pbezMl .ArbenARZ")[0]
                        .click();
                    } else {
                      isAuthor = true;

                      domVideo
                        .querySelectorAll(".YTu_A7CW .PbpHcHqa")[0]
                        .click();
                    }
                    if (isAuthor) {
                      document.querySelector(".menu .btn_active").innerHTML =
                        "退出作者主页";
                    } else {
                      document.querySelector(".menu .btn_active").innerHTML =
                        "进入作者首页";
                    }
                    break;
                  case 2:
                    // if (
                    //   document.querySelector(".menu .btn_active").innerHTML == "打开评论"
                    // ) {
                    //   document.querySelector(".menu .btn_active").innerHTML = "关闭评论";
                    // } else {
                    //   document.querySelector(".menu .btn_active").innerHTML = "打开评论";
                    // }

                    if (isAuthor) {
                      if (isAuthorTalk) {
                        for (const item of document.querySelectorAll(
                          ".nNXxvS1t .QdzvkA0I"
                        )) {
                          if (item.innerHTML == "TA的作品") {
                            item.click();
                          }
                        }
                      } else {
                        for (const item of document.querySelectorAll(
                          ".nNXxvS1t .zRLIVppw.QdzvkA0I"
                        )) {
                          if (item.innerHTML == "评论") {
                            item.click();
                          }
                        }
                      }

                      isAuthorTalk = !isAuthorTalk;
                    } else {
                      domVideo
                        .getElementsByClassName("pBxTZJeH Qz1xVpFH aLzJ7lUV")[0]
                        .click();
                    }

                    break;

                  case 3:
                    // if(document.querySelector(".menu .btn_active").innerHTML=="收藏"){
                    //   document.querySelector(".menu .btn_active").innerHTML="取消收藏"
                    // }else{
                    //   document.querySelector(".menu .btn_active").innerHTML="收藏"
                    // }

                    domVideo
                      .getElementsByClassName("CT3y5rWY jtnwH7Q7 UgpbNsc3")[0]
                      .click();
                    // if( document.getElementsByClassName("H2e1f_wM")[1]){
                    //   document.getElementsByClassName("H2e1f_wM")[1].click();
                    // }else{
                    //   document.getElementsByClassName("H2e1f_wM")[0].click();
                    // }
                    break;
                  case 4:
                    isAll
                      ? document
                          .getElementsByClassName("mmyd1ay5")[1]
                          .children[0].click()
                      : document
                          .getElementsByClassName("mmyd1ay5")[0]
                          .children[0].click();

                    isAll = !isAll;
                    if (
                      document.querySelector(".menu .btn_active").innerHTML ==
                      "全部"
                    ) {
                      document.querySelector(".menu .btn_active").innerHTML =
                        "精选";
                    } else {
                      document.querySelector(".menu .btn_active").innerHTML =
                        "全部";
                    }

                    break;

                  case 5:
                    if (
                      document.querySelectorAll(
                        ".dRK46_Ne .OMlv_Xup.bhpixfNG"
                      )[3]
                    ) {
                      document
                        .querySelectorAll(".dRK46_Ne .OMlv_Xup.bhpixfNG")[3]
                        .children[0].click();
                    } else {
                      // domVideo.querySelector(".B10aL8VQ.s6mStVxD.vMQD6aai.vk7WaOg_.FRVbbGB0").click()
                      if (document.getElementById("tcTjz3nj")) {
                        document
                          .getElementById("tcTjz3nj")
                          .firstElementChild.click();
                      } else {
                        document
                          .querySelector("#_7hLtYmO")
                          .firstElementChild.click();
                      }
                    }

                    //clickTimes = 1
                    //location.reload();
                    break;

                  case 6:
                    console.log("clear");
                    window.clearInterval(clearLiveInt);
                    clearLiveInt = null;

                    isAuthor
                      ? document
                          .querySelector("#slideMode")
                          .querySelectorAll(
                            ".xgplayer-icon .xgplayer-playswitch-tab .xgplayer-playswitch-prev"
                          )[0]
                          .click()
                      : domVideo
                          .getElementsByClassName("xgplayer-playswitch-prev")[0]
                          .click();

                    setTimeout(() => {
                      if (
                        document.querySelectorAll(
                          "div[data-e2e='feed-active-video']"
                        )[0] == undefined
                      ) {
                        document
                          .getElementsByClassName("xgplayer-playswitch-prev")[0]
                          .click();
                      }
                      setTimeout(() => {
                        if (
                          document.querySelectorAll(
                            "div[data-e2e='feed-active-video']"
                          )[0] == undefined
                        ) {
                          document
                            .getElementsByClassName(
                              "xgplayer-playswitch-next"
                            )[0]
                            .click();
                        }
                      }, 1200);
                    }, 500);

                    break;

                  case 7:
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
                      domVideo.querySelectorAll(".V5Rmr_ZY.IS7FyuLE")[0]
                    );
                    //click事件绑定事件处理程序
                    btn.onclick = function () {
                      console.log("hello");
                    };
                    //触发事件
                    btn.dispatchEvent(event); //hello

                    setTimeout(() => {
                      if (domVideo.querySelector(".FbuERyN5")) {
                        domVideo.querySelector(".FbuERyN5").click();
                      } else {
                        document.querySelector(".FbuERyN5").click();
                      }
                    }, 1000);

                    break;

                  case 4:
                    domVideo
                      .getElementsByClassName("xgplayer-fullscreen")[0]
                      .click();
                    GM_addStyle(".menu{display:none }");

                    isShow = false;
                    isFulled = true;
                    clickTimes = 1;
                    break;
                  case 6:
                    // if(document.querySelector(".menu .btn_active").innerHTML=="关注主播"){
                    //   document.querySelector(".menu .btn_active").innerHTML="取消关注"
                    // }else{
                    //   document.querySelector(".menu .btn_active").innerHTML="关注主播"
                    // }

                    if (!isAuthor) {
                      if (isGuanzhu) {
                        isAuthor = true;
                        domVideo
                          .querySelectorAll(".YTu_A7CW .PbpHcHqa")[0]
                          .click();

                        setTimeout(() => {
                          document
                            .querySelectorAll(".t6VrNKJ0 .B10aL8VQ")[0]
                            .click();
                        }, 1500);
                      }

                      if (domVideo.querySelectorAll(".Fivj58Eg .H2HjqV3h")[1]) {
                        domVideo
                          .querySelectorAll(".Fivj58Eg .H2HjqV3h")[1]
                          .parentElement.click();
                      } else {
                        domVideo
                          .querySelectorAll(".Fivj58Eg .H2HjqV3h")[0]
                          .parentElement.click();
                      }
                      isGuanzhu = true;
                    } else {
                      document
                        .querySelectorAll(".t6VrNKJ0 .B10aL8VQ")[0]
                        .click();
                    }

                    if (isAuthor) {
                      document.querySelector(
                        ".menu .btn_active"
                      ).nextElementSibling.innerHTML = "退出作者主页";
                    } else {
                      document.querySelector(
                        ".menu .btn_active"
                      ).nextElementSibling.innerHTML = "进入作者首页";
                    }

                    break;

                  case arr[10]:
                    // if(document.querySelectorAll(".xg-right-grid .xgplayer-volume .xgplayer-icon")[0]){
                    //   document.querySelectorAll(".xg-right-grid .xgplayer-volume .xgplayer-icon")[0].click()

                    // }
                    // if(document.querySelectorAll(".xg-right-grid .xgplayer-volume .xgplayer-icon")[1]){
                    //   document.querySelectorAll(".xg-right-grid .xgplayer-volume .xgplayer-icon")[1].click()
                    // }
                    // if(document.querySelectorAll(".xg-right-grid .xgplayer-volume .xgplayer-icon")[2]){
                    //   document.querySelectorAll(".xg-right-grid .xgplayer-volume .xgplayer-icon")[2].click()

                    // }

                    break;
                  default:
                    break;
                }
                
              }

              showMenuIndex(menuIndex);
            };

            clearInterval(videoFindInt);
            videoFindInt = null;
          }
        }, 1000);

        function showMenuIndex(menuIndex) {
          console.log(menuIndex);

          const btnList = document.querySelectorAll(".menu .btn");

          for (const item of btnList) {
            item.classList.remove("btn_active");
          }
          btnList[menuIndex].classList.add("btn_active");
        }

        setInterval(() => {
          if (document.querySelector(".B10aL8VQ.s6mStVxD.vMQD6aai.n7Xfm1rl")) {
            document
              .querySelector(".B10aL8VQ.s6mStVxD.vMQD6aai.n7Xfm1rl")
              .click();
          }
          if (document.getElementById("verify-bar-close")) {
            document.getElementById("verify-bar-close").click();
          }
        }, 1700);

        var timer = setInterval(() => {
          if (
            document.querySelectorAll(".xgplayer-autoplay-setting .xgTips")[0]
          ) {
            if (
              document.querySelectorAll(".xgplayer-autoplay-setting .xgTips")[0]
                .children[0].innerHTML == "自动连播"
            ) {
              document
                .querySelectorAll(
                  ".xgplayer-autoplay-setting .xgplayer-icon"
                )[0]
                .click();
            }
          }

          if (
            document.querySelectorAll("div[data-e2e='feed-active-video']")[0]
          ) {
            if (
              document
                .querySelectorAll("div[data-e2e='feed-active-video']")[0]
                .querySelectorAll(
                  ".xgplayer-volume .xgplayer-slider .xgplayer-value-label"
                )[0].innerText == "0"
            ) {
              if (
                document.querySelectorAll(
                  ".xg-right-grid .xgplayer-volume .xgplayer-icon"
                )[0]
              ) {
                document
                  .querySelectorAll(
                    ".xg-right-grid .xgplayer-volume .xgplayer-icon"
                  )[0]
                  .click();
              }
              if (
                document.querySelectorAll(
                  ".xg-right-grid .xgplayer-volume .xgplayer-icon"
                )[1]
              ) {
                document
                  .querySelectorAll(
                    ".xg-right-grid .xgplayer-volume .xgplayer-icon"
                  )[1]
                  .click();
              }
              if (
                document.querySelectorAll(
                  ".xg-right-grid .xgplayer-volume .xgplayer-icon"
                )[2]
              ) {
                document
                  .querySelectorAll(
                    ".xg-right-grid .xgplayer-volume .xgplayer-icon"
                  )[2]
                  .click();
              }
            }
          }
        }, 1200);

        setTimeout(() => {
          clearInterval(timer);
        }, 7000);

        //关闭开始登陆的弹窗
        var loginclosed = setInterval(() => {
          if (document.getElementsByClassName("dy-account-close")[0]) {
            document.getElementsByClassName("dy-account-close")[0].click();
          }
        }, 600);

        setTimeout(() => {
          clearInterval(loginclosed);
        }, 3500);
      }, 1200);
    }

    if (
      new RegExp("douyin.com/user").test(window.location.href) &&
      !new RegExp("modal_id").test(window.location.href)
    ) {
      GM_addStyle(".kQ2JnIMK.S9ST96Zy{display:none; }");
      GM_addStyle(".HQwsRJFy.Bo1o4KGi{display:none; }");
      GM_addStyle(".ePAmHZ9n{display:none !important; }");
      GM_addStyle("._7gdyuNUv.aYWQQ_nh{display:none; }");
      GM_addStyle(".iXULvW1H{display:none !important; }");
      GM_addStyle("body{overflow:hidden; }");

      GM_addStyle(".N_HNXA04.KYtgzo9m{display:none !important; }");
      GM_addStyle(".active{border: 3px solid #fea200;transform: scale(1.1); }");

      let itemIndex = 0;

      setInterval(() => {
        if (document.querySelector(".B10aL8VQ.s6mStVxD.vMQD6aai.n7Xfm1rl")) {
          document
            .querySelector(".B10aL8VQ.s6mStVxD.vMQD6aai.n7Xfm1rl")
            .click();
        }
        if (document.getElementById("verify-bar-close")) {
          document.getElementById("verify-bar-close").click();
        }
      }, 1700);

      var firstItemInt = setInterval(() => {
        if (document.querySelectorAll(".Eie04v01._Vm86aQ7")[itemIndex]) {
          document
            .querySelectorAll(".Eie04v01._Vm86aQ7")
            [itemIndex].classList.add("active");
          clearInterval(firstItemInt);
          firstItemInt = null;
        }
      }, 200);

      document.body.addEventListener(
        "keydown",
        (event) => event.stopImmediatePropagation(),
        true
      );

      function moveItem(num) {
        if (
          itemIndex + num >= 0 &&
          itemIndex + num <
            document.querySelectorAll(".Eie04v01._Vm86aQ7").length
        ) {
          document
            .querySelectorAll(".Eie04v01._Vm86aQ7")
            [itemIndex].classList.remove("active");
          itemIndex += num;
          document
            .querySelectorAll(".Eie04v01._Vm86aQ7")
            [itemIndex].classList.add("active");

          document.documentElement.scrollTop = document.querySelector(
            ".Eie04v01._Vm86aQ7.active"
          ).offsetTop;
        }
      }

      document.documentElement.onkeyup = function (e) {
        // 回车提交表单

        var theEvent = window.event || e;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;

        if (code == 13) {
          document
            .querySelector(".Eie04v01._Vm86aQ7.active")
            .firstElementChild.firstElementChild.click();
        }
        if (code == 37) {
          moveItem(-1);
        }

        if (code == 39) {
          moveItem(1);
        }
        if (code == 38) {
          if (itemIndex - 6 < 0) {
            document.documentElement.scrollTop = 0;
            console.log(333);
          } else {
            moveItem(-6);
          }
        }
        if (code == 40) {
          if (document.documentElement.scrollTop == 0) {
            document.documentElement.scrollTop = document.querySelector(
              ".Eie04v01._Vm86aQ7.active"
            ).offsetTop;
            console.log(222);
          } else {
            moveItem(6);
            console.log(111);
          }
        }
      };
    }
  }

  Initial();
})();
