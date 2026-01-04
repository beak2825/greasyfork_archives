// ==UserScript==
// @name         KhanHack Beta
// @namespace    https://greasyfork.org/users/783447
// @version      6.0
// @description  Khan Academy Answer Hack
// @author       Logzilla6 - IlyTobias - Illusions
// @match        https://*.khanacademy.org/*
// @icon         https://i.ibb.co/K5g1KMq/Untitled-drawing-3.png
// @downloadURL https://update.greasyfork.org/scripts/510192/KhanHack%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/510192/KhanHack%20Beta.meta.js
// ==/UserScript==

//ALL FOLLOWING CODE IS UNDER THE KHANHACK TRADEMARK. UNAUTHORIZED DISTRIBUTION CAN/WILL RESULT IN LEGAL ACTION

//Note that KhanHack™ is an independent initiative and is not affiliated with or endorsed by Khan Academy. We respect the work of Khan Academy and its mission to provide free education, but KhanHack™ operates separately with its own unique goals.


let mainMenu = document.createElement('div');
mainMenu.id = 'mainMenu';
mainMenu.style.position = 'fixed';
mainMenu.style.bottom = '.5vw';
mainMenu.style.left = '19vw';
mainMenu.style.width = '300px';
mainMenu.style.height = '400px';
mainMenu.style.backgroundColor = '#123576';
mainMenu.style.border = '3px solid #07152e';
mainMenu.style.borderRadius = '20px';
mainMenu.style.padding = '10px';
mainMenu.style.color = "white";
mainMenu.style.fontFamily = "Noto sans";
mainMenu.style.fontWeight = "500";
mainMenu.style.transition = "all 0.3s ease";
mainMenu.style.zIndex = '1000';
mainMenu.style.display = 'flex';
mainMenu.style.flexDirection = 'column';

let answerBlocks = [];
let currentCombinedAnswer = '';
if (!localStorage.getItem("khs")) {
  localStorage.setItem("khs", false)
}
if (!localStorage.getItem("farmCount")) {
  localStorage.setItem("farmCount", 0)
}
if (!localStorage.getItem("userPoints")) {
  localStorage.setItem("userPoints", 0)
}
console.log(localStorage.getItem('userPoints'))
let autoAnswer = localStorage.getItem("khs");
let pointFarmer = localStorage.getItem("khs2");
let isGhostModeEnabled = false;
let blockTick = 0;
let firstAns;
let secondAns;
let finalPoints;
let farmCount = 0;

const setMainMenuContent = () => {
    mainMenu.innerHTML =`
        <div id="menuContent" style="display: flex; flex-direction: column; align-items: center; gap: 10px; opacity: 1; transition: opacity 0.5s ease; height: 100%;">
            <head>
                <img id="discordIcon" src="https://i.ibb.co/grF973h/discord.png" alt="Discord" style="position: absolute; left: 15px; top: 15px; width: 24px; height: 24px; opacity: 1; transition: opacity 0.5s ease; cursor: pointer;" />
                <img id="headerImage" src="https://i.ibb.co/h2GFJ5f/khanhack.png" style="width: 130px; opacity: 1; transition: opacity 0.5s ease;" />
                <img id="gearIcon" src="https://i.ibb.co/q0QVKGG/gearicon.png" alt="Settings" style="position: absolute; right: 15px; top: 15px; width: 24px; height: 24px; opacity: 1; transition: opacity 0.5s ease; cursor: pointer;" />
            </head>

            <div id="answerList" class="answerList"></div>
            <div id="copyText2" class="copyText2">Click to copy</div>

        </div>

        <img id="toggleButton" src="https://i.ibb.co/RpqPcR1/hamburger.png" class="toggleButton">

        <img id="clearButton" src="https://i.ibb.co/bz0jPmc/Pngtree-white-refresh-icon-4543883.png" style="width: 34px; height: 34px; bottom: 0px; right: 0px; position: absolute; cursor: pointer;">

        <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');

            .toggleButton {
                position: absolute;
                bottom: 7px;
                left: 7px;
                height: 20px;
                width: 20px;
                cursor: pointer;
            }

            .answerList {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 10px;
                flex-grow: 1;
                max-height: calc(100% - 100px);
                overflow-y: scroll;
                padding-bottom: 10px;
            }

            .block {
                width: 280px;
                height: auto;
                background-color: #f0f0f0;
                padding: 10px;
                border-radius: 10px;
                opacity: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-left: auto;
                margin-right: auto;
                transition: 0.2s ease;
                word-wrap: break-word;
            }

            .block:hover {
                background-color: #d9d7d7;
            }

            .answerList:hover + .copyText2 {
                opacity: 100;
            }

            .answer {
                margin: 0;
                text-align: center;
                color: black;
                font-family: "Noto Sans";
                font-weight: 500;
            }

            .imgBlock img {
                width: 250px;
                border-radius: 10px;
            }

            .copied {
                margin-top: -200px;
            }

            #answerList::-webkit-scrollbar {
                display: none;
            }

            #answerList {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }

            .copyText2 {
                text-align: center;
                padding-top: 10px;
                left: 50%;
                font-size: 15px;
                opacity: 0;
                transition: opacity 0.2s ease, font-size 0.1s ease;
            }

            .ansVal {

            }
        </style>
    `;

    addToggle();
    addSettings();
    addDiscord();
    addClear();

    const answerList = document.getElementById('answerList');

    if (isGhostModeEnabled) {
        enableGhostMode();
    }
};



