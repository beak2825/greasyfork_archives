// ==UserScript==
// @name         Shodan _ inihibition liens externes
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Ce script désactive les liens vers l'exterieur (mais affiche l'url)
// @author       cyril Delanoy
// @match        https://www.shodan.io/host/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shodan.io
// @grant        none
// @require       https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/470347/Shodan%20_%20inihibition%20liens%20externes.user.js
// @updateURL https://update.greasyfork.org/scripts/470347/Shodan%20_%20inihibition%20liens%20externes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // l'idée de manoeuvre est de rechercher les liens classe "link" pour les transformer en span avec le lien en texte, pour eviter les erreurs de secops
    // je suis passé par une boucle avec un nombre de tentative ratée car pour une raison inconnue, malgré le chargement des liens,
    //    et une boucle itérrative, des objets DOM devenait innaccessibles et un nouveau le remplaçait, en utilisant que le premier,
    //    aucune erreur pour le moment
    // Deuxième partie du script : permet le telechargement des contenus de chaque port avec horodatage


    // BLOC 0 : fonctions génériques
    // fonction qui genere le timbre temps pour les noms de fichier
    function getTimeStamp(){
        var currentdate = new Date();
        var TS = "(" +
        + currentdate.getFullYear()+"."
        + (currentdate.getMonth()+1)+"."
        + currentdate.getDate() + " @ "
        + currentdate.getHours() + "h"
        + currentdate.getMinutes() + "m"
        + currentdate.getSeconds() + "s"
        +")";
        return TS;
    }
    // fonction qui retourne la classe à utiliser pour les boutons custom de telechargement de contenu
    function btnCustomClass(){return "DAY_BTN_DL_PORT_CONTENT";}



    // BLOC 1 : Casser les liens
    // fonction qui supprime le lien clickable et en affiche le contenu
    function transformFirstLink(failedAttempt){
        var listOfLink = document.getElementsByClassName("link");
        var item, newItem, txtItem ;

        //console.log(listOfLink)
        if(listOfLink.length){
            item = listOfLink[0];
            //console.log("transformation de ");
            //console.log(item);
            newItem = document.createElement('span');
            newItem.class = item.class
            txtItem = document.createElement('span');
            txtItem.innerText = "link : "+item.href
            newItem.insertBefore(txtItem, newItem.firstChild)
            item.parentNode.replaceChild(newItem, item);
            failedAttempt = 0;
        }else{
            failedAttempt = failedAttempt+1;
        }
        return failedAttempt;
    }

    var failedAttempt = 0;
    var maxFailedAttempt = 10;
    // tentative de récupération des objets titre de port pour remplacer le lien clickable en son contenu (10 tentatives par port)
    while(failedAttempt<maxFailedAttempt){
        failedAttempt = transformFirstLink(failedAttempt);
    }



    // BLOC 2 : telecharger les cartouches

    // fonction qui ajoute l'action de telecharger tous les blocs (en cliquant sur chaque bouton precedement créé)
    function makeDownloadAllAction(btnID, btnClassTarget = btnCustomClass()){
        $(document).delegate("#"+btnID, "click",async function(){
            var btns = document.getElementsByClassName(btnClassTarget);
            var btn ;

            for(var i=0;i<btns.length;i++){
                btn = btns[i];
                btn.click();
                console.log(btn.id+" clicked");
            }
        });

    }

    // fonction pour creer le bouton de telechargement
    function makeDownloadBTN(before, id, withClass=true){
        var newItem ;

        //console.log("ajout du bouton a :");
        //console.log(before);

        newItem = document.createElement('button');
        newItem.id = id;
        newItem.type = 'button'
        if(withClass){
            newItem.className = btnCustomClass();
        }
        newItem.innerText = "Dl as txt";

        before.insertBefore(newItem, before.firstChild);
    }

    // fonction pour creer l'action de click
    function makeDownloadAction(btnID, targetID, filePrefixe="", hashContent="", ts=""){
        $(document).delegate("#"+btnID, "click",async function(){
            var content = document.getElementById(targetID).innerText
            var timeStampTitle, hashContentTitle="";
            var separator = '_-_';
            //console.log("dl "+content);
            // ajout des différentes information dans le titre
            // TimeStamp (celui connu, ou le moment de telechargement)
            if(ts){
                timeStampTitle = separator+ts;
            }else{
                timeStampTitle = separator+getTimeStamp();
            }
            // le Hash du contenu
            if(hashContent){
                hashContentTitle = separator+"hash="+hashContent;
            }
            var filename = filePrefixe+targetID+hashContentTitle+timeStampTitle+'.txt';
            var a = window.document.createElement('a');
            a.href = window.URL.createObjectURL(new Blob([content], {type: 'text/plain'}));
            a.download = filename;
            document.body.appendChild(a);
            // téléchargement.
            a.click();
            document.body.removeChild(a);
        });
    }

    // fonction qui récupère le lien de recherche du hash du contenu
    function getBoxHashQuery(boxItem){
        var returnValue="";
        try{
            returnValue = boxItem.querySelector('a').href;
        }catch{}
        return returnValue;
    }

    // fonction qui récupère le hash du contenu
    function getBoxHash(boxItem){
        var returnValue="";
        try{
            returnValue = boxItem.querySelector('a').innerText;
        }catch{}
        return returnValue;
    }

    // fonction qui récupère le TimeStamp du contenu
    function getBoxTimeStamp(boxItem){
        var returnValue = "";
        try{
            var preTxt = boxItem.querySelector('pre').innerText;
            var hashtxt = getBoxHash(boxItem)
            returnValue = preTxt.replace(hashtxt,'');
            returnValue = returnValue.replace('|','');
            returnValue = returnValue.replace(/\s/g,'');
            returnValue = returnValue.replace(":",':'); // les : separent les heures et minutes, mais ne seront pas saufegardés sur windows
        }catch{}
        return returnValue;
    }

    function logFormat_for_listPorts(port, TS, hash, queryHash, isHeader=false){
        var returnValue = "";
        var separateur = "\t";
        var finDeLigne = "\n";
        var searchedIP = document.getElementById('host-title').innerText;

        if(isHeader){
            returnValue = "searchedIP"+separateur+"port"+separateur+"TS"+separateur+"hash"+separateur+"queryHash"+finDeLigne
        }else{
            returnValue = searchedIP+separateur+port+separateur+TS+separateur+hash+separateur+queryHash+finDeLigne
        }
        return returnValue;
    }

    // fonction qui ajoute les boutons et les actions associees
    function downloadBox(domItem, domTitle, filePrefix="", indice=0){
        var objectID, title, btnID;

        title = domTitle.innerText;
        btnID = "dayBTN_"+indice;
        makeDownloadBTN(domTitle, btnID);

        if(domItem.id){
            objectID = domItem.id;
        }else if(domTitle.id){
            objectID = "port_"+domTitle.id ;
            domItem.id = objectID;
        }else{
            objectID = "dayContent_"+indice;
            domItem.id = objectID;
        }
        var hash = getBoxHash(domTitle);
        var TS = getBoxTimeStamp(domTitle);
        var queryHash = getBoxHashQuery(domTitle);
        makeDownloadAction(btnID, objectID, filePrefix, hash, TS);

        var returnValue = logFormat_for_listPorts(domTitle.id, TS, hash, queryHash);
        //console.log(title);
        //console.log(domItem.innerText);
        return returnValue;
    }

    // fonction qui parcours les boites et titre pour y ajouter les boutons et les actions associees
    function makeAllDownloadable(domDiv, filePrefix=""){
        var listOfTitles = domDiv.getElementsByClassName("grid-heading");
        var listOfBox = domDiv.getElementsByClassName("card card-padding banner");
        var boxItem, boxTitle;
        var listToLog = logFormat_for_listPorts("", "", "", "",true);

        for(var i=0;i<listOfTitles.length && i<listOfBox.length;i++){
            boxItem = listOfBox[i];
            boxTitle = listOfTitles[i]

            listToLog+=downloadBox(boxItem, boxTitle, filePrefix, i);
        }
        console.log(listToLog);
    }


    // récupération de la div contenant les boites de port ; puis creation des boutons de telechagement
    var listOfMainDivs = document.getElementsByClassName("six columns");
    var filePrefix = document.getElementById('host-title').innerText;
    if(listOfMainDivs.length>0){
        makeAllDownloadable(listOfMainDivs[1],filePrefix+"_-_");
    }

    // bouton pour tout telecharger
    var headerPortBox = document.getElementsByClassName("card card-light-blue card-padding");
    var headerPortBoxDom;
    var btnDlAllID = "DAY_BTN_DL_ALL";
    if(headerPortBox.length>0){
        headerPortBoxDom=headerPortBox[0];
        makeDownloadBTN(headerPortBoxDom, btnDlAllID, false);
        makeDownloadAllAction(btnDlAllID);
    }



})();