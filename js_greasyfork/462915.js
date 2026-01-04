// ==UserScript==
// @name         休息一下
// @namespace    http://tampermonkey.net/
// @version      2.2.2
// @description  随机获取动漫和小仙女图片以及网页版
// @author       wangkaixuan
// @match        *://*/*
// @grant        none
// @license      Apache
// @downloadURL https://update.greasyfork.org/scripts/462915/%E4%BC%91%E6%81%AF%E4%B8%80%E4%B8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/462915/%E4%BC%91%E6%81%AF%E4%B8%80%E4%B8%8B.meta.js
// ==/UserScript==
var [show,seconds,imgsize,htop,result] = [1,0,true,"https://","18认证"]
let currentUrl = `${htop}api.yimian.xyz/img?type=head`;
const animeButton = document.createElement('button');
const sceneryButton = document.createElement('button');
const beautyButton = document.createElement('button');
const cosButton = document.createElement('button');
const videoButton = document.createElement('button');
animeButton.innerText = 'ACG';
sceneryButton.innerText = '风景';
beautyButton.innerText = '三次元';
cosButton.innerText = 'COS';
videoButton.innerText = '视频';
const magnifyButton = document.createElement('button');
magnifyButton.innerText = '⇱';
const R18input = document.createElement('input');
R18input.type = 'checkbox';
R18input.checked = false;
R18input.onchange = (event)=>{
  if (R18input.checked==true) {R18yes();}else{
    result="wkx";
    animeButton.style.backgroundColor="#FFC0CB";cosButton.style.backgroundColor="#FFC0CB";
  }
    R18input.checked = false;
}
const spans = document.createElement('div');
spans.innerText = '开启R18模式';
const spanp = document.createElement('div');

const showbox = document.createElement('div');
const directionImage = document.createElement('div');

const randomImage = document.createElement('img');
randomImage.style.width = "320px";
randomImage.onclick =()=>{
    imgsize=!imgsize;
    randomImage.style.width =imgsize ? '320px' : '800px';
}

const newDiv = document.createElement('div');
newDiv.style=`
position:absolute;
top:65%;
left:50%;
transform:translateX(-50%);
width:100px;
z-index:1`
randomImage.onload = function() {
  newDiv.innerText="图片加载中..";
};
randomImage.onerror = function() {
  newDiv.innerText="";
};

const videoye = document.createElement('video');
const container = document.getElementById("div");
videoye.width=320;
videoye.controls = true;
videoye.autoplay = true;
videoye.style.display="none";
videoye.style.position="relative";
videoye.style.zIndex="16";
videoye.muted = true;

// 按钮容器
const buttonContainer = document.createElement('div');
buttonContainer.id="newKuang"
buttonContainer.style = `
  position: fixed;
  top: 20px;
  right: -344px;
  height: auto;
  min-height:100px;
  background-color: #FFF;
  border: 2px solid #eaedf7;
  border-radius: 10px;
  padding: 10px;
  padding-top: 40px;
  z-index: 9999;
  transition: all 0.8s ease-out;
  text-align: center;
`;

// 按钮通用样式
const buttonStyle = `
  background-color: #FFC0CB;
  color: #FFFFFF;
  border: none;
  font-size:14px;
  padding: 10px;
  height: 38px;
  line-height:18px;
  border-radius: 8px;
  margin-right: 10px;
  cursor: pointer;
  box-shadow:4px 4px 5px #CCC;
  transition: background-color 2s ease-out;
`;
animeButton.style = buttonStyle;
sceneryButton.style = buttonStyle;
beautyButton.style = buttonStyle;
cosButton.style = buttonStyle;
videoButton.style = buttonStyle;
//背景按钮样式
magnifyButton.style = `
  background-color: rgba(255, 255, 255, 0.8);
  color: black;
  border: none;
  padding: 10px 13px;
  border-radius:0 10px 0 0;
  cursor: pointer;
  position:absolute;
  top:97px;
  right:9px;
  z-index:20
`;
magnifyButton.title =
`单击设置为当前页面背景图片
(因为跨域问题无法固定某张图片为背景)
鼠标右击单击取消背景图片
(另:单击图片可放大)`;

