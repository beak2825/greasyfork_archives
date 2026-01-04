// ==UserScript==
// @name         GTLOLI网站小辅助
// @namespace    Sheepherder
// @version      0.1.3
// @description  哥特loli自动签到
// @author       Sheepherder
// @match        https://www.gtloli.gay/*
// @include      https://www.gtloli.gay/*
// @icon         https://q1.qlogo.cn/g?b=qq&nk=862223989&s=140
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_deleteValue
// @grant        GM_unregisterMenuCommand
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/438968/GTLOLI%E7%BD%91%E7%AB%99%E5%B0%8F%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/438968/GTLOLI%E7%BD%91%E7%AB%99%E5%B0%8F%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (document.querySelector('.logout')) {
    const formhash = document.querySelector('.logout').href.split('&')[2].split('=')[1];
    if (formhash != GM_getValue('formhash')) {
      GM_setValue('formhash', formhash); //用GM_setValue当全局变量
    }
    const day = new Date().getDay();
    if (day != GM_getValue('day')) {
      GM_setValue('day', day); //用GM_setValue当全局变量
      signIn();
      showPage();
    }
    else{
      console.log("今天已经完成了VIP任务");
      console.log("今天已经访问了10个人了");
    }
    console.log(formhash);
    addBtns();
  }
})();

// 添加GUI
function addBtns() {
  // 生产消息盒子
  function genDiv() {
    let b = document.createElement('div'); //创建类型为div的DOM对象
    b.style.cssText = 'left: 30%; top: 0%;width:200px;float:left;position:absolute;border-radius: 10px';
    b.id = 'messageBox';
    return b; //返回修改好的DOM对象
  };
  document.querySelector('body').appendChild(genDiv()); // 消息盒子添加到body

  // 在签到页面激活 定时签到
  if (location.href.match(`id=k_misign:sign`)) {
    const qdleft = document.querySelector('.qdleft');
    const mnoutbox = document.querySelectorAll('.mnoutbox');
    let btn = genButton('定时签到', timeControl); //设置名称和绑定函数
    qdleft.insertBefore(btn, mnoutbox[1]); //添加按钮到指定位置
    const button = getbutton();
    const video = genVideo();
    qdleft.insertBefore(video, mnoutbox[1]); //添加视频到指定位置
    //console.log(button);
    timeControl();
  }
  // 在打boss页面激活
  if (location.href.match(`id=zgxsh_assassin:boss`)) {
    const xs0 = document.querySelector('.xs0');
    const mnoutbox = document.querySelectorAll('.mnoutbox');
    let btn0 = genButton('立即加入', addIn); //设置名称和绑定函数
    xs0.insertBefore(btn0, mnoutbox[1]); //添加按钮到指定位置
    let btn = genButton('开始刷BOSS', addin); //设置名称和绑定函数
    xs0.insertBefore(btn, mnoutbox[2]); //添加按钮到指定位置
    const video = genVideo();
    xs0.insertBefore(video, mnoutbox[1]); //添加视频到指定位置
    //console.log(video);
    addin();
  }
  // 在地图页面激活自动刺杀
  if (location.href.match(`id=zgxsh_assassin:map`)) {
    const debuginfo = document.querySelector("#debuginfo");
    const mnoutbox = document.querySelectorAll('.mnoutbox');
    let btn0 = genButton('立即开始刺杀', fuck); //设置名称和绑定函数
    debuginfo.insertBefore(btn0, mnoutbox[1]); //添加按钮到指定位置
    let btn1 = genButton('开始刷经验', nice); //设置名称和绑定函数
    debuginfo.insertBefore(btn1, mnoutbox[2]); //添加按钮到指定位置
    let btn2 = genButton('升级', up); //设置名称和绑定函数
    debuginfo.insertBefore(btn2, mnoutbox[3]); //添加按钮到指定位置
    let btn3 = genButton('加蓝', addnan); //设置名称和绑定函数
    debuginfo.insertBefore(btn3, mnoutbox[4]); //添加按钮到指定位置
    //let btn4 = genButton('自动加点', jiadian); //设置名称和绑定函数
    //debuginfo.insertBefore(btn4, mnoutbox[5]); //添加按钮到指定位置
    const video = genVideo();
    debuginfo.insertBefore(video, mnoutbox[1]); //添加视频到指定位置
    //console.log(video);
    //fuck();
  }
  //制造页面
  if (location.href.match(`id=zgxsh_assassin:forg`)) {
    const debuginfo = document.querySelector("#debuginfo");
    const mnoutbox = document.querySelectorAll('.mnoutbox');
    let btn0 = genButton('白色液体', addcailiao); //设置名称和绑定函数
    debuginfo.insertBefore(btn0, mnoutbox[1]); //添加按钮到指定位置
    let btn1 = genButton('生命药水', xue); //设置名称和绑定函数
    debuginfo.insertBefore(btn1, mnoutbox[2]); //添加按钮到指定位置
    //const video = genVideo();
    //debuginfo.insertBefore(video, mnoutbox[1]); //添加视频到指定位置
    //console.log(video);
    //fuck();
  }
  function genButton(text, foo, id) {
    let b = document.createElement('button'); //创建类型为button的DOM对象
    b.textContent = text; //修改内部文本为text
    b.style.cssText = 'margin: 0px 15px 10px 60px; float: middle;' //添加样式（margin可以让元素间隔开一定距离）
    b.addEventListener('click', foo); //绑定click的事件的监听器
    if (id) {
      b.id = id;
    } //如果传入了id，就修改DOM对象的id
    return b; //返回修改好的DOM对象
  }
};

