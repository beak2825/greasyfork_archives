// ==UserScript==
// @name         ACGN-stock營利統計外掛
// @namespace    http://tampermonkey.net/
// @version      4.99.99.04
// @description  隱藏著排他力量的分紅啊，請在我面前顯示你真正的面貌
// @author       SoftwareSing
// @match        http://acgn-stock.com/*
// @match        https://acgn-stock.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38852/ACGN-stock%E7%87%9F%E5%88%A9%E7%B5%B1%E8%A8%88%E5%A4%96%E6%8E%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/38852/ACGN-stock%E7%87%9F%E5%88%A9%E7%B5%B1%E8%A8%88%E5%A4%96%E6%8E%9B.meta.js
// ==/UserScript==

/* eslint-disable */

//I love Hatsune Miku.

//版本號為'主要版本號 + "." + 次要版本號 + 錯誤修正版本號，ex 8.31.39
//修復導致功能失效的錯誤或更新重大功能提升主要或次要版本號
//優化UI，優化效能，優化小錯誤更新錯誤版本號
//本腳本修改自 "ACGN股票系統每股營利外掛 2.200 by papago89"




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

//const {alertDialog} = require("./client/layout/alertDialog.js");

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

var othersScript = [];


/************GlobalVariable***********/
/*************************************/
/*************************************/
/*********ACGNListenerScript**********/

//本區監測事件搬運自"ACGN股票系統每股營利外掛 ver2.810"
//https://github.com/frozenmouse/acgn-stock-user-script/blob/master/acgn-stock.user.js


(function() {
    startEvent();

    setTimeout(startScriptVer5, 10);
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
    setTimeout(checkScriptVIPUpdateTime, 1500);
    setTimeout(checkVIPstate, 2000);
    setTimeout(checkScriptADUpdateTime, 2500);
    setTimeout(checkOthersScript, 2500);
    setTimeout(checkUserID, 3900);

    setTimeout(addShowVIPbutton, 3900);
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


    var seriousErrorVersion = 4.999901;
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
        window.localStorage.removeItem("localCompanies");

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
        var myStockRanked = myHoldStock;
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
                <th width="390px">&nbsp;&nbsp;公司名稱&nbsp;&nbsp;</th>
                <th>&nbsp;&nbsp;公司股價&nbsp;&nbsp;</th>
                <th>&nbsp;&nbsp;每股分紅&nbsp;&nbsp;</th>
                <th>&nbsp;&nbsp;持有股數&nbsp;&nbsp;</th>
                <th>&nbsp;&nbsp;持有比例&nbsp;&nbsp;</th>
                <th>&nbsp;&nbsp;股票總值&nbsp;&nbsp;</th>
                <th>&nbsp;&nbsp;預估分紅&nbsp;&nbsp;</th>
                <th>&nbsp;&nbsp;本益比&nbsp;&nbsp;</th>
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
    debugConsole("-----//如果是-1 下一步應該跳出本function");
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

        for (let k = 0 ; k < userStockInfo[userIndex].userCompany.length ; k++)
        {
            const companyID = userStockInfo[userIndex].userCompany[k].companyID;
            let price = 0;
            let earnPerShare = 0;
            let name = "error:404 not found";
            let release = 0;
            const hold = userStockInfo[userIndex].userCompany[k].userHold;

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
                    earnPerShare = Number(CsDatas[companyIndex].companyProfit * 0.8 / CsDatas[companyIndex].companyStock);
            }
            debugConsole(String(""));

            if ($(`tr[companyID="${companyID}"]`).length < 1)
            {
                $("#userHaveStockInfo_Table").append(`
                    <tr companyID="${companyID}">
                        <td title="companyID" width="390px">&nbsp; <a href="/company/detail/${companyID}">${name}</a> &nbsp;</td>
                        <td title="price">${price}</td>
                        <td title="earnPerShare">${earnPerShare.toFixed(2)}</td>
                        <td title="hold">${hold}</td>
                        <td title="holdPercentage">${(hold / release * 100).toFixed(2)}%</td>
                        <td title="stockWorth">${(price * hold)}</td>
                        <td title="dividend">${(earnPerShare * hold).toFixed(0)}</td>
                        <td title="PE">${(price / earnPerShare).toFixed(3)}</td>
                    </tr>
                `);
            }
            else
            {
                $(`tr[companyID="${companyID}"]`).find(`td[title="price"]`)[0].innerHTML = `&nbsp;${price}&nbsp;`;
                $(`tr[companyID="${companyID}"]`).find(`td[title="earnPerShare"]`)[0].innerHTML = `&nbsp;${earnPerShare.toFixed(2)}&nbsp;`;
                $(`tr[companyID="${companyID}"]`).find(`td[title="hold"]`)[0].innerHTML = `&nbsp;${hold}&nbsp;`;
                $(`tr[companyID="${companyID}"]`).find(`td[title="holdPercentage"]`)[0].innerHTML = `&nbsp;${(hold / release * 100).toFixed(2)} %&nbsp;`;
                $(`tr[companyID="${companyID}"]`).find(`td[title="stockWorth"]`)[0].innerHTML = `&nbsp;${(price * hold)}&nbsp;`;
                $(`tr[companyID="${companyID}"]`).find(`td[title="dividend"]`)[0].innerHTML = `&nbsp;${(earnPerShare * hold).toFixed(0)}&nbsp;`;
                $(`tr[companyID="${companyID}"]`).find(`td[title="PE"]`)[0].innerHTML = `&nbsp;${(price / earnPerShare).toFixed(3)}&nbsp;`;
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
        let a = dataSearch.find(t => t.tableName === tableName);
        a = newTable;
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
        userHaveStockInfo: "持股資訊總表",
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
/*************************************/
/*************************************/
/*************************************/
/*************************************/
/*************************************/
/***************5.00.00***************/

/* eslint-enable  */

function startScriptVer5() {
  const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
  if (localCompanies.length < 300) {
    window.localStorage.setItem('localCompanies', (testLocalCompanies));
  }
  const main = new MainController();
}


/*************StartScript*************/
/*************************************/
/*************************************/
/***************import****************/

const { FlowRouter } = require('meteor/kadira:flow-router');
const { getCurrentSeason, getInitialVoteTicketCount } = require('./db/dbSeason');
const { alertDialog } = require('./client/layout/alertDialog.js');

const { dbCompanies } = require('./db/dbCompanies.js');
const { dbEmployees } = require('./db/dbEmployees.js');
const { dbVips } = require('./db/dbVips.js');
const { dbDirectors } = require('./db/dbDirectors.js');
const { dbOrders } = require('./db/dbOrders.js');
const { dbUserOwnedProducts } = require('./db/dbUserOwnedProducts.js');

/***************import****************/
/*************************************/
/*************************************/
/**************function***************/

function earnPerShare(company) {
  let stocksProfitPercent = (1 - company.managerProfitPercent - 0.15);
  if (company.employeesNumber > 0) {
    stocksProfitPercent -= (company.bonus * 0.01);
  }

  return ((company.profit * stocksProfitPercent) / (company.release + company.vipBonusStocks));
}

function effectiveStocks(stock, vipLevel) {
  const { stockBonusFactor: vipBonusFactor } = Meteor.settings.public.vipParameters[vipLevel || 0];

  return (stock * vipBonusFactor);
}

/**************function***************/
/*************************************/
/*************************************/
/****************class****************/

class MainController {
  constructor() {
    this.loginUser = new LoginUser();
    this.serverType = 'normal';
    const currentServer = document.location.href;
    const serverTypeTable = [
      { type: /museum.acgn-stock.com/, typeName: 'museum' },
      { type: /test.acgn-stock.com/, typeName: 'test' }
    ];
    serverTypeTable.forEach(({ type, typeName }) => {
      if (currentServer.match(type)) {
        this.serverType = typeName;
      }
    });
    this.othersScript = [];

    this.companyListController = new CompanyListController(this.loginUser);
    this.companyDetailController = new CompanyDetailController(this.loginUser);
    this.accountInfoController = new AccountInfoController(this.loginUser);
  }
}

class ScriptVip {
  constructor(user) {
    this.user = user;
    this.products = [];

    const load = this.loadFromLocalstorage();
    if (! load) {
      this.updateToLocalstorage();
    }
  }

  updateToLocalstorage() {
    const localScriptVipProducts = JSON.parse(window.localStorage.getItem('localScriptVipProducts')) || [];
    const i = localScriptVipProducts.findIndex((x) => {
      return (x.userId === this.user.userId);
    });
    if (i !== -1) {
      localScriptVipProducts[i].products = this.products;
    }
    else {
      localScriptVipProducts.push({
        userId: this.user.userId,
        products: this.products
      });
    }
    window.localStorage.setItem('localScriptVipProducts', JSON.stringify(localScriptVipProducts));
  }
  loadFromLocalstorage() {
    const localScriptVipProducts = JSON.parse(window.localStorage.getItem('localScriptVipProducts')) || [];
    const data = localScriptVipProducts.find((x) => {
      return (x.userId === this.user.userId);
    });
    if (data !== undefined) {
      this.products = data.products;

      return true;
    }
    else {
      return false;
    }
  }

  vipLevel() {
    let point = 0;
    for (const product of this.products) {
      point += product.point * product.amount;
    }

    const vipLevelTable = [
      {level: 0, point: 390},
      {level: 1, point: Infinity}
    ];
    const { level } = vipLevelTable.find((v) => {
      return (point < v.point);
    });

    return level;
  }

  updateProducts() {
    this.loadFromLocalstorage();

    const serverUserOwnedProducts = dbUserOwnedProducts.find({ userId: this.user.userId}).fetch();
    let isChange = false;
    for (const p of serverUserOwnedProducts) {
      const i = this.products.findIndex((x) => {
        return (x.productId === p.productId);
      });
      if (i !== -1) {
        isChange = true;
        this.products[i].amount = p.amount;
      }
    }

    if (isChange) {
      this.updateToLocalstorage();
    }
  }
}

//監聽頁面，資料準備完成時執行event
//不應該直接呼叫，他應該被繼承
//使用例:
// class CompanyDetailController extends EventController {
//   constructor(user) {
//     super('CompanyDetailController', user);
//     this.templateListener(Template.companyDetailContentNormal, 'Template.companyDetailContentNormal', this.startEvent);
//     this.templateListener(Template.companyDetail, 'Template.companyDetail', this.startEvent2);
//   }
//   startEvent() {
//     console.log('companyDetailContentNormal success');
//     console.log(Meteor.connection._mongo_livedata_collections.employees.find().fetch());
//     console.log('');
//   }
//   startEvent2() {
//     console.log('companyDetail success');
//     console.log(Meteor.connection._mongo_livedata_collections.companies.find().fetch());
//     console.log('');
//   }
// }
class EventController {
  constructor(controllerName, user) {
    console.log(`create controller: ${controllerName}`);
    this.loginUser = user;
  }

  templateListener(template, templateName, callback) {
    template.onCreated(function() {
      const rIsDataReady = new ReactiveVar(false);
      this.autorun(() => {
        rIsDataReady.set(this.subscriptionsReady());
      });
      this.autorun(() => {
        if (rIsDataReady.get()) {
          console.log(`${templateName} loaded`);
          callback();
        }
        else {
          console.log(`${templateName} is loading`);
        }
      });
    });
  }
}

class View {
  constructor(name) {
    console.log(`create View: ${name}`);
  }

  createH2Info(options) {
    const name = options.name || 'defaultName';
    options.customSetting = (options.customSetting) || {};
    const customSetting = {
      left: options.customSetting.left || '',
      right: options.customSetting.right || ''
    };
    const leftText = options.leftText || '';
    const rightText = options.rightText || '';

    const r = $(`
      <div class='media border-grid-body' name='${name}'>
        <div class='col-6 text-right border-grid' name='${name}' id='h2Left'>
          <h2 name='${name}' id='h2Left' ${customSetting.left}>${leftText}</h2>
        </div>
        <div class='col-6 text-right border-grid' name='${name}' id='h2Right'>
          <h2 name='${name}' id='h2Right' ${customSetting.right}>${rightText}</h2>
        </div>
      </div>
    `);

    return r;
  }
  createTable(options) {
    const name = options.name || 'defaultName';
    options.customSetting = (options.customSetting) || {};
    const customSetting = {
      table: options.customSetting.table || '',
      tHead: options.customSetting.tHead || '',
      tBody: options.customSetting.tBody || ''
    };
    const tHead = options.tHead || [];
    const tBody = options.tBody || [];

    let head = '';
    head += `<tr>`;
    for (const h of tHead) {
      head += `<th name=${name} ${customSetting.tHead}>${h}</th>`;
    }
    head += `</tr>`;

    let body = '';
    for (const row of tBody) {
      body += `<tr>`;
      for (const column of row) {
        body += `<td name=${name} ${customSetting.tBody}>${column}</td>`;
      }
      body += `</tr>`;
    }

    const r = $(`
      <table name=${name} ${customSetting.table}>
        <thead name=${name}>
          ${head}
        </thead>
        <tbody name=${name}>
          ${body}
        </tbody>
      </table>
    `);

    return r;
  }
  createButton(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const size = options.size || 'btn-sm';
    const color = options.color || 'btn-info';
    const text = options.text || 'default';

    const r = $(`
      <button class='btn ${color} ${size}' name='${name}' ${customSetting}>${text}</button>
    `);

    return r;
  }
  createSelect(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';

    const r = $(`
      <select class='form-control' name='${name}' ${customSetting}>
      </select>
    `);

    return r;
  }
  createSelectOption(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const text = options.text || 'defaultText';

    const r = $(`
      <option name='${name}' value='${text}' ${customSetting}>${text}</option>
    `);

    return r;
  }
  createInput(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const defaultValue = options.defaultValue || '';
    const placeholder = options.placeholder || '';
    const type = options.type || 'text';

    const r = $(`
      <input class='form-control'
        name='${name}'
        type='${type}'
        placeholder='${placeholder}'
        value='${defaultValue}'
        ${customSetting}
      />
    `);

    return r;
  }
  createA(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const href = options.href ? `href='${options.href}'` : '';
    const target = options.target ? `target='${options.target}'` : '';
    const text = options.text || '';

    const r = $(`
      <a class='float-left'
        name='${name}'
        ${href}
        ${target}
        ${customSetting}
      >${text}</a>
    `);

    return r;
  }
}


class User {
  constructor(id) {
    console.log(`create user: ${id}`);
    this.userId = id;
    this.name = '';
    this.holdStocks = [];
    this.managers = [];
    this.employee = '';
    this.money = 0;
    this.ticket = 0;

    const load = this.loadFromSessionstorage();
    if (! load) {
      this.saveToSessionstorage();
    }
    console.log('');
  }

  saveToSessionstorage() {
    console.log(`---start saveToSessionstorage()`);

    const sessionUsers = JSON.parse(window.sessionStorage.getItem('sessionUsers')) || [];
    const i = sessionUsers.findIndex((x) => {
      return x.userId === this.userId;
    });
    if (i !== -1) {
      //將session裡的資料更新
      sessionUsers[i] = {
        userId: this.userId,
        holdStocks: this.holdStocks,
        managers: this.managers,
        employee: this.employee,
        money: this.money,
        ticket: this.ticket
      };
    }
    else {
      //之前session裡沒有user資料，將資料丟入
      sessionUsers.push({
        userId: this.userId,
        holdStocks: this.holdStocks,
        managers: this.managers,
        employee: this.employee,
        money: this.money,
        ticket: this.ticket
      });
    }

    window.sessionStorage.setItem('sessionUsers', JSON.stringify(sessionUsers));

    console.log(`---end saveToSessionstorage()`);
  }
  loadFromSessionstorage() {
    console.log(`---start loadFromSessionstorage()`);

    const sessionUsers = JSON.parse(window.sessionStorage.getItem('sessionUsers')) || [];
    const sUser = sessionUsers.find((x) => {
      return x.userId === this.userId;
    });
    if (sUser !== undefined) {
      this.holdStocks = sUser.holdStocks;
      this.managers = sUser.managers;
      this.employee = sUser.employee;
      this.money = sUser.money;
      this.ticket = sUser.ticket;

      console.log(`---end loadFromSessionstorage(): true`);

      return true;
    }
    else {
      console.log(`-----loadFromSessionstorage(): not found user: ${this.userId}`);
      console.log(`-----if is not in creating user, it may be a BUG`);
      console.log(`---end loadFromSessionstorage(): false`);

      return false;
    }
  }

  updateHoldStocks() {
    console.log(`---start updateHoldStocks()`);

    this.loadFromSessionstorage();

    const serverDirectors = dbDirectors.find({ userId: this.userId }).fetch();
    let isChange = false;
    for (const c of serverDirectors) {
      const i = this.holdStocks.findIndex((x) => {
        return x.companyId === c.companyId;
      });
      if (i !== -1) {
        if (this.holdStocks[i].stocks !== c.stocks) {
          isChange = true;
          this.holdStocks[i].stocks = c.stocks;
        }
      }
      else {
        isChange = true;
        this.holdStocks.push({companyId: c.companyId, stocks: c.stocks, vip: null});
      }
    }

    if (isChange) {
      this.saveToSessionstorage();
    }

    console.log(`---end updateHoldStocks()`);
  }
  updateVips() {
    console.log(`---start updateVips()`);

    this.loadFromSessionstorage();

    let isChange = false;
    const serverVips = dbVips.find({ userId: this.userId }).fetch();
    for (const serverVip of serverVips) {
      const i = this.holdStocks.findIndex((x) => {
        return (x.companyId === serverVip.companyId);
      });
      if (i !== -1) {
        if (this.holdStocks[i].vip !== serverVip.level) {
          isChange = true;
          this.holdStocks[i].vip = serverVip.level;
        }
      }
      else {
        isChange = true;
        this.holdStocks.push({companyId: serverVip.companyId, stocks: 0, vip: serverVip.level});
      }
    }

    if (isChange) {
      this.saveToSessionstorage();
    }

    console.log(`---end updateVips()`);
  }
  updateManagers() {
    console.log(`---start updateManagers()`);

    this.loadFromSessionstorage();

    const serverCompanies = dbCompanies.find({ manager: this.userId }).fetch();
    let isChange = false;
    for (const c of serverCompanies) {
      if (this.managers.find((x) => {
        return (x.companyId === c._id);
      }) === undefined) {
        isChange = true;
        this.managers.push({companyId: c._id});
      }
    }

    if (isChange) {
      this.saveToSessionstorage();
    }

    console.log(`---end updateManagers()`);
  }
  updateEmployee() {
    console.log(`---start updateEmployee()`);

    this.loadFromSessionstorage();

    const serverEmployees = dbEmployees.find({ userId: this.userId }).fetch();
    let isChange = false;
    for (const emp of serverEmployees) {
      if (emp.employed) {
        if (this.employee !== emp.companyId) {
          isChange = true;
          this.employee = emp.companyId;
        }
      }
    }

    if (isChange) {
      this.saveToSessionstorage();
    }

    console.log(`---end updateEmployee()`);
  }
  updateUser() {
    console.log(`---start updateUser()`);

    this.loadFromSessionstorage();

    let isChange = false;
    const serverUsers = Meteor.users.find({ _id: this.userId }).fetch();
    const serverUser = serverUsers.find((x) => {
      return (x._id === this.userId);
    });
    if (serverUser !== undefined) {
      if ((this.name !== serverUser.username) && (this.money !== serverUser.profile.money) && (this.ticket !== serverUser.profile.voteTickets)) {
        isChange = true;
        this.name = serverUser.username;
        this.money = serverUser.profile.money;
        this.ticket = serverUser.profile.voteTickets;
      }
    }

    if (isChange) {
      this.saveToSessionstorage();
    }

    console.log(`---end updateUser()`);
  }


  computeCompanyNumber() {
    console.log(`---start computeCompanyNumber()`);

    let number = 0;
    for (const c of this.holdStocks) {
      if (c.stocks > 0) {
        number += 1;
      }
    }

    console.log(`---end computeCompanyNumber(): ${number}`);

    return number;
  }
  computeAsset() {
    console.log(`---start computeAsset()`);

    let asset = 0;
    const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
    for (const c of this.holdStocks) {
      const companyData = localCompanies.find((x) => {
        return x.companyId === c.companyId;
      });
      if (companyData !== undefined) {
        asset += Number(companyData.price * c.stocks);
      }
      else {
        console.log(`-----computeAsset(): not find companyId: ${c.companyId}`);
      }
    }

    console.log(`---end computeAsset(): ${asset}`);

    return asset;
  }
  computeProfit() {
    console.log(`---start computeProfit()`);

    let profit = 0;
    const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
    for (const c of this.holdStocks) {
      const companyData = localCompanies.find((x) => {
        return x.companyId === c.companyId;
      });
      if (companyData !== undefined) {
        profit += Math.ceil(earnPerShare(companyData) * effectiveStocks(c.stocks, c.vip));
      }
      else {
        console.log(`-----computeProfit(): not find companyId: ${c.companyId}`);
      }
    }

    console.log(`---end computeProfit(): ${profit}`);

    return profit;
  }
  computeManagersProfit() {
    console.log(`---start computeManagersProfit()`);

    let managerProfit = 0;
    const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
    for (const c of this.managers) {
      const companyData = localCompanies.find((x) => {
        return x.companyId === c.companyId;
      });
      if (companyData !== undefined) {
        managerProfit += Math.ceil(companyData.profit * companyData.managerProfitPercent);
      }
      else {
        console.log(`-----computeManagersProfit(): not find companyId: ${c.companyId}`);
      }
    }

    console.log(`---end computeManagersProfit(): ${managerProfit}`);

    return managerProfit;
  }
  computeEmployeeBonus() {
    console.log(`---start computeEmployeeBonus()`);

    let bonus = 0;
    if (this.employee !== '') {
      const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
      const companyData = localCompanies.find((x) => {
        return x.companyId === this.employee;
      });
      if (companyData !== undefined) {
        if (companyData.employeesNumber !== 0) {
          const totalBonus = companyData.profit * companyData.bonus * 0.01;
          bonus = Math.floor(totalBonus / companyData.employeesNumber);
        }
      }
    }

    console.log(`---end computeEmployeeBonus(): ${bonus}`);

    return bonus;
  }
  computeProductVotingRewards() {
    console.log(`---start computeProductVotingRewards()`);

    let reward = 0;

    //計算系統推薦票回饋
    const { systemProductVotingReward } = Meteor.settings.public;
    const totalReward = systemProductVotingReward;
    const initialVoteTicketCount = getInitialVoteTicketCount(getCurrentSeason());
    const count = initialVoteTicketCount - this.ticket;
    reward += (count >= initialVoteTicketCount) ? totalReward : Math.ceil(totalReward * count / 100);

    //計算公司推薦票回饋
    if (this.employee !== '') {
      const { employeeProductVotingRewardFactor } = Meteor.settings.public;
      const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
      const companyData = localCompanies.find((x) => {
        return x.companyId === this.employee;
      });
      if (companyData !== undefined) {
        if (companyData.employeesNumber !== 0) {
          const baseReward = employeeProductVotingRewardFactor * companyData.profit;
          //因為沒辦法得知全部員工投票數，以其他所有員工都有投完票來計算
          const totalEmployeeVoteTickets = initialVoteTicketCount * (companyData.employeesNumber - 1) + count;
          reward += Math.ceil(baseReward * count / totalEmployeeVoteTickets);
        }
      }
    }

    console.log(`---end computeProductVotingRewards(): ${reward}`);

    return reward;
  }

  computeTotalWealth() {
    const totalWealth = this.money +
      this.computeAsset() + this.computeProfit() +
      this.computeManagersProfit() + this.computeEmployeeBonus() +
      this.computeProductVotingRewards();
    console.log(`---computeTotalWealth(): ${totalWealth}`);

    return totalWealth;
  }
  computeTax() {
    console.log(`---start computeTax()`);

    const totalWealth = this.computeTotalWealth();

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
      { asset: Infinity, rate: 0.60, adjustment: 4608300 }
    ];
    const { rate, adjustment } = taxRateTable.find((e) => {
      return (totalWealth < e.asset);
    });
    const tax = Math.ceil(totalWealth * rate - adjustment);

    console.log(`---end computeTax(): ${tax}`);

    return tax;
  }
}

class LoginUser extends User {
  constructor() {
    const id = Meteor.userId();
    console.log(`create LoginUser: ${id}`);
    super(id);
    this.orders = [];
    this.scriptVip = new ScriptVip(this);

    this.directorsCache = [];

    console.log('');
  }

  //可能是原本沒登入後來登入了，所以要寫入id，或是分身......
  changeLoginUser() {
    const id = Meteor.userId();
    console.log(`LoginUser: new ID: ${id}`);
    this.userId = id;
  }

  updateFullHoldStocks() {
    console.log(`---start updateFullHoldStocks()`);

    this.loadFromSessionstorage();

    const serverDirectors = dbDirectors.find({ userId: this.userId }).fetch();
    //避免多次不必要的重複寫入，檢查是否與快取的一模一樣
    if (JSON.stringify(serverDirectors) !== JSON.stringify(this.directorsCache)) {
      const oldHoldStocks = this.holdStocks;
      this.holdStocks = [];
      for (const c of serverDirectors) {
        const oldC = oldHoldStocks.find((x) => {
          return (x.companyId === c.companyId);
        });
        //從舊資料中獲取vip等級資訊，避免將vip資訊洗掉
        const vipLevel = (oldC !== undefined) ? oldC.vip : null;
        this.holdStocks.push({companyId: c.companyId, stocks: c.stocks, vip: vipLevel});
      }

      this.saveToSessionstorage();
      this.directorsCache = serverDirectors;
    }

    console.log(`---end updateFullHoldStocks()`);
  }

  updateOrders() {
    console.log(`---start updateOrders()`);

    this.loadFromSessionstorage();

    const serverOrders = dbOrders.find({ userId: this.userId }).fetch();
    if (JSON.stringify(this.orders) !== JSON.stringify(serverOrders)) {
      this.orders = serverOrders;
      this.saveToSessionstorage();
    }

    console.log(`---end updateOrders()`);
  }


  computeBuyOrdersMoney() {
    console.log(`---start computeBuyOrdersMoney()`);

    let money = 0;
    for (const order of this.orders) {
      if (order.orderType === '購入') {
        money += order.unitPrice * (order.amount - order.done);
      }
    }

    console.log(`---end computeBuyOrdersMoney(): ${money}`);

    return money;
  }

  computeSellOrdersAsset() {
    console.log(`---start computeSellOrdersAsset()`);

    let asset = 0;
    const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
    for (const order of this.orders) {
      if (order.orderType === '賣出') {
        const companyData = localCompanies.find((x) => {
          return (x.companyId === order.companyId);
        });
        //以參考價計算賣單股票價值, 如果找不到資料則用賣單價格
        const price = (companyData !== undefined) ? companyData.price : order.unitPrice;
        asset += price * (order.amount - order.done);
      }
    }

    console.log(`---end computeSellOrdersAsset(): ${asset}`);

    return asset;
  }

  //Override
  computeTotalWealth() {
    const totalWealth = super.computeTotalWealth() +
      this.computeBuyOrdersMoney() + this.computeSellOrdersAsset();

    return totalWealth;
  }
}


class Company {
  constructor(serverCompany) {
    this.companyId = serverCompany._id;
    this.name = serverCompany.companyName;

    this.chairman = serverCompany.chairman;
    this.manager = serverCompany.manager;

    this.grade = serverCompany.grade;
    this.capital = serverCompany.capital;
    this.price = serverCompany.listPrice;
    this.release = serverCompany.totalRelease;
    this.profit = serverCompany.profit;

    this.vipBonusStocks = 0; //外掛獨有參數
    this.managerProfitPercent = 0.05; //未來會有的

    this.salary = serverCompany.salary;
    this.nextSeasonSalary = serverCompany.nextSeasonSalary;
    this.bonus = serverCompany.seasonalBonusPercent;
    this.employeesNumber = 0;
    this.nextSeasonEmployeesNumber = 0;

    this.tags = serverCompany.tags;
    this.createdAt = serverCompany.createdAt.getTime();
  }

  updateWithDbemployees(serverEmployees) {
    console.log(`---start updateWithDbemployees()`);

    let employeesNumber = 0;
    let nextSeasonEmployeesNumber = 0;

    for (const emp of serverEmployees) {
      if ((emp.employed === true) && (emp.resigned === false)) {
        employeesNumber += 1;
      }
      else if ((emp.employed === false) && (emp.resigned === false)) {
        nextSeasonEmployeesNumber += 1;
      }
    }

    this.employeesNumber = employeesNumber;
    this.nextSeasonEmployeesNumber = nextSeasonEmployeesNumber;

    console.log(`---end updateWithDbemployees()`);
  }

  updateWithLocalcompanies(companyData) {
    this.vipBonusStocks = companyData.vipBonusStocks; //外掛獨有參數
    const page = FlowRouter.getRouteName();
    if (page !== 'companyDetail') {
      this.grade = companyData.grade;

      this.salary = companyData.salary;
      this.nextSeasonSalary = companyData.nextSeasonSalary;
      this.bonus = companyData.bonus;
      this.employeesNumber = companyData.employeesNumber;
      this.nextSeasonEmployeesNumber = companyData.nextSeasonEmployeesNumber;

      this.tags = companyData.tags;
    }
  }

  computePERatio() {
    return ((this.price * this.release) / (this.profit));
  }

  computePERatioWithVipSystem() {
    return ((this.price * (this.release + this.vipBonusStocks)) / (this.profit));
  }

  outputInfo() {
    return {
      companyId: this.companyId,
      name: this.name,
      chairman: this.chairman,
      manager: this.manager,

      grade: this.grade,
      capital: this.capital,
      price: this.price,
      release: this.release,
      profit: this.profit,

      vipBonusStocks: this.vipBonusStocks, //外掛獨有參數
      managerProfitPercent: this.managerProfitPercent,

      salary: this.salary,
      nextSeasonSalary: this.nextSeasonSalary,
      bonus: this.bonus,
      employeesNumber: this.employeesNumber,
      nextSeasonEmployeesNumber: this.nextSeasonEmployeesNumber,

      tags: this.tags,
      createdAt: this.createdAt
    };
  }
}

class Companies {
  constructor() {
    this.list = [];
    let serverCompanies;
    const page = FlowRouter.getRouteName();
    if (page === 'companyDetail') {
      const detailId = FlowRouter.getParam('companyId');
      serverCompanies = dbCompanies.find({ _id: detailId}).fetch();
    }
    else {
      serverCompanies = dbCompanies.find().fetch();
    }
    for (const serverCompany of serverCompanies) {
      const company = new Company(serverCompany);
      this.list.push(company);
    }
  }

  companyPatch() {
    const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
    this.list.forEach((company, i, list) => {
      const companyData = localCompanies.find((x) => {
        return (x.companyId === company.companyId);
      });
      if (companyData !== undefined) {
        list[i].updateWithLocalcompanies(companyData);
      }
      else {
        list[i].updateWithLocalcompanies({
          companyId: company.companyId,
          name: company.name,
          chairman: company.chairman,
          manager: company.manager,

          grade: 'D',
          capital: company.capital,
          price: company.price,
          release: company.release,
          profit: company.profit,

          vipBonusStocks: 0, //外掛獨有參數
          managerProfitPercent: 0.05,

          salary: 1000,
          nextSeasonSalary: 1000,
          bonus: 5,
          employeesNumber: 0,
          nextSeasonEmployeesNumber: 0,

          tags: [],
          createdAt: company.createdAt
        });
      }
    });
  }

  updateEmployeesInfo() {
    console.log(`---start updateEmployeesInfo()`);

    this.list.forEach((company, i, list) => {
      const serverEmployees = dbEmployees.find({ companyId: company.companyId }).fetch();
      list[i].updateWithDbemployees(serverEmployees);
    });

    console.log(`---end updateEmployeesInfo()`);
  }

  updateToLocalstorage() {
    const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
    for (const company of this.list) {
      const i = localCompanies.findIndex((x) => {
        return (x.companyId === company.companyId);
      });
      const inputData = company.outputInfo();
      if (i !== -1) {
        localCompanies[i] = inputData;
      }
      else {
        localCompanies.push(inputData);
      }
    }

    window.localStorage.setItem('localCompanies', JSON.stringify(localCompanies));
  }


  computeUserProfit(loginUser) {
    let userProfit = 0;
    for (const company of this.list) {
      const userHold = loginUser.holdStocks.find((x) => {
        return (x.companyId === company.companyId);
      });
      if (userHold !== undefined) {
        userProfit += earnPerShare(company.outputInfo()) * effectiveStocks(userHold.stocks, userHold.vip);
      }
    }

    return userProfit;
  }
}

/****************class****************/
/*************************************/
/*************************************/
/*************companyList*************/

class CompanyListController extends EventController {
  constructor(loginUser) {
    super('CompanyListController', loginUser);

    this.templateListener(Template.companyList, 'Template.companyList', () => {
      this.updateUserInfo();
      this.useCompaniesInfo();
    });
  }

  updateUserInfo() {
    this.loginUser.updateFullHoldStocks();
    this.loginUser.updateOrders();
  }

  useCompaniesInfo() {
    const companies = new Companies();
    companies.companyPatch();

    companies.updateToLocalstorage();
  }
}

/*************companyList*************/
/*************************************/
/*************************************/
/************companyDetail************/

class CompanyDetailController extends EventController {
  constructor(loginUser) {
    super('CompanyDetailController', loginUser);

    this.whoFirst = null;
    this.loaded = null;
    this.templateListener(Template.companyDetail, 'Template.companyDetail', () => {
      this.useCompaniesInfo();
    });
    this.templateListener(Template.companyDetailContentNormal, 'Template.companyDetailContentNormal', () => {
      this.useEmployeesInfo();
    });
  }

  useCompaniesInfo() {
    console.log(`start useCompaniesInfo()`);

    this.companies = new Companies();
    this.companies.companyPatch();

    const detailId = FlowRouter.getParam('companyId');
    if ((this.whoFirst === 'employees') && (this.loaded === detailId)) {
      //這個比較慢執行，employees資料已經載入完成了
      this.companies.updateEmployeesInfo();
      this.companies.updateToLocalstorage();
      this.whoFirst = null;
      this.loaded = null;
    }
    else {
      this.whoFirst = 'companies';
      this.loaded = detailId;
    }

    console.log(`end useCompaniesInfo()`);
  }

  useEmployeesInfo() {
    console.log(`start useEmployeesInfo`);

    const detailId = FlowRouter.getParam('companyId');
    if ((this.whoFirst === 'companies') && (this.loaded === detailId)) {
      //這個比較慢執行，companies已經建好了
      this.companies.updateEmployeesInfo();
      this.companies.updateToLocalstorage();
      this.whoFirst = null;
      this.loaded = null;
    }
    else {
      this.whoFirst = 'employees';
      this.loaded = detailId;
    }

    console.log(`end useEmployeesInfo()`);
  }
}

/************companyDetail************/
/*************************************/
/*************************************/
/*************accountInfo*************/

class AccountInfoController extends EventController {
  constructor(loginUser) {
    super('AccountInfoController', loginUser);
    this.accountInfoView = new AccountInfoView();

    this.user = null;
    this.userId = null;
    this.waitList = [];

    this.templateListener(Template.accountInfo, 'Template.accountInfo', () => {
      this.usersEvent();
    });
    this.templateListener(Template.managerTitleList, 'Template.managerTitleList', () => {
      this.managersEvent();
    });
    this.templateListener(Template.vipTitleList, 'Template.vipTitleList', () => {
      this.vipsEvent();
    });
    this.templateListener(Template.accountInfoOwnStockList, 'Template.accountInfoOwnStockList', () => {
      this.ownStocksEvent();
    });
  }

  usersEvent() {
    console.log(`start usersEvent()`);

    this.userId = FlowRouter.getParam('userId');
    if (this.userId === this.loginUser.userId) {
      this.user = this.loginUser;
    }
    else {
      this.user = new User(this.userId);
    }
    this.user.loadFromSessionstorage();
    this.user.updateUser();
    this.user.updateEmployee();


    //顯示資訊
    this.accountInfoView.displayHrLine();

    this.accountInfoView.displayCompanyNumber(this.user.computeCompanyNumber());
    this.accountInfoView.displayStocksAsset(this.user.computeAsset());
    if (this.user.userId === this.loginUser.userId) {
      this.accountInfoView.displaySellOrders(this.user.computeSellOrdersAsset());
      this.accountInfoView.displayBuyOrders(this.user.computeBuyOrdersMoney());
    }

    this.accountInfoView.displayStocksProfit(this.user.computeProfit());
    this.accountInfoView.displayManagersProfit(this.user.computeManagersProfit());
    this.accountInfoView.displayEmployeeBonus(this.user.computeEmployeeBonus());
    this.accountInfoView.displayVotingReward(this.user.computeProductVotingRewards());

    this.accountInfoView.displayTax(this.user.computeTax());

    //如果有在user資訊載好前就載入的其他資訊，會被丟進等待清單
    //以for迴圈完成清單內的任務
    for (const task of this.waitList) {
      if (task.userId === this.userId) {
        task.callback();
      }
    }
    this.waitList = [];

    console.log(`end usersEvent()`);
  }

  managersEvent() {
    console.log(`start managersEvent()`);

    const pageId = FlowRouter.getParam('userId');
    if (this.userId === pageId) {
      this.user.updateManagers();


      //顯示資訊
      this.accountInfoView.displayHrLine();
      this.accountInfoView.displayManagersProfit(this.user.computeManagersProfit());
      this.accountInfoView.displayTax(this.user.computeTax());
    }
    else {
      this.waitList.push({
        userId: pageId,
        callback: this.managersEvent
      });
    }

    console.log(`end managersEvent()`);
  }

  vipsEvent() {
    console.log(`start vipsEvent()`);

    const pageId = FlowRouter.getParam('userId');
    if (this.userId === pageId) {
      this.user.updateVips();


      //顯示資訊
      this.accountInfoView.displayHrLine();
      this.accountInfoView.displayStocksProfit(this.user.computeProfit());
      this.accountInfoView.displayTax(this.user.computeTax());
    }
    else {
      this.waitList.push({
        userId: pageId,
        callback: this.vipsEvent
      });
    }

    console.log(`end vipsEvent()`);
  }

  ownStocksEvent() {
    console.log(`start ownStocksEvent()`);

    const pageId = FlowRouter.getParam('userId');
    if (this.userId === pageId) {
      this.user.updateHoldStocks();


      //顯示資訊
      this.accountInfoView.displayHrLine();
      this.accountInfoView.displayCompanyNumber(this.user.computeCompanyNumber());
      this.accountInfoView.displayStocksAsset(this.user.computeAsset());
      this.accountInfoView.displayStocksProfit(this.user.computeProfit());
      this.accountInfoView.displayTax(this.user.computeTax());
    }
    else {
      this.waitList.push({
        userId: pageId,
        callback: this.ownStocksEvent
      });
    }

    console.log(`end ownStocksEvent()`);
  }
}

class AccountInfoView extends View {
  constructor() {
    super('AccountInfoView');

    this.resetDisplayList();
  }

  resetDisplayList() {
    this.displayList = {
      companyNumber: false,
      stocksAsset: false,
      sellOrders: false,
      buyOrders: false,
      hrStocks: false, //分隔線
      stocksProfit: false,
      managersProfit: false,
      employeeBonus: false,
      votingReward: false,
      hrProfit: false, //分隔線
      tax: false
    };
  }

  displayHrLine() {
    if (($(`hr[name='stocksLine']`).length < 1) && ($(`hr[name='profitLine']`).length < 1)) {
      $(`div[name='companyNumber']`).remove();
      $(`div[name='stocksAsset']`).remove();
      $(`div[name='sellOrders']`).remove();
      $(`div[name='buyOrders']`).remove();

      $(`div[name='stocksProfit']`).remove();
      $(`div[name='managersProfit']`).remove();
      $(`div[name='employeeBonus']`).remove();
      $(`div[name='votingReward']`).remove();

      $(`div[name='tax']`).remove();

      this.resetDisplayList();
    }

    if ($(`hr[name='stocksLine']`).length < 1) {
      const stocksLine = $(`<hr name='stocksLine' />`);
      const afterObject = ($(`h1[class='card-title']`)[0]);
      stocksLine.insertAfter(afterObject);
      this.displayList.hrStocks = stocksLine;
    }

    if ($(`hr[name='profitLine']`).length < 1) {
      const profitLine = $(`<hr name='profitLine' />`);
      const afterObject = this.displayList.hrStocks || ($(`h1[class='card-title']`)[0]);
      profitLine.insertAfter(afterObject);
      this.displayList.hrProfit = profitLine;
    }
  }

  displayCompanyNumber(companyNumber) {
    const displayObject = this.createH2Info({
      name: 'companyNumber',
      leftText: translation(['accountInfo', 'holdingStockCompaniesNumber']),
      rightText: `${companyNumber}`
    });

    $(`div[name='companyNumber']`).remove();
    const afterObject = $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.companyNumber = displayObject;
  }
  displayStocksAsset(stocksAsset) {
    const displayObject = this.createH2Info({
      name: 'stocksAsset',
      leftText: translation(['accountInfo', 'stocksAsset']),
      rightText: `$ ${stocksAsset}`
    });

    $(`div[name='stocksAsset']`).remove();
    const afterObject = this.displayList.companyNumber || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.stocksAsset = displayObject;
  }
  displaySellOrders(sellOrders) {
    const displayObject = this.createH2Info({
      name: 'sellOrders',
      leftText: translation(['accountInfo', 'usedInSellOrdersStocksAsset']),
      rightText: `$ ${sellOrders}`
    });

    $(`div[name='sellOrders']`).remove();
    const afterObject = this.displayList.stocksAsset || this.displayList.companyNumber || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.sellOrders = displayObject;
  }
  displayBuyOrders(buyOrders) {
    const displayObject = this.createH2Info({
      name: 'buyOrders',
      leftText: translation(['accountInfo', 'usedInBuyOrdersMoney']),
      rightText: `$ ${buyOrders}`
    });

    $(`div[name='buyOrders']`).remove();
    const afterObject = this.displayList.sellOrders || this.displayList.stocksAsset ||
      this.displayList.companyNumber || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.buyOrders = displayObject;
  }

  displayStocksProfit(stocksProfit) {
    const displayObject = this.createH2Info({
      name: 'stocksProfit',
      leftText: translation(['accountInfo', 'estimatedStockProfit']),
      rightText: `$ ${stocksProfit}`
    });

    $(`div[name='stocksProfit']`).remove();
    const afterObject = this.displayList.hrStocks || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.stocksProfit = displayObject;
  }
  displayManagersProfit(managersProfit) {
    const displayObject = this.createH2Info({
      name: 'managersProfit',
      leftText: translation(['accountInfo', 'estimatedManagerProfit']),
      rightText: `$ ${managersProfit}`
    });

    $(`div[name='managersProfit']`).remove();
    const afterObject = this.displayList.stocksProfit || this.displayList.hrStocks || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.managersProfit = displayObject;
  }
  displayEmployeeBonus(employeeBonus) {
    const displayObject = this.createH2Info({
      name: 'employeeBonus',
      leftText: translation(['accountInfo', 'estimatedEmployeeBonus']),
      rightText: `$ ${employeeBonus}`
    });

    $(`div[name='employeeBonus']`).remove();
    const afterObject = this.displayList.managersProfit || this.displayList.stocksProfit ||
      this.displayList.hrStocks || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.employeeBonus = displayObject;
  }
  displayVotingReward(votingReward) {
    const displayObject = this.createH2Info({
      name: 'votingReward',
      leftText: translation(['accountInfo', 'estimatedProductVotingRewards']),
      rightText: `$ ${votingReward}`
    });

    $(`div[name='votingReward']`).remove();
    const afterObject = this.displayList.employeeBonus || this.displayList.managersProfit ||
      this.displayList.stocksProfit || this.displayList.hrStocks || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.votingReward = displayObject;
  }

  displayTax(tax) {
    const displayObject = this.createH2Info({
      name: 'tax',
      leftText: translation(['accountInfo', 'estimatedTax']),
      rightText: `$ ${tax}`
    });

    $(`div[name='tax']`).remove();
    const afterObject = this.displayList.hrProfit || this.displayList.hrStocks || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.tax = displayObject;
  }
}

/*************accountInfo*************/
/*************************************/
/*************************************/
/**************Language***************/

function translation(target) {
  const language = 'tw';

  return (dict[language][target[0]][target[1]]);
}

const dict = {
  tw: {
    script: {
      updateScript: '更新外掛'
    },
    accountInfo: {
      estimatedTax: '預估稅金：',
      holdingStockCompaniesNumber: '持股公司總數：',
      stocksAsset: '股票總值：',
      usedInSellOrdersStocksAsset: '賣單股票總值：',
      usedInBuyOrdersMoney: '買單現金總值：',
      estimatedStockProfit: '預估股票分紅：',
      estimatedManagerProfit: '預估經理分紅：',
      estimatedEmployeeBonus: '預估員工分紅：',
      estimatedProductVotingRewards: '預估推薦票獎勵：'
    }
  },
  en: {
    script: {
      updateScript: 'update Script'
    },
    accountInfo: {
      estimatedTax: 'Estimated tax：',
      holdingStockCompaniesNumber: 'Holding stock companies number：',
      stocksAsset: 'Stocks asset：',
      usedInSellOrdersStocksAsset: 'Used in sell orders stocks asset：',
      usedInBuyOrdersMoney: 'Used in buy orders money：',
      estimatedStockProfit: 'Estimated stock profit：',
      estimatedManagerProfit: 'Estimated manager profit：',
      estimatedEmployeeBonus: 'Estimated employee profit：',
      estimatedProductVotingRewards: 'Estimated Product Voting Rewards：'
    }
  }
};

/* eslint-disable */
const testLocalCompanies = `[{"companyId":"Q2REyQmcGtbL7p29c","name":"CODE：002","chairman":"2L3Jxmg8GkBdX6TA4","manager":"A4rot7ZM8rmMzTKb4","grade":"A","capital":1063213,"price":6750,"release":1318,"profit":1012065.5,"vipBonusStocks":419.84999999999997,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":14,"nextSeasonEmployeesNumber":16,"tags":["CODE：002","02","2","ゼロツー","TRIGGER","DARLING in the FRANXX","ダーリン・イン・ザ・フランキス","Dārin In Za Furankisu","角","虎牙","人外","戶松遙","搭檔殺手"],"createdAt":1516028594545},{"companyId":"9TuMcyxEohm5qnKne","name":"薇爾莉特·伊芙加登","chairman":"6yGKydiCaQMCBXbCz","manager":"mY8T2wTrnRobydgxG","grade":"A","capital":1465619,"price":6702,"release":1524,"profit":2049326.45,"vipBonusStocks":307.4599999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":18,"nextSeasonEmployeesNumber":23,"tags":["薇爾莉特·伊芙加登","ヴァイオレット・エヴァーガーデン","紫羅蘭永恆花園","京都動畫","kyoto animation","石川由依","Violet Evergarden","打字機"],"createdAt":1515333822735},{"companyId":"Y6Sp3PFtQ3KPjPP2F","name":"惠惠","chairman":"3Fki3Wd8qCCxTdgoa","manager":"3Fki3Wd8qCCxTdgoa","grade":"A","capital":2771886,"price":6101,"release":2495,"profit":3787429.6999999993,"vipBonusStocks":425.63000000000017,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":44,"nextSeasonEmployeesNumber":41,"tags":["惠惠","めぐみん","為美好的世界獻上祝福！","この素晴らしい世界に祝福を!","內田真禮","高橋李依"],"createdAt":1515333762833},{"companyId":"NH2NhXHkpw8rTuQvx","name":"初音未來","chairman":"uXhGxu2ZLbKa2G7Ab","manager":"CWgfhqxbrJMxsknrb","grade":"A","capital":1639020,"price":6076,"release":1533,"profit":785734.5,"vipBonusStocks":284.15000000000003,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":15,"nextSeasonEmployeesNumber":17,"tags":["初音未來 / 初音ミク / Hatsune Miku","VOCALOID","角色主唱系列軟體","雙馬尾","蔥","Virtual Singer","164 / 203soundwork","40㍍P","八王子P","anemomania / ほぼ日P","cosMo(暴走P) / 黒猫アンティーク","DECO*27","doriko / きりたんP","HoneyWorks","ika","kz / livetune","Mitchie M","minato / 流星P","OneRoom / ジミーサムP","OSTER project","Samfree","Sasakure.UK / ささくれP","SHO / キセノンP","supercell / ryo","wowaka / 現実逃避P","日向電工","かいりきベア","うたたP","オワタP","乙P","きくお","黒うさP","ナユタン星人","ハチ","ひとしずくP","じん / 自然の敵P","デッドボールP / 死球P","ぽわぽわP / 椎名もた","ラマーズP / LamazeP","雄之助 / Yunosuke","ギガP / GigaP","marasy8","tilt-six","HarryP / はりーP","halyosy","malo","19's Sound Factory","くちばしP","Everyone, Creator"],"createdAt":1515334062722},{"companyId":"cm4RLgsm57yKRFAfR","name":"雛鶴愛","chairman":"dTdhNc7atEuc7pNyY","manager":"2MnixRrWRWFsYuqa9","grade":"A","capital":812221,"price":4700,"release":1402,"profit":609621.05,"vipBonusStocks":404.5199999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":6,"nextSeasonEmployeesNumber":8,"tags":["雛鶴愛","雛鶴 あい","Hinatsuru Ai","龍王的工作!","りゅうおうのおしごと!","The Ryuo's Work is Never Done!","白鳥士郎","しらび","日高裡菜","蘿王的工作!","呆毛","蘿莉","天才少女","雙馬尾","9歲","小學生","病嬌","黑化","摸頭殺","忠犬","人妻","天然黑","家事萬能","千金","入贅","貧乳","小學生真是太棒了","電臀","青眼白龍","羈押","特級廚師","賢慧","光源氏","十年計畫","童養婿","將棋","JS研","首席弟子","九頭龍八一","銀子阿姨","夜叉神天衣","こう……こう……こう……","師匠♡"],"createdAt":1515341394554},{"companyId":"7RTKMtJo7ZF95Y7HS","name":"雪之下雪乃","chairman":"3rHvAwqHNFcp9GyhS","manager":"FvfycqzbZv98meYN9","grade":"A","capital":981837,"price":4600,"release":1859,"profit":1068627.5999999999,"vipBonusStocks":481.7699999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":11,"nextSeasonEmployeesNumber":10,"tags":["果然我的青春戀愛喜劇搞錯了","果青","やはり俺の青春ラブコメはまちがっている","雪ノ下雪乃","雪之下雪乃"],"createdAt":1515334002718},{"companyId":"EvtaJc4n9sfdCY8Lu","name":"加藤惠","chairman":"7LioBhuS97eRnWjjf","manager":"7LioBhuS97eRnWjjf","grade":"A","capital":1515871,"price":4551,"release":1959,"profit":1887720,"vipBonusStocks":407.28000000000003,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":18,"nextSeasonEmployeesNumber":16,"tags":["加藤惠","加藤 恵","かとう めぐみ","不起眼女主角培育法","冴えない彼女の育てかた","kato megumi","路人女主的養成方法","聖人惠","メインヒロイン"],"createdAt":1515333822649},{"companyId":"fh9CSEggsLPp7xCJd","name":"赫蘿","chairman":"Xt3Jw3fnGoY37454c","manager":"Xt3Jw3fnGoY37454c","grade":"A","capital":820279,"price":3600,"release":1471,"profit":504985,"vipBonusStocks":405.09999999999997,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":9,"nextSeasonEmployeesNumber":8,"tags":["狼與香辛料","ホロ","賢狼赫蘿","赫蘿","狼と香辛料","狼與羊皮紙","狼と羊皮紙","Spice and Wolf","狼"],"createdAt":1515334242652},{"companyId":"L8FoZc3mL6miPsH8k","name":"伊莉雅","chairman":"xxPmXmrMEShmGp7gY","manager":"xxPmXmrMEShmGp7gY","grade":"A","capital":1318484,"price":3400,"release":2026,"profit":930524.1,"vipBonusStocks":461.1,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":11,"nextSeasonEmployeesNumber":12,"tags":["伊莉雅絲菲爾•馮•愛因茲貝倫","イリヤスフィール・フォン・アインツベルン","Fate/kaleid liner 魔法少女☆伊莉雅","fate/stay night","fate/grand order","Fate/kaleid liner プリズマ☆イリヤ","EZR","EZ雅"],"createdAt":1515333942717},{"companyId":"dFkzjKYkXaBdnMGmz","name":"夜叉神天衣","chairman":"W7PwXhStnmMBHxD9b","manager":"zQCNShSMTpajY5JPg","grade":"A","capital":1107635,"price":3400,"release":1811,"profit":809325,"vipBonusStocks":609.8700000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":5,"nextSeasonEmployeesNumber":7,"tags":["やしゃじん  あい","Yashajin Ai","天醬","黑長髮","りゅうおうのおしごと!","LOLI","小學生","女流棋士","將棋","夜叉神天衣","龍王的工作!","大小姐","傲嬌","佐倉綾音","蘿莉","9歲","ㄌㄌ"],"createdAt":1517371472743},{"companyId":"hDikaw9RNaFsnGmsN","name":"尼祿・克勞狄烏斯","chairman":"ZPx2oWpqP3Q5SMsWD","manager":"LqeYNy7zE5sEAo3DQ","grade":"A","capital":672009,"price":3217,"release":1837,"profit":1217411.5,"vipBonusStocks":729.2200000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":5,"nextSeasonEmployeesNumber":6,"tags":["Fate/Extra","Fate/EXTRA Last Encore","Fate/Grand Order","ネロ・クラウディウス","Nero Claudius","typemoon","尼祿・克勞狄烏斯","尼祿·克勞狄烏斯·凱撒·奧古斯都·日耳曼尼庫斯","ネロ・クラウディウス・カエサル・アウグストゥス・ゲルマニクス","Nero","Claudius","Caesar","Augustus","Germanicus","紅Saber","丹下櫻"],"createdAt":1515495840079},{"companyId":"kFtom7zBwgZPQzeFv","name":"高木","chairman":"cLWzGFDEZmz2GJgi2","manager":"YHp5eGeCrutrMwm8b","grade":"A","capital":704207,"price":3001,"release":1867,"profit":294218.35,"vipBonusStocks":288.76,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":3,"nextSeasonEmployeesNumber":1,"tags":["高木","高木同學","愛捉弄人的高木同學","からかい上手の高木さん","西片くん","高木さん"],"createdAt":1515335995794},{"companyId":"zqi6DEkyxyoJ2pQ6L","name":"依田芳乃","chairman":"zQCNShSMTpajY5JPg","manager":"zQCNShSMTpajY5JPg","grade":"D","capital":97792,"price":62,"release":1528,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["偶像大師","Idolm@ster","CGSS","16歲","依田 芳乃","よりた よしの","偶像大師 灰姑娘女孩","偶像","高田憂希","灰髮","Yorita Yoshino","346 production","Idolm@ster_Cinderella_Girls_Starlight_Stage","アイドルマスター シンデレラガールズ スターライトステージ","IDOLM@STER CINDERELLA GIRLS","超高校級幸運","自帶好運","和服","和風","廣播劇最長時間","SSR大師"],"createdAt":1519449555478},{"companyId":"nN6vGXinoKAmfsQew","name":"羅德尼(碧藍航線)","chairman":"9zgqJmrkArp5AqQvX","manager":"9zgqJmrkArp5AqQvX","grade":"D","capital":108736,"price":86,"release":1699,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["羅德尼","Rodney","HMS Rodney","ロドニー","AzurLane","アズールレーン","Azur Lane","艦B","納爾遜級","Nelson-class battleship","戰艦","碧藍航線"],"createdAt":1519444695370},{"companyId":"BG5yFazPy2H56zPHj","name":"川本明里","chairman":"Bkz5yqeHGAf7HrJNA","manager":"wa5LAfzQS46jkA3r7","grade":"D","capital":43690,"price":42,"release":1365,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["川本明里","川本あかり","Akari Kawamoto","茅野愛衣","3月的獅子","三月的獅子","March Comes in Like a Lion","羽海野千花","巨乳","愛醬大勝利～～～～【☆▽☆】","姐姐","3月のライオン"],"createdAt":1519429094782},{"companyId":"sxsTakatBcdxgbhwB","name":"赤城(碧藍航線)","chairman":"k4MBYKEzTfMdMshgz","manager":"P7A2S6b6pBhzvFHMP","grade":"D","capital":141440,"price":227,"release":1105,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["赤城","あかぎ","Akagi","金皮","重櫻","巨乳","アズールレーン","Azur Lane","艦Ｂ","航母","獸耳","病嬌","尾巴","姐姐","碧藍航線","紅瞳","棕髮","御姐"],"createdAt":1519423214708},{"companyId":"8LBCmEcc5KvTWkNRK","name":"Megpoid（GUMI）","chairman":"phcAQGMJTXBWYTdBC","manager":"MTdhno2mSjtmhNbpn","grade":"D","capital":84416,"price":64,"release":1319,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["メグッポイド","Megpoid","グミ","GUMI","4864","VOCALOID","中島愛","綠毛","綠髮","綠瞳","失戀女神","角色主唱系列軟體","護目鏡","紅蘿蔔"],"createdAt":1519409534418},{"companyId":"MLpS6rSgJ4vHKnYTQ","name":"宇佐美奈奈子","chairman":"D3rzjAkF7YTKAAqd4","manager":"D3rzjAkF7YTKAAqd4","grade":"D","capital":65408,"price":68,"release":1022,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["宇佐美奈奈子","宇佐美奈々子","なにゃこ","奈々子","普通女高中生要做當地偶像","當地偶像","普通の女子校生が【ろこどる】やってみた／ふつうのじょしこうせいがろこどるやってみた","ろこどる"],"createdAt":1519402214211},{"companyId":"vkWoqWZZiieWE9SbB","name":"白瀬咲耶","chairman":"bePkR6aWWFHFC4Pju","manager":"ee7z9C4q4pGyTcGNn","grade":"D","capital":160384,"price":234,"release":1253,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["白瀬咲耶","sakuya shirase","偶像大師","偶像大師閃耀色彩","The Idolm@ster: Shiny Colors","八巻 アンナ","しらせ さくや","L'Antica（アンティーカ）","アイドルマスターシャイニーカラーズ"],"createdAt":1519362853165},{"companyId":"73crgoBKGEQLYSprp","name":"古明地戀","chairman":"pZR69fp9DtX8QYEbB","manager":"pZR69fp9DtX8QYEbB","grade":"D","capital":168576,"price":119,"release":1317,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["東方","東方Project","Touhou Project","とうほうぷろじぇくと","古明地戀","古明地こいし","こめいじこいし","Komeiji Koishi","幻想鄉","ㄌㄌ","蘿莉","妹妹","短髮","帽子","妖怪","覺","無意識","心理學","讀心"],"createdAt":1519350012932},{"companyId":"rcCX4ZCqRXrpZweWc","name":"一志瑞希","chairman":"ZxxoWL5qHJrYG5jAF","manager":"YRh6w88YRhoDWsmdm","grade":"D","capital":40128,"price":35,"release":1254,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["一志瑞希","いっしみずき","雨戀","あめこい","黑長直","小倉結衣"],"createdAt":1519328772628},{"companyId":"c5rhanSrwre9PCgW3","name":"水無瀨小糸","chairman":"4sSxpwwwzZKbskCAA","manager":"zKANG9wcoYSqbTQHh","grade":"D","capital":82944,"price":46,"release":1296,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["水無瀨小糸","水無瀬 小糸（みなせ こいと）","無彩限のファントム・ワールド","京都動畫","無彩限的幻影世界"],"createdAt":1519316712480},{"companyId":"agYJXC7h2gxcGuvQe","name":"天院紅呼鈴","chairman":"7h9NHTPHpDeNKu9gv","manager":"7h9NHTPHpDeNKu9gv","grade":"D","capital":42897,"price":10,"release":1809,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["CxMxK note","天院紅呼鈴","てんいんこうこりん","看板娘","さり","てぃん子","天院子","亮亮子","貓耳","狐耳(?)","狐尾","同人誌","本子","ＣxＫ note","chiri"],"createdAt":1519307352375},{"companyId":"bPhw6fyG2yafFCBtY","name":"Aris（アリス）","chairman":"bh7yDRqxmkvxWPox2","manager":"bh7yDRqxmkvxWPox2","grade":"D","capital":132096,"price":80,"release":1032,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["我的妹妹哪有這麼可愛！   俺の妹がこんなに可愛いわけがない   Aris  アリス ClariS"],"createdAt":1519304172145},{"companyId":"4NbpKskxhmw2cc6Pj","name":"Clara（クララ）","chairman":"bh7yDRqxmkvxWPox2","manager":"bh7yDRqxmkvxWPox2","grade":"D","capital":138368,"price":62,"release":1081,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["我的妹妹哪有這麼可愛！","俺の妹がこんなに可愛いわけがない","Clara","クララ","ClariS"],"createdAt":1519304052143},{"companyId":"MmtHwAB5odri5NcEX","name":"AK-12(少女前線)","chairman":"P7A2S6b6pBhzvFHMP","manager":"P7A2S6b6pBhzvFHMP","grade":"D","capital":73472,"price":64,"release":1148,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["少女前線","少女前线","少前","Girls' Frontline","girls' frontline","AK-12","AK12","ak12","ak-12","白髮","銀髮","五星","粉紅瞳","御姐","巨乳","AR","姐姐","突擊步槍"],"createdAt":1519255870875},{"companyId":"JrzBbGxzjMipPPALv","name":"茶渡泰虎","chairman":"wa5LAfzQS46jkA3r7","manager":"wa5LAfzQS46jkA3r7","grade":"D","capital":30608,"price":26,"release":1913,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["茶渡泰虎","さどう やすとら","死神BLEACH(ブリーチ)"],"createdAt":1519243270641},{"companyId":"hxAT4t97iqRXEK2Si","name":"Гангут","chairman":"SHNgQuNfQYf6M7f4J","manager":"ysWH2DiKFG7gZWG5S","grade":"D","capital":101248,"price":148,"release":1582,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["Гангут","大響","艦隊Collection","艦隊これくしょん","甘古特","十月革命","(Октябрьская революцияOktyabrskaya Revolutsiya"],"createdAt":1519237630417},{"companyId":"TTBgsg9ScJQw68xMa","name":"巴德","chairman":"RqQivWo4eSnFrKJTX","manager":"RqQivWo4eSnFrKJTX","grade":"D","capital":72512,"price":65,"release":1133,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["巴德","bard","英雄聯盟","League of Legends","LoL","Riot Games","八德","米普","漂泊守望者"],"createdAt":1519226830109},{"companyId":"K3LamNzursCKCtqaH","name":"森下未散","chairman":"63Kf7fPYFHMpJhHLo","manager":"63Kf7fPYFHMpJhHLo","grade":"D","capital":74688,"price":73,"release":1167,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["戀愛選舉巧克力","森下未散","Galgame","もりした みちる","Morishita Michiru","恋と选挙とチョコレート","恋爱选举巧克力","恋と選挙とチョコレート","sprite","電擊G's magazine","月刊Comic電擊大王","AIC Build","森下 未散","戀愛與選舉與巧克力"],"createdAt":1519223590070},{"companyId":"rbwFxXmChiKmYnXYr","name":"諾艾爾","chairman":"f3dJJYSCYXn9FFS6z","manager":"YRh6w88YRhoDWsmdm","grade":"D","capital":166528,"price":129,"release":1301,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["諾艾爾","ノエル","天體運行式","天体のメソッド","水瀨祈","雙馬尾","天然呆","天體的秩序","諾艾露","天體的方式","Sora no Method"],"createdAt":1519217889710},{"companyId":"LEqnSgXdpJniZ5DSF","name":"天野遠子","chairman":"gqd8PKAnwCJsYs5SQ","manager":"NJfSL759DdzfsxsAX","grade":"D","capital":109440,"price":99,"release":1710,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["天野遠子","文學少女","文学少女","あまの とおこ","遠子學姐","吃書妖怪","三股辮","文藝社","大和撫子","花澤香菜","野村美月","竹岡美穗"],"createdAt":1519197008719},{"companyId":"s3rw5NBbEhiaqM5Fs","name":"南小鳥(南琴梨)","chairman":"phcAQGMJTXBWYTdBC","manager":"fufhWoPehboA46pEy","grade":"D","capital":382720,"price":453,"release":1495,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["LoveLive","ラブライブ","μ's","南ことり","南琴梨","南小鳥","(・8・)","Printemps","內田彩"],"createdAt":1519191908404},{"companyId":"zefTe5Kycuy5nveR4","name":"山吹沙綾","chairman":"fA23N6Dvv9qTJjRcw","manager":"fA23N6Dvv9qTJjRcw","grade":"D","capital":34074,"price":55,"release":1049,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":1,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["山吹沙綾","山吹 沙綾","Bangdream!","バンドリ!","Poppin'Party","少女樂團派對","邦邦"],"createdAt":1519187288354},{"companyId":"pdYpdHXd8kDKBcHzg","name":"姬島朱乃","chairman":"ZwoA3f9EPmiZv6SiT","manager":"ZwoA3f9EPmiZv6SiT","grade":"D","capital":94552,"price":132,"release":1471,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["姬島朱乃","姫島 朱乃","ひめじま あけの","雷之巫女","墮天使","惡魔高校D×D","ハイスクール・ディーディー"],"createdAt":1519187168356},{"companyId":"JtGxdWXS76JpPYknF","name":"羽山瑞希","chairman":"wa5LAfzQS46jkA3r7","manager":"wa5LAfzQS46jkA3r7","grade":"D","capital":52383,"price":17,"release":1638,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["羽山瑞希","羽山 ミズキ","ef - a fairy tale of the two","悠久之翼","雙馬尾","學妹","元氣","未來","大叔控"],"createdAt":1519164847857},{"companyId":"kQzBbkkQ3npSH57Qk","name":"厭戰(碧藍航線)","chairman":"g7HFqD8wp3yBL4oit","manager":"TSjMwuAxNvC9Lu5fE","grade":"D","capital":128640,"price":612,"release":1005,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["厭戰","碧藍航線","艦B","獸耳(偽)","髮耳","貧乳","合法蘿莉","老女士","老太ghmjntbe"],"createdAt":1519161487838},{"companyId":"PKev2W2ZHSLQuXmNm","name":"岡崎 汐","chairman":"SE2tLqhCaFa4SvxCs","manager":"NJfSL759DdzfsxsAX","grade":"D","capital":124608,"price":101,"release":1947,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["岡崎 汐","CLANNAD ～AFTER STORY～","CLANNAD","おかざきうしお","key社","汐醬","Okazaki Ushi"],"createdAt":1519153747672},{"companyId":"CjvDnaiLxXu5Ejsyt","name":"羽川翼","chairman":"3qGNnR7m4J4sBWLAj","manager":"F2csihJ3LBHA49HN6","grade":"D","capital":244992,"price":196,"release":1914,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["羽川","貓物語","化物語","羽川翼","物語","物語系列","はねかわ つばさ","翼貓","翼家族","翼虎","班長","長髮","短髮","黑髮","白髮","黑白相間髮","貓耳","巨乳"],"createdAt":1519136827395},{"companyId":"yBFsA6xdsY7v3t6jW","name":"司波達也","chairman":"ebJgRbZDLzZAHkx2m","manager":"mY8T2wTrnRobydgxG","grade":"D","capital":180352,"price":125,"release":1409,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["司波達也","しば たつや","魔法科高校的劣等生","魔法科高校の劣等生","The irregular at magic high school","まほうかこうこうのれっとうせい","大爺","達神","兄長大人","中村悠一","面癱","妹控","差生","裝逼","日本普通高中生","主角威能","主角光環","龍傲天","摩醯首羅","破壊神（ザ・デストロイ，The Destroy）","西爾弗（シルバー，silver）","大黑龍也","深雪"],"createdAt":1519135207380},{"companyId":"9rDzrMqNxRfkZE7SN","name":"市之瀨 莉佳","chairman":"Crkz9Q7kbnvnCQKhs","manager":"Crkz9Q7kbnvnCQKhs","grade":"D","capital":69632,"price":74,"release":1088,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["市之瀨 莉佳","市ノ瀬 莉佳","いちのせ りか","三代眞子","米澤圓","米澤 円","Ichinose Rika","蒼之彼方的四重奏","蒼の彼方のフォーリズム","sprite","高藤學園","福留島分校FC部","りかりか"],"createdAt":1519110257251},{"companyId":"x8E8JhBH3SMDPae8P","name":"阿爾巴(magi)","chairman":"4sSxpwwwzZKbskCAA","manager":"4sSxpwwwzZKbskCAA","grade":"D","capital":42464,"price":20,"release":1327,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["阿爾巴（アルバ） 魔奇少年magiマギ練玉艷（練玉艶（れん ぎょくえん））"],"createdAt":1519106777166},{"companyId":"rdiEEzwZuHQXi8rrx","name":"綾波(碧藍航線)","chairman":"k4MBYKEzTfMdMshgz","manager":"CM6o8gGPE8pjttGKo","grade":"D","capital":51296,"price":9,"release":1603,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["綾波","碧藍航線","アズールレーン","Azur Lane","艦B","あやなみ"],"createdAt":1519104137030},{"companyId":"PPMhCy5gP7juJcnpP","name":"酒井陽菜","chairman":"DLrBdxSRRLGdZTCW9","manager":"2jEdKoLxjooZYm3nv","grade":"D","capital":55968,"price":6,"release":2867,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["酒井陽菜","さかい ひな","森谷實園","架向星空之橋","星空へ架かる橋","feng","R-18"],"createdAt":1519095616741},{"companyId":"exRAaeCrq7yzahfkb","name":"日向伊吹","chairman":"DLrBdxSRRLGdZTCW9","manager":"2jEdKoLxjooZYm3nv","grade":"D","capital":74627,"price":6,"release":3249,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["日向伊吹","ひなた いぶき","feng","架向星空之橋","青葉林檎","星空へ架かる橋","Hinata Ibuki"],"createdAt":1519094836540},{"companyId":"MhavGEZFasHwpuFm2","name":"小原鞠莉","chairman":"uXTizY7MBTWfh6h5C","manager":"uXTizY7MBTWfh6h5C","grade":"D","capital":211840,"price":97,"release":1655,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":2,"tags":["小原鞠莉","LoveLive!Sunshine!!","おはら まり","Ohara Mari","大小姐","鈴木愛奈","浦之星女子學院","Aqours","Guilty Kiss","三年級","紫色","理事長","水團","ラブライブ! サンシャイン!!","ラブライブ"],"createdAt":1519091716375},{"companyId":"cuWtfGsi6FLfQ2MsF","name":"標槍(碧藍航線)","chairman":"N94kSByBcmXWcasp9","manager":"CM6o8gGPE8pjttGKo","grade":"D","capital":113088,"price":12,"release":1767,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["標槍","Javelin","ジャベリン","碧藍航線","アズールレーン","Azur Lane","艦B"],"createdAt":1519057875820},{"companyId":"Mu5kExYAGBMofK474","name":"新垣綾瀨","chairman":"bh7yDRqxmkvxWPox2","manager":"bh7yDRqxmkvxWPox2","grade":"D","capital":667648,"price":667,"release":1304,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["新垣綾瀨","俺妹","我的妹妹哪有這麼可愛！","俺の妹がこんなに可愛いわけがない","新垣 あやせ"],"createdAt":1519048995486},{"companyId":"rZXddTvpCGgWvHvZJ","name":"RFB(少女前線)","chairman":"CM6o8gGPE8pjttGKo","manager":"eE8xqPG4j2o5CLCGR","grade":"D","capital":206208,"price":101,"release":1611,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["少女前線","RFB","Girls' Frontline"],"createdAt":1519046655189},{"companyId":"ogJfCLg6XMANHtaBX","name":"莉雅絲·吉蒙里","chairman":"f4MZ8vNRqpXoxyGgF","manager":"f4MZ8vNRqpXoxyGgF","grade":"D","capital":245632,"price":210,"release":1919,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["莉雅絲·吉蒙里","莉雅絲","リアス・グレモリ","惡魔高校","紅髮","部長","惡魔","惡魔高校DXD","ハイスクール・ディーディー"],"createdAt":1519020492746},{"companyId":"qgm9DgYZf2RBM7Gur","name":"羽賀那","chairman":"2HFha7H4TviS3Pbra","manager":"2HFha7H4TviS3Pbra","grade":"D","capital":117376,"price":87,"release":1834,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["world end economica","WEE","ハガナ","はがな","安娜 賀格","羽賀那","月界金融末世錄"],"createdAt":1519015032633},{"companyId":"2HrybNTjqPyEaFrQw","name":"絢瀨繪里","chairman":"TcYn9NBmqQbd52Rd6","manager":"uXTizY7MBTWfh6h5C","grade":"D","capital":407552,"price":324,"release":1592,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":2,"tags":["絢瀨繪里","あやせ えり","LoveLive","BiBi","μ's","學生會長","姊姊","傲嬌","金髮","藍眼","Хорошо","南條愛乃","elichika","KKE","繪希花園","三年級","國立音乃木坂學院","ラブライブ"],"createdAt":1519014612650},{"companyId":"TtsNXhLByG4wRrNrF","name":"桐須真冬","chairman":"n3P3iqse6vQpGztFa","manager":"WBh6abvPLjkBhus9T","grade":"D","capital":425984,"price":585,"release":1664,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":3,"tags":["桐須真冬","桐須 真冬","我們無法一起學習","我們真的學不來！","ぼくたちは勉強ができない","老師"],"createdAt":1519012992222},{"companyId":"ukCQvFDPBmqpTLXjR","name":"蕾姬","chairman":"sSy4gwNpDwQqhDf5A","manager":"sSy4gwNpDwQqhDf5A","grade":"D","capital":446326,"price":320,"release":1741,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["蕾姬","レキ","Reki","緋彈的亞莉亞","緋弾のアリア","天才少女","制服","黑絲","眼鏡","呆毛","無口","貧乳","三無","狙擊科","巴斯克維爾小隊"],"createdAt":1518998350740},{"companyId":"6SnzwHmdCrAmWvtbt","name":"霧嶋董香","chairman":"sALMcpm2HSWCsaqrG","manager":"sALMcpm2HSWCsaqrG","grade":"D","capital":207284,"price":63,"release":2113,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["雾島董香","霧嶋 董香","きりしま とうか","トーキョーグール","東京喰種","re","兔子","Tokyo Ghoul","東京食屍鬼","東京喰種トーキョーグール Re","東京喰種 : re"],"createdAt":1518979450271},{"companyId":"yHcdwvJvMmotsDJtJ","name":"賣岔","chairman":"Amk6FSNzFqR7RmM3D","manager":"Amk6FSNzFqR7RmM3D","grade":"D","capital":32561,"price":49,"release":1017,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["賣岔","動物方城市","黑美洲豹","獸人","Renato Manchas","Mr. Manchas","Zootopia"],"createdAt":1518968109749},{"companyId":"bCk5d47M5p4HudGEK","name":"巧克力 (鈴鐺貓、鈴鐺子、數碼子)","chairman":"7h9NHTPHpDeNKu9gv","manager":"5yc4uqEmrauzHKGKH","grade":"D","capital":64074,"price":30,"release":1993,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["巧克力","鈴鐺貓","鈴鐺子","數碼子","でじこ","ショコラ","デ・ジ・キャラット","Di Gi Charat","DiGi鈴鐺貓","滴骰孖妹","鈴鐺貓娘","叮噹小魔女","貓耳","蘿莉","真田麻美","明坂聰美"],"createdAt":1518963489586},{"companyId":"uwa7Jo2sMAWN3nhCt","name":"佩絲特","chairman":"NacYGNofcuWW3Fgh2","manager":"TCAS5pLc6zaeFLEfQ","grade":"D","capital":582144,"price":804,"release":1137,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":2,"tags":["佩絲特","黑死病魔王","黑死病","魔王","問題兒童都來自異世界？","もんだいじたちがいせかいからくるそうですよ","問題児たちが異世界から来るそうですよ？","MondaiJi-tachi ga Isekai Kara Kuru Soudesuyo?","ペスト","Pest","黑死斑魔王","黑死斑","八千萬死者的靈群","黑死斑神子","黒死斑の御子","ブラック・パーチャー","黑死斑死神"],"createdAt":1518962829359},{"companyId":"FvNch5fNds4ycLLRK","name":"千川千尋","chairman":"5R5jxqqr3MqBCLJFc","manager":"NJfSL759DdzfsxsAX","grade":"D","capital":121920,"price":85,"release":1905,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["ちひろ","千川","灰姑娘","女孩","偶像大師灰姑娘","偶像大師灰姑娘女孩","佐藤利奈","利奈","Starlight","Stage","chihiro","senkawa","tihiro","千尋","アイドルマスターシンデレラガールズ","千川千尋"],"createdAt":1518962529356},{"companyId":"5SLr3ZoT3DEj5mMvX","name":"山城(碧藍航線)","chairman":"TSjMwuAxNvC9Lu5fE","manager":"TSjMwuAxNvC9Lu5fE","grade":"B","capital":128128,"price":112,"release":2002,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["山城","碧藍航線","艦B","獸耳","貓耳","和服","巫女","側乳","過膝襪","絕對領域"],"createdAt":1518918487576},{"companyId":"vuwhwtBncyLrhFXFh","name":"希露菲葉特·格雷拉特","chairman":"4sSxpwwwzZKbskCAA","manager":"4sSxpwwwzZKbskCAA","grade":"C","capital":50984,"price":19,"release":1591,"profit":54746.75,"vipBonusStocks":750,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["《無職轉生～到了異世界就拿出真本事～》（無職転生 異世界行ったら本気だす）","希露菲葉特·格雷拉特（シルフィエット・グレイラット）"],"createdAt":1518917767312},{"companyId":"zAzayLX8zXgRMPQGL","name":"斯洛卡伊","chairman":"cHmGTjDDRyEufyj7T","manager":"C9hSzoTBMbTEFeDAv","grade":"C","capital":60640,"price":46,"release":1895,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["斯洛卡伊","教皇","機動戰隊","Hanser","机动战队"],"createdAt":1518900307025},{"companyId":"afpg7FnHuGhq3k4p4","name":"メイ・アマミヤ","chairman":"7h9NHTPHpDeNKu9gv","manager":"7h9NHTPHpDeNKu9gv","grade":"B","capital":128348,"price":38,"release":2251,"profit":112536.35,"vipBonusStocks":1242,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["Ｍｅｉ・Ａｍａｍｉｙａ","P19","practice","MOFU~MOFU~","もふもふな放課後","いんふぃにてぃもふりてぃ","SELECT","看板娘","獸耳娘","ミミ","狐狸","狐耳","メイ・アマミヤ"],"createdAt":1518891306825},{"companyId":"FQvYFYiyjMjiNn4f2","name":"鍵村葉月","chairman":"8KBB5Pqk2zpZ3WYMh","manager":"cMWCrczoWMpiA3G6q","grade":"B","capital":110272,"price":147,"release":1723,"profit":57430.899999999994,"vipBonusStocks":296,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["かぎむら はづき","鍵村葉月","童話魔法使","原書·原書使","灰姑娘","鍵村 葉月","楠木ともり"],"createdAt":1518886986766},{"companyId":"wdgCirfQxtqLzmDGQ","name":"射命丸文","chairman":"Cq5f2SkJgP6gD8duZ","manager":"Cq5f2SkJgP6gD8duZ","grade":"B","capital":102592,"price":120,"release":1603,"profit":20721,"vipBonusStocks":62.15000000000006,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":4,"tags":["しゃめいまる‧あや","射命丸文","東方Project","Touhou Project","とうほうプロジェクト","天狗","文文","風神少女","記者","Shameimaru Aya"],"createdAt":1518840385858},{"companyId":"tboLfd6rDDDB3vSPQ","name":"關根唯","chairman":"pdKZNuvYYY4dZ3yzL","manager":"pdKZNuvYYY4dZ3yzL","grade":"D","capital":20656,"price":10,"release":1291,"profit":10603.5,"vipBonusStocks":53.68000000000009,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["關根唯","関根唯","像素戀愛","どとこい"],"createdAt":1518839185766},{"companyId":"8amttHustwK6veCTR","name":"長春(碧藍航線)","chairman":"TSjMwuAxNvC9Lu5fE","manager":"TSjMwuAxNvC9Lu5fE","grade":"B","capital":99520,"price":128,"release":1555,"profit":190036.8,"vipBonusStocks":1027.2,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["長春","碧藍航線","艦B","白虎","驅逐","長筒靴","白髮","粉瞳","東煌","獸耳(偽)","小白虎","布偶裝"],"createdAt":1518831685564},{"companyId":"283WAjTzpWFsxcQ9m","name":"夏目美緒","chairman":"Zoxst2T8hPpPmP9yu","manager":"Crkz9Q7kbnvnCQKhs","grade":"B","capital":120500,"price":90,"release":1877,"profit":135883.6,"vipBonusStocks":824.92,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["夏目美緒","鴨志田一","比村奇石","Just Because!","ジャストビコーズ！"],"createdAt":1518825205448},{"companyId":"bpkKYsCCwFGd7ZriZ","name":"賽米拉米斯(Fate/Grand Order)","chairman":"y3A9xyFXCAgvKidfq","manager":"y3A9xyFXCAgvKidfq","grade":"B","capital":113984,"price":130,"release":1781,"profit":62029.6,"vipBonusStocks":633.08,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["賽米拉米斯","セミラミス","Semiramis","暗殺者","紅之Assassin","亞述女帝","人類最古的毒殺者","毒婦","蟬大人","黑髮","金瞳","巨乳","聲優：真堂圭","Fate/Apocrypha","Fate/Grand Order","命運/外傳","命運/冠位指定"],"createdAt":1518821905403},{"companyId":"GCNWJJsDrBgS7PgdP","name":"琳芙斯 ‧ 艾茵斯","chairman":"zncBJmofvowuBF6T7","manager":"n3P3iqse6vQpGztFa","grade":"C","capital":85275,"price":19,"release":2768,"profit":51585.5,"vipBonusStocks":189.25,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["琳芙斯 ‧ 艾茵斯","リインフォース・アインス","夜天的魔導書的意志","闇の書の意志","小林沙苗","魔法少女奈葉","魔法少女リリカルなのは","大琳","リインフォース"],"createdAt":1518821605402},{"companyId":"6tAND7xYHWnXHsvwd","name":"キュアアンジュ","chairman":"3Fki3Wd8qCCxTdgoa","manager":"3Fki3Wd8qCCxTdgoa","grade":"D","capital":112612,"price":156,"release":1768,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["Cure Ange","キュアアンジュ","薬師寺さあや(やくしじー)","藥師寺紗綾","本泉莉奈","HUGっと!プリキュア","はぐっと!プリキュア","擁抱！光之美少女","魔法少女","precure","Precure","プリキュア","育兒","母性","蘿莉","可愛","萌","天使"],"createdAt":1518813085266},{"companyId":"Br8FAr3WtfsQJwQex","name":"北方棲姬","chairman":"2L3Jxmg8GkBdX6TA4","manager":"2L3Jxmg8GkBdX6TA4","grade":"A","capital":278272,"price":411,"release":1087,"profit":189833,"vipBonusStocks":335.75,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["北方棲姬","艦これ","艦隊これくしょん","艦隊收藏","ほっぽうせいき","ほっぽちゃん","小北棲","北方醬","幼塞","艦隊Collection"],"createdAt":1518809665225},{"companyId":"Y24KDDEkX78shFxjq","name":"アキ・アマミヤ","chairman":"7h9NHTPHpDeNKu9gv","manager":"7h9NHTPHpDeNKu9gv","grade":"B","capital":110034,"price":24,"release":2557,"profit":106059.65,"vipBonusStocks":1295.15,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["アキ・アマミヤ","Ａｋｉ・Ａｍａｍｉｙａ","p19","看板娘","狐狸","狐耳","ミミ","もふもふな放課後","SELECT","いんふぃにてぃもふりてぃ","獸耳娘","practice","MOFU~MOFU~"],"createdAt":1518799045010},{"companyId":"gP2yyBe3JumPn3o5Z","name":"G41","chairman":"sdPvxRzMmR9C5Bs4n","manager":"sdPvxRzMmR9C5Bs4n","grade":"A","capital":285184,"price":256,"release":1114,"profit":543237.8,"vipBonusStocks":522,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["少女前線","Girls' Frontline","Gewehr 41","小狐狸","釘宮理惠","AR","04:05:00","蘿莉","貧乳","異色瞳","獸耳蘿","★★★★★","純白獸耳loli人棍工口暗示半透明白紗","最 關 鍵 的 一 點 是 我 也 不 知 道 是 貓 是 狗 是 狐 狸","233333333333333333333333333333"],"createdAt":1518794424924},{"companyId":"WtJavvff89k78ud4i","name":"史萊姆(在異世界的新生活)","chairman":"Pd4F8M59EPWRLiX8r","manager":"Pd4F8M59EPWRLiX8r","grade":"D","capital":5472,"price":6,"release":1368,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["史萊姆(在異世界的新生活)","XXGB","李雪娜"],"createdAt":1518744503513},{"companyId":"8DxbcBg8gZ8goNasb","name":"真壁瑞希","chairman":"SE2tLqhCaFa4SvxCs","manager":"SE2tLqhCaFa4SvxCs","grade":"B","capital":73280,"price":100,"release":1145,"profit":33620.299999999996,"vipBonusStocks":592,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["idolmaster","偶像大師","million live","MLTD","偶像大師 百萬LIVE!","アイドルマスター","ミリオンライブ","idolm@ster","撲克臉","乙女ストーム！","765","阿部里果","真壁瑞希","Makabe Mizuki","poker"],"createdAt":1518743363499},{"companyId":"686hmWBmZB9C7tmcJ","name":"巴御前（Fate/Grand Order）","chairman":"ZwoA3f9EPmiZv6SiT","manager":"ZwoA3f9EPmiZv6SiT","grade":"A","capital":147944,"price":250,"release":1146,"profit":67130,"vipBonusStocks":389,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["アーチャー・インフェルノ","Archer·地獄","Fate/Grand Order","英靈劍豪七番勝負","Archer","Archer Inferno","金元壽子","鬼","Gamer Inferno","怪力女"],"createdAt":1518742823499},{"companyId":"4yWsDTaMjQfsnJiqQ","name":"天江衣","chairman":"TCAS5pLc6zaeFLEfQ","manager":"TCAS5pLc6zaeFLEfQ","grade":"A","capital":302080,"price":382,"release":1180,"profit":105190.40000000001,"vipBonusStocks":432.45,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["天江衣","海底撈月","咲-saki-","天才麻將少女","Amae Koromo","あまえ ころも"],"createdAt":1518713242664},{"companyId":"eeTb6S5bAkf5QuDsP","name":"二見瑛理子","chairman":"sdPvxRzMmR9C5Bs4n","manager":"3Fki3Wd8qCCxTdgoa","grade":"D","capital":23328,"price":24,"release":1458,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["君吻","キミキス","二見瑛理子","ふたみ　えりこ"],"createdAt":1518701722461},{"companyId":"atrJrSQ3dJvHf4fpa","name":"獨角獸查理","chairman":"WXCjG8vj4eR6vQLGk","manager":"WXCjG8vj4eR6vQLGk","grade":"D","capital":23913,"price":15,"release":2199,"profit":12000,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["獨角獸查理","Charlie the Unicorn","Charlie","查理"],"createdAt":1518672441612},{"companyId":"uNZJQ8Mqk7bLMGzHL","name":"雨宮優子","chairman":"n3P3iqse6vQpGztFa","manager":"bpGj8GYeSWzph4eCB","grade":"C","capital":49516,"price":35,"release":1547,"profit":63044.3,"vipBonusStocks":230.05,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["ef - a fairy tale of the two","ef - a tale of memories","ef - a tale of melodies","悠久之翼","雨宮優子"],"createdAt":1518669081577},{"companyId":"w2uyJugkrNo7HLb2w","name":"桃喰綺羅莉","chairman":"mY8T2wTrnRobydgxG","manager":"mBcdsnhj5By4ZmKfG","grade":"C","capital":34400,"price":45,"release":1075,"profit":3896,"vipBonusStocks":6.220000000000027,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["桃喰綺羅莉","狂賭之淵","賭ケグルイ","Kakegurui","かケグルイ","澤城美雪","ももばみ きらり"],"createdAt":1518664161521},{"companyId":"7ypz53EAFZEtrK5jD","name":"初瀨伊綱","chairman":"SE2tLqhCaFa4SvxCs","manager":"sALMcpm2HSWCsaqrG","grade":"A","capital":489984,"price":540,"release":1914,"profit":232405.4,"vipBonusStocks":290.09000000000003,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["初瀨伊綱","Hatsuse Izuna","初瀬いづな","はつせ いづな","No Game No Life","遊戲人生","ノーゲーム・ノーライフ","獸人種","Werebeast","です","的說","血壞","幼女","獸耳","尾巴","口癖","澤城美雪","8歲","黑瞳"],"createdAt":1518661161307},{"companyId":"oTidQ6BxcDkYNbC3z","name":"小伊","chairman":"86jxbGK5QZBEHW6m9","manager":"48d659TEjDFZ74b3B","grade":"D","capital":27376,"price":37,"release":1711,"profit":2560,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["小木乃伊到我家","ミイラの飼い方","空木翔","小伊","ミーくん","木乃伊","木乃伊的飼養方法"],"createdAt":1518638900635},{"companyId":"dHpv44Fh2Mj9i9Rsi","name":"黑暗界(碧藍航線)","chairman":"d7sxzLyLwcG22AMQL","manager":"CM6o8gGPE8pjttGKo","grade":"B","capital":141081,"price":11,"release":5897,"profit":153982.19999999998,"vipBonusStocks":3587.06,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["黑暗界","エレバス","Erebus","厄瑞玻斯","アズールレーン","Azur Lane","碧藍航線","艦B"],"createdAt":1518634940576},{"companyId":"H6TRWnWsqhCtsZKiu","name":"小圓 (果然在美食街尋求邂逅一定是哪裡搞錯了)","chairman":"CWgfhqxbrJMxsknrb","manager":"CWgfhqxbrJMxsknrb","grade":"A","capital":178176,"price":160,"release":1392,"profit":67670,"vipBonusStocks":491.84000000000003,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":3,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["小圓","珍珠奶茶","粉圓奶茶","果然在美食街尋求邂逅一定是哪裡搞錯了","1/18","摩羯座","O型","台灣","Taiwan","原創","小吃","飲料","好喝","Simon","希萌創意","台灣小吃擬人企劃","傲嬌","吐槽","外冷內熱","初夏","珍奶"],"createdAt":1518630500473},{"companyId":"XAeWqrqkKan7aHwGz","name":"六道聖","chairman":"wa5LAfzQS46jkA3r7","manager":"wa5LAfzQS46jkA3r7","grade":"D","capital":23104,"price":14,"release":1444,"profit":14009.6,"vipBonusStocks":64.90000000000003,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["六道聖","實況野球","実況パワフルプロ野球","ろくどう ひじり","六道 聖","一壘手","捕手","ささやき戦術"],"createdAt":1518590718603},{"companyId":"47KAzzvCm9Q9p9JFf","name":"立花千鶴","chairman":"4sSxpwwwzZKbskCAA","manager":"4sSxpwwwzZKbskCAA","grade":"C","capital":52512,"price":22,"release":1641,"profit":37881.3,"vipBonusStocks":1141.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["なんでここに先生が!? 立花千鶴 為什麼老師會在這裡!?"],"createdAt":1518588438579},{"companyId":"kW7L9KPZq9osDJT65","name":"恐山安娜","chairman":"Crkz9Q7kbnvnCQKhs","manager":"REhovW6KCFPMeAtWf","grade":"C","capital":30864,"price":40,"release":1929,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["恐山安娜","通靈王","恐山 アンナ","シャーマンキング","麻倉安娜","市子","安娜","林原惠美","Shaman King","Anna Kyoyama","Megumi Hayashibara","Tara Jayne"],"createdAt":1518587778567},{"companyId":"tYQPahL3CDsMwHrzG","name":"有坂真白","chairman":"Crkz9Q7kbnvnCQKhs","manager":"5yc4uqEmrauzHKGKH","grade":"A","capital":168294,"price":90,"release":1343,"profit":174362,"vipBonusStocks":444,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["有坂真白","蒼の彼方のフォーリズム","蒼之彼方的四重奏","sprite","白髮","山本希望","瀨良みと"],"createdAt":1518580818387},{"companyId":"TC2PuDFW7dwKzG3gh","name":"倉上日向","chairman":"pdKZNuvYYY4dZ3yzL","manager":"pdKZNuvYYY4dZ3yzL","grade":"C","capital":37832,"price":11,"release":3385,"profit":56531.05,"vipBonusStocks":724,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["ヤマノススメ","前進吧！登山少女","向山進發","倉上日向","倉上ひなた"],"createdAt":1518580278387},{"companyId":"8RD6RBQg62gxMZbKd","name":"中津川初","chairman":"7h9NHTPHpDeNKu9gv","manager":"2jEdKoLxjooZYm3nv","grade":"B","capital":92303,"price":27,"release":1912,"profit":143307.25,"vipBonusStocks":1219.9,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["中津川初","なかつがわ うい","Nakatsugawa Ui","星空へ架かる橋","架向星空之橋","日日野蒔 中村繪里子"],"createdAt":1518580218385},{"companyId":"Ht4S2u9qfephttx8z","name":"謎之女主角X","chairman":"sdPvxRzMmR9C5Bs4n","manager":"sdPvxRzMmR9C5Bs4n","grade":"B","capital":69184,"price":62,"release":1081,"profit":36388.350000000006,"vipBonusStocks":680,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["なぞのヒロインX","Fate/Grand Order","X毛","蜜汁女主角","插拔","星戰呆毛","元氣","呆毛","圍巾","運動衫","馬尾","Saber臉","外星人","Saber Lily、謎之女主角Z、謎之女主角X Alter","阿爾托莉雅·潘德拉貢、阿爾托莉雅·潘德拉貢Alter、尼祿、貞德、貞德Alter、沖田總司"],"createdAt":1518577518194},{"companyId":"Xnb9KbwttT5usCtqq","name":"HK21(少女前線)","chairman":"PuSRDXNHwvWA7NaD8","manager":"PuSRDXNHwvWA7NaD8","grade":"C","capital":35296,"price":48,"release":1102,"profit":25800,"vipBonusStocks":165,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["HK21","少女前線","Girls' Frontline"],"createdAt":1518575298168},{"companyId":"FjtHjNgqwFrDvg62Z","name":"9A-91","chairman":"Ep7qv65hM3x7jf3zR","manager":"Ep7qv65hM3x7jf3zR","grade":"A","capital":182400,"price":129,"release":1425,"profit":115018.8,"vipBonusStocks":478.06,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["少女前線","少女前线","少前","Girls' Frontline","girls' frontline","9A-91","9a-91","9A91","9a91","夜戰女神"],"createdAt":1518570018011},{"companyId":"cF2f3p4m7AQZSxjde","name":"久遠","chairman":"MSGC3gjsBSLHTZbDr","manager":"MSGC3gjsBSLHTZbDr","grade":"A","capital":184452,"price":414,"release":1440,"profit":280965.4,"vipBonusStocks":694,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["久遠","クオン","傳頌之物","虛偽的假面","うたわれるもの 偽りの仮面","種田梨沙","獸娘","獸耳","貓尾","黑髮","兩人的白皇","二人の白皇","媽媽","賢惠"],"createdAt":1518565997884},{"companyId":"kJrcMkz35v37YRqXG","name":"光輝(碧藍航線)","chairman":"7LioBhuS97eRnWjjf","manager":"7LioBhuS97eRnWjjf","grade":"A","capital":470272,"price":555,"release":1837,"profit":641915.2,"vipBonusStocks":494.32,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":2,"tags":["光輝","碧藍航線","Illustrious","イラストリアス","アズールレーン","Azur Lane","光辉","碧蓝航线","艦B","太太","人妻"],"createdAt":1518540797305},{"companyId":"qojTbYmauNuKaezNS","name":"比叡(艦これ)","chairman":"Y7a5DKrxYRoTyXpqa","manager":"NJfSL759DdzfsxsAX","grade":"A","capital":147742,"price":124,"release":1752,"profit":277598.2,"vipBonusStocks":906.49,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["艦隊Collection","艦娘","金剛級","戰艦","艦隊これくしょん","-艦これ-","比叡","ひえい"],"createdAt":1518538757207},{"companyId":"P54XMg56gDdGfneEh","name":"桂雛菊","chairman":"Bkz5yqeHGAf7HrJNA","manager":"Lc3TnA6xKHWYTSymZ","grade":"A","capital":279115,"price":437,"release":1086,"profit":356288,"vipBonusStocks":465.4,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["桂 ヒナギク","桂雛菊","旋風管","ハヤテのごとく！"],"createdAt":1518537977201},{"companyId":"Lafe28sMnFFQyAeby","name":"間宮 卓司","chairman":"Qro83h9xCzFsKcZex","manager":"7h9NHTPHpDeNKu9gv","grade":"D","capital":16016,"price":11,"release":1001,"profit":3724,"vipBonusStocks":19.850000000000023,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["美好的日子 ～不連續存在～","素晴らしき日々 ～不連続存在～","まみや たくじ","間宮 卓司","SCA-自","素晴日","美好的一天","終之空","救贖","教主","galgame","keroQ","makura","枕","ケロＱ","十二神器","間宮卓司","シナリオ賞部門金賞","萌えゲーアワード2010大賞部門銅賞","批評空間90分版","すかぢ"],"createdAt":1518536357142},{"companyId":"aYPvCJNPxrdbqD2Jh","name":"UMP9","chairman":"KeJktzGX8GgwFseSp","manager":"Ep7qv65hM3x7jf3zR","grade":"A","capital":264448,"price":154,"release":1033,"profit":64345.6,"vipBonusStocks":219,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["少女前線","少女前线","少前","Girls' Frontline","girls' frontline","UMP","UMP9","ump","ump9","9","9妹","小9","404小隊","404","404 not found","404 NOT FOUND"],"createdAt":1518483615180},{"companyId":"9JnmrMk56tnFKRHs6","name":"天王州雅典娜","chairman":"sEc7vEXSNGsDtnuge","manager":"n3P3iqse6vQpGztFa","grade":"A","capital":181168,"price":45,"release":2426,"profit":399578,"vipBonusStocks":1786,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["旋風管家！","天王州雅典娜","天王州 アテネ","てんのうす アテネ","川澄綾子","ハヤテのごとく！","畑健二郎","アーたん","小雅"],"createdAt":1518463754789},{"companyId":"qMminZFYH9vc5pX8o","name":"楓","chairman":"LqeYNy7zE5sEAo3DQ","manager":"7h9NHTPHpDeNKu9gv","grade":"A","capital":173248,"price":117,"release":3500,"profit":283682.85,"vipBonusStocks":2586,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["楓","maple","MAPLE","NEKOWORKS","NEKOPARA","NEKOparadise","NEKO WORKs","メイプル","美國卷耳貓","ネコぱら","巧克力與香草","巧克力與香子蘭","nekomimi paradise","貓耳天國","美少女遊戲","美少女アドベンチャーゲーム","ネコ","Galgame","Hgame","ねこみみパラダイス","猫耳天國","金髮","綠瞳","NEKOPARADISE"],"createdAt":1518462734774},{"companyId":"gPf9w46DbCgKuDk3K","name":"蘇九兒","chairman":"y8yQG4Dz7Tm46xuDF","manager":"8eP6vELL3Y7fxKq7j","grade":"A","capital":329256,"price":15,"release":9061,"profit":246707.2,"vipBonusStocks":8881,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["妖怪名單","狐妖","九尾狐","蘇妲己","酒兒","九兒","九尾大人","九尾白狐","妖族","三昧真火","九尾致境","青丘狐火","青丘媚術","歸元珠","練綺羅","惑霞披","火焰彈"],"createdAt":1518459014736},{"companyId":"TZQT6GjP3LERhPmSn","name":"大吉嶺","chairman":"WBh6abvPLjkBhus9T","manager":"mY8T2wTrnRobydgxG","grade":"A","capital":824811,"price":2767,"release":1286,"profit":586000,"vipBonusStocks":445.97,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["大吉嶺","ダージリン","少女與戰車","ガールズ&パンツァー","GUP","Girls Und Panzer","金髮","藍瞳","紅茶","大大人","田尻凜","巨乳型Saber","喜多村英梨","麻花辮","盤髮","巨乳","溫柔","貴族","學生會長","黑暗料理","聖葛羅莉安娜女學院","邱吉爾MKVII","車長","橙黃白毫","阿薩姆","魯克莉莉","薔薇果"],"createdAt":1518454634691},{"companyId":"bDQd8fRtuoL52tcnD","name":"渡邊曜","chairman":"uJLpwqzZN535b7Yri","manager":"uJLpwqzZN535b7Yri","grade":"A","capital":247168,"price":266,"release":1931,"profit":272648.25,"vipBonusStocks":637.87,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["渡邊曜","わたなべ　よう","Watanabe You","LoveLive!Sunshine!!","ラブライブ！サンシャイン！！","YOSORO","ヨーソロー","船長","Aqours","CYaRon!","齊藤朱夏","LLSS"],"createdAt":1518447494217},{"companyId":"YPzS83Dc7TCjXnrYa","name":"霧香·永羽·亞爾瑪","chairman":"FcuexmLFtkxyzNGDP","manager":"5yc4uqEmrauzHKGKH","grade":"B","capital":140968,"price":40,"release":2341,"profit":183252,"vipBonusStocks":938,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["霧香·永羽·亞爾瑪","キリカ·トワ·アルマ","シャイニング・レゾナンス","Shining Resonance","光明之響","Tony","早見沙織","巫女","歌姬"],"createdAt":1518446654166},{"companyId":"ADrE6Wd8JdeirPoQo","name":"胡尼克","chairman":"Amk6FSNzFqR7RmM3D","manager":"Amk6FSNzFqR7RmM3D","grade":"D","capital":17534,"price":23,"release":1074,"profit":8890,"vipBonusStocks":36.43000000000005,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["胡尼克","動物方城市","狐狸","赤狐","獸人","Nicholas P. Wilde","Nick Wilde","Zootopia","Sly Fox"],"createdAt":1518445093968},{"companyId":"765BvXXzWsM6Ttwbt","name":"耐耐","chairman":"XYvFThmQwLjexyDTB","manager":"d7LS7rorzJTj49xrQ","grade":"A","capital":276736,"price":500,"release":1081,"profit":73550,"vipBonusStocks":250.94,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["耐耐","高捷少女","nana"],"createdAt":1518438553574},{"companyId":"LPsymFTzMW4swZXTY","name":"小淵澤報瀨","chairman":"jGMroM2XY5AqdGNJf","manager":"wa5LAfzQS46jkA3r7","grade":"B","capital":126976,"price":91,"release":1984,"profit":95812.30000000002,"vipBonusStocks":640.1,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["小淵澤報瀨","小淵沢 報瀬","比宇宙還遠的地方","宇宙よりも遠い場所","南極"],"createdAt":1518418332570},{"companyId":"tjhHSS3vCsuMd6JWj","name":"桐谷和人","chairman":"eirovQMXcWgCaMM5C","manager":"eirovQMXcWgCaMM5C","grade":"B","capital":108627,"price":112,"release":1688,"profit":63296.2,"vipBonusStocks":530.3,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["SAO","刀劍神域","Sword Art Online","ソードアート・オンライン","桐人","桐谷和人","キリト","きりがや かずと","桐ヶ谷 和人","Kirito","Kirigaya Kazuto"],"createdAt":1518409632302},{"companyId":"dgCDxguMPuNBMMhP6","name":"艾蕾修卡","chairman":"t8HWRRGtuFEhbmce7","manager":"sdPvxRzMmR9C5Bs4n","grade":"A","capital":189568,"price":265,"release":1481,"profit":136728.80000000002,"vipBonusStocks":576.4,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["エレシュキガル","Ereshkigal","冥界女神","冥府的女主人","艾蕾醬(Ere)","Irkalla","代表人類之死的Terrible Earth Mother","冥界的(紅色)天使","槍凜","植田佳奈","女神","貧乳","姊姊","口嫌體正直","Fate/Grand Order","古代美索不達米亞","遠坂凜","Lancer"],"createdAt":1518408732291},{"companyId":"eKJ5YAGWPW4PnR6X2","name":"愛思特","chairman":"6nycyyh2aYturGHhs","manager":"NG9H39xidGDW5a6Au","grade":"A","capital":384512,"price":375,"release":1502,"profit":340265.2,"vipBonusStocks":592.8,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["精靈使的劍舞","精霊使いの剣舞","志瑞祐","Seirei Tsukai no Blade Dance","愛思特","護界神·愛思特","精靈","Terminus Est","テルミヌス・エスト","加隈亞衣","過膝襪","櫻半片","仁村有志","〆鯖コハダ","蘿莉","白髮","貧乳","殲魔聖劍","Demon Slayer","滅殺魔王之聖劍","黑絲"],"createdAt":1518405372243},{"companyId":"7qeaTCxM5dmLao8us","name":"栗山未來","chairman":"ysWH2DiKFG7gZWG5S","manager":"bePkR6aWWFHFC4Pju","grade":"A","capital":376832,"price":400,"release":1472,"profit":139509.4,"vipBonusStocks":456,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["栗山未來","境界的彼方","境界の彼方","種田梨沙","不愉快です","京阿尼","眼鏡","學妹"],"createdAt":1518382451367},{"companyId":"ADQ5ftjnCJLvfTPGh","name":"沙織．巴吉納(槙島 沙織)","chairman":"bh7yDRqxmkvxWPox2","manager":"bh7yDRqxmkvxWPox2","grade":"B","capital":108605,"price":40,"release":1948,"profit":126758.25,"vipBonusStocks":1429,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["槙島沙織/槇島 沙織/Makishima Saori","沙織．巴吉納/沙織·バジーナ/Saori Vageena","我的妹妹哪有這麼可愛！","俺の妹がこんなに可愛いわけがない","大小姐"],"createdAt":1518375311263},{"companyId":"Rue2sNPZgycAhbXsm","name":"焰/光","chairman":"b9hfWqHMdEnnZfnmh","manager":"b9hfWqHMdEnnZfnmh","grade":"B","capital":69081,"price":77,"release":1071,"profit":38879.6,"vipBonusStocks":378.94000000000005,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["ホムラ","ヒカリ","焰","光","ゼノブレイド","異度神劍2","異域神劍2","異度之刃2","Xenoblade Chronicles 2"],"createdAt":1518365531079},{"companyId":"GcLbHwydKmWExjnvN","name":"布倫希爾德(Fate/Grand Order)","chairman":"sdPvxRzMmR9C5Bs4n","manager":"sdPvxRzMmR9C5Bs4n","grade":"B","capital":89024,"price":64,"release":1391,"profit":15418.600000000002,"vipBonusStocks":534,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["ブリュンヒルデ","Brynhildr","Fate/Prototype 蒼銀的碎片","Fate/Grand Order","Lancer","女武神","病嬌","能登麻美子","布姐"],"createdAt":1518363911162},{"companyId":"TGSqvKx4YZbB9mAg7","name":"艾薩克·雷·貝拉姆·威斯考特","chairman":"3dQMBz5bXoGMaRqmG","manager":"3dQMBz5bXoGMaRqmG","grade":"D","capital":18416,"price":21,"release":1151,"profit":10206,"vipBonusStocks":26.800000000000068,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["DATE A LIVE","デート・ア・ライブ","アイザック・レイ・ペラム・ウェストコット","約會大作戰","艾薩克·雷·貝拉姆·威斯考特"],"createdAt":1518358090813},{"companyId":"K5vAFLL9mkwKD4rEn","name":"秋月愛莉","chairman":"goKarkEpLnqLSKgbm","manager":"wa5LAfzQS46jkA3r7","grade":"A","capital":419072,"price":474,"release":1637,"profit":89700,"vipBonusStocks":11.540000000000006,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":0,"tags":["秋月愛莉","鬼父","あきつき あいり","鬼父 〜愛娘強制発情〜"],"createdAt":1518357850809},{"companyId":"omnhQSEMzcyZKudbh","name":"真紅","chairman":"2WuW6SNzMZgjWRJxy","manager":"2WuW6SNzMZgjWRJxy","grade":"B","capital":87104,"price":81,"release":1361,"profit":7878,"vipBonusStocks":22.950000000000045,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["しんく","真紅","薔薇少女","雙馬尾","金髮","紅茶愛好者","Reiner Rubin","ローゼンメイデン","Rozen Maiden","人偶"],"createdAt":1518307146405},{"companyId":"EazXTMdfbC3AyXpvz","name":"埼玉","chairman":"ZGEHXiYQjfgT2wDWR","manager":"ZGEHXiYQjfgT2wDWR","grade":"B","capital":66112,"price":64,"release":1033,"profit":600,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["埼玉","サイタマ","Saitama","禿頭披風俠","ハゲマント","一拳超人","ワンパンマン","ONE-PUNCH MAN"],"createdAt":1518306546397},{"companyId":"oHkk6rnpP8KkoWGPi","name":"春日部 耀","chairman":"n3P3iqse6vQpGztFa","manager":"rTtEpovnsMHi3HnQd","grade":"A","capital":187648,"price":220,"release":1466,"profit":23467.95,"vipBonusStocks":14,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["問題児たちが異世界から来るそうですよ？","春日部耀","問題兒童都來自異世界?","かすかべ・よう"],"createdAt":1518287645891},{"companyId":"8MWni87TNq22wQ83T","name":"日下部燎子","chairman":"7hJuxfEDmKXSDQcBC","manager":"Xt3Jw3fnGoY37454c","grade":"D","capital":17477,"price":38,"release":1080,"profit":6216,"vipBonusStocks":82.30000000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["デート・ア・ライブ","DATE A LIVE","くさかべ りょうこ","約會大作戰","日下部燎子"],"createdAt":1518278284847},{"companyId":"akTBWjFEiF7BpXJxa","name":"シンシア・リドル","chairman":"7h9NHTPHpDeNKu9gv","manager":"7h9NHTPHpDeNKu9gv","grade":"B","capital":160982,"price":34,"release":2561,"profit":240542.7,"vipBonusStocks":1889.6000000000001,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["兔子","シンシア・リドル","Ｃｙｎｔｈｉａ　Ｒｉｄｄｌｅ","いんふぃにてぃもふりてぃ","もふもふな放課後","p19","MOFU~MOFU~","獸耳娘","practice","看板娘","兔耳","ミミ","SELECT"],"createdAt":1518273484476},{"companyId":"RKET7HbKheraCdJNP","name":"唯(由依)","chairman":"C47jDvR4fsWNuyJTG","manager":"C47jDvR4fsWNuyJTG","grade":"B","capital":101696,"price":118,"release":1589,"profit":136072.4,"vipBonusStocks":500.34,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["唯","由依","YUI","ユイ","AB!","GDM","エンジェルビーツ","唯喵","Girls Dead Monster","Angel Beats"],"createdAt":1518229622752},{"companyId":"jueWfxd9YcTxr58d8","name":"阿爾緹米希亞·貝爾·阿休克羅夫特","chairman":"Y7a5DKrxYRoTyXpqa","manager":"Crkz9Q7kbnvnCQKhs","grade":"D","capital":67382,"price":30,"release":3073,"profit":53311.5,"vipBonusStocks":1982.25,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["アルテミシア・ベル・アシュクロフト","DATE A LIVE","デート・ア・ライブ","阿爾緹米希亞·貝爾·阿休克羅夫特","約會大作戰"],"createdAt":1518225782525},{"companyId":"T6JBjEYeqfLLXEh5H","name":"破壞者","chairman":"Y2Tt2pa3jEpxjCDn8","manager":"PuSRDXNHwvWA7NaD8","grade":"C","capital":43296,"price":88,"release":1353,"profit":25739.7,"vipBonusStocks":187,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["破壞者","Destroyer","GAIA","蓋婭","末日魔犬","Cerberus","鐵血工造","SANGVIS FERRI","驅逐艦(?)","少女前線","失憶(?)","Girls' Frontline","⑨的同類(?)","看看破壞者，45姐你不試試wi#qaoh@eg!@wg>uj?%^&@#"],"createdAt":1518220862346},{"companyId":"iZxk2iMZBB5vtaQpi","name":"乃木園子","chairman":"jPHrXKf5R8KJm8tXe","manager":"jPHrXKf5R8KJm8tXe","grade":"C","capital":49504,"price":115,"release":1547,"profit":6057,"vipBonusStocks":13,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["乃木園子","結城友奈は勇者である","結城友奈是勇者","乃木","園子","鷲尾須美是勇者","鷲尾須美は勇者である"],"createdAt":1518219662340},{"companyId":"jBsaKWrdxkSG8vpJe","name":"崇宮澪","chairman":"qJAWaN8teJB9FMwkD","manager":"qJAWaN8teJB9FMwkD","grade":"C","capital":35966,"price":184,"release":1047,"profit":10984.8,"vipBonusStocks":330,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["約會大作戰","デート・ア・ライブ","DATE A LIVE","村雨令音","たかみや みお","崇宮澪"],"createdAt":1518182521167},{"companyId":"yjZAMpbQczfq4imWR","name":"芬子(FNC)","chairman":"D3rzjAkF7YTKAAqd4","manager":"D3rzjAkF7YTKAAqd4","grade":"D","capital":17359,"price":8,"release":1082,"profit":14276.5,"vipBonusStocks":85.40000000000002,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["芬子","FNC","槍械少女","うぽって!!","ふんこ"],"createdAt":1518151440435},{"companyId":"S4Zf56JY4TdnGqBqg","name":"姬柊雪菜","chairman":"zDeFCZcBfiqPPEJke","manager":"zDeFCZcBfiqPPEJke","grade":"A","capital":379958,"price":371,"release":1458,"profit":232607,"vipBonusStocks":803.2,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["姬柊雪菜","ひめらぎ ゆきな","噬血狂襲","ストライク・ザ・ブラッド","STRIKE THE BLOOD","雪菜"],"createdAt":1518140039753},{"companyId":"irp9KpDb9vfZLyKBu","name":"Super-Shorty(少女前線)","chairman":"PuSRDXNHwvWA7NaD8","manager":"PuSRDXNHwvWA7NaD8","grade":"C","capital":38464,"price":42,"release":1202,"profit":35426.4,"vipBonusStocks":420.71,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["矮子","超級矮子","真·超級矮個子","因為她說這是她引以為傲的身材所以我是在誇獎她，好了我還是正經打標籤吧~","Super-Shorty","supershorty","super shorty","超短","超級短","少女前線","Girls' Frontline","45姐你看看人家的態%=yhsb#!dvwg>uj?%oh@eg!@#$%^&*r"],"createdAt":1518134399263},{"companyId":"CZX7dueuBKD7vTbLx","name":"椎名真由理","chairman":"Y76SxDszqQHxcKXFC","manager":"Y76SxDszqQHxcKXFC","grade":"B","capital":121728,"price":97,"release":1902,"profit":26483,"vipBonusStocks":236.4,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":3,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["命運石之門","真由理","Steins;Gate","未來道具研究所研究員No.002","まゆり","トゥットゥルー","嘟嘟嚕","椎名真由理","しいなまゆり","シュタインズゲート","麻由喜","真由氏","SERN"],"createdAt":1518133379203},{"companyId":"eqo8n4eNjwbLnrrvk","name":"雅兒貝德","chairman":"mY8T2wTrnRobydgxG","manager":"QdEwFgyJ3DTkB5vJz","grade":"B","capital":130304,"price":374,"release":1018,"profit":48943.5,"vipBonusStocks":233.32,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["オーバーロード","Over Lord","OverLord","不死者之王","丸山くがね","雅兒貝德","アルベド","Albedo"],"createdAt":1518130319142},{"companyId":"3y6WApFDvqZxwtKue","name":"艾蓮·米拉·梅瑟斯","chairman":"2HFha7H4TviS3Pbra","manager":"Crkz9Q7kbnvnCQKhs","grade":"D","capital":15784,"price":8,"release":1973,"profit":5332,"vipBonusStocks":157.55000000000007,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["エレン・ミラ・メイザース","DATE A LIVE","デート・ア・ライブ","約會大作戰","艾蓮·米拉·梅瑟斯"],"createdAt":1518099658466},{"companyId":"diYnwWsTbo2WXpPC3","name":"魔王(魔王大人，拿一下那個！！)","chairman":"4sSxpwwwzZKbskCAA","manager":"4sSxpwwwzZKbskCAA","grade":"D","capital":20276,"price":25,"release":1198,"profit":16562.95,"vipBonusStocks":150.70000000000002,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["魔王様ちょっとそれとって!!","魔王","魔王大人，拿一下那個！！","魔王大人你就收下這個吧！！"],"createdAt":1518066237562},{"companyId":"bkCNPTW85c6ZxnEkz","name":"三宅日向","chairman":"hEmBhvqRtuWCeD9ik","manager":"jGMroM2XY5AqdGNJf","grade":"C","capital":44053,"price":52,"release":1375,"profit":51208.8,"vipBonusStocks":576,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["三宅 日向","みやけ ひなた","井口裕香","比宇宙還遠的地方","比宇宙更遠的地方","宇宙よりも遠い場所"],"createdAt":1518052857282},{"companyId":"qbmX3AvmDDgmQm5eh","name":"香月奈奈美","chairman":"48925zNjt86rsoFHX","manager":"k4MBYKEzTfMdMshgz","grade":"B","capital":98864,"price":30,"release":2435,"profit":171732,"vipBonusStocks":1834.2,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["百合","百合姬","一迅社","香月奈奈美","香月奈々美","2DK","G筆","鬧鐘","2DK、Gペン、目覚まし時計","大沢やよい"],"createdAt":1518046557205},{"companyId":"aNizxX8y37dXLRJWG","name":"亞莓","chairman":"dPYGagPm6RGXEdLHa","manager":"dPYGagPm6RGXEdLHa","grade":"D","capital":10248,"price":6,"release":1281,"profit":7001.8,"vipBonusStocks":72.16000000000005,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["亞莓 아르메 글랜스티드 Arme Glenstid","3小俠 三小俠 永恆冒險 그랜드체이스 Grand Chase","윤여진 松來未祐 Fernanda Bullara","魔法師 魔導士 幻術師 賢者 紫色 紫毛"],"createdAt":1518043377170},{"companyId":"4W9a5PqbBPCfvjcJm","name":"白井黑子","chairman":"knN4an79B3upSFraC","manager":"knN4an79B3upSFraC","grade":"B","capital":100608,"price":80,"release":1572,"profit":21160.2,"vipBonusStocks":374.82,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["白井黑子","白井 黒子","魔法禁書目錄","科學超電磁砲","とある科学の超電磁砲","とある魔術の禁書目録"],"createdAt":1518036657052},{"companyId":"pMb2ZfA869ZiRGYYd","name":"愛莎·蘭德爾","chairman":"ez3XAqB4u6bs3zTwt","manager":"ez3XAqB4u6bs3zTwt","grade":"C","capital":35840,"price":39,"release":1120,"profit":25680,"vipBonusStocks":159.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["愛莎","艾爾之光","釘宮理惠","虛無公主","萌幻法師","元素魔導","貧乳","紫毛"],"createdAt":1518032937011},{"companyId":"fzfMbXzWgM4iZn8W5","name":"阿玄","chairman":"Amk6FSNzFqR7RmM3D","manager":"Amk6FSNzFqR7RmM3D","grade":"D","capital":11472,"price":17,"release":1434,"profit":2753.8500000000004,"vipBonusStocks":119.40000000000009,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["阿玄","家有大貓","家有大貓：貓狗大戰","土狗","獸人","Nekojishi"],"createdAt":1518025916928},{"companyId":"m7tqDShsdxGbbHghE","name":"翔鶴(碧藍航線)","chairman":"97Wc6p2NPFNDmeRxY","manager":"P7A2S6b6pBhzvFHMP","grade":"B","capital":110278,"price":126,"release":1717,"profit":78793,"vipBonusStocks":794.42,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["碧藍航線","碧蓝航线","翔鶴","しょうかく","Shokaku","Azur Lane","アズールレーン","艦B","姊姊","鷸","翔鶴號航空母艦","日式過膝布襪","腹黑","毒舌","航母","重櫻","白髮","隱性巨乳"],"createdAt":1518024176921},{"companyId":"RHRKXZhdCcd7jMqdL","name":"繆絲(ミュース)","chairman":"R62tmAsHpqL32pjtg","manager":"g7SGNvvYpZXFr7vEa","grade":"C","capital":39816,"price":68,"release":1171,"profit":33407.45,"vipBonusStocks":186.78000000000003,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["繆絲","ミュース","Muse","甘城輝煌樂園救世主","甘城ブリリアントパーク"],"createdAt":1518021956888},{"companyId":"CGRe8KL8dGzHJ8Ca2","name":"涼宮春日","chairman":"GBJQrFvD7dmCaCo6Q","manager":"GBJQrFvD7dmCaCo6Q","grade":"A","capital":257280,"price":596,"release":1005,"profit":76650,"vipBonusStocks":302.58,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["涼宮春日","涼宮ハルヒ","涼宮ハルヒシリーズ","Haruhi Suzumiya","涼宮春日的憂鬱","涼宮春日的嘆息","涼宮春日的煩悶","涼宮春日的消失","涼宮春日的暴走","涼宮春日的動搖","涼宮春日的陰謀","涼宮春日的憤慨","涼宮春日的分裂","涼宮春日的驚愕"],"createdAt":1518019556868},{"companyId":"FsuYJheRx3SSbm82t","name":"川島亞美","chairman":"ZGEHXiYQjfgT2wDWR","manager":"wa5LAfzQS46jkA3r7","grade":"B","capital":88517,"price":155,"release":1345,"profit":140368.1,"vipBonusStocks":623,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["川島亞美","亞美美","龍與虎","とらドラ!","かわしま あみ","Kawashima Ami","長直","腹黑","毒舌","偶像","大小姐","雙重性格","幼馴染","川嶋亜美"],"createdAt":1518012956523},{"companyId":"p53Zk6E4LNTokDGbT","name":"星宫六喰","chairman":"T6DoJ7tZu2md8mQSb","manager":"T6DoJ7tZu2md8mQSb","grade":"C","capital":43904,"price":52,"release":1372,"profit":9682.400000000001,"vipBonusStocks":58.90000000000009,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["デート・ア・ライブ","DATE A LIVE","星宫六喰","ほしみや むくろ","約會大作戰"],"createdAt":1518012056515},{"companyId":"uEqbvcrivRvrM573v","name":"拉菲(碧藍航線)","chairman":"48925zNjt86rsoFHX","manager":"48925zNjt86rsoFHX","grade":"B","capital":78205,"price":48,"release":1223,"profit":109337.45000000001,"vipBonusStocks":606.8,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["碧藍航線","碧蓝航线","艦B","アズールレーン","Laffey","ラフィー","拉菲"],"createdAt":1517980675758},{"companyId":"GRCKibtseaYoDKM9h","name":"胡桃澤·薩塔妮基亞·麥克道威爾","chairman":"MSGC3gjsBSLHTZbDr","manager":"MSGC3gjsBSLHTZbDr","grade":"A","capital":154752,"price":350,"release":1209,"profit":153202.40000000002,"vipBonusStocks":383.06,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["胡桃澤·薩塔妮基亞·麥克道威爾","薩塔妮亞","サターニャ","Satania","くるみざわ゠サタニキア゠マクドウェル","胡桃沢","Kurumizawa Satanichia McDowell","惡魔","笨蛋","蠢萌","中二","虎牙","貓嘴","天然萌","紅髪","紅瞳","三段笑","廢天使加百列/加百璃的墮落 (ガヴリールドロップアウト）"],"createdAt":1517966635284},{"companyId":"uncLKbvNvRxBKFgSa","name":"賽玟","chairman":"j345n8fssFkbi4uCC","manager":"j345n8fssFkbi4uCC","grade":"C","capital":34976,"price":74,"release":1093,"profit":7296.599999999999,"vipBonusStocks":67.60000000000002,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["賽玟","七色","阿爾沙文","セブン","アルシャービン","なないろ","Seven","Nanairo Alsharvin","刀劍","刀劍神域","ソードアート・オンライン"],"createdAt":1517957575184},{"companyId":"nCXxs9dK2auBMDPE8","name":"塔城小猫","chairman":"mCiJeeCNdmfqXj9Zf","manager":"mCiJeeCNdmfqXj9Zf","grade":"C","capital":51125,"price":40,"release":1597,"profit":37376,"vipBonusStocks":400.26000000000005,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["塔城小猫","白音","High School DxD","惡魔高校D×D","ハイスクール・ディーディー","しろね"],"createdAt":1517955595156},{"companyId":"fxy3otwbGP6SLACnn","name":"崇宫真那","chairman":"TCAS5pLc6zaeFLEfQ","manager":"Ep7qv65hM3x7jf3zR","grade":"C","capital":39238,"price":34,"release":1226,"profit":40808.600000000006,"vipBonusStocks":481.82,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["デート・ア・ライブ","DATE A LIVE","たかみや まな","崇宫真那","約會大作戰"],"createdAt":1517952895130},{"companyId":"7NSpbREw2LAAMJfBr","name":"中津靜流","chairman":"wa5LAfzQS46jkA3r7","manager":"hEmBhvqRtuWCeD9ik","grade":"B","capital":103401,"price":127,"release":1640,"profit":266318,"vipBonusStocks":1097.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["中津靜流","なかつ しずる","Rewrite","雙馬尾","無口","酷嬌","眼罩","異色瞳","貧乳","學妹"],"createdAt":1517949775091},{"companyId":"Assj8XuYANEDpFKTd","name":"八一式馬(少女前線)","chairman":"W9wcCubnpT37aGjun","manager":"W9wcCubnpT37aGjun","grade":"C","capital":30144,"price":111,"release":1884,"profit":58923.4,"vipBonusStocks":914.6999999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["Girls' Frontline","少女前線","少女前线","少前","★★★","狙擊步槍","八一式馬步槍","八一式馬","無名式步槍","梁凌薇","黑髮","黑瞳","黑絲","隱性巨乳"],"createdAt":1517940954925},{"companyId":"mBtShYT69MnxsSGuf","name":"シルヴィ=ミリア・ルクレール","chairman":"7h9NHTPHpDeNKu9gv","manager":"7h9NHTPHpDeNKu9gv","grade":"B","capital":91112,"price":2,"release":13060,"profit":229987,"vipBonusStocks":12038,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["ミリア・ルクレール","シルヴィ=ミリア・ルクレール","Milia.Leclerc","p19","看板娘","狐狸","狐耳","ミミ","INQUIRY","もふもふな放課後","いんふぃにてぃもふりてぃ","practice","獸耳娘","MOFU~MOFU~"],"createdAt":1517936394878},{"companyId":"XoqjpeAGouzuGHyHP","name":"古河渚","chairman":"Crkz9Q7kbnvnCQKhs","manager":"wa5LAfzQS46jkA3r7","grade":"B","capital":103296,"price":114,"release":1614,"profit":70234,"vipBonusStocks":761.25,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["古河渚","ふるかわ なぎさ","岡崎渚","短髮","呆毛","天然呆","治癒系","女神系","病弱","CLANNAD","糰子大家族","小鎮家族","Key","麻枝准"],"createdAt":1517900813495},{"companyId":"QDY6Wwmtep4639gAK","name":"夏洛克·福爾摩斯","chairman":"RqQivWo4eSnFrKJTX","manager":"RqQivWo4eSnFrKJTX","grade":"C","capital":94169,"price":44,"release":2687,"profit":48933.9,"vipBonusStocks":256.3000000000003,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["夏洛克·福爾摩斯","シャーロック・ホームズ","Sherlock Holmes","Fate/Grand Order","TYPE-MOON","RULER","中立·善","偵探","亞瑟·柯南·道爾"],"createdAt":1517895533405},{"companyId":"6Crh44yFbytn6foD8","name":"席爾薇雅・琉奈海姆","chairman":"8KBB5Pqk2zpZ3WYMh","manager":"ee7z9C4q4pGyTcGNn","grade":"B","capital":70720,"price":153,"release":1105,"profit":62844,"vipBonusStocks":470,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["席爾薇雅・琉奈海姆","シルヴィア・リューネハイム","Sylvia Ryuneheim","戰律魔女","學園歌姬","學戰都市Asterisk","學戰都市外傳葵恩薇兒之翼","学戦都市アスタリスク","千菅春香"],"createdAt":1517888393306},{"companyId":"9gAoXWW5jb8an2LBW","name":"赤松結衣","chairman":"zQCNShSMTpajY5JPg","manager":"zQCNShSMTpajY5JPg","grade":"B","capital":71652,"price":63,"release":1112,"profit":78896.5,"vipBonusStocks":537.9200000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["結衣","ゆい","赤松結衣","あかまつ ゆい","赤松同學","高田憂希","紅色","COLORS","隊長","小學生","愛哭鬼","ㄌㄌ","LOLI","FBI的陷阱","三ツ星カラーズ","三顆星彩色冒險","屁股裂開","みつぼしカラーズ","MITSUBOSHI COLORS","三顆星"],"createdAt":1517883773265},{"companyId":"Nd4g2kuHgkmqoiWgC","name":"橘·希爾芬福特","chairman":"B5tG8BKfpBnaKF3ad","manager":"PuSRDXNHwvWA7NaD8","grade":"C","capital":34304,"price":36,"release":1072,"profit":16006,"vipBonusStocks":235.40000000000003,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["橘·希爾芬福特","橘·シルフィンフォード","我家有個魚乾妹","干物妹！うまるちゃん","干物妹！うまるちゃんR"],"createdAt":1517880773223},{"companyId":"YWevJujwn2FFCNQEW","name":"UMP40","chairman":"Ep7qv65hM3x7jf3zR","manager":"Ep7qv65hM3x7jf3zR","grade":"A","capital":134912,"price":101,"release":1054,"profit":39094,"vipBonusStocks":396.6,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["少女前線","少女前线","少前","Girls' Frontline","girls' frontline","UMP","UMP40","ump","ump40","40"],"createdAt":1517878853159},{"companyId":"ZANw7pt7DfGGYezSw","name":"百變怪","chairman":"QaXzRkfYJK8euee4G","manager":"3Fki3Wd8qCCxTdgoa","grade":"C","capital":44990,"price":21,"release":2630,"profit":23216.05,"vipBonusStocks":374.25000000000006,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["百變怪","メタモン","精靈寶可夢","ポケットモンスター","神奇寶貝","Pokémon"],"createdAt":1517865412937},{"companyId":"7xSDtSC43qg7qsduy","name":"鳶一折紙","chairman":"97Wc6p2NPFNDmeRxY","manager":"sSy4gwNpDwQqhDf5A","grade":"A","capital":221870,"price":306,"release":1714,"profit":113835,"vipBonusStocks":595,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["デート・ア・ライブ","DATE A LIVE","とびいち おりがみ","約會大作戰","鳶一折紙"],"createdAt":1517863792916},{"companyId":"oEuLbADrXHPzo9WLA","name":"能美·庫特莉亞芙卡","chairman":"SE2tLqhCaFa4SvxCs","manager":"sSy4gwNpDwQqhDf5A","grade":"A","capital":191449,"price":427,"release":1466,"profit":275637.5,"vipBonusStocks":647.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["能美 クドリャフカ","能美·庫特莉亞芙卡","のうみ くどりゃふか","Little Busters!","リトルバスターズ!","貧乳","幼兒體型","歸國子女","絕對領域","白絲過膝襪","虎牙","蘿莉","Kud","KudWafter"],"createdAt":1517863613021},{"companyId":"85jREQaJihZZg3kPB","name":"來栖 加奈子","chairman":"XbWpWvgvFTjxyCC3v","manager":"bh7yDRqxmkvxWPox2","grade":"C","capital":36092,"price":45,"release":1110,"profit":34390,"vipBonusStocks":591.4,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["俺の妹がこんなに可愛いわけがない","我的妹妹哪有這麼可愛","來栖 加奈子","くるす かなこ","来栖加奈子"],"createdAt":1517863492910},{"companyId":"orwiPYbwmL6bnsi9H","name":"IWS2000","chairman":"bjXscGffs5qCnDrsq","manager":"bjXscGffs5qCnDrsq","grade":"A","capital":157400,"price":28,"release":4347,"profit":409242.65,"vipBonusStocks":3585,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["Girls' Frontline","少女前線","少女前线","★★★★★","步槍","IWS2000","二小姐","白皇","銀髮","紅瞳"],"createdAt":1517853952810},{"companyId":"sAmKtrci8x95rrjg5","name":"南丁格爾","chairman":"RqQivWo4eSnFrKJTX","manager":"RqQivWo4eSnFrKJTX","grade":"C","capital":53408,"price":27,"release":1669,"profit":59869.3,"vipBonusStocks":886.8599999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["南丁格爾","ナイチンゲール","フローレンス・ナイチンゲール","Nightingale","Fate/Grand Order","Fate","TYPE-MOON","護士","秩序·善","Berserker","巨乳"],"createdAt":1517844652704},{"companyId":"r6PiAWYDsxfxmZRbP","name":"伊絲塔","chairman":"MiePKxWB8BYNrCWXo","manager":"sdPvxRzMmR9C5Bs4n","grade":"A","capital":165376,"price":351,"release":1292,"profit":119637.4,"vipBonusStocks":286.66,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["イシュタル","Ishtar","女神凜","凜什塔爾","Rinshtar","IshtaRIN","伊什塔凜","弓凜","女神","貧乳","美索不達米亞","遠坂凜","古代美索不達米亞神話","Fate/GrandOrder","Fate/Prototype","Fate/EXTRA CCC","Archer","植田佳奈","Rider"],"createdAt":1517841652561},{"companyId":"bZq5eeiwwkBsxizpa","name":"SSG 69(少女前線)","chairman":"ZgqsW95hPxB2iW9RC","manager":"PuSRDXNHwvWA7NaD8","grade":"D","capital":25551,"price":56,"release":1574,"profit":12412.199999999999,"vipBonusStocks":483.48,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["SSG 69","SSG69","少女前線","少女前线","Girls' Frontline"],"createdAt":1517837452500},{"companyId":"LeJZzJ8jmDo7pxP4i","name":"奈亞子","chairman":"XbWpWvgvFTjxyCC3v","manager":"MSGC3gjsBSLHTZbDr","grade":"A","capital":146480,"price":450,"release":1142,"profit":144398.65,"vipBonusStocks":392.55,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["奈亞子","奈亞拉托提普","ニャル子","ニャルラトホテプ","阿澄佳奈","潛行吧!奈亞子","這いよれ！ニャル子さん","Nyarlathotep","克蘇魯神話","Cthulhu Mytos","假面騎士","變身","呆毛","邪神","SAN值","宅女","銀髮","綠瞳","合法蘿莉"],"createdAt":1517829832264},{"companyId":"di4LekuN4zw9QLYHh","name":"附窗子","chairman":"48d659TEjDFZ74b3B","manager":"PuSRDXNHwvWA7NaD8","grade":"D","capital":16496,"price":17,"release":1031,"profit":11549.25,"vipBonusStocks":126.53,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["附窗子","窓付き","ゆめにっき","夢日記","病嬌","蘿莉","恐怖RPG"],"createdAt":1517803791375},{"companyId":"RewmHsCYQX8C2RB3n","name":"如月(碧藍航線)","chairman":"CM6o8gGPE8pjttGKo","manager":"CM6o8gGPE8pjttGKo","grade":"B","capital":95248,"price":27,"release":1968,"profit":157644.75,"vipBonusStocks":1395.76,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["アズールレーン","碧藍航線","艦B","Azur Lane","如月","獸耳"],"createdAt":1517803551370},{"companyId":"Waox5aBDueNwKrEah","name":"魔王（まおう）","chairman":"mY8T2wTrnRobydgxG","manager":"mY8T2wTrnRobydgxG","grade":"A","capital":149120,"price":257,"release":1165,"profit":73184,"vipBonusStocks":484,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["魔王","まおう","紅玉之瞳","紅色學士","肉山大魔王","魔王勇者","まおゆう魔王勇者","Maoyū Maō Yūsha","橙乃真希","小清水亞美","橙乃ままれ","巨乳","紅髮","紅玉の瞳","紅の学士","贅肉","駄肉"],"createdAt":1517803011364},{"companyId":"zXoAWnm258ttZsEMY","name":"林克","chairman":"b9hfWqHMdEnnZfnmh","manager":"b9hfWqHMdEnnZfnmh","grade":"D","capital":5504,"price":11,"release":1376,"profit":1102,"vipBonusStocks":11.039999999999964,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["林克","リンク","薩爾達傳說","ゼルダの伝説","曠野之息","Zelda"],"createdAt":1517802471360},{"companyId":"ky3TPTp4eeYoeqfTd","name":"宮本武藏(Fate/Grand Order)","chairman":"GzQhfEwZnTkNRujKg","manager":"CDYPKYRYyCvjmAYPt","grade":"B","capital":86169,"price":110,"release":1339,"profit":18287.5,"vipBonusStocks":284.6,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["新免武藏","みやもと むさし","Miyamoto Musashi","佐倉綾音","Fate/Grand Order","下総國","英靈劍豪七番勝負"],"createdAt":1517801151127},{"companyId":"RaptKeGSYd98GAs8S","name":"十倉榮依子","chairman":"pdKZNuvYYY4dZ3yzL","manager":"k4MBYKEzTfMdMshgz","grade":"B","capital":128058,"price":31,"release":1773,"profit":0,"vipBonusStocks":4.099999999999994,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["十倉榮依子","榮依子","芳文社","百合","篤見唯子","Slow Start","十倉 栄依子","スロウスタート"],"createdAt":1517798931081},{"companyId":"pwRsQdokiQnWdX9nS","name":"八舞耶俱矢","chairman":"rQSA5gf4DvfpzxjzR","manager":"rQSA5gf4DvfpzxjzR","grade":"B","capital":129944,"price":51,"release":1018,"profit":28757,"vipBonusStocks":570.62,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["やまい かぐや","八舞耶俱矢","DATE A LIVE","デート・ア・ライブ","約會大作戰","八舞姊妹","Yamai Kaguya","狂戰士","Berserk","ベルセルク","DAL","精靈","內田真禮","Uchida Maaya","うちだ まあや","中二"],"createdAt":1517797190905},{"companyId":"scxyce9BE2Lk69DGF","name":"誘宵美九","chairman":"2jEdKoLxjooZYm3nv","manager":"ee7z9C4q4pGyTcGNn","grade":"A","capital":175232,"price":97,"release":1369,"profit":57601,"vipBonusStocks":618.9,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["約會大作戰","デート・ア・ライブ","誘宵美九","いざよい みく破軍歌姬","茅原實里"],"createdAt":1517796830901},{"companyId":"fzEZj7wsugjZ28G4R","name":"貝爾澤古·斯黛莉休·索德·愛麗絲","chairman":"n3P3iqse6vQpGztFa","manager":"7h9NHTPHpDeNKu9gv","grade":"A","capital":184407,"price":374,"release":1398,"profit":150321.5,"vipBonusStocks":588.4999999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":1,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["アイリス","愛麗絲","このすば","美好世界","為這個美好的世界獻上祝福","ベルゼルグ・スタイリッシュ・ソード・アイリス","貝爾澤古·斯黛莉休·索德·愛麗絲","この素晴らしい世界に祝福を！"],"createdAt":1517795630829},{"companyId":"jwCSyR5qNeY8FvKzE","name":"馮寶寶","chairman":"5X2MhaxB7SBuuSz6a","manager":"5X2MhaxB7SBuuSz6a","grade":"C","capital":41614,"price":9,"release":2553,"profit":66648.1,"vipBonusStocks":2162,"managerProfitPercent":0.05,"salary":500,"nextSeasonSalary":2000,"bonus":1,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["馮寶寶","冯宝宝","早見沙織","一人之下the outcast"],"createdAt":1517792090787},{"companyId":"AbZ9wHrhAcA9RFMts","name":"星野 克拉拉","chairman":"bh7yDRqxmkvxWPox2","manager":"bh7yDRqxmkvxWPox2","grade":"D","capital":7392,"price":4,"release":1848,"profit":4538.7,"vipBonusStocks":70.66000000000008,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["星野克拉拉","星野 くらら","俺の妹がこんなに可愛いわけがない","我的妹妹哪有這麼可愛"],"createdAt":1517782310666},{"companyId":"ZFPia49H9FKWfZpTS","name":"巧克力","chairman":"LqeYNy7zE5sEAo3DQ","manager":"7h9NHTPHpDeNKu9gv","grade":"A","capital":446282,"price":65,"release":3284,"profit":15417.200000000012,"vipBonusStocks":439.13,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["Chocola","ショコラ","巧克力","さより","NEKO WORKs","Nekopara","中華田園貓","混種貓","ヒマリ","朋永真季","貓娘","猫娘","ネコぱら","巧克力與香草","巧克力與香子蘭","Galgame","Hgame","同人誌","看板娘","本子","美少女遊戲","美少女アドベンチャーゲーム","俗稱%猫","ネコ","NEKOPARADISE","nekomimi paradise","貓耳天國","ねこみみパラダイス","Chocola & Vanilla","Maple","楓"],"createdAt":1517774090529},{"companyId":"S2NRo3W2LPWaGJjtC","name":"安樂少女","chairman":"ZwEs6Cxs5nZWSTsgG","manager":"4sSxpwwwzZKbskCAA","grade":"D","capital":16110,"price":20,"release":1005,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["安樂少女 安楽少女 為美好的世界獻上祝福！ この素晴らしい世界に祝福を!"],"createdAt":1517772470462},{"companyId":"dYqobuNjHyDc8az8N","name":"小穹","chairman":"CWgfhqxbrJMxsknrb","manager":"CWgfhqxbrJMxsknrb","grade":"A","capital":209152,"price":230,"release":1634,"profit":119725,"vipBonusStocks":654.78,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":2,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["小穹","瓊音","前進吧！高捷少女！","進め！高捷（たかめ）少女！","進め！たかめ少女！","K.R.T.GIRLS","高捷娘","高雄捷運","Simon","希萌創意","台灣","Taiwan","原創","虛擬代言人","站務員","天秤座","吃貨","光之穹頂","初夏","KSP"],"createdAt":1517770910441},{"companyId":"XduprkH2Z3vQDev7T","name":"小天鵝(碧藍航線)","chairman":"n3P3iqse6vQpGztFa","manager":"n3P3iqse6vQpGztFa","grade":"B","capital":106885,"price":42,"release":3081,"profit":298515,"vipBonusStocks":2615,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["小天鵝","聖勞倫","Cygnet","St. Laurent","碧藍航線","アズールレーン","シグニット","種田梨沙","和茶","皇家 吃貨 天然呆 黑絲 過膝襪 白髮"],"createdAt":1517767010406},{"companyId":"ThE3upiBJF4bGBGFM","name":"I醬","chairman":"c75uSy5ehKPCTqC7K","manager":"QdEwFgyJ3DTkB5vJz","grade":"A","capital":172184,"price":423,"release":1331,"profit":70468,"vipBonusStocks":332,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["月曜日のたわわ","I醬","愛醬","J醬","アイちゃん","星期一的豐滿"],"createdAt":1517766230391},{"companyId":"S7rL7eMSSJCnjxAkL","name":"琪露諾","chairman":"ErfivzouwNfpjMLjk","manager":"ErfivzouwNfpjMLjk","grade":"A","capital":177792,"price":272,"release":1389,"profit":248627.8,"vipBonusStocks":586.85,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["琪露諾","東方Project","東方","チルノ","⑨","笨蛋","Cirno","妖精","冰之妖精","東方紅魔鄉"],"createdAt":1517761610133},{"companyId":"RjSAzx48YN4c4mbeb","name":"香草","chairman":"7h9NHTPHpDeNKu9gv","manager":"7h9NHTPHpDeNKu9gv","grade":"A","capital":546164,"price":68,"release":4628,"profit":16988,"vipBonusStocks":1532.0600000000002,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["Vanilla","バニラ","香草","さより","NEKO WORKs","Nekopara","中華田園貓","白色混種貓","中村あむ","豬口有佳","白髮","藍瞳","抖M","貓娘","猫娘","ネコぱら","巧克力與香草","巧克力與香子蘭","香子蘭","Galgame","Hgame","同人誌","看板娘","本子","ネコ","美少女遊戲","美少女アドベンチャーゲーム","いのくちゆか","俗稱%猫","NEKOPARADISE","nekomimi paradise","貓耳天國","ねこみみパラダイス","Chocola & Vanilla","楓","Maple"],"createdAt":1517760290120},{"companyId":"D2qrqxwN7f2GrjtmJ","name":"艾爾菲露特＝瓦倫蒂","chairman":"2MnixRrWRWFsYuqa9","manager":"2MnixRrWRWFsYuqa9","grade":"B","capital":113418,"price":90,"release":1719,"profit":116386.5,"vipBonusStocks":1222.28,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["Elphelt＝Valentine","艾爾菲露特=瓦倫蒂","エルフェルト・バレンタイン","Guilty Gear Xrd -Sign","ギルティギア イグザード サイン","GGXrd","罪惡裝備","聖騎士之戰 Xrd -SIGN-","少女前線","Girls' Frontline","洲崎綾","白髮","少女前线"],"createdAt":1517758910006},{"companyId":"thFiodZSThDTMG7ge","name":"小宮惠那","chairman":"wa5LAfzQS46jkA3r7","manager":"wa5LAfzQS46jkA3r7","grade":"B","capital":110154,"price":75,"release":1689,"profit":208944,"vipBonusStocks":1023,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["小宮恵那 (こみや えな)","Just Because!","比村奇石","鴨志田一","小宮恵那"],"createdAt":1517757889998},{"companyId":"xDsYHeh94NPtLzcqJ","name":"緹娜(티나)","chairman":"n3P3iqse6vQpGztFa","manager":"cMWCrczoWMpiA3G6q","grade":"B","capital":70720,"price":96,"release":1105,"profit":93126,"vipBonusStocks":785.28,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["缇娜","Tina","티나","封印者","로저스，Closers","傭兵"],"createdAt":1517757289992},{"companyId":"Gj9E6YbQK4XStGNMw","name":"霧雨魔理沙","chairman":"pZR69fp9DtX8QYEbB","manager":"MSGC3gjsBSLHTZbDr","grade":"A","capital":171008,"price":175,"release":1336,"profit":210558.05,"vipBonusStocks":588.32,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["霧雨魔理沙","東方Project","東方","Touhou Project","Touhou","魔法使","黑白","小偷","DAZE","きりさめ まりさ","Kirisame Marisa","とうほうぷろじぇくと","金髮","魔炮","元氣少女","口癖","八卦爐"],"createdAt":1517756869989},{"companyId":"uWo3StQCA9JGzZSbq","name":"橘萬里花","chairman":"FvfycqzbZv98meYN9","manager":"FvfycqzbZv98meYN9","grade":"A","capital":237924,"price":370,"release":1855,"profit":364109.89999999997,"vipBonusStocks":1228.1,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":4,"nextSeasonEmployeesNumber":3,"tags":["橘萬里花","橘 万里花","たちばな まりか","偽戀","ニセコイ"],"createdAt":1517755129972},{"companyId":"ZqY7pWn6bsBfei6qG","name":"斯卡薩哈","chairman":"GzQhfEwZnTkNRujKg","manager":"GzQhfEwZnTkNRujKg","grade":"A","capital":425216,"price":446,"release":1661,"profit":78355,"vipBonusStocks":263,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["Fate/Grand Order","スカサハ","師匠","能登麻美子","巨乳","御姐","紫色BBA","斯卡哈"],"createdAt":1517753629956},{"companyId":"RRdM7mk7ZezsWDsYz","name":"食蜂操祈","chairman":"GzQhfEwZnTkNRujKg","manager":"mY8T2wTrnRobydgxG","grade":"A","capital":460544,"price":401,"release":1799,"profit":306847,"vipBonusStocks":514,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["食蜂 操祈","しょくほう みさき","魔法禁書目錄","とある魔術の禁書目録","某科學的超電磁炮","とある科学の超電磁砲","常盤台女王","巨乳","金髮","金瞳","白絲","過膝襪","絕對領域","星星眼","Level 5","Syokuhō Misaki"],"createdAt":1517753569956},{"companyId":"cnC99ENmXM8LfAzNz","name":"七罪","chairman":"bh7yDRqxmkvxWPox2","manager":"bh7yDRqxmkvxWPox2","grade":"A","capital":154786,"price":85,"release":1264,"profit":138273,"vipBonusStocks":617,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["デート・ア・ライブ","DATE A LIVE","なつみ","七罪","約會大作戰"],"createdAt":1517753509959},{"companyId":"xNw68FmABxRMWecjd","name":"水澤摩央","chairman":"eE8xqPG4j2o5CLCGR","manager":"eE8xqPG4j2o5CLCGR","grade":"C","capital":53882,"price":121,"release":1676,"profit":140407.2,"vipBonusStocks":1244.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["水澤摩央","君吻","キミキス","みずさわ"],"createdAt":1517707615613},{"companyId":"CZDvzQW6m2vMMeT32","name":"垣根帝督","chairman":"ZsPYdduwsh75j3CFF","manager":"ZsPYdduwsh75j3CFF","grade":"D","capital":18107,"price":23,"release":1119,"profit":0,"vipBonusStocks":59.98000000000006,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["垣根帝督","かきね ていとく","Kakine Teitoku","輕小說","轻小说","魔法禁書目錄","魔法禁书目录","とある魔術の禁書目録","インデックス","To Aru Majutsu no Indekkusu","A Certain Magical Index","漫畫","漫画","動畫","动画","遊戲","游戏","老二","冰箱","排球","超能力者","棕髮","棕发","茶髮","茶发","未元物質","白翼","LV5","Level5","第二位","DarkMatter","獨角仙05號","独角仙05号","科學超電磁砲","科学超电磁炮","科學一方通行","科学一方通行","J.C.STAFF","鎌池和馬","镰池和马","學園都市","学园都市","翅膀","找死","作死","暗部組織","暗部组织","學校","学校","School"],"createdAt":1517707615574},{"companyId":"6vNkm36ewbun34dhB","name":"本條二亞","chairman":"97Wc6p2NPFNDmeRxY","manager":"gsLWS6FjfB5SwPd3a","grade":"B","capital":77523,"price":228,"release":1202,"profit":26819.8,"vipBonusStocks":382.32,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["DATE A LIVE","デート・ア・ライブ","ほんじょう にあ","本條二亞","約會大作戰"],"createdAt":1517698675416},{"companyId":"eBdC68gXqMi96Ssaf","name":"棕熊","chairman":"bjXscGffs5qCnDrsq","manager":"bjXscGffs5qCnDrsq","grade":"C","capital":43615,"price":4,"release":3498,"profit":46215.75,"vipBonusStocks":647.3200000000002,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["動物朋友","Japari Park","Kemono Friends","けものフレンズ","獸娘動物園","動物好友","棕熊","ヒグママ","ヒグマ","Brown bear","熊媽媽"],"createdAt":1517690695337},{"companyId":"jLDyWAn58WPq9Tn5E","name":"本場切繪","chairman":"ZgqsW95hPxB2iW9RC","manager":"PuSRDXNHwvWA7NaD8","grade":"C","capital":62153,"price":41,"release":1942,"profit":19944,"vipBonusStocks":417,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["本場切繪","本場 切絵","干物妹！うまるちゃん","我家有個魚乾妹","干物妹！うまるちゃんR"],"createdAt":1517675575079},{"companyId":"JnL48K5PfzFCtHuCQ","name":"史黛菈·法米利昂","chairman":"QA9raFYTiZ5hwbMyy","manager":"eE8xqPG4j2o5CLCGR","grade":"A","capital":164480,"price":243,"release":1285,"profit":48875.99999999999,"vipBonusStocks":547.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["史黛菈·法米利昂","ステラ・ヴァーミリオン","落第騎士英雄譚","落第騎士の英雄譚"],"createdAt":1517663864064},{"companyId":"bcjvCSbSMZX7Ceuhe","name":"八舞夕弦","chairman":"sSy4gwNpDwQqhDf5A","manager":"sSy4gwNpDwQqhDf5A","grade":"A","capital":219291,"price":79,"release":2057,"profit":149163,"vipBonusStocks":929.2,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["デート・ア・ライブ","DATE A LIVE","やまい ゆづる","八舞夕弦","約會大作戰"],"createdAt":1517655463664},{"companyId":"kTjY8ktjvCDE3QnJL","name":"宇崎花","chairman":"9zgqJmrkArp5AqQvX","manager":"9zgqJmrkArp5AqQvX","grade":"D","capital":7956,"price":37,"release":1989,"profit":5456,"vipBonusStocks":91.00000000000006,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["宇崎花","丈(たけ)","ウザい後輩","宇崎ちゃんは遊びたい！","うざき","はな","デカァァァァァいッ説明不要!!","SUGOI DEKAI","巨乳","學妹","BOIN","おっぱい","虎牙","八重歯"],"createdAt":1517635722641},{"companyId":"witxkX584hiuxQfrZ","name":"依神紫苑","chairman":"pZR69fp9DtX8QYEbB","manager":"WDPzy7B7DAC2s66ff","grade":"D","capital":17392,"price":28,"release":1087,"profit":21531.7,"vipBonusStocks":531.2,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["東方憑依華","東方","東方project","東方計畫","貧窮","貧乏","貧窮神","貧乏神","不幸","依神紫苑"],"createdAt":1517623121898},{"companyId":"qoe4esDHLydRMrfB8","name":"乾依子","chairman":"eE8xqPG4j2o5CLCGR","manager":"wa5LAfzQS46jkA3r7","grade":"C","capital":55313,"price":104,"release":1522,"profit":145400.2,"vipBonusStocks":1136,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["乾依子","乾 依子","Just Because!"],"createdAt":1517619221769},{"companyId":"xLieSWEJXMRC5aMjp","name":"雨宿町","chairman":"XYvFThmQwLjexyDTB","manager":"ruq5PmEkc5h7fCQfc","grade":"C","capital":47936,"price":38,"release":1498,"profit":63717.25,"vipBonusStocks":594.5,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["熊巫女","雨宿町","雨宿 まち","あまやどり まち","くまみこ","當女孩遇到熊","巫女"],"createdAt":1517613401587},{"companyId":"RvnKDRhedmXb3CzK8","name":"夜刀神十香","chairman":"odcG6CgzeG97eiCGq","manager":"odcG6CgzeG97eiCGq","grade":"A","capital":224532,"price":92,"release":1755,"profit":36496.4,"vipBonusStocks":573.8,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["デート・ア・ライブ","DATE A LIVE","やとがみ とおか","約會大作戰","夜刀神十香","黃豆粉麵包","天然呆","吃貨","約戰","DAL"],"createdAt":1517609861546},{"companyId":"irXumDJh8fmgbJ5ZH","name":"神戶小鳥","chairman":"hEmBhvqRtuWCeD9ik","manager":"hEmBhvqRtuWCeD9ik","grade":"C","capital":59008,"price":35,"release":1844,"profit":62758.15,"vipBonusStocks":648.88,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["神戶小鳥","神戸小鳥","かんべ ことり","Rewrite","罰抄","改寫","齋藤千和","罰吹流下了悔恨的淚水","動畫？那是什麽？不存在的！","人類聖經（舊約）","田中羅密歐"],"createdAt":1517601161338},{"companyId":"3mYopKMPzLWcvyqhD","name":"阿皓","chairman":"Amk6FSNzFqR7RmM3D","manager":"Amk6FSNzFqR7RmM3D","grade":"D","capital":15049,"price":10,"release":1823,"profit":7596.6,"vipBonusStocks":210.26000000000005,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["阿皓","家有大貓","家有大貓：貓狗大戰","土狗","獸人","Nekojish"],"createdAt":1517593481253},{"companyId":"kLB9mJXkkaWnu8LTb","name":"拉姆 (Re:從零開始的異世界生活)","chairman":"yir6KneMwZHHmPdJ6","manager":"rQSA5gf4DvfpzxjzR","grade":"A","capital":497306,"price":1644,"release":1834,"profit":396900.85,"vipBonusStocks":525.55,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":3,"nextSeasonEmployeesNumber":2,"tags":["拉姆","Re：從零開始的異世界生活","ラム","Re：ゼロから始める異世界生活","拉姆親","ラムチ","Re:0","ReZero","妹控"],"createdAt":1517581300119},{"companyId":"cZC856caoDK938Mdp","name":"天秤","chairman":"PuSRDXNHwvWA7NaD8","manager":"PuSRDXNHwvWA7NaD8","grade":"C","capital":32032,"price":29,"release":1001,"profit":33432,"vipBonusStocks":731.56,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["Libra","天秤","終極動員令 紅色警戒2：尤里的復仇","Mental Omega","Command & Conquer: Yuri's Revenge","心靈終結","厄普西隆","心靈軍團"],"createdAt":1517580159983},{"companyId":"oBSBBvLDu2KGZvaff","name":"七海汐","chairman":"hEmBhvqRtuWCeD9ik","manager":"hEmBhvqRtuWCeD9ik","grade":"D","capital":17500,"price":8,"release":1096,"profit":0,"vipBonusStocks":6.300000000000011,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["七海汐","Nanami Shio","ななみ しお","刻痕Ⅲ -The Innocent Luna:Eclipsed SinnerS","Notch 3rd - The Innocent Luna:Eclipsed SinnerS","藍天使製作組"],"createdAt":1517552678017},{"companyId":"Lu63YdzEPRoFzyZx9","name":"海老名菜菜","chairman":"Y2Tt2pa3jEpxjCDn8","manager":"PuSRDXNHwvWA7NaD8","grade":"B","capital":122237,"price":91,"release":1907,"profit":87898,"vipBonusStocks":485.3,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["海老名菜菜","海老名 菜々","干物妹！うまるちゃん","我家有個魚乾妹","秋田妹","干物妹！うまるちゃんR"],"createdAt":1517536657510},{"companyId":"CHCfoRDtAmypWPdFA","name":"四糸乃","chairman":"6nycyyh2aYturGHhs","manager":"ZxKdDYwunQ9gaCdTB","grade":"A","capital":262912,"price":711,"release":1027,"profit":305072.25,"vipBonusStocks":422.6,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":3,"nextSeasonEmployeesNumber":0,"tags":["四糸乃","Yoshino","よしの","約會大作戰","デート・ア・ライフ","Date A Live","野水伊織","13歲","神威靈裝•四番","神威灵装•四番","冰結傀儡","氷結傀儡","ザドキエル","Zadkiel","隱居者","隐居者","Hermit","ハーミット","四糸奈","蘿莉"],"createdAt":1517529277212},{"companyId":"MNSb3rrpmaxrfiGz6","name":"賀佳","chairman":"pdKZNuvYYY4dZ3yzL","manager":"B5tG8BKfpBnaKF3ad","grade":"C","capital":56768,"price":48,"release":1770,"profit":165872,"vipBonusStocks":1656,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["賀佳","洋紅工房","百曲","山桂","百合"],"createdAt":1517528377195},{"companyId":"iyH3CJqBL9RLEmTYy","name":"Mogeko","chairman":"eirovQMXcWgCaMM5C","manager":"eirovQMXcWgCaMM5C","grade":"D","capital":5032,"price":5,"release":1257,"profit":3099.6,"vipBonusStocks":44.85000000000002,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["海底囚人","モゲコ","Mogeko Castle","Mogeko"],"createdAt":1517521837102},{"companyId":"JpT43daz2cZorDrZn","name":"庚夕子","chairman":"wyMZJt3nv45KKcr3Q","manager":"F2csihJ3LBHA49HN6","grade":"C","capital":53792,"price":66,"release":1681,"profit":54603,"vipBonusStocks":519,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["夕子","黃昏乙女","失憶幽靈","夕子學姐","かのえ ゆうこ","Dusk maiden of Amnesia","黄昏乙女×アムネジア","黃昏乙女×失憶幽靈"],"createdAt":1517512896965},{"companyId":"NXRsrJhyAYzQQ5chc","name":"烏干達納克魯斯","chairman":"2jBcSkbbcHiCFtsyH","manager":"biGcApKLNWBddpP8d","grade":"C","capital":33440,"price":57,"release":1045,"profit":8365,"vipBonusStocks":46.60000000000005,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["烏干達","VRChat","音速小子","地獄梗","烏干達納克魯斯","Ugandan Knuckles","ソニック・ザ・ヘッジホッグ"],"createdAt":1517510976924},{"companyId":"JiRkXDPebxSWGmrSh","name":"彌生(艦これ)","chairman":"i9EoLC9tq9aKb4Hxs","manager":"i9EoLC9tq9aKb4Hxs","grade":"B","capital":117120,"price":243,"release":1830,"profit":70330,"vipBonusStocks":580.9,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["彌生","艦隊これくしょん -艦これ-","駆逐艦","睦月型","艦隊Collection","艦これ","kancolle","驅逐艦","弥生","艦隊收藏","Kantai Collection"],"createdAt":1517500956722},{"companyId":"ZTvREAKkgZLTC3uhS","name":"西宮硝子","chairman":"ysWH2DiKFG7gZWG5S","manager":"HdmpLT4vbXWqzZNQh","grade":"A","capital":294656,"price":601,"release":1151,"profit":202285.7,"vipBonusStocks":347.96999999999997,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["西宮硝子","にしみや しょうこ","硝子","聲之形","聲の形"],"createdAt":1517493996438},{"companyId":"zFfzEHt3sDar3pnty","name":"不列顛飛行員(War Thunder)","chairman":"PuSRDXNHwvWA7NaD8","manager":"PuSRDXNHwvWA7NaD8","grade":"D","capital":16560,"price":14,"release":1035,"profit":10642,"vipBonusStocks":618.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["戰爭雷霆","War Thunder","不列顛飛行員","Nigel","英國","pilot model","UK pilot"],"createdAt":1517493216415},{"companyId":"8ATfDYrKJXFp6Rcfu","name":"高雄(碧藍航線)","chairman":"bjXscGffs5qCnDrsq","manager":"mY8T2wTrnRobydgxG","grade":"B","capital":133580,"price":151,"release":1972,"profit":178158.09999999998,"vipBonusStocks":893.6800000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["碧藍航線","碧蓝航线","高雄","Takao","たかお","Azur Lane","アズールレーン","艦B","姊姊","獒","高雄級重巡洋艦一番艦高雄號","巨乳","褲襪","武士刀","重櫻","長髮","薛丁格的胖次"],"createdAt":1517468255161},{"companyId":"RhCjHN9nCwtH2sKdx","name":"綾地寧寧","chairman":"FgeM93Nie3Pw9LYa3","manager":"7h9NHTPHpDeNKu9gv","grade":"B","capital":116288,"price":144,"release":1817,"profit":244776,"vipBonusStocks":1008.88,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["魔女的夜宴","サノバウィッチ","yuzusoft","Galgame","柚子社","桌角自慰","柚子自慰隊成員","あやち ねね","綾地寧寧","綾地 寧々","綾地 寧寧","綾地寧々"],"createdAt":1517465614995},{"companyId":"rCHAHrEagJiZPMSB9","name":"吉角絵美（吉角繪美）","chairman":"pdKZNuvYYY4dZ3yzL","manager":"pdKZNuvYYY4dZ3yzL","grade":"D","capital":16259,"price":7,"release":3637,"profit":16471,"vipBonusStocks":3140,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["吉角絵美","どとこい","吉角繪美","像素戀愛","吉角咲美"],"createdAt":1517458654862},{"companyId":"HKj6g4R6qFQrszrZc","name":"八雲藍","chairman":"9Di3k7cX7Mj9uFzAH","manager":"9Di3k7cX7Mj9uFzAH","grade":"B","capital":107008,"price":75,"release":1672,"profit":58356.9,"vipBonusStocks":669.16,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":1,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["金髮","幻想鄉","げんそうきょう","上海愛莉絲幻樂團","東方Project","彈幕","东方プロジェクト","Tōhō Project","TouHou Project","Yakumo Ran","式神","九尾狐","尾巴好像好暖和","油炸豆腐控","符卡","巨乳","人心","東方妖妖夢","素天狐","狐娘","尾巴","狐狸耳朵","蘿莉控","策士之九尾","珍稀動物","御姐","やくも らん"],"createdAt":1517455594667},{"companyId":"m8CNYg4fZeJEwnBDf","name":"西行寺幽幽子","chairman":"odcG6CgzeG97eiCGq","manager":"WDPzy7B7DAC2s66ff","grade":"B","capital":126016,"price":185,"release":1969,"profit":170744,"vipBonusStocks":486.35,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["西行寺幽幽子","西行寺幽々子","東方","東方project","東方計畫","東方妖妖夢","東方妖々夢　～ Perfect Cherry Blossom.","亡靈","大小姐"],"createdAt":1517450674504},{"companyId":"PNGqJQSexoMnQq7fb","name":"娜娜·阿斯塔·戴比路克","chairman":"ud98neSZijrtyZN4u","manager":"ud98neSZijrtyZN4u","grade":"A","capital":178432,"price":397,"release":1394,"profit":0,"vipBonusStocks":333.8,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["娜娜·阿斯塔·戴比路克","ナナ・アスタ・デビルーク","出包王女","To LOVEる -とらぶる","darkness","出包","娜娜","貧乳"],"createdAt":1517444674398},{"companyId":"Lk2ASD6w96znqTH6W","name":"MG4","chairman":"4AufqGDwHRxLJrKGT","manager":"4AufqGDwHRxLJrKGT","grade":"B","capital":87744,"price":34,"release":1371,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["少女前線","少前","少女前线","MG4"],"createdAt":1517442574363},{"companyId":"5nBSBSGGDxrWcJwjF","name":"法官","chairman":"ia9sxtNrL5giWbMHp","manager":"ia9sxtNrL5giWbMHp","grade":"B","capital":68160,"price":64,"release":1065,"profit":35820.8,"vipBonusStocks":399.08,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["少女前線","Girlsfrontline","Girl's Frontline","法官","鐵血人型","少前"],"createdAt":1517439754314},{"companyId":"h3BrxxLWGep5zKpwv","name":"莫德雷德","chairman":"pGKrcvcSHR7NXMBCd","manager":"pGKrcvcSHR7NXMBCd","grade":"A","capital":157560,"price":61,"release":1332,"profit":88080,"vipBonusStocks":689,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":500,"bonus":1,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["莫德雷德","saber","Fate/Apocrypha","モードレッド","小莫","FGO"],"createdAt":1517423914116},{"companyId":"wbzSk8vu2tZv4xawo","name":"土間埋","chairman":"v7y99GxYiiHTFcW3m","manager":"PuSRDXNHwvWA7NaD8","grade":"A","capital":324729,"price":243,"release":1281,"profit":358443,"vipBonusStocks":428.3,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":4,"tags":["土間埋","干物妹！うまるちゃん","我家有個魚乾妹","小埋","うまる","魚乾妹","干物妹","干物妹！うまるちゃんR","土間うまる"],"createdAt":1517421034080},{"companyId":"s4oj2fXjLimcGgzgZ","name":"成海ここあ（成海可可亞）","chairman":"pdKZNuvYYY4dZ3yzL","manager":"pdKZNuvYYY4dZ3yzL","grade":"C","capital":30701,"price":12,"release":2540,"profit":44281.4,"vipBonusStocks":1436.92,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["成海ここあ","どとこい","成海心愛","像素戀愛","成海可可亞"],"createdAt":1517414133810},{"companyId":"AwHjgohAhHweKcEvr","name":"萊薇","chairman":"QxjFg7YBq8e4cMnHB","manager":"HdmpLT4vbXWqzZNQh","grade":"C","capital":39904,"price":51,"release":1247,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["企業傭兵","黑礁","萊薇","BLACK LAGOON","ブラックラグーン","レヴィ","Two-Hand"],"createdAt":1517406693605},{"companyId":"aqxeErrqycdZDq7vF","name":"広崎 美奈","chairman":"7h9NHTPHpDeNKu9gv","manager":"7h9NHTPHpDeNKu9gv","grade":"C","capital":35852,"price":13,"release":2179,"profit":76226.4,"vipBonusStocks":1697.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["航跡雲的彼方","ひこうき雲の向こう側","飛機雲的彼端","FLAT","Galgame","ひろさき みな","廣崎 美奈","広崎 美奈","広崎美奈","廣崎美奈","ひろさきみな","砲灰","秋野花"],"createdAt":1517391453044},{"companyId":"iK5w4XpovnaLNjfQh","name":"M37(少女前線)","chairman":"sdPvxRzMmR9C5Bs4n","manager":"sdPvxRzMmR9C5Bs4n","grade":"B","capital":64192,"price":118,"release":2552,"profit":193593.2,"vipBonusStocks":1517.7,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["Girls' Frontline","少女前線","少女前线","★★★★","M37","Ithaca M37","伊薩卡","乳夾槍","巨乳","霰彈槍","奶霰"],"createdAt":1517375852807},{"companyId":"5PcW5dJjRgc7Wvdsi","name":"源賴光","chairman":"PPbTgbDXRcwR4PSzb","manager":"bePkR6aWWFHFC4Pju","grade":"B","capital":83701,"price":129,"release":1296,"profit":92663,"vipBonusStocks":499.28000000000003,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["源頼光","Minamoto Yorimitsu","みなもと の よりみつ","Fate/Grand Order","命運/冠位指定","FGO","媽媽","巨乳"],"createdAt":1517373032781},{"companyId":"nt3RBwX6dEMZqq9Gh","name":"Kar98k","chairman":"2L3Jxmg8GkBdX6TA4","manager":"ee7z9C4q4pGyTcGNn","grade":"A","capital":151168,"price":357,"release":1181,"profit":78970,"vipBonusStocks":485.76,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["少女前線","少女前线","少前","德皇","白髮","軍服","五星","合法蘿莉","巨乳蘿","소녀전선","茅野愛衣","★★★★★","步槍"],"createdAt":1517367812677},{"companyId":"PkzQxRStkJRdRZAGq","name":"夜羽(津島 善子)","chairman":"bh7yDRqxmkvxWPox2","manager":"bh7yDRqxmkvxWPox2","grade":"A","capital":226010,"price":130,"release":1651,"profit":569800.5,"vipBonusStocks":1177.04,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["夜羽","ヨハネ","ラブライブ!サンシャイン!!","つしまよしこ","津島善子","LLSS","LoveLive!Sunshine!!","ψ◥(ºω º｡)◤↷","よしりこ"],"createdAt":1517364452626},{"companyId":"SP5eBAiEgGBKBkTku","name":"金剛光","chairman":"j345n8fssFkbi4uCC","manager":"j345n8fssFkbi4uCC","grade":"B","capital":65593,"price":30,"release":1017,"profit":26186,"vipBonusStocks":566,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["金剛光","金剛","ヒカリ","こんごう ひかり","Kongou Hikari","我家有個魚乾妹","干物妹! うまるちゃん","小光"],"createdAt":1517355512400},{"companyId":"odcSR3qxzAS3eWmPb","name":"萬千歌","chairman":"DLrBdxSRRLGdZTCW9","manager":"2jEdKoLxjooZYm3nv","grade":"C","capital":62499,"price":22,"release":2221,"profit":103388,"vipBonusStocks":1529,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["架向星空之橋","星空へ架かる橋","萬千歌","よろず せんか","姐さん、女將","柚木要（遊戲） 河原木志穗（動畫）"],"createdAt":1517353352372},{"companyId":"CRSYwAZyGT4RW9XDR","name":"黑澤露比","chairman":"5hdjQ9EA4YZKjps46","manager":"hb9FBgr2s7hmz5pgx","grade":"A","capital":211050,"price":356,"release":1496,"profit":369796.60000000003,"vipBonusStocks":823.1,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["スイートポテト人間","?","黒澤ルビィ","Aqours","LoveLive! Sunshine!!","ラブライブ！サンシャイン!!","CYaRon!","がんばルビィ！⌒°( ･ω･)°⌒","降幡愛"],"createdAt":1517295091322},{"companyId":"P9rT9erx9Xq9zuRia","name":"御巫 千夜子","chairman":"7h9NHTPHpDeNKu9gv","manager":"7h9NHTPHpDeNKu9gv","grade":"C","capital":30278,"price":17,"release":1912,"profit":58356.5,"vipBonusStocks":1308.42,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["LIFE0","セヴンデイズ あなたとすごす七日間","與你共度的七日(?)","御巫千夜子","ちゃこ","上坂すみれ","みかなぎ ちやこ","Galgame","全年齡像","御巫 千夜子"],"createdAt":1517277530041},{"companyId":"w9QQCnuEnRw8aJyHz","name":"UMP45","chairman":"Ep7qv65hM3x7jf3zR","manager":"Ep7qv65hM3x7jf3zR","grade":"A","capital":174080,"price":162,"release":1360,"profit":36944.6,"vipBonusStocks":388.48,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["少女前線","少女前线","少前","Girls' Frontline","girls' frontline","UMP","UMP45","ump","ump45","45","45姐","404小隊","404","404 not found","404 NOT FOUND"],"createdAt":1517274049996},{"companyId":"8czH5kEQRNpBo7HtC","name":"國木田花丸","chairman":"sALMcpm2HSWCsaqrG","manager":"3Fki3Wd8qCCxTdgoa","grade":"B","capital":103052,"price":85,"release":1610,"profit":310987,"vipBonusStocks":810.55,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["LoveLive! 學園偶像祭","ラブライブ！スクールアイドルフェスティバル","スクフェス","LoveLive! School idol project","ラブライブ! School idol project","LoveLive! Sunshine!!","Aqours","ラブライブ! サンシャイン!!","AZALEA","國木田花丸","高槻加奈子","くにきだ はなまる","国木田 花丸","文學少女","吃貨","巨乳","茲拉","茲拉丸"],"createdAt":1517271649940},{"companyId":"PZFgySeAnXpqqYLnu","name":"藤堂紬","chairman":"2jEdKoLxjooZYm3nv","manager":"2jEdKoLxjooZYm3nv","grade":"B","capital":63430,"price":4,"release":6511,"profit":139552,"vipBonusStocks":6244,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":3,"tags":["藤堂紬","架向星空之橋","藤堂 紬（とうどう つむぎ，Toudou Tsumugi）","姐姐、巨乳、金髮","高橋智秋（動畫） 鈴木らん（遊戲）","R-18","星空へ架かる橋"],"createdAt":1517266609873},{"companyId":"5STT3pAHjXpFKo3vN","name":"安吉拉·巴爾扎克","chairman":"sdPvxRzMmR9C5Bs4n","manager":"mY8T2wTrnRobydgxG","grade":"A","capital":172800,"price":401,"release":1350,"profit":81598.5,"vipBonusStocks":507.08,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["樂園追放 -Expelled from Paradise-","安吉拉·巴爾扎克","アンジェラ・バルザック","Angela Balzac","金髮","碧眼","釘宮理惠","巨乳","傲嬌","楽園追放 -Expelled from Paradise-","安潔拉·巴爾扎克","下雙馬尾","らくえんついほう -エクスペルド フロム パラダイス-"],"createdAt":1517264329848},{"companyId":"C9JXQfXguntLzqwTp","name":"酒吞童子","chairman":"rQSA5gf4DvfpzxjzR","manager":"rQSA5gf4DvfpzxjzR","grade":"A","capital":191448,"price":75,"release":1541,"profit":187422,"vipBonusStocks":548.53,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["シュテンドウジ","酒吞童子","Fate/Grand Order","命運/冠位指定","FGO","ㄌㄌ","型月","TYPEMOON"],"createdAt":1517260429781},{"companyId":"r3mFfTrPY3peCTvoc","name":"琴葉","chairman":"Lc3TnA6xKHWYTSymZ","manager":"Crkz9Q7kbnvnCQKhs","grade":"A","capital":171186,"price":345,"release":1334,"profit":149377.40000000002,"vipBonusStocks":519.76,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["琴葉","ことは","三ツ星カラーズ","S","三顆星彩色冒險"],"createdAt":1517260129779},{"companyId":"CRMnSQdicpH5PffrC","name":"牛若丸","chairman":"PFEK8qMPEjHgQD6zy","manager":"PFEK8qMPEjHgQD6zy","grade":"C","capital":51324,"price":220,"release":1560,"profit":7800,"vipBonusStocks":673.1700000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["牛若丸","源義經","遮那王","FGO","フェイトグランドオーダー","牛肉丸"],"createdAt":1517214348680},{"companyId":"K8Rw7dSJ96gdorcZp","name":"九條可憐","chairman":"R62tmAsHpqL32pjtg","manager":"uxeXGbWwgCFiA269E","grade":"A","capital":175234,"price":148,"release":1369,"profit":98480,"vipBonusStocks":335.32,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["彩奈可愛","九條可憐","黃金拼圖","きんいろモザイク","九条 カレン"],"createdAt":1517198148317},{"companyId":"4wmwuZLGy3gMQD6HN","name":"神本圓佳","chairman":"QuuHBtk7Ngik3YKHK","manager":"2jEdKoLxjooZYm3nv","grade":"C","capital":35278,"price":21,"release":1103,"profit":41329,"vipBonusStocks":543.8,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["神本圓佳","神本 円佳(こうもと まどか)","架向星空之橋","いすずあすか（PC遊戲）/清水愛（TV動畫）","巫女 大和撫子 溫柔嫻淑 嬌小可人","星空へ架かる橋","R-18","成人"],"createdAt":1517177147965},{"companyId":"mBRnMWPRyBH9HuT8D","name":"布川莉里杏","chairman":"NJfSL759DdzfsxsAX","manager":"NJfSL759DdzfsxsAX","grade":"D","capital":7096,"price":2,"release":1774,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["布川莉里杏","AVG","漫畫","DMM Games","龍騎士07","祝姫","祝姬","和遙キナ","布里德卡特·塞拉·惠美","ぬのかわ りりあ"],"createdAt":1517172827892},{"companyId":"HnveC7WEycq8ZaWw5","name":"妮妙","chairman":"wunED8HsdncRLJ7Dh","manager":"wunED8HsdncRLJ7Dh","grade":"A","capital":152566,"price":122,"release":1187,"profit":57190,"vipBonusStocks":635,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["ニムエ","妮妙","拡散性ミリオンアーサー","乖離性ミリオンアーサー","乖離性百萬亞瑟王","擴散性百萬亞瑟王","妖精","refeia","小倉唯"],"createdAt":1517168567837},{"companyId":"7AcDJsXoENc5u2h99","name":"木下林檎","chairman":"Lc3TnA6xKHWYTSymZ","manager":"Lc3TnA6xKHWYTSymZ","grade":"B","capital":65936,"price":62,"release":1029,"profit":36976,"vipBonusStocks":195.8,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["木下林檎","農林","のうりん","きのしたりんご","ゆか!ゆか!ゆか!ゆか!ゆか!ゆか!　ゆーか!","ゆか!ゆか!ゆか!ゆか!超絶かわいい　ゆかたん!!"],"createdAt":1517160827757},{"companyId":"hFfiSTjM7gCmGbRSS","name":"金剛(蒼藍鋼鐵戰艦)","chairman":"QxjFg7YBq8e4cMnHB","manager":"QxjFg7YBq8e4cMnHB","grade":"B","capital":64640,"price":350,"release":1010,"profit":42295,"vipBonusStocks":426.12,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":3,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["《蒼藍鋼鐵戰艦》","蒼き鋼のアルペジオ","キングコング","金剛","金剛級戰艦"],"createdAt":1517160107741},{"companyId":"La4JWANaGqpTFutmh","name":"布蘭","chairman":"TCAS5pLc6zaeFLEfQ","manager":"b9hfWqHMdEnnZfnmh","grade":"B","capital":85440,"price":85,"release":1335,"profit":41668.4,"vipBonusStocks":580.92,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["ブラン","ホワイトハート","布蘭","群白之心","超次元遊戲 戰機少女","超次元ゲイム ネプテューヌ","超次元遊戲 海王星","女神","蘿莉","任天堂","Blanc","Wii","Famicom","Wii U"],"createdAt":1517157767713},{"companyId":"6w9ntWi5YRW8is456","name":"傭兵","chairman":"Amk6FSNzFqR7RmM3D","manager":"Amk6FSNzFqR7RmM3D","grade":"C","capital":33614,"price":23,"release":1062,"profit":15520,"vipBonusStocks":725.92,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["傭兵","從零開始的魔法書","獸人","獣の傭兵","ゼロから始める魔法の書","ゼロの書"],"createdAt":1517156087701},{"companyId":"TAg9tqpea8iWpaia6","name":"寄葉攻擊型二號機","chairman":"dscPCKAfbfCebGnv2","manager":"dscPCKAfbfCebGnv2","grade":"A","capital":184809,"price":113,"release":2587,"profit":270511.80000000005,"vipBonusStocks":1738,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["A2 ヨルハA型二号","NieR: Automata","寄葉攻擊型二號機","A2","YoRHA","Type A","No.2","尼爾:自動人形","ニーア","オートマタ","ヨルハ","諏訪彩花","大姊姊","傲嬌","長髮","短髮","ニーアオートマタ","attack"],"createdAt":1517153627693},{"companyId":"9hyxoevrBkcSwgGXj","name":"艾拉","chairman":"nfGAoNfoHRFgkjL5w","manager":"nfGAoNfoHRFgkjL5w","grade":"A","capital":160914,"price":651,"release":1261,"profit":160363.5,"vipBonusStocks":554.45,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["艾拉","アイラ","Plastic Memories","プラスティック・メモリーズ","可塑性記憶"],"createdAt":1517151167606},{"companyId":"XtXr837AfFX983Se6","name":"夏娜","chairman":"9cpfwFqzKHdpSC6jx","manager":"wa5LAfzQS46jkA3r7","grade":"A","capital":580294,"price":551,"release":1130,"profit":327008.5,"vipBonusStocks":269.9,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["夏娜","灼眼的夏娜","シャナ","Shana","炎發灼眼的討伐者","灼眼のシャナ","Flame-Haired Burning-Eyed Hunter·Shana"],"createdAt":1517149847590},{"companyId":"MyHacDrQ4fvnz6izw","name":"亞爾緹娜‧奧萊恩","chairman":"NW9bGqupdNuiN7pRo","manager":"TCAS5pLc6zaeFLEfQ","grade":"B","capital":83520,"price":106,"release":1305,"profit":72724.75,"vipBonusStocks":575.28,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["亞爾緹娜","奧萊恩","亞爾緹娜奧萊恩","アルティナ","オライオン","アルティナ・オライオン","閃之軌跡","閃の軌跡","黑兔","黒兎","ブラックラビット","Falcom","種田梨沙","水瀨祈","英雄伝説 閃の軌跡","英雄伝説","英雄傳說","英雄傳說 閃之軌跡","艾爾緹娜·奧萊恩"],"createdAt":1517148707583},{"companyId":"vLwLpFAyvWAmYjQTk","name":"薙切繪里奈","chairman":"ySEif8it44ywji9CZ","manager":"ee7z9C4q4pGyTcGNn","grade":"A","capital":470272,"price":175,"release":1837,"profit":64975,"vipBonusStocks":295.7,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["食戟之靈","種田梨沙","金元壽子","傲嬌","巨乳","薙切えりな","食戟のソーマ","食戟之灵","薙切绘里奈","薙切繪里奈"],"createdAt":1517148107583},{"companyId":"23ahWZb77gZCQGq5D","name":"翔鶴(艦これ)","chairman":"WdyhvouwtBCvrFQXQ","manager":"WdyhvouwtBCvrFQXQ","grade":"B","capital":105563,"price":345,"release":1598,"profit":165212.5,"vipBonusStocks":536.4200000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["翔鶴","艦隊これくしょん-艦これ","艦隊Collection","艦Colle","航空母艦","しょうかく","艦これ"],"createdAt":1517100247634},{"companyId":"3MAxMhFKbr22BXGwh","name":"北山雫","chairman":"sSy4gwNpDwQqhDf5A","manager":"sSy4gwNpDwQqhDf5A","grade":"A","capital":156020,"price":120,"release":2199,"profit":403949,"vipBonusStocks":1581.7600000000004,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["魔法科高中的劣等生","魔法科高校の劣等生","北山雫","きたやま しずく","Kitayama Shizuku","無口","貧乳"],"createdAt":1517097547607},{"companyId":"GrkMHCu4e6BtjNixp","name":"神原 駿河","chairman":"MiePKxWB8BYNrCWXo","manager":"rQSA5gf4DvfpzxjzR","grade":"D","capital":16000,"price":10,"release":1000,"profit":2,"vipBonusStocks":17.75,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["物語系列","物語","西尾維新","VOFAN","神原 駿河","かんばる するが","臥煙 駿河","がえん するが","澤成美雪","化物語","〈物語〉シリーズ"],"createdAt":1517096827601},{"companyId":"zK3hr7nRd9QoyGtNi","name":"艾米莉亞","chairman":"vbyMjZSFWps9ukwvk","manager":"cMWCrczoWMpiA3G6q","grade":"B","capital":82752,"price":360,"release":1293,"profit":65867.35,"vipBonusStocks":507.58,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["高捷","高捷娘","Emilia","艾咪","薛南","台德混血兒","高捷少女","艾米","艾米莉亞","simon","希萌"],"createdAt":1517095627582},{"companyId":"gG4hRZMKfEuNSZ7cp","name":"伊芙","chairman":"MSGC3gjsBSLHTZbDr","manager":"MSGC3gjsBSLHTZbDr","grade":"D","capital":27239,"price":68,"release":1300,"profit":38604.350000000006,"vipBonusStocks":633.71,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["伊芙","EVE","艾爾之光","艾爾搜查隊","泡芙","機娘","女王","貧乳","傲嬌","復仇女神","Code Nemesis","創造女皇","Code Empress","熾天女王","CodeBattleSeraph","Another Code","CN","CM","CBS","이브","엘소드","エルソード","Elsword","イヴ"],"createdAt":1517092747536},{"companyId":"eQaroXKfmGwEpMMJo","name":"貝爾法斯特(碧藍航線)","chairman":"P7A2S6b6pBhzvFHMP","manager":"P7A2S6b6pBhzvFHMP","grade":"B","capital":89280,"price":275,"release":1395,"profit":74892,"vipBonusStocks":479.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["貝爾法斯特","Belfast","金皮","皇家","輕巡","紫瞳","銀髮","女僕","白絲","巨乳","アズールレーン","Azur Lane","艦Ｂ","碧藍航線","ベルファスト","貝爺","女僕長"],"createdAt":1517091667518},{"companyId":"DZZ2LEzXYkwT7pXpW","name":"獨角獸(碧藍航線)","chairman":"48925zNjt86rsoFHX","manager":"3Fki3Wd8qCCxTdgoa","grade":"A","capital":158754,"price":421,"release":1239,"profit":214265.3,"vipBonusStocks":502.92,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["碧藍航線","碧蓝航线","艦B","妹妹","獨角獸","unicon","玩偶","德國骨科","皇家","輕母","蘿莉","貧乳","英國皇家海軍獨角獸號航母","ユニコーン(アズールレーン)"],"createdAt":1517089747493},{"companyId":"9R5z3PbCiv6HZjNrg","name":"結城友奈","chairman":"jPHrXKf5R8KJm8tXe","manager":"Crkz9Q7kbnvnCQKhs","grade":"B","capital":114416,"price":309,"release":1604,"profit":32276.5,"vipBonusStocks":668.7,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["結城友奈是勇者","結城友奈","結城友奈は勇者である","ゆうきゆうなはゆうしゃである","ゆうき ゆうな"],"createdAt":1517077387342},{"companyId":"gdrEN5JNzuzs3aeGq","name":"小護士","chairman":"RqQivWo4eSnFrKJTX","manager":"RqQivWo4eSnFrKJTX","grade":"C","capital":46048,"price":50,"release":1439,"profit":118957,"vipBonusStocks":1002.25,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["小護士","リトルナース","Little Nurse","The Mentholatum Little Nurse","曼秀雷敦","メンソレータム","Mentholatum","蘿莉","秀蘭·鄧波兒","今竹七郎"],"createdAt":1517067367222},{"companyId":"sEPdsrE3ZZPsEuAon","name":"犬山葵","chairman":"WBh6abvPLjkBhus9T","manager":"WBh6abvPLjkBhus9T","grade":"C","capital":52836,"price":180,"release":1558,"profit":98220.5,"vipBonusStocks":911.45,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["犬山葵","犬山 あおい","搖曳露營△","ゆるキャン△","豐崎愛生","あfろ","關西腔","芳文社"],"createdAt":1517025962717},{"companyId":"XJXPFBDNDaeeDEE7a","name":"丘比","chairman":"wS4RCNMaZb4PB63M9","manager":"wS4RCNMaZb4PB63M9","grade":"D","capital":19648,"price":32,"release":1228,"profit":16851,"vipBonusStocks":575.15,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["丘比","キュゥべえ","Kyubey","QB","魔法少女小圓","魔法少女まどか☆マギカ","芳文社","／人◕ ‿‿ ◕人＼","(◕ ‿‿ ◕)","馬猴燒酒"],"createdAt":1517015702328},{"companyId":"9ZcdbdQWmLqYNRHP3","name":"小惡魔(東方)","chairman":"bjXscGffs5qCnDrsq","manager":"bjXscGffs5qCnDrsq","grade":"C","capital":45479,"price":7,"release":9256,"profit":104942.6,"vipBonusStocks":8473.96,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["東方","小惡魔","こあくま","Little Devil","東方紅魔鄉","TouHou Project","东方Project","リートル デビッル","東方project","小悪魔"],"createdAt":1517013842308},{"companyId":"5nqR5Re4Bg7afyDo2","name":"雪女","chairman":"XjcgQqfKdRwN4xaFA","manager":"odcG6CgzeG97eiCGq","grade":"C","capital":50874,"price":40,"release":2408,"profit":77910,"vipBonusStocks":2315,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["雪女","秦時明月","阿雪","雪姬","秦時明月之百步飛劍","秦时明月","秦时明月之百步飞剑"],"createdAt":1517005262183},{"companyId":"GuWCqqcK8Nd6pYcw6","name":"雪白七七子","chairman":"XYvFThmQwLjexyDTB","manager":"XYvFThmQwLjexyDTB","grade":"D","capital":34007,"price":22,"release":1977,"profit":54702.5,"vipBonusStocks":1073.5499999999997,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["川柳少女","雪白七々子","川柳","五七五"],"createdAt":1517004122169},{"companyId":"FPxo52XHgi3ofBXPz","name":"凱茲","chairman":"YRh6w88YRhoDWsmdm","manager":"YRh6w88YRhoDWsmdm","grade":"D","capital":3508,"price":3,"release":1754,"profit":1805.55,"vipBonusStocks":24.30000000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["凱茲","嘎子","格斯","津","ガッツ","Guts","黑色剑士","烙印勇士","劍風傳奇","BERSERK","ベルセルク"],"createdAt":1516989421975},{"companyId":"6voimrpdybhnX7LXw","name":"林憲明","chairman":"wa5LAfzQS46jkA3r7","manager":"wa5LAfzQS46jkA3r7","grade":"D","capital":96707,"price":13,"release":5270,"profit":34412.5,"vipBonusStocks":3683.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["林憲明","林 憲明","博多豚骨拉麵","博多豚骨ラーメンズ","中國人","殺手","長直","黑絲","女裝大佬","YOOOOOOOO","冰塊"],"createdAt":1516988581967},{"companyId":"p7rBZrPGZwWTwGsNb","name":"帕秋莉·諾蕾姬","chairman":"W7PwXhStnmMBHxD9b","manager":"W7PwXhStnmMBHxD9b","grade":"B","capital":78408,"price":89,"release":1214,"profit":0,"vipBonusStocks":390.27,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["帕秋莉·諾蕾姬","パチュリー・ノーレッジ","帕秋莉·诺蕾姬","姆Q","東方Project","TouHou Project","東方プロジェクト","车万","東方紅魔鄉"],"createdAt":1516979521863},{"companyId":"oNrF3ZsmJ3eXvpa8M","name":"芳乃櫻","chairman":"fufhWoPehboA46pEy","manager":"fufhWoPehboA46pEy","grade":"D","capital":14325,"price":15,"release":1891,"profit":10753.199999999999,"vipBonusStocks":526.3500000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["芳乃櫻","D.C. 〜ダ・カーポ〜","芳乃さくら","初音島"],"createdAt":1516978621765},{"companyId":"HCx9NjxEibEKoBJhC","name":"百瀨華實","chairman":"cqDAETC6Dgw5DZQLw","manager":"cqDAETC6Dgw5DZQLw","grade":"D","capital":4052,"price":6,"release":1013,"profit":2507.25,"vipBonusStocks":24.150000000000006,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["百瀨華實","百瀬 華実","ももせ かじつ","Battle Spirits 少年激霸彈","Battle Spirits 少年激霸丹","妹妹","綠髮","無口","愛蟲的公主（虫愛ずる姫君）"],"createdAt":1516978081762},{"companyId":"QyEDsNCn7pYDCy4oc","name":"荒琦妹妹","chairman":"chbKpe5zYZcnkocCF","manager":"hEmBhvqRtuWCeD9ik","grade":"A","capital":1002758,"price":2,"release":272379,"profit":34200,"vipBonusStocks":272141,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":3,"nextSeasonEmployeesNumber":2,"tags":["荒琦妹妹","荒琦哲也的妹妹","Arasaki Tetsuya","あらさき てつや","刻痕Ⅲ -The Innocent Luna:Eclipsed SinnerS","Notch 3rd - The Innocent Luna:Eclipsed SinnerS","藍天使製作組"],"createdAt":1516969261653},{"companyId":"L9ERTFXge4df9wyWR","name":"端木蓉","chairman":"97Wc6p2NPFNDmeRxY","manager":"odcG6CgzeG97eiCGq","grade":"A","capital":170302,"price":58,"release":3435,"profit":283896,"vipBonusStocks":3391,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["端木蓉","秦時明月","Duanmu Rong","鏡湖醫仙","秦時明月之百步飛劍","秦时明月之百步飞剑","秦时明月"],"createdAt":1516960441266},{"companyId":"Aur4zjMqjCPtXmpN3","name":"月讀 調","chairman":"TcYn9NBmqQbd52Rd6","manager":"TcYn9NBmqQbd52Rd6","grade":"C","capital":53630,"price":16,"release":5741,"profit":127776,"vipBonusStocks":5407,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["月讀 調","つくよみ しらべ","戰姬絕唱","戦姫絶唱シンフォギア","塵鋸","戰姬絕唱SYMPHOGEAR"],"createdAt":1516941781082},{"companyId":"gusmnFxzMHg7DBH6R","name":"薩拉托加(碧藍航線)","chairman":"k4MBYKEzTfMdMshgz","manager":"k4MBYKEzTfMdMshgz","grade":"D","capital":24416,"price":12,"release":1525,"profit":3600,"vipBonusStocks":13.539999999999992,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["サラトガ","薩拉托加","碧藍航線","アズールレーン","Azur Lane","艦B"],"createdAt":1516938781134},{"companyId":"xvRyyBrz8XtSCpHpQ","name":"埃爾德里奇(碧藍航線)","chairman":"CM6o8gGPE8pjttGKo","manager":"CM6o8gGPE8pjttGKo","grade":"C","capital":40728,"price":8,"release":6952,"profit":95891.6,"vipBonusStocks":4882.42,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["埃爾德里奇","エルドリッジ","碧藍航線","アズールレーン","Azur Lane","艦B","蘿莉","呆毛","雙馬尾","無口"],"createdAt":1516935481008},{"companyId":"9y2zchPdHb3FWAW7n","name":"黑雪姬(黑雪公主)","chairman":"ZiHbcgbz7KQn6zRTk","manager":"eE8xqPG4j2o5CLCGR","grade":"B","capital":81154,"price":386,"release":1263,"profit":131637,"vipBonusStocks":637,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["黑雪姬","黑雪公主","加速世界","アクセル・ワールド"],"createdAt":1516931558570},{"companyId":"GTEwMhKbvxZFtPbA3","name":"吸血鬼(碧藍航線)","chairman":"sEc7vEXSNGsDtnuge","manager":"sEc7vEXSNGsDtnuge","grade":"B","capital":83451,"price":13,"release":4319,"profit":175898.3,"vipBonusStocks":3157.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["碧藍航線","アズールレーン","Azur Lane","艦B","吸血鬼","ヴァンパイア","Vampire","蘿莉","貧乳","黑絲","吊帶襪","髮帶","胖次","雙馬尾","傲嬌","銀髮","紅瞳","釘宮"],"createdAt":1516930838558},{"companyId":"7Dwv7P7SXmsjng5sg","name":"塞拉·希爾瓦斯","chairman":"8oCLAZdZ3yTL4aRBC","manager":"n3P3iqse6vQpGztFa","grade":"D","capital":26936,"price":25,"release":1660,"profit":19067,"vipBonusStocks":877,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["セラ＝シルヴァース","塞拉·希爾瓦斯","セラ","塞拉","Sara Silvers","塞拉·希尔瓦斯","壽美菜子","女帝","3","風之戰巫女","御風者","白犬","不正經的魔術講師與禁忌教典","ロクでなし魔術講師と禁忌教典","不正经的魔术讲师与禁忌教典"],"createdAt":1516928798339},{"companyId":"RRhpEbphdhKBPqu6P","name":"メア=S=エフェメラル","chairman":"7h9NHTPHpDeNKu9gv","manager":"gsLWS6FjfB5SwPd3a","grade":"D","capital":14540,"price":5,"release":2492,"profit":14664,"vipBonusStocks":1216.6,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["星空的回憶 -Wish upon a shooting star-","星空のメモリア -Wish upon a shooting star-","星空のメモリア Eternal Heart","星空的回憶 Eternal Heart","FAVORITE","favo社","杏子御津","メア·S·エフェメラル","梅婭‧S‧艾菲梅拉爾","Galgame","メア=S=エフェメラル","Mare=S=Ephemeral"],"createdAt":1516927298252},{"companyId":"uTJdHKc2T8Y36Bggc","name":"山田妖精","chairman":"Bkz5yqeHGAf7HrJNA","manager":"LqeYNy7zE5sEAo3DQ","grade":"A","capital":149632,"price":155,"release":1169,"profit":32482.449999999997,"vipBonusStocks":219.07999999999998,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["情色漫畫老師","山田妖精","山田老師","エミリー・グレンジャー","Emily Granger","エロマンガ先生","山田 エルフ","艾蜜莉·格蘭傑"],"createdAt":1516926518250},{"companyId":"bFs86PGhFZy9hwLD6","name":"長谷川・アイザック・泉・メルセデス・ジャココ","chairman":"7h9NHTPHpDeNKu9gv","manager":"7h9NHTPHpDeNKu9gv","grade":"D","capital":8604,"price":2,"release":2673,"profit":5774,"vipBonusStocks":386.13000000000005,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["しゅぷれ～むキャンディ ～王道には王道たる理由があるんです!～","Supreme Candy","：最高糖果～王道之所以為王道！～","長谷川·艾薩克·泉·梅賽德斯·雅可科","長谷川・アイザック・泉・メルセデス・ジャココ","枕","makura","Galgame"],"createdAt":1516925498230},{"companyId":"DHbMNGrb96Ap5FPQi","name":"美濃部鼎","chairman":"NJfSL759DdzfsxsAX","manager":"NJfSL759DdzfsxsAX","grade":"C","capital":41676,"price":44,"release":1301,"profit":116696,"vipBonusStocks":1173,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["美濃部鼎","AVG","漫畫","DMM Games","龍騎士07","祝姫","祝姬","和遙キナ","大坪由佳","美濃部 鼎","みのべ かなえ"],"createdAt":1516924778220},{"companyId":"qQiXyxfurzEoetFGv","name":"朱鷺亜伽","chairman":"2u6Qo3gSNg8aP2pTi","manager":"hEmBhvqRtuWCeD9ik","grade":"C","capital":69114,"price":5,"release":9696,"profit":10944,"vipBonusStocks":7712,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["朱鹭亜伽","朱鷺亜伽","Toki Aka","とき あか","刻痕Ⅲ -The Innocent Luna:Eclipsed SinnerS","Notch 3rd - The Innocent Luna:Eclipsed SinnerS","藍天使製作組"],"createdAt":1516924658216},{"companyId":"2owh5Ed7MLfz53AAY","name":"笨蛋內褲","chairman":"qqhJhXr2KKe2ckez6","manager":"7h9NHTPHpDeNKu9gv","grade":"D","capital":9948,"price":13,"release":1241,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["笨蛋內褲","飛天小褲褲","Panty Party","愛莉姆遊戲","baka panty","內褲派對"],"createdAt":1516924478216},{"companyId":"hGMJ3JZW2t3d3c7Dd","name":"克緹卡兒蒂","chairman":"T9bAmRDaLFKntmf3B","manager":"Crkz9Q7kbnvnCQKhs","grade":"D","capital":13608,"price":15,"release":1701,"profit":0,"vipBonusStocks":61.200000000000045,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["神曲奏界","克緹","克緹卡兒蒂","神曲奏界紅","克缇卡露蒂","神曲奏界Polyphonica","克緹卡兒蒂‧阿帕‧拉格蘭潔絲","始祖精靈","紅之女神","神曲奏界ポリフォニカ","コーティカルテ・アパ・ラグランジェス"],"createdAt":1516922678181},{"companyId":"tesq5a5BqvtjDevv9","name":"石蘭","chairman":"vWKEfkHvFmcdgPnrh","manager":"odcG6CgzeG97eiCGq","grade":"D","capital":27348,"price":18,"release":2499,"profit":20310.8,"vipBonusStocks":1450.7,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["石蘭","秦時明月","小虞","秦時明月之萬裏長城","石兰","秦时明月","秦时明月之万里长城"],"createdAt":1516911517868},{"companyId":"kdjrhjwGXga37kDNq","name":"奇諾","chairman":"szTJbswvcu44rAjr8","manager":"szTJbswvcu44rAjr8","grade":"B","capital":77414,"price":221,"release":1200,"profit":69864.05,"vipBonusStocks":483.47999999999996,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["奇諾","キノ","奇諾の旅 -the Beautiful World-","キノの旅 -the Beautiful World-"],"createdAt":1516899157563},{"companyId":"ytNjWddL9a4KAZ6pC","name":"婕兒","chairman":"d7LS7rorzJTj49xrQ","manager":"d7LS7rorzJTj49xrQ","grade":"B","capital":79232,"price":479,"release":1238,"profit":45737.5,"vipBonusStocks":126.95000000000003,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["婕兒","高捷少女"],"createdAt":1516897597435},{"companyId":"cB4dGXmxK98WBGPMR","name":"坂本","chairman":"G8TcNWFA2ricqn2sn","manager":"YRh6w88YRhoDWsmdm","grade":"D","capital":15056,"price":34,"release":1882,"profit":6802.75,"vipBonusStocks":22.920000000000044,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["坂本","坂本大佬","逼王","在下坂本，有何貴幹","我叫坂本我最屌","坂本ですが","さかもと","Sakamoto"],"createdAt":1516882776729},{"companyId":"vipKGEnLJRkL3uSKN","name":"吾妻 愛鈴","chairman":"vWKEfkHvFmcdgPnrh","manager":"7h9NHTPHpDeNKu9gv","grade":"D","capital":20577,"price":7,"release":2371,"profit":18249,"vipBonusStocks":1231.55,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["sweetlight","Galgame","しろのぴかぴかお星さま","吾妻 愛鈴","吾妻愛鈴","有栖川みや美","小白的閃閃發光的星大大(?)","學姐"],"createdAt":1516875516300},{"companyId":"5Sieg7PLuiEoPwMyy","name":"菈菈・薩塔琳・戴比路克","chairman":"ud98neSZijrtyZN4u","manager":"ud98neSZijrtyZN4u","grade":"B","capital":96313,"price":168,"release":1333,"profit":61155,"vipBonusStocks":286,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["菈菈・薩塔琳・戴比路克","ララ・サタリン・デビルーク","出包王女","出包","darkness","To LOVEる -とらぶる- ダークネス","To LOVEる -とらぶる","LALA","菈菈"],"createdAt":1516872396193},{"companyId":"rE2EsnRCBoryHbEAs","name":"森園立夏","chairman":"ghhBrGDpb6CGo42AH","manager":"ghhBrGDpb6CGo42AH","grade":"D","capital":8024,"price":17,"release":1003,"profit":4413.200000000001,"vipBonusStocks":72.25000000000003,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["森园立夏","もりぞの りっか","リッカ・グリーンウッド","初音島","D.C.III 〜ダ・カーポIII〜","森園立夏","初音岛Ⅲ","莉卡·格林伍德","初音島3","D.C.III～戀愛學園III～"],"createdAt":1516867776123},{"companyId":"i3Fcb7TedH6fuJCAz","name":"高月","chairman":"odcG6CgzeG97eiCGq","manager":"odcG6CgzeG97eiCGq","grade":"D","capital":17452,"price":23,"release":1774,"profit":25098,"vipBonusStocks":1678,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["高月","秦時明月","月儿","姬如千瀧","秦時明月之百步飛劍","秦時明月之萬裏長城","秦时明月之百步飞剑","秦时明月"],"createdAt":1516866516086},{"companyId":"KSLFKz2FitbL6Eexu","name":"大道寺知世","chairman":"hEmBhvqRtuWCeD9ik","manager":"hEmBhvqRtuWCeD9ik","grade":"B","capital":128482,"price":42,"release":2007,"profit":147462,"vipBonusStocks":713.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["大道寺 知世","だいどうじ ともよ","庫洛魔法使","魔卡少女櫻","百變小櫻魔術卡","カードキャプターさくら","Cardcaptor Sakura","木之本櫻","岩男潤子","怪獸"],"createdAt":1516866456223},{"companyId":"Cta3xhCxr9qWW7xYq","name":"星降 注","chairman":"c75uSy5ehKPCTqC7K","manager":"phcAQGMJTXBWYTdBC","grade":"D","capital":22144,"price":440,"release":1384,"profit":12798,"vipBonusStocks":111.45,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["星降 注","星降 そそぐ","☆色ガールドロップ","平 大地","星色Girl Drop","ポプテピピック","偶像","POP TEAM EPIC","星色ガールドロップ","粉毛","小倉 唯"],"createdAt":1516843895050},{"companyId":"L7MiXiocrTPo6SX27","name":"宮園薰","chairman":"Zoxst2T8hPpPmP9yu","manager":"SE2tLqhCaFa4SvxCs","grade":"B","capital":83648,"price":400,"release":1307,"profit":122155.4,"vipBonusStocks":713.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["宮園かをり","Miyazono Kaori","みやぞのかおり","四月是你的謊言","四月は君の嘘","新川直司","金髮","種田梨沙","小提琴","宮園薰","可麗露"],"createdAt":1516839754990},{"companyId":"cLoYj7sssJJHZ3Hct","name":"NTW-20","chairman":"NG9H39xidGDW5a6Au","manager":"NG9H39xidGDW5a6Au","grade":"C","capital":61667,"price":69,"release":1841,"profit":161280,"vipBonusStocks":1559,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["NTW-20","少女前線","少女前线","牛頭王","八倍大砲"],"createdAt":1516837774947},{"companyId":"qHRBWCgMyriZ8Ftvp","name":"Super SASS","chairman":"KeJktzGX8GgwFseSp","manager":"biGcApKLNWBddpP8d","grade":"C","capital":56896,"price":163,"release":1778,"profit":122491,"vipBonusStocks":903,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["Super SASS","SASS","AR-10","★★★","RF","步槍","簽到獎勵","JK","隱藏巨乳","開朗","活潑","隨和","實力派","狼行者","瞄準射擊","少女前線","少女前线","Girls' Frontline"],"createdAt":1516835734896},{"companyId":"LucDGZYQEpmdnbtpC","name":"朝倉音夢","chairman":"XbWpWvgvFTjxyCC3v","manager":"ghhBrGDpb6CGo42AH","grade":"D","capital":14706,"price":4,"release":1838,"profit":7021.549999999999,"vipBonusStocks":380.40000000000003,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["あさくら ねむ","Asakura Nemu","朝倉音夢","ダ・カーポ","D.C.","初音島"],"createdAt":1516824454626},{"companyId":"GwXmSFSnLpDptLXFs","name":"朝倉由夢","chairman":"XbWpWvgvFTjxyCC3v","manager":"ghhBrGDpb6CGo42AH","grade":"D","capital":13552,"price":5,"release":1694,"profit":7392.299999999999,"vipBonusStocks":375.44000000000005,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["初音島Ⅱ","D.C.II ～ダ・カーポII～","朝倉由夢","あさくら ゆめ","D.C.II"],"createdAt":1516823314609},{"companyId":"DZpKgCJrvrymQmAtr","name":"鴇羽美砂","chairman":"KeJktzGX8GgwFseSp","manager":"hEmBhvqRtuWCeD9ik","grade":"D","capital":8000,"price":23,"release":1000,"profit":3246.9000000000005,"vipBonusStocks":35.55000000000007,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["鸨羽美砂","鴇羽美砂","Tokiha Misa","ときは みさ","刻痕Ⅲ -The Innocent Luna:Eclipsed SinnerS","Notch 3rd - The Innocent Luna:Eclipsed SinnerS","藍天使製作組"],"createdAt":1516823194622},{"companyId":"AtDLSeeShMqsKsywt","name":"Monika(莫妮卡)","chairman":"RDKRuc46pPXwPp4La","manager":"RDKRuc46pPXwPp4La","grade":"B","capital":86419,"price":60,"release":1351,"profit":65254.8,"vipBonusStocks":333.25,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["Just Monika","Monika","莫妮卡","Doki Doki Literature Club","DDLC","心跳文學部"],"createdAt":1516822714607},{"companyId":"GQoKAjuGwXs6P5GK2","name":"卡比","chairman":"b9hfWqHMdEnnZfnmh","manager":"b9hfWqHMdEnnZfnmh","grade":"D","capital":7484,"price":9,"release":1871,"profit":3584.3,"vipBonusStocks":77.30000000000007,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["卡比","カービィ","星之卡比","星のカービィ","Kirby","粉紅惡魔","任天堂"],"createdAt":1516821934574},{"companyId":"kngkAMd4rAj2rMc5y","name":"少司命","chairman":"bu7JkRJq6Cd8BYdJN","manager":"odcG6CgzeG97eiCGq","grade":"D","capital":10680,"price":8,"release":1335,"profit":2619,"vipBonusStocks":13.070000000000022,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["少司命","秦時明月","少少","秦时明月","秦时明月之万里长城","秦時明月之萬裏長城"],"createdAt":1516821454551},{"companyId":"EuzWA6vgzvgbFWyKb","name":"雪鳥姬　亞迪莉娜●布路","chairman":"zp2yWRZkyvnwjRYxk","manager":"zp2yWRZkyvnwjRYxk","grade":"C","capital":45975,"price":66,"release":1828,"profit":106447.25,"vipBonusStocks":1543.75,"managerProfitPercent":0.05,"salary":1500,"nextSeasonSalary":1500,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["我家公主最可愛","ウチ姫","雪鳥姫 アデリーナ・ブルー","アデリーナ・ブルー","雪鳥姬　亞迪莉娜●布路","雪鳥姬","アデリーナ"],"createdAt":1516820314540},{"companyId":"k3X3KmubtEb9sQSvn","name":"阿比蓋爾·威廉士","chairman":"sdPvxRzMmR9C5Bs4n","manager":"sdPvxRzMmR9C5Bs4n","grade":"A","capital":146176,"price":269,"release":1142,"profit":154561.6,"vipBonusStocks":545.29,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["fate","Fate/Grand Order","アビゲイル･ウィリアムズ","Abigail Williams","阿比","銀鑰匙","泡泡","鑰匙孔","Foreigner","降臨者","異鄉人","亞種特異點IV","禁忌降臨庭園","塞勒姆","異端的塞勒姆","阿比蓋爾","威廉士"],"createdAt":1516818634515},{"companyId":"NMi5k4ZpiGYS39JvH","name":"阿斯托爾福","chairman":"TCdGHs8T2NSqXQqb5","manager":"RqQivWo4eSnFrKJTX","grade":"A","capital":249472,"price":560,"release":1949,"profit":175426.5,"vipBonusStocks":400.10999999999996,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["阿斯托爾福","アストルフォ","Astolfo","Rider","fate","Fate/Apocrypha","Fate/Grand Order","FGO","偽娘","理性蒸發","虎牙","吊帶襪","混沌·善","大久保瑠美","typemoon"],"createdAt":1516816294306},{"companyId":"fuvEu2MFRnK6KhDEo","name":"星野 綺拉拉","chairman":"bd7wjMHkAWDjsbsEj","manager":"bh7yDRqxmkvxWPox2","grade":"D","capital":11056,"price":9,"release":1382,"profit":7960.700000000001,"vipBonusStocks":236.7,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["星野 きらら（ほしの きらら）","星野綺拉拉","俺の妹がこんなに可愛いわけがない","我的妹妹哪有這麼可愛"],"createdAt":1516806874012},{"companyId":"8BarX5vbwcc5pKn6s","name":"蛭子影胤","chairman":"Qro83h9xCzFsKcZex","manager":"Qro83h9xCzFsKcZex","grade":"D","capital":15692,"price":4,"release":1964,"profit":4520,"vipBonusStocks":163.25,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["蛭子影胤","黑色子彈","ひるこ かげたね","ブラック・ブレット"],"createdAt":1516804773965},{"companyId":"camubnTRjuMnejvPT","name":"結城美柑","chairman":"NacYGNofcuWW3Fgh2","manager":"rQSA5gf4DvfpzxjzR","grade":"A","capital":200420,"price":108,"release":1567,"profit":114608,"vipBonusStocks":449.54,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["結城美柑","ゆうき みかん","Yuuki Mikan","花澤香菜","出包王女","To LOVEる -とらぶる-","兄控","能幹的妹妹"],"createdAt":1516803693934},{"companyId":"GtxQS9BNxEHpRpzYq","name":"磷葉石","chairman":"9LW3NypihaAcJvRtS","manager":"hEmBhvqRtuWCeD9ik","grade":"C","capital":63269,"price":38,"release":1977,"profit":103624,"vipBonusStocks":887,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["Zn2Fe(PO4)2·H2O","法斯","磷葉石","フォスフォフィライト","Phosphophyllite","寶石之國","宝石の国","Land of the Lustrous"],"createdAt":1516778913027},{"companyId":"h9nBd9XGKJpcTyyZS","name":"冷泉麻子","chairman":"pdKZNuvYYY4dZ3yzL","manager":"pdKZNuvYYY4dZ3yzL","grade":"B","capital":76702,"price":47,"release":1243,"profit":101263,"vipBonusStocks":866.1,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["少女與戰車","Girls Und Panzer","冷泉麻子","れいぜい まこ","ガールズ&パンツァー"],"createdAt":1516769192756},{"companyId":"5jd5fobjxXFFPxdua","name":"妮戈蘭","chairman":"ZwEs6Cxs5nZWSTsgG","manager":"YRh6w88YRhoDWsmdm","grade":"D","capital":20096,"price":46,"release":1256,"profit":2520,"vipBonusStocks":10.64,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["妮戈蘭","ナイグラート","末日時在做什麼？有沒有空？可以來拯救嗎？","終末なにしてますか？忙しいですか？救ってもらっていいですか？","Nygglatho","suka suka","吃貨"],"createdAt":1516756892176},{"companyId":"CiycKG58yaQty83NN","name":"五河琴里","chairman":"wNRZGLnytd7XCiZYQ","manager":"TCAS5pLc6zaeFLEfQ","grade":"A","capital":182410,"price":195,"release":1424,"profit":79952,"vipBonusStocks":736.8,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["竹達彩奈","妹妹","雙馬尾","傲嬌","精靈","蘿莉","約會大作戰","DATE A LIVE","デート・ア・ライブ","五河琴里","いつか ことり","Itsuka Kotori"],"createdAt":1516755992164},{"companyId":"sWFa4zaqL965wJKH7","name":"大澤悠","chairman":"fjJ8RrkJcC7oFYMrg","manager":"RDKRuc46pPXwPp4La","grade":"D","capital":15019,"price":4,"release":3188,"profit":13580,"vipBonusStocks":2013,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["大澤 悠","おおさわ ゆう","Osawa Yu","佐倉綾音","愛吃拉麵的小泉同學","ラーメン大好き小泉さん"],"createdAt":1516751672100},{"companyId":"TXJufH4tDNTcbJ3X7","name":"來栖 彼方","chairman":"bh7yDRqxmkvxWPox2","manager":"bh7yDRqxmkvxWPox2","grade":"D","capital":49512,"price":3,"release":10754,"profit":56606,"vipBonusStocks":10147.56,"managerProfitPercent":0.05,"salary":500,"nextSeasonSalary":2000,"bonus":1,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["來栖 彼方（くるす かなた）","《我的妹妹哪有這麼可愛》俺の妹がこんなに可愛いわけがない","来栖 彼方"],"createdAt":1516751492090},{"companyId":"iNy8cP835pHtcwfED","name":"小嶺幸","chairman":"ghhBrGDpb6CGo42AH","manager":"aLYDaoKWra4mhsHjR","grade":"D","capital":11600,"price":8,"release":1450,"profit":11889.4,"vipBonusStocks":81.94999999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["小嶺幸","FrontWing","灰色的果實","灰色的迷宮","灰色的樂園","グリザイアの果実","グリザイアの迷宮","グリザイアの楽園","こみね さち"],"createdAt":1516751012080},{"companyId":"tFX2RdyKufgBWuXZR","name":"春宮椿子","chairman":"NJfSL759DdzfsxsAX","manager":"Crkz9Q7kbnvnCQKhs","grade":"D","capital":14512,"price":3,"release":1820,"profit":3304,"vipBonusStocks":2.819999999999993,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["AVG","漫畫","DMM Games","龍騎士07","祝姫","祝姬","本多真梨子","春宮椿子","和遙キナ"],"createdAt":1516750952111},{"companyId":"RqsJxgrWyMX4GkvbB","name":"夏綠蒂·伊索亞爾","chairman":"3Dm5XFtoGL5vd9cMH","manager":"LqeYNy7zE5sEAo3DQ","grade":"A","capital":169014,"price":600,"release":1304,"profit":80417.5,"vipBonusStocks":390.67,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["龍王的工作！","りゅうおうのおしごと!","シャルロット・イゾアール","夏綠蒂·伊索亞爾","JS","小倉唯","白鳥士郎","しらび","project No.9"],"createdAt":1516750952080},{"companyId":"MHPWCY2Y2Fwsiyi6K","name":"沖田總司","chairman":"PFEK8qMPEjHgQD6zy","manager":"kDCmtjc8yaswyJ9Tz","grade":"B","capital":87016,"price":400,"release":1251,"profit":54511.5,"vipBonusStocks":252.89,"managerProfitPercent":0.05,"salary":1495,"nextSeasonSalary":1495,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["沖田總司","fate","おきたそうじ","沖田総司","OkitaSōji","悠木碧","saber","Fate/KOHA-ACE","Typemoon","Fate/Grand Order","新選組","帝都聖杯奇譚"],"createdAt":1516747532017},{"companyId":"dfHtKJHHvwszhAAHy","name":"金色暗影","chairman":"p2XtuyLczu3JTY9nj","manager":"p2XtuyLczu3JTY9nj","grade":"A","capital":164352,"price":243,"release":1284,"profit":71692,"vipBonusStocks":399,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":3,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["金色闇影","こんじきのやみ","金色暗影","出包王女","To LOVEる -とらぶる-","小暗","無口","殺手","イヴ","伊芙"],"createdAt":1516746451979},{"companyId":"a4JeW3p8of4LXE6o6","name":"貞德","chairman":"GzQhfEwZnTkNRujKg","manager":"RqQivWo4eSnFrKJTX","grade":"A","capital":330657,"price":1271,"release":1202,"profit":9731,"vipBonusStocks":197.96,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["貞德","ジャンヌ・ダルク","Jeanne d'Arc","Joan of Arc","Fate","Fate/Zero","Fate/Apocrypha","Fate/Grand Order","FGO","巨乳","凜嬌","ruler","typemoon","金髮","聖女","吃貨"],"createdAt":1516743031906},{"companyId":"GNmCePWg4NH4LgJa4","name":"羽丘芽美","chairman":"hEmBhvqRtuWCeD9ik","manager":"hEmBhvqRtuWCeD9ik","grade":"D","capital":7778,"price":3,"release":2093,"profit":3112,"vipBonusStocks":37.57000000000005,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["羽丘芽美","はねおか めいみ","怪盜Saint Tail","怪盜聖少女","怪盗 セイント・テール","櫻井智"],"createdAt":1516734091515},{"companyId":"X4ivhRSrEionzLTvQ","name":"戰場原黑儀","chairman":"d5uQDBqebXpFnGGjk","manager":"Crkz9Q7kbnvnCQKhs","grade":"A","capital":263978,"price":666,"release":1012,"profit":7373.5,"vipBonusStocks":315,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["物語","訂書姬","[[[[","化物語","戦場ヶ原 ひたぎ","戰場原黑儀","せんじょうがはら ひたぎ","齋藤千和","バケモノガタリ","モノガタリ"],"createdAt":1516727251360},{"companyId":"r9i6HEF3JWvndpgom","name":"友利奈緒","chairman":"s8XLxWMCPFc3nYhmj","manager":"s8XLxWMCPFc3nYhmj","grade":"B","capital":119872,"price":391,"release":1873,"profit":65740,"vipBonusStocks":376.60999999999996,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["友利奈緒","友利奈绪","Tomori Nao","Charlotte","シャーロット","夏洛特","ともり なお","麻枝准","Key社"],"createdAt":1516720771022},{"companyId":"snxb248siY4ozHkvA","name":"髏髏宮歌留多","chairman":"ZwEs6Cxs5nZWSTsgG","manager":"YRh6w88YRhoDWsmdm","grade":"C","capital":45568,"price":74,"release":1424,"profit":8670,"vipBonusStocks":51.80000000000001,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["髏髏宮歌留多","髏々宮カ兒タ","ろろみや かるた","Roromiya Karuta","妖狐×僕SS","妖狐×仆SS","花澤香菜","吃貨"],"createdAt":1516710330742},{"companyId":"5PshuGsQyfD64CgWf","name":"阿提拉","chairman":"64tTWZn54ARStPPTf","manager":"3Fki3Wd8qCCxTdgoa","grade":"B","capital":115072,"price":105,"release":1796,"profit":111687,"vipBonusStocks":759.42,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["Fate/Grand Order","Fate/EXTELLA","フェイト/グランドオーダー","アルテラ","アッテイラ","Artilla","阿提拉","能登麻美子","白髮"],"createdAt":1516705410546},{"companyId":"ruWjYNyG9mKwAZ2JY","name":"橘 姫花","chairman":"7h9NHTPHpDeNKu9gv","manager":"7h9NHTPHpDeNKu9gv","grade":"C","capital":52267,"price":28,"release":1865,"profit":149178,"vipBonusStocks":1524.75,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["sweetlight","しろのぴかぴかお星さま","橘 姫花","橘 姬花","小白的閃閃發光的星大大(?)","Galgame"],"createdAt":1516702350480},{"companyId":"558MTd7wAspJZjiGf","name":"谷口晴美","chairman":"2fhDx7mk2ab8dQQjN","manager":"wa5LAfzQS46jkA3r7","grade":"D","capital":23312,"price":32,"release":1457,"profit":18057.6,"vipBonusStocks":422.38,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["谷口晴美","谷口 はるみ","citrus ～柑橘味香氣～","シトラス","citrus","巨乳"],"createdAt":1516699170444},{"companyId":"Qc3hSYt8igKb29Px4","name":"村雨(艦これ)","chairman":"CXrPWFkWL3EgNk377","manager":"rQSA5gf4DvfpzxjzR","grade":"A","capital":187726,"price":245,"release":1427,"profit":293157.5,"vipBonusStocks":569.7499999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["艦隊收藏","艦隊Collection","艦これ","艦隊これくしょん","白露型","白露級","驅逐艦","親女兒","異色瞳","村雨","むらさめ","Murasame"],"createdAt":1516692270327},{"companyId":"fYPuJWeMezqD5YN5F","name":"莉娜·因巴斯","chairman":"2u6Qo3gSNg8aP2pTi","manager":"hEmBhvqRtuWCeD9ik","grade":"C","capital":85099,"price":5,"release":16322,"profit":11184,"vipBonusStocks":15642,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["リナ＝インバース","Lina Inverse","秀逗魔導士","魔劍美神","スレイヤーズ","Slayers","莉娜·因巴斯"],"createdAt":1516690290305},{"companyId":"9Q4jrtZm2JiPnbHaB","name":"迷路小瑪(瑪姬)","chairman":"wfK83xo2YBvoXycyN","manager":"wfK83xo2YBvoXycyN","grade":"B","capital":80768,"price":181,"release":1262,"profit":12286,"vipBonusStocks":12.730000000000004,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["小瑪","Magi","迷路小瑪","迷路小瑪在萬金","希萌創意","萬金聖母聖殿","屏東萬金"],"createdAt":1516683330038},{"companyId":"4bsJ5my8MYEpLPB9H","name":"瀧川吉野","chairman":"rQSA5gf4DvfpzxjzR","manager":"wa5LAfzQS46jkA3r7","grade":"B","capital":98209,"price":91,"release":1474,"profit":298831.5,"vipBonusStocks":976.89,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["絕園的暴風雨","絶園のテンペスト","瀧川吉野","滝川吉野","たきがわよしの"],"createdAt":1516669049633},{"companyId":"Ewncu7odkdqF4teCg","name":"巡音流歌","chairman":"CWgfhqxbrJMxsknrb","manager":"QaP4hihAMwjdERiya","grade":"C","capital":43140,"price":35,"release":2233,"profit":35780,"vipBonusStocks":835.95,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["巡音流歌","巡音 ルカ","めぐりね ルカ","Megurine Luka","VOCALOID","ボーカロイド","NetVOCALOID","章魚流歌","YAMAHA"],"createdAt":1516665569592},{"companyId":"aAoRCBqga6HRm55vY","name":"雷(艦隊Collection)","chairman":"SHNgQuNfQYf6M7f4J","manager":"ysWH2DiKFG7gZWG5S","grade":"B","capital":110670,"price":116,"release":1669,"profit":105093.5,"vipBonusStocks":881.85,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["雷","艦隊Collection","艦隊これくしょん","驅逐艦","艦これ","廢柴提督製造機","母性loli","蘿莉","虎牙","元氣","母性光輝","黑雷"],"createdAt":1516660289512},{"companyId":"uJ7Sng4JaXt7DDRtQ","name":"犬屋敷壹郎","chairman":"hEmBhvqRtuWCeD9ik","manager":"hEmBhvqRtuWCeD9ik","grade":"D","capital":6458,"price":1,"release":1623,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["殺戮重生犬屋敷","いぬやしき","犬屋敷壹郎","いぬやしき いちろう","大叔"],"createdAt":1516652129390},{"companyId":"Gp8fDT998z9GG8Rco","name":"湯姆 (Tom)","chairman":"hEmBhvqRtuWCeD9ik","manager":"REhovW6KCFPMeAtWf","grade":"D","capital":25040,"price":2,"release":1565,"profit":0,"vipBonusStocks":30.360000000000042,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["湯姆貓","Tom Cat","Thomas","Tom and Jerry","湯姆貓與傑利鼠","貓和老鼠","湯姆和傑瑞","童年陰影","成年陰影","細思極恐"],"createdAt":1516646969303},{"companyId":"9uc5NXR3e5P7bG8As","name":"千石撫子","chairman":"Kocai78d2vbXhbit2","manager":"mY8T2wTrnRobydgxG","grade":"A","capital":215296,"price":163,"release":1682,"profit":18975.6,"vipBonusStocks":95.57000000000002,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["千石撫子","せんごく なでこ","撫子","〈物語〉シリーズ","物語系列","花澤香菜","西尾維新","戀愛循環"],"createdAt":1516645829385},{"companyId":"xeseB4BippjyXdBiE","name":"小鳥遊六花","chairman":"wDZ9jRdCWvico4o3w","manager":"uXTizY7MBTWfh6h5C","grade":"A","capital":306176,"price":275,"release":1196,"profit":30290,"vipBonusStocks":22.150000000000013,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["小鳥遊六花","小鸟游六花","たかなし りっか","中二病でも恋がしたい!","Takanashi Rikka","中二病也想談戀愛"],"createdAt":1516642889244},{"companyId":"sR6mCzd44q6eNRz8Y","name":"紗世里","chairman":"ARs6xEb3KF3uj2Hep","manager":"ARs6xEb3KF3uj2Hep","grade":"B","capital":82176,"price":37,"release":1284,"profit":50432,"vipBonusStocks":508.95,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["紗世里","Sayori","Team Salvato","心跳文學部","棕髮","藍瞳","青梅竹馬","天然呆","五月病","壞掉","晴天娃娃","文學部","さより","蝴蝶結","DDLC","心跳文藝部","心跳文藝社","Doki Doki Literature Club!","賽優里","Third Eye"],"createdAt":1516641329222},{"companyId":"Cq86DYps8DiMT22rq","name":"蘿莉．麥丘利","chairman":"mY8T2wTrnRobydgxG","manager":"fufhWoPehboA46pEy","grade":"B","capital":96064,"price":180,"release":1501,"profit":79787.15,"vipBonusStocks":542.4200000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["ロゥリィ・マーキュリー","蘿莉．麥丘利","萝莉．麦丘利","ゲート 自衛隊 彼の地にて、斯く戦えり","GATE 奇幻自衛隊","種田梨沙","柳內巧","聖下","亞神","合法蘿莉","黑長直","ロリ","Rory Mercury","Loli"],"createdAt":1516640609213},{"companyId":"6SpAs8AQ8vAbeQGFb","name":"玉藻前","chairman":"LqeYNy7zE5sEAo3DQ","manager":"LqeYNy7zE5sEAo3DQ","grade":"A","capital":323584,"price":765,"release":1264,"profit":444018.10000000003,"vipBonusStocks":415.67,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":3,"nextSeasonEmployeesNumber":3,"tags":["Fate/EXTRA","Fate/EXTRA CCC","Fate/Grand Order","C狐","キャス狐","玉藻の前","良妻狐","Fate/EXTELLA","TYPE-MOON","玉藻前","Fate"],"createdAt":1516633889116},{"companyId":"4Ytrwn5RGcbaG8epZ","name":"乃木若葉","chairman":"jPHrXKf5R8KJm8tXe","manager":"MkdHyPyYWbAfNqWy3","grade":"C","capital":42688,"price":199,"release":1334,"profit":5247.5,"vipBonusStocks":35.58000000000004,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["乃木若葉","結城友奈是勇者","乃木若葉是勇者","乃木若葉は勇者である","乃木","若葉"],"createdAt":1516631069090},{"companyId":"GbswEmvWWa9og3tBu","name":"東鄉美森","chairman":"jPHrXKf5R8KJm8tXe","manager":"jPHrXKf5R8KJm8tXe","grade":"B","capital":84288,"price":199,"release":1317,"profit":21645,"vipBonusStocks":6.580000000000027,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["東鄉美森","結城友奈是勇者","結城友奈は勇者である","東郷 美森","鷲尾須美","鷲尾 須美","washio","わっし"],"createdAt":1516630649083},{"companyId":"ZmNAFQudLWDo7HiEn","name":"志摩凜","chairman":"WBh6abvPLjkBhus9T","manager":"hEmBhvqRtuWCeD9ik","grade":"B","capital":115572,"price":260,"release":1747,"profit":110111.7,"vipBonusStocks":635.8,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["志摩凜","志摩 リン","搖曳露營△","ゆるキャン△","東山奈央","あfろ","一月霸權"],"createdAt":1516630589080},{"companyId":"2kFNz4jigq53Zvnya","name":"朱鷺","chairman":"W7PwXhStnmMBHxD9b","manager":"W7PwXhStnmMBHxD9b","grade":"B","capital":77248,"price":16,"release":2643,"profit":0,"vipBonusStocks":1462.3000000000002,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["朱鷺","加帕裏好聲音","獸娘動物園","動物好友","けものフレンズ","Kemono Friends","Japari Park","トキ","動物朋友"],"createdAt":1516623628930},{"companyId":"mmzqMBmmEzGTyPnmo","name":"アウロラ","chairman":"d7sxzLyLwcG22AMQL","manager":"7h9NHTPHpDeNKu9gv","grade":"C","capital":41848,"price":22,"release":1307,"profit":91500,"vipBonusStocks":858,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["アウロラ","黑猫","黑貓","sweetlight","Galgame","しろのぴかぴかお星さま","奧蘿拉(?)","小白的閃閃發亮的星大大(?)"],"createdAt":1516612108196},{"companyId":"2hKaZZmX9YPJgdh7F","name":"黑貓 (Butch)","chairman":"hEmBhvqRtuWCeD9ik","manager":"hEmBhvqRtuWCeD9ik","grade":"D","capital":5569,"price":2,"release":1423,"profit":3047.4,"vipBonusStocks":32.410000000000025,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["布奇","Butch Cat","Tom and Jerry","湯姆貓與傑利鼠","貓和老鼠","湯姆和傑瑞"],"createdAt":1516603227987},{"companyId":"Tu8TK8Db42Jy7ymyW","name":"逢坂大河","chairman":"TSjMwuAxNvC9Lu5fE","manager":"TSjMwuAxNvC9Lu5fE","grade":"A","capital":208703,"price":605,"release":1627,"profit":495335.5,"vipBonusStocks":764.4,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["虎×龍","虎與龍","龍與虎","とらドラ!","逢坂大河","あいさか たいが","釘宮四萌","釘宫理惠","掌中老虎","傲嬌","毒舌","暴力女","貧乳","幼兒體型","過膝襪","絕對領域","TIGER×DRAGON！"],"createdAt":1516592487489},{"companyId":"graBHs4FK7hMbzELy","name":"白坂小梅","chairman":"HZ4saKMM4xfW8oKKk","manager":"3Fki3Wd8qCCxTdgoa","grade":"B","capital":73280,"price":85,"release":1145,"profit":23454.2,"vipBonusStocks":272.24,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["白坂小梅 （ しらさかこうめ ）","白坂小梅","偶像大師灰姑娘女孩","アイドルマスター シンデレラガールズ","COOL","金髮","萌袖","蘿莉","靈感","THE IDOLM@STER CINDERELLA GIRLS","偶像大师 灰姑娘女孩 星光舞台","アイドルマスター シンデレラガールズ スターライトステージ","櫻咲千依"],"createdAt":1516588467375},{"companyId":"rtANPnvqXbeEEkGX6","name":"松浦果南","chairman":"uJLpwqzZN535b7Yri","manager":"qr9KsqtW9y28EoHig","grade":"B","capital":96832,"price":78,"release":1513,"profit":92149,"vipBonusStocks":583.28,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["love live!!","ラブライブ! School idol project","lovelive!!","ラブライブ! サンシャイン!!","松浦果南","諏訪 ななか","Aqours","LoveLive!Sunshine!","aqours","LLSS"],"createdAt":1516581387215},{"companyId":"QmKSaWkMY7nMGBWcE","name":"小木曾 雪菜","chairman":"7njsm7hZAEfwk62t6","manager":"TfXXpcWWsk43TqPcd","grade":"B","capital":67595,"price":127,"release":2044,"profit":88020,"vipBonusStocks":1041,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["冬~馬~小~三~ 雪菜不能亡!!!","ホワイトアルバム2","white album","小木曾雪菜 おぎそ せつな","白色相簿2 WA2"],"createdAt":1516577487141},{"companyId":"kWFNtDnKwa769CZFZ","name":"冬馬和紗","chairman":"Bkz5yqeHGAf7HrJNA","manager":"64tTWZn54ARStPPTf","grade":"A","capital":187101,"price":370,"release":1218,"profit":165201,"vipBonusStocks":432.88,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["冬馬和紗","冬馬 かずさ","とうま かずさ","白色相簿2","WHITE ALBUM2","雪菜碧池"],"createdAt":1516576347130},{"companyId":"csiJj7hPnBkaRiDAm","name":"莓 ( CODE：015 )","chairman":"BvajcpjLpkCkRN5wZ","manager":"HGHXthbFjPCnd4REo","grade":"A","capital":314706,"price":1911,"release":1915,"profit":451857.5,"vipBonusStocks":813.29,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":2,"tags":["015","莓","イチゴ","DARLING in the FRANXX"],"createdAt":1516570227028},{"companyId":"qwKdRd7ps2j6qBePE","name":"艾絲·華倫斯坦","chairman":"JE9y435KL47jn6PJq","manager":"bjXscGffs5qCnDrsq","grade":"A","capital":179712,"price":305,"release":1404,"profit":121482.5,"vipBonusStocks":545.75,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["艾絲·華倫斯坦","アイズ・ヴァレンシュタイン","Aiz Wallenstein","在地下城尋求邂逅是否搞錯了什麼","ダンジョンに出会いを求めるのは間違っているだろうか","大森藤ノ","劍姬神聖譚","Lv.6","劍士","天然呆","無口","大西沙織","金髮","劍姬"],"createdAt":1516566806977},{"companyId":"39WWdDFzoHLh9NQtE","name":"澤村·史賓瑟·英梨梨","chairman":"sSy4gwNpDwQqhDf5A","manager":"xxPmXmrMEShmGp7gY","grade":"A","capital":482233,"price":595,"release":1882,"profit":128362.75,"vipBonusStocks":390.35999999999996,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":3,"nextSeasonEmployeesNumber":3,"tags":["澤村·史賓瑟·英梨梨","澤村・スペンサー・英梨々","さわむら・スペンサー・えりり","Sawamura Spencer Eriri","英梨梨","不起眼女主角培育法","冴えない彼女の育てかた","Eriri","柏木英理","柏木 エリ","err"],"createdAt":1516566026971},{"companyId":"398ZzxtwpFhSg2ota","name":"五島潤","chairman":"zp2yWRZkyvnwjRYxk","manager":"zp2yWRZkyvnwjRYxk","grade":"B","capital":63711,"price":52,"release":1989,"profit":22060,"vipBonusStocks":124.08000000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["五島潤","天使的3p","ごとうじゅん","天使の3P!","蘿莉","吉他手","樂隊","潤醬","大野柚布子"],"createdAt":1516562426886},{"companyId":"gqDiMbFXP92WYsHFC","name":"園城寺怜","chairman":"bh7yDRqxmkvxWPox2","manager":"Crkz9Q7kbnvnCQKhs","grade":"C","capital":47920,"price":39,"release":1527,"profit":64184,"vipBonusStocks":748.2,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["園城寺憐","天才麻將少女","憐","toki","咲-Saki","おんじょうじ とき","園城寺怜","天才麻將少女 阿知賀篇 episode of side-A","咲-Saki-阿知賀編 episode of side-A"],"createdAt":1516560386857},{"companyId":"DRpQZEAyDiuzTdDWB","name":"しろ","chairman":"7h9NHTPHpDeNKu9gv","manager":"7h9NHTPHpDeNKu9gv","grade":"C","capital":53516,"price":18,"release":6238,"profit":135678,"vipBonusStocks":5640.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["しろ","しろのぴかぴかお星さま","sweetlight","Galgame","犬耳","狗","寵物","白(?)","小白的閃閃發光的星大大(?)"],"createdAt":1516558526829},{"companyId":"Sq2wHZRgsf8qRyCok","name":"瑞鶴(艦これ)","chairman":"bePkR6aWWFHFC4Pju","manager":"2WuW6SNzMZgjWRJxy","grade":"A","capital":209524,"price":208,"release":1599,"profit":156466,"vipBonusStocks":676.75,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["艦これ","艦隊これくしょん","ずいかく","瑞鶴","小姨子","甲板胸","傲嬌","雙馬尾","艦隊Collection","艦隊收藏"],"createdAt":1516556486808},{"companyId":"jyeoJfetNg3ygbRRk","name":"克魯魯·采佩西","chairman":"97Wc6p2NPFNDmeRxY","manager":"b9hfWqHMdEnnZfnmh","grade":"A","capital":191232,"price":187,"release":1494,"profit":146287.3,"vipBonusStocks":632.52,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["克魯魯·采佩西","クルル・ツェペシ","終結的熾天使","終わりのセラフ","合法蘿莉","女王","吸血鬼"],"createdAt":1516546646264},{"companyId":"csbpP2ghrGzSnFayG","name":"珂朵莉·諾塔·瑟尼歐里斯","chairman":"nfGAoNfoHRFgkjL5w","manager":"nfGAoNfoHRFgkjL5w","grade":"A","capital":489472,"price":1300,"release":1945,"profit":228111,"vipBonusStocks":396.12,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":2,"tags":["終末なにしてますか？ 忙しいですか？ 救ってもらっていいですか？","末日時在做什麼？有沒有空？可以來拯救嗎？","珂朵莉·諾塔·瑟尼歐里斯","クトリ・ノタ・セニオリス","最幸福的女人"],"createdAt":1516545986262},{"companyId":"ApX7pB9BPQ9kjcyMq","name":"藍原柚子","chairman":"5R5jxqqr3MqBCLJFc","manager":"wa5LAfzQS46jkA3r7","grade":"B","capital":84266,"price":81,"release":1345,"profit":14472,"vipBonusStocks":527.53,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["藍原柚子","藍原 柚子","citrus ～柑橘味香氣～","シトラス","citrus","百合"],"createdAt":1516544966243},{"companyId":"2tnczJFWKB9CCPdnh","name":"霞之丘詩羽","chairman":"oHtw6jKBdtBbZ39Rm","manager":"mY8T2wTrnRobydgxG","grade":"A","capital":1222081,"price":2000,"release":1910,"profit":442119.49999999994,"vipBonusStocks":238.39999999999998,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":5,"nextSeasonEmployeesNumber":4,"tags":["霞之丘詩羽(霞ヶ丘詩羽)","路人女主的養成方法(冴えない彼女の育てかた)","かすみがおか うたは","茅野愛衣","Kasumigaoka Utaha","學姐","霞詩子（かすみ うたこ）","黑絲/黑長直/腹黑/色氣/髮箍/天才/巨乳"],"createdAt":1516543286176},{"companyId":"vq2ZZJoxDR4W9TWde","name":"普勒阿得斯星人","chairman":"Awgwn9QAuX7nFHtas","manager":"Awgwn9QAuX7nFHtas","grade":"D","capital":10308,"price":8,"release":1292,"profit":4424,"vipBonusStocks":15.519999999999982,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["普勒阿得斯星人","プレアデス星人","Pleiades Seijin","放學後的昴星團","放課後のプレアデス","會長","Wish Upon the Pleiades"],"createdAt":1516498944672},{"companyId":"5vXqCyq2biCoJ4PvP","name":"音無結弦","chairman":"rWRYoDCaT6LnzffhJ","manager":"rWRYoDCaT6LnzffhJ","grade":"B","capital":91249,"price":95,"release":1375,"profit":274266.7,"vipBonusStocks":867.37,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["音無","結弦","おとなし","ゆずる","Angel Beats!","音無結弦","エンジェルビーツ","イケメン","麻枝准","key","P.A. Works","神谷浩史","AB!","otonashi","yuzuru","貧乳","短髮","制服"],"createdAt":1516492644522},{"companyId":"Qd5cb65SoY5SFhkFv","name":"利姆露·坦派斯特","chairman":"h5mJWxnwEQnnqJ4t6","manager":"h5mJWxnwEQnnqJ4t6","grade":"C","capital":41984,"price":85,"release":1312,"profit":50973,"vipBonusStocks":405,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["關於我轉生後成為史萊姆的那件事","転生したらスライムだった件","利姆露·坦派斯特","リムル=テンペスト","無性別","井澤靜江","萌王","史萊姆","黏稠","萌主"],"createdAt":1516491324515},{"companyId":"ZZx6oa8rAfDQ9Litp","name":"黑神十重","chairman":"NJfSL759DdzfsxsAX","manager":"7h9NHTPHpDeNKu9gv","grade":"B","capital":104238,"price":95,"release":1613,"profit":300586.5,"vipBonusStocks":1143.75,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["黑神十重","祝姬","祝姫","龍騎士07","DMM Games","漫畫","AVG","黑長直","赤崎千夏","黑神 十重"],"createdAt":1516490064496},{"companyId":"ggZjrmDttnxiwHiKA","name":"綿木蜜雪兒(姆咪)","chairman":"8KBB5Pqk2zpZ3WYMh","manager":"3Fki3Wd8qCCxTdgoa","grade":"A","capital":178984,"price":433,"release":1279,"profit":260936,"vipBonusStocks":489.62,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":2,"tags":["綿木蜜雪兒","綿木ミシェル","姆咪","戰鬥女子高校","バトルガールハイスクール","戰鬥女子學園","三三","蜜蜜"],"createdAt":1516479564264},{"companyId":"7mhRt4eKtwgyodwjT","name":"蕾蒂西亞·德克雷亞","chairman":"inpQA4CZsqbRSpiMb","manager":"n3P3iqse6vQpGztFa","grade":"A","capital":212368,"price":268,"release":1607,"profit":140186,"vipBonusStocks":547.66,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":2,"tags":["蕾蒂西亞·德克雷亞","蕾蒂西亞","德克雷亞","レティシア＝ドラクレア","レティシア","ドラクレア","問題児たちが異世界から来るそうですよ？","問題兒童都來自異世界？","No Name","吸血鬼","純血の吸血姬","金髮","蘿莉","御姐","三無","女僕","魔王","巽悠衣子","Leticia Draculair","Leticia","蕾蒂西亚·德克雷亚","蕾蒂西亚","德克雷亚","问题儿童都来自异世界？","大緞帶","純潔の吸血姫","龍の遺影","蛇夫座","料理","貧乳","侍女長","長髮","Mondaiji-tachi ga Isekai Kara Kuru Sō Desu yo?","龍之湖太郎","たつのこ たろう","天之有","ももこ","Problem Children Are Coming","from Another World, Aren't They?","合法蘿莉"],"createdAt":1516478724372},{"companyId":"kKKjA95C4xaXJXbGn","name":"小曼(貓咪DAYS)","chairman":"CM6o8gGPE8pjttGKo","manager":"CM6o8gGPE8pjttGKo","grade":"C","capital":135662,"price":1,"release":62752,"profit":127064,"vipBonusStocks":62041.3,"managerProfitPercent":0.05,"salary":500,"nextSeasonSalary":500,"bonus":1,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["小曼","まー","にゃんこデイズ","貓咪DAYS","貓咪日常"],"createdAt":1516475124184},{"companyId":"aWvsFnH5rFK7ZL5Mp","name":"千矢","chairman":"9HpERNXAsnB8z8YQd","manager":"WDPzy7B7DAC2s66ff","grade":"B","capital":85720,"price":264,"release":1110,"profit":140655,"vipBonusStocks":254.85,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["千矢","ちや","うらら迷路帖","烏菈菈迷路帖","芳文社"],"createdAt":1516468044084},{"companyId":"qwDiqWhMiQ4ef6ZS3","name":"煌上花音","chairman":"Y8A2QtEevNHLxXhhN","manager":"Y8A2QtEevNHLxXhhN","grade":"C","capital":53914,"price":148,"release":1669,"profit":76101,"vipBonusStocks":683.2,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["こうがみ かのん","Battle Girl High School","バトルガール ハイスクール","戰鬥女子學園","戰女","煌上花音","傲嬌","踩","足控","金髮"],"createdAt":1516456223435},{"companyId":"EMuk2Hk3bXXokDLKm","name":"奈芙蓮","chairman":"QaP4hihAMwjdERiya","manager":"QaP4hihAMwjdERiya","grade":"B","capital":75584,"price":150,"release":1181,"profit":144040,"vipBonusStocks":520.48,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["奈芙蓮","奈芙蓮·盧可·印薩尼亞","ネフレン・ルク・インサニア","Nephren Ruq Insania","蓮","雙馬尾","蘿莉","三無","末日時在做什麼？有沒有空？可以來拯救嗎？","終末なにしてますか？忙しいですか？救ってもらっていいですか？","枯野瑛"],"createdAt":1516451843125},{"companyId":"xvwLTjq7bWRM9NoeF","name":"蕾米莉亞·斯卡蕾特","chairman":"pZR69fp9DtX8QYEbB","manager":"pZR69fp9DtX8QYEbB","grade":"B","capital":83456,"price":95,"release":1304,"profit":102637.1,"vipBonusStocks":617.84,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["東方Project","Touhou Project","とうほうぷろじぇくと","東方","蕾米莉亞·斯卡蕾特","レミリア・スカーレット","吸血鬼","蘿莉","ㄌㄌ","大小姐","姐姐","Remilia Sukāretto","Remilia Scarlet","幻想鄉","蕾咪莉亞·斯卡蕾特"],"createdAt":1516421722323},{"companyId":"Y9Te4Qi6c4Dbcjjtm","name":"神崎蘭子","chairman":"QuuHBtk7Ngik3YKHK","manager":"QuuHBtk7Ngik3YKHK","grade":"B","capital":103168,"price":163,"release":1612,"profit":57360,"vipBonusStocks":415.16,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["神崎蘭子","かんざきらんこ","Idolm@ster_Cinderella_Girls","アイドルマスター シンデレラガールズ","偶像大師灰姑娘女孩","Idolm@ster_Cinderella_Girls_Starlight_Stage","アイドルマスター シンデレラガールズ スターライトステージ","偶像大師灰姑娘女孩星光舞台","CGSS","中二病","蘭子語","熊本語","熊本方言","內田真禮","蘭蘭","蘭蘭路(誤)","闇に飲まれよ"],"createdAt":1516419201947},{"companyId":"eJCaub6642YvNxB3J","name":"尼托克里斯","chairman":"CvbuFezB8CXEziQpW","manager":"3Fki3Wd8qCCxTdgoa","grade":"D","capital":19698,"price":45,"release":1221,"profit":10346.2,"vipBonusStocks":26.65000000000002,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["ニトクリス","古埃及","梅傑德神","尼托克里斯","Fate/Grand Order","水着"],"createdAt":1516418901945},{"companyId":"k3PMMj5AApda8heT4","name":"蘇菲·諾伊恩謬拉","chairman":"8oCLAZdZ3yTL4aRBC","manager":"b9hfWqHMdEnnZfnmh","grade":"D","capital":23106,"price":69,"release":1389,"profit":37698.8,"vipBonusStocks":669.2,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["蘇菲·諾伊恩謬拉","ソフィー・ノイエンミュラー","ソフィーのアトリエ 〜不思議な本の錬金術士〜","蘇菲的工作室～不可思議之書的鍊金術士～","A17","光榮 KOEI"],"createdAt":1516417461924},{"companyId":"vr2DErjKgyuJL8qkM","name":"星空凜","chairman":"9zgqJmrkArp5AqQvX","manager":"9zgqJmrkArp5AqQvX","grade":"A","capital":136494,"price":400,"release":1858,"profit":369161.5,"vipBonusStocks":961.3100000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["Lovelive","偶像","ラブライブ！","μ's","肥皂","LL","星空凜","Rin","飯田里穂","飯田里穗","里P","りっぴー","凜喵","にゃ","凛","ほしぞら","りん","ほしぞらりん","アイドル","愛肝","繆思","繆斯","凜","拉麵","蜜柑","橘子","みかん","短髮","愛演","Yellow","黃色","黄色","lilywhite","リリホワ","リリーホワイト","西木野","真姬","真姫","西木野真姬","西木野真姫"],"createdAt":1516413681889},{"companyId":"SRwr29K6tx4uL9XpA","name":"十六夜咲夜","chairman":"9Di3k7cX7Mj9uFzAH","manager":"QaP4hihAMwjdERiya","grade":"B","capital":119911,"price":260,"release":1466,"profit":321456.25,"vipBonusStocks":635.54,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["十六夜咲夜","東方","女僕","紅魔館","いざよいさくや","Izayoi Sakuya","Tonhou","ZUN","メイド","PAD","完全で瀟洒な従者"],"createdAt":1516411641850},{"companyId":"v8TxxK5mEacGk9DoG","name":"絢櫻","chairman":"5cqhHAYj5KLTSWE3S","manager":"XYvFThmQwLjexyDTB","grade":"B","capital":124719,"price":766,"release":1914,"profit":172124,"vipBonusStocks":543.4799999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":3,"nextSeasonEmployeesNumber":2,"tags":["絢櫻","蝦蝦","櫻花蝦","東津萌米-穗姬","深海棲蝦","初夏的東港之櫻","《絢櫻小教室》","粉紅的切開來裡面都是黑的","Simon"],"createdAt":1516409961827},{"companyId":"GQoBHB6Z6YNSaYJjw","name":"主人","chairman":"sSy4gwNpDwQqhDf5A","manager":"sSy4gwNpDwQqhDf5A","grade":"C","capital":51873,"price":50,"release":1565,"profit":152721,"vipBonusStocks":1288.75,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["主人","獸耳少女與主人","ご主人様と獣耳の少女メル","伊藤ハチ","主人さま","百合"],"createdAt":1516404861765},{"companyId":"uh3fw7tG3NfY7JH5g","name":"庸子(優子)(陽子)","chairman":"CMCqHBvoqpNC5cXDB","manager":"3Fki3Wd8qCCxTdgoa","grade":"D","capital":9760,"price":20,"release":1220,"profit":5176.5,"vipBonusStocks":21.740000000000023,"managerProfitPercent":0.05,"salary":666,"nextSeasonSalary":666,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["天元突破","優子","Yoko","天元突破グレンラガン","天元突破紅蓮螺岩","庸子","ヨーコ"],"createdAt":1516402281721},{"companyId":"c6YL8zbXDHXJLHEqm","name":"朝田詩乃","chairman":"uFyeh6WGC6CzxCzKA","manager":"Crkz9Q7kbnvnCQKhs","grade":"A","capital":149504,"price":257,"release":1168,"profit":44644,"vipBonusStocks":278.67,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["朝田詩乃","あさだ しの","刀劍神域","ソードアート・オンライン","詩乃","川原礫"],"createdAt":1516399461671},{"companyId":"ZNtsbYmfrJk7rA6wR","name":"愛麗絲・辛賽西斯・薩提 ( 愛麗絲・滋貝魯庫 )","chairman":"szTJbswvcu44rAjr8","manager":"3QnnNMpkCsWfbovSc","grade":"A","capital":215652,"price":615,"release":1681,"profit":155901.5,"vipBonusStocks":329.95,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["愛麗絲.辛賽西斯.薩提","Alice·Synthesis·Thirty","愛麗絲·滋貝魯庫","アリス・ツーベルク","アリス・シンセシス・サーティ","刀劍神域","Sword Art Online","SAO"],"createdAt":1516394541602},{"companyId":"wwGyHj8AFmdsmD9xn","name":"藤倉優","chairman":"mY8T2wTrnRobydgxG","manager":"QaP4hihAMwjdERiya","grade":"C","capital":53537,"price":35,"release":1638,"profit":92524.4,"vipBonusStocks":929,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["藤倉優","ふじくらゆう","公主戀人","プリンセスラバー!","Princess Lover!","女僕","R18"],"createdAt":1516365501057},{"companyId":"8nDdfA5mZLF5wA43Z","name":"小新(貓咪DAYS)","chairman":"knAQHjGdBFb7xeCHi","manager":"CM6o8gGPE8pjttGKo","grade":"D","capital":14926,"price":4,"release":1867,"profit":0,"vipBonusStocks":2.280000000000001,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":1,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["小新","しー","にゃんこデイズ","貓咪DAYS","貓咪日常"],"createdAt":1516333340360},{"companyId":"c6G2hWu9tqTMK8NpH","name":"我妻由乃","chairman":"fjJ8RrkJcC7oFYMrg","manager":"392gz6xeecX2knSYh","grade":"A","capital":155904,"price":637,"release":1218,"profit":166854.4,"vipBonusStocks":539.8,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["我妻 由乃","がさい ゆの","Gasai Yuno","2nd","村田知沙","未来日记","病嬌","ヤンデレ","未來日記"],"createdAt":1516324219844},{"companyId":"HG3gGRJs5htRQvJ2J","name":"水澤千里","chairman":"uKvExKaZnuWJK844J","manager":"YRh6w88YRhoDWsmdm","grade":"D","capital":24240,"price":57,"release":1515,"profit":12779,"vipBonusStocks":86.30000000000008,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["水澤千里","水沢千里","Chisato Mizusawa","お酒は夫婦になってから","品酒要在成為夫妻後","醉娇"],"createdAt":1516321459812},{"companyId":"zCcSH4YJ5PJiKAvRi","name":"牧野神奈","chairman":"72NukfAXbYY9iFsu2","manager":"72NukfAXbYY9iFsu2","grade":"B","capital":137630,"price":40,"release":2431,"profit":326839.5,"vipBonusStocks":2206.25,"managerProfitPercent":0.05,"salary":500,"nextSeasonSalary":500,"bonus":1,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["牧野神奈","玉子市場","京都動畫","たまこまーけっと","牧野かんな","直尺少女"],"createdAt":1516319479771},{"companyId":"F3wPYeBzG8fT7mpsq","name":"茉茉·貝莉雅·戴比路克","chairman":"ud98neSZijrtyZN4u","manager":"ud98neSZijrtyZN4u","grade":"A","capital":214400,"price":275,"release":1675,"profit":28192.5,"vipBonusStocks":20.20000000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["出包王女","DARKNESS","茉茉","momo","モモ・ベリア・デビルーク","To LOVEる -とらぶる-","To LOVE","To LOVEる -とらぶる- ダークネス"],"createdAt":1516309699632},{"companyId":"J8fbsrre3Q2bJ9Enh","name":"許墨","chairman":"dPYGagPm6RGXEdLHa","manager":"dPYGagPm6RGXEdLHa","grade":"D","capital":28284,"price":8,"release":2358,"profit":45052,"vipBonusStocks":1996.4,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["許墨 许墨 XuMo","戀與製作人 恋与制作人","夏磊 平川大輔","超現實 超能力 戀愛 經營 養成 乙女 手遊","天才科學家 Evolver Black Swan","許撩撩 許教授 許老師 許黑土 许撩撩 许教授 许老师 许黑土"],"createdAt":1516301779514},{"companyId":"QrN4ijHAfNrbNoj4e","name":"宮永咲","chairman":"5hdjQ9EA4YZKjps46","manager":"5hdjQ9EA4YZKjps46","grade":"B","capital":91171,"price":83,"release":1410,"profit":38422,"vipBonusStocks":566.22,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["咲-Saki","宮永咲","みやながさき","天才麻將少女","大魔王","嶺上開花","嶺上娘"],"createdAt":1516301539517},{"companyId":"FHXM5buG64jo5SKwZ","name":"虎爺","chairman":"Amk6FSNzFqR7RmM3D","manager":"Amk6FSNzFqR7RmM3D","grade":"D","capital":24032,"price":24,"release":1482,"profit":20380,"vipBonusStocks":1105.9,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["虎爺","家有大貓","林虎","獸人","Guardian Tiger","Nekojishi","Lin Hu","家有大貓：貓狗大戰"],"createdAt":1516293019367},{"companyId":"ApPvug5trC7AgzDtG","name":"北狐","chairman":"d7sxzLyLwcG22AMQL","manager":"d7sxzLyLwcG22AMQL","grade":"B","capital":69399,"price":20,"release":1084,"profit":0,"vipBonusStocks":57.53,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["北狐","キタキツネ","宅狐","動物好友","獸娘動物園","けものフレンズ","Kemono Friends","加帕裏","Japari Park","動物朋友"],"createdAt":1516277719136},{"companyId":"oHp78bjoMPkYwaspL","name":"宇治松千夜","chairman":"TcYn9NBmqQbd52Rd6","manager":"TcYn9NBmqQbd52Rd6","grade":"A","capital":164242,"price":400,"release":1218,"profit":306178.5,"vipBonusStocks":633.44,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["宇治松千夜","うじまつ ちや","チヤ","佐藤聰美","請問您今天要來點兔子嗎？","ご注文はうさぎですか?","點兔"],"createdAt":1516245738589},{"companyId":"Tkf4nPcP2jEiJ78ad","name":"艾利亞斯.恩茲華斯","chairman":"gqd8PKAnwCJsYs5SQ","manager":"Crkz9Q7kbnvnCQKhs","grade":"D","capital":9248,"price":17,"release":1156,"profit":1860,"vipBonusStocks":15.939999999999998,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["魔法使的新娘","魔法使いの嫁","艾利亞斯·恩滋華斯","エリアス・エインズワース"],"createdAt":1516240338417},{"companyId":"ysq5ZZ24T5zstRc9w","name":"切姬夜架","chairman":"EJ9vQqhiitbmmTvWh","manager":"Crkz9Q7kbnvnCQKhs","grade":"C","capital":53564,"price":43,"release":1673,"profit":0,"vipBonusStocks":81.85,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["切姬夜架","Kirihime Yoruka","きりひめ　よるか","最弱無敗神裝機龍","最弱無敗の神装機竜","羽羽斬夜架","異色瞳","帝國凶刃","弟控","腹黑","黑長直","姐姐","公主","過膝襪","髮帶","僕人","夜襲","工口"],"createdAt":1516239678381},{"companyId":"Y6wFNhGzD2XR8nfpJ","name":"菅生明日香","chairman":"REhovW6KCFPMeAtWf","manager":"REhovW6KCFPMeAtWf","grade":"D","capital":13760,"price":35,"release":1720,"profit":0,"vipBonusStocks":50.349999999999966,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["閃電霹靂車","新世紀GPXサイバーフォーミュラ","高智能方程式","菅生あすか","三石琴乃","Future GPX Cyber Formula","Kotono Mitsuishi","菅生明日香"],"createdAt":1516207217976},{"companyId":"ggvcs4XT5sbEaNkpw","name":"顏書齊","chairman":"Amk6FSNzFqR7RmM3D","manager":"Amk6FSNzFqR7RmM3D","grade":"D","capital":23910,"price":17,"release":1324,"profit":11525.25,"vipBonusStocks":872.02,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["顏書齊","家有大貓","石虎","獸人","Nekojishi","Leopard Cat","家有大貓：貓狗大戰"],"createdAt":1516204877957},{"companyId":"ZduDqpDfeq9g9SYiN","name":"拉恩托露可·伊茲莉·希斯特裏亞","chairman":"K9vyNn2QqLdZGSg72","manager":"YRh6w88YRhoDWsmdm","grade":"B","capital":68369,"price":160,"release":1044,"profit":30300,"vipBonusStocks":391.8,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["拉恩托露可·伊茲莉·希斯特裏亞","蘭","ラーントルク・イツリ・ヒストリア","末日時在做什麼？有沒有空？可以來拯救嗎？","終末なにしてますか? 忙しいですか? 救ってもらっていいですか?","色氣"],"createdAt":1516191677752},{"companyId":"ezGboCt5BnxwYgM9n","name":"夕立(艦これ)","chairman":"dKtdrG9RZag33k5EH","manager":"dKtdrG9RZag33k5EH","grade":"B","capital":99904,"price":173,"release":1561,"profit":80738,"vipBonusStocks":423.55,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["艦隊これくしょん-艦これ-","艦Colle","艦C","KantaiCollection","KanColle","艦隊收藏","夕立","yudachi","ゆうだち","索羅門的惡夢","poi","白露型","驅逐艦","艦隊Collection"],"createdAt":1516142837087},{"companyId":"LwoZwhgFHp5wKW9Gv","name":"阿克婭","chairman":"NJfSL759DdzfsxsAX","manager":"2MnixRrWRWFsYuqa9","grade":"A","capital":729256,"price":2000,"release":1611,"profit":714087.3500000001,"vipBonusStocks":438.0799999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":6,"nextSeasonEmployeesNumber":8,"tags":["阿克婭","アクア","Aqua","阿庫婭","為美好的世界獻上祝福！","この素晴らしい世界に祝福を!","KonoSuba: God's Blessing on This Wonderful World!","このすば","美好世界","暁なつめ","曉夏目","三嶋黑音","三嶋くろね","廢柴女神","水之女神","宴會之神","駄女神さま","無鉄砲","敗家","藍髮","長直髮","白絲","真空","過膝靴","環形辮","阿克塞爾","智O","O障","雨宮天","福原香織","阿克西斯教","阿克西斯教派水之智慧女神阿克婭大人乃唯一救贖","艾莉絲的胸部是墊出來的","穿還是沒穿，這是個問題","ㄇㄉㄓㄓ","MDZZ","H2O","一氧化二氫","雜技","廁所","大祭司","酒鬼","花鳥風月","多才多藝","屬性祝福","治癒術、復活術、淨化術、驅魔、解咒、召水、結界、瞬移、乾燥術","茶包"],"createdAt":1516130596879},{"companyId":"RoxzrgtqHgrqoZjKf","name":"莉莉艾","chairman":"Rt2YTcbFMkFq7xpCc","manager":"b9hfWqHMdEnnZfnmh","grade":"D","capital":22448,"price":61,"release":1403,"profit":22862.2,"vipBonusStocks":941.1099999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["精靈寶可夢 太陽 月亮","究極之日","究極之月","ポケットモンスター サン ムーン","ウルトラサン","ウルトラムーン","ポケモン","莉莉艾","リーリエ","Pokemon SM","USUM","神奇寶貝"],"createdAt":1516125616743},{"companyId":"GE62WARqQnnMzag3a","name":"湯之花幽奈","chairman":"vWKEfkHvFmcdgPnrh","manager":"cqDAETC6Dgw5DZQLw","grade":"B","capital":72507,"price":40,"release":1222,"profit":60600,"vipBonusStocks":420.75,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["幽奈","白髮","巨乳","ゆらぎ荘の幽奈さん","湯ノ花 幽奈","幽靈","搖曳莊的幽奈小姐","湯搖莊的幽奈同學","湯之花幽奈"],"createdAt":1516115656432},{"companyId":"ptBvSda4LXhpoifn5","name":"白鬼院凜凜蝶","chairman":"3dCumX8ecnRi9ruSa","manager":"YRh6w88YRhoDWsmdm","grade":"C","capital":30704,"price":45,"release":1919,"profit":18648,"vipBonusStocks":664.6,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["白鬼院凜凜蝶","小蝶","白鬼院 凜々蝶","しらきいん りりちよ","妖狐×仆SS","妖狐×僕SS","Shirakiin Ririchiyo","骚"],"createdAt":1516105635992},{"companyId":"J4p7wcpnvwxWtN86u","name":"常木耀","chairman":"sRcy4CXHHKzwDx95j","manager":"YRh6w88YRhoDWsmdm","grade":"D","capital":25328,"price":79,"release":1552,"profit":3940,"vipBonusStocks":88.10000000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["常木耀","つねき ひかり","清戀","seiren","セイレン","费玉清恋","污恋","骚","高速公鹿"],"createdAt":1516048695134},{"companyId":"dWeTZhRGcb34qL6n7","name":"青山七海","chairman":"iYKJ2yBs7KWMC3kEQ","manager":"iYKJ2yBs7KWMC3kEQ","grade":"B","capital":118758,"price":6,"release":4607,"profit":145185.8,"vipBonusStocks":3870.38,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["青山七海","櫻花莊的寵物女孩","樱花庄的宠物女孩","Aoyama Nanami","あおやま ななみ","さくら荘のペットな彼女"],"createdAt":1516045755087},{"companyId":"FYiEMGoedgk8jmFYC","name":"輕井澤 惠","chairman":"K9vyNn2QqLdZGSg72","manager":"uf2yJ4NhNr3ian9gX","grade":"B","capital":119423,"price":600,"release":1858,"profit":185811,"vipBonusStocks":797.95,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["輕井澤 惠","《歡迎來到實力至上主義的教室》","（ようこそ実力至上主義の教室へ）","かるいざわ けい","軽井沢 恵"],"createdAt":1516035134807},{"companyId":"yTcxomDRkCRzaRMe3","name":"甘栗千子","chairman":"eirovQMXcWgCaMM5C","manager":"eirovQMXcWgCaMM5C","grade":"C","capital":48574,"price":40,"release":2065,"profit":32013.4,"vipBonusStocks":1066.02,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["あまぐりせんこ","Amaguri Senko","變女","变女","甘栗千子","變女~奇怪女子高中生甘栗千子~","此ノ木世知留","変女~変な女子高生 甘栗千子~"],"createdAt":1516032494580},{"companyId":"BiZeBdF5xiZQPZ6Q4","name":"木之本 櫻","chairman":"hEmBhvqRtuWCeD9ik","manager":"hEmBhvqRtuWCeD9ik","grade":"A","capital":248613,"price":311,"release":1938,"profit":92366,"vipBonusStocks":384.28,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["木之本 桜","カードキャプターさくら","小櫻","怪獸","庫洛魔法使"],"createdAt":1516022234284},{"companyId":"AGxpv7Ct5azPj4e6y","name":"白川京","chairman":"Bkz5yqeHGAf7HrJNA","manager":"Crkz9Q7kbnvnCQKhs","grade":"C","capital":54679,"price":90,"release":1673,"profit":49840,"vipBonusStocks":594.06,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["白川京","如果有妹妹就好了","妹さえいればいい","京姐","加隈亞衣","Shirakawa Miyako","平坂讀"],"createdAt":1515995353965},{"companyId":"DMg3wd5rryMMd3nvo","name":"島村卯月","chairman":"fNYAvSBtuxeAgQjtS","manager":"FvfycqzbZv98meYN9","grade":"B","capital":92372,"price":200,"release":1441,"profit":9600,"vipBonusStocks":145.92000000000007,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["偶像大師","偶像大師 灰姑娘女孩","THE IDOLM@STER","IDOLM@STER CINDERELLA GIRLS","アイドルマスター","アイドルマスター シンデレラガールズ","島村卯月","島村 卯月","しまむら うづき","hego","大天使"],"createdAt":1515981553812},{"companyId":"4L97FLsi5aRvfw5WT","name":"維迦","chairman":"aK4fT5RbHH6GqyibB","manager":"aK4fT5RbHH6GqyibB","grade":"D","capital":16000,"price":25,"release":1000,"profit":0,"vipBonusStocks":6.0400000000000205,"managerProfitPercent":0.05,"salary":1500,"nextSeasonSalary":1500,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["維迦","LOL","Veigar","英雄聯盟","League of Legends","邪惡小法師","小法","約德爾","矮人"],"createdAt":1515966733529},{"companyId":"43CKYTuso3uacYtbs","name":"耀夜姬","chairman":"pdKZNuvYYY4dZ3yzL","manager":"B5tG8BKfpBnaKF3ad","grade":"B","capital":95004,"price":45,"release":2833,"profit":124846.7,"vipBonusStocks":2281,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["崩壞學園2","崩壞2","耀夜姬"],"createdAt":1515951253310},{"companyId":"wegAZdSQZpp5GeoLn","name":"死亡主宰","chairman":"phcAQGMJTXBWYTdBC","manager":"ia3APS3Qt78LNhzYi","grade":"A","capital":157005,"price":455,"release":1109,"profit":289551.4,"vipBonusStocks":750.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["BLACK★ROCK SHOOTER","ブラック☆ロックシューター","死亡主宰","黑岩射手","デッドマスター","DEAD MASTER","小鳥游優美","小鳥遊 ヨミ"],"createdAt":1515951013313},{"companyId":"ss6k2Wtbo5gfKEKDd","name":"由比濱結衣","chairman":"6yGKydiCaQMCBXbCz","manager":"mY8T2wTrnRobydgxG","grade":"A","capital":544999,"price":1428,"release":1912,"profit":761535,"vipBonusStocks":675.17,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":5,"nextSeasonEmployeesNumber":3,"tags":["果然我的青春戀愛喜劇搞錯了。","やはり俺の青春ラブコメはまちがっている。","由比ヶ浜 結衣","由比濱結衣","ゆいがはま ゆい","狗派大勝利","巨乳","東山奈央","Yuigahama Yui"],"createdAt":1515950773304},{"companyId":"LpczmRCzzYs56Dyda","name":"壞掉妹","chairman":"CWgfhqxbrJMxsknrb","manager":"CWgfhqxbrJMxsknrb","grade":"D","capital":27088,"price":25,"release":1693,"profit":9780,"vipBonusStocks":716.24,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":2,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["壞掉妹","雅菈．貝達","壊れ娘","壞壞漫畫","仙界大濕","快樂濕大象","台灣","Taiwan","原創","天然呆","正義感","私立白企高級中學 1-1班","神族後裔","壞掉的神","女神","158公分"],"createdAt":1515949453291},{"companyId":"Fq3AAipSqhTnm5wGP","name":"空銀子","chairman":"fjJ8RrkJcC7oFYMrg","manager":"Crkz9Q7kbnvnCQKhs","grade":"C","capital":68666,"price":58,"release":1987,"profit":43007,"vipBonusStocks":154.63000000000002,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["龍王的工作","りゅうおうのおしごと!","浪速の白雪姫","Ryuoh no Oshigoto!","空銀子（空 銀子（そら ぎんこ），聲：金元壽子）","《龍王的工作！》（日語：りゅうおうのおしごと!）"],"createdAt":1515948313281},{"companyId":"NrfkbiTWhzjZT4Kgx","name":"IDW(少女前線)","chairman":"TSjMwuAxNvC9Lu5fE","manager":"TSjMwuAxNvC9Lu5fE","grade":"D","capital":14708,"price":29,"release":1507,"profit":12290.5,"vipBonusStocks":424.38,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["少女前線","少前","Girls' Frontline","IDW","打喵","1:10","哀滴打不溜噠喵"],"createdAt":1515947713278},{"companyId":"TPdvvzmYmAHvLzDnR","name":"姬絲秀忒．雅賽勞拉莉昂．刃下心","chairman":"b6LPTJpK9ntcE2iHE","manager":"xxPmXmrMEShmGp7gY","grade":"A","capital":161408,"price":361,"release":1261,"profit":7433.35,"vipBonusStocks":55.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["姬絲秀忒．雅賽勞拉莉昂．刃下心","キスショット・アセロラオリオン・ハートアンダーブレード","忍野　忍","忍野","忍","おしの しのぶ","〈物語〉シリーズ","物語系列","物語","西尾維新","金髮","吸血鬼"],"createdAt":1515944413235},{"companyId":"ya5C8MePP9cT5faFu","name":"矢矧(艦これ)","chairman":"BxCbWCme3Lno7QrgP","manager":"BxCbWCme3Lno7QrgP","grade":"B","capital":109134,"price":207,"release":1696,"profit":198205,"vipBonusStocks":1247.08,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["第二水雷戰隊","艦隊收藏","艦隊これくしゅん","非理法權天","kancolle","馬尾","山田悠希","niponpon","矢矧","艦隊Collection"],"createdAt":1515893329728},{"companyId":"sbnRMndhKcMEtXmG2","name":"米琳達·白蘭丁尼","chairman":"ruq5PmEkc5h7fCQfc","manager":"ruq5PmEkc5h7fCQfc","grade":"C","capital":29376,"price":55,"release":1836,"profit":25645,"vipBonusStocks":1017.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["公主陛下","公主","OBJECT","重裝武器","正統王國第37機動修護大隊所屬中尉","米琳達·白蘭丁尼","ミリンダ＝ブランティーニ","HEAVY OBJECT","ヘヴィーオブジェクト"],"createdAt":1515865669259},{"companyId":"JZEXMpdynvPmYsA8e","name":"千斗五十鈴","chairman":"KeJktzGX8GgwFseSp","manager":"GzQhfEwZnTkNRujKg","grade":"B","capital":85056,"price":383,"release":1329,"profit":263120,"vipBonusStocks":745.75,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":2,"tags":["イースズルハ・セントルシア","伊絲茲露哈・森托西雅","Isuzuruha・Centollusia","千斗五十鈴","千斗いすず","Sento Isuzu","呆毛","巨乳","潔癖","過膝襪","絕對領域","冰美人","女軍人","甘城輝煌樂園救世主","甘城ブリリアントパーク"],"createdAt":1515855169057},{"companyId":"QB7GNT285gRmbDSzN","name":"康娜卡姆依","chairman":"ARs6xEb3KF3uj2Hep","manager":"ARs6xEb3KF3uj2Hep","grade":"A","capital":226833,"price":351,"release":1768,"profit":168330,"vipBonusStocks":355.8,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["小林家的龍女僕","小林家的女僕龍","小林家的妹抖龍","神奈神威","康娜","康娜卡姆依","京都動畫","カンナカムイ","Kanna Kamui","Kanna Kamuy","小林カンナ","小林康娜","吃貨","康娜的日常","小林さんちのメイドラゴン"],"createdAt":1515854749045},{"companyId":"SQFHLpawdjf3EqBMu","name":"安樂岡花火","chairman":"3QnnNMpkCsWfbovSc","manager":"3QnnNMpkCsWfbovSc","grade":"C","capital":32407,"price":474,"release":1004,"profit":13710.5,"vipBonusStocks":58.31000000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["クズの本懐","人渣的本願","やすらおか はなび","安樂岡花火"],"createdAt":1515849348935},{"companyId":"z3hZn3dq5uzdim3up","name":"白羽·拉菲爾·恩茲沃斯","chairman":"YRh6w88YRhoDWsmdm","manager":"YRh6w88YRhoDWsmdm","grade":"D","capital":17336,"price":51,"release":1079,"profit":11386,"vipBonusStocks":209.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["白羽·拉菲爾·恩茲沃斯","白羽・ラフィエル・エインズワース","Shiraha Raphiel Ainsworth","廢天使加百列","珈百璃的墮落","愉悅","花澤香菜","巨乳","白羽小天使","小太陽","ガヴリールドロップアウト","Gabriel DroPout"],"createdAt":1515847968916},{"companyId":"67g2jhC5fmed4dzz8","name":"仙子伊布","chairman":"wS4RCNMaZb4PB63M9","manager":"wS4RCNMaZb4PB63M9","grade":"D","capital":16080,"price":27,"release":1005,"profit":13966,"vipBonusStocks":582.76,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["仙子伊布","ニンフィア","Sylveon","神奇寶貝X/Y","精靈寶可夢X/Y","ポケットモンスターX/Y","仙精靈炭","仙子精靈"],"createdAt":1515841608849},{"companyId":"kXDkN653DnoFDhkSz","name":"柊鏡","chairman":"ySEif8it44ywji9CZ","manager":"ySEif8it44ywji9CZ","grade":"B","capital":83780,"price":83,"release":1470,"profit":62297,"vipBonusStocks":809.11,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["Lucky Star","柊鏡","柊かがみ","幸運星","Hiiragi Kagami","らき☆すた","京都動畫"],"createdAt":1515823488626},{"companyId":"jXXDGNmXTouLEPAMm","name":"庫珥修·卡爾斯騰","chairman":"TCAS5pLc6zaeFLEfQ","manager":"TCAS5pLc6zaeFLEfQ","grade":"C","capital":31722,"price":64,"release":1978,"profit":44979.200000000004,"vipBonusStocks":1087.05,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["Re:從零開始的異世界生活","Re:0","井口裕香","公爵","綠髮","軍服","クルシュ・カルステン","Crusch Karsten","庫珥修·卡爾斯騰","Re:ゼロから始める異世界生活","Re:ゼロ","獅子王所見之夢","库珥修·卡尔斯腾"],"createdAt":1515818330784},{"companyId":"kku2N9QaJZPTaiKHu","name":"枝垂螢","chairman":"eirovQMXcWgCaMM5C","manager":"eirovQMXcWgCaMM5C","grade":"D","capital":13426,"price":25,"release":1461,"profit":10576,"vipBonusStocks":388.38,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["小螢","竹達 彩奈","枝垂螢","枝垂ほたる","粗點心戰爭","だがしかし","歌德蘿莉","鹿田九","鹿田粗點心店","巨乳","色氣","粗點心控","黑絲","髮飾","中二","大小姐"],"createdAt":1515814068477},{"companyId":"3BRs953E2mnpgBswL","name":"愛蜜莉雅","chairman":"63Kf7fPYFHMpJhHLo","manager":"rQSA5gf4DvfpzxjzR","grade":"A","capital":220720,"price":1000,"release":1677,"profit":201598,"vipBonusStocks":392.8,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":4,"nextSeasonEmployeesNumber":4,"tags":["愛蜜莉雅","Re:ゼロから始める異世界生活","Re:從零開始的異世界生活","エミリア","Emilia","EMT","愛蜜莉雅碳","高橋李依","Takahashi Rie","たかはし りえ","傲嬌","單純","天然呆","精靈","半精靈","天使","魔女","莎緹拉"],"createdAt":1515810228435},{"companyId":"sbHu5zdYiQp4cdhhZ","name":"因幡帝","chairman":"ErfivzouwNfpjMLjk","manager":"ErfivzouwNfpjMLjk","grade":"D","capital":20128,"price":83,"release":1258,"profit":13002.75,"vipBonusStocks":413.56,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["因幡帝","いなば てゐ","てゐ","Inaba Tei","東方projact","東方","兔子","東方永夜抄","腹黑","永遠亭","迷途竹林","Tewi Inaba","因幡 てゐ","幸運","妖怪兔","蘿莉"],"createdAt":1515786948158},{"companyId":"u8Hjh39ocD6pGxmqd","name":"鹿目圓","chairman":"4GRGgh2ANYpckezrT","manager":"ahK8r48LZkZShbbFB","grade":"C","capital":43548,"price":190,"release":1351,"profit":67660,"vipBonusStocks":440.92,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":0,"tags":["蒼樹梅","魔法少女","魔法少女小圓","魔法少女まどか☆マギカ","魔法少女まどかマギカ","鹿目圓","鹿目まどか","悠木碧"],"createdAt":1515786648153},{"companyId":"CwWhESoYD9eDinMLd","name":"小泉（小泉さん）","chairman":"63Kf7fPYFHMpJhHLo","manager":"Lc3TnA6xKHWYTSymZ","grade":"B","capital":113258,"price":358,"release":1767,"profit":139759,"vipBonusStocks":690.98,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["小泉さん","小泉","愛吃拉麵的小泉同學","ラーメン大好き小泉さん"],"createdAt":1515781368097},{"companyId":"R6jBmzJx9Y6RjjZrg","name":"紅馬尾/觀束總二","chairman":"PFEK8qMPEjHgQD6zy","manager":"YRh6w88YRhoDWsmdm","grade":"D","capital":13476,"price":59,"release":1646,"profit":1870,"vipBonusStocks":133.2,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["紅馬尾","小紅","雙馬尾神教總教主","テイ兒レッド","我，要成為雙馬尾","俺、ツインテー兒になります","幼女","Tail Red","觀束總二","観束総二","Mitsuka Souji"],"createdAt":1515779388077},{"companyId":"NhiMLBFZM67fZtBCX","name":"島田愛里壽","chairman":"A4rot7ZM8rmMzTKb4","manager":"A4rot7ZM8rmMzTKb4","grade":"B","capital":69394,"price":100,"release":2072,"profit":93376,"vipBonusStocks":884.92,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["島田愛里壽","愛里壽","島田","島田流","Shimada Alice","Shimada","Alice","しまだ あいりす","愛里寿","島田 愛里寿","少女與戰車","ガールズ&パンツァー","GIRLS und PANZER","Garuzu ando Pantsa"],"createdAt":1515775008004},{"companyId":"eptJPCHxS6pp6Ycfn","name":"露雪・艾倫西亞","chairman":"y3A9xyFXCAgvKidfq","manager":"y3A9xyFXCAgvKidfq","grade":"C","capital":33669,"price":288,"release":1041,"profit":120802.4,"vipBonusStocks":594.3799999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["露雪艾倫西亞","ルウシェ・エルレンシア","白貓Project","白猫Project","白貓 tennis","白猫テニス","クイズRPG 魔法使いと黒猫のウィズ","問答RPG 魔法使與黑貓維茲","贖罪的聖女","為了罪的宿命而殉命的救世女","白色祝福的聖女","懷抱的是希望的花束","祝賀新春的聖女","懷抱真心的聖女","贖罪の聖女","罪の宿命に殉じる救世女","白き祝福の聖女","その胸に抱くは希望の花束","新春を祝う聖女","真心を抱く聖女","聖女拳","聖女法","限定拳","花嫁聖女","花嫁露雪","正月聖女","正月露雪"],"createdAt":1515773927992},{"companyId":"2BGoxgczcuBws3j4o","name":"空氣少女 艾兒","chairman":"CWgfhqxbrJMxsknrb","manager":"CWgfhqxbrJMxsknrb","grade":"C","capital":48411,"price":80,"release":1502,"profit":4600,"vipBonusStocks":247.60000000000002,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["空氣少女","艾兒","air","空氣","希萌","Simon","空気少女","PM2.5","空污","屏東","怠速熄火","空氣汙染","橡皮擦","台灣","Taiwan","屏科大","空氣少女注意報Rinascimento","ふみか鹿目","初夏","緋華"],"createdAt":1515772052992},{"companyId":"5XESv5t2XkkXCWbWi","name":"巴麻美","chairman":"Y7a5DKrxYRoTyXpqa","manager":"rQSA5gf4DvfpzxjzR","grade":"C","capital":76799,"price":28,"release":2934,"profit":133632,"vipBonusStocks":2188.86,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["魔法少女小圓","魔法少女まどか☆マギカ","巴麻美","水橋香織","Tomoe Mami","巴 マミ","芳文社","第三話","第十話","被麻美","已經沒什麼好害怕的了","大家不都只有去死了嗎！","說好不提學姊的"],"createdAt":1515766112907},{"companyId":"CDS9WNXPnMskz4Eqc","name":"鷺澤文香","chairman":"QuuHBtk7Ngik3YKHK","manager":"QuuHBtk7Ngik3YKHK","grade":"B","capital":102872,"price":644,"release":1553,"profit":147887.5,"vipBonusStocks":486.24000000000007,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["Idolm@ster_Cinderella_Girls_Starlight_Stage","CGSS","偶像大師灰姑娘女孩星光舞台","アイドルマスター シンデレラガールズ スターライトステージ","鷺沢文香","蚊香","文香娃娃","さぎさわふみか","鷺澤文香","文學少女","移動圖書館","巨乳","乳搖"],"createdAt":1515729212229},{"companyId":"NboXhPxxyxmquPcfP","name":"繆里","chairman":"Xt3Jw3fnGoY37454c","manager":"Xt3Jw3fnGoY37454c","grade":"C","capital":35004,"price":140,"release":1056,"profit":19400,"vipBonusStocks":72.85000000000002,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["狼與辛香料","女兒","赫蘿","羅倫斯","獸耳","銀髮","支倉凍砂","ミューリ","狼辛","三年起步最高死刑","賢狼之女","蘿莉","狼と羊皮紙","狼與羊皮紙","繆里"],"createdAt":1515728012224},{"companyId":"XzxACCsu9xJMdXQP2","name":"兩儀式","chairman":"wNRZGLnytd7XCiZYQ","manager":"CaNMmfd5m3yHByYEz","grade":"C","capital":39136,"price":107,"release":1223,"profit":20235,"vipBonusStocks":28,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["奈須蘑菇","兩儀式","空之境界","空の境界","the Garden of Sinners","両儀 式"],"createdAt":1515719791845},{"companyId":"M3dHcYYJp4s6yWzXp","name":"艾莉絲（為美好的世界獻上祝福）","chairman":"NmyfPPhr5nKSXqvNq","manager":"YRh6w88YRhoDWsmdm","grade":"C","capital":40704,"price":255,"release":1272,"profit":1602,"vipBonusStocks":85.2,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["艾莉絲","克莉絲","この素晴らしい世界に祝福を!","為美好的世界獻上祝福","胸墊女神","エリス","厄裏斯"],"createdAt":1515718831852},{"companyId":"C2KXrAj9bSat5uwz7","name":"日奈森亞夢","chairman":"5hdjQ9EA4YZKjps46","manager":"5hdjQ9EA4YZKjps46","grade":"D","capital":5816,"price":17,"release":1454,"profit":2980.4,"vipBonusStocks":98.20000000000013,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["守護甜心！","しゅごキャラ!","日奈森 亜夢","日奈森亞夢"],"createdAt":1515715291787},{"companyId":"bwAH5AyfBjBjQoXRx","name":"輝夜 月","chairman":"rNRBHbLez7FHHtEGc","manager":"HGHXthbFjPCnd4REo","grade":"C","capital":59200,"price":53,"release":1571,"profit":112496.1,"vipBonusStocks":1012.47,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["luna","輝夜月","youtuber","かぐや るな","Kaguya Luna"],"createdAt":1515711451712},{"companyId":"35mf7DFJsjqhCthzp","name":"歐尼","chairman":"eE8xqPG4j2o5CLCGR","manager":"eE8xqPG4j2o5CLCGR","grade":"B","capital":116510,"price":52,"release":2426,"profit":157406.1,"vipBonusStocks":1868.6,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":1,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["泥鯨之子們在沙地上歌唱","クジラの子らは砂上に歌う","オウニ","歐尼"],"createdAt":1515711031710},{"companyId":"ix2L8hcvXXiM57cx4","name":"島風(艦これ)","chairman":"bh7yDRqxmkvxWPox2","manager":"bh7yDRqxmkvxWPox2","grade":"C","capital":52065,"price":69,"release":1575,"profit":26140,"vipBonusStocks":463,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["艦隊Collection","艦これ","島風","最速","兔耳","雙聯裝50倍徑三年式127毫米炮D型","舞鶴海軍工廠","島風型","しまかぜ","零式5聯裝魚雷發射管","IJN","天津風","雪風"],"createdAt":1515709891689},{"companyId":"XHwg7WK2ewPniDsSt","name":"曉美焰","chairman":"9rj8KokXdJmdZ7jKs","manager":"3Fki3Wd8qCCxTdgoa","grade":"C","capital":62562,"price":76,"release":1937,"profit":38512.2,"vipBonusStocks":1059.37,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["曉美焰","暁美ほむら","あけみ—","齋藤千和","魔法少女","魔法少女小圓","魔法少女まどか☆マギカ","魔法少女まどかマギカ","虛淵玄","新房昭之","蒼樹梅"],"createdAt":1515699331532},{"companyId":"sRdsGcSr5zFsWHSrQ","name":"結月緣","chairman":"4NDAiWhT9cnrozeBH","manager":"4NDAiWhT9cnrozeBH","grade":"B","capital":113582,"price":99,"release":3225,"profit":141394,"vipBonusStocks":2787.32,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["結月ゆかり","Voiceroid","Vocaloid","電鋸","結月緣","緣兔"],"createdAt":1515694831461},{"companyId":"zaEarZ9yNn6JGPpdb","name":"U-511(艦これ)","chairman":"bh7yDRqxmkvxWPox2","manager":"48925zNjt86rsoFHX","grade":"C","capital":60960,"price":62,"release":1227,"profit":115670,"vipBonusStocks":1104.02,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["艦隊收藏   艦隊   艦これ   kancolle   潛艦   U-511(艦これ) 呂-500","艦隊これくしょん -艦これ-","艦隊collection"],"createdAt":1515694351449},{"companyId":"KsDa3vZz5eCRiEytK","name":"無名","chairman":"NM3rRa27Lh4RxmBHj","manager":"NM3rRa27Lh4RxmBHj","grade":"C","capital":56811,"price":230,"release":1642,"profit":132088.5,"vipBonusStocks":739,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["甲鐵城的卡巴內利","幼女","僵屍","甲鉄城のカバネリ","無名","むめい"],"createdAt":1515693871445},{"companyId":"3tTp5aXzuTwaueMDk","name":"黎明卿-嶄新之波多爾多","chairman":"mY8T2wTrnRobydgxG","manager":"mY8T2wTrnRobydgxG","grade":"C","capital":33504,"price":29,"release":1047,"profit":8351.6,"vipBonusStocks":232.55,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["波多爾多","黎明","白笛","來自深淵","娜娜奇","普魯修卡","彈藥包","祈手","爸爸","幹你黎明","ボンドルド","Bondorudo","メイドインアビス"],"createdAt":1515692671424},{"companyId":"KFihNiP8GcqzX5drW","name":"北白川玉子","chairman":"72NukfAXbYY9iFsu2","manager":"72NukfAXbYY9iFsu2","grade":"C","capital":58320,"price":102,"release":1812,"profit":104502,"vipBonusStocks":754.09,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["北白川玉子","玉子市場","京都動畫","たまこまーけっと","きたしらかわ たまこ","年糕妹"],"createdAt":1515689371365},{"companyId":"gtH6SRrBSWEnjWKzM","name":"萊莎(殲滅卿)","chairman":"9E9zQL3tFoYT7dwsW","manager":"b9hfWqHMdEnnZfnmh","grade":"D","capital":14656,"price":17,"release":1832,"profit":19901.8,"vipBonusStocks":1008.9200000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["殲滅卿","殲滅之萊莎","ライザ","來自深淵","白笛","太太","メイドインアビス","殲滅のライザ","莉可"],"createdAt":1515686011313},{"companyId":"kw6psjFt3KBoTzXwo","name":"拉媞琺·芙爾蘭札","chairman":"d7sxzLyLwcG22AMQL","manager":"d7sxzLyLwcG22AMQL","grade":"B","capital":81529,"price":50,"release":9463,"profit":244987,"vipBonusStocks":8117.75,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["拉媞琺·芙爾蘭札","ラティファ・フルーランザ","Latifa Fleuranza","甘城光輝遊樂園","甘城ブリリアントパーク","甘城輝煌樂園救世主"],"createdAt":1515674491011},{"companyId":"4YEw89TLj4AJuGQeu","name":"高坂桐乃","chairman":"vMGZ6uRRRRueL9oX2","manager":"rQSA5gf4DvfpzxjzR","grade":"B","capital":82157,"price":41,"release":1335,"profit":45860,"vipBonusStocks":644.81,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["高坂桐乃","こうさか きりの","竹達彩奈","我的妹妹不可能這麼可愛","俺の妹がこんなに可愛いわけがない"],"createdAt":1515659190422},{"companyId":"hrmz6eyw3YSfMSxNN","name":"HK416","chairman":"QxjFg7YBq8e4cMnHB","manager":"W9wcCubnpT37aGjun","grade":"D","capital":27107,"price":575,"release":1633,"profit":55052.85,"vipBonusStocks":346.42,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["HK416","少女前線","小怪獸","Girls' Frontline","病嬌","404小隊","酒後亂性","3:55:00","少女前线","黑絲","淚痣","絕對領域","隱藏巨乳","★★★★★突擊步槍","少前"],"createdAt":1515640582850},{"companyId":"ywifKo5u8gT2yMkTP","name":"托爾(朵露)","chairman":"ZiHbcgbz7KQn6zRTk","manager":"Crkz9Q7kbnvnCQKhs","grade":"B","capital":74197,"price":57,"release":1976,"profit":194471,"vipBonusStocks":1428,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["小林家的龍女僕","小林さんちのメイドラゴン","林家龍","托爾","朵露","トール","桑原由氣","京都動畫","京都アニメーション"],"createdAt":1515639382831},{"companyId":"QuJPvf9MpBRGpCWBS","name":"POP子","chairman":"hEmBhvqRtuWCeD9ik","manager":"hEmBhvqRtuWCeD9ik","grade":"D","capital":5047,"price":6,"release":2493,"profit":2262.4500000000003,"vipBonusStocks":10.460000000000008,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["ポプ子","POP子和PIPI美的日常","POP TEAM EPIC","ポプテピピック","PPTP","一月霸權","POP子","怪獸"],"createdAt":1515638662799},{"companyId":"M9D5u3ZNB4ARYQrCm","name":"PIPI美","chairman":"4sSxpwwwzZKbskCAA","manager":"hEmBhvqRtuWCeD9ik","grade":"D","capital":3446,"price":4,"release":1584,"profit":1537.4999999999998,"vipBonusStocks":51.49000000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["ピピ美","POP子和PIPI美的日常","POP TEAM EPIC","ポプテピピック","PPTP","一月霸權","PIPI美","怪獸"],"createdAt":1515638602800},{"companyId":"xKaWfvB4vbPvbHEy7","name":"惣流·明日香·蘭格雷","chairman":"YJrx9MBrNAdAZB2JX","manager":"YRh6w88YRhoDWsmdm","grade":"C","capital":40460,"price":73,"release":1994,"profit":61746,"vipBonusStocks":626.43,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["惣流·明日香·蘭格雷","惣流・アスカ・ラングレー","式波・アスカ・ラングレー","新世紀福音戰士","新世纪エヴァンゲリオン","Evangelion","EVA","第二適任者"],"createdAt":1515630802558},{"companyId":"Sg4DzJtott3KpP6CT","name":"紫音","chairman":"2WuW6SNzMZgjWRJxy","manager":"2WuW6SNzMZgjWRJxy","grade":"D","capital":21546,"price":28,"release":1340,"profit":15560,"vipBonusStocks":433,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["しおん","紫音","主從系列","主従えくすたしー","抖S","紫音小姐","色氣"],"createdAt":1515625042417},{"companyId":"ERMYrrJvcJ7bkuxex","name":"月","chairman":"4sSxpwwwzZKbskCAA","manager":"4sSxpwwwzZKbskCAA","grade":"C","capital":61405,"price":81,"release":1557,"profit":55785,"vipBonusStocks":480.90999999999997,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["平凡職業造就世界最強","月   亞蕾緹雅","ユエ","ありふれた職業で世界最強"],"createdAt":1515605901944},{"companyId":"FJKEneT9i8LQXgAAt","name":"G11(少女前線)","chairman":"ysWH2DiKFG7gZWG5S","manager":"ysWH2DiKFG7gZWG5S","grade":"C","capital":51500,"price":144,"release":1602,"profit":35608,"vipBonusStocks":753.64,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["少女前線","G11","HK G11","HK","404小隊","睡鼠","音符","HK416的真愛（？）","覺(ㄐㄧㄠˋ)皇"],"createdAt":1515603441924},{"companyId":"7Jmd8GGYHZ8eydK9d","name":"歐根親王(碧藍航線)","chairman":"k4MBYKEzTfMdMshgz","manager":"k4MBYKEzTfMdMshgz","grade":"C","capital":40898,"price":200,"release":1273,"profit":45930,"vipBonusStocks":346.6,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["歐根親王(碧藍航線)","歐根親王","Prinz Eugen","アズールレーン","プリンツ・オイゲン","鐵血艦","傲嬌","重巡洋艦","碧蓝航线","艦B","Kreuzer J","咬手手","Azur Lane"],"createdAt":1515597921455},{"companyId":"57vMfnJCPvBoaW6Q5","name":"高垣楓","chairman":"SE2tLqhCaFa4SvxCs","manager":"SE2tLqhCaFa4SvxCs","grade":"C","capital":55832,"price":150,"release":1132,"profit":49198.6,"vipBonusStocks":764.3,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["偶像大師","偶像大師灰姑娘女孩","IDOLM@STER","病弱","アイドルマスターシンデレラガールズ","IDOLM@STER CINDERELLA GIRLS","アイドルマスター シンデレラガールズ スターライトステージ","星光舞台","高垣楓","たかがきかえで","takagakikaede","早見沙織","我老婆","聲優也是我老婆","異色瞳","楓姐","御姐偶像","cool","こいかぜ","戀風","346","藍眼","綠眼"],"createdAt":1515597801454},{"companyId":"QtTXnioCMFGdWHNWZ","name":"椎名真白","chairman":"v7y99GxYiiHTFcW3m","manager":"5GqPXDttrZQuvvqEL","grade":"A","capital":655662,"price":1299,"release":1645,"profit":47160,"vipBonusStocks":382.74,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":4,"nextSeasonEmployeesNumber":2,"tags":["櫻花莊的寵物女孩","椎名真白","椎名ましろ","樱花庄的宠物女孩","さくら荘のペットな彼女","鸭志田一","Shiina Mashiro","真白"],"createdAt":1515595581407},{"companyId":"dtJrx7EJq7JFm7QW6","name":"李克勞","chairman":"Amk6FSNzFqR7RmM3D","manager":"Amk6FSNzFqR7RmM3D","grade":"D","capital":66736,"price":2,"release":25734,"profit":26966,"vipBonusStocks":25409,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["李克勞","家有大貓","雲豹","獸人","Likulau","Nekojishi","Clouded Leopard","家有大貓：貓狗大戰"],"createdAt":1515594741405},{"companyId":"dtMvaoMjjPPrHepBH","name":"篝之霧枝","chairman":"J2Kuyk5Jjf5R4tm2G","manager":"5hTof6sEt8DYZfkPE","grade":"C","capital":37906,"price":74,"release":1378,"profit":7800,"vipBonusStocks":643.95,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["篝之霧枝","篝ノ霧枝","かがりのきりえ","美少女萬華鏡 -被詛咒的傳說少女","美少女万華鏡","美少女万華镜 -呪われし伝说の少女","Kagarino Kirie","雙馬尾","蘿莉","毒舌","吸血鬼"],"createdAt":1515586521115},{"companyId":"MoNcrHi8gJR4mZpp7","name":"P226(少女前線)","chairman":"TSjMwuAxNvC9Lu5fE","manager":"TSjMwuAxNvC9Lu5fE","grade":"D","capital":16512,"price":50,"release":1032,"profit":44145,"vipBonusStocks":526.3,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["少女前線","少前","Girls' Frontline","P226","包子","夏川玖井菜","蘿莉","幼女","貧乳","微乳","呆毛"],"createdAt":1515583461050},{"companyId":"Ziazx7pML6YSKGnJX","name":"阿爾托莉亞・潘德拉剛","chairman":"QA9raFYTiZ5hwbMyy","manager":"RqQivWo4eSnFrKJTX","grade":"A","capital":178892,"price":1050,"release":1067,"profit":77925.75,"vipBonusStocks":291.6000000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["阿爾托莉亞・潘德拉剛","アルトリア・ペンドラゴン","Fate/stay night","Fate/Zero","Fate/Grand Order","亞瑟王","呆毛","吃貨","Saber","Fate","TYPEMOON","154cm","傻巴","川澄綾子"],"createdAt":1515566840753},{"companyId":"625Yyw5t4GdXuY6KD","name":"愛宕(碧藍航線)","chairman":"mY8T2wTrnRobydgxG","manager":"P7A2S6b6pBhzvFHMP","grade":"C","capital":51228,"price":194,"release":1209,"profit":43485.4,"vipBonusStocks":582.0900000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["愛宕","碧藍航線","碧蓝航线","Atago","あたご","Azur Lane","アズールレーン","艦B","妹妹","犬","高雄級重巡洋艦二番艦愛宕號","巨乳","獸耳","黑絲","吊帶襪","長髮","武士刀","重櫻"],"createdAt":1515565880740},{"companyId":"yZtRXpwBGKRNF3bRk","name":"桐山零","chairman":"wa5LAfzQS46jkA3r7","manager":"wa5LAfzQS46jkA3r7","grade":"D","capital":105131,"price":25,"release":4660,"profit":13574,"vipBonusStocks":307,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["桐山零","桐山 零","3月のライオン","3月的獅子","羽海野千花","March Comes in Like a Lion","將棋","眼鏡"],"createdAt":1515565400739},{"companyId":"7acZqBWLNw2PBnwWe","name":"黑岩射手","chairman":"ia3APS3Qt78LNhzYi","manager":"phcAQGMJTXBWYTdBC","grade":"A","capital":165365,"price":669,"release":1445,"profit":450121,"vipBonusStocks":881.25,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":3,"tags":["B★RS","BRS","★","星星不可省略","BLACK★ROCK SHOOTER","ブラック☆ロックシューター","麻陶","黑衣麻陶","黑岩射手"],"createdAt":1515560240667},{"companyId":"8rxX2w5hHjrj8rhWz","name":"橙黃白毫","chairman":"jHZpksJXnacPF7vuv","manager":"aHgtQMW4MG4dWgLtL","grade":"D","capital":14984,"price":25,"release":1873,"profit":17079.9,"vipBonusStocks":454.24,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["Orange·Pekoe","橙黃白毫","紅茶黨","少女與戰車","Actas Inc.","オレンジペコ","GIRLS und PANZER","ガールズ&パンツァー","Garuzu ando Pantsa","學園","軍事","少女","戰車","女子高生&重戰車","少女與戰車製作委員會","ひびき遊","水島努","聖葛羅莉安娜女子學院","St. Gloriana Girls' Academy","石原舞","十字軍戰車","優雅","貧乳","學妹","單純","文藝少女","大洗的拉拉隊員","巨蟹座","橙髮","7月10日","包子頭","神奈川縣橫濱市人","填裝手","奧蘭治·蓓可兒","蘿莉"],"createdAt":1515557840626},{"companyId":"9QeY6jpo7sGRTHXE8","name":"市谷有咲","chairman":"fA23N6Dvv9qTJjRcw","manager":"fA23N6Dvv9qTJjRcw","grade":"C","capital":44146,"price":24,"release":2745,"profit":25567.8,"vipBonusStocks":2437,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["市谷有咲","市ヶ谷有咲","Bangdream!","バンドリ!","Poppin'Party","少女樂團派對","邦邦"],"createdAt":1515555440599},{"companyId":"ngPFbqKG5oBHjvWAD","name":"鹿島 (艦これ)","chairman":"QuuHBtk7Ngik3YKHK","manager":"QuuHBtk7Ngik3YKHK","grade":"C","capital":60301,"price":363,"release":1812,"profit":74368.2,"vipBonusStocks":621.0899999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["鹿島","かしま","艦隊これくしょん -艦これ-","艦隊收藏","艦隊Collection","艦娘","茅野愛衣","本子王","練巡","雷巡","練習巡洋艦","呂-500"],"createdAt":1515555080595},{"companyId":"4TJE2idFnweMMccyv","name":"洛克希・米格魯迪亞・格雷拉特","chairman":"4sSxpwwwzZKbskCAA","manager":"4sSxpwwwzZKbskCAA","grade":"C","capital":35815,"price":35,"release":1573,"profit":51440,"vipBonusStocks":1053.24,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["無職轉生~在異世界認真的活下去~","洛琪希","洛克希・米格魯迪亞・格雷拉特","ロキシー   ミグルディア   グレイラット","無職轉生～到了異世界就拿出真本事～","無職転生 異世界行ったら本気だす","御神體","唯一神","洛琪希·米格路迪亞·格雷拉特"],"createdAt":1515553100574},{"companyId":"WccoWGZrYs9q2ozWz","name":"譚雅·馮·提古雷查夫","chairman":"ARs6xEb3KF3uj2Hep","manager":"ARs6xEb3KF3uj2Hep","grade":"C","capital":31634,"price":196,"release":1748,"profit":65392,"vipBonusStocks":1310.8,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":3,"nextSeasonEmployeesNumber":2,"tags":["譚雅·馮·提古雷查夫","譚雅","ターニャ・フォン・デグレチャフ","Tanya von Degurechaff","幼女戰記","幼女戦記","カルロ・ゼン","軍事","白銀","萊茵的惡魔","Ace Of Aces","銹銀","金髮","五十嵐裕美","悠木碧","鳥海浩輔","蘿莉","幼女","反差萌","魔法少女"],"createdAt":1515551360548},{"companyId":"edoLBDftwDXHBgi5G","name":"時雨(艦これ)","chairman":"bXoH2E7bW4CeEeaKe","manager":"kewDc43jKM8YKK36k","grade":"B","capital":78876,"price":582,"release":1201,"profit":65300,"vipBonusStocks":281.8,"managerProfitPercent":0.05,"salary":1500,"nextSeasonSalary":1500,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["艦隊收藏","艦隊これくしょん -艦これ-","しぐれ","白露型","艦これ","大天使","時雨","駆逐艦","艦隊Collection","驅逐艦"],"createdAt":1515547760457},{"companyId":"QHzLqQ8zJLHojugha","name":"今泉影狼","chairman":"7h9NHTPHpDeNKu9gv","manager":"bjXscGffs5qCnDrsq","grade":"D","capital":19698,"price":4,"release":3165,"profit":39323.100000000006,"vipBonusStocks":409.90000000000015,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":0,"tags":["今泉影狼","東方","東方project","东方Project","いまいずみ","かげろう","Imaizumi Kagerou","萌狼","人類好可怕"],"createdAt":1515546980445},{"companyId":"nydG3aPAtTb7yAKLu","name":"愛莉絲・瑪格特洛伊德","chairman":"S8xbdC6QZFHNtbGN4","manager":"S8xbdC6QZFHNtbGN4","grade":"D","capital":21245,"price":52,"release":1312,"profit":18066.65,"vipBonusStocks":320.84999999999997,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":2,"tags":["アリス","愛莉絲","愛莉絲・瑪格特洛伊德","アリス・マーガトロイド","上海愛麗絲幻樂團","上海アリス幻樂団","ZUN","東方妖々夢","東方Project","東方","七色の人形使い","七色","魔法使い","人形","弾幕","幻想郷","the Grimoire of Alice","傲嬌","ツンデレ"],"createdAt":1515545660429},{"companyId":"dxatgD3yuybMcCbd6","name":"朴玄碩","chairman":"zW3bXaNH2wxv4Yp7y","manager":"zW3bXaNH2wxv4Yp7y","grade":"D","capital":5061,"price":4,"release":2347,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["朴玄碩","박형석","看臉時代","외모지상주의","外貌至上主義","朴泰俊"],"createdAt":1515543080396},{"companyId":"wbptGjkFRWJ2rXBTv","name":"西宮結弦","chairman":"ysWH2DiKFG7gZWG5S","manager":"ysWH2DiKFG7gZWG5S","grade":"D","capital":81213,"price":43,"release":2928,"profit":24885.55,"vipBonusStocks":181.7400000000001,"managerProfitPercent":0.05,"salary":500,"nextSeasonSalary":500,"bonus":1,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["西宮結弦","にしみや ゆづる","聲之形","聲の形"],"createdAt":1515537620227},{"companyId":"69PxeBkPRoJaoa4zx","name":"P7(少女前線)","chairman":"TSjMwuAxNvC9Lu5fE","manager":"TSjMwuAxNvC9Lu5fE","grade":"D","capital":10039,"price":42,"release":1245,"profit":23093,"vipBonusStocks":632.48,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["少女前線","少前","燒錢","Girls' Frontline","P7","筷子","蘿莉","幼女","以比例來說其實算巨乳","小惡魔"],"createdAt":1515536840207},{"companyId":"9XvAi6Gjosppm7MwL","name":"川本日向","chairman":"ARs6xEb3KF3uj2Hep","manager":"ARs6xEb3KF3uj2Hep","grade":"C","capital":39295,"price":15,"release":6229,"profit":13986.75,"vipBonusStocks":5533.5199999999995,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["川本ひなた","川本日向","川本雛","kawamoto hinata","3月のライオン","3月的獅子","March comes in like a lion","羽海野千花","元氣","雙馬尾","將棋"],"createdAt":1515521280728},{"companyId":"Lw8GY9geY7SKXvfAm","name":"各務原撫子","chairman":"WBh6abvPLjkBhus9T","manager":"WBh6abvPLjkBhus9T","grade":"D","capital":62764,"price":180,"release":2075,"profit":85095,"vipBonusStocks":1107.97,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["各務原撫子","各務原 なでしこ","搖曳露營△","ゆるキャン△","花守由美里","あfろ","芳文社"],"createdAt":1515513960619},{"companyId":"MC6ApPjhCewPuza6L","name":"七海千秋","chairman":"f3dJJYSCYXn9FFS6z","manager":"b9hfWqHMdEnnZfnmh","grade":"D","capital":28339,"price":50,"release":1768,"profit":14864,"vipBonusStocks":363.2,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["七海千秋","槍彈辯駁","彈丸論破","ダンガンロンパ","超高校級的遊戲玩家","小天使"],"createdAt":1515512100592},{"companyId":"eS458iLoLJfPTYiLP","name":"瀧本日富美","chairman":"TcYn9NBmqQbd52Rd6","manager":"TcYn9NBmqQbd52Rd6","grade":"A","capital":144637,"price":225,"release":1110,"profit":132511,"vipBonusStocks":229.11,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["瀧本日富美","瀧本一二三","滝本 ひふみ／たきもと ひふみ","山口愛","滝本 一二三","NEW GAME!","ニューゲーム!","芳文社","得能正太郎"],"createdAt":1515511740577},{"companyId":"y7FwiZZjsPsrKGWqv","name":"莉奈特・萬斯","chairman":"KeJktzGX8GgwFseSp","manager":"GzQhfEwZnTkNRujKg","grade":"D","capital":17440,"price":182,"release":1090,"profit":71020,"vipBonusStocks":725.45,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":3,"nextSeasonEmployeesNumber":3,"tags":["莉奈特・萬斯","リネット・ヴァンス","Linette・Vance","BLOODY†RONDO","BLOODY RONDO","狼人","無口","巨乳","百合","大劍"],"createdAt":1515509820558},{"companyId":"asTgjYDsLtqTPmDet","name":"時崎狂三","chairman":"n7irf4sFizDfyCgj9","manager":"rQSA5gf4DvfpzxjzR","grade":"A","capital":457675,"price":1882,"release":1238,"profit":298770.2,"vipBonusStocks":360.45000000000005,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":4,"nextSeasonEmployeesNumber":5,"tags":["時崎狂三","ときさき くるみ","Tokisaki Kurumi","約會大作戰","デート・ア・ライブ","DAL","Date A Live","精靈","腹黑","黑絲","騷","Nightmare","橘公司","巨乳","蘿莉塔","夢魘","ナイトメア","雙槍","刻刻帝","神威靈裝．三番","雙馬尾","蝕時之城"],"createdAt":1515506760507},{"companyId":"yJsdc6GBGPQ3M33q8","name":"貞德(Alter)","chairman":"CaNMmfd5m3yHByYEz","manager":"CaNMmfd5m3yHByYEz","grade":"B","capital":94272,"price":230,"release":1473,"profit":6100,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["Fate/Grand Order","typemoon","貞德Alter","黑貞","fgo","復仇聖女","龍之魔女","黑貞德"],"createdAt":1515506640502},{"companyId":"JhPepjxz5fQyiz8nQ","name":"緹歐·普拉托","chairman":"NW9bGqupdNuiN7pRo","manager":"NW9bGqupdNuiN7pRo","grade":"D","capital":28224,"price":40,"release":1764,"profit":34241,"vipBonusStocks":1200.1,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["緹歐·普拉托","緹歐","Falcom","軌跡","零之軌跡","閃之軌跡","碧之軌跡","水橋香織","水橋 かおり","缇欧","英雄伝説","軌跡シリーズ","碧の軌跡","ティオ・プラトー","ティオ","零の軌跡"],"createdAt":1515502380353},{"companyId":"LDP7wz6qv9jpb3Txr","name":"佐倉千代","chairman":"AKCDWqToDZsgWQQXd","manager":"YRh6w88YRhoDWsmdm","grade":"C","capital":31412,"price":106,"release":1878,"profit":14080,"vipBonusStocks":128.32,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["佐倉千代","さくら ちよ","派拉斯","月刊少女野崎君","月刊少女野崎くん"],"createdAt":1515500340332},{"companyId":"YGTYHdQH2dGRve29H","name":"內藤舞亞","chairman":"LqeYNy7zE5sEAo3DQ","manager":"NJfSL759DdzfsxsAX","grade":"D","capital":17035,"price":134,"release":1051,"profit":89990,"vipBonusStocks":975.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":10,"nextSeasonEmployeesNumber":7,"tags":["内藤舞亜","内藤舞亞","ハピメア","ないとう","まいあ","遠野そよぎ","Galgame","HAPYMAHER","幸福惡夢"],"createdAt":1515495900082},{"companyId":"XwzXzc8J7iHtusz4A","name":"小幸","chairman":"M4svYnta9ix9oxCmN","manager":"3Fki3Wd8qCCxTdgoa","grade":"D","capital":13568,"price":22,"release":1676,"profit":8656,"vipBonusStocks":578.0799999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["さっちゃん","小幸","三顆星彩色冒險","三顆星","三星","彩色","冒險","三ツ星カラーズ"],"createdAt":1515479816753},{"companyId":"JHreZAmtFH3n23stK","name":"丹生谷森夏","chairman":"pdKZNuvYYY4dZ3yzL","manager":"pdKZNuvYYY4dZ3yzL","grade":"C","capital":97291,"price":11,"release":9308,"profit":80896.99999999999,"vipBonusStocks":4854.38,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["Nibutani Shinka","森大人","中二病也要談戀愛","KyotoAnime","京都動畫","赤崎千夏","中二病でも恋がしたい！","にぶたに しんか","丹生谷森夏"],"createdAt":1515475256710},{"companyId":"X9a6YBnhNawCkwax2","name":"南乃 ありす","chairman":"7h9NHTPHpDeNKu9gv","manager":"7h9NHTPHpDeNKu9gv","grade":"D","capital":10815,"price":6,"release":1325,"profit":13122.9,"vipBonusStocks":853.65,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["南乃 ありす","qoobrand","Galgame","狗神煌","魔女こいにっき","楠原ゆい","なんの　ありす","NANNO ALICE","魔女こいにっきDragon×Caravan"],"createdAt":1515457256489},{"companyId":"imKcJorvpxmPjZYJC","name":"有田春雪","chairman":"vMGZ6uRRRRueL9oX2","manager":"vMGZ6uRRRRueL9oX2","grade":"D","capital":4428,"price":1,"release":1207,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["有田春雪","アリタ・ハルユキ","加速世界","アクセル・ワールド","Silver Crow","シルバー・クロウ","銀の鴉","梶裕貴"],"createdAt":1515455216462},{"companyId":"BaaA9jc5tyBgPwHdR","name":"條河麻耶","chairman":"4sqwj4ij698q9JoiG","manager":"fD4prFEkchyBznc8Y","grade":"C","capital":39092,"price":68,"release":2101,"profit":27674.1,"vipBonusStocks":3.9000000000000057,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":3,"nextSeasonEmployeesNumber":3,"tags":["条河麻耶","條河麻耶","請問您今天要來點兔子嗎？","ご注文はうさぎですか？","芳文社","點兔","兔子","麻耶"],"createdAt":1515450716392},{"companyId":"mMbJxhgLsEZ847q2i","name":"一色伊呂波","chairman":"eAKyGkMCNoiKpZdJE","manager":"LqeYNy7zE5sEAo3DQ","grade":"B","capital":177523,"price":403,"release":1928,"profit":142336,"vipBonusStocks":489.24,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["一色伊呂波","一色彩羽","一色 いろは","Isshiki Iroha","我的青春戀愛物語果然有問題","やはり俺の青春ラブコメはまちがっている。","佐倉綾音","我的青春恋爱物语果然有问题","My Youth Romantic Comedy Is Wrong, As I Expected","果然我的青春戀愛喜劇搞錯了。"],"createdAt":1515450656393},{"companyId":"mqReXx7tRpzQ2ifhs","name":"楪祈","chairman":"97Wc6p2NPFNDmeRxY","manager":"odcG6CgzeG97eiCGq","grade":"A","capital":133010,"price":481,"release":1951,"profit":148002.5,"vipBonusStocks":1221.41,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":0,"tags":["楪祈","罪惡王冠","ゆずりは いのり","EGOIST","歌姬","ギルティクラウン"],"createdAt":1515446456331},{"companyId":"DT4cubmXsNZYZ56ts","name":"坂柳有栖","chairman":"9pw4w5zg9RNzrK2Ew","manager":"9pw4w5zg9RNzrK2Ew","grade":"C","capital":46092,"price":330,"release":1315,"profit":17160,"vipBonusStocks":450.55,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["白銀髮","病弱","貝雷帽","貧乳","歡迎來到實力至上主義的教室","ようこそ実力至上主義の教室へ","坂柳有栖","さかやなぎ ありす"],"createdAt":1515444536281},{"companyId":"vNZxdhR9qBmWznTN5","name":"川內(艦これ)","chairman":"6AYkfTdhrMdefwJ6Z","manager":"6AYkfTdhrMdefwJ6Z","grade":"C","capital":35160,"price":68,"release":1353,"profit":53180.15,"vipBonusStocks":698.28,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["川内","川內","せんだい","艦これ","艦隊收藏","kancolle","艦隊Collection","艦隊これくしょん","夜戰笨蛋","夜戰"],"createdAt":1515443936272},{"companyId":"zak5nYfqMoSP87vZc","name":"大海原","chairman":"WDPzy7B7DAC2s66ff","manager":"WDPzy7B7DAC2s66ff","grade":"D","capital":19307,"price":15,"release":2772,"profit":38276.95,"vipBonusStocks":1611.07,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["大海原","大海原與大海原","大海原と大海原","海底囚人","わだのはら"],"createdAt":1515443576265},{"companyId":"b745mgoTLw2pou5Pu","name":"櫻之宮莓香","chairman":"rQSA5gf4DvfpzxjzR","manager":"rQSA5gf4DvfpzxjzR","grade":"C","capital":67038,"price":112,"release":1830,"profit":65445,"vipBonusStocks":913.45,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["櫻之宮莓香","抖S","調教咖啡廳","Blend·S","桜ノ宮 苺香","Sakuranomiya Maika","反差萌","ブレンド・S","芳文社","中山幸","腹黑","女王","抖 S","黑長直","雙馬尾","女僕","咖啡廳","女僕咖啡廳","粉紅"],"createdAt":1515439496217},{"companyId":"oCiQrQvdGrznNvRss","name":"安丘比(安齋千代美)","chairman":"mG37qKbYtarf5PYyW","manager":"mG37qKbYtarf5PYyW","grade":"D","capital":12234,"price":101,"release":1368,"profit":29780.550000000003,"vipBonusStocks":548.8000000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["ガールズ＆パンツァー","ドゥーチェ","アンチョビ","安丘比","GIRLS und PANZER","ガルパン","高中生","雙馬尾","起司","少女與戰車","GUP","少女與戰車劇場版","統帥","Girls und Panzer der Film","ガールズ＆パンツァー 劇場版","吉岡麻耶","安齊奧","意大利","義大利","P40","ガールズ＆パンツァー 最終章"],"createdAt":1515439436214},{"companyId":"GyEBbESogp4QKtFzu","name":"萬由里","chairman":"6nycyyh2aYturGHhs","manager":"6nycyyh2aYturGHhs","grade":"C","capital":32544,"price":288,"release":1017,"profit":118541,"vipBonusStocks":634.64,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["萬由里","Mayuri","万由里","まゆり","約會大作戰劇場版：萬由里審判","约会大作战剧场版：万由里裁决","デート・ア・ライフ劇場版：萬由里ジャッジメント","Date A Live the movie:Mayuri Judgement","雨宮天","てんちゃん","金髮","粉瞳","16歲","神威靈裝•萬番","神威灵装•万番","雷霆聖堂","雷霆圣域","ケルビエル","Kerubiel","煌炎之劍ラハットヘレヴ","系統天使","システムケルブ","System Cherub","基路冰","智天使","ケルビム"],"createdAt":1515431396109},{"companyId":"4kEmm46woFaJzjdfh","name":"綾波麗","chairman":"9HpERNXAsnB8z8YQd","manager":"9HpERNXAsnB8z8YQd","grade":"D","capital":24871,"price":78,"release":1867,"profit":21440,"vipBonusStocks":776.6,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":2,"tags":["綾波レイ","绫波丽","绫波零","eva","新世纪福音战士","新世紀福音戰士","綾波麗","新世紀エヴァンゲリオン","Neon Genesis Evangelion"],"createdAt":1515431336106},{"companyId":"sCiwuwBzoDcswiPoy","name":"霧切響子","chairman":"sSy4gwNpDwQqhDf5A","manager":"b9hfWqHMdEnnZfnmh","grade":"C","capital":31943,"price":80,"release":1806,"profit":21477,"vipBonusStocks":993.42,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["霧切響子","槍彈辯駁","彈丸論破","ダンガンロンパ","超高校級的偵探"],"createdAt":1515429236060},{"companyId":"uBqCEvj2tBdND26An","name":"一之瀨帆波","chairman":"s8XLxWMCPFc3nYhmj","manager":"ee7z9C4q4pGyTcGNn","grade":"B","capital":101952,"price":370,"release":1593,"profit":42866,"vipBonusStocks":356.5,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["一之瀨帆波","東山奈央","巨乳","援","風評被害","いちのせ ほなみ","欢迎来到实力至上主义的教室","ようこそ実力至上主義の教室へ","歡迎來到實力至上主義的教室","衣笠彰梧"],"createdAt":1515422215939},{"companyId":"mpH8fGwRk9XtRy99i","name":"蕾西亞","chairman":"odcG6CgzeG97eiCGq","manager":"odcG6CgzeG97eiCGq","grade":"A","capital":159425,"price":166,"release":1478,"profit":50547.8,"vipBonusStocks":836.2,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["Lacia","レイシア","蕾西亚","Beatless","沒有心跳的少女","東山奈央","白髮","蕾西亞"],"createdAt":1515422095938},{"companyId":"S2cmnQ2wZiN6QnFM9","name":"藍原芽衣","chairman":"ZjRGuGPY3hS5dFMCc","manager":"Crkz9Q7kbnvnCQKhs","grade":"D","capital":22035,"price":230,"release":1303,"profit":12002,"vipBonusStocks":45.1,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["藍原 芽衣","あいはら めい","蓝原芽衣","Aihara Mei","citrus ～柑橘味香氣～","百合"],"createdAt":1515420595917},{"companyId":"QgWWv3irK8ymZi7sE","name":"寄葉二號B型","chairman":"ZxKdDYwunQ9gaCdTB","manager":"b9hfWqHMdEnnZfnmh","grade":"D","capital":25104,"price":165,"release":1569,"profit":54868.45,"vipBonusStocks":826.1,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["YoRHa No.2 Type B","2B","寄葉二號B型","NieR:Automata","尼爾：自動人形"],"createdAt":1515418075889},{"companyId":"6FrHyynNNkEkh6Px6","name":"矢澤日香","chairman":"FcuexmLFtkxyzNGDP","manager":"fufhWoPehboA46pEy","grade":"B","capital":204744,"price":100,"release":2786,"profit":367450.5,"vipBonusStocks":1974.3700000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["矢澤日香","矢沢にこ","妮可","小香香","Nico","雙馬尾","LoveLive","ラブライブ","μ's","小惡魔","徳井青空"],"createdAt":1515413635798},{"companyId":"t7rSTKsY3LY5KSKZh","name":"千反田愛瑠","chairman":"rWRYoDCaT6LnzffhJ","manager":"sSy4gwNpDwQqhDf5A","grade":"B","capital":114295,"price":648,"release":1763,"profit":171349.5,"vipBonusStocks":711.8,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["千反田愛瑠","千反田 える","冰菓","我很好奇","古典部","黑長直","〈古典部〉シリーズ"],"createdAt":1515412375782},{"companyId":"usvN9cCkh37xwTo6S","name":"米卡莎·阿卡曼","chairman":"MTdhno2mSjtmhNbpn","manager":"zDeFCZcBfiqPPEJke","grade":"D","capital":30040,"price":13,"release":2054,"profit":23712.800000000003,"vipBonusStocks":402.95000000000005,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["三笠．阿克曼","米卡薩．阿卡曼","ミカサ・アッカーマン","Mikasa Ackerman","石川由依","進擊的巨人","進撃の巨人","ATTACK ON TITAN"],"createdAt":1515388735896},{"companyId":"kR86PqL2j6B8rmDRH","name":"夏咲 詠(ヨミ)","chairman":"7h9NHTPHpDeNKu9gv","manager":"7h9NHTPHpDeNKu9gv","grade":"D","capital":19534,"price":29,"release":1215,"profit":30915,"vipBonusStocks":916.1,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["向日葵的教會與漫長的暑假","向日葵的教會與長夏假期","夏咲 詠","猫詠","黑猫","黑貓","枕","Galgame","makura","向日葵の教会と長い夏休み","よみ","ヨミ","yomi"],"createdAt":1515384715205},{"companyId":"HpvCcsQzAYqgPHnsA","name":"單色小姐","chairman":"dujtTAdg8CzqqE9su","manager":"5yc4uqEmrauzHKGKH","grade":"A","capital":202598,"price":800,"release":1220,"profit":624480,"vipBonusStocks":775.44,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":4,"nextSeasonEmployeesNumber":4,"tags":["單色小姐","黑白小姐","ミス・モノクローム","モノクローム","單色小姐 -The Animation-","黑白小姐 -The Animation-","ミス・モノクローム -The Animation-","臨時女友","ガールフレンド（仮）","堀江由衣","白髮"],"createdAt":1515384055144},{"companyId":"XQyrNR9e5u4G7wpty","name":"高海千歌","chairman":"hb9FBgr2s7hmz5pgx","manager":"hb9FBgr2s7hmz5pgx","grade":"C","capital":50023,"price":34,"release":2048,"profit":136195.2,"vipBonusStocks":1274.65,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["蜜柑?","普通怪獣チカッチー","高海千歌","Aqours","LoveLive! Sunshine!!","ラブライブ！サンシャイン!!","CYaRon!","かんかんみかん","伊波杏樹"],"createdAt":1515383875142},{"companyId":"MSEcDYkzbC5vrDs4c","name":"櫻內梨子","chairman":"yir6KneMwZHHmPdJ6","manager":"qr9KsqtW9y28EoHig","grade":"C","capital":52392,"price":90,"release":2077,"profit":159161.4,"vipBonusStocks":1487.95,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["櫻內梨子","lovelive","Aqours","LoveLive! Sunshine!!","ラブライブ！サンシャイン","LL","桜内 梨子","さくらうち りこ"],"createdAt":1515383155131},{"companyId":"iEEB2joFjjAT8Y97E","name":"絆愛","chairman":"xTBDJ9h6LqsqpoGrG","manager":"CWgfhqxbrJMxsknrb","grade":"C","capital":58882,"price":350,"release":1666,"profit":103160,"vipBonusStocks":702.48,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["絆愛","キズナアイ","Kizuna AI","A.I.Channel","A.I.Games","AI","人工智慧","人工智障","虛擬偶像","Virtual Youtuber","愛醬","156公分","46公斤","6月30日","虛擬Youtuber"],"createdAt":1515382495125},{"companyId":"syE9qjMgD8WNDeYef","name":"ミライアカリ","chairman":"XbWpWvgvFTjxyCC3v","manager":"XbWpWvgvFTjxyCC3v","grade":"C","capital":44020,"price":46,"release":1682,"profit":100075.75,"vipBonusStocks":1275.64,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":0,"tags":["ミライアカリ","バーチャルYouTuber","バーチャル芸人","四天王","KEI","?","mirai akari"],"createdAt":1515382375161},{"companyId":"kZ6ThGasQMJs7mBHJ","name":"蕾斯提亞","chairman":"n3P3iqse6vQpGztFa","manager":"n3P3iqse6vQpGztFa","grade":"C","capital":102267,"price":33,"release":3634,"profit":114559.5,"vipBonusStocks":2657.75,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["レスティア","Restia","精靈使的劍舞","精霊使いの剣舞","暗精靈","貫穿真實之劍","蕾斯提亞"],"createdAt":1515382375124},{"companyId":"T2PSt8zfMzkgLdKkf","name":"露璐","chairman":"zp2yWRZkyvnwjRYxk","manager":"zp2yWRZkyvnwjRYxk","grade":"D","capital":11996,"price":15,"release":1619,"profit":7726.2,"vipBonusStocks":99.70000000000005,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["英雄聯盟","LOL","約德爾人","小蘿莉","精靈魔法使","星光少女組","Star Guardian","皮克斯","小皮","League of Legend","Lulu","露璐","甜點魔法使","黑貓魔法使","馴龍高手","普羅雪精靈","泳池狂歡"],"createdAt":1515382195106},{"companyId":"xp33HowTbPYQcSqAK","name":"桐間紗路","chairman":"NJfSL759DdzfsxsAX","manager":"NJfSL759DdzfsxsAX","grade":"B","capital":101380,"price":80,"release":6259,"profit":208209,"vipBonusStocks":4868.25,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["桐間紗路","芳文社","請問您今天要來點兔子嗎","大小姐","貧乳","シャロ","きりま しゃろ","ご注文はうさぎですか?","點兔","內田真禮"],"createdAt":1515381475197},{"companyId":"CjCzSaiiEZd3BmTTQ","name":"桐谷直葉","chairman":"mY8T2wTrnRobydgxG","manager":"b9hfWqHMdEnnZfnmh","grade":"D","capital":33264,"price":52,"release":1594,"profit":29619.5,"vipBonusStocks":569.0400000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["桐谷直葉","桐ヶ谷直葉","莉法","リーファ","ソードアート・オンライン","刀劍神域","妖精之舞","SAO"],"createdAt":1515380575090},{"companyId":"Y8hoKSZdnRt8miWdz","name":"宮水三葉","chairman":"wb9MkbmEDko27teJT","manager":"wb9MkbmEDko27teJT","grade":"C","capital":36408,"price":110,"release":1071,"profit":58352,"vipBonusStocks":591,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["宮水三葉","みやみず みつは","你的名字。","君の名は。"],"createdAt":1515380155086},{"companyId":"qpatq7CL72DvakBAY","name":"天天座理世","chairman":"EHFEf53SysraNAv9G","manager":"EHFEf53SysraNAv9G","grade":"C","capital":61516,"price":94,"release":1670,"profit":51940,"vipBonusStocks":678.0999999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["天天座理世","天々座理世","請問您今天要來點兔子嗎？","ご注文はうさぎですか?","點兔","種田梨沙","芳文社"],"createdAt":1515379615080},{"companyId":"qCHoW4DRqomDoTi62","name":"保登心愛","chairman":"xqbwsPDztizN9QRWv","manager":"xqbwsPDztizN9QRWv","grade":"C","capital":56339,"price":1216,"release":1312,"profit":142001,"vipBonusStocks":612.28,"managerProfitPercent":0.05,"salary":1997,"nextSeasonSalary":1997,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["點兔","芳文社","請問您今天要來點兔子嗎","ご注文はうさぎですか?","保登心愛"],"createdAt":1515378115067},{"companyId":"xHunKWPmhQs75SD4a","name":"瑪修·基列萊特","chairman":"Yr5mpKfRqK7qt9pbk","manager":"ee7z9C4q4pGyTcGNn","grade":"D","capital":24348,"price":199,"release":1386,"profit":22772,"vipBonusStocks":412,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["Fate/Grand Order","瑪修·基列萊特","Mash Kyrielight","マシュ・キリエライト","Shielder","盾","typemoon","FGO","命運/冠位指定","種田梨沙","高橋李依","粉毛"],"createdAt":1515377935066},{"companyId":"sxQsysQ8gSaC7LH43","name":"松嶋滿","chairman":"KqoJew96N69N2AZw5","manager":"niGXx9Xrajb9tMtyX","grade":"D","capital":16487,"price":87,"release":1026,"profit":13650,"vipBonusStocks":60.20000000000001,"managerProfitPercent":0.05,"salary":1500,"nextSeasonSalary":1500,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["松嶋滿","松嶋みちる","まつしま みちる","灰色的果實","グリザイアの果実","灰色的迷宮","グリザイアの迷宮","灰色的樂園","グリザイアの楽園","羽仁麗","水橋香織","雙馬尾","小滿","滿大小姐","傲嬌","金髮","松島滿"],"createdAt":1515370014979},{"companyId":"uq9zvBNqF5EzkDRmf","name":"西木野真姬","chairman":"97Wc6p2NPFNDmeRxY","manager":"odcG6CgzeG97eiCGq","grade":"C","capital":198319,"price":90,"release":2018,"profit":18236.5,"vipBonusStocks":79.01000000000002,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["西木野真姬","西木野まき","にしきのまき","ラブライブ！","Love Live!","制服","一年生","紅髮","Nishikino Maki","西木野真姫"],"createdAt":1515364134919},{"companyId":"mChWHSXQP3LBhFpNf","name":"日向夏帆","chairman":"EJ9vQqhiitbmmTvWh","manager":"EJ9vQqhiitbmmTvWh","grade":"D","capital":12204,"price":44,"release":1448,"profit":12000,"vipBonusStocks":53.30000000000008,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["日向夏帆","調教咖啡廳","ブレンド・S","Blend·S","ひなた かほ","金髮","雙馬尾","藍瞳","巨乳","學渣","遊戲玩家","Hinata Kaho"],"createdAt":1515363354910},{"companyId":"gjxr5XqLeYTP22o3n","name":"黑澤黛雅","chairman":"2HFha7H4TviS3Pbra","manager":"hb9FBgr2s7hmz5pgx","grade":"D","capital":25897,"price":34,"release":1315,"profit":34928.95,"vipBonusStocks":564.3,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["ぶっぶーですわ！❌","黑澤黛雅","硬度10","其實是硬度0","黒澤ダイヤ","LoveLive! Sunshine!!","ラブライブ！サンシャイン!!","Aqours","AZALEA","A・Z・L・A・E・A あっぜりあ～","ダイヤちゃん","小宮有紗","?"],"createdAt":1515362034895},{"companyId":"ECN3kpuDL6AuoSWHc","name":"間桐櫻","chairman":"TfXXpcWWsk43TqPcd","manager":"TfXXpcWWsk43TqPcd","grade":"A","capital":171051,"price":1600,"release":1307,"profit":216935,"vipBonusStocks":328.05,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":3,"nextSeasonEmployeesNumber":3,"tags":["間桐桜/間桐櫻/Mato Sakura","Fate/stay night","Fate/Zero","黑化","人妻(偽)"],"createdAt":1515361194877},{"companyId":"JqLFPhxWWmqdhnMAp","name":"響","chairman":"SHNgQuNfQYf6M7f4J","manager":"ikkExQXJ6hgm6WwGA","grade":"A","capital":610743,"price":1062,"release":1743,"profit":478280,"vipBonusStocks":759.6500000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":7,"nextSeasonEmployeesNumber":6,"tags":["ひびき","Верный","艦隊收藏","艦隊これくしょん -艦これ-","第六驅逐隊","響"],"createdAt":1515353394763},{"companyId":"EC42RZkfL9sT5KEwa","name":"鑽石","chairman":"gqd8PKAnwCJsYs5SQ","manager":"SE2tLqhCaFa4SvxCs","grade":"D","capital":21926,"price":61,"release":1286,"profit":4588,"vipBonusStocks":40.670000000000044,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["ダイヤモンド","Diamond","小鑽","寶石之國","宝石の国","鑽石"],"createdAt":1515353094757},{"companyId":"AucNvRsZEesXrLZbQ","name":"司波深雪","chairman":"u4hr4ECP9je3Fanpg","manager":"2jEdKoLxjooZYm3nv","grade":"B","capital":138856,"price":148,"release":1388,"profit":233859.7,"vipBonusStocks":631.98,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":6,"nextSeasonEmployeesNumber":3,"tags":["しば みゆき","Shiba Miyuki","魔法科高中的劣等生","魔法科高校の劣等生","早見沙織","司波深雪"],"createdAt":1515352974754},{"companyId":"MQ5kEX9wJTzQbCDsC","name":"美遊","chairman":"4NDAiWhT9cnrozeBH","manager":"4NDAiWhT9cnrozeBH","grade":"C","capital":42127,"price":196,"release":1075,"profit":0,"vipBonusStocks":102.7,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["美遊","美遊．艾蒂菲爾特","美遊・エーデルフェルト","Fate/kaleid liner 魔法少女☆伊莉雅","衛宮美遊","朔月美遊","みゆ・えーでるふぇると"],"createdAt":1515351834735},{"companyId":"r6qnoZ69bkovwD9NT","name":"千戶","chairman":"vbyMjZSFWps9ukwvk","manager":"vbyMjZSFWps9ukwvk","grade":"D","capital":19303,"price":860,"release":1147,"profit":27575,"vipBonusStocks":82.79000000000005,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["千戶","チト","少女終末旅行","千都"],"createdAt":1515351294727},{"companyId":"HAHcmRj72oAFfwp2j","name":"高坂穗乃果","chairman":"hb9FBgr2s7hmz5pgx","manager":"9zgqJmrkArp5AqQvX","grade":"C","capital":42531,"price":46,"release":1763,"profit":74109,"vipBonusStocks":653.57,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["果皇","果果","Kosaka Honoka","こうさか ほのか","高坂穗乃果","喉嚨卡","高坂穂乃果","μ's","LoveLive!","ラブライブ！","LL","Printemps","新田惠海","新田恵海","えみつん"],"createdAt":1515351054726},{"companyId":"WJLD8DEhJKBXsjCeg","name":"羽鳥智世","chairman":"uZsda7sCcdjDJiZ9h","manager":"wa5LAfzQS46jkA3r7","grade":"D","capital":18091,"price":144,"release":1097,"profit":1791.5,"vipBonusStocks":1.2000000000000028,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["羽鸟智世","はとり ちせ","魔法使的新娘","魔法使いの嫁","羽鳥智世"],"createdAt":1515350694719},{"companyId":"DcvBL6Aa3YTyqyuzj","name":"阿璃","chairman":"y8yQG4Dz7Tm46xuDF","manager":"y8yQG4Dz7Tm46xuDF","grade":"A","capital":153983,"price":34,"release":4642,"profit":374149.65,"vipBonusStocks":3769.58,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["英雄聯盟","LOL","Ahri","九尾妖狐","League of legends","Nine-Tailed Fox","阿狸","英雄联盟","狐狸","星光少女","星光隊長","Star Guardian","星之守护者","電玩女神","靈隱狐仙","傾國妖狐","傳說啟程","妖焰火狐","魅惑時代","菁英學院","銷魂","幻玉","魅火","傾城","飛仙","九尾の狐","アーリ"],"createdAt":1515350514719},{"companyId":"sFSNvyK2gBMYz9Kkm","name":"安娜斯塔西婭","chairman":"DQWd8cx5j6HWa3pNQ","manager":"DQWd8cx5j6HWa3pNQ","grade":"C","capital":39941,"price":800,"release":1101,"profit":25109.45,"vipBonusStocks":274.52000000000004,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["安娜斯塔西婭","アーニャ","阿妮亞","Anastasia","アナスタシア","上坂堇","偶像大師","偶像大師 灰姑娘女孩","アイドルマスター シンデレラガールズ","THE IDOLM@STER CINDERELLA GIRLS"],"createdAt":1515350394717},{"companyId":"r2wwgWqvRYf6C3cXZ","name":"辰砂","chairman":"qr9KsqtW9y28EoHig","manager":"phcAQGMJTXBWYTdBC","grade":"D","capital":63040,"price":9,"release":3055,"profit":35979,"vipBonusStocks":536.33,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["Cinnabar","シンシャ","寶石之國","辰砂","宝石の国"],"createdAt":1515347154670},{"companyId":"bx2XimMPZXuEGcSoR","name":"Bismarck(艦これ)","chairman":"D3rzjAkF7YTKAAqd4","manager":"D3rzjAkF7YTKAAqd4","grade":"C","capital":35140,"price":95,"release":1200,"profit":58830,"vipBonusStocks":667,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["Bismarck","俾斯麥","ビスマルク","ビス子","艦これ","艦隊收藏","kancolle","艦隊Collection","戰艦","海外艦","艦隊これくしょん"],"createdAt":1515346374661},{"companyId":"mttL3759rhzaSiXxT","name":"柯柯麗","chairman":"knN4an79B3upSFraC","manager":"mDA3Kj9Z9E6B8RANi","grade":"D","capital":20624,"price":66,"release":1372,"profit":18000,"vipBonusStocks":850.45,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":3,"nextSeasonEmployeesNumber":3,"tags":["柯柯麗","ククリ","咕嚕咕嚕魔法陣","魔法陣グルグル","歌莉"],"createdAt":1515344874643},{"companyId":"kH7b6ongcCcxuTBJb","name":"里見蓮太郎","chairman":"BnJWBnM573fiajTu8","manager":"Qro83h9xCzFsKcZex","grade":"D","capital":6244,"price":14,"release":1508,"profit":4093.75,"vipBonusStocks":69.19000000000007,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["黑色子彈","里見蓮太郎","ブラック・ブレット","さとみれんたろう"],"createdAt":1515344094618},{"companyId":"oXLMJ7S43PZHDCSNY","name":"阿爾泰爾","chairman":"a8P8nW8Q4Wc2p7M7K","manager":"a8P8nW8Q4Wc2p7M7K","grade":"B","capital":70622,"price":100,"release":1860,"profit":379968.1,"vipBonusStocks":755.53,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":14,"nextSeasonEmployeesNumber":13,"tags":["Re:CREATORS","アルタイル","軍服の姫君","軍服公主","軍姬","阿爾泰爾","ぐんぷくのひめぎみ","豐崎愛生","Altair"],"createdAt":1515343074608},{"companyId":"7n6yQfQheNxxmh9MF","name":"五河士織","chairman":"ee7z9C4q4pGyTcGNn","manager":"LqeYNy7zE5sEAo3DQ","grade":"B","capital":84461,"price":34,"release":5453,"profit":170320.8,"vipBonusStocks":4129.650000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["いつか しおり","五河士道","五河士織","五河士织","約會大作戰","DATE A LIVE","デート・ア・ライブ","いつか しどう","藏合紗惠子"],"createdAt":1515342834604},{"companyId":"wN9GAA8mmjGjAaB4W","name":"中野梓","chairman":"8KBB5Pqk2zpZ3WYMh","manager":"TyosT9hnMKHScy7eR","grade":"D","capital":27586,"price":276,"release":1454,"profit":32070,"vipBonusStocks":498.65,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["けいおん","K-ON","輕音少女","京都動畫","京都アニメーション","中野梓","なかの　あずさ"],"createdAt":1515342534601},{"companyId":"PzczMSCkz57ex5Cyk","name":"黃前久美子","chairman":"ZGEHXiYQjfgT2wDWR","manager":"Crkz9Q7kbnvnCQKhs","grade":"C","capital":56473,"price":195,"release":1530,"profit":86136.5,"vipBonusStocks":839.99,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["黃前久美子","Oumae Kumiko","響け！ユーフォニアム","Sound!Euphonium","吹響！上低音號","京都動畫"],"createdAt":1515342174599},{"companyId":"D9kbYvuw3QSWsoE6i","name":"穗姬","chairman":"YjSS6AK2iZXB3jr3u","manager":"d7LS7rorzJTj49xrQ","grade":"B","capital":120032,"price":1000,"release":1524,"profit":64612.5,"vipBonusStocks":599.86,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["穗姬","萌米","東津萌米"],"createdAt":1515341994633},{"companyId":"ZJgkvMpqxLqeW827k","name":"白","chairman":"57K7y75tjfkHXdMNH","manager":"57K7y75tjfkHXdMNH","grade":"B","capital":179923,"price":1300,"release":1284,"profit":237301.1,"vipBonusStocks":454.38,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":3,"nextSeasonEmployeesNumber":2,"tags":["tag白","tagNO GAME NO LIFE 遊戲人生","tagしろ","tagノーゲーム・ノーライフ"],"createdAt":1515341994597},{"companyId":"r5cp6FGFhSCpabHf3","name":"伊吹 萃香","chairman":"cHnWbRCEBp5pLvNbd","manager":"cHnWbRCEBp5pLvNbd","grade":"D","capital":16849,"price":69,"release":1014,"profit":23990.8,"vipBonusStocks":529.19,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["伊吹萃香","伊吹","萃香","伊吹 萃香","西瓜","Ibuki Suika","いぶきすいか","東方","東方project","TOUHOU","萃夢想"],"createdAt":1515341094551},{"companyId":"LFWvXaDtBnD5CJ7uz","name":"春田 Springfield M1903","chairman":"dPYGagPm6RGXEdLHa","manager":"M6MxS9uHWFHczjjML","grade":"B","capital":88779,"price":175,"release":1487,"profit":197635,"vipBonusStocks":930.73,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":4,"nextSeasonEmployeesNumber":4,"tags":["Springfield M1903","春田","少女前線","春田步槍","4☆RF","太太","Girl‘s Frontline"],"createdAt":1515339834528},{"companyId":"viQTjWr4AMkwa4Ats","name":"WA2000(哇醬)","chairman":"wunED8HsdncRLJ7Dh","manager":"wunED8HsdncRLJ7Dh","grade":"B","capital":65307,"price":185,"release":1681,"profit":119390,"vipBonusStocks":1171.7,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":3,"tags":["少女前線","傲嬌","小編","甜食愛好者","白學","少女前线","Girls' Frontline","少女戰線","少女戦線","WA2000","哇醬","哈根達斯","소녀 전선","多元菌","WA醬","戶松遙"],"createdAt":1515339774528},{"companyId":"DRRh6vDKPDdrgPMYo","name":"博麗靈夢","chairman":"pZR69fp9DtX8QYEbB","manager":"pZR69fp9DtX8QYEbB","grade":"C","capital":50117,"price":241,"release":1561,"profit":61066.5,"vipBonusStocks":855,"managerProfitPercent":0.05,"salary":500,"nextSeasonSalary":500,"bonus":1,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["東方Project","東方","博麗靈夢","博麗霊夢","はくれい れいむ","Hakurei Reimu","Touhou Project","とうほうぷろじぇくと","巫女","紅白","沒節操","少女","蝴蝶結","愛錢","幻想鄉"],"createdAt":1515339714531},{"companyId":"zHK2KmfbTwFtrthoi","name":"櫻滿集","chairman":"wkeWy9Fgc4DeBXFNS","manager":"pdKZNuvYYY4dZ3yzL","grade":"D","capital":10970,"price":209,"release":1367,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["櫻滿集","桜満集","おうま しゅう","集","集王","罪惡王冠","原罪之冠","ギルティクラウン","GUILTY CROWN","EGOIST"],"createdAt":1515339474527},{"companyId":"iXEsfDgWhSwpiTdyN","name":"鈴谷 (艦これ)","chairman":"nrdJERcAGKv4ggK5d","manager":"nrdJERcAGKv4ggK5d","grade":"C","capital":90440,"price":280,"release":1383,"profit":103513.6,"vipBonusStocks":583.2600000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":3,"nextSeasonEmployeesNumber":3,"tags":["JK重巡","艦隊收藏","最上型三號艦","航空巡洋艦","重巡洋艦","艦隊","艦これ","艦隊Collection","鈴谷","すずや","Suzuya"],"createdAt":1515339054520},{"companyId":"AMvuW7gTQXq8CnagJ","name":"涼風青葉","chairman":"zQCNShSMTpajY5JPg","manager":"fufhWoPehboA46pEy","grade":"C","capital":57988,"price":232,"release":1377,"profit":120489,"vipBonusStocks":584.36,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["涼風青葉","NEW GAME!","飛鷹躍動","すずかぜあおば","SUZUKAZE AOBA","ニューゲーム!","得能正太郎","芳文社","高田憂希","雙馬尾","合法蘿莉"],"createdAt":1515338994519},{"companyId":"pCdPFBEwEY8jF6wN7","name":"明石(碧藍航線)","chairman":"sEc7vEXSNGsDtnuge","manager":"CM6o8gGPE8pjttGKo","grade":"C","capital":59212,"price":8,"release":5969,"profit":151798.6,"vipBonusStocks":4954,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["明石","碧藍航線","あかし","茗","Akashi","アズールレーン","艦B","Azur Lane"],"createdAt":1515338814521},{"companyId":"juyeocFE49QWdJFjj","name":"C.C.","chairman":"eiHgG2SHQa3Y462M7","manager":"eiHgG2SHQa3Y462M7","grade":"C","capital":171376,"price":496,"release":1707,"profit":90300,"vipBonusStocks":938.75,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["C.C.","c.c.","シー・ツー","CODE GEASS 反叛的魯路修","コードギアス 反逆のルルーシュ","CODE GEASS Lelouch of the Rebellion"],"createdAt":1515338754520},{"companyId":"JcPJGpEJ7FXdfpwh6","name":"夏咲 詠","chairman":"7h9NHTPHpDeNKu9gv","manager":"7h9NHTPHpDeNKu9gv","grade":"C","capital":35552,"price":104,"release":1111,"profit":111487,"vipBonusStocks":629.25,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["夏咲 詠","黑貓","黑猫","本尊","向日葵的教會與長夏假期","向日葵的教會與漫長的暑假","よみ","向日葵の教会と長い夏休み","枕","makura","Galgame"],"createdAt":1515338394397},{"companyId":"nzoz5mvXDpgfrdhRP","name":"千石冠","chairman":"k4MBYKEzTfMdMshgz","manager":"k4MBYKEzTfMdMshgz","grade":"B","capital":92975,"price":52,"release":1745,"profit":173081,"vipBonusStocks":1457.7,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["slow star","冠","千石冠","せんごく かむり","芳文社","スロウスタート","篤見唯子","長繩麻理亞"],"createdAt":1515338394360},{"companyId":"tcsMunkDJwBW5RSFR","name":"清姬","chairman":"cedH2LomQEuoBhiMA","manager":"MSGC3gjsBSLHTZbDr","grade":"C","capital":60436,"price":123,"release":1485,"profit":134013.7,"vipBonusStocks":1141.6,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["清姬","kiyohime","fgo","Fate/Grand Order","非法蘿莉","病嬌","きよひめ","命運/冠位指定","和風","フェイト/グランドオーダー","きもの","青髮","白髮","金瞳","紅瞳","龍角"],"createdAt":1515338214358},{"companyId":"DYkrvmFGNNAJNgyLS","name":"鶴見留美","chairman":"aLYDaoKWra4mhsHjR","manager":"aLYDaoKWra4mhsHjR","grade":"D","capital":25017,"price":53,"release":1549,"profit":47520,"vipBonusStocks":521.4099999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["つるみるみ","我的青春戀愛喜劇果然有問題","やはり俺の青春ラブコメはまちがっている","鶴見留美","蘿莉","黑長直","冷嬌"],"createdAt":1515336414352},{"companyId":"kho7ybDCA47dF7r2N","name":"艾爾涅斯帝·埃切貝里亞","chairman":"rQRfnBpyqD6KhA7DX","manager":"rQRfnBpyqD6KhA7DX","grade":"B","capital":86093,"price":80,"release":2588,"profit":198250,"vipBonusStocks":2272.28,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":2,"tags":["艾爾涅斯帝·埃切貝里亞","エルネスティ・エチェバルリア","艾爾","圖書館的公主","騎士&魔法","ナイツ&マジック","高橋李依"],"createdAt":1515335742774},{"companyId":"56LfT5RqwNZzioni8","name":"葛飾北齋(Fate/Grand Order)","chairman":"RYEE7pBfMgCEuvXwK","manager":"7WupNfxPtQYZJHHuf","grade":"D","capital":9352,"price":205,"release":1072,"profit":18760,"vipBonusStocks":26.740000000000002,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":2,"tags":["葛飾北齋","阿榮","葛飾北斎","葛飾應為","お栄","葛飾応為","fate","fate/grand order","fgo","由加奈","Foreigner","降臨者","外來種","外神","邪神"],"createdAt":1515335682773},{"companyId":"tFFubND95nad4rg7M","name":"和泉紗霧","chairman":"oLcFk4YYfsY7XoMm8","manager":"b9hfWqHMdEnnZfnmh","grade":"A","capital":370580,"price":790,"release":1257,"profit":204062.4,"vipBonusStocks":399.95,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":3,"nextSeasonEmployeesNumber":2,"tags":["Izumi Sagiri","兄控","蘿莉","情色漫畫老師","エロマンガ先生","和泉紗霧","いずみ さぎり"],"createdAt":1515335562769},{"companyId":"y25LMJkSg4rAtCGFq","name":"芙蘭朵露·斯卡蕾特","chairman":"kDCmtjc8yaswyJ9Tz","manager":"kDCmtjc8yaswyJ9Tz","grade":"C","capital":48333,"price":151,"release":2021,"profit":60989.2,"vipBonusStocks":924.25,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":2,"tags":["芙蘭","芙蘭朵露·斯卡蕾特","二小姐","東方","東方project","フランドール・スカーレット","Flandre Scarlet","495","妹樣","东方Project"],"createdAt":1515335382766},{"companyId":"XKAJXM6sfqyqLRRki","name":"昴琉","chairman":"Awgwn9QAuX7nFHtas","manager":"zQCNShSMTpajY5JPg","grade":"C","capital":32497,"price":4,"release":15602,"profit":30019.35,"vipBonusStocks":12270.32,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["放課後的昴星團","放課後のプレアデス","すばる","subaru","SUBARU","Pleiades","スバル","昴琉","昴"],"createdAt":1515335322767},{"companyId":"4kzFWyx45E4nR9BXk","name":"夏語遙","chairman":"BcD4GdYGqGgyQfWBp","manager":"ZtdBugqfNz8tXrrYd","grade":"D","capital":14960,"price":494,"release":1661,"profit":31445,"vipBonusStocks":247.7,"managerProfitPercent":0.05,"salary":500,"nextSeasonSalary":500,"bonus":1,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["夏語遙","VOICEMITH","UTAU","虛擬歌手","語遙"],"createdAt":1515335262768},{"companyId":"pGgFTNQ4nX8fu9PLN","name":"西絲緹娜·席貝爾","chairman":"uf2yJ4NhNr3ian9gX","manager":"uf2yJ4NhNr3ian9gX","grade":"B","capital":67853,"price":600,"release":1252,"profit":25900,"vipBonusStocks":108.66000000000003,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":0,"tags":["不正經的魔術講師與禁忌教典","システィーナ＝フィーベル","Sistine Fibel","ロクでなし魔術講師と禁忌教典","西絲緹娜·席貝爾","白貓"],"createdAt":1515334902653},{"companyId":"ws3K2jRpiWJTS887Q","name":"可兒那由多","chairman":"2MnixRrWRWFsYuqa9","manager":"ee7z9C4q4pGyTcGNn","grade":"C","capital":63073,"price":662,"release":1962,"profit":99446.8,"vipBonusStocks":495.79999999999995,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":1,"tags":["平坂讀","如果有妹妹就好了","妹さえいればいい。","Kani Nayuta","可児 那由多","金元壽子","螃蟹公","Imoto Sae Ireba Ii.","可兒那由多"],"createdAt":1515334662652},{"companyId":"s9hGXALgrebJEvCSS","name":"東條希","chairman":"5hdjQ9EA4YZKjps46","manager":"5hdjQ9EA4YZKjps46","grade":"C","capital":59626,"price":102,"release":1757,"profit":73104,"vipBonusStocks":1052.8999999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":1,"tags":["ワシワシ","東條希","Lily White","とうじょうのぞみ","ラブライブ","リリホワイト","リリホ","LoveLive!!"],"createdAt":1515334542752},{"companyId":"Ddc7ciNB2SzkLHjxe","name":"雷姆 (Re:從零開始的異世界生活)","chairman":"rQSA5gf4DvfpzxjzR","manager":"rQSA5gf4DvfpzxjzR","grade":"A","capital":941986,"price":2052,"release":2274,"profit":1233486.9,"vipBonusStocks":672.3599999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":5,"nextSeasonEmployeesNumber":7,"tags":["レム","Re：從零開始的異世界生活","Re：ゼロから始める異世界生活","雷姆","RMT","Re0","ReZero","真愛的顏色","蕾姆","雷姆琳","溫柔","賢妻","我婆","可愛","藍色","短髮","女僕","永遠不過氣","真．女主角","RMK","雙胞胎","鬼族","流星槌","非工具人","雷姆教","女","17 歲","154cm","水瀨祈","Rem","Remu","髮夾","吊帶襪"],"createdAt":1515334542652},{"companyId":"BPi5fiAcgieR8NvgX","name":"娜娜奇","chairman":"wS4RCNMaZb4PB63M9","manager":"wS4RCNMaZb4PB63M9","grade":"B","capital":100314,"price":785,"release":1951,"profit":227123.35,"vipBonusStocks":763.7600000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":7,"nextSeasonEmployeesNumber":5,"tags":["來自深淵","娜娜奇","幹你黎明","米蒂","毛毛卿","ナナチ","nanachi","メイドインアビス","奈奈祈"],"createdAt":1515334482656},{"companyId":"N7Jwk9kkSB9vaWr38","name":"大和(艦これ)","chairman":"dscPCKAfbfCebGnv2","manager":"dscPCKAfbfCebGnv2","grade":"C","capital":105179,"price":43,"release":3067,"profit":86016,"vipBonusStocks":1699,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["やまと","艦隊これくしょん-艦これ-","艦隊Collection","艦Colle","kancolle","艦隊收藏","艦娘","戰列艦","竹達彩奈","大和撫子","旅館","傘","大和","馬尾"],"createdAt":1515334422689},{"companyId":"3rBXcFCMMyDSEzimq","name":"桐崎千棘","chairman":"rH4W5hsFZoqA3JKbh","manager":"FvfycqzbZv98meYN9","grade":"C","capital":39941,"price":311,"release":1493,"profit":26110,"vipBonusStocks":15.400000000000006,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["ニセコイ","偽戀","きりさき ちとげ","Kirisaki Chitoge","桐崎千棘","千棘","傲嬌","猩猩","黃金玫瑰公主"],"createdAt":1515334422656},{"companyId":"KoLPhQH2LAuPwSocG","name":"仲村由理","chairman":"HMZ6R8ZJtmuDztj9Z","manager":"HMZ6R8ZJtmuDztj9Z","grade":"D","capital":20277,"price":122,"release":1168,"profit":37350.4,"vipBonusStocks":467.74,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":2,"tags":["仲村由理","Angel Beats!","なかむら ゆり","ゆり","仲村百合","百合","仲村ゆり","AB!","由理","Nakamura Yuri","Yuri"],"createdAt":1515334362654},{"companyId":"DNtEGxwPQZSwfWScx","name":"秋山澪","chairman":"CCX7BNyjRDGhxJn6L","manager":"EHFEf53SysraNAv9G","grade":"A","capital":432328,"price":1323,"release":1542,"profit":713157,"vipBonusStocks":873.38,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":4,"nextSeasonEmployeesNumber":5,"tags":["秋山澪","輕音少女","K-ON","けいおん","京都動畫","京都アニメーション","日笠陽子","Mio"],"createdAt":1515334302648},{"companyId":"7qmLzewhEYDWjQhSp","name":"名瀨美月","chairman":"bePkR6aWWFHFC4Pju","manager":"bePkR6aWWFHFC4Pju","grade":"D","capital":15386,"price":100,"release":1858,"profit":20748.8,"vipBonusStocks":1198.7099999999998,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":1,"tags":["境界的彼方","境界の彼方","名瀨美月","なせ みつき","傲嬌","茅原實里","京都動畫","毒舌","京阿尼","黑長直","兄控"],"createdAt":1515334182847},{"companyId":"t68AQBkQKqEXycggX","name":"牧瀨紅莉栖","chairman":"HkP7d8Sx4ruCzo6rM","manager":"MTdhno2mSjtmhNbpn","grade":"A","capital":375977,"price":2586,"release":1738,"profit":462056.6,"vipBonusStocks":639.43,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":3,"nextSeasonEmployeesNumber":4,"tags":["克里斯蒂娜","助手","@Channeler","復甦者The Zombie","紳士少女Hentai","天才少女","まきせくりす","命運石之門","牧瀨紅莉棲","未來道具研究所研究員No.004","Steins;Gate","Makise Kurisu","今井麻美"],"createdAt":1515334182774},{"companyId":"7iWAiGgmNpoLwABzd","name":"御坂美琴","chairman":"Y8A2QtEevNHLxXhhN","manager":"b9hfWqHMdEnnZfnmh","grade":"B","capital":131484,"price":772,"release":1907,"profit":179279.49999999997,"vipBonusStocks":485.07,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":3,"nextSeasonEmployeesNumber":3,"tags":["御坂美琴","魔法禁書目錄","科學超電磁砲","砲姐","とある科学の超電磁砲","とある魔術の 禁書目録","電磁炮"],"createdAt":1515334182721},{"companyId":"5G5euTmXLmxkxpNiN","name":"蕾娜（レーナ）","chairman":"C47jDvR4fsWNuyJTG","manager":"9pw4w5zg9RNzrK2Ew","grade":"D","capital":18268,"price":130,"release":1075,"profit":9035.5,"vipBonusStocks":265.17999999999995,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["86－不存在的戰區－","86―エイティシックス―","弗拉迪蕾娜·米麗潔","ヴラディレーナ・ミリーゼ","86－Eighty Six－","蕾娜（レーナ）"],"createdAt":1515334182657},{"companyId":"ffCTnTtvNsG7kNA9o","name":"立華奏","chairman":"9Di3k7cX7Mj9uFzAH","manager":"wE4pkrrtdjXpSEQtr","grade":"A","capital":394406,"price":1401,"release":2120,"profit":761965,"vipBonusStocks":771.4599999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":7,"nextSeasonEmployeesNumber":6,"tags":["angel beats","立華奏","天使","長髮","白髮","貧乳","學生","制服","翅膀","エンジェルビーツ","かなで","たちばな","たちばなかなで","花澤香菜","はなざわ かな","Hanazawa Kana","kanade","tachibana"],"createdAt":1515334122792},{"companyId":"dTjGwupr2zE5LFmAJ","name":"結城明日奈(亞絲娜)","chairman":"9jxcnKnCTGw87jyTu","manager":"oLcFk4YYfsY7XoMm8","grade":"B","capital":101457,"price":550,"release":1578,"profit":53655,"vipBonusStocks":265.6,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["刀劍神域","亞絲娜","ソードアート・オンライン","ゆうきあすな","アスナ","结城明日奈"],"createdAt":1515334122702},{"companyId":"LnTdd9qkZzeQ9RPPF","name":"黑貓(五更琉璃)","chairman":"fufhWoPehboA46pEy","manager":"bh7yDRqxmkvxWPox2","grade":"B","capital":118448,"price":664,"release":1231,"profit":268966.2,"vipBonusStocks":527.8000000000001,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["五更琉璃","我的妹妹哪有這麼可愛！","俺の妹がこんなに可愛いわけがない","黑貓","黑猫","俺妹","ごこう るり","花澤香菜","Kuro Neko","貓耳","黑長直","黑髮","高坂琉璃","中二","神貓","白貓","闇貓","異色瞳"],"createdAt":1515334122648},{"companyId":"Nb6beeyHR5RfBTszk","name":"休比·多拉","chairman":"TCAS5pLc6zaeFLEfQ","manager":"nfGAoNfoHRFgkjL5w","grade":"A","capital":209714,"price":950,"release":1877,"profit":414440,"vipBonusStocks":727.0700000000002,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":4,"nextSeasonEmployeesNumber":5,"tags":["休比·多拉","シュヴィ・ドーラ","NO GAME NO LIFE遊戲人生","ノーゲーム・ノーライフ","休比","NO GAME NO LIFE"],"createdAt":1515334062653},{"companyId":"xs5577CwCwbKMxoAM","name":"遠坂凜","chairman":"bbRL7hdM7xxpdLYLB","manager":"ZiHbcgbz7KQn6zRTk","grade":"A","capital":387733,"price":2336,"release":1731,"profit":140005,"vipBonusStocks":323.3,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":5,"nextSeasonEmployeesNumber":4,"tags":["遠坂凛","凛","とおさか りん","Tōsaka Rin","Fate","Ubw"],"createdAt":1515334002655},{"companyId":"ZCgpqpEwm49LmsyPK","name":"長門有希","chairman":"392gz6xeecX2knSYh","manager":"YRh6w88YRhoDWsmdm","grade":"C","capital":34101,"price":747,"release":1940,"profit":22164,"vipBonusStocks":413.88,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["長門有希","SOS團","大明神","大萌神","涼宮春日系列","涼宮ハルヒシリーズ","眼鏡娘","三無","外星人"],"createdAt":1515333942652},{"companyId":"DdPShgdYTccwREZuf","name":"潮留美海","chairman":"EEeEgLC22gvK4ZybJ","manager":"uf2yJ4NhNr3ian9gX","grade":"C","capital":60303,"price":441,"release":1134,"profit":30700,"vipBonusStocks":143.85,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":1,"nextSeasonEmployeesNumber":0,"tags":["來自風平浪靜的明日","しおどめ みうな","潮留 美海","凪のあすから","凪の明日","小松未可子"],"createdAt":1515333882649},{"companyId":"Ep4zpyWqhRshtiXQk","name":"香風智乃","chairman":"kf7KJFkmwSy4ExBs4","manager":"kf7KJFkmwSy4ExBs4","grade":"A","capital":771278,"price":1430,"release":2383,"profit":557777.2,"vipBonusStocks":769.62,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":4,"nextSeasonEmployeesNumber":4,"tags":["請問您今天要來點兔子嗎?","香風智乃","かふうちの","チノ","ご注文はうさぎですか？","チマメ隊","點兔","水瀬いのり","芳文社"],"createdAt":1515333762742},{"companyId":"dLZHfCJfoaZHGPs35","name":"吉普莉爾","chairman":"qwGZxXxHQfa7hDSfH","manager":"gAZWNWcC5AkC3AcTA","grade":"A","capital":482710,"price":1100,"release":1261,"profit":109940,"vipBonusStocks":363.64,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":2,"nextSeasonEmployeesNumber":2,"tags":["遊戲人生","吉普莉爾","ノーゲーム・ノーライフ","NO GAME NO LIFE","ジブリール"],"createdAt":1515333762659},{"companyId":"mYxvyZvR8dSbRj8jd","name":"斑比","chairman":"64tTWZn54ARStPPTf","manager":"qsjrt2FJF6Y7ibyWe","grade":"B","capital":91193,"price":100,"release":2423,"profit":264860.9,"vipBonusStocks":1106.2600000000002,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":5,"nextSeasonEmployeesNumber":6,"tags":["斑比","吸血鬼","蘿莉","女王","歌德風","虎牙","精靈耳","金髮","蝙蝠","龍","四肢健全","Vampy","ヴァンピィ","ロリ","巴哈姆特之怒","碧藍幻想","闇影詩章","Cygames","Shadowverse","神撃のバハムート","グランブルーファンタジー","シャドウバース","SV","GBF","釘宮理惠"],"createdAt":1515333702721},{"companyId":"RZz6hMr3Kv7Frt4SC","name":"春日野穹","chairman":"pTaHfs87TyxjLXExC","manager":"ZsPYdduwsh75j3CFF","grade":"A","capital":846240,"price":1663,"release":1685,"profit":380159.8,"vipBonusStocks":695.3699999999999,"managerProfitPercent":0.05,"salary":2000,"nextSeasonSalary":2000,"bonus":5,"employeesNumber":9,"nextSeasonEmployeesNumber":8,"tags":["春日野穹/穹妹/かすがのそら/KasuganoSora","缘之空/縁の空/ヨスガノソラ/YosuganoSora","銀髮/银发","棕瞳","白波遙/白波遥","田口宏子","雙子/双子","實妹/实妹","兄控","呆毛","雙馬尾/双马尾","無口/无口","病弱","弱嬌/弱娇","家裡蹲/家里蹲","連衣裙/连衣裙","連褲襪/连裤袜","短襪/短袜","玩偶","自慰","醋缸","玄關/玄关","Sphere","妹控","成人","萌主","動畫/动画","遊戲/游戏","妹妹","哥德蘿莉裝/哥特萝莉装","轉學生/转学生","宅女","任性","髮帶/发带","貧乳/贫乳","悠之空/ハルカナソラ","feel.","奧木染町內會/奥木染町内会"],"createdAt":1515333702641},{"companyId":"DXAKcxbf7cjekHMAJ","name":"メイナ","chairman":"7h9NHTPHpDeNKu9gv","manager":"7h9NHTPHpDeNKu9gv","grade":"D","capital":111040,"price":64,"release":1735,"profit":0,"vipBonusStocks":0,"managerProfitPercent":0.05,"salary":1000,"nextSeasonSalary":1000,"bonus":5,"employeesNumber":0,"nextSeasonEmployeesNumber":0,"tags":["CxMxK note","看板娘","さり","貓耳髮圈","同人誌","本子","chiri","知里","メイナ","芽衣菜","芽衣奈","美娜","Meina","猫尾","R18"],"createdAt":1519481356742}]`;
