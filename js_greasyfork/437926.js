// ==UserScript==
// @name         浮游城多開與徵收
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在同一個帳號底下可以進行別的帳號的行動與徵收帳號資源到本帳
// @author       darwin
// @match        https://ourfloatingcastle.com/profile
// @icon         https://www.google.com/s2/favicons?domain=ourfloatingcastle.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437926/%E6%B5%AE%E6%B8%B8%E5%9F%8E%E5%A4%9A%E9%96%8B%E8%88%87%E5%BE%B5%E6%94%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/437926/%E6%B5%AE%E6%B8%B8%E5%9F%8E%E5%A4%9A%E9%96%8B%E8%88%87%E5%BE%B5%E6%94%B6.meta.js
// ==/UserScript==

/*
有用到的API
GET
https://api.ourfloatingcastle.com/api/profile：token
https://api.ourfloatingcastle.com/api/items：token
https://api.ourfloatingcastle.com/api/trades?category=${type}：type有equipments、mine、items

POST
https://api.ourfloatingcastle.com/api/forge/complete：token
https://api.ourfloatingcastle.com/api/actions/complete：token
https://api.ourfloatingcastle.com/api/actions/rest：token,durationId
https://api.ourfloatingcastle.com/api/actions/adventure：token,durationId
https://api.ourfloatingcastle.com/api/actions/mining：token,targetId,durationId
https://api.ourfloatingcastle.com/api/actions/retreat：token
https://api.ourfloatingcastle.com/api/items/sell：token,id,price,quantity
https://api.ourfloatingcastle.com/api/trades/buy：token,id
https://api.ourfloatingcastle.com/api/actions/hunt：token,targetId
https://api.ourfloatingcastle.com/api/actions/hunt/complete：token
https://api.ourfloatingcastle.com/api/actions/hunt/retreat：token
https://api.ourfloatingcastle.com/api/items/use：token,id,quantity
https://api.ourfloatingcastle.com/api/actions/attack/complete：token
https://api.ourfloatingcastle.com/api/actions/attack/retreat：token
*/

//css
var css_tab,css_tabPanel,css_basicDiv,css_button,css_heading
function loadCss(){
    css_tab = document.querySelector(".chakra-tabs__tab").classList[1]
    css_tabPanel = document.querySelector(".chakra-tabs__tab-panel").classList[1]
    css_basicDiv = `margin-bottom: var(--chakra-space-3);`
    css_button = document.querySelector(".chakra-container").lastChild.querySelector(".chakra-button").classList[1]
    css_heading = document.querySelector(".chakra-heading").classList[1]
}

//basic function
let fetchDelay =150;
let fetchRetryTimes = 5;

function retryPromise(fn, times, delay) {
    return new Promise(function(resolve, reject){
        var error;
        var attempt = function() {
            if (times == 0) {
                reject(error);
            } else {
                fn().then(resolve)
                    .catch(function(e){
                        times--;
                        error = e;
                        setTimeout(function(){attempt()}, delay);
                    });
            }
        };
        attempt();
    });
};

function delay(num) {
    return new Promise(resolve => setTimeout(resolve, num));
}

function isHTMLElement(obj){
    var d = document.createElement("div");
    try{
        d.appendChild(obj.cloneNode(true));
        return obj.nodeType==1?true:false;
    }catch(e){
        return false;
    }
}

function clearPreviousContent(target){
    while (target.firstChild) {
        target.removeChild(target.firstChild);
    }
}


function fetchAPI(APItarget,token,body){
    if(APItarget === "profile" || APItarget === "items" || APItarget.includes(`trades?category=`)){
        return fetch(`https://api.ourfloatingcastle.com/api/${APItarget}`,{
            method: 'GET',
            headers: {
                'token': token
            }
        })
    }else{
        return fetch(`https://api.ourfloatingcastle.com/api/${APItarget}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body:JSON.stringify(body)
        })
    }
}

function sendfetch(APItarget,token,body){
    return new Promise(function(resolve,reject){
        retryPromise(fetchAPI.bind(this,APItarget,token,body),fetchRetryTimes,fetchDelay)
        .then(async response =>{
            await delay(fetchDelay);
            if(!response.ok) {
                console.log(`HTTP error! status: ${response.status} - ${APItarget}`);
                response.json().then(json=>{
                    console.log(json.message);
                    resolve(json.message);
                });
              }else{
                response.json().then(json=>{
                    resolve(json);
                });
            }
        })
        .catch((error)=>{
            console.log(`fetch ${APItarget} error：\n${error}`);
            reject("");
        })
    })
}

function getTrade(token,type){
    //type有equipments、mine、items
    return new Promise(resolve => {fetch(`https://api.ourfloatingcastle.com/api/trades?category=${type}`,{
            method: 'GET',
            headers: {
                'token': token
            }
        }).then(async response =>{
            await delay(fetchDelay);
            if(!response.ok) {
                console.log(`HTTP error! status: ${response.status} - trade ${type}`);
                response.json().then(json=>{
                    console.log(json.message);
                    resolve("");
                });
            }else{
                response.json().then(json=>{
                    resolve(json);
                });
            }
        })
    })
}

/*
localStorage資料格式：
OtherAccount:{
    accountName:{
        lastAction:"行動類型",
        token:token,
        lastShoplist:{
            "商品名稱":商品剩餘數量
        }
    }
}
*/
function getAccountStorage(){
    let accountStorage = localStorage.getItem("OtherAccount");
    if(!accountStorage){
        accountStorage = {};
    }else{
        accountStorage = JSON.parse(accountStorage);
    }
    return accountStorage;
}

function disable(target,time){
    target.disabled = true;
    setTimeout(()=>{target.disabled = false},time)
}

//main page function
async function loadbtn(){
    try {
        await loadCss();

        const targetTabPlace = document.querySelector(".chakra-tabs__tablist");
        //add tab
        let a = createTab(targetTabPlace,"管理帳號","accountManagementTab","accountManagementTabPanel");
        let b = createTab(targetTabPlace,"徵收物資","itemCollectTab","itemCollectTabPanel");
        let c = createTab(targetTabPlace,"傳送物資","itemSendTab","itemSendTabPanel");
        await Promise.all([a,b,c]);
        
        //add tabpanel
        const targetTabPanelPlace = document.querySelector(".chakra-tabs__tab-panels");
        let d = createTabPanel(targetTabPanelPlace,"accountManagementTabPanel");
        let e = createTabPanel(targetTabPanelPlace,"itemCollectTabPanel");
        let f = createTabPanel(targetTabPanelPlace,"itemSendTabPanel");
        await Promise.all([d,e,f]);

        //add tabpanel content
        await addTabEventListner();
    } catch (error) {
        console.log("page still loading:"+error);
        await delay(5000);
        loadbtn();
    }
}

function createTab(Parent,text,tabId,tabpanelId){
    if(document.querySelector(`#${tabId}`)===null){
        let node = document.createElement("button");
        node.textContent = text;
        node.setAttribute("id", tabId);
        node.setAttribute("role", "tab");
        node.setAttribute("tabindex", -1);
        node.setAttribute("aria-selected", false);
        node.setAttribute("aria-controls", tabpanelId);
        node.classList.add(css_tab);
        Parent.lastChild.insertAdjacentElement('afterend',node);
        console.log(`append ${text} tab`);
    }
}

function createTabPanel(Parent,tabpanelId){
    if(document.querySelector(`#${tabpanelId}`) === null){
        let node = document.createElement("div");
        node.setAttribute("tabindex", 0);
        node.setAttribute("role", "tabpanel");
        node.setAttribute("id", tabpanelId);
        node.classList.add(css_tabPanel);
        Parent.lastChild.insertAdjacentElement('afterend',node);
        console.log(`append ${tabpanelId} tabpanel`);
    }
}

function addTabEventListner(){
    const tabs = document.querySelectorAll('[role="tab"]');

    tabs.forEach(tab => {
        tab.addEventListener("click", changeTabs);
    });
}

function changeTabs(e){
    const target = e.target;
    const parent = target.parentNode;
    const grandparent = parent.parentNode;
    const targetPanel = grandparent.parentNode.querySelector(`#${target.getAttribute("aria-controls")}`)

    //Create Tab content
    if(target.getAttribute("aria-controls")==="accountManagementTabPanel"){
        createAccountManagementTabPanel(targetPanel);
    }else if(target.getAttribute("aria-controls")==="itemCollectTabPanel"){
        createItemCollectTabPanel(targetPanel);
    }else if(target.getAttribute("aria-controls")==="itemSendTabPanel"){
        createItemSendTabPanel(targetPanel);
    }

    // Remove all current selected tabs
    parent
    .querySelectorAll('[aria-selected="true"]')
    .forEach(t => {
        t.setAttribute("aria-selected", false);
        t.setAttribute("tabindex", -1);
    });

    // Set this tab as selected
    target.setAttribute("aria-selected", true);
    target.setAttribute("tabindex", 0);

    // Hide all tab panels
    grandparent
    .querySelectorAll('[role="tabpanel"]')
    .forEach(p => p.setAttribute("hidden", true));

    // Show the selected panel
    targetPanel.removeAttribute("hidden");
}

