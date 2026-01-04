// ==UserScript==
// @name Show me now time
// @namespace Show me now time
// @version 0.0.2
// @author 稻米鼠
// @description 在打开每个网页的时候显示一下当前时间，以及今天已经过去的百分比
// @match *://*/*
// @grant none
// @run-at document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/379870/Show%20me%20now%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/379870/Show%20me%20now%20time.meta.js
// ==/UserScript==

const oldLoadFun = window.onload
window.onload=function(){
  oldLoadFun && oldLoadFun()
  const nowTime = new Date()
  const hours = nowTime.getHours()
  const minutes = nowTime.getMinutes()<10 ? '0'+nowTime.getMinutes() : nowTime.getMinutes()
  const progress = (nowTime.getTime()-nowTime.getTimezoneOffset()*60000)%(24*3600*1000)/(24*3600*1000)
  console.log(progress)
  const progressToShow = (progress*100).toFixed(1)<10 ? '0'+(progress*100).toFixed(1) : (progress*100).toFixed(1)

  const timer = document.createElement("div")
  timer.id = 'please-show-me-now-time'

  const perLong = window.innerHeight > window.innerWidth ? window.innerWidth/100 : window.innerHeight/100
  const progressLong = Math.PI * 28 * perLong * progress
  const progressLongLast = Math.PI * 28 * perLong * (1-progress)
  const timerStyle = `
  <style>
    #please-show-me-now-time {
      position: fixed;
      z-index:99999999;
      height: 40vmin;
      width: 40vmin;
      top: calc(-40vmin - 42px);
      left: calc(30vmin - 5px);
      opacity: 1;
      transition: top .6s;
      pointer-events: none;
      border: 5px solid rgba(255, 255, 255, .6);
      border-top: none;
      box-shadow: 0 12px 24px 5px rgba(0, 0, 0, .1);
      box-sizing: content-box;
    }
    #please-show-me-now-time * {
      pointer-events: none;
    }
  </style>
  `
  timer.innerHTML = timerStyle + `
  <svg width="`+40*perLong+`" height="`+40*perLong+`">
    <rect x="0" y="0" width="`+40*perLong+`" height="`+40*perLong+`" stroke="transparent" fill="hsl(`+(720*progress)%360+`, 80%, 82%)" stroke-width="0"/>
    <rect x="0" y="`+10*perLong+`" width="`+40*perLong+`" height="`+30*perLong+`" stroke="transparent" fill="hsl(`+(720*progress)%360+`, 80%, 84%)" stroke-width="0"/>
    <rect x="0" y="`+21*perLong+`" width="`+40*perLong+`" height="`+19*perLong+`" stroke="transparent" fill="hsl(`+(720*progress)%360+`, 80%, 86%)" stroke-width="0"/>
    <circle cx="`+20*perLong+`" cy="`+20*perLong+`" r="`+14*perLong+`" stroke-width="`+perLong+`" stroke="rgba(32, 32, 36, .1)" fill="none"></circle>
    <circle cx="`+20*perLong+`" cy="`+20*perLong+`" r="`+14*perLong+`" stroke-width="`+perLong+`" stroke="hsl(`+(720*progress+72)%360+`, 60%, 48%)" transform="matrix(0,-1,-1,0,`+40*perLong+`,`+40*perLong+`)" fill="none" stroke-dasharray="`+progressLongLast+` `+progressLong+`"></circle>
    <g font-size="`+6*perLong+`" font-family="-apple-system, 'SF UI Text', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', 'Lantinghei SC', 'Source Han Sans', 'Noto Sans CJK', sans-serif, Arial" fill="rgba(72, 72, 80, .8)">
      <text x="`+19*perLong+`" y="`+20*perLong+`" style="text-anchor: end" font-weight="400">`+hours+`</text>
      <text x="`+20*perLong+`" y="`+20*perLong+`" style="text-anchor: middle" font-weight="400">:</text>
      <text x="`+21*perLong+`" y="`+20*perLong+`" style="text-anchor: start" font-weight="200">`+minutes+`</text>
      <text x="`+20*perLong+`" y="`+23*perLong+`" style="text-anchor: middle" font-size="`+2*perLong+`" font-weight="400">Today is passed `+progressToShow+`%</text>
    </g>
  </svg>`
  document.body.appendChild(timer)
  timer.style.left = (document.body.offsetWidth - timer.offsetWidth)/2 + 'px'
  window.setTimeout(()=>{
    timer.style.top = 0
  }, 100)
  window.setTimeout(()=>{
    timer.style.top = 'calc(-40vmin - 42px)'
  }, 3100)
  window.setTimeout(()=>{
    document.body.removeChild(timer)
  }, 5000)
}