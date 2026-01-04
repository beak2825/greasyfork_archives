// ==UserScript==
// @name         withName
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @description  A plugin to help students choose courses
// @author       fans1106
// @match        https://xkfw.xjtu.edu.cn/xsxkapp/sys/xsxkapp/*default/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474415/withName.user.js
// @updateURL https://update.greasyfork.org/scripts/474415/withName.meta.js
// ==/UserScript==

//tcType为课程类型，各代号含义如下“FANKC”方案内课程 "FANWKC"方案外课程 “TJKC”推荐课程 “XGXK”校公选课 “CXKC”重修课程 “TYKC”体育课程 "FXKC"辅修课程 "QXKC"全校课程

// 当前校区
let currentCampus = JSON.parse(sessionStorage.getItem('currentCampus'));
let campusCode = currentCampus.code; // 校区
//学生信息
let studentInfo = JSON.parse(sessionStorage.getItem('studentInfo'));
let studentCode = studentInfo.code; // 学号
let electiveBatch = studentInfo.electiveBatch;
let electiveBatchCode = electiveBatch.code; // 选课批次
let courseName = []
let courseType = []
let className = []
let i = 0, len, times = 0

//json转query格式
function buildQueryParams(addParam) {
  const queryParams = new URLSearchParams();
  for (const key in addParam) {
    if (Object.hasOwnProperty.call(addParam, key)) {
      queryParams.append(key, JSON.stringify(addParam[key]));
    }
  }
  return queryParams.toString();
}

//构建选课API的请求体
function buildAddVolunteerParam(tcId, tcType) {
  let addData = '{"operationType":"1","studentCode":"' + studentCode +
    '","electiveBatchCode":"' + electiveBatchCode +
    '","teachingClassId":"' + tcId +
    '","isMajor":"1' +
    '","campus":"' + campusCode +
    '","teachingClassType":"' + tcType + '"}';

  let addStr = JSON.parse('{"data":' + addData + '}');
  let appParam = {
    'addParam': addStr
  };
  return appParam;
}

//发送选课请求
async function select_course(i) {
  try {
    let body = buildAddVolunteerParam(courseName[i], courseType[i])
    body = buildQueryParams(body)
    const data = await fetch(
      "https://xkfw.xjtu.edu.cn/xsxkapp/sys/xsxkapp/elective/volunteer.do",
      {
        headers: {
          "User-Agent": navigator.userAgent,
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          "token": sessionStorage.token
        },
        body: body,
        method: "POST",
        mode: "cors",
      })
    await data.json().then((e) => {
      if (e.msg == '该课程已经存在选课结果中' || e.msg.includes('冲突') || e.msg.includes('成功') || e.msg.includes('学分限制') || e.msg.includes('非法') || times >= 100000) {
        className[i] += '  ' + e.msg
        console.log(courseName[i] + "抢课成功")
        courseName.splice(i, 1)
        courseType.splice(i, 1)
        console.log("剩余课程：", courseName)
        if (courseName.length == 0) {
          console.log(className)
          let details = '抢课结果:\n'
          className.forEach((item) => {
            details += item + '\n'
          })
          alert(details)
          className = []
          courseName = []
          courseType = []
          times = 0
          return
        }
        else {
          setTimeout(() => {
            select_course(i)
            times++
          }, 600);
        }
      } else {
        if (times % 1500 == 0) {
          updatecookie()
        }
        setTimeout(() => {
          select_course((i + 1) % courseName.length)
          times++
        }, 600);
      }
    })
  }
  catch (error) {
    console.log(error)
  }
}

//解决登陆失效问题
function updatecookie() {
  // 要打开的新页面的 URL
  const urlToOpen = 'https://xkfw.xjtu.edu.cn'; // 替换为你想打开的 URL

  // 创建一个新的隐藏 iframe
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none'; // 隐藏 iframe
  document.body.appendChild(iframe);

  // 在 iframe 中打开新页面
  iframe.contentWindow.location.href = urlToOpen;

  // 可选：在一定时间后移除 iframe
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 2000);
}

