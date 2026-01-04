// ==UserScript==
// @name         新創自動收藏(UI by 綠毛)
// @namespace    JuicefishTest
// @description  使用時記得把數據資訊和交易訂單的資料夾打開，或是下載自動開啟資料夾腳本。
// @version      1.0.2
// @author       Juicefish
// @match        https://acgn-stock.com/company/detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371122/%E6%96%B0%E5%89%B5%E8%87%AA%E5%8B%95%E6%94%B6%E8%97%8F%28UI%20by%20%E7%B6%A0%E6%AF%9B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/371122/%E6%96%B0%E5%89%B5%E8%87%AA%E5%8B%95%E6%94%B6%E8%97%8F%28UI%20by%20%E7%B6%A0%E6%AF%9B%29.meta.js
// ==/UserScript==
var isRegister=0,href,inputBuyNumber,number,buttonID,//price,
    Matches_Span,buy_or_sell,high_or_low,dollar_or_persent_or_number,delay_or_not=1,wait_or_not=0,
    dt = new Date(),styleBtn = new Array(),downBtn = new Array();

// 腳本追蹤目標
var scriptTitleName = "新創自動自動收藏";
var scriptCompanyID;

// 是否購買新創狀態(監聽Added), 0為不啟用, 1為啟用
// 以及取得新創時擺多少單上去
var buyInitial = 1;
var initBuyAmout;

// 是否購買股價更新狀態(監聽Changed), 0為不啟用, 1為啟用
// 以及取得下次更價時擺多少單上去
//var buyUpdate = 1;
//var nextBuyAmout = 128;

// 自動撤單延遲秒數
//var functionDelay = 5000;

// 是否要顯示自動防掛網的訊息, 0為不顯示, 1為顯示
var showAvoidIdle = 0;

// 自己的使用者ID, 自動取得
var scriptUserID = "";

// 腳本對象公司ID, 自動取得
var detailIndex = "";

// 防止腳本掛上兩次, 不須更動
var avoidOnece = 0;

// Function溝通用變數, 主要用於更價時
var lastListPrice = 0;
var nextPredictPrice = 0;

function addPluginMenu()
{
    const pluginMenu = $(`
                            <div class="card" style="margin-top:2rem;">
                                <div class="card-block">
                                    <h3 id="firstrush-title" style="display:inline-block;">新創預約掛單</h3>
                                    <input id="firstrush-number" type="text" style="font-size:1.2vw;width:100%;" placeholder="請輸入掛單數/金額/所持金%數 ex:100/$100/100%">
                                    <div style="display:inline-flex;width:100%;margin-top:1.25rem;">
                                        <div style="display:inline-block;width:25%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;">
                                            <a id="firstrush-buy-high" class="btn btn-primary" style="font-size:1.2vw;width:100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;" href="#">新創漲停買</a>
                                        </div>`+
                                        /*
                                        <div style="display:inline-block;width:25%;margin-left: 0.5%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;">
                                            <a id="firstrush-buy-low" class="btn btn-primary" style="font-size:1.2vw;width:100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;" href="#">新創跌停買</a>
                                        </div>
                                        <div style="display:inline-block;width:25%;margin-left: 0.5%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;">
                                            <a id="firstrush-sell-high" class="btn btn-primary" style="font-size:1.2vw;width:100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;" href="#">新創漲停賣</a>
                                        </div>
                                        <div style="display:inline-block;width:25%;margin-left: 0.5%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;">
                                            <a id="firstrush-sell-low" class="btn btn-primary" style="font-size:1.2vw;width:100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;" href="#">新創跌停賣</a>
                                        </div>
                                        */
                                    `
                                    </div>
                                    `+
                                    /*<a id="delay-or-not" class="btn btn-primary" style="margin-top:1.25rem;" href="#">現在會隨機延遲送出訂單</a>*/
                                    /*<a id="wait-or-not" class="btn btn-primary" style="margin-top:1.25rem;" href="#">等待價更送出訂單</a>*/
                                `</div>
                            </div>

            `).insertBefore($(".card").first());
    pluginMenu.find("#firstrush-buy-high").on("click",CheckButton);
    //pluginMenu.find("#firstrush-buy-low").on("click",CheckButton);
    //pluginMenu.find("#firstrush-sell-high").on("click",CheckButton);
    //pluginMenu.find("#firstrush-sell-low").on("click",CheckButton);
    //pluginMenu.find("#delay-or-not").on("click",CheckDelayOrNot);
    //pluginMenu.find("#firstrush-title").on("click",CheckWaitOrNot);
    ResetButtonText();
}

