// ==UserScript==
// @name         Genki Study Resources Helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Genki Study Resources helper for https://sethclydesdale.github.io/
// @author       You
// @match        https://sethclydesdale.github.io/*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429796/Genki%20Study%20Resources%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/429796/Genki%20Study%20Resources%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var inputs = document.getElementsByTagName('input');
    for (const input of inputs){
        if (input.className == "writing-zone-input"){
            var button = document.createElement("button");
            button.textContent = "?";
            button.className = "check-answers";
            input.parentNode.insertBefore(button, input.nextSibling);

            input.addEventListener("keydown", (event) => {
                if (event.key == "Enter") {
                    checkAnswers(input.parentNode);
                }
            });
        }
    }

    let buttons = document.getElementsByTagName("button");
    for (const button of buttons){
        if (button.className == "check-answers"){
            button.addEventListener("click", function() {
                checkAnswers(button.parentNode);
            });
        }
    }

    function checkAnswers(parent_element){
        let input = Array.from(parent_element.children).filter(function (e) { return e.nodeName=="INPUT"})[0]
        let answers = []
        let answer_values = Object.getOwnPropertyNames(input.dataset).filter(e => e.includes("answer"))
        let is_answer_correct = false;
        for (let answer_value of answer_values){
            let answer = input.dataset[answer_value];
            if (answer ==input.value){
                is_answer_correct = true;
            }
            answers.push(answer);
        }

        let alert_text = "";
        if (is_answer_correct){
            alert_text += "Correct";
        }else{
            alert_text+="Incorrect </br>"
            alert_text+="Current: "+input.value+"</br>";
            for (let answer of answers){
                let formatted_answer = ""
                for(let i=0;i<answer.length;i++){
                    if (input.value[i] == answer[i]){
                        formatted_answer+="<span style='color: green;'>"+answer[i]+"</span>"
                    }else{
                        formatted_answer+="<span style='color: red;'>"+answer[i]+"</span>"
                    }
                }
                alert_text+="Correct: "+formatted_answer+"</br>";
            }
        }
        let res_element = document.createElement("span")
        res_element.innerHTML = alert_text
        parent_element.parentElement.parentElement.insertBefore(res_element,parent_element.parentElement.nextSibling)
        let close_button = document.createElement("button")
        close_button.textContent="close"
        close_button.addEventListener("click", function(){
            res_element.remove();
            this.remove();
        })
        document.addEventListener('keydown', (event) => {
            if (event.key == "Escape"){
                res_element.remove();
                close_button.remove();
            }
        });
        res_element.parentElement.insertBefore(close_button,res_element.nextSibling)
    }

})();
