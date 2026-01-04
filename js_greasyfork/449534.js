// ==UserScript==
// @name         10fastfinger履歴
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  履歴が表示されるよ
// @license MIT
// @author       つべ
// @match        https://10fastfingers.com/typing-test*
// @match         https://10fastfingers.com/advanced-typing-test/english
// @exclude     https://10fastfingers.com/typing-test/japanese
// @exclude     https://10fastfingers.com/typing-test/simplified-chinese
// @exclude     https://10fastfingers.com/typing-test/traditional-chinese
// @icon           https://www.google.com/s2/favicons?sz=64&domain=10fastfingers.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449433/10fastfinger%E5%B1%A5%E6%AD%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/449433/10fastfinger%E5%B1%A5%E6%AD%B4.meta.js
// ==/UserScript==
document.body.insertAdjacentHTML("beforeend",`<style>
#Extended_Result{
border-radius: 4px;
padding: 2px 5px;
margin-bottom: 10px;
border: 1px solid blue;
background-color: rgb(255, 255, 255);
flex-wrap: wrap; /* 折返し指定 */
display: flex;
}

.add_div{
margin: 0px 2px;
height: 1.3em;
font-family: Times New Roman, Times, serif;
font-size: 1.5em;
}
<style>`)
document.getElementById("input-row").insertAdjacentHTML("afterend",`<div id="Extended_Result"></div>`);
const Result = document.getElementById('Extended_Result');
const form_control = document.getElementsByClassName("form-control")[0]
document.addEventListener('keypress', (e)=>{
    if (e.code === 'Space' && form_control.value) {
            let element_div = '';
        let row_span = document.querySelector("#row1").querySelectorAll('span');
        let Inputting = 0;
        for(let i in row_span){
            if(!row_span[i].getAttribute("class")){
                Inputting = i -1;
                break;
            }
        }
        let Inputting_element = row_span[Inputting]
            if(Inputting_element.textContent == form_control.value){
                element_div = `<div style="color: #008000" class="add_div">${form_control.value}</div>`;
            }else{
                element_div = `<div style="color: #FF0000" class="add_div" title="${Inputting_element.textContent}">${form_control.value}</div>`;
            }
            Result.insertAdjacentHTML("beforeend",element_div)
        }
});

document.getElementById("reload-btn").addEventListener('click',()=>{
    Result.innerText = '';
});