// 在课程卡片上插入按钮
function insertButton(card, mode, detail) {
  let tcid
  let button = document.createElement('button');
  button.innerHTML = '添加抢课'; // 按钮显示的文本
  button.style = 'background-color:dodgerblue; color:white; border:0; font-size:9px; border-radius:8px; height:20px; padding:2px 12px; margin-left:10px'
  button.addEventListener('click', function (event) {
    if (mode) {
      tcid = card.querySelector('.cv-choice').getAttribute('tcid')
    } else {
      tcid = card.getAttribute('id')
      let index = tcid.indexOf('_courseDiv')
      tcid = tcid.substring(0, index)
    }
    courseName.push(tcid)
    courseType.push(sessionStorage.getItem('teachingClassType'))
    className.push(detail)
    // 防止按钮点击事件冒泡
    event.stopPropagation();
    button.disabled = true;
    button.style = 'background-color:#65b3ff; color:white; border:0; font-size:9px; border-radius:8px; height:20px; padding:2px 12px; margin-left:10px'
  });
  if (!mode) {
    let insertPosition = card.querySelector('.cv-operation')
    insertPosition.appendChild(button);
  } else {
    card.appendChild(button)
  }
}


//处理主修推荐课程选课页面
function processCard(type) {
  let parent
  if (type == 1) {
    parent = document.querySelectorAll('#recommendBody .cv-row')
  } else if (type == 2) {
    parent = document.querySelectorAll('#programBody .cv-row')
  } else if (type == 3) {
    parent = document.querySelectorAll('#sportBody .cv-row')
  }
  parent.forEach((element) => {
    element.addEventListener('click', function () {
      //方便起见，直接设置延时等待DOM加载
      setTimeout(() => {
        let card = element.querySelectorAll('.cv-course-card')
        card.forEach((item) => {
          if (!item.classList.contains('added-button')) {
            let detail = element.querySelector('.cv-course').textContent + ' ' + item.querySelector('.cv-info-title').textContent + ' ' + item.querySelector('.tsTag').textContent
            insertButton(item, 0, detail)
            //防止重复添加按钮
            item.classList.add('added-button')
            //添加选课女生人数信息
            let text = item.querySelector('.cv-caption-text')
            text.textContent += ' 女生人数:' + item.getAttribute('numberofFemale')
          }
        })
      }, 100);
    })
  })
}

//处理选修课选课页面
function processPublic() {
  let parent = document.querySelectorAll('#publicBody .cv-row')
  parent.forEach((element) => {
    if (!element.classList.contains('added-button')) {
      let tag = element.querySelector('.cv-setting-col')
      let detail = element.querySelector('.cv-title-col').textContent + ' ' + element.querySelector('.cv-teacher-col').textContent
      insertButton(tag, 1, detail)
      //防止重复添加按钮
      element.classList.add('added-button')
      //添加女生人数信息
      let numberofGirl = document.createElement('div');
      let text = element.querySelector('.cv-firstVolunteer-col')
      numberofGirl.textContent = '女生人数:' + element.querySelector('.cv-choice').getAttribute('numberofFemale')
      text.appendChild(numberofGirl)
    }
  })
}

