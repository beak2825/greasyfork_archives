// ==UserScript==
// @name         Ultra Bot Plus
// @namespace    https://greasyfork.org/users/592063
// @version      0.2.2.1
// @description  Complemento para Ultra Bot Plus, aumenta tus ganancias.
// @author       Ultra Bot Plus
// @include      http*://rentabilidadesweb.runkodapps.com/*
// @include      http*://faucetpay.io/*
// @include      http*://expresscrypto.io/*
// @include      http*://payeer.com/en/account/log/*
// @include      http*://digitask.ru/*
// @include      http*://freesteam.io/*
// @include      http*://freenem.com/*
// @include      http*://freecardano.com/*
// @include      http*://coinfaucet.io/*
// @include      http*://freebitcoin.io/*
// @include      http*://freetether.com/*
// @include      http*://freeusdcoin.com/*
// @include      http*://freebinancecoin.com/*
// @include      http*://freeethereum.com/*
// @include      http*://free-tron.com/*
// @include      http*://free-ltc.com/*
// @include      http*://freedash.io/*
// @include      http*://freechain.link/*
// @include      http*://freeneo.io/*
// @include      http*://bigfreegiveaway.com/*
// @include      http*://webflex24.com/*
// @include      http*://rollerbit.net/*
// @include      http*://freegridco.in/*
// @include      http*://popspins.com/*
// @include      http*://randomsatoshi.win/*
// @include      http*://freebitco.in/*
// @include      http*://firefaucet.win/*
// @include      http*://adbtc.top/*
// @include      http*://dogecoin-faucet.biz/*
// @include      http*://tron-faucet.biz/*

// @include      http*://*.freebcc.org/*
// @include      http*://dogemate.com/*
// @include      http*://faupto.com/*
// @include      *theblogcash.in/*
// @include      *.dutchycorp.space/*
// @include      http*://dutchycorp.ovh/*
// @include      *linkdesh.xyz/*
// @include      *.100count.net/*
// @include      http*://100count.net/*
// @include      http*://zagl.info/*

// @include      http*://goldenmines.biz/*
// @include      http*://golden-mines.biz/*
// @include      http*://money-gnomes.pro/*
// @include      http*://money-gnomes.ru/*
// @include      http*://cosmo-sfera.biz/*
// @include      http*://me-farm.me/*
// @include      http*://wood-man.biz/*

// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417168/Ultra%20Bot%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/417168/Ultra%20Bot%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function obtenvariable(variable) {var query = window.location.search.substring(1);var vars = query.split("&");for (var i=0; i < vars.length; i++) {var pair = vars[i].split("=");if(pair[0] == variable) {return decodeURIComponent(pair[1]);}}return '';}
    function aleatorio(min,max) {return Math.round(Math.random() * (max - min) + min);}
    function duerme(milliseconds) {const date = Date.now();let currentDate = null;do {currentDate = Date.now();} while (currentDate - date < milliseconds);}
    var urlbase='rentabilidadesweb.runkodapps.com';
    if(location.hostname==urlbase){
        $(document).ready(function(){
            if(window.location.pathname.indexOf('/ultra-bot-plus')>=0){
                $('input#btnstartstopbot').prop('disabled', false);
                $('div#alertabot').css("display", "none");
            }
            if(window.location.pathname.indexOf('/modulo-digitask')>=0){
                $('input#importardigi').prop('disabled', false);
            }
            if(window.location.pathname.indexOf('/faucetpay')>=0){
                $('input#importarfaucetpay').prop('disabled', false);
                $('input#importarfaucetpay').click(function(){
                    window.location.href='//faucetpay.io/page/user-admin/deposit?r=368874&importar=1';
                });
            }
            if(window.location.pathname.indexOf('/expresscrypto')>=0){
                $('input#importarexpresscrypto').prop('disabled', false);
                $('input#importarexpresscrypto').click(function(){
                    window.location.href='//expresscrypto.io/dashboard?referral=98071&importar=1';
                });
            }
            if(window.location.pathname.indexOf('/payeer')>=0){
                $('input#importarpayeer').prop('disabled', false);
                $('input#importarpayeer').click(function(){
                    window.location.href='//payeer.com/en/account/log/?session=402608&importar=1';
                });
            }
        });
    }

    if(location.hostname=='faucetpay.io'){
        if(obtenvariable('importar')==1){
            if(window.location.pathname.indexOf('/page/user-admin/deposit')>=0){
                sessionStorage.setItem('btc',$('body > div.content.content-fixed > div > div.row.row-xs > div > div.row > div:nth-child(1) > div > div.card-body.text-center > input').val().trim());
                sessionStorage.setItem('doge',$('body > div.content.content-fixed > div > div.row.row-xs > div > div.row > div:nth-child(3) > div > div.card-body.text-center > input').val().trim());
                sessionStorage.setItem('ltc',$('body > div.content.content-fixed > div > div.row.row-xs > div > div.row > div:nth-child(4) > div > div.card-body.text-center > input').val().trim());
                sessionStorage.setItem('bch',$('body > div.content.content-fixed > div > div.row.row-xs > div > div.row > div:nth-child(5) > div > div.card-body.text-center > input').val().replace('bitcoincash:', '').trim());
                sessionStorage.setItem('dash',$('body > div.content.content-fixed > div > div.row.row-xs > div > div.row > div:nth-child(6) > div > div.card-body.text-center > input').val().trim());
                sessionStorage.setItem('dgb',$('body > div.content.content-fixed > div > div.row.row-xs > div > div.row > div:nth-child(7) > div > div.card-body.text-center > input').val().trim());
                sessionStorage.setItem('trx',$('body > div.content.content-fixed > div > div.row.row-xs > div > div.row > div:nth-child(8) > div > div.card-body.text-center > input').val().trim());
                sessionStorage.setItem('usdt',$('body > div.content.content-fixed > div > div.row.row-xs > div > div.row > div:nth-child(9) > div > div.card-body.text-center > input').val().trim());
                location.replace('//'+window.location.hostname+'/account/settings?importar=1');
            }
            if(window.location.pathname.indexOf('/account/settings')>=0){
                location.replace('//'+urlbase+'/faucetpay?fpemail='+$('input[name=email]').val().trim()+'&fpbtc='+sessionStorage.getItem("btc")+'&fpdoge='+sessionStorage.getItem("doge")+'&fpltc='+sessionStorage.getItem("ltc")+'&fpbch='+sessionStorage.getItem("bch")+'&fpdash='+sessionStorage.getItem("dash")+'&fpdgb='+sessionStorage.getItem("dgb")+'&fptrx='+sessionStorage.getItem("trx")+'&fpusdt='+sessionStorage.getItem("usdt"));
            }
        }else{
            if(window.location.pathname.indexOf('/page/user-admin')>=0){
                if(document.referrer.indexOf(urlbase)>=0){
                    $(document).ready(function(){try{window.close();}catch(e){}});
                }
            }
        }
    }
    if(location.hostname=='expresscrypto.io'){
        if(obtenvariable('importar')==1){
            if(window.location.pathname.indexOf('/dashboard')>=0){
                location.replace('//'+urlbase+'/expresscrypto?ecid='+$('u#copyIdTarget.glow').html().trim());
            }
        }
    }
    if(location.hostname=='payeer.com'){
        if(obtenvariable('importar')==1){
            if(window.location.pathname.indexOf('/en/account/log/')>=0){
                location.replace('//'+urlbase+'/payeer?payeerid='+$('a#PayeerAccount').attr('data-clipboard-text').trim());
            }
        }
    }
    if(location.hostname=='digitask.ru'){
        async function autoclick() {
            if(window.location.pathname.indexOf('/notimer_fp')>=0){
                if(obtenvariable('fpdoge')!=null){$('form > div > input[type=text]:nth-child(1)').val(obtenvariable('fpdoge'));}
                if(obtenvariable('importar')==1){$('form').append( "<input type='hidden' name='guardarurl' value='1'>");}
            }
            if(window.location.pathname.indexOf('/notimer_fp/faucet.php')>=0){
                if(obtenvariable('guardarurl')=='1'){
                    location.replace('//'+urlbase+'/modulo-digitask?digitaskurl='+encodeURIComponent(window.location.href));
                }else{
                    $(document).ready(function(){try{window.close();}catch(e){}});
                }
            }
        }
        autoclick();
    }
    if(location.hostname=='freesteam.io' || location.hostname=='freebitcoin.io' || location.hostname=='freecardano.com' || location.hostname=='freeusdcoin.com' || location.hostname=='freebinancecoin.com' || location.hostname=='freeethereum.com' || location.hostname=='freechain.link' || location.hostname=='freedash.io' || location.hostname=='freeneo.io' || location.hostname=='coinfaucet.io' || location.hostname=='freenem.com' || location.hostname=='free-tron.com' || location.hostname=='free-ltc.com' || location.hostname=='freetether.com'){
        async function autoclick() {
            if(window.location.pathname.indexOf("/free")>=0){
                setInterval(function(){
                    if($("button.main-button-2.roll-button.bg-2").is(':visible')==true){$("button.main-button-2.roll-button.bg-2").click();$("button.main-button-2.roll-button.bg-2").hide();}else{if($("div > div.minutes").is(':visible')==true){$(document).ready(function(){try{window.close();}catch(e){}});}else{location.reload(true);}}
                },10000);
            }
        }
        autoclick();
    }
    if(location.hostname=='bigfreegiveaway.com'){
        async function autoclick() {
            if(window.location.pathname.indexOf("/my-tickets")>=0){
                if($('form > button:submit').is(':visible')==true){
                    $('form > button:submit').click();
                    $('form > button:submit').hide();
                }else{$(document).ready(function(){try{window.close();}catch(e){}});}
            }
        }
        autoclick();
    }
    if(location.hostname=='freegridco.in'){
        async function autoclick() {
            setInterval(function(){
                if($("input#roll_button").is(":visible")==true){
                    try {do_free_roll();}catch(e) {}
                }else{if($("p#roll_wait_text").is(":visible")==true){$(document).ready(function(){try{window.close();}catch(e){}});}}
            },3000);
        }
        autoclick();
    }
    if(location.hostname=='popspins.com'){
        async function autoclick() {
            setInterval(function(){
                if($('div[class^="_"]').length > 0){$('div[class^="_"]').click();}//Elimina publicidad inicial
                if($('span#spins').html()!=0){
                    if($('input#playFancy').is(':enabled')==true && $('input#playFancy').is(':visible')==true && $('input#playFancy').val()=='' || $('input#playFancy').val()=='Play'){$('input#playFancy:enabled').click();}
                    var numaleatorio;
                    if($('div#100redblackwrapper').is(':visible')==true){
                        numaleatorio=aleatorio(1,2);
                        if(numaleatorio==1){open_case('red');}else{open_case('black');}
                        $('div#100redblackwrapper').hide();
                    }
                    if($('div#100chestswrapper').is(':visible')==true){
                        numaleatorio=aleatorio(1,3);
                        openChest(numaleatorio);
                        $('div#100chestswrapper').hide();
                    }
                    if($('div#runModal > div > div > div.modal-header > a > span').is(':visible')==true){
                        $('div#runModal > div > div > div.modal-header > a > span').click();
                    }
                }else{
                    if($('div#claimouter').is(':visible')==true){
                        $('div#claimouter > a#requestdaily')[0].click();
                    }else{$(document).ready(function(){try{window.close();}catch(e){}});}
                }
            },5000);
        }
        autoclick();
    }
    if(location.hostname=='randomsatoshi.win'){
        async function autoclick() {
            if(window.location.pathname.indexOf('/autofaucet/claims.php')>=0){
               $(document).ready(function(){try{window.close();}catch(e){}});
            }
        }
        autoclick();
    }
    if(location.hostname=='firefaucet.win'){
        async function autoclick() {
            if(window.location.pathname=='/'){
                if($('body > div.row > div.col.s12.m12.l6 > div > center:nth-child(4) > div:nth-child(6) > div:nth-child(2) > span > b').html()=='0'){
                    $(document).ready(function(){try{window.close();}catch(e){}});
                }
            }
            if(window.location.pathname.indexOf('/payout')>=0 || window.location.pathname.indexOf('/start')>=0){
                $(document).ready(function(){try{window.close();}catch(e){}});
            }
            if(window.location.pathname.indexOf('/shortlinks')>=0){//Pendiente
                $('form').prop('target', '_self');
                if($('form > button:not(.views-completed)').length!=0){
                    $(document).ready(function(){
                        setInterval(function(){
                            $('form > button:not(.views-completed):first').click();
                        },10000);
                    });
                }
                else{
                    $(document).ready(function(){try{window.close();}catch(e){}});
                }
            }
        }
        autoclick();
    }

    //Juegos rusos v
    if(location.hostname=='goldenmines.biz' || location.hostname=='golden-mines.biz' || location.hostname=='cosmo-sfera.biz' || location.hostname=='me-farm.me' || location.hostname=='money-gnomes.ru' || location.hostname=='money-gnomes.pro' || location.hostname=='wood-man.biz'){
        async function autoclick() {
            var temp=0;
            setInterval(function(){
                if(window.location.pathname=='/'){
                    if($(":submit:first").length>0){
                        try{$(":submit:first").click();}catch(e){}
                    }else{
                        try{$("form").submit();}catch(e){}
                    }
                }

                if(window.location.pathname.indexOf('/login')>=0){
                    if($("body").html().indexOf('submit()')>=0){
                        try{$(":button").click();}catch(e){}
                    }else{
                        if($('form').attr('action')!='' && $('form').attr('action')!='#'){
                            try{$("form").submit();}catch(e){}
                        }else{
                            try{$(":submit").click();}catch(e){}
                        }
                    }
                }
                if(window.location.pathname.indexOf('/account')>=0 && window.location.pathname.indexOf('/account/')<0){
                    window.location.href=window.location.href+'/store';
                }
                if($("body").html().indexOf('/store')>=0){//Contiene store
                    if(window.location.pathname.indexOf('/store')>=0){//Clasico
                        if($('form').length==1){
                            if($('form').attr('action')!='' && $('form').attr('action')!='#'){
                                try{$("form").submit();}catch(e){}
                            }else{
                                try{$(":submit").click();}catch(e){}
                            }
                            if(document.referrer==window.location.href || $("div.message--visible_show").is(':visible')==true){
                                window.location.href=window.location.href.replace("store", "market");
                            }
                        }
                        if($('form').length==2){//Ajustar
                            if(sessionStorage.getItem('paso')==null){
                                if(document.referrer==window.location.href || $("div.message--visible_show").is(':visible')==true){sessionStorage.setItem('paso',1);}
                                if($('form:first').attr('action')!='' && $('form:first').attr('action')!='#'){
                                    try{$("form:first").submit();}catch(e){}
                                }else{
                                    try{$(":submit:first").click();}catch(e){}
                                }
                            }
                            if(sessionStorage.getItem('paso')==1){//Boton 2
                                if(document.referrer==window.location.href || $("div.message--visible_show").is(':visible')==true){sessionStorage.setItem('paso',2);}
                                if($('form:last').attr('action')!='' && $('form:last').attr('action')!='#'){
                                    try{$("form:last").submit();}catch(e){}
                                }else{
                                    try{$(":submit:last").click();}catch(e){}
                                }
                            }
                            if(sessionStorage.getItem('paso')==2){
                                if(document.referrer==window.location.href || $("div.message--visible_show").is(':visible')==true){//Reenvio
                                    sessionStorage.removeItem('paso');
                                    window.location.href=window.location.href.replace("store", "bonus");
                                }
                            }
                        }
                    }
                }
                if($("body").html().indexOf('/market')>=0){//Contiene market
                    if(window.location.pathname.indexOf('/market')>=0){
                        if($('form').attr('action')!='' && $('form').attr('action')!='#'){
                            try{$("form").submit();}catch(e){}
                        }else{
                            try{$(":submit").click();}catch(e){}
                        }
                        if(document.referrer==window.location.href || $("div.message--visible_show").is(':visible')==true){
                            window.location.href=window.location.href.replace("market", "bonus");
                        }
                    }
                }
                if($("body").html().indexOf('/bonus')>=0){//Bonos

                    if(window.location.pathname.indexOf('bonus')>=0 && window.location.pathname.indexOf('bonus_')<0 && window.location.pathname.indexOf('bonus1')<0 && window.location.pathname.indexOf('bonus2')<0 && window.location.pathname.indexOf('bonus3')<0){//Bono 24h
                        if($('form').attr('action')!='' && $('form').attr('action')!='#'){
                            try{$("form").submit();}catch(e){}
                        }else{
                            try{$(":submit").click();}catch(e){}
                        }
                        if(document.referrer==window.location.href || $("div.message--visible_show").is(':visible')==true || $(":submit").length<=0 || $(":submit").is(':visible')==false || $(":submit").is(':enabled')==false || $("body").html().indexOf('next')>=0){
                            if($("body").html().indexOf('/bonus_hour')>=0){
                                window.location.href=window.location.href.replace("bonus", "bonus_hour");
                            }
                            if($("body").html().indexOf('/bonus1h')>=0){
                                window.location.href=window.location.href.replace("bonus", "bonus1h");
                            }else{
                                if($("body").html().indexOf('/bonus1')>=0){
                                    window.location.href=window.location.href.replace("bonus", "bonus1");
                                }else{$(document).ready(function(){try{window.close();}catch(e){}});}
                            }

                        }
                    }

                    if(window.location.pathname.indexOf('/bonus_hour')>=0 || window.location.pathname.indexOf('/bonus1')>=0){//Bono 1h - Bono 1
                        if($('form').attr('action')!='' && $('form').attr('action')!='#'){
                            try{$("form").submit();}catch(e){}
                        }else{
                            try{$(":submit").click();}catch(e){}
                        }
                        if(document.referrer==window.location.href || $("div.message--visible_show").is(':visible')==true || $(":submit").length<=0 || $(":submit").is(':visible')==false || $(":submit").is(':enabled')==false  || $("body").html().indexOf('next')>=0){
                            if($("body").html().indexOf('/bonus3h')>=0){
                                window.location.href=window.location.href.replace("bonus1h", "bonus3h");
                            }
                            if($("body").html().indexOf('/bonus2h')>=0){
                                window.location.href=window.location.href.replace("bonus1h", "bonus2h");
                            }else{
                                if($("body").html().indexOf('/bonus2')>=0){
                                    window.location.href=window.location.href.replace("bonus1h", "bonus2");
                                }else{$(document).ready(function(){try{window.close();}catch(e){}});}
                            }
                        }
                    }

                    if(window.location.pathname.indexOf('/bonus2')>=0){//Bono 2
                        if($('form').attr('action')!='' && $('form').attr('action')!='#'){
                            try{$("form").submit();}catch(e){}
                        }else{
                            try{$(":submit").click();}catch(e){}
                        }
                        if(document.referrer==window.location.href || $("div.message--visible_show").is(':visible')==true || $(":submit").length<=0 || $(":submit").is(':visible')==false || $(":submit").is(':enabled')==false  || $("body").html().indexOf('next')>=0){
                            if($("body").html().indexOf('/bonus3h')>=0){
                                window.location.href=window.location.href.replace("bonus2", "bonus3h");
                            }else{
                                if($("body").html().indexOf('/bonus3')>=0){
                                    window.location.href=window.location.href.replace("bonus2", "bonus3");
                                }else{$(document).ready(function(){try{window.close();}catch(e){}});}
                            }
                        }
                    }

                    if(window.location.pathname.indexOf('/bonus3')>=0){//Bono 3h - Bono 3
                        if($('form').attr('action')!='' && $('form').attr('action')!='#'){
                            try{$("form").submit();}catch(e){}
                        }else{
                            try{$(":submit").click();}catch(e){}
                        }
                        if(document.referrer==window.location.href || $("div.message--visible_show").is(':visible')==true || $(":submit").length<=0 || $(":submit").is(':visible')==false || $(":submit").is(':enabled')==false  || $("body").html().indexOf('next')>=0){
                            if($("body").html().indexOf('/bonus4h')>=0){
                                window.location.href=window.location.href.replace("bonus3", "bonus4h");
                            }else{
                                if($("body").html().indexOf('/bonus4')>=0){
                                    window.location.href=window.location.href.replace("bonus3", "bonus4");
                                }else{$(document).ready(function(){try{window.close();}catch(e){}});}
                            }
                        }
                    }

                    if(window.location.pathname.indexOf('/bonus4')>=0){//Bono 4h - Bono 4
                        if($('form').attr('action')!='' && $('form').attr('action')!='#'){
                            try{$("form").submit();}catch(e){}
                        }else{
                            try{$(":submit").click();}catch(e){}
                        }
                        if(document.referrer==window.location.href || $("div.message--visible_show").is(':visible')==true || $(":submit").length<=0 || $(":submit").is(':visible')==false || $(":submit").is(':enabled')==false  || $("body").html().indexOf('next')>=0){
                            $(document).ready(function(){try{window.close();}catch(e){}});
                        }
                    }

                }
            },5000);
        }
        autoclick();
    }
    if(location.hostname=='freebitco.in'){
        async function autoclick() {
            setInterval(function(){
                if($("input#free_play_form_button:submit").is(':visible')==true){
                    $("input#free_play_form_button:submit").click();
                }else{$(document).ready(function(){try{window.close();}catch(e){}});}
            },5000);
        }
        autoclick();
    }
    if(location.hostname=='rollerbit.net'){
        async function autoclick() {
            if(window.location.pathname=='/backoffice/freeroll'){
                setInterval(function(){
                    if($('button#start-roll').is(':visible')==true){
                        try{$('button#start-roll').click();}catch(e){}
                    }else{
                        $(document).ready(function(){window.location.href='//'+urlbase+'/tarea-finalizada';});
                    }
                },5000);
            }
            if(window.location.pathname=='/backoffice/rollerbox'){
                setInterval(function(){
                    if($('div#box-card-0 > div > div:nth-child(2) > div > div > div > button').is(':visible')==true){
                        $('#useFreeboxModal > div > div > form').submit();
                    }else{
                        window.location.href=window.location.href.replace("rollerbox", "freeroll");
                    }
                },5000);
            }
        }
        autoclick();
    }
    if(location.hostname=='adbtc.top'){
        async function autoclick() {
            if(window.location.pathname=='/autosurf/session'){
                if($("body").html().indexOf('target="_blank"')>=0){}else{$(document).ready(function(){try{window.close();}catch(e){}});}
            }
        }
        autoclick();
    }
    if(location.hostname=='dogecoin-faucet.biz' || location.hostname=='tron-faucet.biz'){
        async function autoclick() {
            setInterval(function(){
                if(window.location.pathname=='/' || window.location.pathname=='/auth/'){
                    if($("form").length>0){$('button:submit').click();}
                }
                if(window.location.pathname=='/account/'){
                    window.location.href=window.location.href.replace("account/", "bonus/?act=bon");
                }
                if(window.location.pathname=='/bonus/'){
                    $(document).ready(function(){try{window.close();}catch(e){}});
                }
            },5000);
        }
        autoclick();
    }

    /*Shortlinks Pass*/
    if(location.hostname.indexOf(".freebcc.org")>=0){
        window.location.href=$('button#makingdifferenttimer.btn-captchas').attr('onclick').replace(/ /g, "").substring(70).replace("');",'');
    }
    if(location.hostname.indexOf("zagl.info")>=0){
        if(typeof $('a.btn.btn-primary').attr("href") !== "undefined"){window.location.href='//'+location.hostname+$('a.btn.btn-primary').attr("href");}
    }
    if(location.hostname=='dogemate.com' || location.hostname=='faupto.com' || location.hostname=='linkdesh.xyz'){
        $('button#bdt:submit').click();
    }
    if(location.hostname=='theblogcash.in' || location.hostname=='linkdesh.xyz'){
        $('button#mdt:submit').click();
    }
    if(location.hostname=='100count.net'){
        if($("div#cl1 > a").length > 0){
            window.location.href=$('div#cl1 > a').attr("href");
        }
    }
    if(location.hostname.indexOf(".100count.net")>=0){
        if($('button#mdt:submit').length > 0){
            $('button#mdt:submit').click();
        }
    }
    if(location.hostname.indexOf(".dutchycorp.space")>=0){
        duerme('10000');
        if($("div#cl1 > center > a").length > 0){
            window.location.href=$("div#cl1 > center > a").attr("href");
        }
    }
    if(location.hostname=='dutchycorp.ovh'){
        duerme('10000');
        if($("div#cl0").length > 0){
            showElem('cl1');
        }
        if($("div#cl1").length > 0){
            showElem('cl2');
        }
    }

    /*Anticaptcha*/
    function anticaptcha() {
        if($("div.g-recaptcha").length>=0){//Recaptcha v2 detectado
            $('div.recaptcha-checkbox-checkmark').click();
            if($("button#solver-button").is(':visible')==true){//Captcha requerido
                try{$('button#solver-button').click();}catch(e){}//Hack
            }
        }
        if($("div.h-captcha").length>=0){//Hcaptcha detectado
            $('div#checkbox').click();
        }
    }
})();