// ==UserScript==
// @name         优苗健康抢苗助手
// @namespace    http://greasyfork.org/
// @version      1.0
// @description  【优苗健康】【抢苗助手】【预约九价】
// @author       Roc.w
// @match        http*://*.wjw.gz.gov.cn/*
// @icon         https://www.jxjypt.cn/indexpage/images/icon.ico
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/460828/%E4%BC%98%E8%8B%97%E5%81%A5%E5%BA%B7%E6%8A%A2%E8%8B%97%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/460828/%E4%BC%98%E8%8B%97%E5%81%A5%E5%BA%B7%E6%8A%A2%E8%8B%97%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

init()

//是否运行中
var operation = 1

//初始化元素
function init() {
  //创建按钮元素
  craeateButtonElement("开")
  //创建消息提示元素
  craeateMsgElement();
  dateChoice();
  startChoiceInstitution();
}

//创建按钮元素
function craeateButtonElement(str) {
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
    // 添加允许拖拽属性🎶🦥
    ele.setAttribute('draggable',true)
    ele.innerHTML = '<div id="btn-start" style="' + btnParam.iconcss + '">'+str+'🦥</div>';
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
    css: "background: rgba(0,0,0,0.6);" +
      "position: fixed;" +
      "inset: 0px;" +
      "margin: auto;" +
      "padding: 10px;" +
      "border-radius: 5px;" +
      "color: #fff;" +
      "font-size: 16px;" +
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

//点击开始按钮
function start() {
    if(localStorage.getItem("is-start")==1&&operation==1){
        operation = 0;
        document.getElementById('btn-start').innerHTML = '关🦥'
    }else{
        operation = 1;
        document.getElementById('btn-start').innerHTML = '开🦥'
        dateChoice();
        startChoiceInstitution();
    }
}

//抢购选择页面
function dateChoice(){
    let curHref = window.location.href;
    //列表选择页面
    if(curHref.indexOf('DateChoice.html')!=-1){
        setTimeout(() => {
            startDateChoice();
        },1000)
    }
}

//抢购选择页面
function startDateChoice(){
    if(localStorage.getItem("is-start")==1&&operation==1){
        let td = $('td');
        for (let i = 0; i < td.length; i++) {
            if($('td')[i].className.indexOf('green')!=-1){
                //通知所有正在运行的列表
                localStorage.setItem("is-start",0)
                //点击选择日期
                td[i].click();
                //选择上下午
                let nav = $('nav').children();
                for (let j = 0; j <  nav.length; j++) {
                    nav[j].click();
                    let tabContent = $('#tabContent'+(j+1)).children()
                    for (let k = 0; k < tabContent.length; k++) {
                        let txt = $(tabContent[k]).find('b').html();
                        if(txt!='无号' && txt!='满号'){
                            $(tabContent[k]).find('b').click();
                            //点击确定预约
                            $('#submit').click();
                            break;
                        }
                    }
                }
            }
        }
        msg('来晚了 已经抢完了，等待刷新！')
        if(localStorage.getItem("is-start")==1){
            setTimeout(() => {
                if(operation==1){
                   location.reload();
                }
            },1000)
        }
    }
}

//接种点医院门诊列表页面
function startChoiceInstitution(){
    let curHref = window.location.href;
    //列表选择页面
    if(curHref.indexOf('choiceInstitution.html')!=-1){
        setTimeout(() => {
            choiceInstitution();
        },1000)
    }
}

//接种点医院门诊列表页面
async function choiceInstitution() {
    if(localStorage.getItem("is-start")==1&&operation==1){
        var li = $('li');
        for (let i = 0; i < li.length; i++) {
            if(localStorage.getItem("is-start")==1&&operation==1){
                let data = JSON.parse(li[i].getAttribute('data-obj'))
                await dataDetection(data)
            }
        }
        if(localStorage.getItem("is-start")==0||operation==0){
            msg('抢购已关闭')
        }else{
            msg('本次抢购结束，等待刷新',3000)
            setTimeout(() => {
               if(operation==1){
                  location.reload();
               }
            },3000)
        }
    }
}

//数据检测
async function dataDetection(data) {
    return new Promise(async (resolve, reject) => {
        if(data.Remain>0){
            msg('检测到 '+data.Name+' 剩余：'+ data.Remain,1000)
            //let num = Math.floor(Math.random() * (4)) + 3;
            if(localStorage.getItem("is-start")==0){
                resolve();
            }else{
                localStorage.setItem("institution",JSON.stringify(data));
                await sleep(8000)
                resolve();
            }
        }else{
            resolve();
        }
    })
}

//休眠
 function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    })
}







