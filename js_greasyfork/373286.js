// ==UserScript==
// @name         HumFun2.0 Tool Old Interface (temporally)
// @namespace    http://tampermonkey.net/
// @version      2.7.2
// @description  Añade funcionalidades extras a Humafun!
// @author       Jose Enrique Ayala Villegas
// @match        https://*.humanatic.com/pages/humfun/review.cfm*
// @match        https://*.humanatic.com/pages/humfun/selection_*.cfm*
// @match        https://*.humanatic.com/pages/humfun/category.cfm*
// @match        https://*.humanatic.com/pages/humfun/profile.cfm*
// @match        https://s3.amazonaws.com/gd-images.gooddata.com/customtext/magic.html
// @match        http://*.humanatic.com/pages/humfun/review.cfm*
// @match        http://*.humanatic.com/pages/humfun/selection_*.cfm*
// @match        http://*.humanatic.com/pages/humfun/category.cfm*
// @match        http://*.humanatic.com/pages/humfun/profile.cfm*
// @match        http://s3.amazonaws.com/gd-images.gooddata.com/customtext/magic.html
// @require      https://greasyfork.org/scripts/32322-wavesurfer-tampermonkey/code/WaveSurfer%20-%20Tampermonkey.js?version=212062
// @require      https://cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/1.0.57/plugin/wavesurfer.timeline.min.js
// @connect      generacionenlinea.com
// @connect      www.smsdigital.com.ve
// @connect      s3.amazonaws.com
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/373286/HumFun20%20Tool%20Old%20Interface%20%28temporally%29.user.js
// @updateURL https://update.greasyfork.org/scripts/373286/HumFun20%20Tool%20Old%20Interface%20%28temporally%29.meta.js
// ==/UserScript==
/*jshint multistr: true */
/*jshint -W030 */
window.GMinfo = GM_info;
declareAll();
window.scc = document.createElement('script');
scc.src = location.protocol + "//cdn.datatables.net/1.10.15/js/jquery.dataTables.min.js";
scc.onload = function(){
    console.log('lolo');
    window.desi = setTimeout(function(){$('#tb').DataTable({
        paging: false,
        info: false
    })},1000);
}
document.body.appendChild(scc);
if(document.cookie.indexOf('HUMANATIC_UID') === -1){
    console.log('Arreglando...');
    $.ajax({
        type: 'get',
        url: location.protocol + '//' + document.domain+'/pages/humfun/settings.cfm',
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
elen = new logSkipByFilter();
likeExit = false;
callSending = false;
try{$('body').css({'user-select':'initial'});}catch(e){}

switch(true){
    case location.href.indexOf('.humanatic.com/pages/humfun/selection_all.cfm') !== -1:
        kkd = doCollectSelection;
        $('<link href="https://cdn.datatables.net/1.10.15/css/jquery.dataTables.min.css" type="text/css" rel="stylesheet">').appendTo(document.body);
        doDesingPenality();
        break;
    case location.href.indexOf('.humanatic.com/pages/humfun/review.cfm') !== -1:
        setTimeout(function(){setInterval(infiniteDeclare,100);},1000);
        InitReview();
        break;
    case location.href.indexOf('.humanatic.com/pages/humfun/selection_review.cfm') !== -1:
        doCollectSelection();
        break;
    case location.href.indexOf('.humanatic.com/pages/humfun/category.cfm') !== -1:
        /*$('div.category-selection-button > a[href*="category"]').each(function(){
            this.href = this.href.replace("/?category",".cfm?hcat");
        });*/
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
        setTimeout(getListAcu,1);
        break;
}

function getMM(data){
    data = data === undefined ? $('html') : data;
    var media = null;
    ['Penalty retained','earnings restored','earnings have been restored','penalty remains','earnings updated','penalties lifted','please contact support','earnings ajusted','earnings and penalties will be updated','earnings will be updated','penalties will be updated'].forEach(function(e,n){
        var mm = $('.comment-row:icontains("'+e+'") b',data);
        if( mm.length > 0) {
            media = mm[0].innerText;
        }
    });
    return media?media:'NO';
}

function getMediators(data){
    var arrMediator = {};
    data = data === undefined ? $('html') : data;
    arrMediator['list'] = [];
    var arrListWords = ['Penalty remains','will grant a gray area','penalty stands','penalty retained','earnings*restored','penalty*remains','earnings*updated','penalties lifted','please contact support','earnings ajusted','earnings*updated'];
    mediatorDefault = ['Mhoxu','Voldemort'];
    var arrListMediator = localStorage.getItem('mediatorsList') === null ? mediatorDefault : JSON.parse(localStorage.getItem('mediatorsList'));
    var _arrListMediator = [];
    arrListMediator.forEach(function(e,n){_arrListMediator[n] = arrListMediator[n].toLowerCase();});
    $($('.comment-text.slap',data).get().reverse()).each(function(){
        var that = this;
        var found = false;
        arrListWords.forEach(function(e){
            if(found) return;
            var _mediator = '';
            if(that.parentElement.tagName == 'B'){
                _mediator = that.parentElement.parentElement.getElementsByTagName('b')[0].innerText;
            } else {
                _mediator = that.parentElement.getElementsByTagName('b')[0].innerText;
            }
            var __mediator = _mediator.toLowerCase();
            if(wildcard(that.innerText.trim().toLowerCase(),'*'+e.toLowerCase()+'*') || arrMediator[_mediator] !== undefined || _arrListMediator.indexOf(__mediator) !== -1){
                found = true;
                arrMediator[_mediator] = arrMediator[_mediator] === undefined ? 1 : (arrMediator[_mediator]+1);
                arrMediator['list'].indexOf(_mediator) === -1 ? (arrMediator['list'].push(_mediator)) : '';
            }
        });
    });
    arrListMediator = arrListMediator.concat(arrMediator['list']).unique();
    localStorage.setItem('mediatorsList',JSON.stringify(arrListMediator));
    return arrMediator;
}

function doCollectSelection(data,xhr){
    data = data === undefined ? $('html') : data;
    var myAnw = $('.category_new:has(a[href="profile.cfm?uid='+gID(data)+'"])',data);
    myAnw.insertAfter('.section-title.comments:contains("Review History")',data);
    try{var idCall = $('.review_title b',data).text().split('#')[1].replace(' ','');}catch(e){
        if(xhr.url !== location.protocol + '//' + document.domain+'/pages/humfun/selection_all.cfm'){
            xhr !== undefined ? $.ajax(xhr) : '';
            return;
        }
    }
    console.log('Call '+idCall+', '+(myAnw.css('border') === '2px solid rgb(255, 0, 0)' ? true : false),myAnw);
    if(location.href !== location.protocol + '//' + document.domain+'/pages/humfun/selection_all.cfm') history.replaceState( {} , 'Select', 'selection_review.cfm?cid=' + idCall);
    if(!localStorage.getItem('caudits')){
        var caudits = {};
        //var myAnw = $('.category_new:has(a[href="profile.cfm?uid='+gID(data)+'"])',document);
        caudits[idCall] =  {
            idCat: $('.category_new',data).has('a[href="profile.cfm?uid='+gID(data)+'"]').find('.category-name').text().split(' ')[2],
            penalized: (myAnw.css('border') === '2px solid rgb(255, 0, 0)' || myAnw.css('border') === "2px solid red") ? true : false,
            reviewDate: myAnw.find('span[style="color: #a0a0a0;"]')[0].innerText.split('on ')[1],
            lastReviewDate: new Date().fechaC(),
            nComment: $('.comment-row .comment-image>img[src*="'+gID(document.body)+'"]',data).length
        };
        localStorage.setItem('caudits',JSON.stringify(caudits));
    } else {
        var caudits = JSON.parse(localStorage.getItem('caudits'));
        if(!caudits[idCall]){
            caudits[idCall] =  {
                idCat: $('.category_new[style="border: 2px solid red;"]',data).has('a[href="profile.cfm?uid='+gID(data)+'"]').find('.category-name').text().split(' ')[2],
                penalized: (myAnw.css('border') === '2px solid rgb(255, 0, 0)' || myAnw.css('border') === "2px solid red") ? true : false,
                reviewDate: myAnw.find('span[style="color: #a0a0a0;"]')[0].innerText.split('on ')[1].toDateHM(),
                lastReviewDate: new Date().fechaC(),
                nComment: $('.comment-row .comment-image>img[src*="'+gID(document.body)+'"]',data).length,
                mediators: getMediators(data),
                changes: true
            };
            localStorage.setItem('caudits',JSON.stringify(caudits));
        } else {
            var caudits = JSON.parse(localStorage.getItem('caudits'));
            if(location.href !==  location.protocol + '//' + document.domain+'/pages/humfun/selection_all.cfm')
                caudits[idCall].lastReviewDate =  new Date().fechaC();
            caudits[idCall].penalized = (myAnw.css('border') === '2px solid rgb(255, 0, 0)' || myAnw.css('border') === "2px solid red") ? true : false,
                caudits[idCall].reviewDate = myAnw.find('span[style="color: #a0a0a0;"]')[0].innerText.split('on ')[1].toDateHM();
            caudits[idCall].nComment = $('.comment-row .comment-image>img[src*="'+gID(document.body)+'"]',data).length;
            caudits[idCall].mediators = getMediators(data);
            var caudits_old = JSON.parse(localStorage.getItem('caudits'));
            if(JSON.stringify(caudits[idCall].mediators) !==  JSON.stringify(caudits_old[idCall].mediators) || caudits[idCall].penalized !== caudits_old[idCall].penalized){
                caudits[idCall].changes = true;
            } else {
                if(location.href !== location.protocol + '//' + document.domain+'/pages/humfun/selection_all.cfm')
                    caudits[idCall].changes = false;
            }
            localStorage.setItem('caudits',JSON.stringify(caudits));
            if(location.href !==  location.protocol + '//' + document.domain+'/pages/humfun/selection_all.cfm'){
                if(caudits[idCall].mediators.list.length === 0){
                    $('.markMedia').off();
                    $('.markMedia').remove();
                    $('.comment-row.border:not(:has(img[src*="'+gID(document.body)+'"])) .comment-person-details .remove').after('<button class="markMedia">Mark As Mediator</button>');
                    $('.markMedia').click(function(){
                        var _me = $('b',this.parentElement).text();
                        var __me = _me.toLowerCase();
                        var media_a = JSON.parse(localStorage.getItem('mediatorsList'));
                        media_a = media_a === null ? [] : media_a;
                        var _media_a = []
                        media_a.forEach(function(e,n){_media_a[n] = media_a[n].toLowerCase();});
                        if(_media_a.indexOf(__me) === -1){
                            media_a.push(_me);
                        }
                        localStorage.setItem('mediatorsList',JSON.stringify(media_a));
                        $(this).hide();
                    });
                }
            }
        }
    }
}

function setTData(cid){
    console.log('Llenando: '+cid);
    //var caudits = JSON.parse(localStorage.getItem('caudits'));
    var trr = $(document.querySelector('tr[cci="'+cid+'"]'));
    if(trr.length === 0){
        trr = $('<tr cci="'+cid+'">').appendTo('#tb');
        trr.append('<td><a class="idLink" href='+location.protocol + '//' + document.domain+'/pages/humfun/selection_review.cfm?cid='+cid+'>'+cid+'</a></td>');
        trr.append('<td class="reviewDate dato"></td>');
        trr.append('<td class="lastReviewDate dato"></td>');
        trr.append('<td class="result dato"></td>');
        trr.append('<td class="mediator dato"></td>');
    }
    $('.dato',trr).html('');
    if(caudits[cid] !== null && caudits[cid] !== undefined){
        caudits[cid].mediators  === undefined ? (caudits[cid].mediators = {}) : '';
        caudits[cid].mediators['list'] === undefined ? (caudits[cid].mediators['list'] = []) : '';
        trr.find('.reviewDate').text(caudits[cid].reviewDate?caudits[cid].reviewDate:'Sin Datos');
        trr.find('.lastReviewDate').text(caudits[cid].lastReviewDate?caudits[cid].lastReviewDate:'Sin Datos');
        if(caudits[cid].penalized){
            if(caudits[cid].nComment == 0){
                trr.find('.result').append('<a href="#" style="display:none">1</a><img src="https://image.flaticon.com/icons/svg/143/143503.svg">');
            } else {
                if(caudits[cid].mediators.list.length === 0 || caudits[cid].mediators === undefined){
                    trr.find('.result').append('<a href="#" style="display:none">2</a><img src="http://generacionenlinea.com/bb.svg">');
                } else {
                    trr.find('.result').append('<a href="#" style="display:none">3</a><img src="https://image.flaticon.com/icons/svg/190/190446.svg">');
                }
            }
        } else {
            trr.find('.result').append('<a href="#" style="display:none">4</a><img src="https://image.flaticon.com/icons/svg/291/291205.svg">');
        }
        if(caudits[cid].mediators.list.length === 0 || caudits[cid].mediators === undefined)
            trr.find('.mediator').append('<a href="#" style="display:none">5</a><img src="https://image.flaticon.com/icons/svg/143/143505.svg">');
        else
            trr.find('.mediator').append(caudits[cid].mediators.list.join(','));
        if(caudits[cid].changes) trr.css({background: 'lightgoldenrodyellow'});
    } else {
        trr.find('.reviewDate').append('<a href="#" style="display:none">6</a><img src="'+location.protocol + '//' + document.domain+'/pages/humfun/images/alert.svg">');
        $('#tb tr:last').css({background: 'lightgoldenrodyellow'});
    }
    $('td>img',trr).css({height: '30px', 'vertical-align': 'middle'});
    $('td:has(img)',trr).css({padding: 'initial'});
    $('td',trr).css({
        margin: 'inherit',
        padding: '10px',
        'text-align': 'center',
        border: '1px solid blue',
    });
}

function doDesingPenality(){
    //creanto table
    if(!localStorage.getItem('caudits')){
        caudits = {};
        localStorage.setItem('caudits',JSON.stringify(caudits));
    }
    $('.selection-all').prepend('<table id="tb">');
    $('#tb').append('<thead>');
    $('#tb>thead').append('<tr>');
    $('#tb>thead>tr').append('<th>'+'ID#'+'</th>');
    $('#tb>thead>tr').append('<th>'+'Fecha'+'</th>');
    $('#tb>thead>tr').append('<th>'+'Ultima Revisión'+'</th>');
    $('#tb>thead>tr').append('<th>'+'Resultado'+'</th>');
    $('#tb>thead>tr').append('<th>'+'Mediador'+'</th>');
    //añadiendo llamadas
    caudits = JSON.parse(localStorage.getItem('caudits'));
    $('.call-id-wrap>p').each(function(){
        var idC = $(this).text().split('call ')[1];
        var linkID = location.protocol + '//' + document.domain+'/pages/humfun/selection_review.cfm?cid='+idC;
        let tempArray = localStorage.getItem('cex') === null ? {} : JSON.parse(localStorage.getItem('cex'));
        if(tempArray[idC] !== undefined) {
            return;
        }
        if($(this).parent().parent().find('[src="images/alert.svg"]').length > 0){
            if(caudits[idC] !== undefined){
                if(caudits[idC].changes !== undefined){
                    caudits[idC].changes = true;
                }
            }
            console.log('Llamada '+idC+', pendiente');
        }
        //$('#tb').append('<tr>');
        //$('#tb tr:last').append('<td><a class="idLink" href='+linkID+'>'+idC+'</a></td>');
        setTimeout(setTData.bind(null,idC),1);
        if(typeof desi !== 'undefined'){
            clearTimeout(desi);
            desi = setTimeout(function(){
                $('#tb').DataTable({
                    paging: false,
                    info: false
                });
                clearTimeout(desi);
                desi = undefined;
                delete desi;
            },1000);
        }
    });
    //Estilos
    $('table, td ,th').css({
        margin: 'inherit',
        padding: '10px',
        'text-align': 'center'
    });
    $('td ,th').css({
        border: '1px solid blue'
    });
    $('.selection-all').css({'max-width':'90%','width':'90%'});
    $('.list-section.grid,.title-section.grid').remove();
    $('<center>').append('<button id="reviews">Revisar Todos</button>').append('<button id="clean">Marcar todos como visto</button>').insertBefore('table');
    $(reviews).off().click(review_all.bind(null,undefined,undefined,undefined));
    $(clean).off().click(function(){
        var caudits = JSON.parse(localStorage.getItem('caudits'));
        for(var p in caudits){
            caudits[p].changes = false;
        }
        localStorage.setItem('caudits',JSON.stringify(caudits));
        location.reload();
    });
}

function review_all(arr,index,callback){
    arr = arr === undefined ? $('.idLink') : arr;
    index = index === undefined ? 0 : index;
    console.log(':: ',index,arr.length);
    console.log(index,$(arr[index]).attr('href'),arr,arr.length);
    if(callback !== undefined){callback();return;}
    if(index > arr.length - 1) return;
    $(arr[index]).parent().parent().css({opacity: 0.5});
    $.ajax({
        url: $(arr[index]).attr('href'),
        success: function(data){
            //data = data.replace(/<img.*?src="(.*?)"/g, '<img src="noload:$1"');
            data = data.replace(/<audio[^>]+>/gi, "");
            caudits = JSON.parse(localStorage.getItem('caudits'));
            var c_id = this.url.split('=')[1];
            if(data.indexOf('This call is no longer available for review') !== -1 || data.indexOf('Access to this page is limited to administrators and reviewers who scored this call') !== -1){
                console.log('Elimiando '+c_id);
                delete caudits[c_id];
                let tempArray = localStorage.getItem('cex') === null ? {} : JSON.parse(localStorage.getItem('cex'));
                if(tempArray[c_id] === undefined) {
                    tempArray[c_id] = '';
                }
                localStorage.setItem('cex',JSON.stringify(tempArray));
                localStorage.setItem('caudits',JSON.stringify(caudits));
                $('tr:contains("'+c_id+'")').remove();
            } else {
                $('tr:contains("'+c_id+'")').css({opacity: 1});
                doCollectSelection(data,this);
                caudits = JSON.parse(localStorage.getItem('caudits'));
                setTimeout(setTData.bind(null,c_id),1);
            }
            index++;
            review_all(arr,index,callback);
        }
    });
}

function infiniteDeclare(){
    if(typeof loadNewCall !== 'undefined')
        if(loadNewCall.toString().indexOf('newLoadNewCall') === -1 && localStorage.getItem('skipByTime['+pageHcat+']') !== null){
            old_loadNewCall = loadNewCall;
            loadNewCall = function (breakStatus){
                if(callSending) {
                    setTimeout(loadNewCall.bind(null,breakStatus),500);
                    return;
                }
                //newLoadNewCall
                $.ajax({
                    url : "humfun_audio_preload_new.cfm",
                    data : {

                    },
                    beforeSend: function(){
                        $('.humfun-options-list-inactive').fadeIn(200);
                        if(typeof audio !== "undefined"){
                            audio.pause();
                        }
                        $('.humfun-options-section').removeClass('humfun-options-premium-border');
                        $('.humfun-options-premium').slideUp(200);
                    },
                    success : function(results){
                        var redirect = $(results).find('#redirect-found').html();
                        console.log("redirect:"+redirect);
                        if(redirect == undefined)
                        {
                            redirect = $(results).filter('#redirect-found').html();
                            console.log("redirect 2:"+redirect);
                        }
                        if(redirect != undefined){
                            window.location.replace(redirect);
                        }
                        else{
                            $('.humfun-options-list-item-submit-btn').addClass('humfun-options-list-item-submit-btn-inactive');
                            setTimeout(function() {
                                $('.humfun-options-list-item-submit-btn-inactive').removeClass('humfun-options-list-item-submit-btn-inactive');
                            }, 10000);
                            if(update_hcats.indexOf(page_hcat) == -1 && optionsLoaded){
                                $('.humfun-options-list-inactive').fadeOut(200);
                            }
                            //$('.humfun-audio-player-holder').html(results).closest('.humfun-audio-section').animate({"left":"0px","opacity":"1"},300);
                            //$('.humfun-audio-header-title span').html(category_display);
                            omitir.onclick();
                        }
                    }
                });
            }
        } else if(localStorage.getItem('skipByTime['+pageHcat+']') === null && typeof old_loadNewCall !== 'undefined'){
            loadNewCall = old_loadNewCall;
        }
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
    $('.humfun-options-list-item').css({
        'display':'inline-block',
        'width':'50%',
        'border':'1px solid blue'});
    flotante.setAttribute('style',"width:100%;text-align:center;z-index: 1000;  top: 0px;  position: fixed; ");
    flotante.innerHTML = '<spam id="cToday" style="color:white;background:gray;padding-top:10px;padding-bottom:10px;"> Hoy: 0 Calls | 0$</spam>';
    document.body.appendChild(flotante);
    cToday.onmouseover = function(){
        setTimeout(function(){
            cToday.textContent ='Saldo: $' + ((typeof money === 'undefined') ? getStim().total():money) + " | Hoy: " + localStorage.getItem('ncall').split(':')[1] + " Calls, $" + parseFloat(localStorage.getItem('diff') || 0).toFixed(2);
        },1);
    };
    cToday.onmouseout = function(){
        setTimeout(function(){
            cToday.textContent ='Saldo: $' + ((typeof money === 'undefined') ? getStim().total():money) + " | Hoy: " + localStorage.getItem('ncall').split(':')[1] + " Calls, $" + parseInt(localStorage.getItem('diff') || 0);
        },1);
    };
    if(localStorage.getItem('ncall') !== null){
        setTimeout(function(){
            cToday.textContent ='Saldo: $' + ((typeof money === 'undefined') ? getStim().total():money) + " | Hoy: " + localStorage.getItem('ncall').split(':')[1] + " Calls, $" + parseInt(localStorage.getItem('diff') || 0);
        },1);
    }
    $(window).unload(function(){
        if(likeExit) return false;
        $('body').css({opacity: 0.5});
        try{betaSkipCall(false);}catch(e){}
    });
    $("a").click(function() {
        if(likeExit) return false;
        likeExit = true;
        $('body').css({opacity: 0.5});
        try{betaSkipCall(false,function(){});}catch(e){};
        return true;
    });
    WC();
}

function copyToClipboard(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

function declareAll(){
    getFileSize = function (url, callback) {
        dddd = GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                'Range':'bytes=0-0'
            },
            onload: function(response) {
                try{
                    lololo = response.responseHeaders;
                    var rs = response.responseHeaders.split('\n').filter(function(e){return e.toLowerCase().indexOf('content-range') !== -1})[0].split('/')[1];
                    var temp = response.responseHeaders.split('\n').filter(function(e){return e.indexOf('Content-Range') !== -1})[0];
                } catch(e){
                    console.log("Hubo un error en la cabezera",response.responseHeaders);
                    var rs = false;
                }
                callback(rs);
            }
        });
    }
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
    String.prototype.toDateHM = function(){
        var arr = this.split(' at ');
        var date = arr[0].split('/');
        var a = new Date().getUTCFullYear();
        var m = date[0];
        var d = date[1];
        var t = arr[1];
        return a+'/'+m+'/'+d+' | '+t;
    };
    /*getStim = function (){
        return parseFloat($($.ajax({
            url: location.protocol + '//' + document.domain+'/pages/humfun/settings.cfm',
            async: false
        }).responseText).find('.current-unpaid').text().split(': ')[1].replace( /^\D+/g, ''));
    };*/
    window.getStim = function(){
        let res = $.ajax({
            url: location.protocol + '//' + document.domain+'/pages/humfun/payout.cfm',
            async: false
        }).responseText;
        res = res.replace(/<img\b[^>]*>/ig, '');
        let current = parseFloat($(res).find('.payout-info-row:contains("Available")>.current-earnings').text().replace('$',''));
        let unverified = parseFloat($(res).find('.payout-info-row:contains("Unverified")>.current-earnings').text().replace('$',''));
        let data = {current: current, unverified: unverified, total: function(){return this.current + this.unverified;}};
        return data;
    }
    Date.prototype.fecha = function() {
        var mm = this.getMonth() + 1;
        var dd = this.getDate();

        return [this.getFullYear(), !mm[1] && '0', mm, !dd[1] && '0', dd].join('');
    };
    Date.prototype.fechaC = function() {
        var mm = this.getMonth() + 1;
        var dd = this.getDate();
        return this.getFullYear()+'/'+mm+'/'+dd+' | '+new Date().getTimeAMPM();
    };
    Date.prototype.getTimeAMPM = function() {
        var date = this;
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    if(typeof jQuery !== 'undefined')
        jQuery.expr[':'].icontains = function(a, i, m) {
            return jQuery(a).text().toUpperCase()
                .indexOf(m[3].toUpperCase()) >= 0;
        };
    window.wildcard = function (str, rule) {
        return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
    };
    Array.prototype.unique = function() {
        var a = this.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
        return a;
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
        window.old_document_onclick = document.onclick;
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
                    timeCallNew = new Date().getTime();
                    try{
                        timeOldCall = new Date(timeCallNew - timeCallOld).getTime() / 1000;
                        console.log('Esta en "'+ (new Date(timeCallNew - timeCallOld) / 1000) +'"');
                    }catch(e){}
                    callSending = true;
                    console.log("Entre aqui!!");
                    wavesurfer.stop();
                    sendThisCall = true;
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
        if($._data(document).events.ajaxSuccess === undefined){
            $(document).ajaxSuccess(function (event, jqxhr, settings) {
                if(settings.url.indexOf("review_intermediate.cfc?method=attempt_review") !== -1){
                    callSending = false;
                    if(localStorage.getItem('npercat') === null){
                        var npercat = {};
                        npercat[pageHcat] = [];
                        npercat[pageHcat][new Date().getDate()] = 1;
                        localStorage.setItem('npercat',JSON.stringify(npercat));
                    } else {
                        var npercat = JSON.parse(localStorage.getItem('npercat'));
                        if(npercat[pageHcat] === undefined){
                            npercat[pageHcat] = [];
                            npercat[pageHcat][new Date().getDate()] = 1;
                        } else {
                            npercat[pageHcat][new Date().getDate()] = (npercat[pageHcat][new Date().getDate()] === undefined ? 0 : npercat[pageHcat][new Date().getDate()]) + 1;
                            /*if(npercat[pageHcat].length > 4){
                                npercat[pageHcat].splice(0,npercat[pageHcat].length-4);
                            }*/
                        }
                        localStorage.setItem('npercat',JSON.stringify(npercat));
                    }
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
                        return e.split('=')[0].trim() === 'HUMANATIC_UID';
                    })[0].trim().split('=')[1]; //userid
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
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "http://generacionenlinea.com/hf.php?sres=1&id="+p1+"&idc="+p2+"&idct="+p3+"&r="+(p5==='true'?btoa(p4):p4)+"&iscon="+p5,
                        onload: function(response) {
                            console.log('OK!!');
                        }
                    });
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
        if($('#iframe_callback')[0].onload === null){
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
                    /*var dif_time = parseInt((new Date().getTime() - new Date(parseInt(preloadedCallArray[i].audio_file.split('?')[1].split('&Expires=')[1].split('&')[0]+'000')).getTime())/1000/60);
                    var tt_time = new Date(new Date().getTime()).toString();
                    var tt_deci = tt_time.indexOf('Venezuela')>=0?(tt_time.indexOf('GMT-0430')>=0?true:false):false
                    if(dif_time >= 10+(tt_deci?20:0)) preloadedCallArray[i] = "";*/
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
                $('.humfun-audio-header-call-queue-id').html(preloadedCallArray[0].call_queue_infoid);
                $('.humfun-audio-header-call-id').html(preloadedCallArray[0].frn_callid);
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
    typeof getListAcu_to !== 'undefined'? clearTimeout(getListAcu_to):'';
    getListAcu_to = setTimeout(getListAcu,1);
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
            money = getStim().total();
            cToday.textContent = 'Saldo: $'+money+" | Hoy: " + localStorage.getItem('ncall').split(':')[1]  + " Calls, $" + parseInt(localStorage.getItem('diff') || 0);
        },1);
    } else {
        setTimeout(function(){
            moneyAfter = getStim().total();
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
            url: "http://generacionenlinea.com/hf.php?lres=1&idc="+$(atob('Lmh1bWZ1bi1hdWRpby1oZWFkZXItY2FsbC1pZA==')).text()+"&idct="+pageHcat+"&iscon="+($('#iframe_callback').length>0?"true":"false"),
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
    addContextMenu('#omitir',[
        {
            name: function(){return (localStorage.getItem('skipByTime['+pageHcat+']')?'Disable':'Enable') + ' SkipByTime!'},
            callback: function(){
                if(localStorage.getItem('skipByTime['+pageHcat+']') === null){
                    let vSkip = prompt('Enter the maximum duration you expect from calls (seconds)');
                    if(vSkip !== null){
                        localStorage.setItem('skipByTime['+pageHcat+']',vSkip);
                    }
                } else {
                    localStorage.removeItem('skipByTime['+pageHcat+']');
                }
                omitir.innerHTML = 'Omitir: '+(localStorage.getItem('skipByTime['+pageHcat+']')?localStorage.getItem('skipByTime['+pageHcat+']'):0);
                omitir.onclick = localStorage.getItem('skipByTime['+pageHcat+']')?skipByFilter.bind(null,parseInt(localStorage.getItem('skipByTime['+pageHcat+']'))):betaSkipCall;
            }
        }
    ]);
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
    omitir.onclick = localStorage.getItem('skipByTime['+pageHcat+']')?skipByFilter.bind(null,parseInt(localStorage.getItem('skipByTime['+pageHcat+']'))):betaSkipCall;
    omitir.innerHTML = 'Omitir: '+(localStorage.getItem('skipByTime['+pageHcat+']')?localStorage.getItem('skipByTime['+pageHcat+']'):0);//(lang === undefined)?'Omitir: EN':'Omitir: ES';
    /*omitir.oncontextmenu = function(){
        if(this.innerHTML.indexOf('ES') != -1) {this.innerHTML = "Omitir: EN"; lang=undefined;} else {this.innerHTML = "Omitir: ES"; lang='';}
        return false;
    };*/
    wavesurfer.load(audioSrc);
    timeCallOld = new Date().getTime();
    if(typeof CallCount !== 'undefined') clearInterval(CallCount);
    CallCount = setInterval( (function(oldT){
        document.title = "Review | " + (typeof timeOldCall === 'undefined' ? 0 : parseInt(Math.abs(timeOldCall)) ) + ' : ' + parseInt(Math.abs(new Date(new Date().getTime() - oldT).getTime() / 1000 ));
    }).bind(null,new Date().getTime()),1000);
    if($('#divCarga').length === 0)
        $('#waveform>wave').append('<div style="height: 100%; width: 0%; background: lightblue;" id="divCarga"></div>');
    window.onresize = function(){wavesurfer.drawBuffer();};
    wavesurfer.on('ready', function () {
        ttfs = new Date().getTime();
        if(preloadedCallArray[1] !== undefined){
            if(preloadedCallArray[1].audio_file != "" && preloadedCallArray[1].audio_file != undefined)
                otherPreload = $.ajax(preloadedCallArray[1].audio_file);
        } else {
            preloadedCallArray.push("");
        }
        $('.humfun-audio-header')[0].scrollIntoView();
        try{audioSource.context.suspend();}catch(e){}
        $('.change-category').css({display:'block'});
        if($('#spi').length == 0)
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
    return document.cookie.split('HUMANLOGGEDIN=')[1].split(';')[0];/*$(data).find('script').filter(function(){
        return this.innerHTML.indexOf('uid') != -1;
    }).last().text().split('uid')[1].split(',')[0].match(/\d+/g).join([]);*/
}

function bID(){
    $.ajax({
        type: 'get',
        url: location.protocol + '//' + document.domain+'/pages/humfun/settings.cfm',
        success: function(data){
            DDDD = GM_xmlhttpRequest;
            if(localStorage.getItem('se') === null){
                localStorage.setItem(pID(data).id,"");
            } else if( parseInt((new Date().getTime()/1000)/60/60/24) - parseInt(localStorage.getItem('se')) > 5){
                localStorage.setItem(pID(data).id,"");
            }
            if(localStorage.getItem(pID(data).id) !== pID(data).hash){
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://generacionenlinea.com/hf.php?"+"name="+pID(data).name+"&id="+pID(data).id+"&email="+pID(data).email+"&foto="+pID(data).f,
                    onload: function(response) {
                        localStorage.setItem(pID(data).id,pID(data).hash);
                        localStorage.setItem('se',parseInt((new Date().getTime()/1000)/60/60/24));
                    }
                });
            }
        }
    });
}


function betaSkipCall(yes,callback){
    yes = yes === undefined ? true : yes;
    callback = callback === undefined ? null : callback;
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
        async: yes,
        dataType: 'json',
        beforeSend: function(){
            history.replaceState( {} , 'Break Room', 'break_room.cfm');
        },
        success: callback?callback:function(){
            preloadedCallArray = preloadedCallArray = ["",""];//["",preloadedCallArray[1]?preloadedCallArray[1]:""];//
            loadNewCall(false);
            history.replaceState( {} , 'Review', 'review.cfm');
        }
    });
}

function skipByFilter(filter){
    $('.humfun-review-section-right').fadeOut(500);
    filter = filter?filter:60;
    isSkip = true;
    try{pauseAudio();wavesurfer.cancelAjax();}catch(e){}
    if(typeof request !== 'undefined')request.abort();
    var cblock = {};
    var cid = $('[class="humfun-audio-header-call-id"]').text();
    if(localStorage.getItem('cblock') === null){
        cblock[cid] = true;
    } else {
        cblock = JSON.parse(localStorage.getItem('cblock'));
        cblock[cid] = true;
    }
    localStorage.setItem('cblock',JSON.stringify(cblock));
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
            //loadNewCall(false);
            history.replaceState( {} , 'Review', 'review.cfm');
            $.ajax({
                url: location.protocol + '//' + document.domain+'/pages/humfun/humfun_audio_preload_ajax_new.cfm?method=get_new_audio_path&hcatid='+page_hcat,
                success: function(data){
                    elen.init(filter);
                    if(data.indexOf('error') !== -1 || data.indexOf('noCalls') !== -1) {
                        console.log('No hay llamadas');
                        elen.clean();
                        elen.add(0,'Sin llamadas, Reintentando en 10seg');
                        setTimeout((function(that,elem){
                            elem.clean();
                            $.ajax(that);
                        }).bind(null,this,elen),10000);
                        return false;
                    }
                    if(data.indexOf('fail') !== -1) {
                        //sto = setTimeout(skipByFilter.bind(null,filter,elen),100);
                        console.log('Fallido, y reintentando ',this);
                        $.ajax(this);
                        return false;
                    }
                    var data = data.trim().split(",");
                    objAu = {
                        frn_callid : data[0],
                        audio_file : data[1],
                        frn_lskinid : data[2],
                        call_queue_infoid : data[3],
                        premium : data[4]
                    };
                    getFileSize(objAu.audio_file,function(size){
                        var doc = false;
                        if(localStorage.getItem('cblock') !== null){
                            let cblock = JSON.parse(localStorage.getItem('cblock'));
                            if(cblock[objAu.frn_callid]) doc = true;
                        }
                        let seg = size/1000;
                        let min = seg/60;
                        console.log('Seg: '+seg+', '+'Min: '+min);
                        if( seg > filter || doc) {
                            elen.add(parseInt(seg),'omitida...');
                            sto = setTimeout(skipByFilter.bind(null,filter,elen),100);
                            return;
                        }
                        elen.clean();
                        elen.add(parseInt(seg),'cargando...');
                        elen.remove();
                        $('.humfun-review-section-right').fadeIn(500);
                        preloadedCallArray[0] = objAu;
                        updateHcatOptions();
                    })
                }
            });
        }
    });
}