//create account management tabpanel
function createAccountManagementTabPanel(panel){

    //若按鈕不存在才新添加
    if(panel.querySelector("#appendAccountBtn")===null){
        let node = document.createElement("div");
        let btn = document.createElement("button");
    
        node.setAttribute("style",css_basicDiv)
        btn.classList.add(css_button);
        btn.setAttribute("style", "background:rgb(226 135 0);cursor:pointer;");
        btn.setAttribute("id", "appendAccountBtn");
        btn.textContent = "新增帳號";
        btn.addEventListener('click',addAccount)
        node.appendChild(btn);
        panel.appendChild(node);
    }

    let accountStorage = getAccountStorage();
    if(Object.keys(accountStorage).length === 0){
        noAccountAvailable(panel);
    }else{
        let nameList = Object.keys(accountStorage);
        for(let i=0;i<nameList.length;i++){
            appendAccount(panel,nameList[i]);
        }
    }

    //在所有帳號都讀取完後，新增重新讀取的按鈕
    if(panel.querySelector("#renewAccountBtn")===null){
        let btn = document.createElement("button");
    
        btn.classList.add(css_button);
        btn.setAttribute("style", "background:rgb(226 135 0);cursor:pointer;");
        btn.setAttribute("id", "renewAccountBtn");
        btn.textContent = "重新讀取";
        btn.addEventListener('click',(e)=>{
            clearPreviousContent(panel);
            createAccountManagementTabPanel(panel);
        })
        panel.firstChild.firstChild.insertAdjacentElement('afterend',btn);
    };
}

function addAccount(e){
    const target = e.target;
    const parent = target.parentNode;
    const grandparent = parent.parentNode;

    let accountStorage = getAccountStorage();
    let nameList = Object.keys(accountStorage)
    let newToken = prompt("請輸入token");
    if(newToken){
        sendfetch(`profile`,newToken,"").then(function(profileText){
            let name = profileText.nickname;
            if(profileText==="invalid token" || nameList.includes(name)){
                console.log("token may be invalid or repeated")
            }else{
                accountStorage[name]={"token":newToken};
                localStorage.setItem('OtherAccount', JSON.stringify(accountStorage));
                appendAccount(grandparent,name);
            }
        });
    }
}

function appendAccount(target,name){
    //帳號未重複才新增內容
    if(!target.textContent.includes(name)){
        let newDiv;

        if(target.lastChild.textContent==="尚未有其他帳號"){
            newDiv = target.lastChild;
            clearPreviousContent(newDiv);
        }else{
            newDiv = document.createElement("div");
            newDiv.classList.add("css-1xhq01z");
        }
        newDiv.setAttribute("style","align-items: center;justify-content: space-between;")
        createAccountContent(newDiv,name);
    
        target.appendChild(newDiv);
    }
}

