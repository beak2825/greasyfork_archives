// ==UserScript==
// @name 网上学习
// @namespace liufz34@chinaunicom.cn
// @version 1.0.20230919
// @description 自助网上学习
// @author liufz34
// @license MIT
// @match http*://m.campus.chinaunicom.cn/*
// @grant unsafeWindow
// @grant GM_notification
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/476079/%E7%BD%91%E4%B8%8A%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/476079/%E7%BD%91%E4%B8%8A%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 主函数
    const main = {
        started: false,
        courseQueue: [],
        init() {
            this.uiThemeCourses();
            $$$.addXhrListener(document, {
                'app/themeColumn/getMyAreaInfoResourceLibGroup?': this.initPage,
                'app/themeColumn/getMyAreaInfoCourse?': this.pages,
                'app/front/playkpoint/': this.lesson,
            });
        },
        uiThemeCourses() {
            // 加载主面板
            let panel = document.createElement("div");
            panel.id = 'ui_panel_1945';
            panel.style.width = '600px';
            panel.style.height = '100px';
            panel.style.backgroundColor = 'gray';
            panel.style.position = 'fixed';
            panel.style.top = '0';
            panel.style.left = '0';
            panel.innerHTML = `输入课程地址：<input id='addrtext' type='text' value='${window.location.href}' style='width:calc(100% - 80px);'>`;
            // 跳转按钮
            let rButton = document.createElement("button");
            rButton.innerText = "跳转";
            rButton.addEventListener("click", this.refresh);
            panel.appendChild(rButton);
            panel.appendChild(document.createElement("br"));
            // 开始按钮
            let sButton = document.createElement("button");
            sButton.id = "ui_start_1945";
            sButton.innerText = "开始";
            sButton.addEventListener("click", this.start);
            panel.appendChild(sButton);
            // 加载课程分类，考虑监听
            let ob = new MutationObserver(entries => {
                console.log(entries);
                entries.forEach(item => item.addedNodes.forEach(i => console.log(i)));
            });
            // ob.observe(document.body, {childList: true, subtree: true});
            // ob.disconnect();
            // setTimeout(()=>console.log('课程分类', document.querySelectorAll('div.coursesClass li')), 3000);
            document.body.appendChild(panel);
        },
        refresh(e) {
            console.log("refresh", e);
        },
        start(e) {
            console.log("start", e);
            this.started = true;
            // 获得选中分类课程
        },
        initPage(event) {
            // 课程详情
            if (event.detail.data && event.detail.data.hasOwnProperty('entity') && event.detail.data['entity'].hasOwnProperty('planLibGroupList')) {
                if (event.detail.data['entity']['planLibGroupList'].length <= 0) {
                    return;
                }
                let div = document.querySelector("#ui_panel_1945");
                let sButton = document.querySelector("#ui_start_1945");
                // 添加全选按钮
                let oCheckbox = document.createElement('input');
                oCheckbox.type = 'checkbox';
                oCheckbox.addEventListener('change', (e) => main.clickAll(e));
                div.insertBefore(oCheckbox, sButton);
                let label = document.createElement('label');
                label.innerText = '全选';
                div.insertBefore(label, sButton);
                event.detail.data['entity']['planLibGroupList'].forEach(item => {
                    let oCheckbox = document.createElement('input');
                    oCheckbox.setAttribute('type', 'checkbox');
                    oCheckbox.setAttribute('id', 'c' + item.id);
                    oCheckbox.setAttribute('name', 'c_planLibGroupList');
                    oCheckbox.data = item;
                    div.insertBefore(oCheckbox, sButton);
                    let label = document.createElement('label');
                    label.innerText = item.name;
                    div.insertBefore(label, sButton);
                });
            }
        },
        clickAll(event) {
            console.log('clickAll', event.target.checked);
            document.querySelectorAll('input[name="c_planLibGroupList"]').forEach(item => {
                item.checked = event.target.checked;
            });
        },
        pages(event) {
            if (this.started) {
                console.log("page", event.detail.data);
            }
        },
        lesson(event) {
            console.log("lesson", event, event.detail.data);
        },
        /*
        registerMenu() {
            GM_registerMenuCommand('播放所有未完成', async () => {
                // await this.clickUnfinished()
                // await this.expandAll()
                // this.playAllVideos()
                console.log('播放所有未完成');
            });
        }
        */
        /*
async playVideo(videoNode) {
    return new Promise(async (resolve) => {
        let url = videoNode.href
        let title = videoNode.querySelector(".course-title").title
        let id = this.extractId(url)

        console.log("play video", url)
        let status = await main.getCourseStatus(id)
        if (status.status === 'C') {
            this.showInfo(title + " already finished")
            return
        }

        var ifr = document.createElement('iframe');
        ifr.src = url;
        ifr.style.position = 'absolute';
        ifr.style.left = '0px';
        ifr.style.top = '0px';
        ifr.style.width = '800px';
        ifr.style.height = '800px';
        ifr.onload = async (event) => {
            let iw = event.target.contentWindow
            let idoc = iw.document
            try {
                await this.startPlayVideo(idoc)
                await this.waitPlayVideoFinished(idoc, id)
                await this.quitAndCleanup(idoc, id, title)
            } catch (e) {
                console.log("play error", e)
                this.showError("播放报错: " + e + "\n\n需要手工确认是否完成~~~")
            }
            document.body.removeChild(ifr)
            resolve()
        }
        document.body.appendChild(ifr);
    })
},
*/
    }
    console.log("网上学习初始化成功")
    main.init()
})();