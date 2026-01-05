// ==UserScript==
// @name         Imperia Online Auto Merchant Firefox
// @namespace    imperia_merchant
// @version      1.4
// @description  Purchases resource from the market.
// @author       ChoMPi
// @match        http://*.imperiaonline.org/imperia/game_v6/game/village.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16834/Imperia%20Online%20Auto%20Merchant%20Firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/16834/Imperia%20Online%20Auto%20Merchant%20Firefox.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var interval;
var lang = "en";
var currentLowset = 0;

this.GM_getValue=function (key,def) {
    return localStorage[key] || def;
};
this.GM_setValue=function (key,value) {
    return localStorage[key]=value;
};
this.GM_deleteValue=function (key) {
    return delete localStorage[key];
};

$.fn.serializeObject = function() {
    var form = {};
    $.each($(this).serializeArray(), function (i, field) {
        form[field.name] = field.value || "";
    });
    return form;
};

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find, 'g'), replace);
};

function nFormatter(num)
{
     if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
     }
     if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
     }
     return num;
}

function GetSettings()
{
    var settings = GM_getValue('automerchantsettings' + uid + REALM, null);
    if (settings == null) {
        return { resType: "1", highestPrice: "0.8", goal: "0", interval: "4000" };
    }
    return JSON.parse(settings);
}

function SaveSettings(obj)
{
    GM_setValue('automerchantsettings' + uid + REALM, JSON.stringify(obj));
}

function GetAutoMerchantState()
{
    var state = GM_getValue('automerchantstate' + uid + REALM, '0');
    return (state == '1');
}

function SetAutoMerchantState(state)
{
    GM_setValue('automerchantstate' + uid + REALM, (state ? '1' : '0'));
}

function GetSession()
{
    var session = GM_getValue('automerchantsession' + uid + REALM, null);
    if (session == null) {
        return { purchased: 0, spent: 0 };
    }
    return JSON.parse(session);
}

function SetSession(obj)
{
    GM_setValue('automerchantsession' + uid + REALM, JSON.stringify(obj));
}

function ResetSession()
{
    SetSession({ purchased: 0, spent: 0 });
}

function UpdateSessionInfo()
{
    if (container.isOpen({saveName:"auto-merchant"})) {
        var cont = $('#auto-merchant .window-content');
        
        $('#session-status', cont).html((GetAutoMerchantState() ? 'Running' : 'Stopped'));
        $('#session-purchased', cont).html(GetSession().purchased);
        $('#session-spent', cont).html(GetSession().spent);
        $('#session-current-lowset', cont).html(currentLowset);
    }
}

function UpdateButtons()
{
    var cont = $('#auto-merchant .window-content');
    
    if (typeof cont == 'undefined' || cont.length == 0) {
        return;
    }
    
    if (GetAutoMerchantState()) {
        $('button#auto-merchant-start', cont).hide();
        $('button#auto-merchant-stop', cont).show();
    } else {
        $('button#auto-merchant-start', cont).show();
        $('button#auto-merchant-stop', cont).hide();
    }
}

