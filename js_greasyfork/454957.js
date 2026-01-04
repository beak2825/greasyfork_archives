// ==UserScript==
// @name         摸鱼影视
// @namespace    http://greasyfork.org/
// @version      1.2
// @description  摸鱼影视，目前已加入平台CSDN、掘金，摸鱼行动请量力而行！自动解析全网VIP影视（腾讯视频、爱奇艺、优酷、哔哩哔哩等）
// @author       Roc.w
// @match        http*://*.csdn.net/*
// @match        http*://*.juejin.cn/*
// @icon         https://v.qq.com/favicon.ico
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/454957/%E6%91%B8%E9%B1%BC%E5%BD%B1%E8%A7%86.user.js
// @updateURL https://update.greasyfork.org/scripts/454957/%E6%91%B8%E9%B1%BC%E5%BD%B1%E8%A7%86.meta.js
// ==/UserScript==

console.log('欢迎使用树懒脚本! 联系作者:771185858@qq.com')
console.log('采用纯原生JS写法 高性能、高可用、高兼容!')

init()

/*************************一条华丽的分割线 基层代码块*****************************/

//初始化元素
function init() {
  //创建按钮元素
  craeateButtonElement()
  //创建消息提示元素
  craeateMsgElement()
  //创建搜索元素
  craeateSearchElement()
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

//创建搜索元素
function craeateSearchElement() {
  let searchParam = {
    ele: document.createElement('div'),
    boxcss: "background: #888;" +
      "position: fixed;" +
      "inset: -50% 0px 0px 0px;" +
      "margin: auto;" +
      "width: 500px;" +
      "height: 50px;" +
      "border-radius: 10px;" +
      "display: none;" +
      "padding-left: 7px;" +
      "z-index: 999;",
    inputcss: "margin: auto;" +
      "flex: 0.75;" +
      "height: 35px;" +
      "margin: auto;" +
      "border: 0;" +
      "border-radius: 10px 0 0 10px;" +
      "padding: 4px;" +
      "outline: none;" +
      "font-size: 20px;",
    btncss: "flex: 0.25;" +
      "margin: auto;" +
      "height: 50px;" +
      "background: #4e6ef2;" +
      "text-align: center;" +
      "line-height: 50px;" +
      "cursor: pointer;" +
      "color: #fff;" +
      "border-radius: 0 10px 10px 0;"
  };
  document.querySelector('body').appendChild(((ele) => {
    ele.id = 'sloth-search-box';
    ele.innerHTML = '<input id="sloth-search-input" style="' + searchParam.inputcss + '"><div  id="sloth-search-btn" style="' + searchParam.btncss + '">解析一下</div>';
    ele.style.cssText = searchParam.boxcss;
    return ele;
  })(searchParam.ele));

  //按钮点击操作
  document.getElementById("sloth-search-btn").addEventListener("click", function () {
    search();
  });
}

//HTTP请求
function request(url, param, callback, type = 'GET') {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        callback && callback(xhr.responseText);
      }
    }
  }
  xhr.open(type, url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  xhr.send(param);
}

/*************************一条华丽的分割线 业务代码块*****************************/

//点击开始按钮
function start() {
  var txt = document.getElementById('sloth-search-box').style.display;
  if (txt == 'none') {
    document.getElementById('sloth-search-box').style.display = 'flex';
    readTextAutomaticParsing();
  } else {
    document.getElementById('sloth-search-box').style.display = 'none'
    document.getElementById('sloth-search-input').value = '';
  }
}

// 读取剪切板自动解析
function readTextAutomaticParsing () {
  const inp = document.getElementById('sloth-search-input');
  const clipboard = navigator.clipboard;
  clipboard.readText().then(str => {
    const videoHttpUrl = ['v.qq.com','youku.com','bilibili.com','iqiyi.com'];
    for (let i = 0; i < videoHttpUrl.length; i++) {
      if (str.indexOf(i) != '-1') {
        inp.value = str;
        return msg('已自动为您粘贴视频链接');
      }
    }
  });
}

//解析一下，并植入CSDN和掘金
function search() {
  var url = document.getElementById('sloth-search-input').value
  if (url == '') {
    return msg('请输入解析地址');
  }
  //防止重复iframe
  var exIndex = 0;
  var ifm = document.getElementById('sloth-iframe');
  if (ifm != null) {
    ifm.remove();
    exIndex++;
  }
  //平台判断
  if (location.origin.indexOf('csdn.net') != '-1') {
    csdn(url,exIndex==0);
  }
  else if (location.origin.indexOf('juejin.cn') != '-1') {
    juejin(url);
  }
  //隐藏并清空地址
  document.getElementById('sloth-search-box').style.display = 'none'
  document.getElementById('sloth-search-input').value = '';
}

//CSDN iframe植入
function csdn(url,isFirst){
  //植入iframe
  let iframeParam = {
    ele: document.createElement('iframe'),
    css: "width: 100%;" +
         "height: 350px;"
  };
  //要植入的位置元素
  var ele = null;
  //检测当前页面是否有代码块
  var codes = document.getElementsByTagName('pre').length;
  if (codes == 0) {
    ele = document.getElementById('asideHotArticle');
    iframeParam.css = "width: 100%;height: 170px;"
  } else {
    ele = document.getElementsByTagName('pre')[0];
  }
  if (!ele) {
    return msg('当前位置不支持摸鱼,请先打开一篇文章!');
  }
  ele.prepend(((ele) => {
    ele.id = 'sloth-iframe';
    ele.innerHTML = '';
    ele.frameborder = '0';
    ele.scrolling = 'no'
    ele.src = 'https://jx.jsonplayer.com/player/?url=' + url
    ele.style.cssText = iframeParam.css;
    return ele;
  })(iframeParam.ele));
  //追加代码行号
  if (isFirst) {
    var children = document.getElementsByTagName('pre')[0].children
    for (let i = 0; i < children.length; i++) {
      if (children[i].className.search('pre-numbering') > -1) {
        var len = children[i].children.length;
        for (let j = 0; j < 16; j++) {
          len++;
          $(children[i]).eq($(children[i]).length - 1).append('<li style="color: rgb(153, 153, 153);">' + len + '</li>')
        }
      }
    }
  }
}

//掘金 iframe植入
function juejin(url) {
  let iframeParam = {
    ele: document.createElement('iframe'),
    css: "width: 100%;" +
      "height: 350px;"
  };
  const ele = document.getElementsByTagName('article')[0];
  if (!ele) {
    return msg('当前位置不支持摸鱼,请先打开一篇文章!');
  }
  const author = document.getElementsByClassName('author-info-block')[0];
  iframeParam.ele.id = 'sloth-iframe';
  iframeParam.ele.innerHTML = '';
  iframeParam.ele.frameborder = '0';
  iframeParam.ele.scrolling = 'no'
  iframeParam.ele.src = 'https://jx.jsonplayer.com/player/?url=' + url
  iframeParam.ele.style.cssText = iframeParam.css;
  ele.insertBefore(iframeParam.ele, author.nextElementSibling);
}
