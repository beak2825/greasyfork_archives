// ==UserScript==
// @name         ACGN-stock 冰塊營利統計外掛：比例型 (電腦排版)
// @namespace    http://tampermonkey.net/
// @version      4.06.00
// @description  Rem Maji Kawii!
// @author       aisu170232
// @match        http://acgn-stock.com/*
// @match        https://acgn-stock.com/*
// @match        https://test.acgn-stock.com/*
// @match        https://museum.acgn-stock.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38766/ACGN-stock%20%E5%86%B0%E5%A1%8A%E7%87%9F%E5%88%A9%E7%B5%B1%E8%A8%88%E5%A4%96%E6%8E%9B%EF%BC%9A%E6%AF%94%E4%BE%8B%E5%9E%8B%20%28%E9%9B%BB%E8%85%A6%E6%8E%92%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/38766/ACGN-stock%20%E5%86%B0%E5%A1%8A%E7%87%9F%E5%88%A9%E7%B5%B1%E8%A8%88%E5%A4%96%E6%8E%9B%EF%BC%9A%E6%AF%94%E4%BE%8B%E5%9E%8B%20%28%E9%9B%BB%E8%85%A6%E6%8E%92%E7%89%88%29.meta.js
// ==/UserScript==

//I love Rem.

// 本腳本修改自 "ACGN-stock營利統計外掛 4.05.02 by SoftwareSing"
// 主要修改區塊：持股資訊總表(排版優化、一股持有不顯示、本益/益本不佳之紅/橘字黑底)、廣告去除
// 備忘錄：
//     將 #190~209 之 checkScriptVIPUpdateTime, checkVIPstate, checkScriptADUpdateTime, addShowVIPbutton 隱藏
//     持股資訊總表的 code 在 #1786~1867



//這邊記一下每個storage的格式

//local_scriptAD_UpdateTime       local
//date

//local_scriptAD                  local
//{"adLinkType": ["_self", "_blank"],
// "adLink": ["/company/detail/NJbJuXaJxjJpzAJui", "https://www.google.com.tw/"],
// "adData": ["&nbsp;message&nbsp;", "miku"],
// "adFormat": ["a", "aLink"]}

//local_CsDatas_UpdateTime        local
//date

//local_CsDatas規格               local
//{"companyID": String, "companyName": String,
// "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
// "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
// "companyEmployeesNumber": Number, "companyNextSeasonEmployeesNumber": Number}

//userStcokInfo的格式         session
//{"userID": "CWgfhqxbrJMxsknrb",
// "userCompany": [{"companyID": aaa, "userHold": number}, {}]
// "userManage": [{"companyID": aaa}, {}]
// "userEmployee": {"companyID": aaa} }



/*************************************/
/**************DebugMode**************/

const debugMode = false;
//debugMode == true 的時候，會console更多資訊供debug

function debugConsole(msg)
{
    if (debugMode)
        console.log(msg);
}


/**************DebugMode**************/
/*************************************/
/*************************************/
/***************import****************/

const {alertDialog} = require("./client/layout/alertDialog.js");

/***************import****************/
/*************************************/
/*************************************/
/************GlobalVariable***********/

//會跨2區以上使用的全域變數放在這裡
//如從stockSummary跨到accountInfo用的變數

var serverType = "normal";

var myID = null;               //當前登入的使用者ID
var myHoldStock = [];   //當前登入的使用者持有的股票, 在股市總覽可以直接抓到全部
var myOrders = [];      //當前登入的使用者未完成交易的買賣單, 在股市總覽可以直接抓到全部
var myStockRanked;

var othersScript = [];


/************GlobalVariable***********/
/*************************************/
/*************************************/
/*********ACGNListenerScript**********/

//本區監測事件搬運自"ACGN股票系統每股營利外掛 ver2.810"
//https://github.com/frozenmouse/acgn-stock-user-script/blob/master/acgn-stock.user.js


(function() {
    startEvent();

    observeLoadingOverlay();
  })();

// 觀察頁面是否進入或離開載入狀態（是否正在轉圈圈）
function observeLoadingOverlay() {
    // 頁面處於載入狀態時會出現的蓋版元素（俗稱「轉圈圈」）
    const loadingOverlay = $("#loading .loadingOverlay")[0];

    // 觀察 loadingOverlay 的 class attribute 是否變動
    new MutationObserver(mutations => {
        mutations.filter(m => m.attributeName === "class").forEach(m => {
        if (m.target.classList.contains("d-none")) {
            // 轉圈圈隱藏 => 已脫離載入狀態
            onPageLoaded();
        } else {
            // 顯示轉圈圈 => 正處於載入狀態
            onPageLoading();
        }
        });
    }).observe(loadingOverlay, { attributes: true });
}

// 頁面在載入狀態時進行此回呼
function onPageLoading() {
    console.log("");
    console.log("");
    console.log(`Page loading: ${document.location.href}`);
}

// 頁面離開載入狀態時進行此回呼
function onPageLoaded() {
    const currentUrl = document.location.href;
    console.log(`Page loaded: ${currentUrl}`);
    console.log("");
    console.log("");

    // 頁面 url 樣式的回呼表
    const urlPatternCallbackTable = [
        { pattern: /company\/[0-9]+/, callback: onStockSummaryPageLoaded },
        { pattern: /company\/detail/, callback: onCompanyDetailPageLoaded },
        { pattern: /accountInfo/, callback: onAccountInfoPageLoaded },
        { pattern: /foundation\/[0-9]+/, callback: onFoundationPlanPageLoaded },
        { pattern: /arenaInfo/, callback: onArenaInfoPageLoaded },
    ];

    // 匹配當前頁面 url 的樣式並進行對應的回呼
    urlPatternCallbackTable.forEach(({ pattern, callback }) => {
        if (currentUrl.match(pattern)) {
        // loadingOverlay 消失後，需要給點時間讓頁面的載入全部跑完
        setTimeout(callback, 100);
        }
    });
}

// 當「股市總覽」頁面已載入時進行的回呼
function onStockSummaryPageLoaded() {
    setTimeout(stockSummaryEvent, 39);
}

// 當「公司資訊」頁面已載入時進行的回呼
function onCompanyDetailPageLoaded() {
    setTimeout(companyEvent, 390);
}

// 當「帳號資訊」頁面已載入時進行的回呼
function onAccountInfoPageLoaded() {
    setTimeout(accountInfoEvent, 200);
    //checkUserInfo();
}

// 當「新創計劃」頁面已載入時進行的回呼
function onFoundationPlanPageLoaded() {

}

//當「最萌亂鬥大賽」頁面已載入時進行的回呼
function onArenaInfoPageLoaded() {
    setTimeout(arenaInfoEvent, 39);
}

/*********ACGNListenerScript**********/
/*************************************/
/*************StartScript*************/
/*************************************/

//本區StartFunction   startEvent()


function startEvent()
{
    checkSeriousError();
    setTimeout(checkScriptEvent, 0);
    //前2項十分重要，需最優先執行

    checkServer();

    setTimeout(checkCsDatasUpdateTime, 1000);
    //setTimeout(checkScriptVIPUpdateTime, 1500);
    //setTimeout(checkVIPstate, 2000);
    //setTimeout(checkScriptADUpdateTime, 2500);
    setTimeout(checkOthersScript, 2500);
    setTimeout(checkUserID, 3900);

    //setTimeout(addShowVIPbutton, 3900);
    setTimeout(addPluginDropdownMenuEvent, 5000);

    setTimeout(checkOthersScript, 180000);
}


function checkServer()
{
    const currentServer = document.location.href;
    const serverTypeTable = [
        { type: /museum.acgn-stock.com/, callback: museumScript },
        { type: /test.acgn-stock.com/, callback: testScript },
    ];

    // 匹配當前連接 server 的樣式並進行對應的回呼
    serverTypeTable.forEach(({ type, callback }) => {
        if (currentServer.match(type)) {
            setTimeout(callback, 1);
        }
    });
}

function museumScript()
{
    console.log("start museumScript()");
    serverType = "museum";

    companies_jsonDB = museum_companies_jsonDB;
    companies_jsonDB_updatetime = museum_companies_jsonDB_updatetime;

    console.log("end museumScript()");
}

function testScript()
{
    console.log("start testScript()");
    serverType = "test";


    console.log("end testScript()");
}


function checkUserID()
{
    myID = String(Meteor.connection._userId);
    console.log("userID:  " + myID);
    if (myID === "null")
        setTimeout(checkUserID, 15000);
    else
        setTimeout(checkUserID, 300000);
}


/*************StartScript*************/
/*************************************/
/*************************************/
/**********ResetLocalStorage**********/

//本區StartFunction   checkSeriousError()


function checkSeriousError()
{
    //這個function將會清空所有由本插件控制的localStorage
    //用於如果上一版發生嚴重錯誤導致localStorage錯亂，以致插件無法正常啟動時
    //或是用於當插件更新時，需要重設localStorage


    var seriousErrorVersion = 3.701;
    //seriousErrorVersion會輸入有問題的版本號，當發生問題時我會增加本數字，或是於更新需要時亦會增加
    //使用者本地的數字紀錄如果小於這個數字將會清空所有localStorage

    var lastErrorVersion = 0 !== window.localStorage.getItem ("lastErrorVersion") ? Number(JSON.parse(window.localStorage.getItem ("lastErrorVersion"))) : 0;
    //lastErrorVersion = 0;  //你如果覺得現在就有問題 可以把這行的註解取消掉來清空localStorage


    if (Number.isNaN(lastErrorVersion))
    {
        lastErrorVersion = 0;
        console.log("reset lastErrorVersion as 0");
    }
    else
    {
        console.log("localStorage of lastErrorVersion is work");
    }

    if (lastErrorVersion < seriousErrorVersion)
    {
        console.log("last version has serious error, start remove all localStorage");
        window.localStorage.removeItem("local_CsDatas_UpdateTime");
        window.localStorage.removeItem("local_CsDatas");
        window.localStorage.removeItem("local_scriptAD_UpdateTime");
        window.localStorage.removeItem("local_scriptAD");

        window.localStorage.removeItem("local_dataSearch");
        window.localStorage.removeItem("local_scriptAD_use");
        window.localStorage.removeItem("local_scriptVIP_UpdateTime");
        window.localStorage.removeItem("local_scriptVIP");

        window.localStorage.removeItem("lastErrorVersion");
        lastErrorVersion = seriousErrorVersion;
        window.localStorage.setItem("lastErrorVersion", JSON.stringify(lastErrorVersion));
    }
}


/**********ResetLocalStorage**********/
/*************************************/
/*************************************/
/************UpdateScript*************/

//本區StartFunction   checkScriptEvent()


function checkScriptEvent()
{
    var myVersion = GM_info.script.version;
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", checkScriptVersion);
    oReq.open("GET", "https://greasyfork.org/scripts/33542.json");
    oReq.send();
}

function checkScriptVersion()
{
    var obj = JSON.parse(this.responseText);
    var myVersion = GM_info.script.version;
    console.log(obj.version.substr(0, 4) + "," + myVersion.substr(0, 4) + "," + (obj.version.substr(0, 4) > myVersion.substr(0, 4)));
    if(obj.version.substr(0, 4) > myVersion.substr(0, 4))
        $('<li class="nav-item"><a class="nav-link btn btn-primary" href="https://greasyfork.org/zh-TW/scripts/33542" id="UpdateDividendScript" target="Blank">' + Dict[lan].updateDividendScript + '</a></li>').insertAfter($('.nav-item')[$('.nav-item').length - 1]);
    else
		setTimeout(checkScriptEvent, 600000);
}


/************UpdateScript*************/
/*************************************/
/*************************************/
/**********CheckOthersScript**********/

//本區StartFunction   checkOthersScript()


//檢查是否有安裝其他腳本
function checkOthersScript()
{
    console.log("start checkOthersScript()");

    const papago89 = check_papago89_Script();
    if (papago89)
        addToScriptList("papago89");


    console.log("complete checkOthersScript()");
}

function addToScriptList(scriptName)
{
    const scriptIndex = othersScript.findIndex(n => n == scriptName);
    if (scriptIndex === -1)
        othersScript.push(scriptName);
}


//檢查是否有安裝papago89的腳本
function check_papago89_Script()
{
    const papago89_Script = $('#about-script').length;
    if (papago89_Script > 0)
    {
        console.log("-----found papago89 script");
        return true;
    }
    else
        return false;
}


/**********CheckOthersScript**********/
/*************************************/
/*************************************/
/***********GetDataBaseData***********/

//所有外連DB的function都寫在這裡


//所有可以用網頁呈現的DB都用這個去call
function getWebData(url)
{
    let webObjCache = null;

    const webUrl = String(url);
    const request = new XMLHttpRequest();
    request.open("GET", webUrl); // 非同步 GET
    request.addEventListener("load", () => {
        debugConsole("got webData");
        try {
            webObjCache = JSON.parse(request.responseText);
        }
        catch(err) {
            webObjCache = request.responseText;
        }
    });
    request.send();

    return (callback) => {
        // 若快取資料存在，則直接回傳快取
        if (webObjCache !== null)
        {
            callback(webObjCache);
            return;
        }

        // 若無快取資料，則加入事件監聽，等載入後再回傳資料
        request.addEventListener("load", function() {
            callback(webObjCache);
        });
    };
}

//連上web來取得資料
/**
 * 以非同步方式取得另外整理過的公司資料 json
 *
 * 考慮資料更新週期極長，若是已經取得過資料，就將之前取得的資料快取回傳
 *
 * 使用方法：
 * const getData = getWebData("https://www.google.com");  //這邊請把google換成你要連的網址
 * getData(a => {
 *   // 這裡的 a 即為該 json 物件
 *   console.log(a);
 * });
 *
 * //有呼叫const的function請務必用setTimeout執行，以防錯誤，即使0秒也行
 * setTimeout(fun_a, 0);
 * function fun_a() {
 *      getData(a => {
 *          console.log(a);
 *      }
 * }
 */


const normal_AD_jsonDB = "https://acgnstock-data.firebaseio.com/ACGNstock-scriptAD/AD.json";
const normal_AD_jsonDB_updatetime = "https://acgnstock-data.firebaseio.com/ACGNstock-scriptAD/updateTime.json";

const normal_companies_jsonDB = "https://acgnstock-data.firebaseio.com/ACGNstock-company/companys.json";
const normal_companies_jsonDB_updatetime = "https://acgnstock-data.firebaseio.com/ACGNstock-company/updateTime.json";

const museum_companies_jsonDB = "https://acgnstock-data.firebaseio.com/ACGNstock-museum/script/company/companys.json";
const museum_companies_jsonDB_updatetime = "https://acgnstock-data.firebaseio.com/ACGNstock-museum/script/company/updateTime.json";

const normal_scriptVIP_jsonDB = "https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptVIP/VIPproducts.json";
const normal_scriptVIP_jsonDB_updatetime = "https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptVIP/updateTime.json";



var companies_jsonDB = normal_companies_jsonDB;
var companies_jsonDB_updatetime = normal_companies_jsonDB_updatetime;

var AD_jsonDB = normal_AD_jsonDB;
var AD_jsonDB_updatetime = normal_AD_jsonDB_updatetime;

var scriptVIP_jsonDB = normal_scriptVIP_jsonDB;
var scriptVIP_jsonDB_updatetime = normal_scriptVIP_jsonDB_updatetime;


/***********GetDataBaseData***********/
/*************************************/
/*************************************/
/************updateCsDatas************/

//本區StartFunction   checkCsDatasUpdateTime()


function checkCsDatasUpdateTime()
{
    console.log("start checkCsDatasUpdateTime()");

    var CsDatas_UpdateTime = JSON.parse(window.localStorage.getItem ("local_CsDatas_UpdateTime")) || "null";

    const get_companies_jsonDB_updatetime = getWebData(companies_jsonDB_updatetime);
    get_companies_jsonDB_updatetime(json_updateTime =>
    {
        console.log("json_updateTime === CsDatas_UpdateTime :  " + (json_updateTime === CsDatas_UpdateTime));
        if (json_updateTime === CsDatas_UpdateTime)
        {
            console.log("dont need update    " + CsDatas_UpdateTime);
        }
        else
        {
            console.log("server update time:  " + json_updateTime);
            console.log("local update time:  " + CsDatas_UpdateTime);

            console.log("start update data");
            setTimeout(updateCsDatas, 1, json_updateTime);
        }
    });

    console.log("complete checkCsDatasUpdateTime()");
}

