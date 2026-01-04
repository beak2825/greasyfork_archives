// ==UserScript==
// @name         ML_PLUS2X
// @author       GinoLoSpazzino[ITA]
// @namespace    http://forumfrat.forumfree.it/
// @version      1.0
// @description  Script Vendetta2X
// @match        *vendetta2x.servegame.com/*
// @require      http://code.jquery.com/jquery-latest.min.js
// @license MIT
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_log
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/461329/ML_PLUS2X.user.js
// @updateURL https://update.greasyfork.org/scripts/461329/ML_PLUS2X.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var _VERS = "1.0.23",serverID,_PAGE,ELE_CLSS,refCLSS,_ORARIO,_DATA;

    $(document).ready(function(){
        String.prototype.replaceAll = function(search, replacement){var target = this; return target.split(search).join(replacement);};
        function ReplacePoint(strNum) { if (strNum.indexOf(".") != -1) { return parseInt(strNum.replace(/\./g, "").trim()); } else { return parseInt(strNum); } }
        function addGlobalStyle(css) { var head, style; head = document.getElementsByTagName('head')[0]; if (!head) { return; } style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css; head.appendChild(style); }

       /*################ GreaseMonkey pre 4.0 Version    ###############*/
        var GM = {
            gmEnabled: (typeof GM_getResourceURL == "function"),
            Esiste: function (nVal, EXP) {
            try {
                if(GM.gmEnabled){if (GM_getValue(nVal, null) !== null) {return GM_getValue(nVal);} else {if (EXP !== null){return EXP;}else{return false;}}}
            } catch (e) {
                console.log('[ GM.Esiste() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                console.log('  --------->  ' + e.message);
            }
            },
            Scrivi: function (nNom, nVal) {
            try {
                if (!nNom) {throw new Error(' GM_setValue( nNome= "' + nNom + '") ---> nNom non Esiste o null!!!');}else{if (GM.gmEnabled) { GM_setValue(nNom, nVal); }}
            } catch (e) {
                console.log('[ GM.Scrivi() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                console.log('  --------->  ' + e.message);
            }
            },
            Cancella: function (nVal) {
            try {
                if(GM.gmEnabled){GM_deleteValue(nVal);}
            } catch (e) {
                console.log('[ GM.Cancella() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                console.log('  --------->  ' + e.message);
            }
            },
        };
        /*################            UTILITY              ###############*/
        var JS = {
            getTagName: function (node, type, n) { if (node.getElementsByTagName(type).length > 0) { if (n >= 0) { return node.getElementsByTagName(type)[n]; } else { return node.getElementsByTagName(type); } } else { return null; } },
            getById: function (node, nid) { if (node.getElementById(nid)) { return node.getElementById(nid); } else { return false; } },
            Rimuovi: function (element) { if (element) element.parentNode.removeChild(element); }
        };
        var utils = {
            XML_HTTP_REQUEST: function(_url, _action){
            try{
                $.get(_url)
                .done(function(data) {
                    _action(data);
                })
                .fail(function() {
                    console.error('[-->  XML_HTTP_REQUEST(_url, _action) <--]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                    console.error('  --------->  ' + e.message);
                });
            }catch(e){
                console.error('[ utils.XML_HTTP_REQUEST(_url, _action) ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                console.error('  --------->  ' + e.message);
            }
            },
            RETURN_TimedaLivello(nome, refLVL, nLVL){
                var timing = 0, _TOT_TIME=0;
                switch(nome){
                        case "UfficiodelBoss": timing=900; break;
                        case "CampoAllenamento": timing=2000; break;
                        case "FabbricaArmi" : timing=500; break;
                        case "FabbricaMunizioni" : timing=600; break;
                        case "Distilleria" : timing=1000; break;
                        case "Bar" : timing=1500; break;
                        case "Contrabbando" : timing=4000; break;
                        case "MagazzinoArmi" : timing=9000; break;
                        case "MagazzinoMunizioni" : timing=12000; break;
                        case "MagazzinoAlcool" : timing=8000; break;
                        case "Cassaforte" : timing=16000; break;
                        case "CampoAddestramento" : timing=5600; break;
                        case "UfficiodellaSicurezza" : timing=6000; break;
                        case "TorretteAutomatiche" : timing=4500; break;
                        case "MineRadiocomandate" : timing=3000; break;
                        case "PianificazionedeiPercorsi" : timing=2000;break;
                        case "Pianificazionedellamissione" : timing=5000;break;
                        case "Riscossionedelreddito" : timing=3000;break;
                        case "Gestionedelreddito" : timing=14400;break;
                        case "Contrabbando" : timing=9600;break;
                        case "RaccoltaInformazioni" : timing=4200;break;
                        case "Appostamento" : timing=4000;break;
                        case "ProtezionedelGruppo" : timing=5000;break;
                        case "CombattimentoCorpoaCorpo" : timing=6200;break;
                        case "Combattimentoall\'ArmaBianca" : timing=5100;break;
                        case "AllenamentoalTiro" : timing=10000;break;
                        case "CostruzionediBombe" : timing=42000;break;
                        case "AllenamentodiGuerriglia" : timing=20000;break;
                        case "AllenamentoPsicologico" : timing=26000;break;
                        case "AddestamentoChimico" : timing=14400;break;
                        case "Onore" : timing=92000;break;
                        case "Servizio Militare" : timing=6000;break;
                }
                //_TOT_TIME = (900*46*46)/45 == 42.320
                return (timing*nLVL*nLVL)/refLVL;
            },
            SecToFormatT: function (varSEC) {
                var _gg = 0, _h = 0, _min = 0, sec = 0; var strTIME = '';

                if (parseInt(varSEC / 86400) > 0) { _gg = parseInt(varSEC / 86400); strTIME = _gg + 'GG '; varSEC = varSEC - (_gg * 86400); }
                if (parseInt(varSEC / 3600) > 0) { _h = parseInt(varSEC / 3600); if(_h<10){strTIME +='0';} strTIME += _h + 'H:' ; varSEC = varSEC - (_h * 3600); }
                if (parseInt(varSEC / 60) > 0) { _min = parseInt(varSEC / 60); if(_min<10){strTIME +='0';} strTIME += _min + ':'; varSEC = varSEC - (_min * 60); }

                if(Math.ceil(varSEC)<10){strTIME += Math.ceil(varSEC) + '0';}else{strTIME += Math.ceil(varSEC);}
                return strTIME;
            },
        };
        /*################            LISTENER              ###############*/
        var LISTENER = {
            EVNT_AddBtnPage: function(name){
                try{
                    var btnSavePosition = $('[name="btnSAVE_' + name + '"]');
                        btnSavePosition.bind('click', function(){
                            GM.Scrivi(serverID + '_' + this.id.split(';')[0] + '_y',this.id.split(';')[1]);
                            window.location.reload();
                        });
                    var btnHideRow = $('[name="btnHIDE_' + name + '"]');
                        btnHideRow.bind('click', function(){
                            var _HIDE=[];
                            $('#_divReset')[0].style.display = "";
                            if(GM.Esiste(serverID + '_' + this.id.split(';')[0] + '_HIDE')){
                                _HIDE = GM.Esiste(serverID + '_' + this.id.split(';')[0] + '_HIDE');
                            }
                            _HIDE.push(this.id.split(';')[1]);
                            GM.Scrivi(serverID + '_' + this.id.split(';')[0] + '_HIDE',_HIDE);
                            this.parentNode.parentNode.style.display = "none";
                            $('#' + this.id.split(';')[1] + '_1')[0].style.display = "none";
                        });
                    if($('#RESET_' + name)){
                        $('#RESET_' + name).bind('click', function(){
                            GM.Cancella( serverID + "_" + name + '_y');
                            GM.Cancella(serverID + '_' + name + '_HIDE');
                            window.location.reload();
                        });
                    }
                }catch(e){
                    console.error('[ --> LISTENER.EVNT_AddBtnPage() <-- ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                    console.error('  --------->  ' + e.message);
                }
            },
            EVNT_SETTING: function(name){
                try{
                    //Eventi IMPOSTAZIONI SCRIPT
                    if($('#SAVE_LVL_KONST')){
                        $('#SAVE_LVL_KONST').bind('click',function(){
                            if($('#Lvl_Futuri_konst')[0].value.indexOf('.')== -1 && $('#Lvl_Futuri_konst')[0].value.indexOf(',')== -1){
                                GM.Scrivi(serverID + '_LVL_FUT_konst',parseInt($('#Lvl_Futuri_konst')[0].value));
                                alert('Valore per calcolo Livelli successivi Stanze, Salvato!!!');
                            }else{
                                $('#Lvl_Futuri_konst')[0].value = 0;
                                confirm("Valore inserito non valido! Inserire una cifra numerica senza il punto/virgola come separatore di unita");
                            }
                        });
                    }
                    if($('#SAVE_LVL_FORSCH')){
                        $('#SAVE_LVL_FORSCH').bind('click',function(){
                            if($('#Lvl_Futuri_forsch')[0].value.indexOf('.')== -1 && $('#Lvl_Futuri_forsch')[0].value.indexOf(',')== -1){
                                GM.Scrivi(serverID + '_LVL_FUT_forsch',parseInt($('#Lvl_Futuri_forsch')[0].value));
                                alert('Valore per calcolo Livelli successivi Allenamenti, Salvato!!!');
                            }else{
                                $('#Lvl_Futuri_konst')[0].value = 0;
                                confirm("Valore inserito non valido! Inserire una cifra numerica senza il punto/virgola come separatore di unita");
                            }
                        });
                    }
                }catch(e){
                    console.error('[ --> LISTENER.EVNT_EVNT_SETTING() <-- ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                    console.error('  --------->  ' + e.message);
                }
            },
            EVNT_MISSIONI: function(){
                try{
                    //SOTTRAZIONI TRUPPE
                    var u_Moins = $('[name="moins"]');
                    for(var u_Moi=0; u_Moi < u_Moins.length; u_Moi++){
                        $('[name="moins"]')[u_Moi].addEventListener('click', function(){
                           var _operation = parseInt(this.id.split('_')[0]);
                           var id_unit = this.id.split('_')[1];
                           if(ReplacePoint($('#' + id_unit)[0].value)-_operation > 0){
                                $('#' + id_unit)[0].value = ReplacePoint($('#' + id_unit)[0].value)-_operation;
                           }
                        },false);
                    }
                    //AZZERA COUNT TRUPPE
                    var u_Reset = $('[name="reset"]');
                    for(var u_z=0; u_z < u_Reset.length; u_z++){
                        $('[name="reset"]')[u_z].addEventListener('click', function(){
                           var z_id_unit = this.id.split('_')[1];
                           $('#' + z_id_unit)[0].value = 0;
                        },false);
                    }
                    //ADDIZIONI TRUPPE
                    var u_Plus = $('[name="plus"]');
                    for(var u_Plu=0; u_Plu < u_Plus.length; u_Plu++){
                        $('[name="plus"]')[u_Plu].addEventListener('click', function(){
                           var _operation = parseInt(this.id.split('_')[0]);
                           var id_unit = this.id.split('_')[1];
                           var max_unit = ReplacePoint($('td',this.parentNode.parentNode)[0].innerHTML.split('(')[1]);
                           if(ReplacePoint($('#' + id_unit)[0].value) + _operation <= max_unit){
                                $('#' + id_unit)[0].value = ReplacePoint($('#' + id_unit)[0].value) + _operation;
                           }
                        },false);
                    }
                    //SALVA UNIT E DELETE SAVE UNIT
                    if($('[name="saveThis"]').length>0){
                        var u_Save = $('[name="saveThis"]')
                        for(var u_S=0; u_S < u_Save.length; u_S++){
                            $('[name="saveThis"]')[u_S].addEventListener('click', function(){
                                var id_unit = this.id.split('_')[3];
                                 var max_unit = ReplacePoint($('td',this.parentNode.parentNode)[0].innerHTML.split('(')[1].split(')')[0]);
                                if(ReplacePoint($('#' + id_unit)[0].value) > 0 && ReplacePoint($('#' + id_unit)[0].value) <= max_unit){
                                    $('[name="deleteThis"]',this.parentNode)[0].style="font-weight:bold";this.style = "display:none";
                                    GM.Scrivi(this.id, ReplacePoint($('#' + id_unit)[0].value));
                                }
                            },false);
                        }
                    }

                    if($('[name="deleteThis"]').length>0){
                        var u_Delete = $('[name="deleteThis"]')
                        for(var u_D=0; u_D < u_Delete.length; u_D++){
                            $('[name="deleteThis"]')[u_D].addEventListener('click', function(){
                                var id_unit = this.id.split('_')[3];
                                $('#' + id_unit)[0].value = 0;
                                $('[name="saveThis"]',this.parentNode)[0].style="font-weight:bold";this.style = "display:none";
                                GM.Cancella(this.id);
                            },false);
                        }
                    }
                }catch(e){
                    console.error('[ --> LISTENER.EVNT_EVNT_MISSIONI() <-- ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                    console.error('  --------->  ' + e.message);
                }
            },
            EVNT_MISS_RISORSE: function(){
                try{
                    //name="moins_res"
                    //SOTTRAZIONI RISORSE
                    var res_Moins = $('[name="moins_res"]');
                    for(var r_Moi=0; r_Moi < res_Moins.length; r_Moi++){
                        $('[name="moins_res"]')[r_Moi].addEventListener('click', function(){
                           var _menoRes = parseInt(this.id.split('_')[0]);
                           var id_unit = this.id.split('_')[1];
                           if(parseInt($('#' + id_unit)[0].value)- _menoRes > 0){
                                $('#' + id_unit)[0].value = parseInt($('#' + id_unit)[0].value)-_menoRes;
                           }
                        },false);
                    }
                    //ADDIZIONE RISORSE
                    var res_Pluis = $('[name="plus_res"]');
                    for(var r_Plus=0; r_Plus < res_Pluis.length; r_Plus++){
                        $('[name="plus_res"]')[r_Plus].addEventListener('click', function(){
                           var _piuRes = parseInt(this.id.split('_')[0]);
                           var id_unit = this.id.split('_')[1];
                           var max_res = 0;
                           switch(id_unit){
                                case 'ir1': max_res=ReplacePoint($('#mea')[0].textContent);break
                                case 'ir2': max_res=ReplacePoint($('#spa')[0].textContent);break
                                case 'ir3': max_res=ReplacePoint($('#ola')[0].textContent);break
                                case 'ir4': max_res=ReplacePoint($('#bea')[0].textContent);break
                           }
                           if(parseInt($('#' + id_unit)[0].value) + _piuRes < max_res){
                                $('#' + id_unit)[0].value = parseInt($('#' + id_unit)[0].value) + _piuRes;
                           }
                        },false);
                    }
                }catch(e){
                    console.log(e);
                }
            },
            CLASSIFICA: function () {
                //onClick SaveCLSS
                if (JS.getById(document, 'SaveCLSS')) {
                    JS.getById(document, 'SaveCLSS').addEventListener('click', function () {
                        GM.Scrivi('SAVE_SCORE',true);
                        CHANGE.SalvaClassifica();
                    }, false);
                }
                //DEACTIVE SELECTED CLSS -
                if (JS.getById(document, 'DISATTIVA_href')) {
                    JS.getById(document, 'DISATTIVA_href').addEventListener('click', function () {
                        GM.Cancella(serverID + '_hs_ref');
                        window.location.reload();
                    }, false);
                }
                //SALVA DELTA SEMI-INATTIVI/FALSI-ATTVI
                if (JS.getById(document, 'saveDELTA')) {
                    JS.getById(document, 'saveDELTA').addEventListener('click', function () {
                        GM.Scrivi(serverID+'_DELTA',JS.getById(document,'onDELTA').value);
                        window.location.reload();
                    }, false);
                }
                //btnACTIVE - Attiva o Cambia una classifica dall'elenco
                //document.getElementsByTagName('button')
                var btnAct = document.getElementsByName('btnACTIVE');
                for (var b = 0; b < btnAct.length; b++) {
                    btnAct[b].addEventListener('click', function () {
                        //ACTIVE_08/12/2017 13:33:22
                        /* s1_hs_ref */ GM.Scrivi(serverID + '_hs_ref' , this.id.split('_')[1]);
                        GM.Cancella('SAVE_SCORE');
                        GM.Cancella('datasaveSCORE');
                        window.location.reload();
                        //$('[href=\"score.php\"]')[0].click()
                    }, false);
                }
                //btnDELETE - CANCELLA LA CLASSIFICA PRESA IN CONSIDERAZIONE (? Anche l'ultima)
                var btnDel = document.getElementsByName('btnDELETE');
                for (var _b = 0; _b < btnAct.length; _b++) {
                    btnDel[_b].addEventListener('click', function () {
                        // [ID] DELETE_08/12/2017 20:23:43
                        if( confirm( 'Confermi cancellazione classifica del ' + this.id.split('_')[1] + '?' ) ) {
                            CHANGE.CancellaClassifica(this.id);
                            //hs_del(hs, serverID, this.id.replace('CANCELLA',''));
                        }
                    }, false);
                }
            }
        };
        /*###############################################################################################################*/
        var CHANGE = {
            CalcolaCR: function(){
                try{
                    //datiCR = [CapA | CapM | CapAl | CapD]
                    var datiCR = [],_tmp=0;
                    var ElencoRowCR = $('tr',$('table')[$('table').length-1]);
                    //Trovo Indice REPORT
                    for (var dp=0; dp < ElencoRowCR.length;dp++){
                        if(ElencoRowCR[dp].innerHTML.indexOf('Dettagli Edificio') != -1){
                            _tmp=parseInt(JS.getTagName(ElencoRowCR[dp+8],'th',-1)[1].innerHTML);datiCR[0]=(_tmp*15000)+1000;
                            _tmp=parseInt(JS.getTagName(ElencoRowCR[dp+9],'th',-1)[1].innerHTML);datiCR[1]=(_tmp*15000)+1000;
                            _tmp=parseInt(JS.getTagName(ElencoRowCR[dp+10],'th',-1)[1].innerHTML);datiCR[2]=(_tmp*15000)+1000;
                            _tmp=parseInt(JS.getTagName(ElencoRowCR[dp+11],'th',-1)[1].innerHTML);datiCR[3]=(_tmp*15000)+1000;
                            //CALCOLO RIS RUBABILI SPIATA
                            _tmp = parseInt(JS.getTagName(ElencoRowCR[dp+17],'th',-1)[1].innerHTML.replace(".",""));datiCR[4]= _tmp - datiCR[0];
                            if(datiCR[4]>0){
                                JS.getTagName(ElencoRowCR[dp+17],'th',-1)[1].innerHTML += '&nbsp;&nbsp;&nbsp;<font style="color:green;font-weight:bold;size:11pt"> [+ ' + datiCR[4].toLocaleString('it')  + '  ]</font>';
                            }
                            _tmp = parseInt(JS.getTagName(ElencoRowCR[dp+18],'th',-1)[1].innerHTML.replace(".",""));datiCR[5]= _tmp - datiCR[1];
                            if(datiCR[5]>0){
                                JS.getTagName(ElencoRowCR[dp+18],'th',-1)[1].innerHTML += '&nbsp;&nbsp;&nbsp;<font style="color:green;font-weight:bold;size:11pt"> [+ ' + datiCR[5].toLocaleString('it')  + '  ]</font>';
                            }
                            _tmp = parseInt(JS.getTagName(ElencoRowCR[dp+19],'th',-1)[1].innerHTML.replace(".",""));datiCR[6]= _tmp - datiCR[2];
                            if(datiCR[6]>0){
                                JS.getTagName(ElencoRowCR[dp+19],'th',-1)[1].innerHTML += '&nbsp;&nbsp;&nbsp;<font style="color:green;font-weight:bold;size:11pt"> [+ ' + datiCR[6].toLocaleString('it')  + '  ]</font>';
                            }
                            _tmp = parseInt(JS.getTagName(ElencoRowCR[dp+20],'th',-1)[1].innerHTML.replace(".",""));datiCR[7]= _tmp - datiCR[3];
                            if(datiCR[7]>0){
                                JS.getTagName(ElencoRowCR[dp+20],'th',-1)[1].innerHTML += '&nbsp;&nbsp;&nbsp;<font style="color:green;font-weight:bold;size:11pt"> [+ ' + datiCR[7].toLocaleString('it')  + '  ]</font>';
                            }

                            /*if((ReplacePoint(tabRISORSE[1].children[1].textContent) - datiCR[5]) > 0){
                                    datiCR[9] = ReplacePoint(tabRISORSE[1].children[1].textContent) - datiCR[5];
                                    tabRISORSE[1].children[1].innerHTML += '&nbsp;&nbsp;&nbsp;<font style="color:green;font-weight:bold;size:11pt"> [ ' + datiCR[9].toLocaleString('it')  + '  ]</font>';
                            }*/
                        }
                    }
                    //console.log(JS.getTagName(ElencoRowCR[8],'th',-1)[0].innerHTML);
                    /*
                    for(var cr=2; cr < ElencoRowCR.length; cr++){
                        if($('input', ElencoRowCR[cr]).length > 0){
                            var datiCR = [];
                            //datiCR = [ID_CR | ID_PLAYER | NOME | COORDS  --------> NON ATTIVI ;  DATA | CapA | CapM | CapAl | CapD]
                            datiCR[0] = parseInt($('input', ElencoRowCR[cr])[0].value);
                            datiCR[1] = parseInt($('a', ElencoRowCR[cr])[1].href.split('p=')[1]);
                            datiCR[2] = $('a', ElencoRowCR[cr])[1].textContent;
                            datiCR[3] = $('a', ElencoRowCR[cr])[0].textContent.split(' ')[0];
                            datiCR[4] = '';

                            //console.log('N° COMBAT REPORT : ' + datiCR[0] + ' ----> ' + $('table',JS.getById(document,datiCR[0])).length);
                            if($('table',JS.getById(document,datiCR[0])).length > 3){
                                //Spiata con DETTAGLIO EDIFICIO E RISORSE ATTUALI RUBABILI
                                var tabDETTAGLI = $('tr',$('table',JS.getById(document,datiCR[0]))[2]);
                                //RICAVO DATI MAGAZZINI EDIFICIO
                                datiCR[5]=1000;datiCR[6]=1000;datiCR[7]=1000;datiCR[8]=1000;
                                for(var tbD=1; tbD < tabDETTAGLI.length; tbD++){
                                    //$('tr',$('table',document.getElementById('58072'))[2])[1].children[0].textContent;
                                    if(tabDETTAGLI[tbD].children[0].textContent == 'Magazzino Armi'){
                                        datiCR[5] = parseInt((parseInt(tabDETTAGLI[tbD].children[1].textContent) * 15000)+1000);
                                    }else if(tabDETTAGLI[tbD].children[0].textContent == 'Magazzino Munizioni'){
                                        datiCR[6] = parseInt((parseInt(tabDETTAGLI[tbD].children[1].textContent) * 15000)+1000);
                                    }else if(tabDETTAGLI[tbD].children[0].textContent == 'Magazzino Alcool'){
                                        datiCR[7] = parseInt((parseInt(tabDETTAGLI[tbD].children[1].textContent) * 15000)+1000);
                                    }else if(tabDETTAGLI[tbD].children[0].textContent == 'Cassaforte'){
                                        datiCR[8] = parseInt((parseInt(tabDETTAGLI[tbD].children[1].textContent) * 15000)+1000);
                                    }

                                }
                                //RICAVO DATI RISORSE EDIFICIO
                                datiCR[9]=0;datiCR[10]=0;datiCR[11]=0;datiCR[12]=0;
                                var tabRISORSE = $('tr',$('table',JS.getById(document,datiCR[0]))[3]); var tmpRis=0;

                                if((ReplacePoint(tabRISORSE[1].children[1].textContent) - datiCR[5]) > 0){
                                    datiCR[9] = ReplacePoint(tabRISORSE[1].children[1].textContent) - datiCR[5];
                                    tabRISORSE[1].children[1].innerHTML += '&nbsp;&nbsp;&nbsp;<font style="color:green;font-weight:bold;size:11pt"> [ ' + datiCR[9].toLocaleString('it')  + '  ]</font>';
                                }
                                if((ReplacePoint(tabRISORSE[2].children[1].textContent) - datiCR[6]) > 0){
                                    datiCR[10] = ReplacePoint(tabRISORSE[2].children[1].textContent) - datiCR[6];
                                    tabRISORSE[2].children[1].innerHTML += '&nbsp;&nbsp;&nbsp;<font style="color:green;font-weight:bold;size:11pt"> [ ' + datiCR[10].toLocaleString('it')  + '  ]</font>';
                                }
                                if((ReplacePoint(tabRISORSE[3].children[1].textContent) - datiCR[7]) > 0){
                                    datiCR[11] = ReplacePoint(tabRISORSE[3].children[1].textContent) - datiCR[7];
                                    tabRISORSE[3].children[1].innerHTML += '&nbsp;&nbsp;&nbsp;<font style="color:green;font-weight:bold;size:11pt"> [ ' + datiCR[11].toLocaleString('it')  + '  ]</font>';
                                }
                                if((ReplacePoint(tabRISORSE[4].children[1].textContent) - datiCR[8]) > 0){
                                    datiCR[12] = ReplacePoint(tabRISORSE[4].children[1].textContent) - datiCR[8];
                                    tabRISORSE[4].children[1].innerHTML += '&nbsp;&nbsp;&nbsp;<font style="color:green;font-weight:bold;size:11pt"> [ ' + datiCR[12].toLocaleString('it')  + '  ]</font>';
                                }
                                tmpRis = datiCR[12] + datiCR[11] + datiCR[10] + datiCR[9];
                                //STAMPO RISULTATI
                                if(tmpRis>0){
                                    var tdRisRUBABILI = document.createElement('tr');
                                    tdRisRUBABILI.innerHTML =   '<td colspan="2"><font style="color:green;font-weight:bold;size:11pt;text-align:right">' +
                                                                'Trasporta : [ ' + parseInt((tmpRis/40000)+1).toLocaleString('it') + ' ]&nbsp;&nbsp;&nbsp;' +
                                                                'Imballa : [ ' + parseInt((tmpRis/10000)+1).toLocaleString('it') + ' ]</font></td>';

                                    $('table',JS.getById(document,datiCR[0]))[3].append(tdRisRUBABILI);
                                }
                            }

                            if($('table',JS.getById(document,datiCR[0])).length > 0){
                                //CALCOLO PERFECT
                                //DA COMPLETARE in (Vers 2.6 o successive!!!!)
                            }
                        }
                    }
                    */
                }catch(e){
                    console.log('[ xCHANGE.CalcolaCR() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                    console.log('  --------->  ' + e.message);
                }
            },
            CancellaClassifica : function(ID_DEL){
                try{
                    //console.log('CANCELLA CALSSIFICA [ ' + _REF.split('_')[1] + ' ] - attiva!');
                    if(typeof GM_deleteValue == 'function'){
                        /* 08/12/2017 20:23:54 */ var CLS = ID_DEL.split('_')[1];
                        var eleSCORE = GM.Esiste(serverID+'_CLSS');
                        //Controlla che non sia la classifica di riferimento
                        /*"s1_hs_ref": "09/12/2017 13:28:43"*/ var CLS_REF = GM.Esiste(serverID + '_hs_ref'); var _CONTINUE = true;
                        if(CLS == CLS_REF){
                                if( !confirm( 'La classifica selezionata corrisponde a quella di rifimento impostata. Cancellarla ugualmente ?' ) ) {
                                    _CONTINUE = false;
                                }else{GM.Cancella(serverID + '_hs_ref');}
                        }
                        if(_CONTINUE){
                            //CANCELLA DA ELENCO CLASSIFICE
                            var clsIndex = eleSCORE.indexOf(CLS);
                            if(clsIndex > -1){ eleSCORE.splice(clsIndex, 1);}
                            GM.Scrivi(serverID+'_CLSS',eleSCORE);

                            //CANCELLA VALUE PLAYER COLLEGATI
                            if(typeof GM_listValues !== 'undefined'){
                                var vals = JSON.parse(JSON.stringify(cloneInto(GM_listValues(), window)));
                                for(var d_GM = 0; d_GM < vals.length; d_GM++){
                                    if(vals[d_GM].indexOf(CLS) != -1){
                                        //console.log('#' + CLS +'# : ' + name );
                                        GM.Cancella(vals[d_GM]);
                                    }
                                }
                            }
                            //METHOD FOR VERSION FF > 33
                            /*let GMValue = GM_listValues(); let cnt=0;
                            for(let name of GMValue){
                                if(name.indexOf(CLS) != -1){
                                    //console.log('#' + CLS +'# : ' + name );
                                    GM.Cancella(name);
                                }
                            }*/
                            if(confirm('CANCELLAZIONE CLASSIFICA del ' + CLS + ' AVVENUTA CON SUCCESSO!!')){
                                window.location.reload();
                            }
                        }
                    }else{
                        if( confirm( 'La tua versione di greasemonkey non supporta\nla cancellazione delle classifiche salvate.\nVuoi eseguire adesso l\'upgrade?' ) ) {
                            //var dl_url = window.open("http://www.webalice.it/ganja_man/mitm/", "Greasemonkey Update by mitm (mitm@hotmail.it)");
                        }
                    }
                }catch(e){
                    console.log('[ xHTM.CancellaClassifica() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                    console.log('  --------->  ' + e.message);
                }
            },
            ConfrontaCLSS : function(){
                try {
                    JS.getTagName(document,'table',4).id="tabSCORE";var trCls = $('#tabSCORE tr');

                    //for(var c_cls=13; c_cls < 14; c_cls++){
                    for(var c_cls=5; c_cls < trCls.length; c_cls++){
                        var tdCls = trCls[c_cls].getElementsByTagName('th'), DATI=[], _saveDATI=[], _CONFRONTO=[];
                        var _playerID = JS.getTagName(tdCls[2],'a',0).href.split('r=')[1]?JS.getTagName(tdCls[2],'a',0).href.split('r=')[1]:false;
                        if(_playerID){
                            //DATI = {POSIZIONE/InfoAccount[Vacanza-Ban-Inactive]/NomePlayer FAMIGLIA/PtAllenam/PtEdifici/PtUnita/PtAccount/NumeroEDIFICI}
                            DATI = CHANGE.RicavaDatidaROW(tdCls);

                            //RECUPERO STORICO PLAYER
                            var nCLSS = CHANGE.EsisteDATA(_playerID);
                            if(nCLSS.length > 0){
                                //LNK STORICO PLAYER ON POS (dettaglio_player)
                                tdCls[0].innerHTML = '<div><font style="cursor:pointer" name=' + DATI[1] + ' id=det_' + _playerID  + '><b>' + DATI[0] + '</b></font></div>';
                                //LISTENER DETTAGLIO_PLAYER
                                //Function EsisteData(player_id)<--- true/false;
                                if($('#det_'+_playerID)[0]){
                                    $('#det_'+_playerID).bind('click', function(){
                                        var pl_id = this.id.replace('det_', '');
                                        var pl_name = this.getAttribute("name");
                                        var tr = this.parentNode.parentNode.parentNode;
                                        CHANGE.DettaglioPlayer(pl_id, pl_name, tr);
                                    });
                                }
                                //ESCLUDE DAL CONFRONTO PLAYER BANNATI O IN VACANZA
                                if(tdCls[1].textContent==''){
                                    //Esiste_save_href
                                    //vendetta2x_03/03/2023_15:37:41/122
                                    if(GM.Esiste(serverID + '_' + refCLSS + '/' + _playerID,false)){
                                        //Confronto HREF <---> ROW
                                        _saveDATI = GM.Esiste(serverID + '_' + refCLSS + '/' + _playerID);
                                        /* Controllo Dati Player */ _CONFRONTO = CHANGE.ConfrontaPunteggi(DATI,_saveDATI);
                                        /* GRAFICA_PL(TypeAcc,eleTD,DIFF) */ CHANGE.GRAFICA_PL(DATI[8], tdCls, _CONFRONTO);
                                    }else{
                                        //console.log('non esiste nei save');
                                        //NO-SAVE IN REF_SCORE
                                        //CHANGE.GRAFICA_PL('NOSAVE', tdCls, []);
                                    }
                                }else{
                                    //VACANZA-BAN-INATTIVO(7/14)
                                    CHANGE.GRAFICA_PL(DATI[8], tdCls, []);
                                }
                            }
                        }

                    }
                }catch(e){
                    console.log('[ xHTM.ConfrontaCLSS() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                    console.log('  --------->  ' + e.message);
                }
            },
            ConfrontaPunteggi: function(_new,_old){
                try{
                   var CONFRONTO = [0,0,0,0,0,0];
                   //DATI = {0POSIZIONE/1NomePlayer/2FAMIGLIA/3PtAllenam/4PtEdifici/5PtUnita/6PtAccount/7NumeroEDIFICI/8InfoAccount[Vacanza-Ban-Inactive]/9NATIONAL}
                    //Array(9) [ "1", "Alan@lilli", "[CORLEONE]", "286", "4554", "437", "5277", "5", "" ]
                   //_saveDATI = [0POSIZIONE/1NomePlayer/2FAMIGLIA/3PtAllenam/4PtEdifici/5PtUnita/6PtAccount/7NumeroEDIFICI/8BAN-VAC-7/14/9NATIONALITY]
                    //Array(9) [ "41", "Alan@lilli", "[Ndrina]", "236", "3252", "186", "3674", "5", "" ]

                   //Array(6) [ 40, 50, 1302, 251, 1603, 0 ]
                   CONFRONTO [0] = parseInt(_old[0])-parseInt(_new[0]);
                   CONFRONTO [1] = parseInt(_new[3])-parseInt(_old[3]);
                   CONFRONTO [2] = parseInt(_new[4])-parseInt(_old[4]);
                   CONFRONTO [3] = parseInt(_new[5])-parseInt(_old[5]);
                   CONFRONTO [4] = parseInt(_new[6])-parseInt(_old[6]);
                   CONFRONTO [5] = parseInt(_new[7])-parseInt(_old[7]);
                   return CONFRONTO;
               }catch(e){
                  console.log('[ xHTM.ConfrontaPunteggi() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                  console.log('  --------->  ' + e.message);
               }
            },
            CompletaMenuCLSS: function(){
                try {
                    if(!$('#onDELTA')[0]){
                        var _ref_SCORE = refCLSS ? refCLSS : 'NESSUNA CLASSIFICA';
                        var valDELTA = GM.Esiste(serverID + '_DELTA',0);

                        $('#mitm')[0].innerHTML += '<hr>' +
                                                    '<p align="left"><b><font color="white" size="2">&nbsp; CLASSIFICA SELEZIONATA : </font>' +
                                                    '&nbsp;<font color="yellow" size="2">' + _ref_SCORE + '</b></font>&nbsp;&nbsp;'+
                                                    '<button type="button" style="font-size:11pt" id="DISATTIVA_href">Disattiva</button></p>' +
                                                    '<p align="left"><font color="#0062E1" size="2"><b>&nbsp;Delta semi-inattivi &nbsp;&nbsp;</b></font>'+
                                                    '<input id="onDELTA" name="delta_box" value="'+ valDELTA + '" maxlength="20" size="6" type="text">&nbsp;&nbsp;' +
                                                    '<button type="button" style="font-size:11pt" id="saveDELTA">Save</button></font></p><br />';

                        if(!refCLSS){$('#DISATTIVA_href')[0].style.display="none";}

                        for(var cmc=0; cmc < ELE_CLSS.length; cmc++){
                            if(!JS.getById(document,'ACTIVE_'+ ELE_CLSS[cmc])){
                                $('#mitm')[0].innerHTML += '<p align="left"><font size="2"><b>&nbsp;Classifica del ' + ELE_CLSS[cmc] + '</b></font>' +
                                        '&nbsp;&nbsp;<button type="button" name="btnACTIVE" style="font-size:11pt" id="ACTIVE_' + ELE_CLSS[cmc] + '">Attiva</button>' +
                                        '&nbsp;&nbsp;<button type="button" name="btnDELETE" style="font-size:11pt" id="DELETE_' + ELE_CLSS[cmc] + '">Cancella</button></p>';
                            }
                        }
                        //MODIFICA PAGINA CLASSIFICA CSS
                        //document.getElementById('tabSCORE').style.width = "100%"
                        //document.getElementsByName('right')
                        console.log(document.getElementsByTagName('div')[document.getElementsByTagName('div').length-1].innerHTML);
                        //var menu_lat = document.getElementsByTagName('div')[document.getElementsByTagName('div').length-1];
                        //menu_lat.parentNode.removeChild(menu_lat);
                        //console.log('fine prima parte');
                        //document.getElementsByClassName('div_page').style.width = "90%";
                    }
                    LISTENER.CLASSIFICA();
                } catch (e) {
                    console.log('[ xHTM.CompletaMenuCLSS() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                    console.log('  --------->  ' + e.message);
                }
            },
            DettaglioPlayer: function(_id, _nome, _DATI){
                try{
                    //ACT_DATI = [POSIZIONE | NOME | FAMIGLIA | ALL | EDIFICI | UNITA | P_TOT | N_EDIF | INFO |NATIONAL ]
                    var ACT_DATI = CHANGE.RicavaDatidaROW(JS.getTagName(_DATI,'td',-1));

                    var dettaglio = window.open("", "_blank dettaglio_player_" + _id);
                        dettaglio.document.open("text/html");

                    var html = '<html><head><title>Dettaglio ' + ACT_DATI[1] + '</title>' +
                               '<style type="text/css"><!--' +
                               '  .title_DettP{color:whitesmoke;font-size:24pt; border: solid 2px orange; font-family:\'AR CENA\';text-align:center;width:1000px}' +
                                '   .MenuCLSS{visibility:visible; align:left;font-family: Verdana, Geneva, sans-serif; color: white}' +
                                '   .tabRP_title{color: white;font-size: 14pt;font-weight:400;font-style: normal;text-decoration: none;font-family: Calibri, sans-serif;text-align: center;'+
                                               'vertical-align: middle;white-space: nowrap;border-style: none;border-color: inherit;border-width: medium;padding: 0px;background: #6E0000;}'+
                                '   .tabRP_row{height: 10pt;color: windowtext;font-size: 13pt;font-weight: 900;font-style: normal;text-decoration: none;font-family: Calibri, sans-serif;' +
                                              'text-align: center;vertical-align: bottom;white-space: nowrap;border-style: none;border-color: inherit;border-width: medium;padding: 0px;background: #DFDBC9; }' +
                                '   .Attivo {font-size:11pt;font-weight: bold;color:#00FF00 !important}' +
                                '   .SemiAttivo {font-size:11pt;font-weight: bold;color:#0062E1 !important}' +
                                '   .Decremento {font-size:11pt;font-weight: bold;background-color:yellow;color:red !important}' +
                                '   .Inattivo {font-size:11pt;font-weight: bold;color:orange !important}' +
                                '   .Ban {font-size:11pt;font-weight: bold;color:#FFE1DC !important}' +
                                '   .Vacanza {font-size:11pt;font-weight: bold;color:#82E0FF !important}' +
                                '   .Noob {font-size:11pt;font-weight: bold;color:yellow !important}'+
                                '   .NoSave {font-size:11pt;font-weight: bold;color:white !important}' +
                                '   .Famiglia {font-size:11pt;font-weight: bold;color:black !important}' +
                                '   .Io {font-size:11pt;font-weight: bold;color:white !important}' +
                               '--></style>' +
                               '</head><body bgcolor=black>' +
                               '<h1 class="title_DettP">DETTAGLIO PLAYER &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ' + ACT_DATI[1].toUpperCase() + '</h1>';

                        html += CHANGE.CreaHeaderDETTAGLIO_P(_id, ACT_DATI, _SCORE[_SCORE.length-1]);
                        var elencoCLSS_Player = CHANGE.EsisteDATA(_id);
                        html += CHANGE.CreaTableStorico_DETTAGLIO_P(_id, elencoCLSS_Player);

                        html += '<p><a href="javascript:void(null);" onClick="window.close();"><font color=gray>Chiudi</font></a></p></body></html>';
                        dettaglio.document.write(html);
                        dettaglio.document.close();
                }catch(e){
                    console.log('[ xHTM.DettaglioPlayer() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                    console.log('  --------->  ' + e.message);
                }
            },
            EsisteDATA: function(player_id){
                try{
                    var _ELE_PLAYER=[];
                    //vendetta2x_02/03/2023_19:58:29/48
                    for(var ex_data=0; ex_data < ELE_CLSS.length; ex_data++){
                        if(GM.Esiste(serverID + '_' + ELE_CLSS[ex_data] + '/' + player_id)){
                            var EPLtmp = GM.Esiste(serverID + '_' + ELE_CLSS[ex_data] + '/' + player_id);
                            EPLtmp.push(ELE_CLSS[ex_data]);
                            _ELE_PLAYER.push(EPLtmp);
                        }
                    }
                    return _ELE_PLAYER;
                }catch(e){
                    console.log('[ xHTM.EsisteDATA(player_id) ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                    console.log('  --------->  ' + e.message);
                }
            },
            GRAFICA_PL: function(_NOTE, _RIGHE, _DIFF){
                try{
                    ////TypeAccount : NOSAVE | NOOB | IO | FAMIGLIA | ATTIVO | SEMI-ATTIVO| DECREM ATTIVO | DECREM INATT | INATTIVO | 7 | 14 | VACANZA | BAN
                    //Array(6) [ 40, 50, 1302, 251, 1603, 0 ]
                    var className='', bg_color='black';
                    var sign = parseInt(_DIFF[4])>0 ? "+" : "";
                    if (_NOTE == ''){
                        ////TypeAccount : ATTIVO | SEMI-ATTIVO| DECREM ATTIVO | DECREM INATT | INATTIVO
                        //DIFF[0_POS/1_ALL/2_EDIF/3_UNIT/4_TOT/5_EDIF]
                        if(_DIFF[4]>0){
                            if(_DIFF[4] <= parseInt(GM.Esiste(serverID+'_DELTA',0))){/* PLAYER SEMI-ATTIVO */ className='SemiAttivo';}else{/* PLAYER ATTIVO */ className='Attivo';}
                            _RIGHE[2].innerHTML += '&nbsp;&nbsp;&nbsp;<font>[ ' + sign + '&nbsp;' + parseInt(_DIFF[4]).toLocaleString('it') + ' ]</font>';
                        }else if(_DIFF[4]<0){
                            if(_DIFF[1]>0 || _DIFF[2]>0){
                                _RIGHE[2].innerHTML += '&nbsp;&nbsp;&nbsp;<font>[ ' + sign + '&nbsp;' +  parseInt(_DIFF[4]).toLocaleString('it') + ' ]</font>';
                                /* DECREMENTO PLAYER ATTIVO */ if(parseInt(_DIFF[4]) >= parseInt(GM.Esiste(serverID+'_DELTA',0))){className='Attivo';}else{className='SemiAttivo';}
                            }else{/* DECREMENTO PLAYER INATTIVO */ className='Inattivo';}
                        }else{/* PLAYER INATTIVO */ className='Inattivo';}
                        //DIFFERENZA PT STANZE
                        if(_DIFF[2]>0){_RIGHE[4].innerHTML += '&nbsp;&nbsp;&nbsp;<font>[+ ' + _DIFF[2].toLocaleString('it') + ' ]';}
                        //DIFFERENZA PT ALLENAMENTI
                        if(_DIFF[1]>0){_RIGHE[3].innerHTML += '&nbsp;&nbsp;&nbsp;<font>[+ ' + _DIFF[1].toLocaleString('it') + ' ]';}
                    }else{
                        ////TypeAccount : NOSAVE | 7 | 14 | VACANZA | BAN
                        if(_NOTE == 'NOSAVE'){ className='NoSave';}
                        if(_RIGHE[1].innerHTML.indexOf('Vacation')!=-1){
                            className="Vacanza";
                        }else{
                            className="Inattivo";
                        }
                    }
                    //MEMBRI ALLEANZA /IO
                    if(_RIGHE[2].parentNode.innerHTML.indexOf('hightlightha')!=-1){
                        /* TypeAccount : PLAYER FAMIGLIA */ className='Famiglia'; /*color = 'black';*/ bg_color = '#66cd00';
                    }else if(_RIGHE[2].parentNode.innerHTML.indexOf('hightlighthc')!=-1){
                        /* TypeAccount : IO */ className='Io'; /*color = 'white';*/ bg_color = '#008b8b';
                    }
                    //settaCOLORI
                    for(var sc_td=1; sc_td < _RIGHE.length; sc_td++){ _RIGHE[sc_td].className = className;  _RIGHE[sc_td].style="background-color:" + bg_color;}  //td.className = 'Inattivo'
                    for(var sc_a=0; sc_a < JS.getTagName(_RIGHE[2],'a',-1).length; sc_a++){JS.getTagName(_RIGHE[2],'a',sc_a).className=className;}
                    //_RIGHE[2].innerHTML += '&nbsp;&nbsp;&nbsp;<font>[ ' + sign + '&nbsp;' + parseInt(_DIFF[4]).toLocaleString('it') + ' ]</font>';

                    if(_NOTE == ''){
                        //DIFFERENZA PT UNITA
                        if (_DIFF[3]>0) {
                            _RIGHE[5].innerHTML += '&nbsp; [ + ' + _DIFF[3].toLocaleString('it') + ']';
                        }else if(_DIFF[3]<0){
                            _RIGHE[5].innerHTML += '&nbsp; <font class="Decremento">[&nbsp; ' + _DIFF[3].toLocaleString('it') + '&nbsp;]</font>'; //_RIGHE[6].className='Decremento';
                            /*if(_DIFF[4]<0){
                                _RIGHE[2].innerHTML += '&nbsp;&nbsp;<font class="Decremento">[&nbsp;&nbsp; ' + _DIFF[4].toLocaleString('it') + '&nbsp;&nbsp; ]</font>';
                            }*/
                        }
                        //DIFFERENZA NUM EDIFICI
                        if (_DIFF[5]>0) {
                            _RIGHE[7].innerHTML += '&nbsp&nbsp [ + ' + _DIFF[5] + ' ]';
                        }else if(_DIFF[5]<0){
                            _RIGHE[7].innerHTML += '&nbsp&nbsp <font class="Decremento"> [ ' + _DIFF[5] + ' ]</font>'; //_RIGHE[8].className='Decremento';
                        }
                        //for(var sc_fnt=0; sc_fnt < JS.getTagName(_RIGHE[2],'font',-1).length; sc_fnt++){JS.getTagName(_RIGHE[2],'font',sc_fnt).className = className; }
                    }
                }catch(e){
                    console.log('[ xHTM.Grafica_PL() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                    console.log('  --------->  ' + e.message);
                    console.log(_RIGHE[0].parentNode.innerHTML);
                }
            },
            MenuCLSS : function () {
                try {
                    //CLASSIFICA ---> document.getElementsByTagName('table')[4]
                    //var mitmDiv = document.createElement('div'); mitmDiv.id="mitm"; mitmDiv.style="width:" + parseInt(($(document).width() * 90)/100); mitmDiv.className="MenuCLSS";
                    var mitmDiv = document.createElement('div'); mitmDiv.id="mitm"; mitmDiv.className="MenuCLSS";
                    document.getElementsByTagName('table')[4].parentNode.append(mitmDiv);
                    $('#mitm')[0].innerHTML = '<p><b><font id="testo" size="3" color="orange">&nbsp;Calcolo Inattivi [Script originale by mitm] &nbsp;&nbsp;&nbsp; [Versione : ' + _VERS + ']' +
                                              '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a size="3" style="color:yellow" href="http://fakedeusrev.altervista.org/INFO_VERSIONE.html" target="_blank">INFO SCRIPT </a>&nbsp;&nbsp;[...IN LAVORAZIONE, MA LEGGERMENTE UTILE...]</font></b></p>' +
                                              '<button id="SaveCLSS" style="border: none; padding: 14px 28px;background-color: #4CAF50;">SALVA NUOVA CLASSIFICA</button>';
                    if($('#SaveCLSS')[0]){
                        $('#SaveCLSS').bind('click', function() {
                            GM.Scrivi('SAVE_SCORE',true);
                            CHANGE.SalvaClassifica();
                        });
                    }
                } catch (e) {
                    console.log('[ xHTM.MenuCLSS() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                    console.log('  --------->  ' + e.message);
                }
            },
            SPIATE: function(){
                try{
                    CHANGE.CalcolaCR();
                }catch(e){
                    console.error('[ --> CHANGE.MESSAGGI() <-- ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                    console.error('  --------->  ' + e.message);
                }
            },
            RicavaDatidaROW: function(_row){
                try{
                    var _datiRICAVATI = [];

                    _datiRICAVATI[0] = _row[0].textContent; //Posizione
                    _datiRICAVATI.push(JS.getTagName(_row[2], 'a',0).textContent);//NickPlayer
                    if(JS.getTagName(_row[2], 'a',-1).length > 1){_datiRICAVATI.push(JS.getTagName(_row[2], 'a',1).textContent.trim());}else{_datiRICAVATI.push('');} //Ally
                    _datiRICAVATI.push(_row[3].textContent.replaceAll('.',''));//PtAllenam
                    _datiRICAVATI.push(_row[4].textContent.replaceAll('.',''));//PtEdif
                    _datiRICAVATI.push(_row[5].textContent.replaceAll('.',''));//PtUnit
                    _datiRICAVATI.push(_row[6].textContent.replaceAll('.',''));//TOT_PT
                    _datiRICAVATI.push(_row[7].textContent.replaceAll('.',''));//NumEdif
                     _datiRICAVATI.push(_row[1].textContent);//[Vacanza-Ban-Inactive]
                    //_STRINGA = POSIZIONE/NomePlayer/FAMIGLIA/PtAllenam/PtEdifici/PtUnita/PtAccount/NumeroEDIFICI/InfoAccount[Vacanza-Ban-Inactive]

                    return _datiRICAVATI;
                }catch(e){
                    console.log('[ xHTM.RicavaDatidaROW() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                    console.log('  --------->  ' + e.message);
                }
            },
            SalvaClassifica: function(){
                try{
                    //[Code from Vendetta Inattivi. By mitm]
                    //[----> http://userscripts-mirror.org/scripts/review/32752 <---- ]
                    var gg, mm, aaaa, ore, min, sec;
                    var data = new Date();
                        gg = data.getDate();
                        mm = data.getMonth() + 1;
                        aaaa = data.getFullYear();
                    if (gg < 10){gg = "0" + gg;}
                    if (mm < 10){mm = "0" + mm;}
                        ore = data.getHours();
                        min = data.getMinutes();
                        sec = data.getSeconds();
                    if (ore < 10){ore = "0" + ore;}
                    if (min < 10){min = "0" + min;}
                    if (sec < 10){sec = "0" + sec;}
                    _ORARIO = ore  + ":" + min  + ":" + sec;
                    _DATA = gg + "/" + mm + "/" + aaaa;
                    //Cambio messaggio per visual convalida start salvataggio
                    var lblText = $('#testo')[0];
                        lblText.style = "color:yellow";
                        lblText.innerHTML ="&nbsp <font size='3'><blink> MODALITA\' SALVATAGGIO ATTIVATA!<br />" +
                                            "&nbsp Salvataggio della classifica del " + _DATA + ' ore ' + _ORARIO + '<br />' +
                                            "&nbsp - 1) scorrere le pagine della classifica che si intende salvare<br />"+
                                            "&nbsp - 2) Selezionare la corrispettiva classifica elencata nel menu sottostante premendo il pulsante \'ATTIVA\'</font></blink>";
                    //Incremento n classifiche
                    ELE_CLSS[ELE_CLSS.length] = _DATA + ' ' + _ORARIO;
                    GM.Scrivi(serverID + '_CLSS', ELE_CLSS); ///* vendetta2x_CLSS */
                    GM.Scrivi('datasaveSCORE',_DATA + ' ' + _ORARIO);
                    this.SalvaDatiClassifica();
                    this.CompletaMenuCLSS();
                }catch(e){
                    console.log('[ xHTM.SalvaClassifica() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                    console.log('  --------->  ' + e.message);
                }
            },
            SalvaDatiClassifica: function(){
                try{
                    if(GM.Esiste('datasaveSCORE',false)){
                        _DATA = GM.Esiste('datasaveSCORE').split(' ')[0];
                        _ORARIO = GM.Esiste('datasaveSCORE').split(' ')[1];
                    }
                    var tr_tabSCORE = JS.getTagName(document,'table',4).getElementsByTagName('tr');
                    //for(var n_tr_SCORE=5; n_tr_SCORE < 6; n_tr_SCORE++){
                    for(var n_tr_SCORE=5; n_tr_SCORE < tr_tabSCORE.length; n_tr_SCORE++){
                        var _STRINGA=[], _EDIFICI=[];
                        var celle = tr_tabSCORE[n_tr_SCORE].getElementsByTagName('th');
                        var playerID = JS.getTagName(celle[2],'a',0).href.split('r=')[1]?JS.getTagName(celle[2],'a',0).href.split('r=')[1]:false;
                        if(playerID){
                            _STRINGA = CHANGE.RicavaDatidaROW(celle);
                            /* vendetta2x_03/03/2023_15:37:41/14 */
                            //_STRINGA = POSIZIONE/NomePlayer/FAMIGLIA/PtAllenam/PtEdifici/PtUnita/PtAccount/NumeroEDIFICI/InfoAccount[Vacanza-Ban-Inactive]
                            if(GM.Esiste(serverID + '_' + _DATA + ' ' + _ORARIO + '/' + playerID,false) == false){
                                GM.Scrivi(serverID + '_' + _DATA + ' ' + _ORARIO + '/' + playerID, _STRINGA);
                            }
                        }
                    }
                }catch(e){
                    console.log('[ xHTM.SalvaDatiClassifica() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                    console.log('  --------->  ' + e.message);
                }
            },
            mainSCORE: function(){
                try{
                    if(window.location.href == 'https://vendetta2x.servegame.com/highscore.php' || document.location.href.indexOf('s=1') != -1 ){
                        serverID = window.location.hostname.split('.')[0]; //"vendetta2x"
                        ELE_CLSS = GM.Esiste(serverID+'_CLSS',[]); //"vendetta2x_CLSS"
                        refCLSS = GM.Esiste(serverID + '_hs_ref',null); //"vendetta2x_hs_ref"
                        if(GM.Esiste('SAVE_SCORE',false)){CHANGE.SalvaDatiClassifica();}
                        //Creo Menu Laterale - Gestione Inattivi [Script Originale by mitm]
                        CHANGE.MenuCLSS();
                        //Caricamento MENU GESTIONE CLASSIFICHE (se nSCORE >0)
                        if(ELE_CLSS.length > 0){CHANGE.CompletaMenuCLSS();}
                        //Caricamento CLASSIFICA con confronto dati con hs_ref(SE ESISTENTE!)
                        if(refCLSS){CHANGE.ConfrontaCLSS();}
                        //NUOVA GRAFICA CLASSIFICA
                        //document.getElementById('tabSCORE').style.width = "95%"
                    }
                }catch(e){
                    console.error('[ --> CHANGE.mainSCORE() <-- ]  :  ' + e.name + ' { - Linea: ' + e.lineNumber + ' }\n');
                    console.error('  --------->  ' + e.message);
                }
            },
        };
        /*###############################################################################################################*/
        var GAME = {
            myCSS: function(){
                try {
                     /* New CSS */
                     GM_addStyle('  .title_DettP{color:whitesmoke;font-size:24pt; border: solid 2px orange; font-family:\'AR CENA\';text-align:center;width:1000px}' +
                                '   .MenuCLSS{visibility:visible; align:left;font-family: Verdana, Geneva, sans-serif; color: white}' +
                                '   .tabRP_title{color: white;font-size: 14pt;font-weight:400;font-style: normal;text-decoration: none;font-family: Calibri, sans-serif;text-align: center;'+
                                               'vertical-align: middle;white-space: nowrap;border-style: none;border-color: inherit;border-width: medium;padding: 0px;background: #6E0000;}'+
                                '   .tabRP_row{height: 10pt;color: windowtext;font-size: 13pt;font-weight: 900;font-style: normal;text-decoration: none;font-family: Calibri, sans-serif;' +
                                              'text-align: center;vertical-align: bottom;white-space: nowrap;border-style: none;border-color: inherit;border-width: medium;padding: 0px;background: #DFDBC9; }' +
                                '   .Attivo {font-size:9pt;font-weight: bold;color:#00FF00 !important}' +
                                '   .SemiAttivo {font-size:9pt;font-weight: bold;color:#0062E1 !important}' +
                                '   .Decremento {font-size:9pt;font-weight: bold;background-color:yellow;color:red !important}' +
                                '   .Inattivo {font-size:9pt;font-weight: bold;color:orange !important}' +
                                '   .Ban {font-size:9pt;font-weight: bold;color:#FFE1DC !important}' +
                                '   .Vacanza {font-size:9pt;font-weight: bold;color:#82E0FF !important}' +
                                '   .Noob {font-size:9pt;font-weight: bold;color:yellow !important}'+
                                '   .NoSave {font-size:9pt;font-weight: bold;color:white !important}' +
                                '   .Famiglia {font-size:9pt;font-weight: bold;color:black !important}' +
                                '   .Io {font-size:11pt;font-weight: bold;color:white !important}');
                } catch (e) {
                    console.log('## GAME.myCSS() ## --->' +e.name + ': ' + e.message);
                }
            },
            startMAIN: function(){
                try{
                    //Aggiunta Vers Script HEADER MENU
                    //Aggiunge link "CONFIG" nel menu di gioco
                    GAME.ACTION(_PAGE);
                }catch(e){
                    console.error('[ --> GAME.startMain() <-- ]  :  ' + e.name + ' { - Linea: ' + e.lineNumber + ' }\n');
                    console.error('  --------->  ' + e.message);
                }
            },
            ACTION : function(name){
                switch(name){
                    case 'highscore.php': CHANGE.mainSCORE(); break;
                    case 'report.php' : CHANGE.SPIATE();break;
                }
                /*switch(name){
                    case 'konst.php': CHANGE.ButtonPAGE('konst'); break;
                    case 'forsch.php': CHANGE.ButtonPAGE('forsch'); break;
                    case 'off.php': CHANGE.ButtonPAGE('off'); break;
                    case 'deff.php': CHANGE.ButtonPAGE('deff'); break;
                    case 'unit.php': CHANGE.MISSIONI(); break;
                    case 'msg_read.php' : CHANGE.MESSAGGI(); break;
                    case 'score.php': CHANGE.mainSCORE(); break;
                    case 'player.php': CHANGE.GIOCATORE(); break;
                    case 'config.php': CHANGE.SETTING(); break;
                }*/
            }
        };
        /*###############################################################################################################*/
        /*################          MAIN SCRIPT            ###############*/
        /*###############################################################################################################*/
        try{
            GAME.myCSS();
            _PAGE = window.location.pathname.split('/')[1]?window.location.pathname.split('/')[1]:false;
            if(_PAGE){
                if(_PAGE != 'logout.php'){
                    GAME.startMAIN();
                }
            }else{console.log('{ MAIN : _INDEX } Non riesco a ricavare url/name page dal gioco !!!!')}
        }catch(e){
            console.error('[ //* MAIN SCRIPT *\\ ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
            console.error('  --------->  ' + e.message);
        }
    });

})();