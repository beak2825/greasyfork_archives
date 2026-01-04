// ==UserScript==
// @name           WME SlackNotifier
// @description    Posts lock, unlock and closure requests to waze slack. Based on original by davidakachaos
// @namespace      https://greasyfork.org/users/374267-abel-vieira
// @author         AbelOVieira (abelovieira@gmail.com)
// @grant          none
// @grant          GM_info
// @version        2024.01.23
// @include 	   /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude        https://www.waze.com/user/*editor/*
// @exclude        https://www.waze.com/*/user/*editor/*
// @license        Creative Commons Attribution-ShareAlike 4.0 International License
// @downloadURL https://update.greasyfork.org/scripts/390345/WME%20SlackNotifier.user.js
// @updateURL https://update.greasyfork.org/scripts/390345/WME%20SlackNotifier.meta.js
// ==/UserScript==

var WME_SN_Version = GM_info.script.version,
    WME_SN_Name = GM_info.script.name,
    WME_SN_UA = [],
    WME_SN_user=null,
    WME_SN_country=null,
    WME_SN_PromptDates=false,
    WME_SN_CS={
        PO: {
            SlackURL:"https://wazept.slack.com/messages/C3NMDCP34",
            LockURL:"https://hooks.slack.com/services/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", //#mapa
            UnLockURL:"https://hooks.slack.com/services/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", //#mapa
            ClosureURL:"https://hooks.slack.com/services/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", //#cortes-eventos-alertas
            1:":one_1:",
            2:":two_1:",
            3:":three_1:",
            4:":four_1:",
            5:":five_1:",
            6:":six_1:",
            7:":seven:",
            8:":eight:",
            9:":nine:",
            0:":zero:",
            SNDivlabel:'<i class=\"fa fa-slack\"></i> Slack do WazePT',
            BTNLock:String.fromCodePoint(0x1F510)+' Solicitar bloqueio',
            BTNUnLock:String.fromCodePoint(0x1F510)+' Solicitar desbloqueio',
            BTNClosure:String.fromCodePoint(0x1F6A7)+' Comunicar corte de estrada',
            btnSend: "Enviar",
            OptToLock: "... para nível: ",
            UnlockReasonMessage: "Para melhor avaliarmos o teu pedido de desbloqueio, por favor, indica-nos o(s) motivo(s): ",
            UnlockReasons: {
                'join_segments': "Ligar segmento(s)",
                'fix_address': "Corrigir endereço",
                'fix_arrows': "Corrigir setas / direcções",
                'fix_speed': "Corrigir velocidade",
                'geometry': "Ajustar a geometria da via",
                'fix_segment_type': "Alterar o tipo de via",
                'fix_segment_level': "Alterar elevação da via",
                'restrictions': "Criar / Alterar restrições",
                'other': "Outros (especifico abaixo)",
            },
            ClosureReasonMessage: "Para melhor avaliarmos o teu pedido de corte de estrada, por favor, indica-nos o(s) motivo(s), e se possível a duração: ",
            ClosureReasons: {
                'construction': "Obras na via",
                'event': "Evento",
                'fire': "Incêndio",
                'accident': "Acidente",
                'other': "Outros (especifico abaixo)",
            },
            PTitleLock:":closed_lock_with_key:",
            PTitleUnLock:":unlock:",
            PTitleClosure:":construction:",
            PTitleSeparator:"→",
            PFallbackLock:"Bloqueio solicitado no mapa: ",
            PFallbackUnLock:"Desloqueio solicitado no mapa: ",
            PFallbackClosure:"Corte de estrada solicitado no mapa: ",
            PColorLock:"#404e70",
            PColorUnLock:"#2a65fa",
            PColorClosure:"#f55702",
            OkSentLock:"<p><b>O pedido de bloqueio foi enviado com sucesso para a nossa comunidade,</b><br>e o mesmo vai agora ser avaliado pelos editores</p><p>Para saberes mais, convidamos-te a juntar ao nosso slack em <a href=\"https://wazept.slack.com\" target=\"_black\">https://wazept.slack.com</a>",
            OkSentUnLock:"<p><b>O pedido de desbloqueio foi enviado com sucesso para a nossa comunidade,</b><br>e o mesmo vai agora ser avaliado pelos editores, pelo que terás de aguardar pela revisão...</p><p>Para saberes mais, convidamos-te a juntar ao nosso slack em <a href=\"https://wazept.slack.com\" target=\"_black\">https://wazept.slack.com</a>",
            OkSentClosure:"<p><b>O pedido de corte de estrada foi enviado com sucesso para a nossa comunidade,</b><br>e o mesmo vai agora ser avaliado pelos editores</p><p>Para saberes mais, convidamos-te a juntar ao nosso slack em <a href=\"https://wazept.slack.com\" target=\"_black\">https://wazept.slack.com</a>",
            CancelSent:"<p>O pedido foi cancelado!</p>",
            StartDate:"<i class=\"fa fa-calendar\"></i> Data de início",
            EndDate:"<i class=\"fa fa-calendar\"></i> Data de Fim",
        }
    };

