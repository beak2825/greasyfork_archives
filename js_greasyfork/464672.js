// ==UserScript==
// @name         澳谷掌上学堂自动刷课
// @namespace    http://greasyfork.org/
// @version      1.1
// @description  自动刷课赚积分《阿道夫》《澳谷企业集团》
// @author       Roc.w
// @match        http*://*.ishangstudy.com/*
// @icon         https://oms-mini.adolph.cn/favicon.ico
// @license      AGPL License
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/464672/%E6%BE%B3%E8%B0%B7%E6%8E%8C%E4%B8%8A%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/464672/%E6%BE%B3%E8%B0%B7%E6%8E%8C%E4%B8%8A%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

init()

//初始化元素
function init() {
  //创建按钮元素
  craeateButtonElement()
  //创建消息提示元素
  craeateMsgElement()
    //位置判定
  positionIf();
}


//创建按钮元素
function craeateButtonElement() {
  let btnParam = {
    ele: document.createElement('div'),
    css: "display: flex;" +
      "cursor: pointer;" +
      "position: fixed;" +
      "right:40px;" +
      "top: 100px;" +
      "background: #aaa;" +
      "width: 50px;" +
      "height: 50px;" +
      "z-index:1000;" +
      "border-radius: 100%;",
    iconcss: "margin: auto;" +
      "width: 35px;" +
      "height: 35px;" +
      "line-height: 35px;" +
      "background: #fff;" +
      "animation:kite 5s infinite;" +
      "text-align: center;" +
      "font-size: 22px;" +
      "border-radius: 100%;"
  };

  document.querySelector('body').appendChild(((ele) => {
    ele.id = 'sloth-topic';
    // 添加允许拖拽属性
    ele.setAttribute('draggable',true)
    ele.innerHTML = '<div style="' + btnParam.iconcss + '">🎶🦥</div>';
    ele.style.cssText = btnParam.css;
    return ele;
  })(btnParam.ele));

  //动态创建keyframes动画
  //document.styleSheets[0].insertRule(`@keyframes kite{100%{transform:rotate(360deg);}}`,0)
  const style = document.createElement('style')
  style.appendChild(document.createTextNode(`@keyframes kite{100%{transform:rotate(360deg);}}`));
  document.getElementById('sloth-topic').appendChild(style);
  // 拖拽事件
  document.getElementById('sloth-topic').addEventListener('dragend', function(e) {
    e.stopPropagation()
    const btn = document.getElementById('sloth-topic');
    if (e.target.style['right'] > 0) e.target.style['right'] = 0
    btn.style.cssText += btnParam.css + `left:${e.clientX}px;top:${e.clientY}px;`;
  });
  //按钮点击操作
  document.getElementById("sloth-topic").addEventListener("click", function () {
    start();
  });
}

//创建消息元素
function craeateMsgElement() {
  let msgParam = {
    ele: document.createElement('div'),
    css: "background: rgba(0,0,0,0.5);" +
      "position: fixed;" +
      "inset: 0px;" +
      "margin: auto;" +
      "padding: 10px;" +
      "border-radius: 5px;" +
      "color: #fff;" +
      "font-size: 14px;" +
      "letter-spacing: 1.5px;" +
      "display: none;" +
      "z-index: 99999;"
  };
  document.querySelector('body').appendChild(((ele) => {
    ele.id = 'sloth-msg';
    ele.innerHTML = '';
    ele.style.cssText = msgParam.css;
    return ele;
  })(msgParam.ele));
}

//消息提示
function msg(msg, timeout = 2500) {
  document.getElementById('sloth-msg').style.display = 'inline-table';
  document.getElementById('sloth-msg').innerHTML = msg;
  setTimeout(() => {
    document.getElementById('sloth-msg').style.display = 'none';
  }, timeout);
}

/*************************一条华丽的分割线 业务代码块*****************************/

//位置判定
function positionIf(){
    var position = window.location.href;
    //课程包详情页
    if (position.indexOf('/member/pkglearn/detail')>-1) {
        console.log('当前位置：课程包详情页');
    }
    //课程详情页
    else if (position.indexOf('/member/zxcourse/detail')>-1) {
        console.log('当前位置：课程详情页');
        setTimeout(() => {
            console.log('保存课程记录');
            courseFinish().then(function() {
                 console.log('准备完成课程');
                 courseFinish().then(function(){
                     console.log('开始返航');
                     window.close()
                 });
             })
        }, 500);
    }
}


//点击开始按钮
function start() {
    msg('学习开始');
    courseList();
}

//课程完成
function courseFinish() {
    let promise = new Promise(function(resolve, reject){
         var courseid = $("#courseid").val();
         var gamelearnid = $("#gamelearnid").val();
         var pkglearnid = $("#pkglearnid").val();
         var offtcid = $("#offtcid").val();
         var current_time = $("#current_time").val();
         var video_duration = $("#video_duration").val();
         var startmarking = $("#start_stay_time").val();
         let fd = new FormData();
         fd.append("courseid",courseid);
         fd.append("gamelearnid",gamelearnid);
         fd.append("pkglearnid",pkglearnid);
         fd.append("offtcid",offtcid);
         fd.append("current_time",startmarking);
         fd.append("video_duration",video_duration);
         fd.append("startmarking",startmarking);

         console.log('courseid:',courseid);
         console.log('gamelearnid:',gamelearnid);
         console.log('pkglearnid:',pkglearnid);

         //savereadingtime.html
         GM.xmlHttpRequest({
             method: 'POST',
             data:fd,
             headers:{ 'X-Requested-With':'XMLHttpRequest' },
             url: 'https://www.ishangstudy.com/member/zxcourse/finish_course_item.html',
             onload: response => {
                 var result = response;
                 console.log("响应信息：",result);
                 resolve(result)
             }
         });
    })
    return promise;
}

//课程包列表
async function courseList(){
    var courses = $('.courseitem');
    for (let i = 0; i < courses.length; i++) {
        await (function(){
            let name = $(courses[i]).find('.sectioninfo')[0].className;
            if (name.indexOf('havepass')==-1) {
                return new Promise((resolve, reject) => {
                    setTimeout(()=>{
                        let tit = $(courses[i]).find('.sectioninfo')[0].innerText
                        console.log('正在进行 第'+(i+1)+"项",tit)
                        let href = $(courses[i]).find('a')[0].href
                        $($(courses[i]).find('.sectioninfo')[0]).addClass("havepass")
                        resolve('打开新窗口进行完成作业')
                        window.open(href);
                    },500)
                })
            }
        }())
    }
}

