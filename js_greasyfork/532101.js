// ==UserScript==
// @name         Отчёты додо
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @description  Скрипт для выгрузки отчётов додо
// @author       1570184
// @match        https://catwar.net/blog31391
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catwar.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532101/%D0%9E%D1%82%D1%87%D1%91%D1%82%D1%8B%20%D0%B4%D0%BE%D0%B4%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/532101/%D0%9E%D1%82%D1%87%D1%91%D1%82%D1%8B%20%D0%B4%D0%BE%D0%B4%D0%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setFunctionalityButton();

function main () {
    const blogContent = [...document.querySelectorAll(".view-comment")];
    const comments = blogContent;
    const outputText = getText(comments).flat(1);
    let textToCopy = "";
    for (let i=0; i<outputText.length; i++) {
        textToCopy = textToCopy + (outputText[i].toString()) + "\n";
    }
    console.log(textToCopy);
    navigator.clipboard.writeText(textToCopy);
}

function getText (comments) {
  const outputText = [];
  for (let item of comments) {
      const info = item.querySelector(".comment-info").innerHTML;
      const body = item.querySelector(".parsed").innerText;
      const content = getType (info, body);
      if (content) { outputText.push(content) };
      }
   if (outputText !== null) { return outputText };
} // sets the info and body variables, returns single comment data

function getType (info, body) {

        const isHunt = /одили/.test(body);
        const isClean = /смешанной/.test(body);
        //console.log(body)

        if (isHunt) {
          return getHunt (info, body);
        } else if (isClean) {
          return getCleaning (info, body);
        } else {
          return "Другое";
        }
} // detects comment type, forks the function

function getHunt (info, body) {
    const number = info.match(/(?<="num">)([0-9]{1,})(?=\<\/span)/gm)[0];
    const time = body.match(/([0-9]{1,2}:[0-9]{1,2})/g)[0];
    const date = body.match(/[0-9]{2}.[0-9]{2}.[0-9]{2}/g)[0];
    const author = info.match(/(?<="\/cat)([0-9]{1,10})(?=")/g)[0];
    const text = body.match(/(?<=:\s).{1,}/gm)[0];
    const result = huntBreakdown (text);
    let content = [];
  for (let item of result) {
    content.push (["Охота", number, time, date, author, item]);
  }
    return content;
} // runs through the result of brekdown, returns the complete hunt report data

function getCleaning (info, body) {
    const number = info.match(/(?<="num">)([0-9]{1,})(?=\<\/span)/gm)[0];
    const time = info.match(/([0-9]{1,2}:[0-9]{1,2})/g)[0];
    const date = body.match(/[0-9]{2}.[0-9]{2}.[0-9]{2}/g)[0];
    const author = info.match(/(?<="\/cat)([0-9]{1,10})(?=")/g)[0];
    const name = body.match(/(?<=бота:)([А-Яа-яЁё ]{1,})/g)[0];
    const isPenalty = /\[БС\]/.test(body);
    const score = (isPenalty) ? 0 : 1;
    return [["Чистка", number, time, date, author, name.trim(), "", score]];
} // breaks down hunt report by participant

function huntBreakdown (text) {

    let hunt = [];

    const breakdown = text.split(",");

    for (let i=0; i<breakdown.length; i++) {
        detectAndGet(breakdown[i]);
    }

    function detectAndGet (participant) {

        const isPair = participant.match(/\[[А-Яа-яЁё ]{3,}/);
        const isCarry = participant.match(/\([Оо]тн/);
        const isProbation = participant.match(/\[ИС\]/)
        const isPenalty = participant.match (/\[БС\]/);
        const isHunt = participant.match(/\([0-9] . [0-9]\)/);
        const isGuest = participant.match(/[Гг]ость/);

        let name = "default";
        let result = "";
        let score = 0;

        if (isGuest) {
            name = "гость";
            hunt.push(name + "," + result + "," + score);
        } else if (isPair) {
            const leadData = participant.match(/(.{3,})(?=\[)/g)[0];
            const followData = participant.match(/(?<=\[)(.{3,})(?=\])/g)[0];
            detectAndGet(leadData);
            detectAndGet(followData);
        } else if (isPenalty) {
            name = participant.match(/([А-Яа-яЁё ]{1,})(?=\()/g)[0].trim();
            result = "[БС]"
            hunt.push(name + "," + result + "," + score);
        } else if (isProbation) {
            name = participant.match(/([А-Яа-яЁё ]{1,})(?=\()/g)[0].trim();
            result = "[ИС]"
            score = 1;
            hunt.push(name + "," + result + "," + score);
        } else if (isCarry) {
            name = participant.match(/([А-Яа-яЁё ]{1,})(?=\()/g)[0].trim();
            result = "относ";
            score = 0.5;
            hunt.push(name + "," + result + "," + score);
        } else if (isHunt) {
            name = participant.match(/([А-Яа-яЁё ]{1,})(?=\()/g)[0].trim();
            result = participant.match(/(?<=\()([0-9]{1,2} . [0-9]{1,2})/g)[0];
            score = getRole(result);
            hunt.push(name + "," + result + "," + score);
        } else {
            name = "ОШИБКА";
            hunt.push(name + "," + result + "," + score);
        }

    }
  return hunt;
} // breaks the comment down, counts the participants and their score

function getRole (result) {

        const first = Number(result.match(/([0-9]{1,2})(?=.{1,})/g));
        const second = Number(result.match(/(?<=.{1,})([0-9]{1,2})/g));
        if (first + second*2 >= 4) {
            return 1;
        } else {
            return 0.5;
        }

} // coounts the result and returns result and score

function setFunctionalityButton() {
        const container = document.querySelector("#send_comment_form > p:nth-child(3)");
        let button = document.createElement("input");
        button.type = "button";
        button.value = "Скопировать отчёт";
        button.style.marginLeft = "5px";
        button.style.backgroundColor = "green";
        button.onclick = () => main();
        container.append(button);
}

})();