// ==UserScript==
// @name         好医生JHB
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  打开视频播放页面后即可自动完成所有课程
// @author       JHB
// @match        https://www.cmechina.net/cme/*
// @match        https://www.cmechina.net/pub/*
// @exclude      https://www.cmechina.net/cme/footer.jsp*
// @exclude      https://www.cmechina.net/cme/head.jsp*
// @downloadURL https://update.greasyfork.org/scripts/427739/%E5%A5%BD%E5%8C%BB%E7%94%9FJHB.user.js
// @updateURL https://update.greasyfork.org/scripts/427739/%E5%A5%BD%E5%8C%BB%E7%94%9FJHB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const keyTest = "jixujiaoyuTest";
    const keyResult = "jixujiaoyuResult";
    const urlInfos = window.location.href.split("/");
    const urlTip = urlInfos[urlInfos.length - 1].split("?")[0];
    const isAutoCourse = (localStorage.getItem('JHB_auto_course') === "true");
    const isDebug = (localStorage.getItem('JHB_is_debug') === "true");

    var huayi = getHuayi();
    console.log(`go, 自动刷课: ${isAutoCourse}, 调试模式: ${isDebug}`);

    // 定义不同URL路径对应的操作函数
    const urlActionsCourses = {
        "myHome.jsp": () => huayi.setCourse(),          // 个人中心页面
        "tongzhi.jsp": () => huayi.doSkipNotice(),      // 通知页面
        "index.jsp": () => huayi.doSkipNotice(),        // 通知页面
    };
    const urlActionsTests = {
        "course.jsp": () => huayi.seeNext(),            // 课程列表页面
        "study2.jsp": () => huayi.seeVideo(),           // 视频页面
        "exam.jsp": () => huayi.doTest(),               // 考试页面
        "examQuizPass.jsp": () => huayi.doResultPass(), // 考试通过页面
        "examQuizFail.jsp": () => huayi.doResultFail(), // 考试失败页面
        "examCoursePass.jsp": () => huayi.doResultPass(),   // 课程结束页面
        "apply.jsp": () => huayi.doScoreApply()             // 申请学分页面
    };

    // 处理URL路径对应的操作
    const handleUrlAction = (urlTip) => {
        // 在urlActions对象中查找当前URL路径对应的操作函数
        const action = urlActionsCourses[urlTip] || urlActionsTests[urlTip];
        if (action) {
            // 如果找到对应的操作函数, 则打印当前任务信息并执行该操作函数
            console.log(`当前任务: ${urlTip.split(".")[0]}`);
            if (urlActionsCourses.hasOwnProperty(urlTip) || isAutoCourse === true) {
                action();
            }
        } else {
            // 如果未找到对应的操作函数, 则打印日志信息
            console.log("该页面未找到对应处理函数");
        }
    };

    // 执行处理URL路径对应的操作
    handleUrlAction(urlTip);

    function decoratorDebug(func) {
        return function () {
            console.log('开始执行: ' + func.name);
            const result = func.apply(this, arguments);
            console.log('执行完毕: ' + func.name);
            return result;
        }
    }

    function getHuayi() {
        const buttonCssText = 'position: absolute;z-index: 99999;top: -40px;right: 0;padding:10px;cursor:pointer;background-color: #3087d9;color: #fff;box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);border-radius: 5px';
        // 创建按钮方法
        const addButton = (name = '开始', top = '0px', right = '0px') => {
            const autoCourseButton = document.createElement('button');
            autoCourseButton.innerText = name;
            autoCourseButton.id = 'exam_skip_btn';
            autoCourseButton.style.cssText = buttonCssText;
            autoCourseButton.style.top = top;  // 根据当前页面适配位置
            autoCourseButton.style.right = right;
            try {
                document.querySelector('.main').appendChild(autoCourseButton);
            } catch (error) {
                console.log('插入按钮失败');
            }
            return autoCourseButton
        };
        // 获取本地存储的正确答案对象
        const getAnswerObject = () => {
            const answerObject = localStorage.getItem('JHB_right_answer_obj') || '{}';
            return JSON.parse(answerObject);
        };
        // 获取下一个选项
        const getNextChoice = str => {
            const code = str.charCodeAt(0) + 1;
            if (code === 70) {
                alert('全部遍历但未找到正确答案, 请确定是使用脚本按钮开始答题!');
                return 'A';
            }
            return String.fromCharCode(code);
        };
        // 循环多选选项
        const getNextMultipleChoice = str => {
            const fullCombinations = [
                // 5选1（5种）
                "A", "B", "C", "D", "E",
                // 5选2（10种）
                "AB", "AC", "AD", "AE", "BC", "BD", "BE", "CD", "CE", "DE",
                // 5选3（10种）
                "ABC", "ABD", "ABE", "ACD", "ACE", "ADE", "BCD", "BCE", "BDE", "CDE",
                // 5选4（5种）
                "ABCD", "ABCE", "ABDE", "ACDE", "BCDE",
                // 5选5（1种）
                "ABCDE"
            ];
            const index = fullCombinations.indexOf(str);
            if (index === fullCombinations.length - 1) {
                alert('全部遍历但未找到正确答案, 请确定是使用脚本按钮开始答题!');
                return 'ABCDE';
            }
            return fullCombinations[index + 1];
        };
        // 点击操作
        const clickAction = (strSelector, logText = '') => {
            const next = document.querySelector(strSelector);
            const clickEvent = () => {
                console.log(logText);
                next.dispatchEvent(new MouseEvent('click'));
            }
            if (next) {
                if (isDebug) {
                    const b = addButton();
                    b.addEventListener('click', clickEvent(logText));
                } else {
                    clickEvent(logText);
                }
            } else {
                console.log('未找到元素: ' + strSelector);
            }
        }
        const setCourse = () => {
            // 初始化元素
            const nav = document.querySelector('.home_nav');
            const checkboxContainer = document.createElement('div');
            const autoCourseCheckboxLabel = document.createElement('label');
            const autoCourseCheckbox = document.createElement('input');
            const autoCourseButton = document.createElement('button');
            const debugCheckboxLabel = document.createElement('label');
            const debugCheckbox = document.createElement('input');

            const containerCssText = 'position: absolute;display: grid;line-height: 37px;top: -7px;right: 29px;';
            const labelCssText = 'vertical-align: middle;margin-right: 5px;line-height: 37px;color: #3087d9;font-size: 15px;';
            const controllerCssText = 'vertical-align: middle;cursor: pointer; margin-right: 5px;';

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
                localStorage.setItem('JHB_auto_course', JSON.stringify(autoVlaue));
            });
            const checkDic = {
                "JHB_auto_course": "自动刷课",
                "JHB_is_debug": "开启Debug",
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
        }
        const seeVideo = () => {
            // 清理历史记录
            localStorage.removeItem(keyTest);
            localStorage.removeItem(keyResult);
            localStorage.removeItem("JHB_right_answer_obj");
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
                // console.log(video);
                video.volume = 0;
            });
            // video.play();
            // video.currentTime = player.j2s_getDuration();

            // 替换弹窗代码, 防止终止程序
            window.ajaxstatus = function ajaxstatus() {
                console.log((new Date()).getTime());
            }

            // 调用网站自己暴露的全局函数跳过视频, 进入考试页面
            if (isDebug) {
                var b = addButton();
                b.addEventListener('click', () => {
                    playEnd();
                    gotoExam4();
                });
            } else {
                setTimeout(() => {
                    playEnd();
                    gotoExam4();
                }, 5000);
            }
        }
        const seeNext = () => {
            // // 删除观看视频序号, 防止弹窗阻止播放
            // var shareData = JSON.parse(sessionStorage.getItem('shareData'));
            // delete shareData.param.courseware_id;
            // sessionStorage.setItem('shareData', JSON.stringify(shareData));

            if (isDebug) {
                var b = addButton();
                b.addEventListener('click', () => {
                    document.querySelector('.wxx, .xxz').closest('a').dispatchEvent(new MouseEvent('click'))
                });
            } else {
                setTimeout(() => {
                    document.querySelector('.wxx, .xxz').closest('a').dispatchEvent(new MouseEvent('click'))
                }, 10000);
            }
        }
        const doTest = () => {
            console.log('doTest go')
            const examId = window.location.search.split('course_id=')[1].split('&')[0] + '_' + window.location.search.split('paper_id=')[1].split('&')[0];
            const answerObject = getAnswerObject();

            // // 得到正确答案返回后, 直接填写并提交
            // if (answerObject[examId]) {
            //     autoSelectAnswer(answerObject[examId]);
            // } else {
            //     autoSelectAnswer(['ABCDE', 'ABCDE', 'ABCDE', 'ABCDE', 'ABCDE']);
            // }

            autoSelectAnswer(answerObject);
            clickAction('#tjkj', '提交考卷')
            // if (isDebug) {
            //     var b = addButton();
            //     b.addEventListener('click', () => {
            //         document.querySelector('#tjkj').dispatchEvent(new MouseEvent('click'));
            //     });
            // } else {
            //     return document.querySelector('#tjkj').dispatchEvent(new MouseEvent('click'));
            // }

            // setTimeout(function () {
            //     document.querySelector("#tjkj").click();
            // }, Math.ceil(Math.random() * 5000)); // 5s随机延时
        }
        const doResultFail = () => {
            const nowAnswerStr = window.location.search.split('ansList=')[1].split('&')[0];
            const nowAnswerList = window.location.search.split('ansList=')[1].split('&')[0].split(',');
            const h3List = document.querySelectorAll('.answer_list h3');
            let finished = true;
            for (let i = 0; i < 5; i++) {
                if (h3List[i].className === 'cuo') {
                    finished = false;
                    if (nowAnswerList[i].length === 1) {
                        nowAnswerList[i] = getNextMultipleChoice(nowAnswerList[i]);
                    } else {
                        nowAnswerList[i] = getNextMultipleChoice(nowAnswerList[i]);
                    }
                    if (isDebug) {
                        var b = addButton();
                        b.addEventListener('click', () => {
                            window.location.href = window.location.href.replace(nowAnswerStr, nowAnswerList.join(','));
                        });
                    } else {
                        window.location.href = window.location.href.replace(nowAnswerStr, nowAnswerList.join(','));
                    }
                    break;
                }
            }
            if (finished) {
                // 2024-4-7, 改为kv存储答案, 题目顺序会调整
                const answerObject = getAnswerObject();
                var answerList = document.querySelectorAll('.answer_list > h3');
                for (let answer_html of answerList) {
                    var qaTextList = answer_html.innerText.split('\n');
                    var q = qaTextList[0].substring(2);
                    answerObject[q] = qaTextList[1].substring(5)
                }
                localStorage.setItem('JHB_right_answer_obj', JSON.stringify(answerObject));

                // 2024-4-7, old version
                // const examId = window.location.search.split('course_id=')[1].split('&')[0] + '_' + window.location.search.split('paper_id=')[1].split('&')[0];
                // const answerObject = getAnswerObject();
                // answerObject[examId] = nowAnswerList;

                var next = document.querySelector('.show_exam_btns > a');
                if (next) {
                    if (isDebug) {
                        var b = addButton();
                        b.addEventListener('click', () => {
                            next.dispatchEvent(new MouseEvent('click'));
                        });
                    } else {
                        next.dispatchEvent(new MouseEvent('click'));
                    }
                }
                // history.go(-1);
            } else {
                console.log('未找到答案')
            }
        }
        const doResultPass = () => {
            console.log("考试通过")
            var next = document.querySelector('.show_exam_btns > a');
            if (next) {
                if (isDebug) {
                    var b = addButton();
                    b.addEventListener('click', () => {
                        next.dispatchEvent(new MouseEvent('click'));
                    });
                } else {
                    next.dispatchEvent(new MouseEvent('click'));
                }
                // next.click();
            }
        }
        const doScoreApply = () => {
            console.log("申请学分")
            // 勾选评分
            var checkboxes = document.getElementsByName('harvest');
            // 仅前两项勾选(只能勾选2个)
            for (let index = 0; index < 2; index++) {
                checkboxes[index].checked = true;
            }
            var next = document.querySelector('.popup-btns > a')
            if (next) {
                if (isDebug) {
                    var b = addButton();
                    b.addEventListener('click', () => {
                        next.dispatchEvent(new MouseEvent('click'));
                    });
                } else {
                    next.dispatchEvent(new MouseEvent('click'));
                }
            }
        }
        const doSkipNotice = () => {
            // 勾选评分
            clickAction('.newBtn');

            var next = document.querySelector('.newBtn')
            if (next) {
                console.log("跳过通知")
                if (isDebug) {
                    var b = addButton();
                    b.addEventListener('click', () => {
                        next.dispatchEvent(new MouseEvent('click'));
                    });
                } else {
                    next.dispatchEvent(new MouseEvent('click'));
                }
            }
            var next = document.querySelector('.close2')
            if (next) {
                console.log("跳过首页弹窗")
                if (isDebug) {
                    var b = addButton();
                    b.addEventListener('click', () => {
                        next.dispatchEvent(new MouseEvent('click'));
                    });
                } else {
                    next.dispatchEvent(new MouseEvent('click'));
                }
            }
        }
        const autoSelectAnswer = answerObject => {
            const liList = document.querySelectorAll('.exam_list li');
            for (let li of liList) {
                const quesStartStr = li.querySelector('h3').innerText.substring(6);
                const ansChoicesStr = answerObject[quesStartStr] || 'A';
                // 适配多选
                for (let ansChoice of ansChoicesStr) {
                    const input = li.querySelector('input[value="' + ansChoice + '"]');
                    if (input) {
                        input.dispatchEvent(new MouseEvent('click'));
                    }
                }
            }
            // for (let i = 0; i < 5; i++) {
            //     const LiChildren = liList[i].children;
            //     const answer = answerArray[i];
            //     for (let i = 0; i < LiChildren.length; i++) {
            //         if (LiChildren[i].nodeName === 'P') {
            //             const input = LiChildren[i].children[0];
            //             if (answer.includes(input.value)) {
            //                 input.dispatchEvent(new MouseEvent('click'));
            //                 if (LiChildren[0].innerText.includes('单选')) { break; }
            //             }
            //         }
            //     }
            // }
        };
        return {
            setCourse,
            seeVideo,
            seeNext,
            doTest,
            doResultFail,
            doResultPass,
            doScoreApply,
            doSkipNotice,
            // for test
            addButton,
        }
    }
})();
