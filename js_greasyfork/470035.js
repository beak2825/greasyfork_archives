// ==UserScript==
// @name         SGO auto action test
// @namespace    http://tampermonkey.net/
// @version      1.18
// @description  蟲抓不完根本住在淡水
// @author       You
// @match        https://swordgale.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=swordgale.online
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/470035/SGO%20auto%20action%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/470035/SGO%20auto%20action%20test.meta.js
// ==/UserScript==

(function()
{
    'use strict';

    // 參數
    const HUNT_NAME_LIST = ["趕路","戰鬥"];
    const BUTTON_AVAILABLE_CLASSNAME = "auto-act-btn-active";
    const BUTTON_DISABLED_CLASSNAME = "auto-act-btn-disable";
    const BUTTON_SETTING_CLASSNAME = "auto-act-btn-settings";
    const INPUT_CLASSNAME = "num-input-bar";
    const INPUTINFOCLASSNAME = "input-info";
    const H2_CLASSNAME = "chakra-heading css-1mnao0q";
    const BATTLE_CONTAINER_CLASSNAME = "chakra-container css-1033a4t";
    const INJECTION_CLASSNAME = "chakra-container css-1033a4t";
    const map = ['起始之鎮', '大草原', '猛牛原', '兒童樂園', '蘑菇園', '圓明園', '非洲大草原','空中花園','青藏高原','火鳳燎原','骷髏墓園','鷹洞','蝙蝠洞','老鼠洞','岩洞','盤絲洞','水簾洞','龍洞','藍洞'];
    const insidepass = ['N/A','草原秘徑','被詛咒的寺院','N/A','菇菇仙境','N/A','神秘部落','神廟','N/A','蜀營','破舊佛寺','N/A','黑暗密道','N/A','N/A','N/A','N/A','N/A','深海通路'];


    // 變數
    var myVersion = GM_info.script.version;
    var subtitle1;
    var subtitle2; // 副標
    var myFunctionButtons = []; // 按鈕s
    var loopInput; // 連續點擊數 (-1 表示無限連擊)
    var floorInput; // 指定層數
    var placeInput;
    var HPInput; // 最低HP
    var PowerInput; // 最低體力
    var equipmentInput;//穿幾件
    var DurabilityInput; // 耐久設定
    var SHOWINHOME;
    var BACKHOME;
    var inject;
    var title, loopInputInfo, floorInputInfo, placeInputInfo, StateInputInfo, equipmentInputInfo, DurabilityInputInfo, LowStateTimeInfo, LowStateTimeInput, horizontal;
    var place;
    var MOVETO;
    var MoveToCheck;

    GM_setValue("SETHP",GM_getValue("SETHP",300))
    GM_setValue("SETPower",GM_getValue("SETPower",300))
    GM_setValue("SETequipment",GM_getValue("SETequipment",-1))
    GM_setValue("SETDurability",GM_getValue("SETDurability",-1))
    GM_setValue("SETloop",GM_getValue("SETloop",-1))
    GM_setValue("SETfloor",GM_getValue("SETfloor",-1))
    GM_setValue("SETplace",GM_getValue("SETplace","大草原"))
    GM_setValue("SETlowtime",GM_getValue("SETlowtime",20))

    console.log("into auto hunt main function");

    // 進入點 小夫
    var INTOSC = setInterval ( function (){
        if (this.lastPath !== location.pathname) {
        this.lastPath = location.pathname;
        if (location.pathname === "/hunt") {
            EndRecursive();
            main();
            //clearInterval(INTOSC);
        } else {
            // 不是可以自动的地方就滚
            return;
        }
        }
    }, 500);


    // 主函式
    function main(){
        //console.log("into auto hunt main function");
        const style = document.createElement("style");
        ADDCSS(style);
        document.body.appendChild(style);

        // 先決定我們在哪個頁面
        let usingActionList = [];
        let usingInjectionPos;
        let usingInjectionOrder;

        if (location.pathname === "/hunt") {
            usingActionList = HUNT_NAME_LIST;
            usingInjectionPos = document.getElementsByClassName(BATTLE_CONTAINER_CLASSNAME)[0];
            usingInjectionOrder = 1;
        } else {
            // 不是可以自動的地方就滾
            //console.log("MAIN不是HUNT就滾");
            location.reload();
            return INTOSC();
        }

        // 綁定按紐們
        let allbuttons = document.getElementsByTagName('button');
        let actionButtons = [];
        myFunctionButtons = [];
        for(let i = 0; i < allbuttons.length; i++)
        {
            for(let j = 0; j < usingActionList.length; j++)
            {
                if(allbuttons[i].innerText == usingActionList[j] && allbuttons[i].offsetParent !== null) /*.parentElement.style.display != "none"*/
                {
                    actionButtons.push(allbuttons[i]);
                    continue;
                }
            }
        }

        // 製作選單
        inject = document.createElement('div');
        title = document.createElement("h2");
        subtitle1 = document.createElement('p');
        subtitle2 = document.createElement('p');

        StateInputInfo = document.createElement('p');
        HPInput = document.createElement('input');
        PowerInput = document.createElement('input');

        equipmentInputInfo = document.createElement('p');
        equipmentInput = document.createElement('input');

        DurabilityInputInfo = document.createElement('p');
        DurabilityInput = document.createElement('input');

        loopInputInfo = document.createElement('p');
        loopInput = document.createElement('input');

        placeInputInfo = document.createElement('p');
        placeInput = document.createElement('input');

        floorInputInfo = document.createElement('p');
        floorInput = document.createElement('input');

        LowStateTimeInfo = document.createElement('p');
        LowStateTimeInput = document.createElement('input');

        horizontal = document.createElement('hr');



        //inject.classList = INJECTION_CLASSNAME;
        title.classList = H2_CLASSNAME;
        title.innerHTML = "自動TEST";

        StateInputInfo.className = INPUTINFOCLASSNAME;
        StateInputInfo.innerHTML = "最低HP&體力(高於此狀態才會繼續點)：";

        HPInput.setAttribute("type","text");
        HPInput.setAttribute("id","HPInput");
        HPInput.className = INPUT_CLASSNAME;
        HPInput.min = 1;
        HPInput.value = GM_getValue("SETHP");
        HPInput.oninput = () => {GM_setValue("SETHP", HPInput.value)};

        PowerInput.setAttribute("type","text");
        PowerInput.setAttribute("id","PowerInput");
        PowerInput.className = INPUT_CLASSNAME;
        PowerInput.min = 1;
        PowerInput.value = GM_getValue("SETPower");
        PowerInput.oninput = () => {GM_setValue("SETPower", PowerInput.value)};

        equipmentInputInfo.className = INPUTINFOCLASSNAME;
        equipmentInputInfo.innerHTML = "穿幾件裝：";
        equipmentInput.setAttribute("type","text");
        equipmentInput.setAttribute("id","equipmentInput");
        equipmentInput.className = INPUT_CLASSNAME;
        equipmentInput.min = 1; equipmentInput.value = GM_getValue("SETequipment");
        equipmentInput.oninput = () => {GM_setValue("SETequipment", equipmentInput.value)};

        DurabilityInputInfo.className = INPUTINFOCLASSNAME;
        DurabilityInputInfo.innerHTML = "耐久設定(高於此耐久才會繼續點)：";
        DurabilityInput.setAttribute("type","text");
        DurabilityInput.setAttribute("id","DurabilityInput");
        DurabilityInput.className = INPUT_CLASSNAME;
        DurabilityInput.min = 1; DurabilityInput.value = GM_getValue("SETDurability");
        DurabilityInput.oninput = () => {GM_setValue("SETDurability", DurabilityInput.value)};

        loopInputInfo.className = INPUTINFOCLASSNAME;
        loopInputInfo.innerHTML = "連續點擊數 (-1表示點到死)：";
        loopInput.setAttribute("type","text");
        loopInput.setAttribute("id","loopInput");
        loopInput.className = INPUT_CLASSNAME;
        loopInput.min = 1; loopInput.value = GM_getValue("SETloop");
        loopInput.oninput = () => {GM_setValue("SETloop", loopInput.value)};

        floorInputInfo.className = INPUTINFOCLASSNAME;
        floorInputInfo.innerHTML = "指定層數後停止(-1表示按到死,ex.輸入40則41停止)：";
        floorInput.setAttribute("type","text");
        floorInput.setAttribute("id","floorInput");
        floorInput.className = INPUT_CLASSNAME;
        floorInput.min = 1; floorInput.value = GM_getValue("SETfloor");
        floorInput.oninput = () => {GM_setValue("SETfloor", floorInput.value)};

        LowStateTimeInfo.className = INPUTINFOCLASSNAME;
        LowStateTimeInfo.innerHTML = "低於狀態的等待時間：";
        LowStateTimeInput.setAttribute("type","text");
        LowStateTimeInput.setAttribute("id","LowStateTimeInput");
        LowStateTimeInput.className = INPUT_CLASSNAME;
        LowStateTimeInput.value = GM_getValue("SETlowtime");
        LowStateTimeInput.oninput = () => {GM_setValue("SETlowtime", LowStateTimeInput.value)};

        placeInputInfo.className = INPUTINFOCLASSNAME;
        placeInputInfo.innerHTML = "指定要去的地方："
        placeInput.setAttribute("type","text");
        placeInput.setAttribute("id","placeInput");
        placeInput.className = INPUT_CLASSNAME;
        placeInput.value = GM_getValue("SETplace");
        placeInput.oninput = () => {GM_setValue("SETplace", placeInput.value)};


        horizontal.classList = "chakra-divider css-tc0ho1";


        if (GM_getValue("MOVETO")){
            GM_setValue("MoveToCheck", "input");
        }else{
            GM_setValue("MoveToCheck", "none");
        }

        if (GM_getValue("LOWSTATEWAIT")){
            GM_setValue("LowStateTimeCheck", "input");
        }else{
            GM_setValue("LowStateTimeCheck", "none");
        }

        let settingButt = document.createElement('button');
        settingButt.className = BUTTON_SETTING_CLASSNAME;
        settingButt.innerHTML = "Settings";
        settingButt.onclick = ()=>{ ShowSettingPage(); }

        // 創建剛綁好的按鈕
        let act1Butt = document.createElement('button');
        act1Butt.className = BUTTON_AVAILABLE_CLASSNAME;
        act1Butt.innerHTML = ""+actionButtons[0].innerHTML;
        act1Butt.onclick = ()=>{ StartRecursive(actionButtons[0]); }
        myFunctionButtons.push(act1Butt);

        let act2Butt = document.createElement('button');
        act2Butt.className = BUTTON_AVAILABLE_CLASSNAME;
        act2Butt.innerHTML = ""+actionButtons[1].innerHTML;
        act2Butt.onclick = ()=>{ StartRecursive(actionButtons[1]); }
        myFunctionButtons.push(act2Butt);


        // 止，吾止也
        let stopButt = document.createElement('button');
        stopButt.innerHTML = "停止";
        stopButt.className = BUTTON_AVAILABLE_CLASSNAME;
        stopButt.onclick = ()=>{ EndRecursive(); }
        inject.appendChild(stopButt);

        inject.appendChild(title);
        inject.appendChild(settingButt);
        if (GM_getValue("SHOWINHOME"))
            ShowInHomePage();
        inject.appendChild(subtitle1);
        inject.appendChild(subtitle2);
        inject.appendChild(act1Butt);
        inject.appendChild(act2Butt);
        inject.appendChild(stopButt);
        inject.appendChild(horizontal);

        function ShowInHomePage(){
            inject.appendChild(StateInputInfo);
            inject.appendChild(HPInput); inject.appendChild(PowerInput);
            inject.appendChild(equipmentInputInfo);
            inject.appendChild(equipmentInput);
            inject.appendChild(DurabilityInputInfo);
            inject.appendChild(DurabilityInput);
            inject.appendChild(loopInputInfo);
            inject.appendChild(loopInput);
            inject.appendChild(floorInputInfo);
            inject.appendChild(floorInput);
            if (GM_getValue("LOWSTATEWAIT")){
                inject.appendChild(LowStateTimeInfo);
                inject.appendChild(LowStateTimeInput);
            }
            if (GM_getValue("MOVETO")){
                inject.appendChild(placeInputInfo);
                inject.appendChild(placeInput);
            }
        }

        usingInjectionPos.insertBefore(inject, usingInjectionPos.childNodes[usingInjectionOrder])//.appendChild(inject);
    }



    function ShowSettingPage(){
        const wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.display = "";
        wrapper.innerHTML = `
            <div class="dialog">
                <div class="navbar">
                </div>
                <div class="header">
                    <h1>Auto action setting Ver${myVersion}</h1>
                    <button id="reset-settings-btn" hidden>RESET</button>
                    <button id="close-dialog-btn">X</button>
                </div>
                <div class="content-container">
                    <div class="content">
                    </div>
                </div>
            </div>`;    
        const rowEvent = {
            none: e => {
                const element = e.target;
                GM_setValue(element.getAttribute("bind-setting"), element.checked);
                },
            checkbox: e => {
                const element = e.target;
                const id = e.target.id;
                const bindSetting = element.getAttribute("bind-setting");
                GM_setValue(element.getAttribute("bind-setting"), element.checked);
            },
            colorInput: e => {
                const element = e.target;
                const bindSetting = element.getAttribute("bind-setting");
                // if(!/^#[0-9a-fA-F]{6}$|transparent/.test(element.value)){
                //     element.value = GM_getValue(bindSetting);
                // }
                GM_setValue(bindSetting, element.value);
                element.nextElementSibling.style.color = element.value;
            },
            numberInput: e => {
                const element = e.target;
                const id = e.target.id;
                const bindSetting = element.getAttribute("bind-setting");
                if (element.value === "" || Number.isNaN(Number(element.value))) {
                    element.value = GM_getValue(bindSetting);
                    return;
                }
                GM_setValue(bindSetting, bindSetting.value);
                element.oninput = id.value = GM_getValue(bindSetting);
            },
            input: e => {
                const element = e.target;
                const id = e.target.id;
                const bindSetting = element.getAttribute("bind-setting");
                const temp = document.getElementById(id)
                console.log(temp)
                GM_setValue(bindSetting, element.value);
                //element.oninput = () => {temp.value = GM_getValue(bindSetting)}
                element.onchange = temp.value = GM_getValue(bindSetting);
            }
        };

        const panel = [{
            category: "功能",
            description: "先做UI，大部分功能都還沒有做",
            rows: [{
                id: "ShowInHome",
                type: "checkbox",
                label: "在外層顯示(勾完重新整理)",
                bindSetting: "SHOWINHOME"
            },{
                id: "BackHome",
                type: "checkbox",
                label: "到層數回家",
                bindSetting: "BACKHOME"
            },{
                id: "LowStateTimeInput",
                type: "checkbox",
                label: "要不要設定低狀態逾時等待多久",
                bindSetting: "LOWSTATEWAIT"
            },{
                id: "MoveTo",
                type: "checkbox",
                label: "到指定區域(進入秘境)",
                bindSetting: "MOVETO"
            }]
        },{
            category: "數值設定",
            description: "設定最低數值",
            rows: [{
                type: "customize",
                html: `
                        <p class="description" style="font-size: 1rem">
                            ${StateInputInfo.innerHTML}
                        </p>
                    `
            },{
                id: "HPInput",
                type: "input",
                label: "HP：",
                bindSetting: "SETHP"
            },{
                id: "PowerInput",
                type: "input",
                label: "體力：",
                bindSetting: "SETPower"
            },{
                id: "equipmentInput",
                type: "input",
                label: equipmentInputInfo.innerHTML,
                bindSetting: "SETequipment"
            }, {
                id: "DurabilityInput",
                type: "input",
                label: DurabilityInputInfo.innerHTML,
                bindSetting: "SETDurability"
            }, {
                id: "loopInput",
                type: "input",
                label: loopInputInfo.innerHTML,
                bindSetting: "SETloop"
            }, {
                id: "floorInput",
                type: "input",
                label: floorInputInfo.innerHTML,
                bindSetting: "SETfloor"
            }, {
                id: "LowStateTimeInput",
                type:  GM_getValue("LowStateTimeCheck"),
                label: LowStateTimeInfo.innerHTML,
                bindSetting: "SETlowtime"
            },{
                id: "placeInput",
                type:  GM_getValue("MoveToCheck"),
                label: placeInputInfo.innerHTML,
                bindSetting: "SETplace"
            }, {
                type: "customize",
                html: `<p class="description" style="font-size: 1rem">
                       <font size='2'>
                       大地圖：起始之鎮,大草原,猛牛原,兒童樂園,蘑菇園,圓明園,非洲大草原,空中花園,青藏高原,火鳳燎原,骷髏墓園,鷹洞,蝙蝠洞,老鼠洞,岩洞,盤絲洞,水簾洞,龍洞,藍洞<BR>
                       秘境：草原秘徑,被詛咒的寺院,菇菇仙境,神秘部落,神廟,蜀營,破舊佛寺,黑暗密道,深海通路
                       </font>
                       </p>
                    `
            }]
        }
        ]
        function createRow(rowDiv, rowData) { //風佬
            const type = {
                none: () => {
                    rowDiv.innerHTML = `
                    <label for="${rowData.id}" style="visibility:hidden">${rowData.label}</label>
                    <input type="text" id="${rowData.id}" bind-setting="${rowData.bindSetting}" style="visibility:hidden">
                `;
                    const mainElement = rowDiv.querySelector(`#${rowData.id}`);
                    mainElement.value = GM_getValue(rowData.bindSetting);
                    mainElement.onchange = rowEvent[rowData.type];
                    mainElement.style.visibility = "hidden";
                },
                checkbox: () => {
                    rowDiv.innerHTML = `
                    <input type="checkbox" id="${rowData.id}" bind-setting="${rowData.bindSetting}">
                    <label for="${rowData.id}">${rowData.label}</label>
                `;
                    const mainElement = rowDiv.querySelector(`#${rowData.id}`);
                    mainElement.checked = GM_getValue(rowData.bindSetting);
                    mainElement.onchange = rowEvent[rowData.type];
                    if (rowData.event) {
                        mainElement.addEventListener("change", rowData.event);
                    }
                },
                input: () => {
                    rowDiv.innerHTML = `
                    <label for="${rowData.id}">${rowData.label}</label>
                    <input type="text" id="${rowData.id}" bind-setting="${rowData.bindSetting}">
                `;
                    const mainElement = rowDiv.querySelector(`#${rowData.id}`);
                    mainElement.value = GM_getValue(rowData.bindSetting,rowData.bindSetting);
                    mainElement.onchange = rowEvent[rowData.type];

                },
                numberInput: () => {
                    rowDiv.innerHTML = `
                    <label for="${rowData.id}">${rowData.label}</label>
                    <input type="text" id="${rowData.id}" bind-setting="${rowData.bindSetting}">
                `;
                    const mainElement = rowDiv.querySelector(`#${rowData.id}`);
                    mainElement.value = GM_getValue(rowData.bindSetting,rowData.bindSetting);
                    mainElement.oninput = rowEvent[rowData.type];
                },
                table: () => {
                    const tableData = GM_getValue(rowData.bindSetting);
                    let gridRowHTML = "";
                    if (!tableData.length) {
                        gridRowHTML = `
                    <div class="grid-row">
                        <label>空</label>
                    </div>`;
                    } else {
                        tableData.forEach(name => {
                            const div = document.createElement("div");
                            div.innerHTML = `
                            <label>${name}</label>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="19" height="19" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        `;
                            div.className = "grid-row";
                            const deleteButton = document.createElement("button");
                            deleteButton.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="19" height="19" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>`;
                            gridRowHTML += div.outerHTML;
                        });
                    }
                    rowDiv.innerHTML = `
                    <label>${rowData.label}</label>
                    <div class="grid" id="${rowData.id}" bind-setting="${rowData.bindSetting}">
                        <div class="grid-row-header">${rowData.header}</div>
                        ${gridRowHTML}
                    </div>`;
                },
                a: () => {
                    rowDiv.innerHTML = `
                    <a href="${rowData.link}" target="_blank" rel="noopener noreferrer">${rowData.label}</a>
                `;
                },
                button: () => {
                    rowDiv.innerHTML = `
                    <button class=${rowData.class}>${rowData.label} </button>
                `;
                    rowDiv.querySelector("button").onclick = rowData.event;
                },
                customize: () => {
                    rowDiv.className = "row table";
                    rowDiv.innerHTML = rowData.html;
                }
            };
            type[rowData.type]();
        }

        const content = wrapper.querySelector(".content");
        const navbar = wrapper.querySelector(".navbar");
        panel.forEach((panel, index) => {
            if (panel.mobile && !commonUtil.isMobileDevice()) return;
            const panelDiv = document.createElement("div");
            panelDiv.className = "panel";
            panelDiv.innerHTML = `
                <div class="panel-header">
                    <span>${panel.category}</span>
                </div>
                <div class="panel-body">
                    <p class="description">${panel.description}</p>
                </div>
            `;
            const panelBody = panelDiv.querySelector(".panel-body");
            panel.rows.forEach(row => {
                const rowDiv = document.createElement("div");
                rowDiv.className = /table/.test(row.type) ? "row table" : "row";
                createRow(rowDiv, row);
                panelBody.appendChild(rowDiv);
            });
            content.appendChild(panelDiv);
            panelDiv.setAttribute("panel-index", index);
            //panel 切換
            const button = document.createElement('button');
            button.innerHTML = panel.category.length > 2 ? `${panel.category.substring(0, 2)}<br>${panel.category.substring(2)}` : panel.category;
            button.setAttribute("bind-panel-index", index);
            button.onclick = e => {
                content.querySelector("[expand]")?.removeAttribute("expand");
                content.querySelector(`.panel[panel-index="${button.getAttribute("bind-panel-index")}"]`)?.toggleAttribute("expand");
                navbar.querySelector("[active]")?.removeAttribute("active");
                button.toggleAttribute("active");
            };
            if (index === 0) {
                panelDiv.toggleAttribute("expand");
                button.toggleAttribute("active");
            }
            navbar.appendChild(button);
        });
        document.body.appendChild(wrapper);
        document.querySelector("#close-dialog-btn").onclick = () => {document.querySelector(".wrapper").remove()}
        document.body.style.overflow = "";
        document.querySelector(".wrapper").onclick = e => {
            //if(e.target.className === "wrapper") e.target.style.display = "none";
            if (e.target.matches(".wrapper")) {
                e.target.remove();
                document.body.style.overflow = "";
            }
        };
    }



    // 以下是功能
    var recursiveTimerId;
    var clickCombo = 0;
    var clickComboTotal = 0;
    var continuousInvalidClick = 0;
    var isLastActionClick = false;
    var Notenough = 0;

    function StartRecursive(butt)
    {
        EndRecursive();
        for(var i = 0; i < myFunctionButtons.length; i++)
        {
            myFunctionButtons[i].className = BUTTON_DISABLED_CLASSNAME;
        }
        let recurCount = loopInput.value
        Recursive(butt, recurCount);
    }

    function Recursive(butt, maxCombo)
    {
        // Random: 1~2秒檢查一次
        let nextTime = 1000/*+Math.random()*1000*/;
        let LowWaitTime = GM_getValue("SETlowtime");
        maxCombo = GM_getValue("SETloop");


        let a = movement()
        if (a !== undefined){
            nextTime = a;
        }

        let FloorCheckOK = FloorChecker();

        if (FloorCheckOK==0){
          if (GM_getValue("BACKHOME")){
            setTimeout( ()=>{subtitle2.innerHTML = "<span style='color:yellow'>抵達層數！</span>";} , 100);
            movement('GOHOME');
          }else{
            setTimeout( ()=>{subtitle1.innerHTML = "<span style='color:green'>自律行動執行完成！</span>";} , 100);
            setTimeout( ()=>{subtitle2.innerHTML = "<span style='color:yellow'>抵達層數！</span>";} , 100);
            EndRecursive();
            return;
          }
        }


        let EquipmentCheckOK = EquipmentChecker();

        let LifeCkeckOK = LifeChecker();



        if(butt.disabled || butt.classList == 'css-14jkdoz')
        {
            // 仍在鎖，不能按
            isLastActionClick = false;
            continuousInvalidClick = 0;
            console.log("按鈕不能按！ 下次檢查時間(n秒後)："+nextTime/1000);
        }
        else
        {
            //console.log("into func Recursive(butt, maxCombo)開始點");
            //uselessfunc();
            if(LifeCkeckOK==1 && EquipmentCheckOK == 1 && FloorCheckOK == 1){
                // 按下去！
                subtitle1.innerHTML = "<span style='color:yellow'>開扁！</span>";
                butt.click();
                Notenough = 0;
                clickCombo++;
                clickComboTotal++;
                if(isLastActionClick)
                {
                    continuousInvalidClick++;
                }
                isLastActionClick = true;
                //console.log(clickCombo+"("+clickComboTotal+") combo!! "+butt.innerHTML + "\n下次檢查時間(n秒後)："+nextTime/1000);
            }
            else{
                Notenough++
                console.log("bad++");
            }
        }


        if(Notenough >= LowWaitTime && LowWaitTime!== -1){
          EndRecursive();
          subtitle1.innerHTML = "<span style='color:yellow'>低於狀態點擊達 "+LowWaitTime+" 次。請重新執行！</span>";
          return;
        }else if(continuousInvalidClick >= 10){
          EndRecursive();
          subtitle1.innerHTML = "<span style='color:yellow'>無效點擊達 10 次。請重新執行！</span>";
          return;
        }

        if( clickCombo >= maxCombo && maxCombo != -1){
          EndRecursive();
          subtitle1.innerHTML = "<span style='color:green'>自律行動執行完成！</span>";
          return;
        }else{
            recursiveTimerId = setTimeout( ()=>{Recursive(butt, maxCombo)} , nextTime);
            subtitle1.innerHTML = "<br><span style='color:cyan'>自律行動執行中！</span>";
            subtitle1.innerHTML += "<br>點擊【"+butt.innerHTML+"】，已點擊了 "+clickCombo+" ("+clickComboTotal+") 次！";
        }

        if(Notenough > 0 && LowWaitTime != -1){
          subtitle1.innerHTML += "<br><span style='color:yellow'>低於狀態點擊次數( "+LowWaitTime+" 次將會暫停腳本)："+Notenough+" / "+LowWaitTime;
        }else if(Notenough > 0 && LowWaitTime == -1){
          subtitle1.innerHTML += "<br><span style='color:yellow'>沒狀態但還是要壓榨到底";  
        }else if(continuousInvalidClick > 0){
          subtitle1.innerHTML = "<br><span style='color:yellow'>無效點擊次數( 10 次將會暫停腳本)："+continuousInvalidClick+" / 10 </span>";
          clickCombo--;
          clickComboTotal--;
        }

        
    }


    function movement(func){
      var GoWhichMap;
      let WhatDoing = document.getElementsByClassName('css-bxak8j')[0].childNodes[0].childNodes[0].textContent;
      let NowPlace = document.getElementsByClassName('css-bxak8j')[0].childNodes[0].childNodes[1].textContent;
      var nextTime

      if (func != null){
        act(func)
        return;
      }
      
      //自動進入秘境，並把GoWhichMap設為大圖名稱
      if(GM_getValue("MOVETO") && insidepass.includes(GM_getValue("SETplace")) == true ){
        let w = insidepass.indexOf(GM_getValue('SETplace'))
        GoWhichMap = map[w]
        if(Boolean(document.getElementsByClassName('chakra-button css-pvs4v')[0]) == true)
        {
            document.getElementsByClassName('chakra-button css-pvs4v')[0].click();
            nextTime = 100
            return nextTime;
        }
      }else{
          GoWhichMap=GM_getValue("SETplace")
      }

      if(GM_getValue("MOVETO") && String(WhatDoing) == "目前狀態：移動中（"){
        subtitle2.innerHTML = "<span style='color:yellow'>在走了催啥</span>";
        act("MoveComplete");
        nextTime = 5000;
        return nextTime;
      }

      //不再目標地圖，前往目的地
      if (String(WhatDoing) !="目前狀態：移動中（" && GM_getValue("MOVETO") && NowPlace != GoWhichMap && NowPlace != GM_getValue("SETplace")){
          if(String(NowPlace) == '起始之鎮'){
              subtitle2.innerHTML = "<span style='color:yellow'>在家按個雞巴</span>";
          }
          act('GoToThePlace',GoWhichMap)
          return;
      }


      function act(func,GoWhichMap){
          const GO = {
              //到達樓層回家
              GOHOME: () => {
                document.getElementsByClassName('chakra-button css-vw2zy9')[0].click();
                return;
              },
              //完成移動
              MoveComplete: () => {
                var a;
                if(Boolean(document.getElementsByClassName('css-newptn')[2].childNodes[2])==true){
                  a = document.getElementsByClassName('css-newptn')[2].childNodes[2].textContent;
                }
                if(a == "（可完成）")
                {
                  document.getElementsByClassName('chakra-button css-1adux0m')[0].click();
                  return ;
                }else{
                  return;
                }
              },
              //前往指定區域
              GoToThePlace: () => {
                let w = map.indexOf(GoWhichMap)
                document.getElementsByClassName('chakra-button css-vw2zy9')[w].click();
                return;
              }
          }
          GO[func]();
      }
      
    }

    function LifeChecker(){
      let limitpower = GM_getValue("SETPower")
      let limitHP = GM_getValue("SETHP");
      var hp = parseInt(document.getElementsByClassName('css-zad53')[0].childNodes[0].childNodes[1].data);
      var power = parseInt(document.getElementsByClassName('css-zad53')[0].childNodes[1].childNodes[1].data);
      var LifeCheckOK;

      if(power > limitpower && hp > limitHP){
        LifeCheckOK=1;
      }else if(power <= limitpower ){
        subtitle2.innerHTML = "<span style='color:yellow'>體力低於最低狀態！</span>";
        LifeCheckOK=0;
      }
      else if(hp <= limitHP ){
        subtitle2.innerHTML = "<span style='color:yellow'>HP低於最低狀態！</span>";
        LifeCheckOK=0;
      }
      return LifeCheckOK;
    }

    function FloorChecker(){
      let floor = GM_getValue("SETfloor");
      var getFloor
      var FloorOK = 0;
      var b

      if(Boolean(document.getElementsByClassName('css-bxak8j')[0].childNodes[0].childNodes[3])==true){
        b = document.getElementsByClassName('css-bxak8j')[0].childNodes[0].childNodes[3]
        if (isNaN(b.data) == false){
          getFloor = parseInt(b.data);
          console.log(getFloor)
        }else{
          return;
        }
      }else{
        return;
      }
      
      if (parseInt(getFloor) >= parseInt(floor)+1 && parseInt(floor) != -1)
      {
        FloorOK=0;
      }else{
        FloorOK=1;
      }
      return FloorOK;
    }

    function EquipmentChecker(){
      let limitDurability = GM_getValue("SETDurability");
      let em = GM_getValue("SETequipment");
      let OnWeapon = Boolean(document.getElementsByClassName('chakra-table css-2xrul2')[0].childNodes[1].childNodes[em-1]);
      //console.log("Durability="+document.getElementsByClassName('css-7sfvbv')[1].data);
      var Durability;
      var equipmentOK;

      /*if(OnWeapon==false){
        subtitle1.innerHTML = "<span style='color:yellow'>少武器！</span>";
        equipmentOK = 0;
        return equipmentOK;
      }*/

      // 執行em次：幾件裝做幾次
      if(em >0){
        for (let c = 0; c < em; c++) {
          if (OnWeapon == true && Boolean(document.getElementsByClassName('chakra-table css-2xrul2')[0].childNodes[1].childNodes[c]) == true){
            Durability = parseInt(document.getElementsByClassName('chakra-table css-2xrul2')[0].childNodes[1].childNodes[c].childNodes[1].innerHTML);
            //console.log("第"+[c+1]+"耐久有"+Durability);
            if(Durability <= limitDurability ){
              //console.log("第"+[c+1]+"不夠");
              subtitle2.innerHTML = "<span style='color:yellow'>武器耐久低於最低狀態！</span>";
              equipmentOK=0;
              //return;
            }else{
              equipmentOK = 1;
            }
          }else{
            //console.log("少裝備");
            equipmentOK=0;
            subtitle2.innerHTML = "<span style='color:yellow'>少裝備！</span>";
            return equipmentOK;
          }
        }
      }else{
        equipmentOK = 1;
      }
      return equipmentOK;
    }


    function EndRecursive(){
        window.clearTimeout(recursiveTimerId);
        clickCombo = 0;
        continuousInvalidClick = 0;
        Notenough = 0;
        isLastActionClick = false;
        for(var i = 0; i < myFunctionButtons.length; i++)
        {
            myFunctionButtons[i].className = BUTTON_AVAILABLE_CLASSNAME;
            myFunctionButtons[i].disabled = false;
        }

        if(subtitle2){
           subtitle2.innerHTML = "";
        }

        if(subtitle1){
           subtitle1.innerHTML = "";
        }
        //console.log("停止遞迴；清除參數。");
    }

    function uselessfunc(){
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        let statusbar = getRandomInt(13);
        if (statusbar==0){
            subtitle2.innerHTML += "<br><span style='color:yellow'>一直撸管</span>";
        }else if(statusbar==1){
            subtitle2.innerHTML += "<br><span style='color:yellow'>瘋狂尻槍</span>";
        }else if(statusbar==2){
            subtitle2.innerHTML += "<br><span style='color:yellow'>捉i 捉i 捉i</span>";
        }else if(statusbar==3){
            subtitle2.innerHTML += "<br><span style='color:yellow'>偷偷地...生貝比</span>";
        }else if(statusbar==4){
            subtitle2.innerHTML += "<br><span style='color:yellow'>太神啦!</span>";
        }else if(statusbar==5){
            subtitle2.innerHTML += "<br><span style='color:yellow'>你從桃園新竹</span>";
        }else if(statusbar==6){
            subtitle2.innerHTML += "<br><span style='color:yellow'>幹真的是頂級美女欸 啥小啦</span>";
        }else if(statusbar==7){
            subtitle2.innerHTML += "<br><span style='color:yellow'>奶酪!</span>";
        }else if(statusbar==8){
            subtitle2.innerHTML += "<br><span style='color:yellow'>又舔 又舔嘴唇</span>";
        }else if(statusbar==9){
            subtitle2.innerHTML += "<br><span style='color:yellow'>誒老哥 誒謀郎啊捏啦 謀郎啊捏啦</span>";
        }else if(statusbar==10){
            subtitle2.innerHTML += "<br><span style='color:yellow'>我對於質疑我實力的人，我真的很佩服他們的想法，<BR>看那個走位、那個觀念、後面那個抖動、那個位移、那個操作，<BR>說我不會玩，我這場就要給大家看我會不會玩</span>";
        }else if(statusbar==11){
            subtitle2.innerHTML += "<br><span style='color:yellow'>好了啦 特哥椅子哥</span>";
        }else if(statusbar==12){
            subtitle2.innerHTML += "<br><span style='color:yellow'>幹你娘你不要一直玩爐石 好不好啊</span>";
        }
    }

    function ADDCSS(style){
        style.innerText = `
        * {
          box-sizing: border-box;
        }
        
        .wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(15, 19, 26, 0.8);
          height: 100vh;
          position: fixed;
          width: 100%;
          left: 0;
          top: 0;
          overflow: auto;
          z-index: 9999;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          padding: 1rem 1rem 0 1rem;
          position: absolute;
          width: calc(100% - 56px);
          top: 0;
          left: 56px;
          border-bottom: 1px solid #3c3f43;
        }
        
        .header button {
          height: 100%;
        }
        
        .header h1 {
          color: #fff;
        }
        
        .header #close-dialog-btn {
          margin-left: auto;
        }
        
        .content-container {
          padding-top: 50px;
          margin-left: 56px;
          height: 100%;
        }
        
        .content-container .content {
          display: flex;
          margin: 0 1rem 1rem 1rem;
          flex-direction: column;
          height: 100%;
          overflow-y: scroll;
        }
        
        .content-container .content hr {
          width: 100%;
        }
        
        .panel {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          display: none;
          opacity: 0;
        }
        
        .panel input[type=checkbox] {
          margin: 0.5rem;
        }
        
        .panel input[type=text] {
          background-color: #1a1d24;
          background-image: none;
          border: 1px solid #3c3f43;
          border-radius: 6px;
          color: #e9ebf0;
          display: block;
          font-size: 14px;
          line-height: 1.42857143;
          padding: 7px 11px;
          transition: border-color 0.3s ease-in-out;
          width: 100px;
        }
        
        .panel input[type=color] {
          background-color: #292d33;
          width: 50px;
        }
        
        .panel button {
          border-radius: 0.375rem;
          padding: 0.25rem;
        }
        
        .panel button.warning {
          background-color: var(--chakra-colors-red-500);
        }
        
        .panel button.warning:hover {
          background-color: var(--chakra-colors-red-600);
        }
        
        .panel[expand] {
          display: block;
          opacity: 1;
        }
        
        .panel-header {
          width: 100%;
          padding: 20px;
        }
        
        .panel-header span {
          color: #fff;
          font-size: 16px;
          line-height: 1.25;
        }
        
        .panel-body {
          padding: 0 20px 20px 20px;
        }
        
        .panel-body .row {
          margin-top: 1rem;
          display: flex;
          align-items: center;
        }
        
        .panel-body .row label {
          color: #a4a9b3;
          margin-right: 1rem;
        }
        
        .panel-body .row input {
          margin-right: 1rem;
        }
        
        .panel-body .row a {
          color: #a4a9b3;
          margin-right: 1rem;
          text-decoration: underline;
        }
        
        .panel-body .row a:hover {
          background-color: #3c3f43;
        }
        
        .panel-body .row.table {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .record {
            width: 100%;
            border-bottom: 1px solid #3c3f43;
          }
          
          .record .record-header {
            margin-top: 0.25rem;
          }
          
          .record .record-body {
            display: flex;
            flex-direction: column;
          }
          
          .record .record-item {
            display: flex;
            width: 80%;
            margin: 0.5rem 0;
          }
          
          .record .record-quatity {
            margin-left: auto;
          }
          
          .grid {
            margin-top: 10px;
            width: 100%;
            color: #a4a9b3;
            background-color: #1a1d24;
          }
          
          .grid div {
            border-bottom: 1px solid #292d33;
            width: 100%;
            height: 40px;
            padding: 10px;
          }
          
          .grid .grid-row {
            display: flex;
            align-items: center;
          }
          
          .grid .grid-row:hover {
            background-color: #3c3f43;
          }
          
          .grid .grid-row button {
            font-size: 14px;
            border: none;
            background-color: rgba(0, 0, 0, 0);
            color: #9146ff;
            margin-left: auto;
          }
          
          .grid .grid-row button:hover {
            cursor: pointer;
          }
          
          .description {
            margin: 0px;
            color: #a4a9b3;
            line-height: 1.5;
            font-size: 8px;
          }
          
          .dialog {
            width: 800px;
            height: 500px;
            position: relative;
            overflow: auto;
            z-index: 9999;
            display: flex;
            background-color: #292d33;
            border-radius: 6px;
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12), 0 0 10px rgba(0, 0, 0, 0.06);
            display: block;
          }
          
          .dialog .navbar {
            height: 500px;
            background-color: #1a1d24;
            width: 56px;
            position: fixed;
            display: flex;
            flex-direction: column;
          }
          
          .dialog .navbar button {
            height: 50px;
          }
          
          .dialog .navbar button:hover {
            background-color: #292d33;
          }
          
          .dialog .navbar button[active] {
            background-color: #292d33;
          }
          
          .dialog .right-container {
            margin-left: 56px;
          }
          
          #open-dialog-btn {
            position: -webkit-sticky;
            position: sticky;
            left: 0;
            bottom: 20px;
            margin-right: 1rem;
            z-index: 9998;
            color: #7d7d7d;
            background-color: rgba(0, 0, 0, 0);
            border: none;
          }
          
          #open-dialog-btn:hover {
            color: #fff;
          }
          
          #exp-bar {
            position: fixed;
            bottom: 0px;
            width: 100%;
            height: 24px;
          }
          
          #exp-bar-fill {
            position: fixed;
            bottom: 0px;
            left: 0px;
            height: 24px;
          }
          
          .exp-container {
            display: flex;
            justify-content: flex-end;
            position: fixed;
            width: 100%;
            bottom: 0px;
          }
          
          .quick-filter-container {
            display: flex;
            margin-bottom: 0.5rem;
            align-items: center;
            -webkit-box-align: center;
          }
          
          .quick-filter-container div {
            width: 18px;
            height: 18px;
            margin-right: var(--chakra-space-3);
            border-radius: 50%;
            background: var(--chakra-colors-transparent);
            border-width: 2px;
            border-style: solid;
            -o-border-image: initial;
            border-image: initial;
            cursor: pointer;
          }
          
          .quick-filter-container .circle-red {
            border-color: var(--chakra-colors-red-500);
          }
          
          .quick-filter-container .circle-red:hover {
            background-color: var(--chakra-colors-red-300);
          }
          
          .quick-filter-container .circle-blue {
            border-color: var(--chakra-colors-blue-500);
          }
          
          .quick-filter-container .circle-blue:hover {
            background-color: var(--chakra-colors-blue-300);
          }
          
          .quick-filter-container .circle-cyan {
            border-color: var(--chakra-colors-cyan-500);
          }
          
          .quick-filter-container .circle-cyan:hover {
            background-color: var(--chakra-colors-cyan-300);
          }
          
          .quick-filter-container .circle-green {
            border-color: var(--chakra-colors-green-500);
          }
          
          .quick-filter-container .circle-green:hover {
            background-color: var(--chakra-colors-green-300);
          }
          
          .quick-filter-container .circle-teal {
            border-color: var(--chakra-colors-teal-500);
          }
          
          .quick-filter-container .circle-teal:hover {
            background-color: var(--chakra-colors-teal-300);
          }
          
          .quick-filter-container .circle-orange {
            border-color: var(--chakra-colors-orange-500);
          }
          
          .quick-filter-container .circle-orange:hover {
            background-color: var(--chakra-colors-orange-300);
          }
          
          .quick-filter-container .circle-yellow {
            border-color: var(--chakra-colors-yellow-500);
          }
          
          .quick-filter-container .circle-yellow:hover {
            background-color: var(--chakra-colors-yellow-300);
          }
          
          .quick-filter-container .circle-pink {
            border-color: var(--chakra-colors-pink-500);
          }
          
          .quick-filter-container .circle-pink:hover {
            background-color: var(--chakra-colors-pink-300);
          }
          
          .quick-filter-container .circle-purple {
            border-color: var(--chakra-colors-purple-500);
          }
          
          .quick-filter-container .circle-purple:hover {
            background-color: var(--chakra-colors-purple-300);
          }
          
          .quick-filter-container .circle-gray {
            border-color: var(--chakra-colors-gray-500);
          }
          
          .quick-filter-container .circle-gray:hover {
            background-color: var(--chakra-colors-gray-300);
          }
          
          .type-filter-container {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
          }
          
          .type-filter-container .choice {
            display: flex;
            align-items: center;
            margin-right: 0.5rem;
          }
          
          .type-filter-container .choice .circle {
            width: 18px;
            height: 18px;
            margin-right: var(--chakra-space-1);
            border-radius: 50%;
            background: var(--chakra-colors-transparent);
            border-width: 2px;
            border-style: solid;
            -o-border-image: initial;
            border-image: initial;
            border-color: var(--chakra-colors-gray-500);
            cursor: pointer;
            display: block;
          }
          
          .type-filter-container .choice .circle:hover {
            background-color: var(--chakra-colors-gray-300);
          }
          
          .auto-act-btn-active {
            display: inline-flex;
            appearance: none;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: center;
            justify-content: center;
            user-select: none;
            position: relative;
            white-space: nowrap;
            vertical-align: middle;
            outline: transparent solid 2px;
            outline-offset: 2px;
            line-height: 1.2;
            border-radius: var(--chakra-radii-md);
            font-weight: var(--chakra-fontWeights-semibold);
            transition-property: var(--chakra-transition-property-common);
            transition-duration: var(--chakra-transition-duration-normal);
            height: var(--chakra-sizes-10);
            min-width: var(--chakra-sizes-10);
            font-size: var(--chakra-fontSizes-md);
            padding-inline-start: var(--chakra-space-4);
            padding-inline-end: var(--chakra-space-4);
            background: var(--chakra-colors-whiteAlpha-300);
            margin-top: var(--chakra-space-2);
            margin-bottom: var(--chakra-space-2);
            margin-right: var(--chakra-space-0-5);
            margin-left: var(--chakra-space-0-5);
          }
          
          .auto-act-btn-active:hover {
            background: var(--chakra-colors-whiteAlpha-400);
          }
          
          .auto-act-btn-disable {
            opacity: 0.4;
            cursor: not-allowed;
            box-shadow: var(--chakra-shadows-none);
            display: inline-flex;
            appearance: none;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: center;
            justify-content: center;
            user-select: none;
            position: relative;
            white-space: nowrap;
            vertical-align: middle;
            outline: transparent solid 2px;
            outline-offset: 2px;
            line-height: 1.2;
            border-radius: var(--chakra-radii-md);
            font-weight: var(--chakra-fontWeights-semibold);
            transition-property: var(--chakra-transition-property-common);
            transition-duration: var(--chakra-transition-duration-normal);
            height: var(--chakra-sizes-10);
            min-width: var(--chakra-sizes-10);
            font-size: var(--chakra-fontSizes-md);
            padding-inline-start: var(--chakra-space-4);
            padding-inline-end: var(--chakra-space-4);
            background: var(--chakra-colors-whiteAlpha-300);
            margin-top: var(--chakra-space-2);
            margin-bottom: var(--chakra-space-2);
            margin-right: var(--chakra-space-0-5);
            margin-left: var(--chakra-space-0-5);
          }
          
          .auto-act-btn-disable:hover {
            background: var(--chakra-colors-whiteAlpha-300);
          }
          
          .auto-act-btn-settings {
            display: inline-flex;
            appearance: none;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: center;
            justify-content: center;
            user-select: none;
            position: relative;
            white-space: nowrap;
            vertical-align: middle;
            outline: transparent solid 2px;
            outline-offset: 2px;
            line-height: 1.2;
            border-radius: var(--chakra-radii-md);
            font-weight: var(--chakra-fontWeights-semibold);
            transition-property: var(--chakra-transition-property-common);
            transition-duration: var(--chakra-transition-duration-normal);
            height: var(--chakra-sizes-6);
            min-width: var(--chakra-sizes-6);
            font-size: var(--chakra-fontSizes-xs);
            padding-inline-start: var(--chakra-space-2);
            padding-inline-end: var(--chakra-space-2);
            background: var(--chakra-colors-whiteAlpha-300);
            margin-top: var(--chakra-space-2);
            margin-bottom: var(--chakra-space-2);
            margin-right: var(--chakra-space-0-5);
            margin-left: var(--chakra-space-0-5);
          }

          .auto-act-btn-settings:hover {
            background: var(--chakra-colors-whiteAlpha-400);
          }
          
          .input-info {
            margin-bottom: var(--chakra-space-2);
            font-size: var(--chakra-fontSizes-sm);
            color: var(--chakra-colors-gray-300);
          }
          
          .num-input-bar {
            width: 15%;
            min-width: var(--chakra-sizes-20);
            outline: transparent solid 2px;
            outline-offset: 2px;
            position: relative;
            appearance: none;
            transition-property: var(--chakra-transition-property-common);
            transition-duration: var(--chakra-transition-duration-normal);
            font-size: var(--chakra-fontSizes-md);
            padding-inline-start: var(--chakra-space-4);
            padding-inline-end: var(--chakra-space-4);
            height: var(--chakra-sizes-10);
            border-radius: var(--chakra-radii-md);
            border-width: 2px;
            border-style: solid;
            border-image: initial;
            border-color: var(--chakra-colors-transparent);
            background: var(--chakra-colors-whiteAlpha-100);
            margin-right: var(--chakra-space-2-5);
          }
          
          .num-input-bar:focus-visible {
            background: var(--chakra-colors-transparent);
            border-color: rgb(99, 179, 237);
          }
          
        `;
        return;
    }
})();
