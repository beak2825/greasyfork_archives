// ==UserScript==
// @name         Tae Kim - Hide/reveal answers
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hides answers to Tae Kim examples until hover
// @author       ncg
// @match        http://www.guidetojapanese.org/learn/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/29366/Tae%20Kim%20-%20Hidereveal%20answers.user.js
// @updateURL https://update.greasyfork.org/scripts/29366/Tae%20Kim%20-%20Hidereveal%20answers.meta.js
// ==/UserScript==

function nextSiblings(node) {
    const elements = [];
    if (node.nextSibling) {
        elements.push(node.nextSibling);
        Array.prototype.push.apply(elements, nextSiblings(node.nextSibling));
    }
    return elements;
}


// Examples

const answerClass = 'us-tk-answer';
const highlightClass = 'us-tk-highlight';

const $answers = $($('h3:contains("Example")').nextUntil('h3').has('.popup').find('br').map((_, element) => $(nextSiblings(element))).map((_, $answer) => $answer.wrapAll($(`<span class='${answerClass} ${highlightClass}'>`)).parent().get()));

$answers.hover(function() {
    $(this).toggleClass(highlightClass);
});



GM_addStyle(`
.${answerClass}.${highlightClass}, .${answerClass}.${highlightClass} * {
    color: black;
    background-color: black;
}
`);


// Practice questions

$('.answerline').hover(function() {
    $(this).find('span').toggleClass('hide');
});
