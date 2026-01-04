// ==UserScript==
// @name         Blooket UI adder (it actually sucks beta sucks dot download for free bobux)
// @namespace    http://tampermonkey.net/
// @version      2
// @description  it doesnt remove it it just sets it to 120 since its does an error if its over that
// @author       You
// @match        https://*.blooket.com/*
// @match        https://chat.openai.com/*
// @icon         https://res.cloudinary.com/blooket/image/upload/v1613003832/Blooks/redAstronaut.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486768/Blooket%20UI%20adder%20%28it%20actually%20sucks%20beta%20sucks%20dot%20download%20for%20free%20bobux%29.user.js
// @updateURL https://update.greasyfork.org/scripts/486768/Blooket%20UI%20adder%20%28it%20actually%20sucks%20beta%20sucks%20dot%20download%20for%20free%20bobux%29.meta.js
// ==/UserScript==


setInterval(() => {
  var e = document.createElement("iframe");
  document.body.append(e);
  window.alert = e.contentWindow.alert.bind(window);
  e.remove();
  var inputField = document.querySelector('input[class*="nameInput"]');
  if (inputField.maxLength === 120) {
    clearInterval();
    return;
  }
  inputField.maxLength = 120;
  alert("You like Alce XDXDXD por");
}, 100);

setInterval(() => {
  const { state: o, props: t } = Object.values(document.querySelector('body div[class*="camelCase"]'))[1].children[0]._owner["stateNode"];
  [...document.querySelectorAll('[class*="answerContainer"]')].forEach((e, s) => {
    if ((o.question || t.client.question).correctAnswers.includes((o.question || t.client.question).answers[s])) {
      e.style.backgroundColor = "rgb(0, 207, 119)";
    } else {
      e.style.backgroundColor = "rgb(189, 15, 38)";
    }
  });
}, 150);
