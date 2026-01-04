// ==UserScript==
// @name         KaHack!
// @version      1.0.24
// @namespace    https://github.com/LINKLang
// @description  A hack for kahoot.it!
// @description:zh-cn  破解 kahoot.it! 的答案
// @author       Ling - LINK
// @match        https://kahoot.it/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kahoot.it
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504330/KaHack%21.user.js
// @updateURL https://update.greasyfork.org/scripts/504330/KaHack%21.meta.js
// ==/UserScript==

var Version = '1.0.24'

var questions = [];
var info = {
    numQuestions: 0,
    questionNum: -1,
    lastAnsweredQuestion: -1,
    defaultIL:true,
    ILSetQuestion:-1,
};
var PPT = localStorage.getItem('PPT');
if (PPT === null) {
    PPT = 950;
    localStorage.setItem('PPT', '950');
} else {
    PPT = parseInt(PPT);
}
var Answered_PPT = PPT;
var autoAnswer = false;
if (autoAnswer === null) {
    autoAnswer = false;
    localStorage.setItem('autoAnswer', 'false');
} else {
    autoAnswer = autoAnswer === 'true';
}
var showAnswers = false;
if (showAnswers === null) {
    showAnswers = false;
    localStorage.setItem('showAnswers', 'false');
} else {
    showAnswers = showAnswers === 'true';
}
var inputLag = 100;
var toastDisabled = localStorage.getItem('toastDisabled');
if (toastDisabled === null) {
    toastDisabled = false;
    localStorage.setItem('toastDisabled', 'false');
} else {
    toastDisabled = toastDisabled === 'true';
}

// 根据属性值查找元素
function FindByAttributeValue(attribute, value, element_type) {
  // 如果没有指定元素类型，则默认为"*"
  element_type = element_type || "*";
  // 获取所有指定类型的元素
  var All = document.getElementsByTagName(element_type);
  // 遍历所有元素
  for (var i = 0; i < All.length; i++) {
    // 如果元素的指定属性值等于指定值，则返回该元素
    if (All[i].getAttribute(attribute) == value) { return All[i]; }
  }
}

const uiElement = document.createElement('div');
uiElement.className = 'floating-ui';
uiElement.style.position = 'absolute';
uiElement.style.top = '5%';
uiElement.style.left = '5%';
uiElement.style.width = '33vw';
uiElement.style.height = 'auto';
uiElement.style.backgroundColor = '#381272';
uiElement.style.borderRadius = '1vw';
uiElement.style.boxShadow = '0px 0px 10px 0px rgba(0, 0, 0, 0.5)';
uiElement.style.zIndex = '9999';

const handle = document.createElement('div');
handle.className = 'handle';
handle.style.fontFamily = '"Montserrat", "Noto Sans Arabic", "Helvetica Neue", Helvetica, Arial, sans-serif;';
handle.style.fontSize = '1.5vw';
handle.textContent = 'KaHack!';
handle.style.color = 'white';
handle.style.width = '97.5%';
handle.style.height = '2.5vw';
handle.style.backgroundColor = '#321066';
handle.style.borderRadius = '1vw 1vw 0 0';
handle.style.cursor = 'grab';
handle.style.textAlign = 'left';
handle.style.paddingLeft = '2.5%';
handle.style.lineHeight = '2vw';
uiElement.appendChild(handle);

const closeButton = document.createElement('div');
closeButton.className = 'close-button';
closeButton.textContent = '✕';
closeButton.style.position = 'absolute';
closeButton.style.top = '0';
closeButton.style.right = '0';
closeButton.style.width = '12.5%';
closeButton.style.height = '2.5vw';
closeButton.style.backgroundColor = 'red';
closeButton.style.color = 'white';
closeButton.style.borderRadius = '0 1vw 0 0';
closeButton.style.display = 'flex';
closeButton.style.justifyContent = 'center';
closeButton.style.alignItems = 'center';
closeButton.style.cursor = 'pointer';
handle.appendChild(closeButton);

