// ==UserScript==
// @name         UOOC assistant plus
// @namespace    http://tampermonkey.net/
// @version      1.0.10
// @description  UOOC倍速连播 + 题库搜索自动答题, 支持uooconline
// @author       tw
// @match        *://*.uooc.net.cn/*
// @match        *://*.uooconline.com/*
// @require      https://cdn.jsdelivr.net/gh/tanwencn/js-coder-utils/utils.min.js#sha256=4XhAPcUOt/+fWX2roB64mfG8CHHRQEAih/HT9y8SzHY=
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491652/UOOC%20assistant%20plus.user.js
// @updateURL https://update.greasyfork.org/scripts/491652/UOOC%20assistant%20plus.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const RECURSION_DURATION = 1000;
    let waitExam = () => {
        let head = document.querySelector('.testPaperShow');
        if (!head) {
            setTimeout(waitExam, RECURSION_DURATION);
            return;
        };

        let checkboxContainer = getContainer('exam-checkbox-container');
        let button = $('<button>', {
            class: 'btn',
            text: '从Json填充答案',
        }).on('click', function() {
            layer.prompt({title: '请输入文本', formType: 2, maxlength:1000000}, function(value, index, elem){
                if(value === '') return elem.focus();
                let obj = JSON.parse(value);
                examHandleAnswer(obj)
                // 关闭 prompt
                layer.close(index);
            });
        });
        let paragraph = $('<p>').css({'margin-right': '10px','margin-bottom': '10px',}).append(button);
        checkboxContainer.appendChild(paragraph[0]);
        head.prepend(checkboxContainer);
        console.log("检测到测试题元素");
        examAutoAnswer();
        // 添加搜索按钮
        examAddSearchButton();
    }
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
                            document.querySelectorAll('.layui-layer-shade').forEach(e => e.style.display =
                                'none');
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
                        document.querySelectorAll('.layui-layer-shade, #quizLayer').forEach(e => e.style.display =
                            'none');
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
                    let isTest = node => Boolean(node.querySelector('span.icon-dingdanguanli'));

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
                    // 定义判断是否存在测验的函数
                    let isExistsTest = () => {
                        let _video = next_part.firstElementChild;
                        while (_video && !isTest(_video)) {
                            _video = _video.nextElementSibling;
                        };
                        return Boolean(_video && isTest(_video));
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
                                } else if (isExistsTest()) {
                                    console.log('已停止连播，进入测试章节');
                                    next_part.firstElementChild.click();
                                } else if (isExistsNextListAfterFile()) {
                                    search(mode.LAST_LIST);
                                } else {
                                    // perhaps there is an exam, end recursion
                                    Notification.requestPermission().then((permission) => {
                                        let text = '已停止连播，可能遇到测试章节';
                                        console.log(text);
                                        if (permission === 'granted') {
                                            new Notification('UOOC Assistant', {
                                                body: text
                                            });
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
                                (function waitForExpand() {
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
                                } else if (canBack()) {
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
    }
    let notificationState = null;
    let wait = () => {
        let isNotification = Notification.permission !== 'granted' && Notification.permission !== 'denied';
        if (document.readyState == 'complete') {
            if (notificationState == null) {
                // get permission
                Notification.requestPermission().then((permission) => {
                    if (permission === 'granted') {
                        notificationState = 'granted';
                        console.log('UOOC Assistant: 已获得通知权限');
                    } else if (permission === 'denied') {
                        notificationState = 'denied';
                        // 用户已拒绝通知
                        console.log('UOOC Assistant: 通知权限已拒绝');
                    } else {
                        // 用户未做出选择
                        console.log('UOOC Assistant: 用户未做出选择');
                    }
                });
            }

            let head = document.querySelector('.learn-head');
            if (!head) {
                setTimeout(wait, RECURSION_DURATION);
                return;
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
            let btn = HTMLElement.$mkel('button', {}, {
                innerHTML: '开始上课'
            }, {
                'margin-left': '13px',
                'padding': '0 5px 0',
                'font-size': '12px',
                'cursor': 'pointer',
            }, {
                click: function (event) {
                    function getCidFromUrl() {
                        var match = window.location.href.match(/\/(\d+)\//);
                        if (match && match.length > 1) {
                            return match[1]; // 返回匹配的第一个分组
                        }
                        return null;
                    }

                    // 获取 cid 参数值
                    var cid = getCidFromUrl();
                    if(cid == undefined){
                        console.log("cid获取失败");
                        return;
                    }
                    $.ajax({
                        url: 'https://cce.org.uooconline.com/home/learn/getCatalogList?&hidemsg_=true&show=&cid=' +
                            cid,
                        dataType: 'json',
                        success: function (result) {
                            if(result.data.length>0){
                                openNotFinishedTree(result.data);
                            }else{
                                alert("已经全部完成")
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error('请求失败:', error);
                        }
                    });

                    // 找到第一个未完成id
                    function openNotFinishedTree(data) {
                        let first = data.find(item => item.finished === 0);
                        if(first == undefined){
                            return;
                        }
                        let element = $("#" + first.id);
                        element.find("div").click();
                        if (first.children == undefined) {
                            var checkInterval = setInterval(function() {
                                if(element.find("div.ng-scope").length>0){
                                    let e = element.find("div").find('span.icon-video, span.icon-dingdanguanli')
                                        .filter(function() {
                                            return $(this).siblings('span:after').length < 1; // 确保同级的 span 没有 :after 伪元素
                                        })
                                        .first()
                                        .closest('div');
                                    clearInterval(checkInterval); // 停止定时器
                                    e.click()
                                }
                            }, 100);
                            return;
                        }

                        // 等待一定时间后检查子级是否加载完成
                        var checkInterval = setInterval(function() {
                            if (element.find("ul").length > 0) {
                                clearInterval(checkInterval); // 停止定时器
                                openNotFinishedTree(first.children);
                            }
                        }, 100);

                    }
                },
            });
            copyCheckbox.appendChild(btn);
            checkboxContainer.appendChild(rateCheckbox);
            checkboxContainer.appendChild(volumeCheckbox);
            checkboxContainer.appendChild(playCheckbox);
            checkboxContainer.appendChild(continueCheckbox);
            checkboxContainer.appendChild(copyCheckbox);
            // set head
            head.appendChild(checkboxContainer);
            head.style.height = `${head.offsetHeight}px`;
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
                        case 'ArrowLeft':
                            {
                                video.currentTime -= 10;
                                break;
                            };
                        case 'ArrowRight':
                            {
                                if (complete)
                                    video.currentTime += 10;
                                break;
                            };
                        case 'ArrowUp':
                            {
                                if (video.volume + 0.1 <= 1.0)
                                    video.volume += 0.1;
                                else
                                    video.volume = 1.0;
                                break;
                            }
                        case 'ArrowDown':
                            {
                                if (video.volume - 0.1 >= 0.0)
                                    video.volume -= 0.1;
                                else
                                    video.volume = 0.0;
                                break;
                            };
                        case ' ':
                            {
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
        return HTMLElement.$mkel('div', {
            id: _id
        }, {}, {
            'display': 'flex',
            'flex-direction': 'row',
            'align-items': 'center',
        });
    };

    let examAddSearchButton = () => {
        // 修改页面样式
        $('body>div.uwidth').css({
            marginLeft: '0px'
        });

        $('.ti-q-c').before(
            '<a href="javascript:;" class="question-item" data-type="google">谷歌搜索</a> | <a href="javascript:;" class="question-item" data-type="baidu">百度搜索</a> | <a href="javascript:;" class="question-item" data-type="qs5">搜索题库</a>'
        );
        $('.question-item').click(function (e) {
            let query = $(this).nextAll('.ti-q-c').text(),
                url = 'https://www1.baidu.com/s?uooc=1&wd=' + query;
            switch (this.dataset.type) {
                case "google":
                    url = 'https://www.google.com/search?q=' + query;
                    break;
                case "baidu":
                    url = 'https://www1.baidu.com/s?uooc=1&wd=' + query;
                    break;
                case "qs5":
                    url = 'https://www.qs5.org/tools/szu_tools/search.html#' + query;
                    break;
                default:
                    url = 'https://www1.baidu.com/s?uooc=1&wd=' + query;
                    break;
            }

            // 打开新窗口
            window.open(url, '_blank');

        });
    }
    let examHandleAnswer = (questions) => {
        let haveAnswers = questions.filter(obj => obj.student_answer && obj.student_answer.length > 0);
        let notAnswers = questions.filter(obj => !obj.student_answer || obj.student_answer.length === 0);

        //填充答案
        $(haveAnswers).each(function(index, question){
            question.student_answer.forEach(answer => {
                // 查找对应 id 的 input，并选中它
                $('input[name="'+ question.id +'"][value="' + answer + '"]').trigger('click').trigger('change');
            });
        });

        $('#exam-checkbox-container .copyNotAnswers').closest('p').remove();
        let button = $('<button>', {
            class: 'btn copyNotAnswers',
            text: '复制AI提问',
        }).on('click', function() {
            let content = "这是一段 JSON 数据，包括题目的 ID、问题内容、问题类型、选项内容和正确答案的字段：\n";
            content += '```json'+JSON.stringify(notAnswers)+"```\n";
            content += "请解析这些题目并将结题后的正确选项填充到 student_answer 字段中,并把解题思路填充到 solving 字段中,最后输出一个JSON格式数据。";
            content.$copyToClipboard();
            layer.msg('已复制到剪切板');
        });
        let paragraph = $('<p>').css({'margin-right': '10px','margin-bottom': '10px',}).append(button);
        document.getElementById('exam-checkbox-container').appendChild(paragraph[0]);
    }
    let examAutoAnswer = () => {
        if($('.ti').length < 1){
            setTimeout(examAutoAnswer, RECURSION_DURATION);
            return
        }
        let tid = location.pathname.match(/^\/exam\/([0-9]+)/)[1];
        $.ajax({
            url: '/exam/getTaskPaper',
            data: {'tid':tid},
            dataType: 'json'
        }).then(function (result) {
            let questions = result.data.questions.map(({ id, question, type_text, options,dir,student_answer }) => ({ id, question, type_text, options,dir,student_answer }));
            if(questions.length < 1) return;
            function fetchAnswerSequentially(questions, index) {
                if (index >= questions.length) {
                    examHandleAnswer(questions);
                    return; // 所有请求完成，退出递归
                }
                let obj = questions[index];
               $.ajax({
                    type: "GET",
                    url: "https://www.qs5.org/tools/szu_tools/index.php",
                    dataType: "JSONP",
                    data: {
                        cmd: 'search_answer',
                        s: obj.question // 使用 obj.question 作为查询参数
                    }
                }).then(function (answerResult) {
                    let answer = answerResult.list.find(item => item.answer && item.answer.length > 0);
                    if (answer != undefined) {
                        obj.student_answer = answer.answer;
                    }
                    // 递归调用下一个请求
                    fetchAnswerSequentially(questions, index + 1);
                }).fail(function (xhr, status, error) {
                    console.error('请求失败:', error);
                });
            }
            fetchAnswerSequentially(questions, 0); // 从第一个问题开始顺序执行请求
        }).fail(function (xhr, status, error) {
                console.error('请求失败:', error);
        });
    };
    wait();
    waitExam();
})();