function updateCsDatas(updateTime)
{
    console.log("start updateCsDatas()");

    var CsDatas = [];

    const get_companies_jsonDB = getWebData(companies_jsonDB);
    get_companies_jsonDB(jsonData =>
    {
        for (let n = 0 ; n < jsonData.length ; n++)
        {
            //local_CsDatas規格               local
            //{"companyID": String, "companyName": String,
            // "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
            // "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
            // "companyEmployeesNumber": Number, "companyNextSeasonEmployeesNumber": Number}
            const thisCompany = jsonData[n];
            CsDatas.push({
                "companyID": String(thisCompany.companyID), "companyName": String(thisCompany.companyName),
                "companyPrice": Number(thisCompany.companyPrice), "companyStock": Number(thisCompany.companyStock),
                "companyProfit": Number(thisCompany.companyProfit),
                "companySalary": Number(thisCompany.companySalary), "companyNextSeasonSalary": Number(thisCompany.companyNextSeasonSalary),
                "companyBonus": Number(thisCompany.companyBonus),
                "companyEmployeesNumber": Number(thisCompany.companyEmployeesNumber),
                "companyNextSeasonEmployeesNumber": Number(thisCompany.companyNextSeasonEmployeesNumber)
                });
            //debugConsole("push success")
        }
        window.localStorage.setItem ("local_CsDatas", JSON.stringify(CsDatas));
        if (updateTime === null || updateTime === undefined)
        {
            window.localStorage.setItem ("local_CsDatas_UpdateTime", JSON.stringify("no data"));
        }
        else
        {
            window.localStorage.setItem ("local_CsDatas_UpdateTime", JSON.stringify(updateTime));
        }


        console.log("complete updateCsDatas()");
    });

}


/************updateCsDatas************/
/*************************************/
/*************************************/
/**************scriptAD***************/

//本區StartFunction   checkScriptADUpdateTime()

function checkScriptADUpdateTime()
{
    console.log("start checkScriptADUpdateTime()");

    var scriptAD_UpdateTime = JSON.parse(window.localStorage.getItem ("local_scriptAD_UpdateTime")) || "null";

    const get_AD_jsonDB_updatetime = getWebData(AD_jsonDB_updatetime);
    get_AD_jsonDB_updatetime(json_updateTime =>
    {
        console.log("json_updateTime === scriptAD_UpdateTime :  " + (json_updateTime === scriptAD_UpdateTime));
        if (json_updateTime === scriptAD_UpdateTime)
        {
            console.log("dont need update    " + scriptAD_UpdateTime);
            setTimeout(addAD, 1);
        }
        else
        {
            console.log("server update time:  " + json_updateTime);
            console.log("local update time:  " + scriptAD_UpdateTime);

            console.log("start update AD data");
            setTimeout(updateScriptAD, 1, json_updateTime);
        }
    });

    console.log("complete checkScriptADUpdateTime()");
}

function updateScriptAD(updateTime)
{
    console.log("start updateScriptAD()");

    const get_AD_jsonDB = getWebData(AD_jsonDB);
    get_AD_jsonDB(jsonData =>
    {
        window.localStorage.setItem ("local_scriptAD", JSON.stringify(jsonData));

        if (updateTime === null || updateTime === undefined)
        {
            window.localStorage.setItem ("local_scriptAD_UpdateTime", JSON.stringify("no data"));
        }
        else
        {
            window.localStorage.setItem ("local_scriptAD_UpdateTime", JSON.stringify(updateTime));
        }

        setTimeout(addAD, 1);
        console.log("complete updateScriptAD()");
    });

}

function addAD()
{
    console.log("start add script AD");
    const scriptAD_use = window.localStorage.getItem("local_scriptAD_use") || "true";
    if (scriptAD_use !== "false")
    {
        const scriptADData = JSON.parse(window.localStorage.getItem ("local_scriptAD")) || "null";
        var data, adNumber, link, linkNumber = 0, linkType;
        $('<a class="scriptAD float-left" id="scriptAD-0">&nbsp;&nbsp;</a>').insertAfter($('.text-danger.float-left'));

        if (scriptADData !== "null")
        {
            console.log("ADnumber:" + scriptADData.adFormat.length);
            for (let adF = 0 ; adF < scriptADData.adFormat.length ; ++adF)
            {
                console.log("adding AD");
                adNumber = Number($('.scriptAD').length);
                data = scriptADData.adData[adF];

                if (scriptADData.adFormat[adF] == "a")
                {
                    $('<a class="scriptAD float-left" id="scriptAD-' + adNumber + '">' + data + '</a>')
                        .insertAfter($('#scriptAD-' + (adNumber - 1)));
                }
                else if (scriptADData.adFormat[adF] == "aLink")
                {
                    link = scriptADData.adLink[linkNumber];
                    linkType = scriptADData.adLinkType[linkNumber];
                    //console.log(linkType);
                    //console.log((linkType != "_blank"));
                    if ((linkType != "_blank") && (linkType != "_parent") && (linkType != "_top"))
                        linkType = "";
                    //linkType = "";
                    $('<a class="scriptAD float-left" id="scriptAD-' + adNumber + '" href="' + link + '" target="' + linkType + '">' + data + '</a>').insertAfter($('#scriptAD-' + (adNumber - 1)));
                    linkNumber += 1;
                }
            }
        }
        else
        {
            console.log("!!!error: can not get local_scriptAD");
        }
    }

    console.log("success add script AD");
}


/**************scriptAD***************/
/*************************************/
/*************************************/
/**********pluginDropdownMenu*********/

//本區StartFunction   addPluginDropdownMenuEvent()

function addPluginDropdownMenuEvent()
{
    setTimeout(addMostStockDropdownMenu, 100);
}


function addMostStockDropdownMenu()
{
    console.log("start addMostStockDropdownMenu()");
    // 所有按鍵插入在原來的第三個按鍵（主題配置）之後
    // 按鍵需要以倒序插入，後加的按鍵會排在左邊
    const insertionTarget = $(".note")[2];

    const mostStockDropDown = $(`
    <div class="note">
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown">${t("mostStockDropDown")}</a>
        <div class="dropdown-menu px-3" aria-labelledby="navbarDropdownMenuLink" style="display: none;" id="stock-menu">
          <h6 class="dropdown-header" style="padding: 0.5rem 0rem" id="company-list">${t("mostStockDropDown")}</h6>
        </div>
      </li>
    </div>
    `);
    mostStockDropDown.insertAfter(insertionTarget);
    setTimeout(addMostStockDropdownMenuDetail, 10);

    console.log("end addMostStockDropdownMenu()");
}

function addMostStockDropdownMenuDetail()
{
    if (myHoldStock.length > 0)
    {
        console.log("start addMostStockDropdownMenuDetail()");

        const top = $('#company-list');
        const CsDatas = JSON.parse(window.localStorage.getItem ("local_CsDatas")) || [];
        //local_CsDatas規格               local
        //{"companyID": String, "companyName": String,
        // "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
        // "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
        // "companyEmployeesNumber": Number, "companyNextSeasonEmployeesNumber": Number}
		
        myStockRanked = myHoldStock;
        myStockRanked = myStockRanked.sort(function(a, b)
        {
            debugConsole("-----addMostStockDropdownMenuDetail()-myStockRanked.sort");
            //排序
            const aIndex = CsDatas.findIndex(x => x.companyID == a.companyId);
            const bIndex = CsDatas.findIndex(y => y.companyID == b.companyId);
            debugConsole("------myStockRanked.sort a: " + a.companyId);
            debugConsole("------myStockRanked.sort b: " + b.companyId);
            if ((aIndex !== -1) && (bIndex !== -1))
            {
                //當2間公司都有資料，可以計算之間的排序
                const aPercent = Number(a.stocks) / Number(CsDatas[aIndex].companyStock);
                const bPercent = Number(b.stocks) / Number(CsDatas[bIndex].companyStock);
                return (bPercent - aPercent);
            }
            else if (aIndex !== -1)
            {
                //只有a有資料，a排前面
                return -1;
            }
            else if (bIndex !== -1)
            {
                //只有b有資料，b排前面
                return 1;
            }
            else
            {
                //都沒資料，不動排序
                return 0;
            }
        });
        debugConsole("-----end addMostStockDropdownMenuDetail()-myStockRanked.sort");

        let i = 0, j = 0;
        let list = "";
        while ((i < 10000) && (myStockRanked.length > i) && (j < 30))
        {
            debugConsole("-----addMostStockDropdownMenuDetail()-addButton");
            const aIndex = CsDatas.findIndex(x => x.companyID == myStockRanked[i].companyId);
            if (aIndex !== -1)
            {
                list += (`<a class="nav-link"
                    href="/company/detail/${myStockRanked[i].companyId}"
                    id="company-link">
                    ${CsDatas[aIndex].companyName}</a>`);
                j += 1;
            }
            i += 1;
        }

        $(list).insertAfter(top);

        console.log("end addMostStockDropdownMenuDetail()");
    }
    else
    {
        console.log("myHoldStock not ready, restart addMostStockDropdownMenuDetail() after 10s");
        setTimeout(addMostStockDropdownMenuDetail, 10000);
    }
}


/**********pluginDropdownMenu*********/
/*************************************/
/*************************************/
/************stockSummary*************/

//本區StartFunction   stockSummaryEvent()


function stockSummaryEvent()
{
    //setTimeout(getBasicUserData, 500, 0);
    getBasicUserData(0);
    setTimeout(useCompaniesDatasEvent, 600);
}


function getBasicUserData(runNumber)
{
    console.log("start getBasicUserData()");

    var restart = false;
    if (runNumber < 10)
    {
        runNumber += 1;

        if (Meteor.connection._mongo_livedata_collections.directors.find().fetch().length > 0)
            myHoldStock = Meteor.connection._mongo_livedata_collections.directors.find().fetch();
        else
            restart = true;

        if (Meteor.connection._mongo_livedata_collections.orders.find().fetch().length > 0)
            myOrders = Meteor.connection._mongo_livedata_collections.orders.find().fetch();
        else
            restart = true;
    }

    /*if (restart)
        setTimeout(getBasicUserData, 1000, runNumber);*/

    console.log("complete getBasicUserData()");
    console.log("");
}


function useCompaniesDatasEvent()
{
    var companiesDatas = Meteor.connection._mongo_livedata_collections.companies.find().fetch();

    if (companiesDatas.length > 0)
    {
        console.log("start useCompaniesDatasEvent()");
        var profit, price, ID, release, earnPerShare, manager, hold, name;
        var bonus = 5, salary = 0;
        const CsDatas = JSON.parse(window.localStorage.getItem ("local_CsDatas")) || [];
        //local_CsDatas規格               local
        //{"companyID": String, "companyName": String,
        // "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
        // "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
        // "companyEmployeesNumber": Number, "companyNextSeasonEmployeesNumber": Number}

        //如果執行的function需要存值，放在這裡
        var value_computeProfit = 0;
        var value_BatchAddCsDatasLocalStorage_1 = JSON.parse(window.localStorage.getItem ("local_CsDatas")) || [];
        var value_BatchAddCsDatasLocalStorage_2 = false;
        var value_BatchAddCsDatasLocalStorage = [value_BatchAddCsDatasLocalStorage_1, value_BatchAddCsDatasLocalStorage_2];
        var value_isEnd = false;

        for (let i = 0; i < companiesDatas.length; ++i)
        {
            let thisCompany = companiesDatas[i];

            profit = Number(thisCompany.profit);
            price = Number(thisCompany.listPrice);
            ID = String(thisCompany._id);
            release = Number(thisCompany.totalRelease);
            earnPerShare = Number((profit * 0.8) / release);
            manager = String(thisCompany.manager);
            name = String(thisCompany.companyName);

            const CDindex = CsDatas.findIndex(c => c.companyID == ID);
            if (CDindex !== -1)
            {
                bonus = Number(CsDatas[CDindex].companyBonus);
                salary = Number(CsDatas[CDindex].companySalary);
                if (CsDatas[CDindex].companyEmployeesNumber > 0)
                    earnPerShare = Number((profit * (0.8 - (bonus * 0.01))) / release);
            }

            const MHSindex = myHoldStock.findIndex(a => a.companyId == ID);
            if (MHSindex === -1)
                hold = 0;
            else
                hold = Number(myHoldStock[MHSindex].stocks);

            console.log(String(ID + "---" + name + "---" +
                price + "---" + release + "---" + profit + "---" + earnPerShare + "---" + hold + "---" +
                manager));


            //需要執行的function放在這
            value_computeProfit = computeProfit(ID, earnPerShare, hold, value_computeProfit);

            value_isEnd = (i + 1 >= companiesDatas.length);
            value_BatchAddCsDatasLocalStorage = BatchAddCsDatasLocalStorage(ID, name, profit, price, release, value_BatchAddCsDatasLocalStorage, value_isEnd);

            const papago89_Script = othersScript.findIndex(n => n == "papago89");
            if (papago89_Script === -1)
                SSAddSomeInfo(ID, earnPerShare, price, hold, manager, profit);



            console.log("");
        }

        console.log("complete computeProfit()");
        console.log("");
    }
    else
    {
        console.log("companiesDatas not ready, restart useCompaniesDatasEvent() after 2s");
        setTimeout(useCompaniesDatasEvent, 2000);
    }
}

//總獲利計算--加入分紅計算
function computeProfit(ID, earnPerShare, hold, sumProfit)
{
    console.log("---start computeProfit()");

    var classProfit;


    sumProfit += earnPerShare * hold;

    console.log("-----預計分紅: " + sumProfit);

    classProfit = $("#totalProfitNumber");
    if (classProfit.length === 0)
    {
        $('<div class="media company-summary-item border-grid-body" id = "totalProfit"><div class="col-6 text-right border-grid" id = "totalProfitTitle"><h2>' + Dict[lan].totalProfitInThisPage + '</h2></div></div>').insertAfter($('.card-title')[0]);
        $('<div class="col-6 text-right border-grid" id = "totalProfitNumber"><h2>$ ' + sumProfit.toFixed() + '</h2></div>').insertAfter($('#totalProfitTitle')[0]);
    }
    else
    {
        $("#totalProfitNumber")[0].innerHTML = "<h2>$ " + sumProfit.toFixed() + "</h2>";
    }

    console.log("---complete computeProfit()");
    return sumProfit;
}


//批量將公司資料加入localStorage
function BatchAddCsDatasLocalStorage(ID, name, profit, price, release, inputValue, isEnd)
{
    console.log("---start BatchAddCsDatasLocalStorage()");
    var CsDatas = inputValue[0];
    var isChange = inputValue[1];

    //local_CsDatas規格               local
    //{"companyID": String, "companyName": String,
    // "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
    // "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
    // "companyEmployeesNumber": Number, "companyNextSeasonEmployeesNumber": Number}
    let index = CsDatas.findIndex(x => x.companyID == ID);
    if (index != -1)
    {
        if ((CsDatas[index].companyPrice == price) &&
            (CsDatas[index].companyStock == release) &&
            (CsDatas[index].companyStock == profit))
        {
            debugConsole("-----dont need update LocalStorage");
        }
        else
        {
            isChange = true;
            const salary = CsDatas[index].companySalary;
            const nextSeasonSalary = CsDatas[index].companyNextSeasonSalary;
            const bonus = CsDatas[index].companyBonus;
            const employeesNumber = CsDatas[index].companyEmployeesNumber;
            const nextSeasonEmployeesNumber = CsDatas[index].companyNextSeasonEmployeesNumber;

            CsDatas.splice(index, 1);
            debugConsole("-----AddCsDatasLocalStorage---splice");

            CsDatas.push({
                "companyID": ID, "companyName": name,
                "companyPrice": Number(price), "companyStock": Number(release), "companyProfit": Number(profit),
                "companySalary": Number(salary), "companyNextSeasonSalary": Number(nextSeasonSalary), "companyBonus": Number(bonus),
                "companyEmployeesNumber": Number(employeesNumber),
                "companyNextSeasonEmployeesNumber": Number(nextSeasonEmployeesNumber)
            });
            debugConsole("-----Add local_CsDatas LocalStorage!!");
        }
    }
    else
    {
        isChange = true;
        CsDatas.push({
            "companyID": ID, "companyName": name,
            "companyPrice": Number(price), "companyStock": Number(release), "companyProfit": Number(profit),
            "companySalary": Number(1000), "companyNextSeasonSalary": Number(1000), "companyBonus": Number(5),
            "companyEmployeesNumber": Number(0),
            "companyNextSeasonEmployeesNumber": Number(0)
        });
        debugConsole("-----AddCsDatasLocalStorage!!");
    }

    debugConsole("-----BatchAddCsDatasLocalStorage()---isChange: " + isChange + "---isEnd: " + isEnd + "---");
    if (isChange && isEnd)
    {
        window.localStorage.setItem ("local_CsDatas", JSON.stringify(CsDatas));
        debugConsole("-----setItem---local_CsDatas");
    }

    outputValue = [CsDatas, isChange];
    console.log("---complete BatchAddCsDatasLocalStorage()");
    return outputValue;
}


