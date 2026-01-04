// ==UserScript==
// @name         切换木易编码
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  切换编码提示
// @author       You
// @match        https://typer.owenyang.top/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=owenyang.top
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484824/%E5%88%87%E6%8D%A2%E6%9C%A8%E6%98%93%E7%BC%96%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/484824/%E5%88%87%E6%8D%A2%E6%9C%A8%E6%98%93%E7%BC%96%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let changeTip = () => {
        let checkEle = document.querySelector('#home > section > aside > div > div:nth-child(5) > div > div:nth-child(2) > span:nth-child(2) > div');
        let racingCodeTextArea = document.querySelector('#racing-code-textarea');
        if(!checkEle.classList.contains("is-checked")){
            racingCodeTextArea.style.display = "block";
        } else{
            racingCodeTextArea.style.display = "none";
        }
        checkEle.click();
    }

    let html = '<textarea autocomplete="off" id="racing-code-textarea" placeholder="编码" class="el-textarea__inner" style="min-height: 58px;"></textarea>'
    let racingTextAreaPa = document.querySelector('#racing-textarea').parentElement;
    racingTextAreaPa.insertAdjacentHTML("beforebegin", html);


    let racingCodeTextArea = document.querySelector('#racing-code-textarea');
    racingCodeTextArea.oninput = (e) => {
        console.log(e);
        let codeArr = document.querySelectorAll(".code.pending");
        let line = e.target.value;

        if(/[\u4E00-\u9FA5]/.test(e.data) || e.isComposing === false){
            codeArr.forEach((x,i) => {
                if(i>line.length - 1){
                    codeArr[i].classList.remove("error");
                    codeArr[i].classList.remove("correct");
                } else{
                    if(codeArr[i].querySelector("span").innerText == line[i]){
                        codeArr[i].classList.remove("error");
                        codeArr[i].classList.add("correct");
                    }else{
                        codeArr[i].classList.remove("correct");
                        codeArr[i].classList.add("error");
                    }
                }

            })
            if(e.inputType === "deleteContentBackward"){
                return;
            }


            if(codeArr[line.length - 1].querySelector("span").innerText == e.data){
                if(codeArr.length == line.length){
                    //alert("完成")
                    e.target.value = "";
                    codeArr.forEach((x,i) => {
                        codeArr[i].classList.remove("error");
                        codeArr[i].classList.remove("correct");
                    });
                } else{

                    codeArr[line.length-1].classList.remove("error");
                    codeArr[line.length-1].classList.add("correct");
                }
            } else{
                codeArr[line.length-1].classList.remove("correct");
                codeArr[line.length-1].classList.add("error");
            }
        }

    }

    let sheet = document.createElement('style')
    //sheet.setAttribute('media', 'screen')
    sheet.innerHTML = `
    #racing-code-textarea{
        overflow: auto;
        display: none;
        padding: 5px 15px;
        font-family: var(--racing-font);
        border: none;
        font-size: var(--font-size);
        line-height: calc(var(--font-size) + 1rem);
        height: calc((var(--font-size) + 2rem)*var(--input-rows));
        transition: all .3s ease-out;
        background: #13151A;
        margin-bottom: 20px;
    }
    `
    document.head.appendChild(sheet);

    document.querySelector(".article-info").onclick = changeTip;
    window.addEventListener("keydown", e => {
        if(e.keyCode === 81 && e.altKey ){
            changeTip();
            e.stopPropagation();
        }
    })
})();