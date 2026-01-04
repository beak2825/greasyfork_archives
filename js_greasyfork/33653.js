// ==UserScript==
// @name         ACGN-stock收集資料腳本
// @namespace    http://tampermonkey.net/
// @version      2.107
// @description  try to take over the world!
// @author       SoftwareSing
// @match        https://acgn-stock.com/*
// @match        https://museum.acgn-stock.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33653/ACGN-stock%E6%94%B6%E9%9B%86%E8%B3%87%E6%96%99%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/33653/ACGN-stock%E6%94%B6%E9%9B%86%E8%B3%87%E6%96%99%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

//版本號為'主要版本號 + "." + 次要版本號 + 錯誤修正版本號(兩位)，ex 1.801
//修復導致功能失效的錯誤或更新重大功能提升主要或次要版本號
//優化UI，優化效能，優化小錯誤更新錯誤版本號
//兩個錯誤修正版本號防止迫不得已進位到次要版本號
//本腳本修改自 "ACGN股票系統每股營利外掛 2.200 by papago89"
const needAllData = true;
const historyData = 0;
//0是不輸出歷史資料 整個companyHistory欄不見，1是正常輸出歷史資料，2是保留companyHistory欄 但清空紀錄
//3是不輸出historyDividend
const memberData = 0;
//0是不輸出員工資料 整個memberList欄不見，1是正常輸出
const tagsData = 0;
//0是不輸出Tag，1是正常輸出
const timeWait = 3500;
/*************************************/
/*********ACGNListenerScript**********/

//本區監測事件搬運自"ACGN股票系統每股營利外掛 ver2.810"
//https://github.com/frozenmouse/acgn-stock-user-script/blob/master/acgn-stock.user.js


(function() {
    checkSeriousError();
    setTimeout(addNavItem, 1000);
    setTimeout(blockAD, 2000);
    setTimeout(blockAD, 5000);

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
    ];

    // 匹配當前頁面 url 的樣式並進行對應的回呼
    urlPatternCallbackTable.forEach(({ pattern, callback }) => {
        if (currentUrl.match(pattern)) {
        // loadingOverlay 消失後，需要給點時間讓頁面的載入全部跑完
        setTimeout(callback, 200);
        }
    });
}

// 當「股市總覽」頁面已載入時進行的回呼
function onStockSummaryPageLoaded() {
    setTimeout(stockSummaryEvent, 300);
}

// 當「公司資訊」頁面已載入時進行的回呼
function onCompanyDetailPageLoaded() {
    setTimeout(getAlldata, 500);
}

// 當「帳號資訊」頁面已載入時進行的回呼
function onAccountInfoPageLoaded() {
    setTimeout(checkUserInfo, 300);
    //checkUserInfo();
}

// 當「新創計劃」頁面已載入時進行的回呼
function onFoundationPlanPageLoaded() {

}


/*********ACGNListenerScript**********/
/*************************************/
/*
(function() {
    checkSeriousError();
    setTimeout(addNavItem, 1000);
    setTimeout(blockAD, 2000);
    setTimeout(blockAD, 5000);
})();*/

function addNavItem(){
	// 關於插件按鈕
    $('<li class="nav-item"><a class="nav-link" href="" id="aboutmebtn">' + Dict[lan].aboutScript + '</a></li>').insertAfter($('.note')[$('.note').length - 1]);
    $('#aboutmebtn')[0].addEventListener("click", GotoAboutMe);
}

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


// 取得 Template 的 helpers
Template.prototype.getHelper = function(name) {
  return this.__helpers[` ${name}`];
};

// 包裝 Template 的 onRendered，加入自訂動作
Template.prototype.oldOnRendered = Template.prototype.onRendered;
Template.prototype.onRendered = function(callback) {
  // 在添加 onRendered callback 時一併記錄起來
  this.customOnRenderedCallbacks = this.customOnRenderedCallbacks || [];
  this.customOnRenderedCallbacks.push(callback);

  // 在真正執行到 callback 之後記錄起來
  this.oldOnRendered(() => {
    const instance = Template.instance();
    callback();
    instance.customOnRenderedCalled = true;
  });
};










function checkSeriousError()
{
    //這個function將會清空所有由本插件控制的localStorage
    //用於如果上一版發生嚴重錯誤導致localStorage錯亂，以致插件無法正常啟動時
    //或是用於當插件更新時，需要重設localStorage


    var seriousErrorVersion = 2.106;
    //seriousErrorVersion會輸入有問題的版本號，當發生問題時我會增加本數字，或是於更新需要時亦會增加
    //使用者本地的數字紀錄如果小於這個數字將會清空所有localStorage

    var lastErrorVersion_collectData = 0 !== window.localStorage.getItem ("lastErrorVersion_collectData") ? Number(JSON.parse(window.localStorage.getItem ("lastErrorVersion_collectData"))) : 0;
    //lastErrorVersion_collectData = 0;  //你如果覺得現在就有問題 可以把這行的註解取消掉來清空localStorage
    console.log(Number.isInteger(lastErrorVersion_collectData));
    console.log(lastErrorVersion_collectData);
    if (Number.isNaN(lastErrorVersion_collectData))
    {
        lastErrorVersion_collectData = 0;
        console.log("reset lastErrorVersion_collectData as 0");
    }
    else
    {
        console.log("localStorage of lastErrorVersion_collectData is work");
    }

    if (lastErrorVersion_collectData < seriousErrorVersion)
    {
        console.log("last version has serious error, start remove all localStorage");
        window.localStorage.removeItem ("collectData");
        window.localStorage.removeItem ("LinkCount");
        window.localStorage.removeItem ("LinkCount_count");
        window.localStorage.removeItem ("LinkCount_max");
        window.localStorage.removeItem ("lastErrorVersion_collectData");
        lastErrorVersion_collectData = seriousErrorVersion;
        window.localStorage.setItem ("lastErrorVersion_collectData", JSON.stringify(lastErrorVersion_collectData));
    }
}





