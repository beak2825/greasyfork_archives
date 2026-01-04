// ==UserScript==
// @name         Quizizz | - | - | Assistant
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Learns from your mistakes, does the quiz for you after (NO LONGER WORKING, WILL NOT BE FIXED).
// @author       GSRHackZ
// @match        https://quizizz.com/join/*
// @icon         https://cf.quizizz.com/img/favicon/apple-touch-icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457832/Quizizz%20%7C%20-%20%7C%20-%20%7C%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/457832/Quizizz%20%7C%20-%20%7C%20-%20%7C%20Assistant.meta.js
// ==/UserScript==

let answers = [],miner=true;
if(localStorage.getItem("answers")!==null){answers=JSON.parse(localStorage.getItem("answers"))};
setInterval(()=>{
    if(document.getElementsByClassName("primary-action-btn")[0]!==undefined){
        document.getElementsByClassName("primary-action-btn")[0].click();
    }
    if(document.getElementsByClassName("primary-button")[0]!==undefined){
        document.getElementsByClassName("primary-button")[0].click();
    }
    if(document.getElementsByClassName("resizeable question-text-color")[0]!==undefined){
        let quest = document.getElementsByClassName("resizeable question-text-color")[0].innerText;
        if(document.getElementsByClassName("options-grid")[0]!==undefined){
            let choices = document.getElementsByClassName("options-grid")[0].children;
            let uid=false;
            if(document.getElementsByClassName("question-media")[0]!==undefined){
                if(document.getElementsByClassName("question-media")[0].children[0].classList.contains("question-image")){
                    uid = document.getElementsByClassName("question-media")[0].children[0].src.split("?")[0];
                }
            }
            if(!answer(quest,choices,uid)){
                for(let i=0;i<choices.length;i++){
                    choices[i].children[0].children[0].addEventListener("click",()=>{
                        setTimeout(()=>{
                            if(getCorr(choices)!==false){
                                let save = {"quest":quest,"answr":getCorr(choices),"uid":uid}
                                if(!isKnown(save)){
                                    answers.push(save);
                                    localStorage.setItem("answers",JSON.stringify(answers));
                                }
                                if(document.getElementsByClassName("right-navigator")[0]!==undefined){
                                    document.getElementsByClassName("right-navigator")[0].click();
                                }
                            }
                        },250)
                    })
                }
            }
            if(miner){
                setInterval(()=>{
                    choices[Math.floor(Math.random()*choices.length)].children[0].children[0].click();
                },250)
            }
        }
    }
    else{
        if(document.getElementsByClassName("right-navigator")[0]!==undefined){
            document.getElementsByClassName("right-navigator")[0].click();
        }
        if(document.getElementsByClassName("selectors-container")[0]!==undefined){
            let redemQuests = document.getElementsByClassName("selectors-container")[0].children;
            redemQuests[Math.floor(Math.random()*redemQuests.length)].click();
        }
    }
},500)
function isKnown(obj){
    for(let i=0;i<answers.length;i++){
        if(answers[i].quest==obj.quest&&answers[i].answr==obj.answr&&answers[i].uid==obj.uid){
            return true;
        }
    }
    return false;
}
function answer(quest,choices,uid){
    for(let i=0;i<choices.length;i++){
        if(isKnown({"quest":quest,"answr":choices[i].children[0].children[0].innerText,"uid":uid})){
            choices[i].children[0].children[0].click();
            return true;
        }
    }
    return false;
}
function getCorr(arr){
    let correct = false;
    for(let i=0;i<arr.length;i++){
        if(arr[i].classList.contains("is-correct")){
            correct = arr[i].children[0].children[0].innerText;
        }
    }
    return correct;
}