let isMenuVisible = true;
const addToggle = () => {
    document.getElementById('toggleButton').addEventListener('click', function() {
        const clearButton = document.getElementById('clearButton');
        if (isMenuVisible) {
            mainMenu.style.height = '15px';
            mainMenu.style.width = '15px';
            document.getElementById('menuContent').style.opacity = '0';
            clearButton.style.opacity = '0';
            setTimeout(() => {
                document.getElementById('menuContent').style.display = 'none';
                clearButton.style.display = 'none';
            }, 50);
        } else {
            mainMenu.style.height = '400px';
            mainMenu.style.width = '300px';
            document.getElementById('menuContent').style.display = 'flex';
            clearButton.style.display = 'block';
            setTimeout(() => {
                document.getElementById('menuContent').style.opacity = '1';
                clearButton.style.opacity = '1';
            }, 100);
        }
        isMenuVisible = !isMenuVisible;
    });
};

const addSettings = () => {
    document.getElementById('gearIcon').addEventListener('click', function() {
        let saveHtml = document.getElementById('mainMenu').innerHTML
        mainMenu.innerHTML = `
            <div id="settingsContent" style="display: flex; flex-direction: column; align-items: center; position: relative; opacity: 1; transition: opacity 0.5s ease;">
                <img id="backArrow" src="https://i.ibb.co/Jt4qrD7/pngwing-com-1.png" alt="Back" style="position: absolute; left: 7px; top: 3px; width: 24px; height: 24px; opacity: 1; transition: opacity 0.5s ease; cursor: pointer;" />

                <h3 style="margin: 5; text-align: center; color: white; font-family: Noto sans; font-weight: 500;">Settings Menu</h3>
                <p class="menuItem">Ghost Mode: <input type="checkbox" id="ghostModeToggle" class="ghostToggle" ${isGhostModeEnabled ? 'checked' : ''}></p>
                <p class="menuItem">Auto Answer: <button id="autoAnswerToggle" class="autoToggle">${autoAnswer === "true" ? "Off" : "On"}</button></p>
                <p class="menuItem">Point Farmer: <button id="pointFarmerToggle" class="autoToggle2" disabled>${pointFarmer === "true" ? "On" : "Off"}</button></p>
                <p class="menuItem">Points: <i id="finalPoints"></i></p>
                <p class="menuItem">Auto Speed: <input type="range" min="500" max="1500" class="slider" id="autoSpeed"><i id="autoValue">1500</i></p>
                <p class="betaVer">KhanHack™ | Beta 6.0</p>

                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');

                    .menuItem {
                        text-align: center;
                        color: white;
                        font-family: Noto sans;
                        margin-top: 0px;

                    }
                    .betaVer {
                        text-align: center;
                        color: white;
                        font-family: Noto sans;
                        margin-top: 90px;
                    }

                    .autoToggle {
                       border: 2px solid #07152e;
                       border-radius: 12px;
                       background-color: #2967d9;
                       padding: 2px 10px 2px 10px;
                       color: white;
                       font-family: Noto sans;
                       font-weight: 500;
                       transition: 0.2s ease;

                    }

                    .autoToggle2 {
                       border: 2px solid #07152e;
                       border-radius: 12px;
                       background-color: gray;
                       padding: 2px 10px 2px 10px;
                       color: white;
                       font-family: Noto sans;
                       font-weight: 500;
                       transition: 0.2s ease;

                    }

                    .autoToggle:hover {
                        background-color: #2152ad;

                    }

                    .ghostToggle {
                        width: 20px;
                        height: 20px;
                        background-color: white;
                        border-radius: 50%;
                        vertical-align: middle;
                        border: 2px solid #07152e;
                        appearance: none;
                        -webkit-appearance: none;
                        outline: none;
                        cursor: pointer;
                        transition: 0.2s ease;
                    }

                    .ghostToggle:checked {
                        background-color: #2967d9;
                    }
                </style>
            </div>
        `;
        document.getElementById('backArrow').addEventListener('click', () => {mainMenu.innerHTML = saveHtml; addSettings(); addToggle(); addDiscord(); addClear();});
        document.getElementById('finalPoints').innerHTML = localStorage.getItem('userPoints');
        const slider = document.getElementById("autoSpeed");
        const autoValue = document.getElementById("autoValue");
        slider.value = localStorage.getItem('autoSpeed')
        autoValue.innerHTML = localStorage.getItem('autoSpeed')
        slider.addEventListener('input', () => {
            localStorage.setItem('autoSpeed', slider.value)
            slider.value = localStorage.getItem('autoSpeed')
            autoValue.innerHTML = localStorage.getItem('autoSpeed')
        });
        document.getElementById("autoAnswerToggle").addEventListener("click", () => {
          localStorage.setItem("khs", localStorage.getItem("khs") === "true" ? "false" : "true")
          location.reload()
        })
        document.getElementById("pointFarmerToggle").addEventListener("click", () => {
          localStorage.setItem("khs2", localStorage.getItem("khs2") === "true" ? "false" : "true")
          localStorage.setItem("farmCount", 0)
          location.reload()
        })
        document.getElementById('ghostModeToggle').addEventListener('change', function() {
            isGhostModeEnabled = this.checked;
            if (isGhostModeEnabled) {
                enableGhostMode();
            } else {
                disableGhostMode();
            }


        });
    });
};

