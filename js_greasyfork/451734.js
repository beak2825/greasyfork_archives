// ==UserScript==
// @name         高等继续教育网高等学历继续教育网络学习平台自动刷课刷题
// @namespace    http://greasyfork.org/
// @version      1.7
// @description  【高等继续教育网】【高等学历继续教育网络学习平台】自动刷课刷题，请注意该脚本只适用于该网址：【.jxjypt.cn】
// @author       Roc.w
// @match        http*://*.jxjypt.cn/*
// @icon         https://www.jxjypt.cn/indexpage/images/icon.ico
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/451734/%E9%AB%98%E7%AD%89%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E9%AB%98%E7%AD%89%E5%AD%A6%E5%8E%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%88%B7%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/451734/%E9%AB%98%E7%AD%89%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E9%AB%98%E7%AD%89%E5%AD%A6%E5%8E%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%88%B7%E9%A2%98.meta.js
// ==/UserScript==

console.log('您已进入高等继续教育网')
console.log('欢迎使用树懒脚本! 联系作者:771185858@qq.com')
console.log('采用纯原生JS写法 高性能、高可用、高兼容!')

init()

//初始化元素
function init() {
  //创建按钮元素
  craeateButtonElement();
  //创建消息提示元素
  craeateMsgElement();
  //课程学习监听自动展开
  setCatalogueClickMonitor();
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
    css: "background: rgba(0,0,0,0.6);" +
      "position: fixed;" +
      "inset: 0px;" +
      "margin: auto;" +
      "padding: 10px;" +
      "border-radius: 5px;" +
      "color: #fff;" +
      "font-size: 18px;" +
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
    //自动展开答案
    var zkjxs = document.getElementsByClassName('zkjx')
    for (let i = 0; i < zkjxs.length; i++)
    {
        zkjxs[i].click()
    }
    if(zkjxs.length>1){
        msg('答案解析已展开完毕-------------课程学习、课程作业 代刷微信：wss88886  ￥10元一门课程',6000)
    }else{
        msg('-------------此脚本包含课程学习、课程作业自动展开功能 代刷微信：wss88886  ￥10元一门课程 -------------',6000)
    }
}

//课程学习监听自动展开
function setCatalogueClickMonitor() {
    var courses = document.getElementsByClassName('z-gery-icon');
    if(courses.length==0){
        return;
    }
    let tablecon = document.getElementsByClassName("course")[0];
    tablecon.onclick = function (event) {
        var ele = event.target;
        if(event.target.className=='z-gery-icon z-color z-class-icon'){
           setTimeout(() => {
               msg('------------- 以为您自动展开答案解析 -------------')
               $(ele).parent().parent().parent().parent().find('.zkjx').click()
           }, 1000);
        }
    }
}

