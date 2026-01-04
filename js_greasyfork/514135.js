// ==UserScript==
// @name         Wikidot站内信批量删除插件
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @license MIT
// @description  开发代号：避火罩
// @author       MentalImageryMirage
// @match        https://www.wikidot.com/account/messages
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikidot.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514135/Wikidot%E7%AB%99%E5%86%85%E4%BF%A1%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/514135/Wikidot%E7%AB%99%E5%86%85%E4%BF%A1%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("Message Killer Stand By");

    window.startTask = (target) => {
        const now1 = Date.now();
        // const taskPool = 5;
        // let taskNumCount = 0;
        // let msgCount = 0;
        // let targetName = '';
        // let taskIndex = 0;
        let pageSum = 1;
        console.log(`start task to kill ${target}`);
        // targetName = target;
        // let maxTaskNum = 1;
        const pages = document.querySelectorAll(".target");
        if (pages.length > 0) {
            console.log(`存在多页`);
            const buttonText = pages[pages.length - 2].querySelector("a").innerText;
            pageSum = parseInt(buttonText);
        }
        // pageSum = 703;
        if(pageSum > 1000){
            console.log(`页数过大，限制任务规模。`);
            pageSum = 1000;
        }
        console.log(`一共${pageSum}页`)
        const tester = new searchAndKill(target, now1, pageSum);
        tester.start();
        // for (let i = 1; i <= maxTaskNum; i++) {
        //     // if(i == 1){
        //     //     searchAndKillThemAll(document, i);
        //     //     continue;
        //     // }
        //     getNextPage(i);
        // }
    }

    class searchAndKill {
        targetName = '';
        taskPool = 5;
        taskDetectedCount = 0;
        taskDoneCount = 0;
        msgToKill = [];
        msgKilledCount = 0;
        msgDetectedCount = 0;
        taskSum = 1;
        startTime = 0;
        maxTaskNum = 1;
        batchNum = 1;
        batchLastTaskNum = 0;
        batchDoneCount = 0;
        batchTaskDetectedCount = 0;
        errPage = [];
        errDelete = [];
        // clocker;

        constructor(targetName, startTime, pageSum) {
            this.taskSum = pageSum;
            this.maxTaskNum = pageSum > this.taskPool ? this.taskPool : pageSum;
            this.startTime = startTime;
            this.targetName = targetName;
        }

        start() {
            console.log(`start searchAndKill`);
            console.log(`首批最大任务数${this.maxTaskNum}`);

            if (this.taskSum == this.maxTaskNum) {
                this.batchLastTaskNum = this.maxTaskNum;
                this.batchTaskBegin();
                return;
            }
            const getBatch = () => {
                // if(taskSum <= maxTaskNum){
                //     return 1;
                // }
                if ((this.taskSum % this.maxTaskNum) == 0) {
                    const res = this.taskSum / this.maxTaskNum;
                    return res;
                }
                const res = Math.floor(this.taskSum / this.maxTaskNum) + 1;
                return res;
            }
            console.log(`${this.taskSum} ${this.maxTaskNum}`);
            console.log((this.taskSum % this.maxTaskNum) == 0);
            this.batchNum = getBatch();
            this.batchLastTaskNum = ((this.taskSum % this.maxTaskNum) == 0) ? this.maxTaskNum : (this.taskSum % this.maxTaskNum);
            console.log(`共${this.batchNum}批，最后一批任务数${this.batchLastTaskNum}`)
            document.getElementById("msgPage").innerText = `已检索${0}/${this.taskSum}页`
            this.batchTaskBegin();

            // clearInterval(this.clocker);
            // let i = 1;
            // this.clocker = setInterval(() => {
            //     if(i > this.maxTaskNum){
            //         clearInterval(this.clocker);
            //     }
            //     this.getNextPage(i);
            //     i++;
            // }, 1000);
        }

        batchTaskBegin() {
            const batch = this.batchDoneCount + 1;
            console.log(`第${batch}批任务开始`)
            this.maxTaskNum = batch == this.batchNum ? this.batchLastTaskNum : this.maxTaskNum;
            for (let i = 1; i <= this.maxTaskNum; i++) {
                // if (i == 1) {
                //     this.search(document, i);
                //     continue;
                // }
                this.getNextPage(i);
            }
        }

        retryGetPage() {
            console.log(`retry to get page ${this.errPage}`);
            // for(let page of this.errPage){
            //     this.getNextPage(page);
            // }
            while (this.errPage.length > 0) {
                const page = this.errPage.shift();
                console.log(`retry get ${page}`);
                this.getNextPage(page);
            }
        }

        getNextPage(nextPageNum) {
            console.log(`getting next page ${nextPageNum}`);
            const that = this;
            OZONE.ajax.requestModule("dashboard/messages/DMInboxModule", {
                page: nextPageNum
            }, function (res) {
                // console.log(`to search and kill ${targetName}`);
                if (!WIKIDOT.utils.handleError(res)) {
                    console.log(`get page erro: ${nextPageNum}`);
                    this.errPage(nextPageNum);
                    return;
                }
                that.taskDetectedCount++;
                that.batchTaskDetectedCount++;
                const searchLoading = ((that.taskDetectedCount / that.taskSum).toFixed(2) * 100).toFixed(0)
                document.getElementById("searchingLoader").style.width = `${searchLoading}%`;
                // console.log(f.body);
                document.getElementById("msgPage").innerText = `已检索${that.taskDetectedCount}/${that.taskSum}页`
                const parser = new DOMParser()
                const HTML = parser.parseFromString(res.body, "text/html");
                const newMsgToKill = that.search(HTML, nextPageNum)
                that.msgDetectedCount += newMsgToKill.length;
                that.msgToKill = [...that.msgToKill, ...newMsgToKill]
                document.getElementById("msgDetected").innerText = `已检索到${that.msgDetectedCount}条信息`
                if (that.batchTaskDetectedCount >= that.maxTaskNum) {
                    console.log(`第${that.batchDoneCount + 1}批检索完毕，开始删除`);
                    that.killThemAll();
                }
                // b("#message-view").hide();
                // b("#message-area").hide().html(f.body).fadeIn("fast");
                // a.bindMessageClick()
            }, null, {
                clearRequestQueue: false
            });
        }

        search(doc, page) {
            console.log(`searchAndKillThemAll page ${page}`);
            const messages = doc.querySelectorAll('.message');
            let msgToKill = [];
            console.log(`messages: ${messages.length}`);
            for (let msg of messages) {
                const dataHref = msg.dataset.href;
                const tempList = dataHref.split('/');
                const messageId = tempList[2];
                // console.log(messageId);
                const from = msg.querySelector('.from');
                let fromName = from.querySelectorAll('a')[1];
                if (!fromName) {
                    continue;
                }
                fromName = fromName.innerText;
                //console.log(`${fromName} ${messageId}`);
                if (this.targetName == fromName) {
                    // console.log(`found ${target} ${messageId}`);
                    msgToKill.push(messageId);
                    // this.msgDetectedCount += 1;
                }

            }
            // this.msgDetectedCount += msgToKill.length;
            // this.killThemAll(msgToKill, doc, page);
            return msgToKill;
        }

        ifNextPage(doc) {
            const pages = doc.querySelectorAll(".target");
            if (pages.length <= 0) {
                console.log(`not found pages button`);
                return undefined;
            }
            const buttonText = pages[pages.length - 1].querySelector("a").innerText;
            if (buttonText.indexOf("next") <= -1) {
                console.log('no next page');
                return undefined;
            }
            // console.log("next page");
            let hrefTemp = pages[pages.length - 1].querySelector("a").href.split("/");
            const nextPageNum = parseInt(hrefTemp[hrefTemp.length - 1].replace("p", ""));
            const nextTaskPageNum = nextPageNum - 1 + this.taskPool;

            if (nextTaskPageNum <= this.taskSum) {
                console.log(`${nextPageNum - 1} --> ${nextTaskPageNum}`);
                return nextTaskPageNum;
                // that.getNextPage(nextTaskPageNum);
            }
        }

        //分批次进行
        killThemAll() {
            if (this.errPage.length > 0) {
                console.log(`检测到存在获取失败的页面，开始重试`);
                this.retryGetPage();
            }
            const batch = this.batchDoneCount + 1;
            console.log(`batch ${batch} killing start: ${this.msgToKill.length}`);
            // taskIndex ++;
            let e = {};
            e.action = "DashboardMessageAction";
            e.event = "removeMessages";
            e.messages = this.msgToKill;
            // const docTemp = doc;
            // afterKill('test', docTemp);
            // const that = this;
            OZONE.ajax.requestModule(null, e, res => {
                // var f = new OZONE.dialogs.SuccessBox();
                // f.content = "The messages has been removed.";
                // f.show();
                if (!WIKIDOT.utils.handleError(res)) {
                    console.log(`killing ${batch} erro`);
                    this.killThemAll();
                    return;
                }
                this.msgKilledCount += this.msgToKill.length;
                this.taskDoneCount = this.taskDetectedCount
                const now2 = Date.now();
                const cost = ((now2 - this.startTime) / 1000).toFixed(2);

                const loading = (this.taskDoneCount / this.taskSum).toFixed(2);
                const widthToUpdate = ((document.getElementById('loadBar').offsetWidth - 2) * loading).toFixed(2);

                console.log(`第${batch}批 ${this.msgToKill.length}条 完成于第${cost}秒`);
                console.log(`进度${this.taskDoneCount}/${this.taskSum} ${(loading * 100).toFixed(2)}%`);

                document.getElementById("killingLoader").style.width = `${widthToUpdate}px`;
                document.getElementById("msgKilled").innerText = `已检索并删除${this.msgKilledCount}条信息 `;
                this.msgToKill = [];
                this.batchTaskDetectedCount = 0;

                // taskNum --;
                this.batchDoneCount++;
                if (this.batchDoneCount < this.batchNum) {
                    this.batchTaskBegin();
                    return;
                }

                // if (this.taskDoneCount >= this.taskSum) {
                console.log("task end");
                console.log(`final result: ${this.msgKilledCount}`);
                const speed = (this.taskDoneCount / cost).toFixed(2);
                console.log(`均速: ${speed}页每秒`);
                document.getElementById("msg").innerHTML = `<div style="color:white;width:100%;text-align:center">检索完成，共计${this.taskDoneCount}页</div>`;
                document.getElementById("msg").innerHTML += `<div style="color:white;width:100%;text-align:center">耗时${cost}秒，均速${speed}页/秒</div>`;
                document.getElementById("msg").innerHTML += `<div style="color:white;width:100%;text-align:center">最终检索并删除${this.msgKilledCount}条信息</div>`;
                document.getElementById("msg").innerHTML += `<button style="height:25px" onclick="location.reload()">确认</button>`;
                return;
                // }
            });
        }

    }

    var thread = document.querySelector('#html-body');
    thread.innerHTML += `
    <div style="position: fixed;right:0;top:0;bottom:0;margin:auto 0;display:flex;align-items:start;height:200px;width:300px">
        <!-- <div style="display:flex;flex-direction:column">
            <div style="color:red;cursor: pointer;user-select:none;height:20px;width:20px;background-color:black;text-align:center;display:flex;align-items:center;justify-content:center"
                onclick="window.hide()" id="hide"></div>
        </div> -->
        <div id="mailKiller" style="width:90%;height:100%;background-color:black;color:white;display:flex;flex-direction:column;align-items:center;justify-content:space-around;padding-bottom: 2px;">
            <div style="display:flex;width:90%;justify-content:center;align-items:center;border-bottom: 2px solid red;">
                <div style="font-size:larger;text-align:center;">避火罩</div>
            </div>
            <div id="loadBar" style="border:1px solid white;width:80%;height:10px">
                <div id="searchingLoader" style="background-color:yellow;height:8px;width:0px">
                     <div id="killingLoader" style="background-color:red;height:8px;width:0px"></div>
                </div>
            </div>
            <div id="msg" style="height:80px;display:flex;flex-direction:column;align-items:center;">
                <div id="msgPage" style="color:white;width:100%;text-align:center">已检索0/0页</div>
                <div id="msgDetected" style="color:white;width:100%;text-align:center">已检索到0条信息</div>
                <div id="msgKilled" style="color:white;width:100%;text-align:center">已检索并删除0条信息</div>
            </div>
            <div style="font-size: 10px;">请输入需删除的目标用户名：</div>
            <div style="width: 100%;display:flex;align-items:center;justify-content: space-around;">
                <input id="targetName" style="background-color: white;height: 20px;width: 60%;color: black;"></input>
                <button style="width: 30%;height:25px" onclick="window.startTask(document.querySelector('#targetName').value)">确认</button>
            </div>
        </div>
    </div>
    `

    // var e = {};
    // e.action = "DashboardMessageAction";
    // e.event = "removeMessages";
    // e.messages = [];
    // OZONE.ajax.requestModule(null, e, function(g) {
    //     var f = new OZONE.dialogs.SuccessBox();
    //     f.content = "The messages has been removed.";
    //     f.show();
    //     a.app.refresh()
    // })
    //WIKIDOT.modules.DashboardMessagesModule.removeSelectedMessages();
    //action=DashboardMessageAction&event=removeMessages&messages%5B%5D=27664146&messages%5B%5D=27664144&moduleName=Empty&callbackIndex=2&wikidot_token7=ad5075aa362ae13dea514d4cffdc8697

    // OZONE.ajax.requestModule("inbox", {
    //     page: d
    // }, function(f) {
    //     if (!WIKIDOT.utils.handleError(f)) {
    //         return
    //     }
    //     // b("#message-view").hide();
    //     // b("#message-area").hide().html(f.body).fadeIn("fast");
    //     // a.bindMessageClick()
    // }, null, {
    //     clearRequestQueue: true
    // })

})();