function initUnlock(e) {
    log('initUnlock()');
    if (typeof W === 'undefined' ||
        typeof W.loginManager === 'undefined') {
        setTimeout(initUnlock, 100);
        return;
    }
    if (typeof I18n === 'undefined') {
        log('No internationalisation object found yet, snoozing');
        setTimeout(initUnlock, 300);
        return;
    }
    if (!W.loginManager.user) {
        log('Not logedIn '+W.loginManager);
        setTimeout(initUnlock, 3000);
        return;
    }
    if (typeof W.loginManager.user === 'undefined' ||
        typeof W.loginManager.user.attributes.areas === 'undefined') {
        log('Waiting for user areas....');
        setTimeout(initUnlock, 300);
        return;
    }
    log('Initalizing settings...');
    initSettings();
}

function initSettings() {
    log('initSettings()');
    WME_SN_user=W.loginManager.user.attributes.userName;
    var prefsTab = document.querySelector('#sidepanel-prefs');
    if (!prefsTab) {
        log('No settings tab found yet, snoozing');
        setTimeout(initSettings, 400);
        return;
    }
    if(W.loginManager.user.attributes.areas) {
        log('registering selection changed handler');
        W.selectionManager.events.register('selectionchanged', null, selectedFeature);
        //getUserAreas();
    }
}

function postLockToSlack(locked_to){
    let place = $('.location-info').text();
    let perma = getPermalink();
    let locked = getLockedAt();
    let user_level = 1 + W.loginManager.getUserRank();

    let reason = '';

    let payloadnew = {
        "attachments": [
            {
                "color": WME_SN_CS[WME_SN_country].PColorLock,
                "fallback": "Novo pedido de bloqueio de " + locked + " para " + locked_to,
                "blocks": [
                    {
                        "type": "section",
                        "text":
                        {
                            "type": "mrkdwn",
                            "text": WME_SN_CS[WME_SN_country].PTitleLock + " " + WME_SN_CS[WME_SN_country][locked]+" "+WME_SN_CS[WME_SN_country].PTitleSeparator+" "+WME_SN_CS[WME_SN_country][locked_to] + " | " + place + " | <"+perma+"|PL> - <https://www.waze.com/pt-PT/user/editor/"+WME_SN_user+"|"+WME_SN_user+" ("+user_level+")>"
                        }
                    }
                ]
            }
        ]
    }

    let posting = $.post(WME_SN_CS[WME_SN_country].LockURL, JSON.stringify(payloadnew) );
    posting.done(function(data){
        showMessage('success',WME_SN_CS[WME_SN_country].OkSentLock);
    });
}

function postUnlockToSlack(reason){
    let place = $('.location-info').text();
    let perma = getPermalink();
    let locked = getLockedAt();
    let user_level = 1 + W.loginManager.getUserRank();

    let payloadnew = {
        "attachments": [
            {
                "color": WME_SN_CS[WME_SN_country].PColorUnLock,
                "fallback": "Novo pedido de desbloqueio de " + locked + " para " + user_level,
                "blocks": [
                    {
                        "type": "section",
                        "text":
                        {
                            "type": "mrkdwn",
                            "text": WME_SN_CS[WME_SN_country].PTitleLock + " " + WME_SN_CS[WME_SN_country][locked]+" "+WME_SN_CS[WME_SN_country].PTitleSeparator+" "+WME_SN_CS[WME_SN_country][user_level] + " | " + place + " | <"+perma+"|PL> - <https://www.waze.com/pt-PT/user/editor/"+WME_SN_user+"|"+WME_SN_user+" ("+user_level+")>"
                        }
                    },
                    {
                        "type": "section",
                        "text":
                        {
                            "type": "mrkdwn",
                            "text": "```" + reason + "```"
                        }
                    }
                ]
            }
        ]
    }

    let posting = $.post(WME_SN_CS[WME_SN_country].UnLockURL, JSON.stringify(payloadnew) );
    posting.done(function(data){
        showMessage('success',WME_SN_CS[WME_SN_country].OkSentUnLock);
    });
}

