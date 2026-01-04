// ==UserScript==
// @name         青书自动刷视频脚本
// @namespace    https://b.huiwe.cn
// @version      1.3.2
// @description  青书自动刷视频脚本，实现自动播放、自动切换章节、自动跳转下一小节。
// @author       wanyujun
// @match        https://degree.qingshuxuetang.com/jhdx/Student/Course/CourseShow*
// @match        https://degree.qingshuxuetang.com/jhdx/Student/Course/CourseStudy*
// @icon         https://degree.qingshuxuetang.com/resources/default/images/favicon.ico
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/491860/%E9%9D%92%E4%B9%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/491860/%E9%9D%92%E4%B9%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function() {
    'use strict';
    window.onload = function () {
        utils.controlBox()
        utils.run()
    }
})()

const utils = {
    
    run() {
        if (utils.currentPageType() == false) {
            console.log('coursePage')
            utils.coursePage()
        } else {
            console.log('playPage')
            utils.playPage()
        }
    },

    // 当前页面类型
    currentPageType()
    {
        let currentUrl = window.location.href
        //判断是否包含CourseStudy关键词
        if (currentUrl.indexOf('CourseStudy') > -1) {
            return false
        }
         return true
    },

    coursePage() {
     debugger
        // 获取所有章节Id
        let courseId = utils.getUrlParam('courseId')
        let nodeIds = [];
        // 查找ID以courseware开头的A标签
        let list = document.querySelectorAll('a[id^="courseware"]')
        for (let i = 0; i < list.length; i++) {
            //获取href属性
            let href = list[i].getAttribute('href').replace('javascript: CoursewareNodesManager.onMenuClick(\'', '').replace('\');', '')
            nodeIds.push(href);
        }

        if (nodeIds && nodeIds.length <= 0) {
            window.alert('获取章节失败，请刷新页面重试')
            return
        }

        // 写入章节ID
        GM_setValue('nodeIds_' + courseId, nodeIds.map(v => v.trim()))
        // 判断是否点击开始学习按钮
        let start = GM_getValue('start_' + courseId, false)
        if (utils.isDone()) {
            utils.notify("所有章节已经学习完毕")
            return;
        }
        if (start == false) return false
        let nextId = utils.getLastNodeId()
        window.location.href = window.location.href.replace('CourseStudy', 'CourseShow') + '&nodeId=' + nextId

    },

    playPage() {

        let courseId = utils.getUrlParam('courseId')
        let start = GM_getValue('start_' + courseId, false)
        if (start == false || utils.isDone()) return false

        // 获取所有章节Id
        let nodeIds = GM_getValue('nodeIds_' + courseId, [])
        if (nodeIds.length == 0) {
            window.alert('当前章节数据为空，点击确定开始跳转到课程主页进行获取章节')
            return
        }

        // 获取到当前ID
        let nodeId = utils.getUrlParam('nodeId')
        let currentNodeId = utils.getLastNodeId();
        // 获取当前章节ID
        if (nodeId.trim() != currentNodeId) {
            window.location.href = window.location.href.replace(nodeId, currentNodeId)
            return
        }
        //获取播放容器
        let playerContainer = document.getElementById("playerContainer");
        //获取 video 标签
        let queryEl = playerContainer.getElementsByTagName("video")
        if(queryEl.length ==0){
            let nodeId = utils.getUrlParam('nodeId')
                utils.doneNode(nodeId)
                if (utils.isDone()) {
                    utils.notify("所有章节已经学习完毕，即将跳转到课程主页")
                    utils.goCoursePage()
                } else {
                    utils.notify("视频播放完毕，即将跳转到下一章节")
                    utils.goNextNode()
                }
            return;
        }
       for( a of queryEl){
            if(a.getAttribute('src')){
                queryEl=a
                break;
            }
        }
        if (queryEl) {
            let vEl = queryEl
            utils.notify("找到视频组件了，准备开始播放视频")
            vEl.addEventListener("ended", function() {
                let nodeId = utils.getUrlParam('nodeId')
                utils.doneNode(nodeId)
                if (utils.isDone()) {
                    utils.notify("所有章节已经学习完毕，即将跳转到课程主页")
                    utils.goCoursePage()
                } else {
                    utils.notify("视频播放完毕，即将跳转到下一章节")
                    utils.goNextNode()
                }
            })
            vEl.muted = true
            vEl.play()
        } else {
            // 没有找到视频组件
            if (utils.isDone()) {
                utils.notify("所有章节已经学习完毕，即将跳转到课程主页")
                utils.goCoursePage()
            } else {
                utils.doneNode(nodeId)
                utils.notify("没有找到视频组件，即将跳转到下一章节")
                utils.goNextNode()
            }
        }


    },

    getLastNodeId() {
        let courseId = utils.getUrlParam('courseId')
        let nodeIds = GM_getValue('nodeIds_' + courseId, [])
        let doneIds = GM_getValue('done_' + courseId, [])
        let nodeIdsTodo = nodeIds.filter(v => doneIds.includes(v) == false )
        return nodeIdsTodo.shift()
    },

    // 跳转到下一章节
    goNextNode() {
        let lastNodeId = utils.getLastNodeId()
        let currentNodeId = utils.getUrlParam('nodeId')
        if (lastNodeId) {
            window.location.href = window.location.href.replace(currentNodeId , lastNodeId)
        }
    },

    goCoursePage() {
        window.location.href = window.location.href.replace('CourseStudy', 'CourseShow')
    },

    //获取地址栏指定参数
    getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        } else {
            return "";
        }
    },

    isDone()
    {
        let courseId = utils.getUrlParam('courseId')
        let isDone = GM_getValue('isDone_' + courseId, false)
        if (isDone) return true
        return false
    },

    doneNode(nodeId)
    {
        let courseId = utils.getUrlParam('courseId')
        let doneKey = 'done_' + courseId
        let doneIds = GM_getValue(doneKey, [])
        if (doneIds.includes(nodeId) == false) {
            doneIds.push(nodeId)
            GM_setValue(doneKey, doneIds)
        }
        let nodeIds = GM_getValue('nodeIds_' + courseId, [])
        if (doneIds.length >= nodeIds.length) {
            GM_setValue('isDone_' + courseId, true)
        }
    },

    controlBox()
    {
        let courseId = utils.getUrlParam('courseId')
        let startKey = 'start_' + courseId
        let start = GM_getValue(startKey, false)
        let html = `
            <div style="position: fixed; bottom: 10px; right: 0; z-index: 9999;">
                <button id="start" style="width: 100px; height: 30px; background:red;  color:#fff; border:none; " id="startStudy">开始自动学习</button>
            </div>
        `;
        if (start) {
            html = `
                <div style="position: fixed; bottom: 10px; right: 0; z-index: 9999;">
                    <button id="stop" style="width: 100px; height: 30px; background:red; color:#fff; border:none; " id="stopStudy">停止自动学习</button>
                </div>
            `;
        }

        $('body').append(html)

        $('#start').click(function () {
            GM_setValue('start_' + courseId, true)
            $(this).html('停止自动学习')
            utils.run()
        })

        $('#stop').click(function () {
            GM_setValue('start_' + courseId, false)
            // 刷新当前页面
            window.location.reload()
        })
    },

    //弹出通知
    notify(content) {
        console.log(content)
        GM_notification({
            title: '系统通知',
            text: content,
            timeout: 2000
        })

    },

}