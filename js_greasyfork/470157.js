// ==UserScript==
// @name         成学课堂 考试脚本
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  try to take over the world!
// @author       You
// @license MIT
// @match        https://student.cx-online.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cx-online.net
// @require      https://cdn.bootcdn.net/ajax/libs/axios/1.3.6/axios.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470157/%E6%88%90%E5%AD%A6%E8%AF%BE%E5%A0%82%20%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/470157/%E6%88%90%E5%AD%A6%E8%AF%BE%E5%A0%82%20%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const serveUrl = "https://cxkt.furryworld.top";
  history.pushState = null;
  const ajaxList = [];
  const listenList = [];
  let listNum = 0;
  let timeout = 3000;
  let Authorization = JSON.parse(sessionStorage.getItem("user")).token;
  console.info("考试脚本已启动 v0.3.1");
  console.info("服务器地址为:", serveUrl);

  const listQueByExamId = new RegExp(/listQueByExamId/);
  const listByCurrentItem = new RegExp(/listByCurrentItem/);

  // 监听器
  const originOpen = XMLHttpRequest.prototype.open;
  const originSend = XMLHttpRequest.prototype.send;
  const originHeader = XMLHttpRequest.prototype.setRequestHeader;

  // 重写open
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener("load", function (obj) {
      const url = obj.target.responseURL; // obj.target -> this
      listenList.forEach((el) => {
        if (el.rule.test(url)) {
          const find = ajaxList.find((el) => el.xml === this);
          if (find) {
            find.url = url;
            find.res = JSON.parse(this.response);
            el.callback(find);
          } else {
            el.callback(false);
          }
        }
      });
    });
    originOpen.apply(this, arguments);
  };

  // 重写send
  XMLHttpRequest.prototype.send = function () {
    const xml = ajaxList.find((el) => el.xml === this);
    if (xml) {
      xml.send = JSON.parse(arguments[0]);
    }
    originSend.apply(this, arguments);
  };

  // 重写setRequestHeader
  XMLHttpRequest.prototype.setRequestHeader = function () {
    const xml = ajaxList.find((el) => el.xml === this);
    if (xml) {
      xml.header[arguments[0]] = arguments[1];
    } else {
      ajaxList.push({
        xml: this,
        url: "",
        header: {
          [arguments[0]]: arguments[1],
        },
      });
    }
    originHeader.apply(this, arguments);
  };

  function listenAjax(rule, callback) {
    listenList.push({
      rule,
      callback,
    });
  }

  listenAjax(listByCurrentItem, async (xmlData) => {
    console.info("所有考试科目", xmlData);
    const button = document.createElement("button");
    button.innerText = "开始考试";
    button.style.padding = "10px";
    document.querySelector(".examTip").append(button);
    button.addEventListener("click", () => {
      console.info("测试");
      button.setAttribute("disabled", "");
      xmlData.res.data.forEach((el) => {
        if (el.allowFrequency > 1) {
          newExaminationRoom(el);
        } else {
          console.info(`${el.courseName} 只剩一次考试机会，跳过`);
        }
      });
    });
  });

  async function newExaminationRoom(data) {
    const parent = document.querySelector(".el-scrollbar__wrap.el-scrollbar__wrap--hidden-default");
    const room = document.createElement("div");
    const title = document.createElement("p");
    const status = document.createElement("p");
    status.classList.add("status");
    room.id = `room-${data.examId}`;
    title.innerText = `考试科目：${data.courseName}`;
    status.innerText = `当前状态：获取题目中`;
    Object.assign(room.style, {
      width: "250px",
      height: "100px",
      margin: "10px",
      float: "left",
      backgroundColor: "#d3d3d3",
    });
    room.append(title, status);
    parent.append(room);
    axios({
      url: `https://cxkt-api-admin.cx-online.net/cxkt/exam/exam/v1/getExamRuleById/${data.examId}`,
      method: "POST",
      headers: {
        Authorization,
      },
    })
      .then((res) => {
        axios({
          url: `https://cxkt-api-admin.cx-online.net/cxkt/exam/exam/v1/checkExam/${data.examId}`,
          method: "POST",
          headers: {
            Authorization,
          },
        })
          .then((res) => {
            axios({
              url: `https://cxkt-api-admin.cx-online.net/cxkt/exam/exam/v1/listQueByExamId/${data.examId}`,
              method: "POST",
              headers: {
                Authorization,
              },
            })
              .then((res) => {
                console.info("试卷信息", res);
                status.innerText = `当前状态：获取到试卷，等待从题库拉取答案`;
              })
              .catch((err) => {
                status.innerText = `当前状态：获取试卷出错,详情查看控制台`;
                console.info("获取试卷出错", err);
              });
          })
          .catch((err) => {
            status.innerText = `当前状态：检测考试出错,详情查看控制台`;
            console.info("检测考试出错", err);
          });
      })
      .catch((err) => {
        status.innerText = `当前状态：获取考试规则出错,详情查看控制台`;
        console.info("获取考试规则出错", err);
      });
  }

  listenAjax(listQueByExamId, async (xmlData) => {
    console.info("试卷数据", xmlData);
    const search = document.createElement("p");
    const button = document.createElement("button");
    let noAnswer = [];
    let url = xmlData.url.split("/");
    let examId = url[url.length - 1];

    let stuQueRecordDtoList = []; // 提交数据
    button.innerText = "提交试卷";
    Object.assign(button.style, {
      padding: "10px 20px",
      fontSize: "18px",
    });
    button.setAttribute("disabled", "");
    button.setAttribute("title", "需要完成所有题目后才能提交");
    button.addEventListener("click", () => {
      submitPaper();
    });
    search.innerText = "正在查询题库";

    loopSearch();
    function loopSearch(loop = true) {
      Authorization = JSON.parse(sessionStorage.getItem("user")).token;
      axios(`${serveUrl}/api/getList`, {
        method: "POST",
        data: xmlData.res.data,
      })
        .then((anserServe) => {
          stuQueRecordDtoList = [];
          noAnswer = [];
          anserServe.data.data.forEach((el) => {
            if (el.hasAnswer) {
              stuQueRecordDtoList.push({
                queId: el.queId,
                consumeAnswerList: JSON.parse(el.answer).map((_el) => {
                  if (_el.title) {
                    return el.queOptionDtoList.find((__el) => __el.name == _el.name).title;
                  } else {
                    return _el;
                  }
                }),
              });
            } else {
              noAnswer.push(el);
            }
          });
          if (noAnswer.length) {
            search.innerText = `有 ${noAnswer.length} 题没有答案，等待题库更新`;
          } else {
            search.innerText = `已完成所有题目，可以提交`;
            button.removeAttribute("disabled");
            button.removeAttribute("title");
          }

          const usles = document.querySelector("#usles");
          if (usles) {
            usles.remove();
          }
          const dom = document.querySelectorAll(".el-dialog__body")[1];
          const room = document.querySelector(`#room-${examId}`);
          if (dom) {
            const info = document.createElement("div");
            info.id = "usles";
            const aLink = document.createElement("a");
            aLink.innerText = "打开题库管理页面";
            aLink.target = "_blank";
            aLink.href = serveUrl;
            Object.assign(info.style, {
              width: "100%",
              height: "auto",
              "font-size": "18px",
              paddingBottom: "20px",
            });
            const title = document.createElement("p");
            title.innerText = `考试脚本已启动，不要在此页面作答！不要点击页面上的提交考试！\n本试卷共有 ${xmlData.res.data.length} 题\n`;
            dom.parentElement.append(info);
            info.append(aLink, title, search, button);
          } else if (room) {
            const status = room.querySelector(".status");
            if (noAnswer.length) {
              status.innerText = `当前状态：有 ${noAnswer.length} 题没有答案，等待题库更新`;
            } else {
              status.innerText = `当前状态：已完成所有题目，正在提交中`;
              loop = false;
              addTimeOutList(status);
            }
          }

          setTimeout(() => {
            if (loop) {
              loopSearch(loop);
            } else {
              console.info("停止请求题库服务器");
            }
          }, 1000);
        })
        .catch((err) => {
          const dom = document.querySelectorAll(".el-dialog__body")[1];
          const room = document.querySelector(`#room-${examId}`);
          if (dom) {
            const info = document.createElement("div");
            info.id = "usles";
            const aLink = document.createElement("a");
            aLink.innerText = "打开题库管理页面";
            aLink.target = "_blank";
            aLink.href = serveUrl;
            Object.assign(info.style, {
              width: "100%",
              height: "auto",
              "font-size": "18px",
              paddingBottom: "20px",
            });
            const title = document.createElement("p");
            title.innerText = `题库服务器请求失败，请重试`;
            dom.parentElement.append(info);
            info.append(aLink, title);
          } else if (room) {
            const status = room.querySelector(".status");
            status.innerText = `题库服务器请求失败，请重试`;
          }
        });
    }

    function addTimeOutList(status) {
      listNum++;
      console.info(timeout * listNum);
      setTimeout(() => {
        submitPaper(status);
        console.info("触发", status, examId);
      }, timeout * listNum);
    }

    function submitPaper(status) {
      if (!noAnswer.length) {
        axios({
          url: "https://cxkt-api-admin.cx-online.net/cxkt/exam/exam/v1/saveExam",
          method: "POST",
          headers: {
            Authorization,
          },
          data: {
            examId,
            stuQueRecordDtoList,
          },
        })
          .then((res) => {
            console.info("提交答案", res);
            let examSocreId = res.data.data.examScoreId;
            axios({
              url: `https://cxkt-api-admin.cx-online.net/cxkt/study/score/v1/getStuById/${examSocreId}`,
              method: "POST",
              headers: {
                Authorization,
              },
            })
              .then((socre) => {
                let soc = socre.data.data.mark;
                console.info("分数", socre, soc);
                if (status) {
                  status.innerText = `当前状态：考试完成， 分数 ${soc}`;
                } else {
                  alert(`考试完成， 分数 ${soc}`);
                }
              })
              .catch((err) => {
                if (status) {
                  status.innerText = "当前状态：获取分数失败,详细内容查看控制台";
                } else {
                  alert("获取分数失败,详细内容查看控制台");
                }
                console.info("获取分数失败", err);
              });
          })
          .catch((err) => {
            if (status) {
              status.innerText = "当前状态：提交考试数据失败,详细内容查看控制台";
            } else {
              alert("提交考试数据失败,详细内容查看控制台");
            }
            console.info("提交考试数据失败", err);
          });
      } else {
        if (status) {
          status.innerText = `当前状态：还有 ${noAnswer.length} 题没有答案，请先完成作答`;
        } else {
          alert(`还有 ${noAnswer.length} 题没有答案，请先完成作答`);
        }
      }
    }
  });
})();
