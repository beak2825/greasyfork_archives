// ==UserScript==
// @name         大连理工教师评教问卷自动提交工具
// @namespace    https://github.com/Lentinel/DUT_TeacherEvaluation_Auto_Submit_Tool
// @version      1.6
// @description  DUT_TeacherEvaluation_Auto_Submit_Tool
// @author       Lentinel
// @match        *://jxgl.dlut.edu.cn/evaluation-student-frontend/*
// @icon         https://www.dlut.edu.cn/images/favicon.ico
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/518819/%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%E6%95%99%E5%B8%88%E8%AF%84%E6%95%99%E9%97%AE%E5%8D%B7%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/518819/%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%E6%95%99%E5%B8%88%E8%AF%84%E6%95%99%E9%97%AE%E5%8D%B7%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function (global, doc) {
    'use strict';
    function showAutoCloseAlert(message, duration = 3000) {
        const alertBox = document.createElement('div');
        alertBox.innerHTML = message;
        Object.assign(alertBox.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            zIndex: '1000',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
            fontSize: '14px',
            textAlign: 'center',
            opacity: '1',
            transition: 'opacity 0.5s ease',
        });
        document.body.appendChild(alertBox);
        setTimeout(() => {
            alertBox.style.opacity = '0';
            setTimeout(() => alertBox.remove(), 500);
        }, duration);
    }

    setTimeout(function () {
        showAutoCloseAlert('请在进入教师评教问卷页面后再点击“点我评教！”按钮。<br><br>1分钟内最多只能提交4份问卷，请慢点交！<br><br>请不要在问卷页面刷新网页，如需刷新，请关闭当前页面后重新从教务系统进入问卷，否则会导致问卷无法提交！', 10000);

        const containerDiv = doc.querySelector('div[class="main-container"]');
        if (!containerDiv) return;

        const newButton = doc.createElement('button');
        newButton.className = "el-button el-button--primary el-button--small";
        newButton.innerHTML = '<span data-id="q">点我评教！</span>';
        containerDiv.appendChild(newButton);

        newButton.addEventListener('click', function () {
            console.log("Starting evaluation...");

            const radioButtons = doc.querySelectorAll('input[type="radio"]');
            const targetText = {
                "教师对学生是否存在过于严厉、对考核要求过于严格的现象？": "否",
                "您会向学弟学妹推荐该老师的课程吗？": "是",
                "教师讲解（理论课）": "老师讲解问题非常清晰透彻，重点非常突出。",
                "教师讲解": "老师注重因材施教，对我指导非常到位。",
                "引导帮助": "老师非常善于启发我的思维，总是对我的问题给予及时、有帮助的反馈，让我对这门课程产生浓厚兴趣。",
                "课程内容": "课程内容对我非常有用，课程所学对我今后学习、工作和生活有很大价值。",
                "教学设计": "教学设计精心，教学组织非常好，师生互动非常活跃，老师讲课或指导有方。",
                "课程资源": "课程资源丰富全面，教材教辅资源齐备，课内外资源互补，很好地满足学习需求。",
                "学习目标": "我非常清楚该课程的学习目标。",
                "学习产出": "我能很好地掌握该课程的知识和能力要点，能运用课程所学分析解决复杂问题，综合能力得到很好的训练和提升。",
                "老师在授课过程中是否有效地融入了思政元素？": "是",
                "教师是否存在放松考核要求，有意诱导学生评教结果？": "否",
                "您对这门课的喜爱度。": "非常喜欢"
            };

            radioButtons.forEach(function (radio) {
                const questionText = radio.closest('.item_in').querySelector('.title_str')?.innerText;
                if (targetText[questionText] && radio.value === targetText[questionText]) {
                    radio.click();
                }

                const questionElement = radio.closest('.item_in')?.querySelector('.title_str');
                const optionText = radio.closest('label')?.innerText.trim();
                if (questionElement) {
                    const questionText = questionElement.innerText.trim();
                    if (targetText[questionText] === optionText) {
                        radio.click();
                    }
                }
                //无视题目直接选择“优秀”
                if (optionText === "优秀") {
                    radio.click();
                    console.log("已选择：优秀");
                }
            });

            setTimeout(function () {
                const scoreInput = doc.querySelector('input.el-input__inner[placeholder="请选择"]');
                if (scoreInput) {
                    scoreInput.click();

                    setTimeout(function () {
                        const scoreOption = doc.querySelector('ul.el-scrollbar__view > li.el-select-dropdown__item:last-child');
                        if (scoreOption) {
                            scoreOption.click();
                            console.log('已选择 100 分');
                        } else {
                            console.error('评分选项未找到');
                        }
                    }, 150);
                } else {
                    console.error('评分输入框未找到');
                }
            }, 300);

            const textareaElement = doc.querySelector('textarea');
            if (textareaElement && textareaElement.value === "") {
                textareaElement.value = "非常喜欢这门课！";
                textareaElement.dispatchEvent(new InputEvent("input"));
            }

            const submitButton = document.querySelector('button.el-button--primary');
            if (submitButton) {
                submitButton.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
                console.log("滚动到提交按钮处");
            } else {
                console.error("未找到提交按钮");
            }

            setTimeout(function () {
                const submitButton = doc.querySelector('button.el-button--primary');
                if (submitButton) {
                    console.log("Submitting evaluation...");
                    submitButton.click();
                }
            }, 1000);
        });

    }, 2000);
})(window, document);