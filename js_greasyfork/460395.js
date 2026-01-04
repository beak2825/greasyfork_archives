// ==UserScript==
// @name         test
// @namespace    
// @version      0.2
// @description  瀏覽器使用測試
// @author       niyoyo
// @match        https://swordgale.online/*

// @downloadURL https://update.greasyfork.org/scripts/460395/test.user.js
// @updateURL https://update.greasyfork.org/scripts/460395/test.meta.js
// ==/UserScript==
(function()
{
    'use strict';
	//開啟系統設定UI
    function createOpenDialogButton(){
        //開啟設定的按鍵
        const openDialogBtn = document.createElement("button");
        openDialogBtn.id = "open-dialog-btn"
        openDialogBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-settings" width="50" height="50" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
            <circle cx="12" cy="12" r="3" />
            </svg>
        `
        const style = document.createElement("style");
        //scss
        style.innerText = `*{box-sizing:border-box}.wrapper{display:flex;align-items:center;justify-content:center;background-color:rgba(15,19,26,.8);height:100vh;position:fixed;width:100%;left:0;top:0;overflow:auto;z-index:9999}.header{display:flex;justify-content:space-between;margin:1rem 1rem 0 1rem}.header button{height:100%}.header h1{color:#fff}.header #reset-settings-btn{border:1px solid #3c3f43;margin-right:1rem}.content{display:flex;margin:0 1rem 1rem 1rem;flex-direction:column}.content hr{width:100%}.panel{position:relative;width:100%;display:flex;flex-direction:column}.panel input[type=checkbox]{margin:.5rem}.panel input[type=text]{background-color:#1a1d24;background-image:none;border:1px solid #3c3f43;border-radius:6px;color:#e9ebf0;display:block;font-size:14px;line-height:1.42857143;padding:7px 11px;transition:border-color .3s ease-in-out;width:100px}.panel+.panel::before{border-top:1px solid #3c3f43;content:"";left:20px;position:absolute;right:20px;top:0}.panel-header{width:100%;padding:20px}.panel-header span{color:#fff;font-size:16px;line-height:1.25}.panel-body{padding:0 20px 20px 20px}.panel-body .row{margin-top:1rem;display:flex;align-items:center}.panel-body .row label{color:#a4a9b3;margin-right:1rem}.panel-body .row input{margin-right:1rem}.panel-body .row.table{flex-direction:column;align-items:flex-start}.grid{margin-top:10px;width:100%;color:#a4a9b3;background-color:#1a1d24}.grid div{border-bottom:1px solid #292d33;width:100%;height:40px;padding:10px}.grid .grid-row{display:flex;align-items:center}.grid .grid-row:hover{background-color:#3c3f43}.grid .grid-row button{font-size:14px;border:none;background-color:rgba(0,0,0,0);color:#9146ff;margin-left:auto}.grid .grid-row button:hover{cursor:pointer}.description{margin:0px;color:#a4a9b3;line-height:1.5;font-size:8px}.dialog{width:800px;height:500px;left:0;top:0;overflow:auto;z-index:9999;background-color:#292d33;border-radius:6px;box-shadow:0 4px 4px rgba(0,0,0,.12),0 0 10px rgba(0,0,0,.06)}#open-dialog-btn{position:-webkit-sticky;position:sticky;left:0;bottom:20px;margin-right:1rem;z-index:9998;color:#7d7d7d;background-color:rgba(0,0,0,0);border:none}#open-dialog-btn:hover{color:#fff}[hidden]{display:none}#exp-bar{position:fixed;bottom:0px;width:100%;height:24px}#exp-bar-fill{position:fixed;bottom:0px;left:0px;height:24px}.exp-container{display:flex;justify-content:flex-end;position:fixed;width:100%;bottom:0px}.quick-filter-container{display:flex;margin-bottom:.5rem;align-items:center;-webkit-box-align:center}.quick-filter-container div{width:18px;height:18px;margin-right:var(--chakra-space-3);border-radius:50%;background:var(--chakra-colors-transparent);border-width:2px;border-style:solid;-o-border-image:initial;border-image:initial;cursor:pointer}.quick-filter-container .circle-red{border-color:var(--chakra-colors-red-500)}.quick-filter-container .circle-red:hover{background-color:var(--chakra-colors-red-300)}.quick-filter-container .circle-blue{border-color:var(--chakra-colors-blue-500)}.quick-filter-container .circle-blue:hover{background-color:var(--chakra-colors-blue-300)}.quick-filter-container .circle-cyan{border-color:var(--chakra-colors-cyan-500)}.quick-filter-container .circle-cyan:hover{background-color:var(--chakra-colors-cyan-300)}.quick-filter-container .circle-green{border-color:var(--chakra-colors-green-500)}.quick-filter-container .circle-green:hover{background-color:var(--chakra-colors-green-300)}.quick-filter-container .circle-teal{border-color:var(--chakra-colors-teal-500)}.quick-filter-container .circle-teal:hover{background-color:var(--chakra-colors-teal-300)}.quick-filter-container .circle-orange{border-color:var(--chakra-colors-orange-500)}.quick-filter-container .circle-orange:hover{background-color:var(--chakra-colors-orange-300)}.quick-filter-container .circle-yellow{border-color:var(--chakra-colors-yellow-500)}.quick-filter-container .circle-yellow:hover{background-color:var(--chakra-colors-yellow-300)}.quick-filter-container .circle-pink{border-color:var(--chakra-colors-pink-500)}.quick-filter-container .circle-pink:hover{background-color:var(--chakra-colors-pink-300)}.quick-filter-container .circle-purple{border-color:var(--chakra-colors-purple-500)}.quick-filter-container .circle-purple:hover{background-color:var(--chakra-colors-purple-300)}.quick-filter-container .circle-gray{border-color:var(--chakra-colors-gray-500)}.quick-filter-container .circle-gray:hover{background-color:var(--chakra-colors-gray-300)}`;
        // document.querySelector("#open-dialog-btn").onclick = () => {createSettingUI(); registerSettingUIEvent();}
        openDialogBtn.onclick = () => {createSettingUI(); registerSettingUIEvent();}
        document.body.appendChild(style);
        document.body.appendChild(openDialogBtn);
    }
    //系統設定UI
    function createSettingUI(){
        const wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.display = "";
        wrapper.innerHTML = ` <div class="dialog">
        <div class="header">
            <h1>SGO介面優化插件 Ver${VERSION}</h1>
            <div>
                <button id="reset-settings-btn">RESET</button>
                <button id="close-dialog-btn">X</button>
            </div>
        </div>
        <div class="content">
        </div>
        </div>`
        const rowEvent = {
            checkbox: (e) => {
                const element = e.target;
                setObjectValueByRecursiveKey(SETTINGS, element.getAttribute("bind-setting"), element.checked);
                saveSettings();
            },
            colorInput: (e) => {
                const element = e.target;
                const bindSetting = element.getAttribute("bind-setting");
                if(!/^#[0-9a-fA-F]{6}$|transparent/.test(element.value)){
                    element.value = getSettingByKey(bindSetting);
                }
                setObjectValueByRecursiveKey(SETTINGS, bindSetting, element.value);
                element.nextElementSibling.style.color = element.value
                saveSettings();
            },
            numberInput: (e) => {
                const element = e.target;
                const bindSetting = element.getAttribute("bind-setting");
                if(element.value === "" || Number.isNaN(Number(element.value))){
                    element.value = getSettingByKey(bindSetting);
                    return;
                }
                setObjectValueByRecursiveKey(SETTINGS, bindSetting, Number(element.value))
                saveSettings();
            },
            input: (e) => {
                const element = e.target;
                const bindSetting = element.getAttribute("bind-setting");                
                setObjectValueByRecursiveKey(SETTINGS, bindSetting, element.value)
                saveSettings();
            }
        }

			}
			function createRecipeTable() {
                const recipeDiv = document.createElement("div");
                recipeDiv.id = "recipeDiv";
                recipeDiv.style.marginBottom = "1.25rem";
                const recipeH2 = materialDiv.querySelector("h2").cloneNode();
                recipeH2.innerText = "合成配方(非官方功能)";
 
                const recipeTable = materialDiv
                    .querySelector(".chakra-table__container")
                    .cloneNode();
                recipeTable.innerHTML = materialDiv.querySelector(
                    ".chakra-table__container"
                ).innerHTML;
 
                const tableColumns = recipeTable.querySelectorAll("thead > tr > th");
                tableColumns[0].innerText = "名稱";
                tableColumns[1].innerText = "材料";
                tableColumns[1].removeAttribute("data-is-numeric");
                tableColumns[2].innerText = "操作";
                tableColumns[2].style.minWidth = "1px";
                tableColumns[2].style.width = "1px";
                //清空Table
                recipeTable.querySelector("tbody").innerHTML = "";
 
                elementClassname["td"] =
                    materialDiv.querySelector("tbody > tr > td").className;
                elementClassname["tr"] =
                    materialDiv.querySelector("tbody > tr").className;
 
                recipeDiv.appendChild(recipeH2);
                recipeDiv.appendChild(recipeTable);
 
                return recipeDiv;
            }
			function createAddRecipeBlock() {
                const div = document.createElement("div");
                div.style.marginBottom = "1.25rem";
 
                div.innerHTML = `
                      <div class="${elementClassname["labelDiv"]}">選擇完原料之後輸入配方名字，可將此次選擇的原料記錄在合成配方裡面</div>
                      <input id="recipeNameInput" type="text" class="${elementClassname["input"]}" style="width: 80%;">
                      <button id="addRecipeBtn" type="button" class="${elementClassname["button"]}" style="width: 18%; float: right;">新增配方</button>
                  `;
                return div;
            }
}
)();