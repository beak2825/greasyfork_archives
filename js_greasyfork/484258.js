// ==UserScript==
// @name         Quiz Response Userscript
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  userscript that adds answers creates dynamic html tags
// @author       You
// @match        https://academy.cs.cmu.edu/quiz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cmu.edu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484258/Quiz%20Response%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/484258/Quiz%20Response%20Userscript.meta.js
// ==/UserScript==

function createHeaderandTitles(titleString, hasComplete){
    const appDiv = document.getElementById("app");
    const title = document.createElement("h1");
    const isSubmitDiv = document.createElement("div");
    const isSubmitText = document.createElement("p");

    title.textContent = titleString;
    isSubmitText.textContent = `Quiz Complete: ${hasComplete}`
    isSubmitText.style.fontStyle = 'italic';
    isSubmitDiv.appendChild(isSubmitText);
    addLeftRightPadding(title);
    title.style.paddingBottom = "15px";
    appDiv.appendChild(title);
    addLeftRightPadding(isSubmitDiv);
    appDiv.appendChild(isSubmitDiv);
}

function addLeftRightPadding(element){
    element.style.paddingLeft = '20px';
    element.style.paddingRight = '20px';
}

function createTextElement(string, parentContainer=null){
    let innerQuizContainer = document.getElementById("app");
    const newDiv = document.createElement("div");
    newDiv.classList.add("dynamic-text-usrc");
    newDiv.innerHTML = string;
    addLeftRightPadding(newDiv);
    if (parentContainer){
        try{
            parentContainer.appendChild(newDiv);
            innerQuizContainer.appendChild(parentContainer);
        }catch(err){
            console.error(err)
        }
    }else{
        innerQuizContainer.appendChild(newDiv);
    }
    return newDiv;
}

/*
creates quiz stats.

@param {string} name string for quiz name
@param {number} quizID 4 digit num for id of quiz
@param {bool} answersReleased boolean value for avaliable answers
@param {number} timeSpent int for the amount of time in seconds spent away from quiz
@param {object} ctGrades object with grades, if not avaliable - will be empty {}
*/

function createQuizStats(name, quizID, answersReleased, timeSpent, ctGrades){
    const containerDiv = document.createElement("div");
    const quizName = document.createElement("h3");
    quizName.textContent = "Quiz Stats";
    addLeftRightPadding(containerDiv);
    //append to container div
    containerDiv.appendChild(quizName);
    createTextElement(`ID: <b>${quizID}</b>`, containerDiv);
    createTextElement(`Answers Released: <b>${answersReleased}</b>`, containerDiv);
    createTextElement(`Time spent Away(seconds): <b>${timeSpent}</b>`, containerDiv);
    createTextElement(`Released Grades: <b>${JSON.stringify(ctGrades)}</b>`, containerDiv);
}

function createExcerciseElement(title, imgUrl, points, metaId, score) {
    const QuizContainer = document.getElementById("app");
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("dynamic-exercise-div");
    const titleElement = document.createElement("h2");
    titleElement.textContent = title;
    const mainUrl = document.createElement("a");
    const imageContainer = document.createElement("div");
    const pointText = document.createElement("p");
    pointText.textContent = `Points: ${points}`;
    const totalScoredText = document.createElement("p");
    totalScoredText.textContent = `Scored: ${score}`
    totalScoredText.style.fontStyle = "italic";
    imageContainer.classList.add("image-container");
    //create label and checkbox form elem
    const labelCheckbox = document.createElement("label");
    labelCheckbox.for = "iframe-box";
    labelCheckbox.textContent = "Enable/Disable Iframe";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("id", "iframe-box");
    labelCheckbox.style.marginRight = "5px";
    //now add change event listener
    const iframeElement = document.createElement("iframe");
    checkbox.addEventListener( "change", () => {
         if ( checkbox.checked ) {
             //enable iframe
             iframeElement.src = `https://academy.cs.cmu.edu/exercise/${metaId}/`;
             iframeElement.height = "700";
             iframeElement.width = "100%";
             mainDiv.appendChild(iframeElement);
         } else {
            //pass
            iframeElement.remove()
         }
    });
    mainUrl.href = `https://academy.cs.cmu.edu/exercise/${metaId}/`;
    //gets image as blob
    fetch(`https://academy.cs.cmu.edu${imgUrl}`)
        .then((response) => response.blob())
        .then((blob) => {
            const imageUrl = URL.createObjectURL(blob);
            const imageElement = document.createElement("img");
            imageElement.src = imageUrl;
            mainUrl.appendChild(imageElement);
            imageContainer.appendChild(mainUrl);
            //append all
            //add points attribute
            mainDiv.setAttribute("points", points);
            mainDiv.setAttribute("scored", score);
            mainDiv.appendChild(titleElement);
            mainDiv.appendChild(labelCheckbox);
            mainDiv.appendChild(checkbox);
            mainDiv.appendChild(pointText);
            mainDiv.appendChild(totalScoredText);
            mainDiv.appendChild(mainUrl);
            addLeftRightPadding(mainDiv);
            QuizContainer.appendChild(mainDiv);
        })
        .catch((err) => {
            console.error("fetch error", err);
        });
}

