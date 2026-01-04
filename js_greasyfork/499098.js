// ==UserScript==
// @name         EDTell Test Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract the questions and answers to a text file
// @author       HackrTP
// @match        https://founders.edtell.com/samigo-app/jsf/delivery/deliverAssessment.faces
// @match        https://founders.edtell.com/samigo-app/jsf/delivery/beginTakingAssessment.faces
// @icon         https://founders.edtell.com/favicon.ico
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/499098/EDTell%20Test%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/499098/EDTell%20Test%20Helper.meta.js
// ==/UserScript==

const bookmarkletScript = `javascript:(function() {
  const startText = '2 Points';
  const endText = 'Reset Selection';
  const selection = window.getSelection();
  const range = document.createRange();
  let startNode, endNode;
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  while ((node = walker.nextNode())) {
    if (node.textContent.trim() === startText) {
      startNode = node;
    } else if (node.textContent.trim() === endText) {
      endNode = node;
      break;
    }
  }
  if (startNode && endNode) {
    range.setStartAfter(startNode);
    range.setEndBefore(endNode);
    selection.removeAllRanges();
    selection.addRange(range);
    const selectedText = selection.toString().replace(startText, '').replace(endText, '').trim();
    if (selectedText) {
      const questionCount = localStorage.getItem('questionCount') || 1;
      localStorage.setItem('questionCount', Number(questionCount) + 1);
      let fileContent = localStorage.getItem('ExtractedData') || '';
      if (questionCount === 1) {
        fileContent += 'Give me the letters of the correct answers to the following questions and give them to me like this: QuestionNumber:Letter,QuestionNumber,Letter and so on (there should be no spaces), also dont include numbers from websites or hyperlinks to websites as numbers in your response and no periods: ';
      }
      fileContent += \`Question \${questionCount}: \${selectedText}\\n\`;
      localStorage.setItem('ExtractedData', fileContent);
      console.log('Text appended to temporary file.');
      const nextButton = document.getElementById('takeAssessmentForm:next');
      if (nextButton) {
        nextButton.click();
      } else {
        console.log('Next button not found.');
      }
    } else {
      console.log('No text found between the specified markers.');
    }
    selection.removeAllRanges();
  } else {
    console.log('Failed to extract the text.');
  }
})();`;

let count = 0;
const intervalId = setInterval(() => {
  if (count >= 0.916) {
    clearInterval(intervalId);
    console.log('Script executed 50 times.');
    return;
  }
  count++;
  console.log(`Executing script for the ${count}th time.`);
  setTimeout(() => {
    const bookmarkletLink = document.createElement('a');
    bookmarkletLink.href = bookmarkletScript;
    bookmarkletLink.click();
  }, 500);
}, 300);
