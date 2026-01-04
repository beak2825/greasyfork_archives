// ==UserScript==
// @name         Farm RPG QoL
// @namespace    http://tampermonkey.net/
// @version      1.10
// @license MIT
// @description  Tools
// @author       Fox
// @require      https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js
// @match        https://farmrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458040/Farm%20RPG%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/458040/Farm%20RPG%20QoL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // remove logo
    $("body > div.views > div.panel.panel-left.panel-cover > div > div.pages > div > div > div:nth-child(2) > img").remove();

    // monta menu
    $("div.panel-left").find("ul").append('<li><a href="/town.php" data-view=".view-main" class="item-link close-panel"><div class="item-content"><div class="item-inner"><div class="item-title" style="color:orange"><i class="fa fa-fw fa-building"></i>&nbsp; Town_</div></div></div></a></li>');
    $("div.panel-left").find("ul").append('<li><a href="/quests.php" data-view=".view-main" class="item-link close-panel"><div class="item-content"><div class="item-inner"><div class="item-title" style="color:orange"><i class="fa fa-fw fa-user"></i>&nbsp; Quests_</div></div></div></a></li>');
    $("div.panel-left").find("ul").append('<li><a href="/explore.php" data-view=".view-main" class="item-link close-panel"><div class="item-content"><div class="item-inner"><div class="item-title" style="color:orange"><i class="fa fa-fw fa-globe"></i>&nbsp; Explore_</div></div></div></a></li>');
    $("div.panel-left").find("ul").append('<li><a href="/fish.php" data-view=".view-main" class="item-link close-panel"><div class="item-content"><div class="item-inner"><div class="item-title" style="color:orange"><i class="fa fa-fw fa-arrow-right"></i>&nbsp; Fishing_</div></div></div></a></li>');

    // footer info
    $("#homebtn").before('<a href="#" class="link fxFooterAction" style="font-size:11px;color:orange"></a>');

    var _myFarmId = 204588;
    var _iPagina;
    var _iPagina2;
    var _iTimer;
    var _iAcao;
    var _paginaUlt;
    var _maxInv = storageGet('maxInv', 800);

    // loop principal
    setInterval(function(){
        var pagina = window.location.href;

        // verifica alteracao de pagina
        if(_paginaUlt == undefined || pagina !== _paginaUlt){
            _paginaUlt = pagina;
            //console.log(pagina);
          
            paginaAlterada(pagina);
            funcaoPagina(pagina);
        }
        modalClicker();
    }, 1000);

    function modalClicker(){
        modalAutoYes("Sell");
        modalAutoYes("Use");
        modalAutoYes("Really eat ALL apples?");
        modalAutoYes("Crops will complete");
        modalAutoYes("Seeds?");
        modalAutoYes("Cook");
        modalAutoYes("Trade");
    }

    // ao trocar de pagina
    function paginaAlterada(pagina){
        clearInterval(_iPagina);
        clearInterval(_iPagina2);
        clearInterval(_iAcao);
        _iAcao = undefined;
        $(".fxFooterAction").unbind('click').html('');
        selectorClick("span.modal-button:contains('OK')");
    }

    // keymap
    function selectorClick(jqSelector){
        if($(jqSelector).length > 0){
            $(jqSelector).click();
        }
    }

    $(document).keypress(function(e) {
        console.log("keypress = " + e.which);
        if(e.which == 13 || e.which == 32) { // ENTER ou ESPACO
            selectorClick("#exploreconsole");
            selectorClick(".fishcaught");
        }
        if(e.which == 113) { // q
            selectorClick("span:contains('Back')");
        }
    });

    // funcao especificas de pagina
    function funcaoPagina(pagina){
        if(pagina.includes('item.php')){
            paginaItem();
        } else if(pagina.includes('bank.php')){
            paginaBank();        
        } else if(pagina.includes('allpetitems.php')){
            paginaPetItens();
        } else if(pagina.includes('xfarm.php')){
            paginaFarm();
        } else if(pagina.includes('fishing.php')){
            paginaFishing();
        } else if(pagina.includes('area.php')){
            paginaArea();
        } else if(pagina.includes('postoffice.php')){
            paginaPostoffice();        
        } else if(pagina.includes('kitchen.php')){
            paginaKitchen();
        } else if(pagina.includes('location.php')){
            paginaLocation();
        } else if(pagina.includes('store.php')){
            paginaStore();
        } else if(pagina.includes('supply.php')){
            paginaSupply();
        } else if(pagina.includes('rfc.php')){
            paginaRFC();
        }
    }
    function paginaRFC(){
        setInterval(()=>{
            $("li div:contains('Sturdy') input.inlineinputsm").val(199);
        },500)
    }

    function paginaSupply(){
        $("li.close-panel").has("button.btnblue").hide(); // unlocked
        $("li.close-panel").has("button.btnred").hide(); // locked
    }

    function paginaStore(){
        for(let i = 0; i < $("input.qty[data-id]").length-3; i++){
            // max <button class="maxqty cmaxbtn" data-max="966" data-id="28">+MAX</button>
            var sMax = $("button.maxqty").eq(i).attr("data-max");
            var sAtu = $("input.qty[data-id]").eq(i).val();
            $("button.maxqty").eq(i).html("Max " + sMax);
            sAtu = sAtu*10;
            if(sAtu > sMax) sAtu = sMax;
            $("input.qty[data-id]").eq(i).val(sAtu);
        }
    }

    function paginaLocation(){
        if(!_paginaUlt.includes("id=10")) return; // Whispering Creek
        if($("#fxLocationAct").length > 0) return;
        $("a.btngreen:contains('Explore this Location')").parent().append('<p style="margin-top:2"><a id="fxLocationAct" href="#" class="button btnorange">Consume itens from this Location</a></p>');        

        var obterQtdItem = function(id){
            var q = $("#fireworks a[href='item.php?id="+id+"']").parent().find("span").html();
            return q.split(' / ')[0].replace(',','');
        }
        var obterQtdMax = function(){
            var q = $("#fireworks a[href^='item.php']").eq(0).parent().find("span").html();
            q = q.split(' / ')[1].replace(',','');
            storageSet('maxInv', q);
            return q;
        }
        var venderItem = function(itemId, sellAll){
            var maxQtd = obterQtdMax();
            var qtdManter = parseInt(maxQtd*0.75); // mantem 2/3
            var qtd = obterQtdItem(itemId);
            if(!sellAll){
                if(qtd > qtdManter) qtd = qtd - qtdManter; else qtd = 0;
            }
            if(qtd > 0){
                ajaxCall('sellitem',"&id="+itemId+"&qty="+qtd);
            }
        }
        var doarItem = function(itemId, to){
            var qtd = obterQtdItem(itemId);
            if(qtd > 0){
                ajaxCall('givemailitem',"&id="+itemId+"&to="+to+"&qty="+qtd);
            }
        }

        $("#fxLocationAct").click(()=>{
            $(this).attr("disabled", true);
            if(_paginaUlt.includes("id=10")){ // Whispering Creek                
                var promises = new Array();
                promises.push(venderItem(303, true)); // Oak
                promises.push(venderItem(314)); // Blue Gel
                promises.push(venderItem(319)); // RedBerry
                promises.push(venderItem(320)); // Striped Feather
                promises.push(venderItem(321)); // Thorns
                promises.push(venderItem(322)); // Sour Root

                promises.push(doarItem(302, 22442)); // slimestone to cecil
                Promise.all(promises).then((values) => {
                    setTimeout(()=>{
                        mainView.router.refreshPage();
                    }, 1000);
                });
            }
        });
    }

    function paginaKitchen(){
        var ovenCall = function(method, ovenNum, obj){
            if(obj.length == 0) return new Promise((resolve)=>{resolve();});
            sleep(500);
            return new Promise((resolve)=>{
                $.ajax({url:"worker.php?go="+method+"&oven="+ovenNum, method:"POST"}).done(function(data){
                    console.log('[fx-oven-'+ovenNum+'] '+method+': '+data);
                    if(obj) obj.remove();
                    resolve(data);
                });
            })
        }
        var totalOvens = $("a[href^='oven.php']").length;
        var currOven = 1;
        var fTask = function() {
            var obj = $("a[href^='oven.php']:not(.fxOk)").eq(0);
            if(obj.length == 0) return;
            var ovenNum = currOven;
            var objStir = obj.find("img[alt='Ready to Stir']"); // stirmeal
            var objTaste = obj.find("img[alt='Ready to Taste']"); // tastemeal
            var objSeason = obj.find("img[alt='Ready to Season']"); // seasonmeal
            var objReady = obj.find("span[data-countdown-to]:contains('Completed')"); // cookready

            ovenCall('cookready', ovenNum, objReady).then(()=>{
                ovenCall('stirmeal', ovenNum, objStir).then(()=>{
                    ovenCall('tastemeal', ovenNum, objTaste).then(()=>{
                        ovenCall('seasonmeal', ovenNum, objSeason).then(()=>{
                            obj.addClass('fxOk');
                            if(currOven < totalOvens){
                                currOven++;
                                fTask();
                            } else {
                                return;
                            }

                        });
                    });
                });
            });
        };
        setTimeout(fTask,500);
    }

    function paginaPostoffice(){
        autoFooter();

        _iPagina = setInterval(function(){
            if(autoFooterOn()){
                $("div:contains('Check again')").click();
                $("div:contains('Collect All Mail Items')").click();
            }
        },randomInt(2000,4000));
    }


    function paginaFishing(){
        _iPagina = setInterval(function(){
            var mainObj = $('#fireworks > div.pages > div.page.page-on-center > div > div.content-block > div.content-block > div');
            if(mainObj.length == 0) return;
            if($("#fxAutoFish").length > 0) return;
            mainObj.prepend('<div id="fxAutoFish" class="button btnorange disable-select" data-mult="1" data-location="8" style="font-size:11px;line-height:20px;height:60px;color:orange"><img src="/img/items/29_sm.png" style="width:14px;vertical-align:middle"> <strong>Auto Fish_</strong><br><span id="fxAutoLabel">OFF</span></div>');
            //mainObj.append('<div id="fxAutoFishNet" class="button btnorange disable-select" data-mult="1" data-location="8" style="font-size:11px;line-height:20px;height:60px;color:orange"><img src="/img/items/29_sm.png" style="width:14px;vertical-align:middle"> <strong>Net Fish_</strong><br>Cast 10x and Sell</div>');
            $("#fxAutoFishNet").click(function(){
                var maxCast = 10, delayCast = 500; var netCount = $("span.netcount").html();
                $("#fxAutoFishNet").attr("disabled", true);
                if(maxCast > netCount) return;
                for(let i = 0; i < maxCast; i++){
                    setTimeout(()=>{
                        $('.castnetbtnnc').click();
                    }, delayCast*i);
                }
                setTimeout(()=>{
                    ajaxCall('sellalluserfish').then(()=>{
                        $("#fxAutoFishNet").attr("disabled", false);
                        mainView.router.refreshPage();
                    });
                }, delayCast*maxCast);
            });

            $("#fxAutoFish").click(function(){
                if(_iAcao == undefined){
                    _iAcao = setInterval(function(){
                        var qtdIscas = $("#baitarea > div.row > div.col-45 > strong").html();
                        if(qtdIscas == 0){
                            clearInterval(_iAcao);
                            _iAcao = undefined;
                            $("#fxAutoLabel").html("OFF");
                            return;
                        }
                        $("#fxAutoLabel").html("ON");
                        $('.fishcaught').click();
                    },randomInt(1500,3000));
                } else {
                    clearInterval(_iAcao);
                    _iAcao = undefined;
                    $("#fxAutoLabel").html("OFF");
                }
            });            
        },500);
    }


    function paginaArea(){
        _iPagina = setInterval(function(){
            var mainObj = $('#fireworks > div.pages > div.page.page-on-center > div > div > div.card > div > div > ul');
            if(mainObj.length == 0) return;
            if($("#fxAutoExplore").length > 0) return;
            mainObj.append('<li id="fxAutoExplore"><div class="item-content" style="cursor:pointer"><div class="item-media"><img src="/img/items/29_sm.png" class="itemimgsm"></div><div class="item-inner" style="height:50px;color:orange"><div class="item-title">Auto Explorer_</div><div id="fxAutoLabel" class="item-after" style="color:orange">OFF</div></div></div></li>');
            $("#fxAutoExplore").click(function(){
                if(_iAcao == undefined){
                    _iAcao = setInterval(function(){
                        var fullItem = $("#consoletxt").html().includes('border:1px solid gray');
                        var stamina = $('#stamina').html();

                        if(stamina <= 20){
                            clearInterval(_iAcao);
                            _iAcao = undefined;
                            $("#fxAutoLabel").html("OFF");
                            return;
                        }
                        $("#fxAutoLabel").html("ON");
                        $('.explorebtn').find('.item-inner').click();
                    },randomInt(400,600));
                } else {
                    clearInterval(_iAcao);
                    _iAcao = undefined;
                    $("#fxAutoLabel").html("OFF");
                }
            });
            clearInterval(_iPagina);
        },500);
    }

    function paginaFarm(){
        // auto plant
        autoFooter();
        setInterval(()=>{
            if(autoFooterOn()){
                if($("select.seedid").val() == 0) return;
                if($("span.c-progress-bar-fill").length > 0 && $("span.c-progress-bar-fill").attr('style').includes('lime')){
                    $(".harvestallbtn").click();
                    console.log(`[fx-auto] harvest...`);
                    //<a href="#" class="plantseed button" style="width:60px; margin:0 auto" data-farm="204588" data-row="1" data-col="1">Plant</a>
                } else if($("a.plantseed").length > 0){
                    $(".plantallbtn").click();
                    console.log(`[fx-auto] plant...`);
                }
            }
        },2500);

        // auto day tasks
        var fDayTasks = function() {
            if($("i.f7-icons:contains('today')").length > 0){
                var objCalendar = $("i.f7-icons:contains('today')").eq(0);
                var txtTask = objCalendar.parent().parent().html();
                var method = '';

                if(txtTask.includes('Chicken')){method = "petallchickens";}
                else if(txtTask.includes('Cow')){method = "petallcows";}
                else if(txtTask.includes('Pig')){method = "feedallpigs";}
                else if(txtTask.includes('Storehouse')){method = "work";}
                else if(txtTask.includes('Farmhouse')){method = "rest";}
                else if(txtTask.includes('Raptor')){method = "incuallraptors";}

                if(method !== ''){
                    $.ajax({url:"worker.php?go="+method+"&id="+_myFarmId, method:"POST"}).done(function(data){
                        myApp.alert(data, '[fx-tasks] '+method);
                        if(data == 'success'){objCalendar.remove();} else {clearInterval(_iPagina2);}
                    });
                    if(method == 'work'){ // convert xp to silver
                        ajaxCall('convertxps').then((data)=>{myApp.alert(data, '[fx-tasks] convertxps');});
                    }
                }
            } else {
                clearInterval(_iPagina2);
            }
        };
        _iPagina2 = setInterval(fDayTasks, 2000);
    }


    function paginaPetItens(){
        // mostra somente itens full
        if(!window.location.href.includes("from=home")) return;

        $("div.content-block-title:contains('All Items Found')").html("<a id='fxPetShowAll' href='#' style='color:orange'>Show All</a> / <a id='fxPetShowFull' href='#' style='color:orange'>Show Full</a>");

        $("#fxPetShowAll").click(function(){
            $("div[data-page='allpetitems'] li").each(function() {
                if($(this).find("strong[style='color:red']").length == 0) $(this).show();
            });
        });

        $("#fxPetShowFull").click(function(){
            $("div[data-page='allpetitems'] li").each(function() {
                if($(this).find("strong[style='color:red']").length == 0) $(this).hide();
            });
        }).click();
    }


    function paginaBank(){
        $("input.wthamt").val(8000000); // valor default de 8m
    }


    function paginaItem(){
        // quicksell input
        var objInput = $("#fireworks").find("input[type='number'][data-price][class^='quick']");
        if(objInput == undefined) return;

        var isMax = objInput.attr('style') == 'color:red;'; // estoque max
        var qtdAtu = parseInt(objInput.val()); // quantidade atual
        var preco = parseInt(objInput.data('price'));
        var isRare = $("div.item-after:contains('Very Rare')").length > 0 || $("div.item-after:contains('Rare')").length > 0 || $("div.item-after:contains('Uncommon')").length > 0; // item raro

        // calcula estoque total
        $("span:contains('Sell at Farmer')").attr('style','font-size:11px;color:orange').html("Total: "+ formatNumberA(preco * qtdAtu) + " Silver");

        if(_maxInv < qtdAtu){
            storageSet('maxInv', qtdAtu);
        }

        // estoque a manter (75% do max)
        var estManter = parseInt(_maxInv * 0.75);
        if(qtdAtu > estManter){
            objInput.val(qtdAtu - estManter);
        }
    }


    // modal
    function modalAutoOk(modalLabel){
        if(modalLabel == undefined) modalLabel = 'Success!';
        if($("div.modal-in").length > 0 && $("div.modal-title:contains('"+modalLabel+"')").length > 0 && $("span.modal-button:contains('OK')").length > 0){
            $("span.modal-button:contains('OK')").click();
        }
    }

    function modalAutoYes(modalLabel){
        if($("div.actions-modal").length > 0 && $("div.actions-modal-button:contains('Yes')").length > 0 && (modalLabel == undefined || $("div.actions-modal-label:contains('"+modalLabel+"')").length > 0)){
            $("div.actions-modal-button:contains('Yes')").click();
        }
    }

    // ** FUNCOES **
    function objActive(obj, callClick){
        return new Promise((resolve) => {
            var iObj = setInterval(()=>{
                if(obj && obj.length > 0 && obj.is(":visible")){
                    if(callClick){obj.click()};
                    resolve(obj);
                    clearInterval(iObj);
                }
            },200);
        });
    }

    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    function ajaxCall(method,param){
        return new Promise((resolve) => {
            sleep(500);
            var url = "worker.php?go="+method+(param?param:'');
            console.log(`[fx-ajax] ${method}${param}`);
            $.ajax({url:url,method:"POST"}).done(function(data){
                resolve(data);
            });
        });
    }

    function autoFooter(){
        $(".fxFooterAction").html("Auto [Off]");
        $(".fxFooterAction").click(function(e){
            e.preventDefault();
            if($(this).html().includes("Off")){
                $(this).html('Auto [On]');
            } else {
                $(this).html('Auto [Off]');
            }
        });
    }

    function autoFooterOn(){
        return $(".fxFooterAction").html().includes("[On]");
    }

    function alterarTextoCabecalho(texto){
        setTimeout(function(){
            var textoObj = $("#fireworks > div.navbar > div.navbar-inner.navbar-on-center > div.center.sliding");
            var textoOri = textoObj.html();
            textoObj.html(textoOri + ' ' + texto);
        }, 500);
    }

    function alterarTitulo(titulo){
        document.title = "Farm " + titulo;
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

    function formatTimer(s){
        var m = parseInt(s / 60);
        var h = parseInt(m / 60);
        var d = parseInt(h / 24);
        s = parseInt(s % 60);
        m = parseInt(m % 60);
        h = parseInt(h % 24);
        if(d > 0) return d+'d'+h+'h';
        if(h > 0) return h+'h'+m+'m';
        if(m > 0) return m+'m'+s+'s';
        return s+'s';
    }

    function formatNumber(n){
        return numeral((n).toFixed(0)).format('0,0');
    }

    function formatNumberA(n){
        return numeral((n).toFixed(0)).format('0,0[.]0a');
    }

    function randomInt(min,max) {
        return min + Math.floor(((max+1) - min) * Math.random());
    }
    function storageSet(name, value){
        window.localStorage.setItem('fx_'+name, value);
    }
    function storageGet(name, defaulVal){
        var v = window.localStorage.getItem('fx_'+name);
        var d = defaulVal?defaulVal:''
        return (v?v:d);
    }
})();