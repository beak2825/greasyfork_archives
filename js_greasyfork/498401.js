// ==UserScript==
// @name        Boomcards Cheat
// @icon       https://play-lh.googleusercontent.com/1l_DLLvpHgaBZnuBqO6sl4zPHw_7TRlD1Qeq_aq251jlKAGfYPkF-VwPPd3ttPmNfA
// @namespace   Violentmonkey Scripts
// @match       https://wow.boomlearning.com/*
// @grant       none
// @version     1.2
// @author      Angelo The Fig
// @description 1/18/2024, 2:42:45 PM
// @downloadURL https://update.greasyfork.org/scripts/498401/Boomcards%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/498401/Boomcards%20Cheat.meta.js
// ==/UserScript==

let bool = false;
let bool2 = false;
let hidden = true;
let InterVal;
let InterVal2;

function AutoAnswer() {
    const PlayAgainBtn = document.getElementsByClassName("done-playDeck");
    const TextField = document.getElementById("blank_" + getAnswersList(currentCardDoc()));
    const incorrect = document.getElementsByClassName("s-alert-error");
    const SubmitBtn = document.getElementById("play-submit");
    const CardIds = getAnswersList(currentCardDoc());

    if (PlayAgainBtn[0] && PlayAgainBtn[0].style.display == "block") {
        if (bool) {
            document.getElementById("autoAns").click();
        }
        if (bool2) {
            document.getElementById("highLightBtn").click();
        }
    };
  

    document.getElementById(getCorrectAnswersList(currentCardDoc())).click();

  
    if (TextField) {
        showAnswers(currentCardDoc())
        const indexDotComma = TextField.value.indexOf(".,");
        const indexComma = TextField.value.indexOf(",");

        if (incorrect.length === 0) {
            if (indexDotComma !== -1) {
                TextField.value = TextField.value.substring(0, indexDotComma);
            } else if (indexComma !== -1) {
                TextField.value = TextField.value.substring(0, indexComma);
            }
        } else {
            if (indexDotComma !== -1 && indexComma !== -1) {
                TextField.value = TextField.value.substring(indexComma + 1, indexDotComma);
            } else if (indexComma !== -1) {
                TextField.value = TextField.value.substring(indexComma + 1);
            }
        }
    };
  

    if (TextField && TextField.value == ".,") {
        const s = document.getElementById("autoAns");
        s.click();
        setTimeout(() => { s.click();
        }, 1600)
    };


    CardIds.forEach(function(cardId) {
        const Option = document.getElementById(cardId);
        const tArray = Array.from(Option.classList);

        tArray.forEach(function(className) {
            if (className.startsWith("wants-")) {
                Option.classList.add('drop-' + className.slice('wants-'.length));
            }
        });
    });

  
    if (SubmitBtn) {
        SubmitBtn.click();
    };
  

    if (incorrect[2]) {
        completeLesson();
        for (i = 0; i < incorrect.length; i++) {
            incorrect[i].remove();
        }
    }
};

function HighlightAnswers() {
    let Options = document.getElementsByClassName("eo_edit");
    let AnswerID = document.getElementById(getCorrectAnswersList(currentCardDoc()));
    let PlayAgainBtn = document.getElementsByClassName("done-playDeck");
    let IncorrectAnswerColor = document.getElementById("IncorrectColor");
    let CorrectAnswerColor = document.getElementById("CorrectColor");

    if (PlayAgainBtn[0].style.display == "block") {
        if (bool) {
            document.getElementById("autoAns").click();
        }
        if (bool2) {
            document.getElementById("highLightBtn").click();
        }
    };

    for (let i = 0; i < Options.length; i++) {
        let Option = Options[i];
        let parentElement = Option.parentNode;

        if (parentElement === AnswerID && parentElement.classList.contains("ol_answer")) {
            Option.style.backgroundColor = CorrectAnswerColor.value || "green";
        } else if (parentElement !== AnswerID && parentElement.classList.contains("ol_answer")) {
            Option.style.backgroundColor = IncorrectAnswerColor.value || "darkred";
        }
    }
};

const CheatUI = document.createElement("div");
CheatUI.id = "CheatUI";
document.body.append(CheatUI);

const OpenCheat = document.createElement("button")
OpenCheat.id = "OpenCheat";
OpenCheat.textContent = ">";
CheatUI.append(OpenCheat);