function SSAddSomeInfo(ID, earnPerShare, price, hold, manager, profit)
{
    if($(".col-12.col-md-6.col-lg-4.col-xl-3").length > 0)
    {
        //會加入 本益比 股價總值 現金股利 經理薪水
        console.log("---start SSAddSomeInfo()");

        var classInfo;
        var PE, stockWorth, stockProfit, managerSalary;

        PE = price / earnPerShare;
        PE = PE.toFixed(3);

        stockWorth = price * hold;
        stockProfit = (earnPerShare * hold).toFixed();
        managerSalary = (profit * 0.05).toFixed();

        let i = 0;
        for (i = 0 ; i < $('.title a').length ; i++)
        {
            if (ID == String($('.title a')[i].href.match(/\/company\/detail\/([^]+)/)[1]))
                break;
        }

        debugConsole("-----SSAddSomeInfo()---" + ID + "---" + i + "---" + PE + "---" + stockWorth + "---" + stockProfit + "---" + managerSalary + "---");

        classInfo = $("#stockPEInfo_" + i);
        if (classInfo.length === 0)
        {
            if (myID == manager)
                $('<div name="stockPEInfo" class="row row-info d-flex justify-content-between" id="stockManagerSalaryInfo_' + i + '"><p>' + Dict[lan].stockManagerSalaryInfo + '</p><p>' + managerSalary + '</p></div>').insertAfter($('.company-card')[i].children[6]);
            $('<div name="stockPEInfo" class="row row-info d-flex justify-content-between" id="stockProfitInfo_' + i + '"><p>' + Dict[lan].stockProfitInfo + '</p><p>' + stockProfit + '</p></div>').insertAfter($('.company-card')[i].children[6]);
            $('<div name="stockPEInfo" class="row row-info d-flex justify-content-between" id="stockWorthInfo_' + i + '"><p>' + Dict[lan].stockWorthInfo + '</p><p>' + stockWorth + '</p></div>').insertAfter($('.company-card')[i].children[6]);
            $('<div name="stockPEInfo" class="row row-info d-flex justify-content-between" id="stockPEInfo_' + i + '"><p>' + Dict[lan].stockPEInfo + '</p><p>' + PE + '</p></div>').insertAfter($('.company-card')[i].children[6]);
        }


        console.log("---complete SSAddSomeInfo()");
    }
}


/************stockSummary*************/
/*************************************/
/*************************************/
/**************company****************/

//本區StartFunction   companyEvent()


function companyEvent()
{
    setTimeout(company_AddCsDatasLocalStorage, 1);
    setTimeout(checkUserOwnedProducts, 2);
}


function company_AddCsDatasLocalStorage()
{
    const companiesDatas = Meteor.connection._mongo_livedata_collections.companies.find().fetch();
    const employeesDatas = Meteor.connection._mongo_livedata_collections.employees.find().fetch();
    if (companiesDatas.length > 0)
    {
        console.log("start company_AddCsDatasLocalStorage()");
        var profit, price, ID, release, earnPerShare, manager, hold, name;
        var salary, nextSeasonSalary, bonus;
        var employeesNumber = 0, nextSeasonEmployeesNumber = 0;

        let thisCompany = companiesDatas[0];

        profit = Number(thisCompany.profit);
        price = Number(thisCompany.listPrice);
        ID = String(thisCompany._id);
        release = Number(thisCompany.totalRelease);
        earnPerShare = (Number(thisCompany.profit) * 0.8 / Number(thisCompany.totalRelease));
        manager = String(thisCompany.manager);
        name = String(thisCompany.companyName);
        salary = Number(thisCompany.salary);
        nextSeasonSalary = Number(thisCompany.nextSeasonSalary);
        bonus = Number(thisCompany.seasonalBonusPercent);
        for (let empData of employeesDatas)
        {
            if ((empData.employed) && (empData.companyId === ID))
                employeesNumber += 1;
            else if ((empData.employed === false) && (empData.companyId === ID) && (empData.resigned === false))
                nextSeasonEmployeesNumber += 1;
        }
        if (employeesNumber > 0)
            earnPerShare = Number((profit * (0.8 - (bonus * 0.01))) / release);

        console.log("---" + ID + "---" + name + "---");
        //debugConsole(String("---" + ID + "---" + name + "---"));
        debugConsole(String("price: " + price + "  release: " + release + "  profit: " + profit));
        debugConsole(String("salary: " + salary + "  nextSeasonSalary: " + nextSeasonSalary + "  bonus: " + bonus));
        debugConsole(String("employeesNumber: " + employeesNumber + "  nextSeasonEmployeesNumber: " + nextSeasonEmployeesNumber));


        var CsDatas = JSON.parse(window.localStorage.getItem ("local_CsDatas")) || [];
        //local_CsDatas規格               local
        //{"companyID": String, "companyName": String,
        // "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
        // "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
        // "companyEmployeesNumber": Number, "companyNextSeasonEmployeesNumber": Number}

        inputData = {
            "companyID": ID, "companyName": name,
            "companyPrice": Number(price), "companyStock": Number(release), "companyProfit": Number(profit),
            "companySalary": Number(salary), "companyNextSeasonSalary": Number(nextSeasonSalary), "companyBonus": Number(bonus),
            "companyEmployeesNumber": Number(employeesNumber),
            "companyNextSeasonEmployeesNumber": Number(nextSeasonEmployeesNumber)
        };
        //如果先前紀錄過該公司，則刪除重記
        const index = CsDatas.findIndex(x => x.companyID == ID);
        if (index != -1)
        {
            if (CsDatas[index] === inputData)
            {
                debugConsole("dont need update cookie");
            }
            else
            {
                CsDatas.splice(index, 1);
                debugConsole("AddCsDatasCookie---splice");

                CsDatas.push(inputData);
                window.localStorage.setItem ("local_CsDatas", JSON.stringify(CsDatas));

                debugConsole("Add CsDatas localStorage!!");
            }
        }
        else
        {
            CsDatas.push(inputData);
            window.localStorage.setItem ("local_CsDatas", JSON.stringify(CsDatas));

            debugConsole("AddCsDatasLocalStorage!!");
        }

        console.log("complete company_AddCsDatasLocalStorage()");
        console.log("");
    }
    else
    {
        console.log("companiesDatas not ready, restart company_AddCsDatasLocalStorage() after 2s");
        setTimeout(company_AddCsDatasLocalStorage, 2000);
    }
}


/**************company****************/
/*************************************/
/*************************************/
/*************accountInfo*************/

//本區StartFunction   accountInfoEvent()

function accountInfoEvent()
{
    checkUserInfo();
    setTimeout(checkUserOwnedProducts, 2);
}


function checkUserInfo()
{
    console.log("start checkUserInfo()");

    const userID = String(document.location.href.match(/accountInfo\/([0-z]+)/)[1]);
    console.log("-----checkUserInfo() userID = " + userID);
    var userStockInfo = JSON.parse(window.sessionStorage.getItem ("userStockInfo")) || [];
    //userStcokInfo的格式:
    //{"userID": "CWgfhqxbrJMxsknrb",
    // "userCompany": [{"companyID": aaa, "userHold": number}, {}]
    // "userManage": [{"companyID": aaa}, {}]
    // "userEmployee": {"companyID": aaa} }
    // userEmployee暫時用不到
    var userIndex = userStockInfo.findIndex(a => a.userID == userID);
    debugConsole("-----checkUserInfo() userIndex = " + userIndex);
    if (userIndex == -1)
    {
        userStockInfo.push({"userID": userID,
                            "userCompany": [],
                            "userManage": [],
                            "userEmployee": {"companyID": null}
                        });
        userIndex = userStockInfo.findIndex(a => a.userID == userID);
        debugConsole("-----checkUserInfo() userIndex = " + userIndex);

        window.sessionStorage.setItem ("userStockInfo", JSON.stringify(userStockInfo));
    }

    if ($('.card-title').length > 0)
    {
        var managerSalary = Number(computeManagerSalary(userID));
        var employeeBonus = Number(computeEmployeeBonus());

        debugConsole("-----checkUserInfo() userID = " + userID + " , myID = " + myID + " , userID == myID : " + (userID == myID));
        if ((userID == myID) && (myHoldStock.length > 0))
        {
            checkMyHoldStock();
            addUserProfitInfo(userID, managerSalary, employeeBonus);
        }

        checkUserHoldStock(userID, 0, managerSalary, employeeBonus);
        addUserProfitInfo(userID, managerSalary, employeeBonus);

    }
    else
    {
        console.log("$('.card-title') is not ready, restart checkUserInfo() after 2s");
        setTimeout(checkUserInfo, 2000);
    }

    console.log("complete checkUserInfo()");
    console.log("");
}


function computeManagerSalary(userID)
{
    console.log("---start computeManagerSalary()");
    var profit, managerSalary = 0;
    const companyTitleView = $('.nav-link.active')[0].text;
    var userStockInfo = JSON.parse(window.sessionStorage.getItem ("userStockInfo")) || [];
    const userIndex = userStockInfo.findIndex(a => a.userID == userID);
    //userStcokInfo的格式:
    //{"userID": "CWgfhqxbrJMxsknrb",
    // "userCompany": [{"companyID": aaa, "userHold": number}, {}]
    // "userManage": [{"companyID": aaa}, {}]
    // "userEmployee": {"companyID": aaa} }
    const CsDatas = JSON.parse(window.localStorage.getItem ("local_CsDatas")) || [];
    //local_CsDatas規格               local
    //{"companyID": String, "companyName": String,
    // "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
    // "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
    // "companyEmployeesNumber": Number, "companyNextSeasonEmployeesNumber": Number}

    console.log("-----computeManagerSalary()-----companyTitleView === \"經理人\": " + (companyTitleView === "經理人"));
    if (companyTitleView === "經理人")     //可以獲得經理資訊，更新userStockInfo
    {
        const companiesDatas = Meteor.connection._mongo_livedata_collections.companies.find().fetch();
        debugConsole("-----computeManagerSalary()-----companiesDatas.length: " + companiesDatas.length);

        for (let i = 0 ; i < companiesDatas.length ; i++)
        {
            const ID = companiesDatas[i]._id;
            const companyIndex = userStockInfo[userIndex].userManage.findIndex(a => a.companyID == ID);
            debugConsole("-----computeManagerSalary()-----manage: " + ID + "  index: " + companyIndex);
            if (companyIndex === -1)
            {
                userStockInfo[userIndex].userManage.push({"companyID": ID});
                debugConsole("-----computeManagerSalary()-----add into userStockInfo");
            }
        }
        window.sessionStorage.setItem ("userStockInfo", JSON.stringify(userStockInfo));
    }

    //使用userStockInfo的資訊 計算managerSalary
    console.log("-----computeManagerSalary()-----userManage.length: " + userStockInfo[userIndex].userManage.length);
    for (let i = 0 ; i < userStockInfo[userIndex].userManage.length ; i++)
    {
        const ID = userStockInfo[userIndex].userManage[i].companyID;
        const companyIndex = CsDatas.findIndex(a => a.companyID == ID);
        if (companyIndex === -1)
        {
            debugConsole("-----computeManagerSalary()-----not found company  " + ID);
        }
        else
        {
            profit = CsDatas[companyIndex].companyProfit;
            debugConsole("-----computeManagerSalary()-----" + ID + "-----" + profit + "-----");
            managerSalary += Number(profit * 0.05);
            debugConsole("-----computeManagerSalary()-----" + managerSalary);
        }
    }



    //完成後自動開始新增資訊
    //但如果沒有經理薪水就不會新增
    console.log("-----computeManagerSalary()-----" + managerSalary);
    if (managerSalary > 0)
        addManagerSalaryInfo(managerSalary);
    console.log("---complete computeManagerSalary()");
    return managerSalary;
}

function addManagerSalaryInfo(managerSalary)
{
    console.log("---start addManagerSalaryInfo()");
    managerSalary = Number(managerSalary);
    var classManagerSalaryInfo = $("#managerSalaryInfoNumber");
    if(classManagerSalaryInfo.length === 0)
    {
        $('<div class="media account-info-item border-grid-body" id = "managerSalaryInfo"><div class="col-6 text-right border-grid" id = "managerSalaryInfoTitle"><h2>' + Dict[lan].managerTotalSalary + '</h2></div></div>').insertAfter($('.card-title')[0]);
        $('<div class="col-6 text-right border-grid" id = "managerSalaryInfoNumber"><h2>$ ' + managerSalary.toFixed() + '</h2></div>').insertAfter($('#managerSalaryInfoTitle')[0]);
    }
    else
    {
        $("#managerSalaryInfoNumber")[0].innerHTML = "<h2>$ " + managerSalary.toFixed() + "</h2>";
    }
    console.log("---complete addManagerSalaryInfo()");
}



function computeEmployeeBonus()
{
    console.log("---start computeEmployeeBonus()");
    const CsDatas = JSON.parse(window.localStorage.getItem ("local_CsDatas")) || [];
    //local_CsDatas規格               local
    //{"companyID": String, "companyName": String,
    // "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
    // "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
    // "companyEmployeesNumber": Number, "companyNextSeasonEmployeesNumber": Number}
    const employeesDatas = Meteor.connection._mongo_livedata_collections.employees.find().fetch();
    var employeeBonus = 0;
    for (let emp of employeesDatas)
    {
        if (emp.employed)
        {
            const companyIndex = CsDatas.findIndex(c => c.companyID === emp.companyId);
            if (companyIndex !== -1)
            {
                debugConsole("-----computeEmployeeBonus()-----" + emp.companyId + "-----");
                debugConsole("-----computeEmployeeBonus()-----" + CsDatas[companyIndex].companyProfit + "-----" +
                    CsDatas[companyIndex].companyBonus + "-----" + CsDatas[companyIndex].companyEmployeesNumber + "-----");
                let bonus = 0;
                if (Number(CsDatas[companyIndex].companyEmployeesNumber) > 0)
                    bonus = Number(CsDatas[companyIndex].companyProfit
                        * Number(CsDatas[companyIndex].companyBonus * 0.01)
                        / Number(CsDatas[companyIndex].companyEmployeesNumber));
                employeeBonus += bonus;
                debugConsole("-----computeEmployeeBonus()-----" + employeeBonus + "-----");
            }
        }
    }

    console.log("-----computeEmployeeBonus()-----" + employeeBonus);
    if (employeeBonus > 0)
        addEmployeeBonusInfo(employeeBonus);
    console.log("---complete computeEmployeeBonus()");
    return employeeBonus;
}

function addEmployeeBonusInfo(employeeBonus)
{
    console.log("---start addEmployeeBonusInfo()");
    employeeBonus = Number(employeeBonus);
    var classEmployeeBonusInfo = $("#employeeBonusInfoNumber");
    if(classEmployeeBonusInfo.length === 0)
    {
        $('<div class="media account-info-item border-grid-body" id = "employeeBonusInfo"><div class="col-6 text-right border-grid" id = "employeeBonusInfoTitle"><h2>' + Dict[lan].employeeTotalBonus + '</h2></div></div>').insertAfter($('.card-title')[0]);
        $('<div class="col-6 text-right border-grid" id = "employeeBonusInfoNumber"><h2>$ ' + employeeBonus.toFixed() + '</h2></div>').insertAfter($('#employeeBonusInfoTitle')[0]);
    }
    else
    {
        $("#employeeBonusInfoNumber")[0].innerHTML = "<h2>$ " + employeeBonus.toFixed() + "</h2>";
    }
    console.log("---complete addEmployeeBonusInfo()");
}