//在已經製作好的div空間底下添加帳號資訊
async function createAccountContent(div,name){
    clearPreviousContent(div);

    let accountStorage = getAccountStorage();
    let token = accountStorage[name].token;
    let profile,status,actionUntil,role,hp,fullHp,fightExp,forgeExp,mineExp;

    //建立資料Div按鈕Div與兩個h2
    let statusDiv = document.createElement("div");
    statusDiv.setAttribute("style","display: flex;flex-direction: column;");
    let buttonDiv = document.createElement("div");
    let profileH2 = document.createElement("h2");
    profileH2.setAttribute("style", "font-size: 1.1rem;font-weight: 700;margin-right: 0.5rem;");
    let statusH2 = document.createElement("h2");
    statusH2.setAttribute("style", "font-size: 1rem;font-weight: 500;margin-right: 0.5rem;");

    let accoutStatus = true;
    //得到目前帳號狀態
    await sendfetch(`profile`,token,"").then(function(profileText){
        if(profileText === "invalid token"){
            delete accountStorage[name];
            localStorage.setItem('OtherAccount', JSON.stringify(accountStorage));
            console.log(`${name}'s token has expired so delete`);
            accoutStatus = false;
            return false;
        }else{
            profile = profileText;
            status = profileText.actionStatus;
            role = profileText.role;
            actionUntil = profileText.actionUntil;
            hp = profileText.hp;
            fullHp = profileText.fullHp;
            fightExp = profileText.fightExp;
            forgeExp = profileText.forgeExp
            mineExp = profileText.mineExp
    
            if(actionUntil>Date.now()){
                //若行動完成時將自動重整此帳號分頁，並將timeout資訊存儲到帳號分頁的div中
                clearTimeout(div.timeout);
                div.timeout = setTimeout(()=>{createAccountContent(div,name)},actionUntil-Date.now())
    
                //換算時間為字串
                let temp = new Date(actionUntil);
                actionUntil = `至${temp.getMonth()+1}/${temp.getDate()} ${String(temp.getHours()).padStart(2,0)}:${String(temp.getMinutes()).padStart(2,0)}:${String(temp.getSeconds()).padStart(2,0)}`
            }else{
                actionUntil = "已完成";
            }
            profileH2.textContent = `${name}：${role}${profileText.role2!==undefined?`(${profileText.role2})`:""} - 狀態：${status} ${actionUntil}`;
            statusH2.textContent = `體力：${hp}/${fullHp}, 戰鬥：${fightExp}, 鍛造：${forgeExp} 挖礦：${mineExp}`;
    
            statusDiv.appendChild(profileH2);
            statusDiv.appendChild(statusH2);
            div.appendChild(statusDiv);
        }
    });

    if(!accoutStatus){
        return;
    }

    //根據帳號狀態添加按鈕
    let actionBtn = document.createElement("button");
    actionBtn.classList.add(css_button);
    if(status === "閒置"){
        let lastAction = accountStorage[name].lastAction;
        if(!lastAction){
            lastAction === "閒置";
        }

        let actionSelect = document.createElement("select");
        let actionSelectList = {
            "閒置":["閒置"],
            "外部":["外部20分","外部50分","外部2小","外部4小"],
            "深處":["深處1小","深處2小","深處5小","深處7小"],
            "雪山":["雪山3小","雪山5小","雪山7小","雪山8小"],
            "阿嬤":["阿嬤4小","阿嬤5小","阿嬤6小","阿嬤7小"],
            "魔山":["魔山5小","魔山6小","魔山8小","魔山9小"],
            "骨山":["骨山5小","骨山6小","骨山8小","骨山9小"],
            "狩獵":["大草原","蝙蝠洞","迷宮區"],
            "冒險":["冒險10分","冒險30分","冒險2小","冒險5小"],
            "休息":["休息10分","休息30分","休息1小","休息3小"],
            }
        let optionsList = Object.keys(actionSelectList);
        let selectCount = 0;
        let mineCount = 0;
        for(let i=0;i<optionsList.length;i++){
            for(let k=0;k<actionSelectList[optionsList[i]].length;k++){
                let lastActionBool = actionSelectList[optionsList[i]][k] === lastAction;
                if(optionsList[i]==="休息"||optionsList[i]==="冒險"||optionsList[i]==="狩獵"){
                    actionSelect[selectCount] = new Option(actionSelectList[optionsList[i]][k],`{"type":"${optionsList[i]}","text":"${actionSelectList[optionsList[i]][k]}","durationId":${k}}`,lastActionBool,lastActionBool);
                }else if(optionsList[i]==="閒置"){
                    actionSelect[selectCount] = new Option(actionSelectList[optionsList[i]][k],`{"type":"${optionsList[i]}","text":"${actionSelectList[optionsList[i]][k]}"}`,lastActionBool,lastActionBool);
                }else{
                    actionSelect[selectCount] = new Option(actionSelectList[optionsList[i]][k],`{"type":"${optionsList[i]}","text":"${actionSelectList[optionsList[i]][k]}","targetId":${Math.floor(mineCount/4)},"durationId":${k}}`,lastActionBool,lastActionBool);
                    mineCount += 1;
                }
                selectCount += 1;
            }
        }
        actionSelect.addEventListener("change",()=>{changeActionBtn(buttonDiv,actionBtn,actionSelect,name,token)})
        changeActionBtn(buttonDiv,actionBtn,actionSelect,name,token);
    }else if(status === "死亡"){
        actionBtn.setAttribute("style", "background:rgb(192, 86, 33);cursor:pointer;");
        actionBtn.textContent = "重生";
        actionBtn.addEventListener("click",(e)=>{
            disable(e.target,5000);
            sendfetch(`actions/rest`,token,{durationId:99}).then(()=>{
                createAccountContent(div,name); //重整帳號分頁資訊
            })
        })
        buttonDiv.appendChild(actionBtn);
    }else if(actionUntil === "已完成" && status === "狩獵中"){
        actionBtn.setAttribute("style", "background:var(--chakra-colors-gray-100);cursor:pointer;color: inherit;");
        actionBtn.textContent = "戰鬥";
        actionBtn.addEventListener('click',(e)=>{
            disable(e.target,10000);
            sendfetch(`actions/hunt/complete`,token,"").then(function(completeMessage){
                let huntMessage = [];
                let equipment = "";
                if(completeMessage.stats.a.equipments.length>0){
                    for(let j=0;j<completeMessage.stats.a.equipments.length;j++){
                        equipment += `${completeMessage.stats.a.equipments[j].quality}${completeMessage.stats.a.equipments[j].name}（${completeMessage.stats.a.equipments[j].type}）攻擊${completeMessage.stats.a.equipments[j].atk}、防禦${completeMessage.stats.a.equipments[j].def}`;
                        equipment = equipment+"\n";
                    }
                }
                let cutPoint = false;
                for(let i=0;i<completeMessage.messages.length;i++){
                    if(completeMessage.messages[i].m.indexOf("點體力")>-1){
                        cutPoint = true;
                        huntMessage.push(completeMessage.messages[i].m);
                    }else if(cutPoint){
                        huntMessage.push(completeMessage.messages[i].m);
                    }
                }
                huntMessage.unshift(`玩家：${completeMessage.stats.a.name}, HP：${completeMessage.stats.a.hp}, 熟練：${completeMessage.stats.a.fightExp}\n裝備：\n${equipment}\n守方：${completeMessage.stats.b.name}, HP：${completeMessage.stats.b.hp}, 熟練：${completeMessage.stats.b.fightExp}, 攻擊：${completeMessage.stats.b.atk}, 防禦：${completeMessage.stats.b.def}\n`)
                huntMessage = huntMessage.join("\n");
                createAccountContent(div,name); //重整帳號分頁資訊
                alert(huntMessage);
            })
        })
        buttonDiv.appendChild(actionBtn);

        let huntRetreatBtn = document.createElement("button");
        huntRetreatBtn.classList.add(css_button);
        huntRetreatBtn.setAttribute("style", "background:var(--chakra-colors-gray-100);cursor:pointer;color: inherit;");
        huntRetreatBtn.textContent = "撤退";
        huntRetreatBtn.addEventListener('click',(e)=>{
            if (window.confirm(`確認撤退?`)){
                disable(e.target,5000);
                sendfetch(`actions/hunt/retreat`,token,"").then(function(completeMessage){
                createAccountContent(div,name); //重整帳號分頁資訊
                })
            }
        })
        buttonDiv.appendChild(huntRetreatBtn);
    }else if(actionUntil === "已完成" && status === "攻城中"){
        actionBtn.setAttribute("style", "background:var(--chakra-colors-gray-100);cursor:pointer;color: inherit;");
        actionBtn.textContent = "戰鬥";
        actionBtn.addEventListener('click',(e)=>{
            disable(e.target,10000);
            sendfetch(`actions/attack/complete`,token,"").then(function(completeMessage){
                let attackMessage = [];
                let equipmentA = "",equipmentB = "";
                if(completeMessage.stats.a.equipments.length>0){
                    for(let j=0;j<completeMessage.stats.a.equipments.length;j++){
                        equipmentA += `${completeMessage.stats.a.equipments[j].quality}${completeMessage.stats.a.equipments[j].name}（${completeMessage.stats.a.equipments[j].type}）攻擊${completeMessage.stats.a.equipments[j].atk}、防禦${completeMessage.stats.a.equipments[j].def}`;
                        equipmentA = equipmentA+"\n";
                    }
                }
                if(completeMessage.stats.b.equipments.length>0){
                    for(let j=0;j<completeMessage.stats.b.equipments.length;j++){
                        equipmentB += `${completeMessage.stats.b.equipments[j].quality}${completeMessage.stats.b.equipments[j].name}（${completeMessage.stats.b.equipments[j].type}）攻擊${completeMessage.stats.b.equipments[j].atk}、防禦${completeMessage.stats.b.equipments[j].def}`;
                        equipmentB = equipmentB+"\n";
                    }
                }
                let cutPoint = false;
                for(let i=0;i<completeMessage.messages.length;i++){
                    if(completeMessage.messages[i].m.indexOf("點體力")>-1){
                        cutPoint = true;
                        attackMessage.push(completeMessage.messages[i].m);
                    }else if(cutPoint){
                        attackMessage.push(completeMessage.messages[i].m);
                    }
                }
                attackMessage.unshift(`玩家：${completeMessage.stats.a.name}, HP：${completeMessage.stats.a.hp}, 熟練：${completeMessage.stats.a.fightExp}\n裝備：\n${equipmentA}\n守方：${completeMessage.stats.b.name}, HP：${completeMessage.stats.b.hp}, 熟練：${completeMessage.stats.b.fightExp}\n裝備：\n${equipmentB}\n`)
                attackMessage = attackMessage.join("\n")
                createAccountContent(div,name); //重整帳號分頁資訊
                alert(attackMessage);
            })
        })
        buttonDiv.appendChild(actionBtn);

        let attackRetreatBtn = document.createElement("button");
        attackRetreatBtn.classList.add(css_button);
        attackRetreatBtn.setAttribute("style", "background:var(--chakra-colors-gray-100);cursor:pointer;color: inherit;");
        attackRetreatBtn.textContent = "撤退";
        attackRetreatBtn.addEventListener('click',(e)=>{
            if (window.confirm(`確認撤退?`)){
                disable(e.target,5000);
                sendfetch(`actions/attack/retreat`,token,"").then(function(completeMessage){
                createAccountContent(div,name); //重整帳號分頁資訊
                })
            }
        })
        buttonDiv.appendChild(attackRetreatBtn);
    }else if(actionUntil === "已完成" && status === "守城中"){
        actionBtn.setAttribute("style", "background:var(--chakra-colors-gray-100);cursor:pointer;color: inherit;");
        actionBtn.textContent = "退防";
        actionBtn.addEventListener('click',(e)=>{
            disable(e.target,5000);
            sendfetch(`actions/retreat`,token,"").then(function(completeMessage){
                createAccountContent(div,name); //重整帳號分頁資訊
            })
        })
        buttonDiv.appendChild(actionBtn);
    }else if(actionUntil === "已完成" && status === "鍛造中"){
        actionBtn.setAttribute("style", "background:rgb(56, 161, 105);cursor:pointer;");
        actionBtn.textContent = "完成鍛造";
        actionBtn.addEventListener('click',(e)=>{
            disable(e.target,5000);
            sendfetch(`forge/complete`,token,"").then(function(completeMessage){
                createAccountContent(div,name); //重整帳號分頁資訊
            })
        })
        buttonDiv.appendChild(actionBtn);
    }else if(actionUntil === "已完成"){
        actionBtn.setAttribute("style", "background:rgb(56, 161, 105);cursor:pointer;");
        actionBtn.textContent = "完成行動";
        actionBtn.addEventListener('click',(e)=>{
            disable(e.target,5000);
            sendfetch(`actions/complete`,token,"").then(function(completeMessage){
                createAccountContent(div,name); //重整帳號分頁資訊
                let text = completeMessage.message;
                if(text){
                    text.unshift(`${name} 完成行動`);
                    text = text.join("\n");
                    alert(text);
                }
            })
        })
        buttonDiv.appendChild(actionBtn);
    }
    //如果沒滿血且血量不為0時，添加回血的按鈕
    if(hp < fullHp && hp !== 0){
        let recoverBtn = document.createElement("button");
        recoverBtn.classList.add(css_button);
        recoverBtn.setAttribute("style", "background:#cc9bfe;color: rgb(255, 255, 255);cursor:pointer;");
        recoverBtn.textContent = "回血";
        recoverBtn.addEventListener("click",(e)=>{
            disable(e.target,5000);
            sendfetch(`items`,token,"").then(async function(itemMessage){
                let restHp = fullHp-hp,recoverHp=0;
                let items = itemMessage.items;
                let itemDic = {};//{15:{id:8763,available:15,name:香蕉}}
                let loopStatus = true;
                for(let i=0;i<items.length;i++){
                    if(items[i].description.indexOf("吃了能夠恢復")>-1){
                        itemDic[items[i].description.slice(items[i].description.indexOf("恢復 ")+3,items[i].description.indexOf(" 點體力"))]=items[i];
                    }
                }
                let recoverUnit = Object.keys(itemDic);
                recoverUnit.sort(function(a, b) {
                    return a - b;
                    });
                let useDic = {}; //{"香蕉":{id:8763,quantity:1,available:15,recoverUnit:15}}}
                for(let k=0;k<recoverUnit.length;k++){
                    useDic[itemDic[recoverUnit[k]].name] = {"id":itemDic[recoverUnit[k]].id,"quantity":0,"available":itemDic[recoverUnit[k]].available,"recoverUnit":Number(recoverUnit[k])}
                }

                //從小找到大，找能吃的，優先使用小的
                while(loopStatus && restHp>recoverHp && recoverUnit.length>0){
                    for(let i=0;i<recoverUnit.length&&restHp>recoverHp;i++){
                        if(Number(recoverUnit[i])>restHp-recoverHp && useDic[itemDic[recoverUnit[i]].name].quantity<useDic[itemDic[recoverUnit[i]].name].available){
                            if(i===0){
                                useDic[itemDic[recoverUnit[i]].name].quantity += 1;
                                recoverHp += Number(recoverUnit[i]);
                                loopStatus = false;
                                break;
                            }else{
                                //有能超過的情況下，往回找小一點能符合的
                                for(let j=i-1;j>=-1;j--){
                                    if(j===-1){
                                        useDic[itemDic[recoverUnit[i]].name].quantity += 1;
                                        recoverHp += Number(recoverUnit[i]);
                                        loopStatus = false;
                                        break;
                                    }else if(useDic[itemDic[recoverUnit[j]].name].quantity<useDic[itemDic[recoverUnit[j]].name].available){
                                        useDic[itemDic[recoverUnit[j]].name].quantity += 1;
                                        recoverHp += Number(recoverUnit[j]);
                                        break;
                                    }
                                }
                                break;
                            }
                        }else if(i===recoverUnit.length-1){
                            for(let j=i;j>=-1;j--){
                                if(j===-1){
                                    //連最小的都沒了
                                    loopStatus = false;
                                    break;
                                }else if(useDic[itemDic[recoverUnit[j]].name].quantity<useDic[itemDic[recoverUnit[j]].name].available){
                                    //都沒超過的情況下，從最大的開始吃
                                    useDic[itemDic[recoverUnit[j]].name].quantity += 1;
                                    recoverHp += Number(recoverUnit[j]);
                                    break;
                                }
                            }
                        }
                    }
                }
                //最終將多吃的去掉(recoverHp-restHp)
                let useDicItems = Object.keys(useDic);
                for(let m=useDicItems.length-1;m>-1;m--){
                    if(useDic[useDicItems[m]].recoverUnit<=recoverHp-restHp&&useDic[useDicItems[m]].quantity>0){
                        recoverHp = recoverHp - useDic[useDicItems[m]].recoverUnit;
                        useDic[useDicItems[m]].quantity -= 1;
                        m +=1;
                    }
                }
                console.log(useDic);
                //發送封包
                let useitemMessage = "使用了\n";
                for(let n = 0;n<useDicItems.length;n++){
                    if(useDic[useDicItems[n]].quantity>0){
                        await sendfetch(`items/use`,token,{id:useDic[useDicItems[n]].id,quantity:useDic[useDicItems[n]].quantity}).then(()=>{
                            useitemMessage += `${useDicItems[n]}x${useDic[useDicItems[n]].quantity}個\n`;
                        })
                    }
                }
                createAccountContent(div,name); //重整帳號分頁資訊
                if(useitemMessage!=="使用了\n"){
                    useitemMessage += `\n共恢復了${recoverHp}點體力(${hp}→${hp+recoverHp>=fullHp?fullHp:hp+recoverHp})`
                    alert(useitemMessage);
                }else{
                    alert("飢荒無法補血，請補充食物");
                }
            })})
        buttonDiv.appendChild(recoverBtn);
    }

    //添加刪除帳號的按鈕
    let deleteAccountBtn = document.createElement("button");
    deleteAccountBtn.classList.add(css_button);
    deleteAccountBtn.setAttribute("style", "background:rgb(255, 0, 0);color: rgb(255, 255, 255);cursor:pointer;");
    deleteAccountBtn.textContent = "刪帳";
    deleteAccountBtn.addEventListener("click",(e)=>{
        if (window.confirm(`確認刪除${name}?`)){
            disable(e.target,1000);
            delete accountStorage[name];
            localStorage.setItem('OtherAccount', JSON.stringify(accountStorage));
            div.remove();
        }
    })
    buttonDiv.appendChild(deleteAccountBtn);
    div.appendChild(buttonDiv);
}