const minimizeButton = document.createElement('div');
minimizeButton.className = 'minimize-button';
minimizeButton.textContent = '─';
minimizeButton.style.color = 'white';
minimizeButton.style.position = 'absolute';
minimizeButton.style.top = '0';
minimizeButton.style.right = '12.5%';
minimizeButton.style.width = '12.5%';
minimizeButton.style.height = '2.5vw';
minimizeButton.style.backgroundColor = 'gray';
minimizeButton.style.borderRadius = '0 0 0 0';
minimizeButton.style.display = 'flex';
minimizeButton.style.justifyContent = 'center';
minimizeButton.style.alignItems = 'center';
minimizeButton.style.cursor = 'pointer';
handle.appendChild(minimizeButton);

const header = document.createElement('h2');
header.textContent = 'QUIZ ID';
header.style.display = 'block';
header.style.margin = '1vw';
header.style.textAlign = 'center';
header.style.fontFamily = '"Montserrat", "Noto Sans Arabic", "Helvetica Neue", Helvetica, Arial, sans-serif;';
header.style.fontSize = '2vw';
header.style.color = 'white';
header.style.textShadow = `
  -1px -1px 0 rgb(47, 47, 47),
  1px -1px 0 rgb(47, 47, 47),
  -1px 1px 0 rgb(47, 47, 47),
  1px 1px 0 rgb(47, 47, 47)
`;

uiElement.appendChild(header);

const inputContainer = document.createElement('div');
inputContainer.style.display = 'flex';
inputContainer.style.justifyContent = 'center';

const inputBox = document.createElement('input');
inputBox.type = 'text';
inputBox.style.color = 'black';
inputBox.placeholder = 'Quiz Id here...';
inputBox.style.width = '27.8vw';
inputBox.style.height = '1.5vw';
inputBox.style.margin = '0vw';
inputBox.style.padding = '0vw';
inputBox.style.padding = '0';
inputBox.style.border = '.1vw solid black';
inputBox.style.borderRadius = '1vw';
inputBox.style.outline = 'none';
inputBox.style.textAlign = 'center';
inputBox.style.fontSize = '1.15vw';


inputContainer.appendChild(inputBox);
uiElement.appendChild(inputContainer);

const header2 = document.createElement('h2');
header2.textContent = 'POINTS PER QUESTION';
header2.style.display = 'block';
header2.style.margin = '1vw';
header2.style.textAlign = 'center';
header2.style.fontFamily = '"Montserrat", "Noto Sans Arabic", "Helvetica Neue", Helvetica, Arial, sans-serif;';
header2.style.fontSize = '2vw';
header2.style.color = 'white';
header2.style.textShadow = `
  -1px -1px 0 rgb(47, 47, 47),
  1px -1px 0 rgb(47, 47, 47),
  -1px 1px 0 rgb(47, 47, 47),
  1px 1px 0 rgb(47, 47, 47)
`;

uiElement.appendChild(header2);

const sliderContainer = document.createElement('div');
sliderContainer.style.width = '80%';
sliderContainer.style.margin = '1vw auto';
sliderContainer.style.display = 'flex';
sliderContainer.style.alignItems = 'center';
sliderContainer.style.justifyContent = 'center';

const pointsLabel = document.createElement('span');
pointsLabel.textContent = 'Points per Question: 950';
pointsLabel.style.fontFamily = '"Montserrat", "Noto Sans Arabic", "Helvetica Neue", Helvetica, Arial, sans-serif;';
pointsLabel.style.fontSize = '1.5vw';
pointsLabel.style.margin = '1vw';
pointsLabel.style.marginLeft = '1vw';
pointsLabel.style.marginRight = '1vw';
pointsLabel.style.color = 'white';
sliderContainer.appendChild(pointsLabel);