function checkUserHoldStock(userID, CUHS_runNumber, managerSalary, employeeBonus)
{
    const directors = Meteor.connection._mongo_livedata_collections.directors.find().fetch();
    if (directors.length > 0)
    {
        console.log("---start checkUserHoldStock()");

        /*if ($("[data-toggle-panel=stock]").parent().next().children().last().length > 0)
            addNotCompleteMessage();*/
        console.log("-----userID: " + userID + "   CUHS_runNumber: " + CUHS_runNumber +
            "   managerSalary: " + managerSalary + "   employeeBonus: " + employeeBonus);
        var userStockInfo = JSON.parse(window.sessionStorage.getItem ("userStockInfo")) || [];
        //userStcokInfo的格式:
        //{"userID": "CWgfhqxbrJMxsknrb",
        // "userCompany": [{"companyID": aaa, "userHold": number}, {}]
        // "userManage": [{"companyID": aaa}, {}]
        // "userEmployee": {"companyID": aaa} }
        const userIndex = userStockInfo.findIndex(a => a.userID == userID);
        var ID, hold;

        var isChange = false;

        for (let i = 0 ; i < directors.length ; i++)
        {
            ID = String(directors[i].companyId);
            hold = Number(directors[i].stocks);
            debugConsole("-----" + ID + "-----" + hold + "-----");

            const companyIndex = userStockInfo[userIndex].userCompany.findIndex(b => b.companyID == ID);
            if (companyIndex != -1)
            {
                if (Number(userStockInfo[userIndex].userCompany[companyIndex].userHold) == hold)
                {
                    //debugConsole("dont need update this company");
                }
                else
                {
                    isChange = true;
                    userStockInfo[userIndex].userCompany.splice(companyIndex, 1);
                    userStockInfo[userIndex].userCompany.push({"companyID": ID, "userHold": hold});
                }
            }
            else
            {
                isChange = true;
                userStockInfo[userIndex].userCompany.push({"companyID": ID, "userHold": hold});
            }
        }


        //怕是資料還沒更新完成就開始執行，如果完全沒有變化會再次執行，共確認3次
        //目前將確認3次的部分暫時移除，僅做一次更新
        if (isChange)
        {
            window.sessionStorage.setItem ("userStockInfo", JSON.stringify(userStockInfo));
            //addCompleteMessage();
            //setTimeout(addUserProfitInfo, 10, userID, managerSalary, employeeBonus);
        }
        else
        {
            /*if (CUHS_runNumber < 3)
                setTimeout(checkUserHoldStock, 100, userID, CUHS_runNumber+1, managerSalary);
            else
            {
                addCompleteMessage();
                setTimeout(addUserProfitInfo, 10, userID, managerSalary);
            }*/
            //addCompleteMessage();
            //setTimeout(addUserProfitInfo, 10, userID, managerSalary, employeeBonus);
        }

        console.log("---complete checkUserHoldStock()");
    }
}

function addCompleteMessage()
{
    var pageNum = "1";
    if (($(".page-item.active")[1] !== undefined) && ($(".page-item.active")[1] !== null))
        pageNum = $(".page-item.active")[1].textContent;

    if ($("#CompleteMessage").length === 0) {
        $(`<button class="btn btn-danger btn-sm" type="button" disabled="disabled" id="CompleteMessage">第${pageNum}頁統計完成</button>`)
          .insertAfter($("[data-toggle-panel=stock]").parent().next().children().last());
    }
    else
    {
        $("#CompleteMessage")[0].innerHTML = `第${pageNum}頁統計完成`;
    }
}

function addNotCompleteMessage()
{
    //const pageNum = $(".page-item.active").text();
    if ($("#CompleteMessage").length === 0) {
        $(`<button class="btn btn-danger btn-sm" type="button" disabled="disabled" id="CompleteMessage">還沒有統計完成</button>`)
          .insertAfter($("[data-toggle-panel=stock]").parent().next().children().last());

        if ($("#clear-asset-message-btn").length > 0)       //為了將訊息移動到正確的位置
        {
            $("#clear-asset-message-btn").click();
            if ($("#compute-btn").length > 0)
                $("#compute-btn").click();
        }
    }
    else
    {
        $("#CompleteMessage")[0].innerHTML = `還沒有統計完成`;
    }
}

function checkMyHoldStock()
{
    console.log("---start checkMyHoldStock()");

    var userStockInfo = JSON.parse(window.sessionStorage.getItem ("userStockInfo")) || [];
    //userStcokInfo的格式:
    //{"userID": "CWgfhqxbrJMxsknrb",
    // "userCompany": [{"companyID": aaa, "userHold": number}, {}]
    // "userManage": [{"companyID": aaa}, {}]
    // "userEmployee": {"companyID": aaa} }
    const userID = myID;
    const userIndex = userStockInfo.findIndex(a => a.userID == userID);
    var ID, hold;
    const directors = myHoldStock;

    //避免重複不斷的更新
    if (directors.length != userStockInfo[userIndex].userCompany.length)
    {

        for (let i = 0 ; i < directors.length ; i++)
        {
            ID = String(directors[i].companyId);
            hold = Number(directors[i].stocks);
            debugConsole("-----" + ID + "-----" + hold + "-----");

            const companyIndex = userStockInfo[userIndex].userCompany.findIndex(b => b.companyID == ID);
            if (companyIndex != -1)
            {
                if (Number(userStockInfo[userIndex].userCompany[companyIndex].userHold) == hold)
                {
                    //console.log("dont need update this company");
                }
                else
                {
                    userStockInfo[userIndex].userCompany.splice(companyIndex, 1);
                    userStockInfo[userIndex].userCompany.push({"companyID": ID, "userHold": hold});
                }
            }
            else
            {
                userStockInfo[userIndex].userCompany.push({"companyID": ID, "userHold": hold});
            }
        }
        window.sessionStorage.setItem ("userStockInfo", JSON.stringify(userStockInfo));
    }


    console.log("---complete checkMyHoldStock()");
}


function addUserProfitInfo(userID, managerSalary, employeeBonus)
{
    console.log("---start addUserProfitInfo()");

    const userStockInfo = null !== window.sessionStorage.getItem ("userStockInfo") ? JSON.parse(window.sessionStorage.getItem ("userStockInfo")) : [];
    //userStcokInfo的格式:
    //{"userID": "CWgfhqxbrJMxsknrb",
    // "userCompany": [{"companyID": aaa, "userHold": number}, {}]
    // "userManage": [{"companyID": aaa}, {}]
    // "userEmployee": {"companyID": aaa} }
    const userIndex = userStockInfo.findIndex(a => a.userID == userID);
    //理論上到這邊userIndex就不可能是-1了啦.....

    const users = Meteor.connection._mongo_livedata_collections.users.find().fetch();
    debugConsole("-----userID:  " + userID);
    const users_i = users.findIndex(u => u._id == String(userID));
    debugConsole("-----user_i:  " + users_i);     //for debug

    const CsDatas = JSON.parse(window.localStorage.getItem ("local_CsDatas")) || [];
    //local_CsDatas規格               local
    //{"companyID": String, "companyName": String,
    // "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
    // "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
    // "companyEmployeesNumber": Number, "companyNextSeasonEmployeesNumber": Number}
    const cash = Number(users[users_i].profile.money);

    var classUserProfitInfo, userAssets = 0, userProfit = 0, userCompanyNumber = 0;
    var price, earnPerShare;


    for (let k = 0 ; k < userStockInfo[userIndex].userCompany.length ; k++)
    {
        price = 0;
        earnPerShare = 0;
        const companyIndex = CsDatas.findIndex(b => b.companyID == userStockInfo[userIndex].userCompany[k].companyID);
        if (companyIndex != -1)
        {
            price = Number(CsDatas[companyIndex].companyPrice);
            if (CsDatas[companyIndex].employeesNumber > 0)
                earnPerShare = Number(CsDatas[companyIndex].companyProfit
                    * (0.8 - (CsDatas[companyIndex].companyBonus * 0.01))
                    / CsDatas[companyIndex].companyStock);
            else
                earnPerShare = Number(CsDatas[companyIndex].companyProfit * 0.8 / CsDatas[companyIndex].companyStock);
        }
        userAssets += price * userStockInfo[userIndex].userCompany[k].userHold;
        userProfit += earnPerShare * userStockInfo[userIndex].userCompany[k].userHold;
        userCompanyNumber += 1;
    }


    var usingCash = 0;                  //正在用於買單的錢
    var sellingStockWorth = 0;          //正在賣的股票價值，以參考價計算
    if (userID == myID)
    {
        const orders = myOrders;
        const orderType_buy = "購入";
        const orderType_sell = "賣出";

        for (let j = 0 ; j < orders.length ; j++)
        {
            const amount = Number(orders[j].amount);
            const done = Number(orders[j].done);
            if (orders[j].orderType === orderType_buy)
            {
                const unitPrice = Number(orders[j].unitPrice);
                usingCash += (unitPrice * (amount - done));
            }
            else if (orders[j].orderType === orderType_sell)
            {
                const companyIndex = CsDatas.findIndex(b => b.companyID == String(orders[j].companyId));
                if (companyIndex === -1)
                    price = 0;
                else
                    price = Number(CsDatas[companyIndex].companyPrice);
                sellingStockWorth += (price * (amount - done));
            }
            else
            {
                console.log("-----未完成買賣單發生嚴重錯誤: 不是買單也不是賣單，你怎麼做到的......");
            }
        }
        debugConsole("-----usingCash:  " + usingCash);
        debugConsole("-----sellingStockWorth:  " + sellingStockWorth);

        var classUserUsingCashInfo = $("#userUsingCashInfoNumber");
        if(classUserUsingCashInfo.length === 0)
        {
            debugConsole("-----start add using cash info");
            $('<div class="media account-info-item border-grid-body" id = "userSellingStockInfo"><div class="col-6 text-right border-grid" id = "userSellingStockInfoTitle"><h2>' + Dict[lan].userTotalSellingStock + '</h2></div></div>').insertAfter($('.card-title')[0]);
            $('<div class="col-6 text-right border-grid" id = "userSellingStockInfoNumber"><h2>$ ' + sellingStockWorth + '</h2></div>').insertAfter($('#userSellingStockInfoTitle')[0]);
            $('<div class="media account-info-item border-grid-body" id = "userUsingCashInfo"><div class="col-6 text-right border-grid" id = "userUsingCashInfoTitle"><h2>' + Dict[lan].userTotalUsingCash + '</h2></div></div>').insertAfter($('.card-title')[0]);
            $('<div class="col-6 text-right border-grid" id = "userUsingCashInfoNumber"><h2>$ ' + usingCash + '</h2></div>').insertAfter($('#userUsingCashInfoTitle')[0]);
        }
        else
        {
            debugConsole("-----start update using cash info");
            $("#userSellingStockInfoNumber")[0].innerHTML = "<h2>$ " + sellingStockWorth + "</h2>";
            $("#userUsingCashInfoNumber")[0].innerHTML = "<h2>$ " + usingCash + "</h2>";
        }
    }



    debugConsole("-----call compute tax");
    const tax = computeTax((userAssets + userProfit + managerSalary + employeeBonus + cash + usingCash + sellingStockWorth));

    var classUserTaxInfo = $("#userTaxInfoNumber");
    if(classUserTaxInfo.length === 0)
    {
        debugConsole("-----start add tax info");
        $('<div class="media account-info-item border-grid-body" id = "userTaxInfo"><div class="col-6 text-right border-grid" id = "userTaxInfoTitle"><h2>' + Dict[lan].userTotalTax + '</h2></div></div>').insertAfter($('.card-title')[0]);
        $('<div class="col-6 text-right border-grid" id = "userTaxInfoNumber"><h2>$ ' + tax + '</h2></div>').insertAfter($('#userTaxInfoTitle')[0]);
    }
    else
    {
        debugConsole("-----start update tax info");
        $("#userTaxInfoNumber")[0].innerHTML = "<h2>$ " + tax + "</h2>";
    }


    classUserProfitInfo = $("#userProfitInfoNumber");
    if(classUserProfitInfo.length === 0)
    {
        debugConsole("-----start add info");

        $('<div class="media account-info-item border-grid-body" id = "userProfitInfo"><div class="col-6 text-right border-grid" id = "userProfitInfoTitle"><h2>' + Dict[lan].userTotalProfit + '</h2></div></div>').insertAfter($('.card-title')[0]);
        $('<div class="col-6 text-right border-grid" id = "userProfitInfoNumber"><h2>$ ' + userProfit.toFixed() + '</h2></div>').insertAfter($('#userProfitInfoTitle')[0]);

        $('<div class="media account-info-item border-grid-body" id = "userAssetsInfo"><div class="col-6 text-right border-grid" id = "userAssetsInfoTitle"><h2>' + Dict[lan].userTotalAssets + '</h2></div></div>').insertAfter($('.card-title')[0]);
        $('<div class="col-6 text-right border-grid" id = "userAssetsInfoNumber"><h2>$ ' + userAssets + '</h2></div>').insertAfter($('#userAssetsInfoTitle')[0]);

        $('<div class="media account-info-item border-grid-body" id = "userCompanyNumberInfo"><div class="col-6 text-right border-grid" id = "userCompanyNumberInfoTitle"><h2>' + Dict[lan].userTotalCompanyNumber + '</h2></div></div>').insertAfter($('.card-title')[0]);
        $('<div class="col-6 text-right border-grid" id = "userCompanyNumberInfoNumber"><h2> ' + userCompanyNumber + '</h2></div>').insertAfter($('#userCompanyNumberInfoTitle')[0]);
    }
    else
    {
        debugConsole("-----start update info");
        $("#userProfitInfoNumber")[0].innerHTML = "<h2>$ " + userProfit.toFixed() + "</h2>";
        $("#userAssetsInfoNumber")[0].innerHTML = "<h2>$ " + userAssets + "</h2>";
        $("#userCompanyNumberInfoNumber")[0].innerHTML = "<h2> " + userCompanyNumber + "</h2>";
    }

    console.log("---complete addUserProfitInfo()");
}



// 稅率表：資產上限、稅率、累進差額
function computeTax(input)
{
    debugConsole("---start computeTax()");
    debugConsole("-----computeTax() input:  " + input);

    const taxRateTable = [
        { asset: 10000, rate: 0.00, adjustment: 0 },
        { asset: 100000, rate: 0.03, adjustment: 300 },
        { asset: 500000, rate: 0.06, adjustment: 3300 },
        { asset: 1000000, rate: 0.09, adjustment: 18300 },
        { asset: 2000000, rate: 0.12, adjustment: 48300 },
        { asset: 3000000, rate: 0.15, adjustment: 108300 },
        { asset: 4000000, rate: 0.18, adjustment: 198300 },
        { asset: 5000000, rate: 0.21, adjustment: 318300 },
        { asset: 6000000, rate: 0.24, adjustment: 468300 },
        { asset: 7000000, rate: 0.27, adjustment: 648300 },
        { asset: 8000000, rate: 0.30, adjustment: 858300 },
        { asset: 9000000, rate: 0.33, adjustment: 1098300 },
        { asset: 10000000, rate: 0.36, adjustment: 1368300 },
        { asset: 11000000, rate: 0.39, adjustment: 1668300 },
        { asset: 12000000, rate: 0.42, adjustment: 1998300 },
        { asset: 13000000, rate: 0.45, adjustment: 2358300 },
        { asset: 14000000, rate: 0.48, adjustment: 2748300 },
        { asset: 15000000, rate: 0.51, adjustment: 3168300 },
        { asset: 16000000, rate: 0.54, adjustment: 3618300 },
        { asset: 17000000, rate: 0.57, adjustment: 4098300 },
        { asset: Infinity, rate: 0.60, adjustment: 4608300 },
      ];
    const { rate, adjustment } = taxRateTable.find(e => input < e.asset);
    const output = Math.ceil(input * rate - adjustment);

    debugConsole("-----computeTax() output:  " + output);
    debugConsole("-----complete computeTax()");
    return output;
}




//個人持股表格
//這邊抄了新的方法來實作，做為第一次測試，之後再重構其他的

// 判斷直到 condition 符合之後再執行 action
function waitUntil(condition, action) {
  setTimeout(function check() {
    if (condition()) {
      action();
    } else {
      setTimeout(check, 0);
    }
  }, 0);
}

// 控制 持股表格 資料夾是否展開的 ReactiveVar
const userHaveStockInfo_FolderExpandedVar = new ReactiveVar(false);

// 加入持股表格資料夾
Template.accountInfo.onRendered(() => {
  console.log("accountInfo.onRendered()");
  const instance = Template.instance();

  const userHaveStockInfo_FolderHead = $(`
    <div class="col-12 border-grid">
      <a class="d-block h4" href="" data-toggle-panel="userHaveStockInfo">
        ${t("userHaveStockInfo")} <i class="fa fa-folder"/>
      </a>
    </div>
  `);
  const userHaveStockInfo_FolderIcon = userHaveStockInfo_FolderHead.find("i.fa");
  const userHaveStockInfo_FolderBody = $(`
    <div class="col-12 text-right border-grid">
        <table border="1" id="userHaveStockInfo_Table">
            <tr>
                <th width="380px">&nbsp;&nbsp;公司名稱&nbsp;&nbsp;</th>
                <th>&nbsp;&nbsp;公司股價&nbsp;&nbsp;</th>
                <th>&nbsp;&nbsp;每股分紅&nbsp;&nbsp;</th>
                <th>&nbsp;&nbsp;持股數&nbsp;&nbsp;</th>
                <th width="100px">&nbsp;&nbsp;持股比例&nbsp;&nbsp;</th>
                <th>&nbsp;&nbsp;股票總值&nbsp;&nbsp;</th>
                <th>&nbsp;&nbsp;預估分紅&nbsp;&nbsp;</th>
				<th width="80px">&nbsp;&nbsp;本益比&nbsp;&nbsp;</th>
                <th width="80px">&nbsp;&nbsp;益本比&nbsp;&nbsp;</th>
            </tr>
        </table>
    </div>
  `);

  waitUntil(
    () => instance.$(".card-block:last() .row").length > 0,
    () => instance.$(".card-block:last() .row.border-grid-body").append(userHaveStockInfo_FolderHead));

  instance.autorun(() => {
    const userHaveStockInfo_FolderExpanded = userHaveStockInfo_FolderExpandedVar.get();

    if (userHaveStockInfo_FolderExpanded) {
      setTimeout(() => {
        userHaveStockInfo_FolderIcon.addClass("fa-folder-open").removeClass("fa-folder");
        userHaveStockInfo_FolderBody.insertAfter(userHaveStockInfo_FolderHead);
        setTimeout(add_userHaveStockInfo_Table, 10);
      }, 0);
    } else {
      setTimeout(() => {
        userHaveStockInfo_FolderIcon.addClass("fa-folder").removeClass("fa-folder-open");
        userHaveStockInfo_FolderBody.detach();
      });
    }
  });
});

