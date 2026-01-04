// ==UserScript==
// @name         預約價更掛單
// @description  使用時記得把數據資訊和交易訂單的資料夾打開，或是下載自動開啟資料夾腳本。
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @author       SmallYue1
// @match        https://acgn-stock.com/company/detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40767/%E9%A0%90%E7%B4%84%E5%83%B9%E6%9B%B4%E6%8E%9B%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/40767/%E9%A0%90%E7%B4%84%E5%83%B9%E6%9B%B4%E6%8E%9B%E5%96%AE.meta.js
// ==/UserScript==
var run=0,href,input,number,id,price,/*price_top,price_bottom,*/Matches_Span,buy_or_sell,high_or_low,dollar_or_persent_or_number,delay_or_not=1,wait_or_not=0,dt = new Date(),styleBtn = new Array(),downBtn = new Array();

function addPluginMenu() {
  const pluginMenu = $(`
                        <div class="card" style="margin-top:2rem;">
                            <div class="card-block">
                                <h3 id="title" style="display:inline-block;">預約價更掛單</h3>
                                <input id="number" type="text" style="font-size:1.2vw;width:100%;" placeholder="請輸入掛單數/金額/所持金%數 ex:100/$100/100%">
                                <div style="display:inline-flex;width:100%;margin-top:1.25rem;">
                                    <div style="display:inline-block;width:25%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;">
                                        <a id="buy-high" class="btn btn-primary" style="font-size:1.2vw;width:100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;" href="#">漲停買單</a>
                                    </div>
                                    <div style="display:inline-block;width:25%;margin-left: 0.5%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;">
                                        <a id="buy-low" class="btn btn-primary" style="font-size:1.2vw;width:100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;" href="#">跌停買單</a>
                                    </div>
                                    <div style="display:inline-block;width:25%;margin-left: 0.5%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;">
                                        <a id="sell-high" class="btn btn-primary" style="font-size:1.2vw;width:100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;" href="#">漲停賣單</a>
                                    </div>
                                    <div style="display:inline-block;width:25%;margin-left: 0.5%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;">
                                        <a id="sell-low" class="btn btn-primary" style="font-size:1.2vw;width:100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;" href="#">跌停賣單</a>
                                    </div>
                                </div>
                                `+/*<a id="delay-or-not" class="btn btn-primary" style="margin-top:1.25rem;" href="#">現在會隨機延遲送出訂單</a>*/
                                /*<a id="wait-or-not" class="btn btn-primary" style="margin-top:1.25rem;" href="#">等待價更送出訂單</a>*/
                            `</div>
                        </div>

      `).insertBefore($(".card").first());
    pluginMenu.find("#buy-high").on("click",CheckButton);
    pluginMenu.find("#buy-low").on("click",CheckButton);
    pluginMenu.find("#sell-high").on("click",CheckButton);
    pluginMenu.find("#sell-low").on("click",CheckButton);
    //pluginMenu.find("#delay-or-not").on("click",CheckDelayOrNot);
    pluginMenu.find("#title").on("click",CheckWaitOrNot);
}

function checkScriptUpdate() { //從SowftwareSing的腳本擷取
  var oReq = new XMLHttpRequest();
  var checkScriptVersion = function checkScriptVersion() {
    var obj = JSON.parse(oReq.responseText);
    var myVersion = GM_info.script.version; // eslint-disable-line camelcase
    console.log(obj.version.substr(0, 4) + ',' + myVersion.substr(0, 4) + ',' + (obj.version.substr(0, 4) > myVersion.substr(0, 4)));
    if (obj.version.substr(0, 4) > myVersion.substr(0, 4)) {
      var updateButton = $('\n        <li class=\'nav-item\'>\n          <a class=\'nav-link btn btn-primary\'\n          href=\'https://greasyfork.org/zh-TW/scripts/40767\'\n          name=\'updateAutoDownScript\'\n          target=\'Blank\'\n          > 更新價更掛單腳本</a>\n        </li>\n      ');
      updateButton.insertAfter($('.nav-item')[$('.nav-item').length - 1]);
    } else {
      setTimeout(checkScriptUpdate, 600000);
    }
  };
  oReq.addEventListener('load', checkScriptVersion);
  oReq.open('GET', 'https://greasyfork.org/zh-TW/scripts/40767.json');
  oReq.send();
}

function CheckWaitOrNot()
{
    wait_or_not=!wait_or_not;
    if(wait_or_not==0)
    {
        document.getElementById("title").innerText="預約價更掛單";
    }
    else if(wait_or_not==1)
    {
        document.getElementById("title").innerText="立即送出訂單";
    }
}