const pointsSlider = document.createElement('input');
pointsSlider.type = 'range';
pointsSlider.min = '500';
pointsSlider.max = '1000';
pointsSlider.value = '950';
pointsSlider.style.width = '70%';
pointsSlider.style.marginLeft = '1vw';
pointsSlider.style.marginRight = '1vw';


pointsSlider.style.border = 'none';
pointsSlider.style.outline = 'none';
pointsSlider.style.cursor = 'ew-resize';
pointsSlider.className = 'custom-slider';


sliderContainer.appendChild(pointsSlider);


uiElement.appendChild(sliderContainer);

pointsSlider.addEventListener('input', () => {
    const points = +pointsSlider.value;
    PPT = points;
    pointsLabel.textContent = 'Points per Question: ' + points;
});

const header3 = document.createElement('h2');
header3.textContent = 'ANSWERING';
header3.style.display = 'block';
header3.style.margin = '1vw';
header3.style.textAlign = 'center';
header3.style.fontFamily = '"Montserrat", "Noto Sans Arabic", "Helvetica Neue", Helvetica, Arial, sans-serif;';
header3.style.fontSize = '2vw';
header3.style.color = 'white';
header3.style.textShadow = `
  -1px -1px 0 rgb(47, 47, 47),
  1px -1px 0 rgb(47, 47, 47),
  -1px 1px 0 rgb(47, 47, 47),
  1px 1px 0 rgb(47, 47, 47)
`;

uiElement.appendChild(header3);

const autoAnswerSwitchContainer = document.createElement('div');
autoAnswerSwitchContainer.className = 'switch-container';
autoAnswerSwitchContainer.style.display = 'flex';
autoAnswerSwitchContainer.style.alignItems = 'center';
autoAnswerSwitchContainer.style.justifyContent = 'center';
uiElement.appendChild(autoAnswerSwitchContainer);

const autoAnswerLabel = document.createElement('span');
autoAnswerLabel.textContent = 'Auto Answer';
autoAnswerLabel.className = 'switch-label';
autoAnswerLabel.style.fontFamily = '"Montserrat", "Noto Sans Arabic", "Helvetica Neue", Helvetica, Arial, sans-serif;';
autoAnswerLabel.style.fontSize = '1.5vw';
autoAnswerLabel.style.color = 'white';
autoAnswerLabel.style.margin = '2.5vw'
autoAnswerSwitchContainer.appendChild(autoAnswerLabel);

const autoAnswerSwitch = document.createElement('label');
autoAnswerSwitch.className = 'switch';
autoAnswerSwitchContainer.appendChild(autoAnswerSwitch);

const autoAnswerInput = document.createElement('input');
autoAnswerInput.type = 'checkbox';
autoAnswerInput.addEventListener('change', function() {
    autoAnswer = this.checked;
    info.ILSetQuestion = info.questionNum
});
autoAnswerSwitch.appendChild(autoAnswerInput);

const autoAnswerSlider = document.createElement('span');
autoAnswerSlider.className = 'slider';
autoAnswerSwitch.appendChild(autoAnswerSlider);

const showAnswersSwitchContainer = document.createElement('div');
showAnswersSwitchContainer.className = 'switch-container';
showAnswersSwitchContainer.style.display = 'flex';
showAnswersSwitchContainer.style.alignItems = 'center';
showAnswersSwitchContainer.style.justifyContent = 'center';
uiElement.appendChild(showAnswersSwitchContainer);

const showAnswersLabel = document.createElement('span');
showAnswersLabel.textContent = 'Show Answers';
showAnswersLabel.className = 'switch-label';
showAnswersLabel.style.fontFamily = '"Montserrat", "Noto Sans Arabic", "Helvetica Neue", Helvetica, Arial, sans-serif;';
showAnswersLabel.style.fontSize = '1.5vw';
showAnswersLabel.style.color = 'white';
showAnswersLabel.style.margin = '2.5vw'
showAnswersSwitchContainer.appendChild(showAnswersLabel);

const showAnswersSwitch = document.createElement('label');
showAnswersSwitch.className = 'switch';
showAnswersSwitchContainer.appendChild(showAnswersSwitch);

