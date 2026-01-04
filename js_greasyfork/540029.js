// ==UserScript==
// @name          好医生-视频与考试Plus
// @namespace     https://greasyfork.org/zh-CN/users/1386658-openscript
// @version       1.6.4
// @description   好医生课程视频倍速与跳过，考试自动答题。
// @author        OpenScript
// @license MIT
// @require       https://unpkg.com/sweetalert2@11/dist/sweetalert2.min.js
// @resource Swal https://unpkg.com/sweetalert2@11/dist/sweetalert2.min.css
// @match         *://cme.haoyisheng.com/cme/polyv.jsp*
// @match         *://cme.haoyisheng.com/cme/study2.jsp*
// @match         *://cme.haoyisheng.com/cme/exam.jsp*
// @match         *://cme.haoyisheng.com/cme/examQuizFail.jsp*
// @match         *://bjsqypx.haoyisheng.com/qypx/bj/polyv.jsp*
// @match         *://bjsqypx.haoyisheng.com/qypx/bj/cc.jsp*
// @match         *://bjsqypx.haoyisheng.com/qypx/bj/exam.jsp*
// @match         *://bjsqypx.haoyisheng.com/qypx/bj/examQuizFail.jsp*
// @match         *://*.cmechina.net/cme/polyv.jsp*
// @match         *://*.cmechina.net/cme/study2.jsp*
// @match         *://*.cmechina.net/cme/exam.jsp*
// @match         *://*.cmechina.net/cme/examQuizFail.jsp*
// @match         *://*.cmechina.net/cme/examQuizPass.jsp*
// @match         *://*.cmechina.net/cme/course.jsp*
// @run-at        document-end
// @grant         unsafeWindow
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_listValues
// @grant         GM_openInTab
// @grant         GM_notification
// @grant         GM_xmlhttpRequest
// @grant         GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/540029/%E5%A5%BD%E5%8C%BB%E7%94%9F-%E8%A7%86%E9%A2%91%E4%B8%8E%E8%80%83%E8%AF%95Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/540029/%E5%A5%BD%E5%8C%BB%E7%94%9F-%E8%A7%86%E9%A2%91%E4%B8%8E%E8%80%83%E8%AF%95Plus.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addStyle(id, tag, css, element) {
        tag = tag || 'style';
        element = element || 'body';
        let doc = document, styleDom = doc.getElementById(id);
        if (styleDom) styleDom.remove();
        let style = doc.createElement(tag);
        style.rel = 'stylesheet';
        style.id = id;
        tag === 'style' ? style.innerHTML = css : style.href = css;
        doc.getElementsByTagName(element)[0].appendChild(style);
    }
    addStyle('swal-pub-style', 'style', '.swal2-container{z-index:1999;}' + GM_getResourceText('Swal'));

    const buttonCssText = 'position: absolute;z-index: 99;top: -50px;right: 0;padding:10px;cursor:pointer;background: #3087d9;color: #fff;border-radius: 10px;box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);';

    const lastPath = getLastUrlPath();
    const examId = `${getUrlParams('course_id')}_${getUrlParams('paper_id')}`;

    function getUrlParams(name) {
        const urlSearchParams = new URLSearchParams(window.location.search);
        return urlSearchParams.get(name);
    }
    function getLastUrlPath() {
        const pathList = window.location.pathname.split('/');
        return pathList[pathList.length - 1];
    }

    const channelName = `NoMoreExam_${examId}`;
    function sendMessageToOtherTab(message) {
        const channel = new BroadcastChannel(channelName);
        channel.postMessage(message);
    }
    function setupMessageListener(handler) {
        const channel = new BroadcastChannel(channelName);
        channel.onmessage = (event) => {
            const receivedMessage = event.data;
            handler(receivedMessage);
        };
    }

    function alertAnswerFailedMsg(index) {
        alert(`全部遍历但未找到第${index}题的正确答案, 请确定是使用脚本按钮开始答题! 请关闭此页面重新开始考试`);
    }
    function getNextChoice(str, questionIndex) {
        const code = str.charCodeAt(0) + 1;
        if (code === 70) {
            alertAnswerFailedMsg(questionIndex + 1);
            return 'A';
        }
        return String.fromCharCode(code);
    }
    function getNextMultipleChoice(str, questionIndex) {
        const dic = ['ABCDE', 'BCDE', 'ACDE', 'ABDE', 'ABCE', 'ABCD', 'CDE', 'BDE', 'BCE', 'BCD', 'ADE', 'ACE', 'ACD', 'ABE', 'ABD', 'ABC', 'DE', 'CE', 'CD', 'BE', 'BD', 'BC', 'AE', 'AD', 'AC', 'AB', 'E', 'D', 'C', 'B', 'A'];
        const index = dic.indexOf(str);
        if (index === dic.length - 1) {
            alertAnswerFailedMsg(questionIndex + 1);
            return dic[0];
        }
        return dic[index + 1];
    }

    function customQuerySelector(selectors) {
        return document.querySelectorAll(selectors)[0];
    }

    if (lastPath === ('examQuizFail.jsp')) {
        if (location.host === 'bjsqypx.haoyisheng.com') {
            const error_order = getUrlParams('error_order');
            sendMessageToOtherTab(error_order);
            window.close();
            return;
        }
        const nowAnswerStr = window.location.search.split('ansList=')[1].split('&')[0];
        const nowAnswerList = nowAnswerStr.split(',');

        let currentQuestionIndex = 0;
        const answersList = document.querySelectorAll('.answer_list h3');
        let finished = true;
        for (let i = 0; i < answersList.length; i++) {
            currentQuestionIndex = i;
            if (answersList[i].className.includes('cuo')) {
                finished = false;
                if (nowAnswerList[i].length === 1) {
                    nowAnswerList[i] = getNextChoice(nowAnswerList[i], currentQuestionIndex);
                } else {
                    nowAnswerList[i] = getNextMultipleChoice(nowAnswerList[i], currentQuestionIndex);
                }
                window.location.href = window.location.href.replace(nowAnswerStr, nowAnswerList.join(','));
                break;
            }
        }
        if (finished) {
            sendMessageToOtherTab(JSON.stringify(nowAnswerList));
            window.close();
        }
        return;
    }
    if (lastPath === ('exam.jsp')) {
        const isBjsqypx = location.host === 'bjsqypx.haoyisheng.com';
        const questionsList = isBjsqypx ? document.querySelectorAll('.kaoshi dl') : document.querySelectorAll('.exam_list li');
        const submitBtn = isBjsqypx ? customQuerySelector('.but_box .btn1') : customQuerySelector('#tjkj');
        const nowAnswerObjList = [];
        const autoSelectAnswer = answerArray => {
            const indexMap = {
                'A': 0,
                'B': 1,
                'C': 2,
                'D': 3,
                'E': 4
            };
            for (let i = 0; i < questionsList.length; i++) {
                const answer = answerArray[i];
                const optionsList = questionsList[i].querySelectorAll('p');
                if (questionsList[i].querySelectorAll('input[type="radio"]').length > 0) {
                    const index = indexMap[answer] || 0;
                    const answerItem = optionsList[index];
                    const input = answerItem.children[0];
                    nowAnswerObjList[i] = {
                        type: 1,
                        value: input.value
                    };
                    input.dispatchEvent(new MouseEvent('click'));
                    continue;
                }
                for (let i = 0; i < optionsList.length; i++) {
                    const answerItem = optionsList[i];
                    nowAnswerObjList[i] = {
                        type: 2,
                        value: answer
                    };
                    const input = answerItem.children[0];
                    if (answer.includes(input.value) && !input.checked) {
                        input.dispatchEvent(new MouseEvent('click'));
                    }
                }
            }
        };
        const messageHandler = message => {
            autoSelectAnswer(JSON.parse(message));
            customQuerySelector('form').removeAttribute('target');
            submitBtn.dispatchEvent(new MouseEvent('click'));
        };
        const qypxMessageHandler = message => {
            const errorOrderList = message.split(',');
            errorOrderList.forEach(order => {
                const index = parseInt(order, 10) - 1;
                const answer = nowAnswerObjList[index].value;
                nowAnswerObjList[index].value = nowAnswerObjList[index].type === 1 ? getNextChoice(answer) : getNextMultipleChoice(answer);
            });
            autoSelectAnswer(nowAnswerObjList.map(item => item.value));
            customQuerySelector('form').setAttribute('target', '_blank');
            submitBtn.dispatchEvent(new MouseEvent('click'));
        };

        setupMessageListener(isBjsqypx ? qypxMessageHandler : messageHandler);

        const examSkipButton = document.createElement('button');

        examSkipButton.innerText = '考试? 拿来吧你!';
        examSkipButton.id = 'exam_skip_btn';
        examSkipButton.style.cssText = buttonCssText;
        examSkipButton.style.top = '55px';
        examSkipButton.style.right = '150px';

        examSkipButton.addEventListener('click', () => {
            const answersArray = new Array(questionsList.length).fill('ABCDE');
            autoSelectAnswer(answersArray);
            customQuerySelector('form').setAttribute('target', '_blank');
            submitBtn.dispatchEvent(new MouseEvent('click'));
        });

        if (isBjsqypx) {
            examSkipButton.style.top = '0px';
            examSkipButton.style.right = '50px';
            examSkipButton.style.border = 'none';
            customQuerySelector('.content').appendChild(examSkipButton);
        } else {
            customQuerySelector('.main').appendChild(examSkipButton);
        }

        if (localStorage.getItem('script_auto_exam') === 'true') {
            examSkipButton.dispatchEvent(new MouseEvent('click'));
        }
        return;
    }
    // 视频跳过
    setTimeout(() => {
        let fuckingPlayer = null;

        function initPlayer() {
            const localNoticeSkip = localStorage.getItem('swal_notice_skip');

            if (unsafeWindow.player && unsafeWindow.player.params) {
                unsafeWindow.player.params.rate_allow_change = true;
                fuckingPlayer = unsafeWindow.player;
            } else if (unsafeWindow.cc_js_Player && unsafeWindow.cc_js_Player.params) {
                unsafeWindow.cc_js_Player.params.rate_allow_change = true;
                fuckingPlayer = unsafeWindow.cc_js_Player;
            }

            document.querySelector = function (selectors) {
                return document.querySelectorAll(selectors)[0];
            };

            if (fuckingPlayer) {
                localStorage.setItem('swal_notice_skip', 'true');
            } else {
                localStorage.removeItem('swal_notice_skip');
                Swal.fire({
                    title: "播放器获取失败",
                    text: "似乎网站未被正确兼容? 功能可能不正常",
                    icon: "question",
                });
            }
        }

        if (customQuerySelector('.main')) {
            customQuerySelector('.main').style.marginTop = '40px';
        }
        // 仅适用chromium
        unsafeWindow.clearInterval(1);
        initPlayer();

        const video = customQuerySelector('.pv-video') || customQuerySelector('video');
        const parent = video.parentElement;
        const videoSkipButton = document.createElement('button');
        const selecterLabel = document.createElement('label');
        const playRateSelecter = document.createElement('select');
        const playRateCheckbox = document.createElement('input');
        const checkboxContainer = document.createElement('div');
        const videoCheckboxLabel = document.createElement('label');
        const videoCheckbox = document.createElement('input');
        const examCheckboxLabel = document.createElement('label');
        const examCheckbox = document.createElement('input');

        const containerCssText = 'position: absolute;height: 37px;line-height: 37px;top: -50px;right: 140px;';
        const labelCssText = 'vertical-align: middle;margin-right: 5px;line-height: 37px;color: #3087d9;font-size: 15px;';
        const controllerCssText = 'vertical-align: middle;cursor: pointer; margin-right: 5px;';

        checkboxContainer.style.cssText = containerCssText;
        // 跳过按钮
        videoSkipButton.innerText = '看视频? 拿来吧你!';
        videoSkipButton.style.cssText = buttonCssText;
        // 自动看完
        videoCheckboxLabel.innerText = '自动看完:';
        videoCheckboxLabel.style.cssText = labelCssText;
        videoCheckbox.type = 'checkbox';
        videoCheckbox.style.cssText = controllerCssText;
        // 自动开考
        examCheckboxLabel.innerText = '进入考试后自动开考:';
        examCheckboxLabel.style.cssText = labelCssText;
        examCheckbox.type = 'checkbox';
        examCheckbox.style.cssText = controllerCssText;
        // 倍速
        selecterLabel.innerText = '倍速:';
        selecterLabel.style.cssText = labelCssText;
        playRateSelecter.style.cssText = controllerCssText;
        playRateSelecter.style.border = '1px solid #000';
        playRateCheckbox.type = 'checkbox';
        playRateCheckbox.style.cssText = controllerCssText;
        // 倍速选择器初始化选项
        for (let i = 1; i <= 15; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.label = i;
            playRateSelecter.appendChild(option);
        }

        playRateSelecter.addEventListener('change', () => {
            localStorage.setItem('play_back_rate', playRateSelecter.value);
            if (palyRateEnable) {
                video.playbackRate = parseInt(playRateSelecter.value);
            }
        });
        playRateCheckbox.addEventListener('change', e => {
            const value = e.target.checked;
            localStorage.setItem('play_back_rate_enable', JSON.stringify(value));
            if (value) {
                video.playbackRate = parseInt(playRateSelecter.value);
            } else {
                video.playbackRate = 1;
            }
        });
        videoCheckbox.addEventListener('change', e => {
            const autoValue = e.target.checked;
            localStorage.setItem('script_auto_skip', JSON.stringify(autoValue));
        });
        examCheckbox.addEventListener('change', e => {
            const autoValue = e.target.checked;
            localStorage.setItem('script_auto_exam', JSON.stringify(autoValue));
        });
        videoSkipButton.addEventListener('click', () => {
            if (fuckingPlayer) {
                fuckingPlayer.setVolume(0);
                fuckingPlayer.play();
                fuckingPlayer.jumpToTime(fuckingPlayer.getDuration() - 0.5);
            } else {
                video.volume = 0;
                video.playbackRate = parseInt(playRateSelecter.value);
                video.currentTime = video.duration;
            }
        });

        if (customQuerySelector('.content .h5')) {
            customQuerySelector('.content .h5').style.marginBottom = '50px';
            checkboxContainer.style.top = '-45px';
            videoSkipButton.style.top = '-45px';
            videoSkipButton.style.border = 'none';
        }
        if (customQuerySelector('.ccH5playerBox')) {
            customQuerySelector('.ccH5playerBox').style.overflow = 'visible';
        }

        checkboxContainer.append(examCheckboxLabel, examCheckbox, videoCheckboxLabel, videoCheckbox, selecterLabel, playRateCheckbox, playRateSelecter);
        parent.append(checkboxContainer, videoSkipButton);

        if (localStorage.getItem('script_auto_skip') === 'true') {
            videoCheckbox.checked = true;
            videoSkipButton.dispatchEvent(new MouseEvent('click'));
        }
        if (localStorage.getItem('script_auto_exam') === 'true') {
            examCheckbox.checked = true;
        }

        const localRate = localStorage.getItem('play_back_rate');
        const palyRateEnable = localStorage.getItem('play_back_rate_enable');
        if (!localRate) {
            return;
        }
        let rate = parseInt(localRate);
        if (!isNaN(rate) && rate >= 1 && rate <= 15) {
            playRateSelecter.value = localRate;
        } else {
            playRateSelecter.value = '10';
            rate = 10;
        }

        if (palyRateEnable === 'true') {
            playRateCheckbox.checked = true;
            video.playbackRate = rate;
        }

        // === 自动切换课时和自动进入本节考试 ===
        // 仅在study2.jsp课时页面生效
        if (window.location.pathname.includes('study2.jsp')) {
            function goToNextStep() {
                const currentLi = document.querySelector('ul.s_r_ml li.active');
                if (!currentLi) return;
                const iTag = currentLi.querySelector('i');
                if (iTag) {
                    if (iTag.textContent.includes('未学习')) {
                        // 当前课时未学习，自动跳过视频，跳过后延迟更久再刷新页面
                        setTimeout(() => {
                            window.location.reload();
                        }, 8000);
                    } else if (iTag.textContent.includes('待考试')) {
                        // 当前课时待考试，自动点击本节考试按钮
                        const examBtn = document.querySelector('a[onclick*="gotoExam"]');
                        if (examBtn) examBtn.click();
                    }
                }
            }
            // 视频自动跳过后调用
            setTimeout(() => {
                goToNextStep();
            }, 1800); // 稍微延迟，确保状态刷新
        }
        // === END ===
    }, 1500);

    // === 自动跳转：考试通过后自动进入下一节课程 ===
    if (window.location.pathname.includes('examQuizPass.jsp')) {
        let tryCount = 0;
        const maxTries = 10;
        const interval = setInterval(() => {
            const nextBtn = document.querySelector('.show_exam_btns a[href*="course.jsp?course_id="]');
            if (nextBtn) {
                window.location.href = nextBtn.href;
                clearInterval(interval);
            }
            tryCount++;
            if (tryCount >= maxTries) clearInterval(interval);
        }, 500);
    }

    // === 自动跳转：课程列表页自动进入下一个未学习或待考试课时 ===
    if (window.location.pathname.includes('course.jsp')) {
        setTimeout(() => {
            // 查找所有课时的a标签
            const courseLinks = Array.from(document.querySelectorAll('.course_list a[onclick*="kjJumpTo"]'));
            let targetA = null;
            // 优先未学习
            for (const a of courseLinks) {
                if (a.querySelector('span.wxx')) {
                    targetA = a;
                    break;
                }
            }
            // 没有未学习，找待考试
            if (!targetA) {
                for (const a of courseLinks) {
                    if (a.querySelector('span.xxz')) {
                        targetA = a;
                        break;
                    }
                }
            }
            if (targetA) {
                if (typeof targetA.onclick === 'function') {
                    targetA.onclick();
                } else {
                    targetA.click();
                }
            }
        }, 1200);
    }
})();