//强制上传签到信息
function getbutton() {
  let button = document.createElement('button');
  button.style.cssText = 'display: none; z-index: -900;width:0;height:0;';
  button.id = "button1";
  button.href = "plugin.php?id=k_misign:sign&operation=qiandao&formhash="+GM_getValue('formhash')+"&format=empty";
  button.onclick="ajaxget(this.href, this.id, '', '', '', 'window.location.reload();');return false;";
  button.class="btn J_chkitot";
  return button;
}

//防止休眠，播放视频
function genVideo() {
  let video = document.createElement('video');
  video.style.cssText = 'display: none; z-index: -1000;width:0;height:0;'
  video.id = 'video1';
  video.loop = 'true';
  video.autoplay = 'true';
  let source = document.createElement('source');
  source.src = 'https://raw.githubusercontent.com/Eished/jkforum_helper/main/video/light.mp4';
  source.type = "video/mp4"
  video.append(source);
  return video;
}


// 消息通知弹窗
function messageBox(text, setTime) {
  function genBox(text, id) {
    let b = document.createElement('div'); //创建类型为button的DOM对象
    b.textContent = text; //修改内部文本为text
    b.style.cssText = 'width:100%;background-color:#64ce83;float:left;padding:5px 10px;margin-top:5px;border-radius:10px;color:#fff;' //添加样式（margin可以让元素间隔开一定距离）
    // b.addEventListener('click', foo); //绑定click的事件的监听器
    if (id) {
      b.id = id;
    } //如果传入了id，就修改DOM对象的id
    return b; //返回修改好的DOM对象
  };
  // 生成时间 id
  const date = new Date();
  const timeId = 'a' + date.getTime();
  // 初始化消息盒子
  let textBox = genBox(text, timeId);
  let messageBox = document.querySelector('#messageBox');
  // 显示消息
  messageBox.appendChild(textBox);
  // 默认5秒删掉消息，可设置时间，none一直显示
  if (setTime && !isNaN(setTime)) {
    setTimeout(() => {
      messageBox.removeChild(document.getElementById(timeId));
    }, setTime);
  } else if (setTime == 'none') {} else {
    setTimeout(() => {
      messageBox.removeChild(document.getElementById(timeId));
    }, 5000);
  }
}

// 编码统一资源定位符模块
function turnUrl(data, type) {
  if (type) {
    return decodeURI(data);
  } else {
    return encodeURI(data);
  }
}

//签到指令
function sign() {
  let pMessage = 'plugin.php?id=k_misign:sign&operation=qiandao&formhash=' + GM_getValue('formhash') + '&format=empty'; //post 报文
  let url = 'https://www.gtloli.gay/plugin.php?id=k_misign:sign'; //请求链接
  // 直接post签到数据
  postData(url, pMessage, 'sign');
}

