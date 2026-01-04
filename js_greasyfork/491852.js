// ==UserScript==
// @name         河理工联大学习
// @namespace    http://yejian.xzy/
// @version      2.6.1
// @description  联大学堂高等学历继续教育网络学习平台，自动刷课答题考试，进入答题或课程页面，点击右上角红色“开始”按钮，即可自动刷课、答题、考试。
// @author       yejian
// @match        *://*.jxjypt.cn/classroom/start*
// @match        *://*.jxjypt.cn/paper/start*
// @icon         https://kc.jxjypt.cn/favicon.ico
// @grant        none
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @run-at       document-end
// @license      MIT
// @require      https://update.greasyfork.org/scripts/503097/1424938/VueEntry.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/491852/%E6%B2%B3%E7%90%86%E5%B7%A5%E8%81%94%E5%A4%A7%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/491852/%E6%B2%B3%E7%90%86%E5%B7%A5%E8%81%94%E5%A4%A7%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

'use strict'

let timer = 0;

const globalConfig = {
  "videoWatchPer": 0.9, // 视频观看百分比
  "oneQsMaxThinkSecond": 10, // 一道题最大思考时间，单位：秒
  "tinkRandomSecond": 5 // 试题的思考时间，允许上下浮动的秒数
};

function readValue(){
  for(var key in globalConfig) {
    var val =  GM_getValue(key);
    if (val == null) {
      val = globalConfig[key];
      GM_setValue(key, val);
    }
    globalConfig[key] = val;
  }
}

const viewTemplate = `
<div id="vueRoot" style="position: fixed;top: 0; right: 0;z-index: 99999;">
  <button id="start-btn" @click="btnClick()" style="
      padding: 10px 50px;
      background: red;
      color: white;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 0 10px #999;"
      >
  {{ btn.status == 0 ? '开始': '暂停' }}
  </button>
  <div v-if="video.status == 1">{{video.name}} 播放进度：{{video.currentTime}}/{{video.videoTime}}</div>
  <div v-if="video.status == 1">答题倒计时：{{Math.ceil(video.delayTime-video.currentTime)}}</div>
  <div v-if="exam.status == 1">第{{exam.currentQsNo}}道题，答案{{exam.currentQsAnswer}}</div>
  <div v-if="exam.status == 1">下一题作答倒计时{{exam.countDownAnswer}}秒</div>
</div>
`;

var countDownMap = {};

