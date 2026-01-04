// ==UserScript==
// @name         米哈遊星鐵搶石頭
// @namespace    Anong0u0
// @version      0.1.5
// @description  米哈遊罪大滔天，搞到百姓怨聲載道
// @author       Anong0u0
// @match        https://act.hoyoverse.com/sr/event/e20240327twitch-live-dwsuk4/index.html*
// @icon         https://hsr.hoyoverse.com/favicon.ico
// @grant        none
// @license      Beerware
// @downloadURL https://update.greasyfork.org/scripts/491173/%E7%B1%B3%E5%93%88%E9%81%8A%E6%98%9F%E9%90%B5%E6%90%B6%E7%9F%B3%E9%A0%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/491173/%E7%B1%B3%E5%93%88%E9%81%8A%E6%98%9F%E9%90%B5%E6%90%B6%E7%9F%B3%E9%A0%AD.meta.js
// ==/UserScript==

const delay = (ms = 0) => {return new Promise((r)=>{setTimeout(r, ms)})}
const waitElementLoad = (elementSelector, selectCount = 1, tryTimes = 1, interval = 0) =>
{
    return new Promise(async (resolve, reject)=>
    {
        let t = 1, result;
        while(true)
        {
            if(selectCount != 1) {if((result = document.querySelectorAll(elementSelector)).length >= selectCount) break;}
            else {if(result = document.querySelector(elementSelector)) break;}

            if(tryTimes>0 && ++t>tryTimes) return reject(new Error("Wait Timeout"));
            await delay(interval);
        }
        resolve(result);
    })
}

(async ()=>{
await waitElementLoad(".task-btn", 11, 0, 50)
await waitElementLoad(".accrue-reward__item-remain", 5, 0, 50)
await waitElementLoad(".week-reward__award-remain", 3, 0, 50)
console.log("載入成功")
//debugger
let rewardBtn;
while(rewardBtn = document.querySelector(".task-btn--completed")) // 領
{
    rewardBtn.click();
    await delay(100);
}

const waitUntil = (dateObject) => {return new Promise((resolve)=>
{
    const id = setInterval(()=>
    {
        if(new Date()-dateObject<0) return
        clearInterval(id)
        resolve()
    }, 500)
})}

const rewardDay = { // sp=1AM other=7PM
    "03-29": "3",
    "03-31": "5",
    "04-05": "10",
    "04-10": "15",
    "04-15": "20",
    "03-30": "3/30",
    "04-06": "4/6",
    "04-13": "4/13"
}

const now = new Date()
console.log("現在時間: ", now)

const day = now.toLocaleString("sv").match(/2024-(\d{2}-\d{2})/)?.[1]
const dayCount = document.querySelector(":last-child>.src-components-common-assets-__reward_---reward-record-item-info---YhzmDs")
const totalDay = Math.ceil((now-new Date("2024-03-27 18:00"))/86400000)
dayCount.innerText = dayCount.innerText.replace(/(\d+)/, `$1/${totalDay}`)
if(day in rewardDay)
{
    if(rewardDay[day].match(/\//))
    {
        const targetTime = new Date(`2024-${day} 00:59:00`)
        const targetBtn = [...document.querySelectorAll(".week-reward__time")]
                            .filter((e)=>e.innerText.match(rewardDay[day]))[0]
                            .parentElement.querySelector(".task-btn")
        if(targetBtn.className.match(/claimed/))
        {
            alert("成功領取")
            return
        }
        if(!targetBtn.className.match(/task-btn--doing/))
        {
            alert("沒領到QQ")
            return
        }
        if(now-targetTime<0)
        {
            console.log("等待直到", targetTime.toLocaleString("sv"))
            waitUntil(targetTime).then(()=>location.reload())
        }
        else if(now-targetTime<300000) location.reload()
    }
    else
    {
        const targetTime = new Date(`2024-${day} 18:59:00`)
        const targetBtn = [...document.querySelectorAll(".accrue-reward__item-task-desc")]
                            .filter((e)=>e.innerText.match(rewardDay[day]))[0]
                            .parentElement.querySelector(".task-btn")
        if(targetBtn.className.match(/claimed/))
        {
            alert("成功領取")
            return
        }
        if(!targetBtn.className.match(/task-btn--doing/))
        {
            alert("沒領到QQ")
            return
        }
        if(now-targetTime<0)
        {
            console.log("等待直到", targetTime.toLocaleString("sv"))
            waitUntil(targetTime).then(()=>location.reload())
        }
        else if(now-targetTime<300000) location.reload()
    }

}
})()
