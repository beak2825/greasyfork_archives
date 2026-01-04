// ==UserScript==
// @name         Fuck QPen Default
// @namespace    http://tampermonkey.net/
// @version      2025-3-18
// @description  Fuck QPEN
// @author       VonEquinox & Gemini
// @match        *://*/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js
// @downloadURL https://update.greasyfork.org/scripts/529879/Fuck%20QPen%20Default.user.js
// @updateURL https://update.greasyfork.org/scripts/529879/Fuck%20QPen%20Default.meta.js
// ==/UserScript==


const GEMINI_API_KEY = "";
const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/";

(function() {
    'use strict';

    //答案框
    const outputTextArea = document.createElement('textarea');
    outputTextArea.style.position = 'fixed'; // 固定定位
    outputTextArea.style.top = '160px';      // 调整位置
    outputTextArea.style.left = '20px';     // 调整位置
    outputTextArea.style.width = '7%';     // 宽度
    outputTextArea.style.height = '5%';   // 高度
    outputTextArea.style.zIndex = '9998';    // 确保在按钮下方
    outputTextArea.style.border = 'none';      // 移除边框
    outputTextArea.style.padding = '10px';
    outputTextArea.style.backgroundColor = 'transparent';
    document.body.appendChild(outputTextArea);

    // 1. 创建按钮元素
    const getQuestionButton = document.createElement('button');
    getQuestionButton.textContent = 'Get Answer';
    getQuestionButton.style.position = 'fixed';
    getQuestionButton.style.top = '100px';
    getQuestionButton.style.left = '20px';
    getQuestionButton.style.zIndex = '9999';
    getQuestionButton.style.padding = '10px 15px';
    getQuestionButton.style.backgroundColor = '#4CAF50';
    getQuestionButton.style.backgroundColor = 'transparent';
    getQuestionButton.style.color = 'grey';
    getQuestionButton.style.border = 'none';
    getQuestionButton.style.borderRadius = '5px';
    document.body.appendChild(getQuestionButton);

    async function Delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function askGemini(question) {

        const systemInstruction = "你是一个精通数学和编程的大师,你会评估题能不能用代码是方式得出答案,你会尽量使用代码的方式进行计算,如果确定代码无法计算才会使用普通的方法进行计算."

        const messages = [
            {
                "role": "system",
                "content": systemInstruction
            },
            {
                "role": "user",
                "tools": [{"code_execution": {}}],
                "content": question,
                temperature: 0.1,
            }
        ];

        const payload = {
            model: "gemini-2.0-flash-thinking-exp",//gemini-2.0-pro-exp gemini-2.0-flash-thinking-exp gemini-exp-1206
            messages: messages,
        };

        try {
            const response = await fetch(`${GEMINI_API_BASE_URL}chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GEMINI_API_KEY}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Gemini API 响应:', data);

            let analysisResult = 'Gemini 分析结果:\n';
            if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
                analysisResult += data.choices[0].message.content + '\n';
            } else {
                analysisResult += '未能解析出有效结果。\n请查看控制台完整 API 响应。';
            }
            return analysisResult;

        } catch (error) {
            console.error('Gemini API 调用失败:', error);
            alert(`Gemini API 调用失败，请检查控制台错误信息！\n\n${error}`);
        }

    }

    async function analyzeResult(answerSteps) {
        const systemInstruction = "请仔细阅读并分析以下选择题的解题过程。你的目标是理解问题的本质以及解决问题所采取的步骤和逻辑。在理解的基础上，判断哪个选项是正确的答案。解题过程通常会逐步分析问题，并最终确定一个选项为正确答案。你需要关注解题的最终结论，通常会明确指出或暗示正确的选项是哪一个（例如通过排除错误选项或验证正确选项）。请只输出正确选项的字母（例如 A、B、C 或 D），不要包含任何额外的解释或步骤。";

        const messages = [
            {
                "role": "system",
                "content": systemInstruction
            },
            {
                "role": "user",
                "content": answerSteps
            }
        ];

        const payload = {
            model: "gemini-2.0-flash-lite",
            messages: messages,
        };

        return fetch(`${GEMINI_API_BASE_URL}chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GEMINI_API_KEY}`
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
            console.log('Gemini API 响应:', data);
            let retStr = data.choices[0].message.content;
            return retStr;
        });
    }

    function findButtonByText(text) {
        const buttons = document.getElementsByTagName('button');
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].textContent.trim() === text) {
                return buttons[i];
            }
        }
        return null;
    }

    function IsFinish() {
        let nextButton = findButtonByText('做下一题');
        if(nextButton) {
            return true;
        }else {
            return false;
        }
    }

    async function FuckIt() {
    let questions = ""

        var mainQuestion = "";
        var subQuestion = "";
        document.querySelectorAll('.qpen-exercise-panel.qpen-block').forEach(tempBlock =>{
            if(tempBlock.querySelectorAll(".qpen-exercise-panel-header").length != 0){
                mainQuestion = " 题目:" + tempBlock.querySelector(".qpen-math-show-component.font-18").textContent + "\n";
            }else if(tempBlock.querySelectorAll(".qpen-exercise-panel-subheader").length != 0){
                subQuestion = "小题:" + tempBlock.querySelector(".qpen-math-show-component.font-18").textContent + "\n";
            }
        });

        //获取选项
        const stepChoiceWraps = document.querySelectorAll('.step-choice-wrap');

        var options = "";

        var answerCounter = 0
        stepChoiceWraps.forEach(wrapElement => {
            // 在每个 step-choice-wrap 元素中查找 ant-exercise-library 元素
            const exerciseLibraryElement = wrapElement.querySelector('.ant-exercise-library');
            if (exerciseLibraryElement) {
                // 获取 ant-exercise-library 元素的文本内容
                const questionText = String.fromCharCode(65 + answerCounter) + "," + exerciseLibraryElement.textContent.trim();
                options += questionText + "\n"
                answerCounter++;
            }
        });

        var history = "";

        const historyElements = document.querySelectorAll('.answered-steps.qpen-block');
        historyElements.forEach(historyElement =>{
            if(historyElement.querySelector(".qpen-math-show-component.font-16")){
                historyElement.querySelectorAll(".qpen-math-show-component.font-16").forEach(Element =>{
                    console.log(Element.querySelector(".ant-exercise-library").textContent);
                    history += Element.querySelector(".ant-exercise-library").textContent + "\n";
                });
            }
        })
        console.log("你的作答:" + history + "\n" + mainQuestion + subQuestion + "\n下一步解法选择哪个选项\n" + options);
        const answerSteps = await askGemini("你的作答:" + history + "\n" + mainQuestion + subQuestion + "\n下一步解法选择哪个选项\n" + options);
        console.log(answerSteps)
        let result = await analyzeResult(answerSteps);

        result = result.toUpperCase().replace(/[^A-D]/g, '');
        console.log(result)
        let index = -1;
        if(result === "A"){
            index = 0;
        }else if(result === "B"){
            index = 1;
        }else if(result === "C"){
            index = 2;
        }else if(result === "D"){
            index = 3;
        }else {
            return -1;
        }

        for (const wrapElement of stepChoiceWraps) {
            const exerciseLibraryElement = wrapElement.querySelector('.ant-exercise-library');
            if (exerciseLibraryElement) {
                if (!index--) {
                    wrapElement.click();
                    await Delay(200);
                    wrapElement.click();
                }
            }
        }
    }

    //点击后执行脚本
    getQuestionButton.addEventListener('click', async function() { // 将监听器函数声明为 async
        outputTextArea.value = '';
        while(true) {
            if(IsFinish()) {
                console.log("自动下一题")
                findButtonByText('做下一题').click();
            }
            await Delay(500);
            let statue = await FuckIt();
            if(statue == -1){
                break;
            }
            await Delay(500);
        }

    });

})();