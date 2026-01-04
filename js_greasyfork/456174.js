// ==UserScript==
// @name         Write That Essay quiz completer
// @description  Add a button that automatically gets 100% on a Write That Essay quiz
// @include      https://www.writethatessay.org/wte/learning-journey/stage/*/quiz
// @run-at       document-idle
// @license      MIT
// @version 0.0.1.20221207102327
// @namespace https://greasyfork.org/users/993871
// @downloadURL https://update.greasyfork.org/scripts/456174/Write%20That%20Essay%20quiz%20completer.user.js
// @updateURL https://update.greasyfork.org/scripts/456174/Write%20That%20Essay%20quiz%20completer.meta.js
// ==/UserScript==

/*===== CONFIG =====*/

let incorrectColor = "rgb(237, 28, 36)"
let correctColor = "rgb(86, 224, 0)"
let checkFrequency = 20

/*==================*/

//Define
let answers = {}
let questionbindings = {}
let labels
const waitUntil = (condition) => {
    return new Promise((resolve) => {
        let interval = setInterval(() => {
            if (!condition()) {
                return
            }
            clearInterval(interval)
            resolve()
        }, checkFrequency)
    })
}

(async function() {
while (true) {
await waitUntil(() => (document.getElementsByClassName("css-e973uh")[0] != null && document.getElementsByClassName("custom_flex")[0] == null))

let flex = document.createElement("div")
flex.className = "custom_flex"
flex.style = `
display: flex;
flex-direction: row;
margin-bottom: 0px;
margin-left: auto;
margin-right: auto;
magin-top: 0px;
width: 100%;
align-items: center;
`
document.getElementsByClassName("intro")[0].appendChild(flex)
flex.appendChild(document.getElementsByClassName("start-button")[0])

let btn = document.createElement("button")
btn.innerText = "Auto"
btn.onclick = main
btn.className = "auto-button css-p4hiy8"
document.getElementsByClassName("start-button")[0].style.marginRight = "0px"
btn.style.marginLeft = "10px"
btn.style.marginRight = "auto"
document.getElementsByClassName("custom_flex")[0].appendChild(btn)

}
})()

//Wrap inside async
async function main() {

//Repeat the quiz
for(var z = 0; z < 30; z++){
    
    let guesses = []
    let questions = []
    
    //Start quiz
    document.getElementsByClassName("start-button")[0].click()
    await waitUntil(() => (document.getElementsByClassName("css-alz08e")[0] != null)) 
    
    //Repeat for each question
    for(var i = 0; i < 10; i++){
        let ans = document.getElementsByClassName("answers")[0]
        let buttons = ans.childNodes
        
        //Get labels of each question
        labels = []
        for(var j = 0; j < buttons.length; j++){
            labels[j] = buttons[j].childNodes[1].childNodes[0].innerHTML
        }
        
        //Get title
        let question = document.getElementsByClassName("question-text")[0].innerText
        questions.push(question)
        
        //Check if there is a known answer for the current question
        if (!(answers.hasOwnProperty(question))) {
            //If no known answer, guess
            if (z == 0) {
                var selNum = 0
            } else {//..
                for(var k=0;k<labels.length;k++){
                    if(labels[k] == questionbindings[question][z]){
                        var selNum = k
                        break;
                    }
                }
            }
        } else {
            //If the answer is known, select the answer
            for(var k=0;k<labels.length;k++){
                if(labels[k] == answers[question]){
                    var selNum = k
                    break
                }
            }
        }
        guesses.push(labels[selNum])
        //Click the button that is guessed or known
        buttons[selNum].click()


        if (z == 0) {
            //Bind answers if first loop
            for(var g = 0; g < labels.length; g++){
                questionbindings[question] = labels
            }
        }
        
        //Click next question button
        document.getElementsByClassName("css-1eo8gmz")[0].click()
    }
    //Wait for results to appear
    await waitUntil(() => (document.getElementsByClassName("css-yf25u6")[0] != null)) 
    
    //Read results
    let results = document.getElementsByClassName("tick-or-cross")
    for(var r = 0; r < results.length; r++){
        if (window.getComputedStyle(results[r], null).getPropertyValue("background-color") == correctColor) {
            answers[questions[r]] = guesses[r]
        }
    }
    
    //Stop if all questions are correct
    if (Object.keys(answers).length >= 10) {
        break
    }
    
    //Accept results
    document.getElementsByClassName("css-1eo8gmz")[0].click()
    await waitUntil(() => (document.getElementsByClassName("start-button")[0] != null))
}
}