function ResetButtonText()
{
    document.getElementById("firstrush-buy-high").innerText="新創漲停買";
    //document.getElementById("firstrush-buy-low").innerText="新創跌停買";
    //document.getElementById("firstrush-sell-high").innerText="新創漲停賣";
    //document.getElementById("firstrush-sell-low").innerText="新創跌停賣";
}

function CheckWaitOrNot()
{
    wait_or_not=!wait_or_not;
    if(wait_or_not==0)
    {
        document.getElementById("firstrush-title").innerText="預約價更掛單";
    }
    else if(wait_or_not==1)
    {
        document.getElementById("firstrush-title").innerText="立即送出訂單";
    }
}

function CheckButton()
{
    if(isRegister == 0)
    {
        isRegister = !isRegister;
        Matches_Span = document.getElementsByTagName('span');
        inputBuyNumber = document.getElementById("firstrush-number").value;
        buttonID = this.id;
        this.innerText="你預約的是:"+this.innerText+"．．．";
        document.getElementById("firstrush-buy-high").innerText=this.innerText;
        //document.getElementById("firstrush-buy-low").innerText=this.innerText;
        //document.getElementById("firstrush-sell-high").innerText=this.innerText;
        //document.getElementById("firstrush-sell-low").innerText=this.innerText;
        /*
        for(var i = 0;i<Matches_Span.length;i++)
        {
            if(Matches_Span[i].className=="text-nowrap")
            {
                if(Matches_Span[i].innerText.indexOf("參考價格")!=-1)
                {
                    console.log("預載入");
                    price=Matches_Span[i+1].innerText;
                    console.log("預載入完成");
                }
            }
        }
        */
        if(buttonID.indexOf("buy")!=-1)
            buy_or_sell=0;
        else if(buttonID.indexOf("sell")!=-1)
            buy_or_sell=1;

        if(buttonID.indexOf("high")!=-1)
            high_or_low=0;
        else if(buttonID.indexOf("low")!=-1)
            high_or_low=1;

        if(inputBuyNumber.indexOf("$")!=-1)
        {
            inputBuyNumber = inputBuyNumber.match(/\d+/g);
            dollar_or_persent_or_number=0;
        }
        else if(inputBuyNumber.indexOf("%")!=-1)
        {
            inputBuyNumber = inputBuyNumber.match(/\d+/g)/100;
            dollar_or_persent_or_number=1;
        }
        else
        {
            inputBuyNumber = inputBuyNumber.match(/\d+/g);
            dollar_or_persent_or_number=2;
        }
        //CheckPrice();
    }
    else if(isRegister == 1)
    {
        isRegister = !isRegister;
        ResetButtonText();
    }
}

