// ==UserScript==
// @name         torn-tools
// @namespace    http://tampermonkey.net/
// @version      3.35
// @license MIT
// @description  market tools
// @author       You
// @require      https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408960/torn-tools.user.js
// @updateURL https://update.greasyfork.org/scripts/408960/torn-tools.meta.js
// ==/UserScript==

$(document).ready(function(){
    'use strict';

    allPages();

    if(window.location.pathname == '/imarket.php'){
        itemMarket();
        vaultControl();
    } else if(window.location.pathname == '/pmarket.php'){
        pointsMarket();
        vaultControl();
    } else if(window.location.href == 'https://www.torn.com/bazaar.php#/add'){
        bazaarAdd();
        vaultControl();
    } else if(window.location.pathname == '/bazaar.php'){
        bazaar();
        vaultControl();
    } else if(window.location.href == 'https://www.torn.com/shops.php?step=bitsnbobs'){
        bitsnbobs();
    } else if(window.location.href == 'https://www.torn.com/shops.php?step=docks'){
        docks();
        vaultControl();
    } else if(window.location.href == 'https://www.torn.com/shops.php?step=pawnshop'){
        pawnshop();
        vaultControl();
    } else if(window.location.pathname == '/profiles.php'){
        profile();
    } else if(window.location.href == 'https://www.torn.com/loader.php?sid=highlow'){
        highlow();
    } else if(window.location.href.includes('https://www.torn.com/trade.php#step=addmoney')){
        tradeAddMoney();
    } else if(window.location.href.includes('https://www.torn.com/properties.php#/p=options') && window.location.href.includes('tab=vault')){
        vaultAddMoney();
    } else if(window.location.href.includes('https://www.torn.com/loader.php?sid=keno')){
        keno();
    } else if(window.location.href.includes('https://www.torn.com/loader.php?sid=slots')){
        slots();
    } else if(window.location.href == 'https://www.torn.com/index.php'){
        travelMarket();
    } else if(window.location.href == 'https://www.torn.com/item.php'){
        vaultControl();
    } else if(window.location.href == 'https://www.torn.com/casino.php'){
        vaultControl();
    } else if(window.location.href == 'https://www.torn.com/page.php?sid=stocks'){
        vaultControl();
    }
});

function vaultControl(){
    // controle de vault
    var mainDiv;
    var iVaultControl = setInterval(function(){
        var formMain = $('#websocketConnectionData'); // all pages
        if(formMain.length == 0){return;}

        var vaultTotal = storageGet('fx-vault-total');
        if(vaultTotal == undefined){vaultTotal = 0;} else {vaultTotal = parseInt(vaultTotal/1000000);}        

        if(mainDiv == undefined){
            var html =
                '<strong>Vault:</strong>'+
                ' $<input id="fxVault_get" style="width:50px" type="number">m <a id="fxVaultGetButton" href="#">[Withdraw]</a> | '+
                ' $<input id="fxVault_put" style="width:50px" type="number">m <a id="fxVaultPutButton" href="#">[Deposit]</a> | '+
                ' <a href="#" data-name="fx-vault-total">$'+(vaultTotal)+'m</a>' +
                '<hr class="page-head-delimiter"style="margin-top:10px;">';

            mainDiv = $('<div style="margin-top:10px;margin-bottom:10px"></div>');
            mainDiv.html(html);
            formMain.before(mainDiv);

            var fnStore = function(tipo){
                var v = $("#fxVault_"+tipo).val().replace(/\D/g,'');

                var money = $("span[data-money]").attr('data-money').replace(/\D/g,'');
                if(money == undefined){money = 0;}else{money = parseInt(money/1000000);}

                if(tipo == 'get' && v > vaultTotal){
                    alert("$"+v + "m not available in vault!");
                    return;
                }
                if(tipo == 'put' && v > money){
                    alert("$"+v + "m not available in wallet!");
                    return;
                }

                if(v > 0){
                    var myWindow = window.open('https://www.torn.com/properties.php#/p=options&ID=4019525&tab=vault&_fx'+tipo+'='+(v*1000000),'fx_vault','width=200,height=200');
                    //setTimeout(function(){myWindow.close();}, 5000);
                }
            }

            $("#fxVaultGetButton").click(function(e){e.preventDefault(); fnStore('get');});
            $("#fxVaultPutButton").click(function(e){e.preventDefault(); fnStore('put');});
            $("a[data-name='fx-vault-total']").click(function(e){e.preventDefault(); $('#fxVault_get').val(vaultTotal)});

            $('#fxVault_get').keyup(function(e){if(e.keyCode == 13){fnStore('get');}});
            $('#fxVault_put').keyup(function(e){if(e.keyCode == 13){fnStore('put');}});

            clearInterval(iVaultControl);
        }
    }, 1000);
}