const enableGhostMode = () => {
    mainMenu.style.opacity = '0';
    mainMenu.addEventListener('mouseenter', handleMouseEnter);
    mainMenu.addEventListener('mouseleave', handleMouseLeave);
};

const disableGhostMode = () => {
    mainMenu.style.opacity = '1';
    mainMenu.removeEventListener('mouseenter', handleMouseEnter);
    mainMenu.removeEventListener('mouseleave', handleMouseLeave);
};

const handleMouseEnter = () => {
    mainMenu.style.opacity = '1';
};

const handleMouseLeave = () => {
    mainMenu.style.opacity = '0';
};

const addDiscord = () => {
    document.getElementById('discordIcon').addEventListener('click', function() {
        window.open('https://discord.gg/khanhack', '_blank');
    });
};

const addClear = () => {
    document.getElementById('clearButton').addEventListener('click', function() {
        location.reload();
    });
};

const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js";
    document.head.appendChild(script);

const katexStyle = document.createElement("link");
    katexStyle.rel = "stylesheet";
    katexStyle.href = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css";
    document.head.appendChild(katexStyle);

const getCurrentQuestion = () => {
    const container = document.querySelector(`div[data-testid="content-library-footer"]`)
    let firstChar = container.querySelectorAll("div")[5].children[0].innerText.charAt(0)
    let lastChar = container.querySelectorAll("div")[5].children[0].innerText.slice(-1)
    if(firstChar == lastChar-1) {
        console.log(true)
        container.querySelectorAll("button")[3].onclick = function() {;
            firstAns = document.getElementById(`blockNum${blockTick-1}`)
            console.log(firstAns)
            secondAns = document.getElementById(`blockNum${blockTick}`)
            secondAns.style.opacity = "100%";
            firstAns.remove()
            answerBlocks.shift()
    }
    } else {
        console.log(false)
    }
}

