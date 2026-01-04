// ==UserScript==
// @name         SCUT雨课堂刷视频
// @namespace    http://www.shinny.com/
// @version      0.3
// @description  雨课堂自动刷视频，适用于华南理工大学研究生雨课堂慕课《论文协作与学术规范》
// @author       lzt
// @match        https://gsscut.yuketang.cn/pro/lms/*/homework/*
// @match        https://gsscut.yuketang.cn/pro/lms/*/studycontent
// @match        https://gsscut.yuketang.cn/pro/lms/*/*/video/*
// @require      https://lib.baomitu.com/axios/0.27.2/axios.min.js
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=yuketang.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451993/SCUT%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%88%B7%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/451993/SCUT%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%88%B7%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const concurrencyNum=5;

    const url = location.pathname;

    // 学习内容
    const studycontent = new RegExp(/lms\/.+\/studycontent/)
    // 学习列表
    const studyList = new RegExp(/\/lms\/learn\/course\/chapter.+/)
    // 完成进度
    const progress = new RegExp(/\lms\/learn\/course\/schedule/)
    // 视频播放
    const videoPlay = new RegExp(/\lms\/.+video\/.+/)
    // 获取视频链接
    const getVideoUrl = new RegExp(/audiovideo\/playurl/)

    // 房间id
    const classroom_id = +location.pathname.split("/")[4];

    if (videoPlay.test(url)) {
        console.log("视频播放")
        playVideo();
    }else if (studycontent.test(url)) {
        console.log("学习内容")
        studycontentList();
    }

    // 学习内容页面
    function studycontentList() {
        const boxDiv = document.createElement("div");
        boxDiv.setAttribute('class','learing-iframe-box');
        const boxsDiv=document.createElement("div");
        boxsDiv.setAttribute('class','boxs')
        boxDiv.appendChild(boxsDiv);
        let currentDiv = document.getElementById("app");
        document.body.insertBefore(boxDiv, currentDiv);

        console.log("加载学习列表中");

        const learArr = [];
        let isLearArr = [];
        function reqs(data) {
            data.data.course_chapter.forEach(el => {
                if (!el.is_locked) {
                    el.section_leaf_list.forEach(el_ => {
                        if (el_.leaf_list) {
                            // learArr.push(...el_.leaf_list)
                            let temp=el_.leaf_list[0];
                            temp.name=el_.name;
                            learArr.push(temp)
                        } else {
                            learArr.push(el_)
                        }
                    })
                }
            });
            console.log("获取到列表，查询进度");
        }
        function prss(data) {
            const prssArr = data.data.leaf_schedules
            // 未完成列表
            const dontLear = learArr.filter(el => {
                const keys = Object.keys(prssArr)
                const findData = keys.find(i => +i === el.id);
                if (findData !== undefined) {
                    const learData = prssArr[findData]
                    if (learData !== undefined) {
                        if (el.section_id){
                            if (typeof learData === "number") {
                                if (+learData !== 1) {
                                    return true;
                                }
                            } else if (learData.total !== learData.done) {
                                return true;
                            }
                        }
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            })
            console.log("挂机执行中...");
            startLears(dontLear.splice(0, concurrencyNum))
        }
        function startLears(arr) {
            if (!arr.length) {
                console.log("恭喜，所有课程均已完成！");
            }
            console.log("开始学习这些课程", arr)
            const app = document.querySelector('[data-v-3d8fef40]').__vue__;
            const learEl = document.querySelectorAll(".learing-iframe-box .boxs")
            arr.forEach(el => {
                if (isLearArr.find(i => i.id === el.id) === undefined) {
                    const div = document.createElement("div");
                    div.classList.add("boxs");
                    div.setAttribute("lear-id", el.id)
                    div.setAttribute("pr-name", el.name)
                    const tempIFrame = document.createElement("iframe");
                    div.appendChild(tempIFrame)
                    if (el.leaf_type === 6) {
                        tempIFrame.src = `https://gsscut.yuketang.cn/pro/lms/${app.$data.sign}/${app.$data.classroom_id}/homework/${el.id}`
                    } else {
                        tempIFrame.src = `https://gsscut.yuketang.cn/pro/lms/${app.$data.sign}/${app.$data.classroom_id}/video/${el.id}`
                        // location.assign(tempIFrame.src);
                        window.open(tempIFrame.src);
                    }
                    tempIFrame.classList.add("learing-iframe");
                    document.querySelector(".learing-iframe-box").appendChild(div);
                    isLearArr.push(el.id);
                } else { }
            })
            isLearArr = arr;
            learEl.forEach(el => {
                const find = isLearArr.find(i => i.id === +el.getAttribute("lear-id"))
                if (find === undefined) {
                    console.log(el.getAttribute("pr-name"), "此课已学习完成")
                    el.remove();
                }
            })
        }

        listenAjax(studyList, reqs);

        listenAjax(progress, prss);

        // 循环
        function loop() {
            setTimeout(() => {
                console.log("更新列表")
                document.querySelector('[data-v-3d8fef40]').__vue__.getLearnSchedule();
                const learEl = document.querySelectorAll(".learing-iframe-box .boxs")
                if (learEl.length) {
                    loop()
                }
            }, 10000);
        }
        loop()
    }
    function playVideo() {
        console.log(`视频播放挂机页面 [等待捕获视频url]`);

        const tims = setTimeout(() => {
            console.log(`页面加载错误，正在重载页面`);
            setTimeout(() => {
                location.reload()
            }, 3000)
        }, 60000)

        function startListen(data) {
            clearTimeout(tims)
            console.log("获取到视频链接", data)
            let lastTime = null,
                reloadCount = 30,
                thisCount = 0
            console.log(`视频播放挂机页面 [等待创建video节点]`);
            function loop() {
                const video = document.querySelector("video")
                if (video) {
                    if (video.paused) {
                        setTimeout(() => {
                            video.muted = true;
                            video.playbackRate=2.0;
                            video.play();
                        },200)
                    }
                    // let pause_btn = $("xt-bigbutton.pause_show");  // 暂停按钮
                    // if(pause_btn){  // 判断按钮是否显示
                    //     pause_btn.click();
                    // }
                    const dur = parseInt(video.duration),
                        curr = parseInt(video.currentTime)
                        console.log(`视频播放中 [${curr}/${dur}]`);
                    if (lastTime === curr) {
                        thisCount++;
                    } else {
                        thisCount = 0;
                    }
                    lastTime = curr;
                    if (reloadCount === thisCount) {
                        console.log(`视频长时间未播放，正在重载页面`);
                        setTimeout(() => {
                            location.reload()
                        }, 3000)
                        return;
                    }
                }
                setTimeout(loop, 2000)
            }
            loop();
        }
        listenAjax(getVideoUrl, startListen);
    }

    // ajax监听
    function listenAjax(rule, callback) {

        // 监听所有请求
        const originOpen = XMLHttpRequest.prototype.open;
        const originSend = XMLHttpRequest.prototype.send;

        // 重写open
        XMLHttpRequest.prototype.open = function () {
            this.addEventListener('load', function (obj) {
                const url = obj.target.responseURL; // obj.target -> this
                if (rule.test(url)) {
                    callback(JSON.parse(this.response))
                }
            });
            originOpen.apply(this, arguments);
        };

        // 重写send
        XMLHttpRequest.prototype.send = function () {
            originSend.apply(this, arguments);
        };
    }

})();