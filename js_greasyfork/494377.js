// ==UserScript==
// @name        考试宝添加快捷键
// @namespace   Violentmonkey Scripts
// @match       https://www.kaoshibao.com/online/*
// @grant       none
// @version     1.1
// @author      FishNaCl
// @description 2024/5/8 16:19:32
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494377/%E8%80%83%E8%AF%95%E5%AE%9D%E6%B7%BB%E5%8A%A0%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/494377/%E8%80%83%E8%AF%95%E5%AE%9D%E6%B7%BB%E5%8A%A0%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(event) {
    var xpath = '//*[@id="body"]/div[2]/div[1]/div[2]/div[1]/div/div[1]/div/div[2]';
    var options = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.children;
    var buttonXpath = '//*[@id="body"]/div[2]/div[1]/div[2]/div[1]/div/div[1]/div/div[3]/button[2]';
    var button = document.evaluate(buttonXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var button2Xpath = '//*[@id="body"]/div[2]/div[1]/div[2]/div[1]/div/div[1]/div/div[3]/button[1]'
    var button2 = document.evaluate(button2Xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var submitBtnXpath = '//*[@id="body"]/div[2]/div[1]/div[2]/div[1]/div/div[1]/div/div[3]/button'
    var submitBtn = document.evaluate(submitBtnXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    let isMuitSelect = () => {
      var xpath = '//*[@id="body"]/div[2]/div[1]/div[2]/div[1]/div/div[1]/div/div[1]/div/span[1]';
      var result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
      var text = result.iterateNext().textContent;
      return text === '多选题'
    }

    switch (event.key) {
        case 'a':
        case 'A':
            options[0].click();  // 点击选项A
            break;
        case 's':
        case 'S':
            options[1].click();  // 点击选项B
            break;
        case 'd':
        case 'D':
            options[2].click();  // 点击选项C
            break;
        case 'f':
        case 'F':
            options[3].click();  // 点击选项D
            break;
        case 'g':
        case 'G':
            options[4].click();  // 点击选项E
            break;
        case 'h':
        case 'H':
            options[5].click();  // 点击选项F
            break;
        case 'j':
        case 'J':
            options[6].click();  // 点击选项G
            break;
        case 't':
        case 'T':
            submitBtn.click();  // 点击提交答案
            break;
        case ' ':
            event.preventDefault();  // 阻止空格键的默认行为
            if (isMuitSelect()) {
              var nextXpath = '//*[@id="body"]/div[2]/div[1]/div[2]/div[1]/div/div[1]/div/div[4]/button[2]'
              var nextBtn = document.evaluate(nextXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
              nextBtn.click();
              break;
            }
            button.click();  // 按下空格键点击按钮
            break;
        case 'Shift':
            if (isMuitSelect()) {
              var nextXpath = '//*[@id="body"]/div[2]/div[1]/div[2]/div[1]/div/div[1]/div/div[4]/button[1]'
              var nextBtn = document.evaluate(nextXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
              nextBtn.click();
              break;
            }
            button2.click();
            break;
        default:
            break;
    }
});