const showAnswersInput = document.createElement('input');
showAnswersInput.type = 'checkbox';
showAnswersInput.addEventListener('change', function() {
    showAnswers = this.checked;
});
showAnswersSwitch.appendChild(showAnswersInput);

const showAnswersSlider = document.createElement('span');
showAnswersSlider.className = 'slider';
showAnswersSwitch.appendChild(showAnswersSlider);


const style = document.createElement('style');
style.textContent = `
.custom-slider {
    background: white
    border: none;
    outline: none;
    cursor: ew-resize;
    appearance: none; 
    height: 0; 
}

.custom-slider::-webkit-slider-thumb {
    appearance: none; 
    width: 1.75vw; 
    height: 1.75vw; 
    background-color: rgb(47, 47, 47); 
    border-radius: 50%; 
    cursor: ew-resize; 
    margin-top: -0.5vw; 
}

.custom-slider::-webkit-slider-runnable-track {
    width: 100%; 
    height: 0.75vw; 
    background-color: white; 
    cursor: ew-resize; 
    border-radius: 1vw; 
    background: linear-gradient(to right, red, yellow, limegreen); 
}



:root {
  --switch-width: 5.9vw;
  --switch-height: 3.3vw;
  --slider-size: 2.5vw;
  --slider-thumb-size: 1.3vw;
}

.switch {
  position: relative;
  display: inline-block;
  width: var(--switch-width);
  height: var(--switch-height);
  margin: 2.5vw;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: red;
  transition: 0.8s;
  border-radius: .5vw
}

.slider:before {
  position: absolute;
  content: "";
  height: var(--slider-size);
  width: var(--slider-size);
  left: calc(var(--slider-thumb-size) / 3);
  bottom: calc(var(--slider-thumb-size) / 3);
  background-color: rgb(43, 43, 43);
  transition: 0.8s;
  border-radius: .5vw
}

input:checked + .slider {
  background-color: green;
}

input:focus + .slider {
  box-shadow: 0 0 1px green;
}

input:checked + .slider:before {
  transform: translateX(calc(var(--slider-size)));
}

`;
document.head.appendChild(style);

const header4 = document.createElement('h2');
header4.textContent = 'INFO';
header4.style.display = 'block';
header4.style.margin = '1vw';
header4.style.textAlign = 'center';
header4.style.fontFamily = '"Montserrat", "Noto Sans Arabic", "Helvetica Neue", Helvetica, Arial, sans-serif;';
header4.style.fontSize = '2vw';
header4.style.color = 'white';
header4.style.textShadow = `
  -1px -1px 0 rgb(47, 47, 47),
  1px -1px 0 rgb(47, 47, 47),
  -1px 1px 0 rgb(47, 47, 47),
  1px 1px 0 rgb(47, 47, 47)
`;

uiElement.appendChild(header4)

const questionsLabel = document.createElement('span');
questionsLabel.textContent = 'Question 0 / 0';
questionsLabel.style.display = 'block';
questionsLabel.style.fontFamily = '"Montserrat", "Noto Sans Arabic", "Helvetica Neue", Helvetica, Arial, sans-serif;';
questionsLabel.style.fontSize = '1.5vw';
questionsLabel.style.textAlign = 'center';
questionsLabel.style.margin = '1vw';
questionsLabel.style.marginLeft = '1vw';
questionsLabel.style.marginRight = '1vw';
questionsLabel.style.color = 'white';
uiElement.appendChild(questionsLabel);

const inputLagLabel = document.createElement('span');
inputLagLabel.textContent = 'Input lag : 125 ms';
inputLagLabel.style.display = 'block';
inputLagLabel.style.fontFamily = '"Montserrat", "Noto Sans Arabic", "Helvetica Neue", Helvetica, Arial, sans-serif;';
inputLagLabel.style.fontSize = '1.5vw';
inputLagLabel.style.textAlign = 'center';
inputLagLabel.style.margin = '1vw';
inputLagLabel.style.marginLeft = '1vw';
inputLagLabel.style.marginRight = '1vw';
inputLagLabel.style.color = 'white';
uiElement.appendChild(inputLagLabel);

