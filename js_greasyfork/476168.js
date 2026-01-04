// ==UserScript==
// @name         学堂在线刷课
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  该脚本可以完成学堂在线课程中的作业，视频以及图文
// @match        https://www.xuetangx.com/*
// @require      https://code.jquery.com/jquery-3.7.1.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/476168/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/476168/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
            'use strict';
            // DOM添加
            let div = `
            <div id="main">
                <div class="a-header">
                    tips:该脚本为个人开发，可以刷图文，视频以及作业，
                    目前作业功能需要先用小号收集题库才能正常使用
                    部分用户答案为空，点击清除缓存后重新收集即可
                    收集答案期间请勿离开或缩小此页面(2025.7.28作者陨落了，开始上班，有好心人可以拿去二开维护)
                </div>
                <div class="a-table">
                    <table>
                        <thead>
                            <tr>
                                <th><button class="reading">开始刷课</button></th>
                                <th><button class="collect">开始收集</button></th>
                            </tr>
                            <tr>
                                <th><button class="random">随机答题</button></th>
                                <th><button class="clear running">清除缓存</button></th>
                            </tr>
                            <tr>
                                <th>题目</th>
                                <th>答案</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
            `
            document.querySelector("body").insertAdjacentHTML('beforeend', div)
            let main = document.querySelector('#main')

            function addConfigBoxStyle () {
                // 添加样式
                let style = document.createElement('style')
                style.type = "text/css";

                let styleString = `
                * {
                    padding: 0;
                    margin: 0;
                }

                #main {
                    position: absolute;
                    right: 100px;
                    top: 150px;
                    width: 300px;
                    z-index: 999;
                    background-color:rgb(0 118 128 / 30%);
                }

                .a-header {
                    text-align: center;
                    height: 100px;
                    font-size: 14px;
                    line-height: 20px;
                    background-color: green;
                    color: #fff;
                    padding:5px;
                }

                .a-table tbody,
                .a-table tr {
                    display: block;
                    width: 300px;
                }

                .a-table tbody {
                    height: 270px;
                    overflow-y: scroll;
                    -ms-overflow-style: none;
                }

                .a-table td,
                .a-table th {
                    text-align: center;
                    width: 150px;
                }

                .a-table button {
                    padding: 10px;
                    cursor: pointer;
                    border-radius: 15%;
                    color: #fff;
                    font-size: 15px;
                    width: 90px;
                    text-align: center;
                }

                .reading,
                .collect,
                .random {
                    background-color: rgb(153, 58, 58);
                }

                .disabled {
                    background-color: gray !important;
                    cursor: not-allowed !important;
                }

                .running {
                    background-color: rgb(46, 157, 103);
                }
                `
                let text = document.createTextNode(styleString)
                style.appendChild(text);
                document.getElementsByTagName('head')[0].appendChild(style);
            }
            addConfigBoxStyle()


            // 添加表格列表
            function rander (timu, anwers) {
                let tr = `
                <tr>
                    <td>${timu}</td>
                    <td>${anwers}</td>
                </tr>
                `
                document.querySelector('#main .a-table table tbody').insertAdjacentHTML('beforeend', tr)
            }

            // 控制脚本页面样式
            function toggleClassBtn (config, startE, disE) {
                if (startE == 'reading') {
                    config ? $(`.${startE}`).text('停止') : $(`.${startE}`).text('开始刷课')
                } else {
                    config ? $(`.${startE}`).text('停止') : $(`.${startE}`).text('开始收集')
                }
                $(`.${startE}`).toggleClass('running')
                $(`.${disE}`).attr('disabled', config).toggleClass('disabled')
            }

            // 创建对象
            function anw (type, timu, an) {
                this.type = type;
                this.timu = timu;
                this.anwers = an;
            }

            // 视频脚本
            function startVideo () {
                let video = $("video")[0];
                let staNow = $(".play-btn-tip");
                if (staNow.text() == "播放") {
                    $(".xt_video_player_mask").click();
                }
                let c = video.currentTime;
                let d = video.duration;
                //不想关闭声音可以把此行代码删掉
                soundClose();
                speed();
                //视频播放进度超过95%跳转下一节视频
                if ((c / d) > 0.95) {
                    $(".next").click();
                    console.log("跳转到下一节");
                    console.log("本节观看百分比" + c / d);
                }
            }

            //关闭视频声音
            function soundClose () {
                let sound = $(".xt_video_player_common_icon_muted");
                if (sound.length == 0) {
                    $(".xt_video_player_common_icon").click();
                }
            }
            //播放速度2.0
            function speed () {
                let speed = $(".xt_video_player_common_list");
                let speedChild = speed.children()[0];
                let gp = "wi";
                speedChild.click();
            }

            // 刷附件
            let word = function () {
                let next = document.querySelector('.btnCon button');
                let click = new Event('mouseup');
                next.dispatchEvent(click);
                if ($(next).text() == '我已看完') {
                    $('.next').click()
                }
            }

            // 刷题
            function automaticAnswers (tiku) {
                let click = new Event('mouseup');
                let timu = document.querySelector('.fuwenben').innerText;
                let next = document.querySelector('.btnCon').querySelectorAll('button')[1];
                let total = document.querySelector('.total').innerHTML.substring(1, 3);
                let curent = document.querySelector('.curent').innerHTML;
                let delay = 1000; // 延时1秒
                let anw = tiku.find(item => item.timu == timu)
                // 判断题型
                if (anw == undefined) {
                    $('.next').click()
                }
                if (anw.type == 1) {
                    // 选择题
                    anw.anwers.forEach(item => {
                        let num = null
                        switch (item) {
                            case 'A':
                                num = 0
                                break;
                            case 'B':
                                num = 1
                                break;
                            case 'C':
                                num = 2
                                break;
                            case 'D':
                                num = 3
                                break;
                            case 'E':
                                num = 4
                                break;
                            case 'F':
                                num = 5
                                break;
                            case 'G':
                                num = 6
                                break;
                            default:
                                break;
                        }
                        let anwersEven = document.querySelector('.answerList').querySelectorAll('span')[num];
                        anwersEven.click()
                    });
                    rander(anw.timu, anw.anwers)
                } else if (anw.type == 2) {
                    // 判断题
                    let anwersEven = document.querySelector('.answerList').querySelectorAll('span')[anw.anwers];
                    anwersEven.click()
                    rander(anw.timu, anw.anwers)
                } else {
                    // 填空题
                    rander(anw.timu, anw.anwers)
                    $('.next').click()
                }



                // 提交并跳转下一题
                for (let i = 0; i < 2; i++) {
                    // 延时一段时间后模拟点击下一个按钮
                    setTimeout(function () {
                        next.dispatchEvent(click);
                    }, delay * (i + 1));
                }

                // 跳转下一节
                if (total == curent) {
                    setTimeout(function () {
                        $('.next').click()
                    }, 1500)
                }
            }

            // 开始刷课
            function startClass () {
                // 判断页面类型
                let types = $('.t1').eq(0).text();
                if (types == '视频') {
                    startVideo()
                } else if (types == '附件') {
                    word()
                } else if ($('.answerList').length != 0) {
                    let tiku = JSON.parse(localStorage.getItem('anwers'))
                    if (!tiku) {
                        $('.next').click()
                    }
                    automaticAnswers(tiku)
                }
                else {
                    console.log("未知错误！");
                }
            }

            // 开始收集答案

            // 选择题
            function choiceQuestions () {
                let anwers = [];
                let timu = document.querySelector('.fuwenben').innerText
                let anwersEven = document.querySelectorAll('.answerList')[1].querySelectorAll('span');
                for (let j = 0; j < anwersEven.length; j++) {
                    anwers.push(anwersEven[j].innerText);
                }
                if (anwers.length === 0) {
                    alert('答案收集为空，请停止收集清空缓存后重新收集')
                    return
                }
                let ontime = new anw(1, timu, anwers);
                return ontime
            }

            // 判断题
            function judgmentQuestions () {
                let anwers = null;
                let timu = document.querySelector('.fuwenben').innerText
                let anwersEven = document.querySelectorAll('.answerList')[1].querySelector('span');
                if (anwersEven.className.indexOf('true') != -1) {
                    anwers = 0;
                } else {
                    anwers = 1;
                }
                if (anwers.length === 0) {
                    alert('答案收集为空，请停止收集清空缓存后重新收集')
                    return
                }
                let ontime = new anw(2, timu, anwers);
                return ontime
            }

            // 填空题
            function textQuestions () {
                let anwersEven = document.querySelector('.answerList').querySelectorAll('.rightAnswer');
                let anwers = [];
                let timu = document.querySelector('.fuwenben').innerText
                for (let i = 0; i < anwersEven.length; i++) {
                    anwers.push(anwersEven[i].innerHTML.substring(5));
                }
                if (anwers.length === 0) {
                    alert('答案收集为空，请停止收集清空缓存后重新收集')
                    return
                }
                let ontime = new anw(3, timu, anwers);
                return ontime
            }

            // 控制跳转下一题
            let Next = function () {
                let next = document.querySelector('.btnCon span>span').querySelector('button');
                let click = new Event('mouseup');
                next.dispatchEvent(click);
            }

            function collectAnwers () {
                // 学堂在线答案收集
                let anwersLists = JSON.parse(localStorage.getItem('anwers')) || [];  // 获取答案列表
                let total = document.querySelector('.total').innerHTML.substring(1, 3);
                let curent = document.querySelector('.curent').innerHTML;
                let typeEven = document.querySelector('.question p').innerText;
                let right = typeEven.indexOf('(');
                let type = typeEven.substring(1, right - 1);
                // 获取答案
                if (type == '单选题' || type == '多选题') {
                    anwersLists.push(choiceQuestions());
                } else if (type == '判断题') {
                    anwersLists.push(judgmentQuestions());
                } else if (type == '填空题') {
                    anwersLists.push(textQuestions());
                } else {
                    console.log('错误信息');
                }
                if (total == curent) {
                    setTimeout(function () {
                        $('.next').click()
                    }, 1500)
                }
                localStorage.setItem('anwers', JSON.stringify(anwersLists))
                Next(); // 跳转下一题
            }

            // 随机答题
            function randomAnwers () {
                let click = new Event('mouseup');
                let next = document.querySelector('.btnCon').querySelectorAll('button')[1];
                let total = document.querySelector('.total').innerHTML.substring(1, 3);
                let curent = document.querySelector('.curent').innerHTML;
                let delay = 1000; // 延时1秒
                let typeEven = document.querySelector('.question p').innerText;
                let right = typeEven.indexOf('(');
                let type = typeEven.substring(1, right - 1);
                // 获取答案
                if (type == '单选题' || type == '多选题') {
                    let anwersEven = document.querySelector('.answerList').querySelectorAll('span')[0];
                    anwersEven.click()
                } else if (type == '判断题') {
                    let anwersEven = document.querySelector('.answerList').querySelectorAll('span')[0];
                    anwersEven.click()
                } else {
                    document.querySelector('.next').click()
                }
                // 提交并跳转下一题
                for (let i = 0; i < 2; i++) {
                    // 延时一段时间后模拟点击下一个按钮
                    setTimeout(function () {
                        next.dispatchEvent(click);
                    }, delay * (i + 1));
                }
                // 跳转下一节
                if (total == curent) {
                    setTimeout(function () {
                        $('.next').click()
                    }, 1500)
                }
            }
            // 添加点击事件
            let reading = false
            let collect = false
            let random = false
            let startReading, startCollect, startRandom;   // 添加定时器
            $('.reading').click(function () {
                reading = !reading
                toggleClassBtn(reading, 'reading', 'collect')
                if (reading) {
                    // 开始刷课事件
                    clearInterval(startReading) // 重置定时器
                    startReading = setInterval(startClass, 2000)
                } else {
                    // 停止事件
                    clearInterval(startReading)
                }
            })

            $('.collect').click(function () {
                collect = !collect
                toggleClassBtn(collect, 'collect', 'reading')
                if (collect) {
                    console.log(localStorage.getItem('anwers'))
                    clearInterval(startCollect) // 重置定时器
                    // 开始收集题目
                    startCollect = setInterval(collectAnwers, 2000)
                } else {
                    // 停止事件
                    clearInterval(startCollect)
                }
            })

            $('.random').click(function () {
                random = !random
                if (random) {
                    clearInterval(startRandom) // 重置定时器
                    // 开始随机答题
                    startRandom = setInterval(randomAnwers, 3000)
                } else {
                    // 停止事件
                    clearInterval(startRandom)
                }
            })

            $('.clear').click(function () {
                localStorage.setItem('anwers', '')
            })
        })();