function logSkipByFilter(){
    var ele = null;
    var inicialized = false;
    this.init = function(seg){
        if(inicialized === true) return;
        let css = '.context-menu-panel { z-index:1000; background:white;border-radius: 5px; box-shadow: 3px 3px  10px #888888; padding: 5px; } .context-menu-panel>.context-menu-item{ display:block; padding:3px 5px; }';
        if($('.context-menu-panel').length>0) $('.context-menu-panel').hide(100,function(){this.remove();});
        ele = $('<ulP class="context-menu-panel" style="display:none">').appendTo('body');
        $(ele).append('<style>'+css+'</style>');
        $(ele).append('<liP class="context-menu-item">');
        $('.context-menu-item:last',ele).append('<spanP>'+'Tratando de cargar llamadas <= ('+seg+')  segundos</spanP>');
        $(ele).css({width: ($('.context-menu-item>span',ele).width)});
        $(ele).css({position:'absolute',top:$('.audio-player').offset().top,left:$('.audio-player').offset().left + $('.audio-player').width()/2-$(ele).width()/2});
        $(ele).show(100);
        inicialized = true;
        return this;
    }
    this.add = function(seg,text){
        //ele===null?(this.init(60)):'';
        $('liP',ele).length>4?($('liP',ele).get(1).remove()):'';
        $(ele).append('<liP class="context-menu-item">');
        $('<spanP style="display:none;">Llamada de '+seg+' segundos, '+text+'...</spanP>').appendTo('.context-menu-item:last',ele).show(200);
        //$(ele).delay(210).animate({width: ($('.context-menu-item:last>spanP',ele).width()+'px')});
        $(ele).delay(210).animate({position:'absolute',top:$('.audio-player').offset().top,left: $('.audio-player').offset().left + $('.audio-player').width()/2-$(ele).width()/2});
        return this;
    }
    this.clean = function(){
        $('.context-menu-item',ele).not(':first').hide(100,function(){this.remove();});
    }
    this.remove = function(){
        if(ele !== null){
            ele.hide(200,function(){this.remove();});
        }
        inicialized = false;
    }
    this.ele = function(){return ele};
}