/*
function CheckPrice()
{
    if(href!=location.href.replace(/[^\w]/g,''))
    {
        href=location.href.replace(/[^\w]/g,'');
        if(isRegister == 1)
        {
            isRegister = !isRegister;
            ResetButtonText();
        }
    }
    if(isRegister == 1)
    {
        Matches_Span = document.getElementsByTagName('span');
        for(var i = 0;i<Matches_Span.length;i++)
        {
            if(Matches_Span[i].className=="text-nowrap")
            {
                if(Matches_Span[i].innerText.indexOf("參考價格")!=-1)
                {
                    if(price==null)
                    {
                        console.log("預載入失敗！");
                        console.log("第一次載入");
                        price=Matches_Span[i+1].innerText;
                        console.log("載入完成");
                    }
                    else
                    {
                        if(wait_or_not==1)
                        {
                            price=Matches_Span[i+1].innerText;
                            if(dollar_or_persent_or_number==0)
                            {
                                number=parseInt(inputBuyNumber/price_val);
                            }
                            isRegister = 0;
                            ResetButtonText();
                            if(delay_or_not==0)
                            {
                                setTimeout(AutoDown,Math.floor(Math.random(dt.getTime())*10000));
                            }
                            else if(delay_or_not==1)
                            {
                                setTimeout(AutoDown,10);
                            }
                            break;
                        }
                        if(price!=Matches_Span[i+1].innerText)
                        {
                            console.log("價更");
                            price=Matches_Span[i+1].innerText;
                            if(dollar_or_persent_or_number==0)
                            {
                                number=parseInt(inputBuyNumber/price_val);
                            }
                            isRegister = 0;
                            ResetButtonText();
                            if(delay_or_not==0)
                            {
                                setTimeout(AutoDown,Math.floor(Math.random(dt.getTime())*10000));
                            }
                            else if(delay_or_not==1)
                            {
                                setTimeout(AutoDown,10);
                            }
                            break;
                        }
                    }
                }
            }
        }
    }
    if(isRegister == 1)
    {
        setTimeout(CheckPrice,1000);//每秒檢查一次
    }
}
function AutoDown()
{
    var i,j=0;
    for(i = 0; i < $(".btn.btn-info.btn-sm").length; i++)
    {
        if($(".btn.btn-info.btn-sm")[i].innerText.search("下單") != -1)
        {
            downBtn[0] = $(".btn.btn-info.btn-sm")[i];
            if($(".btn.btn-info.btn-sm")[i+1]!=null)
            {
                if($(".btn.btn-info.btn-sm")[i+1].innerText.search("下單") != -1)
                {
                    downBtn[1] = $(".btn.btn-info.btn-sm")[i+1];
                }
            }
            j=1;
            console.log(downBtn[0]);
            console.log(downBtn[1]);
            break;
        }
    }
    if(j==0)
    {
        console.log("尋找下單按鈕");
        setTimeout(AutoDown,10);
    }
    else if(j==1)
    {
        if(downBtn[buy_or_sell]!=null)
        {
            downBtn[buy_or_sell].click();
            setTimeout(AutoFillPrice,10);
        }
    }
}

function AutoFillPrice()
{
    var i,j=0;
    for(i = 0; i < $("input.form-control").length; i++)
    {
        if($("input.form-control")[i].name == "alert-dialog-custom-input")
        {
            if(high_or_low==0)
            {
                price_val=$("input.form-control")[i].max;
            }
            else if(high_or_low==1)
            {
                price_val=$("input.form-control")[i].min;
            }
            console.log("填寫價格:$"+price_val);
            $("input.form-control")[i].value=price_val;
            setTimeout(AutoSumbitPrice,10);
            j=1;
            break;
        }
    }
    if(j==0)
    {
        console.log("尋找價格");
        setTimeout(AutoFillPrice,10);
    }
}

function AutoSumbitPrice()
{
    var i,j=0;
    for(i = 0; i < $("button.btn.btn-primary").length; i++)
    {
        if($("button.btn.btn-primary")[i].innerText.search("確認") != -1)
        {
            console.log("送出價格");
            $("button.btn.btn-primary")[i].click();
            setTimeout(AutoFillNumber,10);
            j=1;
            break;
        }
    }
    if(j==0)
    {
        console.log("尋找確認按鈕");
        setTimeout(AutoSumbitPrice,10);
    }
}

function AutoFillNumber()
{

    var i,j=0;
    for(i = 0; i < $("input.form-control").length; i++)
    {
        if($("input.form-control")[i].name == "alert-dialog-custom-input")
        {
            if(dollar_or_persent_or_number==1)
            {
                number=parseInt($("input.form-control")[i].max*input);
            }
            number=Math.max(number,$("input.form-control")[i].min);
            number=Math.min(number,$("input.form-control")[i].max);
            console.log("填寫單數:"+number);
            $("input.form-control")[i].value=number;
            setTimeout(AutoSumbitNumber,10);
            j=1;
            break;
        }
    }
    if(j==0)
    {
        console.log("尋找單數");
        setTimeout(AutoFillNumber,10);
    }
}

function AutoSumbitNumber()
{
    var i,j=0;
    for(i = 0; i < $("button.btn.btn-primary").length; i++)
    {
        if($("button.btn.btn-primary")[i].innerText.search("確認") != -1)
        {
            console.log("送出單數");
            $("button.btn.btn-primary")[i].click();
            j=1;
            setTimeout(CheckTooFastOrNot,1000);
            break;
        }
    }
    if(j==0)
    {
        console.log("尋找確認按鈕");
        setTimeout(AutoSumbitNumber,10);
    }

}

function CheckTooFastOrNot()
{
    var Windows = document.getElementsByClassName('modal fade show d-block');
    for(var i=0;i<Windows.length;i++)
    {
        if(Windows[i] != null)
        {
            if((Windows[i].innerText.indexOf("[too-many-requests]")!=-1)||(Windows[i].innerText.indexOf("伺服器")!=-1)||(Windows[i].innerText.indexOf("Internal server error")!=-1))
            {
                console.log("請求發送過快，重新發送");
                setTimeout(AutoReSumbit,10);
            }
        }
    }
}

function AutoReSumbit()
{
    var i,j=0;
    for(i = 0; i < $("button.btn.btn-primary").length; i++)
    {
        if($("button.btn.btn-primary")[i].innerText.search("確認") != -1)
        {
            console.log("送出價格");
            $("button.btn.btn-primary")[i].click();
            setTimeout(AutoDown,1000);
            j=1;
            break;
        }
    }
    if(j==0)
    {
        console.log("尋找確認按鈕");
        setTimeout(AutoReSumbit,10);
    }
}
*/