//立即加入
function addIn() {
  let pMessage = "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:boss_if&op=boss_add&formhash="+GM_getValue('formhash'); //post 报文
  let url = 'https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:boss'; //请求链接
  postData(url, pMessage, 'addin');
}

//检查是否满血
function addin() {
  //document.querySelector('#video1').play(); // 播放视频，防止休眠
  //if (!document.querySelector('#video1').paused) {
    //const date = new Date()
    //const holdTime = date.getTime();
    // 1000*60*60*24
    //const signTime = ((1000 * 60 * 60) - holdTime % (1000 * 60 * 60)); //通知持续时间，1小时-已运行分钟
    //messageBox('防止休眠启动，请保持本页处于激活状态，勿最小化本窗口以及全屏运行其它应用！', signTime);
    //messageBox('定时刷BOSS中，请勿退出...', signTime);
  //} else {
    //console.log(document.querySelector('#video1'));
  //}
  let temp = document.querySelector('.layui-progress.layui-progress-big>p');
  let temp0=temp.textContent.split(" ")[1].split("/")[0];
  let temp1=temp.textContent.split(" ")[1].split("/")[1];
  if(temp0==temp1){
    //console.log(temp);
    let pMessage = "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:boss_if&op=boss_add&formhash="+GM_getValue('formhash'); //post 报文
    let url = 'https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:boss'; //请求链接
    postData(url, pMessage, 'addin');
  }
}

// 定时签到
function timeControl() {
  const _this = this; //获取对象
  clearInterval(_this.timer); //清除重复定时器
  document.querySelector('#video1').play(); // 播放视频，防止休眠
  if (!document.querySelector('#video1').paused) {
    const date = new Date()
    const holdTime = date.getTime();
    // 1000*60*60*24
    const signTime = ((1000 * 60 * 60) - holdTime % (1000 * 60 * 60)); //通知持续时间，1小时-已运行分钟
    messageBox('防止休眠启动，请保持本页处于激活状态，勿最小化本窗口以及全屏运行其它应用！', signTime);
    messageBox('定时签到中，请勿退出...', signTime);
  } else {
    console.log(document.querySelector('#video1'));
  }
  let hours, minutes, seconds;
  const h = 23,
    m = 59,
    s = 59;

  function nowTime() {
    hours = new Date().getHours();
    minutes = new Date().getMinutes();
    seconds = new Date().getSeconds();
  }

  function control() {
    if (hours == h && minutes == m && seconds == s) {
      clearInterval(_this.timer);
      messageBox('执行中....');
      setTimeout(() => {
        for(let i = 0;i < 50;i++){
          sign();
          messageBox('执行第' + (i + 2) + '次');
          console.log('执行第' + (i + 2) + '次');
        }
      }, 999) //延时触发
    } else {
      console.log('时间没有到：', h, m, s, '目前时间：', hours, minutes, seconds);
    }
  }

  function check() {
    nowTime();
    control();
  }
  _this.timer = setInterval(check, 20);
}


//指令集合
function postData(replyUrl, replyData, fromId, contentType) {
  // 传输数据类型判断,默认 'application/x-www-form-urlencoded'
  if (contentType) {} else {
    contentType = 'application/x-www-form-urlencoded';
  }
  const httpRequest = new XMLHttpRequest();
  httpRequest.open('POST', replyUrl, true); //同步写法会时区响应
  httpRequest.setRequestHeader('content-Type', contentType);
  httpRequest.send(replyData); // post数据
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
      const stringOrHtml = turnCdata(httpRequest.responseURL); // 提取Cdata返回html或字符串
      switch (fromId) {
        case 'sign': {
          if (checkHtml(stringOrHtml)) { // 确认html
            let button=document.getElementById('JD_sign');
            //console.log(button);
            //button.click();
            console.log(button);
            const info = stringOrHtml.querySelector('.c').innerHTML.split('<')[0]; // 解析html，返回字符串
            messageBox(info, 10000);
          } else {
            messageBox(stringOrHtml); //其它情况直接输出
          }
          break;
        }
        case 'addin': {
          //let button = document.querySelectorAll('.layui-inline.layui-elip.b_user>div')[18];
          //console.log(button);
          //button.click();
          //console.log(button);
          const http = new XMLHttpRequest();
          http.open('GET', replyData);
          http.send();
          //console.log("可以运行到这");
          messageBox("成功加入", 10000);
          break;
        }
        default: {
          messageBox(stringOrHtml); //其它情况直接输出
          break;
        }
      }
    };
  };
};