function get_PAPAGO89_JsonObj(){
    var request = new XMLHttpRequest();
    request.open("GET", "https://jsonbin.org/papago89/ACGNStock", false); // 同步連線 POST到該連線位址
    request.send();
    jsonObj = JSON.parse(request.responseText);
}

function get_abcd1357_JsonObj()
{
    var request = new XMLHttpRequest();
    request.open("GET", "https://jsonbin.org/abcd1357/ACGNstock-company", false); // 同步連線 POST到該連線位址
    request.send();
    abcd1357_jsonObj = JSON.parse(request.responseText);
}

function blockAD() {
    if ($('.fixed-bottom').length === 1) {
        // 自動對所有廣告點擊關閉
        var i;
        for(i = $('.media.bg-info.text.px-2.py-1.my-2.rounded .d-flex a').length - 1; i >= 0; --i)
            $('.media.bg-info.text.px-2.py-1.my-2.rounded .d-flex a')[i].click();
        // 隱藏顯示
        // $('.fixed-bottom').css("height", "0px");
        console.log("Triggered BlockAD");
    }
    else {
        setTimeout(blockAD, 500);
    }
}


/************stockSummary*************/
var getdatabtn;
var alreadyOpen = 0;
/*Template.companyList.onRendered(() => {
    //setTimeout(AddCompanyBtn,1000);
    stockSummaryEvent();
});*/

function stockSummaryEvent() {

    if (alreadyOpen === 0)
    {
        console.log("Open");
        //Open Event
        setTimeout(AddCompanyBtn,1000);
        alreadyOpen = 1;
    }

}

function AddCompanyBtn(){
    getdatabtn = $('<button class="btn btn-primary btn-sm" type="button" id="GetData">蒐集公司資料</button>');
    getdatabtn.insertAfter($('.card-title.mb-1'));
    $('#GetData')[0].addEventListener("click", InitTask);
}



function ComputeEvt() {
    //setTimeout(addStockSummaryListener, 2000);
    console.log("nothing");
}


var lastpagestr, NextPageBtn, continueGetprofile, profileptr, pagebtn, profilelinksptr, profilelinks, profileNames, profilePrices, profileTags, tags, jsonObj;
function InitTask(){

	var date = new Date();
    console.log("InitTask");
    getdatabtn.remove();
    lastpagestr = $('.page-link:last').attr('href').match(/[0-9]+/);
    NextPageBtn = $('.page-link').slice(-2)[0];
    profileptr = 0;
    profilelinksptr = 0;
    pagebtn = 0;
    profilelinks = null !== window.sessionStorage.getItem ("profilelinks") ? JSON.parse(window.sessionStorage.getItem ("profilelinks")) : [];
	profileNames = null !== window.sessionStorage.getItem ("profileNames") ? JSON.parse(window.sessionStorage.getItem ("profileNames")) : [];
	profilePrices = [];
	profileTags = [];
	/*if(oldJson.length !== 0)
		jsonObj = oldJson;
	else{
		jsonObj = {};
		jsonObj.companys = [];
	}*/
	//jsonObj.publishTime = date.toString();
    //console.log(JSON.stringify(jsonObj));
    console.log(profilelinks);
    console.log(profilelinks.length === 0);
    if (profilelinks.length === 0)
    {
        $('.page-link')[0].click();
    }
    else
    {
        pagebtn = Number(window.location.href.match(/\/company\/([^]+)/)[1]);
    }
    setTimeout(StartTask,timeWait);

}
function StartTask(){
    console.log("StartTask");
    setTimeout(GetProfileLink,timeWait);
}