function keepAnswersOnlyArray(array){
    return array.filter((element) => {return element.className === "dynamic-answer-elem"});
}



function makeFetchRequest(url){
    const authToken = localStorage["cs-academy-token"];
    fetch(url, { "headers": {"Authorization": `Token ${authToken}`} })
    .then((response) => {
        return response.json()
    })
    .then((response) => {
        console.debug(response); //log response(dev)
        const content = response.content;
        let answersArray = []
        let totalPointsArray = []
        //intalize, create correct header and titles
        createHeaderandTitles(response.name, response.quizComplete);
        // correct ans button add
        correctAnswersButton();
        //go over response content
        content.forEach((item) => {
            //keeping as if in case multiple pop up in same use?
            //can change to else if for perf
            if (item.toc_entry == "True or False"){
                createTextElement("<b>" + item.chunks[0].content + "</b>");
            }
            if (item.type == "writeup" && item.toc_entry == "Multiple Choice"){
                const element = createTextElement(item.chunks[0].content);
                element.style.fontWeight = "900";
                element.style.paddingTop = "20px";
            }
            if (item.type == "mc"){
                createTextElement(item.question.text);
                //item answers
                const parentAnswerDiv = document.createElement("div");
                parentAnswerDiv.classList.add("dynamic-answer-div");
                parentAnswerDiv.style.padding = "5px"
                //add points to points array
                totalPointsArray.push(item.points);
                //loop over answers for elements.
                item.answers.forEach((item) => {
                    const element = createTextElement(item.text, parentAnswerDiv);
                    element.style.paddingTop = "5px";
                    element.style.paddingBottom = "5px";
                    element.classList.remove("dynamic-text-usrc");
                    element.classList.add("dynamic-answer-elem");
                    answersArray.push(element);
                });
            }
            if (item.type == "exercise"){
                createExcerciseElement(item.title, item.icon_url, item.points, item.meta_id, response.exerciseAnswers[0].score);
            }
        });
        //create quiz stats
        createQuizStats(`${response.number} ${response.name}`, response.id, response.showAnswers, response.awaySeconds, response.ctGrades);
        const matchedArray = Object.values(response.mcAnswers);
        const mcArray = document.querySelectorAll(".dynamic-answer-div");
        console.debug(response.mcAnswers, mcArray);
        console.debug(matchedArray);
        console.debug("points", totalPointsArray);
        totalPointsArray.forEach((number, index) => {
            //add points to all divs
            mcArray[index].setAttribute("points", number);
            const pointsText = createTextElement(`<b>Points:</b> ${number}`)
            pointsText.style.margin = "10px";
            mcArray[index].prepend(pointsText);
        });

        //match answers
        matchedArray.forEach((item, index) => {
            let answerArray = Array.from(mcArray[index].children);
            answerArray = keepAnswersOnlyArray(answerArray);
            const answerElement = answerArray[item];
            answerElement.style.backgroundColor = "#FFFF33";
            //for easier html parsing boy - usually can set to "" but i make it true for the fun of it ig
            // note it's just a check jamal - so it's not on all..
            answerElement.setAttribute("isanswer", true);
        });
    })
    .catch((err) => {
        console.error(err);
    });
}

const quizID = window.location.href.replace("https://academy.cs.cmu.edu/quiz/", "");
if (quizID.length > 0){
    try{
        makeFetchRequest(`https://backend.academy.cs.cmu.edu/api/v0/quiz/?id=${quizID}`);
    }catch(err){
        console.error("An error occurred during the fetch request. Is it a valid quizID? Trace below.", err);
    }
}



//button bullshite for checking answers
let savedBackground = null;
//handles click - changes background to green
function handleAnswerClick(event){
    const parent = event.target.parentElement;
    //checks for clicked attr, if not true then go ahead, so user only clicks once
    if (event.target.className == "dynamic-answer-elem"){
        if (!parent.hasAttribute("hasClicked")){
            parent.setAttribute("hasClicked", true);
            //save the previous bg
            savedBackground = event.target.style.backgroundColor;
            event.target.style.backgroundColor = "#AFE1AF";
            event.target.setAttribute("userAnswer", true);
        }else if (event.target.hasAttribute("userAnswer")){
            event.target.style.backgroundColor = `${savedBackground}`;
            event.target.removeAttribute("userAnswer");
            parent.removeAttribute("hasClicked");
        }
    }
}

