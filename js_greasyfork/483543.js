  // ==UserScript==
  // @name         遇见八三的心动瞬间
  // @namespace
  // @version      1.14.81.20251205
  // @description  学企来砍一刀
  // @author       我纯f5捏
  // @match        http://120.27.194.253/*
  // @match        http://47.98.152.121/*
  // @match        https://learn.cscec83.cn/*
  // @match        https://ks.wjx.top/*/*
  // @match        https://kaosshi.wjx.top/*/*
  // @match        http://ks.wjx.top/*/*
  // @match        http://kaosshi.wjx.top/*/*
  // @match        https://www.amap.com/*
  // @match        https://www.cscec83.cn/*
  // @compatible   edge
  // @license
  // @icon         https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f614/u1f614_u1f614.png
  // @grant        GM_addStyle
  // @grant        GM_setValue
  // @grant        GM_getValue
  // @grant        GM_deleteValue
  // @grant        GM_notification
  // @grant        GM_setClipboard
  // @run-at       document-start
  // @require      https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js
  // @require      https://update.greasyfork.org/scripts/447483/1071404/Boxjs.js
  // @require      https://update.greasyfork.org/scripts/462234/1307862/Message.js
  // @require      https://update.greasyfork.org/scripts/482872/1508396/%E4%B8%AD%E5%BB%BA%E5%AD%A6%E4%BC%81%E6%9D%A5%E5%85%A8%E9%A2%98%E5%BA%93%E5%8D%95%E9%80%891.js
  // @require      https://update.greasyfork.org/scripts/482873/1707699/%E4%B8%AD%E5%BB%BA%E5%AD%A6%E4%BC%81%E6%9D%A5%E5%85%A8%E9%A2%98%E5%BA%93%E5%8D%95%E9%80%892.js
  // @require      https://update.greasyfork.org/scripts/482874/1707677/%E4%B8%AD%E5%BB%BA%E5%AD%A6%E4%BC%81%E6%9D%A5%E5%85%A8%E9%A2%98%E5%BA%93%E5%A4%9A%E9%80%89.js
  // @require      https://update.greasyfork.org/scripts/482875/1707678/%E4%B8%AD%E5%BB%BA%E5%AD%A6%E4%BC%81%E6%9D%A5%E5%85%A8%E9%A2%98%E5%BA%93%E5%88%A4%E6%96%AD.js
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/483543/%E9%81%87%E8%A7%81%E5%85%AB%E4%B8%89%E7%9A%84%E5%BF%83%E5%8A%A8%E7%9E%AC%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/483543/%E9%81%87%E8%A7%81%E5%85%AB%E4%B8%89%E7%9A%84%E5%BF%83%E5%8A%A8%E7%9E%AC%E9%97%B4.meta.js
  // ==/UserScript==
  /*
  ***********************************************************

          以上参数为脚本必须读取的脚本元属性值，请勿随意改动
          以下参数修改请参见语雀功能文档或者代码注释定制化修改

  ***********************************************************
  */
  killAllMonitor();
  (function () {
    "use strict";
    var visionNum = "1.14.81.20251205";
    var cscecAdminCount = true; // 控制主页是否隐藏脚本窗口, true 为隐藏; false 为不隐藏;
    const answerTimeGap = 250; // 一键做题操作间隔, 太快页面来不及响应, 太慢影响使用, 单位:ms;
    const loginCheck = 1000; // 输入验证码后登录的间隔, 太快无法响应, 太慢影响使用, 单位:ms;
    const monitorGap = 400; // 控制url监控间隔, 太快会影响性能, 太慢影响使用, 单位:ms;
    const newParagraphText1 = "* 选择施工区段后再填写 *";
    /*
      ***********************************************************

              以下参数为功能必须的参数初始化或功能预留，请勿随意改动

      ***********************************************************
      */
    var radioQA = [];
    var multipleQA = [];
    var judgeQA = [];
    overrideOpen();
  try {
      Qmsg.config({
      showClose: true,
      timeout: 4000,
    });
  } catch (error) {
    console.log("Qsmg error")
  }
    initQABank();
    GM_setValue("userAgent", window.navigator.userAgent);
    try {
      var titleMsgAlert = `${GM_getValue("userName")} ${GM_getValue("nickName")}`;
    } catch (error) {
      titleMsgAlert = "未登录";
    }
    let excelOutput_a = []; // 在函数外部定义 excelOutput_a 数组，以便在 Promise 链中访问
    excelOutput_a[0] = [
      "项目名称",
      "日期",
      "天气",
      "温度",
      "湿度",
      "风向",
      "施工区段",
      "进度完成情况",
      "设计变更",
      "技术交底",
      "质量情况",
      "安全",
      "其他",
      "审批人",
      "现场人员投入",
      "现场设备投入",
    ];
    const gk = "238a1a8baa6b3061f1c511c8d68b0d79";
    const tgk = "94eb7d533e4372b01206407563e074c5";
    const rightArr = ["正确", "对", "✓", "√", "A", "a", "是"];
    const wrongArr = ["错误", "错", "×", "x", "B", "b", "否"];
    const filterArray = ["每月考试"];
    var cscecConstructionLogCount = true;
    var isDraggable = false;
    var innerMsgAlert = "";
    var currentUrl = "";
    var myPicImage = "";
    var timestamp = "";
    var studyRank = "";
    var ipData = "";
    var a = "";
    var b = "";
    var C = "";
    var d = "";
    var isQuestionFinishArray = [];
    var practiceData = [];
    var savedData = [];
    var tokenData = [];

    addDiv();
    // 初始化题库
    initElement();
    // 显示打赏图片
    setTipsImg();
    webPageWatchUrl(urlOperate);
    document.querySelector(
      "#noteText2"
    ).innerHTML = `版本号: ${visionNum} <br><br>`;
    let tipsCard = document.getElementById("tipsCard");
    tipsCard.addEventListener("mouseover", displayTipsImg);
    tipsCard.addEventListener("mouseout", vanishTipsImg);
    tipsCard.addEventListener("mousemove", displayTipsImg);
    document
      .getElementById("movedCard")
      .addEventListener("mousedown", handleMouseDown);
    btnClick(".option1", verifyAndToast);
    btnClick(".option2", function () {
      if (getAb()) {
        switch (verifyUrl()) {
          case 1:
            answerExam();
            break;
          case 4:
            Qmsg.error("此页面未配置本功能,请使用问卷星答题功能");
            break;
          case 5:
            Qmsg.error("此页面未配置本功能,请使用填写验证码功能");
            break;
          case 6:
            answerQuestion();
            break;
          default:
            Qmsg.error("此页面未配置本功能,如功能配置错误请联系我");
            break;
        }
      } else {
        failVerify();
        waitToast(titleMsgAlert, innerMsgAlert, a);
      }
    });
    btnClick(".option3", function () {
      if (getAb()) {
        switch (verifyUrl()) {
          case 1:
            autoExam();
            break;
          case 4:
            Qmsg.error("此页面未配置本功能,请使用问卷星答题功能");
            break;
          case 5:
            Qmsg.error("此页面未配置本功能,请使用填写验证码功能");
            break;
          case 6:
            autoAnswerQuestion();
            break;
          case 7:
            getAddress(currentUrl);
            break;
          default:
            Qmsg.error("此页面未配置本功能,如功能配置错误请联系我");
            break;
        }
      } else {
        failVerify();
        waitToast(titleMsgAlert, innerMsgAlert, a);
      }
    });
    btnClick(".option4", answerQAStarExam);
    btnClick(".option5", function () {
      layer.open({
        type: 1,
        skin: "layui-layer",
        area: ["80%", "60%"], // 宽高
        content: layuiMenu(),
        title: "遇见八三的心动瞬间-附加功能",
        shadeClose: true,
        zIndex: 150,
        success: function (layero, index) {
          initToolboxListener();
          var toolboxButton = document.querySelector(".toolbox_btn");
          if (toolboxButton) {
            toolboxButton.addEventListener("click", function () {
              layer.close(index);
              console.log("有一个按钮被点击，toolbox已关闭");
            });
          } else {
            console.warn(".toolbox_btn 按钮未找到");
          }
        },
      });
    });

    btnClick(".option6", function () {
      GM_addStyle(`
                      .mainDiv {
                          display: none;
                      }
                      #minDiv {
                          display: Block;
                      }
                  `);
      let minDiv = document.createElement("div");
      minDiv.innerHTML = `
                      <button type="button" class="layui-btn layui-btn-normal">disPlay</button>
                      `;
      minDiv.style.position = "fixed";
      minDiv.style.left = "0";
      minDiv.style.top = "50%";
      minDiv.width = "50px";
      minDiv.className = "minDiv";
      minDiv.style.zIndex = "999";
      minDiv.id = "minDiv";
      minDiv.addEventListener("click", function () {
        GM_addStyle(`
                          .mainDiv {
                              display: grid;
                          }
                          #minDiv {
                              display: none;
                          }
                      `);
      });
      document.body.appendChild(minDiv);
    });
    btnClick(".option7", fillVerificationCode);
    btnClick(".option9", sendMsg);
    getWords();

    async function initElement() {
      // 引入layui
      // 问：这里为什么不用自带的require引入？
      // 答：第一，require不能引入css。第二，直接引入layer组件会导致显示异常，因此需要单独引入layer（属于技术原因受限）。第三，下面的两个库均已被GreasyFork认可（可前往https://greasyfork.org/zh-CN/help/cdns 进行审查）。
      // 根据GreasyFork脚本规则“库是应被 @require 的脚本，除非因为技术原因不能这么做。如果一个库被内嵌入了脚本，那么你必须一并提供库的来源（比如一行评论指向原始地址、名称以及版本）。”
      // 我们在下方介绍了对应的库的原始地址、名称以及版本，并且说明了是因为技术原因而不能使用require引用。
      // 添加 CSS
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.18/css/layui.min.css";
      document.head.appendChild(link);

      // 检查是否已经加载了 layer 对象
      if (typeof layer === "undefined") {
        // 添加 JS
        var script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.18/layui.min.js";
        document.head.appendChild(script);
      }
      hello("遇见八三的心动瞬间", visionNum);
      console.log(
        "%c%s",
        "color: white; background: black; font-size: 20px; font-weight:1000; text-decoration: none;",
        "https://www.yuque.com/yuqueyonghuuadmba/kb/gan09a7zvlktoa9v?singleDoc"
      );
      // while (true) {
      //     if (typeof layer != 'undefined') {
      //         break;
      //     }
      //     document.querySelector('#noteText1').innerHTML = `正在加载关键部件...<br>`;
      //     await sleep(1);
      // }
      document.querySelector(
        "#noteText1"
      ).innerHTML = `无偿授权,请勿泛滥<br>使用说明见语雀文档`;
      addButtons();
      getIP();
    }

    // 初始化千回百转中的 layui 界面
    function initToolboxListener() {
      btnClick("#resetQABank_btn_toolbox", function () {
        resetQABank();
        Qmsg.success("题库已重置");
      });
      btnClick("#openXQL_btn_toolbox", function () {
        try {
          let url =
            "https://learn.cscec83.cn" + "?token=" + GM_getValue("thirdToken");
          console.log(GM_getValue("thirdToken"));
          window.open(url, "_blank");
        } catch (error) {
          console.error(error);
        }
      });
      btnClickToUrl(
        "#openJSUrl_btn_toolbox",
        "https://greasyfork.org/zh-CN/scripts/483543-%E9%81%87%E8%A7%81%E5%85%AB%E4%B8%89%E7%9A%84%E5%BF%83%E5%8A%A8%E7%9E%AC%E9%97%B4"
      );
      btnClick("#forceExam_btn_toolbox", function () {
        if (getAb()) {
          if (currentUrl.includes("learn.cscec83.cn/xql_exam/exam")) {
            forceExam();
          } else {
            Qmsg.warning("请在考试选择页面使用");
          }
        } else {
          failVerify();
          waitToast(titleMsgAlert, innerMsgAlert, a);
        }
      });
      btnClick("#QAStar_forceExam_btn_toolbox", function () {
        deleteAllCookies();
        clearCookie();
        clearStorage();
        Qmsg.success("cookie数据已清除");
      });
      // 签到
      btnClick("#practice2_btn_toolbox", function () {
        if (getAb()) {
          if ([1, 2, 6, 9].includes(verifyUrl())) {
            fetch("https://learn.cscec83.cn/prod-api/system/user/signIn", {
              headers: {
                accept: "application/json, text/plain, */*",
                "accept-language":
                  "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                authorization:
                  document.querySelector("#__nuxt").__vue__.context.store.state
                    .token,
                "cache-control": "no-cache",
                pragma: "no-cache",
              },
              method: "POST",
            })
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                switch (data.code) {
                  case 200:
                    Qmsg.success("签到完成");
                    break;
                  case 500:
                    Qmsg.warning("今天已经签到过了");
                  default:
                    break;
                }
              })
              .catch((error) => {
                console.log("自动签到 error" + error);
              });
          } else {
            Qmsg.error("请进入学企来页面使用");
          }
        } else {
          failVerify();
          waitToast(titleMsgAlert, innerMsgAlert, a);
        }
      });
      btnClick("#practice3_btn_toolbox", function () {
        if (getAb()) {
          oneClickAnswer(1);
        } else {
          failVerify();
          waitToast(titleMsgAlert, innerMsgAlert, a);
        }
      });
      btnClick("#practice4_btn_toolbox", function () {
        if (getAb()) {
          oneClickAnswer(2);
        } else {
          failVerify();
          waitToast(titleMsgAlert, innerMsgAlert, a);
        }
      });
      btnClick("#practice1_btn_toolbox", function () {
        if (getAb()) {
          // 1.2.6.9对应的学企来的一些页面
          if ([1, 2, 6, 9].includes(verifyUrl())) {
            getRank();
            fetch(
              "https://learn.cscec83.cn/prod-api/system/private-point-statistics/study-points",
              {
                headers: {
                  accept: "application/json, text/plain, */*",
                  "accept-language":
                    "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                  authorization:
                    document.querySelector("#__nuxt").__vue__.context.store.state
                      .token,
                  "cache-control": "no-cache",
                  pragma: "no-cache",
                },
                method: "GET",
              }
            )
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                handelTodayPointsList(data.data.todayPointsList);
              })
              .catch((error) => {
                console.log("积分获取情况获得 error" + error);
              });
          } else {
            Qmsg.error("请进入学企来页面使用");
          }
        } else {
          failVerify();
          waitToast(titleMsgAlert, innerMsgAlert, a);
        }
      });
      btnClickToUrl(
        "#contactMe_btn_toolbox",
        "https://space.bilibili.com/43880280"
      );
      btnClickToUrl(
        "#yuqueUrl_btn_toolbox",
        "https://www.yuque.com/yuqueyonghuuadmba/kb/gan09a7zvlktoa9v"
      );
      btnClick("#iWantStudy_btn_toolbox", function () {
        if (getAb()) {
          fetch("https://learn.cscec83.cn/prod-api/course/periodUser", {
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language":
                "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              authorization:
                document.querySelector("#__nuxt").__vue__.context.store.state
                  .token,
              "content-type": "application/json",
            },
            body: '{"periodId":485,"watchDuration":111.84082}',
            method: "PUT",
          })
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              switch (data.code) {
                case 200:
                  Qmsg.success("每周课程学习完成");
                  break;
                case 500:
                  console.log("每周课程学习过完成了");
                default:
                  Qmsg.error("每周课程学习异常 code");
                  break;
              }
            })
            .catch((error) => {
              Qmsg.error("每周课程学习 error" + error);
              Qmsg.error("进入或重新进入学企来后使用");
            });
        } else {
          failVerify();
          waitToast(titleMsgAlert, innerMsgAlert, a);
        }
      });
      btnClick("#option2_btn_toolbox", function () {
        if (getAb()) {
          getConstructionDairy(
            GM_getValue("xAccessToken"),
            1,
            new Date().getTime(),
            GM_getValue("nickName"),
            999
          );
        } else {
          failVerify();
          waitToast(titleMsgAlert, innerMsgAlert, a);
        }
      });
      btnClick("#option3_btn_toolbox", function () {
        if (getAb()) {
          let index3 = layer.open({
            type: 1,
            area: "50vw",
            resize: false,
            shadeClose: false,
            title: "施工日志补全",
            content: `
                      <form class="layui-form layui-row layui-col-space16">
                      <div class="layui-form" style="margin: 16px">
                      <div class="layui-form-item">
                          <div class="layui-inline layui-form-item layui-form-text">
                              <label class="layui-form-label" style="padding-left: 0px; padding-right: 0px">项目名称</label>
                              <div class="layui-input-inline layui-col-xs2" style="padding-left: 30px">
                                  <input type="text" name="project" lay-verify="required" placeholder="项目名称" autocomplete="on"
                                      class="layui-input" />
                              </div>
                          </div>
              
                          <div class="layui-inline layui-form-item layui-form-text">
                              <label class="layui-form-label" style="padding-left: 0px; padding-right: 0px">施工区段</label>
                              <div class="layui-input-inline" style="padding-left: 30px">
                                  <input type="text" name="section" lay-verify="required" placeholder="施工区段" autocomplete="on"
                                      class="layui-input" />
                              </div>
                          </div>
                      </div>
              
                      <div class="layui-form-item layui-form-text">
                          <label class="layui-form-label" style="padding-left: 0px; padding-right: 0px">施工日期</label>
                          <div class="layui-input-block">
                              <div class="layui-input-inline layui-input-wrap">
                                  <div class="layui-input-prefix">
                                      <i class="layui-icon layui-icon-date"></i>
                                  </div>
                                  <input type="text" name="date" id="work-date" lay-verify="date" placeholder="yyyy-MM-dd"
                                      autocomplete="off" class="layui-input" />
                              </div>
                          </div>
                      </div>
              
                      <div class="layui-row layui-col-space16">
              
                          <div class="layui-form-item layui-form-text">
                              <label class="layui-form-label" style="padding-left: 0px; padding-right: 0px">现场情况</label>
                              <div class="layui-col-xs3">
                                  <div class="layui-input-inline" style="padding-left: 30px">
                                      <input type="text" name="workPart" value="" lay-verify="required" placeholder="现场单位"
                                          autocomplete="on" class="layui-input" />
                                  </div>
              
                              </div>
                              <div class="layui-col-xs3">
                                  <div class="layui-input-group">
                                      <div class="layui-input-split layui-input-prefix">管理人员</div>
                                      <input type="number" lay-affix="number" placeholder="2" step="1" min="0" max="999"
                                          lay-precision="0" class="layui-input" name="administrators" />
                                  </div>
                              </div>
              
                              <div class="layui-col-xs3">
                                  <div class="layui-input-group">
                                      <div class="layui-input-split layui-input-prefix">施工人数</div>
                                      <input type="number" lay-affix="number" placeholder="" step="1" min="0" max="999" name="workers"
                                          lay-precision="0" class="layui-input" />
                                  </div>
                              </div>
              
                              <div class="layui-row layui-col-space16">
              
                                  <div class="layui-form-item layui-form-text">
                                      <label class="layui-form-label" style="padding-left: 0px; padding-right: 0px" id="getWeather">获取天气</label>
              
                                      <div class="layui-col-xs2">
                                          <div class="layui-input-inline" style="padding-left: 30px">
                                              <input type="text" name="weather" value="" lay-verify="required" placeholder="天气"
                                                  autocomplete="on" class="layui-input" />
                                          </div>
              
                                      </div>
              
                                      <div class="layui-col-xs2">
                                          <div class="layui-input-inline">
                                              <input type="text" name="wind" value="" lay-verify="required" placeholder="东南风≤3级"
                                                  autocomplete="on" class="layui-input" />
                                          </div>
                                      </div>
              
                                      <div class="layui-col-xs3">
                                          <div class="layui-input-group">
                                              <div class="layui-input-split layui-input-prefix">温度</div>
                                              <input type="number" lay-affix="number" placeholder="" step="1" min="-20" max="50"
                                                  lay-precision="1" class="layui-input" name="temperature" />
                                              <div class="layui-input-split layui-input-suffix">℃</div>
                                          </div>
                                      </div>
              
                                      <div class="layui-col-xs3">
                                          <div class="layui-input-group">
                                              <div class="layui-input-split layui-input-prefix">湿度</div>
                                              <input type="number" lay-affix="number" placeholder="" step="1" min="0" max="100"
                                                  lay-precision="0" class="layui-input" name="humidity" />
                                              <div class="layui-input-split layui-input-suffix">％</div>
                                          </div>
                                      </div>
              
                                  </div>

                                  <div class="layui-form-item layui-form-text">
                                      <label class="layui-form-label" style="padding-left: 0px; padding-right: 0px">施工内容</label>
                                      <div class="layui-input-block">
                                          <textarea placeholder="请输入内容" class="layui-textarea" name="constructionContent" autocomplete="on"></textarea>
                                      </div>
                                  </div>
              
                                  <div class="layui-form-item layui-form-text">
                                      <label class="layui-form-label" style="padding-left: 0px; padding-right: 0px">完成情况</label>
                                      <div class="layui-input-block">
                                          <textarea placeholder="请输入内容" class="layui-textarea" name="finishContent" autocomplete="on"></textarea>
                                      </div>
                                  </div>
              
                                  <div class="layui-form-item layui-form-text">
                                      <label class="layui-form-label" style="padding-left: 0px; padding-right: 0px">设计变更</label>
                                      <div class="layui-input-block">
                                          <textarea placeholder="请输入内容" class="layui-textarea" name="designChanges" autocomplete="on"></textarea>
                                      </div>
                                  </div>
              
                                  <div class="layui-form-item layui-form-text">
                                      <label class="layui-form-label" style="padding-left: 0px; padding-right: 0px">技术交底</label>
                                      <div class="layui-input-block">
                                          <textarea placeholder="请输入内容" class="layui-textarea" name="technicalBriefing" autocomplete="on"></textarea>
                                      </div>
                                  </div>
              
                                  <div class="layui-form-item layui-form-text">
                                      <label class="layui-form-label" style="padding-left: 0px; padding-right: 0px">质量情况</label>
                                      <div class="layui-input-block">
                                          <textarea placeholder="请输入内容" class="layui-textarea" name="quality" autocomplete="on"></textarea>
                                      </div>
                                  </div>
              
                                  <div class="layui-form-item layui-form-text">
                                      <label class="layui-form-label" style="padding-left: 0px; padding-right: 0px">安全情况</label>
                                      <div class="layui-input-block">
                                          <textarea placeholder="请输入内容" class="layui-textarea" name="security" autocomplete="on"></textarea>
                                      </div>
                                  </div>
              
                                  <div class="layui-form-item layui-form-text">
                                      <label class="layui-form-label" style="padding-left: 0px; padding-right: 0px">其他问题</label>
                                      <div class="layui-input-block">
                                          <textarea placeholder="请输入内容" class="layui-textarea" name="other" autocomplete="on"></textarea>
                                      </div>
                                  </div>
                              </div>
                          </div>
              
                          <div class="layui-form-item" style="text-align: center">
                              <button class="layui-btn" lay-submit lay-filter="demo-val">提交</button>
                              <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                          </div>
                          </form>
                          `,
            success: function () {
              layui.use(function () {
                var form = layui.form;
                form.render();
                layui.laydate.render({
                  elem: "#work-date",
                });
                layui.$("#getWeather").on("click", function () {
                  var data = form.val("demo-val-filter");
                  alert("自动增加天气信息暂不可用");
                });
                form.on("submit(demo-val)", function (data) {
                  var field = data.field;
                  let results = field;
                  const bodys =
                    "{" +
                    '"weather": "' +
                    results.weather +
                    '",' +
                    '"temperature": "' +
                    results.temperature +
                    '℃",' +
                    '"humidity": "' +
                    results.humidity +
                    '%",' +
                    '"windDirection": "' +
                    results.wind +
                    '",' +
                    '"progressCompletion": "' +
                    results.finishContent.replace(/\n/g, "") +
                    '",' +
                    '"designChanges": "' +
                    results.designChanges.replace(/\n/g, "") +
                    '",' +
                    '"technicalDisclosure": "' +
                    results.technicalBriefing.replace(/\n/g, "") +
                    '",' +
                    '"qualityCompletion": "' +
                    results.quality.replace(/\n/g, "") +
                    '",' +
                    '"safeCompletion": "' +
                    results.security.replace(/\n/g, "") +
                    '",' +
                    '"others": "' +
                    results.other.replace(/\n/g, "") +
                    '",' +
                    '"dateFilled": "' +
                    results.date +
                    '",' +
                    '"branchId": "50210",' +
                    '"projectId": "1660970600237248514",' +
                    '"projectName": "' +
                    results.project.replace(/\n/g, "") +
                    '",' +
                    '"sectionDetailId": "17096338600501387359",' +
                    '"sectionDetailId_dictText": "' +
                    results.section.replace(/\n/g, "") +
                    '",' +
                    '"projectConstructionLogRytrList": [' +
                    "{" +
                    '"id": "1773855949204987906",' +
                    '"fieldUnit": "' +
                    results.workPart.replace(/\n/g, "") +
                    '",' +
                    '"managers": "' +
                    results.administrators +
                    '",' +
                    '"workers": "' +
                    results.workers +
                    '",' +
                    '"content": "' +
                    results.constructionContent.replace(/\n/g, "") +
                    '"' +
                    "}" +
                    "]," +
                    '"projectConstructionLogSbtrList": [' +
                    "{" +
                    '"id": "17120471870590532499",' +
                    '"mechanical": "塔式起重机",' +
                    '"amount": ""' +
                    "}," +
                    "{" +
                    '"id": "17120471870591606638",' +
                    '"mechanical": "施工升降机",' +
                    '"amount": ""' +
                    "}," +
                    "{" +
                    '"id": "17120471870592975072",' +
                    '"mechanical": "汽车吊",' +
                    '"amount": ""' +
                    "}," +
                    "{" +
                    '"id": "17120471870593953005",' +
                    '"mechanical": "挖掘机",' +
                    '"amount": ""' +
                    "}," +
                    "{" +
                    '"id": "17120471870594270756",' +
                    '"mechanical": "渣土车",' +
                    '"amount": ""' +
                    "}," +
                    "{" +
                    '"id": "17120471870595276041",' +
                    '"mechanical": "叉车",' +
                    '"amount": ""' +
                    "}," +
                    "{" +
                    '"id": "17120471870596799796",' +
                    '"mechanical": "登高车",' +
                    '"amount": ""' +
                    "}" +
                    "]," +
                    '"projectConstructionLogJcysList": [' +
                    "{" +
                    '"id": "17120471870910675884",' +
                    '"name": "",' +
                    '"specification": "",' +
                    '"unit": "",' +
                    '"amount": ""' +
                    "}" +
                    "]," +
                    '"status": "1"' +
                    "}";
                  fetch(
                    "https://www.cscec83.cn/jeecg-boot/project/projectConstructionLog/add",
                    {
                      headers: {
                        accept: "application/json, text/plain, */*",
                        "accept-language":
                          "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                        "content-type": "application/json;charset=UTF-8",
                        "x-access-token": GM_getValue("xAccessToken"),
                      },
                      body: bodys.toString(),
                      method: "POST",
                    }
                  )
                    .then((response) => {
                      return response.json();
                    })
                    .then((data) => {
                      fetch(
                        "https://www.cscec83.cn/jeecg-boot/process/extActProcess/startMutilProcess",
                        {
                          headers: {
                            accept: "application/json, text/plain, */*",
                            "accept-language":
                              "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                            "content-type": "application/json;charset=UTF-8",
                            "x-access-token": GM_getValue("xAccessToken"),
                          },
                          body:
                            '{"flowCode":"dev_project_construction_log_001","id":"' +
                            data.result +
                            '","formUrl":"Project/ConstructionLog/ConstructionLog/ConstructionLogProgress","formUrlMobile":"Project/ConstructionLog/ConstructionLog/ConstructionLogProgress"}',
                          method: "POST",
                        }
                      );
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                  layer.close(index3);
                  return false; // 阻止默认 form 跳转
                });
              });
            },
          });
        } else {
          failVerify();
          waitToast(titleMsgAlert, innerMsgAlert, a);
        }
      });
    }

    function getConstructionDairy(
      xAccessToken,
      pageNo, // 页数
      time, // 请求时间戳
      nickName, // 姓名
      pageSize = 100, // 默认值
      status = 1, // 默认1
      column = "createTime", // 默认值
      order = "desc", // 默认值
      field = "id,,,projectName,branchId_dictText,dateFilled,sectionDetailId_dictText,realname,createTime,bpmStatus_dictText,action" // 默认值
    ) {
      fetch(
        `https://www.cscec83.cn/jeecg-boot/project/projectConstructionLog/list?status=${status}&_t=${time}&realname=${nickName}&column=${column}&order=${order}&field=${field}&pageNo=${pageNo}&pageSize=${pageSize}`,
        {
          headers: {
            "x-access-token": xAccessToken,
          },
          method: "GET",
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("getConstructionDairy response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.code === 200 && data.result.records.length > 0) {
            let allProjectName = [
              ...new Set(data.result.records.map((obj) => obj.projectName)),
            ];
            if (allProjectName.length > 0) {
              let index = 0; // 取出第几个项目
              let ids = [];
              let dairyIds = data.result.records.filter(
                (obj) =>
                  obj.projectName === allProjectName[index] &&
                  obj.bpmStatus_dictText == "已完成"
              );
              dairyIds.forEach((d) => {
                ids.push(d.id);
              });
              let promises = [];
              // 构建 fetch 请求 Promise 并将其推入数组
              ids.forEach((id) => {
                let promise = fetch(
                  `https://www.cscec83.cn/jeecg-boot/project/projectConstructionLog/queryById?id=${id}&_t=${new Date().getTime()}`,
                  {
                    headers: {
                      "x-access-token": xAccessToken,
                    },
                    method: "GET",
                  }
                )
                  .then((response) => response.json())
                  .then((diaryData) => {
                    switch (diaryData.code) {
                      case 200:
                        let rowData = [
                          diaryData.result.projectConstructionLogPage.projectName, // 项目名称
                          diaryData.result.dateStr, // 日期
                          diaryData.result.projectConstructionLogPage.weather, // 天气
                          diaryData.result.projectConstructionLogPage.temperature, // 温度
                          diaryData.result.projectConstructionLogPage.humidity, // 湿度
                          diaryData.result.projectConstructionLogPage
                            .windDirection, // 风向
                          diaryData.result.projectConstructionLogPage.sectionDetailId_dictText.replace(
                            /\n/g,
                            ""
                          ), // 施工区段
                          diaryData.result.projectConstructionLogPage.progressCompletion.replace(
                            /\n/g,
                            ""
                          ), // 进度完成情况
                          diaryData.result.projectConstructionLogPage.designChanges.replace(
                            /\n/g,
                            ""
                          ), // 设计变更
                          diaryData.result.projectConstructionLogPage.technicalDisclosure.replace(
                            /\n/g,
                            ""
                          ), // 技术交底
                          diaryData.result.projectConstructionLogPage.qualityCompletion.replace(
                            /\n/g,
                            ""
                          ), // 质量情况
                          diaryData.result.projectConstructionLogPage.safeCompletion.replace(
                            /\n/g,
                            ""
                          ), // 安全
                          diaryData.result.projectConstructionLogPage.others.replace(
                            /\n/g,
                            ""
                          ), // 其他
                          diaryData.result.approvers, // 审批人
                        ];
                        // 添加现场人员投入
                        let personnelInput = "";
                        try {
                          personnelInput =
                            diaryData.result.projectConstructionLogPage.projectConstructionLogRytrList
                              .map(
                                (obj) =>
                                  `${obj.fieldUnit}：管理人员数量：${
                                    obj.managers
                                  }；作业人员数量：${
                                    obj.workers
                                  }；工作内容：${obj.content.replace(
                                    /\n/g,
                                    "；"
                                  )}`
                              )
                              .join("；");
                        } catch (error) {}
                        rowData.push(personnelInput);
                        // 添加现场设备投入
                        let equipments = "";
                        try {
                          equipments =
                            diaryData.result.projectConstructionLogPage.projectConstructionLogSbtrListb
                              .map((obj) => obj.mechanical + obj.amount)
                              .join("；")
                              .replace(/\n/g, "");
                        } catch (error) {}
                        rowData.push(equipments);
                        // 添加材料进场验收
                        let material = "";
                        try {
                          material =
                            diaryData.result.projectConstructionLogPage.projectConstructionLogJcysList
                              .map(
                                (obj) =>
                                  `${obj.name} ${obj.specification}；${obj.amount} ${obj.unit}：验收${acceptance}；${sampling}`
                              )
                              .join("；")
                              .replace(/\n/g, "");
                        } catch (error) {}
                        // console.log(personnelInput);
                        rowData.push(material);
                        // 将该行数据推入 excelOutput_a 数组
                        excelOutput_a.push(rowData);
                        break;
                      default:
                        Qmsg.error("返回码错误");
                        break;
                    }
                  })
                  .catch((error) => {
                    Qmsg.error("请求施工日志错误");
                  });
                promises.push(promise); // 将每个 fetch 请求的 Promise 推入数组
              });
              // 等待所有的 fetch 请求完成
              Promise.all(promises).then(() => {
                createExcelAndDownload(`施工日志 ${new Date()}`, excelOutput_a);
                Qmsg.success("导出成功");
              });
            } else {
              Qmsg.error("没有项目的施工日志");
            }
          } else {
            Qmsg.error("没有写过施工日志或者返回值错误");
          }
        })
        .catch((error) => {
          Qmsg.error("请登陆后在八三管理平台使用此功能");
        });
    }

    function createExcelAndDownload(fileName, excelOutput_a) {
      let excelContent = "\uFEFF"; // 添加 BOM
      // 将数据转换为逗号分隔的格式
      excelOutput_a.forEach((row) => {
        excelContent += row.join(",") + "\n";
      });
      const blob = new Blob([excelContent], {
        type: "data:text/csv;charset=utf-8",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }

    // 千回百转内的一键答题
    function oneClickAnswer(index) {
      let targetUrl =
        "https://learn.cscec83.cn/prod-api/exam/practice/paper/selectPracticeByClassId?practiceType=" +
        index;
      fetch(targetUrl, {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          authorization:
            document.querySelector("#__nuxt").__vue__.context.store.state.token,
        },
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("practice1 response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          let QAData = JSON.stringify(handelQAData(data.data), null, 2);
          fetch(
            "https://learn.cscec83.cn/prod-api/exam/practice/paper/commitPractice",
            {
              headers: {
                accept: "application/json, text/plain, */*",
                "accept-language":
                  "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                authorization:
                  document.querySelector("#__nuxt").__vue__.context.store.state
                    .token,
                "content-type": "application/json",
              },
              body: QAData,
              method: "POST",
            }
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error("practice1 response was not ok");
              }
              return response.json();
            })
            .then((QAResponse) => {
              if (QAResponse.code == 200) {
                let reachedUpperLimit = "";
                switch (QAResponse.data.reachedUpperLimit) {
                  case 0:
                    reachedUpperLimit = `此项积分未满`;
                    break;
                  case 1:
                    reachedUpperLimit = `此项积分已满`;
                    break;
                  default:
                    reachedUpperLimit = "";
                    break;
                }
                Qmsg.success(`已完成，模拟用时 ${QAResponse.data.time}`);
              } else if (QAResponse.code == 500) {
                Qmsg.error(QAResponse.msg);
              } else {
                Qmsg.error("错误" + QAResponse.msg);
              }
            });
        })
        .catch((error) => {
          Qmsg.error("获取题目失败，进入或重新进入学企来后使用");
          console.error("获取题目失败:", error);
        });
    }

    function getRank() {
      fetch(
        "https://learn.cscec83.cn/prod-api/system/point-statistics/pointsStatisticsMobile?type=1&year=&cycle=",
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            authorization:
              document.querySelector("#__nuxt").__vue__.context.store.state.token,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("getRank response was not ok");
          }
          return response.json();
        })
        .then((rankResponse) => {
          studyRank = rankResponse.data.ranking;
        })
        .catch((error) => {
          Qmsg.error("获取排名失败，进入或重新进入学企来后使用");
          console.error("获取排名失败:", error);
        });
    }

    function handelQAData(data) {
      let processedData = {
        paperId: data.paperId,
        practiceType: data.practiceType,
        practicePaperName: data.practicePaperName,
        questionNumber: data.questionNumber,
        startTime:
          new Date().getTime() -
          90 * 1000 +
          (Math.floor(Math.random() * (20 - -20) + 1) - 20) * 1000,
        testPaperTopics: [],
      };
      // 遍历题目列表
      data.testPaperTopics.forEach((topic) => {
        let processedTopic = {
          paperId: topic.paperId,
          questionId: topic.questionId,
          deptName: topic.deptName,
          topicName: topic.topicName,
          questionType: topic.questionType,
          topicType: topic.topicType,
          topicTypeName: topic.topicTypeName,
          topicAnswer: topic.topicAnswer,
          source: topic.source,
          topicSource: topic.topicSource,
          isTrue: 1,
          optionId: topic.optionId,
          studentOptionId: topic.optionId,
          studentOptionIds: [],
          optionList: topic.optionList.map((option) => {
            return {
              optionId: option.optionId,
              answerId: option.optionId,
              optionContent: option.optionContent,
              sort: option.sort,
              optionLabel: option.optionLabel,
              userCorrectAnswer: "",
            };
          }),
          hierarchyId: topic.hierarchyId,
          relationId: topic.relationId,
          relationName: topic.relationName,
        };
        // 检查题目类型，正确答案从optionList中选出
        let correctAnswerIndex = [];
        switch (topic.questionType) {
          // 单选题
          case 1:
            for (let i = 0; i < topic.optionList.length; i++) {
              if (topic.optionId.includes(topic.optionList[i].optionId)) {
                correctAnswerIndex = i;
              }
            }
            processedTopic.answerIndex = correctAnswerIndex;
            break;
          // 多选题
          case 2:
            for (let i = 0; i < topic.optionList.length; i++) {
              if (topic.optionId.includes(topic.optionList[i].optionId)) {
                correctAnswerIndex.push(i);
              }
            }
            if (correctAnswerIndex.length !== 0) {
              processedTopic.answerIndex = correctAnswerIndex;
              processedTopic.studentOptionIds = topic.optionId.split(",");
            } else {
              processedTopic.answerIndex = "未知";
            }
            break;
          // 判断题
          case 3:
            for (let i = 0; i < topic.optionList.length; i++) {
              if (topic.optionId.includes(topic.optionList[i].optionId)) {
                correctAnswerIndex = topic.optionList[i].optionContent;
              }
            }
            processedTopic.answerIndex = correctAnswerIndex;
            break;
        }
        processedData.testPaperTopics.push(processedTopic);
      });
      return processedData;
    }

    // 通用函数，同步等待1秒
    async function sleep(time) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, time * 1000);
      });
    }

    function hello(title, version) {
      console.log(
        `%c ${title} %cV ${version} `,
        "padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #606060; font-weight: bold;",
        "padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #42c02e; font-weight: bold;"
      );
    }

    function layuiMenu() {
      var toolbox_html = `
                  <div style="margin: 6px 12px;">
                      <div style="height:26px;font-size: 18px;" ><b>异常修复</b></div>
                      <button type="button" class="layui-btn layui-bg-blue toolbox_btn" id="resetQABank_btn_toolbox" style="margin: 9px 0px;">写入题库</button>
                      <button type="button" class="layui-btn layui-bg-blue toolbox_btn" id="openXQL_btn_toolbox" style="margin: 9px 0px;">打开学企来</button>
                      <hr>
                  </div>
                  <div style="margin: 6px 12px;">
                      <div style="height:26px;font-size: 18px;" ><b>学企来功能</b></div>
                      <button type="button" class="layui-btn layui-bg-blue" id="practice1_btn_toolbox" style="margin: 9px 0px;">积分查询</button>
                      <button type="button" class="layui-btn layui-bg-blue" id="practice2_btn_toolbox" style="margin: 9px 0px;">签到</button>
                      <button type="button" class="layui-btn layui-bg-blue" id="practice3_btn_toolbox" style="margin: 9px 0px;">每日一练</button>
                      <button type="button" class="layui-btn layui-bg-blue" id="practice4_btn_toolbox" style="margin: 9px 0px;">闯关练习</button>
                      <button type="button" class="layui-btn layui-bg-blue" id="iWantStudy_btn_toolbox" style="margin: 9px 0px;">课程学习</button>
                      <button type="button" class="layui-btn layui-bg-blue toolbox_btn" id="forceExam_btn_toolbox" style="margin: 9px 0px;">强制考试</button>
                      <button type="button" class="layui-btn layui-bg-blue toolbox_btn" id="QAStar_forceExam_btn_toolbox" style="margin: 9px 0px;">问卷星无限答题</button>
                      <hr>
                  </div>
                  <div style="margin: 6px 12px;">
                      <div style="height:26px;font-size: 18px;" ><b>信息发布</b></div>
                      <button type="button" class="layui-btn layui-bg-blue" id="yuqueUrl_btn_toolbox" style="margin: 9px 0px;">语雀文档</button>
                      <button type="button" class="layui-btn layui-bg-blue" id="openJSUrl_btn_toolbox" style="margin: 9px 0px;">脚本更新</button>
                      <button type="button" class="layui-btn layui-bg-blue" id="contactMe_btn_toolbox" style="margin: 9px 0px;">联系我(bilibili)</button>
                      <hr>
                  </div>
                  <div style="margin: 6px 12px;">
                      <div style="height:26px;font-size: 18px;" ><b>测试功能</b></div>
                      <button type="button" class="layui-btn layui-bg-blue" id="option2_btn_toolbox" style="margin: 9px 0px;">批量导出施工日志</button>
                      <button type="button" class="layui-btn layui-bg-blue" id="option3_btn_toolbox" style="margin: 9px 0px;">强制提交施工日志</button>
                      <hr>
                  </div>

                  <div style="margin: 16px;">
                      <div class="layui-timeline-item">
                      <i class="layui-icon layui-timeline-axis"></i>
                      <div class="layui-timeline-content layui-text">
                          <h3 class="layui-timeline-title">${visionNum}</h3>
                          <p style="font-weight: bold;"><i class="layui-icon"> </i>更新细则</p>
                          <ul>
                              <li>新增 人力资源 题库</li>
                              <li>新增 部分授权</li>
                              <li>修复 每日一言</li>
                              <li>删除 反馈功能</li>
                              <li>删除 用户信息收集</li>
                              <li>大幅度延长权限时间</li>
                              <li>修复 部分 人力资源 题库错误</li>
                          </ul>
                      </div>
                      </div>

                      <div class="layui-timeline-item">
                      <i class="layui-icon layui-timeline-axis"></i>
                      <div class="layui-timeline-content layui-text">
                          <h3 class="layui-timeline-title">2024 年 11 月</h3>
                          <p style="font-weight: bold;"><i class="layui-icon"> </i>更新概览</p>
                          <ul>
                              <li>删除 自动签到功能（1.14.63.20241120）</li>
                              <li>新增 签到功能（1.14.63.20241120）</li>
                              <li>新增 查询积分功能（1.14.63.20241120）</li>
                          </ul>
                      </div>
                      </div>  

                      <div class="layui-timeline-item">
                      <i class="layui-icon layui-timeline-axis"></i>
                      <div class="layui-timeline-content layui-text">
                          <h3 class="layui-timeline-title">2024 年 5 月</h3>
                          <p style="font-weight: bold;"><i class="layui-icon"> </i>更新概览</p>
                          <ul>
                              <li>新增 133工作体系题库（1.14.35.20240523）</li>
                          </ul>
                      </div>
                      </div>  

                      <div class="layui-timeline-item">
                      <i class="layui-icon layui-timeline-axis"></i>
                      <div class="layui-timeline-content layui-text">
                          <h3 class="layui-timeline-title">2024 年 4 月</h3>
                          <p style="font-weight: bold;"><i class="layui-icon"> </i>更新概览</p>
                          <ul>
                              <li>新增 基础设施体系题库（1.14.30.20240419）</li>
                              <li>新增 强制提交施工日志功能（1.14.21.20240410）</li>
                          </ul>
                      </div>
                      </div>  

                      <div class="layui-timeline-item">
                      <i class="layui-icon layui-timeline-axis"></i>
                      <div class="layui-timeline-content layui-text">
                          <h3 class="layui-timeline-title">2024 年 3 月</h3>
                          <p style="font-weight: bold;"><i class="layui-icon"> </i>更新概览</p>
                          <ul>
                              <li>新增 导出施工日志功能（1.14.16.20240329）</li>
                              <li>增加 清欠工作专题考试试题（1.14.14.20240327）</li>
                              <li>加密 用户信息（1.14.12.20240327）</li>
                              <li>新增 语雀文档功能（1.14.10.20240326）</li>
                              <li>新增 联系我功能（1.14.10.20240326）</li>
                              <li>新增 反馈功能（1.14.10.20240326）</li>
                              <li>新增 一键答题功能（1.14.4.20240326）</li>
                              <li>新增 一键闯关功能（1.14.4.20240326）</li>
                              <li>新增 自动完成每周课程（1.14.3.20240325）</li>
                              <li>重制 千回百转功能（1.14.1.20240325）</li>
                              <li>新增 更新概览（1.14.1.20240325）</li>
                              <li>增加 页面内切换答题功能（1.13.3.20240323）</li>
                              <li>增加 集团133文化体系试题库（1.12.22.20240319）</li>
                              <li>增加 题库重置功能（1.12.19.20240318）</li>
                              <li>增加 增加一键复制题目功能（1.12.25.20240322）</li>

                          </ul>
                      </div>
                      </div>  
                      
                      <div class="layui-timeline-item">
                      <i class="layui-icon layui-timeline-axis"></i>
                      <div class="layui-timeline-content layui-text">
                          <h3 class="layui-timeline-title">2024 年 2 月</h3>
                          <p style="font-weight: bold;"><i class="layui-icon"> </i>更新概览</p>
                          <ul>
                              <li>增加 增加自动签到功能（1.12.0.20240222）</li>
                              <li>增加 增加今日积分统计功能(不含考试)（1.12.0.20240222）</li>
                              <li>修改 全部题库与答题逻辑，使用新的题库格式以支持作答题目相同但选项不同的题（1.11.1.20240219）</li>
                              <li>删除 对旧版学企来业的支持与全部代码（1.11.1.20240219）</li>
                              <li>增加 增加了版本更新提醒（1.10.12-20240211）</li>
                              <li>增加 平台自动去水印功能（1.10.7-20240202）</li>
                              <li>增加 点击按钮 9 反馈问题（1.10.0-20240201）</li>
                          </ul>
                      </div>
                      </div>

                      <div class="layui-timeline-item">
                          <i class="layui-icon layui-timeline-axis"></i>
                          <div class="layui-timeline-content layui-text">
                              <h3 class="layui-timeline-title">2024 年 1 月</h3>
                              <p style="font-weight: bold;"><i class="layui-icon"> </i>更新概览</p>
                              <ul>
                                  <li>增加 手机做题考试功能（1.8.0-20240126）</li>
                                  <li>增加 窗口显隐功能（1.8.0-20240126）</li>
                                  <li>增加 强制考试与无限考试功能（1.7.0-20240124）</li>
                                  <li>增加 考试任意切屏功能（1.6.18-20240123）</li>
                                  <li>增加 随机更换背景大图（1.6.17-20240122）</li>
                                  <li>增加 新版学企来考试与自动考试功能（1.6.0-20240107）</li>
                              </ul>
                          </div>
                      </div>

                      <div class="layui-timeline-item">
                          <i class="layui-icon layui-timeline-axis"></i>
                          <div class="layui-timeline-content layui-text">
                              <h3 class="layui-timeline-title">1.0 20240101</h3>
                              <p style="font-weight: bold;"><i class="layui-icon"> </i>诞生了</p>
                          </div>
                      </div>

                  </div>
                      `;
      return toolbox_html;
    }

    function getAddress(urls) {
      let regex = /lng=([\d.]+)&lat=([\d.]+)&name=([^&]+)/;
      let match = urls.match(regex);
      if (match) {
        let texts =
          '[{"mAddress":"' +
          decodeURIComponent(match[3]) +
          '","mLatitude":' +
          match[2] +
          ',"mLongitude":' +
          match[1] +
          "}]";
        GM.setClipboard(texts, "text");
        console.log(texts);
        Qmsg.success("已复制相关信息。");
      }
    }

    async function initQABank() {
      try {
        radioQA = GM_getValue("radioQA");
        multipleQA = GM_getValue("multipleQA");
        judgeQA = GM_getValue("judgeQA");
        if (
          radioQA.length !== 15147 &&
          multipleQA.length !== 6645 &&
          judgeQA.length !== 4649
        ) {
          resetQABank();
        } else {
          Qmsg.success(
            `正常读取全题库，单选题：${radioQA.length + 1}；多选题：${
              multipleQA.length + 1
            }；判断题：${judgeQA.length + 1}`
          );
        }
      } catch (error) {
        console.log(error);
        Qmsg.error(`题库初始化发生意外错误`);
      }
    }

    async function resetQABank() {
      radioQA = [...radioQuestionBank1, ...radioQuestionBank2];
      radioQA = radioQA.map((item) => {
        return {
          ...item,
          question: trimText(item.question),
          options: item.options.map((option) => trimText(option)),
        };
      });
      multipleQA = multipleQuestionBank.map((item) => {
        return {
          ...item,
          question: trimText(item.question),
          options: item.options.map((option) => trimText(option)),
        };
      });
      judgeQA = judgeQuestionBank.map((item) => {
        return {
          ...item,
          question: trimText(item.question),
          options: item.options.map((option) => trimText(option)),
        };
      });
      try {
        GM_setValue("radioQA", radioQA);
        GM_setValue("multipleQA", multipleQA);
        GM_setValue("judgeQA", judgeQA);
        Qmsg.success(
          `全题库共 单选题：${radioQA.length + 1}；多选题：${
            multipleQA.length + 1
          }；判断题：${judgeQA.length + 1} 已写入`
        );
      } catch {
        Qmsg.error(`全题库写入失败`);
      }
    }

    function forceExam() {
      var originalSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function () {
        var self = this;
        var originalOnreadystatechange = this.onreadystatechange;
        this.onreadystatechange = function () {
          if (self.responseURL.match(/getInfoCanPaperNum\?paperId=.+/g)) {
            Object.defineProperty(self, "response", {
              value: { code: 200, msg: null, data: 999 },
              writable: true,
              enumerable: true,
              configurable: true,
            });
            Object.defineProperty(self, "responseText", {
              value: '{"code":200,"msg":null,"data":999}',
              writable: true,
              enumerable: true,
              configurable: true,
            });
            // 调用原有的onreadystatechange回调
            if (originalOnreadystatechange) {
              originalOnreadystatechange.call(self);
            }
          }
        };
        // 调用原始的send方法
        originalSend.apply(this, arguments);
      };
      Qmsg.success("强制考试，启动！");
      systemAlert(
        "强制考试，启动！",
        "考！随便考！",
        8000,
        console.log("点击无限的通知")
      );
    }

    function getWords() {
      fetch(
        "https://api.songzixian.com/api/daily-poem?dataSource=LOCAL_DAILY_POEM",
        {
          method: "GET",
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.code === 200) {
            document.querySelector("#infoText1").innerText = data.data.quotes;
            document.querySelector("#infoText2").innerText =
              "——" +
              data.data.title +
              " " +
              data.data.dynasty +
              " " +
              data.data.author;
          } else {
            document.querySelector("#infoText1").innerText = "今日无事";
          }
        })
        .catch((error) => {
          document.querySelector("#infoText1").innerText = "今日无事";
          console.error("获取每日一言失败 Fetch error:", error);
        });
    }

    function answerQAStarExam() {
      let xuanze = [...radioQA, ...judgeQA];
      let duoxuan = multipleQA;
      try {
        if (verifyUrl() === 4) {
          let QAStarQuestion = document.querySelectorAll(".topichtml");
          if (QAStarQuestion.length === 0) {
            QAStarQuestion = document.querySelectorAll(".topic__type-title");
          }
          for (let j = 0; j < QAStarQuestion.length; j++) {
            let questionFind = trimText(QAStarQuestion[j].innerText);
            try {
              questionFind = questionFind.match(/.+?(?=【.*】$)/)[0];
            } catch {}
            let questionIndex = "";
            switch (QAStarQuestion[j].childNodes.length) {
              case 1:
                questionIndex = xuanze.findIndex(function (item) {
                  return item.question === questionFind;
                });
                if (questionIndex > -1) {
                  let answerArray = [];
                  switch (xuanze[questionIndex].type) {
                    case "判断题":
                      switch (xuanze[questionIndex].answer) {
                        case "对":
                          answerArray = [0];
                          break;
                        case "错":
                          answerArray = [1];
                          break;
                        default:
                          break;
                      }
                      break;
                    default:
                      answerArray = convertAnswerArrayToDigitArray(
                        questionIndex,
                        xuanze
                      );
                      break;
                  }
                  for (let i = 0; i < answerArray.length; i++) {
                    (function (i) {
                      requestAnimationFrame(function () {
                        setTimeout(() => {
                          try {
                            QAStarQuestion[j].nextElementSibling.childNodes[
                              answerArray[i]
                            ].click();
                          } catch (error) {
                            try {
                              QAStarQuestion[j].parentNode.nextSibling.childNodes[
                                answerArray[i]
                              ].click();
                            } catch (error) {}
                          }
                        }, 150);
                      });
                    })(i);
                  }
                } else {
                  console.log(
                    QAStarQuestion[j] + "非多选题未找到答案",
                    "题库无此题,请及时记录维护题库或 Ctrl+S 保存页面"
                  );
                  continue;
                }
                break;
              case 2:
                questionIndex = duoxuan.findIndex(function (item) {
                  return item.question === questionFind;
                });
                if (questionIndex > -1) {
                  let answerArray = convertAnswerArrayToDigitArray(
                    questionIndex,
                    duoxuan
                  );
                  for (let i = 0; i < answerArray.length; i++) {
                    (function (i) {
                      requestAnimationFrame(function () {
                        setTimeout(() => {
                          try {
                            QAStarQuestion[j].nextElementSibling.childNodes[
                              answerArray[i]
                            ].click();
                          } catch (error) {
                            try {
                              QAStarQuestion[j].parentNode.nextSibling.childNodes[
                                answerArray[i]
                              ].click();
                            } catch (error) {}
                          }
                        }, 150);
                      });
                    })(i);
                  }
                } else {
                  Qmsg.error(
                    QAStarQuestion[j] + "多选题未找到答案",
                    "题库无此题,请及时记录维护题库或 Ctrl+S 保存页面"
                  );
                  continue;
                }
                break;
              default:
                break;
            }
          }
        } else {
          Qmsg.error("此页面未配置本功能,如功能配置错误请联系我");
        }
      } catch (error) {
        Qmsg.error("exam函数未完全适配导致的问题,请 Ctrl+S 保存页面并联系我");
      }
    }

    function verifyUrl() {
      currentUrl = window.location.href;
      // 1 新版学企来考试
      if (currentUrl.includes("learn.cscec83.cn/xql_exam/examItem")) {
        return 1;
        // 2 答题结算
      } else if (
        currentUrl.includes("learn.cscec83.cn/xql_exam/dayItem/dayResult")
      ) {
        return 2;
        // 4 问卷星
      } else if (
        currentUrl.includes("wjx.top/") ||
        currentUrl.includes("wjx.cn/")
      ) {
        return 4;
        // 5 公司登录界面
      } else if (currentUrl.includes("www.cscec83.cn/user/login")) {
        return 5;
        // 6 新版学企来练习
      } else if (currentUrl.includes("learn.cscec83.cn/xql_exam/dayItem")) {
        return 6;
        // 7 高德定位
      } else if (
        currentUrl.includes("www.amap.com/regeo") &&
        currentUrl.includes("lng=") &&
        currentUrl.includes("lat=")
      ) {
        return 7;
        // 8 八三主页
      } else if (currentUrl.includes("www.cscec83.cn/dashboard/analysis")) {
        return 8;
        // 9 新版学企来
      } else if (currentUrl.includes("learn.cscec83.cn")) {
        return 9;
      } else {
        return false;
      }
    }

    function getAnswer(questionAnswerBankIndex, questionsArray) {
      return questionsArray[questionAnswerBankIndex].answer;
    }

    function convertAnswerToArray(questionAnswerBankIndex, questionsArray) {
      let answerArray = getAnswer(questionAnswerBankIndex, questionsArray)
        .match(/[A-Za-z]/g)
        .map(function (val) {
          return val.toLowerCase();
        });
      return answerArray;
    }

    // 转换字母答案为数字并生成数组
    function convertAnswerArrayToDigitArray(questionIndex, questionsArray) {
      let answerArray = convertAnswerToArray(questionIndex, questionsArray).map(
        (char) => char.charCodeAt(0) - 96 - 1
      ); // 多减一个 1 好点击
      return answerArray;
    }

    // 点击页面具有某个文本的span
    function clickSpanContainingText(text) {
      var spans = document.getElementsByTagName("span");
      for (var i = 0; i < spans.length; i++) {
        if (spans[i].innerText === text) {
          spans[i].click();
          break;
        }
      }
    }

    function hideWindow() {
      if (
        document.querySelector(".todo-title") &&
        document.querySelector(".todo-title").innerText == "公司待办"
      ) {
        if (cscecAdminCount) {
          try {
            document.querySelector(".option6").click();
            cscecAdminCount = false;
          } catch (error) {}
        }
      }
    }

    function webPageWatchUrl(watchCallback) {
      watchCallback();
      currentUrl = window.location.href;
      setInterval(function () {
        if (currentUrl !== window.location.href) {
          currentUrl = window.location.href;
          watchCallback();
        }
      }, monitorGap);
    }

    function addButtons() {
      setInterval(function () {
        switch (verifyUrl()) {
          case 1:
          case 2:
          case 6:
            addCopyButton();
            addPractice1Button();
            addPractice2Button();
            addBackButton();
            break;
          default:
            break;
        }
      }, 1000);
    }

    function addCopyButton() {
      try {
        if (!document.querySelector("#copy-Button")) {
          let copyButton = document.createElement("button");
          copyButton.id = "copy-Button";
          copyButton.textContent = "复制题目";
          copyButton.classList.add("add-Button");
          let parentElement = document.querySelectorAll(".size-16")[0];
          parentElement.appendChild(copyButton);
          copyButton.addEventListener("click", function (event) {
            let questionElement =
              document.querySelectorAll(".el-card__body")[1].childNodes[2];
            let question = questionElement ? questionElement.innerText : "";
            let options = getOptions();
            let QAtype = getQATypeString();
            let text = `{
                          question: '${trimText(question)}',
                          options: ${options},
                          answer: '',
                          type: '${QAtype}'
                      }`;
            GM.setClipboard(text);
            Qmsg.success("复制成功");
          });
        }
      } catch (error) {}
    }

    function addPractice1Button() {
      try {
        if (!document.querySelector("#practice1-Button")) {
          let practice1Button = document.createElement("button");
          practice1Button.id = "practice1-Button";
          practice1Button.textContent = "每日一练";
          practice1Button.classList.add("add-Button");
          let parentElement = document.querySelectorAll(
            ".el-page-header__content"
          )[0];
          parentElement.appendChild(practice1Button);
          practice1Button.addEventListener("click", function (event) {
            window.open("https://learn.cscec83.cn/exam/dayItem/?type=1", "_self");
          });
        }
      } catch (error) {}
    }

    function addPractice2Button() {
      try {
        if (!document.querySelector("#practice2-Button")) {
          let practice2Button = document.createElement("button");
          practice2Button.id = "practice2-Button";
          practice2Button.textContent = "闯关练习";
          practice2Button.classList.add("add-Button");
          let parentElement = document.querySelectorAll(
            ".el-page-header__content"
          )[0];
          parentElement.appendChild(practice2Button);
          practice2Button.addEventListener("click", function (event) {
            window.open("https://learn.cscec83.cn/exam/dayItem/?type=2", "_self");
          });
        }
      } catch (error) {}
    }

    function addBackButton() {
      try {
        if (!document.querySelector("#addBack-Button")) {
          let addBackButton = document.createElement("button");
          addBackButton.id = "addBack-Button";
          addBackButton.textContent = "返回首页";
          addBackButton.classList.add("add-Button");
          let parentElement = document.querySelectorAll(
            ".el-page-header__content"
          )[0];
          parentElement.appendChild(addBackButton);
          addBackButton.addEventListener("click", function (event) {
            window.open("https://learn.cscec83.cn/", "_self");
          });
        }
      } catch (error) {}
    }

    function getOptions() {
      let options = "[";
      switch (getQAType()) {
        case 1:
        case 3:
          document.querySelectorAll(".el-radio__label").forEach((e) => {
            options += "'" + trimText(e.innerText.replace(/[A-J]\. /, "")) + "',";
          });
          break;
        case 2:
          document
            .querySelectorAll(".el-checkbox-group")[0]
            .childNodes.forEach((e) => {
              options +=
                "'" + trimText(e.innerText.replace(/[A-J]\. /, "")) + "',";
            });
          break;
        default:
          break;
      }
      options += "]";
      return options.replace(",]", "]");
    }

    function getQATypeString() {
      switch (getQAType()) {
        case 1:
          return "单选题";
        case 2:
          return "多选题";
        case 3:
          return "判断题";
        default:
          return "未知题目";
      }
    }

    function urlOperate() {
      switch (verifyUrl()) {
        case 4:
          try {
            // 解除复制粘贴限制
            setTimeout(function () {
              $(".textCont,input,textarea").off();
            }, 2000);
            $(".textCont,input,textarea").off(); // 既不生效，再来一次又何妨
            document.oncontextmenu = function () {
              return true;
            };
            document.onselectstart = function () {
              return true;
            };
            $("body").css("user-select", "text");
            syncManyinput();
          } catch (error) {
            Qmsg.error("破解复制失败");
          }
          break;
        case 5:
          try {
            document.documentElement.style.fontSize = 46.6667 + "px";
            GM_addStyle(`
                                  .bgi[data-v-28024579] {
                                      background:url(https://dailybing.com/api/v1) no-repeat;
                                      background-size:100% 100%;
                                  }
                                  #userLayout {
                                      font-size: 0.5rem;
                                  }
                              `);
          } catch (error) {}
          break;
        case 8:
          document.documentElement.style.fontSize = 46.6667 + "px";
          GM_addStyle(`
                          .new-box .new-col .new-value[data-v-616703f6] {
                              height:0.1rem;
                              line-height:0.5rem;
                              font-size:0.4rem;
                          }
                          .logout_title img[data-v-c4d65dcc] {
                              height:0.4rem;
                          }
              `);
          if (cscecAdminCount) {
            try {
              document.querySelector(".option6").click();
              cscecAdminCount = false;
            } catch (error) {}
          }
          let intervalId; // 存储 setInterval 的返回值
          let isClickListenerAdded = false; // 标记是否已添加点击事件监听器
          intervalId = setInterval(function () {
            if (GM_getValue("thirdToken")) {
              var cardTitle = document.querySelector(".card-title");
              if (cardTitle) {
                try {
                  if (isClickListenerAdded) {
                    clearInterval(intervalId);
                    return;
                  }
                  let cardTitle = document.querySelector(".card-title");
                  cardTitle.addEventListener("click", function () {
                    let url =
                      "https://learn.cscec83.cn" +
                      "?token=" +
                      GM_getValue("thirdToken");
                    window.open(url, "_blank");
                  });
                  isClickListenerAdded = true;
                } catch (error) {
                  console.error(error);
                }
              }
            }
          }, 500);
          cscecAdminCount = false;
          break;
        default:
          break;
      }
      setInterval(function () {
        try {
          let content = document.querySelector("#content").childNodes[2];
          if (content.style.background !== "") {
            document.querySelector("#content").childNodes[2].style.background =
              "";
            Qmsg.success("去除水印成功");
          }
        } catch (error) {}
        if (
          cscecConstructionLogCount &&
          currentUrl.includes(
            "www.cscec83.cn/Project/ConstructionLog/ConstructionLog/"
          )
        ) {
          try {
            if (
              document
                .querySelectorAll(".ant-space-item")[2]
                .innerText.includes("施工区段")
            ) {
              let newParagraph = document.createElement("p");
              newParagraph.textContent = newParagraphText1;
              newParagraph.style.color = "red";
              newParagraph.style.fontWeight = "bold";
              newParagraph.style.textAlign = "center";
              newParagraph.style.fontSize = "0.55rem";
              let parentElement = document.querySelectorAll(
                ".ant-spin-nested-loading"
              )[1];
              let firstChild = parentElement.firstChild;
              parentElement.insertBefore(newParagraph, firstChild);
              cscecConstructionLogCount = false;
            }
          } catch (error) {}
        }
      }, 2000);
    }

    function fillVerificationCode() {
      if (currentUrl.includes("https://www.cscec83.cn/user/login")) {
        var imgSrc = document.querySelectorAll("img")[4].src;
        var image = new Image();
        image.src = imgSrc;
        const { createWorker } = Tesseract;
        (async () => {
          const worker = await createWorker("eng");
          const {
            data: { text },
          } = await worker.recognize(image);
          var inputElement = document.getElementById("inputCode");
          inputElement.value = text;
          // 创建并触发 input 事件
          var event = new Event("input", {
            bubbles: true,
            cancelable: true,
          });
          inputElement.dispatchEvent(event);
        })();
        setTimeout(function () {
          document.querySelector(".login-button").click();
        }, loginCheck);
      } else {
        Qmsg.error("此页面未配置本功能,如功能配置错误请联系我");
        // simpleToast("此页面未配置本功能", "填写验证码", 2e3);
        return false;
      }
    }

    // 移动
    function handleMouseDown(event) {
      isDraggable = true;
      var handleMoveDiv = document.getElementById("mainDiv");
      var offsetX = event.clientX - handleMoveDiv.getBoundingClientRect().left;
      var offsetY = event.clientY - handleMoveDiv.getBoundingClientRect().top;
      // 阻止默认行为和冒泡
      event.preventDefault();
      event.stopPropagation();
      document.addEventListener("mousemove", handleWindowMouseMove);
      document.addEventListener("mouseup", handleWindowMouseUp);
      function handleWindowMouseMove(event) {
        if (isDraggable) {
          requestAnimationFrame(() => {
            handleMoveDiv.style.left = event.clientX - offsetX + "px";
            handleMoveDiv.style.top = event.clientY - offsetY + "px";
            window.getSelection().empty();
          });
        }
      }
      function handleWindowMouseUp() {
        isDraggable = false;
        document.removeEventListener("mousemove", handleWindowMouseMove);
        document.removeEventListener("mouseup", handleWindowMouseUp);
      }
    }

    function overrideOpen() {
      var open = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function (method, url) {
        var self = this;
        // 添加事件监听器，监听 XMLHttpRequest 的响应阶段
        this.addEventListener("load", function () {
          if (self.readyState === 4 && self.status === 200) {
            var data = self.responseText;
            var isPracticeData = data.includes("testPaperTopics");
            var isTokenData = data.includes("thirdToken");
            // var isAuthorization = data.includes('token') && data.includes('data');
            if (isPracticeData || isTokenData) {
              // if (isAuthorization) {
              //     var authorizationData = JSON.parse(data);
              //     handleAuthorizationData(authorizationData);
              // }
              if (isPracticeData) {
                practiceData = practiceData || [];
                if (!Array.isArray(practiceData)) {
                  practiceData = [];
                }
                practiceData.push(JSON.parse(data));
                handlePracticeData(practiceData);
              }
              if (isTokenData) {
                tokenData = tokenData || [];
                if (!Array.isArray(tokenData)) {
                  tokenData = [];
                }
                tokenData.push(JSON.parse(data));
                handleTokenData(tokenData);
              }
            }
          }
        });
        // 调用原始的 open 方法
        open.apply(this, arguments);
      };
    }

    function handlePracticeData(practiceData) {
      return new Promise(function (resolve) {
        let targetArray = practiceData.find(function (response) {
          return (
            response.msg === "操作成功" &&
            response.code === 200 &&
            response.data.testPaperTopics
          );
        });
        if (targetArray) {
          let formattedData = outputPracticeTopics(targetArray.data);
          savedData = formattedData.slice();
        } else {
          console.log("脚本未找到符合条件的题库信息");
        }
        practiceData.length = 0;
        resolve();
      });
    }

    function handelTodayPointsList(todayPointsList) {
      let arr = todayPointsList.filter(function (topic) {
        return !filterArray.includes(topic.pointSource);
      });
      let isFinishInfoHtml = "";
      arr.forEach(function (topic) {
        topic.maxPoints === topic.currentPoints
          ? (isFinishInfoHtml = `${isFinishInfoHtml}<div style="color: #5bae23;height:26px;font-size: 15px;text-align: center;">${topic.pointSource}: 已完成</div>`)
          : (isFinishInfoHtml = `${isFinishInfoHtml}<div style="color: #e16c96;font-weight: bold;height:26px;font-size: 15px;text-align: center;">${topic.pointSource}: ${topic.currentPoints}/${topic.maxPoints}</div>`);
      });
      if (0 < studyRank && studyRank < 99999) {
        isFinishInfoHtml = `${isFinishInfoHtml}<div style="color: red;font-weight:800;height:26px;font-size: 15px;text-align: center;">总排名：${studyRank}`;
      }
      Qmsg.success(isFinishInfoHtml, {
        showClose: true,
        html: true,
        position: "topright",
        timeout: 4000,
      });
    }

    function handleTokenData(tokenData) {
      return new Promise(function (resolve) {
        let targetArray = tokenData.find(function (response) {
          return response.code === 200 && response !== null;
        });
        if (targetArray) {
          GM_setValue("userName", targetArray.result.userInfo.workNo);
          GM_setValue("nickName", targetArray.result.userInfo.realname);
          GM_setValue("xAccessToken", targetArray.result.token);
          getAllUsers();
          GM_setValue("avatar", targetArray.result.userInfo.avatar);
          titleMsgAlert = GM_getValue("userName") + " " + GM_getValue("nickName");
          timestamp = targetArray.timestamp.toString().slice(0, 10);
          try {
            xAccessToken = targetArray.result.token;
          } catch (error) {}
          try {
            GM_setValue("thirdToken", targetArray.result.thirdToken);
          } catch (error) {}
          try {
            var informationAccept = trimText(getAb());
          } catch (error) {
            informationAccept = "未授权";
          }
          let result = {
            姓名: GM_getValue("nickName"),
            员工号: GM_getValue("userName"),
          };
          GM_setValue("information", result);
        } else {
          console.log("脚本未找到符合条件的token");
        }
        targetArray = [];
        resolve();
      });
    }

    function answerQuestion() {
      try {
        let isQuestionFound = savedData.some((questionObject) => {
          return (
            trimText(questionObject.question) ==
            trimText(
              document.querySelectorAll(".el-card__body")[1].childNodes[2]
                .innerText
            )
          );
        });
        if (isQuestionFound) {
          if (getAb()) {
            let answerList = [];
            let questionNumber = getPracticeQANumber();
            for (let i = 0; i < savedData.length; i++) {
              let answerArray = savedData[i].TrueAnswer.split(",");
              let numericArray = answerArray.map(function (letter) {
                // 多减 1 个 1, 后面处理点击次序时方便
                return letter.charCodeAt(0) - 65;
              });
              answerList.push(numericArray);
            }
            try {
              if (answerList[questionNumber - 1].length === 1) {
                var targetAnswerElement =
                  document.querySelectorAll(".el-radio-group")[0].childNodes[
                    answerList[questionNumber - 1][0]
                  ];
                if (
                  targetAnswerElement &&
                  !targetAnswerElement.classList.contains("is-checked")
                ) {
                  targetAnswerElement.click();
                  // console.log("题号 " + questionNumber + " 点选: " + String.fromCharCode((answerList[questionNumber - 1][0] + 1) + 64));
                } else {
                  document.querySelectorAll(".el-button")[0].click();
                }
              } else if (answerList[questionNumber - 1].length > 1) {
                for (let i = 0; i < answerList[questionNumber - 1].length; i++) {
                  (function (i) {
                    requestAnimationFrame(function () {
                      var targetAnswerElement =
                        document.querySelectorAll(".el-checkbox-group")[0]
                          .childNodes[answerList[questionNumber - 1][i]];
                      if (
                        targetAnswerElement &&
                        !targetAnswerElement.classList.contains("is-checked")
                      ) {
                        targetAnswerElement.click();
                        // console.log("题号 " + questionNumber + " 点击选项: " + String.fromCharCode((answerList[questionNumber - 1][i] + 1) + 64));
                      } else {
                        document.querySelectorAll(".el-button")[0].click();
                      }
                    });
                  })(i);
                }
              } else {
                Qmsg.error("不在可答题的页面");
              }
            } catch (error) {
              Qmsg.error("异常错误");
            }
          } else {
            Qmsg.error("请检查权限是否正常");
          }
        } else {
          console.log("题目 " + isQuestionFound);
          Qmsg.error("请检查操作是否正确");
        }
      } catch (error) {
        clickSpanContainingText("回到首页");
      }
    }

    function trimOptions(options) {
      let modifiedOptions = options.map(function (option) {
        return trimText(option.replace(/[A-J]\. /, ""));
      });
      return modifiedOptions;
    }

    function getQAType() {
      let QAType =
        document.querySelectorAll(".el-card__body")[1].childNodes[0].childNodes[0]
          .innerText;
      if (QAType.includes("单选")) {
        return 1;
      } else if (QAType.includes("多选")) {
        return 2;
      } else if (QAType.includes("判断")) {
        return 3;
      } else {
        return false;
      }
    }

    function answerExam() {
      let QAnumber = getQANumber();
      if (!isQuestionFinishArray[QAnumber]) {
        // 存储页面题目类型
        let questionType =
          document.querySelectorAll(".el-card__body")[1].childNodes[0]
            .childNodes[0].innerText;
        // 存储页面题目问题
        var questionText =
          document.querySelectorAll(".el-card__body")[1].childNodes[2].innerText;
        // 存储题目完成情况
        isQuestionFinishArray[QAnumber] = false;
        try {
          var trimmedText = trimText(questionText);
        } catch (error) {}
        let questionAnswerBankIndex;
        switch (getQAType()) {
          // 单选
          case 1:
            questionAnswerBankIndex = radioQA.findIndex(function (item) {
              return item.question === trimmedText;
            });
            if (questionAnswerBankIndex > -1) {
              let options = document.querySelectorAll(".el-radio__label");
              let optionArray = optionsArray(options);
              let AnswerArrayToNumberArray = convertAnswerArrayToDigitArray(
                questionAnswerBankIndex,
                radioQA
              );
              if (
                AnswerArrayToNumberArray &&
                AnswerArrayToNumberArray.length !== 0
              ) {
                for (let i = 0; i < AnswerArrayToNumberArray.length; i++) {
                  let optionKey = AnswerArrayToNumberArray[i];
                  let trueOptionNum = optionArray.indexOf(
                    radioQA[questionAnswerBankIndex].options[optionKey]
                  );
                  if (trueOptionNum !== -1) {
                    if (
                      !options[
                        trueOptionNum
                      ].previousElementSibling.classList.contains("is-checked")
                    ) {
                      try {
                        (function (i) {
                          requestAnimationFrame(function () {
                            options[trueOptionNum].click();
                          });
                          isQuestionFinishArray[QAnumber] = true;
                        })(i);
                      } catch (error) {
                        Qmsg.warning("该单选题选项缺少");
                      }
                    }
                  } else {
                    simpleToast(
                      "有混淆项，题库其他参考答案 ↓",
                      radioQA[questionAnswerBankIndex].options[optionKey],
                      3e3
                    );
                  }
                }
              } else {
                simpleToast("单选题答案转换错误", "请报告此错误信息", 3e3);
              }
            } else {
              simpleToast("未找到答案", "请联系更新题库", 3e3);
            }
            break;
          // 多选
          case 2:
            questionAnswerBankIndex = multipleQA.findIndex(function (item) {
              return item.question === trimmedText;
            });
            if (questionAnswerBankIndex > -1) {
              let options = document.querySelectorAll(".el-checkbox__label");
              let optionArray = optionsArray(options);
              let AnswerArrayToNumberArray = convertAnswerArrayToDigitArray(
                questionAnswerBankIndex,
                multipleQA
              );
              if (
                AnswerArrayToNumberArray &&
                AnswerArrayToNumberArray.length !== 0
              ) {
                for (let i = 0; i < AnswerArrayToNumberArray.length; i++) {
                  let optionKey = AnswerArrayToNumberArray[i];
                  let trueOptionNum = optionArray.indexOf(
                    multipleQA[questionAnswerBankIndex].options[optionKey]
                  );
                  if (hasDuplicates(optionArray)) {
                    Qmsg.warning("此题目选项重复，可能会漏答！", {
                      position: "center",
                    });
                  }
                  if (trueOptionNum !== -1) {
                    if (
                      !options[
                        trueOptionNum
                      ].previousElementSibling.classList.contains("is-checked")
                    ) {
                      try {
                        (function (i) {
                          requestAnimationFrame(function () {
                            options[trueOptionNum].click();
                          });
                          isQuestionFinishArray[QAnumber] = true;
                        })(i);
                      } catch (error) {
                        Qmsg.warning("多选题选项缺少");
                        isQuestionFinishArray[QAnumber] = true;
                      }
                    } else {
                      for (let j = 0; j < options.length; j++) {
                        options;
                      }
                    }
                  } else {
                    simpleToast(
                      "有混淆项，题库其他正确选项 ↓",
                      multipleQA[questionAnswerBankIndex].options[optionKey],
                      3e3
                    );
                  }
                }
              } else {
                simpleToast("多选题答案转换错误", "请报告此错误信息", 3e3);
              }
            } else {
              simpleToast("未找到答案", "请联系更新题库", 3e3);
            }
            break;
          // 判断
          case 3:
            let options = document.querySelectorAll(".el-radio__label");
            questionAnswerBankIndex = judgeQA.findIndex(function (item) {
              return item.question === trimmedText;
            });
            if (questionAnswerBankIndex > -1) {
              let optionKey = judgeQA[questionAnswerBankIndex].answer;
              switch (optionKey) {
                case "对":
                  for (let j = 0; j < options.length; j++) {
                    if (rightArr.includes(options[j].innerText)) {
                      if (
                        !options[j].previousElementSibling.classList.contains(
                          "is-checked"
                        )
                      ) {
                        options[j].click();
                        isQuestionFinishArray[QAnumber] = true;
                      }
                    }
                  }
                  break;
                case "错":
                  for (let j = 0; j < options.length; j++) {
                    if (wrongArr.includes(options[j].innerText)) {
                      if (
                        !options[j].previousElementSibling.classList.contains(
                          "is-checked"
                        )
                      ) {
                        options[j].click();
                        isQuestionFinishArray[QAnumber] = true;
                      }
                    }
                  }
                  break;
                default:
                  simpleToast("题库答案错误", "请报告此错误信息", 3e3);
                  break;
              }
            } else {
              simpleToast("未找到答案", "请联系更新题库", 3e3);
            }
            break;
          default:
            simpleToast("未支持的题型", "请联系增加此支持", 3e3);
            break;
        }
      } else {
        if (document.querySelectorAll(".el-button")[2].innerText === "下一题") {
          document.querySelectorAll(".el-button")[2].click();
        } else {
          document.querySelectorAll(".el-button")[1].click();
        }
      }
    }

    function hasDuplicates(array) {
      return new Set(array).size !== array.length;
    }

    function optionsArray(optionArray) {
      // 存储页面题目选项
      let optionTexts = [];
      for (let i = 0; i < optionArray.length; i++) {
        optionTexts.push(optionArray[i].innerText);
      }
      return trimOptions(optionTexts);
    }

    function autoExam() {
      let autoAnswerCount = 0;
      console.log(
        "开始自动做题,共计 " +
          document.querySelectorAll(".el-col").length +
          " 道题目"
      );
      const autoExam = setInterval(() => {
        if (autoAnswerCount < 20) {
          autoAnswerCount++;
          answerExam();
          if (document.querySelectorAll(".el-col").length === getQANumber()) {
            clearInterval(autoExam);
            Qmsg.info("结束自动做题");
          }
        } else {
          clearInterval(autoExam);
          Qmsg.info("结束自动做题");
        }
      }, 150);
    }

    function autoAnswerQuestion() {
      if (getAb()) {
        if (savedData.length === 0) {
          Qmsg.error("未劫持到数据,操作太快或不在指定页面");
        } else {
          answerQuestionsLoop();
        }
      } else {
        Qmsg.warning("权限有误,请联系管理员添加权限");
      }
    }

    async function answerQuestionsLoop() {
      while (
        document.querySelectorAll(".el-button")[0].innerText !== "完成" &&
        getPracticeQANumber() > 0
      ) {
        await answerQuestions();
      }
    }

    async function answerQuestions() {
      if (getPracticeQANumber() - 1 >= savedData.length) {
        Qmsg.success("所有题目已完成");
        return;
      }
      try {
        answerQuestion();
        await new Promise((resolve) => setTimeout(resolve, answerTimeGap));
      } catch (error) {
        Qmsg.error("请正常手动答题或重新进入");
        return;
      }
    }

    function findTimeByNickname(targetNickname, userList) {
      let user = userList.find((user) => user.users === targetNickname);
      return user ? user.time : false;
    }

    function getAb() {
      try {
        var a = userList.some(
          (user) =>
            user.users ===
            md5(GM_getValue("nickName") + GM_getValue("userName"), 32)
        );
      } catch (error) {
        Qmsg.error("请从公司页面正常渠道进入页面");
        return false;
      }
      if (a) {
        if (md5(userList.toString(), 32) !== gk) {
          findFalseUser();
          return false;
        }
        try {
          var userName = GM_getValue("userName");
          var userTime = userName
            ? findTimeByNickname(
                md5(GM_getValue("nickName") + GM_getValue("userName"), 32),
                userList
              )
            : null;
          if (md5(userTime, 32) !== tgk) {
            Qmsg.error("请勿自行改动授权时间");
            failVerify();
            return false;
          }
        } catch (error) {
          Qmsg.error("时长获取错误");
          return false;
        }
        innerMsgAlert = "";
        innerMsgAlert = verifyTime(userTime)
          ? verifyTime(userTime)
          : "　 权限过期或已无权限 请联系重新授权。　 ";
        return verifyTime(userTime);
      } else {
        failVerify();
        return false;
      }
    }

    function failVerify() {
      if (
        userList.find((u) => u.userName === GM_getValue("userName")) &&
        GM_getValue("userName") !== undefined &&
        GM_getValue("nickName") !== undefined
      ) {
        titleMsgAlert = GM_getValue("userName") + " " + GM_getValue("nickName");
        var userName = userList.find(
          (u) => u.userName === GM_getValue("userName")
        );
        var userTime = userName ? userName.time : null;
        innerMsgAlert = verifyTime(userTime)
          ? verifyTime(userTime)
          : "　 权限过期 请联系重新授权。　 ";
      } else {
        if (
          GM_getValue("userName") !== undefined &&
          GM_getValue("nickName") !== undefined
        ) {
          titleMsgAlert = GM_getValue("userName") + " " + GM_getValue("nickName");
        } else {
          titleMsgAlert = "未登录";
        }
        innerMsgAlert = "";
        for (let i = 0; i < failStringArray.length; i++) {
          innerMsgAlert += String.fromCharCode(failStringArray[i]);
        }
      }
    }

    function verifyAndToast() {
      getAb();
      waitToast(titleMsgAlert, innerMsgAlert, a);
    }

    function findFalseUser() {
      try {
        titleMsgAlert = "";
        for (let i = 0; i < falseTitleStringArray.length; i++) {
          titleMsgAlert += String.fromCharCode(falseTitleStringArray[i]);
        }
        innerMsgAlert = "";
        for (let i = 0; i < falseInnerTextStringArray.length; i++) {
          innerMsgAlert += String.fromCharCode(falseInnerTextStringArray[i]);
        }
        waitToast(titleMsgAlert, innerMsgAlert, a);
      } catch (error) {}
    }

    function waitToast(titleText, innerText, logText) {
      let CustomBox = Box.mixin({
        customFunction: function () {
          console.log(logText);
        },
      });
      let customBoxInstance = new CustomBox({
        title: titleText,
        text: innerText,
      });
      try {
        customBoxInstance.customFunction();
      } catch (error) {}
    }

    function simpleToast(title, innerText, time) {
      let Toast = Box.mixin({
        title: title,
        toast: true,
        time: time,
      });
      new Toast({ text: innerText });
    }

    function clearCookie() {
      // 这段代码来自其它脚本，为MIT协议，
      var keys = document.cookie.match(/[^ =;]+(?==)/g);
      if (keys) {
        for (var i = keys.length; i--; ) {
          document.cookie =
            keys[i] + "=0;path=/;expires=" + new Date(0).toUTCString();
          document.cookie =
            keys[i] +
            "=0;path=/;domain=" +
            document.domain +
            ";expires=" +
            new Date(0).toUTCString();
          document.cookie =
            keys[i] +
            "=0;path=/;domain=ratingdog.cn;expires=" +
            new Date(0).toUTCString();
        }
      }
      location.reload();
    }

    // 通用函数，清理cookie【方法2】
    function deleteAllCookies() {
      var cookies = document.cookie.split(";");
      console.log(cookies);
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;";
        //document.cookie = null
      }
      var cookies2 = document.cookie.split(";");
    }

    // 通用函数，清理storage
    function clearStorage() {
      localStorage.clear();
      sessionStorage.clear();
    }

    function btnClick(query, func) {
      document.querySelector(query).addEventListener("click", func);
    }

    function btnClickToUrl(query, url) {
      btnClick(query, function () {
        window.open(url).location;
      });
    }

    // 同步Manyinput的内容到真正的input标签
    // 来源: EasyWJX；作者: MelonFish
    function syncManyinput() {
      setInterval(function () {
        var all_textCont = document.querySelectorAll(".textCont");
        for (var i = 0; i < all_textCont.length; i++) {
          var input = all_textCont[i].parentNode.previousSibling;
          input.value = all_textCont[i].innerText;
        }
      }, 1500);
    }

    function sendMsg() {
      Qmsg.error("该反馈渠道已关闭");
    }

    function getIP() {
      fetch("https://api.qjqq.cn/api/Local")
        .then((response) => {
          if (!response.ok) {
            console.log("getIP Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          ipData = data;
        })
        .catch((error) => {
          console.error(
            "getIP There was a problem with the fetch operation:",
            error
          );
        });
    }

    function getAllUsers() {
      let currentUser =
        "{" + GM_getValue("userName") + ": " + GM_getValue("nickName") + "}";
      if (GM_getValue("allUsers")) {
        let allUsers = GM_getValue("allUsers");
        let isContainCurrentUser = allUsers.includes(currentUser);
        if (!isContainCurrentUser) {
          allUsers = allUsers + "," + currentUser;
          GM_setValue("allUsers", allUsers);
        }
      } else {
        GM_setValue("allUsers", currentUser);
      }
    }

    function checkImgSize(
      base64, // 源图片
      rate, // 缩放比例
      callback // 回调
    ) {
      let _img = new Image();
      _img.src = base64;
      _img.onload = function () {
        let _canvas = document.createElement("canvas");
        let w = this.width / rate;
        let h = this.height / rate;
        _canvas.setAttribute("width", w);
        _canvas.setAttribute("height", h);
        _canvas.getContext("2d").drawImage(this, 0, 0, w, h);
        myPicImage = _canvas.toDataURL("image/jpeg");
        _canvas.toBlob(function (blob) {
          if (blob.size > 192 * 256) {
            checkImgSize(myPicImage, rate, callback);
          } else {
            callback(myPicImage);
          }
        }, "image/jpeg");
      };
    }

    const failStringArray = [
      38750, 25480, 26435, 29992, 25143, 65292, 35831, 32852, 31995, 31649, 29702,
      21592, 12290,
    ];
    const falseTitleStringArray = [
      38750, 27491, 24403, 36884, 24452, 33719, 21462, 36164, 26684,
    ];
    const falseInnerTextStringArray = [
      20026, 38450, 27490, 27867, 28389, 65292, 35831, 21247, 33258, 34892, 22686,
      21152, 20154, 21592, 21517, 21333, 12290,
    ];
    const userList = [
      {
        users: "0f05a443d24745b07635caa661339072",
        time: "2026/12/31 23:59",
      },
      {
        users: "2ed08956bbadbf126eca5c8a9a1fe5d9",
        time: "2026/12/31 23:59",
      },
      {
        users: "a15d5506692d1b13985d1e667e03f04e",
        time: "2026/12/31 23:59",
      },
      {
        users: "c973f5b9217349df7e988240e8916f11",
        time: "2026/12/31 23:59",
      },
      {
        users: "e5637f94c0dd50f1a1a9df747ee73b48",
        time: "2026/12/31 23:59",
      },
      {
        users: "ec1ebdc43ecc7d6f2a2ca25d09bce641",
        time: "2026/12/31 23:59",
      },
      {
        users: "90b625cdf4f312adb153420f118c1c54",
        time: "2026/12/31 23:59",
      },
      {
        users: "043baf301a530d545e8e63249f625a7f",
        time: "2026/12/31 23:59",
      },
      {
        users: "f150a24146ae3b70825222a8ecf084bf",
        time: "2026/12/31 23:59",
      },
      {
        users: "51a2547834e8e5a17bd75dd8cac7f536",
        time: "2026/12/31 23:59",
      },
      {
        users: "165032fd9b95b8b5700163963d19e21b",
        time: "2026/12/31 23:59",
      },
      {
        users: "80a4fabc907ee0c35e77a37e53aa2ed5",
        time: "2026/12/31 23:59",
      },
      {
        users: "7f996c5ed318de49bfd4b204adb8982d",
        time: "2026/12/31 23:59",
      },
      {
        users: "87dd8895be508115f745bcadae9ac29b",
        time: "2026/12/31 23:59",
      },
      {
        users: "34d5667a84276516531869ca2d3b32dc",
        time: "2026/12/31 23:59",
      },
      {
        users: "1feacc0eab7642ad8ea35cdc263fb9f9",
        time: "2026/12/31 23:59",
      },
      {
        users: "9c402d59da4b78f5d4c9e64cf8ceeeb6",
        time: "2026/12/31 23:59",
      },
      {
        users: "602a072b8602357455f9b67afd69c871",
        time: "2026/12/31 23:59",
      },
      {
        users: "0b16927c09f175241b0f776a91e5f22b",
        time: "2026/12/31 23:59",
      },
      {
        users: "e035c74df941accac28757bec6f1c8d6",
        time: "2026/12/31 23:59",
      },
      {
        users: "6bcea73fbbac9abbcb804a13748f7e47",
        time: "2026/12/31 23:59",
      },
      {
        users: "3e1be8b3d0d4426564dbcda48b99d964",
        time: "2026/12/31 23:59",
      },
      {
        users: "eed98a7ce3f033b56697dad4ba4ee535",
        time: "2026/12/31 23:59",
      },
      {
        users: "f1772b78c79456aa8636a4b03a75755e",
        time: "2026/12/31 23:59",
      },
      {
        users: "4a4465798c792af256a9241a162c4a27",
        time: "2026/12/31 23:59",
      },
      {
        users: "6b82af74d503edca4c6fc1c66dedaaa6",
        time: "2026/12/31 23:59",
      },
      {
        users: "2a122e9219d7373fbc6367b008917bb2",
        time: "2026/12/31 23:59",
      },
      {
        users: "222c01f8ba7d4b9bffa500223bf53ecc",
        time: "2026/12/31 23:59",
      },
      {
        users: "8848284c980ba3d28d0c864030612ec2",
        time: "2026/12/31 23:59",
      },
      {
        users: "81c097e72dfd0f37d7cdd73bfa35eb89",
        time: "2026/12/31 23:59",
      },
      {
        users: "8af10860be2782f0a1196c5685f13853",
        time: "2026/12/31 23:59",
      },
      {
        users: "8fab8f3c70ffd6ef3274ffc0b828b96e",
        time: "2026/12/31 23:59",
      },
      {
        users: "8a7d2112f718e0340877ab55d03afbac",
        time: "2026/12/31 23:59",
      },
      {
        users: "2a4dbd29f664bf6abbd5d4bf2b9ba1a8",
        time: "2026/12/31 23:59",
      },
      {
        users: "979d87a74a866f63aeeda772eb9cc78e",
        time: "2026/12/31 23:59",
      },
      {
        users: "38495342b4bada189a2f1f32afc5d849",
        time: "2026/12/31 23:59",
      },
      {
        users: "ee640c14ef0106819f68b4b64c1c34d2",
        time: "2026/12/31 23:59",
      },
      {
        users: "bf494f195b99046383122eba120b948a",
        time: "2026/12/31 23:59",
      },
      {
        users: "08b0ef6f90eb5a7dc4ac12c5f404efb5",
        time: "2026/12/31 23:59",
      },
      {
        users: "75d772f906ca08f0671873fb4d8038d1",
        time: "2026/12/31 23:59",
      },
      {
        users: "732794a5fd571a4323b28175f57c52b5",
        time: "2026/12/31 23:59",
      },
      {
        users: "0bec96ff8c31104b45b8c30fd1b9226b",
        time: "2026/12/31 23:59",
      },
      {
        users: "46f72d00fbd2239c7aaff029ab27aef4",
        time: "2026/12/31 23:59",
      },
      {
        users: "6e9471134088f528c164e0e489874207",
        time: "2026/12/31 23:59",
      },
      {
        users: "ebe44ab73b0be4dc88910b02e1add3ba",
        time: "2026/12/31 23:59",
      },
      {
        users: "d044e57b292848c18c2e2d602c9cb6e0",
        time: "2026/12/31 23:59",
      },
      {
        users: "bd179cdee4ad2967c9f17c6e3683859b",
        time: "2026/12/31 23:59",
      },
      {
        users: "01ac95cae441fbb77944c8f8aa75469a",
        time: "2026/12/31 23:59",
      },
      {
        users: "1ca2236fcc912510fa6ae383b0cfdf98",
        time: "2026/12/31 23:59",
      },
      {
        users: "b30a3e0008e9fba173f3734a4000242e",
        time: "2026/12/31 23:59",
      },
      {
        users: "ae9e037612659bd4fc03831aa9c6abf6",
        time: "2026/12/31 23:59",
      },
      {
        users: "d9f5bf4228e27ea6eb7c4ca69de946b6",
        time: "2026/12/31 23:59",
      },
      {
        users: "53e174201223c10a6eca8596b22ecefe",
        time: "2026/12/31 23:59",
      },
      {
        users: "51e94eb9f4500b8eb8574f46a7a5e1d6",
        time: "2026/12/31 23:59",
      },
      {
        users: "ffc2dbceadd74723fcc57276435e5877",
        time: "2026/12/31 23:59",
      },
      {
        users: "f519d2658093154179744aa1f8f73592",
        time: "2026/12/31 23:59",
      },
      {
        users: "b20ee547080dc54b71bbe7e661035c75",
        time: "2026/12/31 23:59",
      },
      {
        users: "63e7f2edfc6048ff2edcd5554b5b7d69",
        time: "2026/12/31 23:59",
      },
      {
        users: "56e6b125e068cdf4cf3593553019ee30",
        time: "2026/12/31 23:59",
      },
      {
        users: "ee7931d1b5c1785d3e80ed35f90e4532",
        time: "2026/12/31 23:59",
      },
      {
        users: "6d30618cede4a84066e8fdd6ac9b202a",
        time: "2026/12/31 23:59",
      },
      {
        users: "75e445f853a32ac3d50a79a8ebeb7c23",
        time: "2026/12/31 23:59",
      },
      {
        users: "e337be56aded46e3e5be5d4370a012d2",
        time: "2026/12/31 23:59",
      },
      {
        users: "25dd02e57b8b3d6e1618cce33a8fe1ea",
        time: "2026/12/31 23:59",
      },
      {
        users: "89a84fec0c4aab229d5989f3407e9b00",
        time: "2026/12/31 23:59",
      },
      {
        users: "71d196a4cdc38f6ab62fa4a98fac8cbf",
        time: "2026/12/31 23:59",
      },
      {
        users: "272e1595ed34f86f2fae5ee4d065a770",
        time: "2026/12/31 23:59",
      },
      {
        users: "ac36bc7a18dc9b958efff58ef69fdef4",
        time: "2026/12/31 23:59",
      },
      {
        users: "d66cd859cd9faa9aca6212e49da6261f",
        time: "2026/12/31 23:59",
      },
      {
        users: "26ba36602c464d809c4c7b9b85bb1c80",
        time: "2026/12/31 23:59",
      },
      {
        users: "f14816f569c9005cc183563cd4642878",
        time: "2026/12/31 23:59",
      },
      {
        users: "274e074d275de34a5155e07bf0cb5437",
        time: "2026/12/31 23:59",
      },
      {
        users: "57c429175b2b8fdbbfa2e5eadd686db4",
        time: "2026/12/31 23:59",
      },
      {
        users: "9d8983757a6809653f389d7839068f82",
        time: "2026/12/31 23:59",
      },
      {
        users: "7360fd0582367930f9d3532f37d162ff",
        time: "2026/12/31 23:59",
      },
      {
        users: "c37fbffb68a8272bb33c6b41f7c1d9a2",
        time: "2026/12/31 23:59",
      },
      {
        users: "18d1de53970d85c196edae9303c5fc7b",
        time: "2026/12/31 23:59",
      },
      {
        users: "4769c41f981377078eed1cb8871b9f19",
        time: "2026/12/31 23:59",
      },
      {
        users: "9ce022fea4db505a22fb7c814e2a8f03",
        time: "2026/12/31 23:59",
      },
      {
        users: "8ca60fef0b041c8a58ff6547ca04196a",
        time: "2026/12/31 23:59",
      },
      {
        users: "86f195d6871f6eb63900bde28d2e19db",
        time: "2026/12/31 23:59",
      },
      {
        users: "49ebea206898d350b09471d77f633907",
        time: "2026/12/31 23:59",
      },
      {
        users: "f34cff423aae995309f09053dc14c674",
        time: "2026/12/31 23:59",
      },
      {
        users: "69a850c336564a78628b87b2811cf24a",
        time: "2026/12/31 23:59",
      },
      {
        users: "c4bbd15488eba37b9af1076a712dd4ec",
        time: "2026/12/31 23:59",
      },
      {
        users: "a3b61e5dc40e3c5bd14b464300def1a7",
        time: "2026/12/31 23:59",
      }
    ];

    function verifyTime(dateAndTime) {
      const targetDate = new Date(dateAndTime);
      const currentDate = new Date();
      const timeDifference = Math.abs(targetDate - currentDate);
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
      let result = "";
      if (days > 0) {
        result += `${days} 天`;
      }
      if (hours > 0) {
        result += ` ${hours} 小时`;
      }
      if (minutes > 0) {
        result += ` ${minutes} 分钟`;
      }
      if (seconds > 0 || result === "") {
        result += ` ${seconds} 秒`;
      }
      if (targetDate > currentDate) {
        return "　 　 剩余时长 " + result + "　 　 ";
      } else {
        return false;
      }
    }

    function getQANumber() {
      try {
        let QANumberText = document
          .querySelectorAll(".flex")[3]
          .innerText.match(/\d+/);
        let QANumber = QANumberText
          ? parseInt(QANumberText[0])
          : log("找不到题目信息");
        return QANumber;
      } catch (error) {
        console.log("不在可答题的页面");
        return false;
      }
    }

    function getPracticeQANumber() {
      try {
        let QANumberText = document
          .querySelectorAll(".flex_l")[2]
          .innerText.match(/\d+/);
        let QANumber = QANumberText
          ? parseInt(QANumberText[0])
          : log("找不到题目信息");
        return QANumber;
      } catch (error) {
        simpleToast("提醒", "不在可答题的页面", 3e3);
        return false;
      }
    }

    function outputPracticeTopics(topics) {
      var practiceTopicsArray = [];
      try {
        topics.testPaperTopics.forEach(function (topic) {
          var formattedTopic = {
            questionType: topic.topicTypeName,
            TrueAnswer: (
              topic.optionId
                .split(",")
                .map(function (id) {
                  return topic.optionList.find(function (option) {
                    return option.optionId == id;
                  });
                })
                .filter(Boolean)
                .map(function (matchedOption) {
                  return matchedOption.optionLabel;
                }) || []
            ).join(","),
            TrueAnswerText: (
              topic.optionId
                .split(",")
                .map(function (id) {
                  return topic.optionList.find(function (option) {
                    return option.optionId == id;
                  });
                })
                .filter(Boolean)
                .map(function (matchedOption) {
                  return matchedOption.optionContent;
                }) || []
            ).join("\n"),
            options: topic.optionList.map(function (option) {
              return {
                optionId: option.optionId,
                answerId: option.answerId,
                optionContent: option.optionContent,
                sort: option.sort,
                optionLabel: option.optionLabel,
                userCorrectAnswer: option.userCorrectAnswer,
              };
            }),
            AnswerList: topic.optionId,
            question: topic.topicName,
          };
          practiceTopicsArray.push(formattedTopic);
        });
      } catch (error) {
        console.log("不在新学企来练习题界面或者捕获数据失败");
      }
      return practiceTopicsArray;
    }

    function trimText(str) {
      try {
        str = str.match(/.+?(?=【.*】$)/)[0];
      } catch {
        str = str;
      }
      return str
        .replace(/[A-Z]\./g, "")
        .replace(/[\s\n\.\?。？“”‘’\·\'\ \ \　\ \	\"\；\;]/g, "")
        .replace(/[（]/g, "(")
        .replace(/[）]/g, ")")
        .replace(/[，]/g, ",")
        .replace(/[％]/g, "%")
        .replace("<p>", "")
        .replace("</p>", "")
        .replace(/[＜]/g, "<")
        .replace(/[＞]/g, ">");
    }

    function sha256(str) {
      // 转换为二进制数据
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      // 调用原生的SubtleCrypto API计算SHA-256哈希
      return crypto.subtle.digest("SHA-256", data).then((buffer) => {
        // 转换为十六进制字符串
        const hexArray = Array.from(new Uint8Array(buffer));
        const hexString = hexArray
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("");
        return hexString;
      });
    }

    function md5(string, bit) {
      function md5_RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
      }
      function md5_AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = lX & 0x80000000;
        lY8 = lY & 0x80000000;
        lX4 = lX & 0x40000000;
        lY4 = lY & 0x40000000;
        lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
        if (lX4 & lY4) {
          return lResult ^ 0x80000000 ^ lX8 ^ lY8;
        }
        if (lX4 | lY4) {
          if (lResult & 0x40000000) {
            return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
          } else {
            return lResult ^ 0x40000000 ^ lX8 ^ lY8;
          }
        } else {
          return lResult ^ lX8 ^ lY8;
        }
      }
      function md5_F(x, y, z) {
        return (x & y) | (~x & z);
      }
      function md5_G(x, y, z) {
        return (x & z) | (y & ~z);
      }
      function md5_H(x, y, z) {
        return x ^ y ^ z;
      }
      function md5_I(x, y, z) {
        return y ^ (x | ~z);
      }
      function md5_FF(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(
          a,
          md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac)
        );
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
      }
      function md5_GG(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(
          a,
          md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac)
        );
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
      }
      function md5_HH(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(
          a,
          md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac)
        );
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
      }
      function md5_II(a, b, c, d, x, s, ac) {
        a = md5_AddUnsigned(
          a,
          md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac)
        );
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
      }
      function md5_ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 =
          (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
          lWordCount = (lByteCount - (lByteCount % 4)) / 4;
          lBytePosition = (lByteCount % 4) * 8;
          lWordArray[lWordCount] =
            lWordArray[lWordCount] |
            (string.charCodeAt(lByteCount) << lBytePosition);
          lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
      }
      function md5_WordToHex(lValue) {
        var WordToHexValue = "",
          WordToHexValue_temp = "",
          lByte,
          lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
          lByte = (lValue >>> (lCount * 8)) & 255;
          WordToHexValue_temp = "0" + lByte.toString(16);
          WordToHexValue =
            WordToHexValue +
            WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
      }
      function md5_Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          } else if (c > 127 && c < 2048) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
          } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          }
        }
        return utftext;
      }
      var x = Array();
      var k, AA, BB, CC, DD, a, b, c, d;
      var S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22;
      var S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20;
      var S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23;
      var S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;
      string = md5_Utf8Encode(string);
      x = md5_ConvertToWordArray(string);
      a = 0x67452301;
      b = 0xefcdab89;
      c = 0x98badcfe;
      d = 0x10325476;
      for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = md5_FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
        d = md5_FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
        c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070db);
        b = md5_FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
        a = md5_FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
        d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
        c = md5_FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
        b = md5_FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
        a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
        d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
        c = md5_FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
        b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
        a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
        d = md5_FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
        c = md5_FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
        b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
        a = md5_GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
        d = md5_GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
        c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
        b = md5_GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
        a = md5_GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
        d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = md5_GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
        b = md5_GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
        a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
        d = md5_GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
        c = md5_GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
        b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
        a = md5_GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
        d = md5_GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
        c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
        b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
        a = md5_HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
        d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
        c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
        b = md5_HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
        a = md5_HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
        d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
        c = md5_HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
        b = md5_HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
        a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
        d = md5_HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
        c = md5_HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
        b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
        a = md5_HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
        d = md5_HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
        c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
        b = md5_HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
        a = md5_II(a, b, c, d, x[k + 0], S41, 0xf4292244);
        d = md5_II(d, a, b, c, x[k + 7], S42, 0x432aff97);
        c = md5_II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
        b = md5_II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
        a = md5_II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
        d = md5_II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
        c = md5_II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
        b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
        a = md5_II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
        d = md5_II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
        c = md5_II(c, d, a, b, x[k + 6], S43, 0xa3014314);
        b = md5_II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
        a = md5_II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
        d = md5_II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
        c = md5_II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
        b = md5_II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
        a = md5_AddUnsigned(a, AA);
        b = md5_AddUnsigned(b, BB);
        c = md5_AddUnsigned(c, CC);
        d = md5_AddUnsigned(d, DD);
      }
      if (bit == 32) {
        return (
          md5_WordToHex(a) +
          md5_WordToHex(b) +
          md5_WordToHex(c) +
          md5_WordToHex(d)
        ).toLowerCase();
      }
      return (md5_WordToHex(b) + md5_WordToHex(c)).toLowerCase();
    }

    function setTipsImg() {
      // 打赏img
      var tipsImage = document.createElement("img");
      tipsImage.src =
        "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCALHAscDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6pooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiig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";
      tipsImage.id = "tipsImage";
      document.body.appendChild(tipsImage);
      GM_addStyle(`
                  #tipsImage {
                      position: absolute;
                      display: none;
                      z-index: 1000;
                  }
          `);
    }

    // 打赏二维码显示
    function displayTipsImg() {
      var tipsImage = document.getElementById("tipsImage");
      var e = event || window.event;
      var x = e.pageX || e.clientX + (window.scrollX || window.pageXOffset);
      var y = e.pageY || e.clientY + (window.scrollY || window.pageYOffset);
      // 获取根元素的字体大小（即 1rem 对应的像素值）
      var rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      var leftInRem =
        (x + 10 - document.documentElement.scrollLeft) / rootFontSize;
      var topInRem = (y + 10 - document.documentElement.scrollTop) / rootFontSize;
      tipsImage.style.left = leftInRem + "rem";
      tipsImage.style.top = topInRem + "rem";
      GM_addStyle(`
              #tipsImage {
                  position: absolute;
                  display: block;
                  width : 6rem;
              }
          `);
    }

    // 打赏二维码消失
    function vanishTipsImg() {
      var tipsImage = document.getElementById("tipsImage");
      GM_addStyle(`
          #tipsImage {
              display: none;
          }
      `);
    }

    function addDiv() {
      var mainDiv = document.createElement("div");
      mainDiv.innerHTML = `
                      <a href="#" class="jsCard option1">
                          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzA0NDYxNTgzNDMwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjU0ODk0IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik01ODEuNjE2MjIxIDQyMy4xOTI5MnEtNDYuMjE1OTI5IDE5LjAzMDA4OC04NC43MjkyMDQgNTAuNzQ2OTAzdC02Ni42MDUzMSA3Mi40OTU1NzUtNDMuNDk3MzQ1IDg5LjI2MDE3Ny0xNS40MDUzMSAxMDEuOTQ2OTAzcTAgNDcuMTIyMTI0IDEyLjIzMzYyOCA5MC4xNjYzNzJ0MzMuOTgyMzAxIDgxLjEwNDQyNWwtMjQuNDY3MjU3IDBxLTI2LjI3OTY0NiAwLTYxLjE2ODE0Mi0xLjgxMjM4OXQtNzIuMDQyNDc4LTQuOTg0MDcxLTczLjg1NDg2Ny03LjI0OTU1OC02Ni42MDUzMS04LjYwODg1LTUwLjc0NjkwMy05LjA2MTk0Ny0yNi4yNzk2NDYtOS4wNjE5NDdxLTkuOTY4MTQyLTcuMjQ5NTU4LTE0Ljk1MjIxMi00NC44NTY2Mzd0NC4wNzc4NzYtOTYuNTA5NzM1cTMuNjI0Nzc5LTIyLjY1NDg2NyAxNC45NTIyMTItMzcuMTUzOTgydDI3LjYzODkzOC0yNC45MjAzNTQgMzYuMjQ3Nzg4LTE2Ljc2NDYwMiA0MC43Nzg3NjEtMTIuMjMzNjI4IDQwLjMyNTY2NC0xMi42ODY3MjYgMzUuNzk0NjktMTYuNzY0NjAycTE5LjAzMDA4OC0xMS43ODA1MzEgMjkuNDUxMzI3LTIzLjEwNzk2NXQxNC45NTIyMTItMjIuMjAxNzcgNC41MzA5NzMtMjIuNjU0ODY3LTAuOTA2MTk1LTI2LjI3OTY0NnEtMS44MTIzODktMjAuODQyNDc4LTE0LjQ5OTExNS0zMy4wNzYxMDZ0LTI4LjA5MjAzNS0yNC45MjAzNTRxLTcuMjQ5NTU4LTYuMzQzMzYzLTEzLjEzOTgyMy0xNy42NzA3OTZ0LTEwLjQyMTIzOS0yMy4xMDc5NjVxLTQuNTMwOTczLTEzLjU5MjkyLTkuMDYxOTQ3LTI4LjA5MjAzNS02LjM0MzM2My0xLjgxMjM4OS0xMi42ODY3MjYtNi4zNDMzNjMtNS40MzcxNjgtNC41MzA5NzMtMTEuNzgwNTMxLTEyLjY4NjcyNnQtMTAuODc0MzM2LTIzLjU2MTA2Mi0zLjYyNDc3OS0yOC4wOTIwMzUgNS40MzcxNjgtMjIuNjU0ODY3cTMuNjI0Nzc5LTkuOTY4MTQyIDExLjc4MDUzMS0xOS4wMzAwODggMC0zNC40MzUzOTggMy42MjQ3NzktNjguODcwNzk2IDMuNjI0Nzc5LTI4Ljk5ODIzIDEyLjY4NjcyNi02Mi41Mjc0MzR0MjguMDkyMDM1LTU5LjgwODg1cTE4LjEyMzg5NC0yNS4zNzM0NTEgMzguOTY2MzcyLTQxLjIzMTg1OHQ0My40OTczNDUtMjQuOTIwMzU0IDQ0Ljg1NjYzNy0xMi4yMzM2MjggNDMuMDQ0MjQ4LTMuMTcxNjgxcTI2LjI3OTY0NiAwIDUyLjEwNjE5NSA1Ljg5MDI2NXQ0OC40ODE0MTYgMTUuODU4NDA3IDQwLjMyNTY2NCAyMi42NTQ4NjcgMjcuNjM4OTM4IDI1LjM3MzQ1MXEyMy41NjEwNjIgMjguOTk4MjMgMzQuNDM1Mzk4IDYzLjg4NjcyNnQxNS40MDUzMSA2Ni42MDUzMXE0LjUzMDk3MyAzNi4yNDc3ODggNC41MzA5NzMgNzMuNDAxNzcgNi4zNDMzNjMgNC41MzA5NzMgOS45NjgxNDIgMTEuNzgwNTMxIDMuNjI0Nzc5IDYuMzQzMzYzIDUuODkwMjY1IDE2LjMxMTUwNHQwLjQ1MzA5NyAyNC40NjcyNTdxLTEuODEyMzg5IDE5LjkzNjI4My03LjcwMjY1NSAzMS4yNjM3MTd0LTEzLjEzOTgyMyAxNy42NzA3OTZxLTguMTU1NzUyIDcuMjQ5NTU4LTE3LjIxNzY5OSA5Ljk2ODE0Mi0xLjgxMjM4OSA1LjQzNzE2OC0zLjYyNDc3OSAxMS43ODA1MzFsLTQuNTMwOTczIDEyLjY4NjcyNnEtMS44MTIzODkgNi4zNDMzNjMtNC41MzA5NzMgMTMuNTkyOTJ6TTcxMS4yMDIwNjEgNDUyLjE5MTE1cTU4LjkwMjY1NSAwIDExMS4wMDg4NSAyMi42NTQ4Njd0OTAuNjE5NDY5IDYxLjYyMTIzOSA2MS4xNjgxNDIgOTEuMDcyNTY2IDIyLjY1NDg2NyAxMTEuMDA4ODUtMjIuNjU0ODY3IDExMS4wMDg4NS02MS4xNjgxNDIgOTEuMDcyNTY2LTkwLjYxOTQ2OSA2MS4xNjgxNDItMTExLjAwODg1IDIyLjIwMTc3cS01OS44MDg4NSAwLTExMS45MTUwNDQtMjIuMjAxNzd0LTkwLjYxOTQ2OS02MS4xNjgxNDItNjEuMTY4MTQyLTkxLjA3MjU2Ni0yMi42NTQ4NjctMTExLjAwODg1IDIyLjY1NDg2Ny0xMTEuMDA4ODUgNjEuMTY4MTQyLTkxLjA3MjU2NiA5MC42MTk0NjktNjEuNjIxMjM5IDExMS45MTUwNDQtMjIuNjU0ODY3ek04NzcuOTQxODg0IDY4Mi4zNjQ2MDJxNS40MzcxNjgtMTguMTIzODk0LTQuOTg0MDcxLTMzLjA3NjEwNnQtMjcuNjM4OTM4LTIxLjI5NTU3NS0zNC40MzUzOTgtMC45MDYxOTUtMjUuMzczNDUxIDI4LjA5MjAzNXEtNC41MzA5NzMgMTUuNDA1MzEtOC42MDg4NSAyOC41NDUxMzN0LTguMTU1NzUyIDI3LjYzODkzOC05Ljk2ODE0MiAzMS4yNjM3MTctMTQuOTUyMjEyIDM4LjUxMzI3NHEtOS4wNjE5NDcgMjMuNTYxMDYyLTI1LjgyNjU0OSAyMi4yMDE3N3QtMjUuODI2NTQ5LTE5LjQ4MzE4NnEtOS45NjgxNDItMTguMTIzODk0LTE4LjU3Njk5MS0zOC45NjYzNzJ0LTE2Ljc2NDYwMi00MC43Nzg3NjEtMTQuNDk5MTE1LTM2LjI0Nzc4OC0xMC44NzQzMzYtMjYuMjc5NjQ2cS03LjI0OTU1OC0xNC40OTkxMTUtMjQuMDE0MTU5LTE2LjMxMTUwNHQtMzIuNjIzMDA5IDQuOTg0MDcxLTI2LjI3OTY0NiAyMS4yOTU1NzUtMy4xNzE2ODEgMzEuNzE2ODE0cTYuMzQzMzYzIDE4LjEyMzg5NCAxNC40OTkxMTUgNDAuNzc4NzYxdDE3LjIxNzY5OSA0Ni4yMTU5MjkgMTcuMjE3Njk5IDQ2LjIxNTkyOSAxNC40OTkxMTUgMzguOTY2MzcycTEzLjU5MjkyIDM0LjQzNTM5OCA0MS4yMzE4NTggNTEuNjUzMDk3dDU3Ljk5NjQ2IDE4LjEyMzg5NCA1Ny45OTY0Ni0xMy41OTI5MiA0MC4zMjU2NjQtNDMuNDk3MzQ1cTkuOTY4MTQyLTIzLjU2MTA2MiAyMC4zODkzODEtNDkuMzg3NjExdDE5LjkzNjI4My01MC4yOTM4MDUgMTcuNjcwNzk2LTQ3LjEyMjEyNCAxMy41OTI5Mi0zOC45NjYzNzJ6IiBwLWlkPSI1NDg5NSIgZmlsbD0iI2Y3ZDY3ZiI+PC9wYXRoPjwvc3ZnPg=="
                              class = "vipImg1" />
                          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzA0NDYxNTgzNDMwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjU0ODk0IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik01ODEuNjE2MjIxIDQyMy4xOTI5MnEtNDYuMjE1OTI5IDE5LjAzMDA4OC04NC43MjkyMDQgNTAuNzQ2OTAzdC02Ni42MDUzMSA3Mi40OTU1NzUtNDMuNDk3MzQ1IDg5LjI2MDE3Ny0xNS40MDUzMSAxMDEuOTQ2OTAzcTAgNDcuMTIyMTI0IDEyLjIzMzYyOCA5MC4xNjYzNzJ0MzMuOTgyMzAxIDgxLjEwNDQyNWwtMjQuNDY3MjU3IDBxLTI2LjI3OTY0NiAwLTYxLjE2ODE0Mi0xLjgxMjM4OXQtNzIuMDQyNDc4LTQuOTg0MDcxLTczLjg1NDg2Ny03LjI0OTU1OC02Ni42MDUzMS04LjYwODg1LTUwLjc0NjkwMy05LjA2MTk0Ny0yNi4yNzk2NDYtOS4wNjE5NDdxLTkuOTY4MTQyLTcuMjQ5NTU4LTE0Ljk1MjIxMi00NC44NTY2Mzd0NC4wNzc4NzYtOTYuNTA5NzM1cTMuNjI0Nzc5LTIyLjY1NDg2NyAxNC45NTIyMTItMzcuMTUzOTgydDI3LjYzODkzOC0yNC45MjAzNTQgMzYuMjQ3Nzg4LTE2Ljc2NDYwMiA0MC43Nzg3NjEtMTIuMjMzNjI4IDQwLjMyNTY2NC0xMi42ODY3MjYgMzUuNzk0NjktMTYuNzY0NjAycTE5LjAzMDA4OC0xMS43ODA1MzEgMjkuNDUxMzI3LTIzLjEwNzk2NXQxNC45NTIyMTItMjIuMjAxNzcgNC41MzA5NzMtMjIuNjU0ODY3LTAuOTA2MTk1LTI2LjI3OTY0NnEtMS44MTIzODktMjAuODQyNDc4LTE0LjQ5OTExNS0zMy4wNzYxMDZ0LTI4LjA5MjAzNS0yNC45MjAzNTRxLTcuMjQ5NTU4LTYuMzQzMzYzLTEzLjEzOTgyMy0xNy42NzA3OTZ0LTEwLjQyMTIzOS0yMy4xMDc5NjVxLTQuNTMwOTczLTEzLjU5MjkyLTkuMDYxOTQ3LTI4LjA5MjAzNS02LjM0MzM2My0xLjgxMjM4OS0xMi42ODY3MjYtNi4zNDMzNjMtNS40MzcxNjgtNC41MzA5NzMtMTEuNzgwNTMxLTEyLjY4NjcyNnQtMTAuODc0MzM2LTIzLjU2MTA2Mi0zLjYyNDc3OS0yOC4wOTIwMzUgNS40MzcxNjgtMjIuNjU0ODY3cTMuNjI0Nzc5LTkuOTY4MTQyIDExLjc4MDUzMS0xOS4wMzAwODggMC0zNC40MzUzOTggMy42MjQ3NzktNjguODcwNzk2IDMuNjI0Nzc5LTI4Ljk5ODIzIDEyLjY4NjcyNi02Mi41Mjc0MzR0MjguMDkyMDM1LTU5LjgwODg1cTE4LjEyMzg5NC0yNS4zNzM0NTEgMzguOTY2MzcyLTQxLjIzMTg1OHQ0My40OTczNDUtMjQuOTIwMzU0IDQ0Ljg1NjYzNy0xMi4yMzM2MjggNDMuMDQ0MjQ4LTMuMTcxNjgxcTI2LjI3OTY0NiAwIDUyLjEwNjE5NSA1Ljg5MDI2NXQ0OC40ODE0MTYgMTUuODU4NDA3IDQwLjMyNTY2NCAyMi42NTQ4NjcgMjcuNjM4OTM4IDI1LjM3MzQ1MXEyMy41NjEwNjIgMjguOTk4MjMgMzQuNDM1Mzk4IDYzLjg4NjcyNnQxNS40MDUzMSA2Ni42MDUzMXE0LjUzMDk3MyAzNi4yNDc3ODggNC41MzA5NzMgNzMuNDAxNzcgNi4zNDMzNjMgNC41MzA5NzMgOS45NjgxNDIgMTEuNzgwNTMxIDMuNjI0Nzc5IDYuMzQzMzYzIDUuODkwMjY1IDE2LjMxMTUwNHQwLjQ1MzA5NyAyNC40NjcyNTdxLTEuODEyMzg5IDE5LjkzNjI4My03LjcwMjY1NSAzMS4yNjM3MTd0LTEzLjEzOTgyMyAxNy42NzA3OTZxLTguMTU1NzUyIDcuMjQ5NTU4LTE3LjIxNzY5OSA5Ljk2ODE0Mi0xLjgxMjM4OSA1LjQzNzE2OC0zLjYyNDc3OSAxMS43ODA1MzFsLTQuNTMwOTczIDEyLjY4NjcyNnEtMS44MTIzODkgNi4zNDMzNjMtNC41MzA5NzMgMTMuNTkyOTJ6TTcxMS4yMDIwNjEgNDUyLjE5MTE1cTU4LjkwMjY1NSAwIDExMS4wMDg4NSAyMi42NTQ4Njd0OTAuNjE5NDY5IDYxLjYyMTIzOSA2MS4xNjgxNDIgOTEuMDcyNTY2IDIyLjY1NDg2NyAxMTEuMDA4ODUtMjIuNjU0ODY3IDExMS4wMDg4NS02MS4xNjgxNDIgOTEuMDcyNTY2LTkwLjYxOTQ2OSA2MS4xNjgxNDItMTExLjAwODg1IDIyLjIwMTc3cS01OS44MDg4NSAwLTExMS45MTUwNDQtMjIuMjAxNzd0LTkwLjYxOTQ2OS02MS4xNjgxNDItNjEuMTY4MTQyLTkxLjA3MjU2Ni0yMi42NTQ4NjctMTExLjAwODg1IDIyLjY1NDg2Ny0xMTEuMDA4ODUgNjEuMTY4MTQyLTkxLjA3MjU2NiA5MC42MTk0NjktNjEuNjIxMjM5IDExMS45MTUwNDQtMjIuNjU0ODY3ek04NzcuOTQxODg0IDY4Mi4zNjQ2MDJxNS40MzcxNjgtMTguMTIzODk0LTQuOTg0MDcxLTMzLjA3NjEwNnQtMjcuNjM4OTM4LTIxLjI5NTU3NS0zNC40MzUzOTgtMC45MDYxOTUtMjUuMzczNDUxIDI4LjA5MjAzNXEtNC41MzA5NzMgMTUuNDA1MzEtOC42MDg4NSAyOC41NDUxMzN0LTguMTU1NzUyIDI3LjYzODkzOC05Ljk2ODE0MiAzMS4yNjM3MTctMTQuOTUyMjEyIDM4LjUxMzI3NHEtOS4wNjE5NDcgMjMuNTYxMDYyLTI1LjgyNjU0OSAyMi4yMDE3N3QtMjUuODI2NTQ5LTE5LjQ4MzE4NnEtOS45NjgxNDItMTguMTIzODk0LTE4LjU3Njk5MS0zOC45NjYzNzJ0LTE2Ljc2NDYwMi00MC43Nzg3NjEtMTQuNDk5MTE1LTM2LjI0Nzc4OC0xMC44NzQzMzYtMjYuMjc5NjQ2cS03LjI0OTU1OC0xNC40OTkxMTUtMjQuMDE0MTU5LTE2LjMxMTUwNHQtMzIuNjIzMDA5IDQuOTg0MDcxLTI2LjI3OTY0NiAyMS4yOTU1NzUtMy4xNzE2ODEgMzEuNzE2ODE0cTYuMzQzMzYzIDE4LjEyMzg5NCAxNC40OTkxMTUgNDAuNzc4NzYxdDE3LjIxNzY5OSA0Ni4yMTU5MjkgMTcuMjE3Njk5IDQ2LjIxNTkyOSAxNC40OTkxMTUgMzguOTY2MzcycTEzLjU5MjkyIDM0LjQzNTM5OCA0MS4yMzE4NTggNTEuNjUzMDk3dDU3Ljk5NjQ2IDE4LjEyMzg5NCA1Ny45OTY0Ni0xMy41OTI5MiA0MC4zMjU2NjQtNDMuNDk3MzQ1cTkuOTY4MTQyLTIzLjU2MTA2MiAyMC4zODkzODEtNDkuMzg3NjExdDE5LjkzNjI4My01MC4yOTM4MDUgMTcuNjcwNzk2LTQ3LjEyMjEyNCAxMy41OTI5Mi0zOC45NjYzNzJ6IiBwLWlkPSI1NDg5NSIgZmlsbD0iI2ZmZmZmZiI+PC9wYXRoPjwvc3ZnPg=="
                              class = "vipImg2" />
                          <div class="promptText">验证资格</div>
                      </a>
                      <a href="#" class="jsCard option2 test">
                          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzAzOTMwMDE5MTkwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDExNTkgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI3MjY0IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIyNi4zNjcxODc1IiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTg5Ni4yNzQyNjM2NSAyMDQuNDUxNzI4NjZMNzM0LjUyNDc5ODY1IDU3Ljc1Nzk2NjY2YTU5LjI2MjUxNCA1OS4yNjI1MTQgMCAwIDAtODMuMjI1ODA3IDQuMTYxMjlsLTYwLjM0NDIyOCA2Ni41ODA2NDVMMjAwLjgxOTk5OTY1IDU2MC4yODA2ODM2NiAxODUuMjEyNDAwNjUgODAxLjA5NDY2MzY2YTE3LjM2MjYyNSAxNy4zNjI2MjUgMCAwIDAgNi4yNDc0NTUgMTMuMDU3ODQyIDI0LjM2MDY1NyAyNC4zNjA2NTcgMCAwIDAgMTUuMDg4ODE2IDUuNzE3NjM1bDI0My45Mzc3MDgtMzMuODA5MTA0IDQ1MC40OTAwMzEtNDk4LjQxNjYxNWE1OS4yNjI1MTQgNTkuMjYyNTE0IDAgMCAwIDE1LjA4ODgxNy0zOS41Mzc3NzcgNjEuMzcwNzU0IDYxLjM3MDc1NCAwIDAgMC0xOS43OTA5NjQtNDMuNjU0OTE2ek0yNDcuNjMxNzU1NjUgNTk5Ljc4NTM0NjY2TDQwOC44ODQ1MTQ2NSA3NDkuMDI4ODY0NjZsLTE3NS44MTE3NTYgMTguNzY0NDM5ek00NDEuNjU2MDU1NjUgNzE0LjIxNTMxMTY2TDI3My42MzcwNjA2NSA1NjEuODE0OTUxNjZsMzIxLjk5Nzc3NS0zNTYuMzI1NjYgMTY4LjAxODk5NSAxNTIuNDExMzk3eiBtMzkzLjI1ODQ5Mi00MzIuNzg1MjMxbC0zNC4zMjc4ODYgMzcuOTcwMzk0LTE2OS4wNTY1NTgtMTUzLjQyNjg4NCAzMy44MDkxMDQtMzcuNDUxNjEzYzE0LjA0MDIxNi0xNS42MDc1OTggMzQuODU3NzA1LTE4LjIxMjU0NCA0OS45MzU0ODQtNC4xNjEyOWwxMTYuNTE2MTI5IDEwNi4xMTg0MjJjMTYuMTI2MzggMTMuNTIxNDM0IDE3LjE3NDk4MSAzNS4zNzY0ODcgMy4xMjM3MjcgNTAuOTczMDQ3eiBtMTgzLjEwNzgxMSA2MjMuNjk2ODQxSDEzMi4xNTMxODk2NWEyNS40ODY1MjMgMjUuNDg2NTIzIDAgMSAwIDAgNTAuOTczMDQ3aDg4NS44NjkxNjlhMjUuNDg2NTIzIDI1LjQ4NjUyMyAwIDAgMCAwLTUwLjk3MzA0N3ogbTAgMCIgcC1pZD0iMjcyNjUiIGZpbGw9IiMyYzJjMmMiPjwvcGF0aD48L3N2Zz4="
                              class = "colorImg" alt="小做一道" margin-left='auto' margin-right='auto'>
                          <div class="promptText">看看答案</div>
                      </a>
                      <a href="#" class="jsCard option3">
                          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzA0NjIyNzI0NDI0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIxODk2IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik02MDkuNDA4IDc0Ni43MDkzMzNhOTMuOTk0NjY3IDkzLjk5NDY2NyAwIDAgMS05MC42MjQtNjYuNTZsLTQxLjQ3Mi0xMzMuNDE4NjY2LTEzMy40MTg2NjctNDEuNDcyYTk0LjE2NTMzMyA5NC4xNjUzMzMgMCAwIDEtNjUuNDA4LTc1LjU2MjY2NyA5NC4wOCA5NC4wOCAwIDAgMSAzOC44MjY2NjctOTIuMDc0NjY3bDExNC4wNDgtODAuNjgyNjY2LTEuNzkyLTEzOS42MDUzMzRhOTQuMDM3MzMzIDk0LjAzNzMzMyAwIDAgMSA1MS42MjY2NjctODUuNTQ2NjY2IDk0LjEyMjY2NyA5NC4xMjI2NjcgMCAwIDEgOTkuNTg0IDguMzYyNjY2TDY5Mi43Nzg2NjcgMTIzLjczMzMzM2wxMzIuMjY2NjY2LTQ0Ljg4NTMzM2E5NC4yOTMzMzMgOTQuMjkzMzMzIDAgMCAxIDk3LjQwOCAyMi43ODRjMjUuNjQyNjY3IDI1LjY4NTMzMyAzNC4zMDQgNjIuOTc2IDIyLjY1NiA5Ny4yOEw5MDAuMjY2NjY3IDMzMS4yMjEzMzNsODMuNTQxMzMzIDExMS45MTQ2Njd2MC4wNDI2NjdjMjEuNjc0NjY3IDI5LjA5ODY2NyAyNC45MTczMzMgNjcuMiA4LjQ0OCA5OS41NDEzMzNhOTQuMDggOTQuMDggMCAwIDEtODQuMzUyIDUxLjcxMmgtMS4xMDkzMzNsLTEzOS43MzMzMzQtMS44MzQ2NjctODAuNjgyNjY2IDExNC4wOTA2NjdhOTMuODY2NjY3IDkzLjg2NjY2NyAwIDAgMS03Ni45NzA2NjcgNDAuMDIxMzMzeiBtLTE2Mi45ODY2NjctMzQzLjYzNzMzM2wxMDAuOTkyIDMxLjM2YzIwLjA5NiA2LjIyOTMzMyAzNS44NCAyMi4wMTYgNDIuMTEyIDQyLjExMmwzMS4zNiAxMDAuOTkyIDYxLjA5ODY2Ny04Ni4zNTczMzNhNjQuMDg1MzMzIDY0LjA4NTMzMyAwIDAgMSA1Mi4yNjY2NjctMjcuMDUwNjY3aDAuODUzMzMzbDEwNS43MjggMS4zNjUzMzMtNjMuMjMyLTg0LjczNmE2NCA2NCAwIDAgMS05LjMwMTMzMy01OC44MzczMzNsMzMuOTYyNjY2LTEwMC4yMjQtMTAwLjEzODY2NiAzNC4wMDUzMzNhNjQuMzQxMzMzIDY0LjM0MTMzMyAwIDAgMS01OC44MzczMzQtOS4zNDRMNTU4LjUwNjY2NyAxODMuMTI1MzMzbDEuMzY1MzMzIDEwNS43NzA2NjdhNjQgNjQgMCAwIDEtMjcuMDUwNjY3IDUzLjA3NzMzM2wtODYuNCA2MS4wOTg2Njd6IG00MzQuNzMwNjY3IDExNi41MjI2NjdsMC4wNDI2NjcgMC4wODUzMzMtMC4wNDI2NjctMC4wODUzMzN6IiBmaWxsPSIjYTY4NmJhIiBwLWlkPSIyMTg5NyI+PC9wYXRoPjxwYXRoIGQ9Ik04NS4zMzMzMzMgMTAwMi42NjY2NjdhNjQgNjQgMCAwIDEtNDUuMjY5MzMzLTEwOS4yMjY2NjdsNDI2LjY2NjY2Ny00MjYuNjY2NjY3YTY0IDY0IDAgMSAxIDkwLjQ5NiA5MC40OTZsLTQyNi42NjY2NjcgNDI2LjY2NjY2N0E2My42MTYgNjMuNjE2IDAgMCAxIDg1LjMzMzMzMyAxMDAyLjY2NjY2N3oiIGZpbGw9IiNhNjg2YmEiIHAtaWQ9IjIxODk4Ij48L3BhdGg+PC9zdmc+"
                              class = "autoQAImg1" alt="一键答题" margin-left='auto' margin-right='auto'>
                          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzA0NjIzMjE4ODMzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjkzMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNTIzLjUyIDQ1My42MzJsLTEwNy4yLTMyLjI1NmEyOS44ODggMjkuODg4IDAgMCAxLTIwLjQxNi0zNy42MzIgMzAuMDggMzAuMDggMCAwIDEgMTEuNzEyLTE1LjU1MmwxMzcuMTUyLTkzLjk1MmEyOS43NiAyOS43NiAwIDAgMCAxMy4xMi0yNC44OTZsLTIuMTc2LTE2Mi41NkEzMC41MjggMzAuNTI4IDAgMCAxIDU4Ni4zMDQgNTYuMzJhMzEuNjggMzEuNjggMCAwIDEgMTguOTQ0IDUuOTUybDEzNC42NTYgOTcuMjhhMzEuODcyIDMxLjg3MiAwIDAgMCAyOC40OCA0LjM1MmwxNTkuMTA0LTUyLjIyNGEzMS4yMzIgMzEuMjMyIDAgMCAxIDM5LjI5NiAxOC44MTYgMjkuMTIgMjkuMTIgMCAwIDEgMCAxOS4yNjRsLTUzLjk1MiAxNTQuMDQ4YTI5LjI0OCAyOS4yNDggMCAwIDAgNC41NDQgMjcuNTg0bDEwMC40OCAxMzAuMzY4YTI5LjQ0IDI5LjQ0IDAgMCAxLTYuMzM2IDQxLjk4NCAzMS42OCAzMS42OCAwIDAgMS0xOC45NDQgNS45NTJsLTE2Ny45MzYtMi4wNDhhMzEuMzYgMzEuMzYgMCAwIDAtMjUuNzI4IDEyLjY3MmwtOTYuOTYgMTMyLjhhMzEuNjggMzEuNjggMCAwIDEtNDMuMjY0IDcuMTY4IDMwLjA4IDMwLjA4IDAgMCAxLTExLjcxMi0xNS42MTZMNjE1Ljg3MiA1NDcuODRsLTM5My4wODggNDM5LjM2YTExMi44MzIgMTEyLjgzMiAwIDAgMS0xNjEuNDA4IDUuNTY4IDEwNC40NDggMTA0LjQ0OCAwIDAgMSA1Ljc2LTE1Ni4yMjRMNTIzLjUyIDQ1My42MzJ6TTExNS42NDggNDQ4QzUxLjg0IDQ0OCAwIDM5Ny44MjQgMCAzMzZTNTEuODQgMjI0IDExNS42NDggMjI0YzYzLjkzNiAwIDExNS43MTIgNTAuMTc2IDExNS43MTIgMTEyUzE3OS41MiA0NDggMTE1LjY0OCA0NDh6IG0yNjguNzM2LTMyMGMtMzYuNDggMC02Ni4xMTItMjguNjcyLTY2LjExMi02NHMyOS42MzItNjQgNjYuMTEyLTY0YzM2LjQ4IDAgNjYuMTEyIDI4LjY3MiA2Ni4xMTIgNjRzLTI5LjYzMiA2NC02Ni4xMTIgNjR6IG00NzguMjA4IDgwMGMtNjMuODcyIDAtMTE1LjY0OC01MC4xNzYtMTE1LjY0OC0xMTJTNzk4LjcyIDcwNCA4NjIuNTkyIDcwNGM2My44NzIgMCAxMTUuNzEyIDUwLjE3NiAxMTUuNzEyIDExMnMtNTEuODQgMTEyLTExNS43MTIgMTEyeiIgZmlsbD0iIzZBNDg3QSIgcC1pZD0iOTMyIj48L3BhdGg+PC9zdmc+"
                              class = "autoQAImg2" alt="一键答题" margin-left='auto' margin-right='auto'>
                          <div class="promptText">一键答题</div>
                      </a>
                      <a href="#" class="jsCard option4">
                          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzA0MTIyMDAzMjUwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ0MDAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTczNC43MjEwNzUgNDQ1LjQ0YzM0LjA3MzYgMCA2Ni43Njk5MiA1Ljg4OCA5Ny4xMzE1MiAxNi43MTE2OGwyNy43NDAxNi0yNy4zOTJhOTIuMTYgOTIuMTYgMCAwIDAgMjIuMTU5MzYtOTEuMjIzMDRjLTguNTI5OTItMzIuMjA5OTItMzUuMDYxNzYtNTYuNDEyMTYtNjcuODA0MTYtNjEuODU0NzJsLTIwMy40MTc2LTM2LjkzNTY4LTkwLjYzNDI0LTE5My43OTJDNTA2Ljc2ODQzNSAyMC4yMTg4OCA0NzYuNzU0OTk1IDAuMjE1MDQgNDQzLjQ1NDUxNSAwIDQxMC4xOTQ5OTUgMC43OTM2IDM4MC4zOTY1OTUgMjAuODI4MTYgMzY3LjAwMjY3NSA1MS4zOTk2OEwyNzUuNzEzMDc1IDI0NC43NDExMmwtMjAzLjIwMjU2IDM5LjM4MzA0QzM5LjYxOTYzNSAyODkuMjEzNDQgMTIuNjQ3NDc1IDMxMi45OTU4NCAzLjM4MDI3NSAzNDUuMDkzMTJhOTcuMDc1MiA5Ny4wNzUyIDAgMCAwIDIyLjE1OTM2IDkxLjAwMjg4bDE0Ni40NzI5NiAxNDIuMzk3NDQtMzcuNDQ3NjggMjA0LjY5NzZhOTIuMzEzNiA5Mi4zMTM2IDAgMCAwIDMzLjQ1OTIgODkuMDAwOTYgODAuODM5NjggODAuODM5NjggMCAwIDAgODguNjMyMzIgNy4xMTY4bDE5My4zNTE2OC05My4xMzc5MkEyOTEuMDQxMjggMjkxLjA0MTI4IDAgMCAxIDQ0NS40NDEwNzUgNzM0LjcyYzAtMTU5Ljc2NDQ4IDEyOS41MTU1Mi0yODkuMjggMjg5LjI4LTI4OS4yOHpNNDg2LjQwMTA3NSA3NTUuMmMwLTE0OC40NTQ0IDEyMC4zNDU2LTI2OC44IDI2OC44LTI2OC44czI2OC44IDEyMC4zNDU2IDI2OC44IDI2OC44LTEyMC4zNDU2IDI2OC44LTI2OC44IDI2OC44UzQ4Ni40MDEwNzUgOTAzLjY1NDQgNDg2LjQwMTA3NSA3NTUuMnogbTI1Ny43ODE3NiAxMjIuOTIwOTZsMTkxLjc3NDcyLTE5MS43NzQ3MmEzOC40IDM4LjQgMCAwIDAgMC01NC4zMDI3MiAzOC40IDM4LjQgMCAwIDAtNTQuMzAyNzIgMEw3MTYuODAxMDc1IDc5Ni44OTIxNmwtODguMDUzNzYtODguMDQ4NjRhMzguNCAzOC40IDAgMCAwLTU0LjMwMjcyIDAgMzguNCAzOC40IDAgMCAwIDAgNTQuMzAyNzJsMTE0Ljk3NDcyIDExNC45NzQ3MiAwLjIyMDE2IDAuMjM1NTJhMzguMjg3MzYgMzguMjg3MzYgMCAwIDAgMjcuMTYxNiAxMS4yNDg2NGM5LjgzMDQgMCAxOS42NjA4LTMuNzQ3ODQgMjcuMTU2NDgtMTEuMjQ4NjRsMC4yMjUyOC0wLjIzNTUyeiIgcC1pZD0iNDQwMSIgZmlsbD0iIzAwMDAwMCI+PC9wYXRoPjwvc3ZnPg=="
                              class = "colorImg" alt="问卷星答题" margin-left='auto' margin-right='auto'>
                          <div class="promptText">问卷星一键</div>
                      </a>
                      <a href="#" class="jsCard option5">
                          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzA0NDU2NjA0Mzk1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEzMjA3IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik01MTIuMDA0IDU3MC4xNTJtLTQzNi4xMTggMGE0MzYuMTE4IDQzNi4xMTggMCAxIDAgODcyLjIzNiAwIDQzNi4xMTggNDM2LjExOCAwIDEgMC04NzIuMjM2IDBaIiBmaWxsPSIjRkRERjZEIiBwLWlkPSIxMzIwOCI+PC9wYXRoPjxwYXRoIGQ9Ik02MDUuNDU2IDk0MS44NzRjLTI0MC44NiAwLTQzNi4xMTYtMTk1LjI1NC00MzYuMTE2LTQzNi4xMTYgMC0xMjguNjgyIDU1Ljc0NC0yNDQuMzMyIDE0NC4zOS0zMjQuMTU4QzE3Mi41NDIgMjUzLjc5NCA3NS44ODQgNDAwLjY3OCA3NS44ODQgNTcwLjE0MmMwIDI0MC44NiAxOTUuMjU0IDQzNi4xMTYgNDM2LjExNiA0MzYuMTE2IDExMi4xNzggMCAyMTQuNDUyLTQyLjM2OCAyOTEuNzI2LTExMS45NTYtNTkuNDg2IDMwLjQxMi0xMjYuODc0IDQ3LjU3Mi0xOTguMjcgNDcuNTcyeiIgZmlsbD0iI0ZDQzU2QiIgcC1pZD0iMTMyMDkiPjwvcGF0aD48cGF0aCBkPSJNNTkwLjU4NCA4MjEuMjA4Yy00NyAwLTkwLjQxNC0yNS41My0xMTMuMzA2LTY2LjYyMmExNy43NCAxNy43NCAwIDEgMSAzMC45OTgtMTcuMjdjMTYuNjMyIDI5Ljg1OCA0OC4xNyA0OC40MDYgODIuMzA2IDQ4LjQwNiAzMy4yNjggMCA2NS4xNjQtMTguNzM2IDgzLjI0OC00OC44OTRhMTcuNzQyIDE3Ljc0MiAwIDAgMSAzMC40MzQgMTguMjQ2Yy0yNC40NTQgNDAuNzk0LTY4LjAxNCA2Ni4xMzQtMTEzLjY4IDY2LjEzNHpNNDk0Ljc5IDQ5Mi40MDhhMTcuNzQyIDE3Ljc0MiAwIDAgMS0xNy43NDItMTcuNzQyYzAtMjIuODg0LTE4LjYyLTQxLjUwMi00MS41MDItNDEuNTAycy00MS41MDIgMTguNjE4LTQxLjUwMiA0MS41MDJhMTcuNzQyIDE3Ljc0MiAwIDAgMS0zNS40ODQgMGMwLTQyLjQ1IDM0LjUzNi03Ni45ODYgNzYuOTg2LTc2Ljk4NnM3Ni45ODYgMzQuNTM2IDc2Ljk4NiA3Ni45ODZhMTcuNzQyIDE3Ljc0MiAwIDAgMS0xNy43NDIgMTcuNzQyek03OTQuNDUgNDkyLjQwOGExNy43NDIgMTcuNzQyIDAgMCAxLTE3Ljc0Mi0xNy43NDJjMC0yMi44ODQtMTguNjItNDEuNTAyLTQxLjUwMi00MS41MDJzLTQxLjUwMiAxOC42MTgtNDEuNTAyIDQxLjUwMmExNy43NDIgMTcuNzQyIDAgMCAxLTM1LjQ4NCAwYzAtNDIuNDUgMzQuNTM4LTc2Ljk4NiA3Ni45ODYtNzYuOTg2IDQyLjQ0OCAwIDc2Ljk4NiAzNC41MzYgNzYuOTg2IDc2Ljk4NmExNy43NDIgMTcuNzQyIDAgMCAxLTE3Ljc0MiAxNy43NDJ6IiBmaWxsPSIjN0YxODRDIiBwLWlkPSIxMzIxMCI+PC9wYXRoPjxwYXRoIGQ9Ik01MTYuNDQ4IDE3Ljc0MmMtMjMxLjgyMiAwLTQxOS43NTQgNjMuMzYtNDE5Ljc1NCAxNDEuNTE4czE4Ny45MjggMTQxLjUxNiA0MTkuNzU0IDE0MS41MTZTOTM2LjIgMjM3LjQxNiA5MzYuMiAxNTkuMjYgNzQ4LjI3IDE3Ljc0MiA1MTYuNDQ4IDE3Ljc0MnogbTAgMjE2LjkyMmMtMTY3Ljg4IDAtMzAzLjk3NC0zNC4wMzgtMzAzLjk3NC03Ni4wM3MxMzYuMDk0LTc2LjAzIDMwMy45NzQtNzYuMDMgMzAzLjk3NCAzNC4wMzggMzAzLjk3NCA3Ni4wMy0xMzYuMDk0IDc2LjAzLTMwMy45NzQgNzYuMDN6IiBmaWxsPSIjMERBRUQzIiBwLWlkPSIxMzIxMSI+PC9wYXRoPjxwYXRoIGQ9Ik0zNjcuMjM0IDE3Ni4zNzZjMS45NTQgMCAzLjk0Mi0wLjMyNCA1Ljg4OC0xLjAxIDQ0LjUwNi0xNS42NTggOTEuMjM0LTIzLjU5NiAxMzguODc4LTIzLjU5NiAzMC42ODIgMCA2MS4yODIgMy4zMzYgOTAuOTUyIDkuOTFhMTcuNzQgMTcuNzQgMCAwIDAgNy42NzgtMzQuNjQyYy0zMi4xODYtNy4xMzQtNjUuMzctMTAuNzUyLTk4LjYzLTEwLjc1Mi01MS42NjYgMC0xMDIuMzU0IDguNjE2LTE1MC42NTIgMjUuNjA4YTE3Ljc0IDE3Ljc0IDAgMCAwLTEwLjg0OCAyMi42MjQgMTcuNzQ0IDE3Ljc0NCAwIDAgMCAxNi43MzQgMTEuODU4eiIgZmlsbD0iIiBwLWlkPSIxMzIxMiI+PC9wYXRoPjxwYXRoIGQ9Ik04NDcuNDE2IDI2NC40MDhjODQuNzUyLTM1LjI0MiAxMDMuNy03NS45MDIgMTAzLjctMTA1LjE0OCAwLTMyLjU1Ni0yMy40MjQtNzkuMjU2LTEzNS4wMTYtMTE2Ljg3OEM3MzUuMDQgMTUuMDUgNjI3LjYxOCAwIDUxMy42MjIgMGMtMTEzLjk5OCAwLTIyMS40MiAxNS4wNS0zMDIuNDc4IDQyLjM4LTExMS41OTIgMzcuNjIyLTEzNS4wMTYgODQuMzI2LTEzNS4wMTYgMTE2Ljg3OCAwIDI4Ljk3NCAxOC42MTIgNjkuMTQ2IDEwMS4zNTggMTA0LjE1OC03Ny4xNDQgODMuODc0LTExOS4zNDQgMTkxLjc3OC0xMTkuMzQ0IDMwNi43MjZDNTguMTQyIDgyMC40MDIgMjYxLjc0IDEwMjQgNTEyIDEwMjRzNDUzLjg1OC0yMDMuNTk4IDQ1My44NTgtNDUzLjg1OGMtMC4wMDItMTE0LjQzLTQxLjg4Ni0yMjEuOTktMTE4LjQ0Mi0zMDUuNzM0ek0xMTEuNjEyIDE1OS4yNThjMC0yOC43MjggNDEuNDQ4LTU5Ljg1IDExMC44Ny04My4yNTQgNzcuNTAyLTI2LjEzIDE4MC44OTgtNDAuNTIgMjkxLjE0Mi00MC41MnMyMTMuNjQgMTQuMzkgMjkxLjE0MiA0MC41MmM2OS40MjIgMjMuNDA2IDExMC44NyA1NC41MjggMTEwLjg3IDgzLjI1NHMtNDEuNDQ4IDU5Ljg1LTExMC44NyA4My4yNTZjLTc3LjUwMiAyNi4xMy0xODAuODk4IDQwLjUyLTI5MS4xNDIgNDAuNTJzLTIxMy42NC0xNC4zOS0yOTEuMTQyLTQwLjUyYy02OS40MjYtMjMuNDA0LTExMC44Ny01NC41MjgtMTEwLjg3LTgzLjI1NnogbTQwMC4zODYgODI5LjI1OGMtMjMwLjY5NCAwLTQxOC4zNzQtMTg3LjY4LTQxOC4zNzQtNDE4LjM3NCAwLTExMC43OTYgNDIuNTE0LTIxNC41MSAxMTkuOTM0LTI5My4yMDggODAuNzc2IDI2LjgyIDE4Ny4xODYgNDEuNTg0IDMwMC4wNjIgNDEuNTg0IDExMS43MzQgMCAyMTcuMTMyLTE0LjQ2OCAyOTcuNjAyLTQwLjc3NiA3Ni45MSA3OC42MDYgMTE5LjE1IDE4Mi4wNDQgMTE5LjE1IDI5Mi4zOTggMCAyMzAuNjk0LTE4Ny42OCA0MTguMzc2LTQxOC4zNzQgNDE4LjM3NnoiIGZpbGw9IiIgcC1pZD0iMTMyMTMiPjwvcGF0aD48cGF0aCBkPSJNNDk0Ljc5IDQ5Mi40MWExNy43NDIgMTcuNzQyIDAgMCAwIDE3Ljc0Mi0xNy43NDJjMC00Mi40NS0zNC41MzgtNzYuOTg2LTc2Ljk4Ni03Ni45ODZzLTc2Ljk4NiAzNC41MzYtNzYuOTg2IDc2Ljk4NmExNy43NDIgMTcuNzQyIDAgMCAwIDM1LjQ4NCAwYzAtMjIuODg0IDE4LjYxOC00MS41MDIgNDEuNTAyLTQxLjUwMnM0MS41MDIgMTguNjIgNDEuNTAyIDQxLjUwMmExNy43NDIgMTcuNzQyIDAgMCAwIDE3Ljc0MiAxNy43NDJ6TTczNS4yMDQgMzk3LjY4Yy00Mi40NSAwLTc2Ljk4NiAzNC41MzYtNzYuOTg2IDc2Ljk4NmExNy43NDIgMTcuNzQyIDAgMCAwIDM1LjQ4NCAwYzAtMjIuODg0IDE4LjYyLTQxLjUwMiA0MS41MDItNDEuNTAyczQxLjUwMiAxOC42MiA0MS41MDIgNDEuNTAyYTE3Ljc0MiAxNy43NDIgMCAwIDAgMzUuNDg0IDBjMC4wMDItNDIuNDUyLTM0LjUzNi03Ni45ODYtNzYuOTg2LTc2Ljk4NnpNNjk4LjE3MiA3MzAuNzM2Yy04LjQwNC01LjA0Mi0xOS4zMDQtMi4zMDgtMjQuMzQgNi4wOTQtMTguMDgyIDMwLjE2Mi00OS45OCA0OC44OTQtODMuMjQ4IDQ4Ljg5NC0zNC4xMzggMC02NS42NzYtMTguNTQ4LTgyLjMwNi00OC40MDZhMTcuNzQ0IDE3Ljc0NCAwIDAgMC0yNC4xMzQtNi44NjQgMTcuNzQgMTcuNzQgMCAwIDAtNi44NjQgMjQuMTM0YzIyLjg5MiA0MS4wOTQgNjYuMzA4IDY2LjYyMiAxMTMuMzA2IDY2LjYyMiA0NS42NjIgMCA4OS4yMjItMjUuMzQgMTEzLjY4LTY2LjEzNGExNy43NDQgMTcuNzQ0IDAgMCAwLTYuMDk0LTI0LjM0ek01MTMuNjIyIDI1Mi40MDRjODIuNjA0IDAgMTYwLjQ2Ni04LjA5OCAyMTkuMjQ2LTIyLjggNjcuOTk0LTE3LjAwNiAxMDIuNDY4LTQwLjg4NCAxMDIuNDY4LTcwLjk3MlM4MDAuODYgMTA0LjY2NiA3MzIuODY4IDg3LjY2Yy01OC43OC0xNC43MDItMTM2LjY0Mi0yMi44LTIxOS4yNDYtMjIuOHMtMTYwLjQ2NiA4LjA5OC0yMTkuMjQ4IDIyLjhjLTY3Ljk5NCAxNy4wMDYtMTAyLjQ2OCA0MC44ODQtMTAyLjQ2OCA3MC45NzJzMzQuNDc2IDUzLjk2NiAxMDIuNDY4IDcwLjk3MmM1OC43OCAxNC43MDQgMTM2LjY0NiAyMi44IDIxOS4yNDggMjIuOHpNMjI3LjM5IDE1OC42MzRjMC0zLjcyNiAxMi44MjgtMjAuODUgNzUuNTk0LTM2LjU0OCA1Ni4wNDgtMTQuMDE4IDEzMC44NTItMjEuNzM4IDIxMC42MzgtMjEuNzM4czE1NC41OSA3LjcyMiAyMTAuNjM2IDIxLjczOGM2Mi43NjYgMTUuNjk4IDc1LjU5NCAzMi44MjIgNzUuNTk0IDM2LjU0OHMtMTIuODI4IDIwLjg1LTc1LjU5NCAzNi41NDhjLTU2LjA0NiAxNC4wMTgtMTMwLjg1MiAyMS43MzgtMjEwLjYzNiAyMS43MzgtNzkuNzg2IDAtMTU0LjU5Mi03LjcyMi0yMTAuNjM4LTIxLjczOC02Mi43NjYtMTUuNjk4LTc1LjU5NC0zMi44MjItNzUuNTk0LTM2LjU0OHoiIGZpbGw9IiIgcC1pZD0iMTMyMTQiPjwvcGF0aD48cGF0aCBkPSJNNjcwLjAwMiAxNjQuMDc2bS0xNy43NDIgMGExNy43NDIgMTcuNzQyIDAgMSAwIDM1LjQ4NCAwIDE3Ljc0MiAxNy43NDIgMCAxIDAtMzUuNDg0IDBaIiBmaWxsPSIiIHAtaWQ9IjEzMjE1Ij48L3BhdGg+PHBhdGggZD0iTTMyNC41ODIgNTUxLjUwMmMtMzIuMzg4IDAtNTguNjQyIDI2LjI1Ni01OC42NDIgNTguNjQyaDExNy4yODhjLTAuMDA0LTMyLjM4Ni0yNi4yNTgtNTguNjQyLTU4LjY0Ni01OC42NDJ6TTgzNi4xMDYgNTUxLjUwMmMtMzIuMzg4IDAtNTguNjQyIDI2LjI1Ni01OC42NDIgNTguNjQyaDExNy4yODhjLTAuMDAyLTMyLjM4Ni0yNi4yNTYtNTguNjQyLTU4LjY0Ni01OC42NDJ6IiBmaWxsPSIjRjlBODgwIiBwLWlkPSIxMzIxNiI+PC9wYXRoPjwvc3ZnPg=="
                              class = "timeReverseImg1" alt="千回百转"  margin-left='auto' margin-right='auto'>
                          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzA0NDU2ODQ0ODc5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI2NjU4IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik05OTUuNTU2IDUyOS42MDdjMC0xMDcuOTE4LTg3LjQ2Ny0xOTUuMzg1LTE5NS4zODUtMTk1LjM4NS0yNy44NDcgMC03OC4yNzkgMTYuNDQxLTc4LjI3OSAxNi40NDFMMzQ4LjUzIDM5MC4wM3MtNzcuMjg0LTQ0Ljk3MS0xMjQuNjcyLTQ0Ljk3MWMtMTA3Ljk0NyAwLTE5NS40MTMgODcuNDY3LTE5NS40MTMgMTk1LjM4NSAwIDYuNzQyIDAuMzQgMTMuMzk4IDAuOTk1IDE5Ljk2OEMzOS45OTMgODE4LjE0NyAyNTEuNzA1IDEwMjQgNTEyIDEwMjRjMjY3LjA2NSAwIDQ4My41NTYtMjE2LjQ5MSA0ODMuNTU2LTQ4My41NTYgMC0xLjQ3OS0wLjI1Ny0yLjg3Mi0wLjM0Mi00LjM1MiAwLjA4NS0yLjE2MSAwLjM0Mi00LjI5NSAwLjM0Mi02LjQ4NXoiIGZpbGw9IiNGRkNCNEMiIHAtaWQ9IjI2NjU5Ij48L3BhdGg+PHBhdGggZD0iTTg1Ni45MTcgMzkxLjE0Yy0yNi43NjYtNi45NDEtMjguNyAxMC45NzktNjIuNjM0IDYuOTk3LTMzLjIyMy0zLjg5NyAxMi4yMDItMjEuMDIxLTUuNTQ3LTMxLjA2MS01Ljk3My0zLjM4NS0xNC41MzUtNC4wOTYtMjUuMDg4LTIuNzg4LTI5LjkyNCAzLjY2OS00ODIuMjQ3IDE1LjQ3NC00OTkuMTE1IDIzLjYwOS0xNC45OSA3LjIyNS0yMy44NjUgMTUuNTg3LTM3LjQ4OSAyLjg3My0xNy4xNTItMTUuOTg2LTQxLjctNi43Ny00OC44MTEtMS40NTEtOS4xNTkgNi44ODQtMTEuMDY1IDIwLjUzNyA2LjY1NiAzNi4zMjQgMTcuNjY0IDExLjk0NiA0Ny41ODcgMjQuNDMzIDk4LjU2IDMyLjk2NyA1LjYwMyAwLjkzOCAxMC4zODIgMS4zMDggMTQuODQ4IDEuNDc5IDM0LjkwMSAxLjE2NiAzOS43MzctNDcuNTAyIDg5LjAzMS00OC44MTEgMzIuMzEzLTAuODUzIDMxNy4yNDEgMzAuNDM2IDM0MC43MDggMjcuMjUgMi44NzItMC4zOTggNS44ODgtMC42ODMgOS4zNTgtMC42ODMgNDQuNDU4IDAgNTQuNzg0IDQxLjI0NSAxMDIuMDg3IDguOTg5IDIwLjA1My0xNi4yOTkgNTEuNTEzLTQ2Ljg3NyAxNy40MzYtNTUuNjk0eiIgZmlsbD0iI0YxOTAyMCIgcC1pZD0iMjY2NjAiPjwvcGF0aD48cGF0aCBkPSJNMTY4LjkwMyAyNTkuMjcxYzQzLjMyMSA0My40MzUgNzQuMDY5IDg5LjQ1OCA5NS42MyAxMjguNjU0IDE2LjEgMjkuMjcgMjcuMTkzIDU0Ljg3IDMzLjc2NCA3Mi4xOTIgMzQuOTAxIDEuMTY2IDM5LjczNy0xOS4wNTggODkuMDMxLTIwLjM2NiAzMi4zMTMtMC44NTMgNTAuNzE2IDIxLjg3NCA3NC42MSAzNC45NTggNDIuNzIzIDIzLjM4MiA3My4wNzQtMjAuNzY0IDEwNS43ODUtMjAuNzY0IDI0LjE3NyAwIDYzLjExOCAzNC4zMzIgOTAuMzM5IDIxLjczMSAzOS40NTMtMTguMjg5IDQ2LjUwNy0zMy44NzcgNjkuOTc0LTM3LjA5MSA5LjE1OS0yMi41IDIxLjA3Ny00OC4yNDIgMzUuNjEyLTc0LjIxMiAyMS4wNDktMzcuNjYgNDcuNzMtNzUuODA0IDgwLjgxMS0xMDUuMDQ1SDE2OC45MDN2LTAuMDU3eiIgZmlsbD0iI0YzNkMyNCIgcC1pZD0iMjY2NjEiPjwvcGF0aD48cGF0aCBkPSJNODMzLjU5MyAyNjguMzc0YzM2LjQzNy0zNS45MjYtNjU1LjMzMiAwLjQ1NS02MzUuNDc3IDIyLjQxNCAyOC4xMDMgMzEuMTE4IDYyLjU3NyA4OS42ODUgNjIuNTc3IDg5LjY4NXMxMzUuMzExIDY4LjQwOSAyMzcuNTQtMTcuODA2QzU2OS4zNDQgNDA1LjMzNCA2NjguOSAzOTAuMjMgNzEzLjMzIDMxNi45YzAgMCAzNC42MTcgMTIuODg1IDY5LjcxNyAxNS4xMDQgMCAwIDI3LjEwOC00MC41MzQgNTAuNTQ2LTYzLjYzeiIgZmlsbD0iI0NFNUMxRiIgcC1pZD0iMjY2NjIiPjwvcGF0aD48cGF0aCBkPSJNNTEyIDk1NS4zOTJjNjguMDUzIDAgMTIzLjIyMS02My4wMzggMTIzLjIyMS0xNDAuOCAwLTc3Ljc2Mi01NS4xNjgtMTQwLjgtMTIzLjIyMS0xNDAuOHMtMTIzLjIyMSA2My4wMzgtMTIzLjIyMSAxNDAuOGMwIDc3Ljc2MiA1NS4xNjggMTQwLjggMTIzLjIyMSAxNDAuOHpNMzk4LjIyMiA1ODYuMTI2YzAgNDEuODk5LTI1LjQ4NiA3NS44NjEtNTYuODg5IDc1Ljg2MS0zMS40MzEgMC01Ni44ODktMzMuOTYyLTU2Ljg4OS03NS44NjFzMjUuNDU4LTc1Ljg2MSA1Ni44ODktNzUuODYxYzMxLjQwMyAwIDU2Ljg4OSAzMy45NjIgNTYuODg5IDc1Ljg2MXogbTM0MS4zMzQtMC4wMjhjMCA0MS44OTgtMjUuNDU4IDc1Ljg2MS01Ni44ODkgNzUuODYxLTMxLjQzMSAwLTU2Ljg4OS0zMy45NjMtNTYuODg5LTc1Ljg2MSAwLTQxLjg3MSAyNS40ODYtNzUuODYyIDU2Ljg4OS03NS44NjIgMzEuNDMxIDAuMDI5IDU2Ljg4OSAzMy45OTEgNTYuODg5IDc1Ljg2MnoiIGZpbGw9IiM2NTQ3MUIiIHAtaWQ9IjI2NjYzIj48L3BhdGg+PHBhdGggZD0iTTg4NS4zMzMgMTA1Ljk1NWMtNi44MjYgMC0xMy4yODMgMS4yOC0xOS41MTMgMy4xMDEtMTkuNTY5LTI0LjAzNi00OS4wMDktMzkuNzA5LTgyLjQzMi0zOS43MDktMi40NzQgMC00LjgwNyAwLjU3LTcuMjUzIDAuNzQtMjAuODc4LTIzLjUyNC01MS4wMjktMzguNjU2LTg0Ljk2My0zOC42NTYtNDIuODA5IDAtNzkuNjQ1IDIzLjg2NS05OS4xNTggNTguNzY2LTkuODQyLTIyLjY5OC0zMi4zOTgtMzguNTk5LTU4LjcwOS0zOC41OTktMjAuNDIzIDAtMzguMzcyIDkuNzI4LTUwLjA5MSAyNC42MDVDNDY4Ljc2NCAzNC4zODkgNDI5LjUxMSA0LjE4IDM4Mi44MDUgNC4xOGMtMzcuNjMyIDAtNzAuNTQyIDE5LjU5OC04OS41NDMgNDkuMDEtNS4yMzQtMC44MjUtMTAuNDY3LTEuNjUtMTUuOTI5LTEuNjUtNDAuNzMyIDAtNzUuNjkgMjMuMDk3LTkzLjY2NyA1Ni42NjEtNS43NzQtMS4wOC0xMS42NjItMS43OTItMTcuNzUtMS43OTItNTMuMDIgMC05NiA0Mi45OC05NiA5NiAwIDUzLjAyMSA0Mi45OCA5NiA5NiA5NiAxNi43MjYgMCAzMi4yODUtNC41MjIgNDUuOTEtMTIuMDg4IDEwLjY5NSA4LjAyMSAyMy44MzYgMTIuOTcgMzguMjU4IDEyLjk3IDQuMTI0IDAgOC4xMDYtMC40NTUgMTIuMDAzLTEuMjIzIDI0LjMyIDM5LjIyNSA2Ny4zMjggNjUuNTA4IDExNi44NzggNjUuNTA4IDQ4LjYxMiAwIDkxLjE5My0yNS4xNzQgMTE1Ljg1NS02My4wNjIgMjAuNDggMjUuMDg4IDUxLjI1NiA0MS40NDQgODYuMTU4IDQxLjQ0NCA1MS42MjYgMCA5NC42MzQtMzUuMjE0IDEwNy40MDYtODIuODAyIDAuOTY3IDAuMDI5IDEuODQ5IDAuMjg1IDIuODE2IDAuMjg1IDguMDUgMCAxNS45LTAuODgyIDIzLjQ5NS0yLjQ3NSAxOC42MDMgMTUuODE1IDQyLjQxMSAyNS43MTQgNjguNzUgMjUuNzE0IDMzLjM5NCAwIDYyLjg2My0xNS42NzMgODIuNDA0LTM5LjcwOSA2LjIyOSAxLjgyMSAxMi42ODYgMy4xMDEgMTkuNTEzIDMuMTAxIDM4LjY4NCAwIDcwLjA1OC0zMS4zNzUgNzAuMDU4LTcwLjA1OXMtMzEuNDAyLTcwLjA1OS03MC4wODctNzAuMDU5eiIgZmlsbD0iI0NDRDZERCIgcC1pZD0iMjY2NjQiPjwvcGF0aD48cGF0aCBkPSJNNzkwLjYxMyAyMjQuMzdjMzMuMzIgMCA2MC4zMzEtMjcuMDExIDYwLjMzMS02MC4zMzEgMC0zMy4zMi0yNy4wMTEtNjAuMzMxLTYwLjMzMS02MC4zMzEtMzMuMzE5IDAtNjAuMzMgMjcuMDExLTYwLjMzIDYwLjMzMSAwIDMzLjMyIDI3LjAxMSA2MC4zMzEgNjAuMzMgNjAuMzMxek01NjUuMzYyIDE2Ny45MDhjMC0zMy45MzUtMjcuNTA2LTYxLjQ2OS02MS40NC02MS40NjktMTAuNDY4IDAtMjAuMTk2IDIuODczLTI4LjgxNCA3LjQ4MS03LjE0LTE3LjA5NS0yNC4wMDgtMjkuMTI3LTQzLjcyLTI5LjEyNy0xNi4xMjggMC0zMC4zNSA4LjEwNy0zOC45MTIgMjAuNDIzLTE5LjA1Ny0xNy43Mi00NC40MDEtMjguODE0LTcyLjQ3Ni0yOC44MTQtNDkuOTIgMC05MS40NzcgMzQuNDE4LTEwMy4xMTEgODAuNzI1LTEwLjM4Mi0xMC40MzktMjQuNzQ3LTE2LjkyNC00MC42NDctMTYuOTI0LTMxLjYwMiAwLTU3LjIzIDI1LjYyOC01Ny4yMyA1Ny4yMyAwIDMxLjYwMiAyNS42MjggNTcuMjMgNTcuMjMgNTcuMjMgMTkuOTk2IDAgMzcuNTE4LTEwLjI2OCA0Ny43NTgtMjUuNzk5IDE0LjcwNiAzMC43NDkgNDMuNDkyIDUzLjI3NyA3OC4xOTQgNTkuMTM2IDExLjA5MyAxOS4wNTggMzEuNDg4IDMyIDU1LjEyNSAzMiAzMC41NDkgMCA1Ni4wMDctMjEuNDQ3IDYyLjM3OS01MC4wNjIgOS4yMTYgNS4xMiAxOS42NTUgOC4zMDYgMzAuOTE5IDguMzA2IDMwLjQzNSAwIDU1LjgwOC0yMS4zMDUgNjIuMjkzLTQ5Ljc3OCAyOS42MzktNC40MDkgNTIuNDUyLTI5LjY5NiA1Mi40NTItNjAuNTU4eiIgZmlsbD0iI0UxRThFRCIgcC1pZD0iMjY2NjUiPjwvcGF0aD48L3N2Zz4="
                              class = "timeReverseImg2" alt="千回百转" margin-left='auto' margin-right='auto'>
                      <div class="promptText">千回百转</div>
                      </a>
                      <a href="#" class="jsCard option6">
                          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzA2MjQ4MzA3NTQxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE4MTAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTE1Ljg3MiA1MTAuOTc2YzAgMjczLjQwOCAyMjEuNjk2IDQ5NS42MTYgNDk1LjYxNiA0OTUuNjE2czQ5NS42MTYtMjIxLjY5NiA0OTUuNjE2LTQ5NS42MTZTNzg0Ljg5NiAxNS4zNiA1MTAuOTc2IDE1LjM2IDE1Ljg3MiAyMzcuNTY4IDE1Ljg3MiA1MTAuOTc2eiIgZmlsbD0iI0VCQ0IwMCIgcC1pZD0iMTgxMSI+PC9wYXRoPjxwYXRoIGQ9Ik01MTAuOTc2IDEwMTguODhjLTY4LjYwOCAwLTEzNS4xNjgtMTMuMzEyLTE5Ny42MzItMzkuOTM2LTYwLjQxNi0yNS42LTExNC42ODgtNjIuNDY0LTE2MS4yOC0xMDkuMDU2cy04My40NTYtMTAwLjg2NC0xMDkuMDU2LTE2MS4yOEMxNi4zODQgNjQ2LjE0NCAzLjA3MiA1NzkuNTg0IDMuMDcyIDUxMC45NzZzMTMuMzEyLTEzNS4xNjggMzkuOTM2LTE5Ny42MzJjMjUuNi02MC40MTYgNjIuNDY0LTExNC42ODggMTA5LjA1Ni0xNjEuMjhTMjUyLjkyOCA2OC42MDggMzEzLjM0NCA0My4wMDhDMzc1LjgwOCAxNi4zODQgNDQyLjM2OCAzLjA3MiA1MTAuOTc2IDMuMDcyczEzNS4xNjggMTMuMzEyIDE5Ny42MzIgMzkuOTM2YzYwLjQxNiAyNS42IDExNC42ODggNjIuNDY0IDE2MS4yOCAxMDkuMDU2czgzLjQ1NiAxMDAuODY0IDEwOS4wNTYgMTYxLjI4YzI2LjYyNCA2Mi40NjQgMzkuOTM2IDEyOS4wMjQgMzkuOTM2IDE5Ny42MzJzLTEzLjMxMiAxMzUuMTY4LTM5LjkzNiAxOTcuNjMyYy0yNS42IDYwLjQxNi02Mi40NjQgMTE0LjY4OC0xMDkuMDU2IDE2MS4yOHMtMTAwLjg2NCA4My40NTYtMTYxLjI4IDEwOS4wNTZjLTYyLjQ2NCAyNi42MjQtMTI5LjAyNCAzOS45MzYtMTk3LjYzMiAzOS45MzZ6IG0wLTk5MC43MmMtNjUuMDI0IDAtMTI4LjUxMiAxMi44LTE4Ny45MDQgMzcuODg4LTU3LjM0NCAyNC4wNjQtMTA5LjA1NiA1OS4zOTItMTUzLjYgMTAzLjQyNHMtNzkuMzYgOTUuNzQ0LTEwMy40MjQgMTUzLjZDNDAuOTYgMzgyLjQ2NCAyOC4xNiA0NDUuOTUyIDI4LjE2IDUxMC45NzZzMTIuOCAxMjguNTEyIDM3Ljg4OCAxODcuOTA0YzI0LjA2NCA1Ny4zNDQgNTkuMzkyIDEwOS4wNTYgMTAzLjQyNCAxNTMuNiA0NC41NDQgNDQuNTQ0IDk1Ljc0NCA3OS4zNiAxNTMuNiAxMDMuNDI0IDU5LjM5MiAyNS4wODggMTIyLjg4IDM3Ljg4OCAxODcuOTA0IDM3Ljg4OHMxMjguNTEyLTEyLjggMTg3LjkwNC0zNy44ODhjNTcuMzQ0LTI0LjA2NCAxMDkuMDU2LTU5LjM5MiAxNTMuNi0xMDMuNDI0IDQ0LjU0NC00NC41NDQgNzkuMzYtOTUuNzQ0IDEwMy40MjQtMTUzLjYgMjUuMDg4LTU5LjM5MiAzNy44ODgtMTIyLjg4IDM3Ljg4OC0xODcuOTA0cy0xMi44LTEyOC41MTItMzcuODg4LTE4Ny45MDRjLTI0LjA2NC01Ny4zNDQtNTkuMzkyLTEwOS4wNTYtMTAzLjQyNC0xNTMuNnMtOTUuNzQ0LTc5LjM2LTE1My42LTEwMy40MjRDNjM5LjQ4OCA0MC45NiA1NzYuNTEyIDI4LjE2IDUxMC45NzYgMjguMTZ6IiBmaWxsPSIjRUJDQjAwIiBwLWlkPSIxODEyIj48L3BhdGg+PHBhdGggZD0iTTM3LjM3NiA0ODYuOTEyYzAgMjU1LjQ4OCAyMTEuOTY4IDQ2Mi4zMzYgNDczLjA4OCA0NjIuMzM2IDI2MS42MzIgMCA0NzMuMDg4LTIwNy4zNiA0NzMuMDg4LTQ2Mi4zMzYgMC0yNTUuNDg4LTIxMS40NTYtNDYyLjMzNi00NzMuMDg4LTQ2Mi4zMzYtMjYxLjEyIDAtNDczLjA4OCAyMDcuMzYtNDczLjA4OCA0NjIuMzM2eiIgZmlsbD0iI0ZGRTUwMCIgcC1pZD0iMTgxMyI+PC9wYXRoPjxwYXRoIGQ9Ik03MzkuMzI4IDYwNC42NzJjLTg2LjUyOCAwLTEzNC4xNDQtMzYuMzUyLTE3OS4yLTkzLjY5Ni0yMy41NTItMjkuNjk2LTMzLjI4LTU1LjI5Ni00MC40NDgtNzQuMjQtOC4xOTItMjEuNTA0LTkuNzI4LTIyLjUyOC0xNC4zMzYtMjIuNTI4LTcuMTY4IDAtOS4yMTYgMy41ODQtMjAuNDggMjcuNjQ4LTcuNjggMTcuNDA4LTE4LjQzMiA0MC45Ni0zOC40IDY4LjYwOC00Ni41OTIgNjQuNTEyLTk5LjMyOCAxMDIuNC0yMTcuNiA5MC4xMTJDMTEzLjY2NCA1ODguOCA1Ny44NTYgNDg2LjQgNDkuNjY0IDQ0MS4zNDRjLTMuNTg0LTIwLjk5Mi0xNi4zODQtMzcuMzc2LTM4LjQtNTAuNjg4QzcuMTY4IDM4OS4xMiA0LjA5NiAzODQgNC4wOTYgMzc4Ljg4TDMuMDcyIDMxNi45MjhjMC03LjY4IDUuNjMyLTE0LjMzNiAxMy4zMTItMTUuMzZDMTA3LjAwOCAyODguMjU2IDE3OS4yIDI4MS42IDIzMC45MTIgMjgxLjZjNDUuNTY4IDAgMTEyLjY0IDE2LjM4NCAxNzIuMDMyIDMwLjcyIDM5LjkzNiA5LjcyOCA3Ny44MjQgMTguOTQ0IDkzLjY5NiAxOC45NDQgMTUuMzYgMCA0NS4wNTYtOC43MDQgNzkuMzYtMTguOTQ0IDUxLjcxMi0xNS4zNiAxMTUuNzEyLTM0LjgxNiAxODIuNzg0LTQwLjk2IDc3LjgyNC03LjE2OCAxNTguNzIgNC4wOTYgMjQxLjE1MiAzMy4yOCA2LjE0NCAyLjA0OCAxMC4yNCA3LjY4IDEwLjI0IDEzLjgyNCAxLjUzNiA1My43Ni0xLjUzNiA2NC0xMS43NzYgNjkuMTItMi41NiAxLjUzNi01LjYzMiAxLjUzNi04LjE5MiAyLjA0OC0xOS40NTYgMy41ODQtMjQuNTc2IDExLjc3Ni0zNi44NjQgMzUuMzI4LTEuNTM2IDMuMDcyLTQuMDk2IDkuNzI4LTYuNjU2IDE3LjQwOC0xNC44NDggNDMuMDA4LTQ5LjE1MiAxNDQuMzg0LTE1Ny4xODQgMTU5LjIzMi0xNy40MDggMi4wNDgtMzQuMzA0IDMuMDcyLTUwLjE3NiAzLjA3MnoiIGZpbGw9IiMzMjMyMzIiIHAtaWQ9IjE4MTQiPjwvcGF0aD48cGF0aCBkPSJNNTA1Ljg1NiAzODQuNTEyYzI2LjYyNCAwIDM1LjMyOCAyMS41MDQgNDMuMDA4IDQxLjk4NCA2LjY1NiAxNy45MiAxNS4zNiAzOS45MzYgMzUuODQgNjYuMDQ4IDQ3LjYxNiA2MC40MTYgOTUuNzQ0IDkyLjY3MiAyMDEuNzI4IDc4LjMzNiA4OS4wODgtMTEuNzc2IDExNy4yNDgtOTQuMjA4IDEzMi4wOTYtMTM4Ljc1MiAzLjA3Mi05LjcyOCA1LjYzMi0xNi4zODQgOC4xOTItMjEuNTA0IDExLjI2NC0yMi4wMTYgMjIuMDE2LTQyLjQ5NiA1Mi43MzYtNTAuMTc2IDAuNTEyLTUuMTIgMS4wMjQtMTQuMzM2IDAuNTEyLTMxLjIzMi03NC43NTItMjUuMDg4LTE0OC40OC0zNC4zMDQtMjE4LjExMi0yOC4xNi02NCA1LjYzMi0xMjYuNDY0IDI0LjU3Ni0xNzYuNjQgMzkuNDI0LTM3Ljg4OCAxMS4yNjQtNjguMDk2IDIwLjQ4LTg4LjA2NCAyMC40OC0xOS45NjggMC01NS44MDgtOC43MDQtMTAwLjg2NC0xOS45NjgtNTQuNzg0LTEzLjMxMi0xMjIuODgtMjkuNjk2LTE2NC44NjQtMjkuNjk2LTQ3LjYxNiAwLTExMy42NjQgNi4xNDQtMTk2LjYwOCAxNy45MmwwLjUxMiA0MC40NDhjMjUuNiAxNy40MDggNDAuOTYgMzkuOTM2IDQ1LjU2OCA2Ny4wNzIgNC4wOTYgMjQuMDY0IDQ0LjAzMiAxMjIuODggMTUyLjA2NCAxMzMuNjMyIDEwMy45MzYgMTAuNzUyIDE0OC40OC0yMC40OCAxODkuOTUyLTc3LjgyNCAxOC40MzItMjUuMDg4IDI4LjE2LTQ2LjU5MiAzNS4zMjgtNjMuNDg4IDEwLjI0LTIzLjU1MiAxOS45NjgtNDQuNTQ0IDQ3LjYxNi00NC41NDR6IiBmaWxsPSIjNjE5QkZGIiBwLWlkPSIxODE1Ij48L3BhdGg+PHBhdGggZD0iTTEyMC4zMiA1MDEuNzZjLTIzLjU1Mi0zMS4yMzItMTkuNDU2LTY5LjEyLTQwLjQ0OC0xMDguMDMyLTExLjc3Ni0yMi4wMTYtMzUuMzI4LTQ2LjU5Mi00Ni4wOC02MC40MTZsMC41MTIgMzYuODY0YzI1LjYgMTcuNDA4IDQwLjk2IDM5LjkzNiA0NS41NjggNjcuMDcyIDMuNTg0IDE5LjQ1NiAzMC43MiA4OS4wODggOTkuODQgMTE5LjgwOC0yMy4wNC0xNC44NDgtNDIuNDk2LTMzLjI4LTU5LjM5Mi01NS4yOTZ6IiBmaWxsPSIjRkZGRkZGIiBwLWlkPSIxODE2Ij48L3BhdGg+PHBhdGggZD0iTTUxMC40NjQgNzA0LjUxMmMtNTIuNzM2IDAtOTUuMjMyLTQ0LjU0NC05NS4yMzItOTkuODQgMC04LjcwNCA2LjY1Ni0xNS4zNiAxNS4zNi0xNS4zNnMxNS4zNiA2LjY1NiAxNS4zNiAxNS4zNmMwIDM4LjQgMjkuMTg0IDY5LjYzMiA2NC41MTIgNjkuNjMyIDM1Ljg0IDAgNjQuNTEyLTMxLjIzMiA2NC41MTItNjkuNjMyIDAtOC43MDQgNi42NTYtMTUuMzYgMTUuMzYtMTUuMzZzMTUuMzYgNi42NTYgMTUuMzYgMTUuMzZjMCA1NS4yOTYtNDIuNDk2IDk5Ljg0LTk1LjIzMiA5OS44NHoiIGZpbGw9IiMzMjMyMzIiIHAtaWQ9IjE4MTciPjwvcGF0aD48cGF0aCBkPSJNMTI1LjQ0IDQyMy45MzZjLTMuMDcyIDAtNi4xNDQtMS4wMjQtOC43MDQtMi41Ni03LjE2OC00LjYwOC04LjcwNC0xNC4zMzYtNC4wOTYtMjAuOTkybDMyLjI1Ni00OC4xMjhjNC42MDgtNy4xNjggMTQuMzM2LTguNzA0IDIwLjk5Mi00LjA5NiA3LjE2OCA0LjYwOCA4LjcwNCAxNC4zMzYgNC4wOTYgMjAuOTkybC0zMi4yNTYgNDcuNjE2Yy0yLjU2IDQuNjA4LTcuNjggNy4xNjgtMTIuMjg4IDcuMTY4eiBtNzMyLjY3MiAwYy0zLjA3MiAwLTYuMTQ0LTEuMDI0LTguNzA0LTIuNTYtNy4xNjgtNC42MDgtOC43MDQtMTQuMzM2LTQuMDk2LTIwLjk5MmwzMi4yNTYtNDguMTI4YzQuNjA4LTcuMTY4IDE0LjMzNi04LjcwNCAyMC45OTItNC4wOTYgNy4xNjggNC42MDggOC43MDQgMTQuMzM2IDQuMDk2IDIwLjk5MmwtMzIuMjU2IDQ4LjEyOGMtMi41NiA0LjA5Ni03LjY4IDYuNjU2LTEyLjI4OCA2LjY1NnoiIGZpbGw9IiNGRkZGRkYiIHAtaWQ9IjE4MTgiPjwvcGF0aD48cGF0aCBkPSJNNzM2LjI1NiAxODAuMjI0YzExLjc3NiAxMS43NzYgMTQuMzM2IDI4LjE2IDYuMTQ0IDM2Ljg2NC04LjE5MiA4LjcwNC0yNS4wODggNS42MzItMzYuODY0LTYuMTQ0cy0xNC44NDgtMjguMTYtNi4xNDQtMzYuODY0YzguNzA0LTguMTkyIDI1LjA4OC01LjYzMiAzNi44NjQgNi4xNDRNNTYzLjIgNjkuMTJjNi4xNDQgNi4xNDQgNy4xNjggMTQuMzM2IDMuMDcyIDE4LjQzMi00LjA5NiA0LjA5Ni0xMi44IDMuMDcyLTE4LjQzMi0zLjA3Mi02LjE0NC02LjE0NC03LjE2OC0xNC4zMzYtMy4wNzItMTguNDMyIDQuNjA4LTQuMDk2IDEyLjgtMy4wNzIgMTguNDMyIDMuMDcybTEwOS4wNTYgNDMuMDA4YzIzLjU1MiAyMy41NTIgMjkuMTg0IDU2LjgzMiAxMi4yODggNzMuNzI4LTE2Ljg5NiAxNi44OTYtNTAuMTc2IDExLjc3Ni03My43MjgtMTEuNzc2cy0yOS4xODQtNTYuODMyLTEyLjI4OC03My43MjhjMTcuNDA4LTE3LjQwOCA1MC4xNzYtMTEuNzc2IDczLjcyOCAxMS43NzYiIGZpbGw9IiNGRkY0OEMiIHAtaWQ9IjE4MTkiPjwvcGF0aD48L3N2Zz4="
                              class = "hideImg1" alt="窗口显隐" margin-left='auto' margin-right='auto'>
                          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzA2MjQ4Mzk2ODQxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE5NTMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTAgNTEyYTUxMiA1MTIgMCAxIDAgMTAyNCAwQTUxMiA1MTIgMCAxIDAgMCA1MTJ6IiBmaWxsPSIjRkVDNDNDIiBwLWlkPSIxOTU0Ij48L3BhdGg+PHBhdGggZD0iTTEwMTMuNzYgNDA4LjU3NkM5NjUuNjMyIDE3NS4xMDQgNzU5LjgwOCAwIDUxMiAwIDIyOS4zNzYgMCAwIDIyOS4zNzYgMCA1MTJjMCAxMjMuOTA0IDQ0LjAzMiAyMzYuNTQ0IDExNi43MzYgMzI0LjYwOCA4Ny4wNCA0OC4xMjggMTg2LjM2OCA3NC43NTIgMjkyLjg2NCA3NC43NTIgMzAxLjA1NiAwIDU1MC45MTItMjE3LjA4OCA2MDQuMTYtNTAyLjc4NHoiIGZpbGw9IiNGRkQ3M0EiIHAtaWQ9IjE5NTUiPjwvcGF0aD48cGF0aCBkPSJNMjA0LjggMzM3LjkyYTkyLjE2IDkyLjE2IDAgMSAwIDE4NC4zMiAwIDkyLjE2IDkyLjE2IDAgMSAwLTE4NC4zMiAwek02MzQuODggMzM3LjkyYTkyLjE2IDkyLjE2IDAgMSAwIDE4NC4zMiAwIDkyLjE2IDkyLjE2IDAgMSAwLTE4NC4zMiAwek01MTIgNzc4LjI0Yy0xMzQuMTQ0IDAtMjQ1Ljc2LTk3LjI4LTI2Ni4yNC0yMjUuMjgtMy4wNzItMjEuNTA0IDEzLjMxMi00MC45NiAzNS44NC00MC45Nmg0NjAuOGMyMi41MjggMCAzOC45MTIgMTkuNDU2IDM1Ljg0IDQwLjk2LTIwLjQ4IDEyOC0xMzIuMDk2IDIyNS4yOC0yNjYuMjQgMjI1LjI4eiIgZmlsbD0iIzg3M0ExOCIgcC1pZD0iMTk1NiI+PC9wYXRoPjxwYXRoIGQ9Ik03NDIuNCA1MTJIMjgxLjZjLTIyLjUyOCAwLTM4LjkxMiAxOS40NTYtMzUuODQgNDAuOTYgMS4wMjQgNy4xNjggMi4wNDggMTQuMzM2IDQuMDk2IDIxLjUwNEg3NzMuMTJjMi4wNDgtNy4xNjggMy4wNzItMTQuMzM2IDQuMDk2LTIxLjUwNEM3ODEuMzEyIDUzMS40NTYgNzYzLjkwNCA1MTIgNzQyLjQgNTEyeiIgZmlsbD0iI0ZGRkZGRiIgcC1pZD0iMTk1NyI+PC9wYXRoPjxwYXRoIGQ9Ik01ODcuNzc2IDYzNS45MDRjLTMwLjcyIDAtNTguMzY4IDE1LjM2LTc1Ljc3NiAzOC45MTItMTYuMzg0LTIzLjU1Mi00NC4wMzItMzguOTEyLTc1Ljc3Ni0zOC45MTItNDguMTI4IDAtODguMDY0IDM2Ljg2NC05Mi4xNiA4My45NjhDMzkwLjE0NCA3NTYuNzM2IDQ0OC41MTIgNzc4LjI0IDUxMiA3NzguMjRjNjMuNDg4IDAgMTIxLjg1Ni0yMS41MDQgMTY3LjkzNi01OC4zNjgtNC4wOTYtNDcuMTA0LTQ0LjAzMi04My45NjgtOTIuMTYtODMuOTY4eiIgZmlsbD0iI0Y0NDQ0NCIgcC1pZD0iMTk1OCI+PC9wYXRoPjxwYXRoIGQ9Ik0xMDAwLjQ0OCAyNTEuOTA0Yy05OS4zMjgtMzYuODY0LTIwNi44NDgtNDYuMDgtMzExLjI5Ni0yNS42TDUxMiAyNTZsLTE3Ny4xNTItMjkuNjk2Yy0xMDQuNDQ4LTIwLjQ4LTIxMS45NjgtMTIuMjg4LTMxMS4yOTYgMjUuNi03LjE2OCAwLTEzLjMxMiA2LjE0NC0xMy4zMTIgMTMuMzEydjM5LjkzNmMwIDEyLjI4OCAxMS4yNjQgMjIuNTI4IDIzLjU1MiAyMC40OGw5LjIxNi0xLjAyNGMxMi4yODgtMi4wNDggMjMuNTUyIDguMTkyIDIzLjU1MiAyMC40OGwtNy4xNjggNzMuNzI4Yy03LjE2OCA3Ni44IDUzLjI0OCAxNDMuMzYgMTMwLjA0OCAxNDMuMzZoMTQ1LjQwOGM0My4wMDggMCA4MS45Mi0yNi42MjQgOTcuMjgtNjcuNTg0bDQzLjAwOC0xMTcuNzZjMTIuMjg4LTMyLjc2OCA1OC4zNjgtMzIuNzY4IDY5LjYzMiAwbDQzLjAwOCAxMTcuNzZjMTUuMzYgNDAuOTYgNTMuMjQ4IDY3LjU4NCA5Ny4yOCA2Ny41ODRoMTQ1LjQwOGM3Ny44MjQgMCAxMzguMjQtNjYuNTYgMTMwLjA0OC0xNDMuMzZsLTcuMTY4LTczLjcyOGMwLTEyLjI4OCAxMS4yNjQtMjIuNTI4IDIzLjU1Mi0yMC40OGw5LjIxNiAxLjAyNGMxMi4yODggMi4wNDggMjMuNTUyLTguMTkyIDIzLjU1Mi0yMC40OFYyNzEuMzZjNC4wOTYtOS4yMTYtMS4wMjQtMTYuMzg0LTkuMjE2LTE5LjQ1NnoiIGZpbGw9IiMzMzMzMzMiIHAtaWQ9IjE5NTkiPjwvcGF0aD48cGF0aCBkPSJNMzAuNzIgMjg3Ljc0NGExNS4zNiAxNS4zNiAwIDEgMCAzMC43MiAwIDE1LjM2IDE1LjM2IDAgMSAwLTMwLjcyIDB6TTk2Mi41NiAyODcuNzQ0YTE1LjM2IDE1LjM2IDAgMSAwIDMwLjcyIDAgMTUuMzYgMTUuMzYgMCAxIDAtMzAuNzIgMHpNMTQ0LjM4NCA0NzQuMTEyczEzLjMxMiAzNC44MTYgNjQuNTEyIDI5LjY5NmMwIDAgNDMuMDA4LTM0LjgxNiA1MS4yLTU1LjI5NnM0My4wMDgtMzguOTEyIDQzLjAwOC0zOC45MTIgMzguOTEyLTM0LjgxNiA0Ny4xMDQtNTEuMmM4LjE5Mi0xNy40MDggNTUuMjk2LTQ3LjEwNCA1NS4yOTYtNDcuMTA0cy01MS4yLTE3LjQwOC04Ni4wMTYtMTMuMzEyYzAgMC0xOS40NTYgMjMuNTUyLTMxLjc0NCA0NS4wNTYgMCAwLTEzLjMxMiAxMy4zMTItMjkuNjk2IDIxLjUwNC0xNy40MDggOC4xOTItNDcuMTA0IDM4LjkxMi01NS4yOTYgNjAuNDE2cy01OC4zNjggNDkuMTUyLTU4LjM2OCA0OS4xNTJ6IG00OTMuNTY4IDBzMTMuMzEyIDM0LjgxNiA2NC41MTIgMjkuNjk2YzAgMCA0My4wMDgtMzQuODE2IDUxLjItNTUuMjk2czQzLjAwOC0zOC45MTIgNDMuMDA4LTM4LjkxMiAzOC45MTItMzQuODE2IDQ3LjEwNC01MS4yYzguMTkyLTE3LjQwOCA1NS4yOTYtNDcuMTA0IDU1LjI5Ni00Ny4xMDRzLTUxLjItMTcuNDA4LTg2LjAxNi0xMy4zMTJjMCAwLTE5LjQ1NiAyMy41NTItMzEuNzQ0IDQ1LjA1NiAwIDAtMTMuMzEyIDEzLjMxMi0yOS42OTYgMjEuNTA0LTE3LjQwOCA4LjE5Mi00Ny4xMDQgMzguOTEyLTU1LjI5NiA2MC40MTYtOC4xOTIgMjEuNTA0LTU4LjM2OCA0OS4xNTItNTguMzY4IDQ5LjE1MnoiIGZpbGw9IiNGRkZGRkYiIHAtaWQ9IjE5NjAiPjwvcGF0aD48L3N2Zz4="
                              class = "hideImg2" alt="窗口显隐" margin-left='auto' margin-right='auto'>
                          <div class="promptText">窗口显隐</div>
                      </a>
                      <a href="#" class="jsCard option7">
                          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzA0NDU5NzA4MTU1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIxMTIzIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik04OTguNzY0OCAzOTcuNzcyOGMtMTYuOTQ3MiAwLTMwLjcyLTEzLjc3MjgtMzAuNzItMzAuNzJWMTk3LjM3NmMwLTI2Ljk4MjQtMjEuOTY0OC00OC45OTg0LTQ4Ljk5ODQtNDguOTk4NGgtMTcwLjk1NjhjLTE2Ljk0NzIgMC0zMC43Mi0xMy43NzI4LTMwLjcyLTMwLjcyczEzLjc3MjgtMzAuNzIgMzAuNzItMzAuNzJoMTcwLjk1NjhjNjAuODc2OCAwIDExMC40Mzg0IDQ5LjUxMDQgMTEwLjQzODQgMTEwLjQzODR2MTY5LjY3NjhjMCAxNi45OTg0LTEzLjc3MjggMzAuNzItMzAuNzIgMzAuNzJ6TTgxOC40MzIgOTIzLjE4NzJoLTE2OS42NzY4Yy0xNi45NDcyIDAtMzAuNzItMTMuNzcyOC0zMC43Mi0zMC43MnMxMy43NzI4LTMwLjcyIDMwLjcyLTMwLjcyaDE2OS42NzY4YzI2Ljk4MjQgMCA0OC45OTg0LTIxLjk2NDggNDguOTk4NC00OC45OTg0di0xNzAuOTU2OGMwLTE2Ljk0NzIgMTMuNzcyOC0zMC43MiAzMC43Mi0zMC43MnMzMC43MiAxMy43NzI4IDMwLjcyIDMwLjcydjE3MC45NTY4Yy0wLjA1MTIgNjAuOTI4LTQ5LjU2MTYgMTEwLjQzODQtMTEwLjQzODQgMTEwLjQzODR6TTEyOC4wNTEyIDM5Ny43NzI4Yy0xNi45NDcyIDAtMzAuNzItMTMuNzcyOC0zMC43Mi0zMC43MlYxOTcuMzc2YzAtNjAuODc2OCA0OS41MTA0LTExMC40Mzg0IDExMC40Mzg0LTExMC40Mzg0aDE3MC45NTY4YzE2Ljk0NzIgMCAzMC43MiAxMy43NzI4IDMwLjcyIDMwLjcycy0xMy43NzI4IDMwLjcyLTMwLjcyIDMwLjcyaC0xNzEuMDA4Yy0yNi45ODI0IDAtNDguOTk4NCAyMS45NjQ4LTQ4Ljk5ODQgNDguOTk4NHYxNjkuNjc2OGMwLjA1MTIgMTYuOTk4NC0xMy43MjE2IDMwLjcyLTMwLjY2ODggMzAuNzJ6TTM3OC4wNjA4IDkyMy4xODcySDIwOC4zODRjLTYwLjg3NjggMC0xMTAuNDM4NC00OS41MTA0LTExMC40Mzg0LTExMC40Mzg0di0xNzAuOTU2OGMwLTE2Ljk0NzIgMTMuNzcyOC0zMC43MiAzMC43Mi0zMC43MnMzMC43MiAxMy43NzI4IDMwLjcyIDMwLjcydjE3MC45NTY4YzAgMjcuMDMzNiAyMS45NjQ4IDQ4Ljk5ODQgNDguOTk4NCA0OC45OTg0aDE2OS42NzY4YzE2Ljk0NzIgMCAzMC43MiAxMy43NzI4IDMwLjcyIDMwLjcycy0xMy43NzI4IDMwLjcyLTMwLjcyIDMwLjcyeiIgZmlsbD0iIzQ3NDc0NyIgcC1pZD0iMjExMjQiPjwvcGF0aD48cGF0aCBkPSJNNTI3LjgyMDggNTY1LjQwMTZjLTk0Ljc3MTIgMC0xNzEuOTI5Ni03Ny4xMDcyLTE3MS45Mjk2LTE3MS45Mjk2IDAtOTQuNzcxMiA3Ny4xMDcyLTE3MS44Nzg0IDE3MS45Mjk2LTE3MS44Nzg0IDk0Ljc3MTIgMCAxNzEuODc4NCA3Ny4xMDcyIDE3MS44Nzg0IDE3MS44Nzg0IDAgOTQuNzcxMi03Ny4xMDcyIDE3MS45Mjk2LTE3MS44Nzg0IDE3MS45Mjk2eiBtMC0yODIuMzY4Yy02MC45MjggMC0xMTAuNDg5NiA0OS41NjE2LTExMC40ODk2IDExMC40Mzg0czQ5LjU2MTYgMTEwLjQ4OTYgMTEwLjQ4OTYgMTEwLjQ4OTYgMTEwLjQzODQtNDkuNTYxNiAxMTAuNDM4NC0xMTAuNDg5Ni00OS41MTA0LTExMC40Mzg0LTExMC40Mzg0LTExMC40Mzg0eiIgZmlsbD0iIzMzNkJGRiIgcC1pZD0iMjExMjUiPjwvcGF0aD48cGF0aCBkPSJNNzUxLjY2NzIgNzkzLjQ5NzZjLTE2Ljk0NzIgMC0zMC43Mi0xMy43NzI4LTMwLjcyLTMwLjcyIDAtMTA2LjQ5Ni04Ni42MzA0LTE5My4xMjY0LTE5My4xMjY0LTE5My4xMjY0cy0xOTMuMTc3NiA4Ni42MzA0LTE5My4xNzc2IDE5My4xMjY0YzAgMTYuOTQ3Mi0xMy43NzI4IDMwLjcyLTMwLjcyIDMwLjcycy0zMC43Mi0xMy43NzI4LTMwLjcyLTMwLjcyYzAtMTQwLjM5MDQgMTE0LjIyNzItMjU0LjU2NjQgMjU0LjYxNzYtMjU0LjU2NjQgMTQwLjM5MDQgMCAyNTQuNTY2NCAxMTQuMjI3MiAyNTQuNTY2NCAyNTQuNTY2NCAwIDE2Ljk0NzItMTMuNzIxNiAzMC43Mi0zMC43MiAzMC43MnoiIGZpbGw9IiMzMzZCRkYiIHAtaWQ9IjIxMTI2Ij48L3BhdGg+PC9zdmc+"
                              class = "verifyCodeImg1" margin-left='auto' margin-right='auto'>
                          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzA0NDYwNDcwNDY4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIxOTc5IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik04OTguNzY0OCAzOTcuNzcyOGMtMTYuOTQ3MiAwLTMwLjcyLTEzLjc3MjgtMzAuNzItMzAuNzJWMTk3LjM3NmMwLTI2Ljk4MjQtMjEuOTY0OC00OC45OTg0LTQ4Ljk5ODQtNDguOTk4NGgtMTcwLjk1NjhjLTE2Ljk0NzIgMC0zMC43Mi0xMy43NzI4LTMwLjcyLTMwLjcyczEzLjc3MjgtMzAuNzIgMzAuNzItMzAuNzJoMTcwLjk1NjhjNjAuODc2OCAwIDExMC40Mzg0IDQ5LjUxMDQgMTEwLjQzODQgMTEwLjQzODR2MTY5LjY3NjhjMCAxNi45OTg0LTEzLjc3MjggMzAuNzItMzAuNzIgMzAuNzJ6TTgxOC40MzIgOTIzLjE4NzJoLTE2OS42NzY4Yy0xNi45NDcyIDAtMzAuNzItMTMuNzcyOC0zMC43Mi0zMC43MnMxMy43NzI4LTMwLjcyIDMwLjcyLTMwLjcyaDE2OS42NzY4YzI2Ljk4MjQgMCA0OC45OTg0LTIxLjk2NDggNDguOTk4NC00OC45OTg0di0xNzAuOTU2OGMwLTE2Ljk0NzIgMTMuNzcyOC0zMC43MiAzMC43Mi0zMC43MnMzMC43MiAxMy43NzI4IDMwLjcyIDMwLjcydjE3MC45NTY4Yy0wLjA1MTIgNjAuOTI4LTQ5LjU2MTYgMTEwLjQzODQtMTEwLjQzODQgMTEwLjQzODR6TTEyOC4wNTEyIDM5Ny43NzI4Yy0xNi45NDcyIDAtMzAuNzItMTMuNzcyOC0zMC43Mi0zMC43MlYxOTcuMzc2YzAtNjAuODc2OCA0OS41MTA0LTExMC40Mzg0IDExMC40Mzg0LTExMC40Mzg0aDE3MC45NTY4YzE2Ljk0NzIgMCAzMC43MiAxMy43NzI4IDMwLjcyIDMwLjcycy0xMy43NzI4IDMwLjcyLTMwLjcyIDMwLjcyaC0xNzEuMDA4Yy0yNi45ODI0IDAtNDguOTk4NCAyMS45NjQ4LTQ4Ljk5ODQgNDguOTk4NHYxNjkuNjc2OGMwLjA1MTIgMTYuOTk4NC0xMy43MjE2IDMwLjcyLTMwLjY2ODggMzAuNzJ6TTM3OC4wNjA4IDkyMy4xODcySDIwOC4zODRjLTYwLjg3NjggMC0xMTAuNDM4NC00OS41MTA0LTExMC40Mzg0LTExMC40Mzg0di0xNzAuOTU2OGMwLTE2Ljk0NzIgMTMuNzcyOC0zMC43MiAzMC43Mi0zMC43MnMzMC43MiAxMy43NzI4IDMwLjcyIDMwLjcydjE3MC45NTY4YzAgMjcuMDMzNiAyMS45NjQ4IDQ4Ljk5ODQgNDguOTk4NCA0OC45OTg0aDE2OS42NzY4YzE2Ljk0NzIgMCAzMC43MiAxMy43NzI4IDMwLjcyIDMwLjcycy0xMy43NzI4IDMwLjcyLTMwLjcyIDMwLjcyeiIgZmlsbD0iI2ZmZmZmZiIgcC1pZD0iMjE5ODAiPjwvcGF0aD48cGF0aCBkPSJNNTI3LjgyMDggNTY1LjQwMTZjLTk0Ljc3MTIgMC0xNzEuOTI5Ni03Ny4xMDcyLTE3MS45Mjk2LTE3MS45Mjk2IDAtOTQuNzcxMiA3Ny4xMDcyLTE3MS44Nzg0IDE3MS45Mjk2LTE3MS44Nzg0IDk0Ljc3MTIgMCAxNzEuODc4NCA3Ny4xMDcyIDE3MS44Nzg0IDE3MS44Nzg0IDAgOTQuNzcxMi03Ny4xMDcyIDE3MS45Mjk2LTE3MS44Nzg0IDE3MS45Mjk2eiBtMC0yODIuMzY4Yy02MC45MjggMC0xMTAuNDg5NiA0OS41NjE2LTExMC40ODk2IDExMC40Mzg0czQ5LjU2MTYgMTEwLjQ4OTYgMTEwLjQ4OTYgMTEwLjQ4OTYgMTEwLjQzODQtNDkuNTYxNiAxMTAuNDM4NC0xMTAuNDg5Ni00OS41MTA0LTExMC40Mzg0LTExMC40Mzg0LTExMC40Mzg0eiIgZmlsbD0iI2ZmZmZmZiIgcC1pZD0iMjE5ODEiPjwvcGF0aD48cGF0aCBkPSJNNzUxLjY2NzIgNzkzLjQ5NzZjLTE2Ljk0NzIgMC0zMC43Mi0xMy43NzI4LTMwLjcyLTMwLjcyIDAtMTA2LjQ5Ni04Ni42MzA0LTE5My4xMjY0LTE5My4xMjY0LTE5My4xMjY0cy0xOTMuMTc3NiA4Ni42MzA0LTE5My4xNzc2IDE5My4xMjY0YzAgMTYuOTQ3Mi0xMy43NzI4IDMwLjcyLTMwLjcyIDMwLjcycy0zMC43Mi0xMy43NzI4LTMwLjcyLTMwLjcyYzAtMTQwLjM5MDQgMTE0LjIyNzItMjU0LjU2NjQgMjU0LjYxNzYtMjU0LjU2NjQgMTQwLjM5MDQgMCAyNTQuNTY2NCAxMTQuMjI3MiAyNTQuNTY2NCAyNTQuNTY2NCAwIDE2Ljk0NzItMTMuNzIxNiAzMC43Mi0zMC43MiAzMC43MnoiIGZpbGw9IiNmZmZmZmYiIHAtaWQ9IjIxOTgyIj48L3BhdGg+PC9zdmc+"
                              class = "verifyCodeImg2" margin-left='auto' margin-right='auto'>
                          <div class="promptText">填写验证码</div>
                      </a>
                      <a href="#" class="jsCard option8" id="movedCard">
                          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzA0NDYxMjAzNTk3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjUwOTYyIiBkYXRhLXNwbS1hbmNob3ItaWQ9ImEzMTN4LnNlYXJjaF9pbmRleC4wLmk1NC43OTAzM2E4MWdBVUx5WiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNODMwLjEgMzEwLjRMMzkyLjcgOTEuN2MtMC41LTAuMy0xLTAuMy0xLjUtMC42LTAuOC0wLjQtMS43LTAuNi0yLjUtMC45LTQuNy0xLjgtOS40LTIuOS0xNC4xLTIuOS0wLjMgMC0wLjUgMC4xLTAuNyAwLjEtNS4xIDAuMS0xMC4xIDEuMS0xNC44IDMtMi4yIDAuOS0zLjkgMi42LTUuOSAzLjktMi40IDEuNS01LjEgMi44LTcuMSA0LjgtMS4zIDEuMy0yLjEgMy4xLTMuMiA0LjYtMiAyLjctNC4zIDUuMS01LjYgOC4zLTIuMSA0LjktMy4zIDEwLjMtMy4zIDE1Ljl2NjUzLjRjMC4yIDAgMC40IDAgMC42LTAuMSAxLjcgMjAuOCAxOC44IDM3LjUgNDAgMzcuNXMzOC4zLTE2LjcgNDAtMzcuNWMwLjIgMCAwLjQgMCAwLjYgMC4xVjU5MC42bDQxNC45LTIwNy41YzMwLTE1IDMwLTU3LjcgMC03Mi43eiIgZmlsbD0iIzAwOUY3MiIgcC1pZD0iNTA5NjMiPjwvcGF0aD48cGF0aCBkPSJNNDU3LjkgNzIzVjc4MS40YzAgNC44LTAuOCA5LjUtMi4zIDEzLjktOCAzNy44LTQxLjggNjYuMi04MSA2Ni4ycy03Mi45LTI4LjMtODEtNjYuMmMtMS41LTQuNC0yLjMtOS4xLTIuMy0xMy45di02MWMtNzAuOSAxNy40LTEyMC42IDU3LjctMTIwLjYgMTA0LjYgMCA2Mi44IDg5LjEgMTEzLjggMTk5LjEgMTEzLjhTNTY4LjkgODg3LjkgNTY4LjkgODI1YzAtNDQuOC00NS4zLTgzLjQtMTExLTEwMnoiIGZpbGw9IiNGOURCODgiIHAtaWQ9IjUwOTY0IiBkYXRhLXNwbS1hbmNob3ItaWQ9ImEzMTN4LnNlYXJjaF9pbmRleC4wLmk1My43OTAzM2E4MWdBVUx5WiIgY2xhc3M9IiI+PC9wYXRoPjwvc3ZnPg=="
                              class = "moveImg1" margin-left='auto' margin-right='auto'>
                          <div class="promptText">移动</div>
                      </a>
                      <a href="#" class="jsCard option9" id="tipsCard">
                          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzAzODcwMTM1ODMyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE1NjQ2IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik00OTguMzE3Nzg1IDk0LjcwMDMwOEM1MDEuNzc1NzU0IDg1LjAyNTQ3NyA0OTQuNjUzMDQ2IDc0LjgzMDc2OSA0ODQuNTMxMiA3NC44MzA3NjljLTYuMDYxMjkyIDAtMTEuNDg2NTIzIDMuNzE1OTM4LTEzLjY4MjIxNSA5LjQ2NDEyMy05LjQwMzA3NyAyNC42NjY1ODUtMzEuODQyNDYyIDk3LjczMjkyMy0yNS43NTE2MzEgMjE4Ljk2NjY0NiA5LjExMTYzMS0xLjY3Mzg0NiAxOC4yOTQxNTQtMy4xMDE1MzggMjcuNjI2MzM4LTQuMDg2MTUzLTMuMzAyNC01Ni43ODQ3MzgtMC4yNzE3NTQtMTMyLjA4NjE1NCAyNS41OTQwOTMtMjA0LjQ3NTA3NyIgZmlsbD0iIzEzMjI3YSIgcC1pZD0iMTU2NDciPjwvcGF0aD48cGF0aCBkPSJNNzM4LjU2OTg0NiAxNi43OTE2MzFjMC41Mzk1NjktOS4wNDI3MDgtNi43NTQ0NjItMTYuNjkxMi0xNS44NDA0OTItMTYuNjkxMi04LjM1MzQ3NyAwLTE1LjI2NzQ0NiA2LjQtMTUuODA3MDE2IDE0LjcyNTkwNy0zLjExMTM4NSA0Ny44NzAwMzEtMTguMjU0NzY5IDIwMS4zNjM2OTItODYuOTU3MjkyIDI5Ni45MjA2MTZhMzc0LjY4OTQ3NyAzNzQuNjg5NDc3IDAgMCAxIDM2Ljc3MTQ0NiAxMy4wOTE0NDZjMTEuNDg4NDkyLTE2LjU1NTMyMyA2OS44ODgtMTA5LjY1MDcwOCA4MS44MzMzNTQtMzA4LjA0Njc2OSIgZmlsbD0iIzEzMjI3YSIgcC1pZD0iMTU2NDgiPjwvcGF0aD48cGF0aCBkPSJNMjA1Ljc0NTIzMSAzNDUuMjk4NzA4QzE5OC44ODY0IDMzOS4yMTk2OTIgMTg4LjA2MzUwOCAzNDQuMjgyNTg1IDE4OC4wNjM1MDggMzUzLjQ5NjYxNWMwIDMuNjkwMzM4IDEuODE5NTY5IDcuMDg1MjkyIDQuOTExMjYxIDkuMDc0MjE2IDkuMzUxODc3IDYuMDA4MTIzIDMxLjU2Njc2OSAxOS41MDUyMzEgNjIuMzIyMjE2IDMzLjI0NDU1NEEzODIuODQ0MDYyIDM4Mi44NDQwNjIgMCAwIDEgMjY4LjgwMTk2OSAzODMuODMwNjQ2Yy0yMS42MDQ0MzEtOC43MjM2OTItNDMuMjgzNjkyLTIwLjk5Mzk2OS02My4wNTY3MzgtMzguNTMxOTM4TTQ3MS44ODg3MzggMjk5LjM4MjE1NGMyLjgzNzY2MiA0Ny41NDMxMzggMTAuMjU1NzU0IDgyLjAyNDM2OSAxMi4yMjQ5ODUgOTAuNTUzMTA4IDAuMjg3NTA4IDEuMjMwNzY5IDEuNDQxNDc3IDIuMDIwNDMxIDIuNzAxNzg1IDEuOTM1NzUzYTE2OC41MjA4NjIgMTY4LjUyMDg2MiAwIDAgMCAyMS4wODY1MjMtMi42Mjg5MjNjMjcuMTk5MDE1LTUuMTczMTY5IDUwLjY3ODE1NC0xNi44MjUxMDggNzAuOTY5MTA3LTMyLjk4ODU1NGExODguOTI0MDYyIDE4OC45MjQwNjIgMCAwIDAgNy40NDc2MzEtNi4yNjgwNjFjMTIuMTg1Ni0xMC43ODk0MTUgMjMuMTQyNC0yMy4yMjkwNDYgMzMuMDA2Mjc3LTM2Ljg2NzkzOUEzNzguNzMwMzM4IDM3OC43MzAzMzggMCAwIDAgNTExLjA5MDIxNSAyOTcuMzUzODQ2Yy02LjY2Mzg3NyAwLTEzLjI4NjQgMC4xNjczODUtMTkuODU1NzUzIDAuNTE1OTM5LTAuMzYwMzY5IDAuMDE5NjkyLTAuNzA4OTIzIDAuMDYzMDE1LTEuMDU5NDQ3IDAuMDgyNzA3LTYuMTQ0IDAuMzM2NzM4LTEyLjIzODc2OSAwLjc4NzY5Mi0xOC4yODgyNDYgMS40MTk4MTZsLTAuMjU0MDMxIDAuMDMxNTA3YzAuMDc0ODMxLTAuMDA5ODQ2IDAuMTY5MzU0LTAuMDA5ODQ2IDAuMjU2LTAuMDE5NjkyIiBmaWxsPSIjMTMyMjdhIiBwLWlkPSIxNTY0OSI+PC9wYXRoPjxwYXRoIGQ9Ik0yNzAuODMwMjc3IDM4NS43NDg2NzdjNTYuNzAyMDMxIDIyLjg2Mjc2OSAxMTIuODQwODYyIDIwLjY5MjY3NyAxMzMuMTg0OTg1IDE4LjgzMzcyMyAyLjQ5MzA0Ni0wLjIzNjMwOCAzLjA3NTkzOC0zLjU2MDM2OSAwLjg5MDA5Mi00Ljc4OTE2OS0zMC4yMzM2LTE2LjgwMzQ0Ni01NC43MDUyMzEtMzUuNTcyMTg1LTc0LjUxNzY2Mi01NS4yNzIzNjkgMi4wNDgtMS4xNDQxMjMgNC4wNzYzMDgtMi4yODgyNDYgNi4xMzQxNTQtMy4zOTg4OTNhNDA1Ljk4MjUyMyA0MDUuOTgyNTIzIDAgMCAxIDEzLjkzMjMwOC03LjA3NzQxNWMxLjkwMDMwOC0wLjkwNzgxNSAzLjgyMDMwOC0xLjc3MjMwOCA1Ljc0MjI3Ny0yLjY1MDU4NSAzOS4wNDE5NjkgNDEuMzc3NDc3IDgxLjg1MTA3NyA1Ni43MTU4MTUgOTQuNTMyOTIzIDYwLjUzNDE1NCAxLjc4MjE1NCAwLjU0MzUwOCAzLjQxNjYxNS0xLjAyNzkzOCAzLjE1MDc2OS0yLjg3NTA3Ny00LjQ5NzcyMy0zMS4wMjEyOTItNy4xMjg2MTUtNTkuNjQ4LTguNDc3NTM4LTg2LjEwMjY0Ni04LjQ2NzY5MiAxLjUzOTkzOC0xNi44MDkzNTQgMy40MjA1NTQtMjUuMDY4MzA4IDUuNTI1NjYyLTIuNzAzNzU0IDAuNjczNDc3LTUuMzM2NjE1IDEuNTA4NDMxLTguMDEwODMxIDIuMjU2NzM4LTUuNTE3Nzg1IDEuNTM3OTY5LTExLjAyNTcyMyAzLjExMTM4NS0xNi40MzcxNjkgNC44OTU1MDgtMy4xMzEwNzcgMS4wMjQtNi4yMDg5ODUgMi4xNzAwOTItOS4yOTY3MzkgMy4yNjg5MjNhMzcxLjA2MjE1NCAzNzEuMDYyMTU0IDAgMCAwLTE0LjQyMjY0NiA1LjQ3NDQ2MSAzMjQuMTc0NzY5IDMyNC4xNzQ3NjkgMCAwIDAtOS42Njg5MjMgNC4xMDM4NzdjLTIuMTQyNTIzIDAuOTMxNDQ2LTQuMzUwMDMxIDEuNzY0NDMxLTYuNDgyNzA3IDIuNzM3MjMxLTM4LjExODQtNDAuNDg5MzU0LTcyLjU5NzY2Mi0xMDUuODc1NjkyLTcxLjc4MDQzMS0yMDkuODY4OCAwLjA3NDgzMS05LjM3MzUzOC03LjU2NTc4NS0xNi45NzQ3NjktMTYuODYyNTIzLTE2Ljk3NDc2OWExNi44NDg3MzggMTYuODQ4NzM4IDAgMCAwLTE2Ljc3Nzg0NiAxNS4wMzkwMTVjLTQuMTA3ODE1IDM3Ljg0MDczOC01LjYzNTkzOCAxNDAuMDQ3NzU0IDc5LjYwMjIxNSAyMjQuOTMxNDQ2LTIuNDYxNTM4IDEuMzc4NDYyLTQuODI4NTU0IDIuODc1MDc3LTcuMjQ2NzY5IDQuMjg1MDQ2LTEuNTA4NDMxIDAuODg2MTU0LTMuMDE0ODkyIDEuNzY0NDMxLTQuNTExNTA4IDIuNjcyMjQ3LTYuNzgyMDMxIDQuMTI1NTM4LTEzLjQ1NzcyMyA4LjQxMjU1NC0xOS45NjIwOTIgMTIuOTQ1NzIzLTAuNjU3NzIzIDAuNDU4ODMxLTEuMjkzNzg1IDAuOTYwOTg1LTEuOTUzNDc3IDEuNDMxNjNhNDAwLjgwNTQxNSA0MDAuODA1NDE1IDAgMCAwLTE3LjA2MzM4NSAxMi44NDcyNjJjLTEuNTU5NjMxIDEuMjUyNDMxLTMuMTA5NDE1IDIuNTAwOTIzLTQuNjU5MiAzLjc3NTAxNS0xLjM3ODQ2MiAxLjEzMjMwOC0yLjgyMTkwOCAyLjIxMTQ0Ni00LjE5MDUyMyAzLjM2NzM4NWEzNzUuNjY0MjQ2IDM3NS42NjQyNDYgMCAwIDAtMTMuNjE3MjMxIDEyLjExMDc2OWM0LjQ3MDE1NC00LjE3MDgzMSA5LjE3MDcwOC04LjA4MTcyMyAxMy44Mzk3NTQtMTIuMDI2MDkyIiBmaWxsPSIjMTMyMjdhIiBwLWlkPSIxNTY1MCI+PC9wYXRoPjxwYXRoIGQ9Ik04ODQuNzMyMDYyIDYxNC4zMTUzMjNDODY0LjU2OTEwOCA0ODIuNTE0NzA4IDc3Ni40NzU1NjkgMzczLjE2OTIzMSA2NTcuNDA0MDYyIDMyMy4yNDcyNjJjLTEuMjc0MDkyIDEuODQzMi0xLjk5NjggMi43OTA0LTEuOTk2OCAyLjc5MDQtMTMyLjQwMTIzMSAxNTQuODE2OTg1LTMwNS41MjAyNDYgMTEwLjU0NjcwOC0zOTkuNDk3ODQ3IDY4LjY3Mjk4NEMxODEuNTEzODQ2IDQ2My43NDU5NjkgMTM0Ljg5MDMzOCA1NjIuNDMwMDMxIDEzNC44OTAzMzggNjcyLjA2MzAxNWMwIDk3LjEyMjQ2MiAzNi41NzQ1MjMgMTg1LjY1MTIgOTYuNjQ1OTA4IDI1Mi41OTkxMzkgMTIuNzE1MzIzLTEzLjkyNjQgMjguNDU5MzIzLTI0Ljg4MTIzMSA0Ni4yOTY2MTYtMzEuNTI1NDE2IDI5LjUwODkyMy0xMC45NzY0OTIgNjEuMzc2OTg1LTEzLjg1MTU2OSA4My41NTY0My0xNC4yNjcwNzYgMzQuNDQ5NzIzLTAuNjU5NjkyIDY0LjEyOTk2OS0yMS43NTIxMjMgOTIuMTgzNjMxLTQxLjc3NzIzMSA4NC40MDkxMDgtNjAuMjMwODkyIDc0LjM2MDEyMy0xNTQuNjU5NDQ2IDc0LjM2MDEyMy0xODAuOTk5ODc3IDAtMzEuOTQwOTIzLTIxLjI0NjAzMS01My4yMzQyMTUtMTA2LjIyODE4NC0zMS45NDA5MjMtODQuOTgyMTU0IDIxLjI5NTI2Mi03NC4zNTgxNTQgMC03NC4zNTgxNTQgMCA1My4xMTQwOTItMTAuNjQ1NjYyIDQyLjQ5MDA5Mi0yMS4yOTMyOTIgNDIuNDkwMDkyLTIxLjI5MzI5My0xMC42MjIwMzEtMjEuMjkzMjkyLTQyLjQ5MDA5MiAxMC42NDc2MzEtNDIuNDkwMDkyIDEwLjY0NzYzMS0yNy4yMDQ5MjMgMC0yOC4yNzgxNTQtMjEuODM4NzY5LTI1LjUzNjk4NS0zNy41NDE0MTUgMS41ODEyOTItOS4wMzg3NjkgOC41ODE5MDgtMTYuMDg4NjE1IDE3LjUyNjE1NC0xOC4wMzgxNTQgMjcuMzg2MDkyLTUuOTM5MiA4OS43MTAyNzctMjUuNDU0Mjc3IDExNC4yMzcwNDYtODIuODMxNzU0IDMxLjg3MDAzMS03NC41Mjk0NzcgMTA2LjIyODE4NS00Mi41ODg1NTQgMTA2LjIyODE4NS00Mi41ODg1NTQgNTcuNzE0MjE1LTU3Ljg0NDE4NSA5Ni4wNjEwNDYtNzMuMDE1MTM4IDExNy40MTM0MTUtNzUuOTQzMzg0IDEwLjkyOTIzMS0xLjUxMjM2OSAyMC4zMjI0NjIgNy45MzIwNjIgMTguODk4NzA4IDE4Ljg5ODcwNy0xNS4zMDg4IDExOC4xNDc5MzgtODMuMiA4OC45ODU2LTgzLjIgODguOTg1Ni0xMC42MjAwNjIgMC0xMC42MjAwNjIgMTAuNjQ3NjMxLTEwLjYyMDA2MiAxMC42NDc2MzEgOTIuMDI0MTIzIDIwNy41MzEzMjMgNjcuNzkyNzM4IDQzNy4xODQ5ODUgNDcuMTk2NTU0IDU0OC45MDMzODUgMTQwLjI1MjU1NC01NS4wODcyNjIgMjM5LjYxNi0xOTEuODM2NTU0IDIzOS42MTYtMzUxLjkzNTAxNiAwLTE5LjYzMzIzMS0xLjQ5NjYxNS0zOC45MTM5NjktNC4zNzU2MzEtNTcuNzQ3NjkyIiBmaWxsPSIjMTMyMjdhIiBwLWlkPSIxNTY1MSI+PC9wYXRoPjxwYXRoIGQ9Ik01NzkuOTQwNDMxIDQyMS40MTUzODVjMTE2LjUxOTM4NS02MS4wNjE5MDggMTA1LjkyNDkyMy0zMC41MzA5NTQgMTA1LjkyNDkyMy0zMC41MzA5NTRDNzA3LjA1NDI3NyAzMzkuOTk5NTA4IDU3OS45NDA0MzEgNDIxLjQxNTM4NSA1NzkuOTQwNDMxIDQyMS40MTUzODUiIGZpbGw9IiMxMzIyN2EiIHAtaWQ9IjE1NjUyIj48L3BhdGg+PC9zdmc+"
                              class = "tipsImg1" alt="打赏" margin-left='auto' margin-right='auto'/>
                          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzAzOTExNDUzODc1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjY3NCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNDk5LjE3MjkyMzQ0IDEyMC43ODE1Mzg3NUM1MDIuNDE0NzY5MzcgMTExLjcxMTM4NDY5IDQ5NS43MzcyMzA2MiAxMDIuMTUzODQ1OTQgNDg2LjI0OCAxMDIuMTUzODQ1OTRjLTUuNjgyNDYxMjUgMC0xMC43Njg2MTUzMSAzLjQ4MzY5MTg3LTEyLjgyNzA3NjU2IDguODcyNjE1MzEtOC44MTUzODQ2OSAyMy4xMjQ5MjM0NC0yOS44NTIzMDgxMyA5MS42MjQ2MTUzMS0yNC4xNDIxNTQwNyAyMDUuMjgxMjMwNjIgOC41NDIxNTQwNi0xLjU2OTIzMDYyIDE3LjE1MDc2OTM3LTIuOTA3NjkxODggMjUuODk5NjkxODgtMy44MzA3Njg0My0zLjA5Ni01My4yMzU2OTE4OC0wLjI1NDc2OTM4LTEyMy44MzA3NjkzNyAyMy45OTQ0NjIxOS0xOTEuNjk1Mzg0NjkiIHAtaWQ9IjY3NSIgZmlsbD0iI2ZmZmZmZiI+PC9wYXRoPjxwYXRoIGQ9Ik03MjQuNDA5MjMwNjMgNDcuNzQyMTU0MDZjMC41MDU4NDU5NC04LjQ3NzUzODc1LTYuMzMyMzA4MTItMTUuNjQ4LTE0Ljg1MDQ2MTI1LTE1LjY0OC03LjgzMTM4NDY5IDAtMTQuMzEzMjMwNjIgNi0xNC44MTkwNzc1IDEzLjgwNTUzNzgxLTIuOTE2OTIzNDQgNDQuODc4MTU0MDYtMTcuMTEzODQ1OTQgMTg4Ljc3ODQ2MTI1LTgxLjUyMjQ2MTI1IDI3OC4zNjMwNzc1YTM1MS4yNzEzODQ2OSAzNTEuMjcxMzg0NjkgMCAwIDEgMzQuNDczMjMwNjIgMTIuMjczMjMwNjNjMTAuNzcwNDYxMjUtMTUuNTIwNjE1MzEgNjUuNTItMTAyLjc5NzUzODc1IDc2LjcxODc2OTM4LTI4OC43OTM4NDU5NCIgcC1pZD0iNjc2IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PHBhdGggZD0iTTIyNC44ODYxNTQwNiAzNTUuNzE3NTM4NzVDMjE4LjQ1NiAzNTAuMDE4NDYxMjUgMjA4LjMwOTUzODc1IDM1NC43NjQ5MjM0NCAyMDguMzA5NTM4NzUgMzYzLjQwMzA3NjU2YzAgMy40NTk2OTE4OCAxLjcwNTg0NTk0IDYuNjQyNDYxMjUgNC42MDQzMDcxOSA4LjUwNzA3NzUgOC43NjczODQ2OSA1LjYzMjYxNTMxIDI5LjU5Mzg0NTk0IDE4LjI4NjE1NDA2IDU4LjQyNzA3NzUgMzEuMTY2NzY5MzhBMzU4LjkxNjMwODEzIDM1OC45MTYzMDgxMyAwIDAgMSAyODQuMDAxODQ1OTQgMzkxLjg0MTIzMDYzYy0yMC4yNTQxNTQwNi04LjE3ODQ2MTI1LTQwLjU3ODQ2MTI1LTE5LjY4MTg0NTk0LTU5LjExNTY5MTg4LTM2LjEyMzY5MTg4TTQ3NC4zOTU2OTE4NyAzMTIuNjcwNzY5MzhjMi42NjAzMDgxMiA0NC41NzE2OTE4NyA5LjYxNDc2OTM3IDc2Ljg5Nzg0NTk0IDExLjQ2MDkyMzQ0IDg0Ljg5MzUzODc1IDAuMjY5NTM4NzUgMS4xNTM4NDU5NCAxLjM1MTM4NDY5IDEuODk0MTU0MDYgMi41MzI5MjM0NCAxLjgxNDc2ODQzYTE1Ny45ODgzMDgxMyAxNTcuOTg4MzA4MTMgMCAwIDAgMTkuNzY4NjE1MzEtMi40NjQ2MTUzMWMyNS40OTkwNzY1Ni00Ljg0OTg0NTk0IDQ3LjUxMDc2OTM4LTE1Ljc3MzUzODc1IDY2LjUzMzUzNzgxLTMwLjkyNjc2OTM3YTE3Ny4xMTYzMDgxMiAxNzcuMTE2MzA4MTIgMCAwIDAgNi45ODIxNTQwNy01Ljg3NjMwNzE5YzExLjQyNC0xMC4xMTUwNzY1NiAyMS42OTYtMjEuNzc3MjMwNjMgMzAuOTQzMzg0NjgtMzQuNTYzNjkyODFBMzU1LjA1OTY5MTg3IDM1NS4wNTk2OTE4NyAwIDAgMCA1MTEuMTQ3MDc2NTYgMzEwLjc2OTIzMDYzYy02LjI0NzM4NDY5IDAtMTIuNDU2IDAuMTU2OTIzNDQtMTguNjE0NzY4NDQgMC40ODM2OTI4MS0wLjMzNzg0NTk0IDAuMDE4NDYxMjUtMC42NjQ2MTUzMSAwLjA1OTA3NjU2LTAuOTkzMjMxNTYgMC4wNzc1Mzc4MS01Ljc2IDAuMzE1NjkxODctMTEuNDczODQ1OTQgMC43Mzg0NjEyNS0xNy4xNDUyMzA2MiAxLjMzMTA3NzVsLTAuMjM4MTU0MDcgMC4wMjk1Mzc4MWMwLjA3MDE1NDA2LTAuMDA5MjMwNjMgMC4xNTg3NjkzNy0wLjAwOTIzMDYzIDAuMjQtMC4wMTg0NjEyNSIgcC1pZD0iNjc3IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PHBhdGggZD0iTTI4NS45MDMzODQ2OSAzOTMuNjM5Mzg0NjljNTMuMTU4MTU0MDYgMjEuNDMzODQ1OTQgMTA1Ljc4ODMwODEzIDE5LjM5OTM4NDY5IDEyNC44NjA5MjM0NCAxNy42NTY2MTUzMSAyLjMzNzIzMDYzLTAuMjIxNTM4NzUgMi44ODM2OTE4Ny0zLjMzNzg0NTk0IDAuODM0NDYxMjUtNC40ODk4NDU5NC0yOC4zNDQtMTUuNzUzMjMwNjMtNTEuMjg2MTU0MDYtMzMuMzQ4OTIzNDQtNjkuODYwMzA4MTMtNTEuODE3ODQ1OTQgMS45Mi0xLjA3MjYxNTMxIDMuODIxNTM4NzUtMi4xNDUyMzA2MiA1Ljc1MDc2OTM4LTMuMTg2NDYyMThhMzgwLjYwODYxNTMxIDM4MC42MDg2MTUzMSAwIDAgMSAxMy4wNjE1Mzg3NS02LjYzNTA3NjU3YzEuNzgxNTM4NzUtMC44NTEwNzY1NiAzLjU4MTUzODc1LTEuNjYxNTM4NzUgNS4zODMzODQ2OC0yLjQ4NDkyMzQzIDM2LjYwMTg0NTk0IDM4Ljc5MTM4NDY5IDc2LjczNTM4NDY5IDUzLjE3MTA3NjU2IDg4LjYyNDYxNTMyIDU2Ljc1MDc2OTM3IDEuNjcwNzY5MzggMC41MDk1Mzg3NSAzLjIwMzA3NjU2LTAuOTYzNjkxODcgMi45NTM4NDU5My0yLjY5NTM4NDY4LTQuMjE2NjE1MzEtMjkuMDgyNDYxMjUtNi42ODMwNzY1Ni01NS45Mi03Ljk0NzY5MTg3LTgwLjcyMTIzMDYzLTcuOTM4NDYxMjUgMS40NDM2OTE4OC0xNS43NTg3NjkzNyAzLjIwNjc2OTM3LTIzLjUwMTUzODc1IDUuMTgwMzA4MTItMi41MzQ3NjkzNyAwLjYzMTM4NDY5LTUuMDAzMDc2NTYgMS40MTQxNTQwNi03LjUxMDE1NDA2IDIuMTE1NjkxODgtNS4xNzI5MjM0NCAxLjQ0MTg0NTk0LTEwLjMzNjYxNTMxIDIuOTE2OTIzNDQtMTUuNDA5ODQ1OTQgNC41ODk1Mzg3NS0yLjkzNTM4NDY5IDAuOTYtNS44MjA5MjM0NCAyLjAzNDQ2MTI1LTguNzE1NjkyODEgMy4wNjQ2MTUzMWEzNDcuODcwNzY5MzggMzQ3Ljg3MDc2OTM4IDAgMCAwLTEzLjUyMTIzMDYzIDUuMTMyMzA3MTkgMzAzLjkxMzg0NTk0IDMwMy45MTM4NDU5NCAwIDAgMC05LjA2NDYxNTMxIDMuODQ3Mzg0NjljLTIuMDA4NjE1MzEgMC44NzMyMzA2My00LjA3ODE1NDA2IDEuNjU0MTU0MDYtNi4wNzc1Mzc4MSAyLjU2NjE1NDA2LTM1LjczNi0zNy45NTg3NjkzNy02OC4wNjAzMDgxMy05OS4yNTg0NjEyNS02Ny4yOTQxNTQwNy0xOTYuNzUyIDAuMDcwMTU0MDYtOC43ODc2OTE4OC03LjA5MjkyMzQ0LTE1LjkxMzg0NTk0LTE1LjgwODYxNTMxLTE1LjkxMzg0NTk0YTE1Ljc5NTY5MTg4IDE1Ljc5NTY5MTg4IDAgMCAwLTE1LjcyOTIzMDYyIDE0LjA5OTA3NjU3Yy0zLjg1MTA3NjU2IDM1LjQ3NTY5MTg4LTUuMjgzNjkxODggMTMxLjI5NDc2OTM3IDc0LjYyNzA3NjU2IDIxMC44NzMyMzA2Mi0yLjMwNzY5MTg4IDEuMjkyMzA4MTMtNC41MjY3NjkzNyAyLjY5NTM4NDY5LTYuNzkzODQ1OTQgNC4wMTcyMzA2My0xLjQxNDE1NDA2IDAuODMwNzY5MzgtMi44MjY0NjEyNSAxLjY1NDE1NDA2LTQuMjI5NTM4NzUgMi41MDUyMzE1Ni02LjM1ODE1NDA2IDMuODY3NjkxODctMTIuNjE2NjE1MzEgNy44ODY3NjkzOC0xOC43MTQ0NjEyNSAxMi4xMzY2MTUzMS0wLjYxNjYxNTMxIDAuNDMwMTU0MDYtMS4yMTI5MjM0NCAwLjkwMDkyMzQ0LTEuODMxMzg0NjkgMS4zNDIxNTMxM2EzNzUuNzU1MDc2NTYgMzc1Ljc1NTA3NjU2IDAgMCAwLTE1Ljk5NjkyMzQzIDEyLjA0NDMwODEyYy0xLjQ2MjE1NDA2IDEuMTc0MTU0MDYtMi45MTUwNzY1NiAyLjM0NDYxNTMxLTQuMzY4IDMuNTM5MDc2NTYtMS4yOTIzMDgxMyAxLjA2MTUzODc1LTIuNjQ1NTM4NzUgMi4wNzMyMzA2Mi0zLjkyODYxNTMyIDMuMTU2OTIzNDRhMzUyLjE4NTIzMDYyIDM1Mi4xODUyMzA2MiAwIDAgMC0xMi43NjYxNTQwNiAxMS4zNTM4NDU5NGM0LjE5MDc2OTM4LTMuOTEwMTU0MDYgOC41OTc1Mzg3NS03LjU3NjYxNTMxIDEyLjk3NDc2OTM4LTExLjI3NDQ2MTI1IiBwLWlkPSI2NzgiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48cGF0aCBkPSJNODYxLjQzNjMwODEyIDYwNy45MjA2MTUzMUM4NDIuNTMzNTM4NzUgNDg0LjM1NzUzODc1IDc1OS45NDU4NDU5NCAzODEuODQ2MTU0MDYgNjQ4LjMxNjMwODEzIDMzNS4wNDQzMDgxM2MtMS4xOTQ0NjEyNSAxLjcyOC0xLjg3MiAyLjYxNi0xLjg3MjAwMDAxIDIuNjE2LTEyNC4xMjYxNTQwNiAxNDUuMTQwOTIzNDQtMjg2LjQyNTIzMDYyIDEwMy42Mzc1Mzg3NS0zNzQuNTI5MjMxNTYgNjQuMzgwOTIyNUMyMDIuMTY5MjMwNjMgNDY2Ljc2MTg0NTk0IDE1OC40NTk2OTE4NyA1NTkuMjc4MTU0MDYgMTU4LjQ1OTY5MTg3IDY2Mi4wNTkwNzY1NmMwIDkxLjA1MjMwODEyIDM0LjI4ODYxNTMxIDE3NC4wNDggOTAuNjA1NTM4NzYgMjM2LjgxMTY5MjgyIDExLjkyMDYxNTMxLTEzLjA1NiAyNi42ODA2MTUzMS0yMy4zMjYxNTQwNiA0My40MDMwNzc1LTI5LjU1NTA3NzUgMjcuNjY0NjE1MzEtMTAuMjkwNDYxMjUgNTcuNTQwOTIzNDQtMTIuOTg1ODQ1OTQgNzguMzM0MTUzMTItMTMuMzc1MzgzNzUgMzIuMjk2NjE1MzEtMC42MTg0NjEyNSA2MC4xMjE4NDU5NC0yMC4zOTI2MTUzMSA4Ni40MjIxNTQwNi0zOS4xNjYxNTQwNyA3OS4xMzM1Mzg3NS01Ni40NjY0NjEyNSA2OS43MTI2MTUzMS0xNDQuOTkzMjMwNjIgNjkuNzEyNjE1MzItMTY5LjY4NzM4NDY4IDAtMjkuOTQ0NjE1MzEtMTkuOTE4MTU0MDYtNDkuOTA3MDc2NTYtOTkuNTg4OTIyNS0yOS45NDQ2MTUzMi03OS42NzA3NjkzNyAxOS45NjQzMDgxMy02OS43MTA3NjkzNyAwLTY5LjcxMDc2OTM4IDAgNDkuNzk0NDYxMjUtOS45ODAzMDgxMyAzOS44MzQ0NjEyNS0xOS45NjI0NjEyNSAzOS44MzQ0NjEyNS0xOS45NjI0NjIxOC05Ljk1ODE1NDA2LTE5Ljk2MjQ2MTI1LTM5LjgzNDQ2MTI1IDkuOTgyMTU0MDYtMzkuODM0NDYxMjUgOS45ODIxNTQwNi0yNS41MDQ2MTUzMSAwLTI2LjUxMDc2OTM4LTIwLjQ3Mzg0NTk0LTIzLjk0MDkyMzQ0LTM1LjE5NTA3NjU2IDEuNDgyNDYxMjUtOC40NzM4NDU5NCA4LjA0NTUzODc1LTE1LjA4MzA3NjU2IDE2LjQzMDc2OTM4LTE2LjkxMDc2OTM4IDI1LjY3NDQ2MTI1LTUuNTY4IDg0LjEwMzM4NDY5LTIzLjg2MzM4NDY5IDEwNy4wOTcyMzA2Mi03Ny42NTQ3NjkzNyAyOS44NzgxNTQwNi02OS44NzEzODQ2OSA5OS41ODg5MjM0NC0zOS45MjY3NjkzNyA5OS41ODg5MjM0NC0zOS45MjY3NjkzOCA1NC4xMDcwNzY1Ni01NC4yMjg5MjM0NCA5MC4wNTcyMzA2My02OC40NTE2OTE4NyAxMTAuMDc1MDc2NTYtNzEuMTk2OTIyNSAxMC4yNDYxNTQwNi0xLjQxNzg0NTk0IDE5LjA1MjMwODEzIDcuNDM2MzA4MTMgMTcuNzE3NTM4NzUgMTcuNzE3NTM3ODEtMTQuMzUyIDExMC43NjM2OTE4Ny03OCA4My40MjQtNzggODMuNDI0LTkuOTU2MzA4MTMgMC05Ljk1NjMwODEzIDkuOTgyMTU0MDYtOS45NTYzMDgxMiA5Ljk4MjE1NDA3IDg2LjI3MjYxNTMxIDE5NC41NjA2MTUzMSA2My41NTU2OTE4OCA0MDkuODYwOTIzNDQgNDQuMjQ2NzY5MzcgNTE0LjU5NjkyMzQzIDEzMS40ODY3NjkzNy01MS42NDQzMDgxMyAyMjQuNjQtMTc5Ljg0Njc2OTM4IDIyNC42NC0zMjkuOTM5MDc3NSAwLTE4LjQwNjE1NDA2LTEuNDAzMDc2NTYtMzYuNDgxODQ1OTQtNC4xMDIxNTQwNi01NC4xMzg0NjEyNSIgcC1pZD0iNjc5IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PHBhdGggZD0iTTU3NS42OTQxNTQwNiA0MjcuMDc2OTIzNDRjMTA5LjIzNjkyMzQ0LTU3LjI0NTUzODc1IDk5LjMwNDYxNTMxLTI4LjYyMjc2OTM4IDk5LjMwNDYxNTMyLTI4LjYyMjc2OTM4QzY5NC44NjMzODQ2OSAzNTAuNzQ5NTM4NzUgNTc1LjY5NDE1NDA2IDQyNy4wNzY5MjM0NCA1NzUuNjk0MTU0MDYgNDI3LjA3NjkyMzQ0IiBwLWlkPSI2ODAiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48L3N2Zz4="
                              class = "tipsImg2" alt="打赏" margin-left='auto' margin-right='auto'/>
                          <div class="promptText">喝杯咖啡</div>
                      </a>
                      <div class="msgInfo" id="msgInfo">
                          <div id="userRemind">Notes</div>
                          <div id="notes">
                              <div id="noteText1">免费授权,请勿泛滥<br>有需要请直接联系我</div>
                              <div id="noteText2">&nbsp;</div> 
                          </div>
                          <div id="infoText1">&nbsp;&nbsp;</div>
                          <div id="infoText2">&nbsp;&nbsp;</div>
                      </div>
                  `;

      mainDiv.style.position = "fixed";
      mainDiv.style.left = "5%";
      mainDiv.style.top = "20%";
      mainDiv.className = "mainDiv";
      mainDiv.style.zIndex = "99";
      mainDiv.id = "mainDiv";
      setCSS();
      // 将 div 添加到 body 中
      document.body.appendChild(mainDiv);
    }

    // CSS

    function setCSS() {
      GM_addStyle(
        `
                  /* style.css */
      
                  :root {
                      --root-rem: 1;
                  }
                  
                  .mainDiv {
                      position: relative;
                      display: grid;
                      grid-template-columns: auto auto auto;
                      transition: gap 0.5s ease-in-out;
                      gap: calc(var(--root-rem)*0rem);
                      border-radius: calc(var(--root-rem)*0.375rem);
                      box-shadow: 0 0 calc(var(--root-rem)*0.3rem) rgba(0, 0, 0, 0.8);
                      font-family: -apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
                      overflow: hidden;
                  }
      
                  .mainDiv:hover {
                      gap: calc(var(--root-rem)*0.15rem);
      
                  }
      
                  .msgInfo {
                      position: absolute;
                      top: calc(var(--root-rem)*0rem);
                      left: calc(var(--root-rem)*0rem);
                      width: 100%;
                      height: 100%;
                      background: linear-gradient(0deg, #03a9f4, #cc39a4, #ffb5d2);
                      border-radius: calc(var(--root-rem)*0.375rem);
                      box-shadow: inset 0 0 calc(var(--root-rem)*30rem) #fff,
                          inset 0 0 calc(var(--root-rem)*4.5rem) #fff,
                          inset 0 0 calc(var(--root-rem)*9.75rem) #fff;
                      display: flex;
                      flex-direction: column;
                      justify-content: left;
                      line-height: calc(var(--root-rem)*0.45rem);
                      letter-spacing: calc(var(--root-rem)*0.015rem);
                      transition: 0.5s ease-in-out;
                      opacity: 1;
                      pointer-events: none;
                  }
      
                  .jsCard {
                      width: calc(var(--root-rem)*1.5rem);
                      aspect-ratio: 1;
                      background: white;
                      transition: 0.5s ease-in-out;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      box-shadow: 0 calc(var(--root-rem)*0.375rem) calc(var(--root-rem)*3rem) #0001;
                      border-radius: calc(var(--root-rem)*0.375rem);
                      transition: opacity 0.5s ease-in-out,
                          background 0.9s ease-in-out;
                      opacity: 1;
                      line-height: calc(var(--root-rem)*0.6rem);
                      font-size: calc(var(--root-rem)*0.6rem);
                      text-decoration: none;
                      cursor: pointer;
                  }
      
                  .mainDiv .jsCard:hover {
                      transition: background 0.2s ease-in-out;
                  }
      
                  .no-select {
                      user-select: none;
                  }

                  .add-Button {
                      height: 0.68rem;
                      color: white;
                      text-align: center;
                      font-size: calc(var(--root-rem)*0.25rem);
                      border-radius: calc(var(--root-rem)*0.0625rem);
                      border-style: none;
                      background-color: #409eff;
                      padding: calc(var(--root-rem)*0.185rem) calc(var(--root-rem)*0.32rem);
                      cursor: pointer;
                      margin: 0 calc(var(--root-rem)*0.125rem);
                  }

                  .add-Button:hover {
                      background-color: #66b1ff;
                  }
      
                  .option8 {
                      cursor: move;
                  }
      
                  .mainDiv:hover .msgInfo {
                      opacity: 0;
                      transition: opacity 0.5s ease-in-out;
                  }
      
                  .jsCard:hover {
                      background-color: #0080cc;
                  }
      
                  .jsCard:hover .promptText{
                      color: #ffffff;
                  }
      
                  .jsCard:hover .colorImg {
                      filter: invert(100%);
                  }
                  
                  @keyframes fade-in {
                      0% { opacity: 0; transform: translateX(-200px); }
                      100% { opacity: 1; transform: none; }
                  }
      
                  @keyframes fade-out {
                      0% { opacity: 1; transform: none; }
                      100% { opacity: 0; transform: translateX(-200px); }
                  }
      
                  #userRemind {
                      font-weight: bold;
                      font-size: calc(var(--root-rem)*0.495rem);
                      text-align: center;
                      color: red;
                      animation: fade-in 1200ms ease forwards;
                  }
                  
                  .mainDiv:hover #userRemind,
                  .mainDiv:hover #infoText1,
                  .mainDiv:hover #infoText2,
                  .mainDiv:hover #noteText1,
                  .mainDiv:hover #noteText2 {
                      opacity: 0;
                  }
      
                  .mainDiv:hover #userRemind {
                      animation: fade-out 300ms ease forwards;
                  }
      
                  .mainDiv:hover #infoText1,
                  .mainDiv:hover #infoText2 {
                      animation: fade-out 600ms ease forwards;
                  }
      
                  .mainDiv:hover #noteText1 {
                      animation: fade-out 900ms ease forwards;
                  }
      
                  .mainDiv:hover #noteText2 {
                      animation: fade-out 1200ms ease forwards;
                  }
      
                  #notes {
                      flex-direction: row;
                      text-align: center;
                  }
      
                  #noteText1,
                  #noteText2 {
                      font-size: calc(var(--root-rem)*0.36rem);
                      width: 100%;
                      animation: fade-in 900ms ease forwards;
                  }
      
                  #infoText1 {
                      animation: fade-in 600ms ease forwards;
                  }
      
                  #infoText2 {
                      animation: fade-in 300ms ease forwards;
                  }
      
                  #infoText1 {
                      font-size: calc(var(--root-rem)*0.36rem);
                      width: 100%;
                      font-weight: bold;
                  }
      
                  #infoText2 {
                      font-size: calc(var(--root-rem)*0.3rem);
                      font-style: italic;
                      width: 100%;
                      text-align: right;
                      font-weight: bold;
                  }
      
                  .promptText {
                      color: #000000;
                      height: calc(var(--root-rem)*0.375rem);
                      font-size: calc(var(--root-rem)*0.225rem);
                  }
      
                  .clickable-image {
                      transition: background 0.7s ease-in-out;
                  }
      
                  .clicked {
                      color: white;
                      background-color: black;
                  }
      
                  .clicked .colorImg {
                      filter: invert(100%);
                  }
      
                  .jsCard.clicked > div {
                      color: #ffffff; 
                  }
      
                  .colorImg {
                      width: calc(var(--root-rem)*0.54rem);
                      height: calc(var(--root-rem)*0.54rem);
                  }
      
                  #tipsCard {
                      cursor: zoom-in;
                  }
      
                  .vipImg1,
                  .autoQAImg1,
                  .timeReverseImg1,
                  .hideImg1,
                  .verifyCodeImg1,
                  .moveImg1,
                  .tipsImg1 {
                      width: calc(var(--root-rem)*0.675rem);
                      height: calc(var(--root-rem)*0.675rem);
                      display: block;
                  }
      
                  .vipImg2,
                  .autoQAImg2,
                  .timeReverseImg2,
                  .hideImg2,
                  .verifyCodeImg2,
                  .tipsImg2 {
                      width: calc(var(--root-rem)*0.675rem);
                      height: calc(var(--root-rem)*0.675rem);
                      display: none;
                  }
      
                  .option1:hover .vipImg1,
                  .option3:hover .autoQAImg1,
                  .option5:hover .timeReverseImg1,
                  .option6:hover .hideImg1,
                  .option7:hover .verifyCodeImg1,
                  .option9:hover .tipsImg1 {
                      transition: display 0.2s ease-in-out;
                      display: none;
                  }
      
                  .option1:hover .vipImg2,
                  .option3:hover .autoQAImg2,
                  .option5:hover .timeReverseImg2,
                  .option6:hover .hideImg2,
                  .option7:hover .verifyCodeImg2,
                  .option9:hover .tipsImg2{
                      transition: display 0.2s ease-in-out;
                      display: block;
                  }
      
                  .option1:hover{
                      background-color: #F7D67F;
                  }
      
                  .option3:hover{
                      background-color: #a686ba;
                  }
      
                  .option5:hover{
                      background-color: #FFB700;
                  }
      
                  .option7:hover{
                      background-color: #C1A8CC;
                  }
      
                  .option8:hover{
                      transition: background 0.7s ease-in-out;
                      background-color: #55dfb8;
                  }
      
                  .option9:hover{
                      background-color: #13227a;
                  }
      
                  `
      );
    }
  })();

  function killAllMonitor() {
    ["visibilitychange", "blur", "focus", "focusin", "focusout"].forEach((e) => {
      window.addEventListener(
        e,
        (e) => {
          e.stopImmediatePropagation();
          e.stopPropagation();
          e.preventDefault();
          return false;
        },
        true
      );
    });
    document.hasFocus = () => true;
    Object.defineProperty(document, "hidden", {
      get() {
        return false;
      },
    });
  }