function GetProfileLink(){
    if(pagebtn != lastpagestr){
        console.log("GetProfileLink");
        if($(".col-12.col-md-6.col-lg-4.col-xl-3").length > 0)
        {

            /*var companyList = $('.company-card'), index;
            for(profileptr = 0; profileptr < companyList.length; profileptr++)
            {
                pushLink(profileptr);
            }*/

            var collectData = null !== window.localStorage.getItem ("collectData") ? JSON.parse(window.localStorage.getItem ("collectData")) : [];
            var companiesDatas = Meteor.connection._mongo_livedata_collections.companies.find().fetch();
            var revenue, totalStock, earnPerShare, ID, stockPrice, name, Link, chairman, manager;
            var tags=[];
            var salary = 0, nextSeasonSalary = 0, seasonalBonusPercent = 0;
            var employees = [], nextSeasonEmployees = [];

            for (var company_i = 0 ; company_i < companiesDatas.length ; company_i++)
            {
                pushCheck[company_i] = 0;

                revenue = Number(companiesDatas[company_i].profit);
                totalStock = Number(companiesDatas[company_i].totalRelease);
                earnPerShare = 0.8075 * revenue / totalStock;
                ID = String(companiesDatas[company_i]._id);
                stockPrice = Number(companiesDatas[company_i].listPrice);
                name = String(companiesDatas[company_i].companyName);
                chairman = String(companiesDatas[company_i].chairman);
                manager = String(companiesDatas[company_i].manager);
                Link = String("/company/detail/" + ID);

                console.log(name + "---companyID---" + ID);
                console.log(name + "---earnPerShare---" + earnPerShare);
                console.log(name + "---stockPrice---" + stockPrice);
                console.log(name + "---totalStock---" + totalStock);

                var index = collectData.findIndex(x => x.companyID == ID);
                if (index != -1)
                {
                    tags = collectData[index].companyTags;
                    salary = collectData[index].companySalary;
                    nextSeasonSalary = collectData[index].companyNextSeasonSalary;
                    seasonalBonusPercent = collectData[index].companyBonus;
                    employees = collectData[index].companyEmployees;
                    nextSeasonEmployees = collectData[index].companyNextSeasonEmployees;
                    if ((collectData[index].companyName == name) &&
                        (collectData[index].companyDividend == earnPerShare) &&
                        (collectData[index].companyPrice == stockPrice) &&
                        (collectData[index].companyStock == totalStock) &&
                        (collectData[index].companyManager == manager) &&
                        (collectData[index].companyChairman == chairman))
                    {
                        console.log("dont need update cookie");
                        CheckCheck = 1;
                    }
                    else
                    {
                        collectData.splice(index, 1);
                        console.log("AddcollectDataCookie---splice");
                        //collectData格式:
                        //{"companyName": String, "companyID": String, "companyLink": String,
                        // "companyDividend": Number, "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
                        // "companyManager": String, "companyChairman": String,
                        // "companyEmployees": [], "companyNextSeasonEmployees": [],
                        // "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
                        // "companyTags": []}
                        collectData.push({"companyName": name, "companyID": ID, "companyLink": String("/company/detail/" + ID),
                         "companyDividend": earnPerShare, "companyPrice": stockPrice, "companyStock": totalStock, "companyProfit": revenue,
                         "companyManager": manager, "companyChairman": chairman,
                         "companyEmployees": employees, "companyNextSeasonEmployees": nextSeasonEmployees,
                         "companySalary": salary, "companyNextSeasonSalary": nextSeasonSalary, "companyBonus": seasonalBonusPercent,
                         "companyTags": tags});
                        //window.localStorage.setItem ("collectData", JSON.stringify(collectData));

                        console.log("Add collectData Cookie!!");
                        CheckCheck = 1;
                    }
                }
                else
                {
                    collectData.push({"companyName": name, "companyID": ID, "companyLink": String("/company/detail/" + ID),
                     "companyDividend": earnPerShare, "companyPrice": stockPrice, "companyStock": totalStock, "companyProfit": revenue,
                     "companyManager": manager, "companyChairman": chairman,
                     "companyEmployees": employees, "companyNextSeasonEmployees": nextSeasonEmployees,
                     "companySalary": salary, "companyNextSeasonSalary": nextSeasonSalary, "companyBonus": seasonalBonusPercent,
                     "companyTags": tags});
                    //window.localStorage.setItem ("collectData", JSON.stringify(collectData));

                    console.log("AddcollectDataCookie!!");
                    CheckCheck = 1;
                }


                profilelinks.push(Link);
                profileNames.push(name);

                pushCheck[company_i] = 1;
            }

            window.localStorage.setItem ("collectData", JSON.stringify(collectData));
            nextStep();
        }
        else
        {
            setTimeout(GetProfileLink,timeWait);
        }
    }
    else{
        console.log(profilelinks);
        /*$('.card-block').append($('<a href="' + profilelinks[profilelinksptr] + '"id="nxtprofilelink">btn</a>'));
        $('#nxtprofilelink')[0].click();*/
        setTimeout(startGetData,timeWait);
    }
}
var pushCheck = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function nextStep()
{
    var NScheck = 1;
    for (var NS in pushCheck)
    {
        if (pushCheck[NS] != 1)
        {
            NScheck = 0;
        }
    }

    if (NScheck == 1)
    {
        window.sessionStorage.setItem("profilelinks", JSON.stringify(profilelinks));
        window.sessionStorage.setItem("profileNames", JSON.stringify(profileNames));
        pagebtn++;
        NextPageBtn.click();
        setTimeout(GetProfileLink,timeWait);
    }
    else
    {
        setTimeout(nextStep, timeWait);
    }
}