function add_userHaveStockInfo_Table()
{
    console.log("---start add_userHaveStockInfo_Table()");

    const userID = String(document.location.href.match(/accountInfo\/([0-z]+)/)[1]);
    debugConsole("-----userID: " + userID);
    const userStockInfo = null !== window.sessionStorage.getItem ("userStockInfo") ? JSON.parse(window.sessionStorage.getItem ("userStockInfo")) : [];
    //userStcokInfo的格式:
    //{"userID": "CWgfhqxbrJMxsknrb",
    // "userCompany": [{"companyID": aaa, "userHold": number}, {}]
    // "userManage": [{"companyID": aaa}, {}]
    // "userEmployee": {"companyID": aaa} }
    const userIndex = userStockInfo.findIndex(a => a.userID == userID);
    debugConsole("-----userIndex: " + userIndex);
    debugConsole("-----//如果是 -1 下一步應該跳出本 function");
    //到這邊如果是-1那後面的就不用做了，會跳出function

    if (userID !== -1)
    {
        const CsDatas = JSON.parse(window.localStorage.getItem ("local_CsDatas")) || [];
		
        //local_CsDatas規格               local
        //{"companyID": String, "companyName": String,
        // "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
        // "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
        // "companyEmployeesNumber": Number, "companyNextSeasonEmployeesNumber": Number}

        $(`tr[companyID]`).remove();
		
        for (let i = 0 ; i < myStockRanked.length ; i++)
        {
            const companyID = myStockRanked[i].companyId;
            let price = 0;
            let earnPerShare = 0;
            let name = "error:404 not found";
            let release = 0;
			let hold = 0;
			
			for (let j = 0 ; j < userStockInfo[userIndex].userCompany.length ; j++)
			{
				if (companyID == userStockInfo[userIndex].userCompany[j].companyID)
				{
					hold = userStockInfo[userIndex].userCompany[j].userHold;
				}
			}

            const companyIndex = CsDatas.findIndex(b => b.companyID == companyID);
            if (companyIndex != -1)
            {
                name = String(CsDatas[companyIndex].companyName);
                price = Number(CsDatas[companyIndex].companyPrice);
                release = Number(CsDatas[companyIndex].companyStock);
                if (CsDatas[companyIndex].employeesNumber > 0)
                    earnPerShare = Number(CsDatas[companyIndex].companyProfit
                        * (0.8 - (CsDatas[companyIndex].companyBonus * 0.01))
                        / CsDatas[companyIndex].companyStock);
                else
                    earnPerShare = Number(CsDatas[companyIndex].companyProfit * 0.75 / CsDatas[companyIndex].companyStock);
            }
            debugConsole(String(""));

			if (hold != 1)
			{
				if (earnPerShare == 0)
				{
					if ($(`tr[companyID="${companyID}"]`).length < 1)
					{
						$("#userHaveStockInfo_Table").append(`
							<tr companyID="${companyID}">
								<td title="companyID" width="380px">&nbsp; <a href="/company/detail/${companyID}">${name}</a> &nbsp;</td>
								<td title="price">${price}　</td>
								<td title="earnPerShare">${earnPerShare.toFixed(2)}　</td>
								<td title="hold">${hold}　</td>
								<td title="holdPercentage" width="100px">${(hold / release * 100).toFixed(2)} %　</td>
								<td title="stockWorth">${(price * hold)}　</td>
								<td title="dividend">${(earnPerShare * hold).toFixed(0)}　</td>
								<td title="PE" width="80px">∞　</td>
								<td title="EP" width="80px">--　</td>
							</tr>
						`);
					}
					else
					{
						$(`tr[companyID="${companyID}"]`).find(`td[title="price"]`)[0].innerHTML = `&nbsp;${price}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="earnPerShare"]`)[0].innerHTML = `&nbsp;${earnPerShare.toFixed(2)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="hold"]`)[0].innerHTML = `&nbsp;${hold}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="holdPercentage"]`)[0].innerHTML = `&nbsp;${(hold / release * 100).toFixed(2)} %　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="stockWorth"]`)[0].innerHTML = `&nbsp;${(price * hold)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="dividend"]`)[0].innerHTML = `&nbsp;${(earnPerShare * hold).toFixed(0)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="PE"]`)[0].innerHTML = `&nbsp;∞　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="EP"]`)[0].innerHTML = `&nbsp;--　&nbsp;`;
					}
				}
				else if((earnPerShare / price).toFixed(2) <= 0.24)
				{
					if ($(`tr[companyID="${companyID}"]`).length < 1)
					{
						$("#userHaveStockInfo_Table").append(`
							<tr companyID="${companyID}">
								<td title="companyID" width="380px">&nbsp; <a href="/company/detail/${companyID}">${name}</a> &nbsp;</td>
								<td title="price">${price}　</td>
								<td title="earnPerShare">${earnPerShare.toFixed(2)}　</td>
								<td title="hold">${hold}　</td>
								<td title="holdPercentage" width="100px">${(hold / release * 100).toFixed(2)} %　</td>
								<td title="stockWorth">${(price * hold)}　</td>
								<td title="dividend">${(earnPerShare * hold).toFixed(0)}　</td>
								<td title="PE" width="80px" bgcolor="black"><font color="red">${(price / earnPerShare).toFixed(2)}　</font></td>
								<td title="EP" width="80px" bgcolor="black"><font color="red"><b>${(earnPerShare / price).toFixed(2)}　</b></font></td>
							</tr>
						`);
					}
					else
					{
						$(`tr[companyID="${companyID}"]`).find(`td[title="price"]`)[0].innerHTML = `&nbsp;${price}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="earnPerShare"]`)[0].innerHTML = `&nbsp;${earnPerShare.toFixed(2)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="hold"]`)[0].innerHTML = `&nbsp;${hold}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="holdPercentage"]`)[0].innerHTML = `&nbsp;${(hold / release * 100).toFixed(2)} %　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="stockWorth"]`)[0].innerHTML = `&nbsp;${(price * hold)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="dividend"]`)[0].innerHTML = `&nbsp;${(earnPerShare * hold).toFixed(0)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="PE"]`)[0].innerHTML = `&nbsp;　${(price / earnPerShare).toFixed(2)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="EP"]`)[0].innerHTML = `&nbsp;　${(earnPerShare / price).toFixed(2)}　&nbsp;`;
					}
				}
				else if((earnPerShare / price).toFixed(2) <= 0.42)
				{
					if ($(`tr[companyID="${companyID}"]`).length < 1)
					{
						$("#userHaveStockInfo_Table").append(`
							<tr companyID="${companyID}">
								<td title="companyID" width="380px">&nbsp; <a href="/company/detail/${companyID}">${name}</a> &nbsp;</td>
								<td title="price">${price}　</td>
								<td title="earnPerShare">${earnPerShare.toFixed(2)}　</td>
								<td title="hold">${hold}　</td>
								<td title="holdPercentage" width="100px">${(hold / release * 100).toFixed(2)} %　</td>
								<td title="stockWorth">${(price * hold)}　</td>
								<td title="dividend">${(earnPerShare * hold).toFixed(0)}　</td>
								<td title="PE" width="80px" bgcolor="black"><span style="color:orange;">${(price / earnPerShare).toFixed(2)}　</span></td>
								<td title="EP" width="80px" bgcolor="black"><span style="color:orange;"><b>${(earnPerShare / price).toFixed(2)}　</b></span></td>
							</tr>
						`);
					}
					else
					{
						$(`tr[companyID="${companyID}"]`).find(`td[title="price"]`)[0].innerHTML = `&nbsp;${price}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="earnPerShare"]`)[0].innerHTML = `&nbsp;${earnPerShare.toFixed(2)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="hold"]`)[0].innerHTML = `&nbsp;${hold}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="holdPercentage"]`)[0].innerHTML = `&nbsp;${(hold / release * 100).toFixed(2)} %　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="stockWorth"]`)[0].innerHTML = `&nbsp;${(price * hold)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="dividend"]`)[0].innerHTML = `&nbsp;${(earnPerShare * hold).toFixed(0)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="PE"]`)[0].innerHTML = `&nbsp;　${(price / earnPerShare).toFixed(2)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="EP"]`)[0].innerHTML = `&nbsp;　${(earnPerShare / price).toFixed(2)}　&nbsp;`;
					}
				}
				else if((earnPerShare / price).toFixed(2) >= 0.9)
				{
					if ($(`tr[companyID="${companyID}"]`).length < 1)
					{
						$("#userHaveStockInfo_Table").append(`
							<tr companyID="${companyID}">
								<td title="companyID" width="380px">&nbsp; <a href="/company/detail/${companyID}">${name}</a> &nbsp;</td>
								<td title="price">${price}　</td>
								<td title="earnPerShare">${earnPerShare.toFixed(2)}　</td>
								<td title="hold">${hold}　</td>
								<td title="holdPercentage" width="100px">${(hold / release * 100).toFixed(2)} %　</td>
								<td title="stockWorth">${(price * hold)}　</td>
								<td title="dividend">${(earnPerShare * hold).toFixed(0)}　</td>
								<td title="PE" width="80px" bgcolor="yellow">${(price / earnPerShare).toFixed(2)}　</td>
								<td title="EP" width="80px" bgcolor="yellow">${(earnPerShare / price).toFixed(2)}　</td>
							</tr>
						`);
					}
					else
					{
						$(`tr[companyID="${companyID}"]`).find(`td[title="price"]`)[0].innerHTML = `&nbsp;${price}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="earnPerShare"]`)[0].innerHTML = `&nbsp;${earnPerShare.toFixed(2)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="hold"]`)[0].innerHTML = `&nbsp;${hold}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="holdPercentage"]`)[0].innerHTML = `&nbsp;${(hold / release * 100).toFixed(2)} %　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="stockWorth"]`)[0].innerHTML = `&nbsp;${(price * hold)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="dividend"]`)[0].innerHTML = `&nbsp;${(earnPerShare * hold).toFixed(0)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="PE"]`)[0].innerHTML = `&nbsp;　${(price / earnPerShare).toFixed(2)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="EP"]`)[0].innerHTML = `&nbsp;　${(earnPerShare / price).toFixed(2)}　&nbsp;`;
					}
				}
				else
				{
					if ($(`tr[companyID="${companyID}"]`).length < 1)
					{
						$("#userHaveStockInfo_Table").append(`
							<tr companyID="${companyID}">
								<td title="companyID" width="380px">&nbsp; <a href="/company/detail/${companyID}">${name}</a> &nbsp;</td>
								<td title="price">${price}　</td>
								<td title="earnPerShare">${earnPerShare.toFixed(2)}　</td>
								<td title="hold">${hold}　</td>
								<td title="holdPercentage" width="100px">${(hold / release * 100).toFixed(2)} %　</td>
								<td title="stockWorth">${(price * hold)}　</td>
								<td title="dividend">${(earnPerShare * hold).toFixed(0)}　</td>
								<td title="PE" width="80px">${(price / earnPerShare).toFixed(2)}　</td>
								<td title="EP" width="80px">${(earnPerShare / price).toFixed(2)}　</td>
							</tr>
						`);
					}
					else
					{
						$(`tr[companyID="${companyID}"]`).find(`td[title="price"]`)[0].innerHTML = `&nbsp;${price}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="earnPerShare"]`)[0].innerHTML = `&nbsp;${earnPerShare.toFixed(2)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="hold"]`)[0].innerHTML = `&nbsp;${hold}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="holdPercentage"]`)[0].innerHTML = `&nbsp;${(hold / release * 100).toFixed(2)} %　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="stockWorth"]`)[0].innerHTML = `&nbsp;${(price * hold)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="dividend"]`)[0].innerHTML = `&nbsp;${(earnPerShare * hold).toFixed(0)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="PE"]`)[0].innerHTML = `&nbsp;　${(price / earnPerShare).toFixed(2)}　&nbsp;`;
						$(`tr[companyID="${companyID}"]`).find(`td[title="EP"]`)[0].innerHTML = `&nbsp;　${(earnPerShare / price).toFixed(2)}　&nbsp;`;
					}
				}
			}
        }
    }

    console.log("---end add_userHaveStockInfo_Table()");
}

Template.accountInfo.events({
  "click [data-toggle-panel=userHaveStockInfo]"(event) {
    event.preventDefault();
    console.log("click_userHaveStockInfo");
    userHaveStockInfo_FolderExpandedVar.set(!userHaveStockInfo_FolderExpandedVar.get());
  },
});


/*************accountInfo*************/
/*************************************/
/*************************************/
/**************arenaInfo**************/


function arenaInfoEvent()
{
    addMyArenaButton();

    addRemoveButtton();
}


function removeNotFighter()
{
    console.log("start removeNotFighter()");

    const dbFighters = Meteor.connection._mongo_livedata_collections.arenaFighters.find().fetch();
    for (let f of dbFighters)
    {
        const money = f.hp + f.sp + f.atk + f.def + f.agi;
        if (money < 10000)
        {
            debugConsole("id: " + f.companyId + "   money: " + money);
            $(`tr[data-id=${f.companyId}]`).remove();
        }
    }

    console.log("end removeNotFighter()");
}

function addRemoveButtton()
{
    if ($(`button[id="removeNotFighter"]`).length < 1)
    {
        const buttonRemove = $(`
            <button class="btn btn-primary btn-sm" type="button" id="removeNotFighter">
            移除沒資格的參賽者
            </button>
            `);
        buttonRemove.insertAfter($(`h1[class="card-title mb-1"]`)[0]);
        $('#removeNotFighter')[0].addEventListener("click", function() {
            removeNotFighter();
        });
    }
}




//Dark function
//don't see, don't use, don't ask
var my_virtual_fighters = [];
var battleTime = 0;

function removeMyArenaButton()
{
    $(`[objectGroup="myArena"]`).remove();
}

function addMyArenaButton()
{
    console.log("start addMyArenaButton()");

    removeMyArenaButton();

    if (checkAttackSequence())
    {
        if ($('#startMyArena').length < 1)
        {
            const buttonMyArena = $(`
                <button class="btn btn-danger btn-sm" type="button" id="startMyArena" objectGroup="myArena">
                使用進階功能
                </button>
                `);
            buttonMyArena.insertAfter($(`h1[class="card-title mb-1"]`)[0]);
            $('#startMyArena')[0].addEventListener("click", function() {
                $('#startMyArena').remove();
                myArena();
            }
            );
        }
    }

    console.log("end addMyArenaButton()");
}

function myArena()
{
    console.log("start myArena()");

    console.log("-----ready to start fightSimulatorCreater");
    addInputID();

    fightSimulatorCreater();
    addFindInfoButton();

    addStartFightSimulatorButton();
    addFindBattleLogButton();

    console.log("end myArena()");
}


function checkAttackSequence()
{
    console.log("---start checkAttackSequence()");
    let checkReturn = false;
    const dbFighters = Meteor.connection._mongo_livedata_collections.arenaFighters.find().fetch();

    if (dbFighters.length > 0)
    {
        checkReturn = true;
        for (let f of dbFighters)
        {
            if (f.attackSequence.length === 0)
            {
                checkReturn = false;
                break;
            }
        }
    }

    return checkReturn;
}

function VirtualFighter(fID, fName, fManager, fHP, fSP, fATK, fDEF, fAGI, fspCost, fcreatedAt, fattackSequence)
{
    this.ID = fID;
    this.name = fName;
    this.manager = fManager;
    this.money = {
        "total": Number(fHP + fSP + fATK + fDEF + fAGI),
        "hp": fHP,
        "sp": fSP,
        "atk": fATK,
        "def": fDEF,
        "agi": fAGI,
        "killBonus": 0
    };
    this.hp = Number(Math.floor(fHP/200) + 50);
    this.sp = Number(Math.floor(fSP/1000) + 5);
    this.atk = Number(Math.floor(fATK/1000) + 1);
    this.def = Number(Math.floor(fDEF/1000));
    this.agi = Number(Math.floor(fAGI/1000));

    this.spCost = Number(fspCost);
    this.createdAt = Date.parse(fcreatedAt);
    this.attackSequence = fattackSequence;
    this.attackIndex = -1;
    var notFound = 999999;
    while (notFound !== -1)
    {
        this.attackIndex += 1;
        notFound = this.attackSequence.findIndex(x => x === this.attackIndex);
    }
    this.battleLog = [];
    this.battleLog.push(`【聲明】模擬戰鬥僅使用現有數值進行模擬，與 最終結果 並不會相同`);

    debugConsole("=====new Fighter ID: " + this.ID);
    debugConsole("=====new Fighter total money: " + this.money.total);
}

