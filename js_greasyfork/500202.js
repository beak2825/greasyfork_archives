// ==UserScript==
// @name         HZU查成绩
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  HZU教务系统查成绩
// @author       BaiZang
// @match        *://jwxt.hzu.edu.cn/*
// @downloadURL https://update.greasyfork.org/scripts/500202/HZU%E6%9F%A5%E6%88%90%E7%BB%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/500202/HZU%E6%9F%A5%E6%88%90%E7%BB%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const apiUrlZydm = 'https://jwxt.hzu.edu.cn/xtgl/comm_cxZydmList.html';
    const apiUrlCourse = 'https://jwxt.hzu.edu.cn/xjyj/xjyj_cxXjyjjdlb.html';
    const buttonIconUrl = 'https://ywtb.hzu.edu.cn/oss/iconLab/2023-02-16/%E5%9B%BE%E4%B9%A6%E6%9C%8D%E5%8A%A1-1075875905197744128.png?sign=7eiBL77yUgmGtNoGZf8KFxiI_vr2YyYMvGIGhIL3waaZzzI_KwH_38eSe1d0xj7wMCq9ZaTZs0iF3sjWSRAhjg';

    let previousPrompt = null;

    const floatButton = document.createElement('img');
    floatButton.src = buttonIconUrl;
    floatButton.style.position = 'fixed';
    floatButton.style.bottom = '20px';
    floatButton.style.right = '20px';
    floatButton.style.width = '50px';
    floatButton.style.height = '50px';
    floatButton.style.zIndex = '1000';
    floatButton.style.cursor = 'pointer';
    floatButton.style.borderRadius = '50%';
    floatButton.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    floatButton.style.userSelect = 'none';

    document.body.appendChild(floatButton);

    let isDragging = false;

    floatButton.onmousedown = function(event) {
        isDragging = false;
        const shiftX = event.clientX - floatButton.getBoundingClientRect().left;
        const shiftY = event.clientY - floatButton.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            floatButton.style.left = pageX - shiftX + 'px';
            floatButton.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            isDragging = true;
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        floatButton.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            floatButton.onmouseup = null;
            setTimeout(() => {
                isDragging = false;
            }, 0);
        };
    };

    floatButton.ondragstart = function() {
        return false;
    };

    floatButton.onclick = function() {
                showZyhPrompt();
    };



    function showZyhPrompt() {
        const zyhPrompt = createPrompt('请输入你的专业代码:', function(input) {
            fetch(apiUrlZydm)
                .then(response => response.json())
                .then(data => {
                    const matchedZyh = data.find(item => item.zyh === input);
                    if (matchedZyh) {
                        zyhPrompt.remove();
                        showNjdmPrompt(matchedZyh.zyh_id, showZyhPrompt);
                    } else {
                        alert('未找到对应的专业代码！');
                    }
                })
                .catch(error => {
                    console.error('请求失败:', error);
                    alert('请求失败，请检查控制台日志。');
                });
        });
        document.body.appendChild(zyhPrompt);

        const closeButton = createButton('关闭', function() {
            zyhPrompt.remove();
        });
        zyhPrompt.appendChild(closeButton);
    }

    function showNjdmPrompt(zyh_id, backCallback) {
        const njdmPrompt = createPrompt('请输入你的所在年级:', function(input) {
            const currentYear = new Date().getFullYear();
            const minYear = currentYear - 6;
            const maxYear = currentYear + 6;

            if (/^\d{4}$/.test(input) && input >= minYear && input <= maxYear) {
                fetch(apiUrlCourse, {
                    headers: {
                        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                    },
                    body: `njdm_id=${input}&zyh_id=${zyh_id}`,
                    method: "POST",
                })
                .then((r) => r.json())
                .then((r) => {
                    let courseInfo = '';
                    r.forEach((e) => {
                        if (e.kcList && Array.isArray(e.kcList)) {
                            e.kcList.forEach((c) => {
                                if (c.bfzcj) {
                                    courseInfo += `课程名称: ${c.kcmc}, 成绩: ${c.bfzcj}\n`;
                                }
                            });
                        }
                    });
                    if (courseInfo) {
                        njdmPrompt.remove();
                        showCourseInfo(courseInfo);
                    } else {
                        njdmPrompt.remove();
                        alert('输入的信息有误！');
                    }
                })
                .catch(error => {
                    console.error('请求失败:', error);
                    alert('请求失败，请检查控制台日志。');
                });
            } else {
                alert(`请输入${minYear}到${maxYear}之间的四位数年份！`);
            }
        }, backCallback);
        document.body.appendChild(njdmPrompt);
    }

    function showCourseInfo(courseInfo) {
        const courseInfoDiv = document.createElement('div');
        courseInfoDiv.style.position = 'fixed';
        courseInfoDiv.style.top = '50%';
        courseInfoDiv.style.left = '50%';
        courseInfoDiv.style.transform = 'translate(-50%, -50%)';
        courseInfoDiv.style.padding = '20px';
        courseInfoDiv.style.backgroundColor = 'white';
        courseInfoDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        courseInfoDiv.style.zIndex = '1000';
        courseInfoDiv.style.overflowY = 'auto';
        courseInfoDiv.style.maxHeight = '80%';

        const courseInfoContent = document.createElement('pre');
        courseInfoContent.innerText = courseInfo;
        courseInfoDiv.appendChild(courseInfoContent);

        const closeButton = createButton('关闭', function() {
            courseInfoDiv.remove();
        });
        courseInfoDiv.appendChild(closeButton);

        if (previousPrompt) {
            previousPrompt.remove();
        }

        document.body.appendChild(courseInfoDiv);
    }

    function createPrompt(message, callback, backCallback) {
        const promptDiv = document.createElement('div');
        promptDiv.style.position = 'fixed';
        promptDiv.style.top = '50%';
        promptDiv.style.left = '50%';
        promptDiv.style.transform = 'translate(-50%, -50%)';
        promptDiv.style.padding = '20px';
        promptDiv.style.width = '300px';
        promptDiv.style.backgroundColor = 'white';
        promptDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        promptDiv.style.zIndex = '1000';

        const promptMessage = document.createElement('p');
        promptMessage.innerText = message;
        promptMessage.style.textAlign = 'center';
        promptDiv.appendChild(promptMessage);

        const promptInput = document.createElement('input');
        promptInput.type = 'text';
        promptInput.style.width = '100%';
        promptInput.style.height = '27px';
        promptInput.autofocus = true;
        setTimeout(() => promptInput.focus(), 0);
        promptInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                const inputValue = promptInput.value;
                if (inputValue) {
                    callback(inputValue);
                }
            }
        });
        promptDiv.appendChild(promptInput);

        const promptButton = createButton('确认', function() {
            const inputValue = promptInput.value;
            if (inputValue) {
                callback(inputValue);
            }
        });
        promptDiv.appendChild(promptButton);

        if (backCallback) {
            const backButton = createButton('返回上一步', function() {
                promptDiv.remove();
                backCallback();
            });
            promptDiv.appendChild(backButton);
        }

        if (previousPrompt) {
            previousPrompt.remove();
        }
        previousPrompt = promptDiv;

        return promptDiv;
    }

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.innerText = text;
        button.style.marginTop = '10px';
        button.style.width = '100%';
        button.style.padding = '10px';
        button.onclick = onClick;
        return button;
    }
})();