function allPages(){
    $("#barEnergy").click(function(){window.open('gym.php','_self')});
    $("#barNerve").click(function(){window.open('crimes.php','_self')});
    $("#barHappy").click(function(){window.open('properties.php?step=rentalmarket#','_self')});
    $("#barLife").click(function(){window.open('item.php','_self')});
}

function travelMarket(){
    var divMain = $("div.travel-agency-market");

    var iRows = setInterval(function(){
        if(divMain.is(":visible")){
            var maxCarry = $("div.user-info > div > div > div > span:nth-child(4)").html();
            var inputAmount = divMain.find("input.numb[name='amount']:visible");

            for(var iA = 0; iA < inputAmount.length; iA++){
                var inQtt = inputAmount.eq(iA);
                if(inQtt.attr('data-fx-loaded')=='true') continue;
                inQtt.attr('data-fx-loaded','true');
                reactInputHack(inQtt, maxCarry);
                inQtt.focus();
            }
            //clearInterval(iRows);
        }
    }, 1000);
}

function vaultAddMoney(){
    var formMain;

    // monitora saque / deposito
    var iMonitor = setInterval(function(){
        formMain = $(".deposit-box");
        if(formMain.length > 0){
            var vaultGet = new URLSearchParams(window.location.href).get('_fxget'); // saque
            var vaultPut = new URLSearchParams(window.location.href).get('_fxput'); // deposito
            var vaultMoney = parseInt($("span.wvalue").html().replace(/\D/g,''));

            var formObj, vaultVal = 0;
            
            if(vaultGet > 0){ // saque
                formObj = $("form.vault-cont.left");
                vaultVal = parseInt(vaultGet);
                if(vaultVal > vaultMoney) vaultVal = 0;
                vaultMoney -= vaultVal;
            }
            if(vaultPut > 0){ // deposito
                formObj = $("form.vault-cont.right");
                vaultVal = parseInt(vaultPut);
                vaultMoney += vaultVal;
            }

            // atualiza saldo
            storageSet('fx-vault-total', vaultMoney);

            if(formObj !== undefined && vaultVal > 0){
                formObj.find("input[type='text']").val(vaultVal).trigger('input');
                formObj.find("input[type='submit']").trigger('click');
                setTimeout(function(){window.close();}, 1000);
            }

            // monta form
            $("#properties-page-wrap").before('<div style="margin-bottom:10px;"><strong>Auto Deposit:</strong> $<input id="fxMin" size="4" type="text" value="10">m <input id="fxMinOn" type="checkbox" value="S"> <label for="fxMinOn"><font color=red>$ to auto add</font></label><hr class="page-head-delimiter"style="margin-top:10px;"></div>');
            $("#fxMin").keydown(function(){$("#fxMinOn").prop('checked','')});

            clearInterval(iMonitor);
        }
    }, 1000);

    // auto-deposito
    var iLoop = setInterval(function(){
        if(!$("#fxMinOn").is(":checked")) return;

        var money = $("span[class='dvalue']").html().replace(/\D/g,'');
        var minTrigger = $("#fxMin").val().replace(/\D/g,'')*1000000;
        var deposito = parseInt(money/1000000)*1000000;

        if(minTrigger > 0 && parseInt(money) >= parseInt(minTrigger) && deposito > 0){
            var formDeposito = $("form.vault-cont.right");
            formDeposito.find("input[type='text']").val(deposito).trigger('input');
            formDeposito.find("input[type='submit']").trigger('click');

            clearInterval(iLoop);
        }
    }, 1000);
}