function postClosureToSlack(data){
    let place = $('.location-info').text();
    let perma = getPermalink();
    let locked = getLockedAt();
    locked = locked < 4 ? 4 : locked;
    let user_level = 1 + W.loginManager.getUserRank();

    let dataFormatada_inicio = "ND";
    let dataFormatada_fim = "ND";

    if(data[1] != "")
    {
        let data_inicio = new Date(data[1]);
        dataFormatada_inicio = data_inicio.getDate() + "/" + (data_inicio.getMonth() + 1) + "/" + data_inicio.getFullYear();
    }

    if(data[2] != "")
    {
        let data_fim = new Date(data[2]);
        dataFormatada_fim = data_fim.getDate() + "/" + (data_fim.getMonth() + 1) + "/" + data_fim.getFullYear();
    }

    let payloadnew = {
        "attachments": [
            {
                "color": WME_SN_CS[WME_SN_country].PColorClosure,
                "fallback": "Novo corte pedido pelo SlackNotifier",
                "blocks": [
                    {
                        "type": "header",
                        "text": {
                            "type": "plain_text",
                            "text": WME_SN_CS[WME_SN_country][locked] + " " + WME_SN_CS[WME_SN_country].PTitleClosure + " SlackNotifier " + WME_SN_CS[WME_SN_country].PTitleClosure
                        }
                    },
                    {
                        "type": "section",
                        "text":
                        {
                            "type": "mrkdwn",
                            "text": place + " (" + data[0] + ") | :no_entry: " + dataFormatada_inicio + " :arrow_right: " + dataFormatada_fim + " | <"+perma+"|PL> - <https://www.waze.com/pt-PT/user/editor/"+WME_SN_user+"|"+WME_SN_user+" ("+user_level+")>"
                        }
                    }
                ]
            }
        ]
    }

    let posting = $.post(WME_SN_CS[WME_SN_country].ClosureURL, JSON.stringify(payloadnew) );
    posting.done(function(data){
        showMessage('success',WME_SN_CS[WME_SN_country].OkSentClosure);
    });
}

function hasClosures(){
    // check if a selected segment contains a closure
    let closures = [];
    $.each(W.model.roadClosures.objects, function(indx, closure){
        closures.push(closure.segID);
    });
    if (closures === []){
        return false;
    }
    $.each(W.selectionManager.getSelectedFeatures(), function(indx, section){
        let segID = section._wmeObject.attributes.id;
        if (closures.includes(segID)){
            return true;
        }
    });
    return false;
}

function getLockedAt(){
    var max_level = 0;
    $.each(W.selectionManager.getSelectedFeatures(), function(indx, section){
        var seg_rank = 1 + section._wmeObject.attributes.lockRank;
        if (seg_rank > max_level){
            max_level = seg_rank;
        }
    });
    return max_level;
}

function isAllSelectedType(what) {
    if (what=="segment") {
        let allOk=true;
        $.each(W.selectionManager.getSelectedFeatures(), function(indx, section){
            if (section._wmeObject.type!=what){
                allOk=false;
            }
        });
        return allOk;
    }
    if(what=="venue")
        if(W.selectionManager.getSelectedFeatures().length == 1)
            if(W.selectionManager.getSelectedFeatures()[0]._wmeObject.type=="venue")
                return true
    return false;
}

function getSelectedIds(segments){
    let ids = [];
    $.each(segments, function(indx, section){
        ids.push(section._wmeObject.attributes.id);
    });
    return ids.join(",");
}

function getLonLat(segment){
    let bounds = segment._wmeObject.geometry.bounds;
    return new OL.LonLat(bounds.left, bounds.bottom)
        .transform(W.map.projection, W.map.displayProjection)
}

function getLonLatSeg(segment){
    let bounds = segment._wmeObject.geometry.bounds;
    let geoXY=new OL.LonLat(bounds.left, bounds.bottom).transform('EPSG:3857', 'EPSG:4326');
    let XY = geoXY.transform(W.map.projection, W.map.displayProjection);
    return XY;
}