function OpenWindow()
{
    container.open({saveName:'auto-merchant', title:'Auto Merchant'});

    var html = 
        '<span class="window-decor-left"></span>' +
        '<span class="window-decor-right"></span>' +
        '<div class="window-tight auto-merchant-main">' +
            '<div class="content">' +
                '<div id="auto-merchant-id" class="auto-merchant">' +
                    '<div class="centered">' +
                        '<form onsubmit="return false" id="auto-merchant-form"><table align="center" style="width: 60%;">' +
                            '<tr>' +
                                '<td style="width:156px;">Resource to purchase</td>' +
                                '<td><select class="dropdown" name="resType" id="resTypeId">' +
                                    '<option value="1"' + (GetSettings().resType == "1" ? ' selected="selected"' : '') + '>Wood</option>' +
                                    '<option value="2"' + (GetSettings().resType == "2" ? ' selected="selected"' : '') + '>Iron</option>' +
                                    '<option value="3"' + (GetSettings().resType == "3" ? ' selected="selected"' : '') + '>Stone</option>' +
                                '</select></td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td style="width:156px;">Resource goal</td>' +
                                '<td><div style="position:relative;">' +
                                    '<input class="text" name="goal" id="goalId" size="10" value="' + GetSettings().goal + '" onkeyup="this.value=IsNumeric(this.value);" onblur="if(this.value.length==0)this.value=0;" />' +
                                    '<span id="goalN" style="position:absolute;width:100px;top:4px;right:-100px;">' + (parseInt(GetSettings().goal) > 0 ? nFormatter(GetSettings().goal) : '') + '</span>' +
                                '</div></td>' +
                            '</tr>' +
                            '<tr><td style="width:156px;">Highest price</td><td><input class="text" name="highestPrice" id="highestPriceId" size="5" value="' + GetSettings().highestPrice + '" onkeyup="this.value=IsNumeric2(this.value);" /></td></tr>' +
                            '<tr><td style="width:156px;">Interval</td><td><input class="text" name="interval" id="intervalId" size="5" value="' + GetSettings().interval + '" onkeyup="this.value=IsNumeric(this.value);" onblur="if(parseInt(this.value)<1000)this.value=1000;" /> ms</td></tr>' +
                        '</table></form>' +
                        '<hr class="divider" />' +
                        '<table align="center" style="width: 60%;">' +
                            '<tr>' +
                                '<td style="width:156px;">Status</td>' +
                                '<td id="session-status">' + (GetAutoMerchantState() ? 'Running' : 'Stopped') + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td style="width:156px;">Amount purchased</td>' +
                                '<td id="session-purchased">' + GetSession().purchased + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td style="width:156px;">Gold spent</td>' +
                                '<td id="session-spent">' + GetSession().spent + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td style="width:156px;">Current price</td>' +
                                '<td id="session-current-lowset">' + currentLowset + '</td>' +
                            '</tr>' +
                        '</table>' +
                        '<hr class="divider" />' +
                        '<div class="centered-block visual-loading fnone" style="">' +
                            '<button class="button" type="button" id="auto-merchant-start" value="Start" onclick="return false" style="' + (GetAutoMerchantState() ? 'display:none' : '') + '">Start</button>' +
                            '<button class="button" type="button" id="auto-merchant-stop" value="Stop" onclick="return false" style="' + (!GetAutoMerchantState() ? 'display:none' : '') + '">Stop</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    
    var cont = $('#auto-merchant .window-content');
    cont.html(html);
    
    $('#resTypeId', cont).on('change', function() {
        SaveSettings($('#auto-merchant-form', cont).serializeObject());
    });
    $('#highestPriceId', cont).on('keyup', function() {
        SaveSettings($('#auto-merchant-form', cont).serializeObject());
    });
    $('#goalId', cont).on('keyup', function() {
        SaveSettings($('#auto-merchant-form', cont).serializeObject());
        var val = $(this).val();
        if (val.length > 0 && parseInt(val) > 0) {
            $('#goalN').html(nFormatter(parseInt(val)));
        } else {
            $('#goalN').html('');
        }
    });
    $('#intervalId', cont).on('blur', function() {
        SaveSettings($('#auto-merchant-form', cont).serializeObject());
    });
    
    $('button#auto-merchant-start', cont).click(function(){
        SetAutoMerchantState(true);
        ResetSession();
        OpenWindow();
    });
    $('button#auto-merchant-stop', cont).click(function(){
        SetAutoMerchantState(false);
        OpenWindow();
    });
    
    container.position();
    ui.constructor();
}

function GetRowValues(element)
{
    var e1 = $('td:eq(1)', element);
    if (e1.find('a').length > 0) {
        e1 = $(e1.find('a').get(0));
    }
    var html = e1.html().replaceAll('&nbsp;', '').replaceAll(' ', '');
    var amount = parseInt(html);
    var price = parseFloat($('td:eq(2)', element).text());
    
    return { amount: amount, price: price };
}

function GetMaxAmount(content)
{
    var as = content.find('div a.clickLabel');
    
    if (as.length == 0) {
        return 0;
    }
    
    var a = $(as.get(0));
    var hrefSearch = /calculate\((\d+)\)\;/;
    var results = a.attr('href').match(hrefSearch);
       
    if (typeof results != 'undefined' && results.length > 0 && typeof results[1] != 'undefined') {
        return parseInt(results[1]);
    }
    
    return 0;
}