const versionLabel = document.createElement('h1');
versionLabel.textContent = 'KaHack! V'+Version;
versionLabel.style.fontFamily = '"Montserrat", "Noto Sans Arabic", "Helvetica Neue", Helvetica, Arial, sans-serif;';
versionLabel.style.fontSize = '2.5vw';
versionLabel.style.display = 'block';
versionLabel.style.textAlign = 'center';
versionLabel.style.marginTop = '3.5vw';
versionLabel.style.marginLeft = '1vw';
versionLabel.style.marginRight = '1vw';
versionLabel.style.color = 'white';
uiElement.appendChild(versionLabel);

const githubContainer = document.createElement('div');
githubContainer.style.textAlign = 'center';
githubContainer.style.marginTop = '1vw';

const githubLabel = document.createElement('span');
githubLabel.textContent = 'GitHub: ';
githubLabel.style.fontFamily = '"Montserrat", "Noto Sans Arabic", "Helvetica Neue", Helvetica, Arial, sans-serif;';
githubLabel.style.fontSize = '1.5vw';
githubLabel.style.margin = '0 1vw';
githubLabel.style.color = 'white';
githubContainer.appendChild(githubLabel);

const githubUrl = document.createElement('a');
githubUrl.textContent = 'LINKLang';
githubUrl.href = 'https://github.com/LINKLang';
githubUrl.target = '_blank';
githubUrl.style.fontFamily = '"Montserrat", "Noto Sans Arabic", "Helvetica Neue", Helvetica, Arial, sans-serif;';
githubUrl.style.fontSize = '1.5vw';
githubUrl.style.margin = '0 1vw';
githubUrl.style.color = 'white';
githubContainer.appendChild(githubUrl);

uiElement.appendChild(githubContainer);

closeButton.addEventListener('click', () => {
    document.body.removeChild(uiElement);
  	autoAnswer = false;
  	showAnswers = false;
});

let isMinimized = false;

minimizeButton.addEventListener('click', () => {
    isMinimized = !isMinimized;

    if (isMinimized) {
        header.style.display = 'none';
        header2.style.display = 'none';
        header3.style.display = 'none';
        header4.style.display = 'none';
        inputContainer.style.display = 'none';
        questionsLabel.style.display = 'none';
        versionLabel.style.display = 'none';
        inputLagLabel.style.display='none';
        githubContainer.style.display = 'none';

        sliderContainer.style.display = 'none';
        autoAnswerSwitchContainer.style.display = 'none';
        showAnswersSwitchContainer.style.display = 'none';

        uiElement.style.height = '2.5vw';
        handle.style.height = '100%';
        closeButton.style.height = '100%';
        minimizeButton.style.height = '100%';
    } else {
        header.style.display = 'block';
        header2.style.display = 'block';
        header3.style.display = 'block';
        header4.style.display = 'block';
        inputContainer.style.display = 'flex';
        questionsLabel.style.display = 'block';
        versionLabel.style.display = 'block';
        inputLagLabel.style.display='block';
        githubContainer.style.display = 'block';

        handle.style.height = '2.5vw';
        uiElement.style.height = 'auto';
        closeButton.style.height = '2.5vw';
        minimizeButton.style.height = '2.5vw';

        sliderContainer.style.display = 'flex';
        autoAnswerSwitchContainer.style.display = 'flex';
        showAnswersSwitchContainer.style.display = 'flex';
    }
});