const addNewAnswerBlock = (answer, imgSrc, isImg) => {


    const answerList = document.getElementById('answerList');
    const block = document.createElement('div');
    blockTick ++

    //console.log(' blockTick: ' + blockTick)
    if(isImg == true) {
        block.className = 'block imgBlock';
        const img = document.createElement('img');
        img.src = imgSrc;
        block.id = `blockNum${blockTick}`
        block.innerHTML = `${answer}`;
        block.style.display = "inline-block"
        block.style.color = "black";
        block.appendChild(img);
        answerList.appendChild(block);
        answerBlocks.push({ type: 'image', content: block.id });
        //console.log('num: ' + block.id)
    }

    else {
        block.className = 'block no-select';
        block.id = `blockNum${blockTick}`
        block.style.cursor = "pointer";
        block.addEventListener("click", () => {
            console.log('clicked')
            navigator.clipboard.writeText(answer);
        });



        const ansVal = document.createElement('a');
        ansVal.className = 'answer';

        const latexPattern = /\\frac|\\sqrt|\\times|\\cdot|\\degree|\\dfrac|\test|\\vec\\leq|\\left|\\right|\^|\$|\{|\}/;
        if (latexPattern.test(answer)) {
            ansVal.innerHTML = '';
            katex.render(answer, ansVal)
        } else {
            ansVal.innerHTML = `${answer}`;
        }

        ansVal.style.fontSize = "16px";
        block.appendChild(ansVal);
        answerList.appendChild(block);
        answerBlocks.push({ type: 'text', content: block.id });
        //console.log('num: ' + block.id)
    }

    const runList = () => {
        if(answerBlocks.length == 3) {
            //console.log(`length is ${answerBlocks.length}`)
            firstAns = document.getElementById(`blockNum${blockTick-2}`)
            secondAns = document.getElementById(`blockNum${blockTick-1}`)
            secondAns.style.opacity = "100%";
            firstAns.remove()
            answerBlocks.shift()
            getCurrentQuestion()
            //console.log(`shifted is ${answerBlocks.length}`)
            runList()

        } else if(answerBlocks.length == 2) {
            //console.log(`length is ${answerBlocks.length}`)
            firstAns = document.getElementById(`blockNum${blockTick-1}`)
            secondAns = document.getElementById(`blockNum${blockTick}`)
            if(secondAns.style.opacity == "0%") {
                firstAns.remove()
                answerBlocks.shift()
                secondAns.style.opacity = "100%";

            } else{
                secondAns.style.opacity = "0%";
            }

        }

    }
    runList()
}

document.body.appendChild(mainMenu);
setMainMenuContent();

function addFarm() {
    let farmDiv = document.createElement("div");
    const farmId = Math.floor(Math.random() * 100000000);
    farmDiv.innerHTML = `<iframe id="rig${farmId}" style="display:none;" src="https://www.khanacademy.org/math/cc-2nd-grade-math/test/x3184e0ec:course-challenge"></iframe>`;
    document.body.appendChild(farmDiv);
    let farmScript = document.createElement('script');
}

    let pointsFrame = document.createElement("iframe");
    pointsFrame.src = "https://www.khanacademy.org/profile/me";
    document.body.appendChild(pointsFrame);

    setTimeout(function() {
        let pointValue = Array.from(pointsFrame.contentWindow.document.getElementsByClassName("odometer-ribbon-inner")).map(element => element.textContent).join('')
        //console.log(pointValue)
        finalPoints = Number(pointValue)
        localStorage.setItem('userPoints', finalPoints)
        pointsFrame.remove();
    }, 3000);



let originalJson = JSON.parse;
let isSumm = false;
let intervalId;

