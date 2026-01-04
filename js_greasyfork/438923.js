// ==UserScript==
// @name         挂灯笼
// @namespace    none
// @version      1.2
// @description  给所有网站增加灯笼效果
// @grant        none
// @author       知心宝贝
// @include      *://*
// @downloadURL https://update.greasyfork.org/scripts/438923/%E6%8C%82%E7%81%AF%E7%AC%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/438923/%E6%8C%82%E7%81%AF%E7%AC%BC.meta.js
// ==/UserScript==

(function(){
  if(window.top !== window) return; // 在iframe中不渲染灯笼
  // 原版彩色配色颜色备份
  const colors = {
    suiLight: '#dc8f03',
    suiDark: '#ffa500',
    deng_box_shadow: 'rgba(250, 108, 0, 1)',
    r1: 'rgba(216, 0, 15, 0.8)',
    r2: 'rgba(216, 0, 15, 0.1)',
  }
  // 喜迎清明，黑白分明
  // const colors = {
  //   suiLight: '#ffffff',
  //   suiDark: '#9b9b9a',
  //   deng_box_shadow: 'rgb(74,74,74)',
  //   r1: 'rgba(16, 16, 16, 80%)',
  //   r2: 'rgba(16, 16, 16, 10%)',
  // }
  // 灯笼展示的文字样式
  const word = '福福'
  const style = document.createElement('style');
  style.innerHTML = `
.spring_lantern__deng-box {
position: fixed;
top: -20px;
right: -20px;
z-index: 99999;
}
.spring_lantern__deng-box1 {
 position: fixed;
 top: -10px;
 left: 10px;
 z-index: 99999;
}

.spring_lantern__deng-box1 .spring_lantern__deng {
 position: relative;
 width: 120px;
 height: 90px;
 margin: 50px;
 background: ${colors.r1};
 border-radius: 50% 50%;
 -webkit-transform-origin: 50% -100px;
 -webkit-animation: swing 5s infinite ease-in-out;
 box-shadow: -5px 5px 30px 4px ${colors.deng_box_shadow};
}
.spring_lantern__deng {
 position: relative;
 width: 120px;
 height: 90px;
 margin: 50px;
 background: ${colors.r1};
 border-radius: 50% 50%;
 -webkit-transform-origin: 50% -100px;
 -webkit-animation: swing 3s infinite ease-in-out;
 box-shadow: -5px 5px 50px 4px ${colors.deng_box_shadow};
}

.spring_lantern__deng-a {
 width: 100px;
 height: 90px;
 background: ${colors.r2};
 margin: 12px 8px 8px 8px;
 border-radius: 50% 50%;
 border: 2px solid ${colors.suiLight};
}
.spring_lantern__deng-b {
 width: 45px;
 height: 90px;
 background: ${colors.r2};
 margin: -4px 8px 8px 26px;
 border-radius: 50% 50%;
 border: 2px solid ${colors.suiLight};
}

.spring_lantern__xian {
 position: absolute;
 top: -40px;
 left: 60px;
 width: 2px;
 height: 40px;
 background: ${colors.suiLight};
}

.spring_lantern__shui-a {
 position: relative;
 width: 5px;
 height: 20px;
 margin: -5px 0 0 59px;
 -webkit-animation: swing 4s infinite ease-in-out;
 -webkit-transform-origin: 50% -45px;
 background: ${colors.suiDark};
 border-radius: 0 0 5px 5px;
}

.spring_lantern__shui-b {
 position: absolute;
 top: 14px;
 left: -2px;
 width: 10px;
 height: 10px;
 background: ${colors.suiLight};
 border-radius: 50%;
}

.spring_lantern__shui-c {
 position: absolute;
 top: 18px;
 left: -2px;
 width: 10px;
 height: 35px;
 background: ${colors.suiDark};
 border-radius: 0 0 0 5px;
}

.spring_lantern__deng:before {
 position: absolute;
 top: -7px;
 left: 29px;
 height: 12px;
 width: 60px;
 content: " ";
 display: block;
 z-index: 999;
 border-radius: 5px 5px 0 0;
 border: solid 1px ${colors.suiLight};
 background: ${colors.suiDark};
 background: linear-gradient(to right, ${colors.suiLight}, ${colors.suiDark}, ${colors.suiLight}, ${colors.suiDark}, ${colors.suiLight});
}

.spring_lantern__deng:after {
 position: absolute;
 bottom: -7px;
 left: 10px;
 height: 12px;
 width: 60px;
 content: " ";
 display: block;
 margin-left: 20px;
 border-radius: 0 0 5px 5px;
 border: solid 1px ${colors.suiLight};
 background: ${colors.suiDark};
 background: linear-gradient(to right, ${colors.suiLight}, ${colors.suiDark}, ${colors.suiLight}, ${colors.suiDark}, ${colors.suiLight});
}

.spring_lantern__deng-t {
 font-family: 华文行楷,华文楷体,Arial,Lucida Grande,Tahoma,sans-serif;
 font-size: 53px !important;
 color: ${colors.suiLight};
 font-weight: bold;
 line-height: 85px;
 text-align: center;
 user-select:none;
}

.night .spring_lantern__deng-t,
.night .spring_lantern__deng-box,
.night .spring_lantern__deng-box1 {
 background: transparent !important;
}

@-moz-keyframes swing {
 0% {
  -moz-transform: rotate(-10deg)
 }

 50% {
  -moz-transform: rotate(10deg)
 }
 100% {
  -moz-transform: rotate(-10deg)
 }
}

@-webkit-keyframes swing {
 0% {
  -webkit-transform: rotate(-10deg)
 }

 50% {
  -webkit-transform: rotate(10deg)
 }

 100% {
  -webkit-transform: rotate(-10deg)
 }
}
`;
  ;(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(style);

  const div1 = document.createElement('div')
  div1.innerHTML = `
<div class="spring_lantern__deng-box1" id="spring_lantern__box1">
 <div class="spring_lantern__deng">
  <div class="spring_lantern__xian"></div>
  <div class="spring_lantern__deng-a">
   <div class="spring_lantern__deng-b"><div class="spring_lantern__deng-t" id="spring_lantern__chun">${word.split('')[0]}</div></div>
  </div>
  <div class="spring_lantern__shui spring_lantern__shui-a"><div class="spring_lantern__shui-c"></div><div class="spring_lantern__shui-b"></div></div>
 </div>
</div>
`
  ;(document.getElementsByTagName('body')[0] || document.getElementsByTagName('div')[0]).appendChild(div1);

  const div2 = document.createElement('div')
  div2.innerHTML = `
<div class="spring_lantern__deng-box" id="spring_lantern__box">
 <div class="spring_lantern__deng">
  <div class="spring_lantern__xian"></div>
  <div class="spring_lantern__deng-a">
   <div class="spring_lantern__deng-b"><div class="spring_lantern__deng-t" id="spring_lantern__jie">${word.split('')[1]}</div></div>
  </div>
  <div class="spring_lantern__shui spring_lantern__shui-a"><div class="spring_lantern__shui-c"></div><div class="spring_lantern__shui-b"></div></div>
 </div>
</div>
`
  ;(document.getElementsByTagName('body')[0] || document.getElementsByTagName('div')[0]).appendChild(div2);

  document.addEventListener ('mousemove', _spring_lantern_ShowMousePosition, false);
  let _spring_lantern_LightUpFlag = false
  function _spring_lantern_ShowMousePosition (e){
    const isDown = e.clientY > 220
    const isUp = e.clientY < 225
    if ((isDown && !_spring_lantern_LightUpFlag) || (isUp && _spring_lantern_LightUpFlag)) return
    _spring_lantern_LightUpFlag = !_spring_lantern_LightUpFlag
    const box1 = document.getElementById('spring_lantern__box1')
    const box = document.getElementById('spring_lantern__box')
    if (isDown) {
      _spring_lantern_LightUpFlag = false
      box.style.display = 'block'
      box1.style.display = 'block'
    }
    if (isUp) {
      _spring_lantern_LightUpFlag = true
      box.style.display = 'none'
      box1.style.display = 'none'
    }
  }

})()