// returns permalink
function getPermalink() {
    let PL = "";
    let selectedSegments = W.selectionManager.getSelectedFeatures();
    let selectedLength = selectedSegments.length;
    let middleSegment = selectedSegments[Math.round((selectedLength - 1) / 2)];
    let latlon = getLonLatSeg(middleSegment);
    let z = 5;
    if (50 > selectedLength) {
        z = 6;
    } else if (500 > selectedLength) {
        if (6 > z) z += 1;
    } else {
        z = 4;
    }
    PL += window.location.origin;
    PL += window.location.pathname;
    PL += '?zoom=';
    PL += z;
    PL += '&lat=';
    PL += latlon.lat;
    PL += '&lon=';
    PL += latlon.lon;
    PL += '&env=';
    PL += W.app.getAppRegionCode();
    if (isAllSelectedType("segment")==true)
        PL += '&segments=';
    if (isAllSelectedType("venue")==true)
        PL += '&venues=';
    PL += getSelectedIds(selectedSegments);
    return PL;
}

function getUserAreas(){
    log('Loading editable areas for user');
    for (var a = 0; a < W.loginManager.user.attributes.areas.length; a++) {
        for (var c = 0; c < W.loginManager.user.attributes.areas[a].geometry.components.length; c++) {
            W.loginManager.user.attributes.areas[a].geometry.components[c].calculateBounds();
            WME_SN_UA.push(W.loginManager.user.attributes.areas[a].geometry.components[c]);
        }
    }
}

function determinCountry(){
    let selectedSegments = W.selectionManager.getSelectedFeatures();
    let middleSegment = selectedSegments[Math.round((selectedSegments.length - 1) / 2)];
    let country = middleSegment._wmeObject.getAddress().attributes.country.attributes.abbr;
    if(!WME_SN_CS[country]){
        log("There is no hook set for " + country + "!");
        return;
    }
    return country;
}

function isInsideEdiableArea(lon, lat) {
    let xy = new OL.Geometry.Point(lon, lat);
    let inside = false;
    for (var a = 0; a < WME_SN_UA.length; a++) {
        if (xy.x >= WME_SN_UA[a].bounds.left
            && xy.x <= WME_SN_UA[a].bounds.right
            && xy.y >= WME_SN_UA[a].bounds.bottom
            && xy.y <= WME_SN_UA[a].bounds.top
            && WME_SN_UA[a].containsPoint(xy)) {
            return true;
        }
    }
    return false;
};


function checkEditableArea(){
    let editable = false;
    let selectedSegments = W.selectionManager.getSelectedFeatures();
    for (var i = selectedSegments.length - 1; i >= 0; i--) {
        let segment = selectedSegments[i];
        let lonlat = getLonLat(segment);
        editable = isInsideEdiableArea(lonlat.lon, lonlat.lat);
    }
    return editable;
}

function selectedFeature(){
    setTimeout(() => {
        if (isAllSelectedType("segment")==true)
            checkLock();
        if (isAllSelectedType("venue")==true)
            checkLockVenues();
    }, 500)
}

function checkLock(){
    if ($("#unlockDiv").length) {
        $('#unlockDiv').remove();
    }
    /*if (!checkEditableArea()) {
        return;
    }*/
    var max_level = getLockedAt();
    var user_level = 1 + W.loginManager.getUserRank();
    if (user_level >= 6) {
        return;
    }
    WME_SN_country = determinCountry();
    if (!WME_SN_country || !WME_SN_CS[WME_SN_country]) { return; }
    let unlockDiv = document.createElement("div");
    unlockDiv.id = 'unlockDiv';
    unlockDiv.className = 'form-group';
    $('.lock-edit').append(unlockDiv);
    let unlockDiv_label=document.createElement("label");
    unlockDiv_label.innerHTML = WME_SN_CS[WME_SN_country].SNDivlabel+" <a href=\""+WME_SN_CS[WME_SN_country].SlackURL+"\" target=\"_black\"><i class=\"fa fa-external-link\"></i></a>" ;
    unlockDiv_label.className = "control-label";
    $('#unlockDiv').append(unlockDiv_label);
    let unlockDiv_fc=document.createElement("div");
    unlockDiv_fc.id = 'unlockDiv_fc';
    //unlockDiv_fc.className = 'btn-group';
    $('#unlockDiv').append(unlockDiv_fc);

    if (user_level < max_level) {
        log('User level lower then the locks, adding unlock/closure.');
        createUnlockBtn()
        createClosureRequestBtn();
    }
    if (user_level >= max_level){
        log('User level higher then the locks, adding lock request.');
        createLockRequestForm();
    }
    if (user_level < 4 && user_level >= max_level){
        log('Level < 4 editor, add closure request.')
        // Reason field is already added above.
        createClosureRequestBtn();
    }
    if (hasClosures()){
        // TODO: Add closure removal request
    }
}