const CheatHeader = document.createElement("div");
CheatHeader.id = "CheatHeader";
CheatHeader.textContent = "Boom Learning\r\nCheat";
CheatUI.append(CheatHeader);

const credits = document.createElement("h1");
credits.id = "credits";
credits.textContent = "Made By\r\nMewtwo"
CheatUI.append(credits);

const autoAnsDiv = document.createElement("div");
autoAnsDiv.id = "autoAnsDiv"
CheatUI.append(autoAnsDiv);

const autoAns = document.createElement("button");
autoAns.id = "autoAns";
autoAns.className = "CheatBtn";
autoAns.textContent = "Auto Answer";
autoAnsDiv.append(autoAns);

const speedSlider = document.createElement("input");
speedSlider.id = "speedSlider";
speedSlider.setAttribute("type", "range");
speedSlider.setAttribute("min", "200");
speedSlider.setAttribute("max", "5000");
speedSlider.setAttribute("value", "1000");
speedSlider.setAttribute("step", "100");
autoAnsDiv.append(speedSlider);

const answerRate = document.createElement("div");
answerRate.id = "answerRate";
answerRate.textContent = "Answer Delay:\r\n" + speedSlider.value / 1000 + " seconds";
autoAnsDiv.append(answerRate);

const highLightDiv = document.createElement("div");
highLightDiv.id = "highLightDiv";
CheatUI.append(highLightDiv);

const highLightBtn = document.createElement("button");
highLightBtn.id = "highLightBtn";
highLightBtn.className = "CheatBtn"
highLightBtn.textContent = "Highlight Answers";
highLightDiv.append(highLightBtn);

const IncorrectColor = document.createElement("input");
IncorrectColor.id = "IncorrectColor";
IncorrectColor.className = "TextInput";
IncorrectColor.placeholder = "Incorrect color:"
highLightDiv.append(IncorrectColor);

const CorrectColor = document.createElement("input");
CorrectColor.id = "CorrectColor";
CorrectColor.className = "TextInput";
CorrectColor.placeholder = "Correct color:"
highLightDiv.append(CorrectColor);

const answerQuestion = document.createElement("button");
answerQuestion.id = "answerQuestion";
answerQuestion.className = "CheatBtn";
answerQuestion.textContent = "Answer Question";
CheatUI.append(answerQuestion);

const SkipButton = document.createElement("button");
SkipButton.id = "SkipButton";
SkipButton.className = "CheatBtn";
SkipButton.textContent = "Skip Question";
CheatUI.append(SkipButton);

