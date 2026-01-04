// ==UserScript==
// @name         小鹅通-中医健康管理技术刷课
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  中医健康管理技术刷课
// @author       Rydon
// @match        *://xjn.ethrss.cn/p/t_pc/course_pc_detail/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ethrss.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523933/%E5%B0%8F%E9%B9%85%E9%80%9A-%E4%B8%AD%E5%8C%BB%E5%81%A5%E5%BA%B7%E7%AE%A1%E7%90%86%E6%8A%80%E6%9C%AF%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/523933/%E5%B0%8F%E9%B9%85%E9%80%9A-%E4%B8%AD%E5%8C%BB%E5%81%A5%E5%BA%B7%E7%AE%A1%E7%90%86%E6%8A%80%E6%9C%AF%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';    
    // 用于存储请求的返回值
    let videoData = getVideoData()
    let currentIndex = 0
    let currentId = ''
    let currentCourses;
    if(videoData.length === 0) {
        // 拦截 XHR 请求
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function (method, url) {
            if(url.includes('xe.course.business.camp.node.get')) {
                this._catalogIndex = catalogIndex++
                this._requestURL = url; // 记录请求的URL
                this._method = method; // 记录请求的方法
            }
            originalXHROpen.apply(this, arguments);
        };

        let tmpResponse = []
        XMLHttpRequest.prototype.send = function () {
            if(this._requestURL) {
                // 监听请求完成
                this.addEventListener('load', function () {
                    if (this.readyState === 4 && this.status === 200) {
                        const response = this.response
                        response.parentIndex = this._catalogIndex
                        const data = response.data
                        for(let i=0;i<data.length;i++) {
                            if(document.baseURI.includes(data[i].id)) {
                                currentIndex = videoData.length+i
                                currentId = data[i].id
                                addCurCourse(currentId)
                            }
                        }
                        tmpResponse.push(response)
                        tmpResponse = tmpResponse.sort((a,b) => a.parentIndex - b.parentIndex)
                        videoData = tmpResponse.flatMap(item => item.data)
                        localStorage.setItem('ethrssVideoData',JSON.stringify(videoData))
                    }
                });
            }
            originalXHRSend.apply(this, arguments);
        };
    }else {
        for(let i=0;i<videoData.length;i++) {
            if(document.baseURI.includes(videoData[i].id)) {
                currentIndex = i
                currentId = videoData[i].id
                addCurCourse(currentId)
                break
            }
        }
    }

    function addCurCourse(id) {
        currentCourses = getCurCourses()
        currentCourses.add(id)
        localStorage.setItem('curEthrssCourses',JSON.stringify([...currentCourses]))
    }

    function deleteCurCourse(id) {
        currentCourses = getCurCourses()
        currentCourses.delete(id)
        localStorage.setItem('curEthrssCourses',JSON.stringify([...currentCourses]))
    }

    function getCurCourses() {
        return localStorage.getItem('curEthrssCourses') ? new Set(JSON.parse(localStorage.getItem('curEthrssCourses'))) : new Set()
    }

    function getVideoData() {
        return localStorage.getItem('ethrssVideoData') ? JSON.parse(localStorage.getItem('ethrssVideoData')) : []
    }

    function updateTaskProgress() {
        videoData = getVideoData()
        videoData[currentIndex].task_progress = 100
        localStorage.setItem('ethrssVideoData',JSON.stringify(videoData))
    }

    window.addEventListener('unload', function () {
        // 在页面关闭时执行清理工作
        deleteCurCourse(currentId)
      });

    const observer = new MutationObserver(() => {
        let video = document.querySelector('video');
        if (video) {
            observer.disconnect() // 找到元素后停止观察

            let tabs = document.querySelector('.tabs-item__wrapper')
            tabs.children[1].click()
            let collapses = document.querySelector('.el-collapse')
            for(let i=1;i<collapses.children.length;i++) {
                collapses.children[i].children[0].children[0].click()
            }

            video.muted = true
            video.playbackRate = 9.0
            video.play()
            video.addEventListener('pause',() => {
                if(document.hidden) {
                    video.muted = true
                    video.playbackRate = 9.0
                    video.play()
                }
            })
            video.addEventListener('ended',() => {
                currentCourses = getCurCourses()
                for(let i=currentIndex+1;i<videoData.length;i++) {
                    if(!currentCourses.has(videoData[i].id) && videoData[i].task_progress!==100) {
                        deleteCurCourse(currentId)
                        addCurCourse(videoData[i].id)
                        updateTaskProgress()
                        window.location.href = document.baseURI.replace(currentId,videoData[i].id)
                        break
                    }
                }
            })
        }
    });
    observer.observe(document.body, { childList: true, subtree: true })
})();