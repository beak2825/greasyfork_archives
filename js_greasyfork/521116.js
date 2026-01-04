// ==UserScript==
// @name         Raumschüsse Fix für CaveRenderPro TEST
// @namespace    https://greasyfork.org/de/users/1246726-andreas-schuller
// @version      5.0
// @description  Berechnet die Richtung der Raumschüsse neu
// @author       Andreas Schuller
// @match        https://www.google.com/*
// @match        https://www.google.de/*
// @match        https://www.google.fr/*
// @match        https://www.google.com/?hl=en*
// @match        https://www.google.com/?hl=de*
// @match        https://www.google.com/?hl=fr*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521116/Raumsch%C3%BCsse%20Fix%20f%C3%BCr%20CaveRenderPro%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/521116/Raumsch%C3%BCsse%20Fix%20f%C3%BCr%20CaveRenderPro%20TEST.meta.js
// ==/UserScript==

function CRP_Hilfszuege_Fix(){

    function buttonAdd(parent, label, title, style, clickEvent){
        var elem = document.createElement('button');
        elem.type = 'button';
        elem.style = style;
        elem.style.zIndex = '99';
        elem.style.right = '15px';
        elem.style.background = 'LightGray';
        elem.style.position = 'absolute';
        elem.title = title;
        elem.innerHTML = label;
        parent.appendChild(elem);
        elem.addEventListener('click', clickEvent);
        return elem;
    }

    var pos_uno = document.querySelector('body');
    var searchText = document.createElement('textarea');
    searchText.style = 'position: absolute; display: none; top:100px; right: 0px; width: 100%; height: 500px; z-index: 99;';
    var resultText = document.createElement('textarea');
    resultText.style = 'position: absolute; display: none; top:100px; right: 0px; width: 100%; height: 500px; z-index: 99;';
    if (pos_uno){

        pos_uno.appendChild(searchText);
        pos_uno.appendChild(resultText);

        const btn_title_de = 'CaveRenderPro Raumschüsse';
        const btn_title_en = 'CaveRenderPro splays';
        const btn_onhover_de = 'Richtung neu berechnen';
        const btn_onhover_en = 'Recalculate direction';
        const btn_start_de = 'Neu Berechnen!';
        const btn_start_en = 'Recalculate!';
        const error_close_de = 'Schließen';
        const error_close_en = 'Close';
        const error_text_de = 'Fehler! Es scheint, dass CaveRenderPro beim Exportieren der Datei einen Fehler gemacht hat, denn die Datei enthält Messwerte aus mehr als einer Höhle. Bitte eine neue Export-Datei erstellen und nochmal versuchen.';
        const error_text_en = 'Error! It seems that CaveRenderPro made a mistake when exporting the file, because the file contains measurements from more than one cave. Please export a new file and try again.';
        if(window.location.href.indexOf('https://www.google.de/') !== -1 || window.location.href.indexOf('https://www.google.com/?hl=de') !== -1){
            var btn_title = btn_title_de;
            var btn_onhover = btn_onhover_de;
            var btn_start = btn_start_de;
            var error_close = error_close_de;
            var error_text = error_text_de;
        }else{
            btn_title = btn_title_en;
            btn_onhover = btn_onhover_en;
            btn_start = btn_start_en;
            error_close = error_close_en;
            error_text = error_text_en;
        }

        var search_btn = buttonAdd(pos_uno, btn_title, btn_onhover
                                   , 'top:70px; right: 0px', function(e){
            if (searchText.style.display === 'none' && resultText.style.display === 'none'){
                searchText.style.display='inline-block';
                search_btn.innerHTML = btn_start;
            }else if (searchText.style.display !== 'none' && resultText.style.display === 'none'){
                searchText.style.display='none';
                resultText.style.display='inline-block';
            }else if (searchText.style.display === 'none' && resultText.style.display !== 'none'){
                resultText.style.display='none';
                resultText.innerHTML='';
                searchText.innerHTML='';
                searchText.value='';
                resultText.value='';
                search_btn.innerHTML = btn_title;
            }
        })
        };

    searchText.addEventListener('change', function (){
        var currentdate = new Date().getTime();
        var searchInput = searchText.value.trim();
        if (searchInput !== ''){
            var searchInput_lines = searchInput.split(/\n/);
            const referenzHoehleArray = searchInput_lines[1].split(/\t/);
            const Hoehle_test = referenzHoehleArray[0];
            var searchInput_line_index = 0;
            var new_lines = [];
            var onlyStations = [];
            var stationRefGangArray = [];
            var stationRefPunktArray = [];
            var stationGangArray = [];
            var stationPunktArray = [];
            var station_ref_x_posArray = [];
            var station_ref_y_posArray = [];
            var station_ref_z_posArray = [];
            var station_x_posArray = [];
            var station_y_posArray = [];
            var station_z_posArray = [];
            var PunktArray = [];
            var GangArray = [];
            var RefPunktArray = [];
            var RefGangArray = [];
            var LaengeArray = [];
            var ref_x_posArray = [];
            var ref_y_posArray = [];
            var ref_z_posArray = [];
            var HoehleArray = [];
            var RichtungArray = [];
            var AzimutArray = [];
            var NewRichtungArray = [];

            for (var init_searchInput_line of searchInput_lines){
                var searchInput_datafields = init_searchInput_line.split(/\t/);
                var init_RefGang = searchInput_datafields[1];
                var init_RefPunkt = searchInput_datafields[2];
                var init_Gang = searchInput_datafields[3];
                var init_Punkt = searchInput_datafields[4];
                var init_Laenge = Number(searchInput_datafields[8].replace(',00', ''));
                var init_Hoehle = searchInput_datafields[0];
                var init_Azimut = Number(searchInput_datafields[9].replace(',', '.'));
                var init_Richtung = Number(searchInput_datafields[20].replace(',', '.'));
                var init_ref_x_pos = Number(searchInput_datafields[33].replace(',', '.'));
                var init_ref_y_pos = Number(searchInput_datafields[34].replace(',', '.'));
                var init_ref_z_pos = Number(searchInput_datafields[35].replace(',', '.'));
                var init_x_pos = Number(searchInput_datafields[36].replace(',', '.'));
                var init_y_pos = Number(searchInput_datafields[37].replace(',', '.'));
                var init_z_pos = Number(searchInput_datafields[38].replace(',', '.'));
                if (init_Punkt !== "" && init_Laenge !== 0 && (init_Richtung === 1|| init_Richtung === -1) && !(init_RefGang === init_Gang && init_RefPunkt === init_Punkt)){
                    onlyStations.push(init_searchInput_line);
                    stationRefGangArray.push(init_RefGang);
                    stationRefPunktArray.push(init_RefPunkt);
                    stationGangArray.push(init_Gang);
                    stationPunktArray.push(init_Punkt);
                    station_ref_x_posArray.push(init_ref_x_pos);
                    station_ref_y_posArray.push(init_ref_y_pos);
                    station_ref_z_posArray.push(init_ref_z_pos);
                    station_x_posArray.push(init_x_pos);
                    station_y_posArray.push(init_y_pos);
                    station_z_posArray.push(init_z_pos);
                }
                PunktArray.push(init_Punkt);
                GangArray.push(init_Gang);
                RefPunktArray.push(init_RefPunkt);
                RefGangArray.push(init_RefGang);
                LaengeArray.push(init_Laenge);
                HoehleArray.push(init_Hoehle);
                RichtungArray.push(init_Richtung);
                AzimutArray.push(init_Azimut);
                ref_x_posArray.push(init_ref_x_pos);
                ref_y_posArray.push(init_ref_y_pos);
                ref_z_posArray.push(init_ref_z_pos);
            }
            for (var searchInput_line of searchInput_lines){
                if(Hoehle_test !== HoehleArray[searchInput_line_index] && searchInput_line_index > 0){
                    resultText.value = error_text;
                    search_btn.innerHTML = error_close;
                    break;
                }
                var RefGang = RefGangArray[searchInput_line_index];
                var RefPunkt = RefPunktArray[searchInput_line_index];
                var Punkt = PunktArray[searchInput_line_index];
                var Azimut = AzimutArray[searchInput_line_index];
                var Richtung;
                var ref_x_pos = ref_x_posArray[searchInput_line_index];
                var ref_y_pos = ref_y_posArray[searchInput_line_index];
                var ref_z_pos = ref_z_posArray[searchInput_line_index];
                if (Punkt === ""){
                    var true_connections = [];
                    for (let i = 0; i < onlyStations.length; i++) {
                        if ((stationRefGangArray[i] === RefGang && stationRefPunktArray[i] === RefPunkt && Math.abs(ref_x_pos - station_ref_x_posArray[i]) < 1 && Math.abs(ref_y_pos - station_ref_y_posArray[i]) < 1 && Math.abs(ref_z_pos - station_ref_z_posArray[i]) < 1 )
                            || (stationGangArray[i] === RefGang && stationPunktArray[i] === RefPunkt && Math.abs(ref_x_pos - station_x_posArray[i]) < 1 && Math.abs(ref_y_pos - station_y_posArray[i]) < 1 && Math.abs(ref_z_pos - station_z_posArray[i]) < 1)){
                            true_connections.push(onlyStations[i]);
                        }
                    }
                    if(true_connections.length === 1){
                        var AzimutFinder = true_connections[0].split(/\t/);
                        var AzimutMesszug = Number(AzimutFinder[9].replace(',', '.'));
                        var RichtungMesszug = Number(AzimutFinder[20].replace(',', '.'));
                        var referenz_Messzug = AzimutMesszug;
                        var Richtung_ungerundet = Math.cos(degreeToRadians(referenz_Messzug - Azimut));
                        if(RichtungMesszug === 1){
                            Richtung = Math.round(Richtung_ungerundet*100)/100;
                        }
                        if(RichtungMesszug === -1){
                            Richtung = -(Math.round(Richtung_ungerundet*100)/100);
                        }
                    }
                    if(true_connections.length > 1){
                        var differenzen = [];
                        for (let i = 0; i < true_connections.length; i++) {
                            var searchInput_datafields6 = true_connections[i].split(/\t/);
                            var RefGang6 = searchInput_datafields6[1];
                            var RefPunkt6 = searchInput_datafields6[2];
                            var Gang6 = searchInput_datafields6[3];
                            var Punkt6 = searchInput_datafields6[4];
                            var Azimut6 = Number(searchInput_datafields6[9].replace(',', '.'));
                            if(RefGang6 === RefGang && RefPunkt6 === RefPunkt){
                                if(Azimut6 - 180 >= 0){
                                    var differenz_raw1 = Azimut6 - 180;
                                }else{
                                    differenz_raw1 = Azimut6 + 180;
                                }
                                var differenz_raw2 = Math.abs(differenz_raw1 - Azimut);
                                var differenz = Math.abs(differenz_raw2 - 180);
                            }
                            if(Gang6 === RefGang && Punkt6 === RefPunkt){
                                differenz_raw2 = Math.abs(Azimut6 - Azimut);
                                differenz = Math.abs(differenz_raw2 - 180);
                            }
                            differenzen.push(differenz);
                        }
                        var closest_match_index = differenzen.indexOf(Math.min.apply(null, differenzen));
                        var vorheriger_Messzug = true_connections[closest_match_index];

                        var searchInput_datafields8 = vorheriger_Messzug.split(/\t/);
                        var RefGang8 = searchInput_datafields8[1];
                        var RefPunkt8 = searchInput_datafields8[2];
                        var Gang8 = searchInput_datafields8[3];
                        var Punkt8 = searchInput_datafields8[4];
                        var Azimut8 = Number(searchInput_datafields8[9].replace(',', '.'));

                        var differenzen2 = [];
                        var potentiell_nachfolgende_MPs = [];
                        for (let i = 0; i < true_connections.length; i++) {
                            if(true_connections[i] !== vorheriger_Messzug){
                                var searchInput_datafields7 = true_connections[i].split(/\t/);
                                var RefGang7 = searchInput_datafields7[1];
                                var RefPunkt7 = searchInput_datafields7[2];
                                var Gang7 = searchInput_datafields7[3];
                                var Punkt7 = searchInput_datafields7[4];
                                var Azimut7 = Number(searchInput_datafields7[9].replace(',', '.'));

                                if(RefGang8 === RefGang && RefPunkt8 === RefPunkt){
                                    if (RefGang7 === RefGang && RefPunkt7 === RefPunkt){
                                        if(Azimut7 - 180 >= 0){
                                            var differenz_raw3 = Azimut7 - 180;
                                        }else{
                                            differenz_raw3 = Azimut7 + 180;
                                        }
                                        var differenz_raw4 = Math.abs(differenz_raw3 - Azimut8);
                                        var differenz2 = Math.abs(differenz_raw4 - 180);
                                    }
                                    if(Gang7 === RefGang && Punkt7 === RefPunkt){
                                        differenz_raw4 = Math.abs(Azimut8 - Azimut7);
                                        differenz2 = Math.abs(differenz_raw4 - 180);
                                    }
                                }
                                if(Gang8 === RefGang && Punkt8 === RefPunkt){
                                    if (RefGang7 === RefGang && RefPunkt7 === RefPunkt){
                                        differenz_raw4 = Math.abs(Azimut8 - Azimut7);
                                        differenz2 = Math.abs(differenz_raw4 - 180);
                                    }
                                    if(Gang7 === RefGang && Punkt7 === RefPunkt){
                                        if(Azimut7 - 180 >= 0){
                                            differenz_raw3 = Azimut7 - 180;
                                        }else{
                                            differenz_raw3 = Azimut7 + 180;
                                        }
                                        differenz_raw4 = Math.abs(differenz_raw3 - Azimut8);
                                        differenz2 = Math.abs(differenz_raw4 - 180);
                                    }
                                }
                                differenzen2.push(differenz2);
                                potentiell_nachfolgende_MPs.push(true_connections[i]);
                            }
                        }
                        var furthest_match_index = differenzen2.indexOf(Math.max.apply(null, differenzen2));
                        var nachfolgender_Messzug = potentiell_nachfolgende_MPs[furthest_match_index];

                        var vorheriger_Messzug_datafields = vorheriger_Messzug.split(/\t/);
                        var RefGang_vor = vorheriger_Messzug_datafields[1];
                        var RefPunkt_vor = vorheriger_Messzug_datafields[2];
                        var Gang_vor = vorheriger_Messzug_datafields[3];
                        var Punkt_vor = vorheriger_Messzug_datafields[4];
                        var Azimut_vor = Number(vorheriger_Messzug_datafields[9].replace(',', '.'));
                        var Richtung_vor = Number(vorheriger_Messzug_datafields[20].replace(',', '.'));

                        var nachfolgender_Messzug_datafields = nachfolgender_Messzug.split(/\t/);
                        var RefGang_nach = nachfolgender_Messzug_datafields[1];
                        var RefPunkt_nach = nachfolgender_Messzug_datafields[2];
                        var Gang_nach = nachfolgender_Messzug_datafields[3];
                        var Punkt_nach = nachfolgender_Messzug_datafields[4];
                        var Azimut_nach = Number(nachfolgender_Messzug_datafields[9].replace(',', '.'));
                        var Richtung_nach = Number(nachfolgender_Messzug_datafields[20].replace(',', '.'));
                        var SpalteL;
                        var Sonder_SpalteD;

                        function Standard_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL){
                            var SpalteE_raw = Math.abs(Azimut_vor_bereinigt - Azimut);
                            var SpalteE = Math.abs(SpalteE_raw - 180);
                            if (Azimut_nach_bereinigt - 180 >= 0){
                                var Azimut_nach_bereinigt2 = Azimut_nach_bereinigt - 180;
                            }else{
                                Azimut_nach_bereinigt2 = Azimut_nach_bereinigt + 180;
                            }
                            var SpalteG_raw = Math.abs(Azimut_nach_bereinigt2 - Azimut);
                            var SpalteG = Math.abs(SpalteG_raw - 180);
                            if(SpalteE === 0 || SpalteG === 0){
                                var SpalteK = 0;
                            }else if(SpalteE/SpalteG <= 1){
                                SpalteK = SpalteE/(SpalteE+SpalteG);
                            }else{
                                SpalteK = SpalteG/(SpalteE+SpalteG);
                            }
                            if(SpalteE < SpalteG){
                                SpalteL = SpalteK*Math.cos(degreeToRadians(Azimut_nach_bereinigt - Azimut))+(1 - SpalteK)*Math.cos(degreeToRadians(Azimut_vor_bereinigt - Azimut));
                            }else{
                                SpalteL = SpalteK*Math.cos(degreeToRadians(Azimut_vor_bereinigt - Azimut))+(1 - SpalteK)*Math.cos(degreeToRadians(Azimut_nach_bereinigt - Azimut));
                            }
                            return SpalteL;
                        }

                        function Sonderfall_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL, Sonder_SpalteD){
                            Sonder_SpalteD;
                            var Sonder_SpalteE_raw = Math.abs(Azimut_vor_bereinigt - Azimut_nach_bereinigt);
                            var Sonder_SpalteE_raw2 = Math.abs(Sonder_SpalteE_raw - 180);
                            var Sonder_SpalteE = Math.round(Sonder_SpalteE_raw2*100)/100;
                            var Sonder_SpalteH_raw = Math.abs(Azimut_vor_bereinigt - Azimut);
                            var Sonder_SpalteH_raw2 = Math.abs(Sonder_SpalteH_raw - 180);
                            var Sonder_SpalteH = Math.round(Sonder_SpalteH_raw2*100)/100;
                            var Sonder_SpalteI_raw2 = Math.abs(Azimut_nach_bereinigt - Azimut);
                            var Sonder_SpalteI_raw = Math.abs(Sonder_SpalteI_raw2 - 180);
                            var Sonder_SpalteI_raw3 = Math.abs(Sonder_SpalteI_raw - 180);
                            var Sonder_SpalteI = Math.round(Sonder_SpalteI_raw3*100)/100;
                            var Sonder_SpalteF_raw = 180 - Sonder_SpalteH;
                            var Sonder_SpalteF = Math.round(Sonder_SpalteF_raw*100)/100;
                            var Sonder_SpalteG_raw = 180 - Sonder_SpalteI;
                            var Sonder_SpalteG = Math.round(Sonder_SpalteG_raw*100)/100;
                            var Sonder_SpalteHplusI_raw = Sonder_SpalteH + Sonder_SpalteI;
                            var Sonder_SpalteHplusI = Math.round(Sonder_SpalteHplusI_raw*100)/100;
                            var Sonder_SpalteFplusG_raw = Sonder_SpalteF + Sonder_SpalteG;
                            var Sonder_SpalteFplusG = Math.round(Sonder_SpalteFplusG_raw*100)/100;//floating point errors are fun
                            if(Sonder_SpalteHplusI === Sonder_SpalteE && Sonder_SpalteD === -1){
                                var Sonder_SpalteJ = 1;
                            }else if(Sonder_SpalteHplusI === Sonder_SpalteE){
                                Sonder_SpalteJ = -1;
                            }else{
                                Sonder_SpalteJ = 0;
                            }
                            if(Sonder_SpalteFplusG === Sonder_SpalteE && Sonder_SpalteD === -1){
                                var Sonder_SpalteK = -1;
                            }else if(Sonder_SpalteFplusG === Sonder_SpalteE){
                                Sonder_SpalteK = 1;
                            }else{
                                Sonder_SpalteK = 0;
                            }
                            var Sonder_SpalteL = 180 - Sonder_SpalteE;
                            var Sonder_SpalteM = 180/Sonder_SpalteL;
                            if(Sonder_SpalteJ === 0 && Sonder_SpalteK === 0){
                                var Sonder_SpalteN_raw = Math.min(Sonder_SpalteF, Sonder_SpalteG, Sonder_SpalteH, Sonder_SpalteI);
                                var Sonder_SpalteN = Sonder_SpalteM*Sonder_SpalteN_raw;
                            }else{
                                Sonder_SpalteN = 0;
                            }
                            var Sonder_SpalteO = Math.cos(degreeToRadians(Sonder_SpalteN));
                            var Sonder_SpalteQ_raw = Math.min(Sonder_SpalteF, Sonder_SpalteG, Sonder_SpalteH, Sonder_SpalteI);
                            if(Sonder_SpalteF === Sonder_SpalteQ_raw || Sonder_SpalteG === Sonder_SpalteQ_raw){
                                var Sonder_SpalteQ = 1;
                            }else{
                                Sonder_SpalteQ = 0;
                            }
                            if(Sonder_SpalteD === 1 && Sonder_SpalteQ === 1){
                                var Sonder_SpalteP = Sonder_SpalteO;
                            }else if(Sonder_SpalteD === 1 && Sonder_SpalteQ === 0){
                                Sonder_SpalteP = -(Sonder_SpalteO);
                            }else if(Sonder_SpalteD === -1 && Sonder_SpalteQ === 1){
                                Sonder_SpalteP = -(Sonder_SpalteO);
                            }else{
                                Sonder_SpalteP = Sonder_SpalteO;
                            }
                            if(Sonder_SpalteJ === 0 && Sonder_SpalteK === 0){
                                if(Sonder_SpalteD === 1 && Sonder_SpalteQ === 1){
                                    var Sonder_SpalteR_raw = Sonder_SpalteO;
                                }else if(Sonder_SpalteD === 1 && Sonder_SpalteQ === 0){
                                    Sonder_SpalteR_raw = -(Sonder_SpalteO);
                                }else if(Sonder_SpalteD === -1 && Sonder_SpalteQ === 1){
                                    Sonder_SpalteR_raw = -(Sonder_SpalteO);
                                }else{
                                    Sonder_SpalteR_raw = Sonder_SpalteO;
                                }
                                var Sonder_SpalteR = Math.round(Sonder_SpalteR_raw*100)/100;
                            }else if (Sonder_SpalteJ === 0){
                                Sonder_SpalteR = Sonder_SpalteK;
                            }else{
                                Sonder_SpalteR = Sonder_SpalteJ;
                            }
                            var Sonder_SpalteS = (180 - Sonder_SpalteE)/90;
                            var Sonder_SpalteT_raw = Math.min(Sonder_SpalteH, Sonder_SpalteI);
                            var Sonder_SpalteT = Math.cos(degreeToRadians(Sonder_SpalteT_raw));
                            if(Sonder_SpalteD === 1){
                                var Sonder_SpalteU = -(Sonder_SpalteT);
                            }else{
                                Sonder_SpalteU = Sonder_SpalteT;
                            }
                            if(Sonder_SpalteL < 90){
                                var Sonder_SpalteV_raw = Sonder_SpalteS*Sonder_SpalteP + (1 - Sonder_SpalteS)*Sonder_SpalteU;
                            }else{
                                Sonder_SpalteV_raw = Sonder_SpalteP;
                            }
                            var Sonder_SpalteV = Math.round(Sonder_SpalteV_raw*100)/100;
                            SpalteL = Sonder_SpalteV;
                            return SpalteL;
                        }

                        if(RefGang_vor === RefGang && RefPunkt_vor === RefPunkt && Richtung_vor === -1){//Block1
                            if(Azimut_vor - 180 >= 0){
                                var Azimut_vor_bereinigt = Azimut_vor - 180;
                            }else{
                                Azimut_vor_bereinigt = Azimut_vor + 180;
                            }
                            if(RefGang_nach === RefGang && RefPunkt_nach === RefPunkt && Richtung_nach === 1){//Normalfall
                                var Azimut_nach_bereinigt = Azimut_nach;
                                SpalteL = Standard_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL);
                                Richtung = Math.round(SpalteL*100)/100;
                            }
                            if(RefGang_nach === RefGang && RefPunkt_nach === RefPunkt && Richtung_nach === -1){//Sonderfall
                                Azimut_nach_bereinigt = Azimut_nach;
                                Sonder_SpalteD = 1;
                                SpalteL = Sonderfall_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL, Sonder_SpalteD);
                                Richtung = SpalteL;
                            }
                            if(Gang_nach === RefGang && Punkt_nach === RefPunkt && Richtung_nach === 1){//Sonderfall
                                if(Azimut_nach - 180 >= 0){
                                    Azimut_nach_bereinigt = Azimut_nach - 180;
                                }else{
                                    Azimut_nach_bereinigt = Azimut_nach + 180;
                                }
                                Sonder_SpalteD = 1;
                                SpalteL = Sonderfall_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL, Sonder_SpalteD);
                                Richtung = SpalteL;
                            }
                            if(Gang_nach === RefGang && Punkt_nach === RefPunkt && Richtung_nach === -1){//Normalfall
                                if(Azimut_nach - 180 >= 0){
                                    Azimut_nach_bereinigt = Azimut_nach - 180;
                                }else{
                                    Azimut_nach_bereinigt = Azimut_nach + 180;
                                }
                                SpalteL = Standard_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL);
                                Richtung = Math.round(SpalteL*100)/100;
                            }
                        }
                        if(RefGang_vor === RefGang && RefPunkt_vor === RefPunkt && Richtung_vor === 1){//Block2
                            if(Azimut_vor - 180 >= 0){
                                Azimut_vor_bereinigt = Azimut_vor - 180;
                            }else{
                                Azimut_vor_bereinigt = Azimut_vor + 180;
                            }
                            if(RefGang_nach === RefGang && RefPunkt_nach === RefPunkt && Richtung_nach === 1){//Sonderfall
                                Azimut_nach_bereinigt = Azimut_nach;
                                Sonder_SpalteD = -1;
                                SpalteL = Sonderfall_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL, Sonder_SpalteD);
                                Richtung = SpalteL;
                            }
                            if(RefGang_nach === RefGang && RefPunkt_nach === RefPunkt && Richtung_nach === -1){//Normalfall
                                Azimut_nach_bereinigt = Azimut_nach;
                                SpalteL = Standard_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL);
                                Richtung = -(Math.round(SpalteL*100)/100);
                            }
                            if(Gang_nach === RefGang && Punkt_nach === RefPunkt && Richtung_nach === 1){//Normalfall
                                if(Azimut_nach - 180 >= 0){
                                    Azimut_nach_bereinigt = Azimut_nach - 180;
                                }else{
                                    Azimut_nach_bereinigt = Azimut_nach + 180;
                                }
                                SpalteL = Standard_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL);
                                Richtung = -(Math.round(SpalteL*100)/100);
                            }
                            if(Gang_nach === RefGang && Punkt_nach === RefPunkt && Richtung_nach === -1){//Sonderfall
                                if(Azimut_nach - 180 >= 0){
                                    Azimut_nach_bereinigt = Azimut_nach - 180;
                                }else{
                                    Azimut_nach_bereinigt = Azimut_nach + 180;
                                }
                                Sonder_SpalteD = -1;
                                SpalteL = Sonderfall_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL, Sonder_SpalteD);
                                Richtung = SpalteL;
                            }
                        }
                        if(Gang_vor === RefGang && Punkt_vor === RefPunkt && Richtung_vor === -1){//Block3
                            Azimut_vor_bereinigt = Azimut_vor;
                            if(RefGang_nach === RefGang && RefPunkt_nach === RefPunkt && Richtung_nach === 1){//Sonderfall
                                Azimut_nach_bereinigt = Azimut_nach;
                                Sonder_SpalteD = -1;
                                SpalteL = Sonderfall_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL, Sonder_SpalteD);
                                Richtung = SpalteL;
                            }
                            if(RefGang_nach === RefGang && RefPunkt_nach === RefPunkt && Richtung_nach === -1){//Normalfall
                                Azimut_nach_bereinigt = Azimut_nach;
                                SpalteL = Standard_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL);
                                Richtung = -(Math.round(SpalteL*100)/100);
                            }
                            if(Gang_nach === RefGang && Punkt_nach === RefPunkt && Richtung_nach === 1){//Normalfall
                                if(Azimut_nach - 180 >= 0){
                                    Azimut_nach_bereinigt = Azimut_nach - 180;
                                }else{
                                    Azimut_nach_bereinigt = Azimut_nach + 180;
                                }
                                SpalteL = Standard_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL);
                                Richtung = -(Math.round(SpalteL*100)/100);
                            }
                            if(Gang_nach === RefGang && Punkt_nach === RefPunkt && Richtung_nach === -1){//Sonderfall
                                if(Azimut_nach - 180 >= 0){
                                    Azimut_nach_bereinigt = Azimut_nach - 180;
                                }else{
                                    Azimut_nach_bereinigt = Azimut_nach + 180;
                                }
                                Sonder_SpalteD = -1;
                                SpalteL = Sonderfall_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL, Sonder_SpalteD);
                                Richtung = SpalteL;
                            }
                        }
                        if(Gang_vor === RefGang && Punkt_vor === RefPunkt && Richtung_vor === 1){//Block4
                            Azimut_vor_bereinigt = Azimut_vor;
                            if(RefGang_nach === RefGang && RefPunkt_nach === RefPunkt && Richtung_nach === 1){//Normalfall
                                Azimut_nach_bereinigt = Azimut_nach;
                                SpalteL = Standard_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL);
                                Richtung = Math.round(SpalteL*100)/100;
                            }
                            if(RefGang_nach === RefGang && RefPunkt_nach === RefPunkt && Richtung_nach === -1){//Sonderfall
                                Azimut_nach_bereinigt = Azimut_nach;
                                Sonder_SpalteD = 1;
                                SpalteL = Sonderfall_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL, Sonder_SpalteD);
                                Richtung = SpalteL;
                            }
                            if(Gang_nach === RefGang && Punkt_nach === RefPunkt && Richtung_nach === 1){//Sonderfall
                                if(Azimut_nach - 180 >= 0){
                                    Azimut_nach_bereinigt = Azimut_nach - 180;
                                }else{
                                    Azimut_nach_bereinigt = Azimut_nach + 180;
                                }
                                Sonder_SpalteD = 1;
                                SpalteL = Sonderfall_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL, Sonder_SpalteD);
                                Richtung = SpalteL;
                            }
                            if(Gang_nach === RefGang && Punkt_nach === RefPunkt && Richtung_nach === -1){//Normalfall
                                if(Azimut_nach - 180 >= 0){
                                    Azimut_nach_bereinigt = Azimut_nach - 180;
                                }else{
                                    Azimut_nach_bereinigt = Azimut_nach + 180;
                                }
                                SpalteL = Standard_Formel (Azimut_vor_bereinigt, Azimut_nach_bereinigt, Azimut, SpalteL);
                                Richtung = Math.round(SpalteL*100)/100;
                            }
                        }
                    }
                    NewRichtungArray.push(Richtung.toString().replace('.', ','));
                }
                searchInput_line_index = searchInput_line_index + 1;
            }
            var new_array_counter = 0;
            for (var final_searchInput_line of searchInput_lines){
                var final_searchInput_datafields = final_searchInput_line.split(/\t/);
                var final_Punkt = final_searchInput_datafields[4];
                if (final_Punkt === ""){
                    final_searchInput_datafields[20] = NewRichtungArray[new_array_counter];
                    new_array_counter++;
                }
                var newline = final_searchInput_datafields.join('\t');
                new_lines.push(newline);
            }
            if(resultText.value !== error_text){
                var new_document = new_lines.join('\n');
                resultText.value = new_document;
                var currentdate2 = new Date().getTime();
                var rechen_zeit = (currentdate2-currentdate)/1000;
                const time_text1_de = 'Erfolg! ';
                const time_text2_de = ' Messungen in ';
                const time_text3_de = ' Sekunden (Schließen)';
                const time_text1_en = 'Success! ';
                const time_text2_en = ' measurements in ';
                const time_text3_en = ' seconds (close)';
                if(window.location.href.indexOf('https://www.google.de/') !== -1 || window.location.href.indexOf('https://www.google.com/?hl=de') !== -1){
                    var time_text1 = time_text1_de;
                    var time_text2 = time_text2_de;
                    var time_text3 = time_text3_de;
                }else{
                    time_text1 = time_text1_en;
                    time_text2 = time_text2_en;
                    time_text3 = time_text3_en;
                }
                search_btn.innerHTML = time_text1 + (searchInput_line_index - 1) + time_text2 + rechen_zeit + time_text3;
            }
        }});
    function degreeToRadians($degree)
    {
        return $degree * Math.PI / 180;
    }
}
CRP_Hilfszuege_Fix();