function GetMarketData(callback)
{
    var resType = GetSettings().resType.toString();
    
    $.post(location.protocol + "//" + location.host + "/imperia/game_v6/game/xajax_loader.php", {
        xjxfun: "viewTradeScreen",
        xjxr: Date.now(),
        xjxargs: ["Smarket", "<xjxobj><e><k>tab</k><v>N2</v></e><e><k>resType</k><v>N" + resType + "</v></e><e><k>vexok</k><v>Btrue</v></e></xjxobj>"],
    },
    function(data) {
        var e2 = $(data).find("#messageboxTradeContent").get(0);
        var html = $(e2).html();
        var content = $('<div></div>').html(html);
        
        var as = content.find('td > a.clickLabel');
        
        if (as.length == 0) {
            return;
        }
        
        var maxAmount = GetMaxAmount(content);
        
        if (maxAmount < 100) {
            return;
        }
        
        var tr = $(as.get(0)).parent().parent();
        var values = GetRowValues(tr);

        if (values.amount < 100) {
            values = GetRowValues(tr.next());
        }
        
        if (values.amount > maxAmount) {
            values.amount = maxAmount;
        }
        
        callback({ price: values.price, amount: values.amount, resType: resType });
    }, "xml");
}

function GetResID(resType)
{
    if (resType == "1") {
        return "wood";
    } else if (resType == "2") {
        return "iron";
    } else if (resType == "3") {
        return "stone";
    }
}

function BuyResource(data)
{
    var goal = parseInt(GetSettings().goal);
    
    if (goal > 0 && goal == GetSession().purchased) {
        SetAutoMerchantState(false);
        if (!container.isOpen({saveName:"auto-merchant"})) {
            OpenWindow();
        }
        $('#auto-merchant .content').prepend('<div class="notice-wrapper"><div class="notice positive"><span></span>Your resource goal has been reached.<br></div></div>');
        UpdateButtons();
        return;
    }
    
    if (goal > 0 && (GetSession().purchased + data.amount) > goal) {
        data.amount = goal - GetSession().purchased;
    }
    
    var onclickprice = Math.floor(data.amount * data.price);
    
    $.post(location.protocol + "//" + location.host + "/imperia/game_v6/game/xajax_loader.php", {
        xjxfun: "doBuyResource",
        xjxr: Date.now(),
        xjxargs: ["Smarket", "<xjxobj><e><k>onClickPrice</k><v>S" + onclickprice.toString() + "</v></e><e><k>resId</k><v>S" + GetResID(data.resType) + "</v></e><e><k>resType</k><v>S" + data.resType + "</v></e><e><k>amountToBuy</k><v>S" + data.amount.toString() + "</v></e><e><k>buttonBuy</k><v>SBuy</v></e><e><k>vexok</k><v>Btrue</v></e></xjxobj>"],
    },
    function(response) {
        var e2 = $(response).find("#messageboxTradeContent").get(0);
        var html = $(e2).html();
        var content = $('<div></div>').html(html);
        
        if (content.find('.notice-wrapper div.notice.positive').length > 0) {
            // Success
            var session = GetSession();
            session.purchased += data.amount;
            session.spent += onclickprice;
            SetSession(session);
        }
        else
        {
            var notice = content.find('.notice-wrapper div.notice');
            if (notice.length > 0) {
                if (!container.isOpen({saveName:"auto-merchant"})) {
                    OpenWindow();
                }
                $('#auto-merchant .content').prepend(notice.parent());
            }
        }
    }, "xml");
}

function Update()
{
    clearTimeout(interval);
    interval = setTimeout(Update, GetSettings().interval);
    
    if (!GetAutoMerchantState()) {
        return;
    }
    
    GetMarketData(function(data)
    {
        if (data.price <= parseFloat(GetSettings().highestPrice))
        {
            BuyResource(data);
        }
        currentLowset = data.price;
        UpdateSessionInfo();
    });
}

function Init()
{
    var cont = $('<div id="widget-automerchant"><div class="ui-bg ui-buttons"></div></div>');
    var btn = $('<a href="javascript:void(0);" style="padding: 5px 3px;box-sizing:border-box;">AM</a>');
    btn.click(function() {
        OpenWindow();
    });
    $('.ui-buttons', cont).append(btn);
    $('.ui-bottom-right').append(cont);
    
    interval = setTimeout(Update, GetSettings().interval);
}

function hookFunction(object, functionName, callback) {
    (function(originalFunction) {
        object[functionName] = function () {
            var returnValue = originalFunction.apply(this, arguments);

            callback.apply(this, arguments);

            return returnValue;
        };
    }(object[functionName]));
}

$(document).ready(function()
{
    function InitCheck()
    {
        if (typeof io.showUI != 'undefined')
        {
            hookFunction(io, 'showUI', function() {
                Init();
            });
        }
        else
        {
            setTimeout(InitCheck, 500);
        }
    }
    InitCheck();
});