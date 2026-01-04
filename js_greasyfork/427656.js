// ==UserScript==
// @name         Brainly Answer Revealer
// @namespace    https://joey585.com
// @version      1.00
// @description  Reveals the answers on brainly, even if you are restricted.
// @author       Joey585
// @match        https://brainly.com/question/*
// @icon         https://media.cdnandroid.com/item_images/770840/imagen-brainly-0thumb.jpeg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427656/Brainly%20Answer%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/427656/Brainly%20Answer%20Revealer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // formats text
    function unicodeToChar(text) {
        return text.replace(/\\u[\dA-F]{4}/gi,
            function (match) {
                return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
            });
    }

    // finds the content of the question and answer
    const data = document.getElementsByClassName("js-main-question").item(0).dataset.z;
    if(data.length > 20)
    {
        let index = data.indexOf('"content":"') + 11;
        console.log(index)
        const answers = [];
        while(true){
            const begin = data.indexOf('"content":"', index) + 11;
            if(begin < index){
                break
            }
            index = data.indexOf('"mark"', begin)-2
            answers.push(data.substring(begin , index))
            const tempi = data.indexOf("comments", index);
            if(tempi > index){
                index = data.indexOf( '}',tempi)
            }
            if(index < begin)
            {break}
            console.log("begin" + begin)
            console.log("index" + index)
            console.log("comments" + tempi)
            console.log("==================")
        }
        // logs the answer and starts to format it into readability
        console.log(answers)
        const regex = /(<script(\s|\S)*?<\/script>)|(<style(\s|\S)*?<\/style>)|(<!--(\s|\S)*?-->)|(<\/?(\s|\S)*?>)/g
        const bodyDoc = document.getElementById('question-sg-layout-container');
        // waits 3 seconds to look for the get answers button
        setTimeout(() => {
            const valid = bodyDoc.getElementsByClassName('brn-qpage-next-answer-box__blockade')
            if (valid) {
                const answerButton = bodyDoc.getElementsByClassName('sg-animation-fade-in-fast brn-qpage-next-question-box__actions')
                const answersPresent = answers.length
                // checks if there is one question
                if (answersPresent === 1) {
                    answerButton[0].lastElementChild.innerHTML = `<strong>Answer 1:</strong><br>${answers[0].replaceAll(regex, ' ')}`
                    return alert('Only one answer!')
                }
                // replaces the button with the answers after 3 seconds
                answerButton[0].lastElementChild.innerHTML = `<strong>Answer 1:</strong><br>${answers[0].replaceAll(regex, ' ')}<hr><hr><strong>Answer 2:</strong><br>${answers[1].replaceAll(regex, ' ')}`
            } else {
                return alert('Answers are visible!');
            }
        }, 3000)

        // more formatting
        removeElms("brn-kodiak-answer__unlock")
        removeElms("brn-kodiak-answer__preview-end")
        const answerBoxes = document.getElementsByClassName("brn-kodiak-answer__content");
        for(let i = 0; i<answerBoxes.length ; i++){
            answerBoxes[i].innerHTML = decodeURIComponent(unicodeToChar(answers[i].replace(/<\\\//g , "</")))
        }

        function removeElms(classname){
            const paras = document.getElementsByClassName(classname);
            while(paras[0]) {
                paras[0].parentNode.removeChild(paras[0]);
            }
        }
    }
    else
    {
        window.alert('This will only work if you are signed in.')
    }
    // CREDITS: Subatomicmc (Found the answers) I just rewrote it to work.
    // Author: Joey585
    // Discord: Joey585#0585
    // Twitter: @Joey585Official
})();