// ==UserScript==
// @name        长江雨课堂刷课 刷题
// @namespace    http://tampermonkey.net/
// @version      0.3.13
// @description  “”
// @author       曦月
// @license      MIT
// @match        https://changjiang.yuketang.cn/*
// @match        https://www.yuketang.cn/*
// @match        https://changjiang-exam.yuketang.cn/*
// @match        https://examination.xuetangx.com/exam/*
// @exclude      */resources/ueditor/*
// @require      https://lib.baomitu.com/axios/0.27.2/axios.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuketang.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451918/%E9%95%BF%E6%B1%9F%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%88%B7%E8%AF%BE%20%E5%88%B7%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/451918/%E9%95%BF%E6%B1%9F%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%88%B7%E8%AF%BE%20%E5%88%B7%E9%A2%98.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 调整区
  const maxNum = 10; // 一次最多同时学习的数量
  const keyName = "Body"; // 判断题目的关键值，需和服务端同步
  const reloadTime = 10; // 刷新页面时间 分钟

  const timeOut = reloadTime * 60 * 1000;
  setTimeout(() => {
    location.reload();
  }, timeOut);
  // 插入html元素
  const html = `<style>
  .xy_main{
      position: fixed;
      top: 0;
      left: 50%;
      min-height: 40px;
      min-width: 300px;
      border-radius: 0 0 12px 12px;
      transform: translateX(-50%);
      background-color: rgb(219, 219, 219);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      text-align: center;
      line-height: 40px;
      padding: 0 12px;
  }
  .xy_main .reward-author::before{
      content: "";
      display: block;
      width: 400px;
      height: 0px;
      border-radius: 15px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      transition: 300ms;
  }
  .xy_main .reward-author{
      width: 100%;
      min-height: 40px;
      position: relative;
  }
  .xy_main .reward-author::after{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 40px;
      background-color: #dbdbdb;
      content: "有脚本需求的话也可以留言哦🧋";
      transition: 300ms;
      opacity: 0;
  }
  .xy_main:hovers .reward-author::after{
      opacity: 1;
  }
  .xy_main:hovers .reward-author::before{
      height: 400px;
      max-height: 120vh;
  }
  .learing-iframe-box{
      opacity:0.5;
      position: absolute;
      top: 0px;
      right: 160px;
      width: 350px;
      height: auto;
      max-height: 100vh;
      z-index: 10000;
      overflow-y: scroll;
      transition: 300ms;
  }
  .learing-iframe-box:hover{
    opacity:1;
  }
  .learing-iframe-box .boxs{
      width: 360px;
      height: 240px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .learing-iframe-box .boxs .learing-iframe{
      width: 360px;
      height: 240px;
  }
  .press{
    color: blue;
  }
  </style>
  <div class="xy_main">
      <div class="title"></div>
      <a href="" target="_blank" title="点击打开该页面" class="press"></a>
      <div class="reward-author">当前版本0.3.11</div>
  </div>
  <div class="learing-iframe-box">
  </div>`;
  const div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);
  const showEl = document.querySelector(".title");
  const showEl2 = document.querySelector(".press");

  const url = location.href;
  showEl2.href = url;
  console.log("脚本运行");

  // ajax监听列表
  const ajaxList = [];
  const listenList = [];
  const rowPath = location.href.split("//")[1].split(".")[0];
  const server = "https://script.furryworld.top";
  // const server = "http://127.0.0.1:4445";
  const submitAnswer = `https://${rowPath}.yuketang.cn/mooc-api/v1/lms/exercise/problem_apply/`;
  let defaultHearder = null;
  let isLearArr = [];
  let freeId = null;

  // 课程列表
  const mainPage = new RegExp(/web\/studentLog/);
  // 视频页面
  const videoPage = new RegExp(/xcloud\/video-student/);
  // 答题页面
  const answerPage = new RegExp(/cloud\/student\/exercise/);
  // 考试页面
  const ecam = new RegExp(/\/exam\//);
  // 查看试卷页面
  const result = new RegExp(/changjiang-exam.yuketang.cn\/result\//);
  // 讨论题页面
  const forum = new RegExp(/web\/lms\/.+\/forum\/.+/);
  // 成绩单页面
  const transcript = new RegExp(/online_courseware\/schedule\/score_detail/);
  // 接口地址

  // 在线课程列表
  const studyList = new RegExp(/online_courseware/);
  // 完成进度
  const progress = new RegExp(/pub_new_pro/);
  // 获取视频地址
  const getVideoUrl = new RegExp(/audiovideo\/playurl/);
  // 获取题目列表
  const getExerciseList = new RegExp(/get_exercise_list/);
  // 获取考试题目列表
  const getExamList = new RegExp(/exam_room\/show_paper/);
  // 获取试卷答案
  const getAns = new RegExp(/exam_room\/problem_result/);
  // 视频进度提交
  const videoPress = new RegExp(/video-log\/heartbeat/);
  // 讨论题评论列表
  const discussion = new RegExp(/discussion\/v2\/comment\/list/);
  // 检测讨论题是否已发言
  const isSend = new RegExp(/discussion\/v2\/student\/comment\/status/);

  // 房间id
  const classroom_id = +localStorage.getItem("classroomId");

  let popstate = false;

  function main() {
    console.log("入口分配");
    if (popstate) {
      location.reload();
    }

    // 入口分配
    if (mainPage.test(url)) {
      console.log("课程列表页面");
      // 筛选学习内容 0 视频 3 图文 4 讨论题 6 作业
      let learsArr = [0, 3, 4, 6];
      // if (true || window.confirm("本次学习是否答题？")) {
      //     learsArr = [0, 3, 4, 6]
      // }
      let learningProgress = {}; // 学习进度
      let onlineCourseware = []; // 在线课程
      let first = true;
      // 启用监听 - 成绩单
      listenAjax(transcript, (data) => {
        console.log("成绩单数据", data);
        defaultHearder = { headers: data.header };
        sessionStorage.setItem("defaultHearder", JSON.stringify(defaultHearder));
        if (first) {
          first = false;
          loopGetProgress(data, "get");
          showEl.innerText = `从成绩单获取到数据，继续流程`;
          console.log("更新学习进度1");
          onlineCourseware = data.res.data.leaf_level_infos.map((el) => {
            el.progress = el.schedule;
            return el;
          });
          selectlearning();
        } else {
          console.log("更新学习进度2");
          onlineCourseware = data.res.data.leaf_level_infos.map((el) => {
            el.progress = el.schedule;
            return el;
          });
          selectlearning();
        }
      });
      // 启用监听 - 学习日志
      listenAjax(progress, (data) => {
        defaultHearder = { headers: data.header };
        sessionStorage.setItem("defaultHearder", JSON.stringify(defaultHearder));
        Object.keys(data.res.data).forEach((el) => {
          Object.keys(data.res.data[el]).forEach((_el) => {
            learningProgress[_el] = data.res.data[el][_el];
          });
        });
        console.log("获取到学习进度", data);
        if (first) {
          if (document.querySelector(".blue.ml20")) {
            first = false;
            getOnlineCourseware();
            loopGetProgress(data);
          } else {
            showEl.innerText = `非标准学习日志，请切换到成绩单页面继续刷题`;
          }
        } else {
          updateLearningProgress();
        }
      });
      // 循环更新学习进度 - 请求重放
      function loopGetProgress(data, method = "post") {
        setTimeout(() => {
          if (method == "post") {
            axios.post(data.url, data.send, { headers: data.header }).then((res) => {
              console.log("更新成功");
              loopGetProgress(data, method);
            });
          } else {
            axios.get(data.url, { headers: data.header }).then((res) => {
              console.log("更新成功");
              loopGetProgress(data, method);
            });
          }
        }, 5000);
      }

      // 获取在线课程
      function getOnlineCourseware() {
        listenAjax(studyList, (data) => {
          onlineCourseware = tiledArray(data.res.data.content_info).filter((el) => learsArr.includes(el.leaf_type));
          console.log("获取到在线课程列表");
          updateLearningProgress();
        });
        document.querySelector(".blue.ml20").click();
      }

      // 平铺课程列表
      function tiledArray(data) {
        let temp = [];
        data.forEach((el) => {
          if (el.section_list && el.section_list.length) {
            temp = temp.concat(tiledArray(el.section_list));
          }
          temp = temp.concat(el.leaf_list);
        });
        return temp;
      }
      // 更新学习进度
      function updateLearningProgress() {
        onlineCourseware.forEach((el) => {
          el.progress = learningProgress[el.id] || false;
        });
        console.log("更新学习进度");
        selectlearning();
      }
      // 选择要学习的内容
      function selectlearning() {
        const notLearning = onlineCourseware.filter((el) => {
          if (el.progress) {
            if (typeof el.progress === "number" && el.progress === 1) {
              return false;
            } else if (typeof el.progress === "object" && el.progress.done === el.progress.total) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        });
        console.log("未学习内容", notLearning);
        showEl.innerText = `脚本运行中，待完成${notLearning.length}`;
        let operation = [];
        let other = [];
        notLearning.forEach((el) => {
          if (el.leaf_type === 6) {
            operation.push(el);
          } else {
            other.push(el);
          }
        });
        if (operation.length) {
          startLearning([operation[0], ...other]);
        } else {
          startLearning(other);
        }
      }
      // 开始学习
      function startLearning(notLearning) {
        let onLearningList = notLearning.splice(0, maxNum);
        console.log(`抽取最多${maxNum}条数据开始学习`, onLearningList);

        if (!onLearningList.length) {
          allLearningFinished();
          return;
        }
        console.log("开始学习这些课程", onLearningList);
        const learEl = document.querySelectorAll(".learing-iframe-box .boxs");
        if (!freeId) {
          freeId = document.querySelector(".studentLog__view").__vue__.$data.classroomData.free_sku_id;
          console.log("获取到freeId", freeId);
        }
        onLearningList.forEach((el) => {
          if (isLearArr.find((i) => i.id === el.id) === undefined) {
            const div = document.createElement("div");
            div.classList.add("boxs");
            div.setAttribute("lear-id", el.id);
            div.setAttribute("pr-name", el.title);
            const tempIFrame = document.createElement("iframe");
            div.appendChild(tempIFrame);
            switch (el.leaf_type) {
              case 0:
                tempIFrame.src = `https://${rowPath}.yuketang.cn/v2/web/xcloud/video-student/${classroom_id}/${el.id}`;
                break;
              case 3:
                tempIFrame.src = `https://${rowPath}.yuketang.cn/v2/web/lms/${classroom_id}/graph/${el.id}`;
                break;
              case 4:
                tempIFrame.src = `https://${rowPath}.yuketang.cn/v2/web/lms/${classroom_id}/forum/${el.id}`;
                break;
              case 6:
                tempIFrame.src = `https://${rowPath}.yuketang.cn/v2/web/cloud/student/exercise/${classroom_id}/${el.id}/${freeId}`;
                break;
            }
            tempIFrame.classList.add("learing-iframe");
            document.querySelector(".learing-iframe-box").appendChild(div);
          }
        });
        isLearArr = onLearningList;
        // 移除学习完成的内容
        learEl.forEach((el) => {
          const find = isLearArr.find((i) => i.id === +el.getAttribute("lear-id"));
          if (find === undefined) {
            console.log(el.getAttribute("pr-name"), "此课已学习完成");
            el.remove();
          }
        });
      }
      // 所有内容都学习完毕
      function allLearningFinished() {
        showEl.innerHTML = "所有课程学习完毕";
        // alert("所有内容均已学习完成")
      }
    } else if (videoPage.test(url)) {
      console.log("视频播放页面");
      showEl.innerText = `视频播放挂机页面 [等待捕获视频url]`;

      const tims = setTimeout(() => {
        showEl.innerText = `页面加载错误，正在重载页面`;
        setTimeout(() => {
          location.reload();
        }, 3000);
      }, 60000);

      function startListen(data) {
        clearTimeout(tims);
        console.log("获取到视频链接", data);
        let lastTime = null,
          reloadCount = 30,
          thisCount = 0;
        showEl.innerText = `视频播放挂机页面 [等待创建video节点]`;
        function loop() {
          const video = document.querySelector("video");
          if (video) {
            video.remove();
            return;
            const x = parseInt(Math.random() * 1920),
              y = parseInt(Math.random() * 1080);
            const event = new MouseEvent("click", {
              view: window,
              bubbles: true,
              cancelable: true,
              clientX: x,
              clientY: y,
              screenX: x,
              screenY,
              y,
            });
            document.querySelector("#app").dispatchEvent(event);
            video.muted = true;
            video.play();
            const dur = parseInt(video.duration),
              curr = parseInt(video.currentTime);
            // showEl.innerText = `视频播放中 [${curr}/${dur}]`;
            if (lastTime === curr) {
              thisCount++;
            } else {
              thisCount = 0;
            }
            lastTime = curr;
            if (reloadCount === thisCount) {
              showEl.innerText = `视频长时间未播放，正在重载页面`;
              setTimeout(() => {
                location.reload();
              }, 3000);
              return;
            }
          }
          setTimeout(loop, 100);
        }
        loop();
      }
      listenAjax(getVideoUrl, startListen);
      let ones = true;
      listenAjax(videoPress, (data) => {
        console.log("捕获到更新时长请求", data);
        let urls = data.url;
        defaultHearder = data.header;
        let heart_data = data.send.heart_data.reverse()[0];
        const newList = [];
        console.log(heart_data);
        let leng = parseInt(heart_data.d / 10);
        for (let i = 0; i < leng; i++) {
          let newObj = JSON.parse(JSON.stringify(heart_data));
          if (i + 1 < leng) {
            newObj.cp = heart_data.tp + parseInt(((heart_data.d - heart_data.tp) / leng) * i);
          } else {
            newObj.cp = heart_data.d;
          }
          newObj.et = "play";
          newList.push(newObj);
        }
        console.log("新构建结构", newList);
        showEl.innerText = `构建虚拟学习进度`;
        let postData = {
          heart_data: newList,
        };
        if (ones) {
          ones = false;
          setTimeout(() => {
            axios.post(urls, postData, defaultHearder).then((res) => {
              showEl.innerText = `请求结束，等待服务器更新`;
              console.log("模拟请求返回", res);
              setTimeout(() => {
                document.querySelector(".log-detail").click();
                showEl.innerText = `重载页面`;
                setTimeout(() => {
                  location.reload();
                }, 30000);
              }, 3000);
            });
          }, 3000);
        }
      });
    } else if (answerPage.test(url)) {
      console.log("作业页面");
      showEl.innerText = `答题页面`;
      defaultHearder = sessionStorage.getItem("defaultHearder");
      if (defaultHearder) {
        defaultHearder = JSON.parse(defaultHearder);
      }
      listenAjax(getExerciseList, (data) => {
        data.header["X-CSRFToken"] = getCookie("csrftoken");
        console.log("请求头", { headers: data.header });
        defaultHearder = { headers: data.header };
        // 筛选出未答题题目
        const problems = data.res.data.problems.filter((el) => !el.user.submit_time);
        // const problems = data.res.data.problems;
        console.log("获取到题目列表", problems);
        showEl2.innerText = "题目：" + data.res.data.name;
        if (problems.length) {
          // 进入答案方法
          getAnswer(problems);
        } else {
          // 所有题目都完成了，将正确答案提交到后端
          showEl.innerText = `所有题目已完成！`;
          uploadAll(data.res.data.problems);
        }
      });

      // 答题方法
      function getAnswer(problems) {
        // 提取出所有需要答案的题目标题
        const problemList = problems.map((el) => {
          return {
            Body: el.content[keyName],
            LibraryName: el.content.LibraryName,
          };
        });
        // 初始化循环判断值
        let loop = false;
        // 进入循环方法
        getAnswerFromServes(problemList);

        function getAnswerFromServes(problemList) {
          // 更新状态
          loop = false;
          showEl.innerText = `获取答案中...`;
          // 将列表提交到后端，接收返回列表
          axios.post(`${server}/api/getList`, problemList).then(async (res) => {
            // 接收到返回数据
            const data = res.data.data.map((el) => {
              el.answer = JSON.parse(el.answer);
              return el;
            });
            console.log("获取到答案列表", data);
            showEl.innerText = `获取到答案列表`;
            // 初始化需要提交的列表
            const updateList = [];
            // 答题循环
            for (let i = 0; i < data.length; i++) {
              const el = data[i];
              // 判断后端是否记录这道题
              if (!el.requireProblem) {
                if (el.answer) {
                  showEl.innerText = `答题中[${i}/${data.length}]`;
                  // 根据内容寻找本地答案选项
                  const thisProblems = problems.find((_el) => _el.content.Body === el.problem);
                  let answerArr = [];
                  let postFrom = {};
                  if ([1, 2, 3, 6].includes(thisProblems.content.ProblemType)) {
                    console.log("单选，多选，投票，判断");
                    const answerList = thisProblems.content.Options;
                    console.log("本地答案", answerList);
                    // 避免打乱顺序，替换为本地答案内容
                    const correctAnswer = answerList.filter((__el) => {
                      if (["true", "false"].includes(__el.key)) {
                        console.log("判断题", __el);
                        return el.answer.find((_el) => _el.key === __el.key);
                      } else {
                        console.log("选择题", __el);
                        return el.answer.find((_el) => _el.value === __el.value);
                      }
                    });
                    console.log("过滤答案", correctAnswer);
                    answerArr = correctAnswer.map((_el) => _el.key);
                    postFrom = {
                      answer: answerArr,
                      classroom_id,
                      problem_id: thisProblems.problem_id,
                    };
                  } else if (thisProblems.content.ProblemType === 4) {
                    console.log("填空题");
                    answerArr = {};
                    el.answer.forEach((_el, i) => {
                      answerArr[i + 1] = _el;
                    });
                    postFrom = {
                      answers: answerArr,
                      classroom_id,
                      problem_id: thisProblems.problem_id,
                    };
                  } else {
                    alert("无法处理的题目类型！");
                  }

                  console.log("默认请求头", defaultHearder);
                  // 如果没有请求头，则中止脚本执行
                  if (!defaultHearder) {
                    alert("请求头未更新，无法继续");
                    return;
                  }
                  // 向官方接口发送请求
                  console.log(postFrom);
                  axios.post(submitAnswer, postFrom, defaultHearder).then((res) => {
                    console.log("答题返回", res.data);

                    // 移除已经请求过的数据
                    const thisIndex = problemList.findIndex((_el) => _el.Body === el.problem);
                    problemList.splice(thisIndex, 1);

                    // 判断答案是否正确
                    let isRight = res.data.data.is_right || res.data.data.is_correct;
                    if (isRight) {
                      // 如果答案正确则更新状态
                      axios
                        .post(`${server}/api/pullStatus`, {
                          isRight,
                          id: el.problem,
                        })
                        .then((res) => {
                          console.log("更新状态", res);
                        });
                    } else if (isRight !== undefined) {
                      // 如果错了就提交正确答案
                      if ([1, 2, 6].includes(thisProblems.content.ProblemType)) {
                        const answer = res.data.data.answer.map((el) => answerList.find((_el) => _el.key === el));
                        console.log("更正选择题", answer);
                        axios
                          .post(`${server}/api/updateAnswer`, {
                            answer: JSON.stringify(answer),
                            id: el.problem,
                          })
                          .then((res) => {
                            console.log("更新答案", res);
                          });
                        // type == 4 填空题
                      } else if (thisProblems.content.ProblemType === 4) {
                        const answer = [];
                        let answers = res.data.data.answers;
                        Object.keys(answers).forEach((el) => answer.push(answers[el][0]));
                        console.log("更正填空题", answer);
                        axios
                          .post(`${server}/api/updateAnswer`, {
                            answer: JSON.stringify(answer),
                            id: el.problem,
                          })
                          .then((res) => {
                            console.log("更新答案", res);
                          });
                      } else if (thisProblems.content.ProblemType === 3) {
                        console.log("投票题", thisProblems);
                      } else {
                        console.log("未知题目类型", thisProblems);
                      }
                    } else {
                      console.log("未知错误", res);
                    }
                  });
                  await delay(3000);
                } else {
                  // 此题暂无答案
                  console.log(`暂无答案`);
                  loop = true;
                }
              } else {
                // 将这道题放入提交列表
                updateList.push(problems.find((_el) => _el.content[keyName] === el.problem).content);
              }
            }

            if (updateList.length) {
              console.log("这些题需要提交到后台", updateList);
              uploadProblem(updateList);
              loop = true;
            }
            if (loop) {
              console.log("未完成所有题目，等待刷新");
              showEl.innerText = `部分题目未完成，等待题库更新[${problemList.length}]`;
              setTimeout(() => {
                getAnswerFromServes(problemList);
              }, 1000);
            } else {
              showEl.innerText = `所有题目已完成！`;
              // location.reload()
            }
          });
        }
      }

      // 将所有题目提交到后台审核
      async function uploadAll(list) {
        console.log("将正确答案提交到服务端", list);
        let correct = list.map((el) => {
          if ([1, 2, 3, 6].includes(el.content.ProblemType)) {
            console.log("选择题", el);
            let answer = el.user.answer || el.user.my_answer;
            if (!Array.isArray(answer)) {
              answer = answer.split("");
            }
            const answers = el.content.Options.filter((_el) => answer.includes(_el.key));
            const data = {
              Body: el.content.Body,
              LibraryName: el.content.LibraryName,
              answer: JSON.stringify(answers),
              rowData: JSON.stringify(el.content),
            };
            return data;
          } else if (el.content.ProblemType === 4) {
            console.log("填空题");
            const answer = [];
            let answers = el.user.answers;
            Object.keys(answers).forEach((el) => answer.push(answers[el][0]));
            const data = {
              Body: el.content.Body,
              LibraryName: el.content.LibraryName,
              answer: JSON.stringify(answer),
              rowData: JSON.stringify(el.content),
            };
            return data;
          } else {
            console.log("未知题目类型", el);
          }
        });
        correct = correct.filter((el) => el);
        showEl.innerText = `正在将所有正确答案提交到题库[${correct.length}]...`;
        axios.post(`${server}/api/allProblem`, correct).then((res) => {
          console.log("提交结果", res);
          showEl.innerText = `提交完成[${correct.length}]...`;
        });
        console.log("提交所有正确题目到题库", correct);
      }
    } else if (ecam.test(url)) {
      console.log("考试页面");
      showEl.innerHTML = "考试页面";
      let problems = [];
      listenAjax(getExamList, (data) => {
        showEl.innerHTML = "获取到题目列表";
        defaultHearder = data.header;
        problems = data.res.data.problems;
        console.log("获取到题目列表", problems);
        console.log(defaultHearder);
        if (problems.length) {
          const problemList = problems
            .filter((el) => Array.isArray(el.Options))
            .map((el) => {
              return {
                Body: el.Body,
                LibraryName: el.LibraryName,
              };
            });
          // 初始化循环判断值
          let loop = false;
          // 进入循环方法
          getAnswerFromServes(problemList);

          function getAnswerFromServes(problemList) {
            // 更新状态
            loop = false;
            showEl.innerText = `获取答案中...`;
            // 将列表提交到后端，接收返回列表
            axios.post(`${server}/api/getList`, problemList).then(async (res) => {
              // 接收到返回数据
              const data = res.data.data.map((el) => {
                let prb = problems.find((_el) => _el.Body === el.problem && !_el.isUsd);
                el.answer = JSON.parse(el.answer);
                el.problem_id = prb.problem_id;
                el.localAnswer = prb.Options.filter((_el) => {
                  if (!el.answer || !Array.isArray(el.answer)) {
                    return false;
                  }
                  prb.isUsd = true;
                  if (["true", "false"].includes(_el.key)) {
                    return el.answer.find((__el) => __el.key === _el.key);
                  } else {
                    return el.answer.find((__el) => __el.value === _el.value);
                  }
                });
                return el;
              });
              console.log("获取到答案列表", data);
              let nows = 0;
              showEl.innerText = `答题中 ${nows}/${problemList.length}`;
              // 改为半自动
              let list = document.querySelectorAll(".exam-main--content .subject-item");
              for (let i = 0; i < list.length; i++) {
                const ans = data[i];
                const index = ans.localAnswer.map((el) => {
                  console.log(el.key);
                  switch (el.key) {
                    case "true":
                    case "A":
                      return 0;
                    case "false":
                    case "B":
                      return 1;
                    case "C":
                      return 2;
                    case "D":
                      return 3;
                    case "E":
                      return 4;
                    case "F":
                      return 5;
                  }
                });
                const label = list[i].querySelectorAll("label");
                for (let i = 0; i < label.length; i++) {
                  const el = label[i];
                  console.log(el, index);
                  if (index.includes(i)) {
                    if (!el.classList.contains("is-checked")) {
                      el.click();
                    }
                  }
                  await new Promise((res) => setTimeout(res, 10));
                }
                nows++;
                showEl.innerText = `答题中 ${nows}/${problemList.length}`;
                await new Promise((res) => setTimeout(res, 50));
              }
              showEl.innerText = ` ${nows}/${problemList.length} 题库检索完毕`;
            });
          }
        } else {
        }
      });
    } else if (result.test(url)) {
      showEl.innerText = `试卷查看页面`;
      console.log("试卷查看页面");
      let list = null;
      let ans = null;
      listenAjax(getExamList, (data) => {
        console.log("获取到题目", data);
        list = data.res.data.problems;
        start();
      });
      listenAjax(getAns, (data) => {
        console.log("获取到答案", data);
        ans = data.res.data.problem_results;
        start();
      });

      function start() {
        if (list) {
          if (ans) {
            console.log("两个请求都完成了，开始组装数据");
            // const filterList = list.filter(el => Array.isArray(el.Options))
            const uploadList = [];

            for (let i = 0; i < list.length; i++) {
              const el = list[i];
              console.log(el);
              if ([1, 2, 3, 6].includes(el.ProblemType)) {
                console.log("单选，多选，投票，判断");
                const answer = ans.find((_el) => _el.problem_id === el.problem_id).answer;
                let trueAnswer = el.Options.filter((_el) => {
                  return answer.includes(_el.key);
                });
                uploadList.push({
                  Body: el.Body,
                  LibraryName: el.LibraryName,
                  answer: JSON.stringify(trueAnswer),
                  rowData: JSON.stringify(el),
                });
              } else if (el.ProblemType === 4) {
                console.log("填空题");
                const answer = ans.find((_el) => _el.problem_id === el.problem_id).answer;
                let trueAnswer = [];
                Object.keys(answer).forEach((el) => trueAnswer.push(answer[el][0]));
                console.log(trueAnswer);
                uploadList.push({
                  Body: el.Body,
                  LibraryName: el.LibraryName,
                  answer: JSON.stringify(trueAnswer),
                  rowData: JSON.stringify(el),
                });
              } else {
                alert(`含有无法处理的题目类型 ${el.TypeText} `);
                return false;
              }
            }
            showEl.innerText = `正在将所有正确答案提交到题库[${uploadList.length}]...`;
            axios.post(`${server}/api/allProblem`, uploadList).then((res) => {
              console.log("提交结果", res);
              showEl.innerText = `提交完成[${uploadList.length}]...`;
            });
            console.log("提交所有正确题目到题库", uploadList);
          } else {
            console.log("等待答案中");
          }
        } else {
          console.log("等待题目中");
        }
      }
    } else if (forum.test(url)) {
      console.log("讨论题页面");
      let first = true;
      let f_2 = true;
      let lsa = null;
      let isSends = null;
      listenAjax(discussion, (data) => {
        if (!first) {
          showEl.innerText = `已提交发言`;
          f_2 = false;
          return;
        }
        first = false;
        lsa = data;
        send();
      });
      listenAjax(isSend, (data) => {
        isSends = data;
        send();
      });

      function send() {
        console.log(f_2, lsa, isSends);
        if (f_2) {
          if (lsa) {
            if (isSends) {
              console.log("两个接口都请求完了");
              if (isSends.res.data) {
                showEl.innerText = `已发言`;
                console.log("已发言");
                return;
              } else {
                console.log("未发言");
                let list = lsa.res.data.new_comment_list.results;
                let comment = "";
                if (list && list.length) {
                  comment = list[list.length - 1].content.text;
                } else {
                  comment = "好好学习";
                }
                document.querySelector(".textarea textarea").value = comment;
                document.querySelector(".textarea textarea").dispatchEvent(new CustomEvent("input"));
                setTimeout(() => {
                  document.querySelector(".el-button.submitComment.el-button--primary").click();
                }, 10);
              }
            }
          }
        }
      }
    } else {
      console.log("此页面未适配");
    }
  }

  // 提交题库中没有记录的题库
  function uploadProblem(list) {
    axios.post(`${server}/api/pullProblem`, list).then((res) => {
      console.log("提交成功", res);
    });
  }

  // 请求间隔
  function delay(time) {
    console.log("延迟", time / 1000, "秒");
    return new Promise((res, rej) => {
      setTimeout(() => {
        res();
      }, time);
    });
  }

  var _wr = function (type) {
    var orig = history[type];
    return function () {
      var rv = orig.apply(this, arguments);
      var e = new Event(type);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv;
    };
  };
  history.pushState = _wr("pushState");
  history.replaceState = _wr("replaceState");

  window.addEventListener("hashchange", function (event) {
    console.log("路径跳转1");
    popstate = true;
    main();
  });
  window.addEventListener("popstate", function (event) {
    console.log("路径跳转2");
    popstate = true;
    main();
  });

  window.addEventListener("pushState", function (e) {
    console.log("路径跳转4");
    popstate = true;
    main();
  });

  main();

  // 监听所有请求
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
  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
  }
})();