(function () {
  readValue();
  appendTemplate();
  const { createApp } = unsafeWindow.VueEntry;

  var app = createApp({
      data() {
          return {

            btn: {
              status: 0, // 0未开始，1进行中，2报错
            },
            msg: "",
            video: {
              status: 0,// 0无；1有
              name: "无视频",
              videoTime: 0,
              currentTime: 0,// 当前播放的进度
              requireTime: 0,// 系统要求答题时间
              delayTime: 0, // 程序计算的延迟时间
            },
            exam: {
              status: 0, // 1做题中
              currentQsNo: null,
              currentQsAnswer: '正在获取',
              countDownAnswer: 0,// 倒计时
              currentQsIndex: 0,// 当前答题的角标
              startTime: 0 // 开始答题的时间戳
            }
          };
      },
      mounted() {
        this.countDown();
      },
      methods: {
        countDown: function() {
          setInterval(function(){
            if (countDownMap == null || countDownMap.length <= 0) {
              return;
            }
            Object.values(countDownMap).forEach(callback => {
                callback();
            });
          }, 1000);
        },
        btnClick: function() {
          const $this = this;
          if (this.btn.status == 0) {
            this.btn.status = 1;
          } else {
            this.btn.status = 0;
            // 暂停
            $this.stopVideo();
            return;
          }

          const path = location.pathname
          if (path === '/classroom/start') {
            // 视频课
            this.doVideoCourse()
          } else if (path === '/paper/start') {
            // 课程作业或考试
            $this.exam.status = 1;
            $this.doPaper()
          } else {
            //
          }
        },
        doVideoCourse: function() {
          const $this = this;
          // 章
          const courseList = document.querySelectorAll('.course-l .course-list-txt');
          // 待观看的节id列表
          const unplayedList = [];
          courseList.forEach(item => {
            const sections = item.querySelectorAll('dd.z-gery-icon')
            sections.forEach(section => {
              const unplay = section.querySelector('.fa-youtube-play')
              if (unplay) {
                unplayedList.push(section.dataset.jieId)
              }
            })
          });

          setTimeout(function(){
            $this.nextVideo(unplayedList);
          }, 1000)
          //timer = setInterval(nextVideo, 1000 * 5)
        },
        playVideo: function () {
          const video = $("#video-content>video")[0];
          if (video == null) {
            alter('没有找到视频对象');
            return;
          }
          if (video.paused) {
            $("#video-content .prism-big-play-btn").trigger('click');
          }
          return video;
        },
        stopVideo: function() {
          const video = $("#video-content>video")[0];
          if (video != null && !video.paused) {
            $("#video-content .prism-big-play-btn").trigger('click');
          }
          return video;
        },
        nextVideo: function(unplayedList) {
          const $this = this;

          if (unplayedList.length < 1) {
            clearInterval(timer);
            alter("当前页面全部课程已完成");
            $this.btn.status = 0;
            return
          }

          const section = $(`dd[data-jie-id="${unplayedList[0]}"]`);

          const videoName = $(section).textContent || $(section).innerText;

          $this.video.name = videoName;

          $(section).parent().find('dt.z-gery-icon').trigger('click');
          $(section).trigger('click');

          setTimeout(async () => {

            const video = $this.playVideo();
            if (video == null) {
              return;
            }

            $this.videoTime(video, function(){
              doVideoQs(function(){
                // 弹出一个元素
                unplayedList.shift()
                console.log(`${unplayedList.length} left`);
                video.pause();
                fun_watch_rec();
                fun_watch_rec();
                setTimeout(function() {
                  $this.nextVideo(unplayedList);
                }, 1000)
              });

            });

          }, 2000)
        },
        videoTime: function(video, callback){
          const $this = this;
          // 获取视频长度
          var videoDuration = video.duration;
          var currentTime = video.currentTime;
          // 给当前时间加上随机秒
          // currentTime = currentTime + random(10,30);

          $this.video.status = 1;
          $this.video.videoTime = Math.ceil(videoDuration);
          $this.video.currentTime = Math.ceil(currentTime);
          $this.video.delayTime = globalConfig['videoWatchPer'] * videoDuration;

          // 视频观看时间超过90% 才执行回调
          if (currentTime/ videoDuration > globalConfig['videoWatchPer']){
            callback();
          } else{
            setTimeout(function(){
              $this.videoTime(video, callback);
            }, 1000);
          }
        },
        // 考试相关
        doPaper: function() {
          const $this = this;
          const qList = document.querySelectorAll('#questionModule > ul > li');
          // 随机生成本次做题多少秒
          let totalSeconds = random(15*60, 1*60*60);
          if (totalSeconds > qList.length * 120) {
            totalSeconds = qList.length * 120;
          }

          // 平均每道题需要多少秒
          let oneQsMaxThinkSeconds = globalConfig['oneQsMaxThinkSecond'];
          let seconds = totalSeconds /qList.length;
          seconds = parseInt(seconds);
          if(seconds > oneQsMaxThinkSeconds){
            seconds = oneQsMaxThinkSeconds;
          }

          console.log(`一共${qList.length}道试题，${totalSeconds}秒，每道题平均${seconds}秒`);

          $this.doPaperQs(seconds, qList);
        },
        doPaperQs: function(seconds, qList){
          const $this = this;
          if ($this.exam.startTime == 0) {
            $this.exam.startTime = new Date().getTime();
          }
          if ($this.exam.currentQsIndex === qList.length) {
              //clearInterval(timer)
              //document.querySelector('#btn_submit').click()
              //btn.innerText = '开始'

              var costTime = new Date().getTime() - $this.exam.startTime;
              costTime = parseInt(costTime/1000);

              sendNotification('考试完成，请提交试卷', `本次考试用时${costTime}秒，一共${qList.length}道试题`);

              return
          }
          let qIndex = $this.exam.currentQsIndex;
          const qid = qList[qIndex].querySelector(`input[name="qid[${qIndex}]"]`).value;
          const qver = qList[qIndex].querySelector(`input[name="qver[${qIndex}]"]`).value;
          const qNo = $(qList[qIndex]).find('em.qd_index').html();

          $this.exam.currentQsNo = qNo;
          $this.exam.currentQsAnswer = '正在获取';


          getAnswerByQid(qid, qver, function (answer) {
            $this.exam.currentQsAnswer = '已经获取';

            const options = qList[qIndex].querySelector('dl.sub-answer')
            if (options) {
              // 选择 判断题
              answer.forEach(a => {
                options.querySelector(`dd[data-value="${a}"]`).click()
              })
            } else {
              // 填空 简答
              const textarea = qList[qIndex].querySelector('.mater-respond textarea');
              $(textarea).focus();
              $(textarea).val(answer);
              $(textarea).trigger('change');
            }
            $this.exam.currentQsIndex = qIndex+1;
            qIndex = $this.exam.currentQsIndex;

            //console.log(`Done ${qid}, ${qList.length - qIndex} left`)

            const tinkRandomSecond = globalConfig['tinkRandomSecond'];
            const randomSta = seconds - tinkRandomSecond;
            if (randomSta <= 0) {
              randomSta = seconds;
            }

            const sleepTime = random(randomSta, seconds + tinkRandomSecond);
            //console.log(`seconds=${seconds} sleepTime=${sleepTime} `);

            $this.exam.countDownAnswer = sleepTime;

            countDownMap[`${qIndex}`] = function(){
              $this.exam.countDownAnswer = $this.exam.countDownAnswer-1;
              //console.log($this.exam.countDownAnswer);
            };

            setTimeout(function(){
              delete countDownMap[`${qIndex}`];
              $this.doPaperQs(seconds, qList);
            }, sleepTime * 1000);
          });

        }
      },
      destroyed() {
          $('#vueRoot').remove()
      }
  }).mount("#vueRoot");


})();

