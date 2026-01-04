// ==UserScript==
// @name         互评脚本
// @namespace    none
// @version      1.0
// @description  mooc互评脚本
// @author       Jpc
// @match        https://www.icourse163.org/*
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/520783/%E4%BA%92%E8%AF%84%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/520783/%E4%BA%92%E8%AF%84%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

function start() {
    'use strict'
    let button = document.createElement('button');
    button.textContent = '点击一键完成';
    button.style.color = 'white';
    button.style.width = '90px';
    button.style.height = '30px';
    button.style.background = 'green'
    button.addEventListener('click', clickButton)
    function clickButton(){
        let divs = document.getElementsByClassName('s');

        for (let i in divs){
            if (isNaN(i)){
                break;
            }
            let div = divs[i];
            let lb = div.lastElementChild;
            let ipt = lb.firstElementChild;
            ipt.checked = true;
        }

        let text = document.getElementsByClassName("inputtxt")
        for (let i in text){
            if (isNaN(i)){
                break;
            }
            let t = text[i];
            t.value = "good";
        }

        let submit = document.getElementsByClassName('u-btn u-btn-default f-fl j-submitbtn')
        submit[0].click();
    }
    let postion = document.getElementsByClassName('statusHead f-cb')[0];
    postion.appendChild(button);
};

setTimeout(start, 3000);