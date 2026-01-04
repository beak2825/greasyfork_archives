// ==UserScript==
// @name         清水河畔之加加加
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  睡睡睡(>﹏<)
// @author       Ah! FROM RIVERSIDE
// @match        https://bbs.uestc.edu.cn/forum.php?mod=viewthread&tid=2049356
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uestc.edu.cn
// @grant        GM_setValue
// @grant        GM_getValue
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/462777/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E4%B9%8B%E5%8A%A0%E5%8A%A0%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/462777/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E4%B9%8B%E5%8A%A0%E5%8A%A0%E5%8A%A0.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    function addWater(pid, water, reason, referer) {
        return fetch("https://bbs.uestc.edu.cn/forum.php?mod=misc&action=rate&ratesubmit=yes&infloat=yes&inajax=1", {
            "headers": {
                'content-type': 'application/x-www-form-urlencoded'
            },
            "body": `tid=${tid}&pid=${pid}&formhash=${formhash}&referer=${encodeURI(referer)}&handlekey=rate&score2=${water}&reason=${reason}`,
            "method": "POST",
        });
    }

    async function getMaxWater(){
        let text = await fetch("https://bbs.uestc.edu.cn/forum.php?mod=misc&action=rate&tid=1996025&pid=34861067&handlekey=rate&inajax=1&ajaxtarget=fwin_content_rate").then(data=>data.text())
        return parseInt(text.match(/500<\/td><td>(\d*)<\/td>/)[1])
    }

    class Reward {
        constructor(type,lou) {
            this.lou = lou
            switch(type){
                case '23':
                    this.water = 20
                    this.prestige = 0
                    break
                case '023':
                    this.water = 30
                    this.prestige = 0
                    break
                case '0023':
                    this.water = 50
                    this.prestige = 0
                    break
                case '0000':
                    this.water = 100
                    this.prestige = 1
                    break
            }

        }
    }

    async function getPid(url, lou) {
        let pageSize = 20
        let page = parseInt((lou - 1) / pageSize) + 1
        return await fetch(url + "&page=" + page)
            .then(data => data.text())
            .then(data => {
                let doc = new DOMParser().parseFromString(data, 'text/html');
                let users = doc.querySelectorAll('.pi > .authi > a')
                let contents = doc.querySelectorAll('.pi > strong > a')
                let pid = contents[(lou - 1) % 20].id.split('postnum')[1]
                let name = users[(lou - 1) % 20].textContent
                let referer = `https://bbs.uestc.edu.cn/forum.php?mod=viewthread&tid=${tid}&page=${page}#${pid}`
                return [pid, name,referer]
            })
    }

    function makeRangeList(start = 0, end = Infinity, step = 1 , type = '23') {
        let result = []
        for (let i = start; i <= end; i += step) {
            result.push(new Reward(type,i))
        }
        return result
    }

    async function getLastLou() {
        let s = await fetch("https://bbs.uestc.edu.cn/forum.php?mod=misc&action=livelastpost&fid=25&ajaxdata=json").then(_=>_.text())
        return parseInt(s.match(/"count":"(\d*)"/)[1]) + 1
    }

    async function rewardOne(reward){
        let [pid, name, referer] = await getPid(redLou, reward.lou)
        if(reward.water <= MAXWATER){
            let response
            if (name in HISTORY) {
                if(HISTORY[name] < 2000){
                    reward.water = Math.min(reward.water,2000-HISTORY[name])
                    response = await addWater(pid,reward.water , `${reward.lou}楼奖励，该楼总计加水${HISTORY[name] + reward.water}💧`, referer)
                }else{
                    return {message: `${name}奖励已达上限`, success: true, lastLou: reward.lou}
                }
            }
            else
            {
                HISTORY[name] = 0
                response = await addWater(pid, reward.water, `${reward.lou}楼奖励`, referer)
            }
            if(response && response.ok){
                HISTORY[name] += reward.water
                MAXWATER -= reward.water
                GM_setValue("HISTORY", HISTORY)
                setTimeout(() => MAXWATER += reward.water, 1000 * 60 * 60 * 24);
                return {message: `${reward.lou}楼奖励已发`, success: true , lastLou: reward.lou}
            }
            return {message: `${reward.lou}楼奖励失败`, success: false}
        }
        return {message: `今日奖励已达上限`, success: false}
    }

    async function rewardAll(){

        let iter23 = makeRangeList(floor(START, 100, 23), END, 100, '23')
        let iter023 = makeRangeList(floor(START,1000,23), END, 1000, '023')
        let iter0023 = makeRangeList(floor(START,10000,23), END, 10000, '0023')
        let iter0000 = makeRangeList(floor(START,100000,0), END, 100000, '0000')

        let rewards = [iter23, iter023, iter0023, iter0000].flatMap(x => x).sort((a, b) =>{if(a.lou == b.lou){ return b.water - a.water} return a.lou - b.lou }  ).filter((r,i,a)=>i!=0?r.lou != a[i-1].lou:true)

        let lastLou = START
        for (let reward of rewards) {
            let response = await rewardOne(reward)
            console.log(response.message)
            if(response.success){
                lastLou = response.lastLou
            }
            else
            {
                break
            }
        }
        START = lastLou + 1
        GM_setValue("START", START)
    }

    async function realTimeReward(){
        let louNow = await getLastLou()
        let rewardLou = Math.min(floor(START, 100, 23),floor(START,100000,0)) 
        if(rewardLou <= louNow ){
            if(rewardLou % 10000 == 23){
                return rewardOne(new Reward('0023',rewardLou))
            }
            if(rewardLou % 1000 == 23){
                return rewardOne(new Reward('023',rewardLou))
            }
            if(rewardLou % 100 == 23){
                return rewardOne(new Reward('23',rewardLou))
            }
            if(rewardLou % 100000 == 0){
                return rewardOne(new Reward('0000',rewardLou))
            }
        }
        return Promise.resolve({message: "无奖励", success: false})
    }

    if(GM_getValue("Version", 0) == 0.1){
        GM_setValue("Version", 0.2)
        GM_setValue("START", 1)
        GM_setValue("HISTORY", {})
    }
    
    let redLou = "https://bbs.uestc.edu.cn/forum.php?mod=viewthread&tid=2049356"

    let tid = 2049356

    let START = GM_getValue("START", 1)
    let END = await getLastLou()
    let HISTORY = GM_getValue("HISTORY", {})
    let MAXWATER = await getMaxWater()

    let formhash = document.querySelector('input[name=formhash]').value
    let floor = (num, divide, end) => Math.ceil((num - end) / divide) * divide + end

    
    setInterval(async function(){
        let response = await realTimeReward()
        console.log(response.message)
            if(response.success){
                START = response.lastLou + 1
                GM_setValue("START", START)
            }
        }, 5000)
    let liveEle = document.querySelector("td.pls.vm.ptm")
    let startButton = document.createElement("button")
    startButton.textContent = "发奖"
    startButton.onclick = rewardAll
    liveEle.appendChild(startButton)
})();