function appendTemplate(){
  var ul_tag = $("body");
  if (ul_tag && document.querySelectorAll("#vueRoot").length == 0) {
      ul_tag.append(viewTemplate);
  };
}




function doVideoQs(callback) {
  let $this = this;
  const question = document.querySelector('#question-area .m-question');
  // console.log(question)
  const qid = question.dataset.qid;
  const qver = question.dataset.qver;

  getAnswerByQid(qid, qver, function(answer) {
    answer.forEach(a => {
      document.querySelector(`.m-question-option[data-value="${a}"]`).click();
    });
    $("#submitSelfBtn").trigger('click');

    setTimeout(function(){
      callback();
    }, 1000);
  });
}

/**生成随机数*/
function random(m, n){
  return parseInt(Math.random()*(m-n)+n);
}
/** 获取答案 */
function getAnswerByQid(qid, ver, callback) {
  if (ver == null) {
    ver = 0;
  }
  // https://kc.jxjypt.cn/paper/question/resolve/txt?uid=${uid}&pqid=${qid}

  GM_xmlhttpRequest({
    url: `https://kc.jxjypt.cn/classroom/favorite/question/view?qid=${qid}&ver=${ver}`,
    method: 'get',
    responseType: 'text',
    onload: function (text) {
      const parser = new DOMParser()
      const html = parser.parseFromString(text.response, 'text/html')
      let answer
      const right = html.querySelector('.right')

      if (right) {
        const text = right.innerText.trim()
        if (text === '错') {
          // 判断题
          answer = ['错误']
        } else if (text === '对') {
          answer = ['正确']
        } else {
          // 选择题
          answer = right.innerText.trim().split('')
        }
      } else {
        // 填空 简答
        answer = html.querySelector('.wenzi').innerText.trim()
      }

      callback(answer);
    }
  });
}

function sendNotification(title, body){
  GM_notification({
    text: body,
    title: title
  });

 /* Notification.requestPermission((res) => {
    console.log(res)  // granted、denied、default
    if (res != 'granted') {
      return;
    }
    let notice = new Notification(title, {
        body: body,
        renotify: false,
        requireInteraction: true,
        silent: false,
    });


  });*/
}