const CheatStyle = document.createElement("style");
document.head.appendChild(CheatStyle);
CheatStyle.textContent = `
    #OpenCheat {
        background-color: #001524;
        height: 160px;
        width: 66px;
        font-size: 42px;
        font-family: Raleway;
        font-weight: 600;
        color: #fff;
        text-align: right;
        border: 5px solid transparent;
        border-radius: 0px 7px 7px 0px;
        visibility: visible;
        left: 220px;
        bottom: 35%;
        position: absolute;
        z-index: 999;
        cursor: pointer;
        box-shadow: 3px 2px 20px 3px #001524;
    }

    #CheatUI {
        background-color: #001524;
        height: 100%;
        width: 220px;
        position: absolute;
        align-items: center;
        z-index: 1100;
        padding-bottom: 10px;
        left: -244px;
        bottom: 0%;
        box-shadow: 0px 5px 20px 7px #001524;
    }

    #credits {
        font-size: 20px;
        font-family: Raleway;
        font-weight: 600;
        color: #fff;
        text-align: center;
        margin: 20px;
        white-space: pre-line;
    }

    #CheatHeader {
        background-color: #0074c7;
        color: #fff;
        font-family: Raleway;
        font-size: 22px;
        font-weight: 600;
        top: 0%;
        height: 60px;
        width: 100%;
        margin: auto;
        padding-top: 9px;
        white-space: pre-line;
        text-align: center;
        z-index: 1000;
    }

    #speedSlider {
        height: 67px;
        width: 90%;
        left: 17%;
        margin-top: 17px;
        background-color: #001524;
        border: 5px solid transparent;
        border-radius: 8px;
        outline: none;
        opacity: 1;
    }

    #speedSlider::-webkit-slider-thumb {
        height: 31px;
        width: 9px;
        background-color: #fff;
        border: 2px solid transparent;
        border-radius: 10px;
        transition: background-color 0.3s ease;
        cursor: ew-resize;
        opacity: 1;
    }

    #answerRate {
        height: 60px;
        width: 91%;
        background-color: #001524;
        border: 5px solid transparent;
        border-radius: 7px;
        color: #fff;
        margin: auto;
        margin-top: 6px;
        font-family: Raleway;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
        white-space: pre-line;
        position: relative;
        z-index: 1010;
        cursor: auto;
        opacity: 1;
    }

    #autoAnsDiv {
        background-color: #00477b;
        color: #C60000;
        border: 5px solid transparent;
        border-radius: 7px;
        height: 260px;
        width: 180px;
        font-family: Raleway;
        font-size: 16px;
        font-weight: 600;
        margin: auto;
        text-align: center;
        cursor: auto;
        display: block;
        margin-top: 20px;
        position: relative;
        opacity: 1;
    }

    #highLightDiv {
        background-color: #00477b;
        color: #C60000;
        border: 5px solid transparent;
        border-radius: 7px;
        height: 280px;
        width: 180px;
        font-family: Raleway;
        font-size: 16px;
        font-weight: 600;
        margin: auto;
        text-align: center;
        cursor: auto;
        display: block;
        margin-top: 20px;
        position: relative;
        opacity: 1;
    }

    #autoAns, #highLightBtn {
        background-color: #001524;
        color: #C60000;
        border: 5px solid transparent;
        border-radius: 7px;
        height: 67px;
        width: 90%;
        font-family: Raleway;
        font-size: 16px;
        font-weight: 600;
        margin: auto;
        text-align: center;
        cursor: pointer;
        display: block;
        margin-top: 20px;
        z-index: 1000;
        opacity: 1;
    }

    .TextInput {
        background-color: #fff;
        color: #000;
        border: 5px solid transparent;
        border-radius: 7px;
        height: 67px;
        width: 90%;
        font-family: Raleway;
        font-size: 16px;
        font-weight: 600;
        margin: auto;
        text-align: center;
        cursor: pointer;
        display: block;
        margin-top: 20px;
        z-index: 1000;
        opacity: 1;
    }

    #SkipButton, #answerQuestion {
        background-color: #0074c7;
        color: #fff;
        border: 5px solid transparent;
        border-radius: 7px;
        height: 67px;
        width: 180px;
        font-family: Raleway;
        font-size: 16px;
        font-weight: 600;
        margin: auto;
        text-align: center;
        cursor: point;
        display: block;
        margin-top: 20px;
        z-index: 1000;
        opacity: 1;
    }


    @keyframes slide-in {
        from {
            left: -244px;
        }
        to {
            left: -5px;
        }
    }

    @keyframes slide-out {
        from {
            left: -5px;
        }
        to  {
            left: -244px;
        }
    }
`

OpenCheat.onclick = function() {
    hidden = !hidden;

    if (!hidden) {
        CheatUI.style.animation = "slide-in 0.8s";
        OpenCheat.textContent = "<";
        CheatUI.append(OpenCheat);
        setTimeout(() => {
            CheatUI.style.left = "-5px"
        }, 600);
    } else {
        CheatUI.style.animation = "slide-out 0.8s";
        OpenCheat.textContent = ">";
        setTimeout(() => {
            CheatUI.style.left = "-244px"
        }, 600);
    }
};

autoAns.onclick = function() {
    bool = !bool;

    if (bool) {
        InterVal = setInterval(AutoAnswer, speedSlider.value);
        speedSlider.addEventListener("input", function() {
            clearInterval(InterVal);
            if (bool) {
                InterVal = setInterval(AutoAnswer, speedSlider.value);
            }
        });
        this.style.color = "#00AF57";
    } else {
        clearInterval(InterVal);
        this.style.color = "#C60000";
    }
};

speedSlider.addEventListener("input", function() {
    answerRate.textContent = "Answer Delay:\r\n" + speedSlider.value / 1000 + " seconds";
});

highLightBtn.onclick = function() {
    bool2 = !bool2;
    let Options = document.getElementsByClassName("eo_edit");

    if (bool2) {
        InterVal2 = setInterval(HighlightAnswers, 200);
        this.style.color = "#00AF57";
    } else {
        clearInterval(InterVal2);
        this.style.color = "#C60000";

        for (i = 0; i < Options.length; i++) {
            Options[i].style.backgroundColor = "white"
        }
    }
};

answerQuestion.onclick = function() {
    AutoAnswer();
};

SkipButton.onclick = function() {
    completeLesson();
};