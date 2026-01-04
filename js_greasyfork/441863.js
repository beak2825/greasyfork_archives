// ==UserScript==
// @name         雨课堂助手
// @namespace    https://github.com/Conard-Ferenc/yuketang-assistant
// @version      1.4.5
// @description  完全加载页面3秒后，获取雨课堂试卷答案
// @author       Conard
// @match        https://changjiang.yuketang.cn/*
// @icon         https://changjiang.yuketang.cn/static/images/favicon.ico
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/441863/%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/441863/%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const js = document.createElement("script");
  js.innerHTML = `class Move{clickstatus = false;lastX = 0;lastY = 0;lastcX = 0;lastcY = 0;moveObject = undefined;mousedown(e){const target = e.target.className;if(target.includes("title")){this.clickstatus = true;this.moveObject = document.getElementById("tip");this.lastX = this.moveObject.offsetLeft;this.lastY = this.moveObject.offsetTop;this.lastcX = e.clientX;this.lastcY = e.clientY}}mousemove(e){if(this.clickstatus){this.moveObject.style.left = this.lastX+(e.clientX - this.lastcX)+"px";this.moveObject.style.top = this.lastY+(e.clientY - this.lastcY)+"px"}}mouseup(e){this.clickstatus = false;this.lastX = 0;this.lastY = 0;this.lastcX = 0;this.lastcY = 0}}const move = new Move();document.addEventListener("mousedown",move.mousedown);document.addEventListener("mousemove",move.mousemove);document.addEventListener("mouseup",move.mouseup);`;
  document.head.appendChild(js);
  const style = document.createElement("style");
  style.innerHTML = `#tip.tip{z-index:20001;min-width:150px;max-width:300px;min-height:200px;max-height:70vh;position:absolute;top:100px;left:200px;background-color:aqua;-webkit-box-shadow:1px 1px 3px #292929;-moz-box-shadow:1px 1px 3px #292929;box-shadow:1px 1px 3px #292929;border-radius:10px;overflow:overlay;}.tiphidden{display:none;}.tip>.title{display:block;height:30px;background-color:cornflowerblue;color:#fff;text-align:center;user-select:none;line-height:30px;cursor:grab;position:sticky;top:0;}.tip>.title:active{cursor:grabbing!important;}.tip>.content{padding:4px;padding-left:25px;}.tip>.content ol{list-style-type:decimal;}.tip>.content code{font-weight:bold;}.tip>.content code>img{max-width:100%;vertical-align:top;}`;
  document.head.appendChild(style);
  const tip = document.createElement("div");
  tip.classList.add("tip", "tiphidden");
  tip.setAttribute("id", "tip");
  tip.innerHTML = `<a class="title">雨课堂助手</a><div id="content" class="content"></div>`;
  document.body.appendChild(tip);
  const content = document.getElementById("content");
  const pluginMap = {
    studentQuiz: () => {
      setTip();
      return setTimeout(getAns, 3000);
    },
    studentCards: () => {
      setTip();
      return autoCWare();
    },
    studentLesson: (id) => {
      setTip();
      return autoBulletChat(id);
    },
  }
  let nowPlugin;
  document.querySelector("div#app").__vue__.$router.afterHooks.push((e) => {
    console.log(e);
    const { path } = e;
    let [, key, id] = path.split("/");
    console.log(path, key);
    if (location.href.includes("/lesson/fullscreen/v3/")) key = "studentLesson";
    if (nowPlugin === key) return;
    else if (nowPlugin !== key) nowPlugin = key;
    if (pluginMap[nowPlugin]) return pluginMap[nowPlugin](id);
    nowPlugin = null;
    return setTip(true);
  });
  const setTip = (hidden) => (hidden ? tip.classList.add("tiphidden") : (tip.classList.remove("tiphidden"), (content.innerHTML = "")));
  const autoSelect = () => {
    const selection = window.getSelection();
    const codeList = content.querySelectorAll("code");
    codeList.forEach(code => {
      code.addEventListener("dblclick", e => {
        selection.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(code);
        selection.addRange(range);
      });
    })
  }
  const getAns = () => {
    let quizObj = document.getElementById("rainiframe").contentWindow.quizData;
    console.log(quizObj);
    const ans = quizObj.Slides.filter((item) => item.Problem).map((item) => {
      let outAns = item.Problem.Answer;
      if (outAns) return outAns;
      if (item.Problem.Blanks) {
        const ansList = item.Problem.Blanks.map((citem) => {
          return citem.Answers.join("</code>或<code>");
        });
        return ansList.join("</code>，<code>");
      }
      if (item.Problem.RemarkRich) {
        const imgList = item.Problem.RemarkRich.Shapes.filter(({ Type, URL }) => URL || Object.is("msoPicture", Type)).map(({ URL }) => `<img src="${URL}" />`);
        if (!imgList.length) return "老师未设置答案或题型暂不支持";
        return imgList.join("");
      }
      return "老师未设置答案或题型暂不支持";
    });
    console.log(ans);
    let ansStr = "<ol>";
    ans.forEach(item => {
      ansStr += `<li><code>${item}</code></li>`;
    });
    content.innerHTML += ansStr + "</ol>"
    autoSelect();
  };
  const autoCWare = () => {
    const removeEventListener = () => {
      try {
        document.removeEventListener("visibilitychange", document.querySelector(".basePPT__component").__vue__.handleVisibilityChange);
      } catch {
        console.log("dom is never");
      }
    }
    let timer;
    content.innerHTML = `<div>课件挂机:<input id="sec-value" type="number" max="40" min="5" value="5" />s <button id="run-button">开始挂机</button></div><div>视频挂机:<button id="video-button">视频挂机</button></div>`;
    document.querySelector("button#run-button").addEventListener("click", (e) => {
      const seconds = document.querySelector("#sec-value").value * 1 || 5;
      console.log(e);
      const key = e.target.textContent;
      const eventMap = {
        开始挂机: () => {
          removeEventListener();
          e.target.textContent = "暂停挂机";
          const list = [...document.querySelectorAll(".thumbImg-container")].filter((i) => i.nextElementSibling.className.endsWith("noRead"));
          const deep = list.length;
          let index = 0;
          timer = setInterval(() => {
            if (index + 1 >= deep) return clearInterval(timer);
            list[++index].click();
          }, seconds * 1000);
        },
        暂停挂机: () => {
          console.log("暂停");
          e.target.textContent = "开始挂机";
          clearInterval(timer);
        }
      }
      eventMap[key]?.();
    });
    document.querySelector("button#video-button").addEventListener("click", (e) => {
      removeEventListener();
      const list = [...document.querySelectorAll(".thumbImg-container")].filter((i) => i.nextElementSibling.className.endsWith("noRead"));
      // const list = [...document.querySelectorAll(".video-box.box-center")].filter((i) => !i.querySelector("i"));

      const play = (index = 0) => {
        if (index >= list.length) return;
        list[index]?.click();
        const videoTrigger = document.querySelector(".swiper-slide-active .video-box.box-center");
        if (!videoTrigger || videoTrigger.querySelector("i")) return play(index + 1);
        videoTrigger.click();
        setTimeout(() => {
          // document.querySelector(".xt_video_player_speed .xt_video_player_common_list li").click();
          document.querySelector("video").addEventListener("ended", () => {
            console.log("ended");
            play(index + 1);
          }, { once: true })

        }, 500)
      }
      play(0);
      console.log(list);
    })
  };
  const autoBulletChat = (lessonId) => {
    console.log(lessonId);
    content.innerHTML = `<input id="chat-value" type="text" value="" placeholder="输入定时发送内容" /><br/><input id="min-value" type="number" max="30" min="1" value="5" />min <button id="run-button">开始挂机</button>`;
    let time;
    document.querySelector("button#run-button").addEventListener("click", (e) => {
      let message = document.querySelector("#chat-value").value;
      let minutes = document.querySelector("#min-value").value * 1 || 5;
      if (time || message.match(/^\s*$/)) {
        clearInterval(time);
        console.log("stop last interval")
        return (time = undefined);
      }
      console.log("message:", message, "\ntime:", minutes);
      const sent = () => {
        fetch("https://changjiang.yuketang.cn/api/v3/lesson/danmu/send", {
          headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "authorization": `Bearer ${localStorage.getItem("Authorization")}`,
            "content-type": "application/json;charset=UTF-8",
            "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Microsoft Edge\";v=\"104\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-client": "h5",
            "xtbz": "ykt"
          },
          referrer: "https://changjiang.yuketang.cn/lesson/fullscreen/v3/703749584166119168/exercise/49",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: JSON.stringify({ lessonId, target: "", userName: "", message, extra: "", requiredCensor: false, wordCloud: true, showStatus: true, formStart: "50" }),
          method: "POST",
          mode: "cors",
          credentials: "include"
        });
      };
      time = setInterval(() => {
        sent();
      }, minutes * 60 * 1000);
    });
  }

})();