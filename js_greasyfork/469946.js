// ==UserScript==
// @name         Just Read
// @description  Simplify your reading experience
// @license      MIT
// @homepageURL  https://github.com/isolcat/JustRead
// @match        https://www.zhihu.com/**
// @version      0.2.1
// @namespace    https://github.com/isolcat
// @downloadURL https://update.greasyfork.org/scripts/469946/Just%20Read.user.js
// @updateURL https://update.greasyfork.org/scripts/469946/Just%20Read.meta.js
// ==/UserScript==


const topstoryElement = document.querySelector('.Topstory');
const creators = document.querySelector('.css-1oy4rvw');
const elements = document.querySelectorAll('.Card.TopstoryItem.TopstoryItem-isRecommend');
const content = document.querySelector('.Topstory-mainColumn')
const questionList = document.querySelector('.QuestionAnswers-answers')
const videoTab = document.querySelectorAll('.TopstoryTabs-link.Topstory-tabsLink')
const searchHot = document.querySelector('.css-1oy4rvw')
const zhiUrl = window.location.href


if (zhiUrl.includes('question')) {
    creators.remove()
    questionList.style.margin = '0 auto'
} else if (zhiUrl.includes('search')) {
    searchHot.remove()
} else {
    content.style.margin = '0 auto'
    content.style.width = '960px'
    videoTab[3].style.display = 'none';
}


content.style.margin = '0 auto'
content.style.width = '960px'

if (topstoryElement) {
    topstoryElement.querySelector('div')?.remove();
}

if (creators) {
    creators.remove();
}

function removeElement() {
    var elements = document.querySelectorAll('.css-i2yo90');
    elements.forEach(function (element) {
        var parentElement = element.closest('.Card.TopstoryItem.TopstoryItem-isRecommend');
        if (parentElement) {
            parentElement.remove();
        }
    });
}

setInterval(removeElement, 100);