function pushLink(shit)
{
    pushCheck[shit] = 0;
    if ($('.title a')[shit] == null)
    {
        pushCheck[shit] = 0;
        console.log("repush one time");
        setTimeout(pushLink, 1000, shit);
    }
    else
    {
        if (String($('.title a')[shit]) == "")
        {
            pushCheck[shit] = 0;
            console.log("bang!!!");
            setTimeout(pushLink, 1000, shit);
        }
        else
        {
            profilelinks.push($('.title a')[shit].href.match(/\/company.+/)[0]);
            profileNames.push($('.title')[shit].innerText.slice(0,-1)); // 去掉公司名稱結尾的換行
            pushCheck[shit] = 1;
        }
    }
}


function startGetData()
{
    window.localStorage.removeItem ("LinkCount");
    window.localStorage.removeItem ("LinkCount_count");
    window.localStorage.removeItem ("LinkCount_max");
    if (needAllData)
        setTimeout(gotoOtherCompany, 2500);

}


var autoClickAllow = 0;
function clickStartBth()
{
    //autoClickAllow = 1;
    $('#NumberZero')[0].click();
}

/************stockSummary*************/
/*************************************/
/**************company****************/


var checkButton = 0;
var Reload_time =0;
checkDataReady = 0;
//---------------按鍵區---------------//

/*Template.companyDetailTable.onRendered(() => {
    getAlldata();
});*/

function getAlldata()
{
    const companiesDatas = Meteor.connection._mongo_livedata_collections.companies.find().fetch();
    const employeesDatas = Meteor.connection._mongo_livedata_collections.employees.find().fetch();
    if (companiesDatas.length > 0)
    {
        if (Number(companiesDatas[0].salary) > 0)
        {
            let thisCompany = companiesDatas[0];
            var profit, price, ID, release, earnPerShare, manager, hold, name, chairman;
            var tags, salary, nextSeasonSalary, seasonalBonusPercent;
            var employees = [], nextSeasonEmployees = [];

            profit = Number(thisCompany.profit);
            price = Number(thisCompany.listPrice);
            ID = String(thisCompany._id);
            release = Number(thisCompany.totalRelease);
            earnPerShare = (Number(thisCompany.profit) * 0.8075 / Number(thisCompany.totalRelease));
            manager = String(thisCompany.manager);
            name = String(thisCompany.companyName);
            chairman = String(thisCompany.chairman);
            tags = thisCompany.tags;
            salary = Number(thisCompany.salary);
            nextSeasonSalary = Number(thisCompany.nextSeasonSalary);
            seasonalBonusPercent = Number(thisCompany.seasonalBonusPercent);
            for (let empData of employeesDatas)
            {
                if ((empData.employed) && (empData.companyId === ID))
                    employees.push(empData.userId);
                else if ((empData.employed === false) && (empData.companyId === ID) && (empData.resigned === false))
                    nextSeasonEmployees.push(empData.userId);
            }
            console.log(String(ID + "---" + name + "---" + price + "---" + release + "---" +
                profit + "---" + earnPerShare + "---" + manager + "---" + tags.length + "---" +
                salary + "---" + nextSeasonSalary + "---" + seasonalBonusPercent + "---" +
                employees.length + "---" + nextSeasonEmployees.length));

            var collectData = null !== window.localStorage.getItem ("collectData") ? JSON.parse(window.localStorage.getItem ("collectData")) : [];
            //collectData格式:
            //{"companyName": String, "companyID": String, "companyLink": String,
            // "companyDividend": Number, "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
            // "companyManager": String, "companyChairman": String,
            // "companyEmployees": [], "companyNextSeasonEmployees": [],
            // "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
            // "companyTags": []}
            const inputJson =
                {"companyName": name, "companyID": ID, "companyLink": String("/company/detail/" + ID),
                 "companyDividend": earnPerShare, "companyPrice": price, "companyStock": release, "companyProfit": profit,
                 "companyManager": manager, "companyChairman": chairman,
                 "companyEmployees": employees, "companyNextSeasonEmployees": nextSeasonEmployees,
                 "companySalary": salary, "companyNextSeasonSalary": nextSeasonSalary, "companyBonus": seasonalBonusPercent,
                 "companyTags": tags};
            const index = collectData.findIndex(x => x.companyID == ID);
            if (index !== -1)
            {
                if (collectData[index] === inputJson)
                {
                    console.log("dont need update cookie");
                }
                else
                {
                    collectData.splice(index, 1);
                    console.log("AddcollectDataCookie---splice");
                    collectData.push(inputJson);
                    window.localStorage.setItem ("collectData", JSON.stringify(collectData));

                    console.log("Add collectData Cookie!!");
                }
            }
            else
            {
                collectData.push(inputJson);
                window.localStorage.setItem ("collectData", JSON.stringify(collectData));

                console.log("AddcollectDataCookie!!");
            }

            setTimeout(gotoOtherCompany, 2500);
        }
        else
        {
            console.log("error: salary == 0");
            setTimeout(getAlldata, 1500);
        }
    }
    else
    {
        setTimeout(getAlldata, 1500);
    }
}