// 过滤html标签、前后空格、特殊符号
function replaceHtml(txt) {
  const reg3 = /[\\|\/|\:|\*|\r|\n|\b|\f|\t|\v|\`]+/g; //去掉特殊符号
  const reg2 = /^(\s+)|(\s+)$/g; //去掉前后空格
  const reg = /<.+>/g; //去掉所有<>内内容
  // 先reg3,\n特殊符号会影响reg的匹配
  return txt.replace(reg3, '').replace(reg, '').replace(reg2, '');
}

// 判断html字符串是不是html
function checkHtml(htmlStr) {
  if (htmlStr.nodeName) {
    return true;
  } else {
    let reg = /<[^>]+>/g;
    return reg.test(htmlStr);
  }
}

//判断操作
function turnCdata(xmlRepo) {
  let data = xmlRepo
  if (replaceHtml(data)) {
    // 去掉html内容，返回文字
    return replaceHtml(data);
  } else {
    // 数据类型转换成 html
    let htmlData = document.createElement('div');
    htmlData.innerHTML = data;
    return htmlData;
  }
}

//每天一次VIP任务
function signIn() {
  const pc = {
    id: 'pc',
    name: '胖次',
    applyUrl: 'https://www.gtloli.gay/home.php?mod=task&do=apply&id=32',
    drawUrl: 'https://www.gtloli.gay/home.php?mod=task&do=draw&id=32',
  };
  const gtb = {
    id: 'gtb',
    name: 'GT币',
    applyUrl: 'https://www.gtloli.gay/home.php?mod=task&do=apply&id=33',
    drawUrl: 'https://www.gtloli.gay/home.php?mod=task&do=draw&id=33',
  };
  const pcLocal = localStorage.getItem('pc');
  if (!pcLocal) get(pc);
  const gtbLocal = localStorage.getItem('gtb');
  if (!gtbLocal) get(gtb);
}

function get(data) {
  const http = new XMLHttpRequest();
  http.open('GET', data.applyUrl);
  http.send();
  http.onreadystatechange = (e) => {
    if (e.target.status === 200) {
      http.open('GET', data.drawUrl);
      http.send();
      http.onreadystatechange = (event) => {
        if (event.target.status === 200) {
          localStorage.setItem(data.id, 'true');
          console.log(data.name + '领取成功!');
          http.open('GET', 'https://www.gtloli.gay/home.php?mod=space&do=notice&view=system');
          http.send();
        }
      };
    }
  };
}

//低保，访问10人空间
function showPage() {
  const users = [
    'https://www.gtloli.gay/home.php?mod=space&uid=1',
    'https://www.gtloli.gay/home.php?mod=space&uid=687195',
    'https://www.gtloli.gay/home.php?mod=space&uid=250669',
    'https://www.gtloli.gay/home.php?mod=space&uid=455571',
    'https://www.gtloli.gay/home.php?mod=space&uid=596234',
    'https://www.gtloli.gay/home.php?mod=space&uid=828725',
    'https://www.gtloli.gay/home.php?mod=space&uid=831814',
    'https://www.gtloli.gay/home.php?mod=space&uid=911716',
    'https://www.gtloli.gay/home.php?mod=space&uid=644482',
    'https://www.gtloli.gay/home.php?mod=space&uid=911905',
    'https://www.gtloli.gay/home.php?mod=space&uid=936765',
  ];
  users.forEach((v, i) => {
    const http = new XMLHttpRequest();
    http.open('GET', v);
    http.send();
    if (i === users.length - 1) {
      localStorage.setItem('ten', 'true');
      console.log('已查看10人主页!');
    }
  });
};

//有傻逼，玛德
function fuck() {
  const http = new XMLHttpRequest();
  http.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:index_if&op=pvp_kill&bh=893700&map=1&formhash="+GM_getValue('formhash'));
  http.send();
  http.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:index_if&op=pvp_kill&bh=871398&map=1&formhash="+GM_getValue('formhash'));
  http.send();
  http.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:index_if&op=pvp_kill&bh=958684&map=1&formhash="+GM_getValue('formhash'));
  http.send();
  http.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:index_if&op=pvp_kill&bh=958671&map=1&formhash="+GM_getValue('formhash'));
  http.send();
  http.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:index_if&op=pvp_kill&bh=958529&map=1&formhash="+GM_getValue('formhash'));
  http.send();
  http.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:index_if&op=pvp_kill&bh=958567&map=1&formhash="+GM_getValue('formhash'));
  http.send();
  http.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:index_if&op=pvp_kill&bh=893609&map=1&formhash="+GM_getValue('formhash'));
  http.send();
  console.log("刺杀完成");
};

//谢谢，伞兵
function nice() {
  const _this = this; //获取对象
  clearInterval(_this.timer); //清除重复定时器
  const http17 = new XMLHttpRequest();
  http17.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:index_if&op=plot_add&bh=18&formhash="+GM_getValue('formhash'));
  http17.send();
  const http18 = new XMLHttpRequest();
  http18.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:index_if&op=plot_add&bh=19&formhash="+GM_getValue('formhash'));
  http18.send();
  console.log("经验刷取完毕完成");
  _this.timer = setInterval(nice, 1000);
};
function up() {
  const _this = this; //获取对象
  clearInterval(_this.timer); //清除重复定时器
  const http = new XMLHttpRequest();
  http.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:index_if&op=user_up&formhash="+GM_getValue('formhash'));
  http.send();
  console.log("升级完毕完成");
  _this.timer = setInterval(up, 1000);
};
function addnan() {
  const http = new XMLHttpRequest();
  http.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:index_if&op=item_use&bh=3209&formhash="+GM_getValue('formhash'));
  http.send();
};
//药剂材料
function addcailiao() {
  const http1 = new XMLHttpRequest();//死亡草
  http1.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=6&pro=20&ches=7&formhash="+GM_getValue('formhash'));
  http1.send();
  console.log("刷取死亡草");
  const http2 = new XMLHttpRequest();//寒颤棘
  http2.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=12&pro=14&ches=20&formhash="+GM_getValue('formhash'));
  http2.send();
  console.log("刷取寒颤棘");
  const http3 = new XMLHttpRequest();//夜蘑菇
  http3.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=15&pro=13&ches=40&formhash="+GM_getValue('formhash'));
  http3.send();
  console.log("刷取夜蘑菇");
  const http4 = new XMLHttpRequest();//闪耀根
  http4.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=6&pro=7&ches=6&formhash="+GM_getValue('formhash'));
  http4.send();
  console.log("刷取闪耀根");
  const http5 = new XMLHttpRequest();//火焰花
  http5.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=9&pro=16&ches=10&formhash="+GM_getValue('formhash'));
  http5.send();
  console.log("刷取火焰花");
  const http6 = new XMLHttpRequest();//兜菊花
  http6.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=9&pro=16&ches=9&formhash="+GM_getValue('formhash'));
  http6.send();
  console.log("刷取兜菊花");
  const http7 = new XMLHttpRequest();//太阳花
  http7.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=2&pro=11&ches=2&formhash="+GM_getValue('formhash'));
  http7.send();
  console.log("刷取太阳花");
  const http8 = new XMLHttpRequest();//月亮草
  http8.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=3&pro=16&ches=3&formhash="+GM_getValue('formhash'));
  http8.send();
  console.log("刷取月亮草");
};
function xue() {
  const http7 = new XMLHttpRequest();//太阳花
  http7.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=2&pro=11&ches=2&formhash="+GM_getValue('formhash'));
  http7.send();
  console.log("刷取太阳花");
  const http8 = new XMLHttpRequest();//月亮草
  http8.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=3&pro=16&ches=3&formhash="+GM_getValue('formhash'));
  http8.send();
  console.log("刷取月亮草");
};