function fightSimulatorCreater()
{
    battleTime = 0;
    const dbFighters = Meteor.connection._mongo_livedata_collections.arenaFighters.find().fetch();
    var vFighters = [];
    const CsDatas = JSON.parse(window.localStorage.getItem ("local_CsDatas")) || [];
    //local_CsDatas規格               local
    //{"companyID": String, "companyName": String,
    // "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
    // "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
    // "companyEmployeesNumber": Number, "companyNextSeasonEmployeesNumber": Number}

    debugConsole("-----for of dbFighters");
    for (let f of dbFighters)
    {
        const fName = (CsDatas.find(c => c.companyID === f.companyId)).companyName;
        debugConsole("-----new Fighter input: " + f.companyId + fName + f.manager +
            f.hp + f.sp + f.atk + f.def + f.agi +
            f.spCost + f.createdAt + f.attackSequence.length);
        let thisFighter = new VirtualFighter(f.companyId, fName, f.manager,
            f.hp, f.sp, f.atk, f.def, f.agi,
            f.spCost, f.createdAt, f.attackSequence);
        vFighters.push(thisFighter);
    }

    //刪除不到10000的北七
    debugConsole("-----start delete money < 10000");
    var deleteList = [];
    for (let i=0; i<vFighters.length; i+=1)
    {
        if (vFighters[i].money.total < 10000)
        {
            const thisFighterAttackIndex = vFighters[i].attackIndex;

            debugConsole("-----delete ID: " + vFighters[i].ID + "   attackIndex: " + thisFighterAttackIndex);
            debugConsole("-----delete Name: " + vFighters[i].name);
            debugConsole("");

            vFighters.splice(i, 1);
            deleteList.push(thisFighterAttackIndex);

            i -= 1;     //因為刪除會導致順序改變，因此i要往回1個
        }
    }
    const sampleAttackSequence = vFighters[0].attackSequence;
    if (sampleAttackSequence.length !== (dbFighters.length-1))
    {
        //當亂鬥已經結束時，不符合參賽資格的公司會被從列表刪除，但會留在攻擊名單內
        //因此要把這些公司從參加者的攻擊名單中刪除
        for (let d of sampleAttackSequence)
        {
            if ((vFighters.findIndex(f => f.attackIndex === d)) === -1)
            {
                deleteList.push(d);
            }
        }
    }
    for (let j=0; j<vFighters.length; j+=1)
    {
        for (let k of deleteList)
        {
            const thisI = vFighters[j].attackSequence.findIndex(f => f === k);
            vFighters[j].attackSequence.splice(thisI, 1);
        }
    }

    //排攻擊順序
    vFighters.sort(function(a, b) {
        if ((b.agi - a.agi) === 0)
            return a.createdAt - b.createdAt;
        else
            return b.agi - a.agi;
    });

    my_virtual_fighters = vFighters;

    const moneyInfoTitle = $(`
        <th
            class="text-center text-truncate"
            style="width: 150px; min-width: 150px; cursor: pointer;"
            title="預估戰鬥獎勵"
            id="moneyInfoTitle"
            objectGroup="myArena"
        >
        預估戰鬥獎勵
        </th>
    `);
    if ($('th[title="預估戰鬥獎勵"]').length < 1)
    {
        moneyInfoTitle.insertAfter($('th[title="投資額"]')[0]);
    }

    debugConsole("-----for of fighters");
    for (let thisFighter of vFighters)
    {
        const fID = thisFighter.ID;
        debugConsole("-----fID: " + fID);
        debugConsole("-----tr[data-id=fID].length: " + $(`tr[data-id=${fID}]`).length);
        $(`tr[data-id=${fID}]`).append(`
            <td class="text-center px-1 text-truncate" style="width: 150px; min-width: 150px;">
            ${thisFighter.money.killBonus}
            </td>
        `);
    }
}

function fightSimulator(vFighters)
{
    console.log("---start fightSimulator()");
    battleTime += 1;
    const topSP = 6;        // spCost>這個數值 則視為100%發動
    const topAGI = 30;      // 雙方AGI差距<這個數值 則視為100%命中
    var vLog = [];

    const statementLog = `【聲明】模擬戰鬥僅使用現有數值進行模擬，與 最終結果 並不會相同`;
    console.log(statementLog);
    vLog.push(statementLog);

    for (let i=0; i<vFighters.length; i+=1)
    {
        debugConsole("-----i: " + i);
        debugConsole("-----vFighters[i].hp: " + vFighters[i].hp);
        if (vFighters[i].hp > 0)
        {
            const randomSp = Math.floor((Math.random() * 10) + 1);
            const randomAgi = Math.floor((Math.random() * 100) + 1);
            debugConsole("-----randomSp: " + randomSp);
            debugConsole("-----randomAgi: " + randomAgi);

            //決定攻擊目標
            debugConsole("-----決定攻擊目標");
            var targetHP = 0;
            var targetIndex = -1;
            var t = -1;
            debugConsole("-----while()");
            while (targetHP < 1)
            {
                t += 1;
                debugConsole("-----t: " + t);
                const targetI = vFighters[i].attackSequence[t];
                debugConsole("-----targetI: " + targetI);
                targetIndex = vFighters.findIndex(f => f.attackIndex === targetI);
                debugConsole("-----targetIndex: " + targetIndex);
                targetHP = vFighters[targetIndex].hp;
                debugConsole("-----targetHP: " + targetHP);
            }
            debugConsole("-----targetIndex: " + targetIndex);

            //開始攻擊
            debugConsole("-----開始攻擊");
            if (((vFighters[i].spCost > topSP) || (vFighters[i].spCost >= randomSp)) &&
                (vFighters[i].sp >= vFighters[i].spCost))
            {
                vFighters[targetIndex].hp -= vFighters[i].atk;
                vFighters[i].sp -= vFighters[i].spCost;

                const thisLog = `【第${battleTime}回合】${vFighters[i].name} 使用SP攻擊對 ${vFighters[targetIndex].name} 造成${vFighters[i].atk}傷害，血量變為${vFighters[targetIndex].hp}`;
                console.log(thisLog);
                vFighters[i].battleLog.push(thisLog);
                vFighters[targetIndex].battleLog.push(thisLog);
                vLog.push(thisLog);
            }
            else
            {
                const agiAGI = vFighters[targetIndex].agi - vFighters[i].agi;
                if ((agiAGI < topAGI) || ((agiAGI-randomAgi) <= 0) || (randomAgi > 95))
                {
                    let atkNumber = vFighters[i].atk - vFighters[targetIndex].def;
                    if (atkNumber < 1)
                    {
                        atkNumber = 1;
                    }
                    vFighters[targetIndex].hp -= atkNumber;

                    const thisLog = `【第${battleTime}回合】${vFighters[i].name} 使用普通攻擊對 ${vFighters[targetIndex].name} 造成${atkNumber}傷害，血量變為${vFighters[targetIndex].hp}`;
                    console.log(thisLog);
                    vFighters[i].battleLog.push(thisLog);
                    vFighters[targetIndex].battleLog.push(thisLog);
                    vLog.push(thisLog);
                }
                else
                {
                    const thisLog = `【第${battleTime}回合】${vFighters[i].name} 攻擊 ${vFighters[targetIndex].name} ，但AGI差距${agiAGI}點而被閃開了`;
                    console.log(thisLog);
                    vFighters[i].battleLog.push(thisLog);
                    vFighters[targetIndex].battleLog.push(thisLog);
                    vLog.push(thisLog);
                }
            }

            //計算是否擊倒
            debugConsole("-----計算是否擊倒");
            if (vFighters[targetIndex].hp <= 0)
            {
                vFighters[i].money.killBonus += vFighters[targetIndex].money.total;

                const thisLog = `【第${battleTime}回合】${vFighters[i].name} 擊倒了 ${vFighters[targetIndex].name} ，獲得了${vFighters[targetIndex].money.total}的獎金`;
                console.log(thisLog);
                vFighters[i].battleLog.push(thisLog);
                vFighters[targetIndex].battleLog.push(thisLog);
                vLog.push(thisLog);
            }
        }
    }

    //戰鬥結束 回復SP
    for (let i=0; i<vFighters.length; i+=1)
    {
        debugConsole("-----i: " + i);
        if (vFighters[i].hp > 0)
        {
            vFighters[i].sp += 1;
        }
    }

    my_virtual_fighters = vFighters;
    addFightSimulatorData(vFighters);
    addBattleLogTable(vLog);

    console.log("---end fightSimulator()");
}

function addFightSimulatorData(vFighters)
{
    console.log("---start addFightSimulatorData()");

    for (let thisFighter of vFighters)
    {
        debugConsole("ID: " + thisFighter.ID + "  hp sp killBonus: " + thisFighter.hp + thisFighter.sp + thisFighter.money.killBonus);
        $(`tr[data-id=${thisFighter.ID}]`).find('td')[2].innerText = thisFighter.hp;
        $(`tr[data-id=${thisFighter.ID}]`).find('td')[3].innerText = thisFighter.sp;
        $(`tr[data-id=${thisFighter.ID}]`).find('td')[9].innerText = thisFighter.money.killBonus;
    }

    console.log("---end addFightSimulatorData()");
}

function addBattleLogTable(vLog)
{
    $(`table[id=findArenaOutput_Table]`).remove();

    const outListTable = $(`
        <table border="1" id="findArenaOutput_Table">
            <tr>
                <td>&nbsp;&nbsp;紀錄&nbsp;&nbsp;</td>
            </tr>
        </table>
    `);
    outListTable.insertAfter($(`input[id=inputID]`)[0]);

    for (let thisLog of vLog)
    {
        $("#findArenaOutput_Table").append(`
            <tr>
                <td>&nbsp;${thisLog}&nbsp;</td>
            </tr>
        `);
    }
}

function addStartFightSimulatorButton()
{
    const buttonFS = $(`
        <button class="btn btn-danger btn-sm" type="button" id="startFS" objectGroup="myArena">
        模擬戰鬥
        </button>
        `);
    buttonFS.insertAfter($(`h1[class="card-title mb-1"]`)[0]);
    $('#startFS')[0].addEventListener("click", function() {fightSimulator(my_virtual_fighters); });
}

function findBattleLog(fID)
{
    const outListTable = $(`
        <table border="1" id="findArenaOutput_Table">
            <tr>
                <td>&nbsp;&nbsp;紀錄&nbsp;&nbsp;</td>
            </tr>
        </table>
    `);
    outListTable.insertAfter($(`input[id=inputID]`)[0]);

    const thisFighter = my_virtual_fighters.find(f => f.ID === fID);
    for (let thisLog of thisFighter.battleLog)
    {
        $("#findArenaOutput_Table").append(`
            <tr>
                <td>&nbsp;${thisLog}&nbsp;</td>
            </tr>
        `);
    }
}

function addFindBattleLogButton()
{
    const buttonFindBattleLog = $(`
        <button class="btn btn-info btn-sm" type="button" id="findBattleLog" objectGroup="myArena">
        搜尋模擬戰鬥紀錄
        </button>
        `);
    buttonFindBattleLog.insertAfter($(`h1[class="card-title mb-1"]`)[0]);
    $('#findBattleLog')[0].addEventListener("click", function() {
        $(`table[id=findArenaOutput_Table]`).remove();
        const tID = $(`input[id=inputID]`)[0].value;
        findBattleLog(tID);
    });
}



function findAttackList(fID)
{
    const printNumber = 100;
    const thisFighter = my_virtual_fighters.find(x => x.ID === fID);
    const CsDatas = JSON.parse(window.localStorage.getItem ("local_CsDatas")) || [];
    //local_CsDatas規格               local
    //{"companyID": String, "companyName": String,
    // "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
    // "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
    // "companyEmployeesNumber": Number, "companyNextSeasonEmployeesNumber": Number}
    const outListTable = $(`
        <table border="1" id="findArenaOutput_Table">
            <tr>
                <td>&nbsp;&nbsp;攻擊序&nbsp;&nbsp;</td>
                <td width="390px">&nbsp;&nbsp;公司名稱&nbsp;&nbsp;</td>
            </tr>
        </table>
    `);
    outListTable.insertAfter($(`input[id=inputID]`)[0]);


    for (let i=0; i<printNumber; i+=1)
    {
        const a_index = thisFighter.attackSequence[i];
        const a_fighter = my_virtual_fighters.find(x => x.attackIndex === a_index);
        const a_company = CsDatas.find(c => c.companyID === a_fighter.ID);
        console.log("attack: " + i + "   " + a_company.companyName);

        $("#findArenaOutput_Table").append(`
            <tr>
                <td>&nbsp;${(i+1)}&nbsp;</td>
                <td width="390px">&nbsp; <a href="/company/detail/${a_company.companyID}">${a_company.companyName}</a> &nbsp;</td>
            </tr>
        `);
    }
}

function findAttackMe(myID)
{
    const fs = my_virtual_fighters;
    const myF = fs.find(f => f.ID === myID);
    const myIndex = myF.attackIndex;
    const findNumberIn = 39;
    const CsDatas = JSON.parse(window.localStorage.getItem ("local_CsDatas")) || [];
    //local_CsDatas規格               local
    //{"companyID": String, "companyName": String,
    // "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
    // "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
    // "companyEmployeesNumber": Number, "companyNextSeasonEmployeesNumber": Number}
    const outListTable = $(`
        <table border="1" id="findArenaOutput_Table">
            <tr>
                <td>&nbsp;&nbsp;攻擊序&nbsp;&nbsp;</td>
                <td width="390px">&nbsp;&nbsp;公司名稱&nbsp;&nbsp;</td>
            </tr>
        </table>
    `);
    outListTable.insertAfter($(`input[id=inputID]`)[0]);


    for (let f of fs)
    {
        const xIndex = f.attackSequence.findIndex(x => x === myIndex);
        if (xIndex < findNumberIn)
        {
            const thatcompany = CsDatas.find(c => c.companyID === f.ID);
            console.log("ID: " + f.ID);
            console.log("name: " + thatcompany.companyName);
            console.log("attackIndex: " + xIndex);
            //console.log(f);
            console.log("");

            if (xIndex !== -1)
            {
                $("#findArenaOutput_Table").append(`
                    <tr>
                        <td>&nbsp;${xIndex + 1}&nbsp;</td>
                        <td width="390px">&nbsp; <a href="/company/detail/${f.ID}">${thatcompany.companyName}</a> &nbsp;</td>
                    </tr>
                `);
            }
        }
    }
}

function addInputID()
{
    const inputID = $(`
        <input
            class="form-control"
            type="text"
            name="inputID"
            id="inputID"
            objectGroup="myArena"
            maxlength="200"
            placeholder="請輸入公司ID，如 初音未來 為 oeQuXvDBoHYTAZ7ei"
        >
        `);
    inputID.insertAfter($(`h1[class="card-title mb-1"]`)[0]);
}

function addFindInfoButton()
{
    const buttonAttackList = $(`
        <button class="btn btn-warning btn-sm" type="button" id="findAttackList" objectGroup="myArena">
        搜尋攻擊清單
        </button>
        `);
    buttonAttackList.insertAfter($(`h1[class="card-title mb-1"]`)[0]);
    $('#findAttackList')[0].addEventListener("click", function() {
        $(`table[id=findArenaOutput_Table]`).remove();
        const tID = $(`input[id=inputID]`)[0].value;
        findAttackList(tID);
    });

    const buttonAttackMe = $(`
        <button class="btn btn-warning btn-sm" type="button" id="findAttackMe" objectGroup="myArena">
        搜尋敵人清單
        </button>
        `);
    buttonAttackMe.insertAfter($(`h1[class="card-title mb-1"]`)[0]);
    $('#findAttackMe')[0].addEventListener("click", function() {
        $(`table[id=findArenaOutput_Table]`).remove();
        const tID = $(`input[id=inputID]`)[0].value;
        findAttackMe(tID);
    });

    const buttonRemoveTable = $(`
        <button class="btn btn-info btn-sm" type="button" id="removeTable" objectGroup="myArena">
        移除table
        </button>
        `);
    buttonRemoveTable.insertAfter($(`h1[class="card-title mb-1"]`)[0]);
    $('#removeTable')[0].addEventListener("click", function() {
        $(`table[id=findArenaOutput_Table]`).remove();
    });
}



