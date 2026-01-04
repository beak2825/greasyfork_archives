// ==UserScript==
// @name         自考脚本1.0|自动播放|跳过答题|自动写作业
// @version      1.0
// @author       Y鱼鱼鱼
// @match        https://*.whxunw.com/student-web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant GM_xmlhttpRequest
// @antifeature:fr ads
// @license MIT
// @description  含自动课程播放|跳过课程答题|自动填写作业请咨询
// @namespace https://greasyfork.org/users/1342436
// @downloadURL https://update.greasyfork.org/scripts/505558/%E8%87%AA%E8%80%83%E8%84%9A%E6%9C%AC10%7C%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%7C%E8%B7%B3%E8%BF%87%E7%AD%94%E9%A2%98%7C%E8%87%AA%E5%8A%A8%E5%86%99%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/505558/%E8%87%AA%E8%80%83%E8%84%9A%E6%9C%AC10%7C%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%7C%E8%B7%B3%E8%BF%87%E7%AD%94%E9%A2%98%7C%E8%87%AA%E5%8A%A8%E5%86%99%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==
// @run-at document-start


(function () {
    'use strict';


    function clear_background_detection() {

        // let ele = document.querySelector("head script[src^='js/chunk-vendors'][src$='.js']");
        // todo 立即执行一个异步函数，并确保如果该函数抛出错误或返回的 Promise 被拒绝，整个表达式的结果将是 true
        // !(async function () {
        //     let code = await (await fetch(ele.src)).text();
        //     code = code.replace(`document.addEventListener("visibilitychange",this.visibilityChangeHandler),window.addEventListener("blur",this.windowBlurHandler),window.addEventListener("focus",this.windowFocusHandler),`,``);
        //     console.log(code)
        //     eval(code);
        //     ele.dispatchEvent(new Event("load", {
        //         bubbles: true,
        //     }));
        //     // 如果第二次执行onload则是undefined,则不执行 ,第一次则触发load事件加载修改后的js
        //     ele.onload && ele.onload();

        // })();
    }


    function sleep(sleepTime) {
        return new Promise(resolve => setTimeout(resolve, sleepTime));
    }


    function get_current_number() {
        for (let index = 0; index < play_list.length; index++) {
            if (play_list[index].className === "pointer play") {
                return index
            }
        }
        return 0
    }


    //播放检测并自动点击
    async function play_check(play_interval) {
        // 判断是否需要答题 估计有逻辑bug,需要用节点监视器
        answer_check()
        await sleep(1000)
        // 'Pause' 播放中
        // document.querySelector("#valveVideogj > div.vjs-control-bar > button.vjs-play-control.vjs-control.vjs-button.vjs-playing > span.vjs-control-text").innerText

        // 'Play' 需要点击播放
        // document.querySelector("#valveVideogj > div.vjs-control-bar > button.vjs-play-control.vjs-control.vjs-button.vjs-paused > span.vjs-control-text").innerText


        // 'Replay' 重新播放,表示已经看完
        // document.querySelector("#valveVideogj > div.vjs-control-bar > button.vjs-play-control.vjs-control.vjs-button.vjs-paused.vjs-ended > span.vjs-control-text").innerText


        // 判断是否播放暂停
        try {
            let play_status = document.querySelector("#valveVideogj > div.vjs-control-bar > button.vjs-play-control.vjs-control.vjs-button.vjs-paused > span.vjs-control-text")
            let replay_status = document.querySelector("#valveVideogj > div.vjs-control-bar > button.vjs-play-control.vjs-control.vjs-button.vjs-paused.vjs-ended > span.vjs-control-text")
            if (play_status != null && play_status.innerText === "Play") {
                // 暂停继续播放
                console.log("继续播放")
                document.querySelector("#valveVideogj > div.vjs-control-bar > button.vjs-play-control.vjs-control.vjs-button.vjs-paused > span.vjs-icon-placeholder").click()
            } else if (replay_status != null && replay_status.innerText === "Replay") {
                console.log(get_current_number() + 1 + 'xxxxxxx' + play_list.length)
                if (get_current_number() + 1 === play_list.length) {
                    clearInterval(play_interval)
                    alert("播放完毕")
                }
                play_list[get_current_number() + 1].click()
                console.log("播放下一集")
                await sleep(1000)
            }
        } catch (error) {

        }

    }



    //答题检测
    async function answer_check() {
        if (document.querySelector("#app > div.layout > div.layout-body > div.layout-main > div.p-12.flex > div.dilog") != null) {
            //随机选择单选题
            var randomNumber = Math.floor(Math.random() * 4) + 1;
            document.querySelector("#app > div.layout > div.layout-body > div.layout-main > div.p-12.flex > div.dilog > div > div.context > div > div > div.list > div:nth-child(" + randomNumber + ") > div.txt").click()
            //确定
            document.querySelector("#app > div.layout > div.layout-body > div.layout-main > div.p-12.flex > div.dilog > div > div.bottoms > button > span").click()
            //关闭
            document.querySelector("#app > div.layout > div.layout-body > div.layout-main > div.p-12.flex > div.dilog > div > div.bottoms > button > span").click()
            console.log("完成答题")
        }
    }

    function get_play_list() {
        let num_list = []
        let series_list = document.querySelectorAll("#pane-0 > ul > li")
        for (let i = 0; i < series_list.length; i++) {
            let series_child = series_list[i].querySelectorAll("ul > li")
            if (series_child.length === 1) {
                num_list.push(series_child[0])
            } else {
                for (let j = 0; j < series_child.length; j++) {
                    num_list.push(series_child[j])
                }
            }
        }
        return num_list
    }

    let play_list = []

    function clear_foreground_detection(){
        let oldadd = EventTarget.prototype.addEventListener
        EventTarget.prototype.addEventListener = function (...args) {
            if (unsafeWindow.onblur !== null) {
                unsafeWindow.onblur = null;
            }
            if (args.length !== 0 && args[0] === 'visibilitychange') {
                return;
            }
            if (unsafeWindow.onfous !== null) {
                unsafeWindow.onfous = null;
            }
            return oldadd.call(this, ...args)
        }
    }
    window.addEventListener('load', async function () {
                document.querySelector('#app').__vue__.$router.afterHooks.push(async()=>{
            console.log('路由发生改变')
            if (location.href.includes("study-detail")) {
                clear_foreground_detection()
                await sleep(2000)
                document.querySelector("body > div.el-message-box__wrapper > div > div.el-message-box__btns > button.el-button.el-button--default.el-button--small.el-button--primary > span").click()
                await sleep(2000)
                play_list = get_play_list()
                console.log(play_list)
                var play_interval = setInterval(() => {
                    play_check(play_interval)
                }, 5000);
            }
        })

        alert("当前页面啥也不用点,谢谢合作")
        if (location.href.includes("study-detail")) {
            clear_foreground_detection()
            await sleep(2000)
            document.querySelector("body > div.el-message-box__wrapper > div > div.el-message-box__btns > button.el-button.el-button--default.el-button--small.el-button--primary > span").click()
            await sleep(2000)
            play_list = get_play_list()
            console.log(play_list)
            var play_interval = setInterval(() => {
                play_check(play_interval)
            }, 5000);
        }
    });



})();
