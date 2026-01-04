// ==UserScript==
// @name         Candle Stock/Employee
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically calculate stock, check for over ordering, see employee last action.
// @author       PsycWard
// @include     *torn.com/*
// @noframes
// @connect     api.torn.com
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/408213/Candle%20StockEmployee.user.js
// @updateURL https://update.greasyfork.org/scripts/408213/Candle%20StockEmployee.meta.js
// ==/UserScript==
/* global $ */

(function() {
    'use strict';
//your API KEY
var pAPI="yourApiKey";

//adjust your stock calculations
var multiplier=3.8;
var plus=0;
var pgurl = encodeURIComponent(document.URL);

//-- Company Stock Order Est
function CSOE()
{
    var stockItem=$("ul.pricing-list.fm-list.t-blue-cont.h > li");
    $(stockItem).each(function (sN){
        var sold=$(stockItem).eq(sN).find("div.sold-daily").text();
        sold=Number(sold.replace(/[^0-9]/g,""));
        var stock=$(stockItem).eq(sN).find("div.stock").text();
        stock=Number(stock.replace(/[^0-9]/g,""));
        var tD=Math.round((sold*multiplier)+plus);
        var buyS=tD-stock;
        if ($(stockItem).eq(sN).find("div.name.bold.t-gray-9.acc-header span.added").length>0){$(stockItem).eq(sN).find("div.name.bold.t-gray-9.acc-header span.added").text("  - "+tD+" ("+buyS+")");}
        else {$("<span class='added'>  - "+tD+"  ("+buyS+")</span>").appendTo($(stockItem).eq(sN).find("div.name.bold.t-gray-9.acc-header"));}
    });
}

function OrderC()
{
    var OT=$("ul.stock-list.fm-list.t-blue-cont.h>li.total>div.stock.bold").text();
    OT=Number(OT.replace(/[^0-9]/g,""));
    var tT=$("ul.stock-list.fm-list.t-blue-cont.h>li:eq(0) div.stock").text();
    tT=Number(tT.replace(/[^0-9]/g,""));
    var dT=$("ul.stock-list.fm-list.t-blue-cont.h>li:eq(1) div.stock").text();
    dT=Number(dT.replace(/[^0-9]/g,""));
    var pT=$("ul.stock-list.fm-list.t-blue-cont.h>li:eq(2) div.stock").text();
    pT=Number(pT.replace(/[^0-9]/g,""));
    var sT=$("ul.stock-list.fm-list.t-blue-cont.h>li:eq(3) div.stock").text();
    sT=Number(sT.replace(/[^0-9]/g,""));
    var hT=$("ul.stock-list.fm-list.t-blue-cont.h>li:eq(4) div.stock").text();
    hT=Number(hT.replace(/[^0-9]/g,""));
    var OBD=$("ul.order-list div.status.t-gray-9").parent();
    $(OBD).each(function (oN){
        var OBDN=$(OBD).eq(oN).find("div.amount").text();
        OBDN=Number(OBDN.replace(/[^0-9]/g,""));
        OT=OT+OBDN;
        var name=$(OBD).eq(oN).find("div.name").text();
        switch (name){
            case "Tealight":
                tT=tT+OBDN;
                break;
            case "Dinner Candle":
                dT=dT+OBDN;
                break;
            case "Pillar Candle":
                pT=pT+OBDN;
                break;
            case "Scented Candle":
                sT=sT+OBDN;
                break;
            case "Holder":
                hT=hT+OBDN;
                break;
            default:
                alert(name);
        }
    });
    var iO=$("ul.stock-list.fm-list.t-blue-cont.h input[type='text']");
    $(iO).each(function (iC){
        var tempIO=$(iO).eq(iC).val();
        tempIO=Number(tempIO.replace(/[^0-9]/g,""));
        if (tempIO===""){tempIO=0;}
        var nameL= $(iO).eq(iC).parents("li:first").find("div.name.bold.t-gray-9.acc-header").text();
        nameL=nameL.replace(/[^A-z]/g,"");
        switch (nameL){
            case "Tealight":
                tT=tT+tempIO;
                break;
            case "DinnerCandle":
                dT=dT+tempIO;
                break;
            case "PillarCandle":
                pT=pT+tempIO;
                break;
            case "ScentedCandle":
                sT=sT+tempIO;
                break;
            case "Holder":
                hT=hT+tempIO;
                break;
            default:
                alert(nameL+" not Found");
        }
        OT=OT+tempIO;
    });
    if ($("ul.stock-list.fm-list.t-blue-cont.h>li:eq(0)>div.name>span.added").length>0){$("ul.stock-list.fm-list.t-blue-cont.h>li:eq(0)>div.name>span.added").text("  - "+tT);}
    else {$("<span class='added'>  - "+tT+"</span>").appendTo($("ul.stock-list.fm-list.t-blue-cont.h>li:eq(0)>div.name"));}
    if ($("ul.stock-list.fm-list.t-blue-cont.h>li:eq(1)>div.name>span.added").length>0){$("ul.stock-list.fm-list.t-blue-cont.h>li:eq(1)>div.name>span.added").text("  - "+dT);}
    else {$("<span class='added'>  - "+dT+"</span>").appendTo($("ul.stock-list.fm-list.t-blue-cont.h>li:eq(1)>div.name"));}
    if ($("ul.stock-list.fm-list.t-blue-cont.h>li:eq(2)>div.name>span.added").length>0){$("ul.stock-list.fm-list.t-blue-cont.h>li:eq(2)>div.name>span.added").text("  - "+pT);}
    else {$("<span class='added'>  - "+pT+"</span>").appendTo($("ul.stock-list.fm-list.t-blue-cont.h>li:eq(2)>div.name"));}
    if ($("ul.stock-list.fm-list.t-blue-cont.h>li:eq(3)>div.name>span.added").length>0){$("ul.stock-list.fm-list.t-blue-cont.h>li:eq(3)>div.name>span.added").text("  - "+sT);}
    else {$("<span class='added'>  - "+sT+"</span>").appendTo($("ul.stock-list.fm-list.t-blue-cont.h>li:eq(3)>div.name"));}
    if ($("ul.stock-list.fm-list.t-blue-cont.h>li:eq(4)>div.name>span.added").length>0){$("ul.stock-list.fm-list.t-blue-cont.h>li:eq(4)>div.name>span.added").text("  - "+hT);}
    else {$("<span class='added'>  - "+hT+"</span>").appendTo($("ul.stock-list.fm-list.t-blue-cont.h>li:eq(4)>div.name"));}
    if ($("ul.stock-list.fm-list.t-blue-cont.h>li:eq(5)>div.name>span.added").length>0){$("ul.stock-list.fm-list.t-blue-cont.h>li:eq(5)>div.name>span.added").text("  - "+OT);}
    else {$("<span class='added'>  - "+OT+"</span>").appendTo($("ul.stock-list.fm-list.t-blue-cont.h>li:eq(5)>div.name"));}
}

function Emp ()
{
    if($("ul.employee-list.t-blue-cont.h div.days").length){
    var empD=$("ul.employee-list.t-blue-cont.h div.days");
    var empA=[];
    $(empD).each( function (ED){
        var tempED=$(empD).eq(ED).text();
        tempED=Number(tempED.replace(/[^0-9]/g,""))+1;
        empA.push(tempED);
    });
    $("<ul class='employee-list t-blue-cont h'></ul>").appendTo("div.employee-list-wrap");
    empA=empA.sort(function(a, b){return b-a;});
    var eC=0;

    while(empA[eC]){
        var eTemp=empA[eC]-1;eTemp=eTemp.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
        $("ul.employee-list.t-blue-cont.h:eq(0) div.days").each(function (cc){
        if($("ul.employee-list.t-blue-cont.h:eq(0) div.days").eq(cc).text().search(eTemp+" ")>0){
            $("ul.employee-list.t-blue-cont.h:eq(0)>li").eq(cc).appendTo("ul.employee-list.t-blue-cont.h:eq(1)");
        }
        });
        eC++;
    }
    $("ul.employee-list.t-blue-cont.h:eq(0)").remove();
        var empN=$("ul.employee-list.t-blue-cont.h div.employee.icons.t-overflow a.user.name");
        $(empN).each(function (EN){
            var tempEN=$(empN).find("img").eq(EN).attr("title");
            var tempENend;
            if (tempEN.search(/\] /)>-1){tempENend=tempEN.search(/\] /);}
            else {tempENend=tempEN.length;}
            var tempENu=tempEN.slice(tempEN.search(/ \[/),tempENend);
            var tempENum=tempENu.replace(/[^0-9]/g,"");
            var LA="";
            var titl="";
            var profRequest = GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.torn.com/user/"+tempENum+"?selections=&key="+pAPI,
            headers: {"Accept": "application/json"},
            onload: function(Pprof) {
            var prof=JSON.parse(Pprof.responseText);
            LA=prof.last_action.relative;
            titl=$(empN).find("img").eq(EN).attr("title");
            if (LA!==undefined && titl.search(LA)<0){$(empN).find("img").eq(EN).attr("title",tempEN+" "+LA);}
            }});
        });
}
    else {window.setTimeout(function(){Emp();},1000);}
}
if (pgurl.search("companies")>-1)
{
    $("li[aria-controls='pricing']").click(function(){window.setTimeout(function(){CSOE();},1000);});
    $("li[aria-controls='stock']").click(function(){window.setTimeout(function(){if ($("#OTC").length<1){$("<button id='OTC' type='button'>Check Total</button>").appendTo("ul.stock-list.fm-list.t-blue-cont.h>li.total.t-hide");}$("#OTC").click(function(){OrderC();});},1000);});
    $("li[aria-controls='employees']").click(function(){window.setTimeout(function(){Emp();},1000);});
}


//-- End Company Stock Order Est

})();