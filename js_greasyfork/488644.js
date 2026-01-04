// ==UserScript==
// @name         ZyBooks auto
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Automatically do ZyBooks
// @author       adorejc
// @match        https://*.zybooks.com/*
// @grant        none
// @supportURL   https://github.com/AdoreJc/ZyBooks_auto/issues
// @license      MIT
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/488644/ZyBooks%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/488644/ZyBooks%20auto.meta.js
// ==/UserScript==

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForElement(elementString, timeout){
    const startTime = Date.now();
    let element = document.querySelector(elementString);
    while (element === null) {
        await sleep(100);
        element = document.querySelector(elementString);
        if (element !== null) return true;
        if (Date.now() - startTime >= timeout) {
            return false;
        }
    }
    return true;
}

async function goToNext(){
    let next = document.querySelector(".nav-text.next");
    await next.click();
    await sleep(1000);
    await waitForElement(".nav-text.next", 5000);
    console.log("Ass");
}

async function main() {
    try {
        await solvePage();
        await solveMultipleChoice();
        while (true) {
            await sleep(1000);
            try {
                await solveMultipleChoice();
            } catch (err) {
                console.error("Error in solveMultipleChoice:", err);
            }
            try {
                await solveDrapAndDrop();
            } catch (err) {
                console.error("Error in solveDrapAndDrop:", err);
            }
            if (await isCompleteExceptChallenge()) {
                await goToNext();
                await sleep(1000);

                try {
                    await solveMultipleChoice();
                } catch (err) {
                    console.error("Error in solveMultipleChoice after goToNext:", err);
                }
            }
        }
    } catch (err) {
        console.error("Error in main function:", err);
    }
}

async function isComplete(){
    let chevrons = Array.from(document.getElementsByClassName("zb-chevron"));
    let complete = true;
    await chevrons.forEach((i)=>{
        if(!i.classList.contains("filled")){
            complete = false;
        }
    });
    return complete;
}

async function isCompleteExceptChallenge(){
    let participation = Array.from(document.querySelectorAll(".interactive-activity-container.participation"));
    let chevrons = [];
    participation.forEach((i)=>{
        let chevs = Array.from(i.getElementsByClassName("zb-chevron"));
        chevs.forEach((j)=>{
            chevrons.push(j);
        })
    })
    let complete = true;
    await chevrons.forEach((i)=>{
        if(!i.classList.contains("filled")){
            complete = false;
        }
    });
    return complete;
}
//Check if the question is completed
function isQuestionCompleted(questionElement) {
    const completedIndicator = questionElement.querySelector('div[aria-label="Question completed"]');
    return completedIndicator !== null;
}


async function solveDrapAndDrop(){
    let activities = document.querySelectorAll(".interactive-activity-container.participation.custom-content-resource");
    for(let i=0;i<activities.length;i++){
        let draggables = Array.from(activities[i].querySelectorAll(".draggable-object"));
        let targets = activities[i].querySelectorAll(".draggable-object-target.definition-drag-container");
        for(let j=0;j<draggables.length;j++){
            for(let k=0;k<targets.length;k++){
                if(targets[k].querySelector(".term-bucket").classList.contains("populated")) continue;
                await simulateDragAndDrop(draggables[j], targets[k]);
                await sleep(100);
                draggables[j] = targets[k].querySelector(".draggable-object");
                // console.log(targets[k].querySelector(".draggable-object"));
                // console.log(draggables[j]);
                let correcto = targets[k].parentElement.querySelector(".correct");
                if(correcto){
                    break;
                }
            }
        }
    }
}


async function simulateDragAndDrop(sourceNode, destinationNode) {
    const EVENT_TYPES = {
        DRAG_END: 'dragend',
        DRAG_START: 'dragstart',
        DROP: 'drop'
    }
    const dataTransfer = new MyDataTransfer();

    function createCustomEvent(type) {
        const event = new CustomEvent(type, { bubbles: true, cancelable: true });
        event.dataTransfer = dataTransfer;
        return event;
    }

    let events = [];

    // let myDataTransfer = new MyDataTransfer();
    events.push(createCustomEvent(EVENT_TYPES.DRAG_START));

    events.push(createCustomEvent(EVENT_TYPES.DROP));

    // Dispatch dragstart and dragend events on the sourceNode
    events.forEach((event) => sourceNode.dispatchEvent(event));

    const dropEvent = createCustomEvent(EVENT_TYPES.DROP);
    destinationNode.dispatchEvent(dropEvent);
}


class MyDataTransfer {
    constructor() {
        this.dropEffect = "all";
        this.effectAllowed = "all";
        this.files = [];
        this.items = new DataTransferItemList();
        this.types = [];
    }
    setData(format, data) {
        this.data[format] = data;
    }
    getData(format) {
        return this.data[format];
    }
    clearData(format = null) {
        if (format) {
            delete this.data[format];
        } else {
            this.data = {};
        }
    }
    clearData(type) {
        if (type) {
            const index = this.types.indexOf(type);
            if (index !== -1) {
                this.types.splice(index, 1);
            }
        } else {
            this.types = [];
        }
    }