/**************arenaInfo**************/
/*************************************/
/*************************************/
/**************scriptVIP**************/


function checkVIPstate()
{
    if (!isVIP())
    {
        const useAD = true;
        window.localStorage.setItem("local_scriptAD_use", useAD);
    }
}

function addShowVIPbutton()
{
    console.log("start addShowVIPbutton()");

    const showButton = $(`
        <li class="nav-item" name="scriptVIP">
          <a class="nav-link" href="#" name="showVIP">外掛VIP</a>
        </li>
    `);
    $(`<hr name="script" id="0">`).insertAfter($(`li[class="nav-item"]`).find($(`a[href="/fscStock"`)));
    showButton.insertAfter($(`hr[name="script"][id="0"]`)[0]);

    $(`a[name="showVIP"]`)[0].addEventListener("click", function() {
        setTimeout(showVIPpage, 0);
    });
    console.log("end addShowVIPbutton()");
}

function showVIPpage()
{
    console.log("start showVIPpage()");
    //暴力移除目前頁面
    $(".card-block").remove();

    //改為VIP功能資訊
    $(".card").append(`
        <div class="card-block" name="VIP">
            <div class="col-5">
                <h1 class="card-title mb-1">SoftwareScript</h1>
                <h1 class="card-title mb-1">　VIP功能</h1>
            </div>
            <div class="col-5">您是我的恩客嗎?</div>
            <div class="col-12">
                <hr>
                <p>要離開本頁面記得點進來的那一頁以外的其他頁面</p>
                <hr>
                <h2 name="becomeVIP">成為VIP</h2>
                <hr>
                <h2 name="VIPscriptAD">外掛廣告</h2>
                <hr>
                <h2 name="VIPdataSearch">資料搜尋</h2>
                <hr>
                <p>如VIP功能發生問題，請至Discord股市群聯絡SoftwareSing</p>
            </div>
        </div>
    `);

    vipInfo();
    vipAD();
    vipDataSearch();

    console.log("end showVIPpage()");
}

function vipInfo()
{
    console.log("---start vipInfo()");

    const scriptVIP_UpdateTime = JSON.parse(window.localStorage.getItem ("local_scriptVIP_UpdateTime")) || "null";
    const userVIP = isVIP();
    const info = (`
        <p>VIP條件更新時間: ${scriptVIP_UpdateTime}</p>
        <p>您目前的VIP狀態: ${userVIP}</p>
        <p>VIP權限: </P>
        <ul name="vipCanDo">
            <li>關閉外掛廣告</li>
            <li>使用資料搜尋功能</li>
        </ul>
        <p>為成為VIP需要購買以下商品</p>
        <ul name="needProduct"></ul>
    `);

    let productList = "";
    const products = JSON.parse(window.localStorage.getItem ("local_scriptVIP")) || [];
    for (let p of products)
    {
        productList += (`<li><a href="${p.link}" target="_self">${p.description}</a></li>`);
    }

    $(info).insertAfter($(`h2[name="becomeVIP"]`));
    $(`ul[name="needProduct"]`).append($(productList));

    console.log("---end vipInfo()");
}

function vipAD()
{
    console.log("---start vipAD()");

    const scriptADData = JSON.parse(window.localStorage.getItem ("local_scriptAD")) || "null";
    const scriptAD_UpdateTime = JSON.parse(window.localStorage.getItem ("local_scriptAD_UpdateTime")) || "null";
    let ADinfo = "";
    if (scriptADData !== "null")
    {
        let linkNumber = 0;
        let adNumber = 0;
        console.log("ADnumber:" + scriptADData.adFormat.length);
        for (let adF = 0 ; adF < scriptADData.adFormat.length ; ++adF)
        {
            console.log("adding AD");
            adNumber += 1;
            data = scriptADData.adData[adF];

            if (scriptADData.adFormat[adF] == "a")
            {
                ADinfo += ('<a class="scriptAD float-left" id="scriptAD-' + adNumber + '">' + data + '</a>');
            }
            else if (scriptADData.adFormat[adF] == "aLink")
            {
                link = scriptADData.adLink[linkNumber];
                linkType = scriptADData.adLinkType[linkNumber];
                //console.log(linkType);
                //console.log((linkType != "_blank"));
                if ((linkType != "_blank") && (linkType != "_parent") && (linkType != "_top"))
                    linkType = "";
                //linkType = "";
                ADinfo += ('<a class="scriptAD float-left" id="scriptAD-' + adNumber + '" href="' + link + '" target="' + linkType + '">' + data + '</a>');
                linkNumber += 1;
            }
        }
    }

    const info = (`
        <p>目前的廣告更新時間: ${scriptAD_UpdateTime}</p>
        <p>目前的廣告內容: </p>
        <p>${ADinfo}　</p>
        <p>　
            <button class="btn btn-info btn-sm" name="openAD">開啟外掛廣告</button>
            <button class="btn btn-danger btn-sm" name="closeAD">關閉外掛廣告</button>
        </p>
        <p>
            <font color="red">設定會於下次開啟時生效</font>
        </p>
    `);
    if ($(`button[name="closeAD"]`).length < 1)
    {
        $(info).insertAfter($(`h2[name="VIPscriptAD"]`));
    }

    if (!isVIP())
    {
        debugConsole("-----user is VIP.");
        $(`button[name="closeAD"]`)[0].disabled = true;
    }
    else
    {
        $(`button[name="closeAD"]`)[0].addEventListener("click", function() {
            const useAD = false;
            window.localStorage.setItem("local_scriptAD_use", useAD);
        });
    }
    $(`button[name="openAD"]`)[0].addEventListener("click", function() {
        const useAD = true;
        window.localStorage.setItem("local_scriptAD_use", useAD);
    });

    console.log("---end vipAD()");
}

function isVIP()
{
    console.log("---start isVIP()");

    let products = JSON.parse(window.localStorage.getItem ("local_scriptVIP")) || [];
    let VIP = true;

    debugConsole("-----for of products");
    for (let scriptP of products)
    {
        debugConsole("=====scriptP: ");
        debugConsole(scriptP);
        if (scriptP.check === false)
        {
            VIP = false;
            debugConsole("=====break");
            break;
        }
    }
    debugConsole("------end for of products");

    console.log("-----VIP: " + VIP);
    console.log("---end isVIP()");
    return VIP;
}


function checkUserOwnedProducts()
{
    console.log("start checkUserOwnedProducts()");

    const userID = myID;
    let products = JSON.parse(window.localStorage.getItem ("local_scriptVIP")) || [];
    const {dbUserOwnedProducts} = require("./db/dbUserOwnedProducts");

    //檢查每個VIP要求的產品是否已經有買到
    debugConsole("-----for of products");
    for (let scriptP of products)
    {
        debugConsole("=====scriptP: ");
        debugConsole(scriptP);
        const p = dbUserOwnedProducts.find({productId: scriptP.productID, userId: userID}).fetch();
        debugConsole("=====p: ");
        debugConsole(p);
        if (p.length > 0)
        {
            //已經確定有該產品，確認數量
            if (p[0].amount >= scriptP.needAmount)
            {
                scriptP.check = true;
            }
        }
        debugConsole("");
    }
    debugConsole("------end for of products");

    window.localStorage.setItem ("local_scriptVIP", JSON.stringify(products));

    console.log("end checkUserOwnedProducts()");
}




function checkScriptVIPUpdateTime()
{
    console.log("start checkScriptVIPUpdateTime()");

    const scriptVIP_UpdateTime = JSON.parse(window.localStorage.getItem ("local_scriptVIP_UpdateTime")) || "null";

    const get_scriptVIP_jsonDB_updatetime = getWebData(scriptVIP_jsonDB_updatetime);
    get_scriptVIP_jsonDB_updatetime(json_updateTime =>
    {
        console.log("json_updateTime === CsDatas_UpdateTime :  " + (json_updateTime === scriptVIP_UpdateTime));
        if (json_updateTime === scriptVIP_UpdateTime)
        {
            console.log("dont need update    " + scriptVIP_UpdateTime);
        }
        else
        {
            console.log("server update time:  " + json_updateTime);
            console.log("local update time:  " + scriptVIP_UpdateTime);

            console.log("start update data");
            setTimeout(updateScriptVIP, 1, json_updateTime);
        }

        console.log("complete checkScriptVIPUpdateTime()");
    });
}

function updateScriptVIP(updateTime)
{
    console.log("start updateScriptVIP()");


    const get_scriptVIP_jsonDB = getWebData(scriptVIP_jsonDB);
    get_scriptVIP_jsonDB(jsonData =>
    {
        window.localStorage.setItem ("local_scriptVIP", JSON.stringify(jsonData));

        if (updateTime === null || updateTime === undefined)
        {
            window.localStorage.setItem ("local_scriptVIP_UpdateTime", JSON.stringify("no data"));
        }
        else
        {
            window.localStorage.setItem ("local_scriptVIP_UpdateTime", JSON.stringify(updateTime));
        }

        console.log("end updateScriptVIP()");
    });
}


function vipDataSearch()
{
    console.log("start vipDataSearch()");

    const CsDatas_UpdateTime = JSON.parse(window.localStorage.getItem ("local_CsDatas_UpdateTime")) || "null";
    const info = (`
        <p>
            VIP可以用此功能搜尋公司資料<br />
            公司資料為 從雲端同步 或 於瀏覽股市時自動更新，因此可能與最新資料有所落差<br />
            目前的雲端資料更新時間: ${CsDatas_UpdateTime}<br />
            &nbsp;(每次重新載入股市時，會確認雲端是否有更新資料)
        </p>
        <p>&nbsp;</p>
        <p>各項數值名稱對照表(不在表中的數值無法使用)：
            <table border="1" name="valueNameTable">
                <tr name="companyID"> <td>公司ID</td> <td>ID</td> </tr>
                <tr name="companyName"> <td>公司名稱</td> <td>name</td> </tr>
                <tr name="companyPrice"> <td>股價</td> <td>price</td> </tr>
                <tr name="companyStock"> <td>總釋股量</td> <td>stock</td> </tr>
                <tr name="companyProfit"> <td>總營收</td> <td>profit</td> </tr>
                <tr name="companySalary"> <td>本季員工薪水</td> <td>salary</td> </tr>
                <tr name="companyNextSeasonSalary"> <td>下季員工薪水</td> <td>nextSeasonSalary</td> </tr>
                <tr name="companyBonus"> <td>員工分紅%數</td> <td>bonus</td> </tr>
                <tr name="companyEmployeesNumber"> <td>本季員工人數</td> <td>employeesNumber</td> </tr>
                <tr name="companyNextSeasonEmployeesNumber"> <td>下季員工人數</td> <td>nextSeasonEmployeesNumber</td> </tr>
            </table>
        </p>
        <p>常用函式：
            <table border="1" name="valueNameTable">
                <tr name="等於">
                    <td bgcolor="yellow">等於 (請用2或3個等號)</td>
                    <td bgcolor="yellow">==</td>
                </tr>
                <tr name="OR">
                    <td>x OR(或) y</td>
                    <td>(x || y)</td>
                </tr>
                <tr name="AND">
                    <td>x AND y</td>
                    <td>(x && y)</td>
                </tr>
                <tr name="toFixed()">
                    <td>把x四捨五入至小數點y位</td>
                    <td>x.toFixed(y)</td>
                </tr>
                <tr name="Math.ceil(price * 1.15)">
                    <td>計算漲停價格</td>
                    <td>Math.ceil(price * 1.15)</td>
                </tr>
                <tr name="Math.ceil(price * 0.85)">
                    <td>計算跌停價格</td>
                    <td>Math.ceil(price * 0.85)</td>
                </tr>
                <tr name="本益比">
                    <td>本益比</td>
                    <td>(price * stock) / profit</td>
                </tr>
                <tr name="益本比">
                    <td>益本比</td>
                    <td>profit / (price * stock)</td>
                </tr>
                <tr name="包含">
                    <td>名字中包含 艦これ 的公司</td>
                    <td>(name.indexOf("艦これ") > -1)</td>
                </tr>
            </table>
        </p>
        <p>&nbsp;</p>
        <p> <a href="https://hackmd.io/s/SycGT5yIG" target="_blank">資料搜尋用法教學</a> </p>
        <p>
            <select class="form-control" style="width: 300px;" name="dataSearchList"></select>
            <button class="btn btn-info btn-sm" name="createTable">建立新的搜尋表</button>
            <button class="btn btn-danger btn-sm" name="deleteTable">刪除這個搜尋表</button>
            <button class="btn btn-danger btn-sm" name="deleteAllTable">刪除所有</button>
        </p>
        <p name="showTableName"> 表格名稱： <span class="text-info" name="tableName"></span></p>
        <p name="showTableFilter">
            過濾公式：<input class="form-control"
                type="text" name="tableFilter"
                placeholder="請輸入過濾公式，如: (price>1000)">
            <button class="btn btn-info btn-sm" name="addTableFilter">儲存過濾公式</button>
            <button class="btn btn-danger btn-sm" name="deleteTableFilter">刪除過濾公式</button>
        </p>
        <p name="showTableSort">
            排序依據：<input class="form-control"
                type="text" name="tableSort"
                placeholder="請輸入排序公式，如: (price)，小到大請加負號: -(price)">
            <button class="btn btn-info btn-sm" name="addTableSort">儲存排序公式</button>
            <button class="btn btn-danger btn-sm" name="deleteTableSort">刪除排序公式</button>
        </p>
        <p>&nbsp;</p>
        <p name"showTableColumn">表格欄位<br />
            <button class="btn btn-info btn-sm" name="addTableColumn">新增欄位</button>
            <table border="1" name"tableColumn">
                <thead>
                    <th>名稱</th>
                    <th>公式</th>
                    <th>操作</th>
                </thead>
                <tbody name="tableColumn">
                </tbody>
            </table>
        </p>
        <p>&nbsp;</p>
        <p>
            <button class="btn btn-info" name="outputTable">輸出結果</button>
            <button class="btn btn-warning" name="clearOutputTable">清空輸出</button>
        </p>
        <p name="outputTable"></p>
        <p>&nbsp;</p>
    `);
    $(info).insertAfter($(`h2[name="VIPdataSearch"]`));


    $(`button[name="deleteAllTable"]`)[0].addEventListener("click", ()=>{
        alertDialog.confirm({
            title: '刪除所有搜尋表',
            message: `您確定要刪除所有的表格嗎? <br />
                (建議發生嚴重錯誤至無法操作時 再這麼做)`,
            callback: (result) => {
                if (result)
                {
                    window.localStorage.removeItem("local_dataSearch");
                    //有些錯誤會造成addEventListener加入失敗，因此直接重載入網頁
                    setTimeout(showVIPpage, 10);
                }
            }
        });
    });


    $(`button[name="createTable"]`)[0].addEventListener("click", ()=>{
        alertDialog.dialog({
            type: 'prompt',
            title: '新建搜尋表',
            message: `請輸入表格名稱(如有重複將直接覆蓋)`,
            inputType: 'text',
            customSetting: ``,
            callback: function(result) {
                if (result)
                {
                    addTable(result);
                    addDataSearchList();
                    $(`select[name="dataSearchList"]`)[0].value = stripscript(result);
                    showTableInfo();
                }
            }
        });
    });
    $(`button[name="deleteTable"]`)[0].addEventListener("click", ()=>{
        const tableName = $(`select[name="dataSearchList"]`)[0].value;
        alertDialog.confirm({
            title: '刪除搜尋表',
            message: `您確定要刪除表格 ${tableName} 嗎?`,
            callback: (result) => {
                if (result)
                {
                    deleteTable(tableName);
                    addDataSearchList();
                    showTableInfo();
                }
            }
        });
    });


    addDataSearchList();
    if ($(`select[name="dataSearchList"]`)[0].value !== "")
    {
        showTableInfo();
    }


    $(`button[name="addTableFilter"]`)[0].addEventListener("click", ()=>{
        const tableName = $(`select[name="dataSearchList"]`)[0].value;
        const filter = $(`input[name="tableFilter"]`)[0].value;
        addTableFilter(tableName, filter);
    });
    $(`button[name="deleteTableFilter"]`)[0].addEventListener("click", ()=>{
        const tableName = $(`select[name="dataSearchList"]`)[0].value;
        deleteTableFilter(tableName);
        $(`input[name="tableFilter"]`)[0].value = "";
    });

    $(`button[name="addTableSort"]`)[0].addEventListener("click", ()=>{
        const tableName = $(`select[name="dataSearchList"]`)[0].value;
        const sort = $(`input[name="tableSort"]`)[0].value;
        addTableSort(tableName, sort);
    });
    $(`button[name="deleteTableSort"]`)[0].addEventListener("click", ()=>{
        const tableName = $(`select[name="dataSearchList"]`)[0].value;
        deleteTableSort(tableName);
        $(`input[name="tableSort"]`)[0].value = "";
    });


    $(`button[name="addTableColumn"]`)[0].addEventListener("click", ()=>{
        const tableName = $(`select[name="dataSearchList"]`)[0].value;
        alertDialog.dialog({
            type: 'prompt',
            title: '新增欄位',
            message: `請輸入新的欄位名稱`,
            inputType: 'text',
            customSetting: `placeholder="請輸入欄位名稱，如: 本益比"`,
            callback: function(newName) {
                if (newName)
                {
                    alertDialog.dialog({
                        type: 'prompt',
                        title: '新增欄位',
                        message: `請輸入新的公式`,
                        inputType: 'text',
                        customSetting: `placeholder="請輸入欄位公式，如: (profit / (price * stock))"`,
                        callback: function(newRule) {
                            if (newRule)
                            {
                                addTableColumn(tableName, newName, newRule);
                                showTableColumn(tableName);
                            }
                        }
                    });
                }
            }
        });
    });

    $(`button[name="outputTable"]`)[0].addEventListener("click", ()=>{
        if (isVIP())
        {
            const tableName = $(`span[name="tableName"]`)[0].innerText;
            if (tableName !== "")
            {
                const filter = $(`input[name="tableFilter"]`)[0].value;
                addTableFilter(tableName, filter);
                const sort = $(`input[name="tableSort"]`)[0].value;
                addTableSort(tableName, sort);

                outputTable(tableName);
            }
        }
        else
        {
            alertDialog.alert("你不是VIP！(怒)");
        }
    });
    $(`button[name="clearOutputTable"]`)[0].addEventListener("click", ()=>{
        $(`table[name=outputTable]`).remove();
    });

    console.log("end vipDataSearch()");
}