function checkLockVenues(){
    if ($("#unlockDiv").length) {
        $('#unlockDiv').remove();
    }
    /*if (!checkEditableArea()) {
        return;
    }*/
    var max_level = getLockedAt();
    var user_level = 1 + W.loginManager.getUserRank();
    if (user_level >= 6 || user_level < max_level) {
        return;
    }
    WME_SN_country = determinCountry();
    if (!WME_SN_country || !WME_SN_CS[WME_SN_country]) { return; }
    let unlockDiv = document.createElement("div");
    unlockDiv.id = 'unlockDiv';
    unlockDiv.className = 'form-group';
    $('.lock-edit').append(unlockDiv);
    let unlockDiv_label=document.createElement("label");
    unlockDiv_label.innerHTML = WME_SN_CS[WME_SN_country].SNDivlabel+" <a href=\""+WME_SN_CS[WME_SN_country].SlackURL+"\" target=\"_black\"><i class=\"fa fa-external-link\"></i></a>" ;
    unlockDiv_label.className = "control-label";
    $('#unlockDiv').append(unlockDiv_label);
    let unlockDiv_fc=document.createElement("div");
    unlockDiv_fc.id = 'unlockDiv_fc';
    //unlockDiv_fc.className = 'btn-group';
    $('#unlockDiv').append(unlockDiv_fc);
    createLockRequestForm();
}

function createUnlockBtn () {
    let btnPostRequest = document.createElement("button");
    btnPostRequest.innerHTML = WME_SN_CS[WME_SN_country].BTNUnLock;
    btnPostRequest.id = "clickUnlockToSlack";
    btnPostRequest.className = 'action-button waze-btn waze-btn-small waze-btn-white';
    $('#unlockDiv_fc').append(btnPostRequest);
    $("#clickUnlockToSlack").click(function() {
        let message = '<p>'+WME_SN_CS[WME_SN_country].UnlockReasonMessage+'</p><div class="controls-container form-group">';
        $.each(WME_SN_CS[WME_SN_country].UnlockReasons, function(indx, value){
            message += '<div class="service-checkbox"><input id="WME_SN_CS_Reasons_Unlock_'+indx+'" type="checkbox" class="WME_SN_CS_Reasons_Unlock" value="'+value+'"><label for="WME_SN_CS_Reasons_Unlock_'+indx+'">'+value+'</label></div>';
        });
        message += '</div>';
        WME_SN_PromptDates=false;
        ezBSAlert({
            type: 'prompt',
            headerText: WME_SN_CS[WME_SN_country].BTNUnLock,
            messageText: message,
            okButtonText: WME_SN_CS[WME_SN_country].btnSend,
        }).done(function (e) {
            if (e) {
                postUnlockToSlack(e[0]);
            } else {
                ezBSAlert({
                    alertType: 'danger',
                    headerText: WME_SN_CS[WME_SN_country].BTNUnLock,
                    messageText: WME_SN_CS[WME_SN_country].CancelSent,
                });
            }
        });;
    });
}

