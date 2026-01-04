// ==UserScript==
// @name        BetterColor - pintia.cn
// @namespace   Violentmonkey Scripts
// @match       https://pintia.cn/*
// @license MIT
// @grant       none
// @version     0.0.3
// @author      -Celery
// @description 修改PTA正确答案和错误答案的颜色
// @downloadURL https://update.greasyfork.org/scripts/454136/BetterColor%20-%20pintiacn.user.js
// @updateURL https://update.greasyfork.org/scripts/454136/BetterColor%20-%20pintiacn.meta.js
// ==/UserScript==

var config = {
    correct: "#2bd269", //正确
    partialCorrect: "#f06200", //部分正确
    wrongAnswer: "#ff0000", //错误
    syntaxError: "rgb(237, 158, 0)", //编译错误
    timeOut: "rgb(240, 98, 0)", //超时
    main: "rgb(129, 27, 180)", //主题色
}

function setColor(key, value) {
    // let a = document.documentElement.style.getPropertyValue(key)
    // console.log(key + a);
    document.documentElement.style.setProperty(key, value)
};

function setCSS() {
    let list = document.getElementsByClassName('pc-text')
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        // console.log(element)
        switch (element.children[0].textContent) {
            case "答案正确":
                element.style.color = config.correct
                element.style.textShadow = '1px 1px 2px rgba(0,0,0,0.1)'
                element.style.fontWeight = '900'
                break;
            case "答案错误":
                element.style.color = config.wrongAnswer
                element.style.fontWeight = '900'
                break;
            case "编译错误":
                element.style.fontWeight = '900'
                element.style.color = config.syntaxError
                break;
            case "运行超时":
                element.style.fontWeight = '900'
                element.style.color = config.timeOut
                break;
            case "运行时错误":
                element.style.fontWeight = '900'
                element.style.color = config.partialCorrect
                break;
            case "您的程序未能在规定时间内运行结束":
                element.style.fontWeight = '900'
                element.style.color = config.timeOut
                break;
            case "您的程序未能在规定时间内运行结束":
                element.style.fontWeight = '900'
                element.style.color = config.timeOut
                break;
            case "部分正确":
                element.style.color = config.partialCorrect
                break;

            default:
                // element.style.color = config.wrongAnswer
                break;
        }

    }
}
function    setTextColor(){
    document.documentElement.style.color = '#ffffff'
}
setInterval(setCSS, 100);
setTextColor()

setColor('--color-ac', config.correct)
setColor('--color-wa', config.wrongAnswer)
setColor('--color-primary', config.main)
// setColor('--bg-base', '#b9f')
// setColor('--bg-light', '#b9f')
// setColor('--text-light', '#b9f')
setColor('--darkreader-bg--color-ac',config.correct);
setColor('--darkreader-text--color-ac',config.wrongAnswer);
setColor('--darkreader-border--color-ac',config.main);