function slots(){
    $(".content-title").after('<div style="margin-top:10px;">'+
                              '<button id="fxSlots1k10kA" type="button">[Play 1k/10k(All)]</button>'+
                              '<button id="fxSlots10k" type="button">[Play 10k(All)]</button>'+
                              '</div>');
    // <span id="tokens">7</span>
    var fPlay = function(b1, b2, qt){        
        qt--;
        $("li.betbtn.btn-"+b1).trigger({type:'mousedown', which:1});
        var iLoop = setInterval(function(){
            var tk = parseInt($("#tokens").html().replace(/\D/g,''));
            if(tk <= 0 || qt <= 0){clearInterval(iLoop); return;}
            if(tk%5 == 0){
                $("li.betbtn.btn-"+b2).trigger({type:'mousedown', which:1});
            } else {
                $("li.betbtn.btn-"+b1).trigger({type:'mousedown', which:1});
            }
            qt--;
        }, 4000);
    }
    $("#fxSlots10k").click(function(){fPlay('10k', '10k', 999);});
    $("#fxSlots1k10kA").click(function(){fPlay('1k', '10k', 999);});
}

function keno(){
    $(".content-title").after('<div style="margin-top:10px;">'+
                              '<button id="fxKenoRandom6" type="button">[Random 6]</button>'+
                              '<button id="fxKenoRandom7" type="button">[Random 7]</button>'+
                              '<button id="fxKenoRandom8" type="button">[Random 8]</button>'+
                              '<button id="fxKenoRandom9" type="button">[Random 9]</button>'+
                              '</div>');
    var fRandom = function(qt){
        $("#clearBtn").click();
        var selecionados = [];
        while(qt > 0){
            var r = parseInt((Math.random()*80)+1);
            if(!selecionados.includes(r)){
                $("span#keno_item_"+r).click();
                qt--;
                selecionados.push(r);
            }
        }
    }
    $("#fxKenoRandom6").click(function(){fRandom(6);});
    $("#fxKenoRandom7").click(function(){fRandom(7);});
    $("#fxKenoRandom8").click(function(){fRandom(8);});
    $("#fxKenoRandom9").click(function(){fRandom(9);});
}

function tradeAddMoney(){
    setTimeout(function(){
        $(".input-money-group").after('&nbsp;&nbsp;&nbsp;&nbsp;<input id="fxMinOn" type="checkbox" value="S"><input id="fxMin" size="12" type="text" value="10.000.000"> <font color=red>$ to auto add</font>');
        $("#fxMin").keydown(function(){$("#fxMinOn").prop('checked','')});
    }, 1000);

    var iLoop = setInterval(function(){
        if(!$("#fxMinOn").is(":checked")) return;

        $(".input-money-symbol").click(); // add all

        var money = $("input[type='text'].input-money").val().replace(/\D/g,''); // all money
        var minTrigger = $("#fxMin").val().replace(/\D/g,'');

        if(minTrigger > 0 && parseInt(money) >= parseInt(minTrigger)){
            if($("input.torn-btn").is(":enabled")){
                $("input.torn-btn").click();                
            }
        }
    }, 200);
}

function bazaarAdd(){
    // my bazaar sum items
    var iLoopMy = setInterval(function(){  // confirma automaticamente
        var itemList = $("ul.items-cont:visible").find("li");
        if(itemList.length > 0){
            var totalItem = 0;
            for(var bL = 0; bL < itemList.length; bL++){
                var sumObj = itemList.eq(bL).find("div.info-wrap");
                if(sumObj.length > 0){
                    var itemValue = itemList.eq(bL).find("div.info-wrap").html().replace(/\D/g,'');
                    var itemQty   = itemList.eq(bL).find("div.item-amount").html().replace(/\D/g,'');
                    if(sumObj.data('fx-sum')==undefined){
                        sumObj.data('fx-sum', 'true');
                        sumObj.append(' (<font color=red>$'+formatNumberA(itemValue*itemQty)+'</font>)');
                        totalItem += (itemValue*itemQty);
                    }
                }
            }
            if(totalItem > 0){
                $("h4[class^='title___']").html('Bazaar (<font color=red>$'+formatNumberA(totalItem)+'</font>)'); //<div class="items-footer clearfix" data-reactid=".0.4"></div>
            }
        }
    }, 1000);
}

