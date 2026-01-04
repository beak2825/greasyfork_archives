// ==UserScript==
// @name         广州华立科技职业学院课程助手
// @namespace    http://tampermonkey.net/
// @version      2024-04-13
// @description  广州华立科技职业学院挂机课程,适用于https://gzhlxy.sccchina.net/
// @author       ZaneBill
// @match        https://gzhlxy.sccchina.net/student/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sccchina.net
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      http://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// @license      AGPL License

// @downloadURL https://update.greasyfork.org/scripts/492491/%E5%B9%BF%E5%B7%9E%E5%8D%8E%E7%AB%8B%E7%A7%91%E6%8A%80%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2%E8%AF%BE%E7%A8%8B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/492491/%E5%B9%BF%E5%B7%9E%E5%8D%8E%E7%AB%8B%E7%A7%91%E6%8A%80%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2%E8%AF%BE%E7%A8%8B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){
        // 定义全局变量
        let UPDATE_COURSE_GAP = 60 // 多久上传一次进度 秒
        let UPDATE_PROGRESS_GAP = UPDATE_COURSE_GAP + 2 // 多久更新一次列表进度  秒
        let STUDY_DURATION = 6 // 每次观看进度 官方是30  setInterval间隔一分钟
        let courseList = []
        let timerMap = new Map()

        // 分割已观看/总时长分钟数
        function splitPlayTime(str){
            const arr = str.split(' / ')
            return {
                finished: arr[0],
                total: arr[1]
            }
        }

        // 根据我的课程列表 创建脚本界面
        function makeLayout(list = courseList){
            let operateBox = "<div class='operateBox'><table class='table'><tbody></tbody></table></div>"
            $('body').append(operateBox)
            let head = "<div class='head'><div><span id='tip1'></span><span id='tip2'></span></div><button id='oneKeyStart'>一键开刷</button></div>"
            let inputBox1 = `<div>列表更新频率(秒)<input type='number' value='${UPDATE_PROGRESS_GAP}' min='1' max='9999' placeholder='输入1-9999之间的数字' data-name='list'></input></div>`
            let inputBox2 = `<div>课程提交频率(秒)<input type='number' value='${UPDATE_COURSE_GAP}' min='1' max='9999' placeholder='输入1-9999之间的数字' data-name='course'></input></div>`
            let inputBox3 = `<div>课程提交跨度<input type='number' value='${STUDY_DURATION}' min='1' max='9999' placeholder='输入1-9999之间的数字' data-name='step'></input></div>`
            let inputBox = `<div class='inputBox'>${inputBox1}${inputBox2}${inputBox3}</div>`
            $('.operateBox .table').before(inputBox)
            $('.operateBox .table').before(head)
            $('#tip1').text(`每隔${UPDATE_PROGRESS_GAP}秒自动更新列表,每隔${UPDATE_COURSE_GAP}秒提交课程,跨度为${STUDY_DURATION}秒`)
            let content = list.reduce((pre, item, index)=> {
                let tr = `<tr><td>${index + 1}</td><td>${item.courseName}</td><td>${item.coursewareLearningProgress}</td><td>${splitPlayTime(item.realCoursewarePlayTime).finished}</td>` +
                    `<td>${splitPlayTime(item.realCoursewarePlayTime).total}</td><td class='newMinute'></td><td class='newPercent'></td></tr>`;
                return pre += tr
            }, '<tr><th>序号</th><th>课程名</th><th>完成度</th><th>已完成分钟数</th><th>总分钟数</th><th>新分钟数</th><th>新完成度</th></tr>')
            $('.operateBox .table tbody').append(content)
            // 去掉操作栏的单个开刷按钮  用一键开刷  <th>操作</th>  <td class='opt_btn' data-index='${index}'>开刷</td>

            $('.operateBox').css({
                'position': 'fixed',
                'bottom': '50px',
                'right': '30px',
                'background': '#eee',
                'border-radius': '4px',
                'padding': '5px'
            })
            $('.operateBox .inputBox').css({
                'display': 'flex',
                'justify-content': 'space-between',
                'padding': '10px 0'
            })
            $('.operateBox .inputBox input').css({
                'width': '100px',
            })
            $('.operateBox .head').css({
                'display':'flex',
                'justify-content': 'space-between',
                'align-items': 'center'
            })
            $('#oneKeyStart').css({
                'cursor': 'pointer',
            })
            $('table').css({
                'border-collapse':'collapse'
            })
            $('td,th').css({
                'padding':'0 5px'
            })
            $('table,th,td ').css({
                'border': '1px solid black',
            })
            $('#oneKeyStart,.opt_btn').css({
                'cursor': 'pointer',
                'color': '#1890ff'
            })
            $('.newMinute,.newPercent').css({
                'min-width': '30px',
            })
        }

        // 获取我的课程进度
        function getList(){
            return new Promise((resolve, reject)=> {
                try{
                    $.ajax({
                        url: '/student/student/coursestudy/getlist',
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json",
                        processData: false,
                        data: JSON.stringify({
                            data:""
                        }),
                        success: function(response) {
                            if(response.items){
                                courseList = response.items
                                resolve(response.items)
                            }
                        },
                        error: function(xhr, status, error) {
                            reject(error)
                        },
                    });
                }catch (error){
                    reject(error)
                }
            })
        }

        // 获取token
        function getCourseToken(item){
            return new Promise((resolve, reject)=> {
                try{
                    const { courseVersionID, sign, teachplanCourseVersionId } = item
                    $.ajax({
                        url: '/student/common/common/getcoursewareaddress',
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json",
                        processData: false,
                        data: JSON.stringify({
                            data:{
                                courseVersionId: courseVersionID,
                                sign,
                                teachplanCourseVersionId,
                                roleType: "1"
                            }
                        }),
                        success: function(response) {
                            if(response.code === 1){
                                resolve(response.data.token)
                            }
                        },
                        error: function(xhr, status, error) {
                            reject(error)
                        },
                    });
                }catch(error){
                    reject(error)
                }
            })
        }

        // 增加时长
        function addDurationFn(data = {}){
            const {
                courseVersionId,
                studyDuration,
                token
            } = data
            return new Promise((resolve, reject)=> {
                try{
                    $.ajax({
                        url: '/student/student/coursestudyrecord/adddurationpc',
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json",
                        processData: false,
                        data: JSON.stringify({
                            data:{
                                courseVersionId,
                                studyDuration,
                                token
                            }
                        }),
                        success: function(response) {
                            if(response.code === 1){
                                resolve('success')
                            }
                        },
                        error: function(xhr, status, error) {
                            reject(error)
                        },
                    });
                }catch (error){
                    reject(error)
                }
            })
        }

        // 主要逻辑 循环发送请求更新课程观看进度
        async function updateCourse(curItem){
            const token = await getCourseToken(curItem)
            const data = {
                courseVersionId:curItem.courseVersionID,
                studyDuration: STUDY_DURATION,
                token
            }
            let timer = setInterval(async ()=> {
                await addDurationFn(data)
            }, UPDATE_COURSE_GAP * 1000)
            timerMap.set(timer, curItem.courseName)
        }

        // 更新页面展示的进度
        async function updateTable(){
            let timer = setInterval(async ()=> {
                const list = await getList()
                // 新完成度 百分比
                $('.operateBox .table .newPercent').text(function(index, currentText) {
                    const item = list[index]
                    const beforeText = `${item.coursewareLearningProgress}`
                    if(currentText && beforeText != currentText){
                        // 增加对比样式
                        const node = $('.operateBox .table .newPercent')[index]
                        $(node).css({
                            'background-color': 'gold'
                        })
                    }
                    return beforeText || currentText;
                });
                // 新分钟数
                $('.operateBox .table .newMinute').text(function(index, currentText) {
                    const item = list[index]
                    const beforeText = `${splitPlayTime(item.realCoursewarePlayTime).finished}`
                    if(currentText && beforeText != currentText){
                        // 增加对比样式
                        const node = $('.operateBox .table .newMinute')[index]
                        $(node).css({
                            'background-color': 'green'
                        })
                    }
                    return beforeText || currentText;
                });
            }, UPDATE_PROGRESS_GAP * 1000)
            timerMap.set(timer, new Date())
        }

        // 事件监听
        function addListening(){
            $('.operateBox .opt_btn').on("click", async function(e){
                const index = e.target.dataset.index
                const curItem = courseList[index]
                await updateCourse(curItem)
                updateTable()
            });
            $('.operateBox .inputBox input').on("input", async function(e){
                const value = +e.target.value
                const name = e.target.dataset.name
                switch (name) {
                    case 'list':
                        UPDATE_PROGRESS_GAP = value || UPDATE_PROGRESS_GAP
                        break;
                    case 'course':
                        UPDATE_COURSE_GAP = value || UPDATE_COURSE_GAP
                        break;
                    case 'step':
                        STUDY_DURATION = value || STUDY_DURATION
                        break;
                    default:
                        break;
                }
            });

            $('#oneKeyStart').on("click",function(){
                timerMap.forEach((item,key) => {
                    clearInterval(key)
                })
                timerMap = new Map()
                onFastStart()
            })

        }

        // 一键开刷
        function onFastStart(){
            // 开刷前清空定时器
            timerMap.forEach((item,key) => {
                clearInterval(key)
            })
            timerMap = new Map()

            let taskNum = 0
            for(const item of courseList){
                // 未完成的才启动
                const progress = item.coursewareLearningProgress.slice(0, -1)
                if(progress < 100){
                    taskNum++
                    updateCourse(item)
                }
            }
            updateTable()
            $('#tip1').text(`每隔${UPDATE_PROGRESS_GAP}秒自动更新列表,每隔${UPDATE_COURSE_GAP}秒提交课程,跨度为${STUDY_DURATION}秒`)
            $('#tip2').text(`,已启动${taskNum}个任务,正在更新···`)

        }

        // 程序运行入口
        async function main (){
            await getList()
            makeLayout()
            addListening()
        }
        // 稍微等一下主页面渲染出来再加载脚本
        setTimeout(()=>{
            main()
        },2000)

    })

})();