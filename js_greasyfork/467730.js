// ==UserScript==
// @name         Web Math Minute Auto Complete
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  automatically answers webmathminute.com
// @author       Pearl
// @match        https://webmathminute.com/online-start
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467730/Web%20Math%20Minute%20Auto%20Complete.user.js
// @updateURL https://update.greasyfork.org/scripts/467730/Web%20Math%20Minute%20Auto%20Complete.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Select all elements with class "MathQuestion"
    const mathQuestions = document.querySelectorAll('body > div.MathScreen > form > div:nth-child(2) > div.MathQuestion')

    const button = document.querySelector("body > div.MathScreen > form > div.Centered > input[type=submit]")

    if (!button) {
        return alert("Button not found.")
    }

    mathQuestions.forEach(question => {
        const inputElement = question.querySelector('body > div.MathScreen > form > div:nth-child(2) > div.MathQuestion > input.MathResponse')

        const mathExpression = question.innerHTML

        // Extract the operands from the math expression
        const splittedExpression = mathExpression.split(/&nbsp;|&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;|<br>/).filter(Boolean)

        // Get the answer
        const answer = calculate(splittedExpression)

        inputElement.value = answer
    });

    button.click();
})();

function calculate(splittedExpression) {
    const symbols = {
        "+": (num1, num2) => num1 + num2,
        "−": (num1, num2) => num1 - num2,
        "÷": (num1, num2) => num1 / num2,
        "×": (num1, num2) => num1 * num2,
        error: () => alert(`there was a big error, operand was ${operand}`)
    }

    const number1 = parseInt(splittedExpression[0])
    const number2 = parseInt(splittedExpression[2])
    const operand = splittedExpression[1]

    const equation = symbols[operand]||symbols.error

    return equation(number1, number2)
}