function highlow(){
    var myDivMain = $("div.content-wrapper")
    var myDivControl = myDivMain.append('<div style="margin-top:30px;"><select id="fxAutoPlayHL"><option value="N">Auto Play - OFF</option><option value="S">Auto Play - ON</option></select></div>');
    var myDivInfo = myDivMain.append('<div style="margin-top:30px;">');

    myDivInfo.append('Script running...');

    var escolha = '';
    var cpuCard = '';
    var youCard = '';
    var val_cpuCard = 0;
    var val_youCard = 0;    

    var iLoop = setInterval(function(){
        var btnStart = $("span.btn-title:contains('START')");
        var btnContinue = $("div.continue");
        var btnLower = $("span:contains('Lower')");
        var btnHigher = $("span:contains('Higher')");
        var tokens = $(".tokens").html();
        var autoOff = $("#fxAutoPlayHL").val()=='N';

        if(autoOff){return;}

        if(btnStart.is(':visible') || tokens == 0){
            myDivInfo.append(' | <strong>tokens: '+tokens+'</strong>');
            btnStart.click();
        }

        cpuCard = $(".dealer-card").find(".rating").html();
        youCard = $(".you-card").find(".rating").html();

        val_cpuCard = cpuCard;
        if(val_cpuCard == 'J') val_cpuCard = 11;
        if(val_cpuCard == 'Q') val_cpuCard = 12;
        if(val_cpuCard == 'K') val_cpuCard = 13;
        if(val_cpuCard == 'A') val_cpuCard = 14;

        // escolha
        if(btnLower.is(':visible') && btnHigher.is(':visible')){
            if(val_cpuCard >= 8){ // 2,3,4,5,6,7  ,8,  9,10,11,12,13,14
                btnLower.click();
                escolha = 'lower';
            } else {
                btnHigher.click();
                escolha = 'higher';
            }            
        }

        // auto-continue
        if(btnContinue.is(':visible')){
            val_youCard = youCard;
            if(val_youCard == 'J') val_youCard = 11;
            if(val_youCard == 'Q') val_youCard = 12;
            if(val_youCard == 'K') val_youCard = 13;
            if(val_youCard == 'A') val_youCard = 14;

            if(youCard && youCard != ''){
                myDivInfo.append(' | ' + cpuCard + '/' + youCard + ' ' + $(".win-info").html());
            }
            btnContinue.click();
        }
    }, 1500);
}

function pawnshop(){ // https://www.torn.com/profiles.php?XID=2637524
    var objSpan = $('<font color=red>').appendTo("form[action='pointsell.php?step=points']");
    var inputQtt = $(".input-money[type=text]");
    inputQtt.val(50).change(function(){
        var qtt = $(this).val().replace(',','');
        objSpan.html('$' + formatNumber(qtt * 45000));
    }).trigger('change');

    // total points
    var points = $("#pointsPoints").parent().find("span.value___2EvPm").html();

    // show some sell values
    if(points > 0){
        $("#skip-to-content").append('<font color=red>($' + formatNumber(points * 45000) + ')</font>')

        $("div.sell-points").append('<br>');
        $("div.sell-points").append('<hr>');
        $("div.sell-points").append('<br>');

        var somas = '<font color=red>';
        for(var p = 50; p < points; p = p + 50){
            somas += 'x'+(p)+' = $'+(formatNumber(p * 45000))+'<br>';
        }
        somas += '</font>';
        $("div.sell-points").append(somas);
    }
}