//根據表單選擇來改變並添加行動按鈕。並儲存最新選擇
function changeActionBtn(div,btn,select,name,token){
    let value = JSON.parse(select.value);
    if(value.type === "休息"){
        btn.setAttribute("style", "background:rgb(213, 63, 140);cursor:pointer;");
        btn.removeEventListener("click",btn.previousEvent,false);
        btn.addEventListener("click",btn.previousEvent = function(e){
            disable(e.target,5000);
            sendfetch(`actions/rest`,token,{durationId:value.durationId}).then(()=>{
                createAccountContent(div.parentNode,name); //重整帳號分頁資訊
            })
        },false)
    }else if(value.type === "冒險"){
        btn.setAttribute("style", "background:rgb(49, 130, 206);cursor:pointer;");
        btn.removeEventListener("click",btn.previousEvent,false);
        btn.addEventListener("click",btn.previousEvent = function(e){
            disable(e.target,5000);
            sendfetch(`actions/adventure`,token,{durationId:value.durationId}).then(()=>{
                createAccountContent(div.parentNode,name); //重整帳號分頁資訊
            })
        },false)
    }else if(value.type === "狩獵"){
        btn.setAttribute("style", "background:var(--chakra-colors-purple-500);cursor:pointer;");
        btn.removeEventListener("click",btn.previousEvent,false);
        btn.addEventListener("click",btn.previousEvent = function(e){
            disable(e.target,5000);
            sendfetch(`actions/hunt`,token,{targetId:value.durationId}).then(()=>{
                createAccountContent(div.parentNode,name); //重整帳號分頁資訊
            })
        },false)
    }else if(value.type === "閒置"){
        btn.setAttribute("style", "display: none;");
    }else{
        btn.setAttribute("style", "background:rgb(59, 80, 103);cursor:pointer;");
        btn.removeEventListener("click",btn.previousEvent,false);
        btn.addEventListener("click",btn.previousEvent = function(e){
            disable(e.target,5000);
            sendfetch(`actions/mining`,token,{targetId:value.targetId,durationId:value.durationId}).then(()=>{
                createAccountContent(div.parentNode,name); //重整帳號分頁資訊
            })
        },false)
    }
    btn.textContent = value.text;

    //儲存除了休息外的最新動作
    if(value.type !== "休息"){
        let accountStorage = getAccountStorage();
        accountStorage[name].lastAction = value.text;
        localStorage.setItem('OtherAccount', JSON.stringify(accountStorage))
    }

    div.insertBefore(btn,div.firstChild);
    div.insertBefore(select,div.firstChild);
}

function noAccountAvailable(target){
    if(target.querySelector("#noAccountAvailableDiv")){
        target.querySelector("#noAccountAvailableDiv").remove();
    }

    let node = document.createElement("div");
    node.setAttribute("id","noAccountAvailableDiv");
    let h2 = document.createElement("h2");

    node.classList.add("css-1xhq01z");
    h2.classList.add(css_heading);
    h2.setAttribute("style", "font-size: 1.25rem;margin-bottom: 0.25rem;");
    h2.textContent = "尚未有其他帳號";
    node.appendChild(h2);
    target.appendChild(node);
}

