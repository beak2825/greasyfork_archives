// ==UserScript==
// @name         湖南人才市场公共教育@黄梦芊
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  学习.
// @author       laisheng
// @match        https://www.hnpxw.org/studyDetail*
// @match        https://ua.peixunyun.cn/learnCourse/learnCourse.html*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490416/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%40%E9%BB%84%E6%A2%A6%E8%8A%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/490416/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%40%E9%BB%84%E6%A2%A6%E8%8A%8A.meta.js
// ==/UserScript==



(function () {
    'use strict';
    let intervalId = null; // 用于存储定时器ID，以便之后可以清除
    let correctAnswers = []; // 用于存储正确答案

    function selectOptionsBasedOnAnswers() {
        return new Promise((resolve) => {
            const questions = document.querySelectorAll('.question-element-node');

            questions.forEach((question, index) => {
                const correctAnswer = correctAnswers[index];
                if (typeof correctAnswer === 'string') {
                    const selector = correctAnswer === "正确" ? '.choice-btn.right-btn' : '.choice-btn.wrong-btn';
                    const optionButton = question.querySelector(selector);
                    if (optionButton) {
                        optionButton.click();
                    } else {
                        console.error('Judgment option button not found');
                    }
                } else if (Array.isArray(correctAnswer)) {
                    // 清除已选择的选项
                    const selectedOptions = question.querySelectorAll('.checkbox.selected');
                    selectedOptions.forEach(selectedOption => {
                        selectedOption.closest('.choice-item').click();
                    });
                    correctAnswer.forEach(letter => {
                        const optionIndex = letter.charCodeAt(0) - 'A'.charCodeAt(0); // 将字母转换为索引（基于0）
                        const optionButtons = question.querySelectorAll('.choice-list .choice-item');
                        if (optionIndex < optionButtons.length) {
                            const optionButton = optionButtons[optionIndex];
                            optionButton.click();
                        } else {
                            console.error(`Option button not found for multi-choice '${letter}'`);
                        }
                    });
                }
            });

            setTimeout(() => {
                const submitButton = document.querySelector('.question-operation-area button[type="button"]');
                if (submitButton) {
                    submitButton.click();
                    setTimeout(resolve, 2000);
                } else {
                    console.warn('没有发现提交元素。');
                    resolve();
                }
            }, 2000);
        });
    }



    function storeCorrectAnswersAndRedo() {
        return new Promise((resolve, reject) => {
            const answerAreas = document.querySelectorAll('.answer-result-text');
            correctAnswers = Array.from(answerAreas).map(area => {
                const correctAnswerText = area.querySelector('.correct-answer-area span:last-child').textContent.trim();
                if (correctAnswerText === "正确" || correctAnswerText === "错误") {
                    return correctAnswerText;
                } else {
                    return correctAnswerText.split(','); // 用于多选题分割答案
                }
            });


            const redoButton = document.querySelector('.question-operation-area .btn-hollow.btn-redo');
            if (redoButton) {
                redoButton.click();
                setTimeout(() => {
                    selectOptionsBasedOnAnswers().then(() => {
                        resolve();
                    });
                }, 2000);
            } else {
                resolve();
            }
        });
    }


    function initialSubmission() {
        return new Promise((resolve, reject) => {
            const questions = document.querySelectorAll('.question-element-node');
            if (questions.length === 0) {
                console.warn('没有发现题目元素。');
                return reject('没有发现题目元素。');
            }
            questions.forEach(question => {
                const firstOptionButton = question.querySelector('.choice-list .choice-item:first-child, .checking-type .choice-btn:first-child');
                if (firstOptionButton) {
                    firstOptionButton.click();
                } else {
                    console.warn('没有发现第一个选项元素。');
                }
            });

            setTimeout(() => {
                const submitButton = document.querySelector('.question-operation-area button[type="button"]');
                if (submitButton) {
                    submitButton.click();
                    console.log('第一次答题完成。');
                    setTimeout(() => {
                        storeCorrectAnswersAndRedo();
                        resolve(); // 提交并处理完毕后，解决此Promise
                    }, 1000); // 增加足够的延迟以确保提交后页面可以正确处理并显示答案
                } else {
                    console.warn('没有发现提交元素。');
                    reject('Submit button not found.');
                }
            }, 1000);
        });
    }




    function updateProgressDisplay(currentIndex, totalCount) {
        let displayElement = document.getElementById('custom-progress-display');
        if (!displayElement) {
            displayElement = document.createElement('div');
            displayElement.id = 'custom-progress-display';
            document.body.insertBefore(displayElement, document.body.firstChild); // 将其添加到页面的顶部
            // 设置样式以匹配页面风格
            displayElement.style.position = 'fixed';
            displayElement.style.top = '0';
            displayElement.style.left = '0';
            displayElement.style.right = '10px';
            displayElement.style.width = '100%';
            displayElement.style.backgroundColor = '#f9f9f9';
            displayElement.style.borderBottom = '1px solid #ccc';
            displayElement.style.padding = '10px 0';
            displayElement.style.fontFamily = 'Arial, sans-serif';
            displayElement.style.color = '#333';
            displayElement.style.textAlign = 'center';
            displayElement.style.zIndex = '1000'; // 确保它位于页面上的其他元素之上
        }
        displayElement.textContent = `当前课程: ${currentIndex + 1} / ${totalCount}，本单元预计剩余视频播放时间: ${((totalCount - (currentIndex + 1)) * 40 / 60).toFixed(1)} 小时。`;

    }

    function showUserFriendlyMessage(message) {
        const existingMessage = document.getElementById('user-friendly-message');
        if (existingMessage) {
            // 如果已有消息显示，则先移除
            existingMessage.remove();
        }
        const messageDiv = document.createElement('div');
        messageDiv.id = 'user-friendly-message';
        messageDiv.style.position = 'fixed';
        messageDiv.style.bottom = '20px';
        messageDiv.style.right = '20px';
        messageDiv.style.padding = '10px 20px';
        messageDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        messageDiv.style.color = 'white';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.zIndex = 1000;
        messageDiv.innerText = message;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 5000); // 消息显示5秒后自动消失
    }


    function autoLearn() {

        const pageItems = document.querySelectorAll('.page-item');
        function handlePageItem(index) {
            if (index >= pageItems.length) {
                console.log('所有课程处理完毕。');
                return Promise.resolve();
            }
            updateProgressDisplay(index, pageItems.length);
            const item = pageItems[index];
            const finishedIcons = item.querySelectorAll('.iconfont.finish');

            // < 依次播放所有课程；> 仅播放未完成课程
            if (finishedIcons.length > 0) {
                return handlePageItem(index + 1);
            }

            return new Promise((resolve, reject) => {
                const pageName = item.querySelector('.page-name');
                if (!pageName) return resolve();

                pageName.addEventListener('click', function handler() {
                    setTimeout(() => {
                        const video = document.querySelector('video');
                        if (video) {
                            video.muted = true;
                            video.play().then(() => {
                                const checkSubmitButton = () => {
                                    const submitButton = document.querySelector('button.btn-submit[data-bind*="continueStudy"]');
                                    if (submitButton) {
                                        submitButton.click();
                                        setTimeout(() => video.play(), 1000);
                                    }
                                };
                                const intervalId = setInterval(checkSubmitButton, 60000);

                                video.onended = () => {
                                    clearInterval(intervalId);
                                    pageName.removeEventListener('click', handler);
                                    resolve(handlePageItem(index + 1));
                                };
                            }).catch(err => reject(err));
                        } else {
                            initialSubmission().then(() => {
                                pageName.removeEventListener('click', handler);
                                resolve(handlePageItem(index + 1));
                            }).catch(error => {
                                console.error('Error during initial submission:', error);
                            });
                        }
                    }, 1000);
                });

                // 触发点击事件，开始处理
                pageName.click();
            });
        }

        handlePageItem(0).then(() => {
            console.log('课程自动学习完成。');
            const backButton = document.querySelector('.back-btn.control-btn.cursor.return-url');
            backButton ? backButton.click() : console.log('未找到返回按钮。');
        });
    }



    function autoContinueLearning() {
        const rows = document.querySelectorAll('.el-table__row, .el-table__row--striped');
        let currentUncompleted = 0;
        const foundUncompleted = Array.from(rows).some(row => {
            const progressText = row.querySelector('.el-progress__text').textContent.trim();
            const scoreTextElement = row.querySelector('.el-table_1_column_4 .cell p');
            const scoreText = scoreTextElement ? scoreTextElement.textContent.trim() : null;
            if (progressText !== '100%' && scoreText !== '100') {
                const button = row.querySelector('.el-button--primary.el-button--mini');
                if (button) {
                    button.click();
                    console.log('找到未完成或未满分课程，继续学习。');
                    return true;
                }
            }
            return false;
        });

        if (!foundUncompleted) {
            console.log('所有课程已经完成。');
            clearInterval(intervalId);
            showUserFriendlyMessage('所有课程已检查，停止自动学习进程。'); // 使用友好的消息提示用户
        }
    }

    function startIntervals() {
        if (window.location.href.startsWith('https://www.hnpxw.org/studyDetail')) {
            intervalId = setInterval(autoContinueLearning, 3000);
        } else if (window.location.href.startsWith('https://ua.peixunyun.cn/learnCourse')) {
            console.log('进入课程详细列表。');
            setTimeout(autoLearn, 6000);
        }
    }

    startIntervals(); // 启动脚本
})();