function profile(){ // https://www.torn.com/profiles.php?XID=2637524
    var lastStatus = '';

    var iLoop = setInterval(function(){
        var status = $(".main-desc").html().trim();
        status = status.split(' for ')[0]; // In hospital for (remove countdown)
        var userName = $(".user-info-value").find(".bold").html();

        if(lastStatus !== '' && lastStatus !== status){
            notify(userName + " - Status Change: " + lastStatus + ' -> ' + status);
            clearInterval(iLoop);
        }
        lastStatus = status;
        console.log(userName + " - Status: " + status);
    }, 5000);
}

function docks(){
    npcSellTotal();
}

function npcSellTotal(){
    var mainDiv = $("div.sell-items-wrap");
    var itemList = mainDiv.find("li[data-id]:visible"); // <ul class="sell-items-list">
    var totG = 0;

    for(var a = 0; a < itemList.length; a++){
        var qt = itemList.eq(a).find('input[name="amount"]').attr('data-max');
        var vl = itemList.eq(a).find('li.value').html();
        vl = vl.replace(/\D/g,'');
        var tot = qt * vl;
        totG += tot;

        itemList.eq(a).find("li.desc").append(' <font color=red>($' + formatNumber(tot) + ')</font>');
    }

    mainDiv.find('ul.sell-act').find("li.sell").append(' <font color=red>(Total: $' + formatNumber(totG) + ')</font>')
}

function bitsnbobs(){
    // hide itens !=  (grenade, heg, throwing knife, fire hidrant, afro comb, Maneki Neko, Yucca Plant)
    var divSell = $("div.sell-items-wrap");
    var iSell = divSell.find("li[data-item]");
    for(var s = 0; s < iSell.length; s++){
        var iID = iSell.eq(s).data('item');
        if(iID == 220 || iID == 242 || iID == 257 || iID == 410 || iID == 406 || iID == 279 || iID == 409) continue;
        iSell.eq(s).hide(); //find('input[name="amount"]').attr('disabled','disabled');
    }
    //<button class="wai-btn">Select All</button>
    divSell.find("li.select").hide();

    // destaca beer
    $("span#180-name").css('color','red');
    $("span#180-price").css('color','red');
    $("span#180-stock").css('color','red');

    var buyClicked = false;
    var iLoop = setInterval(function(){
        var mainDiv = $("div.buy-items-wrap"); // <div class="buy-items-wrap">
        var iAmount = mainDiv.find("input[name='buyAmount[]']"); // <input id="186" type="text" value="1" maxlength="3" name="buyAmount[]" autocomplete="new-amount">
        for(var a = 0; a < iAmount.length; a++){
            if(iAmount.eq(a).val() == 1){
                iAmount.eq(a).val(100);
            }
        }

        // auto buy beer
        if(!buyClicked && $("input#180").parent().find("button:contains('Buy')").length > 0){
            $("input#180").parent().find("button:contains('Buy')").click();
            buyClicked = true;
        }

        var btnYes = mainDiv.find("a:contains('Yes'):visible"); // <a href="#" class="wai-support yes m-right10 bold t-blue h" data-id="97">Yes</a>
        if(btnYes.length == 1){
            btnYes.click();
        }
    }, 400);

    // shot tct
    var objTime = $("div.title-black[role=heading]");
    var objText = objTime.html();
    var iLoopTCT = setInterval(function(){
        var tct = $(".server-date-time").html(); // Fri 14:04:57 - 22/01/21
        if(tct) tct = tct.split(' - ')[0].split(' ')[1];
        objTime.html(objText + " (TCT: "+tct+")");
        // auto buy
        var buyTime = tct.split(':');
        if((buyTime[1]=='00' || buyTime[1]=='15' || buyTime[1]=='30' || buyTime[1]=='45') && (buyTime[2]=='07')){
            window.location.reload();
        }
    }, 1000);

    npcSellTotal();    
}

