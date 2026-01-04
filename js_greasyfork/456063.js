// ==UserScript==
// @name         哥特兄弟会叠血用
// @namespace    Youmage
// @version      0.1.3
// @description  哥特loli兄弟会加血辅助
// @author       Youmage
// @match        https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:*
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
// @downloadURL https://update.greasyfork.org/scripts/456063/%E5%93%A5%E7%89%B9%E5%85%84%E5%BC%9F%E4%BC%9A%E5%8F%A0%E8%A1%80%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/456063/%E5%93%A5%E7%89%B9%E5%85%84%E5%BC%9F%E4%BC%9A%E5%8F%A0%E8%A1%80%E7%94%A8.meta.js
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
})();

function addBtns() {
  // 在打boss页面激活
  if (location.href.match(`id=zgxsh_assassin:boss`)) {
    const xs0 = document.querySelector('.xs0');
    const mnoutbox = document.querySelectorAll('.mnoutbox');
    let btn0 = genButton('立即加入', addIn); //设置名称和绑定函数
    xs0.insertBefore(btn0, mnoutbox[1]); //添加按钮到指定位置
    //addin();//自动加入boss战
  }
  // 在背包页面激活
  if (location.href.match(`id=zgxsh_assassin:back`)) {
    const debuginfo = document.querySelector("#debuginfo");
    const mnoutbox = document.querySelectorAll('.mnoutbox');
    let btn2 = genButton('嗑药', addkeyao); //设置名称和绑定函数
    debuginfo.insertBefore(btn2, mnoutbox[2]); //添加按钮到指定位置
    addkeyao();//自动嗑药
}
  // 在地图页面激活
  if (location.href.match(`id=zgxsh_assassin:map`)) {
    const debuginfo = document.querySelector("#debuginfo");
    const mnoutbox = document.querySelectorAll('.mnoutbox');
    let btn1 = genButton('开始刷经验', nice); //设置名称和绑定函数
    debuginfo.insertBefore(btn1, mnoutbox[1]); //添加按钮到指定位置
  }
  //在工艺页面激活
  if (location.href.match(`id=zgxsh_assassin:forg`)) {
    const debuginfo = document.querySelector("#debuginfo");
    const mnoutbox = document.querySelectorAll('.mnoutbox');
    let btn0 = genButton('加血材料', addxueliang); //设置名称和绑定函数
    debuginfo.insertBefore(btn0, mnoutbox[1]); //添加按钮到指定位置
    let btn4 = genButton('加气力材料',addqili ); //设置名称和绑定函数
    debuginfo.insertBefore(btn4, mnoutbox[2]); //添加按钮到指定位置
    let btn5 = genButton('幌/火获取',addhuanghuo ); //设置名称和绑定函数
    debuginfo.insertBefore(btn5, mnoutbox[2]); //添加按钮到指定位置
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
}

//立即加入
function addIn() {
  const http = new XMLHttpRequest();
  http.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:boss_if&op=boss_add&formhash="+GM_getValue('formhash'));
  http.send();
}
//检查是否满血
function addin() {
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
//获取巨额经验
function nice() {
  const http17 = new XMLHttpRequest();
  http17.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:index_if&op=plot_add&bh=0999999l&formhash="+GM_getValue('formhash'));
  http17.send();
  const http18 = new XMLHttpRequest();
  http18.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:index_if&op=plot_add&bh=0999999l&formhash="+GM_getValue('formhash'));
  http18.send();
  console.log("经验刷取完毕完成");
    window.setTimeout(function(){
        window.location.reload();
    },2000);
}
//嗑背包第一个药
function addkeyao() {
    document.querySelector("button.layui-btn.layui-btn-sm.layui-btn-normal").click();
    window.setTimeout(function(){
        window.location.reload();
    },700);
}
//血量材料
function addxueliang() {
  const http1 = new XMLHttpRequest();//太阳花
  http1.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=2&pro=11&ches=2&formhash="+GM_getValue('formhash'));
  http1.send();
  console.log("刷取太阳花");
  const http2 = new XMLHttpRequest();//月亮草
  http2.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=3&pro=16&ches=3&formhash="+GM_getValue('formhash'));
  http2.send();
  console.log("刷取月亮草");
  const http3 = new XMLHttpRequest();//太阳花
  http3.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=2&pro=11&ches=2&formhash="+GM_getValue('formhash'));
  http3.send();
  console.log("刷取太阳花");
  const http4 = new XMLHttpRequest();//月亮草
  http4.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=3&pro=16&ches=3&formhash="+GM_getValue('formhash'));
  http4.send();
  console.log("刷取月亮草");
  const http5 = new XMLHttpRequest();//太阳花
  http5.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=2&pro=11&ches=2&formhash="+GM_getValue('formhash'));
  http5.send();
  console.log("刷取太阳花");
  const http6 = new XMLHttpRequest();//月亮草
  http6.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=3&pro=16&ches=3&formhash="+GM_getValue('formhash'));
  http6.send();
  console.log("刷取月亮草");
  const http7 = new XMLHttpRequest();//太阳花
  http7.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=2&pro=11&ches=2&formhash="+GM_getValue('formhash'));
  http7.send();
  console.log("刷取太阳花");
  const http8 = new XMLHttpRequest();//月亮草
  http8.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=3&pro=16&ches=3&formhash="+GM_getValue('formhash'));
  http8.send();
  console.log("刷取月亮草");
  const http9 = new XMLHttpRequest();//太阳花
  http9.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=2&pro=11&ches=2&formhash="+GM_getValue('formhash'));
  http9.send();
  console.log("刷取太阳花");
  const http10 = new XMLHttpRequest();//月亮草
  http10.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=3&pro=16&ches=3&formhash="+GM_getValue('formhash'));
  http10.send();
  console.log("刷取月亮草");
    window.setTimeout(function(){
        window.location.reload();
    },4000);
}
//气力材料部分
function addqili() {
  const http20 = new XMLHttpRequest();//太阳花
  http20.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=2&pro=11&ches=2&formhash="+GM_getValue('formhash'));
  http20.send();
  console.log("刷取太阳花");
  const http21 = new XMLHttpRequest();//死亡草
  http21.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=6&pro=20&ches=7&formhash="+GM_getValue('formhash'));
  http21.send();
  console.log("刷取死亡草");
  const http22 = new XMLHttpRequest();//寒颤棘
  http22.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=12&pro=14&ches=20&formhash="+GM_getValue('formhash'));
  http22.send();
  console.log("刷取寒颤棘");
  const http23 = new XMLHttpRequest();//夜蘑菇
  http23.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=15&pro=13&ches=40&formhash="+GM_getValue('formhash'));
  http23.send();
  console.log("刷取夜蘑菇");
  const http24 = new XMLHttpRequest();//闪耀根
  http24.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=6&pro=7&ches=6&formhash="+GM_getValue('formhash'));
  http24.send();
  console.log("刷取闪耀根");
  const http25 = new XMLHttpRequest();//月亮草
  http25.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=3&pro=16&ches=3&formhash="+GM_getValue('formhash'));
  http25.send();
  console.log("刷取月亮草");
  const http26 = new XMLHttpRequest();//死亡草
  http26.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=6&pro=20&ches=7&formhash="+GM_getValue('formhash'));
  http26.send();
  console.log("刷取死亡草");
    window.setTimeout(function(){
        window.location.reload();
    },2000);
}
//幌菊花、火焰草获取
function addhuanghuo() {
  const http27 = new XMLHttpRequest();//火焰花或幌菊花
  http27.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=9&pro=16&ches=10&formhash="+GM_getValue('formhash'));
  http27.send();
  console.log("刷取火焰花或幌菊花");
  const http28 = new XMLHttpRequest();//火焰花或幌菊花
  http28.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=9&pro=16&ches=10&formhash="+GM_getValue('formhash'));
  http28.send();
  console.log("刷取火焰花或幌菊花");
  const http29 = new XMLHttpRequest();//火焰花或幌菊花
  http29.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:plot&bh=9&pro=16&ches=10&formhash="+GM_getValue('formhash'));
  http29.send();
  console.log("刷取火焰花或幌菊花");
    window.setTimeout(function(){
        window.location.reload();
    },1000);
}