//create item collect tabpanel
function createItemCollectTabPanel(panel){
    let accountStorage = getAccountStorage();
    if(Object.keys(accountStorage).length === 0){
        clearPreviousContent(panel);
        noAccountAvailable(panel);
    }else{
        if(panel.querySelector("#noAccountAvailableDiv")){
            panel.querySelector("#noAccountAvailableDiv").remove();
        }

        //若select不存在才新添加select與fetch按鈕與後續的div
        if(panel.querySelector("#accountSelect")===null){
            let mainDiv = document.createElement("div");
            let selectDiv = document.createElement("div");
            let btnDiv = document.createElement("div");
            let loadItemBtn = document.createElement("button");
            let sendShoplistBtn = document.createElement("button");
            let accountSelectDiv = document.createElement("div");
            let accountSelect = document.createElement("select");
            let exchangeItemSelectDiv = document.createElement("div");
            let exchangeItemSelect = document.createElement("select");
            let subDiv = document.createElement("div");
            let itemListDiv = document.createElement("div");
            let shopListDiv = document.createElement("div");
            mainDiv.setAttribute("style",css_basicDiv)
            mainDiv.setAttribute("style","display: flex;")

            //製作一個selectDiv與放置於其中的兩個select
            selectDiv.setAttribute("style","display: flex;flex-direction: column;justify-content: space-evenly;");
            accountSelect.setAttribute("id", "accountSelect");
            //accountSelectDiv+accountSelectSpan
            accountSelectDiv.setAttribute("style","margin-bottom: 0.5rem;display: flex;")
            let accountSelectSpan = document.createElement("p");
            accountSelectSpan.setAttribute("style", "font-size: 1rem;font-weight: 600;");
            accountSelectSpan.textContent = "目標帳號：";
            //accountSelect
            let optionsList = [];
            for(let p=0;p<Object.keys(accountStorage).length;p++){
                if(accountStorage[Object.keys(accountStorage)[p]].token!==localStorage.getItem('token2')){
                    optionsList.push(Object.keys(accountStorage)[p]);
                }
            }

            let accountSelectContent,token,name;
            for(let i=0;i<optionsList.length;i++){
                accountSelect[i] = new Option(optionsList[i],`{"name":"${optionsList[i]}"}`);
            }
            accountSelect.addEventListener("change",()=>{
                accountSelectContent = JSON.parse(accountSelect.value);
                name = accountSelectContent.name;
                updateDivTable(itemListDiv,name);
                updateDivTable(shopListDiv,name);
            })
            accountSelectDiv.appendChild(accountSelectSpan);
            accountSelectDiv.appendChild(accountSelect);
            selectDiv.appendChild(accountSelectDiv);

            //exchangeItemSelectDiv+exchangeItemSelectSpan
            exchangeItemSelectDiv.setAttribute("style","margin-bottom: 0.5rem;display: flex;")
            let exchangeItemSelectSpan = document.createElement("p");
            exchangeItemSelectSpan.setAttribute("style", "font-size: 1rem;font-weight: 600;");
            exchangeItemSelectSpan.textContent = "交換單位：";
            //exchangeItemSelect
            exchangeItemSelect[0] = new Option("交易時的貨幣交換單位","");
            exchangeItemSelect.addEventListener("change",()=>{
                let exchangeItemSelectContent = JSON.parse(exchangeItemSelect.value);
                if(exchangeItemSelectContent.itemName){
                    let accountStorage = getAccountStorage();
                    name = accountSelectContent.name;
                    accountStorage[name].lastExchangeItem = exchangeItemSelectContent.itemName;
                    localStorage.setItem('OtherAccount', JSON.stringify(accountStorage))
                }
            })
            exchangeItemSelectDiv.appendChild(exchangeItemSelectSpan);
            exchangeItemSelectDiv.appendChild(exchangeItemSelect);
            selectDiv.appendChild(exchangeItemSelectDiv);
            
            //製作一個Div來放Btn
            btnDiv.setAttribute("style","display: flex;flex-direction: column;");

            //loadItemBtn
            loadItemBtn.classList.add(css_button);
            loadItemBtn.setAttribute("style", "background:rgb(226 135 0);cursor:pointer;margin-bottom: 0.75rem;");
            loadItemBtn.setAttribute("id", "loadItemBtn");
            loadItemBtn.textContent = "讀取資源";
            loadItemBtn.addEventListener('click',(e)=>{
                accountSelectContent = JSON.parse(accountSelect.value);
                token = accountStorage[accountSelectContent.name].token;
                name = accountSelectContent.name;
                disable(e.target,1000);
                sendfetch(`items`,token,"").then((itemMessage)=>{
                    sendfetch(`profile`,token,"").then((profileMessage)=>{
                        //將金錢也放入itemMessage中
                        itemMessage.items[itemMessage.items.length] = {"available":profileMessage.money,"id":"c8763","name":"金錢","quantity":profileMessage.money,"type":"money"}

                        //將儲存fetch到的itemMessage到itemListDiv中
                        if(!itemListDiv[name]){itemListDiv[name]={}}
                        itemListDiv[name].item = itemMessage;

                        //fetch本帳的item資訊，來更新exchangeItemSelect
                        sendfetch(`items`,localStorage.getItem('token2'),"").then((mainAccountItemMessage)=>{
                            let accountStorage = getAccountStorage();
                            let availableItemList = mainAccountItemMessage.items;
                            let optionCount = 0;
                            for(let i=0;i<availableItemList.length;i++){
                                //要至少2個以上
                                if(availableItemList[i].available>1){
                                    let status = availableItemList[i].name === accountStorage[name].lastExchangeItem || availableItemList[i].name === "石頭";
                                    exchangeItemSelect[optionCount] = new Option(`${availableItemList[i].name}－剩餘${availableItemList[i].available}個`,
                                    `{"itemName":"${availableItemList[i].name}","itemId":${availableItemList[i].id},"itemAvailable":${availableItemList[i].available},"itemQuantity":${1},"type":"${availableItemList[i].type}"}`,status,status);
                                    optionCount += 1;
                                }
                            }
                        })

                        createItemListDivTable(itemListDiv,shopListDiv,name);
                        updateDivTable(itemListDiv,name);
                        createShopListDivTable(itemListDiv,shopListDiv,name);
                        updateDivTable(shopListDiv,name);

                    })
                })
            })
            btnDiv.appendChild(loadItemBtn);

            //sendShoplistBtn
            sendShoplistBtn.classList.add(css_button);
            sendShoplistBtn.setAttribute("style", "background:rgb(226 135 0);cursor:pointer;margin-bottom: 0.75rem;");
            sendShoplistBtn.setAttribute("id", "sendShoplistBtn");
            sendShoplistBtn.textContent = "一鍵購買";
            sendShoplistBtn.addEventListener("click",(e)=>{
                disable(e.target,1000);
                if(exchangeItemSelect.value){
                    sendShoplist(shopListDiv,JSON.parse(exchangeItemSelect.value),loadItemBtn);
                }
            })
            btnDiv.appendChild(sendShoplistBtn)

            //one subDiv that will contain two tablediv
            subDiv.setAttribute("style",css_basicDiv)
            subDiv.setAttribute("style", "display: flex;");
            itemListDiv.setAttribute("style", "width: 50%;margin: 0.5rem;overflow-x: auto;");
            itemListDiv.setAttribute("id", "itemListDiv");
            shopListDiv.setAttribute("style", "width: 50%;margin: 0.5rem;overflow-x: auto;");
            shopListDiv.setAttribute("id", "shopListDiv");

            //list h2
            let itemListH2 = document.createElement("h2");
            itemListH2.setAttribute("style", "font-size: 1.1rem;font-weight: 600;margin-bottom: 0.5rem;");
            itemListH2.textContent = "物資一覽(裝備背景黃的代表非可賣狀態)";
            let shopListH2 = document.createElement("h2");
            shopListH2.setAttribute("style", "font-size: 1.1rem;font-weight: 600;margin-bottom: 0.5rem;");
            shopListH2.textContent = "購物清單(自動填入歷史購買資訊)";

            mainDiv.appendChild(btnDiv);
            mainDiv.appendChild(selectDiv);
            itemListDiv.appendChild(itemListH2);
            shopListDiv.appendChild(shopListH2);
            subDiv.appendChild(itemListDiv);
            subDiv.appendChild(shopListDiv);
            panel.appendChild(mainDiv);
            panel.appendChild(subDiv);
        }
    }
}

