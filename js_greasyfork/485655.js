// ==UserScript==
// @name         Q学友刷课
// @namespace    https://www.qxueyou.com/
// @version      2024-01-15
// @description  Q学友刷课脚本，人脸识别后，点击刷课即可开始
// @author       Kane Simmons
// @match        https://www.qxueyou.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485655/Q%E5%AD%A6%E5%8F%8B%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/485655/Q%E5%AD%A6%E5%8F%8B%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let interval = null // interval定时器
    let timeout = null // setTimeout定时器
    const courses = new Map(); // 课程Map {courseDom: 课程dom, rateDom: 课程进度条dom, rate: 课程完成度, playTimes: 播放次数}
    let runningTime = 0 // 运行时长(s)
    let processing = false // 正在答题
    let currentPlayingIndex = 0 // 当前播放的课程索引
  
    /** 更新课程进度 */
    const updateCourseRate = (isInit = false) => {
        const courseDoms = document.getElementsByClassName('m-slide slipDel')
        if (isInit) {
            // 初始化课程进度
            for (let i = 0; i < courseDoms.length; i++) {
                const courseDom = courseDoms[i].querySelector('.v-list-item--link');
                const rateDom = courseDoms[i].getElementsByClassName('progress col col-3')[0]
                const rate = parseInt(rateDom.querySelector('div').getAttribute('aria-valuenow'), 10);
                courses.set(i, { index: i + 1, courseDom, rateDom, rate, playTimes: 0 });
            }
            return;
        }
        // 更新进度到courses的map中
        const rateDoms = Array.from(courses.values()).map(item => item.rateDom)
        for (let i = 0; i < rateDoms.length; i++) {
            const rate = parseInt(rateDoms[i].querySelector('div').getAttribute('aria-valuenow'), 10);
            courses.get(i).rate = rate;
        }
    }
  
    /** 更新当前播放课程索引 */
    const updateCurrentPlayingIndex = () => {
        const courseDoms = Array.from(courses.values()).map(item => item.courseDom)
        currentPlayingIndex = courseDoms.findIndex(item => item.classList.contains('grey'))
    }
  
    /** 检测视频是否异常,并切换到未完成的科目 */
    const checkVideoStatus = () => {
        // 检测视频是否异常
        const isLoadingShow = window.getComputedStyle(document.querySelector('.vjs-loading-spinner')).getPropertyValue('display') === 'block'
        if (isLoadingShow) {
            console.warn(`当前视频(第${currentPlayingIndex + 1}集)异常`)
            switchToUnwatchCourse()
        }
        // 检测当前播放课程是否完成
        if (courses.get(currentPlayingIndex).rate === 100) {
            console.log(`第${currentPlayingIndex + 1}集课程已完成`)
            switchToUnwatchCourse()
        }
    }
  
    /** 切换到未完成的科目 */
    const switchToUnwatchCourse = () => {
        let minPlays = Infinity;
        let minPlayIndex = -1;
        let arePlayTimesEqual = true;
        let firstRateUnder100Index = -1;
  
        // 找到 rate < 100 的课程中 playTimes 最少的课程
        courses.forEach((course, index) => {
            if (course.rate < 100) {
                if (firstRateUnder100Index === -1) {
                    firstRateUnder100Index = index;
                }
  
                if (course.playTimes < minPlays) {
                    minPlays = course.playTimes;
                    minPlayIndex = index;
                    arePlayTimesEqual = false;
                } else if (course.playTimes > minPlays) {
                    arePlayTimesEqual = false;
                }
            }
        });
  
        // 如果所有 rate < 100 的课程的 playTimes 都相等，则找到第一个 rate < 100 的课程
        if (arePlayTimesEqual && firstRateUnder100Index !== -1) {
            minPlayIndex = firstRateUnder100Index;
        }
  
        // 点击选定的课程并更新 playTimes
        if (minPlayIndex !== -1) {
            // 如果只剩一项 rate < 100 的课程，则先点击别的项目
            let RateUnder100Subjects = []
            RateUnder100Subjects = Array.from(courses.values()).filter(item => item.rate < 100)
            if (RateUnder100Subjects.length === 1) {
                const courseDoms = Array.from(courses.values()).map(item => item.courseDom)
                let otherIndex = minPlayIndex + 1 >= courseDoms.length ? 0 : minPlayIndex + 1;
                courseDoms[otherIndex].click();
                console.log(`只剩一项,先点击第${otherIndex}集`)
            }
  
            const selectedCourse = courses.get(minPlayIndex);
            selectedCourse.courseDom.click();
            currentPlayingIndex = minPlayIndex;
            selectedCourse.playTimes++;
  
            // 输出播放次数和切换信息
            console.table(Array.from(courses.values()).map(({ index, rate, playTimes }) => ({ '课程序号': index, '课程完成度（%）': rate, '播放次数': playTimes })));
            console.log(`已切换至第${selectedCourse.index}集`)
  
        }
    }
  
    /** 检查问题弹窗是否出现，出现则回答问题 */
    const checkQuestion = () => {
        const modelDom = document.querySelector('.overlay')
        if (!modelDom || processing) return // 未发现问题弹窗或正在处理不继续
  
        console.log('发现问题弹窗！');
        answerQuestions()
    }
  
    /** 回答弹窗的问题 */
    const answerQuestions = () => {
        processing = true
        const modelDom = document.querySelector('.overlay')
        const bodyDoms = modelDom.querySelectorAll('div')
        let randomTime = (Math.floor(Math.random() * 60) + 1); // 生成 60s 的随机数
        if(bodyDoms.length) {
            const questionDom = bodyDoms[1]
            const questionResult = eval(questionDom.innerText.split('=')[0])
            console.log(`答案是:${questionResult}, 将在${randomTime}s后选择答案`)
            timeout = setTimeout(() => {
                const answersDoms = bodyDoms[5].querySelectorAll('.v-radio')
                answersDoms.forEach((item) => {
                    const answer = item.innerText.split('.')[1] * 1
                    const answerDom = item.querySelector('.v-label')
                    if (answer === questionResult) {
                        answerDom && answerDom.click()
                        const confirmDom = document.getElementsByClassName('white--text mb-2 v-btn v-btn--block v-btn--contained theme--light v-size--small')[0]
                        confirmDom && confirmDom.click()
                        processing = false
                        console.log('已选择正确答案');
                    }
                })
            }, randomTime)
        }
    }
  
    /** 检查是否全部课程已完成 */
    const checkAllCompleted = () => {
        const isFinished = Array.from(courses.values()).findIndex(item => item.rate < 100) === -1
        if (isFinished) {
            console.log(`%c全部课程已完成！总用时：${runningTime / 60 / 60}小时`, 'color: green; font-weight: bold;');
            alert(`全部课程已完成！总用时：${(runningTime / 60 / 60).toFixed(2)}小时`)
            clearInterval(interval)
            clearTimeout(timeout)
        } else {
            console.log('正在运行...')
            const startBtn = document.querySelector('#startBtn')
            const restRate = Array.from(courses.values()).reduce((acc, item) => acc + item.rate, 0) / 8
            startBtn.innerText = `刷课中,已运行${runningTime / 60}分钟,已完成${restRate}%`;
            if (restRate > 95) {
              // 整体进度大于95%时，点击学习进度按钮，通过网络请求获取真正进度
              const updateRateDom = document.getElementsByClassName('m-slide__del m-slide__del-red')[0]
              updateRateDom && updateRateDom.click()
              const checkModel = setInterval(() => {
                  const confirmDom = document.getElementsByClassName('v-btn v-btn--contained theme--light v-size--default primary')[0]
                  if (confirmDom) {
                    confirmDom.click()
                    clearInterval(checkModel)
                  }
              }, 100)
            }
        }
    }
  
    /** 每秒执行 */
    const mainProcess = () => {
        interval = setInterval(() => {
            try {
  
                runningTime++
  
                // 每分钟
                if (runningTime % 60 ===  0) {
                    // 更新课程进度
                    updateCourseRate()
                    // 每分钟都检查下视频是否异常
                    checkVideoStatus()
                    // 检查是否全部课程已完成
                    checkAllCompleted()
                }
  
                // 每45分钟
                if ((runningTime % (60 * 45) === 0) && !processing) {
                    console.log('每45分钟切换一次课程')
                    switchToUnwatchCourse()
                }
  
                // 更新当前播放课程索引
                updateCurrentPlayingIndex()
                // 检查问题弹窗
                checkQuestion()
  
            } catch (e) {
                console.error('程序报错了！！已停止检查弹窗', e)
                clearInterval(interval)
                clearTimeout(timeout)
            }
        }, 1000)
    }
  
    /** 生成开始按钮 */
    const domInit = () => {
        // 创建一个按钮元素
        var button = document.createElement("button");
  
        // 设置按钮的文本内容
        button.innerText = "开始刷课";
  
        // 设置按钮的 ID
        button.id = "startBtn"; // 添加 ID
  
        // 设置按钮的点击事件处理程序
        function clickHandler() {
            startProgram()
            button.innerText = "刷课中";
            button.style.backgroundColor = "#409eff";
            button.style.borderColor = "#409eff";
            // 移除按钮的点击事件处理程序
            button.removeEventListener("click", clickHandler);
        };
  
        // 添加按钮的点击事件处理程序
        button.addEventListener("click", clickHandler);
  
  
        // 设置按钮的样式
        button.style.cssText = "position: fixed; bottom: 10%; left: 50%; transform: translateX(-50%); padding: 12px 23px;color: #fff; background-color: #67c23a; border-color: #67c23a;";
  
        // 将按钮直接添加到 body 元素中
        document.body.appendChild(button);
    }
  
    /** 启动程序 */
    const startProgram = () => {
  
        mainProcess()
  
        updateCourseRate(true)
  
        checkAllCompleted()
  
        switchToUnwatchCourse()
    }
  
    domInit()
  })();