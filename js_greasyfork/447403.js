// ==UserScript==
// @name         河南省专业技术人员继续教育网2022
// @include      http://web.chinahrt.com
// @include      https://web.chinahrt.com
// @version      7.1
// @description  1.0
// @author       cs
// @match        http://*.chinahrt.com/*
// @match        https://*.chinahrt.com/*
// @match        http://videoadmin.chinahrt.com.cn/videoPlay/play*
// @match        http://videoadmin.chinahrt.com/videoPlay/play*
// @match        https://videoadmin.chinahrt.com.cn/videoPlay/play*
// @match        https://videoadmin.chinahrt.com/videoPlay/play*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/790766
// @downloadURL https://update.greasyfork.org/scripts/447403/%E6%B2%B3%E5%8D%97%E7%9C%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%912022.user.js
// @updateURL https://update.greasyfork.org/scripts/447403/%E6%B2%B3%E5%8D%97%E7%9C%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%912022.meta.js
// ==/UserScript==

var oldxhr = window.XMLHttpRequest

function newobj() {
}

let courseList = ""

// 拦截ajax请求
window.XMLHttpRequest = function () {
  let tagetobk = new newobj();
  tagetobk.oldxhr = new oldxhr();
  let handle = {
    get: function (target, prop, receiver) {
      if (prop === 'oldxhr') {
        return Reflect.get(target, prop);
      }
      if (typeof Reflect.get(target.oldxhr, prop) === 'function') {
        if (Reflect.get(target.oldxhr, prop + 'proxy') === undefined) {
          target.oldxhr[prop + 'proxy'] = (...funcargs) => {
            let result = target.oldxhr[prop].call(target.oldxhr, ...funcargs)
            return result;
          }
        }
        return Reflect.get(target.oldxhr, prop + 'proxy')
      }
      if (prop.indexOf('response') !== -1) {
        let url = target.oldxhr.responseURL
        if (url.indexOf("vueapi/course/courseDetail") !== -1) {
          fetchCourseList(JSON.parse(target.oldxhr.responseText))
        }
        return Reflect.get(target.oldxhr, prop)
      }
      return Reflect.get(target.oldxhr, prop);
    },
    set(target, prop, value) {
      return Reflect.set(target.oldxhr, prop, value);
    },
    has(target, key) {
      return Reflect.has(target.oldxhr, key);
    }
  }

  let ret = new Proxy(tagetobk, handle);
  return ret;
}

// 获取query参数
const getQueryParam = (param) => {
  let urlparam = window.location.href;
  let relparam = param + "=";
  let isparam = urlparam.indexOf(relparam);
  if (isparam < 0) return "";
  let start = isparam + relparam.length;
  let ismore = urlparam.indexOf("&", start);
  let end = ismore < 0 ? urlparam.length : ismore;
  return urlparam.substring(start, end);
}

function fetchCourseList(result) {
  courseList = result.data.course.chapter_list
}

// 以保存课程列表
function getSessionCourseList() {
  const key = sessionStorage.getItem('realName') + '-localCourseList';
  return localStorage.getItem(key) === null ? [] : JSON.parse(localStorage.getItem(key))
}

function coursePlayUrl(course){
  return `https://web.chinahrt.com/index.html#/v_video?platformId=${course.platformId}&trainplanId=${course.trainPlanId}&courseId=${course.courseId}&sectionId=${course.id}`;
}

// 添加课程按钮
function addButton() {
  let interval = setInterval(function () {
    const href = window.location.href;
    let selfButton = document.getElementById('selfButton');
    if (href.indexOf('/index.html#/v_courseDetails') > -1 && selfButton === null) {
      var button = document.createElement("button");
      button.id = "selfButton";
      button.innerHTML = "添加到播放列表";
      button.style.fontSize = "20px";
      button.style.border = "1px solid rgb(204, 204, 204)";
      button.style.borderRadius = "5px";
      button.style.padding = "8px";
      button.style.background = "#4bccf2";
      button.style.color = "#fff";
      button.style.cursor = "pointer";
      button.onclick = function () {
        let sessionCourseList = getSessionCourseList();
        let platformId = getQueryParam('platformId');
        let trainPlanId = getQueryParam('trainplanId');
        let courseId = getQueryParam('courseId');
        // 存储到localStorage
        for (let j = 0; j < courseList.length; j++) {
          let sectionList = courseList[j].section_list;
          for (let i = 0; i < sectionList.length; i++) {
            if (sectionList[i].study_status !== "已学完"
              && sessionCourseList.find(course => course.id === sectionList[i].id) === undefined) {
              sessionCourseList.push({
                name: courseList[j].name + "-" +sectionList[i].name,
                id: sectionList[i].id,
                platformId,
                trainPlanId,
                courseId,
                status: 0
              });
            }
          }
        }
        const key = sessionStorage.getItem('realName') + '-localCourseList';
        localStorage.setItem(key, JSON.stringify(sessionCourseList));
        selectCourseList();
        alert("添加完成");
      }
      const element = document.getElementsByClassName("shopping-button")[0];
      if (element !== undefined) {
        element.insertBefore(button, element.getElementsByClassName("comment")[0]);
        clearInterval(interval);
      }
    }
  }, 1000)
}