function gotoOtherCompany()
{
    $('.navbar-toggler')[0].click();
    $('.navbar-toggler')[0].click();
    var LinkCount = null !== window.localStorage.getItem ("LinkCount") ? JSON.parse(window.localStorage.getItem ("LinkCount")) : null;
    var LinkCount_max = parseInt(window.localStorage.getItem ("LinkCount_max"));
    var LinkCount_count = parseInt(window.localStorage.getItem ("LinkCount_count"));

    //LinkCount_count = 0; //計數器歸零

    if (LinkCount === null)
    {
        console.log("LinkCount === null");
        //get_PAPAGO89_JsonObj();
        //LinkCount = jsonObj.companys;
        LinkCount = [];
        for (var N in profilelinks)
        {
            LinkCount.push({"companyName": profileNames[N], "companyLink": profilelinks[N]});
            console.log("companyName: " + profileNames[N]);
        }
        console.log("complete push data to LinkCount");
        console.log("next company:  " + LinkCount[0].companyName);
        LinkCount_max = LinkCount.length;

        LinkCount_count = 0;
        console.log("get new list length:  " + LinkCount_max);
        window.localStorage.setItem ("LinkCount_max", LinkCount_max);
    }
    else
    {
        LinkCount_count += 1;
    }
    console.log(String(LinkCount_count));
    console.log("list length:  " + LinkCount_max);



    if (LinkCount_max > LinkCount_count)
    {
        console.log("--------------------------");
        window.localStorage.setItem ("LinkCount", JSON.stringify(LinkCount));
        window.localStorage.setItem ("LinkCount_count", LinkCount_count);
        window.localStorage.setItem ("LinkCount_max", LinkCount_max);
        console.log("next company:  " + LinkCount[LinkCount_count].companyName);
        setTimeout(console.log, 550, "GO");
        /*if ((LinkCount_count - 1) === 0)
        {
            console.log("Amendment:: next company:  " + LinkCount[0].companyName);
            console.log("GO");
            //window.location = LinkCount[0].companyLink;
            $('.card-block').append($('<a href="' + LinkCount[0].companyLink + '"id=' + String(0) + '>btn</a>'));
            setTimeout(clickFunction, 500);
        }
        else
        {*/
            //window.location = LinkCount[LinkCount_count].companyLink;
        setTimeout(gogo, 600, String(LinkCount[LinkCount_count].companyLink));
            //setTimeout(getAlldata, 3000);
        //}
        //setTimeout(gotoNext(LinkCount, LinkCount_count), 100000);
    }
    else
    {
        window.localStorage.removeItem ("LinkCount");
        window.localStorage.removeItem ("LinkCount_count");
        window.localStorage.removeItem ("LinkCount_max");
        console.log("complete get all company data");
        console.log("");
    }
}

function gogo(link)
{
    FlowRouter.go(link);
}


/**************company****************/
/*************************************/
/************accountInfo**************/
// -----已刪除
/************accountInfo**************/

/*************************************/

/************foundationPlan***********/
//-----已刪除
/************foundationPlan***********/
/**************aboutMe****************/
function GotoAboutMe(){
    $('.card-block').remove();
    var collectData = null !== window.localStorage.getItem ("collectData") ? JSON.parse(window.localStorage.getItem ("collectData")) : [];
    console.log(collectData);
    SetAboutMeString();
    console.log("Triggered AboutMe");
    setTimeout(blockAD,500);

}


function get_abcd1357_JsonObj()
{
    var request = new XMLHttpRequest();
    //request.open("GET", "https://acgnstock-data.firebaseio.com/ACGNstock-company.json?print=pretty", false); // 連線 POST到該連線位址
    request.open("GET", "https://jsonbin.org/abcd1357/ACGNstock-company", false); // 連線 POST到該連線位址
    request.send();
    abcd1357_jsonObj = JSON.parse(request.responseText);
    //var abcd1357_test_jsonObj = JSON.parse(request.responseText);
    //var abcd1357_test_jsonObj = JSON.stringify(JSON.parse(request.responseText));
    //return abcd1357_test_jsonObj;
}


