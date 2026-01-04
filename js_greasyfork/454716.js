// ==UserScript==
// @name         雨课堂小助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  适配FJNU
// @author       原作者：曦月
// @license      MIT
// @match        https://*.yuketang.cn/pro/lms/*/homework/*
// @match        https://*.yuketang.cn/pro/lms/*/studycontent
// @match        https://*.yuketang.cn/pro/lms/*/video/*
// @require      https://lib.baomitu.com/axios/0.27.2/axios.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454716/%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/454716/%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ajax监听列表
    const ajaxList = [];
    const listenList = [];

    const div = document.createElement("div")
    div.innerHTML = html
    document.body.appendChild(div)
    const showEl = document.querySelector(".title"),
        showEl2 = document.querySelector(".press")

    const url = location.pathname;
    console.log("脚本运行")
    // 同时播放视频数量
    const videoNum = 5;
    // 习题目录
    const exerciseList = new RegExp(/get_exercise_list\/.+term/)
    // 习题页面
    const homework = new RegExp(/lms\/.+\/homework\//)
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
    // 视频进度提交
    const videoPress = new RegExp(/video-log\/heartbeat/)

    // 房间id
    const classroom_id = +location.pathname.split("/")[4];

    if (homework.test(url)) {
        console.log("习题页面")
        answerQuestions();
    } else if (studycontent.test(url)) {
        console.log("学习内容")
        studycontentList();
    } else if (videoPlay.test(url)) {
        console.log("视频播放")
        playVideo();
    }

    // 答题页面逻辑
    function answerQuestions() {
        const API_HEADER = localStorage.getItem("API_HEADER")
        let universityId = null
        if (API_HEADER) {
            universityId = JSON.parse(API_HEADER).school_id;
        } else {
            alert("缺少运行必要参数");
            return;
        }
        const ansUrl = `https://uestcedu.yuketang.cn/mooc-api/v1/lms/exercise/problem_apply/?term=latest&uv_id=${universityId}`

        // 题目处理
        async function ans(data) {
            let answ = data.res.data.problems
            console.log("所有题目", answ)
            for (let key = 0; key < answ.length; key++) {
                const el = answ[key];
                // 过滤已经答对的题目
                if (!el.user.is_show_answer) {
                    showEl.innerText = `正在答题 [${key + 1}]`
                    if (el.content.Type === "MultipleChoice") {
                        // 多选
                        console.log(`[${key + 1}]多选题：${el.content.Body}`)
                        showEl2.innerText = ""
                        await goAnas(el.content, true)
                    } else {
                        // 单选
                        console.log(`[${key + 1}]单选题：${el.content.Body}`)
                        showEl2.innerText = ""
                        await goAnas(el.content, false)
                    }
                } else {
                    console.log("题目已答对")
                }
            }
            console.log("所有题目已完成")
            showEl.innerText = "所有题目已完成"
            showEl2.innerText = ""
        }

        // 答题
        async function goAnas(data, isMultip) {
            const ansList = ansArr(data.Options, isMultip)
            for (let key = 0; key < ansList.length; key++) {
                await delay(3000);
                const res = await axios.post(ansUrl, {
                    answer: ansList[key],
                    classroom_id,
                    problem_id: data.ProblemID
                }, { headers: { 'xtbz': 'cloud' } })
                if (res.data.data.is_right || res.data.data.is_correct) {
                    console.log(`尝试[${key + 1}/${ansList.length}] ${ansList[key]} 成功`)
                    showEl2.innerText = `尝试[${key + 1}/${ansList.length}] ${ansList[key]} 成功`
                    break;
                } else {
                    console.log(`尝试[${key + 1}/${ansList.length}] ${ansList[key]} 失败`)
                    showEl2.innerText = `尝试[${key + 1}/${ansList.length}] ${ansList[key]} 失败`
                }
            }
        }

        // 请求间隔
        function delay(time) {
            return new Promise((res, rej) => {
                setTimeout(() => {
                    res()
                }, time)
            })
        }

        // 生成所有答案组合
        function ansArr(arr, isMultip) {
            let N = null, answerArr = arr.map(el => el.key);
            if (isMultip) {
                N = answerArr.length;
            } else {
                N = 1;
            }
            let newAns = [];
            if (N === 1) {
                newAns = newAns.concat(combine(answerArr, 1))
            } else {
                for (let i = 2; i <= N; i++) {
                    newAns = newAns.concat(combine(answerArr, i))
                }
            }
            return newAns;

            function combine(arr, N) {
                //存放索引号
                let res = []
                //存放最后的结果
                var stack = []
                arrayN(arr, 0, N, N, res, stack)
                // return pedding(stack); // 如果下面返回的答案全都不对再启用这个,上面的函数也要改
                return stack;
            }

            // 中间方法
            function pedding(arr) {
                let newArr = [];
                for (let key = 0; key < arr.length; key++) {
                    newArr.push(permute(arr[key]))
                }
                return newArr
            }

            // 所有组合方式
            function permute(input) {
                var permArr = [],
                    usedChars = [];
                function main(input) {
                    var i, ch;
                    for (i = 0; i < input.length; i++) {
                        ch = input.splice(i, 1)[0];
                        usedChars.push(ch);
                        if (input.length == 0) {
                            permArr.push(usedChars.slice());
                        }
                        main(input);
                        input.splice(i, 0, ch);
                        usedChars.pop();
                    }
                    return permArr
                }
                return main(input);
            };

            function arrayN(arr, start, count, Num, res, stack) {
                //用递归实现，把N个循环用同一个循环实现
                for (let i = start; i < arr.length - count + 1; i++) {
                    //记录索引号
                    res[count - 1] = i;
                    if (count - 1 == 0) {
                        let oneResult = []
                        for (let j = Num - 1; j >= 0; j--) {
                            oneResult.push(arr[res[j]])
                        }
                        stack.push(oneResult)
                    } else {
                        arrayN(arr, i + 1, count - 1, Num, res, stack)
                    }
                }
            }
        }

        listenAjax(exerciseList, ans);
    }

    // 学习内容页面
    function studycontentList() {
        showEl.innerText = "加载学习列表中";

        const learArr = [];
        let isLearArr = [];
        function reqs(data) {
            data.res.data.course_chapter.forEach(el => {
                if (!el.is_locked) {
                    el.section_leaf_list.forEach(el_ => {
                        if (el_.leaf_list) {
                            learArr.push(...el_.leaf_list)
                        } else {
                            learArr.push(el_)
                        }
                    })
                }
            });
            showEl.innerText = "获取到列表，查询进度";
        }
        function prss(data) {
            const prssArr = data.res.data.leaf_schedules
            // 未完成列表
            const dontLear = learArr.filter(el => {
                const keys = Object.keys(prssArr)
                const findData = keys.find(i => +i === el.id);
                if (findData !== undefined) {
                    const learData = prssArr[findData]
                    if (learData !== undefined) {
                        if (typeof learData === "number") {
                            if (+learData !== 1) {
                                return true;
                            }
                        } else if (learData.total !== learData.done) {
                            return true;
                        }
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            })
            console.log(dontLear)
            // 作业
            const work = dontLear.filter(el => el.leaf_type == 6);
            // 视频
            const video = dontLear.filter(el => el.leaf_type != 6);
            showEl.innerText = `挂机执行中，剩余（${dontLear.length}）...`;
            if (work.length) {
                startLears([work[0], ...video.splice(0, videoNum)])
            } else {
                startLears([...video.splice(0, videoNum)])
            }
        }
        function startLears(arr) {
            if (!arr.length) {
                showEl.innerText = "恭喜，所有课程均已完成！";
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
                        tempIFrame.src = `https://uestcedu.yuketang.cn/pro/lms/${app.$data.sign}/${app.$data.classroom_id}/homework/${el.id}`
                    } else {
                        tempIFrame.src = `https://uestcedu.yuketang.cn/pro/lms/${app.$data.sign}/${app.$data.classroom_id}/video/${el.id}`
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

    // 视频播放
    function playVideo() {
        showEl.innerText = `视频播放挂机页面 [等待捕获视频url]`;

        const tims = setTimeout(() => {
            showEl.innerText = `页面加载错误，正在重载页面`;
            setTimeout(() => {
                location.reload()
            }, 3000)
        }, 60000)

        function startListen(data) {
            clearTimeout(tims)
            console.log("获取到视频链接", data.res)
            let lastTime = null,
                reloadCount = 30,
                thisCount = 0
            showEl.innerText = `视频播放挂机页面 [等待创建video节点]`;

            function loop() {
                const video = document.querySelector("video")
                if (video) {
                    video.muted = true;
                    video.playbackRate = 2;
                    video.play()
                    const dur = parseInt(video.duration),
                        curr = parseInt(video.currentTime)
                    showEl.innerText = `视频播放中 [${curr}/${dur}]`;
                    if (lastTime === curr) {
                        thisCount++;
                    } else {
                        thisCount = 0;
                    }
                    lastTime = curr;
                    if (reloadCount === thisCount) {
                        showEl.innerText = `视频长时间未播放，正在重载页面`;
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
        let ones = true;
        listenAjax(videoPress, (data) => {
            console.log("捕获到更新时长请求", data);
            let urls = data.url
            let defaultHearder = data.header
            let heart_data = data.send.heart_data.reverse()[0]
            const newList = []
            console.log(heart_data)
            let leng = parseInt(heart_data.d / 10)
            for (let i = 0; i < leng; i++) {
                let newObj = JSON.parse(JSON.stringify(heart_data))
                if (i + 1 < leng) {
                    newObj.cp = heart_data.tp + parseInt((heart_data.d - heart_data.tp) / leng * i)
                } else {
                    newObj.cp = heart_data.d
                }
                newObj.et = 'play'
                newList.push(newObj)
            }
            console.log("新构建结构", newList)
            showEl.innerText = `构建虚拟学习进度`;
            let postData = {
                heart_data: newList
            }
            if (ones) {
                ones = false
                setTimeout(() => {
                    axios.post(urls, postData, defaultHearder).then(res => {
                        showEl.innerText = `请求结束，等待服务器更新`;
                        console.log("模拟请求返回", res)
                        setTimeout(() => {
                            document.querySelector(".log-detail").click()
                            showEl.innerText = `重载页面`;
                            setTimeout(() => {
                                location.reload()
                            }, 30000)
                        }, 3000)
                    })
                }, 3000)
            } else {
                console.log("已经提交过了")
            }

        })

        listenAjax(getVideoUrl, startListen);
    }

    // ajax监听
    // function listenAjax(rule, callback) {

    //     // 监听所有请求
    //     const originOpen = XMLHttpRequest.prototype.open;
    //     const originSend = XMLHttpRequest.prototype.send;

    //     // 重写open
    //     XMLHttpRequest.prototype.open = function () {
    //         this.addEventListener('load', function (obj) {
    //             const url = obj.target.responseURL; // obj.target -> this
    //             if (rule.test(url)) {
    //                 callback(JSON.parse(this.response))
    //             }
    //         });
    //         originOpen.apply(this, arguments);
    //     };

    //     // 重写send
    //     XMLHttpRequest.prototype.send = function () {
    //         originSend.apply(this, arguments);
    //     };
    // }


    // 监听所有请求
    const originOpen = XMLHttpRequest.prototype.open;
    const originSend = XMLHttpRequest.prototype.send;
    const originHeader = XMLHttpRequest.prototype.setRequestHeader

    // 重写open
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener('load', function (obj) {
            const url = obj.target.responseURL; // obj.target -> this
            listenList.forEach(el => {
                if (el.rule.test(url)) {
                    const find = ajaxList.find(el => el.xml === this)
                    if (find) {
                        find.url = url
                        find.res = JSON.parse(this.response)
                        el.callback(find)
                    } else {
                        el.callback(false)
                    }
                }
            })
        });
        originOpen.apply(this, arguments);
    };

    // 重写send
    XMLHttpRequest.prototype.send = function () {
        const xml = ajaxList.find(el => el.xml === this)
        if (xml) {
            xml.send = JSON.parse(arguments[0])
        }
        originSend.apply(this, arguments);
    };

    // 重写setRequestHeader
    XMLHttpRequest.prototype.setRequestHeader = function () {
        const xml = ajaxList.find(el => el.xml === this)
        if (xml) {
            xml.header[arguments[0]] = arguments[1]
        } else {
            ajaxList.push({
                xml: this,
                url: "",
                header: {
                    [arguments[0]]: arguments[1]
                }
            })
        }
        originHeader.apply(this, arguments)
    }

    function listenAjax(rule, callback) {
        listenList.push({
            rule,
            callback
        })
    }
})();