// 说明样式
spanp.innerText ="欢迎访问网页版"
spanp.style = `
cursor:default;
color:#FFC0CB;
font-size:10px;
position:absolute;
padding: 0;
top:10px;
left:10px;
font-weight:bold;
`
// 图片样式
randomImage.style.display = 'block';
randomImage.style.marginTop = '20px';
randomImage.style.borderRadius = '10px';
randomImage.style.transition="all 0.4s linear";
randomImage.style.position = 'relative';
randomImage.style.zIndex=10
randomImage.alt = "图片加载失败或当前为视频"
// 单选文本样式
spans.style=`
color: black;
position:absolute;
top:12px;
right:10px;
font-size:10px;
cursor: default;`;
// 单选样式
R18input.style=`
position:absolute;
top:10px;
right:80px;
cursor: pointer;`;
// 方向样式
directionImage.style=`
width:0;
height:0;
border-top:10px solid transparent;
border-bottom:10px solid transparent;
border-right:10px solid transparent;
border-right-color: white;
transition:all 0.4s linear;`;
// 位置按钮样式
showbox.style=`
position:absolute;
top:20px;
left:-30px;
background-color: #FFC0CB;
padding: 10px;
border-radius: 8px 0 0 8px;
margin-right: 10px;
cursor: pointer; `;

randomImage.addEventListener("contextmenu", function(event) {
      event.preventDefault(); 
      if(result!="金岂"){
      result = prompt("恭喜你找到了真正的R18入口,space.bilibili.com/286450879,网页版已公开密码");}
      if(result=="金岂"){animeButton.style.backgroundColor="Gold";cosButton.style.backgroundColor="Gold";R18input.checked = true;}else{
      animeButton.style.backgroundColor="#FFC0CB";cosButton.style.backgroundColor="#FFC0CB";R18input.checked = false;}
    });

buttonContainer.onmousedown = (event) => {//利用冒泡优化代码
  const button = event.target.closest('button'); 
  if (button) {
    button.style.filter = 'brightness(0.8)'; 
  }
};
buttonContainer.onmouseup = (event) => {
  const button = event.target.closest('button');
    if (button) {
            button.style.filter = '';
    }
};
// --
animeButton.onclick = () => {
  if(result=="金岂"){
    currentUrl = `${htop}sex.nyan.xyz/api/v2/img?r18=true&t=${Date.now()}`
  }else{
    currentUrl = `${htop}www.loliapi.com/acg/?t=${Date.now()}`; // 使用二次元图片
  }
  getRandomImage(currentUrl);
  videoye.style.display="none";
  magnifyButton.style.display="block";
};
animeButton.addEventListener("contextmenu", function(event) {
      event.preventDefault();
      if(result=="金岂"){
    currentUrl = `${htop}image.anosu.top/pixiv/?r18=1&db=1&t=${Date.now()}`
  }else{
currentUrl = `${htop}www.dmoe.cc/random.php?t=${Date.now()}`;
  }
  getRandomImage(currentUrl);
  videoye.style.display="none";
  magnifyButton.style.display="block";
    });
// --
sceneryButton.onclick = () => {
currentUrl = `${htop}api.asxe.vip/scenery.php?t=${Date.now()}`;//动漫风景
  getRandomImage(currentUrl);
  videoye.style.display="none";
  magnifyButton.style.display="block";
};
sceneryButton.addEventListener("contextmenu", function(event) {//右击
      event.preventDefault();
currentUrl = `${htop}t.lizi.moe/fj?t=${Date.now()}`;
  getRandomImage(currentUrl);
  videoye.style.display="none";
  magnifyButton.style.display="block";
    });
// --
beautyButton.onclick = () => {
    currentUrl = `${htop}api.btstu.cn/sjbz/api.php?lx=meizi&t=${Date.now()}`;
  getRandomImage(currentUrl);
  videoye.style.display="none";
  magnifyButton.style.display="block";
};
beautyButton.addEventListener("contextmenu", function(event) {//右击
      event.preventDefault();
currentUrl = `${htop}api.btstu.cn/sjbz/api.php?t=${Date.now()}`;
  getRandomImage(currentUrl);
  videoye.style.display="none";
  magnifyButton.style.display="block";
    });