var aboutmestr;
function SetAboutMeString(){
    aboutmestr = '<div class="card-block"><div class="col-5"><h1 class="card-title mb-1">關於插件</h1></div><div class="col-5">by papago89 and Ming</div><hr>';

    //var historyData = 2;
    //0是不輸出歷史資料 整個companyHistory欄不見，1是正常輸出歷史資料，2是保留companyHistory欄 但清空紀錄
    //3是不輸出historyDividend


    //get_PAPAGO89_JsonObj();
    //var LinkCount = jsonObj.companys;
    var jsonData;
    if (historyData === 1 || historyData ===3)
    {
        jsonData = get_abcd1357_JsonObj();
        //console.log(jsonData);
        //jsonData = JSON.parse(jsonData);
        jsonData = abcd1357_jsonObj;
    }
    //get_abcd1357_test_JsonObj();
    //jsonData = abcd1357_test_jsonObj;

    var today = new Date();
    var collectData = null !== window.localStorage.getItem ("collectData") ? JSON.parse(window.localStorage.getItem ("collectData")) : [];
    //collectData格式:
    //{"companyName": String, "companyID": String, "companyLink": String,
    // "companyDividend": Number, "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
    // "companyManager": String, "companyChairman": String,
    // "companyEmployees": [], "companyNextSeasonEmployees": [],
    // "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
    // "companyTags": []}
    var index_C;
    var super_test = "super test";


    aboutmestr += div('{');
    //aboutmestr += div('  "updateTime": "' + (today.getMonth()+1) + today.getDate() + '_' + today.getHours() + today.getMinutes() + today.getSeconds() + '",');
    aboutmestr += div('  "updateTime": "' + today.toString() + '",');
    //aboutmestr += div('  "updateTime": "' + today.toLocaleString());
    if (historyData == 1 || historyData == 3)
    {
        aboutmestr += div('  "historyUpdate": ["' + today.toString() + '",');
        for (var u in jsonData.historyUpdate) //need change to "Update"
        {
            aboutmestr += div('"' + jsonData.historyUpdate[u] + '", '); //need change to "Update"
        }
        aboutmestr += div('        ], ');
    }
    else if (historyData == 2)
    {
        aboutmestr += div('  "historyUpdate": ["' + today.toString() + '"], ');
    }


    aboutmestr += div('  "companys": [');
    for (let i in collectData)
    {
        //collectData格式:
        //{"companyName": String, "companyID": String, "companyLink": String,
        // "companyDividend": Number, "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
        // "companyManager": String, "companyChairman": String,
        // "companyEmployees": [], "companyNextSeasonEmployees": [],
        // "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
        // "companyTags": []}
        aboutmestr += div('    {');
        aboutmestr += div('      "companyName": ' + JSON.stringify(collectData[i].companyName) + ',');
        aboutmestr += div('      "companyID": "' + collectData[i].companyID + '",');
        //aboutmestr += div('      "companyLink": "' + collectData[i].companyLink + '",');
        //aboutmestr += div('      "companyDividend": "' + collectData[i].companyDividend + '",');
        aboutmestr += div('      "companyPrice": "' + collectData[i].companyPrice + '",');
        aboutmestr += div('      "companyStock": "' + collectData[i].companyStock + '",');
        aboutmestr += div('      "companyProfit": "' + collectData[i].companyProfit + '",');
        aboutmestr += div('      "companySalary": "' + collectData[i].companySalary + '",');
        aboutmestr += div('      "companyNextSeasonSalary": "' + collectData[i].companyNextSeasonSalary + '",');
        aboutmestr += div('      "companyBonus": "' + collectData[i].companyBonus + '",');
        aboutmestr += div('      "companyEmployeesNumber": "' + collectData[i].companyEmployees.length + '",');
        aboutmestr += div('      "companyNextSeasonEmployeesNumber": "' + collectData[i].companyNextSeasonEmployees.length + '"');
        if (tagsData == 1)
        {
            aboutmestr += div('      , "companyTags": [');
            for (var T = 0 ; T < collectData[i].companyTags.length ; T++)
            {
                if (T+1 < collectData[i].companyTags.length)
                    aboutmestr += div('         ' + JSON.stringify(collectData[i].companyTags[T]) + ', ');
                else
                    aboutmestr += div('         ' + JSON.stringify(collectData[i].companyTags[T]));
            }
            aboutmestr += div('      ] ');
        }

        //aboutmestr += div('      "companyDividend": "' + 0 + '"');
        aboutmestr += div('    },');
    }
    aboutmestr += div('  ], ');




    if (memberData == 1)
    {
        aboutmestr += div('  "memberList": [');
        for (let i in collectData)
        {
            //collectData格式:
            //{"companyName": String, "companyID": String, "companyLink": String,
            // "companyDividend": Number, "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
            // "companyManager": String, "companyChairman": String,
            // "companyEmployees": [], "companyNextSeasonEmployees": [],
            // "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
            // "companyTags": []}
            aboutmestr += div('    {');
            aboutmestr += div('      "companyName": ' + JSON.stringify(collectData[i].companyName) + ',');
            aboutmestr += div('      "companyID": "' + collectData[i].companyID + '",');
            aboutmestr += div('      "companyManager": "' + collectData[i].companyManager + '",');
            aboutmestr += div('      "companyChairman": "' + collectData[i].companyChairman + '",');

            aboutmestr += div('      "companyEmployees": [');
            for (let e = 0 ; e < collectData[i].companyEmployees.length ; e++)
            {
                if (e+1 < collectData[i].companyEmployees.length)
                    aboutmestr += div('         "' + collectData[i].companyEmployees[e] + '", ');
                else
                    aboutmestr += div('         "' + collectData[i].companyEmployees[e] + '"');
            }
            aboutmestr += div('      ], ');

            aboutmestr += div('      "companyNextSeasonEmployees": [');
            for (let e = 0 ; e < collectData[i].companyNextSeasonEmployees.length ; e++)
            {
                if (e+1 < collectData[i].companyNextSeasonEmployees.length)
                    aboutmestr += div('         "' + collectData[i].companyNextSeasonEmployees[e] + '", ');
                else
                    aboutmestr += div('         "' + collectData[i].companyNextSeasonEmployees[e] + '"');
            }
            aboutmestr += div('      ] ');

            aboutmestr += div('    },');
        }
        aboutmestr += div('  ], ');
    }




    if (historyData !== 0)
    {
        aboutmestr += div('  "historyData": [');
        for (let i in collectData)
        {
            aboutmestr += div('    {');
            aboutmestr += div('      "companyName": ' + JSON.stringify(collectData[i].companyName) + ',');
            aboutmestr += div('      "companyID": "' + collectData[i].companyID + '",');
            if (historyData == 1)
            {
                const historyJson = jsonData.historyData;

                aboutmestr += div('      "companyHistory": {');
                index_C = historyJson.findIndex(z => z.companyID == collectData[i].companyID);

                if (index_C != -1)
                {
                    const thisHistory = historyJson[index_C].companyHistory;

                    aboutmestr += div('      "historyProfit": [ "' + collectData[i].companyProfit + '", ');
                    for (let j in thisHistory.historyProfit)
                    {
                        aboutmestr += div('"' + thisHistory.historyProfit[j] + '", ');
                    }
                    aboutmestr += div('        ], ');

                    aboutmestr += div('      "historyPrice": [ "' + collectData[i].companyPrice + '", ');
                    for (let k in thisHistory.historyPrice)
                    {
                        aboutmestr += div('"' + thisHistory.historyPrice[k] + '", ');
                    }
                    aboutmestr += div('        ],');

                    aboutmestr += div('      "historyStock": [ "' + collectData[i].companyStock + '", ');
                    for (let s in thisHistory.historyStock)
                    {
                        aboutmestr += div('"' + thisHistory.historyStock[s] + '", ');
                    }
                    aboutmestr += div('        ]');
                }
                else
                {
                    aboutmestr += div('      "historyProfit": [ "' + collectData[i].companyProfit + '"], ');
                    aboutmestr += div('      "historyPrice": [ "' + collectData[i].companyPrice + '"], ');
                    aboutmestr += div('      "historyStock": [ "' + collectData[i].companyStock + '"] ');
                }
                aboutmestr += div('      }');
            }
            else if (historyData == 2)
            {
                aboutmestr += div('      "companyHistory": {');
                aboutmestr += div('      "historyProfit": [ "' + collectData[i].companyProfit + '"], ');
                aboutmestr += div('      "historyPrice": [ "' + collectData[i].companyPrice + '"], ');
                aboutmestr += div('      "historyStock": [ "' + collectData[i].companyStock + '"] ');
                aboutmestr += div('      }');
            }
            else if (historyData == 3)
            {
                aboutmestr += div('      "companyHistory": {');
                index_C = jsonData.companys.findIndex(z => z.companyID == collectData[i].companyID);

                if (index_C != -1)
                {
                    const thisHistory = historyJson[index_C].companyHistory;
                    /*aboutmestr += div('      "historyDividend": [ "' + collectData[i].companyDividend + '", ');
                for (var j in thisHistory.historyDividend)
                {
                    aboutmestr += div('"' + thisHistory.historyDividend[j] + '", ');
                }
                aboutmestr += div('        ], ');*/

                    aboutmestr += div('      "historyPrice": [ "' + collectData[i].companyPrice + '", ');
                    for (let k in thisHistory.historyPrice)
                    {
                        aboutmestr += div('"' + thisHistory.historyPrice[k] + '", ');
                    }
                    aboutmestr += div('        ]');
                }
                else
                {
                    /*aboutmestr += div('      "historyDividend": [ "' + collectData[i].companyDividend + '"], ');*/
                    aboutmestr += div('      "historyPrice": [ "' + collectData[i].companyPrice + '"] ');
                }
                aboutmestr += div('      }');
            }
            aboutmestr += div('    },');
        }
        aboutmestr += div('  ] ');
    }


    aboutmestr += div('}');
    //aboutmestr += div('test');
    //aboutmestr += div(LinkCount[953].companyLink);
    //aboutmestr += div(LinkCount[954].companyLink);
    //aboutmestr += div(LinkCount[955].companyLink);
    //aboutmestr += div('test');

    aboutmestr += div('<hr>');
    aboutmestr += div('有任何問題或建議請到Discord:ACGN Stock留言');
    aboutmestr += div('<a href="https://greasyfork.org/zh-TW/scripts/33359-acgn%E8%82%A1%E7%A5%A8%E7%B3%BB%E7%B5%B1%E6%AF%8F%E8%82%A1%E7%87%9F%E5%88%A9%E5%A4%96%E6%8E%9B" target="_blank">更新插件</a>');



    aboutmestr += '</div>';
    aboutmestr +='<div class="card-block"><div class="row border-grid-body" style="margin-top: 15px;"><div class="col-12 border-grid" id="customupdate"><a class="d-block h4" href="" data-toggle-panel="update">更新紀錄<i class="fa fa-folder" aria-hidden="true"></i></a></div></div></div>';
    $('.card').append($(aboutmestr));
    $('#customupdate')[0].addEventListener("click", UpdateEvent);
    updatefoldericon = $("#customupdate .fa")[0];
}
var totaldivcount = 0;
function div(str){
    return '<div id="customdiv' + totaldivcount + '">' + str + '</div>';
}