//页面刷新切换，为了精简代码，没有做进一步的事件绑定，需要在切换页面/筛选课程之后点击页面标题以获得添加抢课的按钮
function init() {
  let recommend = document.querySelector('#aRecommendCourse')
  if(recommend){
    recommend.addEventListener('click', () => processCard(1))
  }

  let program = document.querySelector('#aProgramCourse')
  if(program){
    program.addEventListener('click', () => {
      setTimeout(() => {
        processCard(2)
      }, 100)
    })
  }

  let public0 = document.querySelector('#aPublicCourse')
  if(public0){
    public0.addEventListener('click', () => {
      setTimeout(() => {
        processPublic()
      }, 100)
    })
  }

  let sport = document.querySelector('#aSportCourse')
  if(sport){
    sport.addEventListener('click', () => {
      setTimeout(() => {
        processCard(3)
      }, 100)
    })
  }

  //设置选课图标
  const svgNS = "http://www.w3.org/2000/svg";
  const svgElement = document.createElementNS(svgNS, "svg");
  const svgCode = `
  <svg t="1689910209266" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7899" width="30" height="30">
    <path
      d="M618.464 699.36l-14.272 69.76h191.232c49.952-1.056 58.272-21.568 73.728-72.928l59.008-279.488H469.856L392 826.112c-7.04 46.048 13.696 69.12 62.016 69.12h382.72l89.984-62.112H566.112c-27.2 5.152-36.192-10.88-27.136-41.568l61.632-311.488h174.688l-38.944 187.328c-9.568 26.432-18.88 30.56-48.32 32h-69.568zM387.712 482.176l34.208-7.648 22.176-101.312-34.144 7.648 13.6-98.112h31.68l10.56-73.728H434.08l10.528-49.056H286.464l-10.56 49.056H180.96l-10.592 73.728h94.976l-21.12 147.392-99.744 27.488-22.112 101.312 99.68-26.848-32.48 259.424c-0.288 30.688-12.128 43.52-35.52 38.368H88.096L32.128 895.2h237.28c45.376 5.056 69.632-16.672 72.544-65.312l45.76-347.712z m187.52-322.208l-95.68 224.576H606.08l79.488-150.912h60.256l36.416 150.912h143.52l-53.408-224.576h-297.12z"
      p-id="7900" fill="#ffffff"></path>
  </svg>
  `;
  svgElement.innerHTML = svgCode;
  svgElement.style = 'width:56px; height:40px; padding:5px 13px'
  svgElement.addEventListener('click', () => { confirmAndStart() })
  let side = document.querySelector('.cv-icons')
  side.appendChild(svgElement)
}

//显示选择的抢课信息 点击确认开始抢课 点击取消继续添加选课 刷新页面清除待选课列表
async function confirmAndStart() {
  console.log(className)
  let details = '已选课程:\n'
  className.forEach((item) => {
    details += item + '\n'
  })
  if (details == '已选课程:\n') {
    details = '请添加选课'
  }
  let but = confirm(details);
  if (but) {
    console.log('开始抢课')
    len = courseName.length
    if (len) {
      await select_course(0)
    } else {
      alert('请选课之后再点击确定')
    }

  }
  else {
    console.log('继续选课')
  }
}

(function () {
  'use strict';
  setTimeout(() => {
    init()
    processCard(1)
    alert(`使用须知:\n
    1.本脚本基于存储在电脑本地的cookie和选课系统的API进行开发，不会获取您的任何个人信息，如果介意请勿使用\n
    2.本脚本在兴庆校区已经经过验证，其他校区未经验证是否可行，即使验证可行也不能保证抢课的完全成功，请各位斟酌选择使用\n
    3.考虑到学校选课的时间安排，脚本仅支持推荐课程、方案内跨选课、选修、体育的抢课\n
    4.本脚本按照添加顺序进行抢选，建议先添加优先级较高的课程\n
    5.为了精简代码，需要在进行 上一页/下一页/筛选课程 等操作之后点击页面标题以添加抢课的按钮，后续可能会对这一缺陷作进一步优化\n
    6.为了确保其他同学抢课的顺利进行，抢课的频率为每秒10次，持续时间为5s，请把握好点击开始抢课的时间，抢课结果自动以弹窗形式展示，之后自动清空抢课列表\n
    7.点击侧边栏的“抢”字会返回已经添加到选课列表的课程信息，点击确定开始抢课(参考第6条)，点击取消继续选课\n`)
  }, 1000)
})();