// ==UserScript==
// @name          GEE一键自动点击运行
// @namespace    https://code.earthengine.google.com/
// @version      0.8
// @description  代替人工一次性点击所有任务的run按钮，已升级可以批量导出表格
// @author       You
// @match        https://code.earthengine.google.com/*
// @icon         https://code.earthengine.google.com/images/bigicon.png
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/459815/GEE%E4%B8%80%E9%94%AE%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%BF%90%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/459815/GEE%E4%B8%80%E9%94%AE%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%BF%90%E8%A1%8C.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function monitor() {
        while (true) {
            console.log("check one")
            if (document.querySelector("body > iron-overlay-backdrop") == null) {
                return new Promise((resolve, reject)=>{
                    resolve(0)
                });
            }
            await sleep(1000)
        }
    }

    // Your code here...
    async function runTaskListV2() {
        var runButtons = document.querySelector('#task-pane').shadowRoot.querySelectorAll(".run-button")
        var len = runButtons.length
        for (var i=0;i<len;i++) {
            var e = runButtons[0]
            e.click();
            await sleep(1500)
            // console.log("bu!")
            try {
                // console.log("img!")
                // var taskDialog = document.querySelectorAll("ee-image-config-dialog")
                // taskDialog.forEach(function (e) { e.shadowRoot.querySelector("ee-dialog").shadowRoot.querySelector("paper-dialog").querySelector(".ok-button").click() })
                document.querySelector("body > ee-image-config-dialog").shadowRoot.querySelector("ee-dialog").shadowRoot.querySelector("paper-dialog > div.buttons > ee-button.ok-button").click()
            } catch (error) {
                console.log("bu!")
                document.querySelector("body > ee-table-config-dialog").shadowRoot.querySelector("ee-dialog").shadowRoot.querySelector("paper-dialog > div.buttons > ee-button.ok-button").click()
            }
            // var all_ok = document.querySelectorAll('ee-table-config-dialog')
            // all_ok.forEach(function (e) {
            //     e.shadowRoot.querySelector("ee-dialog").shadowRoot.querySelector("paper-dialog > div.buttons > ee-button.ok-button").click()
            // console.log(all_ok)
            // })
            console.log("check one")
            await monitor()
            runButtons = document.querySelector('#task-pane').shadowRoot.querySelectorAll(".run-button")
            // await sleep(10000)
        }
        // runButtons.forEach(async function (e) {

        // })
    }

    function runTaskList() {
        var runButtons = document.querySelector('#task-pane').shadowRoot.querySelectorAll(".run-button")
        runButtons.forEach(function (e) {
            e.click();

        })
    }

    function stopTaskList() {
        var tasklist = document.getElementsByClassName('task remote type-EXPORT_IMAGE submitted-to-backend');
        for (var i = 0; i < tasklist.length; i++)
            tasklist[i].getElementsByClassName('indicator')[0].click();
    }

    function confirmAll() {
        var ok = document.getElementsByClassName('goog-buttonset-default goog-buttonset-action');
        for (var i = 0; i < ok.length; i++)
            ok[i].click();
    }

    $("#main > div.goog-splitpane > div.goog-splitpane-first-container > div > div.goog-splitpane-first-container > div > div.goog-splitpane-second-container > div > div.header > div")
        .append("<button class='goog-button link-button' style='color:#4888ef' id='run-muti'>Auto-Run</button>")
    // $("body")
    //     .append("<div style='position:fixed;z-index:999;width:250px;heigh:90px;top:15px;right:400px;display:flex'id='cancel_muti'><button class='goog-button link-button' style='color:#4888ef;margin-left: 5px;' id='Muti-Run-Table'>Muti-Run-Table</button></div>")
    $("#run-muti").click(function () {
        console.log("开始执行")
        runTaskListV2()
        // setTimeout(
        //     function () {
        //         var taskDialog = document.querySelectorAll("ee-image-config-dialog")
        //         taskDialog.forEach(function (e) { e.shadowRoot.querySelector("ee-dialog").shadowRoot.querySelector("paper-dialog").querySelector(".ok-button").click() })
        //     }, 2 * 1000);

    });
    // $("#Muti-Run-Table").click(function () {
    //     var all_ok = document.querySelectorAll('ee-table-config-dialog')
    //     all_ok.forEach(function (e) {
    //         e.shadowRoot.querySelector("ee-dialog").shadowRoot.querySelector("paper-dialog > div.buttons > ee-button.ok-button").click()
    //     })
    // })

    // // auto cancel
    // $("#main > div.goog-splitpane > div.goog-splitpane-first-container > div > div.goog-splitpane-first-container > div > div.goog-splitpane-second-container > div > div.header > div")
    //         .append("<button class='goog-button link-button' style='color:red' id='run-cancel'>Audo-CL</button>")
    // $("#run-cancel").click(function(){
    //     console.log("开始执行cancel");
    //     stopTaskList();
    //     confirmAll();
    // })
})();