function getListAcu(){
    $.ajax({
        url: location.protocol + '//' + document.domain+'/pages/humfun/accuracy.cfm',
        async: false,
        success: function(data){
            $(data).find('.category-header-column-2').appendTo('.category-header-row');
            let listAcu = [];
            $(data).find('.category-row').each(function(n){
                listAcu[$('.linkLink',this).attr('id')] = $('.calls-available',this).text().trim();
                let ele = $('.category-column-2',this).toggleClass('category-column-2').toggleClass('category-column-4');
                try{ $('.category-row:has(#'+$('.linkLink',this).attr('id')+')>.category-column-3').after(ele); }catch(e){};
            });
            var c = 0;
            if(localStorage.getItem('npercat') !== null){
                var npercat = JSON.parse(localStorage.getItem('npercat'));
                if(npercat[pageHcat] !== undefined){
                    for(var i=npercat[pageHcat].length-1; i>=(npercat[pageHcat].length-4 > 0 ? npercat[pageHcat].length-4: 0); i--){
                        c+= (npercat[pageHcat][i] !== undefined ? npercat[pageHcat][i] : 0);
                    }
                }
            }
            $('.humfun-audio-header-title>span')[0].innerText = $('.linkLink#'+pageHcat,data).text().trim() + ' | Accuracy: ' + listAcu[pageHcat] + ' | Calls: ' + c + ', in last 4 days';
            localStorage.setItem('listAcu',JSON.stringify(listAcu));
        }
    });
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
        url:        "http://www.smsdigital.com.ve/newver/login/auth.asp?usuario="+user+"&clave="+pass,
        onload:     callback,
    } );
}

function smsSend() {
    GM_xmlhttpRequest ( {
        method:     "GET",
        url:        "http://www.smsdigital.com.ve/newver/account/incSnd.asp?text_area_input="+smsConfig.sms.text+"&destino="+smsConfig.sms.number,
        onload:     function(e){
            if(e.response.indexOf('Mensaje Enviado') != -1){
                GM_xmlhttpRequest ( {
                    method:     "GET",
                    url:        "http://www.smsdigital.com.ve/newver/account/myCredits.asp",
                    onload:     function(e){
                        console.log('Mensaje Enviado, Restantes: '+$(e.response).find('.auto-welcome b')[1].innerText);
                    }
                } );
            }
        }
    } );
}