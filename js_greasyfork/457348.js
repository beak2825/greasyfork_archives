// ==UserScript==
// @name         电大中专-自动看课
// @namespace    oneMiku
// @email        704191499@qq.com
// @version      1.3.2
// @license      MIT
// @description  中央广播电视中等专业学校-电大中专，自动将所待学习课程全部看完！老平台会跳过某些视频，不用担心，这是因为本脚本是优先完成进度最少的。感谢您的支持，作者QQ704191499，欢迎讨论、报错、合作！
// @author       oneMiku
// @match        *://*.ouchn.edu.cn/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/457348/%E7%94%B5%E5%A4%A7%E4%B8%AD%E4%B8%93-%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/457348/%E7%94%B5%E5%A4%A7%E4%B8%AD%E4%B8%93-%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE.meta.js
// ==/UserScript==

'use strict';

const _$ = jQuery.noConflict(true);

/**
 * 启动~~~
 */
(function () {

    //老平台
    if (location.host === 'old-zzx.ouchn.edu.cn') {

        //选择进度最少的课程
        function filterMin() {
            let min = 100;
            //直接找到进度元素，取进度非100%且进度最少的第一个元素
            return _$(".jdb").filter((i, o) => {
                let num = Number.parseInt(o.innerText)
                min = min > num ? num : min
                return num !== 100
            }).filter((i, o) => Number.parseInt(o.innerText) === min).first()
        }

        //模拟点击定时器
        setInterval(() => {
            if (/*课程界面*/location.href.indexOf("courseList") !== -1) {
                //点图片进入不需要二次确认
                filterMin().parent().parent().parent().find("img")[0].click()
            } else if (/*章节界面*/location.href.indexOf("courseInfo") !== -1) {
                //直接进入
                filterMin()[0].click();
            } else if (/*视频界面*/location.href.indexOf("sectionVideo") !== -1) {
                //如果当前视频已经看完则跳到没看完的视频，如果当前课程的视频已经全部看完则回到课程选择界面
                if (_$(".setionItem.active .jdb").eq(0).text() === "100%") {
                    let o = filterMin()
                    if (o.length === 1) {
                        o[0].click()
                    } else location = "https://old-zzx.ouchn.edu.cn/edu/public/student/#/courseList/1"
                }
                //刷新页面可以自动播放，根本停不下来！！
                let video = _$("video")[0];
                //静音播放
                video.muted = true
                //根本不能暂停哈哈哈
                if (video.paused) video.play();
                //如果下一课按钮出现则模拟点击
                let btns = _$(".nextbtn.btn");
                if (btns.length !== 0) btns[0].click()
            }
        }, 2000)

        let time

        //防止卡停定时器
        setInterval(() => {
            if (/*视频界面*/location.href.indexOf("sectionVideo") !== -1) {
                let video = _$("video")[0];
                //播放状态下十秒不动则刷新页面
                if (!video.paused) {
                    if (time === video.currentTime) location.reload();
                    else time = video.currentTime
                }
            }
        }, 10000)

    }

    //新平台
    else if (location.host === 'zydz-menhu.ouchn.edu.cn') {

        let time = 0

        //模拟点击定时器
        setInterval(() => {
            if (/*课程界面*/location.href.indexOf("myCourse/index") !== -1) {
                //找到进度元素，取进度非100%的第一个元素
                _$("div.card_content > div:nth-child(3) > div:nth-child(1) > span:nth-child(2)")
                    .filter((i, o) => o.innerText !== "100%")
                    //跳过线下课程
                    .filter((i, o) => _$(o).parent().parent().parent().parent().find("div.card_see > span").text() === "去学习")
                    .first().parent().parent().parent().parent().find("img").click()
            } else if (/*章节界面*/location.href.indexOf("myCourse/study") !== -1) {
                //如果没有章节（正在加载）则跳过本轮
                if (_$("div.el-collapse>div").length === 0) return
                //找到进度元素，取未完成的第一个元素,否则返回课程选择界面
                let item = _$("div.content_vice > span").filter((i, o) => o.innerText !== "100%" && o.innerText !== "章节测试：合格").first()
                if (item.length !== 0) item.click()
                else _$("div.goBack").first().click()
            } else if (/*做题界面*/location.href.indexOf("myExamDetails/examQuestion") !== -1) {
                //保存了答案就填写，否则直接交卷跳转到答案界面
                let answers = JSON.parse(localStorage.getItem("answers"))
                if (answers) {
                    _$("div.everyQuest").each((i, o) => {
                        let title = _$(o).find("div.everyTopic > div")[0].innerText
                        _$(o).find("div.optionList > div > span").each((i2, o2) => {
                            if (answers[title] === o2.innerText) _$(o2).click()
                        })
                    })
                    //填写后删除答案，避免故障
                    localStorage.removeItem("answers")
                }
                //交卷
                _$("div.everyResultWrap > button").first().click()
                //二次确认交卷和查看试卷
                _$("button.el-button.el-button--primary.el-button--large.determine").first().click()
            } else if (/*答案界面*/location.href.indexOf("myExamDetails/testPaper") !== -1) {
                //保存答案后继续作答
                let answers = {}
                _$("div.everyQuest").each((i, o) => {
                    answers[
                        _$(o).find("div.everyTopic > div")[0].innerText
                        ] = _$(o).find("div.rightAndWrong > span:nth-child(2)")[0].innerText.replace("正确答案：", "")
                })
                //保存答案
                localStorage.setItem(
                    "answers",
                    JSON.stringify(answers)
                )
                //回到章节列表继续选择跳转
                _$("div.goBack").first().click()
            } else if (/*视频界面*/location.href.indexOf("myCourseDetails/vidoStudy") !== -1) {
                //获取视频元素
                let video = _$("video")[0];
                //静音播放
                video.muted = true
                //根本不能暂停哈哈哈
                if (video.paused) video.play();
                //如果当前视频已经看完（从头开始）则回到章节列表继续选择跳转
                if (time > video.currentTime) {
                    time = 0
                    _$("div.goBack").first().click()
                } else time = video.currentTime
            }
        }, 2000)

    }

})();