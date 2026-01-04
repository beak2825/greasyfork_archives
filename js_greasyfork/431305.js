// ==UserScript==
// @name         华医网JHB
// @namespace    http://tampermonkey.net/
// @version      2024-9-15
// @description  华医网加速听课与自动答题，2022年4月结合新系统调整进行了功能升级完善修正。【功能】：1.多种倍速播放；2.随机延时拟人化；3.自动答题；4.屏蔽或者跳过课堂问题。
// @author       Bluethon
// @license      AGPL License
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *://*.91huayi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431305/%E5%8D%8E%E5%8C%BB%E7%BD%91JHB.user.js
// @updateURL https://update.greasyfork.org/scripts/431305/%E5%8D%8E%E5%8C%BB%E7%BD%91JHB.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var submitTime = 5100;//交卷时间控制
    const reTryTime = 10100;// 重试延时
    var examTime = 10000;//听课完成进入考试延时
    const passTime = 10000; //考试通过延时
    var randomX = 5000;//随机延时上限
    // var autoSkip = true; //一个可能会封号的功能。
    var autoSkip = false; //一个可能会封号的功能。
    //记录字段

    // === 页面判别 ===
    // href : "https://cme28.91huayi.com/pages/exam_result.aspx?cwid=740345aa-f5b6-43b2-87fa-b1ce0122746a"
    // pathname : "/pages/exam_result.aspx"

    // 使用 URL 对象解析链接
    const parsedUrl = new URL(window.location.href);
    // 提取查询参数
    var urlInfos = parsedUrl.pathname.split("/");
    var urlTip = urlInfos[urlInfos.length - 1];
    var huayi = getHuayi();

    // JHB
    const isAutoCourse = (localStorage.getItem('jhbAutoCourse') === "true");
    const isDebug = (localStorage.getItem('jhbIsDebug') === "true");
    console.log(`go, 自动刷课: ${isAutoCourse}, 调试模式: ${isDebug}`);

    // 定义不同URL路径对应的操作函数
    const urlActionsCourses = {
        "cme.aspx": () => huayi.setCourse(),          // 个人中心页面
        "tongzhi.aspx": () => huayi.doSkipNotice(),      // 通知页面
        "index.aspx": () => huayi.doSkipNotice(),        // 通知页面
    };
    const urlActionsTests = {
        "course.aspx": () => huayi.seeNext(),            // 课程列表页面
        "course_ware_polyv.aspx": () => huayi.seeVideo(),           // 视频页面
        "exam.aspx": () => huayi.doTest(),               // 考试页面
        "exam_result.aspx": () => huayi.doResult(), // 考试结果页面
        // "examQuizFail.aspx": () => huayi.doResultFail(), // 考试失败页面
        // "examCoursePass.aspx": () => huayi.doResultPass(),   // 课程结束页面
        // "apply.aspx": () => huayi.doScoreApply()             // 申请学分页面
    };

    // 处理URL路径对应的操作
    const handleUrlAction = (urlTip) => {
        // 在urlActions对象中查找当前URL路径对应的操作函数
        const action = urlActionsCourses[urlTip] || urlActionsTests[urlTip];
        if (action) {
            // 如果找到对应的操作函数, 则打印当前任务信息并执行该操作函数
            console.log(`当前任务: ${urlTip.split(".")[0]}`);
            if (urlActionsCourses.hasOwnProperty(urlTip) || isAutoCourse === true) {
                console.log(`当前任务: if 成功, 准备执行任务`);
                action();
            }
            else {
                console.log(`当前任务: if 失败, 不执行任务`);
            }
        } else {
            // 如果未找到对应的操作函数, 则打印日志信息
            console.log("该页面未找到对应处理函数");
        }
    };

    // 执行处理URL路径对应的操作
    handleUrlAction(urlTip);

    function getHuayi() {
        const buttonCssText = 'appearance:auto;position: fixed; bottom: 20px;right: 20px;color: white;border: none;border-radius: 5px;padding: 10px 15px;cursor: pointer;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);transition: background-color 0.3s;background-color: #0056b3;';
        // const buttonCssText = 'position: absolute;z-index: 99999;top: -40px;right: 0;padding:10px;cursor:pointer;background-color: #3087d9;color: #fff;box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);border-radius: 5px';
        // 创建按钮方法
        const addButton = (name = '开始') => {
            const autoCourseButton = document.createElement('button');
            autoCourseButton.innerText = name;
            autoCourseButton.id = 'exam_skip_btn';
            autoCourseButton.style.cssText = buttonCssText;
            try {
                document.querySelector('body').appendChild(autoCourseButton);
                console.debug('插入按钮成功');
            } catch (error) {
                console.debug('插入按钮失败');
            }
            return autoCourseButton
        };
        // 创建按钮和点击公共方法
        const debugClick = (selector, timeout = reTryTime) => {
            console.debug(`debugClick: ${selector}`);
            const isDebug = (localStorage.getItem('jhbIsDebug') === "true");
            if (isDebug) {
                const b = addButton();
                b.addEventListener('click', () => {
                    selector.dispatchEvent(new MouseEvent('click'))
                });
            } else {
                setTimeout(() => {
                    selector.dispatchEvent(new MouseEvent('click'))
                }, timeout + Math.ceil(Math.random() * randomX));
            }
        };
        function checkDoTest() {
            const selector = document.querySelector('a:not([disabled])[id="jrks"]');   // 输出结果
            console.log(`checkDoTest: ${selector}`);
            if (selector) {
                debugClick(selector);
            }
        };
        // 获取本地存储的正确答案对象
        const getAnswerObject = () => {
            const answerObject = localStorage.getItem('jhbAnswerObj') || '{}';
            return JSON.parse(answerObject);
        };
        // 获取下一个选项
        const getNextChoice = str => {
            // 如果 letter 为空，返回 'A'
            if (!str) {
                return 'A';
            }

            // 获取字母的 Unicode 编码
            const nextCharCode = str.charCodeAt(0) + 1;
            // 将编码转换回字母
            return String.fromCharCode(nextCharCode);
        };
        const autoSelectAnswer = answerObject => {
            const liList = document.querySelectorAll('.tablestyle');
            for (let li of liList) {
                // 找到问题标签
                // <label class="q_name" data-qid="3f42de14-16d6-46d1-aaf2-7427eea81f42">1、不适用于下尿路感染的药物为（ ）</label>
                const q = li.querySelector('.q_name').innerText;
                const a = answerObject[q] || 'A';
                const labels = li.querySelectorAll('td > label');  // 查找包含 "A/B/C/D" 的 label
                // includes(a+'、'): 正确是A, 防止匹配到C "A、%T＞MIC"
                const input = Array.from(labels).find(label => label.innerText.includes(a + '、')).querySelector('input');
                if (input) {
                    input.dispatchEvent(new MouseEvent('click'));
                }
                else {
                    console.warn(`问题${q}\n未找到选项: ${a}`);
                }
            }
        };
        // 点击操作
        const clickAction = (strSelector, logText = 'click') => {
            const next = document.querySelector(strSelector);
            console.debug(next);
            const clickEvent = () => {
                console.log(logText);
                next.dispatchEvent(new MouseEvent('click'));
            }
            if (next) {
                debugClick(next);
            } else {
                console.log('未找到元素: ' + strSelector);
            }
        };

        // ----------
        // 开始业务处理
        // ----------
        const setCourse = () => {
            // 初始化元素
            const nav = document.querySelector('.sear_box');
            // const nav = document.querySelector('.index-main-right-main1');
            const checkboxContainer = document.createElement('div');
            const autoCourseCheckboxLabel = document.createElement('label');
            const autoCourseCheckbox = document.createElement('input');
            const autoCourseButton = document.createElement('button');
            const debugCheckboxLabel = document.createElement('label');
            const debugCheckbox = document.createElement('input');

            const containerCssText = 'position: absolute;display: grid;line-height: 37px;top: -7px;right: 29px;';
            const labelCssText = 'vertical-align: middle;margin-right: 5px;line-height: 37px;color: #3087d9;font-size: 15px;';
            const controllerCssText = 'vertical-align: middle;cursor: pointer; margin-right: 5px; appearance: auto;';

            const addCourseCheckbox = () => {
                var table = document.getElementsByTagName('table')[0];
                var rows = table.rows;
                for (var i = 0; i < rows.length; i++) {
                    if (trow.index() === 0) {
                        rows[i].append('<td>选择课程</td>');
                    } else {
                        rows[i].append('<td><input type="radio" name="rd' + iter + '"/></td>');
                    }
                }
            }

            // 设定控件样式和内容

            autoCourseButton.innerText = '开始刷课';
            autoCourseButton.id = 'exam_skip_btn';
            autoCourseButton.style.cssText = buttonCssText;
            autoCourseButton.style.top = '30px';  // 根据当前页面适配位置
            autoCourseButton.style.right = '10px';

            checkboxContainer.style.cssText = containerCssText;

            // 绑定事件
            autoCourseCheckbox.addEventListener('change', e => {
                const autoVlaue = e.target.checked;
                localStorage.setItem('jhbAutoCourse', JSON.stringify(autoVlaue));
            });
            const checkDic = {
                "jhbAutoCourse": "自动刷课",
                "jhbIsDebug": "开启Debug",
            }

            for (const [key, value] of Object.entries(checkDic)) {
                const l = document.createElement('label');
                const box = document.createElement('input');
                l.innerText = value;
                l.style.cssText = labelCssText;
                box.type = 'checkbox';
                box.style.cssText = controllerCssText;

                // 读取本地存储设置
                if (localStorage.getItem(key) === 'true') {
                    box.checked = true;
                }
                box.addEventListener('change', e => {
                    const autoVlaue = e.target.checked;
                    localStorage.setItem(key, JSON.stringify(autoVlaue));
                });

                var li = document.createElement("li");
                li.appendChild(l);
                li.appendChild(box);
                checkboxContainer.appendChild(li);
            }

            // 添加控件到页面
            nav.append(checkboxContainer)
            // TOOD: 增加复选框, 点击开始刷课按钮自动刷课
            // document.querySelector('.main').appendChild(autoCourseButton);
        };
        const seeNext = () => {
            // // 删除观看视频序号, 防止弹窗阻止播放
            // var shareData = JSON.parse(sessionStorage.getItem('shareData'));
            // delete shareData.param.courseware_id;
            // sessionStorage.setItem('shareData', JSON.stringify(shareData));
            const parsedUrl = new URL(window.location.href);
            localStorage.setItem('jhbCourseUrl', parsedUrl.href);

            // 选取下一个视频
            // 找到未看视频的span, 点击其父元素下的第一个a标签
            const selector = Array.from(document.querySelectorAll('span')).find(span =>
                span.textContent === '待考试' ||
                span.textContent === '未学习' ||
                span.textContent.includes('播放至')
            ).closest('h3').getElementsByTagName('a')[0];
            debugClick(selector);
        };
        const seeVideo = () => {
            // 清理历史记录
            // localStorage.removeItem(keyTest);
            // localStorage.removeItem(keyResult);
            console.log('seeVideo开始');
            localStorage.removeItem("jhbAnswerObj");
            localStorage.removeItem("polyvPlayerStorage");

            function waitForPageLoad() {
                return new Promise((resolve) => {
                    window.addEventListener('load', () => {
                        resolve();
                    });
                });
            }
            // 定义一个函数, 在页面加载完成后获取指定标签的内容
            async function getVideo() {
                // 等待页面加载完成
                await waitForPageLoad();

                // 获取指定的 video 标签
                const video = document.querySelector('.pv-video') || document.querySelector('video');

                return video;
            }
            getVideo().then((video) => {
                console.log(video);
                // player.HTML5.volume = 0;
            });
            // video.play();
            // video.currentTime = player.j2s_getDuration();

            // 替换弹窗代码, 防止终止程序
            window.openProcessbarTip = function ajaxstatus() {
                console.log((new Date()).getTime());
            };
            // 替换播放初始化代码, 自动禁音和播放视频
            window.s2j_onPlayerInitOver()
            {
                console.log("polyv加载完毕，降低音量，自动播放");
                setTimeout(function () {
                    console.log("播放器禁音");
                    sleep(2000);
                    player.HTML5.volume = 0;
                    player.j2s_resumeVideo();
                    // sleep(5000);
                }, 2000); //延时点击播放
            };
            window.onload = function () {
                setInterval(checkDoTest, 10000);
            };
        }
        const doTest = () => {
            console.log('doTest go')
            const answerObject = getAnswerObject();
            console.debug(answerObject);

            // // 得到正确答案返回后, 直接填写并提交
            // if (answerObject[examId]) {
            //     autoSelectAnswer(answerObject[examId]);
            // } else {
            //     autoSelectAnswer(['ABCDE', 'ABCDE', 'ABCDE', 'ABCDE', 'ABCDE']);
            // }

            autoSelectAnswer(answerObject);
            clickAction('#btn_submit', '提交考卷')
        }
        const doResult = () => {
            const selector = Array.from(document.querySelectorAll('input')).find(input =>
                input.value === '待考试' || input.value === '立即学习'
            );
            if (selector) {
                doResultPass(selector);
            }
            else {
                doResultFail();
            }
        }
        const doResultFail = () => {
            const answerObject = getAnswerObject();
            // 选择所有 src 包含 error_icon.png 的 img 标签
            // <img src="/images/images_20221112/error_icon.png" alt="" class="state_error">
            const errorImages = document.querySelectorAll('img[src*="error_icon.png"]');

            // 遍历并输出结果
            errorImages.forEach(img => {
                console.debug(`错误题目叉号节点: ${img}`);
                const qText = img.parentNode.querySelector('p').innerText;
                answerObject[qText] = getNextChoice(answerObject[qText]); // 如果没有答案, 默认选择A
            });
            localStorage.setItem('jhbAnswerObj', JSON.stringify(answerObject));
            clickAction('input[type="button"][value="重新考试"]', '重新考试'); // 找到重新考试按钮并点击
        };
        const doResultPass = (selector) => {
            // url区分不出来, 移到上层处理
            // const selector = Array.from(document.querySelectorAll('input')).find(input =>
            // input.value === '待考试' || input.value === '立即学习'
            // );
            console.log("考试通过");
            console.debug(selector);
            // 结果页面"待考试"无法点击, 跳转列表页复用那边代码处理下节课
            // debugClick(selector);
            const url = localStorage.getItem('jhbCourseUrl');
            if (isDebug) {
                const b = addButton();
                b.addEventListener('click', () => {
                    window.location.href = url; // 跳转到课程列表
                });
            } else {
                setTimeout(() => {
                    window.location.href = url; // 跳转到课程列表
                }, passTime + Math.ceil(Math.random() * randomX));
            }
        }
        return {
            setCourse,
            seeVideo,
            seeNext,
            doTest,
            doResult,
            // doResultFail,
            // doResultPass,
            // doScoreApply,
            // doSkipNotice,
            // for test
            // addButton,
            // },
        }
    }

    //---------------------------------全局函数区------------------------------//
    function clickexam() { //延时点击考试按钮。
        setTimeout(function () {
            document.getElementById("jrks").click();
        }, (examTime + Math.ceil(Math.random() * randomX)));
    }
    function examherftest() {//考试按钮激活状态检测
        var hreftest = document.getElementById("jrks").attributes["href"].value;
        //console.log("测试考试"+hreftest);
        if (hreftest != "#") {
            clickexam();
        }
    }
    function closePopup() {
        var next = document.getElementsByClassName("yes")[0];
        if (next) {
            next.click();
        }
        var pingjia = document.getElementsByClassName("layui-layer-btn0")[0];
        if (pingjia) {
            pingjia.click();
        }
    }
    //课堂问答跳过，临时版
    function sleep(timeout) {
        return new Promise((resolve) => { setTimeout(resolve, timeout); });
        console.log("课堂问答循环调用");
    }
    function asynckillsendQuestion() {
        (async function () {
            while (!window.player || !window.player.sendQuestion) {
                await sleep(20);
            }
            console.log("课堂问答跳过插入");
            player.sendQuestion = function () {
                //console.log("播放器尝试弹出课堂问答，已屏蔽。");
            }
        })();
    }
    //---------------------------------全局函数区end------------------------------//
})();