function pointsMarket(){
    var marketValue = $("#quantity-price[type=text]").val();
    if(marketValue !== undefined){
        marketValue = parseInt(marketValue.replace(',',''));
    } else {
        marketValue = 45000;
    }
    marketValue += 100;

    $("#skip-to-content").append('<font color=red>($' + formatNumber(marketValue) + ' | ' + (((marketValue-45000)/45000)*100).toFixed(2) + '%)</font>')

    var iLoop = setInterval(function(){
        var aYes = $("ul.users-point-sell").find("a:contains('Yes'):visible");

        if(aYes.length == 1){
            aYes.click(); // confirma automaticamente
        }
    }, 100);
}

function itemMarket(){
    var itemID = new URLSearchParams(window.location.href).get('type');

    var iLoopG = setInterval(function(){
        var obj = $('div.msg[role="alert"]');
        if(obj.length > 0){
            var money = $("span[data-money]").attr('data-money').replace(/\D/g,'');
            var vNPC = new URLSearchParams(window.location.href).get('_fxn'); // valor do npc
            var vOfe = new URLSearchParams(window.location.href).get('_fxv'); // valor ofertado
            var qOfe = new URLSearchParams(window.location.href).get('_fxq'); // quantidade ofertada
            var htmlTxt = '<a href="https://www.torn.com/bazaar.php#/add">Bazaar</a>'
            if(vNPC !== null){
                htmlTxt += " | <strong>Sell:</strong> $"+formatNumber(parseInt(vNPC));
            }
            if(vOfe !== null){
                var necessarioSacar = parseInt(vOfe)*parseInt(qOfe) - money;
                if(necessarioSacar > 0){
                    htmlTxt += " | <strong>Need:</strong> <font color='red'>$"+formatNumberA(necessarioSacar)+'</font>';
                }
            }
            obj.html(htmlTxt);            
        }
    }, 500);

    // destaque no bazaar
    var iLoopV = setInterval(function(){
        var vParam = new URLSearchParams(window.location.href).get('_fxv'); // valor a destacar
        if(vParam == undefined || vParam==null) return;
        if($("ul.guns-list").is(':visible')){
            var ulBazaar = $("ul.guns-list").find("li");
            for(var j = 0; j < ulBazaar.length; j++){
                if(ulBazaar.eq(j).html()=="") break;
                var vBazaar = ulBazaar.eq(j).find(".price").html().split(" <")[0].replace(/\D/g,''); // $59,895 <span class="stock t-gray-9">(73)</span>
                if(parseInt(vParam) >= parseInt(vBazaar)){
                    ulBazaar.eq(j).find(".price").css('color','red')
                }
            }
            //clearInterval(iLoopV);
        }
    }, 500);

    // destaque no market
    var iLoopM = setInterval(function(){
        var vParam = new URLSearchParams(window.location.href).get('_fxv'); // valor a destacar
        if(vParam == undefined || vParam==null) return;
        if($("ul.items").is(':visible')){
            var ulItems = $("ul.items").find("ul.item");
            for(var i = 0; i < ulItems.length; i++){
                var vMarket = ulItems.eq(i).find("li.cost").html().replace(/\D/g,'');
                if(parseInt(vParam) >= parseInt(vMarket)){
                    ulItems.eq(i).find("li.cost").css('color','red');
                }
            }
            //clearInterval(iLoopM);
        }
    }, 500);

    var iLoop = setInterval(function(){  // confirma automaticamente
        if($("a[data-action='buyItemConfirm']:visible")){
            $("a[data-action='buyItemConfirm']:visible").trigger('click');
        }
    }, 100);
}