function createItemListDivTable(itemListDiv,shopListDiv,name){
    let accountStorage = getAccountStorage();
    let itemMessage = itemListDiv[name].item;
    //日後div儲存格式
    if(!itemListDiv[name].table){
        itemListDiv[name].table = {
            "equipmentTable":"",
            "itemTable":""
        }
    }
    //物品表單
    let itemList = itemMessage.items;
    let equipmentList = itemMessage.equipments;

    //製作equipmentList的table
    if(equipmentList.length>0){
        let equipmentTable = document.createElement("table");
        equipmentTable.setAttribute("role","table");
        equipmentTable.setAttribute("style","font-variant-numeric: lining-nums tabular-nums;border-collapse: collapse;width: 100%;");
        let thead = document.createElement("thead");
        thead.setAttribute("style","background: rgb(237, 242, 247);")
        let thead_css = "font-weight: 700;letter-spacing: 0.05em;padding: 0.25rem 0.5rem;line-height: 1rem;font-size: 0.75rem;color: rgb(74, 85, 104);border-bottom: 1px solid rgb(237, 242, 247);"
        createtr(thead,["裝備類型","攻擊","防禦","挖礦","剩餘耐久","改"],
        [thead_css+"text-align: left;",thead_css+"text-align: right;",thead_css+"text-align: right;",thead_css+"text-align: right;",thead_css+"text-align: right;",thead_css+"text-align: center;"]);
        let tbody = document.createElement("tbody");
        let tbody_css = "padding: 0.5rem;font-size: 0.875rem;line-height: 1rem;border-bottom: 1px solid rgb(237, 242, 247);"
        for(let k=0;k<equipmentList.length;k++){
            //額外建立一些數據以便日後跟items的格式能相融
            if(equipmentList[k].status === "free"){
                equipmentList[k].available = 1;
            }else{
                equipmentList[k].available = 0;
            }
            equipmentList[k].type = "equipment"

            //更改購物清單的button，並確認button狀態(若數量等同於購物清單則顯示全黑，否則留白)
            let changeShoplistbtn = document.createElement("button");
            checkShoplistbtnStatus(changeShoplistbtn,name,equipmentList[k].id,0);
            changeShoplistbtn.addEventListener("click",(e)=>{
                saveAccountShoplist(name,equipmentList[k].id,0);
                checkShoplistbtnStatus(changeShoplistbtn,name,equipmentList[k].id,0);
                createShoplist(itemListDiv,shopListDiv,name,equipmentList[k]);
                createShopListDivTable(itemListDiv,shopListDiv,name);
                updateDivTable(shopListDiv,name);
            })

            //確認此物品是否能進Shoplist
            createShoplist(itemListDiv,shopListDiv,name,equipmentList[k]);
            //打印tr
            createtr(tbody,[equipmentList[k].typeName,equipmentList[k].atk,equipmentList[k].def,equipmentList[k].minePower,`${equipmentList[k].durability} / ${equipmentList[k].fullDurability}`,changeShoplistbtn],
            [tbody_css+"text-align: left;",tbody_css+"text-align: right;",tbody_css+"text-align: right;",tbody_css+"text-align: right;",tbody_css+"text-align: right;",tbody_css+"text-align: center;"],equipmentList[k].available===0?"background:var(--chakra-colors-yellow-100);":"")
        }
        equipmentTable.appendChild(thead);
        equipmentTable.appendChild(tbody);

        itemListDiv[name].table.equipmentTable = equipmentTable;
    }else{itemListDiv[name].table.equipmentTable = ""}
    //製作itemList的table
    if(itemList.length>0){
        let itemTable = document.createElement("table");
        itemTable.setAttribute("role","table");
        itemTable.setAttribute("style","font-variant-numeric: lining-nums tabular-nums;border-collapse: collapse;width: 100%;");
        let thead = document.createElement("thead");
        thead.setAttribute("style","background: rgb(237, 242, 247);")
        let thead_css = "font-weight: 700;letter-spacing: 0.05em;padding: 0.25rem 0.5rem;line-height: 1rem;font-size: 0.75rem;color: rgb(74, 85, 104);border-bottom: 1px solid rgb(237, 242, 247);"
        createtr(thead,["名稱","數量","預計剩餘","改"],
        [thead_css+"min-width: 124px;text-align: left;",thead_css+"min-width: 95px;text-align: right;",thead_css+"min-width: 95px;text-align: center;",thead_css+"text-align: center;"]);
        let tbody = document.createElement("tbody");
        let tbody_css = "padding: 0.5rem;font-size: 0.875rem;line-height: 1rem;border-bottom: 1px solid rgb(237, 242, 247);"
        for(let i=0;i<itemList.length;i++){
            //如果有歷史紀錄購買紀錄的話則自動填入購買清單中，且紀錄歷史剩餘購買數量。若沒有的話則預設剩餘購買數量為0
            let restItemNum;
            let accountShoplist = accountStorage[name].lastShoplist;
            if(!accountStorage[name].lastShoplist){accountShoplist={}};
    
            if(Object.keys(accountShoplist).includes(itemList[i].name)){
                restItemNum = accountShoplist[itemList[i].name];
                if(restItemNum>itemList[i].available){
                    restItemNum=itemList[i].available;
                }
            }else{
                restItemNum = 0;
            }
    
            //剩餘數量的input
            let restItemNumInput = document.createElement("input");
            restItemNumInput.setAttribute("inputmode","numeric");
            restItemNumInput.setAttribute("type","text");
            restItemNumInput.setAttribute("pattern","^\\d+$");
            restItemNumInput.ariaValueMin = 0;
            restItemNumInput.ariaValueMax = itemList[i].available;
            restItemNumInput.setAttribute("value",restItemNum);
            restItemNumInput.setAttribute("autocomplete","off");
            restItemNumInput.setAttribute("autocorrect","off");
            restItemNumInput.setAttribute("style","width: 100%;font-size: 0.875rem;text-align: center;padding-left: 0.75rem;padding-right: 0.75rem;height: 2rem;border-width: 1px;");
            //確認輸入是否有效
            restItemNumInput.addEventListener("input",(e)=>{
                let value = parseInt(e.target.value,10);
                for(let i=0;i<value.length;i++){
                    if(!/[0-9]/.test(value[i])){
                        value = value.slice(0,i);
                        break;
                    }
                }
                if(value>e.target.ariaValueMax){
                    value = e.target.ariaValueMax;
                }else if(value<e.target.ariaValueMin||!value){
                    value = e.target.ariaValueMin;
                }
                e.target.value = value;
            })
            restItemNumInput.addEventListener("change",(e)=>{
                checkShoplistbtnStatus(e.target.parentNode.parentNode.querySelector("button"),name,itemList[i].id,parseInt(restItemNumInput.value));
            })
    
            //更改購物清單的button，並確認button狀態(若數量等同於購物清單則顯示全黑，否則留白)
            let changeShoplistbtn = document.createElement("button");
            checkShoplistbtnStatus(changeShoplistbtn,name,itemList[i].id,parseInt(restItemNumInput.value));
            changeShoplistbtn.addEventListener("click",(e)=>{
                saveAccountShoplist(name,itemList[i].id,parseInt(restItemNumInput.value));
                checkShoplistbtnStatus(e.target,name,itemList[i].id,parseInt(restItemNumInput.value));
                createShoplist(itemListDiv,shopListDiv,name,itemList[i]);
                createShopListDivTable(itemListDiv,shopListDiv,name)
                updateDivTable(shopListDiv,name);
            })
    
            //顯示對方是否有販賣中物品
            let itemQuantity;
            if(itemList[i].available !== itemList[i].quantity && itemList[i].quantity){
                itemQuantity = `${itemList[i].available} / ${itemList[i].quantity}`;
            }else{
                itemQuantity = `${itemList[i].available}`;
            }
    
            //確認此物品是否能進Shoplist
            createShoplist(itemListDiv,shopListDiv,name,itemList[i]);
            //打印tr
            createtr(tbody,[itemList[i].name,itemQuantity,restItemNumInput,changeShoplistbtn],
            [tbody_css+"text-align: left;",tbody_css+"text-align: right;",tbody_css+"text-align: right;",tbody_css+"text-align: center;"])
        }
        itemTable.appendChild(thead);
        itemTable.appendChild(tbody);

        //儲存table到div底下
        itemListDiv[name].table.itemTable = itemTable;
    }else{itemListDiv[name].table.itemTable = ""}
}

function createtr(body,contentList,tdStyleList,trCss){
    let tr = document.createElement("tr");
    tr.setAttribute("role","row");
    if(trCss){
        tr.setAttribute("style",trCss);
    }
    for(let i=0;i<contentList.length;i++){
        let td = document.createElement("td");
        if(tdStyleList[i]){td.setAttribute("style",tdStyleList[i]);}
        if(isHTMLElement(contentList[i])){
            td.appendChild(contentList[i]);
        }else{
            td.textContent = contentList[i];
        }
        tr.appendChild(td);
    }
    body.appendChild(tr);
}

function checkShoplistbtnStatus(changeShoplistbtn,sellerName,itemId,inputValue){
    let accountStorage = getAccountStorage();
    let lastShoplist;
    if(!accountStorage[sellerName].lastShoplist){
        lastShoplist = {};
    }else{
        lastShoplist = accountStorage[sellerName].lastShoplist;
    }
    if(Object.keys(lastShoplist).includes(String(itemId)) && lastShoplist[itemId] === inputValue){
        changeShoplistbtn.setAttribute("style","background:rgb(0 0 0);width: 1rem;height: 1rem;border: solid;")
    }else{
        changeShoplistbtn.setAttribute("style","background:rgb(255 255 255);width: 1rem;height: 1rem;border: solid;")
    }
}

//儲存歷史剩餘數量購買
function saveAccountShoplist(sellerName,itemId,itemRestQuantity){
    let accountStorage = getAccountStorage();
    if(!accountStorage[sellerName].lastShoplist){
        accountStorage[sellerName].lastShoplist = {};
    }
    accountStorage[sellerName].lastShoplist[itemId] = itemRestQuantity;
    localStorage.setItem('OtherAccount', JSON.stringify(accountStorage))
}