// ********************************************************************************
// ********************************************************************************
/*
 * 確認Meteor有沒有啟動
 */
function meteorIsLoaded() {
    return typeof(Meteor) === 'object' ? true : false;
}

// 觀察頁面載入狀態
function observeLoadingOverlay()
{
    new MutationObserver(mutations =>
    {
        mutations.filter(m => m.attributeName === "class").forEach(m =>
        {
            if (m.target.classList.contains("d-none"))
            {
                onPageLoaded();
            }
            else
            {
                onPageLoading();
            }
        });
    }).observe($("#loading .loadingOverlay")[0], { attributes: true });
}

function onPageLoading()
{
    //console.log('Page loading: ${document.location.href}');
}

function onPageLoaded()
{
    const currentUrl = document.location.href;
    //console.log('Page loaded: ${currentUrl}');

    // 頁面 url 樣式的回呼表
    const urlPatternCallbackTable = [
      { pattern: /company\/[0-9]+/, callback: onStockSummaryPageLoaded },
      { pattern: /company\/detail/, callback: onCompanyDetailPageLoaded },
    ];

    urlPatternCallbackTable.forEach(({ pattern, callback }) =>
    {
        if (currentUrl.match(pattern))
        {
            // loadingOverlay 消失後，需要給點時間讓頁面的載入全部跑完
            setTimeout(callback, 100);
        }
    });
}

function onStockSummaryPageLoaded() {
    Tester();
}

function onCompanyDetailPageLoaded() {
    Tester();
}