//checks how many elements have the answers attr
function checkAnswersBackground(button){
    //check all answer div elements to see if the user clicked on them atleast once
    const divElements = Array.from(document.querySelectorAll(".dynamic-answer-div"));
    //bool for is reliable meaning user marked down all possible ans
    const isReliable = divElements.every(element => element.hasAttribute("hasclicked"))
    if (!isReliable){
        if (!button.parentElement.querySelector("p")){
            //bring up a text over the button that lets user know it's not all selected.
            const text = document.createElement("p");
            text.textContent = "⚠️ WARNING: The points result may not be accurate as you have not selected all elements."
            text.style.color = "#cc3300";
            text.style.padding = "5px";
            button.parentElement.appendChild(text);
        }
    }else{
        const parentSelectorP = button.parentElement.querySelector("p");
        if (parentSelectorP){
            parentSelectorP.remove();
        }
    }
    const elements = document.querySelectorAll(".dynamic-answer-div");
    const exercises = document.querySelectorAll(".dynamic-exercise-div");
    let maxPoints = 0;
    //use a closure to parse the ints
    function parsePointsInt(value){
        try{
            const points = parseInt(value, 10);
            // Check if is not num
            if (!isNaN(points)) {
                maxPoints += points; // add parsed num to num
            } else {
                console.error("Invalid points value:", value);
            }
        }catch(err){
            console.error("Is the attribute correct? Error:", err);
        }
    }
    let answerElements = []
    elements.forEach((elem) => {
        parsePointsInt(elem.attributes.points.value);
        answerElements.push(keepAnswersOnlyArray(Array.from(elem.children)));
    });
    //doing this for later expansion? maybe..?
    const userAnswerObjects = []
    const webAnswerObjects = []
    answerElements.forEach((elem, index) => {
        //gives if answer is selected from the answers content
        answerElements[index].forEach((item) => {
            const webAnswer = {
                element: item,
                answerBoolean: item.hasAttribute("isanswer"),
                points: item.parentElement.attributes.points.value,
                type: "webAnswer"
            }
            const Userans = {
                element: item,
                answerBoolean: item.hasAttribute("useranswer"),
                points: item.parentElement.attributes.points.value,
                type: "userAnswer"
            }
            webAnswerObjects.push(webAnswer);
            userAnswerObjects.push(Userans);
        });
    });
    //init the var for how many points userscored
    let pointsScored = 0;
    //using a for loop means the 2 arrays must be the same length
    for (let i = 0; i < userAnswerObjects.length; i++) {
        const userAnswer = userAnswerObjects[i];
        const webAnswer = webAnswerObjects[i];
        if (userAnswer.answerBoolean && webAnswer.answerBoolean) {
            //finds matches and addes the correct num of points
            pointsScored += (parseInt(userAnswer.points || webAnswer.points)) ?? new Error("Something went wrong during points processing.");
        }
    }
    console.debug(userAnswerObjects);
    console.debug(webAnswerObjects);
    exercises.forEach((elem) => {
        parsePointsInt(elem.attributes.points.value);
        pointsScored += parseInt(elem.attributes.scored.value);
    });
    //log score
    console.debug("Score:", pointsScored, maxPoints);
    function createResultText(score, maxNum){
        const resultText = document.createElement("p");
        resultText.textContent = `Test Result: ${score}/${maxNum}`
        resultText.style.margin = "5px"
        resultText.classList.add("dynamic-result-text");
        button.parentElement.appendChild(resultText);
    }
    //see elements
    const resultTextElement = document.querySelector(".dynamic-result-text");
    if (!resultTextElement){
        createResultText(pointsScored, maxPoints);
    }else{
        resultTextElement.remove();
        createResultText(pointsScored, maxPoints);
    }
}



//add correct answers!
function correctAnswersButton(){
    console.debug("Add answers button.");
    const containerDiv = document.createElement("div");
    const mainButton = document.createElement("button");
    mainButton.style.background = "#04AA6D";
    mainButton.style.border = "none";
    mainButton.style.borderRadius = "4px";
    mainButton.style.width = "120px";
    mainButton.style.color = "white";
    mainButton.style.height = "35px";
    mainButton.textContent = "Add Answers";
    mainButton.classList.add("answer-button");
    addLeftRightPadding(containerDiv);
    containerDiv.style.paddingBottom = "15px";
    const appElement = document.getElementById("app");
    let hasSelected = false;
    mainButton.addEventListener("click", () => {
        if (!hasSelected){
            mainButton.textContent = "Stop Select"
            mainButton.style.background = "#913831";
            document.addEventListener("click", handleAnswerClick);
            hasSelected = true;
        }else{
            mainButton.style.background = "#04AA6D";
            mainButton.textContent = "Add Answers";
            document.removeEventListener("click", handleAnswerClick);
            checkAnswersBackground(mainButton);
            hasSelected = false;
        }
    });
    containerDiv.appendChild(mainButton);
    appElement.appendChild(containerDiv);
    return mainButton;
}


