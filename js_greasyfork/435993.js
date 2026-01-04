// ==UserScript==
// @name         屏蔽知乎带货回答
// @namespace    https://greasyfork.org/zh-CN/users/843575-huixuphys
// @version      0.1
// @description  屏蔽掉包含带货链接的回答
// @author       huixuphys
// @match        https://www.zhihu.com/question/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/435993/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E5%B8%A6%E8%B4%A7%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/435993/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E5%B8%A6%E8%B4%A7%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==


//hide answers with ads that have already been loaded
var initial_answers = document.getElementsByClassName("List-item");
if (initial_answers.length == 0){
    let answers1 = Array.from(document.getElementsByClassName("Card AnswerCard"));
    let answers2 = Array.from(document.getElementsByClassName("Card MoreAnswers"));
    initial_answers = answers1.concat(answers2);
}
for (var i = 0; i < initial_answers.length; i++){
    let elem = initial_answers[i];
    if (elem.querySelector("div.RichText-MCNLinkCardContainer, div.RichText-Ecommerce, div.RichText-ADLinkCardContainer")){
        elem.hidden = true;
    }
}

//observer configuration to hide ads being loaded
const targetNode = document;
const config = {childList: true, subtree: true};
const callback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
        for (const target of mutation.addedNodes) {
            if (target.nodeType == 1){
                check_hide_ad(target);
            }
        }
    }
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

//check if an element contains ads and hide the associated answer if true
function check_hide_ad(elem){
    if (elem.className === "RichText-MCNLinkCardContainer" || elem.className === "RichText-Ecommerce" || elem.className === "RichText-ADLinkCardContainer") {
        let answer = elem.closest("div.List-item, div.Card.AnswerCard, div.Card.MoreAnswers");
        if (answer){
            answer.hidden = true;
        }
    }
}