function createLockRequestForm(){
    let user_level = 1 + W.loginManager.getUserRank();

    let divLock = document.createElement("div");
    divLock.className = 'btn-group btn-block';
    let btnPostRequest = document.createElement("button");
    btnPostRequest.innerHTML = WME_SN_CS[WME_SN_country].BTNLock+" <span class=\"caret\"></span>";
    btnPostRequest.className = 'action-button waze-btn waze-btn-small waze-btn-white dropdown-toggle';
    btnPostRequest.dataset.toggle = 'dropdown';
    divLock.appendChild(btnPostRequest);
    let divLockOptions = document.createElement("ul");
    divLockOptions.className = "dropdown-menu";
    for (var i = user_level + 1; i < 7; i++) {
        let liopt = document.createElement("li");
        liopt.className = "postLockToSlack";
        let opt = document.createElement("a");
        opt.innerHTML = WME_SN_CS[WME_SN_country].OptToLock+" ";
        opt.href = "#";
        opt.dataset.level = i;
        let bold = document.createElement("b");
        bold.innerHTML = i;
        bold.dataset.level = i;
        opt.appendChild(bold);
        liopt.appendChild(opt);
        divLockOptions.appendChild(liopt);
    }
    divLock.appendChild(divLockOptions)
    $('#unlockDiv_fc').append(divLock);
    $("#unlockDiv").on('click','.postLockToSlack',function(e){
        let level = e.target.dataset.level;
        postLockToSlack(level);
    });
}

function createClosureRequestBtn(){
    let btnPostRequest = document.createElement("button");
    btnPostRequest.innerHTML = WME_SN_CS[WME_SN_country].BTNClosure;
    btnPostRequest.id = "clickClosureToSlack";
    btnPostRequest.className = 'action-button waze-btn waze-btn-small waze-btn-white';
    btnPostRequest.style.cssText = 'margin-top:4px;'
    $('#unlockDiv_fc').append(btnPostRequest);

    $("#clickClosureToSlack").click(function() {
        let message = '<p>'+WME_SN_CS[WME_SN_country].ClosureReasonMessage+'</p><div class="controls-container form-group"><div class="col-sm-6">';
        $.each(WME_SN_CS[WME_SN_country].ClosureReasons, function(indx, value){
            message += '<div class="service-checkbox"><input id="WME_SN_CS_Reasons_'+indx+'" type="radio" name="WME_SN_CS_Reasons" class="WME_SN_CS_Reasons" value="'+value+'"><label for="WME_SN_CS_Reasons_'+indx+'">'+value+'</label></div>';
        });
        message += '</div>';
        message += '<div class="col-sm-6"><div class="form-group"><label>'+WME_SN_CS[WME_SN_country].StartDate+'</label><input type="date" id="WME_SN_CS_StartDate" class="form-control"></div><div class="form-group"><label>'+WME_SN_CS[WME_SN_country].EndDate+'</label><input type="date" id="WME_SN_CS_EndDate" class="form-control"></div></div></div>';
        WME_SN_PromptDates=true;
        ezBSAlert({
            type: 'prompt',
            headerText: WME_SN_CS[WME_SN_country].BTNClosure,
            messageText: message,
            okButtonText: WME_SN_CS[WME_SN_country].btnSend,
        }).done(function (e) {
            if (e!="") {
                postClosureToSlack(e);
            } else {
                ezBSAlert({
                    alertType: 'danger',
                    headerText: WME_SN_CS[WME_SN_country].BTNClosure,
                    messageText: WME_SN_CS[WME_SN_country].CancelSent,
                });
            }
        });;
    });
}

