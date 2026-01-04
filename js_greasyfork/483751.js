// ==UserScript==
// @name         3掘金
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  掘进每日签到任务
// @author       You
// @match        https://juejin.cn/user/center/signin?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @require      https://unpkg.com/randomcolor@0.6.2/randomColor.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483751/3%E6%8E%98%E9%87%91.user.js
// @updateURL https://update.greasyfork.org/scripts/483751/3%E6%8E%98%E9%87%91.meta.js
// ==/UserScript==

(function() {
    class QueueControl {
        constructor() {
            this.queueList = [];
            this.status = 'done'; // done runing
        }
        push(fn) {
            if(Object.prototype.toString.call(fn)==='[object Array]'){
                this.queueList.push(...fn);
            }else{
                this.queueList.push(fn);
            }
            if (this.status === 'done') {
                this.run();
            }
        }
        run() {
            if (this.queueList.length > 0 && this.status === 'done') {
                this.status = 'runing';
                const queueItemFn = this.queueList.shift();
                // 任务执行   this.next 是用于promise中
                queueItemFn(this.next.bind(this));
            }
        }
        next() {
            // 上个任务结束  下个任务开始  中间间隔1s
            const that = this;
            setTimeout(()=>{
                that.status = 'done';
                that.run();
            },1000)
        }
        clear() {
            this.queueList = [];
            this.status = 'done'; // done runing
        }
    }

    const queue = new QueueControl()

    function customRandomColorLog(text){
        const color = randomColor();
        console.info("%c"+text,`background-color: ${color}; padding: 6px 12px; border-radius: 2px; font-size: 12px; color: #fff; text-transform: uppercase; font-weight: 600;`)
    }

    window.onload = function(){
        // 页面以及资源全部加载完毕
        customRandomColorLog('页面以及资源全部加载完毕')
        queue.push([firstSign,drawLost,drawLostFree,accept])
    }


    // 第一次签到
    function firstSign(next){
        // 今日已完成签到直接结束
        customRandomColorLog('流程开始')
        if(localStorage.getItem('todayIsSign') === dayjs().format('YYYY-MM-DD')){
            customRandomColorLog('今日已签到，流程结束')
            return
        }
        const signBtn = document.querySelector('.signin.btn')
        const signedBtn = document.querySelector('.signedin.btn')
        const signBtnText = signBtn && signBtn.textContent
        if(signBtn && signBtnText.includes('立即签到')){
            customRandomColorLog('当前未签到，准备签到')
            setTimeout(()=>{
                customRandomColorLog('当前未签到，点击签到按钮')
                signBtn.click()
                // 点击后需要验证签到成功
                 const id = setInterval(()=>{
                    const signedBtn = document.querySelector('.signedin.btn')
                    if(signedBtn){
                        customRandomColorLog('发现今日已签到按钮，签到成功，进行下一步')
                        clearInterval(id)
                        next()
                    }
                },3000)
            },1000)
        }else if(signedBtn){
            customRandomColorLog('!!签到后（手动删除日期）再次执行场景!!')
            next()
        }
    }

    // 抓阄抽奖
    function drawLost(next){
        // 此处未出现问题，增加延迟，使流程更顺滑
        setTimeout(()=>{
            const cj = document.querySelector('.btn-area .btn')
            cj && customRandomColorLog('发现去抽奖按钮，准备跳转')
            cj && cj.click()
            next()
        },1000)
    }

    // 一次免费抽奖
    function drawLostFree(next){
        let count = 10 // 最少10次查找
        const id = setInterval(()=>{
            customRandomColorLog(`count：${--count}`)
            const freeBtn = document.querySelector('.text.text-free') // 免费按钮
            const singleBtn = document.querySelector('.lottery-text') // 单抽按钮
            if(!freeBtn && count>0){
                customRandomColorLog('定时任务开启，寻找免费抽奖按钮')
                return
            }
            if(freeBtn){
                clearInterval(id)
                customRandomColorLog('定时任务关闭，发现免费抽奖按钮')
                freeBtn.click()
                next()
            }else if(singleBtn){
                clearInterval(id)
                customRandomColorLog('!!定时任务关闭，发现单抽按钮，已完成抽奖,任务结束!!')
                // 标记今日已抽奖
                localStorage.setItem('todayIsSign', dayjs().format('YYYY-MM-DD'))
                queue.clear()
            }
        },1000)

        }
    // 收下奖励
    function accept(next){
        const submit = document.querySelector('.wrapper .submit')
        submit && submit.click()
        setTimeout(()=>{
            const rewardDom = document.querySelector('.wrapper .title')
            const rewardText = rewardDom && rewardDom.textContent
            const rewardBtn = document.querySelector('.wrapper .submit')
            rewardBtn && rewardBtn.click()
            customRandomColorLog('抽奖完成，收下奖励：'+ rewardText)
            queue.clear()
            // 标记今日已抽奖
            localStorage.setItem('todayIsSign', dayjs().format('YYYY-MM-DD'))
            closePage()
        },3000)
    }
    // 关闭页面
    function closePage(){
        setTimeout(()=>{
            window.close()
        },30000)
    }
    // Your code here...
})();