var updatefoldericon;
function UpdateEvent(){

    if(updatefoldericon.classList[1] === "fa-folder"){
        updatefoldericon.classList.remove("fa-folder");
        updatefoldericon.classList.add("fa-folder-open");
        V_2_200();
        V_2_000();
        V_1_900();
        V_1_900();
        V_1_800();
        V_1_73();
        V_1_72();
        V_1_70();
        V_1_63();
        V_1_62();
        V_1_61before();
    }
    else
    {
        updatefoldericon.classList.add("fa-folder");
        updatefoldericon.classList.remove("fa-folder-open");
        $('.col-12.border-grid:gt(0)').remove();
    }
    console.log("Triggered UpdateInfo");

}
function V_2_200(){
    var vid = addversion(2, 200);
    var vtext = div('新增<span class="text-info">新創搜尋提示</span>功能');
    vtext += div('新增<span class="text-info">帳號頁面持股換算資產</span>功能');


    $('#' + vid).append($(vtext));
}
function V_2_000(){
    var vid = addversion(2, 000);
    var vtext = div('新增<span class="text-info">訂閱</span>功能');


    $('#' + vid).append($(vtext));
}
function V_1_900(){
    var vid = addversion(1, 900);
    var vtext = div('新增<span class="text-info">選擇語言</span>');


    $('#' + vid).append($(vtext));
}
function V_1_800(){
    var vid = addversion(1, 800);
    var vtext = div('新增<span class="text-info">點我更新插件</span>按鈕');


    $('#' + vid).append($(vtext));
}