function addDataSearchList()
{
    console.log("---start addDataSearchList()");

    $(`option[name="dataSearchList"]`).remove();
    const dataSearch = JSON.parse(window.localStorage.getItem ("local_dataSearch")) || [];
    for (let t of dataSearch)
    {
        const item = $(`<option name="dataSearchList" value="${t.tableName}">${t.tableName}</option>`);
        $(`select[name="dataSearchList"]`).append(item);
    }
    $(`select[name="dataSearchList"]`)[0].addEventListener("change", ()=>{
        $(`table[name=outputTable]`).remove();
        showTableInfo();
    });

    console.log("---end addDataSearchList()");
}

function showTableInfo()
{
    console.log("---start showTableInfo");

    const selectValue = $(`select[name="dataSearchList"]`)[0].value;
    if (selectValue)
    {
        const dataSearch = JSON.parse(window.localStorage.getItem ("local_dataSearch")) || [];
        const thisTable = dataSearch.find(t => t.tableName === selectValue);
        $(`span[name="tableName"]`)[0].innerText = thisTable.tableName;
        $(`input[name="tableFilter"]`)[0].value = thisTable.filter;
        $(`input[name="tableSort"]`)[0].value = thisTable.sort;

        showTableColumn(thisTable.tableName);
    }
    else
    {
        $(`span[name="tableName"]`)[0].innerText = "";
        $(`input[name="tableFilter"]`)[0].value = "";
        $(`input[name="tableSort"]`)[0].value = "";
        $(`tr[name="tableColumn"]`).remove();
    }

    console.log("---end showTableInfo");
}

function showTableColumn(tableName)
{
    console.log("---start showTableColumn()");

    $(`tr[name="tableColumn"]`).remove();
    const dataSearch = JSON.parse(window.localStorage.getItem ("local_dataSearch")) || [];
    const thisTable = dataSearch.find(t => t.tableName === tableName);
    for (let c of thisTable.column)
    {
        const t = (`
            <tr name="tableColumn">
                <td>${c.columnName}</td>
                <td>${String(c.rule)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" name="changeTableColumn" id="${c.columnName}">修改</button>
                    <button class="btn btn-danger btn-sm" name="deleteTableColumn" id="${c.columnName}">刪除</button>
                </td>
            </tr>
        `);
        $(`tbody[name="tableColumn"]`).append(t);
        $(`button[name="changeTableColumn"][id="${c.columnName}"]`)[0].addEventListener("click", ()=>{
            alertDialog.dialog({
                type: 'prompt',
                title: '修改欄位',
                message: `請輸入新的欄位名稱`,
                inputType: 'text',
                defaultValue: c.columnName,
                customSetting: ``,
                callback: function(newName) {
                    if (newName)
                    {
                        alertDialog.dialog({
                            type: 'prompt',
                            title: '修改欄位',
                            message: `請輸入新的公式`,
                            inputType: 'text',
                            defaultValue: String(c.rule),
                            customSetting: ``,
                            callback: function(newRule) {
                                if (newRule)
                                {
                                    changeTableColumn(tableName, c.columnName, newRule, newName);
                                    showTableColumn(tableName);
                                }
                            }
                        });
                    }
                }
            });
        });
        $(`button[name="deleteTableColumn"][id="${c.columnName}"]`)[0].addEventListener("click", ()=>{
            alertDialog.confirm({
                title: `刪除 ${tableName} 的欄位`,
                message: `您確定要刪除欄位 ${c.columnName} 嗎?`,
                callback: (result) => {
                    if (result)
                    {
                        deleteTableColumn(tableName, c.columnName);
                        showTableColumn(tableName);
                    }
                }
            });
        });
    }

    console.log("---end showTableColumn()");
}

function outputTable(tableName)
{
    console.log("start outputTable()");

    $(`table[name=outputTable]`).remove();

    const dataSearch = JSON.parse(window.localStorage.getItem ("local_dataSearch")) || [];
    const t = dataSearch.find(x => x.tableName === tableName);
    const CsDatas = JSON.parse(window.localStorage.getItem ("local_CsDatas")) || [];
    let outputCompanies = [];
    try
    {
        if (t.filter)
        {
            for (let c of CsDatas)
            {
                if (doInputFunction(c, t.filter))
                {
                    outputCompanies.push(c);
                }
            }
        }
        else
        {
            outputCompanies = CsDatas;
        }
    }
    catch (e)
    {
        alertDialog.alert("計算失敗！過濾公式出錯");
        return;
    }

    try {
        if (t.sort)
        {
            outputCompanies.sort((a, b) => doInputFunction(b, t.sort) - doInputFunction(a, t.sort));
        }
    }
    catch (e)
    {
        alertDialog.alert("計算失敗！排序公式出錯");
        return;
    }

    let outputList = [];
    let debugColumnName = "";
    try
    {
        for (let c of outputCompanies)
        {
            let row = {};
            for (let column of t.column)
            {
                debugColumnName = column.columnName;
                row[column.columnName] = doInputFunction(c, column.rule);
            }
            outputList.push(row);
        }
    }
    catch (e)
    {
        alertDialog.alert(`計算失敗！欄位 ${debugColumnName} 公式出錯`);
        return;
    }


    let thead = "";
    for (let column of t.column)
    {
        thead += `<th style="max-width: 390px;">${column.columnName}</th>`;
    }
    const output = (`
        <table border="1" name="outputTable">
            <thead name="outputTable">
                ${thead}
            </thead>
            <tbody name="outputTable">
            </tbody>
        </table>
    `);
    ($(`p[name="outputTable"]`)).append(output);
    for (let row of outputList)
    {
        let outputRow = `<tr>`;
        for (let column of t.column)
        {
            outputRow += `<td style="max-width: 390px;">${row[column.columnName]}</td>`;
        }
        outputRow += `</tr>`;
        $(`tbody[name="outputTable"]`).append(outputRow);
    }

    console.log("end outputTable()");
}

function addTable(newTableName)
{
    const tableName = stripscript(newTableName);
    let dataSearch = JSON.parse(window.localStorage.getItem ("local_dataSearch")) || [];
    const newTable = {"tableName": tableName
        , "filter": null
        , "sort": null
        , "column": []};
    if (dataSearch.findIndex(t => t.tableName === tableName) === -1)
    {
        dataSearch.push(newTable);
    }
    else
    {
        dataSearch.find(t => t.tableName === tableName) = newTable;
    }
    window.localStorage.setItem ("local_dataSearch", JSON.stringify(dataSearch));

    const companyLink = '(`<a name="companyName" id="${ID}" href="/company/detail/${ID}">${name}</a>`)';
    addTableColumn(tableName, "公司名稱", companyLink);
}

function deleteTable(tableName)
{
    let dataSearch = JSON.parse(window.localStorage.getItem ("local_dataSearch")) || [];
    const i = dataSearch.findIndex(t => t.tableName === tableName);
    dataSearch.splice(i, 1);
    if (dataSearch.length > 0)
    {
        window.localStorage.setItem ("local_dataSearch", JSON.stringify(dataSearch));
    }
    else
    {
        window.localStorage.removeItem("local_dataSearch");
    }
}

function addTableSort(tableName, sort)
{
    let dataSearch = JSON.parse(window.localStorage.getItem ("local_dataSearch")) || [];
    (dataSearch.find(d => d.tableName === tableName)).sort = sort;
    window.localStorage.setItem ("local_dataSearch", JSON.stringify(dataSearch));
}

function deleteTableSort(tableName)
{
    let dataSearch = JSON.parse(window.localStorage.getItem ("local_dataSearch")) || [];
    (dataSearch.find(d => d.tableName === tableName)).sort = null;
    window.localStorage.setItem ("local_dataSearch", JSON.stringify(dataSearch));
}

function addTableFilter(tableName, filter)
{
    let dataSearch = JSON.parse(window.localStorage.getItem ("local_dataSearch")) || [];
    (dataSearch.find(d => d.tableName === tableName)).filter = filter;
    window.localStorage.setItem ("local_dataSearch", JSON.stringify(dataSearch));
}

function deleteTableFilter(tableName)
{
    let dataSearch = JSON.parse(window.localStorage.getItem ("local_dataSearch")) || [];
    (dataSearch.find(d => d.tableName === tableName)).filter = null;
    window.localStorage.setItem ("local_dataSearch", JSON.stringify(dataSearch));
}

function addTableColumn(tableName, columnName, rule)
{
    let dataSearch = JSON.parse(window.localStorage.getItem ("local_dataSearch")) || [];
    const originColumn = (dataSearch.find(d => d.tableName === tableName)).column;
    if (originColumn.findIndex(col => col.columnName === columnName) === -1)
    {
        (dataSearch.find(d => d.tableName === tableName)).column.push({"columnName": stripscript(columnName), "rule": rule});
        window.localStorage.setItem ("local_dataSearch", JSON.stringify(dataSearch));
    }
    else
    {
        changeTableColumn(tableName, columnName, rule, columnName);
    }
}

function changeTableColumn(tableName, columnName, rule, newColumnName)
{
    let dataSearch = JSON.parse(window.localStorage.getItem ("local_dataSearch")) || [];
    let tableColumn = (dataSearch.find(d => d.tableName === tableName)).column;
    (tableColumn.find(col => col.columnName === columnName)).rule = rule;
    (tableColumn.find(col => col.columnName === columnName)).columnName = stripscript(newColumnName);

    (dataSearch.find(d => d.tableName === tableName)).column = tableColumn;
    window.localStorage.setItem ("local_dataSearch", JSON.stringify(dataSearch));
}

function deleteTableColumn(tableName, columnName)
{
    let dataSearch = JSON.parse(window.localStorage.getItem ("local_dataSearch")) || [];
    const tableColumn = (dataSearch.find(d => d.tableName === tableName)).column;
    (dataSearch.find(d => d.tableName === tableName)).column.splice(tableColumn.findIndex(c => c.columnName === columnName), 1);
    window.localStorage.setItem ("local_dataSearch", JSON.stringify(dataSearch));
}

function doInputFunction(company, fun)
{
    const ID = company.companyID;
    const id = company.companyID;
    const name = company.companyName;
    const price = company.companyPrice;
    const stock = company.companyStock;
    const profit = company.companyProfit;
    const salary = company.companySalary;
    const nextSeasonSalary = company.companyNextSeasonSalary;
    const bonus = company.companyBonus;
    const employeesNumber = company.companyEmployeesNumber;
    const nextSeasonEmployeesNumber = company.companyNextSeasonEmployeesNumber;

    debugConsole("=====do=" + fun);

    return eval(fun);
}


function stripscript(s) {
    const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
    let rs = "";
    for (let i = 0; i < s.length; i++) {
        rs = rs+s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

/**************scriptVIP**************/
/*************************************/
/*************************************/
/**************Language***************/


var lan =  "";
lan = null !== window.localStorage.getItem ("PM_language") ? window.localStorage.getItem ("PM_language") : "tw";

// 目前的語言
let currentLanguage = window.localStorage.getItem("PM_language") || "tw";
// 翻譯米糕
function t(key) {
  return Dict[currentLanguage][key];
}

/*function ChangeLanguage(l){
    if(lan === l)return;
    lan = l;
    window.localStorage.setItem ("PM_language",l);
    window.location.reload();
}*/
const Dict = {
    tw:
    {
        totalProfitInThisPage: "本頁預計分紅：",
        updateDividendScript: "更新預估分紅腳本",
        userTotalAssets: "使用者股票總值：",
        userTotalProfit: "預估股票分紅：",
        userTotalCompanyNumber: "持有公司總數：",
        managerTotalSalary: "預估經理薪水：",
        employeeTotalBonus: "預估員工分紅：",
        userTotalTax: "預估本季稅金：",
        PEratio: "本益比排行",
        stockPEInfo: "本益比",
        stockManagerSalaryInfo: "經理薪水",
        stockProfitInfo: "現金股利",
        stockWorthInfo: "股票總值",
        userHaveStockInfo: "冰塊持股資訊總表",
        userTotalUsingCash: "買單現金總值：",
        userTotalSellingStock: "賣單股票總值：",
        mostStockDropDown: "最多持股公司",
    },
    en:
    {
        totalProfitInThisPage: "Total profit in this page :",
        updateDividendScript: "Update Dividend Script",
        userTotalAssets: "User stock worth：",
        userTotalProfit: "Estimated stock dividends：",
        userTotalCompanyNumber: "Hold the total number of companies：",
        managerTotalSalary: "Estimated manager salary：",
        employeeTotalBonus: "預估員工分紅：",
        userTotalTax: "Estimated tax for this season：",
        PEratio: "PE ratio",
        stockPEInfo: "PE",
        stockManagerSalaryInfo: "Manager salary",
        stockProfitInfo: "Dividend",
        stockWorthInfo: "Stock worth",
        userHaveStockInfo: "持股資訊總表",
        userTotalUsingCash: "買單現金總值：",
        userTotalSellingStock: "賣單股票總值：",
        mostStockDropDown: "最多持股公司",
    },
    jp:
    {
        totalProfitInThisPage: "本ページ利回り総額：",
        updateDividendScript: "更新預估分紅腳本",
        userTotalAssets: "使用者股票總值：",
        userTotalProfit: "預估股票分紅：",
        userTotalCompanyNumber: "持有公司總數：",
        managerTotalSalary: "預估經理薪水：",
        employeeTotalBonus: "預估員工分紅：",
        userTotalTax: "預估本季稅金：",
        PEratio: "本益比排行",
        stockPEInfo: "本益比",
        stockManagerSalaryInfo: "經理薪水",
        stockProfitInfo: "現金股利",
        stockWorthInfo: "股票總值",
        userHaveStockInfo: "持股資訊總表",
        userTotalUsingCash: "買單現金總值：",
        userTotalSellingStock: "賣單股票總值：",
        mostStockDropDown: "最多持股公司",
    },
    marstw:
    {
        totalProfitInThisPage: "這ㄘ可yee拿ㄉ$$：",
        updateDividendScript: "有★★★版",
        userTotalAssets: "股票ㄉ$$：",
        userTotalProfit: "這ㄘ會拿ㄉ$$：",
        userTotalCompanyNumber: "偶ㄐ間公ㄙ：",
        managerTotalSalary: "雞李ㄉ西水：",
        employeeTotalBonus: "預估員工分紅：",
        userTotalTax: "ㄋ要交ㄉ茄：",
        PEratio: "ㄅyee逼排行",
        stockPEInfo: "ㄅyee逼",
        stockManagerSalaryInfo: "ㄐ李溪水",
        stockProfitInfo: "會給ㄉ前",
        stockWorthInfo: "股票ㄓˊ",
        userHaveStockInfo: "持股資訊總表",
        userTotalUsingCash: "買單現金總值：",
        userTotalSellingStock: "賣單股票總值：",
        mostStockDropDown: "最多持股公司",
    }
};


/**************Language***************/
/*************************************/