//刪除歷史剩餘數量購買
function deleteAccountShoplist(sellerName,itemId){
    let accountStorage = getAccountStorage();
    if(!accountStorage[sellerName].lastShoplist){
        accountStorage[sellerName].lastShoplist = {};
    }
    if(accountStorage[sellerName].lastShoplist[itemId]!==null){
        delete accountStorage[sellerName].lastShoplist[itemId];
    }
    localStorage.setItem('OtherAccount', JSON.stringify(accountStorage))
}

function createShoplist(itemListDiv,shopListDiv,sellerName,itemDetailList){
    /*
    未來shoplist格式如下
    shoplist:{
        "達爾武":{
            "48763":{
                itemName:"石頭",
                itemQuantity:74,
                itemId:48763,
                type:mine(食物為consumable)
            }
        }
    }
    */
    let accountStorage = getAccountStorage();
    let lastShoplist;

    let itemName = itemDetailList.name;
    let itemAvailable = itemDetailList.available;
    let itemId = itemDetailList.id;
    let type = itemDetailList.type;

    //讀取歷史lastShoplist
    if(!accountStorage[sellerName].lastShoplist){
        lastShoplist = {};
    }else{
        lastShoplist = accountStorage[sellerName].lastShoplist;
    }

    if(!shopListDiv[sellerName]){
        shopListDiv[sellerName] = {}
    }

    if(!shopListDiv[sellerName].shopList){
        shopListDiv[sellerName].shopList = {};
    }

    if(!shopListDiv[sellerName].shopList[sellerName]){
        shopListDiv[sellerName].shopList[sellerName] = {}
    }

    //此判斷式包含lastItemQuantity為null的情況，如果有歷史購買訊息且剩餘數量小於商品數量才會加進Shoplist，並儲存至shopListDiv底下
    let lastItemQuantity = lastShoplist[itemId];
    if(lastItemQuantity<itemAvailable){
        shopListDiv[sellerName].shopList[sellerName][itemId] = {itemName:itemName,itemQuantity:itemAvailable-lastItemQuantity,itemId:itemId,type:type}
    }else if(shopListDiv[sellerName].shopList[sellerName][itemId]){
        delete shopListDiv[sellerName].shopList[sellerName][itemId]
    }
}

function createShopListDivTable(itemListDiv,shopListDiv,name){
    let shopList = shopListDiv[name].shopList[name];
    let shopItemIdList = Object.keys(shopList);
    /*
    shoplist格式如下
    shoplist:{
        "達爾武":{
            "48763":{
                itemName:"石頭",
                itemQuantity:74,
                itemId:48763,
                type:mine(食物為consumable)
            }
        }
    }
    */

    //日後div儲存格式
    if(!shopListDiv[name].table){
        shopListDiv[name].table = {
            "shopTable":"",
        }
    }

    //create shopTable
    let shopTable = document.createElement("table");
    shopTable.setAttribute("role","table")
    shopTable.setAttribute("style","font-variant-numeric: lining-nums tabular-nums;border-collapse: collapse;width: 100%;")
    let thead = document.createElement("thead");
    thead.setAttribute("style","background: rgb(237, 242, 247);")
    let thead_css = "font-weight: 700;letter-spacing: 0.05em;padding: 0.25rem 0.5rem;line-height: 1rem;font-size: 0.75rem;color: rgb(74, 85, 104);border-bottom: 1px solid rgb(237, 242, 247);"
    createtr(thead,["名稱","購買數量","物品id","刪"],
    [thead_css+"min-width: 124px;text-align: left;",thead_css+"min-width: 95px;text-align: right;",thead_css+"min-width: 95px;text-align: right;",thead_css+"text-align: center;"]);

    let tbody = document.createElement("tbody");
    let tbody_css = "padding: 0.5rem;font-size: 0.875rem;line-height: 1rem;border-bottom: 1px solid rgb(237, 242, 247);"
    for(let i=0;i<shopItemIdList.length;i++){
        //刪除購物清單的button
        let changeShoplistbtn = document.createElement("button");
        changeShoplistbtn.setAttribute("style","background:rgb(255 0 0);width: 1rem;height: 1rem;border: solid;")
        changeShoplistbtn.addEventListener("click",(e)=>{
            //刪除Account與shopListDiv中shoplist的項目
            deleteAccountShoplist(name,shopList[shopItemIdList[i]].itemId);
            delete shopListDiv[name].shopList[name][shopItemIdList[i]]

            //重新建立table
            createItemListDivTable(itemListDiv,shopListDiv,name);
            updateDivTable(itemListDiv,name);
            createShopListDivTable(itemListDiv,shopListDiv,name);
            updateDivTable(shopListDiv,name);
        })

        //打印tr
        createtr(tbody,[shopList[shopItemIdList[i]].itemName,shopList[shopItemIdList[i]].itemQuantity,shopList[shopItemIdList[i]].itemId,changeShoplistbtn],[tbody_css+"text-align: left;",tbody_css+"text-align: right;",tbody_css+"text-align: right;",tbody_css+"text-align: center;"])
    }

    shopTable.appendChild(thead);
    shopTable.appendChild(tbody);

    //儲存table到div底下
    shopListDiv[name].table.shopTable = shopTable;
}

function updateDivTable(div,name){
    //先清掉之前的table再加新的
    while(div.querySelector("table")){
        div.removeChild(div.querySelector("table"))
    }
    if(div[name]){
        if(div[name].table){
            let tableList = div[name].table;
            let tableListName = Object.keys(tableList);
            for(let i=0;i<tableListName.length;i++){
                if(div[name].table[tableListName[i]]){
                    div.appendChild(div[name].table[tableListName[i]]);
                }
            }
        }
    }
}