function V_1_73(){
    var vid = addversion(1, 73);
    var vtext = div('<span class="text-info">更新插件</span>連結現在會在新分頁開啟連結，讓原本的頁面可以繼續看股票。');
    vtext += div('修正<span class="text-info">關於插件</span>中，更新紀錄排序錯亂的問題。');
    vtext += div('新增<span class="text-info">新創計畫</span>下，列表模式的推測股價、推測股權、推測應得股數。');
    vtext += div('優化一些日誌顯示，讓開發人員在除錯更方便一些。');


    $('#' + vid).append($(vtext));
}
function V_1_72(){
    var vid = addversion(1, 72);
    var vtext = div('優化<span class="text-info">廣告關閉</span>功能。');
    vtext += div('好像還有新增一些功能什麼的。');
    $('#' + vid).append($(vtext));
}
function V_1_70(){
    var vid = addversion(1, 70);
    var vtext = div('新增功能<span class="text-info">廣告關閉</span>將會隱藏所有廣告，按過後只要不關閉頁面你就再也看不到任何廣告了，包含公告以及新發布的廣告。');
    $('#' + vid).append($(vtext));

}

function V_1_63(){
    var vid = addversion(1, 63);
    var vtext = div('修正<span class="text-info">股市總覽</span>中列表模式如果出現有交易尚未完成會造成計算錯誤');
    $('#' + vid).append($(vtext));

}

function V_1_62(){
    var vid = addversion(1, 62);
    var vtext = div('新增頁面<span class="text-info">關於插件</span>');
    //vtext += div('隨便一些字');
    $('#' + vid).append($(vtext));

}
function V_1_61before(){
    $('<div class="col-12 border-grid" id="V1_61before"><h4>版本1.61以前：</h4><div id="customdiv0">新增了一些功能，不過不是很重要</div></div>').insertAfter($('.col-12.border-grid')[$('.col-12.border-grid').length - 1]);
}
function addversion(majorV,minorV){
    var vtext = '<div class="col-12 border-grid" id = "V' + majorV + '_' + minorV + '"><h4>版本' + majorV + '.' + minorV + '：</h4></div>';
    if($('.col-12.border-grid').length > 0) {
        $(vtext).insertAfter($('.col-12.border-grid')[$('.col-12.border-grid').length - 1]);
    }
    else{
        $(vtext).insertAfter($('#customupdate')[0]);
    }
    return "V" + majorV + "_" + minorV;
}

var totaldivcount = 0;
function adddiv(str){
    aboutmestr += '<div class="row mb-1" id="customdiv' + totaldivcount + '">' + str + '</div>';
}
/**************aboutMe****************/
/*************Language***************/

var lan =  "";
lan = null !== window.localStorage.getItem ("PM_language") ? window.localStorage.getItem ("PM_language") : "tw";
function ChangeLanguage(l){
    if(lan === l)return;
    lan = l;
    window.localStorage.setItem ("PM_language",l);
    window.location.reload();
}
var Dict = {
    tw:
    {
        totalProfitInThisPage: "本頁預計分紅：",
        aboutScript: "關於插件",
    },
    en:
    {
        totalProfitInThisPage: "Total profit in this page :",
    },
    jp:
    {
        totalProfitInThisPage: "本頁預計分紅：",
    },
    marstw:
    {
        totalProfitInThisPage: "這ㄘ可yee拿ㄉ$$：",
    }
};
/*************Language***************/
/*************Subscribe***************/
// -----已刪除
/*************Subscribe***************/
