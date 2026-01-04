// ==UserScript==
// @name         UOOC assistant
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  【使用前先看介绍/有问题可反馈】UOOC 优课联盟助手 (UOOC assistant)：可选是否倍速 (若取消勾选则一倍速播放)，可选是否静音 (若取消勾选则恢复原音量)，可选是否播放 (若取消勾选则暂停播放)，可选是否连播 (若取消勾选则循环播放)，离开页面保持视频状态，自动回答视频中途弹出问题，可复制已提交测验题目及答案，键盘左右方向键可以控制视频快进/快退，上下方向键可以控制音量增大/减小，空格键可以控制播放/暂停，停止连播支持提醒，如果视频标题下面出现 `倍速/静音/播放/连播` 选项说明脚本正常启动运行。
// @author       cc
// @include      http://www.uooc.net.cn/home/learn/index*
// @include      http://www.uooconline.com/home/learn/index*
// @include      https://www.uooc.net.cn/home/learn/index*
// @include      https://www.uooconline.com/home/learn/index*
// @grant        none
// @require      https://greasyfork.org/scripts/418193-coder-utils.js
// @downloadURL https://update.greasyfork.org/scripts/413268/UOOC%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/413268/UOOC%20assistant.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const RECURSION_DURATION = 500;
    let recursion = () => {
        let extraTime = 0;
        try {
            let done = false;
            let video = document.querySelector('#player_html5_api');
            if (video) {
                if (document.getElementById('rate').checked)
                    video.playbackRate = 2;
                else
                    video.playbackRate = 1;
                if (document.getElementById('volume').checked)
                    video.muted = true;
                else
                    video.muted = false;
                if (document.getElementById('play').checked && !video.ended)
                    video.play();
                else
                    video.pause();
                if (video.ended)
                    done = true;
                let quizLayer = document.querySelector('#quizLayer');
                if (quizLayer && quizLayer.style.display != 'none') {
                    if (done) {
                        setTimeout(() => {
                            document.querySelectorAll('.layui-layer-shade').forEach(e => e.style.display = 'none');
                        }, RECURSION_DURATION << 1);
                    };
                    let source = JSON.parse(document.querySelector('div[uooc-video]').getAttribute('source'));
                    let quizList = source.quiz;
                    let quizIndex = 0;
                    let quizQuestion = document.querySelector('.smallTest-view .ti-q-c').innerHTML;
                    for (let i = 0; i < quizList.length; i++) {
                        if (quizList[i].question == quizQuestion) {
                            quizIndex = i;
                            break;
                        };
                    };
                    let quizAnswer = eval(quizList[quizIndex].answer);
                    let quizOptions = quizLayer.querySelector('div.ti-alist');
                    for (let ans of quizAnswer) {
                        let labelIndex = ans.charCodeAt() - 'A'.charCodeAt();
                        quizOptions.children[labelIndex].click();
                    }; // end for
                    quizLayer.querySelector('button').click();
                    extraTime = 1000;
                }; // end if
                if (!done) {
                    if (video.paused && document.getElementById('play').checked) {
                        video.play();
                    } else {
                        document.querySelectorAll('.layui-layer-shade, #quizLayer').forEach(e => e.style.display = 'none');
                    };
                };
            }; // end if (video)
            if (!done) {
                setTimeout(recursion, RECURSION_DURATION + extraTime);
            } else if (video) {
                if (!document.getElementById('continue').checked) {
                    video.currentTime = 0;
                    // video.ended = false;
                    setTimeout(recursion, RECURSION_DURATION + extraTime);
                } else {
                    let current_video = document.querySelector('.basic.active');
                    let next_part = current_video.parentNode;
                    let next_video = current_video;
                    // 定义判断是否视频的函数
                    let isVideo = node => Boolean(node.querySelector('span.icon-video'));
                    // 定义是否可返回上一级目录的函数
                    let canBack = () => {
                        return Boolean(next_part.parentNode.parentNode.tagName === 'LI');
                    };
                    // 定义更新至后续视频的函数
                    let toNextVideo = () => {
                        next_video = next_video.nextElementSibling;
                        while (next_video && !isVideo(next_video)) {
                            next_video = next_video.nextElementSibling;
                        };
                    };
                    // 定义判断是否存在视频的函数
                    let isExistsVideo = () => {
                        let _video = next_part.firstElementChild;
                        while (_video && !isVideo(_video)) {
                            _video = _video.nextElementSibling;
                        };
                        return Boolean(_video && isVideo(_video));
                    };
                    // 定义判断是否存在后续视频的函数
                    let isExistsNextVideo = () => {
                        let _video = current_video.nextElementSibling;
                        while (_video && !isVideo(_video)) {
                            _video = _video.nextElementSibling;
                        };
                        return Boolean(_video && isVideo(_video));
                    };
                    // 定义检查文件后是否存在后续目录的函数
                    let isExistsNextListAfterFile = () => {
                        let part = next_part.nextElementSibling;
                        return Boolean(part && part.childElementCount > 0);
                    };
                    // 定义更新文件后的后续目录的函数
                    let toNextListAfterFile = () => {
                        next_part = next_part.nextElementSibling;
                    };
                    // 定义返回上一级的函数
                    let toOuterList = () => {
                        next_part = next_part.parentNode.parentNode;
                    };
                    // 定义返回主条目的函数
                    let toOuterItem = () => {
                        next_part = next_part.parentNode;
                    };
                    // 定义检查列表后是否存在后续目录的函数
                    let isExistsNextListAfterList = () => {
                        return Boolean(next_part.nextElementSibling);
                    };
                    // 定义进入列表后的后续目录的函数
                    let toNextListAfterList = () => {
                        next_part = next_part.nextElementSibling;
                    };
                    // 定义展开目录的函数
                    let expandList = () => {
                        next_part.firstElementChild.click();
                    };
                    // 定义进入展开目录的第一个块级元素的函数
                    let toExpandListFirstElement = () => {
                        next_part = next_part.firstElementChild.nextElementSibling;
                        if (next_part.classList.contains('unfoldInfo')) {
                            next_part = next_part.nextElementSibling;
                        };
                    };
                    // 定义判断块级元素是否目录列表的函数
                    let isList = () => {
                        return Boolean(next_part.tagName === 'UL');
                    };
                    // 定义目录列表的第一个目录的函数
                    let toInnerList = () => {
                        next_part = next_part.firstElementChild;
                    };
                    // 定义进入文件列表的第一个视频的函数
                    let toFirstVideo = () => {
                        next_video = next_part.firstElementChild;
                        while (next_video && !isVideo(next_video)) {
                            next_video = next_video.nextElementSibling;
                        };
                    };
                    // 定义模式
                    let mode = {
                        FIRST_VIDEO: 'FIRST_VIDEO',
                        NEXT_VIDEO: 'NEXT_VIDEO',
                        LAST_LIST: 'LAST_LIST',
                        NEXT_LIST: 'NEXT_LIST',
                        INNER_LIST: 'INNER_LIST',
                        OUTER_LIST: 'OUTER_LIST',
                        OUTER_ITEM: 'OUTER_ITEM',
                    }
                    // 定义搜索函数
                    let search = (_mode) => {
                        switch (_mode) {
                            case mode.FIRST_VIDEO: // mode = 0
                                if (isExistsVideo()) {
                                    toFirstVideo();
                                    next_video.click();
                                    setTimeout(recursion, RECURSION_DURATION);
                                } else if (isExistsNextListAfterFile()) {
                                    search(mode.LAST_LIST);
                                } else {
                                    // perhaps there is an exam, end recursion
                                    Notification.requestPermission().then((permission) => {
                                        if (permission === 'granted') {
                                            let text = '已停止连播，可能遇到测试章节';
                                            new Notification('UOOC Assistant', { body: text });
                                        };
                                    });
                                };
                                break;
                            case mode.NEXT_VIDEO: // mode == 1
                                if (isExistsNextVideo()) {
                                    toNextVideo();
                                    next_video.click();
                                    setTimeout(recursion, RECURSION_DURATION);
                                } else if (isExistsNextListAfterFile()) {
                                    search(mode.LAST_LIST);
                                } else {
                                    search(mode.OUTER_ITEM);
                                };
                                break;
                            case mode.LAST_LIST: // mode == 2
                                toNextListAfterFile();
                                toInnerList();
                                search(mode.INNER_LIST);
                                break;
                            case mode.NEXT_LIST: // mode == 3
                                toNextListAfterList();
                                search(mode.INNER_LIST);
                                break;
                            case mode.INNER_LIST: // mode == 4
                                expandList();
                                (function waitForExpand () {
                                    if (next_part.firstElementChild.nextElementSibling) {
                                        toExpandListFirstElement();
                                        if (isList()) {
                                            toInnerList();
                                            search(mode.INNER_LIST);
                                        } else {
                                            search(mode.FIRST_VIDEO);
                                        };
                                    } else {
                                        setTimeout(waitForExpand, RECURSION_DURATION);
                                    };
                                })();
                                break;
                            case mode.OUTER_LIST: // mode == 5
                                toOuterList();
                                if (isExistsNextListAfterList()) {
                                    search(mode.NEXT_LIST);
                                } else if (canBack()) {
                                    search(mode.OUTER_LIST);
                                } else {
                                    // perhaps there is no next list
                                };
                                break;
                            case mode.OUTER_ITEM: // mode == 6
                                toOuterItem();
                                if (isExistsNextListAfterList()) {
                                    toNextListAfterList();
                                    search(mode.INNER_LIST);
                                } else if (canBack()){
                                    search(mode.OUTER_LIST);
                                } else {
                                    // perhaps there is no list
                                };
                                break;
                            default:
                                break;
                        };
                    };
                    try {
                        search(mode.NEXT_VIDEO);
                    } catch (err) {
                        console.error(err);
                    };
                };
            };
        } catch (err) {
            console.error(err);
        };
    }; // end recursion
    let wait = () => {
        if (document.readyState == 'complete') {
            // get permission
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    console.log('UOOC Assistant: 已获得通知权限');
                } else {
                    console.log('UOOC Assistant: 无法获得通知权限');
                };
            });
            // define element creating functions
            let getCheckbox = (name, text) => {
                let p = HTMLElement.$mkel('p', {}, {}, {
                    'color': '#cccccc',
                    'padding-left': '10px',
                });
                let checkbox = HTMLElement.$mkel('input', {
                    id: name,
                    type: 'checkbox',
                    name: name,
                    value: name,
                }, {
                    checked: true,
                }, {
                    'margin-left': '15px',
                    'width': '12px',
                    'height': '12px',
                });
                p.append(checkbox);
                let label = HTMLElement.$mkel('label', {
                    for: name,
                }, {
                    innerText: text,
                }, {
                    'margin-left': '13px',
                    'font-size': '12px',
                });
                p.append(label);
                return p;
            };
            let getContainer = (_id) => {
                return HTMLElement.$mkel('div', {id: _id}, {}, {
                    'display': 'flex',
                    'flex-direction': 'row',
                    'align-items': 'center',
                });
            };
            // set checkbox container
            let checkboxContainer = getContainer('checkbox-container');
            let rateCheckbox = getCheckbox('rate', '倍速');
            let volumeCheckbox = getCheckbox('volume', '静音');
            let playCheckbox = getCheckbox('play', '播放');
            let continueCheckbox = getCheckbox('continue', '连播');
            let copyCheckbox = HTMLElement.$mkel('p', {}, {}, {
                'color': '#cccccc',
                'padding-left': '10px',
            });
            let btn = HTMLElement.$mkel('button', {}, {innerHTML: '复制题目答案'}, {
                'margin-left': '13px',
                'padding': '0 5px 0',
                'font-size': '12px',
                'cursor': 'pointer',
            }, {
                click: function(event) {
                    let testPaperTop = frames[0] ? frames[0].document.querySelector('.testPaper-Top') : document.querySelector('.testPaper-Top');
                    if (!testPaperTop) {
                        alert('该页面不是测验页面，无法复制内容');
                    } else {
                        if (testPaperTop.querySelector('.fl_right')) {
                            let queItems = frames[0] ? Array.from(frames[0].document.querySelectorAll('.queItems')) : Array.from(document.querySelectorAll('.queItems'));
                            let content = queItems.map(queType => {
                                let res = '';
                                if (queType.querySelector('.queItems-type').innerText.indexOf('选') >= 0) {
                                    let questions = queType.querySelectorAll('.queContainer');
                                    res += Array.from(questions).map(question => {
                                        let que = question.querySelector('.queBox').innerText.replace(/\n{2,}/g, '\n').replace(/(\w\.)\n/g, '$1 ');
                                        let ans = question.querySelector('.answerBox div:first-child').innerText.replace(/\n/g, '');
                                        let right = question.querySelector('.scores').innerText.match(/\d+\.?\d+/g).map(score => eval(score));
                                        right = right[0] === right[1];
                                        return `${que}\n${ans}\n是否正确：${right}\n`;
                                    }).join('\n');
                                };
                                return res;
                            }).join('\n');
                            content.$copyToClipboard();
                            alert('题目及答案已复制到剪切板');
                        } else {
                            alert('该测验可能还没提交，无法复制');
                        };
                    };
                },
            });
            copyCheckbox.appendChild(btn);
            let head = document.querySelector('.learn-head');
            if (!head) {
                setTimeout(wait, RECURSION_DURATION);
                return;
            };
            checkboxContainer.appendChild(rateCheckbox);
            checkboxContainer.appendChild(volumeCheckbox);
            checkboxContainer.appendChild(playCheckbox);
            checkboxContainer.appendChild(continueCheckbox);
            checkboxContainer.appendChild(copyCheckbox);
            // set prompt container
            let promptContainer = getContainer('prompt-container');
            let div = HTMLElement.$mkel('div', {}, {
                innerHTML: `提示：<u><a href="https://greasyfork.org/zh-CN/scripts/425837-uooc-assistant-beta" target="_blank" style="color: yellow;">更新内测版本，点此尝鲜试用</a></u>，键盘的 \u2190 和 \u2192 可以控制快进/快退，\u2191 和 \u2193 可以控制音量增大/减小，空格键可以控制播放/暂停`,
            }, {
                'color': '#cccccc',
                'height': 'min-height',
                'margin': '0 20px 0',
                'padding': '0 5px',
                'border-radius': '5px',
                'font-size': '12px',
            });
            promptContainer.appendChild(div);
            let appreciationCodeContainer = getContainer('appreciation-code-container');
            let a = HTMLElement.$mkel('a', {
                href: 'https://s1.ax1x.com/2020/11/08/BTeRqe.png',
                target: '_blank',
            }, {
                innerHTML: '<u>本脚本使用完全免费😉，脚本代码编写维护不易，俊男👦靓女👧们有心的话可以点这儿支持一下作者呀❤️~</u>',
            }, {
                'color': '#cccccc',
                'font-weight': 'bold',
                'height': 'min-height',
                'margin': '0 20px 0',
                'padding': '0 5px',
                'border-radius': '5px',
                'font-size': '11px',
            });
            appreciationCodeContainer.appendChild(a);
            // set head
            head.appendChild(checkboxContainer);
            head.appendChild(promptContainer);
            head.appendChild(appreciationCodeContainer);
            head.style.height = `${head.offsetHeight + 30}px`;
            // bind key down events
            document.onkeydown = (event) => {
                let k = event.key;
                let complete = false;
                let div = document.querySelector('div.basic.active');
                if (div && div.classList.contains('complete'))
                    complete = true;
                let video = document.getElementById('player_html5_api');
                if (video) {
                    switch (k) {
                        case 'ArrowLeft': {
                            video.currentTime -= 10;
                            break;
                        };
                        case 'ArrowRight': {
                            if (complete)
                                video.currentTime += 10;
                            break;
                        };
                        case 'ArrowUp': {
                            if (video.volume + 0.1 <= 1.0)
                                video.volume += 0.1;
                            else
                                video.volume = 1.0;
                            break;
                        }
                        case 'ArrowDown': {
                            if (video.volume - 0.1 >= 0.0)
                                video.volume -= 0.1;
                            else
                                video.volume = 0.0;
                            break;
                        };
                        case ' ': {
                            let continueCheckbox = document.getElementById('play');
                            continueCheckbox.checked = !continueCheckbox.checked;
                            break;
                        };
                    };
                };
            };
            // information
            console.info('UOOC assistant init ok.');
            recursion();
        } else {
            setTimeout(wait, RECURSION_DURATION);
        };
    }; // end wait
    wait();
})();