// --
cosButton.onclick = () => {
  if(result=="金岂"){
    currentUrl = `${htop}api.caonm.net/api/bhs/b.php?t=${Date.now()}`
  }else{
    currentUrl = `${htop}api.caonm.net/api/mnt/index.php?t=${Date.now()}`;
  }
  getRandomImage(currentUrl);
  videoye.style.display="none";
  magnifyButton.style.display="block";
};
cosButton.addEventListener("contextmenu", function(event) {
      event.preventDefault();
      if(result=="金岂"){
    currentUrl = `${htop}api.caonm.net/api/bhs/h.php?t=${Date.now()}`
  }else{
    currentUrl = `${htop}api.vvhan.com/api/girl?t=${Date.now()}`;
  }
  getRandomImage(currentUrl);
  videoye.style.display="none";
  magnifyButton.style.display="block";
    });
// --
videoButton.onclick = () => {
  videoye.src=`https://api.qqsuu.cn/api/dm-xjj?type=video`;
  videoye.style.display="block";
  magnifyButton.style.display="none";
  currentUrl = ""
  getRandomImage(currentUrl);
};
videoButton.addEventListener("contextmenu", function(event) {//右击
  event.preventDefault();
  window.location.href="https://tucdn.wpon.cn/api-girl/index.php"
    });
// --
magnifyButton.onclick = () => {//背景替换
document.body.style.backgroundImage = `url(${currentUrl})`;
localStorage.setItem("BackgroundImage", randomImage.src);//保存
backgroundBurden()
};
magnifyButton.addEventListener("contextmenu", function(event) {
      event.preventDefault(); 
      localStorage.removeItem("BackgroundImage");//删除
      location.replace(location.href);
    });
// 将按钮和图片添加到容器中
buttonContainer.appendChild(spanp);
buttonContainer.appendChild(animeButton);
buttonContainer.appendChild(sceneryButton);
buttonContainer.appendChild(beautyButton);
buttonContainer.appendChild(cosButton);
buttonContainer.appendChild(videoButton);
buttonContainer.appendChild(newDiv);
buttonContainer.appendChild(randomImage);
buttonContainer.appendChild(videoye);
showbox.appendChild(directionImage);
buttonContainer.appendChild(showbox);
buttonContainer.appendChild(magnifyButton);
buttonContainer.appendChild(R18input);
buttonContainer.appendChild(spans);
document.body.appendChild(buttonContainer);

function R18yes(){//戏耍
const result = confirm('⚠️您已经年满180周岁?');
if (result) {
  alert('〠经过系统检测,你未满180周岁,根据《未成年人保护法》你无法访问R18内容!');
}}
function getRandomImage(url) {//链接
  randomImage.src = "";
  randomImage.src = url;
}
function shows(){//控制移动
    if(show){
    buttonContainer.style.right = '20px';
    directionImage.style.transform = 'rotate(-180deg)'
    show=!show
    }else{
        buttonContainer.style.right = '-344px';
    directionImage.style.transform = 'rotate(0deg)';
    imgsize=true;
    randomImage.style.width ='320px'
    show=!show
    }
}
function backgroundBurden(){//背景样式
  const divs = document.querySelectorAll('body > div:not(#newKuang)');
const ps = document.querySelectorAll('p,img,span,h1,h2,h3,video');
divs.forEach(di => {
  if (di.style.backgroundColor) {
  di.style.opacity = '0.8';
} else {
  di.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  di.style.opacity = '0.8';
}
})
ps.forEach(p1 => {
      p1.style.opacity = '1';
    });
document.body.style.backgroundRepeat="no-repeat";
document.body.style.backgroundAttachment= "fixed";
document.body.style.backgroundSize="cover";
}


showbox.onclick = () => {//改变位置
getRandomImage(currentUrl);
shows();
var timer = setInterval(function() {
  seconds++;
  spanp.innerText = seconds%2 ? "鼠标左击和右击是不同图源" : "https://wkx3131.github.io/"
  if (seconds > 1) {
    clearInterval(timer); // 停止计时器
  }
}, 3000);
};

// 从localStorage中读取BackgroundImage的值
var backgroundImage = localStorage.getItem("BackgroundImage");//读取
window.addEventListener('load', () => {

if (backgroundImage) {
  document.body.style.backgroundImage = "url('" + backgroundImage + "')";
  backgroundBurden()
}
});