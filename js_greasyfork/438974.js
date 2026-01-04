// ==UserScript==
// @name         哥特LOLI网站小辅助
// @namespace    Sheepherder
// @version      2.0.0
// @description  哥特loli自动签到等等
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
// @downloadURL https://update.greasyfork.org/scripts/438974/%E5%93%A5%E7%89%B9LOLI%E7%BD%91%E7%AB%99%E5%B0%8F%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/438974/%E5%93%A5%E7%89%B9LOLI%E7%BD%91%E7%AB%99%E5%B0%8F%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==


(function () {
  'use strict';
  if (document.querySelector('.logout')) {
    const formhash = document.querySelector('.logout').href.split('&')[2].split('=')[1];
    const flag = "1";
    const count = 0;
    GM_setValue('flag', flag);
    if (formhash != GM_getValue('formhash')) {
      GM_setValue('formhash', formhash); //用GM_setValue当全局变量
      GM_setValue('flag', "0");
    }
    const day = new Date().getDay();
    if (day!=GM_getValue('day')||GM_getValue('flag')==="0") {
      GM_setValue('count', count);
    }
    console.log(GM_getValue('count'));
    if (day!=GM_getValue('day')||GM_getValue('flag')==="0"||GM_getValue('count') != 10 ){
      GM_setValue('day', day); //用GM_setValue当全局变量
      GM_setValue('count', GM_getValue('count')+1);
      signIn();
      showPage();
      sign();
    }
    else{
      console.log("该账号今天已经签过到了");
      console.log("该账号今天已经完成了VIP任务");
      console.log("该账号今天已经访问了10个人了");
    }
    console.log(formhash);
    addBtns();
  }
})();


//每日签到
function sign(){
  const http = new XMLHttpRequest();
  http.open('GET', "https://www.gtloli.gay/plugin.php?id=k_misign:sign&operation=qiandao&formhash="+GM_getValue('formhash')+"&format=empty");
  http.send();
  console.log("签到完成");
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
  get(pc);
  get(gtb);
}

function get0(data){
  const http = new XMLHttpRequest();
  http.open('GET', data.applyUrl);
  http.send();
}
function get1(data){
    const http = new XMLHttpRequest();
    http.open('GET', data.drawUrl);
    http.send();
}
function get2(data){
    const http = new XMLHttpRequest();
    http.open('GET', 'https://www.gtloli.gay/home.php?mod=space&do=notice&view=system');
    http.send();
}
function get(data) {
  get0(data);
  get1(data);
  get2(data);
  console.log(data.name + '每日任务完成!');
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

function addBtns() {
  //对不起loli娘
  document.querySelector("div.a_fr").style.display="none";
  document.querySelector("#nv_plugin > ins:nth-child(29)").style.display='none';
  if(location.href.match(`forum.php`)){
     document.querySelector("#sd > div > div.sd_mkes.sd_recpic > ul").style.display="none";
     document.querySelector("#ct > div.mn > div.mnmn > div.fl.bm > div:nth-child(2)").style.display="none";
     document.querySelector("#ct > div.mn > div.mnmn > div.fl.bm > div:nth-child(4)").style.display="none";
  }
  // 在等级页面激活
  if (location.href.match(`mod=spacecp&ac=usergroup`)) {
    const h3 = document.querySelector("#space_info > div.main > div > div.p_header > h3");
    const mnoutbox = document.querySelectorAll('.mnoutbox');
    let btn0 = genButton('显示有问题点击', loliniang_00); //设置名称和绑定函数
    h3.insertBefore(btn0, mnoutbox[1]); //添加按钮到指定位置
  }
  // 在打boss页面激活
  if (location.href.match(`id=zgxsh_assassin:boss`)) {
    const xs0 = document.querySelector('.xs0');
    const mnoutbox = document.querySelectorAll('.mnoutbox');
    let btn0 = genButton('立即加入', addIn); //设置名称和绑定函数
    xs0.insertBefore(btn0, mnoutbox[1]); //添加按钮到指定位置
    addin();
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

function loliniang_00(){
  document.querySelector("#space_info > div.main > div > div.minh.mlr25.graytopborder > div > div.p-conlist > div.tdats > table.tdat.tfx").style.width='280px';
  document.querySelector("#space_info > div.main > div > div.minh.mlr25.graytopborder > div > div.p-conlist > div.tdats > div > table").style.width='1228px';
}

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
  const http = new XMLHttpRequest();
  http.open('GET', "https://www.gtloli.gay/plugin.php?id=zgxsh_assassin:boss_if&op=boss_add&formhash="+GM_getValue('formhash'));
  http.send();
  console.log("已经加入，不要刷新页面，会重复扣钱");
  }
}