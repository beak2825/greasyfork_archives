

    // ==UserScript==
    // @name         网课学习
    // @namespace    http://tampermonkey.net/
    // @version      0.2
    // @description  hello world!
    // @author       Ymob
    // @match        https://kc.jxjypt.cn/*
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442966/%E7%BD%91%E8%AF%BE%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/442966/%E7%BD%91%E8%AF%BE%E5%AD%A6%E4%B9%A0.meta.js
    // ==/UserScript==
     
    (function () {
        'use strict';
     
        /**
         * 看学习视频
         */
        class WatchVideo {
            /**
             * 是否跳过视频，直接答题
             */
            bug
     
            /**
            * 章列表
            */
            chapterList
     
            /**
             * 章索引
             */
            chapterIndex
     
            /**
             * 节索引
             */
            sectionIndex
     
            /**
             * 循环查找控制器
             */
            ctl
     
            /**
            * 播放进度监听间隔
            */
            interval
     
            /**
             *
             */
            constructor() {
                this.bug = false
                this.chapterList = []
                this.chapterIndex = this.sectionIndex = -1
                this.ctl = true
                this.interval = 10000
                setTimeout(() => {
                    if (confirm('开始自动学习？')) {
                        // this.bug = confirm('是否直接答题？')
                        this.start()
                    }
                }, 2000);
            }
     
            /**
             * 开始学习
             */
            start() {
                document.querySelectorAll('.course-l .course-list-txt').forEach(item => {
                    let chapter = {
                        node: item,
                        name: item.querySelector('dt').innerText.trim(),
                        sectionList: []
                    }
     
                    item.querySelectorAll('dd').forEach(section => {
                        chapter.sectionList.push({
                            node: section,
                            name: section.innerText.trim(),
                            done: section.querySelector('i').classList.contains('z-icon-red')
                        })
                    })
     
     
                    this.chapterList.push(chapter)
                });
                this.find()
            }
     
            /**
             * 查找待学习的课程
             */
            find() {
                this.ctl = true
                this.chapterIndex = this.sectionIndex = -1
                this.chapterList.every((chapter, chapterIndex) => {
                    chapter.sectionList.every((section, sectionIndex) => {
                        if (!section.done) {
                            this.chapterIndex = chapterIndex
                            this.sectionIndex = sectionIndex
                        }
                        return this.ctl = section.done
                    })
                    return this.ctl
                })
     
                if (this.sectionIndex == -1) {
                    alert('本科目已经完成学习')
                    return
                }
     
                // 选择章节
                this.currentChapter().node.querySelector('dt').click()
                this.currentSection().node.click()
     
                if (this.bug) {
                    setTimeout(() => {
                        this.anwser()
                    }, 1000);
                } else {
                    setTimeout(() => {
                        this.play()
                    }, 2000);
                }
            }
     
            /**
             * 当前章
             */
            currentChapter() {
                return this.chapterList[this.chapterIndex]
            }
     
            /**
             * 当前节
             */
            currentSection() {
                return this.currentChapter().sectionList[this.sectionIndex]
            }
     
     
            /**
             * 播放视频学习
             */
            play() {
                console.log('播放课程，开始学习 ' + this.currentSection().name)
                let _videoNode = document.querySelector('#video-content video')
                _videoNode.play()
     
                // 设置播放进度
                let lastWatchText = document.querySelector('#lastWatch').innerText.match(/(\d+分\d+)|\d+/)
                if (lastWatchText != null) {
                    let lastWatch = lastWatchText[0].split('分')
                    _videoNode.currentTime = (Number.parseInt(lastWatch[lastWatch.length - 1]) | 0) + (Number.parseInt(lastWatch[lastWatch.length - 2]) | 0) * 60
                    // console.log('设置播放进度', lastWatch)
                }
     
                // 视频时常
                let _duration = _videoNode.duration
     
                // console.log('设置播放音量')
                _videoNode.volume = 0.05
     
                // 提前选择答案
                document.querySelector('.sub-answer .m-question-option').click()
     
                // 最短播放时长
                let _minText = document.querySelector('#tips').innerText.match(/(\d+分\d+)|\d+/)[0].split('分')
                let _minTime = (Number.parseInt(_minText[_minText.length - 1]) | 0) + (Number.parseInt(_minText[_minText.length - 2]) | 0) * 60
     
                _minTime = _minTime > _duration ? _duration : _minTime
     
                // 监听播放进度
                let _index = setInterval(() => {
                    if (_videoNode.currentTime >= _minTime) {
                        clearInterval(_index)
                        console.log('暂停播放，完成学习 ' + this.currentSection().name)
                        _videoNode.pause()
                        this.anwser()
                    } else {
                        // console.log('学习未完成 ' + _videoNode.currentTime)
                    }
                }, this.interval)
            }
     
            anwser() {
                window.PageVars.watchTime = 501
                new Anwser(document.querySelector('.m-question'))
                setTimeout(() => {
                    this.chapterList[this.chapterIndex].sectionList[this.sectionIndex].done = true
                    this.find()
                }, 2000);
            }
        }
     
        /**
         * 课程作业
         */
        class Task {
            /**
             * 问题列表
             */
            questionList
     
            /**
             * 课程列表
             */
            courseList
     
            courseIndex
     
            constructor() {
                this.questionList = []
                this.courseList = []
                this.courseIndex = -1
            }
            /**
             * 获取课程列表
             */
            init() {
                setTimeout(() => {
                    if (confirm('开始自动学习')) {
                        document.querySelectorAll('.zt.zt-goto').forEach(item => {
                            if (item.innerHTML.trim() == '开始答题') {
                                this.courseList.push({
                                    node: item,
                                    done: false,
                                })
                            }
                        })
     
                        console.log('共 ' + this.courseList.length + ' 节课程作业')
                        this.findCourse()
                    }
                }, 1000);
            }
     
            /**
             * 选择作业
             * @param {*} index
             */
            findCourse(index = 0) {
                if (index < this.courseList.length) {
                    if (this.courseList[index].done) {
                        this.findCourse(++index)
                    } else {
                        let _time = (new Date).getTime()
                        let _s = this.courseList[index].node.search
                        // 打印名称
                        console.log('课堂作业：' + this.courseList[index].node.parentNode.parentNode.firstElementChild.innerText)
                        // 设置任务
                        localStorage.setItem(_s, '')
                        this.courseList[index].node.click()
                        let _index = setInterval(() => {
                            if (localStorage.getItem(_s) == 'true') {
                                clearInterval(_index)
                                console.log('已完成，耗时：' + ((new Date).getTime() - _time) / 1000 + '秒 \r\n')
                                this.courseList[index].done = true
                                localStorage.removeItem(_s)
                                this.findCourse(++index)
                            }
                        }, 10000);
                    }
                } else {
                    alert('已完成全部课程作业')
                }
            }
     
            /**
             * 开始答题
             */
            start() {
                setTimeout(() => {
                    if (confirm('开始自动答题？')) {
                        this.questionList = document.querySelectorAll('#questionModule>ul>li')
                        console.log('共' + this.questionList.length + '道题')
                        this.anwser()
                    }
                }, 800);
            }
     
            /**
             * 开始答题
             */
            anwser(index = 0) {
                if (index < this.questionList.length) {
                    let t = this.random(5000, 12000)
                    setTimeout(() => {
                        new Anwser(this.questionList[index])
                        this.anwser(index + 1)
                        console.log('耗时：' + t)
                    }, t);
                } else {
                    console.log('交卷')
                    setTimeout(() => {
                        document.querySelector('#btn__submit').click()
                        setTimeout(() => {
                            window.close()
                            localStorage.setItem(location.search, 'true')
                        }, 2000)
                    }, 1000)
                }
            }
     
            random(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }
        }
     
        /**
         * 答题
         */
        class Anwser {
            /**
             * 问题节点
             */
            node
     
            /**
             * 是否是选择题（不是简单题）
             */
            isSelect
     
            /**
             *
             * @param {*} node
             */
            constructor(node = document) {
                this.node = node
                let tempNode = node.querySelector('.m-question .subject-con')
                if (tempNode != null) {
                    this.isSelect = !tempNode.classList.contains('jiandati')
                } else {
                    this.isSelect = true
                }
                this.anwser()
            }
     
     
            /**
             * 查找答案
             */
            anwser() {
                let anwserNode = this.node.querySelector('.da-list .right') || this.node.querySelector('.da-list .wenzi')
     
                let anwser = anwserNode.innerText.trim()
                console.log('************************')
                console.log(this.node.querySelector('.sub-dotitle').innerText.replace('\n', '、'))
                console.log('答案：' + anwser)
                if (this.isSelect) {
                    this.node.querySelector('dd[data-value="' + anwser + '"]').click()
                } else {
                    this.node.querySelector('textarea').value = anwser
                }
            }
        }
     
        function init() {
     
            let pathname = location.pathname
            switch (pathname) {
                // 看视频学习
                case '/classroom/index':
                    new WatchVideo
                    break
                // 课程作业-列表
                case '/classroom/exercise':
                    (new Task).init()
                    break
                // 课程作业-详情
                case '/paper/start':
                    (new Task).start()
                    break
                default:
                    break
            }
        }
     
        init()
    })();