function ezBSAlert (options) {
    var deferredObject = $.Deferred();
    var defaults = {
        type: "alert", //alert, prompt,confirm
        modalSize: 'modal-sm', //modal-sm, modal-lg
        okButtonText: 'Ok',
        cancelButtonText: 'Cancel',
        yesButtonText: 'Yes',
        noButtonText: 'No',
        headerText: 'WME SlackNotifier',
        messageText: 'Message',
        alertType: 'default', //default, primary, success, info, warning, danger
        inputFieldType: 'text', //could ask for number,email,etc
    }
    $.extend(defaults, options);

    var _show = function(){
        var headClass = "navbar-default";
        switch (defaults.alertType) {
            case "primary":
                headClass = "alert-primary";
                break;
            case "success":
                headClass = "alert-success";
                break;
            case "info":
                headClass = "alert-info";
                break;
            case "warning":
                headClass = "alert-warning";
                break;
            case "danger":
                headClass = "alert-danger";
                break;
        }
        $('BODY').append(
            '<div id="ezAlerts" class="modal fade">' +
            '<div class="modal-dialog" class="' + defaults.modalSize + '">' +
            '<div class="modal-content">' +
            '<div id="ezAlerts-header" class="modal-header ' + headClass + '">' +
            '<button id="close-button" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>' +
            '<h4 id="ezAlerts-title" class="modal-title">Modal title</h4>' +
            '</div>' +
            '<div id="ezAlerts-body" class="modal-body">' +
            '<div id="ezAlerts-message" ></div>' +
            '</div>' +
            '<div id="ezAlerts-footer" class="modal-footer">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        );

        $('.modal-header').css({
            'padding': '15px 15px',
            '-webkit-border-top-left-radius': '5px',
            '-webkit-border-top-right-radius': '5px',
            '-moz-border-radius-topleft': '5px',
            '-moz-border-radius-topright': '5px',
            'border-top-left-radius': '5px',
            'border-top-right-radius': '5px'
        });

        $('#ezAlerts-title').html(defaults.headerText);
        $('#ezAlerts-message').html(defaults.messageText);

        var keyb = "false", backd = "static";
        var calbackParam = "";
        switch (defaults.type) {
            case 'alert':
                keyb = "true";
                backd = "true";
                $('#ezAlerts-footer').html('<button class="btn btn-' + defaults.alertType + '">' + defaults.okButtonText + '</button>').on('click', ".btn", function () {
                    calbackParam = true;
                    $('#ezAlerts').modal('hide');
                });
                break;
            case 'confirm':
                var btnhtml = '<button id="ezok-btn" class="btn btn-primary">' + defaults.yesButtonText + '</button>';
                if (defaults.noButtonText && defaults.noButtonText.length > 0) {
                    btnhtml += '<button id="ezclose-btn" class="btn btn-default">' + defaults.noButtonText + '</button>';
                }
                $('#ezAlerts-footer').html(btnhtml).on('click', 'button', function (e) {
                    if (e.target.id === 'ezok-btn') {
                        calbackParam = true;
                        $('#ezAlerts').modal('hide');
                    } else if (e.target.id === 'ezclose-btn') {
                        calbackParam = false;
                        $('#ezAlerts').modal('hide');
                    }
                });
                break;
            case 'prompt':
                $('#ezAlerts-message').html(defaults.messageText + '<br /><br /><div class="form-group"><input type="' + defaults.inputFieldType + '" class="form-control" id="prompt" /></div>');
                $('#ezAlerts-footer').html('<button class="btn btn-primary">' + defaults.okButtonText + '</button>').on('click', ".btn", function () {
                    calbackParam = [$('#prompt').val(), $("#WME_SN_CS_StartDate").val(), $("#WME_SN_CS_EndDate").val()];
                    $('#ezAlerts').modal('hide');
                });
                break;
        }

        $('#ezAlerts').modal({
            show: false,
            backdrop: backd,
            keyboard: keyb
        }).on('hidden.bs.modal', function (e) {
            $('#ezAlerts').remove();
            deferredObject.resolve(calbackParam);
        }).on('shown.bs.modal', function (e) {
            if ($('#prompt').length > 0) {
                $('#prompt').focus();
            }
        }).modal('show');
    }

    _show();
    return deferredObject.promise();
}

$("body").on('change','.WME_SN_CS_Reasons_Unlock',function(e){
    update_SN_CSPromptUnlock(e);
});

function update_SN_CSPromptUnlock(e) {
    let checked_Reasons=[];
    $('.WME_SN_CS_Reasons_Unlock:checkbox:checked').each(function () {
        checked_Reasons.push(this.value);
        if (this.id == "WME_SN_CS_Reasons_Unlock_other") {
            $("#prompt").show();
        } else {
            $("#prompt").hide();
        }
    });
    $("#prompt").val(checked_Reasons.join(", "));
}

$("body").on('change','.WME_SN_CS_Reasons',function(e){
    update_SN_CSPrompt(e);
});

function update_SN_CSPrompt(e) {
    $("#prompt").val(e.target.value);
    if (e.target.id == "WME_SN_CS_Reasons_other") {
        $("#prompt").show();
        $("#prompt").val("");
    } else {
        $("#prompt").hide();
    }
}

function openSlack(){
    window.open(WME_SN_CS[WME_SN_country].SlackURL, "_blank");
}

function showMessage(severity,message) {
    ezBSAlert({
        messageText: message,
        alertType: severity
    })
}

function log(message) {
    if (console.log) {
        console.log('%c '+WME_SN_Name+': %c' + message, 'color:black', 'color:#d97e00');
    }
}

log(WME_SN_Name+' - version ' + WME_SN_Version);
initUnlock();