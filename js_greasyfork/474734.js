// ==UserScript==
// @name         AtutorSolver
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Helps to solve tests with ChatGPT
// @author       Propsi4
// @include      https://dl.tntu.edu.ua/mods/_standard/tests/*.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dl.tntu.edu.ua
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474734/AtutorSolver.user.js
// @updateURL https://update.greasyfork.org/scripts/474734/AtutorSolver.meta.js
// ==/UserScript==


let hide = false

const hide_divs = (hide, divs) => {
    if(hide){
            divs.forEach(div => {
                Array.from(div.children).forEach((child) => {
                    if(child.id === "prompt-area"){
                        child.style.display = "none"
                    }
                })
            })
        }else{
            divs.forEach(div => {
                Array.from(div.children).forEach((child) => {
                    if(child.id === "prompt-area"){
                        child.style.display = "block"
                    }
                })
            })
        }
}

(function() {
    'use strict';

    const row_divs = document.getElementsByClassName("row")
    const page_wrap = document.getElementsByClassName("page-wrap")[0]
    const hide_button = document.createElement("button")
    hide_button.innerText = "X"
    hide_button.style.position = "fixed"
    hide_button.style.top = "0"
    hide_button.style.right = "0"
    hide_button.style.zIndex = "1000"
    hide_button.style.opacity = "20%"
    let hide = false

    page_wrap.appendChild(hide_button)
    // get only divs with children p and ul.multichoice-question
    const question_divs = Array.from(row_divs).filter(row_div => {
        const children = Array.from(row_div.children)
        const has_p = children.some(child => child.tagName === "P")
        const has_ul = children.some(child => child.tagName === "UL" && (child.classList.contains("multichoice-question") || child.classList.contains("multianswer-question")))
        return has_p && has_ul
    })

        hide_button.onclick = () => {
        hide = !hide
        hide_divs(hide, question_divs)
    }
    document.addEventListener('keydown', function(event) {
      if (event.shiftKey && event.key === 'Z') {
        hide = !hide
        hide_divs(hide, question_divs)
    }
    });

   document.addEventListener('mousedown', function(event) {
    if (event.button === 1) {
        hide = !hide
        hide_divs(hide, question_divs)
    }
   });

    const question_data = question_divs.map(question_div => {
        const question_text = question_div.children[0].innerText
        // if question ul class is multichoice-question, then it is multichoice question
        // get ul tag
        const ul_div = Array.from(question_div.children).find(child => child.tagName === "UL")
        const type = ul_div.classList[0]
        // ignore last answer, because it is "I don't know"
        if(type == "multichoice-question"){
            const answers = Array.from(ul_div.children).slice(0, -1).map(answer_div => {
                // try to get answer input, if error then skip
                try{
                    const answer_input = answer_div.children[0]
                    const answer_text = answer_div.children[1].innerText
                    return {
                        answer_text,
                        answer_input
                    }
                } catch (error) {
                    return null
                }})
            return {
                question_div,
                question_text,
                type,
                answers
            }
        }else{
            const answers = Array.from(ul_div.children).map(answer_div => {
                // try to get answer input, if error then skip
                try{
                    const answer_input = answer_div.children[0]
                    const answer_text = answer_div.children[1].innerText
                    return {
                        answer_text,
                        question_div,
                        answer_input
                    }
                } catch (error) {
                    return null
                }})
            return {
                question_div,
                question_text,
                type,
                answers
            }
        }
    })

    // add a textarea to every question_div
    question_divs.forEach((question_div, question_index) => {
        const textarea = document.createElement("textarea")
        const {question_text, type, answers} = question_data[question_index]
        let prompt = `Кількість правильних відповідей: ${type == "multichoice-question" ? "Одна правильна відповідь" : "Декілька правильних відповідей"}
Запитання: ${question_text}\n${answers.map((answer, index) =>
            `Відповідь ${index + 1}: ${answer?.answer_text}`).join("\n")}`

        textarea.id = "prompt-area"
        textarea.style.width = "100%"
        textarea.style.height = "100px"
        textarea.style.resize = "none"
        textarea.value = prompt


        question_div.appendChild(textarea)
    })


})();
