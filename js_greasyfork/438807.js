// ==UserScript==
// @name         我为CC续一秒-GTLOLI网站兄弟会小辅助
// @namespace    Sheepherder
// @version      1.0.0
// @description  哥特loli兄弟会小辅助。啊CC，在此为你续上1秒!（判定成功CC+1S）
// @author       Sheepherder
// @match        https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:*
// @include      https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:*
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
// @downloadURL https://update.greasyfork.org/scripts/438807/%E6%88%91%E4%B8%BACC%E7%BB%AD%E4%B8%80%E7%A7%92-GTLOLI%E7%BD%91%E7%AB%99%E5%85%84%E5%BC%9F%E4%BC%9A%E5%B0%8F%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/438807/%E6%88%91%E4%B8%BACC%E7%BB%AD%E4%B8%80%E7%A7%92-GTLOLI%E7%BD%91%E7%AB%99%E5%85%84%E5%BC%9F%E4%BC%9A%E5%B0%8F%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.querySelector('.logout')) {
    const formhash = document.querySelector('.logout').href.split('&')[2].split('=')[1];
        if (formhash != GM_getValue('formhash')) {
            GM_setValue('formhash', formhash); //用GM_setValue当全局变量
        }
    }
    addBtns();
    // Your code here...
})();

function addBtns() {
  // 在打boss页面激活
  if (location.href.match(`id=zgxsh_assassin:boss`)) {
    const xs0 = document.querySelector('.xs0');
    const mnoutbox = document.querySelectorAll('.mnoutbox');
    let btn0 = genButton('立即加入', addIn); //设置名称和绑定函数
    xs0.insertBefore(btn0, mnoutbox[1]); //添加按钮到指定位置
    //const video = genVideo();
    //xs0.insertBefore(video, mnoutbox[1]); //添加视频到指定位置
    //console.log(video);
    addin();
  }
  // 在地图页面激活
  if (location.href.match(`id=zgxsh_assassin:map`)) {
    const debuginfo = document.querySelector("#debuginfo");
    const mnoutbox = document.querySelectorAll('.mnoutbox');
    let btn1 = genButton('开始刷经验', nice); //设置名称和绑定函数
    debuginfo.insertBefore(btn1, mnoutbox[1]); //添加按钮到指定位置
    let btn2 = genButton('升级', up); //设置名称和绑定函数
    debuginfo.insertBefore(btn2, mnoutbox[2]); //添加按钮到指定位置
    let btn3 = genButton('加蓝', addnan); //设置名称和绑定函数
    debuginfo.insertBefore(btn3, mnoutbox[3]); //添加按钮到指定位置
    //let btn4 = genButton('自动加点', jiadian); //设置名称和绑定函数
    //debuginfo.insertBefore(btn4, mnoutbox[5]); //添加按钮到指定位置
    //const video = genVideo();
    //debuginfo.insertBefore(video, mnoutbox[1]); //添加视频到指定位置
    //console.log(video);
    //fuck();
  }
  //制造页面
  if (location.href.match(`id=zgxsh_assassin:forg`)) {
    const debuginfo = document.querySelector("#debuginfo");
    const mnoutbox = document.querySelectorAll('.mnoutbox');
    let btn0 = genButton('刷取材料', addcailiao); //设置名称和绑定函数
    debuginfo.insertBefore(btn0, mnoutbox[1]); //添加按钮到指定位置
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

//立即加入
function addIn() {
  const http = new XMLHttpRequest();
  http.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:boss_if&op=boss_add&formhash="+GM_getValue('formhash'));
  http.send();
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
  const http = new XMLHttpRequest();
  http.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:boss_if&op=boss_add&formhash="+GM_getValue('formhash'));
  http.send();
  console.log("已经加入，不要刷新页面，会重复扣钱");
  }
}
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