// ==UserScript==
// @name         hys
// @version      1.3
// @match        *://cme.haoyisheng.com/cme/polyv.jsp*
// @match        *://bjsqypx.haoyisheng.com/qypx/bj/cc.jsp*
// @match        *://cme.haoyisheng.com/cme/study2.jsp*
// @match        *://cme.haoyisheng.com/cme/exam.jsp*
// @match        *://cme.haoyisheng.com/cme/examQuizFail.jsp*
// @match        *://bjsqypx.haoyisheng.com/qypx/bj/polyv.jsp*
// @match        *://bjsqypx.haoyisheng.com/qypx/bj/exam.jsp*
// @match        *://bjsqypx.haoyisheng.com/qypx/bj/examQuizFail.jsp*
// @match        *://www.cmechina.net/cme/polyv.jsp*
// @match        *://www.cmechina.net/cme/study2.jsp*
// @match        *://www.cmechina.net/cme/exam.jsp*
// @match        *://www.cmechina.net/cme/examQuizFail.jsp*
// @match        *://hb.cmechina.net/cme/polyv.jsp*
// @match        *://hb.cmechina.net/cme/study2.jsp*
// @match        *://hb.cmechina.net/cme/exam.jsp*
// @match        *://hb.cmechina.net/cme/examQuizFail.jsp*
// @license MIT
// @icon         https://dev.limkim.xyz/favicon.ico
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @namespace https://dev.limkim.xyz/
// @description 提供好医生CME继续医学教育平台的视频倍速与一键看完, 并且支持考试一键完成, 现已支持: 北京健康在线-好医生继续医学教育(包含河北地区)、北京市继续医学教育必修课培训2024(北京市全员必修课培训)
// @downloadURL https://update.greasyfork.org/scripts/495686/hys.user.js
// @updateURL https://update.greasyfork.org/scripts/495686/hys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const buttonCssText = 'position: absolute;z-index: 99999;top: -50px;right: 0;padding:10px;cursor:pointer;background-color: #3087d9;color: #fff;box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);';

    function getUrlParams(name) {
        const urlSearchParams = new URLSearchParams(window.location.search);
        return urlSearchParams.get(name);
    }

    function getLastUrlPath() {
        const pathList = window.location.pathname.split('/');
        return pathList[pathList.length - 1];
    }

    function getNextChoice(str, questionIndex) {
        const code = str.charCodeAt(0) + 1;
        if (code === 70) {
            alert(`全部遍历但未找到第${questionIndex + 1}题的正确答案, 请确定是使用脚本按钮开始答题! 请关闭此页面重新开始考试`);
            return 'A';
        }
        return String.fromCharCode(code);
    }

    function getNextMultipleChoice(str, questionIndex) {
        const dic = ['ABCDE', 'BCDE', 'ACDE', 'ABDE', 'ABCE', 'ABCD', 'CDE', 'BDE', 'BCE', 'BCD', 'ADE', 'ACE', 'ACD', 'ABE', 'ABD', 'ABC', 'DE', 'CE', 'CD', 'BE', 'BD', 'BC', 'AE', 'AD', 'AC', 'AB', 'E', 'D', 'C', 'B', 'A'];
        const index = dic.indexOf(str);
        if (index === dic.length - 1) {
            alert(`全部遍历但未找到第${questionIndex + 1}题的正确答案, 请确定是使用脚本按钮开始答题! 请关闭此页面重新开始考试`);
            return dic[0];
        }
        return dic[index + 1];
    }

    function sendMessageToOtherTab(message) {
        const channelName = `NoMoreExam_${getUrlParams('course_id')}_${getUrlParams('paper_id')}`;
        const channel = new BroadcastChannel(channelName);
        channel.postMessage(message);
    }

    function setupMessageListener(handler) {
        const channelName = `NoMoreExam_${getUrlParams('course_id')}_${getUrlParams('paper_id')}`;
        const channel = new BroadcastChannel(channelName);
        channel.onmessage = (event) => {
            const receivedMessage = event.data;
            handler(receivedMessage);
        };
    }

    function autoSelectAnswer(answerArray) {
        const questionsList = location.host === 'bjsqypx.haoyisheng.com' ? document.querySelectorAll('.kaoshi dl') : document.querySelectorAll('.exam_list li');
        const indexMap = {
            'A': 0,
            'B': 1,
            'C': 2,
            'D': 3,
            'E': 4
        }
        for (let i = 0; i < questionsList.length; i++) {
            const answer = answerArray[i];
            const optionsList = questionsList[i].querySelectorAll('p');
            if (questionsList[i].querySelectorAll('input[type="radio"]').length > 0) {
                const index = indexMap[answer] || 0;
                const answerItem = optionsList[index];
                const input = answerItem.children[0];
                input.dispatchEvent(new MouseEvent('click'));
                continue;
            }
            for (let i = 0; i < optionsList.length; i++) {
                const answerItem = optionsList[i];
                const input = answerItem.children[0];
                if (answer.includes(input.value) && !input.checked) {
                    input.dispatchEvent(new MouseEvent('click'));
                }
            }
        }
    }

    // 模拟触发视频播放完成事件
    if (getLastUrlPath() === 'polyv.jsp' || getLastUrlPath() === 'cc.jsp') {
        var lname = "1106Y3ACZ_currentTime_3B2AB42438C88E4763835A29B2A11961";
        localStorage.setItem(lname, 1);
        window.playEnd();
    }

    // 考试结果页面进行遍历, 得到正确答案
    if (getLastUrlPath() === ('examQuizFail.jsp')) {
        // 获取当前选的答案
        const nowAnswerStr = window.location.search.split('ansList=')[1].split('&')[0]; // A,A,A,A,A
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
    }

    // 考试页面填写初始答案和正确答案, 并提交
    if (getLastUrlPath() === ('exam.jsp')) {
        const isBjsqypx = location.host === 'bjsqypx.haoyisheng.com';
        const questionsList = isBjsqypx ? document.querySelectorAll('.kaoshi dl') : document.querySelectorAll('.exam_list li');
        const submitBtn = isBjsqypx ? document.querySelector('.but_box .btn1') : document.querySelector('#tjkj');

        const messageHandler = message => {
            const answerArray = JSON.parse(message);
            autoSelectAnswer(answerArray);
            document.querySelector('form').removeAttribute('target');
            submitBtn.dispatchEvent(new MouseEvent('click'));
        };

        const qypxMessageHandler = message => {
            const errorOrderList = message.split(',');
            const nowAnswerObjList = [];
            errorOrderList.forEach(order => {
                const index = parseInt(order, 10) - 1;
                const answer = nowAnswerObjList[index].value;
                nowAnswerObjList[index].value = nowAnswerObjList[index].type === 1 ? getNextChoice(answer) : getNextMultipleChoice(answer);
            });
            autoSelectAnswer(nowAnswerObjList.map(item => item.value));
            document.querySelector('form').setAttribute('target', '_blank');
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
            document.querySelector('form').setAttribute('target', '_blank');
            submitBtn.dispatchEvent(new MouseEvent('click'));
        });

        if (isBjsqypx) {
            examSkipButton.style.top = '0px';
            examSkipButton.style.right = '50px';
            examSkipButton.style.border = 'none';
            document.querySelector('.content').appendChild(examSkipButton);
        } else {
            document.querySelector('.main').appendChild(examSkipButton);
        }

        if (localStorage.getItem('script_auto_exam') === 'true') {
            examSkipButton.dispatchEvent(new MouseEvent('click'));
        }
        return;
    }
    // 视频跳过
    setTimeout(() => {
        if (document.querySelector('.main')) {
            document.querySelector('.main').style.marginTop = '40px';
        }
        // 仅适用chromium
        unsafeWindow.clearInterval(1);
 
        const video = document.querySelector('.pv-video') || document.querySelector('video');
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
            video.volume = 0;
            video.playbackRate = parseInt(playRateSelecter.value);
            video.play();
            video.currentTime = video.duration;
        });
 
        if (document.querySelector('.content .h5')) {
            document.querySelector('.content .h5').style.marginBottom = '50px';
            checkboxContainer.style.top = '-45px';
            videoSkipButton.style.top = '-45px';
            videoSkipButton.style.border = 'none';
        }
        if (document.querySelector('.ccH5playerBox')) {
            document.querySelector('.ccH5playerBox').style.overflow = 'visible';
        }
 
        checkboxContainer.append(examCheckboxLabel, examCheckbox, videoCheckboxLabel, videoCheckbox, selecterLabel, playRateCheckbox, playRateSelecter);
        parent.append(checkboxContainer, videoSkipButton);
 
        /* -------------- 根据本地存储, 对各项值预处理 -------------- */
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
        const rate = parseInt(localRate);
        if (rate !== NaN && rate >= 1 && rate <= 15) {
            playRateSelecter.value = localRate;
        } else {
            playRateSelecter.value = '10';
            rate = 10;
        }
 
        if (palyRateEnable === 'true') {
            playRateCheckbox.checked = true;
            video.playbackRate = rate;
        }
    }, 1500);
})();