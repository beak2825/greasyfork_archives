// ==UserScript==
// @name         国开老平台自动评阅大作业
// @namespace    http://tampermonkey.net/
// @version      0.96
// @description  国开老平台形考任务中的大作业自动评分
// @author       delfino
// @match        http://hebei.ouchn.cn/mod/assign/view.php?*&action=grading
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447266/%E5%9B%BD%E5%BC%80%E8%80%81%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E8%AF%84%E9%98%85%E5%A4%A7%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/447266/%E5%9B%BD%E5%BC%80%E8%80%81%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E8%AF%84%E9%98%85%E5%A4%A7%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var fullmark=20;
    function waitingTime(time) {
        if (!Number.isInteger(time)) {
            time = 1000;
        }
        return new Promise(resolve => {
            setTimeout(function () {
                resolve('done');
            }, time);
        });
    }
    function generateRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    async function checkAndGrade() {
        let trs=document.querySelectorAll(".unselectedrow");
        for (var i = 0; i < trs.length; i++) {
            if(trs[i].querySelector(".cell.c7").textContent!="-"){
            //document.querySelectorAll(".cell.c4")[i].textContent!='没有作业'
                let blank=trs[i].querySelector("input[type=text].quickgrade")
                if (blank.value==""){
                    blank.scrollIntoView();
                    blank.value=generateRandomInteger(fullmark*0.8,fullmark*0.9);
                    await waitingTime(1000);
                }
            }
        }
        let btn_save=document.querySelector("#id_savequickgrades")
        btn_save.scrollIntoView();
        await waitingTime(2000);
        btn_save.click()
        console.log("评阅完毕!")
    }

    let button = document.createElement('button')
    button.id = "btnGrade"
    button.innerText = "自动评阅"
    button.style = 'position:fixed;top:63px;left:0.5rem;zIndex:99999;font-size: 16px;border:1px solid #fff;color:#212529;background:#fff;font-weight:400;'
    button.onclick = checkAndGrade;
    button.title="点击开始自动评阅"
    document.body.appendChild(button);
    let el_mark=document.querySelectorAll(".cell.c5")[1].textContent
    if(el_mark){
        fullmark=parseInt(el_mark.replace(/.*\//g,'').replace(/\s/,''))
    }

})();