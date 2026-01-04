// ==UserScript==
// @name         Intuitive SharpLingo
// @namespace    https://github.com/frei-l/Intuitive-Sharplingo
// @version      0.1.1
// @description  改善sharplingo在PC端的体验
// @author       freil
// @match        https://sharplingo.cn/users/study
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497414/Intuitive%20SharpLingo.user.js
// @updateURL https://update.greasyfork.org/scripts/497414/Intuitive%20SharpLingo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // document.querySelector('#card-confirm-modal > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)').click()
    document.getElementById("card-tips").style.display = "none"
    document.getElementById("sentence-tips").style.display = "none"
    const buttonGroup = document.querySelector('#card-div > div:nth-child(3)')
    buttonGroup.style.margin = "0 30%"
    //for (const button of buttonGroup.children){
    //    button.style.width = "40%"
    //}

    // redo the card
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.code === 'KeyR') {
            const redoButton = document.querySelector('#restart-card-str > :first-child')
            if(redoButton){
                // prevent refeshing page
                event.preventDefault()
                event.stopPropagation()
                redoButton.click()
            }

        }
    });
    // explain the card
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.code === 'KeyS') {
            const explainButton = document.querySelector('#show_word_page > :first-child')
            if(explainButton){
                // prevent saving page
                event.preventDefault()
                event.stopPropagation()
                explainButton.click()
            }

        }
    })
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            const inputBox = document.getElementById("answer_input")
            // recover focus on input
            inputBox && inputBox.focus()
        }
    });
    // skip the card
    document.addEventListener('keydown', function(event) {
        if (event.shiftKey && event.code === 'Space') {
            document.getElementById("too_easy").click()
        }
    });
    // play the audio if available
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.code === 'KeyP') {
            const wordAudio = document.getElementsByClassName('word-audio-study')[0] || document.getElementById("phrase-audio")
            if(wordAudio){
                event.preventDefault()
                event.stopPropagation()
                wordAudio.play()
            }
        }
    });
    // next card
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            if(document.activeElement.tagName === 'INPUT'){
                const submitButton = document.getElementById("first_try") || document.getElementById("second_try")
                submitButton.click()
                // whether the submit button is hidden
                if(submitButton.className.includes("hidden")){
                    document.getElementById("next").click()
                }
                // const submissionFeedback = document.querySelector('.valid-feedback')
            }else if (document.activeElement.id === 'word-modal-study') {
                // look up word
                const closeModal = document.querySelector('#word-modal-study > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)')
                const inputBox = document.getElementById("answer_input")
                closeModal.click()
                // recover focus on input
                inputBox && inputBox.focus()
            }else if(document.querySelectorAll('.form-check-input').length > 1){
                // mutiple choice question
                const submitButton = document.getElementById("first_try") || document.getElementById("second_try");
                // whether the submit button is hidden
                if(submitButton.className.includes("hidden")){
                    // click next button
                    document.getElementById("next").click()
                }else{
                    // click submit button
                    submitButton.click()
                }
                return false
            }
        }
    });
})();