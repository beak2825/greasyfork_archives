// ==UserScript==
// @name         Make ESET Downlable
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  permet le téléchargement des sources json ou stix d'ESET avec des boutons
// @author       Cyril D.
// @match        https://eti.eset.com/taxii/*
// @match        https://eti.eset.com/reports/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eset.com
// @grant        none
// @license      CYRILYXE
// @downloadURL https://update.greasyfork.org/scripts/460514/Make%20ESET%20Downlable.user.js
// @updateURL https://update.greasyfork.org/scripts/460514/Make%20ESET%20Downlable.meta.js
// ==/UserScript==

(function() {
    // TAXI STIX XML
        function downloadURI(item, uri, name) { //https://stackoverflow.com/questions/3916191/download-data-url-file
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            item.appendChild(link);
            link.click();
            item.removeChild(link);
            delete link;
        }
        function blockTitre(item){
            var indexVolume = 1;
            var returnValue;
            if(item.children.length > indexVolume){
                returnValue = ((item.children)[indexVolume]).innerText;
            }
            return returnValue;
        }
        function blockVolume(item){
            var indexVolume = 2;
            var returnValue;
            if(item.children.length > indexVolume){
                returnValue = ((item.children)[indexVolume]).innerHTML;
            }
            return parseInt(returnValue);
        }
        function blockDonwloadLink(item){
            var indexDLlink = 3;
            var innerHtml, domObject, returnValue;
            console.log(item);
            if(item.children.length > indexDLlink){
                innerHtml = (((item.children)[indexDLlink]).innerHTML);//.getAttribute("href");
                domObject = new DOMParser().parseFromString(innerHtml, "text/xml");
                returnValue = "https://" + window.location.hostname + (domObject.querySelector('a').getAttribute("href"));
            }
            return returnValue;
        }

        function showNewCustomRange(titreNewestDL){
            if(!titreNewestDL){
                alert("Pas de nouveau fichier à télécharger,\r\nSi de nouveaux rapports sont sortis,\r\n  - soit votre date ne couvre pas aujourd'hui,\r\n  - soit il n'y a pas encore de TAXII associé");
            }else{
                try{
                    var prefixe = titreNewestDL.substring(19,19+16);
                    var fromDate = new Date(prefixe);
                    var toDate = fromDate.setDate(fromDate.getDate() + 14);
                    var sufixe = (new Date(toDate)).toISOString().replace("T", " ").substring(0,16) ;
                    var customRange = prefixe+" - "+sufixe;
                    alert("Votre nouvelle custom range est \n"+customRange);
                }catch (error) {
                    console.error(error);
                    alert(error);
                }
            }
        }
        

        function DLall_taxii() {
            var item, itemVol, itemlnk, itemTitre;
            var tbody = document.querySelector('tbody');
            var lstTR = tbody.querySelectorAll('tr');
            var titreNewestDL = "";
            for(var i=0;i<lstTR.length;i++){
                item = lstTR[i];
                itemVol = blockVolume(item);
                if(itemVol){
                    itemTitre = blockTitre(item);
                    itemlnk = blockDonwloadLink(item);
                    if(itemlnk){
                        console.log(i+": "+itemTitre+"/"+itemVol+" = "+itemlnk);
                        if(!titreNewestDL){titreNewestDL = itemTitre;}
                        downloadURI(item, itemlnk, itemTitre)
                    }
                }
            }
            showNewCustomRange(titreNewestDL);
        }

        function addDLbutton(before, id, fctToCall, classToUse, btnText = "tout télécharger"){
            var btn = document.createElement("input");
            btn.id=id;
            btn.type="button";
            btn.value = btnText;
            btn.classList.add(classToUse) ;
            btn.addEventListener("click",fctToCall);
            document.getElementById(before).after(btn);
        }

        function getLast15days_string(){
            let d = new Date();
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
            let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
            var dateTo = `${ye}-${mo}-${da} 00:01`;

            d.setDate(d.getDate()-15);
            ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
            mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
            da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
            var dateFrom = `${ye}-${mo}-${da} 23:59`;
            var dateSearchString = dateFrom+" - "+dateTo;
            console.log(dateSearchString);
            return dateSearchString;
        }
        function ShowLast15days(){
            var dateSearchString = getLast15days_string();
            document.getElementById("daterange").value = dateSearchString;
            document.getElementById("date-submit").click();
        }
        function addShowLast15daysButton(id="", before="date-submit"){
            var btn = document.createElement("input");
            btn.type="button";
            btn.value = "Show Last 15 days";
            btn.classList.add("btn_blue") ;
            btn.addEventListener("click",ShowLast15days);
            document.getElementById(before).after(btn);
        }

        function main_TAXI(){
            var idItemBefore = "date-submit";
            var dllButtonID = "dllAll";
            addDLbutton(idItemBefore,dllButtonID, DLall_taxii, "btn_blue");
            addShowLast15daysButton(dllButtonID);
        }
    // REPORTS
        function main_REPORT(){
            var idItemBefore = "d_download";
            var dllButtonID = "dllAll";
            addDLbutton(idItemBefore,dllButtonID, DLall_reports, "btn_white", "Dl Next Lot");
            addDLbutton(idItemBefore,dllButtonID, DLsameLot_reports, "btn_white", "Dl SAME Lot");
        }
        function getCBs(fromItem){
            var item, cb;
            var lstCB = [];
            for(var i=0;i<fromItem.length;i++){
                //console.log(i);
                item = fromItem[i];
                cb = item.querySelector('input');
                if((cb.type).toLowerCase()==="checkbox"){lstCB.push(cb);}
            }
            return lstCB;
        }
        function selectAll(lstCB, from=0, to=0,checked = true){
            for(var i=from;i<Math.min(lstCB.length,to);i++){
                console.log(i+" : ");
                console.log(lstCB[i]);
                lstCB[i].click();
                lstCB[i].checked = checked;
                //console.log(lstCB[i]);
            }
        }
        var lot_from=0,lot_to=0
        function Dl_by_lot(lstCB, limitDDL_at_once, dlIDbutton = "d_download"){
            var from,to;
            // deselection
                selectAll(lstCB,lot_from,lot_to,false);
            lot_from = lot_to;
            lot_to = lot_to + limitDDL_at_once;
            // selection
                selectAll(lstCB,lot_from,lot_to,true);
            // telechargement
                document.getElementById(dlIDbutton).click();
        }
        function DLsameLot_reports() {
            var item, itemVol, itemlnk, itemTitre, cb;
            var classOfLines = "report"
            var fieldset = document.querySelector('fieldset');
            var lstDivRapport = fieldset.getElementsByClassName(classOfLines);
            var lstCB = getCBs(lstDivRapport);
                selectAll(lstCB,lot_from,lot_to,true);
            // telechargement
                document.getElementById("d_download").click();
        }
        function DLall_reports() {
            var item, itemVol, itemlnk, itemTitre, cb;
            var classOfLines = "report"
            var fieldset = document.querySelector('fieldset');
            var lstDivRapport = fieldset.getElementsByClassName(classOfLines);
            var limitDDL_at_once = 10;

            // recuperations des Checkbox de la page
            var lstCB = getCBs(lstDivRapport);
            //console.log(lstCB);

            // telechargement
            Dl_by_lot(lstCB, limitDDL_at_once);

        }


    // MAIN
    console.log("avant loaded");
    //window.addEventListener('load', function() {
        console.log("loaded");
        if((window.location.pathname).includes("report")){
            console.log("ddl reports");
            main_REPORT();
        }
        if((window.location.pathname).includes("taxii")){
            main_TAXI();
        }
    //}, false);
})();