/*function CheckDelayOrNot()
{
    delay_or_not=!delay_or_not;
    if(delay_or_not==0)
    {
        document.getElementById("delay-or-not").innerText="現在會隨機延遲送出訂單";
    }
    else if(delay_or_not==1)
    {
        document.getElementById("delay-or-not").innerText="現在會馬上送出訂單";
    }
}*/

function CheckButton()
{
    if(run==0)
    {
        run=!run;
        Matches_Span = document.getElementsByTagName('span');
        input=document.getElementById("number").value;
        id=this.id;
        this.innerText="你預約的是:"+this.innerText+"．．．";
        document.getElementById("buy-high").innerText=this.innerText;
        document.getElementById("buy-low").innerText=this.innerText;
        document.getElementById("sell-high").innerText=this.innerText;
        document.getElementById("sell-low").innerText=this.innerText;
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
        if(id.indexOf("buy")!=-1)
        {
            buy_or_sell=0;
        }
        else if(id.indexOf("sell")!=-1)
        {
            buy_or_sell=1;
        }
        if(id.indexOf("high")!=-1)
        {
            high_or_low=0;
        }
        else if(id.indexOf("low")!=-1)
        {
            high_or_low=1;
        }
        if(input.indexOf("$")!=-1)
        {
            input=input.match(/\d+/g);
            dollar_or_persent_or_number=0;
        }
        else if(input.indexOf("%")!=-1)
        {
            input=input.match(/\d+/g)/100;
            dollar_or_persent_or_number=1;
        }
        else
        {
            number=input;
            dollar_or_persent_or_number=2;
        }
        CheckPrice();
    }
    else if(run==1)
    {
        run=!run;
        document.getElementById("buy-high").innerText="漲停買單";
        document.getElementById("buy-low").innerText="跌停買單";
        document.getElementById("sell-high").innerText="漲停賣單";
        document.getElementById("sell-low").innerText="跌停賣單";
    }
}

function CheckPrice()
{
    if(href!=location.href.replace(/[^\w]/g,''))
    {
        href=location.href.replace(/[^\w]/g,'');
        if(run==1)
        {
            run=!run;
            document.getElementById("buy-high").innerText="漲停買單";
            document.getElementById("buy-low").innerText="跌停買單";
            document.getElementById("sell-high").innerText="漲停賣單";
            document.getElementById("sell-low").innerText="跌停賣單";
        }
    }
    if(run==1)
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
                            //price_val=price.replace(/[^\w]/g,'');
                            //price_top=Math.ceil(price_val*1.15);
                            //price_bottom=Math.floor(price_val*0.85);
                            /*if(high_or_low==0)
                            {
                                price_val=price_top;
                            }
                            else if(high_or_low==1)
                            {
                                price_val=price_bottom;
                            }
                            if(dollar_or_persent_or_number==0)
                            {
                                number=parseInt(input/price_val);
                            }*/
                            run=0;
                            document.getElementById("buy-high").innerText="漲停買單";
                            document.getElementById("buy-low").innerText="跌停買單";
                            document.getElementById("sell-high").innerText="漲停賣單";
                            document.getElementById("sell-low").innerText="跌停賣單";
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
                            //price_val=price.replace(/[^\w]/g,'');
                            //price_top=Math.ceil(price_val*1.15);
                            //price_bottom=Math.floor(price_val*0.85);
                            /*if(high_or_low==0)
                            {
                                price_val=price_top;
                            }
                            else if(high_or_low==1)
                            {
                                price_val=price_bottom;
                            }
                            if(dollar_or_persent_or_number==0)
                            {
                                number=parseInt(input/price_val);
                            }*/
                            run=0;
                            document.getElementById("buy-high").innerText="漲停買單";
                            document.getElementById("buy-low").innerText="跌停買單";
                            document.getElementById("sell-high").innerText="漲停賣單";
                            document.getElementById("sell-low").innerText="跌停賣單";
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
    if(run==1)
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
            if(dollar_or_persent_or_number==0)
            {
                number=parseInt(input/price_val);
            }
            else if(dollar_or_persent_or_number==1)
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

function AvoidMeteorIdle()
{
    UserStatus.pingMonitor();//powered by juicefish
}

(function() {
    'use strict';
    href=location.href.replace(/[^\w]/g,'');
    addPluginMenu();
    checkScriptUpdate();
	setInterval(AvoidMeteorIdle, 60000);
    // Your code here...
})();