function Tester() {
    // Only run the code if Meteor is loaded
    if (!meteorIsLoaded())
    {
        return;
    }

    if(avoidOnece === 0)
    {

        PrintTime(scriptTitleName + " : Initial Time @ ");

        scriptUserID = Meteor.userId();
        PrintTime(scriptTitleName + " : Initial User : [" + scriptUserID + "] @ ");

        detailIndex = document.location.href.indexOf("detail/");
        scriptCompanyID = document.location.href.slice(detailIndex + 7);
        PrintTime(scriptTitleName + " : Initial CompanyID : [" + scriptCompanyID + "] @ ");

        avoidOnece = 1;
        AvoidMeteorIdle();


        Meteor.connection._mongo_livedata_collections.companies.find().observeChanges(
        {
            added(id, fields)
            {
                if(id == scriptCompanyID && fields["listPrice"] !== undefined)
                {
                    console.log(scriptTitleName  +  " : 取得公司資訊 : " + fields["companyName"] + ", " + id);
                    UpdatePriceByField(fields["listPrice"]);
                }

                if(id == scriptCompanyID && fields["listPrice"] !== undefined && buyInitial === 1 && isRegister == 1)
                {
                    // Update Value
                    buyInitial = 0;
                    UpdatePriceByField(fields["listPrice"]);

                    // Write Buy Value
                    switch(dollar_or_persent_or_number)
                    {
                        // $123,456
                        case 0:
                            initBuyAmout = parseInt(inputBuyNumber/nextPredictPrice);
                            break;

                        // 50%(以資本額為基準)
                        case 1:
                            initBuyAmout = parseInt(Meteor.connection._mongo_livedata_collections.companies.findOne({"_id":scriptCompanyID})["capital"] * inputBuyNumber / nextPredictPrice);
                            break;

                        // 87 (張)
                        case 2:
                            initBuyAmout = parseInt(inputBuyNumber);
                            break;
                    }

                    // Do Buying
                    PrintTime(scriptTitleName + " : 新創買股動作 : $" + nextPredictPrice + " x " + initBuyAmout + " @ ");
                    Meteor.customCall("createBuyOrder", {"companyId":scriptCompanyID, "unitPrice":nextPredictPrice, "amount":initBuyAmout});
                }
            }
        });
        if(buyInitial === 1)
            PrintTime(scriptTitleName + " : 監聽公司創始已啟動 ");

    /*
    Meteor.connection._mongo_livedata_collections.companies.find().observeChanges({
        changed(id, fields) {
            if(id == scriptCompanyID && fields["lastPrice"] !== undefined)
            PrintTime(scriptTitleName + " : 成交價變動 [" + fields["lastPrice"] +"] @ ");

            if(id == scriptCompanyID && fields["listPrice"] !== undefined)
                PrintTime(scriptTitleName + " : 參考價變動 [" + fields["listPrice"] +"] @ ");

            // 若參考價更新時
            if(id == scriptCompanyID && fields["listPrice"] !== undefined && fields["listPrice"] > lastListPrice && buyUpdate === 1)
            {
                buyUpdate = 0;
                var previousListPrice = lastListPrice;
                UpdatePriceByField(fields["listPrice"]);
                PrintTime(scriptTitleName + " : 買股動作 [$" + nextPredictPrice + "] @ ");

                setTimeout(Meteor.customCall, functionDelay * 0, "createBuyOrder", {"companyId":scriptCompanyID, "unitPrice":nextPredictPrice, "amount":nextBuyAmout});

            }
        }
    });
    if(buyUpdate === 1)
        PrintTime(scriptTitleName + " : 監聽公司更價已啟動 ");
    */
    }
    return;
}

function AvoidMeteorIdle()
{
    if(showAvoidIdle === 1)
        PrintTime(scriptTitleName + " : Avoid Idle @ ");
    UserStatus.pingMonitor();
    setTimeout(AvoidMeteorIdle, 1 * 60 * 1000);
}

function UpdatePriceByField(a_newListPrice)
{
    lastListPrice = a_newListPrice;
    if(lastListPrice >=  Meteor.connection._mongo_livedata_collections.variables.findOne("lowPriceThreshold")["value"] )
        nextPredictPrice = Math.ceil(lastListPrice * 1.15);
    else
        nextPredictPrice = Math.ceil(lastListPrice * 1.3);
    PrintTime(scriptTitleName + " : 目前參考價 [$" + lastListPrice +"] @ ");
    PrintTime(scriptTitleName + " : 下次預估價 [$" + nextPredictPrice +"] @ ");
}

function UpdatePrice()
{
    lastListPrice = Meteor.connection._mongo_livedata_collections.companies.findOne({"_id":scriptCompanyID})["listPrice"];
    if(lastListPrice >=  Meteor.connection._mongo_livedata_collections.variables.findOne("lowPriceThreshold")["value"] )
        nextPredictPrice = Math.ceil(lastListPrice * 1.15);
    else
        nextPredictPrice = Math.ceil(lastListPrice * 1.3);
    PrintTime(scriptTitleName + " : 目前參考價 [$" + lastListPrice +"] @ ");
    PrintTime(scriptTitleName + " : 下次預估價 [$" + nextPredictPrice +"] @ ");
}


function PrintTime(a_title)
{
    var currentdate = new Date();
    console.log(a_title +
                currentdate.getFullYear() + "/" +
                (currentdate.getMonth()+1) + "/" +
                currentdate.getDate() +
                " @ " +
                currentdate.getHours() + ":" +
                currentdate.getMinutes() + ":" +
                currentdate.getSeconds());
}

// 程式進入點
(function mainfunction() {
    // From SmallYue
    // Initial UI
    'use strict';
    href=location.href.replace(/[^\w]/g,'');
    addPluginMenu();

    // From FronzeMouse
    // Initial Data Listen
    observeLoadingOverlay();
})();