//所有曾經讀取過資源的帳號都會購買
function sendShoplist(shopListDiv,exchangeItemDetail,loadItemBtn){
    /*
    exchangeItemDetail格式為{"itemName":"石頭","itemId":1842,"itemAvailable":54,"itemQuantity":1,"type":mine}

    shopList格式為
    "達爾武": {
        21769: {
            "itemName":"氧氣瓶"
            "itemQuantity": 4,
            "itemId": 21769,
            "type": "consumable"
        },
        11016: {
            "itemName":"石頭"
            "itemQuantity": 29,
            "itemId": 11016,
            "type": "consumable"
        }
    }
    */
    if(!exchangeItemDetail){
        return;
    }
    let accountStorage = getAccountStorage();
    let accountList = Object.keys(accountStorage);
    let buyerToken = localStorage.getItem('token2');
    let exchangeItemAvailable = exchangeItemDetail.itemAvailable;

    sendfetch(`profile`,buyerToken,"").then(async function(mainAccountProfileMessage){
        //本帳的總金錢數
        let money = mainAccountProfileMessage.money;
        let buyerName = mainAccountProfileMessage.nickname;

        for(let i=0;i<accountList.length;i++){
            let sellerName = accountList[i];
            let sellerToken = accountStorage[sellerName].token;
            let shopList;
            if(shopListDiv[sellerName]){
                shopList = shopListDiv[sellerName].shopList[sellerName];
            }else{
                //此帳號目前無購物清單
                console.log(`${sellerName}目前無購物清單`)
                continue;
            }

            //創造一個臨時的div來顯示目前交易情形
            if(document.querySelector("#transactionDetailDiv")){
                document.querySelector("#transactionDetailDiv").remove();
            }
            let flashDiv = document.createElement("div");
            flashDiv.setAttribute("id","transactionDetailDiv")
            flashDiv.setAttribute("style","font-size: 1.1rem;font-weight: 600;margin-bottom: 0.5rem;color:cornflowerblue;");
            flashDiv.textContent = "開始交易";
            shopListDiv.firstChild.insertAdjacentElement('afterend',flashDiv);

            /*
            (1)確認本帳貨幣交換單位總數充足，若過程中不足則小帳先賣石頭，本帳買石頭，並歸零一次貨幣交換單位記數
            (1.1)小帳販賣=本帳總金額數目錢的購物清單第一項
            (1.2)本帳購買購物清單第一項
            (1.3)本帳販賣石頭
            (1.4)小帳購買石頭

            (2.1)重複第1步直到清單購買完畢後，小帳販賣回過程中所使用到的貨幣交換單位(石頭)
            (2.2)本帳購買石頭
            (2.3)本帳販賣石頭
            (2.4)小帳購買石頭

            (3)alert成功購買項目、失敗項目
            */
            let itemNameIdList = Object.keys(shopList);
            let sellerExchangeItemDetail; //存放小帳的ExchangeItemDetail，不足與最後交易結束時需要此資訊
            let tradeTime = 0; //用來記錄經過了幾筆trade，交易結尾會返回所使用到的貨幣交換單位
            let successList = ["購買成功："]; //用來記錄成功購買項目
            let failList = ["","購買失敗："]; //用來記錄失敗購買項目
            for(let k=0;k<itemNameIdList.length;k++){
                let targetItemId = shopList[itemNameIdList[k]].itemId;
                let targetItemType = shopList[targetItemId].type;

                if(exchangeItemAvailable>0){
                    switch(targetItemType){
                        case "equipment":
                        case "mine":
                        case "consumable":
                            await tradeItem(buyerToken,sellerName,sellerToken,shopList[targetItemId],money)
                            .then(async (buyFulfilled)=>{
                                await tradeItem(sellerToken,buyerName,buyerToken,exchangeItemDetail,money)
                                .then((exchangeFulfilled)=>{
                                    flashDiv.textContent = `向${sellerName}購買${shopList[targetItemId].itemName}${shopList[targetItemId].itemQuantity}個`;
                                    exchangeItemAvailable -= 1;
                                    tradeTime += 1;
                                    successList.push(`${shopList[targetItemId].itemName}：${shopList[targetItemId].itemQuantity}個`);
                                },(exchangeRejected)=>{
                                    exchangeItemAvailable -= 1;
                                    if(exchangeItemAvailable<2){
                                        flashDiv.textContent = `因交換單位被劫貨而少於2個，故交易中止`
                                        throw "exchange item insufficient"
                                    }else{
                                        flashDiv.textContent = `不明人士買走了1個交換單位`;
                                    }
                                })
                            },(buyRejected)=>{
                                flashDiv.textContent = `${shopList[targetItemId].itemName}可能被劫貨，或本帳沒錢無法購買`
                                failList.push(`${shopList[targetItemId].itemName}：${shopList[targetItemId].itemQuantity}個`);
                            });
                            break;
                        case "money":
                            await tradeItem(sellerToken,buyerName,buyerToken,exchangeItemDetail,shopList[targetItemId].itemQuantity)
                            .then((buyFulfilled)=>{
                                flashDiv.textContent = `向${sellerName}收取${shopList[targetItemId].itemName}${shopList[targetItemId].itemQuantity}個`;
                                exchangeItemAvailable -= 1;
                                tradeTime += 1;
                                successList.push(`${shopList[targetItemId].itemName}：${shopList[targetItemId].itemQuantity}個`);
                            },(buyRejected)=>{
                                flashDiv.textContent = `看來有人買錯送錢了`
                                failList.push(`${shopList[targetItemId].itemName}：${shopList[targetItemId].itemQuantity}個`);
                            });
                            break;
                        default:break;
                    }
                }else{
                    k -= 1;
                    //exchangeItemAvailable不夠時，本帳先領回一些exchangeItem
                    if(!sellerExchangeItemDetail){
                        await sendfetch(`items`,sellerToken,"").then((itemMessage)=>{
                            let sellerItemList = itemMessage.items;
                            for(let j=0;j<sellerItemList.length;j++){
                                if(sellerItemList[j].name === exchangeItemDetail.itemName){
                                    sellerExchangeItemDetail = {"itemName":sellerItemList[j].name,"itemId":sellerItemList[j].id,"itemQuantity":tradeTime,"type":sellerItemList[j].type}
                                }
                            }
                        })
                    }
                    await tradeItem(buyerToken,sellerName,sellerToken,{"itemName":sellerExchangeItemDetail.itemName,"itemId":sellerExchangeItemDetail.itemId,"itemQuantity":tradeTime,"type":sellerExchangeItemDetail.type},money)
                    .then(async (buyFulfilled)=>{
                        await tradeItem(sellerToken,buyerName,buyerToken,exchangeItemDetail,money)
                        .then((exchangeFulfilled)=>{
                            flashDiv.textContent = `${exchangeItemDetail.itemName}不足，回收${tradeTime}個`
                            exchangeItemAvailable = tradeTime - 1;
                            tradeTime = 1;
                        },(exchangeRejected)=>{
                            exchangeItemAvailable -= 1;
                            if(exchangeItemAvailable<2){
                                flashDiv.textContent = `因交易單位被劫貨不足2個，故交易中止`
                                throw "exchange item insufficient"
                            }else{
                                flashDiv.textContent = `不明人士買走了1個交換單位`;
                            }
                        });
                    },(buyRejected)=>{
                        flashDiv.textContent = `因交易單位被劫貨不足2個，故交易中止`
                        throw "exchange item insufficient"
                    });
                }
            }
            if(failList.length !== 2){
                successList.concat(failList);
            }
            //交易最後收回exchangeItem
            if(tradeTime>=2){
                flashDiv.textContent = `交易結束，收回${exchangeItemDetail.itemName}${tradeTime}個`;
                if(!sellerExchangeItemDetail){
                    await sendfetch(`items`,sellerToken,"").then((itemMessage)=>{
                        let sellerItemList = itemMessage.items;
                        for(let j=0;j<sellerItemList.length;j++){
                            if(sellerItemList[j].name === exchangeItemDetail.itemName){
                                sellerExchangeItemDetail = {"itemName":sellerItemList[j].name,"itemId":sellerItemList[j].id,"itemQuantity":tradeTime,"type":sellerItemList[j].type}
                            }
                        }
                    })
                }
                await tradeItem(buyerToken,sellerName,sellerToken,{"itemName":sellerExchangeItemDetail.itemName,"itemId":sellerExchangeItemDetail.itemId,"itemQuantity":tradeTime,"type":sellerExchangeItemDetail.type},money).then(async ()=>{
                    await tradeItem(sellerToken,buyerName,buyerToken,exchangeItemDetail,money).then(()=>{
                    });
                });
            }

            //交易完成後alert交易訊息，清除Div中的shoplist並重整
            flashDiv.remove();
            shopListDiv[sellerName].shopList = {};
            loadItemBtn.click()
            alert(`與${sellerName}的交易成果：\n${successList.join("\n")}`);

       }
    })
}

//交易一次物品
function tradeItem(buyerToken,sellerName,sellerToken,targetItemDetail,money){
    return new Promise((resolve,reject) =>{
        let targetItemName = targetItemDetail.itemName;
        let targetItemQuantity = targetItemDetail.itemQuantity;
        let targetItemId = targetItemDetail.itemId;
        let targetItemType;
        let sellAPI,sellBody;
        //須注意的是equipment在sell時的api不同
        if(targetItemDetail.type==="mine"){
            sellAPI = `items/sell`
            sellBody = {id:targetItemId,price:money,quantity:targetItemQuantity}
            targetItemType = "mine";
        }else if(targetItemDetail.type==="consumable"){
            sellAPI = `items/sell`
            sellBody = {id:targetItemId,price:money,quantity:targetItemQuantity}
            targetItemType = "items";
        }else{
            sellAPI = `equipments/sell`
            sellBody = {id:targetItemId,price:money}
            targetItemType = "equipments";
        }

        sendfetch(sellAPI,sellerToken,sellBody).then((sendMessage)=>{
            if(sendMessage.ok){
                sendfetch(`trades?category=${targetItemType}`,buyerToken,"").then((tradeMessage)=>{
                    let tradeList = tradeMessage.trades;
                    for(let i=0;i<tradeList.length;i++){
                        if(tradeList[i].name === targetItemName && tradeList[i].sellerName === sellerName){
                            sendfetch(`trades/buy`,buyerToken,{id:tradeList[i].id}).then((buyMessage)=>{
                                if(buyMessage.ok){
                                    console.log(`成功購買 - ${sellerName}:${targetItemName}`);
                                    resolve("");
                                }else{
                                    console.log(`購買失敗 - ${sellerName}:${targetItemName}`);
                                    reject("purchase failed");
                                }
                            });
                            break;
                        }else{
                            console.log(`未發現物品於商城內 - ${sellerName}:${targetItemName}`);
                            reject("item not found");
                        }
                    }
                })
            }else{
                console.log(`sendSell error:${sellerName}:${targetItemName}`);
                reject("not enough money")
            }
        })
    });
}

//create item send tabpanel
function createItemSendTabPanel(panel){
    clearPreviousContent(panel);

    let accountStorage = getAccountStorage();
    if(Object.keys(accountStorage).length === 0){
        noAccountAvailable(panel);
    }else{
        if(panel.querySelector("#noAccountAvailableDiv")){
            panel.querySelector("#noAccountAvailableDiv").remove();
        }
        if(!panel.querySelector("#lazyDiv")){
            let lazyDiv = document.createElement("div");
            lazyDiv.setAttribute("id","lazyDiv")
            lazyDiv.textContent = "目前懶得寫，請開小帳使用徵收系統"
            panel.appendChild(lazyDiv)
        }
    }
}

(function() {
    'use strict';
    window.onload = setInterval(()=>{
        if(location.href.includes("profile")){
            loadbtn();
        }else{
            // console.log("not in profile page")
        }
    },2000);
})();