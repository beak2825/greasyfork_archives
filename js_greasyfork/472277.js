// ==UserScript==
// @name         LztDynamicTimeContest
// @version      0.1
// @description  Динамическое обновление времени в темах розыгрышей
// @author       vuchaev2015
// @match        https://zelenka.guru/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @namespace https://greasyfork.org/users/997663
// @downloadURL https://update.greasyfork.org/scripts/472277/LztDynamicTimeContest.user.js
// @updateURL https://update.greasyfork.org/scripts/472277/LztDynamicTimeContest.meta.js
// ==/UserScript==

let postElement = document.querySelector('li[id^="post-"]');
if (postElement) {
    let postId = postElement.id.split('-')[1];
    let selector = `#post-${postId} > div.messageInfo > div.messageContent > article > div > div.new-raffle-info.mn-15-0-0 > div:nth-child(1) > div:nth-child(2)`;
    let textElement = document.querySelector(selector);
    if (textElement) {
        let textContent = textElement.textContent;

        textContent = textContent.replace(/\s+/g, ' ').trim();

        textContent = textContent.replace('Времени до завершения:', '');
        console.log(textContent);

        let duration = 0;
        let match = textContent.match(/(\d+) д(ня|ней|ень)/);
        if (match) {
            duration += parseInt(match[1]) * 24 * 60 * 60 * 1000;
        }
        match = textContent.match(/(\d+) час/);
        if (match) {
            duration += parseInt(match[1]) * 60 * 60 * 1000;
        }
        match = textContent.match(/(\d+) минут/);
        if (match) {
            duration += parseInt(match[1]) * 60 * 1000;
        }
        match = textContent.match(/(\d+) секунд/);
        if (match) {
            duration += parseInt(match[1]) * 1000;
        }

        let currentTime = new Date();
        let resultTime = new Date(currentTime.getTime() + duration);

        let lastRemainingTimeString = '';
        let newElementAdded = false;
        let intervalId = setInterval(() => {
            let currentTime = new Date();
            let remainingTime = resultTime - currentTime;
            if (remainingTime <= 0) {

                let resultTimeString = `${resultTime.getDate()} ${['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'][resultTime.getMonth()]} ${resultTime.getFullYear()} в ${resultTime.getHours()}:${resultTime.getMinutes().toString().padStart(2, '0')}`;
                textElement.innerHTML = `<div><p>До</p> ${resultTimeString}</div>`;

                let messageListElement = document.querySelector('ol.messageList');
                if (messageListElement) {
                    let usernameElements = messageListElement.querySelectorAll('a.username');
                    let rootUsernames = Array.from(usernameElements).filter(username => username.textContent === 'root')

                    if (rootUsernames.length > 0 && !newElementAdded && !document.querySelector('span.button.contestIsFinished.disabled')) {
                        let contestThreadBlockElement = document.querySelector('div.contestThreadBlock');
                        if (contestThreadBlockElement) {
                            let textHeadingElement = contestThreadBlockElement.querySelector('div.textHeading');
                            if (textHeadingElement) {
                                let newElement = document.createElement('span');
                                newElement.className = 'button contestIsFinished disabled';
                                newElement.innerHTML = '<i class="fa fa-check muted" aria-hidden="true"></i> Розыгрыш завершен';
                                contestThreadBlockElement.insertBefore(newElement, textHeadingElement.nextSibling);
                                newElementAdded = true;

                                let elementToRemove1 = document.querySelector(`#post-${postId} > div.messageInfo > div.messageContent > article > div > div.new-raffle-info.mn-15-0-0 > div:nth-child(1)`);
                                if (elementToRemove1) {
                                    elementToRemove1.parentNode.removeChild(elementToRemove1);
                                }
                                let elementToRemove2 = document.querySelector(`#post-${postId} > div.messageInfo > div.messageContent > article > div > div.new-raffle-info.mn-15-0-0 > div:nth-child(2)`);
                                if (elementToRemove2) {
                                    elementToRemove2.parentNode.removeChild(elementToRemove2);
                                }

                                let quickReplyMessageElement = document.querySelector('div.quickReply.message');
                                if (quickReplyMessageElement) {
                                    quickReplyMessageElement.outerHTML = '<div class="pageNavLinkGroup pageNavLinkGroupAfterPosts"><span class="element">Вы не можете выполнить это действие, потому что тема была закрыта.</span></div>';

                                }
                                clearInterval(intervalId);
                            }
                        }
                    } else {
console.log(22)}


                    let participateButtonElement = document.querySelector('.LztContest--Participate.button.mn-15-0-0.primary');
                    if (participateButtonElement) {
                        participateButtonElement.parentNode.removeChild(participateButtonElement);
                    }


                    let contestCaptchaElement = document.querySelector('.ContestCaptcha.mn-15-0-0');
                    if (contestCaptchaElement) {
                        contestCaptchaElement.parentNode.removeChild(contestCaptchaElement);
                    }


                }
            } else {
                let days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
                remainingTime -= days * (1000 * 60 * 60 * 24);
                let hours = Math.floor(remainingTime / (1000 * 60 * 60));
                remainingTime -= hours * (1000 * 60 * 60);
                let minutes = Math.floor(remainingTime / (1000 * 60));
                remainingTime -= minutes * (1000 * 60);
                let seconds = Math.floor(remainingTime / (1000));


                let remainingTimeString = '';
                if (days > 0) {
                    remainingTimeString += ` ${days} ${declOfNum(days, ['день', 'дня', 'дней'])}`;
                }
                if ((hours > 0 || days > 0) && !(days === 0 && hours === 0)) {
                    remainingTimeString += ` ${hours} ${declOfNum(hours, ['час', 'часа', 'часов'])}`;
                }
                if ((minutes > 0 || hours > 0 || days > 0) && !(days === 0 && hours === 0 && minutes === 0)) {
                    remainingTimeString += ` ${minutes} ${declOfNum(minutes, ['минута', 'минуты', 'минут'])}`;
                }
                if (days === 0) {
                    remainingTimeString += ` ${seconds} ${declOfNum(seconds, ['секунда', 'секунды', 'секунд'])}`;
                }


                if (remainingTimeString !== lastRemainingTimeString) {
                    textElement.innerHTML = `<div><p>Времени до завершения:</p> ${remainingTimeString}</div>`;
                    lastRemainingTimeString = remainingTimeString;
                }
            }
        });
    } else {
        console.log('Текстовый элемент не найден на странице');
    }
} else {
    console.log('Элемент с id, начинающимся с "post-", не найден на странице');
}

function declOfNum(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[(number %100 >4 && number %100 <20)?2:cases[(number %10 <5)?number %10:5]];
}