    getData(type) {
        const index = this.types.indexOf(type);
        return index !== -1 ? this.items[index].data : '';
    }

    setData(type, data) {
        const index = this.types.indexOf(type);
        if (index !== -1) {
            this.items[index].data = data;
        } else {
            this.types.push(type);
            this.items.add(new DataTransferItem(type, data));
        }
    }

    setDragImage(imageElement, x, y) {
        // Implement the setDragImage functionality here
    }
}

class DataTransferItem {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}

class DataTransferItemList extends Array {
    add(item) {
        this.push(item);
    }
}

//Solve multiple choice questions
async function solveMultipleChoice() {
    var mulChoice;
    // Get Motiple questions
    mulChoice = Array.from(document.querySelectorAll(".question-set-question.multiple-choice-question.ember-view"));
    if (mulChoice.length === 0) {
        console.log("No multiple choice questions found.");
        return;
    }

    for (const i of mulChoice) {
        if (isQuestionCompleted(i)) {
            console.log("Skip finished question");
            continue;
        }
        let choices = Array.from(i.querySelectorAll("input"));

        for (const choice of choices) {
            choice.click();
            await sleep(300);

            let explanation;
            for (let attempt = 0; attempt < 10; attempt++) {
                explanation = i.querySelector(".zb-explanation");
                if (explanation && explanation.classList.contains("correct")) {
                    console.log("Correct answer found");
                    break;
                }
                await sleep(300);
            }

            if (explanation && explanation.classList.contains("correct")) {
                break;
            }
        }
    }
}

async function playAnimationStart() {
    const playAnimation = document.querySelectorAll('.interactive-activity-container.animation-player-content-resource.participation.large.ember-view');
    for (const i of pkayAnimation){
        if (activityType) {
            const startButton = document.querySelector('.zb-button.primary.raised.start-button.start-graphic');

            if (startButton && startButton.textContent.trim() === "Start") {
                startButton.click();
            }
        }
    }

}

//Check Play button state
async function waitForButtonChange(btnDiv) {
    while (!btnDiv.classList.contains('rotate-180') && btnDiv.classList.contains('bounce')) {
        await sleep(500);
    }
}


async function solvePage(){
    let adone = false;
    let tdone = false;
    var e;
    var s;
    var c;
    var a;
    var f;
    var t;
    var mulChoice;

    //answer multiple choice
    mulChoice = Array.from(document.querySelectorAll(".question-set-question.multiple-choice-question.ember-view"));
    for(const i of mulChoice){
        let choices = Array.from(i.querySelectorAll("input"));
        // await sleep(100);

        for(const choice of choices) {
            let explanation = i.querySelector(".zb-explanation");
            if(!explanation?.classList) {
                console.log("explanation",explanation);
                console.log("i: ",i);
                break;
            };
            let click = !explanation.classList.contains("correct");
            if(click){
                console.log(click)
                choice.click();
                await sleep(100);
                explanation = i.querySelector(".zb-explanation");
            }
        }
    };

    async function zy() {
        function setKeywordText(text, element) {
            var el = element;
            el.value = text;
            var evt = document.createEvent("Events");
            evt.initEvent("change", true, true);
            el.dispatchEvent(evt);
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function decodeHtml(html) {
            var txt = document.createElement("textarea");
            txt.innerHTML = html;
            return txt.value;
        }
        // Slideshow play
        e = Array.from(document.getElementsByClassName("zb-button"));
        // start button
        s = Array.from(document.getElementsByClassName("title"));
        // 2x speed button
        c = Array.from(document.getElementsByClassName("speed-control"));

        // Start Slideshow
        e.forEach((i)=>{
            if (i.ariaLabel == "Play" && !i.children[0].classList.contains('rotate-180')){
                i.click();
            }
        });
        //Continue slideshow
        s.forEach((i)=>{
            if (i.innerHTML == "Start"){
                i.click();
            }
        });
        // Click 2x speed
        c.forEach((i)=>{
            if (i.children[0].children[0].checked==false){
                i.children[0].children[0].click();
            }
        });
        let questions = Array.from(document.getElementsByClassName("question-set-question"));
        for (const question of questions) {
            let completionStatus = question.querySelector(".question-chevron");
            if (completionStatus && completionStatus.classList.contains("filled")) {
                console.log("Skipping completed question.");
                continue;
            }
            let showAnswerButton = question.querySelector(".show-answer-button");
            if (showAnswerButton) {
                showAnswerButton.click();
                await sleep(300)
            }
            let answers = Array.from(question.getElementsByClassName("forfeit-answer"));
            let textArea = question.querySelector(".ember-text-area");

            if (answers.length > 0 && textArea) {
                let answerText = answers.map(answer => decodeHtml(answer.innerText)).join(" or ");
                setKeywordText(answerText, textArea);
                await sleep(100);

                let checkButton = question.querySelector(".check-button");
                if (checkButton) {
                    checkButton.click();
                    await sleep(300);
                }
            }
        }
    }
    setInterval(zy, 2000);

}

main();