let farmId;
JSON.parse = function (jsonString) {
    let parsedData = originalJson(jsonString);
    try {
        if(parsedData.operationName == "getEotCardDetails" || parsedData.operationName == "getEotQuizCardDetails") {
            isSumm = true;
            //console.log('summ screen true')
            const buttonLinks = document.querySelectorAll('a[role="button"]');
            if(buttonLinks.length !== 0) {
                //buttonLinks[0].click()
                location.reload()
                isSumm = false;

            }
        }

        else if(parsedData.data && parsedData.data.assessmentItem && parsedData.data.assessmentItem.item) {
            let itemData = JSON.parse(parsedData.data.assessmentItem.item.itemData);
            let hasGradedWidget = Object.values(itemData.question.widgets).some(widget => widget.graded === true);




            if (hasGradedWidget && isSumm == false) {

                if (autoAnswer === "true") {
                    const premade = '{"hints":[],"question":{"content":"[[☃ radio 1]]","widgets":{"radio 1":{"options":{"choices":[{"content":"KhanHack","correct":true}]}}}}}';
                    parsedData.data.assessmentItem.item.itemData = premade;
                    let autoAnswerSpeed = localStorage.getItem('autoSpeed')
                    console.log(autoAnswerSpeed)

                    if (!intervalId) {
                        intervalId = setInterval(() => {
                            clicky("button", "Let’s go");
                            clicky("div", "KhanHack", "paragraph");
                            clicky("button", "Check");
                            clicky("button", "Check again");
                            clicky("button", "Try again");
                            clicky("button", "Next question");
                            clicky("button", "Show summary");
                        }, autoAnswerSpeed);
                    }

                    return parsedData;
                }

                else if (pointFarmer === "true") {

                    if(Number(localStorage.getItem('farmCount')) !== 25) {

                    let farmDiv = document.createElement("div");
                    localStorage.setItem("farmCount", farmCount)

                    //farmId = Math.floor(Math.random() * 100000000);
                    //console.log(farmId)
                    farmDiv.innerHTML = `<iframe id="farm${farmCount}" style="display:none;" src="https://www.khanacademy.org/math/cc-2nd-grade-math/test/x3184e0ec:course-challenge"></iframe>`;
                    document.body.appendChild(farmDiv);

                    //console.log(farmDiv.children[0].id)
                    farmCount ++;

                    }



                    const premade = '{"hints":[],"question":{"content":"[[☃ radio 1]]","widgets":{"radio 1":{"options":{"choices":[{"content":"KhanHack","correct":true}]}}}}}';
                    parsedData.data.assessmentItem.item.itemData = premade;
                    let autoAnswerSpeed = localStorage.getItem('autoSpeed')
                    //console.log(autoAnswerSpeed)

                    if (!intervalId) {
                        intervalId = setInterval(() => {
                            clicky("button", "Let’s go");
                            clicky("div", "KhanHack", "paragraph");
                            clicky("button", "Check");
                            clicky("button", "Check again");
                            clicky("button", "Try again");
                            clicky("button", "Next question");
                            clicky("button", "Show summary");
                        }, autoAnswerSpeed);
                    }

                    return parsedData;
                }

                for(let widgetKey in itemData.question.widgets) {
                    let widget = itemData.question.widgets[widgetKey];
                    //console.log(widget.type)

                    switch (widget.type) {
                        case "numeric-input":
                            handleNumeric(widget);
                            break;
                        case "radio":
                            handleRadio(widget);
                            break;
                        case "expression":
                            handleExpression(widget);
                            break;
                        case "dropdown":
                            handleDropdown(widget);
                            break;
                        case "interactive-graph":
                            handleIntGraph(widget);
                            break;
                        case "grapher":
                            handleGrapher(widget);
                            break;
                        case "input-number":
                            handleInputNum(widget);
                            break;
                        case "matcher":
                            handleMatcher(widget);
                            break;
                        case "categorizer":
                            handleCateg(widget);
                            break;
                        case "label-image":
                            handleLabel(widget);
                            break;
                         case "matrix":
                            handleMatrix(widget);
                            break;
                        default:
                            //console.log("Unknown widget: " + widget.type);
                            break;
                    }
                }

                if (currentCombinedAnswer.trim() !== '') {
                    if(currentCombinedAnswer.slice(-4) == '<br>') {
                        addNewAnswerBlock(currentCombinedAnswer.slice(0, -4), null, false)
                        currentCombinedAnswer = '';
                    } else {
                        addNewAnswerBlock(currentCombinedAnswer, null, false)
                        currentCombinedAnswer = '';
                    }


                }
            }
        }
    } catch (error) {
        //console.log("Error parsing JSON:", error);
    }

    return parsedData;
};

