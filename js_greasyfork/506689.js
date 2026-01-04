/**
 * This is a Tampermonkey script that serves as an auto-answer bot for IXL Math.
 * It automatically answers questions in the IXL Math practice by tampering with the DOM.
 */
 
/**
 * Function to simulate a click event on an element.
 *
 * @param {HTMLElement} element - The element to click.
 */
function simulateClick(element) {
    const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    element.dispatchEvent(event);
}
 
/**
 * Function to automatically answer IXL Math questions.
 */
function autoAnswer() {
    // Get the question element
    const questionElement = document.querySelector('.question');
 
    // Get the answer choices
    const answerChoices = questionElement.querySelectorAll('.answer-choice');
 
    // Choose the first answer choice
    const answerChoice = answerChoices[0];
 
    // Simulate a click on the answer choice
    simulateClick(answerChoice);
}
 
// Call the autoAnswer function to start auto-answering questions
autoAnswer();