// 解析问题函数，输入为问题的JSON数据
function parseQuestions(questionsJson){
    let questions = []
    questionsJson.forEach(function (question){
        let q = {type: question.type, time: question.time}
        if (['quiz', 'multiple_select_quiz'].includes(question.type)){
            var i = 0
            q.answers = []
            q.incorrectAnswers = []
            question.choices.forEach(function(choice){
                if (choice.correct) {
                    q.answers.push(i)
                } else {
                    q.incorrectAnswers.push(i)
                }
                i++
            })
        }
        if (question.type == 'open_ended') {
            q.answers = []
            question.choices.forEach(function(choice){
                q.answers.push(choice.answer)
            })
        }
        questions.push(q)
    })
    return questions
}

// 处理输入变化的函数
function handleInputChange() {
    const quizID = inputBox.value;
    const url = 'https://kahoot.it/rest/kahoots/' + quizID;

    if (quizID != "") {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('');
                }
                return response.json();
            })
            .then(data => {
                inputBox.style.backgroundColor = 'green'
                questions = parseQuestions(data.questions)
                info.numQuestions = questions.length
            })
            .catch(error => {
                inputBox.style.backgroundColor = 'red';
                info.numQuestions = 0
            });
    } else {
        inputBox.style.backgroundColor = 'white';
        info.numQuestions = 0
    }
}

// 添加事件监听器，当输入变化时调用 handleInputChange 函数
inputBox.addEventListener('input', handleInputChange);

// 将 UI 元素添加到文档主体
document.body.appendChild(uiElement);

let isDragging = false;
let offsetX, offsetY;
let waitAnswer=null;

// 处理鼠标按下事件，开始拖动
handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - uiElement.getBoundingClientRect().left;
    offsetY = e.clientY - uiElement.getBoundingClientRect().top;
});

// 处理鼠标移动事件，拖动元素
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        uiElement.style.left = x + 'px';
        uiElement.style.top = y + 'px';
    }
});

// 处理鼠标松开事件，停止拖动
document.addEventListener('mouseup', () => {
    isDragging = false;
});

// 当问题开始时调用的函数
function onQuestionStart(){
    console.log(inputLag)
    var question = questions[info.questionNum]
    if (showAnswers){
        toastShowAnswers(question)
    }
    if (autoAnswer){
        answer(question, (question.time - question.time / (500/(PPT-500))) - inputLag)
    }
}

function showToast(message, hideTimeLimit=3000, showWait=false) {
    if (toastDisabled) {waitAnswer=message; console.log(`waitanswer ${waitAnswer}`); return;}
    if (showWait && waitAnswer !== null) {console.log(`, \n\nWait to show answer is ${waitAnswer}`); message[0]+=`, \n\nWait to show answer is ${waitAnswer}`; console.log(message); waitAnswer=null;}
    const toast = document.createElement('div');
    toast.className = 'AnswerToast'
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '10px 20px';
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    toast.style.color = 'white';
    toast.style.borderRadius = '5px';
    toast.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    toast.style.zIndex = '9999';
    toast.style.fontSize = '16px';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s';
    
    var answer = "";
    for (let index = 1; index < message.length+1; index++) {
        // if (index != 1) {
        //     answer += ' ][ ';
        // }
        answer += `[ Q${index}: ${message[index-1]} ]`;
    }
    toast.textContent = answer;

    // 检查是否有存在的toast元素
    const existeToast = document.querySelector("div[class*='AnswerToast']");
    if(existeToast){
        existeToast.style.opacity = '0';
        setTimeout(() => {
            existeToast.parentNode.removeChild(existeToast);
        }, 500);
    }

    // 向body添加toast元素
    document.body.appendChild(toast);

    // 设置toast元素延迟1000毫秒后透明度变为1
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 1000);

    // 设置toast元素 hideTimeLimit 秒后透明度变为0，并从页面中移除
    // const hideTimeout = setTimeout(() => {
    //     toast.style.opacity = '0';
    //     setTimeout(() => {
    //         document.body.removeChild(toast);
    //     }, 500);
    // }, hideTimeLimit);

    // 为toast元素添加点击事件，点击后禁用toast，清除定时器，透明度变为0，并从页面中移除
    toast.addEventListener('click', () => {
        localStorage.setItem('toastDisabled', 'true');
        toastDisabled = localStorage.getItem('toastDisabled') === 'true';
        waitAnswer=message; console.log(`waitanswer ${waitAnswer}`);
        console.log('Toasts disabled');
        // clearTimeout(hideTimeout);
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 500);
    });
}

