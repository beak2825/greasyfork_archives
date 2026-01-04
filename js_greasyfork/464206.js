// ==UserScript==
// @name         网易云解析·凉
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  网易云音乐解析
// @author       wangkaixuan
// @match        https://music.163.com/song*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com
// @license      Apache
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/464206/%E7%BD%91%E6%98%93%E4%BA%91%E8%A7%A3%E6%9E%90%C2%B7%E5%87%89.user.js
// @updateURL https://update.greasyfork.org/scripts/464206/%E7%BD%91%E6%98%93%E4%BA%91%E8%A7%A3%E6%9E%90%C2%B7%E5%87%89.meta.js
// ==/UserScript==
//界面设计
var title=""
var url="";
var shape = true;
const div = document.createElement('div');
const divs = document.createElement('div');
const span = document.createElement('span');
const button = document.createElement('button');
button.textContent = "が";
span.textContent="获取中..";
const audio = document.createElement('audio');
audio.controls = true;
audio.loop = true;

const text = document.createTextNode('浏览器版本过低');
audio.appendChild(text);
divs.appendChild(span);
divs.appendChild(button);
div.appendChild(audio);
div.appendChild(divs);
document.body.appendChild(div);
//button.addEventListener('click',function(){} )
button.addEventListener('click',function(){
  if(shape){
  div.style.width="110px";
  div.style.height="110px";
  divs.style.width="110px";
  audio.style.width="110px";
  span.style.opacity="0";}else{
    div.style.width="300px";
    div.style.height="125px";
  divs.style.width="300px";
  audio.style.width="300px";
  span.style.opacity="1";
  }shape=!shape
  div.style.transition="width 0.6s ease-out, height 0.4s 0.7s";
})

div.style=`
position:fixed;
border-radius:30px;
width:300px;
height:125px;
background-color:#ddd;
border:6px solid black;
top:120px;
left:10px;
`
divs.style=`
border-radius:25px;
width:300px;
height:110px;
cursor: grab;
background-color: #ddd;
padding-top: 15px;
box-sizing: border-box;
transition: width 0.6s ease-out;
`
audio.style=`position:absolute;
bottom:0;
left:0;
z-index:90;
transition: width 0.6s ease-out;
`
button.style=`
position:absolute;
top:8px;
right:8px;
height:40px;
width:40px;
border:none;
font-size:20px;
z-index:11;
background-color: #ddd;
cursor: pointer;
font-weight:bold;
`
span.style=`
font-size:20px;
position:absolute;
left:10px;
z-index:10;
transition:opacity 0.4s 0.7s;
user-select:none;
max-height:100px;
overflow:hidden;
`

//鼠标拖动功能
let startX, startY;
// 定义变量，记录div元素的初始位置
let initialX, initialY;
// 定义变量，记录是否处于拖动状态
let isDragging = false;
// 鼠标按下事件监听器
divs.addEventListener('mousedown', function(e) {
  // 记录鼠标按下时的位置
  startX = e.clientX;
  startY = e.clientY;
  // 记录div元素的初始位置
  const rect = div.getBoundingClientRect();
  initialX = rect.left;
  initialY = rect.top;
  // 将状态设置为拖动状态
  isDragging = true;
});
// 鼠标移动事件监听器
document.addEventListener('mousemove', function(e) {
  // 如果不处于拖动状态，则直接返回
  if (!isDragging) return;
      div.style.transition="";
  // 计算div元素的新位置
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  const newX = initialX + dx;
  const newY = initialY + dy;
  // 将div元素移到新位置
  div.style.left = newX + 'px';
  div.style.top = newY + 'px';
});
// 鼠标松开事件监听器
document.addEventListener('mouseup', function() {
  // 将状态设置为非拖动状态
  if(isDragging){
    div.style.transition="top 0.3s ease-out,left 0.3s ease-out  ";//过渡动画之间的配合和设计非常巧妙
    if(div.getBoundingClientRect().top<110){div.style.top="110px"}
    if(div.getBoundingClientRect().top>window.innerHeight-180){div.style.top=window.innerHeight-180+"px"}
    if(div.getBoundingClientRect().left>window.innerWidth-160){div.style.left=window.innerWidth-160+"px"}
    if(div.getBoundingClientRect().left<0){div.style.left=0+"px"}
    localStorage.setItem("boxx", div.style.left);//保存
localStorage.setItem("boxy", div.style.top);//保存
// setTimeout(function(){div.style.transition="";},400)
isDragging = false;}
});

window.addEventListener('resize', function() {
  if(div.getBoundingClientRect().top>window.innerHeight-180){div.style.top=window.innerHeight-180+"px"}
    if(div.getBoundingClientRect().left>window.innerWidth-160){div.style.left=window.innerWidth-160+"px"}
});

  var boxx = localStorage.getItem("boxx");//读取
var boxy = localStorage.getItem("boxy");//读取
if(boxx){
    div.style.left = boxx;
  div.style.top = boxy;}


//数据获取
var currentUrl = window.location.href;
//console.log(currentUrl);
var id = new URL(currentUrl).searchParams.get("id");
//console.log(id);
if(id){
    var apiUrl = "https://api.paugram.com/netease/?id=" + id;
    GM_xmlhttpRequest({
        method: "GET",
        url: apiUrl,
        onload: function(response) {
            var json = JSON.parse(response.responseText);
            title = json.title;
            url = json.link;
           // console.log(title,url);
            if(title){
            span.textContent = title;}
audio.src =url;
        }
    });}