function selectCourseList() {
  const existsWrapper = document.getElementById('selfCourseWrapper');
  if (existsWrapper) {
    existsWrapper.remove();
  }
  var courseWrapper = document.createElement("div");
  courseWrapper.id = 'selfCourseWrapper';
  courseWrapper.style.cssText = "overflow-y:scroll;position:fixed;right:0;top:500px;width:250px;height:200px;background-color:#FFF;z-index:9999;border: 1px solid #ccc;";
  var courseList = document.createElement('ul');
  courseList.style.cssText = "list-style:none;font-size:10px";
  let sessionCourseList = getSessionCourseList();
  for (let i = 0;i < sessionCourseList.length; i ++ ) {
    let list = document.createElement('li');
    let url = document.createElement('a');
    url.target = "_blank";
    url.href = coursePlayUrl(sessionCourseList[i]);
    url.innerHTML = i + '.' + sessionCourseList[i].name;
    list.appendChild(url);
    courseList.appendChild(list);
  }
  courseWrapper.appendChild(courseList);
  document.body.appendChild(courseWrapper);
}

window.onload = function () {
  // 播放详情页面
  const href = window.location.href;
  if (href.indexOf('/videoPlay/play') === -1 && href.indexOf('v_video') === -1) {
    selectCourseList();
    setInterval(function () {
      window.location.reload(true);
    }, 60000);
  }
  if (href.indexOf('/index.html#/v_courseDetails') > -1) {
    addButton();
  }
  // 课程页面 /course/preview
  const  app = document.querySelector('#app');
  if (app !== null) {
    app.__vue__.$router.afterHooks.push(() => {
      addButton();
      selectCourseList();
    })
  }

  if (href.indexOf('/index.html#/v_video') > -1) {
    $(document).ready(function () {
      selectCourseList();
    });
    window.addEventListener("message", (event) => {
      if (event.data === "ended") {
        let sectionId = getQueryParam('sectionId');
        let courseId = getQueryParam('courseId');
        let sessionCourseList = getSessionCourseList();
        let index = sessionCourseList.findIndex(course => course.id === sectionId && course.courseId === courseId);
        if (index !== -1) {
          sessionCourseList.splice(index, 1);
          const key = sessionStorage.getItem('realName') + '-localCourseList';
          localStorage.setItem(key, JSON.stringify(sessionCourseList));
        }
        let course = sessionCourseList.find(course => course.status === 0)
        if (course === undefined) {
          alert('已选课程都学完了');
        } else {
          const url = coursePlayUrl(course);
          window.location.href = url;
        }
      }
    }, false);
  }

  // 播放frame页面
  if (href.indexOf('/videoPlay/play') > -1) {
    $(document).ready(function () {
      // 顶端漂浮提示
      var $topTips = $('<div style="position: fixed;top:0;left:10%;font-size:16px;font-weight: bold;color:red;background: #FFF;">' +
        '点击课程详情页中的插件提供的【添加到播放列表】按钮添加需要自动播放的课程' +
        '<br/>受到浏览器策略影响第一次可能无法自动播放，请手动点击播放。</div>');
      $(document.body).append($topTips);


      // 从localstorage中获取设置
      var autoplay = (localStorage.getItem('autoplay') || 'true') === 'true';
      var mute = (localStorage.getItem('mute') || 'true') === 'true';
      var speed = parseInt(localStorage.getItem('speed') || '1');
      var drag = parseInt(localStorage.getItem('drag') || '5');

      // ==================页面设计开始==========================
      // 增加页面配置
      var configDiv = document.createElement("div");
      configDiv.style.cssText = "position:fixed;right:0;top:0;width:250px;height:400px;background-color:#FFF;z-index:9999;border: 1px solid #ccc;";

      // 标题
      var configTitle = document.createElement("div");
      configTitle.style.cssText = "border-bottom:1px solid #ccc ;padding: 5px;font-weight: bold;";
      configTitle.innerHTML = "视频控制配置";
      configDiv.appendChild(configTitle);

      // 外部包裹
      var configWrapper = document.createElement("div");
      configWrapper.style.cssText = "padding: 5px;padding-bottom: 5px;font-size: 12px;line-height: 150%;";

      // 是否自动播放
      var configAutoPlay = document.createElement("div");
      configAutoPlay.style.cssText = "border-bottom: 1px dotted #ccc ;padding-bottom: 5px;";
      var p = document.createElement("p");
      p.innerHTML = "是否自动播放：";
      configAutoPlay.appendChild(p);
      var inputAutoPlay = document.createElement("input");
      inputAutoPlay.type = "radio";
      inputAutoPlay.name = "autoPlay";
      inputAutoPlay.value = "true";
      inputAutoPlay.checked = autoplay;
      inputAutoPlay.onclick = function () {
        localStorage.setItem('autoplay', 'true');
      }
      configAutoPlay.appendChild(inputAutoPlay);
      var labelAutoPlay = document.createElement("label");
      labelAutoPlay.innerHTML = "是";
      configAutoPlay.appendChild(labelAutoPlay);
      var inputAutoPlay2 = document.createElement("input");
      inputAutoPlay2.type = "radio";
      inputAutoPlay2.name = "autoPlay";
      inputAutoPlay2.value = "false";
      inputAutoPlay2.checked = !autoplay;
      inputAutoPlay2.onclick = function () {
        localStorage.setItem('autoplay', 'false');
      }
      configAutoPlay.appendChild(inputAutoPlay2);
      var labelAutoPlay2 = document.createElement("label");
      labelAutoPlay2.innerHTML = "否";
      configAutoPlay.appendChild(labelAutoPlay2);
      configWrapper.appendChild(configAutoPlay);

      // 是否静音
      var configMute = document.createElement("div");
      configMute.style.cssText = "border-bottom: 1px dotted #ccc ;padding-bottom: 5px;";
      var p = document.createElement("p");
      p.innerHTML = "是否静音：";
      configMute.appendChild(p);
      var inputMute = document.createElement("input");
      inputMute.type = "radio";
      inputMute.name = "mute";
      inputMute.value = "true";
      inputMute.checked = mute;
      inputMute.onclick = function () {
        localStorage.setItem('mute', 'true');
        player.videoMute();
      }
      configMute.appendChild(inputMute);
      var labelMute = document.createElement("label");
      labelMute.innerHTML = "是";
      configMute.appendChild(labelMute);
      var inputMute2 = document.createElement("input");
      inputMute2.type = "radio";
      inputMute2.name = "mute";
      inputMute2.value = "false";
      inputMute2.checked = !mute;
      inputMute2.onclick = function () {
        localStorage.setItem('mute', 'false');
        player.videoEscMute();
      }
      configMute.appendChild(inputMute2);
      var labelMute2 = document.createElement("label");
      labelMute2.innerHTML = "否";
      configMute.appendChild(labelMute2);
      var muteTip = document.createElement("p");
      muteTip.style.cssText = "font-size:13px;font-weight:bold;";
      muteTip.innerHTML = "注意：不静音，视频可能会出现不会自动播放";
      configMute.appendChild(muteTip);
      configWrapper.appendChild(configMute);
      // 启用拖放
      var configDrag = document.createElement("div");
      configDrag.style.cssText = "border-bottom: 1px dotted #ccc ;padding-bottom: 5px;";
      var p = document.createElement("p");
      p.innerHTML = "启用拖放（慎用）：";
      configDrag.appendChild(p);
      var inputDrag = document.createElement("input");
      inputDrag.type = "radio";
      inputDrag.name = "drag";
      inputDrag.value = "5";
      inputDrag.checked = drag === 5;
      inputDrag.onclick = function () {
        localStorage.setItem('drag', '5');
        player.changeConfig('config', 'timeScheduleAdjust', 5);
      }
      configDrag.appendChild(inputDrag);
      var labelDrag = document.createElement("label");
      labelDrag.innerHTML = "还原";
      configDrag.appendChild(labelDrag);
      var inputDrag2 = document.createElement("input");
      inputDrag2.type = "radio";
      inputDrag2.name = "drag";
      inputDrag2.value = "1";
      inputDrag2.checked = drag === 1;
      inputDrag2.onclick = function () {
        localStorage.setItem('drag', '1');
        player.changeConfig('config', 'timeScheduleAdjust', 1);
      }
      configDrag.appendChild(inputDrag2);
      var labelDrag2 = document.createElement("label");
      labelDrag2.innerHTML = "启用";
      configDrag.appendChild(labelDrag2);

      configWrapper.appendChild(configDrag);

      // 播放速度调整
      // var configSpeed = document.createElement("div");
      // configSpeed.style.cssText = "border-bottom: 1px dotted #ccc ;padding-bottom: 5px;";
      // var p = document.createElement("p");
      // p.innerHTML = "播放速度调整（慎用，不知后台是否检测）：";
      // configSpeed.appendChild(p);
      // var inputSpeed = document.createElement("input");
      // inputSpeed.type = "radio";
      // inputSpeed.name = "speed";
      // inputSpeed.value = "0";
      // inputSpeed.checked = speed === 0;
      // inputSpeed.onclick = function () {
      //   localStorage.setItem('speed', '0');
      //   player.changePlaybackRate(0);
      // }
      // configSpeed.appendChild(inputSpeed);
      // var labelSpeed = document.createElement("label");
      // labelSpeed.innerHTML = "低速";
      // configSpeed.appendChild(labelSpeed);
      // var inputSpeed2 = document.createElement("input");
      // inputSpeed2.type = "radio";
      // inputSpeed2.name = "speed";
      // inputSpeed2.value = "1";
      // inputSpeed2.checked = speed === 1;
      // inputSpeed2.onclick = function () {
      //   localStorage.setItem('speed', '1');
      //   player.changePlaybackRate(1);
      // }
      // configSpeed.appendChild(inputSpeed2);
      // var labelSpeed2 = document.createElement("label");
      // labelSpeed2.innerHTML = "正常";
      // configSpeed.appendChild(labelSpeed2);
      // var inputSpeed3 = document.createElement("input");
      // inputSpeed3.type = "radio";
      // inputSpeed3.name = "speed";
      // inputSpeed3.value = "2";
      // inputSpeed3.checked = speed === 2;
      // inputSpeed3.onclick = function () {
      //   localStorage.setItem('speed', '2');
      //   player.changePlaybackRate(2);
      // }
      // configSpeed.appendChild(inputSpeed3);
      // var labelSpeed3 = document.createElement("label");
      // labelSpeed3.innerHTML = "高速";
      // configSpeed.appendChild(labelSpeed3);
      // var inputSpeed4 = document.createElement("input");
      // inputSpeed4.type = "radio";
      // inputSpeed4.name = "speed";
      // inputSpeed4.value = "3";
      // inputSpeed4.checked = speed === 3;
      // inputSpeed4.onclick = function () {
      //   localStorage.setItem('speed', '3');
      //   player.changePlaybackRate(3);
      // }
      // configSpeed.appendChild(inputSpeed4);
      // var labelSpeed4 = document.createElement("label");
      // labelSpeed4.innerHTML = "超高速";
      // configSpeed.appendChild(labelSpeed4);
      // var speedTip = document.createElement("div");
      // speedTip.style.cssText = "font-size:13px;font-weight:bold;";
      // speedTip.innerHTML = "提示：基于播放器本身的速度挡位实现，目测最高大概是2倍速。";
      // configSpeed.appendChild(speedTip);
      // configWrapper.appendChild(configSpeed);

      configDiv.appendChild(configWrapper);

      document.body.appendChild(configDiv);
      // ==================页面设计结束==========================
      // 移除讨厌的事件
      window.onfocus = function () {
      };
      window.onblur = function () {
      };

      function run() {
        // 总是显示播放进度
        player.changeControlBarShow(true);

        // 拖动开关
        player.changeConfig('config', 'timeScheduleAdjust', drag);

        if (mute) {
          player.videoMute();
        } else {
          player.videoEscMute();
        }

        player.changePlaybackRate(speed);

        if (autoplay) {
          player.videoPlay();
        }
      }

      var tmp = setInterval(function () {
        if (player != undefined) {
          player.addListener('loadedmetadata', run);
          player.addListener('pause', () => {
           try {
              player.play();
           } catch (e) {
              console.log(e);
           }
          })
          run();
          clearInterval(tmp);
          // 播放结束
          player.addListener('ended', function () {
            // 通知父窗体播放结束
            window.parent.postMessage("ended", '*');
          });
        }
      }, 500);
    });
  }
}