function getElm(tag, text, className) {
    let n = className !== undefined ? document.querySelectorAll(`${tag}.${className}`) : document.getElementsByTagName(tag);
    for (let i = 0; i < n.length; i++) {
        if (n[i].textContent.trim() === text) {
            return n[i];
        }
    }
    return null;
}

function clicky(tag, text, className) {
    let el = getElm(tag, text, className);
    if (el) {
        el.scrollIntoView();
        el.click();
    }
}


function cleanLatexExpression(answer) {
    return answer
          .replace(/\$/g, '');
}

function handleRadio(widget) {
    let corAns = widget.options.choices.filter(item => item.correct === true).map(item => item.content);
    let ansArr = [];
    let isNone = widget.options.choices.filter(item => item.isNoneOfTheAbove === true && item.correct === true)

    if (isNone.length > 0) {
        currentCombinedAnswer += "None of the above";
        return;
    }

    console.log(corAns)

    corAns.forEach(answer => {
        const hasGraphie = answer.includes('web+graphie')
        const hasNotGraphie = answer.includes('![')

        if(hasGraphie || hasNotGraphie == true) {
            if(hasGraphie == true) {
                const split = answer.split('](web+graphie');
                const text = split[0].slice(2)
                const midUrl = split[1].split(')')[0];
                const finalUrl = 'https' + midUrl + '.svg';
                addNewAnswerBlock(text, finalUrl, true);
            } else if(hasNotGraphie == true) {
                const finalUrl = answer.slice(answer.indexOf('https'), -1)
                addNewAnswerBlock(null, finalUrl, true);
            }
        } else {
            let cleaned = cleanLatexExpression(answer)
            ansArr.push(cleaned)
        }


    })

    if(ansArr.length) {
        currentCombinedAnswer += ansArr.join()
    }

}

function handleLabel(widget) {

    let corAns = widget.options.markers.filter(item => item.answers).map(item => item.answers)
    let labels = widget.options.markers.filter(item => item.label).map(item => item.label)
    let ansArr = []

    corAns.forEach((answer, index) => {
        if(labels == 0) {
            let cleaned = cleanLatexExpression(answer.toString());
            ansArr.push(cleaned)

        } else {
        let cleaned = cleanLatexExpression(answer.toString());
        let finLabel = labels[index].replace('Point ', '').replace(/[.]/g, '').trim() || "";
        let labeledAnswer = `${finLabel}: ${cleaned}`;
        ansArr.push(labeledAnswer)
        }

    })

    if(ansArr.length) {
        currentCombinedAnswer += ansArr.join("|")
    }

}

function handleNumeric(widget) {
    const numericAnswer = widget.options.answers[0].value;
    currentCombinedAnswer += `${numericAnswer}<br>`;
}

function handleExpression(widget) {

    let expressionAnswer = widget.options.answerForms[0].value;
    let cleaned = cleanLatexExpression(expressionAnswer)
    console.log(expressionAnswer)
    currentCombinedAnswer += ` ${cleaned} `;
}

function handleDropdown(widget) {
    let content = widget.options.choices.filter(item => item.correct === true).map(item => item.content);
    currentCombinedAnswer += ` ${content[0]} `;
}

function handleIntGraph(widget) {
    let coords = widget.options.correct.coords;
    let validCoords = coords.filter(coord => coord !== undefined);
    currentCombinedAnswer += ` ${validCoords.join(' | ')} `;
}

function handleInputNum(widget) {
    let inputNumAnswer = widget.options.value;
    console.log(inputNumAnswer)
    currentCombinedAnswer += ` ${inputNumAnswer} `;
}

function handleMatcher(widget) {
    let matchAnswer = widget.options.right;
    let cleaned = cleanLatexExpression(matchAnswer)
    currentCombinedAnswer += ` ${matchAnswer} `;
}

function handleGrapher(widget) {
    let coords = widget.options.correct.coords;
    currentCombinedAnswer += ` ${coords.join(' | ')} `;
}

function handleCateg(widget) {
    let values = widget.options.values;
    let categories = widget.options.categories;
    let labeledValues = values.map(value => categories[value]);

    currentCombinedAnswer += ` ${labeledValues} `
}

function handleMatrix(widget) {
    let arrs = widget.options.answers;
    currentCombinedAnswer += ` ${arrs.join(' | ')} `
}