// 高亮正确和错误答案的函数
function toastShowAnswers(question){
    question.answers.forEach(function (answer) {
        setTimeout(function() {
            if(answer==0){
                showToast(["First"]);
            } else if (answer==1) {
                showToast(["Second"]);
            } else if (answer==2) {
                showToast(["Third"]);
            } else if (answer==3) {
                showToast(["Fourth"]);
            }
        }, 0)
    })
}

// 自动回答问题的函数
function answer(question, time) {
    Answered_PPT = PPT

    var delay = 0
    if (question.type == 'multiple_select_quiz') delay = 60
    setTimeout(function() {
        if (question.type == 'quiz') {
            const key = (+question.answers[0] + 1).toString();
            const event = new KeyboardEvent('keydown', { key });
            window.dispatchEvent(event);
        }
        if (question.type == 'multiple_select_quiz') {
            question.answers.forEach(function (answer) {
                setTimeout(function() {
                    const key = (+answer + 1).toString();
                    const event = new KeyboardEvent('keydown', { key });
                    window.dispatchEvent(event);
                }, 0)
            })
            setTimeout(function() {
                FindByAttributeValue("data-functional-selector", 'multi-select-submit-button', "button").click()
            }, 0)
        }
    }, time - delay)
}

let isHidden = false;
if (isHidden === null) {
    isHidden = false;
    localStorage.setItem('isHidden', 'false');
} else {
    isHidden = isHidden === 'true';
}

// 添加键盘事件监听器，处理隐藏和删除 UI 元素
document.addEventListener('keydown', (event) => {
    if (event.key == "h" && event.altKey) {
        isHidden = !isHidden
    }

    if (event.key == "x" && event.altKey) {
        document.body.removeChild(uiElement);
        autoAnswer = false;
        showAnswers = false;
    }

    if (event.ctrlKey && event.key === 'b') {
        localStorage.setItem('toastDisabled', 'false');
        toastDisabled = localStorage.getItem('toastDisabled') === 'true';
        console.log('Toasts re-enabled');
        showToast(['Toasts re-enabled'], undefined, true);
    }

    if (isHidden) {
        uiElement.style.display = 'none'
    } else {
        uiElement.style.display = 'block'
    }
})

// 定时器函数，每1毫秒执行一次，更新信息
setInterval(function () {
    var textElement = FindByAttributeValue("data-functional-selector", "question-index-counter", "div")
    if (textElement) {
        info.questionNum = +textElement.textContent - 1
    }
    if (FindByAttributeValue("data-functional-selector", 'answer-0', "button") && info.lastAnsweredQuestion != info.questionNum) {
        info.lastAnsweredQuestion = info.questionNum
        onQuestionStart()
    }
    if (autoAnswer) {
        if (info.ILSetQuestion != info.questionNum) {
            var ppt = Answered_PPT
            if (ppt > 987) ppt = 1000
            var incrementElement = FindByAttributeValue("data-functional-selector", "score-increment", "span")
            if (incrementElement) {
                info.ILSetQuestion = info.questionNum
                var increment = +incrementElement.textContent.split(" ")[1]
                if (increment != 0) {
                    inputLag += (ppt - increment) * 15
                    if (inputLag < 0) {
                        inputLag -= (ppt - increment) * 15
                        inputLag += (ppt - increment / 2) * 15
                    }
                    inputLag = Math.round(inputLag)
                }
            }
        }
    }
    questionsLabel.textContent = 'Question ' + (info.questionNum + 1) + ' / ' + info.numQuestions;
    inputLagLabel.textContent = 'Input lag : ' + inputLag + ' ms';
}, 1)
