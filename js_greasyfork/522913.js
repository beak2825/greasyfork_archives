// ==UserScript==
// @name         Vocabulary.com Answer Bot
// @namespace    http://tampermonkey.net/
// @version      2024-10-12
// @description  Helps you with your vocabulary.com lists using AI.
// @author       You
// @match        https://www.vocabulary.com/*
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522913/Vocabularycom%20Answer%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/522913/Vocabularycom%20Answer%20Bot.meta.js
// ==/UserScript==

let url = window.location.href
let inProgress = false;
let botActive = false; // Bot state
const apiKey = 'CLE CHATGPT'; // Replace with your actual OpenAI API key

// Create a toggle button
const button = document.createElement('i');
button.textContent = "Toggle Bot";
button.style.position = "fixed";
button.style.top = "10px";
button.style.right = "10px";
button.style.zIndex = "1000";
button.style.fontSize = "12px";
button.style.padding = "5px 10px";
button.style.border = "1px solid white";
button.style.color = 'white';
button.style.borderRadius = '3px';
button.style.cursor = 'pointer';

button.onclick = function () {
    botActive = !botActive; // Toggle the bot's active state
    button.textContent = botActive ? "Stop Bot" : "Start Bot 🧠"; // Update button text
};

document.body.appendChild(button);

let list = url.split("/")[4]
if(localStorage.getItem("words_defs")!==null){
   window.lists = JSON.parse(localStorage.getItem("words_defs"))
} else {
   window.lists = []
}

if(!url.includes("/practice")){
    let words_defs = []
    setTimeout(function(){
        let entries = document.getElementsByClassName("entry");
        console.log(entries)
        for (let entry of entries) {
            let word = entry.children[0].innerText.trim();
            let def = entry.children[1].innerText.trim();

            words_defs.push({"word": word, "def": def});
        }
        localStorage.setItem("words_defs", JSON.stringify({[list]: words_defs}));
        let practice = document.getElementsByClassName("activity practice")[0];
        practice.click()
    }, 1000)
    //location.href = url
} else if (url.includes("/practice")) {
    setTimeout(function(){
        if(!Object.keys(lists).includes(list)){
            location.href=url.split("/practice")[0];
        }
        else{
            bot()
        }
    }, 250)
}

function bot() {
    let bot = setInterval(async function () {
        if (botActive && !inProgress) {
            let questions = document.getElementsByClassName("question");
            console.log(questions)
            let currentQuestion = questions[questions.length - 1];
            console.log(currentQuestion)
            let questionType = getType(currentQuestion)

            let choiceBox = currentQuestion.children[3].children;
            let choices = getChoices(choiceBox);

            if(questionType!==false){
                inProgress = true;
                if(questionType=="choice1"){
                    console.log(currentQuestion)
                    let instruction = currentQuestion.children[1].innerText;
                    let word = currentQuestion.children[1].querySelector("strong").innerText
                    console.log(word)

                    // Call the API to get the answer
                    let answer = await getVocabularyAnswer(instruction, choices, word);
                    if (answer) {
                        // Highlight the correct answer (1-based index, so convert to 0-based)
                        choiceBox[answer - 1].click();
                        choiceBox[answer - 1].style.color = "springgreen"; // Highlight the answer
                    }
                } else if (questionType == "choice2") {
                    console.log(currentQuestion)
                    let instruction = currentQuestion.children[2].innerText;
                    let word = currentQuestion.children[2].querySelector("strong").innerText
                    console.log(word)



                    // Call the API to get the answer
                    let answer = await getVocabularyAnswer(instruction, choices, word);
                    if (answer) {
                        // Highlight the correct answer (1-based index, so convert to 0-based)
                        choiceBox[answer - 1].click();
                        choiceBox[answer - 1].style.color = "springgreen"; // Highlight the answer
                    }
                }
                if (questionType == "spell") {
                    let speak = currentQuestion.children[1].children[1].children[0];
                    speak.click()
                }
            }
            let nxt = document.getElementsByClassName("next")[0];
            nxt.addEventListener("click", function () {
                inProgress = false;
            });
        }
    }, 2000);
}
setInterval(()=>{
    if(document.getElementsByClassName("next active")[0]!==undefined){
        document.getElementsByClassName("next active")[0].click();
    }
},250)


function getChoices(html) {
    let choices = []
    for (let element of html) {
        choices.push(element.innerText)
    }
    return choices;
}

async function getDef(word) {
    let api = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
    try {
        let dets = await fetch(api).then(data => data.json()).then(data=>data[0].meanings[0].definitions[0]);
        return dets.definition
    } catch (error) {
        throw(error)
    }
}


function getType(quest){
    let type=false;
    let children = quest.children;
    for(let element of children){
        if(element.className=="spelltheword"){
            type = "spell"
        }
        if(element.className=="choices"){
            console.log(children[1])
            if(children[1].childElementCount>0){
                type = "choice1";
            }
            else if(children[1].childElementCount==0){
                type = "choice2";
            }
        }
    }
    console.log(type)
    return type;
}


async function getVocabularyAnswer(question, choices, word) {
    const url = 'https://api.openai.com/v1/chat/completions';

    let prompt = ` Question: ${question}. Options: [${choices.join(", ")}].`
    if (word) {
        prompt = prompt + ` Note that the definition of "${word}" is ${await getDef(word)}`
    }
    console.log(prompt)
    // Prepare the message with instructions
    const messages = [
        {
            role: "system",
            content: "You are a vocabulary assistant. Your task is to determine the best definition for a given word or phrase from a set of multiple-choice options. Return only the single correct option number with no additional text or explanation."
        },
        {
            role: "user",
            content: prompt
        }
    ];

    const data = {
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 5,
        temperature: 0
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        const answer = jsonResponse.choices[0].message.content.trim();
        return answer;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}