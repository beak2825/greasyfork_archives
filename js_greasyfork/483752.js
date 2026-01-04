// ==UserScript==
// @name         1定时任务
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  百度固定标签页以每日执行任务
// @author       You
// @match        https://www.baidu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @require      https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/cn-workday@1.0.11/dist/cn-workday.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483752/1%E5%AE%9A%E6%97%B6%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/483752/1%E5%AE%9A%E6%97%B6%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

// UI展示数据
;const uiData = {
    todayIsSign: false, // 今天是否签到
    todaySignTime: localStorage.getItem('lastSignTime') || '', // 今日签到时间
    nextSignTime:'',// 下次签到时间点 window.nextTime
    nextSignCountdown: 0, // 下次签到倒计时 hh:mm:ss
};
// 最近签到日期 '' || YYYY-MM-DD
const lastSignDateFn = ()=> (localStorage.getItem('lastSignTime') || '').substring(0,10);
// 今日是否已签到
const todayIsSignFn = ()=> lastSignDateFn() === dayjs().format('YYYY-MM-DD');
// 当前是否是工作模式
const isWorkDay = ()=> window.CnWorkday.isWorkday()
// signModeToggle 签到模式切换键
//function signModeToggle(){
//    const nextMode = isWorkDay() ? 'vacation' : 'workDay'
//    localStorage.setItem('signMode', nextMode)
//    // 立即更新下次签到时间
//    clearTimeout(window.currTimeoutId);// 清除当前延迟任务
//    toDelaySign()// 执行签到任务
//    // 立即更新ui
//    UI(uiData)
//};
//// 需要手动挂载window否则找不到
//window.signModeToggle = signModeToggle;

// 时分秒格式化
function formatHms(time){
    //const d = Math.floor(parseInt(time/60 / 60 / 24))
    const h = (parseInt(time/60 / 60 )+'').padStart(2,'0')
    const m = (parseInt(time/60 % 60)+'').padStart(2,'0')
    const s = (parseInt(time % 60)+'').padStart(2,'0')
    return `${h}:${m}:${s}`
}
function UI(data){
    let container = document.querySelector('.uiContainer')
    if(!container){
        document.body.insertAdjacentHTML('afterbegin','<div class="uiContainer" style="text-align:left"></div>')
    }
    container = document.querySelector('.uiContainer')
    const uiStr = `
    <div style="
    position: fixed;
    top: 100px;
    right: 10px;
    padding: 10px;
    background: rgba(0,0,0,0.2);
    border-radius: 5px;
    z-index:1000;">
      <ul>
          <li>今日签到状态：今日${data.todayIsSign?'已':'未'}签到</li>
          <li>最近签到时间：${data.todaySignTime}</li>
          <li>下次签到时间：${data.nextSignTime}</li>
          <li>下次签到倒计时：${data.nextSignCountdown}</li>
      </ul>
      <button style="color:${isWorkDay()?'red':'green'}">${ isWorkDay() ? '工作日模式' : '假期模式' }</button>
    </div>`
    container.innerHTML = uiStr
}

// 每日定时任务 time 00:10  返回距离明日time剩余毫秒数  用来传给setTimeout
function scheduled(time){
    const todayIsSign = todayIsSignFn() // 今日是否已签到
    const dayMs = 86400000 // 1天毫秒数
    const now = Date.now() // 当前时间
    const today = dayjs(now).format('YYYY-MM-DD') // 当天日期
    const startDate = dayjs(`${today} ${time}`).valueOf()
    // 当天未签到时，距下次签到剩余时间
    if(!todayIsSign && startDate - now > 0){
        return  startDate - now
    }
    const remainder = startDate + dayMs - now
    return remainder
}
// 今天是否为工作日   为今天任务模式做准备
function todayIsWorkday(){
    return window.CnWorkday.isWorkday(Date.now());
}

// 明天是否为工作日   为下次任务模式做准备
function tomorrowIsWorkday(){
    return window.CnWorkday.isWorkday(new Date(Date.now() + 86400000));
}

// 去签到
function toSign(){
    const todaySignTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    console.log('本次签到时间====>', todaySignTime)
    localStorage.setItem('lastSignTime',todaySignTime)
    uiData.todaySignTime = todaySignTime
    console.log('执行今日签到任务')
    // 流量签到
    // window.open('https://we.gofly.cyou/user?needsign=true')
    // 掘进签到
    window.open("https://juejin.cn/user/center/signin?from=sign_in_menu_bar")
    // 当天签到完成 准备下一次签到
    toDelaySign()
}

// 生成随机时间 且可控制范围
function getRandomTime(hhRandom = [0,23],mmRandom = [0,59],ssRandom=[0,59]){
    const randomHH = String((Math.floor(Math.random()*(hhRandom[1]-hhRandom[0]))+hhRandom[0])).padStart(2,'0') // 9-18
    const randomMM = String((Math.floor(Math.random()*(mmRandom[1]-mmRandom[0]))+mmRandom[0])).padStart(2,'0') // 0-59
    const randomSS = String((Math.floor(Math.random()*(ssRandom[1]-ssRandom[0]))+ssRandom[0])).padStart(2,'0') // 0-59
    const nextTime = `${randomHH}:${randomMM}:${(randomSS)}`
    return nextTime
}

// 签到模式
const signModeMaps = {
    workDay:[[9,9],[10,30]], // 工作日9:10~9:30
    vacation:[[12,12]],// 假期 12:00~12:59
}
const getSignModeType = () =>  {
    // 今天是否签到
    if(!todayIsSignFn()){
        return todayIsWorkday() ? signModeMaps.workDay : signModeMaps.vacation;
    }else{
        return tomorrowIsWorkday() ? signModeMaps.workDay : signModeMaps.vacation;
    }
}
// 延迟到明日去签到
function toDelaySign(){
    // 选择签到模式
    const signModeType = getSignModeType();
    const nextTime = getRandomTime(...signModeType)
    window.nextTime = nextTime
    const remainder = scheduled(nextTime)
    console.log('下次签到时间点===>',nextTime)

    const todayIsSign = todayIsSignFn() // 今日是否已签到
    const todaySignTimeHasPassed = dayjs().format('HH:mm:ss') > window.nextTime // 今日签到时间已过
    // 今日签到时间已过，立即签到
    if( !todayIsSign && todaySignTimeHasPassed){
        console.log('今日签到时间已过，立即签到')
        toSign()
    }
    // 1. 今日已签到   2. 今日未签到 && 签到时间还未到
    if(todayIsSign || !todayIsSign && !todaySignTimeHasPassed){
        // 下面判断仅做console使用
        if(todayIsSign){
            // 1. 今日已签到
            console.log('今日已签到，准备明日签到')
        }
        if(!todayIsSign && !todaySignTimeHasPassed){
            // 2. 今日未签到 && 签到时间还未到
            console.log('2. 今日未签到 && 签到时间还未到')
        }

        window.currTimeoutId = setTimeout(()=>{
            toSign()
        },remainder)
    }
}
// 签到流程
;(function() {
    'use strict';
    // 执行签到任务 1. 今日已签到，设置下次任务   2. 今日未签到 && 签到时间还未到，设置下次任务 3. 今日未签到且签到时间已过，立即执行
    toDelaySign()

    // UI更新器
    setInterval(()=>{
        uiData.todayIsSign = todayIsSignFn()
        uiData.nextSignTime = window.nextTime
        const remainder = scheduled(window.nextTime)
        uiData.nextSignCountdown = formatHms(remainder/1000)
        UI(uiData)
    },1000)
    // Your code here...
})();