function bazaar(){
    var blackFriday = false;
    var sortByVal = 0;

    var iLoop = setInterval(function(){
        var divBazaar = $("#bazaarRoot");
        var qttInput = divBazaar.find("input[class^='numberInput___']"); // <input type="text" class="numberInput___1-rmF buyAmountInput___1yrv8" aria-label="Amount of Honda Accord" value="1">
        var sortVal = $("button:contains('Value')");
        var isMobile = $("#bazaarRoot").width() < 400;

        // Yes click
        var btnYes = divBazaar.find("button[aria-label='Yes']");
        if(btnYes.length == 1){
            btnYes.click();
            return;
        }

        // red color on $1 item / show sum
        var objName = divBazaar.find("[class^='name___']");
        for(var a = 0; a < objName.length; a++){
            var cObj = objName.eq(a);
            if(cObj.attr('fx-tool')=='true') continue;
            cObj.attr('fx-tool','true');
            var preco = divBazaar.find("[class^='price___']").eq(a).html().replace(/\D/g,'');
            if(preco == 1){
                cObj.css('color','red');
            }
        }

        if(blackFriday && sortVal.length == 1 && sortByVal < 1){ // sort by value (black friday)
            sortVal.click();
            sortByVal++;
            return;
        }

        var money = $("span[data-money]").attr('data-money').replace(/\D/g,'');

        if(!isMobile && qttInput.length == 1){
            var objPrice = divBazaar.find("span[class^='price___']");
            if(objPrice == undefined)objPrice = divBazaar.find("p[class^='price___']");
            var buyButton = $("button[class^='buy___']");
            if(objPrice == undefined || objPrice.html()==undefined) return;
            var price = objPrice.html().replace(/\D/g,'');            
            var qttMax = divBazaar.find("span[class^='amount___']").html().replace(/\D/g,'');//<span class="amount___1G62R infoLine___1fPlB">(7 in stock)</span>
            var myMax = parseInt(money/price); // buy all
            if(blackFriday) myMax = (qttMax>1?parseInt(qttMax/2):1); // buy half
            if(myMax > qttMax) myMax = qttMax;
            if(myMax == 0){
                reactInputHack(qttInput, 0);
            } else if(qttInput.val()==0){
                reactInputHack(qttInput, 1);
            } else if(qttInput.val()==1){
                reactInputHack(qttInput, myMax);
            }
            if(price == 1 && buyButton.length == 1){
                buyButton.click();
            }
        }

        if(isMobile) { // mobile version
            for(var i = 0; i < qttInput.length; i++){
                if(qttInput.eq(i).attr('fx-tool')=='true') continue;
                qttInput.eq(i).attr('fx-tool','true');
                objPrice = $("p[class^='price___']").eq(i);
                price = objPrice.html().replace(/\D/g,'');
                //qttMax = qttInput.eq(i).attr('max');
                qttMax = $("span[class^='amountValue___']").eq(i).html().replace(/\D/g,'');
                myMax = parseInt(money/price); // buy all
                if(blackFriday) myMax = (qttMax>1?parseInt(qttMax/2):1); // buy half
                if(myMax > qttMax) myMax = qttMax;
                if(myMax == 0){
                    reactInputHack(qttInput.eq(i), 0);
                } else if(qttInput.eq(i).val()==0){
                    reactInputHack(qttInput.eq(i), 1);
                } else if(qttInput.eq(i).val()==1){
                    reactInputHack(qttInput.eq(i), myMax);
                }                                
            }
        }
    }, 200);
}

// HACK to simulate input value change
// https://github.com/facebook/react/issues/11488#issuecomment-347775628
function reactInputHack(inputjq, value) {
    // get js object from jquery
    const input = $(inputjq).get(0);

    let lastValue = 0;
    input.value = value;
    let event = new Event('input', { bubbles: true });
    // hack React15
    event.simulated = true;
    // hack React16 ?????descriptor??value,??????
    let tracker = input._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    input.dispatchEvent(event);
}

// ------------------------------------------

function removeHtmlTags(str){
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
    return str.replace(/<[^>]*>/g, '');
}

function notify(msg) {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {
        var notification = new Notification(msg);
    }
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                var notification = new Notification(msg);
            }
        });
    }
}

function formatNumber(n){
    return numeral((n).toFixed(0)).format('0,0');
}

function formatNumberA(n){
    return numeral((n).toFixed(0)).format('0,0[.]00a');
}


function randomInt(min,max) {
    return min + Math.floor(((max+1) - min) * Math.random());
}
function storageSet(name, value){
    window.localStorage.setItem(name, value);
}
function storageGet(name){
    return window.localStorage.getItem(name);
}