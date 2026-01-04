// ==UserScript==
// @name         DeusRev_NoFAKE
// @author       GinoLoSpazzino[ITA]
// @namespace    http://forumfrat.forumfree.it/
// @version      2.5
// @description  Script STIDDARI.de
// @include      *.stiddari.com/game/*
// @grant       GM_addStyle
// @grant       GM_getResourceURL
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_log
// @grant       GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/36215/DeusRev_NoFAKE.user.js
// @updateURL https://update.greasyfork.org/scripts/36215/DeusRev_NoFAKE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var _VERS ='2.5',_SCORE,refSCORE,serverID,_DATA,_ORARIO;
    String.prototype.replaceAll = function(search, replacement) {var target = this;return target.split(search).join(replacement);};
    function ReplacePoint(strNum) { if (strNum.indexOf('.') != -1) { return parseInt(strNum.replace(/\./g, '').trim()); } else { return parseInt(strNum); } }
    function addGlobalStyle(css) { var head, style; head = document.getElementsByTagName('head')[0]; if (!head) { return; } style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css; head.appendChild(style); }
// =======================      GreaseMonkey pre 4.0 Version                 ==================//
    var GM = {
        gmEnabled: (typeof GM_getResourceURL == 'function'),
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
// =======================                  JAVASCRIPT                             ==================//
    var JS = {
        getTagName: function (node, type, n) { if (node.getElementsByTagName(type).length > 0) { if (n >= 0) { return node.getElementsByTagName(type)[n]; } else { return node.getElementsByTagName(type); } } else { return null; } },
        getById: function (node, nid) { if (node.getElementById(nid)) { return node.getElementById(nid); } else { return false; } },
        Rimuovi: function (element) { if (element) element.parentNode.removeChild(element); }
    };
// =======================                  LISTENER                               ==================//
    var LISTENER = {
        CLASSIFICA: function () {
            //onClick SaveCLSS
            if (JS.getById(document, 'SaveCLSS')) {
                JS.getById(document, 'SaveCLSS').addEventListener('click', function () {
                    GM.Scrivi('SAVE_SCORE',true);
                    xHTM.SalvaClassifica();
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
            var btnAct = document.getElementsByName('btnACTIVE');
            for (var b = 0; b < btnAct.length; b++) {
                btnAct[b].addEventListener('click', function () {
                    //ACTIVE_08/12/2017 13:33:22
                    /* s1_hs_ref */ GM.Scrivi(serverID + '_hs_ref' , this.id.split('_')[1]);
                    GM.Cancella('SAVE_SCORE');
                    GM.Cancella('datasaveSCORE');
                    //window.location.reload();
                    $('[href=\"score.php\"]')[0].click()
                }, false);
            }
            //btnDELETE - CANCELLA LA CLASSIFICA PRESA IN CONSIDERAZIONE (? Anche l'ultima)
            var btnDel = document.getElementsByName('btnDELETE');
            for (var _b = 0; _b < btnAct.length; _b++) {
                btnDel[_b].addEventListener('click', function () {
                    // [ID] DELETE_08/12/2017 20:23:43
                    if( confirm( 'Confermi cancellazione classifica del ' + this.id.split('_')[1] + '?' ) ) {
                        xHTM.CancellaClassifica(this.id);
                        //hs_del(hs, serverID, this.id.replace('CANCELLA',''));
                    }
                }, false);
            }
        }
    };
    // =======================      **NEW** HTML             ==================//
    var xHTM = {
        MenuCLSS : function () {
            try {
                var mitmDiv = document.createElement('div'); mitmDiv.id="mitm"; mitmDiv.style="width:" + parseInt(($(document).width() * 90)/100); mitmDiv.className="MenuCLSS";
                $('div')[2].append(mitmDiv);
                $('#mitm')[0].innerHTML = '<p><b><font id="testo" size="3" color="orange">&nbsp;Calcolo Inattivi [Script originale by mitm] &nbsp;&nbsp;&nbsp; [Versione : ' + _VERS + ']' +
                                          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a size="3" style="color:yellow" href="http://fakedeusrev.altervista.org/INFO_VERSIONE.html" target="_blank">INFO SCRIPT </a>&nbsp;&nbsp;[...IN LAVORAZIONE, MA LEGGERMENTE UTILE...]</font></b></p>' +
                                          '<button id="SaveCLSS" style="border: none; padding: 14px 28px;background-color: #4CAF50;">SALVA NUOVA CLASSIFICA</button>';
                if($('#SaveCLSS')[0]){
                    $('#SaveCLSS').bind('click', function() {
                        GM.Scrivi('SAVE_SCORE',true);
                        xHTM.SalvaClassifica();
                    });
                }
            } catch (e) {
                console.log('[ xHTM.MenuCLSS() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                console.log('  --------->  ' + e.message);
            }
        },
        CompletaMenuCLSS: function(){
            try {
                if(!$('#onDELTA')[0]){
                    var _ref_SCORE = refSCORE ? refSCORE : 'NESSUNA CLASSIFICA';
                    var valDELTA = GM.Esiste(serverID + '_DELTA',0);

                    $('#mitm')[0].innerHTML += '<hr>' +
                                                '<p align="left"><b><font color="white" size="2">&nbsp; CLASSIFICA SELEZIONATA : </font>' +
                                                '&nbsp;<font color="yellow" size="2">' + _ref_SCORE + '</b></font>&nbsp;&nbsp;'+
                                                '<button type="button" style="font-size:11pt" id="DISATTIVA_href">Disattiva</button></p>' +
                                                '<p align="left"><font color="#0062E1" size="2"><b>&nbsp;Delta semi-inattivi &nbsp;&nbsp;</b></font>'+
                                                '<input id="onDELTA" name="delta_box" value="'+ valDELTA + '" maxlength="20" size="6" type="text">&nbsp;&nbsp;' +
                                                '<button type="button" style="font-size:11pt" id="saveDELTA">Save</button></font></p><br />';

                    if(!refSCORE){$('#DISATTIVA_href')[0].style.display="none";}

                    for(var cmc=0; cmc < _SCORE.length; cmc++){
                        if(!JS.getById(document,'ACTIVE_'+ _SCORE[cmc])){
                            $('#mitm')[0].innerHTML += '<p align="left"><font size="2"><b>&nbsp;Classifica del ' + _SCORE[cmc] + '</b></font>' +
                                    '&nbsp;&nbsp;<button type="button" name="btnACTIVE" style="font-size:11pt" id="ACTIVE_' + _SCORE[cmc] + '">Attiva</button>' +
                                    '&nbsp;&nbsp;<button type="button" name="btnDELETE" style="font-size:11pt" id="DELETE_' + _SCORE[cmc] + '">Cancella</button></p>';
                        }
                    }
                }
                LISTENER.CLASSIFICA();
            } catch (e) {
                console.log('[ xHTM.CompletaMenuCLSS() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                console.log('  --------->  ' + e.message);
            }
        },
        RicavaDatidaROW: function(_row){
            try{
                var _datiRICAVATI = [];

                _datiRICAVATI[0] = _row[0].textContent;
                _datiRICAVATI.push(JS.getTagName(_row[2], 'font',0).textContent);
                if(JS.getTagName(_row[2], 'a',-1).length > 1){_datiRICAVATI.push(JS.getTagName(_row[2], 'a',1).textContent.trim());}else{_datiRICAVATI.push('');}
                _datiRICAVATI.push(_row[4].attributes["data-tooltip"].value.replaceAll('.',''));
                _datiRICAVATI.push(_row[5].attributes["data-tooltip"].value.replaceAll('.',''));
                _datiRICAVATI.push(_row[6].attributes["data-tooltip"].value.replaceAll('.',''));
                _datiRICAVATI.push(_row[7].attributes["data-tooltip"].value.replaceAll('.',''));
                _datiRICAVATI.push(parseInt(_row[8].textContent));
                _datiRICAVATI.push(_row[1].innerHTML);
                _datiRICAVATI.push(_row[3].textContent.trim());

                return _datiRICAVATI;
            }catch(e){
                console.log('[ xHTM.RicavaDatidaROW() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                console.log('  --------->  ' + e.message);
            }
        },
        SalvaDatiClassifica: function(){
            try{
                if(GM.Esiste('datasaveSCORE',false)){
                    _DATA = GM.Esiste('datasaveSCORE').split(' ')[0];
                    _ORARIO = GM.Esiste('datasaveSCORE').split(' ')[1];
                }

                var tr_tabSCORE = $('tr',$('table.main')[$('table.main').length-1]);
                //for(var n_tr_SCORE=2; n_tr_SCORE < 3; n_tr_SCORE++){
                for(var n_tr_SCORE=2; n_tr_SCORE < tr_tabSCORE.length; n_tr_SCORE++){
                    var _STRINGA=[], _EDIFICI=[], celle = $('td',tr_tabSCORE[n_tr_SCORE]), playerID = JS.getTagName(celle[2],'a',0).href.split('p=')[1];
                    if(playerID){
                        _STRINGA = xHTM.RicavaDatidaROW(celle);
                        //stringa = POSIZIONE/NomePlayer/FAMIGLIA/PtAllenam/PtEdifici/PtUnita/PtAccount/NumeroEDIFICI/InfoAccount[Vacanza-Ban-Inactive]
                        /* s1_07122017_193405/389 */ GM.Scrivi(serverID + '_' + _DATA + ' ' + _ORARIO + '/' + playerID, _STRINGA);
                    }
                }
            }catch(e){
                console.log('[ xHTM.SalvaDatiClassifica() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                console.log('  --------->  ' + e.message);
            }
        },
        SalvaClassifica: function(){
            try{
                //[Code from Vendetta Inattivi. By mitm]
                //[----> http://userscripts-mirror.org/scripts/review/32752 <---- ]
                var gg, mm, aaaa, ore, min, sec, orario;
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
                _SCORE[_SCORE.length] = _DATA + ' ' + _ORARIO;
                /* s1_SCORE */ GM.Scrivi(serverID + '_SCORE', _SCORE);
                GM.Scrivi('datasaveSCORE',_DATA + ' ' + _ORARIO);
                this.SalvaDatiClassifica();
                this.CompletaMenuCLSS();
            }catch(e){
                console.log('[ xHTM.SalvaClassifica() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                console.log('  --------->  ' + e.message);
            }
        },
        CancellaClassifica : function(ID_DEL){
            try{
                //console.log('CANCELLA CALSSIFICA [ ' + _REF.split('_')[1] + ' ] - attiva!');
                if(typeof GM_deleteValue == 'function'){
                    /* 08/12/2017 20:23:54 */ var CLS = ID_DEL.split('_')[1];
                    var eleSCORE = GM.Esiste(serverID+'_SCORE');
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
                        GM.Scrivi(serverID+'_SCORE',eleSCORE);

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
        EsisteDATA: function(player_id){
            try{
                var _ELE_PLAYER=[];

                for(var ex_data=0; ex_data < _SCORE.length; ex_data++){
                    if(GM.Esiste(serverID + '_' + _SCORE[ex_data] + '/' + player_id)){
                        var EPLtmp = GM.Esiste(serverID + '_' + _SCORE[ex_data] + '/' + player_id);
                        EPLtmp.push(_SCORE[ex_data]);
                        _ELE_PLAYER.push(EPLtmp);
                    }
                }
                return _ELE_PLAYER;
            }catch(e){
                console.log('[ xHTM.EsisteDATA(player_id) ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                console.log('  --------->  ' + e.message);
            }
        },
        ConfrontaPunteggi: function(_new,_old){
            try{
                //CONFRONTO = [Posizione,ALL,STA,UNIT,PTOT,EDIF]
                var CONFRONTO = [0,0,0,0,0,0];
                //DATI = {0POSIZIONE/1NomePlayer/2FAMIGLIA/3PtAllenam/4PtEdifici/5PtUnita/6PtAccount/7NumeroEDIFICI/8InfoAccount[Vacanza-Ban-Inactive]/9NATIONAL}
                //_saveDATI = [0POSIZIONE/1NomePlayer/2FAMIGLIA/3PtAllenam/4PtEdifici/5PtUnita/6PtAccount/7NumeroEDIFICI/8BAN-VAC-7/14/9NATIONALITY]
                CONFRONTO [0] = parseInt(_new[0])-parseInt(_old[0]);
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
        ConfrontaCLSS : function(){
            try {
                //MODIFICA GRAFICA DELLA PAGINA DI GIOCO
                //$('table')[1].setAttribute("align", "right");$('table')[1].setAttribute("width", "70%");
                $('table')[$('table').length-1].style.width = parseInt((window.screen.width * 70)/100) + "px";
                $('table')[$('table').length-1].id="tabSCORE"; var trCls = $('#tabSCORE tr');

                for(var c_cls=2; c_cls < trCls.length; c_cls++){
                //for(var c_cls=2; c_cls < 3; c_cls++){
                    var tdCls = $('td', trCls[c_cls]), DATI=[], _saveDATI=[], _CONFRONTO=[];
                    var _playerID = JS.getTagName(tdCls[2], 'a', 0).href.split('p=')[1];
                    if(_playerID){
                        //DATI = {POSIZIONE/NomePlayer/FAMIGLIA/PtAllenam/PtEdifici/PtUnita/PtAccount/NumeroEDIFICI/InfoAccount[Vacanza-Ban-Inactive]/NATIONAL}
                        DATI = xHTM.RicavaDatidaROW(tdCls);
                        //Rimuovi Esponenziale da tab Classifica
                        tdCls[5].textContent = tdCls[5].attributes["data-tooltip"].value;
                        tdCls[6].textContent = tdCls[6].attributes["data-tooltip"].value;
                        tdCls[7].textContent = tdCls[7].attributes["data-tooltip"].value;
                    }
                    var nCLSS = xHTM.EsisteDATA(_playerID);
                    if(nCLSS.length > 0){
                        //Creo LNK Historu Player (dettaglio_player)
                        tdCls[0].innerHTML = '<div><font style="cursor:pointer" name=' + DATI[1] + ' id=det_' + _playerID  + '><b>' + DATI[0] + '</b></font></div>';
                        //LISTENER DETTAGLIO_PLAYER
                        //Function EsisteData(player_id)<--- true/false;
                        if($('#det_'+_playerID)[0]){
                            $('#det_'+_playerID).bind('click', function(){
                                var pl_id = this.id.replace('det_', '');
                                var pl_name = this.getAttribute("name");
                                var tr = this.parentNode.parentNode.parentNode;
                                xHTM.DettaglioPlayer(pl_id, pl_name, tr);
                            });
                        }
                    }
                    if(tdCls[1].textContent==''){
                        //Esiste_save_href
                        if(GM.Esiste(serverID + '_' + refSCORE + '/' + _playerID,false)){
                            //Confronto HREF <---> ROW
                            _saveDATI = GM.Esiste(serverID + '_' + refSCORE + '/' + _playerID);
                            /* Controllo Dati Player */ _CONFRONTO = xHTM.ConfrontaPunteggi(DATI,_saveDATI);
                            /* GRAFICA_PL(TypeAcc,eleTD,DIFF) */ xHTM.GRAFICA_PL(DATI[8], tdCls, _CONFRONTO);
                        }else{
                            //NO-SAVE IN REF_SCORE
                            xHTM.GRAFICA_PL('NOSAVE', tdCls, []);
                        }
                    }else{
                        //VACANZA-BAN-INATTIVO(7/14)
                        xHTM.GRAFICA_PL(DATI[8], tdCls, []);
                    }
                }
            }catch(e){
                console.log('[ xHTM.ConfrontaCLSS() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                console.log('  --------->  ' + e.message);
            }
        },
        GRAFICA_PL: function(_NOTE, _RIGHE, _DIFF){
            try{
                ////TypeAccount : NOSAVE | NOOB | IO | FAMIGLIA | ATTIVO | SEMI-ATTIVO| DECREM ATTIVO | DECREM INATT | INATTIVO | 7 | 14 | VACANZA | BAN
                var className='', bg_color='black';
                if(_NOTE == ''){
                    ////TypeAccount : ATTIVO | SEMI-ATTIVO| DECREM ATTIVO | DECREM INATT | INATTIVO
                    if(_DIFF[4] > 0){
                        if(_DIFF[4] <= parseInt(GM.Esiste(serverID+'_DELTA',0))){/* PLAYER SEMI-ATTIVO */ className='SemiAttivo';}else{/* PLAYER ATTIVO */ className='Attivo';}
                        _RIGHE[2].innerHTML += '&nbsp;&nbsp;&nbsp;<font>[ + ' + _DIFF[4].toLocaleString('it') + ' ]</font>';
                    }else if(_DIFF[4] < 0){
                        if(_DIFF[1]>0 || _DIFF[2]>0){
                            /* DECREMENTO PLAYER ATTIVO */ if(parseInt(_DIFF[1]+_DIFF[2]) >= parseInt(GM.Esiste(serverID+'_DELTA',0))){className='Attivo';}else{className='SemiAttivo';}
                        }else{/* DECREMENTO PLAYER INATTIVO */ className='Inattivo';}
                    }else{/* PLAYER INATTIVO */ className='Inattivo';}
                    //DIFFERENZA PT STANZE
                    if(_DIFF[2]>0){_RIGHE[5].innerHTML += '&nbsp;&nbsp;<font>[ + ' + _DIFF[2].toLocaleString('it') + ' ]';}
                    //DIFFERENZA PT ALLENAMENTI
                    if(_DIFF[1]>0){_RIGHE[4].innerHTML += '&nbsp;&nbsp;<font>[ + ' + _DIFF[1].toLocaleString('it') + ' ]';}
                }else{
                    ////TypeAccount : NOSAVE | 7 | 14 | VACANZA | BAN
                    if(_NOTE == 'NOSAVE'){ className='NoSave';}
                    if(_NOTE.indexOf('inc/lock.gif') != -1){
                        className='Ban';
                    }else if(_NOTE.indexOf('u') != -1){
                        className="Vacanza";
                        _RIGHE[1].innerHTML = _RIGHE[1].innerHTML.replace(/I/g,'');
                        _RIGHE[1].innerHTML = _RIGHE[1].innerHTML.replace(/i/g,'');
                        _RIGHE[1].innerHTML = _RIGHE[1].innerHTML.replace('u','<b>[V]</b>');
                    }else{
                        className="Inattivo";
                        if(_RIGHE[1].textContent.indexOf('iI') != -1){
                            _RIGHE[1].innerHTML = _RIGHE[1].innerHTML.replace('iI','<b>[14]</b>');
                        }else{
                            _RIGHE[1].innerHTML = _RIGHE[1].innerHTML.replace('i','<b>[7]</b>');
                        }
                    }
                }

                if(_RIGHE[1].parentNode.innerHTML.indexOf('class="noob"')!=-1){
                    /* TypeAccount : NOOB */ className='Noob';_RIGHE[1].innerHTML = '<b>!! NOOB</b>';
                }else if(_RIGHE[1].parentNode.innerHTML.indexOf('highscore_allies')!=-1){
                    /* TypeAccount : PLAYER FAMIGLIA */ className='Famiglia'; /*color = 'black';*/ bg_color = '#66cd00';
                }else if(_RIGHE[1].parentNode.innerHTML.indexOf('highscore_self')!=-1){
                    /* TypeAccount : IO */ className='Io'; /*color = 'white';*/ bg_color = '#008b8b';
                }

                //settaCOLORI
                for(var sc_td=1; sc_td < _RIGHE.length; sc_td++){ _RIGHE[sc_td].className = className;  _RIGHE[sc_td].style="background-color:" + bg_color;}  //td.className = 'Inattivo'
                for(var sc_a=0; sc_a < JS.getTagName(_RIGHE[2],'a',-1).length; sc_a++){JS.getTagName(_RIGHE[2],'a',sc_a).className=className;}
                for(var sc_fnt=0; sc_fnt < JS.getTagName(_RIGHE[2],'font',-1).length; sc_fnt++){JS.getTagName(_RIGHE[2],'font',sc_fnt).className = className; }

                if(_NOTE == ''){
                    //DIFFERENZA PT UNITA
                    if (_DIFF[3]>0) {
                        _RIGHE[6].innerHTML += '&nbsp; [ + ' + _DIFF[3].toLocaleString('it') + ']';
                    }else if(_DIFF[3]<0){
                        _RIGHE[6].innerHTML += '&nbsp; <font class="Decremento">[&nbsp; ' + _DIFF[3].toLocaleString('it') + '&nbsp;]</font>'; //_RIGHE[6].className='Decremento';
                        if(_DIFF[4]<0){
                            _RIGHE[2].innerHTML += '&nbsp;&nbsp;<font class="Decremento">[&nbsp;&nbsp; ' + _DIFF[4].toLocaleString('it') + '&nbsp;&nbsp; ]</font>';
                        }
                    }
                    //DIFFERENZA NUM EDIFICI
                    if (_DIFF[5]>0) {
                        _RIGHE[8].innerHTML += '&nbsp&nbsp [ + ' + _DIFF[5] + ' ]';
                    }else if(_DIFF[5]<0){
                        _RIGHE[8].innerHTML += '&nbsp&nbsp <font class="Decremento"> [ ' + _DIFF[5] + ' ]</font>'; //_RIGHE[8].className='Decremento';
                    }
                }
            }catch(e){
                console.log('[ xHTM.Grafica_PL() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                console.log('  --------->  ' + e.message);
            }
        },
        RicavaAllenamDaPt: function(_PT){
            try{
                var allenam = '';
                switch(_PT){
                    case 0: allenam = ''; break;
                    case 13 : allenam = 'Raccolta Informazioni'; break;
                    case 16 : allenam = 'Pianificazione dei Percorsi';break;
                    case 23 : allenam = 'Contrabbando'; break;
                    case 26 : allenam = 'Riscossione del reddito'; break;
                    case 46 : allenam= 'Pianificazione della missione';break;
                    case 53 : allenam = 'Combattimento all\'Arma Bianca'; break;
                    case 61 : allenam = 'Appostamento'; break;
                    case 76 : allenam = 'Gest. Reddito o Corpo a Corpo'; break;
                    case 96 : allenam = 'Protezione del Gruppo'; break;
                    case 98: allenam = 'Servizio Militare';break;
                    case 291: allenam = 'Addestamento Chimico'; break;
                    case 296: allenam = 'Allenamento al Tiro'; break;
                    case 301: allenam = 'Allenamento Psicologico'; break;
                    case 321: allenam = 'Allenamento di Guerriglia'; break;
                    case 471: allenam = 'Costruzione di Bombe'; break;
                    case 4201 : allenam = 'Onore'; break;
                }
                return allenam;

            }catch(e){
                console.log('[ xHTM.RicavaAllenamDaPt() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                console.log('  --------->  ' + e.message);
            }
        },
        CreaHeaderDETTAGLIO_P: function(myID, valActual, clsREF){
            try{
                //[valActual] - [ "7", "Misterone", "N.Y.", "651", "2467", "955", "4073", 6, "", "it" ]
                //[ultimaCLS] - [ "9", "Misterone", "N.Y.", "651", "2313", "955", "3920", 6, "", "it" ]
                var ultimaCLS = GM.Esiste(serverID + '_' + clsREF + '/' + myID);

                var code_header = '<br /><table id="RIEPILOGO_HEADER" style="margin-left:' + parseInt((window.screen.width * 10)/100) + 'px;"><tbody>' +
                                  '<tr style="height: 30px">' +
                                        '<td class="tabRP_title" style="width:70px"> POS</td>' +
                                        '<td class="tabRP_title" style="width: 150px;">Nome</td>' +
                                        '<td class="tabRP_title" style="width:80px">Famiglia</td>' +
                                        '<td class="tabRP_title" style="width: 120px">Punti Allenam</td>' +
                                        '<td class="tabRP_title" style="width: 120px">Punti Edificio</td>' +
                                        '<td class="tabRP_title" style="width: 120px">Punti Truppa</td>' +
                                        '<td class="tabRP_title" style="width: 120px">Punti Totali</td>' +
                                        '<td class="tabRP_title" style="width: 70px">Edifici</td>'+
                                        '<td style="width: 90px;background-color:black"></td></tr>'+
                                '<tr style="height: 20px; text-align: center;">' +
                                        '<td class="tabRP_row">' + valActual[0] +'</td>'+
                                        '<td class="tabRP_row">' + valActual[1] +'</td>'+
                                        '<td class="tabRP_row">' + valActual[2] +'</td>'+
                                        '<td class="tabRP_row">' + parseInt(valActual[3]).toLocaleString('it') +'</td>'+
                                        '<td class="tabRP_row">' + parseInt(valActual[4]).toLocaleString('it') +'</td>'+
                                        '<td class="tabRP_row">' + parseInt(valActual[5]).toLocaleString('it') +'</td>'+
                                        '<td class="tabRP_row">' + parseInt(valActual[6]).toLocaleString('it') +'</td>'+
                                        '<td class="tabRP_row">' + parseInt(valActual[7]).toLocaleString('it') +'</td>';
                //STATO ATTUALE PLAYER
                if(valActual.length>8){
                    if(valActual[8] !== ''){
                        //BAN <--- <img src="inc/lock.gif" title="Multi / IP-Sharing violation"> u
                        if(valActual[8].indexOf('src="inc/lock.gif"') != -1){
                            code_header += '<td class="tabRP_row" style="background-color:black;color:#FFE1DC">BANNATO</td>';
                        }else if(valActual[8].indexOf('[V]') !=-1 ||valActual[8].indexOf('u') != -1){
                            code_header  += '<td class="tabRP_row" style="background-color:black;color:#82E0FF">VACANZA</td>';
                        }else{
                            code_header += '<td class="tabRP_row" style="background-color:black;color:orange">INATTIVO</td>';
                        }
                    }else{
                        var dataCOMPARE = parseInt(valActual[6]-ultimaCLS[6]);
                        if(dataCOMPARE>0){
                            //ATTIVO
                            if(dataCOMPARE>GM.Esiste(serverID + '_DELTA',0)){
                                code_header += '<td class="tabRP_row" style="background-color:black;color:#00FF00">ATTIVO</td>';
                            }else{
                                code_header += '<td class="tabRP_row" style="background-color:black;color:#0062E1">SEMI-ATTIVO</td>';
                            }
                        }else if(dataCOMPARE<0){
                            code_header += '<td class="tabRP_row" style="background-color:black;color:red">DECREMENTO</td>';
                        }else{
                            code_header += '<td class="tabRP_row" style="background-color:black;color:orange">INATTIVO</td>';
                        }
                    }
                }else{
                    code_header += '<td style="width: 90px;background-color:black"></td></tr>';
                }

                code_header += '</tr><tr style="height: 20px; text-align: center;">' +
                               '<td style="background-color:black"></td><td style="background-color:black"></td><td style="background-color:black"></td>';


                //Punti Allenamenti
                if(parseInt(valActual[3]-ultimaCLS[3]) > 0){
                    code_header += '<td class="tabRP_row" style="color:green;"> + ' + parseInt(valActual[3]-ultimaCLS[3]).toLocaleString('it') + '</td>';
                }else{code_header += '<td style="background-color:black"></td>';}
                //Punti Edificio
                if(parseInt(valActual[4]-ultimaCLS[4]) > 0){
                    code_header += '<td class="tabRP_row" style="color:green;"> + ' + parseInt(valActual[4]-ultimaCLS[4]).toLocaleString('it') + '</td>';
                }else{code_header += '<td style="background-color:black"></td>';}
                //Punti Unita
                if(parseInt(valActual[5]-ultimaCLS[5]) > 0){
                    code_header += '<td class="tabRP_row" style="color:green;"> + ' + parseInt(valActual[5]-ultimaCLS[5]).toLocaleString('it') + '</td>';
                }else if(parseInt(valActual[5]-ultimaCLS[5]) < 0){
                    code_header += '<td class="tabRP_row" style="color:red;background-color:yellow">' + parseInt(valActual[5]-ultimaCLS[5]).toLocaleString('it') + '</td>';
                }else{code_header += '<td style="background-color:black"></td>';}
                //Punti Totali Account
                if(parseInt(valActual[6]-ultimaCLS[6]) > 0){
                    code_header += '<td class="tabRP_row" style="color:green;"> + ' + parseInt(valActual[6]-ultimaCLS[6]).toLocaleString('it') + '</td>';
                }else if(parseInt(valActual[6]-ultimaCLS[6]) < 0){
                    code_header += '<td class="tabRP_row" style="color:red;background-color:yellow">' + parseInt(valActual[6]-ultimaCLS[6]).toLocaleString('it') + '</td>';
                }else{code_header += '<td style="background-color:black"></td>';}
                //Numero Edifici
                if(parseInt(valActual[7]-ultimaCLS[7]) > 0){
                    code_header += '<td class="tabRP_row" style="color:green;"> + ' + parseInt(valActual[7]-ultimaCLS[7]).toLocaleString('it') + '</td>';
                }else if(parseInt(valActual[7]-ultimaCLS[7]) < 0){
                    code_header += '<td class="tabRP_row" style="color:red;background-color:yellow">' + parseInt(valActual[7]-ultimaCLS[7]).toLocaleString('it') + '</td>';
                }else{code_header += '<td style="background-color:black"></td>';}

                code_header += '</tr>';

                if(parseInt(valActual[3]-ultimaCLS[3]) > 0){
                    code_header +=  '<tr>' +
                                        '<td style="background-color:black"></td><td style="background-color:black"></td><td style="background-color:black"></td>' +
                                        '<td class="tabRP_row" colspan="3">' + xHTM.RicavaAllenamDaPt(parseInt(valActual[3]-ultimaCLS[3])) + '</td>' +
                                        '<td style="background-color:black"></td><td style="background-color:black"></td><td style="background-color:black"></td>' +
                                    '</tr>';
                }
                code_header +='</tbody></table><br /><br /><br />';
                return code_header;
            }catch(e){
                console.log('[ xHTM.CreaHeaderDETTAGLIO_PL() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                console.log('  --------->  ' + e.message);
            }
        },
        CreaTableStorico_DETTAGLIO_P: function(myID, eleCLS){
            try{
                var storicoPL = '<table style="margin-left: 20px; color:white;" id="RIEPILOGO_CLSS"><tbody>';
                //HEADER TABELLA
                storicoPL += '<tr style="height: 40px; font-size: 12pt !important;">' +
                                '<td style="width:180px"></td>' +
                                '<td class="tabRP_title" style="width: 70px;">POS</td>' +
                                '<td class="tabRP_title" style="width: 70px;">Pt All.</td>' +
                                '<td class="tabRP_title" style="width: 70px;"></td>' +
                                '<td class="tabRP_title" style="width: 300px;">Allenamento Specifico</td>' +
                                '<td class="tabRP_title" style="width: 70px;">Pt Edifici</td>' +
                                '<td class="tabRP_title" style="width: 70px;"></td>' +
                                '<td class="tabRP_title" style="width: 120px;">Pt Truppa</td>' +
                                '<td class="tabRP_title" style="width: 120px;"></td>' +
                                '<td class="tabRP_title" style="width: 70px;">Pt Totali</td>' +
                                '<td class="tabRP_title" style="width: 70px;">Incremento</td>' +
                                '<td class="tabRP_title" style="width: 70px;">N Edif</td>' +
                                '<td class="tabRP_title" style="width: 200px;">Nome</td>' +
                                '<td class="tabRP_title" style="width: 70px;">FAM</td>' +
                                '<td class="tabRP_title" style="width: 150px;">Stato</td>' +
                            '</tr>';

                //CONTROLLO E STAMPA LE ALTRE CLASSIFICHE SALVATE
                 for(var ex_CLS = eleCLS.length; ex_CLS > 0; ex_CLS--){
                    //var tmpCLS = GM.Esiste(serverID + '_' + eleCLS[ex_CLS-1] + '/' + myID);
                    var tmpCLS = eleCLS[ex_CLS-1];

                    //if(GM.Esiste(serverID + '_' + eleCLS[ex_CLS-1] + '/' + myID)){
                        var dataCOMPARE = [0,0,0];
                        if(ex_CLS > 1){
                            //CONFRONTO CLASSIFICHE A RITROSO
                            //"s1_13/12/2017 11:35:59/202": ["1287","Shisui","","15","145","0","161","1"]
                            //var oldCLS = GM.Esiste(serverID + '_' + eleCLS[ex_CLS-2] + '/' + myID);
                            var oldCLS = eleCLS[ex_CLS-2];
                            dataCOMPARE[0] = parseInt(tmpCLS[3]-oldCLS[3]);
                            dataCOMPARE[1] = parseInt(tmpCLS[4]-oldCLS[4]);
                            dataCOMPARE[2] = parseInt(tmpCLS[5]-oldCLS[5]);
                            dataCOMPARE[3] = parseInt(tmpCLS[6]-oldCLS[6]);
                        }
                        //console.log(eleCLS[ex_CLS-1] + ' ----> ' + tmpCLS);
                        storicoPL += '<tr style="height: 18pt" height="21">' +
                                        '<td class="tabRP_title" style="font-size: 13pt">' + tmpCLS[tmpCLS.length-1] + '</td>' +
                                        '<td class="tabRP_row">' + parseInt(tmpCLS[0]).toLocaleString('it') + '</td>' +
                                        '<td class="tabRP_row">' + parseInt(tmpCLS[3]).toLocaleString('it') + '</td>';
                        //PUNTI ALLENAMENTO
                        if(ex_CLS > 1){
                            if(dataCOMPARE[0]>0){
                                storicoPL += '<td class="tabRP_row" style="color:green"> + ' + dataCOMPARE[0].toLocaleString('it') + '</td>' +
                                             '<td class="tabRP_row">'+ xHTM.RicavaAllenamDaPt(dataCOMPARE[0]) +'</td>';
                            }else{
                                 storicoPL += '<td class="tabRP_row">' + dataCOMPARE[0].toLocaleString('it') + '</td>' +
                                              '<td style="background-color:black"></td>';
                            }
                        }else{
                            storicoPL +=    '<td style="background-color:black"></td><td style="background-color:black"></td>';
                        }

                        storicoPL += '<td class="tabRP_row">' + parseInt(tmpCLS[4]).toLocaleString('it') + '</td>';
                        //PUNTI EDIFICI
                        if(ex_CLS > 1){
                            if(dataCOMPARE[1]>0){
                                storicoPL += '<td class="tabRP_row" style="color:green"> + ' + dataCOMPARE[1].toLocaleString('it') + '</td>';
                            }else{
                                 storicoPL += '<td class="tabRP_row">' + dataCOMPARE[1].toLocaleString('it') + '</td>' ;
                            }
                        }else{
                            storicoPL +=    '<td style="background-color:black"></td>';
                        }
                        storicoPL += '<td class="tabRP_row">' + parseInt(tmpCLS[5]).toLocaleString('it') + '</td>';
                        //PUNTI UNIT
                        if(ex_CLS > 1){
                            if(dataCOMPARE[2]>0){
                                storicoPL += '<td class="tabRP_row" style="color:green"> + ' + dataCOMPARE[2].toLocaleString('it') + '</td>';
                            }else if(dataCOMPARE[2]<0){
                                storicoPL += '<td class="tabRP_row" style="color:red;background-color:yellow">' + dataCOMPARE[2].toLocaleString('it') + '</td>';
                            }else{
                                 storicoPL += '<td class="tabRP_row">' + dataCOMPARE[2].toLocaleString('it') + '</td>' ;
                            }
                        }else{
                            storicoPL +=    '<td style="background-color:black"></td>';
                        }
                        storicoPL+= '<td class="tabRP_row">' + parseInt(tmpCLS[6]).toLocaleString('it') + '</td>';
                        //INCREM/DECREM/INACTIVE ACCOUNT
                        if(ex_CLS > 1){
                            if(dataCOMPARE[3]>0){
                                storicoPL += '<td class="tabRP_row" style="color:green"> + ' + dataCOMPARE[3].toLocaleString('it') + '</td>';
                            }else if(dataCOMPARE[3]<0){
                                storicoPL += '<td class="tabRP_row" style="color:red;background-color:yellow"> ' + dataCOMPARE[3].toLocaleString('it') + '</td>';
                            }else{
                                 storicoPL += '<td class="tabRP_row">' + dataCOMPARE[3].toLocaleString('it') + '</td>' ;
                            }
                        }else{
                            storicoPL += '<td style="background-color:black"></td>';
                        }
                        storicoPL +='<td class="tabRP_row">' + parseInt(tmpCLS[7]).toLocaleString('it') + '</td>' +
                                        '<td class="tabRP_row">' + tmpCLS[1].trim() + '</td>' +
                                        '<td class="tabRP_row">' + tmpCLS[2].trim() + '</td>';

                        //STATO DEL PLAYER
                        var _stato = false;

                        if(ex_CLS > 1){
                            if(dataCOMPARE[3]>0){
                                //ATTIVO
                                if(dataCOMPARE[3]>GM.Esiste(serverID + '_DELTA',0)){
                                    _stato = '<td class="tabRP_row" style="background-color:black;color:#00FF00">ATTIVO</td>';
                                }else{
                                    _stato = '<td class="tabRP_row" style="background-color:black;color:#0062E1">SEMI-ATTIVO</td>';
                                }
                            }else if(dataCOMPARE[3]<0){
                                _stato = '<td class="tabRP_row" style="background-color:black;color:red">DECREMENTO</td>';
                            }else{
                                _stato = '<td class="tabRP_row" style="background-color:black;color:orange">INATTIVO</td>';
                            }
                        }else{
                            _stato = '<td style="background-color:black"></td>';
                        }

                        if(tmpCLS.length > 9){
                            if(tmpCLS[8] !== ''){
                                if(tmpCLS[8].indexOf('inc/lock.gif') !=-1){
                                    _stato = '<td class="tabRP_row" style="background-color:black;color:#FFE1DC">BANNATO</td>';
                                }else if(tmpCLS[8].indexOf('u') !=-1){
                                    _stato = '<td class="tabRP_row" style="background-color:black;color:#82E0FF">VACANZA</td>';
                                }else{
                                    _stato = '<td class="tabRP_row" style="background-color:black;color:orange">INATTIVO</td>';
                                }
                            }
                        }

                        storicoPL += _stato + '</tr>';
                    //}//<-------------------------------
                }//<------------------------------------------------------------

                storicoPL += '</tbody></table>';
                return storicoPL;

            }catch(e){
                console.log('[ xHTM.CreaTableStorico_DETTAGLIO_P() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                console.log('  --------->  ' + e.message);
            }
        },
        DettaglioPlayer: function(_id, _nome, _DATI){
            try{
                //ACT_DATI = [POSIZIONE | NOME | FAMIGLIA | ALL | EDIFICI | UNITA | P_TOT | N_EDIF | INFO |NATIONAL ]
                var ACT_DATI = xHTM.RicavaDatidaROW(JS.getTagName(_DATI,'td',-1));

                var dettaglio = window.open("", "_blank dettaglio_player_" + _id);
                    dettaglio.document.open("text/html");

                var html = '<html><head><title>Dettaglio ' + ACT_DATI[1] + '</title></head><body bgcolor=black>' +
                           '<h1 class="title_DettP">DETTAGLIO PLAYER &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ' + ACT_DATI[1].toUpperCase() + '</h1>';

                    html += xHTM.CreaHeaderDETTAGLIO_P(_id, ACT_DATI, _SCORE[_SCORE.length-1]);
                    var elencoCLSS_Player = xHTM.EsisteDATA(_id);
                    html += xHTM.CreaTableStorico_DETTAGLIO_P(_id, elencoCLSS_Player);

                    html += '<p><a href="javascript:void(null);" onClick="window.close();"><font color=gray>Chiudi</font></a></p></body></html>';
                    dettaglio.document.write(html);
                    dettaglio.document.close();
            }catch(e){
                console.log('[ xHTM.DettaglioPlayer() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                console.log('  --------->  ' + e.message);
            }
        }
    };
// =======================      CHANGE PAGE HTML        ==================//
    var xCHANGE = {
        SCORE: function(){
            try{
                if(document.getElementsByName('sc')[0]){
                    //Attiva il codice soltanto se select[option] == GIOCATORI
                    if (document.getElementsByName('sc')[0].selectedIndex == 0) {
                        /* s1 */ serverID = window.location.hostname.split('.')[0];
                        /* s1_SCORE */ _SCORE = GM.Esiste(serverID+'_SCORE',[]);
                        /* s1_hs_ref */ refSCORE = GM.Esiste(serverID + '_hs_ref',null);
                        if(GM.Esiste('SAVE_SCORE',false)){xHTM.SalvaDatiClassifica();}
                        //Creo Menu Laterale - Gestione Inattivi [Script Originale by mitm]
                        xHTM.MenuCLSS();
                        //Caricamento MENU GESTIONE CLASSIFICHE (se nSCORE >0)
                        if(_SCORE.length > 0){xHTM.CompletaMenuCLSS();}
                        //Caricamento CLASSIFICA con confronto dati con hs_ref(SE ESISTENTE!)
                        if(refSCORE){xHTM.ConfrontaCLSS();}
                    }
                }
            }catch(e){
                console.error('[xCHANGE.SCORE()]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');console.error('  --------->  ' + e.message);
            }
        },
        CalcolaCR: function(){
            try{
                var ElencoRowCR = $('tr',$('table.main')[$('table.main').length-1]);
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
            }catch(e){
                console.log('[ xCHANGE.CalcolaCR() ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
                console.log('  --------->  ' + e.message);
            }
        }
    };
// =======================      GAME        =============================//
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
                            '   .Attivo {font-size:11pt;font-weight: bold;color:#00FF00 !important}' +
                            '   .SemiAttivo {font-size:11pt;font-weight: bold;color:#0062E1 !important}' +
                            '   .Decremento {font-size:11pt;font-weight: bold;background-color:yellow;color:red !important}' +
                            '   .Inattivo {font-size:11pt;font-weight: bold;color:orange !important}' +
                            '   .Ban {font-size:11pt;font-weight: bold;color:#FFE1DC !important}' +
                            '   .Vacanza {font-size:11pt;font-weight: bold;color:#82E0FF !important}' +
                            '   .Noob {font-size:11pt;font-weight: bold;color:yellow !important}'+
                            '   .NoSave {font-size:11pt;font-weight: bold;color:white !important}' +
                            '   .Famiglia {font-size:11pt;font-weight: bold;color:black !important}' +
                            '   .Io {font-size:11pt;font-weight: bold;color:white !important}');
            } catch (e) {
                console.log('## GAME.myCSS() ## --->' +e.name + ': ' + e.message);
            }
        },
        ACTION: function (name) {
            switch(name){
                case 'msg_read.php' : this.MESSAGGI(); break;
                case 'score.php' : this.CLASSIFICA(); break;
            }
        },
        MESSAGGI: function(){
            if(window.location.href.indexOf('o=3') != -1){xCHANGE.CalcolaCR();}
        },
        CLASSIFICA: function(){ xCHANGE.SCORE();}
    };
// =======================================================================================================================================================//
    try{
        GAME.myCSS();
        /* s1/s2 */ serverID = window.location.hostname.split('.')[0];
        //AGGIUNGE LINK A KBSIM DI RAVENC AL MENU DI GIOCO
        $('<tr><td><div style=\"text-align:center; display:inline;\"><a href=\"http://ravenc.lima-city.de/kbsim/sim/vendetta1923.it.php\" target=\"_blank\">Simulatore C.R.</a></td></tr>').insertAfter($('[href=\"unit.php\"]')[0].parentNode.parentNode); 
        var _INDEX = window.location.pathname.split('/game/')[1];
        GAME.ACTION(_INDEX);
    }catch(e){
        console.error('[ //* main *\\ ]  :  ' + e.name + '{ - Linea: ' + e.lineNumber + ' }\n');
        console.error('  --------->  ' + e.message);
    }
})();